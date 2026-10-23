import{M as m,q as p}from"./chunk-TII47Z4B.js";import{m as d}from"./chunk-WWKDSKNH.js";import{ya as o}from"./chunk-7ECLFNJH.js";import{b as a,d as n,g as l}from"./chunk-BDP52PL7.js";function h(e){let{rows:t,here:i}=e;if(t.length===0)return l;let s=d(i.kind);return n`<div class="lb-rest ${e.standalone===!0?"standalone":""}" role="group" aria-label=${s}>
    <div class="lb-rest-h"><span class="lb-rest-t">${s}</span><small>${t.length}</small>
      <span class="lb-rest-sp"></span>${e.more??l}</div>
    <p class="lb-rest-hint">${m(p(e.kind,2))}</p>
    <ul class="lb-rest-list">${t.map(r=>n`<li class="lb-rest-row" data-item=${r.entry.id}>
      ${e.picture(r.entry)}
      <span class="lb-rest-name"><b title=${r.entry.name}>${r.entry.name}</b><small>${r.meta}</small></span>
      ${o({library:e.library,kind:e.kind,itemId:r.entry.id,devices:[i],addFor:i.ownerId,colorOf:e.colorOf,...e.pending===void 0?{}:{pending:e.pending},...e.noteFor(r.entry.id)===void 0?{}:{note:e.noteFor(r.entry.id)},...e.admin===void 0?{}:{admin:e.admin},...e.locked===void 0?{}:{locked:()=>e.locked}},(b,c)=>{c&&e.onAdd(r.entry.id)})}
    </li>`)}</ul>
  </div>`}var w=a`
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
`;export{h as a,w as b};
