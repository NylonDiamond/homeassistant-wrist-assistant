import{G as N,H as Y,m as I,n as D,o as j}from"./chunk-IKYKLAPK.js";import{c as L,j as z}from"./chunk-2UEJFV4F.js";import"./chunk-ZYSWWJNQ.js";import"./chunk-K2Z4YFL6.js";import{Ma as B}from"./chunk-KXKFOWLN.js";import{f as S,g as P}from"./chunk-YYKSTGRD.js";import"./chunk-4ILUENBV.js";import"./chunk-LAHOQN2Z.js";import{Tg as O,Wg as T,b as H,d,e as y,g as h,j as F,k as _,l as g,m as $,xh as R}from"./chunk-G7AAB2LI.js";import"./chunk-WRB6XLXW.js";import{ca as E}from"./chunk-Y7CHJ2K5.js";import{a as m}from"./chunk-LO2NM3CE.js";function q(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function x(t,r,e=`${r}s`){return`${t} ${t===1?r:e}`}function M(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}var G=3;function U(t,r){if(t===void 0||t.revision<=0)return{words:"No actions yet",rows:[]};let e=M(t.document)?t.document:void 0,a=e??(M(t.public)?t.public:void 0),n=Array.isArray(a?.actions)?a.actions.filter(M):[],p=n.slice(0,G).map(i=>{let u=typeof i.name=="string"&&i.name.trim()!==""?i.name.trim():"Unnamed action";return e===void 0?{name:u}:{name:u,method:(typeof i.method=="string"?i.method:"POST").trim().toUpperCase()}}),s=[x(n.length,"action")];if(e!==void 0){s.push(`${q(z(e))} of ${Math.round(L/1e3)} KB`);let i=J(r).filter(u=>(t.delivered?.[u.owner_watch_id]??0)<t.revision).length;s.push(i===0?"Synced":`${i} waiting`)}return{words:s.join(" \xB7 "),rows:p}}function J(t){return E(t).filter(r=>{if(r.polling===!0)return!0;let e=Y(typeof r.last_seen_seconds=="number"?r.last_seen_seconds:void 0);return e===void 0||e<N})}var Q=4;function X(t){if(t===void 0||t.length===0)return{words:"No cameras in Home Assistant yet",thumbs:[]};let r=t.filter(a=>a.viewport!==null),e=[...r,...t.filter(a=>a.viewport===null)].slice(0,Q).map(a=>({entityId:a.entity_id,name:a.name,framed:a.viewport!==null}));return{words:`${r.length} of ${x(t.length,"camera")} framed \xB7 how each picture is cut in alerts`,thumbs:e}}function K(t){let r=t?.floors??[],e=r.reduce((s,i)=>s+i.rooms.length,0);if(e===0)return{words:"No map yet. Scan your home with the iPhone app."};let a=r.reduce((s,i)=>s+i.pins.length,0),n=r.length===1?`1 floor (${r[0].name})`:x(r.length,"floor"),p=r.map(V).find(s=>s!==void 0);return{words:`${n} \xB7 ${x(e,"room")} \xB7 ${x(a,"device")}`,...p===void 0?{}:{plan:p}}}function V(t){let r=t.rooms.filter(o=>o.outline.length>=3);if(r.length===0)return;let e=r.flatMap(o=>o.outline),a=e.map(o=>o[0]),n=e.map(o=>o[1]),[p,s,i,u]=[Math.min(...a),Math.max(...a),Math.min(...n),Math.max(...n)],k=Math.max(s-p,u-i,.01),w=k*.08,c=o=>Number(o.toFixed(3));return{viewBox:[p-w,i-w,s-p+w*2,u-i+w*2].map(c).join(" "),rooms:r.map(o=>{let A=o.outline.length,b=o.name?.trim();return{points:o.outline.map(f=>`${c(f[0])},${c(f[1])}`).join(" "),x:c(o.outline.reduce((f,v)=>f+v[0],0)/A),y:c(o.outline.reduce((f,v)=>f+v[1],0)/A),...b===void 0||b===""?{}:{name:b}}}),pins:t.pins.map(o=>({x:c(o.at[0]),y:c(o.at[1])})),stroke:c(k*.012)}}var C="Could not read this just now. Open it to try again.",l=class extends F{constructor(){super(...arguments);this.owners=[];this.http={state:"loading"};this.cameras={state:"loading"}}willUpdate(){let e=this.hass?.connection;e===void 0||e===this.readFor||(this.readFor=e,this.readAll(this.hass))}readAll(e){this.http={state:"loading"},this.cameras={state:"loading"},O(e).then(a=>{this.http={state:"ready",value:a}},()=>{this.http={state:"failed"}}),T(e).then(a=>{this.cameras={state:"ready",value:a.cameras}},()=>{this.cameras={state:"failed"}})}cardHead(e,a){return d`<div class="sh-hd">
      <span class="sh-box" aria-hidden="true">${R(a)}</span>
      <h2>${e.label}</h2>
      ${e.beta===void 0?h:d`<span class="sh-beta">${e.beta==="alpha"?"ALPHA":"BETA"}</span>`}
      <a class="sh-open" href=${this.hrefOf?.(e.path)??e.path} aria-label=${`Open ${e.label}`}
        @click=${n=>{this.onOpen===void 0||!B(n)||(n.preventDefault(),this.onOpen(e.path))}}>Open${R("right")}</a>
    </div>`}renderHttp(e){let a=this.http,n=a.state==="ready"?U(a.value,this.owners):void 0;return d`<section class="sh-card" aria-label=${e.label}>
      ${this.cardHead(e,"globe")}
      <p class="sh-m">${n?.words??(a.state==="failed"?C:"Reading\u2026")}</p>
      ${n===void 0||n.rows.length===0?h:d`<ul class="sh-list">${n.rows.map(p=>d`<li>${p.method===void 0?h:d`<code>${p.method}</code>`}<span>${p.name}</span></li>`)}</ul>`}
    </section>`}renderCameras(e){let a=this.cameras,n=a.state==="ready"?X(a.value):void 0,p=s=>{let i=this.hass?.states?.[s]?.attributes?.entity_picture;return typeof i=="string"?i:void 0};return d`<section class="sh-card" aria-label=${e.label}>
      ${this.cardHead(e,"image")}
      <p class="sh-m">${n?.words??(a.state==="failed"?C:"Reading\u2026")}</p>
      ${n===void 0||n.thumbs.length===0?h:d`<div class="sh-thumbs">${n.thumbs.map(s=>{let i=p(s.entityId);return d`<span class="sh-thumb" title=${s.framed?`${s.name}, framed`:s.name}>${i===void 0?h:d`<img src=${i} alt="" loading="lazy" />`}${s.framed?d`<i class="sh-framed" aria-hidden="true"></i>`:h}</span>`})}</div>`}
    </section>`}renderMap(e){let a=P(this.hass,()=>this.requestUpdate()),n=a===void 0?void 0:K(a.doc);return d`<section class="sh-card" aria-label=${e.label}>
      ${this.cardHead(e,"home")}
      <p class="sh-m">${n?.words??(S()?C:"Reading\u2026")}</p>
      ${n?.plan===void 0?h:W(n.plan)}
    </section>`}render(){let e=j(),a=n=>n.id==="http-actions"?this.renderHttp(n):n.id==="cameras"?this.renderCameras(n):this.renderMap(n);return d`<div class="sh-page">
      <h1>${I}</h1>
      <p class="sh-lead">${D}</p>
      <div class="sh-cards">${e.map(a)}</div>
    </div>`}};l.styles=H`
    :host { display: block; flex: 1 1 auto; min-height: 0; overflow: auto; background: var(--wa-bg); color: var(--wa-ink); }
    .sh-page { box-sizing: border-box; padding: 28px clamp(16px, 3vw, 40px) 40px; }
    h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.01em; }
    .sh-lead { margin: 6px 0 0; font-size: 13.5px; color: var(--wa-label, var(--wa-muted)); }
    .sh-cards { margin-top: 22px; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap: 14px; }
    .sh-card {
      display: flex; flex-direction: column; gap: 10px; min-width: 0; box-sizing: border-box; padding: 14px 16px 16px;
      background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 12px;
    }
    .sh-hd { display: flex; align-items: center; gap: 10px; }
    .sh-box { display: grid; place-items: center; width: 28px; height: 28px; flex: none; border-radius: 7px; background: var(--wa-panel); color: var(--wa-label, var(--wa-muted)); }
    .sh-box svg.ui-icon { width: 14px; height: 14px; }
    h2 { margin: 0; font-size: 15px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sh-beta { flex: none; padding: 1px 6px; border: 1px solid var(--wa-line-strong); border-radius: 999px; font-size: 9.5px; font-weight: 600; letter-spacing: .1em; color: var(--wa-muted); }
    a.sh-open {
      display: inline-flex; align-items: center; gap: 6px; margin-left: auto; flex: none; height: 28px; box-sizing: border-box; padding: 0 11px;
      border-radius: 7px; border: 1px solid var(--wa-line-strong); background: var(--wa-card);
      color: var(--wa-ink); font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap;
    }
    a.sh-open:hover { background: var(--wa-hover); }
    a.sh-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    a.sh-open svg.ui-icon { width: 13px; height: 13px; }
    .sh-m { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
    .sh-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--wa-line); border-radius: 8px; overflow: hidden; }
    .sh-list li { display: flex; align-items: center; gap: 14px; height: 28px; padding: 0 10px; font-size: 12.5px; border-top: 1px solid var(--wa-line); }
    .sh-list li:first-child { border-top: 0; }
    .sh-list span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sh-list code { flex: none; width: 34px; font: 600 10.5px ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-muted); }
    .sh-thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .sh-thumb { position: relative; height: 48px; border-radius: 6px; overflow: hidden; background: var(--wa-panel); }
    .sh-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .sh-framed { position: absolute; left: 5px; bottom: 5px; width: 6px; height: 6px; border-radius: 50%; background: var(--wa-green); box-shadow: 0 0 0 1px rgba(0, 0, 0, .4); }
    svg.sh-plan { display: block; width: 100%; height: 104px; border-radius: 8px; background: var(--wa-panel); }
    .sh-room { fill: color-mix(in srgb, var(--wa-ink) 16%, transparent); stroke: color-mix(in srgb, var(--wa-ink) 60%, transparent); }
    .sh-pin { fill: var(--wa-hue-yellow, currentColor); }
  `,m([g({attribute:!1})],l.prototype,"hass",2),m([g({attribute:!1})],l.prototype,"owners",2),m([g({attribute:!1})],l.prototype,"hrefOf",2),m([g({attribute:!1})],l.prototype,"onOpen",2),m([$()],l.prototype,"http",2),m([$()],l.prototype,"cameras",2),l=m([_("wa-shared-tab")],l);function W(t){let r=t.stroke*2.4;return d`<svg class="sh-plan" viewBox=${t.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ${t.rooms.map(e=>y`<polygon class="sh-room" points=${e.points} stroke-width=${t.stroke}></polygon>`)}
    ${t.pins.map(e=>y`<circle class="sh-pin" cx=${e.x} cy=${e.y} r=${r}></circle>`)}
  </svg>`}export{l as WaSharedTab};
