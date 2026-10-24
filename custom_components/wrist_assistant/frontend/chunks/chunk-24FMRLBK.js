import{qa as s,ta as g,za as y}from"./chunk-KBKKHLLL.js";import{Pg as h,b as p,d as a,g as l,ph as v}from"./chunk-NZCSPMZK.js";import{D as w}from"./chunk-ONFBHAVY.js";function S(e,n,i,t,r){if(e===void 0)return[];let d=g(e,n,i)?.owners??[];return t.flatMap(o=>{if(!d.some(c=>s(c,o.ownerId)))return[];let u=y(e,o.ownerId,n),f=u.findIndex(c=>s(c.id,i));if(f<0)return[];let m={ownerId:o.ownerId,name:o.name,kind:o.kind,place:f+1,count:u.length,hidden:u[f].hidden},x=r===void 0?void 0:Object.entries(r.owners).find(([c])=>s(c,o.ownerId))?.[1];return r!==void 0&&(m.sync=w(x?.[n])),[m]})}var b=400;function H(e,n,i){let t=!1,r,d;return Promise.resolve().then(()=>h(e,o=>{t||o.kind!==n||(r!==void 0&&clearTimeout(r),r=setTimeout(()=>{r=void 0,t||i()},b))})).then(o=>{t?o().catch(()=>{}):d=o},()=>{}),()=>{t=!0,r!==void 0&&clearTimeout(r),r=void 0,d?.().catch(()=>{}),d=void 0}}function $(e){let n=e%100,i=n>=11&&n<=13?"th":e%10===1?"st":e%10===2?"nd":e%10===3?"rd":"th";return`${e}${i}`}function k(e,n){let i=n==="status_pages"?"status page":"page";return e.count<=1?`Its only ${i}`:`${$(e.place)} of ${e.count} ${i}s`}function I(e){return e.sync==="delivered"?"Synced":e.sync==="waiting"?`Waiting for the ${e.kind==="iphone"?"iPhone":"watch"}`:""}function F(e){return e.lines.length===0?a`<div class="oed"><p class="oed-none">On no device yet. Tick a device over the preview to put it there.</p></div>`:a`<div class="oed" role="list">
    ${e.lines.map(n=>{let i=e.colorOf(n.ownerId),t=I(n),r=k(n,e.kind);return a`<div class="oed-row ${n.hidden?"hidden":""}" role="listitem" style=${i===void 0?"":`--dc:${i}`}>
        <span class="oed-name"><span class="oed-glyph" aria-hidden="true">${v(n.kind==="iphone"?"phone":"watch")}</span><span class="oed-n" title=${n.name}>${n.name}</span></span>
        ${e.onOpenBoard===void 0?a`<span class="oed-place">${r}</span>`:a`<button type="button" class="oed-place link" title=${`Open ${n.name}'s board to change the order`}
              @click=${()=>e.onOpenBoard(n.ownerId)}>${r}</button>`}
        ${t===""?l:a`<span class="oed-sync ${n.sync??""}">${t}</span>`}
        ${e.kind==="status_pages"?l:a`<label class="oed-hide" title=${n.hidden?`Hidden on ${n.name}. It keeps its place there.`:`Hide it on ${n.name}. It keeps its place there.`}>
          <span>Hide here</span>
          <input type="checkbox" role="switch" .checked=${n.hidden} ?disabled=${e.busy}
            @change=${d=>e.onHide(n.ownerId,d.target.checked)} />
        </label>`}
      </div>`})}
  </div>`}var z=p`
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
`;function K(e,n,i){return e.filter(t=>s(t.id,n)||i==="all"||t.owners.length===0)}function W(e){let n=e.owners.length;return n===0?"On no device yet":`On ${n} ${n===1?"device":"devices"}`}function _(e,n,i){let t=(r,d,o)=>a`<button type="button" class="lib-filter ${e===r?"on":""}"
    aria-pressed=${e===r?"true":"false"} title=${o} @click=${()=>{e!==r&&n(r)}}>${d}</button>`;return a`<span class="lib-filters" role="group" aria-label="Show">
    ${t("all","All",`Every ${i} in your home`)}
    ${t("none","On no device yet",`Only the ${i}s on no device yet`)}
  </span>`}function B(e,n,i){return e==="none"&&n<=1?a`<div class="lc-note">Every other ${i} is on a device.</div>`:l}var M=p`
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
`;export{S as a,H as b,F as c,z as d,K as e,W as f,_ as g,B as h,M as i};
