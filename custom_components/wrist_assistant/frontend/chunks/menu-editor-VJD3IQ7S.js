import{a as He,g as Ae,h as It}from"./chunk-RUZTQMS7.js";import{d as hs,e as q,f as Et,g as Ht,h as Ee,i as ps,j as ms}from"./chunk-Z52GC7I4.js";import{L as fs,M as gs,N as ws,a as Hi,b as gt,e as Ai,i as Oi,j as Ii,la as xs,ma as Ss,na as Ot,oa as ks}from"./chunk-IOJIKNHC.js";import{o as ui,p as dt,q as le,r as lt,s as ut,w as mi,x as fi,y as gi,z as wi}from"./chunk-YBXTPCVB.js";import{b as Ln,c as Qe,d as Dn,e as et,f as Wn}from"./chunk-ZOJGMATP.js";import{$ as me,A as T,B as Me,C as Te,D as V,E as xt,F as ji,G as Ki,H as St,I as zi,J as Ji,K as Yi,L as kt,M as Gi,N as Zi,O as $t,P as Mt,Q as Xi,R as Qi,S as es,T as ts,U as Tt,V as Rt,W as ns,X as Pt,Y as is,Z as Re,_ as ss,a as ue,aa as rs,ba as os,ca as Pe,d as Se,da as te,e as wt,ea as Ce,fa as ne,g as yt,ga as as,h as Di,ha as cs,i as Y,ia as ds,j as ee,k as Wi,ka as ls,l as S,la as Ct,m as he,ma as us,n as _i,o as ke,p as Ni,q as bt,r as vt,s as Vi,t as qi,u as pe,v as Ui,w as $e,x as Bi,y as Fi,z as I}from"./chunk-PSSYGLHG.js";import{a as $s,b as Ms,c as Ts,d as Rs,e as Ps,f as Cs,g as Es}from"./chunk-FMEYBIGP.js";import{Pa as Mi,Qa as ft,Ra as Ti,Sa as Ri,Ta as Pi,Ua as Ci,b as bi,c as vi,cb as xe,d as xi,db as Ei,j as Si,m as ki,o as mt,p as $i,xb as Li}from"./chunk-XDMMZFSQ.js";import{Ib as ys,Jb as bs,Kb as vs,Mb as At,sa as yi}from"./chunk-UDRG2OIJ.js";import{a as st,b as rt,c as Zn,d as Xn,e as Qn,f as ei,g as ti,h as ni,i as ii,j as hi,k as pi}from"./chunk-3HTFAJNJ.js";import{b as Yn,p as Gn,w as ai}from"./chunk-5P7E74KS.js";import{a as si,b as ri,d as oi}from"./chunk-QUOL6HJ4.js";import{$b as be,$c as Is,Ab as qn,Bb as Un,Cb as Bn,Ib as Fn,Jb as jn,Kb as Kn,Lb as zn,Mb as Jn,Nb as N,Ob as O,Pb as de,Q as tt,Rb as H,Sb as Q,V as nt,Xa as Vn,Yc as Hs,Zb as it,Zc as As,_c as Os,fe as Ls,h as fn,na as Nn,s as _n}from"./chunk-4PSROSNR.js";import{Ag as Ze,Bg as ln,Cg as un,Dg as hn,Eg as pn,Fg as mn,_h as Mn,b as X,c,cg as dn,d as W,dh as E,eh as x,f as h,hj as En,i as cn,ih as gn,ii as Tn,j as $,ji as we,jj as Hn,k as b,kh as wn,kj as An,lh as yn,lj as On,mh as bn,mi as Rn,nh as vn,ni as Pn,oh as xn,oi as Xe,ph as Sn,pi as Cn,qh as kn,yg as A,zh as $n}from"./chunk-RYLMRUWW.js";import{f as pt}from"./chunk-WIDK423N.js";import{Q as ht,j as J,l as ot,m as ci,n as ve,o as at,p as di,q as ct,r as li}from"./chunk-Y5WD6GQY.js";import{a as ye,b as In}from"./chunk-KXSD4G27.js";import{a as g}from"./chunk-LO2NM3CE.js";var Wt="In the page switcher",eo=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],_t="switcher-settings",Ds=`${_t}:resetDot`;function Ws(e){return Ei(e,eo,n=>{let t=xe(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function _s(e){let n=xe(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function Nt(e,n){return`${_t}:typed:${e.pageId.toUpperCase()}:${n}`}function Lt(e,n){let t=e.uiState.get(Nt(e,n));return typeof t=="string"?t:void 0}function to(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function no(e){let n=to(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...e.uiState.keys()])i.startsWith(`${_t}:typed:`)&&(t===void 0||i!==Nt(e,t))&&e.uiState.delete(i)}function ie(e,n,t=!1){let i=e.uiState.delete(Ds);e.busy||e.edit(n,t&&!i?{typing:!0}:void 0)}function Dt(e,n,t){let i=Nt(e,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&e.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(Ds,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&e.endCoalesce(),d.type==="checkbox"&&(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function Ns(e){no(e);let n=e.page,t=xe(n),i=t.switcherDisplayMode??"text",s=Mi.map(d=>[d,d==="icon"?"Icon":"Name"]),r=typeof n.name=="string"?n.name:"",o=d=>ie(e,l=>ft(l,e.pageId,d)),a=d=>ie(e,l=>Ti(l,e.pageId,d),!0);return c`
    ${H("Hidden",t.hideFromSwitcher,d=>ie(e,l=>Ci(l,e.pageId,d)),!1)}
    ${t.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:h}
    ${O("Show as",s.some(([d])=>d===i)?i:"text",s,d=>ie(e,l=>Pi(l,e.pageId,d)))}
    ${Dt(e,"switcherText",zn("Name",Lt(e,"switcherText")??t.switcherText??"",d=>ie(e,l=>Ri(l,e.pageId,d),!0),{placeholder:r}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>ie(e,d=>ft(d,e.pageId,""))}>Automatic icon</button>
    </div>
    ${Dt(e,"switcherIcon",be({icons:e.icons,symbols:e.symbols},Lt(e,"switcherIcon")??t.switcherIcon??"",o,"sw:switcher-icon",{emptyText:"Picked by the watch",tint:t.switcherColor}))}
    ${Dt(e,"switcherColor",c`<div class="ts-no-alpha">${Q("Color",Lt(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var U=He.routing;function Vt(e){return U.actions.find(n=>n.action===e)}function B(e){return Vt(e)?.keys??[]}function L(e){return Object.hasOwn(U.keys,e)?U.keys[e]:void 0}function re(e){return J(e.voiceConfig)?e.voiceConfig:{}}function io(e,n){let t=U.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function F(e,n){let t=L(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=U.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?io(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,r]=t.clamp??[-1/0,1/0];return Math.min(r,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function qs(e,n){let t=L(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=F(e,i[1]),r=i[3].split(/\s+or\s+/).map(a=>a.trim()),o=typeof s=="string"&&r.includes(s);return i[2]===void 0?o:!o}function Oe(e,n){let t=L(n);if(t?.type!=="enum")return[];let i=U.labels[t.enum??""]??{},s=U.offered[n]??U.enums[t.enum??""]??[],r=F(e,n);return(typeof r=="string"&&!s.includes(r)?[r,...s]:s).map(a=>[a,i[a]??a])}function Us(e){return L(e)?.label??so[e]??e}var so={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function qt(e,n,t){let i=L(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!Oe(e,n).some(([o])=>o===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[o,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(o,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let o=(t??"").trim();if(o==="")return It(e,n);s=o;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let o=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(o.length===0)return It(e,n);s=o;break}}return(Object.hasOwn(e,n)?ht(e[n],s):ht(F(e,n),s))?e:Ae(e,n,s)}function Bs(e,n,t,i){let s=F(e,n),r=Array.isArray(s)?s:[];return i===r.includes(t)?e:qt(e,n,i?[...r,t]:r.filter(o=>o!==t))}function ro(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function oo(e,n){let t=L(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",r=F(e,s);return typeof r=="string"&&i.includes(r)}function Ut(e,n,t,i){let s=L(n);if(s===void 0)return"None";if(!oo(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let r=ro(s,t);return typeof r=="string"&&r.trim()!==""?`Default (${i(r.trim())})`:Array.isArray(r)&&r.length>0?`Default (${r.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Vs(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function se(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function Ie(e,n,t){let i=Vs(n),s=Vs(t);return e.filter(r=>!se(i,r)&&(s.length===0||se(s,r)))}function ao(e,n){return{hiddenPhraseIds:e.filter(t=>!se(n,t)),knownPhraseIds:e.slice()}}function Fs(e,n,t,i){if(!se(n,t))return e;let s=Ie(n,e.hiddenPhraseIds,e.knownPhraseIds);if(se(s,t)===i)return e;let r=i?n.filter(a=>se(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),o=ao(n,r);return Ae(Ae(e,"hiddenPhraseIds",o.hiddenPhraseIds),"knownPhraseIds",o.knownPhraseIds)}function js(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function co(e,n,t,i,s){return Me(e,n,t,r=>{if(!B(S(r)).includes(i))return r;let o=re(r),a=qt(o,i,s);return a===o?r:yt(r,"voiceConfig",a)})}function lo(e,n,t,i,s,r){return Me(e,n,t,o=>{if(!B(S(o)).includes(i))return o;let a=re(o),d=Bs(a,i,s,r);return d===a?o:yt(o,"voiceConfig",d)})}function uo(e,n,t,i,s,r){return Me(e,n,t,o=>S(o)==="ttsMenu"?Fs(o,i,s,r):o)}function Ks(e){return Object.keys(re(e)).some(n=>B(S(e)).includes(n))}function zs(e){let n=S(e);return B(n).length>0||n==="ttsMenu"}function Js(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function ho(e,n,t,i){let s=vs(e.hass.states),r=At(s,t),o=a=>H(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${r.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:r.map(o)}
    </div>`}function po(e,n,t,i){let s=L(t),r=js(e.voice?.defaults),o=s?.domain==="conversation"?ys(e.hass.states):bs(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=At(o,i===""?[]:[i]);return[["",Ut(n,t,r,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??Js(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function mo(e,n,t,i,s){let r=L(s);if(r===void 0||!qs(i,s))return h;let o=Us(s),a=F(i,s),d=(l,u)=>e.edit(p=>co(p,n,t,s,l),u);switch(r.type){case"enum":return N(o,String(a),Oe(i,s),l=>d(l),{snapBack:!0,def:String(r.default)});case"bool":return H(o,a===!0,l=>d(l),r.default);case"int":{let l=typeof a=="number"?a:Number(r.default),u=He.volume,[p,w]=r.clamp??[u.min,u.max];return c`${de(o,l,m=>d(m,`slot:${t}:${s}`),{min:p,max:w,step:u.step,def:Number(r.default),format:m=>`${Math.round(m)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(m=>c`<button type="button" class="pe-chip ${m.value===l?"on":""}"
          aria-pressed=${m.value===l?"true":"false"} @click=${()=>d(m.value)}>${m.label} ${m.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return N(o,l,po(e,i,s,l),u=>d(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=js(e.voice?.defaults),p=r.whenBlank!==void 0?`None picked: ${r.whenBlank}.`:r.fallsBackTo!==void 0?`None picked: ${Ut(i,s,u,w=>Js(e.hass,w))}.`:"None picked.";return c`${ho(e,o,l,(w,m)=>e.edit(y=>lo(y,n,t,s,w,m)))}
        <div class="hint ${l.length===0&&r.fallsBackTo===void 0&&r.whenBlank===void 0?"warn":""}">${l.length===0?p:`${l.length} picked.`}</div>`}}}function fo(e,n,t){let i=typeof t.id=="string"?t.id:"",s=re(t),r=B(S(t));return c`${e.voice?.defaults===void 0?c`<div class="hint">${ks}.</div>`:h}
    ${r.map(o=>mo(e,n,i,s,o))}`}function go(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let r=s.map(u=>u.id),o=Ie(r,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],d=a.length>0&&r.some(u=>!a.some(p=>p.toUpperCase()===u.toUpperCase())),l=u=>o.some(p=>p.toUpperCase()===u.toUpperCase());return c`<div class="me-sub-h">${Vt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>H(u.name,l(u.id),p=>e.edit(w=>uo(w,n,i,r,u.id,p))))}
    </div>
    <div class="hint">${o.length===0?"No phrase shows: the list on the watch is empty.":`${o.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:h}`}function Ys(e,n,t){let i=S(t);if(i==="ttsMenu")return go(e,n,t);if(B(i).length>0)return fo(e,n,t)}function Gs(e,n){let t=S(n);if(t==="ttsMenu"){let o=e.voice?.phrases;return o===void 0?"":`${Ie(o.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${o.length} phrases`}let i=re(n),s=B(t)[0];if(s===void 0)return"";let r=F(i,s);return Oe(i,s).find(([o])=>o===r)?.[1]??""}function er(e,n,t,i,s,r,o=""){return c`<div class="mi-look">
    <div class="mi-look-title">${Fn(e,n,t,d=>r(d),d=>i.find(([l])=>l===d)?.[1]??d)}</div>
    <div class="mi-pics ${o}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([d,l])=>{let u=d===n;return c`<button type="button" class="mi-pic ${u?"on":""}" aria-pressed=${u?"true":"false"} aria-label=${`${e}: ${l}`}
          @click=${()=>{d!==n&&r(d)}}>${s(d)}<span class="mi-pic-name">${l}</span></button>`})}
    </div>
  </div>`}function We(e,n,t,i,s){return c`<div class="mi-switch">${H(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function wo(e){return c`<div class="mi-wrap">${e}</div>`}function _e(e,n){return Pe(e).find(t=>t.key===n)}function Bt(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function Ne(e,n,t){return Pe(n).some(i=>t.includes(i.key)&&Ce(e,n,i)&&!Bt(te(e,n,i),i.default))}function Le(e,n,t){let i=_e(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:te(e.document,n,i),set:(r,o=!1)=>e.edit(a=>as(a,n,t,r),o?s:void 0)}}function Ft(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function Ve(e,n){return n===void 0?h:de(e,Ft(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function Zs(e,n,t,i){if(n===void 0)return h;let s=n.value===!0?"on":"off",r=n.field.default===!0?"on":"off";return er(e,s,r,[["off",t[0]],["on",t[1]]],o=>i(o==="on"),o=>n.set(o==="on"))}var tr=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],nr=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],Xs=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function yo(e){return c`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function bo(e){return c`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function vo(e){if(e===void 0)return h;let n=Ft(e),t=(e.field.presets??Xs.map(([s,r])=>({value:s,label:r}))).map(s=>[String(s.value),Xs.find(([r])=>Bt(r,s.value))?.[1]??s.label]),i=t.find(([s])=>Bt(Number(s),n))?.[0]??"";return c`${O("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${Ve("Exact",e)}`}function ir(e){let n=i=>Le(e,"quickAction",i),t=n("showContextLabel");return c`
    ${Zs("Behind the ring",n("showIconBubble"),["Solid","Glass"],yo)}
    ${vo(n("backgroundDim"))}
    ${Zs("Buttons",n("showNeonOutline"),["Plain","Neon"],bo)}
    ${t===void 0?h:We("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${Ve("Glow",n("glowIntensity"))}`}function sr(e){let n=t=>{let i=_e("quickAction",t);return i===void 0?void 0:te(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function xo(){let e=ne("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function So(e){let n=W``;switch(e){case"sectorWedge":n=W`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=W`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=W`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=W`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=W`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function ko(e,n){if(n===void 0||!Ce(e.document,"quickAction",n.field))return h;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${Q("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?h:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let r=s.toUpperCase()===t.toUpperCase();return c`<button type="button" class="ts-swatch ${r?"on":""}" aria-pressed=${r?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function rr(e){let n=o=>Le(e,"quickAction",o),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),r=n("showFingerShadow");return c`
    ${t===void 0?h:wo(O("Opening",String(t.value),ne("EntranceStyle"),o=>t.set(o),{def:String(t.field.default)}))}
    ${i===void 0?h:er("Beam from your finger to the slot",String(i.value),String(i.field.default),xo(),So,o=>i.set(o),"beams")}
    ${ko(e,n("beamColor"))}
    ${s===void 0||!Ce(e.document,"quickAction",s.field)?h:Ve("Beam strength",s)}
    ${r===void 0?h:We("Finger shadow",r.value===!0,o=>r.set(o),r.field.default===!0,"A soft dark spot where your finger rests.")}`}function or(e){let n=s=>{let r=_e("quickAction",s);return r===void 0?"":String(te(e,"quickAction",r))},t=(s,r)=>ne(s).find(([o])=>o===r)?.[1]??r,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var ar=["glowIntensity","selectedScale"];function oe(e){return Math.round(e*1e3)/10}function cr(e){let n=Le(e,"pageSwitcher","glowIntensity"),t=Le(e,"pageSwitcher","selectedScale");return c`${Ve("Glow",n)}
    ${t===void 0?h:de("Picked page size",oe(Ft(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:oe(t.field.min??1),max:oe(t.field.max??1.5),step:oe(t.field.step??.05),def:oe(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function dr(e){let n=_e("pageSwitcher","selectedScale"),t=n===void 0?void 0:te(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(oe(t))}%`:""}function De(e,n,t,i){return e.render(n,t,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var lr=["light","switch","lock","cover","climate","media_player"],$o={media_player:"Media player"};function ur(e,n,t,i,s){let r=t.some(a=>a.domain===n),o=r?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let d=a.domain===n,l=$o[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${d?"on":""}" aria-pressed=${d?"true":"false"} data-type=${a.domain}
          @click=${()=>{d||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${De(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${l}</span></button>`})}
    </div>
    ${N("More types",r?"":n,o,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function hr(e,n,t,i){return c`<div class="mi-acts">${t.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(r=>{let o=r.raw===n,a=!o&&r.why!==void 0;return c`<button type="button" class="mi-act ${o?"on":""}" aria-pressed=${o?"true":"false"} ?disabled=${a} data-action=${r.raw}
        title=${r.why??h} @click=${()=>{o||i(r.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${De(e,r.icon,14,r.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${r.label}</span>${r.pro?c`<span class="mi-pro" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:h}
          ${r.why===void 0||o?h:c`<small class="mi-act-why">${r.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var Mo=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function Qs(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function pr(e,n,t,i){let s=new Map(t.map(o=>[o.position,o])),r=o=>{if(o===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(o);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let d=a.here?"here":a.holder===void 0?"free":"held",l=a.here?De(e,n.icon,14,n.color):a.holder===void 0?x("plus"):De(e,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${d}" data-place=${o} aria-label=${Qs(a)} title=${Qs(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:h}
      @click=${()=>{a.here||i(o)}}>${l}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${Mo.map(o=>o.map(r))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var mr=X`
  /* The menu inspector's lines read upright, as plain text: the shared card
     sets shown help in italic, so this matches its selector and follows it. */
  .sec[data-help="on"] > .sec-b .me-body .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { font-style: normal; }
  /* The marks drawn on the watch's black (slots, beams, the finger): a grey
     that reads on the screen in both skins, where the case grey sinks into
     the dark one. */
  .me-body { --mi-mark: color-mix(in srgb, var(--wa-art-case) 45%, var(--wa-muted)); }

  /* A titled group of picture buttons. */
  .mi-look { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 4px 0; }
  .mi-look-title > span { position: relative; display: inline-block; font-size: 12px; color: var(--wa-muted); }
  .mi-look-title > span.changed { color: var(--wa-ink); }
  .mi-look-title button.reset-dot { top: 50%; margin-top: -2.5px; }
  .mi-pics { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 6px; }
  .mi-pics.beams { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .mi-pic {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-width: 0;
    padding: 7px 6px 6px; border: 1px solid var(--wa-line-strong); border-radius: 9px; background: transparent;
    color: var(--wa-label); font: inherit; font-size: 11.5px; line-height: 1.2; cursor: pointer;
    transition: background-color .12s ease-out, border-color .12s ease-out;
  }
  .mi-pic:hover:not(:disabled):not(.on) { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); color: var(--wa-ink); }
  .mi-pic.on { background: var(--wa-panel); border-color: var(--wa-accent); color: var(--wa-ink); }
  .mi-pic:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .mi-pic:disabled { opacity: .45; cursor: default; }
  .mi-pic-name { text-align: center; overflow-wrap: anywhere; }

  /* The drawings, on the watch's black. */
  .mi-well { position: relative; display: block; overflow: hidden; border-radius: 7px; background: var(--wa-art-screen); }
  .mi-backdrop { width: 100%; max-width: 72px; aspect-ratio: 5 / 4; }
  .mi-tiles { position: absolute; inset: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
  .mi-tiles > i { display: block; border-radius: 3px; background: var(--wa-art-clock); }
  .mi-tiles > i:nth-child(2), .mi-tiles > i:nth-child(3) { background: var(--mi-mark); }
  .mi-veil { position: absolute; inset: 0; background: var(--wa-art-screen); opacity: .82; }
  .mi-backdrop.glass .mi-tiles { filter: blur(1.6px); }
  .mi-backdrop.glass .mi-veil { opacity: 1; background: color-mix(in srgb, var(--mi-mark) 20%, transparent); }
  .mi-ring { position: absolute; inset: 0; }
  .mi-ring > i { position: absolute; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; background: var(--mi-mark); }
  .mi-ring > i:nth-child(1) { left: 50%; top: 24%; }
  .mi-ring > i:nth-child(2) { left: 24%; top: 66%; }
  .mi-ring > i:nth-child(3) { left: 76%; top: 66%; }
  .mi-buttons { width: 100%; max-width: 72px; aspect-ratio: 5 / 4; }
  .mi-buttons > i { position: absolute; width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-radius: 50%; background: var(--wa-art-clock); }
  .mi-buttons > i:nth-child(1) { left: 50%; top: 28%; }
  .mi-buttons > i:nth-child(2) { left: 26%; top: 66%; }
  .mi-buttons > i:nth-child(3) { left: 74%; top: 66%; }
  .mi-buttons.neon > i {
    background: var(--wa-art-dim);
    box-shadow: 0 0 0 1px var(--mi-mark), 0 0 5px 1px color-mix(in srgb, var(--mi-mark) 55%, transparent);
  }
  .mi-beam { display: grid; place-items: center; width: 100%; max-width: 64px; padding: 2px 0; }
  .mi-beam svg { display: block; width: 100%; height: auto; }
  .mi-beam .dot { fill: var(--mi-mark); }
  .mi-beam .b { fill: var(--mi-mark); stroke: none; }
  .mi-beam .soft { opacity: .45; }
  .mi-beam .faint { opacity: .22; }
  .mi-beam .l, .mi-beam .r { fill: none; stroke: var(--mi-mark); stroke-width: 1.4; stroke-linecap: round; }
  .mi-beam .l.faint, .mi-beam .r.faint { opacity: .4; }
  .mi-beam .dash { stroke-dasharray: 2 2.4; }

  /* A switch with its line. */
  .mi-switch { display: flex; flex-direction: column; }
  .mi-switch > .hint.mi-switch-hint { margin: -2px 0 4px; padding-left: calc(var(--wa-lab) + 8px); }

  /* Segmented choices whose words wrap rather than clip. */
  .mi-wrap .seg.wide { height: auto; min-height: 28px; }
  .mi-wrap .seg.wide button { white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.25; padding: 4px; }

  /* An icon on the watch's black, as the slot rows show it. */
  .mi-icon-well {
    flex: none; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%;
    background: var(--wa-art-screen); box-shadow: inset 0 0 0 1px var(--wa-art-dim);
  }
  .mi-icon-well svg { display: block; }
  .mi-glyph-dot { display: block; width: 9px; height: 9px; border-radius: 50%; }

  /* The Entity quick menu's type tiles. */
  .mi-pics.mi-types { grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 2px 0 4px; }
  .mi-type { gap: 4px; padding: 6px 4px; }

  /* A slot's actions, two across under their headings. */
  .mi-acts { display: flex; flex-direction: column; gap: 8px; padding: 2px 0 4px; }
  .mi-act-group { display: flex; flex-direction: column; gap: 4px; }
  .mi-act-h { font-size: 12px; color: var(--wa-muted); }
  .mi-act-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .mi-act {
    display: flex; align-items: center; gap: 7px; min-width: 0; padding: 5px 7px; text-align: left;
    border: 1px solid var(--wa-line-strong); border-radius: 9px; background: transparent;
    color: var(--wa-ink); font: inherit; font-size: 12px; line-height: 1.25; cursor: pointer;
    transition: background-color .12s ease-out, border-color .12s ease-out;
  }
  .mi-act:hover:not(:disabled):not(.on) { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); }
  .mi-act.on { background: var(--wa-panel); border-color: var(--wa-accent); font-weight: 600; }
  .mi-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .mi-act:disabled { cursor: default; color: var(--wa-muted); }
  .mi-act:disabled .mi-icon-well { opacity: .5; }
  .mi-act-t { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 5px; min-width: 0; }
  .mi-act-name { overflow-wrap: anywhere; }
  .mi-act-why { flex-basis: 100%; font-size: 11px; font-weight: 400; color: var(--wa-muted); }
  .mi-pro {
    padding: 0 6px; border: 1px solid var(--wa-hue-orange); border-radius: 999px;
    font-size: 10px; font-weight: 600; line-height: 15px; color: var(--wa-ink);
  }
  .mi-desc {
    margin: 4px 0 6px; padding: 7px 9px; border: 1px solid var(--wa-line); border-radius: 8px;
    background: var(--wa-panel); color: var(--wa-label); font-size: 12px; line-height: 1.4;
  }

  /* Where: the ring as a 3 by 3 grid of round places. */
  .mi-where { display: flex; align-items: center; gap: 12px; padding: 4px 0 6px; }
  .mi-where-ring {
    flex: none; display: grid; grid-template-columns: repeat(3, 30px); grid-auto-rows: 30px; gap: 6px; padding: 8px;
    border: 1px solid var(--wa-art-dim); border-radius: 18px; background: var(--wa-art-screen);
  }
  .mi-where-cell {
    display: grid; place-items: center; width: 30px; height: 30px; margin: 0; padding: 0; border-radius: 50%;
    border: 1px solid var(--wa-art-clock); background: var(--wa-art-dim); color: var(--mi-mark); cursor: pointer;
  }
  .mi-where-cell svg { display: block; }
  .mi-where-cell.held > * { opacity: .45; }
  .mi-where-cell.held:hover:not(:disabled) > * { opacity: .9; }
  .mi-where-cell.free { border-style: dashed; background: transparent; }
  .mi-where-cell.free svg.ui-icon { width: 13px; height: 13px; }
  .mi-where-cell.free:hover:not(:disabled) { border-color: var(--mi-mark); }
  .mi-where-cell.here { border: 1px solid var(--c, var(--mi-mark)); background: var(--wa-art-screen); cursor: default; }
  .mi-where-cell:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .mi-where-cell:disabled { cursor: default; }
  .mi-where-finger { display: grid; place-items: center; }
  .mi-where-finger > i { display: block; width: 12px; height: 12px; border-radius: 50%; background: var(--mi-mark); opacity: .7; }
  .hint.mi-where-note { margin: 0; flex: 1 1 auto; min-width: 0; }

  /* A narrow inspector stacks each row, so what sat under a control starts
     at the edge too. */
  @container insp (max-width: 360px) {
    .me-style .ts-swatch-row, .mi-switch > .hint.mi-switch-hint { padding-left: 0; }
  }
`;var yr=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],br="Each page's icon, color and name are set here: pick a page in the Pages card.",To="Pick a page in the Pages card to set how it shows here.",vr={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:br},Ro="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Po="Tap a slot on the watch or in the list to edit it.",Be=.36,Fe=44,je=22;function Co(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function xr(e,n,t=Be){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=r=>Math.round(r*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var Sr="wrist-assistant-panel.menus.zoom.v1";function kr(e=Qe()){try{let n=e?.getItem(Sr);if(n==null||n==="")return;let t=Number(n);return ui.includes(t)?t:void 0}catch{return}}function $r(e,n=Qe()){try{n?.setItem(Sr,e===void 0?"":String(e))}catch{}}var Mr={name:{color:E.place,icon:"text"},slot:{color:E.content,icon:"content"},where:{color:E.position,icon:"place"},look:{color:E.look,icon:"look"},shows:{color:E.states,icon:"states"},menu:{color:E.content,icon:"content"},style:{color:E.look,icon:"look"},motion:{color:E.look,icon:"radial"},switcherPage:{color:E.content,icon:"watch"}},Eo="#26a69a",Ho=E.complication,P="menu-editor";function ae(e,n,t){return`${e} ${e===1?n:t}`}function j(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Tr(e,n){return{entityId:n,displayName:n===""?"":j(e,n),domain:ke(n)}}function qe(e,n,t,i){return e.icons.render(n,t,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function K(e){return Y(S(e))===void 0?{icon:ue.unknownActionIcon,color:ue.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function Rr(e){let n=S(e);if(n==="triggerEntity"){let i=he(e).entityId;return vt(ke(typeof i=="string"?i:""))}let t=Y(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function k(e,n){return e.toUpperCase()===n.toUpperCase()}function Ao(e,n){return e.toUpperCase()===n.toUpperCase()}function Oo(e,n){let t=S(n),i=he(n),s=Y(t);for(let r of s?.payload??[]){let o=i[r.key];if(!(typeof o!="string"||o==="")){if(r.type==="entity")return j(e.hass,o);if(r.target==="page")return e.targets.pages.find(a=>k(a.id,o))?.name??"A page not in the pages";if(r.target==="statusPage")return e.targets.statusPages.find(a=>k(a.id,o))?.name??"A status page";if(r.target==="httpAction")return e.targets.httpActions.find(a=>k(a.id,o))?.name??"An HTTP action";if(r.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(d=>k(d.id,o))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function Ke(e,n){return Oo(e,n)??ee(S(n))}function Io(e){return`${V(typeof e.position=="string"?e.position:"")} \xB7 ${ee(S(e))}`}function Lo(e){let n=Te(),t=i=>{let s=n.indexOf(typeof i.position=="string"?i.position:"");return s<0?n.length:s};return e.slice().sort((i,s)=>t(i)-t(s))}function z(e){return pe(e)?.label??e}var Pr="me:menu",Cr="me:er:mode",Er="me:er:domain",Kt="me:er:entity",jt="me:er:add";function C(e){let n=e.uiState.get(Pr);return n==="entity"||n==="switcher"?n:"anywhere"}function Do(e,n){n!==C(e)&&e.uiState.delete(Ue),e.uiState.set(Pr,n),e.requestUpdate()}var Ue="me:sw:page";function Hr(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function G(e){if(C(e)!=="switcher")return;let n=e.uiState.get(Ue);if(typeof n=="string")return Hr(e).find(t=>k(t.id,n))}function Jt(e,n){n===void 0?e.uiState.delete(Ue):e.uiState.set(Ue,n),e.requestUpdate()}function Ar(e){let n=G(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function Yt(e){return yr.find(([n])=>n===e)?.[1]??e}function Gt(e){return e.uiState.get(Cr)==="entity"?"entity":"domain"}function Zt(e){let n=e.uiState.get(Er);return typeof n=="string"&&pe(n)!==void 0?n:"light"}function Xt(e){let n=me(e.document),t=e.uiState.get(Kt);return typeof t=="string"&&n.includes(t)?t:n[0]}function Z(e){switch(C(e)){case"anywhere":return $e;case"entity":return Or(e);case"switcher":return}}function Or(e){if(Gt(e)==="domain")return{list:"domain",domain:Zt(e)};let n=Xt(e);return n===void 0?void 0:{list:"entity",entityId:n}}function Wo(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${z(n.domain)} menu`:`${j(e.hass,n.entityId)} menu`}function Ir(e){return`me:sel:${Bi(e)}`}function fe(e,n){let t=e.uiState.get(Ir(n));if(typeof t=="string")return I(e.document,n).find(i=>k(T(i),t))}function ge(e,n,t){e.uiState.set(Ir(n),t),e.requestUpdate()}function ze(e){if(G(e)!==void 0)return Jt(e,void 0),!0;let n=Z(e);return n===void 0||fe(e,n)===void 0?!1:(ge(e,n,void 0),!0)}function Lr(e,n,t){let i;e.edit(s=>{let r=Yi(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=r.id,r.document}),i!==void 0&&ge(e,n,i)}function fr(e){let t=(i,s)=>Math.round((s+(i-.5)/Be*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${Fe} ${je}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>W`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function _o(e,n){return n===void 0?[]:I(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=xt(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:K(t).color}]})}function No(e,n){if(n==="anywhere")return ae(I(e.document,$e).length,"slot","slots");if(n==="switcher")return ae(e.switcherPages.length,"page","pages");if(Gt(e)==="domain")return`By type \xB7 ${z(Zt(e))}`;let t=Xt(e);return`By entity \xB7 ${t===void 0?"none yet":j(e.hass,t)}`}function Vo(e,n){if(n==="switcher"){let t=e.switcherPages;return fr(t.map((i,s)=>({...xr(s,t.length),color:i.color})))}return fr(_o(e,n==="anywhere"?$e:Or(e)))}function Dr(e){let n=C(e);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Fe}px; --thumb-h: ${je}px`}>
    <div class="lc-head">
      <span class="swatch">${x("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${Ro}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${yr.map(([t,i])=>{let s=t===n,r=()=>{s||Do(e,t)};return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${vr[t]}
          @click=${r}
          @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          ${Vo(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span></b><small>${No(e,t)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function Wr(e,n,t){return c`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${qe(e,n,14,t)}</span></span>`}function qo(e,n,t,i){let s=T(t),r=K(t),o=i!==void 0&&k(s,T(i)),a=t.isVisible===!1,d=Ke(e,t),l=Io(t),u=()=>ge(e,n,s);return c`<div class="layer me-slot-row ${o?"hl":""} ${a?"dim":""}" data-slot=${s} style=${`--k:${r.color}`}
    role="listitem" tabindex="0" aria-current=${o?"true":"false"} aria-label=${d}
    title=${`${d} \xB7 ${l}${a?", hidden":""}`}
    @click=${p=>{p.target instanceof Element&&p.target.closest("button")||u()}}
    @keydown=${p=>{p.target!==p.currentTarget||p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),u())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Wr(e,r.icon,r.color)}
    <span class="name"><b><span class="nm-t">${d}</span></b><small>${l}</small></span>
    <span class="right">
      <span class="badges">${a?c`<span class="badge">hidden</span>`:h}</span>
      <span class="acts">
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${d}`}
          @click=${()=>e.edit(p=>kt(p,n,s))}>${x("delete")}</button>
      </span>
    </span>
  </div>`}function Uo(e,n,t){let i=n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet.":n.list==="domain"?`${z(n.domain)} menu, by type`:`${j(e.hass,n.entityId)}'s own menu`;return c`<div class="lc-filter me-filter"><span class="lc-sub">${i}</span>
    ${t===void 0?h:c`<button type="button" class="lc-ghost sm" title="Pick the type or the entity in the menu's settings"
      @click=${()=>ze(e)}>Change</button>`}
  </div>`}function Bo(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function Fo(e,n,t){let i=t!==void 0&&k(t.id,n.id),s=Bo(n),r=()=>Jt(e,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${o=>{o.target instanceof Element&&o.target.closest("button")||r()}}
    @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Wr(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:h}</span></span>
  </div>`}function jo(e){let n=Hr(e),t=G(e),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Fe}px; --thumb-h: ${je}px`}>
    <div class="lc-head">
      <span class="swatch">${x("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${ae(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>Fo(e,s,t))}</div>`}
  </section>`}function _r(e){let n=C(e);if(n==="switcher")return jo(e);let t=Z(e),i=t===void 0?[]:Lo(I(e.document,t)),s=t===void 0?void 0:fe(e,t),r=t===void 0?[]:St(e.document,t),o=t===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place",a;return t===void 0?a=c`<div class="lc-note">Add an entity to edit its menu.</div>`:i.length===0?a=c`<div class="lc-note">No slots yet.</div>`:a=c`<div class="layers me-slot-list" role="list">${i.map(d=>qo(e,t,d,s))}</div>`,c`<section class="card lc me-slots-card" aria-label="Slots"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Fe}px; --thumb-h: ${je}px`}>
    <div class="lc-head">
      <span class="swatch">${x("layers")}</span><span class="lc-title">Slots</span>
      ${t===void 0?h:c`<span class="lc-sub">${ae(i.length,"slot","slots")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri me-add-slot" aria-label="Add slot" ?disabled=${e.busy||t===void 0||r.length===0}
        title=${o} @click=${()=>{t!==void 0&&Lr(e,t)}}>${x("plus")}<span>Add</span></button>
    </div>
    ${n==="entity"?Uo(e,t,s):h}
    ${a}
  </section>`}function Nr(e,n){let t=Co(e,n);return`left:${t.x*100}%;top:${t.y*100}%`}function gr(e,n,t){let i=xt(n,t??Be);return i===void 0?void 0:Nr(e,i)}function Qt(e,n,t){let{width:i,height:s}=e.screen,r=e.scale,o=Math.min(i,s),a=c`<div class="me-screen" role="group" aria-label=${n}
    style=${`width:${Math.round(i*r)}px;height:${Math.round(s*r)}px;--me-s:${r}`}>
    <svg class="me-screen-bg" viewBox=${`0 0 ${i} ${s}`} aria-hidden="true">
      <circle cx=${i/2} cy=${s/2} r=${o*Be} class="me-track"></circle>
      <circle cx=${i/2} cy=${s/2} r=${o*.05} class="me-center"></circle>
    </svg>
    ${t}
  </div>`;return hi({width:i,height:s},r,a,n)}function zt(e,n){return Math.round(n*e.scale)}function Ko(e,n,t,i){let s=e.screen,r=I(e.document,n),o=Ki(e.document,n),a=new Set(St(e.document,n)),d=t===void 0?void 0:T(t),l=(u,p,w,m,y)=>{let v=K(u),M=T(u),_=d!==void 0&&k(M,d),ce=`${V(p)}: ${ee(S(u))}${u.isVisible===!1?", hidden":""}`;return c`<button type="button" class="me-dot ${m} ${_?"on":""} ${u.isVisible===!1?"off":""}" style=${`${w};--c:${v.color}`}
      title=${ce} aria-label=${ce} aria-pressed=${_?"true":"false"} @click=${()=>ge(e,n,M)}>
      ${qe(e,v.icon,zt(e,m===""?15:11),v.color)}${y>1?c`<span class="me-count" aria-hidden="true">${y}</span>`:h}</button>`};return Qt(e,`${i} on the watch`,Te().map(u=>{let p=gr(s,u);if(p===void 0)return h;let w=r.filter(R=>R.position===u),m=w.find(R=>R.isVisible!==!1),y=m===void 0?o.find(R=>R.position===u&&R.isVisible!==!1):void 0,v=m??(y===void 0?w[0]:void 0),M=w.find(R=>R!==v),_;if(v!==void 0)_=l(v,u,p,"",w.length);else if(y!==void 0){let R=K(y);_=c`<span class="me-dot inh" style=${`${p};--c:${R.color}`} title=${`${V(u)}: ${ee(S(y))}, from All`}>
          ${qe(e,R.icon,zt(e,13),R.color)}</span>`}else a.has(u)?_=c`<button type="button" class="me-dot free" style=${p} ?disabled=${e.busy}
          title=${`Add a slot at ${V(u)}`} aria-label=${`Add a slot at ${V(u)}`}
          @click=${()=>Lr(e,n,u)}>${x("plus")}</button>`:_=h;let ce=M===void 0?void 0:gr(s,u,.2);return c`${_}${M===void 0||ce===void 0?h:l(M,u,ce,"two",0)}`}))}function zo(e){let n=e.switcherPages,t=e.screen,i=G(e),s=n.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:n.map((r,o)=>{let a=`${Nr(t,xr(o,n.length))};--c:${r.color}`,d=i!==void 0&&k(i.id,r.id)?"on":"";return r.text===void 0?c`<span class="me-dot me-page-dot ${d}" style=${a} title=${r.name}>${qe(e,r.icon,zt(e,14),r.color)}</span>`:c`<span class="me-page ${d}" style=${a} title=${r.name}>${r.text}</span>`});return Qt(e,"Page switcher on the watch",s)}function Vr(e){if(C(e)==="switcher")return zo(e);let n=Z(e);return n===void 0?Qt(e,"Entity quick menu on the watch",c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):Ko(e,n,fe(e,n),Wo(e,n))}function qr(e){if(C(e)==="switcher")return[ae(e.switcherPages.length,"page","pages")];let n=Z(e);if(n===void 0)return["No entity yet"];let t=ae(I(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[n.list==="domain"?z(n.domain):j(e.hass,n.entityId),t]}function Ur(e){return C(e)==="switcher"?br:Z(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Po}function Br(e,n){return mi(e.uiState,P,n)}function Jo(e,n){fi(e.uiState,P,n,!Br(e,n)),e.requestUpdate()}function Yo(e){if(Ar(e)!==void 0)return[{module:P,section:"switcher-page"}];let n=Z(e),t=n===void 0?void 0:fe(e,n);if(t!==void 0)return[{module:P,section:"slot"},{module:P,section:"where"},...zs(t)?[{module:P,section:"voice"}]:[],{module:P,section:"look"},...n?.list==="anywhere"?[{module:P,section:"shows"}]:[]];let i=C(e);return i==="anywhere"?[{module:P,section:"style-anywhere"},{module:P,section:"motion-anywhere"}]:[{module:P,section:i==="entity"?"menu":`style-${i}`}]}function D(e,n,t,i,s,r={}){let o=Br(e,t),a=Mr[n];return kn({color:a.color,icon:x(a.icon),title:i,open:o,onToggle:()=>Jo(e,t),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${P}:${t}`},o?s:c``)}function Fr(e){let n=C(e),t=Yt(n),i=Z(e),s=i===void 0?void 0:fe(e,i),r=Yo(e),o=gi(e.uiState,r),a=G(e),d=Ar(e),l,u;if(a!==void 0&&d!==void 0)l=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>Jt(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Ho}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=Go(e,d);else if(s===void 0||i===void 0)l=c`<div class="crumbs"><span class="kchip" style=${`--k:${Eo}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=va(e,n);else{let p=Ke(e,s);l=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>ge(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${K(s).color}`}>Slot</span><span class="nm" title=${p}>${p}</span></div>`,u=fa(e,i,s)}return c`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{wi(e.uiState,r,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function Go(e,n){let t=n.page;return D(e,"switcherPage","switcher-page",Wt,c`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Wt}>${Ns(n)}</fieldset>`,{summary:_s(t),dot:Ws(t)})}var Zo={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function jr(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Zo[n.key]??n.key}var Xo={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function Kr(e){return ee(e).replace(/ - (.+)$/," ($1)")}function Qo(e,n){if(n==="entityControl"){let t=Fi(e)??"all";return t==="all"?"Any entity":z(t)}return Xo[n]??Wi(n)}function ea(e,n,t){let i=S(t),s=zi(n),r=a=>{let d=Y(a),l=d===void 0?{icon:ue.unknownActionIcon,color:ue.unknownActionColor}:d,u=a===i?void 0:_i(a,e.targets);return{raw:a,label:Kr(a),icon:l.icon,color:l.color,pro:d?.requiresPremium===!0,...u===void 0?{}:{why:u}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[r(i)]}],...s.map(a=>({heading:Qo(n,a.category),tiles:a.actions.map(r)}))]}function ta(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function wr(){return c`<button type="button" class="link" @click=${Ls}>Open HTTP actions</button>`}function na(e,n,t){let i=n.find(s=>k(s.id,t));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${wr()}</div>`:e.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${ki} ${wr()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:h}function ia(e,n,t,i,s){let r=T(t),o=he(t)[s.key],a=typeof o=="string"?o:"",d=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||d.some(v=>k(v.id,a)),u=v=>e.edit(M=>Tt(M,n,r,s.key,v===""?void 0:v)),p=s.target==="statusPage"&&e.statusPagesKnown===!0,w=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,m=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":p?"Not in this watch's status pages":w?Si:bi,y=v=>s.target==="httpAction"?ta(v):v.name;return c`<label class="field"><span>${jr(i,s)}</span>
    <select .value=${_n(d.find(v=>k(v.id,a))?.id??a)} @change=${v=>u(v.target.value)}>
      ${s.required===!0?h:c`<option value="" ?selected=${a===""}>None</option>`}
      ${l?h:c`<option value=${a} selected>${m}</option>`}
      ${d.map(v=>c`<option value=${v.id} ?selected=${k(v.id,a)}>${y(v)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:h:s.target==="statusPage"?p||e.catalogKnown?h:c`<div class="hint ts-under">No status pages from this watch yet. Add them in Status pages.</div>`:s.target==="httpAction"?na(e,e.targets.httpActions,a):h}`}function sa(e,n,t,i,s){let r=T(t),o=he(t),a=(u,p)=>e.edit(w=>Tt(w,n,r,s.key,u),p),d=jr(i,s),l=Rt(t,s);switch(s.type){case"entity":{let u=typeof o[s.key]=="string"?o[s.key]:"",p=i==="runScene"?"scene":i==="runScript"?"script":Vi();return c`<div class="ts-stack">${it({hass:e.hass},d,Tr(e.hass,u),w=>a(w.entityId),`me:entity:${r}`,{domain:p,clearable:!1,needed:u===""})}</div>
        ${u===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:h}`}case"uuid":return ia(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let w=ke(typeof o.entityId=="string"?o.entityId:""),m=Ni(w),y=typeof l=="string"?l:m[0]??"",v=m.map(M=>[M,bt(M)]);return m.includes(y)||v.unshift([y,bt(y)]),N(d,y,v,M=>a(M),{snapBack:!0})}let u=ne(s.enum),p=typeof l=="string"?l:String(s.default??"");return u.length<=4?O(d,p,u,w=>a(w)):N(d,p,u,w=>a(w),{snapBack:!0})}case"bool":return H(d,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&Rt(t,{key:"showBanner",type:"bool",default:!0})===!1)return h;let u=typeof o[s.key]=="number"?o[s.key]:void 0;return Jn(d,u,p=>a(p,`slot:${r}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function ra(e,n,t){if(!$t(n,t))return h;let i=T(t);return c`<div class="ts-stack">${O("Skip conditions",gs(Mt(t)),fs,s=>e.edit(r=>Xi(r,n,i,ws(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function oa(e){let n=Re(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(z).join(", ")}function aa(e,n){let t=T(n),i=Re(n),s=i===void 0,r=d=>e.edit(l=>is(l,t,d)),o=ns(),a=(i??[]).filter(d=>!Pt(d));return c`<div class="mi-wrap">${O("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],d=>r(d==="every"?void 0:o.slice(0,1)),{def:"every"})}</div>
    ${s?h:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...o,...a].map(d=>{let l=i.includes(d),u=!Pt(d);return c`<button type="button" class="pe-chip ${l?"on":""} ${u?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${u?"Not reported by the watch":h}
          @click=${()=>r(l?i.filter(p=>p!==d):[...i,d])}>${z(d)}</button>`})}
    </div>
    ${a.length===0?h:c`<div class="hint warn">${a.map(z).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function ca(e,n){return $t(n,e)&&Mt(e)!==null}function da(e){return e.isVisible===!1}function la(e){return Re(e)!==void 0}function ua(e){let n=Rr(e);if(n===void 0)return!1;let t=K(e);return t.icon!==n.icon||!Ao(t.color,n.color)}function ha(e,n){let t=Mr.name,i=Y(S(n));return c`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${x(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${Ke(e,n)}</span>
      ${i?.requiresPremium?c`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:h}
    </div>
  </section>`}function pa(e){let n=V(e);return n.charAt(0)+n.slice(1).toLowerCase()}function ma(e,n,t){let i=T(t),s=I(e.document,n).filter(r=>!k(T(r),i));return Te().map(r=>{let o=s.find(d=>d.position===r),a={position:r,label:pa(r),here:t.position===r};return o!==void 0&&(a.holder={name:Ke(e,o),...K(o)}),a})}function fa(e,n,t){let i=T(t),s=S(t),r=Y(s),o=K(t),a=Rr(t),d=typeof t.position=="string"?t.position:"",l=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${r===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:h}
    ${hr(e.icons,s,ea(e,n,t),m=>e.edit(y=>ts(y,n,i,m,e.targets)))}
    ${r?.description?c`<div class="mi-desc">${r.description}</div>`:h}
    ${Ji(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:h}
    ${(r?.payload??[]).map(m=>sa(e,n,t,s,m))}
    ${ra(e,n,t)}
  </fieldset>`,u=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${pr(e.icons,o,ma(e,n,t),m=>e.edit(y=>Gi(y,n,i,m)))}
    ${H("Shown on the watch",t.isVisible!==!1,m=>e.edit(y=>Zi(y,n,i,m)),!0)}
  </fieldset>`,p=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${be({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",m=>e.edit(y=>Qi(y,n,i,m),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${Q("Color",typeof t.color=="string"?t.color:void 0,m=>{m!==void 0&&e.edit(y=>es(y,n,i,m),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,w=Ys(e,n,t);return c`${ha(e,t)}
    ${D(e,"slot","slot","What it does",l,{summary:Kr(s),dot:ca(t,n)})}
    ${D(e,"where","where","Where",u,{summary:`${V(d)}${t.isVisible===!1?", hidden":""}`,dot:da(t)})}
    ${w===void 0?h:D(e,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${w}</fieldset>`,{summary:Gs(e,t),dot:Ks(t)})}
    ${D(e,"look","look","Icon and color",p,{summary:o.icon,dot:ua(t)})}
    ${n.list==="anywhere"?D(e,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${aa(e,t)}</fieldset>`,{summary:oa(t),dot:la(t)}):h}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(m=>kt(m,n,i))}>${x("delete")}<span>Remove</span></button>
    </div>`}function ga(e){let n=Ne(e.document,"quickAction",tr),t=Ne(e.document,"quickAction",nr);return c`${D(e,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${ir(e)}
    </fieldset>`,{summary:sr(e.document),dot:n})}
    ${D(e,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${rr(e)}
    </fieldset>`,{summary:or(e.document),dot:t})}`}function wa(e){let n=Ne(e.document,"pageSwitcher",ar);return D(e,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${cr(e)}
  </fieldset>`,{summary:dr(e.document),dot:n})}function ya(e){let n=Gt(e),t=a=>{e.uiState.set(Cr,a),e.requestUpdate()},i=O("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,r,o=!1;if(n==="domain"){let a=Zt(e),d=pe(a),l=Ui(a),u=qi().map(m=>[m.domain,m.label]),p=lr.flatMap(m=>{let y=pe(m);return y===void 0?[]:[{domain:y.domain,label:y.label,icon:y.icon,color:vt(y.domain).color}]}),w=d?.inheritKey?ji(e.document,a):!1;o=w,r=`By type \xB7 ${d?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${ur(e.icons,a,p,u,m=>{e.uiState.set(Er,m),e.requestUpdate()})}
      ${l.length>0?c`<div class="hint ts-under keep">The same menu as ${l.map(m=>m.label).join(", ")}.</div>`:h}
      ${d?.inheritKey?We("Fill gaps with the All menu",w,m=>e.edit(y=>ss(y,a,m)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):h}`}else{let a=me(e.document),d=Xt(e);r=`By entity \xB7 ${d===void 0?"none yet":j(e.hass,d)}`;let l=u=>{let p=u.entityId.trim();p!==""&&(e.edit(w=>rs(w,p)),e.uiState.set(Kt,p),e.uiState.set(jt,(Number(e.uiState.get(jt)??0)||0)+1),e.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:h}
      ${a.map(u=>{let p=u===d;return c`<div class="me-entity ${p?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${p?"true":"false"}
            @click=${()=>{e.uiState.set(Kt,u),e.requestUpdate()}}>
            <b>${j(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(w=>os(w,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${it({hass:e.hass},"Add an entity",Tr(e.hass,""),l,`me:er:add:${String(e.uiState.get(jt)??0)}`,{clearable:!1})}
      </div>
    </div>`}return D(e,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:r,dot:o})}var ba="Click a slot on the watch to change what it does.";function va(e,n){let t=n==="anywhere"?ga(e):n==="switcher"?wa(e):ya(e);return c`<p class="me-menu-note">${vr[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?To:ba}</p>`}var zr=X`
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
    flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere;
    font-size: 12.5px; font-weight: 600; color: var(--wa-ink);
  }
  .me-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .me-readonly { font-size: 12px; color: var(--wa-muted); }
  .me-sub-h { margin: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .me-voice-list { display: flex; flex-direction: column; margin-bottom: 2px; }
  .me-body .hint.warn { color: var(--wa-amber); }
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
`;function en(e){if(e.length===0)return"";let n=e.map(i=>ds(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Jr(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${en(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function Xr(){return ps()||Oi()}Is({dirty:Xr,drop:()=>{ms(),Ii()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Xr()&&(e.preventDefault(),e.returnValue="")});var xa=15e3,Qr=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),tn=Qr?"\u2318":"Ctrl+",nn={min:200,max:720,middleMin:320},sn={left:280,right:320},rn="wrist-assistant-panel.menus.columns.v1",Sa="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",ka=24,Yr=820;function on(e){return ye(e).message}function Je(e){return ye(e).code}function Ye(e){let{code:n,message:t}=ye(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function $a(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function Ma(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":fn(Math.max(0,(Date.now()-n)/1e3))}function Ta(e){return e==="panel"?"Saved here":"From the watch"}function Ra(e){return e instanceof HTMLElement?ri(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Pa(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function Ca(e){return J(e)?ot(e).filter(n=>!ct(n)&&Di(ve(n))).map(n=>({id:ve(n),name:at(n)})):[]}var Gr=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Ge(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var Ea="#8E8E93";function an(e){if(!J(e))return[];let n=0;return ot(e).filter(t=>!di(t)&&!ct(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=at(t),r=Ge(t.switcherIcon)??Ge(ci(t)[0]?.icon)??(li(t)?"bolt.fill":"square.grid.2x2.fill"),o=i?Ea:Gr[n++%Gr.length],a=Ge(t.switcherColor)??o,d=t.switcherDisplayMode==="icon"?void 0:Ge(t.switcherText)??s;return{id:ve(t),name:s,icon:r,color:a,...d===void 0?{}:{text:d},hidden:i}})}function sd(e){return an(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var Zr={ok:0,warn:1,err:2};function Ha(e,n){return e===void 0?n:n===void 0?e:{kind:Zr[n.kind]>Zr[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function Aa(e){let n=Se(e)??{},t=I(n,{list:"anywhere"}).length,i=me(n).length;return`Anywhere menu: ${(r=>`${r} ${r===1?"slot":"slots"}`)(t)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var f=class extends cn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=h;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new Hn(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=kr();this.columns={...sn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Zn(this);this.symbols=new Nn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!Pa()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(s&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!Ra(i[0])){if(s&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let o=this.viewHost();o!==void 0&&ze(o)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(Sa)))return;let o=this.viewHost();o!==void 0&&ze(o)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=t.composedPath(),s=r=>i.some(o=>o instanceof HTMLElement&&o.classList.contains(r));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(jn,this.onScrubStart),this.addEventListener(Kn,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return Tn(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let t=this.watchId,i=this.record;if(!(t===void 0||i===void 0)){if(i.revision>0){let s=q(t);if(s!==void 0)return s;let r=Se(i.document);return r===void 0?void 0:Et(t,r,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return q(t)??Ht(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return gt(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return Ca(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(q(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return G({uiState:this.uiState,switcherPages:[],switcherRows:an(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Dn(rn,sn,nn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,dn(this.hass).then(r=>{this.ownList=r.owners},()=>{this.ownList=[]}));let s=En(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),ti(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let o=()=>this.pagesSaveEnded(t);i.then(o,o)}let s=q(t)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let r=()=>this.saveEnded(t);s.then(r,r)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,i=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(t),this.load(t,i),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let r=await A(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=xs(r)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Ot(t),defaults:Ss(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let r=await A(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=vi(r)}catch(r){if(s!==this.catalogSeq||t!==this.watchId)return;mt(r)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await mn(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=qn(s)}catch(s){if(i!==this.httpLibrarySeq)return;Un(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let r=await A(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=xi(r)}catch(r){if(s!==this.statusPagesSeq||t!==this.watchId)return;mt(r)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let r=await A(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:r.revision,document:r.document},r.revision>0&&J(r.document)&&!(gt(t)?.saving??!1)&&Ai(t,r.document,r.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let r=await A(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=r.revision>0&&J(r.document)?r.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let o=await A(s,t,"menus");if(r!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(r!==this.loadSeq)return;us(o)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=on(o)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let i=this.watchId;this.record=t,i!==void 0&&t.revision<=0&&Ht(i);let s=t.revision>0?Se(t.document):void 0;if(i===void 0||s===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===i&&t.revision>=r.revision&&(this.restartDraft=void 0,(q(i)?.dirty??!1)||Ee(i));let o=Et(i,s,t.revision);o.replaced.length>0?this.note={kind:"warn",text:en(o.replaced)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let r=await ln(i,t,"menus");if(s!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(s!==this.historySeq||t!==this.watchId)return;this.historyState=Je(r)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;pn(i,t,r=>{s===this.subscribeSeq&&(r.kind==="catalog"?$i(r,this.catalog)&&this.loadCatalog(t):r.kind==="status_pages"?this.loadStatusPages(t):r.kind==="pages"?this.loadPages(t):r.kind==="behavior"?this.loadBehavior(t):r.kind==="voice"?this.loadVoice(t):r.kind==="menus"&&r.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(r=>{s===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Mn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},xa))}async poll(){this.pollTimer=void 0;let t=this.hass,i=this.watchId,s=this.record;if(!(!t||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let r=await A(t,i,"menus");if(i!==this.watchId||this.record!==s)return;r.revision===s.revision?this.record={...s,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(r),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let r=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),r}editPages(t,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let r=this.scrubKey??i,o=s.apply(t(s.document),r===void 0?void 0:{coalesce:r});return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??si,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=oi(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:Bn(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Ot(this.voiceDocument)}}screen(){let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(nt(t?.screen_size)??tt).screen}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,r=an(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,switcherPages:r.filter(o=>!o.hidden).map(({hidden:o,...a})=>a),switcherRows:r,switcherSettings:o=>this.switcherSettingsHost(o),get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get busy(){return s.saving},edit:(o,a)=>this.draft===t&&this.edit(o,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let i=this.pagesDraft;if(i===void 0||pt(i.document,t)===void 0)return;let s=this,r=this.memoIcons();return{pageId:t,icons:r,symbols:this.symbols,uiState:this.uiState,get page(){return pt(i.document,t)??{}},get busy(){return s.saving},edit:(o,a)=>{this.pagesDraft===i&&this.editPages(o,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(t||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.watchId;this.endScrub();let s=this.draft,r=this.pagesDraft;if(!t||i===void 0||!s||this.saving)return;let o=s.dirty,a=r?.dirty??!1;if(!o&&!a)return;this.note=void 0;let d=o?await this.saveMenus(t,i,s,s.revision<=0):void 0,l=a&&r!==void 0&&this.pagesDraft===r?await this.savePages(t,i,r):void 0;i===this.watchId&&(this.note=Ha(d,l))}async saveMenus(t,i,s,r=!1){let o=hs(s,{prepare:cs,save:(d,l)=>Ze(t,i,"menus",d,l).catch(u=>{throw Ye(u)}),fetch:async()=>{let d=await A(t,i,"menus").catch(l=>{throw Ye(l)});return{revision:d.revision,document:d.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await o.catch(d=>({ok:!1,revision:s.revision,merged:!1,code:Je(d)??"unknown",message:on(d)}));return this.saveEnded(i),Rs(r,a.code,Jr(a))}async savePages(t,i,s){let r=Hi(s,{prepare:a=>Li(yi(a),s.base,this.hass?.states),save:(a,d)=>Ze(t,i,"pages",a,d).catch(l=>{throw Ye(l)}),fetch:async()=>{let a=await A(t,i,"pages").catch(d=>{throw Ye(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let o=await r.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:Je(a)??"unknown",message:on(a)}));return this.pagesSaveEnded(i),In(o)}startFresh(){let t=this.watchId;t===void 0||!Cn(this.noRecordState())||($s("menus",t),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let i=this.hass,s=this.watchId,r=this.record;if(!i||s===void 0||r===void 0||this.draft?.dirty)return;let o={entry:t,baseRevision:r.revision};this.restoreAsk=o,un(i,s,"menus",t.revision).then(a=>{this.restoreAsk===o&&(this.restoreAsk={...o,summary:Aa(a.document)})},()=>{})}async restore(){let t=this.hass,i=this.watchId,s=this.restoreAsk;if(!t||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let r;try{let o=await hn(t,i,"menus",s.entry.revision,s.baseRevision);r={kind:"ok",text:ai(s.entry.updated_at)},i===this.watchId?this.restartDraft={watchId:i,revision:o.revision}:(q(i)?.dirty??!1)||Ee(i)}catch(o){let a=Je(o);a==="conflict"?r={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?r={kind:"warn",text:"Not restored. Home Assistant no longer holds menus for this watch."}:a==="not_found"?r={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",r={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):r={kind:"err",text:`Could not restore: ${Vn(o)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=r,this.load(i,!0))}render(){let t=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,t):h}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:h}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):h}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Yr}renderTopBar(t,i){let s=t!==void 0&&!this.unsupported,r=s&&this.dirty,o=this.shellOwnsWatch;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${x("menu")}</button>`:h}
      ${o?h:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Hs(void 0,!1)}>${x("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${o?h:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?An({newWatch:this.newWatch,dirty:r,saved:rt(this.record)}):h}
      ${this.renderSyncPill(s?t:void 0)}
      ${this.renderTopMenu(s?t:void 0)}
      ${s?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${tn}S). A save reaches the watch the next time it checks.`:`Nothing to save (${tn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?h:c`<span class="tb-saved" title=${r?"Unsaved changes":""}>${rt(this.record)}</span>
        ${Cs(Ts({newWatch:this.newWatch,dirty:r,saving:this.saving}))}`}`:h}
      ${o?h:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():Os(void 0)}>${x("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(As,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return h;let s=t===void 0?{size:0,limit:1}:wt(t.document),r=st({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState});return c`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}noRecordState(t=this.watches){return Rn(t.find(i=>i.owner_watch_id===this.watchId))}opensReady(t=this.watches){return Ms(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let i=this.canStartFresh();if(t===void 0&&!i)return h;let s=this.topMenuOpen,r=o=>()=>{this.topMenuOpen=!1,o()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${r(()=>this.discard())}>Discard edits</button>`:h}
        ${i?c`<button class="row" role="menuitem"
          @click=${r(()=>this.startFresh())}>${Xe}</button>`:h}
      </div>`:h}
    </span>`}personColor(t){let i=Yn(this.owners.length>0?this.owners:this.ownList??[]);return Gn(i.findIndex(s=>s.owners.some(r=>r.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return h;let i=t.find(o=>o.owner_watch_id===this.watchId),s=this.watchMenuOpen,r=o=>{let a=o===void 0?void 0:this.personColor(o);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:h} aria-hidden="true">${x("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${r(i?.owner_watch_id)}<span class="tb-browse-l">${i?we(i,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${x("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(o=>{let a=o.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(o.owner_watch_id)}}>
            ${r(o.owner_watch_id)}<span class="me-watch-name">${we(o,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?x("check"):h}</span>
          </button>`})}
      </div>`:h}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Yr?this.columns:Ln(this.hostWidth-ka,this.columns,nn)}renderGutter(t){return c`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();Wn(i,{side:t,base:t==="left"?s.left:s.right,limits:nn,onWidth:r=>{this.columns={...this.columns,[t]:r}},onEnd:()=>et(rn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:sn[t]},et(rn,this.columns)}}></div>`}get stageScale(){return this.zoom??dt(this.narrow||this.stacked)}setZoom(t){this.zoom=t,$r(t)}renderStage(t,i){let s=i.find(u=>u.owner_watch_id===this.watchId),r=nt(s?.screen_size),o=r??tt,a=[...qr(t),o.label],d=this.undoDraft,l=Yt(C(t));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${we(s,i)}</span></span>`:h}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${r===void 0?`${o.label}, this watch's size is not known`:a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!d?.canUndo} title=${`Undo (${tn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${x("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!d?.canRedo} title=${Qr?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${x("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(o.label)}
        <div class="me-stage-body">${Vr(t)}</div>
        <div class="under"><span class="tail">${Ur(t)}</span></div>
      </div>
    </div>`}renderStageTools(t){let i=this.stageScale,s=dt(this.narrow||this.stacked);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${t}.`}>
        ${x("watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${i<=ut(i)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(ut(i))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${le(i)}. Back to fit`}
          title=${`The watch at ${le(i)} of its own points. Click to fit it again (${le(s)}).`}
          @click=${()=>this.setZoom(void 0)}>${le(i)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${i>=lt(i)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(lt(i))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${Ct}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${l===void 0?h:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return c`<div class="pe-empty"><b>${Ct}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:q(this.watchId),u=this.watchId;return c`<div class="pe-empty"><b>${ls}</b><span>${Pn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${Xe}</button>
        ${l?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Ee(u),this.requestUpdate()}}>Discard the kept edits</button>`:h}
      </div>`}let r=this.viewHost();if(r===void 0)return c`<div class="pe-empty">Loading…</div>`;let o=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",d=i.revision<=0;return c`${d&&this.barHost===void 0?Ps():h}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${a}`}>
      <div class="column left">
        ${Dr(r)}
        ${_r(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Fr(r)}
      </div>
    </div>
    ${d?h:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(t,i,s){let r=wt(i),o=st({record:t,size:r.size,limit:r.limit,noun:"menus",historyState:this.historyState}),a=this.watchId;return c`${Xn({status:o,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Qn({noun:"menus",record:t,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):h}
    ${this.rawOpen?ei({noun:"menus",document:i,revision:t.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{ni(d).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):h}`}renderRestoreAsk(t){let i=this.record,s=Ma(t.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${Ta(t.entry.updated_by)}${s?` ${s}`:""}, ${$a(t.entry.size)}.</p>
      ${t.summary?c`<p class="pe-muted">${t.summary}</p>`:h}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[$n,gn,wn,yn,bn,vn,xn,Sn,pi,Es,X`
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
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
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
  `,zr,mr,ii,On]}};g([$({attribute:!1})],f.prototype,"hass",2),g([$({attribute:!1})],f.prototype,"owners",2),g([$({attribute:!1})],f.prototype,"ownerId",2),g([$({type:Boolean,reflect:!0})],f.prototype,"narrow",2),g([$({attribute:!1})],f.prototype,"icons",2),g([$({attribute:!1})],f.prototype,"iconsTick",2),g([$({attribute:!1})],f.prototype,"haMenu",2),g([$({attribute:!1})],f.prototype,"onHaMenu",2),g([$({attribute:!1})],f.prototype,"onBack",2),g([$({attribute:!1})],f.prototype,"onPages",2),g([$({attribute:!1})],f.prototype,"barActions",2),g([$({attribute:!1})],f.prototype,"shellOwnsWatch",2),g([$({attribute:!1})],f.prototype,"barHost",2),g([b()],f.prototype,"watchId",2),g([b()],f.prototype,"record",2),g([b()],f.prototype,"unsupported",2),g([b()],f.prototype,"catalog",2),g([b()],f.prototype,"statusPages",2),g([b()],f.prototype,"httpLibrary",2),g([b()],f.prototype,"pagesRecord",2),g([b()],f.prototype,"behavior",2),g([b()],f.prototype,"voiceDocument",2),g([b()],f.prototype,"loading",2),g([b()],f.prototype,"loadError",2),g([b()],f.prototype,"history",2),g([b()],f.prototype,"historyState",2),g([b()],f.prototype,"note",2),g([b()],f.prototype,"restoreAsk",2),g([b()],f.prototype,"restoring",2),g([b()],f.prototype,"historyOpen",2),g([b()],f.prototype,"rawOpen",2),g([b()],f.prototype,"rawCopied",2),g([b()],f.prototype,"ownList",2),g([b()],f.prototype,"topMenuOpen",2),g([b()],f.prototype,"watchMenuOpen",2),g([b()],f.prototype,"zoom",2),g([b()],f.prototype,"columns",2),g([b()],f.prototype,"hostWidth",2),g([b()],f.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",f);export{rn as ME_COLUMNS_KEY,Gr as WATCH_SWITCHER_COLORS,Ea as WATCH_SWITCHER_LEFT_OUT_COLOR,f as WaMenuEditor,Ha as joinSaveNotes,Ca as watchMenuPageTargets,Aa as watchMenusSummary,sd as watchSwitcherPages,an as watchSwitcherRows};
