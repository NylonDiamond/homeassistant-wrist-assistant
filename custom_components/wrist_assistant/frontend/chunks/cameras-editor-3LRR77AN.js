import{a as ne}from"./chunk-P7FG3CI7.js";import{a as ee,b as te,c as ie}from"./chunk-7E7TQLFM.js";import{C as re,d as _,e as Z,h as X,j as W,o as J,y as Q}from"./chunk-WDZJ6RME.js";import{b as D}from"./chunk-NKLOQSX6.js";import{Ug as j,Vg as G,Wg as Y,b as q,d as o,g as p,j as K,k as R,l as w,mh as x}from"./chunk-VWIMYR2L.js";import"./chunk-Q6MTLD6E.js";import{a as u}from"./chunk-LO2NM3CE.js";var M={x:0,y:0,w:1,h:1},ae=["nw","ne","sw","se"],k=(t,r,e)=>Math.min(e,Math.max(r,t)),S=(t,r)=>typeof t=="number"&&Number.isFinite(t)?t:r,h=t=>Math.round(t*1e4)/1e4;function ye(t){if(t==null)return{...M};let r=k(S(t.w,1),.12,1),e=k(S(t.h,1),.12,1),i=k(S(t.x,0),0,1-r),n=k(S(t.y,0),0,1-e);return{x:i,y:n,w:r,h:e}}function y(t){return t==null?!0:t.x<=.001&&t.y<=.001&&t.x+t.w>=1-.001&&t.y+t.h>=1-.001}function se(t,r,e,i){let n=t.x,a=t.y,s=t.x+t.w,d=t.y+t.h;return(r==="nw"||r==="sw")&&(n=Math.min(Math.max(0,t.x+e),s-.12)),(r==="ne"||r==="se")&&(s=Math.max(Math.min(1,t.x+t.w+e),n+.12)),(r==="nw"||r==="ne")&&(a=Math.min(Math.max(0,t.y+i),d-.12)),(r==="sw"||r==="se")&&(d=Math.max(Math.min(1,t.y+t.h+i),a+.12)),{x:n,y:a,w:s-n,h:d-a}}function z(t,r,e){return{x:k(t.x+r,0,1-t.w),y:k(t.y+e,0,1-t.h),w:t.w,h:t.h}}function H(t){return{viewport:ye(t.viewport),openZoomed:t.open_zoomed===!0,stream:t.stream?.override??null}}function T(t){return t.openZoomed&&!y(t.viewport)}function Ce(t,r){return y(t)&&y(r)?!0:h(t.x)===h(r.x)&&h(t.y)===h(r.y)&&h(t.w)===h(r.w)&&h(t.h)===h(r.h)}function oe(t,r){return Ce(t.viewport,r.viewport)&&T(t)===T(r)&&t.stream===r.stream}function O(t,r,e){let i=t.all_entity_ids.length>0?[...t.all_entity_ids]:[t.entity_id],n=y(r.viewport),a=r.viewport,s={entity_ids:i,viewport:n?null:{x:h(a.x),y:h(a.y),w:h(a.w),h:h(a.h)},open_zoomed:T(r)};return r.stream!==e.stream&&(s.stream_entity=r.stream),s}function de(t,r){let e=O(t,r,r);return{...t,viewport:e.viewport,open_zoomed:e.open_zoomed===!0,stream:{...t.stream,override:r.stream}}}function ce(t){return t?`Auto (detected: ${t})`:"Auto"}function le(t){return t.startsWith("camera.")?t.slice(7):t}function pe(t){if(t.ok&&t.sent>0)return{ok:!0,text:`Sent to ${t.sent} ${t.sent===1?"device":"devices"}.`};switch(t.reason){case"no_devices":return{ok:!1,text:"No device of yours is paired with this Home Assistant."};case"no_push_token":return{ok:!1,text:"Your devices have no push token yet. Open the app once."};case void 0:case"":return{ok:!1,text:"Not sent. No device took the alert."};default:return{ok:!1,text:`Not sent: ${t.reason}`}}}function I(t,r){let e=r>0&&Number.isFinite(r)?r:1.7777777777777777;return t.w*e/Math.max(t.h,1e-4)}function me(t,r){return!(t>0)||!(r>0)?{width:100,height:100}:t>=r?{width:100,height:r/t*100}:{width:t/r*100,height:100}}function ue(t){let r=Math.max(t.w,1e-4),e=Math.max(t.h,1e-4);return{width:100/r,height:100/e,left:-t.x/r*100,top:-t.y/e*100}}var c;function v(){return c}function he(t,r){return c={entityId:t,base:r,edit:r},c}function fe(t){c!==void 0&&(c={...c,edit:t})}function N(t,r){c!==void 0&&(c={...c,base:t,edit:r?c.edit:t})}function ve(){c!==void 0&&(c={...c,edit:c.base})}function f(){return c!==void 0&&!oe(c.edit,c.base)}function P(){c=void 0}re({dirty:f,drop:P});typeof window<"u"&&window.addEventListener("beforeunload",t=>{f()&&(t.preventDefault(),t.returnValue="")});var $e="How each camera's picture is cut in alerts, on iPhone and Apple Watch. Tiles on the watch have their own crop.",ke="No cameras in this Home Assistant.",Ee="Update the integration to frame cameras here.",ge="Motion detected",V=16/9,_e=176/140,Te=272/300,we=.01,Le=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),xe=Le?"\u2318":"Ctrl+";function Re(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function g(t){return`${Math.round(t*1e3)/1e3}%`}var m=class extends K{constructor(){super(...arguments);this.narrow=!1;this.barHost=void 0;this.headBar=new ee(this);this.unsupported=!1;this.loading=!1;this.saving=!1;this.testing=!1;this.pictures=new ne({fetch:e=>fetch(e),objectUrl:e=>URL.createObjectURL(e),revoke:e=>URL.revokeObjectURL(e),changed:()=>this.requestUpdate(),now:()=>Date.now()},200);this.aspects=new Map;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();!i.includes(this)&&!this.headBar.holds(i)&&!Re()||(e.metaKey||e.ctrlKey)&&!e.altKey&&e.key.toLowerCase()==="s"&&(e.preventDefault(),this.save())}}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),this.stopListeningForReconnect(),this.endDrag?.(),this.pictures.clear(),this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.askedOnce||(this.askedOnce=!0,this.load()))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}async load(e=!1){let i=this.hass;if(!i)return;let n=++this.loadSeq;e||(this.loading=this.cameras===void 0,this.loadError=void 0);try{let a=await j(i);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show(Array.isArray(a?.cameras)?a.cameras:[])}catch(a){if(n!==this.loadSeq)return;let{code:s,message:d}=D(a);s==="unknown_command"?(this.unsupported=!0,this.loadError=void 0):(!e||this.cameras===void 0)&&(this.loadError=d)}this.loading=!1}show(e){this.cameras=e;let i=v();if(i===void 0)return;let n=e.find(a=>a.entity_id===i.entityId);if(n===void 0){let a=f();P(),a&&(this.note={kind:"warn",text:"That camera is no longer in Home Assistant, so its unsaved framing was dropped."});return}N(H(n),f())}cameraOf(e){return this.cameras?.find(i=>i.entity_id===e)}pictureAddress(e){let i=this.hass?.states[e]?.attributes?.entity_picture;return typeof i=="string"&&i!==""?i:void 0}refreshPictures(){for(let e of this.cameras??[]){let i=this.pictureAddress(e.entity_id);i!==void 0&&this.pictures.refresh(e.entity_id,i)}this.requestUpdate()}openCamera(e){if(v()?.entityId===e.entity_id){this.requestUpdate();return}f()&&!window.confirm("You have unsaved changes. Discard them?")||(he(e.entity_id,H(e)),this.note=void 0,this.testLine=void 0,this.requestUpdate(),this.scrollTop=0)}closeCamera(){this.saving||this.testing||f()&&!window.confirm("You have unsaved changes. Discard them?")||(P(),this.note=void 0,this.testLine=void 0,this.requestUpdate())}setEdit(e){this.saving||(fe(e),this.requestUpdate())}discard(){this.saving||!f()||(ve(),this.note=void 0,this.requestUpdate())}async save(){let e=this.hass,i=v(),n=i===void 0?void 0:this.cameraOf(i.entityId);if(!e||i===void 0||n===void 0||this.saving)return!1;if(!f())return!0;let a=i.edit;this.saving=!0,this.note=void 0,this.loadSeq++;let s=!1;try{await G(e,O(n,a,i.base)),s=!0,this.cameras=(this.cameras??[]).map(d=>d.entity_id===n.entity_id?de(d,a):d),v()?.entityId===n.entity_id&&N(a,!1)}catch(d){this.note={kind:"err",text:`Not saved. ${D(d).message}`}}return this.saving=!1,this.load(!0),s}async sendTest(){let e=this.hass,i=v(),n=i===void 0?void 0:this.cameraOf(i.entityId);if(!(!e||n===void 0||this.testing||this.saving)&&(this.testLine=void 0,!(f()&&!await this.save()))){this.testing=!0;try{this.testLine=pe(await Y(e,n.entity_id,n.name,ge))}catch(a){this.testLine={ok:!1,text:`Not sent. ${D(a).message}`}}this.testing=!1}}beginDrag(e,i){if(e.button!==0||this.saving)return;let n=v(),s=this.renderRoot.querySelector(".cm-overlay")?.getBoundingClientRect();if(n===void 0||s===void 0||s.width<=0||s.height<=0)return;e.preventDefault(),e.stopPropagation(),this.endDrag?.();let d=e.currentTarget,l=n.edit.viewport,C=e.clientX,$=e.clientY;try{d.setPointerCapture(e.pointerId)}catch{}let b=E=>{if(E.pointerId!==e.pointerId)return;let F=v();if(F===void 0||F.entityId!==n.entityId)return;let U=(E.clientX-C)/s.width,B=(E.clientY-$)/s.height,be=i===void 0?z(l,U,B):se(l,i,U,B);this.setEdit({...F.edit,viewport:be})},L=E=>{E.pointerId===e.pointerId&&A()},A=()=>{d.removeEventListener("pointermove",b),d.removeEventListener("pointerup",L),d.removeEventListener("pointercancel",L);try{d.releasePointerCapture(e.pointerId)}catch{}this.endDrag===A&&(this.endDrag=void 0)};d.addEventListener("pointermove",b),d.addEventListener("pointerup",L),d.addEventListener("pointercancel",L),this.endDrag=A}onBoxKey(e){let i=v();if(i===void 0)return;let n=e.shiftKey?we*5:we,s={ArrowLeft:[-n,0],ArrowRight:[n,0],ArrowUp:[0,-n],ArrowDown:[0,n]}[e.key];s!==void 0&&(e.preventDefault(),this.setEdit({...i.edit,viewport:z(i.edit.viewport,s[0],s[1])}))}updated(){this.headBar.draw(this.barHost,()=>{let e=v();return this.renderBar(e,e===void 0?void 0:this.cameraOf(e.entityId))})}render(){let e=v(),i=e===void 0?void 0:this.cameraOf(e.entityId);return o`
      <div class="cm-top">
        ${this.barHost===void 0?this.renderBar(e,i):e!==void 0&&i!==void 0?o`<div class="cm-crumbline">${this.renderCrumb(i)}</div>`:p}
        <p class="cm-lead">${$e}</p>
        ${this.note?o`<div class="cm-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="cm-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${e!==void 0&&i!==void 0?this.renderEditor(i,e):this.renderBody()}
    `}renderBar(e,i){let n=e!==void 0&&i!==void 0,a=n&&f(),s=this.barHost!==void 0;return o`<div class="wa-bar ${s?"in-head":this.narrow?"stacked":""}" role="toolbar" aria-label="Cameras">
      ${s?p:o`<span class="cm-title"><b>Cameras</b>${n?this.renderCrumb(i):p}</span>`}
      <span class="spacer"></span>
      ${s&&n?te({newWatch:!1,dirty:a}):p}
      ${n?o`
        <button class="cm-btn" ?disabled=${!a||this.saving} title="Go back to the framing Home Assistant holds"
          @click=${()=>this.discard()}>Discard</button>
        <button class="primary save ${a?"dirty":""}" ?disabled=${!a||this.saving}
          title=${a?`Save (${xe}S)`:`Nothing to save (${xe}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${s?p:o`<span class="tb-saved">${a?"Unsaved changes":""}</span>`}`:this.cameras!==void 0&&this.cameras.length>0?o`<button class="cm-btn" title="Take a new frame from every camera"
          @click=${()=>this.refreshPictures()}>${x("reset")}<span>Refresh pictures</span></button>`:p}
    </div>`}renderCrumb(e){return o`<span class="cm-crumb">
      <button class="cm-back" ?disabled=${this.saving||this.testing} title="Back to every camera" @click=${()=>this.closeCamera()}>${x("left")}<span>All cameras</span></button>
      <span class="cm-cur">${e.name}</span></span>`}renderBody(){if(this.unsupported)return o`<div class="cm-calm"><div class="cm-empty"><b>${Ee}</b></div></div>`;if(this.loadError!==void 0)return o`<div class="cm-calm"><div class="cm-empty">
        <span>Could not read the cameras: ${this.loadError}</span>
        <button class="cm-btn" @click=${()=>{this.load()}}>Try again</button>
      </div></div>`;let e=this.cameras;return this.loading||e===void 0?o`<div class="cm-calm"><div class="cm-empty">Loading…</div></div>`:e.length===0?o`<div class="cm-calm"><div class="cm-empty"><b>${ke}</b></div></div>`:o`<div class="cm-grid">${e.map(i=>this.renderCard(i))}</div>`}renderCard(e){let i=!y(e.viewport),n=e.viewport??M,a=e.stream?.override??null;return o`<button type="button" class="cm-card" data-camera=${e.entity_id} @click=${()=>this.openCamera(e)}>
      ${this.renderPicture(e.entity_id,n,V)}
      <span class="cm-card-text">
        <span class="cm-card-name">${i?o`<i class="cm-dot" title="Framed" aria-hidden="true"></i>`:p}<b>${e.name}</b></span>
        <span class="cm-card-sub">${i?e.open_zoomed?"Framed, watch opens zoomed":"Framed":"Full frame"}</span>
        ${a===null?p:o`<span class="cm-card-sub">Tap opens ${le(a)}</span>`}
      </span>
    </button>`}renderPicture(e,i,n,a=""){let s=this.pictureAddress(e),d=s===void 0?void 0:this.pictures.urlFor(e,s),l=`aspect-ratio: ${n}`;if(d===void 0){let b=s===void 0||this.pictures.failing(e);return o`<span class="cm-pic ${a} ${b?"none":"wait"}" style=${l}>${b?o`<span>No picture</span>`:p}</span>`}let C=me(I(i,this.aspects.get(e)??V),n),$=ue(i);return o`<span class="cm-pic ${a}" style=${l}>
      <span class="cm-crop" style=${`width:${g(C.width)};height:${g(C.height)}`}>
        <img alt="" draggable="false" src=${d} @load=${b=>this.noteAspect(e,b.target)}
          style=${`width:${g($.width)};height:${g($.height)};left:${g($.left)};top:${g($.top)}`}>
      </span>
    </span>`}noteAspect(e,i){if(!(i.naturalWidth>0)||!(i.naturalHeight>0))return;let n=i.naturalWidth/i.naturalHeight;Math.abs((this.aspects.get(e)??0)-n)<.001||(this.aspects.set(e,n),this.requestUpdate())}renderEditor(e,i){let n=i.edit,a=y(n.viewport);return o`<div class="cm-edit">
      <section class="sec cm-stage-sec" style=${`--c:${_.position}`}>
        ${this.secHead(x("image"),"Framing",a?"Full frame":"Cropped")}
        <div class="sec-b">
          ${this.renderStage(e,n)}
          <p class="hint keep">Drag a corner to resize the box, or drag inside it to move it. Arrow keys move it too.</p>
          <div class="cm-row">
            <button class="cm-btn" ?disabled=${a||this.saving} @click=${()=>this.setEdit({...n,viewport:{...M}})}>
              ${x("reset")}<span>Reset to full frame</span></button>
          </div>
        </div>
      </section>
      <div class="cm-side">
        <section class="sec" style=${`--c:${_.tap}`}>
          ${this.secHead(x("tap"),"Live stream on tap")}
          <div class="sec-b">
            ${this.renderStreamSelect(e,n)}
            <p class="hint keep">The stream the watch opens when the alert's picture is tapped.</p>
            <label class="cm-check">
              <input type="checkbox" .checked=${T(n)} ?disabled=${a||this.saving}
                @change=${s=>this.setEdit({...n,openZoomed:s.target.checked})}>
              <span>Open the watch's live view zoomed to this crop</span>
            </label>
            ${a?o`<p class="hint keep">Set a crop first.</p>`:p}
          </div>
        </section>
        <section class="sec" style=${`--c:${_.numbers}`}>
          ${this.secHead(x("check"),"Test")}
          <div class="sec-b">
            <p class="hint keep">Sends a real alert with this camera's picture to every device of yours paired with this Home Assistant.${f()?" Your changes are saved first.":""}</p>
            <div class="cm-row">
              <button class="cm-btn" ?disabled=${this.testing||this.saving} @click=${()=>{this.sendTest()}}>
                ${this.testing?"Sending\u2026":"Send a test alert"}</button>
            </div>
            ${this.testLine?o`<p class="cm-result ${this.testLine.ok?"ok":"err"}" role="status">${this.testLine.text}</p>`:p}
          </div>
        </section>
        <section class="sec" style=${`--c:${_.look}`}>
          ${this.secHead(x("phone"),"Preview")}
          <div class="sec-b cm-previews">
            ${this.renderAlert(e,n.viewport,"phone")}
            ${this.renderAlert(e,n.viewport,"watch")}
          </div>
        </section>
      </div>
    </div>`}secHead(e,i,n){return o`<div class="sec-h pinned">
      <span class="swatch">${e}</span>
      <span class="tt"><h4>${i}</h4>${n?o`<span class="sum">${n}</span>`:p}</span>
    </div>`}renderStage(e,i){let n=this.pictureAddress(e.entity_id),a=n===void 0?void 0:this.pictures.urlFor(e.entity_id,n);if(a===void 0){let l=n===void 0||this.pictures.failing(e.entity_id);return o`<div class="cm-stage"><span class="cm-pic cm-stage-wait ${l?"none":"wait"}">
        <span>${l?"No picture from this camera, so there is nothing to frame against.":"Loading the picture\u2026"}</span></span></div>`}let s=i.viewport,d=`left:${g(s.x*100)};top:${g(s.y*100)};width:${g(s.w*100)};height:${g(s.h*100)}`;return o`<div class="cm-stage">
      <div class="cm-frame">
        <img class="cm-still" alt="" draggable="false" src=${a} @load=${l=>this.noteAspect(e.entity_id,l.target)}>
        <div class="cm-dim" aria-hidden="true"><span class="cm-hole" style=${d}></span></div>
        <div class="cm-overlay">
          <div class="cm-box" style=${d} tabindex="0" role="group" aria-label="Crop box"
            @pointerdown=${l=>this.beginDrag(l)} @keydown=${l=>this.onBoxKey(l)}>
            ${ae.map(l=>o`<span class="cm-handle ${l}" aria-hidden="true"
              @pointerdown=${C=>this.beginDrag(C,l)}></span>`)}
          </div>
        </div>
      </div>
    </div>`}renderStreamSelect(e,i){let n=[...e.stream_choices??[]];return i.stream!==null&&!n.includes(i.stream)&&n.push(i.stream),o`<select class="cm-select" aria-label="Live stream on tap" ?disabled=${this.saving}
      @change=${a=>{let s=a.target.value;this.setEdit({...i,stream:s===""?null:s})}}>
      <option value="" ?selected=${i.stream===null}>${ce(e.stream?.auto)}</option>
      ${n.map(a=>o`<option value=${a} ?selected=${i.stream===a}>${a}</option>`)}
    </select>`}renderAlert(e,i,n){let a=I(i,this.aspects.get(e.entity_id)??V),s=Math.max(a,n==="watch"?_e:Te);return o`<figure class="cm-alert ${n}">
      <div class="cm-alert-card">
        <b>${e.name}</b>
        <span>${ge}</span>
        ${this.renderPicture(e.entity_id,i,s,"cm-alert-pic")}
        <span class="cm-alert-done">Done</span>
      </div>
      <figcaption>${n==="watch"?"Apple Watch":"iPhone"}</figcaption>
    </figure>`}static{this.styles=[Q,X,W,J,q`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .cm-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 12px;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    .cm-title { display: inline-flex; align-items: center; gap: 10px; min-width: 0; padding-left: 4px; }
    .cm-title > b { font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); white-space: nowrap; }
    .cm-crumb { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
    button.cm-back {
      display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 8px 0 4px; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 13px; color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong);
    }
    button.cm-back:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
    button.cm-back:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.cm-back:disabled { opacity: .45; cursor: default; }
    .cm-cur { font-size: 14px; font-weight: 600; min-width: 0; overflow-wrap: anywhere; }
    .cm-crumbline { display: flex; align-items: center; padding: 10px var(--cf-pad, 16px) 0; }
    .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .cm-lead { margin: 10px var(--cf-pad, 16px) 0; font-size: 13px; color: var(--wa-muted); }
    .cm-note {
      display: flex; align-items: center; gap: 10px; margin: 10px var(--cf-pad, 16px) 0; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .cm-note > span { flex: 1; min-width: 0; }
    .cm-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .cm-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .cm-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .cm-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .cm-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .cm-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 30px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    .cm-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .cm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .cm-btn:disabled { opacity: .5; cursor: default; }
    /* Nothing to list yet: one calm card in the middle. */
    .cm-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px 0; }
    .cm-empty {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
      padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .cm-empty > b { font-size: 15px; }

    /* The list: one card per camera, the Watch app's blue on its lit
       outline, and a green dot on a camera that is framed. */
    .cm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; align-content: start; }
    button.cm-card {
      --c: var(--wa-hue-blue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 10px; text-align: left;
      border-radius: var(--wa-lc-r, 10px); font: inherit; color: var(--wa-ink); cursor: pointer;
      ${Z}
    }
    button.cm-card:hover { --lo-fill: var(--wa-hover); }
    button.cm-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .cm-card-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; padding: 0 2px 2px; }
    .cm-card-name { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .cm-card-name b { font-size: 14px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cm-card-sub { font-size: 12.5px; color: var(--wa-muted); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cm-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--wa-green); }

    /* A picture well: black, the crop centred in it, the full frame drawn
       inside the crop and clipped by it. */
    .cm-pic {
      position: relative; display: flex; align-items: center; justify-content: center; width: 100%;
      overflow: hidden; border-radius: 6px; background: #000;
    }
    .cm-pic.none, .cm-pic.wait { background: var(--wa-field); }
    .cm-pic.none > span { font-size: 12.5px; color: var(--wa-muted); padding: 0 12px; text-align: center; }
    .cm-crop { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: block; overflow: hidden; }
    .cm-crop > img { position: absolute; display: block; max-width: none; user-select: none; -webkit-user-drag: none; }

    /* The editor: the still and its box on the left, the rest beside it. */
    .cm-edit { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr); gap: 12px; align-items: start; }
    .cm-side { display: flex; flex-direction: column; gap: 0; min-width: 0; }
    .cm-edit .sec { margin: 0 0 12px; }
    .cm-edit .sec-b { display: flex; flex-direction: column; gap: 8px; }
    .cm-edit .sec-b > .hint { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
    .cm-row { display: flex; flex-wrap: wrap; gap: 8px; }
    /* Room round the still for the corner handles, which reach past it. */
    .cm-stage { display: flex; justify-content: center; padding: 10px 0; }
    .cm-stage-wait { aspect-ratio: 16 / 9; }
    /* The frame hugs the still, so the box's percentages are the still's. */
    .cm-frame { position: relative; display: inline-block; line-height: 0; max-width: 100%; }
    .cm-still { display: block; max-width: 100%; max-height: min(62vh, 620px); border-radius: 6px; user-select: none; -webkit-user-drag: none; }
    .cm-dim { position: absolute; inset: 0; overflow: hidden; border-radius: 6px; pointer-events: none; }
    .cm-hole { position: absolute; box-shadow: 0 0 0 9999px rgba(0, 0, 0, .55); }
    .cm-overlay { position: absolute; inset: 0; }
    .cm-box { position: absolute; border: 2px solid #fff; cursor: move; touch-action: none; }
    .cm-box:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-accent); }
    .cm-handle { position: absolute; width: 28px; height: 28px; margin: -14px 0 0 -14px; touch-action: none; }
    .cm-handle::after {
      content: ""; position: absolute; left: 6px; top: 6px; width: 16px; height: 16px; border-radius: 50%;
      background: #fff; box-shadow: 0 0 0 1px rgba(0, 0, 0, .35), 0 1px 3px rgba(0, 0, 0, .4);
    }
    .cm-handle.nw { left: 0; top: 0; cursor: nwse-resize; }
    .cm-handle.ne { left: 100%; top: 0; cursor: nesw-resize; }
    .cm-handle.sw { left: 0; top: 100%; cursor: nesw-resize; }
    .cm-handle.se { left: 100%; top: 100%; cursor: nwse-resize; }
    select.cm-select { width: 100%; min-width: 0; }
    label.cm-check { display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; }
    label.cm-check:has(input:disabled) { color: var(--wa-muted); cursor: default; }
    .cm-result { font-size: 13px; }
    .cm-result.ok { color: var(--wa-green); }
    .cm-result.err { color: var(--wa-need); }

    /* The alert previews: the notification's own black card, on either skin. */
    .cm-previews { flex-direction: row !important; flex-wrap: wrap; align-items: flex-start; justify-content: center; gap: 16px !important; }
    figure.cm-alert { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    figure.cm-alert.phone { width: 260px; max-width: 100%; }
    figure.cm-alert.watch { width: 176px; }
    figure.cm-alert figcaption { font-size: 11.5px; color: var(--wa-muted); }
    .cm-alert-card {
      display: flex; flex-direction: column; gap: 2px; width: 100%; padding: 12px; border-radius: 20px;
      background: #000; color: #fff; border: 1px solid rgba(255, 255, 255, .18);
    }
    .watch .cm-alert-card { padding: 9px; border-radius: 24px; }
    .cm-alert-card > b { font-size: 15px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .watch .cm-alert-card > b { font-size: 13.5px; }
    .cm-alert-card > span:not(.cm-pic):not(.cm-alert-done) { font-size: 13px; color: rgba(255, 255, 255, .5); margin-bottom: 6px; }
    .watch .cm-alert-card > span:not(.cm-pic):not(.cm-alert-done) { font-size: 11.5px; }
    .cm-alert-card .cm-pic { border-radius: 12px; }
    .cm-alert-card .cm-pic.none, .cm-alert-card .cm-pic.wait { background: #1c1c1e; }
    .cm-alert-done {
      margin-top: 8px; padding: 8px 0; text-align: center; border-radius: 14px; font-size: 14px; font-weight: 600;
      color: rgba(255, 255, 255, .85); background: rgba(255, 255, 255, .1);
    }
    .watch .cm-alert-done { font-size: 13px; padding: 6px 0; }

    @container (max-width: 820px) {
      .cm-edit { grid-template-columns: minmax(0, 1fr); }
    }
    :host([narrow]) { --cf-pad: 12px; }
  `,ie]}};u([R({attribute:!1})],m.prototype,"hass",2),u([R({type:Boolean,reflect:!0})],m.prototype,"narrow",2),u([R({attribute:!1})],m.prototype,"barHost",2),u([w()],m.prototype,"cameras",2),u([w()],m.prototype,"unsupported",2),u([w()],m.prototype,"loading",2),u([w()],m.prototype,"loadError",2),u([w()],m.prototype,"note",2),u([w()],m.prototype,"saving",2),u([w()],m.prototype,"testing",2),u([w()],m.prototype,"testLine",2);customElements.get("wa-cameras-editor")||customElements.define("wa-cameras-editor",m);export{ke as CAMERAS_EMPTY_TEXT,$e as CAMERAS_LEAD,Ee as CAMERAS_UPDATE_TEXT,m as WaCamerasEditor};
