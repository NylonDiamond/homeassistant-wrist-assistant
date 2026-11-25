import{D as N}from"./chunk-QPQK7NV3.js";import{O as k}from"./chunk-GGWFE73C.js";import{X as d}from"./chunk-MTUTXLNK.js";import{Ja as L,Na as R}from"./chunk-F5QPMGCO.js";import{j as w}from"./chunk-ZEGVU3YJ.js";import{d as E}from"./chunk-V6F4RSJC.js";import{J as D,i as p,l as x,n as f}from"./chunk-HOTMV2GM.js";import{mh as y,rf as C,sf as I}from"./chunk-WT56CXTV.js";import{l as T}from"./chunk-HPMCDO65.js";import{b as h,f as c,i as u}from"./chunk-6ZDBXU6B.js";var v="houselitPage",A=1,G=2*1024*1024,P=/^[a-z0-9_]+\.[a-z0-9_]+$/,O=new Set(["id"]);function F(e,n){let o=e[n];if(!p(o))return"";let t=o.attributes;return p(t)&&typeof t.friendly_name=="string"?t.friendly_name:""}function $(e,n,o,t=0){if(!(t>64)){if(typeof e=="string"){n(e,o);return}if(Array.isArray(e)){for(let s of e)$(s,n,o,t+1);return}if(p(e))for(let[s,i]of Object.entries(e))$(i,n,s,t+1)}}function S(e,n,o,t=0){if(t>64)return e;if(typeof e=="string")return o!==void 0&&O.has(o)?e:n(e);if(Array.isArray(e))return e.map(s=>S(s,n,o,t+1));if(p(e)){let s={};for(let[i,r]of Object.entries(e))s[i]=S(r,n,i,t+1);return s}return e}function M(e,n){let o=new Set,t=[],s=i=>{o.has(i)||!n(i)||(o.add(i),t.push(i))};return $(e,(i,r)=>{if(!(r!==void 0&&O.has(r)))if(P.test(i))s(i);else for(let a of C(i))s(a)}),t}function ne(e,n){let o={};for(let t of M(e,s=>Object.hasOwn(n,s)))o[t]=F(n,t);return L({[v]:A,name:f(e),page:e,entities:o})}function oe(e){let n=f(e).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40);return`houselit-page-${n===""?"page":n}.json`}var _="This is not a shared page. In Pages, open a page's \xB7\xB7\xB7 and pick Share page, then copy all of the text.";function m(e){if(p(e)&&!(!Array.isArray(e.items)&&!p(e.dynamicConfig)))return e}function ie(e){let n=e.trim();if(n==="")return{ok:!1,error:"Paste the text of a shared page."};if(new TextEncoder().encode(n).length>G)return{ok:!1,error:"This text is too big for one page."};let o;try{o=JSON.parse(n)}catch{return{ok:!1,error:"This text is cut short or changed. Copy all of it again."}}if(!p(o))return{ok:!1,error:_};let t,s={};if(v in o){let i=o[v];if(typeof i!="number"||i>A)return{ok:!1,error:"This page was shared from a newer version. Update the integration, then paste it again."};if(t=m(o.page),p(o.entities))for(let[r,a]of Object.entries(o.entities))P.test(r)&&(s[r]=typeof a=="string"?a:"")}else if(Array.isArray(o.pages)){let i=o.pages.filter(r=>m(r)!==void 0);if(i.length>1)return{ok:!1,error:"This text has more than one page. Share one page at a time."};t=m(i[0])}else t=m(o);if(t===void 0)return{ok:!1,error:_};if(R(t))return{ok:!1,error:"This page has a color in it that is not a color, so it was not read."};if(Object.keys(s).length===0)for(let i of M(t,r=>D(r)==="entity"))s[i]="";return{ok:!0,share:{page:t,entities:s}}}function U(e,n){let o=new Map;for(let t of Object.keys(n)){let s=t.split(".")[0]??"",i=o.get(s)??[];i.push({entityId:t,name:F(n,t)||t}),o.set(s,i)}for(let t of o.values())t.sort((s,i)=>s.name.localeCompare(i.name));return Object.entries(e.entities).filter(([t])=>!Object.hasOwn(n,t)).map(([t,s])=>{let i=t.split(".")[0]??"";return{entityId:t,domain:i,name:s,choices:o.get(i)??[]}})}function se(e){let n={};for(let o of e){if(o.name==="")continue;let t=o.choices.filter(s=>s.name.toLowerCase()===o.name.toLowerCase());t.length===1&&(n[o.entityId]=t[0].entityId)}return n}function Y(e){let n=0,o=e.backgroundImageId;typeof o=="string"&&o.trim()!==""&&!k(o)&&(n+=1);for(let t of x(e))typeof t.iconPhotoId=="string"&&t.iconPhotoId.trim()!==""&&(n+=1);return n}function re(e,n){return{name:f(e.page),tiles:x(e.page).length,entities:Object.keys(e.entities).length,missing:U(e,n).length,photos:Y(e.page)}}function ae(e){let n=(t,s,i=`${s}s`)=>`${t} ${t===1?s:i}`,o=`${e.name}: ${n(e.tiles,"tile")}, ${n(e.entities,"entity","entities")}.`;return e.missing>0&&(o+=` ${e.missing} ${e.missing===1?"is":"are"} not in this home. Pick yours below, or leave ${e.missing===1?"it":"them"}.`),e.photos>0&&(o+=` ${n(e.photos,"photo")} stay${e.photos===1?"s":""} behind.`),o}function ce(e,n){let o=new Map;for(let[i,r]of Object.entries(n))r!==""&&r!==i&&P.test(r)&&o.set(i,r);let t=o.size===0?structuredClone(e.page):S(e.page,i=>o.get(i)??I(i,o)),s=t.backgroundImageId;if(typeof s=="string"&&s.trim()!==""&&!k(s)&&delete t.backgroundImageId,Array.isArray(t.items))for(let i of t.items)p(i)&&(delete i.iconPhotoId,delete i.iconPhotoLook);return t}var q="dialog.lib-share-page";function J(e,n){try{let o=URL.createObjectURL(new Blob([e],{type:"application/json"})),t=document.createElement("a");return t.href=o,t.download=n,document.body.append(t),t.click(),t.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e4),!0}catch{return!1}}function ue(e,n){let o=async i=>{let r=i.currentTarget.closest("dialog")?.querySelector("textarea.sp-text"),a=!1;if(navigator.clipboard?.writeText!==void 0)try{await navigator.clipboard.writeText(e.text),a=!0}catch{}if(!a&&r){r.focus(),r.select(),r.setSelectionRange(0,r.value.length);try{a=document.execCommand("copy")}catch{a=!1}}a||(a=await N(e.text)),n.onSaid(a?{kind:"ok",text:"Copied. Send it to them."}:{kind:"err",text:"The browser did not copy it. Use Download instead."})},t=()=>{let i=J(e.text,e.fileName);n.onSaid(i?{kind:"ok",text:`Saved as ${e.fileName}.`}:{kind:"err",text:"The browser did not save it. Use Copy instead."})},s=e.entities===1?"1 entity":`${e.entities} entities`;return c`<dialog class="new-dialog lib-new lib-share-page" aria-label="Share page" @close=${()=>n.onClose()}
    @cancel=${i=>{i.preventDefault(),n.onClose()}}>
    <div class="lib-new-form">
      <div class="new-head">
        <h2>Share ${e.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" @click=${()=>n.onClose()}>${y("close")}</button>
      </div>
      <div class="new-body">
        <p class="sp-lead">Send this text or file to the other person. In Pages they pick New page, then Paste a page.</p>
        <textarea class="sp-text" readonly spellcheck="false" aria-label="Shared page text" .value=${e.text}
          @focus=${i=>i.target.select()}></textarea>
        <p class="sp-note">It has the page's tiles and the ids and names of its ${s}. It has no states, no photos and nothing else from your home.</p>
        ${e.said===void 0?u:c`<p class="lt-line ${e.said.kind==="ok"?"ok":"err"}" role="status">${e.said.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        <button type="button" class="lib-new-btn" @click=${t}>${y("download")} Download</button>
        <button type="button" class="lib-new-btn primary" @click=${i=>{o(i)}}>Copy text</button>
      </div>
    </div>
  </dialog>`}function ye(e){let n=e?.querySelector?.(q);n&&!n.open&&typeof n.showModal=="function"&&n.showModal()}var he=h`
  .lib-share-page .sp-lead, .lib-share-page .sp-note { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .lib-share-page .sp-text {
    width: 100%; box-sizing: border-box; height: 180px; resize: vertical; padding: 8px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); font: 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-ink);
    background: var(--wa-input, var(--wa-field));
  }
  .lib-share-page .lib-new-btn svg { width: 14px; height: 14px; vertical-align: -2px; }
`;var B="These become two pages. A change to one never reaches the other.",$e="Make a copy needs the page on two devices or more: one keeps it, the others get the copy.",X="dialog.lib-copy";function Se(e,n){let o=n.filter(t=>e.some(s=>d(s,t.ownerId)));return[...o.filter(t=>t.kind==="watch"),...o.filter(t=>t.kind==="iphone")]}function W(e,n){let o=new Set(n.map(i=>i.kind)),t=n.every(i=>i.platform==="android"),s=o.size!==1?"copy":o.has("iphone")?t?"Phone":"iPhone":"Watch";return`${e} (${s})`}function Pe(e,n,o,t=[]){let s=o.filter(i=>t.some(r=>d(r,i.ownerId))).map(i=>i.ownerId);return{itemId:e,name:n,owners:s,named:!1,busy:!1,copyName:W(n,o.filter(i=>s.includes(i.ownerId)))}}function Ce(e,n,o,t){let s=t?n.filter(l=>d(l.ownerId,o)||e.owners.some(g=>d(g,l.ownerId))).map(l=>l.ownerId):e.owners.filter(l=>!d(l,o)),{note:i,...r}=e,a=e.named?e.copyName:W(e.name,n.filter(l=>s.includes(l.ownerId)));return{...r,owners:s,copyName:a}}function H(e,n){if(e.owners.length===0)return"Tick the devices that get the copy.";if(n.length>0&&n.every(o=>e.owners.some(t=>d(t,o.ownerId))))return`Leave ${e.name} on at least one device. To change it everywhere, just edit it.`;if(e.copyName.trim()==="")return"Give the copy a name."}function j(e,n){return(e??[]).map(o=>{let t=n.find(s=>d(s.ownerId,o.owner_id))?.name;return t===void 0?o.what:`${t}: ${o.what}`})}function K(e,n){return`${e.name} is on ${E(e.devices)} now. ${n} stays on the other devices.`}async function Ie(e,n,o,t){let s=H(n,o);if(s!==void 0)return{...n,note:{kind:"warn",text:s}};let i=n.copyName.trim(),r=await e.forkPage(n.itemId,n.owners,i);if(!r.ok)return{...n,busy:!1,note:{kind:"err",text:`Not copied. ${r.text}`}};let a=r.reply,{note:l,...g}=n;return{...g,busy:!1,done:{itemId:a.item_id,name:i,devices:o.filter(b=>n.owners.some(z=>d(z,b.ownerId))).map(b=>b.name),rewritten:j(a.rewritten,t),kept:j(a.kept,t)}}}function Q(e,n,o){let t=(s,i)=>{let r=n.filter(a=>a.kind===s);return r.length===0?u:c`<div class="lib-copy-group" role="group" aria-label=${i}>
      <span class="lib-copy-kind">${y(s==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${r.map(a=>{let l=e.owners.some(g=>d(g,a.ownerId));return c`<label class="lib-copy-dev">
          <input type="checkbox" .checked=${w(l)} ?disabled=${e.busy}
            @change=${g=>o.onTick(a.ownerId,g.target.checked)} />
          <span>${a.name}</span>
        </label>`})}
    </div>`};return c`${t("watch","Watches")}${t("iphone",T("iPhones","Phones"))}`}function Te(e,n,o){let t=e.done,s=H(e,n);return c`<dialog class="new-dialog lib-new lib-copy" aria-label="Make a copy" @close=${()=>o.onClose()}
    @cancel=${i=>{i.preventDefault(),e.busy||o.onClose()}}>
    <form class="lib-new-form" @submit=${i=>{i.preventDefault(),t===void 0&&s===void 0&&!e.busy&&o.onMake()}}>
      <div class="new-head">
        <h2>Make a copy of ${e.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" ?disabled=${e.busy} @click=${()=>o.onClose()}>${y("close")}</button>
      </div>
      ${t===void 0?c`<div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">For which devices?</span>
            <span class="new-step-hint">They get the copy. The others keep ${e.name}.</span></div>
          ${Q(e,n,o)}
        </section>
        <section class="new-step step-copy-name">
          <div class="new-step-head"><span class="new-step-title">Name of the copy</span></div>
          <input type="text" class="new-name" .value=${w(e.copyName)} maxlength="80" aria-label="Name of the copy"
            ?disabled=${e.busy} @input=${i=>o.onName(i.target.value)} />
        </section>
        <p class="lib-copy-warn">${B} Anything on those devices that opened ${e.name} (menu slots, complications, page links) opens the copy.</p>
        ${e.note===void 0?u:c`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${s??`${e.copyName.trim()}, for ${e.owners.length===1?"1 device":`${e.owners.length} devices`}.`}</span>
        <button type="button" class="lib-new-btn" ?disabled=${e.busy} @click=${()=>o.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary lib-copy-make" ?disabled=${s!==void 0||e.busy}
          title=${s??"Make the copy"}>${e.busy?"Copying\u2026":"Make a copy"}</button>
      </div>`:c`<div class="new-body lib-copy-done" role="status">
        <p class="lib-copy-said">${K(t,e.name)}</p>
        ${t.rewritten.length===0?c`<p class="lib-copy-none">Nothing on those devices opened ${e.name}, so nothing else changed.</p>`:c`<p class="lib-copy-lead">Now open the copy:</p><ul class="lib-copy-list">${t.rewritten.map(i=>c`<li>${i}</li>`)}</ul>`}
        ${t.kept.length===0?u:c`<p class="lib-copy-lead">Still open ${e.name}, because another device shares the page they sit on:</p>
          <ul class="lib-copy-list">${t.kept.map(i=>c`<li>${i}</li>`)}</ul>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        ${o.onOpen===void 0?u:c`<button type="button" class="lib-new-btn lib-copy-open" @click=${()=>o.onOpen?.(t.itemId)}>Open the copy</button>`}
        <button type="button" class="lib-new-btn primary lib-copy-done-btn" @click=${()=>o.onClose()}>Done</button>
      </div>`}
    </form>
  </dialog>`}var Ee=h`
  .lib-copy .new-step.step-copy-name { background: none; }
  .lib-copy-group { display: flex; flex-direction: column; gap: 4px; }
  .lib-copy-kind { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .lib-copy-kind svg { width: 13px; height: 13px; }
  .lib-copy-dev { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 2px 0 2px 2px; cursor: pointer; }
  .lib-copy-dev input { margin: 0; accent-color: var(--wa-accent); }
  .lib-copy-warn { margin: 0; font-size: 12.5px; line-height: 1.45; color: var(--wa-ink); }
  .lib-copy-done p { margin: 0; font-size: 13px; line-height: 1.45; }
  .lib-copy-lead { color: var(--wa-muted); }
  .lib-copy-none { color: var(--wa-muted); }
  .lib-copy-list { margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 1.5; }
`;function De(e){let n=e?.querySelector?.(X);n&&!n.open&&typeof n.showModal=="function"&&n.showModal()}export{M as a,ne as b,oe as c,ie as d,U as e,se as f,re as g,ae as h,ce as i,ue as j,ye as k,he as l,$e as m,Se as n,Pe as o,Ce as p,Ie as q,Te as r,Ee as s,De as t};
