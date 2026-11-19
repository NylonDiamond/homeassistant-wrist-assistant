import{d as y}from"./chunk-WSJCLENX.js";import{a as x,b as v,f as c,g as m,i as g}from"./chunk-6ZDBXU6B.js";var P={width:126,height:37,top:11},A=[{label:"iPhone 17 Pro",screen:{width:402,height:874},safeTop:62,safeBottom:34,radius:62,island:P},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},safeTop:62,safeBottom:34,radius:62,island:P},{label:"iPhone 15 Pro",screen:{width:393,height:852},safeTop:59,safeBottom:34,radius:55,island:P},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},safeTop:59,safeBottom:34,radius:55,island:P},{label:"iPhone 13 mini",screen:{width:375,height:812},safeTop:50,safeBottom:34,radius:44},{label:"iPhone SE",screen:{width:375,height:667},safeTop:20,safeBottom:0,radius:0}],E=A[0],M=[{label:"Android phone",screen:{width:412,height:915},safeTop:48,safeBottom:24,radius:44,punch:{size:24,top:14}},{label:"Android phone (small)",screen:{width:360,height:800},safeTop:44,safeBottom:24,radius:36,punch:{size:22,top:12}}],U=M[0];function Pe(e,n){let h=n==="android",a=h?M:A,t=h?U:E,o=/^(\d+)x(\d+)$/.exec((e??"").trim());if(!o)return t;let i=Number(o[1]),r=Number(o[2]);return a.find(p=>p.screen.width===i&&p.screen.height===r)??t}function I(e){return e.punch!==void 0}var O=6,B=16,L=4,K=B-L,$e=4,W=430,z=12,j=32,X=14,G=38,Y=6,Z=4,V=16,q=5,J=15,$=9,Q=G+8,ee=3,N=42,H=16,C=8,R=44,S=40,oe=16,te=17,ne=16,D=68;function _e(e){return e?.phonePageLook==="watch"?"watch":"iphone"}var re=22;function Te(e,n){return Math.min(re,Math.max(4,Math.min(e,n)/3))}function ke(e,n){return Math.min(L,Math.floor(Math.min(e,n)/6))}var ae="var(--wa-phone-grouped, #f1f2f5)",k="var(--wa-phone-ink, #14161a)";function Ee(e,n){return{shown:e?.showPageIndicator!==!1&&n>1,top:e?.pageIndicatorPosition==="Top"}}function se(e,n){return e&&n.shown?Q:!e&&n.top?X:j}function ve(e=E,n){let{width:h,height:a}=e.screen,t=n?.look==="iphone",o=Math.min(h,W),i=(h-o)/2,r=e.safeTop,p;n?.switcher===!0&&(p={x:H,y:r,width:h-H*2,height:N},r+=N+C);let w=t?B:O,s={x:i+w,y:r,width:o-w*2,height:R};r+=R+z;let d=se(t,n?.dots??{shown:!0,top:!1}),l={x:0,y:a-e.safeBottom-d,width:h,height:d},u=t?K:O,b={x:i+u,y:r,width:o-u*2,height:l.y-r};return{model:e,...p===void 0?{}:{switcher:p},...t?{look:"iphone"}:{},topRow:s,area:b,bottomBar:l}}function ie(e){return e?.look==="iphone"}function ye(e){return{width:e.area.width,height:e.area.height}}var he=`Drawn as an ${E.label}. The iPhone does not tell Home Assistant its screen size.`,pe="Drawn as a typical Android phone. Your phone's own screen may be a little taller or wider.";function Oe(e){return I(e)?pe:he}var Ne=.5,de=.024,ce=.009,le="9:41",f=e=>Math.round(e*100)/100;function ue(e,n){if(e<=$)return Array.from({length:Math.max(e,0)},(a,t)=>t);let h=Math.min(Math.max(n-Math.floor($/2),0),e-$);return Array.from({length:$},(a,t)=>h+t)}function He(e,n,h){let a=p=>`${f(p*h)}px`,t=ue(e,n),o=t[0],i=t[t.length-1],r=t.map(p=>{let s=p===o&&p>0||p===i&&p<e-1?Z:Y,d=p===n;return c`<span class=${`wa-phone-dock-dot${d?" on":""}`} style=${`width:${a(d?V:s)};height:${a(s)}`}></span>`});return c`<span class="wa-phone-dock" style=${`height:${a(G)};padding:0 ${a(J)};gap:${a(q)}`}>${r}</span>`}function ge(e,n,h,a,t){let o=e?.render(n,h,a);return o===void 0?t():c`<svg width=${h} height=${h} viewBox=${`0 0 ${h} ${h}`} aria-hidden="true">${o}</svg>`}function fe(e,n,h,a=!1){let{width:t}=e.screen,o=e.island,i=e.punch,r=o===void 0?t/2:(t-o.width)/2,p=i!==void 0?i.top+i.size/2:o===void 0?e.safeTop/2:o.top+o.height/2+2.5,w=i!==void 0?34:o===void 0?24:r/2+5,s=b=>`${f(b*n)}px`,d=a?"currentColor":"#fff",l=m`${[0,1,2,3].map(b=>m`<rect x=${b*4.6} y=${10-(b+1)*2.5} width="3" height=${(b+1)*2.5} rx="0.8" fill="${d}" />`)}`,u=ge(a?void 0:h,"wifi",15*n,"#FFFFFF",()=>c`<svg width=${15*n} height=${11*n} viewBox="0 0 15 11" aria-hidden="true">${m`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="${d}" />`}</svg>`);return c`<div class="wa-phone-status" style=${`height:${s(e.safeTop)}`}>
    ${o===void 0?g:c`<span class="wa-phone-island" style=${`left:${s((t-o.width)/2)};top:${s(o.top)};width:${s(o.width)};height:${s(o.height)}`}></span>`}
    ${i===void 0?g:c`<span class="wa-phone-punch" style=${`left:${s((t-i.size)/2)};top:${s(i.top)};width:${s(i.size)};height:${s(i.size)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${s(w)};top:${s(p)};font-size:${s(i===void 0?17:15)}`}>${le}</span>
    <span class="wa-phone-icons" style=${`right:${s(i===void 0?35:20)};top:${s(p)};gap:${s(6)}`}>
      <svg width=${f(16.8*n)} height=${f(10*n)} viewBox="0 0 16.8 10" aria-hidden="true">${l}</svg>
      ${u}
      <span class="wa-phone-battery" style=${`width:${s(25)};height:${s(12)};border-radius:${s(4)};padding:${s(1.5)}`}><i style=${`border-radius:${s(2.5)}`}></i></span>
    </span>
  </div>`}function we(e,n,h,a,t){let o=d=>`${f(d*n)}px`,i=e.topRow,r=h?"currentColor":"#fff",p=(d,l,u)=>c`<span class=${`wa-phone-glass ${d}`} style=${`width:${o(S)};height:${o(S)}`}>
      <svg width=${f(l*n)} height=${f(l*n)} viewBox="0 0 16 16" aria-hidden="true">${u}</svg>
    </span>`,w=m`${[1.5,9.1].flatMap(d=>[1.5,9.1].map(l=>m`<rect x=${l} y=${d} width="5.4" height="5.4" rx="1.5" fill="none" stroke="${r}" stroke-width="1.6" />`))}`,s=m`<circle cx="8" cy="8" r="6.3" fill="none" stroke="${r}" stroke-width="2.6" stroke-dasharray="2.47 2.48" stroke-dashoffset="1.24" />
    <circle cx="8" cy="8" r="4.3" fill="none" stroke="${r}" stroke-width="3.2" />`;return c`<div class="wa-phone-top" style=${`height:${o(i.height)};padding:0 ${o(i.x)}`}>
    ${a?p("wa-phone-grid",oe,w):g}
    ${t===""?g:c`<span class="wa-phone-title" style=${`left:${o(D)};right:${o(D)};font-size:${o(ne)}`}><span>${t}</span></span>`}
    ${p("wa-phone-gear",te,s)}
  </div>`}function be(e,n,h,a){let t=n,{model:o}=e,i=ie(e),r=T=>`${f(T*t)}px`,p=Math.round(o.screen.width*t*de),w=Math.max(2,Math.round(o.screen.width*t*ce)),s=f(o.radius*t),d=o.screen.height*t+p*2,l=T=>`${f(d*T)}px`,u=a?.dots,b=e.switcher===void 0?g:c`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${r(e.switcher.height)};margin:0 ${r(e.switcher.x)} ${r(C)}`}></div>`,F=i?(a?.title??"").trim():"",_=I(o);return c`<div class="wa-phone${i?" ios":""}${i&&a?.ink===!0?" ink":""}${_?" android":""}" aria-label=${a?.label??(_?"Android phone":"iPhone")}
    style=${`--pf-s:${t};--pf-bezel:${p}px;--pf-rim:${w}px;--pf-radius:${s}px;--wf-radius:0px;--pf-left-top:${l(.17)};--pf-left-h:${l(.22)};--pf-right-top:${l(.26)};--pf-right-h:${l(.1)}`}>
    <div class="wa-phone-screen" style=${`width:${r(o.screen.width)};min-height:${r(o.screen.height)}`}>
      ${a?.backdrop===void 0?g:c`<div class="wa-phone-backdrop" aria-hidden="true" style=${`background:${a.backdrop.background}`}>${a.backdrop.layers}</div>`}
      ${fe(o,t,a?.icons,i)}
      ${b}
      ${we(e,t,i,a?.grid===!0,F)}
      <div class="wa-phone-gap" style=${`height:${r(z)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${r(e.area.x)};min-height:${r(e.area.height)}`}>
        ${h}
        ${u?.top===!0?c`<span class="wa-phone-dots" style=${`top:${r(ee)};height:${r(u.height)}`}>${u.row}</span>`:g}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${r(e.bottomBar.height)}`}>${u?.top===!1?u.row:g}</div>
      <div class="wa-phone-foot" style=${`height:${r(o.safeBottom)}`}>
        ${o.safeBottom>0?c`<span class="wa-phone-home" style=${_?`width:${r(108)};height:${r(4)};bottom:${r(8)}`:`width:${r(134)};height:${r(5)};bottom:${r(8)}`}></span>`:g}
      </div>
    </div>
  </div>`}function Re(e,n,h,a,t,o){return e===void 0?y(n,h,a,t):be(e,h,a,{label:t,...o===void 0?{}:{icons:o}})}var Se=v`
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
  .wa-phone.ios .wa-phone-screen { background: ${x(ae)}; color: ${x(k)}; }
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
  .wa-phone.ios .wp-fold { border-top-color: color-mix(in srgb, ${x(k)} 45%, transparent); }
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
  .wa-phone-dock-dot.on { background: ${x(k)}; }
`;export{Pe as a,I as b,O as c,B as d,L as e,K as f,$e as g,G as h,_e as i,Te as j,ke as k,ae as l,k as m,Ee as n,ve as o,ie as p,ye as q,he as r,pe as s,Oe as t,Ne as u,de as v,ce as w,He as x,be as y,Re as z,Se as A};
