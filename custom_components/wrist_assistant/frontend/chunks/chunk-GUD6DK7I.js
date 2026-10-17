import{a as Ze,g as Xe,h as Gt}from"./chunk-L4CHD3B7.js";import{d as xo,e as ee,f as Yt,g as Zt,h as Qe,i as ko,j as So}from"./chunk-6JYGGAOR.js";import{b as $o,c as Mo}from"./chunk-KKMB3GNG.js";import{B as ro,C as ao,D as co,ba as lo,ca as uo,da as Jt,ea as po}from"./chunk-BAOXSWIQ.js";import{a as Vs,b as qt,g as Bs,k as qs,l as js}from"./chunk-4GPB7T7O.js";import{B as cs,C as ds,b as ts,c as ns,i as is,l as ss,p as os,u as rs,v as as}from"./chunk-Z7YTC7Z2.js";import{$ as Ge,A as vs,B as j,C,D as Ke,E as ze,F as X,G as Je,H as ys,I as bs,J as Ht,K as xs,L as ks,M as Ss,N as $s,O as Ms,P as Ts,Q as _t,R as Nt,S as Ps,T as Rs,U as Cs,V as Ls,W as Wt,X as Ut,Y as Es,Z as Vt,_ as Is,a as Pe,aa as As,ba as Ee,ca as Ds,d as pe,da as Os,e as It,ea as ce,fa as Q,g as Re,ga as Ye,h as At,ha as me,i as ls,ia as Hs,j as he,ja as _s,k as ae,ka as Ns,l as us,m as T,ma as Ws,n as Ce,na as Bt,oa as Us,p as ps,q as je,r as hs,s as Dt,t as Ot,u as ms,v as fs,w as Le,x as gs,y as Fe,z as ws}from"./chunk-4E5AKPPV.js";import{o as Vi,p as Tt,q as Bi,r as Pt,s as Rt,w as ji,x as Fi,y as Ki,z as zi}from"./chunk-PEI2F5V4.js";import{b as di,c as gt,d as li,e as wt,f as ui}from"./chunk-ZOJGMATP.js";import{a as ho,b as mo,c as fo,d as go,e as wo,f as vo,g as yo}from"./chunk-6ETDLFV5.js";import{h as bo}from"./chunk-IXXLCEY3.js";import{b as Js,c as Gs,d as Ys,j as Zs,m as Xs,o as Ft,p as Qs,vb as oo}from"./chunk-RCG7YNUP.js";import{a as eo,b as to,c as no,d as Kt,e as zt,g as io,h as so}from"./chunk-V3JQMBXP.js";import{S as Fs,T as Ks,U as zs,W as jt}from"./chunk-QKO2AN2A.js";import{a as xt,b as kt,c as Mi,d as Ti,e as Pi,f as Ri,g as Ci,h as Li,i as Ei}from"./chunk-5KH3AD3A.js";import{d as _i}from"./chunk-AMGXZUWS.js";import{a as Si,b as $i,e as qi}from"./chunk-4C3X4OMP.js";import{a as Ii,b as Ai,c as Di,d as Oi,f as Hi}from"./chunk-QUDR47OK.js";import{Hb as fi,Ib as gi,Jb as wi,Pb as vi,Qb as yi,Qd as To,Rb as bi,Sb as xi,Sd as Po,Tb as ki,Td as Ro,Ub as Z,Vb as q,Wb as Te,X as vt,Yb as U,Zb as ue,aa as yt,cb as mi,ec as bt,gc as Ve,se as Co,ua as hi,z as pi}from"./chunk-B2GPRRUP.js";import{a as si,b as oi,c as ri}from"./chunk-7E7TQLFM.js";import{d as W,h as qn,j as jn,k as Fn,l as Kn,m as zn,n as Jn,o as Gn,p as Yn,y as Zn}from"./chunk-WDZJ6RME.js";import{Fa as qe,Ga as es,qa as Gi,ra as Et,sa as Yi,ta as Zi,ua as Xi,va as Qi}from"./chunk-H5K3BM3D.js";import{Ca as Ji}from"./chunk-4NI3O7TX.js";import{f as Lt}from"./chunk-UPANJPAF.js";import{Q as Ct,j as P,l as St,m as Ni,n as Be,o as $t,p as Wi,q as Mt,r as Ui}from"./chunk-ESIOP3D4.js";import{a as ai,b as Y,e as ci}from"./chunk-NKLOQSX6.js";import{c as Bn}from"./chunk-ZKYND2IQ.js";import{Eg as _,Gg as Ne,Kg as On,Lg as Hn,Mg as _n,Ng as Nn,Og as Wn,Pg as Un,Rg as Vn,b as B,d,e as M,g as p,ig as Dn,j as An,k as A,l as k,mh as $}from"./chunk-VWIMYR2L.js";import{B as Xn,E as Qn,M as We,N as G,R as ei,Sa as ii,U as Ue,X as ti,Y as Me,Z as ft,_ as ni}from"./chunk-Q6MTLD6E.js";import{a as y}from"./chunk-LO2NM3CE.js";var fe="linkIds",Xt=["anywhere","entity"],H={anywhere:"Anywhere menu",entity:"Entity quick menu"},ga={anywhere:["quickAction","pageSwitcher"],entity:["entityRadial"]};function Qt(e){return e==="entity"?"entity":"anywhere"}function wa(e,n){let t=e?.[fe],i=P(t)?t[n]:void 0;return typeof i=="string"&&i!==""?i:void 0}function en(e){return P(e?.menus)}function Ie(e,n,t,i){let s=wa(e,n),o=s===void 0?void 0:i?.menus?.[s],r=o===void 0||o.unit!==n||!Array.isArray(o.owners)?[]:o.owners;return[t,...r.filter(a=>a!==t)]}function Lo(e,n,t,i,s){return os(Ie(e,n,t,i),t,s)}var et="Update the integration to share menus between devices.",va="The menu is always on this device. Untick another device to stop sharing with it.",ya=`${Me} Menus can go on this watch after that.`,ba="waiting for iPhone";function xa(e,n,t,i,s,o=new Set){let r=new Set(Ie(n,t,i,s)),a=s!==void 0&&!en(s);return e.map(c=>{let l=c.ownerId===i,u=r.has(c.ownerId);return a?{device:c,on:u,here:l,stuck:et}:l?{device:c,on:!0,here:!0,stuck:va}:!u&&o.has(c.ownerId)?{device:c,on:u,here:!1,stuck:ya,tag:ba}:{device:c,on:u,here:!1}})}function Eo(e,n){if(n.stuck!==void 0)return n.stuck;let t=n.device.name;return n.on?`Unlink ${t}. It keeps this ${H[e]} as it is, and an edit then stays on its own device.`:`Put this ${H[e]} on ${t}. An edit on one device then shows on both.`}function Io(e,n){return{title:`Replace the ${H[e]} on ${n}?`,body:"Its own is lost."}}var Ao="On means that device shares this menu, and an edit on one device shows on all of them. Unticking a device keeps its menu as it is.",ka="The page switcher's look goes with it.",Sa="Speak phrase slots need the phrases on that watch too.",$a={navigateToPage:{key:"pageId",target:"page"},showStatusPage:{key:"pageId",target:"statusPage"}};function Ma(e){if(!P(e))return[];let n=Array.isArray(e.slots)?[e.slots]:[];for(let[i,s]of Object.entries(e))i.endsWith("Slots")&&Array.isArray(s)&&n.push(s);let t=e.entityOverrides;if(P(t))for(let i of Object.values(t))Array.isArray(i)&&n.push(i);return n}function Do(e,n){return ga[n].flatMap(t=>Ma(e[t])).flat().filter(P)}function Oo(e){return P(e.action)?e.action:void 0}function Ta(e,n){let t=new Map,i=new Map;for(let s of e===void 0?[]:Do(e,n)){let o=Oo(s),r=typeof o?.type=="string"?$a[o.type]:void 0,a=r===void 0?void 0:o?.[r.key];if(r===void 0||typeof a!="string"||a==="")continue;let c=r.target==="page"?t:i;c.has(a.toUpperCase())||c.set(a.toUpperCase(),a)}return{pageIds:[...t.values()],statusPageIds:[...i.values()]}}function Pa(e,n,t,i=[]){let{pageIds:s,statusPageIds:o}=Ta(e,n),r=(u,f)=>u.some(w=>w.id.toUpperCase()===f.toUpperCase()),a=s.flatMap(u=>t.find(f=>f.id.toUpperCase()===u.toUpperCase())?.name??[]),c=o.filter(u=>r(i,u)).length,l=[...a];return c>0&&l.push(c===1?"1 status page":`${c} status pages`),l.length===0?void 0:`Also adds: ${rs(l)}.`}function Ra(e){return e!==void 0&&Do(e,"anywhere").some(n=>Oo(n)?.type==="speakPhrase")}function Ho(e,n=Xt){return n.map(t=>{let i=[];t==="anywhere"&&i.push(ka);let s=Pa(e.document,t,e.pages,e.statusPages);return s!==void 0&&i.push(s),t==="anywhere"&&Ra(e.document)&&i.push(Sa),{unit:t,head:`The ${H[t]} is on`,places:xa(e.devices,e.document,t,e.here,e.places,e.waiting),lines:i,linked:Ie(e.document,t,e.here,e.places).length>1}})}function tn(e){let{code:n,message:t}=Y(e);switch(n){case"unknown_device":return"That device is not paired with this Home Assistant any more.";case"not_found":return"The menus are not saved here yet. Save first, then try again.";case"unit_taken":return"That device has a menu of its own there.";case"not_for_iphone":return"An iPhone cannot hold that menu.";case"id_taken":return"That device has a page of its own with the same id as a page this menu opens, so nothing was added.";case"awaiting_move":return`${Me} Try again after that.`;case"unknown_command":case"invalid_format":return et;default:return t}}function _o(e){return`Unlink this ${ns(e)}`}function Ca(e,n){let t=e[fe];if(!P(t)||!Object.hasOwn(t,n))return e;let i=At(t,n);return Object.keys(i).length===0?At(e,fe):Re(e,fe,i)}var La=3;async function No(e,n,t){for(let i=1;;i++){let s;try{s=await e.read(n)}catch(a){let{code:c="unknown",message:l}=Y(a);return{ok:!1,code:c,message:l}}let o=s.revision>0?pe(s.document):void 0,r=o===void 0?void 0:Ca(o,t);if(o===void 0||r===o)return{ok:!0,unlinked:!1};try{return await e.save(n,s.revision,r),{ok:!0,unlinked:!0}}catch(a){let{code:c="unknown",message:l}=Y(a);if(c!=="conflict"||i>=La)return{ok:!1,code:c,message:l}}}}function Wo(e){let{blocked:n,busy:t,note:i}=e,s=r=>r.stuck!==void 0||n!==void 0||t,o=e.groups.length===1?`Devices for the ${H[e.groups[0].unit]}`:"Devices for the menus";return d`<div class="pk-dup-menu pe-dev-menu me-dev-menu ${e.className??""}" role="group" aria-label=${o}>
    ${n===void 0?p:d`<div class="pe-dev-note warn">${n}</div>`}
    ${e.groups.map(r=>d`<div class="me-dev-group" data-unit=${r.unit}>
      <div class="pk-dup-head">${r.head}</div>
      ${r.places.map(a=>cs({place:a,name:H[r.unit],title:n??Eo(r.unit,a),off:s(a),...e.colorOf===void 0?{}:{colorOf:e.colorOf},onToggle:c=>e.onToggle(r.unit,c)}))}
      ${r.lines.map(a=>d`<div class="pe-dev-note me-dev-line">${a}</div>`)}
      ${r.linked?d`<button type="button" class="me-dev-unlink" ?disabled=${n!==void 0||t}
        title=${`Keep the ${H[r.unit]} here as it is, and stop sharing it. The other devices keep theirs.`}
        @click=${()=>e.onUnlinkHere(r.unit)}>${_o(e.hereKind)}</button>`:p}
    </div>`)}
    ${t?d`<div class="pe-dev-note">Saving…</div>`:p}
    ${i===void 0?p:d`<div class="pe-dev-note ${i.kind}" role="status">${i.text}</div>`}
    <div class="pk-dup-note">${Ao}</div>
    <button type="button" class="pk-dup-done" @click=${()=>e.onDone()}>Done</button>
  </div>`}var Uo=B`
  .me-dev-group { display: flex; flex-direction: column; gap: 4px; }
  .me-dev-group + .me-dev-group { border-top: 1px solid var(--wa-line); padding-top: 6px; margin-top: 2px; }
  .me-dev-line { font-size: 10.5px; }
  .me-dev-unlink {
    align-self: flex-start; border: 0; background: none; padding: 2px 0; cursor: pointer;
    font: inherit; font-size: 11px; font-weight: 600; color: var(--wa-accent);
  }
  .me-dev-unlink:disabled { opacity: .5; cursor: default; }
  .me-dev-unlink:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
  .wa-bar .pe-top-menu { position: relative; }
  .pe-top-menu > .pe-dev-menu.at-bar { position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: min(320px, calc(100vw - 32px)); }
  .pe-dev-menu.at-card { margin-top: 8px; box-shadow: none; }
  /* A menu's Devices line, in its card: the field's title, then a button
     with what the menu is shared with. */
  .me-dev-field > .pe-btn.pe-dev-open { justify-self: start; max-width: 100%; min-height: 28px; font-size: 12px; }
  .me-dev-field > .pe-btn.pe-dev-open > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pe-btn.pe-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
  .badge.pe-linked {
    max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 20px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
`;var on="In the page switcher",Ea=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],rn="switcher-settings",Vo=`${rn}:resetDot`;function Bo(e){return es(e,Ea,n=>{let t=qe(n);return[t.switcherIcon,t.switcherColor,t.switcherText,t.switcherDisplayMode??"text",t.hideFromSwitcher]})}function qo(e){let n=qe(e);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function an(e,n){return`${rn}:typed:${e.pageId.toUpperCase()}:${n}`}function nn(e,n){let t=e.uiState.get(an(e,n));return typeof t=="string"?t:void 0}function Ia(){if(typeof document>"u")return null;let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function Aa(e){let n=Ia(),t=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...e.uiState.keys()])i.startsWith(`${rn}:typed:`)&&(t===void 0||i!==an(e,t))&&e.uiState.delete(i)}function ge(e,n,t=!1){let i=e.uiState.delete(Vo);e.busy||e.edit(n,t&&!i?{typing:!0}:void 0)}function sn(e,n,t){let i=an(e,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return d`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&e.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(e.endCoalesce(),e.uiState.set(Vo,!0))}}}
    @change=${a=>{let c=a.target;typeof HTMLInputElement>"u"||!(c instanceof HTMLInputElement)||(c.type==="color"&&e.endCoalesce(),c.type==="checkbox"&&(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(e.uiState.delete(i),e.endCoalesce(),e.requestUpdate())}}>${t}</div>`}function jo(e){Aa(e);let n=e.page,t=qe(n),i=t.switcherDisplayMode??"text",s=Gi.map(l=>[l,l==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=l=>ge(e,u=>Et(u,e.pageId,l)),a=l=>ge(e,u=>Yi(u,e.pageId,l),!0),c=Ai(e);return d`
    ${U("Hidden",t.hideFromSwitcher,l=>ge(e,u=>Qi(u,e.pageId,l)),!1)}
    ${t.hideFromSwitcher?d`<div class="hint ts-under">The page stays on the ${c}. Only the switcher leaves it out.</div>`:p}
    ${q("Show as",s.some(([l])=>l===i)?i:"text",s,l=>ge(e,u=>Xi(u,e.pageId,l)))}
    ${sn(e,"switcherText",xi("Name",nn(e,"switcherText")??t.switcherText??"",l=>ge(e,u=>Zi(u,e.pageId,l),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${t.switcherIcon===void 0?"on":""}" aria-pressed=${t.switcherIcon===void 0?"true":"false"}
        title=${`The ${c} picks one from the page's first tile`} @click=${()=>ge(e,l=>Et(l,e.pageId,""))}>Automatic icon</button>
    </div>
    ${sn(e,"switcherIcon",Ve({icons:e.icons,symbols:e.symbols,device:Ii(e)},nn(e,"switcherIcon")??t.switcherIcon??"",r,"sw:switcher-icon",{emptyText:`Picked by the ${c}`,tint:t.switcherColor}))}
    ${sn(e,"switcherColor",d`<div class="ts-no-alpha">${ue("Color",nn(e,"switcherColor")??t.switcherColor,a,!0,null,{switchOn:t.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the ${c} shows the page's name and picks the icon and color itself.</div>`}var te=Ze.routing;function cn(e){return te.actions.find(n=>n.action===e)}function ne(e){return cn(e)?.keys??[]}function F(e){return Object.hasOwn(te.keys,e)?te.keys[e]:void 0}function ve(e){return P(e.voiceConfig)?e.voiceConfig:{}}function Da(e,n){let t=te.legacy[`${e}.${n}`];return t===void 0?n:/reads as (\w+)/.exec(t)?.[1]??n}function ie(e,n){let t=F(n);if(t===void 0)return;let i=Object.hasOwn(e,n)?e[n]:void 0;switch(t.type){case"enum":{let s=te.enums[t.enum??""]??[];return typeof i=="string"&&s.includes(i)?Da(n,i):t.default}case"bool":return typeof i=="boolean"?i:t.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return t.default;let[s,o]=t.clamp??[-1/0,1/0];return Math.min(o,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():t.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):t.default}}function Ko(e,n){let t=F(n)?.shownWhen;if(t===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(t.trim());if(i===null)return!0;let s=ie(e,i[1]),o=i[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof s=="string"&&o.includes(s);return i[2]===void 0?r:!r}function tt(e,n){let t=F(n);if(t?.type!=="enum")return[];let i=te.labels[t.enum??""]??{},s=te.offered[n]??te.enums[t.enum??""]??[],o=ie(e,n);return(typeof o=="string"&&!s.includes(o)?[o,...s]:s).map(a=>[a,i[a]??a])}function zo(e){return F(e)?.label??Oa[e]??e}var Oa={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function dn(e,n,t){let i=F(n);if(i===void 0)return e;let s;switch(i.type){case"enum":if(typeof t!="string"||!tt(e,n).some(([r])=>r===t))return e;s=t;break;case"bool":if(typeof t!="boolean")return e;s=t;break;case"int":{if(typeof t!="number"||!Number.isFinite(t))return e;let[r,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(r,Math.round(t)));break}case"entity":{if(t!==void 0&&typeof t!="string")return e;let r=(t??"").trim();if(r==="")return Gt(e,n);s=r;break}case"array":{if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))return e;let r=[...new Set(t.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return Gt(e,n);s=r;break}}return(Object.hasOwn(e,n)?Ct(e[n],s):Ct(ie(e,n),s))?e:Xe(e,n,s)}function Jo(e,n,t,i){let s=ie(e,n),o=Array.isArray(s)?s:[];return i===o.includes(t)?e:dn(e,n,i?[...o,t]:o.filter(r=>r!==t))}function Ha(e,n){switch(e.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function _a(e,n){let t=F(n);if(t?.fallsBackTo===void 0)return!1;let i=t.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=ie(e,s);return typeof o=="string"&&i.includes(o)}function ln(e,n,t,i){let s=F(n);if(s===void 0)return"None";if(!_a(e,n))return s.type==="array"?"None":"Not set";if(t===void 0)return"Default";let o=Ha(s,t);return typeof o=="string"&&o.trim()!==""?`Default (${i(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Fo(e){return Array.isArray(e)?e.filter(n=>typeof n=="string"):[]}function we(e,n){let t=n.toUpperCase();return e.some(i=>i.toUpperCase()===t)}function nt(e,n,t){let i=Fo(n),s=Fo(t);return e.filter(o=>!we(i,o)&&(s.length===0||we(s,o)))}function Na(e,n){return{hiddenPhraseIds:e.filter(t=>!we(n,t)),knownPhraseIds:e.slice()}}function Go(e,n,t,i){if(!we(n,t))return e;let s=nt(n,e.hiddenPhraseIds,e.knownPhraseIds);if(we(s,t)===i)return e;let o=i?n.filter(a=>we(s,a)||a.toUpperCase()===t.toUpperCase()):s.filter(a=>a.toUpperCase()!==t.toUpperCase()),r=Na(n,o);return Xe(Xe(e,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function Yo(e){if(e!==void 0)return{agent:e.defaultAssistAgentId,engine:e.defaultTTSEngine,speakers:e.defaultSpeakers??[]}}function Wa(e,n,t,i,s){return Ke(e,n,t,o=>{if(!ne(T(o)).includes(i))return o;let r=ve(o),a=dn(r,i,s);return a===r?o:Re(o,"voiceConfig",a)})}function Ua(e,n,t,i,s,o){return Ke(e,n,t,r=>{if(!ne(T(r)).includes(i))return r;let a=ve(r),c=Jo(a,i,s,o);return c===a?r:Re(r,"voiceConfig",c)})}function Va(e,n,t,i,s,o){return Ke(e,n,t,r=>T(r)==="ttsMenu"?Go(r,i,s,o):r)}function Zo(e){return Object.keys(ve(e)).some(n=>ne(T(e)).includes(n))}function Xo(e){let n=T(e);return ne(n).length>0||n==="ttsMenu"}function Qo(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Ba(e,n,t,i){let s=zs(e.hass.states),o=jt(s,t),r=a=>U(a.missing?`${a.entityId} (not found)`:a.name,t.includes(a.entityId),c=>i(a.entityId,c));return d`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function qa(e,n,t,i){let s=F(t),o=Yo(e.voice?.defaults),r=s?.domain==="conversation"?Fs(e.hass.states):Ks(e.hass.states,Object.keys(e.hass.services?.tts??{}),void 0),a=jt(r,i===""?[]:[i]);return[["",ln(n,t,o,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??Qo(e.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function ja(e,n,t,i,s){let o=F(s);if(o===void 0||!Ko(i,s))return p;let r=zo(s),a=ie(i,s),c=(l,u)=>e.edit(f=>Wa(f,n,t,s,l),u);switch(o.type){case"enum":return Z(r,String(a),tt(i,s),l=>c(l),{snapBack:!0,def:String(o.default)});case"bool":return U(r,a===!0,l=>c(l),o.default);case"int":{let l=typeof a=="number"?a:Number(o.default),u=Ze.volume,[f,w]=o.clamp??[u.min,u.max];return d`${Te(r,l,m=>c(m,`slot:${t}:${s}`),{min:f,max:w,step:u.step,def:Number(o.default),format:m=>`${Math.round(m)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(m=>d`<button type="button" class="pe-chip ${m.value===l?"on":""}"
          aria-pressed=${m.value===l?"true":"false"} @click=${()=>c(m.value)}>${m.label} ${m.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return Z(r,l,qa(e,i,s,l),u=>c(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=Yo(e.voice?.defaults),f=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${ln(i,s,u,w=>Qo(e.hass,w))}.`:"None picked.";return d`${Ba(e,r,l,(w,m)=>e.edit(g=>Ua(g,n,t,s,w,m)))}
        <div class="hint ${l.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${l.length===0?f:`${l.length} picked.`}</div>`}}}function Fa(e,n,t){let i=typeof t.id=="string"?t.id:"",s=ve(t),o=ne(T(t));return d`${e.voice?.defaults===void 0?d`<div class="hint">${po}.</div>`:p}
    ${o.map(r=>ja(e,n,i,s,r))}`}function Ka(e,n,t){let i=typeof t.id=="string"?t.id:"",s=e.voice?.phrases;if(s===void 0)return d`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return d`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=s.map(u=>u.id),r=nt(o,t.hiddenPhraseIds,t.knownPhraseIds),a=Array.isArray(t.knownPhraseIds)?t.knownPhraseIds.filter(u=>typeof u=="string"):[],c=a.length>0&&o.some(u=>!a.some(f=>f.toUpperCase()===u.toUpperCase())),l=u=>r.some(f=>f.toUpperCase()===u.toUpperCase());return d`<div class="me-sub-h">${cn("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>U(u.name,l(u.id),f=>e.edit(w=>Va(w,n,i,o,u.id,f))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${s.length} show on the watch.`}</div>
    ${c?d`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function er(e,n,t){let i=T(t);if(i==="ttsMenu")return Ka(e,n,t);if(ne(i).length>0)return Fa(e,n,t)}function tr(e,n){let t=T(n);if(t==="ttsMenu"){let r=e.voice?.phrases;return r===void 0?"":`${nt(r.map(c=>c.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let i=ve(n),s=ne(t)[0];if(s===void 0)return"";let o=ie(i,s);return tt(i,s).find(([r])=>r===o)?.[1]??""}function or(e,n,t,i,s,o,r=""){return d`<div class="mi-look">
    <div class="mi-look-title">${vi(e,n,t,c=>o(c),c=>i.find(([l])=>l===c)?.[1]??c)}</div>
    <div class="mi-pics ${r}" role="group" aria-label=${e} style=${`--n:${i.length}`}>
      ${i.map(([c,l])=>{let u=c===n;return d`<button type="button" class="mi-pic ${u?"on":""}" aria-pressed=${u?"true":"false"} aria-label=${`${e}: ${l}`}
          @click=${()=>{c!==n&&o(c)}}>${s(c)}<span class="mi-pic-name">${l}</span></button>`})}
    </div>
  </div>`}function ot(e,n,t,i,s){return d`<div class="mi-switch">${U(e,n,t,i)}<div class="hint mi-switch-hint">${s}</div></div>`}function za(e){return d`<div class="mi-wrap">${e}</div>`}function rt(e,n){return ce(e).find(t=>t.key===n)}function un(e,n){return typeof e=="number"&&typeof n=="number"?Math.abs(e-n)<1e-9:typeof e=="string"&&typeof n=="string"?e.toUpperCase()===n.toUpperCase():e===n}function at(e,n,t){return ce(n).some(i=>t.includes(i.key)&&Ye(e,n,i)&&!un(Q(e,n,i),i.default))}function it(e,n,t){let i=rt(n,t);if(i===void 0)return;let s=`style:${n}:${t}`;return{field:i,value:Q(e.document,n,i),set:(o,r=!1)=>e.edit(a=>Hs(a,n,t,o),r?s:void 0)}}function pn(e){return typeof e.value=="number"?e.value:Number(e.field.default)}function ct(e,n){return n===void 0?p:Te(e,pn(n),t=>n.set(t,!0),{min:n.field.min??0,max:n.field.max??1,step:n.field.step??.01,def:Number(n.field.default)})}function nr(e,n,t,i){if(n===void 0)return p;let s=n.value===!0?"on":"off",o=n.field.default===!0?"on":"off";return or(e,s,o,[["off",t[0]],["on",t[1]]],r=>i(r==="on"),r=>n.set(r==="on"))}var rr=["showIconBubble","backgroundDim","showNeonOutline","showContextLabel","glowIntensity"],ar=["entranceStyle","beamStyle","beamColor","beamIntensity","showFingerShadow"],ir=[[.4,"Light"],[.65,"Medium"],[1,"Full"]];function Ja(e){return d`<span class="mi-well mi-backdrop ${e?"glass":""}" aria-hidden="true">
    <span class="mi-tiles"><i></i><i></i><i></i><i></i></span><span class="mi-veil"></span>
    <span class="mi-ring"><i></i><i></i><i></i></span>
  </span>`}function Ga(e){return d`<span class="mi-well mi-buttons ${e?"neon":""}" aria-hidden="true"><i></i><i></i><i></i></span>`}function Ya(e){if(e===void 0)return p;let n=pn(e),t=(e.field.presets??ir.map(([s,o])=>({value:s,label:o}))).map(s=>[String(s.value),ir.find(([o])=>un(o,s.value))?.[1]??s.label]),i=t.find(([s])=>un(Number(s),n))?.[0]??"";return d`${q("How dark",i,t,s=>e.set(Number(s)),{def:String(e.field.default)})}
    ${ct("Exact",e)}`}function cr(e){let n=i=>it(e,"quickAction",i),t=n("showContextLabel");return d`
    ${nr("Behind the ring",n("showIconBubble"),["Solid","Glass"],Ja)}
    ${Ya(n("backgroundDim"))}
    ${nr("Buttons",n("showNeonOutline"),["Plain","Neon"],Ga)}
    ${t===void 0?p:ot("Names under the buttons",t.value===!0,i=>t.set(i),t.field.default===!0,"Each slot's name shows under its button.")}
    ${ct("Glow",n("glowIntensity"))}`}function dr(e){let n=t=>{let i=rt("quickAction",t);return i===void 0?void 0:Q(e,"quickAction",i)};return`${n("showIconBubble")===!0?"Glass":"Solid"}, ${n("showNeonOutline")===!0?"Neon":"Plain"} buttons`}function Za(){let e=me("BeamStyle");return[...e.filter(([n])=>n==="none"),...e.filter(([n])=>n!=="none")]}function Xa(e){let n=M``;switch(e){case"sectorWedge":n=M`<path class="b soft" d="M9 14 L33 5 A10 10 0 0 1 33 23 Z" />`;break;case"auroraWash":n=M`<path class="b faint" d="M9 14 C17 4 25 4 33 14 C25 24 17 24 9 14 Z" /><path class="b soft" d="M9 14 C18 9 25 9 33 14 C25 19 18 19 9 14 Z" />`;break;case"radiantBloom":n=M`<circle class="b faint" cx="33" cy="14" r="9" /><circle class="b soft" cx="33" cy="14" r="6" /><path class="l" d="M9 14 H27" />`;break;case"ripplePulse":n=M`<circle class="r" cx="33" cy="14" r="6" /><circle class="r faint" cx="33" cy="14" r="9.5" /><path class="l dash" d="M9 14 H26" />`;break;case"wakeWave":n=M`<path class="l" d="M9 14 Q13 8 17 14 T25 14 T33 14" /><path class="l faint" d="M9 17 Q13 11 17 17 T25 17 T33 17" />`;break}return d`<span class="mi-well mi-beam" aria-hidden="true"><svg viewBox="0 0 42 28" width="42" height="28">
    ${n}<circle class="dot" cx="9" cy="14" r="2.6" /><circle class="dot" cx="33" cy="14" r="3.4" />
  </svg></span>`}function Qa(e,n){if(n===void 0||!Ye(e.document,"quickAction",n.field))return p;let t=typeof n.value=="string"?n.value:String(n.field.default),i=n.field.swatches;return d`<div class="ts-no-alpha">${ue("Beam color",t,s=>{s!==void 0&&n.set(s,!0)},!1,String(n.field.default))}</div>
    ${i===void 0?p:d`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label="Beam color">
      ${i.map(s=>{let o=s.toUpperCase()===t.toUpperCase();return d`<button type="button" class="ts-swatch ${o?"on":""}" aria-pressed=${o?"true":"false"} title=${s} aria-label=${s}
          style=${`--sw:${s}`} @click=${()=>n.set(s)}></button>`})}</div></div>`}`}function lr(e){let n=r=>it(e,"quickAction",r),t=n("entranceStyle"),i=n("beamStyle"),s=n("beamIntensity"),o=n("showFingerShadow");return d`
    ${t===void 0?p:za(q("Opening",String(t.value),me("EntranceStyle"),r=>t.set(r),{def:String(t.field.default)}))}
    ${i===void 0?p:or("Beam from your finger to the slot",String(i.value),String(i.field.default),Za(),Xa,r=>i.set(r),"beams")}
    ${Qa(e,n("beamColor"))}
    ${s===void 0||!Ye(e.document,"quickAction",s.field)?p:ct("Beam strength",s)}
    ${o===void 0?p:ot("Finger shadow",o.value===!0,r=>o.set(r),o.field.default===!0,"A soft dark spot where your finger rests.")}`}function ur(e){let n=s=>{let o=rt("quickAction",s);return o===void 0?"":String(Q(e,"quickAction",o))},t=(s,o)=>me(s).find(([r])=>r===o)?.[1]??o,i=n("beamStyle");return`Opening ${t("EntranceStyle",n("entranceStyle")).toLowerCase()}, ${i==="none"?"no beam":`${t("BeamStyle",i).toLowerCase()} beam`}`}var pr=["glowIntensity","selectedScale"];function ye(e){return Math.round(e*1e3)/10}function hr(e){let n=it(e,"pageSwitcher","glowIntensity"),t=it(e,"pageSwitcher","selectedScale");return d`${ct("Glow",n)}
    ${t===void 0?p:Te("Picked page size",ye(pn(t)),i=>t.set(Math.round(i*100)/1e4,!0),{min:ye(t.field.min??1),max:ye(t.field.max??1.5),step:ye(t.field.step??.05),def:ye(Number(t.field.default)),unit:"%",format:i=>`${Math.round(i)}%`})}`}function mr(e){let n=rt("pageSwitcher","selectedScale"),t=n===void 0?void 0:Q(e,"pageSwitcher",n);return typeof t=="number"?`Picked page ${Math.round(ye(t))}%`:""}function st(e,n,t,i){return e.render(n,t,i)??d`<span class="mi-glyph-dot" style=${`background:${i}`}></span>`}var fr=["light","switch","lock","cover","climate","media_player"],ec={media_player:"Media player"};function gr(e,n,t,i,s){let o=t.some(a=>a.domain===n),r=o?[["","Pick another type"],...i]:[...i];return d`<div class="mi-pics mi-types" role="group" aria-label="Types">
      ${t.map(a=>{let c=a.domain===n,l=ec[a.domain]??a.label;return d`<button type="button" class="mi-pic mi-type ${c?"on":""}" aria-pressed=${c?"true":"false"} data-type=${a.domain}
          @click=${()=>{c||s(a.domain)}}><span class="mi-icon-well" aria-hidden="true">${st(e,a.icon,16,a.color)}</span><span class="mi-pic-name">${l}</span></button>`})}
    </div>
    ${Z("More types",o?"":n,r,a=>{a!==""&&a!==n&&s(a)},{snapBack:!0})}`}function wr(e,n,t,i){return d`<div class="mi-acts">${t.map(s=>d`<div class="mi-act-group" role="group" aria-label=${s.heading}>
    <div class="mi-act-h">${s.heading}</div>
    <div class="mi-act-grid">${s.tiles.map(o=>{let r=o.raw===n,a=!r&&o.why!==void 0;return d`<button type="button" class="mi-act ${r?"on":""}" aria-pressed=${r?"true":"false"} ?disabled=${a} data-action=${o.raw}
        title=${o.why??p} @click=${()=>{r||i(o.raw)}}>
        <span class="mi-icon-well" aria-hidden="true">${st(e,o.icon,14,o.color)}</span>
        <span class="mi-act-t"><span class="mi-act-name">${o.label}</span>
          ${o.why===void 0||r?p:d`<small class="mi-act-why">${o.why}</small>`}</span>
      </button>`})}</div>
  </div>`)}</div>`}var tc=[["topLeft","topCenter","topRight"],["leftCenter",null,"rightCenter"],["bottomLeft","bottomCenter","bottomRight"]];function sr(e){return e.here?e.holder===void 0?`${e.label}, here now`:`${e.label}, here now, shared with ${e.holder.name}`:e.holder===void 0?`${e.label}, move here`:`${e.label}, swap with ${e.holder.name}`}function vr(e,n,t,i){let s=new Map(t.map(r=>[r.position,r])),o=r=>{if(r===null)return d`<span class="mi-where-finger" aria-hidden="true"><i></i></span>`;let a=s.get(r);if(a===void 0)return d`<span class="mi-where-cell" aria-hidden="true"></span>`;let c=a.here?"here":a.holder===void 0?"free":"held",l=a.here?st(e,n.icon,14,n.color):a.holder===void 0?$("plus"):st(e,a.holder.icon,13,a.holder.color);return d`<button type="button" class="mi-where-cell ${c}" data-place=${r} aria-label=${sr(a)} title=${sr(a)}
      aria-current=${a.here?"true":"false"} style=${a.here?`--c:${n.color}`:p}
      @click=${()=>{a.here||i(r)}}>${l}</button>`};return d`<div class="mi-where">
    <div class="mi-where-ring" role="group" aria-label="Place on the ring">${tc.map(r=>r.map(o))}</div>
    <p class="hint mi-where-note">Click a place to move it there. A place that holds another slot swaps with it.</p>
  </div>`}var yr=B`
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
`;var Sr=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],$r="Each page's icon, color and name are set here: pick a page in the Pages card.",nc="Pick a page in the Pages card to set how it shows here.",ic={anywhere:"Opens on any screen. Your shortcuts for the whole watch.",entity:"Opens over a tile. Controls for that kind of thing.",switcher:"Jumps to another page. Set how each page shows."},Mr={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:$r},sc="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",oc="Click a slot or its label to edit it. Click anywhere else for the menu's look.",ke=.36,fn=44,gn=22;function Tr(e,n){let t=Math.min(e.width,e.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*t/e.width),y:i(.5+(n.y-.5)*t/e.height)}}function rc(e,n,t=ke){let i=(270-e*360/Math.max(1,n))*Math.PI/180,s=o=>Math.round(o*1e4)/1e4;return{x:s(.5+t*Math.cos(i)),y:s(.5+t*Math.sin(i))}}var Pr="wrist-assistant-panel.menus.zoom.v1";function Rr(e=gt()){try{let n=e?.getItem(Pr);if(n==null||n==="")return;let t=Number(n);return Vi.includes(t)?t:void 0}catch{return}}function Cr(e,n=gt()){try{n?.setItem(Pr,e===void 0?"":String(e))}catch{}}var Lr={name:{color:W.place,icon:"text"},slot:{color:W.content,icon:"content"},where:{color:W.position,icon:"place"},look:{color:W.look,icon:"look"},shows:{color:W.states,icon:"states"},menu:{color:W.content,icon:"content"},style:{color:W.look,icon:"look"},motion:{color:W.look,icon:"radial"},switcherPage:{color:W.content,icon:"watch"}},ac="#26a69a",cc=W.complication,N="menu-editor";function Ae(e,n,t){return`${e} ${e===1?n:t}`}function be(e,n){let t=e.states[n]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t:n}function Er(e,n){return{entityId:n,displayName:n===""?"":be(e,n),domain:je(n)}}function De(e,n,t,i){return e.icons.render(n,t,i)??d`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function V(e){return he(T(e))===void 0?{icon:Pe.unknownActionIcon,color:Pe.unknownActionColor}:{icon:typeof e.icon=="string"&&e.icon!==""?e.icon:"circle",color:typeof e.color=="string"?e.color:"#FFFFFF"}}function Ir(e){let n=T(e);if(n==="triggerEntity"){let i=Ce(e).entityId;return Ot(je(typeof i=="string"?i:""))}let t=he(n);return t===void 0?void 0:{icon:t.icon,color:t.color}}function L(e,n){return e.toUpperCase()===n.toUpperCase()}function dc(e,n){return e.toUpperCase()===n.toUpperCase()}function lc(e,n){let t=T(n),i=Ce(n),s=he(t);for(let o of s?.payload??[]){let r=i[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return be(e.hass,r);if(o.target==="page")return e.targets.pages.find(a=>L(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return e.targets.statusPages.find(a=>L(a.id,r))?.name??"A status page";if(o.target==="httpAction")return e.targets.httpActions.find(a=>L(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=e.targets.phrases;return a?.find(c=>L(c.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function de(e,n){return lc(e,n)??ae(T(n))}function xe(e){return Le(e)?.label??e}var Ar="me:menu",Dr="me:er:mode",Or="me:er:domain",mn="me:er:entity",hn="me:er:add";function R(e){let n=e.uiState.get(Ar);return n==="entity"||n==="switcher"?n:"anywhere"}function uc(e,n){n!==R(e)&&e.uiState.delete(dt),e.uiState.set(Ar,n),e.requestUpdate()}var dt="me:sw:page";function Hr(e){return e.switcherRows??e.switcherPages.map(n=>({...n,hidden:!1}))}function se(e){if(R(e)!=="switcher")return;let n=e.uiState.get(dt);if(typeof n=="string")return Hr(e).find(t=>L(t.id,n))}function wn(e,n){n===void 0?e.uiState.delete(dt):e.uiState.set(dt,n),e.requestUpdate()}function _r(e){let n=se(e);return n===void 0?void 0:e.switcherSettings?.(n.id)}function vn(e){return Sr.find(([n])=>n===e)?.[1]??e}function Nr(e){return e.uiState.get(Dr)==="entity"?"entity":"domain"}function Wr(e){let n=e.uiState.get(Or);return typeof n=="string"&&Le(n)!==void 0?n:"light"}function Ur(e){let n=Ee(e.document),t=e.uiState.get(mn);return typeof t=="string"&&n.includes(t)?t:n[0]}function z(e){switch(R(e)){case"anywhere":return Fe;case"entity":return yn(e);case"switcher":return}}function yn(e){if(Nr(e)==="domain")return{list:"domain",domain:Wr(e)};let n=Ur(e);return n===void 0?void 0:{list:"entity",entityId:n}}function Vr(e,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${xe(n.domain)} menu`:`${be(e.hass,n.entityId)} menu`}function Br(e){return`me:sel:${ws(e)}`}function le(e,n){let t=e.uiState.get(Br(n));if(typeof t=="string")return j(e.document,n).find(i=>L(C(i),t))}function Se(e,n,t){e.uiState.set(Br(n),t),e.requestUpdate()}function Oe(e){if(se(e)!==void 0)return wn(e,void 0),!0;let n=z(e);return n===void 0||le(e,n)===void 0?!1:(Se(e,n,void 0),!0)}function lt(e,n,t){let i;e.edit(s=>{let o=Ss(s,n,{...t===void 0?{}:{position:t},targets:e.targets});return i=o.id,o.document}),i!==void 0&&Se(e,n,i)}function br(e){let t=(i,s)=>Math.round((s+(i-.5)/ke*8)*100)/100;return d`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${fn} ${gn}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${e.map(i=>M`<circle cx=${t(i.x,22)} cy=${t(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function pc(e,n){return n===void 0?[]:j(e.document,n).flatMap(t=>{if(t.isVisible===!1)return[];let i=Je(typeof t.position=="string"?t.position:"");return i===void 0?[]:[{...i,color:V(t).color}]})}function hc(e,n){if(n==="switcher")return Ae(e.switcherPages.length,"page","pages");let t=n==="anywhere"?Fe:yn(e);return t===void 0?"none yet":Ae(j(e.document,t).length,"slot","slots")}function mc(e,n){if(n==="switcher"){let t=e.switcherPages;return br(t.map((i,s)=>({...rc(s,t.length),color:i.color})))}return br(pc(e,n==="anywhere"?Fe:yn(e)))}var fc="Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";function qr(e){let n=R(e);return d`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${fn}px; --thumb-h: ${gn}px`}>
    <div class="lc-head">
      <span class="swatch">${$("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${sc}>on the watch</span>
    </div>
    <p class="me-intro">${fc}</p>
    <div class="layers me-menu-list" role="list">
      ${Sr.map(([t,i])=>{let s=t===n,o=()=>{s||uc(e,t)},r=e.linkBadge?.(t);return d`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${t} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${Mr[t]}
          @click=${o}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${mc(e,t)}
          <span class="name"><b><span class="nm-t">${i}</span><span class="me-menu-count">${hc(e,t)}</span></b><small>${ic[t]}</small></span>
          <span class="right">${r===void 0?p:d`<span class="badges"><span class="badge pe-linked" title=${r}>${r}</span></span>`}</span>
        </div>`})}
    </div>
  </section>`}function gc(e,n,t){return d`<span class="thumb me-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="me-thumb-glyph">${De(e,n,14,t)}</span></span>`}function xr(e,n){return n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet":n.list==="domain"?`${xe(n.domain)} menu, by type`:`${be(e.hass,n.entityId)}'s own menu`}function wc(e){return e.hidden?"Not in the switcher":e.text===void 0?"Shown as its icon":e.text===e.name?"Shown by name":`Shown as ${e.text}`}function vc(e,n,t){let i=t!==void 0&&L(t.id,n.id),s=wc(n),o=()=>wn(e,n.id);return d`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${gc(e,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?d`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function yc(e){let n=Hr(e),t=se(e),i=n.filter(s=>s.hidden).length;return d`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${fn}px; --thumb-h: ${gn}px`}>
    <div class="lc-head">
      <span class="swatch">${$("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${Ae(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?d`<div class="lc-note">No page shows in the switcher.</div>`:d`<div class="layers me-page-list" role="list">${n.map(s=>vc(e,s,t))}</div>`}
  </section>`}function jr(e){return R(e)==="switcher"?yc(e):p}function Fr(e){if(R(e)==="switcher")return[Ae(e.switcherPages.length,"page","pages")];let n=z(e);if(n===void 0)return[xr(e,n)];let t=Ae(j(e.document,n).length,"slot","slots");return n.list==="anywhere"?[t]:[xr(e,n),t]}function Kr(e){return R(e)==="switcher"?$r:z(e)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":oc}function zr(e,n){return ji(e.uiState,N,n)}function bc(e,n){Fi(e.uiState,N,n,!zr(e,n)),e.requestUpdate()}function xc(e){if(_r(e)!==void 0)return[{module:N,section:"switcher-page"}];let n=z(e),t=n===void 0?void 0:le(e,n);if(t!==void 0)return[{module:N,section:"slot"},{module:N,section:"where"},...Xo(t)?[{module:N,section:"voice"}]:[],{module:N,section:"look"},...n?.list==="anywhere"?[{module:N,section:"shows"}]:[]];let i=R(e);return i==="anywhere"?[{module:N,section:"style-anywhere"},{module:N,section:"motion-anywhere"}]:[{module:N,section:i==="entity"?"menu":`style-${i}`}]}function K(e,n,t,i,s,o={}){let r=zr(e,t),a=Lr[n];return Yn({color:a.color,icon:$(a.icon),title:i,open:r,onToggle:()=>bc(e,t),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${N}:${t}`},r?s:d``)}function Jr(e){let n=R(e),t=vn(n),i=z(e),s=i===void 0?void 0:le(e,i),o=xc(e),r=Ki(e.uiState,o),a=se(e),c=_r(e),l,u;if(a!==void 0&&c!==void 0)l=d`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>wn(e,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${cc}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=kc(e,c);else if(s===void 0||i===void 0)l=d`<div class="crumbs"><span class="kchip" style=${`--k:${ac}`}>Menu</span><span class="nm" title=${t}>${t}</span></div>`,u=Kc(e,n);else{let f=de(e,s);l=d`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>Se(e,i,void 0)}>${t}</button><span class="sep">›</span><span class="kchip" style=${`--k:${V(s).color}`}>Slot</span><span class="nm" title=${f}>${f}</span></div>`,u=Vc(e,i,s)}return d`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{zi(e.uiState,o,!r),e.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function kc(e,n){let t=n.page;return K(e,"switcherPage","switcher-page",on,d`<fieldset class="ts-body me-body" ?disabled=${e.busy} aria-label=${on}>${jo(n)}</fieldset>`,{summary:qo(t),dot:Bo(t)})}var Sc={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function Gr(e,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":e==="runScene"?"Scene":e==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Sc[n.key]??n.key}var $c={navigation:"Go around",quickAction:"Do something",information:"Show something",remote:"Remote control"};function Yr(e){return ae(e).replace(/ - (.+)$/," ($1)")}function Mc(e,n){if(n==="entityControl"){let t=vs(e)??"all";return t==="all"?"Any entity":xe(t)}return $c[n]??us(n)}function Tc(e,n,t){let i=T(t),s=xs(n),o=a=>{let c=he(a),l=c===void 0?{icon:Pe.unknownActionIcon,color:Pe.unknownActionColor}:c,u=a===i?void 0:ps(a,e.targets);return{raw:a,label:Yr(a),icon:l.icon,color:l.color,...u===void 0?{}:{why:u}}};return[...s.some(a=>a.actions.includes(i))?[]:[{heading:"Now",tiles:[o(i)]}],...s.map(a=>({heading:Mc(n,a.category),tiles:a.actions.map(o)}))]}function Pc(e){return e.needsSetup===!0?`${e.name} (${e.source==="home"?"needs setup":"needs setup on the iPhone"})`:e.source==="iphone"?`${e.name} (on the iPhone)`:e.name}function kr(){return d`<button type="button" class="link" @click=${Co}>Open HTTP actions</button>`}function Rc(e,n,t){let i=n.find(s=>L(s.id,t));return i?.source==="home"&&i.needsSetup===!0?d`<div class="hint warn ts-under">Needs setup. ${kr()}</div>`:e.httpLibrary!==void 0&&n.length===0?d`<div class="hint ts-under">${Xs} ${kr()}</div>`:!e.catalogKnown&&e.httpLibrary!=="held"?d`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function Cc(e,n,t,i,s){let o=C(t),r=Ce(t)[s.key],a=typeof r=="string"?r:"",c=s.target==="page"?e.targets.pages:s.target==="statusPage"?e.targets.statusPages:s.target==="ttsPhrase"?e.targets.phrases??[]:e.targets.httpActions,l=a===""||c.some(h=>L(h.id,a)),u=h=>e.edit(x=>Wt(x,n,o,s.key,h===""?void 0:h)),f=s.target==="statusPage"&&e.statusPagesKnown===!0,w=s.target==="httpAction"&&e.httpLibrary==="held"&&!e.catalogKnown,m=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?e.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":f?`Not in this ${G(e.device??"watch")}'s status pages`:w?Zs:Js,g=h=>s.target==="httpAction"?Pc(h):h.name;return d`<label class="field"><span>${Gr(i,s)}</span>
    <select .value=${pi(c.find(h=>L(h.id,a))?.id??a)} @change=${h=>u(h.target.value)}>
      ${s.required===!0?p:d`<option value="" ?selected=${a===""}>None</option>`}
      ${l?p:d`<option value=${a} selected>${m}</option>`}
      ${c.map(h=>d`<option value=${h.id} ?selected=${L(h.id,a)}>${g(h)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?e.device==="iphone"?d`<div class="hint ts-under">${Ws}</div>`:e.voice?.phrases===void 0?d`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:s.target==="statusPage"?f||e.catalogKnown?p:d`<div class="hint ts-under">${We("status pages",e.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?Rc(e,e.targets.httpActions,a):p}`}function Lc(e,n,t,i,s){let o=C(t),r=Ce(t),a=(u,f)=>e.edit(w=>Wt(w,n,o,s.key,u),f),c=Gr(i,s),l=Ut(t,s);switch(s.type){case"entity":{let u=typeof r[s.key]=="string"?r[s.key]:"",f=i==="runScene"?"scene":i==="runScript"?"script":ms();return d`<div class="ts-stack">${bt({hass:e.hass},c,Er(e.hass,u),w=>a(w.entityId),`me:entity:${o}`,{domain:f,clearable:!1,needed:u===""})}</div>
        ${u===""?d`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return Cc(e,n,t,i,s);case"enum":{if(s.key==="triggerMode"){let w=je(typeof r.entityId=="string"?r.entityId:""),m=hs(w),g=typeof l=="string"?l:m[0]??"",h=m.map(x=>[x,Dt(x)]);return m.includes(g)||h.unshift([g,Dt(g)]),Z(c,g,h,x=>a(x),{snapBack:!0})}let u=me(s.enum),f=typeof l=="string"?l:String(s.default??"");return u.length<=4?q(c,f,u,w=>a(w)):Z(c,f,u,w=>a(w),{snapBack:!0})}case"bool":return U(c,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&Ut(t,{key:"showBanner",type:"bool",default:!0})===!1)return p;let u=typeof r[s.key]=="number"?r[s.key]:void 0;return ki(c,u,f=>a(f,`slot:${o}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function Ec(e,n,t){if(!_t(n,t))return p;let i=C(t);return d`<div class="ts-stack">${q("Skip conditions",ao(Nt(t)),ro,s=>e.edit(o=>Ps(o,n,i,co(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Ic(e){let n=Ge(e);return n===void 0?"Every screen":n.length===0?"No entity under the finger":n.map(xe).join(", ")}function Ac(e,n){let t=C(n),i=Ge(n),s=i===void 0,o=c=>e.edit(l=>Is(l,t,c)),r=Es(),a=(i??[]).filter(c=>!Vt(c));return d`<div class="mi-wrap">${q("Show on",s?"every":"some",[["every","Every screen"],["some","Only over some tiles"]],c=>o(c==="every"?void 0:r.slice(0,1)),{def:"every"})}</div>
    ${s?p:d`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(c=>{let l=i.includes(c),u=!Vt(c);return d`<button type="button" class="pe-chip ${l?"on":""} ${u?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${u?"Not reported by the watch":p}
          @click=${()=>o(l?i.filter(f=>f!==c):[...i,c])}>${xe(c)}</button>`})}
    </div>
    ${a.length===0?p:d`<div class="hint warn">${a.map(xe).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`}function Dc(e,n){return _t(n,e)&&Nt(e)!==null}function Oc(e){return e.isVisible===!1}function Hc(e){return Ge(e)!==void 0}function _c(e){let n=Ir(e);if(n===void 0)return!1;let t=V(e);return t.icon!==n.icon||!dc(t.color,n.color)}function Nc(e,n){let t=Lr.name;return d`<section class="sec name-sec" data-open="true" style=${`--c:${t.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${$(t.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${de(e,n)}</span>
    </div>
  </section>`}function Wc(e){let n=X(e);return n.charAt(0)+n.slice(1).toLowerCase()}function Uc(e,n,t){let i=C(t),s=j(e.document,n).filter(o=>!L(C(o),i));return ze().map(o=>{let r=s.find(c=>c.position===o),a={position:o,label:Wc(o),here:t.position===o};return r!==void 0&&(a.holder={name:de(e,r),...V(r)}),a})}function Vc(e,n,t){let i=C(t),s=T(t),o=he(s),r=V(t),a=Ir(t),c=typeof t.position=="string"?t.position:"",l=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="What it does">
    ${o===void 0?d`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${wr(e.icons,s,Tc(e,n,t),m=>e.edit(g=>Ls(g,n,i,m,e.targets)))}
    ${o?.description?d`<div class="mi-desc">${o.description}</div>`:p}
    ${ks(s)?d`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(o?.payload??[]).map(m=>Lc(e,n,t,s,m))}
    ${Ec(e,n,t)}
  </fieldset>`,u=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Where">
    ${vr(e.icons,r,Uc(e,n,t),m=>e.edit(g=>Ms(g,n,i,m)))}
    ${U("Shown on the watch",t.isVisible!==!1,m=>e.edit(g=>Ts(g,n,i,m)),!0)}
  </fieldset>`,f=d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="ts-stack">${Ve({icons:e.icons,symbols:e.symbols},typeof t.icon=="string"?t.icon:"",m=>e.edit(g=>Rs(g,n,i,m),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof t.color=="string"?t.color:a?.color})}</div>
    <div class="ts-no-alpha">${ue("Color",typeof t.color=="string"?t.color:void 0,m=>{m!==void 0&&e.edit(g=>Cs(g,n,i,m),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,w=er(e,n,t);return d`${Nc(e,t)}
    ${K(e,"slot","slot","What it does",l,{summary:Yr(s),dot:Dc(t,n)})}
    ${K(e,"where","where","Where",u,{summary:`${X(c)}${t.isVisible===!1?", hidden":""}`,dot:Oc(t)})}
    ${w===void 0?p:K(e,"slot","voice","Voice",d`<fieldset class="me-body me-voice" ?disabled=${e.busy} aria-label="Voice">${w}</fieldset>`,{summary:tr(e,t),dot:Zo(t)})}
    ${K(e,"look","look","Icon and color",f,{summary:r.icon,dot:_c(t)})}
    ${n.list==="anywhere"?K(e,"shows","shows","Shows on",d`<fieldset class="me-body" ?disabled=${e.busy} aria-label="Shows on">${Ac(e,t)}</fieldset>`,{summary:Ic(t),dot:Hc(t)}):p}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this slot from the menu"
        @click=${()=>e.edit(m=>$s(m,n,i))}>${$("delete")}<span>Remove</span></button>
    </div>`}function Bc(e){let n=at(e.document,"quickAction",rr),t=at(e.document,"quickAction",ar);return d`${K(e,"style","style-anywhere","Look",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
      ${cr(e)}
      ${e.devicesLine?.("anywhere")??p}
    </fieldset>`,{summary:dr(e.document),dot:n})}
    ${K(e,"motion","motion-anywhere","Motion",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Motion">
      ${lr(e)}
    </fieldset>`,{summary:ur(e.document),dot:t})}`}function qc(e){let n=at(e.document,"pageSwitcher",pr);return K(e,"style","style-switcher","Look",d`<fieldset class="me-body me-style" ?disabled=${e.busy} aria-label="Look">
    ${hr(e)}
    ${e.devicesLine?.("switcher")??p}
  </fieldset>`,{summary:mr(e.document),dot:n})}function jc(e){let n=Nr(e),t=a=>{e.uiState.set(Dr,a),e.requestUpdate()},i=q("Edit",n,[["domain","By type"],["entity","By entity"]],a=>t(a)),s,o,r=!1;if(n==="domain"){let a=Wr(e),c=Le(a),l=gs(a),u=fs().map(m=>[m.domain,m.label]),f=fr.flatMap(m=>{let g=Le(m);return g===void 0?[]:[{domain:g.domain,label:g.label,icon:g.icon,color:Ot(g.domain).color}]}),w=c?.inheritKey?ys(e.document,a):!1;r=w,o=`By type \xB7 ${c?.label??a}`,s=d`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${gr(e.icons,a,f,u,m=>{e.uiState.set(Or,m),e.requestUpdate()})}
      ${l.length>0?d`<div class="hint ts-under keep">The same menu as ${l.map(m=>m.label).join(", ")}.</div>`:p}
      ${c?.inheritKey?ot("Fill gaps with the All menu",w,m=>e.edit(g=>As(g,a,m)),!1,"Its slots show in places this menu leaves free. They are dashed on the watch."):p}`}else{let a=Ee(e.document),c=Ur(e);o=`By entity \xB7 ${c===void 0?"none yet":be(e.hass,c)}`;let l=u=>{let f=u.entityId.trim();f!==""&&(e.edit(w=>Ds(w,f)),e.uiState.set(mn,f),e.uiState.set(hn,(Number(e.uiState.get(hn)??0)||0)+1),e.requestUpdate())};s=d`<div class="me-entities">
      ${a.length===0?d`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(u=>{let f=u===c;return d`<div class="me-entity ${f?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${f?"true":"false"}
            @click=${()=>{e.uiState.set(mn,u),e.requestUpdate()}}>
            <b>${be(e.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>e.edit(w=>Os(w,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${bt({hass:e.hass},"Add an entity",Er(e.hass,""),l,`me:er:add:${String(e.uiState.get(hn)??0)}`,{clearable:!1})}
      </div>
    </div>`}return K(e,"menu","menu","Which menu",d`<fieldset class="me-body me-pick" ?disabled=${e.busy} aria-label="Which menu">
    ${i}${s}
    ${e.devicesLine?.("entity")??p}
  </fieldset>`,{summary:o,dot:r})}var Fc="Click a slot on the watch to change what it does.";function Kc(e,n){let t=n==="anywhere"?Bc(e):n==="switcher"?qc(e):jc(e);return d`<p class="me-menu-note">${Mr[n]}</p>${t}
    <p class="me-menu-note me-pick-note">${n==="switcher"?nc:Fc}</p>`}var Zr=B`
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
`;var zc=["spring","popIn","fade","none"],Jc=["sectorWedge","auroraWash","radiantBloom","ripplePulse","wakeWave","none"];function He(e,n,t){let i=ce(n).find(s=>s.key===t);return i===void 0?void 0:Q(e,n,i)}function _e(e,n,t,i){let s=ce(n).find(a=>a.key===t),o=He(e,n,t),r=typeof o=="number"&&Number.isFinite(o)?o:typeof s?.default=="number"?s.default:i;return Math.min(s?.max??1/0,Math.max(s?.min??-1/0,r))}function ut(e,n){return He(e,"quickAction",n)===!0}function Gc(e){return typeof e=="string"&&/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?e:"#FFFFFF"}function pt(e){let n=He(e,"quickAction","entranceStyle"),t=He(e,"quickAction","beamStyle");return{glass:ut(e,"showIconBubble"),neon:ut(e,"showNeonOutline"),labels:ut(e,"showContextLabel"),finger:ut(e,"showFingerShadow"),entrance:zc.includes(n)?n:"none",dim:_e(e,"quickAction","backgroundDim",1),beam:Jc.includes(t)?t:"none",beamColor:Gc(He(e,"quickAction","beamColor")),beamIntensity:_e(e,"quickAction","beamIntensity",.5),glow:_e(e,"quickAction","glowIntensity",.5)}}function Yc(e){return{glow:_e(e,"pageSwitcher","glowIntensity",.5),scale:_e(e,"pageSwitcher","selectedScale",1.2)}}var xn="ms:play",Zc=1500;function Xc(e){let n=e.uiState.get(xn);e.uiState.set(xn,{menu:R(e),count:(n?.count??0)+1,at:Date.now()}),e.requestUpdate()}function Qc(e){let n=e.uiState.get(xn);return n===void 0||n.menu!==R(e)||Date.now()-n.at>Zc?"":n.count%2===1?"ms-play-a":"ms-play-b"}function ea(e,n){let t=j(e,n),i=bs(e,n),s=new Set(Ht(e,n));return ze().map(o=>{let r=t.filter(u=>u.position===o),a=r.find(u=>u.isVisible!==!1),c=a===void 0?i.find(u=>u.position===o&&u.isVisible!==!1):void 0,l=a??(c===void 0?r[0]:void 0);return{position:o,own:r,main:l,second:r.find(u=>u!==l),shared:c,free:s.has(o)}})}function ed(e,n){let t=s=>s!==void 0&&s.isVisible!==!1;if(n!==void 0&&t(n)){let s=C(n),o=e.find(r=>r.main!==void 0&&L(C(r.main),s));if(o!==void 0)return{position:o.position,slot:n}}let i=e.flatMap(s=>{let o=t(s.main)?s.main:s.shared;return o===void 0?[]:[{position:s.position,slot:o}]});return i.find(s=>s.position==="topCenter")??i[0]}var b=e=>Math.round(e*100)/100;function Sn(e,n){let t=Tr(e,n);return{...t,px:t.x*e.width,py:t.y*e.height}}function bn(e,n,t,i){return ta(e,n,Sn(e.screen,t),i)}function ta(e,n,t,i){let{width:s,height:o}=e.screen,r=e.scale,a=[`left:${t.x*100}%`,`top:${t.y*100}%`];if(i!==void 0&&a.push(`--c:${i}`),a.push(`--fx:${b((s/2-t.px)*r)}px`,`--fy:${b((o/2-t.py)*r)}px`),n.finger){let c=t.px-s/2,l=t.py-o/2,u=Math.hypot(c,l);u>1&&a.push(`--sx:${b(c/u*5*r)}px`,`--sy:${b(l/u*5*r)}px`)}return a.join(";")}function kn(e,n){return Math.round(n*e.scale)}function td(e,n,t,i,s){let o=Sn(e.screen,t),r=(n.glass?28:25)*(o.y>.5?-1:1),a=(o.py+r)/e.screen.height;return d`<span class="ms-name" aria-hidden="true" style=${`left:${o.x*100}%;top:${b(a*1e4)/100}%;--c:${i}`}>${s}</span>`}function nd(e){let{width:n,height:t}=e,i=n*.08,s=n*.045,o=t*.18,r=(n-i*2-s)/2,a=(t-o-i-s*2)/3,c=[0,1,2,3,4,5].map(l=>{let u=i+l%2*(r+s),f=o+Math.floor(l/2)*(a+s);return M`<rect class=${`ms-tile t${l%4}`} x=${b(u)} y=${b(f)} width=${b(r)} height=${b(a)} rx=${b(n*.06)}></rect>`});return d`<svg class="ms-page" viewBox=${`0 0 ${n} ${t}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${b(i)} y=${b(t*.075)} width=${b(n*.4)} height=${b(t*.045)} rx=${b(t*.0225)}></rect>
    ${c}
  </svg>`}function oe(e,n,t){return M`<filter id=${e} filterUnits="userSpaceOnUse" x="0" y="0" width=${t.width} height=${t.height}>
    <feGaussianBlur stdDeviation=${n}></feGaussianBlur></filter>`}function Xr(e,n,t,i){return M`<radialGradient id=${e}>
    <stop offset="0" stop-color=${n} stop-opacity=${b(t)}></stop>
    <stop offset="0.5" stop-color=${n} stop-opacity=${b(i)}></stop>
    <stop offset="1" stop-color=${n} stop-opacity="0"></stop></radialGradient>`}function id(e,n,t){if(e.beam==="none")return p;let i=e.beamColor,s=e.beamIntensity,o=n.width/2,r=n.height/2,a=t.x-o,c=t.y-r,l=Math.hypot(a,c),u=Math.atan2(c,a),f=(h,x)=>`${b(o+Math.cos(u+h)*x)},${b(r+Math.sin(u+h)*x)}`,w=b(t.x),m=b(t.y),g;switch(e.beam){case"sectorWedge":{let h=Math.PI/4;g=M`${oe("ms-b8",8,n)}${oe("ms-b3",3,n)}
        <polygon points=${`${o},${r} ${f(-h/2,l*1.2)} ${f(h/2,l*1.2)}`} fill=${i} fill-opacity=${b(.2*s)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${o},${r} ${f(-h*.3,l)} ${f(h*.3,l)}`} fill=${i} fill-opacity=${b(.5*s)} filter="url(#ms-b3)"></polygon>`;break}case"auroraWash":g=M`${oe("ms-b7",7,n)}${oe("ms-b10",10,n)}${Xr("ms-wash",i,.35*s,.18*s)}
        <circle cx=${b((o+t.x)/2)} cy=${b((r+t.y)/2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${w} cy=${m} r="40" fill=${i} fill-opacity=${b(.25*s)} filter="url(#ms-b10)"></circle>`;break;case"radiantBloom":g=M`${oe("ms-b4",4,n)}${oe("ms-b5",5,n)}${Xr("ms-bloom",i,.4*s,.15*s)}
        <circle cx=${w} cy=${m} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${w} cy=${m} r="25" fill=${i} fill-opacity=${b(.3*s)} filter="url(#ms-b5)"></circle>`;break;case"ripplePulse":g=M`${oe("ms-b6",6,n)}
        <circle cx=${w} cy=${m} r="30" fill=${i} fill-opacity=${b(.15*s)} filter="url(#ms-b6)"></circle>
        ${[.15,.55].map(h=>M`<circle cx=${w} cy=${m} r=${b((30+h*100)/2)} fill="none" stroke=${i}
          stroke-opacity=${b((1-h)*.45*s)} stroke-width=${b(2-h*1.2)}></circle>`)}`;break;case"wakeWave":g=M`${oe("ms-b4",4,n)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${o} y1=${r} x2=${w} y2=${m}>
          <stop offset="0" stop-color=${i} stop-opacity="0"></stop><stop offset="1" stop-color=${i} stop-opacity=${b(.5*s)}></stop></linearGradient>
        <line x1=${o} y1=${r} x2=${w} y2=${m} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[.35,.6,.85].map(h=>{let x=1-h;return M`<circle cx=${b(o+a*h)} cy=${b(r+c*h)} r=${b((20+x*50)/2)} fill="none" stroke=${i}
            stroke-opacity=${b((1-x)*.5*s)} stroke-width=${b(Math.max(1.5-x*1.2,.3))}></circle>`})}
        <circle cx=${w} cy=${m} r="18" fill=${i} fill-opacity=${b(.25*s)} filter="url(#ms-b4)"></circle>`;break}return M`<g class="ms-beam">${g}</g>`}function sd(e,n){let t=[`ms-enter-${n.entrance}`,n.entrance==="none"?"":Qc(e),n.glass?"ms-glass":"",n.neon?"ms-neon":"",n.finger?"ms-finger":""].filter(s=>s!=="").join(" "),i=[`--ms-veil:${b(n.dim*.85)}`,`--ms-blur:${b(2+n.dim*4)}px`,`--ms-g-r:${b(15*n.glow)}px`,`--ms-g-a:${Math.round(60*n.glow)}%`].join(";");return{classes:t,style:i}}function $n(e,n,t,i,s={}){let{width:o,height:r}=e.screen,a=e.scale,c=Math.min(o,r),l=sd(e,t),u=[`width:${Math.round(o*a)}px;height:${Math.round(r*a)}px;--me-s:${a}`,l.style,s.style??""].filter(w=>w!=="").join(";"),f=d`<div class=${`me-screen ms-screen ${l.classes} ${s.classes??""}`.trim()} role="group" aria-label=${n} style=${u}>
    <div class="ms-backdrop" aria-hidden="true">${nd(e.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${o} ${r}`} aria-hidden="true">
      ${s.beamTo===void 0?p:id(t,e.screen,s.beamTo)}
      <circle cx=${o/2} cy=${r/2} r=${c*ke} class="me-track"></circle>
      ${t.finger?M`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${o/2} cy=${r/2} r=${b(c*.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>`:p}
      <circle cx=${o/2} cy=${r/2} r=${c*.05} class="me-center"></circle>
    </svg>
    ${i}
  </div>`;return io(e.phone,{width:o,height:r},a,f,n,e.icons)}function od(e,n,t,i){let s=pt(e.document),o=ea(e.document,n),r=ed(o,t),a=r===void 0?void 0:C(r.slot),c=t===void 0?void 0:C(t),l=(h,x=ke)=>Je(h,x),u=h=>a!==void 0&&L(C(h),a),f=(h,x,O,S,I)=>{let D=V(h),J=C(h),E=c!==void 0&&L(J,c),re=h.isVisible===!1,In=`${X(x)}: ${ae(T(h))}${re?", hidden":""}`,ma=["me-dot",S,E?"on":"",re?"off":"",u(h)&&S===""?"ms-active":""].filter(fa=>fa!=="").join(" ");return d`<button type="button" class=${ma} style=${bn(e,s,O,D.color)}
      title=${In} aria-label=${In} aria-pressed=${E?"true":"false"} @click=${()=>Se(e,n,J)}>
      ${De(e,D.icon,kn(e,S===""?15:11),D.color)}${I>1?d`<span class="me-count" aria-hidden="true">${I}</span>`:p}</button>`},w=o.map(h=>{let x=l(h.position);if(x===void 0)return p;let O=p,S;if(h.main!==void 0)O=f(h.main,h.position,x,"",h.own.length),h.main.isVisible!==!1&&(S=h.main);else if(h.shared!==void 0){let E=V(h.shared),re=`${X(h.position)}: ${ae(T(h.shared))}, from All`;O=d`<span class=${`me-dot inh${u(h.shared)?" ms-active":""}`} style=${bn(e,s,x,E.color)} title=${re}>
        ${De(e,E.icon,kn(e,13),E.color)}</span>`,S=h.shared}else if(h.free){let E=X(h.position);O=d`<button type="button" class="me-dot free" style=${bn(e,s,x)} ?disabled=${e.busy}
        title=${`Add a slot at ${E}`} aria-label=${`Add a slot at ${E}`}
        @click=${()=>lt(e,n,h.position)}>${$("plus")}</button>`}let I=h.second===void 0?void 0:l(h.position,.2),D=h.second===void 0||I===void 0?p:f(h.second,h.position,I,"two",0),J=s.labels&&S!==void 0?td(e,s,x,V(S).color,de(e,S)):p;return d`${O}${D}${J}`}),m=r===void 0?void 0:l(r.position),g=Sn(e.screen,m??{x:.5,y:.5-ke});return $n(e,`${i} on the watch`,s,w,{beamTo:{x:g.px,y:g.py}})}function na(e){let n=t=>Math.min(1.18,Math.max(.82,t));return{w:n(e.width/198),h:n(e.height/242)}}function Qr(e,n,t){let{width:i,height:s}=e,o=na(e),r=34*o.w,a=i-34*o.w,c=52*o.h,l=s-30*o.h,u=(c+l)/2,f=i/2,w=18*o.w,m=8*o.h,g=[{x:f,y:c-14*o.h},{x:r+w,y:c+m},{x:r,y:u},{x:r+w,y:l-m},{x:f,y:l+8*o.h},{x:a-w,y:l-m},{x:a,y:u},{x:a-w,y:c+m}];if(t<=1)return g[0];let h=[0];for(let S=1;S<=g.length;S++){let I=g[S-1],D=g[S%g.length];h.push(h[S-1]+Math.hypot(D.x-I.x,D.y-I.y))}let x=h[g.length],O=n*x/t%x;for(let S=0;S<g.length;S++){let I=h[S],D=h[S+1];if(O>=I&&O<=D){let J=D>I?(O-I)/(D-I):0,E=g[S],re=g[(S+1)%g.length];return{x:E.x+(re.x-E.x)*J,y:E.y+(re.y-E.y)*J}}}return g[0]}function rd(e){return[...e].slice(0,4).join("").trim()}function ad(e){let n=pt(e.document),t=Yc(e.document),i=e.switcherPages,s=se(e),o=Math.max(0,s===void 0?0:i.findIndex(m=>L(m.id,s.id))),{width:r,height:a}=e.screen,c=m=>({x:m.x/r,y:m.y/a,px:m.x,py:m.y}),l=i.length===0?d`<p class="me-screen-note">No pages in the switcher yet.</p>`:i.map((m,g)=>{let h=c(Qr(e.screen,g,i.length)),x=g===o,O=g===0&&!x,S=Math.round((x?.7:O?.4:.15)*t.glow*100),I=[ta(e,n,h,m.color),`--ms-ga:${S}%`,`--ms-gr:${x?45:30}`,`--ms-k:${x?t.scale:1}`].join(";"),D=["ms-sw",x?"ms-active":"",O?"ms-current":""].filter(E=>E!=="").join(" "),J=m.text===void 0?De(e,m.icon,kn(e,n.glass?18:x?16:14),x&&!n.glass?"white":m.color):d`<span class="ms-sw-text">${rd(m.text)}</span>`;return d`<span class=${D} style=${I} title=${m.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${J}</span>`}),u=i[o],f=u===void 0?p:d`<span class="ms-sw-name" style=${`top:${b(8*na(e.screen).h/a*1e4)/100}%`}>${u.name}</span>`,w=i.length===0?void 0:Qr(e.screen,o,i.length);return $n(e,"Page switcher on the watch",n,d`${l}${f}`,{beamTo:w,classes:"ms-switcher"})}function cd(e){if(R(e)==="switcher")return ad(e);let n=z(e);return n===void 0?$n(e,"Entity quick menu on the watch",pt(e.document),d`<p class="me-screen-note">Add an entity to edit its menu.</p>`):od(e,n,le(e,n),Vr(e,n))}var dd={topLeft:"left",leftCenter:"left",bottomLeft:"left",topRight:"right",rightCenter:"right",bottomRight:"right",topCenter:"top",bottomCenter:"bottom"};function ld(e,n,t,i){let s=C(t),o=i!==void 0&&L(s,C(i)),r=t.isVisible===!1,a=de(e,t),c=`${ae(T(t))}${r?", hidden":""}`;return d`<button type="button" class=${`ms-label${o?" on":""}${r?" off":""}`} data-slot=${s}
    style=${`--k:${V(t).color}`} aria-pressed=${o?"true":"false"}
    @click=${()=>Se(e,n,s)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${a}</b><small>${c}</small></span></button>`}function ud(e,n,t,i){let s=X(t.position),o=t.own.map(r=>ld(e,n,r,i));return t.shared!==void 0&&o.push(d`<span class="ms-label ms-inh" style=${`--k:${V(t.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${de(e,t.shared)}</b><small>From the All menu</small></span></span>`),o.length===0&&t.free&&o.push(d`<button type="button" class="ms-label ms-add" ?disabled=${e.busy} aria-label=${`Add a slot at ${s}`}
      @click=${()=>lt(e,n,t.position)}>${$("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`),d`<div class=${`ms-place ms-at-${t.position} ms-${dd[t.position]??"top"}`} data-place=${t.position}
    role="group" aria-label=${s}>${o}</div>`}function ia(e){let n=cd(e),t=R(e)==="switcher"?void 0:z(e);if(t===void 0)return d`<div class="me-stage-body">${n}</div>`;let i=le(e,t);return d`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${n}</div>
    ${ea(e.document,t).map(s=>ud(e,t,s,i))}
  </div></div>`}var pd=d`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;function sa(e){let n=R(e),t=pt(e.document),i=p;if(n!=="switcher"){let o=z(e),r=o===void 0?[]:Ht(e.document,o),a=o===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place";i=d`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${e.busy||o===void 0||r.length===0}
      title=${a} @click=${()=>{o!==void 0&&lt(e,o)}}>${$("plus")}<span class="word keep">Add</span></button>`}let s=t.entrance==="none"?p:d`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${()=>Xc(e)}>${pd}<span class="word">Play opening</span></button>`;return i===p&&s===p?d``:d`${i}${s}<span class="tb-sep" aria-hidden="true"></span>`}function oa(e){if(R(e)!=="entity")return p;let n=z(e);return n===void 0||le(e,n)===void 0?p:d`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${()=>Oe(e)}>Change the type or entity</button></span>`}var hd={anywhere:{gesture:"hold",open:"Touch and hold an empty spot on any page, slide to a slot, then lift your finger.",use:"Shortcuts you want everywhere, like Assist, a status page or another page."},entity:{gesture:"tile",open:"Touch and hold a tile, slide to a slot, then lift your finger.",use:"Quick controls for that kind of tile, like brightness for a light. Each type has its own menu."},switcher:{gesture:"hold",open:"Open the Anywhere menu and slide to its Pages slot. Then slide to a page and lift your finger.",use:"Jumping straight to any page. It needs a Pages slot in the Anywhere menu. Pick a page in the Pages card to set how it shows here."}};function ra(e){let n=hd[R(e)];return $o({art:n.gesture,label:"How it opens",how:n.open,use:n.use})}var aa=B`
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
`;function Mn(e){if(e.length===0)return"";let n=e.map(i=>Ns(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function ca(e){if(e.ok){if(e.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.`};let t=e.replaced??[];return t.length>0?{kind:"warn",text:`Saved. ${Mn(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${ai}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function pa(){return ko()||qs()}Ro({dirty:pa,drop:()=>{So(),js()}});typeof window<"u"&&window.addEventListener("beforeunload",e=>{pa()&&(e.preventDefault(),e.returnValue="")});var md=15e3,ha=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Tn=ha?"\u2318":"Ctrl+",Pn={min:200,max:720,middleMin:320},Rn={left:280,right:320},Cn="wrist-assistant-panel.menus.columns.v1",fd="button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page",gd=24,da=820;function Ln(e){return Y(e).message}function $e(e){return Y(e).code}function ht(e){let{code:n,message:t}=Y(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}function wd(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function vd(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":Bn(Math.max(0,(Date.now()-n)/1e3))}function yd(e){return e instanceof HTMLElement?Oi(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function bd(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function xd(e){return P(e)?St(e).filter(n=>!Mt(n)&&ls(Be(n))).map(n=>({id:Be(n),name:$t(n)})):[]}var la=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function mt(e){return typeof e=="string"&&e.trim()!==""?e:void 0}var kd="#8E8E93";function En(e){if(!P(e))return[];let n=0;return St(e).filter(t=>!Wi(t)&&!Mt(t)).map(t=>{let i=t.hideFromSwitcher===!0,s=$t(t),o=mt(t.switcherIcon)??mt(Ni(t)[0]?.icon)??(Ui(t)?"bolt.fill":"square.grid.2x2.fill"),r=i?kd:la[n++%la.length],a=mt(t.switcherColor)??r,c=t.switcherDisplayMode==="icon"?void 0:mt(t.switcherText)??s;return{id:Be(t),name:s,icon:o,color:a,...c===void 0?{}:{text:c},hidden:i}})}function ku(e){return En(e).filter(n=>!n.hidden).map(({hidden:n,...t})=>t)}var ua={ok:0,warn:1,err:2};function Sd(e,n){return e===void 0?n:n===void 0?e:{kind:ua[n.kind]>ua[e.kind]?n.kind:e.kind,text:e.text===n.text?e.text:`${e.text} ${n.text}`}}function $d(e){let n=pe(e)??{},t=j(n,{list:"anywhere"}).length,i=Ee(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(t)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var v=class extends An{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new si(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.placesSeq=0;this.menusFacts=new Map;this.linking=!1;this.zoom=Rr();this.columns={...Rn};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Mi(this);this.symbols=new hi(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||(this.load(t,!0),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t),this.loadMenuLinks(t))};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!bd()||this.renderRoot.querySelector("dialog[open]"))return;let s=t.metaKey||t.ctrlKey,o=t.key.toLowerCase();if(s&&!t.altKey&&o==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.devicesMenu!==void 0){t.preventDefault();let r=this.devicesMenu.where==="bar";this.closeDevices(),r&&this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!yd(i[0])){if(s&&!t.altKey&&o==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&o==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!s&&!t.altKey){let r=this.viewHost();r!==void 0&&Oe(r)&&t.preventDefault()}}};this.onStageClick=t=>{let i=t.composedPath(),s=i.indexOf(t.currentTarget);if((s<0?i:i.slice(0,s)).some(a=>typeof a.matches=="function"&&a.matches(fd)))return;let r=this.viewHost();r!==void 0&&Oe(r)};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&this.devicesMenu===void 0)return;let i=t.composedPath(),s=(...o)=>i.some(r=>r instanceof HTMLElement&&o.some(a=>r.classList.contains(a)));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1),this.devicesMenu!==void 0&&this.replaceAsk===void 0&&!s("me-dev-menu","pe-dev-open","tb-more")&&this.closeDevices()};this.addEventListener(yi,this.onScrubStart),this.addEventListener(bi,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return ei(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return bo(this.watches,this.watchId)?"iphone":"watch"}get draft(){let t=this.watchId,i=this.record;if(!(t===void 0||i===void 0)){if(i.revision>0){let s=ee(t);if(s!==void 0)return s;let o=pe(i.document);return o===void 0?void 0:Yt(t,o,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return ee(t)??Zt(t)}}get newWatch(){let t=this.record;return t!==void 0&&t.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return qt(this.watchId)}get pagesDocument(){let t=this.pagesRecord;return this.pagesDraft?.document??(t!==void 0&&t.revision>0?t.document:void 0)}get pages(){return xd(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(ee(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let t=this.pagesDraft;return t!==void 0&&this.pickedSwitcherPage()!==void 0?t:this.draft}pickedSwitcherPage(){return se({uiState:this.uiState,switcherPages:[],switcherRows:En(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=li(Cn,Rn,Pn),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++,this.placesSeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Dn(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=ii(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),Ci(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let r=()=>this.pagesSaveEnded(t);i.then(r,r)}let s=ee(t)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let o=()=>this.saveEnded(t);s.then(o,o)}pagesSaveEnded(t){this.requestUpdate(),!(!this.isConnected||t!==this.watchId)&&(this.loadPages(t),this.flushPending())}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,i=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.closeDevices(),this.menusFacts=new Map,this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(t),this.loadMenuLinks(t),this.load(t,i),this.loadCatalog(t),this.loadHttpLibrary(),this.loadStatusPages(t),this.loadPages(t),this.loadBehavior(t),this.loadVoice(t)}async loadVoice(t){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let o=await _(i,t,"voice");if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=lo(o)}catch{if(s!==this.voiceSeq||t!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let t=this.voiceDocument;return{phrases:t===void 0?void 0:Jt(t),defaults:uo(t,this.catalog)}}async loadCatalog(t){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let o=await _(i,t,"catalog");if(s!==this.catalogSeq||t!==this.watchId)return;this.catalog=Gs(o)}catch(o){if(s!==this.catalogSeq||t!==this.watchId)return;Ft(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let t=this.hass;if(!t)return;let i=++this.httpLibrarySeq;try{let s=await Vn(t);if(i!==this.httpLibrarySeq)return;this.httpLibrary=fi(s)}catch(s){if(i!==this.httpLibrarySeq)return;gi(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(t){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let o=await _(i,t,"status_pages");if(s!==this.statusPagesSeq||t!==this.watchId)return;this.statusPages=Ys(o)}catch(o){if(s!==this.statusPagesSeq||t!==this.watchId)return;Ft(o)&&(this.statusPages=void 0)}}async loadPages(t){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let o=await _(i,t,"pages");if(s!==this.pagesSeq||t!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&P(o.document)&&!(qt(t)?.saving??!1)&&Bs(t,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(t){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let o=await _(i,t,"behavior");if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=o.revision>0&&P(o.document)?o.document:void 0}catch{if(s!==this.behaviorSeq||t!==this.watchId)return;this.behavior=void 0}}async load(t,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await _(s,t,"menus");if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Us(r)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=Ln(r)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let i=this.watchId,s=c=>JSON.stringify(P(c?.document)?c.document[fe]??null:null);i!==void 0&&this.record!==void 0&&s(this.record)!==s(t)&&this.loadMenuLinks(i),this.record=t,i!==void 0&&t.revision<=0&&Zt(i);let o=t.revision>0?pe(t.document):void 0;if(i===void 0||o===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===i&&t.revision>=r.revision&&(this.restartDraft=void 0,(ee(i)?.dirty??!1)||Qe(i));let a=Yt(i,o,t.revision);a.replaced.length>0?this.note={kind:"warn",text:Mn(a.replaced)}:a.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await _n(i,t,"menus");if(s!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||t!==this.watchId)return;this.historyState=$e(o)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;Un(i,t,o=>{s===this.subscribeSeq&&(o.kind==="catalog"?Qs(o,this.catalog)&&this.loadCatalog(t):o.kind==="status_pages"?this.loadStatusPages(t):o.kind==="pages"?this.loadPages(t):o.kind==="behavior"?this.loadBehavior(t):o.kind==="voice"?this.loadVoice(t):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(t,!0))}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Xn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},md))}async poll(){this.pollTimer=void 0;let t=this.hass,i=this.watchId,s=this.record;if(!(!t||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await _(t,i,"menus");if(i!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(t(s.document),this.scrubKey??i);return this.requestUpdate(),o}editPages(t,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let o=this.scrubKey??i,r=s.apply(t(s.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??Di,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let s=Hi(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:wi(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Jt(this.voiceDocument)}}screen(){let t=this.phoneLayout();if(t!==void 0)return no(t);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(yt(i?.screen_size)??vt).screen}phoneLayout(){if(this.device!=="iphone")return;let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return to(eo(t?.screen_size))}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let s=this,o=En(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*zt,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),devicesLine:r=>this.devicesLine(r),linkBadge:r=>this.linkBadge(r),get document(){return t.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(r,a)=>this.draft===t&&this.edit(r,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(t){let i=this.pagesDraft;if(i===void 0||Lt(i.document,t)===void 0)return;let s=this,o=this.memoIcons();return{pageId:t,icons:o,symbols:this.symbols,uiState:this.uiState,get device(){return s.device},get page(){return Lt(i.document,t)??{}},get busy(){return s.saving},edit:(r,a)=>{this.pagesDraft===i&&this.editPages(r,a?.typing===!0?`switcher:${t.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let t=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(t||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,i=this.watchId;this.endScrub();let s=this.draft,o=this.pagesDraft;if(!t||i===void 0||!s||this.saving)return;let r=s.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let c=r?await this.saveMenus(t,i,s,s.revision<=0):void 0,l=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(t,i,o):void 0;i===this.watchId&&(this.note=Sd(c,l))}async saveMenus(t,i,s,o=!1){let r=xo(s,{prepare:_s,save:(c,l)=>Ne(t,i,"menus",c,l).catch(u=>{throw ht(u)}),fetch:async()=>{let c=await _(t,i,"menus").catch(l=>{throw ht(l)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await r.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:$e(c)??"unknown",message:Ln(c)}));return this.saveEnded(i),go(o,a.code,ca(a))}async savePages(t,i,s){let o=Vs(s,{prepare:a=>oo(Ji(a),s.base,this.hass?.states),save:(a,c)=>Ne(t,i,"pages",a,c).catch(l=>{throw ht(l)}),fetch:async()=>{let a=await _(t,i,"pages").catch(c=>{throw ht(c)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:$e(a)??"unknown",message:Ln(a)}));return this.pagesSaveEnded(i),ci(r)}startFresh(){let t=this.watchId;t===void 0||!ni(this.noRecordState())||(ho("menus",t),this.note=void 0,this.requestUpdate())}get linkDevices(){return ts(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get linkKind(){return this.device==="iphone"?"iphone":"watch"}deviceName(t){return this.linkDevices.find(i=>i.ownerId===t)?.name??"the other device"}get devicesOffered(){return this.places!==void 0&&this.linkDevices.length>1&&(this.record?.revision??0)>0&&!this.unsupported}async loadMenuLinks(t){let i=this.hass;if(!i)return;let s=++this.placesSeq,o;try{o=await Hn(i)}catch(c){s===this.placesSeq&&$e(c)==="unknown_command"&&(this.places=void 0);return}if(s!==this.placesSeq||t!==this.watchId||(this.places={pages:P(o?.pages)?o.pages:{},status_pages:P(o?.status_pages)?o.status_pages:{},...P(o?.menus)?{menus:o.menus}:{}},this.devicesMenu===void 0))return;let r=this.linkDevices.filter(c=>c.ownerId!==t),a=await Promise.all(r.map(async c=>{try{return[c.ownerId,is(await _(i,c.ownerId,"menus"))]}catch{return}}));s!==this.placesSeq||t!==this.watchId||(this.menusFacts=new Map(a.filter(c=>c!==void 0)))}openDevices(t){this.topMenuOpen=!1,this.devicesNote=void 0,this.devicesMenu=t,this.watchId!==void 0&&this.loadMenuLinks(this.watchId),this.updateComplete.then(()=>{(t.where==="bar"?this.headBar.root??this.renderRoot:this.renderRoot).querySelector?.(".me-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesMenu=void 0,this.devicesNote=void 0,this.replaceAsk=void 0}devicesBlocked(){if(this.places!==void 0&&!en(this.places))return et;if(this.saving)return"Saving\u2026";if(this.draft?.dirty??!1)return"Save or discard your edits first. A menu goes on another device as it is saved here."}toggleDevice(t,i){i.here||i.stuck!==void 0||(i.on?this.unlinkMenu(t,i.device.ownerId):this.linkMenuTo(t,i.device.ownerId))}async linkMenuTo(t,i,s=!1){let o=this.hass,r=this.watchId;if(!(!o||r===void 0||i===r||this.linking||this.devicesBlocked()!==void 0)){this.linking=!0,this.devicesNote=void 0;try{let a=await On(o,r,[t],[i],s);if(r!==this.watchId)return;let c=this.pagesDocument,l=as(a,i,[],c);this.devicesNote={kind:"ok",text:[`The ${H[t]} is on ${this.deviceName(i)} now.`,l].filter(u=>u!==void 0).join(" ")},this.loadMenuLinks(r),this.load(r,!0)}catch(a){if(r!==this.watchId)return;$e(a)==="unit_taken"&&!s?this.replaceAsk={unit:t,target:i}:this.devicesNote={kind:"err",text:`Not added. ${tn(a)}`}}finally{this.linking=!1}}}async unlinkMenu(t,i){let s=this.hass,o=this.watchId;if(!s||o===void 0||this.linking||this.devicesBlocked()!==void 0)return;this.linking=!0,this.devicesNote=void 0;let r=await No({read:c=>_(s,c,"menus"),save:(c,l,u)=>Ne(s,c,"menus",l,u)},i,t);if(this.linking=!1,o!==this.watchId)return;let a=i===o?`this ${G(this.device)}`:this.deviceName(i);this.devicesNote=r.ok?{kind:"ok",text:`Unlinked ${a}. Its ${H[t]} stays as it is.`}:{kind:"err",text:`Not unlinked. ${tn(Object.assign(new Error(r.message),{code:r.code}))}`},this.loadMenuLinks(o),i===o&&this.load(o,!0)}renderDevicesMenu(t){let i=this.watchId,s=this.draft;if(i===void 0||s===void 0)return p;let o=this.devicesBlocked(),r=Ho({devices:this.linkDevices,document:s.document,here:i,places:this.places,waiting:ss(this.watches,this.menusFacts),pages:this.pages,...this.statusPages===void 0?{}:{statusPages:this.statusPages}},t.where==="card"?[t.unit]:Xt);return Wo({groups:r,hereKind:this.linkKind,...o===void 0?{}:{blocked:o},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:`at-${t.where}`,colorOf:a=>this.colorOf(a),onToggle:(a,c)=>this.toggleDevice(a,c),onUnlinkHere:a=>{this.unlinkMenu(a,i)},onDone:()=>this.closeDevices()})}linkBadge(t){let i=this.watchId;if(!(!this.devicesOffered||i===void 0))return Lo(this.draft?.document,Qt(t),i,this.places,this.linkDevices)}devicesLine(t){let i=this.watchId;if(!this.devicesOffered||i===void 0)return p;let s=Qt(t),o=this.devicesMenu?.where==="card"&&this.devicesMenu.unit===s,r=Ie(this.draft?.document,s,i,this.places),a=this.linkBadge(t)??`This ${G(this.device)} only`;return d`<div class="field me-dev-field"><span>Devices</span>
      <button type="button" class="pe-btn pe-dev-open ${o?"on":""}" aria-expanded=${o?"true":"false"}
        title=${r.length>1?`Pick the devices that share the ${H[s]}`:`Put the ${H[s]} on other devices too`}
        @click=${()=>o?this.closeDevices():this.openDevices({where:"card",unit:s})}>${$("phone")}<span>${a}</span></button>
    </div>
    ${o?this.renderDevicesMenu({where:"card",unit:s}):p}`}renderReplaceAsk(t){let{title:i,body:s}=Io(t.unit,this.deviceName(t.target));return d`<dialog class="pe-ask me-replace-ask" aria-labelledby="me-replace-title"
      @close=${()=>{this.replaceAsk===t&&(this.replaceAsk=void 0)}}>
      <h3 id="me-replace-title">${i}</h3>
      <p>${s}</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${()=>{this.replaceAsk=void 0}}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.linking} @click=${()=>{this.replaceAsk=void 0,this.linkMenuTo(t.unit,t.target,!0)}}>Replace</button>
      </div>
    </dialog>`}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let i=this.hass,s=this.watchId,o=this.record;if(!i||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:t,baseRevision:o.revision};this.restoreAsk=r,Nn(i,s,"menus",t.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:$d(a.document)})},()=>{})}async restore(){let t=this.hass,i=this.watchId,s=this.restoreAsk;if(!t||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await Wn(t,i,"menus",s.entry.revision,s.baseRevision);o={kind:"ok",text:_i(s.entry.updated_at)},i===this.watchId?this.restartDraft={watchId:i,revision:r.revision}:(ee(i)?.dirty??!1)||Qe(i)}catch(r){let a=$e(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:`Not restored. Home Assistant no longer holds menus for this ${G(this.device)}.`}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${mi(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=o,this.load(i,!0))}render(){let t=this.watches,i=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,t):p}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
      ${this.replaceAsk?this.renderReplaceAsk(this.replaceAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=da}renderTopBar(t,i){let s=t!==void 0&&!this.unsupported,o=s&&this.dirty,r=this.shellOwnsWatch;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${$("menu")}</button>`:p}
      ${r?p:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():To(void 0,!1)}>${$("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?p:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?oi({newWatch:this.newWatch,dirty:o,saved:kt(this.record,void 0,this.device),device:this.device}):p}
      ${this.renderSyncPill(s?t:void 0)}
      ${this.renderTopMenu(s?t:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Tn}S). A save reaches the ${G(this.device)} the next time it checks.`:`Nothing to save (${Tn}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${kt(this.record,void 0,this.device)}</span>
        ${vo(fo({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:p}
      ${r?p:d`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():Po(void 0)}>${$("pages")}<span>Pages</span></button>`}
      ${this.barActions}
    </div>`}renderSyncPill(t){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return p;let s=t===void 0?{size:0,limit:1}:It(t.document),o=xt({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState,device:this.device});return d`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(t=this.watches){return ti(t.find(i=>i.owner_watch_id===this.watchId))}opensReady(t=this.watches){return mo(this.noRecordState(t),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(t){let i=this.canStartFresh();if(t===void 0&&!i)return p;let s=this.topMenuOpen,o=t!==void 0&&this.devicesOffered,r=o&&this.devicesMenu?.where==="bar",a=c=>()=>{this.topMenuOpen=!1,c()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{r&&this.closeDevices(),this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${o?d`<button class="row" role="menuitem" title="Pick the devices that share the Anywhere menu and the Entity quick menu"
          @click=${()=>this.openDevices({where:"bar"})}>Devices…</button>`:p}
        ${t?d`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${a(()=>this.discard())}>Discard edits</button>`:p}
        ${i?d`<button class="row" role="menuitem"
          @click=${a(()=>this.startFresh())}>${ft}</button>`:p}
      </div>`:p}
      ${r?this.renderDevicesMenu({where:"bar"}):p}
    </span>`}colorOf(t){return $i(Si(this.owners.length>0?this.owners:this.ownList??[]),t)}renderWatchPicker(t){if(t.length<2)return p;let i=t.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.colorOf(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${$("watch")}</span>`};return d`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(i?.owner_watch_id)}<span class="tb-browse-l">${i?Ue(i,t):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${$("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${t.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${Ue(r,t)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?$("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=da?this.columns:di(this.hostWidth-gd,this.columns,Pn)}renderGutter(t){return d`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();ui(i,{side:t,base:t==="left"?s.left:s.right,limits:Pn,onWidth:o=>{this.columns={...this.columns,[t]:o}},onEnd:()=>wt(Cn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:Rn[t]},wt(Cn,this.columns)}}></div>`}get stageScale(){return this.zoom??Tt(this.narrow||this.stacked)}setZoom(t){this.zoom=t,Cr(t)}renderStage(t,i){let s=i.find(f=>f.owner_watch_id===this.watchId),o=yt(s?.screen_size),r=o??vt,a=t.phone===void 0?r.label:t.phone.model.label,c=[...Fr(t),a],l=this.undoDraft,u=vn(R(t));return d`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${u}>${u}</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Ue(s,i)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${t.phone!==void 0?Kt:o===void 0?`${r.label}, this watch's size is not known`:c.join(" \xB7 ")}><span class="fam">${c.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${Tn}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${$("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${ha?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${$("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(a,t)}
        ${ra(t)}
        ${ia(t)}
        <div class="under"><span class="tail">${Kr(t)}</span>${oa(t)}</div>
      </div>
    </div>`}renderStageTools(t,i){let s=i.phone!==void 0,o=this.stageScale,r=Tt(this.narrow||this.stacked),a=c=>Bi(s?c*zt:c);return d`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${sa(i)}
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${s?Kt:`This watch's screen, ${t}.`}>
        ${$(s?"phone":"watch")}<span class="word keep">${t}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${o<=Rt(o)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(Rt(o))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${a(o)}. Back to fit`}
          title=${`The ${s?"iPhone":"watch"} at ${a(o)} of its own points. Click to fit it again (${a(r)}).`}
          @click=${()=>this.setZoom(void 0)}>${a(o)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${o>=Pt(o)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(Pt(o))}>+</button>
      </span>
    </div>`}renderBody(t){if(t.length===0){let l=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Bt}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this ${G(this.device)}'s menus: ${this.loadError}</span>
        ${l===void 0?p:d`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return d`<div class="pe-empty"><b>${Bt}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:ee(this.watchId),u=this.watchId;return d`<div class="pe-empty"><b>${We("menus",this.device)}</b><span>${Me}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ft}</button>
        ${l?.dirty&&u!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Qe(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=i.revision<=0;return d`${c&&this.barHost===void 0?wo(this.device):p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${qr(o)}
        ${jr(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Jr(o)}
      </div>
    </div>
    ${c?p:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(t,i,s){let o=It(i),r=xt({record:t,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState,device:this.device}),a=this.watchId;return d`${Ti({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Pi({noun:"menus",device:this.device,record:t,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?Ri({noun:"menus",document:i,revision:t.revision,dirty:s,copied:this.rawCopied,onCopy:c=>{Li(c).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(t){let i=this.record,s=vd(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${Qn(t.entry.updated_by,this.device)}${s?` ${s}`:""}, ${wd(t.entry.size)}.</p>
      ${t.summary?d`<p class="pe-muted">${t.summary}</p>`:p}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Zn,qn,jn,Fn,Kn,zn,Jn,Gn,qi,so,yo,B`
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
  `,Zr,aa,yr,Ei,Mo,ds,Uo,ri]}};y([A({attribute:!1})],v.prototype,"hass",2),y([A({attribute:!1})],v.prototype,"owners",2),y([A({attribute:!1})],v.prototype,"ownerId",2),y([A({type:Boolean,reflect:!0})],v.prototype,"narrow",2),y([A({attribute:!1})],v.prototype,"icons",2),y([A({attribute:!1})],v.prototype,"iconsTick",2),y([A({attribute:!1})],v.prototype,"haMenu",2),y([A({attribute:!1})],v.prototype,"onHaMenu",2),y([A({attribute:!1})],v.prototype,"onBack",2),y([A({attribute:!1})],v.prototype,"onPages",2),y([A({attribute:!1})],v.prototype,"barActions",2),y([A({attribute:!1})],v.prototype,"shellOwnsWatch",2),y([A({attribute:!1})],v.prototype,"phones",2),y([A({attribute:!1})],v.prototype,"barHost",2),y([k()],v.prototype,"watchId",2),y([k()],v.prototype,"record",2),y([k()],v.prototype,"unsupported",2),y([k()],v.prototype,"catalog",2),y([k()],v.prototype,"statusPages",2),y([k()],v.prototype,"httpLibrary",2),y([k()],v.prototype,"pagesRecord",2),y([k()],v.prototype,"behavior",2),y([k()],v.prototype,"voiceDocument",2),y([k()],v.prototype,"loading",2),y([k()],v.prototype,"loadError",2),y([k()],v.prototype,"history",2),y([k()],v.prototype,"historyState",2),y([k()],v.prototype,"note",2),y([k()],v.prototype,"restoreAsk",2),y([k()],v.prototype,"restoring",2),y([k()],v.prototype,"historyOpen",2),y([k()],v.prototype,"rawOpen",2),y([k()],v.prototype,"rawCopied",2),y([k()],v.prototype,"ownList",2),y([k()],v.prototype,"topMenuOpen",2),y([k()],v.prototype,"watchMenuOpen",2),y([k()],v.prototype,"places",2),y([k()],v.prototype,"menusFacts",2),y([k()],v.prototype,"devicesMenu",2),y([k()],v.prototype,"devicesNote",2),y([k()],v.prototype,"linking",2),y([k()],v.prototype,"replaceAsk",2),y([k()],v.prototype,"zoom",2),y([k()],v.prototype,"columns",2),y([k()],v.prototype,"hostWidth",2),y([k()],v.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",v);export{uc as a,Zr as b,cd as c,aa as d,Cn as e,xd as f,la as g,kd as h,En as i,ku as j,Sd as k,$d as l,v as m};
