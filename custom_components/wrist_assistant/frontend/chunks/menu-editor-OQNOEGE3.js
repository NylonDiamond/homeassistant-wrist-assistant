import{a as _e,g as Ne,h as Vt}from"./chunk-RUZTQMS7.js";import{d as fi,e as j,f as Ot,g as At,h as Ve,i as gi,j as wi}from"./chunk-OJPD6WGR.js";import{L as bi,M as yi,N as vi,a as Ls,b as yt,e as Os,i as As,j as Ds,la as ki,ma as Mi,na as Wt,oa as Ti}from"./chunk-IOJIKNHC.js";import{o as hs,p as pt,q as he,r as ht,s as mt,w as gs,x as ws,y as bs,z as ys}from"./chunk-YBXTPCVB.js";import{b as _n,c as tt,d as Nn,e as nt,f as Un}from"./chunk-ZOJGMATP.js";import{$ as ci,A as Ae,B as De,C as q,D as We,E as Ks,F as Js,G as kt,H as Gs,I as Ys,J as Zs,K as Xs,L as Qs,M as ei,N as Mt,O as Tt,P as ti,Q as ni,R as si,S as ii,T as Pt,U as Rt,V as oi,W as Ct,X as ri,Y as Ht,Z as ai,_ as fe,a as vt,aa as di,ba as te,ca as ge,d as Ee,da as Et,e as xt,ea as It,fa as li,g as St,ga as ui,h as Vs,ha as pi,i as X,j as _,ja as hi,k as _s,ka as Lt,l as $,la as mi,m as me,n as Ns,o as Ie,p as Us,q as $t,r as qs,s as js,t as Fs,u as Le,v as Bs,w as Oe,x as zs,y as I,z as T}from"./chunk-HYAF3BAP.js";import{a as Pi,b as Ri,c as Ci,d as Hi,e as Ei,f as Ii,g as Li}from"./chunk-FMEYBIGP.js";import{Pa as Ps,Qa as bt,Ra as Rs,Sa as Cs,Ta as Hs,Ua as Es,b as xs,c as Ss,cb as He,d as $s,db as Is,j as ks,m as Ms,o as wt,p as Ts,xb as Ws}from"./chunk-XDMMZFSQ.js";import{Ib as xi,Jb as Si,Kb as $i,Mb as Dt,sa as vs}from"./chunk-UDRG2OIJ.js";import{a as at,b as ct,c as Qn,d as es,e as ts,f as ns,g as ss,h as is,i as os,j as ms,k as fs}from"./chunk-ITKWWUDL.js";import{b as Zn,p as Xn,w as ds}from"./chunk-6DYGFAUH.js";import{a as rs,b as as,d as cs}from"./chunk-QUOL6HJ4.js";import{$b as Re,$c as Wi,Ab as Fn,Bb as Bn,Cb as zn,Jb as Kn,Kb as Jn,Lb as Gn,Mb as Yn,Nb as V,Ob as Y,Pb as Pe,Q as it,Rb as H,Sb as pe,V as ot,Xa as jn,Yc as Oi,Zb as rt,Zc as Ai,_c as Di,fe as Vi,h as yn,na as qn,s as st}from"./chunk-BWJO5W6C.js";import{Ag as Qe,Bg as mn,Cg as fn,Dg as gn,Eg as wn,Fg as bn,_h as Cn,b as ee,c as d,cg as hn,d as R,dh as U,eh as k,f as h,hj as On,i as pn,ih as vn,ii as Hn,j as C,ji as Me,jj as An,k as S,kh as xn,kj as Dn,lh as Sn,lj as Wn,mh as $n,mi as En,nh as kn,ni as In,oh as Mn,oi as et,ph as Tn,pi as Ln,qh as Pn,yg as E,zh as Rn}from"./chunk-RYLMRUWW.js";import{f as gt}from"./chunk-WIDK423N.js";import{Q as ft,j as Z,l as dt,m as ls,n as Ce,o as lt,p as us,q as ut,r as ps}from"./chunk-Y5WD6GQY.js";import{a as Te,b as Vn}from"./chunk-KXSD4G27.js";import{a as y}from"./chunk-LO2NM3CE.js";var Ut="In the page switcher",Jo=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],qt="switcher-settings",_i=`${qt}:resetDot`;function Ni(e){return Is(e,Jo,n=>{let t=He(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function Ui(e){let n=He(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function jt(e,n){return`${qt}:typed:${e.pageId.toUpperCase()}:${n}`}function _t(e,n){let t=e.uiState.get(jt(e,n));return typeof t=="string"?t:void 0}function Go(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function Yo(e){let n=Go(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let s of[...e.uiState.keys()])s.startsWith(`${qt}:typed:`)&&(t===void 0||s!==jt(e,t))&&e.uiState.delete(s)}function ne(e,n,t=!1){let s=e.uiState.delete(_i);e.busy||e.edit(n,t&&!s?{typing:!0}:void 0)}function Nt(e,n,t){let s=jt(e,n),i=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return d`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{i(a.target)&&e.uiState.set(s,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(_i,!0))}}}
    @change=${a=>{let c=a.target;typeof HTMLInputElement>"u"||!(c instanceof HTMLInputElement)||(c.type==="color"&&e.endCoalesce(),c.type==="checkbox"&&(e.uiState.delete(s),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!i(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(s),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function qi(e){Yo(e);let n=e.page,t=He(n),s=t.switcherDisplayMode??"text",i=Ps.map(c=>[c,c==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=c=>ne(e,l=>bt(l,e.pageId,c)),a=c=>ne(e,l=>Rs(l,e.pageId,c),!0);return d`
    ${H("Hidden",t.hideFromSwitcher,c=>ne(e,l=>Es(l,e.pageId,c)),!1)}
    ${t.hideFromSwitcher?d`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:h}
    ${Y("Show as",i.some(([c])=>c===s)?s:"text",i,c=>ne(e,l=>Hs(l,e.pageId,c)))}
    ${Nt(e,"switcherText",Gn("Name",_t(e,"switcherText")??t.switcherText??"",c=>ne(e,l=>Cs(l,e.pageId,c),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>ne(e,c=>bt(c,e.pageId,""))}>Automatic icon</button>
    </div>
    ${Nt(e,"switcherIcon",Re({icons:e.icons,symbols:e.symbols},_t(e,"switcherIcon")??t.switcherIcon??"",r,"sw:switcher-icon",{emptyText:"Picked by the watch",tint:t.switcherColor}))}
    ${Nt(e,"switcherColor",d`<div class="ts-no-alpha">${pe("Color",_t(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var F=_e.routing;function Ft(e){return F.actions.find(n=>n.action===e)}function B(e){return Ft(e)?.keys??[]}function L(e){return Object.hasOwn(F.keys,e)?F.keys[e]:void 0}function ie(e){return Z(e.voiceConfig)?e.voiceConfig:{}}function Zo(e,n){let t=F.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function z(e,n){let t=L(n);if(t===void 0)return;let s=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let i=F.enums[t.enum??""]??[];return typeof s=="string"&&i.includes(s)?Zo(n,s):t.default}case"bool":return typeof s=="boolean"?s:t.default;case"int":{if(typeof s!="number"||!Number.isFinite(s))return t.default;let[i,o]=t.clamp??[-1/0,1/0];return Math.min(o,Math.max(i,Math.round(s)))}case"entity":return typeof s=="string"?s.trim():t.default;case"array":return Array.isArray(s)?s.filter(i=>typeof i=="string"):t.default}}function Fi(e,n){let t=L(n)?.shownWhen;if(t===void 0)return!0;let s=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(s===null)return!0;let i=z(e,s[1]),o=s[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof i=="string"&&o.includes(i);return s[2]===void 0?r:!r}function Ue(e,n){let t=L(n);if(t?.type!=="enum")return[];let s=F.labels[t.enum??""]??{},i=F.offered[n]??F.enums[t.enum??""]??[],o=z(e,n);return(typeof o=="string"&&!i.includes(o)?[o,...i]:i).map(a=>[a,s[a]??a])}function Bi(e){return L(e)?.label??Xo[e]??e}var Xo={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Bt(e,n,t){let s=L(n);if(s===void 0)return e;let i;switch(s.type){case"enum":if(typeof t!="string"||!Ue(e,n).some(([r])=>r===t))return e;i=t;break;case"bool":if(typeof t!="boolean")return e;i=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[r,a]=s.clamp??[-1/0,1/0];i=Math.min(a,Math.max(r,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let r=(t??"").trim();if(r==="")return Vt(e,n);i=r;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let r=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return Vt(e,n);i=r;break}}return(Object.hasOwn(e,n)?ft(e[n],i):ft(z(e,n),i))?e:Ne(e,n,i)}function zi(e,n,t,s){let i=z(e,n),o=Array.isArray(i)?i:[];return s===o.includes(t)?e:Bt(e,n,s?[...o,t]:o.filter(r=>r!==t))}function Qo(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function er(e,n){let t=L(n);if(t?.fallsBackTo===void 0)return!1;let s=t.fallsBackWhen;if(s===void 0)return!0;let i=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=z(e,i);return typeof o=="string"&&s.includes(o)}function zt(e,n,t,s){let i=L(n);if(i===void 0)return"None";if(!er(e,n))return i.type==="array"?"None":"Not set";if(t===void 0)return"Default";let o=Qo(i,t);return typeof o=="string"&&o.trim()!==""?`Default (${s(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(s).join(", ")})`:i.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function ji(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function se(e,n){let t=n.toUpperCase();return e.some(s=>s.toUpperCase()===t)}function qe(e,n,t){let s=ji(n),i=ji(t);return e.filter(o=>!se(s,o)&&(i.length===0||se(i,o)))}function tr(e,n){return{hiddenPhraseIds:e.filter(t=>!se(n,t)),knownPhraseIds:e.slice()}}function Ki(e,n,t,s){if(!se(n,t))return e;let i=qe(n,e.hiddenPhraseIds,e.knownPhraseIds);if(se(i,t)===s)return e;let o=s?n.filter(a=>se(i,a)||a.toUpperCase()===t.toUpperCase()):i.filter(a=>a.toUpperCase()!==t.toUpperCase()),r=tr(n,o);return Ne(Ne(e,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function Ji(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function nr(e,n,t,s,i){return Ae(e,n,t,o=>{if(!B($(o)).includes(s))return o;let r=ie(o),a=Bt(r,s,i);return a===r?o:St(o,"voiceConfig",a)})}function sr(e,n,t,s,i,o){return Ae(e,n,t,r=>{if(!B($(r)).includes(s))return r;let a=ie(r),c=zi(a,s,i,o);return c===a?r:St(r,"voiceConfig",c)})}function ir(e,n,t,s,i,o){return Ae(e,n,t,r=>$(r)==="ttsMenu"?Ki(r,s,i,o):r)}function Gi(e){return Object.keys(ie(e)).some(n=>B($(e)).includes(n))}function Yi(e){let n=$(e);return B(n).length>0||n==="ttsMenu"}function Zi(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function or(e,n,t,s){let i=$i(e.hass.states),o=Dt(i,t),r=a=>H(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),c=>s(a.entityId,c));return d`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function rr(e,n,t,s){let i=L(t),o=Ji(e.voice?.defaults),r=i?.domain==="conversation"?xi(e.hass.states):Si(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=Dt(r,s===""?[]:[s]);return[["",zt(n,t,o,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??Zi(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function ar(e,n,t,s,i){let o=L(i);if(o===void 0||!Fi(s,i))return h;let r=Bi(i),a=z(s,i),c=(l,u)=>e.edit(m=>nr(m,n,t,i,l),u);switch(o.type){case"enum":return V(r,String(a),Ue(s,i),l=>c(l),{snapBack:!0,def:String(o.default)});case"bool":return H(r,a===!0,l=>c(l),o.default);case"int":{let l=typeof a=="number"?a:Number(o.default),u=_e.volume,[m,f]=o.clamp??[u.min,u.max];return d`${Pe(r,l,v=>c(v,`slot:${t}:${i}`),{min:m,max:f,step:u.step,def:Number(o.default),format:v=>`${Math.round(v)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(v=>d`<button type="button" class="pe-chip ${v.value===l?"on":""}"
          aria-pressed=${v.value===l?"true":"false"} @click=${()=>c(v.value)}>${v.label} ${v.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return V(r,l,rr(e,s,i,l),u=>c(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=Ji(e.voice?.defaults),m=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${zt(s,i,u,f=>Zi(e.hass,f))}.`:"None picked.";return d`${or(e,r,l,(f,v)=>e.edit(b=>sr(b,n,t,i,f,v)))}
        <div class="hint ${l.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${l.length===0?m:`${l.length} picked.`}</div>`}}}function cr(e,n,t){let s=typeof t.id=="string"?t.id:"",i=ie(t),o=B($(t));return d`${e.voice?.defaults===void 0?d`<div class="hint">${Ti}.</div>`:h}
    ${o.map(r=>ar(e,n,s,i,r))}`}function dr(e,n,t){let s=typeof t.id=="string"?t.id:"",i=e.voice?.phrases;if(i===void 0)return d`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(i.length===0)return d`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=i.map(u=>u.id),r=qe(o,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],c=a.length>0&&o.some(u=>!a.some(m=>m.toUpperCase()===u.toUpperCase())),l=u=>r.some(m=>m.toUpperCase()===u.toUpperCase());return d`<div class="me-sub-h">${Ft("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${i.map(u=>H(u.name,l(u.id),m=>e.edit(f=>ir(f,n,s,o,u.id,m))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${i.length} show on the watch.`}</div>
    ${c?d`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:h}`}function Xi(e,n,t){let s=$(t);if(s==="ttsMenu")return dr(e,n,t);if(B(s).length>0)return cr(e,n,t)}function Qi(e,n){let t=$(n);if(t==="ttsMenu"){let r=e.voice?.phrases;return r===void 0?"":`${qe(r.map(c=>c.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let s=ie(n),i=B(t)[0];if(i===void 0)return"";let o=z(s,i);return Ue(s,i).find(([r])=>r===o)?.[1]??""}var io=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],oo="Each page's icon, color and name are set here: pick a page in the Pages card.",lr="Pick a page in the Pages card to set how it shows here.",ur={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},ro={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:oo},pr="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",hr="Click a slot or its label to edit it. Click anywhere else for the menu's look.",ae=.36,Gt=44,Yt=22;function ao(e,n){let t=Math.min(e.width,e.height),s=i=>Math.round(i*1e4)/1e4;return{x:s(.5+(n.x-.5)*t/e.width),y:s(.5+(n.y-.5)*t/e.height)}}function Fe(e,n,t=ae){let s=(270-e*360/Math.max(1,n))*Math.PI/180,i=o=>Math.round(o*1e4)/1e4;return{x:i(.5+t*Math.cos(s)),y:i(.5+t*Math.sin(s))}}var co="wrist-assistant-panel.menus.zoom.v1";function lo(e=tt()){try{let n=e?.getItem(co);if(n==null||n==="")return;let t=Number(n);return hs.includes(t)?t:void 0}catch{return}}function uo(e,n=tt()){try{n?.setItem(co,e===void 0?"":String(e))}catch{}}var po={name:{color:U.place,icon:"text"},slot:{color:U.content,icon:"content"},look:{color:U.look,icon:"look"},menu:{color:U.content,icon:"content"},style:{color:U.look,icon:"look"},switcherPage:{color:U.content,icon:"watch"}},mr="#26a69a",fr=U.complication,K="menu-editor";function be(e,n,t){return`${e} ${e===1?n:t}`}function re(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function ho(e,n){return{entityId:n,displayName:n===""?"":re(e,n),domain:Ie(n)}}function ye(e,n,t,s){return e.icons.render(n,t,s)??d`<span class="me-glyph-dot" style=${`background:${s}`}></span>`}function O(e){return X($(e))===void 0?{icon:vt.unknownActionIcon,color:vt.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function mo(e){let n=$(e);if(n==="triggerEntity"){let s=me(e).entityId;return qs(Ie(typeof s=="string"?s:""))}let t=X(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function M(e,n){return e.toUpperCase()===n.toUpperCase()}function gr(e,n){return e.toUpperCase()===n.toUpperCase()}function wr(e,n){let t=$(n),s=me(n),i=X(t);for(let o of i?.payload??[]){let r=s[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return re(e.hass,r);if(o.target==="page")return e.targets.pages.find(a=>M(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return e.targets.statusPages.find(a=>M(a.id,r))?.name??"A status page";if(o.target==="httpAction")return e.targets.httpActions.find(a=>M(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(c=>M(c.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function ce(e,n){return wr(e,n)??_($(n))}function br(e){return`${q(typeof e.position=="string"?e.position:"")} \xB7 ${_($(e))}`}function we(e){return Le(e)?.label??e}var fo="me:menu",go="me:er:mode",wo="me:er:domain",Jt="me:er:entity",Kt="me:er:add";function P(e){let n=e.uiState.get(fo);return n==="entity"||n==="switcher"?n:"anywhere"}function yr(e,n){n!==P(e)&&e.uiState.delete(je),e.uiState.set(fo,n),e.requestUpdate()}var je="me:sw:page";function bo(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function J(e){if(P(e)!=="switcher")return;let n=e.uiState.get(je);if(typeof n=="string")return bo(e).find(t=>M(t.id,n))}function Zt(e,n){n===void 0?e.uiState.delete(je):e.uiState.set(je,n),e.requestUpdate()}function yo(e){let n=J(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function Xt(e){return io.find(([n])=>n===e)?.[1]??e}function vo(e){return e.uiState.get(go)==="entity"?"entity":"domain"}function xo(e){let n=e.uiState.get(wo);return typeof n=="string"&&Le(n)!==void 0?n:"light"}function So(e){let n=fe(e.document),t=e.uiState.get(Jt);return typeof t=="string"&&n.includes(t)?t:n[0]}function A(e){switch(P(e)){case"anywhere":return Oe;case"entity":return Qt(e);case"switcher":return}}function Qt(e){if(vo(e)==="domain")return{list:"domain",domain:xo(e)};let n=So(e);return n===void 0?void 0:{list:"entity",entityId:n}}function $o(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${we(n.domain)} menu`:`${re(e.hass,n.entityId)} menu`}function ko(e){return`me:sel:${zs(e)}`}function Q(e,n){let t=e.uiState.get(ko(n));if(typeof t=="string")return I(e.document,n).find(s=>M(T(s),t))}function de(e,n,t){e.uiState.set(ko(n),t),e.requestUpdate()}function ve(e){if(J(e)!==void 0)return Zt(e,void 0),!0;let n=A(e);return n===void 0||Q(e,n)===void 0?!1:(de(e,n,void 0),!0)}function Be(e,n,t){let s;e.edit(i=>{let o=Zs(i,n,{...t===void 0?{}:{position:t},targets:e.targets});return s=o.id,o.document}),s!==void 0&&de(e,n,s)}function eo(e){let t=(s,i)=>Math.round((i+(s-.5)/ae*8)*100)/100;return d`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${Gt} ${Yt}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(s=>R`<circle cx=${t(s.x,22)} cy=${t(s.y,11)} r="2.2" fill=${s.color}></circle>`)}
  </svg></span>`}function vr(e,n){return n===void 0?[]:I(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let s=We(typeof t.position=="string"?t.position:"");return s===void 0?[]:[{...s,color:O(t).color}]})}function xr(e,n){if(n==="switcher")return be(e.switcherPages.length,"page","pages");let t=n==="anywhere"?Oe:Qt(e);return t===void 0?"none yet":be(I(e.document,t).length,"slot","slots")}function Sr(e,n){if(n==="switcher"){let t=e.switcherPages;return eo(t.map((s,i)=>({...Fe(i,t.length),color:s.color})))}return eo(vr(e,n==="anywhere"?Oe:Qt(e)))}function Mo(e){let n=P(e);return d`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Gt}px; --thumb-h: ${Yt}px`}>
    <div class="lc-head">
      <span class="swatch">${k("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${pr}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${io.map(([t,s])=>{let i=t===n,o=()=>{i||yr(e,t)};return d`<div class="layer me-menu-row ${i?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${i?"true":"false"} aria-label=${s} title=${ro[t]}
          @click=${o}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${Sr(e,t)}
          <span class="name"><b><span class="nm-t">${s}</span><span class="me-menu-count">${xr(e,t)}</span></b><small>${ur[t]}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function $r(e,n,t){return d`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${ye(e,n,14,t)}</span></span>`}function to(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${we(n.domain)} menu, by type`:`${re(e.hass,n.entityId)}'s own menu`}function kr(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function Mr(e,n,t){let s=t!==void 0&&M(t.id,n.id),i=kr(n),o=()=>Zt(e,n.id);return d`<div class="layer me-page-row ${s?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${s?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${i}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${$r(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${i}</small></span>
    <span class="right"><span class="badges">${n.hidden?d`<span class="badge">hidden</span>`:h}</span></span>
  </div>`}function Tr(e){let n=bo(e),t=J(e),s=n.filter(i=>i.hidden).length;return d`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Gt}px; --thumb-h: ${Yt}px`}>
    <div class="lc-head">
      <span class="swatch">${k("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${be(n.length,"page","pages")}${s===0?"":`, ${s} hidden`}</span>
    </div>
    ${n.length===0?d`<div class="lc-note">No page shows in the switcher.</div>`:d`<div class="layers me-page-list" role="list">${n.map(i=>Mr(e,i,t))}</div>`}
  </section>`}function To(e){return P(e)==="switcher"?Tr(e):h}function Po(e){if(P(e)==="switcher")return[be(e.switcherPages.length,"page","pages")];let n=A(e);if(n===void 0)return[to(e,n)];let t=be(I(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[to(e,n),t]}function Ro(e){return P(e)==="switcher"?oo:A(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":hr}function Co(e,n){return gs(e.uiState,K,n)}function Pr(e,n){ws(e.uiState,K,n,!Co(e,n)),e.requestUpdate()}function Rr(e){if(yo(e)!==void 0)return[{module:K,section:"switcher-page"}];let n=A(e),t=n===void 0?void 0:Q(e,n);if(t!==void 0)return[{module:K,section:"slot"},...Yi(t)?[{module:K,section:"voice"}]:[],{module:K,section:"look"}];let s=P(e);return[{module:K,section:s==="entity"?"menu":`style-${s}`}]}function oe(e,n,t,s,i,o={}){let r=Co(e,t),a=po[n];return Pn({color:a.color,icon:k(a.icon),title:s,open:r,onToggle:()=>Pr(e,t),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${K}:${t}`},r?i:d``)}function Ho(e){let n=P(e),t=Xt(n),s=A(e),i=s===void 0?void 0:Q(e,s),o=Rr(e),r=bs(e.uiState,o),a=J(e),c=yo(e),l,u;if(a!==void 0&&c!==void 0)l=d`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>Zt(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${fr}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=Cr(e,c);else if(i===void 0||s===void 0)l=d`<div class="crumbs"><span class="kchip" style=${`--k:${mr}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=zr(e,n);else{let m=ce(e,i);l=d`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>de(e,s,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${O(i).color}`}>Slot</span><span class="nm" title=${m}>${m}</span></div>`,u=Ur(e,s,i)}return d`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{ys(e.uiState,o,!r),e.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function Cr(e,n){let t=n.page;return oe(e,"switcherPage","switcher-page",Ut,d`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${Ut}>${qi(n)}</fieldset>`,{summary:Ui(t),dot:Ni(t)})}var Hr={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function Eo(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Hr[n.key]??n.key}function Er(e,n,t){let s=T(t),i=$(t),o=Gs(n),r=new Set(o.flatMap(l=>l.actions)),a=l=>{let u=X(l),m=l===i?void 0:Ns(l,e.targets),f=`${u?.label??_(l)}${u?.requiresPremium?" (Pro)":""}${m===void 0?"":` (${m})`}`;return d`<option value=${l} ?selected=${l===i} ?disabled=${m!==void 0}>${f}</option>`},c=l=>e.edit(u=>ii(u,n,s,l,e.targets));return d`<label class="field"><span>Action</span>
    <select .value=${st(i)} @change=${l=>c(l.target.value)}>
      ${r.has(i)?h:d`<optgroup label="Now"><option value=${i} selected>${_(i)}</option></optgroup>`}
      ${o.map(l=>d`<optgroup label=${_s(l.category)}>${l.actions.map(a)}</optgroup>`)}
    </select></label>`}function Ir(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function no(){return d`<button type="button" class="link" @click=${Vi}>Open HTTP actions</button>`}function Lr(e,n,t){let s=n.find(i=>M(i.id,t));return s?.source==="home"&&s.needsSetup===!0?d`<div class="hint warn ts-under">Needs setup. ${no()}</div>`:e.httpLibrary!==void 0&&n.length===0?d`<div class="hint ts-under">${Ms} ${no()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?d`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:h}function Or(e,n,t,s,i){let o=T(t),r=me(t)[i.key],a=typeof r=="string"?r:"",c=i.target==="page"?e.targets.pages:i.target==="statusPage"?e.targets.statusPages:i.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||c.some(p=>M(p.id,a)),u=p=>e.edit(x=>Pt(x,n,o,i.key,p===""?void 0:p)),m=i.target==="statusPage"&&e.statusPagesKnown===!0,f=i.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,v=i.target==="page"?"A page that is gone":i.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":m?"Not in this watch's status pages":f?ks:xs,b=p=>i.target==="httpAction"?Ir(p):p.name;return d`<label class="field"><span>${Eo(s,i)}</span>
    <select .value=${st(c.find(p=>M(p.id,a))?.id??a)} @change=${p=>u(p.target.value)}>
      ${i.required===!0?h:d`<option value="" ?selected=${a===""}>None</option>`}
      ${l?h:d`<option value=${a} selected>${v}</option>`}
      ${c.map(p=>d`<option value=${p.id} ?selected=${M(p.id,a)}>${b(p)}</option>`)}
    </select></label>
    ${i.target==="ttsPhrase"?e.voice?.phrases===void 0?d`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:h:i.target==="statusPage"?m||e.catalogKnown?h:d`<div class="hint ts-under">No status pages from this watch yet. Add them in Status pages.</div>`:i.target==="httpAction"?Lr(e,e.targets.httpActions,a):h}`}function Ar(e,n,t,s,i){let o=T(t),r=me(t),a=(u,m)=>e.edit(f=>Pt(f,n,o,i.key,u),m),c=Eo(s,i),l=Rt(t,i);switch(i.type){case"entity":{let u=typeof r[i.key]=="string"?r[i.key]:"",m=s==="runScene"?"scene":s==="runScript"?"script":js();return d`<div class="ts-stack">${rt({hass:e.hass},c,ho(e.hass,u),f=>a(f.entityId),`me:entity:${o}`,{domain:m,clearable:!1,needed:u===""})}</div>
        ${u===""?d`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:h}`}case"uuid":return Or(e,n,t,s,i);case"enum":{if(i.key==="triggerMode"){let f=Ie(typeof r.entityId=="string"?r.entityId:""),v=Us(f),b=typeof l=="string"?l:v[0]??"",p=v.map(x=>[x,$t(x)]);return v.includes(b)||p.unshift([b,$t(b)]),V(c,b,p,x=>a(x),{snapBack:!0})}let u=It(i.enum),m=typeof l=="string"?l:String(i.default??"");return u.length<=4?Y(c,m,u,f=>a(f)):V(c,m,u,f=>a(f),{snapBack:!0})}case"bool":return H(c,l===!0,u=>a(u),i.default);case"number":{if(i.key==="bannerSeconds"&&Rt(t,{key:"showBanner",type:"bool",default:!0})===!1)return h;let u=typeof r[i.key]=="number"?r[i.key]:void 0;return Yn(c,u,m=>a(m,`slot:${o}:${i.key}`),{...i.min===void 0?{}:{min:i.min},...i.max===void 0?{}:{max:i.max},step:1,optional:!0,placeholder:typeof i.absentMeans=="number"?String(i.absentMeans):"",unit:"s",def:null})}}}function Dr(e,n,t){if(!Mt(n,t))return h;let s=T(t);return d`<div class="ts-stack">${Y("Skip conditions",yi(Tt(t)),bi,i=>e.edit(o=>ti(o,n,s,vi(i))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Wr(e,n){let t=T(n),s=Ht(n),i=s===void 0,o=l=>e.edit(u=>ri(u,t,l)),r=oi(),a=(s??[]).filter(l=>!Ct(l)),c=i?"Every screen":s.length===0?"No entity under the finger":s.map(we).join(", ");return d`<details class="me-show-for">
    <summary><span>Show for</span><b>${c}</b></summary>
    ${H("Every screen",i,l=>o(l?void 0:r.slice(0,1)),!0)}
    ${i?h:d`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(l=>{let u=s.includes(l),m=!Ct(l);return d`<button type="button" class="pe-chip ${u?"on":""} ${m?"odd":""}" aria-pressed=${u?"true":"false"}
          title=${m?"Not reported by the watch":h}
          @click=${()=>o(u?s.filter(f=>f!==l):[...s,l])}>${we(l)}</button>`})}
    </div>
    ${a.length===0?h:d`<div class="hint warn">${a.map(we).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}
  </details>`}function Vr(e,n){return e.isVisible===!1||n.list==="anywhere"&&Ht(e)!==void 0||Mt(n,e)&&Tt(e)!==null}function _r(e){let n=mo(e);if(n===void 0)return!1;let t=O(e);return t.icon!==n.icon||!gr(t.color,n.color)}function Nr(e,n){let t=po.name,s=X($(n));return d`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${k(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${ce(e,n)}</span>
      ${s?.requiresPremium?d`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:h}
    </div>
  </section>`}function Ur(e,n,t){let s=T(t),i=$(t),o=X(i),r=O(t),a=mo(t),c=typeof t.position=="string"?t.position:"",l=I(e.document,n).filter(b=>!M(T(b),s)),u=De().map(b=>{let p=q(b);return l.some(x=>x.position===b)?[b,b===c?`${p} (shared)`:`${p} (swap)`]:[b,p]}),m=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Slot">
    ${o===void 0?d`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:h}
    ${V("Place",c,u,b=>e.edit(p=>Qs(p,n,s,b)),{snapBack:!0})}
    ${H("Shown",t.isVisible!==!1,b=>e.edit(p=>ei(p,n,s,b)),!0)}
    ${Er(e,n,t)}
    ${o?.description?d`<div class="hint ts-under">${o.description}</div>`:h}
    ${Ys(i)?d`<div class="hint ts-under keep">Only for a watch with more than one Home Assistant.</div>`:h}
    ${(o?.payload??[]).map(b=>Ar(e,n,t,i,b))}
    ${Dr(e,n,t)}
    ${n.list==="anywhere"?Wr(e,t):h}
  </fieldset>`,f=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Look">
    <div class="ts-stack">${Re({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",b=>e.edit(p=>ni(p,n,s,b),`slot:${s}:icon`),`me:icon:${s}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${pe("Color",typeof t.color=="string"?t.color:void 0,b=>{b!==void 0&&e.edit(p=>si(p,n,s,b),`slot:${s}:color`)},!1,a?.color)}</div>
  </fieldset>`,v=Xi(e,n,t);return d`${Nr(e,t)}
    ${oe(e,"slot","slot","Slot",m,{summary:br(t),dot:Vr(t,n)})}
    ${v===void 0?h:oe(e,"slot","voice","Voice",d`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${v}</fieldset>`,{summary:Qi(e,t),dot:Gi(t)})}
    ${oe(e,"look","look","Look",f,{summary:r.icon,dot:_r(t)})}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(b=>Xs(b,n,s))}>${k("delete")}<span>Remove</span></button>
    </div>`}function qr(e,n,t){if(!Et(e.document,n,t))return h;let s=ge(e.document,n,t),i=`style:${n}:${t.key}`,o=(r,a=!1)=>e.edit(c=>li(c,n,t.key,r),a?i:void 0);switch(t.type){case"bool":return H(t.label,s===!0,r=>o(r),t.default);case"enum":{let r=It(t.enum),a=String(s);return r.length<=4?Y(t.label,a,r,c=>o(c),{def:String(t.default)}):V(t.label,a,r,c=>o(c),{def:String(t.default),snapBack:!0})}case"number":{let r=typeof s=="number"?s:Number(t.default);return d`${Pe(t.label,r,a=>o(a,!0),{min:t.min??0,max:t.max??1,step:t.step??.01,def:Number(t.default)})}
      ${t.presets===void 0?h:d`<div class="ts-after">${t.presets.map(a=>d`<button type="button"
        class="pe-chip ${a.value===r?"on":""}" aria-pressed=${a.value===r?"true":"false"} @click=${()=>o(a.value)}>${a.label}</button>`)}</div>`}`}case"color":{let r=typeof s=="string"?s:String(t.default);return d`<div class="ts-no-alpha">${pe(t.label,r,a=>{a!==void 0&&o(a,!0)},!1,String(t.default))}</div>
        ${t.swatches===void 0?h:d`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label=${t.label}>
          ${t.swatches.map(a=>{let c=a.toUpperCase()===r.toUpperCase();return d`<button type="button" class="ts-swatch ${c?"on":""}" aria-pressed=${c?"true":"false"} title=${a} aria-label=${a}
              style=${`--sw:${a}`} @click=${()=>o(a)}></button>`})}</div></div>`}`}}}function jr(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function Fr(e,n){return te(n).some(t=>Et(e,n,t)&&!jr(ge(e,n,t),t.default))}function so(e,n,t){let s=Fr(e.document,n);return oe(e,"style",t,"Style",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Style">
    ${te(n).map(i=>qr(e,n,i))}
  </fieldset>`,{summary:s?"Changed":"Defaults",dot:s})}function Br(e){let n=vo(e),t=a=>{e.uiState.set(go,a),e.requestUpdate()},s=Y("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),i,o,r=!1;if(n==="domain"){let a=xo(e),c=Le(a),l=Bs(a),u=Fs().map(f=>[f.domain,f.label]),m=c?.inheritKey?Ks(e.document,a):!1;r=m,o=`By type \xB7 ${c?.label??a}`,i=d`${V("Type",a,u,f=>{e.uiState.set(wo,f),e.requestUpdate()})}
      ${l.length>0?d`<div class="hint ts-under keep">The same menu as ${l.map(f=>f.label).join(", ")}.</div>`:h}
      ${c?.inheritKey?d`${H("Add the All slots",m,f=>e.edit(v=>ai(v,a,f)),!1)}
        <div class="hint ts-under">The All menu's slots fill the places this menu leaves free.</div>`:h}`}else{let a=fe(e.document),c=So(e);o=`By entity \xB7 ${c===void 0?"none yet":re(e.hass,c)}`;let l=u=>{let m=u.entityId.trim();m!==""&&(e.edit(f=>ci(f,m)),e.uiState.set(Jt,m),e.uiState.set(Kt,(Number(e.uiState.get(Kt)??0)||0)+1),e.requestUpdate())};i=d`<div class="me-entities">
      ${a.length===0?d`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:h}
      ${a.map(u=>{let m=u===c;return d`<div class="me-entity ${m?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${m?"true":"false"}
            @click=${()=>{e.uiState.set(Jt,u),e.requestUpdate()}}>
            <b>${re(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(f=>di(f,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${rt({hass:e.hass},"Add an entity",ho(e.hass,""),l,`me:er:add:${String(e.uiState.get(Kt)??0)}`,{clearable:!1})}
      </div>
    </div>`}return oe(e,"menu","menu","Menu",d`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Menu">
    ${s}${i}
  </fieldset>`,{summary:o,dot:r})}function zr(e,n){let t=n==="anywhere"?so(e,"quickAction","style-anywhere"):n==="switcher"?so(e,"pageSwitcher","style-switcher"):Br(e);return d`<p class="me-menu-note">${ro[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?lr:"Select a slot to edit it, or add one."}</p>`}var Io=ee`
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
`;var Kr=["spring","popIn","fade","none"],Jr=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function xe(e,n,t){let s=te(n).find(i=>i.key===t);return s===void 0?void 0:ge(e,n,s)}function Se(e,n,t,s){let i=te(n).find(a=>a.key===t),o=xe(e,n,t),r=typeof o=="number"&&Number.isFinite(o)?o:typeof i?.default=="number"?i.default:s;return Math.min(i?.max??1/0,Math.max(i?.min??-1/0,r))}function ze(e,n){return xe(e,"quickAction",n)===!0}function Gr(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function Je(e){let n=xe(e,"quickAction","entranceStyle"),t=xe(e,"quickAction","beamStyle");return{glass:ze(e,"showIconBubble"),neon:ze(e,"showNeonOutline"),labels:ze(e,"showContextLabel"),finger:ze(e,"showFingerShadow"),entrance:Kr.includes(n)?n:"none",dim:Se(e,"quickAction","backgroundDim",1),beam:Jr.includes(t)?t:"none",beamColor:Gr(xe(e,"quickAction","beamColor")),beamIntensity:Se(e,"quickAction","beamIntensity",.5),glow:Se(e,"quickAction","glowIntensity",.5)}}function Yr(e){return{glow:Se(e,"pageSwitcher","glowIntensity",.5),scale:Se(e,"pageSwitcher","selectedScale",1.2)}}var en="ms:play",Zr=1500;function Xr(e){let n=e.uiState.get(en);e.uiState.set(en,{menu:P(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function Qr(e){let n=e.uiState.get(en);return n===void 0||n.menu!==P(e)||Date.now()-n.at>Zr?"":n.count%2===1?"ms-play-a":"ms-play-b"}function Oo(e,n){let t=I(e,n),s=Js(e,n),i=new Set(kt(e,n));return De().map(o=>{let r=t.filter(u=>u.position===o),a=r.find(u=>u.isVisible!==!1),c=a===void 0?s.find(u=>u.position===o&&u.isVisible!==!1):void 0,l=a??(c===void 0?r[0]:void 0);return{position:o,own:r,main:l,second:r.find(u=>u!==l),shared:c,free:i.has(o)}})}function ea(e,n){let t=i=>i!==void 0&&i.isVisible!==!1;if(n!==void 0&&t(n)){let i=T(n),o=e.find(r=>r.main!==void 0&&M(T(r.main),i));if(o!==void 0)return{position:o.position,slot:n}}let s=e.flatMap(i=>{let o=t(i.main)?i.main:i.shared;return o===void 0?[]:[{position:i.position,slot:o}]});return s.find(i=>i.position==="topCenter")??s[0]}var g=e=>Math.round(e*100)/100;function Ge(e,n){let t=ao(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function Ke(e,n,t,s){let{width:i,height:o}=e.screen,r=e.scale,a=Ge(e.screen,t),c=[`left:${a.x*100}%`,`top:${a.y*100}%`];if(s!==void 0&&c.push(`--c:${s}`),c.push(`--fx:${g((i/2-a.px)*r)}px`,`--fy:${g((o/2-a.py)*r)}px`),n.finger){let l=a.px-i/2,u=a.py-o/2,m=Math.hypot(l,u);m>1&&c.push(`--sx:${g(l/m*5*r)}px`,`--sy:${g(u/m*5*r)}px`)}return c.join(";")}function tn(e,n){return Math.round(n*e.scale)}function Ao(e,n,t,s,i){let o=Ge(e.screen,t),r=(n.glass?28:25)*(o.y>.5?-1:1),a=(o.py+r)/e.screen.height;return d`<span class="ms-name" aria-hidden="true" style=${`left:${o.x*100}%;top:${g(a*1e4)/100}%;--c:${s}`}>${i}</span>`}function ta(e){let{width:n,height:t}=e,s=n*.08,i=n*.045,o=t*.18,r=(n-s*2-i)/2,a=(t-o-s-i*2)/3,c=[0,1,2,3,4,5].map(l=>{let u=s+l%2*(r+i),m=o+Math.floor(l/2)*(a+i);return R`<rect class=${`ms-tile t${l%4}`} x=${g(u)} y=${g(m)} width=${g(r)} height=${g(a)} rx=${g(n*.06)}></rect>`});return d`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${g(s)} y=${g(t*.075)} width=${g(n*.4)} height=${g(t*.045)} rx=${g(t*.0225)}></rect>
    ${c}
  </svg>`}function G(e,n,t){return R`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function Lo(e,n,t,s){return R`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${g(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${g(s)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function na(e,n,t){if(e.beam==="none")return h;let s=e.beamColor,i=e.beamIntensity,o=n.width/2,r=n.height/2,a=t.x-o,c=t.y-r,l=Math.hypot(a,c),u=Math.atan2(c,a),m=(p,x)=>`${g(o+Math.cos(u+p)*x)},${g(r+Math.sin(u+p)*x)}`,f=g(t.x),v=g(t.y),b;switch(e.beam){case"sectorWedge":{let p=Math.PI/4;b=R`${G("ms-b8",8,n)}${G("ms-b3",3,n)}
        <polygon points=${`${o},${r} ${m(-p/2,l*1.2)} ${m(p/2,l*1.2)}`} fill=${s} fill-opacity=${g(.2*i)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${o},${r} ${m(-p*.3,l)} ${m(p*.3,l)}`} fill=${s} fill-opacity=${g(.5*i)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":b=R`${G("ms-b7",7,n)}${G("ms-b10",10,n)}${Lo("ms-wash",s,.35*i,.18*i)}
        <circle cx=${g((o+t.x)/2)} cy=${g((r+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${f} cy=${v} r="40" fill=${s} fill-opacity=${g(.25*i)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":b=R`${G("ms-b4",4,n)}${G("ms-b5",5,n)}${Lo("ms-bloom",s,.4*i,.15*i)}
        <circle cx=${f} cy=${v} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${f} cy=${v} r="25" fill=${s} fill-opacity=${g(.3*i)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":b=R`${G("ms-b6",6,n)}
        <circle cx=${f} cy=${v} r="30" fill=${s} fill-opacity=${g(.15*i)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(p=>R`<circle cx=${f} cy=${v} r=${g((30+p*100)/2)} fill="none" stroke=${s}
          stroke-opacity=${g((1-p)*.45*i)} stroke-width=${g(2-p*1.2)}></circle>`)}`;break;case"wakeWave":b=R`${G("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${o} y1=${r} x2=${f} y2=${v}>
          <stop offset="0" stop-color=${s} stop-opacity="0"></stop><stop offset="1" stop-color=${s} stop-opacity=${g(.5*i)}></stop></linearGradient>
        <line x1=${o} y1=${r} x2=${f} y2=${v} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(p=>{let x=1-p;return R`<circle cx=${g(o+a*p)} cy=${g(r+c*p)} r=${g((20+x*50)/2)} fill="none" stroke=${s}
            stroke-opacity=${g((1-x)*.5*i)} stroke-width=${g(Math.max(1.5-x*1.2,.3))}></circle>`})}
        <circle cx=${f} cy=${v} r="18" fill=${s} fill-opacity=${g(.25*i)} filter="url(#ms-b4)"></circle>`;break}return R`<g class="ms-beam">${b}</g>`}function sa(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":Qr(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(i=>i!=="").join(" "),s=[`--ms-veil:${g(n.dim*.85)}`,`--ms-blur:${g(2+n.dim*4)}px`,`--ms-g-r:${g(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:s}}function nn(e,n,t,s,i={}){let{width:o,height:r}=e.screen,a=e.scale,c=Math.min(o,r),l=sa(e,t),u=[`width:${Math.round(o*a)}px;height:${Math.round(r*a)}px;--me-s:${a}`,l.style,i.style??""].filter(f=>f!=="").join(";"),m=d`<div class=${`me-screen ms-screen ${l.classes} ${i.classes??""}`.trim()} role="group" aria-label=${n} style=${u}>
    <div class="ms-backdrop" aria-hidden="true">${ta(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${o} ${r}`} aria-hidden="true">
      ${i.beamTo===void 0?h:na(t,e.screen,i.beamTo)}
      <circle cx=${o/2} cy=${r/2} r=${c*ae} class="me-track"></circle>
      ${t.finger?R`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${o/2} cy=${r/2} r=${g(c*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:h}
      <circle cx=${o/2} cy=${r/2} r=${c*.05} class="me-center"></circle>
    </svg>
    ${s}
  </div>`;return ms({width:o,height:r},a,m,n)}function ia(e,n,t,s){let i=Je(e.document),o=Oo(e.document,n),r=ea(o,t),a=r===void 0?void 0:T(r.slot),c=t===void 0?void 0:T(t),l=(p,x=ae)=>We(p,x),u=p=>a!==void 0&&M(T(p),a),m=(p,x,N,D,le)=>{let ue=O(p),$e=T(p),W=c!==void 0&&M($e,c),ke=p.isVisible===!1,un=`${q(x)}: ${_($(p))}${ke?", hidden":""}`,zo=["me-dot",D,W?"on":"",ke?"off":"",u(p)&&D===""?"ms-active":""].filter(Ko=>Ko!=="").join(" ");return d`<button type="button" class=${zo} style=${Ke(e,i,N,ue.color)}
      title=${un} aria-label=${un} aria-pressed=${W?"true":"false"} @click=${()=>de(e,n,$e)}>
      ${ye(e,ue.icon,tn(e,D===""?15:11),ue.color)}${le>1?d`<span class="me-count" aria-hidden="true">${le}</span>`:h}</button>`},f=o.map(p=>{let x=l(p.position);if(x===void 0)return h;let N=h,D;if(p.main!==void 0)N=m(p.main,p.position,x,"",p.own.length),p.main.isVisible!==!1&&(D=p.main);else if(p.shared!==void 0){let W=O(p.shared),ke=`${q(p.position)}: ${_($(p.shared))}, from All`;N=d`<span class=${`me-dot inh${u(p.shared)?" ms-active":""}`} style=${Ke(e,i,x,W.color)} title=${ke}>
        ${ye(e,W.icon,tn(e,13),W.color)}</span>`,D=p.shared}else if(p.free){let W=q(p.position);N=d`<button type="button" class="me-dot free" style=${Ke(e,i,x)} ?disabled=${e.busy}
        title=${`Add a slot at ${W}`} aria-label=${`Add a slot at ${W}`}
        @click=${()=>Be(e,n,p.position)}>${k("plus")}</button>`}let le=p.second===void 0?void 0:l(p.position,.2),ue=p.second===void 0||le===void 0?h:m(p.second,p.position,le,"two",0),$e=i.labels&&D!==void 0?Ao(e,i,x,O(D).color,ce(e,D)):h;return d`${N}${ue}${$e}`}),v=r===void 0?void 0:l(r.position),b=Ge(e.screen,v??{x:.5,y:.5-ae});return nn(e,`${s} on the watch`,i,f,{beamTo:{x:b.px,y:b.py}})}function oa(e){let n=Je(e.document),t=Yr(e.document),s=e.switcherPages,i=J(e),o=Math.max(0,i===void 0?0:s.findIndex(c=>M(c.id,i.id))),r=s.length===0?d`<p class="me-screen-note">No pages in the switcher yet.</p>`:s.map((c,l)=>{let u=Fe(l,s.length),m=l===o,f=`--ms-pr:${m?22:14}px;--ms-pa:${Math.round((m?.7:.15)*t.glow*100)}%`,v=`${Ke(e,n,u,c.color)};${f}`,p=[i!==void 0&&M(i.id,c.id)?"on":"",m?"ms-active":""].filter(N=>N!=="").join(" "),x=n.labels&&c.text===void 0?Ao(e,n,u,c.color,c.name):h;return c.text===void 0?d`<span class=${`me-dot me-page-dot${p===""?"":` ${p}`}`} style=${v} title=${c.name}>${ye(e,c.icon,tn(e,14),c.color)}</span>${x}`:d`<span class=${`me-page${p===""?"":` ${p}`}`} style=${v} title=${c.name}>${c.text}</span>`}),a=s.length===0?void 0:Ge(e.screen,Fe(o,s.length));return nn(e,"Page switcher on the watch",n,r,{beamTo:a===void 0?void 0:{x:a.px,y:a.py},classes:"ms-switcher",style:`--ms-k-on:${t.scale}`})}function ra(e){if(P(e)==="switcher")return oa(e);let n=A(e);return n===void 0?nn(e,"Entity quick menu on the watch",Je(e.document),d`<p class="me-screen-note">Add an entity to edit its menu.</p>`):ia(e,n,Q(e,n),$o(e,n))}var aa={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function ca(e,n,t,s){let i=T(t),o=s!==void 0&&M(i,T(s)),r=t.isVisible===!1,a=ce(e,t),c=`${_($(t))}${r?", hidden":""}`;return d`<button type="button" class=${`ms-label${o?" on":""}${r?" off":""}`} data-slot=${i}
    style=${`--k:${O(t).color}`} aria-pressed=${o?"true":"false"}
    @click=${()=>de(e,n,i)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${c}</small></span></button>`}function da(e,n,t,s){let i=q(t.position),o=t.own.map(r=>ca(e,n,r,s));return t.shared!==void 0&&o.push(d`<span class="ms-label ms-inh" style=${`--k:${O(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${ce(e,t.shared)}</b><small>From the All menu</small></span></span>`),o.length===0&&t.free&&o.push(d`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${i}`}
      @click=${()=>Be(e,n,t.position)}>${k("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),d`<div class=${`ms-place ms-at-${t.position} ms-${aa[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${i}>${o}</div>`}function Do(e){let n=ra(e),t=P(e)==="switcher"?void 0:A(e);if(t===void 0)return d`<div class="me-stage-body">${n}</div>`;let s=Q(e,t);return d`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${Oo(e.document,t).map(i=>da(e,t,i,s))}
  </div></div>`}var la=d`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function Wo(e){let n=P(e),t=Je(e.document),s=h;if(n!=="switcher"){let o=A(e),r=o===void 0?[]:kt(e.document,o),a=o===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";s=d`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||o===void 0||r.length===0}
      title=${a} @click=${()=>{o!==void 0&&Be(e,o)}}>${k("plus")}<span class="word keep">Add</span></button>`}let i=t.entrance==="none"?h:d`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>Xr(e)}>${la}<span class="word">Play opening</span></button>`;return s===h&&i===h?d``:d`${s}${i}<span class="tb-sep" aria-hidden="true"></span>`}function Vo(e){if(P(e)!=="entity")return h;let n=A(e);return n===void 0||Q(e,n)===void 0?h:d`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>ve(e)}>Change the type or entity</button></span>`}var _o=ee`
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
`;function sn(e){if(e.length===0)return"";let n=e.map(s=>pi(s));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function No(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${sn(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function Fo(){return gi()||As()}Wi({dirty:Fo,drop:()=>{wi(),Ds()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Fo()&&(e.preventDefault(),e.returnValue="")});var ua=15e3,Bo=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),on=Bo?"\u2318":"Ctrl+",rn={min:200,max:720,middleMin:320},an={left:280,right:320},cn="wrist-assistant-panel.menus.columns.v1",pa="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",ha=24,Uo=820;function dn(e){return Te(e).message}function Ye(e){return Te(e).code}function Ze(e){let{code:n,message:t}=Te(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function ma(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function fa(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":yn(Math.max(0,(Date.now()-n)/1e3))}function ga(e){return e==="panel"?"Saved here":"From the watch"}function wa(e){return e instanceof HTMLElement?as(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function ba(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function ya(e){return Z(e)?dt(e).filter(n=>!ut(n)&&Vs(Ce(n))).map(n=>({id:Ce(n),name:lt(n)})):[]}var qo=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Xe(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var va="#8E8E93";function ln(e){if(!Z(e))return[];let n=0;return dt(e).filter(t=>!us(t)&&!ut(t)).map(t=>{let s=t.hideFromSwitcher===!0,i=lt(t),o=Xe(t.switcherIcon)??Xe(ls(t)[0]?.icon)??(ps(t)?"bolt.fill":"square.grid.2x2.fill"),r=s?va:qo[n++%qo.length],a=Xe(t.switcherColor)??r,c=t.switcherDisplayMode==="icon"?void 0:Xe(t.switcherText)??i;return{id:Ce(t),name:i,icon:o,color:a,...c===void 0?{}:{text:c},hidden:s}})}function Kc(e){return ln(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var jo={ok:0,warn:1,err:2};function xa(e,n){return e===void 0?n:n===void 0?e:{kind:jo[n.kind]>jo[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function Sa(e){let n=Ee(e)??{},t=I(n,{list:"anywhere"}).length,s=fe(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(t)}. ${s===0?"No entity has its own menu.":`${s} ${s===1?"entity has":"entities have"} its own menu.`}`}var w=class extends pn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=h;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new An(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=lo();this.columns={...an};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Qn(this);this.symbols=new qn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t))};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let s=t.composedPath();if(!s.includes(this)&&!this.headBar.holds(s)&&!ba()||this.renderRoot.querySelector("dialog[open]"))return;let i=t.metaKey||t.ctrlKey,o=t.key.toLowerCase();if(i&&!t.altKey&&o==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!wa(s[0])){if(i&&!t.altKey&&o==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&o==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!i&&!t.altKey){let r=this.viewHost();r!==void 0&&ve(r)&&t.preventDefault()}}};this.onStageClick=t=>{let s=t.composedPath(),i=s.indexOf(t.currentTarget);if((i<0?s:s.slice(0,i)).some(a=>typeof a.matches=="function"&&a.matches(pa)))return;let r=this.viewHost();r!==void 0&&ve(r)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let s=t.composedPath(),i=o=>s.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(Kn,this.onScrubStart),this.addEventListener(Jn,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return Hn(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let t=this.watchId,s=this.record;if(!(t===void 0||s===void 0)){if(s.revision>0){let i=j(t);if(i!==void 0)return i;let o=Ee(s.document);return o===void 0?void 0:Ot(t,o,s.revision).draft}if(!(this.unsupported||!this.opensReady()))return j(t)??At(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return yt(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return ya(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(j(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return J({uiState:this.uiState,switcherPages:[],switcherRows:ln(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Nn(cn,an,rn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,hn(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let i=On(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let s=this.restoreAsk;s!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===s.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),ss(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let s of t){if(s.target!==this){this.measureTop(s.target);continue}let i=s.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let s=this.renderRoot?.querySelector(".pe-top")??void 0;s!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=s,s!==void 0&&t.observe(s))}measureTop(t){let s=t.offsetHeight;s!==this.topHeight&&(this.topHeight=s,this.style.setProperty("--pe-top-h",`${s}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let s=this.pagesDraft?.saveDone;if(s!==void 0&&s!==this.followedPagesSave){this.followedPagesSave=s;let r=()=>this.pagesSaveEnded(t);s.then(r,r)}let i=j(t)?.saveDone;if(i===void 0||i===this.followedSave)return;this.followedSave=i;let o=()=>this.saveEnded(t);i.then(o,o)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,s=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),s=!1),this.startSubscription(t),this.load(t,s),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let s=this.hass;if(!s)return;let i=++this.voiceSeq;try{let o=await E(s,t,"voice");if(i!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=ki(o)}catch{if(i!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Wt(t),defaults:Mi(t,this.catalog)}}async loadCatalog(t){let s=this.hass;if(!s)return;let i=++this.catalogSeq;try{let o=await E(s,t,"catalog");if(i!==this.catalogSeq||t!==this.watchId)return;this.catalog=Ss(o)}catch(o){if(i!==this.catalogSeq||t!==this.watchId)return;wt(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let s=++this.httpLibrarySeq;try{let i=await bn(t);if(s!==this.httpLibrarySeq)return;this.httpLibrary=Fn(i)}catch(i){if(s!==this.httpLibrarySeq)return;Bn(i)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let s=this.hass;if(!s)return;let i=++this.statusPagesSeq;try{let o=await E(s,t,"status_pages");if(i!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=$s(o)}catch(o){if(i!==this.statusPagesSeq||t!==this.watchId)return;wt(o)&&(this.statusPages=void 0)}}async loadPages(t){let s=this.hass;if(!s)return;let i=++this.pagesSeq;try{let o=await E(s,t,"pages");if(i!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&Z(o.document)&&!(yt(t)?.saving??!1)&&Os(t,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let s=this.hass;if(!s)return;let i=++this.behaviorSeq;try{let o=await E(s,t,"behavior");if(i!==this.behaviorSeq||t!==this.watchId)return;this.behavior=o.revision>0&&Z(o.document)?o.document:void 0}catch{if(i!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,s=!1){let i=this.hass;if(!i)return;if(s&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),s||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await E(i,t,"menus");if(o!==this.loadSeq)return;if(s&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;mi(r)?(this.unsupported=!0,this.loadError=void 0):s||(this.loadError=dn(r)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let s=this.watchId;this.record=t,s!==void 0&&t.revision<=0&&At(s);let i=t.revision>0?Ee(t.document):void 0;if(s===void 0||i===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===s&&t.revision>=o.revision&&(this.restartDraft=void 0,(j(s)?.dirty??!1)||Ve(s));let r=Ot(s,i,t.revision);r.replaced.length>0?this.note={kind:"warn",text:sn(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let s=this.hass;if(!s||this.historyState==="unsupported")return;let i=++this.historySeq;try{let o=await mn(s,t,"menus");if(i!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(i!==this.historySeq||t!==this.watchId)return;this.historyState=Ye(o)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let s=this.hass;if(this.endSubscription(),!s)return;let i=++this.subscribeSeq;wn(s,t,o=>{i===this.subscribeSeq&&(o.kind==="catalog"?Ts(o,this.catalog)&&this.loadCatalog(t):o.kind==="status_pages"?this.loadStatusPages(t):o.kind==="pages"?this.loadPages(t):o.kind==="behavior"?this.loadBehavior(t):o.kind==="voice"?this.loadVoice(t):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(o=>{i===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Cn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ua))}async poll(){this.pollTimer=void 0;let t=this.hass,s=this.watchId,i=this.record;if(!(!t||s===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await E(t,s,"menus");if(s!==this.watchId||this.record!==i)return;o.revision===i.revision?this.record={...i,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(s))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,s){let i=this.draft;if(!i||this.saving)return!1;let o=i.apply(t(i.document),this.scrubKey??s);return this.requestUpdate(),o}editPages(t,s){let i=this.pagesDraft;if(!i||this.saving)return!1;let o=this.scrubKey??s,r=i.apply(t(i.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??rs,s=this.iconMemo;if(s!==void 0&&s.provider===t&&s.tick===this.iconsTick)return s.icons;let i=cs(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:i},i}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:zn(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Wt(this.voiceDocument)}}screen(){let t=this.watches.find(s=>s.owner_watch_id===this.watchId);return(ot(t?.screen_size)??it).screen}viewHost(){let t=this.draft,s=this.hass;if(t===void 0||s===void 0)return;let i=this,o=ln(this.pagesDocument);return{hass:s,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),get document(){return t.document},get targets(){return i.targets()},get catalogKnown(){return i.catalog!==void 0},get httpLibrary(){return i.httpLibrary===void 0?void 0:i.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return i.statusPages!==void 0},get voice(){return i.voiceContext()},get busy(){return i.saving},edit:(r,a)=>this.draft===t&&this.edit(r,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let s=this.pagesDraft;if(s===void 0||gt(s.document,t)===void 0)return;let i=this,o=this.memoIcons();return{pageId:t,icons:o,symbols:this.symbols,uiState:this.uiState,get page(){return gt(s.document,t)??{}},get busy(){return i.saving},edit:(r,a)=>{this.pagesDraft===s&&this.editPages(r,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>s.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,s=this.pagesDraft?.discard()??!1;(t||s)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,s=this.watchId;this.endScrub();let i=this.draft,o=this.pagesDraft;if(!t||s===void 0||!i||this.saving)return;let r=i.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let c=r?await this.saveMenus(t,s,i,i.revision<=0):void 0,l=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(t,s,o):void 0;s===this.watchId&&(this.note=xa(c,l))}async saveMenus(t,s,i,o=!1){let r=fi(i,{prepare:ui,save:(c,l)=>Qe(t,s,"menus",c,l).catch(u=>{throw Ze(u)}),fetch:async()=>{let c=await E(t,s,"menus").catch(l=>{throw Ze(l)});return{revision:c.revision,document:c.document}}});this.followedSave=i.saveDone,this.requestUpdate();let a=await r.catch(c=>({ok:!1,revision:i.revision,merged:!1,code:Ye(c)??"unknown",message:dn(c)}));return this.saveEnded(s),Hi(o,a.code,No(a))}async savePages(t,s,i){let o=Ls(i,{prepare:a=>Ws(vs(a),i.base,this.hass?.states),save:(a,c)=>Qe(t,s,"pages",a,c).catch(l=>{throw Ze(l)}),fetch:async()=>{let a=await E(t,s,"pages").catch(c=>{throw Ze(c)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=i.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:i.revision,merged:!1,code:Ye(a)??"unknown",message:dn(a)}));return this.pagesSaveEnded(s),Vn(r)}startFresh(){let t=this.watchId;t===void 0||!Ln(this.noRecordState())||(Pi("menus",t),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let s=this.hass,i=this.watchId,o=this.record;if(!s||i===void 0||o===void 0||this.draft?.dirty)return;let r={entry:t,baseRevision:o.revision};this.restoreAsk=r,fn(s,i,"menus",t.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:Sa(a.document)})},()=>{})}async restore(){let t=this.hass,s=this.watchId,i=this.restoreAsk;if(!t||s===void 0||i===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await gn(t,s,"menus",i.entry.revision,i.baseRevision);o={kind:"ok",text:ds(i.entry.updated_at)},s===this.watchId?this.restartDraft={watchId:s,revision:r.revision}:(j(s)?.dirty??!1)||Ve(s)}catch(r){let a=Ye(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds menus for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${jn(r)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}s===this.watchId&&(this.note=o,this.load(s,!0))}render(){let t=this.watches,s=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(s,t):h}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:h}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):h}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Uo}renderTopBar(t,s){let i=t!==void 0&&!this.unsupported,o=i&&this.dirty,r=this.shellOwnsWatch;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:h}
      ${r?h:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Oi(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?h:this.renderWatchPicker(s)}
      ${this.barHost!==void 0&&i?Dn({newWatch:this.newWatch,dirty:o,saved:ct(this.record)}):h}
      ${this.renderSyncPill(i?t:void 0)}
      ${this.renderTopMenu(i?t:void 0)}
      ${i?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${on}S). A save reaches the watch the next time it checks.`:`Nothing to save (${on}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?h:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${ct(this.record)}</span>
        ${Ii(Ci({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:h}
      ${r?h:d`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():Di(void 0)}>${k("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(Ai,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let s=this.record;if(s===void 0||s.revision<=0||this.unsupported)return h;let i=t===void 0?{size:0,limit:1}:xt(t.document),o=at({record:s,size:i.size,limit:i.limit,noun:"menus",historyState:this.historyState});return d`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(t=this.watches){return En(t.find(s=>s.owner_watch_id===this.watchId))}opensReady(t=this.watches){return Ri(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let s=this.canStartFresh();if(t===void 0&&!s)return h;let i=this.topMenuOpen,o=r=>()=>{this.topMenuOpen=!1,r()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?d`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:h}
        ${s?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${et}</button>`:h}
      </div>`:h}
    </span>`}personColor(t){let s=Zn(this.owners.length>0?this.owners:this.ownList??[]);return Xn(s.findIndex(i=>i.owners.some(o=>o.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return h;let s=t.find(r=>r.owner_watch_id===this.watchId),i=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.personColor(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:h} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${o(s?.owner_watch_id)}<span class="tb-browse-l">${s?Me(s,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${i?d`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${Me(r,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?k("check"):h}</span>
          </button>`})}
      </div>`:h}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Uo?this.columns:_n(this.hostWidth-ha,this.columns,rn)}renderGutter(t){return d`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${s=>{let i=this.fittedColumns();Un(s,{side:t,base:t==="left"?i.left:i.right,limits:rn,onWidth:o=>{this.columns={...this.columns,[t]:o}},onEnd:()=>nt(cn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:an[t]},nt(cn,this.columns)}}></div>`}get stageScale(){return this.zoom??pt(this.narrow||this.stacked)}setZoom(t){this.zoom=t,uo(t)}renderStage(t,s){let i=s.find(u=>u.owner_watch_id===this.watchId),o=ot(i?.screen_size),r=o??it,a=[...Po(t),r.label],c=this.undoDraft,l=Xt(P(t));return d`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${i!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Me(i,s)}</span></span>`:h}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${o===void 0?`${r.label}, this watch's size is not known`:a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!c?.canUndo} title=${`Undo (${on}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!c?.canRedo} title=${Bo?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(r.label,t)}
        ${Do(t)}
        <div class="under"><span class="tail">${Ro(t)}</span>${Vo(t)}</div>
      </div>
    </div>`}renderStageTools(t,s){let i=this.stageScale,o=pt(this.narrow||this.stacked);return d`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${Wo(s)}
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${t}.`}>
        ${k("watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${i<=mt(i)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(mt(i))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${he(i)}. Back to fit`}
          title=${`The watch at ${he(i)} of its own points. Click to fit it again (${he(o)}).`}
          @click=${()=>this.setZoom(void 0)}>${he(i)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${i>=ht(i)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(ht(i))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Lt}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${l===void 0?h:d`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let s=this.record;if(s===void 0)return d`<div class="pe-empty">Loading…</div>`;let i=this.draft;if(i===void 0&&s.revision>0)return d`<div class="pe-empty"><b>${Lt}</b></div>`;if(i===void 0){let l=this.watchId===void 0?void 0:j(this.watchId),u=this.watchId;return d`<div class="pe-empty"><b>${hi}</b><span>${In}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${et}</button>
        ${l?.dirty&&u!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Ve(u),this.requestUpdate()}}>Discard the kept edits</button>`:h}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=s.revision<=0;return d`${c&&this.barHost===void 0?Ei():h}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Mo(o)}
        ${To(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Ho(o)}
      </div>
    </div>
    ${c?h:this.renderFoot(s,i.document,i.dirty)}`}renderFoot(t,s,i){let o=xt(s),r=at({record:t,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState}),a=this.watchId;return d`${es({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?ts({noun:"menus",record:t,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):h}
    ${this.rawOpen?ns({noun:"menus",document:s,revision:t.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{is(c).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):h}`}renderRestoreAsk(t){let s=this.record,i=fa(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${ga(t.entry.updated_by)}${i?` ${i}`:""}, ${ma(t.entry.size)}.</p>
      ${t.summary?d`<p class="pe-muted">${t.summary}</p>`:h}
      <p>It is saved again as a new revision${s?`, after revision ${s.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Rn,vn,xn,Sn,$n,kn,Mn,Tn,fs,Li,ee`
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
  `,Io,_o,os,Wn]}};y([C({attribute:!1})],w.prototype,"hass",2),y([C({attribute:!1})],w.prototype,"owners",2),y([C({attribute:!1})],w.prototype,"ownerId",2),y([C({type:Boolean,reflect:!0})],w.prototype,"narrow",2),y([C({attribute:!1})],w.prototype,"icons",2),y([C({attribute:!1})],w.prototype,"iconsTick",2),y([C({attribute:!1})],w.prototype,"haMenu",2),y([C({attribute:!1})],w.prototype,"onHaMenu",2),y([C({attribute:!1})],w.prototype,"onBack",2),y([C({attribute:!1})],w.prototype,"onPages",2),y([C({attribute:!1})],w.prototype,"barActions",2),y([C({attribute:!1})],w.prototype,"shellOwnsWatch",2),y([C({attribute:!1})],w.prototype,"barHost",2),y([S()],w.prototype,"watchId",2),y([S()],w.prototype,"record",2),y([S()],w.prototype,"unsupported",2),y([S()],w.prototype,"catalog",2),y([S()],w.prototype,"statusPages",2),y([S()],w.prototype,"httpLibrary",2),y([S()],w.prototype,"pagesRecord",2),y([S()],w.prototype,"behavior",2),y([S()],w.prototype,"voiceDocument",2),y([S()],w.prototype,"loading",2),y([S()],w.prototype,"loadError",2),y([S()],w.prototype,"history",2),y([S()],w.prototype,"historyState",2),y([S()],w.prototype,"note",2),y([S()],w.prototype,"restoreAsk",2),y([S()],w.prototype,"restoring",2),y([S()],w.prototype,"historyOpen",2),y([S()],w.prototype,"rawOpen",2),y([S()],w.prototype,"rawCopied",2),y([S()],w.prototype,"ownList",2),y([S()],w.prototype,"topMenuOpen",2),y([S()],w.prototype,"watchMenuOpen",2),y([S()],w.prototype,"zoom",2),y([S()],w.prototype,"columns",2),y([S()],w.prototype,"hostWidth",2),y([S()],w.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",w);export{cn as ME_COLUMNS_KEY,qo as WATCH_SWITCHER_COLORS,va as WATCH_SWITCHER_LEFT_OUT_COLOR,w as WaMenuEditor,xa as joinSaveNotes,ya as watchMenuPageTargets,Sa as watchMenusSummary,Kc as watchSwitcherPages,ln as watchSwitcherRows};
