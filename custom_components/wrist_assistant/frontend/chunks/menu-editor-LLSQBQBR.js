import{a as je,g as Fe,h as Ft}from"./chunk-RUZTQMS7.js";import{d as Ts,e as z,f as qt,g as Bt,h as Ue,i as Ps,j as Rs}from"./chunk-Z52GC7I4.js";import{L as Cs,M as Es,N as As,a as ji,b as Ct,e as Fi,i as Ki,j as zi,la as Os,ma as Ds,na as jt,oa as Ws}from"./chunk-IOJIKNHC.js";import{o as ki,p as St,q as be,r as $t,s as kt,w as Pi,x as Ri,y as Ci,z as Ei}from"./chunk-YBXTPCVB.js";import{b as Jn,c as pt,d as Gn,e as ht,f as Yn}from"./chunk-ZOJGMATP.js";import{$ as Se,A as P,B as _e,C as Ne,D as F,E as Ve,F as ss,G as os,H as Lt,I as rs,J as as,K as cs,L as ds,M as ls,N as us,O as Ot,P as Dt,Q as ps,R as hs,S as ms,T as fs,U as Wt,V as _t,W as gs,X as Nt,Y as ws,Z as qe,_ as bs,a as ye,aa as ys,ba as vs,ca as ne,d as Oe,da as K,e as Et,ea as Be,fa as re,g as At,ga as xs,h as Gi,ha as Ss,i as ee,ia as $s,j as te,k as Yi,ka as ks,l as M,la as Vt,m as ve,ma as Ms,n as Zi,o as De,p as Xi,q as Ht,r as It,s as Qi,t as es,u as xe,v as ts,w as We,x as ns,y as is,z as D}from"./chunk-PSSYGLHG.js";import{a as _s,b as Ns,c as Vs,d as qs,e as Bs,f as Us,g as js}from"./chunk-FMEYBIGP.js";import{Pa as _i,Qa as Rt,Ra as Ni,Sa as Vi,Ta as qi,Ua as Bi,b as Hi,c as Ii,cb as Le,d as Li,db as Ui,j as Oi,m as Di,o as Pt,p as Wi,xb as Ji}from"./chunk-XDMMZFSQ.js";import{Ib as Hs,Jb as Is,Kb as Ls,Mb as Ut,sa as Ai}from"./chunk-UDRG2OIJ.js";import{a as wt,b as bt,c as li,d as ui,e as pi,f as hi,g as mi,h as fi,i as gi,j as Mi,k as Ti}from"./chunk-D4NRPTOW.js";import{b as ci,p as di,w as vi}from"./chunk-ZCSIZ55J.js";import{a as wi,b as bi,d as yi}from"./chunk-QUOL6HJ4.js";import{$b as He,$c as Js,Ab as ei,Bb as ti,Cb as ni,Ib as ii,Jb as si,Kb as oi,Lb as ri,Mb as ai,Nb as j,Ob as O,Pb as we,Q as mt,Rb as H,Sb as oe,V as ft,Xa as Qn,Yc as Fs,Zb as gt,Zc as Ks,_c as zs,fe as Gs,h as Rn,na as Xn,s as Zn}from"./chunk-QGE7WOWS.js";import{Ag as lt,Bg as $n,Cg as kn,Dg as Mn,Eg as Tn,Fg as Pn,_h as _n,b as U,c as d,cg as Sn,d as $,dh as A,eh as k,f as p,hj as Un,i as xn,ih as Cn,ii as Nn,j as C,ji as Ee,jj as jn,k as x,kh as En,kj as Fn,lh as An,lj as Kn,mh as Hn,mi as Vn,nh as In,ni as qn,oh as Ln,oi as ut,ph as On,pi as Bn,qh as Dn,yg as L,zh as Wn}from"./chunk-RYLMRUWW.js";import{f as Tt}from"./chunk-WIDK423N.js";import{Q as Mt,j as Q,l as yt,m as xi,n as Ie,o as vt,p as Si,q as xt,r as $i}from"./chunk-Y5WD6GQY.js";import{a as Ae,b as zn}from"./chunk-KXSD4G27.js";import{a as y}from"./chunk-LO2NM3CE.js";var Jt="In the page switcher",$r=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],Gt="switcher-settings",Ys=`${Gt}:resetDot`;function Zs(e){return Ui(e,$r,n=>{let t=Le(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function Xs(e){let n=Le(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function Yt(e,n){return`${Gt}:typed:${e.pageId.toUpperCase()}:${n}`}function Kt(e,n){let t=e.uiState.get(Yt(e,n));return typeof t=="string"?t:void 0}function kr(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function Mr(e){let n=kr(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...e.uiState.keys()])i.startsWith(`${Gt}:typed:`)&&(t===void 0||i!==Yt(e,t))&&e.uiState.delete(i)}function ae(e,n,t=!1){let i=e.uiState.delete(Ys);e.busy||e.edit(n,t&&!i?{typing:!0}:void 0)}function zt(e,n,t){let i=Yt(e,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return d`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&e.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(Ys,!0))}}}
    @change=${a=>{let c=a.target;typeof HTMLInputElement>"u"||!(c instanceof HTMLInputElement)||(c.type==="color"&&e.endCoalesce(),c.type==="checkbox"&&(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function Qs(e){Mr(e);let n=e.page,t=Le(n),i=t.switcherDisplayMode??"text",s=_i.map(c=>[c,c==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=c=>ae(e,l=>Rt(l,e.pageId,c)),a=c=>ae(e,l=>Ni(l,e.pageId,c),!0);return d`
    ${H("Hidden",t.hideFromSwitcher,c=>ae(e,l=>Bi(l,e.pageId,c)),!1)}
    ${t.hideFromSwitcher?d`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:p}
    ${O("Show as",s.some(([c])=>c===i)?i:"text",s,c=>ae(e,l=>qi(l,e.pageId,c)))}
    ${zt(e,"switcherText",ri("Name",Kt(e,"switcherText")??t.switcherText??"",c=>ae(e,l=>Vi(l,e.pageId,c),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>ae(e,c=>Rt(c,e.pageId,""))}>Automatic icon</button>
    </div>
    ${zt(e,"switcherIcon",He({icons:e.icons,symbols:e.symbols},Kt(e,"switcherIcon")??t.switcherIcon??"",r,"sw:switcher-icon",{emptyText:"Picked by the watch",tint:t.switcherColor}))}
    ${zt(e,"switcherColor",d`<div class="ts-no-alpha">${oe("Color",Kt(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var J=je.routing;function Zt(e){return J.actions.find(n=>n.action===e)}function G(e){return Zt(e)?.keys??[]}function W(e){return Object.hasOwn(J.keys,e)?J.keys[e]:void 0}function de(e){return Q(e.voiceConfig)?e.voiceConfig:{}}function Tr(e,n){let t=J.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function Y(e,n){let t=W(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=J.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?Tr(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,o]=t.clamp??[-1/0,1/0];return Math.min(o,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function to(e,n){let t=W(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=Y(e,i[1]),o=i[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof s=="string"&&o.includes(s);return i[2]===void 0?r:!r}function Ke(e,n){let t=W(n);if(t?.type!=="enum")return[];let i=J.labels[t.enum??""]??{},s=J.offered[n]??J.enums[t.enum??""]??[],o=Y(e,n);return(typeof o=="string"&&!s.includes(o)?[o,...s]:s).map(a=>[a,i[a]??a])}function no(e){return W(e)?.label??Pr[e]??e}var Pr={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Xt(e,n,t){let i=W(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!Ke(e,n).some(([r])=>r===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[r,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(r,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let r=(t??"").trim();if(r==="")return Ft(e,n);s=r;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let r=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return Ft(e,n);s=r;break}}return(Object.hasOwn(e,n)?Mt(e[n],s):Mt(Y(e,n),s))?e:Fe(e,n,s)}function io(e,n,t,i){let s=Y(e,n),o=Array.isArray(s)?s:[];return i===o.includes(t)?e:Xt(e,n,i?[...o,t]:o.filter(r=>r!==t))}function Rr(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function Cr(e,n){let t=W(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=Y(e,s);return typeof o=="string"&&i.includes(o)}function Qt(e,n,t,i){let s=W(n);if(s===void 0)return"None";if(!Cr(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let o=Rr(s,t);return typeof o=="string"&&o.trim()!==""?`Default (${i(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function eo(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function ce(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function ze(e,n,t){let i=eo(n),s=eo(t);return e.filter(o=>!ce(i,o)&&(s.length===0||ce(s,o)))}function Er(e,n){return{hiddenPhraseIds:e.filter(t=>!ce(n,t)),knownPhraseIds:e.slice()}}function so(e,n,t,i){if(!ce(n,t))return e;let s=ze(n,e.hiddenPhraseIds,e.knownPhraseIds);if(ce(s,t)===i)return e;let o=i?n.filter(a=>ce(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),r=Er(n,o);return Fe(Fe(e,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function oo(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function Ar(e,n,t,i,s){return _e(e,n,t,o=>{if(!G(M(o)).includes(i))return o;let r=de(o),a=Xt(r,i,s);return a===r?o:At(o,"voiceConfig",a)})}function Hr(e,n,t,i,s,o){return _e(e,n,t,r=>{if(!G(M(r)).includes(i))return r;let a=de(r),c=io(a,i,s,o);return c===a?r:At(r,"voiceConfig",c)})}function Ir(e,n,t,i,s,o){return _e(e,n,t,r=>M(r)==="ttsMenu"?so(r,i,s,o):r)}function ro(e){return Object.keys(de(e)).some(n=>G(M(e)).includes(n))}function ao(e){let n=M(e);return G(n).length>0||n==="ttsMenu"}function co(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Lr(e,n,t,i){let s=Ls(e.hass.states),o=Ut(s,t),r=a=>H(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),c=>i(a.entityId,c));return d`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function Or(e,n,t,i){let s=W(t),o=oo(e.voice?.defaults),r=s?.domain==="conversation"?Hs(e.hass.states):Is(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=Ut(r,i===""?[]:[i]);return[["",Qt(n,t,o,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??co(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function Dr(e,n,t,i,s){let o=W(s);if(o===void 0||!to(i,s))return p;let r=no(s),a=Y(i,s),c=(l,u)=>e.edit(m=>Ar(m,n,t,s,l),u);switch(o.type){case"enum":return j(r,String(a),Ke(i,s),l=>c(l),{snapBack:!0,def:String(o.default)});case"bool":return H(r,a===!0,l=>c(l),o.default);case"int":{let l=typeof a=="number"?a:Number(o.default),u=je.volume,[m,g]=o.clamp??[u.min,u.max];return d`${we(r,l,f=>c(f,`slot:${t}:${s}`),{min:m,max:g,step:u.step,def:Number(o.default),format:f=>`${Math.round(f)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(f=>d`<button type="button" class="pe-chip ${f.value===l?"on":""}"
          aria-pressed=${f.value===l?"true":"false"} @click=${()=>c(f.value)}>${f.label} ${f.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return j(r,l,Or(e,i,s,l),u=>c(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=oo(e.voice?.defaults),m=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${Qt(i,s,u,g=>co(e.hass,g))}.`:"None picked.";return d`${Lr(e,r,l,(g,f)=>e.edit(v=>Hr(v,n,t,s,g,f)))}
        <div class="hint ${l.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${l.length===0?m:`${l.length} picked.`}</div>`}}}function Wr(e,n,t){let i=typeof t.id=="string"?t.id:"",s=de(t),o=G(M(t));return d`${e.voice?.defaults===void 0?d`<div class="hint">${Ws}.</div>`:p}
    ${o.map(r=>Dr(e,n,i,s,r))}`}function _r(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return d`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return d`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=s.map(u=>u.id),r=ze(o,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],c=a.length>0&&o.some(u=>!a.some(m=>m.toUpperCase()===u.toUpperCase())),l=u=>r.some(m=>m.toUpperCase()===u.toUpperCase());return d`<div class="me-sub-h">${Zt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>H(u.name,l(u.id),m=>e.edit(g=>Ir(g,n,i,o,u.id,m))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${s.length} show on the watch.`}</div>
    ${c?d`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function lo(e,n,t){let i=M(t);if(i==="ttsMenu")return _r(e,n,t);if(G(i).length>0)return Wr(e,n,t)}function uo(e,n){let t=M(n);if(t==="ttsMenu"){let r=e.voice?.phrases;return r===void 0?"":`${ze(r.map(c=>c.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let i=de(n),s=G(t)[0];if(s===void 0)return"";let o=Y(i,s);return Ke(i,s).find(([r])=>r===o)?.[1]??""}function fo(e,n,t,i,s,o,r=""){return d`<div class="mi-look">
    <div class="mi-look-title">${ii(e,n,t,c=>o(c),c=>i.find(([l])=>l===c)?.[1]??c)}</div>
    <div class="mi-pics ${r}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([c,l])=>{let u=c===n;return d`<button type="button" class="mi-pic ${u?"on":""}" aria-pressed=${u?"true":"false"} aria-label=${`${e}: ${l}`}
          @click=${()=>{c!==n&&o(c)}}>${s(c)}<span class="mi-pic-name">${l}</span></button>`})}
    </div>
  </div>`}function Ye(e,n,t,i,s){return d`<div class="mi-switch">${H(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function Nr(e){return d`<div class="mi-wrap">${e}</div>`}function Ze(e,n){return ne(e).find(t=>t.key===n)}function en(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function Xe(e,n,t){return ne(n).some(i=>t.includes(i.key)&&Be(e,n,i)&&!en(K(e,n,i),i.default))}function Je(e,n,t){let i=Ze(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:K(e.document,n,i),set:(o,r=!1)=>e.edit(a=>xs(a,n,t,o),r?s:void 0)}}function tn(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function Qe(e,n){return n===void 0?p:we(e,tn(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function po(e,n,t,i){if(n===void 0)return p;let s=n.value===!0?"on":"off",o=n.field.default===!0?"on":"off";return fo(e,s,o,[["off",t[0]],["on",t[1]]],r=>i(r==="on"),r=>n.set(r==="on"))}var go=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],wo=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],ho=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function Vr(e){return d`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function qr(e){return d`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function Br(e){if(e===void 0)return p;let n=tn(e),t=(e.field.presets??ho.map(([s,o])=>({value:s,label:o}))).map(s=>[String(s.value),ho.find(([o])=>en(o,s.value))?.[1]??s.label]),i=t.find(([s])=>en(Number(s),n))?.[0]??"";return d`${O("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${Qe("Exact",e)}`}function bo(e){let n=i=>Je(e,"quickAction",i),t=n("showContextLabel");return d`
    ${po("Behind the ring",n("showIconBubble"),["Solid","Glass"],Vr)}
    ${Br(n("backgroundDim"))}
    ${po("Buttons",n("showNeonOutline"),["Plain","Neon"],qr)}
    ${t===void 0?p:Ye("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${Qe("Glow",n("glowIntensity"))}`}function yo(e){let n=t=>{let i=Ze("quickAction",t);return i===void 0?void 0:K(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function Ur(){let e=re("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function jr(e){let n=$``;switch(e){case"sectorWedge":n=$`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=$`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=$`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=$`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=$`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return d`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function Fr(e,n){if(n===void 0||!Be(e.document,"quickAction",n.field))return p;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return d`<div class="ts-no-alpha">${oe("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?p:d`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let o=s.toUpperCase()===t.toUpperCase();return d`<button type="button" class="ts-swatch ${o?"on":""}" aria-pressed=${o?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function vo(e){let n=r=>Je(e,"quickAction",r),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),o=n("showFingerShadow");return d`
    ${t===void 0?p:Nr(O("Opening",String(t.value),re("EntranceStyle"),r=>t.set(r),{def:String(t.field.default)}))}
    ${i===void 0?p:fo("Beam from your finger to the slot",String(i.value),String(i.field.default),Ur(),jr,r=>i.set(r),"beams")}
    ${Fr(e,n("beamColor"))}
    ${s===void 0||!Be(e.document,"quickAction",s.field)?p:Qe("Beam strength",s)}
    ${o===void 0?p:Ye("Finger shadow",o.value===!0,r=>o.set(r),o.field.default===!0,"A soft dark spot where your finger rests.")}`}function xo(e){let n=s=>{let o=Ze("quickAction",s);return o===void 0?"":String(K(e,"quickAction",o))},t=(s,o)=>re(s).find(([r])=>r===o)?.[1]??o,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var So=["glowIntensity","selectedScale"];function le(e){return Math.round(e*1e3)/10}function $o(e){let n=Je(e,"pageSwitcher","glowIntensity"),t=Je(e,"pageSwitcher","selectedScale");return d`${Qe("Glow",n)}
    ${t===void 0?p:we("Picked page size",le(tn(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:le(t.field.min??1),max:le(t.field.max??1.5),step:le(t.field.step??.05),def:le(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function ko(e){let n=Ze("pageSwitcher","selectedScale"),t=n===void 0?void 0:K(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(le(t))}%`:""}function Ge(e,n,t,i){return e.render(n,t,i)??d`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var Mo=["light","switch","lock","cover","climate","media_player"],Kr={media_player:"Media player"};function To(e,n,t,i,s){let o=t.some(a=>a.domain===n),r=o?[["","Pick another type"],...i]:[...i];return d`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let c=a.domain===n,l=Kr[a.domain]??a.label;return d`<button type="button" class="mi-pic mi-type ${c?"on":""}" aria-pressed=${c?"true":"false"} data-type=${a.domain}
          @click=${()=>{c||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${Ge(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${l}</span></button>`})}
    </div>
    ${j("More types",o?"":n,r,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function Po(e,n,t,i){return d`<div class="mi-acts">${t.map(s=>d`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(o=>{let r=o.raw===n,a=!r&&o.why!==void 0;return d`<button type="button" class="mi-act ${r?"on":""}" aria-pressed=${r?"true":"false"} ?disabled=${a} data-action=${o.raw}
        title=${o.why??p} @click=${()=>{r||i(o.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${Ge(e,o.icon,14,o.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${o.label}</span>${o.pro?d`<span class="mi-pro" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:p}
          ${o.why===void 0||r?p:d`<small class="mi-act-why">${o.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var zr=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function mo(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function Ro(e,n,t,i){let s=new Map(t.map(r=>[r.position,r])),o=r=>{if(r===null)return d`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(r);if(a===void 0)return d`<span class="mi-where-cell" aria-hidden="true"></span>`;let c=a.here?"here":a.holder===void 0?"free":"held",l=a.here?Ge(e,n.icon,14,n.color):a.holder===void 0?k("plus"):Ge(e,a.holder.icon,13,a.holder.color);return d`<button type="button" class="mi-where-cell ${c}" data-place=${r} aria-label=${mo(a)} title=${mo(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:p}
      @click=${()=>{a.here||i(r)}}>${l}</button>`};return d`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${zr.map(r=>r.map(o))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var Co=U`
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
`;var Io=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],Lo="Each page's icon, color and name are set here: pick a page in the Pages card.",Jr="Pick a page in the Pages card to set how it shows here.",Gr={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},Oo={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:Lo},Yr="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Zr="Click a slot or its label to edit it. Click anywhere else for the menu's look.",he=.36,on=44,rn=22;function Do(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function tt(e,n,t=he){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=o=>Math.round(o*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var Wo="wrist-assistant-panel.menus.zoom.v1";function _o(e=pt()){try{let n=e?.getItem(Wo);if(n==null||n==="")return;let t=Number(n);return ki.includes(t)?t:void 0}catch{return}}function No(e,n=pt()){try{n?.setItem(Wo,e===void 0?"":String(e))}catch{}}var Vo={name:{color:A.place,icon:"text"},slot:{color:A.content,icon:"content"},where:{color:A.position,icon:"place"},look:{color:A.look,icon:"look"},shows:{color:A.states,icon:"states"},menu:{color:A.content,icon:"content"},style:{color:A.look,icon:"look"},motion:{color:A.look,icon:"radial"},switcherPage:{color:A.content,icon:"watch"}},Xr="#26a69a",Qr=A.complication,E="menu-editor";function $e(e,n,t){return`${e} ${e===1?n:t}`}function ue(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function qo(e,n){return{entityId:n,displayName:n===""?"":ue(e,n),domain:De(n)}}function ke(e,n,t,i){return e.icons.render(n,t,i)??d`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function I(e){return ee(M(e))===void 0?{icon:ye.unknownActionIcon,color:ye.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function Bo(e){let n=M(e);if(n==="triggerEntity"){let i=ve(e).entityId;return It(De(typeof i=="string"?i:""))}let t=ee(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function T(e,n){return e.toUpperCase()===n.toUpperCase()}function ea(e,n){return e.toUpperCase()===n.toUpperCase()}function ta(e,n){let t=M(n),i=ve(n),s=ee(t);for(let o of s?.payload??[]){let r=i[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return ue(e.hass,r);if(o.target==="page")return e.targets.pages.find(a=>T(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return e.targets.statusPages.find(a=>T(a.id,r))?.name??"A status page";if(o.target==="httpAction")return e.targets.httpActions.find(a=>T(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(c=>T(c.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function ie(e,n){return ta(e,n)??te(M(n))}function pe(e){return xe(e)?.label??e}var Uo="me:menu",jo="me:er:mode",Fo="me:er:domain",sn="me:er:entity",nn="me:er:add";function R(e){let n=e.uiState.get(Uo);return n==="entity"||n==="switcher"?n:"anywhere"}function na(e,n){n!==R(e)&&e.uiState.delete(et),e.uiState.set(Uo,n),e.requestUpdate()}var et="me:sw:page";function Ko(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function Z(e){if(R(e)!=="switcher")return;let n=e.uiState.get(et);if(typeof n=="string")return Ko(e).find(t=>T(t.id,n))}function an(e,n){n===void 0?e.uiState.delete(et):e.uiState.set(et,n),e.requestUpdate()}function zo(e){let n=Z(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function cn(e){return Io.find(([n])=>n===e)?.[1]??e}function Jo(e){return e.uiState.get(jo)==="entity"?"entity":"domain"}function Go(e){let n=e.uiState.get(Fo);return typeof n=="string"&&xe(n)!==void 0?n:"light"}function Yo(e){let n=Se(e.document),t=e.uiState.get(sn);return typeof t=="string"&&n.includes(t)?t:n[0]}function N(e){switch(R(e)){case"anywhere":return We;case"entity":return dn(e);case"switcher":return}}function dn(e){if(Jo(e)==="domain")return{list:"domain",domain:Go(e)};let n=Yo(e);return n===void 0?void 0:{list:"entity",entityId:n}}function Zo(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${pe(n.domain)} menu`:`${ue(e.hass,n.entityId)} menu`}function Xo(e){return`me:sel:${ns(e)}`}function se(e,n){let t=e.uiState.get(Xo(n));if(typeof t=="string")return D(e.document,n).find(i=>T(P(i),t))}function me(e,n,t){e.uiState.set(Xo(n),t),e.requestUpdate()}function Me(e){if(Z(e)!==void 0)return an(e,void 0),!0;let n=N(e);return n===void 0||se(e,n)===void 0?!1:(me(e,n,void 0),!0)}function nt(e,n,t){let i;e.edit(s=>{let o=cs(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=o.id,o.document}),i!==void 0&&me(e,n,i)}function Eo(e){let t=(i,s)=>Math.round((s+(i-.5)/he*8)*100)/100;return d`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${on} ${rn}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>$`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function ia(e,n){return n===void 0?[]:D(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=Ve(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:I(t).color}]})}function sa(e,n){if(n==="switcher")return $e(e.switcherPages.length,"page","pages");let t=n==="anywhere"?We:dn(e);return t===void 0?"none yet":$e(D(e.document,t).length,"slot","slots")}function oa(e,n){if(n==="switcher"){let t=e.switcherPages;return Eo(t.map((i,s)=>({...tt(s,t.length),color:i.color})))}return Eo(ia(e,n==="anywhere"?We:dn(e)))}function Qo(e){let n=R(e);return d`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${on}px; --thumb-h: ${rn}px`}>
    <div class="lc-head">
      <span class="swatch">${k("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${Yr}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${Io.map(([t,i])=>{let s=t===n,o=()=>{s||na(e,t)};return d`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${Oo[t]}
          @click=${o}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${oa(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${sa(e,t)}</span></b><small>${Gr[t]}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function ra(e,n,t){return d`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${ke(e,n,14,t)}</span></span>`}function Ao(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${pe(n.domain)} menu, by type`:`${ue(e.hass,n.entityId)}'s own menu`}function aa(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function ca(e,n,t){let i=t!==void 0&&T(t.id,n.id),s=aa(n),o=()=>an(e,n.id);return d`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${ra(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?d`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function da(e){let n=Ko(e),t=Z(e),i=n.filter(s=>s.hidden).length;return d`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${on}px; --thumb-h: ${rn}px`}>
    <div class="lc-head">
      <span class="swatch">${k("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${$e(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?d`<div class="lc-note">No page shows in the switcher.</div>`:d`<div class="layers me-page-list" role="list">${n.map(s=>ca(e,s,t))}</div>`}
  </section>`}function er(e){return R(e)==="switcher"?da(e):p}function tr(e){if(R(e)==="switcher")return[$e(e.switcherPages.length,"page","pages")];let n=N(e);if(n===void 0)return[Ao(e,n)];let t=$e(D(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[Ao(e,n),t]}function nr(e){return R(e)==="switcher"?Lo:N(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Zr}function ir(e,n){return Pi(e.uiState,E,n)}function la(e,n){Ri(e.uiState,E,n,!ir(e,n)),e.requestUpdate()}function ua(e){if(zo(e)!==void 0)return[{module:E,section:"switcher-page"}];let n=N(e),t=n===void 0?void 0:se(e,n);if(t!==void 0)return[{module:E,section:"slot"},{module:E,section:"where"},...ao(t)?[{module:E,section:"voice"}]:[],{module:E,section:"look"},...n?.list==="anywhere"?[{module:E,section:"shows"}]:[]];let i=R(e);return i==="anywhere"?[{module:E,section:"style-anywhere"},{module:E,section:"motion-anywhere"}]:[{module:E,section:i==="entity"?"menu":`style-${i}`}]}function _(e,n,t,i,s,o={}){let r=ir(e,t),a=Vo[n];return Dn({color:a.color,icon:k(a.icon),title:i,open:r,onToggle:()=>la(e,t),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${E}:${t}`},r?s:d``)}function sr(e){let n=R(e),t=cn(n),i=N(e),s=i===void 0?void 0:se(e,i),o=ua(e),r=Ci(e.uiState,o),a=Z(e),c=zo(e),l,u;if(a!==void 0&&c!==void 0)l=d`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>an(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Qr}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=pa(e,c);else if(s===void 0||i===void 0)l=d`<div class="crumbs"><span class="kchip" style=${`--k:${Xr}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=Da(e,n);else{let m=ie(e,s);l=d`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>me(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${I(s).color}`}>Slot</span><span class="nm" title=${m}>${m}</span></div>`,u=Aa(e,i,s)}return d`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{Ei(e.uiState,o,!r),e.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function pa(e,n){let t=n.page;return _(e,"switcherPage","switcher-page",Jt,d`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Jt}>${Qs(n)}</fieldset>`,{summary:Xs(t),dot:Zs(t)})}var ha={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function or(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":ha[n.key]??n.key}var ma={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function rr(e){return te(e).replace(/ - (.+)$/," ($1)")}function fa(e,n){if(n==="entityControl"){let t=is(e)??"all";return t==="all"?"Any entity":pe(t)}return ma[n]??Yi(n)}function ga(e,n,t){let i=M(t),s=rs(n),o=a=>{let c=ee(a),l=c===void 0?{icon:ye.unknownActionIcon,color:ye.unknownActionColor}:c,u=a===i?void 0:Zi(a,e.targets);return{raw:a,label:rr(a),icon:l.icon,color:l.color,pro:c?.requiresPremium===!0,...u===void 0?{}:{why:u}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[o(i)]}],...s.map(a=>({heading:fa(n,a.category),tiles:a.actions.map(o)}))]}function wa(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function Ho(){return d`<button type="button" class="link" @click=${Gs}>Open HTTP actions</button>`}function ba(e,n,t){let i=n.find(s=>T(s.id,t));return i?.source==="home"&&i.needsSetup===!0?d`<div class="hint warn ts-under">Needs setup. ${Ho()}</div>`:e.httpLibrary!==void 0&&n.length===0?d`<div class="hint ts-under">${Di} ${Ho()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?d`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function ya(e,n,t,i,s){let o=P(t),r=ve(t)[s.key],a=typeof r=="string"?r:"",c=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||c.some(h=>T(h.id,a)),u=h=>e.edit(S=>Wt(S,n,o,s.key,h===""?void 0:h)),m=s.target==="statusPage"&&e.statusPagesKnown===!0,g=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,f=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":m?"Not in this watch's status pages":g?Oi:Hi,v=h=>s.target==="httpAction"?wa(h):h.name;return d`<label class="field"><span>${or(i,s)}</span>
    <select .value=${Zn(c.find(h=>T(h.id,a))?.id??a)} @change=${h=>u(h.target.value)}>
      ${s.required===!0?p:d`<option value="" ?selected=${a===""}>None</option>`}
      ${l?p:d`<option value=${a} selected>${f}</option>`}
      ${c.map(h=>d`<option value=${h.id} ?selected=${T(h.id,a)}>${v(h)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.voice?.phrases===void 0?d`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:s.target==="statusPage"?m||e.catalogKnown?p:d`<div class="hint ts-under">No status pages from this watch yet. Add them in Status pages.</div>`:s.target==="httpAction"?ba(e,e.targets.httpActions,a):p}`}function va(e,n,t,i,s){let o=P(t),r=ve(t),a=(u,m)=>e.edit(g=>Wt(g,n,o,s.key,u),m),c=or(i,s),l=_t(t,s);switch(s.type){case"entity":{let u=typeof r[s.key]=="string"?r[s.key]:"",m=i==="runScene"?"scene":i==="runScript"?"script":Qi();return d`<div class="ts-stack">${gt({hass:e.hass},c,qo(e.hass,u),g=>a(g.entityId),`me:entity:${o}`,{domain:m,clearable:!1,needed:u===""})}</div>
        ${u===""?d`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return ya(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let g=De(typeof r.entityId=="string"?r.entityId:""),f=Xi(g),v=typeof l=="string"?l:f[0]??"",h=f.map(S=>[S,Ht(S)]);return f.includes(v)||h.unshift([v,Ht(v)]),j(c,v,h,S=>a(S),{snapBack:!0})}let u=re(s.enum),m=typeof l=="string"?l:String(s.default??"");return u.length<=4?O(c,m,u,g=>a(g)):j(c,m,u,g=>a(g),{snapBack:!0})}case"bool":return H(c,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&_t(t,{key:"showBanner",type:"bool",default:!0})===!1)return p;let u=typeof r[s.key]=="number"?r[s.key]:void 0;return ai(c,u,m=>a(m,`slot:${o}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function xa(e,n,t){if(!Ot(n,t))return p;let i=P(t);return d`<div class="ts-stack">${O("Skip conditions",Es(Dt(t)),Cs,s=>e.edit(o=>ps(o,n,i,As(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Sa(e){let n=qe(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(pe).join(", ")}function $a(e,n){let t=P(n),i=qe(n),s=i===void 0,o=c=>e.edit(l=>ws(l,t,c)),r=gs(),a=(i??[]).filter(c=>!Nt(c));return d`<div class="mi-wrap">${O("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],c=>o(c==="every"?void 0:r.slice(0,1)),{def:"every"})}</div>
    ${s?p:d`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(c=>{let l=i.includes(c),u=!Nt(c);return d`<button type="button" class="pe-chip ${l?"on":""} ${u?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${u?"Not reported by the watch":p}
          @click=${()=>o(l?i.filter(m=>m!==c):[...i,c])}>${pe(c)}</button>`})}
    </div>
    ${a.length===0?p:d`<div class="hint warn">${a.map(pe).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function ka(e,n){return Ot(n,e)&&Dt(e)!==null}function Ma(e){return e.isVisible===!1}function Ta(e){return qe(e)!==void 0}function Pa(e){let n=Bo(e);if(n===void 0)return!1;let t=I(e);return t.icon!==n.icon||!ea(t.color,n.color)}function Ra(e,n){let t=Vo.name,i=ee(M(n));return d`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${k(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${ie(e,n)}</span>
      ${i?.requiresPremium?d`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:p}
    </div>
  </section>`}function Ca(e){let n=F(e);return n.charAt(0)+n.slice(1).toLowerCase()}function Ea(e,n,t){let i=P(t),s=D(e.document,n).filter(o=>!T(P(o),i));return Ne().map(o=>{let r=s.find(c=>c.position===o),a={position:o,label:Ca(o),here:t.position===o};return r!==void 0&&(a.holder={name:ie(e,r),...I(r)}),a})}function Aa(e,n,t){let i=P(t),s=M(t),o=ee(s),r=I(t),a=Bo(t),c=typeof t.position=="string"?t.position:"",l=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${o===void 0?d`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${Po(e.icons,s,ga(e,n,t),f=>e.edit(v=>fs(v,n,i,f,e.targets)))}
    ${o?.description?d`<div class="mi-desc">${o.description}</div>`:p}
    ${as(s)?d`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(o?.payload??[]).map(f=>va(e,n,t,s,f))}
    ${xa(e,n,t)}
  </fieldset>`,u=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${Ro(e.icons,r,Ea(e,n,t),f=>e.edit(v=>ls(v,n,i,f)))}
    ${H("Shown on the watch",t.isVisible!==!1,f=>e.edit(v=>us(v,n,i,f)),!0)}
  </fieldset>`,m=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${He({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",f=>e.edit(v=>hs(v,n,i,f),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${oe("Color",typeof t.color=="string"?t.color:void 0,f=>{f!==void 0&&e.edit(v=>ms(v,n,i,f),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,g=lo(e,n,t);return d`${Ra(e,t)}
    ${_(e,"slot","slot","What it does",l,{summary:rr(s),dot:ka(t,n)})}
    ${_(e,"where","where","Where",u,{summary:`${F(c)}${t.isVisible===!1?", hidden":""}`,dot:Ma(t)})}
    ${g===void 0?p:_(e,"slot","voice","Voice",d`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${g}</fieldset>`,{summary:uo(e,t),dot:ro(t)})}
    ${_(e,"look","look","Icon and color",m,{summary:r.icon,dot:Pa(t)})}
    ${n.list==="anywhere"?_(e,"shows","shows","Shows on",d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${$a(e,t)}</fieldset>`,{summary:Sa(t),dot:Ta(t)}):p}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(f=>ds(f,n,i))}>${k("delete")}<span>Remove</span></button>
    </div>`}function Ha(e){let n=Xe(e.document,"quickAction",go),t=Xe(e.document,"quickAction",wo);return d`${_(e,"style","style-anywhere","Look",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${bo(e)}
    </fieldset>`,{summary:yo(e.document),dot:n})}
    ${_(e,"motion","motion-anywhere","Motion",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${vo(e)}
    </fieldset>`,{summary:xo(e.document),dot:t})}`}function Ia(e){let n=Xe(e.document,"pageSwitcher",So);return _(e,"style","style-switcher","Look",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${$o(e)}
  </fieldset>`,{summary:ko(e.document),dot:n})}function La(e){let n=Jo(e),t=a=>{e.uiState.set(jo,a),e.requestUpdate()},i=O("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,o,r=!1;if(n==="domain"){let a=Go(e),c=xe(a),l=ts(a),u=es().map(f=>[f.domain,f.label]),m=Mo.flatMap(f=>{let v=xe(f);return v===void 0?[]:[{domain:v.domain,label:v.label,icon:v.icon,color:It(v.domain).color}]}),g=c?.inheritKey?ss(e.document,a):!1;r=g,o=`By type \xB7 ${c?.label??a}`,s=d`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${To(e.icons,a,m,u,f=>{e.uiState.set(Fo,f),e.requestUpdate()})}
      ${l.length>0?d`<div class="hint ts-under keep">The same menu as ${l.map(f=>f.label).join(", ")}.</div>`:p}
      ${c?.inheritKey?Ye("Fill gaps with the All menu",g,f=>e.edit(v=>bs(v,a,f)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):p}`}else{let a=Se(e.document),c=Yo(e);o=`By entity \xB7 ${c===void 0?"none yet":ue(e.hass,c)}`;let l=u=>{let m=u.entityId.trim();m!==""&&(e.edit(g=>ys(g,m)),e.uiState.set(sn,m),e.uiState.set(nn,(Number(e.uiState.get(nn)??0)||0)+1),e.requestUpdate())};s=d`<div class="me-entities">
      ${a.length===0?d`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(u=>{let m=u===c;return d`<div class="me-entity ${m?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${m?"true":"false"}
            @click=${()=>{e.uiState.set(sn,u),e.requestUpdate()}}>
            <b>${ue(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(g=>vs(g,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${gt({hass:e.hass},"Add an entity",qo(e.hass,""),l,`me:er:add:${String(e.uiState.get(nn)??0)}`,{clearable:!1})}
      </div>
    </div>`}return _(e,"menu","menu","Which menu",d`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:o,dot:r})}var Oa="Click a slot on the watch to change what it does.";function Da(e,n){let t=n==="anywhere"?Ha(e):n==="switcher"?Ia(e):La(e);return d`<p class="me-menu-note">${Oo[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?Jr:Oa}</p>`}var ar=U`
  /* The Menus and Slots cards: the page editor's Pages and Tiles cards. */
  .me-menus-card > .layers, .me-slots-card > .layers { padding: 6px 8px 8px; overflow: visible; }
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
`;var Wa=["spring","popIn","fade","none"],_a=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Te(e,n,t){let i=ne(n).find(s=>s.key===t);return i===void 0?void 0:K(e,n,i)}function Pe(e,n,t,i){let s=ne(n).find(a=>a.key===t),o=Te(e,n,t),r=typeof o=="number"&&Number.isFinite(o)?o:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,r))}function it(e,n){return Te(e,"quickAction",n)===!0}function Na(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function ot(e){let n=Te(e,"quickAction","entranceStyle"),t=Te(e,"quickAction","beamStyle");return{glass:it(e,"showIconBubble"),neon:it(e,"showNeonOutline"),labels:it(e,"showContextLabel"),finger:it(e,"showFingerShadow"),entrance:Wa.includes(n)?n:"none",dim:Pe(e,"quickAction","backgroundDim",1),beam:_a.includes(t)?t:"none",beamColor:Na(Te(e,"quickAction","beamColor")),beamIntensity:Pe(e,"quickAction","beamIntensity",.5),glow:Pe(e,"quickAction","glowIntensity",.5)}}function Va(e){return{glow:Pe(e,"pageSwitcher","glowIntensity",.5),scale:Pe(e,"pageSwitcher","selectedScale",1.2)}}var ln="ms:play",qa=1500;function Ba(e){let n=e.uiState.get(ln);e.uiState.set(ln,{menu:R(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function Ua(e){let n=e.uiState.get(ln);return n===void 0||n.menu!==R(e)||Date.now()-n.at>qa?"":n.count%2===1?"ms-play-a":"ms-play-b"}function dr(e,n){let t=D(e,n),i=os(e,n),s=new Set(Lt(e,n));return Ne().map(o=>{let r=t.filter(u=>u.position===o),a=r.find(u=>u.isVisible!==!1),c=a===void 0?i.find(u=>u.position===o&&u.isVisible!==!1):void 0,l=a??(c===void 0?r[0]:void 0);return{position:o,own:r,main:l,second:r.find(u=>u!==l),shared:c,free:s.has(o)}})}function ja(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=P(n),o=e.find(r=>r.main!==void 0&&T(P(r.main),s));if(o!==void 0)return{position:o.position,slot:n}}let i=e.flatMap(s=>{let o=t(s.main)?s.main:s.shared;return o===void 0?[]:[{position:s.position,slot:o}]});return i.find(s=>s.position==="topCenter")??i[0]}var w=e=>Math.round(e*100)/100;function rt(e,n){let t=Do(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function st(e,n,t,i){let{width:s,height:o}=e.screen,r=e.scale,a=rt(e.screen,t),c=[`left:${a.x*100}%`,`top:${a.y*100}%`];if(i!==void 0&&c.push(`--c:${i}`),c.push(`--fx:${w((s/2-a.px)*r)}px`,`--fy:${w((o/2-a.py)*r)}px`),n.finger){let l=a.px-s/2,u=a.py-o/2,m=Math.hypot(l,u);m>1&&c.push(`--sx:${w(l/m*5*r)}px`,`--sy:${w(u/m*5*r)}px`)}return c.join(";")}function un(e,n){return Math.round(n*e.scale)}function lr(e,n,t,i,s){let o=rt(e.screen,t),r=(n.glass?28:25)*(o.y>.5?-1:1),a=(o.py+r)/e.screen.height;return d`<span class="ms-name" aria-hidden="true" style=${`left:${o.x*100}%;top:${w(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function Fa(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,o=t*.18,r=(n-i*2-s)/2,a=(t-o-i-s*2)/3,c=[0,1,2,3,4,5].map(l=>{let u=i+l%2*(r+s),m=o+Math.floor(l/2)*(a+s);return $`<rect class=${`ms-tile t${l%4}`} x=${w(u)} y=${w(m)} width=${w(r)} height=${w(a)} rx=${w(n*.06)}></rect>`});return d`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${w(i)} y=${w(t*.075)} width=${w(n*.4)} height=${w(t*.045)} rx=${w(t*.0225)}></rect>
    ${c}
  </svg>`}function X(e,n,t){return $`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function cr(e,n,t,i){return $`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${w(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${w(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function Ka(e,n,t){if(e.beam==="none")return p;let i=e.beamColor,s=e.beamIntensity,o=n.width/2,r=n.height/2,a=t.x-o,c=t.y-r,l=Math.hypot(a,c),u=Math.atan2(c,a),m=(h,S)=>`${w(o+Math.cos(u+h)*S)},${w(r+Math.sin(u+h)*S)}`,g=w(t.x),f=w(t.y),v;switch(e.beam){case"sectorWedge":{let h=Math.PI/4;v=$`${X("ms-b8",8,n)}${X("ms-b3",3,n)}
        <polygon points=${`${o},${r} ${m(-h/2,l*1.2)} ${m(h/2,l*1.2)}`} fill=${i} fill-opacity=${w(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${o},${r} ${m(-h*.3,l)} ${m(h*.3,l)}`} fill=${i} fill-opacity=${w(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":v=$`${X("ms-b7",7,n)}${X("ms-b10",10,n)}${cr("ms-wash",i,.35*s,.18*s)}
        <circle cx=${w((o+t.x)/2)} cy=${w((r+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${g} cy=${f} r="40" fill=${i} fill-opacity=${w(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":v=$`${X("ms-b4",4,n)}${X("ms-b5",5,n)}${cr("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${g} cy=${f} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${g} cy=${f} r="25" fill=${i} fill-opacity=${w(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":v=$`${X("ms-b6",6,n)}
        <circle cx=${g} cy=${f} r="30" fill=${i} fill-opacity=${w(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(h=>$`<circle cx=${g} cy=${f} r=${w((30+h*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${w((1-h)*.45*s)} stroke-width=${w(2-h*1.2)}></circle>`)}`;break;case"wakeWave":v=$`${X("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${o} y1=${r} x2=${g} y2=${f}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${w(.5*s)}></stop></linearGradient>
        <line x1=${o} y1=${r} x2=${g} y2=${f} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(h=>{let S=1-h;return $`<circle cx=${w(o+a*h)} cy=${w(r+c*h)} r=${w((20+S*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${w((1-S)*.5*s)} stroke-width=${w(Math.max(1.5-S*1.2,.3))}></circle>`})}
        <circle cx=${g} cy=${f} r="18" fill=${i} fill-opacity=${w(.25*s)} filter="url(#ms-b4)"></circle>`;break}return $`<g class="ms-beam">${v}</g>`}function za(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":Ua(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${w(n.dim*.85)}`,`--ms-blur:${w(2+n.dim*4)}px`,`--ms-g-r:${w(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function pn(e,n,t,i,s={}){let{width:o,height:r}=e.screen,a=e.scale,c=Math.min(o,r),l=za(e,t),u=[`width:${Math.round(o*a)}px;height:${Math.round(r*a)}px;--me-s:${a}`,l.style,s.style??""].filter(g=>g!=="").join(";"),m=d`<div class=${`me-screen ms-screen ${l.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${u}>
    <div class="ms-backdrop" aria-hidden="true">${Fa(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${o} ${r}`} aria-hidden="true">
      ${s.beamTo===void 0?p:Ka(t,e.screen,s.beamTo)}
      <circle cx=${o/2} cy=${r/2} r=${c*he} class="me-track"></circle>
      ${t.finger?$`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${o/2} cy=${r/2} r=${w(c*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:p}
      <circle cx=${o/2} cy=${r/2} r=${c*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return Mi({width:o,height:r},a,m,n)}function Ja(e,n,t,i){let s=ot(e.document),o=dr(e.document,n),r=ja(o,t),a=r===void 0?void 0:P(r.slot),c=t===void 0?void 0:P(t),l=(h,S=he)=>Ve(h,S),u=h=>a!==void 0&&T(P(h),a),m=(h,S,B,V,fe)=>{let ge=I(h),Re=P(h),q=c!==void 0&&T(Re,c),Ce=h.isVisible===!1,vn=`${F(S)}: ${te(M(h))}${Ce?", hidden":""}`,xr=["me-dot",V,q?"on":"",Ce?"off":"",u(h)&&V===""?"ms-active":""].filter(Sr=>Sr!=="").join(" ");return d`<button type="button" class=${xr} style=${st(e,s,B,ge.color)}
      title=${vn} aria-label=${vn} aria-pressed=${q?"true":"false"} @click=${()=>me(e,n,Re)}>
      ${ke(e,ge.icon,un(e,V===""?15:11),ge.color)}${fe>1?d`<span class="me-count" aria-hidden="true">${fe}</span>`:p}</button>`},g=o.map(h=>{let S=l(h.position);if(S===void 0)return p;let B=p,V;if(h.main!==void 0)B=m(h.main,h.position,S,"",h.own.length),h.main.isVisible!==!1&&(V=h.main);else if(h.shared!==void 0){let q=I(h.shared),Ce=`${F(h.position)}: ${te(M(h.shared))}, from All`;B=d`<span class=${`me-dot inh${u(h.shared)?" ms-active":""}`} style=${st(e,s,S,q.color)} title=${Ce}>
        ${ke(e,q.icon,un(e,13),q.color)}</span>`,V=h.shared}else if(h.free){let q=F(h.position);B=d`<button type="button" class="me-dot free" style=${st(e,s,S)} ?disabled=${e.busy}
        title=${`Add a slot at ${q}`} aria-label=${`Add a slot at ${q}`}
        @click=${()=>nt(e,n,h.position)}>${k("plus")}</button>`}let fe=h.second===void 0?void 0:l(h.position,.2),ge=h.second===void 0||fe===void 0?p:m(h.second,h.position,fe,"two",0),Re=s.labels&&V!==void 0?lr(e,s,S,I(V).color,ie(e,V)):p;return d`${B}${ge}${Re}`}),f=r===void 0?void 0:l(r.position),v=rt(e.screen,f??{x:.5,y:.5-he});return pn(e,`${i} on the watch`,s,g,{beamTo:{x:v.px,y:v.py}})}function Ga(e){let n=ot(e.document),t=Va(e.document),i=e.switcherPages,s=Z(e),o=Math.max(0,s===void 0?0:i.findIndex(c=>T(c.id,s.id))),r=i.length===0?d`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((c,l)=>{let u=tt(l,i.length),m=l===o,g=`--ms-pr:${m?22:14}px;--ms-pa:${Math.round((m?.7:.15)*t.glow*100)}%`,f=`${st(e,n,u,c.color)};${g}`,h=[s!==void 0&&T(s.id,c.id)?"on":"",m?"ms-active":""].filter(B=>B!=="").join(" "),S=n.labels&&c.text===void 0?lr(e,n,u,c.color,c.name):p;return c.text===void 0?d`<span class=${`me-dot me-page-dot${h===""?"":` ${h}`}`} style=${f} title=${c.name}>${ke(e,c.icon,un(e,14),c.color)}</span>${S}`:d`<span class=${`me-page${h===""?"":` ${h}`}`} style=${f} title=${c.name}>${c.text}</span>`}),a=i.length===0?void 0:rt(e.screen,tt(o,i.length));return pn(e,"Page switcher on the watch",n,r,{beamTo:a===void 0?void 0:{x:a.px,y:a.py},classes:"ms-switcher",style:`--ms-k-on:${t.scale}`})}function Ya(e){if(R(e)==="switcher")return Ga(e);let n=N(e);return n===void 0?pn(e,"Entity quick menu on the watch",ot(e.document),d`<p class="me-screen-note">Add an entity to edit its menu.</p>`):Ja(e,n,se(e,n),Zo(e,n))}var Za={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function Xa(e,n,t,i){let s=P(t),o=i!==void 0&&T(s,P(i)),r=t.isVisible===!1,a=ie(e,t),c=`${te(M(t))}${r?", hidden":""}`;return d`<button type="button" class=${`ms-label${o?" on":""}${r?" off":""}`} data-slot=${s}
    style=${`--k:${I(t).color}`} aria-pressed=${o?"true":"false"}
    @click=${()=>me(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${c}</small></span></button>`}function Qa(e,n,t,i){let s=F(t.position),o=t.own.map(r=>Xa(e,n,r,i));return t.shared!==void 0&&o.push(d`<span class="ms-label ms-inh" style=${`--k:${I(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${ie(e,t.shared)}</b><small>From the All menu</small></span></span>`),o.length===0&&t.free&&o.push(d`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>nt(e,n,t.position)}>${k("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),d`<div class=${`ms-place ms-at-${t.position} ms-${Za[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${o}</div>`}function ur(e){let n=Ya(e),t=R(e)==="switcher"?void 0:N(e);if(t===void 0)return d`<div class="me-stage-body">${n}</div>`;let i=se(e,t);return d`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${dr(e.document,t).map(s=>Qa(e,t,s,i))}
  </div></div>`}var ec=d`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function pr(e){let n=R(e),t=ot(e.document),i=p;if(n!=="switcher"){let o=N(e),r=o===void 0?[]:Lt(e.document,o),a=o===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=d`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||o===void 0||r.length===0}
      title=${a} @click=${()=>{o!==void 0&&nt(e,o)}}>${k("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?p:d`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>Ba(e)}>${ec}<span class="word">Play opening</span></button>`;return i===p&&s===p?d``:d`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function hr(e){if(R(e)!=="entity")return p;let n=N(e);return n===void 0||se(e,n)===void 0?p:d`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Me(e)}>Change the type or entity</button></span>`}var mr=U`
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
  /* The switcher: every page glows by its own Glow, and the one the finger
     points at is drawn at Selected Scale. */
  .ms-switcher .me-dot.me-page-dot, .ms-switcher .me-page {
    --ms-glow: 0 0 calc(var(--ms-pr, 14px) * var(--me-s, 1)) calc(var(--ms-pr, 14px) * .3 * var(--me-s, 1)) color-mix(in srgb, var(--c, white) var(--ms-pa, 0%), transparent);
  }
  .ms-switcher .ms-active { --ms-k: var(--ms-k-on, 1.2); z-index: 1; }
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
  .ms-play-a.ms-enter-spring :is(.me-dot:not(.free), .me-page) { animation: ms-fly-a .5s cubic-bezier(.34, 1.56, .64, 1) backwards; }
  .ms-play-b.ms-enter-spring :is(.me-dot:not(.free), .me-page) { animation: ms-fly-b .5s cubic-bezier(.34, 1.56, .64, 1) backwards; }
  .ms-play-a.ms-enter-popIn :is(.me-dot:not(.free), .me-page) { animation: ms-pop-a .35s cubic-bezier(.3, 1.9, .55, 1) backwards; }
  .ms-play-b.ms-enter-popIn :is(.me-dot:not(.free), .me-page) { animation: ms-pop-b .35s cubic-bezier(.3, 1.9, .55, 1) backwards; }
  .ms-play-a.ms-enter-fade :is(.me-dot:not(.free), .me-page) { animation: ms-fade-a .3s ease-in backwards; }
  .ms-play-b.ms-enter-fade :is(.me-dot:not(.free), .me-page) { animation: ms-fade-b .3s ease-in backwards; }
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
`;function hn(e){if(e.length===0)return"";let n=e.map(i=>$s(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function fr(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${hn(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function yr(){return Ps()||Ki()}Js({dirty:yr,drop:()=>{Rs(),zi()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{yr()&&(e.preventDefault(),e.returnValue="")});var tc=15e3,vr=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),mn=vr?"\u2318":"Ctrl+",fn={min:200,max:720,middleMin:320},gn={left:280,right:320},wn="wrist-assistant-panel.menus.columns.v1",nc="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",ic=24,gr=820;function bn(e){return Ae(e).message}function at(e){return Ae(e).code}function ct(e){let{code:n,message:t}=Ae(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function sc(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function oc(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":Rn(Math.max(0,(Date.now()-n)/1e3))}function rc(e){return e==="panel"?"Saved here":"From the watch"}function ac(e){return e instanceof HTMLElement?bi(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function cc(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function dc(e){return Q(e)?yt(e).filter(n=>!xt(n)&&Gi(Ie(n))).map(n=>({id:Ie(n),name:vt(n)})):[]}var wr=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function dt(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var lc="#8E8E93";function yn(e){if(!Q(e))return[];let n=0;return yt(e).filter(t=>!Si(t)&&!xt(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=vt(t),o=dt(t.switcherIcon)??dt(xi(t)[0]?.icon)??($i(t)?"bolt.fill":"square.grid.2x2.fill"),r=i?lc:wr[n++%wr.length],a=dt(t.switcherColor)??r,c=t.switcherDisplayMode==="icon"?void 0:dt(t.switcherText)??s;return{id:Ie(t),name:s,icon:o,color:a,...c===void 0?{}:{text:c},hidden:i}})}function jd(e){return yn(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var br={ok:0,warn:1,err:2};function uc(e,n){return e===void 0?n:n===void 0?e:{kind:br[n.kind]>br[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function pc(e){let n=Oe(e)??{},t=D(n,{list:"anywhere"}).length,i=Se(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(t)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var b=class extends xn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new jn(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=_o();this.columns={...gn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new li(this);this.symbols=new Xn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!cc()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,o=t.key.toLowerCase();if(s&&!t.altKey&&o==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!ac(i[0])){if(s&&!t.altKey&&o==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&o==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let r=this.viewHost();r!==void 0&&Me(r)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(nc)))return;let r=this.viewHost();r!==void 0&&Me(r)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=t.composedPath(),s=o=>i.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(si,this.onScrubStart),this.addEventListener(oi,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return Nn(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let t=this.watchId,i=this.record;if(!(t===void 0||i===void 0)){if(i.revision>0){let s=z(t);if(s!==void 0)return s;let o=Oe(i.document);return o===void 0?void 0:qt(t,o,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return z(t)??Bt(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return Ct(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return dc(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(z(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return Z({uiState:this.uiState,switcherPages:[],switcherRows:yn(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Gn(wn,gn,fn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Sn(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=Un(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),mi(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let r=()=>this.pagesSaveEnded(t);i.then(r,r)}let s=z(t)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let o=()=>this.saveEnded(t);s.then(o,o)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,i=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(t),this.load(t,i),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let o=await L(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=Os(o)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:jt(t),defaults:Ds(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let o=await L(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=Ii(o)}catch(o){if(s!==this.catalogSeq||t!==this.watchId)return;Pt(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await Pn(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=ei(s)}catch(s){if(i!==this.httpLibrarySeq)return;ti(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let o=await L(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=Li(o)}catch(o){if(s!==this.statusPagesSeq||t!==this.watchId)return;Pt(o)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let o=await L(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&Q(o.document)&&!(Ct(t)?.saving??!1)&&Fi(t,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let o=await L(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=o.revision>0&&Q(o.document)?o.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await L(s,t,"menus");if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Ms(r)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=bn(r)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let i=this.watchId;this.record=t,i!==void 0&&t.revision<=0&&Bt(i);let s=t.revision>0?Oe(t.document):void 0;if(i===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===i&&t.revision>=o.revision&&(this.restartDraft=void 0,(z(i)?.dirty??!1)||Ue(i));let r=qt(i,s,t.revision);r.replaced.length>0?this.note={kind:"warn",text:hn(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await $n(i,t,"menus");if(s!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||t!==this.watchId)return;this.historyState=at(o)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;Tn(i,t,o=>{s===this.subscribeSeq&&(o.kind==="catalog"?Wi(o,this.catalog)&&this.loadCatalog(t):o.kind==="status_pages"?this.loadStatusPages(t):o.kind==="pages"?this.loadPages(t):o.kind==="behavior"?this.loadBehavior(t):o.kind==="voice"?this.loadVoice(t):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||_n(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},tc))}async poll(){this.pollTimer=void 0;let t=this.hass,i=this.watchId,s=this.record;if(!(!t||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await L(t,i,"menus");if(i!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),o}editPages(t,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let o=this.scrubKey??i,r=s.apply(t(s.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??wi,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=yi(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:ni(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:jt(this.voiceDocument)}}screen(){let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(ft(t?.screen_size)??mt).screen}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,o=yn(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get busy(){return s.saving},edit:(r,a)=>this.draft===t&&this.edit(r,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let i=this.pagesDraft;if(i===void 0||Tt(i.document,t)===void 0)return;let s=this,o=this.memoIcons();return{pageId:t,icons:o,symbols:this.symbols,uiState:this.uiState,get page(){return Tt(i.document,t)??{}},get busy(){return s.saving},edit:(r,a)=>{this.pagesDraft===i&&this.editPages(r,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(t||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.watchId;this.endScrub();let s=this.draft,o=this.pagesDraft;if(!t||i===void 0||!s||this.saving)return;let r=s.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let c=r?await this.saveMenus(t,i,s,s.revision<=0):void 0,l=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(t,i,o):void 0;i===this.watchId&&(this.note=uc(c,l))}async saveMenus(t,i,s,o=!1){let r=Ts(s,{prepare:Ss,save:(c,l)=>lt(t,i,"menus",c,l).catch(u=>{throw ct(u)}),fetch:async()=>{let c=await L(t,i,"menus").catch(l=>{throw ct(l)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await r.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:at(c)??"unknown",message:bn(c)}));return this.saveEnded(i),qs(o,a.code,fr(a))}async savePages(t,i,s){let o=ji(s,{prepare:a=>Ji(Ai(a),s.base,this.hass?.states),save:(a,c)=>lt(t,i,"pages",a,c).catch(l=>{throw ct(l)}),fetch:async()=>{let a=await L(t,i,"pages").catch(c=>{throw ct(c)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:at(a)??"unknown",message:bn(a)}));return this.pagesSaveEnded(i),zn(r)}startFresh(){let t=this.watchId;t===void 0||!Bn(this.noRecordState())||(_s("menus",t),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let i=this.hass,s=this.watchId,o=this.record;if(!i||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:t,baseRevision:o.revision};this.restoreAsk=r,kn(i,s,"menus",t.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:pc(a.document)})},()=>{})}async restore(){let t=this.hass,i=this.watchId,s=this.restoreAsk;if(!t||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await Mn(t,i,"menus",s.entry.revision,s.baseRevision);o={kind:"ok",text:vi(s.entry.updated_at)},i===this.watchId?this.restartDraft={watchId:i,revision:r.revision}:(z(i)?.dirty??!1)||Ue(i)}catch(r){let a=at(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds menus for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${Qn(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=o,this.load(i,!0))}render(){let t=this.watches,i=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,t):p}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=gr}renderTopBar(t,i){let s=t!==void 0&&!this.unsupported,o=s&&this.dirty,r=this.shellOwnsWatch;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:p}
      ${r?p:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Fs(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?p:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?Fn({newWatch:this.newWatch,dirty:o,saved:bt(this.record)}):p}
      ${this.renderSyncPill(s?t:void 0)}
      ${this.renderTopMenu(s?t:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${mn}S). A save reaches the watch the next time it checks.`:`Nothing to save (${mn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${bt(this.record)}</span>
        ${Us(Vs({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:p}
      ${r?p:d`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():zs(void 0)}>${k("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(Ks,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return p;let s=t===void 0?{size:0,limit:1}:Et(t.document),o=wt({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState});return d`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(t=this.watches){return Vn(t.find(i=>i.owner_watch_id===this.watchId))}opensReady(t=this.watches){return Ns(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let i=this.canStartFresh();if(t===void 0&&!i)return p;let s=this.topMenuOpen,o=r=>()=>{this.topMenuOpen=!1,r()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?d`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:p}
        ${i?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${ut}</button>`:p}
      </div>`:p}
    </span>`}personColor(t){let i=ci(this.owners.length>0?this.owners:this.ownList??[]);return di(i.findIndex(s=>s.owners.some(o=>o.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return p;let i=t.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.personColor(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(i?.owner_watch_id)}<span class="tb-browse-l">${i?Ee(i,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${Ee(r,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?k("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=gr?this.columns:Jn(this.hostWidth-ic,this.columns,fn)}renderGutter(t){return d`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();Yn(i,{side:t,base:t==="left"?s.left:s.right,limits:fn,onWidth:o=>{this.columns={...this.columns,[t]:o}},onEnd:()=>ht(wn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:gn[t]},ht(wn,this.columns)}}></div>`}get stageScale(){return this.zoom??St(this.narrow||this.stacked)}setZoom(t){this.zoom=t,No(t)}renderStage(t,i){let s=i.find(u=>u.owner_watch_id===this.watchId),o=ft(s?.screen_size),r=o??mt,a=[...tr(t),r.label],c=this.undoDraft,l=cn(R(t));return d`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Ee(s,i)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${o===void 0?`${r.label}, this watch's size is not known`:a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!c?.canUndo} title=${`Undo (${mn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!c?.canRedo} title=${vr?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(r.label,t)}
        ${ur(t)}
        <div class="under"><span class="tail">${nr(t)}</span>${hr(t)}</div>
      </div>
    </div>`}renderStageTools(t,i){let s=this.stageScale,o=St(this.narrow||this.stacked);return d`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${pr(i)}
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${t}.`}>
        ${k("watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=kt(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(kt(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${be(s)}. Back to fit`}
          title=${`The watch at ${be(s)} of its own points. Click to fit it again (${be(o)}).`}
          @click=${()=>this.setZoom(void 0)}>${be(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=$t(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom($t(s))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Vt}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${l===void 0?p:d`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return d`<div class="pe-empty"><b>${Vt}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:z(this.watchId),u=this.watchId;return d`<div class="pe-empty"><b>${ks}</b><span>${qn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ut}</button>
        ${l?.dirty&&u!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Ue(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=i.revision<=0;return d`${c&&this.barHost===void 0?Bs():p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Qo(o)}
        ${er(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${sr(o)}
      </div>
    </div>
    ${c?p:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(t,i,s){let o=Et(i),r=wt({record:t,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState}),a=this.watchId;return d`${ui({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?pi({noun:"menus",record:t,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?hi({noun:"menus",document:i,revision:t.revision,dirty:s,copied:this.rawCopied,onCopy:c=>{fi(c).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(t){let i=this.record,s=oc(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${rc(t.entry.updated_by)}${s?` ${s}`:""}, ${sc(t.entry.size)}.</p>
      ${t.summary?d`<p class="pe-muted">${t.summary}</p>`:p}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Wn,Cn,En,An,Hn,In,Ln,On,Ti,js,U`
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
  `,ar,mr,Co,gi,Kn]}};y([C({attribute:!1})],b.prototype,"hass",2),y([C({attribute:!1})],b.prototype,"owners",2),y([C({attribute:!1})],b.prototype,"ownerId",2),y([C({type:Boolean,reflect:!0})],b.prototype,"narrow",2),y([C({attribute:!1})],b.prototype,"icons",2),y([C({attribute:!1})],b.prototype,"iconsTick",2),y([C({attribute:!1})],b.prototype,"haMenu",2),y([C({attribute:!1})],b.prototype,"onHaMenu",2),y([C({attribute:!1})],b.prototype,"onBack",2),y([C({attribute:!1})],b.prototype,"onPages",2),y([C({attribute:!1})],b.prototype,"barActions",2),y([C({attribute:!1})],b.prototype,"shellOwnsWatch",2),y([C({attribute:!1})],b.prototype,"barHost",2),y([x()],b.prototype,"watchId",2),y([x()],b.prototype,"record",2),y([x()],b.prototype,"unsupported",2),y([x()],b.prototype,"catalog",2),y([x()],b.prototype,"statusPages",2),y([x()],b.prototype,"httpLibrary",2),y([x()],b.prototype,"pagesRecord",2),y([x()],b.prototype,"behavior",2),y([x()],b.prototype,"voiceDocument",2),y([x()],b.prototype,"loading",2),y([x()],b.prototype,"loadError",2),y([x()],b.prototype,"history",2),y([x()],b.prototype,"historyState",2),y([x()],b.prototype,"note",2),y([x()],b.prototype,"restoreAsk",2),y([x()],b.prototype,"restoring",2),y([x()],b.prototype,"historyOpen",2),y([x()],b.prototype,"rawOpen",2),y([x()],b.prototype,"rawCopied",2),y([x()],b.prototype,"ownList",2),y([x()],b.prototype,"topMenuOpen",2),y([x()],b.prototype,"watchMenuOpen",2),y([x()],b.prototype,"zoom",2),y([x()],b.prototype,"columns",2),y([x()],b.prototype,"hostWidth",2),y([x()],b.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",b);export{wn as ME_COLUMNS_KEY,wr as WATCH_SWITCHER_COLORS,lc as WATCH_SWITCHER_LEFT_OUT_COLOR,b as WaMenuEditor,uc as joinSaveNotes,dc as watchMenuPageTargets,pc as watchMenusSummary,jd as watchSwitcherPages,yn as watchSwitcherRows};
