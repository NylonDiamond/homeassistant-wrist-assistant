import{b as pn}from"./chunk-AYWQJGLH.js";import{a as Jn,b as Qn}from"./chunk-S24RRZN7.js";import{A as Gn,B as qn,C as Yn,D as Xn,E as Be,b as Ce,c as Sn,e as In,f as b,g as ae,h as On,i as Me,j as _n,k as An,l as Hn,m as re,n as oe,o as Bn,q as Oe,r as _e,s as Wn,t as Vn,u as Kn,v as Ae,w as He,x as zn,y as Un,z as jn}from"./chunk-ETPZ5XBB.js";import{i as Mt,l as Ot}from"./chunk-YSQKWHDO.js";import{F as Dn,G as ie,H as Ln,I as se,J as Fn,K as Cn,L as Ee,N as En,O as Re,P as Rn,Q as Mn,b as Nn,c as Tn}from"./chunk-V23WEAH4.js";import"./chunk-W2TMKM7H.js";import{d as be}from"./chunk-YATYN5BQ.js";import{a as Vt,b as Kt,c as zt,d as F,e as te,f as Ut,g as Ne,h as jt,i as Gt,j as qt,k as Yt,l as Xt,m as Te,n as De,o as Jt,p as Qt,q as Zt,r as en,s as tn,t as nn}from"./chunk-ENG3PTRM.js";import{a as Bt,b as Se,d as on,m as dn}from"./chunk-6L2H7EP2.js";import{c as Ie,d as Wt}from"./chunk-KWKR4PIP.js";import{a as sn,b as an,c as rn}from"./chunk-SCIFBEDR.js";import"./chunk-JYBFXYBH.js";import"./chunk-R57JT7CT.js";import"./chunk-IHUZHFBU.js";import{Ab as Ct,Fb as Et,Kb as Rt,gb as Dt,jb as Lt,vb as Ft}from"./chunk-TXJ2NDTV.js";import{eb as Tt}from"./chunk-Z6J4KIFF.js";import{A as Fe,b as ne,c as Le,d as cn,e as ln,f as hn,g as un,h as gn,i as mn,j as fn,k as wn,l as kn,m as bn,o as vn,p as yn,q as xn,x as $n,y as Pn}from"./chunk-HBVUW737.js";import{c as _t,d as At,i as Ht}from"./chunk-7ZWIXPGL.js";import"./chunk-2UTLGHRT.js";import"./chunk-OIMRRBL5.js";import"./chunk-YPXTMZX7.js";import{b as St,c as It}from"./chunk-H5CXQ2W6.js";import{e as Nt}from"./chunk-6SB6XCX5.js";import{d as xe,e as Q}from"./chunk-WOZ5FKIE.js";import{b as $e,c as Pe,d as ee}from"./chunk-TZTZAZNB.js";import"./chunk-NXBMAU2L.js";import{g as ve,j as ye,k as ft,l as wt,z as kt}from"./chunk-UIN3ZLOC.js";import{C as mt,q as gt}from"./chunk-YLF7MTFH.js";import{c as Z,d as bt,e as vt,f as yt}from"./chunk-QOMGAXUT.js";import"./chunk-BGKKDBPO.js";import"./chunk-R2ZXRPSJ.js";import{X as f,_ as D,da as lt,ea as ht,la as ut,ma as W,w as ct,x as ke}from"./chunk-MTUTXLNK.js";import"./chunk-C6K36PU4.js";import{e as xt}from"./chunk-MNYSTJKG.js";import"./chunk-RPXG2HBN.js";import{A as $t,wb as Pt}from"./chunk-P7CXJSI7.js";import"./chunk-NH3ZTQ2R.js";import{j as R}from"./chunk-ZEGVU3YJ.js";import{f as Qe}from"./chunk-3KOP5BBD.js";import"./chunk-QVNRXMEY.js";import{a as Ze,c as et,d as _,f as Y,g as ge,h as tt,i as nt,j as it,k as st,l as at}from"./chunk-V6F4RSJC.js";import{H as we,f as pt,g as B}from"./chunk-BZA4I5PG.js";import{$ as me,A as ot,Z as dt,aa as fe,k as rt,l as X,m as A,n as J,q as H}from"./chunk-HOTMV2GM.js";import"./chunk-HV2MFB2X.js";import"./chunk-SJH6SSW7.js";import{Be as G,Cg as Je,b as I,c as y,mh as $}from"./chunk-AKL4BX4E.js";import{dc as q,e as Xe,l as N}from"./chunk-HPMCDO65.js";import"./chunk-CLMBAHSL.js";import{b as j,f as c,i as u,l as Ye}from"./chunk-6ZDBXU6B.js";import{a as m}from"./chunk-LO2NM3CE.js";function Bi(s,o,e){return`${s} ${s===1?o:e}`}function Zn(s,o){let e=new Set(s);return e.has(o)?e.delete(o):e.add(o),e}function ei(s,o,e,t){let n=new Set(s),i=o.indexOf(t),a=e===void 0?-1:o.indexOf(e);if(i<0)return n;if(a<0)return n.add(t),n;for(let r=Math.min(a,i);r<=Math.max(a,i);r++)n.add(o[r]);return n}function ti(s,o){return new Set([...s,...o])}function ni(s,o){let e=new Set(o);return new Set([...s].filter(t=>!e.has(t)))}function ii(s,o){let e=new Set(o);return new Set([...s].filter(t=>e.has(t)))}function P(s){return s.id.toUpperCase()}function de(s,o,e){let n={kind:s[0]?.kind??"pages",items:[],kept:[],devices:[]},i=new Set;for(let a of s){let r=o.filter(p=>a.owners.some(l=>f(l,p.ownerId))).map(p=>p.ownerId),d=r.filter(p=>e(p,a.kind));if(d.length>0){n.kept.push({name:a.name,dirty:d});continue}n.items.push({id:a.id,name:a.name,owners:[...a.owners]});for(let p of r)i.add(p)}return n.devices=o.map(a=>a.ownerId).filter(a=>i.has(a)),n}var V=(s,o)=>s.find(e=>f(e.ownerId,o))?.name??"a device";function We(s,o){let e=s.items.length,t=e===1?"it":"them",n=`Delete ${e} ${b(s.kind,e)}?`,i=s.devices.map(d=>V(o,d)),a=s.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[i.length===0?`${e===1?"It is":"They are"} on no device yet. ${ye}`:`${e===1?"It comes":"They come"} off ${_(i)}, ${a}. ${ye}`];for(let d of s.kept){let p=d.dirty.map(l=>V(o,l));r.push(`${d.name} stays: ${_(p)} ${p.length===1?"has":"have"} unsaved edits.`)}return{title:n,body:r.join(" ")}}async function si(s,o,e,t){let n={kind:o.kind,gone:[],kept:o.kept.map(a=>({...a,dirty:[...a.dirty]})),failed:[],stuck:[],taps:[]},i=new Map;for(let[a,r]of o.items.entries()){t?.(`Deleting ${r.name} (${a+1} of ${o.items.length})\u2026`);let d=await s.delete(o.kind,r.id);if(!d.ok){n.failed.push({name:r.name,text:d.text});continue}n.gone.push(r.name);for(let p of d.reply.link_failures??[]){let l=p.name??V(e,p.owner);n.stuck.includes(l)||n.stuck.push(l)}for(let p of r.owners)i.set(p,[...i.get(p)??[],r.id])}if(o.kind==="pages")for(let[a,r]of i){t?.(`Clearing complication taps on ${V(e,a)}\u2026`);let d=!1;try{d=await s.clearTaps(a,r)}catch{d=!1}d||n.taps.push(V(e,a))}return n}function Ve(s){let o=i=>`${i} ${b(s.kind,i)}`,e=[];s.gone.length>0&&e.push(`Deleted ${s.gone.length===1?s.gone[0]:o(s.gone.length)}.`);let t=e.length>0,n=!1;for(let i of s.kept)n=!0,e.push(`Kept ${i.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let i of s.failed)n=!0,e.push(`Not deleted: ${i.name}. ${i.text}`);return s.stuck.length>0&&(n=!0,e.push(`Could not take ${s.gone.length===1?"it":"them"} off ${_(s.stuck)}.`)),s.taps.length>0&&(n=!0,e.push(`Could not clear the complication taps that opened ${s.gone.length===1?"it":"them"} on ${_(s.taps)}. Change those by hand.`)),!t&&!n?{kind:"ok",text:"Nothing was deleted."}:{kind:n?t?"warn":"err":"ok",text:e.join(" ")}}function ai(s,o){return Bi(o,b(s),b(s,2))}function pe(s,o){return X(s).filter(e=>ot(e,o)&&!dt(s,e,o)).length}function Wi(s){return H(s)?!1:!me(s)||pe(s,"watch")>0||pe(s,"iphone")>0}function ce(s,o){let e=n=>["watch","iphone"].filter(i=>n.some(a=>a.kind===i)),t=e(o.filter(n=>s.some(i=>f(i,n.ownerId))));return t.length>0?t:e(o)}function Ke(s,o){return o!==void 0&&s.includes(o)?o:s[0]??"watch"}var ri=s=>`${s} ${s===1?"tile":"tiles"}`;function oi(s,o,e){let t=new Set(e.map(r=>r.kind)),n=new Set(e.filter(r=>o.some(d=>f(d,r.ownerId))).map(r=>r.kind));if(t.size>1&&n.size===1)return n.has("watch")?"Watch only":N("iPhone only","Phone only");if(H(s))return;let i=pe(s,"watch");if(i>0)return`${ri(i)} off on the watch`;let a=pe(s,"iphone");return a>0?`${ri(a)} off on the ${N("iPhone","phone")}`:me(s)?void 0:N("iPhone arranged differently","Phone arranged differently")}var di="Screens differ";function pi(s,o){return s==="all"||Wi(o)}function ci(){return`Every page is arranged the same on the watch and the ${N("iPhone","phone")}.`}function li(){return`Watch and ${N("iPhone","phone")} can now be arranged apart. Nothing has changed on your devices.`}var hi="wa-pages-two-screens-card-dismissed";function ui(s){if(s!==void 0)return s;try{return globalThis.localStorage}catch{return}}var gi=!1;function mi(s){if(gi)return!0;try{return ui(s)?.getItem(hi)==="1"}catch{return!1}}function fi(s){gi=!0;try{ui(s)?.setItem(hi,"1")}catch{}}function ki(s,o){if(o===s.start)return s;let{ticksBeforePaste:e,ticksHint:t,...n}=s;return o==="shared"?{...n,start:o,owners:[],ticksBeforePaste:{owners:s.owners,...t===void 0?{}:{hint:t}}}:s.start==="shared"&&e!==void 0&&s.owners.length===0?{...n,start:o,owners:e.owners,...e.hint===void 0?{}:{ticksHint:e.hint}}:{...n,start:o,...t===void 0?{}:{ticksHint:t}}}var Vi="dialog.lib-new-page",Ki=new Set(["light","switch","input_boolean","fan","cover","lock","climate","media_player","scene","script"]);function zi(s){let o=new Set;for(let e of Object.keys(s?.states??{})){if(!bi(s,e))continue;let t=be(s,e);t!==void 0&&o.add(t)}return Object.entries(s?.areas??{}).filter(([e])=>o.has(e)).map(([e,t])=>({id:e,name:typeof t?.name=="string"&&t.name.trim()!==""?t.name.trim():e})).sort((e,t)=>e.name.localeCompare(t.name))}function bi(s,o){let e=s?.entities?.[o];return e?.hidden!==!0&&(e?.entity_category??null)===null}function M(s,o){let e={controls:[],more:[]};if(o===void 0)return e;for(let[n,i]of Object.entries(s?.states??{})){if(!bi(s,n)||be(s,n)!==o)continue;let a=i?.attributes?.friendly_name,r=typeof a=="string"&&a.trim()!==""?a.trim():n,d=n.slice(0,n.indexOf("."));(Ki.has(d)?e.controls:e.more).push({entityId:n,name:r})}let t=(n,i)=>n.name.localeCompare(i.name)||n.entityId.localeCompare(i.entityId);return e.controls.sort(t),e.more.sort(t),e}function K(s,o){let e=[...o.controls,...o.more].map(t=>t.entityId);return s.picked===void 0?o.controls.map(t=>t.entityId):e.filter(t=>s.picked.includes(t))}function vi(s,o,e,t){let n=K(s,o),i=t?[...n.filter(d=>d!==e),e]:n.filter(d=>d!==e),{note:a,...r}=s;return{...r,picked:i}}var yi="wa-new-page-devices",ze;function xi(s){try{let o=(s??globalThis.localStorage)?.getItem(yi),e=o?JSON.parse(o):void 0;if(Array.isArray(e))return e.filter(t=>typeof t=="string")}catch{}return ze===void 0?void 0:[...ze]}function $i(s,o){ze=[...s];try{(o??globalThis.localStorage)?.setItem(yi,JSON.stringify(s))}catch{}}function Pi(s,o,e){let t=s.filter(n=>e?.(n.ownerId)!==!0);return o===void 0?t.map(n=>n.ownerId):t.filter(n=>o.some(i=>f(i,n.ownerId))).map(n=>n.ownerId)}var Si="Ticked like your last new page.",Ii="Ticked for the watch you just paired.";function Ue(s,o,e){return{name:s,busy:!1,owners:o,start:"empty",...e===void 0?{}:{ticksHint:e}}}function Ni(s,o,e,t){let n=t?o.filter(i=>f(i.ownerId,e)||s.owners.some(a=>f(a,i.ownerId))).map(i=>i.ownerId):s.owners.filter(i=>!f(i,e));return{...s,owners:n}}function z(s,o){if(s.name.trim()==="")return"Type a name to start.";if(s.start==="room"){if(s.areaId===void 0)return"Pick a room.";if(K(s,M(o.hass,s.areaId)).length===0)return"Tick something in the room."}if(s.start==="page"&&(s.fromPage===void 0||!o.pages.some(e=>f(A(e),s.fromPage))))return"Pick a page to start from.";if(s.start==="map"&&o.mapFloorId===void 0)return o.mapRefusal??"No rooms on the map yet. Draw them on the Home map tab, or scan them with HouseLit on an iPhone Pro or iPad Pro.";if(s.start==="shared"){let e=F(s.shared??"");if(!e.ok)return e.error}}function Ti(s,o,e){if(z(s,o)!==void 0)return;let t=s.name.trim(),n=e.toUpperCase();if(s.start==="map")return{schemaVersion:1,pages:[ee(n,t,o.mapFloorId)]};if(s.start==="shared"){let r=F(s.shared??"");return r.ok?{schemaVersion:1,pages:[we(Gt(r.share,s.sharedPicks??{}),n,t)]}:void 0}if(s.start==="page"){let r=o.pages.find(d=>f(A(d),s.fromPage));return{schemaVersion:1,pages:[we(r,n,t)]}}let i={schemaVersion:1,pages:[B(n,t)]};if(s.start!=="room")return i;let a={states:o.hass?.states??{},...o.hass?.entities===void 0?{}:{entities:o.hass.entities}};for(let r of K(s,M(o.hass,s.areaId)))i=mt(i,n,{kind:"entity",...gt(a,r)},{last:!0}).document;return i}function Ui(s,o,e){let t=z(s,o);if(t!==void 0)return t;let n=s.name.trim(),i=e.filter(r=>s.owners.some(d=>f(d,r.ownerId))),a=i.length===0?"on no device yet. Tick a device any time.":i.length===1?`on ${i[0].name}.`:`on ${i.length} devices.`;if(s.start==="room"){let r=K(s,M(o.hass,s.areaId)).length;return`${n}, ${r} ${r===1?"tile":"tiles"}, ${a}`}if(s.start==="shared"){let r=F(s.shared??""),d=r.ok?Ne(r.share,o.hass?.states??{}).tiles:0;return`${n}, ${d} ${d===1?"tile":"tiles"}, ${a}`}return`${n}, ${s.start==="map"?"a map page":"a page"} ${a}`}var ji={empty:"Empty",room:"From a room",page:"From a page",map:"Home map",shared:"Paste a page"};function wi(s,o){switch(s){case"empty":return"Add tiles yourself.";case"room":return"A tile for each thing in a room you tick.";case"page":return"A copy of a page's tiles, to change on its own.";case"map":return o??"On the iPhone the whole page is your home's live map. The watch shows it as one tile.";case"shared":return"A page someone shared with you."}}function Gi(s){return s==="room"?"home":s==="page"?"duplicate":s==="map"?"place":s==="shared"?"paste":"grid"}function Di(s,o,e,t,n){return c`<label class="np-check" title=${n??u}>
    <input type="checkbox" .checked=${R(s)} ?disabled=${e} @change=${i=>t(i.target.checked)} />
    <span>${o}</span>
  </label>`}function qi(s,o,e){let t=(n,i)=>{let a=o.devices.filter(r=>r.kind===n);return a.length===0?u:c`<div class="np-group" role="group" aria-label=${i}>
      <span class="np-kind">${$(n==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${a.map(r=>{let d=o.locked?.(r.ownerId);return Di(s.owners.some(p=>f(p,r.ownerId)),r.name,s.busy||d!==void 0,p=>e.onDevice(r.ownerId,p),d)})}
    </div>`};return c`<div class="np-devices">${t("watch","Watches")}${t("iphone",N("iPhones","Phones"))}</div>`}function Yi(s,o,e){let t=zi(o.hass);if(t.length===0)return c`<p class="np-none">No room in Home Assistant has anything in it yet. Give your devices an area there first.</p>`;let n=M(o.hass,s.areaId),i=new Set(K(s,n)),a=r=>r.map(d=>Di(i.has(d.entityId),d.name,s.busy,p=>e.onEntity(d.entityId,p),d.entityId));return c`<label class="np-area"><span>Room</span>
      <select ?disabled=${s.busy} @change=${r=>e.onArea(r.target.value)}>
        <option value="" ?selected=${s.areaId===void 0} disabled>Pick a room</option>
        ${t.map(r=>c`<option value=${r.id} ?selected=${r.id===s.areaId}>${r.name}</option>`)}
      </select></label>
    ${s.areaId===void 0?u:c`<div class="np-room">
      ${n.controls.length===0?c`<p class="np-none">Nothing to tap in this room.</p>`:a(n.controls)}
      ${n.more.length===0?u:c`<p class="np-more">More in this room</p>${a(n.more)}`}
    </div>`}`}function Xi(s,o,e){return o.pages.length===0?c`<p class="np-none">Your home has no page to start from yet.</p>`:c`<label class="np-area"><span>Page</span>
    <select ?disabled=${s.busy} @change=${t=>e.onFromPage(t.target.value)}>
      <option value="" ?selected=${s.fromPage===void 0} disabled>Pick a page</option>
      ${o.pages.map(t=>c`<option value=${A(t)} ?selected=${s.fromPage!==void 0&&f(s.fromPage,A(t))}>${J(t)}</option>`)}
    </select></label>`}function Ji(s,o,e,t){let n=s.name===""?s.entityId:`${s.name} (${s.entityId})`;return c`<label class="np-miss" title=${s.entityId}>
    <span class="np-miss-n">${n}</span>
    <select ?disabled=${e.busy} aria-label=${`Use for ${n}`} @change=${i=>t.onSharedPick(s.entityId,i.target.value)}>
      <option value="" ?selected=${o===""}>Leave it (shows as missing)</option>
      ${s.choices.map(i=>c`<option value=${i.entityId} ?selected=${i.entityId===o}>${i.name}</option>`)}
    </select>
  </label>`}function Qi(s,o,e){let t=s.shared??"",n=t.trim()===""?void 0:F(t),i=o.hass?.states??{},a=n?.ok===!0?te(n.share,i):[],r=d=>{let p=d.target,l=p.files?.[0];p.value="",l!==void 0&&l.text().then(h=>e.onShared(h))};return c`<textarea class="np-paste" spellcheck="false" placeholder="Paste the shared page here" aria-label="Shared page text"
      .value=${R(t)} ?disabled=${s.busy} @input=${d=>e.onShared(d.target.value)}></textarea>
    <div class="np-paste-row">
      <label class="lib-new-btn np-file">Open a file…<input type="file" accept=".json,application/json,text/plain" hidden ?disabled=${s.busy} @change=${r} /></label>
      ${n===void 0?c`<span class="np-none">In Pages, a page's ··· has Share page.</span>`:n.ok?c`<span class="np-none">${jt(Ne(n.share,i))}</span>`:c`<span class="np-none np-bad">${n.error}</span>`}
    </div>
    ${a.length===0?u:c`<div class="np-room np-misses">
      ${a.map(d=>Ji(d,s.sharedPicks?.[d.entityId]??"",s,e))}
    </div>`}`}function Li(s,o,e){let t=z(s,o),n=["empty","room","page","shared","map"];return c`<dialog class="new-dialog lib-new lib-new-page" aria-label="New page" @close=${()=>e.onClose()}
    @cancel=${i=>{i.preventDefault(),s.busy||e.onClose()}}>
    <form class="lib-new-form" @submit=${i=>{i.preventDefault(),t===void 0&&!s.busy&&e.onMake()}}>
      <div class="new-head">
        <h2>New page</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${s.busy} @click=${()=>e.onClose()}>${$("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">Name</span></div>
          <input type="text" class="new-name" .value=${R(s.name)} maxlength="80" autofocus aria-label="New page name"
            ?disabled=${s.busy} @input=${i=>e.onName(i.target.value)} />
        </section>
        ${o.devices.length===0?u:c`<section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Show on</span>${s.ticksHint===void 0?u:c`<span class="new-step-hint">${s.ticksHint}</span>`}</div>
          ${qi(s,o,e)}
          ${o.waitOuts??u}
        </section>`}
        <section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Start</span></div>
          <div class="np-starts" role="radiogroup" aria-label="Start">
            ${n.map(i=>{let a=s.start===i,r=i==="map"&&o.mapFloorId===void 0;return c`<button type="button" class="np-start ${a?"on":""}" role="radio" aria-checked=${a?"true":"false"}
                data-start=${i} ?disabled=${s.busy||r} title=${wi(i,o.mapRefusal)} @click=${()=>e.onStart(i)}>
                ${$(Gi(i))}<span class="np-start-t">${ji[i]}${i==="map"?Pt("ALPHA"):u}</span>
                <span class="np-start-n">${wi(i,i==="map"?o.mapRefusal:void 0)}</span>
              </button>`})}
          </div>
          ${s.start==="room"?Yi(s,o,e):s.start==="page"?Xi(s,o,e):s.start==="shared"?Qi(s,o,e):u}
        </section>
        ${s.note===void 0?u:c`<p class="lt-line ${s.note.kind}" role="status">${s.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${Ui(s,o,o.devices)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${s.busy} @click=${()=>e.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${t!==void 0||s.busy} title=${t??"Make the page"}>${s.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function je(s){let o=s?.querySelector?.(Vi);o&&(!o.open&&typeof o.showModal=="function"&&o.showModal(),o.querySelector("input.new-name")?.select())}var Fi=j`
  .lib-new .new-step.np-step { background: none; }
  .np-devices { display: flex; flex-wrap: wrap; gap: 6px 24px; }
  .np-group { display: flex; flex-direction: column; gap: 3px; min-width: 160px; }
  .np-kind { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-kind svg { width: 13px; height: 13px; }
  .np-check { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 2px 0 2px 2px; cursor: pointer; }
  .np-check input { margin: 0; accent-color: var(--wa-accent); }
  .np-starts { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; }
  .np-start {
    display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 8px 9px; text-align: left; cursor: pointer;
    font: inherit; border-radius: 12px; border: 1px solid var(--wa-line); background: var(--wa-raised, var(--wa-card)); color: var(--wa-muted);
  }
  .np-start svg { width: 18px; height: 18px; }
  .np-start:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
  .np-start:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .np-start.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
  .np-start:disabled { opacity: .5; cursor: default; }
  .np-start-t { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .np-start-n { font-size: 10.5px; line-height: 1.3; }
  .np-area { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--wa-muted); }
  .np-area select {
    flex: 1; min-width: 0; height: 30px; padding: 0 8px; border-radius: 9px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
  .np-room { display: flex; flex-direction: column; gap: 1px; max-height: 240px; overflow-y: auto; padding-right: 4px; }
  .np-more { margin: 8px 0 2px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-none { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .np-bad { color: var(--wa-danger, #d33); }
  .np-paste {
    width: 100%; box-sizing: border-box; min-height: 96px; max-height: 200px; resize: vertical; padding: 8px; border-radius: 9px;
    border: 1px solid var(--wa-line-strong); font: 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-ink);
    background: var(--wa-input, var(--wa-field));
  }
  .np-paste-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .np-file { cursor: pointer; display: inline-flex; align-items: center; }
  .np-misses { gap: 6px; }
  .np-miss { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 8px; font-size: 12.5px; }
  .np-miss-n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .np-miss select {
    min-width: 0; height: 28px; padding: 0 6px; border-radius: 9px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
`;var U=200,le=320,Zi=120,es=80,ts=172,ns=116,Ci=190,Ei=320,Ri=6,E=$t.screen;function Mi(s,o,e,t=E){if(H(s))return{top:0,height:t.height};let n=Dt(Lt(s,o),t),i=[...n.tiles,...Et(s,t,{states:o})];if(i.length===0)return{top:0,height:t.height};let r=Ft(s,1,n.topInset,e)!==u?0:Math.max(0,n.topInset+Math.min(...i.map(p=>p.y))-Ri),d=n.topInset+Math.max(...i.map(p=>p.y+p.height))+Ri;return{top:r,height:Math.max(1,d-r)}}var is=2e3,Ge=44,Oi=28,Ai={pages:"wrist-assistant-panel.all-pages.v2",status_pages:"wrist-assistant-panel.all-status-pages.v2"};function C(s){return["watch","iphone"].filter(o=>s.some(e=>e.kind===o))}var qe=new Map;function Hi(s){let o=qe.get(s);if(o!==void 0)return o;let e={view:"cards"};try{let t=window.localStorage.getItem(Ai[s]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return qe.set(s,e),e}function ss(s,o){let e={...Hi(s),...o};qe.set(s,e);try{window.localStorage.setItem(Ai[s],JSON.stringify(e))}catch{}}var O=(s,o="pages")=>(o==="status_pages"?pn(s)?.dirty:on(s)?.dirty)??!1,_i=(s,o)=>`${s}|${o.toUpperCase()}`,g=class extends Ye{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.screensFilter="all";this.cardPicks=new Map;this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new kt(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new dn(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new gn(this);this.tabsMenu=new Rn(this);this.colorsFor=It();this.colorOf=e=>St(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=is)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&(this.view==="board"&&this.focusOwner!==void 0?this.endSelect(!0):this.pruneSelected()),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId);this.openNewPageAsked()}openNewPageAsked(){if(this.embedded||this.kind!=="pages")return;let e=En();if(e===void 0)return;let t=this.lib.readState;if(t==="failed"||t==="unsupported"){Re();return}let n=this.lib.library,i=this.devices.find(a=>f(a.ownerId,e));if(!(n===void 0||i===void 0)){if(Re(),!this.mayMake||this.waiting(n).has(i.ownerId)){this.newPage(i);return}this.pageForm=Ue(this.nextCardName(),[i.ownerId],Ii),this.updateComplete.then(()=>je(this.renderRoot))}}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.pageForm=void 0,this.copyForm=void 0,this.screensFilter="all",this.tabsMenu.toggle(!1),this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return Bn(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===oe?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||Cn(this.kind,this.filterDevice()?.ownerId)?"board":ln(this.kind,Hi(this.kind).view)}get devices(){return Ze(this.owners,this.phones)}waiting(e){let t=new Map;for(let n of this.devices)t.set(n.ownerId,{held:ht(e,n.ownerId,this.kind),free:!1});return st(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,Ee(this.kind,e),this.onFocus?.(e)}setView(e){hn(this.kind,e),ss(this.kind,{view:e}),e==="cards"&&Ee(this.kind,void 0),this.requestUpdate()}pickTab(e){Fn(this.kind,e===ie),this.onFocus?.(e===oe||e===ie?void 0:e),this.pruneSelected(),this.requestUpdate()}currentTab(){return this.filterDevice()?.ownerId??(se(this.kind)?ie:oe)}renderTabs(e,t){let n=this.currentTab(),i=D(e,this.kind);return Dn({tabs:Ln({devices:t,current:n,total:i.length,countOf:a=>W(e,a,this.kind),shelved:i.filter(a=>a.owners.length===0).length}),current:n,open:this.tabsMenu.open,onToggle:this.tabsMenu.toggle,onPick:a=>this.pickTab(a),styleOf:a=>{let r=this.colorOf(a);return r===void 0?u:`--dc:${r}`}})}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},un)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.picksBusy)return;this.newForm=void 0;let i=this.kind;if(O(e.ownerId,i)){this.picksNote={kind:"warn",text:Q(i,e.name)};return}let a=yt(this.owners,this.lib.library,e.ownerId,i);if(!a.go){this.picksNote=a.note===void 0?void 0:{kind:"warn",text:`Not made on ${e.name}. ${a.note}`};return}let r=G(),d=this.nextCardName(),p=i==="status_pages"?ke(d,r):B(r,d);this.picksBusy=!0,this.picksNote=void 0;let l=!1;try{let h=await xe(Se(t),e.ownerId,i,{add:p});l=h.ok&&h.changed,h.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${h.message}`})}catch(h){this.picksNote={kind:"err",text:q(h).message}}await n.refresh(),this.picksBusy=!1,l&&this.onOpenLibrary?.(i,r,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!(this.newForm?.busy||this.pageForm?.busy)){if(this.newForm!==void 0||this.pageForm!==void 0){this.newForm=void 0,this.pageForm=void 0;return}if(this.kind==="pages"){let e=this.lib.library,t=e===void 0?new Set:this.waiting(e),n=xi();this.pageForm=Ue(this.nextCardName(),Pi(this.devices,n,i=>t.has(i)),n===void 0?void 0:Si),this.updateComplete.then(()=>je(this.renderRoot));return}this.newForm={name:this.nextCardName(),busy:!1,preview:C(this.devices)[0]},this.updateComplete.then(()=>an(this.renderRoot))}}pageSheetContext(){let e=this.lib.library,t=this.homeMapDoc(),n=$e(t),i=Pe(t),a=e===void 0?[]:D(e,"pages").map(r=>r.item);return{...this.hassNow===void 0?{}:{hass:this.hassNow},pages:a,...n===void 0?{}:{mapFloorId:n},...i===void 0?{}:{mapRefusal:i}}}async makePage(){let e=this.pageForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.pageSheetContext(),i=z(e,n);if(i!==void 0){this.pageForm={...e,note:{kind:"warn",text:e.name.trim()===""?`Give the ${b(this.kind)} a name.`:i}};return}let a=Ti(e,n,G());if(a===void 0||!bt(this.owners,this.lib.library,e.owners,"pages"))return;let{note:r,...d}=e;this.pageForm={...d,busy:!0};let p=await t.createItem("pages",a);if(!p.ok){this.pageForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}e.start!=="shared"&&$i(e.owners);for(let h of e.owners)await t.pick(h,"pages",p.reply.id,!0);this.pageForm=void 0;let l=this.devices.find(h=>e.owners.some(v=>f(v,h.ownerId)));Fe(l?.kind??C(this.devices)[0]??"watch"),this.onOpenLibrary?.("pages",p.reply.id)}openCopy(e,t=[]){e.kind==="pages"&&(this.copyForm=Jt(e.id,e.name,De(e.owners,this.devices),t),this.updateComplete.then(()=>nn(this.renderRoot)))}openShare(e){if(e.kind!=="pages")return;let t=e.item,n=this.hassNow?.states??{};this.shareForm={name:e.name,text:Kt(t,n),fileName:zt(t),entities:Vt(t,i=>Object.hasOwn(n,i)).length},this.updateComplete.then(()=>Yt(this.renderRoot))}pastedPage(e,t){let n=F(t);if(!n.ok)return{...e,shared:t};let i=this.hassNow?.states??{},a={...Ut(te(n.share,i)),...e.sharedPicks??{}},r=e.name.trim()===""||e.name===this.nextCardName()?J(n.share.page):e.name;return{...e,shared:t,sharedPicks:a,name:r}}copyHolders(e){let t=this.lib.library,n=t===void 0?void 0:D(t,"pages").find(i=>f(i.id,e.itemId));return De(n?.owners??[],this.devices)}async makeCopy(){let e=this.copyForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.copyHolders(e);this.copyForm={...e,busy:!0};let i=await Zt(t,e,n,this.devices);this.copyForm?.itemId===e.itemId&&(this.copyForm=i)}renderCopy(e){let t=this.copyHolders(e);return en(e,t,{onTick:(n,i)=>{this.copyForm!==void 0&&(this.copyForm=Qt(this.copyForm,t,n,i))},onName:n=>{this.copyForm!==void 0&&(this.copyForm={...this.copyForm,copyName:n,named:!0})},onMake:()=>{this.makeCopy()},onOpen:n=>{this.copyForm=void 0,this.onOpenLibrary?.("pages",n)},onClose:()=>{this.copyForm?.busy||(this.copyForm=void 0)}})}renderPageSheet(e,t){let n=this.lib.library,i=n===void 0?new Set:this.waiting(n),a=d=>{this.pageForm=d},r=this.pageSheetContext();return Li(e,{...r,devices:t,locked:d=>{if(!i.has(d))return;let p=t.find(l=>l.ownerId===d);return Y(p?.appVersion,p?.phoneMoves)},waitOuts:n===void 0?u:Z(this.hassNow,this.owners,n,"pages")},{onName:d=>a({...e,name:d}),onDevice:(d,p)=>a(Ni(e,t,d,p)),onStart:d=>a(ki(e,d)),onArea:d=>{let{picked:p,...l}=e;a({...l,areaId:d})},onEntity:(d,p)=>a(vi(e,M(r.hass,e.areaId),d,p)),onFromPage:d=>a({...e,fromPage:d}),onShared:d=>a(this.pastedPage(e,d)),onSharedPick:(d,p)=>a({...e,sharedPicks:{...e.sharedPicks??{},[d]:p}}),onMake:()=>{this.makePage()},onClose:()=>{e.busy||(this.pageForm=void 0)}})}nextCardName(){let e=this.lib.library,t=e===void 0?[]:D(e,this.kind).map(n=>n.item);return this.kind==="status_pages"?ct({schemaVersion:1,statusPages:t}):pt({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=e.name.trim();if(n===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${b(this.kind)} a name.`}};return}let{note:i,...a}=e;this.newForm={...a,busy:!0};let r=G(),d=e.mapPage===!0?$e(this.homeMapDoc()):void 0,p=this.kind==="status_pages"?{schemaVersion:1,statusPages:[ke(n,r)]}:{schemaVersion:1,pages:[d===void 0?B(r,n):ee(r,n,d)]},l=await t.createItem(this.kind,p);if(!l.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${l.text}`}};return}this.newForm=void 0,Fe(e.preview??C(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,l.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,n){let i=this.lib.store;if(i===void 0||n&&!vt(this.owners,this.lib.library,t,e.kind))return;this.dropTickNote(P(e)),this.untickAsk=void 0;let a={item:e.name,device:this.devices.find(k=>k.ownerId===t)?.name??"the device"};if(!n){this.untickAsk=await Wt(this.hassNow,i,t,e.kind,e.id,a);return}let r=P(e);if(!(await Ie(this.hassNow,i,t,e.kind,e.id,!0,a,{onUndone:()=>this.dropTickNote(r)})).ok||e.kind!=="pages")return;let p=await this.readFree(t),l=this.lib.library,h=this.devices.find(k=>k.ownerId===t)?.name;if(!p||l===void 0||h===void 0||W(l,t,"pages")<2)return;let v=at([h]);v!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(r,{kind:"ok",text:v}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let n=P({id:e.itemId}),i=await Ie(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>this.dropTickNote(n)});i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let i=(await Je(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==i&&(this.freeFacts=new Map(this.freeFacts).set(e,i)),i}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,n){let i=this.hassNow,a=this.lib.store;if(i===void 0||a===void 0||this.picksBusy)return;let r=this.kind;if(O(e.ownerId,r)){this.picksNote={kind:"warn",text:Q(r,e.name)};return}let d=this.kindSeq,p="hidden"in t,l=_i(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,p?this.hiddenAsked=new Map(this.hiddenAsked).set(l,t.hidden):n!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:Kn(n,t.id,t.before)});let h=this.orderAsked,v;try{let k=await xe(Se(i),e.ownerId,r,t);k.ok&&this.flashSaved(),k.ok||(v={kind:"err",text:`${p?"Not changed":"Not moved"} on ${e.name}: ${k.message.replace(/\.$/,"")}.`})}catch(k){v={kind:"err",text:q(k).message}}if(await a.refresh(),this.picksBusy=!1,p){let k=new Map(this.hiddenAsked);k.delete(l),this.hiddenAsked=k}else this.orderAsked===h&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=v)}shownNow(){let e=this.lib.library;return e===void 0?[]:this.shownOf(e)}onTab(e){if(this.view==="cards"){let t=this.filterDevice();if(t!==void 0)return _e(e,t,this.kind,this.search).picks.map(n=>n.entry);if(se(this.kind))return Oe(e,this.kind,this.search).filter(n=>n.owners.length===0)}return Oe(e,this.kind,this.search)}shownOf(e){let t=this.onTab(e);return this.kind!=="pages"||this.screensFilter==="all"?t:t.filter(n=>pi(this.screensFilter,n.item))}emptyHere(e){if(this.kind==="pages"&&this.screensFilter!=="all"&&this.search.trim()==="")return ci();if(this.view==="cards"&&this.search.trim()===""){let t=this.filterDevice(),n=b(this.kind,2),i=this.lib.library;if(t!==void 0)return i!==void 0&&this.waiting(i).has(t.ownerId)?ge(n,t.name,t.appVersion,t.phoneMoves):`No ${n} on ${t.name} yet.`;if(se(this.kind))return`Every ${b(this.kind)} is on a device.`}return Be(e,this.search,this.kind)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(P(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=ii(this.selected,this.shownNow().map(P)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let n=e.metaKey||e.ctrlKey;if(!this.selecting&&!n){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!n)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let n=P(e);this.selected=t?ei(this.selected,this.shownNow().map(P),this.anchor,n):Zn(this.selected,n),this.anchor=n,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(P);this.selected=e?ti(this.selected,t):ni(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.bulkBusy!==void 0)return;let i=this.devices,a=de(e,i,O),r=Ve({kind:a.kind,gone:[],kept:a.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=a.kept.length>0?r:void 0,a.items.length===0)return;let d=a.items.length;wt({text:`Deleted ${d===1?a.items[0].name:ai(a.kind,d)}.`,hide:a.items.map(p=>ft(a.kind,p.id)),send:async()=>{let p;try{p=Ve(await si(Bt(t),{...a,kept:[]},i))}catch(l){p={kind:"err",text:q(l).message}}return await n.refresh(),p.kind==="ok"?void 0:p.text}})}renderItemDelete(e,t){return c`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${n=>{n.stopPropagation(),this.itemAsk=P(e)}}>${$("delete")}</button>`}renderItemAsk(e,t,n){let i=de([e],t,O),a=We(i,t),r=()=>{this.itemAsk=void 0},d=()=>{r(),this.deleteEntries([e])},p=n!==void 0&&e.owners.some(h=>f(h,n.ownerId))&&e.owners.some(h=>!f(h,n.ownerId))?n:void 0,l=i.items.length>0;return c`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${h=>h.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${a.body}</span>
      <span class="ap-ask-acts">
        ${l?p===void 0?c`<button type="button" class="ap-ask-btn danger" @click=${d}>Really delete</button>`:c`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${p.name} only`}
              @click=${()=>{r(),this.tick(e,p.ownerId,!1)}}>${$n}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${d}>${Pn}</button>`:u}
        <button type="button" class="ap-ask-btn" @click=${r}>${l?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return c`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,n=this.lib.library,i=this.lib.readState,a=this.filterDevice(),r=b(t,2),d=this.view,p=n===void 0?i==="unsupported"?ve:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:_n(D(n,t).length,t),l=n!==void 0&&i==="failed";return c`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${Me(t)}</h1>
          <p class="ap-lead">${p}</p>
        </div>
        ${e.length===0?u:this.renderNew(a,e)}
      </div>
      ${this.newForm===void 0?u:this.renderNewDialog(this.newForm,e)}
      ${this.pageForm===void 0?u:this.renderPageSheet(this.pageForm,e)}
      ${this.copyForm===void 0?u:this.renderCopy(this.copyForm)}
      ${this.shareForm===void 0?u:qt(this.shareForm,{onSaid:h=>{this.shareForm!==void 0&&(this.shareForm={...this.shareForm,...h===void 0?{}:{said:h}})},onClose:()=>{this.shareForm=void 0}})}
      ${l?c`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:u}
      ${this.renderTwoScreensCard(n)}
      ${n===void 0?u:Z(this.hassNow,this.owners,n,t)}
      <div class="pk-surface pk-page ${d==="board"?"on-board":""}" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(n,a,d)}
          ${d==="cards"&&n!==void 0&&e.length>0?this.renderTabs(n,e):u}
          ${this.selecting&&d!=="board"?this.renderBar(e):u}
        </div>
        <div class="pk-body" id=${d==="cards"?"pk-tabpanel":u} role=${d==="cards"?"tabpanel":u}>
          ${n===void 0?c`<p class="ap-empty">${p}</p>`:d==="cards"?c`${this.renderPicksNote()}${this.renderAll(n,e)}`:a!==void 0?this.renderFocus(n,_e(n,a,t,this.search),e):this.renderBoardAll(n,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${Hn(t,a,this.selecting&&(a===void 0||d==="cards"),d)}</span></div>
      </div>
    </div></div>`}renderTwoScreensCard(e){return this.kind!=="pages"||e===void 0||D(e,"pages").length===0||mi()?u:c`<div class="ap-upgrade" role="note">
      ${$("info")}<span>${li()}</span>
      <button type="button" class="ap-upgrade-x" title="Dismiss" aria-label="Dismiss"
        @click=${()=>{fi(),this.requestUpdate()}}>${$("close")}</button>
    </div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,n=b(this.kind,2),i=this.lib.readState;if(e===void 0){let r=i==="unsupported"?ve:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${n}\u2026`;return c`<p class="ap-empty">${r}</p>`}if(t.length===0)return c`<p class="ap-empty">No device can have ${n}.</p>`;let a=D(e,this.kind).length===0?c`<p class="ap-empty">No ${n} yet.</p>`:this.renderBoardAll(e,t);return c`${this.saved?c`<span class="bd-saved ap-embed-saved" role="status">${$("check")}<span>Saved</span></span>`:u}${Z(this.hassNow,this.owners,e,this.kind)}${a}`}renderAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;let i=this.shownOf(e);if(i.length===0)return c`<p class="ap-empty">${this.emptyHere(t)}</p>`;let a=this.waiting(e);return c`<div class="ap-grid ${this.comparingScreens()?"differ":""}" role="list">${i.map(r=>this.renderCard(e,r,t,a))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||D(e,this.kind).length>0)return;let n=this.mayMake,i=n?void 0:this.filterDevice(),a=this.waiting(e),r=a.size>0;return c`<div class="ap-empty-lib">${Nn(this.kind==="pages"?"pages":"status-pages",{note:c`<p class="ap-empty-note">${An(this.kind,n,i?.name)}</p>
        ${r?c`<p class="ap-empty-wait">${tt(b(this.kind,2),nt(t,a),it(t,a))}</p>`:u}`,actions:n?c`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>New ${b(this.kind)}</span></button>`:i!==void 0?c`<button type="button" class="ap-new-btn" ?disabled=${this.picksBusy||this.lib.library===void 0} @click=${()=>{this.newPage(i)}}>
        ${$("plus")}<span>New ${b(this.kind)}</span></button>`:u})}</div>`}renderHead(e,t,n){let i=this.selecting,a=this.bulkBusy!==void 0,r=b(this.kind,2);return c`<div class="pk-head">
      ${mn(n,d=>this.setView(d),r)}
      ${n==="board"?fn(Le(),d=>{cn(d),this.requestUpdate()}):u}
      ${t===void 0||n==="cards"?c`<button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${b(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${a||e===void 0} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${$("checklist")}<span>Multi select</span></button>`:u}
      ${this.saved?c`<span class="bd-saved" role="status">${$("check")}<span>Saved</span></span>`:u}
      ${this.kind==="pages"&&(t===void 0||n==="cards")?this.renderScreensFilter():u}
      <label class="pk-search">
        ${$("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderScreensFilter(){let e=(t,n,i)=>c`<button type="button" class="ap-filter-opt ${this.screensFilter===t?"on":""}"
      role="radio" aria-checked=${this.screensFilter===t?"true":"false"} data-filter=${t} title=${i}
      @click=${()=>{this.screensFilter=t,this.pruneSelected()}}>${n}</button>`;return c`<span class="ap-filter" role="radiogroup" aria-label="Show">
      ${e("all","All","Every page")}${e("differ",di,`The pages the watch and the ${N("iPhone","phone")} arrange apart, or with a tile off on one`)}
    </span>`}renderNew(e,t){let n=`New ${b(this.kind)}`;if(e!==void 0)return c`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${ae(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy||this.lib.library===void 0} @click=${()=>{this.newPage(e)}}>
          ${$("plus")}<span>${n}</span></button>
      </div>`;let i=this.mayMake,a=this.newForm!==void 0||this.pageForm!==void 0;return c`<div class="ap-new">
      <button type="button" class="ap-new-btn ${a?"on":""}" aria-expanded=${a?"true":"false"}
        ?disabled=${!i||this.newForm?.busy===!0||this.pageForm?.busy===!0}
        title=${i?`Make ${ae(this.kind)} no device has yet`:On(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>${n}</span></button>
    </div>`}renderNewDialog(e,t){let n=Pe(this.homeMapDoc());return sn(this.kind,e,C(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMapPage:i=>{this.newForm={...e,mapPage:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?n===void 0?{}:{refusal:n}:void 0)}homeMapDoc(){return Qe(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,n,i){let a=this.lib.store,r=P(t),d=a?.noteFor(t.kind,t.id),p=d===void 0?this.tickNotes.get(r):{kind:"warn",text:d},l=this.untickAsk,h=l!==void 0&&l.kind===t.kind&&f(l.itemId,t.id)?l:void 0,v=this.hassNow?.user?.is_admin,k=t.kind==="pages"?Tt(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:n,colorOf:this.colorOf,skips:k,...a===void 0?{}:{pending:a.pending},...p===void 0?{}:{note:p.text,noteKind:p.kind},...h===void 0?{}:{ask:{ownerId:h.ownerId,text:h.text,onRemove:()=>{this.untickNow(h)},onCancel:()=>{this.untickAsk=void 0}}},...v===void 0?{}:{admin:v},locked:S=>{let T=lt(e,S,t.kind,t.id);if(T&&O(S,t.kind))return Q(t.kind,n.find(x=>x.ownerId===S)?.name??"This device");if(!T&&i.has(S)){let x=n.find(w=>w.ownerId===S);return Y(x?.appVersion,x?.phoneMoves)}}}}renderCardTicks(e,t,n,i){return At(this.ticksInput(e,t,n,i),(a,r)=>{this.tick(t,a,r)})}renderCard(e,t,n,i){let a=this.selecting,r=P(t),d=a&&this.selected.has(r),p=this.filterDevice()??Ae(t,n),l=this.openTitle(t),h=k=>this.cardClick(k,t),v=!a&&this.itemAsk===r;return c`<div class="ap-card ${a?"picking":""} ${d?"picked":""} ${v?"asking":""}" role="listitem" data-card=${r}
      @click=${k=>{a&&h(k)}}>
      <div class="ap-top">
        ${a?c`<input type="checkbox" class="pk-card-pick" .checked=${R(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${l}
          @click=${k=>{k.stopPropagation(),this.pick(t,k.shiftKey)}} />`:u}
        <button type="button" class="ap-open" title=${l} tabindex=${a?"-1":"0"} @click=${h}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${re(t)}</small>
        </button>
        ${a||t.kind!=="pages"?u:this.renderCopyButton(t)}
        ${a?u:this.renderItemDelete(t,"ap-del")}
      </div>
      ${this.screensLineOf(t,n)===void 0?u:c`<small class="ap-screens">${this.screensLineOf(t,n)}</small>`}
      <div class="ap-thumb-wrap">
        <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${l} style=${this.thumbWellStyle(t,n)} @click=${h}>
          ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderCardPictures(e,t,p,n)}
        </button>
        ${t.kind==="status_pages"?u:this.renderCardScreenIcons(t,n)}
      </div>
      ${this.renderCardTicks(e,t,n,i)}
      ${v?this.renderItemAsk(t,n):u}
    </div>`}screensLineOf(e,t){return e.kind==="pages"?oi(e.item,e.owners,t):void 0}renderCopyButton(e){return c`<button type="button" class="ap-del ap-copy" title=${e.owners.length<2?Te:`Make a copy of ${e.name} for some devices`} aria-label=${`Make a copy of ${e.name}`}
      ?disabled=${e.owners.length<2}
      @click=${t=>{t.stopPropagation(),this.openCopy(e)}}>${$("duplicate")}</button>`}openTitle(e){if(this.selecting){let t=this.selected.has(P(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return He(e.name)}boardColumns(e,t){let n=this.waiting(e);return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:W(e,i.ownerId,this.kind),...n.has(i.ownerId)?{blocked:wn(i.appVersion,Y(i.appVersion,i.phoneMoves))}:{}}))}renderBoardAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;if(t.length===0)return c`<p class="ap-empty">${Be(t,this.search,this.kind)}</p>`;let i=this.waiting(e),a=this.shownOf(e);return this.renderBoardOf(e,t,[{key:"all",rows:a.map(r=>this.boardRow(e,r,t,i)),empty:this.emptyHere(t)}])}renderBoardOf(e,t,n,i){let a=b(this.kind),r=b(this.kind,2);return bn({label:`${Me(this.kind)} on each device`,thing:a.charAt(0).toUpperCase()+a.slice(1),columns:this.boardColumns(e,t),...i===void 0?{}:{focus:i},onFocus:d=>this.setFocus(d),wide:this.roomy.wide,ordered:!0,focusTitle:d=>`See ${d.name}'s ${r} in its order, and drag to change it`,sections:n,...this.embedded?{}:{legend:{tick:"on that device",focus:"in a device's header to see and drag its order",saves:"Ticks save at once, with Undo",...this.kind==="pages"?{eye:"hide but keep its place"}:{}}},...this.selecting&&i===void 0?{pinned:this.renderBar(t)}:{}})}boardRow(e,t,n,i,a){let r=this.ticksInput(e,t,n,i),d=_t(r),p=t.kind==="pages"?t.item:void 0,l=p===void 0?0:X(p).length,h=p!==void 0&&l>0&&(r.skips?.length??0)>=l,v=d.map(w=>{if(!w.on&&!w.busy&&i.has(w.ownerId))return{dashTitle:w.title};let L={chip:{...w,title:kn(w)},onPick:he=>{this.tick(t,w.ownerId,he)}};if(a?.order!==void 0&&w.on&&f(w.ownerId,a.device.ownerId)&&(L.order=a.order.at+1),w.on&&w.device==="watch"&&h?(L.note="shows nothing",L.noteWarn=!0,L.noteTitle=`Every tile on ${t.name} is ${N("iPhone","phone")} only, so ${w.name} shows an empty page.`):w.skips!==void 0&&(L.note=w.skips.text,L.noteTitle=w.skips.title),a?.pick!==void 0&&f(w.ownerId,a.device.ownerId)&&t.kind==="pages"){let he=_i(a.device.ownerId,t.id),ue=this.hiddenAsked.get(he)??a.pick.hidden;L.eye={hidden:ue,busy:this.picksBusy,title:ue?`Show ${t.name} on ${a.device.name} again`:`Hide here: keep ${t.name} on ${a.device.name} without showing it`,onToggle:()=>{this.changePicks(a.device,{id:t.id,hidden:!ue})}}}return L}),k=this.selecting&&a===void 0,S=P(t),T=this.screensLineOf(t,n),x={key:S,name:t.name,detail:T===void 0?re(t):`${re(t)} \xB7 ${T}`,picture:this.rowPictures(t,n,a?.pick!==void 0?a.device:void 0),openTitle:a?.pick!==void 0?`${He(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:w=>{if(a?.pick!==void 0&&!w.metaKey&&!w.ctrlKey){this.open(t);return}this.cardClick(w,t)},cells:v,...a!==void 0&&a.pick===void 0?{dim:!0}:{},...a?.drag===void 0?{}:{drag:a.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}},peek:()=>({picture:t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumbs(e,t,Ae(t,n),n),where:qn(t,n,a?.order===void 0?void 0:{device:a.device,at:a.order.at})})};return k?x.select={picked:this.selected.has(S),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:w=>this.pick(t,w.shiftKey)}:(x.actions=this.renderItemDelete(t,"bd-act danger"),x.more=this.rowMore(t,a),this.itemAsk===S&&(x.under=this.renderItemAsk(t,n,a?.device))),x}rowMore(e,t){let n=[{label:"Open",onPick:()=>this.open(e)}];e.kind==="pages"&&(n.push({label:"Make a copy\u2026",disabled:e.owners.length<2,title:e.owners.length<2?Te:`Make a copy of ${e.name} for some of its devices`,onPick:()=>this.openCopy(e,t===void 0?[]:[t.device.ownerId])}),n.push({label:"Share page\u2026",title:`${e.name} as text, to send to someone else`,onPick:()=>this.openShare(e)}));let i=t?.order;if(t!==void 0&&i!==void 0){let a=i.ids[0],r=d=>{this.changePicks(t.device,{id:e.id,before:d},[...i.ids])};i.at>0&&a!==void 0&&n.push({label:"Move to top",onPick:()=>r(a)}),i.at<i.ids.length-1&&n.push({label:"Move to bottom",onPick:()=>r(null)})}else t===void 0&&n.push({label:"Pick several",title:`Pick several ${b(this.kind,2)} to delete together`,onPick:()=>this.pick(e,!1)});return n}rowPictures(e,t,n){if(e.kind==="status_pages")return this.rowPicture(e,n);let i=C(t),a=i.length===0?["watch"]:i,r=d=>n?.kind===d?n:t.find(p=>p.kind===d&&e.owners.some(l=>f(l,p.ownerId)));return c`<span class="ap-pics">${a.map(d=>this.rowPicture(e,r(d),d))}</span>`}rowPicture(e,t,n){let i=Le()==="compact";if(e.kind==="status_pages")return Sn({page:e.item,hass:this.hassNow,width:i?ne:this.roomy.size(Ge),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let a=this.appVersionOf(t),r=(n??t?.kind)==="iphone",d=i?r?Math.round(ne*Oi/Ge):ne:this.roomy.size(r?Oi:Ge);return Ce({page:e.item,width:d,tick:this.iconsTick,iphone:r,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...a===void 0?{}:{appVersion:a},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...r?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:Xe(this.owners.find(t=>f(t.owner_watch_id,e.ownerId)))}renderFocus(e,t,n){let{device:i}=t,a=this.orderAsked,r=a!==void 0&&a.ownerId===i.ownerId&&a.kind===this.kind?a.ids:void 0,d=Wn(t.picks,r),p=d.map(x=>x.id),l=W(e,i.ownerId,this.kind),h=this.search.trim()===""&&!this.picksBusy,v=this.waiting(e),k=b(this.kind,2),S=d.map((x,w)=>this.boardRow(e,x.entry,n,v,{device:i,pick:x,drag:this.rowDrag(x,w,p,i,h),order:{at:w,ids:h?p:[]}})),T=t.rest.map(x=>this.boardRow(e,x,n,v,{device:i}));return c`${this.renderFocusHead(i,l)}
      ${this.renderPicksNote()}
      ${this.renderBoardOf(e,n,[{key:"on",title:zn(i),count:l,hint:Un(i),rows:S,empty:v.has(i.ownerId)&&this.search.trim()===""?ge(k,i.name,i.appVersion,i.phoneMoves):Xn(i,this.kind,this.search,t.rest.length)},...Yn(l,t.rest.length,this.search)?[{key:"rest",title:jn(i),count:t.rest.length,hint:Gn(i),rows:T,empty:this.search.trim()===""?`Every ${b(this.kind)} in your home is on ${i.name}.`:`No other ${b(this.kind)} has that name.`}]:[]],i.ownerId)}
      <p class="lt-line bd-foot-line">${l} ${l===1?b(this.kind):k} on ${i.name}.</p>`}renderPicksNote(){return this.picksNote===void 0?u:c`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}renderFocusHead(e,t){let n=et(e.kind,e.platform),i=b(this.kind,t);return vn({device:e,color:this.colorOf(e.ownerId),text:`${t} ${i}, in the order the ${n} ${this.kind==="pages"?"shows":"keeps"} them`,...this.onOpenScreen===void 0?{}:{onOwn:a=>this.onOpenScreen?.(e.ownerId,e.kind,a)},onAll:()=>this.setFocus(void 0)})}rowDrag(e,t,n,i,a){let r=this.overId!==void 0&&f(this.overId,e.id)&&this.dragId!==void 0&&!f(this.dragId,e.id),d=p=>{p!==void 0&&this.changePicks(i,{id:e.id,before:p},[...n])};return{on:a,dragging:this.dragId!==void 0&&f(this.dragId,e.id),over:r,below:r&&n.findIndex(p=>f(p,this.dragId))<t,onStart:p=>{a&&(this.dragId=e.id,p.dataTransfer?.setData("text/plain",e.id),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"))},onOver:p=>{this.dragId!==void 0&&(p.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:p=>{p.preventDefault();let l=this.dragId;this.dragId=void 0,this.overId=void 0;let h=l===void 0?void 0:Vn(n,l,e.id);h!==void 0&&this.changePicks(i,h,[...n])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:p=>{!p.altKey||!a||p.key!=="ArrowUp"&&p.key!=="ArrowDown"||(p.preventDefault(),p.key==="ArrowUp"?d(t>0?n[t-1]:void 0):d(t<n.length-1?n[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),n=t.filter(v=>this.selected.has(P(v))),i=n.length,a=this.bulkBusy!==void 0,r=i===0,d=t.length>0&&t.every(v=>this.selected.has(P(v))),p=a?void 0:this.bulkNote,l=b(this.kind),h=b(this.kind,2);return c`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${h}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${ae(this.kind)} to start.`:`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${a||t.length===0}
        title=${d?`Let the ${h} on screen go`:`Pick every ${l} the search has left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${p===void 0?u:c`<span class="pk-bar-said ${p.kind}">${p.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(n,e):c`<button type="button" class="ghost danger small" ?disabled=${a||r}
            title=${`Delete these ${h} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${$("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${a}
        title=${`Stop picking and go back to opening one ${l} at a time`}
        @click=${()=>this.endSelect()}>${$("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let n=de(e,t,O),i=We(n,t);return c`<span class="pk-bar-ask" id="ap-del-ask"><b>${i.title}</b> ${i.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${n.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,n,i=U){let a=fe(t.item,"watch"),r=n===void 0?[]:rt(ut(e,n.ownerId)),d=r.length===0?[a]:r,p=this.hassNow?.states,l=this.icons,h=i/E.width,v=this.thumbHeight(a,i),k=v>le,S=Mi(a,p,l),T=w=>`${Math.round(w*100)/100}px`,x=n?.kind==="watch"?this.appVersionOf(n):void 0;return c`<span class="ap-pic ${k?"cut":""}" style=${`width:${T(i)};height:${T(Math.min(v,le))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${T(-S.top*h)})`}>${Ct({page:a,pages:d,screen:E,scale:h,...p===void 0?{}:{states:p},...l===void 0?{}:{icons:l},...x===void 0?{}:{appVersion:x},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask})}</span>
    </span>`}thumbHeight(e,t){return Mi(e,this.hassNow?.states,this.icons).height*(t/E.width)}comparingScreens(){return this.kind==="pages"&&this.screensFilter==="differ"}cardDrawsBoth(e){return e.length===2&&this.comparingScreens()}cardWatchHeight(e,t){return Math.min(this.thumbHeight(fe(e.item,"watch"),t),le)}thumbWellStyle(e,t){if(e.kind==="status_pages")return u;let n=ce(e.owners,t);return n.length===2&&!this.cardDrawsBoth(n)?`min-height:${Math.round(this.cardWatchHeight(e,U))+20}px`:u}renderCardPictures(e,t,n,i){let a=ce(t.owners,i);if(this.cardDrawsBoth(a))return this.renderThumbs(e,t,n,i,!0);if(Ke(a,this.cardPick(t))==="watch")return this.renderThumb(e,t,n?.kind==="watch"?n:void 0);let r=a.includes("watch")?this.cardWatchHeight(t,U):Ei;return c`<span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,Ci,r)}</span>`}cardPick(e){return this.cardPicks.get(P(e))??this.filterDevice()?.kind}renderCardScreenIcons(e,t){let n=ce(e.owners,t);if(C(t).length<2||this.cardDrawsBoth(n))return u;let i=P(e),a=Ke(n,this.cardPick(e)),r=p=>$(p==="watch"?"watch":"phone"),d=p=>p==="watch"?"watch":N("iPhone","phone");if(n.length<2){let p=a==="watch"?"a":N("an","a");return c`<span class="ap-screen-icons"><span class="ap-screen-icon on ${a}" data-card-screen=${a} title=${`On ${p} ${d(a)} only`}>${r(a)}</span></span>`}return c`<span class="ap-screen-icons" role="group" aria-label="Show this page on">${n.map(p=>c`<button type="button"
      class="ap-screen-icon ${p} ${p===a?"on":""}" data-card-screen=${p} aria-pressed=${p===a?"true":"false"}
      title=${`Show it on the ${d(p)}`} aria-label=${`Show it on the ${d(p)}`}
      @click=${l=>{l.stopPropagation(),this.cardPicks=new Map(this.cardPicks).set(i,p)}}>${r(p)}</button>`)}</span>`}renderPhoneThumb(e,t,n,i){let a=t.find(d=>d.kind==="iphone"&&e.owners.some(p=>f(p,d.ownerId))),r=this.appVersionOf(a);return Ce({page:e.item,width:n,maxHeight:Math.max(1,Math.round(i)),tick:this.iconsTick,iphone:!0,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...r===void 0?{}:{appVersion:r},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,homeMap:this.homeMapDoc()})}renderThumbs(e,t,n,i,a=!1){let r=C(i);if(!r.includes("iphone"))return this.renderThumb(e,t,n);let d=r.includes("watch"),p=a?ts:Zi,l=d?a?ns:es:Ci,h=d?this.cardWatchHeight(t,p):Ei;return c`<span class="ap-pics ap-card-pics ${a?"large":""}">
      ${d?this.renderThumb(e,t,n?.kind==="watch"?n:void 0,p):u}
      <span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,l,h)}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,n=U/E.width,i=d=>`${Math.round(d*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return c`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${i(U)};height:${i(Math.min(E.height*n,le))}`}>
      <span class="ap-pic-in">${t===void 0?u:Mt({page:e.item,hass:t,icons:this.icons??xt,screen:E,scale:n})}</span>
    </span>`}static{this.styles=[Rt,Nt,Ot,Qn,Jn,Ht,In,rn,Fi,Xt,tn,yn,xn,Mn,Tn,j`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    /* A page's two pictures, the watch's and the iPhone's, side by side. */
    .ap-pics { display: inline-flex; align-items: flex-start; gap: 4px; }
    .ap-card-pics { gap: 8px; }
    .ap-pic.ap-pic-phone { box-shadow: none; border-radius: 0; }
    /* Screens differ: cards wide enough for both pictures at a size to read,
       and on a screen narrower than that, one under the other. */
    .ap-grid.differ { grid-template-columns: repeat(auto-fill, minmax(min(336px, 100%), 1fr)); }
    .ap-card-pics.large { flex-wrap: wrap; justify-content: center; max-width: 100%; }
    /* The icons in the corner of a card's picture: which screen it draws. */
    .ap-thumb-wrap { position: relative; }
    .ap-screen-icons {
      position: absolute; top: 6px; right: 6px; z-index: 2; display: inline-flex; gap: 2px; padding: 2px; border-radius: 10px;
      background: color-mix(in srgb, var(--wa-card) 88%, transparent); border: 1px solid var(--wa-line-strong);
    }
    .ap-screen-icon {
      display: inline-grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px;
      background: none; color: var(--wa-muted);
    }
    button.ap-screen-icon { cursor: pointer; }
    button.ap-screen-icon:hover { color: var(--wa-ink); }
    button.ap-screen-icon:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-screen-icon.on { background: var(--wa-field); }
    .ap-screen-icon.on.watch { color: var(--wa-hue-purple); }
    .ap-screen-icon.on.iphone { color: var(--wa-hue-pink); }
    .ap-screen-icon svg.ui-icon { width: 14px; height: 14px; }
    /* The one line about a page's two screens, under its name. */
    .ap-screens { display: block; margin: -2px 0 6px; font-size: 11.5px; color: var(--wa-muted); }
    /* All, or Screens differ. */
    .ap-filter { display: inline-flex; flex: none; padding: 2px; gap: 2px; border-radius: 999px; background: var(--wa-field); border: 1px solid var(--wa-line); }
    .ap-filter-opt {
      font: inherit; font-size: 12px; font-weight: 600; height: 24px; padding: 0 9px; border-radius: 999px; cursor: pointer;
      border: 0; background: transparent; color: var(--wa-muted);
    }
    .ap-filter-opt.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .ap-filter-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one card after the update, over the list until dismissed. */
    .ap-upgrade {
      display: flex; align-items: center; gap: 10px; margin: 0 0 12px; padding: 10px 14px; border-radius: var(--wa-r-md);
      font-size: 13px; line-height: 1.4; color: var(--wa-ink);
      background: var(--wa-card); border: 1px solid var(--wa-line); box-shadow: var(--wa-shadow-card, none);
    }
    .ap-upgrade > svg { width: 16px; height: 16px; flex: none; color: var(--wa-accent); }
    .ap-upgrade > span { flex: 1; min-width: 0; }
    .ap-upgrade-x {
      display: inline-flex; align-items: center; justify-content: center; flex: none; width: 26px; height: 26px; border-radius: 7px;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted); cursor: pointer;
    }
    .ap-upgrade-x:hover { background: var(--wa-hover); color: var(--wa-ink); }
    .ap-upgrade-x:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-upgrade-x svg { width: 13px; height: 13px; }
    /* Make a copy, beside Delete: the same small button, not red. */
    .ap-del.ap-copy:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }
    .ap-card .ap-del.ap-copy:disabled { opacity: .35; }
    :host([embedded]) { position: relative; }
    /* On the board the device heads are what stays on screen, right under
       the tab bar, so the toolbar scrolls away (\`.bd-pin\`). */
    .ap-page { --bd-pin-top: calc(-1 * var(--ap-top, 0px)); }
    .pk-surface.pk-page.on-board > .pk-pin { position: static; }
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. On All it opens the New dialog (new-dialog.ts). */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 999px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover:not(:disabled) { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn:disabled { opacity: .45; cursor: default; }
    .ap-new-btn svg { width: 16px; height: 16px; }
    /* An empty library: how a page works, centered, with New page. */
    .ap-empty-lib { padding: 24px 16px 32px; }
    .ap-empty-lib .ap-empty-note, .ap-empty-lib .ap-empty-wait { margin: 0 0 6px; font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); }

    /* A status page's picture: the watch's black screen, one screen tall. */
    .ap-pic-status .sp-screen { pointer-events: none; }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      height: 28px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-card); color: var(--wa-ink); cursor: pointer; font-weight: 600;
    }
    .pk-pick-btn:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-pick-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn:disabled { opacity: .45; cursor: default; }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: transparent; background: var(--wa-seg-on); color: var(--wa-ink); }

    /* The panel's small buttons (form-styles.ts), for the bar. */
    button.small {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 999px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.small:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.small:disabled { opacity: .45; cursor: default; }
    button.small > svg { width: 13px; height: 13px; flex: none; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }

    /* The bar under the tabs while cards are picked, the Complications
       list's. */
    .pk-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; flex: none;
      padding: 8px 18px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-bar-count { font-size: 12px; color: var(--wa-muted); min-width: 90px; }
    .pk-bar-said { min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-said.ok { color: var(--wa-ok, var(--wa-ink)); }
    .pk-bar-said.warn, .pk-bar-said.err { color: var(--wa-need); }
    .pk-bar-ask { flex: 1 1 260px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-ask b { font-weight: 600; }
    .pk-bar-gap { flex: 1; min-width: 0; }
    .pk-bar button.ghost {
      font-size: 12.5px; min-height: 28px; padding: 0 10px; border-radius: 999px;
      border-color: var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    .pk-bar button.ghost:hover:not(:disabled), .pk-bar button.ghost.on { border-color: var(--wa-line-strong); background: var(--wa-card); }
    .pk-bar button.ghost.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel));
    }
    .pk-bar button.ghost.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color, #b42318) 18%, var(--wa-panel));
    }
    .pk-bar button.ghost svg { width: 14px; height: 14px; color: var(--wa-muted); }
    .pk-bar button.ghost.danger svg { color: inherit; }
    .pk-bar-done { margin-left: 4px; }
    .pk-bar-done svg { width: 14px; height: 14px; }
    /* A card's tick while picking: a box, not the panel's switch. */
    input.pk-card-pick {
      appearance: none; -webkit-appearance: none; position: relative; flex: none; margin: 0; cursor: pointer;
      width: 17px; height: 17px; border-radius: 7px; border: 0;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-line-strong);
    }
    input.pk-card-pick::after {
      content: ""; position: absolute; top: 2px; left: 6px; width: 4px; height: 8.5px; opacity: 0;
      border: solid var(--wa-primary-ink, #fff); border-width: 0 2px 2px 0;
      transform: rotate(45deg); transition: opacity .1s ease-out;
    }
    input.pk-card-pick:checked { background: var(--wa-accent); box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:checked::after { opacity: 1; }
    input.pk-card-pick:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input.pk-card-pick:disabled { opacity: .45; cursor: default; }

    /* The page alone in a plain outline: no case, no clock, no page dots,
       no fold line. */
    .ap-pic {
      position: relative; display: block; max-width: 100%; overflow: hidden; line-height: 0; pointer-events: none;
      border-radius: 10px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .ap-pic-in { display: block; }
    .ap-pic .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
    .ap-pic .wa-watch::before, .ap-pic .wa-watch::after { display: none; }
    .ap-pic .wa-watch > .wp-screen { border-radius: 0; }
    .ap-pic :is(.wp-clock, .wp-pages, .wp-fold) { display: none; }
    /* A page taller than the picture fades out at its foot. */
    .ap-pic.cut::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .75));
    }
    /* Picking: every click on the card picks it, and a picked card wears
       the Complications card's ink ring. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-ink); }
    /* A phone: the bar folds with the head (\`listTabStyles\`). */
    @media (max-width: 640px) {
      .pk-bar { padding: 8px 10px; }
    }
  `]}};m([I({attribute:!1})],g.prototype,"kind",2),m([I({attribute:!1})],g.prototype,"owners",2),m([I({attribute:!1})],g.prototype,"ownersReady",2),m([I({attribute:!1})],g.prototype,"phones",2),m([I({attribute:!1})],g.prototype,"icons",2),m([I({attribute:!1})],g.prototype,"iconsTick",2),m([I({attribute:!1})],g.prototype,"onOpenLibrary",2),m([I({attribute:!1})],g.prototype,"focusOwner",2),m([I({attribute:!1})],g.prototype,"onFocus",2),m([I({attribute:!1})],g.prototype,"onOpenScreen",2),m([I({type:Boolean,reflect:!0})],g.prototype,"embedded",2),m([I({attribute:!1})],g.prototype,"searchText",2),m([y()],g.prototype,"search",2),m([y()],g.prototype,"newForm",2),m([y()],g.prototype,"pageForm",2),m([y()],g.prototype,"copyForm",2),m([y()],g.prototype,"shareForm",2),m([y()],g.prototype,"screensFilter",2),m([y()],g.prototype,"cardPicks",2),m([y()],g.prototype,"selecting",2),m([y()],g.prototype,"selected",2),m([y()],g.prototype,"asking",2),m([y()],g.prototype,"bulkBusy",2),m([y()],g.prototype,"itemAsk",2),m([y()],g.prototype,"bulkNote",2),m([y()],g.prototype,"tickNotes",2),m([y()],g.prototype,"untickAsk",2),m([y()],g.prototype,"picksBusy",2),m([y()],g.prototype,"picksNote",2),m([y()],g.prototype,"orderAsked",2),m([y()],g.prototype,"hiddenAsked",2),m([y()],g.prototype,"dragId",2),m([y()],g.prototype,"overId",2),m([y()],g.prototype,"freeFacts",2),m([y()],g.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",g);export{g as WaAllPages,Mi as pageCrop};
