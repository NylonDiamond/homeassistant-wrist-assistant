import{j as T}from"./chunk-MJZWLT5B.js";import{Hd as E,J as _,Ld as I,Td as B,ae as k,cd as S,le as A,pd as O,qe as H,re as N,te as M,yd as R}from"./chunk-S2DTYQOK.js";import{Ph as u,b as y,c as h,d as m,f as l,xj as v}from"./chunk-AED2YTWP.js";var g={width:126,height:37,top:11},L=[{label:"iPhone 17 Pro",screen:{width:402,height:874},safeTop:62,safeBottom:34,radius:62,island:g},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},safeTop:62,safeBottom:34,radius:62,island:g},{label:"iPhone 15 Pro",screen:{width:393,height:852},safeTop:59,safeBottom:34,radius:55,island:g},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},safeTop:59,safeBottom:34,radius:55,island:g},{label:"iPhone 13 mini",screen:{width:375,height:812},safeTop:50,safeBottom:34,radius:44},{label:"iPhone SE",screen:{width:375,height:667},safeTop:20,safeBottom:0,radius:0}],w=L[0];function le(e){let t=/^(\d+)x(\d+)$/.exec((e??"").trim());if(!t)return w;let o=Number(t[1]),r=Number(t[2]);return L.find(n=>n.screen.width===o&&n.screen.height===r)??w}var F=6,G=8,C=14,Z=3,z=42,W=16,j=8,D=61,K=12,J=28;function fe(e=w,t){let{width:o,height:r}=e.screen,n=e.safeTop,i;t?.switcher===!0&&(i={x:W,y:n,width:o-W*2,height:z},n+=z+j),n+=G;let a={x:K,y:r-e.safeBottom-D,width:o-K*2,height:D},d={x:0,y:a.y-C,width:o,height:C},s={x:F,y:n,width:o-F*2,height:d.y-n};return{model:e,...i===void 0?{}:{switcher:i},area:s,bottomBar:d,tabBar:a}}function ue(e){return{width:e.area.width,height:e.area.height}}var me=`Drawn as an ${w.label}. The iPhone does not tell Home Assistant its screen size.`,ge=.5,V=.024,q=.009,Q=[{title:"Pages",icon:"square.grid.2x2"},{title:"Watch",icon:"applewatch"},{title:"Widgets",icon:"widget.small"},{title:"Settings",icon:"gearshape.fill"}],ee="#2EC4B6",te="#BCBCBC",ne="9:41",c=e=>Math.round(e*100)/100;function U(e,t,o,r,n){let i=e?.render(t,o,r);return i===void 0?n():h`<svg width=${o} height=${o} viewBox=${`0 0 ${o} ${o}`} aria-hidden="true">${i}</svg>`}function oe(e,t,o){let{width:r}=e.screen,n=e.island,i=n===void 0?r/2:(r-n.width)/2,a=n===void 0?e.safeTop/2:n.top+n.height/2+2.5,d=n===void 0?24:i/2+5,s=p=>`${c(p*t)}px`,b=m`${[0,1,2,3].map(p=>m`<rect x=${p*4.6} y=${10-(p+1)*2.5} width="3" height=${(p+1)*2.5} rx="0.8" fill="#fff" />`)}`,x=U(o,"wifi",15*t,"#FFFFFF",()=>h`<svg width=${15*t} height=${11*t} viewBox="0 0 15 11" aria-hidden="true">${m`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="#fff" />`}</svg>`);return h`<div class="wa-phone-status" style=${`height:${s(e.safeTop)}`}>
    ${n===void 0?l:h`<span class="wa-phone-island" style=${`left:${s((r-n.width)/2)};top:${s(n.top)};width:${s(n.width)};height:${s(n.height)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${s(d)};top:${s(a)};font-size:${s(17)}`}>${ne}</span>
    <span class="wa-phone-icons" style=${`right:${s(35)};top:${s(a)};gap:${s(6)}`}>
      <svg width=${c(16.8*t)} height=${c(10*t)} viewBox="0 0 16.8 10" aria-hidden="true">${b}</svg>
      ${x}
      <span class="wa-phone-battery" style=${`width:${s(25)};height:${s(12)};border-radius:${s(4)};padding:${s(1.5)}`}><i style=${`border-radius:${s(2.5)}`}></i></span>
    </span>
  </div>`}function re(e,t,o){let r=i=>`${c(i*t)}px`,n=e.tabBar;return h`<div class="wa-phone-tabs" aria-hidden="true"
    style=${`height:${r(n.height)};margin:0 ${r(n.x)};border-radius:${r(J)}`}>
    ${Q.map((i,a)=>{let d=a===0?ee:te,s=U(o,i.icon,22*t,d,()=>h`<span class="wa-phone-tab-dot" style=${`width:${r(20)};height:${r(20)};border-color:${d}`}></span>`);return h`<span class="wa-phone-tab" style=${`color:${d};gap:${r(4)};font-size:${r(10)};${a===0?"transform:scale(1.12)":""}`}>${s}<span>${i.title}</span></span>`})}
  </div>`}function ie(e,t,o,r){let n=t,{model:i}=e,a=P=>`${c(P*n)}px`,d=Math.round(i.screen.width*n*V),s=Math.max(2,Math.round(i.screen.width*n*q)),b=c(i.radius*n),x=i.screen.height*n+d*2,p=P=>`${c(x*P)}px`,f=r?.dots,X=e.switcher===void 0?l:h`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${a(e.switcher.height)};margin:0 ${a(e.switcher.x)} ${a(j)}`}></div>`;return h`<div class="wa-phone" aria-label=${r?.label??"iPhone"}
    style=${`--pf-bezel:${d}px;--pf-rim:${s}px;--pf-radius:${b}px;--wf-radius:0px;--pf-left-top:${p(.17)};--pf-left-h:${p(.22)};--pf-right-top:${p(.26)};--pf-right-h:${p(.1)}`}>
    <div class="wa-phone-screen" style=${`width:${a(i.screen.width)};min-height:${a(i.screen.height)}`}>
      ${oe(i,n,r?.icons)}
      ${X}
      <div class="wa-phone-gap" style=${`height:${a(G)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${a(e.area.x)};min-height:${a(e.area.height)}`}>
        ${o}
        ${f?.top===!0?h`<span class="wa-phone-dots" style=${`top:${a(Z)};height:${a(f.height)}`}>${f.row}</span>`:l}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${a(e.bottomBar.height)}`}>${f?.top===!1?f.row:l}</div>
      ${re(e,n,r?.icons)}
      <div class="wa-phone-foot" style=${`height:${a(i.safeBottom)}`}>
        ${i.safeBottom>0?h`<span class="wa-phone-home" style=${`width:${a(134)};height:${a(5)};bottom:${a(8)}`}></span>`:l}
      </div>
    </div>
  </div>`}function we(e,t,o,r,n,i){return e===void 0?T(t,o,r,n):ie(e,o,r,{label:n,...i===void 0?{}:{icons:i}})}var be=y`
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
  .wa-phone-tabs {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: #1e1e20;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom-color: rgba(255, 255, 255, 0.16);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.35);
  }
  .wa-phone-tab { flex: 1; display: flex; flex-direction: column; align-items: center; font-weight: 600; line-height: 1; }
  .wa-phone-tab svg { display: block; }
  .wa-phone-tab-dot { box-sizing: border-box; border: 2px solid; border-radius: 5px; }
  .wa-phone-foot { position: relative; }
  .wa-phone-home { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 999px; background: rgba(255, 255, 255, 0.7); }
`;var ae="wrist-assistant-panel.watch.v1",se="wrist-assistant-panel.iphone.v1";function $(e){return O(e)??k(e)??B(e)??I(e)??S(e)??R(e)??_(e)??E(e)}function Be(e){return $(M(e))}function ke(e,t){if(e.length===0)return t.route??t.saved;let o=r=>r!==void 0&&e.some(n=>n.owner_watch_id===r);return o(t.route)?t.route:o(t.saved)?t.saved:v(e.filter(r=>u(r)==="watch"),t.fallback)??e[0]?.owner_watch_id}function Ae(e,t,o){return t===void 0||t===e||!o.some(r=>r.owner_watch_id===t)?e:t}var Y={watch:ae,iphone:se};function He(e,t="watch"){try{let o=e()?.getItem(Y[t]);if(!o)return;let n=JSON.parse(o)?.[t];return typeof n=="string"&&n!==""?n:void 0}catch{return}}function Ne(e,t,o="watch"){try{e()?.setItem(Y[o],JSON.stringify({[o]:t}))}catch{}}var he="phone_pages";function We(e){return e?.includes(he)??!1}function de(e,t){return t!==void 0&&e.some(o=>o.owner_watch_id===t&&u(o)==="iphone")}function De(e){return e.filter(t=>u(t)==="iphone"&&!t.is_orphan)}function Ke(e,t,o){if(!o||e===void 0)return;let r=H(e);if(!(r===void 0||!N(r))&&de(t,$(e)))return`${A}${e.path}`}export{le as a,fe as b,ue as c,me as d,ge as e,ie as f,we as g,be as h,$ as i,Be as j,ke as k,Ae as l,He as m,Ne as n,We as o,de as p,De as q,Ke as r};
