import{d as R}from"./chunk-6SB6XCX5.js";import{ca as v}from"./chunk-HPMCDO65.js";import{a as x,b as O,f as d,g as m,i as w}from"./chunk-6ZDBXU6B.js";var P={width:126,height:37,top:11},L=[{label:"iPhone 17 Pro",screen:{width:402,height:874},safeTop:62,safeBottom:34,radius:62,island:P},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},safeTop:62,safeBottom:34,radius:62,island:P},{label:"iPhone 15 Pro",screen:{width:393,height:852},safeTop:59,safeBottom:34,radius:55,island:P},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},safeTop:59,safeBottom:34,radius:55,island:P},{label:"iPhone 13 mini",screen:{width:375,height:812},safeTop:50,safeBottom:34,radius:44},{label:"iPhone SE",screen:{width:375,height:667},safeTop:20,safeBottom:0,radius:0}],E=L[0],z=[{label:"Android phone",screen:{width:412,height:915},safeTop:48,safeBottom:24,radius:44,punch:{size:24,top:14}},{label:"Android phone (small)",screen:{width:360,height:800},safeTop:44,safeBottom:24,radius:36,punch:{size:22,top:12}}],j=z[0];function Te(e,n){let r=n==="android",h=r?z:L,t=r?j:E,o=/^(\d+)x(\d+)$/.exec((e??"").trim());if(!o)return t;let s=Number(o[1]),a=Number(o[2]);return h.find(c=>c.screen.width===s&&c.screen.height===a)??t}function G(e){return e.punch!==void 0}var H=6,C=16,F=4,X=C-F,ke=4,Y=430,U=12,Z=32,V=14,N=30,D=5,q=3.5,J=18,Q=6,S=12,$=9,ee=28,oe=46,te=3,A=42,M=16,K=8,ne=44,I=40,ae=16,re=17,se=16,B=68;function ye(e){return e?.phonePageLook==="watch"?"watch":"iphone"}var ie=22;function Ee(e,n){return Math.min(ie,Math.max(4,Math.min(e,n)/3))}function Oe(e,n){return Math.min(F,Math.floor(Math.min(e,n)/6))}var he="var(--wa-phone-grouped, #f1f2f5)",y="var(--wa-phone-ink, #14161a)";function ve(e,n,r){return r==="iphone"?{shown:n>=1,top:!1}:{shown:e?.showPageIndicator!==!1&&n>1,top:e?.pageIndicatorPosition==="Top"}}function Re(e,n){return(e?.pageTitleMode??v(e??{}))==="On"&&n}function pe(e,n){return e&&n.shown?oe:!e&&n.top?V:Z}function He(e=E,n){let{width:r,height:h}=e.screen,t=n?.look==="iphone",o=Math.min(r,Y),s=(r-o)/2,a=e.safeTop,c;n?.switcher===!0&&(c={x:M,y:a,width:r-M*2,height:A},a+=A+K);let l=t?C:H,i=t&&n?.titleRow===!1?0:ne,g={x:s+l,y:a,width:o-l*2,height:i};a+=i+U;let p=pe(t,n?.dots??{shown:!0,top:!1}),u={x:0,y:h-e.safeBottom-p,width:r,height:p},f=t?X:H,_={x:s+f,y:a,width:o-f*2,height:u.y-a};return{model:e,...c===void 0?{}:{switcher:c},...t?{look:"iphone"}:{},topRow:g,area:_,bottomBar:u}}function W(e){return e?.look==="iphone"}function Ne(e){return{width:e.area.width,height:e.area.height}}var de=`Drawn as an ${E.label}. The iPhone does not tell Home Assistant its screen size.`,ce="Drawn as a typical Android phone. Your phone's own screen may be a little taller or wider.";function De(e){return G(e)?ce:de}var Se=.5,le=.024,ue=.009,ge="9:41",b=e=>Math.round(e*100)/100;function fe(e,n){if(e<=$)return Array.from({length:Math.max(e,0)},(h,t)=>t);let r=Math.min(Math.max(n-Math.floor($/2),0),e-$);return Array.from({length:$},(h,t)=>r+t)}function Ae(e,n,r,h=!1){let t=l=>`${b(l*r)}px`;if(h)return d`<span class="wa-phone-dock" style=${`height:${t(N)};padding:0 ${t(S)}`}><span class=${"wa-phone-dock-dot on"} style=${`width:${t(ee)};height:${t(D)}`}></span></span>`;let o=fe(e,n),s=o[0],a=o[o.length-1],c=o.map(l=>{let g=l===s&&l>0||l===a&&l<e-1?q:D,p=l===n;return d`<span class=${`wa-phone-dock-dot${p?" on":""}`} style=${`width:${t(p?J:g)};height:${t(g)}`}></span>`});return d`<span class="wa-phone-dock" style=${`height:${t(N)};padding:0 ${t(S)};gap:${t(Q)}`}>${c}</span>`}function we(e,n,r,h,t){let o=e?.render(n,r,h);return o===void 0?t():d`<svg width=${r} height=${r} viewBox=${`0 0 ${r} ${r}`} aria-hidden="true">${o}</svg>`}function be(e,n,r,h=!1){let{width:t}=e.screen,o=e.island,s=e.punch,a=o===void 0?t/2:(t-o.width)/2,c=s!==void 0?s.top+s.size/2:o===void 0?e.safeTop/2:o.top+o.height/2+2.5,l=s!==void 0?34:o===void 0?24:a/2+5,i=f=>`${b(f*n)}px`,g=h?"currentColor":"#fff",p=m`${[0,1,2,3].map(f=>m`<rect x=${f*4.6} y=${10-(f+1)*2.5} width="3" height=${(f+1)*2.5} rx="0.8" fill="${g}" />`)}`,u=we(h?void 0:r,"wifi",15*n,"#FFFFFF",()=>d`<svg width=${15*n} height=${11*n} viewBox="0 0 15 11" aria-hidden="true">${m`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="${g}" />`}</svg>`);return d`<div class="wa-phone-status" style=${`height:${i(e.safeTop)}`}>
    ${o===void 0?w:d`<span class="wa-phone-island" style=${`left:${i((t-o.width)/2)};top:${i(o.top)};width:${i(o.width)};height:${i(o.height)}`}></span>`}
    ${s===void 0?w:d`<span class="wa-phone-punch" style=${`left:${i((t-s.size)/2)};top:${i(s.top)};width:${i(s.size)};height:${i(s.size)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${i(l)};top:${i(c)};font-size:${i(s===void 0?17:15)}`}>${ge}</span>
    <span class="wa-phone-icons" style=${`right:${i(s===void 0?35:20)};top:${i(c)};gap:${i(6)}`}>
      <svg width=${b(16.8*n)} height=${b(10*n)} viewBox="0 0 16.8 10" aria-hidden="true">${p}</svg>
      ${u}
      <span class="wa-phone-battery" style=${`width:${i(25)};height:${i(12)};border-radius:${i(4)};padding:${i(1.5)}`}><i style=${`border-radius:${i(2.5)}`}></i></span>
    </span>
  </div>`}function me(e,n,r,h,t){let o=p=>`${b(p*n)}px`,s=e.topRow,a=r?"currentColor":"#fff",c=(p,u,f)=>d`<span class=${`wa-phone-glass ${p}`} style=${`width:${o(I)};height:${o(I)}`}>
      <svg width=${b(u*n)} height=${b(u*n)} viewBox="0 0 16 16" aria-hidden="true">${f}</svg>
    </span>`,l=m`${[1.5,9.1].flatMap(p=>[1.5,9.1].map(u=>m`<rect x=${u} y=${p} width="5.4" height="5.4" rx="1.5" fill="none" stroke="${a}" stroke-width="1.6" />`))}`,i=m`<circle cx="8" cy="8" r="6.3" fill="none" stroke="${a}" stroke-width="2.6" stroke-dasharray="2.47 2.48" stroke-dashoffset="1.24" />
    <circle cx="8" cy="8" r="4.3" fill="none" stroke="${a}" stroke-width="3.2" />`;if(s.height===0)return d``;let g=W(e);return d`<div class="wa-phone-top" style=${`height:${o(s.height)};padding:0 ${o(s.x)}`}>
    ${h&&!g?c("wa-phone-grid",ae,l):w}
    ${t===""?w:d`<span class="wa-phone-title" style=${`left:${o(B)};right:${o(B)};font-size:${o(se)}`}><span>${t}</span></span>`}
    ${g?w:c("wa-phone-gear",re,i)}
  </div>`}function xe(e,n,r,h){let t=n,{model:o}=e,s=W(e),a=k=>`${b(k*t)}px`,c=Math.round(o.screen.width*t*le),l=Math.max(2,Math.round(o.screen.width*t*ue)),i=b(o.radius*t),g=o.screen.height*t+c*2,p=k=>`${b(g*k)}px`,u=h?.dots,f=e.switcher===void 0?w:d`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${a(e.switcher.height)};margin:0 ${a(e.switcher.x)} ${a(K)}`}></div>`,_=s?(h?.title??"").trim():"",T=G(o);return d`<div class="wa-phone${s?" ios":""}${s&&h?.ink===!0?" ink":""}${T?" android":""}" aria-label=${h?.label??(T?"Android phone":"iPhone")}
    style=${`--pf-s:${t};--pf-bezel:${c}px;--pf-rim:${l}px;--pf-radius:${i}px;--wf-radius:0px;--pf-left-top:${p(.17)};--pf-left-h:${p(.22)};--pf-right-top:${p(.26)};--pf-right-h:${p(.1)}`}>
    <div class="wa-phone-screen" style=${`width:${a(o.screen.width)};min-height:${a(o.screen.height)}`}>
      ${h?.backdrop===void 0?w:d`<div class="wa-phone-backdrop" aria-hidden="true" style=${`background:${h.backdrop.background}`}>${h.backdrop.layers}</div>`}
      ${be(o,t,h?.icons,s)}
      ${f}
      ${me(e,t,s,h?.grid===!0,_)}
      <div class="wa-phone-gap" style=${`height:${a(U)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${a(e.area.x)};min-height:${a(e.area.height)}`}>
        ${r}
        ${u?.top===!0?d`<span class="wa-phone-dots" style=${`top:${a(te)};height:${a(u.height)}`}>${u.row}</span>`:w}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${a(e.bottomBar.height)}`}>${u?.top===!1?u.row:w}</div>
      <div class="wa-phone-foot" style=${`height:${a(o.safeBottom)}`}>
        ${o.safeBottom>0?d`<span class="wa-phone-home" style=${T?`width:${a(108)};height:${a(4)};bottom:${a(8)}`:`width:${a(134)};height:${a(5)};bottom:${a(8)}`}></span>`:w}
      </div>
    </div>
  </div>`}function Me(e,n,r,h,t,o){return e===void 0?R(n,r,h,t):xe(e,r,h,{label:t,...o===void 0?{}:{icons:o}})}var Ie=O`
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
  /* An Android phone's front camera, a punch hole in the screen. */
  .wa-phone-punch { position: absolute; border-radius: 50%; background: #000; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06); }
  /* An Android phone's status bar time sits by its left edge, not centred in
     an ear beside an island. */
  .wa-phone.android .wa-phone-time { transform: translate(0, -50%); font-weight: 500; }
  /* An Android phone carries its buttons on the right only: no Action button. */
  .wa-phone.android::before { display: none; }
  .wa-phone.android .wa-phone-screen { font-family: "Roboto", system-ui, sans-serif; }
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
  .wa-phone.ios .wa-phone-screen { background: ${x(he)}; color: ${x(y)}; }
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
  .wa-phone.ios .wp-fold { border-top-color: color-mix(in srgb, ${x(y)} 45%, transparent); }
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
  .wa-phone-dock-dot.on { background: ${x(y)}; }
`;export{Te as a,G as b,H as c,C as d,F as e,X as f,ke as g,N as h,ye as i,Ee as j,Oe as k,he as l,y as m,ve as n,Re as o,He as p,W as q,Ne as r,de as s,ce as t,De as u,Se as v,le as w,ue as x,Ae as y,xe as z,Me as A,Ie as B};
