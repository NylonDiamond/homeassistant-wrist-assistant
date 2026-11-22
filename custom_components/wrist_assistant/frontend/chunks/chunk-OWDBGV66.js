import{d as $,h as k,i as u}from"./chunk-GCFUHEPB.js";import{Ma as S}from"./chunk-46TE2LW3.js";import{mh as v}from"./chunk-IKRXKHPF.js";import{Za as x,_a as b,l as h}from"./chunk-YFAFNDVC.js";import{b as f,f as d,i as p}from"./chunk-6ZDBXU6B.js";var y=7,E=86400;function g(e){return e===void 0?void 0:Math.floor(e/E)}function j(e){let t=g(e.seenSeconds);return t===void 0||t<y?!1:u({sync:e.sync,...e.rejected===void 0?{}:{rejected:[...e.rejected]}})}function m(e){return j(e)?"asleep":u({sync:e.sync,...e.rejected===void 0?{}:{rejected:[...e.rejected]}})?"waiting":e.sync==="synced"?"synced":"idle"}function T(e){switch(m(e)){case"asleep":return`Asleep \xB7 ${P(g(e.seenSeconds)??y)}`;case"waiting":return(e.rejected?.length??0)>0?k:e.waitingFor.includes(x)?b:e.waitingFor.length===0?"Waiting":`Waiting: ${$(e.waitingFor)}`;case"synced":return"Synced";case"idle":return"Nothing waiting"}}function P(e){return`${e} ${e===1?"day":"days"}`}function R(e){return`asleep, ${P(g(e.seenSeconds)??y)}`}function I(e,t,i,o={}){return e.map(n=>{let r=t(n.id),a=r?.polling===!0?0:typeof r?.last_seen_seconds=="number"?r.last_seen_seconds+Math.max(0,i):void 0,l=o.personOf?.(n.id),c=l?.trim().toLocaleLowerCase()===n.name.trim().toLocaleLowerCase()?void 0:l,s=o.colorOf?.(n.id);return{id:n.id,name:n.name,kind:n.kind,sync:n.sync,waitingFor:n.waitingFor,...n.rejected===void 0?{}:{rejected:n.rejected},...a===void 0?{}:{seenSeconds:a},...c===void 0?{}:{person:c},...s===void 0?{}:{color:s}}})}function _(e){let t=e.map(m),i=s=>t.filter(w=>w===s).length,o=i("waiting"),n=i("asleep"),r=i("synced"),a=e.length,l=n>0&&(o>0||r>0)?`\xB7 ${n} asleep`:"",c=n===0?"":` ${n} ${n===1?"is":"are"} asleep.`;if(o>0){let s=e.filter((w,D)=>t[D]==="waiting").map(w=>w.name).join(", ");return{tone:"wait",label:`Waiting \xB7 ${o}`,more:l,title:`Waiting for your latest changes: ${s}.${c} Show each device.`,waiting:o,asleep:n,synced:r,all:a}}return r>0?{tone:"ok",label:"Synced",more:l,title:`Every device that is awake has your latest changes.${c} Show each device.`,waiting:o,asleep:n,synced:r,all:a}:n>0?{tone:"quiet",label:`Asleep \xB7 ${n}`,more:"",title:`No device has been seen for a week or more.${c} Show each device.`,waiting:o,asleep:n,synced:r,all:a}:{tone:"quiet",label:a===0?"No devices":"Nothing waiting",more:"",title:a===0?h("No watch or iPhone is paired yet.","No watch or phone is paired yet."):"No device has anything to pick up. Show each device.",waiting:o,asleep:n,synced:r,all:a}}var A="Asleep: not seen for a week or more. Its changes wait safely and it catches up when it next connects, so it does not count as waiting.";function M(e){let t=e.devices;if(t.length===0)return p;let i=_(t),o=n=>{let r=m(n),a=T(n),l=d`<span class="wa-sync-art" style=${n.color===void 0?p:`--c:${n.color}`} aria-hidden="true">${v(n.kind==="iphone"?"phone":"watch")}</span>
      <span class="wa-sync-nm">${n.name}${n.person===void 0?p:d`<small>${n.person}</small>`}</span>
      <span class="wa-sync-st ${r}"><i class="wa-sync-dot ${r}" aria-hidden="true"></i>${a}</span>`,c=e.deviceHref?.(n.id);return c===void 0?d`<li class="wa-sync-row ${r}">${l}</li>`:d`<li><a class="wa-sync-row ${r}" href=${c} title=${`Open ${n.name}`}
      @click=${s=>{s.currentTarget.closest("details")?.removeAttribute("open"),!(e.onOpenDevice===void 0||!S(s))&&(s.preventDefault(),e.onOpenDevice(n.id))}}>${l}</a></li>`};return d`<details class="wa-sync" @toggle=${L}>
    <summary class="wa-sync-pill ${i.tone}" title=${i.title} aria-label=${`Sync: ${i.label}${i.more===""?"":` ${i.more}`}. ${i.title}`}>
      <i class="wa-sync-dot" aria-hidden="true"></i><span>${i.label}</span>${i.more===""?p:d`<span class="wa-sync-more">${i.more}</span>`}<svg class="wa-sync-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg>
    </summary>
    <div class="wa-sync-pop" role="group" aria-label="Sync, by device">
      <div class="wa-sync-head"><b>Sync</b><span>${t.length} ${t.length===1?"device":"devices"}</span></div>
      <ul class="wa-sync-list">${t.map(o)}</ul>
      ${i.asleep>0?d`<p class="wa-sync-foot">${A}</p>`:p}
    </div>
  </details>`}function L(e){let t=e.currentTarget;if(!t.open)return;let i=t.ownerDocument,o=a=>{a.composedPath().includes(t)||(t.open=!1)},n=a=>{a.key==="Escape"&&(t.open=!1,t.querySelector("summary")?.focus())},r=()=>{t.open||(i.removeEventListener("pointerdown",o,!0),i.removeEventListener("keydown",n,!0),t.removeEventListener("toggle",r))};i.addEventListener("pointerdown",o,!0),i.addEventListener("keydown",n,!0),t.addEventListener("toggle",r)}var q=f`
  details.wa-sync { position: relative; flex: none; }
  .wa-sync-pill {
    display: inline-flex; align-items: center; gap: 7px; height: 28px; box-sizing: border-box; padding: 0 10px 0 11px;
    border-radius: 999px; font-size: 12.5px; font-weight: 600; white-space: nowrap; cursor: pointer; user-select: none;
    list-style: none; color: var(--wa-muted); border: 1px solid var(--wa-line-strong); background: transparent;
  }
  .wa-sync-pill::-webkit-details-marker { display: none; }
  .wa-sync-pill::marker { content: ""; }
  .wa-sync-pill:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .wa-sync-pill.wait {
    color: var(--wa-amber); background: color-mix(in srgb, var(--wa-amber) 10%, transparent);
    border-color: color-mix(in srgb, var(--wa-amber) 45%, transparent);
  }
  .wa-sync-pill.ok {
    color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 8%, transparent);
    border-color: color-mix(in srgb, var(--wa-green) 45%, transparent);
  }
  .wa-sync-pill:hover { filter: brightness(1.12); }
  .wa-sync-pill > .wa-sync-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
  .wa-sync-more { color: var(--wa-muted); font-weight: 500; }
  .wa-sync-chev { width: 12px; height: 12px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .12s ease-out; }
  details.wa-sync[open] .wa-sync-chev { transform: rotate(180deg); }
  .wa-sync-pop {
    position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: 360px; max-width: calc(100vw - 24px);
    box-sizing: border-box; padding: 6px; border-radius: 12px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--wa-shadow-pop);
    max-height: min(70vh, 520px); overflow: auto;
  }
  .wa-sync-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px 8px; }
  .wa-sync-head b { font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .wa-sync-head span { font-size: 11.5px; color: var(--wa-muted); }
  .wa-sync-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
  .wa-sync-row {
    display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 7px;
    color: var(--wa-ink); text-decoration: none; font-size: 12.5px;
  }
  a.wa-sync-row:hover { background: var(--wa-hover); }
  a.wa-sync-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .wa-sync-row.waiting { background: color-mix(in srgb, var(--wa-amber) 9%, transparent); }
  .wa-sync-art {
    display: grid; place-items: center; width: 24px; height: 24px; flex: none; box-sizing: border-box; border-radius: 6px;
    border: 1.25px solid var(--c, var(--wa-line-strong)); color: var(--c, var(--wa-muted)); background: var(--wa-bg);
  }
  .wa-sync-art svg.ui-icon { width: 14px; height: 14px; }
  /* The device's name keeps its room: a long "Waiting: pages, menus, status
     pages" wraps beside it rather than cut the name to "Apple ...". */
  .wa-sync-nm { flex: 1 1 120px; min-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wa-sync-nm small { display: block; color: var(--wa-muted); font-size: 11px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; }
  .wa-sync-st { display: inline-flex; align-items: center; gap: 6px; flex: 0 1 auto; min-width: 0; font-size: 12px; text-align: right; color: var(--wa-muted); }
  .wa-sync-st.synced { color: var(--wa-green); }
  .wa-sync-st.waiting { color: var(--wa-amber); font-weight: 600; }
  i.wa-sync-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-faint); }
  i.wa-sync-dot.synced { background: var(--wa-green); }
  i.wa-sync-dot.waiting { background: var(--wa-amber); }
  .wa-sync-foot { margin: 6px 0 0; padding: 8px 8px 4px; border-top: 1px solid var(--wa-line); font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  /* A phone: the pill keeps its dot and its count only. */
  @media (max-width: 480px) {
    .wa-sync-more { display: none; }
    .wa-sync-pop { position: fixed; top: 52px; left: 12px; right: 12px; width: auto; }
  }
`;export{y as a,g as b,j as c,m as d,T as e,R as f,I as g,A as h,M as i,q as j};
