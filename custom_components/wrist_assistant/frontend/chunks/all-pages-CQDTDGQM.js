import{b as Wt}from"./chunk-6J4X5RPD.js";import{a as Tn,b as Nn}from"./chunk-AB3EFZNH.js";import{A as $n,B as Pn,C as Sn,D as In,E as Re,b as Ie,c as sn,e as an,f as v,g as te,h as hn,i as Ne,j as un,k as mn,l as gn,m as ne,n as ie,o as fn,q as De,r as Le,s as wn,t as kn,u as bn,v as Ce,w as Fe,x as vn,y as yn,z as xn}from"./chunk-P5MWKBPR.js";import{i as xt,l as $t}from"./chunk-YTBU7YIA.js";import{C as rn,D as Z,E as on,F as ee,G as dn,H as cn,I as Te,J as pn,K as ln}from"./chunk-MFOZZP2U.js";import{d as ge}from"./chunk-VRYUIFUJ.js";import{b as be,c as ve,d as J,i as xe,j as $e,k as Lt,l as Ct,m as Ft,n as Rt,o as Et,p as Ot}from"./chunk-OJHTOA53.js";import{a as Nt,b as ke,d as Bt,m as Ht}from"./chunk-5VOZD5CN.js";import{c as ye,d as Dt}from"./chunk-EC2N5OSU.js";import{a as Mt,b as _t,c as At}from"./chunk-O5AT4HHI.js";import"./chunk-CMRLPBF7.js";import"./chunk-2BKMGUXS.js";import{Bb as vt,Gb as yt,cb as ft,fb as wt,rb as kt,wb as bt}from"./chunk-6ZISGRDP.js";import{db as gt}from"./chunk-7TXIKDYZ.js";import{A as Se,b as Q,c as Pe,d as Vt,e as Kt,f as zt,g as Ut,h as jt,i as qt,j as Gt,k as Xt,l as Yt,m as Jt,o as Qt,p as Zt,q as en,x as tn,y as nn}from"./chunk-UCKZHMVZ.js";import{a as fe,b as ht,c as ut,p as Pt,s as St,t as It,y as Tt}from"./chunk-5ROQ7IRM.js";import"./chunk-PTC5Q5K6.js";import"./chunk-QAAXT2FG.js";import"./chunk-BVCT4SXC.js";import{b as pt,c as lt}from"./chunk-EP7WCOLW.js";import{e as mt,u as X}from"./chunk-BALH6Q63.js";import"./chunk-RYWHRF2L.js";import"./chunk-LJUPY5FG.js";import{p as pe}from"./chunk-5HFUKFF4.js";import{C as rt,q as at}from"./chunk-GMCHCVFA.js";import"./chunk-ORO4TUMU.js";import"./chunk-C6K36PU4.js";import{d as ot}from"./chunk-AMR774OZ.js";import{vb as ct,z as dt}from"./chunk-7NBA5U7A.js";import"./chunk-QMT5XTJM.js";import{j as E}from"./chunk-TOKIRHDQ.js";import{g as Ve}from"./chunk-QQ3NEW5P.js";import"./chunk-4ILUENBV.js";import"./chunk-Z7GTY3SK.js";import"./chunk-PWVBP3GH.js";import{Ag as We,b as I,c as y,oh as $,ze as U}from"./chunk-WJ2EW5QK.js";import{d as we,e as Y}from"./chunk-MJBSBNWF.js";import{X as f,_ as N,da as nt,ea as it,la as st,ma as B,w as tt,x as me}from"./chunk-5LB7PZLF.js";import{a as Ke,c as ze,d as O,f as q,g as le,h as Ue,i as je,j as qe,k as Ge}from"./chunk-GIY73U3S.js";import{H as et,f as Ze,g as A}from"./chunk-KXNSKFVY.js";import{$ as he,A as Je,Z as Qe,aa as ue,k as Xe,l as G,m as M,n as Ye,q as _}from"./chunk-TCVAOGAG.js";import{rb as j}from"./chunk-WMGSOSBD.js";import{b as z,f as l,i as h,l as He}from"./chunk-6ZDBXU6B.js";import{a as g}from"./chunk-LO2NM3CE.js";function gi(a,o,e){return`${a} ${a===1?o:e}`}function Dn(a,o){let e=new Set(a);return e.has(o)?e.delete(o):e.add(o),e}function Ln(a,o,e,t){let n=new Set(a),i=o.indexOf(t),s=e===void 0?-1:o.indexOf(e);if(i<0)return n;if(s<0)return n.add(t),n;for(let r=Math.min(s,i);r<=Math.max(s,i);r++)n.add(o[r]);return n}function Cn(a,o){return new Set([...a,...o])}function Fn(a,o){let e=new Set(o);return new Set([...a].filter(t=>!e.has(t)))}function Rn(a,o){let e=new Set(o);return new Set([...a].filter(t=>e.has(t)))}function P(a){return a.id.toUpperCase()}function se(a,o,e){let n={kind:a[0]?.kind??"pages",items:[],kept:[],devices:[]},i=new Set;for(let s of a){let r=o.filter(c=>s.owners.some(p=>f(p,c.ownerId))).map(c=>c.ownerId),d=r.filter(c=>e(c,s.kind));if(d.length>0){n.kept.push({name:s.name,dirty:d});continue}n.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let c of r)i.add(c)}return n.devices=o.map(s=>s.ownerId).filter(s=>i.has(s)),n}var H=(a,o)=>a.find(e=>f(e.ownerId,o))?.name??"a device";function Ee(a,o){let e=a.items.length,t=e===1?"it":"them",n=`Delete ${e} ${v(a.kind,e)}?`,i=a.devices.map(d=>H(o,d)),s=a.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[i.length===0?`${e===1?"It is":"They are"} on no device yet. ${fe}`:`${e===1?"It comes":"They come"} off ${O(i)}, ${s}. ${fe}`];for(let d of a.kept){let c=d.dirty.map(p=>H(o,p));r.push(`${d.name} stays: ${O(c)} ${c.length===1?"has":"have"} unsaved edits.`)}return{title:n,body:r.join(" ")}}async function En(a,o,e,t){let n={kind:o.kind,gone:[],kept:o.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},i=new Map;for(let[s,r]of o.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${o.items.length})\u2026`);let d=await a.delete(o.kind,r.id);if(!d.ok){n.failed.push({name:r.name,text:d.text});continue}n.gone.push(r.name);for(let c of d.reply.link_failures??[]){let p=c.name??H(e,c.owner);n.stuck.includes(p)||n.stuck.push(p)}for(let c of r.owners)i.set(c,[...i.get(c)??[],r.id])}if(o.kind==="pages")for(let[s,r]of i){t?.(`Clearing complication taps on ${H(e,s)}\u2026`);let d=!1;try{d=await a.clearTaps(s,r)}catch{d=!1}d||n.taps.push(H(e,s))}return n}function Oe(a){let o=i=>`${i} ${v(a.kind,i)}`,e=[];a.gone.length>0&&e.push(`Deleted ${a.gone.length===1?a.gone[0]:o(a.gone.length)}.`);let t=e.length>0,n=!1;for(let i of a.kept)n=!0,e.push(`Kept ${i.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let i of a.failed)n=!0,e.push(`Not deleted: ${i.name}. ${i.text}`);return a.stuck.length>0&&(n=!0,e.push(`Could not take ${a.gone.length===1?"it":"them"} off ${O(a.stuck)}.`)),a.taps.length>0&&(n=!0,e.push(`Could not clear the complication taps that opened ${a.gone.length===1?"it":"them"} on ${O(a.taps)}. Change those by hand.`)),!t&&!n?{kind:"ok",text:"Nothing was deleted."}:{kind:n?t?"warn":"err":"ok",text:e.join(" ")}}function On(a,o){return gi(o,v(a),v(a,2))}function ae(a,o){return G(a).filter(e=>Je(e,o)&&!Qe(a,e,o)).length}function fi(a){return _(a)?!1:!he(a)||ae(a,"watch")>0||ae(a,"iphone")>0}function re(a,o){let e=n=>["watch","iphone"].filter(i=>n.some(s=>s.kind===i)),t=e(o.filter(n=>a.some(i=>f(i,n.ownerId))));return t.length>0?t:e(o)}function Me(a,o){return o!==void 0&&a.includes(o)?o:a[0]??"watch"}var Mn=a=>`${a} ${a===1?"tile":"tiles"}`;function _n(a,o,e){let t=new Set(e.map(r=>r.kind)),n=new Set(e.filter(r=>o.some(d=>f(d,r.ownerId))).map(r=>r.kind));if(t.size>1&&n.size===1)return n.has("watch")?"Watch only":"iPhone only";if(_(a))return;let i=ae(a,"watch");if(i>0)return`${Mn(i)} off on the watch`;let s=ae(a,"iphone");return s>0?`${Mn(s)} off on the iPhone`:he(a)?void 0:"iPhone arranged differently"}var An="Screens differ";function Bn(a,o){return a==="all"||fi(o)}var Hn="Every page is arranged the same on the watch and the iPhone.",Wn="Watch and iPhone can now be arranged apart. Nothing has changed on your devices.",Vn="wa-pages-two-screens-card-dismissed";function Kn(a){if(a!==void 0)return a;try{return globalThis.localStorage}catch{return}}var zn=!1;function Un(a){if(zn)return!0;try{return Kn(a)?.getItem(Vn)==="1"}catch{return!1}}function jn(a){zn=!0;try{Kn(a)?.setItem(Vn,"1")}catch{}}var wi="dialog.lib-new-page",ki=new Set(["light","switch","input_boolean","fan","cover","lock","climate","media_player","scene","script"]);function bi(a){let o=new Set;for(let e of Object.keys(a?.states??{})){if(!Gn(a,e))continue;let t=ge(a,e);t!==void 0&&o.add(t)}return Object.entries(a?.areas??{}).filter(([e])=>o.has(e)).map(([e,t])=>({id:e,name:typeof t?.name=="string"&&t.name.trim()!==""?t.name.trim():e})).sort((e,t)=>e.name.localeCompare(t.name))}function Gn(a,o){let e=a?.entities?.[o];return e?.hidden!==!0&&(e?.entity_category??null)===null}function F(a,o){let e={controls:[],more:[]};if(o===void 0)return e;for(let[n,i]of Object.entries(a?.states??{})){if(!Gn(a,n)||ge(a,n)!==o)continue;let s=i?.attributes?.friendly_name,r=typeof s=="string"&&s.trim()!==""?s.trim():n,d=n.slice(0,n.indexOf("."));(ki.has(d)?e.controls:e.more).push({entityId:n,name:r})}let t=(n,i)=>n.name.localeCompare(i.name)||n.entityId.localeCompare(i.entityId);return e.controls.sort(t),e.more.sort(t),e}function W(a,o){let e=[...o.controls,...o.more].map(t=>t.entityId);return a.picked===void 0?o.controls.map(t=>t.entityId):e.filter(t=>a.picked.includes(t))}function Xn(a,o,e,t){let n=W(a,o),i=t?[...n.filter(d=>d!==e),e]:n.filter(d=>d!==e),{note:s,...r}=a;return{...r,picked:i}}var Yn="wa-new-page-devices",_e;function Jn(a){try{let o=(a??globalThis.localStorage)?.getItem(Yn),e=o?JSON.parse(o):void 0;if(Array.isArray(e))return e.filter(t=>typeof t=="string")}catch{}return _e===void 0?void 0:[..._e]}function Qn(a,o){_e=[...a];try{(o??globalThis.localStorage)?.setItem(Yn,JSON.stringify(a))}catch{}}function Zn(a,o,e){let t=a.filter(n=>e?.(n.ownerId)!==!0);return o===void 0?t.map(n=>n.ownerId):t.filter(n=>o.some(i=>f(i,n.ownerId))).map(n=>n.ownerId)}function ei(a,o){return{name:a,busy:!1,owners:o,start:"empty"}}function ti(a,o,e,t){let n=t?o.filter(i=>f(i.ownerId,e)||a.owners.some(s=>f(s,i.ownerId))).map(i=>i.ownerId):a.owners.filter(i=>!f(i,e));return{...a,owners:n}}function V(a,o){if(a.name.trim()==="")return"Type a name to start.";if(a.start==="room"){if(a.areaId===void 0)return"Pick a room.";if(W(a,F(o.hass,a.areaId)).length===0)return"Tick something in the room."}if(a.start==="page"&&(a.fromPage===void 0||!o.pages.some(e=>f(M(e),a.fromPage))))return"Pick a page to start from.";if(a.start==="map"&&o.mapFloorId===void 0)return o.mapRefusal??"Scan a room in the iPhone app first."}function ni(a,o,e){if(V(a,o)!==void 0)return;let t=a.name.trim(),n=e.toUpperCase();if(a.start==="map")return{schemaVersion:1,pages:[J(n,t,o.mapFloorId)]};if(a.start==="page"){let r=o.pages.find(d=>f(M(d),a.fromPage));return{schemaVersion:1,pages:[et(r,n,t)]}}let i={schemaVersion:1,pages:[A(n,t)]};if(a.start!=="room")return i;let s={states:o.hass?.states??{},...o.hass?.entities===void 0?{}:{entities:o.hass.entities}};for(let r of W(a,F(o.hass,a.areaId)))i=rt(i,n,{kind:"entity",...at(s,r)},{last:!0}).document;return i}function vi(a,o,e){let t=V(a,o);if(t!==void 0)return t;let n=a.name.trim(),i=e.filter(r=>a.owners.some(d=>f(d,r.ownerId))),s=i.length===0?"on no device yet. Tick a device any time.":i.length===1?`on ${i[0].name}.`:`on ${i.length} devices.`;if(a.start==="room"){let r=W(a,F(o.hass,a.areaId)).length;return`${n}, ${r} ${r===1?"tile":"tiles"}, ${s}`}return`${n}, ${a.start==="map"?"a map page":"a page"} ${s}`}var yi={empty:"Empty",room:"From a room",page:"From a page",map:"Home map"};function qn(a,o){switch(a){case"empty":return"Add tiles yourself.";case"room":return"A tile for each thing in a room you tick.";case"page":return"A copy of a page's tiles, to change on its own.";case"map":return o??"On the iPhone the whole page is your home's live map. The watch shows it as one tile."}}function xi(a){return a==="room"?"home":a==="page"?"duplicate":a==="map"?"place":"grid"}function ii(a,o,e,t,n){return l`<label class="np-check" title=${n??h}>
    <input type="checkbox" .checked=${E(a)} ?disabled=${e} @change=${i=>t(i.target.checked)} />
    <span>${o}</span>
  </label>`}function $i(a,o,e){let t=(n,i)=>{let s=o.devices.filter(r=>r.kind===n);return s.length===0?h:l`<div class="np-group" role="group" aria-label=${i}>
      <span class="np-kind">${$(n==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${s.map(r=>{let d=o.locked?.(r.ownerId);return ii(a.owners.some(c=>f(c,r.ownerId)),r.name,a.busy||d!==void 0,c=>e.onDevice(r.ownerId,c),d)})}
    </div>`};return l`<div class="np-devices">${t("watch","Watches")}${t("iphone","iPhones")}</div>`}function Pi(a,o,e){let t=bi(o.hass);if(t.length===0)return l`<p class="np-none">No room in Home Assistant has anything in it yet. Give your devices an area there first.</p>`;let n=F(o.hass,a.areaId),i=new Set(W(a,n)),s=r=>r.map(d=>ii(i.has(d.entityId),d.name,a.busy,c=>e.onEntity(d.entityId,c),d.entityId));return l`<label class="np-area"><span>Room</span>
      <select ?disabled=${a.busy} @change=${r=>e.onArea(r.target.value)}>
        <option value="" ?selected=${a.areaId===void 0} disabled>Pick a room</option>
        ${t.map(r=>l`<option value=${r.id} ?selected=${r.id===a.areaId}>${r.name}</option>`)}
      </select></label>
    ${a.areaId===void 0?h:l`<div class="np-room">
      ${n.controls.length===0?l`<p class="np-none">Nothing to tap in this room.</p>`:s(n.controls)}
      ${n.more.length===0?h:l`<p class="np-more">More in this room</p>${s(n.more)}`}
    </div>`}`}function Si(a,o,e){return o.pages.length===0?l`<p class="np-none">Your home has no page to start from yet.</p>`:l`<label class="np-area"><span>Page</span>
    <select ?disabled=${a.busy} @change=${t=>e.onFromPage(t.target.value)}>
      <option value="" ?selected=${a.fromPage===void 0} disabled>Pick a page</option>
      ${o.pages.map(t=>l`<option value=${M(t)} ?selected=${a.fromPage!==void 0&&f(a.fromPage,M(t))}>${Ye(t)}</option>`)}
    </select></label>`}function si(a,o,e){let t=V(a,o),n=["empty","room","page","map"];return l`<dialog class="new-dialog lib-new lib-new-page" aria-label="New page" @close=${()=>e.onClose()}
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
        ${o.devices.length===0?h:l`<section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Show on</span><span class="new-step-hint">Ticked like your last new page.</span></div>
          ${$i(a,o,e)}
          ${o.waitOuts??h}
        </section>`}
        <section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Start</span></div>
          <div class="np-starts" role="radiogroup" aria-label="Start">
            ${n.map(i=>{let s=a.start===i,r=i==="map"&&o.mapFloorId===void 0;return l`<button type="button" class="np-start ${s?"on":""}" role="radio" aria-checked=${s?"true":"false"}
                data-start=${i} ?disabled=${a.busy||r} title=${qn(i,o.mapRefusal)} @click=${()=>e.onStart(i)}>
                ${$(xi(i))}<span class="np-start-t">${yi[i]}${i==="map"?ct("ALPHA"):h}</span>
                <span class="np-start-n">${qn(i,i==="map"?o.mapRefusal:void 0)}</span>
              </button>`})}
          </div>
          ${a.start==="room"?Pi(a,o,e):a.start==="page"?Si(a,o,e):h}
        </section>
        ${a.note===void 0?h:l`<p class="lt-line ${a.note.kind}" role="status">${a.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${vi(a,o,o.devices)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${a.busy} @click=${()=>e.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${t!==void 0||a.busy} title=${t??"Make the page"}>${a.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function ai(a){let o=a?.querySelector?.(wi);o&&(!o.open&&typeof o.showModal=="function"&&o.showModal(),o.querySelector("input.new-name")?.select())}var ri=z`
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
`;var K=200,oe=320,Ii=120,Ti=80,Ni=172,Di=116,oi=190,di=320,ci=6,C=dt.screen;function pi(a,o,e,t=C){if(_(a))return{top:0,height:t.height};let n=ft(wt(a,o),t),i=[...n.tiles,...vt(a,t,{states:o})];if(i.length===0)return{top:0,height:t.height};let r=kt(a,1,n.topInset,e)!==h?0:Math.max(0,n.topInset+Math.min(...i.map(c=>c.y))-ci),d=n.topInset+Math.max(...i.map(c=>c.y+c.height))+ci;return{top:r,height:Math.max(1,d-r)}}var Li=2e3,Ae=44,li=28,ui={pages:"wrist-assistant-panel.all-pages.v2",status_pages:"wrist-assistant-panel.all-status-pages.v2"};function L(a){return["watch","iphone"].filter(o=>a.some(e=>e.kind===o))}var Be=new Map;function mi(a){let o=Be.get(a);if(o!==void 0)return o;let e={view:"cards"};try{let t=window.localStorage.getItem(ui[a]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return Be.set(a,e),e}function Ci(a,o){let e={...mi(a),...o};Be.set(a,e);try{window.localStorage.setItem(ui[a],JSON.stringify(e))}catch{}}var R=(a,o="pages")=>(o==="status_pages"?Wt(a)?.dirty:Bt(a)?.dirty)??!1,hi=(a,o)=>`${a}|${o.toUpperCase()}`,m=class extends He{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.screensFilter="all";this.cardPicks=new Map;this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Pt(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new Ht(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new jt(this);this.tabsMenu=new pn(this);this.colorsFor=lt();this.colorOf=e=>pt(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=Li)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&(this.view==="board"&&this.focusOwner!==void 0?this.endSelect(!0):this.pruneSelected()),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.pageForm=void 0,this.copyForm=void 0,this.screensFilter="all",this.tabsMenu.toggle(!1),this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return fn(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===ie?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||cn(this.kind,this.filterDevice()?.ownerId)?"board":Kt(this.kind,mi(this.kind).view)}get devices(){return Ke(this.owners,this.phones)}waiting(e){let t=new Map;for(let n of this.devices)t.set(n.ownerId,{held:it(e,n.ownerId,this.kind),free:!1});return qe(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,Te(this.kind,e),this.onFocus?.(e)}setView(e){zt(this.kind,e),Ci(this.kind,{view:e}),e==="cards"&&Te(this.kind,void 0),this.requestUpdate()}pickTab(e){dn(this.kind,e===Z),this.onFocus?.(e===ie||e===Z?void 0:e),this.pruneSelected(),this.requestUpdate()}currentTab(){return this.filterDevice()?.ownerId??(ee(this.kind)?Z:ie)}renderTabs(e,t){let n=this.currentTab(),i=N(e,this.kind);return rn({tabs:on({devices:t,current:n,total:i.length,countOf:s=>B(e,s,this.kind),shelved:i.filter(s=>s.owners.length===0).length}),current:n,open:this.tabsMenu.open,onToggle:this.tabsMenu.toggle,onPick:s=>this.pickTab(s),styleOf:s=>{let r=this.colorOf(s);return r===void 0?h:`--dc:${r}`}})}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},Ut)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.picksBusy)return;this.newForm=void 0;let i=this.kind;if(R(e.ownerId,i)){this.picksNote={kind:"warn",text:Y(i,e.name)};return}let s=U(),r=this.nextCardName(),d=i==="status_pages"?me(r,s):A(s,r);this.picksBusy=!0,this.picksNote=void 0;let c=!1;try{let p=await we(ke(t),e.ownerId,i,{add:d});c=p.ok&&p.changed,p.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${p.message}`})}catch(p){this.picksNote={kind:"err",text:j(p).message}}await n.refresh(),this.picksBusy=!1,c&&this.onOpenLibrary?.(i,s,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!(this.newForm?.busy||this.pageForm?.busy)){if(this.newForm!==void 0||this.pageForm!==void 0){this.newForm=void 0,this.pageForm=void 0;return}if(this.kind==="pages"){let e=this.lib.library,t=e===void 0?new Set:this.waiting(e);this.pageForm=ei(this.nextCardName(),Zn(this.devices,Jn(),n=>t.has(n))),this.updateComplete.then(()=>ai(this.renderRoot));return}this.newForm={name:this.nextCardName(),busy:!1,preview:L(this.devices)[0]},this.updateComplete.then(()=>_t(this.renderRoot))}}pageSheetContext(){let e=this.lib.library,t=this.homeMapDoc(),n=be(t),i=ve(t),s=e===void 0?[]:N(e,"pages").map(r=>r.item);return{...this.hassNow===void 0?{}:{hass:this.hassNow},pages:s,...n===void 0?{}:{mapFloorId:n},...i===void 0?{}:{mapRefusal:i}}}async makePage(){let e=this.pageForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.pageSheetContext(),i=V(e,n);if(i!==void 0){this.pageForm={...e,note:{kind:"warn",text:e.name.trim()===""?`Give the ${v(this.kind)} a name.`:i}};return}let s=ni(e,n,U());if(s===void 0)return;let{note:r,...d}=e;this.pageForm={...d,busy:!0};let c=await t.createItem("pages",s);if(!c.ok){this.pageForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}Qn(e.owners);for(let u of e.owners)await t.pick(u,"pages",c.reply.id,!0);this.pageForm=void 0;let p=this.devices.find(u=>e.owners.some(k=>f(k,u.ownerId)));Se(p?.kind??L(this.devices)[0]??"watch"),this.onOpenLibrary?.("pages",c.reply.id)}openCopy(e,t=[]){e.kind==="pages"&&(this.copyForm=Lt(e.id,e.name,$e(e.owners,this.devices),t),this.updateComplete.then(()=>Ot(this.renderRoot)))}copyHolders(e){let t=this.lib.library,n=t===void 0?void 0:N(t,"pages").find(i=>f(i.id,e.itemId));return $e(n?.owners??[],this.devices)}async makeCopy(){let e=this.copyForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.copyHolders(e);this.copyForm={...e,busy:!0};let i=await Ft(t,e,n,this.devices);this.copyForm?.itemId===e.itemId&&(this.copyForm=i)}renderCopy(e){let t=this.copyHolders(e);return Rt(e,t,{onTick:(n,i)=>{this.copyForm!==void 0&&(this.copyForm=Ct(this.copyForm,t,n,i))},onName:n=>{this.copyForm!==void 0&&(this.copyForm={...this.copyForm,copyName:n,named:!0})},onMake:()=>{this.makeCopy()},onOpen:n=>{this.copyForm=void 0,this.onOpenLibrary?.("pages",n)},onClose:()=>{this.copyForm?.busy||(this.copyForm=void 0)}})}renderPageSheet(e,t){let n=this.lib.library,i=n===void 0?new Set:this.waiting(n),s=d=>{this.pageForm=d},r=this.pageSheetContext();return si(e,{...r,devices:t,locked:d=>i.has(d)?q(t.find(c=>c.ownerId===d)?.appVersion):void 0,waitOuts:n===void 0?h:X(this.hassNow,this.owners,n,"pages")},{onName:d=>s({...e,name:d}),onDevice:(d,c)=>s(ti(e,t,d,c)),onStart:d=>s({...e,start:d}),onArea:d=>{let{picked:c,...p}=e;s({...p,areaId:d})},onEntity:(d,c)=>s(Xn(e,F(r.hass,e.areaId),d,c)),onFromPage:d=>s({...e,fromPage:d}),onMake:()=>{this.makePage()},onClose:()=>{e.busy||(this.pageForm=void 0)}})}nextCardName(){let e=this.lib.library,t=e===void 0?[]:N(e,this.kind).map(n=>n.item);return this.kind==="status_pages"?tt({schemaVersion:1,statusPages:t}):Ze({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=e.name.trim();if(n===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${v(this.kind)} a name.`}};return}let{note:i,...s}=e;this.newForm={...s,busy:!0};let r=U(),d=e.mapPage===!0?be(this.homeMapDoc()):void 0,c=this.kind==="status_pages"?{schemaVersion:1,statusPages:[me(n,r)]}:{schemaVersion:1,pages:[d===void 0?A(r,n):J(r,n,d)]},p=await t.createItem(this.kind,c);if(!p.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}this.newForm=void 0,Se(e.preview??L(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,p.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,n){let i=this.lib.store;if(i===void 0)return;this.dropTickNote(P(e)),this.untickAsk=void 0;let s={item:e.name,device:this.devices.find(w=>w.ownerId===t)?.name??"the device"};if(!n){this.untickAsk=await Dt(this.hassNow,i,t,e.kind,e.id,s);return}let r=P(e);if(!(await ye(this.hassNow,i,t,e.kind,e.id,!0,s,{onUndone:()=>this.dropTickNote(r)})).ok||e.kind!=="pages")return;let c=await this.readFree(t),p=this.lib.library,u=this.devices.find(w=>w.ownerId===t)?.name;if(!c||p===void 0||u===void 0||B(p,t,"pages")<2)return;let k=Ge([u]);k!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(r,{kind:"ok",text:k}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let n=P({id:e.itemId}),i=await ye(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>this.dropTickNote(n)});i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let i=(await We(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==i&&(this.freeFacts=new Map(this.freeFacts).set(e,i)),i}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,n){let i=this.hassNow,s=this.lib.store;if(i===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(R(e.ownerId,r)){this.picksNote={kind:"warn",text:Y(r,e.name)};return}let d=this.kindSeq,c="hidden"in t,p=hi(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,c?this.hiddenAsked=new Map(this.hiddenAsked).set(p,t.hidden):n!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:bn(n,t.id,t.before)});let u=this.orderAsked,k;try{let w=await we(ke(i),e.ownerId,r,t);w.ok&&this.flashSaved(),w.ok||(k={kind:"err",text:`${c?"Not changed":"Not moved"} on ${e.name}: ${w.message.replace(/\.$/,"")}.`})}catch(w){k={kind:"err",text:j(w).message}}if(await s.refresh(),this.picksBusy=!1,c){let w=new Map(this.hiddenAsked);w.delete(p),this.hiddenAsked=w}else this.orderAsked===u&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=k)}shownNow(){let e=this.lib.library;return e===void 0?[]:this.shownOf(e)}onTab(e){if(this.view==="cards"){let t=this.filterDevice();if(t!==void 0)return Le(e,t,this.kind,this.search).picks.map(n=>n.entry);if(ee(this.kind))return De(e,this.kind,this.search).filter(n=>n.owners.length===0)}return De(e,this.kind,this.search)}shownOf(e){let t=this.onTab(e);return this.kind!=="pages"||this.screensFilter==="all"?t:t.filter(n=>Bn(this.screensFilter,n.item))}emptyHere(e){if(this.kind==="pages"&&this.screensFilter!=="all"&&this.search.trim()==="")return Hn;if(this.view==="cards"&&this.search.trim()===""){let t=this.filterDevice(),n=v(this.kind,2),i=this.lib.library;if(t!==void 0)return i!==void 0&&this.waiting(i).has(t.ownerId)?le(n,t.name,t.appVersion):`No ${n} on ${t.name} yet.`;if(ee(this.kind))return`Every ${v(this.kind)} is on a device.`}return Re(e,this.search,this.kind)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(P(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Rn(this.selected,this.shownNow().map(P)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let n=e.metaKey||e.ctrlKey;if(!this.selecting&&!n){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!n)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let n=P(e);this.selected=t?Ln(this.selected,this.shownNow().map(P),this.anchor,n):Dn(this.selected,n),this.anchor=n,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(P);this.selected=e?Cn(this.selected,t):Fn(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.bulkBusy!==void 0)return;let i=this.devices,s=se(e,i,R),r=Oe({kind:s.kind,gone:[],kept:s.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=s.kept.length>0?r:void 0,s.items.length===0)return;let d=s.items.length;ut({text:`Deleted ${d===1?s.items[0].name:On(s.kind,d)}.`,hide:s.items.map(c=>ht(s.kind,c.id)),send:async()=>{let c;try{c=Oe(await En(Nt(t),{...s,kept:[]},i))}catch(p){c={kind:"err",text:j(p).message}}return await n.refresh(),c.kind==="ok"?void 0:c.text}})}renderItemDelete(e,t){return l`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${n=>{n.stopPropagation(),this.itemAsk=P(e)}}>${$("delete")}</button>`}renderItemAsk(e,t,n){let i=se([e],t,R),s=Ee(i,t),r=()=>{this.itemAsk=void 0},d=()=>{r(),this.deleteEntries([e])},c=n!==void 0&&e.owners.some(u=>f(u,n.ownerId))&&e.owners.some(u=>!f(u,n.ownerId))?n:void 0,p=i.items.length>0;return l`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${u=>u.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${s.body}</span>
      <span class="ap-ask-acts">
        ${p?c===void 0?l`<button type="button" class="ap-ask-btn danger" @click=${d}>Really delete</button>`:l`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${c.name} only`}
              @click=${()=>{r(),this.tick(e,c.ownerId,!1)}}>${tn}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${d}>${nn}</button>`:h}
        <button type="button" class="ap-ask-btn" @click=${r}>${p?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return l`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,n=this.lib.library,i=this.lib.readState,s=this.filterDevice(),r=v(t,2),d=this.view,c=n===void 0?i==="unsupported"?pe:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:un(N(n,t).length,t),p=n!==void 0&&i==="failed";return l`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${Ne(t)}</h1>
          <p class="ap-lead">${c}</p>
        </div>
        ${e.length===0?h:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?h:this.renderNewDialog(this.newForm,e)}
      ${this.pageForm===void 0?h:this.renderPageSheet(this.pageForm,e)}
      ${this.copyForm===void 0?h:this.renderCopy(this.copyForm)}
      ${p?l`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:h}
      ${this.renderTwoScreensCard(n)}
      ${n===void 0?h:X(this.hassNow,this.owners,n,t)}
      <div class="pk-surface pk-page ${d==="board"?"on-board":""}" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(n,s,d)}
          ${d==="cards"&&n!==void 0&&e.length>0?this.renderTabs(n,e):h}
          ${this.selecting&&d!=="board"?this.renderBar(e):h}
        </div>
        <div class="pk-body" id=${d==="cards"?"pk-tabpanel":h} role=${d==="cards"?"tabpanel":h}>
          ${n===void 0?l`<p class="ap-empty">${c}</p>`:d==="cards"?this.renderAll(n,e):s!==void 0?this.renderFocus(n,Le(n,s,t,this.search),e):this.renderBoardAll(n,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${gn(t,s,this.selecting&&(s===void 0||d==="cards"),d)}</span></div>
      </div>
    </div></div>`}renderTwoScreensCard(e){return this.kind!=="pages"||e===void 0||N(e,"pages").length===0||Un()?h:l`<div class="ap-upgrade" role="note">
      ${$("info")}<span>${Wn}</span>
      <button type="button" class="ap-upgrade-x" title="Dismiss" aria-label="Dismiss"
        @click=${()=>{jn(),this.requestUpdate()}}>${$("close")}</button>
    </div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,n=v(this.kind,2),i=this.lib.readState;if(e===void 0){let r=i==="unsupported"?pe:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${n}\u2026`;return l`<p class="ap-empty">${r}</p>`}if(t.length===0)return l`<p class="ap-empty">No device can have ${n}.</p>`;let s=N(e,this.kind).length===0?l`<p class="ap-empty">No ${n} yet.</p>`:this.renderBoardAll(e,t);return l`${this.saved?l`<span class="bd-saved ap-embed-saved" role="status">${$("check")}<span>Saved</span></span>`:h}${X(this.hassNow,this.owners,e,this.kind)}${s}`}renderAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;let i=this.shownOf(e);if(i.length===0)return l`<p class="ap-empty">${this.emptyHere(t)}</p>`;let s=this.waiting(e);return l`<div class="ap-grid ${this.comparingScreens()?"differ":""}" role="list">${i.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||N(e,this.kind).length>0)return;let n=this.mayMake,i=this.waiting(e),s=i.size>0;return l`<div class="ap-empty-lib">
      <p>${mn(this.kind,n)}</p>
      ${s?l`<p class="ap-empty-wait">${Ue(v(this.kind,2),je(t,i))}</p>`:h}
      ${n?l`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>New ${v(this.kind)}</span></button>`:h}
    </div>`}renderHead(e,t,n){let i=this.selecting,s=this.bulkBusy!==void 0,r=v(this.kind,2);return l`<div class="pk-head">
      ${qt(n,d=>this.setView(d),r)}
      ${n==="board"?Gt(Pe(),d=>{Vt(d),this.requestUpdate()}):h}
      ${t===void 0||n==="cards"?l`<button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${v(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${$("checklist")}<span>Multi select</span></button>`:h}
      ${this.saved?l`<span class="bd-saved" role="status">${$("check")}<span>Saved</span></span>`:h}
      ${this.kind==="pages"&&(t===void 0||n==="cards")?this.renderScreensFilter():h}
      <label class="pk-search">
        ${$("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderScreensFilter(){let e=(t,n,i)=>l`<button type="button" class="ap-filter-opt ${this.screensFilter===t?"on":""}"
      role="radio" aria-checked=${this.screensFilter===t?"true":"false"} data-filter=${t} title=${i}
      @click=${()=>{this.screensFilter=t,this.pruneSelected()}}>${n}</button>`;return l`<span class="ap-filter" role="radiogroup" aria-label="Show">
      ${e("all","All","Every page")}${e("differ",An,"The pages the watch and the iPhone arrange apart, or with a tile off on one")}
    </span>`}renderNew(e,t){let n=`New ${v(this.kind)}`;if(e!==void 0)return l`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${te(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${$("plus")}<span>${n}</span></button>
      </div>`;let i=this.mayMake,s=this.newForm!==void 0||this.pageForm!==void 0;return l`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!i||this.newForm?.busy===!0||this.pageForm?.busy===!0}
        title=${i?`Make ${te(this.kind)} no device has yet`:hn(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>${n}</span></button>
    </div>`}renderNewDialog(e,t){let n=ve(this.homeMapDoc());return Mt(this.kind,e,L(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMapPage:i=>{this.newForm={...e,mapPage:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?n===void 0?{}:{refusal:n}:void 0)}homeMapDoc(){return Ve(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,n,i){let s=this.lib.store,r=P(t),d=s?.noteFor(t.kind,t.id),c=d===void 0?this.tickNotes.get(r):{kind:"warn",text:d},p=this.untickAsk,u=p!==void 0&&p.kind===t.kind&&f(p.itemId,t.id)?p:void 0,k=this.hassNow?.user?.is_admin,w=t.kind==="pages"?gt(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:n,colorOf:this.colorOf,skips:w,...s===void 0?{}:{pending:s.pending},...c===void 0?{}:{note:c.text,noteKind:c.kind},...u===void 0?{}:{ask:{ownerId:u.ownerId,text:u.text,onRemove:()=>{this.untickNow(u)},onCancel:()=>{this.untickAsk=void 0}}},...k===void 0?{}:{admin:k},locked:S=>{let T=nt(e,S,t.kind,t.id);if(T&&R(S,t.kind))return Y(t.kind,n.find(x=>x.ownerId===S)?.name??"This device");if(!T&&i.has(S))return q(n.find(x=>x.ownerId===S)?.appVersion)}}}renderCardTicks(e,t,n,i){return It(this.ticksInput(e,t,n,i),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,n,i){let s=this.selecting,r=P(t),d=s&&this.selected.has(r),c=this.filterDevice()??Ce(t,n),p=this.openTitle(t),u=w=>this.cardClick(w,t),k=!s&&this.itemAsk===r;return l`<div class="ap-card ${s?"picking":""} ${d?"picked":""} ${k?"asking":""}" role="listitem" data-card=${r}
      @click=${w=>{s&&u(w)}}>
      <div class="ap-top">
        ${s?l`<input type="checkbox" class="pk-card-pick" .checked=${E(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${w=>{w.stopPropagation(),this.pick(t,w.shiftKey)}} />`:h}
        <button type="button" class="ap-open" title=${p} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${ne(t)}</small>
        </button>
        ${s||t.kind!=="pages"?h:this.renderCopyButton(t)}
        ${s?h:this.renderItemDelete(t,"ap-del")}
      </div>
      ${this.screensLineOf(t,n)===void 0?h:l`<small class="ap-screens">${this.screensLineOf(t,n)}</small>`}
      <div class="ap-thumb-wrap">
        <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} style=${this.thumbWellStyle(t,n)} @click=${u}>
          ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderCardPictures(e,t,c,n)}
        </button>
        ${t.kind==="status_pages"?h:this.renderCardScreenIcons(t,n)}
      </div>
      ${this.renderCardTicks(e,t,n,i)}
      ${k?this.renderItemAsk(t,n):h}
    </div>`}screensLineOf(e,t){return e.kind==="pages"?_n(e.item,e.owners,t):void 0}renderCopyButton(e){return l`<button type="button" class="ap-del ap-copy" title=${e.owners.length<2?xe:`Make a copy of ${e.name} for some devices`} aria-label=${`Make a copy of ${e.name}`}
      ?disabled=${e.owners.length<2}
      @click=${t=>{t.stopPropagation(),this.openCopy(e)}}>${$("duplicate")}</button>`}openTitle(e){if(this.selecting){let t=this.selected.has(P(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return Fe(e.name)}boardColumns(e,t){let n=this.waiting(e);return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:B(e,i.ownerId,this.kind),...n.has(i.ownerId)?{blocked:Xt(i.appVersion,q(i.appVersion))}:{}}))}renderBoardAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;if(t.length===0)return l`<p class="ap-empty">${Re(t,this.search,this.kind)}</p>`;let i=this.waiting(e),s=this.shownOf(e);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,i)),empty:this.emptyHere(t)}])}renderBoardOf(e,t,n,i){let s=v(this.kind),r=v(this.kind,2);return Jt({label:`${Ne(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...i===void 0?{}:{focus:i},onFocus:d=>this.setFocus(d),wide:this.roomy.wide,ordered:!0,focusTitle:d=>`See ${d.name}'s ${r} in its order, and drag to change it`,sections:n,...this.embedded?{}:{legend:{tick:"on that device",focus:"in a device's header to see and drag its order",saves:"Ticks save at once, with Undo",...this.kind==="pages"?{eye:"hide but keep its place"}:{}}},...this.selecting&&i===void 0?{pinned:this.renderBar(t)}:{}})}boardRow(e,t,n,i,s){let r=this.ticksInput(e,t,n,i),d=St(r),c=t.kind==="pages"?t.item:void 0,p=c===void 0?0:G(c).length,u=c!==void 0&&p>0&&(r.skips?.length??0)>=p,k=d.map(b=>{if(!b.on&&!b.busy&&i.has(b.ownerId))return{dashTitle:b.title};let D={chip:{...b,title:Yt(b)},onPick:de=>{this.tick(t,b.ownerId,de)}};if(s?.order!==void 0&&b.on&&f(b.ownerId,s.device.ownerId)&&(D.order=s.order.at+1),b.on&&b.device==="watch"&&u?(D.note="shows nothing",D.noteWarn=!0,D.noteTitle=`Every tile on ${t.name} is iPhone only, so ${b.name} shows an empty page.`):b.skips!==void 0&&(D.note=b.skips.text,D.noteTitle=b.skips.title),s?.pick!==void 0&&f(b.ownerId,s.device.ownerId)&&t.kind==="pages"){let de=hi(s.device.ownerId,t.id),ce=this.hiddenAsked.get(de)??s.pick.hidden;D.eye={hidden:ce,busy:this.picksBusy,title:ce?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!ce})}}}return D}),w=this.selecting&&s===void 0,S=P(t),T=this.screensLineOf(t,n),x={key:S,name:t.name,detail:T===void 0?ne(t):`${ne(t)} \xB7 ${T}`,picture:this.rowPictures(t,n,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`${Fe(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:b=>{if(s?.pick!==void 0&&!b.metaKey&&!b.ctrlKey){this.open(t);return}this.cardClick(b,t)},cells:k,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}},peek:()=>({picture:t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumbs(e,t,Ce(t,n),n),where:Pn(t,n,s?.order===void 0?void 0:{device:s.device,at:s.order.at})})};return w?x.select={picked:this.selected.has(S),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:b=>this.pick(t,b.shiftKey)}:(x.actions=this.renderItemDelete(t,"bd-act danger"),x.more=this.rowMore(t,s),this.itemAsk===S&&(x.under=this.renderItemAsk(t,n,s?.device))),x}rowMore(e,t){let n=[{label:"Open",onPick:()=>this.open(e)}];e.kind==="pages"&&n.push({label:"Make a copy\u2026",disabled:e.owners.length<2,title:e.owners.length<2?xe:`Make a copy of ${e.name} for some of its devices`,onPick:()=>this.openCopy(e,t===void 0?[]:[t.device.ownerId])});let i=t?.order;if(t!==void 0&&i!==void 0){let s=i.ids[0],r=d=>{this.changePicks(t.device,{id:e.id,before:d},[...i.ids])};i.at>0&&s!==void 0&&n.push({label:"Move to top",onPick:()=>r(s)}),i.at<i.ids.length-1&&n.push({label:"Move to bottom",onPick:()=>r(null)})}else t===void 0&&n.push({label:"Pick several",title:`Pick several ${v(this.kind,2)} to delete together`,onPick:()=>this.pick(e,!1)});return n}rowPictures(e,t,n){if(e.kind==="status_pages")return this.rowPicture(e,n);let i=L(t),s=i.length===0?["watch"]:i,r=d=>n?.kind===d?n:t.find(c=>c.kind===d&&e.owners.some(p=>f(p,c.ownerId)));return l`<span class="ap-pics">${s.map(d=>this.rowPicture(e,r(d),d))}</span>`}rowPicture(e,t,n){let i=Pe()==="compact";if(e.kind==="status_pages")return sn({page:e.item,hass:this.hassNow,width:i?Q:this.roomy.size(Ae),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let s=this.appVersionOf(t),r=(n??t?.kind)==="iphone",d=i?r?Math.round(Q*li/Ae):Q:this.roomy.size(r?li:Ae);return Ie({page:e.item,width:d,tick:this.iconsTick,iphone:r,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...s===void 0?{}:{appVersion:s},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...r?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>f(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,n){let{device:i}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===i.ownerId&&s.kind===this.kind?s.ids:void 0,d=wn(t.picks,r),c=d.map(x=>x.id),p=B(e,i.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,k=this.waiting(e),w=v(this.kind,2),S=d.map((x,b)=>this.boardRow(e,x.entry,n,k,{device:i,pick:x,drag:this.rowDrag(x,b,c,i,u),order:{at:b,ids:u?c:[]}})),T=t.rest.map(x=>this.boardRow(e,x,n,k,{device:i}));return l`${this.renderFocusHead(i,p)}
      ${this.picksNote===void 0?h:l`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${this.renderBoardOf(e,n,[{key:"on",title:vn(i),count:p,hint:yn(i),rows:S,empty:k.has(i.ownerId)&&this.search.trim()===""?le(w,i.name,i.appVersion):In(i,this.kind,this.search,t.rest.length,this.mayMake)},...Sn(p,t.rest.length,this.search)?[{key:"rest",title:xn(i),count:t.rest.length,hint:$n(i),rows:T,empty:this.search.trim()===""?`Every ${v(this.kind)} in your home is on ${i.name}.`:`No other ${v(this.kind)} has that name.`}]:[]],i.ownerId)}
      <p class="lt-line bd-foot-line">${p} ${p===1?v(this.kind):w} on ${i.name}.</p>`}renderFocusHead(e,t){let n=ze(e.kind),i=v(this.kind,t);return Qt({device:e,color:this.colorOf(e.ownerId),text:`${t} ${i}, in the order the ${n} ${this.kind==="pages"?"shows":"keeps"} them`,...this.onOpenScreen===void 0?{}:{onOwn:s=>this.onOpenScreen?.(e.ownerId,e.kind,s)},onAll:()=>this.setFocus(void 0)})}rowDrag(e,t,n,i,s){let r=this.overId!==void 0&&f(this.overId,e.id)&&this.dragId!==void 0&&!f(this.dragId,e.id),d=c=>{c!==void 0&&this.changePicks(i,{id:e.id,before:c},[...n])};return{on:s,dragging:this.dragId!==void 0&&f(this.dragId,e.id),over:r,below:r&&n.findIndex(c=>f(c,this.dragId))<t,onStart:c=>{s&&(this.dragId=e.id,c.dataTransfer?.setData("text/plain",e.id),c.dataTransfer&&(c.dataTransfer.effectAllowed="move"))},onOver:c=>{this.dragId!==void 0&&(c.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:c=>{c.preventDefault();let p=this.dragId;this.dragId=void 0,this.overId=void 0;let u=p===void 0?void 0:kn(n,p,e.id);u!==void 0&&this.changePicks(i,u,[...n])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:c=>{!c.altKey||!s||c.key!=="ArrowUp"&&c.key!=="ArrowDown"||(c.preventDefault(),c.key==="ArrowUp"?d(t>0?n[t-1]:void 0):d(t<n.length-1?n[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),n=t.filter(k=>this.selected.has(P(k))),i=n.length,s=this.bulkBusy!==void 0,r=i===0,d=t.length>0&&t.every(k=>this.selected.has(P(k))),c=s?void 0:this.bulkNote,p=v(this.kind),u=v(this.kind,2);return l`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${te(this.kind)} to start.`:`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${d?`Let the ${u} on screen go`:`Pick every ${p} the search has left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${c===void 0?h:l`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(n,e):l`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${u} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${$("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${p} at a time`}
        @click=${()=>this.endSelect()}>${$("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let n=se(e,t,R),i=Ee(n,t);return l`<span class="pk-bar-ask" id="ap-del-ask"><b>${i.title}</b> ${i.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${n.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,n,i=K){let s=ue(t.item,"watch"),r=n===void 0?[]:Xe(st(e,n.ownerId)),d=r.length===0?[s]:r,c=this.hassNow?.states,p=this.icons,u=i/C.width,k=this.thumbHeight(s,i),w=k>oe,S=pi(s,c,p),T=b=>`${Math.round(b*100)/100}px`,x=n?.kind==="watch"?this.appVersionOf(n):void 0;return l`<span class="ap-pic ${w?"cut":""}" style=${`width:${T(i)};height:${T(Math.min(k,oe))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${T(-S.top*u)})`}>${bt({page:s,pages:d,screen:C,scale:u,...c===void 0?{}:{states:c},...p===void 0?{}:{icons:p},...x===void 0?{}:{appVersion:x},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask})}</span>
    </span>`}thumbHeight(e,t){return pi(e,this.hassNow?.states,this.icons).height*(t/C.width)}comparingScreens(){return this.kind==="pages"&&this.screensFilter==="differ"}cardDrawsBoth(e){return e.length===2&&this.comparingScreens()}cardWatchHeight(e,t){return Math.min(this.thumbHeight(ue(e.item,"watch"),t),oe)}thumbWellStyle(e,t){if(e.kind==="status_pages")return h;let n=re(e.owners,t);return n.length===2&&!this.cardDrawsBoth(n)?`min-height:${Math.round(this.cardWatchHeight(e,K))+20}px`:h}renderCardPictures(e,t,n,i){let s=re(t.owners,i);if(this.cardDrawsBoth(s))return this.renderThumbs(e,t,n,i,!0);if(Me(s,this.cardPick(t))==="watch")return this.renderThumb(e,t,n?.kind==="watch"?n:void 0);let r=s.includes("watch")?this.cardWatchHeight(t,K):di;return l`<span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,oi,r)}</span>`}cardPick(e){return this.cardPicks.get(P(e))??this.filterDevice()?.kind}renderCardScreenIcons(e,t){let n=re(e.owners,t);if(L(t).length<2||this.cardDrawsBoth(n))return h;let i=P(e),s=Me(n,this.cardPick(e)),r=c=>$(c==="watch"?"watch":"phone"),d=c=>c==="watch"?"watch":"iPhone";return n.length<2?l`<span class="ap-screen-icons"><span class="ap-screen-icon on ${s}" data-card-screen=${s} title=${`On ${s==="watch"?"a":"an"} ${d(s)} only`}>${r(s)}</span></span>`:l`<span class="ap-screen-icons" role="group" aria-label="Show this page on">${n.map(c=>l`<button type="button"
      class="ap-screen-icon ${c} ${c===s?"on":""}" data-card-screen=${c} aria-pressed=${c===s?"true":"false"}
      title=${`Show it on the ${d(c)}`} aria-label=${`Show it on the ${d(c)}`}
      @click=${p=>{p.stopPropagation(),this.cardPicks=new Map(this.cardPicks).set(i,c)}}>${r(c)}</button>`)}</span>`}renderPhoneThumb(e,t,n,i){let s=t.find(d=>d.kind==="iphone"&&e.owners.some(c=>f(c,d.ownerId))),r=this.appVersionOf(s);return Ie({page:e.item,width:n,maxHeight:Math.max(1,Math.round(i)),tick:this.iconsTick,iphone:!0,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...r===void 0?{}:{appVersion:r},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,homeMap:this.homeMapDoc()})}renderThumbs(e,t,n,i,s=!1){let r=L(i);if(!r.includes("iphone"))return this.renderThumb(e,t,n);let d=r.includes("watch"),c=s?Ni:Ii,p=d?s?Di:Ti:oi,u=d?this.cardWatchHeight(t,c):di;return l`<span class="ap-pics ap-card-pics ${s?"large":""}">
      ${d?this.renderThumb(e,t,n?.kind==="watch"?n:void 0,c):h}
      <span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,p,u)}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,n=K/C.width,i=d=>`${Math.round(d*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return l`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${i(K)};height:${i(Math.min(C.height*n,oe))}`}>
      <span class="ap-pic-in">${t===void 0?h:xt({page:e.item,hass:t,icons:this.icons??ot,screen:C,scale:n})}</span>
    </span>`}static{this.styles=[yt,mt,$t,Nn,Tn,Tt,an,At,ri,Et,Zt,en,ln,z`
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
  `]}};g([I({attribute:!1})],m.prototype,"kind",2),g([I({attribute:!1})],m.prototype,"owners",2),g([I({attribute:!1})],m.prototype,"ownersReady",2),g([I({attribute:!1})],m.prototype,"phones",2),g([I({attribute:!1})],m.prototype,"icons",2),g([I({attribute:!1})],m.prototype,"iconsTick",2),g([I({attribute:!1})],m.prototype,"onOpenLibrary",2),g([I({attribute:!1})],m.prototype,"focusOwner",2),g([I({attribute:!1})],m.prototype,"onFocus",2),g([I({attribute:!1})],m.prototype,"onOpenScreen",2),g([I({type:Boolean,reflect:!0})],m.prototype,"embedded",2),g([I({attribute:!1})],m.prototype,"searchText",2),g([y()],m.prototype,"search",2),g([y()],m.prototype,"newForm",2),g([y()],m.prototype,"pageForm",2),g([y()],m.prototype,"copyForm",2),g([y()],m.prototype,"screensFilter",2),g([y()],m.prototype,"cardPicks",2),g([y()],m.prototype,"selecting",2),g([y()],m.prototype,"selected",2),g([y()],m.prototype,"asking",2),g([y()],m.prototype,"bulkBusy",2),g([y()],m.prototype,"itemAsk",2),g([y()],m.prototype,"bulkNote",2),g([y()],m.prototype,"tickNotes",2),g([y()],m.prototype,"untickAsk",2),g([y()],m.prototype,"picksBusy",2),g([y()],m.prototype,"picksNote",2),g([y()],m.prototype,"orderAsked",2),g([y()],m.prototype,"hiddenAsked",2),g([y()],m.prototype,"dragId",2),g([y()],m.prototype,"overId",2),g([y()],m.prototype,"freeFacts",2),g([y()],m.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",m);export{m as WaAllPages,pi as pageCrop};
