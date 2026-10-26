import{a as E}from"./chunk-I4HMLGWJ.js";import{a as m,b as v,d as l,e as b,g as w}from"./chunk-WG6SQUIV.js";var x={width:126,height:37,top:11},I=[{label:"iPhone 17 Pro",screen:{width:402,height:874},safeTop:62,safeBottom:34,radius:62,island:x},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},safeTop:62,safeBottom:34,radius:62,island:x},{label:"iPhone 15 Pro",screen:{width:393,height:852},safeTop:59,safeBottom:34,radius:55,island:x},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},safeTop:59,safeBottom:34,radius:55,island:x},{label:"iPhone 13 mini",screen:{width:375,height:812},safeTop:50,safeBottom:34,radius:44},{label:"iPhone SE",screen:{width:375,height:667},safeTop:20,safeBottom:0,radius:0}],$=I[0];function ue(e){let o=/^(\d+)x(\d+)$/.exec((e??"").trim());if(!o)return $;let s=Number(o[1]),a=Number(o[2]);return I.find(n=>n.screen.width===s&&n.screen.height===a)??$}var y=6,M=16,D=4,C=M-D,fe=4,F=430,A=12,z=32,U=14,B=38,K=6,W=4,j=16,X=5,Y=15,P=9,Z=B+8,V=3,O=42,H=16,L=8,N=44,R=40,q=16,J=17,Q=16,S=68;function we(e){return e?.phonePageLook==="watch"?"watch":"iphone"}var ee=22;function be(e,o){return Math.min(ee,Math.max(4,Math.round(Math.min(e,o)/3)))}function me(e,o){return Math.min(D,Math.floor(Math.min(e,o)/6))}var te="var(--wa-phone-grouped, #f1f2f5)",T="var(--wa-phone-ink, #14161a)";function xe(e,o){return{shown:e?.showPageIndicator!==!1&&o>1,top:e?.pageIndicatorPosition==="Top"}}function oe(e,o){return e&&o.shown?Z:!e&&o.top?U:z}function Pe(e=$,o){let{width:s,height:a}=e.screen,n=o?.look==="iphone",t=Math.min(s,F),d=(s-t)/2,r=e.safeTop,h;o?.switcher===!0&&(h={x:H,y:r,width:s-H*2,height:O},r+=O+L);let i=n?M:y,u={x:d+i,y:r,width:t-i*2,height:N};r+=N+A;let c=oe(n,o?.dots??{shown:!0,top:!1}),g={x:0,y:a-e.safeBottom-c,width:s,height:c},p=n?C:y,_={x:d+p,y:r,width:t-p*2,height:g.y-r};return{model:e,...h===void 0?{}:{switcher:h},...n?{look:"iphone"}:{},topRow:u,area:_,bottomBar:g}}function ne(e){return e?.look==="iphone"}function $e(e){return{width:e.area.width,height:e.area.height}}var _e=`Drawn as an ${$.label}. The iPhone does not tell Home Assistant its screen size.`,ke=.5,ae=.024,re=.009,se="9:41",f=e=>Math.round(e*100)/100;function ie(e,o){if(e<=P)return Array.from({length:Math.max(e,0)},(a,n)=>n);let s=Math.min(Math.max(o-Math.floor(P/2),0),e-P);return Array.from({length:P},(a,n)=>s+n)}function Te(e,o,s){let a=h=>`${f(h*s)}px`,n=ie(e,o),t=n[0],d=n[n.length-1],r=n.map(h=>{let u=h===t&&h>0||h===d&&h<e-1?W:K,c=h===o;return l`<span class=${`wa-phone-dock-dot${c?" on":""}`} style=${`width:${a(c?j:u)};height:${a(u)}`}></span>`});return l`<span class="wa-phone-dock" style=${`height:${a(B)};padding:0 ${a(Y)};gap:${a(X)}`}>${r}</span>`}function he(e,o,s,a,n){let t=e?.render(o,s,a);return t===void 0?n():l`<svg width=${s} height=${s} viewBox=${`0 0 ${s} ${s}`} aria-hidden="true">${t}</svg>`}function pe(e,o,s,a=!1){let{width:n}=e.screen,t=e.island,d=t===void 0?n/2:(n-t.width)/2,r=t===void 0?e.safeTop/2:t.top+t.height/2+2.5,h=t===void 0?24:d/2+5,i=p=>`${f(p*o)}px`,u=a?"currentColor":"#fff",c=b`${[0,1,2,3].map(p=>b`<rect x=${p*4.6} y=${10-(p+1)*2.5} width="3" height=${(p+1)*2.5} rx="0.8" fill="${u}" />`)}`,g=he(a?void 0:s,"wifi",15*o,"#FFFFFF",()=>l`<svg width=${15*o} height=${11*o} viewBox="0 0 15 11" aria-hidden="true">${b`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="${u}" />`}</svg>`);return l`<div class="wa-phone-status" style=${`height:${i(e.safeTop)}`}>
    ${t===void 0?w:l`<span class="wa-phone-island" style=${`left:${i((n-t.width)/2)};top:${i(t.top)};width:${i(t.width)};height:${i(t.height)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${i(h)};top:${i(r)};font-size:${i(17)}`}>${se}</span>
    <span class="wa-phone-icons" style=${`right:${i(35)};top:${i(r)};gap:${i(6)}`}>
      <svg width=${f(16.8*o)} height=${f(10*o)} viewBox="0 0 16.8 10" aria-hidden="true">${c}</svg>
      ${g}
      <span class="wa-phone-battery" style=${`width:${i(25)};height:${i(12)};border-radius:${i(4)};padding:${i(1.5)}`}><i style=${`border-radius:${i(2.5)}`}></i></span>
    </span>
  </div>`}function de(e,o,s,a,n){let t=c=>`${f(c*o)}px`,d=e.topRow,r=s?"currentColor":"#fff",h=(c,g,p)=>l`<span class=${`wa-phone-glass ${c}`} style=${`width:${t(R)};height:${t(R)}`}>
      <svg width=${f(g*o)} height=${f(g*o)} viewBox="0 0 16 16" aria-hidden="true">${p}</svg>
    </span>`,i=b`${[1.5,9.1].flatMap(c=>[1.5,9.1].map(g=>b`<rect x=${g} y=${c} width="5.4" height="5.4" rx="1.5" fill="none" stroke="${r}" stroke-width="1.6" />`))}`,u=b`<circle cx="8" cy="8" r="6.3" fill="none" stroke="${r}" stroke-width="2.6" stroke-dasharray="2.47 2.48" stroke-dashoffset="1.24" />
    <circle cx="8" cy="8" r="4.3" fill="none" stroke="${r}" stroke-width="3.2" />`;return l`<div class="wa-phone-top" style=${`height:${t(d.height)};padding:0 ${t(d.x)}`}>
    ${a?h("wa-phone-grid",q,i):w}
    ${n===""?w:l`<span class="wa-phone-title" style=${`left:${t(S)};right:${t(S)};font-size:${t(Q)}`}><span>${n}</span></span>`}
    ${h("wa-phone-gear",J,u)}
  </div>`}function ce(e,o,s,a){let n=o,{model:t}=e,d=ne(e),r=k=>`${f(k*n)}px`,h=Math.round(t.screen.width*n*ae),i=Math.max(2,Math.round(t.screen.width*n*re)),u=f(t.radius*n),c=t.screen.height*n+h*2,g=k=>`${f(c*k)}px`,p=a?.dots,_=e.switcher===void 0?w:l`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${r(e.switcher.height)};margin:0 ${r(e.switcher.x)} ${r(L)}`}></div>`,G=d?(a?.title??"").trim():"";return l`<div class="wa-phone${d?" ios":""}${d&&a?.ink===!0?" ink":""}" aria-label=${a?.label??"iPhone"}
    style=${`--pf-s:${n};--pf-bezel:${h}px;--pf-rim:${i}px;--pf-radius:${u}px;--wf-radius:0px;--pf-left-top:${g(.17)};--pf-left-h:${g(.22)};--pf-right-top:${g(.26)};--pf-right-h:${g(.1)}`}>
    <div class="wa-phone-screen" style=${`width:${r(t.screen.width)};min-height:${r(t.screen.height)}`}>
      ${a?.backdrop===void 0?w:l`<div class="wa-phone-backdrop" aria-hidden="true" style=${`background:${a.backdrop.background}`}>${a.backdrop.layers}</div>`}
      ${pe(t,n,a?.icons,d)}
      ${_}
      ${de(e,n,d,a?.grid===!0,G)}
      <div class="wa-phone-gap" style=${`height:${r(A)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${r(e.area.x)};min-height:${r(e.area.height)}`}>
        ${s}
        ${p?.top===!0?l`<span class="wa-phone-dots" style=${`top:${r(V)};height:${r(p.height)}`}>${p.row}</span>`:w}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${r(e.bottomBar.height)}`}>${p?.top===!1?p.row:w}</div>
      <div class="wa-phone-foot" style=${`height:${r(t.safeBottom)}`}>
        ${t.safeBottom>0?l`<span class="wa-phone-home" style=${`width:${r(134)};height:${r(5)};bottom:${r(8)}`}></span>`:w}
      </div>
    </div>
  </div>`}function ve(e,o,s,a,n,t){return e===void 0?E(o,s,a,n):ce(e,s,a,{label:n,...t===void 0?{}:{icons:t}})}var Ee=v`
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
  .wa-phone.ios .wa-phone-screen { background: ${m(te)}; color: ${m(T)}; }
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
  .wa-phone.ios .wp-fold { border-top-color: color-mix(in srgb, ${m(T)} 45%, transparent); }
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
  .wa-phone-dock-dot.on { background: ${m(T)}; }
`;export{ue as a,y as b,M as c,D as d,C as e,fe as f,B as g,we as h,be as i,me as j,te as k,T as l,xe as m,Pe as n,ne as o,$e as p,_e as q,ke as r,Te as s,ce as t,ve as u,Ee as v};
