import{d as yr,e as K,f as Gt,g as Yt,h as Ge,i as vr,j as xr,l as kr}from"./chunk-FQKLXJAU.js";import{b as Sr,c as $r}from"./chunk-7QMILJZ6.js";import{B as tr,C as nr,D as ir,ba as sr,ca as rr,da as Kt,ea as or}from"./chunk-LX6LATG3.js";import{a as ar,b as zt,g as cr,k as dr,l as lr}from"./chunk-6XZO4JVD.js";import{a as fs,d as gs,h as ws,m as bs,n as ys,o as vs}from"./chunk-6XRH7STI.js";import{ea as le,fa as Ct,oa as Ui,va as ps,wa as hs,xa as ms}from"./chunk-PKMHLLIY.js";import{$ as zs,A as B,B as R,C as Fe,D as Ue,E as Y,F as qe,G as Hs,H as Os,I as Wt,J as As,K as Ds,L as Ns,M as _s,N as Ws,O as Vs,P as Vt,Q as Bt,R as Bs,S as Fs,T as Us,U as qs,V as Ft,W as Ut,X as js,Y as qt,Z as Ks,_ as je,a as ke,aa as Me,ba as Js,ca as Gs,d as We,da as oe,e as At,ea as Z,fa as Ke,g as Dt,ga as pe,h as $s,ha as Ys,i as ue,ia as Zs,j as re,ja as Xs,k as Ms,l as T,la as Qs,m as Se,ma as jt,na as er,o as Ts,p as Ve,q as Ps,r as Nt,s as _t,t as Rs,u as Cs,v as $e,w as Es,x as Be,y as Is,z as Ls}from"./chunk-FYR2VWO6.js";import{h as br}from"./chunk-SD4V7PHU.js";import{$a as os,Aa as Zi,Ba as Xi,Ca as Qi,Da as es,Na as _e,Oa as ts,Qa as ns,Ra as is,Sa as ss,Ya as rs,a as qi,b as ji,bb as Ht,c as Ki,cb as as,d as Et,e as It,g as zi,h as Ji,id as us,ya as Yi,za as Lt}from"./chunk-KWW4YU3S.js";import{a as ze,g as Je,h as Jt}from"./chunk-QYWKU5Q3.js";import{a as Bi,c as Fi}from"./chunk-TE5Q2R5V.js";import{o as Oi,p as $t,q as Ai,r as Mt,s as Tt,w as Ni,x as _i,y as Wi,z as Vi}from"./chunk-PEI2F5V4.js";import{b as ii,c as mt,d as si,e as ft,f as ri}from"./chunk-ZOJGMATP.js";import{a as ur,b as pr,c as hr,d as mr,e as fr,f as gr,g as wr}from"./chunk-F32PSVAR.js";import{Ca as Gi,Sb as cs,Tb as ds,Ub as ls,Wb as Ot}from"./chunk-NXR7NIET.js";import{f as Rt}from"./chunk-UPANJPAF.js";import{a as yt,b as vt,c as bi,d as yi,e as vi,f as xi,g as ki,h as Si,i as $i}from"./chunk-CWTJRXV4.js";import{d as Ei}from"./chunk-AMGXZUWS.js";import{a as gi,b as wi,e as Di}from"./chunk-ZHPGRUAI.js";import{a as Mi,b as Ti,c as Pi,d as Ri,f as Ci}from"./chunk-GR4P77YP.js";import{c as An}from"./chunk-ZKYND2IQ.js";import{Hb as ci,Ib as di,Jb as li,Pb as ui,Qb as pi,Rb as hi,Sb as mi,Tb as fi,Ub as G,Vb as V,Wb as xe,X as gt,Yb as N,Zb as de,aa as wt,bd as xs,cb as ai,dd as ks,ec as bt,ed as Ss,gc as De,re as Mr,ua as oi,z as Ae}from"./chunk-PP27YV6I.js";import{Q as Pt,j as se,l as xt,m as Ii,n as Ne,o as kt,p as Li,q as St,r as Hi}from"./chunk-ESIOP3D4.js";import{a as Xn,b as Qn,c as ei}from"./chunk-X2QLAQLV.js";import{Eg as W,Gg as lt,Ih as qn,Jg as En,Kg as In,Lg as Ln,Mg as Hn,Og as On,b as z,d as c,e as $,g as p,ig as Cn,j as Rn,k as L,l as k,mh as D,nh as M,rh as Dn,th as Nn,uh as _n,vh as Wn,wh as Vn,xh as Bn,yh as Fn,zh as Un}from"./chunk-E5S2SHQS.js";import{B as jn,E as Kn,M as Le,N as J,R as zn,Sa as Zn,U as He,Ua as ti,Va as Oe,Wa as pt,X as Jn,Xa as ht,Y as Gn,Ya as ni,Z as ut,_ as Yn}from"./chunk-PPFKQRTD.js";import{a as y}from"./chunk-LO2NM3CE.js";var Qt="In the page switcher",ra=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],en="switcher-settings",Tr=`${en}:resetDot`;function Pr(e){return ts(e,ra,n=>{let t=_e(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function Rr(e){let n=_e(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function tn(e,n){return`${en}:typed:${e.pageId.toUpperCase()}:${n}`}function Zt(e,n){let t=e.uiState.get(tn(e,n));return typeof t=="string"?t:void 0}function oa(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function aa(e){let n=oa(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...e.uiState.keys()])i.startsWith(`${en}:typed:`)&&(t===void 0||i!==tn(e,t))&&e.uiState.delete(i)}function he(e,n,t=!1){let i=e.uiState.delete(Tr);e.busy||e.edit(n,t&&!i?{typing:!0}:void 0)}function Xt(e,n,t){let i=tn(e,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&e.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(Tr,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&e.endCoalesce(),d.type==="checkbox"&&(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function Cr(e){aa(e);let n=e.page,t=_e(n),i=t.switcherDisplayMode??"text",s=Yi.map(l=>[l,l==="icon"?"Icon":"Name"]),r=typeof n.name=="string"?n.name:"",o=l=>he(e,u=>Lt(u,e.pageId,l)),a=l=>he(e,u=>Zi(u,e.pageId,l),!0),d=Ti(e);return c`
    ${N("Hidden",t.hideFromSwitcher,l=>he(e,u=>es(u,e.pageId,l)),!1)}
    ${t.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the ${d}. Only the switcher leaves it out.</div>`:p}
    ${V("Show as",s.some(([l])=>l===i)?i:"text",s,l=>he(e,u=>Qi(u,e.pageId,l)))}
    ${Xt(e,"switcherText",mi("Name",Zt(e,"switcherText")??t.switcherText??"",l=>he(e,u=>Xi(u,e.pageId,l),!0),{placeholder:r}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title=${`The ${d} picks one from the page's first tile`} @click=${()=>he(e,l=>Lt(l,e.pageId,""))}>Automatic icon</button>
    </div>
    ${Xt(e,"switcherIcon",De({icons:e.icons,symbols:e.symbols,device:Mi(e)},Zt(e,"switcherIcon")??t.switcherIcon??"",o,"sw:switcher-icon",{emptyText:`Picked by the ${d}`,tint:t.switcherColor}))}
    ${Xt(e,"switcherColor",c`<div class="ts-no-alpha">${de("Color",Zt(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the ${d} shows the page's name and picks the icon and color itself.</div>`}var X=ze.routing;function nn(e){return X.actions.find(n=>n.action===e)}function Q(e){return nn(e)?.keys??[]}function F(e){return Object.hasOwn(X.keys,e)?X.keys[e]:void 0}function fe(e){return se(e.voiceConfig)?e.voiceConfig:{}}function ca(e,n){let t=X.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function ee(e,n){let t=F(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=X.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?ca(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,r]=t.clamp??[-1/0,1/0];return Math.min(r,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function Ir(e,n){let t=F(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=ee(e,i[1]),r=i[3].split(/\s+or\s+/).map(a=>a.trim()),o=typeof s=="string"&&r.includes(s);return i[2]===void 0?o:!o}function Ye(e,n){let t=F(n);if(t?.type!=="enum")return[];let i=X.labels[t.enum??""]??{},s=X.offered[n]??X.enums[t.enum??""]??[],r=ee(e,n);return(typeof r=="string"&&!s.includes(r)?[r,...s]:s).map(a=>[a,i[a]??a])}function Lr(e){return F(e)?.label??da[e]??e}var da={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function sn(e,n,t){let i=F(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!Ye(e,n).some(([o])=>o===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[o,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(o,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let o=(t??"").trim();if(o==="")return Jt(e,n);s=o;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let o=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(o.length===0)return Jt(e,n);s=o;break}}return(Object.hasOwn(e,n)?Pt(e[n],s):Pt(ee(e,n),s))?e:Je(e,n,s)}function Hr(e,n,t,i){let s=ee(e,n),r=Array.isArray(s)?s:[];return i===r.includes(t)?e:sn(e,n,i?[...r,t]:r.filter(o=>o!==t))}function la(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function ua(e,n){let t=F(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",r=ee(e,s);return typeof r=="string"&&i.includes(r)}function rn(e,n,t,i){let s=F(n);if(s===void 0)return"None";if(!ua(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let r=la(s,t);return typeof r=="string"&&r.trim()!==""?`Default (${i(r.trim())})`:Array.isArray(r)&&r.length>0?`Default (${r.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Er(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function me(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function Ze(e,n,t){let i=Er(n),s=Er(t);return e.filter(r=>!me(i,r)&&(s.length===0||me(s,r)))}function pa(e,n){return{hiddenPhraseIds:e.filter(t=>!me(n,t)),knownPhraseIds:e.slice()}}function Or(e,n,t,i){if(!me(n,t))return e;let s=Ze(n,e.hiddenPhraseIds,e.knownPhraseIds);if(me(s,t)===i)return e;let r=i?n.filter(a=>me(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),o=pa(n,r);return Je(Je(e,"hiddenPhraseIds",o.hiddenPhraseIds),"knownPhraseIds",o.knownPhraseIds)}function Ar(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function ha(e,n,t,i,s){return Fe(e,n,t,r=>{if(!Q(T(r)).includes(i))return r;let o=fe(r),a=sn(o,i,s);return a===o?r:Dt(r,"voiceConfig",a)})}function ma(e,n,t,i,s,r){return Fe(e,n,t,o=>{if(!Q(T(o)).includes(i))return o;let a=fe(o),d=Hr(a,i,s,r);return d===a?o:Dt(o,"voiceConfig",d)})}function fa(e,n,t,i,s,r){return Fe(e,n,t,o=>T(o)==="ttsMenu"?Or(o,i,s,r):o)}function Dr(e){return Object.keys(fe(e)).some(n=>Q(T(e)).includes(n))}function Nr(e){let n=T(e);return Q(n).length>0||n==="ttsMenu"}function _r(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function ga(e,n,t,i){let s=ls(e.hass.states),r=Ot(s,t),o=a=>N(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${r.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:r.map(o)}
    </div>`}function wa(e,n,t,i){let s=F(t),r=Ar(e.voice?.defaults),o=s?.domain==="conversation"?cs(e.hass.states):ds(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=Ot(o,i===""?[]:[i]);return[["",rn(n,t,r,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??_r(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function ba(e,n,t,i,s){let r=F(s);if(r===void 0||!Ir(i,s))return p;let o=Lr(s),a=ee(i,s),d=(l,u)=>e.edit(g=>ha(g,n,t,s,l),u);switch(r.type){case"enum":return G(o,String(a),Ye(i,s),l=>d(l),{snapBack:!0,def:String(r.default)});case"bool":return N(o,a===!0,l=>d(l),r.default);case"int":{let l=typeof a=="number"?a:Number(r.default),u=ze.volume,[g,w]=r.clamp??[u.min,u.max];return c`${xe(o,l,h=>d(h,`slot:${t}:${s}`),{min:g,max:w,step:u.step,def:Number(r.default),format:h=>`${Math.round(h)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(h=>c`<button type="button" class="pe-chip ${h.value===l?"on":""}"
          aria-pressed=${h.value===l?"true":"false"} @click=${()=>d(h.value)}>${h.label} ${h.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return G(o,l,wa(e,i,s,l),u=>d(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=Ar(e.voice?.defaults),g=r.whenBlank!==void 0?`None picked: ${r.whenBlank}.`:r.fallsBackTo!==void 0?`None picked: ${rn(i,s,u,w=>_r(e.hass,w))}.`:"None picked.";return c`${ga(e,o,l,(w,h)=>e.edit(f=>ma(f,n,t,s,w,h)))}
        <div class="hint ${l.length===0&&r.fallsBackTo===void 0&&r.whenBlank===void 0?"warn":""}">${l.length===0?g:`${l.length} picked.`}</div>`}}}function ya(e,n,t){let i=typeof t.id=="string"?t.id:"",s=fe(t),r=Q(T(t));return c`${e.voice?.defaults===void 0?c`<div class="hint">${or}.</div>`:p}
    ${r.map(o=>ba(e,n,i,s,o))}`}function va(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let r=s.map(u=>u.id),o=Ze(r,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],d=a.length>0&&r.some(u=>!a.some(g=>g.toUpperCase()===u.toUpperCase())),l=u=>o.some(g=>g.toUpperCase()===u.toUpperCase());return c`<div class="me-sub-h">${nn("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>N(u.name,l(u.id),g=>e.edit(w=>fa(w,n,i,r,u.id,g))))}
    </div>
    <div class="hint">${o.length===0?"No phrase shows: the list on the watch is empty.":`${o.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function Wr(e,n,t){let i=T(t);if(i==="ttsMenu")return va(e,n,t);if(Q(i).length>0)return ya(e,n,t)}function Vr(e,n){let t=T(n);if(t==="ttsMenu"){let o=e.voice?.phrases;return o===void 0?"":`${Ze(o.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${o.length} phrases`}let i=fe(n),s=Q(t)[0];if(s===void 0)return"";let r=ee(i,s);return Ye(i,s).find(([o])=>o===r)?.[1]??""}function qr(e,n,t,i,s,r,o=""){return c`<div class="mi-look">
    <div class="mi-look-title">${ui(e,n,t,d=>r(d),d=>i.find(([l])=>l===d)?.[1]??d)}</div>
    <div class="mi-pics ${o}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([d,l])=>{let u=d===n;return c`<button type="button" class="mi-pic ${u?"on":""}" aria-pressed=${u?"true":"false"} aria-label=${`${e}: ${l}`}
          @click=${()=>{d!==n&&r(d)}}>${s(d)}<span class="mi-pic-name">${l}</span></button>`})}
    </div>
  </div>`}function et(e,n,t,i,s){return c`<div class="mi-switch">${N(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function xa(e){return c`<div class="mi-wrap">${e}</div>`}function tt(e,n){return oe(e).find(t=>t.key===n)}function on(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function nt(e,n,t){return oe(n).some(i=>t.includes(i.key)&&Ke(e,n,i)&&!on(Z(e,n,i),i.default))}function Xe(e,n,t){let i=tt(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:Z(e.document,n,i),set:(r,o=!1)=>e.edit(a=>Ys(a,n,t,r),o?s:void 0)}}function an(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function it(e,n){return n===void 0?p:xe(e,an(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function Br(e,n,t,i){if(n===void 0)return p;let s=n.value===!0?"on":"off",r=n.field.default===!0?"on":"off";return qr(e,s,r,[["off",t[0]],["on",t[1]]],o=>i(o==="on"),o=>n.set(o==="on"))}var jr=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],Kr=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],Fr=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function ka(e){return c`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function Sa(e){return c`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function $a(e){if(e===void 0)return p;let n=an(e),t=(e.field.presets??Fr.map(([s,r])=>({value:s,label:r}))).map(s=>[String(s.value),Fr.find(([r])=>on(r,s.value))?.[1]??s.label]),i=t.find(([s])=>on(Number(s),n))?.[0]??"";return c`${V("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${it("Exact",e)}`}function zr(e){let n=i=>Xe(e,"quickAction",i),t=n("showContextLabel");return c`
    ${Br("Behind the ring",n("showIconBubble"),["Solid","Glass"],ka)}
    ${$a(n("backgroundDim"))}
    ${Br("Buttons",n("showNeonOutline"),["Plain","Neon"],Sa)}
    ${t===void 0?p:et("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${it("Glow",n("glowIntensity"))}`}function Jr(e){let n=t=>{let i=tt("quickAction",t);return i===void 0?void 0:Z(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function Ma(){let e=pe("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function Ta(e){let n=$``;switch(e){case"sectorWedge":n=$`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=$`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=$`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=$`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=$`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function Pa(e,n){if(n===void 0||!Ke(e.document,"quickAction",n.field))return p;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${de("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?p:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let r=s.toUpperCase()===t.toUpperCase();return c`<button type="button" class="ts-swatch ${r?"on":""}" aria-pressed=${r?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function Gr(e){let n=o=>Xe(e,"quickAction",o),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),r=n("showFingerShadow");return c`
    ${t===void 0?p:xa(V("Opening",String(t.value),pe("EntranceStyle"),o=>t.set(o),{def:String(t.field.default)}))}
    ${i===void 0?p:qr("Beam from your finger to the slot",String(i.value),String(i.field.default),Ma(),Ta,o=>i.set(o),"beams")}
    ${Pa(e,n("beamColor"))}
    ${s===void 0||!Ke(e.document,"quickAction",s.field)?p:it("Beam strength",s)}
    ${r===void 0?p:et("Finger shadow",r.value===!0,o=>r.set(o),r.field.default===!0,"A soft dark spot where your finger rests.")}`}function Yr(e){let n=s=>{let r=tt("quickAction",s);return r===void 0?"":String(Z(e,"quickAction",r))},t=(s,r)=>pe(s).find(([o])=>o===r)?.[1]??r,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var Zr=["glowIntensity","selectedScale"];function ge(e){return Math.round(e*1e3)/10}function Xr(e){let n=Xe(e,"pageSwitcher","glowIntensity"),t=Xe(e,"pageSwitcher","selectedScale");return c`${it("Glow",n)}
    ${t===void 0?p:xe("Picked page size",ge(an(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:ge(t.field.min??1),max:ge(t.field.max??1.5),step:ge(t.field.step??.05),def:ge(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function Qr(e){let n=tt("pageSwitcher","selectedScale"),t=n===void 0?void 0:Z(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(ge(t))}%`:""}function Qe(e,n,t,i){return e.render(n,t,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var eo=["light","switch","lock","cover","climate","media_player"],Ra={media_player:"Media player"};function to(e,n,t,i,s){let r=t.some(a=>a.domain===n),o=r?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let d=a.domain===n,l=Ra[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${d?"on":""}" aria-pressed=${d?"true":"false"} data-type=${a.domain}
          @click=${()=>{d||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${Qe(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${l}</span></button>`})}
    </div>
    ${G("More types",r?"":n,o,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function no(e,n,t,i){return c`<div class="mi-acts">${t.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(r=>{let o=r.raw===n,a=!o&&r.why!==void 0;return c`<button type="button" class="mi-act ${o?"on":""}" aria-pressed=${o?"true":"false"} ?disabled=${a} data-action=${r.raw}
        title=${r.why??p} @click=${()=>{o||i(r.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${Qe(e,r.icon,14,r.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${r.label}</span>
          ${r.why===void 0||o?p:c`<small class="mi-act-why">${r.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var Ca=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function Ur(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function io(e,n,t,i){let s=new Map(t.map(o=>[o.position,o])),r=o=>{if(o===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(o);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let d=a.here?"here":a.holder===void 0?"free":"held",l=a.here?Qe(e,n.icon,14,n.color):a.holder===void 0?M("plus"):Qe(e,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${d}" data-place=${o} aria-label=${Ur(a)} title=${Ur(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:p}
      @click=${()=>{a.here||i(o)}}>${l}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${Ca.map(o=>o.map(r))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var so=z`
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
`;var co=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],lo="Each page's icon, color and name are set here: pick a page in the Pages card.",Ea="Pick a page in the Pages card to set how it shows here.",Ia={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},uo={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:lo},La="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Ha="Click a slot or its label to edit it. Click anywhere else for the menu's look.",ye=.36,ln=44,un=22;function po(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function Oa(e,n,t=ye){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=r=>Math.round(r*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var ho="wrist-assistant-panel.menus.zoom.v1";function mo(e=mt()){try{let n=e?.getItem(ho);if(n==null||n==="")return;let t=Number(n);return Oi.includes(t)?t:void 0}catch{return}}function fo(e,n=mt()){try{n?.setItem(ho,e===void 0?"":String(e))}catch{}}var go={name:{color:D.place,icon:"text"},slot:{color:D.content,icon:"content"},where:{color:D.position,icon:"place"},look:{color:D.look,icon:"look"},shows:{color:D.states,icon:"states"},menu:{color:D.content,icon:"content"},style:{color:D.look,icon:"look"},motion:{color:D.look,icon:"radial"},switcherPage:{color:D.content,icon:"watch"}},Aa="#26a69a",Da=D.complication,A="menu-editor";function Te(e,n,t){return`${e} ${e===1?n:t}`}function we(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function wo(e,n){return{entityId:n,displayName:n===""?"":we(e,n),domain:Ve(n)}}function Re(e,n,t,i){return e.icons.render(n,t,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function _(e){return ue(T(e))===void 0?{icon:ke.unknownActionIcon,color:ke.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function bo(e){let n=T(e);if(n==="triggerEntity"){let i=Se(e).entityId;return _t(Ve(typeof i=="string"?i:""))}let t=ue(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function C(e,n){return e.toUpperCase()===n.toUpperCase()}function Na(e,n){return e.toUpperCase()===n.toUpperCase()}function _a(e,n){let t=T(n),i=Se(n),s=ue(t);for(let r of s?.payload??[]){let o=i[r.key];if(!(typeof o!="string"||o==="")){if(r.type==="entity")return we(e.hass,o);if(r.target==="page")return e.targets.pages.find(a=>C(a.id,o))?.name??"A page not in the pages";if(r.target==="statusPage")return e.targets.statusPages.find(a=>C(a.id,o))?.name??"A status page";if(r.target==="httpAction")return e.targets.httpActions.find(a=>C(a.id,o))?.name??"An HTTP action";if(r.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(d=>C(d.id,o))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function ae(e,n){return _a(e,n)??re(T(n))}function be(e){return $e(e)?.label??e}var yo="me:menu",vo="me:er:mode",xo="me:er:domain",dn="me:er:entity",cn="me:er:add";function P(e){let n=e.uiState.get(yo);return n==="entity"||n==="switcher"?n:"anywhere"}function ko(e,n){n!==P(e)&&e.uiState.delete(Pe),e.uiState.set(yo,n),e.requestUpdate()}function So(e,n){for(let t of[...e.uiState.keys()])t.startsWith(Eo)&&e.uiState.delete(t);e.uiState.delete(Pe),ko(e,n)}var Pe="me:sw:page";function $o(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function te(e){if(P(e)!=="switcher")return;let n=e.uiState.get(Pe);if(typeof n=="string")return $o(e).find(t=>C(t.id,n))}function pn(e,n){n===void 0?e.uiState.delete(Pe):e.uiState.set(Pe,n),e.requestUpdate()}function Mo(e){let n=te(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function hn(e){return co.find(([n])=>n===e)?.[1]??e}function To(e){return e.uiState.get(vo)==="entity"?"entity":"domain"}function Po(e){let n=e.uiState.get(xo);return typeof n=="string"&&$e(n)!==void 0?n:"light"}function Ro(e){let n=Me(e.document),t=e.uiState.get(dn);return typeof t=="string"&&n.includes(t)?t:n[0]}function q(e){switch(P(e)){case"anywhere":return Be;case"entity":return mn(e);case"switcher":return}}function mn(e){if(To(e)==="domain")return{list:"domain",domain:Po(e)};let n=Ro(e);return n===void 0?void 0:{list:"entity",entityId:n}}function Co(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${be(n.domain)} menu`:`${we(e.hass,n.entityId)} menu`}var Eo="me:sel:";function Io(e){return`${Eo}${Is(e)}`}function ce(e,n){let t=e.uiState.get(Io(n));if(typeof t=="string")return B(e.document,n).find(i=>C(R(i),t))}function ve(e,n,t){e.uiState.set(Io(n),t),e.requestUpdate()}function Ce(e){if(te(e)!==void 0)return pn(e,void 0),!0;let n=q(e);return n===void 0||ce(e,n)===void 0?!1:(ve(e,n,void 0),!0)}function st(e,n,t){let i;e.edit(s=>{let r=Ns(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=r.id,r.document}),i!==void 0&&ve(e,n,i)}function ro(e){let t=(i,s)=>Math.round((s+(i-.5)/ye*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${ln} ${un}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>$`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function Wa(e,n){return n===void 0?[]:B(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=qe(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:_(t).color}]})}function Va(e,n){if(n==="switcher")return Te(e.switcherPages.length,"page","pages");let t=n==="anywhere"?Be:mn(e);return t===void 0?"none yet":Te(B(e.document,t).length,"slot","slots")}function Ba(e,n){if(n==="switcher"){let t=e.switcherPages;return ro(t.map((i,s)=>({...Oa(s,t.length),color:i.color})))}return ro(Wa(e,n==="anywhere"?Be:mn(e)))}var Fa="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function Lo(e){let n=P(e);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${ln}px; --thumb-h: ${un}px`}>
    <div class="lc-head">
      <span class="swatch">${M("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${La}>on the watch</span>
    </div>
    <p class="me-intro">${Fa}</p>
    <div class="layers me-menu-list" role="list">
      ${co.map(([t,i])=>{let s=t===n,r=()=>{s||ko(e,t)},o=e.menuBadge?.(t);return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${uo[t]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          ${Ba(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${Va(e,t)}</span>${o===void 0?p:c`<span class="badge me-named" title=${`This device uses "${o}"`}>${o}</span>`}</b><small>${Ia[t]}</small>
            ${e.menuFoot?.(t)??p}</span>
        </div>`})}
    </div>
  </section>`}function Ua(e,n,t){return c`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${Re(e,n,14,t)}</span></span>`}function oo(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${be(n.domain)} menu, by type`:`${we(e.hass,n.entityId)}'s own menu`}function qa(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function ja(e,n,t){let i=t!==void 0&&C(t.id,n.id),s=qa(n),r=()=>pn(e,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${o=>{o.target instanceof Element&&o.target.closest("button")||r()}}
    @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Ua(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function Ka(e){let n=$o(e),t=te(e),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${ln}px; --thumb-h: ${un}px`}>
    <div class="lc-head">
      <span class="swatch">${M("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${Te(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>ja(e,s,t))}</div>`}
  </section>`}function Ho(e){return P(e)==="switcher"?Ka(e):p}function Oo(e){if(P(e)==="switcher")return[Te(e.switcherPages.length,"page","pages")];let n=q(e);if(n===void 0)return[oo(e,n)];let t=Te(B(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[oo(e,n),t]}function Ao(e){return P(e)==="switcher"?lo:q(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Ha}function Do(e,n){return Ni(e.uiState,A,n)}function za(e,n){_i(e.uiState,A,n,!Do(e,n)),e.requestUpdate()}function Ja(e){if(Mo(e)!==void 0)return[{module:A,section:"switcher-page"}];let n=q(e),t=n===void 0?void 0:ce(e,n);if(t!==void 0)return[{module:A,section:"slot"},{module:A,section:"where"},...Nr(t)?[{module:A,section:"voice"}]:[],{module:A,section:"look"},...n?.list==="anywhere"?[{module:A,section:"shows"}]:[]];let i=P(e);return i==="anywhere"?[{module:A,section:"style-anywhere"},{module:A,section:"motion-anywhere"}]:[{module:A,section:i==="entity"?"menu":`style-${i}`}]}function U(e,n,t,i,s,r={}){let o=Do(e,t),a=go[n];return Un({color:a.color,icon:M(a.icon),title:i,open:o,onToggle:()=>za(e,t),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${A}:${t}`},o?s:c``)}function No(e){let n=P(e),t=hn(n),i=q(e),s=i===void 0?void 0:ce(e,i),r=Ja(e),o=Wi(e.uiState,r),a=te(e),d=Mo(e),l,u;if(a!==void 0&&d!==void 0)l=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>pn(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Da}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=Ga(e,d);else if(s===void 0||i===void 0)l=c`<div class="crumbs"><span class="kchip" style=${`--k:${Aa}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=yc(e,n);else{let g=ae(e,s);l=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>ve(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${_(s).color}`}>Slot</span><span class="nm" title=${g}>${g}</span></div>`,u=mc(e,i,s)}return c`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{Vi(e.uiState,r,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function Ga(e,n){let t=n.page;return U(e,"switcherPage","switcher-page",Qt,c`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Qt}>${Cr(n)}</fieldset>`,{summary:Rr(t),dot:Pr(t)})}var Ya={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function _o(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Ya[n.key]??n.key}var Za={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function Wo(e){return re(e).replace(/ - (.+)$/," ($1)")}function Xa(e,n){if(n==="entityControl"){let t=Ls(e)??"all";return t==="all"?"Any entity":be(t)}return Za[n]??Ms(n)}function Qa(e,n,t){let i=T(t),s=As(n),r=a=>{let d=ue(a),l=d===void 0?{icon:ke.unknownActionIcon,color:ke.unknownActionColor}:d,u=a===i?void 0:Ts(a,e.targets);return{raw:a,label:Wo(a),icon:l.icon,color:l.color,...u===void 0?{}:{why:u}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[r(i)]}],...s.map(a=>({heading:Xa(n,a.category),tiles:a.actions.map(r)}))]}function ec(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function ao(){return c`<button type="button" class="link" @click=${Mr}>Open HTTP actions</button>`}function tc(e,n,t){let i=n.find(s=>C(s.id,t));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${ao()}</div>`:e.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${os} ${ao()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function nc(e,n,t,i,s){let r=R(t),o=Se(t)[s.key],a=typeof o=="string"?o:"",d=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||d.some(m=>C(m.id,a)),u=m=>e.edit(x=>Ft(x,n,r,s.key,m===""?void 0:m)),g=s.target==="statusPage"&&e.statusPagesKnown===!0,w=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,h=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":g?`Not in this ${J(e.device??"watch")}'s status pages`:w?rs:ns,f=m=>s.target==="httpAction"?ec(m):m.name;return c`<label class="field"><span>${_o(i,s)}</span>
    <select .value=${Ae(d.find(m=>C(m.id,a))?.id??a)} @change=${m=>u(m.target.value)}>
      ${s.required===!0?p:c`<option value="" ?selected=${a===""}>None</option>`}
      ${l?p:c`<option value=${a} selected>${h}</option>`}
      ${d.map(m=>c`<option value=${m.id} ?selected=${C(m.id,a)}>${f(m)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.device==="iphone"?c`<div class="hint ts-under">${Qs}</div>`:e.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:s.target==="statusPage"?g||e.catalogKnown?p:c`<div class="hint ts-under">${Le("status pages",e.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?tc(e,e.targets.httpActions,a):p}`}function ic(e,n,t,i,s){let r=R(t),o=Se(t),a=(u,g)=>e.edit(w=>Ft(w,n,r,s.key,u),g),d=_o(i,s),l=Ut(t,s);switch(s.type){case"entity":{let u=typeof o[s.key]=="string"?o[s.key]:"",g=i==="runScene"?"scene":i==="runScript"?"script":Rs();return c`<div class="ts-stack">${bt({hass:e.hass},d,wo(e.hass,u),w=>a(w.entityId),`me:entity:${r}`,{domain:g,clearable:!1,needed:u===""})}</div>
        ${u===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return nc(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let w=Ve(typeof o.entityId=="string"?o.entityId:""),h=Ps(w),f=typeof l=="string"?l:h[0]??"",m=h.map(x=>[x,Nt(x)]);return h.includes(f)||m.unshift([f,Nt(f)]),G(d,f,m,x=>a(x),{snapBack:!0})}let u=pe(s.enum),g=typeof l=="string"?l:String(s.default??"");return u.length<=4?V(d,g,u,w=>a(w)):G(d,g,u,w=>a(w),{snapBack:!0})}case"bool":return N(d,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&Ut(t,{key:"showBanner",type:"bool",default:!0})===!1)return p;let u=typeof o[s.key]=="number"?o[s.key]:void 0;return fi(d,u,g=>a(g,`slot:${r}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function sc(e,n,t){if(!Vt(n,t))return p;let i=R(t);return c`<div class="ts-stack">${V("Skip conditions",nr(Bt(t)),tr,s=>e.edit(r=>Bs(r,n,i,ir(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function rc(e){let n=je(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(be).join(", ")}function oc(e,n){let t=R(n),i=je(n),s=i===void 0,r=d=>e.edit(l=>Ks(l,t,d)),o=js(),a=(i??[]).filter(d=>!qt(d));return c`<div class="mi-wrap">${V("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],d=>r(d==="every"?void 0:o.slice(0,1)),{def:"every"})}</div>
    ${s?p:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...o,...a].map(d=>{let l=i.includes(d),u=!qt(d);return c`<button type="button" class="pe-chip ${l?"on":""} ${u?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${u?"Not reported by the watch":p}
          @click=${()=>r(l?i.filter(g=>g!==d):[...i,d])}>${be(d)}</button>`})}
    </div>
    ${a.length===0?p:c`<div class="hint warn">${a.map(be).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function ac(e,n){return Vt(n,e)&&Bt(e)!==null}function cc(e){return e.isVisible===!1}function dc(e){return je(e)!==void 0}function lc(e){let n=bo(e);if(n===void 0)return!1;let t=_(e);return t.icon!==n.icon||!Na(t.color,n.color)}function uc(e,n){let t=go.name;return c`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${M(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${ae(e,n)}</span>
    </div>
  </section>`}function pc(e){let n=Y(e);return n.charAt(0)+n.slice(1).toLowerCase()}function hc(e,n,t){let i=R(t),s=B(e.document,n).filter(r=>!C(R(r),i));return Ue().map(r=>{let o=s.find(d=>d.position===r),a={position:r,label:pc(r),here:t.position===r};return o!==void 0&&(a.holder={name:ae(e,o),..._(o)}),a})}function mc(e,n,t){let i=R(t),s=T(t),r=ue(s),o=_(t),a=bo(t),d=typeof t.position=="string"?t.position:"",l=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${r===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${no(e.icons,s,Qa(e,n,t),h=>e.edit(f=>qs(f,n,i,h,e.targets)))}
    ${r?.description?c`<div class="mi-desc">${r.description}</div>`:p}
    ${Ds(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(r?.payload??[]).map(h=>ic(e,n,t,s,h))}
    ${sc(e,n,t)}
  </fieldset>`,u=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${io(e.icons,o,hc(e,n,t),h=>e.edit(f=>Ws(f,n,i,h)))}
    ${N("Shown on the watch",t.isVisible!==!1,h=>e.edit(f=>Vs(f,n,i,h)),!0)}
  </fieldset>`,g=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${De({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",h=>e.edit(f=>Fs(f,n,i,h),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${de("Color",typeof t.color=="string"?t.color:void 0,h=>{h!==void 0&&e.edit(f=>Us(f,n,i,h),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,w=Wr(e,n,t);return c`${uc(e,t)}
    ${U(e,"slot","slot","What it does",l,{summary:Wo(s),dot:ac(t,n)})}
    ${U(e,"where","where","Where",u,{summary:`${Y(d)}${t.isVisible===!1?", hidden":""}`,dot:cc(t)})}
    ${w===void 0?p:U(e,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${w}</fieldset>`,{summary:Vr(e,t),dot:Dr(t)})}
    ${U(e,"look","look","Icon and color",g,{summary:o.icon,dot:lc(t)})}
    ${n.list==="anywhere"?U(e,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${oc(e,t)}</fieldset>`,{summary:rc(t),dot:dc(t)}):p}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(h=>_s(h,n,i))}>${M("delete")}<span>Remove</span></button>
    </div>`}function fc(e){let n=nt(e.document,"quickAction",jr),t=nt(e.document,"quickAction",Kr);return c`${U(e,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${zr(e)}
    </fieldset>`,{summary:Jr(e.document),dot:n})}
    ${U(e,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${Gr(e)}
    </fieldset>`,{summary:Yr(e.document),dot:t})}`}function gc(e){let n=nt(e.document,"pageSwitcher",Zr);return U(e,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${Xr(e)}
  </fieldset>`,{summary:Qr(e.document),dot:n})}function wc(e){let n=To(e),t=a=>{e.uiState.set(vo,a),e.requestUpdate()},i=V("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,r,o=!1;if(n==="domain"){let a=Po(e),d=$e(a),l=Es(a),u=Cs().map(h=>[h.domain,h.label]),g=eo.flatMap(h=>{let f=$e(h);return f===void 0?[]:[{domain:f.domain,label:f.label,icon:f.icon,color:_t(f.domain).color}]}),w=d?.inheritKey?Hs(e.document,a):!1;o=w,r=`By type \xB7 ${d?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${to(e.icons,a,g,u,h=>{e.uiState.set(xo,h),e.requestUpdate()})}
      ${l.length>0?c`<div class="hint ts-under keep">The same menu as ${l.map(h=>h.label).join(", ")}.</div>`:p}
      ${d?.inheritKey?et("Fill gaps with the All menu",w,h=>e.edit(f=>zs(f,a,h)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):p}`}else{let a=Me(e.document),d=Ro(e);r=`By entity \xB7 ${d===void 0?"none yet":we(e.hass,d)}`;let l=u=>{let g=u.entityId.trim();g!==""&&(e.edit(w=>Js(w,g)),e.uiState.set(dn,g),e.uiState.set(cn,(Number(e.uiState.get(cn)??0)||0)+1),e.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(u=>{let g=u===d;return c`<div class="me-entity ${g?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${g?"true":"false"}
            @click=${()=>{e.uiState.set(dn,u),e.requestUpdate()}}>
            <b>${we(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(w=>Gs(w,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${bt({hass:e.hass},"Add an entity",wo(e.hass,""),l,`me:er:add:${String(e.uiState.get(cn)??0)}`,{clearable:!1})}
      </div>
    </div>`}return U(e,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:r,dot:o})}var bc="Click a slot on the watch to change what it does.";function yc(e,n){let t=n==="anywhere"?fc(e):n==="switcher"?gc(e):wc(e);return c`<p class="me-menu-note">${uo[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?Ea:bc}</p>`}var Vo=z`
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
`;var vc=["spring","popIn","fade","none"],xc=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Ee(e,n,t){let i=oe(n).find(s=>s.key===t);return i===void 0?void 0:Z(e,n,i)}function Ie(e,n,t,i){let s=oe(n).find(a=>a.key===t),r=Ee(e,n,t),o=typeof r=="number"&&Number.isFinite(r)?r:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,o))}function rt(e,n){return Ee(e,"quickAction",n)===!0}function kc(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function ot(e){let n=Ee(e,"quickAction","entranceStyle"),t=Ee(e,"quickAction","beamStyle");return{glass:rt(e,"showIconBubble"),neon:rt(e,"showNeonOutline"),labels:rt(e,"showContextLabel"),finger:rt(e,"showFingerShadow"),entrance:vc.includes(n)?n:"none",dim:Ie(e,"quickAction","backgroundDim",1),beam:xc.includes(t)?t:"none",beamColor:kc(Ee(e,"quickAction","beamColor")),beamIntensity:Ie(e,"quickAction","beamIntensity",.5),glow:Ie(e,"quickAction","glowIntensity",.5)}}function Sc(e){return{glow:Ie(e,"pageSwitcher","glowIntensity",.5),scale:Ie(e,"pageSwitcher","selectedScale",1.2)}}var gn="ms:play",$c=1500;function Mc(e){let n=e.uiState.get(gn);e.uiState.set(gn,{menu:P(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function Tc(e){let n=e.uiState.get(gn);return n===void 0||n.menu!==P(e)||Date.now()-n.at>$c?"":n.count%2===1?"ms-play-a":"ms-play-b"}function Uo(e,n){let t=B(e,n),i=Os(e,n),s=new Set(Wt(e,n));return Ue().map(r=>{let o=t.filter(u=>u.position===r),a=o.find(u=>u.isVisible!==!1),d=a===void 0?i.find(u=>u.position===r&&u.isVisible!==!1):void 0,l=a??(d===void 0?o[0]:void 0);return{position:r,own:o,main:l,second:o.find(u=>u!==l),shared:d,free:s.has(r)}})}function Pc(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=R(n),r=e.find(o=>o.main!==void 0&&C(R(o.main),s));if(r!==void 0)return{position:r.position,slot:n}}let i=e.flatMap(s=>{let r=t(s.main)?s.main:s.shared;return r===void 0?[]:[{position:s.position,slot:r}]});return i.find(s=>s.position==="topCenter")??i[0]}var v=e=>Math.round(e*100)/100;function bn(e,n){let t=po(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function fn(e,n,t,i){return qo(e,n,bn(e.screen,t),i)}function qo(e,n,t,i){let{width:s,height:r}=e.screen,o=e.scale,a=[`left:${t.x*100}%`,`top:${t.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${v((s/2-t.px)*o)}px`,`--fy:${v((r/2-t.py)*o)}px`),n.finger){let d=t.px-s/2,l=t.py-r/2,u=Math.hypot(d,l);u>1&&a.push(`--sx:${v(d/u*5*o)}px`,`--sy:${v(l/u*5*o)}px`)}return a.join(";")}function wn(e,n){return Math.round(n*e.scale)}function Rc(e,n,t,i,s){let r=bn(e.screen,t),o=(n.glass?28:25)*(r.y>.5?-1:1),a=(r.py+o)/e.screen.height;return c`<span class="ms-name" aria-hidden="true" style=${`left:${r.x*100}%;top:${v(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function Cc(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,r=t*.18,o=(n-i*2-s)/2,a=(t-r-i-s*2)/3,d=[0,1,2,3,4,5].map(l=>{let u=i+l%2*(o+s),g=r+Math.floor(l/2)*(a+s);return $`<rect class=${`ms-tile t${l%4}`} x=${v(u)} y=${v(g)} width=${v(o)} height=${v(a)} rx=${v(n*.06)}></rect>`});return c`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${v(i)} y=${v(t*.075)} width=${v(n*.4)} height=${v(t*.045)} rx=${v(t*.0225)}></rect>
    ${d}
  </svg>`}function ne(e,n,t){return $`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function Bo(e,n,t,i){return $`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${v(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${v(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function Ec(e,n,t){if(e.beam==="none")return p;let i=e.beamColor,s=e.beamIntensity,r=n.width/2,o=n.height/2,a=t.x-r,d=t.y-o,l=Math.hypot(a,d),u=Math.atan2(d,a),g=(m,x)=>`${v(r+Math.cos(u+m)*x)},${v(o+Math.sin(u+m)*x)}`,w=v(t.x),h=v(t.y),f;switch(e.beam){case"sectorWedge":{let m=Math.PI/4;f=$`${ne("ms-b8",8,n)}${ne("ms-b3",3,n)}
        <polygon points=${`${r},${o} ${g(-m/2,l*1.2)} ${g(m/2,l*1.2)}`} fill=${i} fill-opacity=${v(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${r},${o} ${g(-m*.3,l)} ${g(m*.3,l)}`} fill=${i} fill-opacity=${v(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":f=$`${ne("ms-b7",7,n)}${ne("ms-b10",10,n)}${Bo("ms-wash",i,.35*s,.18*s)}
        <circle cx=${v((r+t.x)/2)} cy=${v((o+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${w} cy=${h} r="40" fill=${i} fill-opacity=${v(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":f=$`${ne("ms-b4",4,n)}${ne("ms-b5",5,n)}${Bo("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${w} cy=${h} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${w} cy=${h} r="25" fill=${i} fill-opacity=${v(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":f=$`${ne("ms-b6",6,n)}
        <circle cx=${w} cy=${h} r="30" fill=${i} fill-opacity=${v(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(m=>$`<circle cx=${w} cy=${h} r=${v((30+m*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${v((1-m)*.45*s)} stroke-width=${v(2-m*1.2)}></circle>`)}`;break;case"wakeWave":f=$`${ne("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${r} y1=${o} x2=${w} y2=${h}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${v(.5*s)}></stop></linearGradient>
        <line x1=${r} y1=${o} x2=${w} y2=${h} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(m=>{let x=1-m;return $`<circle cx=${v(r+a*m)} cy=${v(o+d*m)} r=${v((20+x*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${v((1-x)*.5*s)} stroke-width=${v(Math.max(1.5-x*1.2,.3))}></circle>`})}
        <circle cx=${w} cy=${h} r="18" fill=${i} fill-opacity=${v(.25*s)} filter="url(#ms-b4)"></circle>`;break}return $`<g class="ms-beam">${f}</g>`}function Ic(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":Tc(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${v(n.dim*.85)}`,`--ms-blur:${v(2+n.dim*4)}px`,`--ms-g-r:${v(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function yn(e,n,t,i,s={}){let{width:r,height:o}=e.screen,a=e.scale,d=Math.min(r,o),l=Ic(e,t),u=[`width:${Math.round(r*a)}px;height:${Math.round(o*a)}px;--me-s:${a}`,l.style,s.style??""].filter(w=>w!=="").join(";"),g=c`<div class=${`me-screen ms-screen ${l.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${u}>
    <div class="ms-backdrop" aria-hidden="true">${Cc(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${r} ${o}`} aria-hidden="true">
      ${s.beamTo===void 0?p:Ec(t,e.screen,s.beamTo)}
      <circle cx=${r/2} cy=${o/2} r=${d*ye} class="me-track"></circle>
      ${t.finger?$`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${r/2} cy=${o/2} r=${v(d*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:p}
      <circle cx=${r/2} cy=${o/2} r=${d*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return zi(e.phone,{width:r,height:o},a,g,n,e.icons)}function Lc(e,n,t,i){let s=ot(e.document),r=Uo(e.document,n),o=Pc(r,t),a=o===void 0?void 0:R(o.slot),d=t===void 0?void 0:R(t),l=(m,x=ye)=>qe(m,x),u=m=>a!==void 0&&C(R(m),a),g=(m,x,O,S,I)=>{let H=_(m),j=R(m),E=d!==void 0&&C(j,d),ie=m.isVisible===!1,Pn=`${Y(x)}: ${re(T(m))}${ie?", hidden":""}`,ia=["me-dot",S,E?"on":"",ie?"off":"",u(m)&&S===""?"ms-active":""].filter(sa=>sa!=="").join(" ");return c`<button type="button" class=${ia} style=${fn(e,s,O,H.color)}
      title=${Pn} aria-label=${Pn} aria-pressed=${E?"true":"false"} @click=${()=>ve(e,n,j)}>
      ${Re(e,H.icon,wn(e,S===""?15:11),H.color)}${I>1?c`<span class="me-count" aria-hidden="true">${I}</span>`:p}</button>`},w=r.map(m=>{let x=l(m.position);if(x===void 0)return p;let O=p,S;if(m.main!==void 0)O=g(m.main,m.position,x,"",m.own.length),m.main.isVisible!==!1&&(S=m.main);else if(m.shared!==void 0){let E=_(m.shared),ie=`${Y(m.position)}: ${re(T(m.shared))}, from All`;O=c`<span class=${`me-dot inh${u(m.shared)?" ms-active":""}`} style=${fn(e,s,x,E.color)} title=${ie}>
        ${Re(e,E.icon,wn(e,13),E.color)}</span>`,S=m.shared}else if(m.free){let E=Y(m.position);O=c`<button type="button" class="me-dot free" style=${fn(e,s,x)} ?disabled=${e.busy}
        title=${`Add a slot at ${E}`} aria-label=${`Add a slot at ${E}`}
        @click=${()=>st(e,n,m.position)}>${M("plus")}</button>`}let I=m.second===void 0?void 0:l(m.position,.2),H=m.second===void 0||I===void 0?p:g(m.second,m.position,I,"two",0),j=s.labels&&S!==void 0?Rc(e,s,x,_(S).color,ae(e,S)):p;return c`${O}${H}${j}`}),h=o===void 0?void 0:l(o.position),f=bn(e.screen,h??{x:.5,y:.5-ye});return yn(e,`${i} on the watch`,s,w,{beamTo:{x:f.px,y:f.py}})}function jo(e){let n=t=>Math.min(1.18,Math.max(.82,t));return{w:n(e.width/198),h:n(e.height/242)}}function Fo(e,n,t){let{width:i,height:s}=e,r=jo(e),o=34*r.w,a=i-34*r.w,d=52*r.h,l=s-30*r.h,u=(d+l)/2,g=i/2,w=18*r.w,h=8*r.h,f=[{x:g,y:d-14*r.h},{x:o+w,y:d+h},{x:o,y:u},{x:o+w,y:l-h},{x:g,y:l+8*r.h},{x:a-w,y:l-h},{x:a,y:u},{x:a-w,y:d+h}];if(t<=1)return f[0];let m=[0];for(let S=1;S<=f.length;S++){let I=f[S-1],H=f[S%f.length];m.push(m[S-1]+Math.hypot(H.x-I.x,H.y-I.y))}let x=m[f.length],O=n*x/t%x;for(let S=0;S<f.length;S++){let I=m[S],H=m[S+1];if(O>=I&&O<=H){let j=H>I?(O-I)/(H-I):0,E=f[S],ie=f[(S+1)%f.length];return{x:E.x+(ie.x-E.x)*j,y:E.y+(ie.y-E.y)*j}}}return f[0]}function Hc(e){return[...e].slice(0,4).join("").trim()}function Oc(e){let n=ot(e.document),t=Sc(e.document),i=e.switcherPages,s=te(e),r=Math.max(0,s===void 0?0:i.findIndex(h=>C(h.id,s.id))),{width:o,height:a}=e.screen,d=h=>({x:h.x/o,y:h.y/a,px:h.x,py:h.y}),l=i.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((h,f)=>{let m=d(Fo(e.screen,f,i.length)),x=f===r,O=f===0&&!x,S=Math.round((x?.7:O?.4:.15)*t.glow*100),I=[qo(e,n,m,h.color),`--ms-ga:${S}%`,`--ms-gr:${x?45:30}`,`--ms-k:${x?t.scale:1}`].join(";"),H=["ms-sw",x?"ms-active":"",O?"ms-current":""].filter(E=>E!=="").join(" "),j=h.text===void 0?Re(e,h.icon,wn(e,n.glass?18:x?16:14),x&&!n.glass?"white":h.color):c`<span class="ms-sw-text">${Hc(h.text)}</span>`;return c`<span class=${H} style=${I} title=${h.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${j}</span>`}),u=i[r],g=u===void 0?p:c`<span class="ms-sw-name" style=${`top:${v(8*jo(e.screen).h/a*1e4)/100}%`}>${u.name}</span>`,w=i.length===0?void 0:Fo(e.screen,r,i.length);return yn(e,"Page switcher on the watch",n,c`${l}${g}`,{beamTo:w,classes:"ms-switcher"})}function Ac(e){if(P(e)==="switcher")return Oc(e);let n=q(e);return n===void 0?yn(e,"Entity quick menu on the watch",ot(e.document),c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):Lc(e,n,ce(e,n),Co(e,n))}var Dc={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function Nc(e,n,t,i){let s=R(t),r=i!==void 0&&C(s,R(i)),o=t.isVisible===!1,a=ae(e,t),d=`${re(T(t))}${o?", hidden":""}`;return c`<button type="button" class=${`ms-label${r?" on":""}${o?" off":""}`} data-slot=${s}
    style=${`--k:${_(t).color}`} aria-pressed=${r?"true":"false"}
    @click=${()=>ve(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${d}</small></span></button>`}function _c(e,n,t,i){let s=Y(t.position),r=t.own.map(o=>Nc(e,n,o,i));return t.shared!==void 0&&r.push(c`<span class="ms-label ms-inh" style=${`--k:${_(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${ae(e,t.shared)}</b><small>From the All menu</small></span></span>`),r.length===0&&t.free&&r.push(c`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>st(e,n,t.position)}>${M("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),c`<div class=${`ms-place ms-at-${t.position} ms-${Dc[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${r}</div>`}function Ko(e){let n=Ac(e),t=P(e)==="switcher"?void 0:q(e);if(t===void 0)return c`<div class="me-stage-body">${n}</div>`;let i=ce(e,t);return c`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${Uo(e.document,t).map(s=>_c(e,t,s,i))}
  </div></div>`}var Wc=c`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function zo(e){let n=P(e),t=ot(e.document),i=p;if(n!=="switcher"){let r=q(e),o=r===void 0?[]:Wt(e.document,r),a=r===void 0?"Add an entity first, in the menu's settings.":o.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=c`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||r===void 0||o.length===0}
      title=${a} @click=${()=>{r!==void 0&&st(e,r)}}>${M("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?p:c`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>Mc(e)}>${Wc}<span class="word">Play opening</span></button>`;return i===p&&s===p?c``:c`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function Jo(e){if(P(e)!=="entity")return p;let n=q(e);return n===void 0||ce(e,n)===void 0?p:c`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Ce(e)}>Change the type or entity</button></span>`}var Vc={anywhere:{gesture:"hold",open:"Touch and hold an empty spot on any page, slide to a slot, then lift your finger.",use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to a slot, then lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"hold",open:"Open the Anywhere menu and slide to its Pages slot. Then slide to a page and lift your finger.",use:"Jumping straight to any page. It needs a Pages slot in the Anywhere menu. Pick a page in the Pages card to set how it shows here."}};function Go(e){let n=Vc[P(e)];return Sr({art:n.gesture,label:"How it opens",how:n.open,use:n.use})}var Yo=z`
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
`;function vn(e){if(e.length===0)return"";let n=e.map(i=>Xs(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Zo(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${vn(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${ti}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function ta(){return vr()||dr()}Ss({dirty:ta,drop:()=>{xr(),lr()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{ta()&&(e.preventDefault(),e.returnValue="")});var Bc=15e3,na=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),xn=na?"\u2318":"Ctrl+",kn={min:200,max:720,middleMin:320},Sn={left:280,right:320},$n="wrist-assistant-panel.menus.columns.v1",Fc="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",Uc=24,Xo=820,qc=600;function jc(e){return e==="entity"?"entity":"anywhere"}function Mn(e){return Oe(e).message}function at(e){return Oe(e).code}function ct(e){let{code:n,message:t}=Oe(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function Kc(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function zc(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":An(Math.max(0,(Date.now()-n)/1e3))}function Jc(e){return e instanceof HTMLElement?Ri(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Gc(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function Yc(e){return se(e)?xt(e).filter(n=>!St(n)&&$s(Ne(n))).map(n=>({id:Ne(n),name:kt(n)})):[]}var Qo=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function dt(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var Zc="#8E8E93";function Tn(e){if(!se(e))return[];let n=0;return xt(e).filter(t=>!Li(t)&&!St(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=kt(t),r=dt(t.switcherIcon)??dt(Ii(t)[0]?.icon)??(Hi(t)?"bolt.fill":"square.grid.2x2.fill"),o=i?Zc:Qo[n++%Qo.length],a=dt(t.switcherColor)??o,d=t.switcherDisplayMode==="icon"?void 0:dt(t.switcherText)??s;return{id:Ne(t),name:s,icon:r,color:a,...d===void 0?{}:{text:d},hidden:i}})}function Ul(e){return Tn(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var ea={ok:0,warn:1,err:2};function Xc(e,n){return e===void 0?n:n===void 0?e:{kind:ea[n.kind]>ea[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function Qc(e){let n=We(e)??{},t=B(n,{list:"anywhere"}).length,i=Me(n).length;return`Anywhere menu: ${(r=>`${r} ${r===1?"slot":"slots"}`)(t)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var b=class extends Rn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new Xn(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.lib=new ps(this,()=>this.hass,()=>this.linkDevices.map(t=>t.ownerId));this.copying=!1;this.zoom=mo();this.columns={...Sn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new bi(this);this.symbols=new oi(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t),this.lib.store?.refresh())};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!Gc()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(s&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!Jc(i[0])){if(s&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let o=this.viewHost();o!==void 0&&Ce(o)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(Fc)))return;let o=this.viewHost();o!==void 0&&Ce(o)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=t.composedPath(),s=(...r)=>i.some(o=>o instanceof HTMLElement&&r.some(a=>o.classList.contains(a)));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(pi,this.onScrubStart),this.addEventListener(hi,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return zn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return br(this.watches,this.watchId)?"iphone":"watch"}get draft(){let t=this.watchId,i=this.record;if(!(t===void 0||i===void 0)){if(i.revision>0){let s=K(t);if(s!==void 0)return s;let r=We(i.document);return r===void 0?void 0:Gt(t,r,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return K(t)??Yt(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return zt(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return Yc(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(K(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return te({uiState:this.uiState,switcherPages:[],switcherRows:Tn(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=si($n,Sn,kn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++,this.flushRename()}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Cn(this.hass).then(r=>{this.ownList=r.owners},()=>{this.ownList=[]}));let s=Zn(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),ki(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let o=()=>this.pagesSaveEnded(t);i.then(o,o)}let s=K(t)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let r=()=>this.saveEnded(t);s.then(r,r)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,i=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.flushRename(),this.libNote=void 0,this.endScrub(),this.uiState.clear(),i=!1);let s=kr(t);s!==void 0&&So({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},s),this.startSubscription(t),this.load(t,i),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let r=await W(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=sr(r)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Kt(t),defaults:rr(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let r=await W(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=is(r)}catch(r){if(s!==this.catalogSeq||t!==this.watchId)return;Ht(r)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await On(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=ci(s)}catch(s){if(i!==this.httpLibrarySeq)return;di(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let r=await W(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=ss(r)}catch(r){if(s!==this.statusPagesSeq||t!==this.watchId)return;Ht(r)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let r=await W(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:r.revision,document:r.document},r.revision>0&&se(r.document)&&!(zt(t)?.saving??!1)&&cr(t,r.document,r.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let r=await W(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=r.revision>0&&se(r.document)?r.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let o=await W(s,t,"menus");if(r!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(r!==this.loadSeq)return;er(o)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=Mn(o)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let i=this.watchId;this.record=t,i!==void 0&&t.revision<=0&&Yt(i);let s=t.revision>0?We(t.document):void 0;if(i===void 0||s===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===i&&t.revision>=r.revision&&(this.restartDraft=void 0,(K(i)?.dirty??!1)||Ge(i));let o=Gt(i,s,t.revision);o.replaced.length>0?this.note={kind:"warn",text:vn(o.replaced)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let r=await En(i,t,"menus");if(s!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(s!==this.historySeq||t!==this.watchId)return;this.historyState=at(r)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;Hn(i,t,r=>{s===this.subscribeSeq&&(r.kind==="catalog"?as(r,this.catalog)&&this.loadCatalog(t):r.kind==="status_pages"?this.loadStatusPages(t):r.kind==="pages"?this.loadPages(t):r.kind==="behavior"?this.loadBehavior(t):r.kind==="voice"?this.loadVoice(t):r.kind==="menus"&&r.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(r=>{s===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||jn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Bc))}async poll(){this.pollTimer=void 0;let t=this.hass,i=this.watchId,s=this.record;if(!(!t||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let r=await W(t,i,"menus");if(i!==this.watchId||this.record!==s)return;r.revision===s.revision?this.record={...s,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(r),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let r=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),r}editPages(t,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let r=this.scrubKey??i,o=s.apply(t(s.document),r===void 0?void 0:{coalesce:r});return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??Pi,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=Ci(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:li(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Kt(this.voiceDocument)}}screen(){let t=this.phoneLayout();if(t!==void 0)return Ki(t);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(wt(i?.screen_size)??gt).screen}phoneLayout(){if(this.device!=="iphone")return;let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return ji(qi(t?.screen_size))}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,r=Tn(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*It,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:r.filter(o=>!o.hidden).map(({hidden:o,...a})=>a),switcherRows:r,switcherSettings:o=>this.switcherSettingsHost(o),menuFoot:o=>o==="switcher"?p:this.libraryHead(o),menuBadge:o=>this.menuBadge(o),get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(o,a)=>this.draft===t&&this.edit(o,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let i=this.pagesDraft;if(i===void 0||Rt(i.document,t)===void 0)return;let s=this,r=this.memoIcons();return{pageId:t,icons:r,symbols:this.symbols,uiState:this.uiState,get device(){return s.device},get page(){return Rt(i.document,t)??{}},get busy(){return s.saving},edit:(o,a)=>{this.pagesDraft===i&&this.editPages(o,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(t||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.watchId;this.endScrub();let s=this.draft,r=this.pagesDraft;if(!t||i===void 0||!s||this.saving)return;let o=s.dirty,a=r?.dirty??!1;if(!o&&!a)return;this.note=void 0;let d=o?await this.saveMenus(t,i,s,s.revision<=0):void 0,l=a&&r!==void 0&&this.pagesDraft===r?await this.savePages(t,i,r):void 0;i===this.watchId&&(this.note=Xc(d,l))}async saveMenus(t,i,s,r=!1){let o=[],a=yr(s,{prepare:Zs,save:(u,g)=>lt(t,i,"menus",u,g).then(w=>(o=pt(w),w),w=>{throw ct(w)}),fetch:async()=>{let u=await W(t,i,"menus").catch(g=>{throw ct(g)});return{revision:u.revision,document:u.document}}});this.followedSave=s.saveDone,this.requestUpdate();let d=await a.catch(u=>({ok:!1,revision:s.revision,merged:!1,code:at(u)??"unknown",message:Mn(u)}));this.saveEnded(i);let l=mr(r,d.code,Zo(d));return d.ok?ht(l,o,"menus"):l}async savePages(t,i,s){let r=ar(s,{prepare:a=>us(Gi(a),s.base,this.hass?.states),save:(a,d)=>lt(t,i,"pages",a,d).catch(l=>{throw ct(l)}),fetch:async()=>{let a=await W(t,i,"pages").catch(d=>{throw ct(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let o=await r.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:at(a)??"unknown",message:Mn(a)}));return this.pagesSaveEnded(i),ni(o)}startFresh(){let t=this.watchId;t===void 0||!Yn(this.noRecordState())||(ur("menus",t),this.note=void 0,this.requestUpdate())}get linkDevices(){return Bi(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get linkKind(){return this.device==="iphone"?"iphone":"watch"}libraryMenuOf(t){let i=this.lib.library,s=this.watchId;if(!(i===void 0||s===void 0||this.unsupported||(this.record?.revision??0)<=0))return Ui(i,s,jc(t))}menuBadge(t){if(t==="switcher")return;let i=this.libraryMenuOf(t);return i===void 0||i.name===Ct[i.unit]?void 0:i.name}typeMenuName(t,i){this.naming={menuId:t,value:i},this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=setTimeout(()=>this.flushRename(),qc)}flushRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0;let t=this.naming;if(t===void 0||t.sent===!0)return;let i=this.lib.store,s=this.lib.library,r=t.value.trim(),o=s===void 0?void 0:s.index.menus.get(t.menuId.toUpperCase());if(i===void 0||r===""||o===void 0||o.name===r){this.naming=void 0;return}let a={menuId:t.menuId,value:r,sent:!0};this.naming=a,i.renameMenu(t.menuId,r).then(()=>{this.naming===a&&(this.naming=void 0)})}cancelRename(){this.renameTimer!==void 0&&clearTimeout(this.renameTimer),this.renameTimer=void 0,this.naming=void 0}async makeCopy(t){let i=this.lib.store,s=this.watchId;if(i===void 0||s===void 0||this.copying||this.saving||(this.draft?.dirty??!1))return;this.flushRename();let r=this.linkDevices.find(d=>le(d.ownerId,s)),o=bs(r?.name??`This ${J(this.device)}`);this.copying=!0,this.libNote=void 0;let a=await i.copyMenu(s,t.unit,o);this.copying=!1,s===this.watchId&&(this.libNote=a.ok?{kind:"ok",text:ys(o,this.linkKind)}:{kind:"err",text:`Not copied. ${a.text}`},a.ok&&this.load(s,!0))}menuTickLocked(t){let i=this.watchId;if(!(i===void 0||le(t,i)||!(K(t)?.dirty??!1)))return gs(this.linkDevices.find(s=>le(s.ownerId,t))?.name??"that device")}libraryHead(t){let i=this.libraryMenuOf(t),s=this.lib.store,r=this.watchId;if(i===void 0||s===void 0||r===void 0)return p;let o=Ct[i.unit],a=this.naming!==void 0&&le(this.naming.menuId,i.id)?this.naming:void 0,d=this.linkDevices,l=i.owners.filter(f=>!le(f,r)),u=J(this.device),g=this.saving?"Saving\u2026":this.draft?.dirty??!1?vs(this.linkKind):void 0,w=s.noteFor("menus",i.id),h=this.hass?.user?.is_admin;return c`<div class="me-lib" role="group" aria-label=${o} @click=${f=>f.stopPropagation()}>
      <label class="me-lib-name"><span class="me-lib-h">Name</span>
        <input type="text" class="me-lib-input" aria-label=${`${o} name`} placeholder=${o} maxlength="80"
          .value=${Ae(a?.value??i.name)}
          @input=${f=>this.typeMenuName(i.id,f.target.value)}
          @keydown=${f=>{f.key==="Enter"?(f.preventDefault(),this.flushRename()):f.key==="Escape"&&(f.preventDefault(),f.stopPropagation(),this.cancelRename())}}
          @blur=${()=>this.flushRename()} />
      </label>
      ${d.length>1?hs({library:this.lib.library,kind:"menus",itemId:i.id,devices:d,colorOf:f=>this.colorOf(f),pending:s.pending,...h===void 0?{}:{admin:h},locked:f=>this.menuTickLocked(f)},f=>{s.pickMenu(f,i.unit,i.id)}):p}
      ${l.length===0?p:c`<div class="me-lib-copy">
        <span class="me-lib-hint">An edit here changes it on ${Fi(fs(l,d))} too.</span>
        <button type="button" class="pe-btn me-copy" ?disabled=${g!==void 0||this.copying}
          title=${g??`A copy of this menu that only this ${u} uses. The other devices keep this one.`}
          @click=${()=>{this.makeCopy(i)}}>${this.copying?"Copying\u2026":`Make a copy for this ${u}`}</button>
      </div>`}
      ${w===void 0?p:c`<p class="me-lib-note err" role="alert">${w}</p>`}
      ${this.libNote===void 0?p:c`<p class="me-lib-note ${this.libNote.kind}" role="status">${this.libNote.text}</p>`}
    </div>`}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let i=this.hass,s=this.watchId,r=this.record;if(!i||s===void 0||r===void 0||this.draft?.dirty)return;let o={entry:t,baseRevision:r.revision};this.restoreAsk=o,In(i,s,"menus",t.revision).then(a=>{if(this.restoreAsk!==o)return;let d=ws(this.lib.library,s,r.document,a.document,this.linkDevices);this.restoreAsk={...o,summary:Qc(a.document),links:d}},()=>{})}async restore(){let t=this.hass,i=this.watchId,s=this.restoreAsk;if(!t||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let r;try{let o=await Ln(t,i,"menus",s.entry.revision,s.baseRevision);r=ht({kind:"ok",text:Ei(s.entry.updated_at)},pt(o),"menus"),i===this.watchId?this.restartDraft={watchId:i,revision:o.revision}:(K(i)?.dirty??!1)||Ge(i)}catch(o){let a=at(o);a==="conflict"?r={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?r={kind:"warn",text:`Not restored. Home Assistant no longer holds menus for this ${J(this.device)}.`}:a==="not_found"?r={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",r={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):r={kind:"err",text:`Could not restore: ${ai(o)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=r,this.load(i,!0))}render(){let t=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,t):p}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Xo}renderTopBar(t,i){let s=t!==void 0&&!this.unsupported,r=s&&this.dirty,o=this.shellOwnsWatch;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${M("menu")}</button>`:p}
      ${o?p:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():xs(void 0,!1)}>${M("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${o?p:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?Qn({newWatch:this.newWatch,dirty:r,saved:vt(this.record,void 0,this.device),device:this.device}):p}
      ${this.renderSyncPill(s?t:void 0)}
      ${this.renderTopMenu(s?t:void 0)}
      ${s?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${xn}S). A save reaches the ${J(this.device)} the next time it checks.`:`Nothing to save (${xn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:c`<span class="tb-saved" title=${r?"Unsaved changes":""}>${vt(this.record,void 0,this.device)}</span>
        ${gr(hr({newWatch:this.newWatch,dirty:r,saving:this.saving}))}`}`:p}
      ${o?p:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():ks(void 0)}>${M("pages")}<span>Pages</span></button>`}
      ${this.barActions}
    </div>`}renderSyncPill(t){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return p;let s=t===void 0?{size:0,limit:1}:At(t.document),r=yt({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState,device:this.device});return c`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}noRecordState(t=this.watches){return Jn(t.find(i=>i.owner_watch_id===this.watchId))}opensReady(t=this.watches){return pr(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let i=this.canStartFresh();if(t===void 0&&!i)return p;let s=this.topMenuOpen,r=o=>()=>{this.topMenuOpen=!1,o()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${r(()=>this.discard())}>Discard edits</button>`:p}
        ${i?c`<button class="row" role="menuitem"
          @click=${r(()=>this.startFresh())}>${ut}</button>`:p}
      </div>`:p}
    </span>`}colorOf(t){return wi(gi(this.owners.length>0?this.owners:this.ownList??[]),t)}renderWatchPicker(t){if(t.length<2)return p;let i=t.find(o=>o.owner_watch_id===this.watchId),s=this.watchMenuOpen,r=o=>{let a=o===void 0?void 0:this.colorOf(o);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${M("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${r(i?.owner_watch_id)}<span class="tb-browse-l">${i?He(i,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${M("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(o=>{let a=o.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(o.owner_watch_id)}}>
            ${r(o.owner_watch_id)}<span class="me-watch-name">${He(o,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?M("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Xo?this.columns:ii(this.hostWidth-Uc,this.columns,kn)}renderGutter(t){return c`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();ri(i,{side:t,base:t==="left"?s.left:s.right,limits:kn,onWidth:r=>{this.columns={...this.columns,[t]:r}},onEnd:()=>ft($n,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:Sn[t]},ft($n,this.columns)}}></div>`}get stageScale(){return this.zoom??$t(this.narrow||this.stacked)}setZoom(t){this.zoom=t,fo(t)}renderStage(t,i){let s=i.find(g=>g.owner_watch_id===this.watchId),r=wt(s?.screen_size),o=r??gt,a=t.phone===void 0?o.label:t.phone.model.label,d=[...Oo(t),a],l=this.undoDraft,u=hn(P(t));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${u}>${u}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${He(s,i)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${t.phone!==void 0?Et:r===void 0?`${o.label}, this watch's size is not known`:d.join(" \xB7 ")}><span class="fam">${d.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${xn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${M("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${na?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${M("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(a,t)}
        ${Go(t)}
        ${Ko(t)}
        <div class="under"><span class="tail">${Ao(t)}</span>${Jo(t)}</div>
      </div>
    </div>`}renderStageTools(t,i){let s=i.phone!==void 0,r=this.stageScale,o=$t(this.narrow||this.stacked),a=d=>Ai(s?d*It:d);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${zo(i)}
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${s?Et:`This watch's screen, ${t}.`}>
        ${M(s?"phone":"watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${r<=Tt(r)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(Tt(r))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${a(r)}. Back to fit`}
          title=${`The ${s?"iPhone":"watch"} at ${a(r)} of its own points. Click to fit it again (${a(o)}).`}
          @click=${()=>this.setZoom(void 0)}>${a(r)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${r>=Mt(r)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(Mt(r))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${jt}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this ${J(this.device)}'s menus: ${this.loadError}</span>
        ${l===void 0?p:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return c`<div class="pe-empty"><b>${jt}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:K(this.watchId),u=this.watchId;return c`<div class="pe-empty"><b>${Le("menus",this.device)}</b><span>${Gn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ut}</button>
        ${l?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Ge(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let r=this.viewHost();if(r===void 0)return c`<div class="pe-empty">Loading…</div>`;let o=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",d=i.revision<=0;return c`${d&&this.barHost===void 0?fr(this.device):p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${a}`}>
      <div class="column left">
        ${Lo(r)}
        ${Ho(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${No(r)}
      </div>
    </div>
    ${d?p:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(t,i,s){let r=At(i),o=yt({record:t,size:r.size,limit:r.limit,noun:"menus",historyState:this.historyState,device:this.device}),a=this.watchId;return c`${yi({status:o,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?vi({noun:"menus",device:this.device,record:t,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?xi({noun:"menus",document:i,revision:t.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{Si(d).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(t){let i=this.record,s=zc(t.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${Kn(t.entry.updated_by,this.device)}${s?` ${s}`:""}, ${Kc(t.entry.size)}.</p>
      ${t.summary?c`<p class="pe-muted">${t.summary}</p>`:p}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      ${(t.links??[]).map(r=>c`<p>${r}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[qn,Dn,Nn,_n,Wn,Vn,Bn,Fn,Di,Ji,wr,z`
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

    /* The foot of a menu's row in the Menus card: the menu's name, Used by
       with a round tick per device, and Make a copy for this watch
       (libraryHead). */
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
  `,Vo,Yo,so,$i,$r,ms,ei]}};y([L({attribute:!1})],b.prototype,"hass",2),y([L({attribute:!1})],b.prototype,"owners",2),y([L({attribute:!1})],b.prototype,"ownerId",2),y([L({type:Boolean,reflect:!0})],b.prototype,"narrow",2),y([L({attribute:!1})],b.prototype,"icons",2),y([L({attribute:!1})],b.prototype,"iconsTick",2),y([L({attribute:!1})],b.prototype,"haMenu",2),y([L({attribute:!1})],b.prototype,"onHaMenu",2),y([L({attribute:!1})],b.prototype,"onBack",2),y([L({attribute:!1})],b.prototype,"onPages",2),y([L({attribute:!1})],b.prototype,"barActions",2),y([L({attribute:!1})],b.prototype,"shellOwnsWatch",2),y([L({attribute:!1})],b.prototype,"phones",2),y([L({attribute:!1})],b.prototype,"barHost",2),y([k()],b.prototype,"watchId",2),y([k()],b.prototype,"record",2),y([k()],b.prototype,"unsupported",2),y([k()],b.prototype,"catalog",2),y([k()],b.prototype,"statusPages",2),y([k()],b.prototype,"httpLibrary",2),y([k()],b.prototype,"pagesRecord",2),y([k()],b.prototype,"behavior",2),y([k()],b.prototype,"voiceDocument",2),y([k()],b.prototype,"loading",2),y([k()],b.prototype,"loadError",2),y([k()],b.prototype,"history",2),y([k()],b.prototype,"historyState",2),y([k()],b.prototype,"note",2),y([k()],b.prototype,"restoreAsk",2),y([k()],b.prototype,"restoring",2),y([k()],b.prototype,"historyOpen",2),y([k()],b.prototype,"rawOpen",2),y([k()],b.prototype,"rawCopied",2),y([k()],b.prototype,"ownList",2),y([k()],b.prototype,"topMenuOpen",2),y([k()],b.prototype,"watchMenuOpen",2),y([k()],b.prototype,"naming",2),y([k()],b.prototype,"copying",2),y([k()],b.prototype,"libNote",2),y([k()],b.prototype,"zoom",2),y([k()],b.prototype,"columns",2),y([k()],b.prototype,"hostWidth",2),y([k()],b.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",b);export{ko as a,Va as b,Vo as c,Ac as d,Yo as e,$n as f,qc as g,jc as h,Yc as i,Qo as j,Zc as k,Tn as l,Ul as m,Xc as n,Qc as o,b as p};
