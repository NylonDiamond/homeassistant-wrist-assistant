import{A as $}from"./chunk-HWN5RZUM.js";import{j as g}from"./chunk-TOKIRHDQ.js";import{Jg as f,oh as d}from"./chunk-WJ2EW5QK.js";import{$ as y,X as h,fa as k}from"./chunk-5LB7PZLF.js";import{P as m}from"./chunk-WMGSOSBD.js";import{b as c,f as t,g as v,i as s}from"./chunk-6ZDBXU6B.js";function j(e,n,a,o,i){if(e===void 0)return[];let p=y(e,n,a)?.owners??[];return o.flatMap(r=>{if(!p.some(l=>h(l,r.ownerId)))return[];let u=k(e,r.ownerId,n),b=u.findIndex(l=>h(l.id,a));if(b<0)return[];let x={ownerId:r.ownerId,name:r.name,kind:r.kind,place:b+1,count:u.length,hidden:u[b].hidden},L=i===void 0?void 0:Object.entries(i.owners).find(([l])=>h(l,r.ownerId))?.[1];return i!==void 0&&(x.sync=m(L?.[n])),[x]})}var S=400;function M(e,n,a){let o=!1,i,p;return Promise.resolve().then(()=>f(e,r=>{o||r.kind!==n||(i!==void 0&&clearTimeout(i),i=setTimeout(()=>{i=void 0,o||a()},S))})).then(r=>{o?r().catch(()=>{}):p=r},()=>{}),()=>{o=!0,i!==void 0&&clearTimeout(i),i=void 0,p?.().catch(()=>{}),p=void 0}}function O(e){let n=e%100,a=n>=11&&n<=13?"th":e%10===1?"st":e%10===2?"nd":e%10===3?"rd":"th";return`${e}${a}`}function P(e,n){let a=n==="status_pages"?"status page":"page";return e.count<=1?`Its only ${a}`:`${O(e.place)} of ${e.count} ${a}s`}function D(e){return e.sync==="delivered"?"Synced":e.sync==="waiting"?`Waiting for the ${e.kind==="iphone"?"iPhone":"watch"}`:""}function U(e){return e.lines.length===0?t`<div class="oed"><p class="oed-none">On no device yet. Tick a device over the preview to put it there.</p></div>`:t`<div class="oed" role="list">
    ${e.lines.map(n=>{let a=e.colorOf(n.ownerId),o=D(n),i=P(n,e.kind);return t`<div class="oed-row ${n.hidden?"hidden":""}" role="listitem" style=${a===void 0?"":`--dc:${a}`}>
        <span class="oed-name"><span class="oed-glyph" aria-hidden="true">${d(n.kind==="iphone"?"phone":"watch")}</span><span class="oed-n" title=${n.name}>${n.name}</span></span>
        ${e.onOpenBoard===void 0?t`<span class="oed-place">${i}</span>`:t`<button type="button" class="oed-place link" title=${`Open ${n.name}'s board to change the order`}
              @click=${()=>e.onOpenBoard(n.ownerId)}>${i}</button>`}
        ${o===""?s:t`<span class="oed-sync ${n.sync??""}">${o}</span>`}
        ${e.kind==="status_pages"?s:t`<label class="oed-hide" title=${n.hidden?`Hidden on ${n.name}. It keeps its place there.`:`Hide it on ${n.name}. It keeps its place there.`}>
          <span>Hide here</span>
          <input type="checkbox" role="switch" .checked=${n.hidden} ?disabled=${e.busy}
            @change=${p=>e.onHide(n.ownerId,p.target.checked)} />
        </label>`}
      </div>`})}
  </div>`}var _=c`
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
`;var T=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),I=T?"\u2318":"Ctrl+";function z(e){return n=>{let a=n.target;n.key==="Enter"?(n.preventDefault(),e.onCommit(),a.blur()):n.key==="Escape"&&(n.preventDefault(),n.stopPropagation(),e.onCancel(),a.blur())}}var E=v`<path d="M10.8 2.7l2.5 2.5L5.6 12.9l-3.1.6.6-3.1 7.7-7.7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;function V(e){let n=e.typed??e.name;return t`<span class="pe-name" data-size=${n===""?e.placeholder:n}>
    <input type="text" class="pe-name-in" size="1" aria-label=${e.label} title=${`${e.label}. Click to rename.`} placeholder=${e.placeholder}
      spellcheck="false" autocomplete="off" .value=${g(n)} ?disabled=${e.disabled}
      @input=${a=>e.onInput(a.target.value)}
      @keydown=${z(e)}
      @blur=${()=>e.onCommit()} />
    <svg class="pe-name-pen" viewBox="0 0 16 16" aria-hidden="true">${E}</svg>
  </span>`}function Z(e){let n=e.typed??e.name;return t`<label class="field pe-page-name"><span>Name</span>
    <input type="text" aria-label=${e.label} placeholder=${e.placeholder} autocomplete="off" .value=${g(n)} ?disabled=${e.disabled}
      @input=${a=>e.onInput(a.target.value)}
      @keydown=${z(e)}
      @blur=${()=>e.onCommit()} /></label>`}var R="On no device yet";function X(e){return e.length===0?R:e.length<=2?`On ${e.join(" and ")}`:`On ${e.length} devices`}function G(e){return t`<button type="button" class="pe-pp" aria-haspopup="dialog" aria-expanded=${e.open?"true":"false"}
    aria-label=${e.label} title=${e.title} @click=${e.onClick}>${d("grid")}</button>`}function J(e,n){return n===void 0?t`<span class="pe-bar-meta">${e}</span>`:t`<span class="pe-bar-meta">${e} · <span title=${n}>Shared</span></span>`}function Q(e){return t`<span class="pe-bar-undo">
    <button type="button" class="tb-btn icon pe-bar-icon" ?disabled=${!e.canUndo} title=${`Undo (${I}Z)`} aria-label="Undo"
      @click=${e.onUndo}>${d("undo")}</button>
    <button type="button" class="tb-btn icon pe-bar-icon" ?disabled=${!e.canRedo} title=${T?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
      @click=${e.onRedo}>${d("redo")}</button>
  </span>`}function ee(e){return!e.dirty&&!e.saving?t`<span class="pe-saved" role="status" title=${`Everything here is saved. ${e.reach}`}>${d("check")}<span>Saved</span></span>`:t`${e.saving?s:t`<span class="pe-unsaved" role="status" title="Not saved yet"><i class="pe-unsaved-dot" aria-hidden="true"></i><span>Unsaved changes</span></span>`}
    <button type="button" class="primary save dirty pe-save" ?disabled=${e.saving}
      title=${`Save (${I}S). ${e.reach}`} @click=${e.onSave}>${e.saving?"Saving\u2026":"Save"}</button>`}var w="wa-page-editor-help";function ne(){try{return globalThis.localStorage.getItem(w)==="1"}catch{return!1}}function ae(e){try{e?globalThis.localStorage.setItem(w,"1"):globalThis.localStorage.removeItem(w)}catch{}}function te(e,n){return t`<button type="button" class="tb-btn pe-bar-help ${e?"on":""}" aria-pressed=${e?"true":"false"} title=${e?"Hide the hints on the stage and under the settings":"Show the hints on the stage and under the settings"}
    @click=${n}>Hints</button>`}function ie(e){let n=(a,o)=>{let i=e.kind===a&&!e.duo;return t`<button type="button" class="pe-seg-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
      title=${a==="watch"?"Preview on a watch":"Preview on an iPhone"}
      @click=${()=>{i||($(a),e.onPick(a))}}>${o}</button>`};return t`<div class="pe-seg" role="group" aria-label="Preview on" title="What the page is drawn on. Nothing is changed on any device.">
    ${n("watch","Watch")}
    ${n("iphone","iPhone")}
    ${e.phones?t`<button type="button" class="pe-seg-btn ${e.duo?"on":""}" aria-pressed=${e.duo?"true":"false"}
      title="Side by side: a watch and an iPhone" @click=${()=>{e.duo||e.onBoth()}}>Both</button>`:s}
  </div>`}var oe=c`
  /* The editor bar (renderTopBar): one row the mock's 58px tall, All
     pages and the page picker at the left, the devices after them, and
     Undo, Redo, the save status, ··· and Help at the right. It wraps on a
     narrow editor, the right-hand group keeping together. */
  .wa-bar.pe-bar { gap: 6px 7px; min-height: 58px; padding: 6px 12px; margin-bottom: 0; }
  /* The right cluster pushes itself to the end: a spacer would only add a gap,
     and this bar needs every pixel to stay on one line at 1184. */
  .wa-bar.pe-bar > .spacer { display: none; }
  .pe-bar button.tb-btn { height: 32px; border-radius: 8px; }
  .pe-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  .pe-bar button.tb-btn.pe-bar-back:has(> svg.ui-icon) { padding: 0 6px 0 2px; }
  .pe-bar button.tb-btn.pe-bar-help { padding: 0 9px; }
  .pe-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
  /* All pages, Undo and Redo are quiet: no outline until the pointer is on them. */
  .pe-bar button.tb-btn.pe-bar-back, .pe-bar button.tb-btn.icon { border-color: transparent; background: transparent; color: var(--wa-label, var(--wa-ink)); }
  .pe-bar button.tb-btn.pe-bar-back:hover, .pe-bar button.tb-btn.icon:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .pe-bar button.tb-btn.icon { width: 34px; padding: 0; display: inline-grid; place-items: center; }
  .pe-bar button.tb-btn.icon svg.ui-icon { width: 17px; height: 17px; }
  .pe-bar-div { flex: none; width: 1px; height: 24px; background: var(--wa-line-strong); }
  .pe-bar-undo { display: inline-flex; align-items: center; gap: 2px; flex: none; }
  .pe-bar button.tb-btn:disabled { opacity: .4; cursor: default; }
  .pe-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
  .pe-bar .pop-menu .row:disabled:hover { background: transparent; }
  /* The ··· menu hangs from its own button, not the bar's right edge. */
  .pe-top-menu { position: relative; display: inline-flex; flex: none; }
  .pe-menu { min-width: 240px; }
  .pe-menu-facts {
    display: flex; flex-direction: column; gap: 2px; max-width: 320px; padding: 7px 10px 8px; margin-bottom: 3px;
    border-bottom: 1px solid var(--wa-line); font-size: 12px; line-height: 1.35; color: var(--wa-muted); white-space: normal;
  }
  .pe-menu-facts > b { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .pe-bar button.tb-btn.pe-bar-help.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); color: var(--wa-ink); }
  /* Saved: quiet, in green with a check. Unsaved: the words in orange
     with a dot, and Save in blue, the bar's one loud button. */
  .pe-saved { display: inline-flex; align-items: center; gap: 6px; flex: none; padding: 0 2px; font-size: 12.5px; color: var(--wa-green); white-space: nowrap; }
  .pe-saved svg.ui-icon { width: 14px; height: 14px; }
  .pe-unsaved { display: inline-flex; align-items: center; gap: 7px; flex: none; font-size: 12.5px; font-weight: 500; color: var(--wa-hue-orange); white-space: nowrap; }
  .pe-unsaved-dot { display: block; flex: none; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .wa-bar.pe-bar button.primary.save.pe-save {
    height: 32px; min-height: 32px; padding: 0 16px; border-radius: 9px; border: 0; box-shadow: none;
    background: var(--wa-hue-blue); color: #fff; font-size: 13px; font-weight: 600; opacity: 1;
  }
  .wa-bar.pe-bar button.primary.save.pe-save:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-blue) 86%, #fff); }
  .wa-bar.pe-bar button.primary.save.pe-save:focus-visible { box-shadow: var(--wa-ring); }
  .wa-bar.pe-bar button.primary.save.pe-save:disabled { opacity: .7; cursor: progress; }
  /* The right cluster: always together at the bar's end, after its divider,
     so the save state sits in the same spot whatever the page is called. */
  .pe-bar-right { display: inline-flex; align-items: center; gap: 4px; flex: none; margin-left: auto; }
  .pe-bar-right > .pe-bar-div { margin-right: 2px; }
  /* The devices after the name (renderBarTicks): "Shown on", the ticked
     chips a size up from the cards', the dashed fold with the rest, then
     "saves at once". The fold is always shown here, whatever the width: the
     chip row only folds itself inside the old device strip. */
  .pe-bar-on { position: relative; display: flex; align-items: center; gap: 8px; flex: 0 1 auto; min-width: 0; }
  .pe-bar-on .lt-ticks { flex-direction: row; align-items: center; min-width: 0; }
  .pe-bar-on .lt-lead { font-weight: 600; }
  .pe-bar-on .lt-chips { gap: 6px; }
  .pe-bar-on .lt-chip { height: 28px; padding: 0 9px 0 7px; font-size: 12px; border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 55%, transparent); }
  .pe-bar-on .lt-chip.add { border-color: var(--wa-line-strong); }
  .pe-bar-on .lt-box { width: 12px; height: 12px; }
  /* "skips 2" stays in the chip's tooltip here: the line under the stage says
     the same in full, and the bar has no room for it at 1184. */
  .pe-bar-on .lt-chip .lt-skips { display: none; }
  .pe-bar-on wa-chip-row > .lt-chip.off:not(.add) { display: none; }
  .pe-bar-on wa-chip-row > .lt-fold { display: inline-flex; }
  .pe-bar-on .lt-fold-pop .lt-chip { height: 26px; }
  /* An untick's question and a refusal hang under the bar, over the stage. */
  .pe-bar-on :is(.lt-ask, .lt-note) { position: absolute; top: calc(100% + 10px); left: 0; z-index: 45; width: max-content; max-width: min(460px, 80vw); }
  .pe-bar-on .lt-note { padding: 7px 10px; border-radius: 8px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong), var(--wa-shadow-pop); }
  .pe-bar-on .pe-lib-hint { max-width: 280px; font-size: 12px; line-height: 1.3; color: var(--wa-muted); }
  /* The ring says which device the editor came from; the chip's tooltip says
     it in words. */
  .pe-bar-on .lt-chip em.lt-viewing { display: none; }
  /* One line wherever it can fit: a long device name gives way first, then
     the two quiet words. Only a phone-sized editor wraps. */
  @container (min-width: 760px) {
    .wa-bar.pe-bar { flex-wrap: nowrap; }
    .pe-bar-on .lt-ticks, .pe-bar-on .lt-chipline, .pe-bar-on wa-chip-row { flex-wrap: nowrap; min-width: 0; }
    .pe-bar-on wa-chip-row > .lt-chip { flex: 0 1 auto; min-width: 46px; }
    .pe-bar-on wa-chip-row > .lt-fold { flex: none; }
  }
  @container (max-width: 1040px) {
    .pe-bar .pe-bar-meta, .pe-bar-on .lt-saves { display: none; }
  }

  /* The page switcher's small grid button, beside the name it used to hide
     behind. */
  .pe-pp-wrap { position: relative; flex: none; }
  .pe-pp {
    display: inline-grid; place-items: center; width: 30px; height: 30px; margin: 0; padding: 0;
    border: 1px solid var(--wa-line-strong); border-radius: 7px;
    background: var(--wa-card); color: var(--wa-label, var(--wa-ink)); cursor: pointer;
  }
  .pe-pp svg.ui-icon { width: 15px; height: 15px; }
  .pe-pp:hover, .pe-pp[aria-expanded="true"] { background: var(--wa-hover); color: var(--wa-ink); }
  .pe-pp:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* The popover: under the button, as wide as four cards, never past the
     editor's edge. */
  .pe-pp-pop {
    position: absolute; top: calc(100% + 8px); left: 0; z-index: 40;
    width: min(720px, calc(100cqw - 2 * var(--cf-pad, 16px))); max-height: min(72vh, 680px); overflow-y: auto;
    display: flex; flex-direction: column; gap: 14px; padding: 16px;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg, 16px);
    background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
  }
  .pe-pp-top { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; }
  .pe-pp-top > strong { font-size: 15px; }
  .pe-pp-count { font-size: 12.5px; color: var(--wa-muted); }
  .pe-pp-find {
    margin-left: auto; width: 220px; max-width: 100%; min-height: 34px; padding: 0 10px;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-input, var(--wa-card)); color: var(--wa-ink); font: inherit; font-size: 13.5px;
  }
  .pe-pp-find:focus { outline: none; box-shadow: var(--wa-ring); border-color: var(--wa-sel-ring); }
  .pe-pp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
  .pe-pp-card {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; margin: 0;
    padding: 14px 8px 10px; border: 1px solid var(--wa-line); border-radius: 12px;
    background: var(--wa-panel); color: var(--wa-ink); font: inherit; cursor: pointer;
  }
  .pe-pp-card:hover:not(:disabled) { border-color: var(--wa-accent); }
  .pe-pp-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-pp-card.on { border-color: var(--wa-sel-ring); background: var(--wa-sel-bg); }
  .pe-pp-card:disabled { opacity: .55; cursor: default; }
  .pe-pp-card-name, .pe-pp-card-sub { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pe-pp-card-name { font-size: 13.5px; font-weight: 600; }
  .pe-pp-card-sub { font-size: 11.5px; color: var(--wa-muted); }
  .pe-pp-tag {
    position: absolute; top: 7px; right: 7px; padding: 2px 7px; border-radius: 999px;
    background: var(--wa-primary-bg); color: var(--wa-primary-ink); font-size: 10.5px; font-weight: 600;
  }
  .pe-pp-card.pe-pp-new { justify-content: center; min-height: 150px; border-style: dashed; background: transparent; color: var(--wa-muted); }
  .pe-pp-card.pe-pp-new:hover:not(:disabled) { color: var(--wa-ink); }
  .pe-pp-plus svg.ui-icon { width: 22px; height: 22px; }
  .pe-pp-none { font-size: 13px; color: var(--wa-muted); }
  .pe-pp-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding-top: 12px; border-top: 1px solid var(--wa-line); }
  .pe-pp-board { margin-left: auto; }

  .pe-seg {
    display: inline-flex; gap: 2px; padding: 3px; border-radius: 10px;
    background: var(--wa-field, var(--wa-panel)); border: 1px solid var(--wa-line);
  }
  .pe-seg-btn {
    margin: 0; padding: 5px 14px; border: 0; border-radius: 7px; background: none; color: var(--wa-muted);
    font: inherit; font-size: 12.5px; font-weight: 500; white-space: nowrap; cursor: pointer;
  }
  .pe-seg-btn:hover { color: var(--wa-ink); }
  .pe-seg-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-seg-btn.on { background: var(--wa-seg-on, var(--wa-card)); color: var(--wa-ink); box-shadow: 0 1px 2px rgba(0, 0, 0, .35); cursor: default; }

  /* The stage's foot, top to bottom: the row the picked tile's states
     float in, and the dock, one pill that ends with Preview on (Watch,
     iPhone, Both) beside Live preview. All in the flow, so none of them
     covers the device. */
  .pe-dock-area { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; min-width: 0; }
  .pe-dock > .pe-seg { flex: none; max-width: 100%; }
  /* The states' row keeps its height whether a tile is picked or not, so
     picking one never moves the device or refits it. The strip floats in
     it and stays one line (its chips scroll sideways, \`.pe-state-chips\`),
     so it never rises over the device above it. */
  .pe-try-slot { position: relative; align-self: stretch; height: 32px; flex: none; }
  .pe-dock-area > .stage-tools.pe-dock {
    position: relative; top: auto; z-index: 8; margin: 0; height: auto; min-height: 46px; width: max-content; max-width: calc(100% - 8px);
    display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; padding: 6px; overflow: visible;
    border-radius: 14px; background: var(--wa-card); border: 1px solid var(--wa-line-strong);
    box-shadow: var(--wa-shadow-float, var(--wa-shadow-pop));
  }
  .pe-dock .pe-zoom-pct { min-width: 50px; text-align: center; font-size: 12.5px; font-variant-numeric: tabular-nums; color: var(--wa-ink); }

  /* + Add tile at the top of the stage: the stage's one loud button, big
     and in blue with a soft glow of its own color, so it is found first. */
  .pe-stage-add {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex: none;
    margin: 0; padding: 9px 20px 9px 16px; border: 0; border-radius: 10px;
    background: var(--wa-hue-blue); color: #fff; font: inherit; font-size: 14px; font-weight: 600; line-height: 18px; cursor: pointer;
    box-shadow: 0 4px 18px color-mix(in srgb, var(--wa-hue-blue) 40%, transparent);
  }
  .pe-stage-add:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-blue) 86%, #fff); }
  .pe-stage-add:focus-visible { outline: none; box-shadow: var(--wa-ring), 0 4px 18px color-mix(in srgb, var(--wa-hue-blue) 40%, transparent); }
  .pe-stage-add:disabled { opacity: .5; cursor: default; box-shadow: none; }
  .pe-stage-add svg.ui-icon { width: 16px; height: 16px; }

  /* The page's card headings read as a tile's sections do: sentence case,
     13px semibold, no colored badge. They still fold, so they keep the
     chevron. */
  .pe-page-insp .sec-h h4 { font-size: 13px; font-weight: 600; letter-spacing: 0; text-transform: none; }
  .pe-page-insp .sec-h .swatch { display: none; }

  /* No tile selected: the page's own cards, then a quiet line saying how
     to reach a tile (a dashed hairline, muted), then Delete page. */
  .pe-no-tile {
    display: flex; align-items: center; gap: 10px; margin: 12px 0 0; padding: 10px 12px;
    border: 1px dashed var(--wa-line-strong); border-radius: var(--wa-lc-r);
  }
  .pe-no-tile > p { margin: 0; flex: 1; min-width: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pe-no-tile-ic { display: grid; place-items: center; flex: none; color: var(--wa-muted); }
  .pe-no-tile-ic svg { width: 16px; height: 16px; }
  .pe-add-first { flex: none; }
  .pe-page-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 0; }
  .pe-page-acts > .pe-btn { flex: 1 1 0; min-width: 0; min-height: 30px; font-size: 12.5px; white-space: normal; overflow-wrap: anywhere; }
  .pe-page-acts > .pe-btn.pe-danger { align-self: auto; border-color: color-mix(in srgb, var(--wa-need) 55%, var(--wa-line-strong)); background: transparent; }
  .pe-page-acts > .pe-btn.pe-danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-need) 10%, transparent); }

  .pe-stage-top { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; flex: none; min-width: 0; }
  /* The name in place: a plain title at rest, a faint well and a pencil
     under the pointer, the field's own ring while typed in. The hidden copy
     of the words sizes the box, with the pencil's room kept at its end so
     the words beside it do not move when it shows. */
  .pe-name {
    position: relative; display: inline-grid; flex: 0 1 auto; min-width: 72px; max-width: 320px; font-size: 15px; font-weight: 650;
  }
  .pe-name::after {
    content: attr(data-size); grid-area: 1 / 1; visibility: hidden; height: 0; overflow: hidden; white-space: pre;
    padding: 0 21px 0 10px; border-inline: 1px solid transparent; font: inherit;
  }
  .wa-bar.pe-bar .pe-name > input.pe-name-in {
    grid-area: 1 / 1; width: 100%; min-width: 0; height: 32px; min-height: 32px; margin: 0; padding: 0 20px 0 9px;
    border: 1px solid transparent; border-radius: 7px; background: transparent; box-shadow: none;
    color: var(--wa-ink); font: inherit; text-overflow: ellipsis; cursor: text;
  }
  .wa-bar.pe-bar .pe-name:hover > input.pe-name-in:not(:disabled) { background: var(--wa-hover); border-color: transparent; }
  .wa-bar.pe-bar .pe-name > input.pe-name-in:focus,
  .wa-bar.pe-bar .pe-name > input.pe-name-in:focus-visible { outline: none; padding-right: 9px; background: var(--wa-input, var(--wa-card)); border-color: var(--wa-sel-ring); box-shadow: var(--wa-ring); }
  .wa-bar.pe-bar .pe-name > input.pe-name-in:disabled { opacity: 1; cursor: default; }
  .pe-name-pen {
    position: absolute; top: 50%; right: 6px; width: 13px; height: 13px; margin-top: -6.5px; color: var(--wa-muted);
    opacity: 0; pointer-events: none;
  }
  .pe-name:hover > .pe-name-pen { opacity: 1; }
  .pe-name:has(> input:focus) > .pe-name-pen, .pe-name:has(> input:disabled) > .pe-name-pen { opacity: 0; }
  .pe-bar-meta { flex: none; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  /* The inspector's Page: Name, on the row the mock draws, over the cards. */
  .pe-page-name { margin: 8px 0 10px; padding: 0 10px; --wa-lab: 96px; }
  /* With Hints off, a plain hint is hidden. A warning, an error, a status, or
     a hint marked keep (an empty list, why a setting is greyed) still shows,
     as the complication editor's "?" does. */
  .insp-body[data-help="off"] .hint:not(.warn):not(.err):not(.keep):not([role="status"]):not(.value-pop .hint) { display: none; }
`;export{j as a,M as b,U as c,_ as d,V as e,Z as f,R as g,X as h,G as i,J as j,Q as k,ee as l,ne as m,ae as n,te as o,ie as p,oe as q};
