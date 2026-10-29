import{a as De,g as _e,h as Ct}from"./chunk-JRUIZ3DV.js";import{d as fs,e as ve,f as Ot,g as gs,h as Ht,i as bs}from"./chunk-A2LIJU45.js";import{b as ws,c as ys}from"./chunk-FCXTLDYS.js";import{M as Zi,N as Xi,O as Qi,na as es,oa as ts,pa as Rt,qa as ns,ra as Pt,sa as is,ta as ss,ua as rs}from"./chunk-CAWDNFK7.js";import{Wb as ei,Xb as ti,Yb as ni,cc as ii,fc as si,hc as ut,ic as ri}from"./chunk-WAY3UCKD.js";import{pc as oi,qc as ai,rc as ci,tc as pt}from"./chunk-KO2ZB7ZP.js";import{a as os}from"./chunk-GHRRILKG.js";import{a as Yi}from"./chunk-Z4DPBZWT.js";import{A as ft,a as li,b as di,c as ui,d as pi,v as mi,x as mt,y as hi,z as ht}from"./chunk-V2VRWX32.js";import{B as ps,D as ms,F as hs,k as Lt,l as Et,m as as,n as cs,o as ls,u as At,v as It,w as ds,x as us}from"./chunk-HCHOK3FW.js";import{a as Fn,m as zi,o as Ji,r as Gi}from"./chunk-RJY5WDHZ.js";import{$ as Tt,A as R,B as Ie,C as Oe,D as z,E as He,F as Mi,G as Ti,H as vt,I as Ri,J as Pi,K as Ci,L as Li,M as Ei,N as Ai,O as xt,P as $t,Q as Ii,R as Oi,S as Hi,T as Ni,U as kt,V as St,W as Vi,X as Mt,Y as Di,Z as Ne,_ as _i,a as be,aa as Wi,ba as Ui,ca as te,d as gt,da as J,ea as Ve,f as bt,fa as ae,g as gi,ga as Ki,h as oe,ha as Bi,i as ee,ia as ji,j as bi,k as M,ka as qi,l as we,la as Fi,n as wi,o as Ee,p as yi,q as wt,r as yt,s as vi,t as xi,u as ye,v as $i,w as Ae,x as ki,y as Si,z as F}from"./chunk-5EDQIKP7.js";import{la as it,ma as st,n as Sn,qa as Pe}from"./chunk-5H6OWAXC.js";import{a as Mn}from"./chunk-J2WKPEGJ.js";import{b as Cn,c as rt,d as Ln,e as ot,f as En}from"./chunk-ZOJGMATP.js";import{a as jn,b as qn}from"./chunk-IY3QJX33.js";import{a as Jn,n as Gn,p as Yn,q as Zn,r as dt,w as Xn,x as Qn}from"./chunk-JQOWE2OL.js";import{e as zn}from"./chunk-ISWPREDT.js";import{c as In,d as On,f as Hn}from"./chunk-PXGVB47T.js";import{Ab as q,Bb as ge,Bc as fi,D as at,Db as K,Eb as Le,I as ct,Lb as lt,Nb as Bn,Pd as vs,f as An,lb as Nn,mb as Vn,nb as Dn,tb as _n,ub as Wn,vb as Un,xb as Kn,yb as j}from"./chunk-QHL5HVYF.js";import{q as Ce}from"./chunk-JTGB6FQQ.js";import{U as nt,i as re,k as Qe,l as Tn,m as Re,n as et,o as Rn,p as tt,q as Pn}from"./chunk-CPEKF3CW.js";import{Ah as mn,Bh as hn,Ch as fn,Dh as gn,Eh as bn,Gg as se,Nh as kn,Og as cn,Qg as ln,b as B,d as c,e as k,g as m,ig as an,j as on,k as O,l as S,rh as N,sh as C,wh as dn,yh as un,zh as pn}from"./chunk-7M7K7CM3.js";import{U as wn,V as yn,Z as vn,aa as xn,cb as $n,db as Xe}from"./chunk-OM34V22N.js";import{a as x}from"./chunk-LO2NM3CE.js";var G=De.routing;function Nt(e){return G.actions.find(n=>n.action===e)}function Y(e){return Nt(e)?.keys??[]}function D(e){return Object.hasOwn(G.keys,e)?G.keys[e]:void 0}function le(e){return re(e.voiceConfig)?e.voiceConfig:{}}function Gr(e,n){let t=G.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function Z(e,n){let t=D(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=G.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?Gr(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,r]=t.clamp??[-1/0,1/0];return Math.min(r,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function $s(e,n){let t=D(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=Z(e,i[1]),r=i[3].split(/\s+or\s+/).map(a=>a.trim()),o=typeof s=="string"&&r.includes(s);return i[2]===void 0?o:!o}function We(e,n){let t=D(n);if(t?.type!=="enum")return[];let i=G.labels[t.enum??""]??{},s=G.offered[n]??G.enums[t.enum??""]??[],r=Z(e,n);return(typeof r=="string"&&!s.includes(r)?[r,...s]:s).map(a=>[a,i[a]??a])}function ks(e){return D(e)?.label??Yr[e]??e}var Yr={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Vt(e,n,t){let i=D(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!We(e,n).some(([o])=>o===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[o,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(o,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let o=(t??"").trim();if(o==="")return Ct(e,n);s=o;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let o=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(o.length===0)return Ct(e,n);s=o;break}}return(Object.hasOwn(e,n)?nt(e[n],s):nt(Z(e,n),s))?e:_e(e,n,s)}function Ss(e,n,t,i){let s=Z(e,n),r=Array.isArray(s)?s:[];return i===r.includes(t)?e:Vt(e,n,i?[...r,t]:r.filter(o=>o!==t))}function Zr(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function Xr(e,n){let t=D(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",r=Z(e,s);return typeof r=="string"&&i.includes(r)}function Dt(e,n,t,i){let s=D(n);if(s===void 0)return"None";if(!Xr(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let r=Zr(s,t);return typeof r=="string"&&r.trim()!==""?`Default (${i(r.trim())})`:Array.isArray(r)&&r.length>0?`Default (${r.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function xs(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function ce(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function Ue(e,n,t){let i=xs(n),s=xs(t);return e.filter(r=>!ce(i,r)&&(s.length===0||ce(s,r)))}function Qr(e,n){return{hiddenPhraseIds:e.filter(t=>!ce(n,t)),knownPhraseIds:e.slice()}}function Ms(e,n,t,i){if(!ce(n,t))return e;let s=Ue(n,e.hiddenPhraseIds,e.knownPhraseIds);if(ce(s,t)===i)return e;let r=i?n.filter(a=>ce(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),o=Qr(n,r);return _e(_e(e,"hiddenPhraseIds",o.hiddenPhraseIds),"knownPhraseIds",o.knownPhraseIds)}function Ts(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function eo(e,n,t,i,s){return Ie(e,n,t,r=>{if(!Y(M(r)).includes(i))return r;let o=le(r),a=Vt(o,i,s);return a===o?r:bt(r,"voiceConfig",a)})}function to(e,n,t,i,s,r){return Ie(e,n,t,o=>{if(!Y(M(o)).includes(i))return o;let a=le(o),l=Ss(a,i,s,r);return l===a?o:bt(o,"voiceConfig",l)})}function no(e,n,t,i,s,r){return Ie(e,n,t,o=>M(o)==="ttsMenu"?Ms(o,i,s,r):o)}function Rs(e){return Object.keys(le(e)).some(n=>Y(M(e)).includes(n))}function Ps(e){let n=M(e);return Y(n).length>0||n==="ttsMenu"}function Cs(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function io(e,n,t,i){let s=ci(e.hass.states),r=pt(s,t),o=a=>K(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),l=>i(a.entityId,l));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${r.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:r.map(o)}
    </div>`}function so(e,n,t,i){let s=D(t),r=Ts(e.voice?.defaults),o=s?.domain==="conversation"?oi(e.hass.states):ai(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=pt(o,i===""?[]:[i]);return[["",Dt(n,t,r,u=>a.find(d=>d.entityId===u&&!d.missing)?.name??Cs(e.hass,u))],...a.map(u=>[u.entityId,u.missing?`${u.entityId} (not found)`:u.name])]}function ro(e,n,t,i,s){let r=D(s);if(r===void 0||!$s(i,s))return m;let o=ks(s),a=Z(i,s),l=(u,d)=>e.edit(f=>eo(f,n,t,s,u),d);switch(r.type){case"enum":return j(o,String(a),We(i,s),u=>l(u),{snapBack:!0,def:String(r.default)});case"bool":return K(o,a===!0,u=>l(u),r.default);case"int":{let u=typeof a=="number"?a:Number(r.default),d=De.volume,[f,b]=r.clamp??[d.min,d.max];return c`${ge(o,u,h=>l(h,`slot:${t}:${s}`),{min:f,max:b,step:d.step,def:Number(r.default),format:h=>`${Math.round(h)}${d.unit}`})}
        <div class="ts-after">${d.presets.map(h=>c`<button type="button" class="pe-chip ${h.value===u?"on":""}"
          aria-pressed=${h.value===u?"true":"false"} @click=${()=>l(h.value)}>${h.label} ${h.value}%</button>`)}</div>`}case"entity":{let u=typeof a=="string"?a:"";return j(o,u,so(e,i,s,u),d=>l(d===""?void 0:d),{snapBack:!0})}case"array":{let u=Array.isArray(a)?a:[],d=Ts(e.voice?.defaults),f=r.whenBlank!==void 0?`None picked: ${r.whenBlank}.`:r.fallsBackTo!==void 0?`None picked: ${Dt(i,s,d,b=>Cs(e.hass,b))}.`:"None picked.";return c`${io(e,o,u,(b,h)=>e.edit(g=>to(g,n,t,s,b,h)))}
        <div class="hint ${u.length===0&&r.fallsBackTo===void 0&&r.whenBlank===void 0?"warn":""}">${u.length===0?f:`${u.length} picked.`}</div>`}}}function oo(e,n,t){let i=typeof t.id=="string"?t.id:"",s=le(t),r=Y(M(t));return c`${e.voice?.defaults===void 0?c`<div class="hint">${ns}.</div>`:m}
    ${r.map(o=>ro(e,n,i,s,o))}`}function ao(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let r=s.map(d=>d.id),o=Ue(r,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(d=>typeof d=="string"):[],l=a.length>0&&r.some(d=>!a.some(f=>f.toUpperCase()===d.toUpperCase())),u=d=>o.some(f=>f.toUpperCase()===d.toUpperCase());return c`<div class="me-sub-h">${Nt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(d=>K(d.name,u(d.id),f=>e.edit(b=>no(b,n,i,r,d.id,f))))}
    </div>
    <div class="hint">${o.length===0?"No phrase shows: the list on the watch is empty.":`${o.length} of ${s.length} show on the watch.`}</div>
    ${l?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:m}`}function Ls(e,n,t){let i=M(t);if(i==="ttsMenu")return ao(e,n,t);if(Y(i).length>0)return oo(e,n,t)}function Es(e,n){let t=M(n);if(t==="ttsMenu"){let o=e.voice?.phrases;return o===void 0?"":`${Ue(o.map(l=>l.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${o.length} phrases`}let i=le(n),s=Y(t)[0];if(s===void 0)return"";let r=Z(i,s);return We(i,s).find(([o])=>o===r)?.[1]??""}function Hs(e,n,t,i,s,r,o=""){return c`<div class="mi-look">
    <div class="mi-look-title">${_n(e,n,t,l=>r(l),l=>i.find(([u])=>u===l)?.[1]??l)}</div>
    <div class="mi-pics ${o}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([l,u])=>{let d=l===n;return c`<button type="button" class="mi-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${e}: ${u}`}
          @click=${()=>{l!==n&&r(l)}}>${s(l)}<span class="mi-pic-name">${u}</span></button>`})}
    </div>
  </div>`}function je(e,n,t,i,s){return c`<div class="mi-switch">${K(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function co(e){return c`<div class="mi-wrap">${e}</div>`}function qe(e,n){return te(e).find(t=>t.key===n)}function _t(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function Fe(e,n,t){return te(n).some(i=>t.includes(i.key)&&Ve(e,n,i)&&!_t(J(e,n,i),i.default))}function Ke(e,n,t){let i=qe(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:J(e.document,n,i),set:(r,o=!1)=>e.edit(a=>Ki(a,n,t,r),o?s:void 0)}}function Wt(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function ze(e,n){return n===void 0?m:ge(e,Wt(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function As(e,n,t,i){if(n===void 0)return m;let s=n.value===!0?"on":"off",r=n.field.default===!0?"on":"off";return Hs(e,s,r,[["off",t[0]],["on",t[1]]],o=>i(o==="on"),o=>n.set(o==="on"))}var Ns=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],Vs=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],Is=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function lo(e){return c`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function uo(e){return c`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function po(e){if(e===void 0)return m;let n=Wt(e),t=(e.field.presets??Is.map(([s,r])=>({value:s,label:r}))).map(s=>[String(s.value),Is.find(([r])=>_t(r,s.value))?.[1]??s.label]),i=t.find(([s])=>_t(Number(s),n))?.[0]??"";return c`${q("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${ze("Exact",e)}`}function Ds(e){let n=i=>Ke(e,"quickAction",i),t=n("showContextLabel");return c`
    ${As("Behind the ring",n("showIconBubble"),["Solid","Glass"],lo)}
    ${po(n("backgroundDim"))}
    ${As("Buttons",n("showNeonOutline"),["Plain","Neon"],uo)}
    ${t===void 0?m:je("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${ze("Glow",n("glowIntensity"))}`}function _s(e){let n=t=>{let i=qe("quickAction",t);return i===void 0?void 0:J(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function mo(){let e=ae("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function ho(e){let n=k``;switch(e){case"sectorWedge":n=k`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=k`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=k`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=k`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=k`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function fo(e,n){if(n===void 0||!Ve(e.document,"quickAction",n.field))return m;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${Le("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?m:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let r=s.toUpperCase()===t.toUpperCase();return c`<button type="button" class="ts-swatch ${r?"on":""}" aria-pressed=${r?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function Ws(e){let n=o=>Ke(e,"quickAction",o),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),r=n("showFingerShadow");return c`
    ${t===void 0?m:co(q("Opening",String(t.value),ae("EntranceStyle"),o=>t.set(o),{def:String(t.field.default)}))}
    ${i===void 0?m:Hs("Beam from your finger to the slot",String(i.value),String(i.field.default),mo(),ho,o=>i.set(o),"beams")}
    ${fo(e,n("beamColor"))}
    ${s===void 0||!Ve(e.document,"quickAction",s.field)?m:ze("Beam strength",s)}
    ${r===void 0?m:je("Finger shadow",r.value===!0,o=>r.set(o),r.field.default===!0,"A soft dark spot where your finger rests.")}`}function Us(e){let n=s=>{let r=qe("quickAction",s);return r===void 0?"":String(J(e,"quickAction",r))},t=(s,r)=>ae(s).find(([o])=>o===r)?.[1]??r,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var Ks=["glowIntensity","selectedScale"];function de(e){return Math.round(e*1e3)/10}function Bs(e){let n=Ke(e,"pageSwitcher","glowIntensity"),t=Ke(e,"pageSwitcher","selectedScale");return c`${ze("Glow",n)}
    ${t===void 0?m:ge("Picked page size",de(Wt(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:de(t.field.min??1),max:de(t.field.max??1.5),step:de(t.field.step??.05),def:de(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function js(e){let n=qe("pageSwitcher","selectedScale"),t=n===void 0?void 0:J(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(de(t))}%`:""}function Be(e,n,t,i){return e.render(n,t,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var qs=["light","switch","lock","cover","climate","media_player"],go={media_player:"Media player"};function Fs(e,n,t,i,s){let r=t.some(a=>a.domain===n),o=r?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let l=a.domain===n,u=go[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${l?"on":""}" aria-pressed=${l?"true":"false"} data-type=${a.domain}
          @click=${()=>{l||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${Be(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${u}</span></button>`})}
    </div>
    ${j("More types",r?"":n,o,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function zs(e,n,t,i){return c`<div class="mi-acts">${t.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(r=>{let o=r.raw===n,a=!o&&r.why!==void 0;return c`<button type="button" class="mi-act ${o?"on":""}" aria-pressed=${o?"true":"false"} ?disabled=${a} data-action=${r.raw}
        title=${r.why??m} @click=${()=>{o||i(r.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${Be(e,r.icon,14,r.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${r.label}</span>
          ${r.why===void 0||o?m:c`<small class="mi-act-why">${r.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var bo=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function Os(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function Js(e,n,t,i){let s=new Map(t.map(o=>[o.position,o])),r=o=>{if(o===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(o);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let l=a.here?"here":a.holder===void 0?"free":"held",u=a.here?Be(e,n.icon,14,n.color):a.holder===void 0?C("plus"):Be(e,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${l}" data-place=${o} aria-label=${Os(a)} title=${Os(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:m}
      @click=${()=>{a.here||i(o)}}>${u}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${bo.map(o=>o.map(r))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var Gs=B`
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
`;var Qs=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]];function er(e){return e==="entity"?["entity"]:["anywhere","switcher"]}var tr="Each page's icon, color and name are set here: pick a page in the Pages card.",wo="Pick a page in the Pages card to set how it shows here.",yo={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},nr={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:tr},vo="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",xo="Click a slot or its label to edit it. Click anywhere else for the menu's look.",me=.36,Bt=44,jt=22;function ir(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function $o(e,n,t=me){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=r=>Math.round(r*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var sr="wrist-assistant-panel.menus.zoom.v1";function rr(e=rt()){try{let n=e?.getItem(sr);if(n==null||n==="")return;let t=Number(n);return mi.includes(t)?t:void 0}catch{return}}function or(e,n=rt()){try{n?.setItem(sr,e===void 0?"":String(e))}catch{}}var ar={name:{color:N.place,icon:"text"},slot:{color:N.content,icon:"content"},where:{color:N.position,icon:"place"},look:{color:N.look,icon:"look"},shows:{color:N.states,icon:"states"},menu:{color:N.content,icon:"content"},style:{color:N.look,icon:"look"},motion:{color:N.look,icon:"radial"},switcherPage:{color:N.content,icon:"watch"}},ko="#26a69a",So=N.complication,H="menu-editor";function xe(e,n,t){return`${e} ${e===1?n:t}`}function ue(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function cr(e,n){return{entityId:n,displayName:n===""?"":ue(e,n),domain:Ee(n)}}function ke(e,n,t,i){return e.icons.render(n,t,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function V(e){return oe(M(e))===void 0?{icon:be.unknownActionIcon,color:be.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function lr(e){let n=M(e);if(n==="triggerEntity"){let i=we(e).entityId;return yt(Ee(typeof i=="string"?i:""))}let t=oe(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function P(e,n){return e.toUpperCase()===n.toUpperCase()}function Mo(e,n){return e.toUpperCase()===n.toUpperCase()}function To(e,n){let t=M(n),i=we(n),s=oe(t);for(let r of s?.payload??[]){let o=i[r.key];if(!(typeof o!="string"||o==="")){if(r.type==="entity")return ue(e.hass,o);if(r.target==="page")return e.targets.pages.find(a=>P(a.id,o))?.name??"A page not in the pages";if(r.target==="statusPage")return e.targets.statusPages.find(a=>P(a.id,o))?.name??"A status page";if(r.target==="httpAction")return e.targets.httpActions.find(a=>P(a.id,o))?.name??"An HTTP action";if(r.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(l=>P(l.id,o))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function ne(e,n){return To(e,n)??ee(M(n))}function pe(e){return ye(e)?.label??e}var dr="me:menu",ur="me:er:mode",pr="me:er:domain",Kt="me:er:entity",Ut="me:er:add";function T(e){let n=e.uiState.get(dr);return n==="entity"||n==="switcher"?n:"anywhere"}function mr(e,n){n!==T(e)&&e.uiState.delete($e),e.uiState.set(dr,n),e.requestUpdate()}function hr(e,n){for(let t of[...e.uiState.keys()])t.startsWith(xr)&&e.uiState.delete(t);e.uiState.delete($e),mr(e,n)}var $e="me:sw:page";function fr(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function he(e){if(T(e)!=="switcher")return;let n=e.uiState.get($e);if(typeof n=="string")return fr(e).find(t=>P(t.id,n))}function qt(e,n){n===void 0?e.uiState.delete($e):e.uiState.set($e,n),e.requestUpdate()}function gr(e){let n=he(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function Ft(e){return Qs.find(([n])=>n===e)?.[1]??e}function br(e){return e.uiState.get(ur)==="entity"?"entity":"domain"}function wr(e){let n=e.uiState.get(pr);return typeof n=="string"&&ye(n)!==void 0?n:"light"}function yr(e){let n=Tt(e.document),t=e.uiState.get(Kt);return typeof t=="string"&&n.includes(t)?t:n[0]}function W(e){switch(T(e)){case"anywhere":return Ae;case"entity":return zt(e);case"switcher":return}}function zt(e){if(br(e)==="domain")return{list:"domain",domain:wr(e)};let n=yr(e);return n===void 0?void 0:{list:"entity",entityId:n}}function vr(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${pe(n.domain)} menu`:`${ue(e.hass,n.entityId)} menu`}var xr="me:sel:";function $r(e){return`${xr}${ki(e)}`}function ie(e,n){let t=e.uiState.get($r(n));if(typeof t=="string")return F(e.document,n).find(i=>P(R(i),t))}function fe(e,n,t){e.uiState.set($r(n),t),e.requestUpdate()}function Se(e){if(he(e)!==void 0)return qt(e,void 0),!0;let n=W(e);return n===void 0||ie(e,n)===void 0?!1:(fe(e,n,void 0),!0)}function Je(e,n,t){let i;e.edit(s=>{let r=Ci(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=r.id,r.document}),i!==void 0&&fe(e,n,i)}function Ys(e){let t=(i,s)=>Math.round((s+(i-.5)/me*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${Bt} ${jt}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>k`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function Ro(e,n){return n===void 0?[]:F(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=He(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:V(t).color}]})}function Po(e,n){if(n==="switcher")return xe(e.switcherPages.length,"page","pages");let t=n==="anywhere"?Ae:zt(e);return t===void 0?"none yet":xe(F(e.document,t).length,"slot","slots")}function Co(e,n){if(n==="switcher"){let t=e.switcherPages;return Ys(t.map((i,s)=>({...$o(s,t.length),color:i.color})))}return Ys(Ro(e,n==="anywhere"?Ae:zt(e)))}var Lo="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function kr(e){let n=T(e);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Bt}px; --thumb-h: ${jt}px`}>
    <div class="lc-head">
      <span class="swatch">${C("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${vo}>on the watch</span>
    </div>
    <p class="me-intro">${Lo}</p>
    <div class="layers me-menu-list" role="list">
      ${Qs.filter(([t])=>e.sections===void 0||e.sections.includes(t)).map(([t,i])=>{let s=t===n,r=()=>{s||mr(e,t)},o=e.menuBadge?.(t);return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${nr[t]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          ${Co(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${Po(e,t)}</span>${o===void 0?m:c`<span class="badge me-named" title=${`This device uses "${o}"`}>${o}</span>`}</b><small>${yo[t]}</small>
            ${e.menuFoot?.(t)??m}</span>
        </div>`})}
    </div>
  </section>`}function Eo(e,n,t){return c`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${ke(e,n,14,t)}</span></span>`}function Zs(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${pe(n.domain)} menu, by type`:`${ue(e.hass,n.entityId)}'s own menu`}function Ao(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function Io(e,n,t){let i=t!==void 0&&P(t.id,n.id),s=Ao(n),r=()=>qt(e,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${o=>{o.target instanceof Element&&o.target.closest("button")||r()}}
    @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Eo(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:m}</span></span>
  </div>`}function Oo(e){let n=fr(e),t=he(e),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Bt}px; --thumb-h: ${jt}px`}>
    <div class="lc-head">
      <span class="swatch">${C("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${xe(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>Io(e,s,t))}</div>`}
  </section>`}function Sr(e){return T(e)==="switcher"?Oo(e):m}function Mr(e){if(T(e)==="switcher")return[xe(e.switcherPages.length,"page","pages")];let n=W(e);if(n===void 0)return[Zs(e,n)];let t=xe(F(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[Zs(e,n),t]}function Tr(e){return T(e)==="switcher"?tr:W(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":xo}function Rr(e,n){return li(e.uiState,H,n)}function Ho(e,n){di(e.uiState,H,n,!Rr(e,n)),e.requestUpdate()}function No(e){if(gr(e)!==void 0)return[{module:H,section:"switcher-page"}];let n=W(e),t=n===void 0?void 0:ie(e,n);if(t!==void 0)return[{module:H,section:"slot"},{module:H,section:"where"},...Ps(t)?[{module:H,section:"voice"}]:[],{module:H,section:"look"},...n?.list==="anywhere"?[{module:H,section:"shows"}]:[]];let i=T(e);return i==="anywhere"?[{module:H,section:"style-anywhere"},{module:H,section:"motion-anywhere"}]:[{module:H,section:i==="entity"?"menu":`style-${i}`}]}function _(e,n,t,i,s,r={}){let o=Rr(e,t),a=ar[n];return bn({color:a.color,icon:C(a.icon),title:i,open:o,onToggle:()=>Ho(e,t),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${H}:${t}`},o?s:c``)}function Pr(e){let n=T(e),t=Ft(n),i=W(e),s=i===void 0?void 0:ie(e,i),r=No(e),o=ui(e.uiState,r),a=he(e),l=gr(e),u,d;if(a!==void 0&&l!==void 0)u=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>qt(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${So}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,d=Vo(e,l);else if(s===void 0||i===void 0)u=c`<div class="crumbs"><span class="kchip" style=${`--k:${ko}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,d=aa(e,n);else{let f=ne(e,s);u=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>fe(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${V(s).color}`}>Slot</span><span class="nm" title=${f}>${f}</span></div>`,d=na(e,i,s)}return c`<div class="insp-head">
      ${u}
      <button class="expand" @click=${()=>{pi(e.uiState,r,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${d}</div>`}function Vo(e,n){let t=n.page;return _(e,"switcherPage","switcher-page",Pt,c`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Pt}>${rs(n)}</fieldset>`,{summary:ss(t),dot:is(t)})}var Do={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function Cr(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Do[n.key]??n.key}var _o={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function Lr(e){return ee(e).replace(/ - (.+)$/," ($1)")}function Wo(e,n){if(n==="entityControl"){let t=Si(e)??"all";return t==="all"?"Any entity":pe(t)}return _o[n]??bi(n)}function Uo(e,n,t){let i=M(t),s=Ri(n),r=a=>{let l=oe(a),u=l===void 0?{icon:be.unknownActionIcon,color:be.unknownActionColor}:l,d=a===i?void 0:wi(a,e.targets);return{raw:a,label:Lr(a),icon:u.icon,color:u.color,...d===void 0?{}:{why:d}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[r(i)]}],...s.map(a=>({heading:Wo(n,a.category),tiles:a.actions.map(r)}))]}function Ko(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function Xs(){return c`<button type="button" class="link" @click=${vs}>Open HTTP actions</button>`}function Bo(e,n,t){let i=n.find(s=>P(s.id,t));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${Xs()}</div>`:e.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${si} ${Xs()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:m}function jo(e,n,t,i,s){let r=R(t),o=we(t)[s.key],a=typeof o=="string"?o:"",l=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,u=a===""||l.some(p=>P(p.id,a)),d=p=>e.edit(v=>kt(v,n,r,s.key,p===""?void 0:p)),f=s.target==="statusPage"&&e.statusPagesKnown===!0,b=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,h=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":f?`Not in this ${yn(e.device??"watch")}'s status pages`:b?ii:ei,g=p=>s.target==="httpAction"?Ko(p):p.name;return c`<label class="field"><span>${Cr(i,s)}</span>
    <select .value=${Ce(l.find(p=>P(p.id,a))?.id??a)} @change=${p=>d(p.target.value)}>
      ${s.required===!0?m:c`<option value="" ?selected=${a===""}>None</option>`}
      ${u?m:c`<option value=${a} selected>${h}</option>`}
      ${l.map(p=>c`<option value=${p.id} ?selected=${P(p.id,a)}>${g(p)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.device==="iphone"?c`<div class="hint ts-under">${qi}</div>`:e.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:m:s.target==="statusPage"?f||e.catalogKnown?m:c`<div class="hint ts-under">${wn("status pages",e.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?Bo(e,e.targets.httpActions,a):m}`}function qo(e,n,t,i,s){let r=R(t),o=we(t),a=(d,f)=>e.edit(b=>kt(b,n,r,s.key,d),f),l=Cr(i,s),u=St(t,s);switch(s.type){case"entity":{let d=typeof o[s.key]=="string"?o[s.key]:"",f=i==="runScene"?"scene":i==="runScript"?"script":vi();return c`<div class="ts-stack">${lt({hass:e.hass},l,cr(e.hass,d),b=>a(b.entityId),`me:entity:${r}`,{domain:f,clearable:!1,needed:d===""})}</div>
        ${d===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:m}`}case"uuid":return jo(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let b=Ee(typeof o.entityId=="string"?o.entityId:""),h=yi(b),g=typeof u=="string"?u:h[0]??"",p=h.map(v=>[v,wt(v)]);return h.includes(g)||p.unshift([g,wt(g)]),j(l,g,p,v=>a(v),{snapBack:!0})}let d=ae(s.enum),f=typeof u=="string"?u:String(s.default??"");return d.length<=4?q(l,f,d,b=>a(b)):j(l,f,d,b=>a(b),{snapBack:!0})}case"bool":return K(l,u===!0,d=>a(d),s.default);case"number":{if(s.key==="bannerSeconds"&&St(t,{key:"showBanner",type:"bool",default:!0})===!1)return m;let d=typeof o[s.key]=="number"?o[s.key]:void 0;return Kn(l,d,f=>a(f,`slot:${r}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function Fo(e,n,t){if(!xt(n,t))return m;let i=R(t);return c`<div class="ts-stack">${q("Skip conditions",Xi($t(t)),Zi,s=>e.edit(r=>Ii(r,n,i,Qi(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function zo(e){let n=Ne(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(pe).join(", ")}function Jo(e,n){let t=R(n),i=Ne(n),s=i===void 0,r=l=>e.edit(u=>Di(u,t,l)),o=Vi(),a=(i??[]).filter(l=>!Mt(l));return c`<div class="mi-wrap">${q("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],l=>r(l==="every"?void 0:o.slice(0,1)),{def:"every"})}</div>
    ${s?m:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...o,...a].map(l=>{let u=i.includes(l),d=!Mt(l);return c`<button type="button" class="pe-chip ${u?"on":""} ${d?"odd":""}" aria-pressed=${u?"true":"false"}
          title=${d?"Not reported by the watch":m}
          @click=${()=>r(u?i.filter(f=>f!==l):[...i,l])}>${pe(l)}</button>`})}
    </div>
    ${a.length===0?m:c`<div class="hint warn">${a.map(pe).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function Go(e,n){return xt(n,e)&&$t(e)!==null}function Yo(e){return e.isVisible===!1}function Zo(e){return Ne(e)!==void 0}function Xo(e){let n=lr(e);if(n===void 0)return!1;let t=V(e);return t.icon!==n.icon||!Mo(t.color,n.color)}function Qo(e,n){let t=ar.name;return c`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${C(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${ne(e,n)}</span>
    </div>
  </section>`}function ea(e){let n=z(e);return n.charAt(0)+n.slice(1).toLowerCase()}function ta(e,n,t){let i=R(t),s=F(e.document,n).filter(r=>!P(R(r),i));return Oe().map(r=>{let o=s.find(l=>l.position===r),a={position:r,label:ea(r),here:t.position===r};return o!==void 0&&(a.holder={name:ne(e,o),...V(o)}),a})}function na(e,n,t){let i=R(t),s=M(t),r=oe(s),o=V(t),a=lr(t),l=typeof t.position=="string"?t.position:"",u=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${r===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:m}
    ${zs(e.icons,s,Uo(e,n,t),h=>e.edit(g=>Ni(g,n,i,h,e.targets)))}
    ${r?.description?c`<div class="mi-desc">${r.description}</div>`:m}
    ${Pi(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:m}
    ${(r?.payload??[]).map(h=>qo(e,n,t,s,h))}
    ${Fo(e,n,t)}
  </fieldset>`,d=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${Js(e.icons,o,ta(e,n,t),h=>e.edit(g=>Ei(g,n,i,h)))}
    ${K("Shown on the watch",t.isVisible!==!1,h=>e.edit(g=>Ai(g,n,i,h)),!0)}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${Bn({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",h=>e.edit(g=>Oi(g,n,i,h),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${Le("Color",typeof t.color=="string"?t.color:void 0,h=>{h!==void 0&&e.edit(g=>Hi(g,n,i,h),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,b=Ls(e,n,t);return c`${Qo(e,t)}
    ${_(e,"slot","slot","What it does",u,{summary:Lr(s),dot:Go(t,n)})}
    ${_(e,"where","where","Where",d,{summary:`${z(l)}${t.isVisible===!1?", hidden":""}`,dot:Yo(t)})}
    ${b===void 0?m:_(e,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${b}</fieldset>`,{summary:Es(e,t),dot:Rs(t)})}
    ${_(e,"look","look","Icon and color",f,{summary:o.icon,dot:Xo(t)})}
    ${n.list==="anywhere"?_(e,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${Jo(e,t)}</fieldset>`,{summary:zo(t),dot:Zo(t)}):m}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(h=>Li(h,n,i))}>${C("delete")}<span>Remove</span></button>
    </div>`}function ia(e){let n=Fe(e.document,"quickAction",Ns),t=Fe(e.document,"quickAction",Vs);return c`${_(e,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${Ds(e)}
    </fieldset>`,{summary:_s(e.document),dot:n})}
    ${_(e,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${Ws(e)}
    </fieldset>`,{summary:Us(e.document),dot:t})}`}function sa(e){let n=Fe(e.document,"pageSwitcher",Ks);return _(e,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${Bs(e)}
  </fieldset>`,{summary:js(e.document),dot:n})}function ra(e){let n=br(e),t=a=>{e.uiState.set(ur,a),e.requestUpdate()},i=q("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,r,o=!1;if(n==="domain"){let a=wr(e),l=ye(a),u=$i(a),d=xi().map(h=>[h.domain,h.label]),f=qs.flatMap(h=>{let g=ye(h);return g===void 0?[]:[{domain:g.domain,label:g.label,icon:g.icon,color:yt(g.domain).color}]}),b=l?.inheritKey?Mi(e.document,a):!1;o=b,r=`By type \xB7 ${l?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${Fs(e.icons,a,f,d,h=>{e.uiState.set(pr,h),e.requestUpdate()})}
      ${u.length>0?c`<div class="hint ts-under keep">The same menu as ${u.map(h=>h.label).join(", ")}.</div>`:m}
      ${l?.inheritKey?je("Fill gaps with the All menu",b,h=>e.edit(g=>_i(g,a,h)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):m}`}else{let a=Tt(e.document),l=yr(e);r=`By entity \xB7 ${l===void 0?"none yet":ue(e.hass,l)}`;let u=d=>{let f=d.entityId.trim();f!==""&&(e.edit(b=>Wi(b,f)),e.uiState.set(Kt,f),e.uiState.set(Ut,(Number(e.uiState.get(Ut)??0)||0)+1),e.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:m}
      ${a.map(d=>{let f=d===l;return c`<div class="me-entity ${f?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${f?"true":"false"}
            @click=${()=>{e.uiState.set(Kt,d),e.requestUpdate()}}>
            <b>${ue(e.hass,d)}</b><code>${d}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(b=>Ui(b,d))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${lt({hass:e.hass},"Add an entity",cr(e.hass,""),u,`me:er:add:${String(e.uiState.get(Ut)??0)}`,{clearable:!1})}
      </div>
    </div>`}return _(e,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:r,dot:o})}var oa="Click a slot on the watch to change what it does.";function aa(e,n){let t=n==="anywhere"?ia(e):n==="switcher"?sa(e):ra(e);return c`<p class="me-menu-note">${nr[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?wo:oa}</p>`}var Er=B`
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
`;var ca=["spring","popIn","fade","none"],la=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Me(e,n,t){let i=te(n).find(s=>s.key===t);return i===void 0?void 0:J(e,n,i)}function Te(e,n,t,i){let s=te(n).find(a=>a.key===t),r=Me(e,n,t),o=typeof r=="number"&&Number.isFinite(r)?r:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,o))}function Ge(e,n){return Me(e,"quickAction",n)===!0}function da(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function Ye(e){let n=Me(e,"quickAction","entranceStyle"),t=Me(e,"quickAction","beamStyle");return{glass:Ge(e,"showIconBubble"),neon:Ge(e,"showNeonOutline"),labels:Ge(e,"showContextLabel"),finger:Ge(e,"showFingerShadow"),entrance:ca.includes(n)?n:"none",dim:Te(e,"quickAction","backgroundDim",1),beam:la.includes(t)?t:"none",beamColor:da(Me(e,"quickAction","beamColor")),beamIntensity:Te(e,"quickAction","beamIntensity",.5),glow:Te(e,"quickAction","glowIntensity",.5)}}function ua(e){return{glow:Te(e,"pageSwitcher","glowIntensity",.5),scale:Te(e,"pageSwitcher","selectedScale",1.2)}}var Gt="ms:play",pa=1500;function ma(e){let n=e.uiState.get(Gt);e.uiState.set(Gt,{menu:T(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function ha(e){let n=e.uiState.get(Gt);return n===void 0||n.menu!==T(e)||Date.now()-n.at>pa?"":n.count%2===1?"ms-play-a":"ms-play-b"}function Or(e,n){let t=F(e,n),i=Ti(e,n),s=new Set(vt(e,n));return Oe().map(r=>{let o=t.filter(d=>d.position===r),a=o.find(d=>d.isVisible!==!1),l=a===void 0?i.find(d=>d.position===r&&d.isVisible!==!1):void 0,u=a??(l===void 0?o[0]:void 0);return{position:r,own:o,main:u,second:o.find(d=>d!==u),shared:l,free:s.has(r)}})}function fa(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=R(n),r=e.find(o=>o.main!==void 0&&P(R(o.main),s));if(r!==void 0)return{position:r.position,slot:n}}let i=e.flatMap(s=>{let r=t(s.main)?s.main:s.shared;return r===void 0?[]:[{position:s.position,slot:r}]});return i.find(s=>s.position==="topCenter")??i[0]}var w=e=>Math.round(e*100)/100;function Zt(e,n){let t=ir(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function Jt(e,n,t,i){return Hr(e,n,Zt(e.screen,t),i)}function Hr(e,n,t,i){let{width:s,height:r}=e.screen,o=e.scale,a=[`left:${t.x*100}%`,`top:${t.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${w((s/2-t.px)*o)}px`,`--fy:${w((r/2-t.py)*o)}px`),n.finger){let l=t.px-s/2,u=t.py-r/2,d=Math.hypot(l,u);d>1&&a.push(`--sx:${w(l/d*5*o)}px`,`--sy:${w(u/d*5*o)}px`)}return a.join(";")}function Yt(e,n){return Math.round(n*e.scale)}function ga(e,n,t,i,s){let r=Zt(e.screen,t),o=(n.glass?28:25)*(r.y>.5?-1:1),a=(r.py+o)/e.screen.height;return c`<span class="ms-name" aria-hidden="true" style=${`left:${r.x*100}%;top:${w(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function ba(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,r=t*.18,o=(n-i*2-s)/2,a=(t-r-i-s*2)/3,l=[0,1,2,3,4,5].map(u=>{let d=i+u%2*(o+s),f=r+Math.floor(u/2)*(a+s);return k`<rect class=${`ms-tile t${u%4}`} x=${w(d)} y=${w(f)} width=${w(o)} height=${w(a)} rx=${w(n*.06)}></rect>`});return c`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${w(i)} y=${w(t*.075)} width=${w(n*.4)} height=${w(t*.045)} rx=${w(t*.0225)}></rect>
    ${l}
  </svg>`}function X(e,n,t){return k`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function Ar(e,n,t,i){return k`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${w(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${w(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function wa(e,n,t){if(e.beam==="none")return m;let i=e.beamColor,s=e.beamIntensity,r=n.width/2,o=n.height/2,a=t.x-r,l=t.y-o,u=Math.hypot(a,l),d=Math.atan2(l,a),f=(p,v)=>`${w(r+Math.cos(d+p)*v)},${w(o+Math.sin(d+p)*v)}`,b=w(t.x),h=w(t.y),g;switch(e.beam){case"sectorWedge":{let p=Math.PI/4;g=k`${X("ms-b8",8,n)}${X("ms-b3",3,n)}
        <polygon points=${`${r},${o} ${f(-p/2,u*1.2)} ${f(p/2,u*1.2)}`} fill=${i} fill-opacity=${w(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${r},${o} ${f(-p*.3,u)} ${f(p*.3,u)}`} fill=${i} fill-opacity=${w(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":g=k`${X("ms-b7",7,n)}${X("ms-b10",10,n)}${Ar("ms-wash",i,.35*s,.18*s)}
        <circle cx=${w((r+t.x)/2)} cy=${w((o+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${b} cy=${h} r="40" fill=${i} fill-opacity=${w(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":g=k`${X("ms-b4",4,n)}${X("ms-b5",5,n)}${Ar("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${b} cy=${h} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${b} cy=${h} r="25" fill=${i} fill-opacity=${w(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":g=k`${X("ms-b6",6,n)}
        <circle cx=${b} cy=${h} r="30" fill=${i} fill-opacity=${w(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(p=>k`<circle cx=${b} cy=${h} r=${w((30+p*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${w((1-p)*.45*s)} stroke-width=${w(2-p*1.2)}></circle>`)}`;break;case"wakeWave":g=k`${X("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${r} y1=${o} x2=${b} y2=${h}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${w(.5*s)}></stop></linearGradient>
        <line x1=${r} y1=${o} x2=${b} y2=${h} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(p=>{let v=1-p;return k`<circle cx=${w(r+a*p)} cy=${w(o+l*p)} r=${w((20+v*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${w((1-v)*.5*s)} stroke-width=${w(Math.max(1.5-v*1.2,.3))}></circle>`})}
        <circle cx=${b} cy=${h} r="18" fill=${i} fill-opacity=${w(.25*s)} filter="url(#ms-b4)"></circle>`;break}return k`<g class="ms-beam">${g}</g>`}function ya(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":ha(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${w(n.dim*.85)}`,`--ms-blur:${w(2+n.dim*4)}px`,`--ms-g-r:${w(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function Xt(e,n,t,i,s={}){let{width:r,height:o}=e.screen,a=e.scale,l=Math.min(r,o),u=ya(e,t),d=[`width:${Math.round(r*a)}px;height:${Math.round(o*a)}px;--me-s:${a}`,u.style,s.style??""].filter(b=>b!=="").join(";"),f=c`<div class=${`me-screen ms-screen ${u.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${d}>
    <div class="ms-backdrop" aria-hidden="true">${ba(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${r} ${o}`} aria-hidden="true">
      ${s.beamTo===void 0?m:wa(t,e.screen,s.beamTo)}
      <circle cx=${r/2} cy=${o/2} r=${l*me} class="me-track"></circle>
      ${t.finger?k`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${r/2} cy=${o/2} r=${w(l*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:m}
      <circle cx=${r/2} cy=${o/2} r=${l*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return Xn(e.phone,{width:r,height:o},a,f,n,e.icons)}function va(e,n,t,i){let s=Ye(e.document),r=Or(e.document,n),o=fa(r,t),a=o===void 0?void 0:R(o.slot),l=t===void 0?void 0:R(t),u=(p,v=me)=>He(p,v),d=p=>a!==void 0&&P(R(p),a),f=(p,v,I,$,E)=>{let A=V(p),U=R(p),L=l!==void 0&&P(U,l),Q=p.isVisible===!1,rn=`${z(v)}: ${ee(M(p))}${Q?", hidden":""}`,zr=["me-dot",$,L?"on":"",Q?"off":"",d(p)&&$===""?"ms-active":""].filter(Jr=>Jr!=="").join(" ");return c`<button type="button" class=${zr} style=${Jt(e,s,I,A.color)}
      title=${rn} aria-label=${rn} aria-pressed=${L?"true":"false"} @click=${()=>fe(e,n,U)}>
      ${ke(e,A.icon,Yt(e,$===""?15:11),A.color)}${E>1?c`<span class="me-count" aria-hidden="true">${E}</span>`:m}</button>`},b=r.map(p=>{let v=u(p.position);if(v===void 0)return m;let I=m,$;if(p.main!==void 0)I=f(p.main,p.position,v,"",p.own.length),p.main.isVisible!==!1&&($=p.main);else if(p.shared!==void 0){let L=V(p.shared),Q=`${z(p.position)}: ${ee(M(p.shared))}, from All`;I=c`<span class=${`me-dot inh${d(p.shared)?" ms-active":""}`} style=${Jt(e,s,v,L.color)} title=${Q}>
        ${ke(e,L.icon,Yt(e,13),L.color)}</span>`,$=p.shared}else if(p.free){let L=z(p.position);I=c`<button type="button" class="me-dot free" style=${Jt(e,s,v)} ?disabled=${e.busy}
        title=${`Add a slot at ${L}`} aria-label=${`Add a slot at ${L}`}
        @click=${()=>Je(e,n,p.position)}>${C("plus")}</button>`}let E=p.second===void 0?void 0:u(p.position,.2),A=p.second===void 0||E===void 0?m:f(p.second,p.position,E,"two",0),U=s.labels&&$!==void 0?ga(e,s,v,V($).color,ne(e,$)):m;return c`${I}${A}${U}`}),h=o===void 0?void 0:u(o.position),g=Zt(e.screen,h??{x:.5,y:.5-me});return Xt(e,`${i} on the watch`,s,b,{beamTo:{x:g.px,y:g.py}})}function Nr(e){let n=t=>Math.min(1.18,Math.max(.82,t));return{w:n(e.width/198),h:n(e.height/242)}}function Ir(e,n,t){let{width:i,height:s}=e,r=Nr(e),o=34*r.w,a=i-34*r.w,l=52*r.h,u=s-30*r.h,d=(l+u)/2,f=i/2,b=18*r.w,h=8*r.h,g=[{x:f,y:l-14*r.h},{x:o+b,y:l+h},{x:o,y:d},{x:o+b,y:u-h},{x:f,y:u+8*r.h},{x:a-b,y:u-h},{x:a,y:d},{x:a-b,y:l+h}];if(t<=1)return g[0];let p=[0];for(let $=1;$<=g.length;$++){let E=g[$-1],A=g[$%g.length];p.push(p[$-1]+Math.hypot(A.x-E.x,A.y-E.y))}let v=p[g.length],I=n*v/t%v;for(let $=0;$<g.length;$++){let E=p[$],A=p[$+1];if(I>=E&&I<=A){let U=A>E?(I-E)/(A-E):0,L=g[$],Q=g[($+1)%g.length];return{x:L.x+(Q.x-L.x)*U,y:L.y+(Q.y-L.y)*U}}}return g[0]}function xa(e){return[...e].slice(0,4).join("").trim()}function $a(e){let n=Ye(e.document),t=ua(e.document),i=e.switcherPages,s=he(e),r=Math.max(0,s===void 0?0:i.findIndex(h=>P(h.id,s.id))),{width:o,height:a}=e.screen,l=h=>({x:h.x/o,y:h.y/a,px:h.x,py:h.y}),u=i.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((h,g)=>{let p=l(Ir(e.screen,g,i.length)),v=g===r,I=g===0&&!v,$=Math.round((v?.7:I?.4:.15)*t.glow*100),E=[Hr(e,n,p,h.color),`--ms-ga:${$}%`,`--ms-gr:${v?45:30}`,`--ms-k:${v?t.scale:1}`].join(";"),A=["ms-sw",v?"ms-active":"",I?"ms-current":""].filter(L=>L!=="").join(" "),U=h.text===void 0?ke(e,h.icon,Yt(e,n.glass?18:v?16:14),v&&!n.glass?"white":h.color):c`<span class="ms-sw-text">${xa(h.text)}</span>`;return c`<span class=${A} style=${E} title=${h.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${U}</span>`}),d=i[r],f=d===void 0?m:c`<span class="ms-sw-name" style=${`top:${w(8*Nr(e.screen).h/a*1e4)/100}%`}>${d.name}</span>`,b=i.length===0?void 0:Ir(e.screen,r,i.length);return Xt(e,"Page switcher on the watch",n,c`${u}${f}`,{beamTo:b,classes:"ms-switcher"})}function ka(e){if(T(e)==="switcher")return $a(e);let n=W(e);return n===void 0?Xt(e,"Entity quick menu on the watch",Ye(e.document),c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):va(e,n,ie(e,n),vr(e,n))}var Sa={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function Ma(e,n,t,i){let s=R(t),r=i!==void 0&&P(s,R(i)),o=t.isVisible===!1,a=ne(e,t),l=`${ee(M(t))}${o?", hidden":""}`;return c`<button type="button" class=${`ms-label${r?" on":""}${o?" off":""}`} data-slot=${s}
    style=${`--k:${V(t).color}`} aria-pressed=${r?"true":"false"}
    @click=${()=>fe(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${l}</small></span></button>`}function Ta(e,n,t,i){let s=z(t.position),r=t.own.map(o=>Ma(e,n,o,i));return t.shared!==void 0&&r.push(c`<span class="ms-label ms-inh" style=${`--k:${V(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${ne(e,t.shared)}</b><small>From the All menu</small></span></span>`),r.length===0&&t.free&&r.push(c`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>Je(e,n,t.position)}>${C("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),c`<div class=${`ms-place ms-at-${t.position} ms-${Sa[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${r}</div>`}function Vr(e){let n=ka(e),t=T(e)==="switcher"?void 0:W(e);if(t===void 0)return c`<div class="me-stage-body">${n}</div>`;let i=ie(e,t);return c`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${Or(e.document,t).map(s=>Ta(e,t,s,i))}
  </div></div>`}var Ra=c`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function Dr(e){let n=T(e),t=Ye(e.document),i=m;if(n!=="switcher"){let r=W(e),o=r===void 0?[]:vt(e.document,r),a=r===void 0?"Add an entity first, in the menu's settings.":o.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=c`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||r===void 0||o.length===0}
      title=${a} @click=${()=>{r!==void 0&&Je(e,r)}}>${C("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?m:c`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>ma(e)}>${Ra}<span class="word">Play opening</span></button>`;return i===m&&s===m?c``:c`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function _r(e){if(T(e)!=="entity")return m;let n=W(e);return n===void 0||ie(e,n)===void 0?m:c`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Se(e)}>Change the type or entity</button></span>`}var Pa={anywhere:{gesture:"hold",open:"Touch and hold an empty spot on any page, slide to a slot, then lift your finger.",use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to a slot, then lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"hold",open:"Open the Anywhere menu and slide to its Pages slot. Then slide to a page and lift your finger.",use:"Jumping straight to any page. It needs a Pages slot in the Anywhere menu. Pick a page in the Pages card to set how it shows here."}};function Wr(e){let n=Pa[T(e)];return ws({art:n.gesture,label:"How it opens",how:n.open,use:n.use})}var Ur=B`
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
`;function Qt(e){if(e.length===0)return"";let n=e.map(i=>ji(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Kr(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${Qt(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${$n}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}fi({dirty:Ht,drop:bs});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Ht()&&(e.preventDefault(),e.returnValue="")});var qr=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),en=qr?"\u2318":"Ctrl+",tn={min:200,max:720,middleMin:320},nn={left:280,right:320},sn="wrist-assistant-panel.menus.columns.v1",Ca="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",La=24,Br=820,Ea=600;function Aa(e){return e==="entity"?"entity":"anywhere"}function Ia(e){return Xe(e).message}function Oa(e){return Xe(e).code}function Ha(e){return e instanceof HTMLElement?On(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Na(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function Va(e){return re(e)?Qe(e).filter(n=>!tt(n)&&gi(Re(n))).map(n=>({id:Re(n),name:et(n)})):[]}var jr=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Ze(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var Da="#8E8E93";function Fr(e){if(!re(e))return[];let n=0;return Qe(e).filter(t=>!Rn(t)&&!tt(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=et(t),r=Ze(t.switcherIcon)??Ze(Tn(t)[0]?.icon)??(Pn(t)?"bolt.fill":"square.grid.2x2.fill"),o=i?Da:jr[n++%jr.length],a=Ze(t.switcherColor)??o,l=t.switcherDisplayMode==="icon"?void 0:Ze(t.switcherText)??s;return{id:Re(t),name:s,icon:r,color:a,...l===void 0?{}:{text:l},hidden:i}})}function fl(e){return Fr(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var y=class extends on{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=m;this.phones=!1;this.libraryItem=void 0;this.previewSettled=!1;this.menuDeleteAsk=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.topMenuOpen=!1;this.lib=new zi(this,()=>this.hass,()=>this.linkDevices.map(t=>t.ownerId));this.zoom=rr();this.stageFit=new os(this,".me-stage-body",()=>this.stageScale);this.columns={...nn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new An(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.subscribeSeq=0;this.previewKind="watch";this.onReconnect=()=>{let t=this.recordKey;this.isConnected&&t!==void 0&&this.load(t,!0);let i=this.watchId;!this.isConnected||i===void 0||(this.loadCatalog(i),this.loadHttpLibrary(),this.loadStatusPages(i),this.loadPages(i),this.loadBehavior(i),this.loadVoice(i),this.lib.store?.refresh())};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!Na()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(s&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .tb-more")?.focus());return}if(!Ha(i[0])){if(s&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let o=this.viewHost();o!==void 0&&Se(o)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(Ca)))return;let o=this.viewHost();o!==void 0&&Se(o)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen)return;t.composedPath().some(s=>s instanceof HTMLElement&&s.classList.contains("pe-top-menu"))||(this.topMenuOpen=!1)};this.addEventListener(Wn,this.onScrubStart),this.addEventListener(Un,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce()})}get watches(){return vn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return this.previewKind}get draft(){let t=this.recordKey,i=this.record;if(t===void 0||i===void 0||i.revision<=0)return;let s=ve(t);if(s!==void 0)return s;let r=gt(i.document);return r===void 0?void 0:Ot(t,r,i.revision).draft}get recordKey(){return this.libraryItem===void 0?void 0:Lt(this.libraryItem)}get libraryUnit(){let t=this.libraryItem,i=this.lib.library;return t===void 0||i===void 0?void 0:Pe(i,t.id)?.unit}get pagesDocument(){let t=this.pagesRecord;return t!==void 0&&t.revision>0?t.document:void 0}get pages(){return Va(this.pagesDocument)}get saving(){let t=this.recordKey;return t===void 0?!1:ve(t)?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ln(sn,nn,tn),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0&&(this.openPreview(this.watchId),this.openItem(!0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.flushRename()}willUpdate(t){this.hass&&(t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,an(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0&&this.followLibraryItem(this.libraryItem)),this.followSave()}updated(){this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.recordKey;if(t===void 0)return;let i=ve(t)?.saveDone;if(i===void 0||i===this.followedSave)return;this.followedSave=i;let s=()=>this.saveEnded(t);i.then(s,s)}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.recordKey?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}followLibraryItem(t){let i=It(this.lib.library,t);(!Et(t,this.openedItem)||!this.previewSettled)&&(this.previewKind=ds(this.watches,t,i),this.previewSettled=i!==void 0);let s=At(this.watches,this.previewKind,[t.from,...i??[]]);(s!==this.watchId||s===void 0&&this.openedItem===void 0)&&this.openPreview(s),Et(t,this.openedItem)||(this.openedItem=t,this.openItem());let r=Lt(t),o=this.libraryUnit;o!==void 0&&this.shownUnitFor!==r&&(this.shownUnitFor=r,hr({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},o));let a=ls(this.lib.library,t),l=this.record?.revision;a!==void 0&&l!==void 0&&a>l&&a!==this.followedRevision&&(this.followedRevision=a,this.load(r,!0))}pickPreview(t){this.previewKind=t,this.openPreview(At(this.watches,t,[this.libraryItem?.from,...It(this.lib.library,this.libraryItem)??[]]))}openPreview(t){this.watchId=t,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,t===void 0?this.endSubscription():this.startSubscription(t),this.loadContext(t)}openItem(t=!1){let i=this.recordKey;i!==void 0&&(t||(this.reloadPending=!1,this.note=void 0,this.flushRename(),this.libNote=void 0,this.menuDeleteAsk=!1,this.endScrub(),this.uiState.clear(),this.shownUnitFor=void 0,this.followedRevision=void 0),this.load(i,t))}loadContext(t){this.loadHttpLibrary(),t!==void 0&&(this.loadCatalog(t),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let r=await se(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=es(r)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Rt(t),defaults:ts(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let r=await se(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=ti(r)}catch(r){if(s!==this.catalogSeq||t!==this.watchId)return;ut(r)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await ln(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=Nn(s)}catch(s){if(i!==this.httpLibrarySeq)return;Vn(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let r=await se(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=ni(r)}catch(r){if(s!==this.statusPagesSeq||t!==this.watchId)return;ut(r)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let r=await se(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:r.revision,document:r.document}}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let r=await se(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=r.revision>0&&re(r.document)?r.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass,r=this.libraryItem;if(!s||r===void 0)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let a=await as(s,r);if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.show(t,a),this.loadError=void 0}catch(a){if(o!==this.loadSeq)return;i||(this.loadError=Sn(a))}this.loading=!1}flushPending(){let t=this.recordKey;!this.reloadPending||this.holdReload||t===void 0||(this.reloadPending=!1,this.load(t,!0))}show(t,i){this.record=i;let s=i.revision>0?gt(i.document):void 0;if(s===void 0)return;let r=Ot(t,s,i.revision);r.replaced.length>0?this.note={kind:"warn",text:Qt(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;cn(i,t,r=>{s===this.subscribeSeq&&(r.kind==="catalog"?ri(r,this.catalog)&&this.loadCatalog(t):r.kind==="status_pages"?this.loadStatusPages(t):r.kind==="pages"?this.loadPages(t):r.kind==="behavior"?this.loadBehavior(t):r.kind==="voice"&&this.loadVoice(t))}).then(r=>{s===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let r=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??In,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=Hn(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:Dn(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Rt(this.voiceDocument)}}screen(){let t=this.phoneLayout();if(t!==void 0)return Yn(t);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(ct(i?.screen_size)??at).screen}phoneLayout(){if(this.device!=="iphone")return;let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return Gn(Jn(t?.screen_size))}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,r=Fr(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*dt,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:r.filter(o=>!o.hidden).map(({hidden:o,...a})=>a),switcherRows:r,menuFoot:o=>o==="switcher"?m:this.libraryHead(o),menuBadge:o=>this.menuBadge(o),...this.libraryUnit===void 0?{}:{sections:er(this.libraryUnit)},get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(o,a)=>this.draft===t&&this.edit(o,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||(this.draft?.discard()??!1)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.recordKey;this.endScrub();let s=this.draft;if(!t||i===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let r=await this.saveMenus(t,i,s);i===this.recordKey&&(this.note=r)}async saveMenus(t,i,s){let r=this.libraryItem;if(r===void 0)return;let o=fs(s,{prepare:Bi,...cs(t,this.lib.store,r)});this.followedSave=s.saveDone,this.requestUpdate();let a=await o.catch(l=>({ok:!1,revision:s.revision,merged:!1,code:Oa(l)??"unknown",message:Ia(l)}));return this.saveEnded(i),Kr(a)}get linkDevices(){return Mn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}libraryMenuOf(t){let i=this.lib.library,s=this.libraryItem;if(s===void 0||i===void 0)return;let r=Pe(i,s.id);return r?.unit===Aa(t)?r:void 0}menuBadge(t){if(t==="switcher")return;let i=this.libraryMenuOf(t);return i===void 0||i.name===st[i.unit]?void 0:i.name}typeMenuName(t,i){this.naming={menuId:t,value:i},this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=setTimeout(()=>this.flushRename(),Ea)}flushRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0;let t=this.naming;if(t===void 0||t.sent===!0)return;let i=this.lib.store,s=this.lib.library,r=t.value.trim(),o=s===void 0?void 0:s.index.menus.get(t.menuId.toUpperCase());if(i===void 0||r===""||o===void 0||o.name===r){this.naming=void 0;return}let a={menuId:t.menuId,value:r,sent:!0};this.naming=a,i.renameMenu(t.menuId,r).then(()=>{this.naming===a&&(this.naming=void 0)})}cancelRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0,this.naming=void 0}menuTickLocked(t){if(ve(t)?.dirty??!1)return Yi(this.linkDevices.find(i=>it(i.ownerId,t))?.name??"that device")}libraryHead(t){let i=this.libraryMenuOf(t),s=this.lib.store;if(i===void 0||s===void 0||this.recordKey===void 0)return m;let r=st[i.unit],o=this.naming!==void 0&&it(this.naming.menuId,i.id)?this.naming:void 0,a=s.noteFor("menus",i.id);return c`<div class="me-lib" role="group" aria-label=${r} @click=${l=>l.stopPropagation()}>
      <label class="me-lib-name"><span class="me-lib-h">Name</span>
        <input type="text" class="me-lib-input" aria-label=${`${r} name`} placeholder=${r} maxlength="80"
          .value=${Ce(o?.value??i.name)}
          @input=${l=>this.typeMenuName(i.id,l.target.value)}
          @keydown=${l=>{l.key==="Enter"?(l.preventDefault(),this.flushRename()):l.key==="Escape"&&(l.preventDefault(),l.stopPropagation(),this.cancelRename())}}
          @blur=${()=>this.flushRename()} />
      </label>
      ${this.renderLibraryDelete(i)}
      ${a===void 0?m:c`<p class="me-lib-note err" role="alert">${a}</p>`}
      ${this.libNote===void 0?m:c`<p class="me-lib-note ${this.libNote.kind}" role="status">${this.libNote.text}</p>`}
    </div>`}menuTicks(t,i=!1){let s=this.lib.store,r=this.hass?.user?.is_admin;return Ji({library:this.lib.library,kind:"menus",itemId:t.id,...this.libraryItem?.from===void 0?{}:{viewing:this.libraryItem.from},devices:this.linkDevices,colorOf:o=>this.colorOf(o),pending:s.pending,...r===void 0?{}:{admin:r},...i?{hint:!1}:{},locked:o=>this.menuTickLocked(o)},o=>{s.pickMenu(o,t.unit,t.id)})}renderStageDevices(){let t=this.libraryItem,i=this.lib.library,s=t===void 0||i===void 0?void 0:Pe(i,t.id);return s===void 0||this.lib.store===void 0||this.draft===void 0?m:ms("menus",s.owners.length,this.menuTicks(s,!0),this.lib.store?.savedStamp("menus",s.id))}renderLibraryDelete(t){return t.owners.length>0?c`<p class="me-lib-hint">A save changes it on every device that uses it. To delete it, pick another menu for each of them first.</p>`:this.menuDeleteAsk?c`<div class="me-lib-copy me-lib-del-ask" role="alertdialog" aria-label=${`Delete ${t.name}?`}>
      <span class="me-lib-hint"><b>Delete ${t.name}?</b> It is on no device yet. ${Fn}</span>
      <button type="button" class="pe-btn pe-danger" @click=${()=>this.deleteLibraryMenu(t)}>Really delete</button>
      <button type="button" class="pe-btn" @click=${()=>{this.menuDeleteAsk=!1}}>Cancel</button>
    </div>`:c`<button type="button" class="pe-btn pe-danger me-lib-del" ?disabled=${this.saving}
        title=${`Delete ${t.name}. It is on no device yet.`} @click=${()=>{this.menuDeleteAsk=!0}}>Delete</button>`}deleteLibraryMenu(t){let i=this.lib.store,s=this.recordKey;i===void 0||s===void 0||this.libraryItem===void 0||(this.menuDeleteAsk=!1,i.deleteItemLater("menus",t.id,`Deleted ${t.name}.`,async()=>{gs(s)}),this.onBack?.())}render(){return c`
      <div class="pe-top">
        ${this.renderTopBar(this.draft)}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(this.watches)}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Br}renderTopBar(t){let i=t!==void 0,s=i&&this.dirty;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Menu in the library">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${C("menu")}</button>`:m}
      <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${()=>this.onBack?.()}>${C("left")}<span>Menus</span></button>
      ${ps()}
      <span class="spacer"></span>
      ${this.renderTopMenu(i?t:void 0)}
      ${i?c`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${en}S). A save reaches every device that uses this menu.`:`Nothing to save (${en}S)`}
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
    </span>`}colorOf(t){return qn(jn(this.owners.length>0?this.owners:this.ownList??[]),t)}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Br?this.columns:Cn(this.hostWidth-La,this.columns,tn)}renderGutter(t){return c`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();En(i,{side:t,base:t==="left"?s.left:s.right,limits:tn,onWidth:r=>{this.columns={...this.columns,[t]:r}},onEnd:()=>ot(sn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:nn[t]},ot(sn,this.columns)}}></div>`}get stageScale(){return this.zoom??this.stageFit.fit(mt(this.narrow||this.stacked))}setZoom(t){this.zoom=t,or(t)}renderStage(t,i){let s=i.find(f=>f.owner_watch_id===this.watchId),r=ct(s?.screen_size),o=r??at,a=t.phone===void 0?o.label:t.phone.model.label,l=[...Mr(t),a],u=this.draft,d=Ft(T(t));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${d}>${d}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${xn(s,i)}</span></span>`:m}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${t.phone!==void 0?Zn:r===void 0?`${o.label}, this watch's size is not known`:l.join(" \xB7 ")}><span class="fam">${l.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${en}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${C("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${qr?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${C("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices()}
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(t)}
        ${Wr(t)}
        ${Vr(t)}
        <div class="under"><span class="tail">${Tr(t)}</span>${_r(t)}</div>
      </div>
    </div>`}renderStageTools(t){let i=t.phone!==void 0,s=this.stageScale,r=this.stageFit.fit(mt(this.narrow||this.stacked)),o=a=>hi(i?a*dt:a);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${Dr(t)}
      ${us(this.previewKind,a=>this.pickPreview(a))}<span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=ft(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(ft(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${o(s)}. Back to fit`}
          title=${`The ${i?"iPhone":"watch"} at ${o(s)} of its own points. Click to fit it again (${o(r)}).`}
          @click=${()=>this.setZoom(void 0)}>${o(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=ht(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(ht(s))}>+</button>
      </span>
    </div>`}renderBody(t){if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError===void 0&&this.libraryUnit===void 0){let l=this.lib.readState==="failed"?this.lib.store?.readError:void 0;return c`<div class="pe-empty">${l??"Loading\u2026"}</div>`}if(this.loadError!==void 0){let l=this.recordKey;return c`<div class="pe-empty">
        <span>Could not read this menu: ${this.loadError}</span>
        ${l===void 0?m:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}if(this.record===void 0)return c`<div class="pe-empty">Loading…</div>`;if(this.draft===void 0)return c`<div class="pe-empty"><b>${Fi}</b></div>`;let r=this.viewHost();if(r===void 0)return c`<div class="pe-empty">Loading…</div>`;let o=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return c`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${a}`}>
      <div class="column left">
        ${kr(r)}
        ${Sr(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Pr(r)}
      </div>
    </div>`}static{this.styles=[kn,dn,un,pn,mn,hn,fn,gn,zn,Qn,B`
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
  `,Er,Ur,Gs,ys,Gi,hs]}};x([O({attribute:!1})],y.prototype,"hass",2),x([O({attribute:!1})],y.prototype,"owners",2),x([O({type:Boolean,reflect:!0})],y.prototype,"narrow",2),x([O({attribute:!1})],y.prototype,"icons",2),x([O({attribute:!1})],y.prototype,"iconsTick",2),x([O({attribute:!1})],y.prototype,"haMenu",2),x([O({attribute:!1})],y.prototype,"onHaMenu",2),x([O({attribute:!1})],y.prototype,"onBack",2),x([O({attribute:!1})],y.prototype,"barActions",2),x([O({attribute:!1})],y.prototype,"phones",2),x([O({attribute:!1})],y.prototype,"libraryItem",2),x([S()],y.prototype,"watchId",2),x([S()],y.prototype,"menuDeleteAsk",2),x([S()],y.prototype,"record",2),x([S()],y.prototype,"catalog",2),x([S()],y.prototype,"statusPages",2),x([S()],y.prototype,"httpLibrary",2),x([S()],y.prototype,"pagesRecord",2),x([S()],y.prototype,"behavior",2),x([S()],y.prototype,"voiceDocument",2),x([S()],y.prototype,"loading",2),x([S()],y.prototype,"loadError",2),x([S()],y.prototype,"note",2),x([S()],y.prototype,"ownList",2),x([S()],y.prototype,"topMenuOpen",2),x([S()],y.prototype,"naming",2),x([S()],y.prototype,"libNote",2),x([S()],y.prototype,"zoom",2),x([S()],y.prototype,"columns",2),x([S()],y.prototype,"hostWidth",2),x([S()],y.prototype,"hostHeight",2),x([S()],y.prototype,"previewKind",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",y);export{mr as a,Po as b,Er as c,ka as d,Ur as e,sn as f,Ea as g,Aa as h,Va as i,jr as j,Da as k,Fr as l,fl as m,y as n};
