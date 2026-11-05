import{d as y,p as k}from"./chunk-7I2PKYAI.js";import{a as m,b as E,f as l,g as b,i as w}from"./chunk-6ZDBXU6B.js";var x={width:126,height:37,top:11},D=[{label:"iPhone 17 Pro",screen:{width:402,height:874},safeTop:62,safeBottom:34,radius:62,island:x},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},safeTop:62,safeBottom:34,radius:62,island:x},{label:"iPhone 15 Pro",screen:{width:393,height:852},safeTop:59,safeBottom:34,radius:55,island:x},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},safeTop:59,safeBottom:34,radius:55,island:x},{label:"iPhone 13 mini",screen:{width:375,height:812},safeTop:50,safeBottom:34,radius:44},{label:"iPhone SE",screen:{width:375,height:667},safeTop:20,safeBottom:0,radius:0}],$=D[0];function we(e){let t=/^(\d+)x(\d+)$/.exec((e??"").trim());if(!t)return $;let s=Number(t[1]),a=Number(t[2]);return D.find(n=>n.screen.width===s&&n.screen.height===a)??$}var O=6,M=16,G=4,F=M-G,be=4,z=430,A=12,U=32,K=14,B=38,W=6,j=4,X=16,Y=5,Z=15,P=9,V=B+8,q=3,H=42,N=16,L=8,R=44,S=40,J=16,Q=17,ee=16,I=68;function me(e){return e?.phonePageLook==="watch"?"watch":"iphone"}function xe(e){let t=e?.phoneTileGap;return t==="small"||t==="medium"||t==="large"?t:k}var te=22;function Pe(e,t){return Math.min(te,Math.max(4,Math.min(e,t)/3))}function $e(e,t){return Math.min(G,Math.floor(Math.min(e,t)/6))}var oe="var(--wa-phone-grouped, #f1f2f5)",v="var(--wa-phone-ink, #14161a)";function _e(e,t){return{shown:e?.showPageIndicator!==!1&&t>1,top:e?.pageIndicatorPosition==="Top"}}function ne(e,t){return e&&t.shown?V:!e&&t.top?K:U}function Te(e=$,t){let{width:s,height:a}=e.screen,n=t?.look==="iphone",o=Math.min(s,z),d=(s-o)/2,r=e.safeTop,h;t?.switcher===!0&&(h={x:N,y:r,width:s-N*2,height:H},r+=H+L);let i=n?M:O,u={x:d+i,y:r,width:o-i*2,height:R};r+=R+A;let c=ne(n,t?.dots??{shown:!0,top:!1}),g={x:0,y:a-e.safeBottom-c,width:s,height:c},p=n?F:O,_={x:d+p,y:r,width:o-p*2,height:g.y-r};return{model:e,...h===void 0?{}:{switcher:h},...n?{look:"iphone"}:{},...t?.tileGap===void 0||t.tileGap===k?{}:{tileGap:t.tileGap},topRow:u,area:_,bottomBar:g}}function ae(e){return e?.look==="iphone"}function ke(e){return{width:e.area.width,height:e.area.height}}var ve=`Drawn as an ${$.label}. The iPhone does not tell Home Assistant its screen size.`,Ee=.5,re=.024,se=.009,ie="9:41",f=e=>Math.round(e*100)/100;function he(e,t){if(e<=P)return Array.from({length:Math.max(e,0)},(a,n)=>n);let s=Math.min(Math.max(t-Math.floor(P/2),0),e-P);return Array.from({length:P},(a,n)=>s+n)}function ye(e,t,s){let a=h=>`${f(h*s)}px`,n=he(e,t),o=n[0],d=n[n.length-1],r=n.map(h=>{let u=h===o&&h>0||h===d&&h<e-1?j:W,c=h===t;return l`<span class=${`wa-phone-dock-dot${c?" on":""}`} style=${`width:${a(c?X:u)};height:${a(u)}`}></span>`});return l`<span class="wa-phone-dock" style=${`height:${a(B)};padding:0 ${a(Z)};gap:${a(Y)}`}>${r}</span>`}function pe(e,t,s,a,n){let o=e?.render(t,s,a);return o===void 0?n():l`<svg width=${s} height=${s} viewBox=${`0 0 ${s} ${s}`} aria-hidden="true">${o}</svg>`}function de(e,t,s,a=!1){let{width:n}=e.screen,o=e.island,d=o===void 0?n/2:(n-o.width)/2,r=o===void 0?e.safeTop/2:o.top+o.height/2+2.5,h=o===void 0?24:d/2+5,i=p=>`${f(p*t)}px`,u=a?"currentColor":"#fff",c=b`${[0,1,2,3].map(p=>b`<rect x=${p*4.6} y=${10-(p+1)*2.5} width="3" height=${(p+1)*2.5} rx="0.8" fill="${u}" />`)}`,g=pe(a?void 0:s,"wifi",15*t,"#FFFFFF",()=>l`<svg width=${15*t} height=${11*t} viewBox="0 0 15 11" aria-hidden="true">${b`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="${u}" />`}</svg>`);return l`<div class="wa-phone-status" style=${`height:${i(e.safeTop)}`}>
    ${o===void 0?w:l`<span class="wa-phone-island" style=${`left:${i((n-o.width)/2)};top:${i(o.top)};width:${i(o.width)};height:${i(o.height)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${i(h)};top:${i(r)};font-size:${i(17)}`}>${ie}</span>
    <span class="wa-phone-icons" style=${`right:${i(35)};top:${i(r)};gap:${i(6)}`}>
      <svg width=${f(16.8*t)} height=${f(10*t)} viewBox="0 0 16.8 10" aria-hidden="true">${c}</svg>
      ${g}
      <span class="wa-phone-battery" style=${`width:${i(25)};height:${i(12)};border-radius:${i(4)};padding:${i(1.5)}`}><i style=${`border-radius:${i(2.5)}`}></i></span>
    </span>
  </div>`}function ce(e,t,s,a,n){let o=c=>`${f(c*t)}px`,d=e.topRow,r=s?"currentColor":"#fff",h=(c,g,p)=>l`<span class=${`wa-phone-glass ${c}`} style=${`width:${o(S)};height:${o(S)}`}>
      <svg width=${f(g*t)} height=${f(g*t)} viewBox="0 0 16 16" aria-hidden="true">${p}</svg>
    </span>`,i=b`${[1.5,9.1].flatMap(c=>[1.5,9.1].map(g=>b`<rect x=${g} y=${c} width="5.4" height="5.4" rx="1.5" fill="none" stroke="${r}" stroke-width="1.6" />`))}`,u=b`<circle cx="8" cy="8" r="6.3" fill="none" stroke="${r}" stroke-width="2.6" stroke-dasharray="2.47 2.48" stroke-dashoffset="1.24" />
    <circle cx="8" cy="8" r="4.3" fill="none" stroke="${r}" stroke-width="3.2" />`;return l`<div class="wa-phone-top" style=${`height:${o(d.height)};padding:0 ${o(d.x)}`}>
    ${a?h("wa-phone-grid",J,i):w}
    ${n===""?w:l`<span class="wa-phone-title" style=${`left:${o(I)};right:${o(I)};font-size:${o(ee)}`}><span>${n}</span></span>`}
    ${h("wa-phone-gear",Q,u)}
  </div>`}function le(e,t,s,a){let n=t,{model:o}=e,d=ae(e),r=T=>`${f(T*n)}px`,h=Math.round(o.screen.width*n*re),i=Math.max(2,Math.round(o.screen.width*n*se)),u=f(o.radius*n),c=o.screen.height*n+h*2,g=T=>`${f(c*T)}px`,p=a?.dots,_=e.switcher===void 0?w:l`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${r(e.switcher.height)};margin:0 ${r(e.switcher.x)} ${r(L)}`}></div>`,C=d?(a?.title??"").trim():"";return l`<div class="wa-phone${d?" ios":""}${d&&a?.ink===!0?" ink":""}" aria-label=${a?.label??"iPhone"}
    style=${`--pf-s:${n};--pf-bezel:${h}px;--pf-rim:${i}px;--pf-radius:${u}px;--wf-radius:0px;--pf-left-top:${g(.17)};--pf-left-h:${g(.22)};--pf-right-top:${g(.26)};--pf-right-h:${g(.1)}`}>
    <div class="wa-phone-screen" style=${`width:${r(o.screen.width)};min-height:${r(o.screen.height)}`}>
      ${a?.backdrop===void 0?w:l`<div class="wa-phone-backdrop" aria-hidden="true" style=${`background:${a.backdrop.background}`}>${a.backdrop.layers}</div>`}
      ${de(o,n,a?.icons,d)}
      ${_}
      ${ce(e,n,d,a?.grid===!0,C)}
      <div class="wa-phone-gap" style=${`height:${r(A)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${r(e.area.x)};min-height:${r(e.area.height)}`}>
        ${s}
        ${p?.top===!0?l`<span class="wa-phone-dots" style=${`top:${r(q)};height:${r(p.height)}`}>${p.row}</span>`:w}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${r(e.bottomBar.height)}`}>${p?.top===!1?p.row:w}</div>
      <div class="wa-phone-foot" style=${`height:${r(o.safeBottom)}`}>
        ${o.safeBottom>0?l`<span class="wa-phone-home" style=${`width:${r(134)};height:${r(5)};bottom:${r(8)}`}></span>`:w}
      </div>
    </div>
  </div>`}function Oe(e,t,s,a,n,o){return e===void 0?y(t,s,a,n):le(e,s,a,{label:n,...o===void 0?{}:{icons:o}})}var He=E`
  .wa-phone {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: content-box;
    padding: var(--pf-bezel, 10px);
    margin: var(--pf-rim, 3px) calc(var(--pf-rim, 3px) + 3px);
    border-radius: calc(var(--pf-radius, 46px) + var(--pf-bezel, 10px));
    background: #050608;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.05),
      0 0 0 var(--pf-rim, 3px) var(--wa-art-case, #2b2f3d),
      0 0 0 calc(var(--pf-rim, 3px) + 1px) rgba(255, 255, 255, 0.1),
      0 14px 34px rgba(0, 0, 0, 0.4);
  }
  /* The side buttons, just outside the rim: on the left the Action button
     and the volume pair (one strip, cut in three), on the right the side
     button. */
  .wa-phone::before,
  .wa-phone::after {
    content: "";
    position: absolute;
    width: 3px;
    pointer-events: none;
  }
  .wa-phone::before {
    right: calc(100% + var(--pf-rim, 3px));
    top: var(--pf-left-top, 17%);
    height: var(--pf-left-h, 22%);
    border-radius: 2px 0 0 2px;
    background: linear-gradient(
      to bottom,
      var(--wa-art-case, #2b2f3d) 0 14%, transparent 14% 36%,
      var(--wa-art-case, #2b2f3d) 36% 64%, transparent 64% 73%,
      var(--wa-art-case, #2b2f3d) 73% 100%
    );
  }
  .wa-phone::after {
    left: calc(100% + var(--pf-rim, 3px));
    top: var(--pf-right-top, 26%);
    height: var(--pf-right-h, 10%);
    border-radius: 0 2px 2px 0;
    background: var(--wa-art-case, #2b2f3d);
  }
  .wa-phone-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--pf-radius, 46px);
    background: #131316;
    color: #fff;
    font-family: "SF Pro Text", "SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wa-phone-screen > * { flex: none; }
  /* The page's background behind everything on the screen: its own stacking
     layer under the status bar, the top row, the pages and the dock. */
  .wa-phone-screen { isolation: isolate; }
  .wa-phone-backdrop { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
  .wa-phone-status { position: relative; }
  .wa-phone-island { position: absolute; border-radius: 999px; background: #000; }
  .wa-phone-time { position: absolute; transform: translate(-50%, -50%); font-weight: 600; line-height: 1; letter-spacing: -0.01em; }
  .wa-phone-icons { position: absolute; display: flex; align-items: center; transform: translateY(-50%); }
  .wa-phone-icons svg { display: block; }
  .wa-phone-battery { display: flex; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, 0.45); }
  .wa-phone-battery i { flex: 1; background: #fff; }
  .wa-phone-switcher { border-radius: 999px; background: #222328; }
  .wa-phone-area { position: relative; display: flex; flex-direction: column; }
  .wa-phone-area > * { flex: none; }
  /* The page code's own system font on the phone is SF Pro, not the watch's
     SF Compact. */
  .wa-phone-area .wp-screen { font-family: "SF Pro Text", "SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .wa-phone-dots { position: absolute; left: 0; right: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 4; }
  .wa-phone-dots-bar { display: flex; align-items: center; justify-content: center; }
  /* The top row: two round glass buttons at its ends, dark glass on the
     Watch look's dark screen, and the page's name centred between them. */
  .wa-phone-top { position: relative; display: flex; align-items: center; box-sizing: border-box; }
  .wa-phone-glass {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 50%;
    background: rgba(44, 46, 51, 0.52);
    box-shadow: inset 0 0 0 1px rgba(242, 246, 252, 0.08), 0 4px 12px rgba(0, 0, 0, 0.18);
  }
  .wa-phone-glass svg { display: block; opacity: 0.92; }
  .wa-phone-gear { margin-left: auto; }
  .wa-phone-title {
    position: absolute; top: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-weight: 600; line-height: 1.2; letter-spacing: -0.01em;
  }
  .wa-phone-title > span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .wa-phone-foot { position: relative; }
  .wa-phone-home { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 999px; background: rgba(255, 255, 255, 0.7); }
  /* The iPhone look: the screen on the app's graphite ground in its ink,
     light or dark with the panel's skin, and the top row's glass, battery
     and home bar in the same skin. The glass (PhoneGlass) is the vault's
     wash with a half point rim, brighter at its top, and a soft shadow
     5 points down. */
  .wa-phone.ios .wa-phone-screen { background: ${m(oe)}; color: ${m(v)}; }
  .wa-phone.ios .wa-phone-glass,
  .wa-phone-dock {
    background: var(--wa-phone-glass, rgba(255, 255, 255, 0.74));
    box-shadow:
      inset 0 0.5px 0 var(--wa-phone-glass-rim-top, rgba(255, 255, 255, 0.9)),
      inset 0 0 0 0.5px var(--wa-phone-glass-rim, rgba(20, 22, 26, 0.07)),
      0 calc(5px * var(--pf-s, 1)) calc(16px * var(--pf-s, 1)) var(--wa-phone-glass-shadow, rgba(28, 34, 48, 0.18));
  }
  .wa-phone.ios .wa-phone-battery { border-color: color-mix(in srgb, currentColor 45%, transparent); }
  .wa-phone.ios .wa-phone-battery i { background: currentColor; }
  .wa-phone.ios .wa-phone-home { background: currentColor; opacity: 0.7; }
  .wa-phone.ios .wp-fold { border-top-color: color-mix(in srgb, ${m(v)} 45%, transparent); }
  /* Over a page with its own background the app draws its chrome dark in
     either skin (chromeScheme): the vault's dark glass and ink. */
  .wa-phone.ios:not(.ink) .wa-phone-top,
  .wa-phone.ios:not(.ink) .wa-phone-dots-bar {
    --wa-phone-ink: #f2f4f7;
    --wa-phone-glass: rgba(44, 46, 51, 0.52);
    --wa-phone-glass-rim: rgba(242, 246, 252, 0.08);
    --wa-phone-glass-rim-top: rgba(242, 246, 252, 0.16);
    --wa-phone-glass-shadow: rgba(0, 0, 0, 0.32);
    --wa-phone-dock-dot: rgba(232, 236, 242, 0.38);
    color: var(--wa-phone-ink);
  }
  /* The dock: its dots in a row, the current page's pill in the ink. */
  .wa-phone-dock { display: inline-flex; align-items: center; box-sizing: border-box; border-radius: 999px; }
  .wa-phone-dock-dot { flex: none; border-radius: 999px; background: var(--wa-phone-dock-dot, rgba(20, 22, 26, 0.22)); }
  .wa-phone-dock-dot.on { background: ${m(v)}; }
`;export{we as a,O as b,M as c,G as d,F as e,be as f,B as g,me as h,xe as i,Pe as j,$e as k,oe as l,v as m,_e as n,Te as o,ae as p,ke as q,ve as r,Ee as s,re as t,se as u,ye as v,le as w,Oe as x,He as y};
