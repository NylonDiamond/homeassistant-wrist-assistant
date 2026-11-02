import{b as Ft}from"./chunk-ANVSCF6T.js";import{a as gn,b as fn}from"./chunk-PGNEOEXN.js";import{A as ln,B as hn,C as un,D as mn,E as $e,b as be,c as Xt,e as Gt,f as v,g as J,h as Yt,i as ve,j as Jt,k as Qt,l as Zt,m as Q,n as en,o as tn,q as nn,r as sn,s as an,t as rn,u as on,v as ye,w as xe,x as dn,y as pn,z as cn}from"./chunk-NQGIVGJQ.js";import{i as ut,l as mt}from"./chunk-WNKR7RIT.js";import{d as de}from"./chunk-BM26GRFX.js";import{b as he,c as ue,d as G,i as ge,j as fe,k as yt,l as xt,m as $t,n as Pt,o as It,p as St}from"./chunk-5XPZZFGV.js";import{a as bt,b as le,d as Lt,m as Ct}from"./chunk-HY6G6YVR.js";import{c as me,d as vt}from"./chunk-X73TJ4FS.js";import{a as Nt,b as Tt,c as Dt}from"./chunk-6O6VMJNF.js";import"./chunk-PZ7S54GJ.js";import"./chunk-Q5FJKPKU.js";import{A as we,b as Y,c as ke,d as Et,e as Rt,f as Ot,g as Mt,h as _t,i as At,j as Bt,k as Ht,l as Vt,m as Kt,o as Wt,p as Ut,q as zt,x as jt,y as qt}from"./chunk-4RYJU7MX.js";import{a as pe,b as it,c as st,p as gt,s as ft,t as kt,y as wt}from"./chunk-XUEEV655.js";import"./chunk-5PIGGL4R.js";import{p as se}from"./chunk-MDGPCNEL.js";import"./chunk-C6K36PU4.js";import{d as ce,e as X}from"./chunk-7ONE4WJ6.js";import{X as w,_ as D,da as qe,ea as Xe,la as Ge,ma as q,w as je,x as oe}from"./chunk-OUIHU54Q.js";import{a as Ee,c as Re,d as R,f as z,g as Oe,h as Me,i as _e,j as Ae,k as Be}from"./chunk-ZYSWWJNQ.js";import{Bb as ht,ab as ot,db as dt,pb as pt,ub as ct,wb as lt}from"./chunk-QZ5XWXT5.js";import{db as rt}from"./chunk-WJH6ZBL5.js";import"./chunk-H7Q7TLLO.js";import"./chunk-QZUQL2HQ.js";import"./chunk-RZXF57D2.js";import{b as tt,c as nt}from"./chunk-HG4FKA45.js";import{e as at}from"./chunk-FUHON6NJ.js";import"./chunk-JMDXRNSE.js";import{C as Je,q as Ye}from"./chunk-YQ3UMYHB.js";import"./chunk-4Z22ZXCD.js";import{c as Qe}from"./chunk-JOXYKU7O.js";import{vb as et,z as Ze}from"./chunk-ZHJKWBFJ.js";import"./chunk-JSELYQRB.js";import{j as A}from"./chunk-UCO5DASE.js";import{g as Fe}from"./chunk-TPW5WK27.js";import"./chunk-FJIHFDLG.js";import"./chunk-LAHOQN2Z.js";import"./chunk-WXP32YDG.js";import{Je as W,Jg as Ce,b as K,d as l,g as m,j as Le,l as N,m as y,xh as $}from"./chunk-G7AAB2LI.js";import{H as ze,f as Ue,g as _}from"./chunk-2VK47YDQ.js";import{$ as ae,A as Ke,Z as We,aa as re,k as He,l as j,m as O,n as Ve,q as M}from"./chunk-NKZCOZL2.js";import{lb as U}from"./chunk-Y7CHJ2K5.js";import{a as g}from"./chunk-LO2NM3CE.js";function ti(s,o,e){return`${s} ${s===1?o:e}`}function kn(s,o){let e=new Set(s);return e.has(o)?e.delete(o):e.add(o),e}function wn(s,o,e,t){let n=new Set(s),i=o.indexOf(t),a=e===void 0?-1:o.indexOf(e);if(i<0)return n;if(a<0)return n.add(t),n;for(let r=Math.min(a,i);r<=Math.max(a,i);r++)n.add(o[r]);return n}function bn(s,o){return new Set([...s,...o])}function vn(s,o){let e=new Set(o);return new Set([...s].filter(t=>!e.has(t)))}function yn(s,o){let e=new Set(o);return new Set([...s].filter(t=>e.has(t)))}function I(s){return s.id.toUpperCase()}function Z(s,o,e){let n={kind:s[0]?.kind??"pages",items:[],kept:[],devices:[]},i=new Set;for(let a of s){let r=o.filter(p=>a.owners.some(c=>w(c,p.ownerId))).map(p=>p.ownerId),d=r.filter(p=>e(p,a.kind));if(d.length>0){n.kept.push({name:a.name,dirty:d});continue}n.items.push({id:a.id,name:a.name,owners:[...a.owners]});for(let p of r)i.add(p)}return n.devices=o.map(a=>a.ownerId).filter(a=>i.has(a)),n}var B=(s,o)=>s.find(e=>w(e.ownerId,o))?.name??"a device";function Pe(s,o){let e=s.items.length,t=e===1?"it":"them",n=`Delete ${e} ${v(s.kind,e)}?`,i=s.devices.map(d=>B(o,d)),a=s.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[i.length===0?`${e===1?"It is":"They are"} on no device yet. ${pe}`:`${e===1?"It comes":"They come"} off ${R(i)}, ${a}. ${pe}`];for(let d of s.kept){let p=d.dirty.map(c=>B(o,c));r.push(`${d.name} stays: ${R(p)} ${p.length===1?"has":"have"} unsaved edits.`)}return{title:n,body:r.join(" ")}}async function xn(s,o,e,t){let n={kind:o.kind,gone:[],kept:o.kept.map(a=>({...a,dirty:[...a.dirty]})),failed:[],stuck:[],taps:[]},i=new Map;for(let[a,r]of o.items.entries()){t?.(`Deleting ${r.name} (${a+1} of ${o.items.length})\u2026`);let d=await s.delete(o.kind,r.id);if(!d.ok){n.failed.push({name:r.name,text:d.text});continue}n.gone.push(r.name);for(let p of d.reply.link_failures??[]){let c=p.name??B(e,p.owner);n.stuck.includes(c)||n.stuck.push(c)}for(let p of r.owners)i.set(p,[...i.get(p)??[],r.id])}if(o.kind==="pages")for(let[a,r]of i){t?.(`Clearing complication taps on ${B(e,a)}\u2026`);let d=!1;try{d=await s.clearTaps(a,r)}catch{d=!1}d||n.taps.push(B(e,a))}return n}function Ie(s){let o=i=>`${i} ${v(s.kind,i)}`,e=[];s.gone.length>0&&e.push(`Deleted ${s.gone.length===1?s.gone[0]:o(s.gone.length)}.`);let t=e.length>0,n=!1;for(let i of s.kept)n=!0,e.push(`Kept ${i.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let i of s.failed)n=!0,e.push(`Not deleted: ${i.name}. ${i.text}`);return s.stuck.length>0&&(n=!0,e.push(`Could not take ${s.gone.length===1?"it":"them"} off ${R(s.stuck)}.`)),s.taps.length>0&&(n=!0,e.push(`Could not clear the complication taps that opened ${s.gone.length===1?"it":"them"} on ${R(s.taps)}. Change those by hand.`)),!t&&!n?{kind:"ok",text:"Nothing was deleted."}:{kind:n?t?"warn":"err":"ok",text:e.join(" ")}}function $n(s,o){return ti(o,v(s),v(s,2))}function ee(s,o){return j(s).filter(e=>Ke(e,o)&&!We(s,e,o)).length}function ni(s){return M(s)?!1:!ae(s)||ee(s,"watch")>0||ee(s,"iphone")>0}var Pn=s=>`${s} ${s===1?"tile":"tiles"}`;function In(s,o,e){let t=new Set(e.map(r=>r.kind)),n=new Set(e.filter(r=>o.some(d=>w(d,r.ownerId))).map(r=>r.kind));if(t.size>1&&n.size===1)return n.has("watch")?"Watch only":"iPhone only";if(M(s))return;let i=ee(s,"watch");if(i>0)return`${Pn(i)} off on the watch`;let a=ee(s,"iphone");return a>0?`${Pn(a)} off on the iPhone`:ae(s)?void 0:"iPhone arranged differently"}var Sn="Screens differ";function Nn(s,o){return s==="all"||ni(o)}var Tn="Every page is arranged the same on the watch and the iPhone.",Dn="Watch and iPhone can now be arranged apart. Nothing has changed on your devices.",Ln="wa-pages-two-screens-card-dismissed";function Cn(s){if(s!==void 0)return s;try{return globalThis.localStorage}catch{return}}var Fn=!1;function En(s){if(Fn)return!0;try{return Cn(s)?.getItem(Ln)==="1"}catch{return!1}}function Rn(s){Fn=!0;try{Cn(s)?.setItem(Ln,"1")}catch{}}var ii="dialog.lib-new-page",si=new Set(["light","switch","input_boolean","fan","cover","lock","climate","media_player","scene","script"]);function ai(s){let o=new Set;for(let e of Object.keys(s?.states??{})){if(!Mn(s,e))continue;let t=de(s,e);t!==void 0&&o.add(t)}return Object.entries(s?.areas??{}).filter(([e])=>o.has(e)).map(([e,t])=>({id:e,name:typeof t?.name=="string"&&t.name.trim()!==""?t.name.trim():e})).sort((e,t)=>e.name.localeCompare(t.name))}function Mn(s,o){let e=s?.entities?.[o];return e?.hidden!==!0&&(e?.entity_category??null)===null}function C(s,o){let e={controls:[],more:[]};if(o===void 0)return e;for(let[n,i]of Object.entries(s?.states??{})){if(!Mn(s,n)||de(s,n)!==o)continue;let a=i?.attributes?.friendly_name,r=typeof a=="string"&&a.trim()!==""?a.trim():n,d=n.slice(0,n.indexOf("."));(si.has(d)?e.controls:e.more).push({entityId:n,name:r})}let t=(n,i)=>n.name.localeCompare(i.name)||n.entityId.localeCompare(i.entityId);return e.controls.sort(t),e.more.sort(t),e}function H(s,o){let e=[...o.controls,...o.more].map(t=>t.entityId);return s.picked===void 0?o.controls.map(t=>t.entityId):e.filter(t=>s.picked.includes(t))}function _n(s,o,e,t){let n=H(s,o),i=t?[...n.filter(d=>d!==e),e]:n.filter(d=>d!==e),{note:a,...r}=s;return{...r,picked:i}}var An="wa-new-page-devices",Se;function Bn(s){try{let o=(s??globalThis.localStorage)?.getItem(An),e=o?JSON.parse(o):void 0;if(Array.isArray(e))return e.filter(t=>typeof t=="string")}catch{}return Se===void 0?void 0:[...Se]}function Hn(s,o){Se=[...s];try{(o??globalThis.localStorage)?.setItem(An,JSON.stringify(s))}catch{}}function Vn(s,o,e){let t=s.filter(n=>e?.(n.ownerId)!==!0);return o===void 0?t.map(n=>n.ownerId):t.filter(n=>o.some(i=>w(i,n.ownerId))).map(n=>n.ownerId)}function Kn(s,o){return{name:s,busy:!1,owners:o,start:"empty"}}function Wn(s,o,e,t){let n=t?o.filter(i=>w(i.ownerId,e)||s.owners.some(a=>w(a,i.ownerId))).map(i=>i.ownerId):s.owners.filter(i=>!w(i,e));return{...s,owners:n}}function V(s,o){if(s.name.trim()==="")return"Type a name to start.";if(s.start==="room"){if(s.areaId===void 0)return"Pick a room.";if(H(s,C(o.hass,s.areaId)).length===0)return"Tick something in the room."}if(s.start==="page"&&(s.fromPage===void 0||!o.pages.some(e=>w(O(e),s.fromPage))))return"Pick a page to start from.";if(s.start==="map"&&o.mapFloorId===void 0)return o.mapRefusal??"Scan a room in the iPhone app first."}function Un(s,o,e){if(V(s,o)!==void 0)return;let t=s.name.trim(),n=e.toUpperCase();if(s.start==="map")return{schemaVersion:1,pages:[G(n,t,o.mapFloorId)]};if(s.start==="page"){let r=o.pages.find(d=>w(O(d),s.fromPage));return{schemaVersion:1,pages:[ze(r,n,t)]}}let i={schemaVersion:1,pages:[_(n,t)]};if(s.start!=="room")return i;let a={states:o.hass?.states??{},...o.hass?.entities===void 0?{}:{entities:o.hass.entities}};for(let r of H(s,C(o.hass,s.areaId)))i=Je(i,n,{kind:"entity",...Ye(a,r)},{last:!0}).document;return i}function ri(s,o,e){let t=V(s,o);if(t!==void 0)return t;let n=s.name.trim(),i=e.filter(r=>s.owners.some(d=>w(d,r.ownerId))),a=i.length===0?"on no device yet. Tick a device any time.":i.length===1?`on ${i[0].name}.`:`on ${i.length} devices.`;if(s.start==="room"){let r=H(s,C(o.hass,s.areaId)).length;return`${n}, ${r} ${r===1?"tile":"tiles"}, ${a}`}return`${n}, ${s.start==="map"?"a map page":"a page"} ${a}`}var oi={empty:"Empty",room:"From a room",page:"From a page",map:"Home map"};function On(s,o){switch(s){case"empty":return"Add tiles yourself.";case"room":return"A tile for each thing in a room you tick.";case"page":return"A copy of a page's tiles, to change on its own.";case"map":return o??"On the iPhone the whole page is your home's live map. The watch shows it as one tile."}}function di(s){return s==="room"?"home":s==="page"?"duplicate":s==="map"?"place":"grid"}function zn(s,o,e,t,n){return l`<label class="np-check" title=${n??m}>
    <input type="checkbox" .checked=${A(s)} ?disabled=${e} @change=${i=>t(i.target.checked)} />
    <span>${o}</span>
  </label>`}function pi(s,o,e){let t=(n,i)=>{let a=o.devices.filter(r=>r.kind===n);return a.length===0?m:l`<div class="np-group" role="group" aria-label=${i}>
      <span class="np-kind">${$(n==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${a.map(r=>{let d=o.locked?.(r.ownerId);return zn(s.owners.some(p=>w(p,r.ownerId)),r.name,s.busy||d!==void 0,p=>e.onDevice(r.ownerId,p),d)})}
    </div>`};return l`<div class="np-devices">${t("watch","Watches")}${t("iphone","iPhones")}</div>`}function ci(s,o,e){let t=ai(o.hass);if(t.length===0)return l`<p class="np-none">No room in Home Assistant has anything in it yet. Give your devices an area there first.</p>`;let n=C(o.hass,s.areaId),i=new Set(H(s,n)),a=r=>r.map(d=>zn(i.has(d.entityId),d.name,s.busy,p=>e.onEntity(d.entityId,p),d.entityId));return l`<label class="np-area"><span>Room</span>
      <select ?disabled=${s.busy} @change=${r=>e.onArea(r.target.value)}>
        <option value="" ?selected=${s.areaId===void 0} disabled>Pick a room</option>
        ${t.map(r=>l`<option value=${r.id} ?selected=${r.id===s.areaId}>${r.name}</option>`)}
      </select></label>
    ${s.areaId===void 0?m:l`<div class="np-room">
      ${n.controls.length===0?l`<p class="np-none">Nothing to tap in this room.</p>`:a(n.controls)}
      ${n.more.length===0?m:l`<p class="np-more">More in this room</p>${a(n.more)}`}
    </div>`}`}function li(s,o,e){return o.pages.length===0?l`<p class="np-none">Your home has no page to start from yet.</p>`:l`<label class="np-area"><span>Page</span>
    <select ?disabled=${s.busy} @change=${t=>e.onFromPage(t.target.value)}>
      <option value="" ?selected=${s.fromPage===void 0} disabled>Pick a page</option>
      ${o.pages.map(t=>l`<option value=${O(t)} ?selected=${s.fromPage!==void 0&&w(s.fromPage,O(t))}>${Ve(t)}</option>`)}
    </select></label>`}function jn(s,o,e){let t=V(s,o),n=["empty","room","page","map"];return l`<dialog class="new-dialog lib-new lib-new-page" aria-label="New page" @close=${()=>e.onClose()}
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
          <input type="text" class="new-name" .value=${A(s.name)} maxlength="80" autofocus aria-label="New page name"
            ?disabled=${s.busy} @input=${i=>e.onName(i.target.value)} />
        </section>
        ${o.devices.length===0?m:l`<section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Show on</span><span class="new-step-hint">Ticked like your last new page.</span></div>
          ${pi(s,o,e)}
        </section>`}
        <section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Start</span></div>
          <div class="np-starts" role="radiogroup" aria-label="Start">
            ${n.map(i=>{let a=s.start===i,r=i==="map"&&o.mapFloorId===void 0;return l`<button type="button" class="np-start ${a?"on":""}" role="radio" aria-checked=${a?"true":"false"}
                data-start=${i} ?disabled=${s.busy||r} title=${On(i,o.mapRefusal)} @click=${()=>e.onStart(i)}>
                ${$(di(i))}<span class="np-start-t">${oi[i]}${i==="map"?et("ALPHA"):m}</span>
                <span class="np-start-n">${On(i,i==="map"?o.mapRefusal:void 0)}</span>
              </button>`})}
          </div>
          ${s.start==="room"?ci(s,o,e):s.start==="page"?li(s,o,e):m}
        </section>
        ${s.note===void 0?m:l`<p class="lt-line ${s.note.kind}" role="status">${s.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${ri(s,o,o.devices)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${s.busy} @click=${()=>e.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${t!==void 0||s.busy} title=${t??"Make the page"}>${s.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function qn(s){let o=s?.querySelector?.(ii);o&&(!o.open&&typeof o.showModal=="function"&&o.showModal(),o.querySelector("input.new-name")?.select())}var Xn=K`
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
`;var Ne=200,te=320,hi=120,ui=80,mi=150,gi=280,Gn=6,L=Ze.screen;function Yn(s,o,e,t=L){if(M(s))return{top:0,height:t.height};let n=ot(dt(s,o),t),i=[...n.tiles,...lt(s,t,{states:o})];if(i.length===0)return{top:0,height:t.height};let r=pt(s,1,n.topInset,e)!==m?0:Math.max(0,n.topInset+Math.min(...i.map(p=>p.y))-Gn),d=n.topInset+Math.max(...i.map(p=>p.y+p.height))+Gn;return{top:r,height:Math.max(1,d-r)}}var fi=2e3,Te=44,Jn=28,Zn={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function F(s){return["watch","iphone"].filter(o=>s.some(e=>e.kind===o))}var De=new Map;function ei(s){let o=De.get(s);if(o!==void 0)return o;let e={view:"cards"};try{let t=window.localStorage.getItem(Zn[s]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return De.set(s,e),e}function ki(s,o){let e={...ei(s),...o};De.set(s,e);try{window.localStorage.setItem(Zn[s],JSON.stringify(e))}catch{}}var E=(s,o="pages")=>(o==="status_pages"?Ft(s)?.dirty:Lt(s)?.dirty)??!1,Qn=(s,o)=>`${s}|${o.toUpperCase()}`,u=class extends Le{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.screensFilter="all";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new gt(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new Ct(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new _t(this);this.colorsFor=nt();this.colorOf=e=>tt(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=fi)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.pageForm=void 0,this.copyForm=void 0,this.screensFilter="all",this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return tn(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===en?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":Rt(this.kind,ei(this.kind).view)}get devices(){return Ee(this.owners,this.phones)}waiting(e){let t=new Map;for(let n of this.devices)t.set(n.ownerId,{held:Xe(e,n.ownerId,this.kind),free:!1});return Ae(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){Ot(this.kind,e),ki(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},Mt)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.picksBusy)return;this.newForm=void 0;let i=this.kind;if(E(e.ownerId,i)){this.picksNote={kind:"warn",text:X(i,e.name)};return}let a=W(),r=this.nextCardName(),d=i==="status_pages"?oe(r,a):_(a,r);this.picksBusy=!0,this.picksNote=void 0;let p=!1;try{let c=await ce(le(t),e.ownerId,i,{add:d});p=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:U(c).message}}await n.refresh(),this.picksBusy=!1,p&&this.onOpenLibrary?.(i,a,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!(this.newForm?.busy||this.pageForm?.busy)){if(this.newForm!==void 0||this.pageForm!==void 0){this.newForm=void 0,this.pageForm=void 0;return}if(this.kind==="pages"){let e=this.lib.library,t=e===void 0?new Set:this.waiting(e);this.pageForm=Kn(this.nextCardName(),Vn(this.devices,Bn(),n=>t.has(n))),this.updateComplete.then(()=>qn(this.renderRoot));return}this.newForm={name:this.nextCardName(),busy:!1,preview:F(this.devices)[0]},this.updateComplete.then(()=>Tt(this.renderRoot))}}pageSheetContext(){let e=this.lib.library,t=this.homeMapDoc(),n=he(t),i=ue(t),a=e===void 0?[]:D(e,"pages").map(r=>r.item);return{...this.hassNow===void 0?{}:{hass:this.hassNow},pages:a,...n===void 0?{}:{mapFloorId:n},...i===void 0?{}:{mapRefusal:i}}}async makePage(){let e=this.pageForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.pageSheetContext(),i=V(e,n);if(i!==void 0){this.pageForm={...e,note:{kind:"warn",text:e.name.trim()===""?`Give the ${v(this.kind)} a name.`:i}};return}let a=Un(e,n,W());if(a===void 0)return;let{note:r,...d}=e;this.pageForm={...d,busy:!0};let p=await t.createItem("pages",a);if(!p.ok){this.pageForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}Hn(e.owners);for(let h of e.owners)await t.pick(h,"pages",p.reply.id,!0);this.pageForm=void 0;let c=this.devices.find(h=>e.owners.some(f=>w(f,h.ownerId)));we(c?.kind??F(this.devices)[0]??"watch"),this.onOpenLibrary?.("pages",p.reply.id)}openCopy(e,t=[]){e.kind==="pages"&&(this.copyForm=yt(e.id,e.name,fe(e.owners,this.devices),t),this.updateComplete.then(()=>St(this.renderRoot)))}copyHolders(e){let t=this.lib.library,n=t===void 0?void 0:D(t,"pages").find(i=>w(i.id,e.itemId));return fe(n?.owners??[],this.devices)}async makeCopy(){let e=this.copyForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.copyHolders(e);this.copyForm={...e,busy:!0};let i=await $t(t,e,n,this.devices);this.copyForm?.itemId===e.itemId&&(this.copyForm=i)}renderCopy(e){let t=this.copyHolders(e);return Pt(e,t,{onTick:(n,i)=>{this.copyForm!==void 0&&(this.copyForm=xt(this.copyForm,t,n,i))},onName:n=>{this.copyForm!==void 0&&(this.copyForm={...this.copyForm,copyName:n,named:!0})},onMake:()=>{this.makeCopy()},onOpen:n=>{this.copyForm=void 0,this.onOpenLibrary?.("pages",n)},onClose:()=>{this.copyForm?.busy||(this.copyForm=void 0)}})}renderPageSheet(e,t){let n=this.lib.library,i=n===void 0?new Set:this.waiting(n),a=d=>{this.pageForm=d},r=this.pageSheetContext();return jn(e,{...r,devices:t,locked:d=>i.has(d)?z(t.find(p=>p.ownerId===d)?.appVersion):void 0},{onName:d=>a({...e,name:d}),onDevice:(d,p)=>a(Wn(e,t,d,p)),onStart:d=>a({...e,start:d}),onArea:d=>{let{picked:p,...c}=e;a({...c,areaId:d})},onEntity:(d,p)=>a(_n(e,C(r.hass,e.areaId),d,p)),onFromPage:d=>a({...e,fromPage:d}),onMake:()=>{this.makePage()},onClose:()=>{e.busy||(this.pageForm=void 0)}})}nextCardName(){let e=this.lib.library,t=e===void 0?[]:D(e,this.kind).map(n=>n.item);return this.kind==="status_pages"?je({schemaVersion:1,statusPages:t}):Ue({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=e.name.trim();if(n===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${v(this.kind)} a name.`}};return}let{note:i,...a}=e;this.newForm={...a,busy:!0};let r=W(),d=e.mapPage===!0?he(this.homeMapDoc()):void 0,p=this.kind==="status_pages"?{schemaVersion:1,statusPages:[oe(n,r)]}:{schemaVersion:1,pages:[d===void 0?_(r,n):G(r,n,d)]},c=await t.createItem(this.kind,p);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,we(e.preview??F(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,n){let i=this.lib.store;if(i===void 0)return;this.dropTickNote(I(e)),this.untickAsk=void 0;let a={item:e.name,device:this.devices.find(k=>k.ownerId===t)?.name??"the device"};if(!n){this.untickAsk=await vt(this.hassNow,i,t,e.kind,e.id,a);return}let r=I(e);if(!(await me(this.hassNow,i,t,e.kind,e.id,!0,a,{onUndone:()=>this.dropTickNote(r)})).ok||e.kind!=="pages")return;let p=await this.readFree(t),c=this.lib.library,h=this.devices.find(k=>k.ownerId===t)?.name;if(!p||c===void 0||h===void 0||q(c,t,"pages")<2)return;let f=Be([h]);f!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(r,{kind:"ok",text:f}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let n=I({id:e.itemId}),i=await me(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>this.dropTickNote(n)});i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let i=(await Ce(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==i&&(this.freeFacts=new Map(this.freeFacts).set(e,i)),i}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,n){let i=this.hassNow,a=this.lib.store;if(i===void 0||a===void 0||this.picksBusy)return;let r=this.kind;if(E(e.ownerId,r)){this.picksNote={kind:"warn",text:X(r,e.name)};return}let d=this.kindSeq,p="hidden"in t,c=Qn(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,p?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):n!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:on(n,t.id,t.before)});let h=this.orderAsked,f;try{let k=await ce(le(i),e.ownerId,r,t);k.ok&&this.flashSaved(),k.ok||(f={kind:"err",text:`${p?"Not changed":"Not moved"} on ${e.name}: ${k.message.replace(/\.$/,"")}.`})}catch(k){f={kind:"err",text:U(k).message}}if(await a.refresh(),this.picksBusy=!1,p){let k=new Map(this.hiddenAsked);k.delete(c),this.hiddenAsked=k}else this.orderAsked===h&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=f)}shownNow(){let e=this.lib.library;return e===void 0?[]:this.shownOf(e)}shownOf(e){let t=nn(e,this.kind,this.search);return this.kind!=="pages"||this.screensFilter==="all"?t:t.filter(n=>Nn(this.screensFilter,n.item))}emptyHere(e){return this.kind==="pages"&&this.screensFilter!=="all"&&this.search.trim()===""?Tn:$e(e,this.search,this.kind)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(I(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=yn(this.selected,this.shownNow().map(I)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let n=e.metaKey||e.ctrlKey;if(!this.selecting&&!n){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!n)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let n=I(e);this.selected=t?wn(this.selected,this.shownNow().map(I),this.anchor,n):kn(this.selected,n),this.anchor=n,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(I);this.selected=e?bn(this.selected,t):vn(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.bulkBusy!==void 0)return;let i=this.devices,a=Z(e,i,E),r=Ie({kind:a.kind,gone:[],kept:a.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=a.kept.length>0?r:void 0,a.items.length===0)return;let d=a.items.length;st({text:`Deleted ${d===1?a.items[0].name:$n(a.kind,d)}.`,hide:a.items.map(p=>it(a.kind,p.id)),send:async()=>{let p;try{p=Ie(await xn(bt(t),{...a,kept:[]},i))}catch(c){p={kind:"err",text:U(c).message}}return await n.refresh(),p.kind==="ok"?void 0:p.text}})}renderItemDelete(e,t){return l`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${n=>{n.stopPropagation(),this.itemAsk=I(e)}}>${$("delete")}</button>`}renderItemAsk(e,t,n){let i=Z([e],t,E),a=Pe(i,t),r=()=>{this.itemAsk=void 0},d=()=>{r(),this.deleteEntries([e])},p=n!==void 0&&e.owners.some(h=>w(h,n.ownerId))&&e.owners.some(h=>!w(h,n.ownerId))?n:void 0,c=i.items.length>0;return l`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${h=>h.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${a.body}</span>
      <span class="ap-ask-acts">
        ${c?p===void 0?l`<button type="button" class="ap-ask-btn danger" @click=${d}>Really delete</button>`:l`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${p.name} only`}
              @click=${()=>{r(),this.tick(e,p.ownerId,!1)}}>${jt}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${d}>${qt}</button>`:m}
        <button type="button" class="ap-ask-btn" @click=${r}>${c?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return l`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,n=this.lib.library,i=this.lib.readState,a=this.filterDevice(),r=v(t,2),d=this.view,p=n===void 0?i==="unsupported"?se:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:Jt(D(n,t).length,t),c=n!==void 0&&i==="failed";return l`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${ve(t)}</h1>
          <p class="ap-lead">${p}</p>
        </div>
        ${e.length===0?m:this.renderNew(a,e)}
      </div>
      ${this.newForm===void 0?m:this.renderNewDialog(this.newForm,e)}
      ${this.pageForm===void 0?m:this.renderPageSheet(this.pageForm,e)}
      ${this.copyForm===void 0?m:this.renderCopy(this.copyForm)}
      ${c?l`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:m}
      ${this.renderTwoScreensCard(n)}
      <div class="pk-surface pk-page ${d==="board"?"on-board":""}" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(n,a,d)}
          ${this.selecting&&a===void 0&&d!=="board"?this.renderBar(e):m}
        </div>
        <div class="pk-body">
          ${n===void 0?l`<p class="ap-empty">${p}</p>`:a!==void 0?this.renderFocus(n,sn(n,a,t,this.search),e):d==="board"?this.renderBoardAll(n,e):this.renderAll(n,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${Zt(t,a,this.selecting&&a===void 0,d)}</span></div>
      </div>
    </div></div>`}renderTwoScreensCard(e){return this.kind!=="pages"||e===void 0||D(e,"pages").length===0||En()?m:l`<div class="ap-upgrade" role="note">
      ${$("info")}<span>${Dn}</span>
      <button type="button" class="ap-upgrade-x" title="Dismiss" aria-label="Dismiss"
        @click=${()=>{Rn(),this.requestUpdate()}}>${$("close")}</button>
    </div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,n=v(this.kind,2),i=this.lib.readState;if(e===void 0){let r=i==="unsupported"?se:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${n}\u2026`;return l`<p class="ap-empty">${r}</p>`}if(t.length===0)return l`<p class="ap-empty">No device can have ${n}.</p>`;let a=D(e,this.kind).length===0?l`<p class="ap-empty">No ${n} yet.</p>`:this.renderBoardAll(e,t);return l`${this.saved?l`<span class="bd-saved ap-embed-saved" role="status">${$("check")}<span>Saved</span></span>`:m}${a}`}renderAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;let i=this.shownOf(e);if(i.length===0)return l`<p class="ap-empty">${this.emptyHere(t)}</p>`;let a=this.waiting(e);return l`<div class="ap-grid" role="list">${i.map(r=>this.renderCard(e,r,t,a))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||D(e,this.kind).length>0)return;let n=this.mayMake,i=this.waiting(e),a=i.size>0;return l`<div class="ap-empty-lib">
      <p>${Qt(this.kind,n)}</p>
      ${a?l`<p class="ap-empty-wait">${Me(v(this.kind,2),_e(t,i))}</p>`:m}
      ${n?l`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>New ${v(this.kind)}</span></button>`:m}
    </div>`}renderHead(e,t,n){let i=this.selecting,a=this.bulkBusy!==void 0,r=v(this.kind,2);return l`<div class="pk-head">
      ${At(n,d=>this.setView(d),r)}
      ${n==="board"?Bt(ke(),d=>{Et(d),this.requestUpdate()}):m}
      ${t===void 0?l`<button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${v(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${a||e===void 0} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${$("checklist")}<span>Multi select</span></button>`:m}
      ${this.saved?l`<span class="bd-saved" role="status">${$("check")}<span>Saved</span></span>`:m}
      ${this.kind==="pages"&&t===void 0?this.renderScreensFilter():m}
      <label class="pk-search">
        ${$("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderScreensFilter(){let e=(t,n,i)=>l`<button type="button" class="ap-filter-opt ${this.screensFilter===t?"on":""}"
      role="radio" aria-checked=${this.screensFilter===t?"true":"false"} data-filter=${t} title=${i}
      @click=${()=>{this.screensFilter=t,this.pruneSelected()}}>${n}</button>`;return l`<span class="ap-filter" role="radiogroup" aria-label="Show">
      ${e("all","All","Every page")}${e("differ",Sn,"The pages the watch and the iPhone arrange apart, or with a tile off on one")}
    </span>`}renderNew(e,t){let n=`New ${v(this.kind)}`;if(e!==void 0)return l`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${J(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${$("plus")}<span>${n}</span></button>
      </div>`;let i=this.mayMake,a=this.newForm!==void 0||this.pageForm!==void 0;return l`<div class="ap-new">
      <button type="button" class="ap-new-btn ${a?"on":""}" aria-expanded=${a?"true":"false"}
        ?disabled=${!i||this.newForm?.busy===!0||this.pageForm?.busy===!0}
        title=${i?`Make ${J(this.kind)} no device has yet`:Yt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${$("plus")}<span>${n}</span></button>
    </div>`}renderNewDialog(e,t){let n=ue(this.homeMapDoc());return Nt(this.kind,e,F(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMapPage:i=>{this.newForm={...e,mapPage:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?n===void 0?{}:{refusal:n}:void 0)}homeMapDoc(){return Fe(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,n,i){let a=this.lib.store,r=I(t),d=a?.noteFor(t.kind,t.id),p=d===void 0?this.tickNotes.get(r):{kind:"warn",text:d},c=this.untickAsk,h=c!==void 0&&c.kind===t.kind&&w(c.itemId,t.id)?c:void 0,f=this.hassNow?.user?.is_admin,k=t.kind==="pages"?rt(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:n,colorOf:this.colorOf,skips:k,...a===void 0?{}:{pending:a.pending},...p===void 0?{}:{note:p.text,noteKind:p.kind},...h===void 0?{}:{ask:{ownerId:h.ownerId,text:h.text,onRemove:()=>{this.untickNow(h)},onCancel:()=>{this.untickAsk=void 0}}},...f===void 0?{}:{admin:f},locked:P=>{let S=qe(e,P,t.kind,t.id);if(S&&E(P,t.kind))return X(t.kind,n.find(x=>x.ownerId===P)?.name??"This device");if(!S&&i.has(P))return z(n.find(x=>x.ownerId===P)?.appVersion)}}}renderCardTicks(e,t,n,i){return kt(this.ticksInput(e,t,n,i),(a,r)=>{this.tick(t,a,r)})}renderCard(e,t,n,i){let a=this.selecting,r=I(t),d=a&&this.selected.has(r),p=ye(t,n),c=this.openTitle(t),h=k=>this.cardClick(k,t),f=!a&&this.itemAsk===r;return l`<div class="ap-card ${a?"picking":""} ${d?"picked":""} ${f?"asking":""}" role="listitem" data-card=${r}
      @click=${k=>{a&&h(k)}}>
      <div class="ap-top">
        ${a?l`<input type="checkbox" class="pk-card-pick" .checked=${A(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${k=>{k.stopPropagation(),this.pick(t,k.shiftKey)}} />`:m}
        <button type="button" class="ap-open" title=${c} tabindex=${a?"-1":"0"} @click=${h}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${Q(t)}</small>
        </button>
        ${a||t.kind!=="pages"?m:this.renderCopyButton(t)}
        ${a?m:this.renderItemDelete(t,"ap-del")}
      </div>
      ${this.screensLineOf(t,n)===void 0?m:l`<small class="ap-screens">${this.screensLineOf(t,n)}</small>`}
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${h}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumbs(e,t,p,n)}
      </button>
      ${this.renderCardTicks(e,t,n,i)}
      ${f?this.renderItemAsk(t,n):m}
    </div>`}screensLineOf(e,t){return e.kind==="pages"?In(e.item,e.owners,t):void 0}renderCopyButton(e){return l`<button type="button" class="ap-del ap-copy" title=${e.owners.length<2?ge:`Make a copy of ${e.name} for some devices`} aria-label=${`Make a copy of ${e.name}`}
      ?disabled=${e.owners.length<2}
      @click=${t=>{t.stopPropagation(),this.openCopy(e)}}>${$("duplicate")}</button>`}openTitle(e){if(this.selecting){let t=this.selected.has(I(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return xe(e.name)}boardColumns(e,t){let n=this.waiting(e);return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:q(e,i.ownerId,this.kind),...n.has(i.ownerId)?{blocked:Ht(i.appVersion,z(i.appVersion))}:{}}))}renderBoardAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;if(t.length===0)return l`<p class="ap-empty">${$e(t,this.search,this.kind)}</p>`;let i=this.waiting(e),a=this.shownOf(e);return this.renderBoardOf(e,t,[{key:"all",rows:a.map(r=>this.boardRow(e,r,t,i)),empty:this.emptyHere(t)}])}renderBoardOf(e,t,n,i){let a=v(this.kind),r=v(this.kind,2);return Kt({label:`${ve(this.kind)} on each device`,thing:a.charAt(0).toUpperCase()+a.slice(1),columns:this.boardColumns(e,t),...i===void 0?{}:{focus:i},onFocus:d=>this.setFocus(d),wide:this.roomy.wide,ordered:!0,focusTitle:d=>`See ${d.name}'s ${r} in its order, and drag to change it`,sections:n,...this.embedded?{}:{legend:{tick:"on that device",focus:"in a device's header to see and drag its order",saves:"Ticks save at once, with Undo",...this.kind==="pages"?{eye:"hide but keep its place"}:{}}},...this.selecting&&i===void 0?{pinned:this.renderBar(t)}:{}})}boardRow(e,t,n,i,a){let r=this.ticksInput(e,t,n,i),d=ft(r),p=t.kind==="pages"?t.item:void 0,c=p===void 0?0:j(p).length,h=p!==void 0&&c>0&&(r.skips?.length??0)>=c,f=d.map(b=>{if(!b.on&&!b.busy&&i.has(b.ownerId))return{dashTitle:b.title};let T={chip:{...b,title:Vt(b)},onPick:ne=>{this.tick(t,b.ownerId,ne)}};if(a?.order!==void 0&&b.on&&w(b.ownerId,a.device.ownerId)&&(T.order=a.order.at+1),b.on&&b.device==="watch"&&h?(T.note="shows nothing",T.noteWarn=!0,T.noteTitle=`Every tile on ${t.name} is iPhone only, so ${b.name} shows an empty page.`):b.skips!==void 0&&(T.note=b.skips.text,T.noteTitle=b.skips.title),a?.pick!==void 0&&w(b.ownerId,a.device.ownerId)&&t.kind==="pages"){let ne=Qn(a.device.ownerId,t.id),ie=this.hiddenAsked.get(ne)??a.pick.hidden;T.eye={hidden:ie,busy:this.picksBusy,title:ie?`Show ${t.name} on ${a.device.name} again`:`Hide here: keep ${t.name} on ${a.device.name} without showing it`,onToggle:()=>{this.changePicks(a.device,{id:t.id,hidden:!ie})}}}return T}),k=this.selecting&&a===void 0,P=I(t),S=this.screensLineOf(t,n),x={key:P,name:t.name,detail:S===void 0?Q(t):`${Q(t)} \xB7 ${S}`,picture:this.rowPictures(t,n,a?.pick!==void 0?a.device:void 0),openTitle:a?.pick!==void 0?`${xe(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:b=>{if(a?.pick!==void 0&&!b.metaKey&&!b.ctrlKey){this.open(t);return}this.cardClick(b,t)},cells:f,...a!==void 0&&a.pick===void 0?{dim:!0}:{},...a?.drag===void 0?{}:{drag:a.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}},peek:()=>({picture:t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumbs(e,t,ye(t,n),n),where:hn(t,n,a?.order===void 0?void 0:{device:a.device,at:a.order.at})})};return k?x.select={picked:this.selected.has(P),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:b=>this.pick(t,b.shiftKey)}:(x.actions=this.renderItemDelete(t,"bd-act danger"),x.more=this.rowMore(t,a),this.itemAsk===P&&(x.under=this.renderItemAsk(t,n,a?.device))),x}rowMore(e,t){let n=[{label:"Open",onPick:()=>this.open(e)}];e.kind==="pages"&&n.push({label:"Make a copy\u2026",disabled:e.owners.length<2,title:e.owners.length<2?ge:`Make a copy of ${e.name} for some of its devices`,onPick:()=>this.openCopy(e,t===void 0?[]:[t.device.ownerId])});let i=t?.order;if(t!==void 0&&i!==void 0){let a=i.ids[0],r=d=>{this.changePicks(t.device,{id:e.id,before:d},[...i.ids])};i.at>0&&a!==void 0&&n.push({label:"Move to top",onPick:()=>r(a)}),i.at<i.ids.length-1&&n.push({label:"Move to bottom",onPick:()=>r(null)})}else t===void 0&&n.push({label:"Pick several",title:`Pick several ${v(this.kind,2)} to delete together`,onPick:()=>this.pick(e,!1)});return n}rowPictures(e,t,n){if(e.kind==="status_pages")return this.rowPicture(e,n);let i=F(t),a=i.length===0?["watch"]:i,r=d=>n?.kind===d?n:t.find(p=>p.kind===d&&e.owners.some(c=>w(c,p.ownerId)));return l`<span class="ap-pics">${a.map(d=>this.rowPicture(e,r(d),d))}</span>`}rowPicture(e,t,n){let i=ke()==="compact";if(e.kind==="status_pages")return Xt({page:e.item,hass:this.hassNow,width:i?Y:this.roomy.size(Te),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let a=this.appVersionOf(t),r=(n??t?.kind)==="iphone",d=i?r?Math.round(Y*Jn/Te):Y:this.roomy.size(r?Jn:Te);return be({page:e.item,width:d,tick:this.iconsTick,iphone:r,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...a===void 0?{}:{appVersion:a},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...r?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>w(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,n){let{device:i}=t,a=this.orderAsked,r=a!==void 0&&a.ownerId===i.ownerId&&a.kind===this.kind?a.ids:void 0,d=an(t.picks,r),p=d.map(x=>x.id),c=q(e,i.ownerId,this.kind),h=this.search.trim()===""&&!this.picksBusy,f=this.waiting(e),k=v(this.kind,2),P=d.map((x,b)=>this.boardRow(e,x.entry,n,f,{device:i,pick:x,drag:this.rowDrag(x,b,p,i,h),order:{at:b,ids:h?p:[]}})),S=t.rest.map(x=>this.boardRow(e,x,n,f,{device:i}));return l`${this.renderFocusHead(i,c)}
      ${this.picksNote===void 0?m:l`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${this.renderBoardOf(e,n,[{key:"on",title:dn(i),count:c,hint:pn(i),rows:P,empty:f.has(i.ownerId)&&this.search.trim()===""?Oe(k,i.name,i.appVersion):mn(i,this.kind,this.search,t.rest.length,this.mayMake)},...un(c,t.rest.length,this.search)?[{key:"rest",title:cn(i),count:t.rest.length,hint:ln(i),rows:S,empty:this.search.trim()===""?`Every ${v(this.kind)} in your home is on ${i.name}.`:`No other ${v(this.kind)} has that name.`}]:[]],i.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?v(this.kind):k} on ${i.name}.</p>`}renderFocusHead(e,t){let n=Re(e.kind),i=v(this.kind,t);return Wt({device:e,color:this.colorOf(e.ownerId),text:`${t} ${i}, in the order the ${n} ${this.kind==="pages"?"shows":"keeps"} them`,...this.onOpenScreen===void 0?{}:{onOwn:a=>this.onOpenScreen?.(e.ownerId,e.kind,a)},onAll:()=>this.setFocus(void 0)})}rowDrag(e,t,n,i,a){let r=this.overId!==void 0&&w(this.overId,e.id)&&this.dragId!==void 0&&!w(this.dragId,e.id),d=p=>{p!==void 0&&this.changePicks(i,{id:e.id,before:p},[...n])};return{on:a,dragging:this.dragId!==void 0&&w(this.dragId,e.id),over:r,below:r&&n.findIndex(p=>w(p,this.dragId))<t,onStart:p=>{a&&(this.dragId=e.id,p.dataTransfer?.setData("text/plain",e.id),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"))},onOver:p=>{this.dragId!==void 0&&(p.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:p=>{p.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let h=c===void 0?void 0:rn(n,c,e.id);h!==void 0&&this.changePicks(i,h,[...n])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:p=>{!p.altKey||!a||p.key!=="ArrowUp"&&p.key!=="ArrowDown"||(p.preventDefault(),p.key==="ArrowUp"?d(t>0?n[t-1]:void 0):d(t<n.length-1?n[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),n=t.filter(f=>this.selected.has(I(f))),i=n.length,a=this.bulkBusy!==void 0,r=i===0,d=t.length>0&&t.every(f=>this.selected.has(I(f))),p=a?void 0:this.bulkNote,c=v(this.kind),h=v(this.kind,2);return l`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${h}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${J(this.kind)} to start.`:`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${a||t.length===0}
        title=${d?`Let the ${h} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${p===void 0?m:l`<span class="pk-bar-said ${p.kind}">${p.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(n,e):l`<button type="button" class="ghost danger small" ?disabled=${a||r}
            title=${`Delete these ${h} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${$("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${a}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${$("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let n=Z(e,t,E),i=Pe(n,t);return l`<span class="pk-bar-ask" id="ap-del-ask"><b>${i.title}</b> ${i.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${n.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,n,i=Ne){let a=re(t.item,"watch"),r=n===void 0?[]:He(Ge(e,n.ownerId)),d=r.length===0?[a]:r,p=this.hassNow?.states,c=this.icons,h=i/L.width,f=this.thumbHeight(a,i),k=f>te,P=Yn(a,p,c),S=b=>`${Math.round(b*100)/100}px`,x=n?.kind==="watch"?this.appVersionOf(n):void 0;return l`<span class="ap-pic ${k?"cut":""}" style=${`width:${S(i)};height:${S(Math.min(f,te))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${S(-P.top*h)})`}>${ct({page:a,pages:d,screen:L,scale:h,...p===void 0?{}:{states:p},...c===void 0?{}:{icons:c},...x===void 0?{}:{appVersion:x}})}</span>
    </span>`}thumbHeight(e,t){return Yn(e,this.hassNow?.states,this.icons).height*(t/L.width)}renderThumbs(e,t,n,i){let a=F(i);if(!a.includes("iphone"))return this.renderThumb(e,t,n);let r=i.find(P=>P.kind==="iphone"&&t.owners.some(S=>w(S,P.ownerId))),d=n?.kind==="watch"?n:void 0,p=a.includes("watch"),c=p?hi:0,h=p?Math.min(this.thumbHeight(re(t.item,"watch"),c),te):gi,f=this.appVersionOf(r),k=be({page:t.item,width:p?ui:mi,maxHeight:Math.max(1,Math.round(h)),tick:this.iconsTick,iphone:!0,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...f===void 0?{}:{appVersion:f},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,homeMap:this.homeMapDoc()});return l`<span class="ap-pics ap-card-pics">
      ${p?this.renderThumb(e,t,d,c):m}
      <span class="ap-pic ap-pic-phone">${k}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,n=Ne/L.width,i=d=>`${Math.round(d*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return l`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${i(Ne)};height:${i(Math.min(L.height*n,te))}`}>
      <span class="ap-pic-in">${t===void 0?m:ut({page:e.item,hass:t,icons:this.icons??Qe,screen:L,scale:n})}</span>
    </span>`}static{this.styles=[ht,at,mt,fn,gn,wt,Gt,Dt,Xn,It,Ut,zt,K`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    /* A page's two pictures, the watch's and the iPhone's, side by side. */
    .ap-pics { display: inline-flex; align-items: flex-start; gap: 4px; }
    .ap-card-pics { gap: 8px; }
    .ap-pic.ap-pic-phone { box-shadow: none; border-radius: 0; }
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
  `]}};g([N({attribute:!1})],u.prototype,"kind",2),g([N({attribute:!1})],u.prototype,"owners",2),g([N({attribute:!1})],u.prototype,"ownersReady",2),g([N({attribute:!1})],u.prototype,"phones",2),g([N({attribute:!1})],u.prototype,"icons",2),g([N({attribute:!1})],u.prototype,"iconsTick",2),g([N({attribute:!1})],u.prototype,"onOpenLibrary",2),g([N({attribute:!1})],u.prototype,"focusOwner",2),g([N({attribute:!1})],u.prototype,"onFocus",2),g([N({attribute:!1})],u.prototype,"onOpenScreen",2),g([N({type:Boolean,reflect:!0})],u.prototype,"embedded",2),g([N({attribute:!1})],u.prototype,"searchText",2),g([y()],u.prototype,"search",2),g([y()],u.prototype,"newForm",2),g([y()],u.prototype,"pageForm",2),g([y()],u.prototype,"copyForm",2),g([y()],u.prototype,"screensFilter",2),g([y()],u.prototype,"selecting",2),g([y()],u.prototype,"selected",2),g([y()],u.prototype,"asking",2),g([y()],u.prototype,"bulkBusy",2),g([y()],u.prototype,"itemAsk",2),g([y()],u.prototype,"bulkNote",2),g([y()],u.prototype,"tickNotes",2),g([y()],u.prototype,"untickAsk",2),g([y()],u.prototype,"picksBusy",2),g([y()],u.prototype,"picksNote",2),g([y()],u.prototype,"orderAsked",2),g([y()],u.prototype,"hiddenAsked",2),g([y()],u.prototype,"dragId",2),g([y()],u.prototype,"overId",2),g([y()],u.prototype,"freeFacts",2),g([y()],u.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",u);export{u as WaAllPages,Yn as pageCrop};
