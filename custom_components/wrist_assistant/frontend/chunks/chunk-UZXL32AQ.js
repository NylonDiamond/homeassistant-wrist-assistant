import{Ld as g,Pg as u,Qd as l,b as h,c as t,d as n,g as s,gg as w}from"./chunk-P6VVA4WF.js";var b=t`
    /* The header sits on the page rather than on a card of its own, with one
       hairline under it to part it from the columns. */
    header, .wa-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      min-height: 54px;
      background: var(--wa-bg);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      flex: none;
      z-index: 20;
    }
    header .spacer, .wa-bar .spacer { flex: 1; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Top bar: Browse, New, Import and Share at the left, then sync, ···,
       Save and its caption, and the help. */
    header, .wa-bar { gap: 10px; min-height: 50px; border-bottom: 1px solid var(--wa-line); }
    .picker > button.tb-browse { min-width: 0; max-width: none; height: 30px; gap: 7px; padding: 0 8px 0 10px; font-size: 12.5px; font-weight: 600; }
    .picker > button.tb-browse svg { width: 14px; height: 14px; }
    .tb-browse .tb-browse-l { color: var(--wa-ink); }
    .tb-name {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 8px; min-width: 0;
      border-radius: 7px; border: 1px solid transparent; cursor: text;
    }
    .tb-name:hover { border-color: var(--wa-line); }
    .tb-name:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .tb-name > input.tb-name-input[type=text],
    .tb-name > input.tb-name-input[type=text]:hover,
    .tb-name > input.tb-name-input[type=text]:focus-visible {
      font: inherit; font-size: 14px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink); min-height: 0; padding: 0;
      border: 0; background: transparent; box-shadow: none; outline: none;
      field-sizing: content; min-width: 7ch; max-width: 280px;
    }
    .tb-name > input.tb-name-input:disabled { opacity: 1; cursor: default; }
    .tb-pen { font-size: 11px; color: var(--wa-muted); opacity: .6; }
    .tb-pill {
      display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; min-width: 0; max-width: 300px;
      font-size: 11.5px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    header button.icon.tb-icon, .wa-bar button.icon.tb-icon { width: 30px; height: 30px; }
    header button.icon.tb-icon svg.ui-icon, .wa-bar button.icon.tb-icon svg.ui-icon { width: 16px; height: 16px; }
    .tb-sync {
      display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px 0 8px; min-width: 0; max-width: 380px;
      border-radius: 999px; font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; border: 1px solid transparent;
    }
    .tb-sync .tb-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: currentColor; }
    .tb-sync-l { overflow: hidden; text-overflow: ellipsis; }
    .tb-sync-n { flex: none; font-weight: 500; color: var(--wa-muted); }
    .tb-sync.ok { color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 12%, transparent); border-color: color-mix(in srgb, var(--wa-green) 35%, transparent); }
    .tb-sync.warn { color: var(--wa-amber); background: var(--wa-amber-bg); border-color: var(--wa-amber-line); }
    .tb-sync.quiet { color: var(--wa-muted); background: var(--wa-panel); }
    .tb-sync.sending .tb-dot { animation: wa-pulse 1.2s ease-in-out infinite; }
    @keyframes wa-pulse { 50% { opacity: .3; } }
    @media (prefers-reduced-motion: reduce) { .tb-sync.sending .tb-dot { animation: none; } }
    button.tb-btn {
      font: inherit; font-size: 12.5px; font-weight: 600; height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer; flex: none;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink); white-space: nowrap;
    }
    button.tb-btn:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.tb-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb-btn.tb-more { padding: 0 9px; letter-spacing: .08em; }
    /* New wears the same fill and plus as the picker's own New, so the two
       read as one button in two places. */
    button.tb-btn.tb-new {
      display: inline-flex; align-items: center; gap: 5px; padding: 0 11px 0 9px;
      border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    button.tb-btn.tb-new:hover:not(:disabled) { border-color: transparent; background: var(--wa-primary-bg); filter: brightness(1.1); }
    button.tb-btn.tb-new svg { width: 13px; height: 13px; }
    /* Import and Share each carry a faint hue of their own, so the row of
       four is told apart at a glance without a second loud button beside
       New. The words are the hue pulled toward the ink, which keeps them
       readable on both skins. */
    button.tb-btn.tb-import { --tb-hue: #4a8cff; }
    button.tb-btn.tb-share { --tb-hue: var(--wa-green); }
    button.tb-btn.tb-import, button.tb-btn.tb-share {
      color: color-mix(in srgb, var(--tb-hue) 70%, var(--wa-ink));
      background: color-mix(in srgb, var(--tb-hue) 10%, var(--wa-card));
      border-color: color-mix(in srgb, var(--tb-hue) 28%, transparent);
    }
    button.tb-btn.tb-import:hover:not(:disabled), button.tb-btn.tb-share:hover:not(:disabled) {
      background: color-mix(in srgb, var(--tb-hue) 18%, var(--wa-card));
      border-color: color-mix(in srgb, var(--tb-hue) 45%, transparent);
    }
    .tb-saved { font-size: 11.5px; color: var(--wa-muted); white-space: nowrap; }
    header.stacked .tb-saved, header.stacked .tb-pen,
    .wa-bar.stacked .tb-saved, .wa-bar.stacked .tb-pen { display: none; }
    /* Stacked (a phone, or a narrow window), the bar is two tidy rows rather
       than three ragged ones: what is done to the draft on top (Browse, undo,
       redo, Save, help), and where it has got to underneath (the sync pill,
       Share, ···). The pill takes what the row leaves and cuts its note
       short, never its label. The empty ::after is the line break: a full
       width item of no height, so the rows carry their own margins instead
       of a row gap that would count it twice. */
    header.stacked, .wa-bar.stacked { row-gap: 0; padding-block: 4px; }
    header.stacked > *, .wa-bar.stacked > * { margin-block: 4px; }
    header.stacked::after, .wa-bar.stacked::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    header.stacked > .tb-sync, header.stacked > button.tb-btn:not(.tb-more), header.stacked > .side-menu,
    .wa-bar.stacked > .tb-sync, .wa-bar.stacked > button.tb-btn:not(.tb-more), .wa-bar.stacked > .side-menu { order: 2; }
    header.stacked > .tb-sync, .wa-bar.stacked > .tb-sync { flex: 1 1 0; max-width: none; }
    header.stacked .tb-sync-l, .wa-bar.stacked .tb-sync-l { flex: none; }
    header.stacked .tb-sync-n, .wa-bar.stacked .tb-sync-n { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    /* Home Assistant's own menu, which a phone hides behind this button. */
    header button.icon.tb-menu, .wa-bar button.icon.tb-menu { margin-left: -6px; }
    /* The buttons that move between the editors (Pages, Menus, Watch, and
       Back to complications): an icon and a word. The hooks that draw them
       carry the same two rules; these are here so an editor's own bar gets
       them without the hook's sheet. */
    button.tb-btn.tb-pages, button.tb-btn.tb-menus, button.tb-btn.tb-watch, button.tb-btn.tb-back {
      display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px;
    }
    button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-menus svg.ui-icon,
    button.tb-btn.tb-watch svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
`,x=t`
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
`,v=t`
    button.help {
      font: inherit; font-size: 14px; font-weight: 600; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: background-color .12s ease-out, border-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,f=t`
    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr) 8px var(--wa-right, 360px);
      /* The 8px drag gutters are the space between the columns. An 8px gap
         on each side of them as well left about 24px between cards, which
         read as three loose panels rather than one editor (Jesse, 2026-09-24). */
      column-gap: 2px;
      row-gap: 8px;
      padding: 4px 12px 10px;
      /* The editor is exactly one viewport tall: the grid takes whatever the
         header and the footer leave, and each column scrolls inside it. A long
         inspector used to stretch the page, which pushed the two lists under
         the canvas below the fold in every other column. */
      flex: 1 1 0;
      min-height: 0;
      overflow: hidden;
    }
    .gutter {
      align-self: stretch; cursor: col-resize; border-radius: 4px;
      background: transparent; position: relative; touch-action: none;
    }
    .gutter::after {
      content: ""; position: absolute; inset: 0 3px; border-radius: 2px;
      background: var(--wa-line); opacity: 0; transition: opacity .12s ease-out;
    }
    .gutter:hover::after, .gutter.dragging::after { background: var(--wa-accent); opacity: 1; }
    .layout.cols-2 {
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.bare { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-gutter: stable; }
    /* A scroll box says when there is more behind its edges: a short fade in
       the box's own ground, drawn by a sticky pseudo-element that cancels its
       own height with a negative margin, so nothing shifts when it appears.
       The attributes are set by the ScrollFades helper on scroll and on
       resize; in the stacked modes the boxes never scroll, so they never
       arrive and the fades never draw. */
    .column.inspector { --wa-fade: var(--wa-card); --wa-fade-gap: 0px; }
    /* The fade gap is the list's own row gap, so the two zero-height fade
       pieces take up no room at either end. At 2px against a 4px gap they
       left a 2px strip over the Background tray. */
    .layers { --wa-fade: var(--wa-card); --wa-fade-gap: 4px; }
    /* A corner in curved text mode: the layers stay editable, but read as off. */
    .layers.skipped { opacity: .45; }
    .column.canvas { --wa-fade: var(--wa-bg); --wa-fade-gap: 8px; }
    .column.inspector::before, .column.inspector::after,
    .layers::before, .layers::after,
    .column.canvas::before, .column.canvas::after {
      content: ""; display: block; flex: none; height: 0; z-index: 4; pointer-events: none;
    }
    .column.inspector::before, .layers::before, .column.canvas::before {
      position: sticky; top: 0; margin-bottom: calc(-1 * var(--wa-fade-gap));
    }
    .column.inspector::after, .layers::after, .column.canvas::after {
      position: sticky; bottom: 0; margin-top: calc(-1 * var(--wa-fade-gap));
    }
    [data-more-above]::before {
      height: 28px; margin-bottom: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to bottom, var(--wa-fade), transparent);
    }
    [data-more-below]::after {
      height: 28px; margin-top: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to top, var(--wa-fade), transparent);
    }
    /* Stacked, the whole layout scrolls as one page again, so a column that
       owns its own scrollbar in three columns must give it up here. */
    .layout.cols-1 .column.left, .layout.cols-1 .column.canvas, .layout.cols-1 .column.inspector,
    .layout.cols-2 .column.inspector { overflow: visible; min-height: auto; }
    .layout.cols-1 .column.left .card.layers-card { flex: none; }
    /* The status line sits at the end of the inspector, not pinned over the
       page: stacked, the column is not a scroll box of its own, so a sticky
       foot floated over the face and the cards on every screen of a phone. */
    .layout.cols-1 .column.inspector > .foot { position: static; }
    .layout.cols-1 .layers { overflow: visible; }
    /* Stacked, the three columns become one page, and the page is read top to
       bottom rather than left to right. In column order that page opened with
       Add a layer, and the face the whole editor is about came 1730px down,
       past Pages, past every layer row: two and a half phone screens of
       scrolling before you could see what you were drawing. Reported by a
       user on Discord, "Layout on mobile", 2026-09-20.
       The order here is the order of the question being asked: what am I
       drawing and where does it land, what does the thing I just picked do,
       and only then the lists that feed it. */
    .layout.cols-1 > .column.canvas { order: 1; }
    .layout.cols-1 > .column.inspector { order: 2; }
    .layout.cols-1 > .column.left { order: 3; }
