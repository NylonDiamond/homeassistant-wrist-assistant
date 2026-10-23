import{ea as d,ha as g,na as v}from"./chunk-TS6GX5ZO.js";import{b as p,d as i,g as l,nh as h}from"./chunk-PGFG6NDE.js";import{D as w}from"./chunk-TGJNCNIU.js";function D(e,n,r,o,t){if(e===void 0)return[];let s=g(e,n,r)?.owners??[];return o.flatMap(a=>{if(!s.some(c=>d(c,a.ownerId)))return[];let u=v(e,a.ownerId,n),f=u.findIndex(c=>d(c.id,r));if(f<0)return[];let m={ownerId:a.ownerId,name:a.name,kind:a.kind,place:f+1,count:u.length,hidden:u[f].hidden},y=t===void 0?void 0:Object.entries(t.owners).find(([c])=>d(c,a.ownerId))?.[1];return t!==void 0&&(m.sync=w(y?.[n])),[m]})}function x(e){let n=e%100,r=n>=11&&n<=13?"th":e%10===1?"st":e%10===2?"nd":e%10===3?"rd":"th";return`${e}${r}`}function b(e,n){let r=n==="status_pages"?"status page":"page";return e.count<=1?`Its only ${r}`:`${x(e.place)} of ${e.count} ${r}s`}function $(e){return e.sync==="delivered"?"Synced":e.sync==="waiting"?`Waiting for the ${e.kind==="iphone"?"iPhone":"watch"}`:""}function E(e){return e.lines.length===0?i`<div class="oed"><p class="oed-none">On no device yet. Tick a device over the preview to put it there.</p></div>`:i`<div class="oed" role="list">
    ${e.lines.map(n=>{let r=e.colorOf(n.ownerId),o=$(n),t=b(n,e.kind);return i`<div class="oed-row ${n.hidden?"hidden":""}" role="listitem" style=${r===void 0?"":`--dc:${r}`}>
        <span class="oed-name"><span class="oed-glyph" aria-hidden="true">${h(n.kind==="iphone"?"phone":"watch")}</span><span class="oed-n" title=${n.name}>${n.name}</span></span>
        ${e.onOpenBoard===void 0?i`<span class="oed-place">${t}</span>`:i`<button type="button" class="oed-place link" title=${`Open ${n.name}'s board to change the order`}
              @click=${()=>e.onOpenBoard(n.ownerId)}>${t}</button>`}
        ${o===""?l:i`<span class="oed-sync ${n.sync??""}">${o}</span>`}
        ${e.kind==="status_pages"?l:i`<label class="oed-hide" title=${n.hidden?`Hidden on ${n.name}. It keeps its place there.`:`Hide it on ${n.name}. It keeps its place there.`}>
          <span>Hide here</span>
          <input type="checkbox" role="switch" .checked=${n.hidden} ?disabled=${e.busy}
            @change=${s=>e.onHide(n.ownerId,s.target.checked)} />
        </label>`}
      </div>`})}
  </div>`}var T=p`
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
`;function j(e,n,r){return e.filter(o=>d(o.id,n)||r==="all"||o.owners.length===0)}function z(e){let n=e.owners.length;return n===0?"On no device yet":`On ${n} ${n===1?"device":"devices"}`}function R(e,n,r){let o=(t,s,a)=>i`<button type="button" class="lib-filter ${e===t?"on":""}"
    aria-pressed=${e===t?"true":"false"} title=${a} @click=${()=>{e!==t&&n(t)}}>${s}</button>`;return i`<span class="lib-filters" role="group" aria-label="Show">
    ${o("all","All",`Every ${r} in your home`)}
    ${o("none","On no device yet",`Only the ${r}s on no device yet`)}
  </span>`}function K(e,n,r){return e==="none"&&n<=1?i`<div class="lc-note">Every other ${r} is on a device.</div>`:l}var P=p`
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
`;export{D as a,E as b,T as c,j as d,z as e,R as f,K as g,P as h};
