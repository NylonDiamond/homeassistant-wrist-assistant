import{a as je,g as Fe,h as Bt}from"./chunk-RUZTQMS7.js";import{d as Ms,e as Y,f as _t,g as Nt,h as Ue,i as Ts,j as Rs}from"./chunk-Z52GC7I4.js";import{L as Ps,M as Cs,N as Es,a as Ui,b as Tt,e as ji,i as Fi,j as zi,la as Os,ma as Ls,na as qt,oa as Ds}from"./chunk-IOJIKNHC.js";import{o as Si,p as yt,q as ve,r as vt,s as xt,w as Ti,x as Ri,y as Pi,z as Ci}from"./chunk-YBXTPCVB.js";import{b as Kn,c as dt,d as Jn,e as lt,f as Gn}from"./chunk-ZOJGMATP.js";import{$ as $e,A as P,B as _e,C as Ne,D as J,E as Ve,F as is,G as ss,H as Ht,I as os,J as rs,K as as,L as cs,M as ds,N as ls,O as At,P as It,Q as us,R as ps,S as hs,T as ms,U as Ot,V as Lt,W as fs,X as Dt,Y as gs,Z as qe,_ as ws,a as xe,aa as bs,ba as ys,ca as oe,d as Le,da as G,e as Rt,ea as Be,fa as le,g as Pt,ga as vs,h as Ji,ha as xs,i as de,ia as ks,j as se,k as Gi,ka as Ss,l as T,la as Wt,m as ke,ma as $s,n as Yi,o as De,p as Zi,q as Ct,r as Et,s as Xi,t as Qi,u as Se,v as es,w as We,x as ts,y as ns,z as q}from"./chunk-PSSYGLHG.js";import{a as Ws,b as _s,c as Ns,d as Vs,e as qs,f as Bs,g as Us}from"./chunk-FMEYBIGP.js";import{Pa as Wi,Qa as Mt,Ra as _i,Sa as Ni,Ta as Vi,Ua as qi,b as Hi,c as Ai,cb as Oe,d as Ii,db as Bi,j as Oi,m as Li,o as $t,p as Di,xb as Ki}from"./chunk-XDMMZFSQ.js";import{Ib as Hs,Jb as As,Kb as Is,Mb as Vt,sa as Ei}from"./chunk-UDRG2OIJ.js";import{a as mt,b as ft,c as di,d as li,e as ui,f as pi,g as hi,h as mi,i as fi,j as $i,k as Mi}from"./chunk-J5NVFAWB.js";import{b as ai,p as ci,w as yi}from"./chunk-OGKZFZPA.js";import{a as gi,b as wi,d as bi}from"./chunk-QUOL6HJ4.js";import{$b as Ae,$c as Ks,Ab as Qn,Bb as ei,Cb as ti,Ib as ni,Jb as ii,Kb as si,Lb as oi,Mb as ri,Nb as K,Ob as V,Pb as ye,Q as ut,Rb as W,Sb as ce,V as pt,Xa as Xn,Yc as js,Zb as ht,Zc as Fs,_c as zs,fe as Js,h as Rn,na as Zn,s as Yn}from"./chunk-C3GR43XQ.js";import{Ag as at,Bg as kn,Cg as Sn,Dg as $n,Eg as Mn,Fg as Tn,_h as Wn,b as z,c,cg as xn,d as S,dh as D,eh as M,f as p,hj as Bn,i as vn,ih as Pn,ii as _n,j as I,ji as Ee,jj as Un,k,kh as Cn,kj as jn,lh as En,lj as Fn,mh as Hn,mi as Nn,nh as An,ni as Vn,oh as In,oi as ct,ph as On,pi as qn,qh as Ln,yg as N,zh as Dn}from"./chunk-RYLMRUWW.js";import{f as St}from"./chunk-WIDK423N.js";import{Q as kt,j as ie,l as gt,m as vi,n as Ie,o as wt,p as xi,q as bt,r as ki}from"./chunk-Y5WD6GQY.js";import{a as He,b as zn}from"./chunk-KXSD4G27.js";import{a as v}from"./chunk-LO2NM3CE.js";var Ft="In the page switcher",Mr=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],zt="switcher-settings",Gs=`${zt}:resetDot`;function Ys(e){return Bi(e,Mr,n=>{let t=Oe(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function Zs(e){let n=Oe(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function Kt(e,n){return`${zt}:typed:${e.pageId.toUpperCase()}:${n}`}function Ut(e,n){let t=e.uiState.get(Kt(e,n));return typeof t=="string"?t:void 0}function Tr(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function Rr(e){let n=Tr(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...e.uiState.keys()])i.startsWith(`${zt}:typed:`)&&(t===void 0||i!==Kt(e,t))&&e.uiState.delete(i)}function ue(e,n,t=!1){let i=e.uiState.delete(Gs);e.busy||e.edit(n,t&&!i?{typing:!0}:void 0)}function jt(e,n,t){let i=Kt(e,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&e.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(Gs,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&e.endCoalesce(),d.type==="checkbox"&&(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function Xs(e){Rr(e);let n=e.page,t=Oe(n),i=t.switcherDisplayMode??"text",s=Wi.map(d=>[d,d==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=d=>ue(e,l=>Mt(l,e.pageId,d)),a=d=>ue(e,l=>_i(l,e.pageId,d),!0);return c`
    ${W("Hidden",t.hideFromSwitcher,d=>ue(e,l=>qi(l,e.pageId,d)),!1)}
    ${t.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:p}
    ${V("Show as",s.some(([d])=>d===i)?i:"text",s,d=>ue(e,l=>Vi(l,e.pageId,d)))}
    ${jt(e,"switcherText",oi("Name",Ut(e,"switcherText")??t.switcherText??"",d=>ue(e,l=>Ni(l,e.pageId,d),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>ue(e,d=>Mt(d,e.pageId,""))}>Automatic icon</button>
    </div>
    ${jt(e,"switcherIcon",Ae({icons:e.icons,symbols:e.symbols},Ut(e,"switcherIcon")??t.switcherIcon??"",r,"sw:switcher-icon",{emptyText:"Picked by the watch",tint:t.switcherColor}))}
    ${jt(e,"switcherColor",c`<div class="ts-no-alpha">${ce("Color",Ut(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var Z=je.routing;function Jt(e){return Z.actions.find(n=>n.action===e)}function X(e){return Jt(e)?.keys??[]}function B(e){return Object.hasOwn(Z.keys,e)?Z.keys[e]:void 0}function he(e){return ie(e.voiceConfig)?e.voiceConfig:{}}function Pr(e,n){let t=Z.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function Q(e,n){let t=B(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=Z.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?Pr(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,o]=t.clamp??[-1/0,1/0];return Math.min(o,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function eo(e,n){let t=B(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=Q(e,i[1]),o=i[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof s=="string"&&o.includes(s);return i[2]===void 0?r:!r}function ze(e,n){let t=B(n);if(t?.type!=="enum")return[];let i=Z.labels[t.enum??""]??{},s=Z.offered[n]??Z.enums[t.enum??""]??[],o=Q(e,n);return(typeof o=="string"&&!s.includes(o)?[o,...s]:s).map(a=>[a,i[a]??a])}function to(e){return B(e)?.label??Cr[e]??e}var Cr={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Gt(e,n,t){let i=B(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!ze(e,n).some(([r])=>r===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[r,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(r,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let r=(t??"").trim();if(r==="")return Bt(e,n);s=r;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let r=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return Bt(e,n);s=r;break}}return(Object.hasOwn(e,n)?kt(e[n],s):kt(Q(e,n),s))?e:Fe(e,n,s)}function no(e,n,t,i){let s=Q(e,n),o=Array.isArray(s)?s:[];return i===o.includes(t)?e:Gt(e,n,i?[...o,t]:o.filter(r=>r!==t))}function Er(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function Hr(e,n){let t=B(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=Q(e,s);return typeof o=="string"&&i.includes(o)}function Yt(e,n,t,i){let s=B(n);if(s===void 0)return"None";if(!Hr(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let o=Er(s,t);return typeof o=="string"&&o.trim()!==""?`Default (${i(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Qs(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function pe(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function Ke(e,n,t){let i=Qs(n),s=Qs(t);return e.filter(o=>!pe(i,o)&&(s.length===0||pe(s,o)))}function Ar(e,n){return{hiddenPhraseIds:e.filter(t=>!pe(n,t)),knownPhraseIds:e.slice()}}function io(e,n,t,i){if(!pe(n,t))return e;let s=Ke(n,e.hiddenPhraseIds,e.knownPhraseIds);if(pe(s,t)===i)return e;let o=i?n.filter(a=>pe(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),r=Ar(n,o);return Fe(Fe(e,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function so(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function Ir(e,n,t,i,s){return _e(e,n,t,o=>{if(!X(T(o)).includes(i))return o;let r=he(o),a=Gt(r,i,s);return a===r?o:Pt(o,"voiceConfig",a)})}function Or(e,n,t,i,s,o){return _e(e,n,t,r=>{if(!X(T(r)).includes(i))return r;let a=he(r),d=no(a,i,s,o);return d===a?r:Pt(r,"voiceConfig",d)})}function Lr(e,n,t,i,s,o){return _e(e,n,t,r=>T(r)==="ttsMenu"?io(r,i,s,o):r)}function oo(e){return Object.keys(he(e)).some(n=>X(T(e)).includes(n))}function ro(e){let n=T(e);return X(n).length>0||n==="ttsMenu"}function ao(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Dr(e,n,t,i){let s=Is(e.hass.states),o=Vt(s,t),r=a=>W(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function Wr(e,n,t,i){let s=B(t),o=so(e.voice?.defaults),r=s?.domain==="conversation"?Hs(e.hass.states):As(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=Vt(r,i===""?[]:[i]);return[["",Yt(n,t,o,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??ao(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function _r(e,n,t,i,s){let o=B(s);if(o===void 0||!eo(i,s))return p;let r=to(s),a=Q(i,s),d=(l,u)=>e.edit(f=>Ir(f,n,t,s,l),u);switch(o.type){case"enum":return K(r,String(a),ze(i,s),l=>d(l),{snapBack:!0,def:String(o.default)});case"bool":return W(r,a===!0,l=>d(l),o.default);case"int":{let l=typeof a=="number"?a:Number(o.default),u=je.volume,[f,w]=o.clamp??[u.min,u.max];return c`${ye(r,l,m=>d(m,`slot:${t}:${s}`),{min:f,max:w,step:u.step,def:Number(o.default),format:m=>`${Math.round(m)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(m=>c`<button type="button" class="pe-chip ${m.value===l?"on":""}"
          aria-pressed=${m.value===l?"true":"false"} @click=${()=>d(m.value)}>${m.label} ${m.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return K(r,l,Wr(e,i,s,l),u=>d(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=so(e.voice?.defaults),f=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${Yt(i,s,u,w=>ao(e.hass,w))}.`:"None picked.";return c`${Dr(e,r,l,(w,m)=>e.edit(g=>Or(g,n,t,s,w,m)))}
        <div class="hint ${l.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${l.length===0?f:`${l.length} picked.`}</div>`}}}function Nr(e,n,t){let i=typeof t.id=="string"?t.id:"",s=he(t),o=X(T(t));return c`${e.voice?.defaults===void 0?c`<div class="hint">${Ds}.</div>`:p}
    ${o.map(r=>_r(e,n,i,s,r))}`}function Vr(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=s.map(u=>u.id),r=Ke(o,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],d=a.length>0&&o.some(u=>!a.some(f=>f.toUpperCase()===u.toUpperCase())),l=u=>r.some(f=>f.toUpperCase()===u.toUpperCase());return c`<div class="me-sub-h">${Jt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>W(u.name,l(u.id),f=>e.edit(w=>Lr(w,n,i,o,u.id,f))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function co(e,n,t){let i=T(t);if(i==="ttsMenu")return Vr(e,n,t);if(X(i).length>0)return Nr(e,n,t)}function lo(e,n){let t=T(n);if(t==="ttsMenu"){let r=e.voice?.phrases;return r===void 0?"":`${Ke(r.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let i=he(n),s=X(t)[0];if(s===void 0)return"";let o=Q(i,s);return ze(i,s).find(([r])=>r===o)?.[1]??""}function mo(e,n,t,i,s,o,r=""){return c`<div class="mi-look">
    <div class="mi-look-title">${ni(e,n,t,d=>o(d),d=>i.find(([l])=>l===d)?.[1]??d)}</div>
    <div class="mi-pics ${r}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([d,l])=>{let u=d===n;return c`<button type="button" class="mi-pic ${u?"on":""}" aria-pressed=${u?"true":"false"} aria-label=${`${e}: ${l}`}
          @click=${()=>{d!==n&&o(d)}}>${s(d)}<span class="mi-pic-name">${l}</span></button>`})}
    </div>
  </div>`}function Ye(e,n,t,i,s){return c`<div class="mi-switch">${W(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function qr(e){return c`<div class="mi-wrap">${e}</div>`}function Ze(e,n){return oe(e).find(t=>t.key===n)}function Zt(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function Xe(e,n,t){return oe(n).some(i=>t.includes(i.key)&&Be(e,n,i)&&!Zt(G(e,n,i),i.default))}function Je(e,n,t){let i=Ze(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:G(e.document,n,i),set:(o,r=!1)=>e.edit(a=>vs(a,n,t,o),r?s:void 0)}}function Xt(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function Qe(e,n){return n===void 0?p:ye(e,Xt(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function uo(e,n,t,i){if(n===void 0)return p;let s=n.value===!0?"on":"off",o=n.field.default===!0?"on":"off";return mo(e,s,o,[["off",t[0]],["on",t[1]]],r=>i(r==="on"),r=>n.set(r==="on"))}var fo=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],go=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],po=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function Br(e){return c`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function Ur(e){return c`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function jr(e){if(e===void 0)return p;let n=Xt(e),t=(e.field.presets??po.map(([s,o])=>({value:s,label:o}))).map(s=>[String(s.value),po.find(([o])=>Zt(o,s.value))?.[1]??s.label]),i=t.find(([s])=>Zt(Number(s),n))?.[0]??"";return c`${V("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${Qe("Exact",e)}`}function wo(e){let n=i=>Je(e,"quickAction",i),t=n("showContextLabel");return c`
    ${uo("Behind the ring",n("showIconBubble"),["Solid","Glass"],Br)}
    ${jr(n("backgroundDim"))}
    ${uo("Buttons",n("showNeonOutline"),["Plain","Neon"],Ur)}
    ${t===void 0?p:Ye("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${Qe("Glow",n("glowIntensity"))}`}function bo(e){let n=t=>{let i=Ze("quickAction",t);return i===void 0?void 0:G(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function Fr(){let e=le("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function zr(e){let n=S``;switch(e){case"sectorWedge":n=S`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=S`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=S`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=S`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=S`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function Kr(e,n){if(n===void 0||!Be(e.document,"quickAction",n.field))return p;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${ce("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?p:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let o=s.toUpperCase()===t.toUpperCase();return c`<button type="button" class="ts-swatch ${o?"on":""}" aria-pressed=${o?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function yo(e){let n=r=>Je(e,"quickAction",r),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),o=n("showFingerShadow");return c`
    ${t===void 0?p:qr(V("Opening",String(t.value),le("EntranceStyle"),r=>t.set(r),{def:String(t.field.default)}))}
    ${i===void 0?p:mo("Beam from your finger to the slot",String(i.value),String(i.field.default),Fr(),zr,r=>i.set(r),"beams")}
    ${Kr(e,n("beamColor"))}
    ${s===void 0||!Be(e.document,"quickAction",s.field)?p:Qe("Beam strength",s)}
    ${o===void 0?p:Ye("Finger shadow",o.value===!0,r=>o.set(r),o.field.default===!0,"A soft dark spot where your finger rests.")}`}function vo(e){let n=s=>{let o=Ze("quickAction",s);return o===void 0?"":String(G(e,"quickAction",o))},t=(s,o)=>le(s).find(([r])=>r===o)?.[1]??o,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var xo=["glowIntensity","selectedScale"];function me(e){return Math.round(e*1e3)/10}function ko(e){let n=Je(e,"pageSwitcher","glowIntensity"),t=Je(e,"pageSwitcher","selectedScale");return c`${Qe("Glow",n)}
    ${t===void 0?p:ye("Picked page size",me(Xt(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:me(t.field.min??1),max:me(t.field.max??1.5),step:me(t.field.step??.05),def:me(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function So(e){let n=Ze("pageSwitcher","selectedScale"),t=n===void 0?void 0:G(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(me(t))}%`:""}function Ge(e,n,t,i){return e.render(n,t,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var $o=["light","switch","lock","cover","climate","media_player"],Jr={media_player:"Media player"};function Mo(e,n,t,i,s){let o=t.some(a=>a.domain===n),r=o?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let d=a.domain===n,l=Jr[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${d?"on":""}" aria-pressed=${d?"true":"false"} data-type=${a.domain}
          @click=${()=>{d||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${Ge(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${l}</span></button>`})}
    </div>
    ${K("More types",o?"":n,r,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function To(e,n,t,i){return c`<div class="mi-acts">${t.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(o=>{let r=o.raw===n,a=!r&&o.why!==void 0;return c`<button type="button" class="mi-act ${r?"on":""}" aria-pressed=${r?"true":"false"} ?disabled=${a} data-action=${o.raw}
        title=${o.why??p} @click=${()=>{r||i(o.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${Ge(e,o.icon,14,o.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${o.label}</span>
          ${o.why===void 0||r?p:c`<small class="mi-act-why">${o.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var Gr=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function ho(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function Ro(e,n,t,i){let s=new Map(t.map(r=>[r.position,r])),o=r=>{if(r===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(r);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let d=a.here?"here":a.holder===void 0?"free":"held",l=a.here?Ge(e,n.icon,14,n.color):a.holder===void 0?M("plus"):Ge(e,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${d}" data-place=${r} aria-label=${ho(a)} title=${ho(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:p}
      @click=${()=>{a.here||i(r)}}>${l}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${Gr.map(r=>r.map(o))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var Po=z`
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
`;var Ao=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],Io="Each page's icon, color and name are set here: pick a page in the Pages card.",Yr="Pick a page in the Pages card to set how it shows here.",Zr={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},Oo={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:Io},Xr="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Qr="Click a slot or its label to edit it. Click anywhere else for the menu's look.",we=.36,tn=44,nn=22;function Lo(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function ea(e,n,t=we){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=o=>Math.round(o*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var Do="wrist-assistant-panel.menus.zoom.v1";function Wo(e=dt()){try{let n=e?.getItem(Do);if(n==null||n==="")return;let t=Number(n);return Si.includes(t)?t:void 0}catch{return}}function _o(e,n=dt()){try{n?.setItem(Do,e===void 0?"":String(e))}catch{}}var No={name:{color:D.place,icon:"text"},slot:{color:D.content,icon:"content"},where:{color:D.position,icon:"place"},look:{color:D.look,icon:"look"},shows:{color:D.states,icon:"states"},menu:{color:D.content,icon:"content"},style:{color:D.look,icon:"look"},motion:{color:D.look,icon:"radial"},switcherPage:{color:D.content,icon:"watch"}},ta="#26a69a",na=D.complication,L="menu-editor";function Me(e,n,t){return`${e} ${e===1?n:t}`}function fe(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Vo(e,n){return{entityId:n,displayName:n===""?"":fe(e,n),domain:De(n)}}function Te(e,n,t,i){return e.icons.render(n,t,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function _(e){return de(T(e))===void 0?{icon:xe.unknownActionIcon,color:xe.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function qo(e){let n=T(e);if(n==="triggerEntity"){let i=ke(e).entityId;return Et(De(typeof i=="string"?i:""))}let t=de(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function C(e,n){return e.toUpperCase()===n.toUpperCase()}function ia(e,n){return e.toUpperCase()===n.toUpperCase()}function sa(e,n){let t=T(n),i=ke(n),s=de(t);for(let o of s?.payload??[]){let r=i[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return fe(e.hass,r);if(o.target==="page")return e.targets.pages.find(a=>C(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return e.targets.statusPages.find(a=>C(a.id,r))?.name??"A status page";if(o.target==="httpAction")return e.targets.httpActions.find(a=>C(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(d=>C(d.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function re(e,n){return sa(e,n)??se(T(n))}function ge(e){return Se(e)?.label??e}var Bo="me:menu",Uo="me:er:mode",jo="me:er:domain",en="me:er:entity",Qt="me:er:add";function R(e){let n=e.uiState.get(Bo);return n==="entity"||n==="switcher"?n:"anywhere"}function oa(e,n){n!==R(e)&&e.uiState.delete(et),e.uiState.set(Bo,n),e.requestUpdate()}var et="me:sw:page";function Fo(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function ee(e){if(R(e)!=="switcher")return;let n=e.uiState.get(et);if(typeof n=="string")return Fo(e).find(t=>C(t.id,n))}function sn(e,n){n===void 0?e.uiState.delete(et):e.uiState.set(et,n),e.requestUpdate()}function zo(e){let n=ee(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function on(e){return Ao.find(([n])=>n===e)?.[1]??e}function Ko(e){return e.uiState.get(Uo)==="entity"?"entity":"domain"}function Jo(e){let n=e.uiState.get(jo);return typeof n=="string"&&Se(n)!==void 0?n:"light"}function Go(e){let n=$e(e.document),t=e.uiState.get(en);return typeof t=="string"&&n.includes(t)?t:n[0]}function j(e){switch(R(e)){case"anywhere":return We;case"entity":return rn(e);case"switcher":return}}function rn(e){if(Ko(e)==="domain")return{list:"domain",domain:Jo(e)};let n=Go(e);return n===void 0?void 0:{list:"entity",entityId:n}}function Yo(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${ge(n.domain)} menu`:`${fe(e.hass,n.entityId)} menu`}function Zo(e){return`me:sel:${ts(e)}`}function ae(e,n){let t=e.uiState.get(Zo(n));if(typeof t=="string")return q(e.document,n).find(i=>C(P(i),t))}function be(e,n,t){e.uiState.set(Zo(n),t),e.requestUpdate()}function Re(e){if(ee(e)!==void 0)return sn(e,void 0),!0;let n=j(e);return n===void 0||ae(e,n)===void 0?!1:(be(e,n,void 0),!0)}function tt(e,n,t){let i;e.edit(s=>{let o=as(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=o.id,o.document}),i!==void 0&&be(e,n,i)}function Co(e){let t=(i,s)=>Math.round((s+(i-.5)/we*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${tn} ${nn}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>S`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function ra(e,n){return n===void 0?[]:q(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=Ve(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:_(t).color}]})}function aa(e,n){if(n==="switcher")return Me(e.switcherPages.length,"page","pages");let t=n==="anywhere"?We:rn(e);return t===void 0?"none yet":Me(q(e.document,t).length,"slot","slots")}function ca(e,n){if(n==="switcher"){let t=e.switcherPages;return Co(t.map((i,s)=>({...ea(s,t.length),color:i.color})))}return Co(ra(e,n==="anywhere"?We:rn(e)))}var da="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function Xo(e){let n=R(e);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${tn}px; --thumb-h: ${nn}px`}>
    <div class="lc-head">
      <span class="swatch">${M("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${Xr}>on the watch</span>
    </div>
    <p class="me-intro">${da}</p>
    <div class="layers me-menu-list" role="list">
      ${Ao.map(([t,i])=>{let s=t===n,o=()=>{s||oa(e,t)};return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${Oo[t]}
          @click=${o}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${ca(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${aa(e,t)}</span></b><small>${Zr[t]}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function la(e,n,t){return c`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${Te(e,n,14,t)}</span></span>`}function Eo(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${ge(n.domain)} menu, by type`:`${fe(e.hass,n.entityId)}'s own menu`}function ua(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function pa(e,n,t){let i=t!==void 0&&C(t.id,n.id),s=ua(n),o=()=>sn(e,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${la(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function ha(e){let n=Fo(e),t=ee(e),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${tn}px; --thumb-h: ${nn}px`}>
    <div class="lc-head">
      <span class="swatch">${M("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${Me(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>pa(e,s,t))}</div>`}
  </section>`}function Qo(e){return R(e)==="switcher"?ha(e):p}function er(e){if(R(e)==="switcher")return[Me(e.switcherPages.length,"page","pages")];let n=j(e);if(n===void 0)return[Eo(e,n)];let t=Me(q(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[Eo(e,n),t]}function tr(e){return R(e)==="switcher"?Io:j(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Qr}function nr(e,n){return Ti(e.uiState,L,n)}function ma(e,n){Ri(e.uiState,L,n,!nr(e,n)),e.requestUpdate()}function fa(e){if(zo(e)!==void 0)return[{module:L,section:"switcher-page"}];let n=j(e),t=n===void 0?void 0:ae(e,n);if(t!==void 0)return[{module:L,section:"slot"},{module:L,section:"where"},...ro(t)?[{module:L,section:"voice"}]:[],{module:L,section:"look"},...n?.list==="anywhere"?[{module:L,section:"shows"}]:[]];let i=R(e);return i==="anywhere"?[{module:L,section:"style-anywhere"},{module:L,section:"motion-anywhere"}]:[{module:L,section:i==="entity"?"menu":`style-${i}`}]}function U(e,n,t,i,s,o={}){let r=nr(e,t),a=No[n];return Ln({color:a.color,icon:M(a.icon),title:i,open:r,onToggle:()=>ma(e,t),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${L}:${t}`},r?s:c``)}function ir(e){let n=R(e),t=on(n),i=j(e),s=i===void 0?void 0:ae(e,i),o=fa(e),r=Pi(e.uiState,o),a=ee(e),d=zo(e),l,u;if(a!==void 0&&d!==void 0)l=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>sn(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${na}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=ga(e,d);else if(s===void 0||i===void 0)l=c`<div class="crumbs"><span class="kchip" style=${`--k:${ta}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=Va(e,n);else{let f=re(e,s);l=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>be(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${_(s).color}`}>Slot</span><span class="nm" title=${f}>${f}</span></div>`,u=La(e,i,s)}return c`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{Ci(e.uiState,o,!r),e.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function ga(e,n){let t=n.page;return U(e,"switcherPage","switcher-page",Ft,c`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Ft}>${Xs(n)}</fieldset>`,{summary:Zs(t),dot:Ys(t)})}var wa={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function sr(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":wa[n.key]??n.key}var ba={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function or(e){return se(e).replace(/ - (.+)$/," ($1)")}function ya(e,n){if(n==="entityControl"){let t=ns(e)??"all";return t==="all"?"Any entity":ge(t)}return ba[n]??Gi(n)}function va(e,n,t){let i=T(t),s=os(n),o=a=>{let d=de(a),l=d===void 0?{icon:xe.unknownActionIcon,color:xe.unknownActionColor}:d,u=a===i?void 0:Yi(a,e.targets);return{raw:a,label:or(a),icon:l.icon,color:l.color,...u===void 0?{}:{why:u}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[o(i)]}],...s.map(a=>({heading:ya(n,a.category),tiles:a.actions.map(o)}))]}function xa(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function Ho(){return c`<button type="button" class="link" @click=${Js}>Open HTTP actions</button>`}function ka(e,n,t){let i=n.find(s=>C(s.id,t));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${Ho()}</div>`:e.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${Li} ${Ho()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function Sa(e,n,t,i,s){let o=P(t),r=ke(t)[s.key],a=typeof r=="string"?r:"",d=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||d.some(h=>C(h.id,a)),u=h=>e.edit(x=>Ot(x,n,o,s.key,h===""?void 0:h)),f=s.target==="statusPage"&&e.statusPagesKnown===!0,w=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,m=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":f?"Not in this watch's status pages":w?Oi:Hi,g=h=>s.target==="httpAction"?xa(h):h.name;return c`<label class="field"><span>${sr(i,s)}</span>
    <select .value=${Yn(d.find(h=>C(h.id,a))?.id??a)} @change=${h=>u(h.target.value)}>
      ${s.required===!0?p:c`<option value="" ?selected=${a===""}>None</option>`}
      ${l?p:c`<option value=${a} selected>${m}</option>`}
      ${d.map(h=>c`<option value=${h.id} ?selected=${C(h.id,a)}>${g(h)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:s.target==="statusPage"?f||e.catalogKnown?p:c`<div class="hint ts-under">No status pages from this watch yet. Add them in Status pages.</div>`:s.target==="httpAction"?ka(e,e.targets.httpActions,a):p}`}function $a(e,n,t,i,s){let o=P(t),r=ke(t),a=(u,f)=>e.edit(w=>Ot(w,n,o,s.key,u),f),d=sr(i,s),l=Lt(t,s);switch(s.type){case"entity":{let u=typeof r[s.key]=="string"?r[s.key]:"",f=i==="runScene"?"scene":i==="runScript"?"script":Xi();return c`<div class="ts-stack">${ht({hass:e.hass},d,Vo(e.hass,u),w=>a(w.entityId),`me:entity:${o}`,{domain:f,clearable:!1,needed:u===""})}</div>
        ${u===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return Sa(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let w=De(typeof r.entityId=="string"?r.entityId:""),m=Zi(w),g=typeof l=="string"?l:m[0]??"",h=m.map(x=>[x,Ct(x)]);return m.includes(g)||h.unshift([g,Ct(g)]),K(d,g,h,x=>a(x),{snapBack:!0})}let u=le(s.enum),f=typeof l=="string"?l:String(s.default??"");return u.length<=4?V(d,f,u,w=>a(w)):K(d,f,u,w=>a(w),{snapBack:!0})}case"bool":return W(d,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&Lt(t,{key:"showBanner",type:"bool",default:!0})===!1)return p;let u=typeof r[s.key]=="number"?r[s.key]:void 0;return ri(d,u,f=>a(f,`slot:${o}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function Ma(e,n,t){if(!At(n,t))return p;let i=P(t);return c`<div class="ts-stack">${V("Skip conditions",Cs(It(t)),Ps,s=>e.edit(o=>us(o,n,i,Es(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Ta(e){let n=qe(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(ge).join(", ")}function Ra(e,n){let t=P(n),i=qe(n),s=i===void 0,o=d=>e.edit(l=>gs(l,t,d)),r=fs(),a=(i??[]).filter(d=>!Dt(d));return c`<div class="mi-wrap">${V("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],d=>o(d==="every"?void 0:r.slice(0,1)),{def:"every"})}</div>
    ${s?p:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(d=>{let l=i.includes(d),u=!Dt(d);return c`<button type="button" class="pe-chip ${l?"on":""} ${u?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${u?"Not reported by the watch":p}
          @click=${()=>o(l?i.filter(f=>f!==d):[...i,d])}>${ge(d)}</button>`})}
    </div>
    ${a.length===0?p:c`<div class="hint warn">${a.map(ge).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function Pa(e,n){return At(n,e)&&It(e)!==null}function Ca(e){return e.isVisible===!1}function Ea(e){return qe(e)!==void 0}function Ha(e){let n=qo(e);if(n===void 0)return!1;let t=_(e);return t.icon!==n.icon||!ia(t.color,n.color)}function Aa(e,n){let t=No.name;return c`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${M(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${re(e,n)}</span>
    </div>
  </section>`}function Ia(e){let n=J(e);return n.charAt(0)+n.slice(1).toLowerCase()}function Oa(e,n,t){let i=P(t),s=q(e.document,n).filter(o=>!C(P(o),i));return Ne().map(o=>{let r=s.find(d=>d.position===o),a={position:o,label:Ia(o),here:t.position===o};return r!==void 0&&(a.holder={name:re(e,r),..._(r)}),a})}function La(e,n,t){let i=P(t),s=T(t),o=de(s),r=_(t),a=qo(t),d=typeof t.position=="string"?t.position:"",l=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${o===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${To(e.icons,s,va(e,n,t),m=>e.edit(g=>ms(g,n,i,m,e.targets)))}
    ${o?.description?c`<div class="mi-desc">${o.description}</div>`:p}
    ${rs(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(o?.payload??[]).map(m=>$a(e,n,t,s,m))}
    ${Ma(e,n,t)}
  </fieldset>`,u=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${Ro(e.icons,r,Oa(e,n,t),m=>e.edit(g=>ds(g,n,i,m)))}
    ${W("Shown on the watch",t.isVisible!==!1,m=>e.edit(g=>ls(g,n,i,m)),!0)}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${Ae({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",m=>e.edit(g=>ps(g,n,i,m),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${ce("Color",typeof t.color=="string"?t.color:void 0,m=>{m!==void 0&&e.edit(g=>hs(g,n,i,m),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,w=co(e,n,t);return c`${Aa(e,t)}
    ${U(e,"slot","slot","What it does",l,{summary:or(s),dot:Pa(t,n)})}
    ${U(e,"where","where","Where",u,{summary:`${J(d)}${t.isVisible===!1?", hidden":""}`,dot:Ca(t)})}
    ${w===void 0?p:U(e,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${w}</fieldset>`,{summary:lo(e,t),dot:oo(t)})}
    ${U(e,"look","look","Icon and color",f,{summary:r.icon,dot:Ha(t)})}
    ${n.list==="anywhere"?U(e,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${Ra(e,t)}</fieldset>`,{summary:Ta(t),dot:Ea(t)}):p}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(m=>cs(m,n,i))}>${M("delete")}<span>Remove</span></button>
    </div>`}function Da(e){let n=Xe(e.document,"quickAction",fo),t=Xe(e.document,"quickAction",go);return c`${U(e,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${wo(e)}
    </fieldset>`,{summary:bo(e.document),dot:n})}
    ${U(e,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${yo(e)}
    </fieldset>`,{summary:vo(e.document),dot:t})}`}function Wa(e){let n=Xe(e.document,"pageSwitcher",xo);return U(e,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${ko(e)}
  </fieldset>`,{summary:So(e.document),dot:n})}function _a(e){let n=Ko(e),t=a=>{e.uiState.set(Uo,a),e.requestUpdate()},i=V("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,o,r=!1;if(n==="domain"){let a=Jo(e),d=Se(a),l=es(a),u=Qi().map(m=>[m.domain,m.label]),f=$o.flatMap(m=>{let g=Se(m);return g===void 0?[]:[{domain:g.domain,label:g.label,icon:g.icon,color:Et(g.domain).color}]}),w=d?.inheritKey?is(e.document,a):!1;r=w,o=`By type \xB7 ${d?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${Mo(e.icons,a,f,u,m=>{e.uiState.set(jo,m),e.requestUpdate()})}
      ${l.length>0?c`<div class="hint ts-under keep">The same menu as ${l.map(m=>m.label).join(", ")}.</div>`:p}
      ${d?.inheritKey?Ye("Fill gaps with the All menu",w,m=>e.edit(g=>ws(g,a,m)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):p}`}else{let a=$e(e.document),d=Go(e);o=`By entity \xB7 ${d===void 0?"none yet":fe(e.hass,d)}`;let l=u=>{let f=u.entityId.trim();f!==""&&(e.edit(w=>bs(w,f)),e.uiState.set(en,f),e.uiState.set(Qt,(Number(e.uiState.get(Qt)??0)||0)+1),e.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(u=>{let f=u===d;return c`<div class="me-entity ${f?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${f?"true":"false"}
            @click=${()=>{e.uiState.set(en,u),e.requestUpdate()}}>
            <b>${fe(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(w=>ys(w,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${ht({hass:e.hass},"Add an entity",Vo(e.hass,""),l,`me:er:add:${String(e.uiState.get(Qt)??0)}`,{clearable:!1})}
      </div>
    </div>`}return U(e,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:o,dot:r})}var Na="Click a slot on the watch to change what it does.";function Va(e,n){let t=n==="anywhere"?Da(e):n==="switcher"?Wa(e):_a(e);return c`<p class="me-menu-note">${Oo[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?Yr:Na}</p>`}var rr=z`
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
`;var qa=["spring","popIn","fade","none"],Ba=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Pe(e,n,t){let i=oe(n).find(s=>s.key===t);return i===void 0?void 0:G(e,n,i)}function Ce(e,n,t,i){let s=oe(n).find(a=>a.key===t),o=Pe(e,n,t),r=typeof o=="number"&&Number.isFinite(o)?o:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,r))}function nt(e,n){return Pe(e,"quickAction",n)===!0}function Ua(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function it(e){let n=Pe(e,"quickAction","entranceStyle"),t=Pe(e,"quickAction","beamStyle");return{glass:nt(e,"showIconBubble"),neon:nt(e,"showNeonOutline"),labels:nt(e,"showContextLabel"),finger:nt(e,"showFingerShadow"),entrance:qa.includes(n)?n:"none",dim:Ce(e,"quickAction","backgroundDim",1),beam:Ba.includes(t)?t:"none",beamColor:Ua(Pe(e,"quickAction","beamColor")),beamIntensity:Ce(e,"quickAction","beamIntensity",.5),glow:Ce(e,"quickAction","glowIntensity",.5)}}function ja(e){return{glow:Ce(e,"pageSwitcher","glowIntensity",.5),scale:Ce(e,"pageSwitcher","selectedScale",1.2)}}var cn="ms:play",Fa=1500;function za(e){let n=e.uiState.get(cn);e.uiState.set(cn,{menu:R(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function Ka(e){let n=e.uiState.get(cn);return n===void 0||n.menu!==R(e)||Date.now()-n.at>Fa?"":n.count%2===1?"ms-play-a":"ms-play-b"}function dr(e,n){let t=q(e,n),i=ss(e,n),s=new Set(Ht(e,n));return Ne().map(o=>{let r=t.filter(u=>u.position===o),a=r.find(u=>u.isVisible!==!1),d=a===void 0?i.find(u=>u.position===o&&u.isVisible!==!1):void 0,l=a??(d===void 0?r[0]:void 0);return{position:o,own:r,main:l,second:r.find(u=>u!==l),shared:d,free:s.has(o)}})}function Ja(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=P(n),o=e.find(r=>r.main!==void 0&&C(P(r.main),s));if(o!==void 0)return{position:o.position,slot:n}}let i=e.flatMap(s=>{let o=t(s.main)?s.main:s.shared;return o===void 0?[]:[{position:s.position,slot:o}]});return i.find(s=>s.position==="topCenter")??i[0]}var b=e=>Math.round(e*100)/100;function ln(e,n){let t=Lo(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function an(e,n,t,i){return lr(e,n,ln(e.screen,t),i)}function lr(e,n,t,i){let{width:s,height:o}=e.screen,r=e.scale,a=[`left:${t.x*100}%`,`top:${t.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${b((s/2-t.px)*r)}px`,`--fy:${b((o/2-t.py)*r)}px`),n.finger){let d=t.px-s/2,l=t.py-o/2,u=Math.hypot(d,l);u>1&&a.push(`--sx:${b(d/u*5*r)}px`,`--sy:${b(l/u*5*r)}px`)}return a.join(";")}function dn(e,n){return Math.round(n*e.scale)}function Ga(e,n,t,i,s){let o=ln(e.screen,t),r=(n.glass?28:25)*(o.y>.5?-1:1),a=(o.py+r)/e.screen.height;return c`<span class="ms-name" aria-hidden="true" style=${`left:${o.x*100}%;top:${b(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function Ya(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,o=t*.18,r=(n-i*2-s)/2,a=(t-o-i-s*2)/3,d=[0,1,2,3,4,5].map(l=>{let u=i+l%2*(r+s),f=o+Math.floor(l/2)*(a+s);return S`<rect class=${`ms-tile t${l%4}`} x=${b(u)} y=${b(f)} width=${b(r)} height=${b(a)} rx=${b(n*.06)}></rect>`});return c`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${b(i)} y=${b(t*.075)} width=${b(n*.4)} height=${b(t*.045)} rx=${b(t*.0225)}></rect>
    ${d}
  </svg>`}function te(e,n,t){return S`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function ar(e,n,t,i){return S`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${b(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${b(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function Za(e,n,t){if(e.beam==="none")return p;let i=e.beamColor,s=e.beamIntensity,o=n.width/2,r=n.height/2,a=t.x-o,d=t.y-r,l=Math.hypot(a,d),u=Math.atan2(d,a),f=(h,x)=>`${b(o+Math.cos(u+h)*x)},${b(r+Math.sin(u+h)*x)}`,w=b(t.x),m=b(t.y),g;switch(e.beam){case"sectorWedge":{let h=Math.PI/4;g=S`${te("ms-b8",8,n)}${te("ms-b3",3,n)}
        <polygon points=${`${o},${r} ${f(-h/2,l*1.2)} ${f(h/2,l*1.2)}`} fill=${i} fill-opacity=${b(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${o},${r} ${f(-h*.3,l)} ${f(h*.3,l)}`} fill=${i} fill-opacity=${b(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":g=S`${te("ms-b7",7,n)}${te("ms-b10",10,n)}${ar("ms-wash",i,.35*s,.18*s)}
        <circle cx=${b((o+t.x)/2)} cy=${b((r+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${w} cy=${m} r="40" fill=${i} fill-opacity=${b(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":g=S`${te("ms-b4",4,n)}${te("ms-b5",5,n)}${ar("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${w} cy=${m} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${w} cy=${m} r="25" fill=${i} fill-opacity=${b(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":g=S`${te("ms-b6",6,n)}
        <circle cx=${w} cy=${m} r="30" fill=${i} fill-opacity=${b(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(h=>S`<circle cx=${w} cy=${m} r=${b((30+h*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${b((1-h)*.45*s)} stroke-width=${b(2-h*1.2)}></circle>`)}`;break;case"wakeWave":g=S`${te("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${o} y1=${r} x2=${w} y2=${m}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${b(.5*s)}></stop></linearGradient>
        <line x1=${o} y1=${r} x2=${w} y2=${m} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(h=>{let x=1-h;return S`<circle cx=${b(o+a*h)} cy=${b(r+d*h)} r=${b((20+x*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${b((1-x)*.5*s)} stroke-width=${b(Math.max(1.5-x*1.2,.3))}></circle>`})}
        <circle cx=${w} cy=${m} r="18" fill=${i} fill-opacity=${b(.25*s)} filter="url(#ms-b4)"></circle>`;break}return S`<g class="ms-beam">${g}</g>`}function Xa(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":Ka(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${b(n.dim*.85)}`,`--ms-blur:${b(2+n.dim*4)}px`,`--ms-g-r:${b(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function un(e,n,t,i,s={}){let{width:o,height:r}=e.screen,a=e.scale,d=Math.min(o,r),l=Xa(e,t),u=[`width:${Math.round(o*a)}px;height:${Math.round(r*a)}px;--me-s:${a}`,l.style,s.style??""].filter(w=>w!=="").join(";"),f=c`<div class=${`me-screen ms-screen ${l.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${u}>
    <div class="ms-backdrop" aria-hidden="true">${Ya(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${o} ${r}`} aria-hidden="true">
      ${s.beamTo===void 0?p:Za(t,e.screen,s.beamTo)}
      <circle cx=${o/2} cy=${r/2} r=${d*we} class="me-track"></circle>
      ${t.finger?S`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${o/2} cy=${r/2} r=${b(d*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:p}
      <circle cx=${o/2} cy=${r/2} r=${d*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return $i({width:o,height:r},a,f,n)}function Qa(e,n,t,i){let s=it(e.document),o=dr(e.document,n),r=Ja(o,t),a=r===void 0?void 0:P(r.slot),d=t===void 0?void 0:P(t),l=(h,x=we)=>Ve(h,x),u=h=>a!==void 0&&C(P(h),a),f=(h,x,O,$,H)=>{let A=_(h),F=P(h),E=d!==void 0&&C(F,d),ne=h.isVisible===!1,yn=`${J(x)}: ${se(T(h))}${ne?", hidden":""}`,Sr=["me-dot",$,E?"on":"",ne?"off":"",u(h)&&$===""?"ms-active":""].filter($r=>$r!=="").join(" ");return c`<button type="button" class=${Sr} style=${an(e,s,O,A.color)}
      title=${yn} aria-label=${yn} aria-pressed=${E?"true":"false"} @click=${()=>be(e,n,F)}>
      ${Te(e,A.icon,dn(e,$===""?15:11),A.color)}${H>1?c`<span class="me-count" aria-hidden="true">${H}</span>`:p}</button>`},w=o.map(h=>{let x=l(h.position);if(x===void 0)return p;let O=p,$;if(h.main!==void 0)O=f(h.main,h.position,x,"",h.own.length),h.main.isVisible!==!1&&($=h.main);else if(h.shared!==void 0){let E=_(h.shared),ne=`${J(h.position)}: ${se(T(h.shared))}, from All`;O=c`<span class=${`me-dot inh${u(h.shared)?" ms-active":""}`} style=${an(e,s,x,E.color)} title=${ne}>
        ${Te(e,E.icon,dn(e,13),E.color)}</span>`,$=h.shared}else if(h.free){let E=J(h.position);O=c`<button type="button" class="me-dot free" style=${an(e,s,x)} ?disabled=${e.busy}
        title=${`Add a slot at ${E}`} aria-label=${`Add a slot at ${E}`}
        @click=${()=>tt(e,n,h.position)}>${M("plus")}</button>`}let H=h.second===void 0?void 0:l(h.position,.2),A=h.second===void 0||H===void 0?p:f(h.second,h.position,H,"two",0),F=s.labels&&$!==void 0?Ga(e,s,x,_($).color,re(e,$)):p;return c`${O}${A}${F}`}),m=r===void 0?void 0:l(r.position),g=ln(e.screen,m??{x:.5,y:.5-we});return un(e,`${i} on the watch`,s,w,{beamTo:{x:g.px,y:g.py}})}function ur(e){let n=t=>Math.min(1.18,Math.max(.82,t));return{w:n(e.width/198),h:n(e.height/242)}}function cr(e,n,t){let{width:i,height:s}=e,o=ur(e),r=34*o.w,a=i-34*o.w,d=52*o.h,l=s-30*o.h,u=(d+l)/2,f=i/2,w=18*o.w,m=8*o.h,g=[{x:f,y:d-14*o.h},{x:r+w,y:d+m},{x:r,y:u},{x:r+w,y:l-m},{x:f,y:l+8*o.h},{x:a-w,y:l-m},{x:a,y:u},{x:a-w,y:d+m}];if(t<=1)return g[0];let h=[0];for(let $=1;$<=g.length;$++){let H=g[$-1],A=g[$%g.length];h.push(h[$-1]+Math.hypot(A.x-H.x,A.y-H.y))}let x=h[g.length],O=n*x/t%x;for(let $=0;$<g.length;$++){let H=h[$],A=h[$+1];if(O>=H&&O<=A){let F=A>H?(O-H)/(A-H):0,E=g[$],ne=g[($+1)%g.length];return{x:E.x+(ne.x-E.x)*F,y:E.y+(ne.y-E.y)*F}}}return g[0]}function ec(e){return[...e].slice(0,4).join("").trim()}function tc(e){let n=it(e.document),t=ja(e.document),i=e.switcherPages,s=ee(e),o=Math.max(0,s===void 0?0:i.findIndex(m=>C(m.id,s.id))),{width:r,height:a}=e.screen,d=m=>({x:m.x/r,y:m.y/a,px:m.x,py:m.y}),l=i.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((m,g)=>{let h=d(cr(e.screen,g,i.length)),x=g===o,O=g===0&&!x,$=Math.round((x?.7:O?.4:.15)*t.glow*100),H=[lr(e,n,h,m.color),`--ms-ga:${$}%`,`--ms-gr:${x?45:30}`,`--ms-k:${x?t.scale:1}`].join(";"),A=["ms-sw",x?"ms-active":"",O?"ms-current":""].filter(E=>E!=="").join(" "),F=m.text===void 0?Te(e,m.icon,dn(e,n.glass?18:x?16:14),x&&!n.glass?"white":m.color):c`<span class="ms-sw-text">${ec(m.text)}</span>`;return c`<span class=${A} style=${H} title=${m.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${F}</span>`}),u=i[o],f=u===void 0?p:c`<span class="ms-sw-name" style=${`top:${b(8*ur(e.screen).h/a*1e4)/100}%`}>${u.name}</span>`,w=i.length===0?void 0:cr(e.screen,o,i.length);return un(e,"Page switcher on the watch",n,c`${l}${f}`,{beamTo:w,classes:"ms-switcher"})}function nc(e){if(R(e)==="switcher")return tc(e);let n=j(e);return n===void 0?un(e,"Entity quick menu on the watch",it(e.document),c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):Qa(e,n,ae(e,n),Yo(e,n))}var ic={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function sc(e,n,t,i){let s=P(t),o=i!==void 0&&C(s,P(i)),r=t.isVisible===!1,a=re(e,t),d=`${se(T(t))}${r?", hidden":""}`;return c`<button type="button" class=${`ms-label${o?" on":""}${r?" off":""}`} data-slot=${s}
    style=${`--k:${_(t).color}`} aria-pressed=${o?"true":"false"}
    @click=${()=>be(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${d}</small></span></button>`}function oc(e,n,t,i){let s=J(t.position),o=t.own.map(r=>sc(e,n,r,i));return t.shared!==void 0&&o.push(c`<span class="ms-label ms-inh" style=${`--k:${_(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${re(e,t.shared)}</b><small>From the All menu</small></span></span>`),o.length===0&&t.free&&o.push(c`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>tt(e,n,t.position)}>${M("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),c`<div class=${`ms-place ms-at-${t.position} ms-${ic[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${o}</div>`}function pr(e){let n=nc(e),t=R(e)==="switcher"?void 0:j(e);if(t===void 0)return c`<div class="me-stage-body">${n}</div>`;let i=ae(e,t);return c`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${dr(e.document,t).map(s=>oc(e,t,s,i))}
  </div></div>`}var rc=c`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function hr(e){let n=R(e),t=it(e.document),i=p;if(n!=="switcher"){let o=j(e),r=o===void 0?[]:Ht(e.document,o),a=o===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=c`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||o===void 0||r.length===0}
      title=${a} @click=${()=>{o!==void 0&&tt(e,o)}}>${M("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?p:c`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>za(e)}>${rc}<span class="word">Play opening</span></button>`;return i===p&&s===p?c``:c`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function mr(e){if(R(e)!=="entity")return p;let n=j(e);return n===void 0||ae(e,n)===void 0?p:c`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Re(e)}>Change the type or entity</button></span>`}var ac={anywhere:{gesture:"hold",open:"Touch and hold an empty spot on any page, slide to a slot, then lift your finger.",use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to a slot, then lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"pull",open:"Pull down from the top of the screen, slide to a page, then lift your finger.",use:"Jumping between your pages. Pick a page in the Pages card to set how it shows here."}};function cc(e){let n=e==="hold"?S`<circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="9.5" opacity=".45"></circle>`:e==="tile"?S`<rect x="4" y="5" width="16" height="14" rx="4"></rect><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="5" opacity=".5"></circle>`:S`<path d="M5 3.5h14"></path><path d="M12 6.5v11"></path><path d="M8 13.5l4 4 4-4"></path>`;return c`<svg class="ms-howto-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`}function fr(e){let n=ac[R(e)];return c`<section class="ms-howto" aria-label="How it opens">
    <span class="ms-howto-chip">${cc(n.gesture)}</span>
    <span class="ms-howto-t">
      <span class="ms-howto-k">How it opens</span>
      <b>${n.open}</b>
      <span class="ms-howto-use"><span class="ms-howto-k">Good for</span> ${n.use}</span>
    </span>
  </section>`}var gr=z`
  /* How the shown menu opens, above the watch. */
  .ms-howto {
    position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 12px;
    width: min(560px, calc(100% - 24px)); box-sizing: border-box; margin: 4px auto 10px; padding: 12px 14px;
    border: 1px solid var(--wa-line-strong); border-radius: 12px; background: var(--wa-card); color: var(--wa-ink);
  }
  .ms-howto-chip {
    flex: none; width: 38px; height: 38px; box-sizing: border-box; display: grid; place-items: center;
    border: 1px solid var(--wa-hue-orange); border-radius: 10px; color: var(--wa-ink);
  }
  .ms-howto-art { width: 22px; height: 22px; }
  .ms-howto-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; font-size: 13px; line-height: 1.4; }
  .ms-howto-t > b { font-weight: 600; }
  .ms-howto-k { font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
  .ms-howto-use { font-size: 12.5px; color: var(--wa-label); }
  .ms-howto-use > .ms-howto-k { margin-right: 4px; }

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
`;function pn(e){if(e.length===0)return"";let n=e.map(i=>ks(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function wr(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${pn(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function xr(){return Ts()||Fi()}Ks({dirty:xr,drop:()=>{Rs(),zi()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{xr()&&(e.preventDefault(),e.returnValue="")});var dc=15e3,kr=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),hn=kr?"\u2318":"Ctrl+",mn={min:200,max:720,middleMin:320},fn={left:280,right:320},gn="wrist-assistant-panel.menus.columns.v1",lc="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",uc=24,br=820;function wn(e){return He(e).message}function st(e){return He(e).code}function ot(e){let{code:n,message:t}=He(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function pc(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function hc(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":Rn(Math.max(0,(Date.now()-n)/1e3))}function mc(e){return e==="panel"?"Saved here":"From the watch"}function fc(e){return e instanceof HTMLElement?wi(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function gc(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function wc(e){return ie(e)?gt(e).filter(n=>!bt(n)&&Ji(Ie(n))).map(n=>({id:Ie(n),name:wt(n)})):[]}var yr=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function rt(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var bc="#8E8E93";function bn(e){if(!ie(e))return[];let n=0;return gt(e).filter(t=>!xi(t)&&!bt(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=wt(t),o=rt(t.switcherIcon)??rt(vi(t)[0]?.icon)??(ki(t)?"bolt.fill":"square.grid.2x2.fill"),r=i?bc:yr[n++%yr.length],a=rt(t.switcherColor)??r,d=t.switcherDisplayMode==="icon"?void 0:rt(t.switcherText)??s;return{id:Ie(t),name:s,icon:o,color:a,...d===void 0?{}:{text:d},hidden:i}})}function Xd(e){return bn(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var vr={ok:0,warn:1,err:2};function yc(e,n){return e===void 0?n:n===void 0?e:{kind:vr[n.kind]>vr[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function vc(e){let n=Le(e)??{},t=q(n,{list:"anywhere"}).length,i=$e(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(t)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var y=class extends vn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new Un(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Wo();this.columns={...fn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new di(this);this.symbols=new Zn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!gc()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,o=t.key.toLowerCase();if(s&&!t.altKey&&o==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!fc(i[0])){if(s&&!t.altKey&&o==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&o==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let r=this.viewHost();r!==void 0&&Re(r)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(lc)))return;let r=this.viewHost();r!==void 0&&Re(r)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=t.composedPath(),s=o=>i.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(ii,this.onScrubStart),this.addEventListener(si,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return _n(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let t=this.watchId,i=this.record;if(!(t===void 0||i===void 0)){if(i.revision>0){let s=Y(t);if(s!==void 0)return s;let o=Le(i.document);return o===void 0?void 0:_t(t,o,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return Y(t)??Nt(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return Tt(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return wc(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(Y(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return ee({uiState:this.uiState,switcherPages:[],switcherRows:bn(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Jn(gn,fn,mn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,xn(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=Bn(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),hi(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let r=()=>this.pagesSaveEnded(t);i.then(r,r)}let s=Y(t)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let o=()=>this.saveEnded(t);s.then(o,o)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,i=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(t),this.load(t,i),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let o=await N(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=Os(o)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:qt(t),defaults:Ls(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let o=await N(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=Ai(o)}catch(o){if(s!==this.catalogSeq||t!==this.watchId)return;$t(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await Tn(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=Qn(s)}catch(s){if(i!==this.httpLibrarySeq)return;ei(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let o=await N(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=Ii(o)}catch(o){if(s!==this.statusPagesSeq||t!==this.watchId)return;$t(o)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let o=await N(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&ie(o.document)&&!(Tt(t)?.saving??!1)&&ji(t,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let o=await N(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=o.revision>0&&ie(o.document)?o.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await N(s,t,"menus");if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;$s(r)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=wn(r)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let i=this.watchId;this.record=t,i!==void 0&&t.revision<=0&&Nt(i);let s=t.revision>0?Le(t.document):void 0;if(i===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===i&&t.revision>=o.revision&&(this.restartDraft=void 0,(Y(i)?.dirty??!1)||Ue(i));let r=_t(i,s,t.revision);r.replaced.length>0?this.note={kind:"warn",text:pn(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await kn(i,t,"menus");if(s!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||t!==this.watchId)return;this.historyState=st(o)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;Mn(i,t,o=>{s===this.subscribeSeq&&(o.kind==="catalog"?Di(o,this.catalog)&&this.loadCatalog(t):o.kind==="status_pages"?this.loadStatusPages(t):o.kind==="pages"?this.loadPages(t):o.kind==="behavior"?this.loadBehavior(t):o.kind==="voice"?this.loadVoice(t):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Wn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},dc))}async poll(){this.pollTimer=void 0;let t=this.hass,i=this.watchId,s=this.record;if(!(!t||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await N(t,i,"menus");if(i!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),o}editPages(t,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let o=this.scrubKey??i,r=s.apply(t(s.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??gi,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=bi(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:ti(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:qt(this.voiceDocument)}}screen(){let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(pt(t?.screen_size)??ut).screen}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,o=bn(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get busy(){return s.saving},edit:(r,a)=>this.draft===t&&this.edit(r,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let i=this.pagesDraft;if(i===void 0||St(i.document,t)===void 0)return;let s=this,o=this.memoIcons();return{pageId:t,icons:o,symbols:this.symbols,uiState:this.uiState,get page(){return St(i.document,t)??{}},get busy(){return s.saving},edit:(r,a)=>{this.pagesDraft===i&&this.editPages(r,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(t||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.watchId;this.endScrub();let s=this.draft,o=this.pagesDraft;if(!t||i===void 0||!s||this.saving)return;let r=s.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let d=r?await this.saveMenus(t,i,s,s.revision<=0):void 0,l=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(t,i,o):void 0;i===this.watchId&&(this.note=yc(d,l))}async saveMenus(t,i,s,o=!1){let r=Ms(s,{prepare:xs,save:(d,l)=>at(t,i,"menus",d,l).catch(u=>{throw ot(u)}),fetch:async()=>{let d=await N(t,i,"menus").catch(l=>{throw ot(l)});return{revision:d.revision,document:d.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await r.catch(d=>({ok:!1,revision:s.revision,merged:!1,code:st(d)??"unknown",message:wn(d)}));return this.saveEnded(i),Vs(o,a.code,wr(a))}async savePages(t,i,s){let o=Ui(s,{prepare:a=>Ki(Ei(a),s.base,this.hass?.states),save:(a,d)=>at(t,i,"pages",a,d).catch(l=>{throw ot(l)}),fetch:async()=>{let a=await N(t,i,"pages").catch(d=>{throw ot(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:st(a)??"unknown",message:wn(a)}));return this.pagesSaveEnded(i),zn(r)}startFresh(){let t=this.watchId;t===void 0||!qn(this.noRecordState())||(Ws("menus",t),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let i=this.hass,s=this.watchId,o=this.record;if(!i||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:t,baseRevision:o.revision};this.restoreAsk=r,Sn(i,s,"menus",t.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:vc(a.document)})},()=>{})}async restore(){let t=this.hass,i=this.watchId,s=this.restoreAsk;if(!t||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await $n(t,i,"menus",s.entry.revision,s.baseRevision);o={kind:"ok",text:yi(s.entry.updated_at)},i===this.watchId?this.restartDraft={watchId:i,revision:r.revision}:(Y(i)?.dirty??!1)||Ue(i)}catch(r){let a=st(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds menus for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${Xn(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=o,this.load(i,!0))}render(){let t=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,t):p}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=br}renderTopBar(t,i){let s=t!==void 0&&!this.unsupported,o=s&&this.dirty,r=this.shellOwnsWatch;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${M("menu")}</button>`:p}
      ${r?p:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():js(void 0,!1)}>${M("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?p:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?jn({newWatch:this.newWatch,dirty:o,saved:ft(this.record)}):p}
      ${this.renderSyncPill(s?t:void 0)}
      ${this.renderTopMenu(s?t:void 0)}
      ${s?c`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${hn}S). A save reaches the watch the next time it checks.`:`Nothing to save (${hn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:c`<span class="tb-saved" title=${o?"Unsaved changes":""}>${ft(this.record)}</span>
        ${Bs(Ns({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:p}
      ${r?p:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():zs(void 0)}>${M("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(Fs,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return p;let s=t===void 0?{size:0,limit:1}:Rt(t.document),o=mt({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState});return c`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(t=this.watches){return Nn(t.find(i=>i.owner_watch_id===this.watchId))}opensReady(t=this.watches){return _s(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let i=this.canStartFresh();if(t===void 0&&!i)return p;let s=this.topMenuOpen,o=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:p}
        ${i?c`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${ct}</button>`:p}
      </div>`:p}
    </span>`}personColor(t){let i=ai(this.owners.length>0?this.owners:this.ownList??[]);return ci(i.findIndex(s=>s.owners.some(o=>o.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return p;let i=t.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.personColor(r);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${M("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(i?.owner_watch_id)}<span class="tb-browse-l">${i?Ee(i,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${M("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(r=>{let a=r.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${Ee(r,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?M("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=br?this.columns:Kn(this.hostWidth-uc,this.columns,mn)}renderGutter(t){return c`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();Gn(i,{side:t,base:t==="left"?s.left:s.right,limits:mn,onWidth:o=>{this.columns={...this.columns,[t]:o}},onEnd:()=>lt(gn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:fn[t]},lt(gn,this.columns)}}></div>`}get stageScale(){return this.zoom??yt(this.narrow||this.stacked)}setZoom(t){this.zoom=t,_o(t)}renderStage(t,i){let s=i.find(u=>u.owner_watch_id===this.watchId),o=pt(s?.screen_size),r=o??ut,a=[...er(t),r.label],d=this.undoDraft,l=on(R(t));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Ee(s,i)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${o===void 0?`${r.label}, this watch's size is not known`:a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!d?.canUndo} title=${`Undo (${hn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${M("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!d?.canRedo} title=${kr?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${M("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(r.label,t)}
        ${fr(t)}
        ${pr(t)}
        <div class="under"><span class="tail">${tr(t)}</span>${mr(t)}</div>
      </div>
    </div>`}renderStageTools(t,i){let s=this.stageScale,o=yt(this.narrow||this.stacked);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${hr(i)}
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${t}.`}>
        ${M("watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=xt(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(xt(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${ve(s)}. Back to fit`}
          title=${`The watch at ${ve(s)} of its own points. Click to fit it again (${ve(o)}).`}
          @click=${()=>this.setZoom(void 0)}>${ve(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=vt(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(vt(s))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${Wt}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${l===void 0?p:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return c`<div class="pe-empty"><b>${Wt}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:Y(this.watchId),u=this.watchId;return c`<div class="pe-empty"><b>${Ss}</b><span>${Vn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ct}</button>
        ${l?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Ue(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let o=this.viewHost();if(o===void 0)return c`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",d=i.revision<=0;return c`${d&&this.barHost===void 0?qs():p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Xo(o)}
        ${Qo(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${ir(o)}
      </div>
    </div>
    ${d?p:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(t,i,s){let o=Rt(i),r=mt({record:t,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState}),a=this.watchId;return c`${li({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?ui({noun:"menus",record:t,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?pi({noun:"menus",document:i,revision:t.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{mi(d).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(t){let i=this.record,s=hc(t.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${mc(t.entry.updated_by)}${s?` ${s}`:""}, ${pc(t.entry.size)}.</p>
      ${t.summary?c`<p class="pe-muted">${t.summary}</p>`:p}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Dn,Pn,Cn,En,Hn,An,In,On,Mi,Us,z`
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
  `,rr,gr,Po,fi,Fn]}};v([I({attribute:!1})],y.prototype,"hass",2),v([I({attribute:!1})],y.prototype,"owners",2),v([I({attribute:!1})],y.prototype,"ownerId",2),v([I({type:Boolean,reflect:!0})],y.prototype,"narrow",2),v([I({attribute:!1})],y.prototype,"icons",2),v([I({attribute:!1})],y.prototype,"iconsTick",2),v([I({attribute:!1})],y.prototype,"haMenu",2),v([I({attribute:!1})],y.prototype,"onHaMenu",2),v([I({attribute:!1})],y.prototype,"onBack",2),v([I({attribute:!1})],y.prototype,"onPages",2),v([I({attribute:!1})],y.prototype,"barActions",2),v([I({attribute:!1})],y.prototype,"shellOwnsWatch",2),v([I({attribute:!1})],y.prototype,"barHost",2),v([k()],y.prototype,"watchId",2),v([k()],y.prototype,"record",2),v([k()],y.prototype,"unsupported",2),v([k()],y.prototype,"catalog",2),v([k()],y.prototype,"statusPages",2),v([k()],y.prototype,"httpLibrary",2),v([k()],y.prototype,"pagesRecord",2),v([k()],y.prototype,"behavior",2),v([k()],y.prototype,"voiceDocument",2),v([k()],y.prototype,"loading",2),v([k()],y.prototype,"loadError",2),v([k()],y.prototype,"history",2),v([k()],y.prototype,"historyState",2),v([k()],y.prototype,"note",2),v([k()],y.prototype,"restoreAsk",2),v([k()],y.prototype,"restoring",2),v([k()],y.prototype,"historyOpen",2),v([k()],y.prototype,"rawOpen",2),v([k()],y.prototype,"rawCopied",2),v([k()],y.prototype,"ownList",2),v([k()],y.prototype,"topMenuOpen",2),v([k()],y.prototype,"watchMenuOpen",2),v([k()],y.prototype,"zoom",2),v([k()],y.prototype,"columns",2),v([k()],y.prototype,"hostWidth",2),v([k()],y.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",y);export{gn as ME_COLUMNS_KEY,yr as WATCH_SWITCHER_COLORS,bc as WATCH_SWITCHER_LEFT_OUT_COLOR,y as WaMenuEditor,yc as joinSaveNotes,wc as watchMenuPageTargets,vc as watchMenusSummary,Xd as watchSwitcherPages,bn as watchSwitcherRows};
