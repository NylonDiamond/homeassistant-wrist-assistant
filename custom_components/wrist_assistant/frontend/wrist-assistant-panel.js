var vo=Object.defineProperty;var bo=Object.getOwnPropertyDescriptor;var A=(e,t,n,i)=>{for(var r=i>1?void 0:i?bo(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(r=(i?o(t,n,r):o(r))||r);return i&&r&&vo(t,n,r),r};var Mt=globalThis,Lt=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,wn=Symbol(),Ri=new WeakMap,dt=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==wn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Lt&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=Ri.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ri.set(n,t))}return t}toString(){return this.cssText}},re=e=>new dt(typeof e=="string"?e:e+"",void 0,wn),$n=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,r,a)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[a+1],e[0]);return new dt(n,e,wn)},Ii=(e,t)=>{if(Lt)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),r=Mt.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=n.cssText,e.appendChild(i)}},kn=Lt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return re(n)})(e):e;var{is:xo,defineProperty:wo,getOwnPropertyDescriptor:$o,getOwnPropertyNames:ko,getOwnPropertySymbols:Co,getPrototypeOf:So}=Object,_t=globalThis,Ai=_t.trustedTypes,Eo=Ai?Ai.emptyScript:"",To=_t.reactiveElementPolyfillSupport,ct=(e,t)=>e,pt={toAttribute(e,t){switch(t){case Boolean:e=e?Eo:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},zt=(e,t)=>!xo(e,t),Mi={attribute:!0,type:String,converter:pt,reflect:!1,useDefault:!1,hasChanged:zt};Symbol.metadata??=Symbol("metadata"),_t.litPropertyMetadata??=new WeakMap;var $e=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Mi){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(t,i,n);r!==void 0&&wo(this.prototype,t,r)}}static getPropertyDescriptor(t,n,i){let{get:r,set:a}=$o(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:r,set(o){let l=r?.call(this);a?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Mi}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;let t=So(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){let n=this.properties,i=[...ko(n),...Co(n)];for(let r of i)this.createProperty(r,n[r])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,r]of n)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let r=this._$Eu(n,i);r!==void 0&&this._$Eh.set(r,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let r of i)n.unshift(kn(r))}else t!==void 0&&n.push(kn(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ii(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:pt).toAttribute(n,i.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,n){let i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let a=i.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:pt;this._$Em=r;let l=o.fromAttribute(n,a.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,n,i,r=!1,a){if(t!==void 0){let o=this.constructor;if(r===!1&&(a=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??zt)(a,n)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:r,wrapped:a},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,a]of i){let{wrapped:o}=a,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,a,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};$e.elementStyles=[],$e.shadowRootOptions={mode:"open"},$e[ct("elementProperties")]=new Map,$e[ct("finalized")]=new Map,To?.({ReactiveElement:$e}),(_t.reactiveElementVersions??=[]).push("2.1.2");var In=globalThis,Li=e=>e,Ht=In.trustedTypes,_i=Ht?Ht.createPolicy("lit-html",{createHTML:e=>e}):void 0,Vi="$lit$",Te=`lit$${Math.random().toFixed(9).slice(2)}$`,Di="?"+Te,Fo=`<${Di}>`,Ne=document,ht=()=>Ne.createComment(""),mt=e=>e===null||typeof e!="object"&&typeof e!="function",An=Array.isArray,Ro=e=>An(e)||typeof e?.[Symbol.iterator]=="function",Cn=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zi=/-->/g,Hi=/>/g,He=RegExp(`>|${Cn}(?:([^\\s"'>=/]+)(${Cn}*=${Cn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pi=/'/g,Ni=/"/g,Bi=/^(?:script|style|textarea|title)$/i,Mn=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),u=Mn(1),C=Mn(2),Cd=Mn(3),Oe=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Oi=new WeakMap,Pe=Ne.createTreeWalker(Ne,129);function Gi(e,t){if(!An(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return _i!==void 0?_i.createHTML(t):t}var Io=(e,t)=>{let n=e.length-1,i=[],r,a=t===2?"<svg>":t===3?"<math>":"",o=ut;for(let l=0;l<n;l++){let s=e[l],d,c,p=-1,h=0;for(;h<s.length&&(o.lastIndex=h,c=o.exec(s),c!==null);)h=o.lastIndex,o===ut?c[1]==="!--"?o=zi:c[1]!==void 0?o=Hi:c[2]!==void 0?(Bi.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=He):c[3]!==void 0&&(o=He):o===He?c[0]===">"?(o=r??ut,p=-1):c[1]===void 0?p=-2:(p=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?He:c[3]==='"'?Ni:Pi):o===Ni||o===Pi?o=He:o===zi||o===Hi?o=ut:(o=He,r=void 0);let v=o===He&&e[l+1].startsWith("/>")?" ":"";a+=o===ut?s+Fo:p>=0?(i.push(d),s.slice(0,p)+Vi+s.slice(p)+Te+v):s+Te+(p===-2?l:v)}return[Gi(e,a+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},ft=class e{constructor({strings:t,_$litType$:n},i){let r;this.parts=[];let a=0,o=0,l=t.length-1,s=this.parts,[d,c]=Io(t,n);if(this.el=e.createElement(d,i),Pe.currentNode=this.el.content,n===2||n===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=Pe.nextNode())!==null&&s.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(Vi)){let h=c[o++],v=r.getAttribute(p).split(Te),g=/([.?@])?(.*)/.exec(h);s.push({type:1,index:a,name:g[2],strings:v,ctor:g[1]==="."?En:g[1]==="?"?Tn:g[1]==="@"?Fn:Xe}),r.removeAttribute(p)}else p.startsWith(Te)&&(s.push({type:6,index:a}),r.removeAttribute(p));if(Bi.test(r.tagName)){let p=r.textContent.split(Te),h=p.length-1;if(h>0){r.textContent=Ht?Ht.emptyScript:"";for(let v=0;v<h;v++)r.append(p[v],ht()),Pe.nextNode(),s.push({type:2,index:++a});r.append(p[h],ht())}}}else if(r.nodeType===8)if(r.data===Di)s.push({type:2,index:a});else{let p=-1;for(;(p=r.data.indexOf(Te,p+1))!==-1;)s.push({type:7,index:a}),p+=Te.length-1}a++}}static createElement(t,n){let i=Ne.createElement("template");return i.innerHTML=t,i}};function Je(e,t,n=e,i){if(t===Oe)return t;let r=i!==void 0?n._$Co?.[i]:n._$Cl,a=mt(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=r:n._$Cl=r),r!==void 0&&(t=Je(e,r._$AS(e,t.values),r,i)),t}var Sn=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,r=(t?.creationScope??Ne).importNode(n,!0);Pe.currentNode=r;let a=Pe.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new gt(a,a.nextSibling,this,t):s.type===1?d=new s.ctor(a,s.name,s.strings,this,t):s.type===6&&(d=new Rn(a,this,t)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(a=Pe.nextNode(),o++)}return Pe.currentNode=Ne,r}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},gt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,r){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=Je(this,t,n),mt(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==Oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ro(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ne.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ft.createElement(Gi(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(n);else{let a=new Sn(r,this),o=a.u(this.options);a.p(n),this.T(o),this._$AH=a}}_$AC(t){let n=Oi.get(t.strings);return n===void 0&&Oi.set(t.strings,n=new ft(t)),n}k(t){An(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,r=0;for(let a of t)r===n.length?n.push(i=new e(this.O(ht()),this.O(ht()),this,this.options)):i=n[r],i._$AI(a),r++;r<n.length&&(this._$AR(i&&i._$AB.nextSibling,r),n.length=r)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=Li(t).nextSibling;Li(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,r,a){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=n,this._$AM=r,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(t,n=this,i,r){let a=this.strings,o=!1;if(a===void 0)t=Je(this,t,n,0),o=!mt(t)||t!==this._$AH&&t!==Oe,o&&(this._$AH=t);else{let l=t,s,d;for(t=a[0],s=0;s<a.length-1;s++)d=Je(this,l[i+s],n,s),d===Oe&&(d=this._$AH[s]),o||=!mt(d)||d!==this._$AH[s],d===f?t=f:t!==f&&(t+=(d??"")+a[s+1]),this._$AH[s]=d}o&&!r&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},En=class extends Xe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},Tn=class extends Xe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},Fn=class extends Xe{constructor(t,n,i,r,a){super(t,n,i,r,a),this.type=5}_$AI(t,n=this){if((t=Je(this,t,n,0)??f)===Oe)return;let i=this._$AH,r=t===f&&i!==f||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==f&&(i===f||r);r&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Rn=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}};var Ao=In.litHtmlPolyfillSupport;Ao?.(ft,gt),(In.litHtmlVersions??=[]).push("3.3.3");var Ui=(e,t,n)=>{let i=n?.renderBefore??t,r=i._$litPart$;if(r===void 0){let a=n?.renderBefore??null;i._$litPart$=r=new gt(t.insertBefore(ht(),a),a,void 0,n??{})}return r._$AI(e),r};var Ln=globalThis,Fe=class extends $e{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ui(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Oe}};Fe._$litElement$=!0,Fe.finalized=!0,Ln.litElementHydrateSupport?.({LitElement:Fe});var Mo=Ln.litElementPolyfillSupport;Mo?.({LitElement:Fe});(Ln.litElementVersions??=[]).push("4.2.2");var Lo={attribute:!0,type:String,converter:pt,reflect:!1,hasChanged:zt},_o=(e=Lo,t,n)=>{let{kind:i,metadata:r}=n,a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=n;return function(l){let s=this[o];t.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function Ze(e){return(t,n)=>typeof n=="object"?_o(e,t,n):((i,r,a)=>{let o=r.hasOwnProperty(a);return r.constructor.createProperty(a,i),o?Object.getOwnPropertyDescriptor(r,a):void 0})(e,t,n)}function M(e){return Ze({...e,state:!0,attribute:!1})}var Re="wrist_assistant/complications";async function Ki(e){return e.connection.sendMessagePromise({type:`${Re}/owners`})}async function Wi(e,t){return e.connection.sendMessagePromise({type:`${Re}/list`,owner_watch_id:t})}async function qi(e,t){return e.connection.sendMessagePromise({type:`${Re}/nudge`,owner_watch_id:t})}async function ji(e,t,n,i){return e.connection.sendMessagePromise({type:`${Re}/save`,owner_watch_id:t,document:n,base_revision:i})}async function Yi(e,t,n,i){return e.connection.sendMessagePromise({type:`${Re}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function Ji(e,t,n){return e.connection.sendMessagePromise({type:`${Re}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function Xi(e,t,n){let i={type:`${Re}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function Zi(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Re}/render_values`,templates:t})).results}var X=["rectangular","circular","corner"],he={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},zo=["rectangular","circular","corner","inline"];var zn=64;function sr(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<zn;i++)if(!n.has(i))return i;return-1}function vt(e){return X.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var lr={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},oe={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},bt=6,xt=9,Ho=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function ke(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Hn(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Pn={top:0,left:0,bottom:0,right:0};function Dt(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Nn=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Ce(e){let t=Nn.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function S(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function U(e,t=""){return typeof e=="string"?e:t}function B(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function ye(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Vt(e){return e==null?void 0:B(e,0)}function yt(e){return typeof e=="string"?e:void 0}var ve=class extends Error{};function Ve(e){if(typeof e.entityId!="string")throw new ve("entityId is required");let t={entityId:e.entityId,displayName:U(e.displayName),domain:U(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function Qi(e){if(!S(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=B(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=B(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=B(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),be(t)?void 0:t}function be(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function Po(e){let t=U(e.function,"count"),n=S(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(S).map(Ve)};else{let a=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:a(n.domains),areaIds:a(n.areaIds),labelIds:a(n.labelIds),floorIds:a(n.floorIds)}}let r={function:t,scope:i};if(S(e.stateFilter)){let a=e.stateFilter.kind;a==="isOn"||a==="isOff"?r.stateFilter={kind:a}:(a==="equals"||a==="notEquals")&&(r.stateFilter={kind:a,value:U(e.stateFilter.value)})}return typeof e.attribute=="string"&&(r.attribute=e.attribute),r}function er(e){switch(e.kind){case"literal":return{kind:"literal",value:U(e.value)};case"entityState":return{kind:"entityState",...Ve(e)};case"entityAttribute":return{kind:"entityAttribute",...Ve(e),attribute:U(e.attribute)};case"entityAge":return{kind:"entityAge",...Ve(e)};case"aggregate":return{kind:"aggregate",aggregate:Po(S(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:yt(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:U(e.value)};case"named":return{kind:"named",id:U(e.id).toUpperCase()};default:throw new ve(`unknown value kind ${String(e.kind)}`)}}function te(e){if(!S(e))throw new ve("value must be an object");if(S(e.kind)){let i={kind:er(e.kind)},r=Qi(e.format);return r&&(i.format=r),i}let t={kind:er(e)},n=Qi(e.format);return n&&(t.format=n),t}function dr(e){return S(e)?{x:B(e.x,.25),y:B(e.y,.25),width:B(e.width,.5),height:B(e.height,.5),rotationDegrees:B(e.rotationDegrees,0)}:{...lr}}function No(e){if(!S(e))return{kind:"isOn"};let t=U(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=S(e.value)?te(e.value):T("");break;case"between":n.value=S(e.value)?te(e.value):T(""),n.upper=S(e.upper)?te(e.upper):T("");break;case"matchesRegex":n.pattern=U(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function tr(e){if(!S(e))return{kind:"show"};let t=U(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=S(e.value)?te(e.value):T("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=B(e.number,0);break;case"setFontWeight":n.weight=yt(e.weight)??"regular";break;default:break}return n}function cr(e){return Array.isArray(e)?e.filter(S).map(t=>{let n={id:U(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(S).map(i=>{let r=S(i.when)?i.when:{};return{id:U(i.id).toUpperCase(),when:{join:r.join==="any"?"any":"all",tests:(Array.isArray(r.tests)?r.tests:[]).filter(S).map(a=>({id:U(a.id).toUpperCase(),value:S(a.value)?te(a.value):T(""),comparison:No(a.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(tr)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(tr)),n}):[]}function Oo(e,t){return{baseColorHex:S(e)?U(e.baseColorHex,t):t}}function Qe(e,t){if(typeof e.id!="string")throw new ve("element id is required");return{id:e.id.toUpperCase(),colorSlot:Oo(e.colorSlot,t),rules:cr(e.rules),frame:dr(e.frame),isHidden:e.isHidden===!0}}function Vo(e){let t=Do(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function Do(e){if(!S(e)||!S(e.payload))throw new ve("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...Qe(t,"#FFFFFF"),value:S(t.value)?te(t.value):T(""),fontSize:B(t.fontSize,14),fontWeight:yt(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...Qe(t,"#FFFFFF"),symbol:S(t.symbol)?te(t.symbol):T("lightbulb"),size:B(t.size,14)}};case"gauge":return{kind:"gauge",payload:{...Qe(t,"#FFFFFF"),value:S(t.value)?te(t.value):T("50"),minValue:B(t.minValue,0),maxValue:B(t.maxValue,100),style:yt(t.style)??"arc",lineWidth:B(t.lineWidth,4),trackColorHex:U(t.trackColorHex,"#FFFFFF40")}};case"shape":{let n={...Qe(t,"#FFFFFF33"),kind:yt(t.kind)??"roundedRectangle",cornerRadius:B(t.cornerRadius,6),borderWidth:B(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=Qe(t,"#FFFFFF"),r={...i,entity:Ve(S(t.entity)?t.entity:{}),contentMode:t.contentMode==="fit"?"fit":"fill",zoom:B(t.zoom,1),panX:B(t.panX,0),panY:B(t.panY,0),cornerRadius:B(t.cornerRadius,bt),timestampCorner:Ho.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:B(t.timestampSize,xt)};t.timestamp===!0&&(r.timestamp=!0);let a=Vt(t.timestampX),o=Vt(t.timestampY);return a!==void 0&&o!==void 0&&Number.isFinite(a)&&Number.isFinite(o)&&(r.timestampX=ye(a),r.timestampY=ye(o)),{kind:"image",payload:r}}case"tap":{let{colorSlot:n,...i}=Qe(t,"#FFFFFF"),r={...i,action:S(t.action)?pr(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(r.openPageId=t.openPageId),typeof t.openPageName=="string"&&(r.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(r.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:r}}default:throw new ve(`unknown element kind ${String(e.kind)}`)}}function nr(e){let t=S(e)?e:{},n={};if(S(t.placements))for(let[r,a]of Object.entries(t.placements)){if(!S(a))continue;let o={frame:dr(a.frame),isHidden:a.isHidden===!0},l=Vt(a.size);l!==void 0&&(o.size=l),n[r.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:B(t.borderWidth,2),rules:cr(t.rules)};if(S(t.bezelText)&&(i.bezelText=te(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),S(t.curvedText)&&(i.curvedText=te(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),S(t.bezelGauge)){let r=t.bezelGauge,a={value:S(r.value)?te(r.value):T("50"),minValue:B(r.minValue,0),maxValue:B(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};S(r.minLabel)&&(a.minLabel=te(r.minLabel)),S(r.maxLabel)&&(a.maxLabel=te(r.maxLabel)),i.bezelGauge=a}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function Bo(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=nr(e[n+1]))}else if(S(e))for(let[n,i]of Object.entries(e))t[n]=nr(i);return t}function Go(e){let t={value:S(e.value)?te(e.value):T("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function pr(e){if(!S(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Ve(e)};default:return{type:"none"}}}function ur(e){if(!S(e))throw new ve("config must be an object");for(let a of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(a in e))throw new ve(`${a} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(S).map(a=>({id:U(a.id).toUpperCase(),name:U(a.name),value:S(a.value)?te(a.value):T("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(S).map(a=>a.kind==="template"?{kind:"template",value:U(a.value)}:a.kind==="entity"?{kind:"entity",...Ve(a)}:null).filter(a=>a!==null),i={schemaVersion:B(e.schemaVersion,1),id:U(e.id).toUpperCase(),name:U(e.name,"Custom"),values:t,slotIndex:B(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Vo),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(a=>typeof a=="string"),perFamily:Bo(e.perFamily),dataSources:n,tapAction:pr(e.tapAction)};S(e.inline)&&(i.inline=Go(e.inline));let r=Vt(e.refreshMinutes);if(r!==void 0&&(i.refreshMinutes=r),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let a=e.groups.filter(S).filter(o=>typeof o.id=="string").map(o=>({id:U(o.id).toUpperCase(),name:U(o.name,"Group"),locked:o.locked!==!1}));a.length>0&&(i.groups=a)}return Ae(i),i}function D(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function De(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Uo(e){let t={};return e.decimals!==void 0&&(t.decimals=D(e.decimals)),e.multiply!==void 0&&(t.multiply=D(e.multiply)),e.offset!==void 0&&(t.offset=D(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function Ko(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(De)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function Wo(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...De(e)};case"entityAttribute":return{kind:"entityAttribute",...De(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...De(e)};case"aggregate":return{kind:"aggregate",aggregate:Ko(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id}}}function J(e){let t={kind:Wo(e.kind)};return be(e.format)||(t.format=Uo(e.format)),t}function Nt(e){return{x:D(e.x),y:D(e.y),width:D(e.width),height:D(e.height),rotationDegrees:D(e.rotationDegrees)}}function qo(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=J(e.value??T(""));break;case"between":t.value=J(e.value??T("")),t.upper=J(e.upper??T(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function ir(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=J(e.value??T(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=D(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function Ot(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(r=>({id:r.id,value:J(r.value),comparison:qo(r.comparison)}))},then:i.then.map(ir)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(ir)),n})}function jo(e){let t=Yo(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function Yo(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:Ot(n.rules),frame:Nt(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:J(e.payload.value),fontSize:D(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:J(e.payload.symbol),size:D(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...t(e.payload),value:J(e.payload.value),minValue:D(e.payload.minValue),maxValue:D(e.payload.maxValue),style:e.payload.style,lineWidth:D(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:D(e.payload.cornerRadius),borderWidth:D(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:De(n.entity),rules:Ot(n.rules),frame:Nt(n.frame),isHidden:n.isHidden};n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=D(n.zoom)),n.panX!==0&&(i.panX=D(n.panX)),n.panY!==0&&(i.panY=D(n.panY)),n.cornerRadius!==bt&&(i.cornerRadius=D(n.cornerRadius));let r=ke(n),a=r?Hn(n.timestampX,n.timestampY):n.timestampCorner;return a!=="topLeading"&&(i.timestampCorner=a),n.timestampSize!==xt&&(i.timestampSize=D(n.timestampSize)),r&&(i.timestampX=D(n.timestampX),i.timestampY=D(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:hr(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=Ot(n.rules),i.frame=Nt(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function Jo(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let r of n){let a=e.placements[r],o={frame:Nt(a.frame)};a.isHidden&&(o.isHidden=!0),a.size!==void 0&&(o.size=D(a.size)),i[r]=o}t.placements=i}if(e.bezelText&&(t.bezelText=J(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=J(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,r={value:J(i.value),minValue:D(i.minValue),maxValue:D(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(r.minLabel=J(i.minLabel)),i.maxLabel&&(r.maxLabel=J(i.maxLabel)),t.bezelGauge=r}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=D(e.borderWidth),e.rules.length>0&&(t.rules=Ot(e.rules)),t}function hr(e){return"entityId"in e?{type:e.type,...De(e)}:{type:e.type}}function Xo(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=J(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function Bt(e){let t=[];for(let i of X){let r=e.perFamily[i];r&&t.push(i,Jo(r))}let n={schemaVersion:vt(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:J(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(jo),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...De(i)}),tapAction:hr(e.tapAction)};return e.inline!==void 0&&(n.inline=Xo(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function Be(e,t){let i=e.elements.find(r=>r.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(r=>r.id===i)}function Ie(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!ae(e,n))}function Ae(e){let t=new Set((e.groups??[]).map(r=>r.id));for(let r of e.elements)r.payload.groupId!==void 0&&!t.has(r.payload.groupId)&&delete r.payload.groupId;let n=new Set(e.elements.map(r=>r.payload.groupId).filter(r=>r!==void 0)),i=(e.groups??[]).filter(r=>n.has(r.id));i.length===0?delete e.groups:e.groups=i}function wt(e){if(!e.groups?.length)return;let t=e.elements.filter(a=>!ae(e,a)),n=e.elements.filter(a=>ae(e,a)),i=[],r=new Set;for(let a=t.length-1;a>=0;a--){let o=t[a];if(r.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),r.add(o.payload.id);continue}let s=t.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),r.add(s[d].payload.id)}e.elements=[...i,...n],Ge(e)}function mr(e,t,n="Group"){let i=e.elements.filter(a=>t.includes(a.payload.id)&&!ae(e,a));if(i.length<2)return;let r={id:j(),name:n,locked:!0};e.groups=[...e.groups??[],r];for(let a of i)a.payload.groupId=r.id;return Ae(e),wt(e),r.id}function Gt(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;Ae(e)}function fr(e,t,n){let i=e.elements.find(r=>r.payload.id===t);!i||ae(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,Ae(e),wt(e))}var O={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},rr={literal:["kind","value"],entityState:["kind",...O.entityRef],entityAttribute:["kind",...O.entityRef,"attribute"],entityAge:["kind",...O.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"]};function gr(e){let t=[],n=(s,d,c)=>{if(S(s))for(let p of Object.keys(s))d.includes(p)||t.push(`${c}.${p}`)},i=(s,d)=>{if(!S(s))return;let c=typeof s.kind=="string"?s.kind:"";n(s,rr[c]??["kind"],d),c==="aggregate"&&S(s.aggregate)&&(n(s.aggregate,O.aggregate,`${d}.aggregate`),n(s.aggregate.scope,O.scope,`${d}.aggregate.scope`),S(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((p,h)=>n(p,O.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(s.aggregate.stateFilter,O.stateFilter,`${d}.aggregate.stateFilter`))},r=(s,d)=>{if(S(s)){if(S(s.kind))n(s,O.value,d),i(s.kind,`${d}.kind`);else{let c=typeof s.kind=="string"?s.kind:"";n(s,[...rr[c]??["kind"],"format"],d),c==="aggregate"&&i(s,d)}n(s.format,O.format,`${d}.format`)}},a=(s,d)=>{Array.isArray(s)&&s.forEach((c,p)=>{n(c,O.styleChange,`${d}[${p}]`),S(c)&&r(c.value,`${d}[${p}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((c,p)=>{let h=`${d}[${p}]`;n(c,O.rule,h),S(c)&&(Array.isArray(c.cases)&&c.cases.forEach((v,g)=>{let x=`${h}.cases[${g}]`;n(v,O.case,x),S(v)&&(n(v.when,O.condition,`${x}.when`),S(v.when)&&Array.isArray(v.when.tests)&&v.when.tests.forEach((b,E)=>{let w=`${x}.when.tests[${E}]`;n(b,O.test,w),S(b)&&(r(b.value,`${w}.value`),n(b.comparison,O.comparison,`${w}.comparison`),S(b.comparison)&&(r(b.comparison.value,`${w}.comparison.value`),r(b.comparison.upper,`${w}.comparison.upper`)))}),a(v.then,`${x}.then`))}),a(c.otherwise,`${h}.otherwise`))})};if(!S(e))return t;n(e,O.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>n(s,O.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{n(s,O.named,`$.values[${d}]`),S(s)&&r(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let c=`$.elements[${d}]`;if(n(s,O.elementEnvelope,c),!S(s)||!S(s.payload))return;let p=typeof s.kind=="string"?s.kind:"",h=O[p]??[];n(s.payload,[...O.elementBase,...h],`${c}.payload`),n(s.payload.colorSlot,O.colorSlot,`${c}.payload.colorSlot`),n(s.payload.frame,O.frame,`${c}.payload.frame`),o(s.payload.rules,`${c}.payload.rules`);for(let v of["value","symbol"])v in s.payload&&r(s.payload[v],`${c}.payload.${v}`);p==="image"&&n(s.payload.entity,O.entityRef,`${c}.payload.entity`),p==="tap"&&n(s.payload.action,O.tapAction,`${c}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else S(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let c=`$.perFamily.${s}`;if(n(d,O.layout,c),!!S(d)){if(S(d.placements))for(let[p,h]of Object.entries(d.placements))n(h,O.placement,`${c}.placements.${p}`),S(h)&&n(h.frame,O.frame,`${c}.placements.${p}.frame`);if(r(d.bezelText,`${c}.bezelText`),r(d.curvedText,`${c}.curvedText`),S(d.bezelGauge)){let p=`${c}.bezelGauge`;n(d.bezelGauge,O.bezelGauge,p),r(d.bezelGauge.value,`${p}.value`),r(d.bezelGauge.minLabel,`${p}.minLabel`),r(d.bezelGauge.maxLabel,`${p}.maxLabel`)}o(d.rules,`${c}.rules`)}}return S(e.inline)&&(n(e.inline,O.inline,"$.inline"),r(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>n(s,O.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,O.tapAction,"$.tapAction"),t}function j(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function On(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function yr(e,t,n=[...X]){let i={};for(let a of X)n.includes(a)&&(i[a]=On());let r={schemaVersion:4,id:j(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:zo.filter(a=>n.includes(a)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(r.inline={value:T("Text")}),r.schemaVersion=vt(r),r}function $t(e){let t=n=>({id:j(),colorSlot:{baseColorHex:n},rules:[],frame:{...lr},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:T("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:T("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:T("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:bt,timestampCorner:"topLeading",timestampSize:xt}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function T(e){return{kind:{kind:"literal",value:e}}}function vr(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let r=n.placements[i.payload.id];if(!r)return i;let a={...i.payload,frame:r.frame,isHidden:r.isHidden};return r.size!==void 0&&(i.kind==="text"?a.fontSize=r.size:i.kind==="icon"?a.size=r.size:i.kind==="gauge"&&(a.lineWidth=r.size)),{kind:i.kind,payload:a}})}function Ut(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Vn(e){let t=[],n=i=>{for(let r of i)r.value&&t.push(r.value)};for(let i of e){for(let r of i.cases){for(let a of r.when.tests)t.push(a.value),a.comparison.value&&t.push(a.comparison.value),a.comparison.upper&&t.push(a.comparison.upper);n(r.then)}i.otherwise&&n(i.otherwise)}return t}var Dn=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function _n(e,t){let n,i=t;for(let r=0;i!==void 0&&r<4;r++){let a=i.kind;if("entityId"in a){if(a.entityId==="")return;let o={entityId:a.entityId,displayName:a.displayName,domain:a.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(a.kind!=="named")return;n=a.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function Bn(e,t){return _n(e,Ut(t))?.ref}function Gn(e,t){let n=Bn(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&Dn.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function ar(e,t,n){if(Dt(t)||n.width<=0||n.height<=0)return{...e};let i=t,r=e.x-i.left/n.width,a=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,l=e.y+e.height+i.bottom/n.height;return a<r&&(r=a=(r+a)/2),l<o&&(o=l=(o+l)/2),r=ye(r),a=ye(a),o=ye(o),l=ye(l),{...e,x:r,y:o,width:Math.max(0,a-r),height:Math.max(0,l-o)}}function br(e,t,n){let i=r=>Math.round(r*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function xr(e,t,n,i){let r=e.elements.find(h=>h.payload.id===t);if(!r||r.kind!=="tap"||r.payload.attachedTo===void 0)return;let a=e.elements.find(h=>h.payload.id===r.payload.attachedTo);if(!a)return;let o=e.perFamily[n]?.placements[a.payload.id]?.frame??a.payload.frame,l=ye(i.x),s=ye(i.y),d=ye(i.x+i.width),c=ye(i.y+i.height),p={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,c-s)};r.payload.outset=br(o,p,he[n])}function wr(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i)return;let r=e.perFamily[n];if(!r)return;let a=r.placements[t]?.frame??i.payload.frame,o=he[n];return{width:a.width*o.width,height:a.height*o.height}}function me(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function ae(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function Un(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(r=>r.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function Ge(e){let t=new Map(e.elements.map(r=>[r.payload.id,r])),n=new Map;for(let r of e.elements){if(r.kind!=="tap")continue;let a=r.payload.attachedTo;if(a===void 0)continue;let o=t.get(a);if(!o||o.kind==="tap"||a===r.payload.id){delete r.payload.attachedTo;continue}let l=n.get(a);l?l.push(r):n.set(a,[r])}if(n.size===0)return;for(let[r,a]of n){let o=t.get(r);for(let l of a){let s=l.payload;s.outset===void 0&&(s.outset=br(o.payload.frame,s.frame,he.rectangular));let d=s.outset,c=!Dt(d);l.payload.frame=ar(o.payload.frame,d,he.rectangular),l.payload.isHidden=o.payload.isHidden;for(let p of X){let h=e.perFamily[p];if(!h)continue;let v=he[p],g=h.placements[r];if(c){let x=g?.frame??o.payload.frame,b=g?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:ar(x,d,v),isHidden:b}}else g?h.placements[l.payload.id]={frame:{...g.frame},isHidden:g.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let r of e.elements){if(r.kind==="tap"&&r.payload.attachedTo!==void 0)continue;i.push(r);let a=n.get(r.payload.id);a&&i.push(...a)}e.elements=i}function Kt(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind==="tap")return;let r=me(e,t)[0];if(r)return r.payload;let a=$t("tap"),o=a.payload;return o.attachedTo=t,o.outset={...Pn},o.action=n??Gn(e,i),e.elements.push(a),Ge(e),o}function Kn(e,t){let n=me(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of X)for(let r of n)delete e.perFamily[i]?.placements[r]}}function $r(e,t){Kn(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of X)delete e.perFamily[n]?.placements[t];Ge(e),Ae(e)}function kr(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),i=e.elements[n];if(!i)return;let r=j(),a=structuredClone(i);a.payload.id=r,a.payload.frame={...a.payload.frame,x:Math.min(.9,a.payload.frame.x+.05),y:Math.min(.9,a.payload.frame.y+.05)};let o=[a],l=[[t,r]];for(let s of me(e,t)){let d=structuredClone(s);d.payload.id=j(),d.payload.attachedTo=r,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let s of X){let d=e.perFamily[s];if(d)for(let[c,p]of l){let h=d.placements[c];h&&(d.placements[p]=structuredClone(h))}}return Ge(e),r}function Wt(e,t){let n=e.elements.find(a=>a.payload.id===t);if(!n)return[];let i=[],r=_n(e,Ut(n));if(r){let a=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(r.namedId===void 0?{where:a,ref:r.ref}:{where:a,ref:r.ref,namedId:r.namedId})}for(let a of me(e,t)){let o=a.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:a.payload.id})}for(let a of n.payload.rules)for(let o of a.cases)for(let l of o.when.tests){let s=_n(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:a.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function or(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function Cr(e,t,n){let i=e.elements.find(a=>a.payload.id===t);if(!i||n.entityId==="")return;let r={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=r;else if(i.kind==="text"||i.kind==="gauge"){let a=or(i.payload.value,r,i.kind);a&&(i.payload.value=a)}else if(i.kind==="icon"){let a=or(i.payload.symbol,r,i.kind);a&&(i.payload.symbol=a)}for(let a of me(e,t)){let o=a.payload;"entityId"in o.action&&(o.action={type:o.action.type,...r})}}var qt={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Sr=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Ue(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function jt(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Wn(){return{id:j(),value:T(""),comparison:{kind:"isOn"}}}function qn(){return{id:j(),when:{join:"all",tests:[Wn()]},then:[]}}function kt(){return{id:j(),cases:[qn()]}}function jn(e,t){let n={kind:t};switch(Ue(t)){case"value":n.value=e.value??T("");break;case"between":n.value=e.value??T(""),n.upper=e.upper??T("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function Ke(e){let t={kind:e};switch(jt(e)){case"value":t.value=T(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function Er(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Tr(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function Rr(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,r=0xffffffffffffffffn;for(let a of t)n^=BigInt(a),n=n*i&r;return n.toString(16)}function Ir(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function Fr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Jn(e,t,n=0){let i=t instanceof Map?t:Ir(t),r=e.kind;if(r.kind==="named"){if(n>8)return;let o=i.get(r.id.toUpperCase());return o?o.kind.kind==="named"?Jn(o,i,n+1):Fr(o.kind)?"n_"+r.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Fr(r))return;let a=Yn(r);if(a!==void 0)return"e_"+Rr(a)}function fe(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Zo(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>fe(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))t=o.length===0?"[]":"("+o.map(p=>`(states.${p} | list)`).join(" + ")+")";else{let p=[];for(let h of l)p.push(`area_entities(${fe(h)})`);for(let h of s)p.push(`label_entities(${fe(h)})`);d.length>0&&p.push(`((${d.map(h=>`floor_areas(${fe(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${p.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(fe).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${fe(i.value)})`:n+=` | rejectattr('state', 'eq', ${fe(i.value)})`),e.function==="count")return`(${n} | list | count)`;let r=e.attribute?`attributes.${e.attribute}`:"state",a=`${n} | map(attribute=${fe(r)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${a} | sum)`;case"average":return`(${a} | average(0))`;case"min":return`(${a} | min(default=0))`;case"max":return`(${a} | max(default=0))`}}function Yn(e){switch(e.kind){case"entityAttribute":return`state_attr(${fe(e.entityId)}, ${fe(e.attribute)})`;case"entityAge":{let t=fe(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Zo(e.aggregate);default:return}}function Xn(e){let t=new Map,n=new Map,i=Ir(e.values),r=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){r(d,l+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let c=Yn(d.kind);if(c===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=Yn(s);if(d===void 0)return;n.set("e_"+Rr(d),d)}}};for(let o of e.values)r({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Ut(o);l&&r(l);for(let s of Vn(o.payload.rules))r(s)}for(let o of X){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&r(l.bezelText),l.curvedText&&r(l.curvedText),l.bezelGauge&&(r(l.bezelGauge.value),l.bezelGauge.minLabel&&r(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&r(l.bezelGauge.maxLabel));for(let s of Vn(l.rules))r(s)}}e.supportedFamilies.includes("inline")&&e.inline&&r(e.inline.value);let a={entities:t,expressions:n};return n.size>0&&(a.document=Qo(n)),a}function Qo(e){let t=[...e.keys()].sort(),n=[];for(let r of t){let a=e.get(r);a.includes("{{")||a.includes("{%")?n.push(`{% set v_${r} %}${a}{% endset %}`):n.push(`{% set v_${r} = ${a} %}`)}let i=t.map(r=>`"${r}": v_${r}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function Ar(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[r,a]of Object.entries(t))a===null?i.add(r):n.set(r,es(a));return{values:n,nullKeys:i}}function es(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Zn(e){let t=Xn(e),n=[...t.entities.entries()].sort(([i],[r])=>i<r?-1:i>r?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function Yt(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function et(e){let t=e.trim(),n=Yt(t);if(n!==void 0)return n;let i="";for(let a of t)if(/\p{N}/u.test(a)||a==="."||a==="-"||a==="+")i+=a;else if(i.length>0)break;return i.length===0?void 0:Yt(i)}function ts(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function ns(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function is(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function rs(e,t,n){if(be(t))return e;let i=t,r=e,a=Yt(e.trim());if(i.relativeTime&&a!==void 0)r=ns(a);else{let o=et(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?r=l.toFixed(Math.max(0,i.decimals)):l!==o&&(r=Number.isInteger(l)?String(l):ts(l))}}switch(i.useEntityUnit&&n&&(r+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(r=i.prefix+r),i.suffix&&(r=r+i.suffix),i.textCase){case"upper":r=r.toUpperCase();break;case"lower":r=r.toLowerCase();break;case"capitalized":r=is(r);break}return r}function tt(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),r=t%60,a=o=>String(o).padStart(2,"0");return n>0?`${n}:${a(i)}:${a(r)}`:`${i}:${a(r)}`}function as(e,t,n){if(e===void 0)return 0;let i=et(e);if(i===void 0||Number.isNaN(i))return 0;let r=n-t;return r===0?0:Math.min(1,Math.max(0,(i-t)/r))}var Se=class{constructor(t){this.ctx=t;this.named=new Map(t.namedValues.map(n=>[n.id.toUpperCase(),n.value]))}dereference(t){let n=t,i=new Set,r=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;r=r&&!be(r)?r:l.format,n=l}let a={kind:n.kind};return r&&(a.format=r),a}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;default:{let r=Jn(t,this.named);i=r===void 0?void 0:this.ctx.templateResults.get(r)}}if(i!==void 0)return rs(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let r=this.resolve(t)?.trim();if(!r)return;let a=Date.parse(r);if(!Number.isFinite(a)){let o=Yt(r);a=o===void 0?NaN:o*1e3}return Number.isFinite(a)&&a>this.nowMs()?a:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?tt(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let r=et(i),a=()=>this.resolve(n.value),o=()=>{let s=a();return s===void 0?void 0:et(s)},l=s=>{let d=o();return r===void 0||d===void 0?!1:s(r,d)};switch(n.kind){case"equals":{let s=a();return s!==void 0&&i===s}case"notEquals":{let s=a();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(n.upper),c=d===void 0?void 0:et(d);if(r===void 0||s===void 0||c===void 0)return!1;let[p,h]=s<=c?[s,c]:[c,s];return r>=p&&r<=h}case"contains":{let s=a();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=a();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=a();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let r of t){let a=n?.get(r.id),o=[];if(a&&a!=="live")a==="otherwise"?o=r.otherwise??[]:o=r.cases.find(l=>l.id===a.caseId)?.then??[];else{let l=r.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:r.otherwise??[]}for(let l of o)i.set(oe[l.kind],l)}return i}liveBranches(t){let n=new Map;for(let i of t){let r=i.cases.find(a=>this.evaluateCondition(a.when));n.set(i.id,r?r.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let r=this.resolve(i.value);return r||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,r=this.applyRules(i.rules,n),a=r.get("visibility"),o=a?a.kind==="hide":i.isHidden,l=this.styleNumber(r,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(r,"opacity")??1,c={id:i.id,isHidden:o,frame:s,opacity:d};switch(t.kind){case"text":{let p=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,v={kind:"text",...c,text:this.styleText(r,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(r,"fontSize")??t.payload.fontSize,fontWeight:r.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(r,"color")??t.payload.colorSlot.baseColorHex};return p!==void 0&&(v.countdownEnd=p),v}case"icon":{let p=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...c,symbol:this.styleText(r,"icon")??p,size:this.styleNumber(r,"fontSize")??t.payload.size,colorHex:this.styleColor(r,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let p=this.styleText(r,"gaugeValue")??this.resolve(t.payload.value),h=this.styleNumber(r,"gaugeMin")??t.payload.minValue,v=this.styleNumber(r,"gaugeMax")??t.payload.maxValue;return{kind:"gauge",...c,fraction:as(p,h,v),style:t.payload.style,lineWidth:t.payload.lineWidth,colorHex:this.styleColor(r,"color")??t.payload.colorSlot.baseColorHex,trackColorHex:t.payload.trackColorHex}}case"shape":{let p={kind:"shape",...c,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,fillColorHex:this.styleColor(r,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(r,"borderWidth")??t.payload.borderWidth},h=this.styleColor(r,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(p.borderColorHex=h),p}case"image":{let p={kind:"image",...c,entityId:t.payload.entity.entityId,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};ke(t.payload)&&(p.timestampX=t.payload.timestampX,p.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(p.url=h),p}case"tap":{let p={kind:"tap",...c,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(p.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(p.attachedTo=t.payload.attachedTo),p}}}resolveLayout(t,n,i){let r=t.perFamily[n],a=vr(t,n).map(x=>this.resolveElement(x,i)),o=r?this.applyRules(r.rules,i):new Map,l={family:n,elements:a,cornerBodyShape:r?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??r?.borderWidth??2},s=this.styleText(o,"text"),d=r?.bezelCountdown&&s===void 0?this.countdownEnd(r.bezelText):void 0,c=r?.bezelCountdown?this.countdownFallbackText(r.bezelText):void 0,p=s??c??this.resolve(r?.bezelText);p!==void 0&&(l.bezelText=p),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(r?.curvedText);if(h!==void 0&&(l.curvedText=h),r?.curvedColorHex!==void 0&&(l.curvedColorHex=r.curvedColorHex),r?.bezelGauge){let x=r.bezelGauge,b=this.resolve(x.value),E=b===void 0?void 0:et(b);if(E!==void 0){let w=Math.min(x.minValue,x.maxValue),m=Math.max(x.minValue,x.maxValue),y={value:Math.min(m,Math.max(w,E)),minValue:w,maxValue:m===w?w+1:m,colorHexes:x.colorHexes},$=this.resolve(x.minLabel);$!==void 0&&(y.minLabel=$);let F=this.resolve(x.maxLabel);F!==void 0&&(y.maxLabel=F),l.bezelGauge=y}}let v=this.styleColor(o,"backgroundColor")??r?.backgroundColorHex;v!==void 0&&(l.backgroundColorHex=v);let g=this.styleColor(o,"borderColor")??r?.borderColorHex;return g!==void 0&&(l.borderColorHex=g),l}};function os(e,t){let n=new Se(t),i=e.countdown?n.countdownEnd(e.value):void 0,a={text:(e.countdown?n.countdownFallbackText(e.value):void 0)??n.resolve(e.value)??"--"};return e.label&&(a.label=e.label),e.symbol&&(a.symbol=e.symbol),i!==void 0&&(a.countdownEnd=i),a}function Mr(e,t,n){let i=new Se(t),r={};for(let a of["rectangular","circular","corner"])e.supportedFamilies.includes(a)&&(r[a]=i.resolveLayout(e,a,n));return e.supportedFamilies.includes("inline")&&e.inline&&(r.inline=os(e.inline,t)),r}var xe=he,St=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:xe,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Et=St.find(e=>e.measured);function Br(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return St.find(r=>r.screen.width===n&&r.screen.height===i)}function Xt(e,t){let n=xe[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),r=n.width*i,a=n.height*i;return{scale:i,x:(e.width-r)/2,y:(e.height-a)/2,width:r,height:a}}var ss={regular:400,medium:500,semibold:600,bold:700};function Me(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function Ct(e,t,n="#FFFFFF"){let i=Me(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function ls(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),r=(e.frame.x+e.frame.width/2)*t.width,a=(e.frame.y+e.frame.height/2)*t.height;return{x:r-n/2,y:a-i/2,w:n,h:i,cx:r,cy:a}}function ds(e,t){let n=Ct(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:tt((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,r=e.text.length*i(e.fontSize),a=r>t.w&&t.w>0?Math.max(.5,t.w/r):1,o=e.fontSize*a,l=e.text;if(t.w>0&&l.length*i(o)>t.w){let s=t.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return C`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${ss[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${l}</text>`}function cs(e,t){let n=Ct(e.colorHex,"stroke"),i=Ct(e.trackColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="bar"){let h=t.w,v=Math.max(r,h*e.fraction);return C`
      <rect x=${t.x} y=${t.cy-r/2} width=${h} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-r/2} width=${v} height=${r} rx=${r/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />`}let a=Math.min(t.w,t.h),o=Math.max(0,a/2-r/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,c=l*s,p=l*s*e.fraction;return C`
    <g transform="rotate(${d} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${c} ${l}" />
      ${e.fraction>0?C`<circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:f}
    </g>`}function ps(e,t){let n=Ct(e.fillColorHex,"fill"),i=e.borderColorHex?Me(e.borderColorHex):void 0,r=i?e.borderWidth:0,a=r/2,o=i?{stroke:i.color,"stroke-opacity":i.opacity,"stroke-width":r}:{stroke:"none","stroke-opacity":0,"stroke-width":0},l=C`fill=${n.fill} fill-opacity=${n["fill-opacity"]}
    stroke=${o.stroke} stroke-opacity=${o["stroke-opacity"]} stroke-width=${o["stroke-width"]}`;switch(e.shapeKind){case"circle":{let s=Math.min(t.w,t.h)/2-a;return C`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,s)} ${l} />`}case"capsule":{let s=Math.min(t.w,t.h)/2;return C`<rect x=${t.x+a} y=${t.y+a} width=${Math.max(0,t.w-r)} height=${Math.max(0,t.h-r)} rx=${s} ${l} />`}case"roundedRectangle":return C`<rect x=${t.x+a} y=${t.y+a} width=${Math.max(0,t.w-r)} height=${Math.max(0,t.h-r)} rx=${e.cornerRadius} ${l} />`;case"rectangle":return C`<rect x=${t.x+a} y=${t.y+a} width=${Math.max(0,t.w-r)} height=${Math.max(0,t.h-r)} ${l} />`}}function us(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return C`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let r=Ct(e.colorHex,"stroke"),a=e.size;return C`
    <rect x=${t.cx-a/2} y=${t.cy-a/2} width=${a} height=${a} rx=${a*.2}
      fill="none" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${a*.5}
      fill=${r.stroke} fill-opacity=${r["stroke-opacity"]} font-family="sans-serif">?</text>`}var ii=.25,hs=8;function ms(e,t,n,i,r,a,o,l){let s={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(a)?a:1,ii),hs),c=Math.max(e/n,t/i),p=Math.min(e/n,t/i),h=(r==="fit"?p:c)*d,v=n*h,g=i*h,x=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),b=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(v-e)/2*(1+x)+0,y:-(g-t)/2*(1+b)+0,width:v,height:g}}function Zt(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var Jt=4;function Qt(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),r=n.length*i*.578+i*.89,a=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?t.x+Jt:t.x+t.w-Jt-r,d=e.timestampCorner.startsWith("top")?t.y+Jt:t.y+t.h-Jt-a;return{x:s,y:d,w:r,h:a,size:i,label:n}}let l=(s,d,c,p)=>p>=c?d+(c-p)/2:Math.min(d+c-p,Math.max(d,s-p/2));return{x:l(t.x+e.timestampX*t.w,t.x,t.w,r),y:l(t.y+e.timestampY*t.h,t.y,t.h,a),w:r,h:a,size:i,label:n}}function fs(e,t,n){let i=n.icons,r=`imgclip-${e.id}`,a=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?Qt(e,t,Zt(new Date)):void 0,l=o?C`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,s=3,d=o&&n.timestampActiveId===e.id?C`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,v,g])=>C`<rect data-ts-corner=${h} x=${v-s/2} y=${g-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:f,c=e.url?n.imageSizes?.size(e.url):void 0,p;if(e.url&&c){let h=ms(t.w,t.h,c.width,c.height,e.contentMode,e.zoom,e.panX,e.panY);p=C`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?p=C`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:p=C`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${a} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??f}</g>`;return C`
    <defs><clipPath id=${r}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${a} /></clipPath></defs>
    <g clip-path=${`url(#${r})`}>${p}${l}</g>${d}`}function gs(e,t,n,i,r){if(!i)return f;let a=Math.min(10,t.w*.5,t.h*.5),o=r!==void 0?ys(r,t):void 0;return C`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?C`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${ei} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:a>=5?C`<g transform="translate(${t.cx-a/2} ${t.cy-a/2})" opacity="0.8">${n.render("hand.tap.fill",a,"#FFD60A")??f}</g>`:f}`}var ei=5;function ys(e,t){let n=ei*.55,i=t.w-2;if(t.h<ei*1.6||i<n*4)return;if(e.length*n<=i)return e;let r=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,r).replace(/\s+$/,"")}\u2026`}function Lr(e,t,n){if(e.isHidden&&!n.showHidden)return f;let i=n.tapReview===!0,r=n.tapAreas===!0||i,a=i?n.tapFocusId:void 0,o=a!==void 0&&e.id===a,l=a!==void 0;if(e.kind==="tap"&&!r)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return f;let s=ls(e,t),d=i&&(!l||o),c;switch(e.kind){case"text":c=ds(e,s);break;case"icon":c=us(e,s,n.icons);break;case"gauge":c=cs(e,s);break;case"shape":c=ps(e,s);break;case"image":c=fs(e,s,n);break;case"tap":c=gs(e,s,n.icons,r,d?Ce(e.action):void 0);break}let p=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*p,v=n.highlightId===e.id,g=v||n.highlightIds?.includes(e.id)===!0,x=n.handles===!0&&(!l||o),b=g?C`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,E=n.hoverId===e.id?C`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,w=C`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,m=3,y=v&&x?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([$,F,P])=>C`<rect data-handle=${$} x=${F-m/2} y=${P-m/2} width=${m} height=${m}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${$}-resize" />`):f;return C`<g data-element-id=${e.id} opacity=${h} style=${x?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${w}${c}${E}${b}${y}</g>`}function en(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function ri(e,t){return(t?23.5:34)*e}var _r=10.5;function Gr(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function zr(e,t){let n=0;for(let i of e)n+=Gr(i,t);return n}function Hr(e,t,n){let i=e.toUpperCase(),r=d=>Gr(d,n),a=.9*n,o=0;for(let d of i)o+=r(d);if(o<=t)return i;let l=0,s="";for(let d of i){if(l+r(d)+a>t)break;s+=d,l+=r(d)}return`${s.replace(/\s+$/,"")}\u2026`}function ti(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function ni(e,t,n,i){let r=ti(e,t,n),a=ti(e,t,i);return`M ${r.x} ${r.y} A ${t} ${t} 0 0 1 ${a.x} ${a.y}`}function Ur(e,t,n,i){let{dial:r}=en(e,!0),a=(i.end-i.start)*Math.PI/180;return{id:t,d:ni(r,n,i.start,i.end),length:n*a}}function vs(e,t){let n=en(e,!0);return Ur(e,t,n.dial.r,n.labelArc)}var Pr=18.5,bs=113,xs={start:-71,end:-36},Nr=104,ws=6.2,Or={start:-77,end:-30.5};function Vr(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function Dr(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),r=n-i,a=Vr(e[i]),o=Vr(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*r);return`rgb(${l(a[0],o[0])}, ${l(a[1],o[1])}, ${l(a[2],o[2])})`}var Qn=11;function $s(e,t,n){let{dial:i}=en(t,!0),r=Nr*t,a=180/(Math.PI*Nr),o=e.minLabel!==void 0?zr(e.minLabel,Qn)*a:0,l=e.maxLabel!==void 0?zr(e.maxLabel,Qn)*a:0,s=Or.start+(o>0?Math.max(0,o-1.8):0),d=Or.end-(l>0?Math.max(0,l-1.8):0),c=d-s,p=24,h=[];for(let E=0;E<p;E++){let w=s+c*E/p,m=Math.min(d,s+c*(E+1)/p+.4);h.push(C`<path d=${ni(i,r,w,m)} fill="none"
      stroke=${Dr(e.colorHexes,(E+.5)/p)} stroke-width=${ws*t}
      stroke-linecap=${E===0||E===p-1?"round":"butt"} />`)}let v=(e.value-e.minValue)/(e.maxValue-e.minValue),g=ti(i,r,s+c*v),x=1.5,b=(E,w,m,y)=>C`
    <defs><path id=${E} d=${ni(i,r,w,m)} /></defs>
    <text font-size=${Qn*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${E}" startOffset="50%" text-anchor="middle">${y}</textPath></text>`;return C`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*t} fill=${Dr(e.colorHexes,v)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?b(`${n}-gmin`,s-x-Math.max(o,3),s-x,e.minLabel):f}
    ${e.maxLabel!==void 0?b(`${n}-gmax`,d+x,d+x+Math.max(l,3),e.maxLabel):f}`}function ai(e,t){let n=e.family in xe?e.family:"rectangular",i=t.slot??xe[n],r=xe[n],a=Xt(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,l=Me(e.backgroundColorHex),s=Me(e.borderColorHex),d=e.borderWidth*a.scale;if(n==="corner"){let g=a.scale,x=!!e.bezelText||!!e.bezelGauge,b=e.curvedText??"",E=b!=="",w=en(g,x),m=ri(g,x),y=m/(r.width*g),$=w.tile.cx-m/2,F=w.tile.cy-m/2,P=`M 0 0 H ${w.quad.width-w.cornerRadius} A ${w.cornerRadius} ${w.cornerRadius} 0 0 1 ${w.quad.width} ${w.cornerRadius} V ${w.quad.height} H 0 Z`,V=f;if(e.bezelGauge)V=$s(e.bezelGauge,g,o);else if(e.bezelText){let L=vs(g,`${o}-bezel`),_=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?tt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;V=C`<defs><path id=${L.id} d=${L.d} /></defs>
        <text font-size=${_r*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${L.id}" startOffset="50%" text-anchor="middle">${Hr(_,L.length,_r*g)}</textPath></text>`}let k=f;if(E){let L=Me(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},_=Ur(g,`${o}-curved`,bs*g,xs);k=C`<defs><path id=${_.id} d=${_.d} /></defs>
        <text font-size=${Pr*g} font-weight="600" fill=${L.color} fill-opacity=${L.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${_.id}" startOffset="50%" text-anchor="middle">${Hr(b,_.length,Pr*g*.88)}</textPath></text>`}else{let L=e.borderWidth*a.scale*y,_=s?C`<circle cx=${m/2} cy=${m/2} r=${m/2-L/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${L} />`:f;k=C`<g transform="translate(${$} ${F})">
        <g clip-path=${`url(#${o})`}>
          ${l?C`<rect width=${m} height=${m} fill=${l.color} fill-opacity=${l.opacity} />`:f}
          <g data-design-box transform="scale(${a.scale*y})">
            ${e.elements.map(I=>Lr(I,r,t))}
          </g>
        </g>
        <circle cx=${m/2} cy=${m/2} r=${m/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${_}
      </g>`}return C`<svg viewBox=${`0 0 ${w.quad.width} ${w.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${w.quad.width} height=${w.quad.height}>
      <defs><clipPath id=${o}><circle cx=${m/2} cy=${m/2} r=${m/2} /></clipPath></defs>
      <path d=${P} fill="#000000" />
      ${V}
      ${k}
    </svg>`}let c=C`<rect width=${i.width} height=${i.height} />`,p=s?C`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:f,h=C`<rect width=${i.width} height=${i.height} fill="#000000" />`,v=`0 0 ${i.width} ${i.height}`;return C`<svg viewBox=${v} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${c}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?C`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:f}
      <g data-design-box transform="translate(${a.x} ${a.y}) scale(${a.scale})">
        ${e.elements.map(g=>Lr(g,r,t))}
      </g>
    </g>
    ${p}
  </svg>`}function N(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var nt=["rectangular","circular","corner","inline"];function Tt(e){return X.includes(e)}function Kr(e){return nt.filter(t=>e.supportedFamilies.includes(t))}function Wr(e){return X.find(t=>e.supportedFamilies.includes(t))}function it(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function ks(e){let t=e.elements.find(i=>i.kind==="text");return{value:t&&t.kind==="text"?structuredClone(t.payload.value):T("Text")}}function qr(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=nt.filter(n=>n===t||e.supportedFamilies.includes(n))),Tt(t)?e.perFamily[t]||(e.perFamily[t]=On()):e.inline||(e.inline=ks(e)),e.schemaVersion=vt(e)}function jr(e,t){it(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),Tt(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=vt(e))}function Yr(e,t){let n=[];if(!Tt(t)){let a=e.inline;return a&&(a.value.kind.kind==="literal"&&(a.value.kind.value===""||a.value.kind.value==="Text")&&!a.label&&!a.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let r=Object.keys(i.placements).length;return r>0&&n.push(`${r} placement${r===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var Q={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},rt={text:"Text",icon:"Icon",gauge:"Gauge",shape:"Shape",image:"Picture",tap:"Tap area"},Jr=["text","icon","gauge","shape","image","tap"],K={states:"#f9a825",tap:Q.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Xr="2.8.0";function oi(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function Cs(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function Zr(e,t=Xr){let n=oi(e),i=oi(t);return!n||!i?!1:Cs(n,i)>=0}function Qr(e,t=Xr){return`${oi(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var ea="52a9d81d0fd7";function Ss(e){return e.trim().replace(/\./g,"-")}function Es(e){return e.trim().replace(/-/g,".")}var tn=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>Es(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let r=Ss(t),a=this.cache.get(r);if(a===void 0){this.fetch(r);return}if(a===null||!a.path)return;let o=Me(i)??{color:"#FFFFFF",opacity:1},l=a.viewBox??"0 0 24 24";return C`<svg x="0" y="0" width=${n} height=${n} viewBox=${l}>
      <path d=${a.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},si=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let r=this.icons.get(t.trim());if(!r)return;let a=Me(i)??{color:"#FFFFFF",opacity:1};return C`<svg x="0" y="0" width=${n} height=${n} viewBox=${r[1]}>
      <path d=${r[0]} fill=${a.color} fill-opacity=${a.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${ea}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,r]of Object.entries(n))Array.isArray(r)&&typeof r[0]=="string"&&typeof r[1]=="string"&&this.icons.set(i,[r[0],r[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function ta(e){return tn.available()?new tn(e):new si(e)}function na(e){let t=new Map,n=new Set;return{size(i){let r=t.get(i);if(r)return r;if(n.has(i))return;n.add(i);let a=new Image;a.onload=()=>{a.naturalWidth<=0||a.naturalHeight<=0||(t.set(i,{width:a.naturalWidth,height:a.naturalHeight}),e())},a.src=i}}}var rn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],an=[...new Set(rn.flatMap(e=>e.symbols))],Ts={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Fs(e){return`${e.replace(/\./g," ")} ${(Ts[e]??[]).join(" ")}`}function ia(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let r of e){let a=Fs(r);if(!n.every(l=>a.includes(l)))continue;let o=n.join(".");i.push({name:r,score:r===o?0:r.startsWith(o)?1:2})}return i.sort((r,a)=>r.score-a.score).map(r=>r.name)}var nn=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var Rs=100;function ra(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var We=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,Ge(t),this.baseline=JSON.stringify(Bt(t))}static fromDocument(t,n){return new e(ur(t),n)}get dirty(){return JSON.stringify(Bt(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Rs&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let a=structuredClone(this.config);t(a),Ge(a),this.config=a}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=Zn(t),Bt(t)}commit(){let t=structuredClone(this.config);return t.dataSources=Zn(t),new e(t,null)}};var at={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Ee={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},oa=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],sa={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},li=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Is=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function di(e){return Is.includes(e)}function As(e){return li.includes(e)}function Ms(e,t){return JSON.stringify(J(e))===JSON.stringify(J(t))}function ci(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[a,o]of t.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${a+1} checks nothing, so it always matches.`:`State ${a+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!As(s.comparison.kind))return{ok:!1,reason:`State ${a+1} uses "${at[s.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=s.value;else if(!Ms(n,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=aa(o.then);if(d)return{ok:!1,reason:`State ${a+1} sets ${Ee[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(t.otherwise){let a=aa(t.otherwise);if(a)return{ok:!1,reason:`Otherwise sets ${Ee[a]} twice. A table has one cell per column.`}}let r={ruleId:t.id,rows:i,columns:Ls(i,t.otherwise),numberMode:i.length>0&&i.every(a=>di(a.comparison.kind))};return n!==void 0&&(r.value=n),t.otherwise&&(r.otherwise=t.otherwise),{ok:!0,table:r}}function aa(e){let t=new Set;for(let n of e){let i=oe[n.kind];if(t.has(i))return i;t.add(i)}}function Ls(e,t){let n=new Set;for(let i of e)for(let r of i.changes)n.add(oe[r.kind]);for(let i of t??[])n.add(oe[i.kind]);return oa.filter(i=>n.has(i))}function la(e,t,n){let i=new Set(e);for(let r of t)i.add(r);return oa.filter(r=>i.has(r)&&n.includes(r))}function on(e,t){return e.find(n=>oe[n.kind]===t)}function da(e,t,n,i){let r=t.map(o=>({id:o.caseId??j(),when:{join:o.join??"all",tests:[{id:o.testId??j(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),a={id:i??j(),cases:r};return n&&(a.otherwise=n),a}function Ft(e){if(e.length===0)return"No states yet.";let t=ci(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function ca(e){let t=e[0];return t||(t={id:j(),cases:[]},e.push(t)),t}function pa(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function ua(e,t,n){let i=ca(e),r=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:j(),when:{join:"all",tests:[{id:j(),value:structuredClone(t),comparison:zs(r,n)}]},then:[]})}function ha(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),pa(e))}function pi(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[r]=i.splice(t,1);r&&i.splice(n,0,r)}function ui(e,t){if(t){ca(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,pa(e))}function ma(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function fa(e,t){let n=e[0];if(!n)return;let i=r=>r.filter(a=>oe[a.kind]!==t);for(let r of n.cases)r.then=i(r.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function _s(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function ga(e,t=_s){let n=()=>t(e.value??T(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??T(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Ue(e.kind)==="value"?`${at[e.kind]} ${n()}`:at[e.kind]}}function zs(e,t){if(!e)return t?{kind:"lessThan",value:T("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??T("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??T("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??T("0")};default:return{kind:e.kind,...Ue(e.kind)==="value"?{value:T("")}:{}}}}var ya={text:"text",icon:"icon",gauge:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function va(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function Hs(e){switch(e){case"text":return C`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return C`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return C`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"shape":return C`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return C`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return C`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return C`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return C`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return C`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return C`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return C`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return C`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return C`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return C`<path d="M6 9L12 15L18 9" />`;case"plus":return C`<path d="M12 5V19M5 12H19" />`;case"lock":return C`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return C`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return C`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return C`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return C`<path d="M6 14L12 8L18 14" />`;case"down":return C`<path d="M6 10L12 16L18 10" />`;case"show":return C`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return C`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return C`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return C`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return C`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return C`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`}}function z(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Hs(e)}</svg>`}function ot(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let r=n.matrixTransform(i.inverse());return{x:r.x,y:r.y}}function ba(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var sn=e=>Math.round(e*1e3)/1e3,xa=10;function hi(e,t,n,i){let r=i.width>0?e.x+t/i.width:e.x,a=i.height>0?e.y+n/i.height:e.y;return ba({...e,x:sn(r),y:sn(a)})}function wa(e,t,n,i){let r=a=>Math.min(1,Math.max(0,a));return{x:i.w>0?sn(r(e.x+t/i.w)):e.x,y:i.h>0?sn(r(e.y+n/i.h)):e.y}}function ln(e,t,n,i,r){let a=ot(e,n),o={...i.frame},l=o;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let v=ot(e,h),g=(v.x-a.x)/t.width,x=(v.y-a.y)/t.height,b;if(!i.handle)b=ba({...o,x:s(o.x+g),y:s(o.y+x)});else{let{x:E,y:w,width:m,height:y}=o,$=o.x+o.width,F=o.y+o.height;i.handle.includes("e")&&(m=Math.max(.04,o.width+g)),i.handle.includes("s")&&(y=Math.max(.04,o.height+x)),i.handle.includes("w")&&(m=Math.max(.04,o.width-g),E=$-m),i.handle.includes("n")&&(y=Math.max(.04,o.height-x),w=F-y),b={...o,x:s(E),y:s(w),width:s(m),height:s(y)}}l=b,r.onFrame(i.elementId,b,!1)},c=h=>{h.pointerId===n.pointerId&&(p(),r.onFrame(i.elementId,l,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function $a(e,t,n,i,r){let a=ot(e,n),o=i;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let v=ot(e,h),g=t.w>0?s(i.x+(v.x-a.x)/t.w):i.x,x=t.h>0?s(i.y+(v.y-a.y)/t.h):i.y;o={x:l(g),y:l(x)},r(o.x,o.y,!1)},c=h=>{h.pointerId===n.pointerId&&(p(),r(o.x,o.y,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function ka(e,t,n,i,r){let a=ot(e,t),o=1;e.setPointerCapture(t.pointerId);let l=c=>{if(c.pointerId!==t.pointerId)return;let p=ot(e,c),h=(p.x-a.x)*(n.includes("e")?1:-1),v=(p.y-a.y)*(n.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,x=i.h>0?(i.h+v)/i.h:1,b=Math.abs(g-1)>=Math.abs(x-1)?g:x;o=Math.max(.05,b),r(o,!1)},s=c=>{c.pointerId===t.pointerId&&(d(),r(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}var vi=["content","look","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ne(e){return t=>e(t.target.value)}function ee(e,t,n,i={}){return u`<label class="field"><span>${e}</span>
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${ne(n)} /></label>`}function Ps(e,t,n,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${ne(n)}></textarea></label>`}function q(e,t,n,i={}){let r=t===void 0||Number.isNaN(t)?"":String(t);return u`<label class="field"><span>${e}</span>
    <input type="number" .value=${r} step=${i.step??"any"} min=${i.min??f} max=${i.max??f}
      @input=${ne(a=>{if(a.trim()===""){i.optional&&n(void 0);return}let o=Number(a);Number.isNaN(o)||n(o)})} /></label>`}function W(e,t,n,i){return u`<label class="field"><span>${e}</span>
    <select @change=${ne(r=>i(r))}>
      ${n.map(([r,a])=>u`<option value=${r} ?selected=${r===t}>${a}</option>`)}
    </select></label>`}function mi(e,t,n,i){let r=i.format??(a=>String(Math.round(a*100)/100));return u`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${ne(a=>{let o=Number(a);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${r(t)}</span>
      <button class="icon" title=${`Back to ${r(i.def)}`} aria-label="Reset" ?disabled=${t===i.def}
        @click=${()=>n(i.def)}>${z("reset")}</button>
    </div></div>`}function ce(e,t,n){return u`<label class="field check"><input type="checkbox" .checked=${t} @change=${i=>n(i.target.checked)} /><span>${e}</span></label>`}function pe(e,t,n,i=!1){let r=(t??"").replace(/^#/,""),a=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(r),o=a?`#${r.slice(0,6)}`:"#ffffff",l=a&&r.length===8?Math.round(parseInt(r.slice(6,8),16)/255*100):100,s=(d,c)=>{let p=d.replace(/^#/,"").toUpperCase();return c>=100?`#${p}`:`#${p}${Math.round(c/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return u`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${d=>n(d.target.checked?s(o,l):void 0)} />`:f}
      <input type="color" .value=${o} ?disabled=${i&&t===void 0} @input=${ne(d=>n(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${ne(d=>n(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${ne(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&n(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
    </div></div>`}function Ha(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function Ns(e,t){let n=t===void 0?void 0:typeof t=="string"?[t]:t,i=[];for(let[r,a]of Object.entries(e)){let o=r.split(".")[0]??"";if(n!==void 0&&!n.includes(o))continue;let l=typeof a?.attributes?.friendly_name=="string"?a.attributes.friendly_name.trim():"";i.push({entityId:r,name:l||r,state:a?.state??"",domain:o})}return i.sort((r,a)=>r.name.localeCompare(a.name)||r.entityId.localeCompare(a.entityId)),i}var Pa=50;function Os(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function Vs(e,t,n=Pa,i){let r=t.trim().toLowerCase(),a=s=>i===void 0||i(s)?0:1;if(r==="")return(i===void 0?e.slice():[...e].sort((s,d)=>a(s)-a(d))).slice(0,n);let o=r.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),c=s.name.toLowerCase(),p=-1;d===r?p=0:d.startsWith(r)?p=1:c.startsWith(r)?p=2:d.includes(r)?p=3:c.includes(r)?p=4:o.length>1&&o.every(h=>d.includes(h)||c.includes(h))&&(p=5),p>=0&&l.push({c:s,rank:p})}return l.sort((s,d)=>s.rank-d.rank||a(s.c)-a(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,n).map(s=>s.c)}var Ds=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Na(e){return Ds.test(e.trim())}function Bs(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return Ha(n,i);if(Na(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var st=new Map;function we(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let r=i.host;if(typeof r.requestUpdate=="function"){r.requestUpdate();return}t=r}}function Oa(e){return st.has(e)}function Le(e,t,n,i,r,a={}){let o=e.hass.states,l=st.get(r),s=l?Vs(Ns(o,a.domain),l.query,Pa,a.preferNumeric?Os:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,c=n.entityId?o[n.entityId]:void 0,p=(w,m,y=0)=>{st.set(r,{query:m,index:y}),we(w)},h=w=>{st.delete(r),we(w)},v=w=>{let m=Bs(w,n,o);m&&i(m)},g=(w,m)=>{i(Ha(o,w.entityId)),h(m)},x=()=>Math.max(0,Math.min(st.get(r)?.index??0,s.length-1)),b=w=>{let m=w.target;if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault();let y=st.get(r);if(!y){p(m,m.value);return}let $=w.key==="ArrowDown"?x()+1:x()-1;p(m,y.query,Math.max(0,Math.min(s.length-1,$))),Gs(m);return}if(w.key==="Enter"){w.preventDefault();let y=s[x()];l&&y?g(y,m):(v(m.value),h(m));return}if(w.key==="Escape"){if(!l)return;w.preventDefault(),w.stopPropagation(),h(m)}},E=n.entityId===""?u`<div class="hint">Type part of a name, such as "kitchen".</div>`:c?u`<div class="entity-current"><span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:n.entityId}</span><span class="ent-state">${c.state}</span></div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${t}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
      .value=${l?l.query:n.entityId}
      placeholder="Search entities, or type an id"
      @focus=${w=>{let m=w.target;p(m,n.entityId),m.select()}}
      @input=${w=>{let m=w.target;p(m,m.value)}}
      @keydown=${b}
      @blur=${w=>{let m=w.target;l&&v(m.value),h(m)}} />
    ${l?u`<div class="entity-results" role="listbox">
          ${s.length===0?u`<div class="hint" style="padding:6px 8px">${Na(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map((w,m)=>u`<button type="button" role="option" aria-selected=${m===d?"true":"false"} class="ent ${m===d?"hl":""}"
                @mousedown=${y=>y.preventDefault()} @click=${y=>g(w,y.target)}>
                <span class="ent-main">
                  <span class="ent-name">${w.name}</span>
                  <span class="ent-id mono">${w.entityId}</span>
                </span>
                <span class="ent-state">${w.state}</span>
              </button>`)}
        </div>`:E}
    ${a.compact?f:u`<details class="sub">
      <summary>Display name: ${n.displayName||"(none)"}</summary>
      ${ee("Display name",n.displayName,w=>i({...n,displayName:w}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function Gs(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Us=120;function Ks(e,t,n,i){let r=a=>i.size===0?[...a]:a.filter(o=>i.has(o));return e!==""?{names:r(rn.find(a=>a.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:r(an),fromPack:!1}}function Ca(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function Ws(e){return[{value:"",label:`Starter set (${Ca(an,e)})`},...rn.map(t=>({value:t.name,label:`${t.name} (${Ca(t.symbols,e)})`}))]}function qs(e){return e.length>0?e.length:an.length}function js(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Sa(e,t,n,i){let r=e.icons.render(t,22,"#FFFFFF");return u`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${r??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function Va(e,t,n,i){let r=e.symbols,a=r.isOpen(i),o=r.query(i),l=e.icons.names(),s=l??[],d=new Set(s),c=t.trim(),p=c!==""&&d.size>0&&!d.has(c),h=g=>{n(g),r.noteUsed(g)},v=f;if(a){let g=r.category(i),x=Ks(g,o,s,d),b=ia(x.names,o),E=x.fromPack?b.slice(0,Us):b,w=d.size===0?r.recent:r.recent.filter(m=>d.has(m));v=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${ne(m=>r.setQuery(i,m))} />
        <select @change=${ne(m=>r.setCategory(i,m))}>
          ${Ws(d).map(m=>u`<option value=${m.value} ?selected=${m.value===g}>${m.label}</option>`)}
        </select>
      </div>
      ${w.length===0?f:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${w.map(m=>Sa(e,m,m===c,h))}</div>`}
      <div class="sym-grid">${E.map(m=>Sa(e,m,m===c,h))}</div>
      ${b.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${js(E.length,b.length,o.trim()!=="",qs(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${ne(n)} @change=${ne(g=>{(d.size===0||d.has(g.trim()))&&r.noteUsed(g)})} /></label>
    ${p?u`<div class="hint warn">The installed icon pack has no <code>${c}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${a?"Hide symbols":"Browse symbols"}</button>
    ${v}`}var Ys=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"]],Js=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function Xs(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""}}}function Z(e,t,n,i){if(i.inline||!Zs())return u`<div class="value-editor">${Ga(e,t,n,i)}</div>`;let r=bi(i.key),a=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,l=se(t,le(e));return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?f:u`<span>${a}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${r} aria-haspopup="dialog" title=${`${a}: ${l}. Click to change it.`}>
      <span class="chip-text">${l}</span>
      ${o===void 0?f:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Da(e,r,a,t,n,i)}
  </div>`}function Da(e,t,n,i,r,a){return u`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${Ba}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${It.has(t)?Ga(e,i,r,a):f}
  </div>`}function le(e){return{values:e.config.values,hass:e.hass}}function bi(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function Zs(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var It=new Set,Rt=new WeakMap;function Qs(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function el(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=i.querySelector(`#${CSS.escape(t)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover()}))}function Ba(e){let t=e.currentTarget,n=e.newState==="open",i=Rt.get(t);if(i&&(i(),Rt.delete(t)),!n){It.delete(t.id)&&we(t);return}let r=Qs(t);if(!r)return;let a=()=>{if(!t.isConnected||!t.matches(":popover-open")){Rt.get(t)?.(),Rt.delete(t);return}let o=r.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}fi(t,o)};window.addEventListener("scroll",a,!0),window.addEventListener("resize",a),Rt.set(t,()=>{window.removeEventListener("scroll",a,!0),window.removeEventListener("resize",a)}),fi(t,r.getBoundingClientRect()),It.has(t.id)||(It.add(t.id),we(t),requestAnimationFrame(()=>{t.isConnected&&fi(t,r.getBoundingClientRect())}))}function fi(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=tl({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var qe=8,dn=6,Ea=140;function tl(e,t,n){let i=n.height-e.bottom-dn-qe,r=e.top-dn-qe,a=t.height>i&&r>i&&i<Ea,o=Math.max(Ea,a?r:i),l=Math.min(t.height,o),s=Math.max(qe,Math.min(e.left,n.width-t.width-qe)),d=a?Math.max(qe,e.top-dn-l):Math.max(qe,Math.min(e.bottom+dn,n.height-l-qe));return{left:s,top:d,maxHeight:o,above:a}}function Ga(e,t,n,i){let r=t.kind,a=c=>n({...t,kind:c}),o=i.key,l=Ys.filter(([c])=>i.allowNamed!==!1||c!=="named"),s=f;switch(r.kind){case"literal":s=i.symbol?Va(e,r.value,c=>a({...r,value:c}),o):ee("Text",r.value,c=>a({...r,value:c}));break;case"entityState":case"entityAge":s=Le(e,"Entity",r,c=>a({...r,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[r.entityId]?.attributes??{}).sort(),p=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=u`${Le(e,"Entity",r,h=>a({...r,...h}),`${o}-entity`)}
        ${ee("Attribute",r.attribute,h=>a({...r,attribute:h}),{list:p,mono:!0})}
        <datalist id=${p}>${c.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=il(e,r.aggregate,c=>a({...r,aggregate:c}),o);break;case"time":s=W("Field",r.timeField,Js,c=>a({...r,timeField:c}));break;case"dataAge":s=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=u`${Ps("Template",r.value,c=>a({...r,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:W("Value",r.id,[["","(choose)"],...e.config.values.map(c=>[c.id,c.name||c.id.slice(0,8)])],c=>a({...r,id:c}));break}let d=i.showResolved?e.resolve(t):void 0;return u`
    ${W("Source",r.kind,l,c=>a(Xs(r,c)))}
    ${s}
    ${i.noFormat?f:nl(t.format,c=>n(be(c)?{kind:t.kind}:{...t,format:c}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:f}`}function nl(e,t){let n=e??{},i=r=>{let a={...n,...r};for(let o of Object.keys(a))(a[o]===void 0||a[o]===!1||a[o]==="")&&delete a[o];t(a)};return u`<details class="sub" ?open=${!be(e)}>
    <summary>Format${be(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${q("Decimals",n.decimals,r=>i({decimals:r}),{step:1,min:0,max:6,optional:!0})}
      ${q("Multiply",n.multiply,r=>i({multiply:r}),{optional:!0})}
      ${q("Offset",n.offset,r=>i({offset:r}),{optional:!0})}
      ${W("Case",n.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],r=>i({textCase:r||void 0}))}
      ${ee("Prefix",n.prefix??"",r=>i({prefix:r}))}
      ${ee("Suffix",n.suffix??"",r=>i({suffix:r}))}
    </div>
    ${ce("Append the entity's unit",!!n.useEntityUnit,r=>i({useEntityUnit:r}))}
    ${ce("Show as relative time (45s, 2m, 3h)",!!n.relativeTime,r=>i({relativeTime:r}))}
  </details>`}function il(e,t,n,i){let r=l=>l.join(", "),a=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=t.scope;return u`
    ${W("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>n({...t,function:l}))}
    ${W("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>n({...t,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${ee("Domains",r(o.domains),l=>n({...t,scope:{...o,domains:a(l)}}),{placeholder:"light, switch"})}
          ${ee("Area ids",r(o.areaIds),l=>n({...t,scope:{...o,areaIds:a(l)}}))}
          ${ee("Label ids",r(o.labelIds),l=>n({...t,scope:{...o,labelIds:a(l)}}))}
          ${ee("Floor ids",r(o.floorIds),l=>n({...t,scope:{...o,floorIds:a(l)}}))}
        </div>`:u`${o.entities.map((l,s)=>u`<div class="row-inline">
            ${Le(e,`Entity ${s+1}`,l,d=>{let c=[...o.entities];c[s]=d,n({...t,scope:{...o,entities:c}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,c)=>c!==s)}})}>${z("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${W("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...t};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:s.stateFilter={kind:l},n(s)})}
    ${t.stateFilter&&"value"in t.stateFilter?ee("State",t.stateFilter.value,l=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:l}})):f}
    ${t.function==="count"?f:ee("Attribute (blank = state)",t.attribute??"",l=>{let s={...t};l?s.attribute=l:delete s.attribute,n(s)})}`}var Ua=Nn,rl=Ua.filter(([e])=>e!=="none");function al(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function Ka(e){let t=e.config,n=t.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),r=al(e.savedName,t.name),a=t.refreshMinutes??0,o=Ta.map(s=>[String(s),Fa(s)]);Ta.includes(a)||o.push([String(a),Fa(a)]);let l=t.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${ee("Name",t.name,s=>e.update(d=>{d.name=s},"name"))}
      ${W("Refresh",String(a),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${W("Tap action",n.type,Ua,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??ol).slice(0,7)}
                @input=${ne(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${r?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in n?Le(e,"Target",n,s=>e.update(d=>{d.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):f}
    ${n.type==="openPage"?sl(e):f}`}var ol="#808080",Ta=[0,15,30,60,120];function Fa(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function sl(e){let t=e.config;return Wa(e,t.openPageId,t.openPageName,(n,i)=>e.update(r=>{if(n===void 0){delete r.openPageId,delete r.openPageName;return}r.openPageId=n,i?r.openPageName=i:delete r.openPageName}))}function Wa(e,t,n,i){let r=t??"",a=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return r&&!e.pages.some(o=>o.id.toUpperCase()===r.toUpperCase())&&a.unshift([r,`${n||"Unknown page"} (not on the watch)`]),r||a.unshift(["","Choose a page\u2026"]),a.length<=1&&!r?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${W("Page",r,a,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${r?f:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function qa(e,t){let n=e.config.values.findIndex(r=>r.id===t.id),i=`nv-${t.id}`;return u`
    ${ee("Name",t.name,r=>e.update(a=>{a.values[n].name=r},`${i}-name`))}
    ${Z(e,t.value,r=>e.update(a=>{a.values[n].value=r},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${Ra(e.config,t.id)} layer${Ra(e.config,t.id)===1?"":"s"}.</div>`}function Ra(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function ja(){return{id:j(),name:"Value",value:T("")}}function ue(e,t,n){let i=e.perFamily[t],r=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&r?{frame:r.frame,isHidden:r.isHidden,size:r.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function de(e,t,n,i,r=!1){let a=e.elements.find(c=>c.payload.id===n);if(!a)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let l=ue(e,t,a),d={...o.placements[n]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(r&&delete d.size,Object.keys(o.placements).length===0)for(let c of e.elements)c.payload.id!==n&&(o.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});o.placements[n]=d}function ll(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function Ia(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function dl(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function Ya(e,t,n){let i=Ia(n.map(d=>ue(e,t,d).isHidden)),r=Ia(n.map(d=>d.payload.isHidden)),a=n.map(dl),o=n.length>0&&a.every(d=>d!==void 0),l=a[0],s=o&&l!==void 0&&a.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:r,colourable:o,colour:s?l:void 0}}var xi=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function cl(e,t,n){let i=t.payload.id,r=Wt(e.config,i),a=r[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"?{domain:"camera"}:{};return u`
    ${Le(e,t.kind==="image"?"Camera":"Entity",a,l=>e.update(s=>Cr(s,i,l),`${n}-entity`),`${n}-layer-entity`,o)}
    <div class="hint">${hl(t,r)}</div>`}function pl(e){if(e.kind==="text"||e.kind==="gauge")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function ul(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function hl(e,t){let n=pl(e),i=n?.kind.kind,a=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${a}`;let o=[],l=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let s=t.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${ul(o)}.${a}`}function ml(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function fl(e,t){let n=e.timestamp===!0,i=ke(e),r=a=>t(o=>{a?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(ke(o)&&(o.timestampCorner=Hn(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${ce("Show timestamp",n,a=>t(o=>{a?o.timestamp=!0:delete o.timestamp}))}
    ${n?u`
      ${W("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],a=>r(a==="free"))}
      ${i?f:W("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],a=>t(o=>{o.timestampCorner=a}))}
      ${q("Text size (pt)",e.timestampSize,a=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,a??xt))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function ie(e,t,n,i,r={}){let a=e.openSections.has(t),o=()=>e.toggleSection(t);return u`<section class="sec" data-open=${a?"true":"false"} style=${r.color?`--c:${r.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${z(r.icon??"content")}</span>
      <span class="tt"><h4>${n}</h4>${r.summary?u`<span class="sum">${r.summary}</span>`:f}</span>
      <span class="chev">${z("chevron")}</span>
    </div>
    ${a?u`<div class="sec-b">${i}</div>`:f}
  </section>`}function gl(e,t){let n=le(e);switch(t.kind){case"text":return lt(se(t.payload.value,n),48);case"icon":return lt(se(t.payload.symbol,n),48);case"gauge":return lt(se(t.payload.value,n),48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||"No camera yet";case"tap":return Ce(t.payload.action)}}function Aa(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${ge(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${ge(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${ge(e.payload.colorSlot.baseColorHex)}`;case"shape":return`${ge(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function Ja(e,t,n){let i=t.payload.id,r=e.config.elements.findIndex(m=>m.payload.id===i),a=`el-${i}`,o=(m,y)=>e.update($=>m($.elements[r]),y?`${a}-${y}`:void 0),l=ue(e.config,n,t),s=l.frame,d=(m,y)=>e.update($=>de($,n,i,{frame:{...s,...m}}),`${a}-${y}-${n}`),c=t.kind==="text"?"Font size":t.kind==="icon"?"Icon size":"Line width",p,h;switch(t.kind){case"text":p=u`
        ${Z(e,t.payload.value,m=>o(y=>{y.payload.value=m},"value"),{showResolved:!0,label:"Text",key:`${a}-value`})}
        ${ce("Live countdown",t.payload.countdown===!0,m=>o(y=>{let $=y.payload;m?$.countdown=!0:delete $.countdown}))}
        ${t.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,h=u`<div class="grid2">
          ${q("Font size (pt)",t.payload.fontSize,m=>o(y=>{y.payload.fontSize=m??14},"size"),{step:1,min:4})}
          ${W("Weight",t.payload.fontWeight,xi,m=>o(y=>{y.payload.fontWeight=m}))}
        </div>`;break;case"icon":p=u`
        ${Z(e,t.payload.symbol,m=>o(y=>{y.payload.symbol=m},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${a}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=q("Icon size (pt)",t.payload.size,m=>o(y=>{y.payload.size=m??14},"size"),{step:1,min:4});break;case"gauge":p=u`
        ${Z(e,t.payload.value,m=>o(y=>{y.payload.value=m},"value"),{showResolved:!0,label:"Reading",key:`${a}-value`})}
        <div class="grid2">
          ${q("Min",t.payload.minValue,m=>o(y=>{y.payload.minValue=m??0},"min"))}
          ${q("Max",t.payload.maxValue,m=>o(y=>{y.payload.maxValue=m??100},"max"))}
        </div>`,h=u`
        <div class="grid2">
          ${W("Style",t.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],m=>o(y=>{y.payload.style=m}))}
          ${q("Line width (pt)",t.payload.lineWidth,m=>o(y=>{y.payload.lineWidth=m??4},"lw"),{step:.5,min:.5})}
        </div>
        ${pe("Track colour",t.payload.trackColorHex,m=>o(y=>{y.payload.trackColorHex=m??"#FFFFFF40"},"track"))}`;break;case"shape":p=u`<div class="grid2">
          ${W("Shape",t.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],m=>o(y=>{y.payload.kind=m}))}
          ${t.payload.kind==="roundedRectangle"?q("Corner radius (pt)",t.payload.cornerRadius,m=>o(y=>{y.payload.cornerRadius=m??6},"radius"),{step:.5,min:0}):f}
        </div>`,h=u`
        ${pe("Border colour",t.payload.borderColorHex,m=>o(y=>{m===void 0?delete y.payload.borderColorHex:y.payload.borderColorHex=m},"border"),!0)}
        ${t.payload.borderColorHex!==void 0?q("Border width (pt)",t.payload.borderWidth,m=>o(y=>{y.payload.borderWidth=m??1},"bw"),{step:.5,min:0}):f}`;break;case"image":{let m=t.payload,y=($,F)=>o(P=>$(P.payload),F);p=u`
        ${m.entity.entityId&&!m.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:f}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=u`
        ${W("Picture",m.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],$=>y(F=>{F.contentMode=$}))}
        ${mi("Zoom",m.zoom,$=>y(F=>{F.zoom=$},"zoom"),{min:ii,max:4,step:.05,def:1,format:$=>`${$.toFixed(2)}x`})}
        ${mi("Pan left/right",m.panX,$=>y(F=>{F.panX=$},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${mi("Pan up/down",m.panY,$=>y(F=>{F.panY=$},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${ml(m)}</div>
        ${q("Corner radius (pt)",m.cornerRadius,$=>y(F=>{F.cornerRadius=Math.max(0,$??bt)},"imgradius"),{step:1,min:0})}`;break}case"tap":{p=u`
        ${Xa(e,t.payload,(m,y)=>o($=>m($.payload),y),a)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let v=t.kind==="image"||t.kind==="tap"?void 0:pe(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,m=>o(y=>{y.kind!=="image"&&y.kind!=="tap"&&(y.payload.colorSlot.baseColorHex=m??"#FFFFFF")},"color")),g=Bn(e.config,t),x=g?{kind:{kind:"entityState",...g}}:void 0,b=Q[t.kind],E=t.kind==="tap"?void 0:me(e.config,i)[0],w=t.kind==="image"?t.payload.timestamp===!0:!1;return u`
    ${ie(e,"content","Content",u`${t.kind==="tap"?f:cl(e,t,a)}${p}`,{color:b,icon:"content",summary:gl(e,t)})}
    ${h===void 0&&v===void 0?f:ie(e,"look",t.kind==="image"?"Picture":"Look",u`${h??f}${v??f}`,{color:b,icon:t.kind==="image"?"image":"look",...Aa(t)?{summary:Aa(t)}:{}})}
    ${t.kind==="image"?ie(e,"timestamp","Timestamp",fl(t.payload,(m,y)=>o($=>m($.payload),y)),{color:b,icon:"clock",summary:w?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden"}):f}
    ${t.kind==="tap"?f:ie(e,"tappable","Tap",bl(e,t,a),{color:K.tap,icon:"tap",summary:E?Ce(E.payload.action):"Not tappable"})}
    ${ie(e,"states","States",io(e,t.payload.rules,t.kind,m=>m.elements.find(y=>y.payload.id===i)?.payload.rules,`rules-${i}`,x),{color:K.states,icon:"states",summary:Ft(t.payload.rules).replace(/\.$/,"")})}
    ${ie(e,"placement","Place",u`
      <div class="grid4">
        ${q("X",s.x,m=>d({x:m??0},"x"),{step:.01})}
        ${q("Y",s.y,m=>d({y:m??0},"y"),{step:.01})}
        ${q("W",s.width,m=>d({width:m??.5},"w"),{step:.01,min:0})}
        ${q("H",s.height,m=>d({height:m??.5},"h"),{step:.01,min:0})}
      </div>
      ${q("Rotation (degrees)",s.rotationDegrees,m=>d({rotationDegrees:m??0},"rot"),{step:1})}
      ${t.kind==="shape"||t.kind==="image"||t.kind==="tap"?f:q(`${c} in ${N(n)} (blank = shared ${ll(t)})`,l.size,m=>e.update(y=>m===void 0?de(y,n,i,{},!0):de(y,n,i,{size:m}),`${a}-psize-${n}`),{step:1,min:1,optional:!0})}
      ${ce(`Hidden in ${N(n)}`,l.isHidden,m=>e.update(y=>de(y,n,i,{isHidden:m})))}
      ${ce("Hidden in every shape",t.payload.isHidden,m=>o(y=>{y.payload.isHidden=m}))}
      <div class="hint">Drag the layer on the ${N(n)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:K.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${N(n)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function Xa(e,t,n,i){let r=t.action,a=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${W("Tap action",r.type,rl,o=>n(l=>{l.action=a(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in r?Le(e,"Target",r,o=>n(l=>{l.action={type:r.type,...o}},"tap-entity"),`${i}-tap`):f}
    ${r.type==="openPage"?Wa(e,t.openPageId,t.openPageName,(o,l)=>n(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):f}`}var yl=24;function vl(e,t){let n=[],i=1/0;for(let a of X){if(a==="inline"||!e.config.supportedFamilies.includes(a))continue;let o=wr(e.config,t,a);o&&(n.push(`${N(a)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return f;let r=i<yl;return u`<div class=${r?"hint warn":"hint"}>${n.join(" \xB7 ")}${r?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:f}</div>`}function bl(e,t,n){if(t.kind==="tap")return f;let i=t.payload.id,r=me(e.config,i)[0],a=(l,s)=>e.update(d=>{let c=d.elements.find(p=>p.kind==="tap"&&p.payload.attachedTo===i);c&&l(c.payload)},s?`${n}-${s}`:void 0),o=Gn(e.config,t);return u`
    ${ce("Tappable",r!==void 0,l=>e.update(s=>{l?Kt(s,i):Kn(s,i)}))}
    ${r?u`<div class="value-editor">
          ${Xa(e,r.payload,a,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${Dt(r.payload.outset)?f:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>a(l=>{l.outset={...Pn}})}>${z("reset")}</button>`}
          </div>
        </div>
        ${vl(e,r.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Ce(o)}</b>.</div>`}`}function Ma(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function _e(e,t){switch(e.kind){case"text":return Ma(se(e.payload.value,t));case"icon":return Ma(se(e.payload.symbol,t));case"gauge":return se(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||"camera"}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function Za(e,t){let n=Ie(e.config,t.id),i=le(e),r=(a,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===t.id);s&&a(s)},o?`group-${t.id}-${o}`:void 0);return ie(e,"content","Group",u`
    ${ee("Name",t.name,a=>r(o=>{o.name=a},"name"))}
    ${ce("Move as one on the watch",t.locked,a=>r(o=>{o.locked=a}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(a=>_e(a,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(a=>Gt(a,t.id))}>Ungroup</button>
    </div>`,{color:K.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function Qa(e,t){if(t==="inline")return u`${xl(e)}${gi(e,t)}`;let n=e.config.perFamily[t];if(!n)return u`<div class="hint">No settings stored for ${N(t)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${N(t)} settings</button>
      ${gi(e,t)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[t]),s?`fam-${t}-${s}`:void 0),r=Object.keys(n.placements).length,a=n.backgroundColorHex?ge(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${ge(n.borderColorHex)} border`:"no border";return u`
    ${ie(e,"look",`${N(t)} shape`,u`
      ${pe("Background (blank = transparent)",n.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${pe("Border colour",n.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${q("Border width (pt)",n.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:K.place,icon:"shape",summary:`${a} \xB7 ${o}`})}
    ${t==="corner"?ie(e,"corner","Corner content",wl(e,n,i),{color:K.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas"}):f}
    ${ie(e,"states","Shape states",io(e,n.rules,"layout",l=>l.perFamily[t]?.rules,`rules-${t}`),{color:K.states,icon:"states",summary:Ft(n.rules).replace(/\.$/,"")})}
    ${ie(e,"placements","Placements",u`
      <div class="hint">${r===0?"Layers use their shared frames here.":`${r} layer${r===1?" has":"s have"} a ${N(t)} placement.`}</div>
      ${r>0?u`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:f}`,{color:K.place,icon:"place",summary:r===0?"Shared frames":`${r} own placement${r===1?"":"s"}`})}
    ${gi(e,t)}`}function gi(e,t){let n=!it(e.config,t),i=n?"A complication keeps at least one shape.":`Drop the ${N(t)} shape. The watch stops listing this complication for ${N(t)} slots.`;return ie(e,"shape","Remove this shape",u`
    <div class="adders">
      <button class="danger small" ?disabled=${n} title=${i} @click=${()=>e.removeFamily(t)}>Remove the ${N(t)} shape</button>
    </div>
    ${n?u`<div class="hint">This is the only shape. Add another before removing it.</div>`:u`<div class="hint">The watch stops listing this complication for ${N(t)} slots.</div>`}`,{color:K.place,icon:"delete",summary:n?"The only shape":"Drops its layout"})}function xl(e){let t=e.config.inline;if(!t)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(r,a)=>e.update(o=>{o.inline&&r(o.inline)},a?`inline-${a}`:void 0),i=le(e);return u`
    ${ie(e,"content","Inline text",u`
      ${ee("Label (blank = value only)",t.label??"",r=>n(a=>{r?a.label=r:delete a.label},"label"))}
      ${Z(e,t.value,r=>n(a=>{a.value=r},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${ce("Live countdown",t.countdown===!0,r=>n(a=>{r?a.countdown=!0:delete a.countdown}))}
      ${t.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:Q.text,icon:"text",summary:lt(`${t.label?`${t.label}: `:""}${se(t.value,i)}`,48)})}
    ${ie(e,"symbol","Symbol",u`
      ${Va(e,t.symbol??"",r=>n(a=>{r?a.symbol=r:delete a.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:Q.icon,icon:"icon",summary:t.symbol||"None"})}`}function wl(e,t,n){let i=t.curvedText?"curved":"canvas",r=t.bezelGauge?"gauge":t.bezelText?"text":"none";return u`
    ${W("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],a=>n(o=>{a==="curved"?o.curvedText||(o.curvedText=T("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?u`
      ${Z(e,t.curvedText,a=>n(o=>{o.curvedText=a},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${pe("Curved text colour",t.curvedColorHex??"#FFFFFF",a=>n(o=>{a===void 0?delete o.curvedColorHex:o.curvedColorHex=a},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${W("Bezel",r,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],a=>n(o=>{a==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=T("Label"))):a==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:T("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${r==="text"&&t.bezelText?u`
      ${Z(e,t.bezelText,a=>n(o=>{o.bezelText=a},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${ce("Live countdown",t.bezelCountdown===!0,a=>n(o=>{a?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${r==="gauge"&&t.bezelGauge?$l(e,t.bezelGauge,n):f}`}function $l(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],r=a=>o=>n(l=>{let s=[...i];s[a]=o??s[a],l.bezelGauge.colorHexes=s},`gstop${a}`);return u`
    ${Z(e,t.value,a=>n(o=>{o.bezelGauge.value=a},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${q("Gauge min",t.minValue,a=>n(o=>{o.bezelGauge.minValue=a??0},"gmin"),{step:1})}
      ${q("Gauge max",t.maxValue,a=>n(o=>{o.bezelGauge.maxValue=a??100},"gmax"),{step:1})}
    </div>
    ${pe("Arc colour (min end)",i[0],r(0))}
    ${pe("Arc colour (middle)",i[1],r(1))}
    ${pe("Arc colour (max end)",i[2],r(2))}
    ${ce("End number labels",!!(t.minLabel||t.maxLabel),a=>n(o=>{let l=o.bezelGauge;a?(l.minLabel=T(String(l.minValue)),l.maxLabel=T(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${t.minLabel?Z(e,t.minLabel,a=>n(o=>{o.bezelGauge.minLabel=a},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${t.maxLabel?Z(e,t.maxLabel,a=>n(o=>{o.bezelGauge.maxLabel=a},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var Jc=X.map(e=>[e,N(e)]),wi={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},kl=Object.keys(wi);function Cl(e){let t=qt[e];return kl.filter(n=>t.includes(oe[n]))}var Sl={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function cn(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function lt(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function El(e){if(!e||be(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function se(e,t){return`${Tl(e,t)}${El(e.format)}`}function Tl(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${lt(n.value,40)}"`:"(empty)";case"entityState":return cn(n,t);case"entityAttribute":return n.attribute?`${cn(n,t)} \xB7 ${n.attribute}`:cn(n,t);case"entityAge":return`age of ${cn(n,t)}`;case"aggregate":return Fl(n.aggregate);case"time":return Sl[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${lt(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(r=>r.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`}}function Fl(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function hn(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function Rl(e,t,n,i,r){let a=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${r}-${l}`:void 0);return u`
    ${t.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:f}
    ${t.map((o,l)=>Il(e,o,l,t.length,n,a,`${r}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>a(o=>{o.push(kt())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function Il(e,t,n,i,r,a,o){let l=e.liveBranch(t),s=e.forced.get(t.id)??"live",d=p=>s==="live"?p==="live":s==="otherwise"?p==="otherwise":s.caseId===p,c=(p,h)=>a(v=>{let g=v.find(x=>x.id===t.id);g&&p(g)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>a(p=>hn(p,n,n-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>a(p=>hn(p,n,n+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>a(p=>{let h=p.findIndex(v=>v.id===t.id);h>=0&&p.splice(h,1)})}>${z("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((p,h)=>u`<button class="${d(p.id)?"active":""} ${l===p.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:p.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?u`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:f}
    </div>
    ${t.cases.map((p,h)=>Al(e,p,h,t,r,c,`${o}-${p.id}`))}
    <div class="adders"><button class="small" @click=${()=>c(p=>{p.cases.push(qn())})}>+ case</button></div>
    ${ce("Otherwise (when no case matches)",t.otherwise!==void 0,p=>c(h=>{p?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?u`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${eo(e,t.otherwise,r,p=>c(h=>{h.otherwise&&p(h.otherwise)}),`${o}-otherwise`)}
        </div>`:f}
  </div>`}function Al(e,t,n,i,r,a,o){let l=(d,c)=>a(p=>{let h=p.cases.find(v=>v.id===t.id);h&&d(h)},c),s=e.liveBranch(i)===t.id;return u`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${s?u` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>a(d=>hn(d.cases,n,n-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>a(d=>hn(d.cases,n,n+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>a(d=>{let c=d.cases.findIndex(p=>p.id===t.id);c>=0&&d.cases.splice(c,1)})}>${z("delete")}</button>
    </div>
    <div class="row-inline">
      ${W("When",t.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(c=>{c.when.join=d}))}
    </div>
    ${t.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:f}
    ${t.when.tests.map((d,c)=>Ml(e,d,c,p=>l(h=>{let v=h.when.tests.find(g=>g.id===d.id);v&&p(v)}),()=>l(p=>{p.when.tests=p.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(Wn())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${eo(e,t.then,r,d=>l(c=>d(c.then)),`${o}-then`)}
  </div>`}function Ml(e,t,n,i,r,a){let o=(p,h)=>i(p,h?`${a}-${h}`:void 0),l=t.comparison,s=Ue(l.kind),d=e.evaluateTest(t),c=f;switch(s){case"value":c=Z(e,l.value??T(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Compare with",key:`${a}-rhs`});break;case"between":c=u`${Z(e,l.value??T(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Lower bound",key:`${a}-rhs`})}
        ${Z(e,l.upper??T(""),p=>o(h=>{h.comparison.upper=p},"upper"),{showResolved:!0,label:"Upper bound",key:`${a}-upper`})}`;break;case"pattern":c=u`${ee("Pattern",l.pattern??"",p=>o(h=>{h.comparison.pattern=p},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!Ll(l.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"options":c=ee("Options (comma separated)",(l.options??[]).join(", "),p=>o(h=>{h.comparison.options=p.split(",").map(v=>v.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${r}>${z("delete")}</button>
    </div>
    ${l.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:Z(e,t.value,p=>o(h=>{h.value=p},"lhs"),{showResolved:!0,label:"Value",key:`${a}-lhs`})}
    ${W("Comparison",l.kind,Sr.map(p=>[p,at[p]]),p=>o(h=>{h.comparison=jn(h.comparison,p)}))}
    ${c}
  </div>`}function Ll(e){try{return new RegExp(e),!0}catch{return!1}}function eo(e,t,n,i,r){let a=Cl(n);return u`
    ${t.length===0?u`<div class="hint">No changes.</div>`:f}
    ${t.map((o,l)=>_l(e,o,l,n,(s,d)=>i(c=>{c[l]&&s(c[l])},d?`${r}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${r}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(Ke(s))})}}>
      <option value="">+ change…</option>
      ${a.map(o=>u`<option value=${o}>${wi[o]}</option>`)}
    </select>`}var to=["setColor","setBorderColor","setBackgroundColor"];function _l(e,t,n,i,r,a,o){let l=!qt[i].includes(oe[t.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${wi[t.kind]}${l?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${a}>${z("delete")}</button>
    </div>
    ${no(e,t,r,o)}
  </div>`}function no(e,t,n,i){let r=jt(t.kind),a=f;if(r==="value"){let o=t.value??T("");if(to.includes(t.kind)){let l=o.kind.kind==="literal";a=u`${l?pe("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>n(d=>{d.value=T(s??"#FFFFFF")},"color")):Z(e,o,s=>n(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:T("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?f:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else a=Z(e,o,l=>n(s=>{s.value=l},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(r==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};a=q(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,l=>n(s=>{s.number=l??0},"number"),o)}else r==="weight"&&(a=W("Weight",t.weight??"regular",xi,o=>n(l=>{l.weight=o})));return a}var yi=new Set,pn=new Map,un=new Map,La=new Map;function io(e,t,n,i,r,a){let o=ci(t);return!o.ok||yi.has(r)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{yi.delete(r),we(s.target)}}>Show as table</button>
        ${o.ok?f:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${Rl(e,t,n,i,r)}`:zl(e,o.table,t[0],n,i,r,a)}function zl(e,t,n,i,r,a,o){let l=(k,L)=>e.update(_=>{let I=r(_);I&&k(I)},L?`${a}-${L}`:void 0),s=t.value??La.get(a)??o,d=t.rows.length===0,c=t.numberMode||d&&s!==void 0&&!va(s)&&Hl(e.resolve(s)),p=qt[i],h=pn.get(a)??new Set,v=t.columns.length===0&&h.size===0?[ya[i]]:[],g=la(t.columns,[...h,...v.filter(k=>k!==void 0)],p),x=n?e.liveBranch(n):"none",b=n?e.forced.get(n.id)??"live":"live",E=k=>b!=="live"&&(b==="otherwise"?k==="otherwise":b.caseId===k),w=k=>{n&&e.setForced(n.id,E(k)?"live":k==="otherwise"?"otherwise":{caseId:k})},m=k=>{La.set(a,k),t.rows.length!==0&&l(L=>ma(L,k),"lhs")},y=()=>l(k=>ua(k,s??T(""),c)),$=t.rows.map((k,L)=>za(e,{key:`${a}-${k.caseId}`,label:ga(k.comparison,_=>se(_,le(e))),columns:g,changes:k.changes,live:x===k.caseId,forced:E(k.caseId),onForce:()=>w(k.caseId),when:Dl(e,k.comparison,`${a}-${k.caseId}`,(_,I)=>l(H=>{let G=H[0]?.cases.find(Y=>Y.id===k.caseId)?.when.tests[0];G&&_(G.comparison)},I&&`${k.caseId}-${I}`)),updChanges:(_,I)=>l(H=>{let G=H[0]?.cases.find(Y=>Y.id===k.caseId);G&&_(G.then)},I&&`${k.caseId}-${I}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${L===0} @click=${()=>l(_=>pi(_,L,L-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${L===t.rows.length-1} @click=${()=>l(_=>pi(_,L,L+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(_=>ha(_,k.caseId))}>${z("delete")}</button>`})),F=t.otherwise===void 0?f:za(e,{key:`${a}-otherwise`,label:"Otherwise",columns:g,changes:t.otherwise,live:x==="otherwise",forced:E("otherwise"),onForce:()=>w("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(k,L)=>l(_=>{let I=_[0]?.otherwise;I&&k(I)},L),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(k=>ui(k,!1))}>${z("close")}</button>`}),P=un.get(a),V=Pl.filter(k=>p.includes(k)&&!g.includes(k));return u`
    <div class="states">
      ${Z(e,s??T(""),m,{label:"Testing",showResolved:!0,key:`${a}-lhs`})}
      ${s===void 0?u`<div class="hint">Choose what these states look at.</div>`:f}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(k=>u`<th>
              <span>${Ee[k]}</span>
              <button class="icon" title=${`Remove the ${Ee[k]} column`}
                @click=${L=>{un.set(a,k),we(L.target)}}>${z("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${$}
          ${F}
          ${t.rows.length===0&&t.otherwise===void 0?u`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${P===void 0?f:u`<div class="hint warn confirm-row">
        Remove the ${Ee[P]} column? Its ${_a(t,P)} value${_a(t,P)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${k=>{un.delete(a),pn.get(a)?.delete(P),we(k.target),l(L=>fa(L,P))}}>Remove</button>
        <button class="small" @click=${k=>{un.delete(a),we(k.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${y}>+ state</button>
        ${t.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(k=>ui(k,!0))}>+ otherwise</button>`:f}
        <span class="spacer"></span>
        ${b==="live"?f:u`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${V.length===0?f:u`<select class="chip-add" title="Add a column" @change=${k=>{let L=k.target,_=L.value;if(L.value="",!_)return;let I=pn.get(a)??new Set;I.add(_),pn.set(a,I),we(L)}}>
          <option value="" selected>+ column…</option>
          ${V.map(k=>u`<option value=${k}>${Ee[k]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${c?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${k=>{yi.add(a),we(k.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Hl(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var Pl=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function _a(e,t){let n=0;for(let i of e.rows)on(i.changes,t)&&(n+=1);return e.otherwise&&on(e.otherwise,t)&&(n+=1),n}function Nl(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function za(e,t){return u`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{Nl(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>u`<td>${Ol(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function Ol(e,t,n,i,r){let a=on(n,t),o=bi(r);if(!a)return u`<button type="button" class="cell empty" title=${`Set ${Ee[t]} for this state`}
      @click=${d=>{i(c=>{c.push(Ke(sa[t]))}),el(d.target,o)}}>unchanged</button>`;let l=(d,c)=>i(p=>{let h=p.find(v=>oe[v.kind]===t);h&&d(h)},c&&`${t}-${c}`),s=Ee[t];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${Vl(e,a)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${Ba}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${It.has(o)?u`${t==="visibility"?W("This state",a.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(c=>{c.kind=d})):no(e,a,l,r)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let p=c.findIndex(h=>oe[h.kind]===t);p>=0&&c.splice(p,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:f}
    </div>`}function Vl(e,t){if(t.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return u`<span class="cell-word">Shown</span>`;let n=jt(t.kind);if(n==="number")return u`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return u`<span class="cell-word">${xi.find(([a])=>a===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??T(""),r=i.kind.kind==="literal"?i.kind.value:void 0;if(to.includes(t.kind))return u`<span class="swatch" style=${`background:${r&&/^#[0-9a-fA-F]{6,8}$/.test(r)?r:"transparent"}`}></span>
      <span class="cell-word">${r?ge(r):se(i,le(e))}</span>`;if(t.kind==="setIcon"&&r){let a=e.icons.render(r,16,"#FFFFFF");return u`${a??f}<span class="cell-word">${r}</span>`}return u`<span class="cell-word">${se(i,le(e))}</span>`}function ge(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Dl(e,t,n,i){let r=Ue(t.kind),a=di(t.kind),o=(l,s,d,c)=>Gl(e,l,s,`${n}-${d}`,a,c,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ne(l=>i(s=>{let d=jn(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${li.map(l=>u`<option value=${l} ?selected=${l===t.kind}>${Bl(l)}</option>`)}
    </select>
    ${r==="value"||r==="between"?o(t.value??T(""),l=>i(s=>{s.value=l},"rhs"),"rhs",a?"0":"value"):f}
    ${r==="between"?u`<span class="when-and">to</span>${o(t.upper??T(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:f}
  </span>`}function Bl(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return at[e]}}function Gl(e,t,n,i,r,a,o){let l=bi(i),s={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return u`<span class="rhs">
      ${Z(e,t,n,{...s,compact:!0})}
    </span>`;let d=t.kind.value;return u`<span class="rhs">
    <input class="cellin ${r?"num":""}" type=${r?"number":"text"} .value=${d} placeholder=${a}
      @input=${ne(c=>n({...t,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${Da(e,l,o,t,n,s)}
  </span>`}var fn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Dn,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function so(e){return fn.find(t=>t.kind===e)??fn[0]}var ro="#FF9F0A",$i="#8E8E93",Ul=["#FF453A","#FFD60A","#34C759"],lo=["#0A84FF","#34C759","#FF9F0A"];function Kl(e){return e?.attributes?.device_class==="battery"?Ul:lo}var Wl={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function ql(e){let t=e.iconName?.trim();return t?{off:t,on:t}:Wl[ki(e)]??{off:"circle",on:"circle.fill"}}function jl(e){switch(ki(e)){case"lock":return{kind:"equals",value:T("locked")};case"cover":case"valve":return{kind:"equals",value:T("open")};case"media_player":return{kind:"equals",value:T("playing")};default:return{kind:"isOn"}}}function ki(e){return e.domain||e.entityId.split(".")[0]||""}function At(e){return{...e,domain:ki(e)}}function Yl(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let r=typeof t.device_class=="string"?t.device_class:"",a=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(r){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return a.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return a==="%"?{min:0,max:100}:{min:0,max:100}}}function mn(e){return Math.round(e*1e4)/1e4}function gn(e,t,n){return Math.min(n,Math.max(t,e))}function Ci(e,t,n){let i=xe[e],r=gn(mn(t/i.width),0,1),a=gn(mn(n/i.height),0,1);return{x:mn((1-r)/2),y:mn((1-a)/2),width:r,height:a,rotationDegrees:0}}function Jl(e){let t=xe[e],n=gn(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:Ci(e,n*1.3,n*1.3),size:n}}function Xl(e){let t=xe[e],n=gn(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:Ci(e,t.width*.88,n*1.7),size:n}}function Zl(e){let t=xe[e],n=Math.min(t.width,t.height)*.9;return{frame:Ci(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function Ql(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function ed(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:e.kind==="gauge"&&(e.payload.lineWidth=t))}function yn(e,t,n,i){let r=i(n);t.payload.frame=r.frame,ed(t,r.size);for(let a of X){if(a===n||a==="inline")continue;let o=e.perFamily[a];if(!o)continue;let l=i(a);JSON.stringify(l)!==JSON.stringify(r)&&(o.placements[t.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function vn(e){return $t(e)}function Si(e,t){let n={kind:{kind:"entityState",...At(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function ao(e){let t=Ke("setIcon");return t.value=T(e),t}function je(e){let t=Ke("setColor");return t.value=T(e),t}function td(e,t){let n=kt(),i=n.cases[0],r=i.when.tests[0];r.value={kind:{kind:"entityState",...At(e)}},r.comparison=jl(e);let a=t.on!==t.off;return i.then=a?[ao(t.on),je(ro)]:[je(ro)],n.otherwise=a?[ao(t.off),je($i)]:[je($i)],n}function nd(e){let t=kt(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...At(e)}},i.comparison={kind:"isUnavailable"};let r=Ke("setOpacity");return r.number=.35,n.then=[r],t}function oo(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function id(e,t,n=lo){let i=t.max-t.min,r=oo(t.min+i/3),a=oo(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:T(r)},changes:[je(n[0])]},{comparison:{kind:"between",value:T(r),upper:T(a)},changes:[je(n[1])]},{comparison:{kind:"greaterThan",value:T(a)},changes:[je(n[2])]}];return da(Si(e),o)}function rd(e,t,n){let i=vn("icon"),r=ql(t);return i.payload.symbol=T(r.off),i.payload.colorSlot.baseColorHex=$i,i.payload.rules=[td(t,r)],yn(e,i,n.family,Jl),e.elements.push(i),Kt(e,i.payload.id,{type:"toggleEntity",...At(t)}),i.payload.id}function ad(e,t,n){let i=vn("text");return i.payload.value=Si(t,n.state),i.payload.rules=[nd(t)],yn(e,i,n.family,Xl),e.elements.push(i),i.payload.id}function od(e,t,n){let i=vn("gauge");i.payload.value=Si(t);let r=Yl(n.state);return i.payload.minValue=r.min,i.payload.maxValue=r.max,i.payload.rules=[id(t,r,Kl(n.state))],yn(e,i,n.family,Zl),e.elements.push(i),i.payload.id}function sd(e,t,n){let i=vn("image");return i.payload.entity=At(t),yn(e,i,n.family,Ql),e.elements.push(i),i.payload.id}function co(e,t,n,i){switch(t){case"toggle":return rd(e,n,i);case"status":return ad(e,n,i);case"gauge":return od(e,n,i);case"camera":return sd(e,n,i)}}var dd=3e4,cd=500,po="preset-entity",pd={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Ei(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function ud(e){return e.kind==="family"?"look":"content"}function hd(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var uo=300,ho=400,Ye=200,md=720,bn=320,fd=80,gd=56,mo="wrist-assistant-panel.columns.v2",Ti=e=>Math.max(Ye,Math.min(md,Math.round(e))),fo=e=>e.metaKey||e.ctrlKey||e.shiftKey,go=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl";function yo(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-fd;if(i>=Ye*2+bn){let a=i-bn,o=t,l=n;if(o+l>a){let s=a/(o+l);o=Math.max(Ye,Math.floor(o*s)),l=Math.max(Ye,Math.floor(l*s));let d=o+l-a;d>0&&(o>=l?o=Math.max(Ye,o-d):l=Math.max(Ye,l-d))}return{columns:3,left:o,right:l}}let r=e-gd;return r>=Ye+bn?{columns:2,left:Math.min(t,r-bn),right:n}:{columns:1,left:t,right:n}}var R=class extends Fe{constructor(){super(...arguments);this.narrow=!1;this.colLeft=uo;this.colRight=ho;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Et.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.icons=ta(()=>this.requestUpdate());this.imageSizes=na(()=>this.requestUpdate());this.symbols=new nn(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(r=>r instanceof HTMLElement&&r.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||Oa(po)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=$n`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      font-size: 14px;
      /* Colours the whole editor shares: one per layer kind, one per section
         that is not about a kind. Set once so a badge, a bar and a card agree. */
      --wa-text: ${re(Q.text)};
      --wa-icon: ${re(Q.icon)};
      --wa-gauge: ${re(Q.gauge)};
      --wa-shape: ${re(Q.shape)};
      --wa-image: ${re(Q.image)};
      --wa-tap: ${re(Q.tap)};
      --wa-states: ${re(K.states)};
      --wa-place: ${re(K.place)};
      --wa-card: var(--card-background-color, #fff);
      --wa-panel: var(--secondary-background-color, rgba(127,127,127,.12));
      --wa-line: var(--divider-color, rgba(127,127,127,.3));
      --wa-muted: var(--secondary-text-color, rgba(127,127,127,.9));
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--wa-line);
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      flex-wrap: wrap;
      position: relative;
      z-index: 20;
    }
    header h1 { font-size: 17px; font-weight: 500; margin: 0 8px 0 0; white-space: nowrap; }
    header .spacer { flex: 1; }
    header select { font: inherit; font-size: 13px; padding: 4px 8px; border-radius: 6px; }
    header label { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--primary-text-color);
    }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    header button.primary { background: var(--wa-card); color: var(--primary-color); }
    /* Save is the header's one call to action, so it opts out of the inverted
       header treatment above. That rule paints a card-coloured button on a
       card-coloured header under a dark theme, which reads as plain text. Here
       it is filled while there is something to save and quiet once there is
       not, and the pale hairline is what keeps it off a header that is itself
       the primary colour. The halo is the dirty dot's colour, so the button,
       the dot and the footer line all say "unsaved" the same way. */
    header button.save {
      font-weight: 600; padding: 6px 14px; min-height: 30px;
      background: rgba(255,255,255,.14); color: inherit; border-color: rgba(255,255,255,.35);
    }
    header button.save:hover:not(:disabled) { background: rgba(255,255,255,.24); }
    header button.save:focus-visible { outline: 2px solid var(--app-header-text-color, #fff); outline-offset: 2px; }
    header button.save.dirty {
      background: var(--primary-color); color: var(--text-primary-color, #fff);
      border-color: rgba(255,255,255,.55);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #ffa600) 45%, transparent);
    }
    header button.save.dirty:hover:not(:disabled) { background: color-mix(in srgb, var(--primary-color) 86%, #fff); }
    button.danger { color: var(--error-color, #db4437); border-color: var(--error-color, #db4437); }
    button.small { padding: 5px 10px; font-size: 12.5px; min-height: 26px; }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: inherit;
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; border-radius: 6px; opacity: .75;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: rgba(127,127,127,.22); }
    button.icon:focus-visible { opacity: 1; outline: 2px solid var(--primary-color); outline-offset: -2px; }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #db4437); }
    svg.ui-icon { width: 17px; height: 17px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warning-color, #ffa600); margin-left: 6px; vertical-align: middle; }

    /* The complication picker: one dropdown in the header instead of a list
       down the side, because the list was read once per session and the space
       it held is worth more to the layers. */
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 14px; font-weight: 500;
      padding: 6px 10px 6px 12px; border-radius: 8px; cursor: pointer; color: inherit;
      border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.14); min-width: 220px; max-width: 380px;
    }
    .picker > button:hover { background: rgba(255,255,255,.22); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { opacity: .75; font-weight: 400; font-size: 12px; white-space: nowrap; }
    .picker > button svg { width: 16px; height: 16px; opacity: .8; }
    .picker .menu {
      position: absolute; top: calc(100% + 6px); left: 0; z-index: 50; width: 360px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--primary-text-color); border: 1px solid var(--wa-line);
      border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,.35); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13px;
      background: transparent; border: 0; color: inherit; padding: 7px 10px; border-radius: 6px; cursor: pointer;
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--primary-color) 16%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: default; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
    .picker .menu .new { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 10px; color: var(--primary-color); font-weight: 500; }
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
      background: var(--wa-line); opacity: .35;
    }
    .gutter:hover::after, .gutter.dragging::after { background: var(--primary-color); opacity: 1; }
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
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.2));
      padding: 14px 16px;
    }
    .column.left { display: flex; flex-direction: column; gap: 16px; }
    .column.left .card { flex: none; }
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 10px;
      font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { text-transform: none; letter-spacing: 0; font-weight: 400; font-size: 12px; }
    .panel-title button.small { text-transform: none; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-card); }
    details.foot > summary { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; list-style: none; }
    details.foot > summary::-webkit-details-marker { display: none; }
    details.foot > summary:hover { background: var(--wa-panel); }
    details.foot .foot-dot { font-size: 10px; }
    details.foot .foot-dot.ok { color: var(--success-color, #43a047); }
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

    /* Add a layer: six tinted buttons, one per kind, then the presets. It sits
       above the list so adding a layer never moves the button just pressed. */
    .add-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    button.add {
      display: flex; align-items: center; justify-content: center; gap: 5px; padding: 8px 4px; border-radius: 8px;
      font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer; color: var(--primary-text-color); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 12%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
    }
    button.add:hover:not(:disabled) { background: color-mix(in srgb, var(--k) 24%, var(--wa-card)); }
    button.add svg { color: var(--k); width: 15px; height: 15px; flex: none; }
    .presets-l { margin: 12px 0 6px; font-size: 12px; color: var(--wa-muted); }
    .presets { display: flex; flex-wrap: wrap; gap: 6px; }
    button.preset {
      font: inherit; font-size: 12px; padding: 4px 10px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-muted);
    }
    button.preset:hover:not(:disabled) { color: var(--primary-color); border-color: var(--primary-color); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last. */
    .layers { display: flex; flex-direction: column; gap: 6px; }
    /* Every row is its own outlined container at rest. The border is what
       tells one row from the next, so nothing here may set it to transparent. */
    .layer {
      display: grid; grid-template-columns: 16px 4px minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 6px 6px 6px 4px; border-radius: 8px;
      border: 1px solid var(--wa-line); background: color-mix(in srgb, var(--wa-panel) 30%, var(--wa-card));
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
    }
    /* A group's members keep their own outline, one shade deeper, so they read
       as nested and still separate from each other. */
    .layer.kid { background: color-mix(in srgb, var(--wa-panel) 60%, var(--wa-card)); }
    .layer:hover { background: var(--wa-panel); border-color: color-mix(in srgb, var(--k) 45%, var(--wa-line)); }
    .layer.hl { border-color: var(--k); background: color-mix(in srgb, var(--k) 12%, var(--wa-card)); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--primary-color); }
    .layer .grip { color: var(--wa-muted); opacity: .6; display: grid; place-items: center; cursor: grab; }
    .layer .grip svg { width: 14px; height: 14px; }
    .layer .bar { width: 4px; height: 26px; border-radius: 2px; background: var(--k); }
    .layer .name { display: flex; flex-direction: column; min-width: 0; }
    .layer .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .kind { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge { font-size: 11px; padding: 1px 7px; border-radius: 999px; background: var(--wa-panel); color: var(--wa-muted); white-space: nowrap; }
    .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 16%, transparent); }
    .badge.states { color: color-mix(in srgb, var(--wa-states) 70%, var(--primary-text-color)); background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    /* Reserved, not removed: taking the actions out of the layout made the
       name change width the moment the pointer arrived. The badges step aside
       for them instead, so the row keeps its width. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { display: inline-flex; }
    .layer:hover .badges, .layer.hl .badges, .layer:focus-within .badges { display: none; }
    .layer .acts button.icon { width: 24px; height: 24px; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    .layer.dragging { opacity: .4; }
    .layer.pinned { border-style: dashed; }
    .layer.pinned.hl { border-style: solid; }
    .layer.pinned .grip { cursor: default; opacity: .8; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { border-color: var(--primary-color); box-shadow: inset 0 0 0 1px var(--primary-color); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer.group .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 16px; height: 16px; display: grid; place-items: center;
    }
    .layer.group .chev svg { width: 14px; height: 14px; transition: transform .15s ease-out; }
    .layer.group .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--primary-color); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${re(K.locked)}; filter: drop-shadow(0 0 4px ${re(K.locked)}); }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 14px; padding-left: 10px; display: flex; flex-direction: column; gap: 6px;
      border-left: 2px solid color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* Drop targets last, so the bar and the tinted edge beat whatever the row
       already had on its own border. */
    .layer.drop-before { border-top-color: var(--primary-color); box-shadow: 0 -3px 0 0 var(--primary-color); }
    .layer.drop-after { border-bottom-color: var(--primary-color); box-shadow: 0 3px 0 0 var(--primary-color); }

    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    .column.canvas > .card.canvas-card { padding: 0; overflow: hidden; }
    .banner { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; background: var(--wa-panel); }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .canvas-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-bottom: 1px solid var(--wa-line); flex-wrap: wrap; font-size: 13px; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    .canvas-bar .hint { margin: 0; }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; }
    .canvas-bar select { font: inherit; font-size: 13px; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--wa-line); background: var(--wa-card); color: inherit; }
    button.pick {
      font: inherit; font-size: 12px; padding: 4px 11px; border-radius: 999px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid var(--wa-line); background: transparent; color: inherit;
    }
    button.pick:hover:not(:disabled) { border-color: var(--primary-color); }
    button.pick.on { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    .stage {
      display: grid; justify-items: center; padding: 26px 20px 18px;
      background: radial-gradient(circle at 50% 30%, rgba(127,127,127,.14) 0, transparent 70%);
    }
    .preview { text-align: center; position: relative; width: 100%; min-width: 0; }
    .preview svg {
      display: block; margin: 0 auto; background: #000; border-radius: 12px; touch-action: none;
      height: auto; max-width: 100%;
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
    .under b { color: var(--primary-text-color); font-weight: 500; }
    .strip { padding: 0 20px 24px; }
    .strip-row { padding: 18px 0 20px; }
    .strip-row + .strip-row { border-top: 1px solid var(--wa-line); }
    .strip-row .help { font-size: 12px; color: var(--wa-muted); margin-top: 8px; }
    .settings { max-width: 1100px; }
    .settings .gen-row { display: grid; grid-template-columns: minmax(160px, 1.3fr) minmax(130px, .8fr) minmax(150px, 1fr) minmax(220px, 1.4fr); gap: 4px 18px; align-items: start; }
    .settings .gen-row .field { display: flex; flex-direction: column; align-items: stretch; gap: 4px; margin: 4px 0; min-width: 0; }
    .settings .gen-row .field > span { font-size: 12px; }
    .settings .flash-row { display: flex; align-items: center; gap: 8px; min-height: 30px; min-width: 0; }
    .settings .flash-row > input[type=checkbox] { width: 16px; height: 16px; margin: 0; flex: none; accent-color: var(--c, var(--primary-color)); }
    .settings .flash-row input.flash-color { width: 36px; height: 28px; padding: 0; border: 1px solid var(--wa-line); border-radius: 6px; background: none; cursor: pointer; }
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
    .values-list .datum:hover { border-color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 7%, var(--wa-card)); }
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
      width: 180px; height: 104px; border-radius: 12px; background: var(--wa-card); border: 1px solid var(--wa-line);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      color: var(--wa-muted); font: inherit; font-size: 13px; padding: 8px; cursor: pointer; overflow: hidden;
    }
    button.tile:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-text-color); }
    button.tile[aria-pressed="true"] { border-color: var(--primary-color); color: var(--primary-text-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 22%, transparent); }
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
    .vchip:hover { border-color: var(--primary-color); }
    .vchip .dom { width: 22px; height: 22px; border-radius: 50%; background: color-mix(in srgb, var(--k) 20%, transparent); color: var(--k); display: grid; place-items: center; flex: none; }
    .vchip .dom svg { width: 13px; height: 13px; }
    .vchip b { font-weight: 500; }
    .vchip .val { color: var(--wa-muted); border-bottom: 1px dashed var(--wa-line); }
    .vchip.testing { border-color: var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--primary-text-color)); border-bottom-color: var(--wa-states); }
    .vchip input { width: 110px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    .testing-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; text-transform: none; letter-spacing: 0; color: color-mix(in srgb, var(--wa-states) 70%, var(--primary-text-color)); }
    .testing-pill button { font: inherit; font-size: 12px; font-weight: 500; background: var(--wa-states); color: #1a1600; border: 0; border-radius: 999px; padding: 2px 9px; cursor: pointer; }
    .empty { opacity: .6; padding: 24px; text-align: center; }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 0; }
    .insp-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--wa-line); position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    .crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 13px; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--primary-text-color); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--primary-text-color); font-weight: 500;
    }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand { flex: none; font: inherit; font-size: 12px; font-weight: 500; color: var(--primary-color); background: transparent; border: 0; padding: 3px 4px; cursor: pointer; }
    .insp-body { padding: 14px 14px 30px; }
    .empty-insp { padding: 40px 20px; text-align: center; color: var(--wa-muted); display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 13px; }
    .empty-insp svg { width: 40px; height: 40px; opacity: .5; }
    .empty-insp b { color: var(--primary-text-color); font-weight: 500; font-size: 14px; }
    .sec {
      --c: var(--primary-color);
      border: 1px solid color-mix(in srgb, var(--c) 30%, var(--wa-line)); border-radius: 10px;
      background: var(--wa-card); margin-bottom: 10px; overflow: hidden;
    }
    .sec[data-open="true"] { border-color: color-mix(in srgb, var(--c) 60%, var(--wa-line)); }
    .sec-h { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: color-mix(in srgb, var(--c) 10%, var(--wa-card)); cursor: pointer; }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 18%, var(--wa-card)); }
    .sec-h:focus-visible { outline: 2px solid var(--c); outline-offset: -2px; }
    .sec-h .swatch { width: 26px; height: 26px; border-radius: 7px; background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); flex: none; display: grid; place-items: center; }
    .sec-h .swatch svg { width: 15px; height: 15px; }
    .sec-h .tt { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .sec-h h4 { margin: 0; font-size: 14px; font-weight: 500; }
    .sec-h .sum { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sec-h .chev { color: var(--wa-muted); opacity: .7; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 16px; height: 16px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 8px 12px 12px; }
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
    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--primary-text-color);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
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
    .datum.hl { background: color-mix(in srgb, var(--primary-color) 14%, transparent); }
    .datum .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .datum .meta { font-size: 12px; opacity: .7; }
    .branches { display: flex; flex-wrap: wrap; gap: 4px; }
    .branches button {
      font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px;
      border: 1px solid var(--wa-line); background: transparent; color: inherit; cursor: pointer;
    }
    .branches button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    .branches button.live-match { border-color: var(--success-color, #43a047); }
    pre { font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; background: var(--wa-panel); padding: 8px; border-radius: 6px; }
    button.link { font: inherit; background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 0; }
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
    .field input[type=text], .field input[type=number], .field select, .field textarea {
      font: inherit; font-size: 13px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--wa-line);
      background: var(--wa-card); color: inherit; width: 100%; min-width: 0;
    }
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { outline: none; border-color: var(--c, var(--primary-color)); }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 60px; accent-color: var(--c, var(--primary-color)); }
    .field.slider .slider-value { min-width: 44px; text-align: right; opacity: .85; }
    .field.check { grid-template-columns: auto minmax(0, 1fr); gap: 8px; }
    .field.check input { width: 16px; height: 16px; margin: 0; accent-color: var(--c, var(--primary-color)); }
    .field.check > span { color: inherit; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    .field.entity-field, .field.value-chip-field { display: flex; flex-direction: column; gap: 3px; align-items: stretch; }
    .field.entity-field > span, .field.value-chip-field > span { font-size: 12px; }
    .color-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .color-row input[type=color] { width: 32px; height: 26px; padding: 0; border: 1px solid var(--wa-line); border-radius: 6px; background: none; }
    .color-row input[type=range] { flex: 1; min-width: 40px; accent-color: var(--c, var(--primary-color)); }
    .color-row input.hex { width: 90px; flex: none; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 6px; }
    .grid2 .field, .grid4 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid2 .field > span, .grid4 .field > span { font-size: 12px; }
    .grid4 input[type=number] { text-align: right; padding-left: 4px; padding-right: 6px; }
    .row-inline { display: flex; align-items: flex-end; gap: 4px; }
    .row-inline .field { flex: 1; }
    .hint { font-size: 12px; opacity: .75; margin: 4px 0; }
    .hint.warn { opacity: 1; }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border: 1px solid var(--wa-line); border-radius: 999px; }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
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
    button.value-chip:hover { border-color: var(--primary-color); }
    button.value-chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
    .value-chip .chip-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .value-chip .chip-now { max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: .65; }
    .value-chip .chip-caret { opacity: .55; font-size: 11px; }
    .value-pop {
      position: fixed; inset: auto; margin: 0; width: min(430px, calc(100vw - 16px));
      max-height: 70vh; overflow: auto; padding: 10px 14px 14px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--primary-text-color);
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
    tr.forced .row-flag { color: color-mix(in srgb, var(--wa-states) 70%, var(--primary-text-color)); }
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

    /* Entity search. The friendly name and the entity id both matter and both
       are long, so they stack on two lines instead of fighting for one. */
    .entity-field { position: relative; }
    .entity-results { border: 1px solid var(--wa-line); border-radius: 8px; margin-top: 4px; max-height: 300px; overflow: auto; }
    button.ent {
      display: flex; align-items: center; gap: 8px; width: 100%;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 8px;
      background: none; border: none; color: inherit; cursor: pointer;
    }
    button.ent + button.ent { border-top: 1px solid var(--wa-line); }
    button.ent:hover, button.ent.hl { background: var(--wa-panel); }
    .ent .ent-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ent .ent-id { font-size: 11px; opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ent .ent-state { flex: none; font-size: 11px; opacity: .8; max-width: 34%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entity-current { display: flex; gap: 8px; align-items: baseline; font-size: 12px; opacity: .8; margin-top: 3px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Symbol picker */
    .sym-browse { margin: 6px 0; }
    .sym-controls { display: flex; gap: 6px; margin-bottom: 6px; }
    .sym-controls input[type=search] { flex: 1; min-width: 0; }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 4px; max-height: 240px; overflow-y: auto; padding: 2px; }
    .sym-grid.one-row { display: flex; flex-wrap: nowrap; max-height: none; overflow-x: auto; overflow-y: hidden; }
    .sym-grid.one-row button.sym { flex: 0 0 64px; }
    button.sym { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px 2px; background: none; cursor: pointer; color: var(--primary-text-color); border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
    button.sym:hover { border-color: var(--wa-line); background: var(--wa-panel); }
    button.sym.on { border-color: var(--primary-color); }
    .sym-glyph { display: flex; align-items: center; justify-content: center; height: 24px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-none { font-size: 14px; opacity: .4; }
    .sym-name { font-size: 9px; line-height: 1.1; text-align: center; opacity: .8; overflow-wrap: anywhere; max-height: 22px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(mo);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=Ti(i.left)),typeof i.right=="number"&&(this.colRight=Ti(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(mo,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}renderGutter(n){return u`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=uo:this.colRight=ho,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let r=i.currentTarget,a=i.clientX,o=yo(this.panelWidth,this.colLeft,this.colRight),l=n==="left"?o.left:o.right;r.setPointerCapture(i.pointerId),r.classList.add("dragging");let s=p=>{if(p.pointerId!==i.pointerId)return;let h=p.clientX-a,v=Ti(n==="left"?l+h:l-h);n==="left"?this.colLeft=v:this.colRight=v},d=p=>{p.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{r.classList.remove("dragging"),r.removeEventListener("pointermove",s),r.removeEventListener("pointerup",d),r.removeEventListener("pointercancel",d);try{r.releasePointerCapture(i.pointerId)}catch{}};r.addEventListener("pointermove",s),r.addEventListener("pointerup",d),r.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(a=>a!==void 0),r=n.inline?.countdownEnd!==void 0||i.some(a=>a.bezelCountdownEnd!==void 0||a.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));r&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!r&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("inspect")){let i=n.get("inspect");(i===void 0||Ei(i)!==Ei(this.inspect))&&(this.openSections=new Set(vi))}}updated(n){let i=Ei(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let r=this.renderRoot.querySelector(".column.inspector");r&&(r.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("hass")&&this.draft){let r={};for(let l of this.compiled?.entities.keys()??[])r[l]=this.hass.states[l]?.last_updated;let a=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(r);a!==o&&(this.lastStatesSnapshot=r,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],r=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,a=pd[n.key];if(a&&!r&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(a.dx,a.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}(n.metaKey||n.ctrlKey)&&(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!r?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!r&&(n.preventDefault(),this.redo()))}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await Ki(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(r=>r.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${ze(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=Br(this.owners.find(r=>r.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await Xi(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await Wi(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(r=>({slot:r.slot,name:r.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(r=>r.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${ze(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=We.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),r=gr(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:r.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${r.slice(0,5).join(", ")}${r.length>5?` and ${r.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=ze(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new We(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return sr(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await qi(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=ze(n)}}renderSendButton(){let n=Er({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return f;let i=Tr(n),r=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return u`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${r}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<zn}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(this.draft){try{this.compiled=Xn(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0,this.compiled?.document!==this.compiledDocument&&(this.compiledDocument=this.compiled?.document,this.scheduleTemplates(cd))}}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new Se(this.buildContext());return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,r)=>this.mutate(i,r),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,r)=>this.setForced(i,r),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i)}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||Zr(n.app_version):!0}get canvasFamily(){if(Tt(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&Wr(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Kr(n)[0]??"rectangular")}addShape(n){this.mutate(i=>qr(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!it(i,n))return;let r=Yr(i,n);r.length>0&&!window.confirm(`Remove the ${N(n)} layout? This drops ${r.join(", ")}.`)||(this.mutate(a=>jr(a,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(yr("New complication",this.freeSlot(),[n]))}setForced(n,i){let r=new Map(this.forced);i==="live"?r.delete(n):r.set(n,i),this.forced=r}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=j(),l.slotIndex=o,i=new We(l,null)}let r=i.encoded(),a=await ji(this.hass,this.ownerId,r,i.baseRevision);if(!a.ok||!a.record){a.error==="conflict"?this.conflict={current:a.current??null,message:a.message??"Someone else saved this complication first."}:this.saveError=a.message??a.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=a.record.id,this.draft=We.fromDocument(a.record.document,a.record.revision),this.savedName=String(a.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=ze(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await Yi(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=ze(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=j(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await Ji(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(r){this.moveError=ze(r)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},dd)}async refreshTemplates(){let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let r=(await Zi(this.hass,{doc:n})).doc;if(!r)return;if(!r.ok){this.templateError=r.error;return}let a=Ar(r.value);if(!a){this.templateError="Template did not render to a JSON object";return}this.templateResults=a.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=ze(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let r=this.hass.states[i];if(!r)continue;let a=r.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??r.state,unitOfMeasurement:typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=r.state,typeof a.finishes_at=="string"&&(l.finishesAt=a.finishes_at);let s=yd(a.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof a.entity_picture=="string"&&(l.entityPicture=a.entity_picture),n.set(i,l)}return{entityStates:n,templateResults:this.templateResults,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return u`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let a=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return a?Un(i,a):void 0}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let r=this.hitLayerId(i);this.togglePicking(!1),r&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:r})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let r=i.target,a=r.closest("[data-handle]")?.getAttribute("data-handle"),o=r.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=r.closest("svg"),s=r.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||r.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let b=this.focusTapId();if(b!==void 0&&o===b&&l&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,l,b,a??void 0);return}let E=this.hitLayerId(i);E?this.inspect={kind:"layer",id:E}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let c=fo(i);if(!c&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let p=Un(this.draft.config,o),h=this.draft.config.elements.find(b=>b.payload.id===p);if(!p||!h)return;if(c){i.preventDefault(),this.togglePick(p);return}let v=Be(this.draft.config,p);if(v?.locked&&!a&&!d){this.beginGroupGesture(n,i,l,v);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},a))return;i.preventDefault();let g=ue(this.draft.config,n,h).frame,x=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=p;let b=h.payload,E=he[n],w=g.width*E.width,m=g.height*E.height,y={x:0,y:0,w,h:m,cx:w/2,cy:m/2},$=Qt(b,y,Zt(new Date));if(this.cancelGesture?.(),s){let k=x.width/E.width,L=b.timestampSize;this.cancelGesture=ka(l,i,s,{w:$.w*k,h:$.h*k},(_,I)=>{let H=Math.min(40,Math.max(4,Math.round(L*_)));this.mutate(G=>{let Y=G.elements.find(xn=>xn.payload.id===p);Y?.kind==="image"&&(Y.payload.timestampSize=H)},`ts-size-${p}`),I&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let F={x:0,y:0,w:g.width*x.width,h:g.height*x.height},P=ke(b)?{x:b.timestampX,y:b.timestampY}:{x:($.x+$.w/2)/y.w,y:($.y+$.h/2)/y.h},V=!1;this.cancelGesture=$a(l,F,i,P,(k,L,_)=>{_||(V=!0),V&&this.mutate(I=>{let H=I.elements.find(G=>G.payload.id===p);H?.kind==="image"&&(H.payload.timestampX=k,H.payload.timestampY=L)},`ts-${p}`),_&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=ln(l,x,i,{elementId:p,frame:g,handle:a??void 0},{onFrame:(b,E,w)=>{this.mutate(m=>de(m,n,b,{frame:E}),`drag-${b}-${n}`),w&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,r,a){let o=this.draft?.config;if(!o)return;let l=Ie(o,a.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==a.id)&&(this.inspect={kind:"group",id:a.id}),i.preventDefault();let s=new Map(l.map(b=>[b.payload.id,ue(o,n,b).frame])),d=[...s.values()],c=Math.min(...d.map(b=>b.x)),p=Math.min(...d.map(b=>b.y)),h=Math.max(...d.map(b=>b.x+b.width)),v=Math.max(...d.map(b=>b.y+b.height)),g={x:c,y:p,width:h-c,height:v-p,rotationDegrees:0},x=b=>Math.round(b*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=ln(r,this.gestureCanvas(n),i,{elementId:a.id,frame:g},{onFrame:(b,E,w)=>{let m=E.x-g.x,y=E.y-g.y;this.mutate($=>{for(let[F,P]of s)de($,n,F,{frame:{...P,x:x(P.x+m),y:x(P.y+y)}})},`drag-group-${a.id}-${n}`),w&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,r){let a=this.draft?.config;if(!a||!this.canEdit||this.showTaps||this.picking)return!1;let o=r?xa:1,l=n*o,s=i*o,d=this.canvasFamily,c=he[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let b=this.inspect.id;return this.nudgeMany(Ie(a,b).map(E=>E.payload.id),d,c,`nudge-group-${b}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let p=this.inspect.id,h=a.elements.find(b=>b.payload.id===p);if(!h)return!1;let v=Be(a,p);if(v?.locked)return this.nudgeMany(Ie(a,v.id).map(b=>b.payload.id),d,c,`nudge-group-${v.id}-${d}`,l,s);let g=ue(a,d,h).frame,x=hi(g,l,s,c);return(x.x!==g.x||x.y!==g.y)&&this.mutate(b=>de(b,d,p,{frame:x}),`nudge-${p}-${d}`),!0}nudgeMany(n,i,r,a,o,l){let s=this.draft?.config;if(!s)return!1;let d=y=>Math.round(y*1e3)/1e3,c=new Map;for(let y of n){let $=s.elements.find(F=>F.payload.id===y);$&&c.set(y,ue(s,i,$).frame)}if(c.size===0)return!1;let p=[...c.values()],h=Math.min(...p.map(y=>y.x)),v=Math.min(...p.map(y=>y.y)),g=Math.max(...p.map(y=>y.x+y.width)),x=Math.max(...p.map(y=>y.y+y.height)),b={x:h,y:v,width:g-h,height:x-v,rotationDegrees:0},E=hi(b,o,l,r),w=E.x-b.x,m=E.y-b.y;return(w!==0||m!==0)&&this.mutate(y=>{for(let[$,F]of c)de(y,i,$,{frame:{...F,x:d(F.x+w),y:d(F.y+m)}})},a),!0}nudgeTimestamp(n,i,r,a){let o=this.draft?.config,l=o?.elements.find(b=>b.payload.id===n);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=he[i],c=ue(o,i,l).frame,p=c.width*d.width,h=c.height*d.height,v=Qt(s,{x:0,y:0,w:p,h,cx:p/2,cy:h/2},Zt(new Date)),g=ke(s)?{x:s.timestampX,y:s.timestampY}:{x:p>0?(v.x+v.w/2)/p:.5,y:h>0?(v.y+v.h/2)/h:.5},x=wa(g,r,a,{w:p,h});return(x.x!==g.x||x.y!==g.y)&&this.mutate(b=>{let E=b.elements.find(w=>w.payload.id===n);E?.kind==="image"&&(E.payload.timestampX=x.x,E.payload.timestampY=x.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=Xt(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let r=this.draft?.config.perFamily.corner,a=!!r?.bezelText||!!r?.bezelGauge,o=ri(i.scale,a);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,r=n.elements.find(a=>a.payload.id===i);if(r)return r.kind==="tap"?r.payload.id:me(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,r,a,o){let l=this.draft?.config,s=l?.elements.find(p=>p.payload.id===a);if(!l||!s)return;let d=ae(l,s),c=ue(l,n,s).frame;this.cancelGesture?.(),this.cancelGesture=ln(r,this.gestureCanvas(n),i,{elementId:a,frame:c,handle:o},{onFrame:(p,h,v)=>{this.mutate(g=>{d?xr(g,p,n,h):de(g,n,p,{frame:h})},`tap-box-${p}-${n}`),v&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,r=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:yo(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:f}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!n?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!n?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${a=>{this.selectOwner(a.target.value)}}>
            ${this.owners.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.ownerId}>
              ${Fi(a)} (${a.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":n?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:f}
      ${this.watchSupported?u`<div class="layout cols-${r.columns}"
              style="--wa-left:${r.left}px;--wa-right:${r.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${Qr(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(N).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,r)=>i.slot-r.slot)}shapeDots(n){return u`<span class="shape-dots">${nt.map(i=>u`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${N(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(s=>s.id===this.selectedId),r=n?n.config.name.trim()||"Untitled":"No complication",a=n?n.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(a)}
        <span class="pk-name">${r}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:f}
        ${z("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.map(s=>s.kind==="record"?u`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(hd(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:u`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${n&&n.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(a)}<span class="pk-name">${r}</span><span class="pk-badge">unsaved</span></div>`:f}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${z("plus")}<span class="pk-name">New complication</span>${l<0?u`<span class="pk-badge">watch is full</span>`:f}
          </button>
          ${this.newShapeChooser&&l>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${nt.map(s=>u`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${N(s)}</button>`)}
            </div>
          </div>`:f}`:f}
      </div>`:f}
    </div>`}togglePicker(n=!this.pickerOpen){this.pickerOpen=n,n||(this.newShapeChooser=!1),n?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderBanners(){let n=[],i=this.renderOrphanBanner();if(i&&n.push(i),this.readOnlyReason?n.push(u`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&n.push(u`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let r=this.conflict;n.push(u`<div class="banner err"><b>Save rejected.</b> ${r.message}
        ${r.current?u` The server has revision ${r.current.revision}, saved ${r.current.updatedAt} by ${r.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&n.push(u`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&n.push(u`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),n}renderOrphanBanner(){let n=this.selectedOwner;if(!n?.is_orphan)return;let i=this.owners.filter(r=>!r.is_orphan);return u`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${n.complication_count} complication${n.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?u`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:u`<div class="acts">
              <select @change=${r=>{this.moveTarget=r.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(r=>u`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.moveTarget}>${Fi(r)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return f;let i=n.elements.length>=64;return u`<div class="card">
      <h2 class="panel-title">Add a layer</h2>
      <div class="add-grid">
        ${Jr.map(r=>u`<button class="add" style=${`--k:${Q[r]}`} ?disabled=${i} title=${`Add a blank ${rt[r].toLowerCase()} layer`}
          @click=${()=>{let a=$t(r);this.mutate(o=>{o.elements.push(a)}),this.inspect={kind:"layer",id:a.payload.id}}}>${z(r)}<span>${rt[r]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${fn.map(r=>u`<button class="preset" title=${r.blurb}
          ?disabled=${n.elements.length+r.layerCount>64}
          @click=${()=>this.openPreset(r.kind)}>${r.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,r,a=!1){n!==i&&this.mutate(o=>{let l=o.elements.filter(g=>!ae(o,g)),s=o.elements.filter(g=>ae(o,g)),d=[...l].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let p=o.groups?.find(g=>g.id===n),h=p?d.filter(g=>g.payload.groupId===p.id):d.filter(g=>g.payload.id===n);if(h.length===0||h.includes(c))return;d=d.filter(g=>!h.includes(g));let v;if((p||a)&&c.payload.groupId!==void 0){let g=d.filter(x=>x.payload.groupId===c.payload.groupId);v=r?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else v=d.indexOf(c)+(r?0:1);if(d.splice(v,0,...h),!p){let g=h[0],x=a?void 0:c.payload.groupId;x===void 0?delete g.payload.groupId:g.payload.groupId=x}o.elements=[...d.reverse(),...s],Ae(o),wt(o)})}rowDrag(n,i){return{draggable:i?"true":"false",onStart:r=>{this.dragId=n,r.dataTransfer?.setData("text/plain",n),r.dataTransfer&&(r.dataTransfer.effectAllowed="move"),r.currentTarget.classList.add("dragging")},onEnd:r=>{this.dragId=void 0,r.currentTarget.classList.remove("dragging")},onOver:r=>{if(!this.dragId||this.dragId===n)return;r.preventDefault();let a=r.currentTarget,o=a.getBoundingClientRect(),l=r.clientY<o.top+o.height/2;a.classList.toggle("drop-before",l),a.classList.toggle("drop-after",!l)},onLeave:r=>{r.currentTarget.classList.remove("drop-before","drop-after")},onDrop:r=>{r.preventDefault();let a=r.currentTarget,o=a.classList.contains("drop-before");a.classList.remove("drop-before","drop-after"),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(fo(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,r=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||r===void 0||r===n){this.togglePick(n);return}let a=[...i.elements].filter(s=>!ae(i,s)).reverse().map(s=>s.payload.id),o=a.indexOf(r),l=a.indexOf(n);if(o<0||l<0){this.togglePick(n);return}this.multi=new Set(a.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi],i;this.mutate(r=>{i=mr(r,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return f;let i=this.canEdit,r=this.canvasFamily,a=(m,y)=>this.mutate($=>{let F=$.elements.filter(I=>!ae($,I)),P=$.elements.filter(I=>ae($,I)),V=F.findIndex(I=>I.payload.id===m),k=V+y;if(V<0||k<0||k>=F.length)return;[F[V],F[k]]=[F[k],F[V]];let L=F[k],_=F[V];L.payload.groupId!==_.payload.groupId&&(_.payload.groupId===void 0?delete L.payload.groupId:L.payload.groupId=_.payload.groupId),$.elements=[...F,...P],Ae($),wt($)}),o=m=>{let y;this.mutate($=>{y=kr($,m)}),y&&(this.inspect={kind:"layer",id:y})},l=m=>{this.mutate(y=>$r(y,m)),this.inspect.kind==="layer"&&this.inspect.id===m&&(this.inspect={kind:"general"})},s=[...n.elements].filter(m=>!ae(n,m)).reverse(),d=le(this.host()),c=new Se(this.buildContext()),p=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",v=this.activeFamily==="inline"?"one line of text":`${p?.backgroundColorHex?ge(p.backgroundColorHex):"transparent"} \xB7 ${p?.borderColorHex?`${p.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(m=>n.elements.some(y=>y.payload.id===m)).length,x=(m,y)=>{let $=m.payload.id,F=this.inspect.kind==="layer"&&this.inspect.id===$,P=ue(n,r,m),V=m.payload.isHidden||P.isHidden,k=me(n,$)[0],L=Ft(m.payload.rules),_=this.picking&&this.pickHoverId===$,I=this.rowDrag($,i);return u`<div class="layer ${F?"hl":""} ${_?"pick":""} ${V?"dim":""} ${this.multi.has($)?"multi":""} ${y?"kid":""}"
        style=${`--k:${Q[m.kind]}`} tabindex="0" draggable=${I.draggable}
        @click=${H=>this.clickRow($,H)}
        @keydown=${H=>{H.key==="Enter"&&(this.inspect={kind:"layer",id:$})}}
        @dragstart=${I.onStart} @dragend=${I.onEnd} @dragover=${I.onOver} @dragleave=${I.onLeave} @drop=${I.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${z("grip")}</span>
        <span class="bar"></span>
        <span class="name">
          <b>${m.kind==="icon"?u`<span class="glyph">${this.icons.render(c.resolve(m.payload.symbol)??"questionmark",16,m.payload.colorSlot.baseColorHex)??f}</span>`:f}${_e(m,d)}</b>
          <small><span class="kind">${rt[m.kind]}</span> · ${vd(m,c)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${k?u`<span class="badge tap" title=${`Tappable \xB7 ${_e(k,d)}`}>tap</span>`:f}
            ${m.payload.rules.length===0?f:u`<span class="badge states" title=${L}>${L.replace(/\.$/,"").toLowerCase()}</span>`}
            ${V?u`<span class="badge">hidden</span>`:f}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${H=>{H.stopPropagation(),a($,1)}}>${z("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${H=>{H.stopPropagation(),a($,-1)}}>${z("down")}</button>
            <button class="icon" title=${P.isHidden?`Show in ${N(r)}`:`Hide in ${N(r)}`} aria-label=${P.isHidden?"Show this layer":"Hide this layer"} @click=${H=>{H.stopPropagation(),this.mutate(G=>de(G,r,$,{isHidden:!P.isHidden}))}}>${z(P.isHidden?"hide":"show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${H=>{H.stopPropagation(),o($)}}>${z("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${H=>{H.stopPropagation(),l($)}}>${z("delete")}</button>
          </span>`:f}
        </span>
      </div>`},b=(m,y)=>{let $=this.inspect.kind==="group"&&this.inspect.id===m.id,F=!this.collapsed.has(m.id),P=this.rowDrag(m.id,i),V=y[0],k=y[y.length-1],L=["drop-before","drop-into","drop-after"],_=I=>{let H=I.currentTarget.getBoundingClientRect(),G=(I.clientY-H.top)/H.height;return G<.25?"drop-before":!F&&G>.75?"drop-after":"drop-into"};return u`<div class="layer group ${$?"hl":""}" style=${`--k:${K.group}`} tabindex="0" draggable=${P.draggable}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:m.id}}}
        @keydown=${I=>{I.key==="Enter"&&(this.inspect={kind:"group",id:m.id})}}
        @dragstart=${P.onStart} @dragend=${P.onEnd}
        @dragover=${I=>{if(!this.dragId||this.dragId===m.id)return;I.preventDefault();let H=I.currentTarget,G=_(I);for(let Y of L)H.classList.toggle(Y,Y===G)}}
        @dragleave=${I=>{I.currentTarget.classList.remove(...L)}}
        @drop=${I=>{I.preventDefault();let H=I.currentTarget,G=_(I);H.classList.remove(...L);let Y=this.dragId;if(this.dragId=void 0,!(!Y||!V||!k)){if(G==="drop-before"){this.reorderLayer(Y,V.payload.id,!0,!0);return}if(G==="drop-after"){this.reorderLayer(Y,k.payload.id,!1,!0);return}this.isGroupId(Y)||(this.reorderLayer(Y,V.payload.id,!0),this.mutate(xn=>fr(xn,Y,m.id)))}}}>
        <button class="chev" aria-expanded=${F?"true":"false"} title=${F?"Fold the group":"Unfold the group"}
          @click=${I=>{I.stopPropagation();let H=new Set(this.collapsed);F?H.add(m.id):H.delete(m.id),this.collapsed=H}}>${z("chevron")}</button>
        <span class="bar"></span>
        <span class="name">
          <b>${m.name}</b>
          <small><span class="kind">Group</span> · ${y.length} layer${y.length===1?"":"s"} · ${m.locked?"moves as one":"unlocked"}</small>
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title="Ungroup: keep the layers, drop the folder" aria-label="Ungroup" @click=${I=>{I.stopPropagation(),this.mutate(H=>Gt(H,m.id)),$&&(this.inspect={kind:"general"})}}>${z("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${m.locked?"on":""}" ?disabled=${!i}
            title=${m.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${m.locked?"Unlock the group":"Lock the group"}
            @click=${I=>{I.stopPropagation(),this.mutate(H=>{let G=H.groups?.find(Y=>Y.id===m.id);G&&(G.locked=!G.locked)})}}>${z(m.locked?"lock":"unlock")}</button>
        </span>
      </div>`},E=[],w=new Set;for(let m=0;m<s.length;m++){let y=s[m],$=y.payload.groupId,F=$===void 0?void 0:n.groups?.find(V=>V.id===$);if(!F){E.push(x(y,!1));continue}if(w.has(F.id))continue;w.add(F.id);let P=s.filter(V=>V.payload.groupId===F.id);E.push(b(F,P)),this.collapsed.has(F.id)||E.push(u`<div class="group-kids">${P.map(V=>x(V,!0))}</div>`)}return u`<div class="card">
      <h2 class="panel-title">Layers<span class="spacer"></span><span class="mini">top draws last</span>${this.renderPickButton()}</h2>
      ${this.activeFamily==="inline"?u`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${N(r)} shape.</div>`:f}
      ${g>=2&&i?u`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?u`<div class="hint">${go}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one.</div>`:f}
      ${n.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:f}
      <div class="layers">
      ${E}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${K.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${m=>{m.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${m=>{this.dragId&&(m.preventDefault(),m.currentTarget.classList.add("drop-before"))}}
        @dragleave=${m=>{m.currentTarget.classList.remove("drop-before")}}
        @drop=${m=>{m.preventDefault(),m.currentTarget.classList.remove("drop-before");let y=this.dragId,$=[...s].reverse().find(F=>F.payload.id!==y&&F.payload.groupId!==y);y&&$&&this.reorderLayer(y,$.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${z("shape")}</span>
        <span class="bar"></span>
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${N(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${v}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let n=this.presetKind?so(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?f:u`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${Le(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},r=>{this.presetEntity=r.entityId===""?void 0:r},po,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let r={family:this.canvasFamily},a=this.hass.states[i.entityId];a&&(r.state=a);let o;this.mutate(l=>{o=co(l,n,i,r)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Mr(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let r=this.currentCase(),a=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${St.map(o=>u`<option value=${o.label} ?selected=${o.label===r.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Et.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        ${this.renderShowTapsButton()}
      </div>
      <div class="stage">
        ${a==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(a,i,r)}
        ${this.renderUnder(n,a)}
      </div>
      <div class="strip">
        ${this.renderSettingsRow(n)}
        ${this.renderShapesRow(n,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(n,i,r){let a=i[n];if(!a)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?Be(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||Be(l,o)?.locked)?Ie(l,s).map(g=>g.payload.id):[],c=[...new Set([...d,...this.multi])],p=r.slots[n],h=this.focusTapId(),v={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:p,highlightId:h??o,...c.length>0&&!this.showTaps?{highlightIds:c}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking&&this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(n,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${ai(a,v)}
    </div>`}renderUnder(n,i){let r=le(this.host()),a=this.inspect,o=a.kind==="layer"?n.elements.find(p=>p.payload.id===a.id):void 0,l;if(this.showTaps)l=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Ce(n.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(a.kind==="group"){let p=n.groups?.find(v=>v.id===a.id),h=p?Ie(n,p.id).length:0;l=p?u`editing group <b>${p.name}</b>. ${p.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let p=Be(n,o.payload.id);l=p?.locked?u`editing <b>${_e(o,r)}</b> in <b>${p.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${_e(o,r)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=Xt(s,i),c=Math.round(d.scale*100);return u`<div class="under"><b>${N(i)}</b> · ${s.width} × ${s.height} pt${c!==100?` \xB7 ${c}%`:""} · ${l}</div>`}renderInlinePreview(n,i){let r;if(!n)r=u`<div class="inline-line missing">No inline text</div>`;else{let a=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>a?tt((n.countdownEnd-a)/1e3):n.text,l=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;r=u`<div class="inline-line">${l??f}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?r:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${r}</div>`}renderSettingsRow(n){let i=this.host(),r=this.records.find(c=>c.id===this.selectedId),a=this.selectedOwner,o=[r?`Revision ${r.revision}`:"Not saved yet",a?Fi(a):void 0].filter(Boolean).join(" \xB7 "),l=n.values,s=new Se(this.buildContext()),d=le(i);return u`<div class="strip-row" style=${`--c:${K.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title">Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${Ka(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let c=ja();this.mutate(p=>{p.values.push(c)}),this.inspect={kind:"data",id:c.id}}}>Add</button>`:f}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${l.map(c=>{let p=s.resolve({kind:{kind:"named",id:c.id}}),h=this.inspect.kind==="data"&&this.inspect.id===c.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:c.id}}}>
            <span class="name">${c.name||"(unnamed)"}</span>
            <span class="meta ${p===void 0?"none":""}" title=${se(c.value,d)}>${p??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${v=>{v.stopPropagation(),this.mutate(g=>{g.values=g.values.filter(x=>x.id!==c.id)}),h&&(this.inspect={kind:"general"})}}>${z("delete")}</button>`:f}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let r=n.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title">Shapes</h2>
      <div class="tiles">
        ${nt.map(a=>{if(!r.includes(a))return u`<button class="tile off ${a}" ?disabled=${!this.canEdit} title=${`Add the ${N(a)} shape`} @click=${()=>this.addShape(a)}>
              <span class="art"><span class="ghost ${a}"></span></span>
              <span class="lbl">+ Add ${N(a)}</span>
            </button>`;let l=a===this.activeFamily,s;if(a==="inline")s=this.renderInlinePreview(i.inline,!0);else{let p=i[a];s=p?ai(p,{icons:this.icons,imageSizes:this.imageSizes,slot:Et.slots[a]}):f}let d=a!=="inline"&&n.elements.every(p=>ue(n,a,p).isHidden||p.payload.isHidden)&&n.elements.length>0,c=this.canEdit&&it(n,a);return u`<div class="tile-wrap">
            <button class="tile ${a}" aria-pressed=${l?"true":"false"} title=${`Edit the ${N(a)} shape`}
              @click=${()=>{this.activeFamily=a,a==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${N(a)}${d?u`<small>· nothing shown</small>`:f}${l?u`<small>· editing</small>`:f}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!c}
              title=${c?`Remove the ${N(a)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${N(a)} shape`}
              @click=${p=>{p.stopPropagation(),this.removeShape(a)}}>${z("delete")}</button>`:f}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return f;let i=[...this.compiled?.entities.keys()??[]],r=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title">Values on the watch<span class="spacer"></span>
        ${r?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(a=>{let o=this.hass.states[a],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:a,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",c=this.testValues.get(a),h=n.elements.find(g=>Wt(n,g.payload.id).some(x=>x.ref.entityId===a))?.kind??"text",v=this.editingValue===a;return u`<button class="vchip ${c!==void 0?"testing":""}" style=${`--k:${Q[h]}`}
            title=${c!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=a,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${z(h)}</span><b>${l}</b>
            ${v?u`<input type="text" .value=${c??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(a,g.target.value)} />`:u`<span class="val">${c!==void 0?`${c}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let r=i.trim(),a=new Map(this.testValues),o=this.hass.states[n]?.state;r===""||r===o?a.delete(n):a.set(n,r),this.testValues=a}currentCase(){return St.find(n=>n.label===this.previewCase)??Et}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let r=this.inspect,a=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":N(this.activeFamily),l=r.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${K.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=f,d=f;if(i!==void 0)s=u`<span class="here" style="--k:var(--primary-color)"><span class="kchip">Picked</span>${i} layers</span>`;else if(r.kind==="layer"){let c=n.elements.find(p=>p.payload.id===r.id);if(c){s=u`<span class="here" style=${`--k:${Q[c.kind]}`}><span class="kchip">${rt[c.kind]}</span>${_e(c,le(this.host()))}</span>`;let p=Be(n,c.payload.id);p&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:p.id}}} title="Edit the group">${p.name}</button>`)}}else if(r.kind==="group"){let c=n.groups?.find(p=>p.id===r.id);c&&(s=u`<span class="here" style=${`--k:${K.group}`}><span class="kchip">Group</span>${c.name}</span>`)}else if(r.kind==="data"){let c=n.values.find(p=>p.id===r.id);c&&(s=u`<span class="here" style=${`--k:${K.complication}`}><span class="kchip">Value</span>${c.name||"(unnamed)"}</span>`)}else r.kind==="general"&&(s=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${a}</span><span class="sep">›</span>${l}${d}
      ${s===f?f:u`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return f;let i=this.pickedElements(n);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let r=this.host(),a=this.inspect,o=f,l=!0;if(a.kind==="layer"){let d=n.elements.find(c=>c.payload.id===a.id);if(!d)return this.inspect={kind:"general"},f;o=Ja(r,d,this.canvasFamily)}else if(a.kind==="group"){let d=n.groups?.find(c=>c.id===a.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=Za(r,d)}else if(a.kind==="data"){let d=n.values.find(c=>c.id===a.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=u`<div class="sec" data-open="true" style=${`--c:${K.complication}`}>
        <div class="sec-h"><span class="swatch">${z("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${qa(r,d)}</div>
      </div>`}else a.kind==="family"?o=Qa(r,this.activeFamily):(l=!1,o=u`<div class="empty-insp">${z("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${l?u`<button class="expand" @click=${()=>{this.openSections=s?new Set([ud(a)]):new Set(vi)}}>${s?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,r){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${a=>r(a.target.checked)} />
      <span>${n}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:f}</span></label>`}multiEditor(n,i){let r=this.canvasFamily,a=le(this.host()),o=new Se(this.buildContext()),l=Ya(n,r,i),s=i.length,d=[...i].reverse(),c=v=>this.mutate(g=>{for(let x of i)de(g,r,x.payload.id,{isHidden:v})}),p=v=>this.mutate(g=>{for(let x of i){let b=g.elements.find(E=>E.payload.id===x.payload.id);b&&(b.payload.isHidden=v)}}),h=v=>this.mutate(g=>{for(let x of i){let b=g.elements.find(E=>E.payload.id===x.payload.id);b&&b.kind!=="image"&&b.kind!=="tap"&&(b.payload.colorSlot.baseColorHex=v)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--primary-color)">
        <div class="sec-h"><span class="swatch">${z("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(v=>u`<div class="row" style=${`--k:${Q[v.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${v.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(v.payload.symbol)??"questionmark",16,v.payload.colorSlot.baseColorHex)??f}</span>`:f}
                <b>${_e(v,a)}</b><span class="kind">${rt[v.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${go}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${K.place}`}>
        <div class="sec-h"><span class="swatch">${z("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${N(r)}`,l.hiddenHere,c)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,p)}
          ${l.colourable?u`${pe("Colour",l.colour,v=>{v!==void 0&&h(v)})}
              ${l.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:f}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return f;let i=this.records.find(a=>a.id===this.selectedId),r=ra({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${r.tone}">●</span>
        <span class="foot-text">${r.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${n.dirty?u` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?u`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:f}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?u`<pre>${JSON.stringify(n.encoded(),null,2)}</pre>`:f}
      </div>
    </details>`}};A([Ze({attribute:!1})],R.prototype,"hass",2),A([Ze({type:Boolean})],R.prototype,"narrow",2),A([Ze({attribute:!1})],R.prototype,"panel",2),A([M()],R.prototype,"colLeft",2),A([M()],R.prototype,"colRight",2),A([M()],R.prototype,"panelWidth",2),A([M()],R.prototype,"owners",2),A([M()],R.prototype,"ownerId",2),A([M()],R.prototype,"records",2),A([M()],R.prototype,"selectedId",2),A([M()],R.prototype,"draft",2),A([M()],R.prototype,"readOnlyReason",2),A([M()],R.prototype,"parseError",2),A([M()],R.prototype,"maxSchemaVersion",2),A([M()],R.prototype,"presets",2),A([M()],R.prototype,"occupied",2),A([M()],R.prototype,"serverToken",2),A([M()],R.prototype,"appliedToken",2),A([M()],R.prototype,"polling",2),A([M()],R.prototype,"sendPending",2),A([M()],R.prototype,"pages",2),A([M()],R.prototype,"templateResults",2),A([M()],R.prototype,"templateError",2),A([M()],R.prototype,"templateFetchedAt",2),A([M()],R.prototype,"forced",2),A([M()],R.prototype,"showRaw",2),A([M()],R.prototype,"inspect",2),A([M()],R.prototype,"openSections",2),A([M()],R.prototype,"pickerOpen",2),A([M()],R.prototype,"testValues",2),A([M()],R.prototype,"editingValue",2),A([M()],R.prototype,"multi",2),A([M()],R.prototype,"collapsed",2),A([M()],R.prototype,"activeFamily",2),A([M()],R.prototype,"picking",2),A([M()],R.prototype,"pickHoverId",2),A([M()],R.prototype,"showTaps",2),A([M()],R.prototype,"timestampActiveId",2),A([M()],R.prototype,"savedName",2),A([M()],R.prototype,"presetKind",2),A([M()],R.prototype,"presetEntity",2),A([M()],R.prototype,"newShapeChooser",2),A([M()],R.prototype,"previewCase",2),A([M()],R.prototype,"loadError",2),A([M()],R.prototype,"saveError",2),A([M()],R.prototype,"saving",2),A([M()],R.prototype,"conflict",2),A([M()],R.prototype,"remoteRevision",2),A([M()],R.prototype,"confirmDelete",2),A([M()],R.prototype,"moveTarget",2),A([M()],R.prototype,"moving",2),A([M()],R.prototype,"moveError",2),A([M()],R.prototype,"version",2);function ze(e){return String(e?.message??e)}function yd(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function Fi(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function vd(e,t){switch(e.kind){case"text":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${ge(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.style}`;case"shape":return`${ge(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Ce(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",R);export{R as WristAssistantPanel,yo as columnFit};
