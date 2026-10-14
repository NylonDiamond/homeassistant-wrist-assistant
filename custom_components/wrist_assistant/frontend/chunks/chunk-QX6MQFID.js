import{h as I}from"./chunk-IXFN6V6M.js";import{Hh as p,Ih as S,Jh as d,b as P,c as v}from"./chunk-KDXWSXKL.js";function X(e){let n=new Map;for(let[r,t]of Object.entries(e)){if(!r.startsWith("person."))continue;let s=t.attributes.user_id;if(typeof s!="string"||s===""||n.has(s))continue;let i=t.attributes.friendly_name,o=t.attributes.entity_picture;n.set(s,{entityId:r,name:typeof i=="string"&&i.trim()!==""?i.trim():r.slice(7),...typeof o=="string"&&o!==""?{picture:o}:{}})}return n}function W(e){return[...e.filter(n=>d(n)!=="iphone"),...e.filter(n=>d(n)==="iphone")]}function x(e){return e.device_name??e.owner_watch_id}function A(e,n){if(!e)return;let r=(e.device_name??"").trim();if(r==="")return;let t=r.replace(/\s*(?:apple\s+)?watch(?:\s+(?:ultra|se))?\s*\d*$/i,"").replace(/^(?:apple\s+)?watch(?:\s+(?:ultra|se))?(?:\s+\d+)?(?:\s+(?:van|von|de|di|du|del|da))?\s+/i,"").replace(/['\u2019]s$/i,"").trim();if(t!==""&&!(n&&t.toLocaleLowerCase()===x(n).trim().toLocaleLowerCase()))return t}var w="user:";function C(e,n){if(e.user_id)return`${w}${e.user_id}`;if(d(e)==="iphone")return e.owner_watch_id;let r=e.paired_iphone_id,t=i=>i.user_id?`${w}${i.user_id}`:i.owner_watch_id;if(r!=null&&r!==""){let i=n.find(o=>o.owner_watch_id===r);return i?t(i):e.owner_watch_id}let s=e.paired_iphone_name;if(s){let i=n.find(o=>o.device_name===s);if(i)return t(i)}return e.owner_watch_id}function Z(e,n=new Map){let r=W(e).filter(i=>!i.is_orphan&&!S(i)),t=r.filter(i=>d(i)==="iphone"),s=new Map;for(let i of r){let o=C(i,t),a=s.get(o)??[];a.push(i),s.set(o,a)}return[...s].map(([i,o])=>{let a=o.filter(y=>d(y)==="iphone"),c=a[0],f=o.filter(y=>d(y)!=="iphone"),l=c??f[0],u=i.startsWith(w)?i.slice(w.length):void 0,b=u===void 0?void 0:n.get(u);return{key:i,label:b?.name??A(f[0],c)??x(l),owners:[...a,...f],...u===void 0?{}:{userId:u},...b?.picture===void 0?{}:{picture:b.picture}}})}function q(e,n){let r=x(e);return d(e)!=="iphone"?r:n.owners.some(s=>d(s)!=="iphone")&&r===n.label?"iPhone":r}var R="all";function h(e,n){let r=e.findIndex(t=>t.ownerId===n);return r<0?e.length:r}function _(e,n){let r=e.toLocaleLowerCase(),t=n.toLocaleLowerCase();return r<t?-1:r>t?1:0}function E(e){return e.linkId!==void 0&&e.linkId!==""?`link:${e.linkId}`:`rec:${e.ownerId}\0${e.id}`}function ee(e,n,r){let t=new Map;for(let i of e){let o=E(i),a=t.get(o);a?a.push(i):t.set(o,[i])}let s=[];for(let[i,o]of t){let a=[...o].sort((l,u)=>h(n,l.ownerId)-h(n,u.ownerId)||l.slot-u.slot),c=a[0];if(!c)continue;let f=a.find(l=>l.ownerId===r)??c;s.push({key:i,name:f.name,copies:a,open:f})}return s}function T(e,n){return e.filter(r=>r.copies.some(t=>t.ownerId===n))}function ne(e){return e.copies.length>0&&e.copies.every(n=>n.ownerId===p)}function M(e){let n;for(let r of e)for(let t of r.copies)if(n===void 0)n=t.ownerId;else if(n!==t.ownerId)return;return n}function k(e,n,r){let t=r??M(e),s=(i,o)=>i.copies.find(a=>a.ownerId===o)?.slot??Number.MAX_SAFE_INTEGER;return t!==void 0?[...e].sort((i,o)=>s(i,t)-s(o,t)||_(i.name,o.name)):[...e].sort((i,o)=>_(i.name,o.name)||h(n,i.copies[0]?.ownerId??"")-h(n,o.copies[0]?.ownerId??"")||i.open.slot-o.open.slot)}function re(e,n,r){return r===R?k(e,n):k(T(e,r),n,r)}var g="Not on a device",te=`the ${g} list`;function m(e){return e.kind==="library"||e.ownerId===p}function L(e){return[...e.filter(n=>!m(n)),...e.filter(m)]}function ie(e,n){let r=[{key:R,label:"All",kind:"all",count:e.length}];for(let t of L(n))r.push({key:t.ownerId,label:m(t)?g:t.label,kind:t.kind,count:T(e,t.ownerId).length});return r}function oe(e,n){return L(n).map(r=>({ownerId:r.ownerId,label:m(r)?g:r.label,kind:r.kind,rows:k(T(e,r.ownerId),n,r.ownerId)}))}function K(e){return e==="iphone"?"iPhone":"watch"}function se(e,n){let r=new Set(e),t=[];for(let s of n){let i=s.devices.filter(o=>r.has(o.ownerId));i.length!==0&&t.push(`${s.label} (${i.map(o=>K(o.kind)).join(", ")})`)}return t.length>0?t.join(" \xB7 "):r.has(p)?g:"On no device yet"}function O(e,n){return e.findIndex(r=>r.devices.some(t=>t.ownerId===n))}var H=6;function B(e){if(!(e<0))return`var(--wa-person-${e%H+1})`}function ae(e,n,r){if(r!=="library")return B(O(e,n))??(r==="iphone"?"var(--wa-hue-blue)":"var(--wa-hue-green)")}function ce(e,n,r){let t=new Map;for(let i of e){let{key:o,label:a}=n(i),c=t.get(o);c?c.rows.push(i):t.set(o,{key:o,label:a,rows:[i]})}let s=i=>{let o=r.indexOf(i);return o<0?r.length:o};return[...t.values()].sort((i,o)=>s(i.key)-s(o.key))}function de(e,n,r){let t=[];for(let s of e){let i=O(n,s.ownerId),o=i<0?"none":`who:${i}`,a=t.find(c=>c.key===o);a?a.sections.push(s):t.push({key:o,label:i<0?"":r(i),personIndex:i,sections:[s]})}return t}function $(e){let n=(e??"").trim();if(n.startsWith("ha-panel:")){let r=n.slice(9).trim();return r===""?void 0:r}if(!(n===""||n==="ha-panel"))return n.startsWith("app-import:")||n.startsWith("watch-restore:")?"the app":n==="orphan-sweep"||n.startsWith("forget:")||n.startsWith("device-removed:")?"Home Assistant":n}function F(e){let n=$(e);return n===void 0?"":`by ${n}`}function D(e,n){let r=e?Date.parse(e):Number.NaN;return Number.isNaN(r)?void 0:I(Math.max(0,(n-r)/1e3))}function N(e,n=Date.now(),r){let t=e?new Date(e):void 0;if(t===void 0||Number.isNaN(t.getTime()))return;let s=new Date(n).getFullYear()===t.getFullYear(),i=t.toLocaleDateString(r,s?{day:"numeric",month:"short"}:{day:"numeric",month:"short",year:"numeric"}),o=t.toLocaleTimeString(r,{hour:"2-digit",minute:"2-digit"});return`${i}, ${o}`}function le(e,n,r=Date.now(),t){let s=N(n,r,t);return s===void 0?`Version ${e}`:`Version from ${s}`}function pe(e,n=Date.now(),r){let t=N(e,n,r);return t===void 0?"That version is back.":`The version from ${t} is back.`}function we(e,n=Date.now()){if(e===null)return"This complication was deleted after you opened it.";let r=$(e.updatedBy)??"Someone",t=r.charAt(0).toUpperCase()+r.slice(1),s=D(e.updatedAt,n);return`${t} saved this complication${s===void 0?"":` ${s}`}, after you opened it.`}function he(e,n,r=Date.now()){let t=D(e,r),s=F(n);return["Saved",t,s].filter(i=>i!==void 0&&i!=="").join(" ")}var z=.145,G=.045,j=.018,V=.05;function U(e,n){let r=e*n;return{radius:Math.round(r*z),bezel:Math.round(r*G),rim:Math.max(2,Math.round(r*j)),crown:Math.round(r*V)}}function be(e,n,r,t){let s=U(e.width,n),i=[`--wf-radius:${s.radius}px`,`--wf-bezel:${s.bezel}px`,`--wf-rim:${s.rim}px`,`--wf-crown:${s.crown}px`];if(e.height!==void 0&&e.height>0){let o=e.height*n+s.bezel*2,a=c=>`${Math.round(o*c*100)/100}px`;i.push(`--wf-crown-top:${a(.19)}`,`--wf-crown-h:${a(.16)}`,`--wf-button-top:${a(.42)}`,`--wf-button-h:${a(.22)}`)}return v`<div class="wa-watch" aria-label=${t??"Watch"} style=${i.join(";")}>${r}</div>`}var ye=P`
  .wa-watch {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: content-box;
    padding: var(--wf-bezel, 9px);
    /* The rim is drawn outside the box (a shadow), so the margins keep room
       for it, and on the right for the crown as well. */
    margin: var(--wf-rim, 3px) calc(var(--wf-rim, 3px) + var(--wf-crown, 10px)) var(--wf-rim, 3px) var(--wf-rim, 3px);
    border-radius: calc(var(--wf-radius, 28px) + var(--wf-bezel, 9px));
    /* The glass: black, with a faint sheen from the top left. */
    background:
      linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 40%),
      #07080c;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.04),
      0 0 0 var(--wf-rim, 3px) var(--wa-art-case, #2b2f3d),
      0 0 0 calc(var(--wf-rim, 3px) + 1px) rgba(255, 255, 255, 0.1),
      0 14px 34px rgba(0, 0, 0, 0.4);
  }
  .wa-watch::before,
  .wa-watch::after {
    content: "";
    position: absolute;
    left: calc(100% + var(--wf-rim, 3px));
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25)),
      var(--wa-art-case, #2b2f3d);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }
  /* Digital Crown: a fifth of the way down, a sixth of the case tall. */
  .wa-watch::before {
    top: var(--wf-crown-top, 19%);
    width: var(--wf-crown, 10px);
    height: var(--wf-crown-h, 16%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.45) calc(var(--wf-crown, 10px) * 0.45) 0;
  }
  /* Side button: below the crown, thinner and longer. */
  .wa-watch::after {
    top: var(--wf-button-top, 42%);
    width: calc(var(--wf-crown, 10px) * 0.55);
    height: var(--wf-button-h, 22%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.3) calc(var(--wf-crown, 10px) * 0.3) 0;
  }
  .wa-watch > * {
    border-radius: var(--wf-radius, 28px);
    box-shadow: none;
  }
`;export{X as a,Z as b,q as c,R as d,E as e,ee as f,T as g,ne as h,k as i,re as j,g as k,te as l,ie as m,oe as n,se as o,B as p,ae as q,ce as r,de as s,F as t,N as u,le as v,pe as w,we as x,he as y,be as z,ye as A};
