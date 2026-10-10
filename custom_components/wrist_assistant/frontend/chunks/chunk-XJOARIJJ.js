import{w as P}from"./chunk-W6ZIVQ24.js";import{b as $,c as h,d as u,f as l}from"./chunk-CQXHQEN6.js";var g={width:126,height:37,top:11},S=[{label:"iPhone 17 Pro",screen:{width:402,height:874},safeTop:62,safeBottom:34,radius:62,island:g},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},safeTop:62,safeBottom:34,radius:62,island:g},{label:"iPhone 15 Pro",screen:{width:393,height:852},safeTop:59,safeBottom:34,radius:55,island:g},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},safeTop:59,safeBottom:34,radius:55,island:g},{label:"iPhone 13 mini",screen:{width:375,height:812},safeTop:50,safeBottom:34,radius:44},{label:"iPhone SE",screen:{width:375,height:667},safeTop:20,safeBottom:0,radius:0}],b=S[0];function X(t){let i=/^(\d+)x(\d+)$/.exec((t??"").trim());if(!i)return b;let s=Number(i[1]),o=Number(i[2]);return S.find(e=>e.screen.width===s&&e.screen.height===o)??b}var v=6,R=8,y=14,A=3,T=42,E=16,O=8,B=61,_=12,M=28;function Z(t=b,i){let{width:s,height:o}=t.screen,e=t.safeTop,n;i?.switcher===!0&&(n={x:E,y:e,width:s-E*2,height:T},e+=T+O),e+=R;let r={x:_,y:o-t.safeBottom-B,width:s-_*2,height:B},p={x:0,y:r.y-y,width:s,height:y},a={x:v,y:e,width:s-v*2,height:p.y-e};return{model:t,...n===void 0?{}:{switcher:n},area:a,bottomBar:p,tabBar:r}}function Y(t){return{width:t.area.width,height:t.area.height}}var q=`Drawn as an ${b.label}. The iPhone does not tell Home Assistant its screen size.`,Q=.5,N=.024,F=.009,k=[{title:"Pages",icon:"square.grid.2x2"},{title:"Watch",icon:"applewatch"},{title:"Widgets",icon:"widget.small"},{title:"Settings",icon:"gearshape.fill"}],z="#2EC4B6",D="#BCBCBC",L="9:41",c=t=>Math.round(t*100)/100;function H(t,i,s,o,e){let n=t?.render(i,s,o);return n===void 0?e():h`<svg width=${s} height=${s} viewBox=${`0 0 ${s} ${s}`} aria-hidden="true">${n}</svg>`}function C(t,i,s){let{width:o}=t.screen,e=t.island,n=e===void 0?o/2:(o-e.width)/2,r=e===void 0?t.safeTop/2:e.top+e.height/2+2.5,p=e===void 0?24:n/2+5,a=d=>`${c(d*i)}px`,m=u`${[0,1,2,3].map(d=>u`<rect x=${d*4.6} y=${10-(d+1)*2.5} width="3" height=${(d+1)*2.5} rx="0.8" fill="#fff" />`)}`,w=H(s,"wifi",15*i,"#FFFFFF",()=>h`<svg width=${15*i} height=${11*i} viewBox="0 0 15 11" aria-hidden="true">${u`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="#fff" />`}</svg>`);return h`<div class="wa-phone-status" style=${`height:${a(t.safeTop)}`}>
    ${e===void 0?l:h`<span class="wa-phone-island" style=${`left:${a((o-e.width)/2)};top:${a(e.top)};width:${a(e.width)};height:${a(e.height)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${a(p)};top:${a(r)};font-size:${a(17)}`}>${L}</span>
    <span class="wa-phone-icons" style=${`right:${a(35)};top:${a(r)};gap:${a(6)}`}>
      <svg width=${c(16.8*i)} height=${c(10*i)} viewBox="0 0 16.8 10" aria-hidden="true">${m}</svg>
      ${w}
      <span class="wa-phone-battery" style=${`width:${a(25)};height:${a(12)};border-radius:${a(4)};padding:${a(1.5)}`}><i style=${`border-radius:${a(2.5)}`}></i></span>
    </span>
  </div>`}function G(t,i,s){let o=n=>`${c(n*i)}px`,e=t.tabBar;return h`<div class="wa-phone-tabs" aria-hidden="true"
    style=${`height:${o(e.height)};margin:0 ${o(e.x)};border-radius:${o(M)}`}>
    ${k.map((n,r)=>{let p=r===0?z:D,a=H(s,n.icon,22*i,p,()=>h`<span class="wa-phone-tab-dot" style=${`width:${o(20)};height:${o(20)};border-color:${p}`}></span>`);return h`<span class="wa-phone-tab" style=${`color:${p};gap:${o(4)};font-size:${o(10)};${r===0?"transform:scale(1.12)":""}`}>${a}<span>${n.title}</span></span>`})}
  </div>`}function U(t,i,s,o){let e=i,{model:n}=t,r=x=>`${c(x*e)}px`,p=Math.round(n.screen.width*e*N),a=Math.max(2,Math.round(n.screen.width*e*F)),m=c(n.radius*e),w=n.screen.height*e+p*2,d=x=>`${c(w*x)}px`,f=o?.dots,I=t.switcher===void 0?l:h`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${r(t.switcher.height)};margin:0 ${r(t.switcher.x)} ${r(O)}`}></div>`;return h`<div class="wa-phone" aria-label=${o?.label??"iPhone"}
    style=${`--pf-bezel:${p}px;--pf-rim:${a}px;--pf-radius:${m}px;--wf-radius:0px;--pf-left-top:${d(.17)};--pf-left-h:${d(.22)};--pf-right-top:${d(.26)};--pf-right-h:${d(.1)}`}>
    <div class="wa-phone-screen" style=${`width:${r(n.screen.width)};min-height:${r(n.screen.height)}`}>
      ${C(n,e,o?.icons)}
      ${I}
      <div class="wa-phone-gap" style=${`height:${r(R)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${r(t.area.x)};min-height:${r(t.area.height)}`}>
        ${s}
        ${f?.top===!0?h`<span class="wa-phone-dots" style=${`top:${r(A)};height:${r(f.height)}`}>${f.row}</span>`:l}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${r(t.bottomBar.height)}`}>${f?.top===!1?f.row:l}</div>
      ${G(t,e,o?.icons)}
      <div class="wa-phone-foot" style=${`height:${r(n.safeBottom)}`}>
        ${n.safeBottom>0?h`<span class="wa-phone-home" style=${`width:${r(134)};height:${r(5)};bottom:${r(8)}`}></span>`:l}
      </div>
    </div>
  </div>`}function V(t,i,s,o,e,n){return t===void 0?P(i,s,o,e):U(t,s,o,{label:e,...n===void 0?{}:{icons:n}})}var J=$`
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
`;export{X as a,Z as b,Y as c,q as d,Q as e,U as f,V as g,J as h};
