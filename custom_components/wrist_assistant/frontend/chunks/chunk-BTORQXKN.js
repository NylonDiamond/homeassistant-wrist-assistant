import{h as b}from"./chunk-DCZEC7GD.js";import{Lh as x,Mh as u,b as h,c as g}from"./chunk-KX3QWJ4X.js";function D(e){let n=new Map;for(let[r,i]of Object.entries(e)){if(!r.startsWith("person."))continue;let a=i.attributes.user_id;if(typeof a!="string"||a===""||n.has(a))continue;let t=i.attributes.friendly_name,o=i.attributes.entity_picture;n.set(a,{entityId:r,name:typeof t=="string"&&t.trim()!==""?t.trim():r.slice(7),...typeof o=="string"&&o!==""?{picture:o}:{}})}return n}function O(e){return[...e.filter(n=>u(n)!=="iphone"),...e.filter(n=>u(n)==="iphone")]}function l(e){return e.device_name??e.owner_watch_id}function $(e,n){if(!e)return;let r=(e.device_name??"").trim();if(r==="")return;let i=r.replace(/\s*(?:apple\s+)?watch(?:\s+(?:ultra|se))?\s*\d*$/i,"").replace(/^(?:apple\s+)?watch(?:\s+(?:ultra|se))?(?:\s+\d+)?(?:\s+(?:van|von|de|di|du|del|da))?\s+/i,"").replace(/['\u2019]s$/i,"").trim();if(i!==""&&!(n&&i.toLocaleLowerCase()===l(n).trim().toLocaleLowerCase()))return i}var f="user:";function T(e,n){if(e.user_id)return`${f}${e.user_id}`;if(u(e)==="iphone")return e.owner_watch_id;let r=e.paired_iphone_id,i=t=>t.user_id?`${f}${t.user_id}`:t.owner_watch_id;if(r!=null&&r!==""){let t=n.find(o=>o.owner_watch_id===r);return t?i(t):e.owner_watch_id}let a=e.paired_iphone_name;if(a){let t=n.find(o=>o.device_name===a);if(t)return i(t)}return e.owner_watch_id}function I(e,n=new Map){let r=O(e).filter(t=>!t.is_orphan&&!x(t)),i=r.filter(t=>u(t)==="iphone"),a=new Map;for(let t of r){let o=T(t,i),s=a.get(o)??[];s.push(t),a.set(o,s)}return[...a].map(([t,o])=>{let s=o.filter(w=>u(w)==="iphone"),d=s[0],p=o.filter(w=>u(w)!=="iphone"),S=d??p[0],c=t.startsWith(f)?t.slice(f.length):void 0,m=c===void 0?void 0:n.get(c);return{key:t,label:m?.name??$(p[0],d)??l(S),owners:[...s,...p],...c===void 0?{}:{userId:c},...m?.picture===void 0?{}:{picture:m.picture}}})}function L(e,n){let r=l(e);return u(e)!=="iphone"?r:n.owners.some(a=>u(a)!=="iphone")&&r===n.label?"iPhone":r}function y(e){let n=(e??"").trim();if(n.startsWith("ha-panel:")){let r=n.slice(9).trim();return r===""?void 0:r}if(!(n===""||n==="ha-panel"))return n.startsWith("app-import:")||n.startsWith("watch-restore:")?"the app":n==="orphan-sweep"||n.startsWith("forget:")||n.startsWith("device-removed:")?"Home Assistant":n}function W(e){let n=y(e);return n===void 0?"":`by ${n}`}function v(e,n){let r=e?Date.parse(e):Number.NaN;return Number.isNaN(r)?void 0:b(Math.max(0,(n-r)/1e3))}function _(e,n=Date.now(),r){let i=e?new Date(e):void 0;if(i===void 0||Number.isNaN(i.getTime()))return;let a=new Date(n).getFullYear()===i.getFullYear(),t=i.toLocaleDateString(r,a?{day:"numeric",month:"short"}:{day:"numeric",month:"short",year:"numeric"}),o=i.toLocaleTimeString(r,{hour:"2-digit",minute:"2-digit"});return`${t}, ${o}`}function E(e,n,r=Date.now(),i){let a=_(n,r,i);return a===void 0?`Version ${e}`:`Version from ${a}`}function k(e,n=Date.now(),r){let i=_(e,n,r);return i===void 0?"That version is back.":`The version from ${i} is back.`}function F(e,n=Date.now()){if(e===null)return"This complication was deleted after you opened it.";let r=y(e.updatedBy)??"Someone",i=r.charAt(0).toUpperCase()+r.slice(1),a=v(e.updatedAt,n);return`${i} saved this complication${a===void 0?"":` ${a}`}, after you opened it.`}function K(e,n,r=Date.now()){let i=v(e,r),a=W(n);return["Saved",i,a].filter(t=>t!==void 0&&t!=="").join(" ")}var N=.145,R=.045,M=.018,A=.05;function H(e,n){let r=e*n;return{radius:Math.round(r*N),bezel:Math.round(r*R),rim:Math.max(2,Math.round(r*M)),crown:Math.round(r*A)}}function Y(e,n,r,i){let a=H(e.width,n),t=[`--wf-radius:${a.radius}px`,`--wf-bezel:${a.bezel}px`,`--wf-rim:${a.rim}px`,`--wf-crown:${a.crown}px`];if(e.height!==void 0&&e.height>0){let o=e.height*n+a.bezel*2,s=d=>`${Math.round(o*d*100)/100}px`;t.push(`--wf-crown-top:${s(.19)}`,`--wf-crown-h:${s(.16)}`,`--wf-button-top:${s(.42)}`,`--wf-button-h:${s(.22)}`)}return g`<div class="wa-watch" aria-label=${i??"Watch"} style=${t.join(";")}>${r}</div>`}var U=h`
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
`;export{D as a,I as b,L as c,W as d,_ as e,E as f,k as g,F as h,K as i,Y as j,U as k};
