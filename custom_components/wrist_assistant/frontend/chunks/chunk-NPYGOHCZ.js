import{Of as xe,wb as we,xb as be}from"./chunk-B5I6IIWD.js";var q=globalThis,j=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),me=new WeakMap,R=class{constructor(e,a,r){if(this._$cssResult$=!0,r!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=a}get styleSheet(){let e=this.o,a=this.t;if(j&&e===void 0){let r=a!==void 0&&a.length===1;r&&(e=me.get(a)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&me.set(a,e))}return e}toString(){return this.cssText}},T=t=>new R(typeof t=="string"?t:t+"",void 0,ee),l=(t,...e)=>{let a=t.length===1?t[0]:e.reduce((r,n,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[o+1],t[0]);return new R(a,t,ee)},fe=(t,e)=>{if(j)t.adoptedStyleSheets=e.map(a=>a instanceof CSSStyleSheet?a:a.styleSheet);else for(let a of e){let r=document.createElement("style"),n=q.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=a.cssText,t.appendChild(r)}},te=j?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let a="";for(let r of e.cssRules)a+=r.cssText;return T(a)})(t):t;var{is:ct,defineProperty:pt,getOwnPropertyDescriptor:ht,getOwnPropertyNames:ut,getOwnPropertySymbols:gt,getPrototypeOf:wt}=Object,U=globalThis,ve=U.trustedTypes,bt=ve?ve.emptyScript:"",xt=U.reactiveElementPolyfillSupport,L=(t,e)=>t,z={toAttribute(t,e){switch(e){case Boolean:t=t?bt:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let a=t;switch(e){case Boolean:a=t!==null;break;case Number:a=t===null?null:Number(t);break;case Object:case Array:try{a=JSON.parse(t)}catch{a=null}}return a}},N=(t,e)=>!ct(t,e),ye={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:N};Symbol.metadata??=Symbol("metadata"),U.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,a=ye){if(a.state&&(a.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((a=Object.create(a)).wrapped=!0),this.elementProperties.set(e,a),!a.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(e,r,a);n!==void 0&&pt(this.prototype,e,n)}}static getPropertyDescriptor(e,a,r){let{get:n,set:o}=ht(this.prototype,e)??{get(){return this[a]},set(s){this[a]=s}};return{get:n,set(s){let c=n?.call(this);o?.call(this,s),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ye}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let e=wt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let a=this.properties,r=[...ut(a),...gt(a)];for(let n of r)this.createProperty(n,a[n])}let e=this[Symbol.metadata];if(e!==null){let a=litPropertyMetadata.get(e);if(a!==void 0)for(let[r,n]of a)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[a,r]of this.elementProperties){let n=this._$Eu(a,r);n!==void 0&&this._$Eh.set(n,a)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let a=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let n of r)a.unshift(te(n))}else e!==void 0&&a.push(te(e));return a}static _$Eu(e,a){let r=a.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,a=this.constructor.elementProperties;for(let r of a.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,a,r){this._$AK(e,r)}_$ET(e,a){let r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(n!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:z).toAttribute(a,r.type);this._$Em=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,a){let r=this.constructor,n=r._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let o=r.getPropertyOptions(n),s=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:z;this._$Em=n;let c=s.fromAttribute(a,o.type);this[n]=c??this._$Ej?.get(n)??c,this._$Em=null}}requestUpdate(e,a,r,n=!1,o){if(e!==void 0){let s=this.constructor;if(n===!1&&(o=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??N)(o,a)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,a,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,a,{useDefault:r,reflect:n,wrapped:o},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??a??this[e]),o!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(a=void 0),this._$AL.set(e,a)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(a){Promise.reject(a)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,o]of r){let{wrapped:s}=o,c=this[n];s!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,o,c)}}let e=!1,a=this._$AL;try{e=this.shouldUpdate(a),e?(this.willUpdate(a),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(a)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(a)}willUpdate(e){}_$AE(e){this._$EO?.forEach(a=>a.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(a=>this._$ET(a,this[a])),this._$EM()}updated(e){}firstUpdated(e){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[L("elementProperties")]=new Map,m[L("finalized")]=new Map,xt?.({ReactiveElement:m}),(U.reactiveElementVersions??=[]).push("2.1.2");var re=globalThis,ke=t=>t,F=re.trustedTypes,_e=F?F.createPolicy("lit-html",{createHTML:t=>t}):void 0,ne="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,oe="?"+f,mt=`<${oe}>`,$=document,E=()=>$.createComment(""),O=t=>t===null||typeof t!="object"&&typeof t!="function",ie=Array.isArray,He=t=>ie(t)||typeof t?.[Symbol.iterator]=="function",ae=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$e=/-->/g,Ae=/>/g,k=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,Ce=/"/g,Se=/^(?:script|style|textarea|title)$/i,se=t=>(e,...a)=>({_$litType$:t,strings:e,values:a}),b=se(1),i=se(2),It=se(3),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Te=new WeakMap,_=$.createTreeWalker($,129);function Re(t,e){if(!ie(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return _e!==void 0?_e.createHTML(e):e}var Le=(t,e)=>{let a=t.length-1,r=[],n,o=e===2?"<svg>":e===3?"<math>":"",s=P;for(let c=0;c<a;c++){let d=t[c],g,w,h=-1,x=0;for(;x<d.length&&(s.lastIndex=x,w=s.exec(d),w!==null);)x=s.lastIndex,s===P?w[1]==="!--"?s=$e:w[1]!==void 0?s=Ae:w[2]!==void 0?(Se.test(w[2])&&(n=RegExp("</"+w[2],"g")),s=k):w[3]!==void 0&&(s=k):s===k?w[0]===">"?(s=n??P,h=-1):w[1]===void 0?h=-2:(h=s.lastIndex-w[2].length,g=w[1],s=w[3]===void 0?k:w[3]==='"'?Ce:Me):s===Ce||s===Me?s=k:s===$e||s===Ae?s=P:(s=k,n=void 0);let v=s===k&&t[c+1].startsWith("/>")?" ":"";o+=s===P?d+mt:h>=0?(r.push(g),d.slice(0,h)+ne+d.slice(h)+f+v):d+f+(h===-2?c:v)}return[Re(t,o+(t[a]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},D=class t{constructor({strings:e,_$litType$:a},r){let n;this.parts=[];let o=0,s=0,c=e.length-1,d=this.parts,[g,w]=Le(e,a);if(this.el=t.createElement(g,r),_.currentNode=this.el.content,a===2||a===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=_.nextNode())!==null&&d.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(let h of n.getAttributeNames())if(h.endsWith(ne)){let x=w[s++],v=n.getAttribute(h).split(f),I=/([.?@])?(.*)/.exec(x);d.push({type:1,index:o,name:I[2],strings:v,ctor:I[1]==="."?K:I[1]==="?"?G:I[1]==="@"?J:C}),n.removeAttribute(h)}else h.startsWith(f)&&(d.push({type:6,index:o}),n.removeAttribute(h));if(Se.test(n.tagName)){let h=n.textContent.split(f),x=h.length-1;if(x>0){n.textContent=F?F.emptyScript:"";for(let v=0;v<x;v++)n.append(h[v],E()),_.nextNode(),d.push({type:2,index:++o});n.append(h[x],E())}}}else if(n.nodeType===8)if(n.data===oe)d.push({type:2,index:o});else{let h=-1;for(;(h=n.data.indexOf(f,h+1))!==-1;)d.push({type:7,index:o}),h+=f.length-1}o++}}static createElement(e,a){let r=$.createElement("template");return r.innerHTML=e,r}};function M(t,e,a=t,r){if(e===A)return e;let n=r!==void 0?a._$Co?.[r]:a._$Cl,o=O(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(t),n._$AT(t,a,r)),r!==void 0?(a._$Co??=[])[r]=n:a._$Cl=n),n!==void 0&&(e=M(t,n._$AS(t,e.values),n,r)),e}var B=class{constructor(e,a){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=a}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:a},parts:r}=this._$AD,n=(e?.creationScope??$).importNode(a,!0);_.currentNode=n;let o=_.nextNode(),s=0,c=0,d=r[0];for(;d!==void 0;){if(s===d.index){let g;d.type===2?g=new H(o,o.nextSibling,this,e):d.type===1?g=new d.ctor(o,d.name,d.strings,this,e):d.type===6&&(g=new Z(o,this,e)),this._$AV.push(g),d=r[++c]}s!==d?.index&&(o=_.nextNode(),s++)}return _.currentNode=$,n}p(e){let a=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,a),a+=r.strings.length-2):r._$AI(e[a])),a++}},H=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,a,r,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=a,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,a=this._$AM;return a!==void 0&&e?.nodeType===11&&(e=a.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,a=this){e=M(this,e,a),O(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):He(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T($.createTextNode(e)),this._$AH=e}$(e){let{values:a,_$litType$:r}=e,n=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=D.createElement(Re(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(a);else{let o=new B(n,this),s=o.u(this.options);o.p(a),this.T(s),this._$AH=o}}_$AC(e){let a=Te.get(e.strings);return a===void 0&&Te.set(e.strings,a=new D(e)),a}k(e){ie(this._$AH)||(this._$AH=[],this._$AR());let a=this._$AH,r,n=0;for(let o of e)n===a.length?a.push(r=new t(this.O(E()),this.O(E()),this,this.options)):r=a[n],r._$AI(o),n++;n<a.length&&(this._$AR(r&&r._$AB.nextSibling,n),a.length=n)}_$AR(e=this._$AA.nextSibling,a){for(this._$AP?.(!1,!0,a);e!==this._$AB;){let r=ke(e).nextSibling;ke(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,a,r,n,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=a,this._$AM=n,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=p}_$AI(e,a=this,r,n){let o=this.strings,s=!1;if(o===void 0)e=M(this,e,a,0),s=!O(e)||e!==this._$AH&&e!==A,s&&(this._$AH=e);else{let c=e,d,g;for(e=o[0],d=0;d<o.length-1;d++)g=M(this,c[r+d],a,d),g===A&&(g=this._$AH[d]),s||=!O(g)||g!==this._$AH[d],g===p?e=p:e!==p&&(e+=(g??"")+o[d+1]),this._$AH[d]=g}s&&!n&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},K=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},G=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},J=class extends C{constructor(e,a,r,n,o){super(e,a,r,n,o),this.type=5}_$AI(e,a=this){if((e=M(this,e,a,0)??p)===A)return;let r=this._$AH,n=e===p&&r!==p||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==p&&(r===p||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,a,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=a,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}},qt={M:ne,P:f,A:oe,C:1,L:Le,R:B,D:He,V:M,I:H,H:C,N:G,U:J,B:K,F:Z},ft=re.litHtmlPolyfillSupport;ft?.(D,H),(re.litHtmlVersions??=[]).push("3.3.3");var ze=(t,e,a)=>{let r=a?.renderBefore??e,n=r._$litPart$;if(n===void 0){let o=a?.renderBefore??null;r._$litPart$=n=new H(e.insertBefore(E(),o),o,void 0,a??{})}return n._$AI(t),n};var le=globalThis,S=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let a=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ze(a,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};S._$litElement$=!0,S.finalized=!0,le.litElementHydrateSupport?.({LitElement:S});var vt=le.litElementPolyfillSupport;vt?.({LitElement:S});(le.litElementVersions??=[]).push("4.2.2");var yt={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:N},kt=(t=yt,e,a)=>{let{kind:r,metadata:n}=a,o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),o.set(a.name,t),r==="accessor"){let{name:s}=a;return{set(c){let d=e.get.call(this);e.set.call(this,c),this.requestUpdate(s,d,t,!0,c)},init(c){return c!==void 0&&this.C(s,void 0,t,c),c}}}if(r==="setter"){let{name:s}=a;return function(c){let d=this[s];e.call(this,c),this.requestUpdate(s,d,t,!0,c)}}throw Error("Unsupported decorator location: "+r)};function Pe(t){return(e,a)=>typeof a=="object"?kt(t,e,a):((r,n,o)=>{let s=n.hasOwnProperty(o);return n.constructor.createProperty(o,r),s?Object.getOwnPropertyDescriptor(n,o):void 0})(t,e,a)}function ra(t){return Pe({...t,state:!0,attribute:!1})}var u="wrist_assistant/complications";async function Sa(t){return t.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function Ra(t){return t.connection.sendMessagePromise({type:`${u}/parts_list`})}async function La(t,e,a,r){let n={type:`${u}/parts_save`,name:e,text:a};return r!==void 0&&(n.part_id=r),t.connection.sendMessagePromise(n)}async function za(t,e){return t.connection.sendMessagePromise({type:`${u}/parts_delete`,part_id:e})}async function Pa(t,e,a,r={}){return t.connection.sendMessagePromise({type:"call_service",domain:e,service:a,service_data:r})}async function Ea(t){return t.connection.sendMessagePromise({type:`${u}/owners`})}async function Oa(t,e){return t.connection.sendMessagePromise({type:`${u}/list`,owner_watch_id:e})}async function Da(t,e,a,r,n,o){return t.connection.sendMessagePromise({type:`${u}/preview_save`,owner_watch_id:e,complication_id:a,revision:r,png:n,meta:o})}async function Va(t,e,a,r){return t.connection.sendMessagePromise({type:`${u}/preview_get`,owner_watch_id:e,complication_id:a,revision:r})}async function Wa(t,e){return t.connection.sendMessagePromise({type:`${u}/nudge`,owner_watch_id:e})}async function Ia(t,e){return t.connection.sendMessagePromise({type:`${u}/watch_status`,owner_watch_id:e})}async function qa(t,e,a){await t.connection.sendMessagePromise({type:"wrist_assistant/devices/rename",watch_id:e,name:a})}async function ja(t,e){return t.connection.sendMessagePromise({type:"wrist_assistant/devices/addresses",watch_id:e})}async function Ua(t,e,a){return t.connection.sendMessagePromise({type:"wrist_assistant/devices/set_addresses",watch_id:e,...a})}async function Na(t,e){return t.connection.sendMessagePromise({type:"wrist_assistant/devices/forget",watch_id:e,force:!0})}async function Fa(t,e,a,r){return t.connection.sendMessagePromise({type:`${u}/save`,owner_watch_id:e,document:a,base_revision:r})}async function Ba(t,e,a,r){return t.connection.sendMessagePromise({type:`${u}/delete`,owner_watch_id:e,complication_id:a,base_revision:r})}async function Ka(t,e,a){return t.connection.sendMessagePromise({type:`${u}/history`,owner_watch_id:e,complication_id:a})}async function Ga(t,e,a,r){return t.connection.sendMessagePromise({type:`${u}/history_get`,owner_watch_id:e,complication_id:a,revision:r})}async function Ja(t,e,a,r,n){return t.connection.sendMessagePromise({type:`${u}/history_restore`,owner_watch_id:e,complication_id:a,revision:r,base_revision:n})}var V="wrist_assistant/pair";async function Za(t){return t.connection.sendMessagePromise({type:"config/auth/list"})}async function Xa(t,e){return t.connection.sendMessagePromise({type:`${V}/lookup`,code:e})}async function Ya(t,e,a,r={}){return t.connection.sendMessagePromise({type:`${V}/confirm`,code:e,...a===void 0?{}:{user_id:a},...r.replace===!0?{replace:!0}:{},...r.allowRemote===!0?{allow_remote:!0}:{}})}async function Qa(t,e,a=!1){return t.connection.sendMessagePromise({type:`${V}/offer`,...e===void 0?{}:{user_id:e},...a?{replace:!0}:{}})}async function er(t,e){return t.connection.sendMessagePromise({type:`${V}/offer_status`,offer_id:e})}async function tr(t,e){return t.connection.sendMessagePromise({type:`${V}/offer_cancel`,offer_id:e})}var de="wrist_assistant/client_certificate";function ce(t){return t===void 0?{}:{user_id:t}}async function ar(t,e){return t.connection.sendMessagePromise({type:`${de}/status`,...ce(e)})}async function rr(t,e,a,r){return t.connection.sendMessagePromise({type:`${de}/put`,pkcs12:e,passphrase:a,...ce(r)})}async function nr(t,e){return t.connection.sendMessagePromise({type:`${de}/delete`,...ce(e)})}var y="wrist_assistant/watch_config";async function or(t,e,a){return t.connection.sendMessagePromise({type:`${y}/get`,owner_watch_id:e,kind:a})}async function ir(t){return t.connection.sendMessagePromise({type:`${y}/summary`})}async function sr(t,e,a,r,n){return t.connection.sendMessagePromise({type:`${y}/save`,owner_watch_id:e,kind:a,base_revision:r,document:n})}var Ee="wrist_assistant/watch_pages";async function lr(t,e,a,r,n,o=!1){return t.connection.sendMessagePromise({type:`${Ee}/link`,source_id:a,targets:[...n],kind:e,units:[...r],replace:o})}async function dr(t){return t.connection.sendMessagePromise({type:`${Ee}/places`})}async function cr(t,e,a){return t.connection.sendMessagePromise({type:`${y}/history`,owner_watch_id:e,kind:a})}async function pr(t,e,a,r){return t.connection.sendMessagePromise({type:`${y}/history_entry`,owner_watch_id:e,kind:a,revision:r})}async function hr(t,e,a,r,n){return t.connection.sendMessagePromise({type:`${y}/restore`,owner_watch_id:e,kind:a,revision:r,base_revision:n})}function ur(t,e,a){return t.connection.subscribeMessage(a,{type:`${y}/subscribe`,owner_watch_id:e})}function gr(t,e){return t.connection.subscribeMessage(e,{type:`${y}/subscribe_delivery`})}var pe="wrist_assistant/http_actions";async function wr(t){return t.connection.sendMessagePromise({type:`${pe}/get`})}async function br(t,e,a){return t.connection.sendMessagePromise({type:`${pe}/save`,base_revision:e,document:a})}async function xr(t,e,a,r){return t.connection.sendMessagePromise({type:`${pe}/test`,action:e,global_variables:a,values:r})}var he="wrist_assistant/cameras";async function mr(t){return t.connection.sendMessagePromise({type:`${he}/list`})}async function fr(t,e){return t.connection.sendMessagePromise({type:`${he}/save`,...e})}async function vr(t,e,a,r,n){return t.connection.sendMessagePromise({type:`${he}/test`,camera:e,...a===void 0?{}:{title:a},...r===void 0?{}:{message:r},...n===void 0?{}:{devices:[...n]}})}async function yr(t,e){return t.connection.sendMessagePromise({type:"wrist_assistant/watch_voices/get",watch_id:e})}var Y="wrist_assistant/page_images";async function kr(t){return t.connection.sendMessagePromise({type:`${Y}/list`})}async function _r(t,e){return t.connection.sendMessagePromise({type:`${Y}/get`,image_id:e})}async function $r(t,e){return t.connection.sendMessagePromise({type:`${Y}/upload`,data:e})}async function Ar(t,e){return t.connection.sendMessagePromise({type:`${Y}/delete`,image_id:e})}async function Mr(t,e,a){return t.connection.sendMessagePromise({type:`${u}/move_owner`,source_owner_watch_id:e,target_owner_watch_id:a})}function Cr(t,e,a){let r={type:`${u}/subscribe`};return e&&(r.owner_watch_id=e),t.connection.subscribeMessage(a,r)}async function Tr(t,e){return Object.keys(e).length===0?{}:(await t.connection.sendMessagePromise({type:`${u}/render_values`,templates:e})).results}async function Hr(t,e){return t.connection.sendMessagePromise({type:"config_entries/get",domain:e})}async function Sr(t){return t.connection.sendMessagePromise({type:"cloud/status"})}async function Rr(t,e){return Object.keys(e).length===0?{}:(await t.connection.sendMessagePromise({type:`${u}/history_series`,requests:e})).results}function _t(t){return{entity_id:t.entityId,minutes:t.minutes,points:t.points,...t.mode==="states"?{mode:"states"}:{},...t.gaps?{gaps:!0}:{},...t.entities!==void 0&&t.entities.length>0?{entities:[...t.entities],combine:t.combine??"any"}:{}}}function $t(t){return{entity_id:t.entityId,minutes:t.minutes,period:t.period,type:t.type,...t.gaps?{gaps:!0}:{}}}function Lr(t){let e=new Map,a=new Map;for(let[r,n]of Object.entries(t))n.ok&&(e.set(r,n.series),typeof n.readings=="number"&&a.set(r,{readings:n.readings,averaged:n.averaged===!0}));return{series:e,readings:a}}async function zr(t,e){return Object.keys(e).length===0?{}:(await t.connection.sendMessagePromise({type:`${u}/statistics_series`,requests:e})).results}async function Pr(t,e){return Object.keys(e).length===0?{}:(await t.connection.sendMessagePromise({type:`${u}/list_items`,requests:e})).results}function Er(t){let e={};for(let[a,r]of xe(t))e[a]=r;return{requests:e,signature:JSON.stringify(e)}}function Or(t){let e=new Map;for(let[a,r]of Object.entries(t))r.ok&&e.set(a,JSON.stringify({items:r.items,total:r.total}));return e}function Dr(t,e=()=>!0){let a={};for(let n of we(t))e(n.entityId)&&(a[n.key]=_t(n));let r={};for(let n of be(t))e(n.entityId)&&(r[n.key]=$t(n));return{history:a,statistics:r,signature:JSON.stringify([a,r])}}var Wr={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",list:"#c0ca33",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},Ir={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",list:"List",shape:"Shape",image:"Picture",tap:"Tap zone",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},qr=["text","icon","gauge","chart","timeline","list","shape","image","tap"],jr={content:"var(--wa-hue-blue)",look:"var(--wa-hue-green)",numbers:"var(--wa-hue-orange)",position:"var(--wa-hue-pink)",states:"var(--wa-hue-yellow)",tap:"var(--wa-hue-red)",visibility:"var(--wa-hue-purple)",home:"var(--wa-hue-blue)",place:"var(--wa-hue-grey)",complication:"var(--wa-hue-blue)",group:"var(--wa-hue-green)",locked:"var(--wa-hue-red)"},Q={pages:"var(--wa-hue-blue)",layers:"var(--wa-hue-green)",values:"var(--wa-hue-red)"};function At(t){switch(t){case"text":return i`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return i`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return i`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return i`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return i`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return i`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return i`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return i`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return i`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return i`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"list":return i`<circle cx="5.5" cy="7" r="1.6" /><circle cx="5.5" cy="12" r="1.6" /><circle cx="5.5" cy="17" r="1.6" /><path d="M10 7H19M10 12H19M10 17H19" />`;case"chartDots":return i`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":case"menu":return i`<path d="M4 7H20M4 12H20M4 17H20" />`;case"note":return i`<path d="M14 3.5H7A2 2 0 0 0 5 5.5V18.5A2 2 0 0 0 7 20.5H17A2 2 0 0 0 19 18.5V8.5Z" /><path d="M14 3.5V8.5H19" /><path d="M8.5 13H15.5M8.5 16.5H13" />`;case"chartTimes":case"imageTime":case"clock":return i`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return i`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return i`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return i`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"radial":return i`<circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="4.5" r="1.8" /><circle cx="19.5" cy="12" r="1.8" /><circle cx="12" cy="19.5" r="1.8" /><circle cx="4.5" cy="12" r="1.8" /><circle cx="17.3" cy="6.7" r="1.4" /><circle cx="6.7" cy="17.3" r="1.4" />`;case"pages":return i`<rect x="3" y="7" width="12" height="13" rx="2" /><path d="M8 4h11a2 2 0 0 1 2 2v11" />`;case"grip":return i`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return i`<path d="M6 9L12 15L18 9" />`;case"plus":return i`<path d="M12 5V19M5 12H19" />`;case"braces":return i`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return i`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return i`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return i`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return i`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return i`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return i`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return i`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return i`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return i`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"phone":return i`<rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 5.5H13.5" />`;case"qr":return i`<rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14H16.5V16.5M20 14V14.01M14 20H14.01M17.5 20H20V17.5" />`;case"keyboard":return i`<rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10H6.51M10 10H10.01M14 10H14.01M17.5 10H17.51M8 14.5H16" />`;case"foldAll":return i`<path d="M4 12H20M8.5 3.5L12 7L15.5 3.5M8.5 20.5L12 17L15.5 20.5" />`;case"unfoldAll":return i`<path d="M4 12H20M8.5 7L12 3.5L15.5 7M8.5 17L12 20.5L15.5 17" />`;case"compact":return i`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return i`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"grid":return i`<rect x="3.5" y="4" width="7.5" height="7" rx="1.6" /><rect x="13" y="4" width="7.5" height="7" rx="1.6" /><rect x="3.5" y="13" width="7.5" height="7" rx="1.6" /><rect x="13" y="13" width="7.5" height="7" rx="1.6" />`;case"lock":return i`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return i`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return i`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return i`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return i`<path d="M6 14L12 8L18 14" />`;case"down":return i`<path d="M6 10L12 16L18 10" />`;case"left":return i`<path d="M14 6L8 12L14 18" />`;case"right":return i`<path d="M10 6L16 12L10 18" />`;case"show":return i`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return i`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return i`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return i`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return i`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return i`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return i`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return i`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return i`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return i`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`;case"checklist":return i`<rect x="3" y="4" width="7" height="7" rx="1.8" /><path d="M4.9 7.4L6.3 8.8L8.4 6.4" />
        <rect x="3" y="13" width="7" height="7" rx="1.8" /><path d="M4.9 16.4L6.3 17.8L8.4 15.4" />
        <path d="M13.5 7.5H21M13.5 16.5H21" />`;case"home":return i`<path d="M4 11.5L12 4.5L20 11.5" /><path d="M6.5 9.5V19.5H17.5V9.5" /><path d="M10.2 19.5V14.8H13.8V19.5" />`;case"thumbSmall":return i`<rect x="3" y="9" width="6" height="6" rx="1.5" /><path d="M12.5 12H21" />`;case"thumbMedium":return i`<rect x="3" y="6.5" width="10" height="11" rx="2" /><path d="M16.5 12H21" />`;case"thumbLarge":return i`<rect x="3" y="4" width="14" height="16" rx="2.5" /><path d="M19.5 12H21" />`;case"alignLeft":return i`<path d="M4 3V21" /><rect x="8" y="6" width="11" height="4" rx="1" /><rect x="8" y="14" width="6" height="4" rx="1" />`;case"alignCenterX":return i`<path d="M12 3V6M12 10V14M12 18V21" /><rect x="5" y="6" width="14" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" />`;case"alignRight":return i`<path d="M20 3V21" /><rect x="5" y="6" width="11" height="4" rx="1" /><rect x="10" y="14" width="6" height="4" rx="1" />`;case"alignTop":return i`<path d="M3 4H21" /><rect x="6" y="8" width="4" height="11" rx="1" /><rect x="14" y="8" width="4" height="6" rx="1" />`;case"alignCenterY":return i`<path d="M3 12H6M10 12H14M18 12H21" /><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" />`;case"alignBottom":return i`<path d="M3 20H21" /><rect x="6" y="5" width="4" height="11" rx="1" /><rect x="14" y="10" width="4" height="6" rx="1" />`;case"alignCenter":return i`<rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M12 3V7M12 17V21M3 12H7M17 12H21" />`;case"mic":return i`<rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" /><path d="M12 18V20.5" />`;case"sliders":return i`<path d="M4 8H11M15 8H20M4 16H7M11 16H20" /><circle cx="13" cy="8" r="2" /><circle cx="9" cy="16" r="2" />`;case"more":return i`<circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" />`}}function Oe(t){return b`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${At(t)}</svg>`}var De=l`
      background:
        linear-gradient(var(--lo-fill), var(--lo-fill)) padding-box,
        linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 33%, transparent) 30%,
          var(--lo-mid) 62%, color-mix(in srgb, var(--c) 25%, transparent) 100%) border-box;
      border: 1.5px solid transparent;
`,W=l`
      background: var(--lo-fill);
      border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));
