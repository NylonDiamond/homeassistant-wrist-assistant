import{d as Xs,e as Y,f as Ft,g as jt,h as Ke,i as Qs,j as eo}from"./chunk-6KZLUKIF.js";import{b as to,c as no}from"./chunk-ZBQGVDIJ.js";import{B as Ws,C as Ns,D as Vs,ba as qs,ca as Bs,da as Bt,ea as Us}from"./chunk-IOKE5NED.js";import{a as ys,b as _t,e as vs,i as xs,j as Ss}from"./chunk-SPTKBBHW.js";import{$ as ss,A as q,B as R,C as We,D as Ne,E as J,F as Ve,G as Fi,H as ji,I as Ct,J as Ki,K as zi,L as Ji,M as Gi,N as Yi,O as Zi,P as Et,Q as Ht,R as Xi,S as Qi,T as es,U as ts,V as At,W as Lt,X as ns,Y as Ot,Z as is,_ as qe,a as xe,aa as $e,ba as os,ca as rs,d as Ie,da as oe,e as Mt,ea as G,fa as Be,g as Tt,ga as ue,h as Ii,ha as as,i as le,ia as cs,j as se,ja as ds,k as Di,l as T,la as ls,m as Se,ma as It,na as us,o as _i,p as De,q as Wi,r as Pt,s as Rt,t as Ni,u as Vi,v as ke,w as qi,x as _e,y as Bi,z as Ui}from"./chunk-J23RLD45.js";import{Fa as Ue,Ga as bs,Ia as Ts,Ja as Ps,Ka as Rs,Qa as Cs,Ta as Es,Va as Nt,Wa as Hs,ad as _s,qa as hs,ra as Dt,sa as ms,ta as fs,ua as gs,va as ws}from"./chunk-W6YU56LQ.js";import{h as Zs}from"./chunk-I2MF4WTU.js";import{a as As,b as Ls,c as Os,d as Vt,e as qt,g as Is,h as Ds}from"./chunk-3BJTPW4K.js";import{a as Fe,g as je,h as Ut}from"./chunk-ACPB4CG3.js";import{Ca as ps,Sb as ks,Tb as $s,Ub as Ms,Wb as Wt}from"./chunk-GEU5IYGP.js";import{o as Ri,p as vt,q as Ci,r as xt,s as St,w as Hi,x as Ai,y as Li,z as Oi}from"./chunk-PMZSPO3Y.js";import{b as Xn,c as lt,d as Qn,e as ut,f as ei}from"./chunk-ZOJGMATP.js";import{a as Fs,b as js,c as Ks,d as zs,e as Js,f as Gs,g as Ys}from"./chunk-ACOCH434.js";import{f as $t}from"./chunk-4I5F75IY.js";import{a as ft,b as gt,c as mi,d as fi,e as gi,f as wi,g as bi,h as yi,i as vi}from"./chunk-JCQFWMVM.js";import{d as $i}from"./chunk-TSPXCVLQ.js";import{a as pi,b as hi,g as Ei}from"./chunk-QFOBYXGW.js";import{a as xi,b as Si,d as ki}from"./chunk-QUOL6HJ4.js";import{Aa as ii,Cb as mt,Eb as Le,Nd as ao,S as ni,c as En,db as si,eb as oi,fb as ri,kd as io,lb as ai,ld as so,mb as ci,md as oo,nb as di,nd as ro,ob as li,pb as ui,qb as z,rb as V,sb as ve,ub as _,vb as de}from"./chunk-LRF3BBJM.js";import{P as pt,U as ht,j as ti}from"./chunk-DK2DZHWA.js";import{Q as kt,j as ie,l as wt,m as Mi,n as Oe,o as bt,p as Ti,q as yt,r as Pi}from"./chunk-YDWRUXOV.js";import{A as Jn,B as Gn,d as D,h as Hn,j as An,k as Ln,l as On,m as In,n as Dn,o as _n,p as Wn,y as Nn,z as zn}from"./chunk-MF5FNHUX.js";import{$h as Bn,Eg as N,Gg as ct,Kg as Mn,Lg as Tn,Lh as Vn,Mg as Pn,Ng as Rn,Oh as qn,Pg as Cn,Wh as Ee,Xh as ce,aj as Kn,b as K,ci as He,d as c,e as $,fi as Un,g as p,gi as Fn,hi as dt,ig as $n,ii as jn,j as kn,k as A,kh as M,l as S}from"./chunk-D2VEH7YA.js";import{a as Yn,b as Ae,c as Zn}from"./chunk-5XITPOUG.js";import{a as v}from"./chunk-LO2NM3CE.js";var Jt="In the page switcher",Wr=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],Gt="switcher-settings",co=`${Gt}:resetDot`;function lo(e){return bs(e,Wr,n=>{let t=Ue(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function uo(e){let n=Ue(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function Yt(e,n){return`${Gt}:typed:${e.pageId.toUpperCase()}:${n}`}function Kt(e,n){let t=e.uiState.get(Yt(e,n));return typeof t=="string"?t:void 0}function Nr(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function Vr(e){let n=Nr(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...e.uiState.keys()])i.startsWith(`${Gt}:typed:`)&&(t===void 0||i!==Yt(e,t))&&e.uiState.delete(i)}function pe(e,n,t=!1){let i=e.uiState.delete(co);e.busy||e.edit(n,t&&!i?{typing:!0}:void 0)}function zt(e,n,t){let i=Yt(e,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&e.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(co,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&e.endCoalesce(),d.type==="checkbox"&&(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function po(e){Vr(e);let n=e.page,t=Ue(n),i=t.switcherDisplayMode??"text",s=hs.map(d=>[d,d==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=d=>pe(e,l=>Dt(l,e.pageId,d)),a=d=>pe(e,l=>ms(l,e.pageId,d),!0);return c`
    ${_("Hidden",t.hideFromSwitcher,d=>pe(e,l=>ws(l,e.pageId,d)),!1)}
    ${t.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:p}
    ${V("Show as",s.some(([d])=>d===i)?i:"text",s,d=>pe(e,l=>gs(l,e.pageId,d)))}
    ${zt(e,"switcherText",li("Name",Kt(e,"switcherText")??t.switcherText??"",d=>pe(e,l=>fs(l,e.pageId,d),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>pe(e,d=>Dt(d,e.pageId,""))}>Automatic icon</button>
    </div>
    ${zt(e,"switcherIcon",Le({icons:e.icons,symbols:e.symbols},Kt(e,"switcherIcon")??t.switcherIcon??"",r,"sw:switcher-icon",{emptyText:"Picked by the watch",tint:t.switcherColor}))}
    ${zt(e,"switcherColor",c`<div class="ts-no-alpha">${de("Color",Kt(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var Z=Fe.routing;function Zt(e){return Z.actions.find(n=>n.action===e)}function X(e){return Zt(e)?.keys??[]}function B(e){return Object.hasOwn(Z.keys,e)?Z.keys[e]:void 0}function me(e){return ie(e.voiceConfig)?e.voiceConfig:{}}function qr(e,n){let t=Z.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function Q(e,n){let t=B(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=Z.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?qr(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,o]=t.clamp??[-1/0,1/0];return Math.min(o,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function mo(e,n){let t=B(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=Q(e,i[1]),o=i[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof s=="string"&&o.includes(s);return i[2]===void 0?r:!r}function ze(e,n){let t=B(n);if(t?.type!=="enum")return[];let i=Z.labels[t.enum??""]??{},s=Z.offered[n]??Z.enums[t.enum??""]??[],o=Q(e,n);return(typeof o=="string"&&!s.includes(o)?[o,...s]:s).map(a=>[a,i[a]??a])}function fo(e){return B(e)?.label??Br[e]??e}var Br={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Xt(e,n,t){let i=B(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!ze(e,n).some(([r])=>r===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[r,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(r,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let r=(t??"").trim();if(r==="")return Ut(e,n);s=r;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let r=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return Ut(e,n);s=r;break}}return(Object.hasOwn(e,n)?kt(e[n],s):kt(Q(e,n),s))?e:je(e,n,s)}function go(e,n,t,i){let s=Q(e,n),o=Array.isArray(s)?s:[];return i===o.includes(t)?e:Xt(e,n,i?[...o,t]:o.filter(r=>r!==t))}function Ur(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function Fr(e,n){let t=B(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=Q(e,s);return typeof o=="string"&&i.includes(o)}function Qt(e,n,t,i){let s=B(n);if(s===void 0)return"None";if(!Fr(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let o=Ur(s,t);return typeof o=="string"&&o.trim()!==""?`Default (${i(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function ho(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function he(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function Je(e,n,t){let i=ho(n),s=ho(t);return e.filter(o=>!he(i,o)&&(s.length===0||he(s,o)))}function jr(e,n){return{hiddenPhraseIds:e.filter(t=>!he(n,t)),knownPhraseIds:e.slice()}}function wo(e,n,t,i){if(!he(n,t))return e;let s=Je(n,e.hiddenPhraseIds,e.knownPhraseIds);if(he(s,t)===i)return e;let o=i?n.filter(a=>he(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),r=jr(n,o);return je(je(e,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function bo(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function Kr(e,n,t,i,s){return We(e,n,t,o=>{if(!X(T(o)).includes(i))return o;let r=me(o),a=Xt(r,i,s);return a===r?o:Tt(o,"voiceConfig",a)})}function zr(e,n,t,i,s,o){return We(e,n,t,r=>{if(!X(T(r)).includes(i))return r;let a=me(r),d=go(a,i,s,o);return d===a?r:Tt(r,"voiceConfig",d)})}function Jr(e,n,t,i,s,o){return We(e,n,t,r=>T(r)==="ttsMenu"?wo(r,i,s,o):r)}function yo(e){return Object.keys(me(e)).some(n=>X(T(e)).includes(n))}function vo(e){let n=T(e);return X(n).length>0||n==="ttsMenu"}function xo(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Gr(e,n,t,i){let s=Ms(e.hass.states),o=Wt(s,t),r=a=>_(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function Yr(e,n,t,i){let s=B(t),o=bo(e.voice?.defaults),r=s?.domain==="conversation"?ks(e.hass.states):$s(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=Wt(r,i===""?[]:[i]);return[["",Qt(n,t,o,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??xo(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function Zr(e,n,t,i,s){let o=B(s);if(o===void 0||!mo(i,s))return p;let r=fo(s),a=Q(i,s),d=(l,u)=>e.edit(f=>Kr(f,n,t,s,l),u);switch(o.type){case"enum":return z(r,String(a),ze(i,s),l=>d(l),{snapBack:!0,def:String(o.default)});case"bool":return _(r,a===!0,l=>d(l),o.default);case"int":{let l=typeof a=="number"?a:Number(o.default),u=Fe.volume,[f,w]=o.clamp??[u.min,u.max];return c`${ve(r,l,m=>d(m,`slot:${t}:${s}`),{min:f,max:w,step:u.step,def:Number(o.default),format:m=>`${Math.round(m)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(m=>c`<button type="button" class="pe-chip ${m.value===l?"on":""}"
          aria-pressed=${m.value===l?"true":"false"} @click=${()=>d(m.value)}>${m.label} ${m.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return z(r,l,Yr(e,i,s,l),u=>d(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=bo(e.voice?.defaults),f=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${Qt(i,s,u,w=>xo(e.hass,w))}.`:"None picked.";return c`${Gr(e,r,l,(w,m)=>e.edit(g=>zr(g,n,t,s,w,m)))}
        <div class="hint ${l.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${l.length===0?f:`${l.length} picked.`}</div>`}}}function Xr(e,n,t){let i=typeof t.id=="string"?t.id:"",s=me(t),o=X(T(t));return c`${e.voice?.defaults===void 0?c`<div class="hint">${Us}.</div>`:p}
    ${o.map(r=>Zr(e,n,i,s,r))}`}function Qr(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=s.map(u=>u.id),r=Je(o,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],d=a.length>0&&o.some(u=>!a.some(f=>f.toUpperCase()===u.toUpperCase())),l=u=>r.some(f=>f.toUpperCase()===u.toUpperCase());return c`<div class="me-sub-h">${Zt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>_(u.name,l(u.id),f=>e.edit(w=>Jr(w,n,i,o,u.id,f))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function So(e,n,t){let i=T(t);if(i==="ttsMenu")return Qr(e,n,t);if(X(i).length>0)return Xr(e,n,t)}function ko(e,n){let t=T(n);if(t==="ttsMenu"){let r=e.voice?.phrases;return r===void 0?"":`${Je(r.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let i=me(n),s=X(t)[0];if(s===void 0)return"";let o=Q(i,s);return ze(i,s).find(([r])=>r===o)?.[1]??""}function Po(e,n,t,i,s,o,r=""){return c`<div class="mi-look">
    <div class="mi-look-title">${ai(e,n,t,d=>o(d),d=>i.find(([l])=>l===d)?.[1]??d)}</div>
    <div class="mi-pics ${r}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([d,l])=>{let u=d===n;return c`<button type="button" class="mi-pic ${u?"on":""}" aria-pressed=${u?"true":"false"} aria-label=${`${e}: ${l}`}
          @click=${()=>{d!==n&&o(d)}}>${s(d)}<span class="mi-pic-name">${l}</span></button>`})}
    </div>
  </div>`}function Ze(e,n,t,i,s){return c`<div class="mi-switch">${_(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function ea(e){return c`<div class="mi-wrap">${e}</div>`}function Xe(e,n){return oe(e).find(t=>t.key===n)}function en(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function Qe(e,n,t){return oe(n).some(i=>t.includes(i.key)&&Be(e,n,i)&&!en(G(e,n,i),i.default))}function Ge(e,n,t){let i=Xe(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:G(e.document,n,i),set:(o,r=!1)=>e.edit(a=>as(a,n,t,o),r?s:void 0)}}function tn(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function et(e,n){return n===void 0?p:ve(e,tn(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function $o(e,n,t,i){if(n===void 0)return p;let s=n.value===!0?"on":"off",o=n.field.default===!0?"on":"off";return Po(e,s,o,[["off",t[0]],["on",t[1]]],r=>i(r==="on"),r=>n.set(r==="on"))}var Ro=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],Co=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],Mo=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function ta(e){return c`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function na(e){return c`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function ia(e){if(e===void 0)return p;let n=tn(e),t=(e.field.presets??Mo.map(([s,o])=>({value:s,label:o}))).map(s=>[String(s.value),Mo.find(([o])=>en(o,s.value))?.[1]??s.label]),i=t.find(([s])=>en(Number(s),n))?.[0]??"";return c`${V("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${et("Exact",e)}`}function Eo(e){let n=i=>Ge(e,"quickAction",i),t=n("showContextLabel");return c`
    ${$o("Behind the ring",n("showIconBubble"),["Solid","Glass"],ta)}
    ${ia(n("backgroundDim"))}
    ${$o("Buttons",n("showNeonOutline"),["Plain","Neon"],na)}
    ${t===void 0?p:Ze("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${et("Glow",n("glowIntensity"))}`}function Ho(e){let n=t=>{let i=Xe("quickAction",t);return i===void 0?void 0:G(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function sa(){let e=ue("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function oa(e){let n=$``;switch(e){case"sectorWedge":n=$`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=$`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=$`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=$`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=$`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return c`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function ra(e,n){if(n===void 0||!Be(e.document,"quickAction",n.field))return p;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return c`<div class="ts-no-alpha">${de("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?p:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let o=s.toUpperCase()===t.toUpperCase();return c`<button type="button" class="ts-swatch ${o?"on":""}" aria-pressed=${o?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function Ao(e){let n=r=>Ge(e,"quickAction",r),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),o=n("showFingerShadow");return c`
    ${t===void 0?p:ea(V("Opening",String(t.value),ue("EntranceStyle"),r=>t.set(r),{def:String(t.field.default)}))}
    ${i===void 0?p:Po("Beam from your finger to the slot",String(i.value),String(i.field.default),sa(),oa,r=>i.set(r),"beams")}
    ${ra(e,n("beamColor"))}
    ${s===void 0||!Be(e.document,"quickAction",s.field)?p:et("Beam strength",s)}
    ${o===void 0?p:Ze("Finger shadow",o.value===!0,r=>o.set(r),o.field.default===!0,"A soft dark spot where your finger rests.")}`}function Lo(e){let n=s=>{let o=Xe("quickAction",s);return o===void 0?"":String(G(e,"quickAction",o))},t=(s,o)=>ue(s).find(([r])=>r===o)?.[1]??o,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var Oo=["glowIntensity","selectedScale"];function fe(e){return Math.round(e*1e3)/10}function Io(e){let n=Ge(e,"pageSwitcher","glowIntensity"),t=Ge(e,"pageSwitcher","selectedScale");return c`${et("Glow",n)}
    ${t===void 0?p:ve("Picked page size",fe(tn(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:fe(t.field.min??1),max:fe(t.field.max??1.5),step:fe(t.field.step??.05),def:fe(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function Do(e){let n=Xe("pageSwitcher","selectedScale"),t=n===void 0?void 0:G(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(fe(t))}%`:""}function Ye(e,n,t,i){return e.render(n,t,i)??c`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var _o=["light","switch","lock","cover","climate","media_player"],aa={media_player:"Media player"};function Wo(e,n,t,i,s){let o=t.some(a=>a.domain===n),r=o?[["","Pick another type"],...i]:[...i];return c`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let d=a.domain===n,l=aa[a.domain]??a.label;return c`<button type="button" class="mi-pic mi-type ${d?"on":""}" aria-pressed=${d?"true":"false"} data-type=${a.domain}
          @click=${()=>{d||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${Ye(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${l}</span></button>`})}
    </div>
    ${z("More types",o?"":n,r,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function No(e,n,t,i){return c`<div class="mi-acts">${t.map(s=>c`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(o=>{let r=o.raw===n,a=!r&&o.why!==void 0;return c`<button type="button" class="mi-act ${r?"on":""}" aria-pressed=${r?"true":"false"} ?disabled=${a} data-action=${o.raw}
        title=${o.why??p} @click=${()=>{r||i(o.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${Ye(e,o.icon,14,o.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${o.label}</span>
          ${o.why===void 0||r?p:c`<small class="mi-act-why">${o.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var ca=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function To(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function Vo(e,n,t,i){let s=new Map(t.map(r=>[r.position,r])),o=r=>{if(r===null)return c`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(r);if(a===void 0)return c`<span class="mi-where-cell" aria-hidden="true"></span>`;let d=a.here?"here":a.holder===void 0?"free":"held",l=a.here?Ye(e,n.icon,14,n.color):a.holder===void 0?M("plus"):Ye(e,a.holder.icon,13,a.holder.color);return c`<button type="button" class="mi-where-cell ${d}" data-place=${r} aria-label=${To(a)} title=${To(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:p}
      @click=${()=>{a.here||i(r)}}>${l}</button>`};return c`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${ca.map(r=>r.map(o))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var qo=K`
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
`;var jo=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],Ko="Each page's icon, color and name are set here: pick a page in the Pages card.",da="Pick a page in the Pages card to set how it shows here.",la={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},zo={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:Ko},ua="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",pa="Click a slot or its label to edit it. Click anywhere else for the menu's look.",be=.36,on=44,rn=22;function Jo(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function ha(e,n,t=be){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=o=>Math.round(o*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var Go="wrist-assistant-panel.menus.zoom.v1";function Yo(e=lt()){try{let n=e?.getItem(Go);if(n==null||n==="")return;let t=Number(n);return Ri.includes(t)?t:void 0}catch{return}}function Zo(e,n=lt()){try{n?.setItem(Go,e===void 0?"":String(e))}catch{}}var Xo={name:{color:D.place,icon:"text"},slot:{color:D.content,icon:"content"},where:{color:D.position,icon:"place"},look:{color:D.look,icon:"look"},shows:{color:D.states,icon:"states"},menu:{color:D.content,icon:"content"},style:{color:D.look,icon:"look"},motion:{color:D.look,icon:"radial"},switcherPage:{color:D.content,icon:"watch"}},ma="#26a69a",fa=D.complication,I="menu-editor";function Me(e,n,t){return`${e} ${e===1?n:t}`}function ge(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Qo(e,n){return{entityId:n,displayName:n===""?"":ge(e,n),domain:De(n)}}function Te(e,n,t,i){return e.icons.render(n,t,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function W(e){return le(T(e))===void 0?{icon:xe.unknownActionIcon,color:xe.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function er(e){let n=T(e);if(n==="triggerEntity"){let i=Se(e).entityId;return Rt(De(typeof i=="string"?i:""))}let t=le(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function C(e,n){return e.toUpperCase()===n.toUpperCase()}function ga(e,n){return e.toUpperCase()===n.toUpperCase()}function wa(e,n){let t=T(n),i=Se(n),s=le(t);for(let o of s?.payload??[]){let r=i[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return ge(e.hass,r);if(o.target==="page")return e.targets.pages.find(a=>C(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return e.targets.statusPages.find(a=>C(a.id,r))?.name??"A status page";if(o.target==="httpAction")return e.targets.httpActions.find(a=>C(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(d=>C(d.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function re(e,n){return wa(e,n)??se(T(n))}function we(e){return ke(e)?.label??e}var tr="me:menu",nr="me:er:mode",ir="me:er:domain",sn="me:er:entity",nn="me:er:add";function P(e){let n=e.uiState.get(tr);return n==="entity"||n==="switcher"?n:"anywhere"}function ba(e,n){n!==P(e)&&e.uiState.delete(tt),e.uiState.set(tr,n),e.requestUpdate()}var tt="me:sw:page";function sr(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function ee(e){if(P(e)!=="switcher")return;let n=e.uiState.get(tt);if(typeof n=="string")return sr(e).find(t=>C(t.id,n))}function an(e,n){n===void 0?e.uiState.delete(tt):e.uiState.set(tt,n),e.requestUpdate()}function or(e){let n=ee(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function cn(e){return jo.find(([n])=>n===e)?.[1]??e}function rr(e){return e.uiState.get(nr)==="entity"?"entity":"domain"}function ar(e){let n=e.uiState.get(ir);return typeof n=="string"&&ke(n)!==void 0?n:"light"}function cr(e){let n=$e(e.document),t=e.uiState.get(sn);return typeof t=="string"&&n.includes(t)?t:n[0]}function F(e){switch(P(e)){case"anywhere":return _e;case"entity":return dn(e);case"switcher":return}}function dn(e){if(rr(e)==="domain")return{list:"domain",domain:ar(e)};let n=cr(e);return n===void 0?void 0:{list:"entity",entityId:n}}function dr(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${we(n.domain)} menu`:`${ge(e.hass,n.entityId)} menu`}function lr(e){return`me:sel:${Bi(e)}`}function ae(e,n){let t=e.uiState.get(lr(n));if(typeof t=="string")return q(e.document,n).find(i=>C(R(i),t))}function ye(e,n,t){e.uiState.set(lr(n),t),e.requestUpdate()}function Pe(e){if(ee(e)!==void 0)return an(e,void 0),!0;let n=F(e);return n===void 0||ae(e,n)===void 0?!1:(ye(e,n,void 0),!0)}function nt(e,n,t){let i;e.edit(s=>{let o=Ji(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=o.id,o.document}),i!==void 0&&ye(e,n,i)}function Bo(e){let t=(i,s)=>Math.round((s+(i-.5)/be*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${on} ${rn}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>$`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function ya(e,n){return n===void 0?[]:q(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=Ve(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:W(t).color}]})}function va(e,n){if(n==="switcher")return Me(e.switcherPages.length,"page","pages");let t=n==="anywhere"?_e:dn(e);return t===void 0?"none yet":Me(q(e.document,t).length,"slot","slots")}function xa(e,n){if(n==="switcher"){let t=e.switcherPages;return Bo(t.map((i,s)=>({...ha(s,t.length),color:i.color})))}return Bo(ya(e,n==="anywhere"?_e:dn(e)))}var Sa="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function ur(e){let n=P(e);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${on}px; --thumb-h: ${rn}px`}>
    <div class="lc-head">
      <span class="swatch">${M("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${ua}>on the watch</span>
    </div>
    <p class="me-intro">${Sa}</p>
    <div class="layers me-menu-list" role="list">
      ${jo.map(([t,i])=>{let s=t===n,o=()=>{s||ba(e,t)};return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${zo[t]}
          @click=${o}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${xa(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${va(e,t)}</span></b><small>${la[t]}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function ka(e,n,t){return c`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${Te(e,n,14,t)}</span></span>`}function Uo(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${we(n.domain)} menu, by type`:`${ge(e.hass,n.entityId)}'s own menu`}function $a(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function Ma(e,n,t){let i=t!==void 0&&C(t.id,n.id),s=$a(n),o=()=>an(e,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${ka(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function Ta(e){let n=sr(e),t=ee(e),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${on}px; --thumb-h: ${rn}px`}>
    <div class="lc-head">
      <span class="swatch">${M("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${Me(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>Ma(e,s,t))}</div>`}
  </section>`}function pr(e){return P(e)==="switcher"?Ta(e):p}function hr(e){if(P(e)==="switcher")return[Me(e.switcherPages.length,"page","pages")];let n=F(e);if(n===void 0)return[Uo(e,n)];let t=Me(q(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[Uo(e,n),t]}function mr(e){return P(e)==="switcher"?Ko:F(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":pa}function fr(e,n){return Hi(e.uiState,I,n)}function Pa(e,n){Ai(e.uiState,I,n,!fr(e,n)),e.requestUpdate()}function Ra(e){if(or(e)!==void 0)return[{module:I,section:"switcher-page"}];let n=F(e),t=n===void 0?void 0:ae(e,n);if(t!==void 0)return[{module:I,section:"slot"},{module:I,section:"where"},...vo(t)?[{module:I,section:"voice"}]:[],{module:I,section:"look"},...n?.list==="anywhere"?[{module:I,section:"shows"}]:[]];let i=P(e);return i==="anywhere"?[{module:I,section:"style-anywhere"},{module:I,section:"motion-anywhere"}]:[{module:I,section:i==="entity"?"menu":`style-${i}`}]}function U(e,n,t,i,s,o={}){let r=fr(e,t),a=Xo[n];return Wn({color:a.color,icon:M(a.icon),title:i,open:r,onToggle:()=>Pa(e,t),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${I}:${t}`},r?s:c``)}function gr(e){let n=P(e),t=cn(n),i=F(e),s=i===void 0?void 0:ae(e,i),o=Ra(e),r=Li(e.uiState,o),a=ee(e),d=or(e),l,u;if(a!==void 0&&d!==void 0)l=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>an(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${fa}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=Ca(e,d);else if(s===void 0||i===void 0)l=c`<div class="crumbs"><span class="kchip" style=${`--k:${ma}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=Qa(e,n);else{let f=re(e,s);l=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>ye(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${W(s).color}`}>Slot</span><span class="nm" title=${f}>${f}</span></div>`,u=Ja(e,i,s)}return c`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{Oi(e.uiState,o,!r),e.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function Ca(e,n){let t=n.page;return U(e,"switcherPage","switcher-page",Jt,c`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Jt}>${po(n)}</fieldset>`,{summary:uo(t),dot:lo(t)})}var Ea={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function wr(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Ea[n.key]??n.key}var Ha={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function br(e){return se(e).replace(/ - (.+)$/," ($1)")}function Aa(e,n){if(n==="entityControl"){let t=Ui(e)??"all";return t==="all"?"Any entity":we(t)}return Ha[n]??Di(n)}function La(e,n,t){let i=T(t),s=Ki(n),o=a=>{let d=le(a),l=d===void 0?{icon:xe.unknownActionIcon,color:xe.unknownActionColor}:d,u=a===i?void 0:_i(a,e.targets);return{raw:a,label:br(a),icon:l.icon,color:l.color,...u===void 0?{}:{why:u}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[o(i)]}],...s.map(a=>({heading:Aa(n,a.category),tiles:a.actions.map(o)}))]}function Oa(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function Fo(){return c`<button type="button" class="link" @click=${ao}>Open HTTP actions</button>`}function Ia(e,n,t){let i=n.find(s=>C(s.id,t));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${Fo()}</div>`:e.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${Es} ${Fo()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function Da(e,n,t,i,s){let o=R(t),r=Se(t)[s.key],a=typeof r=="string"?r:"",d=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||d.some(h=>C(h.id,a)),u=h=>e.edit(x=>At(x,n,o,s.key,h===""?void 0:h)),f=s.target==="statusPage"&&e.statusPagesKnown===!0,w=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,m=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":f?`Not in this ${ce(e.device??"watch")}'s status pages`:w?Cs:Ts,g=h=>s.target==="httpAction"?Oa(h):h.name;return c`<label class="field"><span>${wr(i,s)}</span>
    <select .value=${ti(d.find(h=>C(h.id,a))?.id??a)} @change=${h=>u(h.target.value)}>
      ${s.required===!0?p:c`<option value="" ?selected=${a===""}>None</option>`}
      ${l?p:c`<option value=${a} selected>${m}</option>`}
      ${d.map(h=>c`<option value=${h.id} ?selected=${C(h.id,a)}>${g(h)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.device==="iphone"?c`<div class="hint ts-under">${ls}</div>`:e.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:s.target==="statusPage"?f||e.catalogKnown?p:c`<div class="hint ts-under">${Ee("status pages",e.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?Ia(e,e.targets.httpActions,a):p}`}function _a(e,n,t,i,s){let o=R(t),r=Se(t),a=(u,f)=>e.edit(w=>At(w,n,o,s.key,u),f),d=wr(i,s),l=Lt(t,s);switch(s.type){case"entity":{let u=typeof r[s.key]=="string"?r[s.key]:"",f=i==="runScene"?"scene":i==="runScript"?"script":Ni();return c`<div class="ts-stack">${mt({hass:e.hass},d,Qo(e.hass,u),w=>a(w.entityId),`me:entity:${o}`,{domain:f,clearable:!1,needed:u===""})}</div>
        ${u===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return Da(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let w=De(typeof r.entityId=="string"?r.entityId:""),m=Wi(w),g=typeof l=="string"?l:m[0]??"",h=m.map(x=>[x,Pt(x)]);return m.includes(g)||h.unshift([g,Pt(g)]),z(d,g,h,x=>a(x),{snapBack:!0})}let u=ue(s.enum),f=typeof l=="string"?l:String(s.default??"");return u.length<=4?V(d,f,u,w=>a(w)):z(d,f,u,w=>a(w),{snapBack:!0})}case"bool":return _(d,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&Lt(t,{key:"showBanner",type:"bool",default:!0})===!1)return p;let u=typeof r[s.key]=="number"?r[s.key]:void 0;return ui(d,u,f=>a(f,`slot:${o}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function Wa(e,n,t){if(!Et(n,t))return p;let i=R(t);return c`<div class="ts-stack">${V("Skip conditions",Ns(Ht(t)),Ws,s=>e.edit(o=>Xi(o,n,i,Vs(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Na(e){let n=qe(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(we).join(", ")}function Va(e,n){let t=R(n),i=qe(n),s=i===void 0,o=d=>e.edit(l=>is(l,t,d)),r=ns(),a=(i??[]).filter(d=>!Ot(d));return c`<div class="mi-wrap">${V("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],d=>o(d==="every"?void 0:r.slice(0,1)),{def:"every"})}</div>
    ${s?p:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(d=>{let l=i.includes(d),u=!Ot(d);return c`<button type="button" class="pe-chip ${l?"on":""} ${u?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${u?"Not reported by the watch":p}
          @click=${()=>o(l?i.filter(f=>f!==d):[...i,d])}>${we(d)}</button>`})}
    </div>
    ${a.length===0?p:c`<div class="hint warn">${a.map(we).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function qa(e,n){return Et(n,e)&&Ht(e)!==null}function Ba(e){return e.isVisible===!1}function Ua(e){return qe(e)!==void 0}function Fa(e){let n=er(e);if(n===void 0)return!1;let t=W(e);return t.icon!==n.icon||!ga(t.color,n.color)}function ja(e,n){let t=Xo.name;return c`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${M(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${re(e,n)}</span>
    </div>
  </section>`}function Ka(e){let n=J(e);return n.charAt(0)+n.slice(1).toLowerCase()}function za(e,n,t){let i=R(t),s=q(e.document,n).filter(o=>!C(R(o),i));return Ne().map(o=>{let r=s.find(d=>d.position===o),a={position:o,label:Ka(o),here:t.position===o};return r!==void 0&&(a.holder={name:re(e,r),...W(r)}),a})}function Ja(e,n,t){let i=R(t),s=T(t),o=le(s),r=W(t),a=er(t),d=typeof t.position=="string"?t.position:"",l=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${o===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${No(e.icons,s,La(e,n,t),m=>e.edit(g=>ts(g,n,i,m,e.targets)))}
    ${o?.description?c`<div class="mi-desc">${o.description}</div>`:p}
    ${zi(s)?c`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(o?.payload??[]).map(m=>_a(e,n,t,s,m))}
    ${Wa(e,n,t)}
  </fieldset>`,u=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${Vo(e.icons,r,za(e,n,t),m=>e.edit(g=>Yi(g,n,i,m)))}
    ${_("Shown on the watch",t.isVisible!==!1,m=>e.edit(g=>Zi(g,n,i,m)),!0)}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${Le({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",m=>e.edit(g=>Qi(g,n,i,m),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${de("Color",typeof t.color=="string"?t.color:void 0,m=>{m!==void 0&&e.edit(g=>es(g,n,i,m),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,w=So(e,n,t);return c`${ja(e,t)}
    ${U(e,"slot","slot","What it does",l,{summary:br(s),dot:qa(t,n)})}
    ${U(e,"where","where","Where",u,{summary:`${J(d)}${t.isVisible===!1?", hidden":""}`,dot:Ba(t)})}
    ${w===void 0?p:U(e,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${w}</fieldset>`,{summary:ko(e,t),dot:yo(t)})}
    ${U(e,"look","look","Icon and color",f,{summary:r.icon,dot:Fa(t)})}
    ${n.list==="anywhere"?U(e,"shows","shows","Shows on",c`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${Va(e,t)}</fieldset>`,{summary:Na(t),dot:Ua(t)}):p}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(m=>Gi(m,n,i))}>${M("delete")}<span>Remove</span></button>
    </div>`}function Ga(e){let n=Qe(e.document,"quickAction",Ro),t=Qe(e.document,"quickAction",Co);return c`${U(e,"style","style-anywhere","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${Eo(e)}
    </fieldset>`,{summary:Ho(e.document),dot:n})}
    ${U(e,"motion","motion-anywhere","Motion",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${Ao(e)}
    </fieldset>`,{summary:Lo(e.document),dot:t})}`}function Ya(e){let n=Qe(e.document,"pageSwitcher",Oo);return U(e,"style","style-switcher","Look",c`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${Io(e)}
  </fieldset>`,{summary:Do(e.document),dot:n})}function Za(e){let n=rr(e),t=a=>{e.uiState.set(nr,a),e.requestUpdate()},i=V("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,o,r=!1;if(n==="domain"){let a=ar(e),d=ke(a),l=qi(a),u=Vi().map(m=>[m.domain,m.label]),f=_o.flatMap(m=>{let g=ke(m);return g===void 0?[]:[{domain:g.domain,label:g.label,icon:g.icon,color:Rt(g.domain).color}]}),w=d?.inheritKey?Fi(e.document,a):!1;r=w,o=`By type \xB7 ${d?.label??a}`,s=c`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${Wo(e.icons,a,f,u,m=>{e.uiState.set(ir,m),e.requestUpdate()})}
      ${l.length>0?c`<div class="hint ts-under keep">The same menu as ${l.map(m=>m.label).join(", ")}.</div>`:p}
      ${d?.inheritKey?Ze("Fill gaps with the All menu",w,m=>e.edit(g=>ss(g,a,m)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):p}`}else{let a=$e(e.document),d=cr(e);o=`By entity \xB7 ${d===void 0?"none yet":ge(e.hass,d)}`;let l=u=>{let f=u.entityId.trim();f!==""&&(e.edit(w=>os(w,f)),e.uiState.set(sn,f),e.uiState.set(nn,(Number(e.uiState.get(nn)??0)||0)+1),e.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(u=>{let f=u===d;return c`<div class="me-entity ${f?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${f?"true":"false"}
            @click=${()=>{e.uiState.set(sn,u),e.requestUpdate()}}>
            <b>${ge(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(w=>rs(w,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${mt({hass:e.hass},"Add an entity",Qo(e.hass,""),l,`me:er:add:${String(e.uiState.get(nn)??0)}`,{clearable:!1})}
      </div>
    </div>`}return U(e,"menu","menu","Which menu",c`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
  </fieldset>`,{summary:o,dot:r})}var Xa="Click a slot on the watch to change what it does.";function Qa(e,n){let t=n==="anywhere"?Ga(e):n==="switcher"?Ya(e):Za(e);return c`<p class="me-menu-note">${zo[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?da:Xa}</p>`}var yr=K`
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
`;var ec=["spring","popIn","fade","none"],tc=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function Re(e,n,t){let i=oe(n).find(s=>s.key===t);return i===void 0?void 0:G(e,n,i)}function Ce(e,n,t,i){let s=oe(n).find(a=>a.key===t),o=Re(e,n,t),r=typeof o=="number"&&Number.isFinite(o)?o:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,r))}function it(e,n){return Re(e,"quickAction",n)===!0}function nc(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function st(e){let n=Re(e,"quickAction","entranceStyle"),t=Re(e,"quickAction","beamStyle");return{glass:it(e,"showIconBubble"),neon:it(e,"showNeonOutline"),labels:it(e,"showContextLabel"),finger:it(e,"showFingerShadow"),entrance:ec.includes(n)?n:"none",dim:Ce(e,"quickAction","backgroundDim",1),beam:tc.includes(t)?t:"none",beamColor:nc(Re(e,"quickAction","beamColor")),beamIntensity:Ce(e,"quickAction","beamIntensity",.5),glow:Ce(e,"quickAction","glowIntensity",.5)}}function ic(e){return{glow:Ce(e,"pageSwitcher","glowIntensity",.5),scale:Ce(e,"pageSwitcher","selectedScale",1.2)}}var un="ms:play",sc=1500;function oc(e){let n=e.uiState.get(un);e.uiState.set(un,{menu:P(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function rc(e){let n=e.uiState.get(un);return n===void 0||n.menu!==P(e)||Date.now()-n.at>sc?"":n.count%2===1?"ms-play-a":"ms-play-b"}function Sr(e,n){let t=q(e,n),i=ji(e,n),s=new Set(Ct(e,n));return Ne().map(o=>{let r=t.filter(u=>u.position===o),a=r.find(u=>u.isVisible!==!1),d=a===void 0?i.find(u=>u.position===o&&u.isVisible!==!1):void 0,l=a??(d===void 0?r[0]:void 0);return{position:o,own:r,main:l,second:r.find(u=>u!==l),shared:d,free:s.has(o)}})}function ac(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=R(n),o=e.find(r=>r.main!==void 0&&C(R(r.main),s));if(o!==void 0)return{position:o.position,slot:n}}let i=e.flatMap(s=>{let o=t(s.main)?s.main:s.shared;return o===void 0?[]:[{position:s.position,slot:o}]});return i.find(s=>s.position==="topCenter")??i[0]}var b=e=>Math.round(e*100)/100;function hn(e,n){let t=Jo(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function ln(e,n,t,i){return kr(e,n,hn(e.screen,t),i)}function kr(e,n,t,i){let{width:s,height:o}=e.screen,r=e.scale,a=[`left:${t.x*100}%`,`top:${t.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${b((s/2-t.px)*r)}px`,`--fy:${b((o/2-t.py)*r)}px`),n.finger){let d=t.px-s/2,l=t.py-o/2,u=Math.hypot(d,l);u>1&&a.push(`--sx:${b(d/u*5*r)}px`,`--sy:${b(l/u*5*r)}px`)}return a.join(";")}function pn(e,n){return Math.round(n*e.scale)}function cc(e,n,t,i,s){let o=hn(e.screen,t),r=(n.glass?28:25)*(o.y>.5?-1:1),a=(o.py+r)/e.screen.height;return c`<span class="ms-name" aria-hidden="true" style=${`left:${o.x*100}%;top:${b(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function dc(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,o=t*.18,r=(n-i*2-s)/2,a=(t-o-i-s*2)/3,d=[0,1,2,3,4,5].map(l=>{let u=i+l%2*(r+s),f=o+Math.floor(l/2)*(a+s);return $`<rect class=${`ms-tile t${l%4}`} x=${b(u)} y=${b(f)} width=${b(r)} height=${b(a)} rx=${b(n*.06)}></rect>`});return c`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${b(i)} y=${b(t*.075)} width=${b(n*.4)} height=${b(t*.045)} rx=${b(t*.0225)}></rect>
    ${d}
  </svg>`}function te(e,n,t){return $`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function vr(e,n,t,i){return $`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${b(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${b(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function lc(e,n,t){if(e.beam==="none")return p;let i=e.beamColor,s=e.beamIntensity,o=n.width/2,r=n.height/2,a=t.x-o,d=t.y-r,l=Math.hypot(a,d),u=Math.atan2(d,a),f=(h,x)=>`${b(o+Math.cos(u+h)*x)},${b(r+Math.sin(u+h)*x)}`,w=b(t.x),m=b(t.y),g;switch(e.beam){case"sectorWedge":{let h=Math.PI/4;g=$`${te("ms-b8",8,n)}${te("ms-b3",3,n)}
        <polygon points=${`${o},${r} ${f(-h/2,l*1.2)} ${f(h/2,l*1.2)}`} fill=${i} fill-opacity=${b(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${o},${r} ${f(-h*.3,l)} ${f(h*.3,l)}`} fill=${i} fill-opacity=${b(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":g=$`${te("ms-b7",7,n)}${te("ms-b10",10,n)}${vr("ms-wash",i,.35*s,.18*s)}
        <circle cx=${b((o+t.x)/2)} cy=${b((r+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${w} cy=${m} r="40" fill=${i} fill-opacity=${b(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":g=$`${te("ms-b4",4,n)}${te("ms-b5",5,n)}${vr("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${w} cy=${m} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${w} cy=${m} r="25" fill=${i} fill-opacity=${b(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":g=$`${te("ms-b6",6,n)}
        <circle cx=${w} cy=${m} r="30" fill=${i} fill-opacity=${b(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(h=>$`<circle cx=${w} cy=${m} r=${b((30+h*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${b((1-h)*.45*s)} stroke-width=${b(2-h*1.2)}></circle>`)}`;break;case"wakeWave":g=$`${te("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${o} y1=${r} x2=${w} y2=${m}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${b(.5*s)}></stop></linearGradient>
        <line x1=${o} y1=${r} x2=${w} y2=${m} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(h=>{let x=1-h;return $`<circle cx=${b(o+a*h)} cy=${b(r+d*h)} r=${b((20+x*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${b((1-x)*.5*s)} stroke-width=${b(Math.max(1.5-x*1.2,.3))}></circle>`})}
        <circle cx=${w} cy=${m} r="18" fill=${i} fill-opacity=${b(.25*s)} filter="url(#ms-b4)"></circle>`;break}return $`<g class="ms-beam">${g}</g>`}function uc(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":rc(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${b(n.dim*.85)}`,`--ms-blur:${b(2+n.dim*4)}px`,`--ms-g-r:${b(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function mn(e,n,t,i,s={}){let{width:o,height:r}=e.screen,a=e.scale,d=Math.min(o,r),l=uc(e,t),u=[`width:${Math.round(o*a)}px;height:${Math.round(r*a)}px;--me-s:${a}`,l.style,s.style??""].filter(w=>w!=="").join(";"),f=c`<div class=${`me-screen ms-screen ${l.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${u}>
    <div class="ms-backdrop" aria-hidden="true">${dc(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${o} ${r}`} aria-hidden="true">
      ${s.beamTo===void 0?p:lc(t,e.screen,s.beamTo)}
      <circle cx=${o/2} cy=${r/2} r=${d*be} class="me-track"></circle>
      ${t.finger?$`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${o/2} cy=${r/2} r=${b(d*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:p}
      <circle cx=${o/2} cy=${r/2} r=${d*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return Is(e.phone,{width:o,height:r},a,f,n,e.icons)}function pc(e,n,t,i){let s=st(e.document),o=Sr(e.document,n),r=ac(o,t),a=r===void 0?void 0:R(r.slot),d=t===void 0?void 0:R(t),l=(h,x=be)=>Ve(h,x),u=h=>a!==void 0&&C(R(h),a),f=(h,x,O,k,H)=>{let L=W(h),j=R(h),E=d!==void 0&&C(j,d),ne=h.isVisible===!1,Sn=`${J(x)}: ${se(T(h))}${ne?", hidden":""}`,Dr=["me-dot",k,E?"on":"",ne?"off":"",u(h)&&k===""?"ms-active":""].filter(_r=>_r!=="").join(" ");return c`<button type="button" class=${Dr} style=${ln(e,s,O,L.color)}
      title=${Sn} aria-label=${Sn} aria-pressed=${E?"true":"false"} @click=${()=>ye(e,n,j)}>
      ${Te(e,L.icon,pn(e,k===""?15:11),L.color)}${H>1?c`<span class="me-count" aria-hidden="true">${H}</span>`:p}</button>`},w=o.map(h=>{let x=l(h.position);if(x===void 0)return p;let O=p,k;if(h.main!==void 0)O=f(h.main,h.position,x,"",h.own.length),h.main.isVisible!==!1&&(k=h.main);else if(h.shared!==void 0){let E=W(h.shared),ne=`${J(h.position)}: ${se(T(h.shared))}, from All`;O=c`<span class=${`me-dot inh${u(h.shared)?" ms-active":""}`} style=${ln(e,s,x,E.color)} title=${ne}>
        ${Te(e,E.icon,pn(e,13),E.color)}</span>`,k=h.shared}else if(h.free){let E=J(h.position);O=c`<button type="button" class="me-dot free" style=${ln(e,s,x)} ?disabled=${e.busy}
        title=${`Add a slot at ${E}`} aria-label=${`Add a slot at ${E}`}
        @click=${()=>nt(e,n,h.position)}>${M("plus")}</button>`}let H=h.second===void 0?void 0:l(h.position,.2),L=h.second===void 0||H===void 0?p:f(h.second,h.position,H,"two",0),j=s.labels&&k!==void 0?cc(e,s,x,W(k).color,re(e,k)):p;return c`${O}${L}${j}`}),m=r===void 0?void 0:l(r.position),g=hn(e.screen,m??{x:.5,y:.5-be});return mn(e,`${i} on the watch`,s,w,{beamTo:{x:g.px,y:g.py}})}function $r(e){let n=t=>Math.min(1.18,Math.max(.82,t));return{w:n(e.width/198),h:n(e.height/242)}}function xr(e,n,t){let{width:i,height:s}=e,o=$r(e),r=34*o.w,a=i-34*o.w,d=52*o.h,l=s-30*o.h,u=(d+l)/2,f=i/2,w=18*o.w,m=8*o.h,g=[{x:f,y:d-14*o.h},{x:r+w,y:d+m},{x:r,y:u},{x:r+w,y:l-m},{x:f,y:l+8*o.h},{x:a-w,y:l-m},{x:a,y:u},{x:a-w,y:d+m}];if(t<=1)return g[0];let h=[0];for(let k=1;k<=g.length;k++){let H=g[k-1],L=g[k%g.length];h.push(h[k-1]+Math.hypot(L.x-H.x,L.y-H.y))}let x=h[g.length],O=n*x/t%x;for(let k=0;k<g.length;k++){let H=h[k],L=h[k+1];if(O>=H&&O<=L){let j=L>H?(O-H)/(L-H):0,E=g[k],ne=g[(k+1)%g.length];return{x:E.x+(ne.x-E.x)*j,y:E.y+(ne.y-E.y)*j}}}return g[0]}function hc(e){return[...e].slice(0,4).join("").trim()}function mc(e){let n=st(e.document),t=ic(e.document),i=e.switcherPages,s=ee(e),o=Math.max(0,s===void 0?0:i.findIndex(m=>C(m.id,s.id))),{width:r,height:a}=e.screen,d=m=>({x:m.x/r,y:m.y/a,px:m.x,py:m.y}),l=i.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((m,g)=>{let h=d(xr(e.screen,g,i.length)),x=g===o,O=g===0&&!x,k=Math.round((x?.7:O?.4:.15)*t.glow*100),H=[kr(e,n,h,m.color),`--ms-ga:${k}%`,`--ms-gr:${x?45:30}`,`--ms-k:${x?t.scale:1}`].join(";"),L=["ms-sw",x?"ms-active":"",O?"ms-current":""].filter(E=>E!=="").join(" "),j=m.text===void 0?Te(e,m.icon,pn(e,n.glass?18:x?16:14),x&&!n.glass?"white":m.color):c`<span class="ms-sw-text">${hc(m.text)}</span>`;return c`<span class=${L} style=${H} title=${m.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${j}</span>`}),u=i[o],f=u===void 0?p:c`<span class="ms-sw-name" style=${`top:${b(8*$r(e.screen).h/a*1e4)/100}%`}>${u.name}</span>`,w=i.length===0?void 0:xr(e.screen,o,i.length);return mn(e,"Page switcher on the watch",n,c`${l}${f}`,{beamTo:w,classes:"ms-switcher"})}function fc(e){if(P(e)==="switcher")return mc(e);let n=F(e);return n===void 0?mn(e,"Entity quick menu on the watch",st(e.document),c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):pc(e,n,ae(e,n),dr(e,n))}var gc={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function wc(e,n,t,i){let s=R(t),o=i!==void 0&&C(s,R(i)),r=t.isVisible===!1,a=re(e,t),d=`${se(T(t))}${r?", hidden":""}`;return c`<button type="button" class=${`ms-label${o?" on":""}${r?" off":""}`} data-slot=${s}
    style=${`--k:${W(t).color}`} aria-pressed=${o?"true":"false"}
    @click=${()=>ye(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${d}</small></span></button>`}function bc(e,n,t,i){let s=J(t.position),o=t.own.map(r=>wc(e,n,r,i));return t.shared!==void 0&&o.push(c`<span class="ms-label ms-inh" style=${`--k:${W(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${re(e,t.shared)}</b><small>From the All menu</small></span></span>`),o.length===0&&t.free&&o.push(c`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>nt(e,n,t.position)}>${M("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),c`<div class=${`ms-place ms-at-${t.position} ms-${gc[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${o}</div>`}function Mr(e){let n=fc(e),t=P(e)==="switcher"?void 0:F(e);if(t===void 0)return c`<div class="me-stage-body">${n}</div>`;let i=ae(e,t);return c`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${Sr(e.document,t).map(s=>bc(e,t,s,i))}
  </div></div>`}var yc=c`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function Tr(e){let n=P(e),t=st(e.document),i=p;if(n!=="switcher"){let o=F(e),r=o===void 0?[]:Ct(e.document,o),a=o===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=c`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||o===void 0||r.length===0}
      title=${a} @click=${()=>{o!==void 0&&nt(e,o)}}>${M("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?p:c`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>oc(e)}>${yc}<span class="word">Play opening</span></button>`;return i===p&&s===p?c``:c`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function Pr(e){if(P(e)!=="entity")return p;let n=F(e);return n===void 0||ae(e,n)===void 0?p:c`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Pe(e)}>Change the type or entity</button></span>`}var vc={anywhere:{gesture:"hold",open:"Touch and hold an empty spot on any page, slide to a slot, then lift your finger.",use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to a slot, then lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"hold",open:"Open the Anywhere menu and slide to its Pages slot. Then slide to a page and lift your finger.",use:"Jumping straight to any page. It needs a Pages slot in the Anywhere menu. Pick a page in the Pages card to set how it shows here."}};function Rr(e){let n=vc[P(e)];return to({art:n.gesture,label:"How it opens",how:n.open,use:n.use})}var Cr=K`
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
`;function fn(e){if(e.length===0)return"";let n=e.map(i=>ds(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Er(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${fn(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Yn}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function Or(){return Qs()||xs()}ro({dirty:Or,drop:()=>{eo(),Ss()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Or()&&(e.preventDefault(),e.returnValue="")});var xc=15e3,Ir=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),gn=Ir?"\u2318":"Ctrl+",wn={min:200,max:720,middleMin:320},bn={left:280,right:320},yn="wrist-assistant-panel.menus.columns.v1",Sc="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",kc=24,Hr=820;function vn(e){return Ae(e).message}function ot(e){return Ae(e).code}function rt(e){let{code:n,message:t}=Ae(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function $c(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function Mc(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":En(Math.max(0,(Date.now()-n)/1e3))}function Tc(e){return e instanceof HTMLElement?Si(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Pc(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function Rc(e){return ie(e)?wt(e).filter(n=>!yt(n)&&Ii(Oe(n))).map(n=>({id:Oe(n),name:bt(n)})):[]}var Ar=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function at(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var Cc="#8E8E93";function xn(e){if(!ie(e))return[];let n=0;return wt(e).filter(t=>!Ti(t)&&!yt(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=bt(t),o=at(t.switcherIcon)??at(Mi(t)[0]?.icon)??(Pi(t)?"bolt.fill":"square.grid.2x2.fill"),r=i?Cc:Ar[n++%Ar.length],a=at(t.switcherColor)??r,d=t.switcherDisplayMode==="icon"?void 0:at(t.switcherText)??s;return{id:Oe(t),name:s,icon:o,color:a,...d===void 0?{}:{text:d},hidden:i}})}function ml(e){return xn(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var Lr={ok:0,warn:1,err:2};function Ec(e,n){return e===void 0?n:n===void 0?e:{kind:Lr[n.kind]>Lr[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function Hc(e){let n=Ie(e)??{},t=q(n,{list:"anywhere"}).length,i=$e(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(t)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var y=class extends kn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new zn(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Yo();this.columns={...bn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new mi(this);this.symbols=new ni(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!Pc()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,o=t.key.toLowerCase();if(s&&!t.altKey&&o==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!Tc(i[0])){if(s&&!t.altKey&&o==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&o==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let r=this.viewHost();r!==void 0&&Pe(r)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(Sc)))return;let r=this.viewHost();r!==void 0&&Pe(r)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=t.composedPath(),s=o=>i.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(ci,this.onScrubStart),this.addEventListener(di,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return Bn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return Zs(this.watches,this.watchId)?"iphone":"watch"}get draft(){let t=this.watchId,i=this.record;if(!(t===void 0||i===void 0)){if(i.revision>0){let s=Y(t);if(s!==void 0)return s;let o=Ie(i.document);return o===void 0?void 0:Ft(t,o,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return Y(t)??jt(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return _t(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return Rc(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(Y(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return ee({uiState:this.uiState,switcherPages:[],switcherRows:xn(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Qn(yn,bn,wn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,$n(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=Kn(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),bi(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let r=()=>this.pagesSaveEnded(t);i.then(r,r)}let s=Y(t)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let o=()=>this.saveEnded(t);s.then(o,o)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,i=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(t),this.load(t,i),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let o=await N(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=qs(o)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Bt(t),defaults:Bs(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let o=await N(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=Ps(o)}catch(o){if(s!==this.catalogSeq||t!==this.watchId)return;Nt(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await Cn(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=si(s)}catch(s){if(i!==this.httpLibrarySeq)return;oi(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let o=await N(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=Rs(o)}catch(o){if(s!==this.statusPagesSeq||t!==this.watchId)return;Nt(o)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let o=await N(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&ie(o.document)&&!(_t(t)?.saving??!1)&&vs(t,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let o=await N(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=o.revision>0&&ie(o.document)?o.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await N(s,t,"menus");if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;us(r)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=vn(r)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let i=this.watchId;this.record=t,i!==void 0&&t.revision<=0&&jt(i);let s=t.revision>0?Ie(t.document):void 0;if(i===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===i&&t.revision>=o.revision&&(this.restartDraft=void 0,(Y(i)?.dirty??!1)||Ke(i));let r=Ft(i,s,t.revision);r.replaced.length>0?this.note={kind:"warn",text:fn(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await Mn(i,t,"menus");if(s!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||t!==this.watchId)return;this.historyState=ot(o)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;Rn(i,t,o=>{s===this.subscribeSeq&&(o.kind==="catalog"?Hs(o,this.catalog)&&this.loadCatalog(t):o.kind==="status_pages"?this.loadStatusPages(t):o.kind==="pages"?this.loadPages(t):o.kind==="behavior"?this.loadBehavior(t):o.kind==="voice"?this.loadVoice(t):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Vn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},xc))}async poll(){this.pollTimer=void 0;let t=this.hass,i=this.watchId,s=this.record;if(!(!t||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await N(t,i,"menus");if(i!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),o}editPages(t,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let o=this.scrubKey??i,r=s.apply(t(s.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??xi,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=ki(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:ri(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Bt(this.voiceDocument)}}screen(){let t=this.phoneLayout();if(t!==void 0)return Os(t);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(ht(i?.screen_size)??pt).screen}phoneLayout(){if(this.device!=="iphone")return;let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return Ls(As(t?.screen_size))}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,o=xn(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*qt,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(r,a)=>this.draft===t&&this.edit(r,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let i=this.pagesDraft;if(i===void 0||$t(i.document,t)===void 0)return;let s=this,o=this.memoIcons();return{pageId:t,icons:o,symbols:this.symbols,uiState:this.uiState,get page(){return $t(i.document,t)??{}},get busy(){return s.saving},edit:(r,a)=>{this.pagesDraft===i&&this.editPages(r,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(t||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.watchId;this.endScrub();let s=this.draft,o=this.pagesDraft;if(!t||i===void 0||!s||this.saving)return;let r=s.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let d=r?await this.saveMenus(t,i,s,s.revision<=0):void 0,l=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(t,i,o):void 0;i===this.watchId&&(this.note=Ec(d,l))}async saveMenus(t,i,s,o=!1){let r=Xs(s,{prepare:cs,save:(d,l)=>ct(t,i,"menus",d,l).catch(u=>{throw rt(u)}),fetch:async()=>{let d=await N(t,i,"menus").catch(l=>{throw rt(l)});return{revision:d.revision,document:d.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await r.catch(d=>({ok:!1,revision:s.revision,merged:!1,code:ot(d)??"unknown",message:vn(d)}));return this.saveEnded(i),zs(o,a.code,Er(a))}async savePages(t,i,s){let o=ys(s,{prepare:a=>_s(ps(a),s.base,this.hass?.states),save:(a,d)=>ct(t,i,"pages",a,d).catch(l=>{throw rt(l)}),fetch:async()=>{let a=await N(t,i,"pages").catch(d=>{throw rt(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:ot(a)??"unknown",message:vn(a)}));return this.pagesSaveEnded(i),Zn(r)}startFresh(){let t=this.watchId;t===void 0||!jn(this.noRecordState())||(Fs("menus",t),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let i=this.hass,s=this.watchId,o=this.record;if(!i||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:t,baseRevision:o.revision};this.restoreAsk=r,Tn(i,s,"menus",t.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:Hc(a.document)})},()=>{})}async restore(){let t=this.hass,i=this.watchId,s=this.restoreAsk;if(!t||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await Pn(t,i,"menus",s.entry.revision,s.baseRevision);o={kind:"ok",text:$i(s.entry.updated_at)},i===this.watchId?this.restartDraft={watchId:i,revision:r.revision}:(Y(i)?.dirty??!1)||Ke(i)}catch(r){let a=ot(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:`Not restored. Home Assistant no longer holds menus for this ${ce(this.device)}.`}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${ii(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=o,this.load(i,!0))}render(){let t=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,t):p}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Hr}renderTopBar(t,i){let s=t!==void 0&&!this.unsupported,o=s&&this.dirty,r=this.shellOwnsWatch;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${M("menu")}</button>`:p}
      ${r?p:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():io(void 0,!1)}>${M("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?p:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?Jn({newWatch:this.newWatch,dirty:o,saved:gt(this.record,void 0,this.device),device:this.device}):p}
      ${this.renderSyncPill(s?t:void 0)}
      ${this.renderTopMenu(s?t:void 0)}
      ${s?c`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${gn}S). A save reaches the ${ce(this.device)} the next time it checks.`:`Nothing to save (${gn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:c`<span class="tb-saved" title=${o?"Unsaved changes":""}>${gt(this.record,void 0,this.device)}</span>
        ${Gs(Ks({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:p}
      ${r?p:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():oo(void 0)}>${M("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help with Menus" aria-label="Help with Menus"
        @click=${()=>window.open(so,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return p;let s=t===void 0?{size:0,limit:1}:Mt(t.document),o=ft({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState,device:this.device});return c`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(t=this.watches){return Un(t.find(i=>i.owner_watch_id===this.watchId))}opensReady(t=this.watches){return js(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let i=this.canStartFresh();if(t===void 0&&!i)return p;let s=this.topMenuOpen,o=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:p}
        ${i?c`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${dt}</button>`:p}
      </div>`:p}
    </span>`}colorOf(t){return hi(pi(this.owners.length>0?this.owners:this.ownList??[]),t)}renderWatchPicker(t){if(t.length<2)return p;let i=t.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.colorOf(r);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${M("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(i?.owner_watch_id)}<span class="tb-browse-l">${i?He(i,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${M("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(r=>{let a=r.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${He(r,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?M("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Hr?this.columns:Xn(this.hostWidth-kc,this.columns,wn)}renderGutter(t){return c`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();ei(i,{side:t,base:t==="left"?s.left:s.right,limits:wn,onWidth:o=>{this.columns={...this.columns,[t]:o}},onEnd:()=>ut(yn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:bn[t]},ut(yn,this.columns)}}></div>`}get stageScale(){return this.zoom??vt(this.narrow||this.stacked)}setZoom(t){this.zoom=t,Zo(t)}renderStage(t,i){let s=i.find(f=>f.owner_watch_id===this.watchId),o=ht(s?.screen_size),r=o??pt,a=t.phone===void 0?r.label:t.phone.model.label,d=[...hr(t),a],l=this.undoDraft,u=cn(P(t));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${u}>${u}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${He(s,i)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${t.phone!==void 0?Vt:o===void 0?`${r.label}, this watch's size is not known`:d.join(" \xB7 ")}><span class="fam">${d.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${gn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${M("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${Ir?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${M("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(a,t)}
        ${Rr(t)}
        ${Mr(t)}
        <div class="under"><span class="tail">${mr(t)}</span>${Pr(t)}</div>
      </div>
    </div>`}renderStageTools(t,i){let s=i.phone!==void 0,o=this.stageScale,r=vt(this.narrow||this.stacked),a=d=>Ci(s?d*qt:d);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${Tr(i)}
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${s?Vt:`This watch's screen, ${t}.`}>
        ${M(s?"phone":"watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${o<=St(o)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(St(o))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${a(o)}. Back to fit`}
          title=${`The ${s?"iPhone":"watch"} at ${a(o)} of its own points. Click to fit it again (${a(r)}).`}
          @click=${()=>this.setZoom(void 0)}>${a(o)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${o>=xt(o)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(xt(o))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${It}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this ${ce(this.device)}'s menus: ${this.loadError}</span>
        ${l===void 0?p:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return c`<div class="pe-empty"><b>${It}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:Y(this.watchId),u=this.watchId;return c`<div class="pe-empty"><b>${Ee("menus",this.device)}</b><span>${Fn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${dt}</button>
        ${l?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Ke(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let o=this.viewHost();if(o===void 0)return c`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",d=i.revision<=0;return c`${d&&this.barHost===void 0?Js(this.device):p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${ur(o)}
        ${pr(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${gr(o)}
      </div>
    </div>
    ${d?p:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(t,i,s){let o=Mt(i),r=ft({record:t,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState,device:this.device}),a=this.watchId;return c`${fi({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?gi({noun:"menus",device:this.device,record:t,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?wi({noun:"menus",document:i,revision:t.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{yi(d).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(t){let i=this.record,s=Mc(t.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${qn(t.entry.updated_by,this.device)}${s?` ${s}`:""}, ${$c(t.entry.size)}.</p>
      ${t.summary?c`<p class="pe-muted">${t.summary}</p>`:p}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Nn,Hn,An,Ln,On,In,Dn,_n,Ei,Ds,Ys,K`
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
  `,yr,Cr,qo,vi,no,Gn]}};v([A({attribute:!1})],y.prototype,"hass",2),v([A({attribute:!1})],y.prototype,"owners",2),v([A({attribute:!1})],y.prototype,"ownerId",2),v([A({type:Boolean,reflect:!0})],y.prototype,"narrow",2),v([A({attribute:!1})],y.prototype,"icons",2),v([A({attribute:!1})],y.prototype,"iconsTick",2),v([A({attribute:!1})],y.prototype,"haMenu",2),v([A({attribute:!1})],y.prototype,"onHaMenu",2),v([A({attribute:!1})],y.prototype,"onBack",2),v([A({attribute:!1})],y.prototype,"onPages",2),v([A({attribute:!1})],y.prototype,"barActions",2),v([A({attribute:!1})],y.prototype,"shellOwnsWatch",2),v([A({attribute:!1})],y.prototype,"phones",2),v([A({attribute:!1})],y.prototype,"barHost",2),v([S()],y.prototype,"watchId",2),v([S()],y.prototype,"record",2),v([S()],y.prototype,"unsupported",2),v([S()],y.prototype,"catalog",2),v([S()],y.prototype,"statusPages",2),v([S()],y.prototype,"httpLibrary",2),v([S()],y.prototype,"pagesRecord",2),v([S()],y.prototype,"behavior",2),v([S()],y.prototype,"voiceDocument",2),v([S()],y.prototype,"loading",2),v([S()],y.prototype,"loadError",2),v([S()],y.prototype,"history",2),v([S()],y.prototype,"historyState",2),v([S()],y.prototype,"note",2),v([S()],y.prototype,"restoreAsk",2),v([S()],y.prototype,"restoring",2),v([S()],y.prototype,"historyOpen",2),v([S()],y.prototype,"rawOpen",2),v([S()],y.prototype,"rawCopied",2),v([S()],y.prototype,"ownList",2),v([S()],y.prototype,"topMenuOpen",2),v([S()],y.prototype,"watchMenuOpen",2),v([S()],y.prototype,"zoom",2),v([S()],y.prototype,"columns",2),v([S()],y.prototype,"hostWidth",2),v([S()],y.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",y);export{ba as a,yr as b,fc as c,Cr as d,yn as e,Rc as f,Ar as g,Cc as h,xn as i,ml as j,Ec as k,Hc as l,y as m};
