import{a as R}from"./chunk-WZXJOBHW.js";import{Fe as S,mh as w}from"./chunk-WT56CXTV.js";import{L as y,l as b}from"./chunk-HPMCDO65.js";import{a as M,b as x,f as s,i as d}from"./chunk-6ZDBXU6B.js";var z=()=>b("Digital Crown","crown"),k={pages:{seconds:8,hue:"var(--wa-hue-blue)",still:70,groups:[{title:"On your watch",steps:["**Swipe** left or right to move between pages.","**Tap** a tile to use it. The porch light turns on."]}],windows:[[0,46],[48,97]],get use(){return R("pages").use},tip:"Touch and hold a tile for its quick menu. The Menus tab sets what is in it."},menus:{seconds:16,hue:"var(--wa-hue-purple)",still:83,get groups(){return[{title:"A tile's menu",steps:["**Touch and hold** a tile. A + shows in the middle.","**Slide** to the middle, then to a slot, and **lift** your finger."]},{title:"The Anywhere menu",steps:[`**Hold** any tile, slide to the **middle**, then **turn the ${z()}**.`,"**Slide** to a slot, then **lift** your finger."]}]},windows:[[0,12],[13,46],[48,73],[74,97]],use:"Shortcuts and quick controls without leaving the page you are on.",tip:"On a page with room, you can also hold an empty spot for the Anywhere menu. Slide to the red X to cancel.",kinds:[["By type","One menu for each kind of tile. Every light gets the light menu."],["One tile","A menu for one tile only. It takes the place of its type's menu."],["Anywhere","The same shortcuts from every page."]]},"status-pages":{seconds:8,hue:"var(--wa-hue-orange)",still:70,get groups(){return[{title:"On your watch",steps:[b("**Open** one from a status page tile, a menu slot, or by asking Siri.","**Open** one from a status page tile, a menu slot, or, on an Apple device, by asking Siri."),`**Read** it. Turn the ${z()} to see more.`]}]},windows:[[0,46],[48,97]],use:"Checking things fast: lights that are on, low batteries, open windows. A status page only shows things. To change one, use a tile.",tip:"To put one on a page, add a status page tile on the Pages tab."},complications:{seconds:8,hue:"var(--wa-hue-green)",still:70,get groups(){return[{title:"On your watch",steps:[b("**Touch and hold** the watch face. Tap **Edit**.","**Touch and hold** the watch face. Tap **Edit** or **Customize**."),"**Pick** a spot, then pick **HouseLit**.","**Tap** it to run its tap action, like opening a page."]}]},windows:[[0,33],[35,66],[68,97]],use:"Seeing things without opening the app, like the temperature or whether the door is locked.",tip:"You make the design here. You put it on a face on the watch."}};function B(e){return e.split("**").map((t,n)=>n%2===1?s`<b>${t}</b>`:s`${t}`)}var G={bulb:"M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z",lock:"M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",play:"M6 4l14 8-14 8z",temp:"M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",camera:"M3 7h12v10H3zM15 10l6-3v10l-6-3",house:"M3 11l9-7 9 7v9H3z",fan:"M12 10c0-4 1-7 4-7 2 0 2 3 0 5M14 12c4 0 7 1 7 4 0 2-3 2-5 0M12 14c0 4-1 7-4 7-2 0-2-3 0-5M10 12c-4 0-7-1-7-4 0-2 3-2 5 0",list:"M9 6h11M9 12h11M9 18h8M4 6h.5M4 12h.5M4 18h.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",power:"M12 3v9M6.4 6.4a8 8 0 1 0 11.2 0",sun:"M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4",palette:"M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6 3 3 0 0 1 0-6 3 3 0 0 0 0-6z",moon:"M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z",mic:"M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3",pages:"M3 5h7.5v7.5H3zM13.5 5H21v7.5h-7.5zM5 17h14",alert:"M12 8v5M12 16h.01"},m=(e,t="tl-ic")=>s`<svg class=${t} viewBox="0 0 24 24" aria-hidden="true"><path d=${G[e]}></path></svg>`,c=(e,t,n,o)=>s`<div class="tl-t ${e}">${m(t)}<span>${n}<small>${o}</small></span></div>`,T=(e,t)=>s`${e.map((n,o)=>{let r=(-90+o*(360/e.length))*(Math.PI/180),a=Math.round(Math.cos(r)*58),i=Math.round(Math.sin(r)*58);return s`<div class="tl-slot ${t?.index===o?t.cls:""}" style=${`left:${a}px;top:${i}px`}>${m(n,"")}</div>`})}`;function K(){return s`<div class="tl-clock">10:09</div>
    <div class="tl-strip">
      <div class="tl-pg"><div class="tl-grid">
        ${c("c-yellow","bulb","Living room","On")}${c("c-orange","lock","Front Door","Locked")}
        ${c("c-purple","play","Movie","Scene")}${c("c-blue","temp","Hall","21\xB0")}
      </div></div>
      <div class="tl-pg"><div class="tl-grid">
        ${c("c-ink","camera","Driveway","Camera")}${c("tl-porch","bulb","Porch",s`<i class="tl-word"></i>`)}
        ${c("c-green","house","Garage","Closed")}${c("c-pink","fan","Fan","Off")}
      </div></div>
    </div>
    <div class="tl-dots"><i class="tl-d1"></i><i class="tl-d2"></i></div>
    <div class="tl-finger"></div>`}function W(){return s`<div class="tl-clock">10:09</div>
    <div class="tl-grid">
      ${c("tl-lr","bulb","Living room",s`<i class="tl-word"></i>`)}${c("c-orange","lock","Front Door","Locked")}
      ${c("c-blue","temp","Hall","21\xB0")}${c("c-green","house","Garage","Closed")}
    </div>
    <div class="tl-dim"></div>
    <div class="tl-ring"></div>
    <div class="tl-radial tl-ra">
      <div class="tl-arms">${T(["sun","palette","minus","plus","power"],{index:4,cls:"tl-hit-a"})}</div>
      <div class="tl-mid">${m("plus","")}</div>
      <div class="tl-name tl-na">Turn off</div>
    </div>
    <div class="tl-radial tl-rb1">
      <div class="tl-arms">${T(["lock","lock","alert","minus","minus"])}</div>
      <div class="tl-mid">${m("plus","")}</div>
    </div>
    <div class="tl-radial tl-rb2">
      ${T(["play","moon","mic","pages","list"],{index:0,cls:"tl-hit-b"})}
      <div class="tl-mid">${m("plus","")}</div>
      <div class="tl-name tl-nany">Anywhere menu</div>
      <div class="tl-name tl-nb">Movie scene</div>
    </div>
    <div class="tl-toast tl-ta"><i></i>Living room is off</div>
    <div class="tl-toast tl-tb"><i></i>Movie scene is on</div>
    <div class="tl-finger"></div>`}function q(){let e=(t,n)=>s`<div class="tl-row"><i></i>${t}<span>${n}</span></div>`;return s`<div class="tl-clock">10:09</div>
    <div class="tl-grid">
      ${c("c-orange tl-stile","list","Lights on","3")}${c("c-purple","play","Movie","Scene")}
      ${c("c-blue","temp","Hall","21\xB0")}${c("c-green","house","Garage","Closed")}
    </div>
    <div class="tl-sheet"><h5>Lights on</h5><div class="tl-rows">
      ${e("Kitchen","On")}${e("Office","80%")}${e("Porch","On")}${e("Hall lamp","40%")}${e("Garden","On")}
    </div></div>
    <div class="tl-finger"></div>`}function U(){return s`<div class="tl-face">
      <div class="tl-fdate">SUN 15</div>
      <div class="tl-ftime">10:09</div>
      <div class="tl-cmp tl-ca tl-target"><span class="tl-old">+</span><span class="tl-new"><b>21°</b></span></div>
      <div class="tl-cmp tl-cc">72%</div>
      <div class="tl-cmp tl-cb">${m("moon","")}</div>
    </div>
    <div class="tl-editpill">Edit</div>
    <div class="tl-picker">
      <div class="tl-prow"><i></i>Activity</div>
      <div class="tl-prow tl-wa"><i></i>HouseLit</div>
      <div class="tl-prow"><i></i>Weather</div>
    </div>
    <div class="tl-jump"><div class="tl-clock">10:09</div><div class="tl-grid">
      ${c("c-blue","temp","Hall","21\xB0")}${c("c-orange","sun","Heat","Auto")}
    </div></div>
    <div class="tl-finger"></div>`}var V={pages:K,menus:W,"status-pages":q,complications:U};function X(e){let t=e.currentTarget,n=t.closest(".tl");if(n===null)return;let o=n.classList.toggle("tl-paused");t.setAttribute("aria-pressed",String(o)),t.setAttribute("aria-label",o?"Play the picture":"Pause the picture"),t.title=o?"Play":"Pause"}function D(e,t=!1){let n=k[e],o=s`<div class="tl-watch" aria-hidden="true"><div class="tl-scr">${V[e]()}</div>
    ${e==="menus"||e==="status-pages"?s`<div class="tl-crown">↻</div>`:d}</div>`;return t?s`<div class="tl tl-mini tl-${e}" style=${`--tl-t:${n.seconds}s;--tl-still:${-(n.seconds*n.still)/100}s`}><div class="tl-mini-box">${o}</div></div>`:o}function de(e,t={}){let n=k[e],o=0,r=n.groups.map(i=>{let p=o;return o+=i.steps.length,s`<div class="tl-k">${i.title}</div>
      <ol class="tl-steps" style=${`counter-reset: tl-s ${p}`}>
        ${i.steps.map((l,f)=>s`<li class="tl-step tl-s${p+f+1}"><span>${B(l)}</span></li>`)}
      </ol>`}),a=t.compact===!0;return s`<section class="tl tl-card tl-${e} ${a?"tl-compact":""}" aria-label="How it works on your watch"
      style=${`--tl-hue:${n.hue};--tl-t:${n.seconds}s;--tl-still:${-(n.seconds*n.still)/100}s`}>
    <div class="tl-stage">
      ${a?s`<div class="tl-shrink">${D(e)}</div>`:D(e)}
      <button type="button" class="tl-pause" title="Pause" aria-label="Pause the picture" aria-pressed="false" @click=${X}>
        <svg viewBox="0 0 24 24" aria-hidden="true" class="tl-pz"><path d="M8 5v14M16 5v14"></path></svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" class="tl-pl"><path d="M7 4l13 8-13 8z"></path></svg>
      </button>
    </div>
    <div class="tl-text">
      ${r}
      ${n.tip===void 0?d:s`<p class="tl-tip">${n.tip}</p>`}
      ${n.kinds===void 0?d:s`<div class="tl-k">Three kinds of menu</div>
        <div class="tl-kinds">${n.kinds.map(([i,p])=>s`<div class="tl-kind"><b>${i}</b><span>${p}</span></div>`)}</div>`}
      ${a?d:s`<p class="tl-use"><span class="tl-k">Good for</span>${n.use}</p>`}
      ${t.note??d}
      ${t.actions===void 0||t.actions===d?d:s`<div class="tl-acts">${t.actions}</div>`}
    </div>
  </section>`}var J="background: var(--wa-panel, var(--wa-raise)); color: var(--wa-ink); border-color: var(--wa-line-strong);",O="background: transparent; color: var(--wa-muted); border-color: transparent;";function Q(){return Object.keys(k).map(e=>k[e].windows.map(([n,o],r)=>{let a=`tl-${e}-s${r+1}`,i=n<=0?"":`0%, ${n-1}% { ${O} } `,p=o>=100?"":` ${o+1}%, 100% { ${O} }`;return`@keyframes ${a} { ${i}${Math.max(0,n)}%, ${o}% { ${J} }${p} }
.tl-${e} .tl-s${r+1} { animation: ${a} var(--tl-t) infinite; }`}).join(`
`)).join(`
`)}var fe=x`
  .tl-card {
    position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 20px 24px; align-items: center;
    box-sizing: border-box; width: min(760px, 100%); margin: 0 auto; padding: 20px; border-radius: 16px; text-align: left;
    border: 1px solid color-mix(in srgb, var(--tl-hue) 50%, var(--wa-line-strong)); background: var(--wa-card); color: var(--wa-ink);
  }
  /* Side by side when there is room; the watch above, centred, when not. */
  .tl-stage { position: relative; flex: 0 0 228px; display: grid; place-items: center; }
  .tl-pause {
    position: absolute; left: 0; bottom: 0; width: 28px; height: 28px; padding: 0; border-radius: 50%; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-muted); cursor: pointer;
  }
  .tl-pause:hover { color: var(--wa-ink); }
  .tl-pause:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .tl-pause svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .tl-pause .tl-pl { display: none; }
  .tl-paused .tl-pause .tl-pz { display: none; }
  .tl-paused .tl-pause .tl-pl { display: block; }
  .tl-text { flex: 1 1 280px; min-width: 0; font-size: 13px; line-height: 1.45; }
  .tl-k { display: block; font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); margin: 0 0 6px; }
  .tl-steps { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 4px; }
  .tl-step { counter-increment: tl-s; display: flex; gap: 10px; align-items: flex-start; padding: 7px 10px; border-radius: 10px; border: 1px solid transparent; color: var(--wa-muted); }
  .tl-step::before {
    content: counter(tl-s); flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center;
    font-size: 11px; font-weight: 600; background: var(--wa-raise); color: var(--wa-ink);
  }
  .tl-step b { font-weight: 600; }
  .tl-tip { margin: -4px 0 12px 10px; font-size: 12px; color: var(--wa-muted); }
  .tl-kinds { border: 1px solid var(--wa-line); border-radius: 10px; margin: 0 0 12px; }
  .tl-kind { display: grid; grid-template-columns: 76px 1fr; gap: 8px; padding: 6px 10px; font-size: 12px; color: var(--wa-label); }
  .tl-kind + .tl-kind { border-top: 1px solid var(--wa-line); }
  .tl-kind b { color: var(--wa-ink); font-weight: 600; }
  .tl-use { margin: 0 0 14px; font-size: 12.5px; color: var(--wa-label); }
  .tl-use .tl-k { display: inline; margin-right: 6px; }
  .tl-acts { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 12px; }

  /* the watch: dark in both themes, as the watch is */
  .tl-watch {
    position: relative; flex: none; width: 204px; height: 248px; box-sizing: border-box; padding: 11px; border-radius: 58px;
    background: linear-gradient(160deg, #3a3a3e, #1b1b1d); box-shadow: 0 14px 32px rgba(0, 0, 0, .35), inset 0 0 0 1px #4a4a4f;
  }
  .tl-watch::after { content: ""; position: absolute; right: -6px; top: 70px; width: 7px; height: 34px; border-radius: 3px; background: linear-gradient(90deg, #4b4b50, #2a2a2d); }
  .tl-scr { position: relative; width: 182px; height: 226px; border-radius: 47px; background: #000; overflow: hidden; font-family: "WA Inter", Inter, -apple-system, sans-serif; color: #fff; }
  .tl-clock { position: absolute; top: 9px; right: 30px; font-size: 11px; font-weight: 600; z-index: 3; }
  .tl-grid { position: absolute; top: 26px; left: 8px; width: 166px; display: grid; grid-template-columns: 80px 80px; gap: 6px; }
  .tl-t {
    height: 88px; box-sizing: border-box; border-radius: 18px; padding: 9px; display: flex; flex-direction: column; justify-content: space-between;
    font-size: 10.5px; font-weight: 600; line-height: 1.2; color: #fff; overflow: hidden;
  }
  .tl-t small { display: block; font-size: 9px; font-weight: 600; opacity: .85; }
  .tl-t i { font-style: normal; }
  .tl-ic { width: 22px; height: 22px; }
  .tl-scr svg { stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .c-yellow { background: #e8c547; color: #2b2100; } .c-orange { background: #f0a23b; } .c-purple { background: #a78bfa; }
  .c-blue { background: #5e9beb; } .c-green { background: #4cc38a; } .c-pink { background: #ec7a93; } .c-ink { background: #1c1c1e; }
  .tl-dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; justify-content: center; gap: 4px; z-index: 3; }
  .tl-dots i { width: 5px; height: 5px; border-radius: 50%; background: #555; }
  /* The finger: a ring with a light fill, so it reads as a touch, and a
     ripple out of it on each tap (its ::after, timed per loop below). */
  .tl-finger {
    position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; box-sizing: border-box; border-radius: 50%; z-index: 10; opacity: 0; pointer-events: none;
    border: 2.5px solid #fff; background: rgba(255, 255, 255, .34);
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, .55), 0 0 14px rgba(255, 255, 255, .45);
  }
  .tl-finger::after { content: ""; position: absolute; inset: -2px; border-radius: 50%; border: 2px solid #fff; opacity: 0; }
  .tl-pages .tl-finger::after { animation: tl-rip-pages var(--tl-t) infinite; }
  @keyframes tl-rip-pages { 0%, 59% { opacity: 0; transform: scale(.8); } 60% { opacity: .9; transform: scale(1); } 66%, 100% { opacity: 0; transform: scale(2.2); } }
  .tl-status-pages .tl-finger::after { animation: tl-rip-status var(--tl-t) infinite; }
  @keyframes tl-rip-status { 0%, 15% { opacity: 0; transform: scale(.8); } 16% { opacity: .9; transform: scale(1); } 22%, 100% { opacity: 0; transform: scale(2.2); } }
  .tl-complications .tl-finger::after { animation: tl-rip-comp var(--tl-t) infinite; }
  @keyframes tl-rip-comp {
    0%, 29% { opacity: 0; transform: scale(.8); } 30% { opacity: .9; transform: scale(1); } 35% { opacity: 0; transform: scale(2.2); }
    55% { opacity: 0; transform: scale(.8); } 56% { opacity: .9; transform: scale(1); } 61% { opacity: 0; transform: scale(2.2); }
    80% { opacity: 0; transform: scale(.8); } 81% { opacity: .9; transform: scale(1); } 86%, 100% { opacity: 0; transform: scale(2.2); }
  }
  .tl-crown { position: absolute; right: -24px; top: 62px; color: var(--wa-muted); font-size: 16px; opacity: 0; }
  .tl-watch * { animation-duration: var(--tl-t); animation-iteration-count: infinite; animation-timing-function: ease; }

  /* Pages: swipe, then tap the porch light on */
  .tl-strip { position: absolute; inset: 0; width: 364px; animation-name: tl-strip; }
  .tl-pg { position: absolute; top: 0; width: 182px; height: 226px; }
  .tl-pg + .tl-pg { left: 182px; }
  @keyframes tl-strip { 0%, 12% { transform: translateX(0); } 34%, 96% { transform: translateX(-182px); } 100% { transform: translateX(0); } }
  .tl-d1 { animation-name: tl-d1; } .tl-d2 { animation-name: tl-d2; }
  @keyframes tl-d1 { 0%, 25% { background: #fff; } 27%, 97% { background: #555; } 100% { background: #fff; } }
  @keyframes tl-d2 { 0%, 25% { background: #555; } 27%, 97% { background: #fff; } 100% { background: #555; } }
  .tl-pages .tl-finger { animation-name: tl-f-pages; }
  @keyframes tl-f-pages {
    0%, 8% { opacity: 0; left: 150px; top: 150px; transform: scale(1.2); }
    12% { opacity: 1; left: 150px; top: 150px; transform: scale(1); }
    34% { opacity: 1; left: 40px; top: 150px; }
    38% { opacity: 0; left: 30px; top: 150px; }
    52% { opacity: 0; left: 130px; top: 70px; transform: scale(1.3); }
    56% { opacity: 1; left: 130px; top: 70px; transform: scale(1); }
    60% { transform: scale(.75); }
    64% { opacity: 1; transform: scale(1); }
    72%, 100% { opacity: 0; left: 130px; top: 70px; }
  }
  .tl-porch { animation-name: tl-porch; }
  @keyframes tl-porch { 0%, 60% { background: #2c2c2e; color: #aaa; } 62%, 96% { background: #e8c547; color: #2b2100; } 100% { background: #2c2c2e; color: #aaa; } }
  .tl-porch .tl-word::before { content: "Off"; animation: tl-porch-word var(--tl-t) infinite; }
  @keyframes tl-porch-word { 0%, 60% { content: "Off"; } 62%, 96% { content: "On"; } 100% { content: "Off"; } }

  /* Menus: a tile's menu, then the Anywhere menu by the crown */
  .tl-dim { position: absolute; inset: 0; background: rgba(0, 0, 0, .74); opacity: 0; z-index: 4; animation-name: tl-dim; }
  @keyframes tl-dim { 0%, 11% { opacity: 0; } 13%, 34% { opacity: 1; } 37%, 56% { opacity: 0; } 58%, 87% { opacity: 1; } 90%, 100% { opacity: 0; } }
  .tl-ring { position: absolute; width: 60px; height: 60px; margin: -30px 0 0 -30px; border-radius: 50%; border: 2.5px solid #fff; box-sizing: border-box; z-index: 6; opacity: 0; animation-name: tl-ring; }
  @keyframes tl-ring {
    0%, 1% { left: 47px; top: 70px; opacity: 0; transform: scale(.3); }
    3% { left: 47px; top: 70px; opacity: .9; transform: scale(.3); }
    11% { left: 47px; top: 70px; opacity: .9; transform: scale(1); }
    13% { left: 47px; top: 70px; opacity: 0; transform: scale(1.2); }
    47% { left: 135px; top: 70px; opacity: 0; transform: scale(.3); }
    50% { left: 135px; top: 70px; opacity: .9; transform: scale(.3); }
    56% { left: 135px; top: 70px; opacity: .9; transform: scale(1); }
    58%, 100% { left: 135px; top: 70px; opacity: 0; transform: scale(1.2); }
  }
  .tl-radial { position: absolute; left: 91px; top: 113px; width: 0; height: 0; z-index: 7; opacity: 0; }
  .tl-arms { position: absolute; left: 0; top: 0; }
  .tl-slot { position: absolute; width: 36px; height: 36px; margin: -18px 0 0 -18px; border-radius: 50%; background: #2c2c2e; display: grid; place-items: center; }
  .tl-slot svg { width: 17px; height: 17px; }
  .tl-mid { position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: #fff; color: #000; display: grid; place-items: center; }
  .tl-mid svg { width: 16px; height: 16px; stroke-width: 2.6; }
  .tl-name { position: absolute; left: -60px; top: 74px; width: 120px; text-align: center; font-size: 10px; font-weight: 600; opacity: 0; }
  .tl-ra { animation-name: tl-ra; }
  @keyframes tl-ra { 0%, 11% { opacity: 0; } 13%, 34% { opacity: 1; } 37%, 100% { opacity: 0; } }
  .tl-ra .tl-arms { animation-name: tl-arms-a; }
  @keyframes tl-arms-a { 0%, 17% { opacity: 0; transform: scale(.2); } 20%, 100% { opacity: 1; transform: none; } }
  .tl-rb1 { animation-name: tl-rb1; }
  @keyframes tl-rb1 { 0%, 56% { opacity: 0; } 58%, 66% { opacity: 1; transform: none; } 70%, 100% { opacity: 0; transform: rotate(40deg) scale(.9); } }
  .tl-rb1 .tl-arms { animation-name: tl-arms-b; }
  @keyframes tl-arms-b { 0%, 61% { opacity: 0; transform: scale(.2); } 63%, 100% { opacity: 1; transform: none; } }
  .tl-rb2 { animation-name: tl-rb2; }
  @keyframes tl-rb2 { 0%, 66% { opacity: 0; transform: rotate(-40deg) scale(.9); } 70%, 87% { opacity: 1; transform: none; } 90%, 100% { opacity: 0; } }
  .tl-hit-a { animation-name: tl-hit-a; }
  @keyframes tl-hit-a { 0%, 24% { background: #2c2c2e; transform: scale(1); } 27%, 34% { background: #48484a; transform: scale(1.25); } 37%, 100% { background: #2c2c2e; transform: scale(1); } }
  .tl-hit-b { animation-name: tl-hit-b; }
  @keyframes tl-hit-b { 0%, 79% { background: #2c2c2e; transform: scale(1); } 81%, 87% { background: #a78bfa; transform: scale(1.25); } 90%, 100% { background: #2c2c2e; transform: scale(1); } }
  .tl-na { animation-name: tl-na; }
  @keyframes tl-na { 0%, 26% { opacity: 0; } 28%, 34% { opacity: 1; } 36%, 100% { opacity: 0; } }
  .tl-nany { animation-name: tl-nany; }
  @keyframes tl-nany { 0%, 69% { opacity: 0; } 71%, 77% { opacity: 1; } 79%, 100% { opacity: 0; } }
  .tl-nb { animation-name: tl-nb; }
  @keyframes tl-nb { 0%, 80% { opacity: 0; } 82%, 87% { opacity: 1; } 89%, 100% { opacity: 0; } }
  .tl-menus .tl-finger { animation-name: tl-f-menus; }
  @keyframes tl-f-menus {
    0% { opacity: 0; left: 47px; top: 70px; transform: scale(1.3); }
    2%, 12% { opacity: 1; left: 47px; top: 70px; transform: scale(1); }
    18% { left: 91px; top: 113px; }
    20% { left: 91px; top: 113px; }
    26%, 33% { opacity: 1; left: 36px; top: 95px; transform: scale(1); }
    36% { opacity: 0; left: 36px; top: 95px; transform: scale(1.3); }
    47% { opacity: 0; left: 135px; top: 70px; transform: scale(1.3); }
    49%, 57% { opacity: 1; left: 135px; top: 70px; transform: scale(1); }
    62%, 72% { opacity: 1; left: 91px; top: 113px; }
    80%, 87% { opacity: 1; left: 91px; top: 55px; transform: scale(1); }
    90%, 100% { opacity: 0; left: 91px; top: 55px; transform: scale(1.3); }
  }
  .tl-lr { animation-name: tl-lr; }
  @keyframes tl-lr { 0%, 34% { background: #e8c547; color: #2b2100; } 36%, 98% { background: #2c2c2e; color: #aaa; } 100% { background: #e8c547; color: #2b2100; } }
  .tl-lr .tl-word::before { content: "On"; animation: tl-lr-word var(--tl-t) infinite; }
  @keyframes tl-lr-word { 0%, 34% { content: "On"; } 36%, 98% { content: "Off"; } 100% { content: "On"; } }
  .tl-toast {
    position: absolute; left: 14px; right: 14px; bottom: 26px; z-index: 8; display: flex; align-items: center; gap: 7px;
    padding: 8px 10px; border-radius: 14px; background: #2c2c2e; font-size: 10.5px; font-weight: 600; opacity: 0;
  }
  .tl-toast i { width: 16px; height: 16px; border-radius: 50%; flex: none; }
  .tl-ta { animation-name: tl-ta; } .tl-ta i { background: #8e8e93; }
  @keyframes tl-ta { 0%, 36% { opacity: 0; transform: translateY(8px); } 38%, 45% { opacity: 1; transform: none; } 47%, 100% { opacity: 0; } }
  .tl-tb { animation-name: tl-tb; } .tl-tb i { background: #a78bfa; }
  @keyframes tl-tb { 0%, 88% { opacity: 0; transform: translateY(8px); } 90%, 97% { opacity: 1; transform: none; } 99%, 100% { opacity: 0; } }
  .tl-menus .tl-crown { animation-name: tl-crown-m; }
  @keyframes tl-crown-m { 0%, 62% { opacity: 0; transform: rotate(0); } 64% { opacity: 1; } 71% { opacity: 1; transform: rotate(200deg); } 74%, 100% { opacity: 0; transform: rotate(200deg); } }

  /* Status pages: tap the tile, the page slides up, the crown scrolls */
  .tl-stile { animation-name: tl-stile; }
  @keyframes tl-stile { 0%, 14% { transform: scale(1); } 17% { transform: scale(.92); } 21%, 100% { transform: scale(1); } }
  .tl-status-pages .tl-finger { animation-name: tl-f-status; }
  @keyframes tl-f-status { 0%, 6% { opacity: 0; left: 47px; top: 70px; transform: scale(1.3); } 10% { opacity: 1; transform: scale(1); } 16% { transform: scale(.75); } 20% { opacity: 1; transform: scale(1); } 25%, 100% { opacity: 0; left: 47px; top: 70px; } }
  .tl-sheet { position: absolute; inset: 0; z-index: 5; padding: 30px 14px 0; background: #000; transform: translateY(100%); animation-name: tl-sheet; }
  @keyframes tl-sheet { 0%, 22% { transform: translateY(100%); } 32%, 95% { transform: none; } 100% { transform: translateY(100%); } }
  .tl-sheet h5 { margin: 0 0 8px; font-size: 13px; font-weight: 700; }
  .tl-rows { animation-name: tl-rows; }
  @keyframes tl-rows { 0%, 58% { transform: none; } 78%, 100% { transform: translateY(-46px); } }
  .tl-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; padding: 8px 10px; border-radius: 12px; background: #1c1c1e; font-size: 10.5px; font-weight: 600; }
  .tl-row i { width: 8px; height: 8px; border-radius: 50%; background: #e8c547; flex: none; }
  .tl-row span { margin-left: auto; color: #aaa; font-weight: 500; }
  .tl-status-pages .tl-crown { animation-name: tl-crown-s; }
  @keyframes tl-crown-s { 0%, 56% { opacity: 0; transform: translateY(6px); } 62%, 78% { opacity: 1; transform: translateY(-4px); } 84%, 100% { opacity: 0; } }

  /* Complications: hold the face, Edit, pick Wrist Assistant, tap it */
  .tl-face { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at 50% 40%, #121212, #000); animation-name: tl-face; }
  @keyframes tl-face { 0%, 16% { transform: scale(1); border-radius: 47px; } 22%, 64% { transform: scale(.8); border-radius: 30px; box-shadow: 0 0 0 2px #333; } 70%, 100% { transform: scale(1); } }
  .tl-ftime { position: absolute; top: 74px; left: 0; right: 0; text-align: center; font-size: 46px; font-weight: 600; letter-spacing: -.02em; }
  .tl-fdate { position: absolute; top: 56px; left: 0; right: 0; text-align: center; font-size: 10px; font-weight: 600; color: #f0a23b; }
  .tl-cmp { position: absolute; width: 40px; height: 40px; border-radius: 50%; background: #1c1c1e; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #ddd; }
  .tl-cmp svg { width: 14px; height: 14px; }
  .tl-ca { left: 26px; top: 150px; } .tl-cb { right: 26px; top: 150px; } .tl-cc { left: 71px; top: 166px; }
  .tl-target { animation-name: tl-target; }
  @keyframes tl-target { 0%, 34% { box-shadow: none; } 38%, 62% { box-shadow: 0 0 0 2.5px #4cc38a; } 66%, 100% { box-shadow: none; } }
  .tl-old, .tl-new { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 50%; }
  .tl-new { background: conic-gradient(#5e9beb 0 62%, #2a2a2d 62% 100%); opacity: 0; animation-name: tl-newc; }
  .tl-new b { width: 32px; height: 32px; border-radius: 50%; background: #111; display: grid; place-items: center; font-size: 10px; }
  @keyframes tl-newc { 0%, 60% { opacity: 0; } 64%, 96% { opacity: 1; } 100% { opacity: 0; } }
  .tl-editpill { position: absolute; left: 50%; bottom: 8px; z-index: 4; margin-left: -28px; width: 56px; text-align: center; padding: 5px 0; border-radius: 99px; background: #2c2c2e; font-size: 10.5px; font-weight: 700; opacity: 0; animation-name: tl-editp; }
  @keyframes tl-editp { 0%, 20% { opacity: 0; } 23%, 32% { opacity: 1; } 34%, 100% { opacity: 0; } }
  .tl-picker { position: absolute; left: 0; right: 0; bottom: 0; height: 132px; z-index: 6; box-sizing: border-box; padding: 12px 14px; border-radius: 22px 22px 0 0; background: #1c1c1e; transform: translateY(100%); animation-name: tl-picker; }
  @keyframes tl-picker { 0%, 40% { transform: translateY(100%); } 46%, 60% { transform: none; } 66%, 100% { transform: translateY(100%); } }
  .tl-prow { display: flex; align-items: center; gap: 7px; padding: 6px 8px; border-radius: 9px; font-size: 10.5px; font-weight: 600; color: #ccc; }
  .tl-prow i { width: 14px; height: 14px; border-radius: 4px; background: #444; flex: none; }
  .tl-wa { color: #fff; animation-name: tl-prow; }
  .tl-wa i { background: #5e9beb; }
  @keyframes tl-prow { 0%, 52% { background: transparent; } 55%, 62% { background: #3a3a3d; } 66%, 100% { background: transparent; } }
  .tl-complications .tl-finger { animation-name: tl-f-comp; }
  @keyframes tl-f-comp {
    0%, 2% { opacity: 0; left: 91px; top: 110px; transform: scale(1.3); }
    5%, 18% { opacity: 1; left: 91px; top: 110px; transform: scale(1); }
    22% { opacity: 0; left: 91px; top: 110px; }
    25% { opacity: 0; left: 91px; top: 214px; }
    27% { opacity: 1; left: 91px; top: 214px; transform: scale(1); } 30% { transform: scale(.75); } 32% { opacity: 1; transform: scale(1); }
    34% { opacity: 0; left: 91px; top: 214px; }
    50% { opacity: 0; left: 70px; top: 128px; transform: scale(1.3); }
    53% { opacity: 1; left: 70px; top: 128px; transform: scale(1); } 56% { transform: scale(.75); } 58% { opacity: 1; transform: scale(1); }
    61%, 74% { opacity: 0; left: 70px; top: 128px; }
    78% { opacity: 1; left: 46px; top: 170px; transform: scale(1); } 81% { transform: scale(.75); } 83% { opacity: 1; transform: scale(1); }
    87%, 100% { opacity: 0; left: 46px; top: 170px; }
  }
  .tl-jump { position: absolute; inset: 0; z-index: 7; background: #000; opacity: 0; animation-name: tl-jump; }
  @keyframes tl-jump { 0%, 83% { opacity: 0; transform: scale(.4); } 88%, 96% { opacity: 1; transform: none; } 100% { opacity: 0; } }

  /* the steps, lit in time (made from TEACH_LOOPS) */
  ${M(Q())}

  /* paused, and held still for less motion */
  .tl-paused *, .tl-paused *::before, .tl-paused *::after { animation-play-state: paused !important; }
  @media (prefers-reduced-motion: reduce) {
    .tl .tl-watch *, .tl .tl-watch *::before, .tl .tl-watch *::after { animation-play-state: paused !important; animation-delay: var(--tl-still) !important; }
    .tl .tl-step { animation: none !important; color: var(--wa-ink); }
    .tl-pause { display: none; }
  }

  /* compact, in the Help sheet: no box, the watch at three quarters */
  .tl-compact { width: 100%; padding: 0; border: 0; border-radius: 0; background: none; align-items: flex-start; gap: 16px 18px; }
  .tl-compact .tl-stage { flex: 0 0 153px; display: block; }
  .tl-shrink { width: 153px; height: 186px; }
  .tl-shrink .tl-watch { transform: scale(.75); transform-origin: top left; }
  .tl-compact .tl-text { flex: 1 1 220px; }
  .tl-compact .tl-steps { margin-bottom: 8px; }
  .tl-compact .tl-tip { margin-bottom: 0; }

  /* the bare watch in a hover card, small */
  .tl-mini { display: flex; justify-content: center; margin: 4px 0 10px; }
  .tl-mini-box { width: 122px; height: 149px; }
  .tl-mini .tl-watch { transform: scale(.6); transform-origin: top left; box-shadow: none; }
  .tl-mini .tl-crown { display: none; }

`;var E="all";function v(e,t){let n=e.findIndex(o=>o.ownerId===t);return n<0?e.length:n}function A(e,t){let n=e.toLocaleLowerCase(),o=t.toLocaleLowerCase();return n<o?-1:n>o?1:0}function Z(e){return e.linkId!==void 0&&e.linkId!==""?`link:${e.linkId}`:`rec:${e.ownerId}\0${e.id}`}function ge(e,t,n){let o=new Map;for(let a of e){let i=Z(a),p=o.get(i);p?p.push(a):o.set(i,[a])}let r=[];for(let[a,i]of o){let p=[...i].sort((h,I)=>v(t,h.ownerId)-v(t,I.ownerId)||h.slot-I.slot),l=p[0];if(!l)continue;let f=p.find(h=>h.ownerId===n)??l;r.push({key:a,name:f.name,copies:p,open:f})}return r}function N(e,t){return e.filter(n=>n.copies.some(o=>o.ownerId===t))}function he(e,t,n){let o=[],r=new Set(t),a=new Set;for(let i of t){if(a.has(i))continue;let p=e.find(f=>n(f).includes(i)),l=p?[...n(p)]:[i];if(l.some(f=>!r.has(f)))return;for(let f of l)a.add(f);o.push(l)}return o}function xe(e,t){return t?{deleteAsk:e===1?"Delete 1 design from every device it is on? Faces and widgets using it lose it.":`Delete ${e} designs from every device they are on? Faces and widgets using them lose them.`,deleteTitle:"Delete these designs from every device they are on",takeOff:"Take off everywhere",takeOffTitle:`Take these designs off every device they are on. Each one is kept, under ${u}.`}:{deleteAsk:`Delete ${e}? Faces and widgets using them lose them.`,deleteTitle:"Delete these complications",takeOff:"Take off",takeOffTitle:`Take each of these off the device its card is under. The last copy of a design is kept, under ${u}.`}}function H(e){return e.copies.length>0&&e.copies.every(t=>t.ownerId===y)}function ee(e){let t;for(let n of e)for(let o of n.copies)if(t===void 0)t=o.ownerId;else if(t!==o.ownerId)return;return t}function C(e,t,n){let o=n??ee(e),r=(a,i)=>a.copies.find(p=>p.ownerId===i)?.slot??Number.MAX_SAFE_INTEGER;return o!==void 0?[...e].sort((a,i)=>r(a,o)-r(i,o)||A(a.name,i.name)):[...e].sort((a,i)=>A(a.name,i.name)||v(t,a.copies[0]?.ownerId??"")-v(t,i.copies[0]?.ownerId??"")||a.open.slot-i.open.slot)}function be(e,t,n){return n===E?C(e,t):C(N(e,n),t,n)}var u="Not on a device",we=`the ${u} list`;function $(e){return e.kind==="library"||e.ownerId===y}function te(e){return[...e.filter(t=>!$(t)),...e.filter($)]}function ye(e,t){let n=[{key:E,label:"All",kind:"all",count:e.length}];for(let o of te(t))n.push({key:o.ownerId,label:$(o)?u:o.label,kind:o.kind,count:N(e,o.ownerId).length});return n}function ne(e,t=!1){return e==="iphone"&&t?"phone":e==="iphone"?"iPhone":"watch"}function ke(e,t){let n=new Set(e),o=[];for(let r of t){let a=r.devices.filter(i=>n.has(i.ownerId));a.length!==0&&o.push(`${r.label} (${a.map(i=>ne(i.kind,i.android===!0)).join(", ")})`)}return o.length>0?o.join(" \xB7 "):n.has(y)?u:"On no device yet"}function ve(e,t,n){let o=new Map;for(let a of e){let{key:i,label:p}=t(a),l=o.get(i);l?l.rows.push(a):o.set(i,{key:i,label:p,rows:[a]})}let r=a=>{let i=n.indexOf(a);return i<0?n.length:i};return[...o.values()].sort((a,i)=>r(a.key)-r(i.key))}var Le="Empty, no layers",Ie="Search by name, person or entity";function Me(e){if(e.elements.length>0||e.control!==void 0||e.values.length>0||e.dataSources.length>0||e.notes!==void 0&&e.notes.trim()!==""||e.tapAction.type!=="refresh"&&e.tapAction.type!=="openApp")return!1;for(let t of Object.values(e.perFamily))if(t!==void 0&&(S(t)||t.backgroundColorHex!==void 0||t.backgroundFill!==void 0||t.borderColorHex!==void 0||t.rules.length>0))return!1;return!e.supportedFamilies.includes("inline")}var oe=new Set(["entityId","entity_id"]),ie=new Set(["displayName"]),ae=/\b[a-z_]+\.[a-z0-9_]+\b/g;function re(e){return e.includes("{{")||e.includes("{%")}function Se(e){let t=new Set,n=new Set,o=(r,a)=>{if(typeof r=="string"){if(r==="")return;let i=r.toLocaleLowerCase();if(a!==void 0&&oe.has(a))t.add(i);else if(a!==void 0&&ie.has(a))n.add(i);else if(re(r)){n.add(i);for(let p of i.match(ae)??[])t.add(p)}return}if(Array.isArray(r)){for(let i of r)o(i,a);return}if(r!==null&&typeof r=="object")for(let[i,p]of Object.entries(r))o(p,i)};return o(e,void 0),{entities:[...t],words:[...n]}}function Re(e,t,n){return t===""?!1:e.entities.some(o=>o.includes(t))||e.words.some(o=>o.includes(t))?!0:e.entities.some(o=>n(o)?.toLocaleLowerCase().includes(t)===!0)}function _(e,t){let n={all:void 0,shown:[],more:[],shelf:void 0};for(let o of e)o.kind==="all"?n.all=o:o.kind==="library"?n.shelf=o:o.count>0||o.key===t?n.shown.push(o):n.more.push(o);return n}function ze(e,t){let n=[],o=[],r=[];for(let a of e)H(a)?t(a)?r.push(a):o.push(a):n.push(a);return{placed:n,shelved:[...o,...r],empty:r}}function De(e,t){return t>0?`(${e}) \xB7 ${t} empty`:`(${e})`}function Oe(e){return e===1?"Delete 1 empty design?":`Delete ${e} empty designs?`}function Ae(e){return e===1?"Deleted 1 empty design.":`Deleted ${e} empty designs.`}function Ce(e,t,n,o){let r=new Map(e);return n===o?r.delete(t):r.set(t,n),r}function Ee(e){return[...e].sort(([,t],[,n])=>Number(n)-Number(t))}function Ne(e,t){return new Map(e.slice(t))}function He(e){return e.queued>0?e.queued===1?"1 change waits for Save":`${e.queued} changes wait for Save`:e.on===0?"On no device yet. Changes here apply at once":"Changes here apply at once"}function j(e){return e==="all"?"grid":e==="iphone"?"phone":e==="library"?"layers":"watch"}function Ge(e){let{current:t,open:n,onToggle:o,onPick:r,styleOf:a}=e,i=_(e.tabs,t),p=(l,f="")=>s`<button type="button" role="tab" class="pk-tab ${f} ${l.key===t?"on":""}"
      style=${a(l.key)} id=${`pk-tab-${l.key}`} aria-selected=${l.key===t?"true":"false"}
      aria-controls="pk-tabpanel" @click=${()=>r(l.key)}>
      <span class="pk-tab-glyph" aria-hidden="true">${w(j(l.kind))}</span>
      <span class="pk-tab-name">${l.label}</span>
      <span class="pk-tab-count">${l.count}</span>
    </button>`;return s`<div class="pk-tabs" role="tablist" aria-label="Devices">
    ${i.all===void 0?d:p(i.all)}
    ${i.shown.map(l=>p(l))}
    ${i.more.length===0?d:s`<span class="pk-more" data-menu="tabs" role="presentation"
      @keydown=${l=>{l.key==="Escape"&&n&&(l.preventDefault(),l.stopPropagation(),o(!1))}}>
      <button type="button" class="pk-more-btn" aria-haspopup="menu" aria-expanded=${n?"true":"false"}
        title="The devices with nothing on them" @click=${()=>o()}>+${i.more.length} more${w("chevron")}</button>
      ${n?s`<div class="pop-menu pk-more-menu" role="menu" aria-label="The devices with nothing on them">
        ${i.more.map(l=>s`<button type="button" class="row" role="menuitem" style=${a(l.key)}
          @click=${()=>{o(!1),r(l.key)}}>
          <span class="pk-tab-glyph" aria-hidden="true">${w(j(l.kind))}</span>
          <span class="pk-tab-name">${l.label}</span><span class="pk-tab-count">${l.count}</span></button>`)}
      </div>`:d}
    </span>`}
    ${i.shelf===void 0?d:s`<span class="pk-vsep" aria-hidden="true"></span>${p(i.shelf,"chip")}`}
  </div>`}var F="not-on-a-device";function Ke(e){let t=[{key:"all",label:"All",kind:"all",count:e.total}];for(let n of e.devices)t.push({key:n.ownerId,label:n.name,kind:n.kind,count:e.countOf(n.ownerId)});return(e.shelved>0||e.current===F)&&t.push({key:F,label:u,kind:"library",count:e.shelved}),t}var P=new Set;function We(e){return P.has(e)}function qe(e,t){t?P.add(e):P.delete(e)}var L=new Map;function Ue(e,t){return t!==void 0&&L.get(e)===t}function Ve(e,t){t===void 0?L.delete(e):L.set(e,t)}var se=3e4,g;function Xe(e){g={ownerId:e,at:Date.now()}}function Je(){return g!==void 0&&Date.now()-g.at>se&&(g=void 0),g?.ownerId}function Qe(){g=void 0}var Y=class{constructor(t){this.host=t;this.open=!1;this.toggle=(t=!this.open)=>{t!==this.open&&(this.open=t,t?window.addEventListener("pointerdown",this.outside,{capture:!0}):window.removeEventListener("pointerdown",this.outside,{capture:!0}),this.host.requestUpdate())};this.outside=t=>{t.composedPath().some(n=>n instanceof HTMLElement&&n.dataset.menu==="tabs")||this.toggle(!1)};t.addController(this)}hostDisconnected(){window.removeEventListener("pointerdown",this.outside,{capture:!0}),this.open=!1}},Ze=x`
  .pk-tabs {
    display: flex; align-items: stretch; flex-wrap: wrap; gap: 0 2px; flex: none;
    padding: 0 8px; border-bottom: 1px solid var(--wa-line);
  }
  /* A hairline between things of two kinds: the view from the preview in
     the head, the devices from Not on a device in the tabs. */
  .pk-vsep { width: 1px; height: 20px; flex: none; align-self: center; margin: 0 6px; background: var(--wa-line-strong); }
  /* Not on a device is a state, not a device, so it is a chip and no tab. */
  .pk-tab.chip {
    align-self: center; height: 28px; box-sizing: border-box; padding: 0 11px; margin: 4px 0; gap: 6px;
    border: 1px solid var(--wa-line-strong); border-radius: 999px; background: var(--wa-card); color: var(--wa-soft, var(--wa-ink));
  }
  .pk-tab.chip.on { border-color: var(--wa-ink); color: var(--wa-ink); }
  .pk-tab.chip:focus-visible { border-radius: 999px; }
  /* "+2 more": the devices holding nothing, a click away. */
  .pk-more { position: relative; display: inline-flex; align-items: center; flex: none; margin: 0 2px; }
  .pk-more-btn {
    display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 9px; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    border: 1px dashed var(--wa-line-strong); border-radius: 999px; background: transparent;
  }
  .pk-more-btn:hover, .pk-more-btn[aria-expanded="true"] { color: var(--wa-ink); border-color: var(--wa-muted); }
  .pk-more-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pk-more-btn svg { width: 11px; height: 11px; }
  .pop-menu.pk-more-menu {
    position: absolute; top: calc(100% + 6px); left: 0; right: auto; width: max-content; min-width: 200px; max-width: min(320px, calc(100vw - 16px)); z-index: 6;
    background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
    border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
    display: flex; flex-direction: column; gap: 1px;
  }
  .pk-more-menu .row {
    display: flex; align-items: center; gap: 7px; width: 100%;
    font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; white-space: nowrap;
    background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
  }
  .pk-more-menu .row:hover { background: var(--wa-panel); }
  .pk-more-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pk-more-menu .pk-tab-glyph svg { width: 14px; height: 14px; }
  .pk-more-menu .pk-tab-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Every tab alike but for its device's color (--dc, device-colors.ts) on the
     glyph and the selected one's underline. */
  .pk-tab {
    display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
    padding: 10px 7px; border: 0; background: transparent;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .pk-tab:hover { color: var(--wa-ink); }
  .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
  .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
  .pk-tab svg { width: 15px; height: 15px; }
  .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
  .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
`;export{D as a,de as b,fe as c,E as d,Z as e,ge as f,N as g,he as h,xe as i,H as j,C as k,be as l,u as m,we as n,ye as o,ke as p,ve as q,Le as r,Ie as s,Me as t,Se as u,Re as v,ze as w,De as x,Oe as y,Ae as z,Ce as A,Ee as B,Ne as C,He as D,j as E,Ge as F,F as G,Ke as H,We as I,qe as J,Ue as K,Ve as L,Xe as M,Je as N,Qe as O,Y as P,Ze as Q};