`,m=t`
    /* One card shape everywhere: white paper, a 12px corner, and a hairline
       drawn as a ring rather than a border, so nothing inside has to account
       for a border box. */
    .card {
      background: var(--wa-card);
      border: 0;
      border-radius: var(--wa-r-md);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 10px 12px 12px;
    }
`,y=t`
    /* Layers: one row per layer, colored by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 4px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* Every row is its own box: a ground and a hairline edge. Rows with no
       outline ran together, and a list of twenty with pictures in them read as
       one field of text where the eye had to find each row's start for itself.
       The selection still speaks louder, because its wash and its ring both
       land on top of these. */
    .layer {
      display: grid; grid-template-columns: 0 var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 46px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background-clip: padding-box;
      background: color-mix(in srgb, var(--wa-panel) 60%, var(--wa-card));
      box-shadow: inset 0 0 0 1px var(--wa-line);
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      /* Hover and selection change at once; only the drop slot animates. */
      transition: border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members wear the same ground as every other row: the group's
       box already says they are nested (Jesse, 2026-09-24). */
    .layer:hover { background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    /* The row under the pointer, which the preview is showing: an accent
       outline only. The fill stays for the real selection below. */
    .layer.peek { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* The face hover's row: one ring for the whole list, sliding from row to
       row and fading out where it stands when the hover ends. */
    .layers { position: relative; }
    .face-ring {
      position: absolute; top: 0; left: 0; z-index: 3; pointer-events: none; opacity: 0;
      box-shadow: inset 0 0 0 1.5px var(--wa-accent), 0 0 0 3px color-mix(in srgb, var(--wa-accent) 18%, transparent);
      transition: transform .16s cubic-bezier(.2, .8, .2, 1), width .16s cubic-bezier(.2, .8, .2, 1), height .16s cubic-bezier(.2, .8, .2, 1), opacity .22s ease-out;
    }
    .face-ring.on { opacity: 1; transition-duration: .16s, .16s, .16s, .1s; }
    .face-ring.jump { transition: none; }
    @media (prefers-reduced-motion: reduce) { .face-ring { transition: opacity .1s linear; } }
    /* The selected row: a strong accent wash and a full-weight accent ring,
       the same wherever a row is selected, so eight kind colors and the group
       boxes' hues never fight the selection. */
    .layer.hl {
      background: color-mix(in srgb, var(--wa-accent) 30%, var(--wa-card));
      box-shadow: inset 0 0 0 2px var(--wa-accent);
    }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.lit { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's color, without
       the selected row's ring, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, ${h(g.group)} 12%, var(--wa-panel)); }
    /* The drag grips are gone: the whole row drags, and one line under the
       Layers header says so. The grip keeps a zero-width column so the rest
       of the row's grid stays as it was. */
    .layer .grip { visibility: hidden; overflow: hidden; width: 0; }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 4px; overflow: hidden; flex: none;
      background: #000; border: 0; box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    /* The whole-complication tap row draws nothing, so it keeps the column the
       other rows line up on and shows no black tile where a picture would be. */
    .layer .thumb.blank { background: none; }
    /* A see-through Background: the checkerboard design apps use for "no
       fill", so the row does not read as a picture that failed to draw. The
       picture on top leaves the face unpainted (clearFace) and draws only a
       border, if there is one. */
    .layer .thumb.clear {
      background: repeating-conic-gradient(var(--wa-dark-check-a, #d8d8de) 0% 25%, var(--wa-dark-check-b, #f2f2f5) 0% 50%) 0 0 / 10px 10px;
    }
    /* The picture inside is an <svg class="thumb">, so the black well above
       lands on it too and would cover the checkerboard. */
    .layer .thumb.clear > svg { background: none; }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 11.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--wa-muted); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge {
      display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 4px;
      font-size: 10.5px; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted);
    }
    .badge.tap { color: var(--wa-dark-badge-tap, #c2185b); background: var(--wa-dark-badge-tap-bg, rgba(236,64,122,.14)); }
    .badge.states { color: var(--wa-dark-badge-states, #bf360c); background: var(--wa-dark-badge-states-bg, rgba(255,112,67,.18)); }
    /* Outlined, so it never reads as one more filled tag beside tap and
       states: it is a job, and a click opens it. */
    .badge.need {
      font-family: inherit; line-height: 1; border: 1px solid var(--wa-need); color: var(--wa-need);
      background: color-mix(in srgb, var(--wa-need) 12%, transparent);
    }
    button.badge.need { cursor: pointer; }
    button.badge.need:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-need) 24%, transparent); }
    button.badge.need:disabled { cursor: default; }
`,k=t`
    /* Beside the name rather than with the other badges, which give way to
       the buttons under the pointer: this one has to stay clickable there. */
    .layer .name b .nm-t { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .layer .name b .badge.need { flex: none; height: 16px; padding: 0 5px; }
    /* A layer's attached tap: the bottom part of the layer's own row, under
       a hairline. The row grows a little so the strip fits; the strip sits
       2px inside the row's edge so the row's ring (1px, 2px when selected)
       still shows around it. With the tap selected (tapsel) the strip wears
       the selection in pink and the top part goes back to rest. */
    .layer.with-tap {
      grid-template-rows: minmax(48px, auto) auto; row-gap: 0; padding-bottom: 0;
    }
    .tap-strip {
      --tp: var(--wa-dark-tap-strip, #c2185b);
      grid-column: 1 / -1; display: flex; align-items: center; gap: 6px; min-width: 0;
      height: 22px; margin: 0 -4px 2px -2px; padding: 0 4px 0 21px;
      border-top: 1px solid var(--wa-line);
      border-radius: 0 0 calc(var(--wa-r-sm) - 2px) calc(var(--wa-r-sm) - 2px);
      font-size: 11.5px; font-weight: 600; color: var(--tp);
      background: color-mix(in srgb, var(--tp) var(--wa-dark-tap-strip-wash, 9%), transparent);
    }
    /* The strip sits 2px inside the row's edges so the row's ring shows round
       it, but a pointer coming up from below met those 2px first and lit the
       layer before its tap. The strip's hit area reaches the edges. */
    .tap-strip { position: relative; }
    .tap-strip::after { content: ""; position: absolute; inset: 0 -2px -2px -2px; }
    /* The dark skin's hover wash is the resting one: its old dark rule
       outranked this one, so a hovered strip never changed there, and the
       token keeps it that way. */
    .tap-strip:hover { background: color-mix(in srgb, var(--tp) var(--wa-dark-tap-strip-hover, 20%), transparent); }
    .tap-strip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.tapsel {
      background: color-mix(in srgb, var(--wa-panel) 60%, var(--wa-card));
      box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .layer.tapsel .tap-strip {
      background: color-mix(in srgb, var(--tp) 26%, transparent);
      box-shadow: inset 0 0 0 2px var(--tp); border-top-color: transparent;
    }
    .layer.dim .tap-strip { opacity: .55; }
    /* The layer selected, not its tap: only the top part wears the selection.
       The row itself goes back to rest and a layer behind the content (the
       isolation keeps it above the row's own ground) draws the wash and ring
       down to the strip's hairline, which sits 24px up from the bottom (the
       strip's 22px and its 2px margin). */
    .layer.with-tap { isolation: isolate; }
    .layer.with-tap.hl:not(.tapsel) {
      background: color-mix(in srgb, var(--wa-panel) 60%, var(--wa-card));
      box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .layer.with-tap.hl:not(.tapsel)::before {
      content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 24px; z-index: -1; pointer-events: none;
      border-radius: var(--wa-r-sm) var(--wa-r-sm) 0 0;
      background: color-mix(in srgb, var(--wa-accent) 30%, var(--wa-card));
      box-shadow: inset 0 0 0 2px var(--wa-accent);
    }
    .tap-strip .tap-glyph { display: grid; place-items: center; flex: none; }
    .tap-strip .tap-glyph svg { width: 13px; height: 13px; }
    .tap-strip .tap-words { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tap-strip .tap-where { margin-left: auto; flex: none; white-space: nowrap; opacity: .85; }
    /* The strip's trash waits for the pointer, like the row's own buttons.
       Hidden rather than taken out, so the strip keeps its width. */
    /* Positioned so it paints above the strip's ::after hit area, which
       otherwise swallowed the trash's click and selected the tap instead. */
    .tap-strip .tap-del { position: relative; z-index: 1; margin-left: auto; width: 22px; height: 20px; flex: none; color: var(--tp); opacity: .7; visibility: hidden; }
    .tap-strip:hover .tap-del, .tap-strip:focus-visible .tap-del, .tap-strip .tap-del:focus-visible { visibility: visible; }
    .tap-strip .tap-where + .tap-del { margin-left: 4px; }
    .tap-strip .tap-del:hover { opacity: 1; }
    .tap-strip .tap-del svg.ui-icon { width: 14px; height: 14px; }
    /* The right end of a row holds one thing at a time: the badges at rest,
       the buttons under the pointer. They trade places rather than stand side
       by side, so the badges keep the right edge and the row keeps its width.
       The selected row used to keep its buttons out too, which put five icons
       over a long name for as long as the row was selected; now only the
       pointer brings them, and keyboard focus (focus-visible, so a click that
       focuses the row does not count).

       The :has(.acts) guard is what keeps the swap honest. A pinned row and a
       read-only document carry badges and no buttons, and without it hovering
       one hid the badge and put nothing in its place. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer:focus-visible .acts, .layer:has(.acts :focus-visible) .acts { display: inline-flex; }
    .layer:hover:has(.acts) .badges,
    .layer:focus-visible:has(.acts) .badges,
    .layer:has(.acts :focus-visible) .badges { display: none; }
    .layer .acts button.icon { width: 24px; height: 24px; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    /* The row being dragged leaves the list. The slot opening under the
       pointer already says where the layer is going, so a ghost of it left
       behind in its old place is one thing too many to read.

       Collapsed, not removed: taking the drag source out of the document
       cancels the drag. The negative margin eats the second of the two 6px
       gaps a zero-height row would otherwise sit between. */
    .layer.dragging, .group-kids.dragging, .group-box.dragging {
      height: 0; min-height: 0; margin-top: -1px; margin-bottom: -1px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    /* The row that is not a layer: Background, the shape under everything and
       what a tap anywhere else does. It cannot be dragged, grouped or
       deleted, so it sits below one hairline, where nothing can be dropped
       past it. The row itself looks like every other row, tap strip and all:
       the darker full-bleed tray it used to sit in read as a different kind
       of thing from the layers (Jesse, 2026-09-24). */
    .pinned-set {
      flex: none; margin: 6px 0 0; padding: 6px 8px 8px; border-top: 1px solid var(--wa-line);
      display: flex; flex-direction: column; gap: 4px;
    }
    /* Inline has no stack above its rows, so they sit at the foot of the card,
       where a canvas shape's own rows end up. */
    .inline-layers .pinned-set { margin-top: auto; }
    .layer.pinned .grip { cursor: default; }
`,T=t`
    /* Left column cards: Pages and Layers. One 40px header line each, each
       tinted with its own color and marked with a small swatch icon, the way
       the inspector's sections are; the one filled button is + Add. */
    .card.lc {
      --c: var(--wa-accent); padding: 0; border-radius: var(--wa-lc-r);
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 30%, var(--wa-card));
    }
    .card.pages-card { --c: var(--wa-lc-pages); }
    .card.layers-card { --c: var(--wa-lc-layers); }
    .card.sv-card { --c: var(--wa-lc-values); }
    .lc-head .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c) 22%, transparent); color: var(--c);
    }
    .lc-head .swatch svg.ui-icon { width: 11px; height: 11px; }
    .lc-head {
      display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; min-height: 40px; padding: 6px 8px 6px 12px;
    }
    .layers-card .lc-head { border-bottom: 1px solid color-mix(in srgb, var(--c) 24%, var(--wa-card)); }
    .lc-head .spacer { flex: 1; }
    .lc-title { font-size: 13px; font-weight: 600; color: var(--wa-ink); }
    .lc-sub { font-size: 11px; font-weight: 400; color: var(--wa-muted); white-space: nowrap; }
    .lc-sub b { color: var(--wa-ink); font-weight: 600; }
    /* The Pages line never wraps: the page buttons, + and ··· keep their row
       and the note beside the title gives way first. */
    .pages-card .lc-head { flex-wrap: nowrap; }
    .pages-card .lc-title { flex: none; }
    .pages-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .pages-card .lc-head .spacer { min-width: 0; }
    button.lc-btn, button.lc-ghost {
      font: inherit; font-size: 11.5px; font-weight: 600; line-height: 1; cursor: pointer; flex: none; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; border-radius: 7px;
      border: 1px solid var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    button.lc-btn svg.ui-icon, button.lc-ghost svg.ui-icon { width: 13px; height: 13px; }
    button.lc-btn.pri { background: var(--wa-accent); border-color: transparent; color: var(--wa-accent-ink); }
    button.lc-btn.pri:hover:not(:disabled) { filter: brightness(1.08); }
    button.lc-ghost { background: transparent; border-color: transparent; color: var(--wa-muted); padding: 0 7px; letter-spacing: .04em; }
    button.lc-ghost.sm { height: 24px; font-size: 11px; }
    /* The Rows and Pictures buttons: a glyph showing the view on, and the
       setting's name in small type under it. The word never changes, so the
       buttons keep their width as the views step round. */
    button.lc-ghost.lc-view { flex-direction: column; justify-content: center; gap: 2px; height: 32px; padding: 0 5px; }
    button.lc-ghost.lc-view svg.ui-icon { width: 14px; height: 14px; }
    button.lc-ghost.lc-view .lc-view-word { font-size: 9px; font-weight: 600; letter-spacing: .02em; line-height: 1; }
    /* A ghost that still reads as a button: Save to parts sits on a line of
       plain text, where a bare label was easy to miss. */
    button.lc-ghost.outline { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    button.lc-btn:hover:not(:disabled):not(.pri), button.lc-ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); border-color: var(--wa-line); }
    button.lc-ghost[aria-pressed="true"], button.lc-ghost[aria-expanded="true"] { color: var(--wa-ink); background: var(--wa-panel); }
    button.lc-btn:focus-visible, button.lc-ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.lc-btn:disabled, button.lc-ghost:disabled { opacity: .45; cursor: default; }
    /* The page picker: one segmented control, the showing page raised. */
    /* The page tiles under the Pages header: one per page, the one showing
       lit in the card's color, each with its own trash can. */
    .pages-card .lc-head { border-bottom: 1px solid color-mix(in srgb, var(--c) 24%, var(--wa-card)); }
    .page-tiles { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 12px 2px; }
    .page-tile {
      display: inline-flex; align-items: stretch; height: 40px; flex: 1 1 96px; min-width: 96px; max-width: 170px;
      border-radius: 9px; overflow: hidden; background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .page-tile.on { background: color-mix(in srgb, var(--c) 16%, var(--wa-card)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 55%, transparent); }
    .page-tile .page-pick {
      flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 1px;
      padding: 0 10px; border: 0; background: transparent; color: var(--wa-muted); font: inherit; cursor: pointer; text-align: left;
    }
    .page-tile .page-pick b { font-size: 12px; font-weight: 650; color: var(--wa-ink); white-space: nowrap; }
    .page-tile .page-pick span { font-size: 10.5px; white-space: nowrap; }
    .page-tile .page-pick:hover { background: color-mix(in srgb, var(--wa-ink) 5%, transparent); }
    .page-tile .page-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    .page-tile .page-trash {
      flex: none; width: 26px; border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-line) 70%, transparent);
      background: transparent; color: var(--wa-muted); opacity: .7; cursor: pointer; display: grid; place-items: center; font: inherit;
    }
    .page-tile .page-trash svg.ui-icon { width: 13px; height: 13px; }
    .page-tile .page-trash:hover, .page-tile .page-trash:focus-visible { opacity: 1; color: #FF453A; background: color-mix(in srgb, #FF453A 14%, transparent); outline: none; }
    .page-tile .page-trash.armed { width: auto; padding: 0 8px; opacity: 1; font-size: 10.5px; font-weight: 700; background: #FF453A; color: #fff; }
    .page-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; padding: 4px 8px 8px; }
    /* The ? beside a card's title: the help for that card. */
    button.lc-help {
      width: 18px; height: 18px; margin-left: -2px; padding: 0; border: 1px solid var(--wa-line); border-radius: 50%; cursor: pointer; flex: none;
      font: inherit; font-size: 10.5px; font-weight: 700; line-height: 1; background: transparent; color: var(--wa-muted);
    }
    button.lc-help:hover { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.lc-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one line under the Pages header while nothing can turn a page. */
    .lc-note { display: flex; align-items: center; gap: 6px; margin: 0 10px 8px; padding: 5px 10px; border-radius: 7px; font-size: 11.5px; }
    .lc-note.warn { color: var(--wa-amber); background: var(--wa-amber-bg); box-shadow: inset 0 0 0 1px var(--wa-amber-line); }
    .lc-note button.link { margin-left: auto; font-weight: 700; color: inherit; text-decoration: underline; }
    .lc-note span { line-height: 1.4; }
    .lc-note b { font-weight: 700; }
    .pages-card .lc-note { margin: 8px 12px 0; }
    .pages-card .page-tour-bar { margin: 0 12px 10px; }
    /* The Layers card's filter line, and the rows under it. */
    .lc-filter { display: flex; align-items: center; gap: 6px; min-height: 32px; padding: 3px 8px 3px 12px; border-bottom: 1px solid var(--wa-line); }
    .lc-filter .lc-sub { white-space: normal; }
    .lc-filter button.lc-ghost { margin-left: auto; }
    .lc-filter button.lc-ghost + button.lc-ghost { margin-left: 0; }
`,z=t`
    .lc-filter .lc-drag { font-size: 11px; color: var(--wa-muted); opacity: .8; white-space: nowrap; }
    .lc-filter .lc-sub + .lc-drag::before { content: "·"; margin-right: 6px; }
    .layers-card > .group-cta { margin: 6px 8px 0; }
    .layers-card > .hint { margin: 6px 10px 0; }
    .layers-card > .lc-empty { margin: 0; padding: 24px 16px; text-align: center; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
    .layers-card > .layers { padding: 6px 8px 0; }
    .layers-sec {
      flex: none; margin: 6px 2px 0; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted);
    }
    .layers-sec:first-child { margin-top: 0; }
`,$=t`
    /* Background: its caption where a layer's badges sit. */
    .layer.pinned .ground-cap { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .layer.pinned.ground .grip { visibility: hidden; }
`,A=t`
    /* Expanded rows say more: a third line about what the layer is made of,
       its meta free to wrap, and the badges kept beside the buttons rather
       than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    /* An expanded row swaps its badges for its buttons, the same as a compact
       one. It used to keep both, with the buttons held in the layout and only
       turned invisible, so that arriving they could not widen the right end
       and wrap the facts onto another line. That reserved width sat to the
       right of the badges and pushed them off the edge every other row lines
       up on, so at rest the badges read as crooked. The right end still never
       wraps. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
`,R=t`
    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    /* The canvas column is three blocks stacked: what the whole complication
       is, the face itself, and the two lists of values under it. */
    /* No reserved scrollbar gutter: the canvas fills its column and almost
       never scrolls, and the 11px it kept free doubled the gap before the
       inspector. A window short enough to scroll it gets the bar then. */
    .column.canvas { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    /* The bar and the two lists keep their own height; the face takes what is
       left, so the lists under it are on screen without scrolling. */
    .column.canvas > .card.canvas-card {
      padding: 0; overflow: hidden; flex: 1 1 auto; min-height: 260px;
      display: flex; flex-direction: column;
    }
`,P=t`
    /* The preview bar's own menus (grid size, Preview as), in place of native
       selects, whose closing menu made Chrome on macOS hold the next click. */
    .pop-menu {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 84px; max-width: calc(100vw - 16px);
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
      display: flex; flex-direction: column; gap: 1px;
    }
    .pop-menu .row {
      font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap;
      background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
    }
    .pop-menu .row:hover { background: var(--wa-panel); }
    .pop-menu .row[aria-selected="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pop-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,S=t`
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128,128,128,.5);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
`,F=t`
    /* A row: a tile for the kind of source, the name over what it reads, the
       value it reads now, and how many layers read it. The same ground and
       hairline as a Layers row. */
    .values-list .datum.svr {
      display: grid; grid-template-columns: 28px minmax(0, 1fr) auto auto; align-items: center; gap: 10px;
      min-height: 44px; padding: 5px 6px 5px 8px; border-radius: var(--wa-r-sm);
      background: color-mix(in srgb, var(--wa-panel) 60%, var(--wa-card)); box-shadow: inset 0 0 0 1px var(--wa-line);
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum.svr:hover { background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    /* Open: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { box-shadow: inset 0 0 0 1px var(--c); background: color-mix(in srgb, var(--c) 10%, var(--wa-card)); }
    /* Read by the selected layer: filled, as the selected layer row is. Read
       by the layer the pointer rests on over the face: an outline only. */
    .values-list .datum.sel { background: color-mix(in srgb, var(--c) 45%, var(--wa-card)); box-shadow: inset 0 0 0 2px var(--c); }
    .values-list .datum.peek:not(.sel):not(.hl) { box-shadow: inset 0 0 0 1.5px var(--c); }
    .svr-ico {
      width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c) 20%, transparent); color: color-mix(in srgb, var(--c) 55%, var(--wa-ink));
    }
    .svr-ico svg { width: 15px; height: 15px; }
    .svr-ico.need { background: color-mix(in srgb, var(--wa-need) 14%, transparent); color: var(--wa-need); }
    .svr-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .svr-text .nm { font-size: 13px; font-weight: 600; color: var(--wa-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .svr-src { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; color: var(--wa-muted); overflow: hidden; white-space: nowrap; }
    .svr-src > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .svr-src .svr-ent { flex: 0 1 auto; color: color-mix(in srgb, var(--wa-ink) 75%, var(--wa-muted)); }
    .svr-src .svr-id { flex: 0 1000 auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; }
    .svr-src .svr-need { flex: none; color: var(--wa-need); font-weight: 600; }
    .svr-now {
      max-width: 120px; padding: 2px 7px; border-radius: 6px; overflow: hidden; text-overflow: ellipsis; white-space: pre;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 600;
      color: var(--wa-val); background: color-mix(in srgb, var(--wa-val) 12%, transparent);
    }
    .svr-now.none { font-family: inherit; font-weight: 500; font-style: italic; color: var(--wa-muted); background: transparent; }
    .svr-uses {
      min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; display: grid; place-items: center;
      font-size: 10.5px; font-weight: 700; color: var(--wa-muted); background: color-mix(in srgb, var(--wa-ink) 7%, transparent);
    }
    .svr-end { display: grid; place-items: center; min-width: 28px; }
    .svr-end > * { grid-area: 1 / 1; }
    .values-list .datum.svr .svr-end button.icon { opacity: 0; pointer-events: none; }
    .values-list .datum.svr:is(:hover, :focus-within) .svr-end:has(button.icon) .svr-uses { opacity: 0; }
    .values-list .datum.svr:is(:hover, :focus-within) .svr-end button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum.svr .svr-end button.icon:hover:not(:disabled), .values-list .datum.svr .svr-end button.icon:focus-visible { opacity: 1; }
    /* The Shared values card: one line under the Layers card, the list
       unfolding under it. The list scrolls inside the card, at 40% of the
       window or the height its top edge was dragged to. */
    .sv-card { position: relative; }
    .sv-card.open .lc-head { border-bottom: 1px solid color-mix(in srgb, var(--c) 24%, var(--wa-card)); }
    .sv-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .sv-card button.lc-help.on { color: var(--wa-ink); border-color: var(--c); background: color-mix(in srgb, var(--c) 20%, transparent); }
    .sv-body {
      max-height: 40vh; overflow-y: auto; padding: 8px 8px 10px; display: flex; flex-direction: column; gap: 6px;
      scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--c) 55%, var(--wa-card)) transparent;
    }
    .sv-none { font-size: 12px; color: var(--wa-muted); padding: 2px 4px; }
    /* The resize edge: the gap above the card. A short bar shows on hover. */
    .sv-grip { position: absolute; left: 0; right: 0; top: -8px; height: 12px; cursor: row-resize; z-index: 5; touch-action: none; }
    .sv-grip::after {
      content: ""; position: absolute; left: 50%; top: 4px; width: 36px; height: 4px; margin-left: -18px; border-radius: 2px;
      background: var(--c); opacity: 0; transition: opacity .12s ease-out;
    }
    .sv-grip:hover::after, .sv-grip.dragging::after { opacity: .8; }
    .layout.cols-1 .sv-body { max-height: none; overflow: visible; }
`,U=t`
      /* The canvas card's tokens (chromeTokens). */
      --wa-dark-float-bg: rgba(21,26,46,.92);
      --wa-dark-float-line: #262c4a;
      --wa-dark-float-shadow: 0 8px 24px rgba(0,0,0,.45);
      --wa-dark-float-sep: #2a3154;
      --wa-dark-hint: #6b7190;
      --wa-dark-chip-bg: #151a2e;
      --wa-dark-chip-line: #232946;
      --wa-dark-live: #3fbf7f;
      --wa-dark-testing: #f2c063;
      /* A see-through Background's checkerboard (.layer .thumb.clear). */
      --wa-dark-check-a: #2a2a2e;
      --wa-dark-check-b: #1a1a1d;
      /* The tap and states badges, in the kinds' own hues. */
      --wa-dark-badge-tap: var(--wa-tap);
      --wa-dark-badge-tap-bg: color-mix(in srgb, var(--wa-tap) 22%, transparent);
      --wa-dark-badge-states: var(--wa-states);
      --wa-dark-badge-states-bg: color-mix(in srgb, var(--wa-states) 22%, transparent);
      /* The attached tap strip: its hue, its wash, and the same wash under
         the pointer. */
      --wa-dark-tap-strip: var(--wa-tap);
      --wa-dark-tap-strip-wash: 13%;
      --wa-dark-tap-strip-hover: 13%;
`,J=t`
    /* Canvas column: quiet header, floating toolbar, zoomable stage, values bar, first run. */
    /* The left cards' hues, the same in both skins. */
    :host, .wa-chrome {
      --wa-lc-pages: #26a69a;
      --wa-lc-layers: #4a7fe8;
      --wa-lc-values: #b03e62;
    }
    .wa-chrome, .canvas-card {
      --wa-float-bg: var(--wa-dark-float-bg, color-mix(in srgb, var(--wa-raised) 94%, transparent));
      --wa-float-line: var(--wa-dark-float-line, var(--wa-line-strong));
      --wa-float-shadow: var(--wa-dark-float-shadow, 0 6px 18px rgba(0,0,0,.14));
      --wa-float-sep: var(--wa-dark-float-sep, var(--wa-line-strong));
      --wa-hint: var(--wa-dark-hint, var(--wa-muted));
      --wa-chip-bg: var(--wa-dark-chip-bg, var(--wa-panel));
      --wa-chip-line: var(--wa-dark-chip-line, var(--wa-line));
      --wa-live: var(--wa-dark-live, #2f9e6a);
      --wa-testing: var(--wa-dark-testing, #b7791f);
      /* On the black face, in either skin. */
      --wa-face-muted: #8b91ad;
    }
`,C=t`
    .column.canvas > .card.canvas-card { min-height: 440px; container: cvcard / inline-size; }
    /* The head wraps rather than squeezes. It used to be one fixed 48px line
       with every part allowed to shrink, so in a middling width the device
       chips were clipped and the shape's name cut to nothing, with no sign
       anything was missing. Now each part (the name, the devices, the shape,
       the actions) keeps its natural width, and a part that does not fit
       moves down to a second line whole, slash and all. The actions keep to
       the right edge of whichever line they land on. */
    .cv-head {
      display: flex; flex-wrap: wrap; align-items: center; column-gap: 12px; row-gap: 6px;
      min-height: 48px; padding: 9px 16px; box-sizing: border-box; flex: none; min-width: 0;
      border-bottom: 1px solid var(--wa-line);
    }
    .cv-part { display: inline-flex; align-items: center; gap: 12px; flex: 0 1 auto; min-width: 0; }
    .cv-acts { display: inline-flex; align-items: center; gap: 12px; flex: none; margin-left: auto; }
    .cv-head .tb-name { flex: 0 1 auto; margin-left: -8px; }
    .cv-slash { flex: none; color: var(--wa-line-strong); }
    /* The whole-complication actions: quiet outlined buttons that read as one
       set with the device chips beside them. Delete goes red, and while it is
       armed the choices stand in its place. */
    button.cv-act {
      display: inline-flex; align-items: center; gap: 4px; flex: none; height: 28px; padding: 0 10px; border-radius: 7px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 600; white-space: nowrap;
      border: 1px solid var(--wa-line); background: transparent; color: var(--wa-ink);
    }
    button.cv-act:hover:not(:disabled), button.cv-act[aria-expanded="true"] { background: color-mix(in srgb, var(--wa-ink) 8%, transparent); border-color: var(--wa-line-strong); }
    button.cv-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.cv-act:disabled { opacity: .45; cursor: default; }
    button.cv-act.danger { color: #FF453A; }
    button.cv-act.danger:hover:not(:disabled) { background: color-mix(in srgb, #FF453A 14%, transparent); border-color: color-mix(in srgb, #FF453A 40%, transparent); }
    button.cv-act .caret { display: inline-flex; margin-right: -3px; color: var(--wa-hint); }
    button.cv-act .caret svg { width: 11px; height: 11px; }
`,B=t`
    button.cv-act.icon { width: 30px; padding: 0; justify-content: center; }
    button.cv-act.icon svg.ui-icon { width: 15px; height: 15px; }
    /* Undo and redo light up amber while there is a step to take. */
    button.cv-act.undo:not(:disabled) { color: var(--wa-amber); border-color: var(--wa-amber-line); }
    button.cv-act.undo:hover:not(:disabled) { background: var(--wa-amber-bg); border-color: var(--wa-amber-line); }
    button.cv-act.undo:disabled { opacity: .35; }
    .cv-del { display: inline-flex; align-items: center; gap: 6px; flex: none; }
    /* Hairlines part the head's groups: the devices, the actions, Delete,
       and the ··· menu. */
    .cv-div { width: 1px; height: 20px; flex: none; background: var(--wa-line); }
    .cv-devices { display: inline-flex; align-items: center; gap: 6px; flex: 0 8 auto; min-width: 0; }
    .case-tool.add-tool .pop-menu { left: 0; right: auto; min-width: 230px; }
    .case-tool.add-tool .place-note { padding: 6px 10px 4px; font-size: 11px; color: var(--wa-muted); }
    .cv-shape {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 4 auto; min-width: 0;
      font-size: 12px; color: var(--wa-muted); white-space: nowrap;
    }
    .cv-shape .fam { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cv-shape small { font-size: 11px; }
    .cv-shape .warn { display: inline-flex; color: var(--wa-val); }
    .cv-shape .warn svg { width: 14px; height: 14px; }
    .cv-head .shape-seg { padding: 2px; gap: 2px; border-radius: 9px; flex-wrap: nowrap; }
    .cv-head .shape-seg button.tab { height: 26px; padding: 0 10px; font-size: 12px; }
    /* Several devices wrap onto more lines rather than hide past the edge. */
    .cv-head .doc-on { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; row-gap: 6px; flex: 0 1 auto; min-width: 0; }
    .cv-head .cv-devices { flex-wrap: wrap; row-gap: 6px; }
    .cv-head .doc-chip {
      height: 26px; gap: 7px; padding: 0 10px 0 8px; border-radius: 13px; min-width: 0; flex: 0 1 auto;
      background: var(--wa-chip-bg); border: 1px solid var(--wa-chip-line);
      font-size: 11.5px; font-weight: 500; color: var(--wa-ink);
    }
    .cv-head .doc-chip > svg { width: 13px; height: 13px; flex: none; }
    .cv-head .doc-chip-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    /* The x that takes the design off a device is always there, quiet, and
       goes red only under the pointer or while it is armed. */
    .cv-head .doc-chip button.doc-trash {
      width: 18px; height: 18px; margin: 0 -4px 0 0; align-self: center; border: 0; border-radius: 9px;
      background: transparent; color: var(--wa-muted); opacity: .7; overflow: hidden; cursor: pointer;
      transition: opacity .12s ease-out;
    }
    .cv-head .doc-chip button.doc-trash:hover:not(:disabled), .cv-head .doc-chip button.doc-trash:focus-visible { opacity: 1; color: #FF453A; background: color-mix(in srgb, #FF453A 16%, transparent); }
    .cv-head .doc-chip button.doc-trash:disabled { opacity: .3; cursor: default; }
    .cv-head .doc-chip button.doc-trash.armed { width: auto; padding: 0 7px; background: #FF453A; color: #fff; }
    /* A narrow canvas (a phone, or a column dragged in) cannot hold the head
       on one line: "Add to a device" was drawn over the shape's name and the
       Duplicate button. It folds to two rows instead: the name and its shape
       with the whole-document actions, then the devices. The ::after is the
       line break, a full width item of no height. */
    @container cvcard (max-width: 560px) {
      .cv-head { padding: 6px 12px 8px; column-gap: 8px; }
      .cv-head::after { content: ""; order: 3; flex: 0 0 100%; height: 0; }
      .cv-head .cv-slash { display: none; }
      .cv-head .tb-name { order: 0; flex: 1 1 0; }
      .cv-head .cv-what { order: 1; }
      .cv-head .cv-acts { order: 2; gap: 8px; }
      .cv-head .cv-where { order: 4; flex: 0 1 auto; }
    }
`,H=t`
    /* The stage: the dotted surface, the zoomable face on it, and the values
       bar at its foot. The face's Fit size comes from the stage-wrap's own
       box, through container units, so no script measures anything. */
    .stage-area {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .stage-wrap { position: relative; flex: 1 1 auto; min-height: 300px; container-type: size; }
    .stage-wrap.first-run { min-height: 540px; }
    .stage-wrap > .stage {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: stretch; gap: 12px;
      padding: 64px 24px 16px; overflow: auto; background: none; container-type: normal;
    }
    .stage-wrap > .stage.control-stage { align-items: center; justify-content: center; padding-top: 24px; }
    .stage-wrap .row-strip { align-self: center; flex: none; }
    /* Auto margins centre the face both ways and never push it past the
       stage's top or left edge, so a face zoomed past the stage scrolls from
       its own corner. */
    .stage-face { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .stage-face > .preview { width: auto; }
    .stage-wrap .stage-face > .preview > svg {
      width: calc(max(120px, min(100cqw - 48px, (100cqh - var(--wa-reserve, 124px)) * var(--wa-ratio, 1))) * var(--wa-zoom, 1));
      max-width: none;
    }
    /* What is selected, named just over the face's top left corner, the way a
       drawing app names a frame. Left, not centred, so it stays clear of the
       floating toolbar when the face reaches the top of the stage. */
    .face-label {
      position: absolute; left: 0; bottom: calc(100% + 5px); max-width: 100%; z-index: 2;
      display: flex; align-items: center; gap: 5px; font-size: 11px; line-height: 14px;
      color: var(--wa-hint); white-space: nowrap; overflow: hidden; pointer-events: none;
    }
    .face-label .fl-kind { flex: none; color: var(--k, var(--wa-hint)); font-size: 9.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    .face-label .fl-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--wa-ink); font-weight: 500; }
    .face-label .fl-group { min-width: 0; flex: 0 1 auto; display: inline-flex; align-items: center; gap: 3px; overflow: hidden; text-overflow: ellipsis; }
    .face-label .fl-sep { flex: none; opacity: .6; }
    .face-label .fl-lock { display: inline-flex; flex: none; font-size: 10px; }
    .face-label .fl-lock svg { width: 10px; height: 10px; }
    /* Three lines tall whatever it says, the most any hint wraps to, and read
       from the top. The face is centred together with the hint, so a hint that
       grew from one line to two when a layer was selected pushed the face up. */
    .stage-face > .under {
      max-width: 460px; font-size: 11px; font-weight: 400; color: var(--wa-hint);
      line-height: 15px; min-height: 45px; align-items: flex-start; align-content: flex-start;
    }
    .stage-page { position: absolute; top: 25px; left: 16px; z-index: 3; font-size: 11px; color: var(--wa-hint); pointer-events: none; }
    .stage-tools {
      position: absolute; top: 14px; left: 50%; transform: translateX(-50%); z-index: 5;
      display: flex; align-items: center; gap: 2px; height: 36px; padding: 0 6px; max-width: calc(100% - 24px);
      border-radius: 10px; background: var(--wa-float-bg); border: 1px solid var(--wa-float-line); box-shadow: var(--wa-float-shadow);
    }
    button.tb {
      display: inline-flex; align-items: center; gap: 7px; flex: none; height: 26px; padding: 0 8px; border-radius: 7px;
      border: 1px solid transparent; background: transparent; color: var(--wa-ink); cursor: pointer;
      font: inherit; font-size: 11.5px; font-weight: 500; white-space: nowrap;
    }
    button.tb:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-ink) 8%, transparent); }
    button.tb:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb:disabled { opacity: .4; cursor: default; }
    button.tb.on { background: color-mix(in srgb, var(--wa-accent) 26%, transparent); border-color: color-mix(in srgb, var(--wa-accent) 60%, transparent); }
    button.tb.lit { color: color-mix(in srgb, var(--wa-accent) 55%, var(--wa-ink)); }
`,L=t`
    button.tb .tb-glyph { width: 13px; height: 13px; flex: none; }
    button.tb > svg.ui-icon { width: 14px; height: 14px; flex: none; }
    button.tb .caret { display: inline-flex; margin-left: -3px; color: var(--wa-hint); }
    button.tb .caret svg { width: 11px; height: 11px; }
    /* The Preview menu joins the case and the color on one button: the case
       size, then the color as a dot. The menu under it has the two lists
       under small headings. */
    button.tb .tint-dot { margin: 0 1px; }
    .pop-menu.preview-menu { min-width: 190px; }
    /* The canvas card clips, so a menu off the toolbar must fit the stage it
       hangs in (the stage wrap is a size container). On a phone the stage is
       half the screen and Preview as ran past it with its last tints cut
       off; it scrolls instead. */
    .stage-tools .pop-menu { max-height: calc(100cqh - 64px); overflow-y: auto; overscroll-behavior: contain; }
`,I=t`
    .pop-menu .pop-title { padding: 7px 10px 6px; margin-bottom: 3px; font-size: 12.5px; font-weight: 700; color: var(--wa-ink); border-bottom: 1px solid var(--wa-line); }
    .pop-menu .pop-head { padding: 6px 10px 3px; font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
    .preview-menu .row[aria-checked="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    button.tb .tint-dot { margin-right: 0; }
    .tb-dot { width: 5px; height: 5px; margin-left: -4px; border-radius: 50%; background: currentColor; flex: none; }
    button.tb.icon { padding: 0 7px; font-size: 14px; }
    button.tb.pct { min-width: 42px; padding: 0 4px; justify-content: center; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
    .tb-sep { width: 1px; height: 18px; margin: 0 6px; background: var(--wa-float-sep); flex: none; }
    .tb-zoom { display: inline-flex; align-items: center; }
    .stage-tools .case-tool .pop-menu { left: 0; }
    @container (max-width: 680px) {
      .stage-tools .word:not(.keep) { display: none; }
      .stage-tools button.tb { gap: 4px; padding: 0 6px; }
      .stage-tools .tb-sep { margin: 0 3px; }
    }
    /* A phone-width stage: the toolbar takes two rows rather than losing the
       zoom off its end, and the face starts under both. */
    @container (max-width: 460px) {
      .stage-tools { flex-wrap: wrap; justify-content: center; height: auto; padding: 4px; row-gap: 2px; width: max-content; }
      .stage-tools .tb-sep { display: none; }
      .stage-wrap > .stage { padding-top: 92px; }
      .stage-page { top: auto; bottom: 8px; }
    }
    .snap-menu { min-width: 220px; }
    .pop-menu .row.snap-row { display: flex; align-items: center; gap: 10px; }
    .snap-row .tog {
      position: relative; display: inline-block; flex: none; width: 26px; height: 14px; border-radius: 7px; background: var(--wa-line-strong);
    }
    .snap-row .tog.on { background: var(--wa-accent); }
    .snap-row .tog i { position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 5px; background: #fff; transition: left .12s ease-out; }
    .snap-row .tog.on i { left: 14px; }
    .snap-steps { display: flex; gap: 2px; margin: 0 6px 4px 46px; padding: 2px; border-radius: 7px; background: var(--wa-panel); }
    .snap-steps button {
      flex: 1; padding: 3px 6px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted); cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums;
    }
    .snap-steps button.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .snap-steps button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,W=t`
    /* The values bar, the same floating family as the toolbar. */
    .values-foot {
      display: flex; flex: none; min-width: 0; padding: 0 16px 14px; container: vfoot / inline-size;
    }
    /* A head row (Live at one end, Back to live at the other) over one value
       per row: the name on the left, its control on the right. */
    .values-bar {
      display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; padding: 6px 8px 8px;
      border-radius: 12px; background: var(--wa-float-bg); border: 1px solid var(--wa-float-line); box-shadow: var(--wa-float-shadow);
    }
    .vb-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 24px; padding-left: 6px; }
    .vb-state {
      display: inline-flex; align-items: center; gap: 6px; flex: none;
      font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted);
    }
    .vb-dot { width: 6px; height: 6px; border-radius: 3px; background: var(--wa-live); box-shadow: 0 0 6px var(--wa-live); }
    .values-bar.testing .vb-state { color: var(--wa-testing); }
    .values-bar.testing .vb-dot { background: var(--wa-testing); box-shadow: 0 0 6px var(--wa-testing); }
    .vb-empty { min-width: 0; padding: 0 6px; font-size: 11.5px; color: var(--wa-muted); }
    /* Past seven rows (30 px each, 4 px gaps), or 40% of the window, the rest
       scrolls down. */
    .vb-pills {
      display: flex; flex-direction: column; align-items: stretch; gap: 4px; min-width: 0;
      max-height: min(40vh, 236px); overflow-y: auto; scrollbar-width: thin;
    }
    .vchip.vpill {
      display: flex; align-items: center; gap: 8px; flex: none; width: auto; height: 30px; padding: 0 10px; border-radius: 8px;
      background: var(--wa-chip-bg); border: 1px solid var(--wa-chip-line); font-size: 11.5px; color: var(--wa-ink); cursor: default;
    }
    .vpill .vp-icon { display: inline-flex; flex: none; color: var(--k); }
    .vpill .vp-icon svg { width: 13px; height: 13px; }
    .vpill b { flex: 1; font-weight: 500; }
    /* Every control sits in one column of the same width, so the sliders,
       pickers and readings line up down the rows. */
    .vchip.vpill .test-ctl { flex: none; width: 260px; justify-content: flex-end; gap: 10px; }
    .vchip.vpill .test-ctl input[type=range] { flex: 1 1 auto; min-width: 64px; height: 14px; }
    .vpill .test-ctl .val, .vpill .test-ctl input[type=text] { order: -1; }
    .vchip.vpill button.val {
      flex: none; min-width: 64px; text-align: right; color: var(--wa-ink); font-family: inherit; font-size: 11.5px; font-weight: 700; font-variant-numeric: tabular-nums;
    }
    .vchip.vpill.testing { box-shadow: none; border-color: var(--wa-testing); }
    .vchip.vpill.testing button.val { color: var(--wa-testing); }
    /* A picker drawn like the pill it sits in, not the black input well: a
       faint tint and hairline, brighter on hover. */
    .vchip.vpill .test-ctl select {
      width: 100%; height: 22px; min-height: 22px; padding: 0 24px 0 8px; font-size: 11.5px; font-weight: 600;
      border-color: color-mix(in srgb, var(--wa-ink) 12%, transparent); background-color: color-mix(in srgb, var(--wa-ink) 6%, transparent);
      background-position: right 6px center; background-size: 12px;
    }
    .vchip.vpill .test-ctl select:hover { background-color: color-mix(in srgb, var(--wa-ink) 11%, transparent); }
    .vchip.vpill .test-ctl select option { background: var(--wa-panel); color: var(--wa-ink); }
    .vchip.vpill.testing .test-ctl select { color: var(--wa-testing); border-color: color-mix(in srgb, var(--wa-testing) 45%, transparent); }
    .vchip.vpill input[type=text] { width: 80px; min-height: 22px; font-size: 11.5px; }
    .vchip.vpill .vtag { flex: none; background: transparent; border: 1px solid var(--wa-float-sep); font-size: 9.5px; line-height: 14px; padding: 0 4px; }
    .vpill button.live-reset { display: inline-flex; flex: none; padding: 0; border: 0; background: transparent; color: var(--wa-muted); cursor: pointer; }
    .vpill button.live-reset:hover { color: var(--wa-ink); }
    .vpill button.live-reset svg { width: 13px; height: 13px; }
    .vpill .live-reset-slot { flex: none; width: 13px; }
    button.vb-live {
      flex: none; height: 24px; padding: 0 8px; border: 1px solid transparent; border-radius: 7px; cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 600; white-space: nowrap; background: transparent; color: var(--wa-muted);
    }
    button.vb-live:hover:not(:disabled) { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-ink) 8%, transparent); }
    button.vb-live:disabled { opacity: .45; cursor: default; }
    button.vb-live:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* A phone-width stage has no room for a name beside a control: Live, the
       values and Back to live share one row that scrolls sideways. */
    @container vfoot (max-width: 520px) {
      .values-bar { flex-direction: row; align-items: center; gap: 10px; padding: 4px 8px 4px 14px; }
      .vb-head { display: contents; }
      .vb-state { order: 0; }
      .vb-pills, .vb-empty { order: 1; }
      button.vb-live { order: 2; }
      .vb-pills { flex: 1; flex-direction: row; max-height: none; padding: 2px 0; overflow-x: auto; overflow-y: hidden; }
      .vchip.vpill { height: 28px; }
      .vpill b { flex: none; max-width: 160px; }
      .vchip.vpill .test-ctl { width: auto; gap: 8px; }
      .vchip.vpill .test-ctl input[type=range] { flex: none; width: 64px; }
      .vchip.vpill button.val { min-width: 0; }
      .vchip.vpill .test-ctl select { width: auto; }
      .vpill .live-reset-slot { display: none; }
    }
`,j=t`
    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    /* The column is a flex column so the footer row can sit at its foot on a
       short inspector and stick there on a long one. No top or bottom
       padding: the head and the footer are edge to edge bars, and a sticky
       bar in a padded scroll box leaves a strip for the rows to show through. */
    .column.inspector { padding: 0 12px; container: insp / inline-size; display: flex; flex-direction: column; }
    .column.inspector > .insp-body { flex: 1 0 auto; }
    /* The head: one 40px bar with the breadcrumb and one ghost button. */
    .insp-head {
      display: flex; align-items: center; gap: 8px; min-height: 40px; margin: 0 -12px 4px; padding: 0 8px 0 12px;
      position: sticky; top: 0; background: var(--wa-card); z-index: 5; border-bottom: 1px solid var(--wa-line);
    }
    /* The breadcrumb stays one line: the complication's name gives way first,
       then the layer's name, and the kind chip never does. */
    .crumbs { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--wa-muted); white-space: nowrap; }
    .crumbs button { font: inherit; font-size: 12px; font-weight: 400; background: transparent; border: 0; padding: 3px 4px; margin: 0 -2px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .6; flex: none; }
    .crumbs .nm { min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: var(--wa-ink); }
    .crumbs .kchip {
      flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 999px;
      font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
      background: color-mix(in srgb, var(--k) 26%, transparent); color: color-mix(in srgb, var(--k) 45%, var(--wa-ink));
    }
    .insp-head .expand {
      flex: none; margin-left: auto; font: inherit; font-size: 11.5px; font-weight: 500; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 8px; min-height: 24px; border-radius: 7px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 24px; }
`,O=t`
    /* One tinted box per subject, in the section's color, so each card reads
       as its own thing: a 36px header with a small mark, then a body of
       label-left rows. The header's hover runs to the box's edges while the
       rows keep the box's padding. */
    .sec {
      --c: var(--wa-accent);
      margin: 6px 0 0; padding: 0 12px; border-radius: 9px; overflow: hidden;
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 24%, var(--wa-card));
    }
    .sec[data-open="true"] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 40%, var(--wa-card)); }
    /* A card lit for a moment: where the panel has just sent the eye. */
    .sec.lit { animation: wa-sec-lit 1.6s ease-out 2; }
    @keyframes wa-sec-lit {
      0%, 100% { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 40%, var(--wa-card)); }
      30% { box-shadow: inset 0 0 0 2px var(--c), 0 0 0 3px color-mix(in srgb, var(--c) 30%, transparent); }
    }
    @media (prefers-reduced-motion: reduce) { .sec.lit { animation: none; box-shadow: inset 0 0 0 2px var(--c); } }
    .sec-h {
      display: flex; align-items: center; gap: 8px; height: 36px; margin: 0 -12px; padding: 0 6px 0 12px;
      cursor: pointer; user-select: none; transition: background-color .12s ease-out;
    }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h.pinned { cursor: default; }
    .sec-h.pinned:hover { background: transparent; }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    :is(.sec-h, .xfer-callout) .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c) 22%, transparent); color: var(--c);
    }
    :is(.sec-h, .xfer-callout) .swatch svg { width: 11px; height: 11px; stroke-width: 2.2; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    .sec-h h4 { margin: 0; flex: none; font-size: 12.5px; font-weight: 650; letter-spacing: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .sec-h .sum { margin-left: auto; min-width: 0; color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* An open card shows its rows, so the summary would only repeat them. A
       pinned card is always open and keeps its summary as a subtitle. */
    .sec[data-open="true"] .sec-h:not(.pinned) .sum { display: none; }
    .sec-h .chev { color: var(--wa-muted); opacity: .6; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 14px; height: 14px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 0 0 10px; }
    .sec-b > .hint { margin: 2px 0 6px; }
    /* Rows that belong together (a bar's border settings, its scale) sit in a
       hairline box. The box reaches 8px out into the card's padding, so its rows
       keep the same title and control edges as the rows outside it, and a
       changed-setting dot moves in so it stays inside the line. */
    .fgroup {
      margin: 6px -8px; padding: 3px 8px; border-radius: 8px;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 3%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c, var(--wa-accent)) 20%, transparent);
    }
    .fgroup > .hint { margin: 2px 0 6px; }
    .fgroup > .hint:last-child { margin-bottom: 4px; }
    .fgroup button.reset-dot { left: -6px; }
    .sec-b > :is(.adders, .chart-numbers, details.sub),
    .src-editor > details.sub { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width, and
       the Advanced editor's rule and case boxes keep their own left edge. */
    :is(.sec-b, .sec-b :is(.fgroup, .grid2, .grid4, .value-editor, .src-editor, .states, .rich-parts, .part-editor))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .span-parts, button.small, button.link, details.sub):not(.value-pop *) {
      margin-left: var(--wa-col);
    }
    /* A row whose control is a list or a strip of buttons that can wrap: the
       title stays level with the first line. */
    .field.list-field { align-items: start; }
    .field.list-field > span:first-child { padding-top: 6px; }
    .field.list-field > :not(:first-child) { grid-column: 2; }
    .field.list-field > :is(.adders, .chart-numbers, .states-foot) { margin: 0; }
    .row-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    /* A line to read rather than change, with a title like any other row:
       what a chart reads, how big a tap is, which layers a group holds. */
    .field.readout { align-items: start; }
    .field.readout > span:first-child { padding-top: 6px; }
    .readout-v { min-width: 0; padding: 6px 0 5px; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
    .field.list-field > .readout-v { padding-bottom: 2px; }
`,E=t`
    .sec-h h4 button.reset-dot { position: relative; left: auto; top: auto; }
    /* The changed mark sectionCard() draws in a title: the reset dot's look,
       for a card that has no reset to offer. */
    .sec-h h4 .sec-dot { display: block; width: 6px; height: 6px; border-radius: 50%; background: var(--wa-accent); flex: none; }
    /* A layer's name: one header row with the input in place of the summary.
       The title never wraps and the input takes what width is left, down to
       nothing, so the row stays one line in the narrowest column. */
    .name-sec .sec-h { gap: 8px; }
    .name-sec .sec-h input[type=text] {
      flex: 1 1 auto; width: 0; min-width: 0; height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px;
      border-radius: 6px; border-color: transparent; background-color: var(--wa-field);
    }
    .name-sec .sec-h input[type=text]:focus-visible { border-color: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 28%, transparent); }
    /* Each card's "?": quiet until the header is hovered, lit while its help
       is showing. A touch screen has no hover, so there it always shows. */
    button.sec-help {
      flex: none; width: 20px; height: 20px; padding: 0; border-radius: 50%; cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 700; line-height: 1; display: grid; place-items: center;
      border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted);
      opacity: 0; transition: opacity .12s ease-out, color .12s ease-out, border-color .12s ease-out;
    }
    .sec-h:hover button.sec-help, button.sec-help:focus-visible, button.sec-help.on { opacity: 1; }
    button.sec-help:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.sec-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.sec-help.on { color: var(--wa-accent-ink); background: var(--wa-accent); border-color: transparent; }
    @media (hover: none) { button.sec-help { opacity: 1; } }
    /* Help text waits behind that "?". A plain hint shows only while its
       card's help is on; a warning, an error, or a hint marked keep (a status,
       an empty state, a step that is required) always shows. A value popover
       keeps its hints, since it has no "?" of its own to ask with. */
    .sec[data-help="off"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { display: none; }
    /* Shown help is quiet text, not a box: italic and muted, so a card with a
       sentence under every row still reads as one form (Jesse, 2026-09-16). */
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 0 2px; font-style: italic; color: var(--wa-muted);
    }
    /* An open card with no help text in it has nothing for its "?" to show. */
    .sec[data-open="true"][data-help="off"]:not(:has(> .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint))) button.sec-help { display: none; }
    /* Inspector: header Add, a card's less used rows, paired rows, how-to card, footer. */
    .sec-h button.sec-act { flex: none; min-height: 22px; padding: 0 8px 0 6px; font-size: 11px; gap: 3px; }
    .sec-h button.sec-act svg.ui-icon { width: 11px; height: 11px; }
    .more-fold { margin: 6px -12px 0; padding: 0 12px; border-top: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 18%, transparent); }
    .more-body { padding-top: 6px; }
    .more-body > .hint { margin: 2px 0 6px var(--wa-col); }
`,G={topBar:b,picker:x,helpButton:v,columns:f,card:m,rows:y,rowsTail:k,leftCards:T,leftCardsTail:z,groundCap:$,richRows:A,canvasColumn:R,popMenu:P,tintDot:S,sharedValueRows:F,canvasHead:C,canvasHeadTail:B,stage:H,stageTools:L,stageToolsTail:I,valuesFoot:W,inspectorHead:j,sectionCard:O,sectionCardTail:E},K=t`${b}${x}${v}`,X=t`${f}${m}`,Q=t`${T}${z}${P}`,Y=t`${y}${k}${$}${A}${F}`,Z=t`${R}${S}${C}${B}${H}${L}${I}${W}`,ee=t`${j}${O}${E}`;function te(e,a){let{open:o,onToggle:r}=e;return n`<section class="sec" data-sec=${e.id??s} data-open=${o?"true":"false"} data-help="on" style=${`--c:${e.color}`}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${r}
      @keydown=${i=>{i.target===i.currentTarget&&(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r())}}>
      <span class="swatch">${e.icon}</span>
      <span class="tt"><h4>${e.title}${e.dot?n`<span class="sec-dot" aria-hidden="true"></span>`:s}</h4>${e.summary?n`<span class="sum">${e.summary}</span>`:s}</span>
      <span class="chev">${l("chevron")}</span>
    </div>
    ${o?n`<div class="sec-b">${e.help?n`<p class="hint">${e.help}</p>`:s}${a}</div>`:s}
  </section>`}var d="/pages";function se(e){let a=e?.path??"";return a===d||a.startsWith(`${d}/`)}function le(e){let a=e?.path??"",o=`${d}/`;if(!a.startsWith(o))return;let r=a.slice(o.length).split("/")[0]??"";if(r!=="")try{let i=decodeURIComponent(r);return i===""?void 0:i}catch{return}}function D(e,a,o=""){let r=e?.prefix??o.replace(/\/pages(\/.*)?$/,"");return a?`${r}${d}`:r}function de(e,a){let o=D(e,a,window.location.pathname);o===""||o===window.location.pathname||(history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var pe="https://docs.wrist-assistant.com/watch-app/pages-in-home-assistant/";function ce(e){let o=`${D(e,!1,window.location.pathname)}${u}`;o!==window.location.pathname&&(history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var c;function he(e){c=e}function ge(){return c?.dirty()??!1}function we(){c?.drop()}var M,p=!1;function q(){return M??=import("./page-editor-NOAC2G35.js").then(()=>{},e=>{throw p=!0,e}),M}function ue(e,a,o){return!e.user?.is_admin||w(a).length===0?s:n`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
    @click=${o}>${l("pages")}<span>Pages</span></button>`}function be(e){let a=customElements.get("wa-page-editor")!==void 0;return!a&&!p&&q().then(e.onLoaded,e.onLoaded),n`${e.dialogs}
    ${a?n`<wa-page-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack} .onMenus=${e.onMenus}
          .barActions=${e.actions}></wa-page-editor>`:n`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${l("left")}<span>Complications</span></button>
          ${p?n`<span>The page editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var xe=t`
  button.tb-btn.tb-pages, button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;export{U as a,J as b,G as c,K as d,X as e,Q as f,Y as g,Z as h,ee as i,te as j,se as k,le as l,de as m,pe as n,ce as o,he as p,ge as q,we as r,ue as s,be as t,xe as u};
