var Kl=Object.defineProperty;var Wl=Object.getOwnPropertyDescriptor;var L=(e,t,n,i)=>{for(var a=i>1?void 0:i?Wl(t,n):t,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(t,n,a):o(a))||a);return i&&a&&Kl(t,n,a),a};var _n=globalThis,zn=_n.ShadowRoot&&(_n.ShadyCSS===void 0||_n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Hi=Symbol(),hr=new WeakMap,tn=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==Hi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(zn&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=hr.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&hr.set(n,t))}return t}toString(){return this.cssText}},ge=e=>new tn(typeof e=="string"?e:e+"",void 0,Hi),Li=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new tn(n,e,Hi)},mr=(e,t)=>{if(zn)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),a=_n.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=n.cssText,e.appendChild(i)}},_i=zn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return ge(n)})(e):e;var{is:jl,defineProperty:ql,getOwnPropertyDescriptor:Yl,getOwnPropertyNames:Jl,getOwnPropertySymbols:Xl,getPrototypeOf:Zl}=Object,Nn=globalThis,fr=Nn.trustedTypes,Ql=fr?fr.emptyScript:"",ed=Nn.reactiveElementPolyfillSupport,nn=(e,t)=>e,an={toAttribute(e,t){switch(t){case Boolean:e=e?Ql:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Pn=(e,t)=>!jl(e,t),gr={attribute:!0,type:String,converter:an,reflect:!1,useDefault:!1,hasChanged:Pn};Symbol.metadata??=Symbol("metadata"),Nn.litPropertyMetadata??=new WeakMap;var Be=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=gr){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,n);a!==void 0&&ql(this.prototype,t,a)}}static getPropertyDescriptor(t,n,i){let{get:a,set:r}=Yl(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gr}static _$Ei(){if(this.hasOwnProperty(nn("elementProperties")))return;let t=Zl(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(nn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nn("properties"))){let n=this.properties,i=[...Jl(n),...Xl(n)];for(let a of i)this.createProperty(a,n[a])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,a]of n)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let a=this._$Eu(n,i);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)n.unshift(_i(a))}else t!==void 0&&n.push(_i(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mr(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:an).toAttribute(n,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,n){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:an;this._$Em=a;let s=o.fromAttribute(n,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(t,n,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Pn)(r,n)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Be.elementStyles=[],Be.shadowRootOptions={mode:"open"},Be[nn("elementProperties")]=new Map,Be[nn("finalized")]=new Map,ed?.({ReactiveElement:Be}),(Nn.reactiveElementVersions??=[]).push("2.1.2");var Bi=globalThis,yr=e=>e,On=Bi.trustedTypes,br=On?On.createPolicy("lit-html",{createHTML:e=>e}):void 0,Cr="$lit$",nt=`lit$${Math.random().toFixed(9).slice(2)}$`,Sr="?"+nt,td=`<${Sr}>`,xt=document,on=()=>xt.createComment(""),sn=e=>e===null||typeof e!="object"&&typeof e!="function",Gi=Array.isArray,nd=e=>Gi(e)||typeof e?.[Symbol.iterator]=="function",zi=`[ 	
\f\r]`,rn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,vr=/-->/g,xr=/>/g,bt=RegExp(`>|${zi}(?:([^\\s"'>=/]+)(${zi}*=${zi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),wr=/'/g,kr=/"/g,Er=/^(?:script|style|textarea|title)$/i,Ui=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),p=Ui(1),b=Ui(2),ch=Ui(3),wt=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),$r=new WeakMap,vt=xt.createTreeWalker(xt,129);function Tr(e,t){if(!Gi(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return br!==void 0?br.createHTML(t):t}var id=(e,t)=>{let n=e.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=rn;for(let s=0;s<n;s++){let l=e[s],d,c,u=-1,h=0;for(;h<l.length&&(o.lastIndex=h,c=o.exec(l),c!==null);)h=o.lastIndex,o===rn?c[1]==="!--"?o=vr:c[1]!==void 0?o=xr:c[2]!==void 0?(Er.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=bt):c[3]!==void 0&&(o=bt):o===bt?c[0]===">"?(o=a??rn,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?bt:c[3]==='"'?kr:wr):o===kr||o===wr?o=bt:o===vr||o===xr?o=rn:(o=bt,a=void 0);let f=o===bt&&e[s+1].startsWith("/>")?" ":"";r+=o===rn?l+td:u>=0?(i.push(d),l.slice(0,u)+Cr+l.slice(u)+nt+f):l+nt+(u===-2?s:f)}return[Tr(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},ln=class e{constructor({strings:t,_$litType$:n},i){let a;this.parts=[];let r=0,o=0,s=t.length-1,l=this.parts,[d,c]=id(t,n);if(this.el=e.createElement(d,i),vt.currentNode=this.el.content,n===2||n===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=vt.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Cr)){let h=c[o++],f=a.getAttribute(u).split(nt),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:r,name:g[2],strings:f,ctor:g[1]==="."?Pi:g[1]==="?"?Oi:g[1]==="@"?Di:zt}),a.removeAttribute(u)}else u.startsWith(nt)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(Er.test(a.tagName)){let u=a.textContent.split(nt),h=u.length-1;if(h>0){a.textContent=On?On.emptyScript:"";for(let f=0;f<h;f++)a.append(u[f],on()),vt.nextNode(),l.push({type:2,index:++r});a.append(u[h],on())}}}else if(a.nodeType===8)if(a.data===Sr)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(nt,u+1))!==-1;)l.push({type:7,index:r}),u+=nt.length-1}r++}}static createElement(t,n){let i=xt.createElement("template");return i.innerHTML=t,i}};function _t(e,t,n=e,i){if(t===wt)return t;let a=i!==void 0?n._$Co?.[i]:n._$Cl,r=sn(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=a:n._$Cl=a),a!==void 0&&(t=_t(e,a._$AS(e,t.values),a,i)),t}var Ni=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,a=(t?.creationScope??xt).importNode(n,!0);vt.currentNode=a;let r=vt.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new dn(r,r.nextSibling,this,t):l.type===1?d=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(d=new Vi(r,this,t)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=vt.nextNode(),o++)}return vt.currentNode=xt,a}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},dn=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=_t(this,t,n),sn(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==wt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):nd(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&sn(this._$AH)?this._$AA.nextSibling.data=t:this.T(xt.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ln.createElement(Tr(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new Ni(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=$r.get(t.strings);return n===void 0&&$r.set(t.strings,n=new ln(t)),n}k(t){Gi(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,a=0;for(let r of t)a===n.length?n.push(i=new e(this.O(on()),this.O(on()),this,this.options)):i=n[a],i._$AI(r),a++;a<n.length&&(this._$AR(i&&i._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=yr(t).nextSibling;yr(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},zt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(t,n=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=_t(this,t,n,0),o=!sn(t)||t!==this._$AH&&t!==wt,o&&(this._$AH=t);else{let s=t,l,d;for(t=r[0],l=0;l<r.length-1;l++)d=_t(this,s[i+l],n,l),d===wt&&(d=this._$AH[l]),o||=!sn(d)||d!==this._$AH[l],d===m?t=m:t!==m&&(t+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Pi=class extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},Oi=class extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},Di=class extends zt{constructor(t,n,i,a,r){super(t,n,i,a,r),this.type=5}_$AI(t,n=this){if((t=_t(this,t,n,0)??m)===wt)return;let i=this._$AH,a=t===m&&i!==m||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Vi=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){_t(this,t)}};var ad=Bi.litHtmlPolyfillSupport;ad?.(ln,dn),(Bi.litHtmlVersions??=[]).push("3.3.3");var Fr=(e,t,n)=>{let i=n?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=n?.renderBefore??null;i._$litPart$=a=new dn(t.insertBefore(on(),r),r,void 0,n??{})}return a._$AI(e),a};var Ki=globalThis,it=class extends Be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fr(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return wt}};it._$litElement$=!0,it.finalized=!0,Ki.litElementHydrateSupport?.({LitElement:it});var rd=Ki.litElementPolyfillSupport;rd?.({LitElement:it});(Ki.litElementVersions??=[]).push("4.2.2");var od={attribute:!0,type:String,converter:an,reflect:!1,hasChanged:Pn},sd=(e=od,t,n)=>{let{kind:i,metadata:a}=n,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(s){let l=t.get.call(this);t.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=n;return function(s){let l=this[o];t.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function Nt(e){return(t,n)=>typeof n=="object"?sd(e,t,n):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,t,n)}function _(e){return Nt({...e,state:!0,attribute:!1})}var Ge="wrist_assistant/complications";async function Mr(e){return e.connection.sendMessagePromise({type:`${Ge}/owners`})}async function Rr(e,t){return e.connection.sendMessagePromise({type:`${Ge}/list`,owner_watch_id:t})}async function Ir(e,t){return e.connection.sendMessagePromise({type:`${Ge}/nudge`,owner_watch_id:t})}async function Ar(e,t,n,i){return e.connection.sendMessagePromise({type:`${Ge}/save`,owner_watch_id:t,document:n,base_revision:i})}async function Hr(e,t,n,i){return e.connection.sendMessagePromise({type:`${Ge}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function Lr(e,t,n){return e.connection.sendMessagePromise({type:`${Ge}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function _r(e,t,n){let i={type:`${Ge}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function zr(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ge}/render_values`,templates:t})).results}async function Nr(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ge}/history_series`,requests:t})).results}var ie=["rectangular","circular","corner"],ue={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},ld=["rectangular","circular","corner","inline"];var qi=64;function jr(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<qi;i++)if(!n.has(i))return i;return-1}function hn(e){return ie.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var Pt=[["latest","Newest reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Ue={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Te={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Ot="#FFFFFF",Gn=24,mn="#FF6B35",fn="#32D74B",Yi="#32D74B",st="#FF453A",Dt="#FF453A",Vt="#FFFFFF99";function gn(e){return[...e.bands].sort((t,n)=>t.upTo-n.upTo)}function qr(e){return e.coloring==="bands"&&e.bands.length>0}function Ji(e,t,n){for(let i of t)if(e<=i.upTo)return i.colorHex;return n}function Yr(e,t){let n=Math.abs(t),i=n>=10?0:n>=1?1:2;return e.toFixed(i)}var Un=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Kn=360,Xi=10080,Zi=2,Wn=120,Qi=0;function Jr(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?t<1?Qi:Math.max(Zi,Math.min(Wn,t)):24}function Xr(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function kt(e){let t=Xr(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${Jr(e)}`}function Zr(e){return ea(e).map(t=>t.key).sort().join(";")}function ea(e){let t=new Map,n=i=>{t.has(i.key)||t.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=kt(i.payload),r=Xr(i.payload);if(a===void 0||r===void 0)continue;n({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:Jr(i.payload),mode:"numeric"})}else if(i.kind==="timeline"){let a=ct(i.payload),r=ao(i.payload);if(a===void 0||r===void 0)continue;n({key:a,entityId:r,minutes:Ne(i.payload),points:dt,mode:"states"})}return[...t.values()]}var Qr=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],eo=[["auto","Auto"],["always","Always"],["never","Never"]];function dd(e){return e==="h12"||e==="h24"?e:na}function cd(e){return e==="always"||e==="never"?e:ia}function ud(e){if(e.timeLabelCount!==void 0){let t=Number(e.timeLabelCount);return Number.isFinite(t)?Math.max(0,Math.min(vn,Math.round(t))):ji}return e.timeLabels==="ends"?2:e.timeLabels==="four"?4:ji}function to(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(t,n)=>n/(e-1))}var lt="#8E8E93",no=1,pd="#000000",hd=2,md=1440,ta=60,ji=0,yn=9,bn="#8E8E93",na="auto",ia="auto",fd=4,vn=12,xn=1,wn=20,jn=4,dt=120;function io(e,t,n){let i=e.trim().toLowerCase();for(let a of t)if(a.match.trim().toLowerCase()===i)return a.colorHex;return n}function Ne(e){let t=Math.round(e.historyMinutes);return Number.isFinite(t)?Math.max(1,Math.min(Xi,t)):ta}function ao(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function ct(e){let t=ao(e);if(t!==void 0)return`${t}|${Ne(e)}|${dt}|states`}var gd={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},aa={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function Vn(e){return gd[e.trim().toLowerCase()]??lt}var yd=["door","garage_door","window","opening"];function ra(e,t){let n=(t??"").trim().toLowerCase(),i=e==="binary_sensor"&&yd.includes(n),a=o=>Vn(i&&o==="on"?"open":o);return[...aa[e]??[],"unavailable","unknown"].map(o=>({id:Z(),match:o,colorHex:a(o)}))}var Bt=6,Gt=9,bd=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ke(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function oa(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var sa={top:0,left:0,bottom:0,right:0};function qn(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var vd=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function ro(e){return vd.includes(e)}function oo(e){let t=(e??"").trim();if(t==="")return!0;try{let n=JSON.parse(t);return typeof n=="object"&&n!==null&&!Array.isArray(n)}catch{return!1}}var la=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function We(e){let t=la.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?t:`${t}: ${i}`}if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function U(e,t=""){return typeof e=="string"?e:t}function K(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function Le(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function pn(e){return e==null?void 0:K(e,0)}function ye(e){return typeof e=="string"?e:void 0}var _e=class extends Error{};function rt(e){if(typeof e.entityId!="string")throw new _e("entityId is required");let t={entityId:e.entityId,displayName:U(e.displayName),domain:U(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function Pr(e){if(!F(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=K(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=K(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=K(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),e.duration===!0&&(t.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),Pe(t)?void 0:t}function Pe(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function xd(e){let t=U(e.function,"count"),n=F(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(F).map(rt)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let a={function:t,scope:i};if(F(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:U(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Or(e){switch(e.kind){case"literal":return{kind:"literal",value:U(e.value)};case"entityState":return{kind:"entityState",...rt(e)};case"entityAttribute":return{kind:"entityAttribute",...rt(e),attribute:U(e.attribute)};case"entityAge":return{kind:"entityAge",...rt(e)};case"aggregate":return{kind:"aggregate",aggregate:xd(F(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ye(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:U(e.value)};case"named":return{kind:"named",id:U(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:U(e.layer).toUpperCase(),stat:Pt.some(([t])=>t===e.stat)?e.stat:"latest"};default:throw new _e(`unknown value kind ${String(e.kind)}`)}}function ce(e){if(!F(e))throw new _e("value must be an object");if(F(e.kind)){let i={kind:Or(e.kind)},a=Pr(e.format);return a&&(i.format=a),i}let t={kind:Or(e)},n=Pr(e.format);return n&&(t.format=n),t}function so(e){return F(e)?{x:K(e.x,.25),y:K(e.y,.25),width:K(e.width,.5),height:K(e.height,.5),rotationDegrees:K(e.rotationDegrees,0)}:{...Ue}}function wd(e){if(!F(e))return{kind:"isOn"};let t=U(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=F(e.value)?ce(e.value):R("");break;case"between":n.value=F(e.value)?ce(e.value):R(""),n.upper=F(e.upper)?ce(e.upper):R("");break;case"matchesRegex":n.pattern=U(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function Dr(e){if(!F(e))return{kind:"show"};let t=U(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=F(e.value)?ce(e.value):R("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=K(e.number,0);break;case"setFontWeight":n.weight=ye(e.weight)??"regular";break;default:break}return n}function lo(e){return Array.isArray(e)?e.filter(F).map(t=>{let n={id:U(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(F).map(i=>{let a=F(i.when)?i.when:{};return{id:U(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(F).map(r=>({id:U(r.id).toUpperCase(),value:F(r.value)?ce(r.value):R(""),comparison:wd(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Dr)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(Dr)),n}):[]}function kd(e,t){return{baseColorHex:F(e)?U(e.baseColorHex,t):t}}function co(e){return Array.isArray(e)?e.filter(F).map(t=>({id:U(t.id,Z()),upTo:K(t.upTo,0),colorHex:U(t.colorHex,"#FFFFFF")})):[]}function $d(e){if(Array.isArray(e.bands))return co(e.bands);if(typeof e.bandLowerBound!="number")return[];let t=F(e.colorSlot)?U(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:Z(),upTo:e.bandLowerBound,colorHex:U(e.bandLowColorHex,Yi)},{id:Z(),upTo:K(e.bandUpperBound,100),colorHex:t}]}function Cd(e){return Array.isArray(e)?e.filter(F).map(t=>({id:U(t.id,Z()).toUpperCase(),match:U(t.match,""),colorHex:U(t.colorHex,lt)})):[]}function at(e,t){if(typeof e.id!="string")throw new _e("element id is required");return{id:e.id.toUpperCase(),colorSlot:kd(e.colorSlot,t),rules:lo(e.rules),frame:so(e.frame),isHidden:e.isHidden===!0}}function Sd(e){let t=Ed(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function Ed(e){if(!F(e)||!F(e.payload))throw new _e("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...at(t,"#FFFFFF"),value:F(t.value)?ce(t.value):R(""),fontSize:K(t.fontSize,14),fontWeight:ye(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...at(t,"#FFFFFF"),symbol:F(t.symbol)?ce(t.symbol):R("lightbulb"),size:K(t.size,14)}};case"gauge":{let n={...at(t,"#FFFFFF"),value:F(t.value)?ce(t.value):R("50"),minValue:K(t.minValue,0),maxValue:K(t.maxValue,100),style:ye(t.style)??"arc",lineWidth:K(t.lineWidth,4),trackColorHex:U(t.trackColorHex,"#FFFFFF40"),coloring:ye(t.coloring)??"uniform",bands:co(t.bands),bandAboveColorHex:U(t.bandAboveColorHex,st),thresholdColorHex:U(t.thresholdColorHex,Ot)},i=pn(t.thresholdValue);return i!==void 0&&(n.thresholdValue=i),F(t.total)&&(n.total=ce(t.total)),{kind:"gauge",payload:n}}case"chart":return{kind:"chart",payload:{...at(t,"#FFFFFF"),value:F(t.value)?ce(t.value):R("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(K(t.historyMinutes,0))),historyPoints:Math.round(K(t.historyPoints,24)),style:ye(t.style)??"bars",limit:Math.max(0,Math.round(K(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:ye(t.scale)??"auto",minValue:K(t.minValue,0),maxValue:K(t.maxValue,100),baseline:ye(t.baseline)??"lowest",barGap:K(t.barGap,1.5),lineWidth:K(t.lineWidth,2),highlight:ye(t.highlight)??"none",highColorHex:U(t.highColorHex,mn),lowColorHex:U(t.lowColorHex,fn),marker:ye(t.marker)??"pointer",coloring:ye(t.coloring)??"uniform",bands:$d(t),bandAboveColorHex:U(t.bandHighColorHex,U(t.bandAboveColorHex,st)),fillBands:t.fillBands===!0,...typeof t.thresholdValue=="number"&&Number.isFinite(t.thresholdValue)?{thresholdValue:t.thresholdValue}:{},thresholdColorHex:U(t.thresholdColorHex,Dt),...F(t.nowIndex)?{nowIndex:ce(t.nowIndex)}:{},nowColorHex:U(t.nowColorHex,Vt),...ye(t.scaleFrom)!==void 0?{scaleFrom:ye(t.scaleFrom)}:{}}};case"timeline":{let{colorSlot:n,...i}=at(t,"#FFFFFF");return{kind:"timeline",payload:{...i,value:F(t.value)?ce(t.value):R(""),historyMinutes:Math.max(1,Math.round(K(t.historyMinutes,ta))),bands:Cd(t.bands),otherColorHex:U(t.otherColorHex,lt),gap:Math.min(jn,Math.max(0,K(t.gap,0))),cornerRadius:Math.max(0,K(t.cornerRadius,no)),timeLabelCount:ud(t),labelSize:K(t.labelSize,yn),labelColorHex:U(t.labelColorHex,bn),labelsAbove:t.labelsAbove===!0,hourCycle:dd(t.hourCycle),minutes:cd(t.minutes)}}}case"shape":{let n={...at(t,"#FFFFFF33"),kind:ye(t.kind)??"roundedRectangle",cornerRadius:K(t.cornerRadius,6),thickness:K(t.thickness,1),borderWidth:K(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=at(t,"#FFFFFF"),a={...i,entity:rt(F(t.entity)?t.entity:{}),source:t.source==="entityPicture"?"entityPicture":"camera",contentMode:t.contentMode==="fit"?"fit":"fill",zoom:K(t.zoom,1),panX:K(t.panX,0),panY:K(t.panY,0),cornerRadius:K(t.cornerRadius,Bt),timestampCorner:bd.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:K(t.timestampSize,Gt)};t.timestamp===!0&&(a.timestamp=!0);let r=pn(t.timestampX),o=pn(t.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=Le(r),a.timestampY=Le(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:n,...i}=at(t,"#FFFFFF"),a={...i,action:F(t.action)?uo(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(a.openPageId=t.openPageId),typeof t.openPageName=="string"&&(a.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(a.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new _e(`unknown element kind ${String(e.kind)}`)}}function Vr(e){let t=F(e)?e:{},n={};if(F(t.placements))for(let[a,r]of Object.entries(t.placements)){if(!F(r))continue;let o={frame:so(r.frame),isHidden:r.isHidden===!0},s=pn(r.size);s!==void 0&&(o.size=s),n[a.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:K(t.borderWidth,2),rules:lo(t.rules)};if(F(t.bezelText)&&(i.bezelText=ce(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),F(t.curvedText)&&(i.curvedText=ce(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),F(t.bezelGauge)){let a=t.bezelGauge,r={value:F(a.value)?ce(a.value):R("50"),minValue:K(a.minValue,0),maxValue:K(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};F(a.minLabel)&&(r.minLabel=ce(a.minLabel)),F(a.maxLabel)&&(r.maxLabel=ce(a.maxLabel)),i.bezelGauge=r}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function Td(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=Vr(e[n+1]))}else if(F(e))for(let[n,i]of Object.entries(e))t[n]=Vr(i);return t}function Fd(e){let t={value:F(e.value)?ce(e.value):R("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function uo(e){if(!F(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...rt(e)};case"callService":{let t={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(t.target=rt(e)),t}default:return{type:"none"}}}function po(e){if(!F(e))throw new _e("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new _e(`${r} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(F).map(r=>({id:U(r.id).toUpperCase(),name:U(r.name),value:F(r.value)?ce(r.value):R("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(F).map(r=>r.kind==="template"?{kind:"template",value:U(r.value)}:r.kind==="entity"?{kind:"entity",...rt(r)}:null).filter(r=>r!==null),i={schemaVersion:K(e.schemaVersion,1),id:U(e.id).toUpperCase(),name:U(e.name,"Custom"),values:t,slotIndex:K(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Sd),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Td(e.perFamily),dataSources:n,tapAction:uo(e.tapAction)};F(e.inline)&&(i.inline=Fd(e.inline));let a=pn(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(F).filter(o=>typeof o.id=="string").map(o=>({id:U(o.id).toUpperCase(),name:U(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Rd(i,Array.isArray(e.elements)?e.elements:[]),Ye(i),i}function da(e,t){let n=t?.kind;if(!n||n.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===n.layer);return i?.kind==="chart"?i:void 0}function $t(e,t){return e.elements.filter(n=>n.kind==="text"&&n.payload.value.kind.kind==="chartStat"&&n.payload.value.kind.layer===t)}function Md(e,t){let n=Bn(e,$n(t))?.ref;return n?.displayName||n?.entityId||"Chart"}function ho(e,t,n){let i=je(e,t.payload.id);if(i){ua(e,n,i.id);return}let a=ca(e,[t.payload.id,n],Md(e,t)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var mo={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1}};function fo(e,t,n,i){let a=ue.rectangular,r=Math.min(1,(i*n*.62+4)/a.width),o=Math.min(1,n*1.3/a.height),s=e.x+t.x*e.width-t.x*r,l=e.y+t.y*e.height-t.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function go(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind!=="chart")return;let a=ze("text"),r=n==="latest"?10:8,o={kind:{kind:"chartStat",layer:t,stat:n}};n==="latest"&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:n==="latest"?"#FFFFFF":"#FFFFFF99"},a.payload.frame=fo(i.payload.frame,mo[n],r,n==="latest"?7:4);let s=e.elements.findIndex(l=>l.payload.id===t);return e.elements.splice(s+1,0,a),ho(e,i,a.payload.id),a.payload.id}function Rd(e,t){for(let n of t){if(!F(n)||n.kind!=="chart"||!F(n.payload))continue;let i=n.payload,a=U(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=U(i.scaleLabelColorHex,"#FFFFFF99"),s=h=>{let f=F(h)?h:{};return{fontSize:K(f.fontSize,8),colorHex:U(f.colorHex,o),pillColorHex:typeof f.pillColorHex=="string"?f.pillColorHex:void 0}},l=[],d=ye(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=ye(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,f]of l){let g=fo(r.payload.frame,mo[h],f.fontSize,h==="latest"?5:4),x=[];if(f.pillColorHex!==void 0){let S=ze("shape");S.payload.kind="capsule",S.payload.colorSlot={baseColorHex:f.pillColorHex},S.payload.frame={...g},x.push(S)}let $=ze("text");$.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},$.payload.fontSize=f.fontSize,$.payload.fontWeight="medium",$.payload.colorSlot={baseColorHex:f.colorHex},$.payload.frame=g,x.push($),e.elements.splice(u,0,...x),u+=x.length;for(let S of x)ho(e,r,S.payload.id)}}}function j(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function ot(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Id(e){let t={};return e.decimals!==void 0&&(t.decimals=j(e.decimals)),e.multiply!==void 0&&(t.multiply=j(e.multiply)),e.offset!==void 0&&(t.offset=j(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.duration&&(t.duration=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function Ad(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(ot)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function Hd(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...ot(e)};case"entityAttribute":return{kind:"entityAttribute",...ot(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...ot(e)};case"aggregate":return{kind:"aggregate",aggregate:Ad(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function ae(e){let t={kind:Hd(e.kind)};return Pe(e.format)||(t.format=Id(e.format)),t}function cn(e){return{x:j(e.x),y:j(e.y),width:j(e.width),height:j(e.height),rotationDegrees:j(e.rotationDegrees)}}function Ld(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=ae(e.value??R(""));break;case"between":t.value=ae(e.value??R("")),t.upper=ae(e.upper??R(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function Br(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=ae(e.value??R(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=j(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function un(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:ae(a.value),comparison:Ld(a.comparison)}))},then:i.then.map(Br)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(Br)),n})}function _d(e){let t=zd(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function zd(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:un(n.rules),frame:cn(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:ae(e.payload.value),fontSize:j(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:ae(e.payload.symbol),size:j(e.payload.size)}};case"gauge":{let n=e.payload,i={...t(n),value:ae(n.value),minValue:j(n.minValue),maxValue:j(n.maxValue),style:n.style,lineWidth:j(n.lineWidth),trackColorHex:n.trackColorHex};return n.coloring!=="uniform"&&(i.coloring=n.coloring),n.bands.length>0&&(i.bands=n.bands.map(a=>({id:a.id,upTo:j(a.upTo),colorHex:a.colorHex}))),n.bandAboveColorHex!==st&&(i.bandAboveColorHex=n.bandAboveColorHex),n.thresholdValue!==void 0&&(i.thresholdValue=j(n.thresholdValue)),n.thresholdColorHex!==Ot&&(i.thresholdColorHex=n.thresholdColorHex),n.total!==void 0&&(i.total=ae(n.total)),{kind:"gauge",payload:i}}case"chart":{let n=e.payload,i={...t(n),value:ae(n.value),historyMinutes:Math.max(0,Math.round(n.historyMinutes)),historyPoints:Math.round(n.historyPoints),style:n.style,limit:Math.max(0,Math.round(n.limit)),takeFromEnd:n.takeFromEnd,scale:n.scale,minValue:j(n.minValue),maxValue:j(n.maxValue),baseline:n.baseline,barGap:j(n.barGap),lineWidth:j(n.lineWidth),highlight:n.highlight,highColorHex:n.highColorHex,lowColorHex:n.lowColorHex,marker:n.marker,coloring:n.coloring,bands:n.bands.map(a=>({id:a.id,upTo:j(a.upTo),colorHex:a.colorHex})),bandAboveColorHex:n.bandAboveColorHex,fillBands:n.fillBands};return n.thresholdValue!==void 0&&(i.thresholdValue=j(n.thresholdValue)),n.thresholdColorHex!==Dt&&(i.thresholdColorHex=n.thresholdColorHex),n.nowIndex!==void 0&&(i.nowIndex=ae(n.nowIndex)),n.nowColorHex!==Vt&&(i.nowColorHex=n.nowColorHex),n.scaleFrom!==void 0&&(i.scaleFrom=n.scaleFrom),{kind:"chart",payload:i}}case"timeline":{let n=e.payload,i={id:n.id,rules:un(n.rules),frame:cn(n.frame),isHidden:n.isHidden,value:ae(n.value)};return n.historyMinutes!==ta&&(i.historyMinutes=Math.max(1,Math.round(n.historyMinutes))),n.bands.length>0&&(i.bands=n.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),n.otherColorHex!==lt&&(i.otherColorHex=n.otherColorHex),n.gap!==0&&(i.gap=j(n.gap)),n.cornerRadius!==no&&(i.cornerRadius=j(n.cornerRadius)),n.labelSize!==yn&&(i.labelSize=j(n.labelSize)),n.labelColorHex!==bn&&(i.labelColorHex=n.labelColorHex),n.labelsAbove&&(i.labelsAbove=!0),n.timeLabelCount!==ji&&(i.timeLabelCount=Math.max(0,Math.min(vn,Math.round(n.timeLabelCount)))),n.hourCycle!==na&&(i.hourCycle=n.hourCycle),n.minutes!==ia&&(i.minutes=n.minutes),{kind:"timeline",payload:i}}case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:j(e.payload.cornerRadius),borderWidth:j(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(n.thickness=j(e.payload.thickness)),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:ot(n.entity),rules:un(n.rules),frame:cn(n.frame),isHidden:n.isHidden};n.source!=="camera"&&(i.source=n.source),n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=j(n.zoom)),n.panX!==0&&(i.panX=j(n.panX)),n.panY!==0&&(i.panY=j(n.panY)),n.cornerRadius!==Bt&&(i.cornerRadius=j(n.cornerRadius));let a=Ke(n),r=a?oa(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),n.timestampSize!==Gt&&(i.timestampSize=j(n.timestampSize)),a&&(i.timestampX=j(n.timestampX),i.timestampY=j(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:yo(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=un(n.rules),i.frame=cn(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function Nd(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let a of n){let r=e.placements[a],o={frame:cn(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=j(r.size)),i[a]=o}t.placements=i}if(e.bezelText&&(t.bezelText=ae(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=ae(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:ae(i.value),minValue:j(i.minValue),maxValue:j(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=ae(i.minLabel)),i.maxLabel&&(a.maxLabel=ae(i.maxLabel)),t.bezelGauge=a}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=j(e.borderWidth),e.rules.length>0&&(t.rules=un(e.rules)),t}function yo(e){if(e.type==="callService"){let t={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(t,ot(e.target)),t}return"entityId"in e?{type:e.type,...ot(e)}:{type:e.type}}function Pd(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=ae(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function Yn(e){let t=[];for(let i of ie){let a=e.perFamily[i];a&&t.push(i,Nd(a))}let n={schemaVersion:hn(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:ae(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(_d),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...ot(i)}),tapAction:yo(e.tapAction)};return e.inline!==void 0&&(n.inline=Pd(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function je(e,t){let i=e.elements.find(a=>a.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function qe(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!be(e,n))}function Ye(e){let t=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!t.has(a.payload.groupId)&&delete a.payload.groupId;let n=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>n.has(a.id));i.length===0?delete e.groups:e.groups=i}function Ut(e){if(!e.groups?.length)return;let t=e.elements.filter(r=>!be(e,r)),n=e.elements.filter(r=>be(e,r)),i=[],a=new Set;for(let r=t.length-1;r>=0;r--){let o=t[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=t.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...n],ut(e)}function ca(e,t,n="Group"){let i=e.elements.filter(r=>t.includes(r.payload.id)&&!be(e,r));if(i.length<2)return;let a={id:Z(),name:n,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return Ye(e),Ut(e),a.id}function kn(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;Ye(e)}function ua(e,t,n){let i=e.elements.find(a=>a.payload.id===t);!i||be(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,Ye(e),Ut(e))}var X={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},Gr={literal:["kind","value"],entityState:["kind",...X.entityRef],entityAttribute:["kind",...X.entityRef,"attribute"],entityAge:["kind",...X.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function bo(e){let t=[],n=(l,d,c)=>{if(F(l))for(let u of Object.keys(l))d.includes(u)||t.push(`${c}.${u}`)},i=(l,d)=>{if(!F(l))return;let c=typeof l.kind=="string"?l.kind:"";n(l,Gr[c]??["kind"],d),c==="aggregate"&&F(l.aggregate)&&(n(l.aggregate,X.aggregate,`${d}.aggregate`),n(l.aggregate.scope,X.scope,`${d}.aggregate.scope`),F(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((u,h)=>n(u,X.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(l.aggregate.stateFilter,X.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(F(l)){if(F(l.kind))n(l,X.value,d),i(l.kind,`${d}.kind`);else{let c=typeof l.kind=="string"?l.kind:"";n(l,[...Gr[c]??["kind"],"format"],d),c==="aggregate"&&i(l,d)}n(l.format,X.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{n(c,X.styleChange,`${d}[${u}]`),F(c)&&a(c.value,`${d}[${u}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{let h=`${d}[${u}]`;n(c,X.rule,h),F(c)&&(Array.isArray(c.cases)&&c.cases.forEach((f,g)=>{let x=`${h}.cases[${g}]`;n(f,X.case,x),F(f)&&(n(f.when,X.condition,`${x}.when`),F(f.when)&&Array.isArray(f.when.tests)&&f.when.tests.forEach(($,S)=>{let E=`${x}.when.tests[${S}]`;n($,X.test,E),F($)&&(a($.value,`${E}.value`),n($.comparison,X.comparison,`${E}.comparison`),F($.comparison)&&(a($.comparison.value,`${E}.comparison.value`),a($.comparison.upper,`${E}.comparison.upper`)))}),r(f.then,`${x}.then`))}),r(c.otherwise,`${h}.otherwise`))})};if(!F(e))return t;n(e,X.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>n(l,X.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{n(l,X.named,`$.values[${d}]`),F(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let c=`$.elements[${d}]`;if(n(l,X.elementEnvelope,c),!F(l)||!F(l.payload))return;let u=typeof l.kind=="string"?l.kind:"",h=X[u]??[];n(l.payload,[...X.elementBase,...h],`${c}.payload`),n(l.payload.colorSlot,X.colorSlot,`${c}.payload.colorSlot`),n(l.payload.frame,X.frame,`${c}.payload.frame`),o(l.payload.rules,`${c}.payload.rules`);for(let f of["value","symbol","nowIndex","total"])f in l.payload&&a(l.payload[f],`${c}.payload.${f}`);u==="image"&&n(l.payload.entity,X.entityRef,`${c}.payload.entity`),u==="tap"&&n(l.payload.action,X.tapAction,`${c}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else F(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let c=`$.perFamily.${l}`;if(n(d,X.layout,c),!!F(d)){if(F(d.placements))for(let[u,h]of Object.entries(d.placements))n(h,X.placement,`${c}.placements.${u}`),F(h)&&n(h.frame,X.frame,`${c}.placements.${u}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),F(d.bezelGauge)){let u=`${c}.bezelGauge`;n(d.bezelGauge,X.bezelGauge,u),a(d.bezelGauge.value,`${u}.value`),a(d.bezelGauge.minLabel,`${u}.minLabel`),a(d.bezelGauge.maxLabel,`${u}.maxLabel`)}o(d.rules,`${c}.rules`)}}return F(e.inline)&&(n(e.inline,X.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((l,d)=>n(l,X.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,X.tapAction,"$.tapAction"),t}function Z(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function Kt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function vo(e,t,n=[...ie]){let i={};for(let r of ie)n.includes(r)&&(i[r]=Kt());let a={schemaVersion:4,id:Z(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:ld.filter(r=>n.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(a.inline={value:R("Text")}),a.schemaVersion=hn(a),a}function ze(e){let t=n=>({id:Z(),colorSlot:{baseColorHex:n},rules:[],frame:{...Ue},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:R("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:R("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:R("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:st,thresholdColorHex:Ot}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:R("13,14,16,17,19,22,24,28,30"),historyMinutes:Kn,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:mn,lowColorHex:fn,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:st,fillBands:!1,thresholdColorHex:Dt,nowColorHex:Vt}};case"timeline":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,value:R(""),historyMinutes:md,bands:[],otherColorHex:pd,gap:0,cornerRadius:hd,timeLabelCount:fd,labelSize:yn,labelColorHex:bn,labelsAbove:!1,hourCycle:na,minutes:ia}}}case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Bt,timestampCorner:"topLeading",timestampSize:Gt}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function R(e){return{kind:{kind:"literal",value:e}}}function Jn(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return}}var Ur=["circular","corner"],Kr=Math.SQRT1_2;function Od(e){return e==="text"||e==="icon"?4:.5}function pa(e,t,n,i){let a=structuredClone(e),r=ue[t],o=ue[n];if(t===n||!r||!o)return a;let s=Ur.includes(t),l=Ur.includes(n),d=s===l?1:l?Kr:1/Kr,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let u=a.frame,h=u.x+u.width/2,f=u.y+u.height/2;a.frame={...u,width:u.width*d,height:u.height*d,x:.5+(h-.5)*d-u.width*d/2,y:.5+(f-.5)*d-u.height*d/2}}return a.size!==void 0&&(a.size=Math.max(Od(i),Math.round(a.size*c*10)/10)),a}function xo(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let a=n.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function $n(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function ha(e){let t=[],n=i=>{for(let a of i)a.value&&t.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(a.then)}i.otherwise&&n(i.otherwise)}return t}var ma=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Bn(e,t){let n,i=t;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=da(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function fa(e,t){return Bn(e,$n(t))?.ref}function ga(e,t){let n=fa(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&ma.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function Wr(e,t,n){if(qn(t)||n.width<=0||n.height<=0)return{...e};let i=t,a=e.x-i.left/n.width,r=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,s=e.y+e.height+i.bottom/n.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=Le(a),r=Le(r),o=Le(o),s=Le(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function wo(e,t,n){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function ko(e,t,n,i){let a=e.elements.find(h=>h.payload.id===t);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,s=Le(i.x),l=Le(i.y),d=Le(i.x+i.width),c=Le(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=wo(o,u,ue[n])}function $o(e,t,n){let i=e.elements.find(s=>s.payload.id===t);if(!i)return;let a=e.perFamily[n];if(!a)return;let r=a.placements[t]?.frame??i.payload.frame,o=ue[n];return{width:r.width*o.width,height:r.height*o.height}}function Re(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function be(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function ya(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function ut(e){let t=new Map(e.elements.map(a=>[a.payload.id,a])),n=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=t.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=n.get(r);s?s.push(a):n.set(r,[a])}if(n.size===0)return;for(let[a,r]of n){let o=t.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=wo(o.payload.frame,l.frame,ue.rectangular));let d=l.outset,c=!qn(d);s.payload.frame=Wr(o.payload.frame,d,ue.rectangular),s.payload.isHidden=o.payload.isHidden;for(let u of ie){let h=e.perFamily[u];if(!h)continue;let f=ue[u],g=h.placements[a];if(c){let x=g?.frame??o.payload.frame,$=g?.isHidden??o.payload.isHidden;h.placements[s.payload.id]={frame:Wr(x,d,f),isHidden:$}}else g?h.placements[s.payload.id]={frame:{...g.frame},isHidden:g.isHidden}:delete h.placements[s.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=n.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Xn(e,t,n){let i=e.elements.find(s=>s.payload.id===t);if(!i||i.kind==="tap")return;let a=Re(e,t)[0];if(a)return a.payload;let r=ze("tap"),o=r.payload;return o.attachedTo=t,o.outset={...sa},o.action=n??ga(e,i),e.elements.push(r),ut(e),o}function Zn(e,t){let n=Re(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of ie)for(let a of n)delete e.perFamily[i]?.placements[a]}}function Ct(e,t){for(let n of $t(e,t))Ct(e,n.payload.id);Zn(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of e.elements)n.kind==="chart"&&n.payload.scaleFrom===t&&delete n.payload.scaleFrom;for(let n of ie)delete e.perFamily[n]?.placements[t];ut(e),Ye(e)}function Co(e,t){let n=e.elements.findIndex(l=>l.payload.id===t),i=e.elements[n];if(!i)return;let a=Z(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[t,a]];for(let l of Re(e,t)){let d=structuredClone(l);d.payload.id=Z(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let l of ie){let d=e.perFamily[l];if(d)for(let[c,u]of s){let h=d.placements[c];h&&(d.placements[u]=structuredClone(h))}}return ut(e),a}function So(e,t){let n=e.elements.findIndex(o=>o.payload.id===t),i=e.elements[n];if(!i||i.kind!=="chart")return;let a=Z(),r=structuredClone(i);r.payload.id=a,r.payload.scaleFrom=t,e.elements.splice(n+1,0,r);for(let o of ie){let s=e.perFamily[o],l=s?.placements[t];s&&l&&(s.placements[a]=structuredClone(l))}return a}function ba(e,t,n){let i=new Set,a=d=>{i.add(d);for(let c of Re(e,d))i.add(c.payload.id)};for(let d of t){a(d);for(let c of $t(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of ie){let c=e.perFamily[d];if(!c)continue;let u={};for(let h of r){let f=c.placements[h.payload.id];f&&(u[h.payload.id]=structuredClone(f))}Object.keys(u).length>0&&(o[d]=u)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...n!==void 0?{family:n}:{}}}function Eo(e,t,n){if(!ie.includes(n))return[];let i=e.perFamily[n];if(i||(i=Kt(),e.perFamily[n]=i),Object.keys(i.placements).length===0)for(let s of e.elements)i.placements[s.payload.id]={frame:{...s.payload.frame},isHidden:s.payload.isHidden};let a=new Set(e.elements.map(s=>s.payload.id)),r=t.family===void 0?void 0:t.placements[t.family],o=[];for(let s of t.elements){let l=s.payload.id;if(!a.has(l))continue;let d=r?.[l],c=d?.size??Jn(s),u={frame:{...d?.frame??s.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};i.placements[l]=t.family===void 0?u:pa(u,t.family,n,s.kind),o.push(l)}return o.filter(s=>{let l=e.elements.find(d=>d.payload.id===s);return l!==void 0&&!be(e,l)})}function va(e,t){let n=new Map;for(let l of t.elements)n.set(l.payload.id,Z());let i=new Set(e.elements.map(l=>l.payload.id)),a=t.elements.some(l=>i.has(l.payload.id)),r=l=>a?{...l,x:Math.min(.9,l.x+.05),y:Math.min(.9,l.y+.05)}:l,o=[];for(let l of t.elements){let d=structuredClone(l);if(d.payload.id=n.get(l.payload.id),d.kind==="tap"&&d.payload.attachedTo!==void 0){let c=n.get(d.payload.attachedTo);c?d.payload.attachedTo=c:delete d.payload.attachedTo}if(d.kind==="chart"&&d.payload.scaleFrom!==void 0){let c=n.get(d.payload.scaleFrom);c?d.payload.scaleFrom=c:i.has(d.payload.scaleFrom)||delete d.payload.scaleFrom}if(d.kind==="text"&&d.payload.value.kind.kind==="chartStat"){let c=n.get(d.payload.value.kind.layer);if(c)d.payload.value.kind.layer=c;else if(!i.has(d.payload.value.kind.layer))continue}d.payload.frame=r(d.payload.frame),o.push(d)}let s=new Map;for(let l of t.groups){if(o.filter(u=>u.payload.groupId===l.id&&!(u.kind==="tap"&&u.payload.attachedTo!==void 0)).length<2)continue;let c=Z();s.set(l.id,c),(e.groups??=[]).push({...structuredClone(l),id:c})}for(let l of o){if(l.payload.groupId===void 0)continue;let d=s.get(l.payload.groupId);d?l.payload.groupId=d:delete l.payload.groupId}e.elements.push(...o);for(let l of ie){let d=t.placements[l],c=e.perFamily[l];if(!(!d||!c))for(let[u,h]of Object.entries(d)){let f=n.get(u);f&&o.some(g=>g.payload.id===f)&&(c.placements[f]={...structuredClone(h),frame:r(h.frame)})}}return ut(e),Ye(e),Ut(e),o.filter(l=>!be(e,l)).map(l=>l.payload.id)}function Qn(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let i=[],a=Bn(e,$n(n));if(a){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of Re(e,t)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=Bn(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function Wi(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"||n==="timeline"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function To(e,t,n,i){let a=e.elements.find(o=>o.payload.id===t);if(!a||n.entityId==="")return;let r={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=Wi(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=ra(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=Wi(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=Wi(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of Re(e,t)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var ei={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Fo=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function St(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function ti(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function xa(){return{id:Z(),value:R(""),comparison:{kind:"isOn"}}}function wa(){return{id:Z(),when:{join:"all",tests:[xa()]},then:[]}}function Cn(){return{id:Z(),cases:[wa()]}}function ka(e,t){let n={kind:t};switch(St(t)){case"value":n.value=e.value??R("");break;case"between":n.value=e.value??R(""),n.upper=e.upper??R("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function Et(e){let t={kind:e};switch(ti(e)){case"value":t.value=R(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function Mo(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Ro(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function Ao(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*i&a;return n.toString(16)}function Ho(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function Io(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Ca(e,t,n=0){let i=t instanceof Map?t:Ho(t),a=e.kind;if(a.kind==="named"){if(n>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Ca(o,i,n+1):Io(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Io(a))return;let r=$a(a);if(r!==void 0)return"e_"+Ao(r)}function He(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Dd(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>He(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))t=o.length===0?"[]":"("+o.map(u=>`(states.${u} | list)`).join(" + ")+")";else{let u=[];for(let h of s)u.push(`area_entities(${He(h)})`);for(let h of l)u.push(`label_entities(${He(h)})`);d.length>0&&u.push(`((${d.map(h=>`floor_areas(${He(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${u.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(He).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${He(i.value)})`:n+=` | rejectattr('state', 'eq', ${He(i.value)})`),e.function==="count")return`(${n} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${n} | map(attribute=${He(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function $a(e){switch(e.kind){case"entityAttribute":return`state_attr(${He(e.entityId)}, ${He(e.attribute)})`;case"entityAge":{let t=He(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Dd(e.aggregate);default:return}}function Sa(e){let t=new Map,n=new Map,i=Ho(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":t.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let c=$a(d.kind);if(c===void 0)return;n.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=$a(l);if(d===void 0)return;n.set("e_"+Ao(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=$n(o);s&&a(s),o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of ha(o.payload.rules))a(l)}for(let o of ie){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of ha(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:t,expressions:n};return n.size>0&&(r.document=Vd(n)),r}function Vd(e){let t=[...e.keys()].sort(),n=[];for(let a of t){let r=e.get(a);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${a} %}${r}{% endset %}`):n.push(`{% set v_${a} = ${r} %}`)}let i=t.map(a=>`"${a}": v_${a}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function Lo(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[a,r]of Object.entries(t))r===null?i.add(a):n.set(a,Bd(r));return{values:n,nullKeys:i}}function Bd(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Ea(e){let t=Sa(e),n=[...t.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function Gd(e,t){if(e.values.length!==0)switch(t){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((n,i)=>n+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin}}var Ud=10800;function Kd(e,t){let n=e.minutes==="always"||e.minutes==="auto"&&t<=Ud;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...n?{minute:"2-digit"}:{},...e.hourCycle==="h12"?{hourCycle:"h12"}:{},...e.hourCycle==="h24"?{hourCycle:"h23"}:{}})}function Wd(e,t){if(ct(e)===void 0)return[];let n=to(e.timeLabelCount);if(n.length===0)return[];let i=Ne(e)*60,a=Kd(e,i);return n.map(r=>({position:r,text:a.format(new Date(t-i*1e3*(1-r)))}))}function Tt(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function Je(e){let t=e.trim(),n=Tt(t);if(n!==void 0)return n;let i="";for(let r of t)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Tt(i)}function jd(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function qd(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function Yd(e){let t=e.trim(),n=Tt(t);if(n!==void 0)return n;let i=0,a=t.indexOf(",");if(a>=0){let s=t.slice(0,a).trim().split(" "),l=s.length===2?Tt(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,t=t.slice(a+1).trim()}let r=t.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Tt(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function Jd(e){let t=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(t/86400),"d"],[Math.trunc(t%86400/3600),"h"],[Math.trunc(t%3600/60),"m"],[t%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function Xd(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function Zd(e,t,n){if(Pe(t))return e;let i=t,a=e,r=Tt(e.trim()),o=i.duration?Yd(e):void 0;if(o!==void 0)a=Jd(o);else if(i.relativeTime&&r!==void 0)a=qd(r);else{let s=Je(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):jd(l))}}switch(i.useEntityUnit&&n&&(a+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Xd(a);break}return a}function Wt(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),a=t%60,r=o=>String(o).padStart(2,"0");return n>0?`${n}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Sn(e,t=240){let n=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&n.push(o)}i=""};for(let o of e){if(n.length>=t)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let s=!a;r(),s&&(i+=o),a=!1}else r(),a=!1}return n.length<t&&r(),n}function _o(e,t){let n,i;return t.scale==="fixed"?(n=Math.min(t.minValue,t.maxValue),i=Math.max(t.minValue,t.maxValue)):(n=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,t.thresholdValue!==void 0&&Number.isFinite(t.thresholdValue)&&(n=Math.min(n,t.thresholdValue),i=Math.max(i,t.thresholdValue))),t.baseline==="zero"&&(n=Math.min(n,0),i=Math.max(i,0)),i>n||(i=n+1),{min:n,max:i}}function Qd(e,t,n){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(n>t)||i<t||i>n))return(i-t)/(n-t)}function En(e,t=dt){let n=[];for(let i of e.split(" ")){if(n.length>=t)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||n.push({offsetSeconds:Math.round(r),state:ec(i.slice(a+1))})}return n}function ec(e){try{return decodeURIComponent(e)}catch{return e}}function tc(e,t,n){if(e.length===0||!(t>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/t)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/t));if(!(d>s))continue;let c=n(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===c?u.end=d:i.push({start:s,end:d,colorHex:c})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function zo(e,t,n){if(Number.isNaN(e))return n;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(n,Math.max(t,i))}function nc(e,t,n){if(e===void 0)return 0;let i=Je(e);if(i===void 0||Number.isNaN(i))return 0;let a=n-t;return a===0?0:Math.min(1,Math.max(0,(i-t)/a))}var Xe=class{constructor(t,n){this.ctx=t;this.charts=new Map;this.named=new Map(t.namedValues.map(i=>[i.id.toUpperCase(),i.value])),n&&this.settleCharts(n)}chartReadings(t){let n=this.chartSeries(t),i=_o(n,t),a={values:n,domainMin:i.min,domainMax:i.max},r=this.chartEntity(t);return r&&(a.entity=r),a}chartSeries(t){let n=kt(t),i=n!==void 0?this.ctx.historySeries?.get(n)??"":this.resolve(t.value)??"",a=Sn(i);return t.limit>0&&a.length>t.limit?t.takeFromEnd?a.slice(a.length-t.limit):a.slice(0,t.limit):a}chartEntity(t){let n=this.dereference(t.value);if(!(!n||!("entityId"in n.kind)))return{entityId:n.kind.entityId,displayName:n.kind.displayName,domain:n.kind.domain}}chartNowIndex(t,n){if(t.nowIndex===void 0||n===0)return;let i=this.resolve(t.nowIndex);if(i===void 0)return;let a=Je(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),n-1)}settleCharts(t){let n=new Map,i=[];for(let s of t.elements)s.kind!=="chart"||n.has(s.payload.id)||(n.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(n.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let c=n.get(s);if(!c)return{min:0,max:1};let u=c.scaleFrom,h=u!==void 0&&u!==s&&n.has(u)&&!l.has(u)?o(u,new Set([...l,u])):_o(a.get(s)??[],c);return r.set(s,h),h};for(let s of i){let l=n.get(s),d=o(s,new Set([s])),c={values:a.get(s)??[],domainMin:d.min,domainMax:d.max},u=this.chartEntity(l);u&&(c.entity=u),this.charts.set(s,c)}}dereference(t){let n=t,i=new Set,a=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Pe(a)?a:s.format,n=s}let r={kind:n.kind};return a&&(r.format=a),r}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement;if(n.kind==="chartStat"){let i=this.charts.get(n.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(n.kind.layer.toUpperCase()),r=a?Gd(a,n.kind.stat):void 0;i=a&&r!==void 0?Yr(r,a.domainMax-a.domainMin):void 0;break}default:{let a=Ca(t,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Zd(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(t)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Tt(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?Wt(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let a=Je(i),r=()=>this.resolve(n.value),o=()=>{let l=r();return l===void 0?void 0:Je(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(n.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(n.upper),c=d===void 0?void 0:Je(d);if(a===void 0||l===void 0||c===void 0)return!1;let[u,h]=l<=c?[l,c]:[c,l];return a>=u&&a<=h}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let a of t){let r=n?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(Te[s.kind],s)}return i}liveBranches(t){let n=new Map;for(let i of t){let a=i.cases.find(r=>this.evaluateCondition(r.when));n.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,a=this.applyRules(i.rules,n),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,s=this.styleNumber(a,"rotation"),l=s===void 0?i.frame:{...i.frame,rotationDegrees:s},d=this.styleNumber(a,"opacity")??1,c={id:i.id,isHidden:o,frame:l,opacity:d};switch(t.kind){case"text":{let u=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,f={kind:"text",...c,text:this.styleText(a,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??t.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex};return u!==void 0&&(f.countdownEnd=u),f}case"icon":{let u=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...c,symbol:this.styleText(a,"icon")??u,size:this.styleNumber(a,"fontSize")??t.payload.size,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let u=t.payload,h=this.styleText(a,"gaugeValue")??this.resolve(u.value),f=this.styleNumber(a,"gaugeMin")??u.minValue,g=this.styleNumber(a,"gaugeMax")??u.maxValue,x=h===void 0?void 0:Je(h),$=this.styleColor(a,"color")??u.colorSlot.baseColorHex;u.coloring==="bands"&&u.bands.length>0&&x!==void 0&&($=Ji(x,gn(u),u.bandAboveColorHex));let S=g-f;if(u.total){let C=Je(this.resolve(u.total)??"");C!==void 0&&(S=C)}let E=zo(S,1,Gn),v={kind:"gauge",...c,fraction:nc(h,f,g),style:u.style,lineWidth:u.lineWidth,colorHex:$,trackColorHex:u.trackColorHex,thresholdColorHex:u.thresholdColorHex,dotCount:E,filledCount:zo(x??0,0,E)};if(u.thresholdValue!==void 0&&g!==f){let C=(u.thresholdValue-f)/(g-f);C>=0&&C<=1&&(v.thresholdFraction=C)}return v}case"chart":{let u=t.payload,h=this.charts.get(u.id)??this.chartReadings(u),f=h.values,g={min:h.domainMin,max:h.domainMax},x=this.styleColor(a,"color")??u.colorSlot.baseColorHex,$=gn(u),S=qr(u)?f.map(N=>Ji(N,$,u.bandAboveColorHex)):[],E={kind:"chart",...c,values:f,style:u.style,domainMin:g.min,domainMax:g.max,baseline:u.baseline,barGap:u.barGap,lineWidth:u.lineWidth,colorHex:x,highColorHex:u.highColorHex,lowColorHex:u.lowColorHex,marker:u.marker,pointColorHexes:S,fillBands:u.fillBands,thresholdColorHex:u.thresholdColorHex,nowColorHex:u.nowColorHex};if(f.length>0){let N=u.highlight==="highest"||u.highlight==="both",B=u.highlight==="lowest"||u.highlight==="both",q=N?f.indexOf(Math.max(...f)):-1,le=B?f.indexOf(Math.min(...f)):-1;q>=0&&(E.highIndex=q),le>=0&&le!==q&&(E.lowIndex=le)}let v=Qd(u,g.min,g.max);v!==void 0&&(E.thresholdY=v);let C=this.chartNowIndex(u,f.length);return C!==void 0&&(E.nowIndex=C),E}case"timeline":{let u=t.payload,h=ct(u),f=h===void 0?"":this.ctx.historySeries?.get(h)??"",g=En(f,dt),x=tc(g,Ne(u)*60,S=>io(S,u.bands,u.otherColorHex));return{kind:"timeline",...c,runs:x,gap:u.gap,cornerRadius:u.cornerRadius,labels:Wd(u,this.nowMs()),labelSize:u.labelSize,labelColorHex:u.labelColorHex,labelsAbove:u.labelsAbove}}case"shape":{let u={kind:"shape",...c,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,thickness:t.payload.thickness,fillColorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??t.payload.borderWidth},h=this.styleColor(a,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(u.borderColorHex=h),u}case"image":{let u={kind:"image",...c,entityId:t.payload.entity.entityId,source:t.payload.source,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};Ke(t.payload)&&(u.timestampX=t.payload.timestampX,u.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(u.url=h),u}case"tap":{let u={kind:"tap",...c,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(u.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(u.attachedTo=t.payload.attachedTo),u}}}resolveLayout(t,n,i){let a=t.perFamily[n];this.settleCharts(t);let r=xo(t,n).map(x=>this.resolveElement(x,i)),o=a?this.applyRules(a.rules,i):new Map,s={family:n,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},l=this.styleText(o,"text"),d=a?.bezelCountdown&&l===void 0?this.countdownEnd(a.bezelText):void 0,c=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,u=l??c??this.resolve(a?.bezelText);u!==void 0&&(s.bezelText=u),d!==void 0&&(s.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(s.curvedText=h),a?.curvedColorHex!==void 0&&(s.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let x=a.bezelGauge,$=this.resolve(x.value),S=$===void 0?void 0:Je($);if(S!==void 0){let E=Math.min(x.minValue,x.maxValue),v=Math.max(x.minValue,x.maxValue),C={value:Math.min(v,Math.max(E,S)),minValue:E,maxValue:v===E?E+1:v,colorHexes:x.colorHexes},N=this.resolve(x.minLabel);N!==void 0&&(C.minLabel=N);let B=this.resolve(x.maxLabel);B!==void 0&&(C.maxLabel=B),s.bezelGauge=C}}let f=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;f!==void 0&&(s.backgroundColorHex=f);let g=this.styleColor(o,"borderColor")??a?.borderColorHex;return g!==void 0&&(s.borderColorHex=g),s}};function ic(e,t,n){let i=new Xe(t,n),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Ta(e,t,n){let i=new Xe(t),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,n));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=ic(e.inline,t,e)),a}var ve=ue,Tn=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:ve,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Fn=Tn.find(e=>e.measured);function Ko(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return Tn.find(a=>a.screen.width===n&&a.screen.height===i)}function ii(e,t){let n=ve[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),a=n.width*i,r=n.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var ac={regular:400,medium:500,semibold:600,bold:700};function Oe(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function $e(e,t,n="#FFFFFF"){let i=Oe(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function Wo(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),a=(e.frame.x+e.frame.width/2)*t.width,r=(e.frame.y+e.frame.height/2)*t.height;return{x:a-n/2,y:r-i/2,w:n,h:i,cx:a,cy:r}}function rc(e,t){let n=$e(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:Wt((e.countdownEnd-Date.now())/1e3)});let i=l=>l*.55,a=e.text.length*i(e.fontSize),r=a>t.w&&t.w>0?Math.max(.5,t.w/a):1,o=e.fontSize*r,s=e.text;if(t.w>0&&s.length*i(o)>t.w){let l=t.w-.8*o,d=Math.max(1,Math.floor(l/i(o)));s=`${s.slice(0,d).replace(/\s+$/,"")}\u2026`}return b`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${ac[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${s}</text>`}var Fa=2;function oc(e,t){let n=$e(e.colorHex,"stroke"),i=$e(e.trackColorHex,"stroke","#FFFFFF"),a=$e(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let f=t.w>=t.h,g=Math.max(1,e.dotCount),x=f?t.w:t.h,$=f?t.h:t.w,S=Math.max(1,Math.min($,x/g-Fa)),E=g*S+(g-1)*Fa,v=(f?t.cx:t.cy)-E/2+S/2;return b`${Array.from({length:g},(C,N)=>{let B=v+N*(S+Fa),q=N<e.filledCount?n:i;return b`<circle cx=${f?B:t.cx} cy=${f?t.cy:B} r=${S/2}
        fill=${q.stroke} fill-opacity=${q["stroke-opacity"]} />`})}`}if(e.style==="bar"){let f=t.w,g=Math.max(r,f*e.fraction),x=1;return b`
      <rect x=${t.x} y=${t.cy-r/2} width=${f} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-r/2} width=${g} height=${r} rx=${r/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />
      ${e.thresholdFraction===void 0?m:b`<rect x=${t.x+Math.min(f-x,Math.max(0,f*e.thresholdFraction-x/2))}
            y=${t.cy-r/2} width=${x} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}`}let o=Math.min(t.w,t.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=e.style==="ring"?1:.75,c=e.style==="ring"?-90:135,u=l*d,h=l*d*e.fraction;return b`
    <g transform="rotate(${c} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?b`<circle cx=${t.cx} cy=${t.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${h} ${l}" />`:m}
      ${e.thresholdFraction===void 0?m:sc(t,s,r,d*360*e.thresholdFraction,e.thresholdColorHex)}
    </g>`}function sc(e,t,n,i,a){let r=$e(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=n/2+1;return b`<line x1=${e.cx+s*(t-d)} y1=${e.cy+l*(t-d)}
    x2=${e.cx+s*(t+d)} y2=${e.cy+l*(t+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}var lc=5;function dc(e,t){let n=e.values,i=Math.max(n.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:lc,o=e.style==="bars"?0:e.lineWidth/2,s=t.x,l=Math.max(t.w,0),d=t.y+r+o,c=Math.max(t.h-r-o*2,1),u=d+c,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),f=e.baseline==="lowest",g=f?c*.12:0,x=Math.min(Math.max(e.barGap,0),l/(i*2)),$=Math.max((l-x*(i-1))/i,.5),S=v=>Math.min(1,Math.max(0,(v-e.domainMin)/h)),E=v=>u-S(v)*c;return{count:n.length,barWidth:$,plotTop:d,plotBottom:u,plotLeft:s,plotRight:s+l,baselineY:f?u:E(0),yAtFraction(v){return u-Math.min(Math.max(v,0),1)*c},barRect(v){let C=s+v*($+x),N=n[v],B,q;if(f){let le=g+S(N)*(c-g);B=u-le,q=u}else B=E(N),q=f?u:E(0),B>q&&([B,q]=[q,B]);return{x:C,y:B,w:$,h:Math.max(q-B,.5)}},point(v){let C=Math.max(l-o*2,0);return{x:n.length>1?s+o+C*v/(n.length-1):s+l/2,y:E(n[v])}},markerCenter(v,C){let N=C?this.barRect(v):void 0;return{x:N?N.x+N.w/2:this.point(v).x,y:t.y+r/2}}}}function cc(e,t){if(e.values.length===0)return m;let n=dc(e,t),i=$e(e.colorHex,"fill"),a=$e(e.highColorHex,"fill",e.colorHex),r=$e(e.lowColorHex,"fill",e.colorHex),o=(c,u)=>b`<circle cx=${c.x} cy=${c.y} r="1.7" fill=${u.fill} fill-opacity=${u["fill-opacity"]} />`,s=[],l=e.pointColorHexes.length===n.count,d=c=>l?$e(e.pointColorHexes[c],"fill",e.colorHex):i;if(e.style==="bars")for(let c=0;c<n.count;c++){let u=n.barRect(c),h=c===e.highIndex?a:c===e.lowIndex?r:d(c),f=Math.min(1.2,u.w/2,u.h/2);s.push(b`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx=${f}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let c=Array.from({length:n.count},(h,f)=>n.point(f)),u=c.map((h,f)=>`${f===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&l&&n.count>1)for(let h=0;h<n.count-1;h++){let f=c[h],g=c[h+1],x=d(h+1),$=`M${f.x} ${f.y} L${g.x} ${g.y} L${g.x} ${n.baselineY} L${f.x} ${n.baselineY} Z`;s.push(b`<path d=${$} fill=${x.fill}
            fill-opacity=${x["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${u} L${c[c.length-1].x} ${n.baselineY} L${c[0].x} ${n.baselineY} Z`;s.push(b`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(l&&n.count>1)for(let h=0;h<n.count-1;h++){let f=c[h],g=c[h+1],x=d(h+1);s.push(b`<path d=${`M${f.x} ${f.y} L${g.x} ${g.y}`} fill="none"
          stroke=${x.fill} stroke-opacity=${x["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else s.push(b`<path d=${u} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&s.push(o(c[e.highIndex],a)),e.lowIndex!==void 0&&s.push(o(c[e.lowIndex],r))}if(e.marker!=="none"){let c=e.style==="bars";if(e.highIndex!==void 0){let u=n.markerCenter(e.highIndex,c);s.push(e.marker==="pointer"?b`<path d=${`M${u.x} ${u.y-1.8} L${u.x+2.2} ${u.y+1.8} L${u.x-2.2} ${u.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(u,a))}e.lowIndex!==void 0&&s.push(o(n.markerCenter(e.lowIndex,c),r))}if(e.thresholdY!==void 0){let c=n.yAtFraction(e.thresholdY),u=$e(e.thresholdColorHex,"fill",e.colorHex);s.push(b`<path d=${`M${n.plotLeft} ${c} L${n.plotRight} ${c}`} fill="none"
      stroke=${u.fill} stroke-opacity=${u["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.nowIndex!==void 0&&e.nowIndex<n.count){let c=n.markerCenter(e.nowIndex,e.style==="bars").x,u=$e(e.nowColorHex,"fill",e.colorHex);s.push(b`<path d=${`M${c} ${n.plotTop} L${c} ${n.plotBottom}`} fill="none"
      stroke=${u.fill} stroke-opacity=${u["fill-opacity"]} stroke-width="1" />`)}return b`${s}`}var Ma=1;function uc(e,t){if(e.runs.length===0&&e.labels.length===0||t.w<=0||t.h<=0)return m;let n=Math.max(xn,Math.min(wn,e.labelSize)),i=n*1.2,a=e.labels.length>0&&t.h-i-Ma>=2,r=a?{...t,y:e.labelsAbove?t.y+i+Ma:t.y,h:t.h-i-Ma}:t,o=Math.max(0,Math.min(e.gap,t.w/Math.max(1,e.runs.length))),s=e.runs.map((u,h)=>{let f=t.x+u.start*t.w,g=(u.end-u.start)*t.w,x=h===e.runs.length-1,$=Math.max(x?g:Math.min(g,.5),g-(x?0:o)),S=Math.max(0,Math.min(e.cornerRadius,$/2,r.h/2)),E=$e(u.colorHex,"fill");return b`<rect x=${f} y=${r.y} width=${$} height=${r.h} rx=${S}
      fill=${E.fill} fill-opacity=${E["fill-opacity"]} />`});if(!a)return b`${s}`;let l=(e.labelsAbove?t.y:t.y+t.h-i)+i/2,d=$e(e.labelColorHex,"fill"),c=e.labels.map((u,h)=>{let g=h===e.labels.length-1?"end":h===0?"start":"middle",x=t.x+u.position*t.w;return b`<text x=${x} y=${l} text-anchor=${g} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${n} font-weight="400"
      fill=${d.fill} fill-opacity=${d["fill-opacity"]}>${u.text}</text>`});return b`${s}${c}`}function pc(e,t){let n=$e(e.fillColorHex,"fill"),i=e.borderColorHex?Oe(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(t.w,t.h)/2-r;return b`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,l)}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(t.w,t.h)/2;return b`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${l}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return b`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${e.cornerRadius}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return b`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"line":{let l=t.w>=t.h,d=Math.max(0,Math.min(e.thickness,l?t.h:t.w)),c=l?t.x:t.cx-d/2,u=l?t.cy-d/2:t.y;return b`<rect x=${c} y=${u} width=${l?t.w:d} height=${l?d:t.h}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]} stroke="none" />`}}}function hc(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return b`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let a=$e(e.colorHex,"stroke"),r=e.size;return b`
    <rect x=${t.cx-r/2} y=${t.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var _a=.25,mc=8;function fc(e,t,n,i,a,r,o,s){let l={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,_a),mc),c=Math.max(e/n,t/i),u=Math.min(e/n,t/i),h=(a==="fit"?u:c)*d,f=n*h,g=i*h,x=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),$=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(f-e)/2*(1+x)+0,y:-(g-t)/2*(1+$)+0,width:f,height:g}}function ai(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var ni=4;function ri(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),a=n.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?t.x+ni:t.x+t.w-ni-a,d=e.timestampCorner.startsWith("top")?t.y+ni:t.y+t.h-ni-r;return{x:l,y:d,w:a,h:r,size:i,label:n}}let s=(l,d,c,u)=>u>=c?d+(c-u)/2:Math.min(d+c-u,Math.max(d,l-u/2));return{x:s(t.x+e.timestampX*t.w,t.x,t.w,a),y:s(t.y+e.timestampY*t.h,t.y,t.h,r),w:a,h:r,size:i,label:n}}function gc(e,t){if(e==="camera")return"camera.fill";switch(t.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function yc(e,t,n){let i=n.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?ri(e,t,ai(new Date)):void 0,s=o?b`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:m,l=3,d=o&&n.timestampActiveId===e.id?b`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,f,g])=>b`<rect data-ts-corner=${h} x=${f-l/2} y=${g-l/2} width=${l} height=${l}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:m,c=e.url?n.imageSizes?.size(e.url):void 0,u;if(e.url&&c){let h=fc(t.w,t.h,c.width,c.height,e.contentMode,e.zoom,e.panX,e.panY);u=b`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?u=b`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:u=b`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render(gc(e.source,e.entityId),14,"#FFFFFF99")??m}</g>`;return b`
    <defs><clipPath id=${a}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${u}${s}</g>${d}`}function bc(e,t,n,i,a){if(!i)return m;let r=Math.min(10,t.w*.5,t.h*.5),o=a!==void 0?vc(a,t):void 0;return b`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?b`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${Ia} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?b`<g transform="translate(${t.cx-r/2} ${t.cy-r/2})" opacity="0.8">${n.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var Ia=5;function vc(e,t){let n=Ia*.55,i=t.w-2;if(t.h<Ia*1.6||i<n*4)return;if(e.length*n<=i)return e;let a=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Aa(e,t,n){if(e.isHidden&&!n.showHidden)return m;let i=n.tapReview===!0,a=n.tapAreas===!0||i,r=i?n.tapFocusId:void 0,o=r!==void 0&&e.id===r,s=r!==void 0;if(e.kind==="tap"&&!a)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||s&&!o))return m;let l=Wo(e,t),d=i&&(!s||o),c;switch(e.kind){case"text":c=rc(e,l);break;case"icon":c=hc(e,l,n.icons);break;case"gauge":c=oc(e,l);break;case"chart":c=cc(e,l);break;case"timeline":c=uc(e,l);break;case"shape":c=pc(e,l);break;case"image":c=yc(e,l,n);break;case"tap":c=bc(e,l,n.icons,a,d?We(e.action):void 0);break}let u=i&&(e.kind!=="tap"||s&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*u,f=n.highlightId===e.id,g=f||n.highlightIds?.includes(e.id)===!0,x=n.handles===!0&&(!s||o),$=g?b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,S=n.hoverId===e.id||n.hoverIds?.includes(e.id)===!0?b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,E=b`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="transparent" stroke="none" />`,v=3,C=f&&x?[["nw",l.x,l.y],["ne",l.x+l.w,l.y],["sw",l.x,l.y+l.h],["se",l.x+l.w,l.y+l.h]].map(([N,B,q])=>b`<rect data-handle=${N} x=${B-v/2} y=${q-v/2} width=${v} height=${v}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${N}-resize" />`):m;return b`<g data-element-id=${e.id} opacity=${h} style=${x?"cursor:move":m}
    transform="rotate(${e.frame.rotationDegrees} ${l.cx} ${l.cy})">${E}${c}${S}${$}${C}</g>`}function oi(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function za(e,t){return(t?23.5:34)*e}var No=10.5;function jo(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function Po(e,t){let n=0;for(let i of e)n+=jo(i,t);return n}function Oo(e,t,n){let i=e.toUpperCase(),a=d=>jo(d,n),r=.9*n,o=0;for(let d of i)o+=a(d);if(o<=t)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>t)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function Ha(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function La(e,t,n,i){let a=Ha(e,t,n),r=Ha(e,t,i);return`M ${a.x} ${a.y} A ${t} ${t} 0 0 1 ${r.x} ${r.y}`}function qo(e,t,n,i){let{dial:a}=oi(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:t,d:La(a,n,i.start,i.end),length:n*r}}function xc(e,t){let n=oi(e,!0);return qo(e,t,n.dial.r,n.labelArc)}var Do=18.5,wc=113,kc={start:-71,end:-36},Vo=104,$c=6.2,Bo={start:-77,end:-30.5};function Go(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function Uo(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),a=n-i,r=Go(e[i]),o=Go(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var Ra=11;function Cc(e,t,n){let{dial:i}=oi(t,!0),a=Vo*t,r=180/(Math.PI*Vo),o=e.minLabel!==void 0?Po(e.minLabel,Ra)*r:0,s=e.maxLabel!==void 0?Po(e.maxLabel,Ra)*r:0,l=Bo.start+(o>0?Math.max(0,o-1.8):0),d=Bo.end-(s>0?Math.max(0,s-1.8):0),c=d-l,u=24,h=[];for(let S=0;S<u;S++){let E=l+c*S/u,v=Math.min(d,l+c*(S+1)/u+.4);h.push(b`<path d=${La(i,a,E,v)} fill="none"
      stroke=${Uo(e.colorHexes,(S+.5)/u)} stroke-width=${$c*t}
      stroke-linecap=${S===0||S===u-1?"round":"butt"} />`)}let f=(e.value-e.minValue)/(e.maxValue-e.minValue),g=Ha(i,a,l+c*f),x=1.5,$=(S,E,v,C)=>b`
    <defs><path id=${S} d=${La(i,a,E,v)} /></defs>
    <text font-size=${Ra*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${S}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return b`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*t} fill=${Uo(e.colorHexes,f)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?$(`${n}-gmin`,l-x-Math.max(o,3),l-x,e.minLabel):m}
    ${e.maxLabel!==void 0?$(`${n}-gmax`,d+x,d+x+Math.max(s,3),e.maxLabel):m}`}function Na(e,t){let n=e.family in ve?e.family:"rectangular",i=t.slot??ve[n],a=ve[n],r=ii(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,s=Oe(e.backgroundColorHex),l=Oe(e.borderColorHex),d=e.borderWidth*r.scale;if(n==="corner"){let g=r.scale,x=!!e.bezelText||!!e.bezelGauge,$=e.curvedText??"",S=$!=="",E=oi(g,x),v=za(g,x),C=v/(a.width*g),N=E.tile.cx-v/2,B=E.tile.cy-v/2,q=`M 0 0 H ${E.quad.width-E.cornerRadius} A ${E.cornerRadius} ${E.cornerRadius} 0 0 1 ${E.quad.width} ${E.cornerRadius} V ${E.quad.height} H 0 Z`,le=m;if(e.bezelGauge)le=Cc(e.bezelGauge,g,o);else if(e.bezelText){let T=xc(g,`${o}-bezel`),V=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?Wt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;le=b`<defs><path id=${T.id} d=${T.d} /></defs>
        <text font-size=${No*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${T.id}" startOffset="50%" text-anchor="middle">${Oo(V,T.length,No*g)}</textPath></text>`}let w=m;if(S){let T=Oe(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},V=qo(g,`${o}-curved`,wc*g,kc);w=b`<defs><path id=${V.id} d=${V.d} /></defs>
        <text font-size=${Do*g} font-weight="600" fill=${T.color} fill-opacity=${T.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${V.id}" startOffset="50%" text-anchor="middle">${Oo($,V.length,Do*g*.88)}</textPath></text>`}else{let T=e.borderWidth*r.scale*C,V=l?b`<circle cx=${v/2} cy=${v/2} r=${v/2-T/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${T} />`:m;w=b`<g transform="translate(${N} ${B})">
        <g clip-path=${`url(#${o})`}>
          ${s?b`<rect width=${v} height=${v} fill=${s.color} fill-opacity=${s.opacity} />`:m}
          <g data-design-box transform="scale(${r.scale*C})">
            ${e.elements.map(P=>Aa(P,a,t))}
          </g>
        </g>
        <circle cx=${v/2} cy=${v/2} r=${v/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${V}
      </g>`}return b`<svg viewBox=${`0 0 ${E.quad.width} ${E.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${E.quad.width} height=${E.quad.height}>
      <defs><clipPath id=${o}><circle cx=${v/2} cy=${v/2} r=${v/2} /></clipPath></defs>
      <path d=${q} fill="#000000" />
      ${le}
      ${w}
    </svg>`}let c=b`<rect width=${i.width} height=${i.height} />`,u=l?b`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:m,h=b`<rect width=${i.width} height=${i.height} fill="#000000" />`,f=`0 0 ${i.width} ${i.height}`;return b`<svg viewBox=${f} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${c}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${s?b`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`:m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(g=>Aa(g,a,t))}
      </g>
    </g>
    ${u}
  </svg>`}var Sc=.14;function Ec(e,t){let n=Wo(e,t);if(e.kind!=="text"||e.text==="")return n;let i=Math.min(n.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(n.h,e.fontSize*1.3);return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}function Tc(e,t,n){let i=e.family in ve?e.family:"rectangular",a=ve[i],r=e.elements.filter(h=>t.includes(h.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let h of r){let f=Ec(h,a),g=h.frame.rotationDegrees%180===0?0:Math.hypot(f.w,f.h)/2;o=Math.min(o,g?f.cx-g:f.x),s=Math.min(s,g?f.cy-g:f.y),l=Math.max(l,g?f.cx+g:f.x+f.w),d=Math.max(d,g?f.cy+g:f.y+f.h)}let c=l-o,u=d-s;if(r.length===0||!(c>0)||!(u>0))o=0,s=0,c=a.width,u=a.height;else{let h=Math.max(2,Math.max(c,u)*Sc);o-=h,s-=h,c+=2*h,u+=2*h}if(c/u<n){let h=u*n;o-=(h-c)/2,c=h}else{let h=c/n;s-=(h-u)/2,u=h}return{x:o,y:s,w:c,h:u}}function Yo(e,t,n){let i=e.family in ve?e.family:"rectangular",a=ve[i],r=Tc(e,t,n.width/n.height),o=Oe(e.backgroundColorHex),s=Oe(e.borderColorHex),l=e.borderWidth,d={icons:n.icons,showHidden:!0,tapAreas:!0,...n.imageSizes?{imageSizes:n.imageSizes}:{}},c=e.elements.filter(f=>t.includes(f.id)),u=s&&l>0?i==="rectangular"?b`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:b`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:m,h=i==="rectangular"?b`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:b`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return b`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${n.width} height=${n.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${c.map(f=>Aa(f,a,d))}
    ${u}
  </svg>`}function J(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var jt=["rectangular","circular","corner","inline"];function Ft(e){return ie.includes(e)}function Jo(e){return jt.filter(t=>e.supportedFamilies.includes(t))}function Xo(e){return ie.find(t=>e.supportedFamilies.includes(t))}function si(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function Fc(){return{value:R("")}}function Mc(e){let t=Kt();for(let n of e.elements)t.placements[n.payload.id]={frame:{...n.payload.frame},isHidden:!0};return t}function Zo(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=jt.filter(n=>n===t||e.supportedFamilies.includes(n))),Ft(t)?e.perFamily[t]||(e.perFamily[t]=Mc(e)):e.inline||(e.inline=Fc()),e.schemaVersion=hn(e)}function Qo(e,t){si(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),Ft(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=hn(e))}function es(e,t){let n=[];if(!Ft(t)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let a=Object.values(i.placements).filter(r=>!r.isHidden).length;return a>0&&n.push(`${a} placed layer${a===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var he={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},qt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area"},Pa=["text","icon","gauge","chart","timeline","shape","image","tap"],ne={states:"#f9a825",tap:he.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var ts="2.8.0";function Oa(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function Rc(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function ns(e,t=ts){let n=Oa(e),i=Oa(t);return!n||!i?!1:Rc(n,i)>=0}function is(e,t=ts){return`${Oa(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var as="52a9d81d0fd7";function Ic(e){return e.trim().replace(/\./g,"-")}function Ac(e){return e.trim().replace(/-/g,".")}var li=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>Ac(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let a=Ic(t),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Oe(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return b`<svg x="0" y="0" width=${n} height=${n} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},Da=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let a=this.icons.get(t.trim());if(!a)return;let r=Oe(i)??{color:"#FFFFFF",opacity:1};return b`<svg x="0" y="0" width=${n} height=${n} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${as}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,a]of Object.entries(n))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function rs(e){return li.available()?new li(e):new Da(e)}function os(e){let t=new Map,n=new Set;return{size(i){let a=t.get(i);if(a)return a;if(n.has(i))return;n.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(t.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var ci=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],ui=[...new Set(ci.flatMap(e=>e.symbols))],Hc={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Lc(e){return`${e.replace(/\./g," ")} ${(Hc[e]??[]).join(" ")}`}function ss(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let a of e){let r=Lc(a);if(!n.every(s=>r.includes(s)))continue;let o=n.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var di=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var _c=100;function ls(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Mt=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,ut(t),this.baseline=JSON.stringify(Yn(t))}static fromDocument(t,n){return new e(po(t),n)}get dirty(){return JSON.stringify(Yn(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>_c&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let r=structuredClone(this.config);t(r),ut(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=Ea(t),Yn(t)}commit(){let t=structuredClone(this.config);return t.dataSources=Ea(t),new e(t,null)}};var Yt={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Ze={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},cs=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],us={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Va=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],zc=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function Ba(e){return zc.includes(e)}function Nc(e){return Va.includes(e)}function Pc(e,t){return JSON.stringify(ae(e))===JSON.stringify(ae(t))}function Ga(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[r,o]of t.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!Nc(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Yt[l.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=l.value;else if(!Pc(n,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=ds(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Ze[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(t.otherwise){let r=ds(t.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Ze[r]} twice. A table has one cell per column.`}}let a={ruleId:t.id,rows:i,columns:Oc(i,t.otherwise),numberMode:i.length>0&&i.every(r=>Ba(r.comparison.kind))};return n!==void 0&&(a.value=n),t.otherwise&&(a.otherwise=t.otherwise),{ok:!0,table:a}}function ds(e){let t=new Set;for(let n of e){let i=Te[n.kind];if(t.has(i))return i;t.add(i)}}function Oc(e,t){let n=new Set;for(let i of e)for(let a of i.changes)n.add(Te[a.kind]);for(let i of t??[])n.add(Te[i.kind]);return cs.filter(i=>n.has(i))}function ps(e,t,n){let i=new Set(e);for(let a of t)i.add(a);return cs.filter(a=>i.has(a)&&n.includes(a))}function pi(e,t){return e.find(n=>Te[n.kind]===t)}function hs(e,t,n,i){let a=t.map(o=>({id:o.caseId??Z(),when:{join:o.join??"all",tests:[{id:o.testId??Z(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??Z(),cases:a};return n&&(r.otherwise=n),r}function Mn(e){if(e.length===0)return"No states yet.";let t=Ga(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function ms(e){let t=e[0];return t||(t={id:Z(),cases:[]},e.push(t)),t}function fs(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function gs(e,t,n){let i=ms(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:Z(),when:{join:"all",tests:[{id:Z(),value:structuredClone(t),comparison:Vc(a,n)}]},then:[]})}function ys(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),fs(e))}function Ua(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[a]=i.splice(t,1);a&&i.splice(n,0,a)}function Ka(e,t){if(t){ms(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,fs(e))}function bs(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function vs(e,t){let n=e[0];if(!n)return;let i=a=>a.filter(r=>Te[r.kind]!==t);for(let a of n.cases)a.then=i(a.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function Dc(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function xs(e,t=Dc){let n=()=>t(e.value??R(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??R(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return St(e.kind)==="value"?`${Yt[e.kind]} ${n()}`:Yt[e.kind]}}function Vc(e,t){if(!e)return t?{kind:"lessThan",value:R("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??R("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??R("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??R("0")};default:return{kind:e.kind,...St(e.kind)==="value"?{value:R("")}:{}}}}var ws={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function ks(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function Bc(e){switch(e){case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return b`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return b`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return b`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return b`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return b`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return b`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return b`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return b`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return b`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return b`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return b`<path d="M6 9L12 15L18 9" />`;case"plus":return b`<path d="M12 5V19M5 12H19" />`;case"watch":return b`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return b`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return b`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return b`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return b`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return b`<path d="M6 14L12 8L18 14" />`;case"down":return b`<path d="M6 10L12 16L18 10" />`;case"show":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return b`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return b`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return b`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return b`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return b`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return b`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`}}function z(e){return p`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Bc(e)}</svg>`}var De="color-mix(in srgb, var(--k) 45%, #6b7280)",hi='system-ui, -apple-system, "Segoe UI", sans-serif';function $s(e,t,n,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let u=c*Math.PI/180;return{x:(e-n*Math.cos(u)).toFixed(2),y:(t-n*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${n} ${n} 0 ${d} 1 ${l.x} ${l.y}`}function Wa(e,t,n,i){return b`<g fill="none" stroke-linecap="round">
    <path d=${$s(e,t,n,1)} stroke=${De} stroke-width="2.6" opacity=".5" />
    <path d=${$s(e,t,n,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function Gc(e){switch(e){case"text":return b`<g font-family=${hi} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${De}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${De}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${De}>1.2 kW</text>
      </g>`;case"icon":return b`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <g opacity=".55" transform="translate(14 14) scale(.8)">
          <path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />
        </g>
        <g transform="translate(42 8) scale(1.25)">
          <path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" />
          <path d="M10.5 21.5H13.5" />
        </g>
        <g opacity=".55" transform="translate(80 14) scale(.8)">
          <path d="M12 20.5A4.5 4.5 0 0 0 16.5 16C16.5 12.5 12 4.5 12 4.5S7.5 12.5 7.5 16A4.5 4.5 0 0 0 12 20.5Z" />
        </g>
      </g>`;case"gauge":return b`<g>
        ${Wa(22,24,12,.28)}
        ${Wa(60,24,12,.62)}
        ${Wa(98,24,12,.92)}
        <text x="60" y="27" font-family=${hi} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return b`<g>
        <g opacity=".4" fill=${De}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"timeline":return b`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${De} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${De} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${De} opacity=".55" />
        <text x="6" y="39" font-family=${hi} font-size="7" fill=${De}>1h ago</text>
        <text x="114" y="39" font-family=${hi} font-size="7" text-anchor="end" fill=${De}>now</text>
      </g>`;case"shape":return b`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return b`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return b`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`}}function Cs(e){return p`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${Gc(e)}</svg>`}function Jt(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=n.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function Ss(e,t){let n={...e,...t};return ja({...n,x:pt(n.x),y:pt(n.y),width:Math.max(.04,pt(n.width)),height:Math.max(.04,pt(n.height))})}function ja(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var pt=e=>Math.round(e*1e3)/1e3,Es=10;function qa(e,t,n,i){let a=i.width>0?e.x+t/i.width:e.x,r=i.height>0?e.y+n/i.height:e.y;return ja({...e,x:pt(a),y:pt(r)})}function Ts(e,t,n,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?pt(a(e.x+t/i.w)):e.x,y:i.h>0?pt(a(e.y+n/i.h)):e.y}}function mi(e,t,n,i,a){let r=Jt(e,n),o={...i.frame},s=o;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let f=Jt(e,h),g=(f.x-r.x)/t.width,x=(f.y-r.y)/t.height,$;if(!i.handle)$=ja({...o,x:l(o.x+g),y:l(o.y+x)});else{let{x:S,y:E,width:v,height:C}=o,N=o.x+o.width,B=o.y+o.height;i.handle.includes("e")&&(v=Math.max(.04,o.width+g)),i.handle.includes("s")&&(C=Math.max(.04,o.height+x)),i.handle.includes("w")&&(v=Math.max(.04,o.width-g),S=N-v),i.handle.includes("n")&&(C=Math.max(.04,o.height-x),E=B-C),$={...o,x:l(S),y:l(E),width:l(v),height:l(C)}}s=$,a.onFrame(i.elementId,$,!1)},c=h=>{h.pointerId===n.pointerId&&(u(),a.onFrame(i.elementId,s,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}function Fs(e,t,n,i,a){let r=Jt(e,n),o=i;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,l=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let f=Jt(e,h),g=t.w>0?l(i.x+(f.x-r.x)/t.w):i.x,x=t.h>0?l(i.y+(f.y-r.y)/t.h):i.y;o={x:s(g),y:s(x)},a(o.x,o.y,!1)},c=h=>{h.pointerId===n.pointerId&&(u(),a(o.x,o.y,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}function Ms(e,t,n,i,a){let r=Jt(e,t),o=1;e.setPointerCapture(t.pointerId);let s=c=>{if(c.pointerId!==t.pointerId)return;let u=Jt(e,c),h=(u.x-r.x)*(n.includes("e")?1:-1),f=(u.y-r.y)*(n.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,x=i.h>0?(i.h+f)/i.h:1,$=Math.abs(g-1)>=Math.abs(x-1)?g:x;o=Math.max(.05,$),a(o,!1)},l=c=>{c.pointerId===t.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}function Uc(e){switch(e){case"light":return b`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return b`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return b`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return b`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return b`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return b`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return b`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return b`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return b`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return b`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return b`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return b`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return b`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return b`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return b`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return b`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return b`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return b`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return b`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return b`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return b`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return b`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return b`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return b`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return b`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return b`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return b`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return b`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return b`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return b`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return b`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return b`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return b`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function Ya(e){return p`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Uc(e)}</svg>`}var Kc={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Rs(e){let t=Kc[e];if(t!==void 0)return t;if(e==="")return"";let n=e.replace(/_/g," ");return n.charAt(0).toUpperCase()+n.slice(1)}var Wc=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function Ja(e){return Wc.has(e.trim().toLowerCase())}var er=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function xe(e){return t=>e(t.target.value)}function Xs(e){return e===void 0||e.atDefault?m:p`<button type="button" class="icon tiny reset" title=${e.title} aria-label=${e.title}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}>${z("reset")}</button>`}function et(e,t){let n=Xs(t);return n===m?p`<span>${e}</span>`:p`<span class="has-reset">${e}${n}</span>`}function Xt(e,t,n,i=a=>String(a)){if(t===void 0)return;let a=t;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>n(a)}}function pe(e,t,n,i={}){return p`<label class="field">${et(e,Xt(t,i.def,n,a=>a===""?"empty":a))}
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${xe(n)} /></label>`}function Zs(e,t,n,i=3){return p`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${xe(n)}></textarea></label>`}function ee(e,t,n,i={}){let a=t===void 0||Number.isNaN(t)?"":String(t),r=p`<input type="number" .value=${a} step=${i.step??"any"} min=${i.min??m} max=${i.max??m}
      @input=${xe(o=>{if(o.trim()===""){i.optional&&n(void 0);return}let s=Number(o);Number.isNaN(s)||n(s)})} />`;return p`<label class="field">${et(e,Xt(t,i.def,n))}${r}</label>`}function Fe(e,t,n,i,a={}){let r=o=>n.find(([s])=>s===o)?.[1]??o;return p`<label class="field">${et(e,Xt(t,a.def,i,r))}
    <select @change=${xe(o=>i(o))}>
      ${n.map(([o,s])=>p`<option value=${o} ?selected=${o===t}>${s}</option>`)}
    </select></label>`}function te(e,t,n,i,a={}){let r=o=>n.find(([s])=>s===o)?.[1]??o;return p`<div class="field seg-field">${et(e,Xt(t,a.def,i,r))}
    <div class="seg wide" role="radiogroup" aria-label=${e}>
      ${n.map(([o,s])=>p`<button type="button" role="radio" aria-checked=${o===t?"true":"false"}
        class=${o===t?"on":""} title=${a.titles?.[o]??m}
        @click=${()=>{o!==t&&i(o)}}>${s}</button>`)}
    </div></div>`}function Rn(e,t,n,i){let a=i.format??(r=>String(Math.round(r*100)/100));return p`<div class="field slider">${et(e,Xt(t,i.def,n,a))}
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${xe(r=>{let o=Number(r);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${a(t)}</span>
    </div></div>`}function fi(e,t,n,i,a,r){let o=s=>Math.round(s*1e3)/10;return ee(e,o(t),s=>n((s??0)/100),{min:a,max:r,step:.5,def:o(i)})}function Ae(e,t,n,i){return p`<label class="field check"><input type="checkbox" .checked=${t} @change=${a=>n(a.target.checked)} />${et(e,Xt(t,i,n,a=>a?"on":"off"))}</label>`}function re(e,t,n,i=!1,a){let r=(t??"").replace(/^#/,""),o=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(r),s=o?`#${r.slice(0,6)}`:"#ffffff",l=o&&r.length===8?Math.round(parseInt(r.slice(6,8),16)/255*100):100,d=(u,h)=>{let f=u.replace(/^#/,"").toUpperCase();return h>=100?`#${f}`:`#${f}${Math.round(h/100*255).toString(16).padStart(2,"0").toUpperCase()}`},c=a===void 0?void 0:{atDefault:jc(t,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>n(a??void 0)};return p`<div class="field color">${et(e,c)}
    <div class="color-row">
      ${i?p`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${u=>n(u.target.checked?d(s,l):void 0)} />`:m}
      <input type="color" .value=${s} ?disabled=${i&&t===void 0} @input=${xe(u=>n(d(u,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${xe(u=>n(d(s,Number(u))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${xe(u=>{let h=u.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)&&n(h.startsWith("#")?h.toUpperCase():`#${h.toUpperCase()}`)})} />
    </div></div>`}function jc(e,t){return e===void 0||t===void 0?e===t:e.replace(/^#/,"").toUpperCase()===t.replace(/^#/,"").toUpperCase()}function Qs(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function qc(e,t,n){let i=t===void 0?void 0:typeof t=="string"?[t]:t,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=n?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function Is(e){let{entities:t,devices:n,areas:i}=e;if(!t||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=t[r];if(o)return a(o.area_id)??a(o.device_id?n?.[o.device_id]?.area_id:void 0)}}var el=50;function Yc(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function Jc(e,t,n=el,i){let a=t.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,n);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),h=-1;d===a?h=0:d.startsWith(a)?h=1:c.startsWith(a)?h=2:d.includes(a)?h=3:c.includes(a)?h=4:o.length>1&&o.every(f=>d.includes(f)||c.includes(f))?h=5:u!==""&&(u.includes(a)||o.length>1&&o.every(f=>d.includes(f)||c.includes(f)||u.includes(f)))&&(h=6),h>=0&&s.push({c:l,rank:h})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,n).map(l=>l.c)}var Xc=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function tl(e){return Xc.test(e.trim())}function Zc(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return Qs(n,i);if(tl(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var It=new Map;function Ie(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}t=a}}function nl(e){return It.has(e)}function Qe(e,t,n,i,a,r={}){let o=e.hass.states,s=It.get(a),l=s?Jc(qc(o,r.domain,Is(e.hass)),s.query,el,r.preferNumeric?Yc:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=n.entityId?o[n.entityId]:void 0,u=(v,C,N=0)=>{It.set(a,{query:C,index:N}),Ie(v)},h=v=>{It.delete(a),Ie(v)},f=v=>{let C=Zc(v,n,o);C&&i(C)},g=(v,C)=>{i(Qs(o,v.entityId)),h(C)},x=()=>Math.max(0,Math.min(It.get(a)?.index??0,l.length-1)),$=v=>{let C=v.target;if(v.key==="ArrowDown"||v.key==="ArrowUp"){v.preventDefault();let N=It.get(a);if(!N){u(C,C.value);return}let B=v.key==="ArrowDown"?x()+1:x()-1;u(C,N.query,Math.max(0,Math.min(l.length-1,B))),Qc(C);return}if(v.key==="Enter"){v.preventDefault();let N=l[x()];s&&N?g(N,C):(f(C.value),h(C));return}if(v.key==="Escape"){if(!s)return;v.preventDefault(),v.stopPropagation(),h(C)}},S=n.entityId?Is(e.hass)?.(n.entityId):void 0,E=n.entityId===""?p`<div class="hint">Type part of a name, a room, or an id.</div>`:c?p`<div class="entity-current">
          <span class="ent-ico ${Ja(c.state)?"on":""}">${Ya(n.domain||n.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:n.entityId}</span>
          ${S?p`<span class="ent-area">${S}</span>`:m}
          <span class="ent-state">${c.state}</span>
        </div>`:p`<div class="hint warn">Not in Home Assistant right now.</div>`;return p`<div class="field entity-field">
    <span>${t}</span>
    <div class="ent-box ${s?"open":""}">
      <span class="ent-glass">${z("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:n.entityId}
        placeholder="Search by name, room, or id"
        @focus=${v=>{let C=v.target;u(C,n.entityId),C.select()}}
        @input=${v=>{let C=v.target;u(C,C.value)}}
        @keydown=${$}
        @blur=${v=>{let C=v.target;s&&f(C.value),h(C)}} />
      ${(s?s.query:n.entityId)===""?m:p`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${v=>v.preventDefault()}
        @click=${v=>{let C=v.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),It.set(a,{query:"",index:0}),Ie(C),C?.focus()}}>${z("close")}</button>`}
    </div>
    ${s?p`<div class="entity-results" role="listbox">
          ${l.length===0?p`<div class="hint" style="padding:6px 8px">${tl(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((v,C)=>p`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${N=>N.preventDefault()} @click=${N=>g(v,N.target)}>
                <span class="ent-ico ${Ja(v.state)?"on":""}">${Ya(v.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${v.name}</span>
                  <span class="ent-sub">
                    ${v.area?p`<span class="ent-area">${v.area}</span>`:m}
                    <span class="ent-id mono">${v.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Rs(v.domain)}</span>
                  <span class="ent-state">${v.state}</span>
                </span>
              </button>`)}
        </div>`:E}
  </div>`}function Qc(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var eu=120;function tu(e,t,n,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(ci.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:a(ui),fromPack:!1}}function As(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function nu(e){return[{value:"",label:`Starter set (${As(ui,e)})`},...ci.map(t=>({value:t.name,label:`${t.name} (${As(t.symbols,e)})`}))]}function iu(e){return e.length>0?e.length:ui.length}function au(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Hs(e,t,n,i){let a=e.icons.render(t,22,"#FFFFFF");return p`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${a??p`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function il(e,t,n,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),s=e.icons.names(),l=s??[],d=new Set(l),c=t.trim(),u=c!==""&&d.size>0&&!d.has(c),h=g=>{n(g),a.noteUsed(g)},f=m;if(r){let g=a.category(i),x=tu(g,o,l,d),$=ss(x.names,o),S=x.fromPack?$.slice(0,eu):$,E=d.size===0?a.recent:a.recent.filter(v=>d.has(v));f=p`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${xe(v=>a.setQuery(i,v))} />
        <select @change=${xe(v=>a.setCategory(i,v))}>
          ${nu(d).map(v=>p`<option value=${v.value} ?selected=${v.value===g}>${v.label}</option>`)}
        </select>
      </div>
      ${E.length===0?m:p`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${E.map(v=>Hs(e,v,v===c,h))}</div>`}
      <div class="sym-grid">${S.map(v=>Hs(e,v,v===c,h))}</div>
      ${$.length===0?p`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:p`<div class="hint">
            ${au(S.length,$.length,o.trim()!=="",iu(l))}
          </div>`}
      ${e.icons.available()?s!==void 0&&s.length===0?p`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:p`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return p`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${xe(n)} @change=${xe(g=>{(d.size===0||d.has(g.trim()))&&a.noteUsed(g)})} /></label>
    ${u?p`<div class="hint warn">The installed icon pack has no <code>${c}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${f}`}var ru=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],ou=[["bars","Bars"],["line","Line"],["area","Area"]],su=[["auto","Auto"],["fixed","Fixed range"]],lu=[["lowest","Lowest value"],["zero","Zero"]],al=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],du=[["none","None"],["pointer","Triangle & dot"],["dot","Dots"]],Ls=[["uniform","One colour"],["bands","By value"]];function _s(e){let t=[Yi,"#FFD60A"];if(e.length<2)return t.map((o,s)=>({id:Z(),upTo:(s+1)*33,colorHex:o}));let n=Math.min(...e),a=Math.max(...e)-n,r=o=>Number(o.toFixed(a>=10?0:2));return t.map((o,s)=>({id:Z(),upTo:r(n+a*(s+1)/3),colorHex:o}))}function cu(e){if(e.length===0)return 0;let t=Math.min(...e),n=Math.max(...e),i=n-t;return Number(((t+n)/2).toFixed(i>=10?0:2))}function uu(e,t){let n=gn({bands:e}),i=n.at(-1),a=e.length>1?Math.abs(n[1].upTo-n[0].upTo):10;return{id:Z(),upTo:(i?.upTo??0)+(a||10),colorHex:t}}function zs(e,t,n){return p`
    ${e.bands.map((i,a)=>p`
      <div class="row-inline">
        ${ee("Up to",i.upTo,r=>n(o=>{let s=o.bands[a];s&&(s.upTo=r??0)},`bup${i.id}`))}
        ${re("Colour",i.colorHex,r=>n(o=>{let s=o.bands[a];s&&(s.colorHex=r??"#FFFFFF")},`bcol${i.id}`))}
        <button class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>n(r=>{r.bands=r.bands.filter((o,s)=>s!==a)})}>${z("close")}</button>
      </div>`)}
    <button class="small" @click=${()=>n(i=>{i.bands=[...i.bands,uu(i.bands,t)]})}>Add band</button>
    ${re("And the rest",e.bandAboveColorHex,i=>n(a=>{a.bandAboveColorHex=i??st},"babove"),!1,st)}`}function pu(e,t,n,i){let a=new Map,r=new Map,o=(d,c)=>{let u=d.trim();if(u==="")return;let h=u.toLowerCase();r.has(h)||r.set(h,u),a.set(h,(a.get(h)??0)+c)};e.forEach((d,c)=>{let u=e[c+1],h=u===void 0?t:u.offsetSeconds;o(d.state,Math.max(0,h-d.offsetSeconds))}),n!==void 0&&o(n,0),(aa[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,c)=>c[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function hu(e,t,n=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=n.find(o=>!a.has(o.toLowerCase()))??"";return p`
    ${e.bands.map((o,s)=>p`
      <div class="row-inline">
        ${pe("State",o.match,l=>t(d=>{let c=d.bands[s];c&&(c.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${re("Colour",o.colorHex,l=>t(d=>{let c=d.bands[s];c&&(c.colorHex=l??lt)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>t(l=>{l.bands=l.bands.filter((d,c)=>c!==s)})}>${z("close")}</button>
      </div>`)}
    <datalist id=${i}>${n.map(o=>p`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>t(o=>{o.bands=[...o.bands,{id:Z(),match:r,colorHex:Vn(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${re("Otherwise",e.otherColorHex,o=>t(s=>{s.otherColorHex=o??lt},"tother"),!1,lt)}`}var mu=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"]],fu={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled"};function Ns(e){let t=e.value.kind;if(t.kind==="aggregate"){let{stateFilter:n,...i}=t.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return R(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var gu=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function yu(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""};case"chartStat":return{kind:t,layer:"",stat:"latest"}}}function oe(e,t,n,i){if(i.inline||!bu())return p`<div class="value-editor">${sl(e,t,n,i)}</div>`;let a=tr(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,s=me(t,fe(e)),l="entityId"in t.kind;return p`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?m:p`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?m:p`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${rl(e,a,r,t,n,i)}
  </div>`}function rl(e,t,n,i,a,r){return p`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${ol}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${An.has(t)?sl(e,i,a,r):m}
  </div>`}function fe(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function tr(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function bu(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var An=new Set,In=new WeakMap;function vu(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function xu(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(t)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function ol(e){let t=e.currentTarget,n=e.newState==="open",i=In.get(t);if(i&&(i(),In.delete(t)),!n){An.delete(t.id)&&Ie(t);return}let a=vu(t);if(!a)return;let r=()=>{if(!t.isConnected||!t.matches(":popover-open")){In.get(t)?.(),In.delete(t);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}Xa(t,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),In.set(t,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Xa(t,a.getBoundingClientRect()),An.has(t.id)||(An.add(t.id),Ie(t),requestAnimationFrame(()=>{t.isConnected&&Xa(t,a.getBoundingClientRect())}))}function Xa(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=wu({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Rt=8,gi=6,Ps=140;function wu(e,t,n){let i=n.height-e.bottom-gi-Rt,a=e.top-gi-Rt,r=t.height>i&&a>i&&i<Ps,o=Math.max(Ps,r?a:i),s=Math.min(t.height,o),l=Math.max(Rt,Math.min(e.left,n.width-t.width-Rt)),d=r?Math.max(Rt,e.top-gi-s):Math.max(Rt,Math.min(e.bottom+gi,n.height-s-Rt));return{left:l,top:d,maxHeight:o,above:r}}function sl(e,t,n,i){let a=t.kind,r=c=>n({...t,kind:c}),o=i.key,s=ru.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=m;switch(a.kind){case"literal":l=i.symbol?il(e,a.value,c=>r({...a,value:c}),o):pe("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=Qe(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=p`${Qe(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${pe("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:u,mono:!0})}
        <datalist id=${u}>${c.map(h=>p`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":l=$u(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=Fe("Field",a.timeField,gu,c=>r({...a,timeField:c}));break;case"dataAge":l=p`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":l=p`${Zs("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":l=e.config.values.length===0?p`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:Fe("Value",a.id,[["","(choose)"],...e.config.values.map(c=>[c.id,c.name||c.id.slice(0,8)])],c=>r({...a,id:c}));break;case"chartStat":{let c=fe(e),u=e.config.elements.filter(h=>h.kind==="chart");l=u.length===0?p`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:p`
          ${Fe("Chart",a.layer,[["","(choose)"],...u.map(h=>[h.payload.id,Me(h,c)])],h=>r({...a,layer:h}))}
          ${Fe("Number",a.stat,[...Pt],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(t):void 0;return p`
    ${Fe("Source",a.kind,s,c=>r(yu(a,c)))}
    ${l}
    ${i.noFormat?m:ku(t.format,c=>n(Pe(c)?{kind:t.kind}:{...t,format:c}))}
    ${i.showResolved?p`<div class="hint">Now: ${d===void 0?p`<span class="warn">unresolved</span>`:p`<code>${d}</code>`}</div>`:m}`}function ku(e,t){let n=e??{},i=a=>{let r={...n,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];t(r)};return p`<details class="sub" ?open=${!Pe(e)}>
    <summary>Format${Pe(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${ee("Decimals",n.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${ee("Multiply",n.multiply,a=>i({multiply:a}),{optional:!0})}
      ${ee("Offset",n.offset,a=>i({offset:a}),{optional:!0})}
      ${te("Case",n.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${pe("Prefix",n.prefix??"",a=>i({prefix:a}))}
      ${pe("Suffix",n.suffix??"",a=>i({suffix:a}))}
    </div>
    ${Ae("Append the entity's unit",!!n.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${te("Seconds as",n.duration?"duration":n.relativeTime?"relativeTime":"",[["","None"],["relativeTime","Time ago"],["duration","Duration"]],a=>i({relativeTime:a==="relativeTime",duration:a==="duration"}),{titles:{relativeTime:"45s, 2m, 3h",duration:"1h 23m, 45s"}})}
  </details>`}function $u(e,t,n,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=t.scope;return p`
    ${Fe("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>n({...t,function:s}))}
    ${te("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>n({...t,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?p`<div class="grid2">
          ${pe("Domains",a(o.domains),s=>n({...t,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${pe("Area ids",a(o.areaIds),s=>n({...t,scope:{...o,areaIds:r(s)}}))}
          ${pe("Label ids",a(o.labelIds),s=>n({...t,scope:{...o,labelIds:r(s)}}))}
          ${pe("Floor ids",a(o.floorIds),s=>n({...t,scope:{...o,floorIds:r(s)}}))}
        </div>`:p`${o.entities.map((s,l)=>p`<div class="row-inline">
            ${Qe(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,n({...t,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${z("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${Fe("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...t};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:l.stateFilter={kind:s},n(l)})}
    ${t.stateFilter&&"value"in t.stateFilter?pe("State",t.stateFilter.value,s=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:s}})):m}
    ${t.function==="count"?m:pe("Attribute (blank = state)",t.attribute??"",s=>{let l={...t};s?l.attribute=s:delete l.attribute,n(l)})}`}var ll=la,Cu=ll.filter(([e])=>e!=="none");function Su(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function dl(e,t){let n=Su(t)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=t.type==="callService"?{...t}:{type:"callService",serviceDomain:"",serviceName:""};return n.entityId!==""&&(i.target=n),i}return ro(e)?{type:e,...n}:{type:e}}var Eu=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function cl(e,t,n,i){let a=t.serviceDataJSON??"",r=oo(a),o=t.target??{entityId:"",displayName:"",domain:""};return p`
    <div class="gen-row">
      ${pe("Domain",t.serviceDomain,s=>n({...t,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${pe("Service",t.serviceName,s=>n({...t,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${Eu.map(([s,l,d,c])=>p`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let u={...t,serviceDomain:l,serviceName:d};c===""?delete u.serviceDataJSON:u.serviceDataJSON=c,n(u)}}>${s}</button>`)}
    </div>
    ${Qe(e,"Target entity (optional)",o,s=>{let l={...t};s.entityId===""?delete l.target:l.target=s,n(l,"svc-entity")},`${i}-svc-entity`)}
    ${Zs("Data (JSON)",a,s=>{let l={...t};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,n(l,"svc-data")},3)}
    ${r?p`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:p`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function Tu(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function ul(e){let t=e.config,n=t.tapAction,i=Tu(e.savedName,t.name),a=t.refreshMinutes??0,r=Os.map(s=>[String(s),Ds(s)]);Os.includes(a)||r.push([String(a),Ds(a)]);let o=t.showSuccessFlash??!0;return p`
    <div class="gen-row">
      ${pe("Name",t.name,s=>e.update(l=>{l.name=s},"name"))}
      ${Fe("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${Fe("Tap action",n.type,ll,s=>e.update(l=>{l.tapAction=dl(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?p`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??Fu).slice(0,7)}
                @input=${xe(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:p`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?p`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m}
    ${"entityId"in n?Qe(e,"Target",n,s=>e.update(l=>{l.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):m}
    ${n.type==="callService"?cl(e,n,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):m}
    ${n.type==="openPage"?Mu(e):m}`}var Fu="#808080",Os=[0,15,30,60,120];function Ds(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function Mu(e){let t=e.config;return pl(e,t.openPageId,t.openPageName,(n,i)=>e.update(a=>{if(n===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=n,i?a.openPageName=i:delete a.openPageName}))}function pl(e,t,n,i){let a=t??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${n||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?p`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:p`${Fe("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?m:p`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function hl(e,t){let n=e.config.values.findIndex(a=>a.id===t.id),i=`nv-${t.id}`;return p`
    ${pe("Name",t.name,a=>e.update(r=>{r.values[n].name=a},`${i}-name`))}
    ${oe(e,t.value,a=>e.update(r=>{r.values[n].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${Vs(e.config,t.id)} layer${Vs(e.config,t.id)===1?"":"s"}.</div>`}function Vs(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function ml(){return{id:Z(),name:"Value",value:R("")}}function we(e,t,n){let i=e.perFamily[t],a=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function Ee(e,t,n,i,a=!1){let r=e.elements.find(c=>c.payload.id===n);if(!r)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let s=we(e,t,r),d={...o.placements[n]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let c of e.elements)c.payload.id!==n&&(o.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});o.placements[n]=d}function yi(e,t,n,i,a){let r=t.payload.id,o=Jn(t)??a.min,s=we(e.config,n,t).size??o;return ee(`${i} (pt)`,s,l=>e.update(d=>Ee(d,n,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${n}`),{step:a.step,min:a.min,...a.def===void 0?{}:{def:a.def}})}function fl(e,t,n){for(let i of ie)i===n||!e.supportedFamilies.includes(i)||Ee(e,i,t,{isHidden:!0})}function gl(e,t,n){let i=e.perFamily[n]??(e.perFamily[n]=Kt()),a={};for(let r of e.elements){let o=we(e,t,r),s=o.size??Jn(r),l={frame:{...o.frame},isHidden:o.isHidden,...s!==void 0?{size:s}:{}};a[r.payload.id]=pa(l,t,n,r.kind)}i.placements=a}function Ei(e,t){return e.elements.filter(n=>!we(e,t,n).isHidden).length}function Bs(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function Ru(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"?void 0:e.payload.colorSlot.baseColorHex}function yl(e,t,n){let i=Bs(n.map(d=>we(e,t,d).isHidden)),a=Bs(n.map(d=>d.payload.isHidden)),r=n.map(Ru),o=n.length>0&&r.every(d=>d!==void 0),s=r[0],l=o&&s!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===s.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:l?s:void 0}}var nr=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function Iu(e,t,n){let i=t.payload.id,a=Qn(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"&&t.payload.source==="camera",s=o?{domain:"camera"}:{},l=d=>{let c=e.hass.states[d]?.attributes?.device_class;return typeof c=="string"?c:void 0};return p`
    ${Qe(e,o?"Camera":"Entity",r,d=>e.update(c=>To(c,i,d,l(d.entityId)),`${n}-entity`),`${n}-layer-entity`,s)}
    <div class="hint">${Lu(t,a)}</div>`}function Au(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Hu(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Lu(e,t){let n=Au(e),i=n?.kind.kind,r=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let l=t.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Hu(o)}.${r}`}function _u(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function zu(e,t){let n=e.timestamp===!0,i=Ke(e),a=r=>t(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ke(o)&&(o.timestampCorner=oa(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return p`
    ${Ae("Show timestamp",n,r=>t(o=>{r?o.timestamp=!0:delete o.timestamp}),!1)}
    ${n?p`
      ${te("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?m:te("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>t(o=>{o.timestampCorner=r}))}
      ${ee("Text size (pt)",e.timestampSize,r=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,r??Gt))},"tssize"),{step:1,min:4,max:40,def:Gt})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:m}`}function ki(e,t){if(e===t)return!0;if(typeof e!=typeof t||e===null||t===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(t))return!1;if(Array.isArray(e))return e.length===t.length&&e.every((a,r)=>ki(a,t[r]));let n=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(t).filter(a=>t[a]!==void 0);return n.length!==i.length?!1:n.every(a=>ki(e[a],t[a]))}function Gs(e,t,n){return n.some(i=>!ki(e[i],t[i]))}function Us(e,t,n){let i=e,a=t;for(let r of n)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Ce(e,t,n,i,a={}){let r=e.openSections.has(t),o=()=>e.toggleSection(t);return p`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
      <span class="swatch">${z(a.icon??"content")}</span>
      <span class="tt"><h4>${n}${Xs(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${n} back to its defaults`,reset:a.reset})}</h4>${a.summary?p`<span class="sum">${a.summary}</span>`:m}</span>
      <span class="chev">${z("chevron")}</span>
    </div>
    ${r?p`<div class="sec-b">${i}</div>`:m}
  </section>`}function Nu(e){if(e.length===0)return"nothing";let t=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100);return e.length<=12?e.map(t).join(" "):`${e.slice(0,6).map(t).join(" ")} \u2026 ${e.slice(-3).map(t).join(" ")}`}function Pu(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let t=Math.round(e/60);if(t<90)return`${t}m`;let n=Math.floor(t/60),i=t%60;return i===0?`${n}h`:`${n}h ${i}m`}function Ou(e,t){let n=ue[e==="inline"?"rectangular":e],i=t.height*n.height>t.width*n.width,a=Math.round((t.rotationDegrees%180+180)%180)===90;return i!==a}function Du(e,t,n){let i=Ou(e,t),a=ue[e==="inline"?"rectangular":e],r=t.height*a.height>t.width*a.width;return p`<div class="grid2">
    ${te("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{n({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function Vu(e){let t=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return t.length===0?!1:t.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>t.length}function Bu(e,t,n=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??t,d=Math.max(0,l-s.offsetSeconds),c=i[i.length-1];c!==void 0&&c.state.trim().toLowerCase()===s.state.trim().toLowerCase()?c.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-n),r=a.map(o=>`${o.state||"(blank)"} ${Pu(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function $i(e){let t=Un.find(o=>o.minutes===e);if(t)return t.label;let n=Math.floor(e/1440),i=Math.floor(e%1440/60),a=e%60,r=[];return n>0&&r.push(`${n}d`),i>0&&r.push(`${i}h`),(a>0||r.length===0)&&r.push(`${a}m`),`Last ${r.join(" ")}`}var wi=new Set;function Za(e,t){return wi.has(e)||!Un.some(n=>n.minutes===t)}function Ks(e,t,n,i){let a=Za(e,t);return p`<label class="field">${et("Span",{atDefault:t===n&&!a,title:`Back to ${$i(n)}`,reset:()=>{wi.delete(e),i(n)}})}
      <select @change=${r=>{let o=r.target.value;o==="custom"?(wi.add(e),Ie(r.target)):(wi.delete(e),i(Number(o)||Kn))}}>
        ${Un.map(({minutes:r,label:o})=>p`<option value=${String(r)} ?selected=${!a&&r===t}>${o}</option>`)}
        <option value="custom" ?selected=${a}>Custom…</option>
      </select></label>`}function Ws(e,t){let n=Math.floor(e/1440),i=Math.floor(e%1440/60),a=e%60,r=(o,s,l)=>t(Math.min(Xi,Math.max(1,Math.round(o)*1440+Math.round(s)*60+Math.round(l))));return p`<div class="grid3 span-parts">
      ${ee("Days",n,o=>r(o??0,i,a),{step:1,min:0,max:7})}
      ${ee("Hours",i,o=>r(n,o??0,a),{step:1,min:0,max:23})}
      ${ee("Minutes",a,o=>r(n,i,o??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${$i(e)}, up to 7 days: the recorder keeps
      ten by default, and a longer span would quietly come back short.</div>`}function ir(e,t){let n=fe(e);switch(t.kind){case"text":return ht(me(t.payload.value,n),48);case"icon":return ht(me(t.payload.symbol,n),48);case"gauge":return ht(me(t.payload.value,n),48);case"chart":return ht(`${me(t.payload.value,n)}${t.payload.historyMinutes>0?` \xB7 ${$i(t.payload.historyMinutes)}`:""}`,48);case"timeline":return ht(`${me(t.payload.value,n)} \xB7 ${$i(Ne(t.payload))}`,48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||(t.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return We(t.payload.action)}}function Ci(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let t=e.payload,n=t.style==="dots"?`${t.bands.length>0&&t.coloring==="bands"?"banded":Se(t.colorSlot.baseColorHex)} dots`:`${t.lineWidth} pt line \xB7 ${t.coloring==="bands"&&t.bands.length>0?`${t.bands.length+1} colour bands`:Se(t.colorSlot.baseColorHex)}`;return`${t.style} \xB7 ${n}${t.thresholdValue===void 0?"":` \xB7 threshold ${t.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${al.find(([t])=>t===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"timeline":{let t=e.payload;return`${t.bands.length===0?`one colour (${Se(t.otherColorHex)})`:`${t.bands.length} ${t.bands.length===1?"state":"states"} coloured`}${t.gap>0?` \xB7 ${t.gap} pt gap`:""} \xB7 corners ${t.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Se(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Se(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function bl(e,t,n){let i=t.payload.id,a=e.config.elements.findIndex(y=>y.payload.id===i),r=`el-${i}`,o=(y,k)=>e.update(Y=>y(Y.elements[a]),k?`${r}-${k}`:void 0),s=we(e.config,n,t),l=s.frame,d=(y,k)=>e.update(Y=>Ee(Y,n,i,{frame:Ss(l,y)}),`${r}-${k}-${n}`),c=ze(t.kind).payload,u=c.colorSlot?.baseColorHex??"#FFFFFF",h=y=>c[y],f,g;switch(t.kind){case"text":{let y=da(e.config,t.payload.value);f=p`
        ${oe(e,t.payload.value,k=>o(Y=>{Y.payload.value=k},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${y?p`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(y.payload.id)}>${Me(y,fe(e))}</button>. It stays in the chart's group and moves with it.</div>`:m}
        ${Ae("Live countdown",t.payload.countdown===!0,k=>o(Y=>{let G=Y.payload;k?G.countdown=!0:delete G.countdown}),c.countdown===!0)}
        ${t.payload.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,g=p`<div class="grid2">
          ${yi(e,t,n,"Font size",{step:1,min:4,def:h("fontSize")})}
          ${te("Weight",t.payload.fontWeight,nr,k=>o(Y=>{Y.payload.fontWeight=k}),{def:c.fontWeight})}
        </div>`;break}case"icon":f=p`
        ${oe(e,t.payload.symbol,y=>o(k=>{k.payload.symbol=y},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,g=yi(e,t,n,"Icon size",{step:1,min:4,def:h("size")});break;case"gauge":{let y=t.payload,k=(G,A)=>o(D=>G(D.payload),A),Y=y.style==="dots";f=p`
        ${oe(e,y.value,G=>k(A=>{A.value=G},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        ${Y?p`
            ${oe(e,y.total??Ns(y),G=>k(A=>{A.total=G},"total"),{showResolved:!0,label:"Total",key:`${r}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${Gn} dots are drawn.</div>`:p`
            <div class="grid2">
              ${ee("Min",y.minValue,G=>k(A=>{A.minValue=G??0},"min"),{def:c.minValue})}
              ${ee("Max",y.maxValue,G=>k(A=>{A.maxValue=G??100},"max"),{def:c.maxValue})}
            </div>`}`,g=p`
        <div class="grid2">
          ${te("Style",y.style,mu,G=>k(A=>{G==="dots"&&A.total===void 0&&(A.total=Ns(A)),G!=="dots"&&delete A.total,A.style=G}),{titles:fu,def:c.style})}
          ${Y?m:yi(e,t,n,"Line width",{step:.5,min:.5,def:h("lineWidth")})}
        </div>
        ${re(Y?"Empty dot colour":"Track colour",y.trackColorHex,G=>k(A=>{A.trackColorHex=G??"#FFFFFF40"},"track"),!1,c.trackColorHex)}
        ${te("Colour",y.coloring,Ls,G=>k(A=>{A.coloring=G,G==="bands"&&A.bands.length===0&&(A.bands=_s([A.minValue,A.maxValue]))}),{def:c.coloring})}
        ${y.coloring==="bands"?p`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${zs(y,y.colorSlot.baseColorHex,k)}`:m}
        ${Y?m:p`
          <div class="grid2">
            ${ee("Threshold",y.thresholdValue,G=>k(A=>{G===void 0?delete A.thresholdValue:A.thresholdValue=G},"thr"),{optional:!0})}
            ${y.thresholdValue===void 0?m:re("Threshold colour",y.thresholdColorHex,G=>k(A=>{A.thresholdColorHex=G??Ot},"thrcol"),!1,Ot)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>`}`;break}case"chart":{let y=t.payload,k=(M,H)=>o(Ai=>M(Ai.payload),H),Y=kt(y),G=c.historyMinutes,A=c.historyPoints,D=y.historyMinutes>0,O=y.value.kind.kind==="entityState",se=Y===void 0?void 0:e.historySeries(Y),Qt=D&&O?se??"":e.resolve(y.value)??"",ke=y.historyPoints<1,en=Za(i,y.historyMinutes),W=Sn(Qt),Q=y.limit>0&&W.length>y.limit?y.takeFromEnd?W.slice(W.length-y.limit):W.slice(0,y.limit):W,Mi=!D&&O&&W.length===1,Ri=e.config.elements.filter(M=>M.kind==="chart"&&M.payload.id!==i),Ul=fe(e),Ii=y.scaleFrom!==void 0&&Ri.some(M=>M.payload.id===y.scaleFrom);f=p`
        ${oe(e,y.value,M=>k(H=>{H.value=M},"value"),{label:"Readings",key:`${r}-value`})}
        ${te("Draw",D?"history":"value",[["history","Recorded history"],["value","The value itself"]],M=>k(H=>{H.historyMinutes=M==="history"?H.historyMinutes||Kn:0}),{titles:{history:"Read the entity's past from the recorder and plot it",value:"Plot the numbers the value holds right now, such as a forecast list"},def:c.historyMinutes>0?"history":"value"})}
        ${D?p`
            ${O?m:p`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Ks(i,y.historyMinutes,G,M=>k(H=>{H.historyMinutes=M}))}
              <div class="field readings-field">${et("Readings",{atDefault:y.historyPoints===A,title:`Back to ${A<1?"every one":`${A} averaged`}`,reset:()=>k(M=>{M.historyPoints=A})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Readings">
                    <button type="button" role="radio" aria-checked=${ke?"false":"true"} class=${ke?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{ke&&k(M=>{M.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${ke?"true":"false"} class=${ke?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{ke||k(M=>{M.historyPoints=Qi})}}>Every one</button>
                  </div>
                  ${ke?m:p`<input type="number" class="short" aria-label="How many readings" .value=${String(y.historyPoints)}
                    step="1" min=${Zi} max=${Wn}
                    @input=${xe(M=>{let H=Number(M);M.trim()!==""&&Number.isFinite(H)&&H>=1&&k(Ai=>{Ai.historyPoints=Math.round(H)},"hpoints")})} />`}
                </div>
              </div>
            </div>
            ${en?Ws(y.historyMinutes,M=>k(H=>{H.historyMinutes=M},"span")):m}
            <div class="hint">${ke?p`Every state the recorder holds in that span, oldest first, one reading per change,
                  and a chatty sensor keeps its newest ${Wn}. The time axis follows
                  the changes, so a quiet hour draws narrower than a busy one.`:p`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${O&&se===void 0?p`<div class="hint">Reading the history…</div>`:m}
            ${O&&se===""?p`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:m}`:p`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${W.length===0&&!(D&&(!O||se===void 0||se===""))?p`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:m}
        ${W.length>0?p`<div class="hint">Reads <span class="nums">${Nu(Q)}</span>${W.length===Q.length?p` · ${Q.length} ${Q.length===1?"value":"values"}`:p` · ${Q.length} of ${W.length}`}</div>`:m}
        ${Mi?p`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:m}
        <div class="grid2">
          ${ee("Use",y.limit,M=>k(H=>{H.limit=Math.max(0,Math.round(M??0))},"limit"),{step:1,min:0,def:c.limit})}
          ${te("From",y.takeFromEnd?"end":"start",[["start","The first"],["end","The last"]],M=>k(H=>{H.takeFromEnd=M==="end"}),{def:c.takeFromEnd===!0?"end":"start"})}
        </div>
        <div class="hint">${D?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,g=p`
        <div class="grid2">
          ${te("Style",y.style,ou,M=>k(H=>{H.style=M}),{def:c.style})}
          ${y.style==="bars"?ee("Bar gap (pt)",y.barGap,M=>k(H=>{H.barGap=Math.max(0,M??0)},"gap"),{step:.5,min:0,def:c.barGap}):yi(e,t,n,"Line width",{step:.5,min:.5,def:h("lineWidth")})}
        </div>
        <div class="grid2">
          ${te("Scale",y.scale,su,M=>k(H=>{H.scale=M}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:c.scale})}
          ${te("Baseline",y.baseline,lu,M=>k(H=>{H.baseline=M}),{def:c.baseline})}
        </div>
        ${Ri.length===0?m:Fe("Same scale as",Ii?y.scaleFrom:"",[["","Its own"],...Ri.map(M=>[M.payload.id,Me(M,Ul)])],M=>k(H=>{M?H.scaleFrom=M:delete H.scaleFrom}),{def:""})}
        ${Ii?p`<div class="hint">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:m}
        ${!Ii&&y.scale==="fixed"?p`<div class="grid2">
              ${ee("Min",y.minValue,M=>k(H=>{H.minValue=M??0},"cmin"),{def:c.minValue})}
              ${ee("Max",y.maxValue,M=>k(H=>{H.maxValue=M??100},"cmax"),{def:c.maxValue})}
            </div>`:m}
        <div class="hint">${y.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
          @click=${()=>{let M;e.update(H=>{M=So(H,i)}),M&&e.selectLayer(M)}}>
          ${z("plus")}<span>Second series</span></button>
        ${te("Colour",y.coloring,Ls,M=>k(H=>{H.coloring=M,M==="bands"&&H.bands.length===0&&(H.bands=_s(Q))}),{def:c.coloring})}
        ${y.coloring==="bands"?p`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${y.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${zs(y,y.colorSlot.baseColorHex,k)}
          ${y.style==="area"?p`${Ae("Fill follows the bands",y.fillBands,M=>k(H=>{H.fillBands=M}),c.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:m}`:m}
        <div class="grid2">
          ${te("Highlight",y.highlight,al,M=>k(H=>{H.highlight=M}),{def:c.highlight})}
          ${y.highlight==="none"?m:te("Marker",y.marker,du,M=>k(H=>{H.marker=M}),{def:c.marker})}
        </div>
        ${y.highlight==="none"?m:p`
          <div class="grid2">
            ${y.highlight==="lowest"?m:re("Highest colour",y.highColorHex,M=>k(H=>{H.highColorHex=M??mn},"hicol"),!1,mn)}
            ${y.highlight==="highest"?m:re("Lowest colour",y.lowColorHex,M=>k(H=>{H.lowColorHex=M??fn},"locol"),!1,fn)}
          </div>
          <div class="hint">A marker is worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}
        ${Ae("Threshold line",y.thresholdValue!==void 0,M=>k(H=>{M?H.thresholdValue=cu(Q):delete H.thresholdValue}))}
        ${y.thresholdValue===void 0?m:p`
          <div class="grid2">
            ${ee("At",y.thresholdValue,M=>k(H=>{H.thresholdValue=M??0},"thval"))}
            ${re("Line colour",y.thresholdColorHex,M=>k(H=>{H.thresholdColorHex=M??Dt},"thcol"),!1,Dt)}
          </div>
          <div class="hint">${y.scale==="fixed"?"A threshold outside Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the line, so a series that never reaches it still shows how far off it is."}</div>`}
        ${Ae("\u201CNow\u201D marker",y.nowIndex!==void 0,M=>k(H=>{M?H.nowIndex={kind:{kind:"time",timeField:"hour"}}:delete H.nowIndex}))}
        ${y.nowIndex===void 0?m:p`
          ${oe(e,y.nowIndex,M=>k(H=>{H.nowIndex=M},"nowidx"),{showResolved:!0,label:"Reading number",key:`${r}-nowindex`})}
          ${re("Marker colour",y.nowColorHex,M=>k(H=>{H.nowColorHex=M??Vt},"nowcol"),!1,Vt)}
          <div class="hint">Counted from 0, so Hour puts the line on reading 14 at 2 pm, which is what a
            24-reading price or forecast chart wants. Rounded, and clamped to the readings drawn.</div>`}`;break}case"timeline":{let y=t.payload,k=(W,Q)=>o(Mi=>W(Mi.payload),Q),Y=c.historyMinutes,G=y.value.kind.kind==="entityState",A=ct(y),D=A===void 0?void 0:e.historySeries(A),O=Ne(y)*60,se=En(D??"",dt),Qt=Za(i,y.historyMinutes),ke=y.value.kind.kind==="entityState"?y.value.kind.entityId:void 0,en=pu(se,O,ke===void 0?void 0:e.hass.states[ke]?.state,ke?.split(".")[0]);f=p`
        ${oe(e,y.value,W=>k(Q=>{Q.value=W},"value"),{label:"States",key:`${r}-value`})}
        ${G?m:p`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        ${Ks(i,y.historyMinutes,Y,W=>k(Q=>{Q.historyMinutes=W}))}
        ${Qt?Ws(y.historyMinutes,W=>k(Q=>{Q.historyMinutes=W},"span")):m}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${dt} changes are drawn, and a
          busier span keeps its newest.</div>
        ${G&&D===void 0?p`<div class="hint">Reading the history…</div>`:m}
        ${G&&D===""?p`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:m}
        ${se.length>0?p`<div class="hint">Reads <span class="nums">${Bu(se,O)}</span></div>`:m}
        ${Vu(se)?p`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:m}`,g=p`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${hu(y,k,en,`wa-tl-states-${r.replace(/[^a-z0-9]/gi,"")}`)}
        ${en.length>2?p`<div class="hint">Seen in this span: <span class="nums">${en.filter(W=>W!=="unavailable"&&W!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:m}
        <div class="grid2">
          ${ee("Gap (pt)",y.gap,W=>k(Q=>{Q.gap=Math.min(jn,Math.max(0,W??0))},"tgap"),{step:.5,min:0,max:jn,def:c.gap})}
          ${ee("Corner radius (pt)",y.cornerRadius,W=>k(Q=>{Q.cornerRadius=Math.max(0,W??0)},"tradius"),{step:.5,min:0,def:c.cornerRadius})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
        ${Rn("Times",y.timeLabelCount,W=>k(Q=>{Q.timeLabelCount=Math.max(0,Math.min(vn,Math.round(W)))},"tlcount"),{min:0,max:vn,step:1,def:c.timeLabelCount,format:W=>W<=0?"None":String(Math.round(W))})}
        ${y.timeLabelCount<=0?m:p`
          <div class="grid2">
            ${ee("Time size (pt)",y.labelSize,W=>k(Q=>{Q.labelSize=Math.min(wn,Math.max(xn,W??yn))},"tlsize"),{step:.5,min:xn,max:wn,def:c.labelSize})}
            ${re("Time colour",y.labelColorHex,W=>k(Q=>{Q.labelColorHex=W??bn},"tlcolour"),!1,c.labelColorHex)}
          </div>
          ${te("Row",y.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],W=>k(Q=>{Q.labelsAbove=W==="above"}),{def:c.labelsAbove===!0?"above":"below"})}
          ${te("Clock",y.hourCycle,Qr,W=>k(Q=>{Q.hourCycle=W}),{titles:{auto:"Whatever clock the watch is set to"},def:c.hourCycle})}
          ${te("Minutes",y.minutes,eo,W=>k(Q=>{Q.minutes=W}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:c.minutes})}
          <div class="hint">Clock times from the start of the span to now, evenly spaced. Four is what
            the history page on the watch shows. Auto follows the watch's own clock and drops the
            minutes past a three hour span.</div>`}`;break}case"shape":f=p`<div class="grid2">
          ${te("Shape",t.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],y=>o(k=>{k.payload.kind=y}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:c.kind})}
          ${t.payload.kind==="roundedRectangle"?ee("Corner radius (pt)",t.payload.cornerRadius,y=>o(k=>{k.payload.cornerRadius=y??6},"radius"),{step:.5,min:0,def:c.cornerRadius}):m}
        </div>
        ${t.payload.kind==="line"?Du(n,l,d):m}`,g=t.payload.kind==="line"?ee("Thickness (pt)",t.payload.thickness,y=>o(k=>{k.payload.thickness=y??1},"thick"),{step:.5,min:.5,def:c.thickness}):p`
        ${re("Border colour",t.payload.borderColorHex,y=>o(k=>{y===void 0?delete k.payload.borderColorHex:k.payload.borderColorHex=y},"border"),!0,null)}
        ${t.payload.borderColorHex!==void 0?ee("Border width (pt)",t.payload.borderWidth,y=>o(k=>{k.payload.borderWidth=y??1},"bw"),{step:.5,min:0,def:c.borderWidth}):m}`;break;case"image":{let y=t.payload,k=(D,O)=>o(se=>D(se.payload),O),Y=y.entity.entityId?e.hass.states[y.entity.entityId]?.attributes?.entity_picture:void 0,G=typeof Y=="string"?Y:void 0,A=G!==void 0&&!G.startsWith("/");f=p`
        ${te("Source",y.source,[["camera","Camera"],["entityPicture","Entity picture"]],D=>k(O=>{O.source=D}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:c.source})}
        ${y.source==="camera"?p`
            ${y.entity.entityId&&!y.entity.entityId.startsWith("camera.")?p`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:m}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:p`
            ${y.entity.entityId&&G===void 0?p`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:m}
            ${A?p`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:m}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,g=p`
        ${te("Picture",y.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],D=>k(O=>{O.contentMode=D}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:c.contentMode})}
        ${Rn("Zoom",y.zoom,D=>k(O=>{O.zoom=D},"zoom"),{min:_a,max:4,step:.05,def:1,format:D=>`${D.toFixed(2)}x`})}
        ${Rn("Pan left/right",y.panX,D=>k(O=>{O.panX=D},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Rn("Pan up/down",y.panY,D=>k(O=>{O.panY=D},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${_u(y)}</div>
        ${ee("Corner radius (pt)",y.cornerRadius,D=>k(O=>{O.cornerRadius=Math.max(0,D??Bt)},"imgradius"),{step:1,min:0,def:Bt})}`;break}case"tap":{f=p`
        ${vl(e,t.payload,(y,k)=>o(Y=>y(Y.payload),k),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let x=t.kind==="image"||t.kind==="tap"||t.kind==="timeline"?void 0:re(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,y=>o(k=>{k.kind!=="image"&&k.kind!=="tap"&&k.kind!=="timeline"&&(k.payload.colorSlot.baseColorHex=y??"#FFFFFF")},"color"),!1,u),$=fa(e.config,t),S=$?{kind:{kind:"entityState",...$}}:void 0,E=he[t.kind],v=t.kind==="tap"?void 0:Re(e.config,i)[0],C=t.kind==="image"?t.payload.timestamp===!0:!1,N=Uu[t.kind],B=Ku[t.kind],q=Gs(t.payload,c,N),le=t.kind==="text"?"fontSize":t.kind==="icon"?"size":t.kind==="gauge"||t.kind==="chart"?"lineWidth":void 0,w=e.config.perFamily[n]?.placements[i]?.size!==void 0,T=Gs(t.payload,c,B)||le!==void 0&&s.size!==void 0&&s.size!==c[le],V=!ki(l,Ue)||s.isHidden,P=$t(e.config,i),de=(y,k)=>()=>o(Y=>Us(Y.payload,c,y),k);return p`
    ${Ce(e,"content","Content",p`${t.kind==="tap"?m:Iu(e,t,r)}${f}`,{color:E,icon:"content",summary:ir(e,t),...q?{reset:de(N,"reset-content")}:{}})}
    ${g===void 0&&x===void 0?m:Ce(e,"look",t.kind==="image"?"Picture":"Look",p`${g??m}${x??m}`,{color:E,icon:t.kind==="image"?"image":"look",...Ci(t)?{summary:Ci(t)}:{},...T?{reset:()=>e.update(y=>{Us(y.elements[a].payload,c,B),w&&Ee(y,n,i,{},!0)})}:{}})}
    ${t.kind==="chart"?Ce(e,"numbers","Numbers",Yu(e,t),{color:he.text,icon:"text",summary:qu(e,t),...P.length>0?{reset:()=>e.update(y=>{for(let k of $t(y,i))Ct(y,k.payload.id)})}:{}}):m}
    ${t.kind==="image"?Ce(e,"timestamp","Timestamp",zu(t.payload,(y,k)=>o(Y=>y(Y.payload),k)),{color:E,icon:"clock",summary:C?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden",...C?{reset:de(Gu,"reset-stamp")}:{}}):m}
    ${t.kind==="tap"?m:Ce(e,"tappable","Tap",Ju(e,t,r),{color:ne.tap,icon:"tap",summary:v?We(v.payload.action):"Not tappable",...v?{reset:()=>e.update(y=>Zn(y,i))}:{}})}
    ${Ce(e,"states","States",El(e,t.payload.rules,t.kind,y=>y.elements.find(k=>k.payload.id===i)?.payload.rules,`rules-${i}`,S),{color:ne.states,icon:"states",summary:Mn(t.payload.rules).replace(/\.$/,""),...t.payload.rules.length>0?{reset:()=>o(y=>{y.payload.rules=[]})}:{}})}
    ${Ce(e,"placement","Place",p`
      <div class="grid4">
        ${fi("Left",l.x,y=>d({x:y},"x"),Ue.x,-100,100)}
        ${fi("Top",l.y,y=>d({y},"y"),Ue.y,-100,100)}
        ${fi("Width",l.width,y=>d({width:y},"w"),Ue.width,4,200)}
        ${fi("Height",l.height,y=>d({height:y},"h"),Ue.height,4,200)}
      </div>
      ${Rn("Rotation",l.rotationDegrees,y=>d({rotationDegrees:y},"rot"),{min:-180,max:180,step:1,def:0,format:y=>`${Math.round(y)}\xB0`})}
      <div class="hint">Drag the layer on the ${J(n)} preview to move it, or pull a
        corner to resize it, and the four boxes above follow. Arrow keys nudge the selection 1 pt,
        shift-arrows 10 pt. The eye on the layer's row hides it.</div>
      <div class="hint">Everything about where this layer sits, how big it is drawn and whether it
        shows belongs to the ${J(n)} shape alone. Pick another shape above to place
        the same layer differently there.</div>`,{color:ne.place,icon:"place",summary:`${Math.round(l.width*100)}% wide \xB7 ${J(n)}${s.fromPlacement?"":" \xB7 shared frame"}`,...V?{resetTitle:`Put this layer back to the middle of the ${J(n)} face at half size, unrotated and shown`,reset:()=>e.update(y=>Ee(y,n,i,{frame:{...Ue},isHidden:!1}))}:{}})}`}var Gu=["timestamp","timestampCorner","timestampSize"],Uu={text:["value","countdown"],icon:["symbol"],gauge:["value","minValue","maxValue","total"],chart:["value","historyMinutes","historyPoints","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"]},Ku={text:["fontSize","fontWeight","colorSlot"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes"],shape:["colorSlot","borderColorHex","borderWidth","thickness"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[]};function vl(e,t,n,i){let a=t.action;return p`
    ${Fe("Tap action",a.type,Cu,r=>n(o=>{o.action=dl(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?Qe(e,"Target",a,r=>n(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):m}
    ${a.type==="callService"?cl(e,a,(r,o)=>n(s=>{s.action=r},o),`${i}-tap`):m}
    ${a.type==="openPage"?pl(e,t.openPageId,t.openPageName,(r,o)=>n(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):m}`}var Wu=24;function ju(e,t){let n=[],i=1/0;for(let r of ie){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=$o(e.config,t,r);o&&(n.push(`${J(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return m;let a=i<Wu;return p`<div class=${a?"hint warn":"hint"}>${n.join(" \xB7 ")}${a?p`<br />That is small for a wrist. Show the tap area and drag its corners out.`:m}</div>`}function qu(e,t){let n=$t(e.config,t.payload.id);return n.length===0?"None yet":n.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(Pt.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function Yu(e,t){let n=fe(e),i=$t(e.config,t.payload.id),a=o=>e.update(s=>{go(s,t.payload.id,o)}),r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return p`
    ${i.length===0?p`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:p`
        <div class="chart-numbers">
          ${i.map(o=>p`
            <div class="num-row">
              <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
                <b>${e.resolve(o.payload.value)??"--"}</b> · <span class="ent-tok">${Me(o,n)}</span>
              </button>
              <button class="icon danger" title="Delete this number" aria-label="Delete this number"
                @click=${()=>e.update(s=>Ct(s,o.payload.id))}>${z("close")}</button>
            </div>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it. The × deletes it, and Undo brings it back.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${Pt.map(([o,s])=>p`
        <button class="small" title=${r.has(o)?`Add another ${s.toLowerCase()}`:`Add the ${s.toLowerCase()}`}
          @click=${()=>a(o)}>${z("plus")}<span>${s}</span></button>`)}
    </div>
    <div class="hint">The newest reading starts with the entity's unit after it. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function Ju(e,t,n){if(t.kind==="tap")return m;let i=t.payload.id,a=Re(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);c&&s(c.payload)},l?`${n}-${l}`:void 0),o=ga(e.config,t);return p`
    ${Ae("Tappable",a!==void 0,s=>e.update(l=>{s?Xn(l,i):Zn(l,i)}))}
    ${a?p`<div class="value-editor">
          ${vl(e,a.payload,r,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${qn(a.payload.outset)?m:p`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(s=>{s.outset={...sa}})}>${z("reset")}</button>`}
          </div>
        </div>
        ${ju(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:p`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${We(o)}</b>.</div>`}`}function js(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Me(e,t){switch(e.kind){case"text":return js(me(e.payload.value,t));case"icon":return js(me(e.payload.symbol,t));case"gauge":return me(e.payload.value,t);case"chart":return me(e.payload.value,t);case"timeline":return me(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="callService"?[n.serviceDomain,n.serviceName].filter(a=>a!=="").join("."):n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function xl(e,t){let n=qe(e.config,t.id),i=fe(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===t.id);l&&r(l)},o?`group-${t.id}-${o}`:void 0);return Ce(e,"content","Group",p`
    ${pe("Name",t.name,r=>a(o=>{o.name=r},"name"))}
    ${Ae("Move as one on the watch",t.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(r=>Me(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>kn(r,t.id))}>Ungroup</button>
    </div>`,{color:ne.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function wl(e,t){if(t==="inline")return Xu(e);let n=e.config.perFamily[t];if(!n)return p`<div class="hint">No settings stored for ${J(t)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${J(t)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[t]),l?`fam-${t}-${l}`:void 0),a=Ei(e.config,t),r=n.backgroundColorHex?Se(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${Se(n.borderColorHex)} border`:"no border";return p`
    ${Ce(e,"look",`${J(t)} shape`,p`
      ${re("Background (blank = transparent)",n.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      ${re("Border colour",n.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${ee("Border width (pt)",n.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2})}`,{color:ne.place,icon:"shape",summary:`${r} \xB7 ${o}`,...n.backgroundColorHex!==void 0||n.borderColorHex!==void 0||n.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${t==="corner"?Ce(e,"corner","Corner content",Zu(e,n,i),{color:ne.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas",...n.curvedText!==void 0||n.bezelText!==void 0||n.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):m}
    ${Ce(e,"states","Shape states",El(e,n.rules,"layout",s=>s.perFamily[t]?.rules,`rules-${t}`),{color:ne.states,icon:"states",summary:Mn(n.rules).replace(/\.$/,""),...n.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${Ce(e,"placements","Placements",p`
      <div class="hint">${a===0?`Nothing is on the ${J(t)} shape. The Layers card offers to copy another shape's whole arrangement onto it.`:`${a} layer${a===1?" is":"s are"} on the ${J(t)} shape, each with its own frame and size here.`}</div>`,{color:ne.place,icon:"place",summary:a===0?"Nothing placed":`${a} layer${a===1?"":"s"} placed`})}`}function Xu(e){let t=e.config.inline;if(!t)return p`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=fe(e);return p`
    ${Ce(e,"content","Inline text",p`
      ${pe("Label (blank = value only)",t.label??"",a=>n(r=>{a?r.label=a:delete r.label},"label"))}
      ${oe(e,t.value,a=>n(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Ae("Live countdown",t.countdown===!0,a=>n(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${t.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,{color:he.text,icon:"text",summary:ht(`${t.label?`${t.label}: `:""}${me(t.value,i)}`,48)})}
    ${Ce(e,"symbol","Symbol",p`
      ${il(e,t.symbol??"",a=>n(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:he.icon,icon:"icon",summary:t.symbol||"None"})}`}function Zu(e,t,n){let i=t.curvedText?"curved":"canvas",a=t.bezelGauge?"gauge":t.bezelText?"text":"none";return p`
    ${te("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>n(o=>{r==="curved"?o.curvedText||(o.curvedText=R("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?p`
      ${oe(e,t.curvedText,r=>n(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${re("Curved text colour",t.curvedColorHex??"#FFFFFF",r=>n(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    ${te("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>n(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=R("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:R("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&t.bezelText?p`
      ${oe(e,t.bezelText,r=>n(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Ae("Live countdown",t.bezelCountdown===!0,r=>n(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&t.bezelGauge?Qu(e,t.bezelGauge,n):m}`}function Qu(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],a=r=>o=>n(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return p`
    ${oe(e,t.value,r=>n(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ee("Gauge min",t.minValue,r=>n(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ee("Gauge max",t.maxValue,r=>n(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${re("Arc colour (min end)",i[0],a(0))}
    ${re("Arc colour (middle)",i[1],a(1))}
    ${re("Arc colour (max end)",i[2],a(2))}
    ${Ae("End number labels",!!(t.minLabel||t.maxLabel),r=>n(o=>{let s=o.bezelGauge;r?(s.minLabel=R(String(s.minValue)),s.maxLabel=R(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${t.minLabel?oe(e,t.minLabel,r=>n(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${t.maxLabel?oe(e,t.maxLabel,r=>n(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var Gm=ie.map(e=>[e,J(e)]),ar={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},ep=Object.keys(ar);function tp(e){let t=ei[e];return ep.filter(n=>t.includes(Te[n]))}var np={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function bi(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function ht(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function ip(e){if(!e||Pe(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.duration&&t.push("as a duration"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function me(e,t){return`${kl(e,t)}${ip(e.format)}`}function kl(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${ht(n.value,40)}"`:"(empty)";case"entityState":return bi(n,t);case"entityAttribute":return n.attribute?`${bi(n,t)} \xB7 ${n.attribute}`:bi(n,t);case"entityAge":return`age of ${bi(n,t)}`;case"aggregate":return ap(n.aggregate);case"time":return np[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${ht(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(a=>a.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`;case"chartStat":{let i=(Pt.find(([o])=>o===n.stat)?.[1]??n.stat).toLowerCase();if(n.layer==="")return`${i} (no chart chosen)`;let a=t?.elements?.find(o=>o.kind==="chart"&&o.payload.id===n.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?kl(a.payload.value,t):"a missing chart";return`${i} of ${r}`}}}function ap(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function Si(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function rp(e,t,n,i,a){let r=(o,s)=>e.update(l=>{let d=i(l);d&&o(d)},s?`${a}-${s}`:void 0);return p`
    ${t.length===0?p`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:m}
    ${t.map((o,s)=>op(e,o,s,t.length,n,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Cn())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function op(e,t,n,i,a,r,o){let s=e.liveBranch(t),l=e.forced.get(t.id)??"live",d=u=>l==="live"?u==="live":l==="otherwise"?u==="otherwise":l.caseId===u,c=(u,h)=>r(f=>{let g=f.find(x=>x.id===t.id);g&&u(g)},h);return p`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(u=>Si(u,n,n-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>r(u=>Si(u,n,n+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(u=>{let h=u.findIndex(f=>f.id===t.id);h>=0&&u.splice(h,1)})}>${z("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((u,h)=>p`<button class="${d(u.id)?"active":""} ${s===u.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:u.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?p`<button class="${d("otherwise")?"active":""} ${s==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:m}
    </div>
    ${t.cases.map((u,h)=>sp(e,u,h,t,a,c,`${o}-${u.id}`))}
    <div class="adders"><button class="small" @click=${()=>c(u=>{u.cases.push(wa())})}>+ case</button></div>
    ${Ae("Otherwise (when no case matches)",t.otherwise!==void 0,u=>c(h=>{u?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?p`<div class="case-box otherwise">
          <div class="hint">${s==="otherwise"?p`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${$l(e,t.otherwise,a,u=>c(h=>{h.otherwise&&u(h.otherwise)}),`${o}-otherwise`)}
        </div>`:m}
  </div>`}function sp(e,t,n,i,a,r,o){let s=(d,c)=>r(u=>{let h=u.cases.find(f=>f.id===t.id);h&&d(h)},c),l=e.liveBranch(i)===t.id;return p`<div class="case-box ${l?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${l?p` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(d=>Si(d.cases,n,n-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>r(d=>Si(d.cases,n,n+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let c=d.cases.findIndex(u=>u.id===t.id);c>=0&&d.cases.splice(c,1)})}>${z("delete")}</button>
    </div>
    <div class="row-inline">
      ${te("When",t.when.join,[["all","All of these are true"],["any","Any of these is true"]],d=>s(c=>{c.when.join=d}))}
    </div>
    ${t.when.tests.length===0?p`<div class="hint">No tests: this case always matches.</div>`:m}
    ${t.when.tests.map((d,c)=>lp(e,d,c,u=>s(h=>{let f=h.when.tests.find(g=>g.id===d.id);f&&u(f)}),()=>s(u=>{u.when.tests=u.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>s(d=>{d.when.tests.push(xa())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${$l(e,t.then,a,d=>s(c=>d(c.then)),`${o}-then`)}
  </div>`}function lp(e,t,n,i,a,r){let o=(u,h)=>i(u,h?`${r}-${h}`:void 0),s=t.comparison,l=St(s.kind),d=e.evaluateTest(t),c=m;switch(l){case"value":c=oe(e,s.value??R(""),u=>o(h=>{h.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=p`${oe(e,s.value??R(""),u=>o(h=>{h.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${oe(e,s.upper??R(""),u=>o(h=>{h.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=p`${pe("Pattern",s.pattern??"",u=>o(h=>{h.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!dp(s.pattern)?p`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"options":c=pe("Options (comma separated)",(s.options??[]).join(", "),u=>o(h=>{h.comparison.options=u.split(",").map(f=>f.trim()).filter(Boolean)},"options"));break;case"none":break}return p`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${z("delete")}</button>
    </div>
    ${s.kind==="isStale"?p`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:oe(e,t.value,u=>o(h=>{h.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${Fe("Comparison",s.kind,Fo.map(u=>[u,Yt[u]]),u=>o(h=>{h.comparison=ka(h.comparison,u)}))}
    ${c}
  </div>`}function dp(e){try{return new RegExp(e),!0}catch{return!1}}function $l(e,t,n,i,a){let r=tp(n);return p`
    ${t.length===0?p`<div class="hint">No changes.</div>`:m}
    ${t.map((o,s)=>cp(e,o,s,n,(l,d)=>i(c=>{c[s]&&l(c[s])},d?`${a}-${s}-${d}`:void 0),()=>i(l=>{l.splice(s,1)}),`${a}-${s}`))}
    <select class="adder" @change=${o=>{let s=o.target,l=s.value;s.value="",l&&i(d=>{d.push(Et(l))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>p`<option value=${o}>${ar[o]}</option>`)}
    </select>`}var Cl=["setColor","setBorderColor","setBackgroundColor"];function cp(e,t,n,i,a,r,o){let s=!ei[i].includes(Te[t.kind]);return p`<div class="change-box">
    <div class="rule-head">
      <span>${ar[t.kind]}${s?p` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${z("delete")}</button>
    </div>
    ${Sl(e,t,a,o)}
  </div>`}function Sl(e,t,n,i){let a=ti(t.kind),r=m;if(a==="value"){let o=t.value??R("");if(Cl.includes(t.kind)){let s=o.kind.kind==="literal";r=p`${s?re("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>n(d=>{d.value=R(l??"#FFFFFF")},"color")):oe(e,o,l=>n(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:R("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?m:p`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=oe(e,o,s=>n(l=>{l.value=s},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};r=ee(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,s=>n(l=>{l.number=s??0},"number"),o)}else a==="weight"&&(r=te("Weight",t.weight??"regular",nr,o=>n(s=>{s.weight=o})));return r}var Qa=new Set,vi=new Map,xi=new Map,qs=new Map;function El(e,t,n,i,a,r){let o=Ga(t);return!o.ok||Qa.has(a)?p`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${l=>{Qa.delete(a),Ie(l.target)}}>Show as table</button>
        ${o.ok?m:p`<span class="hint">${o.reason}</span>`}
      </div>
      ${rp(e,t,n,i,a)}`:up(e,o.table,t[0],n,i,a,r)}function up(e,t,n,i,a,r,o){let s=(w,T)=>e.update(V=>{let P=a(V);P&&w(P)},T?`${r}-${T}`:void 0),l=t.value??qs.get(r)??o,d=t.rows.length===0,c=t.numberMode||d&&l!==void 0&&!ks(l)&&pp(e.resolve(l)),u=ei[i],h=vi.get(r)??new Set,f=t.columns.length===0&&h.size===0?[ws[i]]:[],g=ps(t.columns,[...h,...f.filter(w=>w!==void 0)],u),x=n?e.liveBranch(n):"none",$=n?e.forced.get(n.id)??"live":"live",S=w=>$!=="live"&&($==="otherwise"?w==="otherwise":$.caseId===w),E=w=>{n&&e.setForced(n.id,S(w)?"live":w==="otherwise"?"otherwise":{caseId:w})},v=w=>{qs.set(r,w),t.rows.length!==0&&s(T=>bs(T,w),"lhs")},C=()=>s(w=>gs(w,l??R(""),c)),N=t.rows.map((w,T)=>Js(e,{key:`${r}-${w.caseId}`,label:xs(w.comparison,V=>me(V,fe(e))),columns:g,changes:w.changes,live:x===w.caseId,forced:S(w.caseId),onForce:()=>E(w.caseId),when:yp(e,w.comparison,`${r}-${w.caseId}`,(V,P)=>s(de=>{let y=de[0]?.cases.find(k=>k.id===w.caseId)?.when.tests[0];y&&V(y.comparison)},P&&`${w.caseId}-${P}`)),updChanges:(V,P)=>s(de=>{let y=de[0]?.cases.find(k=>k.id===w.caseId);y&&V(y.then)},P&&`${w.caseId}-${P}`),acts:p`
      <button class="icon" title="Move up" ?disabled=${T===0} @click=${()=>s(V=>Ua(V,T,T-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${T===t.rows.length-1} @click=${()=>s(V=>Ua(V,T,T+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>s(V=>ys(V,w.caseId))}>${z("delete")}</button>`})),B=t.otherwise===void 0?m:Js(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:t.otherwise,live:x==="otherwise",forced:S("otherwise"),onForce:()=>E("otherwise"),when:p`<span class="when-otherwise">Otherwise</span>`,updChanges:(w,T)=>s(V=>{let P=V[0]?.otherwise;P&&w(P)},T),acts:p`<button class="icon" title="Remove the Otherwise row" @click=${()=>s(w=>Ka(w,!1))}>${z("close")}</button>`}),q=xi.get(r),le=hp.filter(w=>u.includes(w)&&!g.includes(w));return p`
    <div class="states">
      ${oe(e,l??R(""),v,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${l===void 0?p`<div class="hint">Choose what these states look at.</div>`:m}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(w=>p`<th>
              <span>${Ze[w]}</span>
              <button class="icon" title=${`Remove the ${Ze[w]} column`}
                @click=${T=>{xi.set(r,w),Ie(T.target)}}>${z("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${N}
          ${B}
          ${t.rows.length===0&&t.otherwise===void 0?p`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:m}
        </tbody>
      </table>
      ${q===void 0?m:p`<div class="hint warn confirm-row">
        Remove the ${Ze[q]} column? Its ${Ys(t,q)} value${Ys(t,q)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${w=>{xi.delete(r),vi.get(r)?.delete(q),Ie(w.target),s(T=>vs(T,q))}}>Remove</button>
        <button class="small" @click=${w=>{xi.delete(r),Ie(w.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${C}>+ state</button>
        ${t.otherwise===void 0?p`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>s(w=>Ka(w,!0))}>+ otherwise</button>`:m}
        <span class="spacer"></span>
        ${$==="live"?m:p`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${le.length===0?m:p`<select class="chip-add" title="Add a column" @change=${w=>{let T=w.target,V=T.value;if(T.value="",!V)return;let P=vi.get(r)??new Set;P.add(V),vi.set(r,P),Ie(T)}}>
          <option value="" selected>+ column…</option>
          ${le.map(w=>p`<option value=${w}>${Ze[w]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${c?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${w=>{Qa.add(r),Ie(w.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function pp(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var hp=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Ys(e,t){let n=0;for(let i of e.rows)pi(i.changes,t)&&(n+=1);return e.otherwise&&pi(e.otherwise,t)&&(n+=1),n}function mp(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Js(e,t){return p`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{mp(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>p`<td>${fp(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function fp(e,t,n,i,a){let r=pi(n,t),o=tr(a);if(!r)return p`<button type="button" class="cell empty" title=${`Set ${Ze[t]} for this state`}
      @click=${d=>{i(c=>{c.push(Et(us[t]))}),xu(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(u=>{let h=u.find(f=>Te[f.kind]===t);h&&d(h)},c&&`${t}-${c}`),l=Ze[t];return p`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${gp(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${ol}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${An.has(o)?p`${t==="visibility"?te("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):Sl(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let u=c.findIndex(h=>Te[h.kind]===t);u>=0&&c.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:m}
    </div>`}function gp(e,t){if(t.kind==="hide")return p`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return p`<span class="cell-word">Shown</span>`;let n=ti(t.kind);if(n==="number")return p`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return p`<span class="cell-word">${nr.find(([r])=>r===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??R(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Cl.includes(t.kind))return p`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Se(a):me(i,fe(e))}</span>`;if(t.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return p`${r??m}<span class="cell-word">${a}</span>`}return p`<span class="cell-word">${me(i,fe(e))}</span>`}function Se(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function yp(e,t,n,i){let a=St(t.kind),r=Ba(t.kind),o=(s,l,d,c)=>vp(e,s,l,`${n}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return p`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${xe(s=>i(l=>{let d=ka(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${Va.map(s=>p`<option value=${s} ?selected=${s===t.kind}>${bp(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(t.value??R(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?p`<span class="when-and">to</span>${o(t.upper??R(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:m}
  </span>`}function bp(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return Yt[e]}}function vp(e,t,n,i,a,r,o){let s=tr(i),l={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return p`<span class="rhs">
      ${oe(e,t,n,{...l,compact:!0})}
    </span>`;let d=t.kind.value;return p`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${xe(c=>n({...t,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${rl(e,s,o,t,n,l)}
  </span>`}var Hn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:ma,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function Rl(e){return Hn.find(t=>t.kind===e)??Hn[0]}var Tl="#FF9F0A",Ti="#8E8E93",xp=["#FF453A","#FFD60A","#34C759"],Il=["#0A84FF","#34C759","#FF9F0A"];function wp(e){return e?.attributes?.device_class==="battery"?xp:Il}var kp={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function $p(e){let t=e.iconName?.trim();return t?{off:t,on:t}:kp[rr(e)]??{off:"circle",on:"circle.fill"}}function Cp(e){switch(rr(e)){case"lock":return{kind:"equals",value:R("locked")};case"cover":case"valve":return{kind:"equals",value:R("open")};case"media_player":return{kind:"equals",value:R("playing")};default:return{kind:"isOn"}}}function rr(e){return e.domain||e.entityId.split(".")[0]||""}function gt(e){return{...e,domain:rr(e)}}function Sp(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let a=typeof t.device_class=="string"?t.device_class:"",r=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Zt(e){return Math.round(e*1e4)/1e4}function Ht(e,t,n){return Math.min(n,Math.max(t,e))}function or(e,t,n){let i=ve[e],a=Ht(Zt(t/i.width),0,1),r=Ht(Zt(n/i.height),0,1);return{x:Zt((1-a)/2),y:Zt((1-r)/2),width:a,height:r,rotationDegrees:0}}function Ep(e){let t=ve[e],n=Ht(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:or(e,n*1.3,n*1.3),size:n}}function Tp(e){let t=ve[e],n=Ht(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:or(e,t.width*.88,n*1.7),size:n}}function Fp(e){let t=ve[e],n=Math.min(t.width,t.height)*.9;return{frame:or(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function Al(e){let t=e==="rectangular";return{frame:{x:.05,y:t?.34:.3,width:.9,height:t?.42:.4,rotationDegrees:0},size:2}}function Mp(e){let t=ve[e],n=Ht(Math.round(t.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:Zt(n/t.height),rotationDegrees:0}}}function Rp(e){let t=ve[e],n=Ht(Math.round(Math.min(t.width,t.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:Zt(Ht(n*1.5/t.height,0,1)),rotationDegrees:0},size:n}}function Ip(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Ap(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=t))}function mt(e,t,n,i){let a=i(n);t.payload.frame=a.frame,Ap(t,a.size);for(let r of ie){if(r===n||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let s=i(r);JSON.stringify(s)!==JSON.stringify(a)&&(o.placements[t.payload.id]={frame:s.frame,isHidden:!1,...s.size!==void 0?{size:s.size}:{}})}}function ft(e){return ze(e)}function sr(e,t){let n={kind:{kind:"entityState",...gt(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function Fl(e){let t=Et("setIcon");return t.value=R(e),t}function At(e){let t=Et("setColor");return t.value=R(e),t}function Hp(e,t){let n=Cn(),i=n.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...gt(e)}},a.comparison=Cp(e);let r=t.on!==t.off;return i.then=r?[Fl(t.on),At(Tl)]:[At(Tl)],n.otherwise=r?[Fl(t.off),At(Ti)]:[At(Ti)],n}function Lp(e){let t=Cn(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...gt(e)}},i.comparison={kind:"isUnavailable"};let a=Et("setOpacity");return a.number=.35,n.then=[a],t}function Ml(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function _p(e,t,n=Il){let i=t.max-t.min,a=Ml(t.min+i/3),r=Ml(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:R(a)},changes:[At(n[0])]},{comparison:{kind:"between",value:R(a),upper:R(r)},changes:[At(n[1])]},{comparison:{kind:"greaterThan",value:R(r)},changes:[At(n[2])]}];return hs(sr(e),o)}function zp(e,t,n){let i=ft("icon"),a=$p(t);return i.payload.symbol=R(a.off),i.payload.colorSlot.baseColorHex=Ti,i.payload.rules=[Hp(t,a)],mt(e,i,n.family,Ep),e.elements.push(i),Xn(e,i.payload.id,{type:"toggleEntity",...gt(t)}),i.payload.id}function Np(e,t,n){let i=ft("text");return i.payload.value=sr(t,n.state),i.payload.rules=[Lp(t)],mt(e,i,n.family,Tp),e.elements.push(i),i.payload.id}function Pp(e,t,n){let i=ft("gauge");i.payload.value=sr(t);let a=Sp(n.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[_p(t,a,wp(n.state))],mt(e,i,n.family,Fp),e.elements.push(i),i.payload.id}function Op(e,t,n){let i=ft("chart");return i.payload.value={kind:{kind:"entityState",...gt(t)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",mt(e,i,n.family,Al),e.elements.push(i),i.payload.id}function Dp(e,t,n){let i=ft("chart");return i.payload.value={kind:{kind:"entityState",...gt(t)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",mt(e,i,n.family,Al),e.elements.push(i),i.payload.id}function Vp(e,t,n){let i=gt(t),a=ft("text");a.payload.value=R(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=Ti,mt(e,a,n.family,Rp),e.elements.push(a);let r=n.state?.attributes?.device_class,o=ft("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=ra(i.domain,typeof r=="string"?r:void 0),mt(e,o,n.family,Mp),e.elements.push(o),o.payload.id}function Bp(e,t,n){let i=ft("image");return i.payload.entity=gt(t),mt(e,i,n.family,Ip),e.elements.push(i),i.payload.id}function Hl(e,t,n,i){switch(t){case"toggle":return zp(e,n,i);case"status":return Np(e,n,i);case"gauge":return Pp(e,n,i);case"chart":return Op(e,n,i);case"history":return Dp(e,n,i);case"doorHistory":return Vp(e,n,i);case"camera":return Bp(e,n,i)}}var Up=3e4,Kp=500,Ll="preset-entity",Wp={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function lr(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function jp(e){return e.kind==="family"?"look":"content"}function qp(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var _l=300,zl=400,Nl=52,Pl=36,Yp=[1,1.7,2.6],Jp=["S","M","L"],Ol=["Small","Medium","Large"],Dl="wrist-assistant-panel.layers.v1",tt=34,Lt=200,Xp=720,Fi=320,Zp=80,Qp=56,Vl="wrist-assistant-panel.columns.v2",dr=e=>Math.max(Lt,Math.min(Xp,Math.round(e))),Bl=e=>e.metaKey||e.ctrlKey||e.shiftKey,eh=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,Ln=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",Ve=Ln==="Cmd"?"\u2318":"Ctrl+",cr=Ln==="Cmd"?"\u21E7":"Shift+";function Gl(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-Zp;if(i>=Lt*2+Fi){let r=i-Fi,o=t,s=n;if(o+s>r){let l=r/(o+s);o=Math.max(Lt,Math.floor(o*l)),s=Math.max(Lt,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(Lt,o-d):s=Math.max(Lt,s-d))}return{columns:3,left:o,right:s}}let a=e-Qp;return a>=Lt+Fi?{columns:2,left:Math.min(t,a-Fi),right:n}:{columns:1,left:t,right:n}}var I=class I extends it{constructor(){super(...arguments);this.narrow=!1;this.colLeft=_l;this.colRight=zl;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Fn.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=rs(()=>this.requestUpdate());this.imageSizes=os(()=>this.requestUpdate());this.symbols=new di(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||nl(Ll)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=Li`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Inter", Roboto, sans-serif);
      font-size: 14px;
      /* Colours the whole editor shares: one per layer kind, one per section
         that is not about a kind. Set once so a badge, a bar and a card agree. */
      --wa-text: ${ge(he.text)};
      --wa-icon: ${ge(he.icon)};
      --wa-gauge: ${ge(he.gauge)};
      --wa-shape: ${ge(he.shape)};
      --wa-image: ${ge(he.image)};
      --wa-tap: ${ge(he.tap)};
      --wa-states: ${ge(ne.states)};
      --wa-place: ${ge(ne.place)};
      /* The skin. Light follows the Home Assistant theme it sits in; the dark
         block below replaces these with the editor's own deep palette. The
         rest of the sheet only ever reads these names, so the two skins can
         never drift apart in anything but colour. */
      --wa-bg: var(--primary-background-color, #f3f4f8);
      --wa-card: var(--card-background-color, #fff);
      --wa-panel: var(--secondary-background-color, rgba(127,127,127,.12));
      --wa-raised: color-mix(in srgb, var(--wa-panel) 55%, var(--wa-card));
      --wa-input: var(--wa-card);
      --wa-line: var(--divider-color, rgba(127,127,127,.3));
      --wa-line-strong: color-mix(in srgb, var(--wa-line) 60%, var(--wa-ink));
      --wa-ink: var(--primary-text-color, #1c1c1e);
      --wa-muted: var(--secondary-text-color, rgba(127,127,127,.9));
      --wa-accent: var(--primary-color, #6d5dfc);
      --wa-accent-ink: var(--wa-accent-ink);
      /* Reset buttons, in one colour of their own. Pinned rather than taken
         from the theme's warning colour, which is orange or red in plenty of
         themes: these mark a setting someone changed, not a problem. Darker
         on a light card, where a bright yellow all but disappears. */
      --wa-reset: #B07D00;
      /* Two colours for the things that come out of Home Assistant rather
         than out of this editor: the entity a layer names, and the value it
         is reading right now. They are the same two colours in the search
         list, the inspector, the layer rows and the strip at the bottom, so
         "which words here are my house" is answered by hue alone and a dense
         card stops being a wall of grey. Nothing else in the sheet may use
         them. */
      --wa-ent: #0f766e;
      --wa-val: #9a5b00;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 12%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 14%, transparent);
      --wa-r-sm: 8px;
      --wa-r-md: 12px;
      --wa-r-lg: 16px;
      --wa-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.06);
      --wa-shadow-pop: 0 12px 36px rgba(0,0,0,.28);
      --wa-ring: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 28%, transparent);
      color: var(--wa-ink);
      background: var(--wa-bg);
    }
    /* The 2026 skin: near-black navy ground, cards a step up, hairlines made
       of light rather than grey, and a violet accent for the one thing on
       screen you are meant to press. Only colours change here. */
    :host([dark]) {
      --wa-bg: #0b0d14;
      --wa-card: #12141d;
      --wa-panel: #1a1d28;
      --wa-raised: #171a24;
      --wa-input: #0e1017;
      --wa-line: rgba(255,255,255,.08);
      --wa-line-strong: rgba(255,255,255,.16);
      --wa-ink: #eceef5;
      --wa-muted: #8d92a6;
      --wa-accent: #7b6cff;
      --wa-accent-ink: #fff;
      --wa-reset: #FFD60A;
      --wa-ent: #5fd4c4;
      --wa-val: #ffc45c;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 14%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 16%, transparent);
      --wa-shadow: 0 1px 2px rgba(0,0,0,.45), 0 10px 30px rgba(0,0,0,.35);
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--wa-line);
      background: var(--wa-card);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      z-index: 20;
    }
    header h1 { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; letter-spacing: -.01em; margin: 0 8px 0 0; white-space: nowrap; }
    header h1 .mark {
      width: 28px; height: 28px; border-radius: 9px; display: grid; place-items: center; flex: none;
      background: color-mix(in srgb, var(--wa-accent) 18%, transparent); color: var(--wa-accent);
      border: 1px solid color-mix(in srgb, var(--wa-accent) 35%, transparent);
    }
    header h1 .mark svg { width: 16px; height: 16px; }
    header .spacer { flex: 1; }
    header label { font-size: 13px; display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    header label select { max-width: 260px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Buttons: one quiet shape everywhere, the accent fill kept for the single
       action that matters, and a soft ring on focus instead of a hard outline. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; font-weight: 500; padding: 7px 13px; border-radius: 10px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled), button.small:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .toolbar button:focus-visible, button.primary:focus-visible, button.small:focus-visible, button.danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; font-weight: 600; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-accent) 88%, #fff); }
    /* Save is the header's one call to action. It is quiet while there is
       nothing to save and lit, with the unsaved halo, once there is, so the
       button, the dirty dot and the footer line all say "unsaved" the same
       way. */
    header button.save { min-height: 32px; padding: 7px 16px; }
    header button.save:not(.dirty) { background: var(--wa-raised); color: var(--wa-muted); border-color: var(--wa-line); }
    header button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #ffa600) 40%, transparent), 0 6px 18px color-mix(in srgb, var(--wa-accent) 35%, transparent); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 5px 11px; font-size: 12.5px; min-height: 28px; border-radius: 9px; }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: inherit;
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; border-radius: 8px; opacity: .75;
      transition: background-color .12s ease-out, opacity .12s ease-out;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    button.icon:focus-visible { opacity: 1; outline: none; box-shadow: var(--wa-ring); }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #e5484d); background: color-mix(in srgb, var(--error-color, #e5484d) 14%, transparent); }
    svg.ui-icon { width: 17px; height: 17px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warning-color, #ffa600); margin-left: 6px; vertical-align: middle; box-shadow: 0 0 8px var(--warning-color, #ffa600); }

    /* Native controls: the same dark well, hairline and focus ring as the
       buttons, so a select in the header and a number field in the inspector
       read as one family. */
    select {
      font: inherit; font-size: 13px; color: var(--wa-ink); cursor: pointer;
      padding: 6px 28px 6px 10px; border-radius: 9px; border: 1px solid var(--wa-line); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238d92a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; color: var(--wa-ink);
      padding: 6px 10px; border-radius: 9px; border: 1px solid var(--wa-line); background: var(--wa-input);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    input[type=text]:hover:not(:disabled), input[type=number]:hover:not(:disabled), textarea:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    input[type=text]:focus-visible, input[type=number]:focus-visible, input[type=search]:focus-visible, textarea:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input::placeholder, textarea::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
    /* Every checkbox is a switch: a pill that slides, tinted by the section
       it sits in, since a tick box is the one control that still looked like
       a form from 2009. */
    input[type=checkbox] {
      appearance: none; -webkit-appearance: none; margin: 0; cursor: pointer; flex: none;
      width: 34px; height: 20px; border-radius: 999px; position: relative;
      background: color-mix(in srgb, var(--wa-ink) 14%, transparent); border: 1px solid var(--wa-line);
      transition: background-color .15s ease-out, border-color .15s ease-out;
    }
    input[type=checkbox]::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.35); transition: transform .15s ease-out;
    }
    input[type=checkbox]:checked { background: var(--c, var(--wa-accent)); border-color: transparent; }
    input[type=checkbox]:checked::after { transform: translateX(14px); }
    input[type=checkbox]:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input[type=checkbox]:disabled { opacity: .45; cursor: default; }
    input[type=range] { accent-color: var(--c, var(--wa-accent)); }
    input[type=color] { border: 1px solid var(--wa-line); border-radius: 8px; background: var(--wa-input); padding: 2px; cursor: pointer; }

    /* The complication picker: one dropdown in the header instead of a list
       down the side, because the list was read once per session and the space
       it held is worth more to the layers. */
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 13.5px; font-weight: 500;
      padding: 7px 10px 7px 12px; border-radius: 10px; cursor: pointer; color: var(--wa-ink);
      border: 1px solid var(--wa-line); background: var(--wa-raised); min-width: 220px; max-width: 380px;
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { color: var(--wa-muted); font-weight: 400; font-size: 12px; white-space: nowrap; }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    .picker .menu {
      position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 360px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13px;
      background: transparent; border: 0; color: inherit; padding: 8px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: default; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
    .picker .menu .new { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 10px; color: var(--wa-accent); font-weight: 500; }
    .picker .menu .new-shape { padding: 4px 10px 8px; }
    .picker .menu .new-shape .hint { margin: 4px 0 8px; }
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    .shape-dot.on { opacity: 1; }

    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 280px) 8px minmax(0, 1fr) 8px var(--wa-right, 400px);
      column-gap: 8px;
      row-gap: 16px;
      padding: 16px;
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
    }
    .gutter {
      align-self: stretch; cursor: col-resize; border-radius: 4px;
      background: transparent; position: relative; touch-action: none;
    }
    .gutter::after {
      content: ""; position: absolute; inset: 0 3px; border-radius: 2px;
      background: var(--wa-line); opacity: 0; transition: opacity .12s ease-out;
    }
    .gutter:hover::after, .gutter.dragging::after { background: var(--wa-accent); opacity: 1; }
    .layout.cols-2 {
      grid-template-columns: var(--wa-left, 280px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { overflow: auto; min-height: 0; }
    .card {
      background: var(--wa-card);
      border: 1px solid var(--wa-line);
      border-radius: var(--wa-r-lg);
      box-shadow: var(--wa-shadow);
      padding: 16px 18px;
    }
    .column.left { display: flex; flex-direction: column; gap: 14px; }
    .column.left .card { flex: none; }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       colour. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 12px;
      font-size: 15px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 400; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 500; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-card); }
    details.foot > summary { display: flex; align-items: center; gap: 8px; padding: 9px 16px; font-size: 13px; cursor: pointer; list-style: none; color: var(--wa-muted); }
    details.foot > summary::-webkit-details-marker { display: none; }
    details.foot > summary:hover { background: var(--wa-panel); }
    details.foot .foot-dot { font-size: 10px; }
    details.foot .foot-dot.ok { color: var(--success-color, #3dd68c); text-shadow: 0 0 8px var(--success-color, #3dd68c); }
    details.foot .foot-dot.warn { color: var(--warning-color, #ffa600); }
    /* Same colour on the words as on the dot, so the footer agrees with the
       header's Save button about there being work to save. */
    details.foot .foot-dot.warn + .foot-text { color: var(--warning-color, #ffa600); }
    details.foot .foot-dot.err { color: var(--error-color, #db4437); }
    details.foot .foot-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    details.foot .foot-more { font-size: 12px; opacity: .6; }
    details.foot[open] .foot-more { opacity: .4; }
    details.foot .foot-body { padding: 0 16px 12px; max-height: 40vh; overflow: auto; }
    details.foot .foot-body .hint { margin: 8px 0; }

    /* Add a layer: one tinted card per kind, each carrying a sample of what
       that kind draws, then the presets. It sits above the list so adding a
       layer never moves the button just pressed.

       The sample sits on the same black well the Layers list uses for its
       thumbnails, so "what a gauge looks like" is answered by the same picture
       in both places and the button reads as a watch face rather than a
       swatch. */
    /* A card whose whole title bar is the fold handle. Shut, the title keeps
       its own margin off the body it no longer has, so the card is one line. */
    .card.fold .fold-h { cursor: pointer; border-radius: var(--wa-r-sm); margin: -4px -6px 8px; padding: 4px 6px; user-select: none; }
    .card.fold[data-open="false"] .fold-h { margin-bottom: -4px; }
    .card.fold .fold-h:hover { background: var(--wa-panel); }
    .card.fold .fold-h:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .card.fold .fold-h .chev { color: var(--wa-muted); flex: none; display: grid; place-items: center; transition: transform .15s ease-out; }
    .card.fold .fold-h .chev svg { width: 16px; height: 16px; }
    .card.fold[data-open="true"] .fold-h .chev { transform: rotate(180deg); }

    /* Two across, not three: the sample is the whole point of the expanded
       buttons, and at a third of the column it was too small to tell a gauge
       from a chart without reading the name under it. */
    .add-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    /* Compact: the samples go and the buttons shrink to tinted name chips, so
       seven kinds take two short rows instead of three tall ones. */
    .add-grid.lean { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
    .add-grid.lean button.add { padding: 7px 9px; border-radius: 10px; }
    .add-grid.lean button.add .add-name { justify-content: flex-start; }
    button.add {
      display: flex; flex-direction: column; align-items: stretch; gap: 7px; padding: 7px 7px 8px; border-radius: 12px;
      font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 12%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 34%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out, box-shadow .12s ease-out;
    }
    button.add:hover:not(:disabled) {
      background: color-mix(in srgb, var(--k) 22%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 62%, transparent);
      box-shadow: 0 4px 14px color-mix(in srgb, var(--k) 20%, transparent);
    }
    button.add:active:not(:disabled) { transform: translateY(1px); }
    button.add:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 30%, transparent); }
    button.add:disabled { opacity: .45; cursor: default; }
    /* The well is a fixed shape, not a fixed height: the column is whatever a
       third of the panel happens to be, and the samples are drawn to scale
       with it. */
    button.add .well {
      display: block; width: 100%; aspect-ratio: 120 / 46; border-radius: 7px; overflow: hidden;
      background: #000; border: 1px solid color-mix(in srgb, var(--k) 30%, var(--wa-line-strong));
      box-sizing: border-box;
    }
    button.add svg.shot { display: block; width: 100%; height: 100%; }
    button.add .add-name { display: flex; align-items: center; justify-content: center; gap: 6px; }
    button.add svg.ui-icon { color: var(--k); width: 14px; height: 14px; flex: none; }
    .presets-l { margin: 14px 0 8px; font-size: 12px; color: var(--wa-muted); }
    .presets { display: flex; flex-wrap: wrap; gap: 6px; }
    button.preset {
      font: inherit; font-size: 12px; padding: 5px 11px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: color .12s ease-out, border-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    .layers { display: flex; flex-direction: column; gap: 6px; --thumb-w: ${Nl}px; --thumb-h: ${Pl}px; }
    /* Every row is its own outlined container at rest. The border is what
       tells one row from the next, so nothing here may set it to transparent. */
    .layer {
      display: grid; grid-template-columns: 16px 4px var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 7px 8px 7px 5px; border-radius: var(--wa-r-md);
      border: 1px solid var(--wa-line); background: var(--wa-raised); background-clip: padding-box;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out,
        border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members keep their own outline, one shade deeper, so they read
       as nested and still separate from each other. */
    .layer.kid { background: var(--wa-panel); }
    .layer:hover { background: var(--wa-panel); border-color: color-mix(in srgb, var(--k) 45%, var(--wa-line)); }
    /* The selected row lights up in its kind's colour and casts a little of
       it, so the eye lands on it from across the panel. */
    .layer.hl {
      border-color: var(--k); background: color-mix(in srgb, var(--k) 12%, var(--wa-card));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 22%, transparent), 0 6px 18px color-mix(in srgb, var(--k) 18%, transparent);
    }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's colour, without
       the selected row's glow, so the group reads as one block. */
    .layer.held {
      border-color: color-mix(in srgb, ${ge(ne.group)} 70%, var(--wa-line));
      background: color-mix(in srgb, ${ge(ne.group)} 10%, var(--wa-panel));
    }
    .layer.held .thumb { border-color: color-mix(in srgb, ${ge(ne.group)} 60%, var(--wa-line)); }
    .layer .grip { color: var(--wa-muted); opacity: .5; display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { opacity: .9; }
    .layer .grip svg { width: 14px; height: 14px; }
    .layer .bar { width: 4px; height: 28px; border-radius: 2px; background: var(--k); box-shadow: 0 0 6px color-mix(in srgb, var(--k) 50%, transparent); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 8px; overflow: hidden; flex: none;
      background: #000; border: 1px solid var(--wa-line-strong); box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    .layer.hl .thumb { border-color: color-mix(in srgb, var(--k) 70%, var(--wa-line)); }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--k); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted); white-space: nowrap; }
    .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 16%, transparent); }
    .badge.states { color: color-mix(in srgb, var(--wa-states) 75%, var(--wa-ink)); background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    /* Reserved, not removed: taking the actions out of the layout made the
       name change width the moment the pointer arrived. The badges step aside
       for them instead, so the row keeps its width. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { display: inline-flex; }
    .layer:hover .badges, .layer.hl .badges, .layer:focus-within .badges { display: none; }
    .layer .acts button.icon { width: 24px; height: 24px; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    /* The row being dragged leaves the list. The slot opening under the
       pointer already says where the layer is going, so a ghost of it left
       behind in its old place is one thing too many to read.

       Collapsed, not removed: taking the drag source out of the document
       cancels the drag. The negative margin eats the second of the two 6px
       gaps a zero-height row would otherwise sit between. */
    .layer.dragging, .group-kids.dragging {
      height: 0; min-height: 0; margin-top: -3px; margin-bottom: -3px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    .layer.pinned { border-style: dashed; }
    .layer.pinned.hl { border-style: solid; }
    .layer.pinned .grip { cursor: default; opacity: .8; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--wa-accent) 30%, transparent);
      background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { border-color: var(--wa-accent); box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer.group .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 16px; height: 16px; display: grid; place-items: center;
    }
    .layer.group .chev svg { width: 14px; height: 14px; transition: transform .15s ease-out; }
    .layer.group .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${ge(ne.locked)}; filter: drop-shadow(0 0 4px ${ge(ne.locked)}); }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 14px; padding-left: 10px; display: flex; flex-direction: column; gap: 6px;
      border-left: 2px solid color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* Drop targets last, so the slot beats whatever the row already had on its
       own border.

       The row grows a tall transparent border on the side the dragged layer
       will land, so every row past it really does step out of the way, and a
       dashed slot is drawn in the space that opens. The gap belongs to the
       row's own box, so a pointer resting in it still counts as hovering that
       row; a gap made of margin would leave the row, close, and flap. */
    .layer.drop-before, .layer.drop-after { z-index: 1; }
    .layer.drop-before { border-top: ${tt}px solid transparent; }
    .layer.drop-after { border-bottom: ${tt}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${tt}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${tt}px; }
    .layer.drop-after::after { bottom: -${tt}px; }

    /* Expanded rows say more: a third line with where the layer sits on the
       face, its meta free to wrap, and the badges kept beside the buttons
       rather than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    .layer.rich .right { flex-wrap: wrap; justify-content: flex-end; gap: 4px; }
    .layer.rich:hover .badges, .layer.rich.hl .badges, .layer.rich:focus-within .badges { display: inline-flex; }

    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg { display: inline-flex; flex: none; border: 1px solid var(--wa-line); border-radius: 999px; overflow: hidden; background: var(--wa-raised); }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 4px 8px; min-width: 22px; border: 0; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out;
    }
    .seg button + button { border-left: 1px solid var(--wa-line); }
    .seg button:hover { color: var(--wa-ink); background: var(--wa-panel); }
    .seg button.on { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 22%, transparent); }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 14px; height: 14px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line, and the tint takes the section's colour where there is one. */
    .seg.wide { display: flex; width: 100%; min-width: 0; border-radius: 8px; background: var(--wa-raised); }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 5px 8px; min-height: 28px;
      font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 1.2;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
    }
    .seg.wide button.on { color: var(--wa-ink); background: color-mix(in srgb, var(--c, var(--wa-accent)) 24%, transparent); font-weight: 600; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 60%, transparent); }
    .field.seg-field { align-items: center; }
    /* Readings: which of two ways to count, then how many when it is a count. */
    .readings-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .readings-row .seg.wide { flex: 1 1 auto; width: auto; }
    /* Three digits is the most this box ever holds. The type selector is
       there to outrank the ".field input[type=number]" full-width rule. */
    .field .readings-row input.short[type=number] { width: 60px; flex: none; text-align: right; }
    .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 8px; }
    .grid3 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid3 .field > span { font-size: 12px; }
    /* The Layers title carries those controls, so it is allowed a second line
       in a narrow column instead of squeezing them. The auto margin keeps the
       pair on the right whichever line they land on. */
    .panel-title.tools { flex-wrap: wrap; row-gap: 8px; }
    .panel-title .tool-set { display: inline-flex; gap: 6px; margin-left: auto; }

    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    .column.canvas > .card.canvas-card { padding: 0; overflow: hidden; }
    .banner { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; background: var(--wa-panel); }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .canvas-bar { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-bottom: 1px solid var(--wa-line); flex-wrap: wrap; font-size: 13px; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    .canvas-bar .hint { margin: 0; }
    /* The three face toggles wrap as one block, so a narrow bar never leaves
       one of them stranded on the line above the other two. */
    .canvas-bar .face-tools { display: inline-flex; gap: 6px; flex: none; }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    .canvas-bar label select { color: var(--wa-ink); font-weight: 500; }
    button.pick {
      font: inherit; font-size: 12.5px; font-weight: 500; padding: 5px 12px; border-radius: 999px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out;
    }
    button.pick:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pick.on { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    /* The stage: a faint dot grid under a soft accent glow, so the watch face
       sits on a work surface rather than on the card. */
    .stage {
      display: grid; justify-items: center; padding: 30px 24px 20px;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .preview { text-align: center; position: relative; width: 100%; min-width: 0; }
    .preview svg {
      display: block; margin: 0 auto; background: #000; border-radius: 18px; touch-action: none;
      height: auto; max-width: 100%;
      box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 20px 50px rgba(0,0,0,.45);
    }
    .preview.rectangular svg { width: 100%; max-width: 900px; }
    .preview.circular svg { width: min(100%, 440px); border-radius: 50%; }
    .preview.corner svg { width: min(100%, 420px); background: #2c2c2e; }
    .preview.picking svg, .preview.picking svg * { cursor: crosshair; }
    .preview.inline .inline-line {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 220px;
      padding: 8px 18px; border-radius: 999px; background: #000; color: #fff; font-size: 15px;
    }
    .preview.inline .inline-line svg { display: inline-block; margin: 0; background: transparent; border-radius: 0; }
    .preview.inline .inline-line.missing { color: #999; font-style: italic; }
    .under { text-align: center; font-size: 13px; color: var(--wa-muted); margin-top: 12px; }
    .under b { color: var(--wa-ink); font-weight: 500; }
    .strip { padding: 0 22px 26px; }
    .strip-row { padding: 20px 0 22px; }
    .strip-row + .strip-row { border-top: 1px solid var(--wa-line); }
    .strip-row .help { font-size: 12px; color: var(--wa-muted); margin-top: 8px; }
    /* A card title opens with a tinted mark, the same one the inspector's
       cards wear, so every column speaks the same language. */
    .panel-title .swatch {
      width: 26px; height: 26px; border-radius: 8px; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 18%, transparent);
      border: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 35%, transparent);
      color: var(--c, var(--wa-accent));
    }
    .panel-title .swatch svg { width: 15px; height: 15px; }
    .settings { max-width: 1100px; }
    .settings .gen-row { display: grid; grid-template-columns: minmax(160px, 1.3fr) minmax(130px, .8fr) minmax(150px, 1fr) minmax(220px, 1.4fr); gap: 4px 18px; align-items: start; }
    .settings .gen-row .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; margin: 4px 0; min-width: 0; }
    .settings .gen-row .field > span { font-size: 12px; }
    .settings .flash-row { display: flex; align-items: center; gap: 10px; min-height: 32px; min-width: 0; }
    .settings .flash-row input.flash-color { width: 36px; height: 28px; padding: 2px; }
    .settings .flash-row .muted { color: var(--wa-muted); font-size: 13px; }
    .settings .entity-field, .settings .hint { max-width: 800px; }
    /* Shared values: a chip per named value, laid out as a titled sub-section
       of the settings rather than a loose row of boxes. The whole chip opens
       the editor, so it carries the hover and selected states a row would, and
       the delete button stays out of the way until the pointer is on it. */
    .values-list { margin-top: 14px; }
    .values-head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
    .values-head .sub { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .values-head .help { margin: 0; }
    .values-list .data { display: flex; flex-wrap: wrap; gap: 8px; }
    .values-list .empty { font-size: 12px; color: var(--wa-muted); margin: 0; }
    .values-list .datum {
      gap: 8px; max-width: 320px; padding: 5px 5px 5px 10px; border-radius: 10px;
      background: var(--wa-card); border: 1px solid var(--wa-line);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum + .datum { box-shadow: none; }
    .values-list .datum:hover { border-color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 7%, var(--wa-card)); }
    /* Selected: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { border-color: var(--c); background: color-mix(in srgb, var(--c) 12%, var(--wa-card)); }
    .values-list .datum .name { flex: none; min-width: 0; max-width: 160px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .values-list .datum .meta {
      flex: none; min-width: 0; max-width: 140px; opacity: 1; color: var(--wa-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px;
      background: var(--wa-panel); border-radius: 999px; padding: 1px 8px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; background: transparent; padding: 1px 0; }
    .values-list .datum button.icon { width: 24px; height: 24px; opacity: 0; pointer-events: none; }
    .values-list .datum button.icon svg.ui-icon { width: 15px; height: 15px; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .tiles { display: flex; gap: 10px; flex-wrap: wrap; }
    .tile-wrap { position: relative; display: flex; }
    .tile-wrap .tile-x { position: absolute; top: 4px; right: 4px; opacity: .45; }
    .tile-wrap:hover .tile-x, .tile-wrap .tile-x:focus-visible { opacity: 1; }
    .tile-wrap .tile-x:disabled { opacity: .2; cursor: not-allowed; }
    button.tile {
      width: 180px; height: 104px; border-radius: var(--wa-r-md); background: var(--wa-raised); border: 1px solid var(--wa-line);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      color: var(--wa-muted); font: inherit; font-size: 13px; padding: 8px; cursor: pointer; overflow: hidden;
      transition: border-color .12s ease-out, box-shadow .12s ease-out, color .12s ease-out;
    }
    button.tile:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    button.tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tile[aria-pressed="true"] { border-color: var(--wa-accent); color: var(--wa-ink); box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 22%, transparent), 0 8px 24px color-mix(in srgb, var(--wa-accent) 20%, transparent); }
    button.tile.off { border-style: dashed; background: transparent; }
    .tile .art { width: 160px; height: 62px; display: grid; place-items: center; pointer-events: none; }
    .tile .art svg { display: block; max-width: 100%; max-height: 62px; width: auto; height: auto; background: #000; border-radius: 6px; }
    .tile.circular .art svg { border-radius: 50%; }
    .tile.corner .art svg { background: #2c2c2e; }
    .tile .art .inline-line { font-size: 11px; padding: 3px 10px; min-width: 0; display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; background: #000; color: #fff; }
    .tile .art .inline-line svg { background: transparent; border-radius: 0; }
    .tile .ghost { border: 1.5px dashed var(--wa-line); }
    .tile .ghost.rectangular { width: 130px; height: 48px; border-radius: 8px; }
    .tile .ghost.circular { width: 52px; height: 52px; border-radius: 50%; }
    .tile .ghost.corner { width: 52px; height: 52px; border-radius: 50% 0 0 0; border-right: 0; border-bottom: 0; }
    .tile .ghost.inline { width: 120px; height: 20px; border-radius: 10px; }
    .tile .lbl { font-weight: 500; display: flex; gap: 6px; align-items: center; white-space: nowrap; }
    .tile .lbl small { font-weight: 400; opacity: .7; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chips.values { gap: 8px; }
    .vchip {
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 13px; color: inherit;
      background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 999px; padding: 5px 12px 5px 6px; cursor: pointer;
    }
    .vchip:hover { border-color: var(--wa-accent); }
    .vchip .dom { width: 22px; height: 22px; border-radius: 50%; background: color-mix(in srgb, var(--k) 20%, transparent); color: var(--k); display: grid; place-items: center; flex: none; }
    .vchip .dom svg { width: 13px; height: 13px; }
    .vchip b { font-weight: 600; color: var(--wa-ent); }
    .vchip .val {
      color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em;
      border-bottom: 1px dashed color-mix(in srgb, var(--wa-val) 50%, transparent);
    }
    .vchip.testing { border-color: var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); border-bottom-color: var(--wa-states); }
    .vchip input { width: 110px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    .testing-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; text-transform: none; letter-spacing: 0; color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .testing-pill button { font: inherit; font-size: 12px; font-weight: 500; background: var(--wa-states); color: #1a1600; border: 0; border-radius: 999px; padding: 2px 9px; cursor: pointer; }
    .empty { opacity: .6; padding: 24px; text-align: center; }
    /* A shape that draws nothing yet. Tinted in the placement colour rather
       than the accent: it is a statement about where you are, not a thing to
       press, and the buttons inside it carry the press. */
    .blank-shape {
      margin: 10px 0; padding: 10px 12px; border-radius: var(--wa-r-md);
      border: 1px solid color-mix(in srgb, var(--wa-place) 40%, var(--wa-line));
      background: color-mix(in srgb, var(--wa-place) 10%, transparent);
    }
    .blank-shape b { font-size: 13px; }
    .blank-shape .hint { margin: 5px 0 0; }
    .blank-shape .adders { margin-top: 9px; }

    /* The layers this complication has that this shape does not draw. Under
       the list and shut, so the list above stays a reading of the preview
       beside it, and quiet: these rows are a way back in, not the work. */
      list-style: none; cursor: pointer; font-size: 12px; color: var(--wa-muted);
      padding: 4px 6px; border-radius: var(--wa-r-sm); display: flex; align-items: center; gap: 6px;
    }
      display: grid; grid-template-columns: 4px minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 5px 8px; border-radius: var(--wa-r-sm); cursor: pointer; font-size: 13px;
      border: 1px dashed var(--wa-line); background: transparent; color: var(--wa-muted);
    }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 0; }
    .insp-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--wa-line); position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    .crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 13px; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500;
    }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand { flex: none; font: inherit; font-size: 12px; font-weight: 500; color: var(--wa-accent); background: transparent; border: 0; padding: 3px 4px; cursor: pointer; }
    .insp-body { padding: 14px 14px 30px; }
    .empty-insp { padding: 40px 20px; text-align: center; color: var(--wa-muted); display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 13px; }
    .empty-insp svg { width: 40px; height: 40px; opacity: .5; }
    .empty-insp b { color: var(--wa-ink); font-weight: 500; font-size: 14px; }
    .sec {
      --c: var(--wa-accent);
      border: 1px solid color-mix(in srgb, var(--c) 28%, var(--wa-line)); border-radius: var(--wa-r-md);
      background: var(--wa-card); margin-bottom: 10px; overflow: hidden;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .sec[data-open="true"] { border-color: color-mix(in srgb, var(--c) 55%, var(--wa-line)); box-shadow: 0 4px 16px color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h { display: flex; align-items: center; gap: 10px; padding: 11px 12px; background: color-mix(in srgb, var(--c) 12%, var(--wa-card)); cursor: pointer; transition: background-color .12s ease-out; }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 20%, var(--wa-card)); }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    .sec-h .swatch { width: 28px; height: 28px; border-radius: 8px; background: color-mix(in srgb, var(--c) 20%, transparent); border: 1px solid color-mix(in srgb, var(--c) 35%, transparent); color: var(--c); flex: none; display: grid; place-items: center; }
    .sec-h .swatch svg { width: 15px; height: 15px; }
    .sec-h .tt { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    /* A row, so a card's reset button sits against its title rather than out
       at the far edge beside the chevron, which reads as a header action for
       the card as a whole instead of a way back for what is in it. */
    .sec-h h4 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; display: flex; align-items: center; gap: 2px; }
    /* Reset buttons. One control, two places: beside a setting's title, and in
       a card's header for everything the card owns. It is drawn only while
       something is away from its default, so its presence is the "changed"
       mark, and a card with no buttons in it is a card nobody touched. */
    /* Yellow, and a heavier stroke than the other glyphs: at 13px the shared
       1.7 reads as a hairline, and this one has to be spotted rather than
       looked for. Same colour in a card header as beside a setting, so the
       two are obviously the same control at two scopes. */
    button.icon.reset { flex: none; color: var(--wa-reset); opacity: .9; }
    button.icon.reset svg.ui-icon { stroke-width: 2.6; }
    button.icon.reset:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-reset) 20%, transparent); }
    button.icon.reset:focus-visible { box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-reset) 40%, transparent); }
    /* Small enough to sit on a 13px label line without pushing it around. */
    button.icon.tiny { width: 20px; height: 20px; border-radius: 6px; margin: -4px 0; }
    button.icon.tiny svg.ui-icon { width: 13px; height: 13px; }
    /* The button sits snug after the title text rather than at the right end
       of the label column: half these fields put the label above the control
       and half beside it, and a right-aligned button lands next to the wrong
       label in the first kind. The title keeps its place either way. */
    .field > span.has-reset { display: flex; align-items: center; justify-content: flex-start; gap: 2px; }
    .sec-h .sum { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sec-h .chev { color: var(--wa-muted); opacity: .7; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 16px; height: 16px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 10px 12px 14px; }
    /* A section is a stack of blocks, not one run of prose. Every control
       block after the first draws a hairline above itself, and the hint that
       explains a block stays under it on the same side of the line, so the
       eye gets "control, then why" in pairs instead of a wall.

       Only direct children are ruled: the fields inside a .grid2 are one
       block and must not be cut apart from each other. */
    .sec-b > :is(.field, .grid2, .grid3, .grid4, .chart-numbers, .adders, .states-switch, .value-editor, details.sub) {
      margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--wa-line);
    }
    .sec-b > :is(.field, .grid2, .grid3, .grid4, .chart-numbers, .adders, .states-switch, .value-editor, details.sub):first-child {
      margin-top: 0; padding-top: 0; border-top: 0;
    }
    /* The custom span's day/hour/minute row belongs to the Span picker above
       it, so it tucks under without a rule of its own. */
    .sec-b > .grid3.span-parts { margin-top: 4px; padding-top: 0; border-top: 0; }
    /* A run of band rows is one block: the rule goes above the first of them,
       and the rest just stack. */
    .sec-b > .row-inline { margin-top: 6px; }
    .sec-b > :not(.row-inline) + .row-inline { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
    /* A hint belongs to the block above it, so it never carries a rule and it
       sits tight under what it explains. */
    .sec-b > .hint { margin: 5px 0 0; }
    /* The picked layers, read only: the Layers list's colour coding without
       its controls, so the eye can check the pick without leaving the form. */
    .picked { display: flex; flex-direction: column; gap: 5px; margin-bottom: 4px; }
    .picked .row { display: grid; grid-template-columns: 4px minmax(0, 1fr); align-items: center; gap: 8px; font-size: 13px; }
    .picked .row .bar { width: 4px; height: 22px; border-radius: 2px; background: var(--k); }
    .picked .row .name { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .picked .row .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .picked .row .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .picked .row .glyph svg { width: 16px; height: 16px; display: block; }
    .picked .row .kind { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k); flex: none; }
    .adders { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
    /* One row per number: the whole label opens that text layer, and the ×
       at the end deletes it. Two buttons, because one cannot sit inside the
       other. */
    .chart-numbers { display: flex; flex-direction: column; gap: 4px; }
    .chart-numbers .num-row { display: flex; align-items: center; gap: 4px; }
    .chart-numbers .num-row > button.small { flex: 1; min-width: 0; justify-content: flex-start; text-align: left; }
    .chart-numbers .num-row > button.icon { flex: none; }
    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
    /* The keys-and-mouse help: two tables side by side when there is room,
       one under the other when there is not. */
    button.help {
      font: inherit; font-size: 14px; font-weight: 600; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: background-color .12s ease-out, border-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    dialog.help-dialog {
      width: min(880px, calc(100vw - 32px)); max-height: calc(100vh - 32px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.help-dialog::backdrop { background: rgba(0,0,0,.45); }
    .help-head { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 1px solid var(--wa-line); }
    .help-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .help-head .spacer { flex: 1; }
    .help-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 8px 24px; padding: 14px 18px 18px; }
    .help-body h3 { margin: 0 0 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .help-body table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .help-body th { text-align: left; font-weight: 500; white-space: nowrap; padding: 5px 12px 5px 0; vertical-align: top; width: 1%; }
    .help-body td { padding: 5px 0; color: var(--wa-muted); vertical-align: top; border-top: 1px solid var(--wa-line); }
    .help-body th { border-top: 1px solid var(--wa-line); }
    .help-body tr:first-child th, .help-body tr:first-child td { border-top: 0; }
    .help-body kbd {
      font: inherit; font-size: 12px; padding: 2px 7px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
    }
    .help-body .hint { margin: 8px 0 0; }
    /* The zoomed preview: the whole window, the face as wide as it will go.
       The picture keeps its slot's aspect and never runs taller than the room
       under the bar, so a wide rectangular face on a short window still fits. */
    dialog.zoom-dialog {
      width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; margin: 0; padding: 0; border: 0;
      background: var(--wa-bg, #111); color: var(--wa-ink);
      display: flex; flex-direction: column; overflow: hidden;
    }
    dialog.zoom-dialog::backdrop { background: rgba(0,0,0,.6); }
    .zoom-bar {
      display: flex; align-items: center; gap: 8px; padding: 10px 16px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .zoom-bar .under { margin: 0; text-align: left; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .zoom-bar .spacer { flex: 1; min-width: 0; }
    .zoom-stage {
      flex: 1 1 auto; min-height: 0; display: grid; place-items: center; padding: 16px;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .zoom-stage .preview svg,
    .zoom-stage .preview.rectangular svg,
    .zoom-stage .preview.circular svg,
    .zoom-stage .preview.corner svg {
      width: min(100%, calc((100vh - 90px) * var(--wa-ratio, 1))); max-width: none;
    }
    dialog.preset-dialog h2 { margin: 0 0 4px; font-size: 15px; font-weight: 500; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .send { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .send.sent { color: var(--success-color, #43a047); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    header .send.sent { color: inherit; }
    ul { list-style: none; margin: 0; padding: 0; }
    .datum { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .datum + .datum { box-shadow: inset 0 1px 0 var(--wa-line); }
    .datum:hover, .datum.hl { box-shadow: none; }
    .datum:hover { background: var(--wa-panel); }
    .datum.hl { background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }
    .datum .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .datum .meta { font-size: 12px; opacity: .7; }
    .branches { display: flex; flex-wrap: wrap; gap: 4px; }
    .branches button {
      font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px;
      border: 1px solid var(--wa-line); background: transparent; color: inherit; cursor: pointer;
    }
    .branches button.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .branches button.live-match { border-color: var(--success-color, #43a047); }
    pre { font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; background: var(--wa-panel); padding: 8px; border-radius: 6px; }
    button.link { font: inherit; background: none; border: none; color: var(--wa-accent); cursor: pointer; padding: 0; }
    .rule-box { border: 1px solid var(--wa-line); border-radius: 8px; padding: 8px; margin: 8px 0; }
    .case-box { border-left: 3px solid var(--wa-line); padding: 4px 8px; margin: 8px 0; }
    .case-box.match { border-left-color: var(--success-color, #43a047); }
    .case-box.otherwise { border-left-style: dashed; }
    .test-box, .change-box { background: var(--wa-panel); border-radius: 6px; padding: 4px 8px; margin: 6px 0; }
    .rule-head { display: flex; align-items: center; gap: 4px; font-size: 13px; }
    .ok { color: var(--success-color, #43a047); font-size: 12px; }
    .no { color: var(--error-color, #db4437); font-size: 12px; }
    select.adder { font: inherit; font-size: 12px; padding: 3px 6px; margin-top: 4px; }

    /* Form controls: label on the left, control on the right, the way a
       settings page reads. Fields that carry their own machinery (the entity
       search, the value chip) keep the label above, so nothing inside them
       has to fit a half-width column. */
    .field {
      display: grid; grid-template-columns: minmax(84px, 32%) minmax(0, 1fr); align-items: center;
      gap: 4px 10px; margin: 6px 0; font-size: 13px;
    }
    .field > span { color: var(--wa-muted); font-size: 13px; line-height: 1.25; }
    .field input[type=text], .field input[type=number], .field select, .field textarea { width: 100%; min-width: 0; }
    /* Inside a tinted section the focus ring takes the section's colour. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 60px; }
    .field.slider .slider-value { min-width: 44px; text-align: right; opacity: .85; }
    .field.check { grid-template-columns: auto minmax(0, 1fr); gap: 10px; }
    .field.check > span { color: inherit; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    .field.entity-field, .field.value-chip-field { display: flex; flex-direction: column; gap: 4px; align-items: stretch; }
    .field.entity-field > span, .field.value-chip-field > span { font-size: 12px; }
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-row input[type=color] { width: 34px; height: 28px; }
    .color-row input[type=range] { flex: 1; min-width: 40px; }
    .color-row input.hex { width: 90px; flex: none; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 6px; }
    .grid2 .field, .grid4 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid2 .field > span, .grid4 .field > span { font-size: 12px; }
    .grid4 input[type=number] { text-align: right; padding-left: 4px; padding-right: 6px; }
    .row-inline { display: flex; align-items: flex-end; gap: 4px; }
    .row-inline .field { flex: 1; }
    .hint { font-size: 12px; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border: 1px solid var(--wa-line); border-radius: 999px; }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--wa-line); background: transparent; color: inherit; cursor: pointer; }
    .value-editor { border-left: 2px solid var(--wa-line); padding-left: 10px; margin: 4px 0 8px; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px; }
    button.value-chip {
      display: flex; align-items: center; gap: 8px; width: 100%;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 8px;
      border: 1px solid var(--wa-line); background: var(--wa-card);
      color: inherit; cursor: pointer;
    }
    button.value-chip:hover { border-color: var(--wa-accent); }
    button.value-chip:focus-visible { outline: 2px solid var(--wa-accent); outline-offset: 1px; }
    .value-chip .chip-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .value-chip .chip-now {
      max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: var(--wa-val); font-weight: 600;
      padding: 1px 6px; border-radius: 999px; background: var(--wa-val-bg);
    }
    .value-chip .chip-caret { opacity: .55; font-size: 11px; }
    .value-pop {
      position: fixed; inset: auto; margin: 0; width: min(430px, calc(100vw - 16px));
      max-height: 70vh; overflow: auto; padding: 10px 14px 14px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .value-pop::backdrop { background: transparent; }
    .pop-head { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 2px; position: sticky; top: -10px; background: inherit; padding: 4px 0; }
    .pop-head .spacer { flex: 1; }
    .value-pop .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    .states-table { width: 100%; border-collapse: collapse; margin: 8px 0 4px; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--wa-line); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; }
    .states-table th:hover button.icon, .states-table th button.icon:focus-visible { opacity: .7; }
    .states-table th.acts { width: 1%; }
    .states-table td { padding: 3px 6px; border-bottom: 1px solid var(--wa-line); vertical-align: middle; }
    .states-table td.empty-row { opacity: .6; padding: 12px 6px; border-bottom: none; }
    .states-table tr.state-row { cursor: pointer; }
    .states-table tr.state-row:hover td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    .states-table td.when { white-space: nowrap; }
    .states-table td.acts { width: 1%; white-space: nowrap; }
    .states-table td.acts button.icon { opacity: 0; }
    .states-table tr:hover td.acts button.icon, .states-table td.acts button.icon:focus-visible { opacity: .8; }
    .row-flag { display: inline-block; width: 12px; color: var(--success-color, #43a047); font-size: 11px; }
    tr.forced .row-flag { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .when-cell { display: inline-flex; align-items: center; gap: 4px; }
    .when-cell select.when-op { font: inherit; font-size: 12px; padding: 2px 4px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: inherit; }
    .when-cell select.when-op:hover { border-color: var(--wa-line); }
    .when-and { opacity: .6; font-size: 12px; }
    .when-otherwise { opacity: .75; font-style: italic; }
    .rhs { display: inline-flex; align-items: center; gap: 2px; }
    .rhs .value-chip-field { margin: 0; }
    input.cellin {
      font: inherit; font-size: 13px; width: 90px; padding: 3px 6px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: inherit;
    }
    input.cellin.num { width: 64px; }
    button.more { font-size: 12px; opacity: .5; }
    button.cell {
      display: inline-flex; align-items: center; gap: 6px; max-width: 190px;
      font: inherit; font-size: 13px; text-align: left; padding: 3px 6px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer;
    }
    button.cell:hover { border-color: var(--wa-line); background: var(--wa-card); }
    button.cell.empty { opacity: .45; font-style: italic; }
    .cell-word { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .swatch { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--wa-line); flex: none; }
    button.cell svg { display: block; }
    .states-foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .states-foot .spacer { flex: 1; }
    .states-switch { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .states-switch .hint { margin: 0; }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

    /* Entity search, laid out the way Home Assistant's own entity list is: a
       glyph for the domain, the friendly name in full, and the things that
       tell two similar names apart (the room and the id) on a quieter second
       line. The type and the live state sit right, where the eye can run down
       one column instead of hunting.

       The glyph is the panel's own drawing, not Home Assistant's icon set, so
       a row still has a picture whatever the frontend ships. It only takes the
       accent colour when the entity is doing something, which is what makes
       the one light that is on findable in a list of forty. */
    .entity-field { position: relative; }
    .ent-box { position: relative; display: flex; align-items: center; }
    .ent-box input { width: 100%; min-width: 0; padding-left: 32px; padding-right: 30px; color: var(--wa-ent); font-weight: 500; }
    .ent-box .ent-glass { position: absolute; left: 10px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .ent-box .ent-glass svg { width: 14px; height: 14px; display: block; }
    .ent-box.open .ent-glass { color: var(--wa-accent); }
    button.ent-clear {
      position: absolute; right: 5px; width: 22px; height: 22px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.ent-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.ent-clear svg { width: 13px; height: 13px; display: block; }

    .entity-results {
      border: 1px solid var(--wa-line); border-radius: 12px; margin-top: 6px; max-height: 340px; overflow: auto;
      background: var(--wa-raised); padding: 4px; box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    button.ent {
      display: flex; align-items: center; gap: 10px; width: 100%; border-radius: 9px;
      font: inherit; font-size: 13px; text-align: left; padding: 7px 8px;
      background: none; border: none; color: inherit; cursor: pointer;
      transition: background-color .1s ease-out;
    }
    button.ent:hover, button.ent.hl { background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card)); }
    button.ent.hl { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The glyph tile. A fixed square keeps every name on the list starting at
       the same x, which is most of why the list reads as a column. */
    .ent-ico {
      flex: none; width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
      background: color-mix(in srgb, var(--wa-ink) 7%, transparent); color: var(--wa-muted);
    }
    .ent-ico.on { background: color-mix(in srgb, var(--wa-accent) 20%, transparent); color: var(--wa-accent); }
    .ent-ico svg { width: 17px; height: 17px; display: block; }
    .ent .ent-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: var(--wa-ent); }
    .ent .ent-sub { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; }
    .ent .ent-area { flex: none; color: var(--wa-muted); }
    /* The room and the id are one line, and the id is the half that may be
       cut: the room is short and the id's tail is the least useful part. */
    .ent .ent-area + .ent-id::before { content: "·"; margin-right: 6px; opacity: .5; }
    .ent .ent-id { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); opacity: .8; }
    .ent .ent-right { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 1px; max-width: 40%; }
    .ent .ent-type { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .ent .ent-state {
      font-size: 11px; font-weight: 600; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: var(--wa-val);
    }
    /* The line under the search box: which entity this layer holds, and what
       it says right now. It is the one place both tokens sit side by side, so
       it is also the key to reading them everywhere else. */
    .entity-current {
      display: flex; gap: 8px; align-items: center; font-size: 12px; margin-top: 6px;
      padding: 6px 8px; border-radius: var(--wa-r-sm);
      border: 1px solid color-mix(in srgb, var(--wa-ent) 28%, var(--wa-line)); background: var(--wa-ent-bg);
    }
    .entity-current .ent-ico { width: 24px; height: 24px; border-radius: 7px; background: color-mix(in srgb, var(--wa-ent) 18%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 28%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico svg { width: 14px; height: 14px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); font-weight: 600; }
    .entity-current .ent-area { flex: none; color: var(--wa-muted); }
    .entity-current .ent-state { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* The two tokens, wherever a run of ordinary prose has to name an entity
       or print what it reads. Everything that shows a live value ends up
       here, so the colour never has to be repeated by hand. */
    .ent-tok { color: var(--wa-ent); font-weight: 600; }
    .val-tok, .entity-current .ent-state, .vchip .val, .chart-numbers b, .hint .nums {
      color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em;
    }

    /* Symbol picker */
    .sym-browse { margin: 6px 0; }
    .sym-controls { display: flex; gap: 6px; margin-bottom: 6px; }
    .sym-controls input[type=search] { flex: 1; min-width: 0; }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 4px; max-height: 240px; overflow-y: auto; padding: 2px; }
    .sym-grid.one-row { display: flex; flex-wrap: nowrap; max-height: none; overflow-x: auto; overflow-y: hidden; }
    .sym-grid.one-row button.sym { flex: 0 0 64px; }
    button.sym { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px 2px; background: none; cursor: pointer; color: var(--wa-ink); border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
    button.sym:hover { border-color: var(--wa-line); background: var(--wa-panel); }
    button.sym.on { border-color: var(--wa-accent); }
    .sym-glyph { display: flex; align-items: center; justify-content: center; height: 24px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-none { font-size: 14px; opacity: .4; }
    .sym-name { font-size: 9px; line-height: 1.1; text-align: center; opacity: .8; overflow-wrap: anywhere; max-height: 22px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(Vl);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=dr(i.left)),typeof i.right=="number"&&(this.colRight=dr(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(Vl,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let n=window.localStorage.getItem(Dl);if(!n)return;let i=JSON.parse(n);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(Dl,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(n){return p`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=_l:this.colRight=zl,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Gl(this.panelWidth,this.colLeft,this.colRight),s=n==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let h=u.clientX-r,f=dr(n==="left"?s+h:s-h);n==="left"?this.colLeft=f:this.colRight=f},d=u=>{u.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(r=>r!==void 0),a=n.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(n.has("inspect")){let i=n.get("inspect");(i===void 0||lr(i)!==lr(this.inspect))&&(this.openSections=new Set(er))}}updated(n){let i=lr(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(n.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(n.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!eh.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(n.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((n.key==="Delete"||n.key==="Backspace")&&!a&&!o){this.deleteSelection()&&n.preventDefault();return}let s=Wp[n.key];if(s&&!a&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(s.dx,s.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}if(!(n.metaKey||n.ctrlKey)||(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!r?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!r&&(n.preventDefault(),this.redo()),r||o))return;let d=n.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?n.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&n.shiftKey?this.toggleHiddenSelection():n.key==="]"||n.key==="["?this.moveSelection(n.key==="]"?1:-1):c=!1,c&&n.preventDefault()}selectedIds(){let n=this.draft?.config;if(!n)return[];if(this.multi.size>0)return[...this.multi].filter(a=>n.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?n.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?qe(n,i.id).map(a=>a.payload.id):[]}selectRows(n){n.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:n[0]}):n.length>1&&(this.multi=new Set(n))}deleteSelection(){let n=this.selectedIds();return!this.canEdit||n.length===0?!1:(this.mutate(i=>{for(let a of n)Ct(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let n=this.draft?.config,i=this.selectedIds();return!n||i.length===0?!1:(this.clipboard=ba(n,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let n=this.draft?.config,i=this.clipboard,a=this.canvasFamily,r=new Set(n?.elements.map(l=>l.payload.id)??[]),o=n!==void 0&&i.family!==void 0&&i.family!==a&&i.elements.length>0&&i.elements.every(l=>r.has(l.payload.id)),s=[];this.mutate(l=>{s=o?Eo(l,i,a):va(l,i)}),this.selectRows(s)}duplicateSelection(){let n=this.draft?.config,i=this.selectedIds();if(!n||!this.canEdit||i.length===0)return;let a=ba(n,i),r=[];this.mutate(o=>{r=va(o,a)}),this.selectRows(r)}selectAll(){let n=this.draft?.config;if(!n)return;let i=n.elements.filter(a=>!be(n,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let n=this.draft?.config;if(!n||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?je(n,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>kn(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let n=this.draft?.config,i=this.selectedIds();if(!n||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>n.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!we(n,a,s).isHidden);this.mutate(s=>{for(let l of i)Ee(s,a,l,{isHidden:o})})}moveSelection(n){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,n)}moveLayer(n,i){this.mutate(a=>{let r=a.elements.filter(u=>!be(a,u)),o=a.elements.filter(u=>be(a,u)),s=r.findIndex(u=>u.payload.id===n),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],Ye(a),Ut(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await Mr(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${yt(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=Ko(this.owners.find(a=>a.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await _r(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await Rr(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${yt(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Mt.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),a=bo(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=yt(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Mt(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return jr(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await Ir(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=yt(n)}}renderSendButton(){let n=Mo({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return m;let i=Ro(n),a=i.resend&&this.hass.user?.is_admin?p`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m;return p`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<qi}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Sa(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let n=Zr(this.draft.config);(this.compiled?.document!==this.compiledDocument||n!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=n,this.scheduleTemplates(Kp))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new Xe(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||ns(n.app_version):!0}get canvasFamily(){if(Ft(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&Xo(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Jo(n)[0]??"rectangular")}addHere(n){let i=new Set(this.draft?.config.elements.map(r=>r.payload.id)??[]),a=this.canvasFamily;this.mutate(r=>{if(n(r),!(r.supportedFamilies.filter(o=>Ft(o)).length<2))for(let o of r.elements)i.has(o.payload.id)||fl(r,o.payload.id,a)})}static sizeWords(n){let i=ue[n];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(n,i,a){if(n.elements.length===0||!Ft(this.activeFamily))return m;if(Ei(n,i)>0)return m;let r=ie.filter(o=>o!==i&&n.supportedFamilies.includes(o)).filter(o=>Ei(n,o)>0);return p`<div class="blank-shape">
      <b>Nothing is on the ${J(i)} shape yet.</b>
      <div class="hint">Layers belong to the whole complication, so the ones on the other shapes
        are still listed here, dimmed. The eye on one of those rows puts it on this shape. Or copy
        rows on another shape with ${Ve}C, come
        back here and paste them with ${Ve}V: they land where they sit there, and no second
        copy of the layer is made.</div>
      ${a&&r.length>0?p`<div class="adders">
            ${r.map(o=>p`<button class="small primary"
              title=${`Put every layer on the ${J(i)} shape where it sits on the ${J(o)} one, scaled to this canvas`}
              @click=${()=>this.mutate(s=>gl(s,o,i))}>Copy the ${J(o)} layout</button>`)}
          </div>
          <div class="hint">Either way the layers are scaled on the way in: a point is a point, and
            this canvas is ${I.sizeWords(i)} against ${I.sizeWords(r[0])}, so
            sizes come down to match and a round shape pulls the layout in off its rim. Expect to
            nudge it by hand afterwards.</div>`:m}
    </div>`}addShape(n){this.mutate(i=>Zo(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!si(i,n))return;let a=es(i,n);a.length>0&&!window.confirm(`Remove the ${J(n)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>Qo(r,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(vo("New complication",this.freeSlot(),[n]))}setForced(n,i){let a=new Map(this.forced);i==="live"?a.delete(n):a.set(n,i),this.forced=a}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let s=structuredClone(i.config);s.id=Z(),s.slotIndex=o,i=new Mt(s,null)}let a=i.encoded(),r=await Ar(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=Mt.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=yt(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await Hr(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=yt(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=Z(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await Lr(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=yt(a)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},Up)}async refreshHistorySeries(){let n=this.draft?.config,i=n?ea(n):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points,...r.mode==="states"?{mode:"states"}:{}};try{let r=await Nr(this.hass,a),o=new Map;for(let[s,l]of Object.entries(r))l.ok&&o.set(s,l.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await zr(this.hass,{doc:n})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Lo(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=yt(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",s={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){s.timerState=a.state,typeof r.finishes_at=="string"&&(s.finishesAt=r.finishes_at);let l=th(r.remaining);l!==void 0&&(s.remaining=l)}typeof r.entity_picture=="string"&&(s.entityPicture=r.entity_picture),n.set(i,s)}return{entityStates:n,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return p`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return p`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let n=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return p`<button class="pick" ?disabled=${n}
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}><span class="glyph">⤢</span>Expand</button>`}renderZoomDialog(n,i,a){let r=this.draft?.config;if(!r)return m;let o=a.slots[n],s=n==="corner"?104/124:o.width/o.height;return p`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,n)}
        <span class="spacer"></span>
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${s}`}>
        ${this.renderBigPreview(n,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let n=Ve,i=cr,a=[[`${n}S`,"Save"],[`${n}Z \xB7 ${i}${n}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${n}C \xB7 ${n}X \xB7 ${n}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${n}D`,"Duplicate the selection in place"],[`${n}A`,"Pick every layer"],[`${n}G \xB7 ${i}${n}G`,"Group the pick \xB7 Ungroup"],[`${n}] \xB7 ${n}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${n}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Ln}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=s=>s.map(([l,d])=>p`<tr><th scope="row"><kbd>${l}</kbd></th><td>${d}</td></tr>`);return p`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
      <div class="help-head">
        <h2>Keys and mouse</h2>
        <span class="spacer"></span>
        <button class="pick" title="Close (Escape)" @click=${()=>{this.helpOpen=!1}}>Close</button>
      </div>
      <div class="help-body">
        <section>
          <h3>Keys</h3>
          <table><tbody>${o(a)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${o(r)}</tbody></table>
        </section>
      </div>
    </dialog>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let r=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?ya(i,r):void 0}leaveRow(n){this.listHoverIds.length===n.length&&this.listHoverIds.every((a,r)=>n[r]===a)&&(this.listHoverIds=[])}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,s=a.closest("svg"),l=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=l!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let S=this.focusTapId();if(S!==void 0&&o===S&&s&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,s,S,r??void 0);return}let E=this.hitLayerId(i);E?this.inspect={kind:"layer",id:E}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let c=Bl(i);if(!c&&this.multi.size>0&&(this.multi=new Set),!o||!s)return;let u=ya(this.draft.config,o),h=this.draft.config.elements.find(S=>S.payload.id===u);if(!u||!h)return;if(c){i.preventDefault(),this.togglePick(u);return}let f=je(this.draft.config,u),g=f!==void 0&&this.inspect.kind==="group"&&this.inspect.id===f.id;if(f&&(f.locked||g)&&!r&&!d){this.beginGroupGesture(n,i,s,f);return}if((this.inspect.kind!=="layer"||this.inspect.id!==u)&&(this.inspect={kind:"layer",id:u},r))return;i.preventDefault();let x=we(this.draft.config,n,h).frame,$=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=u;let S=h.payload,E=ue[n],v=x.width*E.width,C=x.height*E.height,N={x:0,y:0,w:v,h:C,cx:v/2,cy:C/2},B=ri(S,N,ai(new Date));if(this.cancelGesture?.(),l){let T=$.width/E.width,V=S.timestampSize;this.cancelGesture=Ms(s,i,l,{w:B.w*T,h:B.h*T},(P,de)=>{let y=Math.min(40,Math.max(4,Math.round(V*P)));this.mutate(k=>{let Y=k.elements.find(G=>G.payload.id===u);Y?.kind==="image"&&(Y.payload.timestampSize=y)},`ts-size-${u}`),de&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let q={x:0,y:0,w:x.width*$.width,h:x.height*$.height},le=Ke(S)?{x:S.timestampX,y:S.timestampY}:{x:(B.x+B.w/2)/N.w,y:(B.y+B.h/2)/N.h},w=!1;this.cancelGesture=Fs(s,q,i,le,(T,V,P)=>{P||(w=!0),w&&this.mutate(de=>{let y=de.elements.find(k=>k.payload.id===u);y?.kind==="image"&&(y.payload.timestampX=T,y.payload.timestampY=V)},`ts-${u}`),P&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=mi(s,$,i,{elementId:u,frame:x,handle:r??void 0},{onFrame:(S,E,v)=>{this.mutate(C=>Ee(C,n,S,{frame:E}),`drag-${S}-${n}`),v&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,a,r){let o=this.draft?.config;if(!o)return;let s=qe(o,r.id);if(s.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let l=new Map(s.map($=>[$.payload.id,we(o,n,$).frame])),d=[...l.values()],c=Math.min(...d.map($=>$.x)),u=Math.min(...d.map($=>$.y)),h=Math.max(...d.map($=>$.x+$.width)),f=Math.max(...d.map($=>$.y+$.height)),g={x:c,y:u,width:h-c,height:f-u,rotationDegrees:0},x=$=>Math.round($*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=mi(a,this.gestureCanvas(n),i,{elementId:r.id,frame:g},{onFrame:($,S,E)=>{let v=S.x-g.x,C=S.y-g.y;this.mutate(N=>{for(let[B,q]of l)Ee(N,n,B,{frame:{...q,x:x(q.x+v),y:x(q.y+C)}})},`drag-group-${r.id}-${n}`),E&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Es:1,s=n*o,l=i*o,d=this.canvasFamily,c=ue[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,s,l))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let $=this.inspect.id;return this.nudgeMany(qe(r,$).map(S=>S.payload.id),d,c,`nudge-group-${$}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,h=r.elements.find($=>$.payload.id===u);if(!h)return!1;let f=je(r,u);if(f?.locked)return this.nudgeMany(qe(r,f.id).map($=>$.payload.id),d,c,`nudge-group-${f.id}-${d}`,s,l);let g=we(r,d,h).frame,x=qa(g,s,l,c);return(x.x!==g.x||x.y!==g.y)&&this.mutate($=>Ee($,d,u,{frame:x}),`nudge-${u}-${d}`),!0}nudgeMany(n,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,c=new Map;for(let C of n){let N=l.elements.find(B=>B.payload.id===C);N&&c.set(C,we(l,i,N).frame)}if(c.size===0)return!1;let u=[...c.values()],h=Math.min(...u.map(C=>C.x)),f=Math.min(...u.map(C=>C.y)),g=Math.max(...u.map(C=>C.x+C.width)),x=Math.max(...u.map(C=>C.y+C.height)),$={x:h,y:f,width:g-h,height:x-f,rotationDegrees:0},S=qa($,o,s,a),E=S.x-$.x,v=S.y-$.y;return(E!==0||v!==0)&&this.mutate(C=>{for(let[N,B]of c)Ee(C,i,N,{frame:{...B,x:d(B.x+E),y:d(B.y+v)}})},r),!0}nudgeTimestamp(n,i,a,r){let o=this.draft?.config,s=o?.elements.find($=>$.payload.id===n);if(!o||s?.kind!=="image"||s.payload.timestamp!==!0)return!1;let l=s.payload,d=ue[i],c=we(o,i,s).frame,u=c.width*d.width,h=c.height*d.height,f=ri(l,{x:0,y:0,w:u,h,cx:u/2,cy:h/2},ai(new Date)),g=Ke(l)?{x:l.timestampX,y:l.timestampY}:{x:u>0?(f.x+f.w/2)/u:.5,y:h>0?(f.y+f.h/2)/h:.5},x=Ts(g,a,r,{w:u,h});return(x.x!==g.x||x.y!==g.y)&&this.mutate($=>{let S=$.elements.find(E=>E.payload.id===n);S?.kind==="image"&&(S.payload.timestampX=x.x,S.payload.timestampY=x.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=ii(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=za(i.scale,r);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=n.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:Re(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let d=be(s,l),c=we(s,n,l).frame;this.cancelGesture?.(),this.cancelGesture=mi(a,this.gestureCanvas(n),i,{elementId:r,frame:c,handle:o},{onFrame:(u,h,f)=>{this.mutate(g=>{d?ko(g,u,n,h):Ee(g,n,u,{frame:h})},`tap-box-${u}-${n}`),f&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Gl(this.panelWidth,this.colLeft,this.colRight);return p`
      <header>
        <h1><span class="mark">${z("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?p`<span class="dirty-dot" title="Unsaved changes"></span>`:m}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!n?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!n?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>p`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${ur(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":n?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?p`<div class="card error">${this.loadError}</div>`:m}
      ${this.helpOpen?this.renderHelpDialog():m}
      ${this.watchSupported?p`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:p`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${is(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(J).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(n){return p`<span class="shape-dots">${jt.map(i=>p`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${J(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(l=>l.id===this.selectedId),a=n?n.config.name.trim()||"Untitled":"No complication",r=n?n.config.supportedFamilies:[],o=this.pickerRows(),s=this.freeSlot();return p`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?p`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?p`<span class="pk-rev">unsaved</span>`:m}
        ${z("chevron")}
      </button>
      ${this.pickerOpen?p`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?p`<div class="empty">No complications for this watch yet.</div>`:m}
        ${o.map(l=>l.kind==="record"?p`<button class="row" role="option" aria-current=${l.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(l.record)}}>
              ${this.shapeDots(qp(l.record))}
              <span class="pk-name">${String(l.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${l.record.revision}</span>
            </button>`:p`<div class="row locked" title=${l.title}>
              ${this.shapeDots(l.families)}
              <span class="pk-name">${l.name}</span>
              <span class="pk-badge">${l.badge}</span>
            </div>`)}
        ${n&&n.baseRevision===null?p`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:m}
        ${this.hass.user?.is_admin?p`
          <button class="row new" ?disabled=${s<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${z("plus")}<span class="pk-name">New complication</span>${s<0?p`<span class="pk-badge">watch is full</span>`:m}
          </button>
          ${this.newShapeChooser&&s>=0?p`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${jt.map(l=>p`<button class="small ${l==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(l)}}>${J(l)}</button>`)}
            </div>
          </div>`:m}`:m}
      </div>`:m}
    </div>`}togglePicker(n=!this.pickerOpen){this.pickerOpen=n,n||(this.newShapeChooser=!1),n?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderBanners(){let n=[],i=this.renderOrphanBanner();if(i&&n.push(i),this.readOnlyReason?n.push(p`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&n.push(p`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;n.push(p`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?p` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&n.push(p`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&n.push(p`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),n}renderOrphanBanner(){let n=this.selectedOwner;if(!n?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return p`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${n.complication_count} complication${n.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?p`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:p`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>p`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${ur(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:p`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?p`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return m;if(this.activeFamily==="inline")return m;let i=n.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return p`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${z("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?m:p`<span class="mini">${Pa.length} kinds · ${Hn.length} presets</span>`}
        ${a?p`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Compact buttons: the name of each kind, no sample"],["expanded","Expanded buttons: a sample of what each kind draws"]].map(([s,l])=>p`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${z(s)}</button>`)}
              </span>
            </span>`:m}
        <span class="chev">${z("chevron")}</span>
      </h2>
      ${a?p`
          <div class="add-grid ${r?"":"lean"}">
            ${Pa.map(s=>p`<button class="add" style=${`--k:${he[s]}`} ?disabled=${i} title=${`Add a blank ${qt[s].toLowerCase()} layer`}
              @click=${()=>{let l=ze(s);this.addHere(d=>{d.elements.push(l)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?p`<span class="well">${Cs(s)}</span>`:m}<span class="add-name">${z(s)}<span>${qt[s]}</span></span></button>`)}
          </div>
          <div class="presets-l">Or start from a preset</div>
          <div class="presets">
            ${Hn.map(s=>p`<button class="preset" title=${s.blurb}
              ?disabled=${n.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:m}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,a,r=!1){n!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!be(o,g)),l=o.elements.filter(g=>be(o,g)),d=[...s].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let u=o.groups?.find(g=>g.id===n),h=u?d.filter(g=>g.payload.groupId===u.id):d.filter(g=>g.payload.id===n);if(h.length===0||h.includes(c))return;d=d.filter(g=>!h.includes(g));let f;if((u||r)&&c.payload.groupId!==void 0){let g=d.filter(x=>x.payload.groupId===c.payload.groupId);f=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else f=d.indexOf(c)+(a?0:1);if(d.splice(f,0,...h),!u){let g=h[0],x=r?void 0:c.payload.groupId;x===void 0?delete g.payload.groupId:g.payload.groupId=x}o.elements=[...d.reverse(),...l],Ye(o),Ut(o)})}markDrop(n,i){return n.classList.contains(i)?!1:(this.clearDropMarks(),n.classList.add(i),!0)}clearDropMarks(){for(let n of this.renderRoot.querySelectorAll(".layer"))n.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let n of this.renderRoot.querySelectorAll(".layer, .group-kids"))n.classList.remove("dragging")}rowDrag(n,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=n,a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===n&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===n)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?tt:0),l=o.bottom-(r.classList.contains("drop-after")?tt:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(Bl(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===n){this.togglePick(n);return}let r=[...i.elements].filter(l=>!be(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(n);if(o<0||s<0){this.togglePick(n);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi];if(!this.canEdit||n.length<2)return;let i;this.mutate(a=>{i=ca(a,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return m;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(w,T)=>this.moveLayer(w,T),o=w=>{let T;this.mutate(V=>{T=Co(V,w)}),T&&(this.inspect={kind:"layer",id:T})},s=w=>{this.mutate(T=>Ct(T,w)),this.inspect.kind==="layer"&&this.inspect.id===w&&(this.inspect={kind:"general"})},l=[...n.elements].filter(w=>!be(n,w)).reverse(),d=fe(this.host()),c=new Xe(this.buildContext(),this.draft?.config),u=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",f=`${u?.backgroundColorHex?Se(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(w=>n.elements.some(T=>T.payload.id===w)).length,x=Ta(n,this.buildContext(),this.forced)[a],$=Yp[this.thumbStep],S=Math.round(Nl*$),E=Math.round(Pl*$),v=w=>x?p`<span class="thumb">${Yo(x,w,{icons:this.icons,imageSizes:this.imageSizes,width:S,height:E})}</span>`:p`<span class="thumb"></span>`,C=this.layerDetail==="expanded",N=(w,T,V=!1)=>{let P=w.payload.id,de=this.inspect.kind==="layer"&&this.inspect.id===P,y=we(n,a,w),k=y.isHidden,Y=Re(n,P)[0],G=Mn(w.payload.rules),A=this.picking&&this.pickHoverId===P,D=this.rowDrag(P,i);return p`<div class="layer ${de?"hl":""} ${V?"held":""} ${A?"pick":""} ${k?"dim":""} ${this.multi.has(P)?"multi":""} ${T?"kid":""} ${C?"rich":""}"
        style=${`--k:${he[w.kind]}`} tabindex="0" draggable=${D.draggable}
        @pointerenter=${()=>{this.listHoverIds=[P]}}
        @pointerleave=${()=>this.leaveRow([P])}
        @click=${O=>this.clickRow(P,O)}
        @keydown=${O=>{O.key==="Enter"&&(this.inspect={kind:"layer",id:P})}}
        @dragstart=${D.onStart} @dragend=${D.onEnd} @dragover=${D.onOver} @drop=${D.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${z("grip")}</span>
        <span class="bar"></span>
        ${v([P])}
        <span class="name">
          <b>${Me(w,d)}</b>
          <small><span class="kind">${qt[w.kind]}</span> · ${ah(w,c,this.historySeries,y.size)}</small>
          ${C?p`<span class="facts">${nh(this.host(),a,w,y).map(O=>p`<span class="fact"><b>${O.label}</b> ${O.value}</span>`)}</span>`:m}
        </span>
        <span class="right">
          <span class="badges">
            ${Y?p`<span class="badge tap" title=${`Tappable \xB7 ${Me(Y,d)}`}>tap</span>`:m}
            ${w.payload.rules.length===0?m:p`<span class="badge states" title=${G}>${G.replace(/\.$/,"").toLowerCase()}</span>`}
            ${k?p`<span class="badge">hidden</span>`:m}
          </span>
          ${i?p`<span class="acts">
            <button class="icon" title=${`Bring forward (${Ve}])`} aria-label="Bring forward" @click=${O=>{O.stopPropagation(),r(P,1)}}>${z("up")}</button>
            <button class="icon" title=${`Send back (${Ve}[)`} aria-label="Send back" @click=${O=>{O.stopPropagation(),r(P,-1)}}>${z("down")}</button>
            <button class="icon" title=${`${y.isHidden?"Show":"Hide"} (${cr}${Ve}H)`} aria-label=${y.isHidden?"Show this layer":"Hide this layer"} @click=${O=>{O.stopPropagation(),this.mutate(se=>Ee(se,a,P,{isHidden:!y.isHidden}))}}>${z(y.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${Ve}D)`} aria-label="Duplicate" @click=${O=>{O.stopPropagation(),o(P)}}>${z("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${O=>{O.stopPropagation(),s(P)}}>${z("delete")}</button>
          </span>`:m}
        </span>
      </div>`},B=(w,T)=>{let V=this.inspect.kind==="group"&&this.inspect.id===w.id,P=!this.collapsed.has(w.id),de=this.rowDrag(w.id,i),y=T[0],k=T[T.length-1],Y=A=>{let D=A.currentTarget,O=D.getBoundingClientRect(),se=O.top+(D.classList.contains("drop-before")?tt:0),Qt=O.bottom-(D.classList.contains("drop-after")?tt:0),ke=(A.clientY-se)/Math.max(1,Qt-se);return ke<.25?"drop-before":!P&&ke>.75?"drop-after":"drop-into"},G=T.map(A=>A.payload.id);return p`<div class="layer group ${V?"hl":""} ${C?"rich":""}" style=${`--k:${ne.group}`} tabindex="0" draggable=${de.draggable}
        @pointerenter=${()=>{this.listHoverIds=G}}
        @pointerleave=${()=>this.leaveRow(G)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:w.id}}}
        @keydown=${A=>{A.key==="Enter"&&(this.inspect={kind:"group",id:w.id})}}
        @dragstart=${de.onStart} @dragend=${de.onEnd}
        @dragover=${A=>{!this.dragId||this.dragId===w.id||(A.preventDefault(),this.markDrop(A.currentTarget,Y(A)))}}
        @drop=${A=>{A.preventDefault();let D=Y(A);this.clearDragMarks();let O=this.dragId;if(this.dragId=void 0,!(!O||!y||!k)){if(D==="drop-before"){this.reorderLayer(O,y.payload.id,!0,!0);return}if(D==="drop-after"){this.reorderLayer(O,k.payload.id,!1,!0);return}this.isGroupId(O)||(this.reorderLayer(O,y.payload.id,!0),this.mutate(se=>ua(se,O,w.id)))}}}>
        <button class="chev" aria-expanded=${P?"true":"false"} title=${P?"Fold the group":"Unfold the group"}
          @click=${A=>{A.stopPropagation();let D=new Set(this.collapsed);P?D.add(w.id):D.delete(w.id),this.collapsed=D}}>${z("chevron")}</button>
        <span class="bar"></span>
        ${v(T.map(A=>A.payload.id))}
        <span class="name">
          <b>${w.name}</b>
          <small><span class="kind">Group</span> · ${T.length} layer${T.length===1?"":"s"} · ${w.locked?"moves as one":"unlocked"}</small>
          ${C?p`<span class="facts"><span class="fact"><b>Holds</b> ${T.map(A=>Me(A,d)).join(", ")}</span></span>`:m}
        </span>
        <span class="right">
          ${i?p`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${cr}${Ve}G)`} aria-label="Ungroup" @click=${A=>{A.stopPropagation(),this.mutate(D=>kn(D,w.id)),V&&(this.inspect={kind:"general"})}}>${z("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${w.locked?"on":""}" ?disabled=${!i}
            title=${w.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${w.locked?"Unlock the group":"Lock the group"}
            @click=${A=>{A.stopPropagation(),this.mutate(D=>{let O=D.groups?.find(se=>se.id===w.id);O&&(O.locked=!O.locked)})}}>${z(w.locked?"lock":"unlock")}</button>
        </span>
      </div>`},q=[],le=new Set;for(let w=0;w<l.length;w++){let T=l[w],V=T.payload.groupId,P=V===void 0?void 0:n.groups?.find(k=>k.id===V);if(!P){q.push(N(T,!1));continue}if(le.has(P.id))continue;le.add(P.id);let de=l.filter(k=>k.payload.groupId===P.id);q.push(B(P,de));let y=this.inspect.kind==="group"&&this.inspect.id===P.id;this.collapsed.has(P.id)||q.push(p`<div class="group-kids">${de.map(k=>N(k,!0,y))}</div>`)}return p`<div class="card">
      <h2 class="panel-title tools"><span class="swatch">${z("layers")}</span>Layers<span class="spacer"></span>
        <span class="mini">top draws last</span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([w,T])=>p`
              <button class=${this.layerDetail===w?"on":""} title=${T} aria-label=${T} aria-pressed=${this.layerDetail===w?"true":"false"}
                @click=${()=>{this.layerDetail=w,this.saveListView()}}>${z(w)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${Jp.map((w,T)=>p`
              <button class=${this.thumbStep===T?"on":""} title=${`${Ol[T]} row pictures`}
                aria-label=${`${Ol[T]} row pictures`} aria-pressed=${this.thumbStep===T?"true":"false"}
                @click=${()=>{this.thumbStep=T,this.saveListView()}}>${w}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?p`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${Ve}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?p`<div class="hint">${Ln}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:m}
      ${n.elements.length===0?p`<div class="empty">No layers yet. Add one above.</div>`:m}
      ${this.renderShapeIsBlank(n,a,i)}
      <div class="layers" style=${`--thumb-w:${S}px;--thumb-h:${E}px`}>
      ${q}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${ne.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${w=>{w.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${w=>{this.dragId&&(w.preventDefault(),this.markDrop(w.currentTarget,"drop-before"))}}
        @drop=${w=>{w.preventDefault(),this.clearDragMarks();let T=this.dragId,V=[...l].reverse().find(P=>P.payload.id!==T&&P.payload.groupId!==T);T&&V&&this.reorderLayer(T,V.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${z("shape")}</span>
        <span class="bar"></span>
        ${v([])}
        <span class="name">
          <b>${J(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${f}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderInlineHasNoLayers(){return p`<div class="card">
      <h2 class="panel-title"><span class="swatch">${z("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let n=this.presetKind?Rl(this.presetKind):void 0,i=this.presetEntity;return p`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?m:p`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${Qe(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Ll,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=Hl(s,n,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return p`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return p`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Ta(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return p`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${Tn.map(o=>p`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Fn.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(n,r)}
      </div>
      ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):m}
      <div class="strip">
        ${this.renderSettingsRow(n)}
        ${this.renderShapesRow(n,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(n,i,a){let r=i[n];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?je(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||je(s,o)?.locked)?qe(s,l).map(g=>g.payload.id):[],c=[...new Set([...d,...this.multi])],u=a.slots[n],h=this.focusTapId(),f={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:h??o,...c.length>0&&!this.showTaps?{highlightIds:c}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return p`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(n,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Na(r,f)}
    </div>`}renderUnder(n,i){let a=fe(this.host()),r=this.inspect,o=r.kind==="layer"?n.elements.find(u=>u.payload.id===r.id):void 0,s;if(this.showTaps)s=p`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${We(n.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let u=n.groups?.find(f=>f.id===r.id),h=u?qe(n,u.id).length:0;s=u?p`editing group <b>${u.name}</b>. Drag to move all ${h} layers.${u.locked?"":" Click one layer to move it alone."}`:""}else if(o){let u=je(n,o.payload.id);s=u?.locked?p`editing <b>${Me(o,a)}</b> in <b>${u.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:p`editing <b>${Me(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else s="click a layer to edit it";if(i==="inline")return p`<div class="under"><b>Inline</b> · ${s}</div>`;let l=this.currentCase().slots[i],d=ii(l,i),c=Math.round(d.scale*100);return p`<div class="under"><b>${J(i)}</b> · ${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""} · ${s}</div>`}renderInlinePreview(n,i){let a;if(!n)a=p`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>r?Wt((n.countdownEnd-r)/1e3):n.text,s=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;a=p`<div class="inline-line">${s??m}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?a:p`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(n){let i=this.host(),a=this.records.find(c=>c.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?ur(r):void 0].filter(Boolean).join(" \xB7 "),s=n.values,l=new Xe(this.buildContext(),this.draft?.config),d=fe(i);return p`<div class="strip-row" style=${`--c:${ne.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${z("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?p`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?p`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:p`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:m}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${ul(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?p`<button class="small" @click=${()=>{let c=ml();this.mutate(u=>{u.values.push(c)}),this.inspect={kind:"data",id:c.id}}}>Add</button>`:m}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${s.length===0?p`<p class="empty">No shared values yet.</p>`:p`<div class="data">
        ${s.map(c=>{let u=l.resolve({kind:{kind:"named",id:c.id}}),h=this.inspect.kind==="data"&&this.inspect.id===c.id;return p`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:c.id}}}>
            <span class="name">${c.name||"(unnamed)"}</span>
            <span class="meta ${u===void 0?"none":""}" title=${me(c.value,d)}>${u??"unresolved"}</span>
            ${this.canEdit?p`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${f=>{f.stopPropagation(),this.mutate(g=>{g.values=g.values.filter(x=>x.id!==c.id)}),h&&(this.inspect={kind:"general"})}}>${z("delete")}</button>`:m}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let a=n.supportedFamilies;return p`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${ne.place}`}><span class="swatch">${z("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${jt.map(r=>{if(!a.includes(r))return p`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${J(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${J(r)}</span>
            </button>`;let s=r===this.activeFamily,l;if(r==="inline")l=this.renderInlinePreview(i.inline,!0);else{let u=i[r];l=u?Na(u,{icons:this.icons,imageSizes:this.imageSizes,slot:Fn.slots[r]}):m}let d=r!=="inline"&&n.elements.every(u=>we(n,r,u).isHidden||u.payload.isHidden)&&n.elements.length>0,c=this.canEdit&&si(n,r);return p`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${s?"true":"false"} title=${`Edit the ${J(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${l}</span>
              <span class="lbl">${J(r)}${d?p`<small>· nothing shown</small>`:m}${s?p`<small>· editing</small>`:m}</span>
            </button>
            ${this.canEdit?p`<button class="icon danger tile-x" ?disabled=${!c}
              title=${c?`Remove the ${J(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${J(r)} shape`}
              @click=${u=>{u.stopPropagation(),this.removeShape(r)}}>${z("delete")}</button>`:m}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return m;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return p`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${ne.states}`}><span class="swatch">${z("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?p`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:m}
      </h2>
      ${i.length===0?p`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:p`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],s=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,l=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${l}`:"not in Home Assistant",c=this.testValues.get(r),h=n.elements.find(g=>Qn(n,g.payload.id).some(x=>x.ref.entityId===r))?.kind??"text",f=this.editingValue===r;return p`<button class="vchip ${c!==void 0?"testing":""}" style=${`--k:${he[h]}`}
            title=${c!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${z(h)}</span><b>${s}</b>
            ${f?p`<input type="text" .value=${c??o?.state??""} aria-label=${`Test value for ${s}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(r,g.target.value)} />`:p`<span class="val">${c!==void 0?`${c}${l}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[n]?.state;a===""||a===o?r.delete(n):r.set(n,a),this.testValues=r}currentCase(){return Tn.find(n=>n.label===this.previewCase)??Fn}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let a=this.inspect,r=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":J(this.activeFamily),s=a.kind==="family"&&i===void 0?p`<span class="here" style=${`--k:${ne.place}`}>${o} shape</span>`:p`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=m,d=m;if(i!==void 0)l=p`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let c=n.elements.find(u=>u.payload.id===a.id);if(c){l=p`<span class="here" style=${`--k:${he[c.kind]}`}><span class="kchip">${qt[c.kind]}</span>${Me(c,fe(this.host()))}</span>`;let u=je(n,c.payload.id);u&&(d=p`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let c=n.groups?.find(u=>u.id===a.id);c&&(l=p`<span class="here" style=${`--k:${ne.group}`}><span class="kchip">Group</span>${c.name}</span>`)}else if(a.kind==="data"){let c=n.values.find(u=>u.id===a.id);c&&(l=p`<span class="here" style=${`--k:${ne.complication}`}><span class="kchip">Value</span>${c.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(l=p`<span class="mini">nothing selected</span>`);return p`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${s}${d}
      ${l===m?m:p`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return m;let i=this.pickedElements(n);if(i.length>=2)return p`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let a=this.host(),r=this.inspect,o=m,s=!0;if(r.kind==="layer"){let d=n.elements.find(c=>c.payload.id===r.id);if(!d)return this.inspect={kind:"general"},m;o=bl(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=n.groups?.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;s=!1,o=xl(a,d)}else if(r.kind==="data"){let d=n.values.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;s=!1,o=p`<div class="sec" data-open="true" style=${`--c:${ne.complication}`}>
        <div class="sec-h"><span class="swatch">${z("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${hl(a,d)}</div>
      </div>`}else r.kind==="family"?o=wl(a,this.activeFamily):(s=!1,o=p`<div class="empty-insp">${z("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let l=this.openSections.size>1;return p`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${s?p`<button class="expand" @click=${()=>{this.openSections=l?new Set([jp(r)]):new Set(er)}}>${l?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,a){return p`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${n}${i==="mixed"?p` <span class="mixed">(mixed)</span>`:m}</span></label>`}multiEditor(n,i){let a=this.canvasFamily,r=fe(this.host()),o=new Xe(this.buildContext(),this.draft?.config),s=yl(n,a,i),l=i.length,d=[...i].reverse(),c=h=>this.mutate(f=>{for(let g of i)Ee(f,a,g.payload.id,{isHidden:h})}),u=h=>this.mutate(f=>{for(let g of i){let x=f.elements.find($=>$.payload.id===g.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&x.kind!=="timeline"&&(x.payload.colorSlot.baseColorHex=h)}},"multi-colour");return p`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${z("layers")}</span>
          <span class="tt"><h4>${l} layers picked</h4><span class="sum">Edits here land on all ${l}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(h=>p`<div class="row" style=${`--k:${he[h.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${h.kind==="icon"?p`<span class="glyph">${this.icons.render(o.resolve(h.payload.symbol)??"questionmark",16,h.payload.colorSlot.baseColorHex)??m}</span>`:m}
                <b>${Me(h,r)}</b><span class="kind">${qt[h.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${Ln}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" title=${`Group (${Ve}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${ne.place}`}>
        <div class="sec-h"><span class="swatch">${z("place")}</span>
          <span class="tt"><h4>All ${l} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${J(a)}`,s.hiddenHere,c)}
          ${s.colourable?p`${re("Colour",s.colour,h=>{h!==void 0&&u(h)})}
              ${s.colour===void 0?p`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:m}`:p`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Hiding, like size and place, belongs to the ${J(a)} shape alone.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return m;let i=this.records.find(r=>r.id===this.selectedId),a=ls({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return p`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${n.dirty?p` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?p`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:m}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?p`<pre>${JSON.stringify(n.encoded(),null,2)}</pre>`:m}
      </div>
    </details>`}};L([Nt({attribute:!1})],I.prototype,"hass",2),L([Nt({type:Boolean})],I.prototype,"narrow",2),L([Nt({attribute:!1})],I.prototype,"panel",2),L([_()],I.prototype,"colLeft",2),L([_()],I.prototype,"colRight",2),L([_()],I.prototype,"panelWidth",2),L([_()],I.prototype,"owners",2),L([_()],I.prototype,"ownerId",2),L([_()],I.prototype,"records",2),L([_()],I.prototype,"selectedId",2),L([_()],I.prototype,"draft",2),L([_()],I.prototype,"readOnlyReason",2),L([_()],I.prototype,"parseError",2),L([_()],I.prototype,"maxSchemaVersion",2),L([_()],I.prototype,"presets",2),L([_()],I.prototype,"occupied",2),L([_()],I.prototype,"serverToken",2),L([_()],I.prototype,"appliedToken",2),L([_()],I.prototype,"polling",2),L([_()],I.prototype,"sendPending",2),L([_()],I.prototype,"pages",2),L([_()],I.prototype,"templateResults",2),L([_()],I.prototype,"historySeries",2),L([_()],I.prototype,"templateError",2),L([_()],I.prototype,"templateFetchedAt",2),L([_()],I.prototype,"forced",2),L([_()],I.prototype,"showRaw",2),L([_()],I.prototype,"inspect",2),L([_()],I.prototype,"openSections",2),L([_()],I.prototype,"pickerOpen",2),L([_()],I.prototype,"testValues",2),L([_()],I.prototype,"editingValue",2),L([_()],I.prototype,"thumbStep",2),L([_()],I.prototype,"layerDetail",2),L([_()],I.prototype,"addOpen",2),L([_()],I.prototype,"addDetail",2),L([_()],I.prototype,"multi",2),L([_()],I.prototype,"collapsed",2),L([_()],I.prototype,"activeFamily",2),L([_()],I.prototype,"picking",2),L([_()],I.prototype,"pickHoverId",2),L([_()],I.prototype,"listHoverIds",2),L([_()],I.prototype,"zoomed",2),L([_()],I.prototype,"helpOpen",2),L([_()],I.prototype,"showTaps",2),L([_()],I.prototype,"timestampActiveId",2),L([_()],I.prototype,"savedName",2),L([_()],I.prototype,"presetKind",2),L([_()],I.prototype,"presetEntity",2),L([_()],I.prototype,"newShapeChooser",2),L([_()],I.prototype,"previewCase",2),L([_()],I.prototype,"loadError",2),L([_()],I.prototype,"saveError",2),L([_()],I.prototype,"saving",2),L([_()],I.prototype,"conflict",2),L([_()],I.prototype,"remoteRevision",2),L([_()],I.prototype,"confirmDelete",2),L([_()],I.prototype,"moveTarget",2),L([_()],I.prototype,"moving",2),L([_()],I.prototype,"moveError",2),L([_()],I.prototype,"version",2);var pr=I;function yt(e){return String(e?.message??e)}function th(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function ur(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function nh(e,t,n,i){let a=ue[t],r=i.frame,o=d=>Math.round(d),s=[{label:"Shows",value:ir(e,n)}],l=Ci(n);return l&&s.push({label:"Looks",value:l}),s.push({label:"At",value:`${o(r.x*a.width)}, ${o(r.y*a.height)} pt`}),s.push({label:"Size",value:`${o(r.width*a.width)} x ${o(r.height*a.height)} pt`}),r.rotationDegrees!==0&&s.push({label:"Turned",value:`${Math.round(r.rotationDegrees)}\xB0`}),i.fromPlacement&&s.push({label:"Frame",value:`${J(t)} only`}),s}function ih(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function ah(e,t,n,i){let a=r=>p`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return p`${a(t.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"gauge":return p`${a(t.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=kt(e.payload),o=r!==void 0?n.get(r)??"":t.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Sn(o).length} values`}case"timeline":{let r=ct(e.payload),o=r===void 0?[]:En(n.get(r)??""),s=Math.max(0,o.length-1);return`${ih(Ne(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Se(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return We(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",pr);export{pr as WristAssistantPanel,Gl as columnFit,nh as layerFacts};
