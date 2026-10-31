import{b as ne}from"./chunk-LWSVU6XZ.js";import{c as N,d as U,e as F,f as q,g as Y,h as B,i as V,k as X,l as G,la as m,n as S,na as K,o as M,pa as Z,qa as ee,ua as te}from"./chunk-IZUWXV63.js";import{b as J,c as Q}from"./chunk-7J47EY3D.js";import{Qg as W,b as z,d as u,g}from"./chunk-TYJNYBNC.js";var Pe="You can undo it for 10 seconds after.";function _(n,e,t=""){return`${n}|${t.toUpperCase()}|${e.toUpperCase()}`}var f,C=new Set,c,P=new Set,ie=new Set,re=0;function v(){let n=new Set;for(let e of[...f===void 0?[]:[f.job],...C])for(let t of e.hide)n.add(t);ie=n,re++;for(let e of[...P])e()}function me(n){c!==void 0&&clearTimeout(c.timer),c={text:n,timer:setTimeout(()=>{c=void 0,v()},8e3)}}function se(n,e){n.due=Date.now()+e,n.timer=setTimeout(A,e)}function oe(n){A(),c!==void 0&&(clearTimeout(c.timer),c=void 0),f={job:n,timer:void 0,due:void 0,left:1e4},se(f,1e4),v()}function A(){let n=f;n!==void 0&&(n.timer!==void 0&&clearTimeout(n.timer),f=void 0,C.add(n.job),v(),n.job.send().catch(e=>e instanceof Error?e.message:"The delete failed.").then(e=>{C.delete(n.job),e!==void 0&&e!==""&&me(e),v()}))}function _e(){let n=f;return n===void 0?!1:(n.timer!==void 0&&clearTimeout(n.timer),f=void 0,v(),!0)}function Ae(n){let e=f;if(e!==void 0)if(n){if(e.due===void 0)return;e.timer!==void 0&&clearTimeout(e.timer),e.timer=void 0,e.left=Math.max(0,e.due-Date.now()),e.due=void 0}else e.due===void 0&&se(e,Math.max(e.left,3e3))}function Ie(){c!==void 0&&(clearTimeout(c.timer),c=void 0,v())}function ae(){return ie}function de(){return re}function Oe(){return f!==void 0}function De(){if(f!==void 0)return{text:f.job.text,tone:"ok",undo:!0};if(c!==void 0)return{text:c.text,tone:"err",undo:!1}}function le(n){return P.add(n),()=>{P.delete(n)}}function He(n){if(!(n.metaKey||n.ctrlKey)||n.shiftKey||n.altKey||n.key.toLowerCase()!=="z")return!1;let e=n.composedPath()[0];return e==null?!0:e.isContentEditable===!0||e.tagName==="TEXTAREA"||e.tagName==="SELECT"?!1:e.tagName==="INPUT"?["checkbox","radio","button","submit","reset","range","color"].includes(String(e.type)):!0}typeof window<"u"&&window.addEventListener("pagehide",A);var be=new Set(["pages","status_pages","menus"]),ye=250,k=n=>n.toUpperCase();function L(n,e,t){return`${n}|${k(e)}|${n==="menus"?t:k(t)}`}function w(n,e){return`${n}|${k(e)}`}function we(n,e){let t=(r,o)=>e.has(_(r,o)),i=(r,o)=>Object.fromEntries(Object.entries(o??{}).filter(([l])=>!t(r,l))),s={};for(let[r,o]of Object.entries(n.picks??{}))s[r]={...o,...o.pages===void 0?{}:{pages:o.pages.filter(l=>l.page!==void 0||!t("pages",l.id))},...o.status_pages===void 0?{}:{status_pages:o.status_pages.filter(l=>!t("status_pages",l.id))}};return{pages:i("pages",n.pages),status_pages:i("status_pages",n.status_pages),menus:i("menus",n.menus),picks:s}}var I=class{constructor(e){this.readState="idle";this.version=0;this.listeners=new Set;this.pendingTicks=new Map;this.notes=new Map;this.savedAt=new Map;this.again=!1;this.subscriptions=new Map;this.hass=e,le(()=>this.changed())}get library(){let e=this.read;if(e===void 0)return;let t=ae();if(![...t].some(s=>!s.startsWith("complications|")))return e;let i=de();return(this.shown?.read!==e||this.shown.version!==i)&&(this.shown={read:e,version:i,library:K(we(e.summary,t))}),this.shown.library}set library(e){this.read=e}setHass(e){this.hass=e}get pending(){return this.pendingTicks}noteFor(e,t){return this.notes.get(w(e,t))}savedStamp(e,t){return this.savedAt.get(w(e,t))}clearNote(e,t){this.notes.delete(w(e,t))&&this.changed()}listen(e,t=[]){let i={fn:e,owners:[...t]},s=this.listeners.size===0;return this.listeners.add(i),this.follow(),s&&this.refresh(),{update:r=>{this.listeners.has(i)&&(i.owners=[...r],this.follow())},stop:()=>{this.listeners.delete(i)&&(this.follow(),this.listeners.size===0&&this.reloadTimer!==void 0&&(clearTimeout(this.reloadTimer),this.reloadTimer=void 0))}}}refresh(){if(this.reading!==void 0)return this.again=!0,this.reading;let e=async()=>{do this.again=!1,await this.readOnce();while(this.again)};return this.reading=e().finally(()=>{this.reading=void 0}),this.reading}pick(e,t,i,s){return this.write(w(t,i),L(t,e,i),{on:s},()=>U(this.hass,e,t,i,s))}pickMenu(e,t,i){let s=this.library!==void 0&&!te(this.library,e,"menus")?ne():void 0;return this.write(w("menus",i),L("menus",e,t),{menuId:i},()=>F(this.hass,e,t,i,s))}createMenu(e,t,i){return this.write(void 0,void 0,void 0,()=>Y(this.hass,e,t,i))}createItem(e,t){return this.write(void 0,void 0,void 0,()=>G(this.hass,e,t))}copyMenu(e,t,i){return this.write(void 0,void 0,void 0,()=>q(this.hass,e,t,i))}renameMenu(e,t){return this.write(w("menus",e),void 0,void 0,()=>B(this.hass,e,t))}deleteItem(e,t){return this.write(w(e,t),void 0,void 0,()=>V(this.hass,e,t))}deleteItemLater(e,t,i,s){oe({text:i,hide:[_(e,t)],send:async()=>{let r=await this.deleteItem(e,t);if(!r.ok)return`Not deleted. ${r.text}`;let o=r.reply.link_failures?.length??0,l=await s?.(),h=[o>0?`Could not take it off ${o===1?"1 device":`${o} devices`}.`:void 0,l].filter(x=>x!==void 0&&x!=="");return h.length===0?void 0:h.join(" ")}})}async saveItem(e,t,i,s){try{return await X(this.hass,e,t,i,s)}finally{this.refresh()}}changed(){this.version++;for(let e of[...this.listeners])e.fn()}async readOnce(){this.readState==="idle"&&(this.readState="loading",this.changed());try{let e=await N(this.hass);this.library=K(e),this.readState="ready",this.readError=void 0}catch(e){let t=M(e);this.readState=t==="unknown_command"?"unsupported":"failed",this.readError=S(e)}this.changed()}async write(e,t,i,s){e!==void 0&&this.notes.delete(e),t!==void 0&&i!==void 0&&this.pendingTicks.set(t,i),this.changed();let r;try{r={ok:!0,reply:await s()},e!==void 0&&this.savedAt.set(e,Date.now())}catch(o){let l=M(o),h=S(o);r=l===void 0?{ok:!1,text:h}:{ok:!1,code:l,text:h},e!==void 0&&this.notes.set(e,h)}return await this.refresh(),t!==void 0&&this.pendingTicks.get(t)===i&&this.pendingTicks.delete(t),this.changed(),r}heard(e){!be.has(e)||this.listeners.size===0||(this.reloadTimer!==void 0&&clearTimeout(this.reloadTimer),this.reloadTimer=setTimeout(()=>{this.reloadTimer=void 0,this.listeners.size>0&&this.refresh()},ye))}follow(){let e=new Map;for(let t of this.listeners)for(let i of t.owners)e.set(k(i),i);for(let[t,i]of[...this.subscriptions])e.has(t)||(this.subscriptions.delete(t),i.end.then(s=>s?.()).catch(()=>{}));for(let[t,i]of e){if(this.subscriptions.has(t))continue;let s=W(this.hass,i,r=>{this.subscriptions.get(t)?.end===s&&this.heard(r.kind)}).then(r=>r,()=>{});this.subscriptions.set(t,{ownerId:i,end:s})}}},ue=class{constructor(e,t,i=()=>[]){this.host=e;this.hassOf=t;this.ownersOf=i;this.connected=!1;this.ownersSig="";e.addController(this)}get library(){return this.store?.library}get readState(){return this.store?.readState??"idle"}hostConnected(){this.connected=!0,this.attach()}hostDisconnected(){this.connected=!1,this.listening?.stop(),this.listening=void 0}hostUpdate(){this.attach()}attach(){if(!this.connected)return;let e=this.hassOf();if(e===void 0)return;let t=ve(e),i=this.ownersOf(),s=i.map(k).join(",");if(t!==this.store||this.listening===void 0){this.listening?.stop(),this.store=t,this.ownersSig=s,this.listening=t.listen(()=>this.host.requestUpdate(),i);return}s!==this.ownersSig&&(this.ownersSig=s,this.listening.update(i))}},ce=new WeakMap;function ve(n){let e=n.connection,t=ce.get(e);return t===void 0?(t=new I(n),ce.set(e,t)):t.setHass(n),t}var ke=typeof HTMLElement>"u"?class{}:HTMLElement;function xe(n,e,t){return n.length===0?!1:n.reduce((s,r)=>s+r,0)+e*(n.length-1)>t}var O=class extends ke{connectedCallback(){let e=this.closest(".lib-on");if(e===null||typeof ResizeObserver>"u"){this.hasAttribute("folded")&&this.removeAttribute("folded");return}let t=new ResizeObserver(()=>this.measure(e));t.observe(this),t.observe(e);let i=()=>{for(let s of this.chips())t.observe(s)};i(),this.kids=new MutationObserver(i),this.kids.observe(this,{childList:!0}),this.sizes=t}disconnectedCallback(){this.sizes?.disconnect(),this.kids?.disconnect(),this.sizes=void 0,this.kids=void 0}chips(){return Array.from(this.children).filter(e=>e.classList.contains("lt-chip"))}measure(e){let t=!1;if(this.querySelector(":scope > .lt-fold")!==null){this.gap??=parseFloat(getComputedStyle(this).columnGap)||0;let i=getComputedStyle(e),s=e.clientWidth-(parseFloat(i.paddingLeft)||0)-(parseFloat(i.paddingRight)||0);t=xe(this.chips().map(r=>r.offsetWidth),this.gap,s)}t!==this.hasAttribute("folded")&&this.toggleAttribute("folded",t)}};typeof customElements<"u"&&!customElements.get("wa-chip-row")&&customElements.define("wa-chip-row",O);var fe="Only an administrator can put this on a device.";function Le(n,e){return`${n} uses this menu. To change that, pick another ${e} for it.`}function Te(n){return`skips ${n}`}function $e(n,e){let t=e.length<=4?Q(e):`${e.slice(0,3).join(", ")} and ${e.length-3} more`;return`${n} skips ${t}: only an iPhone shows ${e.length===1?"it":"them"}.`}function Ee(n){let e=Re(n),t=n.kind==="pages"?n.skips??[]:[];return t.length===0?e:e.map(i=>{if(i.device!=="watch"||!i.on)return i;let s=$e(i.name,t);return{...i,title:`${i.title} ${s}`,skips:{text:Te(t.length),title:s}}})}function Re(n){let{library:e,kind:t,itemId:i,devices:s}=n,r=t==="menus",o=r?ee(e,i):void 0,l=r?void 0:Z(e,t,i),h=(r?o?.owners:l?.owners)??[],x=o?.unit==="entity"?"Entity quick menu":"Anywhere menu",T=a=>h.some(d=>m(d,a)),pe=a=>{if(r)return!1;let d=e.picks.get(a.toUpperCase())?.[t];return Array.isArray(d)&&d.some(p=>typeof p?.id=="string"&&m(p.id,i)&&p.isHidden===!0)};return(n.addFor===void 0?s:[...s.filter(a=>!m(a.ownerId,n.addFor)&&T(a.ownerId)),...s.filter(a=>m(a.ownerId,n.addFor))]).map(a=>{let d=a.ownerId,p=n.pending?.get(L(t,d,r?o?.unit??"":i)),$=p!==void 0&&(!r||"menuId"in p&&(m(p.menuId,i)||T(d))),b=T(d);p!==void 0&&(b="on"in p?p.on:m(p.menuId,i));let D=n.addFor!==void 0&&m(d,n.addFor)&&!b,H=b&&!$&&pe(d),he=n.colorOf(d),ge=D?`Add to this ${J(a.kind)}`:a.name,j=n.viewing!==void 0&&m(d,n.viewing),y={ownerId:d,name:a.name,device:a.kind,color:he,shape:r?"round":"square",on:b,hidden:H,busy:$,add:D,label:ge,...j?{viewing:j}:{}};if($)return{...y,title:"Saving\u2026",next:void 0};let E=n.locked?.(d);if(E!==void 0)return{...y,title:E,next:void 0,stuck:E};if(!b&&h.length===0&&n.admin===!1)return{...y,title:fe,next:void 0,stuck:fe};if(r)return b?{...y,title:Le(a.name,x),next:void 0}:{...y,title:`Use this menu on ${a.name}.`,next:!0};let R=t==="status_pages"?"status page":"page";return b?{...y,title:H?`On ${a.name}, hidden there. Untick to take the ${R} off it.`:`On ${a.name}. Untick to take the ${R} off it.`,next:!1}:{...y,title:`Not on ${a.name}. Tick to put the ${R} there.`,next:!0}})}function Ze(n,e){let t=Ee(n),i=n.kind==="menus"&&n.hint!==!1?n.hint??"Used by":void 0;return Se(t,{foldLabel:"Add to a device",...i===void 0?{}:{hint:i},...n.note===void 0?{}:{note:n.note},...n.noteKind===void 0?{}:{noteKind:n.noteKind},...n.ask===void 0?{}:{ask:n.ask}},e)}function Se(n,e,t){let i=r=>u`<button type="button"
      class="lt-chip ${r.on?"on":"off"} ${r.shape==="round"?"rd":""} ${r.add?"add":""} ${r.busy?"busy":""} ${r.stuck===void 0?"":"stuck"} ${r.hidden?"dim":""} ${r.viewing===!0?"viewing":""}"
      style=${r.color===void 0?g:`--dc:${r.color}`} title=${r.viewing===!0?`${r.title} You came here from ${r.name}.`:r.title}
      aria-pressed=${r.on?"true":"false"} aria-disabled=${r.next===void 0?"true":"false"}
      @click=${o=>{o.stopPropagation(),r.next!==void 0&&t(r.ownerId,r.next)}}><span class="lt-box" aria-hidden="true"></span><span class="lt-name">${r.label}</span>${r.hidden?u`<em>hidden</em>`:r.tag===void 0?g:u`<em>${r.tag}</em>`}${r.skips===void 0?g:u`<em class="lt-skips" title=${r.skips.title}>${r.skips.text}</em>`}${r.viewing===!0?u`<em class="lt-viewing">viewing</em>`:g}</button>`,s=n.some(r=>!r.on&&!r.add);return u`<div class="lt-ticks" @click=${r=>r.stopPropagation()}>
    ${e.hint===void 0?g:u`<span class="lt-hint">${e.hint}</span>`}
    <wa-chip-row class="lt-chips" role="group" aria-label=${e.hint??"Devices"}>${n.map(i)}${s?u`<details class="lt-fold" @toggle=${Ke}>
      <summary class="lt-chip add lt-fold-sum"><span class="lt-name">+ ${e.foldLabel}</span><svg class="lt-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></summary>
      <div class="lt-fold-pop" role="group" aria-label=${e.foldLabel}>${n.map(i)}</div>
    </details>`:g}</wa-chip-row>
    ${e.ask===void 0?g:Me(e.ask)}
    ${e.note===void 0?g:e.noteKind==="ok"?u`<p class="lt-note ok" role="status">${e.note}</p>`:u`<p class="lt-note" role="alert">${e.note}</p>`}
  </div>`}function Me(n){return u`<div class="lt-ask" role="alertdialog" aria-label=${n.text}>
    <span class="lt-ask-q">${n.text}</span>
    <span class="lt-ask-acts">
      <button type="button" class="lt-ask-btn danger" @click=${()=>n.onRemove()}>Remove</button>
      <button type="button" class="lt-ask-btn" @click=${()=>n.onCancel()}>Cancel</button>
    </span>
  </div>`}function Ke(n){let e=n.currentTarget;if(!e.open)return;let t=e.ownerDocument,i=o=>{o.composedPath().includes(e)||(e.open=!1)},s=o=>{o.key==="Escape"&&(e.open=!1)},r=()=>{e.open||(t.removeEventListener("pointerdown",i,!0),t.removeEventListener("keydown",s,!0),e.removeEventListener("toggle",r))};t.addEventListener("pointerdown",i,!0),t.addEventListener("keydown",s,!0),e.addEventListener("toggle",r)}var et=z`
  .lt-ticks { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .lt-hint { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  wa-chip-row { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-width: 0; }
  .lt-chip {
    display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 22px; padding: 0 8px 0 6px;
    border-radius: 999px; border: 1px solid var(--wa-line-strong); background: var(--wa-input, var(--wa-hover));
    font: inherit; font-size: 11px; color: var(--wa-ink); cursor: pointer;
    transition: border-color .12s ease-out, background-color .12s ease-out;
  }
  .lt-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-box {
    flex: none; width: 11px; height: 11px; border-radius: 3px; box-sizing: border-box;
    border: 1.5px solid var(--dc, var(--wa-muted));
  }
  .lt-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lt-chip.on {
    border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 60%, transparent);
    background: color-mix(in srgb, var(--dc, var(--wa-muted)) 18%, var(--wa-card));
  }
  .lt-chip.on .lt-box { background: var(--dc, var(--wa-muted)); border-color: var(--dc, var(--wa-muted)); }
  .lt-chip.off { color: var(--wa-muted); }
  .lt-chip.off:hover:not(.stuck):not(.busy) { color: var(--wa-ink); border-color: color-mix(in srgb, var(--dc, var(--wa-ink)) 60%, transparent); }
  .lt-chip.rd .lt-box { border-radius: 50%; }
  .lt-chip.on.rd .lt-box { box-shadow: inset 0 0 0 2.5px var(--wa-card); }
  .lt-chip.on.rd { cursor: default; }
  .lt-chip.add { border-style: dashed; background: transparent; color: var(--wa-muted); }
  .lt-chip.dim { opacity: .55; }
  /* The device the editor was opened from: a ring in its color, never a
     grey chip, and "viewing" after its name. */
  .lt-chip.viewing { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 3.5px var(--dc, var(--wa-ink)); }
  .lt-chip.viewing em.lt-viewing { color: var(--wa-ink); font-weight: 600; }
  /* The tags after the name never shrink or wrap: the name takes the
     ellipsis, so a narrow chip still says "skips 2" whole. */
  .lt-chip em { flex: none; white-space: nowrap; font-style: normal; font-size: 10px; color: var(--wa-muted); }
  .lt-chip.busy { opacity: .6; cursor: progress; }
  .lt-chip.stuck { opacity: .45; cursor: not-allowed; }
  .lt-note { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-need); }
  .lt-note.ok { color: var(--wa-muted); }
  /* The untick's question (renderTickAsk): the words, then the two buttons
     in the form sheet's small and danger look, drawn here so a host
     without that sheet (the Pages tab) draws them the same. */
  .lt-ask {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; max-width: 520px; padding: 8px 10px;
    border-radius: 8px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    font-size: 12px; line-height: 1.4; color: var(--wa-ink);
  }
  .lt-ask-q { flex: 1 1 220px; min-width: 0; }
  .lt-ask-acts { display: inline-flex; gap: 6px; flex: none; }
  .lt-ask .lt-ask-btn {
    font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field, var(--wa-input)); color: var(--wa-ink);
  }
  .lt-ask .lt-ask-btn:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); background: var(--wa-hover); }
  .lt-ask .lt-ask-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-ask .lt-ask-btn.danger {
    color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent);
    background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent);
  }
  .lt-ask .lt-ask-btn.danger:hover { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
  /* The fold (renderTickChips): in the DOM whenever a chip is off, shown
     only when the row has marked itself folded (chip-row.ts: the chips do
     not fit the device strip), and then the inline off chips step aside for
     it. Hidden, not gone: they keep their full width (no max-width to clamp
     them to the folded row), so the next measurement still knows how wide
     every chip is. The dashed "Add to this watch" chip never folds. */
  .lt-fold { display: none; position: relative; min-width: 0; }
  wa-chip-row[folded] > .lt-chip.off:not(.add) { position: absolute; top: 0; left: 0; max-width: none; visibility: hidden; pointer-events: none; }
  wa-chip-row[folded] > .lt-fold { display: inline-flex; }
  .lt-fold-sum { list-style: none; user-select: none; }
  .lt-fold-sum::-webkit-details-marker { display: none; }
  .lt-fold-sum::marker { content: ""; }
  .lt-fold-sum:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
  .lt-chev { flex: none; width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .12s ease-out; }
  .lt-fold[open] > .lt-fold-sum { color: var(--wa-ink); border-color: var(--wa-muted); }
  .lt-fold[open] .lt-chev { transform: rotate(180deg); }
  .lt-fold-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
    display: flex; flex-wrap: wrap; gap: 6px; min-width: 240px; max-width: 360px; padding: 8px; box-sizing: border-box;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px;
    box-shadow: var(--wa-shadow-pop, 0 8px 24px rgba(0, 0, 0, .28));
  }
  .lt-fold-pop .lt-chip.off { display: inline-flex; }
`;export{Pe as a,_ as b,oe as c,A as d,_e as e,Ae as f,Ie as g,ae as h,Oe as i,De as j,le as k,He as l,ue as m,Ee as n,Ze as o,Se as p,Me as q,et as r};
