import{d as Sr,e as K,f as Xt,g as Qt,h as Se,i as Mr,j as Tr,l as Rr}from"./chunk-45IUWTME.js";import{b as Pr,c as Cr}from"./chunk-T4OUPI4D.js";import{$ as Zs,Aa as Xs,Ba as Qs,Ca as Ft,Da as er,Ea as jt,Fa as rr,Ga as or,Ha as ar,Z as Gs,_ as Ys}from"./chunk-R3ML7SO6.js";import{a as tr,b as Kt,f as nr,j as ir,k as sr}from"./chunk-GXVEURIH.js";import{a as qs,d as Fs,j as Ks,n as js,o as zs,p as Js}from"./chunk-MQGFQGUV.js";import{D as xr,E as kr,F as $r,c as Us,e as Bs,m as Jt,n as Gt,o as gr,p as wr,q as br,w as Yt,x as Zt,y as yr,z as vr}from"./chunk-MAXWCBGB.js";import{g as Vi,ia as de,ja as Pt,ma as _e,ta as qi,za as Vs}from"./chunk-QVA5ET2S.js";import{$ as Os,A as W,B as P,C as Be,D as qe,E as Y,F as Fe,G as ys,H as vs,I as Dt,J as xs,K as ks,L as $s,M as Ss,N as Ms,O as Ts,P as Nt,Q as _t,R as Rs,S as Ps,T as Cs,U as Is,V as Wt,W as Vt,X as Ls,Y as Ut,Z as As,_ as Ke,a as ve,aa as $e,ba as Es,ca as Hs,d as We,da as oe,e as At,ea as Z,fa as je,g as Ot,ga as ue,h as ls,ha as Ds,i as le,ia as Bt,j as re,ja as Ns,k as us,l as T,la as _s,m as xe,ma as qt,na as Ws,o as hs,p as Ve,q as ps,r as Et,s as Ht,t as ms,u as fs,v as ke,w as gs,x as Ue,y as ws,z as bs}from"./chunk-CKIFX3N2.js";import{h as fr}from"./chunk-OA6DS6RJ.js";import{Ub as Zi,Vb as Xi,Wb as Qi,a as Fi,ac as es,dc as ts,fc as It,gc as ns,j as Ki,l as ji,m as zi,n as Ct,oe as os,q as Ji,r as Gi}from"./chunk-3G6SC6DM.js";import{a as ze,g as Je,h as zt}from"./chunk-P7MRQTKD.js";import{a as Ui,c as Bi}from"./chunk-XF6VR4HJ.js";import{o as Oi,p as $t,q as Ei,r as St,s as Mt,w as Di,x as Ni,y as _i,z as Wi}from"./chunk-RQWXLJYE.js";import{b as ti,c as pt,d as ni,e as mt,f as ii}from"./chunk-ZOJGMATP.js";import{a as cr,b as dr,c as lr,d as ur,e as hr,f as pr,g as mr}from"./chunk-G2XMT6V4.js";import{$b as rs,Fa as Yi,Zb as is,_b as ss,bc as Lt}from"./chunk-27VXOWKT.js";import{f as Rt}from"./chunk-CHKZKW42.js";import{a as bt,b as gi,c as wi,d as bi,e as yt,f as yi,g as vi,h as xi,i as ki,j as $i,k as Si,l as Mi}from"./chunk-LUNUSFWQ.js";import{d as Ci}from"./chunk-7O325OCR.js";import{a as mi,b as fi}from"./chunk-RZEK6ZG7.js";import{b as Hi}from"./chunk-DBIWFKAB.js";import{c as Ti,d as Ri,f as Pi}from"./chunk-SV3BTW33.js";import{c as On}from"./chunk-HYO6YZS2.js";import{$a as ri,Eb as oi,Fb as ai,Gb as ci,Mb as di,Nb as li,Ob as ui,Qb as hi,Rb as J,Sb as G,Tb as ye,U as ft,Vb as F,Wb as De,Z as gt,_c as as,ad as cs,bc as wt,bd as ds,dc as pi,ra as si,w as He,we as Ir}from"./chunk-WKBCTV4W.js";import{V as Tt,j as se,l as vt,m as Ii,n as Ne,o as xt,p as Li,q as kt,r as Ai}from"./chunk-TUSU5T3G.js";import{a as Yn,b as Zn,c as Xn}from"./chunk-PGFAOWAG.js";import{Eg as _,Gg as dt,Ih as Bn,Jg as Pn,Kg as Cn,Lg as In,Mg as Ln,Og as An,b as j,d as c,e as M,g as h,ig as Rn,j as Tn,k as L,l as k,mh as D,nh as S,rh as En,th as Hn,uh as Dn,vh as Nn,wh as _n,xh as Wn,yh as Vn,zh as Un}from"./chunk-BDP52PL7.js";import{$ as lt,D as qn,G as Fn,O as Ae,P as z,T as Kn,Ua as Gn,W as Oe,Wa as Qn,Xa as Ee,Ya as ut,Z as jn,Za as ht,_ as zn,_a as ei,aa as Jn}from"./chunk-TGJNCNIU.js";import{a as y}from"./chunk-LO2NM3CE.js";var X=ze.routing;function en(t){return X.actions.find(n=>n.action===t)}function Q(t){return en(t)?.keys??[]}function V(t){return Object.hasOwn(X.keys,t)?X.keys[t]:void 0}function pe(t){return se(t.voiceConfig)?t.voiceConfig:{}}function aa(t,n){let e=X.legacy[`${t}.${n}`];return e===void 0?n:/reads as (\w+)/.exec(e)?.[1]??n}function ee(t,n){let e=V(n);if(e===void 0)return;let i=Object.hasOwn(t,n)?t[n]:void 0;switch(e.type){case"enum":{let s=X.enums[e.enum??""]??[];return typeof i=="string"&&s.includes(i)?aa(n,i):e.default}case"bool":return typeof i=="boolean"?i:e.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return e.default;let[s,r]=e.clamp??[-1/0,1/0];return Math.min(r,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():e.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):e.default}}function Ar(t,n){let e=V(n)?.shownWhen;if(e===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(e.trim());if(i===null)return!0;let s=ee(t,i[1]),r=i[3].split(/\s+or\s+/).map(a=>a.trim()),o=typeof s=="string"&&r.includes(s);return i[2]===void 0?o:!o}function Ge(t,n){let e=V(n);if(e?.type!=="enum")return[];let i=X.labels[e.enum??""]??{},s=X.offered[n]??X.enums[e.enum??""]??[],r=ee(t,n);return(typeof r=="string"&&!s.includes(r)?[r,...s]:s).map(a=>[a,i[a]??a])}function Or(t){return V(t)?.label??ca[t]??t}var ca={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function tn(t,n,e){let i=V(n);if(i===void 0)return t;let s;switch(i.type){case"enum":if(typeof e!="string"||!Ge(t,n).some(([o])=>o===e))return t;s=e;break;case"bool":if(typeof e!="boolean")return t;s=e;break;case"int":{if(typeof e!="number"||!Number.isFinite(e))return t;let[o,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(o,Math.round(e)));break}case"entity":{if(e!==void 0&&typeof e!="string")return t;let o=(e??"").trim();if(o==="")return zt(t,n);s=o;break}case"array":{if(!Array.isArray(e)||!e.every(a=>typeof a=="string"))return t;let o=[...new Set(e.map(a=>a.trim()).filter(a=>a!==""))];if(o.length===0)return zt(t,n);s=o;break}}return(Object.hasOwn(t,n)?Tt(t[n],s):Tt(ee(t,n),s))?t:Je(t,n,s)}function Er(t,n,e,i){let s=ee(t,n),r=Array.isArray(s)?s:[];return i===r.includes(e)?t:tn(t,n,i?[...r,e]:r.filter(o=>o!==e))}function da(t,n){switch(t.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function la(t,n){let e=V(n);if(e?.fallsBackTo===void 0)return!1;let i=e.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",r=ee(t,s);return typeof r=="string"&&i.includes(r)}function nn(t,n,e,i){let s=V(n);if(s===void 0)return"None";if(!la(t,n))return s.type==="array"?"None":"Not set";if(e===void 0)return"Default";let r=da(s,e);return typeof r=="string"&&r.trim()!==""?`Default (${i(r.trim())})`:Array.isArray(r)&&r.length>0?`Default (${r.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Lr(t){return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}function he(t,n){let e=n.toUpperCase();return t.some(i=>i.toUpperCase()===e)}function Ye(t,n,e){let i=Lr(n),s=Lr(e);return t.filter(r=>!he(i,r)&&(s.length===0||he(s,r)))}function ua(t,n){return{hiddenPhraseIds:t.filter(e=>!he(n,e)),knownPhraseIds:t.slice()}}function Hr(t,n,e,i){if(!he(n,e))return t;let s=Ye(n,t.hiddenPhraseIds,t.knownPhraseIds);if(he(s,e)===i)return t;let r=i?n.filter(a=>he(s,a)||a.toUpperCase()===e.toUpperCase()):s.filter(a=>a.toUpperCase()!==e.toUpperCase()),o=ua(n,r);return Je(Je(t,"hiddenPhraseIds",o.hiddenPhraseIds),"knownPhraseIds",o.knownPhraseIds)}function Dr(t){if(t!==void 0)return{agent:t.defaultAssistAgentId,engine:t.defaultTTSEngine,speakers:t.defaultSpeakers??[]}}function ha(t,n,e,i,s){return Be(t,n,e,r=>{if(!Q(T(r)).includes(i))return r;let o=pe(r),a=tn(o,i,s);return a===o?r:Ot(r,"voiceConfig",a)})}function pa(t,n,e,i,s,r){return Be(t,n,e,o=>{if(!Q(T(o)).includes(i))return o;let a=pe(o),d=Er(a,i,s,r);return d===a?o:Ot(o,"voiceConfig",d)})}function ma(t,n,e,i,s,r){return Be(t,n,e,o=>T(o)==="ttsMenu"?Hr(o,i,s,r):o)}function Nr(t){return Object.keys(pe(t)).some(n=>Q(T(t)).includes(n))}function _r(t){let n=T(t);return Q(n).length>0||n==="ttsMenu"}function Wr(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function fa(t,n,e,i){let s=rs(t.hass.states),r=Lt(s,e),o=a=>F(a.missing?`${a.entityId} (not found)`:a.name,e.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${r.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:r.map(o)}
    </div>`}function ga(t,n,e,i){let s=V(e),r=Dr(t.voice?.defaults),o=s?.domain==="conversation"?is(t.hass.states):ss(t.hass.states,Object.keys(t.hass.services?.tts??{}),void 0),a=Lt(o,i===""?[]:[i]);return[["",nn(n,e,r,u=>a.find(l=>l.entityId===u&&!l.missing)?.name??Wr(t.hass,u))],...a.map(u=>[u.entityId,u.missing?`${u.entityId} (not found)`:u.name])]}function wa(t,n,e,i,s){let r=V(s);if(r===void 0||!Ar(i,s))return h;let o=Or(s),a=ee(i,s),d=(u,l)=>t.edit(f=>ha(f,n,e,s,u),l);switch(r.type){case"enum":return J(o,String(a),Ge(i,s),u=>d(u),{snapBack:!0,def:String(r.default)});case"bool":return F(o,a===!0,u=>d(u),r.default);case"int":{let u=typeof a=="number"?a:Number(r.default),l=ze.volume,[f,w]=r.clamp??[l.min,l.max];return c`${ye(o,u,p=>d(p,`slot:${e}:${s}`),{min:f,max:w,step:l.step,def:Number(r.default),format:p=>`${Math.round(p)}${l.unit}`})}
        <div class="ts-after">${l.presets.map(p=>c`<button type="button" class="pe-chip ${p.value===u?"on":""}"
          aria-pressed=${p.value===u?"true":"false"} @click=${()=>d(p.value)}>${p.label} ${p.value}%</button>`)}</div>`}case"entity":{let u=typeof a=="string"?a:"";return J(o,u,ga(t,i,s,u),l=>d(l===""?void 0:l),{snapBack:!0})}case"array":{let u=Array.isArray(a)?a:[],l=Dr(t.voice?.defaults),f=r.whenBlank!==void 0?`None picked: ${r.whenBlank}.`:r.fallsBackTo!==void 0?`None picked: ${nn(i,s,l,w=>Wr(t.hass,w))}.`:"None picked.";return c`${fa(t,o,u,(w,p)=>t.edit(g=>pa(g,n,e,s,w,p)))}
        <div class="hint ${u.length===0&&r.fallsBackTo===void 0&&r.whenBlank===void 0?"warn":""}">${u.length===0?f:`${u.length} picked.`}</div>`}}}function ba(t,n,e){let i=typeof e.id=="string"?e.id:"",s=pe(e),r=Q(T(e));return c`${t.voice?.defaults===void 0?c`<div class="hint">${er}.</div>`:h}
    ${r.map(o=>wa(t,n,i,s,o))}`}function ya(t,n,e){let i=typeof e.id=="string"?e.id:"",s=t.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let r=s.map(l=>l.id),o=Ye(r,e.hiddenPhraseIds,e.knownPhraseIds),a=Array.isArray(e.knownPhraseIds)?e.knownPhraseIds.filter(l=>typeof l=="string"):[],d=a.length>0&&r.some(l=>!a.some(f=>f.toUpperCase()===l.toUpperCase())),u=l=>o.some(f=>f.toUpperCase()===l.toUpperCase());return c`<div class="me-sub-h">${en("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(l=>F(l.name,u(l.id),f=>t.edit(w=>ma(w,n,i,r,l.id,f))))}
    </div>
    <div class="hint">${o.length===0?"No phrase shows: the list on the watch is empty.":`${o.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:h}`}function Vr(t,n,e){let i=T(e);if(i==="ttsMenu")return ya(t,n,e);if(Q(i).length>0)return ba(t,n,e)}function Ur(t,n){let e=T(n);if(e==="ttsMenu"){let o=t.voice?.phrases;return o===void 0?"":`${Ye(o.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${o.length} phrases`}let i=pe(n),s=Q(e)[0];if(s===void 0)return"";let r=ee(i,s);return Ge(i,s).find(([o])=>o===r)?.[1]??""}function Kr(t,n,e,i,s,r,o=""){return c`<div class="mi-look">
    <div class="mi-look-title">${di(t,n,e,d=>r(d),d=>i.find(([u])=>u===d)?.[1]??d)}</div>
    <div class="mi-pics ${o}" role="group" aria-label=${t} style=${`--n:${i.length}`}>
      ${i.map(([d,u])=>{let l=d===n;return c`<button type="button" class="mi-pic ${l?"on":""}" aria-pressed=${l?"true":"false"} aria-label=${`${t}: ${u}`}
          @click=${()=>{d!==n&&r(d)}}>${s(d)}<span class="mi-pic-name">${u}</span></button>`})}
    </div>
  </div>`}function Qe(t,n,e,i,s){return c`<div class="mi-switch">${F(t,n,e,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function va(t){return c`<div class="mi-wrap">${t}</div>`}function et(t,n){return oe(t).find(e=>e.key===n)}function sn(t,n){return typeof t=="number"&&typeof n=="number"?Math.abs(t-n)<1e-9:typeof t=="string"&&typeof n=="string"?t.toUpperCase()===n.toUpperCase():t===n}function tt(t,n,e){return oe(n).some(i=>e.includes(i.key)&&je(t,n,i)&&!sn(Z(t,n,i),i.default))}function Ze(t,n,e){let i=et(n,e);if(i===void 0)return;let s=`style:${n}:${e}`;return{field:i,value:Z(t.document,n,i),set:(r,o=!1)=>t.edit(a=>Ds(a,n,e,r),o?s:void 0)}}function rn(t){return typeof t.value=="number"?t.value:Number(t.field.default)}function nt(t,n){return n===void 0?h:ye(t,rn(n),e=>n.set(e,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function Br(t,n,e,i){if(n===void 0)return h;let s=n.value===!0?"on":"off",r=n.field.default===!0?"on":"off";return Kr(t,s,r,[["off",e[0]],["on",e[1]]],o=>i(o==="on"),o=>n.set(o==="on"))}var jr=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],zr=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],qr=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function xa(t){return c`<span class="mi-well mi-backdrop ${t?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function ka(t){return c`<span class="mi-well mi-buttons ${t?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function $a(t){if(t===void 0)return h;let n=rn(t),e=(t.field.presets??qr.map(([s,r])=>({value:s,label:r}))).map(s=>[String(s.value),qr.find(([r])=>sn(r,s.value))?.[1]??s.label]),i=e.find(([s])=>sn(Number(s),n))?.[0]??"";return c`${G("How dark",i,e,s=>t.set(Number(s)),{def:String(t.field.default)})}
    ${nt("Exact",t)}`}function Jr(t){let n=i=>Ze(t,"quickAction",i),e=n("showContextLabel");return c`
    ${Br("Behind the ring",n("showIconBubble"),["Solid","Glass"],xa)}
    ${$a(n("backgroundDim"))}
    ${Br("Buttons",n("showNeonOutline"),["Plain","Neon"],ka)}
    ${e===void 0?h:Qe("Names under the buttons",e.value===!0,i=>e.set(i),e.field.default===!0,"Each slot's name shows under its button.")}
    ${nt("Glow",n("glowIntensity"))}`}function Gr(t){let n=e=>{let i=et("quickAction",e);return i===void 0?void 0:Z(t,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function Sa(){let t=ue("BeamStyle");return[...t.filter(([n])=>n==="none"),...t.filter(([n])=>n!=="none")]}function Ma(t){let n=M``;switch(t){case"sectorWedge":n=M`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=M`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=M`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=M`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=M`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function Ta(t,n){if(n===void 0||!je(t.document,"quickAction",n.field))return h;let e=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${De("Beam color",e,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?h:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let r=s.toUpperCase()===e.toUpperCase();return c`<button type="button" class="ts-swatch ${r?"on":""}" aria-pressed=${r?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function Yr(t){let n=o=>Ze(t,"quickAction",o),e=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),r=n("showFingerShadow");return c`
    ${e===void 0?h:va(G("Opening",String(e.value),ue("EntranceStyle"),o=>e.set(o),{def:String(e.field.default)}))}
    ${i===void 0?h:Kr("Beam from your finger to the slot",String(i.value),String(i.field.default),Sa(),Ma,o=>i.set(o),"beams")}
    ${Ta(t,n("beamColor"))}
    ${s===void 0||!je(t.document,"quickAction",s.field)?h:nt("Beam strength",s)}
    ${r===void 0?h:Qe("Finger shadow",r.value===!0,o=>r.set(o),r.field.default===!0,"A soft dark spot where your finger rests.")}`}function Zr(t){let n=s=>{let r=et("quickAction",s);return r===void 0?"":String(Z(t,"quickAction",r))},e=(s,r)=>ue(s).find(([o])=>o===r)?.[1]??r,i=n("beamStyle");return`Opening ${e("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${e("BeamStyle",i).toLowerCase()} beam`}`}var Xr=["glowIntensity","selectedScale"];function me(t){return Math.round(t*1e3)/10}function Qr(t){let n=Ze(t,"pageSwitcher","glowIntensity"),e=Ze(t,"pageSwitcher","selectedScale");return c`${nt("Glow",n)}
    ${e===void 0?h:ye("Picked page size",me(rn(e)),i=>e.set(Math.round(i*100)/1e4,!0),{min:me(e.field.min??1),max:me(e.field.max??1.5),step:me(e.field.step??.05),def:me(Number(e.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function eo(t){let n=et("pageSwitcher","selectedScale"),e=n===void 0?void 0:Z(t,"pageSwitcher",n);return typeof e=="number"?`Picked page ${Math.round(me(e))}%`:""}function Xe(t,n,e,i){return t.render(n,e,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var to=["light","switch","lock","cover","climate","media_player"],Ra={media_player:"Media player"};function no(t,n,e,i,s){let r=e.some(a=>a.domain===n),o=r?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${e.map(a=>{let d=a.domain===n,u=Ra[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${d?"on":""}" aria-pressed=${d?"true":"false"} data-type=${a.domain}
          @click=${()=>{d||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${Xe(t,a.icon,16,a.color)}</span><span class="mi-pic-name">${u}</span></button>`})}
    </div>
    ${J("More types",r?"":n,o,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function io(t,n,e,i){return c`<div class="mi-acts">${e.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(r=>{let o=r.raw===n,a=!o&&r.why!==void 0;return c`<button type="button" class="mi-act ${o?"on":""}" aria-pressed=${o?"true":"false"} ?disabled=${a} data-action=${r.raw}
        title=${r.why??h} @click=${()=>{o||i(r.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${Xe(t,r.icon,14,r.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${r.label}</span>
          ${r.why===void 0||o?h:c`<small class="mi-act-why">${r.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var Pa=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function Fr(t){return t.here?t.holder===void 0?`${t.label}, here now`:`${t.label}, here now, shared with ${t.holder.name}`:t.holder===void 0?`${t.label}, move here`:`${t.label}, swap with ${t.holder.name}`}function so(t,n,e,i){let s=new Map(e.map(o=>[o.position,o])),r=o=>{if(o===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(o);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let d=a.here?"here":a.holder===void 0?"free":"held",u=a.here?Xe(t,n.icon,14,n.color):a.holder===void 0?S("plus"):Xe(t,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${d}" data-place=${o} aria-label=${Fr(a)} title=${Fr(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:h}
      @click=${()=>{a.here||i(o)}}>${u}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${Pa.map(o=>o.map(r))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var ro=j`
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
`;var lo=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]];function uo(t){return t==="entity"?["entity"]:["anywhere","switcher"]}var ho="Each page's icon, color and name are set here: pick a page in the Pages card.",Ca="Pick a page in the Pages card to set how it shows here.",Ia={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},po={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:ho},La="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Aa="Click a slot or its label to edit it. Click anywhere else for the menu's look.",we=.36,cn=44,dn=22;function mo(t,n){let e=Math.min(t.width,t.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*e/t.width),y:i(.5+(n.y-.5)*e/t.height)}}function Oa(t,n,e=we){let i=(270-t*360/Math.max(1,n))*Math.PI/180,s=r=>Math.round(r*1e4)/1e4;return{x:s(.5+e*Math.cos(i)),y:s(.5+e*Math.sin(i))}}var fo="wrist-assistant-panel.menus.zoom.v1";function go(t=pt()){try{let n=t?.getItem(fo);if(n==null||n==="")return;let e=Number(n);return Oi.includes(e)?e:void 0}catch{return}}function wo(t,n=pt()){try{n?.setItem(fo,t===void 0?"":String(t))}catch{}}var bo={name:{color:D.place,icon:"text"},slot:{color:D.content,icon:"content"},where:{color:D.position,icon:"place"},look:{color:D.look,icon:"look"},shows:{color:D.states,icon:"states"},menu:{color:D.content,icon:"content"},style:{color:D.look,icon:"look"},motion:{color:D.look,icon:"radial"},switcherPage:{color:D.content,icon:"watch"}},Ea="#26a69a",Ha=D.complication,H="menu-editor";function Me(t,n,e){return`${t} ${t===1?n:e}`}function fe(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function yo(t,n){return{entityId:n,displayName:n===""?"":fe(t,n),domain:Ve(n)}}function Re(t,n,e,i){return t.icons.render(n,e,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function N(t){return le(T(t))===void 0?{icon:ve.unknownActionIcon,color:ve.unknownActionColor}:{icon:typeof t.icon=="string"&&t.icon!==""?t.icon:"circle",color:typeof t.color=="string"?t.color:"#FFFFFF"}}function vo(t){let n=T(t);if(n==="triggerEntity"){let i=xe(t).entityId;return Ht(Ve(typeof i=="string"?i:""))}let e=le(n);return e===void 0?void 0:{icon:e.icon,color:e.color}}function C(t,n){return t.toUpperCase()===n.toUpperCase()}function Da(t,n){return t.toUpperCase()===n.toUpperCase()}function Na(t,n){let e=T(n),i=xe(n),s=le(e);for(let r of s?.payload??[]){let o=i[r.key];if(!(typeof o!="string"||o==="")){if(r.type==="entity")return fe(t.hass,o);if(r.target==="page")return t.targets.pages.find(a=>C(a.id,o))?.name??"A page not in the pages";if(r.target==="statusPage")return t.targets.statusPages.find(a=>C(a.id,o))?.name??"A status page";if(r.target==="httpAction")return t.targets.httpActions.find(a=>C(a.id,o))?.name??"An HTTP action";if(r.target==="ttsPhrase"){let a=t.targets.phrases;return a?.find(d=>C(d.id,o))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function ae(t,n){return Na(t,n)??re(T(n))}function ge(t){return ke(t)?.label??t}var xo="me:menu",ko="me:er:mode",$o="me:er:domain",an="me:er:entity",on="me:er:add";function R(t){let n=t.uiState.get(xo);return n==="entity"||n==="switcher"?n:"anywhere"}function So(t,n){n!==R(t)&&t.uiState.delete(Te),t.uiState.set(xo,n),t.requestUpdate()}function ln(t,n){for(let e of[...t.uiState.keys()])e.startsWith(Lo)&&t.uiState.delete(e);t.uiState.delete(Te),So(t,n)}var Te="me:sw:page";function Mo(t){return t.switcherRows??t.switcherPages.map(n=>({...n,hidden:!1}))}function te(t){if(R(t)!=="switcher")return;let n=t.uiState.get(Te);if(typeof n=="string")return Mo(t).find(e=>C(e.id,n))}function un(t,n){n===void 0?t.uiState.delete(Te):t.uiState.set(Te,n),t.requestUpdate()}function To(t){let n=te(t);return n===void 0?void 0:t.switcherSettings?.(n.id)}function hn(t){return lo.find(([n])=>n===t)?.[1]??t}function Ro(t){return t.uiState.get(ko)==="entity"?"entity":"domain"}function Po(t){let n=t.uiState.get($o);return typeof n=="string"&&ke(n)!==void 0?n:"light"}function Co(t){let n=$e(t.document),e=t.uiState.get(an);return typeof e=="string"&&n.includes(e)?e:n[0]}function B(t){switch(R(t)){case"anywhere":return Ue;case"entity":return pn(t);case"switcher":return}}function pn(t){if(Ro(t)==="domain")return{list:"domain",domain:Po(t)};let n=Co(t);return n===void 0?void 0:{list:"entity",entityId:n}}function Io(t,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${ge(n.domain)} menu`:`${fe(t.hass,n.entityId)} menu`}var Lo="me:sel:";function Ao(t){return`${Lo}${ws(t)}`}function ce(t,n){let e=t.uiState.get(Ao(n));if(typeof e=="string")return W(t.document,n).find(i=>C(P(i),e))}function be(t,n,e){t.uiState.set(Ao(n),e),t.requestUpdate()}function Pe(t){if(te(t)!==void 0)return un(t,void 0),!0;let n=B(t);return n===void 0||ce(t,n)===void 0?!1:(be(t,n,void 0),!0)}function it(t,n,e){let i;t.edit(s=>{let r=$s(s,n,{...e===void 0?{}:{position:e},targets:t.targets});return i=r.id,r.document}),i!==void 0&&be(t,n,i)}function oo(t){let e=(i,s)=>Math.round((s+(i-.5)/we*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${cn} ${dn}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${t.map(i=>M`<circle cx=${e(i.x,22)} cy=${e(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function _a(t,n){return n===void 0?[]:W(t.document,n).flatMap(e=>{if(e.isVisible===!1)return[];let i=Fe(typeof e.position=="string"?e.position:"");return i===void 0?[]:[{...i,color:N(e).color}]})}function Wa(t,n){if(n==="switcher")return Me(t.switcherPages.length,"page","pages");let e=n==="anywhere"?Ue:pn(t);return e===void 0?"none yet":Me(W(t.document,e).length,"slot","slots")}function Va(t,n){if(n==="switcher"){let e=t.switcherPages;return oo(e.map((i,s)=>({...Oa(s,e.length),color:i.color})))}return oo(_a(t,n==="anywhere"?Ue:pn(t)))}var Ua="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function Oo(t){let n=R(t);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${cn}px; --thumb-h: ${dn}px`}>
    <div class="lc-head">
      <span class="swatch">${S("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${La}>on the watch</span>
    </div>
    <p class="me-intro">${Ua}</p>
    <div class="layers me-menu-list" role="list">
      ${lo.filter(([e])=>t.sections===void 0||t.sections.includes(e)).map(([e,i])=>{let s=e===n,r=()=>{s||So(t,e)},o=t.menuBadge?.(e);return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${e} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${po[e]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          ${Va(t,e)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${Wa(t,e)}</span>${o===void 0?h:c`<span class="badge me-named" title=${`This device uses "${o}"`}>${o}</span>`}</b><small>${Ia[e]}</small>
            ${t.menuFoot?.(e)??h}</span>
        </div>`})}
    </div>
  </section>`}function Ba(t,n,e){return c`<span class="thumb me-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="me-thumb-glyph">${Re(t,n,14,e)}</span></span>`}function ao(t,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${ge(n.domain)} menu, by type`:`${fe(t.hass,n.entityId)}'s own menu`}function qa(t){return t.hidden?"Not in the switcher":t.text===void 0?"Shown as its icon":t.text===t.name?"Shown by name":`Shown as ${t.text}`}function Fa(t,n,e){let i=e!==void 0&&C(e.id,n.id),s=qa(n),r=()=>un(t,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${o=>{o.target instanceof Element&&o.target.closest("button")||r()}}
    @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Ba(t,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:h}</span></span>
  </div>`}function Ka(t){let n=Mo(t),e=te(t),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${cn}px; --thumb-h: ${dn}px`}>
    <div class="lc-head">
      <span class="swatch">${S("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${Me(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>Fa(t,s,e))}</div>`}
  </section>`}function Eo(t){return R(t)==="switcher"?Ka(t):h}function Ho(t){if(R(t)==="switcher")return[Me(t.switcherPages.length,"page","pages")];let n=B(t);if(n===void 0)return[ao(t,n)];let e=Me(W(t.document,n).length,"slot","slots");return n.list==="anywhere"?[e]:[ao(t,n),e]}function Do(t){return R(t)==="switcher"?ho:B(t)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Aa}function No(t,n){return Di(t.uiState,H,n)}function ja(t,n){Ni(t.uiState,H,n,!No(t,n)),t.requestUpdate()}function za(t){if(To(t)!==void 0)return[{module:H,section:"switcher-page"}];let n=B(t),e=n===void 0?void 0:ce(t,n);if(e!==void 0)return[{module:H,section:"slot"},{module:H,section:"where"},..._r(e)?[{module:H,section:"voice"}]:[],{module:H,section:"look"},...n?.list==="anywhere"?[{module:H,section:"shows"}]:[]];let i=R(t);return i==="anywhere"?[{module:H,section:"style-anywhere"},{module:H,section:"motion-anywhere"}]:[{module:H,section:i==="entity"?"menu":`style-${i}`}]}function U(t,n,e,i,s,r={}){let o=No(t,e),a=bo[n];return Un({color:a.color,icon:S(a.icon),title:i,open:o,onToggle:()=>ja(t,e),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${H}:${e}`},o?s:c``)}function _o(t){let n=R(t),e=hn(n),i=B(t),s=i===void 0?void 0:ce(t,i),r=za(t),o=_i(t.uiState,r),a=te(t),d=To(t),u,l;if(a!==void 0&&d!==void 0)u=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>un(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Ha}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,l=Ja(t,d);else if(s===void 0||i===void 0)u=c`<div class="crumbs"><span class="kchip" style=${`--k:${Ea}`}>Menu</span><span class="nm" title=${e}>${e}</span></div>`,l=bc(t,n);else{let f=ae(t,s);u=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>be(t,i,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${N(s).color}`}>Slot</span><span class="nm" title=${f}>${f}</span></div>`,l=pc(t,i,s)}return c`<div class="insp-head">
      ${u}
      <button class="expand" @click=${()=>{Wi(t.uiState,r,!o),t.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${l}</div>`}function Ja(t,n){let e=n.page;return U(t,"switcherPage","switcher-page",jt,c`<fieldset class="ts-body me-body" ?disabled=${t.busy} aria-label=${jt}>${ar(n)}</fieldset>`,{summary:or(e),dot:rr(e)})}var Ga={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function Wo(t,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":t==="runScene"?"Scene":t==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Ga[n.key]??n.key}var Ya={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function Vo(t){return re(t).replace(/ - (.+)$/," ($1)")}function Za(t,n){if(n==="entityControl"){let e=bs(t)??"all";return e==="all"?"Any entity":ge(e)}return Ya[n]??us(n)}function Xa(t,n,e){let i=T(e),s=xs(n),r=a=>{let d=le(a),u=d===void 0?{icon:ve.unknownActionIcon,color:ve.unknownActionColor}:d,l=a===i?void 0:hs(a,t.targets);return{raw:a,label:Vo(a),icon:u.icon,color:u.color,...l===void 0?{}:{why:l}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[r(i)]}],...s.map(a=>({heading:Za(n,a.category),tiles:a.actions.map(r)}))]}function Qa(t){return t.needsSetup===!0?`${t.name} (${t.source==="home"?"needs setup":"needs setup on the iPhone"})`:t.source==="iphone"?`${t.name} (on the iPhone)`:t.name}function co(){return c`<button type="button" class="link" @click=${Ir}>Open HTTP actions</button>`}function ec(t,n,e){let i=n.find(s=>C(s.id,e));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${co()}</div>`:t.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${ts} ${co()}</div>`:!t.catalogKnown&&t.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:h}function tc(t,n,e,i,s){let r=P(e),o=xe(e)[s.key],a=typeof o=="string"?o:"",d=s.target==="page"?t.targets.pages:s.target==="statusPage"?t.targets.statusPages:s.target==="ttsPhrase"?t.targets.phrases??[]:t.targets.httpActions,u=a===""||d.some(m=>C(m.id,a)),l=m=>t.edit(x=>Wt(x,n,r,s.key,m===""?void 0:m)),f=s.target==="statusPage"&&t.statusPagesKnown===!0,w=s.target==="httpAction"&&t.httpLibrary==="held"&&!t.catalogKnown,p=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?t.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":f?`Not in this ${z(t.device??"watch")}'s status pages`:w?es:Zi,g=m=>s.target==="httpAction"?Qa(m):m.name;return c`<label class="field"><span>${Wo(i,s)}</span>
    <select .value=${He(d.find(m=>C(m.id,a))?.id??a)} @change=${m=>l(m.target.value)}>
      ${s.required===!0?h:c`<option value="" ?selected=${a===""}>None</option>`}
      ${u?h:c`<option value=${a} selected>${p}</option>`}
      ${d.map(m=>c`<option value=${m.id} ?selected=${C(m.id,a)}>${g(m)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?t.device==="iphone"?c`<div class="hint ts-under">${_s}</div>`:t.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:h:s.target==="statusPage"?f||t.catalogKnown?h:c`<div class="hint ts-under">${Ae("status pages",t.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?ec(t,t.targets.httpActions,a):h}`}function nc(t,n,e,i,s){let r=P(e),o=xe(e),a=(l,f)=>t.edit(w=>Wt(w,n,r,s.key,l),f),d=Wo(i,s),u=Vt(e,s);switch(s.type){case"entity":{let l=typeof o[s.key]=="string"?o[s.key]:"",f=i==="runScene"?"scene":i==="runScript"?"script":ms();return c`<div class="ts-stack">${wt({hass:t.hass},d,yo(t.hass,l),w=>a(w.entityId),`me:entity:${r}`,{domain:f,clearable:!1,needed:l===""})}</div>
        ${l===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:h}`}case"uuid":return tc(t,n,e,i,s);case"enum":{if(s.key==="triggerMode"){let w=Ve(typeof o.entityId=="string"?o.entityId:""),p=ps(w),g=typeof u=="string"?u:p[0]??"",m=p.map(x=>[x,Et(x)]);return p.includes(g)||m.unshift([g,Et(g)]),J(d,g,m,x=>a(x),{snapBack:!0})}let l=ue(s.enum),f=typeof u=="string"?u:String(s.default??"");return l.length<=4?G(d,f,l,w=>a(w)):J(d,f,l,w=>a(w),{snapBack:!0})}case"bool":return F(d,u===!0,l=>a(l),s.default);case"number":{if(s.key==="bannerSeconds"&&Vt(e,{key:"showBanner",type:"bool",default:!0})===!1)return h;let l=typeof o[s.key]=="number"?o[s.key]:void 0;return hi(d,l,f=>a(f,`slot:${r}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function ic(t,n,e){if(!Nt(n,e))return h;let i=P(e);return c`<div class="ts-stack">${G("Skip conditions",Ys(_t(e)),Gs,s=>t.edit(r=>Rs(r,n,i,Zs(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function sc(t){let n=Ke(t);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(ge).join(", ")}function rc(t,n){let e=P(n),i=Ke(n),s=i===void 0,r=d=>t.edit(u=>As(u,e,d)),o=Ls(),a=(i??[]).filter(d=>!Ut(d));return c`<div class="mi-wrap">${G("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],d=>r(d==="every"?void 0:o.slice(0,1)),{def:"every"})}</div>
    ${s?h:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...o,...a].map(d=>{let u=i.includes(d),l=!Ut(d);return c`<button type="button" class="pe-chip ${u?"on":""} ${l?"odd":""}" aria-pressed=${u?"true":"false"}
          title=${l?"Not reported by the watch":h}
          @click=${()=>r(u?i.filter(f=>f!==d):[...i,d])}>${ge(d)}</button>`})}
    </div>
    ${a.length===0?h:c`<div class="hint warn">${a.map(ge).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function oc(t,n){return Nt(n,t)&&_t(t)!==null}function ac(t){return t.isVisible===!1}function cc(t){return Ke(t)!==void 0}function dc(t){let n=vo(t);if(n===void 0)return!1;let e=N(t);return e.icon!==n.icon||!Da(e.color,n.color)}function lc(t,n){let e=bo.name;return c`<section class="sec name-sec" data-open="true" style=${`--c:${e.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${S(e.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${ae(t,n)}</span>
    </div>
  </section>`}function uc(t){let n=Y(t);return n.charAt(0)+n.slice(1).toLowerCase()}function hc(t,n,e){let i=P(e),s=W(t.document,n).filter(r=>!C(P(r),i));return qe().map(r=>{let o=s.find(d=>d.position===r),a={position:r,label:uc(r),here:e.position===r};return o!==void 0&&(a.holder={name:ae(t,o),...N(o)}),a})}function pc(t,n,e){let i=P(e),s=T(e),r=le(s),o=N(e),a=vo(e),d=typeof e.position=="string"?e.position:"",u=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="What it does">
    ${r===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:h}
    ${io(t.icons,s,Xa(t,n,e),p=>t.edit(g=>Is(g,n,i,p,t.targets)))}
    ${r?.description?c`<div class="mi-desc">${r.description}</div>`:h}
    ${ks(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:h}
    ${(r?.payload??[]).map(p=>nc(t,n,e,s,p))}
    ${ic(t,n,e)}
  </fieldset>`,l=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Where">
    ${so(t.icons,o,hc(t,n,e),p=>t.edit(g=>Ms(g,n,i,p)))}
    ${F("Shown on the watch",e.isVisible!==!1,p=>t.edit(g=>Ts(g,n,i,p)),!0)}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Icon and color">
    <div class="ts-stack">${pi({icons:t.icons,symbols:t.symbols},typeof e.icon=="string"?e.icon:"",p=>t.edit(g=>Ps(g,n,i,p),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof e.color=="string"?e.color:a?.color})}</div>
    <div class="ts-no-alpha">${De("Color",typeof e.color=="string"?e.color:void 0,p=>{p!==void 0&&t.edit(g=>Cs(g,n,i,p),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,w=Vr(t,n,e);return c`${lc(t,e)}
    ${U(t,"slot","slot","What it does",u,{summary:Vo(s),dot:oc(e,n)})}
    ${U(t,"where","where","Where",l,{summary:`${Y(d)}${e.isVisible===!1?", hidden":""}`,dot:ac(e)})}
    ${w===void 0?h:U(t,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${t.busy} aria-label="Voice">${w}</fieldset>`,{summary:Ur(t,e),dot:Nr(e)})}
    ${U(t,"look","look","Icon and color",f,{summary:o.icon,dot:dc(e)})}
    ${n.list==="anywhere"?U(t,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Shows on">${rc(t,e)}</fieldset>`,{summary:sc(e),dot:cc(e)}):h}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this slot from the menu"
        @click=${()=>t.edit(p=>Ss(p,n,i))}>${S("delete")}<span>Remove</span></button>
    </div>`}function mc(t){let n=tt(t.document,"quickAction",jr),e=tt(t.document,"quickAction",zr);return c`${U(t,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${t.busy} aria-label="Look">
      ${Jr(t)}
    </fieldset>`,{summary:Gr(t.document),dot:n})}
    ${U(t,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${t.busy} aria-label="Motion">
      ${Yr(t)}
    </fieldset>`,{summary:Zr(t.document),dot:e})}`}function fc(t){let n=tt(t.document,"pageSwitcher",Xr);return U(t,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${t.busy} aria-label="Look">
    ${Qr(t)}
  </fieldset>`,{summary:eo(t.document),dot:n})}function gc(t){let n=Ro(t),e=a=>{t.uiState.set(ko,a),t.requestUpdate()},i=G("Edit",n,[["domain","By type"],["entity","By entity"]],a=>e(a)),s,r,o=!1;if(n==="domain"){let a=Po(t),d=ke(a),u=gs(a),l=fs().map(p=>[p.domain,p.label]),f=to.flatMap(p=>{let g=ke(p);return g===void 0?[]:[{domain:g.domain,label:g.label,icon:g.icon,color:Ht(g.domain).color}]}),w=d?.inheritKey?ys(t.document,a):!1;o=w,r=`By type \xB7 ${d?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${no(t.icons,a,f,l,p=>{t.uiState.set($o,p),t.requestUpdate()})}
      ${u.length>0?c`<div class="hint ts-under keep">The same menu as ${u.map(p=>p.label).join(", ")}.</div>`:h}
      ${d?.inheritKey?Qe("Fill gaps with the All menu",w,p=>t.edit(g=>Os(g,a,p)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):h}`}else{let a=$e(t.document),d=Co(t);r=`By entity \xB7 ${d===void 0?"none yet":fe(t.hass,d)}`;let u=l=>{let f=l.entityId.trim();f!==""&&(t.edit(w=>Es(w,f)),t.uiState.set(an,f),t.uiState.set(on,(Number(t.uiState.get(on)??0)||0)+1),t.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:h}
      ${a.map(l=>{let f=l===d;return c`<div class="me-entity ${f?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${f?"true":"false"}
            @click=${()=>{t.uiState.set(an,l),t.requestUpdate()}}>
            <b>${fe(t.hass,l)}</b><code>${l}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>t.edit(w=>Hs(w,l))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${wt({hass:t.hass},"Add an entity",yo(t.hass,""),u,`me:er:add:${String(t.uiState.get(on)??0)}`,{clearable:!1})}
      </div>
    </div>`}return U(t,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${t.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:r,dot:o})}var wc="Click a slot on the watch to change what it does.";function bc(t,n){let e=n==="anywhere"?mc(t):n==="switcher"?fc(t):gc(t);return c`<p class="me-menu-note">${po[n]}</p>${e}
    <p class="me-menu-note me-pick-note">${n==="switcher"?Ca:wc}</p>`}var Uo=j`
  /* The Menus and Slots cards: the page editor's Pages and Tiles cards. */
  .me-menus-card > .layers, .me-slots-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .me-intro { margin: 2px 12px 4px; font-size: 12.5px; line-height: 1.45; color: var(--wa-label); }
  .me-menus-card > .lc-note, .me-slots-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  /* A Menus row: its name and count over the line that says when it
     opens, which wraps rather than being cut. */
  .me-menu-row { padding-top: 6px; padding-bottom: 6px; align-items: start; }
  .me-menu-row > .thumb { margin-top: 1px; }
  .me-menu-row .name b { white-space: normal; flex-wrap: wrap; column-gap: 8px; row-gap: 0; }
  .me-menu-row .name b .nm-t { white-space: normal; overflow: visible; }
  .me-menu-row .name .me-menu-count { font-size: 12px; font-weight: 500; color: var(--wa-muted); white-space: nowrap; }
  .me-menu-row .name small { white-space: normal; overflow: visible; line-height: 1.35; }
  .me-menu-row .name .me-lib { margin-top: 6px; }
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
  /* The page switcher's Color heading, as the tile settings draw one. */
  .ts-sub-h { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-top: 6px;
    font-size: 11.5px; font-weight: 650; color: var(--wa-muted); letter-spacing: .02em; }
  .ts-swatches { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .ts-swatches > .ts-color-default { min-height: 24px; margin-right: 2px; }
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
`;var yc=["spring","popIn","fade","none"],vc=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Ce(t,n,e){let i=oe(n).find(s=>s.key===e);return i===void 0?void 0:Z(t,n,i)}function Ie(t,n,e,i){let s=oe(n).find(a=>a.key===e),r=Ce(t,n,e),o=typeof r=="number"&&Number.isFinite(r)?r:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,o))}function st(t,n){return Ce(t,"quickAction",n)===!0}function xc(t){return typeof t=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(t)?t:"#FFFFFF"}function rt(t){let n=Ce(t,"quickAction","entranceStyle"),e=Ce(t,"quickAction","beamStyle");return{glass:st(t,"showIconBubble"),neon:st(t,"showNeonOutline"),labels:st(t,"showContextLabel"),finger:st(t,"showFingerShadow"),entrance:yc.includes(n)?n:"none",dim:Ie(t,"quickAction","backgroundDim",1),beam:vc.includes(e)?e:"none",beamColor:xc(Ce(t,"quickAction","beamColor")),beamIntensity:Ie(t,"quickAction","beamIntensity",.5),glow:Ie(t,"quickAction","glowIntensity",.5)}}function kc(t){return{glow:Ie(t,"pageSwitcher","glowIntensity",.5),scale:Ie(t,"pageSwitcher","selectedScale",1.2)}}var fn="ms:play",$c=1500;function Sc(t){let n=t.uiState.get(fn);t.uiState.set(fn,{menu:R(t),count:(n?.count??0)+1,at:Date.now()}),t.requestUpdate()}function Mc(t){let n=t.uiState.get(fn);return n===void 0||n.menu!==R(t)||Date.now()-n.at>$c?"":n.count%2===1?"ms-play-a":"ms-play-b"}function Fo(t,n){let e=W(t,n),i=vs(t,n),s=new Set(Dt(t,n));return qe().map(r=>{let o=e.filter(l=>l.position===r),a=o.find(l=>l.isVisible!==!1),d=a===void 0?i.find(l=>l.position===r&&l.isVisible!==!1):void 0,u=a??(d===void 0?o[0]:void 0);return{position:r,own:o,main:u,second:o.find(l=>l!==u),shared:d,free:s.has(r)}})}function Tc(t,n){let e=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&e(n)){let s=P(n),r=t.find(o=>o.main!==void 0&&C(P(o.main),s));if(r!==void 0)return{position:r.position,slot:n}}let i=t.flatMap(s=>{let r=e(s.main)?s.main:s.shared;return r===void 0?[]:[{position:s.position,slot:r}]});return i.find(s=>s.position==="topCenter")??i[0]}var v=t=>Math.round(t*100)/100;function wn(t,n){let e=mo(t,n);return{...e,px:e.x*t.width,py:e.y*t.height}}function mn(t,n,e,i){return Ko(t,n,wn(t.screen,e),i)}function Ko(t,n,e,i){let{width:s,height:r}=t.screen,o=t.scale,a=[`left:${e.x*100}%`,`top:${e.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${v((s/2-e.px)*o)}px`,`--fy:${v((r/2-e.py)*o)}px`),n.finger){let d=e.px-s/2,u=e.py-r/2,l=Math.hypot(d,u);l>1&&a.push(`--sx:${v(d/l*5*o)}px`,`--sy:${v(u/l*5*o)}px`)}return a.join(";")}function gn(t,n){return Math.round(n*t.scale)}function Rc(t,n,e,i,s){let r=wn(t.screen,e),o=(n.glass?28:25)*(r.y>.5?-1:1),a=(r.py+o)/t.screen.height;return c`<span class="ms-name" aria-hidden="true" style=${`left:${r.x*100}%;top:${v(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function Pc(t){let{width:n,height:e}=t,i=n*.08,s=n*.045,r=e*.18,o=(n-i*2-s)/2,a=(e-r-i-s*2)/3,d=[0,1,2,3,4,5].map(u=>{let l=i+u%2*(o+s),f=r+Math.floor(u/2)*(a+s);return M`<rect class=${`ms-tile t${u%4}`} x=${v(l)} y=${v(f)} width=${v(o)} height=${v(a)} rx=${v(n*.06)}></rect>`});return c`<svg class="ms-page" viewBox=${`0 0 ${n} ${e}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${v(i)} y=${v(e*.075)} width=${v(n*.4)} height=${v(e*.045)} rx=${v(e*.0225)}></rect>
    ${d}
  </svg>`}function ne(t,n,e){return M`<filter id=${t} filterUnits="userSpaceOnUse" x="0" y="0" width=${e.width} height=${e.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function Bo(t,n,e,i){return M`<radialGradient id=${t}>
    <stop offset="0" stop-color=${n} stop-opacity=${v(e)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${v(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function Cc(t,n,e){if(t.beam==="none")return h;let i=t.beamColor,s=t.beamIntensity,r=n.width/2,o=n.height/2,a=e.x-r,d=e.y-o,u=Math.hypot(a,d),l=Math.atan2(d,a),f=(m,x)=>`${v(r+Math.cos(l+m)*x)},${v(o+Math.sin(l+m)*x)}`,w=v(e.x),p=v(e.y),g;switch(t.beam){case"sectorWedge":{let m=Math.PI/4;g=M`${ne("ms-b8",8,n)}${ne("ms-b3",3,n)}
        <polygon points=${`${r},${o} ${f(-m/2,u*1.2)} ${f(m/2,u*1.2)}`} fill=${i} fill-opacity=${v(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${r},${o} ${f(-m*.3,u)} ${f(m*.3,u)}`} fill=${i} fill-opacity=${v(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":g=M`${ne("ms-b7",7,n)}${ne("ms-b10",10,n)}${Bo("ms-wash",i,.35*s,.18*s)}
        <circle cx=${v((r+e.x)/2)} cy=${v((o+e.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${w} cy=${p} r="40" fill=${i} fill-opacity=${v(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":g=M`${ne("ms-b4",4,n)}${ne("ms-b5",5,n)}${Bo("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${w} cy=${p} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${w} cy=${p} r="25" fill=${i} fill-opacity=${v(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":g=M`${ne("ms-b6",6,n)}
        <circle cx=${w} cy=${p} r="30" fill=${i} fill-opacity=${v(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(m=>M`<circle cx=${w} cy=${p} r=${v((30+m*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${v((1-m)*.45*s)} stroke-width=${v(2-m*1.2)}></circle>`)}`;break;case"wakeWave":g=M`${ne("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${r} y1=${o} x2=${w} y2=${p}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${v(.5*s)}></stop></linearGradient>
        <line x1=${r} y1=${o} x2=${w} y2=${p} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(m=>{let x=1-m;return M`<circle cx=${v(r+a*m)} cy=${v(o+d*m)} r=${v((20+x*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${v((1-x)*.5*s)} stroke-width=${v(Math.max(1.5-x*1.2,.3))}></circle>`})}
        <circle cx=${w} cy=${p} r="18" fill=${i} fill-opacity=${v(.25*s)} filter="url(#ms-b4)"></circle>`;break}return M`<g class="ms-beam">${g}</g>`}function Ic(t,n){let e=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":Mc(t),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${v(n.dim*.85)}`,`--ms-blur:${v(2+n.dim*4)}px`,`--ms-g-r:${v(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:e,style:i}}function bn(t,n,e,i,s={}){let{width:r,height:o}=t.screen,a=t.scale,d=Math.min(r,o),u=Ic(t,e),l=[`width:${Math.round(r*a)}px;height:${Math.round(o*a)}px;--me-s:${a}`,u.style,s.style??""].filter(w=>w!=="").join(";"),f=c`<div class=${`me-screen ms-screen ${u.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${l}>
    <div class="ms-backdrop" aria-hidden="true">${Pc(t.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${r} ${o}`} aria-hidden="true">
      ${s.beamTo===void 0?h:Cc(e,t.screen,s.beamTo)}
      <circle cx=${r/2} cy=${o/2} r=${d*we} class="me-track"></circle>
      ${e.finger?M`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${r/2} cy=${o/2} r=${v(d*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:h}
      <circle cx=${r/2} cy=${o/2} r=${d*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return Ji(t.phone,{width:r,height:o},a,f,n,t.icons)}function Lc(t,n,e,i){let s=rt(t.document),r=Fo(t.document,n),o=Tc(r,e),a=o===void 0?void 0:P(o.slot),d=e===void 0?void 0:P(e),u=(m,x=we)=>Fe(m,x),l=m=>a!==void 0&&C(P(m),a),f=(m,x,E,$,A)=>{let O=N(m),q=P(m),I=d!==void 0&&C(q,d),ie=m.isVisible===!1,Mn=`${Y(x)}: ${re(T(m))}${ie?", hidden":""}`,ra=["me-dot",$,I?"on":"",ie?"off":"",l(m)&&$===""?"ms-active":""].filter(oa=>oa!=="").join(" ");return c`<button type="button" class=${ra} style=${mn(t,s,E,O.color)}
      title=${Mn} aria-label=${Mn} aria-pressed=${I?"true":"false"} @click=${()=>be(t,n,q)}>
      ${Re(t,O.icon,gn(t,$===""?15:11),O.color)}${A>1?c`<span class="me-count" aria-hidden="true">${A}</span>`:h}</button>`},w=r.map(m=>{let x=u(m.position);if(x===void 0)return h;let E=h,$;if(m.main!==void 0)E=f(m.main,m.position,x,"",m.own.length),m.main.isVisible!==!1&&($=m.main);else if(m.shared!==void 0){let I=N(m.shared),ie=`${Y(m.position)}: ${re(T(m.shared))}, from All`;E=c`<span class=${`me-dot inh${l(m.shared)?" ms-active":""}`} style=${mn(t,s,x,I.color)} title=${ie}>
        ${Re(t,I.icon,gn(t,13),I.color)}</span>`,$=m.shared}else if(m.free){let I=Y(m.position);E=c`<button type="button" class="me-dot free" style=${mn(t,s,x)} ?disabled=${t.busy}
        title=${`Add a slot at ${I}`} aria-label=${`Add a slot at ${I}`}
        @click=${()=>it(t,n,m.position)}>${S("plus")}</button>`}let A=m.second===void 0?void 0:u(m.position,.2),O=m.second===void 0||A===void 0?h:f(m.second,m.position,A,"two",0),q=s.labels&&$!==void 0?Rc(t,s,x,N($).color,ae(t,$)):h;return c`${E}${O}${q}`}),p=o===void 0?void 0:u(o.position),g=wn(t.screen,p??{x:.5,y:.5-we});return bn(t,`${i} on the watch`,s,w,{beamTo:{x:g.px,y:g.py}})}function jo(t){let n=e=>Math.min(1.18,Math.max(.82,e));return{w:n(t.width/198),h:n(t.height/242)}}function qo(t,n,e){let{width:i,height:s}=t,r=jo(t),o=34*r.w,a=i-34*r.w,d=52*r.h,u=s-30*r.h,l=(d+u)/2,f=i/2,w=18*r.w,p=8*r.h,g=[{x:f,y:d-14*r.h},{x:o+w,y:d+p},{x:o,y:l},{x:o+w,y:u-p},{x:f,y:u+8*r.h},{x:a-w,y:u-p},{x:a,y:l},{x:a-w,y:d+p}];if(e<=1)return g[0];let m=[0];for(let $=1;$<=g.length;$++){let A=g[$-1],O=g[$%g.length];m.push(m[$-1]+Math.hypot(O.x-A.x,O.y-A.y))}let x=m[g.length],E=n*x/e%x;for(let $=0;$<g.length;$++){let A=m[$],O=m[$+1];if(E>=A&&E<=O){let q=O>A?(E-A)/(O-A):0,I=g[$],ie=g[($+1)%g.length];return{x:I.x+(ie.x-I.x)*q,y:I.y+(ie.y-I.y)*q}}}return g[0]}function Ac(t){return[...t].slice(0,4).join("").trim()}function Oc(t){let n=rt(t.document),e=kc(t.document),i=t.switcherPages,s=te(t),r=Math.max(0,s===void 0?0:i.findIndex(p=>C(p.id,s.id))),{width:o,height:a}=t.screen,d=p=>({x:p.x/o,y:p.y/a,px:p.x,py:p.y}),u=i.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((p,g)=>{let m=d(qo(t.screen,g,i.length)),x=g===r,E=g===0&&!x,$=Math.round((x?.7:E?.4:.15)*e.glow*100),A=[Ko(t,n,m,p.color),`--ms-ga:${$}%`,`--ms-gr:${x?45:30}`,`--ms-k:${x?e.scale:1}`].join(";"),O=["ms-sw",x?"ms-active":"",E?"ms-current":""].filter(I=>I!=="").join(" "),q=p.text===void 0?Re(t,p.icon,gn(t,n.glass?18:x?16:14),x&&!n.glass?"white":p.color):c`<span class="ms-sw-text">${Ac(p.text)}</span>`;return c`<span class=${O} style=${A} title=${p.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${q}</span>`}),l=i[r],f=l===void 0?h:c`<span class="ms-sw-name" style=${`top:${v(8*jo(t.screen).h/a*1e4)/100}%`}>${l.name}</span>`,w=i.length===0?void 0:qo(t.screen,r,i.length);return bn(t,"Page switcher on the watch",n,c`${u}${f}`,{beamTo:w,classes:"ms-switcher"})}function Ec(t){if(R(t)==="switcher")return Oc(t);let n=B(t);return n===void 0?bn(t,"Entity quick menu on the watch",rt(t.document),c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):Lc(t,n,ce(t,n),Io(t,n))}var Hc={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function Dc(t,n,e,i){let s=P(e),r=i!==void 0&&C(s,P(i)),o=e.isVisible===!1,a=ae(t,e),d=`${re(T(e))}${o?", hidden":""}`;return c`<button type="button" class=${`ms-label${r?" on":""}${o?" off":""}`} data-slot=${s}
    style=${`--k:${N(e).color}`} aria-pressed=${r?"true":"false"}
    @click=${()=>be(t,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${d}</small></span></button>`}function Nc(t,n,e,i){let s=Y(e.position),r=e.own.map(o=>Dc(t,n,o,i));return e.shared!==void 0&&r.push(c`<span class="ms-label ms-inh" style=${`--k:${N(e.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${ae(t,e.shared)}</b><small>From the All menu</small></span></span>`),r.length===0&&e.free&&r.push(c`<button type="button" class="ms-label ms-add" ?disabled=${t.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>it(t,n,e.position)}>${S("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),c`<div class=${`ms-place ms-at-${e.position} ms-${Hc[e.position]??"top"}`} data-place=${e.position}
    role="group" aria-label=${s}>${r}</div>`}function zo(t){let n=Ec(t),e=R(t)==="switcher"?void 0:B(t);if(e===void 0)return c`<div class="me-stage-body">${n}</div>`;let i=ce(t,e);return c`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${Fo(t.document,e).map(s=>Nc(t,e,s,i))}
  </div></div>`}var _c=c`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function Jo(t){let n=R(t),e=rt(t.document),i=h;if(n!=="switcher"){let r=B(t),o=r===void 0?[]:Dt(t.document,r),a=r===void 0?"Add an entity first, in the menu's settings.":o.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=c`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${t.busy||r===void 0||o.length===0}
      title=${a} @click=${()=>{r!==void 0&&it(t,r)}}>${S("plus")}<span class="word keep">Add</span></button>`}let s=e.entrance==="none"?h:c`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>Sc(t)}>${_c}<span class="word">Play opening</span></button>`;return i===h&&s===h?c``:c`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function Go(t){if(R(t)!=="entity")return h;let n=B(t);return n===void 0||ce(t,n)===void 0?h:c`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Pe(t)}>Change the type or entity</button></span>`}var Wc={anywhere:{gesture:"hold",open:"Touch and hold an empty spot on any page, slide to a slot, then lift your finger.",use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to a slot, then lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"hold",open:"Open the Anywhere menu and slide to its Pages slot. Then slide to a page and lift your finger.",use:"Jumping straight to any page. It needs a Pages slot in the Anywhere menu. Pick a page in the Pages card to set how it shows here."}};function Yo(t){let n=Wc[R(t)];return Pr({art:n.gesture,label:"How it opens",how:n.open,use:n.use})}var Zo=j`
  /* The watch screen's layers: the stand-in page, its veil, then the
     guide ring, the beam and the dots. Watch drawing, not panel chrome. */
  .ms-screen { isolation: isolate; }
  .ms-backdrop, .ms-veil { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; }
  .ms-backdrop { filter: blur(calc(var(--ms-blur, 4px) * var(--me-s, 1))); }
  .ms-page { display: block; width: 100%; height: 100%; }
  .ms-tile { fill: color-mix(in srgb, var(--wa-hue-grey) 45%, black); }
  .ms-tile.t0 { fill: color-mix(in srgb, var(--wa-hue-blue) 45%, black); }
  .ms-tile.t1 { fill: color-mix(in srgb, var(--wa-hue-green) 40%, black); }
  .ms-tile.t2 { fill: color-mix(in srgb, var(--wa-hue-orange) 40%, black); }
  .ms-tile.ms-title { fill: color-mix(in srgb, white 30%, black); }
  .ms-veil { background: black; opacity: var(--ms-veil, .85); }
  .ms-finger-in { stop-color: black; stop-opacity: .55; }
  .ms-finger-out { stop-color: black; stop-opacity: 0; }

  /* Every dot of the watch: its picked ring, neon, glow and glass shadow
     are one list of shadows, each part off unless its effect is on. */
  .ms-screen .me-dot, .ms-screen .me-page {
    transform: translate(-50%, -50%) scale(var(--ms-k, 1));
    box-shadow: var(--ms-ring, 0 0 transparent), var(--ms-neon, 0 0 transparent), var(--ms-glow, 0 0 transparent), var(--ms-cast, 0 0 transparent);
  }
  .ms-screen .me-dot.on, .ms-screen .me-page.on { --ms-ring: 0 0 0 2px black, 0 0 0 4px var(--me-mark); }
  .ms-screen .me-dot:focus-visible { --ms-ring: 0 0 0 2px black, 0 0 0 4px var(--me-mark), var(--wa-ring); }
  /* Each icon's soft glow in its color, cast away from the finger with
     Finger Shadow on. */
  .ms-screen .me-dot:not(.free) > :not(.me-count) {
    filter: drop-shadow(var(--sx, 0px) var(--sy, 0px) calc(3px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 60%, transparent));
  }
  /* Glass Background: a frosted bubble behind each icon. */
  .ms-glass .me-dot:not(.free), .ms-glass .me-page {
    background: color-mix(in srgb, white 16%, transparent);
    -webkit-backdrop-filter: blur(calc(6px * var(--me-s, 1))); backdrop-filter: blur(calc(6px * var(--me-s, 1)));
    border-color: color-mix(in srgb, var(--c, white) 45%, transparent);
    --ms-cast: var(--sx, 0px) var(--sy, 0px) calc(10px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 50%, transparent);
  }
  /* Neon Outline: a blurred ring in the slot's color. */
  .ms-neon .me-dot:not(.free), .ms-neon .me-page {
    border-color: var(--c, white);
    --ms-neon: 0 0 calc(4px * var(--me-s, 1)) calc(1px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 70%, transparent);
  }
  /* Glow: the halo of the slot the finger points at. */
  .ms-screen:not(.ms-switcher) .me-dot.ms-active {
    --ms-glow: 0 0 calc(var(--ms-g-r, 0px) * var(--me-s, 1)) calc(var(--ms-g-r, 0px) * .3 * var(--me-s, 1)) color-mix(in srgb, var(--c, white) var(--ms-g-a, 0%), transparent);
  }
  /* The page switcher, in the watch's points times --me-s: no guide ring,
     no centre dot, no finger spot. Each page is a bubble (RadialMenuTextIcon):
     an 80 point glow by Glow, a 36 point faint disc, and four letters. */
  .ms-switcher .me-track, .ms-switcher .me-center, .ms-switcher .ms-finger-spot { display: none; }
  .ms-sw {
    position: absolute; transform: translate(-50%, -50%) scale(var(--ms-k, 1));
    width: calc(80px * var(--me-s, 1)); height: calc(80px * var(--me-s, 1));
    display: grid; place-items: center; pointer-events: none;
  }
  .ms-sw > * { grid-area: 1 / 1; }
  /* The glass disc's blur and the neon ring's blur paint in a layer of their
     own, over anything plain: the letters (or icon) are lifted above both. */
  .ms-sw > :not(.ms-sw-glow, .ms-sw-disc) { position: relative; z-index: 1; }
  .ms-sw.ms-active { z-index: 1; }
  .ms-sw-glow {
    width: 100%; height: 100%; border-radius: 50%;
    background: radial-gradient(circle closest-side, color-mix(in srgb, var(--c, white) var(--ms-ga, 0%), transparent) calc(8 / 40 * 100%), transparent calc(var(--ms-gr, 30) / 40 * 100%));
  }
  .ms-sw-disc {
    width: calc(36px * var(--me-s, 1)); height: calc(36px * var(--me-s, 1)); border-radius: 50%; box-sizing: border-box;
    background: color-mix(in srgb, white 10%, transparent);
    box-shadow: var(--sx, 0px) var(--sy, 0px) calc(6px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 30%, transparent);
  }
  .ms-sw.ms-current .ms-sw-disc {
    background: color-mix(in srgb, white 20%, transparent);
    outline: calc(2px * var(--me-s, 1)) solid color-mix(in srgb, var(--c, white) 60%, transparent); outline-offset: calc(1px * var(--me-s, 1));
  }
  .ms-sw.ms-active .ms-sw-disc { background: color-mix(in srgb, var(--c, white) 30%, transparent); }
  .ms-sw-text {
    font-family: ui-rounded, "SF Pro Rounded", system-ui, sans-serif; font-weight: 700; white-space: nowrap;
    font-size: calc(12px * var(--me-s, 1)); line-height: 1; color: var(--c, white);
    text-shadow: var(--sx, 0px) var(--sy, 0px) calc(6px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 60%, transparent);
  }
  .ms-sw.ms-active .ms-sw-text { font-size: calc(14px * var(--me-s, 1)); color: white; }
  /* Glass: a 44 point frosted bubble, the letters at 16 points in the color. */
  .ms-glass .ms-sw-disc {
    width: calc(44px * var(--me-s, 1)); height: calc(44px * var(--me-s, 1));
    background: color-mix(in srgb, white 14%, transparent); outline: none;
    border: calc(.5px * var(--me-s, 1)) solid color-mix(in srgb, var(--c, white) 20%, transparent);
    -webkit-backdrop-filter: blur(calc(8px * var(--me-s, 1))); backdrop-filter: blur(calc(8px * var(--me-s, 1)));
    box-shadow: var(--sx, 0px) var(--sy, 0px) calc(10px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 50%, transparent);
  }
  .ms-glass .ms-sw.ms-active .ms-sw-disc { border-color: color-mix(in srgb, var(--c, white) 50%, transparent); }
  .ms-glass .ms-sw-text, .ms-glass .ms-sw.ms-active .ms-sw-text { font-size: calc(16px * var(--me-s, 1)); color: var(--c, white); }
  /* Neon: a blurred ring in the page's color. */
  .ms-neon .ms-sw::after {
    content: ""; grid-area: 1 / 1; border-radius: 50%; filter: blur(calc(3px * var(--me-s, 1)));
    width: calc(42px * var(--me-s, 1)); height: calc(42px * var(--me-s, 1));
    border: calc(1.5px * var(--me-s, 1)) solid color-mix(in srgb, var(--c, white) 70%, transparent);
  }
  .ms-glass.ms-neon .ms-sw::after { width: calc(46px * var(--me-s, 1)); height: calc(46px * var(--me-s, 1)); }
  /* The name of the page the finger points at, at the top of the screen. */
  .ms-sw-name {
    position: absolute; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none;
    font-family: ui-rounded, "SF Pro Rounded", system-ui, sans-serif; font-weight: 600;
    font-size: calc(13px * var(--me-s, 1)); color: white; text-shadow: 0 0 calc(4px * var(--me-s, 1)) black;
  }
  /* Icon Labels: the name under each icon. */
  .ms-name {
    position: absolute; transform: translate(-50%, -50%); pointer-events: none; white-space: nowrap;
    font-size: calc(9px * var(--me-s, 1)); font-weight: 500; line-height: 1.2;
    color: color-mix(in srgb, var(--c, white) 90%, transparent);
  }

  /* Play opening: two keyframe names that draw the same, so each click
     starts the animation again. */
  @keyframes ms-fly-a { from { opacity: 0; transform: translate(calc(-50% + var(--fx, 0px)), calc(-50% + var(--fy, 0px))) scale(.3); } }
  @keyframes ms-fly-b { from { opacity: 0; transform: translate(calc(-50% + var(--fx, 0px)), calc(-50% + var(--fy, 0px))) scale(.3); } }
  @keyframes ms-pop-a { from { transform: translate(-50%, -50%) scale(.1); } }
  @keyframes ms-pop-b { from { transform: translate(-50%, -50%) scale(.1); } }
  @keyframes ms-fade-a { from { opacity: 0; } }
  @keyframes ms-fade-b { from { opacity: 0; } }
  .ms-play-a.ms-enter-spring :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fly-a .5s cubic-bezier(.34, 1.56, .64, 1) backwards; }
  .ms-play-b.ms-enter-spring :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fly-b .5s cubic-bezier(.34, 1.56, .64, 1) backwards; }
  .ms-play-a.ms-enter-popIn :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-pop-a .35s cubic-bezier(.3, 1.9, .55, 1) backwards; }
  .ms-play-b.ms-enter-popIn :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-pop-b .35s cubic-bezier(.3, 1.9, .55, 1) backwards; }
  .ms-play-a.ms-enter-fade :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fade-a .3s ease-in backwards; }
  .ms-play-b.ms-enter-fade :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fade-b .3s ease-in backwards; }
  .ms-play-a :is(.ms-veil, .ms-name, .ms-beam) { animation: ms-fade-a .35s ease-out backwards; }
  .ms-play-b :is(.ms-veil, .ms-name, .ms-beam) { animation: ms-fade-b .35s ease-out backwards; }
  @media (prefers-reduced-motion: reduce) {
    .ms-screen, .ms-screen * { animation: none !important; }
  }

  /* The labels around the watch: the left places left of it, right
     aligned; the right places right of it; the top and bottom over and
     under it. */
  .me-stage-body.ms-body { justify-content: safe center; }
  .ms-around {
    display: grid; flex: none; align-items: center;
    grid-template-columns: minmax(120px, 190px) auto minmax(120px, 190px);
    grid-template-rows: auto 1fr auto 1fr auto;
    column-gap: 14px; row-gap: 8px;
  }
  .ms-watch { grid-area: 2 / 2 / 5 / 3; display: flex; justify-content: center; }
  .ms-place { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ms-at-topCenter { grid-area: 1 / 2; }
  .ms-at-bottomCenter { grid-area: 5 / 2; }
  .ms-at-topLeft { grid-area: 2 / 1; }
  .ms-at-leftCenter { grid-area: 3 / 1; }
  .ms-at-bottomLeft { grid-area: 4 / 1; }
  .ms-at-topRight { grid-area: 2 / 3; }
  .ms-at-rightCenter { grid-area: 3 / 3; }
  .ms-at-bottomRight { grid-area: 4 / 3; }
  .ms-top, .ms-bottom { justify-self: center; align-items: center; }
  .ms-left { justify-self: end; align-items: flex-end; }
  .ms-right { justify-self: start; align-items: flex-start; }
  .ms-label {
    display: flex; align-items: flex-start; gap: 8px; width: max-content; max-width: 100%; min-width: 0; box-sizing: border-box;
    margin: 0; padding: 5px 10px 6px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12.5px; line-height: 1.3; text-align: left; cursor: pointer;
  }
  .ms-left .ms-label { flex-direction: row-reverse; text-align: right; }
  button.ms-label:hover:not(:disabled) { background: var(--wa-hover); }
  button.ms-label:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ms-label.on, .ms-label.on:hover:not(:disabled) { border-color: var(--wa-pick-line); background: var(--wa-pick-bg); }
  .ms-label .ms-k {
    flex: none; width: 9px; height: 9px; margin-top: 4px; border-radius: 50%; background: var(--k, var(--wa-muted));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 25%, transparent);
  }
  .ms-label .ms-t { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .ms-label .ms-t b { font-weight: 600; overflow-wrap: anywhere; }
  .ms-label .ms-t small { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .ms-label.off .ms-t b, .ms-label.off .ms-k { opacity: .55; }
  .ms-label.ms-add, .ms-label.ms-inh { border-style: dashed; background: transparent; color: var(--wa-muted); }
  .ms-label.ms-add { align-items: center; }
  .ms-label.ms-add svg.ui-icon { width: 12px; height: 12px; }
  .ms-label.ms-add .ms-t b { font-weight: 500; }
  .ms-label.ms-add:disabled { opacity: .5; cursor: default; }
  .ms-label.ms-inh { cursor: default; }
  /* A narrow stage: the watch alone, the same labels as a two column list
     under it. */
  @container cvcard (max-width: 720px) {
    .ms-around { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: none; width: 100%; max-width: 480px; }
    .ms-around > .ms-watch { grid-area: auto; grid-column: 1 / -1; }
    .ms-around > .ms-place { grid-area: auto; justify-self: stretch; align-items: stretch; align-self: start; }
    .ms-around > .ms-place .ms-label { width: 100%; flex-direction: row; text-align: left; }
  }

  /* The tool strip's Play opening glyph, and the way back under the hint. */
  svg.ms-play-glyph { fill: currentColor; stroke: none; }
  .ms-foot { display: flex; justify-content: center; }
  button.ms-change {
    margin: 2px 0 0; padding: 3px 10px; border: 1px solid var(--wa-line-strong); border-radius: 6px;
    background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ms-change:hover { background: var(--wa-hover); }
  button.ms-change:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`;function yn(t){if(t.length===0)return"";let n=t.map(i=>Ns(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Xo(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${yn(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Qn}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function ia(){return Mr()||ir()}ds({dirty:ia,drop:()=>{Tr(),sr()}});typeof window<"u"&&window.addEventListener("beforeunload",t=>{ia()&&(t.preventDefault(),t.returnValue="")});var Vc=15e3,sa=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Le=sa?"\u2318":"Ctrl+",vn={min:200,max:720,middleMin:320},xn={left:280,right:320},kn="wrist-assistant-panel.menus.columns.v1",Uc="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",Bc=24,Qo=820,qc=600;function ea(t){return t==="entity"?"entity":"anywhere"}function $n(t){return Ee(t).message}function ot(t){return Ee(t).code}function at(t){let{code:n,message:e}=Ee(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function Fc(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Kc(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":On(Math.max(0,(Date.now()-n)/1e3))}function jc(t){return t instanceof HTMLElement?Ri(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function zc(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function Jc(t){return se(t)?vt(t).filter(n=>!kt(n)&&ls(Ne(n))).map(n=>({id:Ne(n),name:xt(n)})):[]}var ta=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function ct(t){return typeof t=="string"&&t.trim()!==""?t:void 0}var Gc="#8E8E93";function Sn(t){if(!se(t))return[];let n=0;return vt(t).filter(e=>!Li(e)&&!kt(e)).map(e=>{let i=e.hideFromSwitcher===!0,s=xt(e),r=ct(e.switcherIcon)??ct(Ii(e)[0]?.icon)??(Ai(e)?"bolt.fill":"square.grid.2x2.fill"),o=i?Gc:ta[n++%ta.length],a=ct(e.switcherColor)??o,d=e.switcherDisplayMode==="icon"?void 0:ct(e.switcherText)??s;return{id:Ne(e),name:s,icon:r,color:a,...d===void 0?{}:{text:d},hidden:i}})}function _l(t){return Sn(t).filter(n=>!n.hidden).map(({hidden:n,...e})=>e)}var na={ok:0,warn:1,err:2};function Yc(t,n){return t===void 0?n:n===void 0?t:{kind:na[n.kind]>na[t.kind]?n.kind:t.kind,text:t.text===n.text?t.text:`${t.text} ${n.text}`}}function Zc(t){let n=We(t)??{},e=W(n,{list:"anywhere"}).length,i=$e(n).length;return`Anywhere menu: ${(r=>`${r} ${r===1?"slot":"slots"}`)(e)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var b=class extends Tn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=h;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.libraryItem=void 0;this.headBar=new Yn(this);this.previewSettled=!1;this.menuDeleteAsk=!1;this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.lib=new Vs(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.copying=!1;this.zoom=go();this.columns={...xn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new yi(this);this.symbols=new si(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.previewKind="watch";this.onReconnect=()=>{let e=this.recordKey;this.isConnected&&e!==void 0&&this.libraryItem!==void 0&&this.load(e,!0);let i=this.watchId;!this.isConnected||i===void 0||(this.libraryItem===void 0&&this.load(i,!0),this.loadCatalog(i),this.loadHttpLibrary(),this.loadStatusPages(i),this.loadPages(i),this.loadBehavior(i),this.loadVoice(i),this.lib.store?.refresh())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!zc()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,r=e.key.toLowerCase();if(s&&!e.altKey&&r==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!jc(i[0])){if(s&&!e.altKey&&r==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&r==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let o=this.viewHost();o!==void 0&&Pe(o)&&e.preventDefault()}}};this.onStageClick=e=>{let i=e.composedPath(),s=i.indexOf(e.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(Uc)))return;let o=this.viewHost();o!==void 0&&Pe(o)};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=e.composedPath(),s=(...r)=>i.some(o=>o instanceof HTMLElement&&r.some(a=>o.classList.contains(a)));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(li,this.onScrubStart),this.addEventListener(ui,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return Kn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return this.libraryItem!==void 0?this.previewKind:fr(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.recordKey,i=this.record;if(!(e===void 0||i===void 0)){if(i.revision>0){let s=K(e);if(s!==void 0)return s;let r=We(i.document);return r===void 0?void 0:Xt(e,r,i.revision).draft}if(!(this.libraryItem!==void 0||this.unsupported||!this.opensReady()))return K(e)??Qt(e)}}get recordKey(){return this.libraryItem===void 0?this.watchId:Jt(this.libraryItem)}get libraryUnit(){let e=this.libraryItem,i=this.lib.library;return e===void 0||i===void 0?void 0:_e(i,e.id)?.unit}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get pagesDraft(){if(this.libraryItem===void 0&&!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return Kt(this.watchId)}get pagesDocument(){let e=this.pagesRecord;return this.pagesDraft?.document??(e!==void 0&&e.revision>0?e.document:void 0)}get pages(){return Jc(this.pagesDocument)}get saving(){let e=this.recordKey;return e===void 0?!1:(K(e)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let e=this.pagesDraft;return e!==void 0&&this.pickedSwitcherPage()!==void 0?e:this.draft}pickedSwitcherPage(){return te({uiState:this.uiState,switcherPages:[],switcherRows:Sn(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=ni(kn,xn,vn),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0?(this.openPreview(this.watchId),this.openItem(!0)):this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++,this.flushRename()}willUpdate(e){if(this.hass)if(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Rn(this.hass).then(s=>{this.ownList=s.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0)this.followLibraryItem(this.libraryItem);else{this.openedItem!==void 0&&(this.openedItem=void 0,this.watchId=void 0);let s=Gn(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),$i(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId,i=this.pagesDraft?.saveDone;if(e!==void 0&&i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let a=()=>this.pagesSaveEnded(e);i.then(a,a)}let s=this.recordKey;if(s===void 0)return;let r=K(s)?.saveDone;if(r===void 0||r===this.followedSave)return;this.followedSave=r;let o=()=>this.saveEnded(s);r.then(o,o)}pagesSaveEnded(e){this.requestUpdate(),!(!this.isConnected||e!==this.watchId)&&(this.loadPages(e),this.flushPending())}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}followLibraryItem(e){let i=Zt(this.lib.library,e);(!Gt(e,this.openedItem)||!this.previewSettled)&&(this.previewKind=yr(this.watches,e,i),this.previewSettled=i!==void 0);let s=Yt(this.watches,this.previewKind,[e.from,...i??[]]);(s!==this.watchId||s===void 0&&this.openedItem===void 0)&&this.openPreview(s),Gt(e,this.openedItem)||(this.openedItem=e,this.openItem());let r=Jt(e),o=this.libraryUnit;o!==void 0&&this.shownUnitFor!==r&&(this.shownUnitFor=r,ln({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},o));let a=br(this.lib.library,e),d=this.record?.revision;a!==void 0&&d!==void 0&&a>d&&a!==this.followedRevision&&(this.followedRevision=a,this.load(r,!0))}pickPreview(e){this.previewKind=e,this.openPreview(Yt(this.watches,e,[this.libraryItem?.from,...Zt(this.lib.library,this.libraryItem)??[]]))}openPreview(e){this.watchId=e,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,e===void 0?this.endSubscription():this.startSubscription(e),this.loadContext(e)}openItem(e=!1){let i=this.recordKey;i!==void 0&&(e||(this.reloadPending=!1,this.restartDraft=void 0,this.note=void 0,this.unsupported=!1,this.history=[],this.closeAsk(),this.flushRename(),this.libNote=void 0,this.menuDeleteAsk=!1,this.endScrub(),this.uiState.clear(),this.shownUnitFor=void 0,this.followedRevision=void 0),this.stopPolling(),this.load(i,e))}openWatch(e,i=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.flushRename(),this.libNote=void 0,this.endScrub(),this.uiState.clear(),i=!1);let s=Rr(e);s!==void 0&&ln({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},s),this.startSubscription(e),this.load(e,i),this.loadContext(e)}loadContext(e){this.loadHttpLibrary(),e!==void 0&&(this.loadCatalog(e),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e))}async loadVoice(e){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let r=await _(i,e,"voice");if(s!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=Xs(r)}catch{if(s!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let e=this.voiceDocument;return{phrases:e===void 0?void 0:Ft(e),defaults:Qs(e,this.catalog)}}async loadCatalog(e){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let r=await _(i,e,"catalog");if(s!==this.catalogSeq||e!==this.watchId)return;this.catalog=Xi(r)}catch(r){if(s!==this.catalogSeq||e!==this.watchId)return;It(r)&&(this.catalog=void 0)}}async loadHttpLibrary(){let e=this.hass;if(!e)return;let i=++this.httpLibrarySeq;try{let s=await An(e);if(i!==this.httpLibrarySeq)return;this.httpLibrary=oi(s)}catch(s){if(i!==this.httpLibrarySeq)return;ai(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(e){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let r=await _(i,e,"status_pages");if(s!==this.statusPagesSeq||e!==this.watchId)return;this.statusPages=Qi(r)}catch(r){if(s!==this.statusPagesSeq||e!==this.watchId)return;It(r)&&(this.statusPages=void 0)}}async loadPages(e){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let r=await _(i,e,"pages");if(s!==this.pagesSeq||e!==this.watchId)return;this.pagesRecord={revision:r.revision,document:r.document},this.libraryItem===void 0&&r.revision>0&&se(r.document)&&!(Kt(e)?.saving??!1)&&nr(e,r.document,r.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(e){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let r=await _(i,e,"behavior");if(s!==this.behaviorSeq||e!==this.watchId)return;this.behavior=r.revision>0&&se(r.document)?r.document:void 0}catch{if(s!==this.behaviorSeq||e!==this.watchId)return;this.behavior=void 0}}async load(e,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);let o=this.libraryItem;try{let a=o!==void 0?await gr(s,o):await _(s,e,"menus");if(r!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0}catch(a){if(r!==this.loadSeq)return;o!==void 0?i||(this.loadError=Vi(a)):Ws(a)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=$n(a)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!(this.unsupported||o!==void 0)&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let i=this.recordKey;this.record=e,i!==void 0&&e.revision<=0&&Qt(i);let s=e.revision>0?We(e.document):void 0;if(i===void 0||s===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===i&&e.revision>=r.revision&&(this.restartDraft=void 0,(K(i)?.dirty??!1)||Se(i));let o=Xt(i,s,e.revision);o.replaced.length>0?this.note={kind:"warn",text:yn(o.replaced)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let r=await Pn(i,e,"menus");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=ot(r)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;Ln(i,e,r=>{s===this.subscribeSeq&&(r.kind==="catalog"?ns(r,this.catalog)&&this.loadCatalog(e):r.kind==="status_pages"?this.loadStatusPages(e):r.kind==="pages"?this.loadPages(e):r.kind==="behavior"?this.loadBehavior(e):r.kind==="voice"?this.loadVoice(e):r.kind==="menus"&&this.libraryItem===void 0&&r.revision!==(this.record?.revision??0)&&this.load(e,!0))}).then(r=>{s===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||qn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Vc))}async poll(){this.pollTimer=void 0;let e=this.hass,i=this.watchId,s=this.record;if(!(!e||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let r=await _(e,i,"menus");if(i!==this.watchId||this.record!==s)return;r.revision===s.revision?this.record={...s,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(r),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let s=this.draft;if(!s||this.saving)return!1;let r=s.apply(e(s.document),this.scrubKey??i);return this.requestUpdate(),r}editPages(e,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let r=this.scrubKey??i,o=s.apply(e(s.document),r===void 0?void 0:{coalesce:r});return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Ti,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let s=Pi(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:ci(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Ft(this.voiceDocument)}}screen(){let e=this.phoneLayout();if(e!==void 0)return ji(e);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(gt(i?.screen_size)??ft).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(i=>i.owner_watch_id===this.watchId);return Ki(Fi(e?.screen_size))}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let s=this,r=Sn(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*Ct,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:r.filter(o=>!o.hidden).map(({hidden:o,...a})=>a),switcherRows:r,switcherSettings:o=>this.switcherSettingsHost(o),menuFoot:o=>o==="switcher"?h:this.libraryHead(o),menuBadge:o=>this.menuBadge(o),...this.libraryUnit===void 0?{}:{sections:uo(this.libraryUnit)},get document(){return e.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(o,a)=>this.draft===e&&this.edit(o,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(e){let i=this.pagesDraft;if(i===void 0||Rt(i.document,e)===void 0)return;let s=this,r=this.memoIcons();return{pageId:e,icons:r,symbols:this.symbols,uiState:this.uiState,get device(){return s.device},get page(){return Rt(i.document,e)??{}},get busy(){return s.saving},edit:(o,a)=>{this.pagesDraft===i&&this.editPages(o,a?.typing===!0?`switcher:${e.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let e=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(e||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,i=this.recordKey;this.endScrub();let s=this.draft,r=this.pagesDraft;if(!e||i===void 0||!s||this.saving)return;let o=s.dirty,a=r?.dirty??!1;if(!o&&!a)return;this.note=void 0;let d=o?await this.saveMenus(e,i,s,s.revision<=0):void 0,u=a&&r!==void 0&&this.pagesDraft===r?await this.savePages(e,i,r):void 0;i===this.recordKey&&(this.note=Yc(d,u))}async saveMenus(e,i,s,r=!1){let o=[],a=this.libraryItem,d=Sr(s,a!==void 0?{prepare:Bt,...wr(e,this.lib.store,a)}:{prepare:Bt,save:(f,w)=>dt(e,i,"menus",f,w).then(p=>(o=ut(p),p),p=>{throw at(p)}),fetch:async()=>{let f=await _(e,i,"menus").catch(w=>{throw at(w)});return{revision:f.revision,document:f.document}}});this.followedSave=s.saveDone,this.requestUpdate();let u=await d.catch(f=>({ok:!1,revision:s.revision,merged:!1,code:ot(f)??"unknown",message:$n(f)}));this.saveEnded(i);let l=ur(r,u.code,Xo(u));return u.ok?ht(l,o,"menus"):l}async savePages(e,i,s){let r=tr(s,{prepare:a=>os(Yi(a),s.base,this.hass?.states),save:(a,d)=>dt(e,i,"pages",a,d).catch(u=>{throw at(u)}),fetch:async()=>{let a=await _(e,i,"pages").catch(d=>{throw at(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let o=await r.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:ot(a)??"unknown",message:$n(a)}));return this.pagesSaveEnded(i),ei(o)}startFresh(){let e=this.watchId;e===void 0||!Jn(this.noRecordState())||(cr("menus",e),this.note=void 0,this.requestUpdate())}get linkDevices(){return Ui(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get linkKind(){return this.device==="iphone"?"iphone":"watch"}libraryMenuOf(e){let i=this.lib.library,s=this.libraryItem;if(s!==void 0){let o=i===void 0?void 0:_e(i,s.id);return o?.unit===ea(e)?o:void 0}let r=this.watchId;if(!(i===void 0||r===void 0||this.unsupported||(this.record?.revision??0)<=0))return qi(i,r,ea(e))}menuBadge(e){if(e==="switcher")return;let i=this.libraryMenuOf(e);return i===void 0||i.name===Pt[i.unit]?void 0:i.name}typeMenuName(e,i){this.naming={menuId:e,value:i},this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=setTimeout(()=>this.flushRename(),qc)}flushRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0;let e=this.naming;if(e===void 0||e.sent===!0)return;let i=this.lib.store,s=this.lib.library,r=e.value.trim(),o=s===void 0?void 0:s.index.menus.get(e.menuId.toUpperCase());if(i===void 0||r===""||o===void 0||o.name===r){this.naming=void 0;return}let a={menuId:e.menuId,value:r,sent:!0};this.naming=a,i.renameMenu(e.menuId,r).then(()=>{this.naming===a&&(this.naming=void 0)})}cancelRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0,this.naming=void 0}async makeCopy(e){let i=this.lib.store,s=this.watchId;if(i===void 0||s===void 0||this.copying||this.saving||(this.draft?.dirty??!1))return;this.flushRename();let r=this.linkDevices.find(d=>de(d.ownerId,s)),o=js(r?.name??`This ${z(this.device)}`);this.copying=!0,this.libNote=void 0;let a=await i.copyMenu(s,e.unit,o);this.copying=!1,s===this.watchId&&(this.libNote=a.ok?{kind:"ok",text:zs(o,this.linkKind)}:{kind:"err",text:`Not copied. ${a.text}`},a.ok&&this.load(s,!0))}menuTickLocked(e){let i=this.watchId;if(!(this.libraryItem===void 0&&(i===void 0||de(e,i))||!(K(e)?.dirty??!1)))return Fs(this.linkDevices.find(r=>de(r.ownerId,e))?.name??"that device")}libraryHead(e){let i=this.libraryMenuOf(e),s=this.lib.store,r=this.libraryItem===void 0?this.watchId:this.recordKey;if(i===void 0||s===void 0||r===void 0)return h;let o=this.libraryItem!==void 0,a=Pt[i.unit],d=this.naming!==void 0&&de(this.naming.menuId,i.id)?this.naming:void 0,u=this.linkDevices,l=i.owners.filter(g=>!de(g,r)),f=z(this.device),w=this.saving?"Saving\u2026":this.draft?.dirty??!1?Js(this.linkKind):void 0,p=s.noteFor("menus",i.id);return c`<div class="me-lib" role="group" aria-label=${a} @click=${g=>g.stopPropagation()}>
      <label class="me-lib-name"><span class="me-lib-h">Name</span>
        <input type="text" class="me-lib-input" aria-label=${`${a} name`} placeholder=${a} maxlength="80"
          .value=${He(d?.value??i.name)}
          @input=${g=>this.typeMenuName(i.id,g.target.value)}
          @keydown=${g=>{g.key==="Enter"?(g.preventDefault(),this.flushRename()):g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),this.cancelRename())}}
          @blur=${()=>this.flushRename()} />
      </label>
      ${o?this.renderLibraryDelete(i):l.length===0?h:c`<div class="me-lib-copy">
        <span class="me-lib-hint">An edit here changes it on ${Bi(qs(l,u))} too.</span>
        <button type="button" class="pe-btn me-copy" ?disabled=${w!==void 0||this.copying}
          title=${w??`A copy of this menu that only this ${f} uses. The other devices keep this one.`}
          @click=${()=>{this.makeCopy(i)}}>${this.copying?"Duplicating\u2026":"Duplicate"}</button>
      </div>`}
      ${p===void 0?h:c`<p class="me-lib-note err" role="alert">${p}</p>`}
      ${this.libNote===void 0?h:c`<p class="me-lib-note ${this.libNote.kind}" role="status">${this.libNote.text}</p>`}
    </div>`}menuTicks(e,i=!1){let s=this.lib.store,r=this.hass?.user?.is_admin;return Us({library:this.lib.library,kind:"menus",itemId:e.id,...this.libraryItem?.from===void 0?{}:{viewing:this.libraryItem.from},devices:this.linkDevices,colorOf:o=>this.colorOf(o),pending:s.pending,...r===void 0?{}:{admin:r},...i?{hint:!1}:{},locked:o=>this.menuTickLocked(o)},o=>{s.pickMenu(o,e.unit,e.id)})}renderStageDevices(e){let i=this.libraryItem,s=this.lib.library,r;return i!==void 0?r=s===void 0?void 0:_e(s,i.id):r=this.linkDevices.length>1?this.libraryMenuOf(R(e)):void 0,r===void 0||this.lib.store===void 0||this.draft===void 0?h:kr("menus",r.owners.length,this.menuTicks(r,!0),this.lib.store?.savedStamp("menus",r.id))}renderLibraryDelete(e){return e.owners.length>0?c`<p class="me-lib-hint">A save changes it on every device that uses it. To delete it, pick another menu for each of them first.</p>`:this.menuDeleteAsk?c`<div class="me-lib-copy me-lib-del-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`}>
      <span class="me-lib-hint"><b>Delete ${e.name}?</b> It is on no device yet. This cannot be undone.</span>
      <button type="button" class="pe-btn pe-danger" @click=${()=>{this.deleteLibraryMenu(e)}}>Really delete</button>
      <button type="button" class="pe-btn" @click=${()=>{this.menuDeleteAsk=!1}}>Cancel</button>
    </div>`:c`<button type="button" class="pe-btn pe-danger me-lib-del" ?disabled=${this.saving}
        title=${`Delete ${e.name}. It is on no device yet.`} @click=${()=>{this.menuDeleteAsk=!0}}>Delete</button>`}async deleteLibraryMenu(e){let i=this.lib.store,s=this.recordKey;if(i===void 0||s===void 0||this.libraryItem===void 0)return;this.menuDeleteAsk=!1;let r=await i.deleteItem("menus",e.id);if(s===this.recordKey){if(!r.ok){this.libNote={kind:"err",text:`Not deleted. ${r.text}`};return}Se(s),this.onBack?.()}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let i=this.hass,s=this.watchId,r=this.record;if(!i||s===void 0||r===void 0||this.draft?.dirty)return;let o={entry:e,baseRevision:r.revision};this.restoreAsk=o,Cn(i,s,"menus",e.revision).then(a=>{if(this.restoreAsk!==o)return;let d=Ks(this.lib.library,s,r.document,a.document,this.linkDevices);this.restoreAsk={...o,summary:Zc(a.document),links:d}},()=>{})}async restore(){let e=this.hass,i=this.watchId,s=this.restoreAsk;if(!e||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let r;try{let o=await In(e,i,"menus",s.entry.revision,s.baseRevision);r=ht({kind:"ok",text:Ci(s.entry.updated_at)},ut(o),"menus"),i===this.watchId?this.restartDraft={watchId:i,revision:o.revision}:(K(i)?.dirty??!1)||Se(i)}catch(o){let a=ot(o);a==="conflict"?r={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?r={kind:"warn",text:`Not restored. Home Assistant no longer holds menus for this ${z(this.device)}.`}:a==="not_found"?r={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",r={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):r={kind:"err",text:`Could not restore: ${ri(o)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=r,this.load(i,!0))}render(){let e=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,e):h}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:h}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):h}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Qo}renderTopBar(e,i){if(this.libraryItem!==void 0)return this.renderLibraryBar(e,i);let s=e!==void 0&&!this.unsupported,r=s&&this.dirty,o=this.shellOwnsWatch;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:h}
      ${o?h:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():as(void 0,!1)}>${S("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${o?h:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?Zn({newWatch:this.newWatch,dirty:r,saved:yt(this.record,void 0,this.device),device:this.device}):h}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Le}S). A save reaches the ${z(this.device)} the next time it checks.`:`Nothing to save (${Le}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?h:c`<span class="tb-saved" title=${r?"Unsaved changes":""}>${yt(this.record,void 0,this.device)}</span>
        ${pr(lr({newWatch:this.newWatch,dirty:r,saving:this.saving}))}`}`:h}
      ${o?h:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():cs(void 0)}>${S("pages")}<span>Pages</span></button>`}
      ${this.barActions}
    </div>`}renderLibraryBar(e,i){let s=e!==void 0,r=s&&this.dirty;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Menu in the library">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:h}
      <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${()=>this.onBack?.()}>${S("left")}<span>Menus</span></button>
      ${xr()}
      <span class="spacer"></span>
      ${this.renderTopMenu(s?e:void 0)}
      ${s?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Le}S). A save reaches every device that uses this menu.`:`Nothing to save (${Le}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:h}
      ${this.barActions}
    </div>`}renderSyncPill(e){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return h;let s=e===void 0?{size:0,limit:1}:At(e.document),r=bt({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState,device:this.device});return gi(r,e?.dirty??!1)}noRecordState(e=this.watches){return jn(e.find(i=>i.owner_watch_id===this.watchId))}opensReady(e=this.watches){return dr(this.noRecordState(e),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let i=this.canStartFresh();if(e===void 0&&!i)return h;let s=this.topMenuOpen,r=o=>()=>{this.topMenuOpen=!1,o()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${r(()=>this.discard())}>Discard edits</button>`:h}
        ${e&&this.libraryItem===void 0&&(this.record?.revision??0)>0?wi(r(()=>{this.rawCopied=!1,this.rawOpen=!0})):h}
        ${i?c`<button class="row" role="menuitem"
          @click=${r(()=>this.startFresh())}>${lt}</button>`:h}
      </div>`:h}
    </span>`}colorOf(e){return fi(mi(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return h;let i=e.find(o=>o.owner_watch_id===this.watchId),s=this.watchMenuOpen,r=o=>{let a=o===void 0?void 0:this.colorOf(o);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:h} aria-hidden="true">${S("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${r(i?.owner_watch_id)}<span class="tb-browse-l">${i?Oe(i,e):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${S("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${e.map(o=>{let a=o.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(o.owner_watch_id)}}>
            ${r(o.owner_watch_id)}<span class="me-watch-name">${Oe(o,e)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?S("check"):h}</span>
          </button>`})}
      </div>`:h}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Qo?this.columns:ti(this.hostWidth-Bc,this.columns,vn)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();ii(i,{side:e,base:e==="left"?s.left:s.right,limits:vn,onWidth:r=>{this.columns={...this.columns,[e]:r}},onEnd:()=>mt(kn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:xn[e]},mt(kn,this.columns)}}></div>`}get stageScale(){return this.zoom??$t(this.narrow||this.stacked)}setZoom(e){this.zoom=e,wo(e)}renderStage(e,i){let s=i.find(f=>f.owner_watch_id===this.watchId),r=gt(s?.screen_size),o=r??ft,a=e.phone===void 0?o.label:e.phone.model.label,d=[...Ho(e),a],u=this.undoDraft,l=hn(R(e));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Oe(s,i)}</span></span>`:h}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${e.phone!==void 0?zi:r===void 0?`${o.label}, this watch's size is not known`:d.join(" \xB7 ")}><span class="fam">${d.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${Le}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${S("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${sa?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${S("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices(e)}
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(e)}
        ${Yo(e)}
        ${zo(e)}
        <div class="under"><span class="tail">${Do(e)}</span>${Go(e)}</div>
      </div>
    </div>`}renderStageTools(e){let i=e.phone!==void 0,s=this.stageScale,r=$t(this.narrow||this.stacked),o=a=>Ei(i?a*Ct:a);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${Jo(e)}
      ${this.libraryItem===void 0?h:c`${vr(this.previewKind,a=>this.pickPreview(a))}<span class="tb-sep" aria-hidden="true"></span>`}
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=Mt(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(Mt(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${o(s)}. Back to fit`}
          title=${`The ${i?"iPhone":"watch"} at ${o(s)} of its own points. Click to fit it again (${o(r)}).`}
          @click=${()=>this.setZoom(void 0)}>${o(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=St(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(St(s))}>+</button>
      </span>
    </div>`}renderBody(e){let i=this.libraryItem!==void 0;if(e.length===0&&!i){let l=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${qt}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(i&&this.loadError===void 0&&this.libraryUnit===void 0){let l=this.lib.readState==="failed"?this.lib.store?.readError:void 0;return c`<div class="pe-empty">${l??"Loading\u2026"}</div>`}if(this.loadError!==void 0){let l=this.recordKey;return c`<div class="pe-empty">
        <span>${i?"Could not read this menu":`Could not read this ${z(this.device)}'s menus`}: ${this.loadError}</span>
        ${l===void 0?h:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let s=this.record;if(s===void 0)return c`<div class="pe-empty">Loading…</div>`;let r=this.draft;if(r===void 0&&s.revision>0)return c`<div class="pe-empty"><b>${qt}</b></div>`;if(r===void 0){let l=this.watchId===void 0?void 0:K(this.watchId),f=this.watchId;return c`<div class="pe-empty"><b>${Ae("menus",this.device)}</b><span>${zn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${lt}</button>
        ${l?.dirty&&f!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Se(f),this.requestUpdate()}}>Discard the kept edits</button>`:h}
      </div>`}let o=this.viewHost();if(o===void 0)return c`<div class="pe-empty">Loading…</div>`;let a=this.fittedColumns(),d=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",u=s.revision<=0;return c`${u&&this.barHost===void 0?hr(this.device):h}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${a.left}px;--wa-right:${a.right}px;${d}`}>
      <div class="column left">
        ${Oo(o)}
        ${Eo(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${_o(o)}
      </div>
    </div>
    ${u||i?h:this.renderFoot(s,r.document,r.dirty)}`}renderFoot(e,i,s){let r=At(i),o=bt({record:e,size:r.size,limit:r.limit,noun:"menus",historyState:this.historyState,device:this.device}),a=this.watchId;return c`${vi({status:o,historyState:this.historyState,historyOpen:this.historyOpen,onHistory:()=>{this.historyOpen=!0}})}
    ${this.historyOpen?xi({noun:"menus",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):h}
    ${this.rawOpen?ki({noun:"menus",document:i,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{Si(d).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):h}`}renderRestoreAsk(e){let i=this.record,s=Kc(e.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title" title=${`Revision ${e.entry.revision}`}>${bi(e.entry)}</h3>
      <p>${Fn(e.entry.updated_by,this.device)}${s?` ${s}`:""}, ${Fc(e.entry.size)}.</p>
      ${e.summary?c`<p class="pe-muted">${e.summary}</p>`:h}
      <p>It is saved again as the newest save. The copy shown now stays in the earlier saves.</p>
      ${(e.links??[]).map(r=>c`<p>${r}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Bn,En,Hn,Dn,Nn,_n,Wn,Vn,Hi,Gi,mr,j`
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
       in the watch's device color, the name, a caret; the menu lists every
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

    /* The foot of a menu's row in the Menus card: the menu's name and Make
       a copy for this watch (libraryHead). */
    .me-lib { display: flex; flex-direction: column; gap: 8px; padding: 0; font-weight: 400; }
    .me-lib-name { max-width: 420px; }
    .me-lib-name { display: flex; flex-direction: column; gap: 4px; }
    .me-lib-h { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
    .me-lib-input {
      min-height: 32px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-input, var(--wa-field)); color: var(--wa-ink); font: inherit; font-size: 13.5px; font-weight: 600;
    }
    .me-lib-input:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .me-lib-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .me-lib-hint { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
    .me-lib-note { margin: 0; font-size: 12px; line-height: 1.35; color: var(--wa-muted); }
    .me-lib-note.err { color: var(--wa-need); }
    .me-lib-note.ok { color: var(--wa-ink); }
  `,Uo,Zo,ro,Mi,Cr,Bs,$r,Xn]}};y([L({attribute:!1})],b.prototype,"hass",2),y([L({attribute:!1})],b.prototype,"owners",2),y([L({attribute:!1})],b.prototype,"ownerId",2),y([L({type:Boolean,reflect:!0})],b.prototype,"narrow",2),y([L({attribute:!1})],b.prototype,"icons",2),y([L({attribute:!1})],b.prototype,"iconsTick",2),y([L({attribute:!1})],b.prototype,"haMenu",2),y([L({attribute:!1})],b.prototype,"onHaMenu",2),y([L({attribute:!1})],b.prototype,"onBack",2),y([L({attribute:!1})],b.prototype,"onPages",2),y([L({attribute:!1})],b.prototype,"barActions",2),y([L({attribute:!1})],b.prototype,"shellOwnsWatch",2),y([L({attribute:!1})],b.prototype,"phones",2),y([L({attribute:!1})],b.prototype,"barHost",2),y([L({attribute:!1})],b.prototype,"libraryItem",2),y([k()],b.prototype,"watchId",2),y([k()],b.prototype,"menuDeleteAsk",2),y([k()],b.prototype,"record",2),y([k()],b.prototype,"unsupported",2),y([k()],b.prototype,"catalog",2),y([k()],b.prototype,"statusPages",2),y([k()],b.prototype,"httpLibrary",2),y([k()],b.prototype,"pagesRecord",2),y([k()],b.prototype,"behavior",2),y([k()],b.prototype,"voiceDocument",2),y([k()],b.prototype,"loading",2),y([k()],b.prototype,"loadError",2),y([k()],b.prototype,"history",2),y([k()],b.prototype,"historyState",2),y([k()],b.prototype,"note",2),y([k()],b.prototype,"restoreAsk",2),y([k()],b.prototype,"restoring",2),y([k()],b.prototype,"historyOpen",2),y([k()],b.prototype,"rawOpen",2),y([k()],b.prototype,"rawCopied",2),y([k()],b.prototype,"ownList",2),y([k()],b.prototype,"topMenuOpen",2),y([k()],b.prototype,"watchMenuOpen",2),y([k()],b.prototype,"naming",2),y([k()],b.prototype,"copying",2),y([k()],b.prototype,"libNote",2),y([k()],b.prototype,"zoom",2),y([k()],b.prototype,"columns",2),y([k()],b.prototype,"hostWidth",2),y([k()],b.prototype,"hostHeight",2),y([k()],b.prototype,"previewKind",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",b);export{So as a,Wa as b,Uo as c,Ec as d,Zo as e,kn as f,qc as g,ea as h,Jc as i,ta as j,Gc as k,Sn as l,_l as m,Yc as n,Zc as o,b as p};
