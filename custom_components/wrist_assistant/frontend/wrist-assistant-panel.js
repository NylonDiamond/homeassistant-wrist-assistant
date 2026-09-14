var qm=Object.defineProperty;var Ym=Object.getOwnPropertyDescriptor;var D=(e,n,t,i)=>{for(var a=i>1?void 0:i?Ym(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&qm(n,t,a),a};var Ia=globalThis,La=Ia.ShadowRoot&&(Ia.ShadyCSS===void 0||Ia.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ro=Symbol(),ud=new WeakMap,Ai=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Ro)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(La&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=ud.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&ud.set(t,n))}return n}toString(){return this.cssText}},Fe=e=>new Ai(typeof e=="string"?e:e+"",void 0,Ro),Ao=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Ai(t,e,Ro)},pd=(e,n)=>{if(La)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Ia.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Ho=La?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return Fe(t)})(e):e;var{is:Xm,defineProperty:Jm,getOwnPropertyDescriptor:Zm,getOwnPropertyNames:Qm,getOwnPropertySymbols:ef,getPrototypeOf:tf}=Object,_a=globalThis,hd=_a.trustedTypes,nf=hd?hd.emptyScript:"",af=_a.reactiveElementPolyfillSupport,Hi=(e,n)=>e,Fi={toAttribute(e,n){switch(n){case Boolean:e=e?nf:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},za=(e,n)=>!Xm(e,n),md={attribute:!0,type:String,converter:Fi,reflect:!1,useDefault:!1,hasChanged:za};Symbol.metadata??=Symbol("metadata"),_a.litPropertyMetadata??=new WeakMap;var Et=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=md){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&Jm(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=Zm(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??md}static _$Ei(){if(this.hasOwnProperty(Hi("elementProperties")))return;let n=tf(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Hi("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Hi("properties"))){let t=this.properties,i=[...Qm(t),...ef(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Ho(a))}else n!==void 0&&t.push(Ho(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pd(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Fi).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Fi;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??za)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};Et.elementStyles=[],Et.shadowRootOptions={mode:"open"},Et[Hi("elementProperties")]=new Map,Et[Hi("finalized")]=new Map,af?.({ReactiveElement:Et}),(_a.reactiveElementVersions??=[]).push("2.1.2");var Io=globalThis,fd=e=>e,Pa=Io.trustedTypes,gd=Pa?Pa.createPolicy("lit-html",{createHTML:e=>e}):void 0,Lo="$lit$",Mt=`lit$${Math.random().toFixed(9).slice(2)}$`,_o="?"+Mt,rf=`<${_o}>`,wn=document,Li=()=>wn.createComment(""),_i=e=>e===null||typeof e!="object"&&typeof e!="function",zo=Array.isArray,kd=e=>zo(e)||typeof e?.[Symbol.iterator]=="function",Fo=`[ 	
\f\r]`,Ii=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,yd=/-->/g,bd=/>/g,xn=RegExp(`>|${Fo}(?:([^\\s"'>=/]+)(${Fo}*=${Fo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xd=/'/g,vd=/"/g,$d=/^(?:script|style|textarea|title)$/i,Po=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=Po(1),v=Po(2),Kw=Po(3),Rt=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),wd=new WeakMap,vn=wn.createTreeWalker(wn,129);function Cd(e,n){if(!zo(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return gd!==void 0?gd.createHTML(n):n}var Sd=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=Ii;for(let s=0;s<t;s++){let l=e[s],d,c,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,c=o.exec(l),c!==null);)p=o.lastIndex,o===Ii?c[1]==="!--"?o=yd:c[1]!==void 0?o=bd:c[2]!==void 0?($d.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=xn):c[3]!==void 0&&(o=xn):o===xn?c[0]===">"?(o=a??Ii,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?xn:c[3]==='"'?vd:xd):o===vd||o===xd?o=xn:o===yd||o===bd?o=Ii:(o=xn,a=void 0);let m=o===xn&&e[s+1].startsWith("/>")?" ":"";r+=o===Ii?l+rf:u>=0?(i.push(d),l.slice(0,u)+Lo+l.slice(u)+Mt+m):l+Mt+(u===-2?s:m)}return[Cd(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},zi=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,c]=Sd(n,t);if(this.el=e.createElement(d,i),vn.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=vn.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Lo)){let p=c[o++],m=a.getAttribute(u).split(Mt),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:g[2],strings:m,ctor:g[1]==="."?Da:g[1]==="?"?Oa:g[1]==="@"?Ba:$n}),a.removeAttribute(u)}else u.startsWith(Mt)&&(l.push({type:6,index:r}),a.removeAttribute(u));if($d.test(a.tagName)){let u=a.textContent.split(Mt),p=u.length-1;if(p>0){a.textContent=Pa?Pa.emptyScript:"";for(let m=0;m<p;m++)a.append(u[m],Li()),vn.nextNode(),l.push({type:2,index:++r});a.append(u[p],Li())}}}else if(a.nodeType===8)if(a.data===_o)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(Mt,u+1))!==-1;)l.push({type:7,index:r}),u+=Mt.length-1}r++}}static createElement(n,t){let i=wn.createElement("template");return i.innerHTML=n,i}};function kn(e,n,t=e,i){if(n===Rt)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=_i(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=kn(e,a._$AS(e,n.values),a,i)),n}var Na=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??wn).importNode(t,!0);vn.currentNode=a;let r=vn.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new oi(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new Va(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=vn.nextNode(),o++)}return vn.currentNode=wn,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},oi=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=kn(this,n,t),_i(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==Rt&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):kd(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&_i(this._$AH)?this._$AA.nextSibling.data=n:this.T(wn.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=zi.createElement(Cd(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new Na(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=wd.get(n.strings);return t===void 0&&wd.set(n.strings,t=new zi(n)),t}k(n){zo(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(Li()),this.O(Li()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=fd(n).nextSibling;fd(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},$n=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=kn(this,n,t,0),o=!_i(n)||n!==this._$AH&&n!==Rt,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=kn(this,s[i+l],t,l),d===Rt&&(d=this._$AH[l]),o||=!_i(d)||d!==this._$AH[l],d===f?n=f:n!==f&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Da=class extends $n{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},Oa=class extends $n{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},Ba=class extends $n{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=kn(this,n,t,0)??f)===Rt)return;let i=this._$AH,a=n===f&&i!==f||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Va=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){kn(this,n)}},Td={M:Lo,P:Mt,A:_o,C:1,L:Sd,R:Na,D:kd,V:kn,I:oi,H:$n,N:Oa,U:Ba,B:Da,F:Va},of=Io.litHtmlPolyfillSupport;of?.(zi,oi),(Io.litHtmlVersions??=[]).push("3.3.3");var Ed=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new oi(n.insertBefore(Li(),r),r,void 0,t??{})}return a._$AI(e),a};var No=globalThis,Ut=class extends Et{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Ed(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Rt}};Ut._$litElement$=!0,Ut.finalized=!0,No.litElementHydrateSupport?.({LitElement:Ut});var sf=No.litElementPolyfillSupport;sf?.({LitElement:Ut});(No.litElementVersions??=[]).push("4.2.2");var lf={attribute:!0,type:String,converter:Fi,reflect:!1,hasChanged:za},df=(e=lf,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function si(e){return(n,t)=>typeof t=="object"?df(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function B(e){return si({...e,state:!0,attribute:!1})}var rt="wrist_assistant/complications";async function Md(e){return e.connection.sendMessagePromise({type:`${rt}/owners`})}async function Rd(e,n){return e.connection.sendMessagePromise({type:`${rt}/list`,owner_watch_id:n})}async function Ad(e,n){return e.connection.sendMessagePromise({type:`${rt}/nudge`,owner_watch_id:n})}async function Hd(e,n){return e.connection.sendMessagePromise({type:`${rt}/watch_status`,owner_watch_id:n})}async function Do(e,n,t,i){return e.connection.sendMessagePromise({type:`${rt}/save`,owner_watch_id:n,document:t,base_revision:i})}async function Fd(e,n,t,i){return e.connection.sendMessagePromise({type:`${rt}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function Id(e,n,t){return e.connection.sendMessagePromise({type:`${rt}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function Ld(e,n,t){let i={type:`${rt}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function _d(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${rt}/render_values`,templates:n})).results}async function zd(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${rt}/history_series`,requests:n})).results}function Pd(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{}}}function Nd(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function Dd(e){let n=new Map,t=new Map;for(let[i,a]of Object.entries(e))a.ok&&(n.set(i,a.series),typeof a.readings=="number"&&t.set(i,{readings:a.readings,averaged:a.averaged===!0}));return{series:n,readings:t}}async function Od(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${rt}/statistics_series`,requests:n})).results}var se=["rectangular","circular","corner"],he={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},Ni=["rectangular","circular","corner","inline"];var Ko=64;function nc(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<Ko;i++)if(!t.has(i))return i;return-1}function ic(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function Rn(e){return se.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var cf=["none","dot","triangle"],uf=["straight","smooth","step"],pf=["light","medium","strong"],hf={light:.05,medium:.1,strong:.2};function Bd(e){return typeof e=="string"&&uf.includes(e)?e:"straight"}var mf=["flat","fade"],ff=["none","all","auto"],ac=4,Ft="#FFFFFF33";function qt(e){return typeof e=="string"&&mf.includes(e)?e:"flat"}function Uo(e){return typeof e=="string"&&ff.includes(e)?e:"none"}function Wo(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(ac,Math.round(e)))}function rc(e,n){return e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Wt(e){return typeof e=="string"&&e!==""?e:Ft}var gf=1,yf=12;function mt(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(gf,Math.min(yf,e))}function Xa(e){return e==="all"?"all":"auto"}var Jt=1,Zt=3,Ja=.25,Za=4;function An(e){return typeof e!="number"||!Number.isFinite(e)?Zt:Math.max(1,Math.min(ac,Math.round(e)))}function Hn(e){return typeof e!="number"||!Number.isFinite(e)?Jt:Math.max(Ja,Math.min(Za,e))}var bf=["all","top"],di=1.2;function Yt(e){return typeof e!="number"||!Number.isFinite(e)?di:Math.max(0,e)}function Xt(e){return typeof e=="string"&&bf.includes(e)?e:"all"}function ot(e){if(typeof e=="string")return pf.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function oc(e,n){if(n===void 0||e<2)return 0;let t=Math.max(3,Math.floor(e*hf[n]+.5));return t%2===0?t+1:t}var xf=[["history","Recorded history"],["statistics","Long-term statistics"]],Qa=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],jo=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],qo="history",Gi="hour",Ui="mean",gt=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Wi={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},yt=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function It(e){return e!=="threshold"&&e!=="zero"}var er=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function vf(e){return yt.some(([n])=>n===e)}function wf(e){return er.some(([n])=>n===e)}function kf(e){if(!G(e)||typeof e.layer!="string"||e.layer==="")return;let n={layer:e.layer.toUpperCase(),at:vf(e.at)?e.at:"highest",place:wf(e.place)?e.place:"above"},t=Q(e.dx,0),i=Q(e.dy,0);return t!==0&&(n.dx=t),i!==0&&(n.dy=i),n}function Ua(e,n){let t=kf(e.chartAnchor);t!==void 0&&(n.chartAnchor=t)}function Wa(e,n){e.chartAnchor!==void 0&&(n.chartAnchor=$f(e.chartAnchor))}function $f(e){let n={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(n.dx=Z(e.dx)),e.dy!==void 0&&e.dy!==0&&(n.dy=Z(e.dy)),n}var De={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"};function sc(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function st(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function Fn(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function Ki(e){let n=c=>c.value.kind.kind!=="literal",t=(c,u)=>e.slice(c,u).map(p=>Fn(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return V(t(0,e.length));let a=e.findIndex((c,u)=>u>i&&n(c)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let d={kind:structuredClone(r.kind)};return _e(o)||(d.format=o),d}function lc(e){st(e)&&(e.value=Ki(e.parts))}var ci="#FFFFFF";function Vd(e){return typeof e=="string"&&cf.includes(e)}function Cf(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function Oi(e){let n=Cf(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function dc(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function cc(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function Sf(e,n){e.marker=dc(n),cc(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var tr=24,nr=6,Bi="#FFFFFF";function Yo(e){if(e.style!=="bars")return 0;let n=e.barBorderWidth;return typeof n!="number"||!Number.isFinite(n)?0:Math.min(Math.max(n,0),nr)}function uc(e,n,t,i,a){if(a!==void 0)return{fill:a,border:a};if(!ji(e))return{fill:e.fillColorHex??i,border:e.barBorderColorHex??Bi};let r=t.find(s=>n<=s.upTo),o=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:o.fill??e.fillColorHex??o.color,border:o.border??e.barBorderColorHex??Bi}}var Qe="#FF6B35",et="#32D74B",Xo="#32D74B",pe="#FF453A",Jo="#FF453A",Zo="#FFFFFF99";function Qt(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function ji(e){return e.coloring==="bands"&&e.bands.length>0}function ir(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function qi(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function pc(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var In=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],ar=360,rr=10080,Yi=[...In,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],Qo=366*24*60,or=2,Lt=120,es=0;function ts(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?es:Math.max(or,Math.min(Lt,n)):24}function Ln(e){return is(e)!==void 0?!0:ns(e)!==void 0&&ts(e)>0}function ns(e){if(e.source==="history")return hc(e)}function is(e){if(e.source==="statistics")return hc(e)}function hc(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function _n(e){let n=ns(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${ts(e)}${e.gaps===!0?"|gaps":""}`}function zn(e){let n=is(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function mc(e){return[...as(e).map(t=>t.key),...rs(e).map(t=>t.key)].sort().join(";")}function as(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=_n(i.payload),r=ns(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:ts(i.payload),mode:"numeric",gaps:i.payload.gaps===!0})}else if(i.kind==="timeline"){let a=bt(i.payload),r=vc(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:lt(i.payload),points:an,mode:"states",gaps:!1})}return[...n.values()]}function rs(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=zn(t.payload),a=is(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType,gaps:t.payload.gaps===!0})}return[...n.values()]}var fc=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],gc=[["auto","Auto"],["always","Always"],["never","Never"]];function Oo(e){return e==="h12"||e==="h24"?e:Sn}function Bo(e){return e==="always"||e==="never"?e:Tn}function Tf(e){return e.timeLabelCount!==void 0?ft(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:Cn}function ft(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(Pn,Math.round(n))):Cn}function Xi(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var en="#8E8E93",yc=1,Ef="#000000",Mf=2,Rf=1440,os=60,Cn=0,tt=9,nt="#8E8E93",Sn="auto",Tn="auto",bc=4,Pn=12,tn=1,nn=20,sr=4,an=120;function xc(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function lt(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(rr,n)):os}function vc(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function bt(e){let n=vc(e);if(n!==void 0)return`${n}|${lt(e)}|${an}|states`}var Af={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},Ji={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function ja(e){return Af[e.trim().toLowerCase()]??en}var Hf=["door","garage_door","window","opening"];function ss(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&Hf.includes(t),a=o=>ja(i&&o==="on"?"open":o);return[...Ji[e]??[],"unavailable","unknown"].map(o=>({id:ee(),match:o,colorHex:a(o)}))}var ui=6,lr=9,Ff=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function dr(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function If(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var ls={top:0,left:0,bottom:0,right:0};function cr(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Lf=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function wc(e){return Lf.includes(e)}function kc(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var ds=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function _t(e){let n=ds.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function G(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Y(e,n=""){return typeof e=="string"?e:n}function Q(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function ht(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Di(e){return e==null?void 0:Q(e,0)}function Te(e){return typeof e=="string"?e:void 0}function li(e,n,t){return typeof e=="string"&&n.includes(e)?e:t}function Vo(e,n,t){return n.some(([i])=>i===e)?e:t}var it=class extends Error{};function Kt(e){if(typeof e.entityId!="string")throw new it("entityId is required");let n={entityId:e.entityId,displayName:Y(e.displayName),domain:Y(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Gd(e){if(!G(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=Q(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=Q(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=Q(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),_e(n)?void 0:n}function _e(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function _f(e){let n=Y(e.function,"count"),t=G(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(G).map(Kt)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(G(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:Y(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Ud(e){switch(e.kind){case"literal":return{kind:"literal",value:Y(e.value)};case"entityState":return{kind:"entityState",...Kt(e)};case"entityAttribute":return{kind:"entityAttribute",...Kt(e),attribute:Y(e.attribute)};case"entityAge":return{kind:"entityAge",...Kt(e)};case"aggregate":return{kind:"aggregate",aggregate:_f(G(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:Te(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:Y(e.value)};case"named":return{kind:"named",id:Y(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:Y(e.layer).toUpperCase(),stat:gt.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new it(`unknown value kind ${String(e.kind)}`)}}function xe(e){if(!G(e))throw new it("value must be an object");if(G(e.kind)){let i={kind:Ud(e.kind)},a=Gd(e.format);return a&&(i.format=a),i}let n={kind:Ud(e)},t=Gd(e.format);return t&&(n.format=t),n}function $c(e){return G(e)?{x:Q(e.x,.25),y:Q(e.y,.25),width:Q(e.width,.5),height:Q(e.height,.5),rotationDegrees:Q(e.rotationDegrees,0)}:{...Wi}}function zf(e){if(!G(e))return{kind:"isOn"};let n=Y(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=G(e.value)?xe(e.value):V("");break;case"between":case"timeBetween":t.value=G(e.value)?xe(e.value):V(""),t.upper=G(e.upper)?xe(e.upper):V("");break;case"matchesRegex":t.pattern=Y(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Wd(e){if(!G(e))return{kind:"show"};let n=Y(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=G(e.value)?xe(e.value):V("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=Q(e.number,0);break;case"setFontWeight":t.weight=Te(e.weight)??"regular";break;default:break}return t}function Cc(e){return Array.isArray(e)?e.filter(G).map(n=>{let t={id:Y(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(G).map(i=>{let a=G(i.when)?i.when:{};return{id:Y(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(G).map(r=>({id:Y(r.id).toUpperCase(),value:G(r.value)?xe(r.value):V(""),comparison:zf(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Wd)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Wd)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function Pf(e,n){return{baseColorHex:G(e)?Y(e.baseColorHex,n):n}}function qa(e){return Array.isArray(e)?e.filter(G).map(n=>{let t={id:Y(n.id,ee()),upTo:Q(n.upTo,0),colorHex:Y(n.colorHex,"#FFFFFF")};return typeof n.fillColorHex=="string"&&(t.fillColorHex=n.fillColorHex),typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),t}):[]}function Ka(e){let n={id:e.id,upTo:Z(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(n.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n}function Nf(e){return Array.isArray(e)?e.filter(G).map(n=>{let t={id:Y(n.id,ee()).toUpperCase(),value:G(n.value)?xe(n.value):V("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=Te(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize),Te(n.coloring)==="bands"&&(t.coloring="bands");let a=qa(n.bands);a.length>0&&(t.bands=a);let r=Y(n.bandAboveColorHex,pe);return r!==pe&&(t.bandAboveColorHex=r),t}):[]}function Df(e){if(Array.isArray(e.bands))return qa(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=G(e.colorSlot)?Y(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:ee(),upTo:e.bandLowerBound,colorHex:Y(e.bandLowColorHex,Xo)},{id:ee(),upTo:Q(e.bandUpperBound,100),colorHex:n}]}function Of(e){return Array.isArray(e)?e.filter(G).map(n=>({id:Y(n.id,ee()).toUpperCase(),match:Y(n.match,""),colorHex:Y(n.colorHex,en)})):[]}function Ze(e,n){if(typeof e.id!="string")throw new it("element id is required");return{id:e.id.toUpperCase(),colorSlot:Pf(e.colorSlot,n),rules:Cc(e.rules),frame:$c(e.frame),isHidden:e.isHidden===!0}}function Bf(e){let n=Vf(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),typeof t.name=="string"&&t.name!==""&&(n.payload.name=t.name),n}function Vf(e){if(!G(e)||!G(e.payload))throw new it("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...Ze(n,"#FFFFFF"),value:G(n.value)?xe(n.value):V(""),fontSize:Q(n.fontSize,14),fontWeight:Te(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1;Math.min(2,Math.max(1,i))===2&&(t.lineLimit=2);let a=Te(n.alignment);(a==="leading"||a==="trailing")&&(t.alignment=a),Te(n.coloring)==="bands"&&(t.coloring="bands");let r=qa(n.bands);r.length>0&&(t.bands=r);let o=Y(n.bandAboveColorHex,pe);o!==pe&&(t.bandAboveColorHex=o);let s=Te(n.highlight);(s==="highest"||s==="lowest"||s==="both")&&(t.highlight=s);let l=Y(n.highColorHex,Qe);l!==Qe&&(t.highColorHex=l);let d=Y(n.lowColorHex,et);d!==et&&(t.lowColorHex=d);let c=Nf(n.parts);return c.length>0&&(t.parts=c),Ua(n,t),{kind:"text",payload:t}}case"icon":{let t={...Ze(n,"#FFFFFF"),symbol:G(n.symbol)?xe(n.symbol):V("lightbulb"),size:Q(n.size,14)},i=Te(n.path);return i!==void 0&&i!==""&&(t.path=i),Ua(n,t),{kind:"icon",payload:t}}case"gauge":{let t={...Ze(n,"#FFFFFF"),value:G(n.value)?xe(n.value):V("50"),minValue:Q(n.minValue,0),maxValue:Q(n.maxValue,100),style:Te(n.style)??"arc",lineWidth:Q(n.lineWidth,4),trackColorHex:Y(n.trackColorHex,"#FFFFFF40"),coloring:Te(n.coloring)??"uniform",bands:qa(n.bands),bandAboveColorHex:Y(n.bandAboveColorHex,pe),thresholdColorHex:Y(n.thresholdColorHex,ci)},i=Di(n.thresholdValue);return i!==void 0&&(t.thresholdValue=i),G(n.total)&&(t.total=xe(n.total)),G(n.minSource)&&(t.minSource=xe(n.minSource)),G(n.maxSource)&&(t.maxSource=xe(n.maxSource)),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...Ze(n,"#FFFFFF"),value:G(n.value)?xe(n.value):V("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(Q(n.historyMinutes,0))),historyPoints:Math.round(Q(n.historyPoints,24)),source:Vo(Te(n.source),xf,qo),statPeriod:Vo(Te(n.statPeriod),Qa,Gi),statType:Vo(Te(n.statType),jo,Ui),style:li(n.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(Q(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:li(n.scale,["auto","fixed"],"auto"),minValue:Q(n.minValue,0),maxValue:Q(n.maxValue,100),baseline:li(n.baseline,["lowest","zero"],"lowest"),barGap:Q(n.barGap,1.5),lineWidth:Q(n.lineWidth,2),highlight:li(n.highlight,["none","highest","lowest","both"],"none"),highColorHex:Y(n.highColorHex,Qe),lowColorHex:Y(n.lowColorHex,et),marker:typeof n.marker=="string"?li(n.marker,["none","dot","pointer"],"dot"):"pointer",...Vd(n.highMarker)?{highMarker:n.highMarker}:{},...Vd(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:li(n.coloring,["uniform","bands"],"uniform"),bands:Df(n),bandAboveColorHex:Y(n.bandHighColorHex,Y(n.bandAboveColorHex,pe)),fillBands:n.fillBands===!0,...Bd(n.curve)!=="straight"?{curve:Bd(n.curve)}:{},...qt(n.fillStyle)!=="flat"?{fillStyle:qt(n.fillStyle)}:{},...typeof n.fillColorHex=="string"?{fillColorHex:n.fillColorHex}:{},...Yt(n.barRadius)!==di?{barRadius:Yt(n.barRadius)}:{},...Xt(n.barCorners)!=="all"?{barCorners:Xt(n.barCorners)}:{},...typeof n.barBorderWidth=="number"&&Number.isFinite(n.barBorderWidth)&&n.barBorderWidth!==0?{barBorderWidth:n.barBorderWidth}:{},...typeof n.barBorderColorHex=="string"?{barBorderColorHex:n.barBorderColorHex}:{},...n.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof n.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:n.bandAboveFillColorHex}:{},...typeof n.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:n.bandAboveBorderColorHex}:{},...Uo(n.pointDots)!=="none"?{pointDots:Uo(n.pointDots)}:{},...mt(n.pointDotSize)!==void 0?{pointDotSize:mt(n.pointDotSize)}:{},...typeof n.pointDotColorHex=="string"?{pointDotColorHex:n.pointDotColorHex}:{},...Wo(n.gridLines)!==0?{gridLines:Wo(n.gridLines)}:{},...rc(Wt(n.gridColorHex),Ft)?{}:{gridColorHex:Wt(n.gridColorHex)},...n.zeroLine===!0?{zeroLine:!0}:{},...ot(n.smoothing)!==void 0?{smoothing:ot(n.smoothing)}:{},...n.gaps===!0?{gaps:!0}:{},...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:Y(n.thresholdColorHex,Jo),...G(n.nowIndex)?{nowIndex:xe(n.nowIndex)}:{},nowColorHex:Y(n.nowColorHex,Zo),...n.drawsThreshold===!1?{drawsThreshold:!1}:{},...n.drawsNowLine===!1?{drawsNowLine:!1}:{},...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...Te(n.scaleFrom)!==void 0?{scaleFrom:Te(n.scaleFrom)}:{},timeLabelCount:ft(n.timeLabelCount),labelSize:Q(n.labelSize,tt),labelColorHex:Y(n.labelColorHex,nt),labelsAbove:n.labelsAbove===!0,hourCycle:Oo(n.hourCycle),minutes:Bo(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF");return{kind:"timeline",payload:{...i,value:G(n.value)?xe(n.value):V(""),historyMinutes:Math.max(1,Math.round(Q(n.historyMinutes,os))),bands:Of(n.bands),otherColorHex:Y(n.otherColorHex,en),gap:Math.min(sr,Math.max(0,Q(n.gap,0))),cornerRadius:Math.max(0,Q(n.cornerRadius,yc)),timeLabelCount:Tf(n),labelSize:Q(n.labelSize,tt),labelColorHex:Y(n.labelColorHex,nt),labelsAbove:n.labelsAbove===!0,hourCycle:Oo(n.hourCycle),minutes:Bo(n.minutes),...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let t={...Ze(n,"#FFFFFF33"),kind:Te(n.kind)??"roundedRectangle",cornerRadius:Q(n.cornerRadius,6),thickness:Q(n.thickness,1),borderWidth:Q(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),Ua(n,t),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF"),a={...i,entity:Kt(G(n.entity)?n.entity:{}),source:n.source==="entityPicture"?"entityPicture":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:Q(n.zoom,1),panX:Q(n.panX,0),panY:Q(n.panY,0),cornerRadius:Q(n.cornerRadius,ui),timestampCorner:Ff.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:Q(n.timestampSize,lr)};n.timestamp===!0&&(a.timestamp=!0);let r=Di(n.timestampX),o=Di(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=ht(r),a.timestampY=ht(o)),Ua(n,a),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF"),a={...i,action:G(n.action)?Sc(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}case"chartTimes":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF");return{kind:"chartTimes",payload:{...i,chart:Y(n.chart).toUpperCase(),timeLabelCount:ft(n.timeLabelCount),labelSize:Q(n.labelSize,tt),labelColorHex:Y(n.labelColorHex,nt),hourCycle:Oo(n.hourCycle),minutes:Bo(n.minutes)}}}case"imageTime":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF");return{kind:"imageTime",payload:{...i,image:Y(n.image).toUpperCase()}}}case"chartDots":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF"),a=mt(n.size);return{kind:"chartDots",payload:{...i,chart:Y(n.chart).toUpperCase(),dots:Xa(n.dots),...a!==void 0?{size:a}:{},...typeof n.colorHex=="string"?{colorHex:n.colorHex}:{}}}}case"chartGrid":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF");return{kind:"chartGrid",payload:{...i,chart:Y(n.chart).toUpperCase(),lines:An(n.lines),colorHex:Wt(n.colorHex),thickness:Hn(n.thickness)}}}default:throw new it(`unknown element kind ${String(e.kind)}`)}}function Kd(e){let n=G(e)?e:{},t={};if(G(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!G(r))continue;let o={frame:$c(r.frame),isHidden:r.isHidden===!0},s=Di(r.size);s!==void 0&&(o.size=s),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:Q(n.borderWidth,2),rules:Cc(n.rules)};if(G(n.bezelText)&&(i.bezelText=xe(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),G(n.curvedText)&&(i.curvedText=xe(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),G(n.bezelGauge)){let a=n.bezelGauge,r={value:G(a.value)?xe(a.value):V("50"),minValue:Q(a.minValue,0),maxValue:Q(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};G(a.minLabel)&&(r.minLabel=xe(a.minLabel)),G(a.maxLabel)&&(r.maxLabel=xe(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function Gf(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Kd(e[t+1]))}else if(G(e))for(let[t,i]of Object.entries(e))n[t]=Kd(i);return n}function Uf(e){let n={value:G(e.value)?xe(e.value):V("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function Sc(e){if(!G(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Kt(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=Kt(e)),n}default:return{type:"none"}}}function pi(e){if(!G(e))throw new it("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new it(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(G).map(r=>({id:Y(r.id).toUpperCase(),name:Y(r.name),value:G(r.value)?xe(r.value):V("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(G).map(r=>r.kind==="template"?{kind:"template",value:Y(r.value)}:r.kind==="entity"?{kind:"entity",...Kt(r)}:null).filter(r=>r!==null),i={schemaVersion:Q(e.schemaVersion,1),id:Y(e.id).toUpperCase(),name:Y(e.name,"Custom"),values:n,slotIndex:Q(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Bf),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Gf(e.perFamily),dataSources:t,tapAction:Sc(e.tapAction)};G(e.inline)&&(i.inline=Uf(e.inline));let a=Di(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),e.hidden===!0&&(i.hidden=!0),Array.isArray(e.groups)){let r=e.groups.filter(G).filter(o=>typeof o.id=="string").map(o=>({id:Y(o.id).toUpperCase(),name:Y(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Qf(i,Array.isArray(e.elements)?e.elements:[]),ct(i),i}function cs(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function rn(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function Wf(e,n){let t=Ya(e,Bn(n))?.ref;return t?.displayName||t?.entityId||(n.kind==="image"?"Picture":n.kind==="timeline"?"Timeline":"Chart")}function zt(e,n,t){let i=at(e,n.payload.id);if(i){Zi(e,t,i.id);return}let a=xs(e,[n.payload.id,t],Wf(e,n)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var Tc={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function Ec(e,n,t,i){let a=he.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function Mc(e,n,t){let i=e.elements.find(d=>d.payload.id===n);if(!i||i.kind!=="chart")return;let a=Ee("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=Ec(i.payload.frame,Tc[t],r,s);let l=e.elements.findIndex(d=>d.payload.id===n);return e.elements.splice(l+1,0,a),zt(e,i,a.payload.id),a.payload.id}var Rc={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},jd=6,Kf={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function jf(e,n){let t=(i,a)=>i!==void 0&&i!==a?i:void 0;return n==="highest"?t(e.payload.highColorHex,Qe)??"#FFD60A":n==="lowest"?t(e.payload.lowColorHex,et)??"#FF453A":"#FFFFFF"}function us(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function Ne(e,n){return e.elements.filter(t=>t.payload.chartAnchor?.layer===n)}function ps(e,n,t,i="above"){let a=e.elements.find(s=>s.payload.id===n);if(!a||a.kind!=="chart")return;t==="now"&&us(a.payload);let r=Ee("icon");r.payload.symbol=V(Rc[t]),r.payload.size=jd,r.payload.colorSlot={baseColorHex:jf(a,t)},r.payload.frame=qf(jd),r.payload.chartAnchor={layer:n,at:t,place:i};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),zt(e,a,r.payload.id),r.payload.id}function Ac(e,n){let t=e.elements.findIndex(u=>u.payload.id===n),i=e.elements[t];if(!i||i.kind!=="text"||i.payload.chartAnchor===void 0)return;let a=i.payload,r=a.chartAnchor,o=u=>{let p=Fn(u);return p===void 0?void 0:Kf[p.trim()]},s=new Set(ea.icon),l=u=>u.flatMap(p=>{if(p.kind==="setText"){let m=p.value===void 0?void 0:o(p.value);return m===void 0?[]:[{kind:"setIcon",value:V(m)}]}return s.has(De[p.kind])?[p]:[]}),d=a.rules.filter(u=>u.partId===void 0).map(u=>({...u,cases:u.cases.map(p=>({...p,then:l(p.then)})),...u.otherwise!==void 0?{otherwise:l(u.otherwise)}:{}})),c=Ee("icon");c.payload={...c.payload,id:a.id,colorSlot:a.colorSlot,rules:d,frame:a.frame,isHidden:a.isHidden,...a.groupId!==void 0?{groupId:a.groupId}:{},...a.name!==void 0?{name:a.name}:{},chartAnchor:r,symbol:V(o(a.value)??Rc[r.at]),size:a.fontSize},e.elements[t]=c}function qf(e){let n=he.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/n.width),height:Math.min(1,e*1.3/n.height),rotationDegrees:0}}function En(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;t==="now"&&us(a);let r=Ee("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:t==="now"?a.nowColorHex:a.thresholdColorHex},r.payload.frame=Hc(a.frame,t),r.payload.chartAnchor={layer:n,at:t,place:"through"};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),zt(e,i,r.payload.id),t==="now"?a.drawsNowLine=!1:a.drawsThreshold=!1,r.payload.id}function Hc(e,n){let t=he.rectangular,i=3;return n==="now"?{...e,width:Math.min(e.width,i/t.width),rotationDegrees:0}:{...e,height:Math.min(e.height,i/t.height),rotationDegrees:0}}function on(e,n){return e.elements.filter(t=>t.kind==="chartTimes"&&t.payload.chart===n)}function Nn(e,n){let t=e.elements.find(o=>o.payload.id===n);if(!t||t.kind!=="chart"&&t.kind!=="timeline")return;let i=t.payload,a=Ee("chartTimes");a.payload.chart=n,a.payload.timeLabelCount=i.timeLabelCount>0?ft(i.timeLabelCount):bc,a.payload.labelSize=i.labelSize,a.payload.labelColorHex=i.labelColorHex,a.payload.hourCycle=i.hourCycle,a.payload.minutes=i.minutes,a.payload.frame=Zf(i.frame,i.labelSize,i.labelsAbove);let r=e.elements.findIndex(o=>o.payload.id===n);return e.elements.splice(r+1,0,a),zt(e,t,a.payload.id),i.drawsTimeLabels=!1,a.payload.id}function hs(e,n){return e.elements.filter(t=>t.kind==="imageTime"&&t.payload.image===n)}function Yf(e){let n=Math.min(40,Math.max(4,e));return{w:8*n*.578+n*.89,h:n*1.25}}function ms(e,n){return Math.max(0,Math.min(e/(8*.578+.89),n/1.25))}function fs(e,n,t=he.rectangular){let i=e.elements.find(y=>y.payload.id===n);if(!i||i.kind!=="image")return;let a=i.payload,r=Ee("imageTime");r.payload.image=n;let o=Yf(a.timestampSize),s=a.frame.x*t.width,l=a.frame.y*t.height,d=a.frame.width*t.width,c=a.frame.height*t.height,u,p;if(dr(a)){let y=(b,$,k,w)=>w>=k?$+(k-w)/2:Math.min($+k-w,Math.max($,b-w/2));u=y(s+a.timestampX*d,s,d,o.w),p=y(l+a.timestampY*c,l,c,o.h)}else u=a.timestampCorner.endsWith("Leading")?s+4:s+d-4-o.w,p=a.timestampCorner.startsWith("top")?l+4:l+c-4-o.h;let m=y=>Math.round(y*1e3)/1e3;r.payload.frame={x:m(u/t.width),y:m(p/t.height),width:m(o.w/t.width),height:m(o.h/t.height),rotationDegrees:0};let g=e.elements.findIndex(y=>y.payload.id===n);return e.elements.splice(g+1,0,r),zt(e,i,r.payload.id),delete a.timestamp,delete a.timestampX,delete a.timestampY,a.timestampCorner="topLeading",a.timestampSize=lr,r.payload.id}function Dn(e,n){return e.elements.filter(t=>t.kind==="chartDots"&&t.payload.chart===n)}function On(e,n){return e.elements.filter(t=>t.kind==="chartGrid"&&t.payload.chart===n)}function gs(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Ee("chartDots");i.payload.chart=n,i.payload.dots=t.payload.pointDots==="all"?"all":"auto",i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),zt(e,t,i.payload.id),i.payload.id}function ys(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Ee("chartGrid");i.payload.chart=n,i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a,0,i),zt(e,t,i.payload.id),i.payload.id}var Xf="#FFFFFF66";function bs(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Ee("shape");i.payload.kind="line",i.payload.thickness=1,i.payload.borderWidth=0,i.payload.colorSlot={baseColorHex:Xf},i.payload.frame=Hc(t.payload.frame,"threshold"),i.payload.chartAnchor={layer:n,at:"zero",place:"through"};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),zt(e,t,i.payload.id),i.payload.id}function Fc(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(t===void 0){delete a.thresholdValue,delete a.drawsThreshold;for(let r of Ne(e,n))r.payload.chartAnchor?.at==="threshold"&&fe(e,r.payload.id);return}a.thresholdValue=t,a.drawsThreshold=!1,Ne(e,n).some(r=>r.payload.chartAnchor?.at==="threshold")||En(e,n,"threshold")}function Ic(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(!t){delete a.nowIndex,delete a.drawsNowLine;for(let r of Ne(e,n))r.payload.chartAnchor?.at==="now"&&fe(e,r.payload.id);return}us(a),a.drawsNowLine=!1,Ne(e,n).some(r=>r.payload.chartAnchor?.at==="now")||En(e,n,"now")}function Lc(e){let n=e.elements.filter(t=>t.kind==="chart"||t.kind==="timeline"||t.kind==="image");for(let t of n){let i=t.payload,a=new Set(e.elements.map(l=>l.payload.id)),r=se.find(l=>e.perFamily[l]?.placements[i.id]!==void 0),o=i.frame,s=r===void 0?void 0:e.perFamily[r].placements[i.id];if(s&&(i.frame={...s.frame}),t.kind==="chart"&&Jf(e,t.payload),t.kind==="timeline"&&t.payload.drawsTimeLabels!==!1&&t.payload.timeLabelCount>0&&Nn(e,i.id),t.kind==="image"&&t.payload.timestamp===!0&&fs(e,i.id,he[r===void 0||r==="inline"?"rectangular":r]),i.frame=o,!(r===void 0||s===void 0))for(let l of e.elements)a.has(l.payload.id)||(e.perFamily[r].placements[l.payload.id]={frame:{...l.payload.frame},isHidden:s.isHidden},l.payload.isHidden=!0)}}function Jf(e,n){{if(n.highlight!==void 0&&n.highlight!=="none"){let a=Oi(n),r=[];(n.highlight==="highest"||n.highlight==="both")&&r.push(["highest",a.high]),(n.highlight==="lowest"||n.highlight==="both")&&r.push(["lowest",a.low]);for(let[o,s]of r){let l=ps(e,n.id,o),d=e.elements.find(c=>c.payload.id===l);d?.kind==="icon"&&s!=="none"&&(d.payload.symbol=V(s==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}Sf(n,{high:"none",low:"none"}),n.highlight="none"}n.thresholdValue!==void 0&&n.drawsThreshold!==!1&&En(e,n.id,"threshold"),n.nowIndex!==void 0&&n.drawsNowLine!==!1&&En(e,n.id,"now"),n.drawsTimeLabels!==!1&&Ln(n)&&n.timeLabelCount>0&&Nn(e,n.id);let t=Uo(n.pointDots);if(t!=="none"){let a=gs(e,n.id),r=e.elements.find(o=>o.payload.id===a);if(r?.kind==="chartDots"){r.payload.dots=t;let o=mt(n.pointDotSize);o!==void 0&&(r.payload.size=o),typeof n.pointDotColorHex=="string"&&(r.payload.colorHex=n.pointDotColorHex)}}let i=Wo(n.gridLines);if(i>0){let a=ys(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="chartGrid"&&(r.payload.lines=i,r.payload.colorHex=Wt(n.gridColorHex))}if(n.zeroLine===!0){let a=bs(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:Wt(n.gridColorHex)})}delete n.pointDots,delete n.pointDotSize,delete n.pointDotColorHex,delete n.gridLines,delete n.gridColorHex,delete n.zeroLine}}function Zf(e,n,t){let i=he.rectangular,a=Math.max(tn,Math.min(nn,n)),r=Math.min(1,a*1.2/i.height),o=Math.min(1,Math.max(0,e.width)),s=t?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-o,e.x)),y:Math.max(0,Math.min(1-r,s)),width:o,height:r,rotationDegrees:0}}function Qf(e,n){for(let t of n){if(!G(t)||t.kind!=="chart"||!G(t.payload))continue;let i=t.payload,a=Y(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=Y(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let m=G(p)?p:{};return{fontSize:Q(m.fontSize,8),colorHex:Y(m.colorHex,o),pillColorHex:typeof m.pillColorHex=="string"?m.pillColorHex:void 0}},l=[],d=Te(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=Te(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,m]of l){let g=Ec(r.payload.frame,Tc[p],m.fontSize,p==="latest"?5:4),y=[];if(m.pillColorHex!==void 0){let $=Ee("shape");$.payload.kind="capsule",$.payload.colorSlot={baseColorHex:m.pillColorHex},$.payload.frame={...g},y.push($)}let b=Ee("text");b.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},b.payload.fontSize=m.fontSize,b.payload.fontWeight="medium",b.payload.colorSlot={baseColorHex:m.colorHex},b.payload.frame=g,y.push(b),e.elements.splice(u,0,...y),u+=y.length;for(let $ of y)zt(e,r,$.payload.id)}}}function Z(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function jt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function eg(e){let n={};return e.decimals!==void 0&&(n.decimals=Z(e.decimals)),e.multiply!==void 0&&(n.multiply=Z(e.multiply)),e.offset!==void 0&&(n.offset=Z(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function tg(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(jt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function ng(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...jt(e)};case"entityAttribute":return{kind:"entityAttribute",...jt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...jt(e)};case"aggregate":return{kind:"aggregate",aggregate:tg(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function ue(e){let n={kind:ng(e.kind)};return _e(e.format)||(n.format=eg(e.format)),n}function At(e){return{x:Z(e.x),y:Z(e.y),width:Z(e.width),height:Z(e.height),rotationDegrees:Z(e.rotationDegrees)}}function ig(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=ue(e.value??V(""));break;case"between":case"timeBetween":n.value=ue(e.value??V("")),n.upper=ue(e.upper??V(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function qd(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=ue(e.value??V(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=Z(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function Ht(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:ue(a.value),comparison:ig(a.comparison)}))},then:i.then.map(qd)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(qd)),n.partId!==void 0&&(t.partId=n.partId),t})}function ag(e){let n={id:e.id,value:ue(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=Z(e.fontSize)),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(Ka)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==pe&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function rg(e){let n=og(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(n.payload.name=e.payload.name),n}function og(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:ue(e.payload.value),fontSize:Z(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit===2&&(t.lineLimit=2),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(Ka)),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==pe&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==Qe&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==et&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(ag),st(i)&&(t.value=ue(Ki(i.parts)))),Wa(i,t),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:ue(e.payload.symbol)};return e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path),t.size=Z(e.payload.size),Wa(e.payload,t),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:ue(t.value),minValue:Z(t.minValue),maxValue:Z(t.maxValue),style:t.style,lineWidth:Z(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(Ka)),t.bandAboveColorHex!==pe&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=Z(t.thresholdValue)),t.thresholdColorHex!==ci&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=ue(t.total)),t.minSource!==void 0&&(i.minSource=ue(t.minSource)),t.maxSource!==void 0&&(i.maxSource=ue(t.maxSource)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:ue(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:Z(t.minValue),maxValue:Z(t.maxValue),baseline:t.baseline,barGap:Z(t.barGap),lineWidth:Z(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:dc(Oi(t)),coloring:t.coloring,bands:t.bands.map(Ka),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==qo&&(i.source=t.source),t.statPeriod!==Gi&&(i.statPeriod=t.statPeriod),t.statType!==Ui&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=Z(t.thresholdValue)),t.thresholdColorHex!==Jo&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=ue(t.nowIndex)),t.nowColorHex!==Zo&&(i.nowColorHex=t.nowColorHex),t.drawsThreshold===!1&&(i.drawsThreshold=!1),t.drawsNowLine===!1&&(i.drawsNowLine=!1),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==tt&&(i.labelSize=Z(t.labelSize)),t.labelColorHex!==nt&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Cn&&(i.timeLabelCount=ft(t.timeLabelCount)),t.hourCycle!==Sn&&(i.hourCycle=t.hourCycle),t.minutes!==Tn&&(i.minutes=t.minutes);let a=Oi(t);cc(a)||(i.highMarker=a.high,i.lowMarker=a.low);let r=t.curve??"straight";r!=="straight"&&(i.curve=r);let o=qt(t.fillStyle);o!=="flat"&&(i.fillStyle=o),t.fillColorHex!==void 0&&(i.fillColorHex=t.fillColorHex);let s=Yt(t.barRadius);s!==di&&(i.barRadius=Z(s));let l=Xt(t.barCorners);l!=="all"&&(i.barCorners=l);let d=ot(t.smoothing);return d!==void 0&&(i.smoothing=d),t.gaps===!0&&(i.gaps=!0),t.barBorderWidth!==void 0&&t.barBorderWidth!==0&&(i.barBorderWidth=Z(t.barBorderWidth)),t.barBorderColorHex!==void 0&&(i.barBorderColorHex=t.barBorderColorHex),t.bandAboveFillColorHex!==void 0&&(i.bandAboveFillColorHex=t.bandAboveFillColorHex),t.bandAboveBorderColorHex!==void 0&&(i.bandAboveBorderColorHex=t.bandAboveBorderColorHex),t.barBorderOpenBase===!0&&(i.barBorderOpenBase=!0),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden,value:ue(t.value)};return t.historyMinutes!==os&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),t.otherColorHex!==en&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=Z(t.gap)),t.cornerRadius!==yc&&(i.cornerRadius=Z(t.cornerRadius)),t.labelSize!==tt&&(i.labelSize=Z(t.labelSize)),t.labelColorHex!==nt&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Cn&&(i.timeLabelCount=Math.max(0,Math.min(Pn,Math.round(t.timeLabelCount)))),t.hourCycle!==Sn&&(i.hourCycle=t.hourCycle),t.minutes!==Tn&&(i.minutes=t.minutes),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:Z(e.payload.cornerRadius),borderWidth:Z(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=Z(e.payload.thickness)),Wa(e.payload,t),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:jt(t.entity),rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden};t.source!=="camera"&&(i.source=t.source),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=Z(t.zoom)),t.panX!==0&&(i.panX=Z(t.panX)),t.panY!==0&&(i.panY=Z(t.panY)),t.cornerRadius!==ui&&(i.cornerRadius=Z(t.cornerRadius));let a=dr(t),r=a?If(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==lr&&(i.timestampSize=Z(t.timestampSize)),a&&(i.timestampX=Z(t.timestampX),i.timestampY=Z(t.timestampY)),Wa(t,i),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:_c(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=Ht(t.rules),i.frame=At(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}case"chartTimes":{let t=e.payload,i={id:t.id,rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden,chart:t.chart};return t.labelSize!==tt&&(i.labelSize=Z(t.labelSize)),t.labelColorHex!==nt&&(i.labelColorHex=t.labelColorHex),t.timeLabelCount!==Cn&&(i.timeLabelCount=ft(t.timeLabelCount)),t.hourCycle!==Sn&&(i.hourCycle=t.hourCycle),t.minutes!==Tn&&(i.minutes=t.minutes),{kind:"chartTimes",payload:i}}case"imageTime":{let t=e.payload,i={id:t.id,rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden};return t.image!==""&&(i.image=t.image),{kind:"imageTime",payload:i}}case"chartDots":{let t=e.payload,i={id:t.id,rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden,chart:t.chart};Xa(t.dots)!=="auto"&&(i.dots="all");let a=mt(t.size);return a!==void 0&&(i.size=Z(a)),t.colorHex!==void 0&&(i.colorHex=t.colorHex),{kind:"chartDots",payload:i}}case"chartGrid":{let t=e.payload,i={id:t.id,rules:Ht(t.rules),frame:At(t.frame),isHidden:t.isHidden,chart:t.chart},a=An(t.lines);a!==Zt&&(i.lines=a);let r=Wt(t.colorHex);rc(r,Ft)||(i.colorHex=r);let o=Hn(t.thickness);return o!==Jt&&(i.thickness=Z(o)),{kind:"chartGrid",payload:i}}}}function sg(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:At(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=Z(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=ue(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=ue(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:ue(i.value),minValue:Z(i.minValue),maxValue:Z(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=ue(i.minLabel)),i.maxLabel&&(a.maxLabel=ue(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=Z(e.borderWidth),e.rules.length>0&&(n.rules=Ht(e.rules)),n}function _c(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,jt(e.target)),n}return"entityId"in e?{type:e.type,...jt(e)}:{type:e.type}}function lg(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=ue(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function hi(e){let n=[];for(let i of se){let a=e.perFamily[i];a&&n.push(i,sg(a))}let t={schemaVersion:Rn(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:ue(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(rg),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...jt(i)}),tapAction:_c(e.tapAction)};return e.inline!==void 0&&(t.inline=lg(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),e.hidden===!0&&(t.hidden=!0),t}function zc(e){return G(e)&&e.hidden===!0}function Pc(e,n){let t={...e};return n?t.hidden=!0:delete t.hidden,t}function Nc(e,n,t){let i=[],a=[];for(let r of e){let o=n(r);o!==void 0&&o.hidden&&o.id!==t?a.push(r):i.push(r)}return{shown:i,hidden:a}}function at(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function dt(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!ve(e,t))}function Dc(e,n){let t=new Set;for(let i of n){let a=at(e,i);if(a)for(let r of dt(e,a.id))t.add(r.payload.id);else t.add(i)}return e.elements.filter(i=>t.has(i.payload.id)&&i.kind!=="chartDots"&&i.kind!=="chartGrid"&&i.payload.chartAnchor===void 0).map(i=>i.payload.id)}function ct(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function mi(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!ve(e,r)),t=e.elements.filter(r=>ve(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],sn(e)}function xs(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!ve(e,r));if(i.length<2)return;let a={id:ee(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return ct(e),mi(e),a.id}function fi(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;ct(e)}function Zi(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||ve(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,ct(e),mi(e))}var oe={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups","hidden"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId","name"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","chartAnchor"],textPart:["id","value","colorHex","fontWeight","fontSize","coloring","bands","bandAboveColorHex"],icon:["symbol","path","size","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","chartAnchor"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},Yd={literal:["kind","value"],entityState:["kind",...oe.entityRef],entityAttribute:["kind",...oe.entityRef,"attribute"],entityAge:["kind",...oe.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function ur(e){let n=[],t=(l,d,c)=>{if(G(l))for(let u of Object.keys(l))d.includes(u)||n.push(`${c}.${u}`)},i=(l,d)=>{if(!G(l))return;let c=typeof l.kind=="string"?l.kind:"";t(l,Yd[c]??["kind"],d),c==="aggregate"&&G(l.aggregate)&&(t(l.aggregate,oe.aggregate,`${d}.aggregate`),t(l.aggregate.scope,oe.scope,`${d}.aggregate.scope`),G(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((u,p)=>t(u,oe.entityRef,`${d}.aggregate.scope.entities[${p}]`)),t(l.aggregate.stateFilter,oe.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(G(l)){if(G(l.kind))t(l,oe.value,d),i(l.kind,`${d}.kind`);else{let c=typeof l.kind=="string"?l.kind:"";t(l,[...Yd[c]??["kind"],"format"],d),c==="aggregate"&&i(l,d)}t(l.format,oe.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{t(c,oe.styleChange,`${d}[${u}]`),G(c)&&a(c.value,`${d}[${u}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{let p=`${d}[${u}]`;t(c,oe.rule,p),G(c)&&(Array.isArray(c.cases)&&c.cases.forEach((m,g)=>{let y=`${p}.cases[${g}]`;t(m,oe.case,y),G(m)&&(t(m.when,oe.condition,`${y}.when`),G(m.when)&&Array.isArray(m.when.tests)&&m.when.tests.forEach((b,$)=>{let k=`${y}.when.tests[${$}]`;t(b,oe.test,k),G(b)&&(a(b.value,`${k}.value`),t(b.comparison,oe.comparison,`${k}.comparison`),G(b.comparison)&&(a(b.comparison.value,`${k}.comparison.value`),a(b.comparison.upper,`${k}.comparison.upper`)))}),r(m.then,`${y}.then`))}),r(c.otherwise,`${p}.otherwise`))})};if(!G(e))return n;t(e,oe.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>t(l,oe.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{t(l,oe.named,`$.values[${d}]`),G(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let c=`$.elements[${d}]`;if(t(l,oe.elementEnvelope,c),!G(l)||!G(l.payload))return;let u=typeof l.kind=="string"?l.kind:"",p=oe[u]??[];t(l.payload,[...oe.elementBase,...p],`${c}.payload`),t(l.payload.colorSlot,oe.colorSlot,`${c}.payload.colorSlot`),t(l.payload.frame,oe.frame,`${c}.payload.frame`),"chartAnchor"in l.payload&&t(l.payload.chartAnchor,oe.chartAnchor,`${c}.payload.chartAnchor`),o(l.payload.rules,`${c}.payload.rules`);for(let m of["value","symbol","nowIndex","total","minSource","maxSource"])m in l.payload&&a(l.payload[m],`${c}.payload.${m}`);u==="text"&&Array.isArray(l.payload.parts)&&l.payload.parts.forEach((m,g)=>{t(m,oe.textPart,`${c}.payload.parts[${g}]`),G(m)&&a(m.value,`${c}.payload.parts[${g}].value`)}),u==="image"&&t(l.payload.entity,oe.entityRef,`${c}.payload.entity`),u==="tap"&&t(l.payload.action,oe.tapAction,`${c}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else G(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let c=`$.perFamily.${l}`;if(t(d,oe.layout,c),!!G(d)){if(G(d.placements))for(let[u,p]of Object.entries(d.placements))t(p,oe.placement,`${c}.placements.${u}`),G(p)&&t(p.frame,oe.frame,`${c}.placements.${u}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),G(d.bezelGauge)){let u=`${c}.bezelGauge`;t(d.bezelGauge,oe.bezelGauge,u),a(d.bezelGauge.value,`${u}.value`),a(d.bezelGauge.minLabel,`${u}.minLabel`),a(d.bezelGauge.maxLabel,`${u}.maxLabel`)}o(d.rules,`${c}.rules`)}}return G(e.inline)&&(t(e.inline,oe.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,oe.tapAction,"$.tapAction"),n}function ee(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function Pt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Oc(e,n,t=[...se]){let i={};for(let r of se)t.includes(r)&&(i[r]=Pt());let a={schemaVersion:4,id:ee(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:Ni.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:V("Text")}),a.schemaVersion=Rn(a),a}function Ee(e){let n=t=>({id:ee(),colorSlot:{baseColorHex:t},rules:[],frame:{...Wi},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:V("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:V("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:V("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:pe,thresholdColorHex:ci}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:V("13,14,16,17,19,22,24,28,30"),historyMinutes:ar,historyPoints:24,source:qo,statPeriod:Gi,statType:Ui,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:Qe,lowColorHex:et,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:pe,fillBands:!1,thresholdColorHex:Jo,nowColorHex:Zo,timeLabelCount:Cn,labelSize:tt,labelColorHex:nt,labelsAbove:!1,hourCycle:Sn,minutes:Tn}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:V(""),historyMinutes:Rf,bands:[],otherColorHex:Ef,gap:0,cornerRadius:Mf,timeLabelCount:bc,labelSize:tt,labelColorHex:nt,labelsAbove:!1,hourCycle:Sn,minutes:Tn}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:ui,timestampCorner:"topLeading",timestampSize:lr}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",timeLabelCount:Cn,labelSize:tt,labelColorHex:nt,hourCycle:Sn,minutes:Tn}}}case"imageTime":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,image:""}}}case"chartDots":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",lines:Zt,colorHex:Ft,thickness:Jt}}}}}function V(e){return{kind:{kind:"literal",value:e}}}function pr(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}var Xd=["circular","corner"],Jd=Math.SQRT1_2;function dg(e){return e==="text"||e==="icon"?4:.5}function hr(e,n,t,i){let a=structuredClone(e),r=he[n],o=he[t];if(n===t||!r||!o)return a;let s=Xd.includes(n),l=Xd.includes(t),d=s===l?1:l?Jd:1/Jd,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let u=a.frame,p=u.x+u.width/2,m=u.y+u.height/2;a.frame={...u,width:u.width*d,height:u.height*d,x:.5+(p-.5)*d-u.width*d/2,y:.5+(m-.5)*d-u.height*d/2}}return a.size!==void 0&&(a.size=Math.max(dg(i),Math.round(a.size*c*10)/10)),a}function Bc(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Bn(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}function Vi(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var vs=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Ya(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=cs(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function ws(e,n){return Ya(e,Bn(n))?.ref}function ks(e,n){let t=ws(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&vs.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function Zd(e,n,t){if(cr(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=ht(a),r=ht(r),o=ht(o),s=ht(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function Vc(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function Gc(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=ht(i.x),l=ht(i.y),d=ht(i.x+i.width),c=ht(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=Vc(o,u,he[t])}function Uc(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=he[t];return{width:r.width*o.width,height:r.height*o.height}}function je(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function ve(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function mr(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function sn(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=Vc(o.payload.frame,l.frame,he.rectangular));let d=l.outset,c=!cr(d);s.payload.frame=Zd(o.payload.frame,d,he.rectangular),s.payload.isHidden=o.payload.isHidden;let u=mg(e,a);for(let p of se){let m=e.perFamily[p];if(!m)continue;let g=he[p],y=m.placements[a];p!==u||!y?delete m.placements[s.payload.id]:c?m.placements[s.payload.id]={frame:Zd(y.frame,d,g),isHidden:y.isHidden}:m.placements[s.payload.id]={frame:{...y.frame},isHidden:y.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function fr(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=je(e,n)[0];if(a)return a.payload;let r=Ee("tap"),o=r.payload;return o.attachedTo=n,o.outset={...ls},o.action=t??ks(e,i),e.elements.push(r),sn(e),o}function gr(e,n){let t=je(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of se)for(let a of t)delete e.perFamily[i]?.placements[a]}}function fe(e,n){for(let a of rn(e,n))fe(e,a.payload.id);for(let a of on(e,n))fe(e,a.payload.id);for(let a of Dn(e,n))fe(e,a.payload.id);for(let a of On(e,n))fe(e,a.payload.id);for(let a of hs(e,n))fe(e,a.payload.id);for(let a of Ne(e,n))delete a.payload.chartAnchor;let t=e.elements.find(a=>a.payload.id===n);gr(e,n),e.elements=e.elements.filter(a=>a.payload.id!==n);let i=t?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!Ne(e,i.layer).some(a=>a.payload.chartAnchor?.at===i.at)){let a=e.elements.find(r=>r.payload.id===i.layer);a?.kind==="chart"&&(i.at==="threshold"?(delete a.payload.thresholdValue,delete a.payload.drawsThreshold):(delete a.payload.nowIndex,delete a.payload.drawsNowLine))}for(let a of e.elements)a.kind==="chart"&&a.payload.scaleFrom===n&&delete a.payload.scaleFrom;for(let a of se)delete e.perFamily[a]?.placements[n];sn(e),ct(e),t&&ug(e,t.payload.groupId,cg(t))}function cg(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":return e.payload.value.kind.kind==="chartStat"?e.payload.value.kind.layer:void 0;case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function ug(e,n,t){if(n===void 0||t===void 0||!e.groups?.some(a=>a.id===n))return;let i=dt(e,n);i.length===1&&i[0].payload.id===t&&fi(e,n)}function Wc(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=ee(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of je(e,n)){let d=structuredClone(l);d.payload.id=ee(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of se){let d=e.perFamily[l];if(d)for(let[c,u]of s){let p=d.placements[c];p&&(d.placements[u]=structuredClone(p))}}return sn(e),a}function pg(e,n){let t=/^(.*\S) \d+$/.exec(e)?.[1]??e,i=new Set(n),a=2;for(;i.has(`${t} ${a}`);)a++;return`${t} ${a}`}function Kc(e,n,t){let i=e.elements.findIndex(s=>s.payload.id===n),a=e.elements[i];if(!a||a.kind!=="chart")return;let r=ee(),o=structuredClone(a);o.payload.id=r,o.payload.scaleFrom=n,t&&(o.payload.name=pg(t(a),e.elements.map(t))),e.elements.splice(i+1,0,o);for(let s of se){let l=e.perFamily[s],d=l?.placements[n];l&&d&&(l.placements[r]=structuredClone(d))}return r}function gi(e,n,t){let i=new Set,a=d=>{i.add(d);for(let c of je(e,d))i.add(c.payload.id)};for(let d of n){a(d);for(let c of rn(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of se){let c=e.perFamily[d];if(!c)continue;let u={};for(let p of r){let m=c.placements[p.payload.id];m&&(u[p.payload.id]=structuredClone(m))}Object.keys(u).length>0&&(o[d]=u)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function jc(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&se.includes(i);if(!se.includes(t))return Mn(e,n);let r=Mn(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=Pt());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let d=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??se.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),c=d?.size??pr(l),u={frame:{...d?.frame??l.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};for(let p of se)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?hr(u,i,t,l.kind):u}return yi(e,t),r}function Mn(e,n,t={}){let i=new Map;for(let d of n.elements)i.set(d.payload.id,ee());let a=new Set(e.elements.map(d=>d.payload.id)),r=t.nudge!==!1&&n.elements.some(d=>a.has(d.payload.id)),o=d=>r?{...d,x:Math.min(.9,d.x+.05),y:Math.min(.9,d.y+.05)}:d,s=[];for(let d of n.elements){let c=structuredClone(d);if(c.payload.id=i.get(d.payload.id),c.kind==="tap"&&c.payload.attachedTo!==void 0){let u=i.get(c.payload.attachedTo);u?c.payload.attachedTo=u:delete c.payload.attachedTo}if(c.kind==="chart"&&c.payload.scaleFrom!==void 0){let u=i.get(c.payload.scaleFrom);u?c.payload.scaleFrom=u:a.has(c.payload.scaleFrom)||delete c.payload.scaleFrom}if(c.kind==="text")for(let u of c.payload.parts??[]){let p=u.value.kind,m=p.kind==="chartStat"?i.get(p.layer):void 0;p.kind==="chartStat"&&m&&(p.layer=m)}if(c.kind==="text"&&c.payload.value.kind.kind==="chartStat"){let u=i.get(c.payload.value.kind.layer);if(u)c.payload.value.kind.layer=u;else if(!a.has(c.payload.value.kind.layer))continue}if(c.kind==="chartTimes"||c.kind==="chartDots"||c.kind==="chartGrid"){let u=i.get(c.payload.chart);if(u)c.payload.chart=u;else if(!a.has(c.payload.chart))continue}if(c.kind==="imageTime"){let u=i.get(c.payload.image);if(u)c.payload.image=u;else if(!a.has(c.payload.image))continue}if(c.payload.chartAnchor!==void 0){let u=i.get(c.payload.chartAnchor.layer);u?c.payload.chartAnchor.layer=u:a.has(c.payload.chartAnchor.layer)||delete c.payload.chartAnchor}c.payload.frame=o(c.payload.frame),s.push(c)}let l=new Map;for(let d of n.groups){if(s.filter(p=>p.payload.groupId===d.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let u=ee();l.set(d.id,u),(e.groups??=[]).push({...structuredClone(d),id:u})}for(let d of s){if(d.payload.groupId===void 0)continue;let c=l.get(d.payload.groupId);c?d.payload.groupId=c:delete d.payload.groupId}e.elements.push(...s);for(let d of se){let c=n.placements[d],u=e.perFamily[d];if(!(!c||!u))for(let[p,m]of Object.entries(c)){let g=i.get(p);g&&s.some(y=>y.payload.id===g)&&(u.placements[g]={...structuredClone(m),frame:o(m.frame)})}}return sn(e),ct(e),mi(e),s.filter(d=>!ve(e,d)).map(d=>d.payload.id)}function hg(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function mg(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return se.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function xt(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function qc(e,n){let t=e.perFamily[n];return t?xt(e,n).filter(i=>!ve(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function yi(e,n){let t=se.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=Pt());let a=()=>e.elements.filter(s=>!ve(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(m=>hg(e,m,p))]));for(let[p,m]of s)m[0]&&r.set(p,m[0]);let l=new Map([...a().entries()].map(([p,m])=>[m.payload.id,p]));for(let p of t){let m=a().filter(b=>(s.get(b.payload.id)??[]).includes(p)&&r.get(b.payload.id)!==p).map(b=>b.payload.id);if(m.length===0)continue;let g=gi(e,m,p),y=Mn(e,g,{nudge:!1});y.forEach((b,$)=>{r.set(b,p);let k=y.length===m.length?m[$]:void 0;l.set(b,k!==void 0?l.get(k)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let d=p=>t.indexOf(r.get(p)??i),c=a().sort((p,m)=>d(p.payload.id)-d(m.payload.id)||(l.get(p.payload.id)??0)-(l.get(m.payload.id)??0)),u=[];for(let p of c)u.push(p),u.push(...je(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,d=t.filter(m=>e.perFamily[m].placements[l]!==void 0),c=r.get(l)??d.find(m=>!e.perFamily[m].placements[l].isHidden)??d[0]??i,u=e.perFamily[c]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let m of se){let g=e.perFamily[m];g&&(m===c?g.placements[l]=p:delete g.placements[l])}}}function yr(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=Ya(e,Bn(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of je(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=Ya(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function Go(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function Yc(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=Go(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=ss(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=Go(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=Go(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of je(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var fg={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp"};function Qd(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function ec(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":fg[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="textPart"?`Part of ${t}`:`${Qd(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=Qd(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline"}}var Xc=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g;function gg(e){let n=[];for(let t of e.matchAll(Xc))t[2]!==void 0&&n.push(t[2]);return n}function $s(e,n){return n.size===0?e:e.replace(Xc,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function Pi(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function yg(e,n){if(n.payload.name)return n.payload.name;if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=Bn(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function br(e,n){let t=(r,o)=>{n.value?.(r,o);let s=r.kind;if(s.kind==="jinja"){if(n.text){let d=n.text(s.value,{...o,part:"template"});d!==s.value&&(s.value=d)}return}if(s.kind==="aggregate"){let d=s.aggregate.scope;if(n.ref&&d.kind==="entities")for(let c=0;c<d.entities.length;c++){let u=n.ref(Pi(d.entities[c]),o);u&&(d.entities[c]=u)}return}if(!n.ref||!("entityId"in s))return;let l=n.ref(Pi(s),o);l&&(s.kind==="entityAttribute"?r.kind={kind:"entityAttribute",...l,attribute:s.attribute}:s.kind==="entityState"?r.kind={kind:"entityState",...l}:r.kind={kind:"entityAge",...l})},i=(r,o,s)=>{if(r.type==="callService"){if(n.ref&&r.target!==void 0&&r.target.entityId!==""){let d=n.ref(Pi(r.target),o);d&&(r.target=d)}if(n.text&&r.serviceDataJSON!==void 0){let d=n.text(r.serviceDataJSON,{...o,part:"serviceData"});d!==r.serviceDataJSON&&(r.serviceDataJSON=d)}return}if(!n.ref||!("entityId"in r)||r.entityId==="")return;let l=n.ref(Pi(r),o);l&&s({type:r.type,...l})};for(let r of e.values)t(r.value,{kind:"named",valueId:r.id,valueName:r.name});for(let r of e.elements){let o={kind:"layer",layerId:r.payload.id,layerKind:r.kind,layerName:yg(e,r)};if(r.kind==="image"){if(n.ref){let l=n.ref(Pi(r.payload.entity),{...o,kind:"image"});l&&(r.payload.entity=l)}}else if(r.kind==="tap"){let l=r.payload;i(l.action,{...o,kind:"tap"},d=>{l.action=d})}else{let l=Bn(r);if(l&&t(l,o),r.kind==="text")for(let d of r.payload.parts??[])t(d.value,{...o,part:"textPart"});r.kind==="gauge"&&r.payload.total&&t(r.payload.total,{...o,part:"total"}),r.kind==="gauge"&&r.payload.minSource&&t(r.payload.minSource,{...o,part:"gaugeMin"}),r.kind==="gauge"&&r.payload.maxSource&&t(r.payload.maxSource,{...o,part:"gaugeMax"}),r.kind==="chart"&&r.payload.nowIndex&&t(r.payload.nowIndex,{...o,part:"nowIndex"})}let s={...o,kind:"rule"};for(let l of Vi(r.payload.rules))t(l,s)}let a=Object.keys(e.perFamily).sort((r,o)=>{let s=Ni.indexOf(r),l=Ni.indexOf(o);return(s<0?Ni.length:s)-(l<0?Ni.length:l)});for(let r of a){let o=e.perFamily[r];if(!o)continue;let s={kind:"layout",family:r};o.bezelText&&t(o.bezelText,{...s,part:"bezelText"}),o.curvedText&&t(o.curvedText,{...s,part:"curvedText"});let l=o.bezelGauge;l&&(t(l.value,{...s,part:"bezelGauge"}),l.minLabel&&t(l.minLabel,{...s,part:"bezelGaugeMin"}),l.maxLabel&&t(l.maxLabel,{...s,part:"bezelGaugeMax"}));let d={kind:"rule",family:r};for(let c of Vi(o.rules))t(c,d)}e.inline&&t(e.inline.value,{kind:"inline"}),i(e.tapAction,{kind:"documentTap"},r=>{e.tapAction=r})}function xr(e,n){br(e,{value:n})}function Jc(e,n){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===n.toUpperCase()}function Qi(e,n){let t=new Set;return xr(e,(i,a)=>{Jc(i,n)&&t.add(a.layerId??`${a.kind}:${a.valueId??""}:${a.family??""}:${a.part??""}`)}),t.size}function bg(e,n){let t=new Set(e.values.map(a=>a.name.trim().toLowerCase())),i=n.trim()||"Value";if(!t.has(i.toLowerCase()))return i;for(let a=2;;a++){let r=`${i} ${a}`;if(!t.has(r.toLowerCase()))return r}}function Cs(e,n,t){let i={id:ee(),name:bg(e,t),value:{kind:structuredClone(n.kind)}},a={kind:{kind:"named",id:i.id}};return n.format&&!_e(n.format)&&(a.format=structuredClone(n.format)),{named:i,ref:a}}function Ss(e,n){if(n.kind.kind!=="named")return;let t=n.kind.id,i=e.values.find(o=>o.id.toUpperCase()===t.toUpperCase());if(!i)return;let a=n.format&&!_e(n.format)?n.format:i.value.format,r={kind:structuredClone(i.value.kind)};return a&&!_e(a)&&(r.format=structuredClone(a)),r}function Ts(e,n){xr(e,t=>{if(!Jc(t,n))return;let i=Ss(e,t);i&&(t.kind=i.kind,i.format?t.format=i.format:delete t.format)}),e.values=e.values.filter(t=>t.id.toUpperCase()!==n.toUpperCase())}function Es(e,n){br(e,{ref:n})}function Ms(e,n){br(e,{text:n})}function Rs(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:ec(r)})}};return n&&(i.text=(a,r)=>{for(let o of gg(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:ec(r)})}return a}),br(e,i),t}var ea={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Zc=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Vn(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function Gn(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function vr(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function As(){return{id:ee(),value:V(""),comparison:{kind:"isOn"}}}function Hs(){return{id:ee(),when:{join:"all",tests:[As()]},then:[]}}function ta(){return{id:ee(),cases:[Hs()]}}function tc(e,n){return e&&(e.kind.kind!=="literal"||Vn(e.kind.value)!==void 0)?e:V(n)}function Fs(e,n){let t={kind:n};switch(Gn(n)){case"value":t.value=e.value??V("");break;case"between":t.value=e.value??V(""),t.upper=e.upper??V("");break;case"times":t.value=tc(e.value,"22:00"),t.upper=tc(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function Un(e){let n={kind:e};switch(vr(e)){case"value":n.value=V(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}var wr="shared:";function Is(e){return wr+e.toUpperCase()}function eu(e){return e.values.filter(n=>n.value.kind.kind!=="entityState"&&Qi(e,n.id)>0)}function tu(e,n){return n.size===0?e:e.map(t=>{let i=n.get(Is(t.id));if(i===void 0)return t;let a={kind:{kind:"literal",value:i}};return t.value.format&&(a.format=t.value.format),{...t,value:a}})}var xg=["unavailable","unknown"],vg={automation:["on","off"],script:["on","off"],remote:["on","off"],update:["on","off"],timer:["idle","active","paused"],sun:["above_horizon","below_horizon"],valve:["open","closed","opening","closing"],lawn_mower:["mowing","docked","paused","returning","error"],weather:["sunny","clear-night","partlycloudy","cloudy","rainy","pouring","snowy","snowy-rainy","fog","windy","windy-variant","lightning","lightning-rainy","hail","exceptional"]},wg=new Set(["\xB0C","\xB0F"]);function Qc(e){return Array.isArray(e)&&e.length>0&&e.every(n=>typeof n=="string")?e:void 0}function na(e){let n=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):NaN;return Number.isFinite(n)?n:void 0}function kg(e){let n=e?.trim().match(/\.(\d+)$/)?.[1]?.length??0;return n===0?1:10**-Math.min(n,4)}function $g(e){let n=10**Math.floor(Math.log10(e));return([1,2,2.5,5,10].find(i=>i*n>=e)??10)*n}function Cg(e){let n=new Set,t=[];for(let i of e)i===void 0||i===""||n.has(i)||(n.add(i),t.push(i));return t}function nu(e,n,t){let i=e.split(".")[0]??"",a=n?.attributes??{},o=Qc(a.options)??(i==="climate"?Qc(a.hvac_modes):void 0)??Ji[i]??vg[i];if(o)return{kind:"choice",options:Cg([...o,n?.state,t,...xg])};let s=na(n?.state),l=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0;if(s===void 0&&l===void 0&&i!=="input_number"&&i!=="number")return{kind:"text"};let d=na(t),c=na(a.min),u=na(a.max),p=na(a.step),m,g;if(c!==void 0&&u!==void 0&&u>c)m=c,g=u;else if(l==="%")m=0,g=100;else{let b=$g(Math.max(Math.abs(s??0)*2,10));m=(s??0)<0||l!==void 0&&wg.has(l)?-b:0,g=b}d!==void 0&&(m=Math.min(m,d),g=Math.max(g,d));let y=p!==void 0&&p>0?p:kg(n?.state);return{kind:"number",min:m,max:g,step:y}}function iu(e){if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Sg(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function au(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1};case"sent":return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1}:{label:"On watch",note:`last seen ${Sg(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function ou(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function su(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function ru(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Ls(e,n,t=0){let i=n instanceof Map?n:su(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Ls(o,i,t+1):ru(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!ru(a))return;let r=ia(a);if(r!==void 0)return"e_"+ou(r)}function ut(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Tg(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>ut(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(u=>`(states.${u} | list)`).join(" + ")+")";else{let u=[];for(let p of s)u.push(`area_entities(${ut(p)})`);for(let p of l)u.push(`label_entities(${ut(p)})`);d.length>0&&u.push(`((${d.map(p=>`floor_areas(${ut(p)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${u.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(ut).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${ut(i.value)})`:t+=` | rejectattr('state', 'eq', ${ut(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${ut(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function ia(e){switch(e.kind){case"entityAttribute":return`state_attr(${ut(e.entityId)}, ${ut(e.attribute)})`;case"entityAge":{let n=ut(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Tg(e.aggregate);default:return}}function aa(e){let n=new Map,t=new Map,i=su(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=ia(d.kind);if(c===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=ia(l);if(d===void 0)return;t.set("e_"+ou(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=Bn(o);if(s&&a(s),o.kind==="text")for(let l of o.payload.parts??[])a(l.value);o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="gauge"&&o.payload.minSource&&a(o.payload.minSource),o.kind==="gauge"&&o.payload.maxSource&&a(o.payload.maxSource),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of Vi(o.payload.rules))a(l)}for(let o of se){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Vi(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=Eg(t)),r}function Eg(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function lu(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,Mg(r));return{values:t,nullKeys:i}}function Mg(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function _s(e){let n=aa(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function Rg(e,n){let t=e.holes.length===0?e.values:e.values.filter((i,a)=>!e.holes[a]);if(t.length!==0)switch(n){case"latest":return t[t.length-1];case"highest":return Math.max(...t);case"lowest":return Math.min(...t);case"average":return t.reduce((i,a)=>i+a,0)/t.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return t[0];case"delta":return t[t.length-1]-t[0];case"sum":return t.reduce((i,a)=>i+a,0);case"trend":{let i=t[t.length-1]-t[0],a=Number(qi(i,e.domainMax-e.domainMin));return a>0?1:a<0?-1:0}}}var Ag=10800;function Hg(e,n,t){let i=n==="always"||n==="auto"&&t<=Ag;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function kr(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=Hg(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function Fg(e,n){return bt(e)===void 0?[]:kr(lt(e)*60,Xi(e.timeLabelCount),e.hourCycle,e.minutes,n)}function Ig(e,n){return Ln(e)?kr(Math.round(e.historyMinutes)*60,Xi(ft(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function Lg(e,n,t,i){return n===void 0&&i!==void 0?bt(i)===void 0?[]:kr(lt(i)*60,Xi(ft(e.timeLabelCount)),e.hourCycle,e.minutes,t):n===void 0||!Ln(n)?[]:kr(Math.round(n.historyMinutes)*60,Xi(ft(e.timeLabelCount)),e.hourCycle,e.minutes,t)}function Wn(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function qe(e){let n=e.trim(),t=Wn(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Wn(i)}function _g(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function zg(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function Pg(e){let n=e.trim(),t=Wn(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?Wn(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Wn(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function Ng(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function Dg(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function Og(e,n,t){if(_e(n))return e;let i=n,a=e,r=Wn(e.trim()),o=i.duration?Pg(e):void 0;if(o!==void 0)a=Ng(o);else if(i.relativeTime&&r!==void 0)a=zg(r);else{let s=qe(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):_g(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Dg(a);break}return a}function bi(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Ye(e,n=240){return hu(e,n).map(t=>t.value)}function Ps(e,n=240){let t=[];for(let s of e.split(",")){if(t.length>=n)break;if(s.trim()===""){t.push(void 0);continue}for(let l of Ye(s,n-t.length))t.push(l)}let i=t.find(s=>s!==void 0);if(i===void 0)return{values:[],holes:[]};let a=[],r=[],o=i;for(let s of t)s===void 0?(a.push(o),r.push(!0)):(o=s,a.push(s),r.push(!1));return{values:a,holes:pu(r)}}function pu(e){return e.some(n=>n)?e:[]}function hu(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let d=!r;s(),d&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function du(e,n,t){let i=hu(e),a=i.map(y=>y.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?Qt({bands:t.bands??[]}):[],d=t.bandAboveColorHex??pe,c=t.highColorHex??Qe,u=t.lowColorHex??et,p=[],m=(y,b)=>{if(y==="")return;let $=p.at(-1);$&&$.colorHex===b?$.text+=y:p.push({text:y,colorHex:b})},g=0;return i.forEach((y,b)=>{m(e.slice(g,y.start),n);let $=b===o?c:b===s?u:l.length>0?ir(y.value,l,d):n,k=e[y.end-1]==="."?y.end-1:y.end;m(e.slice(y.start,k),$),g=k}),m(e.slice(g),n),p}function cu(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function Bg(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function oa(e,n=an){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:Vg(i.slice(a+1))})}return t}function Vg(e){try{return decodeURIComponent(e)}catch{return e}}function Gg(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(d>s))continue;let c=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===c?u.end=d:i.push({start:s,end:d,colorHex:c})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function uu(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function Ug(e,n,t){if(e===void 0)return 0;let i=qe(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var vt=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.chartElements=new Map;this.timelineElements=new Map;this.imageElements=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let{values:t,holes:i}=this.chartSeries(n),a=cu(t,n),r={values:t,holes:i,domainMin:a.min,domainMax:a.max},o=this.chartEntity(n);return o&&(r.entity=o),r}chartSeries(n){let t=_n(n),i=zn(n),a,r=t??i;r!==void 0?a=this.ctx.historySeries?.get(r)??"":a=this.resolve(n.value)??"";let{values:o,holes:s}=r!==void 0?Ps(a):{values:Ye(a),holes:[]},l=r===void 0?void 0:this.testedReading(n);if(l!==void 0&&(o=[...o.slice(0,-1),l],s.length>0&&(s=[...s.slice(0,-1),!1])),n.limit>0&&o.length>n.limit){let d=c=>n.takeFromEnd?c.slice(c.length-n.limit):c.slice(0,n.limit);o=d(o),s.length>0&&(s=d(s))}return s=pu(s),{values:Ns(o,ot(n.smoothing),s),holes:s}}testedReading(n){let t=this.chartEntity(n);if(!t||!this.ctx.testedEntities?.has(t.entityId))return;let i=this.ctx.entityStates.get(t.entityId)?.state;return i===void 0?void 0:qe(i)}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=qe(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind==="timeline"&&this.timelineElements.set(s.payload.id,s.payload),s.kind==="image"&&this.imageElements.set(s.payload.id,s.payload),!(s.kind!=="chart"||t.has(s.payload.id))&&(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let c=t.get(s);if(!c)return{min:0,max:1};let u=c.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):cu(a.get(s)?.values??[],c);return r.set(s,p),p};for(let s of i){let l=t.get(s),d=o(s,new Set([s])),c={values:a.get(s)?.values??[],holes:a.get(s)?.holes??[],domainMin:d.min,domainMax:d.max},u=this.chartEntity(l);u&&(c.entity=u),this.charts.set(s,c),this.chartElements.set(s,l)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!_e(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?Rg(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?pc(r):qi(r,a.domainMax-a.domainMin));break}default:{let a=Ls(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Og(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Wn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}canCountDown(n){if(!n)return!1;let t=this.dereference(n);if(t?.kind.kind==="entityState"){let i=t.kind.entityId;if(i.startsWith("timer.")||this.ctx.entityStates.get(i)?.timerState!==void 0)return!0}return this.countdownEnd(n)!==void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?bi(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=qe(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:qe(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),c=d===void 0?void 0:qe(d);if(a===void 0||l===void 0||c===void 0)return!1;let[u,p]=l<=c?[l,c]:[c,l];return a>=u&&a<=p}case"timeBetween":{let l=Vn(i),d=r(),c=this.resolve(t.upper),u=d===void 0?void 0:Vn(d),p=c===void 0?void 0:Vn(c);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(De[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(d=>d.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=du(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t){let i=n.payload,a=n.kind==="text"?i.rules.filter(p=>p.partId===void 0):i.rules,r=this.applyRules(a,t),o=r.get("visibility"),s=o?o.kind==="hide":i.isHidden,l=this.styleNumber(r,"rotation"),d=l===void 0?i.frame:{...i.frame,rotationDegrees:l},c=this.styleNumber(r,"opacity")??1,u={id:i.id,isHidden:s,frame:d,opacity:c};switch(i.chartAnchor!==void 0&&(u.chartAnchor=i.chartAnchor),n.kind){case"text":{let p=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,m=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,g=st(n.payload)&&!r.has("text"),y={kind:"text",...u,text:g?"":this.styleText(r,"text")??m??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(r,"fontSize")??n.payload.fontSize,fontWeight:r.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:n.payload.lineLimit===2?2:1,alignment:n.payload.alignment??"center"};return p!==void 0&&(y.countdownEnd=p),g?(y.parts=this.resolveTextParts(n.payload.parts,i.rules,y,t),y.text=y.parts.map(b=>b.text).join(""),y):(sc(n.payload)&&(y.spans=du(y.text,y.colorHex,n.payload)),y)}case"icon":{let p=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",m=this.styleText(r,"icon"),g=n.payload.symbol.kind.kind==="literal",y=m===void 0&&g&&n.payload.path!==""?n.payload.path:void 0,b=m??p;y===void 0&&b.startsWith("mdi:")&&(b="questionmark.circle");let $={kind:"icon",...u,symbol:b,size:this.styleNumber(r,"fontSize")??n.payload.size,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex};return y!==void 0&&($.path=y),$}case"gauge":{let p=n.payload,m=this.styleText(r,"gaugeValue")??this.resolve(p.value),g=(M,H,A)=>M??(H?qe(this.resolve(H)??""):void 0)??A,y=g(this.styleNumber(r,"gaugeMin"),p.minSource,p.minValue),b=g(this.styleNumber(r,"gaugeMax"),p.maxSource,p.maxValue),$=m===void 0?void 0:qe(m),k=this.styleColor(r,"color")??p.colorSlot.baseColorHex;p.coloring==="bands"&&p.bands.length>0&&$!==void 0&&(k=ir($,Qt(p),p.bandAboveColorHex));let w=b-y;if(p.total){let M=qe(this.resolve(p.total)??"");M!==void 0&&(w=M)}let C=uu(w,1,tr),L={kind:"gauge",...u,fraction:Ug(m,y,b),style:p.style,lineWidth:p.lineWidth,colorHex:k,trackColorHex:p.trackColorHex,thresholdColorHex:p.thresholdColorHex,dotCount:C,filledCount:uu($??0,0,C)};if(p.thresholdValue!==void 0&&b!==y){let M=(p.thresholdValue-y)/(b-y);M>=0&&M<=1&&(L.thresholdFraction=M)}return L}case"chart":{let p=n.payload,m=this.charts.get(p.id)??this.chartReadings(p),g=m.values,y=m.holes,b={min:m.domainMin,max:m.domainMax},$=this.styleColor(r,"color")??p.colorSlot.baseColorHex,k=Qt(p),w=ji(p)?g.map(j=>ir(j,k,p.bandAboveColorHex)):[],C=p.highlight==="highest"||p.highlight==="both",L=p.highlight==="lowest"||p.highlight==="both",M=Oi(p),H={kind:"chart",...u,values:g,holes:y,style:p.style,domainMin:b.min,domainMax:b.max,baseline:p.baseline,barGap:p.barGap,lineWidth:p.lineWidth,colorHex:$,highColorHex:p.highColorHex,lowColorHex:p.lowColorHex,marker:p.marker,highMarker:C?M.high:"none",lowMarker:L?M.low:"none",pointColorHexes:w,fillBands:p.fillBands,curve:p.curve??"straight",smoothing:ot(p.smoothing)??"off",fillStyle:qt(p.fillStyle),...p.fillColorHex!==void 0?{fillColorHex:p.fillColorHex}:{},barRadius:Yt(p.barRadius),barCorners:Xt(p.barCorners),barBorderWidth:Yo(p),barFillColorHexes:[],barBorderColorHexes:[],barBorderOpenBase:Yo(p)>0&&p.barBorderOpenBase===!0,thresholdColorHex:p.thresholdColorHex,drawsThreshold:p.drawsThreshold!==!1,nowColorHex:p.nowColorHex,drawsNowLine:p.drawsNowLine!==!1,labels:p.drawsTimeLabels===!1?[]:Ig(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove},A=y.length===0?g:g.filter((j,W)=>!y[W]);if(A.length>0){let j=P=>g.findIndex((_,R)=>_===P&&y[R]!==!0),W=C?j(Math.max(...A)):-1,q=L?j(Math.min(...A)):-1;W>=0&&(H.highIndex=W),q>=0&&q!==W&&(H.lowIndex=q)}if(p.style==="bars"){let j=g.map((W,q)=>uc(p,W,k,$,q===H.highIndex?p.highColorHex:q===H.lowIndex?p.lowColorHex:void 0));H.barFillColorHexes=j.map(W=>W.fill),H.barBorderWidth>0&&(H.barBorderColorHexes=j.map(W=>W.border))}let E=Bg(p,b.min,b.max);E!==void 0&&(H.thresholdY=E);let I=this.chartNowIndex(p,g.length);return I!==void 0&&(H.nowIndex=I),H}case"timeline":{let p=n.payload,m=bt(p),g=m===void 0?"":this.ctx.historySeries?.get(m)??"",y=oa(g,an),b=Gg(y,lt(p)*60,k=>xc(k,p.bands,p.otherColorHex));return{kind:"timeline",...u,runs:b,gap:p.gap,cornerRadius:p.cornerRadius,labels:p.drawsTimeLabels===!1?[]:Fg(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove}}case"shape":{let p={kind:"shape",...u,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(r,"borderWidth")??n.payload.borderWidth},m=this.styleColor(r,"borderColor")??n.payload.borderColorHex;return m!==void 0&&(p.borderColorHex=m),p}case"image":{let p={kind:"image",...u,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};dr(n.payload)&&(p.timestampX=n.payload.timestampX,p.timestampY=n.payload.timestampY);let m=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return m!==void 0&&(p.url=m),p}case"tap":{let p={kind:"tap",...u,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(p.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(p.attachedTo=n.payload.attachedTo),p}case"chartTimes":{let p=n.payload;return{kind:"chartTimes",...u,labels:Lg(p,this.chartElements.get(p.chart),this.nowMs(),this.timelineElements.get(p.chart)),labelSize:p.labelSize,labelColorHex:p.labelColorHex}}case"imageTime":{let p=n.payload,m=this.imageElements.get(p.image),g={kind:"imageTime",...u,image:p.image,linked:m!==void 0},y=m===void 0?void 0:this.ctx.entityStates.get(m.entity.entityId)?.entityPicture;return y!==void 0&&(g.url=y),g}case"chartDots":{let p=n.payload,m=mt(p.size),g={kind:"chartDots",...u,chart:p.chart,dots:Xa(p.dots),diameter:0,indices:[]};return m!==void 0&&(g.size=m),p.colorHex!==void 0&&(g.colorHex=p.colorHex),g}case"chartGrid":{let p=n.payload;return{kind:"chartGrid",...u,chart:p.chart,lines:An(p.lines),colorHex:Wt(p.colorHex),thickness:Hn(p.thickness),draws:!1}}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=he[t==="inline"?"rectangular":t],o=[...Xg(Yg(Bc(n,t).map(b=>this.resolveElement(b,i)),r),r)],s=a?this.applyRules(a.rules,i):new Map,l={family:t,elements:o,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(s,"borderWidth")??a?.borderWidth??2},d=this.styleText(s,"text"),c=a?.bezelCountdown&&d===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=d??u??this.resolve(a?.bezelText);p!==void 0&&(l.bezelText=p),c!==void 0&&(l.bezelCountdownEnd=c);let m=this.resolve(a?.curvedText);if(m!==void 0&&(l.curvedText=m),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let b=a.bezelGauge,$=this.resolve(b.value),k=$===void 0?void 0:qe($);if(k!==void 0){let w=Math.min(b.minValue,b.maxValue),C=Math.max(b.minValue,b.maxValue),L={value:Math.min(C,Math.max(w,k)),minValue:w,maxValue:C===w?w+1:C,colorHexes:b.colorHexes},M=this.resolve(b.minLabel);M!==void 0&&(L.minLabel=M);let H=this.resolve(b.maxLabel);H!==void 0&&(L.maxLabel=H),l.bezelGauge=L}}let g=this.styleColor(s,"backgroundColor")??a?.backgroundColorHex;g!==void 0&&(l.backgroundColorHex=g);let y=this.styleColor(s,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function Wg(e,n,t){let i=new vt(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function xi(e,n,t){let i=new vt(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Wg(e.inline,n,e)),a}function sa(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var zs=5,Kg=1.7,jg=1.8;function qg(e,n,t,i,a,r){return e==="bars"||t===0?!1:n==="all"||t===1?!0:Math.max(i-a*2,0)/(t-1)>=3*r}function Yg(e,n){if(!e.some(r=>r.kind==="chartDots"||r.kind==="chartGrid"))return[...e];let t=new Map;for(let r of e)r.kind==="chart"&&t.set(r.id,r);let i=new Map,a=e.map(r=>{if(r.kind==="chartGrid"){let u=t.get(r.chart);return u===void 0?{...r,draws:!1}:{...r,frame:u.frame,draws:u.values.length>0}}if(r.kind!=="chartDots")return r;let o=t.get(r.chart);if(o===void 0)return{...r,diameter:0,indices:[]};let s=r.size??o.lineWidth*jg,l=Math.max(o.frame.width*n.width,0),d=qg(o.style,r.dots,o.values.length,l,o.lineWidth/2,s);d&&!r.isHidden&&i.set(o.id,Math.max(i.get(o.id)??0,s));let c=d?o.values.map((u,p)=>p).filter(u=>o.holes[u]!==!0&&u!==o.highIndex&&u!==o.lowIndex):[];return{...r,frame:o.frame,diameter:s,indices:c}});return i.size===0?a:a.map(r=>{if(r.kind!=="chart")return r;let o=i.get(r.id);return o===void 0?r:{...r,dotDiameter:o}})}function mu(e){if(e.domainMin<0&&e.domainMax>0)return(0-e.domainMin)/(e.domainMax-e.domainMin)}function fu(e,n){let t=Math.max(0,Math.min(4,Math.round(n))),i=e.plotBottom-e.plotTop;return Array.from({length:t},(a,r)=>e.plotTop+i*(r+1)/(t+1))}function $r(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0?e.highMarker:"none",r=e.lowIndex!==void 0?e.lowMarker:"none",o=n.x,s=Math.max(n.w,0),l=e.style==="bars"?0:e.lineWidth/2,d=e.dotDiameter!==void 0&&e.style!=="bars"?Math.max(l,e.dotDiameter/2):l,c=H=>H==="triangle"?zs+d:H==="dot"?Math.max(d,Kg):d,u=c(a),p=c(r),m=n.y+u,g=Math.max(n.h-u-p,1),y=m+g,b=Math.max(e.domainMax-e.domainMin,Number.EPSILON),$=e.baseline==="lowest",k=$?g*.12:0,w=Math.min(Math.max(e.barGap,0),s/(i*2)),C=Math.max((s-w*(i-1))/i,.5),L=H=>Math.min(1,Math.max(0,(H-e.domainMin)/b)),M=H=>y-L(H)*g;return{count:t.length,barWidth:C,plotTop:m,plotBottom:y,plotLeft:o,plotRight:o+s,baselineY:$?y:M(0),inset:d,yAtFraction(H){return y-Math.min(Math.max(H,0),1)*g},barRect(H){let A=o+H*(C+w),E=t[H],I,j;if($){let W=k+L(E)*(g-k);I=y-W,j=y}else I=M(E),j=$?y:M(0),I>j&&([I,j]=[j,I]);return{x:A,y:I,w:C,h:Math.max(j-I,.5)}},point(H){let A=Math.max(s-d*2,0);return{x:t.length>1?o+d+A*H/(t.length-1):o+s/2,y:M(t[H])}},markerCenter(H,A,E="high"){let I=A?this.barRect(H):void 0,j=I?I.x+I.w/2:this.point(H).x,W=E==="high"?a:r,q=E==="high"?W==="triangle"?n.y+zs/2:m:W==="triangle"?n.y+n.h-zs/2:y;return{x:j,y:q}}}}function gu(e,n){let t=e.length;if(t<2)return[];let i=[];if(n==="step"){for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1];i.push({kind:"step",start:s,corner:{x:l.x,y:s.y},end:l})}return i}if(n!=="smooth"){for(let o=0;o<t-1;o++)i.push({kind:"straight",start:e[o],end:e[o+1]});return i}let a=[];for(let o=0;o<t-1;o++){let s=e[o+1].x-e[o].x;a.push(s===0?0:(e[o+1].y-e[o].y)/s)}let r=new Array(t).fill(0);r[0]=a[0],r[t-1]=a[t-2];for(let o=1;o<t-1;o++)r[o]=a[o-1]*a[o]<=0?0:(a[o-1]+a[o])/2;for(let o=0;o<t-1;o++){if(a[o]===0){r[o]=0,r[o+1]=0;continue}let s=r[o]/a[o],l=r[o+1]/a[o],d=s*s+l*l;if(d>9){let c=3/Math.sqrt(d);r[o]=c*s*a[o],r[o+1]=c*l*a[o]}}for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1],d=l.x-s.x;i.push({kind:"smooth",start:s,c1:{x:s.x+d/3,y:s.y+r[o]*d/3},c2:{x:l.x-d/3,y:l.y-r[o+1]*d/3},end:l})}return i}function Ns(e,n,t=[]){let i=e.length,a=oc(i,n);if(a===0)return e;let r=Math.floor(a/2),o=r/2,s=u=>t[u]===!0,l=e.map((u,p)=>{if(s(p))return u;let m=0,g=0;for(let y=Math.max(0,p-r);y<=Math.min(i-1,p+r);y++){if(s(y))continue;let b=y-p,$=Math.exp(-(b*b)/(2*o*o));m+=e[y]*$,g+=$}return m/g}),d=l.find((u,p)=>!s(p));if(d===void 0)return l;let c=d;return l.map((u,p)=>s(p)?c:(c=u,u))}function yu(e,n){let t=[],i=[];for(let a=0;a<e;a++)n[a]===!0?(i.length>0&&t.push(i),i=[]):i.push(a);return i.length>0&&t.push(i),t}var ra=1;function Kn(e,n){let t=Math.max(tn,Math.min(nn,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-ra>=2,r=a?{...n,y:e.labelsAbove?n.y+i+ra:n.y,h:n.h-i-ra,cy:(e.labelsAbove?n.y+i+ra:n.y)+(n.h-i-ra)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function Xg(e,n){if(!e.some(i=>i.chartAnchor!==void 0))return e;let t=new Map;for(let i of e)i.kind==="chart"&&t.set(i.id,i);return t.size===0?e:e.map(i=>{let a=i.chartAnchor;if(a===void 0)return i;let r=t.get(a.layer);if(r===void 0)return i;if(a.at==="zero"&&mu(r)===void 0)return{...i,isHidden:!0};let o=Zg(i.frame,a,r,n);return o===void 0?i:{...i,frame:o}})}function Jg(e,n){let t=n.values;if(t.length===0)return;let i=t.map((a,r)=>r).filter(a=>n.holes.length===0||!n.holes[a]);if(i.length!==0)switch(e){case"highest":return i.reduce((a,r)=>t[r]>t[a]?r:a);case"lowest":return i.reduce((a,r)=>t[r]<t[a]?r:a);case"first":return i[0];case"latest":return i[i.length-1];case"now":return n.nowIndex===void 0?void 0:Math.min(Math.max(n.nowIndex,0),t.length-1);case"threshold":return;case"zero":return}}function Zg(e,n,t,i){if(i.width<=0||i.height<=0)return;let a=sa(t,i);if(a.w<=0||a.h<=0)return;let r=Kn(t,a).body;if(r.w<=0||r.h<=0)return;let o=$r(t,r),s,l;if(It(n.at)){let $=Jg(n.at,t);if($===void 0)return;if(t.style==="bars"){let k=o.barRect($);s=k.x+k.w/2,l=k.y}else{let k=o.point($);s=k.x,l=k.y}}else{let $=n.at==="zero"?mu(t):t.thresholdY;if($===void 0)return;l=o.yAtFraction($)}let d=Math.max(e.width,0)*i.width,c=Math.max(e.height,0)*i.height,u=.75,p=($,k,w)=>k>w?(k+w)/2:Math.min(Math.max($,k),w),m={...e};if(s!==void 0){let $=p(s+(n.dx??0),r.x+d/2,r.x+r.w-d/2);m.x=($-d/2)/i.width}if(n.place==="through"){if(s!==void 0)m.y=o.plotTop/i.height,m.height=(o.plotBottom-o.plotTop)/i.height;else{m.x=o.plotLeft/i.width,m.width=(o.plotRight-o.plotLeft)/i.width;let $=p(l+(n.dy??0),r.y+c/2,r.y+r.h-c/2);m.y=($-c/2)/i.height}return m}let g=n.place==="on"?l:n.place==="below"?l+u+c/2:n.place==="bottom"?o.plotBottom-u-c/2:l-u-c/2,y=p(g,r.y+c/2,r.y+r.h-c/2),b=p(y+(n.dy??0),c/2,i.height-c/2);return m.y=(b-c/2)/i.height,m}var Ds=[.01,.025,.05,.1];function vi(e,n){return!(n.width>0&&n.height>0)||n.width===n.height?{x:e,y:e}:n.width>n.height?{x:e*n.height/n.width,y:e}:{x:e,y:e*n.width/n.height}}function Os(e){return typeof e=="number"?{x:e,y:e}:e}function Bs(e){return e.x>0&&e.y>0}var bu=1e-6;function la(e,n){return Math.round((e-.5)/n)*n+.5-e}function xu(e,n,t){let a=[e,e+n/2,e+n].map(r=>la(r,t)).reduce((r,o)=>Math.abs(o)<Math.abs(r)?o:r);return ce(e+a)}function Qg(e,n){let t=Os(n);return Bs(t)?wi({...e,x:xu(e.x,e.width,t.x),y:xu(e.y,e.height,t.y)}):e}function vu(e,n,t,i={x:!0,y:!0}){let a=Os(t);if(!Bs(a))return e;let{x:r,y:o,width:s,height:l}=e,d=r+s,c=o+l;if(i.x&&n.includes("e")&&(s=Math.max(Ue,ce(d+la(d,a.x)-r))),i.x&&n.includes("w")){let u=Math.min(ce(r+la(r,a.x)),d-Ue);s=ce(d-u),r=ce(u)}if(i.y&&n.includes("s")&&(l=Math.max(Ue,ce(c+la(c,a.y)-o))),i.y&&n.includes("n")){let u=Math.min(ce(o+la(o,a.y)),c-Ue);l=ce(c-u),o=ce(u)}return{...e,x:r,y:o,width:s,height:l}}function Vs(e,n,t,i){let a=Os(i);if(!Bs(a))return e;let r=(o,s,l)=>{if(s===0)return o;let d=(o-.5)/l,c=s>0?Math.floor(d+bu)+1:Math.ceil(d-bu)-1,u=ce(c*l+.5);for(let p=0;p<1e3&&(s>0?u<=o:u>=o);p++)c+=s,u=ce(c*l+.5);return u};return wi({...e,x:r(e.x,Math.sign(n),a.x),y:r(e.y,Math.sign(t),a.y)})}var Ue=.04,Cr=.04;function wu(e,n){let t=()=>{let a=e.getScreenCTM();return a&&a.a!==0&&a.d!==0?{x:a.a,y:a.d}:void 0},i=t()??{x:1,y:1};return a=>(i=t()??i,{x:(a.clientX-n.clientX)/i.x,y:(a.clientY-n.clientY)/i.y})}function Sr(e,n){let t={...e,...n};return wi({...t,x:ce(t.x),y:ce(t.y),width:Math.max(Ue,ce(t.width)),height:Math.max(Ue,ce(t.height))})}function Gs(e,n){let t=n==="down"?e.x:ce((1-e.width)/2),i=n==="across"?e.y:ce((1-e.height)/2);return wi({...e,x:t,y:i})}function ku(e,n){let t=Gs(e,n);return t.x===e.x&&t.y===e.y}function wi(e){let n=Math.min(1-Cr,Math.max(-e.width+Cr,e.x)),t=Math.min(1-Cr,Math.max(-e.height+Cr,e.y));return{...e,x:n,y:t}}var ce=e=>Math.round(e*1e3)/1e3,$u=10;function Tr(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return wi({...e,x:ce(a),y:ce(r)})}function ey(e,n,t,i){let a=n.width,r=n.height,o=e.width*a,s=e.height*r,l=Math.min(o,s),d=e.x*a+(o-l)/2,c=e.y*r+(s-l)/2,u=t.includes("e")?1:-1,p=t.includes("s")?1:-1,m=Ue*Math.max(a,r),g=Math.max(m,l+(u*i.x+p*i.y)/2),y=u>0?d:d+l-g,b=p>0?c:c+l-g;return{...e,x:ce(y/a),y:ce(b/r),width:ce(g/a),height:ce(g/r)}}function ty(e,n,t,i,a=!1){let r=n.width,o=n.height;if(a||e.width*r>=e.height*o){let p=a?Ue:Math.max(Ue,e.height*o/r),m=e.x+e.width,g=t.includes("e")?Math.max(p,e.width+i.x/r):Math.max(p,e.width-i.x/r),y=t.includes("e")?e.x:m-g;return{...e,x:ce(y),width:ce(g)}}let l=Math.max(Ue,e.width*r/o),d=e.y+e.height,c=t.includes("s")?Math.max(l,e.height+i.y/o):Math.max(l,e.height-i.y/o),u=t.includes("s")?e.y:d-c;return{...e,y:ce(u),height:ce(c)}}function Er(e,n,t,i,a){let r=wu(e,t),o={...i.handle&&i.outline?i.outline:i.frame},s={...i.frame};e.setPointerCapture(t.pointerId);let l=p=>Math.round(p*1e3)/1e3,d=p=>{if(p.pointerId!==t.pointerId)return;let m=r(p),g=m.x/n.width,y=m.y/n.height,b,$=i.snap!==void 0&&i.snap.on!==p.altKey?i.snap.step:void 0;if(!i.handle)b=wi({...o,x:l(o.x+g),y:l(o.y+y)}),$!==void 0&&(b=Qg(b,$));else if(i.square)b=ey(o,n,i.handle,m);else if(i.line||i.bar){if(b=ty(o,n,i.handle,m,i.bar===!0),$!==void 0){let k=i.bar===!0||b.width*n.width>=b.height*n.height;b=vu(b,i.handle,$,{x:k,y:!k})}}else{let{x:k,y:w,width:C,height:L}=o,M=o.x+o.width,H=o.y+o.height;i.handle.includes("e")&&(C=Math.max(Ue,o.width+g)),i.handle.includes("s")&&(L=Math.max(Ue,o.height+y)),i.handle.includes("w")&&(C=Math.max(Ue,o.width-g),k=M-C),i.handle.includes("n")&&(L=Math.max(Ue,o.height-y),w=H-L),b={...o,x:l(k),y:l(w),width:l(C),height:l(L)},$!==void 0&&(b=vu(b,i.handle,$))}s=b,a.onFrame(i.elementId,b,!1)},c=p=>{p.pointerId===t.pointerId&&(u(),a.onFrame(i.elementId,s,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}function Cu(e,n,t,i,a){let r=wu(e,n),o=1;e.setPointerCapture(n.pointerId);let s=c=>{if(c.pointerId!==n.pointerId)return;let u=r(c),p=u.x*(t.includes("e")?1:-1),m=u.y*(t.includes("s")?1:-1),g=i.w>0?(i.w+p)/i.w:1,y=i.h>0?(i.h+m)/i.h:1,b=Math.abs(g-1)>=Math.abs(y-1)?g:y;o=Math.max(.05,b),a(o,!1)},l=c=>{c.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}var ze=he,ca=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:ze,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],ki=ca.find(e=>e.measured);function Nu(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return ca.find(a=>a.screen.width===t&&a.screen.height===i)}function Hr(e,n){let t=ze[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Js=[{label:"Orange",hex:"#FF9F0A"},{label:"Red",hex:"#FF453A"},{label:"Green",hex:"#30D158"},{label:"Blue",hex:"#0A84FF"},{label:"Purple",hex:"#BF5AF2"},{label:"White",hex:"#FFFFFF"}];function ny(e){switch(e){case"text":case"imageTime":case"tap":return"plain";case"image":return"picture";default:return"accent"}}function iy(e,n){let t=We(n)??{color:"#FFFFFF",opacity:1},i=l=>(parseInt(t.color.slice(1+l*2,3+l*2),16)/255).toFixed(4),[a,r,o]=e==="plain"?["1","1","1"]:[i(0),i(1),i(2)];return`0 0 0 0 ${a} 0 0 0 0 ${r} 0 0 0 0 ${o} ${e==="picture"?"0.2126 0.7152 0.0722 0 0":"0 0 0 1 0"}`}function ay(e,n){return v`${["accent","plain","picture"].map(i=>v`<filter id=${`${e}-${i}`} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
    color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=${iy(i,n)} /></filter>`)}`}function jn(e,n,t){return t===void 0?e:v`<g filter=${`url(#${t}-${n})`}>${e}</g>`}function Su(e,n){if(n===void 0||!(n>0))return f;let t=vi(n,e),i=[],a=n<.025,r=l=>l===0?"rgba(10,132,255,0.6)":a&&l%10!==0?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.14)",o=Math.floor(.5/t.x+1e-6);for(let l=-o;l<=o;l++){let d=(.5+l*t.x)*e.width;d<=0||d>=e.width||i.push(v`<line x1=${d} y1="0" x2=${d} y2=${e.height} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}let s=Math.floor(.5/t.y+1e-6);for(let l=-s;l<=s;l++){let d=(.5+l*t.y)*e.height;d<=0||d>=e.height||i.push(v`<line x1="0" y1=${d} x2=${e.width} y2=${d} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}return v`<g class="snap-grid" pointer-events="none">${i}</g>`}var Ks={regular:400,medium:500,semibold:600,bold:700},Du=1.15;function We(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function ge(e,n,t="#FFFFFF"){let i=We(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}var Nt=e=>e*.55;function Ou(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function ry(e,n){let t=e.split(/\s+/).filter(r=>r!=="");if(t.length<2)return[e];let i="",a=0;for(let r=0;r<t.length-1;r++){let o=i===""?t[r]:`${i} ${t[r]}`;if(i!==""&&o.length>n)break;i=o,a=r+1}return a===0&&(i=t[0],a=1),[i,t.slice(a).join(" ")]}function oy(e,n,t){if(t<=0||e.length*Nt(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/Nt(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function sy(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function Bu(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function Vu(e,n,t,i,a){let r=[],o=n,s=a,l=d=>d<t.length&&/\s/.test(t[d]);for(let d of e){let c=s;if(/\s/.test(d))for(l(o)&&(c=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(d,o)&&(c=i[o],o+=d.length)}s=c;let u=r.at(-1);u&&u.look===c?u.text+=d:r.push({text:d,look:c})}return r}function ly(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function Gu(e,n){return e.reduce((t,i)=>t+i.text.length*Nt(i.look.fontSize*n),0)}function dy(e,n,t){let i=[...e.matchAll(/\S+/g)];if(i.length<2)return[e];let a=l=>n[l]?.fontSize??0,r=0,o=0;for(let l=0;l<i.length-1;l++){let d=i[l].index??0,c=o===0?0:Nt(a(d-1));for(let u=d;u<d+i[l][0].length;u++)c+=Nt(a(u));if(o>0&&r+c>t)break;r+=c,o=l+1}let s=l=>l.map(d=>d[0]).join(" ");return[s(i.slice(0,o)),s(i.slice(o))]}function cy(e,n,t){if(t<=0||Gu(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,d=t-.8*l,c="";for(let u of s.text){if(r>0&&a+u.length*Nt(l)>d){c!==""&&i.push({text:c,look:s.look});break e}c+=u,a+=u.length*Nt(l),r+=1}i.push({text:c,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function uy(e,n,t){let i=ly(n),a=e.lineLimit===2&&t.w>0?dy(e.text,i,t.w):[e.text],r=Bu(e.text,a),o=a.map((k,w)=>Vu(k,r[w]??0,e.text,i,i[0])),s=Math.max(...o.map(k=>Gu(k,1))),l=s>t.w&&t.w>0?Math.max(.5,t.w/s):1,d=o.map(k=>cy(k,l,t.w)),{anchor:c,x:u}=Ou(e.alignment,t),p=Math.max(0,...d.flat().map(k=>k.look.fontSize))*l||e.fontSize*l,m=.35*p,g=p*1.15,y=k=>k.map(w=>{let C=ge(w.look.colorHex,"fill");return v`<tspan font-size=${w.look.fontSize*l} font-weight=${Ks[w.look.fontWeight]??400} fill=${C.fill} fill-opacity=${C["fill-opacity"]}>${w.text}</tspan>`}),b=ge(e.colorHex,"fill"),$=d.length>1?v`${d.map((k,w)=>v`<tspan x=${u} y=${t.cy+m+(w-(d.length-1)/2)*g}>${y(k)}</tspan>`)}`:y(d[0]);return v`<text x=${u} y=${t.cy+m} text-anchor=${c}
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${e.fontSize*l} font-weight=${Ks[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${b.fill} fill-opacity=${b["fill-opacity"]}>${$}</text>`}function py(e,n){if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(y=>y.text).join("")===e.text)return e.text===""?f:uy(e,e.parts,n);let t=ge(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:bi((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit===2&&n.w>0?ry(e.text,n.w/Nt(e.fontSize)):[e.text],a=Math.max(...i.map(y=>y.length))*Nt(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,s=i.map(y=>oy(y,o,n.w)),{anchor:l,x:d}=Ou(e.alignment,n),c=sy(e.text,e.spans),u=c?Bu(e.text,i):[],p=(y,b)=>c?Vu(y,u[b]??0,e.text,c,e.colorHex).map($=>{let k=ge($.look,"fill");return v`<tspan fill=${k.fill} fill-opacity=${k["fill-opacity"]}>${$.text}</tspan>`}):y,m=o*1.15,g=s.length>1?v`${s.map((y,b)=>v`<tspan x=${d} y=${n.cy+(b-(s.length-1)/2)*m}>${p(y,b)}</tspan>`)}`:p(s[0],0);return v`<text x=${d} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${Ks[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${g}</text>`}var js=2;function Uu(e,n){let t=n.w>=n.h,i=Math.max(1,e.dotCount),a=t?n.w:n.h,r=t?n.h:n.w,o=Math.max(1,Math.min(r,a/i-js)),s=i*o+(i-1)*js;return{horizontal:t,count:i,d:o,span:s}}function hy(e,n){let t=ge(e.colorHex,"stroke"),i=ge(e.trackColorHex,"stroke","#FFFFFF"),a=ge(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let{horizontal:m,count:g,d:y,span:b}=Uu(e,n),$=(m?n.cx:n.cy)-b/2+y/2;return v`${Array.from({length:g},(k,w)=>{let C=$+w*(y+js),L=w<e.filledCount?t:i;return v`<circle cx=${m?C:n.cx} cy=${m?n.cy:C} r=${y/2}
        fill=${L.stroke} fill-opacity=${L["stroke-opacity"]} />`})}`}if(e.style==="bar"){let m=n.w,g=Math.max(r,m*e.fraction),y=1;return v`
      <rect x=${n.x} y=${n.cy-r/2} width=${m} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${g} height=${r} rx=${r/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />
      ${e.thresholdFraction===void 0?f:v`<rect x=${n.x+Math.min(m-y,Math.max(0,m*e.thresholdFraction-y/2))}
            y=${n.cy-r/2} width=${y} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=e.style==="ring"?1:.75,c=e.style==="ring"?-90:135,u=l*d,p=l*d*e.fraction;return v`
    <g transform="rotate(${c} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?v`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:f}
      ${e.thresholdFraction===void 0?f:my(n,s,r,d*360*e.thresholdFraction,e.thresholdColorHex)}
    </g>`}function my(e,n,t,i,a){let r=ge(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=t/2+1;return v`<line x1=${e.cx+s*(n-d)} y1=${e.cy+l*(n-d)}
    x2=${e.cx+s*(n+d)} y2=${e.cy+l*(n+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}function fy(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Kn(e,n),o=r?Zs(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?f:v`${o}`;let s=yy(e,a);return o===void 0?s:v`${s}${o}`}function Us(e){switch(e.kind){case"smooth":return`C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.end.x} ${e.end.y}`;case"step":return`L${e.corner.x} ${e.corner.y} L${e.end.x} ${e.end.y}`;case"straight":return`L${e.end.x} ${e.end.y}`}}var Tu=0;function Wu(){return Tu+=1,Tu.toString(36)}function Mr(e,n,t){let{x:i,y:a,w:r,h:o}=e,s=Math.max(0,n);if(s===0)return`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o} L${i} ${a+o} Z`;if(s>o){let l=Math.sqrt(o*(2*s-o)),d=i+s-l,c=i+r-s+l;return t?`M${d} ${a} L${c} ${a} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${d} ${a} Z`:`M${d} ${a+o} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${c} ${a+o} Z`}return t?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o-s} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${i} ${a+o-s} Z`:`M${i} ${a+o} L${i} ${a+s} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${i+r} ${a+s} L${i+r} ${a+o} Z`}function gy(e,n,t,i){let a=n.x,r=n.x+n.w;if(i){let l=e.y,d=n.y+n.h;return t===0?`M${a} ${l} L${a} ${d} L${r} ${d} L${r} ${l}`:`M${a} ${l} L${a} ${d-t} A${t} ${t} 0 0 0 ${a+t} ${d} L${r-t} ${d} A${t} ${t} 0 0 0 ${r} ${d-t} L${r} ${l}`}let o=e.y+e.h,s=n.y;return t===0?`M${a} ${o} L${a} ${s} L${r} ${s} L${r} ${o}`:`M${a} ${o} L${a} ${s+t} A${t} ${t} 0 0 1 ${a+t} ${s} L${r-t} ${s} A${t} ${t} 0 0 1 ${r} ${s+t} L${r} ${o}`}function yy(e,n){let t=$r(e,n),i=Wu(),a=ge(e.colorHex,"fill"),r=ge(e.highColorHex,"fill",e.colorHex),o=ge(e.lowColorHex,"fill",e.colorHex),s=(g,y)=>v`<circle cx=${g.x} cy=${g.y} r="1.7" fill=${y.fill} fill-opacity=${y["fill-opacity"]} />`,l=[],d=new Map,c=e.pointColorHexes.length===t.count,u=g=>c?ge(e.pointColorHexes[g],"fill",e.colorHex):a,p=g=>{let y=We(g)??We(e.colorHex)??{color:"#FFFFFF",opacity:1};if(e.fillStyle!=="fade")return{fill:y.color,opacity:y.opacity*.28};let b=by(i,e.id,g),$=t.baselineY<=t.plotTop?t.plotBottom:t.plotTop;return d.has(b)||d.set(b,v`<linearGradient id=${b} gradientUnits="userSpaceOnUse" x1="0" y1=${$} x2="0" y2=${t.baselineY}>
        <stop offset="0" stop-color=${y.color} stop-opacity=${y.opacity*.28} />
        <stop offset="1" stop-color=${y.color} stop-opacity="0" /></linearGradient>`),{fill:`url(#${b})`,opacity:1}};if(e.style==="bars")for(let g=0;g<t.count;g++){if(e.holes[g]===!0)continue;let y=t.barRect(g),b=e.barFillColorHexes.length===t.count?e.barFillColorHexes[g]:void 0,$=b!==void 0?ge(b,"fill",e.colorHex):g===e.highIndex?r:g===e.lowIndex?o:u(g),k=e.barCorners==="top"?Math.min(Math.max(e.barRadius,0),y.w/2):Math.min(Math.max(e.barRadius,0),y.w/2,y.h/2),w=e.baseline==="zero"&&e.values[g]<0,C=e.barCorners==="top"&&w,L=e.barBorderWidth>0&&e.barBorderColorHexes.length===t.count?e.barBorderColorHexes[g]:void 0,M=e.barBorderWidth,H=L!==void 0&&(y.w<=2*M||y.h<=2*M),A=H?ge(L,"fill",e.colorHex):$;if(e.barCorners==="top"?l.push(v`<path d=${Mr(y,k,C)}
          fill=${A.fill} fill-opacity=${A["fill-opacity"]} />`):l.push(v`<rect x=${y.x} y=${y.y} width=${y.w} height=${y.h} rx=${k}
          fill=${A.fill} fill-opacity=${A["fill-opacity"]} />`),L!==void 0&&!H){let E=ge(L,"fill",e.colorHex),I={x:y.x+M/2,y:y.y+M/2,w:y.w-M,h:y.h-M},j=e.barCorners==="top"?Math.min(Math.max(k-M/2,0),I.w/2):Math.min(Math.max(k-M/2,0),I.w/2,I.h/2);if(e.barBorderOpenBase){let q=`${i}bb${g}`,P=e.barCorners==="top"?v`<path d=${Mr(y,k,C)} />`:v`<rect x=${y.x} y=${y.y} width=${y.w} height=${y.h} rx=${k} />`;d.set(q,v`<clipPath id=${q}>${P}</clipPath>`),l.push(v`<path d=${gy(y,I,j,w)} fill="none" stroke=${E.fill} stroke-opacity=${E["fill-opacity"]} stroke-width=${M} clip-path=${`url(#${q})`} />`);continue}let W=e.barCorners==="top"?Mr(I,j,C):Mr(I,0,!1);e.barCorners==="top"||j===0?l.push(v`<path d=${W} fill="none" stroke=${E.fill} stroke-opacity=${E["fill-opacity"]} stroke-width=${M} />`):l.push(v`<rect x=${I.x} y=${I.y} width=${I.w} height=${I.h} rx=${j}
            fill="none" stroke=${E.fill} stroke-opacity=${E["fill-opacity"]} stroke-width=${M} />`)}}else{let g=Array.from({length:t.count},(k,w)=>t.point(w)),y=e.holes.length>0,$=yu(t.count,e.holes).filter(k=>!y||k.length>1).map(k=>{let w=k.map(M=>g[M]),C=gu(w,e.curve),L=`M${w[0].x} ${w[0].y}${C.map(M=>` ${Us(M)}`).join("")}`;return{run:k,pts:w,legs:C,line:L}});if(e.style==="area")for(let{run:k,pts:w,legs:C,line:L}of $)if(e.fillBands&&c&&k.length>1&&e.fillColorHex===void 0)for(let M=0;M<C.length;M++){let H=w[M],A=w[M+1],E=p(e.pointColorHexes[k[M+1]]),I=`M${H.x} ${H.y} ${Us(C[M])} L${A.x} ${t.baselineY} L${H.x} ${t.baselineY} Z`;l.push(v`<path d=${I} fill=${E.fill} fill-opacity=${E.opacity} stroke="none" />`)}else{let M=p(e.fillColorHex??e.colorHex),H=`${L} L${w[w.length-1].x} ${t.baselineY} L${w[0].x} ${t.baselineY} Z`;l.push(v`<path d=${H} fill=${M.fill} fill-opacity=${M.opacity} stroke="none" />`)}for(let{run:k,pts:w,legs:C,line:L}of $)if(c&&k.length>1)for(let M=0;M<C.length;M++){let H=w[M],A=u(k[M+1]);l.push(v`<path d=${`M${H.x} ${H.y} ${Us(C[M])}`} fill="none"
            stroke=${A.fill} stroke-opacity=${A["fill-opacity"]}
            stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(v`<path d=${L} fill="none" stroke=${a.fill} stroke-opacity=${a["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(s(g[e.highIndex],r)),e.lowIndex!==void 0&&l.push(s(g[e.lowIndex],o))}let m=(g,y,b,$)=>{if(g===void 0||y==="none")return;let k=t.markerCenter(g,e.style==="bars",$);l.push(y==="triangle"?v`<path d=${`M${k.x} ${k.y-1.8} L${k.x+2.2} ${k.y+1.8} L${k.x-2.2} ${k.y+1.8} Z`}
          fill=${b.fill} fill-opacity=${b["fill-opacity"]} />`:s(k,b))};if(m(e.highIndex,e.highMarker,r,"high"),m(e.lowIndex,e.lowMarker,o,"low"),e.drawsThreshold&&e.thresholdY!==void 0){let g=t.yAtFraction(e.thresholdY),y=ge(e.thresholdColorHex,"fill",e.colorHex);l.push(v`<path d=${`M${t.plotLeft} ${g} L${t.plotRight} ${g}`} fill="none"
      stroke=${y.fill} stroke-opacity=${y["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.drawsNowLine&&e.nowIndex!==void 0&&e.nowIndex<t.count){let g=t.markerCenter(e.nowIndex,e.style==="bars").x,y=ge(e.nowColorHex,"fill",e.colorHex);l.push(v`<path d=${`M${g} ${t.plotTop} L${g} ${t.plotBottom}`} fill="none"
      stroke=${y.fill} stroke-opacity=${y["fill-opacity"]} stroke-width="1" />`)}return d.size===0?v`${l}`:v`<defs>${[...d.values()]}</defs>${l}`}function by(e,n,t){return`chartfade-${e}-${n}-${t}`.replace(/[^0-9A-Za-z_-]/g,"")}function Zs(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=ge(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let d=s===e.labels.length-1?"end":s===0?"start":"middle",c=n.x+o.position*n.w;return v`<text x=${c} y=${a} text-anchor=${d} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function xy(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Kn(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,d)=>{let c=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=d===e.runs.length-1,m=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),g=Math.max(0,Math.min(e.cornerRadius,m/2,a.h/2)),y=ge(l.colorHex,"fill");return v`<rect x=${c} y=${a.y} width=${m} height=${a.h} rx=${g}
      fill=${y.fill} fill-opacity=${y["fill-opacity"]} />`});return r?v`${s}${Zs(e,n,t,i)}`:v`${s}`}function vy(e,n){if(e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i}=Kn({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),a={...n,y:n.cy-i/2,h:i};return v`${Zs({labels:e.labels,labelColorHex:e.labelColorHex,labelsAbove:!1},a,t,i)}`}function Ku(e,n){if(!(e===void 0||n.w<=0||n.h<=0))return{chart:e,g:$r(e,Kn(e,n).body)}}function wy(e,n,t,i=!1,a=0){let r=Ku(t,n);if(e.indices.length===0||r===void 0)return f;let o=r.chart,s=o.pointColorHexes.length===o.values.length,l=Math.max(e.diameter/2,a),d=new Map,c=l+1.2,u="";for(let m of e.indices){if(m>=o.values.length)continue;let g=r.g.point(m),y=e.colorHex??(s?o.pointColorHexes[m]:o.colorHex);d.set(y,`${d.get(y)??""}M${g.x-l} ${g.y} a${l} ${l} 0 1 0 ${2*l} 0 a${l} ${l} 0 1 0 ${-2*l} 0 Z`),i&&(u+=`M${g.x-c} ${g.y} a${c} ${c} 0 1 0 ${2*c} 0 a${c} ${c} 0 1 0 ${-2*c} 0 Z`)}let p=i&&u!==""?v`<path d=${u} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f;return v`${p}${[...d].map(([m,g])=>{let y=ge(m,"fill",o.colorHex);return v`<path d=${g} fill=${y.fill} fill-opacity=${y["fill-opacity"]} stroke="transparent" stroke-width="3" />`})}`}function ky(e,n,t,i=!1,a=0){let r=Ku(t,n);if(!e.draws||r===void 0)return f;let o=We(e.colorHex)??{color:"#FFFFFF",opacity:.2},s=fu(r.g,e.lines);return v`${s.map(l=>v`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none"
    stroke=${o.color} stroke-opacity=${Math.max(o.opacity,a>0?.6:0)} stroke-width=${Math.max(e.thickness,a)} />`)}${i?s.map(l=>v`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`):f}`}function Eu(e){let n=Math.min(e.w,e.h);return{x:e.cx-n/2,y:e.cy-n/2,w:n,h:n,cx:e.cx,cy:e.cy}}var da=4;function $y(e,n){let t=e.w>=e.h,i=t?e.h:e.w,a=Math.min(i,Math.max(da,Math.max(0,n)));return t?{x:e.x,y:e.cy-a/2,w:e.w,h:a,cx:e.cx,cy:e.cy}:{x:e.cx-a/2,y:e.y,w:a,h:e.h,cx:e.cx,cy:e.cy}}function ju(e,n){if(e.kind==="shape")return e.shapeKind==="circle"?Eu(n):e.shapeKind==="line"?$y(n,e.thickness):n;if(e.kind==="icon"){let t=Math.max(da,Qs(e));return{x:n.cx-t/2,y:n.cy-t/2,w:t,h:t,cx:n.cx,cy:n.cy}}if(e.kind==="chartTimes"){if(e.labels.length===0||n.w<=0||n.h<=0)return n;let{rowHeight:t}=Kn({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),i=Math.max(da,t);return{x:n.x,y:n.cy-i/2,w:n.w,h:i,cx:n.cx,cy:n.cy}}if(e.kind==="imageTime"){let t=ms(n.w,n.h);if(!e.linked||t<=0)return n;let i=tl(new Date).length*t*.578+t*.89,a=t*1.25;return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}if(e.kind!=="gauge")return n;switch(e.style){case"ring":case"arc":return Eu(n);case"bar":{let t=Math.max(da,e.lineWidth);return{x:n.x,y:n.cy-t/2,w:n.w,h:t,cx:n.cx,cy:n.cy}}case"dots":{let{horizontal:t,d:i,span:a}=Uu(e,n),r=Math.max(da,i);return t?{x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,cx:n.cx,cy:n.cy}:{x:n.cx-r/2,y:n.cy-a/2,w:r,h:a,cx:n.cx,cy:n.cy}}default:return n}}function qu(e,n,t){return e.kind==="shape"?e.shapeKind==="circle"?{square:!0}:e.shapeKind==="line"?{line:!0}:{}:e.kind==="chartTimes"?{bar:!0}:e.kind==="imageTime"?Mu(e,n,t):e.kind!=="gauge"?{}:e.style==="ring"||e.style==="arc"?{square:!0}:e.style==="bar"?{bar:!0}:e.style!=="dots"?{}:Mu(e,n,t)}function Mu(e,n,t){if(t.width<=0||t.height<=0)return{};let i=ju({...e,frame:n},sa({...e,frame:n},t));return{outline:{...n,x:i.x/t.width,y:i.y/t.height,width:i.w/t.width,height:i.h/t.height}}}function Qs(e){return e.path!==void 0&&e.path!==""?e.size*Du:e.size}function Cy(e,n){let t=ge(e.fillColorHex,"fill"),i=e.borderColorHex?We(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(n.w,n.h)/2-r;return v`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,l)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(n.w,n.h)/2;return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${l}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"line":{let l=n.w>=n.h,d=Math.max(0,Math.min(e.thickness,l?n.h:n.w)),c=l?n.x:n.cx-d/2,u=l?n.cy-d/2:n.y;return v`<rect x=${c} y=${u} width=${l?n.w:d} height=${l?d:n.h}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]} stroke="none" />`}}}function Sy(e,n,t){if(e.path!==void 0&&e.path!==""){let o=ge(e.colorHex,"fill"),s=e.size*Du;return v`<g transform="translate(${n.cx-s/2} ${n.cy-s/2}) scale(${s/24})">
      <path d=${e.path} fill=${o.fill} fill-opacity=${o["fill-opacity"]} /></g>`}let i=t.render(e.symbol,e.size,e.colorHex);if(i)return v`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=ge(e.colorHex,"stroke"),r=e.size;return v`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var el=.25,Ty=8;function Ey(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,el),Ty),c=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:c)*d,m=t*p,g=i*p,y=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),b=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(m-e)/2*(1+y)+0,y:-(g-n)/2*(1+b)+0,width:m,height:g}}function tl(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Rr=4;function My(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Rr:n.x+n.w-Rr-a,d=e.timestampCorner.startsWith("top")?n.y+Rr:n.y+n.h-Rr-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,c,u)=>u>=c?d+(c-u)/2:Math.min(d+c-u,Math.max(d,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Ry(e,n){if(e==="camera")return"camera.fill";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function Ay(e,n,t){let i=t.icons,a=`imgclip-${Wu()}-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?My(e,n,tl(new Date)):void 0,s=o?Yu(o):f,l=e.url?t.imageSizes?.size(e.url):void 0,d;if(e.url&&l){let c=Ey(n.w,n.h,l.width,l.height,e.contentMode,e.zoom,e.panX,e.panY);d=v`<image href=${e.url} x=${n.x+c.x} y=${n.y+c.y} width=${c.width} height=${c.height}
      preserveAspectRatio="none" />`}else e.url?d=v`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:d=v`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(Ry(e.source,e.entityId),14,"#FFFFFF99")??f}</g>`;return v`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${d}${s}</g>`}function Yu(e,n=1){return v`<g opacity=${n}>
    <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h/2} fill="#000000" fill-opacity="0.55" />
    <text x=${e.x+e.w/2} y=${e.y+e.h/2} text-anchor="middle" dominant-baseline="central"
      font-size=${e.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${e.label}</text></g>`}function Hy(e,n){if(!e.linked)return f;let t=tl(new Date),i=ms(n.w,n.h);if(i<=0)return f;let a=t.length*i*.578+i*.89,r=i*1.25;return Yu({x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,size:i,label:t},e.url===void 0?.5:1)}function Fy(e,n,t,i,a){if(!i)return f;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?Iy(a,n):void 0;return v`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?v`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${qs} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?v`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var qs=5;function Iy(e,n){let t=qs*.55,i=n.w-2;if(n.h<qs*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Xu(e){let n=new Map;for(let t of e)t.kind==="chart"&&n.set(t.id,t);return n}function Ar(e,n,t,i=new Map,a,r="body"){if(e.isHidden&&!t.showHidden)return f;let o=t.tapReview===!0,s=t.tapAreas===!0||o,l=o?t.tapFocusId:void 0,d=l!==void 0&&e.id===l,c=l!==void 0;if(e.kind==="tap"&&!s)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!o||c&&!d))return f;let u=sa(e,n),p=o&&(!c||d),m;if(r==="body")switch(e.kind){case"text":m=py(e,u);break;case"icon":m=Sy(e,u,t.icons);break;case"gauge":m=hy(e,u);break;case"chart":m=fy(e,u);break;case"timeline":m=xy(e,u);break;case"chartTimes":m=vy(e,u);break;case"imageTime":m=Hy(e,u);break;case"chartDots":m=wy(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minDotRadius);break;case"chartGrid":m=ky(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minGridStroke);break;case"shape":m=Cy(e,u);break;case"image":m=Ay(e,u,t);break;case"tap":m=Fy(e,u,t.icons,s,p?_t(e.action):void 0);break}e.kind!=="tap"&&(m=jn(m,ny(e.kind),a));let g=o&&(e.kind!=="tap"||c&&!d)?.35:1,y=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*g,b=t.highlightId===e.id,$=b||t.highlightIds?.includes(e.id)===!0,k=e.kind==="chartDots"||e.kind==="chartGrid",w=e.chartAnchor?.place==="through",C=t.handles===!0&&(!c||d)&&!k&&!w,L=ju(e,u),M=$&&!k?v`<rect x=${L.x} y=${L.y} width=${L.w} height=${L.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,H=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?v`<rect x=${L.x} y=${L.y} width=${L.w} height=${L.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,A=k?f:v`<rect x=${L.x} y=${L.y} width=${L.w} height=${L.h} fill="transparent" stroke="none" />`,E=3,I=L,j=b&&C?[["nw",I.x-E,I.y-E],["ne",I.x+I.w,I.y-E],["sw",I.x-E,I.y+I.h],["se",I.x+I.w,I.y+I.h]].map(([W,q,P])=>v`<rect data-handle=${W} x=${q} y=${P} width=${E} height=${E}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${W}-resize" />`):f;return r==="handles"?j===f?f:v`<g data-element-id=${e.id} opacity=${y} transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${j}</g>`:v`<g data-element-id=${e.id} opacity=${y} style=${C?"cursor:move":e.kind==="chartDots"?"cursor:pointer":f}
    pointer-events=${e.kind==="chartGrid"?"none":f}
    transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${A}${m}${H}${M}</g>`}function Fr(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function nl(e,n){return(n?23.5:34)*e}var Ru=10.5;function Ju(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Au(e,n){let t=0;for(let i of e)t+=Ju(i,n);return t}function Hu(e,n,t){let i=e.toUpperCase(),a=d=>Ju(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function Ys(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function Xs(e,n,t,i){let a=Ys(e,n,t),r=Ys(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function Zu(e,n,t,i){let{dial:a}=Fr(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:Xs(a,t,i.start,i.end),length:t*r}}function Ly(e,n){let t=Fr(e,!0);return Zu(e,n,t.dial.r,t.labelArc)}var Fu=18.5,_y=113,zy={start:-71,end:-36},Iu=104,Py=6.2,Lu={start:-77,end:-30.5};function _u(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function zu(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=_u(e[i]),o=_u(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var Ws=11;function Ny(e,n,t){let{dial:i}=Fr(n,!0),a=Iu*n,r=180/(Math.PI*Iu),o=e.minLabel!==void 0?Au(e.minLabel,Ws)*r:0,s=e.maxLabel!==void 0?Au(e.maxLabel,Ws)*r:0,l=Lu.start+(o>0?Math.max(0,o-1.8):0),d=Lu.end-(s>0?Math.max(0,s-1.8):0),c=d-l,u=24,p=[];for(let $=0;$<u;$++){let k=l+c*$/u,w=Math.min(d,l+c*($+1)/u+.4);p.push(v`<path d=${Xs(i,a,k,w)} fill="none"
      stroke=${zu(e.colorHexes,($+.5)/u)} stroke-width=${Py*n}
      stroke-linecap=${$===0||$===u-1?"round":"butt"} />`)}let m=(e.value-e.minValue)/(e.maxValue-e.minValue),g=Ys(i,a,l+c*m),y=1.5,b=($,k,w,C)=>v`
    <defs><path id=${$} d=${Xs(i,a,k,w)} /></defs>
    <text font-size=${Ws*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${$}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return v`${p}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${zu(e.colorHexes,m)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?b(`${t}-gmin`,l-y-Math.max(o,3),l-y,e.minLabel):f}
    ${e.maxLabel!==void 0?b(`${t}-gmax`,d+y,d+y+Math.max(s,3),e.maxLabel):f}`}function Ir(e,n){let t=e.family in ze?e.family:"rectangular",i=n.slot??ze[t],a=ze[t],r=Hr(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=We(e.backgroundColorHex),l=We(e.borderColorHex),d=e.borderWidth*r.scale,c=e.elements,u=Xu(c),p=n.tint===void 0?void 0:`${o}-tint`,m=p===void 0?f:ay(p,n.tint);if(t==="corner"){let k=r.scale,w=!!e.bezelText||!!e.bezelGauge,C=e.curvedText??"",L=C!=="",M=Fr(k,w),H=nl(k,w),A=H/(a.width*k),E=M.tile.cx-H/2,I=M.tile.cy-H/2,j=`M 0 0 H ${M.quad.width-M.cornerRadius} A ${M.cornerRadius} ${M.cornerRadius} 0 0 1 ${M.quad.width} ${M.cornerRadius} V ${M.quad.height} H 0 Z`,W=f;if(e.bezelGauge)W=Ny(e.bezelGauge,k,o);else if(e.bezelText){let P=Ly(k,`${o}-bezel`),_=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?bi((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;W=v`<defs><path id=${P.id} d=${P.d} /></defs>
        <text font-size=${Ru*k} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${P.id}" startOffset="50%" text-anchor="middle">${Hu(_,P.length,Ru*k)}</textPath></text>`}let q=f;if(L){let P=We(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},_=Zu(k,`${o}-curved`,_y*k,zy);q=v`<defs><path id=${_.id} d=${_.d} /></defs>
        <text font-size=${Fu*k} font-weight="600" fill=${P.color} fill-opacity=${P.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${_.id}" startOffset="50%" text-anchor="middle">${Hu(C,_.length,Fu*k*.88)}</textPath></text>`}else{let P=e.borderWidth*r.scale*A,_=l?v`<circle cx=${H/2} cy=${H/2} r=${H/2-P/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${P} />`:f;q=v`<g transform="translate(${E} ${I})">
        <g clip-path=${`url(#${o})`}>
          ${s?jn(v`<rect width=${H} height=${H} fill=${s.color} fill-opacity=${s.opacity} />`,"plain",p):f}
          <g data-design-box transform="scale(${r.scale*A})">
            ${c.map(R=>Ar(R,a,n,u,p))}
            ${Su(a,n.grid)}
          </g>
        </g>
        <circle cx=${H/2} cy=${H/2} r=${H/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*k} stroke-dasharray=${`${2*k} ${2*k}`} />
        ${jn(_,"plain",p)}
        <g transform="scale(${r.scale*A})">${Pu(c,a,n,u)}</g>
      </g>`}return v`<svg viewBox=${`0 0 ${M.quad.width} ${M.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${M.quad.width} height=${M.quad.height}>
      <defs><clipPath id=${o}><circle cx=${H/2} cy=${H/2} r=${H/2} /></clipPath>${m}</defs>
      <path d=${j} fill="#000000" />
      ${jn(W,"accent",p)}
      ${L?jn(q,"accent",p):q}
    </svg>`}let g=v`<rect width=${i.width} height=${i.height} />`,y=l?v`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:f,b=v`<rect width=${i.width} height=${i.height} fill="#000000" />`,$=`0 0 ${i.width} ${i.height}`;return v`<svg viewBox=${$} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${g}</clipPath>${m}</defs>
    <g clip-path=${`url(#${o})`}>
      ${b}
      ${s?jn(v`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`,"plain",p):f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${c.map(k=>Ar(k,a,n,u,p))}
            ${Su(a,n.grid)}
      </g>
    </g>
    ${jn(y,"plain",p)}
    <g transform="translate(${r.x} ${r.y}) scale(${r.scale})">${Pu(c,a,n,u)}</g>
  </svg>`}function Pu(e,n,t,i){if(t.handles!==!0||t.highlightId===void 0)return f;let a=e.find(r=>r.id===t.highlightId);return a===void 0?f:Ar(a,n,t,i,void 0,"handles")}var Dy=.14;function Oy(e,n){let t=sa(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function By(e,n,t){let i=e.family in ze?e.family:"rectangular",a=ze[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let p of r){let m=Oy(p,a),g=p.frame.rotationDegrees%180===0?0:Math.hypot(m.w,m.h)/2;o=Math.min(o,g?m.cx-g:m.x),s=Math.min(s,g?m.cy-g:m.y),l=Math.max(l,g?m.cx+g:m.x+m.w),d=Math.max(d,g?m.cy+g:m.y+m.h)}let c=l-o,u=d-s;if(r.length===0||!(c>0)||!(u>0))o=0,s=0,c=a.width,u=a.height;else{let p=Math.max(2,Math.max(c,u)*Dy);o-=p,s-=p,c+=2*p,u+=2*p}if(c/u<t){let p=u*t;o-=(p-c)/2,c=p}else{let p=c/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:c,h:u}}function Qu(e,n,t){let i=e.family in ze?e.family:"rectangular",a=ze[i],r=By(e,n,t.width/t.height),o=We(e.backgroundColorHex),s=We(e.borderColorHex),l=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,minDotRadius:r.w/40,minGridStroke:r.w/110,...t.imageSizes?{imageSizes:t.imageSizes}:{}},c=e.elements.filter(m=>n.includes(m.id)),u=s&&l>0?i==="rectangular"?v`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:f,p=i==="rectangular"?v`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return v`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${p}
    ${c.map(m=>Ar(m,a,d,Xu(e.elements)))}
    ${u}
  </svg>`}function ne(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var ln=["rectangular","circular","corner","inline"];function $i(e){return se.includes(e)}function ua(e){return ln.filter(n=>e.supportedFamilies.includes(n))}function il(e){return se.find(n=>e.supportedFamilies.includes(n))}function Lr(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function Vy(){return{value:V("")}}function ep(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=ln.filter(t=>t===n||e.supportedFamilies.includes(t))),$i(n)?e.perFamily[n]||(e.perFamily[n]=Pt()):e.inline||(e.inline=Vy()),e.schemaVersion=Rn(e)}function tp(e,n){if(Lr(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),$i(n)){for(let t of xt(e,n))fe(e,t.payload.id);delete e.perFamily[n],ct(e)}else delete e.inline;e.schemaVersion=Rn(e)}}function np(e,n){let t=[];if(!$i(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=xt(e,n).filter(r=>!ve(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var Xe={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},dn={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},al=["text","icon","gauge","chart","timeline","shape","image","tap"],te={content:"#4a7fe8",look:"#a15fe0",numbers:"#26a69a",position:"#66bb6a",states:"#f9a825",tap:Xe.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var ip="2.8.0";function pa(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function ap(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function rp(e,n=ip){let t=pa(e),i=pa(n);return!t||!i?!1:ap(t,i)>=0}function rl(e,n=null){if(n===null)return;let t=pa(e),i=pa(n);return!t||!i||ap(t,i)>=0?void 0:`Needs Wrist Assistant ${i[2]===0?`${i[0]}.${i[1]}`:i.join(".")} or later on your watch.`}function op(e,n=ip){return`${pa(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}var sp="52a9d81d0fd7";var lp="11fa18406cea";var Ke="mdi:";function Gy(e){return e.trim().replace(/\./g,"-")}function Uy(e){return e.trim().replace(/-/g,".")}var _r=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>Uy(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=Gy(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=We(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},zr=class{constructor(n,t="symbol-icons.json.gz",i=sp){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=We(i)??{color:"#FFFFFF",opacity:1};return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},ol=class{constructor(n,t){this.sf=n;this.mdi=new zr(t,"mdi-icons.json.gz",lp)}render(n,t,i){return(n.trim().startsWith(Ke)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function dp(e){let n=_r.available()?new _r(e):new zr(e);return new ol(n,e)}function cp(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var Nr=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],Dr=[...new Set(Nr.flatMap(e=>e.symbols))],Wy={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Ky(e){return`${e.replace(/\./g," ")} ${(Wy[e]??[]).join(" ")}`}function sl(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=Ky(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var Pr=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var jy=100;function up(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var qn=class e{constructor(n,t){this.config=n;this.testValues=new Map;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,yi(n),sn(n),Lc(n),this.baseline=JSON.stringify(hi(n))}static fromDocument(n,t){return new e(pi(n),t)}get dirty(){return JSON.stringify(hi(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){this.takeStep(t);let a=structuredClone(this.config);n(a),yi(a,i),sn(a),this.config=a}setTestValues(n,t){this.takeStep(t),this.testValues=n}takeStep(n){let t=Date.now();(this.held?this.heldStepTaken:n!==void 0&&n===this.coalesceKey&&t<this.coalesceUntil)||(this.past.push({config:structuredClone(this.config),testValues:this.testValues}),this.past.length>jy&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=n,this.coalesceUntil=n===void 0?0:t+800}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=_s(n),hi(n)}commit(){let n=structuredClone(this.config);return n.dataSources=_s(n),new e(n,null)}};var Or=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var Ci={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},wt={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},hp=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],mp={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},ll=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],qy=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function dl(e){return qy.includes(e)}function Yy(e){return ll.includes(e)}function Xy(e,n){return JSON.stringify(ue(e))===JSON.stringify(ue(n))}function cl(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!Yy(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Ci[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!Xy(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=pp(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${wt[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=pp(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${wt[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:Jy(i,n.otherwise),numberMode:i.length>0&&i.every(r=>dl(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function pp(e){let n=new Set;for(let t of e){let i=De[t.kind];if(n.has(i))return i;n.add(i)}}function Jy(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(De[a.kind]);for(let i of n??[])t.add(De[i.kind]);return hp.filter(i=>t.has(i))}function fp(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return hp.filter(a=>i.has(a)&&t.includes(a))}function Br(e,n){return e.find(t=>De[t.kind]===n)}function gp(e,n,t,i){let a=n.map(o=>({id:o.caseId??ee(),when:{join:o.join??"all",tests:[{id:o.testId??ee(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??ee(),cases:a};return t&&(r.otherwise=t),r}function ha(e){if(e.length===0)return"No states yet.";let n=cl(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function yp(e){return`No states yet. This ${e==="layout"?"shape":"layer"} looks the same whatever the value is.`}function Vr(e){return{state:`When the value matches, change how this ${e==="layout"?"shape":"layer"} looks.`,otherwise:"The look when no state above matches.",column:"Adds a column, so every state can change it."}}function bp(e){let n=e[0];return n||(n={id:ee(),cases:[]},e.push(n)),n}function xp(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function vp(e,n,t){let i=bp(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:ee(),when:{join:"all",tests:[{id:ee(),value:structuredClone(n),comparison:Qy(a,t)}]},then:[]})}function wp(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),xp(e))}function ul(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function pl(e,n){if(n){bp(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,xp(e))}function kp(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function $p(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>De[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function Zy(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Cp(e,n=Zy){let t=()=>n(e.value??V(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??V(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??V(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Gn(e.kind)==="value"?`${Ci[e.kind]} ${t()}`:Ci[e.kind]}}function Qy(e,n){if(!e)return n?{kind:"lessThan",value:V("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??V("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??V("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??V("0")};default:return{kind:e.kind,...Gn(e.kind)==="value"?{value:V("")}:{}}}}var Sp={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",chartTimes:"visibility",chartDots:"visibility",chartGrid:"visibility",imageTime:"visibility",layout:"backgroundColor"};function Tp(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function eb(e){switch(e){case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return v`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return v`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return v`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return v`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return v`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return v`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"chartDots":return v`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":return v`<path d="M4 7H20M4 12H20M4 17H20" />`;case"chartTimes":case"imageTime":case"clock":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return v`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return v`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return v`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return v`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return v`<path d="M6 9L12 15L18 9" />`;case"plus":return v`<path d="M12 5V19M5 12H19" />`;case"braces":return v`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return v`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"watch":return v`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return v`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return v`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return v`<path d="M6 14L12 8L18 14" />`;case"down":return v`<path d="M6 10L12 16L18 10" />`;case"left":return v`<path d="M14 6L8 12L14 18" />`;case"right":return v`<path d="M10 6L16 12L10 18" />`;case"show":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return v`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return v`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return v`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return v`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return v`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return v`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return v`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return v`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function U(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${eb(e)}</svg>`}var kt="color-mix(in srgb, var(--k) 45%, #6b7280)",Si='system-ui, -apple-system, "Segoe UI", sans-serif';function Ep(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let u=c*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function hl(e,n,t,i){return v`<g fill="none" stroke-linecap="round">
    <path d=${Ep(e,n,t,1)} stroke=${kt} stroke-width="2.6" opacity=".5" />
    <path d=${Ep(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function tb(e){switch(e){case"text":return v`<g font-family=${Si} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${kt}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${kt}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${kt}>1.2 kW</text>
      </g>`;case"icon":return v`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
      </g>`;case"gauge":return v`<g>
        ${hl(22,24,12,.28)}
        ${hl(60,24,12,.62)}
        ${hl(98,24,12,.92)}
        <text x="60" y="27" font-family=${Si} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return v`<g>
        <g opacity=".4" fill=${kt}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"timeline":return v`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${kt} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${kt} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${kt} opacity=".55" />
        <text x="6" y="39" font-family=${Si} font-size="7" fill=${kt}>1h ago</text>
        <text x="114" y="39" font-family=${Si} font-size="7" text-anchor="end" fill=${kt}>now</text>
      </g>`;case"shape":return v`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return v`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return v`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`;case"chartTimes":return v`<g font-family=${Si} font-size="8" fill="var(--k)">
        <text x="6" y="27">9 AM</text>
        <text x="60" y="27" text-anchor="middle">1 PM</text>
        <text x="114" y="27" text-anchor="end">5 PM</text>
      </g>`;case"chartDots":return v`<g fill="var(--k)">
        <circle cx="20" cy="30" r="3" /><circle cx="45" cy="18" r="3" /><circle cx="70" cy="24" r="3" /><circle cx="95" cy="12" r="3" />
      </g>`;case"chartGrid":return v`<g stroke="var(--k)" stroke-width="1.4" opacity=".7">
        <path d="M10 12H110M10 23H110M10 34H110" />
      </g>`;case"imageTime":return v`<g>
        <rect x="30" y="14" width="60" height="18" rx="9" fill="var(--k)" fill-opacity=".3" />
        <text x="60" y="27" text-anchor="middle" font-family=${Si} font-size="10" fill="var(--k)">3:41:07</text>
      </g>`}}function Mp(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${tb(e)}</svg>`}var Rp={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ap=e=>(...n)=>({_$litDirective$:e,values:n}),Gr=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,i){this._$Ct=n,this._$AM=t,this._$Ci=i}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}};var{I:nb}=Td,Hp=e=>e;var Fp=()=>document.createComment(""),Ti=(e,n,t)=>{let i=e._$AA.parentNode,a=n===void 0?e._$AB:n._$AA;if(t===void 0){let r=i.insertBefore(Fp(),a),o=i.insertBefore(Fp(),a);t=new nb(r,o,e,e.options)}else{let r=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let l;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(l=e._$AU)!==o._$AU&&t._$AP(l)}if(r!==a||s){let l=t._$AA;for(;l!==r;){let d=Hp(l).nextSibling;Hp(i).insertBefore(l,a),l=d}}}return t},cn=(e,n,t=e)=>(e._$AI(n,t),e),ib={},Ip=(e,n=ib)=>e._$AH=n,Lp=e=>e._$AH,Ur=e=>{e._$AR(),e._$AA.remove()};var _p=(e,n,t)=>{let i=new Map;for(let a=n;a<=t;a++)i.set(e[a],a);return i},zp=Ap(class extends Gr{constructor(e){if(super(e),e.type!==Rp.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);let a=[],r=[],o=0;for(let s of e)a[o]=i?i(s,o):o,r[o]=t(s,o),o++;return{values:r,keys:a}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){let a=Lp(e),{values:r,keys:o}=this.dt(n,t,i);if(!Array.isArray(a))return this.ut=o,r;let s=this.ut??=[],l=[],d,c,u=0,p=a.length-1,m=0,g=r.length-1;for(;u<=p&&m<=g;)if(a[u]===null)u++;else if(a[p]===null)p--;else if(s[u]===o[m])l[m]=cn(a[u],r[m]),u++,m++;else if(s[p]===o[g])l[g]=cn(a[p],r[g]),p--,g--;else if(s[u]===o[g])l[g]=cn(a[u],r[g]),Ti(e,l[g+1],a[u]),u++,g--;else if(s[p]===o[m])l[m]=cn(a[p],r[m]),Ti(e,a[u],a[p]),p--,m++;else if(d===void 0&&(d=_p(o,m,g),c=_p(s,u,p)),d.has(s[u]))if(d.has(s[p])){let y=c.get(o[m]),b=y!==void 0?a[y]:null;if(b===null){let $=Ti(e,a[u]);cn($,r[m]),l[m]=$}else l[m]=cn(b,r[m]),Ti(e,a[u],b),a[y]=null;m++}else Ur(a[p]),p--;else Ur(a[u]),u++;for(;m<=g;){let y=Ti(e,l[g+1]);cn(y,r[m]),l[m++]=y}for(;u<=p;){let y=a[u++];y!==null&&Ur(y)}return this.ut=o,Ip(e,l),Rt}});var Pp="sun.sun";function Np(e){let n=e?.[Pp],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:Pp,displayName:t||"Sun",domain:"sun"}}var Dp=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],ab=[0,1,2,3,4];function Op(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function ml(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var Bp=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function rb(e){return[Vp(e,"below_horizon")]}function ob(e){return[Vp(e,"above_horizon")]}function Vp(e,n){return{id:ee(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:V(n)}}}function sb(e,n=0){return[{id:ee(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:V(String(n))}}]}function lb(e=ab){return[{id:ee(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:ml(e)}}]}function db(e="22:00",n="06:00"){return[{id:ee(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:V(e),upper:V(n)}}]}function Gp(e,n){switch(e){case"afterSunset":return rb(n);case"daytime":return ob(n);case"sunElevation":return sb(n);case"weekday":return lb();case"timeBetween":return db()}}function fl(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function ga(e){for(let n of e)delete n.partId}function Up(e,n=ee()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==pe&&(t.bandAboveColorHex=e.bandAboveColorHex)),fl(e),e.parts=[t],e.value=Ki(e.parts),n}function Wr(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,ga(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),fl(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,ga(e.rules),{ok:!0,joined:!1,moved:r}}let i=gl(t,n);return i.ok?(e.value=i.value,fl(e),delete e.parts,ga(e.rules),{ok:!0,joined:!0}):i}function ma(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function fa(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function cb(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=_e(i)?s.format:i,t=s}let a={kind:t.kind};return _e(i)||(a.format=i),a}function ub(e,n){let t=cb(e,n);if(!t)return{blocked:"kind"};let i=Fn(t);if(i!==void 0)return fa(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${ma(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let c=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(c&&u)return fa(r.prefix??"")+a.value+fa(r.suffix??"");c?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let c=ia(a);if(c===void 0)return{blocked:"kind"};s=c;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let c=`(${s} | float(0))`;r.multiply!==void 0&&(c=`(${c} * ${r.multiply})`),r.offset!==void 0&&(c=`(${c} + ${r.offset})`),s=r.decimals!==void 0?`${ma(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${c})`:c}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${ma(l)}, 'unit_of_measurement') %}`);let d="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let c=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[ma(r.prefix)]:[],`(${s})`,...l!==void 0?[d]:[],...r.suffix?[ma(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${c} }}`}return o+fa(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${d} }}`:"")+fa(r.suffix??"")}function gl(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:Ki(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=ub(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}var qr=[["threshold","Threshold line"],["now","Now line"],["zero","Zero line"],["grid","Grid lines"],["dots","Dots"],["times","Clock times"]],Kp=[{label:"Newest",stat:"latest",marker:"latest"},{label:"First",stat:"first",marker:"first"},{label:"Highest",stat:"highest",marker:"highest"},{label:"Lowest",stat:"lowest",marker:"lowest"},{label:"Average",stat:"average"},{label:"Change",stat:"delta"},{label:"Total",stat:"sum"},{label:"Trend",stat:"trend"},{label:"Top of scale",stat:"top"},{label:"Bottom of scale",stat:"bottom"},{label:"Now",marker:"now"}],Yn="color-mix(in srgb, var(--k) 30%, #6b7280)",jr='system-ui, -apple-system, "Segoe UI", sans-serif',pn=40,Kr=6,pb=[22,17,11,16,27,23,35,31];function hb(e={}){let n=(e.values??[]).filter(p=>Number.isFinite(p)),t=n.length>=2,i=t?n:pb,a=Math.min(...i),r=Math.max(...i);t&&e.threshold!==void 0&&Number.isFinite(e.threshold)&&(a=Math.min(a,e.threshold),r=Math.max(r,e.threshold)),r===a&&(r+=1,a-=1);let o=p=>Kr+(r-p)/(r-a)*(pn-Kr),s=i.length,l=i.map((p,m)=>10+m*100/(s-1)),d=i.map(o),c=p=>Math.min(pn,Math.max(Kr,p)),u=t&&e.now!==void 0&&Number.isFinite(e.now)?Math.min(s-1,Math.max(0,Math.round(e.now))):Math.round((s-1)*.6);return{xs:l,ys:d,y:o,real:t,zeroY:c(o(0)),thresholdY:c(o(t&&e.threshold!==void 0?e.threshold:(a+r)/2)),averageY:o(i.reduce((p,m)=>p+m,0)/s),column:{highest:i.indexOf(Math.max(...i)),lowest:i.indexOf(Math.min(...i)),first:0,latest:s-1,now:u}}}function mb(e){let n=e.xs.map((t,i)=>`${i===0?"M":"L"}${t.toFixed(1)} ${e.ys[i].toFixed(1)}`).join("");return v`
    <path d=${`${n}L${e.xs[e.xs.length-1]} ${pn}L${e.xs[0]} ${pn}Z`} fill=${Yn} opacity=".18" />
    <path d=${n} fill="none" stroke=${Yn} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`}function fb(e){let n=Math.min(10,Math.max(1,100/e.xs.length*.7));return v`${e.xs.map((t,i)=>{let a=Math.min(e.ys[i],pn-1);return v`<rect x=${t-n/2} y=${a} width=${n} height=${pn-a} rx=${Math.min(2,n/2)} fill=${Yn} opacity=".45" />`})}`}function gb(){return v`${[[4,30,.35],[35,18,.7],[54,10,.35],[65,26,.7],[92,24,.35]].map(([n,t,i])=>v`<rect x=${n} y="10" width=${t} height="16" rx="3" fill=${Yn} opacity=${i} />`)}`}function yb(){return v`
    <rect x="3" y="3" width="114" height="40" rx="5" fill=${Yn} opacity=".22" />
    <circle cx="30" cy="16" r="6" fill=${Yn} opacity=".6" />
    <path d="M3 43L3 36L34 20L56 32L80 16L117 38L117 43Z" fill=${Yn} opacity=".5" />`}function un(e,n,t=2.6){return v`<circle cx=${e.xs[n]} cy=${e.ys[n]} r=${t} fill="var(--k)" />`}function $t(e,n=!1){if(e===void 0||e==="")return"";let t=e.length*5.8+5,i=n?36:13;return v`<rect x="2" y=${i-9.5} width=${t} height="12.5" rx="3" fill="#000" fill-opacity=".7" />
    <text x="4.5" y=${i} font-family=${jr} font-size="10" font-weight="700" fill="var(--k)">${e}</text>`}function ya(e,n=!1){return v`<path d=${`M4 ${e}H116`} stroke="var(--k)" stroke-width="1.4" stroke-dasharray=${n?"4 3":"none"} />`}function Wp(e){return v`<g font-family=${jr} font-size="6.5" fill="var(--k)">
    <text x="4" y=${e}>9 AM</text><text x="60" y=${e} text-anchor="middle">1 PM</text><text x="116" y=${e} text-anchor="end">5 PM</text>
  </g>`}function bb(e,n,t){if(e==="timeline:times")return Wp(38);if(e==="image:time")return v`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${jr} font-size="7" fill="var(--k)">3:41:07</text>`;let[i,a]=e.split(":"),r=Math.min(2.2,Math.max(.8,40/n.xs.length));if(i==="draw")switch(a){case"threshold":return ya(n.thresholdY,!0);case"now":return v`<path d=${`M${n.xs[n.column.now]} 4V${pn+2}`} stroke="var(--k)" stroke-width="1.4" />`;case"zero":return v`${ya(n.zeroY)}<text x="115" y=${Math.max(9,n.zeroY-3)} text-anchor="end" font-family=${jr} font-size="6.5" fill="var(--k)">0</text>`;case"times":return Wp(45);case"dots":return v`${n.xs.map((d,c)=>un(n,c,r))}`;case"grid":return v`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`}if(i==="number"){let d=n.real?t[a]:void 0,{first:c,latest:u}=n.column;switch(a){case"latest":return v`${un(n,u)}${$t(d)}`;case"first":return v`${un(n,c)}${$t(d)}`;case"highest":return v`${un(n,n.column.highest)}${$t(d)}`;case"lowest":return v`${un(n,n.column.lowest)}${$t(d)}`;case"average":return v`${ya(n.averageY,!0)}${$t(d)}`;case"delta":return v`<path d=${`M${n.xs[c]} ${n.ys[c]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />
        ${un(n,c)}${un(n,u)}${$t(d)}`;case"sum":return v`${n.xs.map((p,m)=>un(n,m,r))}${$t(d)}`;case"trend":return v`<path d=${`M${n.xs[c]} ${n.ys[c]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />${$t(d)}`;case"top":return v`${ya(Kr)}${$t(d,!0)}`;case"bottom":return v`${ya(pn)}${$t(d)}`}}let o=n.column[a]??0,s=n.xs[o],l=Math.max(5,n.ys[o]-7);return a==="highest"?v`<path d=${`M${s} ${l-4}L${s+4} ${l+3}L${s-4} ${l+3}Z`} fill="var(--k)" />`:a==="now"?v`<path d=${`M${s-4} ${l-3}L${s+4} ${l-3}L${s} ${l+4}Z`} fill="var(--k)" />`:v`<circle cx=${s} cy=${l} r="3" fill="var(--k)" />`}function yl(e){return e==="timeline:times"?"timeline":e==="image:time"?"image":"chart"}function jp(e,n,t=!1,i={}){let a=hb(i),r=e==="timeline"?gb():e==="image"?yb():t?fb(a):mb(a),o=n!==void 0&&yl(n)===e?bb(n,a,i.texts??{}):"";return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${r}${o}</svg>`}function qp(e){if(e==="timeline:times")return"Clock times";if(e==="image:time")return"Timestamp";let[n,t]=e.split(":");return n==="draw"?qr.find(([i])=>i===t)?.[1]??t:n==="number"?`${gt.find(([i])=>i===t)?.[1]??t} number`:`${yt.find(([i])=>i===t)?.[1]??"Reading"} marker`}var xb={"draw:threshold":"A flat line at a value you pick, so a reading over it stands out.","draw:now":"An upright line through the reading that counts as now.","draw:zero":"A flat line where zero falls. It is drawn only when the readings cross zero.","draw:times":"The clock times of the chart's span, spread under the plot.","draw:dots":"A dot on every reading. Line and area charts only.","draw:grid":"Faint rules across the plot, to read heights against.","number:latest":"A text layer printing the newest reading, with the entity's unit after it.","number:first":"A text layer printing the oldest reading in the span.","number:highest":"A text layer printing the highest reading in the span.","number:lowest":"A text layer printing the lowest reading in the span.","number:average":"A text layer printing the average of every reading in the span.","number:delta":"A text layer printing the newest reading minus the first, with the unit after it.","number:sum":"A text layer printing every reading in the span added up, with the unit after it.","number:trend":"A text layer printing the change as an arrow: up, down, or flat when it is too small to print.","number:top":"A text layer printing the value at the top of the plot. On a Fixed scale, this is Max.","number:bottom":"A text layer printing the value at the bottom of the plot. On a Fixed scale, this is Min.","marker:highest":"An icon over the highest reading. It starts as a triangle.","marker:lowest":"An icon over the lowest reading. It starts as a dot.","marker:now":"An icon over the reading that counts as now.","marker:first":"An icon over the oldest reading.","marker:latest":"An icon over the newest reading.","marker:threshold":"An icon at the threshold's height.","marker:zero":"An icon at zero's height.","timeline:times":"The clock times of the timeline's span, spread under the strip.","image:time":"The time the picture was fetched, so a picture that stops updating reads as stale."};function bl(e){return xb[e]}function Yp(e){let n=ji(e),t=e.fillColorHex!==void 0;if(e.style==="bars"){let i=e.barBorderWidth!==void 0;if(!n)return{main:"Bar colour",...t?{fill:{label:"Fill colour",empty:"Bar colour",note:"Fills every bar in place of Bar colour, even when a state changes the colour. Clear it to fill in Bar colour.",warn:!0}}:{},...i?{border:{label:"Border colour",empty:"White"}}:{}};let a={};return i?(a.fill={label:"Band fill",empty:"Each band's colour",...t?{note:"Every band with no fill of its own fills in this."}:{}},a.border={label:"Band border",empty:"White",note:"Every band with no border of its own uses this."}):t&&(a.fill={label:"Band fill",empty:"Each band's colour",note:"This fill wins over every band's colour. Clear it to fill each bar in its band's colour.",warn:!0}),a}return e.style==="line"?n?{}:{main:"Line colour"}:n?t?{fill:{label:"Fill colour",empty:"Band colours",...e.fillBands?{note:"A fill colour wins over Band fill. Clear it to fill each stretch in its band's colour.",warn:!0}:{}}}:e.fillBands?{}:{main:"Fill colour"}:{main:"Line colour",fill:{label:"Fill colour",empty:"Line colour"}}}function vb(e){switch(e){case"light":return v`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return v`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return v`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return v`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return v`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return v`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return v`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return v`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return v`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return v`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return v`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return v`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return v`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return v`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return v`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return v`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return v`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return v`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return v`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return v`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return v`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return v`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return v`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return v`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return v`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return v`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return v`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return v`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return v`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function xl(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${vb(e)}</svg>`}var wb={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Xp(e){let n=wb[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var kb=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function vl(e){return kb.has(e.trim().toLowerCase())}function $b(e,n,t){let i=hr({frame:{...e.frame},isHidden:!1},e.family,n,t).frame;return Sr(i,{})}var Il=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function we(e){return n=>e(n.target.value)}function Dt(e,n){let t=n===void 0?rl(e.watchAppVersion):rl(e.watchAppVersion,n);return t===void 0?f:h`<div class="hint keep">${t}</div>`}function Ta(e){if(e===void 0||e.atDefault)return f;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function Ve(e,n,t){let i=Ta(n),a=[i===f?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?f:a} title=${t?"Drag left or right to change":f}
    @pointerdown=${t??f}>${e}${i}</span>`}var uo="wa-scrub-start",po="wa-scrub-end",Cb=3,Sb=3;function Tb(e,n){return e!==void 0&&Number.isFinite(e)?e:Math.max(0,n.min??0)}function Eb(e,n,t={}){let i=n!==void 0&&n>0?n:10**-Math.min(2,Ml(e));return t.coarse?i*10:t.fine?i/10:i}function Mb(e,n,t,i){let a=e+Math.round((n-e)/t)*t;return i.min!==void 0&&(a=Math.max(i.min,a)),i.max!==void 0&&(a=Math.min(i.max,a)),Number(a.toFixed(Math.min(10,Math.max(Ml(t),Ml(e)))))}function Ml(e){if(!Number.isFinite(e)||Number.isInteger(e))return 0;let n=String(e),t=/e-(\d+)$/.exec(n);return t?Number(t[1])+(n.split("e")[0].split(".")[1]??"").length:(n.split(".")[1]??"").length}function wh(e,n,t,i,a,r){let o=Tb(t,a),s=n.clientX,l=s,d=o,c=o,u=!1,p=g=>{if(!u){if(Math.abs(g.clientX-s)<Cb)return;u=!0,l=g.clientX,e.classList.add("scrubbing"),e.dispatchEvent(new CustomEvent(uo,{bubbles:!0,composed:!0}))}let y=Eb(o,a.step,{coarse:g.shiftKey,fine:g.altKey});d+=(g.clientX-l)/Sb*y,l=g.clientX,a.min!==void 0&&(d=Math.max(a.min,d)),a.max!==void 0&&(d=Math.min(a.max,d));let b=Mb(o,d,y,a);b!==c&&(c=b,i(b))},m=g=>{if(e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",m),e.removeEventListener("pointercancel",m),u){e.classList.remove("scrubbing"),e.dispatchEvent(new CustomEvent(po,{bubbles:!0,composed:!0}));let y=b=>{b.preventDefault(),b.stopPropagation()};e.addEventListener("click",y,{capture:!0,once:!0}),setTimeout(()=>e.removeEventListener("click",y,{capture:!0}),0)}r(u,g)};e.setPointerCapture(n.pointerId),e.addEventListener("pointermove",p),e.addEventListener("pointerup",m),e.addEventListener("pointercancel",m)}function ho(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;a.closest(".field")?.querySelector("input[type=number]")?.disabled||(i.preventDefault(),wh(a,i,e,n,t,()=>{}))}}function Ea(e,n,t){return i=>{let a=i.currentTarget;i.button!==0||!i.isPrimary||a.disabled||a.matches(":focus")||(i.preventDefault(),wh(a,i,e,n,t,(r,o)=>{r||o.type!=="pointerup"||(a.focus(),a.select())}))}}function mn(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function Re(e,n,t,i={}){return h`<label class="field">${Ve(e,mn(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${we(t)} /></label>`}function kh(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${we(t)}></textarea></label>`}function ae(e,n,t,i={}){let a=i.def===null?{atDefault:n===void 0,title:"Back to none",reset:()=>t(void 0)}:mn(n,i.def,t);return h`<label class="field num">${Ve(e,a,ho(n,t,i))}${mo(n,t,i)}</label>`}function mo(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??f} max=${t.max??f}
      aria-label=${t.ariaLabel??f} placeholder=${t.placeholder??f}
      data-scrub @pointerdown=${Ea(e,n,t)}
      @input=${we(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?f:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?f:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function Ce(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${Ve(e,mn(n,a.def,i,r))}
    <select @change=${we(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function ie(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${Ve(e,mn(n,a.def,o=>i(o,null),r))}
    ${ro(e,n,t,i,a)}</div>`}function ro(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??f} ?disabled=${a.disabled?.[r]===!0}
        @click=${d=>{r!==n&&i(r,d.currentTarget)}}>${o}</button>`})}
    </div>`}function Rb(e,n){let t=i=>mn(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${Ve(e.label,t(e))}
    <div class="pair-row">
      ${ro(e.label,e.value,e.options,e.set,e)}
      ${Ve(n.label,t(n))}
      ${ro(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function Qn(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${Ve(e,mn(n,i.def,t,a),ho(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?f:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${we(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${mo(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function Be(e,n,t,i,a={}){return h`<label class="field check">${Ve(e,mn(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function ye(e,n,t,i=!1,a){let{rgb:r,alpha:o}=$h(n),s=a===void 0?void 0:{atDefault:_l(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${Ve(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${d=>t(d.target.checked?io(r,o):void 0)} />`:f}
      ${fo(e,n,t,l)}
    </div></div>`}function $h(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function io(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function fo(e,n,t,i=!1,a="#RRGGBB"){let{valid:r,swatch:o,rgb:s,alpha:l}=$h(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!r?"transparent":o}`} title="Pick a colour">
        <input type="color" .value=${s} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${we(d=>t(io(d,l)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder=${a} spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${we(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&t(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(l)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          data-scrub @pointerdown=${Ea(l,d=>t(io(s,d)),{step:1,min:0,max:100})}
          @input=${we(d=>{let c=Number(d);d.trim()!==""&&c>=0&&c<=100&&t(io(s,Math.round(c)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function Ll(e,n,t,i){let a={atDefault:n===void 0,title:`Back to ${t.toLowerCase()}`,reset:()=>i(void 0)};return h`<div class="field color">${Ve(e,a)}
    <div class="color-row">${fo(e,n,i,!1,t)}</div></div>`}function wl(e,n,t){return h`${Ll(e.label,n,e.empty,t)}${e.note===void 0?f:h`<div class=${e.warn?"hint warn":"hint"}>${e.note}</div>`}`}function _l(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function go(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function Ab(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function Jp(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Ch=50;function Hb(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function Fb(e,n,t=Ch,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;d===a?p=0:d.startsWith(a)?p=1:c.startsWith(a)?p=2:d.includes(a)?p=3:c.includes(a)?p=4:o.length>1&&o.every(m=>d.includes(m)||c.includes(m))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(m=>d.includes(m)||c.includes(m)||u.includes(m)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var Ib=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Sh(e){return Ib.test(e.trim())}function Lb(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return go(t,i);if(Sh(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var Jn=new Map;function Ae(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function zl(e){return Jn.has(e)}function Ct(e,n,t,i,a,r={}){let o=e.hass.states,s=Jn.get(a),l=s?Fb(Ab(o,r.domain,Jp(e.hass)),s.query,Ch,r.preferNumeric?Hb:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=t.entityId?o[t.entityId]:void 0,u=(w,C,L=0)=>{Jn.set(a,{query:C,index:L}),Ae(w)},p=w=>{Jn.delete(a),Ae(w)},m=w=>{let C=Lb(w,t,o);C&&i(C)},g=(w,C)=>{i(go(o,w.entityId)),p(C)},y=()=>Math.max(0,Math.min(Jn.get(a)?.index??0,l.length-1)),b=w=>{let C=w.target;if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault();let L=Jn.get(a);if(!L){u(C,C.value);return}let M=w.key==="ArrowDown"?y()+1:y()-1;u(C,L.query,Math.max(0,Math.min(l.length-1,M))),_b(C);return}if(w.key==="Enter"){w.preventDefault();let L=l[y()];s&&L?g(L,C):(m(C.value),p(C));return}if(w.key==="Escape"){if(!s)return;w.preventDefault(),w.stopPropagation(),p(C)}},$=t.entityId?Jp(e.hass)?.(t.entityId):void 0,k=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:c?h`<div class="entity-current">
          <span class="ent-ico ${vl(c.state)?"on":""}">${xl(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${$?h`<span class="ent-area">${$}</span>`:f}
          <span class="ent-state">${c.state}</span>
        </div>`:h`<div class="hint warn">Not in Home Assistant right now.</div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${U("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${w=>{let C=w.target;u(C,t.entityId),C.select()}}
        @input=${w=>{let C=w.target;u(C,C.value)}}
        @keydown=${b}
        @blur=${w=>{let C=w.target;s&&m(C.value),p(C)}} />
      ${(s?s.query:t.entityId)===""?f:h`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${w=>w.preventDefault()}
        @click=${w=>{let C=w.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),Jn.set(a,{query:"",index:0}),Ae(C),C?.focus()}}>${U("close")}</button>`}
    </div>
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${Sh(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((w,C)=>h`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${L=>L.preventDefault()} @click=${L=>g(w,L.target)}>
                <span class="ent-ico ${vl(w.state)?"on":""}">${xl(w.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${w.name}</span>
                  <span class="ent-sub">
                    ${w.area?h`<span class="ent-area">${w.area}</span>`:f}
                    <span class="ent-id mono">${w.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Xp(w.domain)}</span>
                  <span class="ent-state">${w.state}</span>
                </span>
              </button>`)}
        </div>`:k}
  </div>`}function _b(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Zp=120;function zb(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(Nr.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(Dr),fromPack:!1}}function Qp(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function Pb(e){return[{value:"",label:`Starter set (${Qp(Dr,e)})`},...Nr.map(n=>({value:n.name,label:`${n.name} (${Qp(n.symbols,e)})`}))]}function Nb(e){return e.length>0?e.length:Dr.length}function eh(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Yr(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function Th(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),d=l??[],c=new Set(d),u=n.trim(),p=u.startsWith(Ke),m=a!==void 0,g=m?r.pack(i)??(p?"mdi":"sf"):"sf",y=Db(u,c),b=w=>{t(w),a?.(w.startsWith(Ke)?e.icons.mdiPath?.(w):void 0),r.noteUsed(w)},$=w=>{if(t(w),!m)return;let C=w.trim();a?.(C.startsWith(Ke)?e.icons.mdiPath?.(C):void 0)},k=f;if(o&&g==="mdi"){let w=e.icons.mdiNames?.(),C=Ob(w??[],s),L=C.slice(0,Zp),M=r.recent.filter(H=>H.startsWith(Ke));k=h`<div class="sym-browse">
      ${th(r,i,g)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${we(H=>r.setQuery(i,H))} />
      </div>
      ${M.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${M.map(H=>Yr(e,H,H===u,b))}</div>`}
      <div class="sym-grid">${L.map(H=>Yr(e,H,H===u,b))}</div>
      ${w===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:C.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${eh(L.length,C.length,!0,w.length)}</div>`}
      ${w!==void 0&&p&&!w.includes(u)?h`<div class="hint warn">There is no <code>${u}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:f}
    </div>`}else if(o){let w=r.category(i),C=zb(w,s,d,c),L=sl(C.names,s),M=C.fromPack?L.slice(0,Zp):L,H=r.recent.filter(E=>!E.startsWith(Ke)),A=c.size===0?H:H.filter(E=>c.has(E));k=h`<div class="sym-browse">
      ${m?th(r,i,g):f}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${we(E=>r.setQuery(i,E))} />
        <select @change=${we(E=>r.setCategory(i,E))}>
          ${Pb(c).map(E=>h`<option value=${E.value} ?selected=${E.value===w}>${E.label}</option>`)}
        </select>
      </div>
      ${A.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${A.map(E=>Yr(e,E,E===u,b))}</div>`}
      <div class="sym-grid">${M.map(E=>Yr(e,E,E===u,b))}</div>
      ${L.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${eh(M.length,L.length,s.trim()!=="",Nb(d))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${we($)} @change=${we(w=>{let C=w.trim();C.startsWith(Ke)?e.icons.mdiPath?.(C)!==void 0&&r.noteUsed(w):(c.size===0||c.has(C))&&r.noteUsed(w)})} /></label>
    ${y?h`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${k}`}function Db(e,n){let t=e.trim();return t!==""&&!t.startsWith(Ke)&&n.size>0&&!n.has(t)}function Ob(e,n){let t=n.trim(),i=t.startsWith(Ke)?t.slice(Ke.length):t,a=e.map(r=>r.startsWith(Ke)?r.slice(Ke.length):r);return sl(a,i).map(r=>Ke+r)}function th(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var Bb=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Time since entity changed"],["aggregate","Several entities combined"],["chartStat","Number from a chart"],["time","Clock and date"],["dataAge","Time since last refresh"],["jinja","Template (Jinja)"],["named","Shared value"]],Vb={literal:"Words or a number you type. It never changes.",entityState:"What Home Assistant shows for the entity, like 21.5 or on.",entityAttribute:"One detail the entity carries besides its state, like a light's brightness.",entityAge:"Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",aggregate:"Count several entities, or take the sum, average, lowest or highest of their states.",time:"The time or date, read each time the complication refreshes.",dataAge:"Seconds since the watch last fetched values."},Gb=[["straight","Straight"],["smooth","Smooth"],["step","Step"]],Ub=[["flat","Flat"],["fade","Fade"]],Eh=[["auto","Auto"],["all","All"]],Wb=[["off","Off"],["light","Light"],["medium","Medium"],["strong","Strong"]],Mh=[["bars","Bars"],["line","Line"],["area","Area"]],Kb=[["auto","Auto"],["fixed","Fixed range"]],jb=[["lowest","Lowest value"],["zero","Zero"]],qb=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Rl=[["uniform","One colour"],["bands","By value"]];function oo(e){let n=[Xo,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:ee(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:ee(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function Pl(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function Yb(e,n){let t=Qt({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:ee(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function nh(e,n,t,i){return h`<span class="band-cell">${fo(e,n,t)}${Ta(i)}</span>`}function Xb(e,n){let t=(typeof n=="number"?[n]:n??[]).filter(s=>Number.isFinite(s)),i=[...e,...t];if(i.length===0)return{lo:-1,hi:1};let a=Math.min(...i),r=Math.max(...i),o=r>a?(r-a)*.12:Math.abs(a)/2||1;return{lo:a-o,hi:r+o}}var Jb=.1;function Zb(e,n,t,i=Jb){let a=[...e].sort((k,w)=>k-w),r=k=>Math.max(n,Math.min(t,k)),o=[n,...a.map(r),t],s=t-n||1,l=o.slice(1).map((k,w)=>Math.max(0,k-o[w])/s),d=Math.min(i,1/l.length),c=l.map(k=>k<d),u=c.filter(Boolean).length,p=l.reduce((k,w,C)=>k+(c[C]?0:w),0),m=1-u*d,g=l.length-u,y=l.map((k,w)=>c[w]?d:p>0?k/p*m:m/g),b=y.map((k,w)=>y.slice(0,w).reduce((C,L)=>C+L,0));return{shares:y,at:k=>{let w=r(k),C=o.length-2;for(let H=0;H<o.length-1;H++)if(w<=o[H+1]){C=H;break}let L=o[C+1]-o[C],M=L>0?(w-o[C])/L:0;return Math.max(0,Math.min(100,(b[C]+M*y[C])*100))}}}function Xr(e){return Math.abs(e)>=1e3||Number.isInteger(e)?String(Math.round(e*100)/100):String(Number(e.toPrecision(4)))}function Qb(e,n){let t=e.flatMap(m=>m.upTo===void 0?[]:[m.upTo]),{lo:i,hi:a}=Xb(t,n),{shares:r,at:o}=Zb(t,i,a),s=typeof n=="number"&&Number.isFinite(n)?n:void 0,l=typeof n=="object"?n.filter(m=>Number.isFinite(m)):[],d=l.length>0?Math.min(...l):void 0,c=l.length>0?Math.max(...l):void 0,u=-1/0,p=[...t].sort((m,g)=>m-g).flatMap(m=>{let g=o(m);return g-u<12?[]:(u=g,[h`<span style=${`left:${g}%`}>${Xr(m)}</span>`])});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${e.map((m,g)=>h`<i class=${m.border===void 0?"":"bordered"}
      style=${`flex-grow:${r[g]??0};--f:${m.fill}${m.border===void 0?"":`;--b:${m.border}`}`}></i>`)}</div>
    ${d===void 0||c===void 0?f:h`<span class="span" style=${`left:${o(d)}%;width:${o(c)-o(d)}%`}
      title=${d===c?`Reads ${Xr(d)}`:`Reads ${Xr(d)} to ${Xr(c)}`}></span>`}
    ${s===void 0?f:h`<span class="now" style=${`left:${o(s)}%`} title=${`Now ${s}`}></span>`}
    ${p.length===0?f:h`<div class="ticks" aria-hidden="true">${p}</div>`}
  </div>`}function so(e,n,t,i,a){let r=Qt({bands:e.bands}),o=typeof i=="number"&&Number.isFinite(i)?i:void 0,s=o===void 0?void 0:r.find(b=>o<=b.upTo)?.id??"above",l=(b,$)=>k=>{let w=k.bands.find(C=>C.id===b);w&&$(w)},d=e.bandAboveColorHex,c={atDefault:_l(d,pe),title:`Back to ${pe}`,reset:()=>t(b=>{b.bandAboveColorHex=pe})},u=a?.border===!0,p=(b,$,k,w,C)=>{if(!u)return fo(b,$.colorHex,E=>k(E??"#FFFFFF"));let L=a?.fillHex,M=a?.borderHex,H=$.fillColorHex===void 0?void 0:{atDefault:!1,title:"Back to the chart fill colour",reset:()=>w(void 0)},A=$.borderColorHex===void 0?void 0:{atDefault:!1,title:`Back to ${M===void 0?"white":"the chart border colour"}`,reset:()=>C(void 0)};return h`
      ${nh(`${b} fill`,$.fillColorHex??L??$.colorHex,E=>{E!==void 0&&(k(E),w(L===void 0?void 0:E))},H)}
      ${nh(`${b} border`,$.borderColorHex??M??Bi,E=>C(E),A)}`},m=(b,$)=>{let k=r[b];return h`<input type="number" class="band-up" step="any" .value=${String(k.upTo)} aria-label=${$}
      title=${`Band ${b+1} runs up to and including this number`}
      data-scrub @pointerdown=${Ea(k.upTo,w=>t(l(k.id,C=>{C.upTo=w})),{...b>0?{min:r[b-1].upTo}:{},...b<r.length-1?{max:r[b+1].upTo}:{}})}
      @change=${we(w=>{let C=Number(w);w.trim()!==""&&Number.isFinite(C)&&t(l(k.id,L=>{L.upTo=C}))})} />`},g=(b,$)=>({...b===void 0?{}:{upTo:b},fill:u?$.fillColorHex??a?.fillHex??$.colorHex:$.colorHex,...u?{border:$.borderColorHex??a?.borderHex??Bi}:{}}),y=[...r.map(b=>g(b.upTo,b)),g(void 0,{colorHex:d,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}})];return h`<div class=${u?"bands split":"bands"}>
    ${Qb(y,o??(typeof i=="object"?i:void 0))}
    ${!u||r.length===0?f:h`<div class="band-row band-head" aria-hidden="true">
      <span></span><span>Fill</span><span>Border</span><span></span>
    </div>`}
    ${r.map((b,$)=>h`
      <div class="band-row ${s===b.id?"hit":""}">
        <span class="range">${$===0?h`<span class="le">Less than</span>${m($,"Less than")}`:h`${m($-1,"From")}<span class="to">to</span>${m($,"Up to")}`}</span>
        ${p(`Up to ${b.upTo}`,b,k=>t(l(b.id,w=>{w.colorHex=k}),`bcol${b.id}`),k=>t(l(b.id,w=>{k===void 0?delete w.fillColorHex:w.fillColorHex=k}),`bfill${b.id}`),k=>t(l(b.id,w=>{k===void 0?delete w.borderColorHex:w.borderColorHex=k}),`bborder${b.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(k=>{k.bands=k.bands.filter(w=>w.id!==b.id)})}>${U("close")}</button>
      </div>`)}
    <div class="band-row ${s==="above"?"hit":""}">${Ta(c)}
      <span class="range">${r.length===0?h`<span class="else">Every value</span>`:h`<span class="le">Greater than</span>${m(r.length-1,"Greater than")}`}</span>
      ${p("Above the last band",{colorHex:d,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}},b=>t($=>{$.bandAboveColorHex=b},"babove"),b=>t($=>{b===void 0?delete $.bandAboveFillColorHex:$.bandAboveFillColorHex=b},"bafill"),b=>t($=>{b===void 0?delete $.bandAboveBorderColorHex:$.bandAboveBorderColorHex=b},"baborder"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(b=>{b.bands=[...b.bands,Yb(b.bands,n)]})}>+ Band</button>
  </div>`}function ex(e,n,t,i){let a=new Map,r=new Map,o=(d,c)=>{let u=d.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+c)};e.forEach((d,c)=>{let u=e[c+1],p=u===void 0?n:u.offsetSeconds;o(d.state,Math.max(0,p-d.offsetSeconds))}),t!==void 0&&o(t,0),(Ji[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,c)=>c[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function tx(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${Re("State",o.match,l=>n(d=>{let c=d.bands[s];c&&(c.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${ye("Colour",o.colorHex,l=>n(d=>{let c=d.bands[s];c&&(c.colorHex=l??en)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((d,c)=>c!==s)})}>${U("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:ee(),match:r,colorHex:ja(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${ye("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??en},"tother"),!1,en)}`}var nx=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"]],ix={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled"};function ih(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return V(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var ax=[["now","Time (14:05)"],["hour","Hour"],["minute","Minute"],["weekday","Day of the week (0 is Monday)"],["day","Day of the month"],["month","Month number"],["timestamp","Unix timestamp (seconds)"]];function rx(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function le(e,n,t,i){if(i.inline||!ox())return h`<div class="value-editor">${Fh(e,n,t,i)}</div>`;let a=yo(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=Me(n,me(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?f:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?f:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Rh(e,a,r,n,t,i)}
  </div>`}function Rh(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${Hh}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${ka.has(n)?Fh(e,i,a,r):f}
  </div>`}function me(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function yo(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function ox(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var ka=new Set,ba=new WeakMap;function sx(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function Ah(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function Hh(e){let n=e.currentTarget,t=e.newState==="open",i=ba.get(n);if(i&&(i(),ba.delete(n)),!t){ka.delete(n.id)&&Ae(n);return}let a=sx(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){ba.get(n)?.(),ba.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}kl(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),ba.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),kl(n,a.getBoundingClientRect()),ka.has(n.id)||(ka.add(n.id),Ae(n),requestAnimationFrame(()=>{n.isConnected&&kl(n,a.getBoundingClientRect())}))}function kl(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=lx({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Xn=8,Jr=6,ah=140;function lx(e,n,t){let i=t.height-e.bottom-Jr-Xn,a=e.top-Jr-Xn,r=n.height>i&&a>i&&i<ah,o=Math.max(ah,r?a:i),s=Math.min(n.height,o),l=Math.max(Xn,Math.min(e.left,t.width-n.width-Xn)),d=r?Math.max(Xn,e.top-Jr-s):Math.max(Xn,Math.min(e.bottom+Jr,t.height-s-Xn));return{left:l,top:d,maxHeight:o,above:r}}function Fh(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,s=Bb.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=f;switch(a.kind){case"literal":l=i.symbol?Th(e,a.value,c=>r({...a,value:c}),o,i.setSymbolPath):Re("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=Ct(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${Ct(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${Re("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${c.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=gx(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=Ce("Field",a.timeField,ax,c=>r({...a,timeField:c}));break;case"dataAge":break;case"jinja":l=h`${kh("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":{let c=e.config.values.find(p=>p.id===a.id),u=c?Qi(e.config,c.id):0;l=e.config.values.length===0?h`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${()=>mx(e,n,t)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`:h`${Ce("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}))}
          ${c?h`<div class="hint keep">Read by ${u} ${u===1?"layer":"layers"}.
            <button type="button" class="link" @click=${()=>e.selectValue(c.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${()=>{let p=Ss(e.config,n);p&&t(p)}}>stop sharing</button>
            to give this one its own copy.</div>`:f}`;break}case"chartStat":{let c=me(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${Ce("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,He(p,c)])],p=>r({...a,layer:p}))}
          ${Ce("Number",a.stat,[...gt],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;break}}let d=Vb[a.kind];return h`
    ${Ce("Source",a.kind,s,c=>r(rx(a,c)))}
    ${d?h`<div class="hint">${d}</div>`:f}
    ${l}
    ${px(n,i)?h`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${()=>hx(e,n,t)}>Make shared</button>
      so other layers can read this too.</div>`:f}
    ${i.noFormat?f:fx(n.format,c=>t(_e(c)?{kind:n.kind}:{...n,format:c}),cx(dx(e,n)))}
    ${i.showResolved?ux(e,n,e.resolve(i.resolveAs??n)):f}`}function dx(e,n){let t=n.kind;for(let i=0;t.kind==="named"&&i<8;i++){let a=t.id.toUpperCase(),r=e.config.values.find(o=>o.id.toUpperCase()===a);if(!r)return;t=r.value.kind}return t.kind==="named"?void 0:t}function cx(e){if(!e)return{numbers:!0,textCase:!0,unit:!0,seconds:!0};switch(e.kind){case"literal":{let n=qe(e.value)!==void 0;return{numbers:n,textCase:!n,unit:!1,seconds:n}}case"entityState":case"entityAttribute":case"jinja":case"named":return{numbers:!0,textCase:!0,unit:e.kind!=="jinja"&&e.kind!=="named",seconds:!0};case"entityAge":case"dataAge":return{numbers:!0,textCase:!1,unit:!1,seconds:!0};case"aggregate":return{numbers:!0,textCase:!1,unit:!1,seconds:!1};case"chartStat":{let n=e.stat==="trend";return{numbers:!n,textCase:!1,unit:!n,seconds:!1}}case"time":return{numbers:e.timeField!=="now",textCase:!1,unit:!1,seconds:!1}}}function ux(e,n,t){let i=t===void 0?h`<span class="readout-v now-v none">${Ih(e,n)}</span>`:t.trim()===""?h`<span class="readout-v now-v none">Empty</span>`:h`<span class="readout-v now-v"><span class="now-tok">${t}</span></span>`;return h`<div class="field readout now-field"><span>Now</span>${i}</div>`}function Ih(e,n){let t=n.kind;switch(t.kind){case"entityState":case"entityAttribute":case"entityAge":return t.entityId===""?"Pick an entity":e.hass.states[t.entityId]?t.kind==="entityAttribute"&&t.attribute.trim()===""?"Pick an attribute":t.kind==="entityState"?"No reading":"Waiting for Home Assistant":"No such entity";case"chartStat":return t.layer===""?"Pick a chart":"The chart has no readings yet";case"named":{if(t.id==="")return"Pick a shared value";let i=t.id.toUpperCase(),a=e.config.values.find(r=>r.id.toUpperCase()===i);return a?Ih(e,a.value):"That shared value is gone"}case"jinja":return t.value.trim()===""?"Type a template":"Waiting for Home Assistant";default:return"Waiting for Home Assistant"}}function px(e,n){if(n.allowNamed===!1||n.noShare)return!1;let t=e.kind;return t.kind==="named"?!1:t.kind==="literal"||t.kind==="jinja"?t.value.trim()!=="":"entityId"in t?t.entityId!=="":t.kind==="chartStat"?t.layer!=="":!0}function hx(e,n,t){let i=Ma(n,me(e)).replace(/^"(.*)"$/,"$1"),{named:a,ref:r}=Cs(e.config,n,Oe(i,24));e.beginGesture(),e.update(o=>{o.values.push(a)}),t(r),e.endGesture()}function mx(e,n,t){let{named:i,ref:a}=Cs(e.config,{...n,kind:{kind:"literal",value:""}},"");i.name="",e.beginGesture(),e.update(r=>{r.values.push(i)}),t(a),e.endGesture(),e.selectValue(i.id)}function fx(e,n,t){let i=e??{},a=s=>{let l={...i,...s};for(let d of Object.keys(l))(l[d]===void 0||l[d]===!1||l[d]==="")&&delete l[d];n(l)},r=_e(e),o={decimals:t.numbers||i.decimals!==void 0,multiply:t.numbers||i.multiply!==void 0,offset:t.numbers||i.offset!==void 0,textCase:t.textCase||i.textCase!==void 0,unit:t.unit||!!i.useEntityUnit,seconds:t.seconds||!!i.relativeTime||!!i.duration};return h`<details class="sub format" ?open=${!r}>
    <summary>Format${r?h`<span class="sum-note">as it comes</span>`:h`<span class="sum-note">${Qh(e).replace(/^ \((.*)\)$/,"$1")}</span>`}</summary>
    <div class="grid2">
      ${o.decimals?ae("Decimals",i.decimals,s=>a({decimals:s}),{step:1,min:0,max:6,optional:!0,placeholder:"as is"}):f}
      ${o.multiply?ae("Multiply",i.multiply,s=>a({multiply:s}),{optional:!0,placeholder:"1"}):f}
      ${o.offset?ae("Plus",i.offset,s=>a({offset:s}),{optional:!0,placeholder:"0"}):f}
      ${o.textCase?ie("Case",i.textCase??"",[["","As is"],["upper","ABC"],["lower","abc"],["capitalized","Abc"]],s=>a({textCase:s||void 0}),{titles:{"":"Leave the letters as they are",upper:"UPPER CASE",lower:"lower case",capitalized:"Capital First Letters"}}):f}
      ${Re("Before",i.prefix??"",s=>a({prefix:s}),{placeholder:"text in front"})}
      ${Re("After",i.suffix??"",s=>a({suffix:s}),{placeholder:"text after"})}
    </div>
    ${o.unit?Be("Add unit",!!i.useEntityUnit,s=>a({useEntityUnit:s})):f}
    ${o.seconds?ie("Seconds as",i.duration?"duration":i.relativeTime?"relativeTime":"",[["","Number"],["relativeTime","Short"],["duration","Duration"]],s=>a({relativeTime:s==="relativeTime",duration:s==="duration"}),{titles:{"":"300",relativeTime:"One unit: 45s, 5m, 3h",duration:"Two units: 1h 23m, 5m 0s"}}):f}
  </details>`}function gx(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return h`
    ${Ce("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${ie("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?h`<div class="grid2">
          ${Re("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${Re("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${Re("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${Re("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:h`${o.entities.map((s,l)=>h`<div class="row-inline">
            ${Ct(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${U("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${Ce("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?Re("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):f}
    ${n.function==="count"?f:Re("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var Lh=ds,yx=Lh.filter(([e])=>e!=="none");function bx(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function _h(e,n){let t=bx(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return wc(e)?{type:e,...t}:{type:e}}var xx=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function zh(e,n,t,i){let a=n.serviceDataJSON??"",r=kc(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${Re("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${Re("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${xx.map(([s,l,d,c])=>h`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:d};c===""?delete u.serviceDataJSON:u.serviceDataJSON=c,t(u)}}>${s}</button>`)}
    </div>
    ${Ct(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${kh("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function vx(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function Ph(e){let n=e.config,t=n.tapAction,i=vx(e.savedName,n.name),a=n.refreshMinutes??0,r=rh.map(s=>[String(s),oh(s)]);rh.includes(a)||r.push([String(a),oh(a)]);let o=n.showSuccessFlash??!0;return h`
    <div class="gen-row">
      ${Re("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${Ce("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${Ce("Tap action",t.type,Lh,s=>e.update(l=>{l.tapAction=_h(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??wx).slice(0,7)}
                @input=${we(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in t?Ct(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):f}
    ${t.type==="callService"?zh(e,t,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):f}
    ${t.type==="openPage"?kx(e):f}`}var wx="#808080",rh=[0,15,30,60,120];function oh(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function kx(e){let n=e.config;return Nh(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function Nh(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${Ce("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?f:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}function Dh(e,n){let t=e.config.values.findIndex(o=>o.id===n.id),i=`nv-${n.id}`,a=Qi(e.config,n.id),r={kind:{kind:"named",id:n.id}};return h`
    ${Re("Name",n.name,o=>e.update(s=>{s.values[t].name=o},`${i}-name`),{placeholder:"Name it, like Outside temp"})}
    ${le(e,n.value,o=>e.update(s=>{s.values[t].value=o},i),{allowNamed:!1,showResolved:!0,resolveAs:r,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${a===0?"No layers yet":`${a} ${a===1?"layer":"layers"}`}</span></div>`}function Oh(){return{id:ee(),name:"",value:V("")}}function Le(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function ke(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=Le(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete d.size,o.placements[t]=d}function hn(e,n,t,i,a){let r=n.payload.id,o=pr(n)??a.min,s=Le(e.config,t,n).size??o;return ae(i,s,l=>e.update(d=>ke(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function Bh(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=Pt()),a=xt(e,n).filter(l=>!ve(e,l));if(a.length===0)return;let r=gi(e,a.map(l=>l.payload.id),n),o=Mn(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let d=e.elements.find(m=>m.payload.id===l);if(!d)continue;let c=s?.placements[l],u=c?.size??pr(d),p={frame:{...c?.frame??d.payload.frame},isHidden:c?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let m of se)m!==t&&delete e.perFamily[m]?.placements[l];i.placements[l]=hr(p,n,t,d.kind)}yi(e,t)}function bo(e,n){return qc(e,n)}function $x(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Zn(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"?void 0:e.payload.colorSlot.baseColorHex}function Vh(e,n,t){let i=$x(t.map(l=>Le(e,n,l).isHidden)),a=t.map(Zn),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var Ei=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],Cx=[["leading","Left"],["center","Center"],["trailing","Right"]],Sx=[["1","1"],["2","2"]];function Gh(e,n,t){let i=n.payload.id,a=yr(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:sh(n)},l=d=>{let c=e.hass.states[d]?.attributes?.device_class;return typeof c=="string"?c:void 0};return h`
    ${Ct(e,o?"Camera":"Entity",r,d=>e.update(c=>Yc(c,i,d,l(d.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${sh(n)?"warn":""}">${Ex(n,a)}</div>`}function sh(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.entity.entityId==="":!1}function Tx(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function xo(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Ex(e,n){let t=Tx(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a shared value, so change that shared value to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${xo(o)}.${r}`}function Mx(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Ca(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>Ca(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>Ca(e[a],n[a]))}function $l(e,n,t){return t.some(i=>!Ca(e[i],n[i]))}function Zr(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Se(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),d=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},c=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${U(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${Ta(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:f}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${c} aria-label=${c}
        @click=${p=>{p.stopPropagation(),d()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${U("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:f}
  </section>`}function Rx(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Ax(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function Hx(e,n){let t=he[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function Fx(e,n,t){let i=Hx(e,n),a=he[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${ie("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function Ix(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function Lx(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,d=Math.max(0,l-s.offsetSeconds),c=i[i.length-1];c!==void 0&&c.state.trim().toLowerCase()===s.state.trim().toLowerCase()?c.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${Ax(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function ei(e,n=In){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}function _x(e,n,t){if(!e||n===void 0||!n.averaged)return;let i=t.replace(/^Last\s+/,""),a=/^\d/.test(i)?`all ${i}`:`the whole ${i}`;return`This span has ${n.readings} readings, more than ${Lt}, so they are averaged into ${Lt} even slots to cover ${a}.`}var ao=new Set;function Al(e,n,t=In){return ao.has(e)||!t.some(i=>i.minutes===n)}function Cl(e,n,t,i,a=In){let r=Al(e,n,a);return h`<label class="field">${Ve("Span",{atDefault:n===t&&!r,title:`Back to ${ei(t,a)}`,reset:()=>{ao.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(ao.add(e),Ae(o.target)):(ao.delete(e),i(Number(s)||ar))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function Sl(e,n,t=!1){let i=t?Qo:rr,a=Math.floor(i/1440),r=t?Yi:In,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,d=(c,u,p)=>n(Math.min(i,Math.max(1,Math.round(c)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${ae("Days",o,c=>d(c??0,s,l),{step:1,min:0,max:a})}
      ${ae("Hours",s,c=>d(o,c??0,l),{step:1,min:0,max:23})}
      ${ae("Minutes",l,c=>d(o,s,c??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${ei(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${ei(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function zx(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${ei(e.historyMinutes)}`;let n=Qa.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${ei(e.historyMinutes,Yi)} \xB7 per ${n.toLowerCase()}`}function Nl(e,n){let t=me(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return st(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:Oe(Me(n.payload.value,t),48)}case"icon":return Oe(Me(n.payload.symbol,t),48);case"gauge":return Oe(Me(n.payload.value,t),48);case"chart":return Oe(`${Me(n.payload.value,t)}${zx(n.payload)}`,48);case"timeline":return Oe(`${Me(n.payload.value,t)} \xB7 ${ei(lt(n.payload))}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return _t(n.payload.action);case"chartTimes":{let i=e.config.elements.find(a=>a.payload.id===n.payload.chart);return i?.kind==="chart"||i?.kind==="timeline"?Oe(`Times of ${Me(i.payload.value,t)}`,48):"No chart or timeline"}case"imageTime":{let i=e.config.elements.find(a=>a.payload.id===n.payload.image);return i?.kind==="image"?Oe(`Time of ${He(i,t)}`,48):"No picture"}case"chartDots":case"chartGrid":{let i=e.config.elements.find(r=>r.payload.id===n.payload.chart),a=n.kind==="chartDots"?"Dots on":"Grid behind";return i?.kind==="chart"?Oe(`${a} ${Me(i.payload.value,t)}`,48):"No chart"}}}function lo(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Ie(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Ie(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":Ie(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:Ie(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${Ie(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Ie(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Ie(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return;case"chartTimes":return`${e.payload.timeLabelCount<=0?"no":e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt \xB7 ${Ie(e.payload.labelColorHex)}`;case"imageTime":return;case"chartDots":{let n=e.payload;return`${n.dots==="all"?"all":"auto"} \xB7 ${n.size===void 0?"automatic size":`${n.size} pt`} \xB7 ${n.colorHex===void 0?"series colour":Ie(n.colorHex)}`}case"chartGrid":{let n=e.payload;return`${n.lines} ${n.lines===1?"line":"lines"} \xB7 ${n.thickness} pt \xB7 ${Ie(n.colorHex)}`}}}function xa(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${ho(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      data-scrub @pointerdown=${Ea(o,s,{step:.5,min:a,max:r})}
      @input=${we(l=>{let d=Number(l);l.trim()!==""&&Number.isFinite(d)&&s(d)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function Px(e,n,t){let i=n.payload.id,a=`el-${i}`,r=Le(e.config,t,n),o=r.frame,s=(c,u)=>e.update(p=>ke(p,t,i,{frame:Sr(o,c)}),`${a}-${u}-${t}`),l=!Ca(o,Wi)||r.isHidden,d=n.payload.chartAnchor;if(n.kind==="chartDots"||n.kind==="chartGrid"){let c=e.config.elements.find(u=>u.payload.id===n.payload.chart);return Se(e,"placement","Position",h`
      <div class="hint keep">${n.kind==="chartDots"?"Dots sit":"Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${c?h`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${()=>e.selectLayer(c.payload.id)}>Select the chart</button></div>
      </div>`:f}
      ${Be("Hidden",r.isHidden,u=>e.update(p=>ke(p,t,i,{isHidden:u})),!1)}`,{color:te.position,icon:"place",summary:`On the chart \xB7 ${ne(t)}`})}return d?.place==="through"?Se(e,"placement","Position",h`
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
      ${ch(e,n,t)}
      ${o.rotationDegrees!==0?Qn("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1}):f}
      ${Be("Hidden",r.isHidden,c=>e.update(u=>ke(u,t,i,{isHidden:c})),!1)}`,{color:te.position,icon:"place",summary:`On the chart \xB7 ${ne(t)}`}):Se(e,"placement","Position",h`
    ${ch(e,n,t)}
    ${d===void 0?h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${xa("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
        ${xa("Y","Top",o.y,c=>s({y:c},"y"),-100,100)}
      </div>
    </div>
    ${dh(e,n,t,o,["across","down","both"])}
    </div>`:It(d.at)?f:h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${xa("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
      </div>
    </div>
    ${dh(e,n,t,o,["across"])}
    </div>`}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${xa("W","Width",o.width,c=>s({width:c},"w"),4,200)}
        ${xa("H","Height",o.height,c=>s({height:c},"h"),4,200)}
      </div>
    </div>
    ${Qn("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1})}
    ${Be("Hidden",r.isHidden,c=>e.update(u=>ke(u,t,i,{isHidden:c})),!1)}
    <div class="hint">${d===void 0?"X, Y, W and H are":"W and H are"} a percent of the face, on the ${ne(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.${d===void 0?" Copy position and Paste position repeat a spot on another layer, on any shape.":""}</div>`,{color:te.position,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${ne(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${ne(t)} face at half size, unrotated and shown`,reset:()=>e.update(c=>ke(c,t,i,{frame:{...Wi},isHidden:!1}))}:{}})}var lh={across:{label:"Center across",title:"Move this layer to the middle of the face, left to right"},down:{label:"Center up and down",title:"Move this layer to the middle of the face, top to bottom"},both:{label:"Center",title:"Move this layer to the middle of the face"}};function dh(e,n,t,i,a){let r=n.payload.id,o=(c,u)=>e.update(p=>ke(p,t,r,{frame:c}),`el-${r}-${u}-${t}`),s=e.copiedPosition,l=n.payload.chartAnchor!==void 0,d=s!==void 0&&s.family===t&&Ca(s.frame,i);return h`<div class="field list-field"><span>Line up</span>
    <div class="chips">
      ${a.map(c=>h`<button class="small" title=${lh[c].title}
        ?disabled=${ku(i,c)}
        @click=${()=>o(Gs(i,c),`center-${c}`)}>${lh[c].label}</button>`)}
    </div>
  </div>
  ${l?f:h`<div class="field list-field"><span>Copy</span>
    <div class="chips">
      <button class="small" title="Copy this layer's X, Y, W, H and rotation, to paste onto another layer"
        @click=${()=>e.copyPosition({frame:{...i},family:t})}>${d?"Copied":"Copy position"}</button>
      <button class="small" ?disabled=${s===void 0||d}
        title=${s===void 0?"Copy a position from a layer first":s.family===t||t!=="rectangular"&&s.family!=="rectangular"?`Put this layer where the copied one sits on the ${ne(s.family)} face`:`Put this layer where the copied one sits on the ${ne(s.family)} face, scaled for this shape`}
        @click=${()=>s&&o($b(s,t,n.kind),"paste")}>Paste position</button>
    </div>
  </div>`}`}function ch(e,n,t){let i=n.payload.chartAnchor;if(i===void 0)return f;let a=n.payload.id,r=`el-${a}-anchor`,o=e.config.elements.filter(c=>c.kind==="chart"),s=(c,u)=>e.update(p=>{let m=p.elements.find(g=>g.payload.id===a);m?.payload.chartAnchor&&c(m.payload.chartAnchor)},u?`${r}-${u}`:void 0),l=me(e),d=!o.some(c=>c.payload.id===i.layer);return h`
    <div class="fgroup">
    ${o.length<2?f:Ce("Follows",i.layer,o.map(c=>[c.payload.id,He(c,l)]),c=>s(u=>{u.layer=c}))}
    ${Ce("Reading",i.at,yt,c=>e.update(u=>{let p=u.elements.find(g=>g.payload.id===a);if(!p?.payload.chartAnchor)return;p.payload.chartAnchor.at=c;let m=u.elements.find(g=>g.payload.id===i.layer);m?.kind==="chart"&&(c==="threshold"&&m.payload.thresholdValue===void 0&&(m.payload.thresholdValue=Pl(Ye(e.resolve(m.payload.value)??"")),m.payload.drawsThreshold=!1),c==="now"&&m.payload.nowIndex===void 0&&(m.payload.nowIndex={kind:{kind:"time",timeField:"hour"}},m.payload.drawsNowLine=!1))}),{def:"highest"})}
    ${Uh(e,i,r)}
    ${i.place==="through"?f:Ce("Sits",i.place,er.filter(([c])=>c!=="through"),c=>s(u=>{u.place=c}),{def:"above"})}
    </div>
    <div class="grid2">
      ${i.dx?ae("Nudge X",i.dx,c=>s(u=>{c?u.dx=c:delete u.dx},"dx"),{step:.5,def:0,unit:"pt"}):f}
      ${i.place==="through"&&!i.dy?f:ae("Nudge Y",i.dy??0,c=>s(u=>{c?u.dy=c:delete u.dy},"dy"),{step:.5,def:0,unit:"pt"})}
    </div>
    ${i.place==="through"?f:h`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${()=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===a);u&&delete u.payload.chartAnchor})}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${n.kind==="text"?h`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${()=>e.update(c=>{Ac(c,a)})}><span>Use an icon</span></button>`:f}
      </div>
    </div>`}
    ${d?h`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${i.place==="through"?", or delete the line":", or unpin it"}.</div>`:i.place==="through"?f:h`<div class="hint">This layer follows that reading on the ${ne(t)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`}function Uh(e,n,t){let i=e.config.elements.find(l=>l.payload.id===n.layer);if(i?.kind!=="chart")return f;let a=i.payload,r=(l,d)=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===n.layer);u?.kind==="chart"&&l(u.payload)},`${t}-${d}`),o=Ne(e.config,n.layer).filter(l=>l.payload.chartAnchor?.at===n.at).length,s=o>1?` ${o} layers follow this ${n.at==="now"?"reading":"threshold"}, and they all move with this number.`:"";if(n.at==="threshold"){let l=Pl(Ye(e.resolve(a.value)??""));return h`
      <div class="grid2">
        ${ae("Threshold at",a.thresholdValue??l,d=>r(c=>{c.thresholdValue=d??l,c.drawsThreshold=!1},"thval"),{def:l})}
      </div>
      <div class="hint">${a.scale==="fixed"?"A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${s}</div>`}return n.at==="now"?h`
      ${le(e,a.nowIndex??{kind:{kind:"time",timeField:"hour"}},l=>r(d=>{d.nowIndex=l,d.drawsNowLine=!1},"nowidx"),{showResolved:!0,label:"Now is reading",key:`${t}-nowindex`})}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${s}</div>`:n.at==="zero"?h`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`:f}function Nx(e,n){if(n.kind==="tap")return f;let t=n.payload.id,i=je(e.config,t)[0];return Se(e,"tappable","Tap",uv(e,n,`el-${t}`),{color:te.tap,icon:"tap",summary:i?_t(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>gr(a,t))}:{}})}function Dx(e,n,t,i,a){return h`
    ${Qn("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(Pn,Math.round(r)))},`${i}count`),{min:0,max:Pn,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?f:h`
      <div class="fgroup">
      <div class="grid2">
        ${ae("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(nn,Math.max(tn,r??tt))},`${i}size`),{step:.5,min:tn,max:nn,def:t.labelSize,unit:"pt"})}
        ${ye("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??nt},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${e.labelsAbove===void 0?f:ie("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      </div>
      <div class="fgroup">
      ${ie("Clock",e.hourCycle,fc,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${ie("Minutes",e.minutes,gc,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}
      </div>`}`}var Ox=[["number","Number"],["entity","Entity"]];function Bx(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function Vx(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function Gx(e,n,t,i,a){let r=o=>{let s=o==="min",l=s?"Min":"Max",d=Bx(n,o),c=s?n.minValue:n.maxValue,u=y=>a(b=>{s?b.minValue=y??0:b.maxValue=y??100},o),p={number:`${l} is a fixed number`,entity:`${l} reads a number from an entity`},m=h`<div class="gauge-end-head">
      ${Ve(l,d==="number"?mn(c,t[o],u):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${l} comes from`}>
        ${Ox.map(([y,b])=>h`<button type="button" role="radio" aria-checked=${y===d?"true":"false"}
          class=${y===d?"on":""} title=${p[y]}
          @click=${()=>{y!==d&&a($=>Vx($,o,y))}}>${b}</button>`)}
      </span>
    </div>`,g=s?n.minSource:n.maxSource;return d==="number"||g===void 0?h`<div class="field gauge-end">${m}${mo(c,u,{ariaLabel:l})}</div>`:h`<div class="field gauge-end">${m}${le(e,g,y=>a(b=>{s?b.minSource=y:b.maxSource=y},`${o}src`),{showResolved:!0,noLabel:!0,label:l,key:`${i}-${o}source`})}</div>
      <div class="hint">If the entity has no number, the gauge uses ${String(c)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${r("min")}${r("max")}</div>`:h`${r("min")}${r("max")}`}function Ux(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(c,u)=>t(p=>{let m={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??pe};c(m),m.bands.length>0?p.bands=m.bands:delete p.bands,m.bandAboveColorHex!==pe?p.bandAboveColorHex=m.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(c,u,p)=>t(m=>{p===void 0||p===u?delete m[c]:m[c]=p},c),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",d=a==="bands"?Ye(e.resolve(n.value)??""):[];return h`
    <div class="fgroup">
    ${ie("Colour",a,Rl,c=>t(u=>{if(c==="uniform"){delete u.coloring;return}u.coloring=c,(u.bands?.length??0)===0&&(u.bands=oo(Ye(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${so({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??pe},n.colorSlot.baseColorHex,o,d.length===1?d[0]:void 0)}`:f}
    </div>
    <div class="fgroup">
    ${ie("Highlight",r,qb,c=>t(u=>{c==="none"?delete u.highlight:u.highlight=c}),{def:"none"})}
    ${r==="none"?f:h`
      <div class="grid2">
        ${r==="lowest"?f:ye("Highest colour",n.highColorHex??Qe,c=>s("highColorHex",Qe,c),!1,Qe)}
        ${r==="highest"?f:ye("Lowest colour",n.lowColorHex??et,c=>s("lowColorHex",et,c),!1,et)}
      </div>
      ${a==="bands"?f:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}
    </div>`}var wa=new Map,va=new Map,Ot=new Map,Qr=new Map,Tl=4,El=40,Wx=[["layer","Layer"],["pick","Pick"],["bands","By value"]],Kx=[["plain","Plain"],["rich","Rich"]],jx={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size"};function Dl(e,n,t,i){let a=t!==void 0&&e.canCountDown(t);return!n&&!a?f:h`${Be("Count down",n,i)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${n&&!a?h`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>`:f}`}function qx(e){return e.countdown===!0?"countdown":st(e)?"rich":"plain"}function Yx(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function Xx(e,n){let t=Fn(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:Oe(e.kind.value,40)||"template"}:{kind:"value",label:Ma(e,n)}}function Wh(e,n,t){let i=Fn(e.value),a=i===void 0?Oe(Ma(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${Oe(i,24)}"`;return`Part ${n+1}: ${a}`}function Jx(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,Wh(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function Hl(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function Zx(e,n){if(Hl(e)==="bands"&&(e.bands?.length??0)>0){let t=[...Qt({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??pe],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function uh(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${xo(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var Qx={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function ev(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${xo(e.moved.map(n=>Qx[n]))} moved into Look.`}function tv(e,n,t,i,a){let r=n.payload,o=r.id,s=qx(r),l=(r.parts?.length??0)>0,d=cs(e.config,r.value),c=Ot.get(o),u=c&&c.rich===l?c:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?va.get(o):void 0,m=(b,$)=>{let k=!(r.parts??[]).every(C=>C.value.kind.kind==="literal"),w=Wr(structuredClone(r),e.config.values);if(va.delete(o),!w.ok){Ot.set(o,{text:uh(w.blocked),rich:!0,warn:!0}),Ae($);return}Ot.set(o,{text:ev(w.joined?{joined:!0,template:k}:w),rich:!1}),i(C=>{Wr(C,e.config.values),b==="countdown"&&(C.countdown=!0)})},g=(b,$)=>{if(va.delete(o),s==="rich"){let k=b==="countdown"?"countdown":"plain",w=r.parts??[];if(w.length<2){m(k,$);return}let C=gl(w,e.config.values);C.ok?(Ot.delete(o),va.set(o,k)):Ot.set(o,{text:uh(C.blocked),rich:!0,warn:!0}),Ae($);return}if(b==="rich"){let k=r.parts?.[0]?.id??ee();wa.set(o,k),Ot.delete(o),i(w=>{delete w.countdown,Up(w,k)});return}Ot.delete(o),i(k=>{if(b==="countdown"){k.countdown=!0;return}(k.parts?.length??0)>0&&Wr(k,e.config.values),delete k.countdown})},y=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${ie("Type",s==="rich"?"rich":"plain",Kx,g,{titles:jx})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
    ${p===void 0?f:h`<div class="rich-confirm" role="alertdialog" aria-label=${y}>
        <b>${y}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(b=>b.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${b=>m(p,b.currentTarget)}>Switch</button>
          <button class="small" @click=${b=>{va.delete(o),Ae(b.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:f}
    ${s==="rich"?nv(e,n,t,i,a):h`
        ${Gh(e,n,a)}
        ${le(e,r.value,b=>i($=>{$.value=b},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${Dl(e,s==="countdown",r.value,b=>g(b?"countdown":"plain",null))}
        ${d?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(d.payload.id)}>${He(d,me(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}`}`}function nv(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=me(e),d=Math.max(0,o.findIndex(P=>P.id===wa.get(s))),c=o[d],u=o.length,p=r.colorSlot.baseColorHex,m=Le(e.config,t,n).size??r.fontSize,g=(P,_)=>{Ot.delete(s),i(R=>{P(R),lc(R)},_)},y=(P,_)=>g(R=>{let X=R.parts?.find(x=>x.id===c.id);X&&P(X)},_?`part-${c.id}-${_}`:void 0),b=(P,_)=>{wa.set(s,P),Ot.delete(s),Ae(_)},$=(P,_)=>{let R=ee();wa.set(s,R),g(X=>{(X.parts??=[]).push({id:R,value:P})}),Ah(_,yo(`${a}-part-${R}`),!0)},k=P=>g(_=>{_.parts&&Sa(_.parts,d,P)}),w=()=>{let P=o[d+1]??o[d-1];P&&wa.set(s,P.id),g(_=>{_.parts=(_.parts??[]).filter(R=>R.id!==c.id)})},C=o.map((P,_)=>{let R=Xx(P.value,l),X=P.id===c.id,x=Hl(P),S=R.kind==="value"?e.resolve(P.value):void 0,F=P.fontWeight===void 0?void 0:Ei.find(([O])=>O===P.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${X?"true":"false"} class="part-chip ${R.kind} ${X?"on":""}"
      aria-label=${Wh(P,_,l)} @click=${O=>b(P.id,O.currentTarget)}>
      <span class="part-dot" style=${`background:${Zx(P,p)}`}
        title=${x==="bands"?"By value, with its own bands":x==="pick"?"Its own colour":"The layer colour"}></span>
      ${R.kind==="text"?h`<span class="part-txt">${R.label===""?h`<span class="part-empty">empty</span>`:Yx(R.label).map(O=>O.space?h`<span class="part-sp">${"\xB7".repeat(O.text.length)}</span>`:O.text)}</span>`:h`<span class="part-txt">${R.label}</span>`}
      ${S===void 0?f:h`<span class="part-now">${S}</span>`}
      ${F===void 0?f:h`<span class="part-flag" title="Its own weight">${F}</span>`}
      ${P.fontSize===void 0?f:h`<span class="part-flag" title="Its own font size">${P.fontSize} pt</span>`}
    </button>`}),L=r.rules.some(P=>P.partId===c.id),M=c.value.kind.kind==="literal",H=Hl(c),A=c.fontSize!==void 0,E=Ei.find(([P])=>P===r.fontWeight)?.[1]??r.fontWeight,I=P=>{P>=Tl&&P<=El&&y(_=>{_.fontSize=P},"size")},j=H==="bands"?Ye(e.resolve(c.value)??""):[],W={layer:"Use the layer colour",...M&&H!=="bands"?{bands:"By value needs a live value"}:{}},q=(P,_)=>y(R=>{let X={bands:R.bands??[],bandAboveColorHex:R.bandAboveColorHex??pe};P(X),X.bands.length>0?R.bands=X.bands:delete R.bands,X.bandAboveColorHex!==pe?R.bandAboveColorHex=X.bandAboveColorHex:delete R.bandAboveColorHex},_);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${C}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${P=>$(V(""),P.currentTarget)}>${U("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${P=>$({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},P.currentTarget)}>${U("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${d+1}</b> of ${u} · ${M?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${d===0} @click=${()=>k(d-1)}>${U("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${d===u-1} @click=${()=>k(d+1)}>${U("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||L}
          title=${u===1?"A rich text layer keeps at least one part":L?"A state changes this part":"Remove this part"}
          @click=${w}>${U("delete")}</button>
      </div>
      ${L&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:f}
      ${le(e,c.value,P=>y(_=>{_.value=P},"value"),{showResolved:!0,label:M?"Text":"Shows",key:`${a}-part-${c.id}`})}
      ${M?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:f}
      ${ie("Colour",H,Wx,P=>y(_=>{if(P==="layer"){delete _.colorHex,delete _.coloring;return}if(P==="pick"){delete _.coloring,_.colorHex=_l(p,"#FFFFFF")?"#64D2FF":p;return}delete _.colorHex,_.coloring="bands",(_.bands?.length??0)===0&&(_.bands=oo(Ye(e.resolve(_.value)??"")))}),{def:"layer",titles:W,...M&&H!=="bands"?{disabled:{bands:!0}}:{}})}
      ${H==="pick"?ye("Part colour",c.colorHex,P=>y(_=>{_.colorHex=P??p},"color")):f}
      ${H==="bands"?h`
        ${so({bands:c.bands??[],bandAboveColorHex:c.bandAboveColorHex??pe},c.colorHex??p,q,j.length===1?j[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:f}
      <div class="field seg-field">${Ve("Weight",c.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${E})`,reset:()=>y(P=>{delete P.fontWeight})})}
        ${ro("Weight",c.fontWeight,Ei,P=>y(_=>{_.fontWeight=P}),{inherited:r.fontWeight})}
      </div>
      <label class="field num part-size">${Ve("Font size",A?{atDefault:!1,title:`Back to the layer size (${m} pt)`,reset:()=>y(P=>{delete P.fontSize})}:void 0,ho(c.fontSize??m,I,{step:1,min:Tl,max:El}))}
        ${mo(c.fontSize,P=>{P===void 0?y(_=>{delete _.fontSize},"size"):I(P)},{step:1,min:Tl,max:El,optional:!0,unit:"pt",placeholder:String(m),ariaLabel:A?"Part font size":`Part font size, ${m} pt from the layer`,...A?{}:{lead:U("link")}})}
      </label>
    </div>
  </div>`}function Kh(e,n,t,i={}){let a=n.payload.id,r=e.config.elements.findIndex(x=>x.payload.id===a),o=`el-${a}`,s=(x,S)=>e.update(F=>x(F.elements[r]),S?`${o}-${S}`:void 0),l=Le(e.config,t,n),d=l.frame,c=(x,S)=>e.update(F=>ke(F,t,a,{frame:Sr(d,x)}),`${o}-${S}-${t}`),u=Ee(n.kind).payload,p=u.colorSlot?.baseColorHex??"#FFFFFF",m=x=>u[x],g=!1,y=x=>Zn(n)===void 0?f:ye(x,Zn(n),S=>s(F=>{Zn(F)!==void 0&&(F.payload.colorSlot.baseColorHex=S??"#FFFFFF")},"color"),!1,p),b,$={},k=[],w,C;switch(n.kind){case"text":{let x=(S,F)=>s(O=>S(O.payload),F);w=tv(e,n,t,x,o),g=!n.payload.countdown&&!st(n.payload),C=h`
        <div class="fgroup">
        ${hn(e,n,t,"Font size",{step:1,min:4,def:m("fontSize")})}
        ${ie("Weight",n.payload.fontWeight,Ei,S=>s(F=>{F.payload.fontWeight=S}),{def:u.fontWeight})}
        ${Rb({label:"Align",value:n.payload.alignment??"center",options:Cx,def:"center",set:S=>s(F=>{let O=F.payload;S==="center"?delete O.alignment:O.alignment=S})},{label:"Lines",value:n.payload.lineLimit===2?"2":"1",options:Sx,def:"1",set:S=>s(F=>{let O=F.payload;S==="2"?O.lineLimit=2:delete O.lineLimit})})}
        ${Be("Mono digits",n.payload.monospacedDigits===!0,S=>s(F=>{let O=F.payload;S?O.monospacedDigits=!0:delete O.monospacedDigits}),u.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:f}
        </div>
        ${g?Ux(e,n.payload,x,y("Main colour")):f}`;break}case"icon":w=h`
        ${le(e,n.payload.symbol,x=>s(S=>{S.payload.symbol=x},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${o}-symbol`,setSymbolPath:x=>s(S=>{let F=S.payload;x?F.path=x:delete F.path},"symbol")})}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`,C=hn(e,n,t,"Icon size",{step:1,min:4,def:m("size")});break;case"gauge":{let x=n.payload,S=(O,K)=>s(J=>O(J.payload),K),F=x.style==="dots";w=h`
        ${le(e,x.value,O=>S(K=>{K.value=O},"value"),{showResolved:!0,label:"Reading",key:`${o}-value`})}
        ${F?h`
            ${le(e,x.total??ih(x),O=>S(K=>{K.total=O},"total"),{showResolved:!0,label:"Total",key:`${o}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${tr} dots are drawn.</div>`:h`<div class="fgroup">${Gx(e,x,{min:u.minValue,max:u.maxValue},o,S)}</div>`}`,g=!0,C=h`
        <div class="grid2">
          ${ie("Style",x.style,nx,O=>S(K=>{O==="dots"&&K.total===void 0&&(K.total=ih(K)),O!=="dots"&&delete K.total,K.style=O}),{titles:ix,def:u.style})}
          ${F?f:hn(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        <div class="fgroup">
        ${ye(F?"Empty dot colour":"Track colour",x.trackColorHex,O=>S(K=>{K.trackColorHex=O??"#FFFFFF40"},"track"),!1,u.trackColorHex)}
        ${ie("Colour",x.coloring,Rl,O=>S(K=>{K.coloring=O,O==="bands"&&K.bands.length===0&&(K.bands=oo([K.minValue,K.maxValue]))}),{def:u.coloring})}
        ${y("Main colour")}
        ${x.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${so(x,x.colorSlot.baseColorHex,S,Ye(e.resolve(x.value)??"")[0])}`:f}
        </div>
        ${F?f:h`
          <div class="fgroup">
          <div class="grid2">
            ${ae("Threshold",x.thresholdValue,O=>S(K=>{O===void 0?delete K.thresholdValue:K.thresholdValue=O},"thr"),{optional:!0,def:null})}
            ${x.thresholdValue===void 0?f:ye("Threshold colour",x.thresholdColorHex,O=>S(K=>{K.thresholdColorHex=O??ci},"thrcol"),!1,ci)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>
          </div>`}`;break}case"chart":{let x=n.payload,S=(T,z)=>s(de=>T(de.payload),z),F=u.historyMinutes,O=u.historyPoints,K=x.historyMinutes>0,J=K&&x.source==="statistics",re=K&&!J,$e=K?J?"statistics":"history":"value",Tt=J?Yi:In,Vt=_n(x)??zn(x),Pe=x.value.kind.kind==="entityState",be=Vt===void 0?void 0:e.historySeries(Vt),Ge=K&&Pe?be??"":e.resolve(x.value)??"",Je=x.historyPoints<1,Bm=re&&Pe&&Vt!==void 0?e.historyReadings?.(Vt):void 0,rd=_x(Je,Bm,ei(x.historyMinutes)),od=Al(a,x.historyMinutes,Tt),$o=K&&Pe?Ps(Ge):{values:Ye(Ge),holes:[]},ai=$o.values,sd=T=>x.limit>0&&T.length>x.limit?x.takeFromEnd?T.slice(T.length-x.limit):T.slice(0,x.limit):T,Vm=sd(ai),pt=Ns(Vm,ot(x.smoothing),$o.holes.length>0?sd($o.holes):[]),Gm=!K&&Pe&&ai.length===1,Co=e.config.elements.filter(T=>T.kind==="chart"&&T.payload.id!==a),ld=me(e),Ha=x.scaleFrom!==void 0&&Co.some(T=>T.payload.id===x.scaleFrom);w=h`
        ${le(e,x.value,T=>S(z=>{z.value=T},"value"),{label:"Readings",noShare:!0,key:`${o}-value`})}
        <div class="fgroup">
        ${ie("Draw",$e,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],T=>S(z=>{if(T==="value"){z.historyMinutes=0;return}z.source=T==="statistics"?"statistics":"history";let de=z.historyMinutes||ar;z.historyMinutes=T==="statistics"?Math.min(de,Qo):Math.min(de,rr)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:u.historyMinutes>0?"history":"value"})}
        ${J?h`
            ${Pe?f:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Cl(a,x.historyMinutes,F,T=>S(z=>{z.historyMinutes=T}),Yi)}
              ${ie("Per",x.statPeriod,Qa,T=>S(z=>{z.statPeriod=T}),{def:Gi})}
            </div>
            ${od?Sl(x.historyMinutes,T=>S(z=>{z.historyMinutes=T},"span"),!0):f}
            ${ie("Read",x.statType,jo,T=>S(z=>{z.statType=T}),{def:Ui})}
            <div class="hint">One bar per period, oldest first, newest ${Lt} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${x.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:f}
            ${Pe&&be===void 0?h`<div class="hint keep">Reading the statistics…</div>`:f}
            ${Pe&&be===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:f}`:f}
        ${re?h`
            ${Pe?f:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Cl(a,x.historyMinutes,F,T=>S(z=>{z.historyMinutes=T}))}
              <div class="field readings-field">${Ve("Points",{atDefault:x.historyPoints===O,title:`Back to ${O<1?"every one":`${O} averaged`}`,reset:()=>S(T=>{T.historyPoints=O})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${Je?"false":"true"} class=${Je?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{Je&&S(T=>{T.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${Je?"true":"false"} class=${Je?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{Je||S(T=>{T.historyPoints=es})}}>Every one</button>
                  </div>
                  ${Je?f:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(x.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${or} max=${Lt}
                      data-scrub @pointerdown=${Ea(x.historyPoints,T=>S(z=>{z.historyPoints=Math.round(T)},"hpoints"),{step:1,min:or,max:Lt})}
                      @input=${we(T=>{let z=Number(T);T.trim()!==""&&Number.isFinite(z)&&z>=1&&S(de=>{de.historyPoints=Math.round(z)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${od?Sl(x.historyMinutes,T=>S(z=>{z.historyMinutes=T},"span")):f}
            <div class="hint">${Je?h`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${Lt} readings is averaged into
                  ${Lt} even slots instead, so the chart still covers all of it.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${rd===void 0?f:h`<div class="hint keep">${rd}</div>`}
            ${Pe&&be===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
            ${Pe&&be===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:f}
        ${K?h`
            ${Be("Show gaps",x.gaps===!0,T=>S(z=>{T?z.gaps=!0:delete z.gaps}),u.gaps===!0)}
            ${Dt(e)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`:f}
        ${K?f:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        </div>
        ${ai.length===0&&!(K&&(!Pe||be===void 0||be===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${ai.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${Rx(pt)}</span>${ai.length===pt.length?h` · ${pt.length} ${pt.length===1?"value":"values"}`:h` · ${pt.length} of ${ai.length}`}</span></div>`:f}
        ${Gm?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:f}
        ${K&&x.limit<=0?f:h`
        <div class="grid2">
          ${ae("Only draw",x.limit,T=>S(z=>{z.limit=Math.max(0,Math.round(T??0))},"limit"),{step:1,min:0,def:u.limit,unit:"readings"})}
          ${x.limit<=0?f:ie("Keep",x.takeFromEnd?"end":"start",K?[["start","Oldest"],["end","Newest"]]:[["start","First"],["end","Last"]],T=>S(z=>{z.takeFromEnd=T==="end"}),{def:u.takeFromEnd===!0?"end":"start"})}
        </div>
        ${K?h`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${x.limit} of the readings fetched above, while clock times still label the whole span.</div>`:h`<div class="hint">${x.limit<=0?"0 draws every reading. Type a number to draw only that many.":`Draws only ${x.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${Ce("Smooth data",ot(x.smoothing)??"off",Wb,T=>S(z=>{let de=ot(T);de===void 0?delete z.smoothing:z.smoothing=de}),{def:ot(u.smoothing)??"off"})}
        ${Dt(e)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`,g=!0;let Um=(()=>{if(Ha)return!0;if(x.scale==="fixed")return x.minValue<0&&x.maxValue>0;let T=pt.filter(Fa=>Number.isFinite(Fa));if(T.length===0)return!0;let z=Math.min(...T,x.thresholdValue??1/0),de=Math.max(...T,x.thresholdValue??-1/0);return z<0&&de>0})(),Gt=Yp(x);k=pt,C=h`
        <div class="grid2">
          ${ie("Style",x.style,Mh,T=>S(z=>{z.style=T}),{def:u.style})}
          ${x.style==="bars"?ae("Bar gap",x.barGap,T=>S(z=>{z.barGap=Math.max(0,T??0)},"gap"),{step:.5,min:0,def:u.barGap,unit:"pt"}):hn(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        ${x.style==="bars"?h`
          <div class="fgroup">
          <div class="grid2">
            ${ae("Corner radius",Yt(x.barRadius),T=>S(z=>{let de=Math.max(0,T??di);de===di?delete z.barRadius:z.barRadius=de},"barradius"),{step:.5,min:0,def:Yt(u.barRadius),unit:"pt"})}
          </div>
          ${Be("Round top only",Xt(x.barCorners)==="top",T=>S(z=>{T?z.barCorners="top":delete z.barCorners}),Xt(u.barCorners)==="top")}
          ${Dt(e)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>
          </div>
          <div class="fgroup">
          ${Gt.fill===void 0?f:wl(Gt.fill,x.fillColorHex,T=>S(z=>{T===void 0?delete z.fillColorHex:z.fillColorHex=T},"fillcol"))}
          ${Be("Border",x.barBorderWidth!==void 0,T=>S(z=>{T?z.barBorderWidth=1:delete z.barBorderWidth}),!1)}
          ${x.barBorderWidth===void 0?f:h`
            ${ae("Border width",x.barBorderWidth,T=>S(z=>{z.barBorderWidth=Math.min(Math.max(T??1,0),nr)},"barborderw"),{step:.5,min:0,max:nr,def:1,unit:"pt"})}
            ${Gt.border===void 0?f:wl(Gt.border,x.barBorderColorHex,T=>S(z=>{T===void 0?delete z.barBorderColorHex:z.barBorderColorHex=T},"barbordercol"))}
            ${Be("Open at base",x.barBorderOpenBase===!0,T=>S(z=>{T?z.barBorderOpenBase=!0:delete z.barBorderOpenBase}),!1)}`}
          ${Dt(e)}
          <div class="hint">The border is drawn inside each bar, so bars keep their size. A highlighted
            bar fills and borders in its highlight colour.${x.barBorderOpenBase===!0?" Open at base leaves the border off the edge on the baseline, so a bar hanging below zero leaves its top open.":" Open at base leaves the border off the edge on the baseline."}${x.coloring==="bands"?" Each band can set its own fill and border below.":""}</div>
          </div>`:h`
          <div class="fgroup">
          ${ie("Curve",x.curve??"straight",Gb,T=>S(z=>{T==="straight"?delete z.curve:z.curve=T}),{titles:{straight:"A straight line from each reading to the next",smooth:"A smooth line that never rises past the highest reading or dips under the lowest",step:"Each reading holds flat until the next one, the way a state does"},def:u.curve??"straight"})}
          ${Dt(e)}
          </div>
          ${x.style==="area"?h`
            <div class="fgroup">
            ${ie("Fill",qt(x.fillStyle),Ub,T=>S(z=>{T==="flat"?delete z.fillStyle:z.fillStyle=T}),{titles:{flat:"One even wash under the line",fade:"Strongest at the top of the plot, fading to clear at the baseline"},def:qt(u.fillStyle)})}
            ${Gt.fill===void 0?f:wl(Gt.fill,x.fillColorHex,T=>S(z=>{T===void 0?delete z.fillColorHex:z.fillColorHex=T},"fillcol"))}
            ${Dt(e)}
            </div>`:f}`}
        <div class="fgroup">
        <div class="grid2">
          ${ie("Scale",x.scale,Kb,T=>S(z=>{z.scale=T}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:u.scale})}
          ${ie("Baseline",x.baseline,jb,T=>S(z=>{z.baseline=T}),{def:u.baseline})}
        </div>
        ${Co.length===0?f:Ce("Same scale as",Ha?x.scaleFrom:"",[["","Its own"],...Co.map(T=>[T.payload.id,He(T,ld)])],T=>S(z=>{T?z.scaleFrom=T:delete z.scaleFrom}),{def:""})}
        ${Ha?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:f}
        ${!Ha&&x.scale==="fixed"?h`<div class="grid2">
              ${ae("Min",x.minValue,T=>S(z=>{z.minValue=T??0},"cmin"),{def:u.minValue})}
              ${ae("Max",x.maxValue,T=>S(z=>{z.maxValue=T??100},"cmax"),{def:u.maxValue})}
            </div>`:f}
        <div class="hint">${x.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        </div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let T;e.update(z=>{T=Kc(z,a,de=>He(de,ld))}),T&&e.selectLayer(T)}}>${U("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        <div class="fgroup">
        ${ie("Colour",x.coloring,Rl,T=>S(z=>{z.coloring=T,T==="bands"&&z.bands.length===0&&(z.bands=oo(pt))}),{def:u.coloring})}
        ${Gt.main===void 0?f:y(Gt.main)}
        ${x.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${x.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${so(x,x.colorSlot.baseColorHex,S,pt,x.style==="bars"?{...x.fillColorHex===void 0?{}:{fillHex:x.fillColorHex},...x.barBorderColorHex===void 0?{}:{borderHex:x.barBorderColorHex},border:x.barBorderWidth!==void 0}:void 0)}
          ${x.style==="area"?h`${Be("Band fill",x.fillBands,T=>S(z=>{z.fillBands=T}),u.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}
        </div>`;let So=(T,z)=>Ne(T,a).filter(de=>de.payload.chartAnchor?.at===z&&de.payload.chartAnchor.place==="through"),dd=(T,z)=>Ne(T,a).some(de=>de.payload.chartAnchor?.at===z),cd={threshold:T=>So(T,"threshold"),now:T=>So(T,"now"),zero:T=>So(T,"zero"),times:T=>on(T,a),dots:T=>Dn(T,a),grid:T=>On(T,a)},Wm={threshold:T=>{dd(T,"threshold")?En(T,a,"threshold"):Fc(T,a,x.thresholdValue??Pl(pt))},now:T=>{dd(T,"now")?En(T,a,"now"):Ic(T,a,!0)},zero:T=>{bs(T,a)},times:T=>{Nn(T,a)},dots:T=>{gs(T,a)},grid:T=>{ys(T,a)}},ri={};Ln(x)||(ri.times=Je&&re?"Clock times need evenly spaced readings. Set Points to Average.":"Clock times need a recorded span. Set Draw to Recorded history."),x.style==="bars"&&(ri.dots="Dots need a line or area chart. Set Style to Line or Area.");let To=T=>cd[T](e.config).length>0;$={};for(let[T,z]of Object.entries(ri))$[`draw:${T}`]=z;let Km=([T,z])=>{let de=To(T),Fa=de?void 0:ri[T],Eo=`draw:${T}`;return h`<div class="xr-row" role="row" data-extra=${Eo}>
          <span role="cell"><span class="xr-name">${z}</span></span>
          <span role="cell"></span>
          <span role="cell"><button type="button" class="xtog ${de?"on":""}" role="switch" aria-checked=${de?"true":"false"}
            aria-label=${z} ?disabled=${Fa!==void 0} data-extra=${Eo}
            title=${Bl(Eo,Fa??(de?`Remove the ${z.toLowerCase()} from this chart`:`Add ${z.toLowerCase()} to this chart`))}
            @click=${()=>e.update(Mo=>{if(de)for(let jm of cd[T](Mo))fe(Mo,jm.payload.id);else Wm[T](Mo)})}>${de?h`<span aria-hidden="true">✓</span>`:U("plus")}</button></span>
          <span role="cell"></span>
        </div>`};b=h`
        <div class="field list-field"><span>On the plot</span>
          <div class="xreadings" role="table" aria-label="On the plot" @pointerover=${Mi} @focusin=${Mi}>
            <div class="xr-row xr-head" role="row">
              <span role="columnheader"><span class="xr-name">Layer</span></span><span role="columnheader"></span>
              <span role="columnheader">Show</span><span role="columnheader"></span>
            </div>
            ${qr.map(Km)}
          </div>
        </div>
        ${qr.filter(([T])=>ri[T]!==void 0&&!To(T)).map(([T])=>h`<div class="hint keep">${ri[T]}</div>`)}
        ${To("zero")&&!Um?h`<div class="hint warn">These readings never cross zero, so the zero line is not drawn.</div>`:f}
        ${Dt(e)}`;break}case"timeline":{let x=n.payload,S=(be,Ge)=>s(Je=>be(Je.payload),Ge),F=u.historyMinutes,O=x.value.kind.kind==="entityState",K=bt(x),J=K===void 0?void 0:e.historySeries(K),re=lt(x)*60,$e=oa(J??"",an),Tt=Al(a,x.historyMinutes),Vt=x.value.kind.kind==="entityState"?x.value.kind.entityId:void 0,Pe=ex($e,re,Vt===void 0?void 0:e.hass.states[Vt]?.state,Vt?.split(".")[0]);w=h`
        ${le(e,x.value,be=>S(Ge=>{Ge.value=be},"value"),{label:"States",noShare:!0,key:`${o}-value`})}
        ${O?f:h`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        <div class="fgroup">
        ${Cl(a,x.historyMinutes,F,be=>S(Ge=>{Ge.historyMinutes=be}))}
        ${Tt?Sl(x.historyMinutes,be=>S(Ge=>{Ge.historyMinutes=be},"span")):f}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${an} changes are drawn, and a
          busier span keeps its newest.</div>
        ${O&&J===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
        ${O&&J===""?h`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:f}
        </div>
        ${$e.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${Lx($e,re)}</span></span></div>`:f}
        ${Ix($e)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:f}`,C=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${tx(x,S,Pe,`wa-tl-states-${o.replace(/[^a-z0-9]/gi,"")}`)}
        ${Pe.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${Pe.filter(be=>be!=="unavailable"&&be!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:f}
        <div class="grid2">
          ${ae("Gap",x.gap,be=>S(Ge=>{Ge.gap=Math.min(sr,Math.max(0,be??0))},"tgap"),{step:.5,min:0,max:sr,def:u.gap,unit:"pt"})}
          ${ae("Corner radius",x.cornerRadius,be=>S(Ge=>{Ge.cornerRadius=Math.max(0,be??0)},"tradius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
`;break}case"shape":w=h`<div class="grid2">
          ${ie("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],x=>s(S=>{S.payload.kind=x}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:u.kind})}
          ${n.payload.kind==="roundedRectangle"?ae("Corner radius",n.payload.cornerRadius,x=>s(S=>{S.payload.cornerRadius=x??6},"radius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"}):f}
        </div>
        ${n.payload.kind==="line"?Fx(t,d,c):f}`,C=n.payload.kind==="line"?ae("Thickness",n.payload.thickness,x=>s(S=>{S.payload.thickness=x??1},"thick"),{step:.5,min:.5,def:u.thickness,unit:"pt"}):h`
        <div class="fgroup">
        ${ye("Border colour",n.payload.borderColorHex,x=>s(S=>{x===void 0?delete S.payload.borderColorHex:S.payload.borderColorHex=x},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ae("Border width",n.payload.borderWidth,x=>s(S=>{S.payload.borderWidth=x??1},"bw"),{step:.5,min:0,def:u.borderWidth,unit:"pt"}):f}
        </div>`;break;case"image":{let x=n.payload,S=(J,re)=>s($e=>J($e.payload),re),F=x.entity.entityId?e.hass.states[x.entity.entityId]?.attributes?.entity_picture:void 0,O=typeof F=="string"?F:void 0,K=O!==void 0&&!O.startsWith("/");w=h`
        ${ie("Source",x.source,[["camera","Camera"],["entityPicture","Entity picture"]],J=>S(re=>{re.source=J}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:u.source})}
        ${x.source==="camera"?h`
            ${x.entity.entityId&&!x.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:f}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${x.entity.entityId&&O===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:f}
            ${K?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:f}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,C=h`
        <div class="fgroup">
        ${ie("Picture",x.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],J=>S(re=>{re.contentMode=J}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:u.contentMode})}
        ${Qn("Zoom",x.zoom,J=>S(re=>{re.zoom=J},"zoom"),{min:el,max:4,step:.05,def:1,format:J=>`${J.toFixed(2)}x`,unit:"x"})}
        ${Qn("Pan left/right",x.panX,J=>S(re=>{re.panX=J},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Qn("Pan up/down",x.panY,J=>S(re=>{re.panY=J},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${x.contentMode==="fit"&&x.zoom===1?"hint keep":"hint"}>${Mx(x)}</div>
        </div>
        ${ae("Corner radius",x.cornerRadius,J=>S(re=>{re.cornerRadius=Math.max(0,J??ui)},"imgradius"),{step:1,min:0,def:ui,unit:"pt"})}`;break}case"tap":{w=h`
        ${Ol(e,n.payload,(x,S)=>s(F=>x(F.payload),S),o)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}case"chartTimes":{let x=n.payload,S=(J,re)=>s($e=>J($e.payload),re),F=e.config.elements.find(J=>J.payload.id===x.chart),O=F?.kind==="chart"||F?.kind==="timeline"?F:void 0,K=O?.kind==="timeline"?"timeline":"chart";w=h`
        <div class="field readout"><span>${O?.kind==="timeline"?"Timeline":"Chart"}</span><span class="readout-v">${O?h`<button class="small" title=${`Select that ${K}`} @click=${()=>e.selectLayer(O.payload.id)}>${He(O,me(e))}</button>`:"None"}</span></div>
        ${O===void 0?h`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`:O.kind==="timeline"?bt(O.payload)===void 0?h`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`:f:Ln(O.payload)?f:h`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${K}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`,C=Dx(x,S,u,"ct",h`
        <div class="hint">Evenly spaced from the start of the ${K}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);break}case"imageTime":{let x=n.payload,S=e.config.elements.find(O=>O.payload.id===x.image),F=S?.kind==="image"?S:void 0;w=h`
        <div class="field readout"><span>Picture</span><span class="readout-v">${F?h`<button class="small" title="Select that picture" @click=${()=>e.selectLayer(F.payload.id)}>${He(F,me(e))}</button>`:"None"}</span></div>
        ${F===void 0?h`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`:f}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;break}case"chartDots":{let x=n.payload,S=(re,$e)=>s(Tt=>re(Tt.payload),$e),F=e.config.elements.find(re=>re.payload.id===x.chart),O=F?.kind==="chart"?F:void 0,K=O===void 0?void 0:Le(e.config,t,O).size??O.payload.lineWidth,J=K===void 0?void 0:Math.round(K*18)/10;w=h`
        ${ph(e,O)}
        ${O===void 0?h`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`:O.payload.style==="bars"?h`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`:f}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${Dt(e)}`,C=h`
        ${ie("Dots",x.dots,Eh,re=>S($e=>{$e.dots=re}),{titles:{auto:"A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",all:"A dot on every reading"},def:"auto"})}
        <div class="grid2">
          ${ae("Dot size",x.size??J,re=>S($e=>{let Tt=mt(re);Tt===void 0||Tt===J?delete $e.size:$e.size=Tt},"dotsize"),{step:.5,min:1,max:12,...J===void 0?{}:{def:J},unit:"pt"})}
          ${Ll("Dot colour",x.colorHex,"Series colour",re=>S($e=>{re===void 0?delete $e.colorHex:$e.colorHex=re},"dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;break}case"chartGrid":{let x=n.payload,S=(K,J)=>s(re=>K(re.payload),J),F=e.config.elements.find(K=>K.payload.id===x.chart),O=F?.kind==="chart"?F:void 0;w=h`
        ${ph(e,O)}
        ${O===void 0?h`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`:f}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${Dt(e)}`,C=h`
        <div class="grid2">
          ${ae("Lines",x.lines,K=>S(J=>{J.lines=An(K??Zt)},"lines"),{step:1,min:1,max:4,def:Zt})}
          ${ae("Thickness",x.thickness,K=>S(J=>{J.thickness=Hn(K??Jt)},"thick"),{step:.25,min:Ja,max:Za,def:Jt,unit:"pt"})}
        </div>
        ${ye("Colour",x.colorHex,K=>S(J=>{J.colorHex=K??Ft},"gridcol"),!1,Ft)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;break}}let L=g||Zn(n)===void 0?void 0:y(n.kind==="shape"?"Fill colour":n.kind==="text"&&st(n.payload)?"Layer colour":"Colour"),M=ws(e.config,n),H=M?{kind:{kind:"entityState",...M}}:void 0,A=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,E=av[n.kind],I=rv[n.kind],j=$l(n.payload,u,E),W=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,q=e.config.perFamily[t]?.placements[a]?.size!==void 0,P=$l(n.payload,u,I)||W!==void 0&&l.size!==void 0&&l.size!==u[W],_=rn(e.config,a),R=(x,S)=>()=>s(F=>Zr(F.payload,u,x),S),X=h`<section class="sec name-sec" data-open="true" style=${`--c:${te.place}`}>
    <div class="sec-h pinned">
      <span class="swatch">${U("text")}</span>
      <h4>Name${Ta(n.payload.name===void 0?void 0:{atDefault:!1,title:"Go back to the automatic title",reset:()=>s(x=>{delete x.payload.name},"reset-name")})}</h4>
      <input type="text" aria-label="Layer name" .value=${n.payload.name??""} placeholder=${Yh(n,me(e))}
        @input=${we(x=>s(S=>{let F=hv(x);F===void 0?delete S.payload.name:S.payload.name=F},"name"))} />
    </div>
  </section>`;return h`
    ${X}
    ${Se(e,"content","Content",h`${n.kind==="tap"||n.kind==="text"||n.kind==="chartTimes"||n.kind==="chartDots"||n.kind==="chartGrid"||n.kind==="imageTime"?f:Gh(e,n,o)}${w}`,{color:te.content,icon:"content",summary:Nl(e,n),...j?{reset:()=>s(x=>{Zr(x.payload,u,E),x.kind==="text"&&ga(x.payload.rules)},"reset-content")}:{}})}
    ${C===void 0&&L===void 0?f:Se(e,"look",n.kind==="image"?"Picture":"Look",h`${C??f}${L??f}`,{color:te.look,icon:n.kind==="image"?"image":"look",...lo(n)?{summary:lo(n)}:{},...P?{reset:()=>e.update(x=>{Zr(x.elements[r].payload,u,I),q&&ke(x,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?Se(e,"numbers","Extras",dv(e,n,b,$,k),{color:te.numbers,icon:"text",summary:lv(e,n),..._.length>0||Ne(e.config,a).length>0||on(e.config,a).length>0||Dn(e.config,a).length>0||On(e.config,a).length>0||$l(n.payload,u,hh)?{reset:()=>e.update(x=>{for(let F of rn(x,a))fe(x,F.payload.id);for(let F of Ne(x,a))fe(x,F.payload.id);for(let F of on(x,a))fe(x,F.payload.id);for(let F of Dn(x,a))fe(x,F.payload.id);for(let F of On(x,a))fe(x,F.payload.id);let S=x.elements.find(F=>F.payload.id===a);S&&Zr(S.payload,u,hh)})}:{}}):f}
    ${n.kind==="timeline"||n.kind==="image"?iv(e,n):f}
    ${Se(e,"states","States",im(e,n.payload.rules,n.kind,x=>x.elements.find(S=>S.payload.id===a)?.payload.rules,`rules-${a}`,H,A),{color:te.states,icon:"states",summary:ha(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>s(x=>{x.payload.rules=[]})}:{}})}
    ${i.placement===!1?f:Px(e,n,t)}
    ${i.tap===!1?f:Nx(e,n)}`}function iv(e,n){let t=n.payload.id,i=n.kind==="timeline",a=i?on(e.config,t):hs(e.config,t),r=i?"Clock times":"Timestamp",o=e.activeFamily,s=()=>e.update(p=>{let m=p.elements.find(y=>y.payload.id===t);if(!m)return;let g=m.payload.frame;m.payload.frame={...Le(p,o,m).frame},i?Nn(p,t):fs(p,t,he[o==="inline"?"rectangular":o]),m.payload.frame=g}),l=a.length>0,d=a.map(p=>({el:p,lead:U("clock"),title:r,kind:i?"Times":"Timestamp"})),c=i?"timeline:times":"image:time",u=h`
    ${qh(i?"timeline":"image")}
    <div class="field list-field"><span>Draw</span>
      <div class="adders" @pointerover=${Mi} @focusin=${Mi}>
        <button class="small ${l?"on":""}" ?disabled=${l} aria-pressed=${l?"true":"false"} data-extra=${c}
          title=${Bl(c,l?`${r} is on this ${i?"timeline":"picture"}. Remove it in the list below.`:`Add ${r.toLowerCase()}`)}
          @click=${s}>${l?h`<span aria-hidden="true">✓</span>`:U("plus")}<span>${r}</span></button>
      </div>
    </div>
    <div class="hint">${i?"Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or colour.":"Adds the time the picture was fetched as its own layer in its group, so you can drag it anywhere, inside the picture or beside it."}</div>
    ${l?h`
      ${Vl(e,d,{icon:"close",danger:!0,label:p=>`Delete this ${p}`,run:p=>e.update(m=>fe(m,p))})}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>`:f}`;return Se(e,"numbers","Extras",u,{color:te.numbers,icon:"clock",summary:l?`${r} layer`:"None yet",...l?{reset:()=>e.update(p=>{for(let m of a)fe(p,m.payload.id)})}:{}})}var av={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"],chartTimes:[],chartDots:[],chartGrid:[],imageTime:[]},rv={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","coloring","bands","bandAboveColorHex","fillBands","curve","fillStyle","fillColorHex","barRadius","barCorners","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius"],shape:["colorSlot","borderColorHex","borderWidth","thickness"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[],chartTimes:["timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["dots","size","colorHex"],chartGrid:["lines","colorHex","thickness"],imageTime:[]};function ph(e,n){return h`<div class="field readout"><span>Chart</span><span class="readout-v">${n?h`<button class="small" title="Select that chart" @click=${()=>e.selectLayer(n.payload.id)}>${He(n,me(e))}</button>`:"None"}</span></div>`}var hh=["highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"];function Ol(e,n,t,i){let a=n.action;return h`
    ${Ce("Tap action",a.type,yx,r=>t(o=>{o.action=_h(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?Ct(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="callService"?zh(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):f}
    ${a.type==="openPage"?Nh(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):f}`}var ov=24;function sv(e,n){let t=[],i=1/0;for(let r of se){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Uc(e.config,n,r);o&&(t.push(`${ne(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return f;let a=i<ov;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:f}`}function lv(e,n){let t=n.payload,i=rn(e.config,t.id),a=Ne(e.config,t.id),r=on(e.config,t.id),o=Dn(e.config,t.id),s=On(e.config,t.id);if(i.length===0&&a.length===0&&r.length===0&&o.length===0&&s.length===0)return"None yet";let l=[...i.map(d=>{let c=d.payload.value.kind;return c.kind==="chartStat"?(gt.find(([u])=>u===c.stat)?.[1]??"number").toLowerCase():"number"})];for(let d of a){let{at:c,place:u}=d.payload.chartAnchor,p=(yt.find(([m])=>m===c)?.[1]??"reading").toLowerCase();l.push(u==="through"?`${p} line`:`${p} marker`)}for(let d of r)l.push("times layer");for(let d of o)l.push("dots layer");for(let d of s)l.push("grid layer");return l.join(" \xB7 ")}function dv(e,n,t,i={},a=[]){let r=n.payload.id,o=me(e),s=rn(e.config,r),l=on(e.config,r),d=Dn(e.config,r),c=On(e.config,r),u=Ne(e.config,r),p={};for(let[A]of gt){let E=e.resolve({kind:{kind:"chartStat",layer:r,stat:A}});E!==void 0&&E.trim()!==""&&(p[A]=E)}let m=a.filter(A=>Number.isFinite(A)),g=n.payload.nowIndex===void 0?NaN:Number(e.resolve(n.payload.nowIndex)),y=Number.isFinite(g)&&a.length>0?Math.min(a.length-1,Math.max(0,Math.round(g))):void 0,b=y===void 0||!Number.isFinite(a[y])||m.length===0?void 0:qi(a[y],Math.max(...m)-Math.min(...m)),$={values:a,texts:p,...y===void 0?{}:{now:y},...n.payload.thresholdValue===void 0?{}:{threshold:n.payload.thresholdValue}},k=(A,E)=>rn(A,r).filter(I=>I.payload.value.kind.kind==="chartStat"&&I.payload.value.kind.stat===E),w=(A,E)=>Ne(A,r).filter(I=>I.payload.chartAnchor?.at===E&&I.payload.chartAnchor.place!=="through"),C=(A,E,I,j,W,q,P)=>h`
    <button type="button" class="xtog ${E>0?"on":""}" role="switch" aria-checked=${E>0?"true":"false"}
      aria-label=${W} data-extra=${A}
      title=${Bl(A,E===0?I:E===1?j:`${j}: all ${E} of them`)}
      @click=${()=>e.update(_=>{if(E>0)for(let R of P(_))fe(_,R.payload.id);else q(_)})}>${E>0?h`<span aria-hidden="true">✓</span>`:U("plus")}</button>`,L=h`<div class="xreadings" role="table" aria-label="Readings" @pointerover=${Mi} @focusin=${Mi}>
    <div class="xr-row xr-head" role="row">
      <span role="columnheader"><span class="xr-name">Reading</span></span><span role="columnheader"></span>
      <span role="columnheader">Number</span><span role="columnheader">Marker</span>
    </div>
    ${Kp.map(A=>{let E=A.stat!==void 0?p[A.stat]:b,I=A.stat===void 0?"":(gt.find(([q])=>q===A.stat)?.[1]??A.label).toLowerCase(),j=A.marker==="now"?"the reading at now":`the ${(yt.find(([q])=>q===A.marker)?.[1]??A.label).toLowerCase()}`,W=A.stat!==void 0?`number:${A.stat}`:A.marker!==void 0?`marker:${A.marker}`:void 0;return h`<div class="xr-row" role="row" data-extra=${W??f}>
        <span role="cell"><span class="xr-name">${A.label}</span></span>
        <span role="cell"><span class="xr-v nums">${E??""}</span></span>
        <span role="cell">${A.stat===void 0?f:C(`number:${A.stat}`,k(e.config,A.stat).length,`Print the ${I} as a number`,`Remove the ${I} number`,`${A.label} number`,q=>{Mc(q,r,A.stat)},q=>k(q,A.stat))}</span>
        <span role="cell">${A.marker===void 0?f:C(`marker:${A.marker}`,w(e.config,A.marker).length,`Put a marker over ${j}`,`Remove the marker over ${j}`,`${A.label} marker`,q=>{ps(q,r,A.marker)},q=>w(q,A.marker))}</span>
      </div>`})}
  </div>`,M=[...s.map(A=>({el:A,lead:e.resolve(A.payload.value)??"--",title:He(A,o),kind:"Number"})),...u.map(A=>{let{at:E,place:I}=A.payload.chartAnchor,j=yt.find(([q])=>q===E)?.[1]??"Reading";if(I==="through")return{el:A,lead:E==="now"?"\u2502":"\u2500",title:E==="zero"?"Zero":j,kind:"Line"};let W=A.kind==="text"?e.resolve(A.payload.value)??"\u25CF":A.kind==="icon"?pv(e.resolve(A.payload.symbol)):"\u25C6";return{el:A,lead:W,title:j,kind:"Marker"}}),...l.map(A=>({el:A,lead:U("clock"),title:"Clock times",kind:"Times"})),...d.map(A=>({el:A,lead:U("chartDots"),title:"Reading dots",kind:"Dots"})),...c.map(A=>({el:A,lead:U("chartGrid"),title:"Grid lines",kind:"Grid"}))],H=M.length;return h`
    <div class="hint keep">Each one you switch on is a layer in this chart's group.</div>
    ${qh("chart",i,n.payload.style==="bars",$)}
    ${t??f}
    <div class="field list-field"><span>Readings</span>${L}</div>
    <div class="hint">A number is a text layer that prints the reading. A marker is an icon over it, pushed down
      rather than off the chart when the bar is tall. Newest, Change and Total start with the entity's unit.</div>
    ${H===0?f:h`
      <div class="shown-head">On this chart <span class="shown-count">${H}</span></div>
      ${Vl(e,M,{icon:"close",danger:!0,label:A=>`Delete this ${A}`,run:A=>e.update(E=>fe(E,A))})}
      <div class="hint">Click a row to set its value, colour and size here. More settings selects that layer.
        On the preview, click right on a dot to pick the dots.</div>`}`}var $a,jh="wrist-assistant-extras-preview",vo=(()=>{try{return window.localStorage.getItem(jh)!=="off"}catch{return!0}})();function mh(e,n){vo=e;try{window.localStorage.setItem(jh,e?"on":"off")}catch{}Ae(n)}function Mi(e){if(!vo)return;let n=e.target?.closest?.("[data-extra]")?.getAttribute("data-extra");!n||n===$a||($a=n,Ae(e.currentTarget))}function Bl(e,n){return vo?n:`${bl(e)} ${n}.`}function qh(e,n={},t=!1,i={}){if(!vo)return h`<button class="link xprev-show" @click=${l=>mh(!0,l.currentTarget)}>
      ${U("show")}<span>Show preview</span></button>`;let a=e==="timeline"?"timeline:times":e==="image"?"image:time":void 0,r=$a!==void 0&&yl($a)===e?$a:a,o=r===void 0?void 0:n[r],s=e==="image"?"picture":e;return h`<div class="xprev">
    <span class="well">${jp(e,r,t,i)}</span>
    <span class="xprev-t">
      <b>${r===void 0?"Preview":qp(r)}</b>
      <span>${r===void 0?`Point at a ${e==="chart"?"switch":"button"} below to see what it adds to the ${s}.`:bl(r)}</span>
      ${o?h`<span class="xprev-why">${o}</span>`:f}
    </span>
    <button class="icon xprev-hide" title="Hide the preview" aria-label="Hide the preview"
      @click=${l=>mh(!1,l.currentTarget)}>${U("hide")}</button>
  </div>`}function Vl(e,n,t){return h`<div class="chart-numbers">${zp(n,a=>a.el.payload.id,({el:a,lead:r,title:o,kind:s})=>{let l=a.payload.id,d=s.toLowerCase();return h`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${()=>e.peekLayer(l,!0)}
        @pointerleave=${()=>e.peekLayer(l,!1)}>
        <summary class="num-pick" title=${`Show the settings for this ${d}`}>
          <span class="num-lead">${r}</span>
          <span class="num-text"><span class="num-title">${o}</span><span class="num-kind">${s}</span></span>
          <span class="chev">${U("chevron")}</span>
        </summary>
        <div class="num-body">
          ${cv(e,a)}
          <div class="chips"><button class="small" title=${`Select this ${d} to see all of its settings`}
            @click=${()=>e.selectLayer(l)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${t.danger?"danger":""}" title=${t.label(d)} aria-label=${t.label(d)}
        @click=${()=>{e.peekLayer(l,!1),t.run(l)}}>${U(t.icon)}</button>
    </div>`})}</div>`}function cv(e,n){let t=n.payload.id,i=`quick-${t}`,a=e.activeFamily,r=(c,u)=>e.update(p=>{let m=p.elements.find(g=>g.payload.id===t);m&&c(m)},`${i}-${u}`),o=Ee(n.kind).payload,s=Zn(n),l=s===void 0?f:ye("Colour",s,c=>r(u=>{Zn(u)!==void 0&&(u.payload.colorSlot.baseColorHex=c??"#FFFFFF")},"colour"),!1,o.colorSlot?.baseColorHex??"#FFFFFF"),d=n.payload.chartAnchor;switch(n.kind){case"text":{let c=n.payload.value.kind;return h`
        ${c.kind==="chartStat"?Ce("Number",c.stat,[...gt],u=>r(p=>{p.kind==="text"&&p.payload.value.kind.kind==="chartStat"&&(p.payload.value={...p.payload.value,kind:{...p.payload.value.kind,stat:u}})},"stat")):d||st(n.payload)?f:le(e,n.payload.value,u=>r(p=>{p.kind==="text"&&(p.payload.value=u)},"value"),{showResolved:!0,label:n.payload.countdown?"Until":"Text",key:`${i}-value`})}
        ${d&&d.place!=="through"?fh(e,t,d,r):f}
        <div class="grid2">
          ${hn(e,n,a,"Font size",{step:1,min:4,def:o.fontSize})}
          ${n.payload.countdown||st(n.payload)?f:l}
        </div>`}case"icon":return h`
        ${d?fh(e,t,d,r):le(e,n.payload.symbol,c=>r(u=>{u.kind==="icon"&&(u.payload.symbol=c)},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${i}-symbol`,setSymbolPath:c=>r(u=>{u.kind==="icon"&&(c?u.payload.path=c:delete u.payload.path)},"symbol")})}
        <div class="grid2">
          ${hn(e,n,a,"Icon size",{step:1,min:4,def:o.size})}
          ${l}
        </div>`;case"shape":return n.payload.kind!=="line"?h`
          <div class="grid2">
            ${n.payload.kind==="roundedRectangle"?ae("Corner radius",n.payload.cornerRadius,c=>r(u=>{u.kind==="shape"&&(u.payload.cornerRadius=c??6)},"radius"),{step:.5,min:0,def:o.cornerRadius,unit:"pt"}):f}
            ${l}
          </div>`:h`
        ${d?Uh(e,d,i):f}
        <div class="grid2">
          ${ae("Thickness",n.payload.thickness,c=>r(u=>{u.kind==="shape"&&(u.payload.thickness=c??1)},"thick"),{step:.5,min:.5,def:o.thickness,unit:"pt"})}
          ${l}
        </div>`;case"gauge":{let c=n.payload;return h`
        ${le(e,c.value,u=>r(p=>{p.kind==="gauge"&&(p.payload.value=u)},"value"),{showResolved:!0,label:"Reading",key:`${i}-value`})}
        <div class="grid2">
          ${c.style==="dots"?f:hn(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"chart":{let c=n.payload;return h`
        ${le(e,c.value,u=>r(p=>{p.kind==="chart"&&(p.payload.value=u)},"value"),{label:"Readings",noShare:!0,key:`${i}-value`})}
        ${ie("Style",c.style,Mh,u=>r(p=>{p.kind==="chart"&&(p.payload.style=u)},"style"),{def:o.style})}
        <div class="grid2">
          ${c.style==="bars"?f:hn(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"timeline":return h`
        ${le(e,n.payload.value,c=>r(u=>{u.kind==="timeline"&&(u.payload.value=c)},"value"),{label:"States",noShare:!0,key:`${i}-value`})}`;case"image":{let c=n.payload;return h`
        ${ie("Source",c.source,[["camera","Camera"],["entityPicture","Entity picture"]],u=>r(p=>{p.kind==="image"&&(p.payload.source=u)},"source"),{def:o.source})}
        ${ie("Picture",c.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],u=>r(p=>{p.kind==="image"&&(p.payload.contentMode=u)},"mode"),{def:o.contentMode})}`}case"tap":return Ol(e,n.payload,(c,u)=>r(p=>{p.kind==="tap"&&c(p.payload)},u??"action"),i);case"chartTimes":{let c=n.payload;return h`
        ${Qn("Times",c.timeLabelCount,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.timeLabelCount=Math.max(0,Math.min(Pn,Math.round(u))))},"count"),{min:0,max:Pn,step:1,def:o.timeLabelCount,format:u=>u<=0?"None":String(Math.round(u)),range:!1})}
        <div class="grid2">
          ${ae("Time size",c.labelSize,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelSize=Math.min(nn,Math.max(tn,u??tt)))},"size"),{step:.5,min:tn,max:nn,def:o.labelSize,unit:"pt"})}
          ${ye("Time colour",c.labelColorHex,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelColorHex=u??nt)},"colour"),!1,o.labelColorHex)}
        </div>`}case"imageTime":return h``;case"chartDots":{let c=n.payload,u=e.config.elements.find(g=>g.payload.id===c.chart),p=u?.kind==="chart"?Le(e.config,a,u).size??u.payload.lineWidth:void 0,m=p===void 0?void 0:Math.round(p*18)/10;return h`
        ${ie("Dots",c.dots,Eh,g=>r(y=>{y.kind==="chartDots"&&(y.payload.dots=g)},"mode"),{def:"auto"})}
        <div class="grid2">
          ${ae("Dot size",c.size??m,g=>r(y=>{if(y.kind!=="chartDots")return;let b=mt(g);b===void 0||b===m?delete y.payload.size:y.payload.size=b},"size"),{step:.5,min:1,max:12,...m===void 0?{}:{def:m},unit:"pt"})}
          ${Ll("Dot colour",c.colorHex,"Series colour",g=>r(y=>{y.kind==="chartDots"&&(g===void 0?delete y.payload.colorHex:y.payload.colorHex=g)},"colour"))}
        </div>`}case"chartGrid":{let c=n.payload;return h`
        <div class="grid2">
          ${ae("Lines",c.lines,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.lines=An(u??Zt))},"lines"),{step:1,min:1,max:4,def:Zt})}
          ${ae("Thickness",c.thickness,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.thickness=Hn(u??Jt))},"thick"),{step:.25,min:Ja,max:Za,def:Jt,unit:"pt"})}
        </div>
        ${ye("Colour",c.colorHex,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.colorHex=u??Ft)},"colour"),!1,Ft)}`}default:return h`${l}`}}function fh(e,n,t,i){let a=yt.filter(([r])=>It(r)||r===t.at);return h`
    <div class="grid2">
      ${Ce("Reading",t.at,a,r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.at=r)},"at"))}
      ${Ce("Sits",t.place,er.filter(([r])=>r!=="through"),r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.place=r)},"place"))}
    </div>`}function uv(e,n,t){if(n.kind==="tap")return f;let i=n.payload.id,a=je(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);c&&s(c.payload)},l?`${t}-${l}`:void 0),o=ks(e.config,n);return h`
    ${Be("Tappable",a!==void 0,s=>e.update(l=>{s?fr(l,i):gr(l,i)}))}
    ${a?h`<div class="value-editor">
          ${Ol(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${cr(a.payload.outset)?f:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...ls}})}>${U("reset")}</button>`}
            </div>
          </div>
        </div>
        ${sv(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${_t(o)}</b>.</div>`}`}function gh(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function pv(e){return e===void 0?"\u25C6":e.includes("up")?"\u25B2":e.includes("down")?"\u25BC":e.startsWith("circle")?"\u25CF":"\u25C6"}function He(e,n){return e.payload.name?e.payload.name:Yh(e,n)}function hv(e){let n=e.trim();return n===""?void 0:n}function Yh(e,n){let t=e.payload.chartAnchor;if(t!==void 0){let i=yt.find(([a])=>a===t.at)?.[1]??"Reading";return t.place==="through"?`${i} line`:`${i} marker`}switch(e.kind){case"text":return gh(Me(e.payload.value,n));case"icon":return gh(Me(e.payload.symbol,n));case"gauge":return Me(e.payload.value,n);case"chart":return Me(e.payload.value,n);case"timeline":return Me(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let i=e.payload.entity;return i.displayName||i.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let i=e.payload.action,a="entityId"in i?i.displayName||i.entityId:i.type==="callService"?[i.serviceDomain,i.serviceName].filter(r=>r!=="").join("."):i.type==="openPage"&&e.payload.openPageName||"";return a?`${i.type} \xB7 ${a}`:i.type}case"chartTimes":return"Clock times";case"chartDots":return"Reading dots";case"chartGrid":return"Grid lines";case"imageTime":return"Timestamp"}}function Xh(e,n){let t=dt(e.config,n.id),i=me(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return Se(e,"content","Group",h`
    ${Re("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Be("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="shown-head">Layers <span class="shown-count">${t.length}</span></div>
    ${Vl(e,t.map(r=>({el:r,lead:U(r.kind),title:He(r,i),kind:dn[r.kind]})),{icon:"ungroup",label:r=>`Take this ${r} out of the group`,run:r=>e.update(o=>Zi(o,r,void 0))})}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>fi(r,n.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group and keeps it on the face.</div>`,{color:te.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function Jh(e,n){if(n==="inline")return mv(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${ne(n)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${ne(n)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[n]),l?`fam-${n}-${l}`:void 0),a=bo(e.config,n),r=t.backgroundColorHex?Ie(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${Ie(t.borderColorHex)} border`:"no border";return h`
    ${Se(e,"look",`${ne(n)} shape`,h`
      ${ye("Background (blank = transparent)",t.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      <div class="fgroup">
      ${ye("Border colour",t.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${ae("Border width",t.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}
      </div>`,{color:te.look,icon:"shape",summary:`${r} \xB7 ${o}`,...t.backgroundColorHex!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${n==="corner"?Se(e,"corner","Corner content",fv(e,t,i),{color:te.content,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):f}
    ${Se(e,"states","Shape states",im(e,t.rules,"layout",s=>s.perFamily[n]?.rules,`rules-${n}`),{color:te.states,icon:"states",summary:ha(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${Se(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${ne(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${ne(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:te.position,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function mv(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=me(e);return h`
    ${Se(e,"content","Inline text",h`
      ${Re("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${le(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Dl(e,n.countdown===!0,n.value,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}`,{color:te.content,icon:"text",summary:Oe(`${n.label?`${n.label}: `:""}${Me(n.value,i)}`,48)})}
    ${Se(e,"symbol","Symbol",h`
      ${Th(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:te.look,icon:"icon",summary:n.symbol||"None"})}`}function fv(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    <div class="fgroup">
    ${ie("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=V("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${le(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${ye("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    </div>
    <div class="fgroup">
    ${ie("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=V("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:V("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${le(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Dl(e,n.bezelCountdown===!0,n.bezelText,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&n.bezelGauge?gv(e,n.bezelGauge,t):f}
    </div>`}function gv(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${le(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ae("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ae("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${ye("Arc colour (min end)",i[0],a(0))}
    ${ye("Arc colour (middle)",i[1],a(1))}
    ${ye("Arc colour (max end)",i[2],a(2))}
    ${Be("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=V(String(s.minValue)),s.maxLabel=V(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?le(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${n.maxLabel?le(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var u$=se.map(e=>[e,ne(e)]),Gl={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},yv=Object.keys(Gl),co=["color","text","fontSize","fontWeight","visibility"];function bv(e,n=!1){let t=ea[e].filter(i=>!n||co.includes(i));return yv.filter(i=>t.includes(De[i]))}function Zh(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${Jx(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:f}`}var xv={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function eo(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Oe(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Qh(e){if(!e||_e(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function Me(e,n){return`${Ma(e,n)}${Qh(e.format)}`}function Ma(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${Oe(t.value,40)}"`:"(empty)";case"entityState":return eo(t,n);case"entityAttribute":return t.attribute?`${eo(t,n)} \xB7 ${t.attribute}`:eo(t,n);case"entityAge":return`age of ${eo(t,n)}`;case"aggregate":return vv(t.aggregate);case"time":return xv[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${Oe(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(gt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Ma(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function vv(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Sa(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function wv(e,n,t,i,a,r){let o=(s,l)=>e.update(d=>{let c=i(d);c&&s(c)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:f}
    ${n.map((s,l)=>kv(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(ta())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function kv(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),d=e.forced.get(n.id)??"live",c=m=>d==="live"?m==="live":d==="otherwise"?m==="otherwise":d.caseId===m,u=(m,g)=>r(y=>{let b=y.find($=>$.id===n.id);b&&m(b)},g),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(m=>Sa(m,t,t-1))}>${U("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(m=>Sa(m,t,t+1))}>${U("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(m=>{let g=m.findIndex(y=>y.id===n.id);g>=0&&m.splice(g,1)})}>${U("delete")}</button>
    </div>
    ${s===void 0?f:Zh(s,n.partId,me(e),m=>u(g=>{m?g.partId=m:delete g.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${c("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((m,g)=>h`<button class="${c(m.id)?"active":""} ${l===m.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:m.id})}>Case ${g+1}</button>`)}
        ${n.otherwise?h`<button class="${c("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:f}
      </div>
    </div>
    ${n.cases.map((m,g)=>$v(e,m,g,n,a,u,`${o}-${m.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(m=>{m.cases.push(Hs())})}>+ case</button></div>
    ${Be("Otherwise",n.otherwise!==void 0,m=>u(g=>{m?g.otherwise=g.otherwise??[]:delete g.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${em(e,n.otherwise,a,m=>u(g=>{g.otherwise&&m(g.otherwise)}),`${o}-otherwise`,p)}
        </div>`:f}
  </div>`}function $v(e,n,t,i,a,r,o,s=!1){let l=(c,u)=>r(p=>{let m=p.cases.find(g=>g.id===n.id);m&&c(m)},u),d=e.liveBranch(i)===n.id;return h`<div class="case-box ${d?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${d?h` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>Sa(c.cases,t,t-1))}>${U("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(c=>Sa(c.cases,t,t+1))}>${U("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(c=>{let u=c.cases.findIndex(p=>p.id===n.id);u>=0&&c.cases.splice(u,1)})}>${U("delete")}</button>
    </div>
    <div class="row-inline">
      ${ie("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],c=>l(u=>{u.when.join=c}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:f}
    ${n.when.tests.map((c,u)=>Cv(e,c,u,p=>l(m=>{let g=m.when.tests.find(y=>y.id===c.id);g&&p(g)}),()=>l(p=>{p.when.tests=p.when.tests.filter(m=>m.id!==c.id)}),`${o}-${c.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(c=>{c.when.tests.push(As())})}>+ test</button>
      <select class="adder" @change=${c=>{let u=c.target,p=u.value;if(u.value="",!p)return;let m=Gp(p,Np(e.hass?.states));l(g=>{g.when.tests.push(...m)})}}>
        <option value="">+ preset…</option>
        ${Bp.map(c=>h`<option value=${c.kind} title=${c.hint}>${c.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${em(e,n.then,a,c=>l(u=>c(u.then)),`${o}-then`,s)}
  </div>`}function Cv(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=Gn(s.kind),d=e.evaluateTest(n),c=f;switch(l){case"value":c=le(e,s.value??V(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=h`${le(e,s.value??V(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${le(e,s.upper??V(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=h`${Re("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!Sv(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"times":c=h`<div class="row-inline">
          ${yh(e,"From",s.value??V("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${yh(e,"To",s.upper??V("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":c=Tv(n.value)?Ev(s.options??[],u=>o(p=>{p.comparison.options=ml(u)},"options")):Re("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(m=>m.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${U("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:le(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${Ce("Comparison",s.kind,Zc.map(u=>[u,Ci[u]]),u=>o(p=>{p.comparison=Fs(p.comparison,u)}))}
    ${c}
  </div>`}function Sv(e){try{return new RegExp(e),!0}catch{return!1}}function yh(e,n,t,i,a){if(t.kind.kind!=="literal")return le(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=Vn(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${we(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:f}</label>`}function Tv(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function Ev(e,n){let t=Op(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${Dp.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function em(e,n,t,i,a,r=!1){let o=bv(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:f}
    ${n.map((s,l)=>Mv(e,s,l,t,(d,c)=>i(u=>{u[l]&&d(u[l])},c?`${a}-${l}-${c}`:void 0),()=>i(d=>{d.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,d=l.value;l.value="",d&&i(c=>{c.push(Un(d))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${Gl[s]}</option>`)}
    </select>`}var tm=["setColor","setBorderColor","setBackgroundColor"];function Mv(e,n,t,i,a,r,o,s=!1){let l=!ea[i].includes(De[n.kind]),d=s&&!l&&!co.includes(De[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${Gl[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:d?h` <span class="no">(ignored by a part)</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${U("delete")}</button>
    </div>
    ${d?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:f}
    ${nm(e,n,a,o)}
  </div>`}function nm(e,n,t,i){let a=vr(n.kind),r=f;if(a==="value"){let o=n.value??V("");if(tm.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?ye("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=V(l??"#FFFFFF")},"color")):le(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:V("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?f:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=le(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=ae(s,n.number??0,l=>t(d=>{d.number=l??0},"number"),o)}else a==="weight"&&(r=ie("Weight",n.weight??"regular",Ei,o=>t(s=>{s.weight=o})));return r}var Fl=new Set,to=new Map,no=new Map,bh=new Map;function im(e,n,t,i,a,r,o){let s=cl(n);return!s.ok||Fl.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!s.ok} title=${s.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${d=>{Fl.delete(a),Ae(d.target)}}>Show as table</button>
        ${s.ok?f:h`<span class="hint keep">${s.reason}</span>`}
      </div>
      ${wv(e,n,t,i,a,o)}`:Rv(e,s.table,n[0],t,i,a,r,o)}function Rv(e,n,t,i,a,r,o,s){let l=(R,X)=>e.update(x=>{let S=a(x);S&&R(S)},X?`${r}-${X}`:void 0),d=n.value??bh.get(r)??o,c=n.rows.length===0,u=n.numberMode||c&&d!==void 0&&!Tp(d)&&Av(e.resolve(d)),p=ea[i],m=to.get(r)??new Set,g=n.columns.length===0&&m.size===0?[Sp[i]]:[],y=fp(n.columns,[...m,...g.filter(R=>R!==void 0)],p),b=Qr.get(r),$=t?t.partId:s?.some(R=>R.id===b)?b:void 0,k=s!==void 0&&$!==void 0,w=k?p.filter(R=>co.includes(R)):p,C=k?y.filter(R=>!co.includes(R)):[],L=(R,X)=>{if(!t){R?Qr.set(r,R):Qr.delete(r),Ae(X);return}l(x=>{let S=x[0];S&&(R?S.partId=R:delete S.partId)})},M=t?e.liveBranch(t):"none",H=t?e.forced.get(t.id)??"live":"live",A=R=>H!=="live"&&(H==="otherwise"?R==="otherwise":H.caseId===R),E=R=>{t&&e.setForced(t.id,A(R)?"live":R==="otherwise"?"otherwise":{caseId:R})},I=R=>{bh.set(r,R),n.rows.length!==0&&l(X=>kp(X,R),"lhs")},j=()=>{Qr.delete(r),l(R=>{vp(R,d??V(""),u),$!==void 0&&R[0]&&R[0].partId===void 0&&(R[0].partId=$)})},W=n.rows.map((R,X)=>vh(e,{key:`${r}-${R.caseId}`,label:Cp(R.comparison,x=>Me(x,me(e))),columns:y,changes:R.changes,live:M===R.caseId,forced:A(R.caseId),onForce:()=>E(R.caseId),when:_v(e,R.comparison,`${r}-${R.caseId}`,(x,S)=>l(F=>{let O=F[0]?.cases.find(K=>K.id===R.caseId)?.when.tests[0];O&&x(O.comparison)},S&&`${R.caseId}-${S}`)),updChanges:(x,S)=>l(F=>{let O=F[0]?.cases.find(K=>K.id===R.caseId);O&&x(O.then)},S&&`${R.caseId}-${S}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${X===0} @click=${()=>l(x=>ul(x,X,X-1))}>${U("up")}</button>
      <button class="icon" title="Move down" ?disabled=${X===n.rows.length-1} @click=${()=>l(x=>ul(x,X,X+1))}>${U("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(x=>wp(x,R.caseId))}>${U("delete")}</button>`})),q=n.otherwise===void 0?f:vh(e,{key:`${r}-otherwise`,label:"Otherwise",columns:y,changes:n.otherwise,live:M==="otherwise",forced:A("otherwise"),onForce:()=>E("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(R,X)=>l(x=>{let S=x[0]?.otherwise;S&&R(S)},X),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(R=>pl(R,!1))}>${U("close")}</button>`}),P=no.get(r),_=Hv.filter(R=>w.includes(R)&&!y.includes(R));return h`
    <div class="states">
      ${le(e,d??V(""),I,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${d===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:f}
      ${s===void 0?f:Zh(s,$,me(e),L)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${y.map(R=>h`<th>
              <span>${wt[R]}</span>
              <button class="icon" title=${`Remove the ${wt[R]} column`}
                @click=${X=>{no.set(r,R),Ae(X.target)}}>${U("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${W}
          ${q}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${y.length+2}>${yp(i)}</td></tr>`:f}
        </tbody>
      </table></div>
      ${C.length===0?f:h`<div class="hint warn">A part ignores ${xo(C.map(R=>wt[R]))}. Pick Whole text to use ${C.length===1?"it":"them"}.</div>`}
      ${P===void 0?f:h`<div class="hint warn confirm-row">
        Remove the ${wt[P]} column? Its ${xh(n,P)} value${xh(n,P)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${R=>{no.delete(r),to.get(r)?.delete(P),Ae(R.target),l(X=>$p(X,P))}}>Remove</button>
        <button class="small" @click=${R=>{no.delete(r),Ae(R.target)}}>Cancel</button>
      </div>`}
      <div class="states-add">
        <button class="small" title="Add a row to the table: a value to match under When, and the look it gets" @click=${j}>${U("plus")}<span>Add a state</span></button>
        <span class="states-add-note">${Vr(i).state}</span>
        ${n.otherwise===void 0?h`<button class="small" title="Add an Otherwise row at the bottom of the table" @click=${()=>l(R=>pl(R,!0))}>${U("plus")}<span>Add otherwise</span></button>
            <span class="states-add-note">${Vr(i).otherwise}</span>`:f}
        ${_.length===0?f:h`<select class="chip-add" title="Add a column to the table" aria-label="Change another setting" @change=${R=>{let X=R.target,x=X.value;if(X.value="",!x)return;let S=to.get(r)??new Set;S.add(x),to.set(r,S),Ae(X)}}>
          <option value="" selected>Change another setting…</option>
          ${_.map(R=>h`<option value=${R}>${wt[R]}</option>`)}
        </select>
        <span class="states-add-note">${Vr(i).column}</span>`}
      </div>
      ${H==="live"?f:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${R=>{Fl.add(r),Ae(R.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Av(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var Hv=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function xh(e,n){let t=0;for(let i of e.rows)Br(i.changes,n)&&(t+=1);return e.otherwise&&Br(e.otherwise,n)&&(t+=1),t}function Fv(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function vh(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{Fv(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${Iv(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function Iv(e,n,t,i,a){let r=Br(t,n),o=yo(a);if(!r)return h`<button type="button" class="cell empty" title=${`Set ${wt[n]} for this state`}
      @click=${d=>{i(c=>{c.push(Un(mp[n]))}),Ah(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(u=>{let p=u.find(m=>De[m.kind]===n);p&&d(p)},c&&`${n}-${c}`),l=wt[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${Lv(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${Hh}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${ka.has(o)?h`${n==="visibility"?ie("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):nm(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let u=c.findIndex(p=>De[p.kind]===n);u>=0&&c.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:f}
    </div>`}function Lv(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=vr(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${Ei.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??V(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(tm.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Ie(a):Me(i,me(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??f}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${Me(i,me(e))}</span>`}function Ie(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function _v(e,n,t,i){let a=Gn(n.kind),r=dl(n.kind),o=(s,l,d,c)=>Pv(e,s,l,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${we(s=>i(l=>{let d=Fs(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${ll.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${zv(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??V(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??V(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:f}
  </span>`}function zv(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return Ci[e]}}function Pv(e,n,t,i,a,r,o){let s=yo(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${le(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${we(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${Rh(e,s,o,n,t,l)}
  </span>`}var Ra=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:vs,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function sm(e){return Ra.find(n=>n.kind===e)??Ra[0]}var am="#FF9F0A",wo="#8E8E93",Nv=["#FF453A","#FFD60A","#34C759"],lm=["#0A84FF","#34C759","#FF9F0A"];function Dv(e){return e?.attributes?.device_class==="battery"?Nv:lm}var Ov={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function Bv(e){let n=e.iconName?.trim();return n?{off:n,on:n}:Ov[Ul(e)]??{off:"circle",on:"circle.fill"}}function Vv(e){switch(Ul(e)){case"lock":return{kind:"equals",value:V("locked")};case"cover":case"valve":return{kind:"equals",value:V("open")};case"media_player":return{kind:"equals",value:V("playing")};default:return{kind:"isOn"}}}function Ul(e){return e.domain||e.entityId.split(".")[0]||""}function yn(e){return{...e,domain:Ul(e)}}function Gv(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Ri(e){return Math.round(e*1e4)/1e4}function ni(e,n,t){return Math.min(t,Math.max(n,e))}function Wl(e,n,t){let i=ze[e],a=ni(Ri(n/i.width),0,1),r=ni(Ri(t/i.height),0,1);return{x:Ri((1-a)/2),y:Ri((1-r)/2),width:a,height:r,rotationDegrees:0}}function Uv(e){let n=ze[e],t=ni(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:Wl(e,t*1.3,t*1.3),size:t}}function Wv(e){let n=ze[e],t=ni(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:Wl(e,n.width*.88,t*1.7),size:t}}function Kv(e){let n=ze[e],t=Math.min(n.width,n.height)*.9;return{frame:Wl(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function dm(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function jv(e){let n=ze[e],t=ni(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:Ri(t/n.height),rotationDegrees:0}}}function qv(e){let n=ze[e],t=ni(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:Ri(ni(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function Yv(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Xv(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function fn(e,n,t,i){let a=i(t);n.payload.frame=a.frame,Xv(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=Pt());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function gn(e){return Ee(e)}function Kl(e,n){let t={kind:{kind:"entityState",...yn(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function rm(e){let n=Un("setIcon");return n.value=V(e),n}function ti(e){let n=Un("setColor");return n.value=V(e),n}function Jv(e,n){let t=ta(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...yn(e)}},a.comparison=Vv(e);let r=n.on!==n.off;return i.then=r?[rm(n.on),ti(am)]:[ti(am)],t.otherwise=r?[rm(n.off),ti(wo)]:[ti(wo)],t}function Zv(e){let n=ta(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...yn(e)}},i.comparison={kind:"isUnavailable"};let a=Un("setOpacity");return a.number=.35,t.then=[a],n}function om(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Qv(e,n,t=lm){let i=n.max-n.min,a=om(n.min+i/3),r=om(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:V(a)},changes:[ti(t[0])]},{comparison:{kind:"between",value:V(a),upper:V(r)},changes:[ti(t[1])]},{comparison:{kind:"greaterThan",value:V(r)},changes:[ti(t[2])]}];return gp(Kl(e),o)}function ew(e,n,t){let i=gn("icon"),a=Bv(n);return i.payload.symbol=V(a.off),i.payload.colorSlot.baseColorHex=wo,i.payload.rules=[Jv(n,a)],fn(e,i,t.family,Uv),e.elements.push(i),fr(e,i.payload.id,{type:"toggleEntity",...yn(n)}),i.payload.id}function tw(e,n,t){let i=gn("text");return i.payload.value=Kl(n,t.state),i.payload.rules=[Zv(n)],fn(e,i,t.family,Wv),e.elements.push(i),i.payload.id}function nw(e,n,t){let i=gn("gauge");i.payload.value=Kl(n);let a=Gv(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Qv(n,a,Dv(t.state))],fn(e,i,t.family,Kv),e.elements.push(i),i.payload.id}function iw(e,n,t){let i=gn("chart");return i.payload.value={kind:{kind:"entityState",...yn(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",fn(e,i,t.family,dm),e.elements.push(i),i.payload.id}function aw(e,n,t){let i=gn("chart");return i.payload.value={kind:{kind:"entityState",...yn(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",fn(e,i,t.family,dm),e.elements.push(i),i.payload.id}function rw(e,n,t){let i=yn(n),a=gn("text");a.payload.value=V(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=wo,fn(e,a,t.family,qv),e.elements.push(a);let r=t.state?.attributes?.device_class,o=gn("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=ss(i.domain,typeof r=="string"?r:void 0),fn(e,o,t.family,jv),e.elements.push(o),o.payload.id}function ow(e,n,t){let i=gn("image");return i.payload.entity=yn(n),fn(e,i,t.family,Yv),e.elements.push(i),i.payload.id}function cm(e,n,t,i){switch(n){case"toggle":return ew(e,t,i);case"status":return tw(e,t,i);case"gauge":return nw(e,t,i);case"chart":return iw(e,t,i);case"history":return aw(e,t,i);case"doorHistory":return rw(e,t,i);case"camera":return ow(e,t,i)}}var sw=/^[a-z0-9_]+\.shared_(\d+)$/;function um(e){return sw.test(e)}function lw(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function mm(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function fm(e,n){let t=new Map;for(let i of Rs(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=mm(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${lw(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function dw(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);Es(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),Ms(t,r=>$s(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"});for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}));return t.dataSources=[],t}function gm(e){let n=!1;return xr(e,t=>{let i=t.kind;if(i.kind!=="aggregate")return;let a=i.aggregate.scope;a.kind==="filter"&&a.areaIds.length+a.labelIds.length+a.floorIds.length>0&&(n=!0)}),n}function cw(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(d=>r+t(d,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(d=>o[d]!==void 0).sort();return s.length===0?"{}":`{
${s.map(d=>`${r}${JSON.stringify(d)}: ${t(o[d],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function ym(e,n,t=[]){let i=n==="share"?dw(e,t):e,a=hi(i);return delete a.id,delete a.slotIndex,n==="share"&&delete a.hidden,a.dataSources=[],`${cw(a)}
`}function bm(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var uw="There is nothing to read here. Paste a complication first.",pw="This is not valid JSON. Check for a missing brace or a stray comma.",hw="This is valid JSON but not a complication. A complication starts with { and ends with }.",mw="This does not look like a complication.",pm="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",fw="00000000-0000-4000-8000-000000000000";function gw(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function xm(e,n){let t=e.trim();if(t==="")return{ok:!1,error:uw};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:pw}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:hw};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${pm}`};let o={...a,id:fw,slotIndex:0},s;try{s=pi(o)}catch(d){let c=d instanceof it||d instanceof Error?d.message:String(d);return{ok:!1,error:`${mw}

${gw(c)}`}}delete s.hidden;let l=ur(a);if(l.length>0){let d=l.slice(0,3).join(", "),c=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${d}${c}. ${pm}`}}return{ok:!0,config:s,raw:i}}function jl(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=Rs(e,(o,s)=>um(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=um(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:mm(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function vm(e,n){let t=structuredClone(e);Es(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return Ms(t,a=>$s(a,i)),t}function wm(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}var yw={rectangular:"Rectangular",circular:"Circular",corner:"Corner",inline:"Inline"};function km(e,n){return{layers:e.elements.length,families:ua(e).map(t=>yw[t]??t),slots:n.filter(t=>t.required).length,missing:n.filter(t=>!t.required).length}}var $m="import";function hm(e){let n="";for(let t=0;t<e.length;t+=32768)n+=String.fromCharCode(...e.subarray(t,t+32768));return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function bw(e){if(!/^[A-Za-z0-9_-]*$/.test(e)||e.length%4===1)return;let n=e.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((e.length+3)%4);try{let t=atob(n),i=new Uint8Array(t.length);for(let a=0;a<t.length;a+=1)i[a]=t.charCodeAt(a);return i}catch{return}}async function Cm(e,n){let t=new Blob([e]).stream().pipeThrough(n);return new Uint8Array(await new Response(t).arrayBuffer())}async function Sm(e,n={}){let t=new TextEncoder().encode(e);if(n.compress!==!1&&typeof CompressionStream=="function")try{return`z${hm(await Cm(t,new CompressionStream("gzip")))}`}catch{}return`t${hm(t)}`}async function ql(e){let n=bw(e.slice(1));if(!n)return;let t=new TextDecoder("utf-8",{fatal:!0});try{if(e.startsWith("t"))return t.decode(n);if(e.startsWith("z")&&typeof DecompressionStream=="function")return t.decode(await Cm(n,new DecompressionStream("gzip")))}catch{}}function Tm(e,n){return`${e.split("#")[0]??e}#${$m}=${n}`}function Yl(e){let n=e.startsWith("#")?e.slice(1):e,t=`${$m}=`;if(!n.startsWith(t))return;let i=n.slice(t.length);return i.length>1?i:void 0}function Em(e){let n=e.trim();if(n===""||/\s/.test(n)||n.startsWith("{"))return;let t=n.indexOf("#");return t<0?void 0:Yl(n.slice(t))}var Xl="This share link is damaged or cut short. Ask for it again, or paste the text instead.";function Jl(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}var vw="wrist-assistant-panel.picker-hidden.v1:",ww=3e4,kw=500,$w=3e4,Mm="preset-entity";function Rm(e){return`import-entity-${e}`}var Cw={entityId:"",displayName:"",domain:""},Sw=new Map,Tw={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Zl(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function Ew(e){return e.kind==="family"?"look":"content"}function Ql(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function Am(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function Mw(e){let n=v`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=e==="rectangular"?v`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`:e==="circular"?v`<circle cx="22" cy="26" r="8" fill="currentColor" />`:e==="corner"?v`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`:v`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`;return h`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${t}</svg>`}var Hm=300,Fm=360,nd=44,id=22,Om=[1,1.7,2.6],Rw=["S","M","L"],Im=["Small","Medium","Large"];function Aw(){return Om.map((e,n)=>{let t=Math.round(nd*e),i=Math.round(id*e),a=`.layers-card.s${n}`;return`
    @container layers (max-width: ${t+299}px) {
      ${a} .layer {
        grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr);
        grid-template-areas: "grip bar thumb name" "grip bar right right";
        row-gap: 0; padding-top: 5px; padding-bottom: 5px;
      }
      ${a} .layer.dragging { padding-top: 0; padding-bottom: 0; }
      ${a} .layer > .grip { grid-area: grip; }
      ${a} .layer > .bar { grid-area: bar; }
      ${a} .layer > .thumb, ${a} .layer > .folder { grid-area: thumb; }
      ${a} .layer > .name { grid-area: name; }
      ${a} .layer > .right { grid-area: right; min-width: 0; flex-wrap: wrap; justify-content: flex-start; gap: 0 4px; }
      ${a} .layer:not(.group) .badge, ${a} .layer:not(.group) .acts { margin-top: 4px; }
      ${a} .layer:not(.group):hover .badges, ${a} .layer.hl .badges, ${a} .layer:focus-within .badges { display: inline-flex; }
      ${a} .layer:not(.group):not(.rich):not(.hl):not(:focus-within):hover .acts { display: none; }
      ${a} .layer.pinned .badges { display: none; }
      ${a} .layer.group { grid-template-areas: "grip bar thumb name" "grip bar thumb right"; }
      ${a} .layer.group > .right { justify-content: flex-end; gap: 2px; }
      ${a} .group-kids { margin-left: 6px; padding-left: 6px; }
      ${a} .group-cta { flex-wrap: wrap; }
    }
    @container layers (max-width: ${t+149}px) {
      ${a} .layer {
        grid-template-columns: 16px 3px minmax(0, 1fr);
        grid-template-areas: "grip bar thumb" "grip bar name" "grip bar right";
      }
      ${a} .layer > .thumb { justify-self: start; width: min(var(--thumb-w), 100%); height: auto; aspect-ratio: ${t} / ${i}; }
      ${a} .layer > .name { padding-top: 4px; }
      ${a} .layer.group {
        grid-template-columns: 16px 3px minmax(0, 1fr) auto;
        grid-template-areas: "grip bar thumb right" "grip bar name name";
      }
      ${a} .layer.group > .folder { justify-self: start; width: auto; }
      ${a} .layer.group > .name { padding-top: 2px; }
      ${a} .group-kids { margin-left: 2px; padding-left: 4px; }
    }`}).join(`
`)}var Lm="wrist-assistant-panel.layers.v1",_m="wrist-assistant-panel.grid.v1",Bt=34,ii=200,Hw=720,ko=320,Fw=80,Iw=56,zm="wrist-assistant-panel.columns.v3",ed=e=>Math.max(ii,Math.min(Hw,Math.round(e))),Pm=e=>e.metaKey||e.ctrlKey||e.shiftKey;function Lw(e,n,t){let a=e.querySelector(`g[data-element-id="${CSS.escape(n)}"]`)?.firstElementChild;if(!a||a.tagName.toLowerCase()!=="rect")return!1;let r=a.getBoundingClientRect();return t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}var _w=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,zw=3,Aa=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",bn=Aa==="Cmd"?"\u2318":"Ctrl+",td=Aa==="Cmd"?"\u21E7":"Shift+";function Nm(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-Fw;if(i>=ii*2+ko){let r=i-ko,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(ii,Math.floor(o*l)),s=Math.max(ii,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(ii,o-d):s=Math.max(ii,s-d))}return{columns:3,left:o,right:s}}let a=e-Iw;return a>=ii+ko?{columns:2,left:Math.min(n,a-ko),right:t}:{columns:1,left:n,right:t}}var N=class N extends Ut{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Hm;this.colRight=Fm;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.historyReadings=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set;this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.pickerHiddenOpen=!1;this.sharedHelp=!1;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.snapGrid=!0;this.gridStep=.01;this.showGridLines=!1;this.altHeld=!1;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareNote="";this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.importDrop=!1;this.importDragDepth=0;this.importEntities=[];this.helpTab="basics";this.linkReady=!1;this.recordPreviews=new Map;this.previewCase=ki.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=dp(()=>this.requestUpdate());this.imageSizes=cp(()=>this.requestUpdate());this.symbols=new Pr(()=>this.requestUpdate());this.keyHandler=t=>{t.key==="Alt"&&(this.altHeld=!0),this.onKey(t)};this.blurHandler=()=>{this.altHeld=!1};this.heldArrows=new Set;this.keyUpHandler=t=>{t.key==="Alt"&&(this.altHeld=!1),this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new Or;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.menuOutside=t=>{let i=this.openMenu;if(i===void 0)return;t.composedPath().some(r=>r instanceof HTMLElement&&r.dataset.menu===i)||this.toggleMenu(i,!1)};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importDragEnter=t=>{this.dragReadable(t)&&(t.preventDefault(),this.importDragDepth+=1,this.importDrop=!0)};this.importDragOver=t=>{this.dragReadable(t)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))};this.importDragLeave=()=>{this.importDragDepth!==0&&(this.importDragDepth-=1,this.importDragDepth===0&&(this.importDrop=!1))};this.importDropped=t=>{this.importDragDepth=0,this.importDrop=!1;let i=t.dataTransfer?.files?.[0];if(i){t.preventDefault(),this.readImportBlob(i);return}let a=t.dataTransfer?.getData("text/plain")??"";a!==""&&(t.preventDefault(),this.setImportText(a))};this.takeShareLink=()=>{let t=Yl(window.location.hash);t!==void 0&&(history.replaceState(history.state,"",`${window.location.pathname}${window.location.search}`),this.pendingLink=t,this.linkReady&&this.openPendingLink())};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importParse,a=i?.ok?i.config:void 0;if(!a)return;let r=jl(a,this.hass.states);r.some(s=>zl(Rm(s.entityId)))||Jl({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(r)})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||zl(Mm)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0};this.pressing=!1;this.pressStart=()=>{this.pressing=!0};this.pressEnd=()=>{window.setTimeout(()=>{this.pressing=!1})};this.sharedValueFocus=t=>{this.pressing||this.sharedValueOutside(t)};this.sharedValueOutside=t=>{if(this.openValue===void 0)return;let i=t.composedPath(),a=i[0];if(a instanceof HTMLElement&&a.classList.contains("values-list"))return;i.some(o=>o instanceof HTMLElement&&o.classList.contains("vitem")&&o.classList.contains("open"))||this.setOpenValue(void 0)}}get testValues(){return this.draft?.testValues??Sw}static{this.styles=Ao`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      /* Home Assistant's ha-panel-custom is a plain block with no height of
         its own, so 100% here resolves to auto and the columns collapse to
         nothing. The panel owns the whole viewport (custom panels draw no
         HA toolbar), so take it from the viewport instead. */
      height: 100vh;
      height: 100dvh;
      font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Inter", Roboto, sans-serif);
      font-size: 14px;
      /* Colours the whole editor shares: one per layer kind, one per section
         that is not about a kind. Set once so a badge, a bar and a card agree. */
      --wa-text: ${Fe(Xe.text)};
      --wa-icon: ${Fe(Xe.icon)};
      --wa-gauge: ${Fe(Xe.gauge)};
      --wa-shape: ${Fe(Xe.shape)};
      --wa-image: ${Fe(Xe.image)};
      --wa-tap: ${Fe(Xe.tap)};
      --wa-states: ${Fe(te.states)};
      --wa-place: ${Fe(te.place)};
      /* The skin. Light follows the Home Assistant theme it sits in; the dark
         block below replaces these with the editor's own deep palette. The
         rest of the sheet only ever reads these names, so the two skins can
         never drift apart in anything but colour. */
      --wa-bg: var(--primary-background-color, #f3f1ec);
      --wa-card: var(--card-background-color, #ffffff);
      --wa-panel: var(--secondary-background-color, #f6f4ef);
      --wa-raised: #faf9f6;
      --wa-input: #ffffff;
      --wa-line: var(--divider-color, #e4e0d7);
      --wa-line-strong: #cfc9bd;
      --wa-ink: var(--primary-text-color, #201d19);
      --wa-muted: var(--secondary-text-color, #7d766c);
      --wa-accent: var(--primary-color, #3d5bd9);
      --wa-accent-ink: #fff;
      /* The one filled button on screen. Ink on paper in the light skin, where
         a saturated fill fights the tinted cards; the accent in the dark one,
         where ink is the ground. */
      --wa-primary-bg: var(--wa-ink);
      --wa-primary-ink: #fff;
      /* A selected row: a cool wash rather than the kind colour, so a list of
         eight kinds still has one obvious "you are here". */
      --wa-sel-bg: #edf0fb;
      --wa-sel-ring: #c5cef2;
      /* Inspector rows: a fixed title column, so every control starts at the
         same x, and one soft fill for the boxes in them. The fill is ink at
         low strength, so it suits both skins without a second value. The lit
         button of a segmented control sits a step above that fill. */
      --wa-lab: 88px;
      /* Where a card's controls start: past the title column. A narrow
         inspector stacks titles over controls and sets this to 0. */
      --wa-col: calc(var(--wa-lab) + 8px);
      --wa-field: color-mix(in srgb, var(--wa-ink) 5.5%, transparent);
      --wa-seg-on: var(--wa-card);
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
      --wa-primary-bg: var(--wa-accent);
      --wa-primary-ink: var(--wa-accent-ink);
      --wa-sel-bg: color-mix(in srgb, var(--wa-accent) 18%, var(--wa-card));
      --wa-sel-ring: color-mix(in srgb, var(--wa-accent) 45%, transparent);
      --wa-seg-on: #2b2f3d;
      --wa-ent: #5fd4c4;
      --wa-val: #ffc45c;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 14%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 16%, transparent);
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The header sits on the page rather than on a bar of its own: no rule
       under it, no card behind it. What reads as chrome are the two white
       boxes in it, which is where the controls actually are. */
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      min-height: 54px;
      background: var(--wa-bg);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      flex: none;
      z-index: 20;
    }
    /* The step from one header question to the next. The header reads left to
       right as a route: choose a watch,
       then choose a complication, or make one. The arrows carry that, so they
       are drawn in ink rather than in the hairline grey they used to wear,
       where they were all but invisible against the bar. */
    header .hstep { color: var(--wa-muted); display: grid; place-items: center; flex: none; margin: 0 2px; }
    header .hstep svg { width: 20px; height: 20px; display: block; }
    header .hor { font-size: 12px; color: var(--wa-muted); flex: none; margin: 0 2px; }
    header .spacer { flex: 1; }
    header label { font-size: 12.5px; display: inline-flex; align-items: center; gap: 6px; color: var(--wa-muted); }
    header label.pick-label { margin-right: -2px; }
    header label select { max-width: 220px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Two boxes, one shape: a white pill with a hairline ring, holding a run of
       quiet controls with 1px dividers between the groups inside it. */
    .hbox {
      display: inline-flex; align-items: center; gap: 8px; height: 34px; flex: none;
      border-radius: 9px; background: var(--wa-card); box-shadow: 0 0 0 1px var(--wa-line);
    }
    .hbox.hist { gap: 2px; padding: 0 3px; }
    .hbox.status { padding: 0 3px 0 10px; gap: 10px; max-width: 100%; }
    .hbox .hdiv { width: 1px; height: 18px; background: var(--wa-line); flex: none; }
    .hbox button.icon { width: 28px; height: 28px; }
    /* Buttons: one quiet shape everywhere, the accent fill kept for the single
       action that matters, and a soft ring on focus instead of a hard outline. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 11px; min-height: 30px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled), button.small:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
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
       nothing to save and lit, with the unsaved halo, once there is, so the
       button, the dirty dot and the footer line all say "unsaved" the same
       way. */
    header button.save { min-height: 28px; padding: 0 14px; }
    header button.save:not(.dirty) { background: var(--wa-panel); color: var(--wa-muted); border-color: transparent; }
    header button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #e0a100) 35%, transparent); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 0 9px; font-size: 12px; min-height: 26px; border-radius: 8px; }
    /* An icon and its words on one line. Without this the icon, drawn as a
       block, sits on a line of its own above the words. */
    button.small:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 5px; }
    button.small > svg.ui-icon { width: 13px; height: 13px; flex: none; }
    /* An Extras switch whose layer is already on the chart: pressed, not greyed.
       Clicking it again takes the layer off. */
    .adders button.small.on, .adders button.small.on:disabled { display: inline-flex; align-items: center; gap: 5px; opacity: 1;
      color: var(--primary-color, #7c6cf0); border-color: color-mix(in srgb, var(--primary-color, #7c6cf0) 45%, transparent);
      background: color-mix(in srgb, var(--primary-color, #7c6cf0) 12%, transparent); }
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
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--warning-color, #e0a100); vertical-align: middle; box-shadow: 0 0 6px var(--warning-color, #e0a100); }
    .dirty-dot.clean { background: var(--success-color, #3dd68c); box-shadow: none; }
    .dirty-dot.none { background: var(--wa-line-strong); box-shadow: none; }

    /* Native controls: the same dark well, hairline and focus ring as the
       buttons, so a select in the header and a number field in the inspector
       read as one family. */
    select {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 30px;
      padding: 0 26px 0 10px; border-radius: 7px; border: 1px solid var(--wa-line); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238d92a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 30px;
      padding: 5px 10px; border-radius: 7px; border: 1px solid var(--wa-line); background: var(--wa-input);
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
      width: 32px; height: 18px; border-radius: 999px; position: relative;
      background: color-mix(in srgb, var(--wa-ink) 16%, transparent); border: 0;
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
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { color: var(--wa-muted); font-weight: 500; font-size: 12px; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    .picker .menu {
      position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 400px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13px;
      background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: help; }
    .picker .menu .pk-note { font-size: 12px; line-height: 1.4; color: var(--wa-muted); padding: 0 10px 8px 88px; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
    /* A saved complication's row: the part that opens it, then its own hide
       and delete buttons, which neither open it nor shut the menu. */
    .picker .menu .row.rec { padding: 0; gap: 0; cursor: default; }
    .picker .menu .row.rec > .pick {
      display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; text-align: left; font: inherit;
      background: transparent; border: 0; color: inherit; padding: 6px 4px 6px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row.rec > .pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .menu .row.rec.dim > .pick { opacity: .5; }
    .picker .menu .pk-acts { display: flex; align-items: center; gap: 2px; flex: none; padding-right: 6px; }
    .picker .menu .pk-acts button.icon { width: 26px; height: 26px; }
    .picker .menu .pk-acts button.small { min-height: 24px; padding: 0 7px; }
    .picker .menu .pk-hidden-head {
      display: flex; align-items: center; gap: 6px; width: 100%; font: inherit; font-size: 12px; font-weight: 600;
      color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
      margin-top: 6px; padding: 8px 10px 6px; cursor: pointer; text-align: left;
    }
    .picker .menu .pk-hidden-head:hover { color: var(--wa-ink); }
    .picker .menu .pk-hidden-head:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .picker .menu .pk-hidden-head svg { width: 14px; height: 14px; transition: transform .12s ease-out; }
    .picker .menu .pk-hidden-head[aria-expanded="true"] svg { transform: rotate(90deg); }
    /* The row picture: the complication drawn as the watch draws it, in a
       fixed box so every name in the list still starts on the same column. */
    .pk-art { width: 68px; height: 30px; flex: none; display: grid; place-items: center; pointer-events: none; }
    .pk-art svg { display: block; max-width: 100%; max-height: 30px; width: auto; height: auto; background: #000; border-radius: 4px; }
    .pk-art.circular svg { border-radius: 50%; }
    .pk-art.corner svg { background: #2c2c2e; }
    .pk-art .inline-line {
      font-size: 9px; padding: 2px 6px; max-width: 100%; min-width: 0; display: inline-flex; align-items: center; gap: 3px;
      border-radius: 999px; background: #000; color: #fff; overflow: hidden; white-space: nowrap;
    }
    .pk-art .inline-line svg { background: transparent; border-radius: 0; }
    /* Shape filter, only drawn once the list is long. */
    .pk-filter { display: flex; gap: 4px; flex-wrap: wrap; padding: 4px 6px 8px; border-bottom: 1px solid var(--wa-line); margin-bottom: 6px; }
    .pk-chip {
      display: inline-flex; align-items: center; gap: 5px; font: inherit; font-size: 11.5px; font-weight: 500;
      padding: 4px 8px; border-radius: 999px; cursor: pointer; color: var(--wa-muted);
      border: 1px solid var(--wa-line); background: transparent;
    }
    .pk-chip:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .pk-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-chip:disabled { opacity: .35; cursor: default; }
    .pk-chip.on { border-color: var(--wa-accent); color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pk-count { font-size: 10.5px; opacity: .65; font-weight: 400; }

    /* New complication: its own button beside the list, because making one was
       a row buried under every complication that already existed. */
    .newc { position: relative; display: inline-flex; align-items: center; gap: 6px; }
    .new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    /* The one way to start something from an empty panel, so it is filled
       rather than outlined: the header's other controls are all about a
       complication that already exists. */
    .new-btn.primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .new-btn.primary:hover:not(:disabled) { border-color: transparent; filter: brightness(1.1); }
    .new-btn:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .new-btn:disabled { opacity: .45; cursor: not-allowed; }
    .new-btn svg { width: 16px; height: 16px; }
    .newc-full { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }

    /* The New complication dialog: name, shape, Create. In the middle of the
       window rather than hanging off the button, because it asks two questions
       and refuses until both are answered. */
    dialog.new-dialog {
      width: min(430px, calc(100vw - 32px)); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.new-dialog::backdrop { background: rgba(0,0,0,.45); }
    .new-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
    .new-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .new-head .spacer { flex: 1; }
    /* Label over control here, not beside it: the inspector's two-column field
       gives a third of the row to a one-word label, and four shape cards need
       every pixel of a 430 px dialog. */
    .new-body .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; }
    .new-body .field > span { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
    .new-body { padding: 14px 18px 4px; }
    .new-body .field.new-shapes { margin-top: 14px; }
    .new-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px 16px; }
    .shape-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    /* Not one of them starts picked. A tinted default reads as a
       recommendation, and the shape is the one thing about a complication
       that cannot be changed later without moving every layer. */
    .shape-card {
      display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
      font: inherit; font-size: 11.5px; padding: 10px 4px 8px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .shape-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-ink); }
    .shape-card .shape-art { width: 34px; height: 40px; display: block; }
    .shape-card-name { font-weight: 600; }
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    .shape-dot.on { opacity: 1; }

    /* Share and Import. Both are wider than New: one holds a whole document as
       text, the other a row for every entity the design reads. Both scroll
       inside themselves, so a design with twenty slots still has its buttons
       on screen. */
    dialog.share-dialog, dialog.import-dialog {
      width: min(560px, calc(100vw - 32px)); max-height: calc(100vh - 40px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
      display: flex; flex-direction: column;
    }
    dialog.share-dialog::backdrop, dialog.import-dialog::backdrop { background: rgba(0,0,0,.45); }
    .xfer-body { padding: 14px 18px 4px; overflow: auto; flex: 1 1 auto; min-height: 0; }
    .xfer-body .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; }
    .xfer-body .field > span { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
    .xfer-body .field + .field { margin-top: 14px; }
    .xfer-modes { display: flex; flex-direction: column; gap: 8px; }
    .xfer-mode { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; cursor: pointer; }
    .xfer-mode input { flex: none; margin: 3px 0 0; accent-color: var(--wa-accent); }
    .xfer-mode b { font-weight: 600; }
    .xfer-mode .hint { display: block; margin: 1px 0 0; }
    /* The document itself. Monospace and never wrapped: a wrapped line reads as
       a line break that is not in the text, and this text gets pasted. */
    .xfer-text {
      width: 100%; box-sizing: border-box; resize: vertical; white-space: pre; overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.45;
    }
    /* One slot per row: the id the reader will see, the label they will read
       beside it, and underneath, every place in the design that uses it. */
    .xfer-slot { padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .xfer-slot:first-child { border-top: 0; }
    .xfer-slot .srow { display: flex; align-items: center; gap: 10px; }
    .xfer-slot .sid {
      flex: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      color: var(--wa-ent); min-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .xfer-slot .srow input[type=text] { flex: 1 1 auto; min-width: 0; }
    .xfer-slot .hint { margin: 3px 0 0; }
    .xfer-file { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .xfer-file .hint { margin: 0; }
    .xfer-problem { white-space: pre-line; }
    .xfer-link { width: 100%; box-sizing: border-box; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* What the pasted text turned out to be: each shape drawn small, beside
       its name and the counts that matter before importing. */
    .xfer-preview {
      display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 14px; padding: 10px 12px;
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-panel);
    }
    .xfer-preview + .field { margin-top: 14px; }
    .xfer-arts { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .pk-art.xfer-art { width: auto; min-width: 48px; max-width: 150px; height: 56px; }
    .pk-art.xfer-art svg { max-height: 56px; }
    .pk-art.xfer-art .inline-line { font-size: 11px; padding: 3px 8px; }
    .xfer-facts { display: flex; flex-direction: column; gap: 2px; min-width: 0; font-size: 13px; }
    .xfer-facts span { font-size: 12px; color: var(--wa-muted); }
    /* The whole dialog is the drop target, lit while a file is over it. */
    dialog.import-dialog.dropping { border-color: var(--wa-accent); box-shadow: 0 0 0 2px var(--wa-accent), 0 12px 40px rgba(0,0,0,.4); }
    .xfer-drop {
      position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-accent) 16%, transparent); font-size: 14px; font-weight: 600;
    }
    .xfer-drop span { padding: 8px 14px; border-radius: 8px; background: var(--wa-card); }
    .link-note { margin: 4px 12px 0; display: flex; align-items: center; gap: 10px; }
    .xfer-ent { padding: 10px 0; border-top: 1px solid var(--wa-line); }
    .xfer-ent:first-child { border-top: 0; padding-top: 2px; }
    .xfer-ent .hint { margin: 4px 0 0; }
    .xfer-foot { display: flex; align-items: center; gap: 8px; padding: 14px 18px 16px; border-top: 1px solid var(--wa-line); flex: none; }
    .xfer-foot .spacer { flex: 1; }
    .xfer-foot .note { font-size: 12px; color: var(--wa-muted); }

    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr) 8px var(--wa-right, 360px);
      column-gap: 8px;
      row-gap: 8px;
      padding: 4px 12px 10px;
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
    .column.inspector { --wa-fade: var(--wa-card); --wa-fade-gap: 0px; }
    .layers { --wa-fade: var(--wa-card); --wa-fade-gap: 2px; }
    .column.canvas { --wa-fade: var(--wa-bg); --wa-fade-gap: 8px; }
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
    /* The left column does not scroll: the Add card keeps its natural height
       and the Layers card takes the rest, scrolling its own rows. The shape
       row follows the last layer, and stays in sight once the rows scroll. */
    .column.left { display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    .column.left .card { flex: none; }
    .column.left .card.layers-card {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 10px 8px 8px;
      --thumb-w: ${nd}px; --thumb-h: ${id}px;
      container: layers / inline-size;
    }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       colour. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 10px; min-height: 30px;
      font-size: 13.5px; font-weight: 700; letter-spacing: 0; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 500; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 600; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-raised); }
    details.foot > summary { display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 0 24px; font-size: 12.5px; cursor: pointer; list-style: none; color: var(--wa-muted); }
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
    .add-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    /* Compact: the samples go and every button becomes one 34px line, a colour
       chip and a name, so eight kinds take four short rows. */
    .add-grid.lean button.add {
      flex-direction: row; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border-radius: 8px;
      background: var(--wa-card); border-color: var(--wa-line);
    }
    .add-grid.lean button.add .add-name { justify-content: flex-start; gap: 8px; }
    /* The colour chip: the same square that marks the kind in the Layers rows
       and the inspector, at the size a button can spare. */
    button.add .k { width: 8px; height: 8px; border-radius: 2px; background: var(--k); flex: none; }
    button.add {
      display: flex; flex-direction: column; align-items: stretch; gap: 7px; padding: 7px 7px 8px; border-radius: 10px;
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 10%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 28%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out, box-shadow .12s ease-out;
    }
    button.add:hover:not(:disabled) {
      background: color-mix(in srgb, var(--k) 18%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 55%, transparent);
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
    /* The presets are one wrapped row under the kinds, opened by a label
       rather than a sentence: they are a shortcut, not a second offer. */
    .presets { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; }
    .presets-l {
      margin-right: 4px; font-size: 11px; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; color: var(--wa-muted);
    }
    button.preset {
      font: inherit; font-size: 12px; font-weight: 600; height: 26px; padding: 0 10px; border-radius: 999px; cursor: pointer;
      border: 0; background: var(--wa-panel); color: color-mix(in srgb, var(--wa-ink) 78%, var(--wa-muted));
      transition: color .12s ease-out, background-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-ink) 10%, var(--wa-panel)); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 2px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* A row is a line of a list, not a card: no outline at rest, and the eye
       finds the selection by its wash rather than by counting borders. */
    .layer {
      display: grid; grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 46px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background: transparent; background-clip: padding-box;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, box-shadow .12s ease-out,
        border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members keep a faint ground of their own, so they read as
       nested rather than as another run of top-level rows. */
    .layer.kid { background: color-mix(in srgb, var(--wa-panel) 55%, transparent); }
    .layer:hover { background: var(--wa-panel); }
    /* The selected row: one cool wash and a ring, the same one wherever a row
       is selected, so eight kind colours never fight the selection. */
    .layer.hl { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 1px var(--wa-sel-ring); }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's colour, without
       the selected row's ring, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, ${Fe(te.group)} 12%, var(--wa-panel)); }
    .layer .grip { color: var(--wa-line-strong); display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { color: var(--wa-muted); }
    .layer .grip svg { width: 15px; height: 15px; }
    .layer .bar { width: 3px; height: 26px; border-radius: 2px; background: var(--k); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 4px; overflow: hidden; flex: none;
      background: #000; border: 0; box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 11.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--wa-muted); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge {
      display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 4px;
      font-size: 10.5px; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted);
    }
    .badge.tap { color: #c2185b; background: rgba(236,64,122,.14); }
    .badge.states { color: #8a5a00; background: rgba(249,168,37,.18); }
    :host([dark]) .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 22%, transparent); }
    :host([dark]) .badge.states { color: var(--wa-states); background: color-mix(in srgb, var(--wa-states) 22%, transparent); }
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
      height: 0; min-height: 0; margin-top: -1px; margin-bottom: -1px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    /* The shape row closes the list, under a hairline that runs the full
       width of the card: it is the ground everything else is drawn on, not
       another layer in the stack, so nothing can be dropped below it. */
    .layer.pinned {
      flex: none; margin: 0 -8px; padding: 0 14px 0 12px; min-height: 40px; border-radius: 0;
      border-top: 1px solid var(--wa-line);
    }
    .layer.pinned .grip { cursor: default; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--wa-accent) 30%, transparent);
      background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer.group .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; flex: none;
    }
    .layer.group .chev:hover { background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    .layer.group .chev svg { width: 15px; height: 15px; transition: transform .15s ease-out; }
    .layer.group .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    /* A folder shows a folder where a layer shows its picture. */
    .layer.group .folder { display: grid; place-items: center; width: var(--thumb-w); color: var(--wa-muted); }
    .layer.group .folder svg { width: 17px; height: 17px; }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${Fe(te.locked)}; }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 12px; padding-left: 10px; display: flex; flex-direction: column; gap: 2px;
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
    .layer.drop-before { border-top: ${Bt}px solid transparent; }
    .layer.drop-after { border-bottom: ${Bt}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${Bt}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${Bt}px; }
    .layer.drop-after::after { bottom: -${Bt}px; }

    /* Expanded rows say more: a third line about what the layer is made of,
       its meta free to wrap, and the badges kept beside the buttons rather
       than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    /* An expanded row keeps both the badges and the buttons, so the buttons
       cannot appear out of nothing the way they do on a compact row: arriving
       would widen the right end, squeeze the facts, wrap them onto another
       line and grow the row under the pointer. The buttons hold their place
       at all times and only turn visible, and the right end never wraps, so
       hovering changes colour and nothing else. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
    .layer.rich .acts { display: inline-flex; visibility: hidden; }
    .layer.rich:hover .acts, .layer.rich.hl .acts, .layer.rich:focus-within .acts { visibility: visible; }
    .layer.rich:hover .badges, .layer.rich.hl .badges, .layer.rich:focus-within .badges { display: inline-flex; }
    ${Fe(Aw())}

    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg {
      display: inline-flex; flex: none; height: 24px; padding: 2px; gap: 2px; border: 0;
      border-radius: 7px; background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 0 6px; min-width: 22px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out, box-shadow .12s ease-out;
    }
    .seg button:hover { color: var(--wa-ink); }
    .seg button.on { color: var(--wa-ink); background: var(--wa-card); box-shadow: 0 1px 2px rgba(0,0,0,.08); }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 13px; height: 13px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line, and the tint takes the section's colour where there is one. */
    .seg.wide { display: flex; width: 100%; min-width: 0; height: 24px; border-radius: 6px; background: var(--wa-field); box-shadow: none; }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 0 4px; border-radius: 4px;
      font-size: 11.5px; font-weight: 500; letter-spacing: 0; line-height: 20px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
    }
    .seg.wide button.on { color: var(--wa-ink); background: var(--wa-seg-on); box-shadow: 0 1px 1.5px rgba(0,0,0,.22); }
    /* The choice a setting falls back to while it has none of its own. */
    .seg.wide button.inh { color: var(--wa-ink); outline: 1px dashed var(--wa-muted); outline-offset: -3px; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 60%, transparent); }
    .seg.wide button:disabled, .seg.wide button:disabled:hover { color: var(--wa-muted); opacity: .38; cursor: not-allowed; }
    .field.seg-field { align-items: center; }
    /* Readings: which of two ways to count, then how many when it is a count. */
    .readings-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .readings-row .seg.wide { flex: 1 1 auto; width: auto; }
    /* Three digits is the most this box ever holds. The type selector is
       there to outrank the ".field input[type=number]" full-width rule. */
    .field .readings-row input.short[type=number] { width: 46px; flex: none; text-align: right; }
    /* The count used to sit against the buttons as a bare number, which reads
       as a setting nobody named. Two quiet words either side make the row a
       sentence, "Average into 24 slots", and the number stops being a riddle. */
    .readings-row .readings-into, .readings-row .readings-unit {
      font-size: 12px; color: var(--wa-muted); flex: none; white-space: nowrap;
    }
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
    /* The canvas column is three blocks stacked: what the whole complication
       is, the face itself, and the two lists of values under it. */
    .column.canvas { display: flex; flex-direction: column; gap: 8px; }
    /* The bar and the two lists keep their own height; the face takes what is
       left, so the lists under it are on screen without scrolling. */
    .column.canvas > .card.canvas-card {
      padding: 0; overflow: hidden; flex: 1 1 auto; min-height: 260px;
      display: flex; flex-direction: column;
    }
    .banner { padding: 10px 14px; border-radius: 8px; font-size: 13px; background: var(--wa-panel); flex: none; }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }

    /* The watch gate: the one screen a too-old watch gets instead of the
       editor. Centred like a welcome page, with the accent reserved for the
       glyph and the step numbers, so it reads as a considered pause rather
       than an error strip. */
    .gate {
      flex: 1 1 auto; min-height: 0; overflow: auto;
      display: flex; align-items: flex-start; justify-content: center;
      padding: clamp(24px, 8vh, 72px) 24px 40px;
    }
    .gate-card {
      width: min(600px, 100%);
      background: var(--wa-card);
      border-radius: var(--wa-r-lg);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 36px 40px 32px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 0;
      position: relative; overflow: hidden;
    }
    .gate-glyph {
      position: relative; width: 52px; height: 52px; border-radius: 16px;
      display: grid; place-items: center; color: var(--wa-accent);
      background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 30%, transparent);
      margin-bottom: 22px;
    }
    .gate-glyph svg { width: 28px; height: 28px; }
    .gate-eyebrow {
      position: relative; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
      color: var(--wa-accent); margin-bottom: 10px;
    }
    .gate-title {
      position: relative; margin: 0 0 10px; font-size: 24px; line-height: 1.2; font-weight: 700;
      letter-spacing: -.015em; color: var(--wa-ink); text-wrap: balance;
    }
    .gate-lead { position: relative; margin: 0 0 26px; font-size: 14.5px; line-height: 1.55; color: var(--wa-muted); max-width: 52ch; }
    .gate-steps { position: relative; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; width: 100%; }
    .gate-steps li {
      display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: start;
      padding: 14px 0; border-top: 1px solid var(--wa-line);
    }
    .gate-steps li:last-child { border-bottom: 1px solid var(--wa-line); }
    .gate-n {
      width: 30px; height: 30px; border-radius: 999px; display: grid; place-items: center;
      font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums;
      color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 28%, transparent);
    }
    .gate-steps b { display: block; font-size: 14.5px; font-weight: 650; color: var(--wa-ink); margin: 5px 0 3px; }
    .gate-steps span:not(.gate-n) { display: block; font-size: 13.5px; line-height: 1.5; color: var(--wa-muted); }
    .gate-foot { position: relative; margin-top: 18px; font-size: 13px; color: var(--wa-muted); }
    @media (max-width: 640px) {
      .gate { padding: 16px 12px 28px; }
      .gate-card { padding: 26px 22px 24px; }
      .gate-title { font-size: 21px; }
    }
    /* Two rows with a hairline between them: which shape is being edited on
       top, how the face is looked at underneath. The tool row sits a shade
       darker so the stage below reads as a third, separate surface. */
    .canvas-bar {
      display: flex; flex-direction: column; font-size: 13px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
    }
    .bar-row { display: flex; align-items: center; gap: 6px; padding: 6px 10px; flex-wrap: wrap; }
    .bar-row.tools {
      border-top: 1px solid var(--wa-line);
      background: color-mix(in srgb, var(--wa-raised) 55%, var(--wa-input));
    }
    .bar-sep { width: 1px; height: 18px; background: var(--wa-line-strong); margin: 0 2px; flex: none; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    /* The shapes the complication has, as one segmented control. */
    .shape-seg {
      display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 2px; border-radius: 10px;
      background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .shape-seg button.tab { height: 30px; padding: 0 10px; border-radius: 8px; }
    .shape-adds { display: inline-flex; flex-wrap: wrap; gap: 4px; }
    .shape-adds button.tab { height: 28px; padding: 0 9px; gap: 5px; font-weight: 500; }
    .shape-adds button.tab svg { width: 12px; height: 12px; }
    .canvas-bar .hint { margin: 0; }
    /* Shape tabs: one per family, drawn with a real picture of what that shape
       holds. A family the complication does not have is a dashed invitation. */
    .tab-wrap { position: relative; display: inline-flex; align-items: center; }
    button.tab {
      display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border-radius: 9px;
      font: inherit; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 1px solid transparent; white-space: nowrap;
      transition: background-color .12s ease-out, color .12s ease-out, box-shadow .12s ease-out;
    }
    button.tab:hover:not(:disabled) { color: var(--wa-ink); }
    button.tab[aria-pressed="true"] { background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 0 0 1px var(--wa-line); }
    button.tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tab.off { border: 1px dashed var(--wa-line-strong); color: color-mix(in srgb, var(--wa-muted) 80%, var(--wa-card)); }
    button.tab small { font-weight: 500; opacity: .75; }
    .tab .art { display: grid; place-items: center; flex: none; height: 16px; }
    .tab .art svg { display: block; max-height: 16px; max-width: 34px; width: auto; height: auto; background: #000; border-radius: 3px; }
    .tab.circular .art svg { border-radius: 50%; }
    .tab.corner .art svg { background: #2c2c2e; }
    .tab .art .inline-line { font-size: 8px; padding: 2px 5px; min-width: 0; display: inline-flex; align-items: center; gap: 3px; border-radius: 999px; background: #000; color: #fff; }
    .tab .art .inline-line svg { background: transparent; border-radius: 0; }
    /* The remove button rides beside its tab and only while the pointer is on it. */
    .tab-wrap .tab-x { opacity: 0; pointer-events: none; margin-left: -4px; }
    .tab-wrap:hover .tab-x, .tab-wrap .tab-x:focus-visible { opacity: .7; pointer-events: auto; }
    .tab-wrap .tab-x:hover:not(:disabled) { opacity: 1; }
    .tab-wrap .tab-x:disabled { opacity: .2; }
    /* A control drawn as a box with a muted word inside it, so "Preview as" is
       part of the field rather than a label floating beside it. */
    .inbox {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 4px 0 10px; border-radius: 7px;
      border: 1px solid var(--wa-line); background: var(--wa-input); flex: none;
    }
    .inbox .pre { color: var(--wa-muted); font-weight: 600; font-size: 12.5px; white-space: nowrap; }
    .inbox select { height: 26px; border: 0; background-color: transparent; padding-left: 0; }
    .inbox select:focus-visible { box-shadow: none; }
    /* The three face toggles wrap as one block, so a narrow bar never leaves
       one of them stranded on the line above the other two. */
    .canvas-bar .face-tools { display: inline-flex; gap: 6px; flex: none; }
    /* With snapping on, the button and its size read as one accent pill. */
    .grid-tool { display: inline-flex; align-items: center; position: relative; }
    .grid-tool.on button.pick { border-radius: 8px 0 0 8px; padding-right: 8px; }
    button.grid-step, button.grid-lines {
      height: 30px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-accent-ink) 30%, transparent);
      background-color: color-mix(in srgb, var(--wa-accent) 82%, #000); color: var(--wa-accent-ink);
    }
    button.grid-step { padding: 0 6px 0 8px; border-radius: 0; display: inline-flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
    button.grid-step svg { width: 12px; height: 12px; opacity: .8; }
    button.grid-lines { width: 30px; padding: 0; display: inline-grid; place-items: center; border-radius: 0 8px 8px 0; }
    button.grid-lines[aria-pressed="false"] { color: color-mix(in srgb, var(--wa-accent-ink) 60%, transparent); }
    button.grid-lines svg { width: 15px; height: 15px; }
    button.grid-step:focus-visible, button.grid-lines:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The preview bar's own menus (grid size, Preview as), in place of native
       selects, whose closing menu made Chrome on macOS hold the next click. */
    .pop-menu {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 84px;
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
    .case-tool { position: relative; display: inline-flex; }
    .case-tool .pop-menu { left: -6px; right: auto; min-width: 150px; }
    button.case-pick {
      display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 6px 0 0; border: 0; border-radius: 6px;
      background: transparent; color: var(--wa-ink); font: inherit; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    button.case-pick svg { width: 14px; height: 14px; opacity: .7; }
    /* The Colour menu: a round swatch per tint, and a split one for full colour.
       While a tint is on the box takes an accent edge, so a tinted preview is
       never mistaken for the real colours. */
    .tint-box.on { border-color: var(--wa-accent); box-shadow: 0 0 0 1px var(--wa-accent); }
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128,128,128,.5);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
    button.case-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    .canvas-bar label select { color: var(--wa-ink); font-weight: 500; }
    button.pick {
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 10px; height: 30px; border-radius: 8px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.pick:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
    button.pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pick.on { background: var(--wa-accent); color: var(--wa-accent-ink); }
    button.pick.only-icon { width: 30px; padding: 0; justify-content: center; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    /* The stage: a faint dot grid under a soft accent glow, so the watch face
       sits on a work surface rather than on the card. */
    .stage {
      display: grid; justify-items: center; align-content: center; gap: 20px; padding: 20px; flex: 1 1 auto; min-height: 0; overflow: auto;
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
    /* Resize handles sit just outside a layer's corners, so on a layer at the
       slot edge they reach past the face. */
    .preview > svg.complication { overflow: visible; }
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
    /* The line under the face: which shape, how big, and what a drag does. The
       size is set in mono, because it is a measurement rather than prose. */
    .under {
      display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;
      text-align: center; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    }
    .under b { color: var(--wa-ink); font-weight: 700; }
    .under .size { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .under .dot { color: var(--wa-line-strong); }
    .under .tail b { font-weight: 700; }
    /* The two lists under the face: what the complication defines for itself,
       and what the house is telling it right now. Stacked, so each title and
       each value line gets the whole width instead of wrapping into a column
       half as wide. */
    .under-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; flex: none; }
    .card.tint-values {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Fe(te.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Fe(te.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Fe(te.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Fe(te.states)} 35%, var(--wa-card));
    }
    .card.tint-values .panel-title, .card.tint-states .panel-title { margin-bottom: 6px; }
    /* One value, one 30px white line: name, then what it reads. */
    .vrow {
      display: flex; align-items: center; gap: 8px; width: 100%; min-height: 30px; padding: 0 8px;
      border-radius: 7px; background: var(--wa-card); font-size: 13px; text-align: left;
    }
    .vrow .spacer { flex: 1; min-width: 0; }
    .vrow .nm { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vrow .kbar { width: 3px; height: 14px; border-radius: 2px; background: var(--k); flex: none; }
    /* A card title opens with a tinted mark, the same one the inspector's
       cards wear, so every column speaks the same language. */
    .panel-title .swatch {
      width: 22px; height: 22px; border-radius: 6px; flex: none; display: grid; place-items: center;
      background: var(--c, var(--wa-accent)); border: 0; color: #fff;
    }
    .panel-title .swatch svg { width: 13px; height: 13px; stroke-width: 2.4; }
    /* The complication card's Flash row: the switch, then the colour it
       flashes, or the word Off. */
    .flash-row { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 26px; }
    .flash-row input.flash-color { width: 34px; height: 22px; padding: 1px 2px; border-radius: 5px; }
    .flash-row .muted { color: var(--wa-muted); font-size: 12px; }
    /* Shared values: a row per named value. The whole row opens its editor
       in place, under the row, so it carries the hover and open states a
       button would, and the delete button stays out of the way until the
       pointer is on it. */
    .values-list .data { display: flex; flex-direction: column; gap: 6px; }
    /* A row and its open editor, grouped only so a click can tell whether it
       landed on the open value; the list lays them out as before. */
    .values-list .vitem { display: contents; }
    /* Marks a shared value's row under the preview, so it is not read as
       an entity. */
    .vchip .vtag {
      flex: none; padding: 0 5px; border-radius: 4px; font-size: 10.5px; font-weight: 600; line-height: 16px;
      color: var(--wa-muted); background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
    }
    .values-list .value-open {
      display: flex; flex-direction: column; gap: 4px; margin-top: -2px; padding: 6px 8px 8px;
      border-radius: 7px; background: color-mix(in srgb, var(--c) 5%, var(--wa-card));
    }
    .values-list .value-open .value-editor { display: flex; flex-direction: column; gap: 4px; }
    .values-list.empty-list .panel-title { margin-bottom: 0; }
    /* The card's "?" always shows: unlike an inspector card, this one has
       no header to hover first. */
    .values-list .panel-title button.sec-help { opacity: 1; }
    .values-list .shared-help {
      margin: 0 0 8px; padding: 8px 10px; border-radius: 7px; background: var(--wa-card);
      font-size: 12.5px; line-height: 1.45; color: var(--wa-ink);
    }
    .values-list .shared-help p { margin: 0 0 6px; }
    .values-list .shared-help ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 3px; }
    /* Now: the printed value as a token, spaces kept, so a prefix of "xx "
       shows its space; or the missing step in muted words. */
    .field.now-field .now-v { color: var(--wa-ink); }
    .now-v .now-tok {
      display: inline-block; max-width: 100%; padding: 1px 6px; border-radius: 5px; white-space: pre-wrap; overflow-wrap: anywhere;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 600;
      color: var(--wa-val); background: color-mix(in srgb, var(--wa-val) 12%, transparent);
    }
    .now-v.none { font-style: italic; }
    details.sub.format summary .sum-note { margin-left: 6px; color: var(--wa-muted); font-weight: 400; }
    /* Under Layers, the list takes at most part of the column and scrolls, so
       an open value never pushes the layer rows out of sight. */
    .column.left .card.values-list { max-height: 45%; overflow-y: auto; scrollbar-width: thin; }
    .layout.cols-1 .column.left .card.values-list { max-height: none; overflow: visible; }
    .values-list .datum {
      padding: 0 8px; border-radius: 7px; gap: 8px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum + .datum { box-shadow: none; }
    .values-list .datum:hover { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* Selected: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { box-shadow: inset 0 0 0 1px var(--c); background: color-mix(in srgb, var(--c) 10%, var(--wa-card)); }
    .values-list .datum .meta {
      flex: none; min-width: 0; max-width: 140px; opacity: 1; color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      overflow: hidden; text-overflow: ellipsis; white-space: pre;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; color: var(--wa-muted); }
    .values-list .datum button.icon { opacity: 0; pointer-events: none; flex: none; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chips .muted { color: var(--wa-muted); font-size: 12px; }
    /* Every entity the face reads, one white line each. The whole line is the
       button, so clicking anywhere on it opens the test value. */
    .chips.values { display: flex; flex-direction: column; flex-wrap: nowrap; align-items: stretch; gap: 6px; }
    .vchip { border: 0; cursor: pointer; color: inherit; transition: box-shadow .12s ease-out; }
    .vchip:hover { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    .vchip b { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vchip .val {
      flex: none; color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
    }
    .vchip.testing { box-shadow: inset 0 0 0 1px var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .vchip input[type=text] { width: 110px; min-height: 24px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    /* A test value's control sits at the end of its row: a slider and its
       reading for a number, a picker for known states, the reading alone for
       text. The row is no longer a button, so it drops the pointer. */
    .vchip.ctl { cursor: default; }
    .vchip .test-ctl { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex: 0 1 50%; min-width: 0; }
    .vchip .test-ctl input[type=range] { flex: 1 1 auto; min-width: 60px; height: 16px; margin: 0; accent-color: var(--wa-states); cursor: pointer; }
    .vchip .test-ctl select { min-width: 0; max-width: 100%; font: inherit; font-size: 12px; min-height: 24px; padding: 2px 6px; border-radius: 6px; cursor: pointer; }
    .vchip button.val { background: none; border: 0; padding: 0; cursor: text; min-width: 56px; text-align: right; }
    .vchip button.live-reset { flex: none; }
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

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 10px 12px 12px; container: insp / inline-size; }
    /* The head grows when a long layer name wraps its crumbs onto a second
       line, rather than spilling over the first card. */
    .insp-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; min-height: 34px; padding: 0; position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    /* The crumbs keep at least 180px; with less beside it, the One at a time
       button drops under them rather than squeezing every crumb onto its
       own line. */
    .crumbs { flex: 1 1 180px; min-width: 0; display: flex; align-items: center; gap: 2px 6px; flex-wrap: wrap; padding: 4px 0; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 12.5px; font-weight: 600; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .insp-head .expand { margin-left: auto; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500; min-width: 0; max-width: 100%;
    }
    .here .nm { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .here .kchip { flex: none; }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand {
      flex: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 9px; min-height: 26px; border-radius: 8px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 24px; }
    /* With no layer selected the inspector is the complication: its name, then
       its four actions, which wrap under the name when the column is narrow. */
    .insp-head.comp-head { height: auto; min-height: 34px; flex-wrap: wrap; row-gap: 0; }
    .comp-head .crumbs { flex: 1 1 100px; }
    .comp-acts { display: flex; align-items: center; gap: 0; margin-left: auto; flex: none; }
    .comp-acts button.ghost { font-size: 12px; padding: 0 6px; min-height: 24px; border-radius: 6px; }
    .insp-note { margin: 12px 0 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    /* One tinted box per subject, in the section's colour, so each card reads
       as its own thing: a 36px header with a small mark, then a body of
       label-left rows. The header's hover runs to the box's edges while the
       rows keep the box's padding. */
    .sec {
      --c: var(--wa-accent);
      margin: 6px 0 0; padding: 0 12px; border-radius: 9px; overflow: hidden;
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 24%, var(--wa-card));
    }
    .sec[data-open="true"] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 40%, var(--wa-card)); }
    .sec-h {
      display: flex; align-items: center; gap: 8px; height: 36px; margin: 0 -12px; padding: 0 6px 0 12px;
      cursor: pointer; user-select: none; transition: background-color .12s ease-out;
    }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h.pinned { cursor: default; }
    .sec-h.pinned:hover { background: transparent; }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    .sec-h .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c) 22%, transparent); color: var(--c);
    }
    .sec-h .swatch svg { width: 11px; height: 11px; stroke-width: 2.2; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    .sec-h h4 { margin: 0; flex: none; font-size: 12.5px; font-weight: 650; letter-spacing: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .sec-h .sum { margin-left: auto; min-width: 0; color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
    .fgroup > .hint { margin: 2px 0 6px; }
    .fgroup > .hint:last-child { margin-bottom: 4px; }
    .fgroup button.reset-dot { left: -6px; }
    .sec-b > :is(.adders, .chart-numbers, .states-switch, details.sub) { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width. */
    :is(.sec-b, .sec-b :is(.fgroup, .grid2, .grid4, .value-editor, .states, .rich-parts, .part-editor, .rule-box, .case-box, .test-box, .change-box))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .states-switch, .span-parts, button.small, button.link, select.adder, details.sub):not(.value-pop *) {
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
    /* The reset dot. One control, two places: in the gutter left of a changed
       setting's title, and beside a card's title for everything the card owns.
       It is drawn only while something is away from its default, so the dots
       are the list of what someone changed. The pseudo-element widens the hit
       area without widening the dot. */
    button.reset-dot {
      position: absolute; left: -9px; top: 12px; width: 6px; height: 6px; margin: 0; padding: 0;
      border: 0; border-radius: 50%; background: var(--wa-accent); cursor: pointer; flex: none;
    }
    button.reset-dot::after { content: ""; position: absolute; inset: -7px; }
    button.reset-dot:hover, button.reset-dot:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 32%, transparent); }
    .sec-h h4 button.reset-dot { position: relative; left: auto; top: auto; }
    /* A layer's name: one header row with the input in place of the summary.
       The title never wraps and the input takes what width is left, down to
       nothing, so the row stays one line in the narrowest column. */
    .name-sec .sec-h { gap: 8px; }
    .name-sec .sec-h input[type=text] {
      flex: 1 1 auto; width: 0; min-width: 0; height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px;
      border-radius: 6px; border-color: transparent; background-color: var(--wa-field);
    }
    .name-sec .sec-h input[type=text]:focus-visible { border-color: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 28%, transparent); }
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
    button.sec-help.on { color: var(--wa-accent-ink); background: var(--wa-accent); border-color: transparent; }
    @media (hover: none) { button.sec-help { opacity: 1; } }
    /* Help text waits behind that "?". A plain hint shows only while its
       card's help is on; a warning, an error, or a hint marked keep (a status,
       an empty state, a step that is required) always shows. A value popover
       keeps its hints, since it has no "?" of its own to ask with. */
    .sec[data-help="off"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { display: none; }
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 6px 9px; border-radius: 7px; background: var(--wa-field); color: var(--wa-ink);
    }
    /* An open card with no help text in it has nothing for its "?" to show. */
    .sec[data-open="true"][data-help="off"]:not(:has(> .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint))) button.sec-help { display: none; }
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
    /* The Extras preview: the button last pointed at, drawn on a sample chart.
       A fixed height, so the buttons under it never move as the text changes. */
    .xprev {
      display: grid; grid-template-columns: minmax(96px, 150px) minmax(0, 1fr) auto; gap: 10px; align-items: start;
      margin: 6px 0 4px; padding: 8px; border-radius: 9px; background: var(--wa-field); min-height: 74px; box-sizing: border-box;
    }
    .xprev .well {
      --k: var(--primary-color, #7c6cf0);
      display: block; aspect-ratio: 120 / 46; border-radius: 7px; overflow: hidden; background: #000;
      border: 1px solid var(--wa-line-strong); box-sizing: border-box;
    }
    .xprev svg.shot { display: block; width: 100%; height: 100%; }
    .xprev-t { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--wa-muted); min-width: 0; }
    .xprev-t b { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
    .xprev-t .xprev-why { color: var(--warning-color, #e0a100); }
    .xprev button.xprev-hide { width: 24px; height: 24px; border-radius: 6px; }
    .xprev button.xprev-hide svg { width: 15px; height: 15px; }
    button.link.xprev-show { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; }
    button.link.xprev-show svg { width: 14px; height: 14px; }
    /* One row per number: the whole label opens that text layer, and the ×
       at the end deletes it. Two buttons, because one cannot sit inside the
       other. */
    .chart-numbers { display: flex; flex-direction: column; gap: 4px; }
    .chart-numbers .num-row { display: flex; align-items: flex-start; gap: 4px; }
    .chart-numbers .num-row > button.icon { flex: none; margin-top: 8px; }
    /* A row opens in place: the header stays the same button-like strip, and the
       body holds that layer's main settings under it, inside the same border. */
    .chart-numbers details.num-item { flex: 1; min-width: 0; border-radius: 8px; border: 1px solid var(--wa-line-strong); background: var(--wa-panel); }
    .chart-numbers details.num-item:hover { border-color: color-mix(in srgb, var(--primary-color, #7c6cf0) 60%, transparent); }
    .chart-numbers details.num-item > summary { list-style: none; }
    .chart-numbers details.num-item > summary::-webkit-details-marker { display: none; }
    .chart-numbers details.num-item .chev { margin-left: auto; flex: none; color: var(--wa-muted); opacity: .6; transition: transform .15s ease-out; }
    .chart-numbers details.num-item .chev svg { width: 14px; height: 14px; display: block; }
    .chart-numbers details.num-item[open] .chev { transform: rotate(180deg); }
    .chart-numbers .num-body { padding: 4px 8px 8px; border-top: 1px solid var(--wa-line-strong); }
    .chart-numbers .num-body > .chips { margin-left: var(--wa-col); margin-top: 6px; }
    .shown-head { display: flex; align-items: center; gap: 6px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--wa-line-strong); font-size: 12px; font-weight: 600; }
    .shown-count { font-size: 11px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel); border-radius: 999px; padding: 0 7px; line-height: 18px; }
    .chart-numbers .num-pick { display: flex; align-items: center; gap: 10px; text-align: left;
      padding: 6px 8px; color: inherit; font: inherit; cursor: pointer; }
    .num-lead { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 26px; padding: 0 6px;
      border-radius: 6px; background: color-mix(in srgb, currentColor 8%, transparent); font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; }
    .num-lead svg { width: 15px; height: 15px; }
    .num-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
    .num-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .num-kind { font-size: 11px; color: var(--wa-muted); }
    /* A chart's Readings list: one line per reading, its value now, and a
       Number and a Marker switch where the reading has one. The cells sit in
       one grid so every switch lines up down its column. */
    .field.list-field > .xreadings { margin: 0; }
    /* The On the plot and Readings tables share fixed columns, so their name,
       value and switch columns line up across both tables, not just inside one. */
    .field.list-field:has(> .xreadings) + .field.list-field:has(> .xreadings),
    .hint + .field.list-field:has(> .xreadings) { margin-top: 10px; }
    .xreadings { display: grid; grid-template-columns: minmax(0, 1fr) 52px 64px 64px; min-width: 0; }
    .xr-row { display: contents; }
    .xr-row > span { display: flex; align-items: center; min-width: 0; min-height: 28px; border-top: 1px solid var(--wa-line); }
    .xr-row > span:first-child { padding-left: 6px; }
    .xr-row > span:nth-child(n+3) { justify-content: center; }
    .xr-row > span:nth-child(2) { justify-content: flex-end; padding-right: 4px; }
    .xr-row:not(.xr-head):hover > span { background: var(--wa-field); }
    .xr-row:not(.xr-head):hover > span:first-child { border-radius: 6px 0 0 6px; }
    .xr-row:not(.xr-head):hover > span:last-child { border-radius: 0 6px 6px 0; }
    .xr-head > span {
      min-height: 20px; border-top: 0; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted);
    }
    .xr-name { display: block; min-width: 0; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .xr-head .xr-name { font-size: 10.5px; }
    .xr-v { display: block; max-width: 52px; font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    button.xtog {
      display: inline-grid; place-items: center; width: 48px; height: 22px; padding: 0; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 700; line-height: 1;
      border: 1px dashed var(--wa-line-strong); background: transparent; color: var(--wa-muted);
    }
    button.xtog svg { width: 12px; height: 12px; display: block; }
    button.xtog:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.xtog:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.xtog.on { border: 1px solid transparent; background: var(--primary-color, #7c6cf0); color: #fff; }
    button.xtog:disabled { opacity: .35; cursor: not-allowed; }
    button.xtog:disabled:hover { color: var(--wa-muted); border-color: var(--wa-line-strong); }    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
    /* The dialog's one question keeps its title above the search box. */
    dialog.preset-dialog .field.entity-field { display: flex; flex-direction: column; align-items: stretch; gap: 4px; margin: 8px 0; }
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
    .help-head { display: flex; align-items: center; gap: 12px; padding: 14px 18px 4px; }
    .help-head a { font-size: 13px; color: var(--wa-accent); }
    .help-tabs { display: flex; gap: 4px; padding: 0 18px; border-bottom: 1px solid var(--wa-line); }
    .help-tabs button {
      font: inherit; font-size: 13px; font-weight: 500; padding: 8px 10px; margin-bottom: -1px; cursor: pointer;
      border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--wa-muted);
    }
    .help-tabs button:hover { color: var(--wa-ink); }
    .help-tabs button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .help-tabs button[aria-selected="true"] { color: var(--wa-ink); border-bottom-color: var(--wa-accent); }
    /* Words rather than keys in the first column wrap, so a long name does
       not squeeze its explanation into a sliver. */
    .help-body table.terms th { white-space: normal; width: 30%; }
    .help-body section + section h3 { margin-top: 0; }
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
    .send { font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .send.sent { color: var(--wa-ent); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    .send.unsupported { color: var(--warning-color, #ffa600); }
    /* "last seen 2 h ago" beside a green tick. Muted, because the tick is
       still true: the change is on the watch, and this only says the watch
       stopped listening afterwards. */
    .send-note { font-size: 12px; color: var(--wa-muted); white-space: nowrap; flex: none; }
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
    /* Inside a row of adders the top margin would push it off the buttons'
       baseline; the row already spaces itself. */
    .adders select.adder { margin-top: 0; }

    /* Form rows, the way a property sheet reads: the title in a fixed column
       on the left, the control on the right, one row per setting and every
       row at least 30px, so a card reads as an even list rather than a form.
       Contexts that lay fields out another way (the dialogs, the bars under
       the preview) set their own display over this. */
    .field {
      position: relative; display: grid; grid-template-columns: var(--wa-lab) minmax(0, 1fr); align-items: center;
      gap: 4px 8px; min-height: 30px; margin: 0; font-size: 12px;
    }
    .field > span { color: var(--wa-muted); font-size: 12px; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
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
      height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px; border-radius: 6px;
      border-color: transparent; background-color: var(--wa-field);
    }
    :is(.sec-b, .value-pop) .field select { padding-right: 22px; background-position: right 6px center; background-size: 12px; }
    :is(.sec-b, .value-pop) .field textarea { font-size: 12px; padding: 5px 8px; border-radius: 6px; border-color: transparent; background: var(--wa-field); }
    :is(.sec-b, .value-pop) .field input[type=number] { -moz-appearance: textfield; appearance: textfield; }
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-inner-spin-button,
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    :is(.sec-b, .value-pop) .field .ent-box input { padding-left: 28px; padding-right: 26px; }
    /* Inside a tinted section the focus ring takes the section's colour. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
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
    .field.slider input[type=range] { flex: 1; min-width: 50px; height: 16px; margin: 0; }
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
    .field.entity-field > .entity-results { grid-column: 1 / -1; }
    .field.value-chip-field > button.value-chip:first-child { grid-column: 1 / -1; }
    /* A colour is one box: swatch, hex, and opacity in percent. */
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-box {
      flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 0 0 5px;
      border-radius: 6px; border: 1px solid transparent; background: var(--wa-field);
    }
    .color-box:hover { border-color: var(--wa-line-strong); }
    .color-box:focus-within { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .color-box:has(input:disabled) { opacity: .5; }
    .color-swatch {
      position: relative; flex: none; width: 16px; height: 16px; border-radius: 4px; overflow: hidden; cursor: pointer;
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
    /* A colour table: a thin bar of the bands to scale with a mark at the
       current value, then one compact row per band, lowest first. It sits in
       the control column, under the Colour row it belongs to. It is its own
       size container so a narrow inspector can drop the opacity box, which
       the eight-digit hex still carries. */
    .bands { display: grid; gap: 3px; margin: 2px 0 6px var(--wa-col); container-type: inline-size; }
    @container (max-width: 240px) {
      .band-row .color-box .alpha { display: none; }
      .band-row .color-box { padding-right: 6px; }
    }
    /* The bar is pieces with a hairline gap between them, so two close colours
       still read as two bands; each piece is at least a tenth of the bar (see
       bandLayout). With a bar border on, a piece shows its fill inside its
       border colour. Band ends are labelled under the bar. */
    .band-bar { position: relative; margin: 8px 0 4px; }
    .band-bar .bb { display: flex; gap: 2px; height: 14px; }
    .band-bar .bb i {
      display: block; flex: 0 1 0; min-width: 4px; height: 100%; border-radius: 3px;
      background: var(--f); box-shadow: inset 0 0 0 1px rgba(128,128,128,.3);
    }
    .band-bar .bb i:first-child { border-radius: 7px 3px 3px 7px; }
    .band-bar .bb i:last-child { border-radius: 3px 7px 7px 3px; }
    .band-bar .bb i:only-child { border-radius: 7px; }
    .band-bar .bb i.bordered { box-shadow: inset 0 0 0 2px var(--b); }
    .band-bar .now {
      position: absolute; top: -4px; width: 3px; height: 22px; margin-left: -1.5px; border-radius: 2px;
      background: var(--wa-ink); box-shadow: 0 0 0 1.5px var(--wa-card);
    }
    /* The stretch a chart reads, as a bracket just over the bar. */
    .band-bar .span {
      position: absolute; top: -6px; height: 3px; min-width: 3px; margin-left: -1.5px; padding-right: 3px; border-radius: 2px;
      background: var(--wa-val); box-sizing: content-box;
    }
    .band-bar .ticks { position: relative; height: 13px; margin-top: 3px; }
    .band-bar .ticks span {
      position: absolute; top: 0; transform: translateX(-50%); white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 13px;
      color: var(--wa-muted); font-variant-numeric: tabular-nums;
    }    /* The first column is the band's range, three slots: a start box, "to" and
       an end box ("122 to 231"). The first row and the last put their words
       ("Less than", "Greater than") across the first two slots and their number
       in the end slot, so the words line up with the start boxes and every
       row's end box lines up. */
    .band-row { position: relative; display: grid; grid-template-columns: 164px minmax(0, 1fr) 22px; gap: 4px; align-items: center; min-height: 28px; }
    .band-row .range { display: grid; grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr); align-items: center; }
    .band-row .le { grid-column: 1 / 3; font-size: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
    .band-row .to { font-size: 12px; color: var(--wa-muted); text-align: center; }
    .band-row .range .else { grid-column: 1 / -1; }
    .band-row .else { font-size: 12px; color: var(--wa-muted); padding-left: 2px; }
    .band-row.hit .le, .band-row.hit .else { color: var(--wa-val); font-weight: 700; }
    .band-row input.band-up {
      width: 100%; min-width: 0; height: 26px; min-height: 26px; padding: 0 6px; border-radius: 6px;
      border: 1px solid transparent; background-color: var(--wa-field); box-shadow: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-variant-numeric: tabular-nums;
      -moz-appearance: textfield; appearance: textfield;
    }
    .band-row input.band-up:hover { border-color: var(--wa-line-strong); }
    .band-row input.band-up::-webkit-inner-spin-button,
    .band-row input.band-up::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .band-row input.band-up:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .band-row.hit input.band-up { color: var(--wa-val); }
    .band-row button.reset-dot { top: 50%; margin-top: -3px; }
    /* A bars chart with a border: a Fill and a Border colour box side by side
       on every row, under small column titles. A box whose colour is the
       band's own carries a reset dot at its corner. */
    .bands.split .band-row { grid-template-columns: 164px minmax(0, 1fr) minmax(0, 1fr) 22px; }
    .band-row.band-head { min-height: 0; margin-bottom: -2px; }
    .band-row.band-head span { font-size: 10px; line-height: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
    .band-cell { position: relative; display: flex; min-width: 0; }
    .band-cell .color-box { flex: 1; min-width: 0; }
    .band-row .band-cell button.reset-dot { left: auto; right: -2px; top: -2px; margin-top: 0; }
    @container (max-width: 470px) {
      .bands.split .band-row .color-box .alpha { display: none; }
      .bands.split .band-row .color-box { padding-right: 6px; }
    }
    /* Too narrow for a hex beside the numbers: a colour box keeps its swatch. */
    @container (max-width: 340px) {
      .band-row, .bands.split .band-row { grid-template-columns: 136px minmax(0, 1fr) 22px; }
      .bands.split .band-row { grid-template-columns: 136px minmax(28px, 1fr) minmax(28px, 1fr) 22px; }
      .band-row .range { grid-template-columns: minmax(0, 1fr) 18px minmax(0, 1fr); }
      .band-row .le { font-size: 11px; }
    }
    @container (max-width: 300px) {
      .band-row .color-box input.hex { display: none; }
    }
    .bands button.link.add-band { justify-self: start; margin-top: 2px; font-size: 12px; font-weight: 500; }
    /* The Position card's four numbers: a 2x2 grid of boxes, each with its
       letter inside at the front. The letter drags the number. */
    .xy { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4px 6px; min-width: 0; }
    label.pf {
      position: relative; display: flex; align-items: center; height: 26px; min-width: 0;
      border-radius: 6px; border: 1px solid transparent; background: var(--wa-field);
    }
    label.pf:hover { border-color: var(--wa-line-strong); }
    label.pf:focus-within { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    label.pf .pl {
      flex: none; width: 22px; align-self: stretch; display: grid; place-items: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; font-weight: 600; color: var(--wa-muted);
      cursor: ew-resize; user-select: none; -webkit-user-select: none; touch-action: none;
    }
    label.pf .pl:hover { color: var(--wa-accent); }
    /* Scoped under .xy so it outranks the inspector's own row input style,
       now that the boxes sit inside a .field row. */
    .xy label.pf input[type=number] {
      flex: 1; min-width: 0; height: 100%; min-height: 0; padding: 0 24px 0 0; margin: 0;
      border: 0; border-radius: 0; background: transparent; box-shadow: none; color: var(--wa-ink);
      font-size: 12px; font-variant-numeric: tabular-nums; -moz-appearance: textfield; appearance: textfield;
    }
    label.pf input[type=number]::-webkit-inner-spin-button,
    label.pf input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    label.pf input[type=number]:focus-visible { outline: none; box-shadow: none; border: 0; }
    label.pf .unit { position: absolute; right: 8px; font-size: 11px; color: var(--wa-muted); opacity: .8; pointer-events: none; }
    /* Pairs and quads stack: each field is its own label-left row. */
    .grid2, .grid4 { display: block; }
    /* Two short choices on one row, the second titled in line. */
    .pair-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .pair-row > .seg.wide:first-of-type { flex: 1 1 auto; width: auto; }
    .pair-row > .seg.wide:last-of-type { flex: 0 0 64px; width: 64px; }
    .pair-row > span { position: relative; flex: none; padding-left: 8px; color: var(--wa-muted); font-size: 12px; }
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
      .sec-b .seg.wide { height: auto; min-height: 24px; flex-wrap: wrap; }
      .sec-b .seg.wide button { flex: 1 0 auto; text-overflow: clip; }
      .sec-b .pair-row { flex-wrap: wrap; row-gap: 4px; }
      .sec-b .pair-row > .seg.wide:first-of-type { flex: 1 1 100%; }
    }
    .hint { font-size: 11.5px; line-height: 1.45; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the colour. */
    .hint.err { color: var(--error-color, #db4437); }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 6px; height: 24px; font-size: 12px; font-weight: 600; padding: 0 8px; border: 1px solid var(--wa-line); border-radius: 6px; }
    .chip.ent { border-color: transparent; background: var(--wa-ent-bg); color: var(--wa-ent); }
    .chip.val { border-color: transparent; background: var(--wa-val-bg); color: var(--wa-val); }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--wa-line); background: transparent; color: inherit; cursor: pointer; }
    .value-editor { margin: 0; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px 8px; }
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
    /* In an inspector row the chip is a control like the boxes above and
       below it: 26px, 12px text and the same soft fill. */
    .sec-b .field.value-chip-field:not(.compact) > button.value-chip {
      min-height: 26px; padding: 2px 8px; font-size: 12px; border-radius: 6px;
      border-color: transparent; background: var(--wa-field);
    }
    .sec-b .field.value-chip-field:not(.compact) > button.value-chip:hover { border-color: var(--wa-line-strong); }
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

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    /* The table scrolls sideways inside its card when a narrow inspector
       cannot fit its columns, rather than running past the card's edge. */
    .states-scroll { overflow-x: auto; margin: 8px 0 4px; }
    .states-table { width: 100%; border-collapse: collapse; margin: 0; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--wa-line); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; width: 18px; height: 18px; }
    /* A title with its remove button beside it sits on the same line as a
       title alone, so the header reads as one row. */
    .states-table th { height: 24px; vertical-align: middle; }
    .states-table th > :is(span, button) { vertical-align: middle; }
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
    .sec-b .field .states-foot select.chip-add {
      width: auto; flex: none; height: 26px; min-height: 26px; padding: 0 22px 0 9px; border-radius: 8px;
      border: 1px dashed var(--wa-line-strong); background-color: transparent; font-size: 12px; font-weight: 600;
    }
    .states-switch { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .states-switch .hint { margin: 0; }
    /* The add controls under a states table, each with its one line of what it
       adds. A narrow inspector puts the line under its control. */
    .states > .states-add { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 5px 10px; margin: 8px 0 2px var(--wa-col); }
    .states-add > :is(button.small, select.chip-add) { justify-self: start; }
    .states-add-note { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
    .sec-b .states-add select.chip-add {
      width: auto; flex: none; height: 26px; min-height: 26px; padding: 0 22px 0 9px; border-radius: 8px;
      border: 1px dashed var(--wa-line-strong); background-color: transparent; font-size: 12px; font-weight: 600;
    }
    @container insp (max-width: 360px) {
      .states > .states-add { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .states-add-note { margin-bottom: 5px; }
    }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

    /* Rich text: a Parts row holding the chips in one filled box, with the
       two add buttons under it, then the part picked in the one light box the
       inspector still draws. A chip keeps the value chip's colours (entity
       teal, reading amber), so a part reads the way the same value reads
       anywhere else in the inspector. */
    .field.parts-field { align-items: start; margin: 2px 0 6px; }
    .field.parts-field > span:first-child { padding-top: 9px; }
    .part-chips {
      min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-height: 34px; padding: 4px;
      border-radius: 8px; background: var(--wa-field);
    }
    .part-adds { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px; }
    .part-adds button.small {
      display: inline-flex; align-items: center; gap: 5px; min-height: 26px; padding: 0 10px 0 8px;
      font-weight: 600; color: var(--c, var(--wa-accent));
      border: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 45%, transparent);
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 12%, transparent);
    }
    .part-adds button.small:hover { background: color-mix(in srgb, var(--c, var(--wa-accent)) 22%, transparent); }
    .part-adds button.small svg.ui-icon { width: 13px; height: 13px; }
    button.part-chip {
      display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 24px; margin: 1px 0; padding: 0 7px 0 6px;
      font: inherit; font-size: 12px; color: var(--wa-ink); cursor: pointer;
      border: 1px solid var(--wa-line); border-radius: 5px; background: var(--wa-card);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.part-chip:hover { border-color: var(--wa-line-strong); }
    button.part-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.part-chip.on {
      border-color: var(--c, var(--wa-accent));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent);
    }
    .part-chip .part-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; box-shadow: inset 0 0 0 1px rgba(128,128,128,.35); }
    .part-chip .part-txt { min-width: 0; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: pre; }
    .part-chip.value .part-txt { color: var(--wa-ent); font-weight: 600; }
    .part-chip.template .part-txt { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; }
    .part-chip .part-sp { color: var(--wa-muted); opacity: .75; }
    .part-chip .part-empty { color: var(--wa-muted); font-style: italic; }
    .part-chip .part-now {
      max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 5px; border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 600; line-height: 16px;
      color: var(--wa-val); background: var(--wa-val-bg);
    }
    .part-chip .part-flag {
      padding: 0 3px; border: 1px solid var(--wa-line-strong); border-radius: 3px; white-space: nowrap;
      font-size: 9.5px; font-weight: 700; line-height: 13px; color: var(--wa-muted); font-variant-numeric: tabular-nums;
    }
    /* The one box left inside a card: the part being edited. Its header is a
       strip of its own, so the rows under it line up with the card's. */
    .part-editor { margin: 0 0 6px; padding: 0 8px 4px; border-radius: 8px; border: 1px solid var(--wa-line); }
    .part-editor button.reset-dot { left: -6px; }
    .part-head {
      display: flex; align-items: center; gap: 2px; height: 30px; margin: 0 -8px 4px; padding: 0 3px 0 9px;
      border-bottom: 1px solid var(--wa-line); font-size: 11.5px; color: var(--wa-muted);
    }
    .part-head .part-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .part-head b { color: var(--wa-ink); font-weight: 600; }
    .part-head .spacer { flex: 1; }
    .field.check:has(> input:disabled) { cursor: default; }
    .field.check:has(> input:disabled) > span { color: var(--wa-muted); }
    .rich-note {
      margin-top: 8px; padding: 8px 10px; border-radius: 8px; font-size: 12.5px; color: var(--wa-ink);
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 14%, var(--wa-card));
    }
    .rich-confirm { margin-top: 8px; padding: 10px; border-radius: 8px; font-size: 12.5px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    .rich-confirm .acts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

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
    /* A layer that can draw nothing until it names an entity: a chart on
       recorded history, a timeline, a picture. The empty box wears a ring in
       the entity colour and keeps pulsing, so "why is my layer blank?" is
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
       here, so the colour never has to be repeated by hand. */
    .ent-tok { color: var(--wa-ent); font-weight: 600; }
    .val-tok, .entity-current .ent-state, .vchip .val, .chart-numbers b, .hint .nums, .readout-v .nums {
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
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } .ent-box.needs { animation: none; } }
  `}firstUpdated(t){super.firstUpdated(t),this.renderRoot.addEventListener("change",i=>{let a=i.target;a?.tagName==="SELECT"&&a.blur()})}connectedCallback(){super.connectedCallback(),this.clearLegacyPickerHidden(),this.loadColumnWidths(),this.loadListView(),this.loadGrid(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("blur",this.blurHandler),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("pointerdown",this.pressStart,{capture:!0}),window.addEventListener("pointerup",this.pressEnd,{capture:!0}),window.addEventListener("pointercancel",this.pressEnd,{capture:!0}),window.addEventListener("click",this.sharedValueOutside,{capture:!0}),window.addEventListener("focusin",this.sharedValueFocus),this.addEventListener(uo,this.scrubStart),this.addEventListener(po,this.scrubEnd),window.addEventListener("hashchange",this.takeShareLink),this.takeShareLink(),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},$w)}loadColumnWidths(){try{let t=window.localStorage.getItem(zm);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=ed(i.left)),typeof i.right=="number"&&(this.colRight=ed(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(zm,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadGrid(){try{let t=window.localStorage.getItem(_m);if(!t)return;let i=JSON.parse(t);typeof i.on=="boolean"&&(this.snapGrid=i.on),Ds.includes(i.step)&&(this.gridStep=i.step),typeof i.lines=="boolean"&&(this.showGridLines=i.lines)}catch{}}setGrid(t,i,a=this.showGridLines){this.snapGrid=t,this.gridStep=i,this.showGridLines=a;try{window.localStorage.setItem(_m,JSON.stringify({on:t,step:i,lines:a}))}catch{}}snapTarget(t){return{snap:{step:vi(this.gridStep,he[t]),on:this.snapGrid}}}loadListView(){try{let t=window.localStorage.getItem(Lm);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(Lm,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Hm:this.colRight=Fm,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Nm(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,m=ed(t==="left"?s+p:s-p);t==="left"?this.colLeft=m:this.colRight=m},d=u=>{u.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("blur",this.blurHandler),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("pointerdown",this.pressStart,{capture:!0}),window.removeEventListener("pointerup",this.pressEnd,{capture:!0}),window.removeEventListener("pointercancel",this.pressEnd,{capture:!0}),window.removeEventListener("click",this.sharedValueOutside,{capture:!0}),window.removeEventListener("focusin",this.sharedValueFocus),this.removeEventListener(uo,this.scrubStart),this.removeEventListener(po,this.scrubEnd),window.removeEventListener("hashchange",this.takeShareLink),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||Zl(i)!==Zl(this.inspect))&&(this.openSections=new Set(Il),this.rowHoverId=void 0)}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=Zl(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!_w.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=Tw[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):c=!1,c&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?dt(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)fe(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=gi(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=jc(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=gi(t,i),r=[];this.mutate(o=>{r=Mn(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=xt(t,this.canvasFamily).filter(a=>!ve(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?at(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>fi(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!Le(t,a,s).isHidden);this.mutate(s=>{for(let l of i)ke(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!ve(a,u)),o=a.elements.filter(u=>ve(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],ct(a),mi(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await Md(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${St(t)}`}this.linkReady=!0,this.openPendingLink()}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.pickerConfirmDelete=void 0,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1;let i=Nu(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await Ld(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Rd(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${St(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=qn.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=ur(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=St(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new qn(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0),!0)}freeSlot(){return nc(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await Hd(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Ad(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=St(t)}}renderSendButton(){let t=iu({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds});if(t.kind==="unsupported"&&!this.sendStatusKnown)return f;let i=au(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:f}${a}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<Ko}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=aa(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=mc(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(kw))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new vt(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,watchAppVersion:this.selectedOwner?.app_version,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),canCountDown:i=>t.canCountDown(i),historySeries:i=>this.historySeries.get(i),historyReadings:i=>this.historyReadings.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}},peekLayer:(i,a)=>{a?this.rowHoverId=i:this.rowHoverId===i&&(this.rowHoverId=void 0)},selectValue:i=>this.openSharedValue(i),beginGesture:()=>this.draft?.beginGesture(),copiedPosition:this.copiedPosition,copyPosition:i=>{this.copiedPosition=i}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||rp(t.app_version):!0}get canvasFamily(){if($i(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&il(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=ua(t)[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=he[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!$i(this.activeFamily))return f;if(xt(t,i).length>0)return f;let r=se.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>bo(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${ne(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${ne(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>Bh(s,o,i))}>Copy the ${ne(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${ne(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${N.sizeWords(i)} against
            ${N.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:f}
    </div>`}addShape(t){this.mutate(i=>ep(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!Lr(i,t))return;let a=np(i,t);a.length>0&&!window.confirm(`Remove the ${ne(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>tp(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew(Oc(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let s=this.freeSlot();if(s<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=ee(),l.slotIndex=s,i=new qn(l,null)}let a=i.encoded(),r=await Do(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id;let o=this.draft.testValues;this.draft=qn.fromDocument(r.record.document,r.record.revision),this.draft.testValues=o,this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=St(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}await this.deleteSaved(this.selectedId,this.draft.baseRevision)}}async deleteSaved(t,i){if(!this.ownerId)return;let a=t===this.selectedId;this.saving=!0;try{let r=await Fd(this.hass,this.ownerId,t,i);if(!r.ok){r.error==="conflict"&&a?this.conflict={current:r.current??null,message:r.message??"This complication changed on the server."}:this.saveError=r.message??r.error??"Delete failed";return}a&&(this.clearDraft(),this.selectedId=void 0),await this.loadRecords()}catch(r){this.saveError=St(r)}finally{this.saving=!1,this.confirmDelete=!1,this.pickerConfirmDelete=void 0}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=ee(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await Id(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=St(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},ww)}async refreshHistorySeries(){let t=this.draft?.config,i=t?as(t):[],a=t?rs(t):[];if(i.length===0&&a.length===0){this.historySeries.size>0&&(this.historySeries=new Map),this.historyReadings.size>0&&(this.historyReadings=new Map);return}let r={};for(let s of i)r[s.key]=Pd(s);let o={};for(let s of a)o[s.key]=Nd(s);try{let[s,l]=await Promise.all([zd(this.hass,r),Od(this.hass,o).catch(()=>({}))]),d=Dd({...s,...l});this.historySeries=d.series,this.historyReadings=d.readings}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await _d(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=lu(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=St(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let d=Pw(o.remaining);d!==void 0&&(l.remaining=d)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(t=!0){let i=new Map;for(let[r,o]of this.compiled?.entities??[]){let s=this.entityStateFor(r,o.iconName??"",t);s&&i.set(r,s)}let a=this.draft?.config.values??[];return{entityStates:i,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:t?tu(a,this.testValues):a,dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3,testedEntities:t?new Set(this.testValues.keys()):new Set}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderTintTool(){let t=this.previewTint,i=Js.find(o=>o.hex===t),a=!this.draft||this.parseError!==void 0,r=o=>{this.toggleMenu("tint",!1),this.previewTint=o};return h`<span class="inbox tint-box ${t!==void 0?"on":""}"
      title="Many watch faces draw complications in one colour. Colours become the face's tint, text and background turn white, and only how see-through each part is survives.">
      <span class="pre">Colour</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="tint"?"true":"false"}
          aria-label=${`Preview colour, ${i?`${i.label} tinted face`:"full colour"}`} @click=${()=>this.toggleMenu("tint")}>
          ${i?h`<i class="tint-dot" style=${`--sw:${i.hex}`}></i>${i.label} tint`:"Full colour"}${U("chevron")}
        </button>
        ${this.openMenu==="tint"?h`<div class="pop-menu" role="listbox" aria-label="Preview colour">
          <button class="row" role="option" aria-selected=${t===void 0?"true":"false"} @click=${()=>r(void 0)}>
            <i class="tint-dot full"></i>Full colour</button>
          ${Js.map(o=>h`<button class="row" role="option" aria-selected=${o.hex===t?"true":"false"}
            @click=${()=>r(o.hex)}><i class="tint-dot" style=${`--sw:${o.hex}`}></i>${o.label} tint</button>`)}
        </div>`:f}
      </span>
    </span>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${U("expand")}</button>`}renderGridButton(){let t=this.snapGrid,i=this.showGridLines,a=!this.draft||this.parseError!==void 0||this.activeFamily==="inline",r=i?v`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" />`:v`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><path d="M2.5 13.5l11-11" />`;return h`<span class="grid-tool ${t?"on":""}" data-menu="grid">
      <button class="pick ${t?"on":""}" ?disabled=${a} aria-pressed=${t?"true":"false"}
        title=${t?"Layers snap to the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely. Click to turn it off.":"Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap."}
        @click=${()=>this.setGrid(!t,this.gridStep)}><span class="glyph">▦</span>Snap to grid</button>
      ${t?h`<button class="grid-step" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="grid"?"true":"false"}
        aria-label=${`Grid size, ${this.gridStep*100}%`} title="Grid size"
        @click=${()=>this.toggleMenu("grid")}>${this.gridStep*100}%${U("chevron")}</button>
      ${this.openMenu==="grid"?h`<div class="pop-menu" role="listbox" aria-label="Grid size">
        ${Ds.map(o=>h`<button class="row" role="option" aria-selected=${o===this.gridStep?"true":"false"}
          @click=${()=>{this.toggleMenu("grid",!1),this.setGrid(!0,o)}}>${o*100}%</button>`)}
      </div>`:f}
      <button class="grid-lines" ?disabled=${a} aria-pressed=${i?"true":"false"}
        aria-label=${i?"Hide the grid lines":"Show the grid lines"}
        title=${i?"Hide the grid lines. Layers still snap.":"Show the grid lines. Layers snap either way."}
        @click=${()=>this.setGrid(!0,this.gridStep,!i)}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${r}</svg>
      </button>`:f}
    </span>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[t],s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,t)}
        <span class="spacer"></span>
        ${this.renderTintTool()}
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        ${this.renderGridButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${s}`}>
        ${this.renderBigPreview(t,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let t=bn,i=td,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Aa}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Snap to grid","On by default at 1%. Layers snap to the grid when you drag them, and arrows move one grid step. The eye beside the size shows or hides the lines; snapping works either way"],["Alt-drag","Flips Snap to grid for that drag: snaps with it off, moves freely with it on"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=[["Shapes","Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],["Shape tabs","Above the preview. Click one to edit that shape, or a dashed one to add it."],["Canvas shapes","Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],["Corner","Its Corner content card picks big curved text or a canvas of layers."],["Inline","One line of text with an optional symbol before it. It has no layers."],["The shape itself","The bottom row of the Layers list: its background, border and Shape states."]],s=[["Text","A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],["Icon","An SF Symbol or Material Design icon, or the entity's own icon."],["Gauge","A number drawn between a minimum and a maximum."],["Chart","Recent history as bars, a line or an area."],["Timeline","Which state an entity was in over time, as a coloured strip."],["Shape","A rectangle, rounded rectangle, capsule, circle or line."],["Picture","A camera snapshot, or an entity's picture such as a person's avatar or album art."],["Tap area","Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies."],["Extras","Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],["Order","The top of the Layers list draws on top. Drag a row to reorder."],["Groups",`A folder of layers. Pick some and press ${t}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`]],l=[["Content","What the layer shows, starting with its entity or value."],["Look","How it is drawn: size, colour and style. On a picture the card is called Picture."],["Extras","Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],["States","Changes that apply while a value matches, described below."],["Position","Where the layer sits on the shape being edited, and its size."],["Tap","What a tap on the layer does."],["?","In a card's header: shows that card's help text."]],d=[["By value","Gauges, charts and text can colour by value instead of one colour. Each band colours readings up to its number, lowest band first. Readings above every band take the Above the last band colour."],["Timeline colours","A timeline colours each state from its own table."],["States","Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, colour, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],["Shape states","The same table, on the shape itself."],["Shared values","Like a variable: set it once under the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],["Values on the watch","Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."]],c=[["Save",`Writes the complication to Home Assistant (${t}S). A new one says Save new until then. Only an administrator can save.`],["The dot","Beside Save: unsaved changes, saved, or not saved yet. The footer says the same in words."],["Reaching the watch","The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],["Hide","The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."]],u=[["On watch","The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],["Sending\u2026","Waiting for the watch to pull and confirm."],["Not on watch yet","The watch is connected but has not confirmed the latest change. Resend wakes it again."],["Open the watch app to sync","The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend tries to wake it."],["Update the watch app","This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."]],p=[["Share","In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],["Backup","The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],["Copy link","A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],["Import","Beside New. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."]],m=$=>$.map(([k,w])=>h`<tr><th scope="row"><kbd>${k}</kbd></th><td>${w}</td></tr>`),g=($,k)=>h`<section>
      <h3>${$}</h3>
      <table class="terms"><tbody>${k.map(([w,C])=>h`<tr><th scope="row">${w}</th><td>${C}</td></tr>`)}</tbody></table>
    </section>`,y=($,k)=>h`<button role="tab" id=${`wa-help-${$}`} aria-selected=${this.helpTab===$?"true":"false"}
      @click=${()=>{this.helpTab=$}}>${k}</button>`,b;return this.helpTab==="keys"?b=h`
        <section>
          <h3>Keys</h3>
          <table><tbody>${m(a)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${m(r)}</tbody></table>
        </section>`:this.helpTab==="sync"?b=h`<div>${g("Saving",c)}${g("Watch status",u)}</div>${g("Share and import",p)}`:b=h`<div>${g("Shapes",o)}${g("Cards",l)}</div><div>${g("Layers",s)}${g("Colour, states and values",d)}</div>`,h`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
      <div class="help-head">
        <h2>Help</h2>
        <span class="spacer"></span>
        <a href="https://docs.wrist-assistant.com/" target="_blank" rel="noopener noreferrer">Wrist Assistant docs</a>
        <button class="pick" title="Close (Escape)" @click=${()=>{this.helpOpen=!1}}>Close</button>
      </div>
      <div class="help-tabs" role="tablist" aria-label="Help topics">
        ${y("basics","Basics")}${y("keys","Keys and mouse")}${y("sync","Syncing and sharing")}
      </div>
      <div class="help-body" role="tabpanel" aria-labelledby=${`wa-help-${this.helpTab}`}>${b}</div>
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?mr(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){let a=this.renderRoot,r="activeElement"in a?a.activeElement:null;if(r&&typeof r.blur=="function"&&!i.currentTarget?.contains(r)&&r.blur(),this.picking){i.preventDefault(),this.pickAt(t,i);return}let o=i.target,s=o.closest("[data-handle]")?.getAttribute("data-handle")??null,l=o.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,d=o.closest("svg.complication");if(this.showTaps){let _=this.focusTapId();if(_!==void 0&&l===_&&d&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,d,_,s??void 0);return}let R=this.hitLayerId(i);R?this.inspect={kind:"layer",id:R}:l===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let c=Pm(i),u=l!==void 0?mr(this.draft.config,l):void 0;if(!c&&!s&&d&&this.multi.size>=2&&u!==void 0&&this.multi.has(u)){let _=Dc(this.draft.config,this.multi);if(i.preventDefault(),_.length===0)return;this.beginMoveGesture(t,i,d,_,`drag-pick-${t}`,()=>{this.multi=new Set,this.inspect={kind:"layer",id:u}});return}if(!c&&this.multi.size>0&&(this.multi=new Set),!l||!d)return;let p=mr(this.draft.config,l),m=this.draft.config.elements.find(_=>_.payload.id===p);if(!p||!m)return;if(c){i.preventDefault(),this.togglePick(p);return}let g,y=this.inspect.kind==="layer"?this.inspect.id:void 0;if(y!==void 0&&y!==p&&!s){let _=this.draft.config.elements.find(X=>X.payload.id===y);_!==void 0&&_.kind!=="chartDots"&&_.kind!=="chartGrid"&&_.payload.chartAnchor?.place!=="through"&&at(this.draft.config,y)?.locked!==!0&&Lw(d,y,i)&&(g=p,p=y,m=_)}let b=at(this.draft.config,p),$=b!==void 0&&this.inspect.kind==="group"&&this.inspect.id===b.id;if(b&&(b.locked||$)&&!s){let _=$||this.inspect.kind==="layer"&&at(this.draft.config,this.inspect.id)?.id===b.id;this.beginGroupGesture(t,i,d,b,_?p:void 0);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},s)||m.payload.chartAnchor?.place==="through")return;i.preventDefault();let k=Le(this.draft.config,t,m).frame,w=this.gestureCanvas(t),C=m.payload.chartAnchor,L=C!==void 0&&!It(C.at)&&C.place!=="through",M=C!==void 0&&It(C.at)&&C.place==="through",H=he[t],A={dx:C?.dx??0,dy:C?.dy??0},E=C!==void 0&&!s?xi(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(_=>_.id===p)?.frame:void 0,I=E??k,j=_=>Math.round(_*10)/10;this.cancelGesture?.();let W=!1,q=s!==null?xi(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(_=>_.id===p):void 0;if(s!==null&&q?.kind==="icon"){let _=Qs(q)/2,R=q.size;this.cancelGesture=Cu(d,i,s,{w:_,h:_},(X,x)=>{this.mutate(S=>{ke(S,t,p,{size:Math.max(1,Math.round(R*X))})},`drag-${p}-${t}`),x&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let P=q!==void 0?qu(q,I,w):{};this.cancelGesture=Er(d,w,i,{elementId:p,frame:I,handle:s??void 0,...P,...C===void 0?this.snapTarget(t):{}},{onFrame:(_,R,X)=>{if(X||(W=!0),X&&!W&&g!==void 0){this.inspect={kind:"layer",id:g},this.cancelGesture=void 0;return}this.mutate(x=>{if(C===void 0){ke(x,t,_,{frame:R});return}let S=E?{width:k.width,height:k.height}:{width:R.width,height:R.height};ke(x,t,_,{frame:{...R,...S,x:L?R.x:k.x,y:k.y}});let F=x.elements.find(J=>J.payload.id===_)?.payload.chartAnchor;if(F===void 0)return;let O=A.dx,K=M?A.dy:j(A.dy+(R.y-I.y)*H.height);O?F.dx=O:delete F.dx,K?F.dy=K:delete F.dy},`drag-${_}-${t}`),X&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r,o){let s=this.draft?.config;if(!s)return;let l=dt(s,r.id);if(l.length===0)return;o===void 0&&(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let d=o===void 0?void 0:()=>{this.inspect={kind:"layer",id:o}};this.beginMoveGesture(t,i,a,l.map(c=>c.payload.id),`drag-group-${r.id}-${t}`,d)}beginMoveGesture(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return;let d=l.elements.filter(M=>r.includes(M.payload.id));if(d.length===0)return;let c=new Map(d.map(M=>[M.payload.id,Le(l,t,M).frame])),u=[...c.values()],p=Math.min(...u.map(M=>M.x)),m=Math.min(...u.map(M=>M.y)),g=Math.max(...u.map(M=>M.x+M.width)),y=Math.max(...u.map(M=>M.y+M.height)),b={x:p,y:m,width:g-p,height:y-m,rotationDegrees:0},$=M=>Math.round(M*1e3)/1e3;this.cancelGesture?.();let k=!1,w=M=>{M.pointerId===i.pointerId&&Math.hypot(M.clientX-i.clientX,M.clientY-i.clientY)>zw&&(k=!0)};a.addEventListener("pointermove",w);let C=()=>a.removeEventListener("pointermove",w),L=Er(a,this.gestureCanvas(t),i,{elementId:o,frame:b,...this.snapTarget(t)},{onFrame:(M,H,A)=>{if(A&&C(),!A&&!k)return;if(A&&!k&&s!==void 0){s(),this.cancelGesture=void 0;return}let E=H.x-b.x,I=H.y-b.y;this.mutate(j=>{for(let[W,q]of c)ke(j,t,W,{frame:{...q,x:$(q.x+E),y:$(q.y+I)}})},o),A&&(this.draft?.endGesture(),this.cancelGesture=void 0)}});this.cancelGesture=()=>{C(),L()}}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?$u:1,s=t*o,l=i*o,d=this.canvasFamily,c=he[d];if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let $=this.inspect.id;return this.nudgeMany(dt(r,$).map(k=>k.payload.id),d,c,`nudge-group-${$}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find($=>$.payload.id===u);if(!p||p.payload.chartAnchor?.place==="through")return!1;let m=at(r,u);if(m?.locked)return this.nudgeMany(dt(r,m.id).map($=>$.payload.id),d,c,`nudge-group-${m.id}-${d}`,s,l);let g=Le(r,d,p).frame,y=p.payload.chartAnchor;if(y!==void 0){let $=!It(y.at);return l===0&&!($&&s!==0)||this.mutate(k=>{$&&s!==0&&ke(k,d,u,{frame:Tr(g,s,0,c)});let w=k.elements.find(L=>L.payload.id===u)?.payload.chartAnchor;if(w===void 0||l===0)return;let C=Math.round(((w.dy??0)+l)*10)/10;C?w.dy=C:delete w.dy},`nudge-${u}-${d}`),!0}let b=this.snapGrid?Vs(g,s,l,vi(this.gridStep,c)):Tr(g,s,l,c);return(b.x!==g.x||b.y!==g.y)&&this.mutate($=>ke($,d,u,{frame:b}),`nudge-${u}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,c=new Map;for(let C of t){let L=l.elements.find(M=>M.payload.id===C);L&&c.set(C,Le(l,i,L).frame)}if(c.size===0)return!1;let u=[...c.values()],p=Math.min(...u.map(C=>C.x)),m=Math.min(...u.map(C=>C.y)),g=Math.max(...u.map(C=>C.x+C.width)),y=Math.max(...u.map(C=>C.y+C.height)),b={x:p,y:m,width:g-p,height:y-m,rotationDegrees:0},$=this.snapGrid?Vs(b,o,s,vi(this.gridStep,a)):Tr(b,o,s,a),k=$.x-b.x,w=$.y-b.y;return(k!==0||w!==0)&&this.mutate(C=>{for(let[L,M]of c)ke(C,i,L,{frame:{...M,x:d(M.x+k),y:d(M.y+w)}})},r),!0}gestureCanvas(t){let i=Hr(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=nl(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:je(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let d=ve(s,l),c=Le(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=Er(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o,...this.snapTarget(t)},{onFrame:(u,p,m)=>{this.mutate(g=>{d?Gc(g,u,t,p):ke(g,t,u,{frame:p})},`tap-box-${u}-${t}`),m&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Nm(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>Choose watch
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${this.owners.map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${Dm(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${Am()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${Am()}`:f}
        ${this.renderNewButton()}
        ${t?h`<button class="new-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen?"true":"false"}
          title="Share or back up this complication as text, a file or a link"
          @click=${()=>this.openShareDialog()}><span>Share</span></button>`:f}
        <span class="spacer"></span>
        <button class="help" title="Help" aria-label="Help" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${U("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${U("redo")}</button>
        </div>
        <div class="hbox status">
          <span class="dirty-dot ${i?"":r?"clean":"none"}" title=${i?"Unsaved changes":r?"Saved":"Not saved yet"}></span>
          ${this.renderSendButton()}
          <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
        </div>
      </header>
      ${this.loadError?h`<div class="card error">${this.loadError}</div>`:f}
      ${this.linkNote?h`<div class="banner warn link-note"><span>${this.linkNote}</span>
        <button class="link" @click=${()=>{this.linkNote=void 0}}>Dismiss</button></div>`:f}
      ${this.helpOpen?this.renderHelpDialog():f}
      ${this.newOpen?this.renderNewDialog():f}
      ${this.shareOpen?this.renderShareDialog():f}
      ${this.importOpen?this.renderImportDialog():f}
      ${this.watchSupported?h`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}${this.renderSharedValues()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=t?.complication_count??0,a=i===0?"Nothing on this watch changes until then.":`Your ${i} complication${i===1?"":"s"} keep${i===1?"s":""} working until then.`;return h`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${U("watch")}</div>
        <div class="gate-eyebrow">Watch app update coming soon</div>
        <h2 class="gate-title">This watch needs the new app.</h2>
        <p class="gate-lead">${op(t?.app_version)}</p>
        <ol class="gate-steps">
          <li>
            <span class="gate-n">1</span>
            <div><b>Update Wrist Assistant on your iPhone</b><span>The watch app updates with it.</span></div>
          </li>
          <li>
            <span class="gate-n">2</span>
            <div><b>Open the app on your iPhone and on your watch</b><span>The watch reports its new version here.</span></div>
          </li>
          <li>
            <span class="gate-n">3</span>
            <div><b>Reload this page</b><span>The editor opens. Complications still on your iPhone move here by themselves once the watch app is updated.</span></div>
          </li>
        </ol>
        <div class="gate-foot">${a}</div>
      </div>
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...ic(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(ne).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t){return h`<span class="shape-dots">${ln.map(i=>h`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${ne(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=pi(t.document),r={revision:t.revision,config:a,entities:[...aa(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??il(a)??"inline";return this.renderConfigArts(a,i.entities,[o],"pk-art")[0]}renderConfigArts(t,i,a,r){let o=new Map;for(let l of i){let d=this.entityStateFor(l.entityId,l.iconName??"",!1);d&&o.set(l.entityId,d)}let s=xi(t,{entityStates:o,templateResults:new Map,namedValues:t.values});return a.map(l=>{if(l==="inline")return h`<span class="${r} inline">${this.renderInlinePreview(s.inline,!0)}</span>`;let d=s[l];return d?h`<span class="${r} ${l}">${Ir(d,{icons:this.icons,imageSizes:this.imageSizes,slot:ki.slots[l]})}</span>`:h`<span class=${r}></span>`})}renderPickerFilter(t){let i=r=>r.kind==="record"?Ql(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${ln.map(r=>a(r,ne(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=t?t.config.name.trim()||"Untitled":"No complication",a=t?t.config.supportedFamilies:[],r=this.pickerRows(),o=this.pickerFilter,s=o==="all"?r:r.filter(d=>(d.kind==="record"?Ql(d.record):d.families).includes(o)),l=Nc(s,d=>d.kind==="record"?{id:d.record.id,hidden:this.rowHidden(d.record)}:void 0,this.selectedId);return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(a)}
        <span class="pk-name">${i}</span>
        ${t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:f}
        ${U("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${r.length>=N.FILTER_FROM_ROWS?this.renderPickerFilter(r):f}
        ${r.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this watch yet.</div>`:f}
        ${r.length>0&&s.length===0?h`<div class="empty">Nothing on this watch has a ${o==="all"?"":ne(o)} shape.</div>`:f}
        ${l.shown.map(d=>this.renderPickerRow(d))}
        ${t&&t.baseRevision===null?h`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${i}</span>${this.shapeDots(a)}<span class="pk-badge">unsaved</span></div>`:f}
        ${l.hidden.length>0?h`
          <button type="button" class="pk-hidden-head" aria-expanded=${this.pickerHiddenOpen?"true":"false"}
            @click=${()=>{this.pickerHiddenOpen=!this.pickerHiddenOpen}}>
            ${U("chevron")}<span>Hidden (${l.hidden.length})</span>
          </button>
          ${this.pickerHiddenOpen?l.hidden.map(d=>this.renderPickerRow(d)):f}`:f}
      </div>`:f}
    </div>`}renderPickerRow(t){if(t.kind!=="record")return h`<button type="button" class="row locked" role="option" aria-disabled="true" title=${t.title}
          @click=${()=>{this.pickerNote=this.pickerNote===t.slot?void 0:t.slot}}>
          <span class="pk-art"></span>
          <span class="pk-name">${t.name}</span>
          ${this.shapeDots(t.families)}
          <span class="pk-badge">${t.badge}</span>
        </button>
        ${this.pickerNote===t.slot?h`<div class="pk-note">${t.title}</div>`:f}`;let i=t.record,a=i.id===this.selectedId,r=this.rowHidden(i),o=String(i.document?.name??"Untitled"),s=a?this.canEdit:!!this.hass.user?.is_admin,l=s,d=this.pickerConfirmDelete===i.id,c=u=>u.stopPropagation();return h`<div class="row rec ${r?"dim":""}" aria-current=${a?"true":"false"}>
      <button type="button" class="pick" role="option" aria-selected=${a?"true":"false"}
        @click=${()=>{this.togglePicker(!1),this.selectRecord(i)}}>
        ${this.renderRowArt(i)}
        <span class="pk-name">${o}</span>
        ${this.shapeDots(Ql(i))}
      </button>
      <span class="pk-acts">
        ${d?h`<button type="button" class="ghost danger small" ?disabled=${this.saving}
              @click=${u=>{c(u),a?this.deleteCurrent():this.deleteSaved(i.id,i.revision)}}>Really delete</button>
            <button type="button" class="ghost small" @click=${u=>{c(u),this.pickerConfirmDelete=void 0}}>Cancel</button>`:h`${l?h`<button type="button" class="icon" ?disabled=${!a&&this.saving}
              title=${r?"Hidden from the watch's complication list. Show it there again.":"Hide from the watch's complication list. Faces already using it keep it."}
              aria-label=${r?`Show ${o} in the watch's complication list`:`Hide ${o} from the watch's complication list`}
              @click=${u=>{c(u),this.setPickerHidden(i,!r)}}>${U(r?"hide":"show")}</button>`:f}
            ${s?h`<button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${o}`}
              ?disabled=${this.saving} @click=${u=>{c(u),this.pickerConfirmDelete=i.id}}>${U("delete")}</button>`:f}`}
      </span>
    </div>`}rowHidden(t){return t.id===this.selectedId&&this.draft?this.draft.config.hidden===!0:zc(t.document)}async setPickerHidden(t,i){if(this.ownerId){if(t.id===this.selectedId){this.mutate(a=>{i?a.hidden=!0:delete a.hidden});return}if(!(!this.hass.user?.is_admin||this.saving||!t.document)){this.saving=!0,this.saveError=void 0;try{let a=Pc(t.document,i),r=await Do(this.hass,this.ownerId,a,t.revision);if(!r.ok){this.saveError=r.error==="conflict"?`${String(t.document.name??"That complication")} changed on the server. Try again.`:r.message??r.error??"Save failed";return}this.beginSendWait(),await this.loadRecords()}catch(a){this.saveError=St(a)}finally{this.saving=!1}}}}clearLegacyPickerHidden(){try{let t=window.localStorage,i=[];for(let a=0;a<t.length;a++){let r=t.key(a);r?.startsWith(vw)&&i.push(r)}for(let a of i)t.removeItem(a)}catch{}}toggleMenu(t,i=this.openMenu!==t){this.openMenu=i?t:this.openMenu===t?void 0:this.openMenu,this.openMenu!==void 0?window.addEventListener("pointerdown",this.menuOutside,{capture:!0}):window.removeEventListener("pointerdown",this.menuOutside,{capture:!0})}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.pickerNote=void 0,this.pickerConfirmDelete=void 0),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return f;let t=this.freeSlot()<0;return h`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${U("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">watch is full</span>`:f}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return"A complication on this watch already has that name."}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${U("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${t?"true":"false"}
            @input=${r=>{this.newName=r.target.value}} />
        </div>
        ${t?h`<div class="hint err">${t}</div>`:h`<div class="hint">This is what the name shows on the watch face picker, so make it one you will recognise there.</div>`}
        <div class="field new-shapes">
          <span>Shape</span>
          <div class="shape-cards" role="radiogroup" aria-label="Shape">
            ${ln.map(r=>h`<button type="button" role="radio" class="shape-card ${this.newFamily===r?"on":""}"
              aria-checked=${this.newFamily===r?"true":"false"}
              @click=${()=>{this.newFamily=r}}>
              ${Mw(r)}
              <span class="shape-card-name">${ne(r)}</span>
            </button>`)}
          </div>
        </div>
        <div class="hint">Start with one shape. More can be added under the preview later.</div>
      </div>
      <div class="new-foot">
        <button class="small" @click=${()=>this.closeNewDialog()}>Cancel</button>
        <button class="primary" ?disabled=${!a}
          title=${a?"Make it":i?t||"Pick a shape first":"Give it a name first"}
          @click=${()=>this.createNew()}>Create</button>
      </div>
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.draft?.config;return t?fm(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config;if(!t)return f;let i=this.currentShareSlots(),a=ym(t,this.shareMode,i),r=this.shareLink?.text===a?this.shareLink:void 0,o=(s,l,d)=>h`<label class="xfer-mode">
      <input type="radio" name="wa-share-mode" .checked=${this.shareMode===s}
        @change=${()=>{this.shareMode=s,this.shareNote=""}} />
      <span><b>${l}</b><span class="hint">${d}</span></span>
    </label>`;return h`<dialog class="share-dialog" @close=${()=>{this.shareOpen=!1}}>
      <div class="new-head">
        <h2>Share this complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Close" aria-label="Close" @click=${()=>this.closeShareDialog()}>${U("close")}</button>
      </div>
      <div class="xfer-body">
        <div class="field">
          <span>What to share</span>
          <div class="xfer-modes">
            ${o("share","Share","Entity ids and friendly names are replaced by numbered slots, so nothing about your home travels with it. Whoever imports it picks their own entities.")}
            ${o("backup","Backup","An exact copy, your entity ids and names included. For your own records, or another watch in this home.")}
          </div>
        </div>
        ${this.shareMode==="share"?this.renderShareSlots(i):f}
        <div class="field">
          <span>Text</span>
          <textarea class="xfer-text" rows="14" readonly aria-label="The text to share" .value=${a}></textarea>
        </div>
        ${r?h`<div class="field">
          <span>Link</span>
          <input class="xfer-link" type="text" readonly aria-label="Share link" .value=${r.url}
            @focus=${s=>s.target.select()} />
          <div class="hint">Opening it on this Home Assistant fills in the Import dialog. Someone on another home pastes it into their own Import dialog instead.</div>
        </div>`:f}
      </div>
      <div class="xfer-foot">
        ${this.shareNote===""?f:h`<span class="note">${this.shareNote}</span>`}
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeShareDialog()}>Close</button>
        <button class="small" @click=${()=>this.downloadShareText(a)}>Download</button>
        <button class="small" title="A link that opens Import with this text filled in" @click=${()=>{this.copyShareLink(a)}}>Copy link</button>
        <button class="primary" @click=${()=>{this.copyShareText(a)}}>Copy</button>
      </div>
    </dialog>`}renderShareSlots(t){return t.length===0?h`<div class="hint">This design reads no entities, so there is nothing to replace.</div>`:h`<div class="field">
      <span>Slots</span>
      <div>
        ${t.map(i=>h`<div class="xfer-slot">
          <div class="srow">
            <span class="sid" title=${i.placeholderId}>${i.placeholderId}</span>
            <input type="text" maxlength="40" aria-label=${`Label for ${i.placeholderId}`} .value=${i.label}
              @input=${a=>this.setShareLabel(i.placeholderId,a.target.value)} />
          </div>
          <div class="hint">${i.where.join(", ")}</div>
        </div>`)}
      </div>
      <div class="hint">These names are all the other side has while it picks its own entities, so say what each one is for.</div>
    </div>`}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareNote="",this.shareLink=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}async copyShareText(t,i="dialog.share-dialog textarea",a="Copied."){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.shareNote=a;return}}catch{}let r=this.renderRoot.querySelector(i);r?.focus(),r?.select();let o=!1;try{o=document.execCommand("copy")}catch{o=!1}this.shareNote=o?a:"Press Cmd+C or Ctrl+C to copy."}async copyShareLink(t){let i=await Sm(t),a=Tm(`${window.location.origin}${window.location.pathname}`,i);this.shareLink={text:t,url:a},await this.updateComplete,await this.copyShareText(a,"dialog.share-dialog input.xfer-link","Link copied.")}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=bm(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote=`Saved as ${a}.`}renderImportDialog(){let t=this.importParse,i=t?.ok?t.config:void 0,a=i?jl(i,this.hass.states):[],r=Jl({parsed:i!==void 0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(a)});return h`<dialog class="import-dialog ${this.importDrop?"dropping":""}" @keydown=${this.importKeys} @close=${()=>{this.importOpen=!1}}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}>
      <div class="new-head">
        <h2>Import a complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeImportDialog()}>${U("close")}</button>
      </div>
      <div class="xfer-body">
        <div class="field">
          <span>Shared text</span>
          <textarea class="xfer-text" rows="8" placeholder="Paste the shared text or a share link here"
            aria-label="Shared complication text or link" .value=${this.importText}
            @input=${o=>this.setImportText(o.target.value)}></textarea>
          <div class="xfer-file">
            <button type="button" class="small"
              @click=${o=>o.currentTarget.parentElement?.querySelector("input[type=file]")?.click()}>Choose a file</button>
            <span class="hint">or drop one on this dialog</span>
            <input type="file" hidden accept=".json,application/json,text/plain"
              @change=${o=>{this.readImportFile(o)}} />
          </div>
        </div>
        ${t&&!t.ok?h`<div class="hint err xfer-problem" role="alert">${t.error}</div>`:f}
        ${i?this.renderImportPreview(i,a):f}
        ${i?this.renderImportDetails(i,a):f}
      </div>
      <div class="xfer-foot">
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeImportDialog()}>Cancel</button>
        <button class="primary" ?disabled=${r!==void 0}
          title=${r??"Open it in the editor"} @click=${()=>this.doImport()}>Import</button>
      </div>
      ${this.importDrop?h`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>`:f}
    </dialog>`}renderImportPreview(t,i){let a=km(t,i),r=a.layers===1?"1 layer":`${a.layers} layers`,o=a.slots===0?"no entities to choose":a.slots===1?"1 entity to choose":`${a.slots} entities to choose`,s=a.missing===0?"":` \xB7 ${a.missing} not in your Home Assistant`;return h`<div class="xfer-preview">
      <div class="xfer-arts">${this.renderConfigArts(t,this.importEntities,ua(t),"pk-art xfer-art")}</div>
      <div class="xfer-facts">
        <b>${t.name.trim()||"Untitled"}</b>
        <span>${a.families.join(" \xB7 ")}</span>
        <span>${r} · ${o}${s}</span>
      </div>
    </div>`}dragReadable(t){let i=t.dataTransfer?[...t.dataTransfer.types]:[];return i.includes("Files")||i.includes("text/plain")}unchosenCount(t){return t.filter(i=>i.required&&!this.importMap.has(i.entityId)).length}renderImportDetails(t,i){let a=this.importName.trim(),r=a!==""&&this.takenNames().has(a.toLowerCase());return h`
      <div class="field">
        <span>Name</span>
        <input type="text" maxlength="60" aria-label="Complication name" aria-invalid=${r?"true":"false"}
          .value=${this.importName}
          @input=${o=>{this.importName=o.target.value}} />
      </div>
      ${r?h`<div class="hint err">A complication on this watch already has that name.</div>`:h`<div class="hint">It opens in the editor and reaches the watch at the first Save.</div>`}
      ${i.length===0?h`<div class="hint">Every entity this design reads is already in your Home Assistant.</div>`:h`<div class="field">
            <span>Entities</span>
            <div>${i.map(o=>this.renderImportRow(o))}</div>
          </div>`}
      ${gm(t)?h`<div class="hint warn">This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</div>`:f}`}renderImportRow(t){let i=this.importMap.get(t.entityId);return h`<div class="xfer-ent">
      ${Ct({hass:this.hass},t.label,i??Cw,a=>this.setImportEntity(t.entityId,a),Rm(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&i===void 0})}
      <div class="hint">${t.where.join(", ")}</div>
      <div class="hint">${t.required?"Choose the entity this design should read.":"Not in your Home Assistant right now; leave it to keep the id."}</div>
    </div>`}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,go(this.hass.states,i.entityId)),this.importMap=a}setImportText(t){this.importText=t;let i=Em(t);if(i!==void 0){this.importParse=void 0,this.importMap=new Map,this.importName="",ql(i).then(o=>{this.importText===t&&(o===void 0?this.importParse={ok:!1,error:Xl}:this.setImportText(o))});return}let a=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,r=t.trim()===""?void 0:xm(t,this.maxSchemaVersion);if(this.importParse=r,!r?.ok){this.importMap=new Map,this.importName="";return}try{this.importEntities=[...aa(r.config).entities.values()]}catch{this.importEntities=[]}JSON.stringify(r.config)!==a&&(this.importMap=new Map,this.importName=wm(r.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];a&&(await this.readImportBlob(a),i.value="")}async readImportBlob(t){try{this.setImportText(await t.text())}catch(i){this.importParse={ok:!1,error:`That file could not be read: ${St(i)}`}}}async openPendingLink(){let t=this.pendingLink;if(t===void 0)return;if(this.pendingLink=void 0,!this.hass.user?.is_admin){this.linkNote="This link holds a shared complication. Only a Home Assistant administrator can import it.";return}let i=await ql(t);if(i===void 0){this.linkNote=Xl;return}if(!this.ownerId){this.linkNote="This link holds a shared complication, but no watch has connected to this Home Assistant yet.";return}if(this.freeSlot()<0){this.linkNote="This link holds a shared complication, but this watch has no free slot. Delete a complication, then open the link again.";return}this.linkNote=void 0,this.openImportDialog(),this.setImportText(i)}doImport(){let t=this.importParse;if(!t?.ok)return;let i=vm(t.config,this.importMap);i.id=ee(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=Rn(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.importEntities=[],this.importDrop=!1,this.importDragDepth=0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("textarea")?.focus())}))}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importOpen=!1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?h` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&t.push(h`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&t.push(h`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),t}renderOrphanBanner(){let t=this.selectedOwner;if(!t?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return h`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${t.complication_count} complication${t.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?h`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:h`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Dm(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return f;if(this.activeFamily==="inline")return f;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${U("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?f:h`<span class="mini">${al.length} kinds · ${Ra.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([s,l])=>h`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${U(s)}</button>`)}
              </span>
            </span>`:f}
        <span class="chev">${U("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${al.map(s=>h`<button class="add" style=${`--k:${Xe[s]}`} ?disabled=${i} title=${`Add a blank ${dn[s].toLowerCase()} layer`}
              @click=${()=>{let l=Ee(s);this.addHere(d=>{d.elements.push(l),l.kind==="timeline"&&Nn(d,l.payload.id)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?h`<span class="well">${Mp(s)}</span>`:f}<span class="add-name">${r?U(s):h`<span class="k"></span>`}<span>${dn[s]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${Ra.map(s=>h`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:f}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!ve(o,g)),l=o.elements.filter(g=>ve(o,g)),d=[...s].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let u=o.groups?.find(g=>g.id===t),p=u?d.filter(g=>g.payload.groupId===u.id):d.filter(g=>g.payload.id===t);if(p.length===0||p.includes(c))return;d=d.filter(g=>!p.includes(g));let m;if((u||r)&&c.payload.groupId!==void 0){let g=d.filter(y=>y.payload.groupId===c.payload.groupId);m=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else m=d.indexOf(c)+(a?0:1);if(d.splice(m,0,...p),!u){let g=p[0],y=r?void 0:c.payload.groupId;y===void 0?delete g.payload.groupId:g.payload.groupId=y}o.elements=[...d.reverse(),...l],ct(o),mi(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?Bt:0),l=o.bottom-(r.classList.contains("drop-after")?Bt:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(Pm(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!ve(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=xs(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return f;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(E,I)=>this.moveLayer(E,I),o=E=>{let I;this.mutate(j=>{I=Wc(j,E)}),I&&(this.inspect={kind:"layer",id:I})},s=E=>{this.mutate(I=>fe(I,E)),this.inspect.kind==="layer"&&this.inspect.id===E&&(this.inspect={kind:"general"})},l=xt(t,a).filter(E=>!ve(t,E)).reverse(),d=me(this.host()),c=new vt(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",m=`${u?.backgroundColorHex?Ie(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(E=>t.elements.some(I=>I.payload.id===E)).length,y=xi(t,this.buildContext(),this.forced)[a],b=Om[this.thumbStep],$=Math.round(nd*b),k=Math.round(id*b),w=E=>y?h`<span class="thumb">${Qu(y,E,{icons:this.icons,imageSizes:this.imageSizes,width:$,height:k})}</span>`:h`<span class="thumb"></span>`,C=this.layerDetail==="expanded",L=(E,I,j=!1)=>{let W=E.payload.id,q=this.inspect.kind==="layer"&&this.inspect.id===W,P=Le(t,a,E),_=P.isHidden,R=je(t,W)[0],X=ha(E.payload.rules),x=this.picking&&this.pickHoverId===W,S=this.rowDrag(W,i);return h`<div class="layer ${q?"hl":""} ${j?"held":""} ${x?"pick":""} ${_?"dim":""} ${this.multi.has(W)?"multi":""} ${I?"kid":""} ${C?"rich":""}"
        style=${`--k:${Xe[E.kind]}`} tabindex="0" draggable=${S.draggable}
        @pointerenter=${()=>{this.listHoverIds=[W]}}
        @pointerleave=${()=>this.leaveRow([W])}
        @click=${F=>this.clickRow(W,F)}
        @keydown=${F=>{F.key==="Enter"&&(this.inspect={kind:"layer",id:W})}}
        @dragstart=${S.onStart} @dragend=${S.onEnd} @dragover=${S.onOver} @drop=${S.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${U("grip")}</span>
        <span class="bar"></span>
        ${w([W])}
        <span class="name">
          <b>${He(E,d)}</b>
          <small><span class="kind">${dn[E.kind]}</span> · ${Ow(E,c,this.historySeries,P.size)}</small>
          ${C?h`<span class="facts">${Nw(this.host(),a,E,P).map(F=>h`<span class="fact"><b>${F.label}</b> ${F.value}</span>`)}</span>`:f}
        </span>
        <span class="right">
          <span class="badges">
            ${R?h`<span class="badge tap" title=${`Tappable \xB7 ${He(R,d)}`}>tap</span>`:f}
            ${E.payload.rules.length===0?f:h`<span class="badge states" title=${X}>${X.replace(/\.$/,"").toLowerCase()}</span>`}
            ${_?h`<span class="badge">hidden</span>`:f}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${bn}])`} aria-label="Bring forward" @click=${F=>{F.stopPropagation(),r(W,1)}}>${U("up")}</button>
            <button class="icon" title=${`Send back (${bn}[)`} aria-label="Send back" @click=${F=>{F.stopPropagation(),r(W,-1)}}>${U("down")}</button>
            <button class="icon" title=${`${P.isHidden?"Show":"Hide"} (${td}${bn}H)`} aria-label=${P.isHidden?"Show this layer":"Hide this layer"} @click=${F=>{F.stopPropagation(),this.mutate(O=>ke(O,a,W,{isHidden:!P.isHidden}))}}>${U(P.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${bn}D)`} aria-label="Duplicate" @click=${F=>{F.stopPropagation(),o(W)}}>${U("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${F=>{F.stopPropagation(),s(W)}}>${U("delete")}</button>
          </span>`:f}
        </span>
      </div>`},M=(E,I)=>{let j=this.inspect.kind==="group"&&this.inspect.id===E.id,W=!this.collapsed.has(E.id),q=this.rowDrag(E.id,i),P=I[0],_=I[I.length-1],R=x=>{let S=x.currentTarget,F=S.getBoundingClientRect(),O=F.top+(S.classList.contains("drop-before")?Bt:0),K=F.bottom-(S.classList.contains("drop-after")?Bt:0),J=(x.clientY-O)/Math.max(1,K-O);return J<.25?"drop-before":!W&&J>.75?"drop-after":"drop-into"},X=I.map(x=>x.payload.id);return h`<div class="layer group ${j?"hl":""} ${C?"rich":""}" style=${`--k:${te.group}`} tabindex="0" draggable=${q.draggable}
        @pointerenter=${()=>{this.listHoverIds=X}}
        @pointerleave=${()=>this.leaveRow(X)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:E.id}}}
        @keydown=${x=>{x.key==="Enter"&&(this.inspect={kind:"group",id:E.id})}}
        @dragstart=${q.onStart} @dragend=${q.onEnd}
        @dragover=${x=>{!this.dragId||this.dragId===E.id||(x.preventDefault(),this.markDrop(x.currentTarget,R(x)))}}
        @drop=${x=>{x.preventDefault();let S=R(x);this.clearDragMarks();let F=this.dragId;if(this.dragId=void 0,!(!F||!P||!_)){if(S==="drop-before"){this.reorderLayer(F,P.payload.id,!0,!0);return}if(S==="drop-after"){this.reorderLayer(F,_.payload.id,!1,!0);return}this.isGroupId(F)||(this.reorderLayer(F,P.payload.id,!0),this.mutate(O=>Zi(O,F,E.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${U("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${U("folder")}</span>
        <span class="name">
          <b>${E.name}</b>
          <small><span class="kind">Group</span> · ${I.length} layer${I.length===1?"":"s"} · ${E.locked?"locked":"unlocked"}</small>
          ${C?h`<span class="facts"><span class="fact"><b>Holds</b> ${I.map(x=>He(x,d)).join(", ")}</span></span>`:f}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${td}${bn}G)`} aria-label="Ungroup" @click=${x=>{x.stopPropagation(),this.mutate(S=>fi(S,E.id)),j&&(this.inspect={kind:"general"})}}>${U("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${E.locked?"on":""}" ?disabled=${!i}
            title=${E.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${E.locked?"Unlock the group":"Lock the group"}
            @click=${x=>{x.stopPropagation(),this.mutate(S=>{let F=S.groups?.find(O=>O.id===E.id);F&&(F.locked=!F.locked)})}}>${U(E.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${W?"true":"false"} title=${W?"Fold the group":"Unfold the group"}
            @click=${x=>{x.stopPropagation();let S=new Set(this.collapsed);W?S.add(E.id):S.delete(E.id),this.collapsed=S}}>${U("chevron")}</button>
        </span>
      </div>`},H=[],A=new Set;for(let E=0;E<l.length;E++){let I=l[E],j=I.payload.groupId,W=j===void 0?void 0:t.groups?.find(_=>_.id===j);if(!W){H.push(L(I,!1));continue}if(A.has(W.id))continue;A.add(W.id);let q=l.filter(_=>_.payload.groupId===W.id);H.push(M(W,q));let P=this.inspect.kind==="group"&&this.inspect.id===W.id;this.collapsed.has(W.id)||H.push(h`<div class="group-kids">${q.map(_=>L(_,!0,P))}</div>`)}return h`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${$}px;--thumb-h:${k}px`}>
      <h2 class="panel-title tools" style=${`--c:${te.place}`}><span class="swatch">${U("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([E,I])=>h`
              <button class=${this.layerDetail===E?"on":""} title=${I} aria-label=${I} aria-pressed=${this.layerDetail===E?"true":"false"}
                @click=${()=>{this.layerDetail=E,this.saveListView()}}>${U(E)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${Rw.map((E,I)=>h`
              <button class=${this.thumbStep===I?"on":""} title=${`${Im[I]} row pictures`}
                aria-label=${`${Im[I]} row pictures`} aria-pressed=${this.thumbStep===I?"true":"false"}
                @click=${()=>{this.thumbStep=I,this.saveListView()}}>${E}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?h`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${bn}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${Aa}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:f}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:f}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${H}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${te.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${E=>{E.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${E=>{this.dragId&&(E.preventDefault(),this.markDrop(E.currentTarget,"drop-before"))}}
        @drop=${E=>{E.preventDefault(),this.clearDragMarks();let I=this.dragId,j=[...l].reverse().find(W=>W.payload.id!==I&&W.payload.groupId!==I);I&&j&&this.reorderLayer(I,j.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${U("shape")}</span>
        <span class="bar"></span>
        ${w([])}
        <span class="name">
          <b>${ne(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${m}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${U("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?sm(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?f:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${Ct(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Mm,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=cm(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=xi(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          <div class="bar-row shapes">${this.renderShapeTabs(t,i)}</div>
          <div class="bar-row tools">
          <span class="inbox" title=${`Layouts are made in the ${ki.label} box. Smaller cases scale it down.`}>
            <span class="pre">Preview as</span>
            <span class="case-tool" data-menu="case">
              <button class="case-pick" aria-haspopup="listbox" aria-expanded=${this.openMenu==="case"?"true":"false"}
                aria-label=${`Preview as ${a.label}`} @click=${()=>this.toggleMenu("case")}>
                ${a.label}${a.measured?"":" (estimated)"}${U("chevron")}
              </button>
              ${this.openMenu==="case"?h`<div class="pop-menu" role="listbox" aria-label="Preview as">
                ${ca.map(o=>h`<button class="row" role="option" aria-selected=${o.label===a.label?"true":"false"}
                  @click=${()=>{this.toggleMenu("case",!1),this.previewCase=o.label}}>${o.label}${o.measured?"":" (estimated)"}</button>`)}
              </div>`:f}
            </span>
          </span>
          ${r==="inline"?f:this.renderTintTool()}
          <span class="bar-sep" aria-hidden="true"></span>
          <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderGridButton()}</span>
          <span class="spacer"></span>
          ${this.renderZoomButton()}
          </div>
        </div>
        <div class="stage">
          ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):f}
      </div>
      <div class="under-grid">
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?at(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||at(s,o)?.locked)?dt(s,l).map(b=>b.payload.id):[],c=[...new Set([...d,...this.multi])],u=a.slots[t],p=this.focusTapId(),m=!this.picking&&!this.showTaps&&this.rowHoverId!==void 0&&s?.elements.some(b=>b.payload.id===this.rowHoverId)?this.rowHoverId:void 0,g=m!==void 0?[]:this.listHoverIds,y={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??m??o,...c.length>0&&!this.showTaps&&m===void 0?{highlightIds:c}:{},...this.showGridLines&&(this.snapGrid||this.altHeld&&this.canEdit)?{grid:this.gridStep}:{},tapReview:this.showTaps,...this.previewTint!==void 0?{tint:this.previewTint}:{},...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:g.length>0?{hoverIds:g}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${b=>this.onPreviewPointerDown(t,b)}
      @pointermove=${b=>this.onPickMove(b)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Ir(r,y)}
    </div>`}renderUnder(t,i){let a=me(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(u=>u.payload.id===r.id):void 0,s;if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${_t(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let u=t.groups?.find(m=>m.id===r.id),p=u?dt(t,u.id).length:0;s=u?h`editing group <b>${u.name}</b>. Drag to move all ${p} layers.${u.locked?"":" Click one layer to move it alone."}`:""}else if(o){let u=at(t,o.payload.id);s=u?.locked?h`editing <b>${He(o,a)}</b> in <b>${u.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${He(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid?" It snaps to the grid. Hold Alt to drag freely.":" Hold Alt while dragging to snap to the grid."}`}else s="click a layer to edit it";if(i==="inline")return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let l=this.currentCase().slots[i],d=Hr(l,i),c=Math.round(d.scale*100);return h`<div class="under">
      <b>${ne(i)}</b>
      <span class="size">${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?bi((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??f}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(){let t=this.draft?.config;if(!t)return f;let i=t.values,a=this.canEdit?h`<button class="small" @click=${()=>{let c=Oh();this.mutate(u=>{u.values.push(c)}),this.openSharedValue(c.id)}}>Add</button>`:f,r="Like a variable: set it once, and every layer that reads it follows.",o=h`<h2 class="panel-title"><span class="swatch">${U("content")}</span>Shared values
        <span class="mini" title=${r}>set once, used by many layers</span>
        <button type="button" class="sec-help ${this.sharedHelp?"on":""}" title=${this.sharedHelp?"Hide how shared values work":"How shared values work"}
          aria-label="How shared values work" aria-expanded=${this.sharedHelp?"true":"false"}
          @click=${()=>{this.sharedHelp=!this.sharedHelp}}>?</button>
        <span class="spacer"></span>${a}
      </h2>
      ${this.sharedHelp?h`<div class="shared-help">
        <p>${r} Use one when several layers show the same thing, so a change is made in one place.</p>
        <ol>
          <li><b>Add</b> one here. Give it a name and choose its source, like an entity.</li>
          <li>On a layer, open its value and set <b>Source</b> to <b>Shared value</b>. Or click <b>Make shared</b> on a value that is already set up.</li>
          <li>Change the shared value here. Every layer that reads it changes too.</li>
          <li>Each layer can still add its own <b>Format</b>, like a unit or fewer decimals.</li>
        </ol>
      </div>`:f}`;if(i.length===0)return h`<div class="card tint-values values-list ${this.sharedHelp?"":"empty-list"}" style=${`--c:${te.complication}`}>
        ${o}
      </div>`;let s=this.host(),l=new vt(this.buildContext(),this.draft?.config),d=me(s);return h`<div class="card tint-values values-list" style=${`--c:${te.complication}`}>
      ${o}
      <div class="data">
      ${i.map(c=>{let u=l.resolve({kind:{kind:"named",id:c.id}}),p=this.openValue===c.id,m=()=>{this.setOpenValue(p?void 0:c.id)};return h`<div class="vitem ${p?"open":""}"><div class="datum vrow ${p?"hl":""}" role="button" tabindex="0" aria-expanded=${p?"true":"false"}
            title=${p?"Close":"Edit this shared value"}
            @click=${m}
            @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&g.target===g.currentTarget&&(g.preventDefault(),m())}}>
          <span class="nm">${c.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${u===void 0?"none":""}" title=${Me(c.value,d)}>${u??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(y=>{Ts(y,c.id)}),p&&(this.openValue=void 0)}}>${U("delete")}</button>`:f}
        </div>
        ${p?h`<div class="value-open">${Dh(s,c)}</div>`:f}</div>`})}
      </div>
    </div>`}setOpenValue(t){let i=this.openValue;if(this.openValue=t,i===void 0||i===t)return;let a=this.draft?.config.values.find(r=>r.id===i);a&&a.name.trim()===""&&this.mutate(r=>{Ts(r,i)})}openSharedValue(t){this.renderRoot.querySelectorAll(":popover-open").forEach(a=>a.hidePopover()),this.setOpenValue(t);let i=this.draft?.config.values.find(a=>a.id===t)?.name.trim()==="";this.updateComplete.then(()=>{this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({block:"start",behavior:"smooth"}),i&&this.renderRoot.querySelector(".values-list .value-open input[type=text]")?.focus({preventScroll:!0})})}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies,r=ln.filter(o=>!a.includes(o));return h`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderHaveTabs(t,i)}</div>
      ${r.length>0?h`<span class="shape-adds">${r.map(o=>h`<button class="tab off ${o}" ?disabled=${!this.canEdit}
        title=${`Add the ${ne(o)} shape`} @click=${()=>this.addShape(o)}>${U("plus")}${ne(o)}</button>`)}</span>`:f}`}renderHaveTabs(t,i){let a=t.supportedFamilies;return ln.filter(r=>a.includes(r)).map(r=>{let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?Ir(c,{icons:this.icons,imageSizes:this.imageSizes,slot:ki.slots[r]}):f}let l=r!=="inline"&&bo(t,r)===0&&t.elements.length>0,d=this.canEdit&&Lr(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${ne(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${ne(r)}</span>${l?h`<small>nothing shown</small>`:f}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!d}
          title=${d?`Remove the ${ne(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${ne(r)} shape`}
          @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${U("delete")}</button>`:f}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return f;let i=[...this.compiled?.entities.keys()??[]],a=eu(t),r=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${te.states}`}>
      <h2 class="panel-title"><span class="swatch">${U("states")}</span>Values on the watch
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${r?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.editingValue=void 0,this.applyTestValues(new Map)}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0&&a.length===0?h`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:h`<div class="chips values">
        ${i.map(o=>{let s=this.hass.states[o],l=typeof s?.attributes.friendly_name=="string"?s.attributes.friendly_name:o,d=typeof s?.attributes.unit_of_measurement=="string"?` ${s.attributes.unit_of_measurement}`:"",c=s?`${s.state}${d}`:"not in Home Assistant",u=this.testValues.get(o),m=t.elements.find(g=>yr(t,g.payload.id).some(y=>y.ref.entityId===o))?.kind??"text";return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${Xe[m]}`}
            title=${u!==void 0?`Live value: ${c}`:""}>
            <span class="kbar"></span><b>${l}</b><span class="spacer"></span>
            ${this.renderTestControl(o,l,s,u,d,c)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the live value: ${c}`} @click=${()=>this.setTestValue(o,void 0)}>Live</button>`:f}
          </div>`})}
        ${a.map(o=>{let s=Is(o.id),l=this.sharedRaw(o.id)??"",d=l===""?"empty":l,c=o.name||"(unnamed)",u=this.testValues.get(s),p={entity_id:s,state:l,attributes:{},last_changed:"",last_updated:""};return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${te.complication}`}
            title=${u!==void 0?`Saved value: ${d}`:""}>
            <span class="kbar"></span><b>${c}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(s,c,p,u,"",d)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the saved value: ${d}`} @click=${()=>this.setTestValue(s,void 0)}>Live</button>`:f}
          </div>`})}
      </div>`}
    </div>`}renderTestControl(t,i,a,r,o,s){let l=r??a?.state??"",d=nu(t,a,r);if(d.kind==="choice")return h`<span class="test-ctl"><select aria-label=${`Test value for ${i}`} @change=${m=>this.setTestValue(t,m.target.value)}>
        ${d.options.map(m=>h`<option value=${m} ?selected=${m===l}>${m}</option>`)}
      </select></span>`;let c=this.editingValue===t?h`<input type="text" .value=${l} aria-label=${`Test value for ${i}`}
          @keydown=${m=>{m.key==="Enter"&&m.target.blur(),m.key==="Escape"&&(this.editingValue=void 0)}}
          @blur=${m=>this.commitTestValue(t,m.target.value)} />`:h`<button type="button" class="val" title="Click to type a value"
          @click=${()=>{this.editingValue=t,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input[type=text]")?.focus())}}>${r!==void 0?`${r}${o}`:s}</button>`;if(d.kind==="text")return h`<span class="test-ctl">${c}</span>`;let u=Number(l),p=l.trim()!==""&&Number.isFinite(u)?u:d.min;return h`<span class="test-ctl">
      <input type="range" min=${d.min} max=${d.max} step=${d.step} .value=${String(p)}
        aria-label=${`Slide the test value for ${i}`}
        @input=${m=>this.setTestValue(t,m.target.value,`test-${t}`)}
        @change=${()=>this.draft?.endGesture()} />
      ${c}
    </span>`}commitTestValue(t,i){this.editingValue=void 0,this.setTestValue(t,i)}setTestValue(t,i,a){let r=i?.trim()??"",o=new Map(this.testValues),s=t.startsWith(wr)?this.sharedRaw(t.slice(wr.length)):this.hass.states[t]?.state;r===""||r===s?o.delete(t):o.set(t,r),this.applyTestValues(o,a)}sharedRaw(t){let i=this.draft?.config;if(!i)return;let a=this.buildContext(!1),r=a.namedValues.map(o=>({...o,value:{kind:o.value.kind}}));return new vt({...a,namedValues:r},i).resolve({kind:{kind:"named",id:t}})}applyTestValues(t,i){let a=this.draft;!a||t.size===a.testValues.size&&[...t].every(([o,s])=>a.testValues.get(o)===s)||(a.setTestValues(t,i),this.version++)}currentCase(){return ca.find(t=>t.label===this.previewCase)??ki}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":ne(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${te.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=f,d=f;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${i} layers</span></span>`;else if(a.kind==="layer"){let c=t.elements.find(u=>u.payload.id===a.id);if(c){l=h`<span class="here" style=${`--k:${Xe[c.kind]}`} title=${He(c,me(this.host()))}><span class="kchip">${dn[c.kind]}</span></span>`;let u=at(t,c.payload.id);u&&(d=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(u=>u.id===a.id);c&&(l=h`<span class="here" style=${`--k:${te.group}`} title=${c.name}><span class="kchip">Group</span></span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${d}
      ${l===f?f:h`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}complicationHead(t){let i=t.name.trim()||"Complication";return h`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${te.complication}`}>${i}</span></div>
      <span class="comp-acts">
        <button class="ghost" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?h`
          <button class="ghost" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?h`<button class="ghost danger" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="ghost" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:h`<button class="ghost danger" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </span>
    </div>`}renderInspector(){let t=this.draft?.config;if(!t)return f;let i=this.pickedElements(t);if(i.length>=2)return h`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=this.canEdit?"":"pointer-events:none;opacity:.6";if(r.kind==="general")return h`
        ${this.complicationHead(t)}
        <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>
          ${Se(a,"complication","Complication",Ph(a),{color:te.complication,icon:"watch",alwaysOpen:!0})}
          <p class="insp-note">Click a layer on the watch or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>
        </div>`;let s=f,l=!0;if(r.kind==="layer"){let c=t.elements.find(u=>u.payload.id===r.id);if(!c)return this.inspect={kind:"general"},f;s=Kh(a,c,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let c=t.groups?.find(u=>u.id===r.id);if(!c)return this.inspect={kind:"general"},f;l=!1,s=Xh(a,c)}else s=Jh(a,this.activeFamily);let d=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?h`<button class="expand" @click=${()=>{this.openSections=d?new Set([Ew(r)]):new Set(Il)}}>${d?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${s}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:f}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=me(r),s=new vt(this.buildContext(),this.draft?.config),l=Vh(t,a,i),d=i.length,c=[...i].reverse(),u=m=>this.mutate(g=>{for(let y of i)ke(g,a,y.payload.id,{isHidden:m})}),p=m=>this.mutate(g=>{for(let y of i){let b=g.elements.find($=>$.payload.id===y.payload.id);b&&b.kind!=="image"&&b.kind!=="tap"&&b.kind!=="timeline"&&b.kind!=="chartTimes"&&b.kind!=="chartDots"&&b.kind!=="chartGrid"&&b.kind!=="imageTime"&&(b.payload.colorSlot.baseColorHex=m)}},"multi-colour");return h`
      ${Se(r,"picked",`${d} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${c.map(m=>h`<div class="row" style=${`--k:${Xe[m.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${m.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(m.payload.symbol)??"questionmark",16,m.payload.colorSlot.baseColorHex)??f}</span>`:f}
                  <b>${He(m,o)}</b><span class="kind">${dn[m.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${bn}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${Aa}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${d}`,alwaysOpen:!0})}
      ${Se(r,"picked-common",`All ${d} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${ye("Colour",l.colour,m=>{m!==void 0&&p(m)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:f}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${ne(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:te.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return f;let i=this.records.find(r=>r.id===this.selectedId),a=up({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?h` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?h`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:f}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?h`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:f}
      </div>
    </details>`}};D([si({attribute:!1})],N.prototype,"hass",2),D([si({type:Boolean})],N.prototype,"narrow",2),D([si({attribute:!1})],N.prototype,"panel",2),D([B()],N.prototype,"colLeft",2),D([B()],N.prototype,"colRight",2),D([B()],N.prototype,"panelWidth",2),D([B()],N.prototype,"owners",2),D([B()],N.prototype,"ownerId",2),D([B()],N.prototype,"records",2),D([B()],N.prototype,"selectedId",2),D([B()],N.prototype,"draft",2),D([B()],N.prototype,"readOnlyReason",2),D([B()],N.prototype,"parseError",2),D([B()],N.prototype,"maxSchemaVersion",2),D([B()],N.prototype,"presets",2),D([B()],N.prototype,"occupied",2),D([B()],N.prototype,"serverToken",2),D([B()],N.prototype,"appliedToken",2),D([B()],N.prototype,"sendStatusKnown",2),D([B()],N.prototype,"polling",2),D([B()],N.prototype,"lastPollSeconds",2),D([B()],N.prototype,"sendPending",2),D([B()],N.prototype,"pages",2),D([B()],N.prototype,"templateResults",2),D([B()],N.prototype,"historySeries",2),D([B()],N.prototype,"historyReadings",2),D([B()],N.prototype,"templateError",2),D([B()],N.prototype,"templateFetchedAt",2),D([B()],N.prototype,"forced",2),D([B()],N.prototype,"showRaw",2),D([B()],N.prototype,"inspect",2),D([B()],N.prototype,"openSections",2),D([B()],N.prototype,"helpSections",2),D([B()],N.prototype,"pickerOpen",2),D([B()],N.prototype,"pickerFilter",2),D([B()],N.prototype,"pickerNote",2),D([B()],N.prototype,"pickerHiddenOpen",2),D([B()],N.prototype,"pickerConfirmDelete",2),D([B()],N.prototype,"openValue",2),D([B()],N.prototype,"sharedHelp",2),D([B()],N.prototype,"editingValue",2),D([B()],N.prototype,"thumbStep",2),D([B()],N.prototype,"layerDetail",2),D([B()],N.prototype,"addOpen",2),D([B()],N.prototype,"addDetail",2),D([B()],N.prototype,"multi",2),D([B()],N.prototype,"copiedPosition",2),D([B()],N.prototype,"snapGrid",2),D([B()],N.prototype,"gridStep",2),D([B()],N.prototype,"showGridLines",2),D([B()],N.prototype,"openMenu",2),D([B()],N.prototype,"altHeld",2),D([B()],N.prototype,"collapsed",2),D([B()],N.prototype,"activeFamily",2),D([B()],N.prototype,"picking",2),D([B()],N.prototype,"pickHoverId",2),D([B()],N.prototype,"listHoverIds",2),D([B()],N.prototype,"rowHoverId",2),D([B()],N.prototype,"zoomed",2),D([B()],N.prototype,"helpOpen",2),D([B()],N.prototype,"showTaps",2),D([B()],N.prototype,"savedName",2),D([B()],N.prototype,"presetKind",2),D([B()],N.prototype,"presetEntity",2),D([B()],N.prototype,"newOpen",2),D([B()],N.prototype,"newName",2),D([B()],N.prototype,"newFamily",2),D([B()],N.prototype,"shareOpen",2),D([B()],N.prototype,"shareMode",2),D([B()],N.prototype,"shareLabels",2),D([B()],N.prototype,"shareNote",2),D([B()],N.prototype,"importOpen",2),D([B()],N.prototype,"importText",2),D([B()],N.prototype,"importParse",2),D([B()],N.prototype,"importName",2),D([B()],N.prototype,"importMap",2),D([B()],N.prototype,"importDrop",2),D([B()],N.prototype,"shareLink",2),D([B()],N.prototype,"helpTab",2),D([B()],N.prototype,"linkNote",2),D([B()],N.prototype,"previewCase",2),D([B()],N.prototype,"previewTint",2),D([B()],N.prototype,"loadError",2),D([B()],N.prototype,"saveError",2),D([B()],N.prototype,"saving",2),D([B()],N.prototype,"conflict",2),D([B()],N.prototype,"remoteRevision",2),D([B()],N.prototype,"confirmDelete",2),D([B()],N.prototype,"moveTarget",2),D([B()],N.prototype,"moving",2),D([B()],N.prototype,"moveError",2),D([B()],N.prototype,"version",2);var ad=N;function St(e){return String(e?.message??e)}function Pw(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function Dm(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function Nw(e,n,t,i){let a=[{label:"Shows",value:Nl(e,t)}],r=lo(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function Dw(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function Ow(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Ie(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=_n(e.payload)??zn(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Ye(o).length} values`}case"timeline":{let r=bt(e.payload),o=r===void 0?[]:oa(t.get(r)??""),s=Math.max(0,o.length-1);return`${Dw(lt(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Ie(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return e.payload.contentMode==="fill"?"fill":"fit";case"tap":return _t(e.payload.action);case"chartTimes":return`${e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt`;case"chartDots":return`${e.payload.dots==="all"?"every reading":"auto"}${e.payload.size===void 0?"":` \xB7 ${e.payload.size} pt`}`;case"chartGrid":return`${e.payload.lines} ${e.payload.lines===1?"line":"lines"} \xB7 ${e.payload.thickness} pt`;case"imageTime":return}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",ad);export{ad as WristAssistantPanel,Nm as columnFit,Nw as layerFacts};