`,Ve=l`
    /* The header is a bar of its own: a step darker than the cards, one
       hairline under it, and a small gap before the columns. */
    header, .wa-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      min-height: 46px;
      background: var(--wa-top);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      flex: none;
      z-index: 20;
    }
    header .spacer, .wa-bar .spacer { flex: 1; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Top bar: Browse, a divider, New, Import and Share at the left, then
       sync, ···, Save and its caption, the editor switches and the help. */
    header, .wa-bar { gap: 6px; min-height: 46px; border-bottom: 1px solid var(--wa-line); margin-bottom: 6px; }
    .picker > button.tb-browse {
      --c: var(--wa-hue-blue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-go-mid);
      min-width: 0; max-width: none; height: 28px; gap: 7px; padding: 0 9px 0 10px; font-size: 13px; font-weight: 600;
      border-radius: 6px; box-shadow: none;
      ${W}
    }
    .picker > button.tb-browse:hover { --lo-fill: var(--wa-hover); box-shadow: none; }
    .picker > button.tb-browse:focus-visible { box-shadow: var(--wa-ring); }
    .picker > button.tb-browse svg { width: 14px; height: 14px; }
    .tb-browse .tb-browse-l { color: var(--wa-ink); }
    /* The hairline between Browse and the buttons that make a new one. */
    .tb-div { width: 1px; height: 18px; margin: 0 4px; flex: none; background: var(--wa-line-strong); }
    .tb-name {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 8px; min-width: 0;
      border-radius: 7px; border: 1px solid transparent; cursor: text;
    }
    .tb-name:hover { border-color: var(--wa-line); }
    .tb-name:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .tb-name > input.tb-name-input[type=text],
    .tb-name > input.tb-name-input[type=text]:hover,
    .tb-name > input.tb-name-input[type=text]:focus-visible {
      font: inherit; font-size: 14px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink); min-height: 0; padding: 0;
      border: 0; background: transparent; box-shadow: none; outline: none;
      field-sizing: content; min-width: 7ch; max-width: 280px;
    }
    .tb-name > input.tb-name-input:disabled { opacity: 1; cursor: default; }
    .tb-pen { font-size: 11px; color: var(--wa-muted); opacity: .6; }
    .tb-pill {
      display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; min-width: 0; max-width: 300px;
      font-size: 11.5px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    header button.icon.tb-icon, .wa-bar button.icon.tb-icon { width: 30px; height: 30px; }
    header button.icon.tb-icon svg.ui-icon, .wa-bar button.icon.tb-icon svg.ui-icon { width: 16px; height: 16px; }
    /* Where the home has got to: a dot and its words in the dot's color,
       with no pill round them. */
    .tb-sync {
      display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 4px; min-width: 0; max-width: 380px;
      border-radius: 6px; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; border: 0; background: none;
    }
    .tb-sync .tb-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: currentColor; }
    .tb-sync-l { overflow: hidden; text-overflow: ellipsis; }
    .tb-sync-n { flex: none; font-weight: 500; color: var(--wa-muted); }
    .tb-sync.ok { color: var(--wa-green); }
    .tb-sync.warn { color: var(--wa-amber); }
    .tb-sync.err { color: var(--wa-need, var(--error-color, #db4437)); }
    .tb-sync.quiet { color: var(--wa-muted); }
    .tb-sync.sending .tb-dot { animation: wa-pulse 1.2s ease-in-out infinite; }
    @keyframes wa-pulse { 50% { opacity: .3; } }
    @media (prefers-reduced-motion: reduce) { .tb-sync.sending .tb-dot { animation: none; } }
    button.tb-btn {
      font: inherit; font-size: 13px; font-weight: 600; height: 28px; padding: 0 11px; border-radius: 6px; cursor: pointer; flex: none;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink); white-space: nowrap;
    }
    button.tb-btn:hover:not(:disabled) { background: var(--wa-hover); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    button.tb-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb-btn.tb-more { padding: 0 9px; letter-spacing: .08em; }
    /* New, Import and Share wear the lit outline, each in its own hue, with
       no fill of color: green to make one, purple to bring one in, yellow to
       send one out. Browse, before them, is blue. */
    button.tb-btn.tb-new { --c: var(--wa-hue-green); display: inline-flex; align-items: center; gap: 5px; padding: 0 11px 0 9px; }
    button.tb-btn.tb-new svg { width: 13px; height: 13px; }
    button.tb-btn.tb-import { --c: var(--wa-hue-purple); }
    button.tb-btn.tb-share { --c: var(--wa-hue-yellow); }
    button.tb-btn.tb-new, button.tb-btn.tb-import, button.tb-btn.tb-share {
      --lo-fill: var(--wa-card);
      background: var(--lo-fill); border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));
    }
    button.tb-btn.tb-new:hover:not(:disabled), button.tb-btn.tb-import:hover:not(:disabled), button.tb-btn.tb-share:hover:not(:disabled) {
      --lo-fill: var(--wa-hover);
      background: var(--lo-fill);
    }
    /* Whether the work is saved, the one place it is said: muted once saved,
       amber with a dot while there are changes (or Save refuses them), red
       with a dot for an error. */
    .tb-saved {
      display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 300px;
      font-size: 12px; color: var(--wa-muted); white-space: nowrap; padding: 0 4px;
    }
    .tb-saved-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .tb-saved-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: currentColor; }
    .tb-saved.warn { color: var(--wa-amber); font-weight: 500; }
    .tb-saved.err { color: var(--error-color, #db4437); font-weight: 500; }
    /* After a save: where it has got to, one line. Amber when the reader has
       to do something (open the watch app). It stays when the bar stacks,
       on the second row, since on a phone it is the only place it is said. */
    .tb-after {
      font-size: 12px; color: var(--wa-muted); white-space: nowrap; padding: 0 4px;
      min-width: 0; max-width: 340px; overflow: hidden; text-overflow: ellipsis;
    }
    .tb-after.warn { color: var(--wa-amber); font-weight: 500; }
    header.stacked > .tb-after, .wa-bar.stacked > .tb-after { order: 2; }
    /* Stacked, "Saved 3 min ago" gives way, but changes and errors keep
       their line on the second row: it is the only place they are said. */
    header.stacked .tb-saved:not(.warn):not(.err), header.stacked .tb-pen, header.stacked > .tb-div,
    .wa-bar.stacked .tb-saved:not(.warn):not(.err), .wa-bar.stacked .tb-pen, .wa-bar.stacked > .tb-div { display: none; }
    header.stacked > .tb-saved, .wa-bar.stacked > .tb-saved { order: 2; }
    /* Stacked (a phone, or a narrow window), the bar is two tidy rows rather
       than three ragged ones: what is done to the draft on top (Browse, undo,
       redo, Save, help), and where it has got to underneath (the sync pill,
       Share, ···). The pill keeps its words whole. The empty ::after is the line break: a full
       width item of no height, so the rows carry their own margins instead
       of a row gap that would count it twice. */
    header.stacked, .wa-bar.stacked { row-gap: 0; padding-block: 4px; }
    header.stacked > *, .wa-bar.stacked > * { margin-block: 4px; }
    header.stacked::after, .wa-bar.stacked::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    header.stacked > .tb-sync, header.stacked > button.tb-btn:not(.tb-more), header.stacked > .side-menu,
    .wa-bar.stacked > .tb-sync, .wa-bar.stacked > button.tb-btn:not(.tb-more) { order: 2; }
    /* A watch screen's bar keeps its buttons together on top (···, Save and
       the help) and puts the words under them: where the copy has got to, or
       why Save is grey, wrapping whole across the row rather than cut. Left
       on the lower row alone, ··· read as a stray. */
    .wa-bar.stacked > :is(.tb-why, .nw-why, .tb-after) {
      order: 2; flex: 1 1 100%; max-width: none; white-space: normal; overflow: visible; overflow-wrap: anywhere;
    }
    /* The pill never shrinks under its words: when the row is too full it
       takes a row of its own, and only past a whole row is its note cut. */
    header.stacked > .tb-sync, .wa-bar.stacked > .tb-sync { flex: 1 0 auto; max-width: 100%; }
    header.stacked .tb-sync-l, .wa-bar.stacked .tb-sync-l { flex: none; }
    header.stacked .tb-sync-n, .wa-bar.stacked .tb-sync-n { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    /* A bar with no design open holds only the pill, ··· and the help: one
       row, the pill first, its note cut before anything wraps. Two rows left
       the help alone on the first. */
    header.stacked.bar-list::after { content: none; }
    header.stacked.bar-list > .tb-sync { order: 0; flex: 0 1 auto; min-width: 0; }
    header.stacked.bar-list > .side-menu { order: 0; }
    /* Home Assistant's own menu, which a phone hides behind this button. */
    header button.icon.tb-menu, .wa-bar button.icon.tb-menu { margin-left: -6px; }
    /* The buttons that move between the editors (Pages, Menus, Watch, and
       Back to complications): an icon and a word. The hooks that draw them
       carry the same two rules; these are here so an editor's own bar gets
       them without the hook's sheet. */
    button.tb-btn.tb-pages, button.tb-btn.tb-menus, button.tb-btn.tb-watch, button.tb-btn.tb-back {
      display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px;
    }
    button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-menus svg.ui-icon,
    button.tb-btn.tb-watch svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
`,We=l`
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
`,Ie=l`
    button.help {
      font: inherit; font-size: 13px; font-weight: 600; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 0; background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { background: var(--wa-hover); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,qe=l`
    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr) 8px var(--wa-right, 360px);
      /* The 8px drag gutters are the space between the columns, with no gap
         beside them: an 8px gap on each side as well left about 24px between
         cards, which read as three loose panels rather than one editor
         (Jesse, 2026-09-24). The cards stand on the page ground itself. */
      column-gap: 0;
      row-gap: 6px;
      padding: 0 6px;
      /* The editor is exactly one viewport tall: the grid takes whatever the
         header and the footer leave, and each column scrolls inside it. A long
         inspector used to stretch the page, which pushed the two lists under
         the canvas below the fold in every other column. */
      flex: 1 1 0;
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
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.bare { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-gutter: stable; }
    /* A scroll box says when there is more behind its edges: a short fade in
       the box's own ground, drawn by a sticky pseudo-element that cancels its
       own height with a negative margin, so nothing shifts when it appears.
       The attributes are set by the ScrollFades helper on scroll and on
       resize; in the stacked modes the boxes never scroll, so they never
       arrive and the fades never draw. */
    .column.inspector { --wa-fade: var(--wa-bg); --wa-fade-gap: 0px; }
    /* The fade gap is the list's own row gap, so the two zero-height fade
       pieces take up no room at either end. At 2px against a 4px gap they
       left a 2px strip over the Background tray. */
    .layers { --wa-fade: var(--wa-card); --wa-fade-gap: 4px; }
    /* A corner with curved text on: the layers stay editable, but read as off. */
    .layers.skipped { opacity: .45; }
    /* A corner's Bezel and Curved text rows, over its layers: the bezel is the
       outermost part of the corner and the curved text sits in front. */
    .corner-set { flex: none; display: flex; flex-direction: column; gap: 4px; padding: 4px 10px 0; }
    .corner-set .layer .grip { cursor: default; }
    .corner-set .thumb svg, .corner-split .thumb svg { width: 100%; height: 100%; display: block; }
    /* What fills the inside of a corner, under a hairline below the Bezel row:
       Curved text on the left, Layers on the right, "or" on the line between.
       The watch shows one and never both; the side not picked is dimmed. */
    .corner-split {
      display: grid; grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr);
      margin: 8px 10px 0; padding-top: 8px; border-top: 1px solid var(--wa-line); flex: 0 1 auto; min-height: 0;
    }
    .cs-why { grid-column: 1 / -1; margin: 0 4px 8px; font-size: 11px; line-height: 1.45; color: var(--wa-muted); }
    .cs-col { display: flex; flex-direction: column; gap: 4px; min-width: 0; min-height: 0; }
    .cs-col.off > :not(.cs-head) { opacity: .45; }
    .cs-col > .layers { padding: 0; }
    .cs-or { position: relative; display: flex; align-items: center; justify-content: center; }
    .cs-or::before { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; border-left: 1px solid var(--wa-line); }
    .cs-or span { position: relative; padding: 3px 0; background: var(--wa-card); font-size: 10px; color: var(--wa-muted); }
    .cs-head {
      display: flex; align-items: center; gap: 6px; padding: 2px 4px 4px; border: 0; background: none;
      font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); text-align: left; cursor: pointer;
    }
    .cs-head:hover:not(:disabled):not(.on) { color: var(--wa-ink); }
    .cs-head:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .cs-head.on { color: var(--wa-ink); cursor: default; }
    .cs-dot { flex: none; box-sizing: border-box; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid currentColor; }
    .cs-head.on .cs-dot { border-color: var(--wa-ink); background: radial-gradient(circle, var(--wa-ink) 0 2.5px, transparent 3px); }
    .cs-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 72px; padding: 8px;
      border: 1px dashed var(--wa-line-strong); border-radius: var(--wa-r-sm); background: none;
      font: inherit; font-size: 11px; color: var(--wa-muted); text-align: center; cursor: pointer;
    }
    .cs-empty:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-ink); }
    .cs-empty:disabled { cursor: default; }
    .cs-pic { display: block; width: 40px; height: 30px; }
    .cs-pic svg { display: block; width: 100%; height: 100%; }
    .cs-pic.bulb { width: 26px; height: 26px; }
    .column.canvas { --wa-fade: var(--wa-bg); --wa-fade-gap: 8px; }
    /* No scroll bar is ever drawn between the canvas and the inspector. The
       canvas column still scrolls (wheel, trackpad, keys) when a short window
       leaves it less room than its card's floor, and the edge fades above say
       so; the bar itself sat in the gap beside the inspector's own. The
       stage inside it gets the same treatment in the canvas sheet. */
    .column.canvas { scrollbar-width: none; }
    .column.canvas::-webkit-scrollbar { display: none; width: 0; height: 0; }
    .column.inspector::before, .column.inspector::after,
    .layers::before, .layers::after,
    .column.canvas::before, .column.canvas::after {
      content: ""; display: block; flex: none; height: 0; z-index: 4; pointer-events: none;
    }
    .column.inspector::before, .layers::before, .column.canvas::before {
      position: sticky; top: 0; margin-bottom: calc(-1 * var(--wa-fade-gap));
    }
    .column.inspector::after, .layers::after, .column.canvas::after {
      position: sticky; bottom: 0; margin-top: calc(-1 * var(--wa-fade-gap));
    }
    [data-more-above]::before {
      height: 28px; margin-bottom: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to bottom, var(--wa-fade), transparent);
    }
    [data-more-below]::after {
      height: 28px; margin-top: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to top, var(--wa-fade), transparent);
    }
    /* Stacked, the whole layout scrolls as one page again, so a column that
       owns its own scrollbar in three columns must give it up here. */
    .layout.cols-1 .column.left, .layout.cols-1 .column.canvas, .layout.cols-1 .column.inspector,
    .layout.cols-2 .column.inspector { overflow: visible; min-height: auto; }
    .layout.cols-1 .column.left .card.layers-card { flex: none; }
    .layout.cols-1 .layers { overflow: visible; }
    /* Stacked, the three columns become one page, and the page is read top to
       bottom rather than left to right. In column order that page opened with
       Add a layer, and the face the whole editor is about came 1730px down,
       past Pages, past every layer row: two and a half phone screens of
       scrolling before you could see what you were drawing. Reported by a
       user on Discord, "Layout on mobile", 2026-09-20.
       The order here is the order of the question being asked: what am I
       drawing and where does it land, what does the thing I just picked do,
       and only then the lists that feed it. */
    .layout.cols-1 > .column.canvas { order: 1; }
    .layout.cols-1 > .column.inspector { order: 2; }
    .layout.cols-1 > .column.left { order: 3; }
`,je=l`
    /* One card shape everywhere: white paper, a 12px corner, and a hairline
       drawn as a ring rather than a border, so nothing inside has to account
       for a border box. */
    .card {
      background: var(--wa-card);
      border: 0;
      border-radius: var(--wa-r-md);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 10px 12px 12px;
    }
`,Ue=l`
    /* Layers: one row per layer, colored by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 4px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* Every row is its own box: a field-grey ground one step off the card,
       with no edge. The gap between rows is what parts them, and the
       selection speaks louder, in its own blue. */
    .layer {
      display: grid; grid-template-columns: 0 var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 44px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background-clip: padding-box;
      background: var(--wa-field);
      box-shadow: none;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      /* Hover and selection change at once; only the drop slot animates. */
      transition: border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members wear the same ground as every other row: the group's
       box already says they are nested (Jesse, 2026-09-24). */
    .layer:hover { background: var(--wa-hover); box-shadow: none; }
    /* The row under the pointer, which the preview is showing: the picked
       outline only. The fill stays for the real selection below. */
    .layer.peek { box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    /* The face hover's row: one ring for the whole list, sliding from row to
       row and fading out where it stands when the hover ends. */
    .layers { position: relative; }
    .face-ring {
      position: absolute; top: 0; left: 0; z-index: 3; pointer-events: none; opacity: 0;
      box-shadow: inset 0 0 0 1.5px var(--wa-pick-line), 0 0 0 3px color-mix(in srgb, var(--wa-pick-line) 18%, transparent);
      transition: transform .16s cubic-bezier(.2, .8, .2, 1), width .16s cubic-bezier(.2, .8, .2, 1), height .16s cubic-bezier(.2, .8, .2, 1), opacity .22s ease-out;
    }
    .face-ring.on { opacity: 1; transition-duration: .16s, .16s, .16s, .1s; }
    .face-ring.jump { transition: none; }
    @media (prefers-reduced-motion: reduce) { .face-ring { transition: opacity .1s linear; } }
    /* The selected row: a deep blue ground, a thin blue edge, ink text and
       pale blue row buttons, the same wherever a row is selected, so the
       kinds' colors and the group boxes never fight the selection. */
    .layer.hl {
      background: var(--wa-pick-bg); color: var(--wa-ink);
      box-shadow: inset 0 0 0 1px var(--wa-pick-line);
    }
    .layer.hl .name b { font-weight: 700; }
    .layer.hl .name small { color: var(--wa-ink); }
    .layer.hl .acts button.icon { color: var(--wa-pick-ink); opacity: 1; }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.lit { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    /* A member of the selected group: a faint wash of the selection, without
       its edge, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, var(--wa-pick-bg) 55%, var(--wa-field)); }
    /* The drag grips are gone: the whole row drags, and one line under the
       Layers header says so. The grip keeps a zero-width column so the rest
       of the row's grid stays as it was. */
    .layer .grip { visibility: hidden; overflow: hidden; width: 0; }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 5px; overflow: hidden; flex: none;
      background: #000; border: 0; box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    /* The whole-complication tap row draws nothing, so it keeps the column the
       other rows line up on and shows no black tile where a picture would be. */
    .layer .thumb.blank { background: none; }
    /* A see-through Background: the checkerboard design apps use for "no
       fill", so the row does not read as a picture that failed to draw. The
       picture on top leaves the face unpainted (clearFace) and draws only a
       border, if there is one. */
    .layer .thumb.clear {
      background: repeating-conic-gradient(var(--wa-dark-check-a, #d8d8de) 0% 25%, var(--wa-dark-check-b, #f2f2f5) 0% 50%) 0 0 / 10px 10px;
    }
    /* The picture inside is an <svg class="thumb">, so the black well above
       lands on it too and would cover the checkerboard. */
    .layer .thumb.clear > svg { background: none; }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--wa-muted); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge {
      display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: 6px;
      font-size: 11px; font-weight: 600; letter-spacing: 0; white-space: nowrap;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted);
    }
    .badge.tap { color: var(--wa-hue-red); background: color-mix(in srgb, var(--wa-hue-red) 14%, transparent); }
    /* A layer with rules: the Rules card's yellow as a quiet fill with yellow
       words and no outline, the same shape as the tap badge. */
    .badge.states { color: var(--wa-hue-yellow); background: color-mix(in srgb, var(--wa-hue-yellow) 14%, transparent); }
    .badge.template-error { color: #fff; background: var(--error-color, #db4437); }
    /* Outlined, so it never reads as one more filled tag beside tap and
       states: it is a job, and a click opens it. */
    .badge.need {
      font-family: inherit; line-height: 1; border: 1px solid var(--wa-need); color: var(--wa-need);
      background: color-mix(in srgb, var(--wa-need) 12%, transparent);
    }
    button.badge.need { cursor: pointer; }
    button.badge.need:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-need) 24%, transparent); }
    button.badge.need:disabled { cursor: default; }
`,Ne=l`
    /* Beside the name rather than with the other badges, which give way to
       the buttons under the pointer: this one has to stay clickable there. */
    .layer .name b .nm-t { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .layer .name b .badge.need { flex: none; height: 16px; padding: 0 5px; }
    /* A layer's attached tap: the bottom part of the layer's own row, under
       a hairline. The row grows a little so the strip fits; the strip sits
       2px inside the row's edge so the row's ring (1px, 2px when selected)
       still shows around it. With the tap selected (tapsel) the strip wears
       the selection in pink and the top part goes back to rest. */
    .layer.with-tap {
      grid-template-rows: minmax(44px, auto) auto; row-gap: 0; padding-bottom: 0;
    }
    .tap-strip {
      --tp: var(--wa-hue-red);
      grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; min-width: 0;
      height: 24px; margin: 0 -6px 0 -4px; padding: 0 6px 0 9px;
      border-top: 0;
      border-radius: 0 0 var(--wa-r-sm) var(--wa-r-sm);
      font-size: 13px; font-weight: 600; color: var(--tp);
      background: color-mix(in srgb, var(--tp) 9%, var(--wa-field));
    }
    /* The strip runs to the row's edges, so its hit area is the strip. */
    .tap-strip { position: relative; }
    .tap-strip::after { content: ""; position: absolute; inset: 0; }
    .tap-strip:hover { background: color-mix(in srgb, var(--tp) 16%, var(--wa-field)); }
    .tap-strip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.tapsel {
      background: var(--wa-field);
      box-shadow: none;
    }
    .layer.tapsel .tap-strip {
      background: var(--wa-pick-bg);
      box-shadow: inset 0 0 0 1px var(--wa-pick-line); border-top-color: transparent;
    }
    .layer.dim .tap-strip { opacity: .55; }
    /* The layer selected, not its tap: only the top part wears the selection.
       The row itself goes back to rest and a layer behind the content (the
       isolation keeps it above the row's own ground) draws the ground and
       edge down to the top of the strip, which is 24px tall. */
    .layer.with-tap { isolation: isolate; }
    .layer.with-tap.hl:not(.tapsel) {
      background: var(--wa-field);
      box-shadow: none;
    }
    .layer.with-tap.hl:not(.tapsel)::before {
      content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 24px; z-index: -1; pointer-events: none;
      border-radius: var(--wa-r-sm) var(--wa-r-sm) 0 0;
      background: var(--wa-pick-bg);
      box-shadow: inset 0 0 0 1px var(--wa-pick-line);
    }
    .tap-strip .tap-glyph { display: grid; place-items: center; flex: none; }
    .tap-strip .tap-glyph svg { width: 13px; height: 13px; }
    .tap-strip .tap-words { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tap-strip .tap-where { margin-left: auto; flex: none; white-space: nowrap; opacity: .85; }
    /* The strip's trash waits for the pointer, like the row's own buttons.
       Hidden rather than taken out, so the strip keeps its width. */
    /* Positioned so it paints above the strip's ::after hit area, which
       otherwise swallowed the trash's click and selected the tap instead. */
    .tap-strip .tap-del { position: relative; z-index: 1; margin-left: auto; width: 22px; height: 20px; flex: none; color: var(--tp); opacity: .7; visibility: hidden; }
    .tap-strip:hover .tap-del, .tap-strip:focus-visible .tap-del, .tap-strip .tap-del:focus-visible { visibility: visible; }
    .tap-strip .tap-where + .tap-del { margin-left: 4px; }
    .tap-strip .tap-del:hover { opacity: 1; }
    .tap-strip .tap-del svg.ui-icon { width: 14px; height: 14px; }
    /* The right end of a row holds one thing at a time: the badges at rest,
       the buttons under the pointer. They trade places rather than stand side
       by side, so the badges keep the right edge and the row keeps its width.
       The selected row used to keep its buttons out too, which put five icons
       over a long name for as long as the row was selected; now only the
       pointer brings them, and keyboard focus (focus-visible, so a click that
       focuses the row does not count).

       The :has(.acts) guard is what keeps the swap honest. A pinned row and a
       read-only document carry badges and no buttons, and without it hovering
       one hid the badge and put nothing in its place. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer:focus-visible .acts, .layer:has(.acts :focus-visible) .acts { display: inline-flex; }
    .layer:hover:has(.acts) .badges,
    .layer:focus-visible:has(.acts) .badges,
    .layer:has(.acts :focus-visible) .badges { display: none; }
    .layer .acts button.icon { width: 26px; height: 26px; border-radius: 50%; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    /* The row being dragged leaves the list. The slot opening under the
       pointer already says where the layer is going, so a ghost of it left
       behind in its old place is one thing too many to read.

       Collapsed, not removed: taking the drag source out of the document
       cancels the drag. The negative margin eats the second of the two 6px
       gaps a zero-height row would otherwise sit between. */
    .layer.dragging, .group-kids.dragging, .group-box.dragging {
      height: 0; min-height: 0; margin-top: -1px; margin-bottom: -1px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    /* The row that is not a layer: Background, the shape under everything and
       what a tap anywhere else does. It cannot be dragged, grouped or
       deleted, so it sits below one hairline, where nothing can be dropped
       past it. The row itself looks like every other row, tap strip and all:
       the darker full-bleed tray it used to sit in read as a different kind
       of thing from the layers (Jesse, 2026-09-24). */
    .pinned-set {
      flex: none; margin: 6px 10px 0; padding: 6px 0 10px; border-top: 1px solid var(--wa-line);
      display: flex; flex-direction: column; gap: 4px;
    }
    /* Inline has no stack above its rows, so they sit at the foot of the card,
       where a canvas shape's own rows end up. */
    .inline-layers .pinned-set { margin-top: auto; }
    .layer.pinned .grip { cursor: default; }
`,Fe=l`
    /* Left column cards: Pages, Layers and Shared values. Each wears its hue
       in three places only: the lit outline, the filled chip behind its title
       glyph, and nothing else in it. The fill is the plain card. */
    .card.lc {
      --c: var(--wa-accent); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      padding: 0; border-radius: var(--wa-lc-r); box-shadow: none;
      ${De}
    }
    .card.pages-card { --c: var(--wa-lc-pages); }
    .card.layers-card { --c: var(--wa-lc-layers); }
    .card.sv-card { --c: var(--wa-lc-values); }
    .lc-head .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: var(--c); color: var(--wa-chip-ink);
    }
    .lc-head .swatch svg.ui-icon { width: 11px; height: 11px; stroke-width: 2.6; }
    .lc-head {
      display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; min-height: 40px; padding: 6px 8px 6px 10px;
    }
    .lc-head .spacer { flex: 1; }
    /* A card's title: small capitals, the same as the inspector's. */
    .lc-title { font-size: 12px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--wa-ink); }
    .lc-sub { font-size: 12px; font-weight: 400; color: var(--wa-muted); white-space: nowrap; }
    .lc-sub b { color: var(--wa-ink); font-weight: 600; }
    /* The Pages line never wraps: the page buttons, + and ··· keep their row
       and the note beside the title gives way first. */
    .pages-card .lc-head { flex-wrap: nowrap; }
    .pages-card .lc-title { flex: none; }
    .pages-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .pages-card .lc-head .spacer { min-width: 0; }
    button.lc-btn, button.lc-ghost {
      font: inherit; font-size: 13px; font-weight: 600; line-height: 1; cursor: pointer; flex: none; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    button.lc-btn svg.ui-icon, button.lc-ghost svg.ui-icon { width: 13px; height: 13px; }
    /* A card's button (Add, Add a page, Done): the lit outline in green with
       no fill of color, on the field grey. The card's own hue stays on the
       card. */
    button.lc-btn, button.lc-btn.pri {
      --c: var(--wa-hue-green); --lo-fill: var(--wa-field); --lo-mid: var(--wa-go-mid);
      height: 24px; color: var(--wa-ink);
      ${W}
    }
    button.lc-btn:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${W} }
    button.lc-ghost { background: transparent; border-color: var(--wa-line-strong); color: var(--wa-muted); padding: 0 7px; letter-spacing: .04em; }
    button.lc-ghost.sm { height: 24px; font-size: 11px; }
    /* The Rows and Pictures buttons: a glyph showing the view on, and the
       setting's name in small type under it. The word never changes, so the
       buttons keep their width as the views step round. */
    button.lc-ghost.lc-view { flex-direction: column; justify-content: center; gap: 2px; height: 32px; padding: 0 5px; }
    button.lc-ghost.lc-view svg.ui-icon { width: 14px; height: 14px; }
    button.lc-ghost.lc-view .lc-view-word { font-size: 9px; font-weight: 600; letter-spacing: .02em; line-height: 1; }
    /* A ghost that still reads as a button: Save to parts sits on a line of
       plain text, where a bare label was easy to miss. */
    button.lc-ghost.outline { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    button.lc-ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    button.lc-ghost[aria-pressed="true"], button.lc-ghost[aria-expanded="true"] { color: var(--wa-ink); background: var(--wa-raise); }
    button.lc-btn:focus-visible, button.lc-ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.lc-btn:disabled, button.lc-ghost:disabled { opacity: .45; cursor: default; }
    /* The page tiles under the Pages header: one per page, the one showing
       raised in neutral grey, each with its own trash can. */
    .page-tiles { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 10px 2px; }
    .page-tile {
      display: inline-flex; align-items: stretch; height: 40px; flex: 1 1 96px; min-width: 96px; max-width: 170px;
      border-radius: 7px; overflow: hidden; background: var(--wa-field); box-shadow: none;
    }
    .page-tile.on { background: var(--wa-raise); box-shadow: none; }
    .page-tile .page-pick {
      flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 1px;
      padding: 0 10px; border: 0; background: transparent; color: var(--wa-muted); font: inherit; cursor: pointer; text-align: left;
    }
    .page-tile .page-pick b { font-size: 12px; font-weight: 650; color: var(--wa-ink); white-space: nowrap; }
    .page-tile .page-pick span { font-size: 10.5px; white-space: nowrap; }
    .page-tile .page-pick:hover { background: color-mix(in srgb, var(--wa-ink) 5%, transparent); }
    .page-tile .page-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .page-tile .page-trash {
      flex: none; width: 26px; border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-line) 70%, transparent);
      background: transparent; color: var(--wa-muted); opacity: .7; cursor: pointer; display: grid; place-items: center; font: inherit;
    }
    .page-tile .page-trash svg.ui-icon { width: 13px; height: 13px; }
    .page-tile .page-trash:hover, .page-tile .page-trash:focus-visible { opacity: 1; color: #FF453A; background: color-mix(in srgb, #FF453A 14%, transparent); outline: none; }
    .page-tile .page-trash.armed { width: auto; padding: 0 8px; opacity: 1; font-size: 10.5px; font-weight: 700; background: #FF453A; color: #fff; }
    .page-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; padding: 4px 8px 8px; }
    /* The ? beside a card's title: the help for that card. */
    button.lc-help {
      width: 18px; height: 18px; margin-left: -2px; padding: 0; border: 1px solid var(--wa-line); border-radius: 50%; cursor: pointer; flex: none;
      font: inherit; font-size: 10.5px; font-weight: 700; line-height: 1; background: transparent; color: var(--wa-muted);
    }
    button.lc-help:hover { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.lc-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one line under the Pages header while nothing can turn a page. */
    .lc-note { display: flex; align-items: center; gap: 6px; margin: 0 10px 8px; padding: 5px 10px; border-radius: 7px; font-size: 11.5px; }
    .lc-note.warn { color: var(--wa-amber); background: var(--wa-amber-bg); box-shadow: inset 0 0 0 1px var(--wa-amber-line); }
    .lc-note button.link { margin-left: auto; font-weight: 700; color: inherit; text-decoration: underline; }
    .lc-note span { line-height: 1.4; }
    .lc-note b { font-weight: 700; }
    /* One page: a quiet line over the Layers card, not a card of its own. */
    .pages-slim {
      display: flex; align-items: center; gap: 6px; min-height: 28px; padding: 0 2px 0 10px;
      font-size: 12px; color: var(--wa-muted);
    }
    .pages-slim .spacer { flex: 1; }
    .pages-slim-ic { display: inline-grid; place-items: center; flex: none; }
    .pages-slim-ic svg.ui-icon { width: 13px; height: 13px; }
    .pages-slim button.lc-ghost { border-color: transparent; letter-spacing: 0; font-weight: 500; }
    .pages-slim button.lc-ghost:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    .pages-card .lc-note { margin: 8px 12px 0; }
    .pages-card .page-tour-bar { margin: 0 12px 10px; }
    /* The Layers card's filter line, and the rows under it. */
    .lc-filter { display: flex; align-items: center; gap: 6px; min-height: 30px; padding: 0 10px; }
    .lc-filter .lc-sub { white-space: normal; }
    .lc-filter button.lc-ghost { margin-left: auto; }
    .lc-filter button.lc-ghost + button.lc-ghost { margin-left: 0; }
`,Be=l`
    .lc-filter .lc-drag { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
    .lc-filter .lc-sub + .lc-drag::before { content: "·"; margin-right: 6px; }
    /* The card is a column whose list takes what is left. Its header and its
       count line keep their own height, however many rows they wrap to in a
       narrow column, or the list would squash them and draw over them. */
    .layers-card > :is(.lc-head, .lc-filter, .group-cta) { flex: none; }
    .lc-filter .lc-sub { white-space: nowrap; }
    /* A narrow column: the notes go, so the buttons keep one row longer. */
    @container layers (max-width: 380px) {
      .layers-card > .lc-head .lc-sub, .lc-filter .lc-drag { display: none; }
    }
    .layers-card > .group-cta { margin: 6px 10px 0; }
    .layers-card > .hint { margin: 6px 10px 0; }
    .layers-card > .lc-empty { margin: 0; padding: 24px 16px; text-align: center; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
    .layers-card > .layers { padding: 4px 10px 0; }
    .layers-sec {
      flex: none; margin: 6px 2px 0; font-size: 11px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--wa-muted);
    }
    .layers-sec:first-child { margin-top: 0; }
`,Ke=l`
    /* Background: its caption where a layer's badges sit. */
    .layer.pinned .ground-cap { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .layer.pinned.ground .grip { visibility: hidden; }
`,Ge=l`
    /* Expanded rows say more: a third line about what the layer is made of,
       its meta free to wrap, and the badges kept beside the buttons rather
       than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    /* An expanded row swaps its badges for its buttons, the same as a compact
       one. It used to keep both, with the buttons held in the layout and only
       turned invisible, so that arriving they could not widen the right end
       and wrap the facts onto another line. That reserved width sat to the
       right of the badges and pushed them off the edge every other row lines
       up on, so at rest the badges read as crooked. The right end still never
       wraps. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
`,Je=l`
    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    /* The canvas column is three blocks stacked: what the whole complication
       is, the face itself, and the two lists of values under it. */
    /* No reserved scrollbar gutter: the canvas fills its column and almost
       never scrolls, and the 11px it kept free doubled the gap before the
       inspector. A window short enough to scroll it gets the bar then. */
    .column.canvas { display: flex; flex-direction: column; gap: 6px; scrollbar-gutter: auto; }
    /* The bar and the two lists keep their own height; the face takes what is
       left, so the lists under it are on screen without scrolling. The card
       is the canvas well: a step darker than the page's cards, with a faint
       dot grid, so the face reads as sitting on a drawing surface. */
    .column.canvas > .card.canvas-card {
      padding: 0; overflow: hidden; flex: 1 1 auto; min-height: 260px;
      display: flex; flex-direction: column;
      border-radius: var(--wa-lc-r);
      background: radial-gradient(var(--wa-well-dot) 1px, transparent 1.2px) 0 0 / 14px 14px, var(--wa-well);
      box-shadow: inset 0 0 0 1px var(--wa-well-line);
    }
`,Ze=l`
    /* The preview bar's own menus (grid size, Preview as), in place of native
       selects, whose closing menu made Chrome on macOS hold the next click. */
    .pop-menu {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 84px; max-width: calc(100vw - 16px);
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
      display: flex; flex-direction: column; gap: 1px;
    }
    .pop-menu .row {
      font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap;
      background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
    }
    .pop-menu .row:hover { background: var(--wa-panel); }
    .pop-menu .row[aria-selected="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pop-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,Xe=l`
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 45%, transparent);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
`,Ye=l`
    /* A row: a tile for the kind of source, the name over what it reads, the
       value it reads now, and how many layers read it. The same ground and
       hairline as a Layers row. */
    .values-list .datum.svr {
      display: grid; grid-template-columns: 22px minmax(0, 1fr) auto auto; align-items: center; gap: 10px;
      min-height: 40px; padding: 4px 6px 4px 10px; border-radius: var(--wa-r-sm);
      background: var(--wa-field); box-shadow: none;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum.svr:hover { background: var(--wa-hover); box-shadow: none; }
    /* Open, and read by the selected layer: the picked row's blue, filled
       for the one read by the selection and an edge for the open one. Read
       by the layer the pointer rests on over the face: an edge only. */
    .values-list .datum.hl { box-shadow: inset 0 0 0 1px var(--wa-pick-line); background: var(--wa-field); }
    .values-list .datum.sel { background: var(--wa-pick-bg); box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    .values-list .datum.peek:not(.sel):not(.hl) { box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    .svr-ico {
      width: 22px; height: 28px; display: grid; place-items: center;
      background: none; color: var(--c);
    }
    .svr-ico svg { width: 18px; height: 18px; }
    .svr-ico.need { background: color-mix(in srgb, var(--wa-need) 14%, transparent); color: var(--wa-need); }
    .svr-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .svr-text .nm { font-size: 13px; font-weight: 600; color: var(--wa-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .svr-src { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; color: var(--wa-muted); overflow: hidden; white-space: nowrap; }
    .svr-src > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .svr-src .svr-ent { flex: 0 1 auto; color: color-mix(in srgb, var(--wa-ink) 75%, var(--wa-muted)); }
    .svr-src .svr-id { flex: 0 1000 auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; }
    .svr-src .svr-need { flex: none; color: var(--wa-need); font-weight: 600; }
    .svr-now {
      max-width: 120px; padding: 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: pre;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-weight: 500;
      color: var(--wa-val); background: none;
    }
    .svr-now.none { font-family: inherit; font-weight: 500; font-style: italic; color: var(--wa-muted); background: transparent; }
    .svr-uses {
      min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; display: grid; place-items: center;
      font-size: 12px; font-weight: 500; color: var(--wa-ink); background: var(--wa-raise);
    }
    .svr-end { display: grid; place-items: center; min-width: 28px; }
    .svr-end > * { grid-area: 1 / 1; }
    .values-list .datum.svr .svr-end button.icon { opacity: 0; pointer-events: none; }
    .values-list .datum.svr:is(:hover, :focus-within) .svr-end:has(button.icon) .svr-uses { opacity: 0; }
    .values-list .datum.svr:is(:hover, :focus-within) .svr-end button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum.svr .svr-end button.icon:hover:not(:disabled), .values-list .datum.svr .svr-end button.icon:focus-visible { opacity: 1; }
    /* The Shared values card: one line under the Layers card, the list
       unfolding under it. The list is as tall as its rows, up to a third
       of the window, and scrolls past that. A drag of the top edge sets its
       height until another complication opens. */
    .sv-card { position: relative; }
    .sv-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .sv-card button.lc-help.on { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-raise); }
    .sv-body {
      max-height: 33vh; overflow-y: auto; padding: 0 10px 10px; display: flex; flex-direction: column; gap: 6px;
      scrollbar-width: thin; scrollbar-color: var(--wa-line-strong) transparent;
    }
    .sv-none { font-size: 12px; color: var(--wa-muted); padding: 2px 4px; }
    /* The resize edge: the gap above the card. A short bar shows on hover. */
    .sv-grip { position: absolute; left: 0; right: 0; top: -7px; height: 10px; cursor: row-resize; z-index: 5; touch-action: none; }
    .sv-grip::after {
      content: ""; position: absolute; left: 50%; top: 3px; width: 36px; height: 4px; margin-left: -18px; border-radius: 2px;
      background: var(--wa-accent); opacity: 0; transition: opacity .12s ease-out;
    }
    .sv-grip:hover::after, .sv-grip.dragging::after { opacity: .8; }
    .layout.cols-1 .sv-body { max-height: none; overflow: visible; }
`,Jr=l`
      /* A see-through Background's checkerboard (.layer .thumb.clear). */
      --wa-dark-check-a: #2a2a2e;
      --wa-dark-check-b: #1a1a1d;
`,Zr=l`
    /* Canvas column: quiet header, tool strip, zoomable stage, values bar, first run. */
    /* The left cards' hues: Pages blue, Layers green, Shared values red
       (LEFT_CARD_COLOR in kinds.ts), from the palette the panel sets. */
    :host, .wa-chrome {
      --wa-lc-pages: ${T(Q.pages)};
      --wa-lc-layers: ${T(Q.layers)};
      --wa-lc-values: ${T(Q.values)};
    }
    .wa-chrome, .canvas-card {
      --wa-float-bg: var(--wa-card);
      --wa-float-line: var(--wa-line);
      --wa-float-shadow: none;
      --wa-float-sep: var(--wa-line-strong);
      --wa-hint: var(--wa-muted);
      --wa-live: var(--wa-hue-green);
      --wa-testing: var(--wa-hue-orange);
      /* On the black face, in either skin. */
      --wa-face-muted: #8e8e93;
    }
`,Qe=l`
    .column.canvas > .card.canvas-card { min-height: 440px; container: cvcard / inline-size; }
    /* The head wraps rather than squeezes. It used to be one fixed 48px line
       with every part allowed to shrink, so in a middling width the shape's
       name was cut to nothing with no sign anything was missing. Now each
       part (the name, the device part where an editor has one, the shape,
       the actions) keeps its natural width, and a part that does not fit
       moves down to a second line whole, slash and all. The actions keep to
       the right edge of whichever line they land on. */
    .cv-head {
      display: flex; flex-wrap: wrap; align-items: center; column-gap: 10px; row-gap: 6px;
      min-height: 44px; padding: 7px 10px; box-sizing: border-box; flex: none; min-width: 0;
      /* A container of its own, the same as the inspector's head. */
      margin: 6px 6px 0; background: var(--wa-card); border: 1px solid var(--wa-frame); border-radius: var(--wa-lc-r);
    }
    .cv-part { display: inline-flex; align-items: center; gap: 10px; flex: 0 1 auto; min-width: 0; }
    .cv-acts { display: inline-flex; align-items: center; gap: 6px; flex: none; margin-left: auto; }
    .cv-head .tb-name { flex: 0 1 auto; margin-left: -8px; }
    .cv-slash { flex: none; color: var(--wa-line-strong); }
    /* The whole-document actions: quiet buttons that read as one set. Delete
       goes red, and while it is armed the choices stand in its place. */
    button.cv-act {
      display: inline-flex; align-items: center; gap: 4px; flex: none; height: 26px; padding: 0 10px; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap;
      border: 0; background: var(--wa-card); color: var(--wa-ink);
    }
    button.cv-act:hover:not(:disabled), button.cv-act[aria-expanded="true"] { background: var(--wa-hover); }
    button.cv-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.cv-act:disabled { opacity: .45; cursor: default; }
    button.cv-act.danger { color: var(--wa-hue-red); }
    button.cv-act.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-red) 14%, var(--wa-card)); }
`,et=l`
    button.cv-act.icon { width: 26px; padding: 0; justify-content: center; }
    button.cv-act.icon svg.ui-icon { width: 15px; height: 15px; }
    /* Undo and redo are ink while there is a step to take, and faint when
       there is none. */
    button.cv-act.undo:disabled { opacity: 1; color: var(--wa-faint); }
    .cv-del { display: inline-flex; align-items: center; gap: 6px; flex: none; }
    /* Hairlines part the head's groups: Undo and Redo, Duplicate, and
       Delete. */
    .cv-div { width: 1px; height: 20px; flex: none; background: var(--wa-line); }
    .cv-shape {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 4 auto; min-width: 0;
      font-size: 12px; color: var(--wa-muted); white-space: nowrap;
    }
    .cv-shape .fam { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cv-shape small { font-size: 11px; }
    .cv-shape .warn { display: inline-flex; color: var(--wa-val); }
    .cv-shape .warn svg { width: 14px; height: 14px; }
    .cv-head .shape-seg { padding: 2px; gap: 2px; border-radius: 9px; flex-wrap: nowrap; }
    .cv-head .shape-seg button.tab { height: 26px; padding: 0 10px; font-size: 12px; }
    /* A narrow canvas (a phone, or a column dragged in) cannot hold the head
       on one line: the parts were drawn over the shape's name and the
       Duplicate button. It folds instead: the name with the whole-document
       actions, then its shape, then the device part in the editors whose
       head has one. The ::after is the line break, a full width item of no
       height. */
    @container cvcard (max-width: 560px) {
      .cv-head { padding: 6px 12px 8px; column-gap: 8px; }
      .cv-head::after { content: ""; order: 3; flex: 0 0 100%; height: 0; }
      .cv-head .cv-slash { display: none; }
      /* The name keeps its own width (a zero basis let the typed name spill
         over the facts beside it), the actions stay at its right, and the
         facts take the next line. */
      .cv-head .tb-name { order: 0; flex: 1 1 auto; }
      .cv-head .tb-name > input.tb-name-input[type=text] { max-width: 100%; }
      .cv-head .cv-acts { order: 1; gap: 8px; }
      .cv-head .cv-what { order: 2; flex: 1 1 100%; }
      .cv-head .cv-what .cv-shape { white-space: normal; }
      .cv-head .cv-what .fam { overflow: visible; overflow-wrap: anywhere; }
      .cv-head .cv-where { order: 4; flex: 0 1 auto; }
    }
`,tt=l`
    /* The stage: the dotted surface, the zoomable face on it, and the values
       bar at its foot. The face's Fit size comes from the stage-wrap's own
       box, through container units, so no script measures anything. */
    /* The dot grid is the canvas card's own, so the stage adds nothing. */
    .stage-area {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
      background: none;
    }
    .stage-wrap { position: relative; flex: 1 1 auto; min-height: 300px; container-type: size; }
    .stage-wrap.first-run { min-height: 540px; }
    .stage-wrap > .stage {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: stretch; gap: 12px;
      padding: 2px 24px 16px; overflow: auto; background: none; container-type: normal;
      /* A face zoomed past the stage still pans with the wheel and the
         trackpad, but no bar is drawn: the stage's right edge is the card's,
         and a bar there stood between the canvas and the inspector. At Fit
         the face no longer overruns the stage (stageReserve counts the hint's
         three lines and the gap over it). */
      scrollbar-width: none;
    }
    .stage-wrap > .stage::-webkit-scrollbar { display: none; width: 0; height: 0; }
    .stage-wrap > .stage.control-stage { align-items: center; justify-content: center; padding-top: 24px; }
    .stage-wrap .row-strip { align-self: center; flex: none; }
    /* Auto margins centre the face both ways and never push it past the
       stage's top or left edge, so a face zoomed past the stage scrolls from
       its own corner. */
    .stage-face { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .stage-face > .preview { width: auto; }
    .stage-wrap .stage-face > .preview > svg {
      width: calc(max(120px, min(100cqw - 48px, (100cqh - var(--wa-reserve, 124px)) * var(--wa-ratio, 1))) * var(--wa-zoom, 1));
      max-width: none;
    }
    /* What is selected, named just over the face's top left corner, the way a
       drawing app names a frame. Left, not centred, so it stays clear of the
       floating toolbar when the face reaches the top of the stage. */
    .face-label {
      position: absolute; left: 0; bottom: calc(100% + 6px); max-width: 100%; z-index: 2;
      display: flex; align-items: center; gap: 8px; font-size: 12px; line-height: 18px;
      color: var(--wa-hint); white-space: nowrap; overflow: hidden; pointer-events: none;
    }
    /* The kind as a neutral pill: what it is matters, not a color for it. */
    .face-label .fl-kind {
      flex: none; padding: 0 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
      color: var(--wa-soft); background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .face-label .fl-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--wa-ink); font-weight: 600; }
    .face-label .fl-group { min-width: 0; flex: 0 1 auto; display: inline-flex; align-items: center; gap: 3px; overflow: hidden; text-overflow: ellipsis; }
    .face-label .fl-sep { flex: none; opacity: .6; }
    .face-label .fl-lock { display: inline-flex; flex: none; font-size: 10px; }
    .face-label .fl-lock svg { width: 10px; height: 10px; }
    /* Three lines tall whatever it says, the most any hint wraps to, and read
       from the top. The face is centred together with the hint, so a hint that
       grew from one line to two when a layer was selected pushed the face up. */
    .stage-face > .under {
      max-width: 460px; font-size: 12px; font-weight: 400; color: var(--wa-label, var(--wa-muted));
      line-height: 15px; min-height: 45px; align-items: flex-start; align-content: flex-start;
    }
    .stage-page { position: absolute; top: 25px; left: 16px; z-index: 3; font-size: 11px; color: var(--wa-hint); pointer-events: none; }
    .stage-tools {
      /* It rides in the face's own column, just over the face. The margin
         keeps it clear of the selection's name over the face's corner. */
      position: sticky; top: 0; left: 0; right: 0; z-index: 5; flex: none; box-sizing: border-box; margin-bottom: 16px;
      display: flex; align-items: center; gap: 2px; height: 34px; padding: 0 4px; max-width: calc(100cqw - 24px);
      border-radius: 8px; background: var(--wa-float-bg); border: 1px solid var(--wa-line-strong); box-shadow: var(--wa-float-shadow);
    }
    button.tb {
      display: inline-flex; align-items: center; gap: 7px; flex: none; height: 26px; padding: 0 10px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: var(--wa-ink); cursor: pointer;
      font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap;
    }
    button.tb:hover:not(:disabled) { background: var(--wa-hover); }
    button.tb:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb:disabled { opacity: .4; cursor: default; }
    /* A tool that is on: ink on paper, the loudest thing in the strip. */
    button.tb.on, button.tb.on:hover:not(:disabled) { background: var(--wa-on-bg); color: var(--wa-on-ink); border-color: transparent; font-weight: 600; }
    button.tb.lit { color: var(--wa-ink); font-weight: 600; }
`,at=l`
    button.tb .tb-glyph { width: 13px; height: 13px; flex: none; }
    button.tb > svg.ui-icon { width: 14px; height: 14px; flex: none; }
    button.tb .caret { display: inline-flex; margin-left: -3px; color: var(--wa-hint); }
    button.tb .caret svg { width: 11px; height: 11px; }
    /* The Preview menu joins the case and the color on one button: the case
       size, then the color as a dot. The menu under it has the two lists
       under small headings. */
    button.tb .tint-dot { margin: 0 1px; }
    .pop-menu.preview-menu { min-width: 190px; }
    /* The canvas card clips, so a menu off the toolbar must fit the stage it
       hangs in (the stage wrap is a size container). On a phone the stage is
       half the screen and Preview as ran past it with its last tints cut
       off; it scrolls instead. */
    .stage-tools .pop-menu { max-height: calc(100cqh - 64px); overflow-y: auto; overscroll-behavior: contain; }
`,rt=l`
    .pop-menu .pop-title { padding: 7px 10px 6px; margin-bottom: 3px; font-size: 12.5px; font-weight: 700; color: var(--wa-ink); border-bottom: 1px solid var(--wa-line); }
    .pop-menu .pop-head { padding: 6px 10px 3px; font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
    .preview-menu .row[aria-checked="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    button.tb .tint-dot { margin-right: 0; }
    .tb-dot { width: 5px; height: 5px; margin-left: -4px; border-radius: 50%; background: currentColor; flex: none; }
    button.tb.icon { padding: 0 7px; font-size: 14px; }
    button.tb.pct { min-width: 42px; padding: 0 4px; justify-content: center; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
    .tb-sep { width: 1px; height: 18px; margin: 0 6px; background: var(--wa-float-sep); flex: none; }
    .tb-zoom { display: inline-flex; align-items: center; }
    .stage-tools .case-tool .pop-menu { left: 0; }
    @container (max-width: 680px) {
      .stage-tools .word:not(.keep) { display: none; }
      .stage-tools button.tb { gap: 4px; padding: 0 6px; }
      .stage-tools .tb-sep { margin: 0 3px; }
    }
    /* A phone-width stage: the toolbar takes two rows rather than losing the
       zoom off its end, and the face starts under both. */
    @container (max-width: 460px) {
      .stage-tools { flex-wrap: wrap; justify-content: center; height: auto; padding: 4px; row-gap: 2px; width: max-content; }
      .stage-tools .tb-sep { display: none; }
      .stage-page { top: auto; bottom: 8px; }
    }
    .snap-menu { min-width: 220px; }
    .pop-menu .row.snap-row { display: flex; align-items: center; gap: 10px; }
    .snap-row .tog {
      position: relative; display: inline-block; flex: none; width: 26px; height: 14px; border-radius: 7px; background: var(--wa-switch-off);
    }
    .snap-row .tog.on { background: var(--wa-switch-on); }
    .snap-row .tog i { position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 5px; background: #fff; transition: left .12s ease-out; }
    .snap-row .tog.on i { left: 14px; }
    .snap-steps { display: flex; gap: 2px; margin: 0 6px 4px 46px; padding: 2px; border-radius: 6px; background: var(--wa-field); }
    .snap-steps button {
      flex: 1; padding: 3px 6px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted); cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums;
    }
    .snap-steps button.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .snap-steps button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,Mt=l`
    /* A dark fall from the top to the foot, and a one pixel edge lit from
       the top left in the screen's hue. */
    .column.canvas > .card.canvas-card.lit {
      border-radius: 22px; border: 1px solid transparent;
      background:
        linear-gradient(180deg, var(--wa-stage-top) 0%, var(--wa-stage-bottom) 100%) padding-box,
        linear-gradient(140deg, var(--wa-stage-hue, var(--wa-line-strong)) 0%, color-mix(in srgb, var(--wa-stage-hue, var(--wa-line-strong)) 25%, transparent) 32%,
          var(--wa-card-mid, var(--wa-line)) 64%, color-mix(in srgb, var(--wa-stage-hue, var(--wa-line-strong)) 15%, transparent) 100%) border-box;
      box-shadow: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
    }
    .canvas-card.lit > .cv-head { border-radius: 16px; }
    /* The light falls on the watch from the top centre of the stage, under
       the head and the page's strip, and is a fixed depth, so a long page's
       stage is not lit all the way down. The floor: a faint band at the
       stage's foot under a hairline, where the hint and the tool pill sit.
       All drawn as the stage's background, so always under the watch. */
    .canvas-card.lit .stage-area {
      padding: 20px 12px 18px; gap: 10px;
      background:
        radial-gradient(48% 420px at 50% 0%, var(--wa-stage-light) 0%, transparent 80%) no-repeat,
        linear-gradient(color-mix(in srgb, var(--wa-ink) 5%, transparent), color-mix(in srgb, var(--wa-ink) 5%, transparent)) left 0 bottom 120px / 100% 1px no-repeat,
        linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 3%, transparent), transparent) left 0 bottom 0 / 100% 120px no-repeat;
    }
    /* The watch gives back a faint reflection of its lowest edge only, so a
       tall page's reflection is as short as a small one's. */
    .canvas-card.lit .stage-area .wa-watch {
      -webkit-box-reflect: below 6px linear-gradient(transparent calc(100% - 32px), var(--wa-stage-reflect));
    }
    /* Each editor's box round the watch scrolls sideways, so it clips: room
       in its foot for the reflection, the hint under it starting about where
       the reflection fades. */
    .canvas-card.lit .stage-area > :is(.pe-stage-body, .me-stage-body, .sp-stage-body, .ve-stage-body) {
      padding-bottom: 42px; margin-bottom: -10px;
    }
    /* The tools: a floating pill centred at the stage's foot, under the
       watch and its hint. It stays in the flow (moved last by order) rather
       than floating over the stage, so however it wraps on a narrow stage
       the stage grows to hold it and it never covers the watch. */
    .canvas-card.lit .stage-area > .stage-tools {
      order: 9; align-self: center; position: relative; top: auto; z-index: 8;
      margin: 8px 0 0; height: auto; min-height: 40px; width: max-content; max-width: calc(100% - 8px);
      display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; row-gap: 4px; padding: 4px;
      border-radius: 12px; background: var(--wa-card); border: 1px solid var(--wa-line-strong);
      box-shadow: var(--wa-shadow-float, var(--wa-shadow-pop));
    }
    /* Neutral 30px controls, each with its own one pixel outline. */
    .canvas-card.lit .stage-tools button.tb {
      height: 30px; gap: 7px; padding: 0 10px; border-radius: 8px; font-size: 12px;
      color: var(--wa-label, var(--wa-ink)); background: transparent; border: 1px solid var(--wa-line-strong);
    }
    .canvas-card.lit .stage-tools button.tb.icon { width: 30px; padding: 0; justify-content: center; font-size: 15px; }
    .canvas-card.lit .stage-tools button.tb.pct { min-width: 52px; padding: 0 6px; color: var(--wa-label, var(--wa-ink)); }
    .canvas-card.lit .stage-tools button.tb:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
    /* The watch's size is a fact, not a button. */
    .canvas-card.lit .stage-tools button.tb[aria-disabled="true"] { cursor: default; }
    .canvas-card.lit .stage-tools button.tb[aria-disabled="true"]:hover { background: transparent; color: var(--wa-label, var(--wa-ink)); }
    .canvas-card.lit .stage-tools button.tb.lit { color: var(--wa-ink); border-color: var(--wa-ink); }
    .canvas-card.lit .stage-tools .tb-zoom { gap: 4px; }
    .canvas-card.lit .stage-tools .tb-sep { height: 18px; margin: 0 2px; background: var(--wa-line-strong); }
`,nt=l`
    /* The values bar, the same floating family as the toolbar. */
    .values-foot {
      display: flex; flex: none; min-width: 0; padding: 0 12px 12px; container: vfoot / inline-size;
    }
    /* A head row over one value per row: the name on the left, its control
       on the right. The head is Live (a green dot and the word) or Testing
       (an amber dot, the value tried, what the device still shows, and Reset
       to live at the far end), never both at once. */
    .values-bar {
      display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; padding: 8px 10px;
      border-radius: 9px; background: var(--wa-float-bg); border: 1px solid var(--wa-float-line); box-shadow: var(--wa-float-shadow);
    }
    .vb-head { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 24px; padding-left: 6px; }
    .vb-state {
      display: inline-flex; align-items: center; gap: 8px; flex: none; max-width: 60%; min-width: 0; white-space: nowrap;
      font-size: 12px; font-weight: 700; color: var(--wa-muted);
    }
    .vb-state .vb-words { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .vb-dot { flex: none; width: 8px; height: 8px; border-radius: 4px; background: var(--wa-live); }
    .values-bar.testing .vb-state { color: var(--wa-testing); }
    .values-bar.testing .vb-dot { background: var(--wa-testing); }
    .vb-note { flex: 1 1 auto; min-width: 0; font-size: 12px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vb-head > button.vb-live { margin-left: auto; }
    .vb-empty { min-width: 0; padding: 0 6px; font-size: 11.5px; color: var(--wa-muted); }
    /* Past seven rows (30 px each, 4 px gaps), or 40% of the window, the rest
       scrolls down. */
    .vb-pills {
      display: flex; flex-direction: column; align-items: stretch; gap: 4px; min-width: 0;
      max-height: min(40vh, 236px); overflow-y: auto; scrollbar-width: thin;
    }
    .vchip.vpill {
      display: flex; align-items: center; gap: 8px; flex: none; width: auto; height: 28px; padding: 0 10px; border-radius: 6px;
      background: var(--wa-field); border: 1px solid var(--wa-line-strong); font-size: 13px; color: var(--wa-ink); cursor: default;
      /* The slider's knob ring is the row it sits on. */
      --wa-range-ring: var(--wa-field);
    }
    .vpill .vp-icon { display: inline-flex; flex: none; color: var(--k); }
    .vpill .vp-icon svg { width: 13px; height: 13px; }
    .vpill b { flex: 1; font-weight: 500; }
    /* Every control sits in one column of the same width, so the sliders,
       pickers and readings line up down the rows. */
    .vchip.vpill .test-ctl { flex: none; width: 260px; justify-content: flex-end; gap: 10px; }
    .vchip.vpill .test-ctl input[type=range] { flex: 1 1 auto; min-width: 64px; height: 18px; --wa-range-track: var(--wa-raise); }
    .vchip.vpill.testing .test-ctl input[type=range] { --wa-range-fill: var(--wa-testing); }
    .vpill .test-ctl .val, .vpill .test-ctl input[type=text] { order: -1; }
    .vchip.vpill button.val {
      flex: none; min-width: 64px; text-align: right; color: var(--wa-ink); font-family: inherit; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums;
    }
    .vchip.vpill.testing { box-shadow: none; border-color: var(--wa-testing); }
    .vchip.vpill.testing button.val { color: var(--wa-testing); }
    /* A picker drawn like the pill it sits in, not the black input well: a
       faint tint and hairline, brighter on hover. */
    .vchip.vpill .test-ctl select {
      width: 100%; height: 22px; min-height: 22px; padding: 0 24px 0 8px; font-size: 11.5px; font-weight: 600;
      border-color: color-mix(in srgb, var(--wa-ink) 12%, transparent); background-color: color-mix(in srgb, var(--wa-ink) 6%, transparent);
      background-position: right 6px center; background-size: 12px;
    }
    .vchip.vpill .test-ctl select:hover { background-color: color-mix(in srgb, var(--wa-ink) 11%, transparent); }
    .vchip.vpill .test-ctl select option { background: var(--wa-panel); color: var(--wa-ink); }
    .vchip.vpill.testing .test-ctl select { color: var(--wa-testing); border-color: color-mix(in srgb, var(--wa-testing) 45%, transparent); }
    .vchip.vpill input[type=text] { width: 80px; min-height: 22px; font-size: 11.5px; }
    .vchip.vpill .vtag { flex: none; background: transparent; border: 1px solid var(--wa-float-sep); font-size: 9.5px; line-height: 14px; padding: 0 4px; }
    .vpill button.live-reset { display: inline-flex; flex: none; padding: 0; border: 0; background: transparent; color: var(--wa-muted); cursor: pointer; }
    .vpill button.live-reset:hover { color: var(--wa-ink); }
    .vpill button.live-reset svg { width: 13px; height: 13px; }
    .vpill .live-reset-slot { flex: none; width: 13px; }
    button.vb-live {
      flex: none; height: 22px; padding: 0 9px; border: 1px solid var(--wa-line-strong); border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 600; white-space: nowrap; background: var(--wa-field); color: var(--wa-ink);
    }
    button.vb-live:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
    button.vb-live:disabled { opacity: .45; cursor: default; }
    button.vb-live:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* A phone-width stage has no room for a name beside a control: Live or
       Testing, the values and Reset to live share one row that scrolls
       sideways. The line about what the device still shows goes; the amber
       head and the amber values already say a value is being tried. */
    @container vfoot (max-width: 520px) {
      .values-bar { flex-direction: row; align-items: center; gap: 10px; padding: 4px 8px 4px 14px; }
      .vb-head { display: contents; }
      .vb-state { order: 0; }
      .vb-note { display: none; }
      .vb-pills, .vb-empty { order: 1; }
      button.vb-live { order: 2; }
      .vb-pills { flex: 1; flex-direction: row; max-height: none; padding: 2px 0; overflow-x: auto; overflow-y: hidden; }
      .vchip.vpill { height: 28px; }
      .vpill b { flex: none; max-width: 160px; }
      .vchip.vpill .test-ctl { width: auto; gap: 8px; }
      .vchip.vpill .test-ctl input[type=range] { flex: none; width: 64px; }
      .vchip.vpill button.val { min-width: 0; }
      .vchip.vpill .test-ctl select { width: auto; }
      .vpill .live-reset-slot { display: none; }
    }
`,ot=l`
    /* The inspector: the head in a card of its own, then one card per
       section of the thing selected, each standing on the page ground. */
    /* The column is a flex column so the body can take what is left. It has
       no card of its own and no side padding: the cards are its edges. */
    .column.inspector { padding: 0; container: insp / inline-size; display: flex; flex-direction: column; }
    .column.inspector.card { background: none; box-shadow: none; border-radius: 0; }
    .column.inspector > .insp-body { flex: 1 0 auto; }
    /* The head: the breadcrumb, the kind and the name, and one quiet button,
       in a card with a grey edge. It sticks to the top of the column, and its
       outline in the page color covers the gap under it, so the cards scroll
       away under a clean edge. */
    .insp-head {
      display: flex; align-items: center; gap: 8px; min-height: 36px; margin: 0; padding: 4px 6px 4px 10px;
      position: sticky; top: 0; z-index: 5; font-size: 13px;
      background: var(--wa-card); border: 1px solid var(--wa-frame); border-radius: var(--wa-lc-r);
      outline: 6px solid var(--wa-bg);
    }
    /* The breadcrumb stays one line: the complication's name gives way first,
       then the layer's name, and the kind chip never does. */
    .crumbs { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--wa-muted); white-space: nowrap; }
    .crumbs button { font: inherit; font-size: 13px; font-weight: 400; background: transparent; border: 0; padding: 3px 4px; margin: 0 -2px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .6; flex: none; }
    .crumbs .nm { min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: var(--wa-ink); }
    /* The kind as a neutral pill, the same one that names it over the face. */
    .crumbs .kchip {
      flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px;
      font-size: 11px; font-weight: 600; letter-spacing: 0; text-transform: none;
      background: var(--wa-field); color: var(--wa-soft); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .insp-head .expand {
      flex: none; margin-left: auto; font: inherit; font-size: 13px; font-weight: 400; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 6px; min-height: 24px; border-radius: 6px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 12px; }
`,it=l`
    /* One card per subject, each wearing its section's hue in three places
       only: the lit outline, the filled chip behind the title glyph, and the
       changed dot. The fill is the plain card and everything in the body is
       neutral: the body sets --c back to the neutral accent, and keeps the
       hue under --wa-sec for the changed dots beside its rows. A 36px header,
       then a body of label-left rows. The header's hover runs to the box's
       edges while the rows keep the box's padding. */
    .sec {
      --c: var(--wa-accent); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      --wa-sec: var(--c);
      margin: 6px 0 0; padding: 0 10px; border-radius: var(--wa-lc-r); overflow: hidden;
      ${De}
      box-shadow: none;
    }
    .sec-b { --c: var(--wa-accent); }
    /* A card lit for a moment: where the panel has just sent the eye. */
    .sec.lit { animation: wa-sec-lit 1.6s ease-out 2; }
    @keyframes wa-sec-lit {
      0%, 100% { box-shadow: 0 0 0 0 transparent; }
      30% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 35%, transparent); }
    }
    @media (prefers-reduced-motion: reduce) { .sec.lit { animation: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--c) 45%, transparent); } }
    .sec-h {
      display: flex; align-items: center; gap: 8px; height: 36px; margin: 0 -10px; padding: 0 6px 0 10px;
      cursor: pointer; user-select: none; transition: background-color .12s ease-out;
    }
    .sec-h:hover { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); }
    .sec-h.pinned { cursor: default; }
    .sec-h.pinned:hover { background: transparent; }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    :is(.sec-h, .xfer-callout) .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: var(--c); color: var(--wa-chip-ink);
    }
    :is(.sec-h, .xfer-callout) .swatch svg { width: 11px; height: 11px; stroke-width: 2.6; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. The title is
       set in small capitals. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    .sec-h h4 {
      margin: 0; flex: none; font-size: 12px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase;
      display: flex; align-items: center; gap: 8px; white-space: nowrap;
    }
    .sec-h .sum { margin-left: auto; min-width: 0; color: var(--wa-muted); font-size: 12px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* An open card shows its rows, so the summary would only repeat them. A
       pinned card is always open and keeps its summary as a subtitle. */
    .sec[data-open="true"] .sec-h:not(.pinned) .sum { display: none; }
    .sec-h .chev { color: var(--wa-muted); opacity: .6; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 14px; height: 14px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 0 0 10px; }
    .sec-b > .hint { margin: 2px 0 6px; }
    /* Rows that belong together (a bar's border settings, its scale) sit in a
       hairline box. The box reaches 8px out into the card's padding, so its rows
       keep the same title and control edges as the rows outside it, and a
       changed-setting dot moves in so it stays inside the line. */
    .fgroup {
      margin: 6px -8px; padding: 3px 8px; border-radius: 8px;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 3%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c, var(--wa-accent)) 20%, transparent);
    }
    /* A group that holds one row has nothing to hold together (a switch that
       is off, a choice set to None), so it draws no box and sits as a plain row. */
    .fgroup:not(:has(> * + *)) { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; background: none; box-shadow: none; }
    .fgroup > .hint { margin: 2px 0 6px; }
    .fgroup > .hint:last-child { margin-bottom: 4px; }
    .fgroup button.reset-dot { left: -6px; }
    .sec-b > :is(.adders, .chart-numbers, details.sub),
    .src-editor > details.sub { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width, and
       the Advanced editor's rule and case boxes keep their own left edge. */
    :is(.sec-b, .sec-b :is(.fgroup, .grid2, .grid4, .value-editor, .src-editor, .states, .rich-parts, .part-editor))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .span-parts, button.small, button.link, details.sub):not(.value-pop *) {
      margin-left: var(--wa-col);
    }
    /* A row whose control is a list or a strip of buttons that can wrap: the
       title stays level with the first line. */
    .field.list-field { align-items: start; }
    .field.list-field > span:first-child { padding-top: 6px; }
    .field.list-field > :not(:first-child) { grid-column: 2; }
    .field.list-field > :is(.adders, .chart-numbers, .states-foot) { margin: 0; }
    .row-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    /* A line to read rather than change, with a title like any other row:
       what a chart reads, how big a tap is, which layers a group holds. */
    .field.readout { align-items: start; }
    .field.readout > span:first-child { padding-top: 6px; }
    .readout-v { min-width: 0; padding: 6px 0 5px; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
    .field.list-field > .readout-v { padding-bottom: 2px; }
    .readout-v.template-error { color: var(--error-color, #db4437); }
    .readout-v.template-error b { font-weight: 600; }
`,st=l`
    /* The changed dot beside a card's title wears the card's hue: one of the
       three places it shows. */
    .sec-h h4 button.reset-dot { position: relative; left: auto; top: auto; width: 7px; height: 7px; background: var(--c); }
    /* The changed mark sectionCard() draws in a title: the reset dot's look,
       for a card that has no reset to offer. */
    .sec-h h4 .sec-dot { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--c); flex: none; }
    /* A layer's name: one header row with the input in place of the summary,
       in a plain card with a grey edge rather than a lit one, since a name
       is not a section. The title never wraps and the input takes what
       width is left, down to nothing, so the row stays one line in the
       narrowest column. */
    .sec.name-sec { background: var(--wa-card); border: 1px solid var(--wa-line); }
    .name-sec .sec-h { gap: 10px; height: 42px; }
    .name-sec .sec-h .swatch { display: none; }
    .name-sec .sec-h input[type=text] {
      flex: 1 1 auto; width: 0; min-width: 0; height: 28px; min-height: 28px; padding: 0 10px; font-size: 13px;
      border-radius: 6px; border-color: var(--wa-line-strong); background-color: var(--wa-field);
    }
    .name-sec .sec-h input[type=text]:focus-visible { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    /* An empty name shows the automatic title, which is the layer's real name
       until one is typed, so it reads as a name and not as a grey hint. */
    .name-sec .sec-h input[type=text]::placeholder { color: var(--wa-ink); opacity: 1; }
    /* Each card's "?": quiet until the header is hovered, lit while its help
       is showing. A touch screen has no hover, so there it always shows. */
    button.sec-help {
      flex: none; width: 20px; height: 20px; padding: 0; border-radius: 50%; cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 700; line-height: 1; display: grid; place-items: center;
      border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted);
      opacity: 0; transition: opacity .12s ease-out, color .12s ease-out, border-color .12s ease-out;
    }
    .sec-h:hover button.sec-help, button.sec-help:focus-visible, button.sec-help.on { opacity: 1; }
    button.sec-help:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.sec-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.sec-help.on { color: var(--wa-ink); background: var(--wa-raise); border-color: transparent; }
    @media (hover: none) { button.sec-help { opacity: 1; } }
    /* A card's ··· menu, for its rare actions. The card clips its corners,
       so it lets the menu out while the menu is open. */
    .sec.menu-open { overflow: visible; }
    .sec-menu { position: relative; flex: none; display: inline-flex; }
    button.sec-more {
      height: 20px; padding: 0 5px; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 700; line-height: 1; letter-spacing: .04em;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted);
    }
    button.sec-more:hover, button.sec-more.on { color: var(--wa-ink); border-color: var(--wa-line-strong); }
    button.sec-more:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .sec-menu .pop-menu { min-width: 160px; cursor: default; }
    .sec-menu .pop-menu .row:disabled { opacity: .45; cursor: default; background: transparent; }
    /* Help text waits behind that "?". A plain hint shows only while its
       card's help is on; a warning, an error, or a hint marked keep (a status,
       an empty state, a step that is required) always shows. A value popover
       keeps its hints, since it has no "?" of its own to ask with. */
    .sec[data-help="off"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { display: none; }
    /* Shown help is quiet text, not a box: italic and muted, so a card with a
       sentence under every row still reads as one form (Jesse, 2026-09-16). */
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 0 2px; font-style: italic; color: var(--wa-muted);
    }
    /* An open card with no help text in it has nothing for its "?" to show. */
    .sec[data-open="true"][data-help="off"]:not(:has(> .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint))) button.sec-help { display: none; }
    /* Inspector: header Add, a card's less used rows, paired rows, how-to card, footer. */
    /* A shut card's Add, such as Rules': it makes something, so it wears the
       green lit outline every Add button does. */
    .sec-h button.sec-act {
      --c: var(--wa-hue-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-go-mid);
      flex: none; min-height: 22px; padding: 0 8px 0 6px; font-size: 12px; gap: 3px; border-radius: 6px;
      ${W}
    }
    .sec-h button.sec-act:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${W} }
    .sec-h button.sec-act svg.ui-icon { width: 11px; height: 11px; }
    .more-fold { margin: 6px -10px 0; padding: 0 10px; border-top: 1px solid var(--wa-line); }
    .more-body { padding-top: 6px; }
    .more-body > .hint { margin: 2px 0 6px var(--wa-col); }
    /* The Position card's align buttons: a head line ("Align" at one end,
       what they line up to at the other) over one row of small glyph
       buttons, a thin rule between the across group and the up and down
       one. The buttons share the row evenly, so seven still fit a 328px
       inspector at about 34px each. */
    .align-field { display: flex; flex-direction: column; gap: 6px; padding: 3px 0; min-width: 0; }
    .align-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--wa-label, var(--wa-muted)); }
    .align-head .align-to { color: var(--wa-muted); }
    .align-head .align-to { white-space: nowrap; }
    .align-row { display: flex; align-items: stretch; gap: 4px; min-width: 0; margin-left: var(--wa-col); }
    .align-row button.align {
      flex: 0 1 34px; min-width: 0; height: 28px; padding: 0; border: 1px solid var(--wa-line-strong); border-radius: 6px; cursor: pointer;
      display: grid; place-items: center; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out;
    }
    .align-row button.align:hover:not(:disabled) { background: var(--wa-hover); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .align-row button.align:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .align-row button.align svg.ui-icon { width: 17px; height: 17px; }
    .align-row .align-sep { flex: none; width: 1px; margin: 4px 5px; background: var(--wa-line-strong); }
`,Xr={topBar:Ve,picker:We,helpButton:Ie,columns:qe,card:je,rows:Ue,rowsTail:Ne,leftCards:Fe,leftCardsTail:Be,groundCap:Ke,richRows:Ge,canvasColumn:Je,popMenu:Ze,tintDot:Xe,sharedValueRows:Ye,canvasHead:Qe,canvasHeadTail:et,stage:tt,stageTools:at,stageToolsTail:rt,valuesFoot:nt,inspectorHead:ot,sectionCard:it,sectionCardTail:st},Yr=l`${Ve}${We}${Ie}`,Qr=l`${qe}${je}`,en=l`${Fe}${Be}${Ze}`,tn=l`${Ue}${Ne}${Ke}${Ge}${Ye}`,an=l`${Je}${Xe}${Qe}${et}${tt}${at}${rt}${nt}${Mt}`,rn=l`${ot}${it}${st}`;function nn(t,e){let{open:a,onToggle:r}=t;return b`<section class="sec" data-sec=${t.id??p} data-open=${a?"true":"false"} data-help="on" style=${`--c:${t.color}`}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"} @click=${r}
      @keydown=${n=>{n.target===n.currentTarget&&(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),r())}}>
      <span class="swatch">${t.icon}</span>
      <span class="tt"><h4>${t.title}${t.tag??p}${t.dot?b`<span class="sec-dot" aria-hidden="true"></span>`:p}</h4>${t.summary?b`<span class="sum">${t.summary}</span>`:p}</span>
      <span class="chev">${Oe("chevron")}</span>
    </div>
    ${a?b`<div class="sec-b">${t.help?b`<p class="hint">${t.help}</p>`:p}${e}</div>`:p}
  </section>`}function ln(t,e,a){let r=a-e,n=r>0&&Number.isFinite(t)?(t-e)/r:0;return`--p:${Math.round(Math.max(0,Math.min(1,n))*1e3)/10}%`}var Ct=l`
    /* Buttons: one quiet neutral shape everywhere, the ink fill kept for the
       single action that matters, and a soft ring on focus instead of a hard
       outline. No button is filled with a hue. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 11px; min-height: 28px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled) { border-color: transparent; background: var(--wa-hover); }
    button.small:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); background: var(--wa-hover); }
    button.small:where(:not(.primary, .danger)) { border-color: var(--wa-line-strong); }
    .toolbar button:focus-visible, button.primary:focus-visible, button.small:focus-visible, button.danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; font-weight: 600; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }
    /* The quiet third button: no fill, no ring, just muted words. */
    button.ghost {
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; padding: 0 9px; min-height: 26px; border-radius: 8px;
      background: transparent; border: 1px solid transparent; color: var(--wa-muted);
    }
    button.ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
    button.ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.ghost.danger { color: var(--error-color, #b42318); background: transparent; border-color: transparent; }
    /* Save is the header's one call to action. It is quiet while there is
       nothing to save. Once there is something and it can be saved, it is
       solid palette green with a soft, still green glow, so it is the one
       thing in the bar asking to be pressed. The words are --wa-chip-ink,
       white on the light skin's deep green and black on the dark skin's
       bright one, which clears 4.5:1 in both. Unsaved but not savable yet
       (no slot, a refusal, mid-save) keeps the amber halo it had. The
       Watch settings page's Save carries the same two classes and so the
       same green, through the unscoped rule. */
    header button.save, .wa-bar button.save { min-height: 28px; height: 28px; padding: 0 12px; }
    header button.save:not(.dirty), .wa-bar button.save:not(.dirty) { background: var(--wa-card); color: var(--wa-faint); border-color: var(--wa-line-strong); opacity: 1; }
    header button.save.dirty, .wa-bar button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #e0a100) 35%, transparent); }
    button.primary.save.dirty:not(:disabled) {
      --wa-save-glow: 0 0 0 1px color-mix(in srgb, var(--wa-hue-green) 45%, transparent), 0 0 12px 1px color-mix(in srgb, var(--wa-hue-green) 40%, transparent);
      background: var(--wa-hue-green); color: var(--wa-chip-ink); border-color: transparent; box-shadow: var(--wa-save-glow);
    }
    button.primary.save.dirty:not(:disabled):hover { background: color-mix(in srgb, var(--wa-hue-green) 88%, var(--wa-ink)); }
    button.primary.save.dirty:not(:disabled):focus-visible { box-shadow: var(--wa-ring), var(--wa-save-glow); }
    /* A moment after a save landed: "✓ Saved" in green, then plain Save. */
    header button.save.flash, .wa-bar button.save.flash {
      color: var(--wa-hue-green); border-color: color-mix(in srgb, var(--wa-hue-green) 60%, transparent);
      transition: color .2s ease-out, border-color .2s ease-out;
    }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 0 9px; font-size: 13px; min-height: 26px; border-radius: 6px; }
    button.small.lined { border-color: var(--wa-line-strong); }
    button.small.lined:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    /* An icon and its words on one line. Without this the icon, drawn as a
       block, sits on a line of its own above the words. */
    button.small:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 5px; }
    button.small > svg.ui-icon { width: 13px; height: 13px; flex: none; }
    /* An Extras switch whose layer is already on the chart: pressed, not greyed.
       Clicking it again takes the layer off. */
    .adders button.small.on, .adders button.small.on:disabled { display: inline-flex; align-items: center; gap: 5px; opacity: 1;
      color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-raise); }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: var(--wa-muted);
      display: inline-flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; padding: 0; border-radius: 6px; opacity: .8;
      transition: background-color .12s ease-out, opacity .12s ease-out;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    button.icon:focus-visible { opacity: 1; outline: none; box-shadow: var(--wa-ring); }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #e5484d); background: color-mix(in srgb, var(--error-color, #e5484d) 14%, transparent); }
    svg.ui-icon { width: 15px; height: 15px; display: block; }

    /* Native controls: one field-grey well; a select wears a hairline so it reads
       as a box that opens, brighter under the pointer, with a neutral ring on focus, so a select in the header and
       a number field in the inspector read as one family. */
    select {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 28px;
      padding: 0 26px 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 28px;
      padding: 4px 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-input);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    input[type=text]:hover:not(:disabled), input[type=number]:hover:not(:disabled), textarea:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    input[type=text]:focus-visible, input[type=number]:focus-visible, input[type=search]:focus-visible, textarea:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input::placeholder, textarea::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
    /* A box that is the one thing left to do. An empty Custom SVG layer draws
       nothing at all, and a field that looks like every other field does not
       say so: the dashed accent border points at where to paste before the
       hint under it is read. The tint goes as soon as something lands. */
    input.needs, textarea.needs {
      border-color: color-mix(in srgb, var(--wa-accent) 60%, var(--wa-line));
      border-style: dashed;
      background: color-mix(in srgb, var(--wa-accent) 8%, var(--wa-input));
    }
    input.needs:focus-visible, textarea.needs:focus-visible { border-style: solid; }
    /* Every checkbox is a switch: a pill that slides, since a tick box is the
       one control that still looked like a form from 2009. Grey in every
       card, never the card's hue: light grey when on, dark grey when off,
       with a white knob either way. */
    input[type=checkbox] {
      appearance: none; -webkit-appearance: none; margin: 0; cursor: pointer; flex: none;
      width: 32px; height: 18px; border-radius: 999px; position: relative;
      background: var(--wa-switch-off); border: 0;
      transition: background-color .15s ease-out, border-color .15s ease-out;
    }
    input[type=checkbox]::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
      background: #fff; box-shadow: var(--wa-seg-shadow); transition: transform .15s ease-out;
    }
    input[type=checkbox]:checked { background: var(--wa-switch-on); border-color: transparent; }
    input[type=checkbox]:checked::after { transform: translateX(14px); }
    input[type=checkbox]:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input[type=checkbox]:disabled { opacity: .45; cursor: default; }
    /* A slider: a thin grey track filled to the value in a lighter grey, and
       a white knob with a ring of the ground it sits on and a thin grey edge.
       The fill needs the value as a percent in --p, which the slider's own
       markup writes; Firefox draws it from the value itself. */
    input[type=range] {
      -webkit-appearance: none; appearance: none; height: 18px; margin: 0; padding: 0; cursor: pointer;
      background: transparent; accent-color: var(--wa-range-fill);
    }
    input[type=range]::-webkit-slider-runnable-track {
      height: 6px; border-radius: 3px;
      background: linear-gradient(var(--wa-range-fill), var(--wa-range-fill)) 0 0 / var(--p, 0%) 100% no-repeat, var(--wa-range-track);
    }
    input[type=range]::-moz-range-track { height: 6px; border-radius: 3px; background: var(--wa-range-track); }
    input[type=range]::-moz-range-progress { height: 6px; border-radius: 3px; background: var(--wa-range-fill); }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none; box-sizing: border-box; width: 18px; height: 18px; margin-top: -6px; border-radius: 50%;
      background: #fff; border: 2px solid var(--wa-range-ring, var(--wa-card)); box-shadow: 0 0 0 1.5px var(--wa-range-outline);
    }
    input[type=range]::-moz-range-thumb {
      box-sizing: border-box; width: 18px; height: 18px; border-radius: 50%;
      background: #fff; border: 2px solid var(--wa-range-ring, var(--wa-card)); box-shadow: 0 0 0 1.5px var(--wa-range-outline);
    }
    input[type=range]:focus-visible { outline: none; }
    input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 1.5px var(--wa-range-outline), 0 0 0 4px color-mix(in srgb, var(--wa-accent) 40%, transparent); }
    input[type=range]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 1.5px var(--wa-range-outline), 0 0 0 4px color-mix(in srgb, var(--wa-accent) 40%, transparent); }
    input[type=range]:disabled { opacity: .45; cursor: default; }
    input[type=color] { border: 1px solid var(--wa-line); border-radius: 6px; background: var(--wa-input); padding: 2px; cursor: pointer; }
`,Tt=l`
    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg {
      display: inline-flex; flex: none; height: 24px; padding: 2px; gap: 2px; border: 0;
      border-radius: 6px; background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 0 6px; min-width: 22px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out, box-shadow .12s ease-out;
    }
    .seg button:hover { color: var(--wa-ink); }
    .seg button.on { color: var(--wa-ink); background: var(--wa-seg-on); box-shadow: var(--wa-seg-shadow); outline: 1px solid color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); outline-offset: -1px; }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 13px; height: 13px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line. The lit choice is a raised grey, never a hue. */
    .seg.wide { display: flex; width: 100%; min-width: 0; height: 28px; border-radius: 6px; background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 0 4px; border-radius: 5px;
      font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 24px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
      color: var(--wa-ink);
    }
    .seg.wide button.on { color: var(--wa-ink); font-weight: 600; background: var(--wa-seg-on); box-shadow: var(--wa-seg-shadow); outline: 1px solid color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); outline-offset: -1px; }
    /* The choice a setting falls back to while it has none of its own. */
    .seg.wide button.inh { color: var(--wa-ink); outline: 1px dashed var(--wa-muted); outline-offset: -3px; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
    .seg.wide button:disabled, .seg.wide button:disabled:hover { color: var(--wa-muted); opacity: .38; cursor: not-allowed; }
    .field.seg-field { align-items: center; }
`,Ht=l`
    /* The reset dot. One control, two places: in the gutter left of a changed
       setting's title, and beside a card's title for everything the card owns.
       It is drawn only while something is away from its default, so the dots
       are the list of what someone changed. The pseudo-element widens the hit
       area without widening the dot. */
    /* The dot wears the hue of the card it is in (--wa-sec, which a section
       card sets), one of the three places a card's hue shows. */
    button.reset-dot {
      position: absolute; left: -7px; top: 12.5px; width: 5px; height: 5px; margin: 0; padding: 0;
      border: 0; border-radius: 50%; background: var(--wa-sec, var(--wa-accent)); cursor: pointer; flex: none;
    }
    button.reset-dot::after { content: ""; position: absolute; inset: -7px; }
    button.reset-dot:hover, button.reset-dot:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-sec, var(--wa-accent)) 32%, transparent); }
`,St=l`
    button.link { font: inherit; background: none; border: none; color: var(--wa-accent); cursor: pointer; padding: 0; }
    /* A watch editor's "Start fresh instead" while the iPhone's move may
       still come: small and quiet, under the waiting line. */
    button.link.start-fresh { align-self: flex-start; font-size: 13px; color: var(--wa-muted); text-decoration: underline; text-underline-offset: 2px; }
    button.link.start-fresh:hover:not(:disabled) { color: var(--wa-label, var(--wa-muted)); }
    button.link.start-fresh:disabled { opacity: 0.5; cursor: default; }
`,Rt=l`
    /* Form rows, the way a property sheet reads: the title in a fixed column
       on the left, the control on the right, one row per setting and every
       row at least 30px, so a card reads as an even list rather than a form.
       Contexts that lay fields out another way (the dialogs, the bars under
       the preview) set their own display over this. */
    .field {
      position: relative; display: grid; grid-template-columns: var(--wa-lab) minmax(0, 1fr); align-items: center;
      gap: 4px 8px; min-height: 30px; margin: 0; font-size: 12px;
    }
    .field > span { color: var(--wa-label, var(--wa-muted)); font-size: 12px; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
    .field > span.changed { color: var(--wa-ink); }
    /* A number's title drags the number. */
    .field > span.scrub { cursor: ew-resize; user-select: none; -webkit-user-select: none; touch-action: none; }
    .field > span.scrub:hover { color: var(--wa-accent); }
    /* So does an idle number box; one being typed in keeps its text cursor. */
    input[data-scrub]:not(:focus):not(:disabled) { cursor: ew-resize; touch-action: pan-y; }
    input[data-scrub].scrubbing { user-select: none; -webkit-user-select: none; }
    .field input[type=text], .field input[type=number], .field select, .field textarea { width: 100%; min-width: 0; }
    /* The controls in an inspector row: 26px, 12px text, a soft fill and no
       ring until hovered, so a card of twenty rows is not twenty boxes. */
    :is(.sec-b, .value-pop) .field :is(input[type=text], input[type=number], input[type=time], select) {
      height: 28px; min-height: 28px; padding: 0 9px; font-size: 13px; border-radius: 6px;
      border-color: var(--wa-line-strong); background-color: var(--wa-field);
    }
    :is(.sec-b, .value-pop) .field select { padding-right: 22px; background-position: right 6px center; background-size: 12px; }
    :is(.sec-b, .value-pop) .field textarea { font-size: 12px; padding: 5px 8px; border-radius: 6px; border-color: var(--wa-line-strong); background: var(--wa-field); }
    :is(.sec-b, .value-pop) .field input[type=number] { -moz-appearance: textfield; appearance: textfield; }
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-inner-spin-button,
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    :is(.sec-b, .value-pop) .field .ent-box input { padding-left: 28px; padding-right: 26px; }
    /* Focus is neutral, in a section card as anywhere else. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .field:has(> textarea) { align-items: start; }
    .field:has(> textarea) > span { padding-top: 6px; }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* A unit drawn faint inside the number box, after the number. */
    .num-box { position: relative; display: flex; align-items: center; min-width: 0; }
    .num-box input[type=number] { flex: 1; font-variant-numeric: tabular-nums; }
    .num-box input[type=number],
    :is(.sec-b, .value-pop) .field .num-box input[type=number] { padding-right: calc(10px + var(--wa-unit, 1) * 7px); }
    .num-box .unit { position: absolute; right: 8px; font-size: 11px; color: var(--wa-muted); opacity: .8; pointer-events: none; }
    /* A glyph before the number, such as the link on a size a part inherits. */
    .num-box .lead { position: absolute; left: 7px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .num-box .lead svg.ui-icon { width: 12px; height: 12px; }
    .num-box.lead input[type=number],
    :is(.sec-b, .value-pop) .field .num-box.lead input[type=number] { padding-left: 24px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 50px; height: 18px; margin: 0; }
    .field.slider .slider-row > :is(.num-box, input[type=number]) { flex: none; width: 66px; }
    .field.slider .slider-row > :is(.num-box, input[type=number]):only-child { flex: 1; width: auto; }
    /* A switch is a row like any other: title left, switch at the start of
       the control column. */
    .field.check { cursor: pointer; }
    .field.check > input[type=checkbox] { justify-self: start; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    /* The entity search and the value chip are rows like any other. The line
       under the search box stays in the control column; the result list takes
       the whole width, since its rows carry a name, a room and a state. */
    .field.entity-field > :not(:first-child) { grid-column: 2; }
    /* Entity 1, Entity 2 sit in rows with a remove button, and still start
       their box at the same x as every other row in the card. */
    .row-inline .field.entity-field { grid-template-columns: var(--wa-lab) minmax(0, 1fr); gap: 4px 8px; }
    .field.value-chip-field > button.value-chip:first-child { grid-column: 1 / -1; }
    /* A color is one box: swatch, hex, and opacity in percent. */
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-box {
      flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 0 0 6px;
      border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
    }
    .color-box:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .color-box:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .color-box:has(input:disabled) { opacity: .5; }
    .color-swatch {
      position: relative; flex: none; width: 18px; height: 18px; border-radius: 50%; overflow: hidden; cursor: pointer;
      background: linear-gradient(var(--sw), var(--sw)), repeating-conic-gradient(#c8c8c8 0 25%, #fff 0 50%) 0 0 / 8px 8px;
      box-shadow: inset 0 0 0 1px rgba(128,128,128,.45);
    }
    .color-swatch input[type=color] { position: absolute; inset: -6px; width: auto; height: auto; opacity: 0; cursor: pointer; border: 0; padding: 0; }
    :is(.color-row, .band-row) .color-box :is(input.hex, .alpha input) {
      height: 24px; min-height: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; font-size: 12px;
    }
    :is(.color-row, .band-row) .color-box input.hex { flex: 1; min-width: 0; padding: 0; text-transform: uppercase; }
    .band-row .color-box input.hex { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    :is(.color-row, .band-row) .color-box .alpha { flex: none; width: 50px; border-left: 1px solid var(--wa-line); }
    :is(.color-row, .band-row) .color-box .alpha input { width: 100%; padding: 0 18px 0 4px; text-align: right; }
    :is(.color-row, .band-row) .color-box :is(input.hex, .alpha input):focus-visible { box-shadow: none; outline: none; }
    /* Outside a .field row the browser's own spin arrows would eat the
       opacity box and clip "100" to "10". */
    .color-box .alpha input { -moz-appearance: textfield; appearance: textfield; }
    .color-box .alpha input::-webkit-inner-spin-button,
    .color-box .alpha input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    /* A gradient's bar: the gradient itself, with one chip per stop sitting on
       it where that stop is. The checkerboard behind it shows transparency, the
       same way a color swatch does. */
    .fill-bar {
      position: relative; flex: 1; min-width: 0; height: 22px; border-radius: 6px;
      background: var(--g), repeating-conic-gradient(#c8c8c8 0 25%, #fff 0 50%) 0 0 / 8px 8px;
      box-shadow: inset 0 0 0 1px rgba(128,128,128,.45); touch-action: none;
    }
    .fill-chip {
      position: absolute; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px;
      border-radius: 50%; cursor: ew-resize; touch-action: none;
      background: var(--sw); box-shadow: 0 0 0 1.5px #fff, 0 0 0 2.5px rgba(0,0,0,.45);
    }
    .fill-stop-n { flex: none; width: 14px; font-size: 11px; opacity: .65; text-align: center; }
`,Lt=l`
    /* Pairs and quads stack: each field is its own label-left row. */
    .grid2, .grid4 { display: block; }
    /* Two short choices on one row, the second titled in line. */
    .pair-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .pair-row > .seg.wide:first-of-type { flex: 1 1 auto; width: auto; }
    .pair-row > .seg.wide:last-of-type { flex: 0 0 64px; width: 64px; }
    .pair-row > span { position: relative; flex: none; padding-left: 8px; color: var(--wa-label, var(--wa-muted)); font-size: 12px; }
    .pair-row > span.changed { color: var(--wa-ink); }
    .pair-row > span button.reset-dot { left: -2px; top: 50%; margin-top: -3px; }
    /* A gauge's Min or Max: the title, then the one control the Number or
       Entity switch picks, then that switch at the end of the same row. */
    .field.gauge-end { grid-template-columns: var(--wa-lab) minmax(0, 1fr) auto; }
    .gauge-end-head { display: contents; }
    .gauge-end-head > .seg { grid-column: 3; grid-row: 1; height: 24px; }
    .field.gauge-end > :not(.gauge-end-head) { grid-column: 2; grid-row: 1; margin: 0; }
    /* A table row of fields: short titles in line, no title column. */
    .row-inline { display: flex; align-items: center; gap: 8px; }
    .row-inline .field { flex: 1; min-width: 0; grid-template-columns: auto minmax(0, 1fr); gap: 6px; }
    .row-inline > button.icon { flex: none; }
    /* A narrow inspector (a column dragged in, or a small window) stacks each
       row: the title on its own line and the control under it at full width,
       instead of squeezing the control into what is left beside an 88px
       title. A switch needs no width, so it keeps its title beside it. The
       value popover keeps its own label-left rows. */
    @container insp (max-width: 360px) {
      .insp-body { --wa-col: 0px; }
      .insp-body .value-pop { --wa-col: calc(var(--wa-lab) + 8px); }
      .sec-b .field:not(.value-pop *, .row-inline *) { grid-template-columns: minmax(0, 1fr); gap: 4px; min-height: 0; padding: 3px 0; }
      .sec-b .field:not(.value-pop *, .row-inline *) > * { grid-column: 1 / -1; }
      .sec-b .field:not(.value-pop *, .row-inline *) > span:first-child { padding-top: 0; }
      .sec-b .field.check:not(.value-pop *, .row-inline *) { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; }
      .sec-b .field.check:not(.value-pop *, .row-inline *) > * { grid-column: auto; }
      .sec-b .field.gauge-end:not(.value-pop *) { grid-template-columns: minmax(0, 1fr) auto; }
      .sec-b .field.gauge-end:not(.value-pop *) > .gauge-end-head > :first-child { grid-column: 1; grid-row: 1; align-self: center; }
      .sec-b .field.gauge-end:not(.value-pop *) > .gauge-end-head > .seg { grid-column: 2; grid-row: 1; }
      .sec-b .field.gauge-end:not(.value-pop *) > :not(.gauge-end-head) { grid-column: 1 / -1; grid-row: 2; }
      .sec-b .readout-v { padding-top: 0; }
      /* Choices wrap onto a second line rather than clip to "A…". */
      .sec-b .seg.wide { height: auto; min-height: 28px; flex-wrap: wrap; }
      .sec-b .seg.wide button { flex: 1 0 auto; text-overflow: clip; }
      .sec-b .pair-row { flex-wrap: wrap; row-gap: 4px; }
      .sec-b .pair-row > .seg.wide:first-of-type { flex: 1 1 100%; }
    }
    .hint { font-size: 12px; line-height: 1.45; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    /* The one hint that is colored: a timed refresh is spending the redraw
       budget a tap on the face also needs, which is worth noticing. */
    .hint.budget { color: var(--warning-color, #ffa600); }
    /* The Auto refresh warning: its one amber line and a Why? button on the
       same row, and the reasons under them, in plain muted text, once opened. */
    .budget-why { margin: 4px 0; min-width: 0; }
    .budget-why > summary {
      display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; cursor: pointer; list-style: none;
    }
    .budget-why > summary::-webkit-details-marker { display: none; }
    .budget-why > summary > .hint { margin: 0; flex: 0 1 auto; min-width: 0; overflow-wrap: anywhere; }
    .budget-why > summary:focus-visible { outline: none; }
    .budget-why > summary:focus-visible > .why-btn { box-shadow: var(--wa-ring); }
    .why-btn {
      display: inline-flex; align-items: center; flex: none; box-sizing: border-box; min-height: 20px; padding: 0 7px;
      border-radius: 5px; font-size: 11.5px; font-weight: 600; line-height: 1;
      color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong);
    }
    .budget-why > summary:hover > .why-btn, .budget-why[open] > summary > .why-btn { background: var(--wa-hover); }
    .budget-why > .hint { margin: 6px 0 0; overflow-wrap: anywhere; }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the color. */
    .hint.err { color: var(--error-color, #db4437); }
    /* A template box's recipes: small buttons in the value column, wrapping
       under each other rather than under the label. The
       one the box holds shows as chosen, like a page tile's Examples. */
    .tpl-box { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .tpl-recipes { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; min-width: 0; }
    .tpl-recipes-row { align-items: start; }
    .tpl-recipes-row > span { padding-top: 5px; }
    .tpl-recipes button.small { min-height: 24px; padding: 0 8px; font-size: 12px; }
    .tpl-recipes button.small.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .tpl-asks { color: var(--wa-ink); }
    .tpl-box textarea.tpl-err, .tpl-box textarea.tpl-err:focus {
      border-color: var(--error-color, #db4437); box-shadow: 0 0 0 1px var(--error-color, #db4437);
    }
`,zt=l`
    /* Entity search, laid out the way Home Assistant's own entity list is: a
       glyph for the domain, the friendly name in full, and the things that
       tell two similar names apart (the room and the id) on a quieter second
       line. The type and the live state sit right, where the eye can run down
       one column instead of hunting.

       The glyph is the panel's own drawing, not Home Assistant's icon set, so
       a row still has a picture whatever the frontend ships. It only takes the
       accent color when the entity is doing something, which is what makes
       the one light that is on findable in a list of forty. */
    .entity-field { position: relative; }
    .ent-box { position: relative; display: flex; align-items: center; }
    .ent-box input { width: 100%; min-width: 0; padding-left: 32px; padding-right: 30px; color: var(--wa-ent); font-weight: 500; }
    .ent-box .ent-glass { position: absolute; left: 10px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .ent-box .ent-glass svg { width: 14px; height: 14px; display: block; }
    .ent-box.open .ent-glass { color: var(--wa-accent); }
    /* A layer that can draw nothing until it names an entity: a chart on
       recorded history, a timeline, a picture. The empty box wears a ring in
       the entity color and keeps pulsing, so "why is my layer blank?" is
       marked where the answer gets typed. It runs without end on purpose: a
       finite pulse fires once on the first paint and never again, so anyone
       who looked away, opened another layer and came back found a plain box
       and no answer. The ring and the pulse both go the moment an id lands. */
    .ent-box.needs { border-radius: 8px; animation: wa-needs-pulse 1.8s ease-out infinite; }
    .ent-box.needs input { border-color: color-mix(in srgb, var(--wa-ent) 60%, var(--wa-line)); }
    .ent-box.needs .ent-glass { color: var(--wa-ent); }
    @keyframes wa-needs-pulse {
      0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--wa-ent) 55%, transparent); }
      70% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--wa-ent) 0%, transparent); }
      100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--wa-ent) 0%, transparent); }
    }
    /* A stand-in from a shared design, in the "pick entity" red, pulsing for
       the same reason the empty box does: it is the answer to "why does this
       layer look wrong?", marked where the answer goes. The shared value row
       that reads one wears the same pulse while a layer reading it is picked. */
    /* It opens with a bright flash, three hard beats of a thick ring, a wide
       halo and a red wash, to pull the eye across the screen, then settles
       into the quiet pulse. A click on the layer plays the flash again. */
    .ent-chosen.slot, .value-chip.slot { border-radius: 8px; box-shadow: inset 0 0 0 1px var(--wa-need); animation: wa-slot-flash .6s ease-out 3, wa-slot-pulse 1.8s ease-out 1.8s infinite; }
    .vrow.slot-lit { border-radius: 6px; animation: wa-slot-flash .6s ease-out 3, wa-slot-pulse 1.8s ease-out 1.8s infinite; }
    .column.inspector.slot-via-value :is(.ent-chosen, .value-chip).slot { animation: none; box-shadow: none; }
    .hint.need { color: var(--wa-need); }
    @keyframes wa-slot-flash {
      0% { background-color: color-mix(in srgb, var(--wa-need) 32%, transparent);
        box-shadow: inset 0 0 0 2px var(--wa-need), 0 0 0 0 color-mix(in srgb, var(--wa-need) 90%, transparent), 0 0 18px 2px color-mix(in srgb, var(--wa-need) 60%, transparent); }
      100% { background-color: color-mix(in srgb, var(--wa-need) 6%, transparent);
        box-shadow: inset 0 0 0 2px var(--wa-need), 0 0 0 10px color-mix(in srgb, var(--wa-need) 0%, transparent), 0 0 18px 2px color-mix(in srgb, var(--wa-need) 0%, transparent); }
    }
    @keyframes wa-slot-pulse {
      0% { box-shadow: inset 0 0 0 1px var(--wa-need), 0 0 0 0 color-mix(in srgb, var(--wa-need) 55%, transparent); }
      70% { box-shadow: inset 0 0 0 1px var(--wa-need), 0 0 0 7px color-mix(in srgb, var(--wa-need) 0%, transparent); }
      100% { box-shadow: inset 0 0 0 1px var(--wa-need), 0 0 0 0 color-mix(in srgb, var(--wa-need) 0%, transparent); }
    }
    @media (prefers-reduced-motion: reduce) { .ent-chosen.slot, .value-chip.slot, .vrow.slot-lit { animation: none; box-shadow: inset 0 0 0 2px var(--wa-need); } }
    @media (prefers-reduced-motion: reduce) { .column.inspector.slot-via-value :is(.ent-chosen, .value-chip).slot { box-shadow: none; } }
    /* A chosen entity: one row in place of the search box, exactly as tall as
       the box, so the label beside it and the rows under it never move when
       one swaps for the other. The name reads in the ordinary ink, the id
       after it is the quiet half and is cut first, the state sits right. The
       row is the edit target; the x beside it removes the entity. */
    .ent-anchor { position: relative; min-width: 0; }
    .ent-chosen {
      display: flex; align-items: center; height: 28px; min-width: 0; border-radius: 6px;
      background: var(--wa-field); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ent) 22%, transparent);
    }
    .ent-chosen:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ent) 50%, transparent); }
    button.ent-pick {
      flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 7px;
      font: inherit; font-size: 12px; text-align: left; padding: 0 8px 0 4px; border: 0; border-radius: 6px;
      background: none; color: var(--wa-ink); cursor: pointer;
    }
    button.ent-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .ent-pick .ent-ico { width: 18px; height: 18px; border-radius: 4px; background: color-mix(in srgb, var(--wa-ent) 16%, transparent); color: var(--wa-ent); }
    .ent-pick .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 30%, transparent); }
    .ent-pick .ent-ico svg { width: 11px; height: 11px; }
    .ent-pick .ent-name { flex: 0 1 auto; min-width: 3em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
    .ent-pick .ent-id { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--wa-muted); }
    .ent-pick .ent-state { flex: none; max-width: 35%; margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    button.ent-clear {
      flex: none; width: 24px; height: 24px; margin-right: 1px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 5px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.ent-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.ent-clear svg { width: 12px; height: 12px; display: block; }

    .entity-results {
      border: 1px solid var(--wa-line); border-radius: 10px; margin-top: 6px; max-height: 340px; overflow: auto;
      background: var(--wa-raised); padding: 4px; box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    /* In an inspector card the list floats over the rows under the box, like
       any dropdown, rather than pushing the card taller. The card clips its
       rounded corners, so it stops clipping while a search is open. Dialogs
       and the value popover keep the list in the flow, where a float would
       be cut off at their own edge. */
    .sec:has(.ent-box.open) { overflow: visible; }
    .sec-b .ent-anchor:not(.value-pop *) > .entity-results {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 40; margin: 0;
      background: var(--wa-card); border-color: var(--wa-line-strong, var(--wa-line));
      box-shadow: 0 14px 36px rgba(0,0,0,.45);
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
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: var(--wa-ink); }
    .ent .ent-sub { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; }
    .ent .ent-area { flex: none; color: var(--wa-muted); }
    /* The room and the id are one line, and the id is the half that may be
       cut: the room is short and the id's tail is the least useful part. */
    .ent .ent-area + .ent-id::before { content: "·"; margin-right: 6px; opacity: .5; }
    .ent .ent-id { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-muted); }
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
      display: flex; gap: 6px; align-items: center; font-size: 12px; margin: 0 0 2px;
      padding: 3px 8px 3px 4px; border-radius: 6px;
      border: 1px solid color-mix(in srgb, var(--wa-ent) 28%, var(--wa-line)); background: var(--wa-ent-bg);
    }
    .entity-current .ent-ico { width: 20px; height: 20px; border-radius: 5px; background: color-mix(in srgb, var(--wa-ent) 18%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 28%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico svg { width: 12px; height: 12px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); font-weight: 600; }
    .entity-current .ent-area { flex: none; color: var(--wa-muted); }
    .entity-current .ent-state { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* The two tokens, wherever a run of ordinary prose has to name an entity
       or print what it reads. Everything that shows a live value ends up
       here, so the color never has to be repeated by hand. */
    .ent-tok { color: var(--wa-ent); font-weight: 600; }
    .val-tok, .entity-current .ent-state, .ent-pick .ent-state, .vchip .val, .chart-numbers b, .hint .nums, .readout-v .nums {
      color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em;
    }

    /* Icon field, drawn the way Home Assistant draws its own: a box showing
       the chosen glyph and its name, with a caret, and a list that drops
       open under it. The list spans the whole row, label column included,
       and sits in the flow rather than floating, so no card or popover can
       cut it off. The box is the height of a text box, so the label beside
       it and the rows under it never move when one swaps for the other. */
    .field.sym-field.no-label { grid-template-columns: minmax(0, 1fr); }
    .sym-line-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .sym-box {
      flex: 1; min-width: 0; display: flex; align-items: center; height: 30px; border-radius: 7px;
      background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
      transition: box-shadow .12s ease-out;
    }
    .sym-box:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .sym-box.open { box-shadow: inset 0 0 0 1px var(--wa-accent), var(--wa-ring); }
    button.sym-pick {
      flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 8px;
      font: inherit; font-size: 12.5px; text-align: left; padding: 0 8px 0 4px; border: 0; border-radius: 7px;
      background: none; color: var(--wa-ink); cursor: pointer;
    }
    button.sym-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .sym-now {
      flex: none; width: 22px; height: 22px; border-radius: 5px; display: grid; place-items: center;
      background: color-mix(in srgb, var(--wa-ink) 9%, transparent); color: var(--wa-ink);
    }
    .sym-now svg { width: 16px; height: 16px; display: block; }
    .sym-now svg path { fill: currentColor; fill-opacity: 1; }
    .sym-now.none { color: var(--wa-muted); }
    /* The icon's own color, when one is chosen, on the glyph in the box and on
       every glyph in the list, so the pick is seen the way the watch draws it. */
    .sym-field.tinted .sym-now:not(.none), .sym-field.tinted .sym-glyph { color: var(--sym-tint); }
    .sym-field.tinted button.sym .sym-glyph { opacity: 1; }
    .sym-now.none svg.ui-icon { width: 13px; height: 13px; }
    .sym-now.none svg.ui-icon path { fill: none; }
    .sym-now-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sym-now-name.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .sym-now-name.empty { color: var(--wa-muted); }
    .sym-caret { flex: none; display: grid; place-items: center; color: var(--wa-muted); transition: transform .12s ease-out; }
    .sym-caret svg { width: 13px; height: 13px; display: block; }
    .sym-box.open .sym-caret { transform: rotate(180deg); color: var(--wa-accent); }
    button.sym-clear {
      flex: none; width: 24px; height: 24px; margin-right: 3px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 5px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.small.sym-source { flex: none; height: 30px; padding: 0 10px; font-size: 12px; white-space: nowrap; }
    button.sym-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.sym-clear svg { width: 12px; height: 12px; display: block; }
    .sym-field > .sym-menu {
      grid-column: 1 / -1; margin: 2px 0 4px; padding: 8px; border-radius: 10px;
      border: 1px solid var(--wa-line-strong, var(--wa-line)); background: var(--wa-raised, var(--wa-card));
      box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    /* One row per icon in the list: the glyph, then its name, like Home
       Assistant's own list. The picked one wears the card's hue. */
    .sym-list { display: flex; flex-direction: column; gap: 1px; }
    .sym-list + .sym-list { margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--wa-line); }
    /* The well's own frame would be a box in a box inside the dropdown. */
    .sym-menu .sym-well { padding: 2px; border: 0; border-radius: 0; background: none; box-shadow: none; }
    button.sym.sym-line {
      aspect-ratio: auto; justify-content: flex-start; gap: 12px; width: 100%; min-height: 34px; padding: 4px 8px;
      font: inherit; text-align: left;
    }
    button.sym.sym-line .sym-glyph { flex: none; }
    .sym-line-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    button.sym.sym-line:active { transform: none; }
    /* The browser: a search bar, then a framed well that scrolls, then a
       quiet count. Tiles are glyphs only, square, and the picked one wears
       the hue of the card it is in (--wa-sec), like the card's other marks. */
    .sym-browse { --sym-hi: var(--wa-sec, var(--wa-ink)); display: flex; flex-direction: column; gap: 8px; margin: 4px 0 6px; min-width: 0; }
    .sym-bar { display: flex; gap: 6px; min-width: 0; }
    .sym-search { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; }
    .sym-search > svg { position: absolute; left: 9px; width: 14px; height: 14px; color: var(--wa-muted); pointer-events: none; }
    .sym-search > input[type=search] {
      width: 100%; min-width: 0; height: 32px; box-sizing: border-box; padding: 0 10px 0 29px; border-radius: 9px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 12.5px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .sym-search > input[type=search]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .sym-search > input[type=search]::placeholder { color: var(--wa-muted); }
    .sym-bar > select.sym-set { flex: none; max-width: 46%; height: 32px; border-radius: 9px; font-size: 12.5px; }
    .sym-well {
      position: relative; max-height: 320px; overflow-y: auto; overscroll-behavior: contain;
      padding: 8px; border-radius: 12px; border: 1px solid var(--wa-line);
      background: color-mix(in srgb, var(--wa-panel) 55%, transparent);
      box-shadow: inset 0 1px 2px color-mix(in srgb, #000 18%, transparent);
      scrollbar-width: thin; scrollbar-color: var(--wa-line-strong) transparent;
    }
    .sym-sec {
      font-size: 10px; font-weight: 650; letter-spacing: .07em; text-transform: uppercase; color: var(--wa-muted);
      padding: 2px 4px 6px;
    }
    .sym-sec:not(:first-child) { margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 3px; }
    /* One line of recents, cut to what fits rather than scrolled sideways:
       every row past the first is zero tall and clipped. */
    .sym-grid.recent { grid-template-rows: auto; grid-auto-rows: 0; row-gap: 0; overflow: hidden; }
    .sym-well.named .sym-grid { grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); }
    button.sym {
      display: flex; align-items: center; justify-content: center; aspect-ratio: 1; min-width: 0; padding: 0; margin: 0;
      background: transparent; border: 0; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      transition: background-color .1s ease-out, box-shadow .1s ease-out, transform .1s ease-out;
    }
    .sym-well.named button.sym { aspect-ratio: auto; min-height: 34px; padding: 4px 6px; }
    button.sym .sym-glyph { opacity: .78; transition: opacity .1s ease-out; }
    button.sym:hover { background: var(--wa-hover); }
    button.sym:hover .sym-glyph, button.sym.on .sym-glyph { opacity: 1; }
    button.sym:active { transform: scale(.94); }
    button.sym:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.sym.on {
      background: color-mix(in srgb, var(--sym-hi) 20%, transparent);
      box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sym-hi) 80%, transparent);
    }
    .sym-glyph { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; }
    .sym-glyph svg { width: 20px; height: 20px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-count { font-size: 11px; color: var(--wa-muted); margin: -2px 2px 0; }
    .sym-name { font-size: 10px; line-height: 1.15; text-align: center; opacity: .85; overflow-wrap: anywhere; max-height: 24px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { button.sym, button.sym .sym-glyph { transition: none; } button.sym:active { transform: none; } }
`,Pt=l`
    @media (prefers-reduced-motion: reduce) { .ent-box.needs { animation: none; } }
`,dn=[Ct,Tt,Ht,St,Rt,Lt,zt,Pt];var lt="/cameras";function hn(t){let e=t?.path??"";return e===lt||e.startsWith(`${lt}/`)}var un="https://docs.wrist-assistant.com/watch-app/cameras/#notification-snapshots",ge;function gn(t){ge=t}function wn(){return ge?.dirty()??!1}function bn(){ge?.drop()}var dt,ue=!1;function Et(){return dt??=import("./cameras-editor-N5EBRPWJ.js").then(()=>{},t=>{throw ue=!0,t}),dt}function xn(t){let e=customElements.get("wa-cameras-editor")!==void 0;return!e&&!ue&&Et().then(t.onLoaded,t.onLoaded),e?b`<wa-cameras-editor .hass=${t.hass} ?narrow=${t.narrow} .barHost=${t.barHost} .devices=${t.devices}></wa-cameras-editor>`:b`<div class="wp-loading">
        ${ue?b`<span>The Cameras screen did not load. Reload the page to try again.</span>`:b`<span>Loading…</span>`}
      </div>`}export{T as a,l as b,fe as c,b as d,i as e,A as f,p as g,qt as h,ze as i,S as j,Pe as k,ra as l,Sa as m,Ra as n,La as o,za as p,Pa as q,Ea as r,Oa as s,Da as t,Va as u,Wa as v,Ia as w,qa as x,ja as y,Ua as z,Na as A,Fa as B,Ba as C,Ka as D,Ga as E,Ja as F,Za as G,Xa as H,Ya as I,Qa as J,er as K,tr as L,ar as M,rr as N,nr as O,or as P,ir as Q,sr as R,lr as S,dr as T,cr as U,pr as V,hr as W,ur as X,gr as Y,wr as Z,br as _,xr as $,mr as aa,fr as ba,vr as ca,yr as da,kr as ea,_r as fa,$r as ga,Ar as ha,Mr as ia,Cr as ja,Tr as ka,Hr as la,Sr as ma,Rr as na,Lr as oa,zr as pa,Pr as qa,Er as ra,Or as sa,Dr as ta,Wr as ua,Ir as va,qr as wa,jr as xa,Oe as ya,De as za,W as Aa,Jr as Ba,Zr as Ca,Xr as Da,Yr as Ea,Qr as Fa,en as Ga,tn as Ha,an as Ia,rn as Ja,nn as Ka,ln as La,Ct as Ma,Tt as Na,Ht as Oa,St as Pa,Rt as Qa,Lt as Ra,zt as Sa,dn as Ta,lt as Ua,hn as Va,un as Wa,gn as Xa,wn as Ya,bn as Za,xn as _a};
