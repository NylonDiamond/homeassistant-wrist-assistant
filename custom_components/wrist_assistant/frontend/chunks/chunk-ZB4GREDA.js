import{M as $,q as v}from"./chunk-LEB2RL37.js";import{m as x}from"./chunk-6U6YWHFQ.js";import{ha as p,ka as g,qa as y,za as w}from"./chunk-O3NWHL3Q.js";import{b as l,d as i,g as s,nh as u}from"./chunk-BDP52PL7.js";import{D as b}from"./chunk-TGJNCNIU.js";function F(e,n,r,o,t){if(e===void 0)return[];let d=g(e,n,r)?.owners??[];return o.flatMap(a=>{if(!d.some(c=>p(c,a.ownerId)))return[];let m=y(e,a.ownerId,n),f=m.findIndex(c=>p(c.id,r));if(f<0)return[];let h={ownerId:a.ownerId,name:a.name,kind:a.kind,place:f+1,count:m.length,hidden:m[f].hidden},k=t===void 0?void 0:Object.entries(t.owners).find(([c])=>p(c,a.ownerId))?.[1];return t!==void 0&&(h.sync=b(k?.[n])),[h]})}function L(e){let n=e%100,r=n>=11&&n<=13?"th":e%10===1?"st":e%10===2?"nd":e%10===3?"rd":"th";return`${e}${r}`}function I(e,n){let r=n==="status_pages"?"status page":"page";return e.count<=1?`Its only ${r}`:`${L(e.place)} of ${e.count} ${r}s`}function O(e){return e.sync==="delivered"?"Synced":e.sync==="waiting"?`Waiting for the ${e.kind==="iphone"?"iPhone":"watch"}`:""}function j(e){return e.lines.length===0?i`<div class="oed"><p class="oed-none">On no device yet. Tick a device over the preview to put it there.</p></div>`:i`<div class="oed" role="list">
    ${e.lines.map(n=>{let r=e.colorOf(n.ownerId),o=O(n),t=I(n,e.kind);return i`<div class="oed-row ${n.hidden?"hidden":""}" role="listitem" style=${r===void 0?"":`--dc:${r}`}>
        <span class="oed-name"><span class="oed-glyph" aria-hidden="true">${u(n.kind==="iphone"?"phone":"watch")}</span><span class="oed-n" title=${n.name}>${n.name}</span></span>
        ${e.onOpenBoard===void 0?i`<span class="oed-place">${t}</span>`:i`<button type="button" class="oed-place link" title=${`Open ${n.name}'s board to change the order`}
              @click=${()=>e.onOpenBoard(n.ownerId)}>${t}</button>`}
        ${o===""?s:i`<span class="oed-sync ${n.sync??""}">${o}</span>`}
        ${e.kind==="status_pages"?s:i`<label class="oed-hide" title=${n.hidden?`Hidden on ${n.name}. It keeps its place there.`:`Hide it on ${n.name}. It keeps its place there.`}>
          <span>Hide here</span>
          <input type="checkbox" role="switch" .checked=${n.hidden} ?disabled=${e.busy}
            @change=${d=>e.onHide(n.ownerId,d.target.checked)} />
        </label>`}
      </div>`})}
  </div>`}var E=l`
  .oed { display: flex; flex-direction: column; gap: 2px; }
  .oed-none { margin: 2px 0; font-size: 12.5px; color: var(--wa-amber); }
  .oed-row {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "name hide" "place sync";
    align-items: center; gap: 2px 10px; padding: 7px 8px; border-radius: 8px;
  }
  .oed-row + .oed-row { border-top: 1px solid var(--wa-line); border-radius: 0; }
  .oed-name { grid-area: name; display: inline-flex; align-items: center; gap: 6px; min-width: 0; font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .oed-glyph { display: inline-flex; width: 15px; height: 15px; color: var(--dc, var(--wa-muted)); flex: none; }
  .oed-glyph svg { width: 15px; height: 15px; }
  .oed-n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .oed-row.hidden .oed-n { opacity: .6; }
  .oed-place { grid-area: place; justify-self: start; font-size: 12px; color: var(--wa-muted); }
  .oed-place.link { padding: 0; border: 0; background: none; font: inherit; font-size: 12px; color: var(--wa-muted); cursor: pointer; text-decoration: underline dotted; text-underline-offset: 3px; }
  .oed-place.link:hover { color: var(--wa-ink); }
  .oed-place.link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
  .oed-sync { grid-area: sync; justify-self: end; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); white-space: nowrap; }
  .oed-sync.delivered { color: var(--wa-green); }
  .oed-sync.waiting { color: var(--wa-amber); }
  .oed-hide { grid-area: hide; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-muted); cursor: pointer; white-space: nowrap; }
