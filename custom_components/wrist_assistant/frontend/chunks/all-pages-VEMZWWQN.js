import{b as Et}from"./chunk-3DPH2O63.js";import{a as wn,b as kn}from"./chunk-AB3EFZNH.js";import{A as un,B as mn,C as gn,D as fn,E as Se,b as ye,c as Yt,e as Jt,f as v,g as Q,h as Qt,i as xe,j as Zt,k as en,l as tn,m as Z,n as nn,o as sn,q as an,r as rn,s as on,t as dn,u as pn,v as $e,w as Pe,x as cn,y as ln,z as hn}from"./chunk-3LEZW7NO.js";import{i as gt,l as ft}from"./chunk-SYPGAI2D.js";import{d as ce}from"./chunk-VRYUIFUJ.js";import{b as me,c as ge,d as Y,i as we,j as ke,k as $t,l as Pt,m as St,n as It,o as Nt,p as Tt}from"./chunk-UGBKRODN.js";import{a as yt,b as ue,d as Ft,m as Rt}from"./chunk-CWUL7KJL.js";import{c as fe,d as xt}from"./chunk-3MZHZETQ.js";import{a as Dt,b as Lt,c as Ct}from"./chunk-7EELCKOF.js";import"./chunk-PZ7S54GJ.js";import"./chunk-6RX27CR5.js";import{Bb as ut,Gb as mt,cb as pt,fb as ct,rb as lt,wb as ht}from"./chunk-B63ZAKYH.js";import{db as dt}from"./chunk-VADGCSAK.js";import{A as ve,b as J,c as be,d as Ot,e as Mt,f as _t,g as At,h as Bt,i as Ht,j as Wt,k as Vt,l as Kt,m as zt,o as Ut,p as jt,q as qt,x as Gt,y as Xt}from"./chunk-HENM7OS7.js";import{a as le,b as at,c as rt,p as wt,s as kt,t as bt,y as vt}from"./chunk-RMYFK6FU.js";import"./chunk-KX7L4BU4.js";import"./chunk-HIB22QHR.js";import"./chunk-BVCT4SXC.js";import{b as it,c as st}from"./chunk-HG4FKA45.js";import{e as ot}from"./chunk-YMCTY5XD.js";import"./chunk-RYWHRF2L.js";import"./chunk-LJUPY5FG.js";import{p as re}from"./chunk-MDGPCNEL.js";import{C as Ze,q as Qe}from"./chunk-GMCHCVFA.js";import"./chunk-ORO4TUMU.js";import"./chunk-C6K36PU4.js";import{d as et}from"./chunk-2KYVWBCA.js";import{vb as nt,z as tt}from"./chunk-IIIRUKZ2.js";import"./chunk-M2DPUBED.js";import{j as E}from"./chunk-TOKIRHDQ.js";import{g as Ee}from"./chunk-VUJSMYWC.js";import"./chunk-4ILUENBV.js";import"./chunk-S7Q3KOQT.js";import"./chunk-PWVBP3GH.js";import{b as I,c as y,nh as $,ze as z,zg as Re}from"./chunk-2VY3ANWT.js";import{d as he,e as X}from"./chunk-L5KI3IZL.js";import{X as f,_ as D,da as Xe,ea as Ye,la as Je,ma as G,w as Ge,x as pe}from"./chunk-5LB7PZLF.js";import{a as Oe,c as Me,d as O,f as j,g as _e,h as Ae,i as Be,j as He,k as We}from"./chunk-ZYSWWJNQ.js";import{H as qe,f as je,g as A}from"./chunk-KXNSKFVY.js";import{$ as oe,A as ze,Z as Ue,aa as de,k as Ve,l as q,m as M,n as Ke,q as _}from"./chunk-TCVAOGAG.js";import{lb as U}from"./chunk-Y7CHJ2K5.js";import{b as K,f as l,i as u,l as Fe}from"./chunk-6ZDBXU6B.js";import{a as g}from"./chunk-LO2NM3CE.js";function ai(a,o,e){return`${a} ${a===1?o:e}`}function bn(a,o){let e=new Set(a);return e.has(o)?e.delete(o):e.add(o),e}function vn(a,o,e,t){let n=new Set(a),i=o.indexOf(t),s=e===void 0?-1:o.indexOf(e);if(i<0)return n;if(s<0)return n.add(t),n;for(let r=Math.min(s,i);r<=Math.max(s,i);r++)n.add(o[r]);return n}function yn(a,o){return new Set([...a,...o])}function xn(a,o){let e=new Set(o);return new Set([...a].filter(t=>!e.has(t)))}function $n(a,o){let e=new Set(o);return new Set([...a].filter(t=>e.has(t)))}function P(a){return a.id.toUpperCase()}function ee(a,o,e){let n={kind:a[0]?.kind??"pages",items:[],kept:[],devices:[]},i=new Set;for(let s of a){let r=o.filter(p=>s.owners.some(c=>f(c,p.ownerId))).map(p=>p.ownerId),d=r.filter(p=>e(p,s.kind));if(d.length>0){n.kept.push({name:s.name,dirty:d});continue}n.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let p of r)i.add(p)}return n.devices=o.map(s=>s.ownerId).filter(s=>i.has(s)),n}var B=(a,o)=>a.find(e=>f(e.ownerId,o))?.name??"a device";function Ie(a,o){let e=a.items.length,t=e===1?"it":"them",n=`Delete ${e} ${v(a.kind,e)}?`,i=a.devices.map(d=>B(o,d)),s=a.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[i.length===0?`${e===1?"It is":"They are"} on no device yet. ${le}`:`${e===1?"It comes":"They come"} off ${O(i)}, ${s}. ${le}`];for(let d of a.kept){let p=d.dirty.map(c=>B(o,c));r.push(`${d.name} stays: ${O(p)} ${p.length===1?"has":"have"} unsaved edits.`)}return{title:n,body:r.join(" ")}}async function Pn(a,o,e,t){let n={kind:o.kind,gone:[],kept:o.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},i=new Map;for(let[s,r]of o.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${o.items.length})\u2026`);let d=await a.delete(o.kind,r.id);if(!d.ok){n.failed.push({name:r.name,text:d.text});continue}n.gone.push(r.name);for(let p of d.reply.link_failures??[]){let c=p.name??B(e,p.owner);n.stuck.includes(c)||n.stuck.push(c)}for(let p of r.owners)i.set(p,[...i.get(p)??[],r.id])}if(o.kind==="pages")for(let[s,r]of i){t?.(`Clearing complication taps on ${B(e,s)}\u2026`);let d=!1;try{d=await a.clearTaps(s,r)}catch{d=!1}d||n.taps.push(B(e,s))}return n}function Ne(a){let o=i=>`${i} ${v(a.kind,i)}`,e=[];a.gone.length>0&&e.push(`Deleted ${a.gone.length===1?a.gone[0]:o(a.gone.length)}.`);let t=e.length>0,n=!1;for(let i of a.kept)n=!0,e.push(`Kept ${i.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let i of a.failed)n=!0,e.push(`Not deleted: ${i.name}. ${i.text}`);return a.stuck.length>0&&(n=!0,e.push(`Could not take ${a.gone.length===1?"it":"them"} off ${O(a.stuck)}.`)),a.taps.length>0&&(n=!0,e.push(`Could not clear the complication taps that opened ${a.gone.length===1?"it":"them"} on ${O(a.taps)}. Change those by hand.`)),!t&&!n?{kind:"ok",text:"Nothing was deleted."}:{kind:n?t?"warn":"err":"ok",text:e.join(" ")}}function Sn(a,o){return ai(o,v(a),v(a,2))}function te(a,o){return q(a).filter(e=>ze(e,o)&&!Ue(a,e,o)).length}function ri(a){return _(a)?!1:!oe(a)||te(a,"watch")>0||te(a,"iphone")>0}function ne(a,o){let e=n=>["watch","iphone"].filter(i=>n.some(s=>s.kind===i)),t=e(o.filter(n=>a.some(i=>f(i,n.ownerId))));return t.length>0?t:e(o)}function Te(a,o){return o!==void 0&&a.includes(o)?o:a[0]??"watch"}var In=a=>`${a} ${a===1?"tile":"tiles"}`;function Nn(a,o,e){let t=new Set(e.map(r=>r.kind)),n=new Set(e.filter(r=>o.some(d=>f(d,r.ownerId))).map(r=>r.kind));if(t.size>1&&n.size===1)return n.has("watch")?"Watch only":"iPhone only";if(_(a))return;let i=te(a,"watch");if(i>0)return`${In(i)} off on the watch`;let s=te(a,"iphone");return s>0?`${In(s)} off on the iPhone`:oe(a)?void 0:"iPhone arranged differently"}var Tn="Screens differ";function Dn(a,o){return a==="all"||ri(o)}var Ln="Every page is arranged the same on the watch and the iPhone.",Cn="Watch and iPhone can now be arranged apart. Nothing has changed on your devices.",Fn="wa-pages-two-screens-card-dismissed";function Rn(a){if(a!==void 0)return a;try{return globalThis.localStorage}catch{return}}var En=!1;function On(a){if(En)return!0;try{return Rn(a)?.getItem(Fn)==="1"}catch{return!1}}function Mn(a){En=!0;try{Rn(a)?.setItem(Fn,"1")}catch{}}var oi="dialog.lib-new-page",di=new Set(["light","switch","input_boolean","fan","cover","lock","climate","media_player","scene","script"]);function pi(a){let o=new Set;for(let e of Object.keys(a?.states??{})){if(!An(a,e))continue;let t=ce(a,e);t!==void 0&&o.add(t)}return Object.entries(a?.areas??{}).filter(([e])=>o.has(e)).map(([e,t])=>({id:e,name:typeof t?.name=="string"&&t.name.trim()!==""?t.name.trim():e})).sort((e,t)=>e.name.localeCompare(t.name))}function An(a,o){let e=a?.entities?.[o];return e?.hidden!==!0&&(e?.entity_category??null)===null}function F(a,o){let e={controls:[],more:[]};if(o===void 0)return e;for(let[n,i]of Object.entries(a?.states??{})){if(!An(a,n)||ce(a,n)!==o)continue;let s=i?.attributes?.friendly_name,r=typeof s=="string"&&s.trim()!==""?s.trim():n,d=n.slice(0,n.indexOf("."));(di.has(d)?e.controls:e.more).push({entityId:n,name:r})}let t=(n,i)=>n.name.localeCompare(i.name)||n.entityId.localeCompare(i.entityId);return e.controls.sort(t),e.more.sort(t),e}function H(a,o){let e=[...o.controls,...o.more].map(t=>t.entityId);return a.picked===void 0?o.controls.map(t=>t.entityId):e.filter(t=>a.picked.includes(t))}function Bn(a,o,e,t){let n=H(a,o),i=t?[...n.filter(d=>d!==e),e]:n.filter(d=>d!==e),{note:s,...r}=a;return{...r,picked:i}}var Hn="wa-new-page-devices",De;function Wn(a){try{let o=(a??globalThis.localStorage)?.getItem(Hn),e=o?JSON.parse(o):void 0;if(Array.isArray(e))return e.filter(t=>typeof t=="string")}catch{}return De===void 0?void 0:[...De]}function Vn(a,o){De=[...a];try{(o??globalThis.localStorage)?.setItem(Hn,JSON.stringify(a))}catch{}}function Kn(a,o,e){let t=a.filter(n=>e?.(n.ownerId)!==!0);return o===void 0?t.map(n=>n.ownerId):t.filter(n=>o.some(i=>f(i,n.ownerId))).map(n=>n.ownerId)}function zn(a,o){return{name:a,busy:!1,owners:o,start:"empty"}}function Un(a,o,e,t){let n=t?o.filter(i=>f(i.ownerId,e)||a.owners.some(s=>f(s,i.ownerId))).map(i=>i.ownerId):a.owners.filter(i=>!f(i,e));return{...a,owners:n}}function W(a,o){if(a.name.trim()==="")return"Type a name to start.";if(a.start==="room"){if(a.areaId===void 0)return"Pick a room.";if(H(a,F(o.hass,a.areaId)).length===0)return"Tick something in the room."}if(a.start==="page"&&(a.fromPage===void 0||!o.pages.some(e=>f(M(e),a.fromPage))))return"Pick a page to start from.";if(a.start==="map"&&o.mapFloorId===void 0)return o.mapRefusal??"Scan a room in the iPhone app first."}function jn(a,o,e){if(W(a,o)!==void 0)return;let t=a.name.trim(),n=e.toUpperCase();if(a.start==="map")return{schemaVersion:1,pages:[Y(n,t,o.mapFloorId)]};if(a.start==="page"){let r=o.pages.find(d=>f(M(d),a.fromPage));return{schemaVersion:1,pages:[qe(r,n,t)]}}let i={schemaVersion:1,pages:[A(n,t)]};if(a.start!=="room")return i;let s={states:o.hass?.states??{},...o.hass?.entities===void 0?{}:{entities:o.hass.entities}};for(let r of H(a,F(o.hass,a.areaId)))i=Ze(i,n,{kind:"entity",...Qe(s,r)},{last:!0}).document;return i}function ci(a,o,e){let t=W(a,o);if(t!==void 0)return t;let n=a.name.trim(),i=e.filter(r=>a.owners.some(d=>f(d,r.ownerId))),s=i.length===0?"on no device yet. Tick a device any time.":i.length===1?`on ${i[0].name}.`:`on ${i.length} devices.`;if(a.start==="room"){let r=H(a,F(o.hass,a.areaId)).length;return`${n}, ${r} ${r===1?"tile":"tiles"}, ${s}`}return`${n}, ${a.start==="map"?"a map page":"a page"} ${s}`}var li={empty:"Empty",room:"From a room",page:"From a page",map:"Home map"};function _n(a,o){switch(a){case"empty":return"Add tiles yourself.";case"room":return"A tile for each thing in a room you tick.";case"page":return"A copy of a page's tiles, to change on its own.";case"map":return o??"On the iPhone the whole page is your home's live map. The watch shows it as one tile."}}function hi(a){return a==="room"?"home":a==="page"?"duplicate":a==="map"?"place":"grid"}function qn(a,o,e,t,n){return l`<label class="np-check" title=${n??u}>
    <input type="checkbox" .checked=${E(a)} ?disabled=${e} @change=${i=>t(i.target.checked)} />
    <span>${o}</span>
  </label>`}function ui(a,o,e){let t=(n,i)=>{let s=o.devices.filter(r=>r.kind===n);return s.length===0?u:l`<div class="np-group" role="group" aria-label=${i}>
      <span class="np-kind">${$(n==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${s.map(r=>{let d=o.locked?.(r.ownerId);return qn(a.owners.some(p=>f(p,r.ownerId)),r.name,a.busy||d!==void 0,p=>e.onDevice(r.ownerId,p),d)})}
    </div>`};return l`<div class="np-devices">${t("watch","Watches")}${t("iphone","iPhones")}</div>`}function mi(a,o,e){let t=pi(o.hass);if(t.length===0)return l`<p class="np-none">No room in Home Assistant has anything in it yet. Give your devices an area there first.</p>`;let n=F(o.hass,a.areaId),i=new Set(H(a,n)),s=r=>r.map(d=>qn(i.has(d.entityId),d.name,a.busy,p=>e.onEntity(d.entityId,p),d.entityId));return l`<label class="np-area"><span>Room</span>
      <select ?disabled=${a.busy} @change=${r=>e.onArea(r.target.value)}>
        <option value="" ?selected=${a.areaId===void 0} disabled>Pick a room</option>
        ${t.map(r=>l`<option value=${r.id} ?selected=${r.id===a.areaId}>${r.name}</option>`)}
      </select></label>
    ${a.areaId===void 0?u:l`<div class="np-room">
      ${n.controls.length===0?l`<p class="np-none">Nothing to tap in this room.</p>`:s(n.controls)}
      ${n.more.length===0?u:l`<p class="np-more">More in this room</p>${s(n.more)}`}
    </div>`}`}function gi(a,o,e){return o.pages.length===0?l`<p class="np-none">Your home has no page to start from yet.</p>`:l`<label class="np-area"><span>Page</span>
    <select ?disabled=${a.busy} @change=${t=>e.onFromPage(t.target.value)}>
      <option value="" ?selected=${a.fromPage===void 0} disabled>Pick a page</option>
      ${o.pages.map(t=>l`<option value=${M(t)} ?selected=${a.fromPage!==void 0&&f(a.fromPage,M(t))}>${Ke(t)}</option>`)}
    </select></label>`}function Gn(a,o,e){let t=W(a,o),n=["empty","room","page","map"];return l`<dialog class="new-dialog lib-new lib-new-page" aria-label="New page" @close=${()=>e.onClose()}
    @cancel=${i=>{i.preventDefault(),a.busy||e.onClose()}}>
    <form class="lib-new-form" @submit=${i=>{i.preventDefault(),t===void 0&&!a.busy&&e.onMake()}}>
      <div class="new-head">
        <h2>New page</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${a.busy} @click=${()=>e.onClose()}>${$("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">Name</span></div>
          <input type="text" class="new-name" .value=${E(a.name)} maxlength="80" autofocus aria-label="New page name"
            ?disabled=${a.busy} @input=${i=>e.onName(i.target.value)} />
        </section>
        ${o.devices.length===0?u:l`<section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Show on</span><span class="new-step-hint">Ticked like your last new page.</span></div>
          ${ui(a,o,e)}
        </section>`}
        <section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Start</span></div>
          <div class="np-starts" role="radiogroup" aria-label="Start">
            ${n.map(i=>{let s=a.start===i,r=i==="map"&&o.mapFloorId===void 0;return l`<button type="button" class="np-start ${s?"on":""}" role="radio" aria-checked=${s?"true":"false"}
                data-start=${i} ?disabled=${a.busy||r} title=${_n(i,o.mapRefusal)} @click=${()=>e.onStart(i)}>
                ${$(hi(i))}<span class="np-start-t">${li[i]}${i==="map"?nt("ALPHA"):u}</span>
                <span class="np-start-n">${_n(i,i==="map"?o.mapRefusal:void 0)}</span>
              </button>`})}
          </div>
          ${a.start==="room"?mi(a,o,e):a.start==="page"?gi(a,o,e):u}
        </section>
        ${a.note===void 0?u:l`<p class="lt-line ${a.note.kind}" role="status">${a.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${ci(a,o,o.devices)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${a.busy} @click=${()=>e.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${t!==void 0||a.busy} title=${t??"Make the page"}>${a.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function Xn(a){let o=a?.querySelector?.(oi);o&&(!o.open&&typeof o.showModal=="function"&&o.showModal(),o.querySelector("input.new-name")?.select())}var Yn=K`
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
    font: inherit; border-radius: 9px; border: 1px solid var(--wa-line); background: var(--wa-raised, var(--wa-card)); color: var(--wa-muted);
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
    flex: 1; min-width: 0; height: 30px; padding: 0 8px; border-radius: 7px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
  .np-room { display: flex; flex-direction: column; gap: 1px; max-height: 240px; overflow-y: auto; padding-right: 4px; }
  .np-more { margin: 8px 0 2px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-none { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
`;var V=200,ie=320,fi=120,wi=80,ki=172,bi=116,Jn=190,Qn=320,Zn=6,C=tt.screen;function ei(a,o,e,t=C){if(_(a))return{top:0,height:t.height};let n=pt(ct(a,o),t),i=[...n.tiles,...ut(a,t,{states:o})];if(i.length===0)return{top:0,height:t.height};let r=lt(a,1,n.topInset,e)!==u?0:Math.max(0,n.topInset+Math.min(...i.map(p=>p.y))-Zn),d=n.topInset+Math.max(...i.map(p=>p.y+p.height))+Zn;return{top:r,height:Math.max(1,d-r)}}var vi=2e3,Le=44,ti=28,ii={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function L(a){return["watch","iphone"].filter(o=>a.some(e=>e.kind===o))}var Ce=new Map;function si(a){let o=Ce.get(a);if(o!==void 0)return o;let e={view:"cards"};try{let t=window.localStorage.getItem(ii[a]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return Ce.set(a,e),e}function yi(a,o){let e={...si(a),...o};Ce.set(a,e);try{window.localStorage.setItem(ii[a],JSON.stringify(e))}catch{}}var R=(a,o="pages")=>(o==="status_pages"?Et(a)?.dirty:Ft(a)?.dirty)??!1,ni=(a,o)=>`${a}|${o.toUpperCase()}`,m=class extends Fe{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.screensFilter="all";this.cardPicks=new Map;this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new wt(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new Rt(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new Bt(this);this.colorsFor=st();this.colorOf=e=>it(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=vi)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.pageForm=void 0,this.copyForm=void 0,this.screensFilter="all",this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return sn(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===nn?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":Mt(this.kind,si(this.kind).view)}get devices(){return Oe(this.owners,this.phones)}waiting(e){let t=new Map;for(let n of this.devices)t.set(n.ownerId,{held:Ye(e,n.ownerId,this.kind),free:!1});return He(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){_t(this.kind,e),yi(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},At)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.picksBusy)return;this.newForm=void 0;let i=this.kind;if(R(e.ownerId,i)){this.picksNote={kind:"warn",text:X(i,e.name)};return}let s=z(),r=this.nextCardName(),d=i==="status_pages"?pe(r,s):A(s,r);this.picksBusy=!0,this.picksNote=void 0;let p=!1;try{let c=await he(ue(t),e.ownerId,i,{add:d});p=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:U(c).message}}await n.refresh(),this.picksBusy=!1,p&&this.onOpenLibrary?.(i,s,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!(this.newForm?.busy||this.pageForm?.busy)){if(this.newForm!==void 0||this.pageForm!==void 0){this.newForm=void 0,this.pageForm=void 0;return}if(this.kind==="pages"){let e=this.lib.library,t=e===void 0?new Set:this.waiting(e);this.pageForm=zn(this.nextCardName(),Kn(this.devices,Wn(),n=>t.has(n))),this.updateComplete.then(()=>Xn(this.renderRoot));return}this.newForm={name:this.nextCardName(),busy:!1,preview:L(this.devices)[0]},this.updateComplete.then(()=>Lt(this.renderRoot))}}pageSheetContext(){let e=this.lib.library,t=this.homeMapDoc(),n=me(t),i=ge(t),s=e===void 0?[]:D(e,"pages").map(r=>r.item);return{...this.hassNow===void 0?{}:{hass:this.hassNow},pages:s,...n===void 0?{}:{mapFloorId:n},...i===void 0?{}:{mapRefusal:i}}}async makePage(){let e=this.pageForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.pageSheetContext(),i=W(e,n);if(i!==void 0){this.pageForm={...e,note:{kind:"warn",text:e.name.trim()===""?`Give the ${v(this.kind)} a name.`:i}};return}let s=jn(e,n,z());if(s===void 0)return;let{note:r,...d}=e;this.pageForm={...d,busy:!0};let p=await t.createItem("pages",s);if(!p.ok){this.pageForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}Vn(e.owners);for(let h of e.owners)await t.pick(h,"pages",p.reply.id,!0);this.pageForm=void 0;let c=this.devices.find(h=>e.owners.some(k=>f(k,h.ownerId)));ve(c?.kind??L(this.devices)[0]??"watch"),this.onOpenLibrary?.("pages",p.reply.id)}openCopy(e,t=[]){e.kind==="pages"&&(this.copyForm=$t(e.id,e.name,ke(e.owners,this.devices),t),this.updateComplete.then(()=>Tt(this.renderRoot)))}copyHolders(e){let t=this.lib.library,n=t===void 0?void 0:D(t,"pages").find(i=>f(i.id,e.itemId));return ke(n?.owners??[],this.devices)}async makeCopy(){let e=this.copyForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.copyHolders(e);this.copyForm={...e,busy:!0};let i=await St(t,e,n,this.devices);this.copyForm?.itemId===e.itemId&&(this.copyForm=i)}renderCopy(e){let t=this.copyHolders(e);return It(e,t,{onTick:(n,i)=>{this.copyForm!==void 0&&(this.copyForm=Pt(this.copyForm,t,n,i))},onName:n=>{this.copyForm!==void 0&&(this.copyForm={...this.copyForm,copyName:n,named:!0})},onMake:()=>{this.makeCopy()},onOpen:n=>{this.copyForm=void 0,this.onOpenLibrary?.("pages",n)},onClose:()=>{this.copyForm?.busy||(this.copyForm=void 0)}})}renderPageSheet(e,t){let n=this.lib.library,i=n===void 0?new Set:this.waiting(n),s=d=>{this.pageForm=d},r=this.pageSheetContext();return Gn(e,{...r,devices:t,locked:d=>i.has(d)?j(t.find(p=>p.ownerId===d)?.appVersion):void 0},{onName:d=>s({...e,name:d}),onDevice:(d,p)=>s(Un(e,t,d,p)),onStart:d=>s({...e,start:d}),onArea:d=>{let{picked:p,...c}=e;s({...c,areaId:d})},onEntity:(d,p)=>s(Bn(e,F(r.hass,e.areaId),d,p)),onFromPage:d=>s({...e,fromPage:d}),onMake:()=>{this.makePage()},onClose:()=>{e.busy||(this.pageForm=void 0)}})}nextCardName(){let e=this.lib.library,t=e===void 0?[]:D(e,this.kind).map(n=>n.item);return this.kind==="status_pages"?Ge({schemaVersion:1,statusPages:t}):je({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=e.name.trim();if(n===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${v(this.kind)} a name.`}};return}let{note:i,...s}=e;this.newForm={...s,busy:!0};let r=z(),d=e.mapPage===!0?me(this.homeMapDoc()):void 0,p=this.kind==="status_pages"?{schemaVersion:1,statusPages:[pe(n,r)]}:{schemaVersion:1,pages:[d===void 0?A(r,n):Y(r,n,d)]},c=await t.createItem(this.kind,p);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,ve(e.preview??L(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,n){let i=this.lib.store;if(i===void 0)return;this.dropTickNote(P(e)),this.untickAsk=void 0;let s={item:e.name,device:this.devices.find(w=>w.ownerId===t)?.name??"the device"};if(!n){this.untickAsk=await xt(this.hassNow,i,t,e.kind,e.id,s);return}let r=P(e);if(!(await fe(this.hassNow,i,t,e.kind,e.id,!0,s,{onUndone:()=>this.dropTickNote(r)})).ok||e.kind!=="pages")return;let p=await this.readFree(t),c=this.lib.library,h=this.devices.find(w=>w.ownerId===t)?.name;if(!p||c===void 0||h===void 0||G(c,t,"pages")<2)return;let k=We([h]);k!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(r,{kind:"ok",text:k}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let n=P({id:e.itemId}),i=await fe(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>this.dropTickNote(n)});i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let i=(await Re(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==i&&(this.freeFacts=new Map(this.freeFacts).set(e,i)),i}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,n){let i=this.hassNow,s=this.lib.store;if(i===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(R(e.ownerId,r)){this.picksNote={kind:"warn",text:X(r,e.name)};return}let d=this.kindSeq,p="hidden"in t,c=ni(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,p?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):n!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:pn(n,t.id,t.before)});let h=this.orderAsked,k;try{let w=await he(ue(i),e.ownerId,r,t);w.ok&&this.flashSaved(),w.ok||(k={kind:"err",text:`${p?"Not changed":"Not moved"} on ${e.name}: ${w.message.replace(/\.$/,"")}.`})}catch(w){k={kind:"err",text:U(w).message}}if(await s.refresh(),this.picksBusy=!1,p){let w=new Map(this.hiddenAsked);w.delete(c),this.hiddenAsked=w}else this.orderAsked===h&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=k)}shownNow(){let e=this.lib.library;return e===void 0?[]:this.shownOf(e)}shownOf(e){let t=an(e,this.kind,this.search);return this.kind!=="pages"||this.screensFilter==="all"?t:t.filter(n=>Dn(this.screensFilter,n.item))}emptyHere(e){return this.kind==="pages"&&this.screensFilter!=="all"&&this.search.trim()===""?Ln:Se(e,this.search,this.kind)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(P(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=$n(this.selected,this.shownNow().map(P)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let n=e.metaKey||e.ctrlKey;if(!this.selecting&&!n){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!n)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let n=P(e);this.selected=t?vn(this.selected,this.shownNow().map(P),this.anchor,n):bn(this.selected,n),this.anchor=n,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(P);this.selected=e?yn(this.selected,t):xn(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.bulkBusy!==void 0)return;let i=this.devices,s=ee(e,i,R),r=Ne({kind:s.kind,gone:[],kept:s.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=s.kept.length>0?r:void 0,s.items.length===0)return;let d=s.items.length;rt({text:`Deleted ${d===1?s.items[0].name:Sn(s.kind,d)}.`,hide:s.items.map(p=>at(s.kind,p.id)),send:async()=>{let p;try{p=Ne(await Pn(yt(t),{...s,kept:[]},i))}catch(c){p={kind:"err",text:U(c).message}}return await n.refresh(),p.kind==="ok"?void 0:p.text}})}renderItemDelete(e,t){return l`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${n=>{n.stopPropagation(),this.itemAsk=P(e)}}>${$("delete")}</button>`}renderItemAsk(e,t,n){let i=ee([e],t,R),s=Ie(i,t),r=()=>{this.itemAsk=void 0},d=()=>{r(),this.deleteEntries([e])},p=n!==void 0&&e.owners.some(h=>f(h,n.ownerId))&&e.owners.some(h=>!f(h,n.ownerId))?n:void 0,c=i.items.length>0;return l`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${h=>h.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${s.body}</span>
      <span class="ap-ask-acts">
        ${c?p===void 0?l`<button type="button" class="ap-ask-btn danger" @click=${d}>Really delete</button>`:l`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${p.name} only`}
              @click=${()=>{r(),this.tick(e,p.ownerId,!1)}}>${Gt}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${d}>${Xt}</button>`:u}
        <button type="button" class="ap-ask-btn" @click=${r}>${c?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return l`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,n=this.lib.library,i=this.lib.readState,s=this.filterDevice(),r=v(t,2),d=this.view,p=n===void 0?i==="unsupported"?re:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:Zt(D(n,t).length,t),c=n!==void 0&&i==="failed";return l`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${xe(t)}</h1>
          <p class="ap-lead">${p}</p>
        </div>
        ${e.length===0?u:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?u:this.renderNewDialog(this.newForm,e)}
      ${this.pageForm===void 0?u:this.renderPageSheet(this.pageForm,e)}
      ${this.copyForm===void 0?u:this.renderCopy(this.copyForm)}
      ${c?l`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:u}
      ${this.renderTwoScreensCard(n)}
      <div class="pk-surface pk-page ${d==="board"?"on-board":""}" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(n,s,d)}
          ${this.selecting&&s===void 0&&d!=="board"?this.renderBar(e):u}
        </div>
        <div class="pk-body">
          ${n===void 0?l`<p class="ap-empty">${p}</p>`:s!==void 0?this.renderFocus(n,rn(n,s,t,this.search),e):d==="board"?this.renderBoardAll(n,e):this.renderAll(n,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${tn(t,s,this.selecting&&s===void 0,d)}</span></div>
      </div>
    </div></div>`}renderTwoScreensCard(e){return this.kind!=="pages"||e===void 0||D(e,"pages").length===0||On()?u:l`<div class="ap-upgrade" role="note">
      ${$("info")}<span>${Cn}</span>
      <button type="button" class="ap-upgrade-x" title="Dismiss" aria-label="Dismiss"
        @click=${()=>{Mn(),this.requestUpdate()}}>${$("close")}</button>
    </div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,n=v(this.kind,2),i=this.lib.readState;if(e===void 0){let r=i==="unsupported"?re:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${n}\u2026`;return l`<p class="ap-empty">${r}</p>`}if(t.length===0)return l`<p class="ap-empty">No device can have ${n}.</p>`;let s=D(e,this.kind).length===0?l`<p class="ap-empty">No ${n} yet.</p>`:this.renderBoardAll(e,t);return l`${this.saved?l`<span class="bd-saved ap-embed-saved" role="status">${$("check")}<span>Saved</span></span>`:u}${s}`}renderAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;let i=this.shownOf(e);if(i.length===0)return l`<p class="ap-empty">${this.emptyHere(t)}</p>`;let s=this.waiting(e);return l`<div class="ap-grid ${this.comparingScreens()?"differ":""}" role="list">${i.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||D(e,this.kind).length>0)return;let n=this.mayMake,i=this.waiting(e),s=i.size>0;return l`<div class="ap-empty-lib">
      <p>${en(this.kind,n)}</p>
      ${s?l`<p class="ap-empty-wait">${Ae(v(this.kind,2),Be(t,i))}</p>`:u}
      ${n?l`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>New ${v(this.kind)}</span></button>`:u}
    </div>`}renderHead(e,t,n){let i=this.selecting,s=this.bulkBusy!==void 0,r=v(this.kind,2);return l`<div class="pk-head">
      ${Ht(n,d=>this.setView(d),r)}
      ${n==="board"?Wt(be(),d=>{Ot(d),this.requestUpdate()}):u}
      ${t===void 0?l`<button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${v(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${$("checklist")}<span>Multi select</span></button>`:u}
      ${this.saved?l`<span class="bd-saved" role="status">${$("check")}<span>Saved</span></span>`:u}
      ${this.kind==="pages"&&t===void 0?this.renderScreensFilter():u}
      <label class="pk-search">
        ${$("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderScreensFilter(){let e=(t,n,i)=>l`<button type="button" class="ap-filter-opt ${this.screensFilter===t?"on":""}"
      role="radio" aria-checked=${this.screensFilter===t?"true":"false"} data-filter=${t} title=${i}
      @click=${()=>{this.screensFilter=t,this.pruneSelected()}}>${n}</button>`;return l`<span class="ap-filter" role="radiogroup" aria-label="Show">
      ${e("all","All","Every page")}${e("differ",Tn,"The pages the watch and the iPhone arrange apart, or with a tile off on one")}
    </span>`}renderNew(e,t){let n=`New ${v(this.kind)}`;if(e!==void 0)return l`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${Q(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${$("plus")}<span>${n}</span></button>
      </div>`;let i=this.mayMake,s=this.newForm!==void 0||this.pageForm!==void 0;return l`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!i||this.newForm?.busy===!0||this.pageForm?.busy===!0}
        title=${i?`Make ${Q(this.kind)} no device has yet`:Qt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>${n}</span></button>
    </div>`}renderNewDialog(e,t){let n=ge(this.homeMapDoc());return Dt(this.kind,e,L(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMapPage:i=>{this.newForm={...e,mapPage:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?n===void 0?{}:{refusal:n}:void 0)}homeMapDoc(){return Ee(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,n,i){let s=this.lib.store,r=P(t),d=s?.noteFor(t.kind,t.id),p=d===void 0?this.tickNotes.get(r):{kind:"warn",text:d},c=this.untickAsk,h=c!==void 0&&c.kind===t.kind&&f(c.itemId,t.id)?c:void 0,k=this.hassNow?.user?.is_admin,w=t.kind==="pages"?dt(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:n,colorOf:this.colorOf,skips:w,...s===void 0?{}:{pending:s.pending},...p===void 0?{}:{note:p.text,noteKind:p.kind},...h===void 0?{}:{ask:{ownerId:h.ownerId,text:h.text,onRemove:()=>{this.untickNow(h)},onCancel:()=>{this.untickAsk=void 0}}},...k===void 0?{}:{admin:k},locked:S=>{let N=Xe(e,S,t.kind,t.id);if(N&&R(S,t.kind))return X(t.kind,n.find(x=>x.ownerId===S)?.name??"This device");if(!N&&i.has(S))return j(n.find(x=>x.ownerId===S)?.appVersion)}}}renderCardTicks(e,t,n,i){return bt(this.ticksInput(e,t,n,i),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,n,i){let s=this.selecting,r=P(t),d=s&&this.selected.has(r),p=$e(t,n),c=this.openTitle(t),h=w=>this.cardClick(w,t),k=!s&&this.itemAsk===r;return l`<div class="ap-card ${s?"picking":""} ${d?"picked":""} ${k?"asking":""}" role="listitem" data-card=${r}
      @click=${w=>{s&&h(w)}}>
      <div class="ap-top">
        ${s?l`<input type="checkbox" class="pk-card-pick" .checked=${E(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${w=>{w.stopPropagation(),this.pick(t,w.shiftKey)}} />`:u}
        <button type="button" class="ap-open" title=${c} tabindex=${s?"-1":"0"} @click=${h}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${Z(t)}</small>
        </button>
        ${s||t.kind!=="pages"?u:this.renderCopyButton(t)}
        ${s?u:this.renderItemDelete(t,"ap-del")}
      </div>
      ${this.screensLineOf(t,n)===void 0?u:l`<small class="ap-screens">${this.screensLineOf(t,n)}</small>`}
      <div class="ap-thumb-wrap">
        <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} style=${this.thumbWellStyle(t,n)} @click=${h}>
          ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderCardPictures(e,t,p,n)}
        </button>
        ${t.kind==="status_pages"?u:this.renderCardScreenIcons(t,n)}
      </div>
      ${this.renderCardTicks(e,t,n,i)}
      ${k?this.renderItemAsk(t,n):u}
    </div>`}screensLineOf(e,t){return e.kind==="pages"?Nn(e.item,e.owners,t):void 0}renderCopyButton(e){return l`<button type="button" class="ap-del ap-copy" title=${e.owners.length<2?we:`Make a copy of ${e.name} for some devices`} aria-label=${`Make a copy of ${e.name}`}
      ?disabled=${e.owners.length<2}
      @click=${t=>{t.stopPropagation(),this.openCopy(e)}}>${$("duplicate")}</button>`}openTitle(e){if(this.selecting){let t=this.selected.has(P(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return Pe(e.name)}boardColumns(e,t){let n=this.waiting(e);return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:G(e,i.ownerId,this.kind),...n.has(i.ownerId)?{blocked:Vt(i.appVersion,j(i.appVersion))}:{}}))}renderBoardAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;if(t.length===0)return l`<p class="ap-empty">${Se(t,this.search,this.kind)}</p>`;let i=this.waiting(e),s=this.shownOf(e);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,i)),empty:this.emptyHere(t)}])}renderBoardOf(e,t,n,i){let s=v(this.kind),r=v(this.kind,2);return zt({label:`${xe(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...i===void 0?{}:{focus:i},onFocus:d=>this.setFocus(d),wide:this.roomy.wide,ordered:!0,focusTitle:d=>`See ${d.name}'s ${r} in its order, and drag to change it`,sections:n,...this.embedded?{}:{legend:{tick:"on that device",focus:"in a device's header to see and drag its order",saves:"Ticks save at once, with Undo",...this.kind==="pages"?{eye:"hide but keep its place"}:{}}},...this.selecting&&i===void 0?{pinned:this.renderBar(t)}:{}})}boardRow(e,t,n,i,s){let r=this.ticksInput(e,t,n,i),d=kt(r),p=t.kind==="pages"?t.item:void 0,c=p===void 0?0:q(p).length,h=p!==void 0&&c>0&&(r.skips?.length??0)>=c,k=d.map(b=>{if(!b.on&&!b.busy&&i.has(b.ownerId))return{dashTitle:b.title};let T={chip:{...b,title:Kt(b)},onPick:se=>{this.tick(t,b.ownerId,se)}};if(s?.order!==void 0&&b.on&&f(b.ownerId,s.device.ownerId)&&(T.order=s.order.at+1),b.on&&b.device==="watch"&&h?(T.note="shows nothing",T.noteWarn=!0,T.noteTitle=`Every tile on ${t.name} is iPhone only, so ${b.name} shows an empty page.`):b.skips!==void 0&&(T.note=b.skips.text,T.noteTitle=b.skips.title),s?.pick!==void 0&&f(b.ownerId,s.device.ownerId)&&t.kind==="pages"){let se=ni(s.device.ownerId,t.id),ae=this.hiddenAsked.get(se)??s.pick.hidden;T.eye={hidden:ae,busy:this.picksBusy,title:ae?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!ae})}}}return T}),w=this.selecting&&s===void 0,S=P(t),N=this.screensLineOf(t,n),x={key:S,name:t.name,detail:N===void 0?Z(t):`${Z(t)} \xB7 ${N}`,picture:this.rowPictures(t,n,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`${Pe(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:b=>{if(s?.pick!==void 0&&!b.metaKey&&!b.ctrlKey){this.open(t);return}this.cardClick(b,t)},cells:k,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}},peek:()=>({picture:t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumbs(e,t,$e(t,n),n),where:mn(t,n,s?.order===void 0?void 0:{device:s.device,at:s.order.at})})};return w?x.select={picked:this.selected.has(S),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:b=>this.pick(t,b.shiftKey)}:(x.actions=this.renderItemDelete(t,"bd-act danger"),x.more=this.rowMore(t,s),this.itemAsk===S&&(x.under=this.renderItemAsk(t,n,s?.device))),x}rowMore(e,t){let n=[{label:"Open",onPick:()=>this.open(e)}];e.kind==="pages"&&n.push({label:"Make a copy\u2026",disabled:e.owners.length<2,title:e.owners.length<2?we:`Make a copy of ${e.name} for some of its devices`,onPick:()=>this.openCopy(e,t===void 0?[]:[t.device.ownerId])});let i=t?.order;if(t!==void 0&&i!==void 0){let s=i.ids[0],r=d=>{this.changePicks(t.device,{id:e.id,before:d},[...i.ids])};i.at>0&&s!==void 0&&n.push({label:"Move to top",onPick:()=>r(s)}),i.at<i.ids.length-1&&n.push({label:"Move to bottom",onPick:()=>r(null)})}else t===void 0&&n.push({label:"Pick several",title:`Pick several ${v(this.kind,2)} to delete together`,onPick:()=>this.pick(e,!1)});return n}rowPictures(e,t,n){if(e.kind==="status_pages")return this.rowPicture(e,n);let i=L(t),s=i.length===0?["watch"]:i,r=d=>n?.kind===d?n:t.find(p=>p.kind===d&&e.owners.some(c=>f(c,p.ownerId)));return l`<span class="ap-pics">${s.map(d=>this.rowPicture(e,r(d),d))}</span>`}rowPicture(e,t,n){let i=be()==="compact";if(e.kind==="status_pages")return Yt({page:e.item,hass:this.hassNow,width:i?J:this.roomy.size(Le),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let s=this.appVersionOf(t),r=(n??t?.kind)==="iphone",d=i?r?Math.round(J*ti/Le):J:this.roomy.size(r?ti:Le);return ye({page:e.item,width:d,tick:this.iconsTick,iphone:r,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...s===void 0?{}:{appVersion:s},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...r?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>f(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,n){let{device:i}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===i.ownerId&&s.kind===this.kind?s.ids:void 0,d=on(t.picks,r),p=d.map(x=>x.id),c=G(e,i.ownerId,this.kind),h=this.search.trim()===""&&!this.picksBusy,k=this.waiting(e),w=v(this.kind,2),S=d.map((x,b)=>this.boardRow(e,x.entry,n,k,{device:i,pick:x,drag:this.rowDrag(x,b,p,i,h),order:{at:b,ids:h?p:[]}})),N=t.rest.map(x=>this.boardRow(e,x,n,k,{device:i}));return l`${this.renderFocusHead(i,c)}
      ${this.picksNote===void 0?u:l`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${this.renderBoardOf(e,n,[{key:"on",title:cn(i),count:c,hint:ln(i),rows:S,empty:k.has(i.ownerId)&&this.search.trim()===""?_e(w,i.name,i.appVersion):fn(i,this.kind,this.search,t.rest.length,this.mayMake)},...gn(c,t.rest.length,this.search)?[{key:"rest",title:hn(i),count:t.rest.length,hint:un(i),rows:N,empty:this.search.trim()===""?`Every ${v(this.kind)} in your home is on ${i.name}.`:`No other ${v(this.kind)} has that name.`}]:[]],i.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?v(this.kind):w} on ${i.name}.</p>`}renderFocusHead(e,t){let n=Me(e.kind),i=v(this.kind,t);return Ut({device:e,color:this.colorOf(e.ownerId),text:`${t} ${i}, in the order the ${n} ${this.kind==="pages"?"shows":"keeps"} them`,...this.onOpenScreen===void 0?{}:{onOwn:s=>this.onOpenScreen?.(e.ownerId,e.kind,s)},onAll:()=>this.setFocus(void 0)})}rowDrag(e,t,n,i,s){let r=this.overId!==void 0&&f(this.overId,e.id)&&this.dragId!==void 0&&!f(this.dragId,e.id),d=p=>{p!==void 0&&this.changePicks(i,{id:e.id,before:p},[...n])};return{on:s,dragging:this.dragId!==void 0&&f(this.dragId,e.id),over:r,below:r&&n.findIndex(p=>f(p,this.dragId))<t,onStart:p=>{s&&(this.dragId=e.id,p.dataTransfer?.setData("text/plain",e.id),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"))},onOver:p=>{this.dragId!==void 0&&(p.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:p=>{p.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let h=c===void 0?void 0:dn(n,c,e.id);h!==void 0&&this.changePicks(i,h,[...n])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:p=>{!p.altKey||!s||p.key!=="ArrowUp"&&p.key!=="ArrowDown"||(p.preventDefault(),p.key==="ArrowUp"?d(t>0?n[t-1]:void 0):d(t<n.length-1?n[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),n=t.filter(k=>this.selected.has(P(k))),i=n.length,s=this.bulkBusy!==void 0,r=i===0,d=t.length>0&&t.every(k=>this.selected.has(P(k))),p=s?void 0:this.bulkNote,c=v(this.kind),h=v(this.kind,2);return l`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${h}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${Q(this.kind)} to start.`:`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${d?`Let the ${h} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${p===void 0?u:l`<span class="pk-bar-said ${p.kind}">${p.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(n,e):l`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${h} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${$("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${$("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let n=ee(e,t,R),i=Ie(n,t);return l`<span class="pk-bar-ask" id="ap-del-ask"><b>${i.title}</b> ${i.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${n.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,n,i=V){let s=de(t.item,"watch"),r=n===void 0?[]:Ve(Je(e,n.ownerId)),d=r.length===0?[s]:r,p=this.hassNow?.states,c=this.icons,h=i/C.width,k=this.thumbHeight(s,i),w=k>ie,S=ei(s,p,c),N=b=>`${Math.round(b*100)/100}px`,x=n?.kind==="watch"?this.appVersionOf(n):void 0;return l`<span class="ap-pic ${w?"cut":""}" style=${`width:${N(i)};height:${N(Math.min(k,ie))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${N(-S.top*h)})`}>${ht({page:s,pages:d,screen:C,scale:h,...p===void 0?{}:{states:p},...c===void 0?{}:{icons:c},...x===void 0?{}:{appVersion:x},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask})}</span>
    </span>`}thumbHeight(e,t){return ei(e,this.hassNow?.states,this.icons).height*(t/C.width)}comparingScreens(){return this.kind==="pages"&&this.screensFilter==="differ"}cardDrawsBoth(e){return e.length===2&&this.comparingScreens()}cardWatchHeight(e,t){return Math.min(this.thumbHeight(de(e.item,"watch"),t),ie)}thumbWellStyle(e,t){if(e.kind==="status_pages")return u;let n=ne(e.owners,t);return n.length===2&&!this.cardDrawsBoth(n)?`min-height:${Math.round(this.cardWatchHeight(e,V))+20}px`:u}renderCardPictures(e,t,n,i){let s=ne(t.owners,i);if(this.cardDrawsBoth(s))return this.renderThumbs(e,t,n,i,!0);if(Te(s,this.cardPicks.get(P(t)))==="watch")return this.renderThumb(e,t,n?.kind==="watch"?n:void 0);let r=s.includes("watch")?this.cardWatchHeight(t,V):Qn;return l`<span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,Jn,r)}</span>`}renderCardScreenIcons(e,t){let n=ne(e.owners,t);if(L(t).length<2||this.cardDrawsBoth(n))return u;let i=P(e),s=Te(n,this.cardPicks.get(i)),r=p=>$(p==="watch"?"watch":"phone"),d=p=>p==="watch"?"watch":"iPhone";return n.length<2?l`<span class="ap-screen-icons"><span class="ap-screen-icon on ${s}" data-card-screen=${s} title=${`On ${s==="watch"?"a":"an"} ${d(s)} only`}>${r(s)}</span></span>`:l`<span class="ap-screen-icons" role="group" aria-label="Show this page on">${n.map(p=>l`<button type="button"
      class="ap-screen-icon ${p} ${p===s?"on":""}" data-card-screen=${p} aria-pressed=${p===s?"true":"false"}
      title=${`Show it on the ${d(p)}`} aria-label=${`Show it on the ${d(p)}`}
      @click=${c=>{c.stopPropagation(),this.cardPicks=new Map(this.cardPicks).set(i,p)}}>${r(p)}</button>`)}</span>`}renderPhoneThumb(e,t,n,i){let s=t.find(d=>d.kind==="iphone"&&e.owners.some(p=>f(p,d.ownerId))),r=this.appVersionOf(s);return ye({page:e.item,width:n,maxHeight:Math.max(1,Math.round(i)),tick:this.iconsTick,iphone:!0,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...r===void 0?{}:{appVersion:r},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,homeMap:this.homeMapDoc()})}renderThumbs(e,t,n,i,s=!1){let r=L(i);if(!r.includes("iphone"))return this.renderThumb(e,t,n);let d=r.includes("watch"),p=s?ki:fi,c=d?s?bi:wi:Jn,h=d?this.cardWatchHeight(t,p):Qn;return l`<span class="ap-pics ap-card-pics ${s?"large":""}">
      ${d?this.renderThumb(e,t,n?.kind==="watch"?n:void 0,p):u}
      <span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,c,h)}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,n=V/C.width,i=d=>`${Math.round(d*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return l`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${i(V)};height:${i(Math.min(C.height*n,ie))}`}>
      <span class="ap-pic-in">${t===void 0?u:gt({page:e.item,hass:t,icons:this.icons??et,screen:C,scale:n})}</span>
    </span>`}static{this.styles=[mt,ot,ft,kn,wn,vt,Jt,Ct,Yn,Nt,jt,qt,K`
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
      position: absolute; top: 6px; right: 6px; z-index: 2; display: inline-flex; gap: 2px; padding: 2px; border-radius: 8px;
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
    .ap-filter { display: inline-flex; flex: none; padding: 2px; gap: 2px; border-radius: 8px; background: var(--wa-field); border: 1px solid var(--wa-line); }
    .ap-filter-opt {
      font: inherit; font-size: 12px; font-weight: 600; height: 24px; padding: 0 9px; border-radius: 6px; cursor: pointer;
      border: 0; background: transparent; color: var(--wa-muted);
    }
    .ap-filter-opt.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .ap-filter-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one card after the update, over the list until dismissed. */
    .ap-upgrade {
      display: flex; align-items: center; gap: 10px; margin: 0 0 12px; padding: 10px 12px; border-radius: 10px;
      font-size: 13px; line-height: 1.4; color: var(--wa-ink);
      background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-card));
      border: 1px solid color-mix(in srgb, var(--wa-accent) 32%, var(--wa-line));
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
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover:not(:disabled) { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn:disabled { opacity: .45; cursor: default; }
    .ap-new-btn svg { width: 16px; height: 16px; }
    /* An empty library: how a page works, centered, with New page. */
    .ap-empty-lib { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 16px; text-align: center; }
    .ap-empty-lib p { margin: 0; max-width: 40ch; font-size: 14px; line-height: 1.45; color: var(--wa-muted); }

    /* A status page's picture: the watch's black screen, one screen tall. */
    .ap-pic-status .sp-screen { pointer-events: none; }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-field); color: var(--wa-ink); cursor: pointer; font-weight: 600;
    }
    .pk-pick-btn:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-pick-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn:disabled { opacity: .45; cursor: default; }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: transparent; background: var(--wa-seg-on); color: var(--wa-ink); }

    /* The panel's small buttons (form-styles.ts), for the bar. */
    button.small {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
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
      font-size: 12.5px; min-height: 28px; padding: 0 10px; border-radius: 8px;
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
      width: 17px; height: 17px; border-radius: 5px; border: 0;
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
  `]}};g([I({attribute:!1})],m.prototype,"kind",2),g([I({attribute:!1})],m.prototype,"owners",2),g([I({attribute:!1})],m.prototype,"ownersReady",2),g([I({attribute:!1})],m.prototype,"phones",2),g([I({attribute:!1})],m.prototype,"icons",2),g([I({attribute:!1})],m.prototype,"iconsTick",2),g([I({attribute:!1})],m.prototype,"onOpenLibrary",2),g([I({attribute:!1})],m.prototype,"focusOwner",2),g([I({attribute:!1})],m.prototype,"onFocus",2),g([I({attribute:!1})],m.prototype,"onOpenScreen",2),g([I({type:Boolean,reflect:!0})],m.prototype,"embedded",2),g([I({attribute:!1})],m.prototype,"searchText",2),g([y()],m.prototype,"search",2),g([y()],m.prototype,"newForm",2),g([y()],m.prototype,"pageForm",2),g([y()],m.prototype,"copyForm",2),g([y()],m.prototype,"screensFilter",2),g([y()],m.prototype,"cardPicks",2),g([y()],m.prototype,"selecting",2),g([y()],m.prototype,"selected",2),g([y()],m.prototype,"asking",2),g([y()],m.prototype,"bulkBusy",2),g([y()],m.prototype,"itemAsk",2),g([y()],m.prototype,"bulkNote",2),g([y()],m.prototype,"tickNotes",2),g([y()],m.prototype,"untickAsk",2),g([y()],m.prototype,"picksBusy",2),g([y()],m.prototype,"picksNote",2),g([y()],m.prototype,"orderAsked",2),g([y()],m.prototype,"hiddenAsked",2),g([y()],m.prototype,"dragId",2),g([y()],m.prototype,"overId",2),g([y()],m.prototype,"freeFacts",2),g([y()],m.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",m);export{m as WaAllPages,ei as pageCrop};
