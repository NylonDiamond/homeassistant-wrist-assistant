import{a as _e,g as We,h as Lt}from"./chunk-53ITZGGN.js";import{d as vs,e as ve,f as Ht,g as xs,h as Nt,i as $s}from"./chunk-LZLXOOUZ.js";import{b as ks,c as Ss}from"./chunk-H4QNVGH5.js";import{I as ns,J as is,K as ss,pa as rs,qa as os,ra as Pt,sa as as,ta as Ct,ua as cs,va as ls,wa as ds}from"./chunk-ZKGL4JKO.js";import{a as us}from"./chunk-RTPTWMWI.js";import{a as ts}from"./chunk-C47PHERH.js";import{A as Zi,B as Tt,C as Rt,a as Fi,b as zi,c as Ji,d as Gi,x as Yi,z as Mt}from"./chunk-R57JT7CT.js";import{Yb as Vi,Zb as Di,_b as _i,ec as Wi,hc as Ui,jc as kt,kc as Ki}from"./chunk-JRNMYVYI.js";import{B as It,C as Ot,D as fs,E as gs,I as bs,K as ws,M as ys,r as At,s as Et,t as ps,u as ms,v as hs}from"./chunk-DVFN2QKC.js";import{d as Qi,i as es}from"./chunk-GIWFVC5N.js";import{A as Hi,B as Ni,a as Li,b as Ai,p as Ei,r as Ii,u as Oi,v as $t}from"./chunk-TOQDNYOJ.js";import{Va as Bi,Wa as ji,Xa as qi,Za as St}from"./chunk-YPXTMZX7.js";import{a as Ri,b as Pi}from"./chunk-LONSRJNJ.js";import{e as Ci}from"./chunk-6SB6XCX5.js";import{h as Ln,j as ci,z as li}from"./chunk-XPT4EXP5.js";import{c as di,e as ui}from"./chunk-JGNQXJJV.js";import{$ as gt,A as R,B as Ie,C as Oe,D as F,E as He,F as Wn,G as Un,H as dt,I as Kn,J as Bn,K as jn,L as qn,M as Fn,N as zn,O as ut,P as pt,Q as Jn,R as Gn,S as Yn,T as Zn,U as mt,V as ht,W as Xn,X as ft,Y as Qn,Z as Ne,_ as ei,a as ge,aa as ti,ba as ni,ca as te,d as ot,da as z,ea as Ve,f as at,fa as ae,g as An,ga as ii,h as oe,ha as si,i as j,ia as ri,j as En,k as M,ka as oi,l as be,la as ai,n as In,o as Ae,p as On,q as ct,r as lt,s as Hn,t as Nn,u as we,v as Vn,w as Ee,x as Dn,y as _n,z as q}from"./chunk-67YMR4S7.js";import{X as Ce,Y as rt,aa as Le}from"./chunk-MTUTXLNK.js";import{b as pi,d as bt,e as mi,f as wt,g as hi}from"./chunk-C6K36PU4.js";import{e as gi,f as bi,h as wi}from"./chunk-INBQXLGT.js";import{A as yt,Ab as K,Bb as De,G as vt,Ib as xt,Kb as Ti,b as fi,ib as yi,jb as vi,kb as xi,qb as $i,rb as ki,sb as Si,ub as Mi,vb as J,xb as G,yb as ye}from"./chunk-WPZ3HLSM.js";import{Pa as Ms,k as Xi}from"./chunk-PZVEUGQN.js";import{j as Re}from"./chunk-UMB5Q46E.js";import{a as Tn}from"./chunk-6SCME3KG.js";import{ga as st,i as re,k as tt,l as Rn,m as Pe,n as nt,o as Pn,p as it,q as Cn}from"./chunk-HOTMV2GM.js";import{i as Mn}from"./chunk-U6FPEY2R.js";import{Cg as se,Kg as dn,Mg as un,b as O,c as S,dg as ln,mh as C,qh as pn,sh as mn,th as hn,uh as fn,vh as gn,wh as bn,xh as wn,yh as yn}from"./chunk-4QBSG3PX.js";import{Da as $n,Ga as kn,aa as vn,cc as Sn,dc as et,l as cn,p as N,ya as xn,za as Qe}from"./chunk-GEMDZSMK.js";import{b as B,f as c,g as k,i as m,l as an}from"./chunk-6ZDBXU6B.js";import{a as x}from"./chunk-LO2NM3CE.js";var Y=_e.routing;function Vt(e){return Y.actions.find(n=>n.action===e)}function Z(e){return Vt(e)?.keys??[]}function D(e){return Object.hasOwn(Y.keys,e)?Y.keys[e]:void 0}function le(e){return re(e.voiceConfig)?e.voiceConfig:{}}function Qr(e,n){let t=Y.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function X(e,n){let t=D(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=Y.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?Qr(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,r]=t.clamp??[-1/0,1/0];return Math.min(r,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function Rs(e,n){let t=D(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=X(e,i[1]),r=i[3].split(/\s+or\s+/).map(a=>a.trim()),o=typeof s=="string"&&r.includes(s);return i[2]===void 0?o:!o}function Ue(e,n){let t=D(n);if(t?.type!=="enum")return[];let i=Y.labels[t.enum??""]??{},s=Y.offered[n]??Y.enums[t.enum??""]??[],r=X(e,n);return(typeof r=="string"&&!s.includes(r)?[r,...s]:s).map(a=>[a,i[a]??a])}function Ps(e){return D(e)?.label??eo[e]??e}var eo={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Dt(e,n,t){let i=D(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!Ue(e,n).some(([o])=>o===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[o,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(o,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let o=(t??"").trim();if(o==="")return Lt(e,n);s=o;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let o=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(o.length===0)return Lt(e,n);s=o;break}}return(Object.hasOwn(e,n)?st(e[n],s):st(X(e,n),s))?e:We(e,n,s)}function Cs(e,n,t,i){let s=X(e,n),r=Array.isArray(s)?s:[];return i===r.includes(t)?e:Dt(e,n,i?[...r,t]:r.filter(o=>o!==t))}function to(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function no(e,n){let t=D(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",r=X(e,s);return typeof r=="string"&&i.includes(r)}function _t(e,n,t,i){let s=D(n);if(s===void 0)return"None";if(!no(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let r=to(s,t);return typeof r=="string"&&r.trim()!==""?`Default (${i(r.trim())})`:Array.isArray(r)&&r.length>0?`Default (${r.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Ts(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function ce(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function Ke(e,n,t){let i=Ts(n),s=Ts(t);return e.filter(r=>!ce(i,r)&&(s.length===0||ce(s,r)))}function io(e,n){return{hiddenPhraseIds:e.filter(t=>!ce(n,t)),knownPhraseIds:e.slice()}}function Ls(e,n,t,i){if(!ce(n,t))return e;let s=Ke(n,e.hiddenPhraseIds,e.knownPhraseIds);if(ce(s,t)===i)return e;let r=i?n.filter(a=>ce(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),o=io(n,r);return We(We(e,"hiddenPhraseIds",o.hiddenPhraseIds),"knownPhraseIds",o.knownPhraseIds)}function As(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function so(e,n,t,i,s){return Ie(e,n,t,r=>{if(!Z(M(r)).includes(i))return r;let o=le(r),a=Dt(o,i,s);return a===o?r:at(r,"voiceConfig",a)})}function ro(e,n,t,i,s,r){return Ie(e,n,t,o=>{if(!Z(M(o)).includes(i))return o;let a=le(o),l=Cs(a,i,s,r);return l===a?o:at(o,"voiceConfig",l)})}function oo(e,n,t,i,s,r){return Ie(e,n,t,o=>M(o)==="ttsMenu"?Ls(o,i,s,r):o)}function Es(e){return Object.keys(le(e)).some(n=>Z(M(e)).includes(n))}function Is(e){let n=M(e);return Z(n).length>0||n==="ttsMenu"}function Os(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function ao(e,n,t,i){let s=qi(e.hass.states),r=St(s,t),o=a=>K(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),l=>i(a.entityId,l));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${r.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:r.map(o)}
    </div>`}function co(e,n,t,i){let s=D(t),r=As(e.voice?.defaults),o=s?.domain==="conversation"?Bi(e.hass.states):ji(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=St(o,i===""?[]:[i]);return[["",_t(n,t,r,u=>a.find(d=>d.entityId===u&&!d.missing)?.name??Os(e.hass,u))],...a.map(u=>[u.entityId,u.missing?`${u.entityId} (not found)`:u.name])]}function lo(e,n,t,i,s){let r=D(s);if(r===void 0||!Rs(i,s))return m;let o=Ps(s),a=X(i,s),l=(u,d)=>e.edit(f=>so(f,n,t,s,u),d);switch(r.type){case"enum":return J(o,String(a),Ue(i,s),u=>l(u),{snapBack:!0,def:String(r.default)});case"bool":return K(o,a===!0,u=>l(u),r.default);case"int":{let u=typeof a=="number"?a:Number(r.default),d=_e.volume,[f,b]=r.clamp??[d.min,d.max];return c`${ye(o,u,h=>l(h,`slot:${t}:${s}`),{min:f,max:b,step:d.step,def:Number(r.default),format:h=>`${Math.round(h)}${d.unit}`})}
        <div class="ts-after">${d.presets.map(h=>c`<button type="button" class="pe-chip ${h.value===u?"on":""}"
          aria-pressed=${h.value===u?"true":"false"} @click=${()=>l(h.value)}>${h.label} ${h.value}%</button>`)}</div>`}case"entity":{let u=typeof a=="string"?a:"";return J(o,u,co(e,i,s,u),d=>l(d===""?void 0:d),{snapBack:!0})}case"array":{let u=Array.isArray(a)?a:[],d=As(e.voice?.defaults),f=r.whenBlank!==void 0?`None picked: ${r.whenBlank}.`:r.fallsBackTo!==void 0?`None picked: ${_t(i,s,d,b=>Os(e.hass,b))}.`:"None picked.";return c`${ao(e,o,u,(b,h)=>e.edit(g=>ro(g,n,t,s,b,h)))}
        <div class="hint ${u.length===0&&r.fallsBackTo===void 0&&r.whenBlank===void 0?"warn":""}">${u.length===0?f:`${u.length} picked.`}</div>`}}}function uo(e,n,t){let i=typeof t.id=="string"?t.id:"",s=le(t),r=Z(M(t));return c`${e.voice?.defaults===void 0?c`<div class="hint">${as}.</div>`:m}
    ${r.map(o=>lo(e,n,i,s,o))}`}function po(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let r=s.map(d=>d.id),o=Ke(r,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(d=>typeof d=="string"):[],l=a.length>0&&r.some(d=>!a.some(f=>f.toUpperCase()===d.toUpperCase())),u=d=>o.some(f=>f.toUpperCase()===d.toUpperCase());return c`<div class="me-sub-h">${Vt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(d=>K(d.name,u(d.id),f=>e.edit(b=>oo(b,n,i,r,d.id,f))))}
    </div>
    <div class="hint">${o.length===0?"No phrase shows: the list on the watch is empty.":`${o.length} of ${s.length} show on the watch.`}</div>
    ${l?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:m}`}function Hs(e,n,t){let i=M(t);if(i==="ttsMenu")return po(e,n,t);if(Z(i).length>0)return uo(e,n,t)}function Ns(e,n){let t=M(n);if(t==="ttsMenu"){let o=e.voice?.phrases;return o===void 0?"":`${Ke(o.map(l=>l.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${o.length} phrases`}let i=le(n),s=Z(t)[0];if(s===void 0)return"";let r=X(i,s);return Ue(i,s).find(([o])=>o===r)?.[1]??""}function Ws(e,n,t,i,s,r,o=""){return c`<div class="mi-look">
    <div class="mi-look-title">${$i(e,n,t,l=>r(l),l=>i.find(([u])=>u===l)?.[1]??l)}</div>
    <div class="mi-pics ${o}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([l,u])=>{let d=l===n;return c`<button type="button" class="mi-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${e}: ${u}`}
          @click=${()=>{l!==n&&r(l)}}>${s(l)}<span class="mi-pic-name">${u}</span></button>`})}
    </div>
  </div>`}function qe(e,n,t,i,s){return c`<div class="mi-switch">${K(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function mo(e){return c`<div class="mi-wrap">${e}</div>`}function Fe(e,n){return te(e).find(t=>t.key===n)}function Wt(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function ze(e,n,t){return te(n).some(i=>t.includes(i.key)&&Ve(e,n,i)&&!Wt(z(e,n,i),i.default))}function Be(e,n,t){let i=Fe(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:z(e.document,n,i),set:(r,o=!1)=>e.edit(a=>ii(a,n,t,r),o?s:void 0)}}function Ut(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function Je(e,n){return n===void 0?m:ye(e,Ut(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function Vs(e,n,t,i){if(n===void 0)return m;let s=n.value===!0?"on":"off",r=n.field.default===!0?"on":"off";return Ws(e,s,r,[["off",t[0]],["on",t[1]]],o=>i(o==="on"),o=>n.set(o==="on"))}var Us=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],Ks=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],Ds=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function ho(e){return c`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function fo(e){return c`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function go(e){if(e===void 0)return m;let n=Ut(e),t=(e.field.presets??Ds.map(([s,r])=>({value:s,label:r}))).map(s=>[String(s.value),Ds.find(([r])=>Wt(r,s.value))?.[1]??s.label]),i=t.find(([s])=>Wt(Number(s),n))?.[0]??"";return c`${G("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${Je("Exact",e)}`}function Bs(e){let n=i=>Be(e,"quickAction",i),t=n("showContextLabel");return c`
    ${Vs("Behind the ring",n("showIconBubble"),["Solid","Glass"],ho)}
    ${go(n("backgroundDim"))}
    ${Vs("Buttons",n("showNeonOutline"),["Plain","Neon"],fo)}
    ${t===void 0?m:qe("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${Je("Glow",n("glowIntensity"))}`}function js(e){let n=t=>{let i=Fe("quickAction",t);return i===void 0?void 0:z(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function bo(){let e=ae("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function wo(e){let n=k``;switch(e){case"sectorWedge":n=k`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=k`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=k`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=k`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=k`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function yo(e,n){if(n===void 0||!Ve(e.document,"quickAction",n.field))return m;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${De("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?m:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let r=s.toUpperCase()===t.toUpperCase();return c`<button type="button" class="ts-swatch ${r?"on":""}" aria-pressed=${r?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function qs(e){let n=o=>Be(e,"quickAction",o),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),r=n("showFingerShadow");return c`
    ${t===void 0?m:mo(G("Opening",String(t.value),ae("EntranceStyle"),o=>t.set(o),{def:String(t.field.default)}))}
    ${i===void 0?m:Ws("Beam from your finger to the slot",String(i.value),String(i.field.default),bo(),wo,o=>i.set(o),"beams")}
    ${yo(e,n("beamColor"))}
    ${s===void 0||!Ve(e.document,"quickAction",s.field)?m:Je("Beam strength",s)}
    ${r===void 0?m:qe("Finger shadow",r.value===!0,o=>r.set(o),r.field.default===!0,"A soft dark spot where your finger rests.")}`}function Fs(e){let n=s=>{let r=Fe("quickAction",s);return r===void 0?"":String(z(e,"quickAction",r))},t=(s,r)=>ae(s).find(([o])=>o===r)?.[1]??r,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var zs=["glowIntensity","selectedScale"];function de(e){return Math.round(e*1e3)/10}function Js(e){let n=Be(e,"pageSwitcher","glowIntensity"),t=Be(e,"pageSwitcher","selectedScale");return c`${Je("Glow",n)}
    ${t===void 0?m:ye("Picked page size",de(Ut(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:de(t.field.min??1),max:de(t.field.max??1.5),step:de(t.field.step??.05),def:de(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function Gs(e){let n=Fe("pageSwitcher","selectedScale"),t=n===void 0?void 0:z(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(de(t))}%`:""}function je(e,n,t,i){return e.render(n,t,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var Ys=["light","switch","lock","cover","climate","media_player"],vo={media_player:"Media player"};function Zs(e,n,t,i,s){let r=t.some(a=>a.domain===n),o=r?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let l=a.domain===n,u=vo[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${l?"on":""}" aria-pressed=${l?"true":"false"} data-type=${a.domain}
          @click=${()=>{l||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${je(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${u}</span></button>`})}
    </div>
    ${J("More types",r?"":n,o,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function Xs(e,n,t,i){return c`<div class="mi-acts">${t.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(r=>{let o=r.raw===n,a=!o&&r.why!==void 0;return c`<button type="button" class="mi-act ${o?"on":""}" aria-pressed=${o?"true":"false"} ?disabled=${a} data-action=${r.raw}
        title=${r.why??m} @click=${()=>{o||i(r.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${je(e,r.icon,14,r.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${r.label}</span>
          ${r.why===void 0||o?m:c`<small class="mi-act-why">${r.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var xo=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function _s(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function Qs(e,n,t,i){let s=new Map(t.map(o=>[o.position,o])),r=o=>{if(o===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(o);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let l=a.here?"here":a.holder===void 0?"free":"held",u=a.here?je(e,n.icon,14,n.color):a.holder===void 0?C("plus"):je(e,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${l}" data-place=${o} aria-label=${_s(a)} title=${_s(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:m}
      @click=${()=>{a.here||i(o)}}>${u}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${xo.map(o=>o.map(r))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var er=B`
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
  .mi-pic.on { background: var(--wa-pick-bg); border-color: var(--wa-pick-line); color: var(--wa-ink); }
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
    border: 1px solid var(--wa-line-strong); border-radius: 12px; background: transparent;
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
    margin: 4px 0 6px; padding: 7px 9px; border: 1px solid var(--wa-line); border-radius: 10px;
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
`;var sr=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]];function rr(e){return e==="entity"?["entity"]:["anywhere","switcher"]}var or="Each page's icon, color and name are set here: pick a page in the Pages card.",$o="Pick a page in the Pages card to set how it shows here.",ko={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},ar={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:or},So="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Mo="Click a slot or its label to edit it. Click anywhere else for the menu's look.",me=.36,jt=44,qt=22;function cr(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function To(e,n,t=me){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=r=>Math.round(r*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var lr="wrist-assistant-panel.menus.zoom.v1";function dr(e=bt()){try{let n=e?.getItem(lr);if(n==null||n==="")return;let t=Number(n);return Yi.includes(t)?t:void 0}catch{return}}function ur(e,n=bt()){try{n?.setItem(lr,e===void 0?"":String(e))}catch{}}var pr={name:{color:N.place,icon:"text"},slot:{color:N.content,icon:"content"},where:{color:N.position,icon:"place"},look:{color:N.look,icon:"look"},shows:{color:N.states,icon:"states"},menu:{color:N.content,icon:"content"},style:{color:N.look,icon:"look"},motion:{color:N.look,icon:"radial"},switcherPage:{color:N.content,icon:"watch"}},Ro="#26a69a",Po=N.complication,H="menu-editor";function xe(e,n,t){return`${e} ${e===1?n:t}`}function ue(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function mr(e,n){return{entityId:n,displayName:n===""?"":ue(e,n),domain:Ae(n)}}function ke(e,n,t,i){return e.icons.render(n,t,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function V(e){return oe(M(e))===void 0?{icon:ge.unknownActionIcon,color:ge.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function hr(e){let n=M(e);if(n==="triggerEntity"){let i=be(e).entityId;return lt(Ae(typeof i=="string"?i:""))}let t=oe(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function P(e,n){return e.toUpperCase()===n.toUpperCase()}function Co(e,n){return e.toUpperCase()===n.toUpperCase()}function Lo(e,n){let t=M(n),i=be(n),s=oe(t);for(let r of s?.payload??[]){let o=i[r.key];if(!(typeof o!="string"||o==="")){if(r.type==="entity")return ue(e.hass,o);if(r.target==="page")return e.targets.pages.find(a=>P(a.id,o))?.name??"A page not in the pages";if(r.target==="statusPage")return e.targets.statusPages.find(a=>P(a.id,o))?.name??"A status page";if(r.target==="httpAction")return e.targets.httpActions.find(a=>P(a.id,o))?.name??"An HTTP action";if(r.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(l=>P(l.id,o))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function ne(e,n){return Lo(e,n)??j(M(n))}function pe(e){return we(e)?.label??e}var fr="me:menu",gr="me:er:mode",br="me:er:domain",Bt="me:er:entity",Kt="me:er:add";function T(e){let n=e.uiState.get(fr);return n==="entity"||n==="switcher"?n:"anywhere"}function wr(e,n){n!==T(e)&&e.uiState.delete($e),e.uiState.set(fr,n),e.requestUpdate()}function yr(e,n){for(let t of[...e.uiState.keys()])t.startsWith(Tr)&&e.uiState.delete(t);e.uiState.delete($e),wr(e,n)}var $e="me:sw:page";function vr(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function he(e){if(T(e)!=="switcher")return;let n=e.uiState.get($e);if(typeof n=="string")return vr(e).find(t=>P(t.id,n))}function Ft(e,n){n===void 0?e.uiState.delete($e):e.uiState.set($e,n),e.requestUpdate()}function xr(e){let n=he(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function zt(e){return sr.find(([n])=>n===e)?.[1]??e}function $r(e){return e.uiState.get(gr)==="entity"?"entity":"domain"}function kr(e){let n=e.uiState.get(br);return typeof n=="string"&&we(n)!==void 0?n:"light"}function Sr(e){let n=gt(e.document),t=e.uiState.get(Bt);return typeof t=="string"&&n.includes(t)?t:n[0]}function W(e){switch(T(e)){case"anywhere":return Ee;case"entity":return Jt(e);case"switcher":return}}function Jt(e){if($r(e)==="domain")return{list:"domain",domain:kr(e)};let n=Sr(e);return n===void 0?void 0:{list:"entity",entityId:n}}function Mr(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${pe(n.domain)} menu`:`${ue(e.hass,n.entityId)} menu`}var Tr="me:sel:";function Rr(e){return`${Tr}${Dn(e)}`}function ie(e,n){let t=e.uiState.get(Rr(n));if(typeof t=="string")return q(e.document,n).find(i=>P(R(i),t))}function fe(e,n,t){e.uiState.set(Rr(n),t),e.requestUpdate()}function Se(e){if(he(e)!==void 0)return Ft(e,void 0),!0;let n=W(e);return n===void 0||ie(e,n)===void 0?!1:(fe(e,n,void 0),!0)}function Ge(e,n,t){let i;e.edit(s=>{let r=jn(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=r.id,r.document}),i!==void 0&&fe(e,n,i)}function tr(e){let t=(i,s)=>Math.round((s+(i-.5)/me*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${jt} ${qt}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>k`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function Ao(e,n){return n===void 0?[]:q(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=He(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:V(t).color}]})}function Eo(e,n){if(n==="switcher")return xe(e.switcherPages.length,"page","pages");let t=n==="anywhere"?Ee:Jt(e);return t===void 0?"none yet":xe(q(e.document,t).length,"slot","slots")}function Io(e,n){if(n==="switcher"){let t=e.switcherPages;return tr(t.map((i,s)=>({...To(s,t.length),color:i.color})))}return tr(Ao(e,n==="anywhere"?Ee:Jt(e)))}var Oo="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function Pr(e){let n=T(e);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${jt}px; --thumb-h: ${qt}px`}>
    <div class="lc-head">
      <span class="swatch">${C("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${So}>on the watch</span>
    </div>
    <p class="me-intro">${Oo}</p>
    <div class="layers me-menu-list" role="list">
      ${sr.filter(([t])=>e.sections===void 0||e.sections.includes(t)).map(([t,i])=>{let s=t===n,r=()=>{s||wr(e,t)},o=e.menuBadge?.(t);return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${ar[t]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          ${Io(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${Eo(e,t)}</span>${o===void 0?m:c`<span class="badge me-named" title=${`This device uses "${o}"`}>${o}</span>`}</b><small>${ko[t]}</small>
            ${e.menuFoot?.(t)??m}</span>
        </div>`})}
    </div>
  </section>`}function Ho(e,n,t){return c`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${ke(e,n,14,t)}</span></span>`}function nr(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${pe(n.domain)} menu, by type`:`${ue(e.hass,n.entityId)}'s own menu`}function No(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function Vo(e,n,t){let i=t!==void 0&&P(t.id,n.id),s=No(n),r=()=>Ft(e,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${o=>{o.target instanceof Element&&o.target.closest("button")||r()}}
    @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Ho(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:m}</span></span>
  </div>`}function Do(e){let n=vr(e),t=he(e),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${jt}px; --thumb-h: ${qt}px`}>
    <div class="lc-head">
      <span class="swatch">${C("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${xe(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>Vo(e,s,t))}</div>`}
  </section>`}function Cr(e){return T(e)==="switcher"?Do(e):m}function Lr(e){if(T(e)==="switcher")return[xe(e.switcherPages.length,"page","pages")];let n=W(e);if(n===void 0)return[nr(e,n)];let t=xe(q(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[nr(e,n),t]}function Ar(e){return T(e)==="switcher"?or:W(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Mo}function Er(e,n){return Fi(e.uiState,H,n)}function _o(e,n){zi(e.uiState,H,n,!Er(e,n)),e.requestUpdate()}function Wo(e){if(xr(e)!==void 0)return[{module:H,section:"switcher-page"}];let n=W(e),t=n===void 0?void 0:ie(e,n);if(t!==void 0)return[{module:H,section:"slot"},{module:H,section:"where"},...Is(t)?[{module:H,section:"voice"}]:[],{module:H,section:"look"},...n?.list==="anywhere"?[{module:H,section:"shows"}]:[]];let i=T(e);return i==="anywhere"?[{module:H,section:"style-anywhere"},{module:H,section:"motion-anywhere"}]:[{module:H,section:i==="entity"?"menu":`style-${i}`}]}function _(e,n,t,i,s,r={}){let o=Er(e,t),a=pr[n];return yn({color:a.color,icon:C(a.icon),title:i,open:o,onToggle:()=>_o(e,t),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${H}:${t}`},o?s:c``)}function Ir(e){let n=T(e),t=zt(n),i=W(e),s=i===void 0?void 0:ie(e,i),r=Wo(e),o=Ji(e.uiState,r),a=he(e),l=xr(e),u,d;if(a!==void 0&&l!==void 0)u=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>Ft(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Po}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,d=Uo(e,l);else if(s===void 0||i===void 0)u=c`<div class="crumbs"><span class="kchip" style=${`--k:${Ro}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,d=ua(e,n);else{let f=ne(e,s);u=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>fe(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${V(s).color}`}>Slot</span><span class="nm" title=${f}>${f}</span></div>`,d=oa(e,i,s)}return c`<div class="insp-head">
      ${u}
      <button class="expand" @click=${()=>{Gi(e.uiState,r,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${d}</div>`}function Uo(e,n){let t=n.page;return _(e,"switcherPage","switcher-page",Ct,c`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Ct}>${ds(n)}</fieldset>`,{summary:ls(t),dot:cs(t)})}var Ko={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function Or(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Ko[n.key]??n.key}var Bo={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function jo(e,n){if(n==="entityControl"){let t=_n(e)??"all";return t==="all"?"Any entity":pe(t)}return Bo[n]??En(n)}function qo(e,n,t){let i=M(t),s=Kn(n),r=a=>{let l=oe(a),u=l===void 0?{icon:ge.unknownActionIcon,color:ge.unknownActionColor}:l,d=a===i?void 0:In(a,e.targets);return{raw:a,label:j(a),icon:u.icon,color:u.color,...d===void 0?{}:{why:d}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[r(i)]}],...s.map(a=>({heading:jo(n,a.category),tiles:a.actions.map(r)}))]}function Fo(e){return e.needsSetup===!0?`${e.name} (needs setup)`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function ir(){return c`<button type="button" class="link" @click=${Ms}>Open HTTP actions</button>`}function zo(e,n,t){let i=n.find(s=>P(s.id,t));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${ir()}</div>`:e.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${Ui} ${ir()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?c`<div class="hint ts-under">No HTTP actions to list yet.</div>`:m}function Jo(e,n,t,i,s){let r=R(t),o=be(t)[s.key],a=typeof o=="string"?o:"",l=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,u=a===""||l.some(p=>P(p.id,a)),d=p=>e.edit(v=>mt(v,n,r,s.key,p===""?void 0:p)),f=s.target==="statusPage"&&e.statusPagesKnown===!0,b=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,h=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":f?`Not in this ${Qe(e.device??"watch")}'s status pages`:b?Wi:Vi,g=p=>s.target==="httpAction"?Fo(p):p.name;return c`<label class="field"><span>${Or(i,s)}</span>
    <select .value=${Re(l.find(p=>P(p.id,a))?.id??a)} @change=${p=>d(p.target.value)}>
      ${s.required===!0?m:c`<option value="" ?selected=${a===""}>None</option>`}
      ${u?m:c`<option value=${a} selected>${h}</option>`}
      ${l.map(p=>c`<option value=${p.id} ?selected=${P(p.id,a)}>${g(p)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.device==="iphone"?c`<div class="hint ts-under">${oi()}</div>`:e.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:m:s.target==="statusPage"?f||e.catalogKnown?m:c`<div class="hint ts-under">${xn("status pages",e.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?zo(e,e.targets.httpActions,a):m}`}function Go(e,n,t,i,s){let r=R(t),o=be(t),a=(d,f)=>e.edit(b=>mt(b,n,r,s.key,d),f),l=Or(i,s),u=ht(t,s);switch(s.type){case"entity":{let d=typeof o[s.key]=="string"?o[s.key]:"",f=i==="runScene"?"scene":i==="runScript"?"script":Hn();return c`<div class="ts-stack">${xt({hass:e.hass},l,mr(e.hass,d),b=>a(b.entityId),`me:entity:${r}`,{domain:f,clearable:!1,needed:d===""})}</div>
        ${d===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:m}`}case"uuid":return Jo(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let b=Ae(typeof o.entityId=="string"?o.entityId:""),h=On(b),g=typeof u=="string"?u:h[0]??"",p=h.map(v=>[v,ct(v)]);return h.includes(g)||p.unshift([g,ct(g)]),J(l,g,p,v=>a(v),{snapBack:!0})}let d=ae(s.enum),f=typeof u=="string"?u:String(s.default??"");return d.length<=4?G(l,f,d,b=>a(b)):J(l,f,d,b=>a(b),{snapBack:!0})}case"bool":return K(l,u===!0,d=>a(d),s.default);case"number":{if(s.key==="bannerSeconds"&&ht(t,{key:"showBanner",type:"bool",default:!0})===!1)return m;let d=typeof o[s.key]=="number"?o[s.key]:void 0;return Mi(l,d,f=>a(f,`slot:${r}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function Yo(e,n,t){if(!ut(n,t))return m;let i=R(t);return c`<div class="ts-stack">${G("Skip conditions",is(pt(t)),ns,s=>e.edit(r=>Jn(r,n,i,ss(s))))}</div>
    <div class="hint ts-under">Skip runs the automation's actions without checking its conditions first. Default follows the tile, then ${vn("automationTriggerSkipConditions",Qe(e.device??"watch"))}, which skips them unless it is turned off.</div>`}function Zo(e){let n=Ne(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(pe).join(", ")}function Xo(e,n){let t=R(n),i=Ne(n),s=i===void 0,r=l=>e.edit(u=>Qn(u,t,l)),o=Xn(),a=(i??[]).filter(l=>!ft(l));return c`<div class="mi-wrap">${G("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],l=>r(l==="every"?void 0:o.slice(0,1)),{def:"every"})}</div>
    ${s?m:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...o,...a].map(l=>{let u=i.includes(l),d=!ft(l);return c`<button type="button" class="pe-chip ${u?"on":""} ${d?"odd":""}" aria-pressed=${u?"true":"false"}
          title=${d?"Not reported by the watch":m}
          @click=${()=>r(u?i.filter(f=>f!==l):[...i,l])}>${pe(l)}</button>`})}
    </div>
    ${a.length===0?m:c`<div class="hint warn">${a.map(pe).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function Qo(e,n){return ut(n,e)&&pt(e)!==null}function ea(e){return e.isVisible===!1}function ta(e){return Ne(e)!==void 0}function na(e){let n=hr(e);if(n===void 0)return!1;let t=V(e);return t.icon!==n.icon||!Co(t.color,n.color)}function ia(e,n){let t=pr.name;return c`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${C(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${ne(e,n)}</span>
    </div>
  </section>`}function sa(e){let n=F(e);return n.charAt(0)+n.slice(1).toLowerCase()}function ra(e,n,t){let i=R(t),s=q(e.document,n).filter(r=>!P(R(r),i));return Oe().map(r=>{let o=s.find(l=>l.position===r),a={position:r,label:sa(r),here:t.position===r};return o!==void 0&&(a.holder={name:ne(e,o),...V(o)}),a})}function oa(e,n,t){let i=R(t),s=M(t),r=oe(s),o=V(t),a=hr(t),l=typeof t.position=="string"?t.position:"",u=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${r===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app cannot run it until the app is updated. Pick another action to replace it.</div>`:m}
    ${Xs(e.icons,s,qo(e,n,t),h=>e.edit(g=>Zn(g,n,i,h,e.targets)))}
    ${r?.description?c`<div class="mi-desc">${r.description}</div>`:m}
    ${Bn(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:m}
    ${(r?.payload??[]).map(h=>Go(e,n,t,s,h))}
    ${Yo(e,n,t)}
  </fieldset>`,d=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${Qs(e.icons,o,ra(e,n,t),h=>e.edit(g=>Fn(g,n,i,h)))}
    ${K("Shown on the watch",t.isVisible!==!1,h=>e.edit(g=>zn(g,n,i,h)),!0)}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${Ti({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",h=>e.edit(g=>Gn(g,n,i,h),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${De("Color",typeof t.color=="string"?t.color:void 0,h=>{h!==void 0&&e.edit(g=>Yn(g,n,i,h),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,b=Hs(e,n,t);return c`${ia(e,t)}
    ${_(e,"slot","slot","What it does",u,{summary:j(s),dot:Qo(t,n)})}
    ${_(e,"where","where","Where",d,{summary:`${F(l)}${t.isVisible===!1?", hidden":""}`,dot:ea(t)})}
    ${b===void 0?m:_(e,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${b}</fieldset>`,{summary:Ns(e,t),dot:Es(t)})}
    ${_(e,"look","look","Icon and color",f,{summary:o.icon,dot:na(t)})}
    ${n.list==="anywhere"?_(e,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${Xo(e,t)}</fieldset>`,{summary:Zo(t),dot:ta(t)}):m}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(h=>qn(h,n,i))}>${C("delete")}<span>Remove</span></button>
    </div>`}function aa(e){let n=ze(e.document,"quickAction",Us),t=ze(e.document,"quickAction",Ks);return c`${_(e,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${Bs(e)}
    </fieldset>`,{summary:js(e.document),dot:n})}
    ${_(e,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${qs(e)}
    </fieldset>`,{summary:Fs(e.document),dot:t})}`}function ca(e){let n=ze(e.document,"pageSwitcher",zs);return _(e,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${Js(e)}
  </fieldset>`,{summary:Gs(e.document),dot:n})}function la(e){let n=$r(e),t=a=>{e.uiState.set(gr,a),e.requestUpdate()},i=G("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,r,o=!1;if(n==="domain"){let a=kr(e),l=we(a),u=Vn(a),d=Nn().map(h=>[h.domain,h.label]),f=Ys.flatMap(h=>{let g=we(h);return g===void 0?[]:[{domain:g.domain,label:g.label,icon:g.icon,color:lt(g.domain).color}]}),b=l?.inheritKey?Wn(e.document,a):!1;o=b,r=`By type \xB7 ${l?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${Zs(e.icons,a,f,d,h=>{e.uiState.set(br,h),e.requestUpdate()})}
      ${u.length>0?c`<div class="hint ts-under keep">The same menu as ${u.map(h=>h.label).join(", ")}.</div>`:m}
      ${l?.inheritKey?qe("Fill gaps with the All menu",b,h=>e.edit(g=>ei(g,a,h)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):m}`}else{let a=gt(e.document),l=Sr(e);r=`By entity \xB7 ${l===void 0?"none yet":ue(e.hass,l)}`;let u=d=>{let f=d.entityId.trim();f!==""&&(e.edit(b=>ti(b,f)),e.uiState.set(Bt,f),e.uiState.set(Kt,(Number(e.uiState.get(Kt)??0)||0)+1),e.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:m}
      ${a.map(d=>{let f=d===l;return c`<div class="me-entity ${f?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${f?"true":"false"}
            @click=${()=>{e.uiState.set(Bt,d),e.requestUpdate()}}>
            <b>${ue(e.hass,d)}</b><code>${d}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(b=>ni(b,d))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${xt({hass:e.hass},"Add an entity",mr(e.hass,""),u,`me:er:add:${String(e.uiState.get(Kt)??0)}`,{clearable:!1})}
      </div>
    </div>`}return _(e,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:r,dot:o})}var da="Click a slot on the watch to change what it does.";function ua(e,n){let t=n==="anywhere"?aa(e):n==="switcher"?ca(e):la(e);return c`<p class="me-menu-note">${ar[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?$o:da}</p>`}var Hr=B`
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
    background: var(--wa-accent); color: var(--wa-accent-ink); font-size: 10px; font-weight: 700; line-height: 16px; text-align: center;
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
`;var pa=["spring","popIn","fade","none"],ma=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Me(e,n,t){let i=te(n).find(s=>s.key===t);return i===void 0?void 0:z(e,n,i)}function Te(e,n,t,i){let s=te(n).find(a=>a.key===t),r=Me(e,n,t),o=typeof r=="number"&&Number.isFinite(r)?r:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,o))}function Ye(e,n){return Me(e,"quickAction",n)===!0}function ha(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function Ze(e){let n=Me(e,"quickAction","entranceStyle"),t=Me(e,"quickAction","beamStyle");return{glass:Ye(e,"showIconBubble"),neon:Ye(e,"showNeonOutline"),labels:Ye(e,"showContextLabel"),finger:Ye(e,"showFingerShadow"),entrance:pa.includes(n)?n:"none",dim:Te(e,"quickAction","backgroundDim",1),beam:ma.includes(t)?t:"none",beamColor:ha(Me(e,"quickAction","beamColor")),beamIntensity:Te(e,"quickAction","beamIntensity",.5),glow:Te(e,"quickAction","glowIntensity",.5)}}function fa(e){return{glow:Te(e,"pageSwitcher","glowIntensity",.5),scale:Te(e,"pageSwitcher","selectedScale",1.2)}}var Yt="ms:play",ga=1500;function ba(e){let n=e.uiState.get(Yt);e.uiState.set(Yt,{menu:T(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function wa(e){let n=e.uiState.get(Yt);return n===void 0||n.menu!==T(e)||Date.now()-n.at>ga?"":n.count%2===1?"ms-play-a":"ms-play-b"}function Dr(e,n){let t=q(e,n),i=Un(e,n),s=new Set(dt(e,n));return Oe().map(r=>{let o=t.filter(d=>d.position===r),a=o.find(d=>d.isVisible!==!1),l=a===void 0?i.find(d=>d.position===r&&d.isVisible!==!1):void 0,u=a??(l===void 0?o[0]:void 0);return{position:r,own:o,main:u,second:o.find(d=>d!==u),shared:l,free:s.has(r)}})}function ya(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=R(n),r=e.find(o=>o.main!==void 0&&P(R(o.main),s));if(r!==void 0)return{position:r.position,slot:n}}let i=e.flatMap(s=>{let r=t(s.main)?s.main:s.shared;return r===void 0?[]:[{position:s.position,slot:r}]});return i.find(s=>s.position==="topCenter")??i[0]}var w=e=>Math.round(e*100)/100;function Xt(e,n){let t=cr(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function Gt(e,n,t,i){return _r(e,n,Xt(e.screen,t),i)}function _r(e,n,t,i){let{width:s,height:r}=e.screen,o=e.scale,a=[`left:${t.x*100}%`,`top:${t.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${w((s/2-t.px)*o)}px`,`--fy:${w((r/2-t.py)*o)}px`),n.finger){let l=t.px-s/2,u=t.py-r/2,d=Math.hypot(l,u);d>1&&a.push(`--sx:${w(l/d*5*o)}px`,`--sy:${w(u/d*5*o)}px`)}return a.join(";")}function Zt(e,n){return Math.round(n*e.scale)}function va(e,n,t,i,s){let r=Xt(e.screen,t),o=(n.glass?28:25)*(r.y>.5?-1:1),a=(r.py+o)/e.screen.height;return c`<span class="ms-name" aria-hidden="true" style=${`left:${r.x*100}%;top:${w(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function xa(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,r=t*.18,o=(n-i*2-s)/2,a=(t-r-i-s*2)/3,l=[0,1,2,3,4,5].map(u=>{let d=i+u%2*(o+s),f=r+Math.floor(u/2)*(a+s);return k`<rect class=${`ms-tile t${u%4}`} x=${w(d)} y=${w(f)} width=${w(o)} height=${w(a)} rx=${w(n*.06)}></rect>`});return c`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${w(i)} y=${w(t*.075)} width=${w(n*.4)} height=${w(t*.045)} rx=${w(t*.0225)}></rect>
    ${l}
  </svg>`}function Q(e,n,t){return k`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function Nr(e,n,t,i){return k`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${w(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${w(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function $a(e,n,t){if(e.beam==="none")return m;let i=e.beamColor,s=e.beamIntensity,r=n.width/2,o=n.height/2,a=t.x-r,l=t.y-o,u=Math.hypot(a,l),d=Math.atan2(l,a),f=(p,v)=>`${w(r+Math.cos(d+p)*v)},${w(o+Math.sin(d+p)*v)}`,b=w(t.x),h=w(t.y),g;switch(e.beam){case"sectorWedge":{let p=Math.PI/4;g=k`${Q("ms-b8",8,n)}${Q("ms-b3",3,n)}
        <polygon points=${`${r},${o} ${f(-p/2,u*1.2)} ${f(p/2,u*1.2)}`} fill=${i} fill-opacity=${w(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${r},${o} ${f(-p*.3,u)} ${f(p*.3,u)}`} fill=${i} fill-opacity=${w(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":g=k`${Q("ms-b7",7,n)}${Q("ms-b10",10,n)}${Nr("ms-wash",i,.35*s,.18*s)}
        <circle cx=${w((r+t.x)/2)} cy=${w((o+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${b} cy=${h} r="40" fill=${i} fill-opacity=${w(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":g=k`${Q("ms-b4",4,n)}${Q("ms-b5",5,n)}${Nr("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${b} cy=${h} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${b} cy=${h} r="25" fill=${i} fill-opacity=${w(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":g=k`${Q("ms-b6",6,n)}
        <circle cx=${b} cy=${h} r="30" fill=${i} fill-opacity=${w(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(p=>k`<circle cx=${b} cy=${h} r=${w((30+p*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${w((1-p)*.45*s)} stroke-width=${w(2-p*1.2)}></circle>`)}`;break;case"wakeWave":g=k`${Q("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${r} y1=${o} x2=${b} y2=${h}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${w(.5*s)}></stop></linearGradient>
        <line x1=${r} y1=${o} x2=${b} y2=${h} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(p=>{let v=1-p;return k`<circle cx=${w(r+a*p)} cy=${w(o+l*p)} r=${w((20+v*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${w((1-v)*.5*s)} stroke-width=${w(Math.max(1.5-v*1.2,.3))}></circle>`})}
        <circle cx=${b} cy=${h} r="18" fill=${i} fill-opacity=${w(.25*s)} filter="url(#ms-b4)"></circle>`;break}return k`<g class="ms-beam">${g}</g>`}function ka(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":wa(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${w(n.dim*.85)}`,`--ms-blur:${w(2+n.dim*4)}px`,`--ms-g-r:${w(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function Qt(e,n,t,i,s={}){let{width:r,height:o}=e.screen,a=e.scale,l=Math.min(r,o),u=ka(e,t),d=[`width:${Math.round(r*a)}px;height:${Math.round(o*a)}px;--me-s:${a}`,u.style,s.style??""].filter(b=>b!=="").join(";"),f=c`<div class=${`me-screen ms-screen ${u.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${d}>
    <div class="ms-backdrop" aria-hidden="true">${xa(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${r} ${o}`} aria-hidden="true">
      ${s.beamTo===void 0?m:$a(t,e.screen,s.beamTo)}
      <circle cx=${r/2} cy=${o/2} r=${l*me} class="me-track"></circle>
      ${t.finger?k`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${r/2} cy=${o/2} r=${w(l*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:m}
      <circle cx=${r/2} cy=${o/2} r=${l*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return Hi(e.phone,{width:r,height:o},a,f,n,e.icons)}function Sa(e,n,t,i){let s=Ze(e.document),r=Dr(e.document,n),o=ya(r,t),a=o===void 0?void 0:R(o.slot),l=t===void 0?void 0:R(t),u=(p,v=me)=>He(p,v),d=p=>a!==void 0&&P(R(p),a),f=(p,v,I,$,A)=>{let E=V(p),U=R(p),L=l!==void 0&&P(U,l),ee=p.isVisible===!1,on=`${F(v)}: ${j(M(p))}${ee?", hidden":""}`,Zr=["me-dot",$,L?"on":"",ee?"off":"",d(p)&&$===""?"ms-active":""].filter(Xr=>Xr!=="").join(" ");return c`<button type="button" class=${Zr} style=${Gt(e,s,I,E.color)}
      title=${on} aria-label=${on} aria-pressed=${L?"true":"false"} @click=${()=>fe(e,n,U)}>
      ${ke(e,E.icon,Zt(e,$===""?15:11),E.color)}${A>1?c`<span class="me-count" aria-hidden="true">${A}</span>`:m}</button>`},b=r.map(p=>{let v=u(p.position);if(v===void 0)return m;let I=m,$;if(p.main!==void 0)I=f(p.main,p.position,v,"",p.own.length),p.main.isVisible!==!1&&($=p.main);else if(p.shared!==void 0){let L=V(p.shared),ee=`${F(p.position)}: ${j(M(p.shared))}, from All`;I=c`<span class=${`me-dot inh${d(p.shared)?" ms-active":""}`} style=${Gt(e,s,v,L.color)} title=${ee}>
        ${ke(e,L.icon,Zt(e,13),L.color)}</span>`,$=p.shared}else if(p.free){let L=F(p.position);I=c`<button type="button" class="me-dot free" style=${Gt(e,s,v)} ?disabled=${e.busy}
        title=${`Add a slot at ${L}`} aria-label=${`Add a slot at ${L}`}
        @click=${()=>Ge(e,n,p.position)}>${C("plus")}</button>`}let A=p.second===void 0?void 0:u(p.position,.2),E=p.second===void 0||A===void 0?m:f(p.second,p.position,A,"two",0),U=s.labels&&$!==void 0?va(e,s,v,V($).color,ne(e,$)):m;return c`${I}${E}${U}`}),h=o===void 0?void 0:u(o.position),g=Xt(e.screen,h??{x:.5,y:.5-me});return Qt(e,`${i} on the watch`,s,b,{beamTo:{x:g.px,y:g.py}})}function Wr(e){let n=t=>Math.min(1.18,Math.max(.82,t));return{w:n(e.width/198),h:n(e.height/242)}}function Vr(e,n,t){let{width:i,height:s}=e,r=Wr(e),o=34*r.w,a=i-34*r.w,l=52*r.h,u=s-30*r.h,d=(l+u)/2,f=i/2,b=18*r.w,h=8*r.h,g=[{x:f,y:l-14*r.h},{x:o+b,y:l+h},{x:o,y:d},{x:o+b,y:u-h},{x:f,y:u+8*r.h},{x:a-b,y:u-h},{x:a,y:d},{x:a-b,y:l+h}];if(t<=1)return g[0];let p=[0];for(let $=1;$<=g.length;$++){let A=g[$-1],E=g[$%g.length];p.push(p[$-1]+Math.hypot(E.x-A.x,E.y-A.y))}let v=p[g.length],I=n*v/t%v;for(let $=0;$<g.length;$++){let A=p[$],E=p[$+1];if(I>=A&&I<=E){let U=E>A?(I-A)/(E-A):0,L=g[$],ee=g[($+1)%g.length];return{x:L.x+(ee.x-L.x)*U,y:L.y+(ee.y-L.y)*U}}}return g[0]}function Ma(e){return[...e].slice(0,4).join("").trim()}function Ta(e){let n=Ze(e.document),t=fa(e.document),i=e.switcherPages,s=he(e),r=Math.max(0,s===void 0?0:i.findIndex(h=>P(h.id,s.id))),{width:o,height:a}=e.screen,l=h=>({x:h.x/o,y:h.y/a,px:h.x,py:h.y}),u=i.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((h,g)=>{let p=l(Vr(e.screen,g,i.length)),v=g===r,I=g===0&&!v,$=Math.round((v?.7:I?.4:.15)*t.glow*100),A=[_r(e,n,p,h.color),`--ms-ga:${$}%`,`--ms-gr:${v?45:30}`,`--ms-k:${v?t.scale:1}`].join(";"),E=["ms-sw",v?"ms-active":"",I?"ms-current":""].filter(L=>L!=="").join(" "),U=h.text===void 0?ke(e,h.icon,Zt(e,n.glass?18:v?16:14),v&&!n.glass?"white":h.color):c`<span class="ms-sw-text">${Ma(h.text)}</span>`;return c`<span class=${E} style=${A} title=${h.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${U}</span>`}),d=i[r],f=d===void 0?m:c`<span class="ms-sw-name" style=${`top:${w(8*Wr(e.screen).h/a*1e4)/100}%`}>${d.name}</span>`,b=i.length===0?void 0:Vr(e.screen,r,i.length);return Qt(e,"Page switcher on the watch",n,c`${u}${f}`,{beamTo:b,classes:"ms-switcher"})}function Ra(e){if(T(e)==="switcher")return Ta(e);let n=W(e);return n===void 0?Qt(e,"Entity quick menu on the watch",Ze(e.document),c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):Sa(e,n,ie(e,n),Mr(e,n))}var Pa={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function Ca(e,n,t,i){let s=R(t),r=i!==void 0&&P(s,R(i)),o=t.isVisible===!1,a=ne(e,t),l=`${j(M(t))}${o?", hidden":""}`;return c`<button type="button" class=${`ms-label${r?" on":""}${o?" off":""}`} data-slot=${s}
    style=${`--k:${V(t).color}`} aria-pressed=${r?"true":"false"}
    @click=${()=>fe(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${l}</small></span></button>`}function La(e,n,t,i){let s=F(t.position),r=t.own.map(o=>Ca(e,n,o,i));return t.shared!==void 0&&r.push(c`<span class="ms-label ms-inh" style=${`--k:${V(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${ne(e,t.shared)}</b><small>From the All menu</small></span></span>`),r.length===0&&t.free&&r.push(c`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>Ge(e,n,t.position)}>${C("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),c`<div class=${`ms-place ms-at-${t.position} ms-${Pa[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${r}</div>`}function Ur(e){let n=Ra(e),t=T(e)==="switcher"?void 0:W(e);if(t===void 0)return c`<div class="me-stage-body">${n}</div>`;let i=ie(e,t);return c`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${Dr(e.document,t).map(s=>La(e,t,s,i))}
  </div></div>`}var Aa=c`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function Kr(e){let n=T(e),t=Ze(e.document),i=m;if(n!=="switcher"){let r=W(e),o=r===void 0?[]:dt(e.document,r),a=r===void 0?"Add an entity first, in the menu's settings.":o.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=c`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||r===void 0||o.length===0}
      title=${a} @click=${()=>{r!==void 0&&Ge(e,r)}}>${C("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?m:c`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>ba(e)}>${Aa}<span class="word">Play opening</span></button>`;return i===m&&s===m?c``:c`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function Br(e){if(T(e)!=="entity")return m;let n=W(e);return n===void 0||ie(e,n)===void 0?m:c`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Se(e)}>Change the type or entity</button></span>`}var Ea={anywhere:{gesture:"hold",get open(){return cn("Touch and hold a tile, slide to the middle and turn the Digital Crown. Or hold an empty spot. Then slide to a slot and lift your finger.","Touch and hold a tile, slide to the middle and turn the crown. Or hold an empty spot. Then slide to a slot and lift your finger.")},use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to the middle, then to a slot, and lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"hold",open:"Open the Anywhere menu and slide to its Pages slot. Then slide to a page and lift your finger.",use:"Jumping straight to any page. It needs a Pages slot in the Anywhere menu. Pick a page in the Pages card to set how it shows here."}};function jr(e){let n=Ea[T(e)];return ks({art:n.gesture,label:"How it opens",how:n.open,use:n.use})}var qr=B`
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
    margin: 2px 0 0; padding: 3px 10px; border: 1px solid var(--wa-line-strong); border-radius: 8px;
    background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ms-change:hover { background: var(--wa-hover); }
  button.ms-change:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`;function en(e){if(e.length===0)return"";let n=e.map(i=>ri(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Fr(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:"Nothing left to save. The same changes were already saved somewhere else."};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${en(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Sn()}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}Xi({dirty:Nt,drop:$s});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Nt()&&(e.preventDefault(),e.returnValue="")});var Gr=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),tn=Gr?"\u2318":"Ctrl+",nn={min:200,max:720,middleMin:320},sn={left:280,right:320},rn="wrist-assistant-panel.menus.columns.v1",Ia="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",Oa=24,zr=820,Ha=600;function Na(e){return e==="entity"?"entity":"anywhere"}function Va(e){return et(e).message}function Da(e){return et(e).code}function _a(e){return e instanceof HTMLElement?bi(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Wa(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function Ua(e){return re(e)?tt(e).filter(n=>!it(n)&&An(Pe(n))).map(n=>({id:Pe(n),name:nt(n)})):[]}var Jr=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Xe(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var Ka="#8E8E93";function Yr(e){if(!re(e))return[];let n=0;return tt(e).filter(t=>!Pn(t)&&!it(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=nt(t),r=Xe(t.switcherIcon)??Xe(Rn(t)[0]?.icon)??(Cn(t)?"bolt.fill":"square.grid.2x2.fill"),o=i?Ka:Jr[n++%Jr.length],a=Xe(t.switcherColor)??o,l=t.switcherDisplayMode==="icon"?void 0:Xe(t.switcherText)??s;return{id:Pe(t),name:s,icon:r,color:a,...l===void 0?{}:{text:l},hidden:i}})}function xl(e){return Yr(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var y=class extends an{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=m;this.phones=!1;this.libraryItem=void 0;this.previewSettled=!1;this.menuDeleteAsk=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.topMenuOpen=!1;this.lib=new li(this,()=>this.hass,()=>this.linkDevices.map(t=>t.ownerId));this.zoom=dr();this.stageFit=new us(this,".me-stage-body",()=>this.stageScale);this.columns={...sn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new fi(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.subscribeSeq=0;this.previewKind="watch";this.onReconnect=()=>{let t=this.recordKey;this.isConnected&&t!==void 0&&this.load(t,!0);let i=this.watchId;!this.isConnected||i===void 0||(this.loadCatalog(i),this.loadHttpLibrary(),this.loadStatusPages(i),this.loadPages(i),this.loadBehavior(i),this.loadVoice(i),this.lib.store?.refresh())};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!Wa()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(s&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .tb-more")?.focus());return}if(!_a(i[0])){if(s&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let o=this.viewHost();o!==void 0&&Se(o)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(Ia)))return;let o=this.viewHost();o!==void 0&&Se(o)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen)return;t.composedPath().some(s=>s instanceof HTMLElement&&s.classList.contains("pe-top-menu"))||(this.topMenuOpen=!1)};this.addEventListener(ki,this.onScrubStart),this.addEventListener(Si,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce()})}get watches(){return $n(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return this.previewKind}get draft(){let t=this.recordKey,i=this.record;if(t===void 0||i===void 0||i.revision<=0)return;let s=ve(t);if(s!==void 0)return s;let r=ot(i.document);return r===void 0?void 0:Ht(t,r,i.revision).draft}get recordKey(){return this.libraryItem===void 0?void 0:At(this.libraryItem)}get libraryUnit(){let t=this.libraryItem,i=this.lib.library;return t===void 0||i===void 0?void 0:Le(i,t.id)?.unit}get pagesDocument(){let t=this.pagesRecord;return t!==void 0&&t.revision>0?t.document:void 0}get pages(){return Ua(this.pagesDocument)}get saving(){let t=this.recordKey;return t===void 0?!1:ve(t)?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=mi(rn,sn,nn),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0&&(this.openPreview(this.watchId),this.openItem(!0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.flushRename()}willUpdate(t){this.hass&&(t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ln(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0&&this.followLibraryItem(this.libraryItem)),this.followSave()}updated(){this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.recordKey;if(t===void 0)return;let i=ve(t)?.saveDone;if(i===void 0||i===this.followedSave)return;this.followedSave=i;let s=()=>this.saveEnded(t);i.then(s,s)}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.recordKey?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}followLibraryItem(t){let i=Ot(this.lib.library,t);(!Et(t,this.openedItem)||!this.previewSettled)&&(this.previewKind=fs(this.watches,t,i),this.previewSettled=i!==void 0);let s=It(this.watches,this.previewKind,[t.from,...i??[]]);(s!==this.watchId||s===void 0&&this.openedItem===void 0)&&this.openPreview(s),Et(t,this.openedItem)||(this.openedItem=t,this.openItem());let r=At(t),o=this.libraryUnit;o!==void 0&&this.shownUnitFor!==r&&(this.shownUnitFor=r,yr({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},o));let a=hs(this.lib.library,t),l=this.record?.revision;a!==void 0&&l!==void 0&&a>l&&a!==this.followedRevision&&(this.followedRevision=a,this.load(r,!0))}pickPreview(t){this.previewKind=t,this.openPreview(It(this.watches,t,[this.libraryItem?.from,...Ot(this.lib.library,this.libraryItem)??[]]))}openPreview(t){this.watchId=t,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,t===void 0?this.endSubscription():this.startSubscription(t),this.loadContext(t)}openItem(t=!1){let i=this.recordKey;i!==void 0&&(t||(this.reloadPending=!1,this.note=void 0,this.flushRename(),this.libNote=void 0,this.menuDeleteAsk=!1,this.endScrub(),this.uiState.clear(),this.shownUnitFor=void 0,this.followedRevision=void 0),this.load(i,t))}loadContext(t){this.loadHttpLibrary(),t!==void 0&&(this.loadCatalog(t),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let r=await se(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=rs(r)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Pt(t),defaults:os(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let r=await se(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=Di(r)}catch(r){if(s!==this.catalogSeq||t!==this.watchId)return;kt(r)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await un(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=yi(s)}catch(s){if(i!==this.httpLibrarySeq)return;vi(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let r=await se(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=_i(r)}catch(r){if(s!==this.statusPagesSeq||t!==this.watchId)return;kt(r)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let r=await se(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:r.revision,document:r.document}}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let r=await se(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=r.revision>0&&re(r.document)?r.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass,r=this.libraryItem;if(!s||r===void 0)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let a=await ps(s,r);if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.show(t,a),this.loadError=void 0}catch(a){if(o!==this.loadSeq)return;i||(this.loadError=Ln(a))}this.loading=!1}flushPending(){let t=this.recordKey;!this.reloadPending||this.holdReload||t===void 0||(this.reloadPending=!1,this.load(t,!0))}show(t,i){this.record=i;let s=i.revision>0?ot(i.document):void 0;if(s===void 0)return;let r=Ht(t,s,i.revision);r.replaced.length>0?this.note={kind:"warn",text:en(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;dn(i,t,r=>{s===this.subscribeSeq&&(r.kind==="catalog"?Ki(r,this.catalog)&&this.loadCatalog(t):r.kind==="status_pages"?this.loadStatusPages(t):r.kind==="pages"?this.loadPages(t):r.kind==="behavior"?this.loadBehavior(t):r.kind==="voice"&&this.loadVoice(t))}).then(r=>{s===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let r=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??gi,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=wi(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:xi(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Pt(this.voiceDocument)}}screen(){let t=this.phoneLayout();if(t!==void 0)return Ii(t);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(vt(i?.screen_size)??yt).screen}phoneLayout(){if(this.device!=="iphone")return;let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return Ei(Li(t?.screen_size,t?.platform))}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,r=Yr(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*$t,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:r.filter(o=>!o.hidden).map(({hidden:o,...a})=>a),switcherRows:r,menuFoot:o=>o==="switcher"?m:this.libraryHead(o),menuBadge:o=>this.menuBadge(o),...this.libraryUnit===void 0?{}:{sections:rr(this.libraryUnit)},get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(o,a)=>this.draft===t&&this.edit(o,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||(this.draft?.discard()??!1)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.recordKey;this.endScrub();let s=this.draft;if(!t||i===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let r=await this.saveMenus(t,i,s);i===this.recordKey&&(this.note=r)}async saveMenus(t,i,s){let r=this.libraryItem;if(r===void 0)return;let o=vs(s,{prepare:si,...ms(t,this.lib.store,r)});this.followedSave=s.saveDone,this.requestUpdate();let a=await o.catch(l=>({ok:!1,revision:s.revision,merged:!1,code:Da(l)??"unknown",message:Va(l)}));return this.saveEnded(i),Fr(a)}get linkDevices(){return Tn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}libraryMenuOf(t){let i=this.lib.library,s=this.libraryItem;if(s===void 0||i===void 0)return;let r=Le(i,s.id);return r?.unit===Na(t)?r:void 0}menuBadge(t){if(t==="switcher")return;let i=this.libraryMenuOf(t);return i===void 0||i.name===rt[i.unit]?void 0:i.name}typeMenuName(t,i){this.naming={menuId:t,value:i},this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=setTimeout(()=>this.flushRename(),Ha)}flushRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0;let t=this.naming;if(t===void 0||t.sent===!0)return;let i=this.lib.store,s=this.lib.library,r=t.value.trim(),o=s===void 0?void 0:s.index.menus.get(t.menuId.toUpperCase());if(i===void 0||r===""||o===void 0||o.name===r){this.naming=void 0;return}let a={menuId:t.menuId,value:r,sent:!0};this.naming=a,i.renameMenu(t.menuId,r).then(()=>{this.naming===a&&(this.naming=void 0)})}cancelRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0,this.naming=void 0}menuTickLocked(t){if(ve(t)?.dirty??!1)return ts(this.linkDevices.find(i=>Ce(i.ownerId,t))?.name??"that device")}libraryHead(t){let i=this.libraryMenuOf(t),s=this.lib.store;if(i===void 0||s===void 0||this.recordKey===void 0)return m;let r=rt[i.unit],o=this.naming!==void 0&&Ce(this.naming.menuId,i.id)?this.naming:void 0,a=s.noteFor("menus",i.id);return c`<div class="me-lib" role="group" aria-label=${r} @click=${l=>l.stopPropagation()}>
      <label class="me-lib-name"><span class="me-lib-h">Name</span>
        <input type="text" class="me-lib-input" aria-label=${`${r} name`} placeholder=${r} maxlength="80"
          .value=${Re(o?.value??i.name)}
          @input=${l=>this.typeMenuName(i.id,l.target.value)}
          @keydown=${l=>{l.key==="Enter"?(l.preventDefault(),this.flushRename()):l.key==="Escape"&&(l.preventDefault(),l.stopPropagation(),this.cancelRename())}}
          @blur=${()=>this.flushRename()} />
      </label>
      ${this.renderLibraryDelete(i)}
      ${a===void 0?m:c`<p class="me-lib-note err" role="alert">${a}</p>`}
      ${this.libNote===void 0?m:c`<p class="me-lib-note ${this.libNote.kind}" role="status">${this.libNote.text}</p>`}
    </div>`}menuTicks(t,i=!1){let s=this.lib.store,r=this.hass?.user?.is_admin;return Qi({library:this.lib.library,kind:"menus",itemId:t.id,...this.libraryItem?.from===void 0?{}:{viewing:this.libraryItem.from},devices:this.linkDevices,colorOf:o=>this.colorOf(o),pending:s.pending,...r===void 0?{}:{admin:r},...i?{hint:!1}:{},locked:o=>this.menuTickLocked(o),under:di(this.hass,this.owners.length>0?this.owners:this.ownList??[],this.lib.library,"menus")},o=>{if(!ui(this.owners.length>0?this.owners:this.ownList??[],this.lib.library,o,"menus"))return;let a=this.linkDevices.find(l=>Ce(l.ownerId,o))?.name??"The device";s.pickMenu(o,t.unit,t.id,{device:a})})}renderStageDevices(){let t=this.libraryItem,i=this.lib.library,s=t===void 0||i===void 0?void 0:Le(i,t.id);return s===void 0||this.lib.store===void 0||this.draft===void 0?m:ws("menus",s.owners.length,this.menuTicks(s,!0),this.lib.store?.savedStamp("menus",s.id))}renderLibraryDelete(t){return t.owners.length>0?c`<p class="me-lib-hint">A save changes it on every device that uses it. To delete it, pick another menu for each of them first.</p>`:this.menuDeleteAsk?c`<div class="me-lib-copy me-lib-del-ask" role="alertdialog" aria-label=${`Delete ${t.name}?`}>
      <span class="me-lib-hint"><b>Delete ${t.name}?</b> It is on no device yet. ${ci}</span>
      <button type="button" class="pe-btn pe-danger" @click=${()=>this.deleteLibraryMenu(t)}>Really delete</button>
      <button type="button" class="pe-btn" @click=${()=>{this.menuDeleteAsk=!1}}>Cancel</button>
    </div>`:c`<button type="button" class="pe-btn pe-danger me-lib-del" ?disabled=${this.saving}
        title=${`Delete ${t.name}. It is on no device yet.`} @click=${()=>{this.menuDeleteAsk=!0}}>Delete</button>`}deleteLibraryMenu(t){let i=this.lib.store,s=this.recordKey;i===void 0||s===void 0||this.libraryItem===void 0||(this.menuDeleteAsk=!1,i.deleteItemLater("menus",t.id,`Deleted ${t.name}.`,async()=>{xs(s)}),this.onBack?.())}render(){return c`
      <div class="pe-top">
        ${this.renderTopBar(this.draft)}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(this.watches)}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=zr}renderTopBar(t){let i=t!==void 0,s=i&&this.dirty;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Menu in the library">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${C("menu")}</button>`:m}
      <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${()=>this.onBack?.()}>${C("left")}<span>Menus</span></button>
      ${bs()}
      <span class="spacer"></span>
      ${this.renderTopMenu(i?t:void 0)}
      ${i?c`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${tn}S). A save reaches every device that uses this menu.`:`Nothing to save (${tn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:m}
      ${this.barActions}
    </div>`}renderTopMenu(t){if(t===void 0)return m;let i=this.topMenuOpen,s=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${s(()=>this.discard())}>Discard edits</button>
      </div>`:m}
    </span>`}colorOf(t){return Pi(Ri(this.owners.length>0?this.owners:this.ownList??[]),t)}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=zr?this.columns:pi(this.hostWidth-Oa,this.columns,nn)}renderGutter(t){return c`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();hi(i,{side:t,base:t==="left"?s.left:s.right,limits:nn,onWidth:r=>{this.columns={...this.columns,[t]:r}},onEnd:()=>wt(rn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:sn[t]},wt(rn,this.columns)}}></div>`}get stageScale(){return this.zoom??this.stageFit.fit(Mt(this.narrow||this.stacked))}setZoom(t){this.zoom=t,ur(t)}renderStage(t,i){let s=i.find(f=>f.owner_watch_id===this.watchId),r=vt(s?.screen_size),o=r??yt,a=t.phone===void 0?o.label:t.phone.model.label,l=[...Lr(t),a],u=this.draft,d=zt(T(t));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${d}>${d}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${kn(s,i)}</span></span>`:m}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${t.phone!==void 0?Oi(t.phone.model):r===void 0?`${o.label}, this watch's size is not known`:l.join(" \xB7 ")}><span class="fam">${l.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${tn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${C("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${Gr?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${C("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices()}
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(t)}
        ${jr(t)}
        ${Ur(t)}
        <div class="under"><span class="tail">${Ar(t)}</span>${Br(t)}</div>
      </div>
    </div>`}renderStageTools(t){let i=t.phone!==void 0,s=this.stageScale,r=this.stageFit.fit(Mt(this.narrow||this.stacked)),o=a=>Zi(i?a*$t:a);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${Kr(t)}
      ${gs(this.previewKind,a=>this.pickPreview(a))}<span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=Rt(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(Rt(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${o(s)}. Back to fit`}
          title=${`The ${i?Ai(t.phone.model)?"phone":"iPhone":"watch"} at ${o(s)} of its own points. Click to fit it again (${o(r)}).`}
          @click=${()=>this.setZoom(void 0)}>${o(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=Tt(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(Tt(s))}>+</button>
      </span>
    </div>`}renderBody(t){if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError===void 0&&this.libraryUnit===void 0){let l=this.lib.readState==="failed"?this.lib.store?.readError:void 0;return c`<div class="pe-empty">${l??"Loading\u2026"}</div>`}if(this.loadError!==void 0){let l=this.recordKey;return c`<div class="pe-empty">
        <span>Could not read this menu: ${this.loadError}</span>
        ${l===void 0?m:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}if(this.record===void 0)return c`<div class="pe-empty">Loading…</div>`;if(this.draft===void 0)return c`<div class="pe-empty"><b>${ai}</b></div>`;let r=this.viewHost();if(r===void 0)return c`<div class="pe-empty">Loading…</div>`;let o=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return c`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${a}`}>
      <div class="column left">
        ${Pr(r)}
        ${Cr(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Ir(r)}
      </div>
    </div>`}static{this.styles=[Mn,pn,mn,hn,fn,gn,bn,wn,Ci,Ni,B`
    /* A column; --cf-pad is the padding the sticky top block reaches
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
       top edge and edge to edge, on the host's own background so the editor
       scrolls under it. Above the cards and their menus. Its measured
       height is --pe-top-h on the host (measureTop), which the sticky side
       columns stand under. */
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

    /* The bar's buttons with a glyph and words (the way back) on one line,
       as the panel's own bar draws them. */
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    /* Stacked, the way back stays first on the first line, not under it. */
    .wa-bar.stacked > button.tb-btn.tb-back { order: 0; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
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
       as the page editor lays them: one screen tall, the editor never
       scrolls as a whole, and each list, the stage and the inspector scroll
       in their own box, so every card stays on screen. The side widths come
       in as custom properties already fitted to the measured host width
       (fitColumnWidths). */
    .layout.pe-layout { padding: 0; align-items: stretch; }
    .layout.pe-layout.cols-3 { flex: 1 1 0; min-height: 0; overflow: hidden; }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout.cols-3 > .column.left { overflow: hidden; }
    .pe-layout.cols-3 > .column.left > .card { display: flex; flex-direction: column; min-height: 120px; }
    .pe-layout.cols-3 > .column.left > .card:first-child { flex: 0 1 auto; max-height: 50%; }
    .pe-layout.cols-3 > .column.left > .card:last-child { flex: 1 1 0; }
    .pe-layout.cols-3 > .column.left > .card > :not(.layers) { flex: none; }
    .pe-layout.cols-3 > .column.left > .card > .layers { flex: 0 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
    .pe-layout.cols-3 > .column.inspector { overflow-y: auto; overscroll-behavior: contain; }
    .pe-layout.cols-3 > .column.canvas { overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.cols-3 > .column.canvas > .card { flex: none; }
    .layout.pe-layout.cols-1 { flex: none; min-height: auto; overflow: visible; }
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
    /* The preview device's name in the head: a fact. */
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .me-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .me-stage-area { padding-top: 92px; }
    }
    /* The picture keeps its size and the stage scrolls sideways under it on
       a screen narrower than the watch drawn at this scale. */
    /* "safe": a watch wider than the stage starts at its left edge, so all
       of it can be scrolled to, instead of hanging off both sides. */
    .me-stage-body { display: flex; justify-content: safe center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .me-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    /* The watch's size is a fact, not a menu. */

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }

    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: 999px;
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

    :host([narrow]) { --cf-pad: 12px; }

    /* The foot of the menu's row in the Menus card: the menu's name and
       Delete (libraryHead). */
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
  `,Hr,qr,er,Ss,es,ys]}};x([O({attribute:!1})],y.prototype,"hass",2),x([O({attribute:!1})],y.prototype,"owners",2),x([O({type:Boolean,reflect:!0})],y.prototype,"narrow",2),x([O({attribute:!1})],y.prototype,"icons",2),x([O({attribute:!1})],y.prototype,"iconsTick",2),x([O({attribute:!1})],y.prototype,"haMenu",2),x([O({attribute:!1})],y.prototype,"onHaMenu",2),x([O({attribute:!1})],y.prototype,"onBack",2),x([O({attribute:!1})],y.prototype,"barActions",2),x([O({attribute:!1})],y.prototype,"phones",2),x([O({attribute:!1})],y.prototype,"libraryItem",2),x([S()],y.prototype,"watchId",2),x([S()],y.prototype,"menuDeleteAsk",2),x([S()],y.prototype,"record",2),x([S()],y.prototype,"catalog",2),x([S()],y.prototype,"statusPages",2),x([S()],y.prototype,"httpLibrary",2),x([S()],y.prototype,"pagesRecord",2),x([S()],y.prototype,"behavior",2),x([S()],y.prototype,"voiceDocument",2),x([S()],y.prototype,"loading",2),x([S()],y.prototype,"loadError",2),x([S()],y.prototype,"note",2),x([S()],y.prototype,"ownList",2),x([S()],y.prototype,"topMenuOpen",2),x([S()],y.prototype,"naming",2),x([S()],y.prototype,"libNote",2),x([S()],y.prototype,"zoom",2),x([S()],y.prototype,"columns",2),x([S()],y.prototype,"hostWidth",2),x([S()],y.prototype,"hostHeight",2),x([S()],y.prototype,"previewKind",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",y);export{wr as a,Eo as b,Hr as c,Ra as d,qr as e,rn as f,Ha as g,Na as h,Ua as i,Jr as j,Ka as k,Yr as l,xl as m,y as n};