`;function K(e,n,r){return e.filter(o=>p(o.id,n)||r==="all"||o.owners.length===0)}function W(e){let n=e.owners.length;return n===0?"On no device":`On ${n} ${n===1?"device":"devices"}`}function A(e,n,r){let o=(t,d,a)=>i`<button type="button" class="lib-filter ${e===t?"on":""}"
    aria-pressed=${e===t?"true":"false"} title=${a} @click=${()=>{e!==t&&n(t)}}>${d}</button>`;return i`<span class="lib-filters" role="group" aria-label="Show">
    ${o("all","All",`Every ${r} in the library`)}
    ${o("none","On no device",`Only the ${r}s no device has yet`)}
  </span>`}function B(e,n,r){return e==="none"&&n<=1?i`<div class="lc-note">Every other ${r} is on a device.</div>`:s}var M=l`
  .lib-filters { display: inline-flex; gap: 2px; padding: 2px; border-radius: 8px; background: var(--wa-hover); }
  .lib-filter {
    padding: 2px 8px; border: 0; border-radius: 6px; background: none; color: var(--wa-muted);
    font: inherit; font-size: 11.5px; font-weight: 600; white-space: nowrap; cursor: pointer;
  }
  .lib-filter.on { background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-line); }
  .lib-filter:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* Every other item of the library: a row that opens it. */
  .lib-other-row { width: 100%; border: 0; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
  .lib-other-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-other-row.nowhere small { color: var(--wa-amber); }
`;function J(e){let{rows:n,here:r}=e;if(n.length===0)return s;let o=x(r.kind);return i`<div class="lb-rest ${e.standalone===!0?"standalone":""}" role="group" aria-label=${o}>
    <div class="lb-rest-h"><span class="lb-rest-t">${o}</span><small>${n.length}</small>
      <span class="lb-rest-sp"></span>${e.more??s}</div>
    <p class="lb-rest-hint">${$(v(e.kind,2))}</p>
    <ul class="lb-rest-list">${n.map(t=>i`<li class="lb-rest-row" data-item=${t.entry.id}>
      ${e.picture(t.entry)}
      <span class="lb-rest-name"><b title=${t.entry.name}>${t.entry.name}</b><small>${t.meta}</small></span>
      ${w({library:e.library,kind:e.kind,itemId:t.entry.id,devices:[r],addFor:r.ownerId,colorOf:e.colorOf,...e.pending===void 0?{}:{pending:e.pending},...e.noteFor(t.entry.id)===void 0?{}:{note:e.noteFor(t.entry.id)},...e.admin===void 0?{}:{admin:e.admin},...e.locked===void 0?{}:{locked:()=>e.locked}},(d,a)=>{a&&e.onAdd(t.entry.id)})}
    </li>`)}</ul>
  </div>`}var Q=l`
  .lb-rest { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px 12px; border-top: 1px solid var(--wa-line); }
  .lb-rest.standalone { align-self: stretch; max-width: 460px; width: 100%; margin: 12px auto 0; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .lb-rest-h { display: flex; align-items: baseline; gap: 6px; font-size: 12px; font-weight: 650; color: var(--wa-ink); }
  .lb-rest-h small { font-size: 11px; font-weight: 500; color: var(--wa-muted); }
  .lb-rest-sp { flex: 1; }
  .lb-rest-h a { font-size: 12px; font-weight: 500; color: var(--wa-accent); text-decoration: none; }
  .lb-rest-h a:hover { text-decoration: underline; }
  .lb-rest-hint { margin: 0; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  .lb-rest-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .lb-rest-row { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 4px 0; opacity: .8; }
  .lb-rest-row:hover { opacity: 1; }
  .lb-rest-name { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
  .lb-rest-name b { font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lb-rest-name small { font-size: 11px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lb-rest-row .lt-ticks { flex: none; max-width: 50%; }
`;export{F as a,j as b,E as c,K as d,W as e,A as f,B as g,M as h,J as i,Q as j};
