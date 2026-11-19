import{H as O,I as F,m as H,n as k,o as _}from"./chunk-BU6VTY3Q.js";import{c as A,j as C}from"./chunk-GONCYAMK.js";import"./chunk-EOW24PGJ.js";import{Ma as R}from"./chunk-WPPUOLKW.js";import"./chunk-K5UERMXO.js";import"./chunk-FG3PHEWQ.js";import"./chunk-Y354TWPI.js";import"./chunk-NR6OYL4X.js";import"./chunk-C42UVCWQ.js";import{Lg as v,Og as y,a as b,b as c,c as u,ph as f}from"./chunk-GFNODYNE.js";import{qa as $}from"./chunk-NLJVSYDV.js";import{b as w,f as n,i as h,l as x}from"./chunk-6ZDBXU6B.js";import{a as p}from"./chunk-LO2NM3CE.js";function z(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function T(t,s,e=`${s}s`){return`${t} ${t===1?s:e}`}function g(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}var I=3;function E(t,s){if(t===void 0||t.revision<=0)return{words:"No actions yet",rows:[]};let e=g(t.document)?t.document:void 0,a=e??(g(t.public)?t.public:void 0),r=Array.isArray(a?.actions)?a.actions.filter(g):[],l=r.slice(0,I).map(i=>{let m=typeof i.name=="string"&&i.name.trim()!==""?i.name.trim():"Unnamed action";return e===void 0?{name:m}:{name:m,method:(typeof i.method=="string"?i.method:"POST").trim().toUpperCase()}}),o=[T(r.length,"action")];if(e!==void 0){o.push(`${z(C(e))} of ${Math.round(A/1e3)} KB`);let i=M(s).filter(m=>(t.delivered?.[m.owner_watch_id]??0)<t.revision).length;o.push(i===0?"Synced":`${i} waiting`)}return{words:o.join(" \xB7 "),rows:l}}function M(t){return $(t).filter(s=>{if(s.polling===!0)return!0;let e=F(typeof s.last_seen_seconds=="number"?s.last_seen_seconds:void 0);return e===void 0||e<O})}var P=4;function L(t){if(t===void 0||t.length===0)return{words:"No cameras in Home Assistant yet",thumbs:[]};let s=t.filter(a=>a.viewport!==null),e=[...s,...t.filter(a=>a.viewport===null)].slice(0,P).map(a=>({entityId:a.entity_id,name:a.name,framed:a.viewport!==null}));return{words:`${s.length} of ${T(t.length,"camera")} framed \xB7 how each picture is cut in alerts`,thumbs:e}}var S="Could not read this just now. Open it to try again.",d=class extends x{constructor(){super(...arguments);this.owners=[];this.http={state:"loading"};this.cameras={state:"loading"}}willUpdate(){let e=this.hass?.connection;e===void 0||e===this.readFor||(this.readFor=e,this.readAll(this.hass))}readAll(e){this.http={state:"loading"},this.cameras={state:"loading"},v(e).then(a=>{this.http={state:"ready",value:a}},()=>{this.http={state:"failed"}}),y(e).then(a=>{this.cameras={state:"ready",value:a.cameras}},()=>{this.cameras={state:"failed"}})}cardHead(e,a){return n`<div class="sh-hd">
      <span class="sh-box" aria-hidden="true">${f(a)}</span>
      <h2>${e.label}</h2>
      ${e.beta===void 0?h:n`<span class="sh-beta">${e.beta==="alpha"?"ALPHA":"BETA"}</span>`}
      <a class="sh-open" href=${this.hrefOf?.(e.path)??e.path} aria-label=${`Open ${e.label}`}
        @click=${r=>{this.onOpen===void 0||!R(r)||(r.preventDefault(),this.onOpen(e.path))}}>Open${f("right")}</a>
    </div>`}renderHttp(e){let a=this.http,r=a.state==="ready"?E(a.value,this.owners):void 0;return n`<section class="sh-card" aria-label=${e.label}>
      ${this.cardHead(e,"globe")}
      <p class="sh-m">${r?.words??(a.state==="failed"?S:"Reading\u2026")}</p>
      ${r===void 0||r.rows.length===0?h:n`<ul class="sh-list">${r.rows.map(l=>n`<li>${l.method===void 0?h:n`<code>${l.method}</code>`}<span>${l.name}</span></li>`)}</ul>`}
    </section>`}renderCameras(e){let a=this.cameras,r=a.state==="ready"?L(a.value):void 0,l=o=>{let i=this.hass?.states?.[o]?.attributes?.entity_picture;return typeof i=="string"?i:void 0};return n`<section class="sh-card" aria-label=${e.label}>
      ${this.cardHead(e,"image")}
      <p class="sh-m">${r?.words??(a.state==="failed"?S:"Reading\u2026")}</p>
      ${r===void 0||r.thumbs.length===0?h:n`<div class="sh-thumbs">${r.thumbs.map(o=>{let i=l(o.entityId);return n`<span class="sh-thumb" title=${o.framed?`${o.name}, framed`:o.name}>${i===void 0?h:n`<img src=${i} alt="" loading="lazy" />`}${o.framed?n`<i class="sh-framed" aria-hidden="true"></i>`:h}</span>`})}</div>`}
    </section>`}render(){let e=_(),a=r=>r.id==="http-actions"?this.renderHttp(r):this.renderCameras(r);return n`<div class="sh-page">
      <h1>${H}</h1>
      <p class="sh-lead">${k()}</p>
      <div class="sh-cards">${e.map(a)}</div>
    </div>`}};d.styles=w`
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
  `,p([c({attribute:!1})],d.prototype,"hass",2),p([c({attribute:!1})],d.prototype,"owners",2),p([c({attribute:!1})],d.prototype,"hrefOf",2),p([c({attribute:!1})],d.prototype,"onOpen",2),p([u()],d.prototype,"http",2),p([u()],d.prototype,"cameras",2),d=p([b("wa-shared-tab")],d);export{d as WaSharedTab};
