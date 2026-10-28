import{la as c,pa as w,va as g}from"./chunk-5H6OWAXC.js";import{Pg as h,b as m,d,g as u,rh as v}from"./chunk-H2SVQBFU.js";import{J as y}from"./chunk-OM34V22N.js";function H(e,n,t,r,i){if(e===void 0)return[];let a=w(e,n,t)?.owners??[];return r.flatMap(o=>{if(!a.some(s=>c(s,o.ownerId)))return[];let p=g(e,o.ownerId,n),l=p.findIndex(s=>c(s.id,t));if(l<0)return[];let f={ownerId:o.ownerId,name:o.name,kind:o.kind,place:l+1,count:p.length,hidden:p[l].hidden},x=i===void 0?void 0:Object.entries(i.owners).find(([s])=>c(s,o.ownerId))?.[1];return i!==void 0&&(f.sync=y(x?.[n])),[f]})}var b=400;function S(e,n,t){let r=!1,i,a;return Promise.resolve().then(()=>h(e,o=>{r||o.kind!==n||(i!==void 0&&clearTimeout(i),i=setTimeout(()=>{i=void 0,r||t()},b))})).then(o=>{r?o().catch(()=>{}):a=o},()=>{}),()=>{r=!0,i!==void 0&&clearTimeout(i),i=void 0,a?.().catch(()=>{}),a=void 0}}function k(e){let n=e%100,t=n>=11&&n<=13?"th":e%10===1?"st":e%10===2?"nd":e%10===3?"rd":"th";return`${e}${t}`}function $(e,n){let t=n==="status_pages"?"status page":"page";return e.count<=1?`Its only ${t}`:`${k(e.place)} of ${e.count} ${t}s`}function L(e){return e.sync==="delivered"?"Synced":e.sync==="waiting"?`Waiting for the ${e.kind==="iphone"?"iPhone":"watch"}`:""}function z(e){return e.lines.length===0?d`<div class="oed"><p class="oed-none">On no device yet. Tick a device over the preview to put it there.</p></div>`:d`<div class="oed" role="list">
    ${e.lines.map(n=>{let t=e.colorOf(n.ownerId),r=L(n),i=$(n,e.kind);return d`<div class="oed-row ${n.hidden?"hidden":""}" role="listitem" style=${t===void 0?"":`--dc:${t}`}>
        <span class="oed-name"><span class="oed-glyph" aria-hidden="true">${v(n.kind==="iphone"?"phone":"watch")}</span><span class="oed-n" title=${n.name}>${n.name}</span></span>
        ${e.onOpenBoard===void 0?d`<span class="oed-place">${i}</span>`:d`<button type="button" class="oed-place link" title=${`Open ${n.name}'s board to change the order`}
              @click=${()=>e.onOpenBoard(n.ownerId)}>${i}</button>`}
        ${r===""?u:d`<span class="oed-sync ${n.sync??""}">${r}</span>`}
        ${e.kind==="status_pages"?u:d`<label class="oed-hide" title=${n.hidden?`Hidden on ${n.name}. It keeps its place there.`:`Hide it on ${n.name}. It keeps its place there.`}>
          <span>Hide here</span>
          <input type="checkbox" role="switch" .checked=${n.hidden} ?disabled=${e.busy}
            @change=${a=>e.onHide(n.ownerId,a.target.checked)} />
        </label>`}
      </div>`})}
  </div>`}var j=m`
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
`;export{H as a,S as b,z as c,j as d};
