var No=Object.defineProperty;var Oo=Object.getOwnPropertyDescriptor;var L=(e,t,n,i)=>{for(var a=i>1?void 0:i?Oo(t,n):t,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(t,n,a):o(a))||a);return i&&a&&No(t,n,a),a};var Nt=globalThis,Ot=Nt.ShadowRoot&&(Nt.ShadyCSS===void 0||Nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,En=Symbol(),Di=new WeakMap,yt=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==En)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Ot&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=Di.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Di.set(n,t))}return t}toString(){return this.cssText}},le=e=>new yt(typeof e=="string"?e:e+"",void 0,En),Tn=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new yt(n,e,En)},Bi=(e,t)=>{if(Ot)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),a=Nt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=n.cssText,e.appendChild(i)}},Fn=Ot?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return le(n)})(e):e;var{is:Vo,defineProperty:Do,getOwnPropertyDescriptor:Bo,getOwnPropertyNames:Go,getOwnPropertySymbols:Uo,getPrototypeOf:Ko}=Object,Vt=globalThis,Gi=Vt.trustedTypes,Wo=Gi?Gi.emptyScript:"",jo=Vt.reactiveElementPolyfillSupport,bt=(e,t)=>e,vt={toAttribute(e,t){switch(t){case Boolean:e=e?Wo:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Dt=(e,t)=>!Vo(e,t),Ui={attribute:!0,type:String,converter:vt,reflect:!1,useDefault:!1,hasChanged:Dt};Symbol.metadata??=Symbol("metadata"),Vt.litPropertyMetadata??=new WeakMap;var Ee=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Ui){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,n);a!==void 0&&Do(this.prototype,t,a)}}static getPropertyDescriptor(t,n,i){let{get:a,set:r}=Bo(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ui}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;let t=Ko(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){let n=this.properties,i=[...Go(n),...Uo(n)];for(let a of i)this.createProperty(a,n[a])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,a]of n)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let a=this._$Eu(n,i);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)n.unshift(Fn(a))}else t!==void 0&&n.push(Fn(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:vt).toAttribute(n,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,n){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:vt;this._$Em=a;let l=o.fromAttribute(n,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Dt)(r,n)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Ee.elementStyles=[],Ee.shadowRootOptions={mode:"open"},Ee[bt("elementProperties")]=new Map,Ee[bt("finalized")]=new Map,jo?.({ReactiveElement:Ee}),(Vt.reactiveElementVersions??=[]).push("2.1.2");var _n=globalThis,Ki=e=>e,Bt=_n.trustedTypes,Wi=Bt?Bt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Zi="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,Qi="?"+Ae,qo=`<${Qi}>`,Be=document,wt=()=>Be.createComment(""),$t=e=>e===null||typeof e!="object"&&typeof e!="function",zn=Array.isArray,Yo=e=>zn(e)||typeof e?.[Symbol.iterator]=="function",Rn=`[ 	
\f\r]`,xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ji=/-->/g,qi=/>/g,Ve=RegExp(`>|${Rn}(?:([^\\s"'>=/]+)(${Rn}*=${Rn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yi=/'/g,Ji=/"/g,ea=/^(?:script|style|textarea|title)$/i,Pn=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),p=Pn(1),k=Pn(2),ac=Pn(3),Ge=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Xi=new WeakMap,De=Be.createTreeWalker(Be,129);function ta(e,t){if(!zn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wi!==void 0?Wi.createHTML(t):t}var Jo=(e,t)=>{let n=e.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=xt;for(let l=0;l<n;l++){let s=e[l],d,u,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,u=o.exec(s),u!==null);)h=o.lastIndex,o===xt?u[1]==="!--"?o=ji:u[1]!==void 0?o=qi:u[2]!==void 0?(ea.test(u[2])&&(a=RegExp("</"+u[2],"g")),o=Ve):u[3]!==void 0&&(o=Ve):o===Ve?u[0]===">"?(o=a??xt,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?Ve:u[3]==='"'?Ji:Yi):o===Ji||o===Yi?o=Ve:o===ji||o===qi?o=xt:(o=Ve,a=void 0);let y=o===Ve&&e[l+1].startsWith("/>")?" ":"";r+=o===xt?s+qo:c>=0?(i.push(d),s.slice(0,c)+Zi+s.slice(c)+Ae+y):s+Ae+(c===-2?l:y)}return[ta(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},kt=class e{constructor({strings:t,_$litType$:n},i){let a;this.parts=[];let r=0,o=0,l=t.length-1,s=this.parts,[d,u]=Jo(t,n);if(this.el=e.createElement(d,i),De.currentNode=this.el.content,n===2||n===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(a=De.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let c of a.getAttributeNames())if(c.endsWith(Zi)){let h=u[o++],y=a.getAttribute(c).split(Ae),g=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:g[2],strings:y,ctor:g[1]==="."?Mn:g[1]==="?"?An:g[1]==="@"?Hn:rt}),a.removeAttribute(c)}else c.startsWith(Ae)&&(s.push({type:6,index:r}),a.removeAttribute(c));if(ea.test(a.tagName)){let c=a.textContent.split(Ae),h=c.length-1;if(h>0){a.textContent=Bt?Bt.emptyScript:"";for(let y=0;y<h;y++)a.append(c[y],wt()),De.nextNode(),s.push({type:2,index:++r});a.append(c[h],wt())}}}else if(a.nodeType===8)if(a.data===Qi)s.push({type:2,index:r});else{let c=-1;for(;(c=a.data.indexOf(Ae,c+1))!==-1;)s.push({type:7,index:r}),c+=Ae.length-1}r++}}static createElement(t,n){let i=Be.createElement("template");return i.innerHTML=t,i}};function at(e,t,n=e,i){if(t===Ge)return t;let a=i!==void 0?n._$Co?.[i]:n._$Cl,r=$t(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=a:n._$Cl=a),a!==void 0&&(t=at(e,a._$AS(e,t.values),a,i)),t}var In=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,a=(t?.creationScope??Be).importNode(n,!0);De.currentNode=a;let r=De.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new Ct(r,r.nextSibling,this,t):s.type===1?d=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(d=new Ln(r,this,t)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=De.nextNode(),o++)}return De.currentNode=Be,a}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},Ct=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=at(this,t,n),$t(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==Ge&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Yo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(Be.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=kt.createElement(ta(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new In(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=Xi.get(t.strings);return n===void 0&&Xi.set(t.strings,n=new kt(t)),n}k(t){zn(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,a=0;for(let r of t)a===n.length?n.push(i=new e(this.O(wt()),this.O(wt()),this,this.options)):i=n[a],i._$AI(r),a++;a<n.length&&(this._$AR(i&&i._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=Ki(t).nextSibling;Ki(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},rt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(t,n=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=at(this,t,n,0),o=!$t(t)||t!==this._$AH&&t!==Ge,o&&(this._$AH=t);else{let l=t,s,d;for(t=r[0],s=0;s<r.length-1;s++)d=at(this,l[i+s],n,s),d===Ge&&(d=this._$AH[s]),o||=!$t(d)||d!==this._$AH[s],d===f?t=f:t!==f&&(t+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Mn=class extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},An=class extends rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},Hn=class extends rt{constructor(t,n,i,a,r){super(t,n,i,a,r),this.type=5}_$AI(t,n=this){if((t=at(this,t,n,0)??f)===Ge)return;let i=this._$AH,a=t===f&&i!==f||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Ln=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}};var Xo=_n.litHtmlPolyfillSupport;Xo?.(kt,Ct),(_n.litHtmlVersions??=[]).push("3.3.3");var na=(e,t,n)=>{let i=n?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=n?.renderBefore??null;i._$litPart$=a=new Ct(t.insertBefore(wt(),r),r,void 0,n??{})}return a._$AI(e),a};var Nn=globalThis,He=class extends Ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=na(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ge}};He._$litElement$=!0,He.finalized=!0,Nn.litElementHydrateSupport?.({LitElement:He});var Zo=Nn.litElementPolyfillSupport;Zo?.({LitElement:He});(Nn.litElementVersions??=[]).push("4.2.2");var Qo={attribute:!0,type:String,converter:vt,reflect:!1,hasChanged:Dt},es=(e=Qo,t,n)=>{let{kind:i,metadata:a}=n,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=n;return function(l){let s=this[o];t.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function ot(e){return(t,n)=>typeof n=="object"?es(e,t,n):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,t,n)}function _(e){return ot({...e,state:!0,attribute:!1})}var Te="wrist_assistant/complications";async function ia(e){return e.connection.sendMessagePromise({type:`${Te}/owners`})}async function aa(e,t){return e.connection.sendMessagePromise({type:`${Te}/list`,owner_watch_id:t})}async function ra(e,t){return e.connection.sendMessagePromise({type:`${Te}/nudge`,owner_watch_id:t})}async function oa(e,t,n,i){return e.connection.sendMessagePromise({type:`${Te}/save`,owner_watch_id:t,document:n,base_revision:i})}async function sa(e,t,n,i){return e.connection.sendMessagePromise({type:`${Te}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function la(e,t,n){return e.connection.sendMessagePromise({type:`${Te}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function da(e,t,n){let i={type:`${Te}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function ca(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Te}/render_values`,templates:t})).results}async function ua(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Te}/history_series`,requests:t})).results}var Z=["rectangular","circular","corner"],ge={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},ts=["rectangular","circular","corner","inline"];var Vn=64;function xa(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<Vn;i++)if(!n.has(i))return i;return-1}function St(e){return Z.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var wa={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},ce={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},jt="#FF6B35",qt="#32D74B",Dn=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Bn=2,Gn=120;function $a(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?Math.max(Bn,Math.min(Gn,t)):24}function ka(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function je(e){let t=ka(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${$a(e)}`}function Ca(e){return Un(e).map(t=>t.key).sort().join(";")}function Un(e){let t=new Map;for(let n of e.elements){if(n.kind!=="chart")continue;let i=je(n.payload),a=ka(n.payload);i===void 0||a===void 0||t.has(i)||t.set(i,{key:i,entityId:a,minutes:Math.round(n.payload.historyMinutes),points:$a(n.payload)})}return[...t.values()]}var Et=6,Tt=9,ns=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Fe(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Kn(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Wn={top:0,left:0,bottom:0,right:0};function Yt(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var jn=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Re(e){let t=jn.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function j(e,t=""){return typeof e=="string"?e:t}function V(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function we(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Wt(e){return e==null?void 0:V(e,0)}function xe(e){return typeof e=="string"?e:void 0}var $e=class extends Error{};function Ke(e){if(typeof e.entityId!="string")throw new $e("entityId is required");let t={entityId:e.entityId,displayName:j(e.displayName),domain:j(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function pa(e){if(!F(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=V(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=V(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=V(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),ke(t)?void 0:t}function ke(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function is(e){let t=j(e.function,"count"),n=F(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(F).map(Ke)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let a={function:t,scope:i};if(F(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:j(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function ha(e){switch(e.kind){case"literal":return{kind:"literal",value:j(e.value)};case"entityState":return{kind:"entityState",...Ke(e)};case"entityAttribute":return{kind:"entityAttribute",...Ke(e),attribute:j(e.attribute)};case"entityAge":return{kind:"entityAge",...Ke(e)};case"aggregate":return{kind:"aggregate",aggregate:is(F(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:xe(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:j(e.value)};case"named":return{kind:"named",id:j(e.id).toUpperCase()};default:throw new $e(`unknown value kind ${String(e.kind)}`)}}function te(e){if(!F(e))throw new $e("value must be an object");if(F(e.kind)){let i={kind:ha(e.kind)},a=pa(e.format);return a&&(i.format=a),i}let t={kind:ha(e)},n=pa(e.format);return n&&(t.format=n),t}function Sa(e){return F(e)?{x:V(e.x,.25),y:V(e.y,.25),width:V(e.width,.5),height:V(e.height,.5),rotationDegrees:V(e.rotationDegrees,0)}:{...wa}}function as(e){if(!F(e))return{kind:"isOn"};let t=j(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=F(e.value)?te(e.value):I("");break;case"between":n.value=F(e.value)?te(e.value):I(""),n.upper=F(e.upper)?te(e.upper):I("");break;case"matchesRegex":n.pattern=j(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function ma(e){if(!F(e))return{kind:"show"};let t=j(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=F(e.value)?te(e.value):I("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=V(e.number,0);break;case"setFontWeight":n.weight=xe(e.weight)??"regular";break;default:break}return n}function Ea(e){return Array.isArray(e)?e.filter(F).map(t=>{let n={id:j(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(F).map(i=>{let a=F(i.when)?i.when:{};return{id:j(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(F).map(r=>({id:j(r.id).toUpperCase(),value:F(r.value)?te(r.value):I(""),comparison:as(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(ma)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(ma)),n}):[]}function rs(e,t){return{baseColorHex:F(e)?j(e.baseColorHex,t):t}}function Ue(e,t){if(typeof e.id!="string")throw new $e("element id is required");return{id:e.id.toUpperCase(),colorSlot:rs(e.colorSlot,t),rules:Ea(e.rules),frame:Sa(e.frame),isHidden:e.isHidden===!0}}function os(e){let t=ss(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function ss(e){if(!F(e)||!F(e.payload))throw new $e("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...Ue(t,"#FFFFFF"),value:F(t.value)?te(t.value):I(""),fontSize:V(t.fontSize,14),fontWeight:xe(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...Ue(t,"#FFFFFF"),symbol:F(t.symbol)?te(t.symbol):I("lightbulb"),size:V(t.size,14)}};case"gauge":return{kind:"gauge",payload:{...Ue(t,"#FFFFFF"),value:F(t.value)?te(t.value):I("50"),minValue:V(t.minValue,0),maxValue:V(t.maxValue,100),style:xe(t.style)??"arc",lineWidth:V(t.lineWidth,4),trackColorHex:j(t.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...Ue(t,"#FFFFFF"),value:F(t.value)?te(t.value):I("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(V(t.historyMinutes,0))),historyPoints:Math.round(V(t.historyPoints,24)),style:xe(t.style)??"bars",limit:Math.max(0,Math.round(V(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:xe(t.scale)??"auto",minValue:V(t.minValue,0),maxValue:V(t.maxValue,100),baseline:xe(t.baseline)??"lowest",barGap:V(t.barGap,1.5),lineWidth:V(t.lineWidth,2),highlight:xe(t.highlight)??"none",highColorHex:j(t.highColorHex,jt),lowColorHex:j(t.lowColorHex,qt),marker:xe(t.marker)??"pointer"}};case"shape":{let n={...Ue(t,"#FFFFFF33"),kind:xe(t.kind)??"roundedRectangle",cornerRadius:V(t.cornerRadius,6),borderWidth:V(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=Ue(t,"#FFFFFF"),a={...i,entity:Ke(F(t.entity)?t.entity:{}),contentMode:t.contentMode==="fit"?"fit":"fill",zoom:V(t.zoom,1),panX:V(t.panX,0),panY:V(t.panY,0),cornerRadius:V(t.cornerRadius,Et),timestampCorner:ns.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:V(t.timestampSize,Tt)};t.timestamp===!0&&(a.timestamp=!0);let r=Wt(t.timestampX),o=Wt(t.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=we(r),a.timestampY=we(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:n,...i}=Ue(t,"#FFFFFF"),a={...i,action:F(t.action)?Ta(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(a.openPageId=t.openPageId),typeof t.openPageName=="string"&&(a.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(a.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new $e(`unknown element kind ${String(e.kind)}`)}}function fa(e){let t=F(e)?e:{},n={};if(F(t.placements))for(let[a,r]of Object.entries(t.placements)){if(!F(r))continue;let o={frame:Sa(r.frame),isHidden:r.isHidden===!0},l=Wt(r.size);l!==void 0&&(o.size=l),n[a.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:V(t.borderWidth,2),rules:Ea(t.rules)};if(F(t.bezelText)&&(i.bezelText=te(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),F(t.curvedText)&&(i.curvedText=te(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),F(t.bezelGauge)){let a=t.bezelGauge,r={value:F(a.value)?te(a.value):I("50"),minValue:V(a.minValue,0),maxValue:V(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};F(a.minLabel)&&(r.minLabel=te(a.minLabel)),F(a.maxLabel)&&(r.maxLabel=te(a.maxLabel)),i.bezelGauge=r}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function ls(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=fa(e[n+1]))}else if(F(e))for(let[n,i]of Object.entries(e))t[n]=fa(i);return t}function ds(e){let t={value:F(e.value)?te(e.value):I("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function Ta(e){if(!F(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Ke(e)};default:return{type:"none"}}}function Fa(e){if(!F(e))throw new $e("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new $e(`${r} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(F).map(r=>({id:j(r.id).toUpperCase(),name:j(r.name),value:F(r.value)?te(r.value):I("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(F).map(r=>r.kind==="template"?{kind:"template",value:j(r.value)}:r.kind==="entity"?{kind:"entity",...Ke(r)}:null).filter(r=>r!==null),i={schemaVersion:V(e.schemaVersion,1),id:j(e.id).toUpperCase(),name:j(e.name,"Custom"),values:t,slotIndex:V(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(os),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:ls(e.perFamily),dataSources:n,tapAction:Ta(e.tapAction)};F(e.inline)&&(i.inline=ds(e.inline));let a=Wt(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(F).filter(o=>typeof o.id=="string").map(o=>({id:j(o.id).toUpperCase(),name:j(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return _e(i),i}function U(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function We(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function cs(e){let t={};return e.decimals!==void 0&&(t.decimals=U(e.decimals)),e.multiply!==void 0&&(t.multiply=U(e.multiply)),e.offset!==void 0&&(t.offset=U(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function us(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(We)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function ps(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...We(e)};case"entityAttribute":return{kind:"entityAttribute",...We(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...We(e)};case"aggregate":return{kind:"aggregate",aggregate:us(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id}}}function J(e){let t={kind:ps(e.kind)};return ke(e.format)||(t.format=cs(e.format)),t}function Ut(e){return{x:U(e.x),y:U(e.y),width:U(e.width),height:U(e.height),rotationDegrees:U(e.rotationDegrees)}}function hs(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=J(e.value??I(""));break;case"between":t.value=J(e.value??I("")),t.upper=J(e.upper??I(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function ga(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=J(e.value??I(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=U(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function Kt(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:J(a.value),comparison:hs(a.comparison)}))},then:i.then.map(ga)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(ga)),n})}function ms(e){let t=fs(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function fs(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:Kt(n.rules),frame:Ut(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:J(e.payload.value),fontSize:U(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:J(e.payload.symbol),size:U(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...t(e.payload),value:J(e.payload.value),minValue:U(e.payload.minValue),maxValue:U(e.payload.maxValue),style:e.payload.style,lineWidth:U(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...t(e.payload),value:J(e.payload.value),historyMinutes:Math.max(0,Math.round(e.payload.historyMinutes)),historyPoints:Math.round(e.payload.historyPoints),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:U(e.payload.minValue),maxValue:U(e.payload.maxValue),baseline:e.payload.baseline,barGap:U(e.payload.barGap),lineWidth:U(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker}};case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:U(e.payload.cornerRadius),borderWidth:U(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:We(n.entity),rules:Kt(n.rules),frame:Ut(n.frame),isHidden:n.isHidden};n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=U(n.zoom)),n.panX!==0&&(i.panX=U(n.panX)),n.panY!==0&&(i.panY=U(n.panY)),n.cornerRadius!==Et&&(i.cornerRadius=U(n.cornerRadius));let a=Fe(n),r=a?Kn(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),n.timestampSize!==Tt&&(i.timestampSize=U(n.timestampSize)),a&&(i.timestampX=U(n.timestampX),i.timestampY=U(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:Ra(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=Kt(n.rules),i.frame=Ut(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function gs(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let a of n){let r=e.placements[a],o={frame:Ut(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=U(r.size)),i[a]=o}t.placements=i}if(e.bezelText&&(t.bezelText=J(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=J(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:J(i.value),minValue:U(i.minValue),maxValue:U(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=J(i.minLabel)),i.maxLabel&&(a.maxLabel=J(i.maxLabel)),t.bezelGauge=a}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=U(e.borderWidth),e.rules.length>0&&(t.rules=Kt(e.rules)),t}function Ra(e){return"entityId"in e?{type:e.type,...We(e)}:{type:e.type}}function ys(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=J(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function Jt(e){let t=[];for(let i of Z){let a=e.perFamily[i];a&&t.push(i,gs(a))}let n={schemaVersion:St(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:J(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(ms),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...We(i)}),tapAction:Ra(e.tapAction)};return e.inline!==void 0&&(n.inline=ys(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function qe(e,t){let i=e.elements.find(a=>a.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Le(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!de(e,n))}function _e(e){let t=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!t.has(a.payload.groupId)&&delete a.payload.groupId;let n=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>n.has(a.id));i.length===0?delete e.groups:e.groups=i}function Ft(e){if(!e.groups?.length)return;let t=e.elements.filter(r=>!de(e,r)),n=e.elements.filter(r=>de(e,r)),i=[],a=new Set;for(let r=t.length-1;r>=0;r--){let o=t[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=t.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...n],Ye(e)}function Ia(e,t,n="Group"){let i=e.elements.filter(r=>t.includes(r.payload.id)&&!de(e,r));if(i.length<2)return;let a={id:Y(),name:n,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return _e(e),Ft(e),a.id}function Xt(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;_e(e)}function Ma(e,t,n){let i=e.elements.find(a=>a.payload.id===t);!i||de(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,_e(e),Ft(e))}var G={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},ya={literal:["kind","value"],entityState:["kind",...G.entityRef],entityAttribute:["kind",...G.entityRef,"attribute"],entityAge:["kind",...G.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"]};function Aa(e){let t=[],n=(s,d,u)=>{if(F(s))for(let c of Object.keys(s))d.includes(c)||t.push(`${u}.${c}`)},i=(s,d)=>{if(!F(s))return;let u=typeof s.kind=="string"?s.kind:"";n(s,ya[u]??["kind"],d),u==="aggregate"&&F(s.aggregate)&&(n(s.aggregate,G.aggregate,`${d}.aggregate`),n(s.aggregate.scope,G.scope,`${d}.aggregate.scope`),F(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((c,h)=>n(c,G.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(s.aggregate.stateFilter,G.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(F(s)){if(F(s.kind))n(s,G.value,d),i(s.kind,`${d}.kind`);else{let u=typeof s.kind=="string"?s.kind:"";n(s,[...ya[u]??["kind"],"format"],d),u==="aggregate"&&i(s,d)}n(s.format,G.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((u,c)=>{n(u,G.styleChange,`${d}[${c}]`),F(u)&&a(u.value,`${d}[${c}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((u,c)=>{let h=`${d}[${c}]`;n(u,G.rule,h),F(u)&&(Array.isArray(u.cases)&&u.cases.forEach((y,g)=>{let w=`${h}.cases[${g}]`;n(y,G.case,w),F(y)&&(n(y.when,G.condition,`${w}.when`),F(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((x,E)=>{let $=`${w}.when.tests[${E}]`;n(x,G.test,$),F(x)&&(a(x.value,`${$}.value`),n(x.comparison,G.comparison,`${$}.comparison`),F(x.comparison)&&(a(x.comparison.value,`${$}.comparison.value`),a(x.comparison.upper,`${$}.comparison.upper`)))}),r(y.then,`${w}.then`))}),r(u.otherwise,`${h}.otherwise`))})};if(!F(e))return t;n(e,G.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>n(s,G.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{n(s,G.named,`$.values[${d}]`),F(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let u=`$.elements[${d}]`;if(n(s,G.elementEnvelope,u),!F(s)||!F(s.payload))return;let c=typeof s.kind=="string"?s.kind:"",h=G[c]??[];n(s.payload,[...G.elementBase,...h],`${u}.payload`),n(s.payload.colorSlot,G.colorSlot,`${u}.payload.colorSlot`),n(s.payload.frame,G.frame,`${u}.payload.frame`),o(s.payload.rules,`${u}.payload.rules`);for(let y of["value","symbol"])y in s.payload&&a(s.payload[y],`${u}.payload.${y}`);c==="image"&&n(s.payload.entity,G.entityRef,`${u}.payload.entity`),c==="tap"&&n(s.payload.action,G.tapAction,`${u}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else F(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let u=`$.perFamily.${s}`;if(n(d,G.layout,u),!!F(d)){if(F(d.placements))for(let[c,h]of Object.entries(d.placements))n(h,G.placement,`${u}.placements.${c}`),F(h)&&n(h.frame,G.frame,`${u}.placements.${c}.frame`);if(a(d.bezelText,`${u}.bezelText`),a(d.curvedText,`${u}.curvedText`),F(d.bezelGauge)){let c=`${u}.bezelGauge`;n(d.bezelGauge,G.bezelGauge,c),a(d.bezelGauge.value,`${c}.value`),a(d.bezelGauge.minLabel,`${c}.minLabel`),a(d.bezelGauge.maxLabel,`${c}.maxLabel`)}o(d.rules,`${u}.rules`)}}return F(e.inline)&&(n(e.inline,G.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>n(s,G.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,G.tapAction,"$.tapAction"),t}function Y(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function qn(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Ha(e,t,n=[...Z]){let i={};for(let r of Z)n.includes(r)&&(i[r]=qn());let a={schemaVersion:4,id:Y(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:ts.filter(r=>n.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(a.inline={value:I("Text")}),a.schemaVersion=St(a),a}function Rt(e){let t=n=>({id:Y(),colorSlot:{baseColorHex:n},rules:[],frame:{...wa},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:I("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:I("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:I("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:I("13,14,16,17,19,22,24,28,30"),historyMinutes:0,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:jt,lowColorHex:qt,marker:"pointer"}};case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Et,timestampCorner:"topLeading",timestampSize:Tt}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function I(e){return{kind:{kind:"literal",value:e}}}function La(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let a=n.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Zt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Yn(e){let t=[],n=i=>{for(let a of i)a.value&&t.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(a.then)}i.otherwise&&n(i.otherwise)}return t}var Jn=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function On(e,t){let n,i=t;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function Xn(e,t){return On(e,Zt(t))?.ref}function Zn(e,t){let n=Xn(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&Jn.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function ba(e,t,n){if(Yt(t)||n.width<=0||n.height<=0)return{...e};let i=t,a=e.x-i.left/n.width,r=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,l=e.y+e.height+i.bottom/n.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=we(a),r=we(r),o=we(o),l=we(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function _a(e,t,n){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function za(e,t,n,i){let a=e.elements.find(h=>h.payload.id===t);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=we(i.x),s=we(i.y),d=we(i.x+i.width),u=we(i.y+i.height),c={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,u-s)};a.payload.outset=_a(o,c,ge[n])}function Pa(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i)return;let a=e.perFamily[n];if(!a)return;let r=a.placements[t]?.frame??i.payload.frame,o=ge[n];return{width:r.width*o.width,height:r.height*o.height}}function ye(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function de(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function Qn(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function Ye(e){let t=new Map(e.elements.map(a=>[a.payload.id,a])),n=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=t.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=n.get(r);l?l.push(a):n.set(r,[a])}if(n.size===0)return;for(let[a,r]of n){let o=t.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=_a(o.payload.frame,s.frame,ge.rectangular));let d=s.outset,u=!Yt(d);l.payload.frame=ba(o.payload.frame,d,ge.rectangular),l.payload.isHidden=o.payload.isHidden;for(let c of Z){let h=e.perFamily[c];if(!h)continue;let y=ge[c],g=h.placements[a];if(u){let w=g?.frame??o.payload.frame,x=g?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:ba(w,d,y),isHidden:x}}else g?h.placements[l.payload.id]={frame:{...g.frame},isHidden:g.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=n.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Qt(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind==="tap")return;let a=ye(e,t)[0];if(a)return a.payload;let r=Rt("tap"),o=r.payload;return o.attachedTo=t,o.outset={...Wn},o.action=n??Zn(e,i),e.elements.push(r),Ye(e),o}function ei(e,t){let n=ye(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of Z)for(let a of n)delete e.perFamily[i]?.placements[a]}}function Na(e,t){ei(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of Z)delete e.perFamily[n]?.placements[t];Ye(e),_e(e)}function Oa(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),i=e.elements[n];if(!i)return;let a=Y(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[t,a]];for(let s of ye(e,t)){let d=structuredClone(s);d.payload.id=Y(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let s of Z){let d=e.perFamily[s];if(d)for(let[u,c]of l){let h=d.placements[u];h&&(d.placements[c]=structuredClone(h))}}return Ye(e),a}function en(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let i=[],a=On(e,Zt(n));if(a){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of ye(e,t)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=On(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function va(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function Va(e,t,n){let i=e.elements.find(r=>r.payload.id===t);if(!i||n.entityId==="")return;let a={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=va(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=va(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of ye(e,t)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var tn={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Da=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Je(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function nn(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function ti(){return{id:Y(),value:I(""),comparison:{kind:"isOn"}}}function ni(){return{id:Y(),when:{join:"all",tests:[ti()]},then:[]}}function It(){return{id:Y(),cases:[ni()]}}function ii(e,t){let n={kind:t};switch(Je(t)){case"value":n.value=e.value??I("");break;case"between":n.value=e.value??I(""),n.upper=e.upper??I("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function Xe(e){let t={kind:e};switch(nn(e)){case"value":t.value=I(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function Ba(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Ga(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function Ka(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*i&a;return n.toString(16)}function Wa(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function Ua(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function ri(e,t,n=0){let i=t instanceof Map?t:Wa(t),a=e.kind;if(a.kind==="named"){if(n>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?ri(o,i,n+1):Ua(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Ua(a))return;let r=ai(a);if(r!==void 0)return"e_"+Ka(r)}function be(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function bs(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>be(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))t=o.length===0?"[]":"("+o.map(c=>`(states.${c} | list)`).join(" + ")+")";else{let c=[];for(let h of l)c.push(`area_entities(${be(h)})`);for(let h of s)c.push(`label_entities(${be(h)})`);d.length>0&&c.push(`((${d.map(h=>`floor_areas(${be(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${c.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(be).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${be(i.value)})`:n+=` | rejectattr('state', 'eq', ${be(i.value)})`),e.function==="count")return`(${n} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${n} | map(attribute=${be(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function ai(e){switch(e.kind){case"entityAttribute":return`state_attr(${be(e.entityId)}, ${be(e.attribute)})`;case"entityAge":{let t=be(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return bs(e.aggregate);default:return}}function oi(e){let t=new Map,n=new Map,i=Wa(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let u=ai(d.kind);if(u===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),u);return}default:{let d=ai(s);if(d===void 0)return;n.set("e_"+Ka(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Zt(o);l&&a(l);for(let s of Yn(o.payload.rules))a(s)}for(let o of Z){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of Yn(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:t,expressions:n};return n.size>0&&(r.document=vs(n)),r}function vs(e){let t=[...e.keys()].sort(),n=[];for(let a of t){let r=e.get(a);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${a} %}${r}{% endset %}`):n.push(`{% set v_${a} = ${r} %}`)}let i=t.map(a=>`"${a}": v_${a}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function ja(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[a,r]of Object.entries(t))r===null?i.add(a):n.set(a,xs(r));return{values:n,nullKeys:i}}function xs(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function si(e){let t=oi(e),n=[...t.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function an(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function st(e){let t=e.trim(),n=an(t);if(n!==void 0)return n;let i="";for(let r of t)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:an(i)}function ws(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function $s(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function ks(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function Cs(e,t,n){if(ke(t))return e;let i=t,a=e,r=an(e.trim());if(i.relativeTime&&r!==void 0)a=$s(r);else{let o=st(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):ws(l))}}switch(i.useEntityUnit&&n&&(a+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=ks(a);break}return a}function lt(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),a=t%60,r=o=>String(o).padStart(2,"0");return n>0?`${n}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Mt(e,t=240){let n=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&n.push(o)}i=""};for(let o of e){if(n.length>=t)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let l=!a;r(),l&&(i+=o),a=!1}else r(),a=!1}return n.length<t&&r(),n}function Ss(e,t){let n,i;return t.scale==="fixed"?(n=Math.min(t.minValue,t.maxValue),i=Math.max(t.minValue,t.maxValue)):(n=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),t.baseline==="zero"&&(n=Math.min(n,0),i=Math.max(i,0)),i>n||(i=n+1),{min:n,max:i}}function Es(e,t,n){if(e===void 0)return 0;let i=st(e);if(i===void 0||Number.isNaN(i))return 0;let a=n-t;return a===0?0:Math.min(1,Math.max(0,(i-t)/a))}var Ie=class{constructor(t){this.ctx=t;this.named=new Map(t.namedValues.map(n=>[n.id.toUpperCase(),n.value]))}dereference(t){let n=t,i=new Set,a=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!ke(a)?a:l.format,n=l}let r={kind:n.kind};return a&&(r.format=a),r}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;default:{let a=ri(t,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Cs(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(t)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=an(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?lt(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let a=st(i),r=()=>this.resolve(n.value),o=()=>{let s=r();return s===void 0?void 0:st(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(n.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(n.upper),u=d===void 0?void 0:st(d);if(a===void 0||s===void 0||u===void 0)return!1;let[c,h]=s<=u?[s,u]:[u,s];return a>=c&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let a of t){let r=n?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(ce[l.kind],l)}return i}liveBranches(t){let n=new Map;for(let i of t){let a=i.cases.find(r=>this.evaluateCondition(r.when));n.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,a=this.applyRules(i.rules,n),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,u={id:i.id,isHidden:o,frame:s,opacity:d};switch(t.kind){case"text":{let c=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,y={kind:"text",...u,text:this.styleText(a,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??t.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex};return c!==void 0&&(y.countdownEnd=c),y}case"icon":{let c=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...u,symbol:this.styleText(a,"icon")??c,size:this.styleNumber(a,"fontSize")??t.payload.size,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let c=this.styleText(a,"gaugeValue")??this.resolve(t.payload.value),h=this.styleNumber(a,"gaugeMin")??t.payload.minValue,y=this.styleNumber(a,"gaugeMax")??t.payload.maxValue;return{kind:"gauge",...u,fraction:Es(c,h,y),style:t.payload.style,lineWidth:t.payload.lineWidth,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,trackColorHex:t.payload.trackColorHex}}case"chart":{let c=t.payload,h=je(c),y=h!==void 0?this.ctx.historySeries?.get(h)??"":this.resolve(c.value)??"",g=Mt(y);c.limit>0&&g.length>c.limit&&(g=c.takeFromEnd?g.slice(g.length-c.limit):g.slice(0,c.limit));let w=Ss(g,c),x={kind:"chart",...u,values:g,style:c.style,domainMin:w.min,domainMax:w.max,baseline:c.baseline,barGap:c.barGap,lineWidth:c.lineWidth,colorHex:this.styleColor(a,"color")??c.colorSlot.baseColorHex,highColorHex:c.highColorHex,lowColorHex:c.lowColorHex,marker:c.marker};if(g.length>0){let E=c.highlight==="highest"||c.highlight==="both",$=c.highlight==="lowest"||c.highlight==="both",m=E?g.indexOf(Math.max(...g)):-1,b=$?g.indexOf(Math.min(...g)):-1;m>=0&&(x.highIndex=m),b>=0&&b!==m&&(x.lowIndex=b)}return x}case"shape":{let c={kind:"shape",...u,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??t.payload.borderWidth},h=this.styleColor(a,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(c.borderColorHex=h),c}case"image":{let c={kind:"image",...u,entityId:t.payload.entity.entityId,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};Fe(t.payload)&&(c.timestampX=t.payload.timestampX,c.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(c.url=h),c}case"tap":{let c={kind:"tap",...u,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(c.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(c.attachedTo=t.payload.attachedTo),c}}}resolveLayout(t,n,i){let a=t.perFamily[n],r=La(t,n).map(w=>this.resolveElement(w,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:n,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,c=s??u??this.resolve(a?.bezelText);c!==void 0&&(l.bezelText=c),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let w=a.bezelGauge,x=this.resolve(w.value),E=x===void 0?void 0:st(x);if(E!==void 0){let $=Math.min(w.minValue,w.maxValue),m=Math.max(w.minValue,w.maxValue),b={value:Math.min(m,Math.max($,E)),minValue:$,maxValue:m===$?$+1:m,colorHexes:w.colorHexes},v=this.resolve(w.minLabel);v!==void 0&&(b.minLabel=v);let T=this.resolve(w.maxLabel);T!==void 0&&(b.maxLabel=T),l.bezelGauge=b}}let y=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;y!==void 0&&(l.backgroundColorHex=y);let g=this.styleColor(o,"borderColor")??a?.borderColorHex;return g!==void 0&&(l.borderColorHex=g),l}};function Ts(e,t){let n=new Ie(t),i=e.countdown?n.countdownEnd(e.value):void 0,r={text:(e.countdown?n.countdownFallbackText(e.value):void 0)??n.resolve(e.value)??"--"};return e.label&&(r.label=e.label),e.symbol&&(r.symbol=e.symbol),i!==void 0&&(r.countdownEnd=i),r}function li(e,t,n){let i=new Ie(t),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,n));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Ts(e.inline,t)),a}var re=ge,At=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:re,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Ht=At.find(e=>e.measured);function nr(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return At.find(a=>a.screen.width===n&&a.screen.height===i)}function on(e,t){let n=re[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),a=n.width*i,r=n.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Fs={regular:400,medium:500,semibold:600,bold:700};function Ce(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function ze(e,t,n="#FFFFFF"){let i=Ce(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function ir(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),a=(e.frame.x+e.frame.width/2)*t.width,r=(e.frame.y+e.frame.height/2)*t.height;return{x:a-n/2,y:r-i/2,w:n,h:i,cx:a,cy:r}}function Rs(e,t){let n=ze(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:lt((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>t.w&&t.w>0?Math.max(.5,t.w/a):1,o=e.fontSize*r,l=e.text;if(t.w>0&&l.length*i(o)>t.w){let s=t.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${Fs[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${l}</text>`}function Is(e,t){let n=ze(e.colorHex,"stroke"),i=ze(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=t.w,y=Math.max(a,h*e.fraction);return k`
      <rect x=${t.x} y=${t.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-a/2} width=${y} height=${a} rx=${a/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />`}let r=Math.min(t.w,t.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,u=l*s,c=l*s*e.fraction;return k`
    <g transform="rotate(${d} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?k`<circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${c} ${l}" />`:f}
    </g>`}var Ms=5;function As(e,t){let n=e.values,i=Math.max(n.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:Ms,o=e.style==="bars"?0:e.lineWidth/2,l=t.y+r+o,s=Math.max(t.h-r-o*2,1),d=l+s,u=Math.max(e.domainMax-e.domainMin,Number.EPSILON),c=e.baseline==="lowest",h=c?s*.12:0,y=Math.min(Math.max(e.barGap,0),t.w/(i*2)),g=Math.max((t.w-y*(i-1))/i,.5),w=E=>Math.min(1,Math.max(0,(E-e.domainMin)/u)),x=E=>d-w(E)*s;return{count:n.length,barWidth:g,baselineY:c?d:x(0),barRect(E){let $=t.x+E*(g+y),m=n[E],b,v;if(c){let T=h+w(m)*(s-h);b=d-T,v=d}else b=x(m),v=c?d:x(0),b>v&&([b,v]=[v,b]);return{x:$,y:b,w:g,h:Math.max(v-b,.5)}},point(E){let $=Math.max(t.w-o*2,0);return{x:n.length>1?t.x+o+$*E/(n.length-1):t.cx,y:x(n[E])}},markerCenter(E,$){let m=$?this.barRect(E):void 0;return{x:m?m.x+m.w/2:this.point(E).x,y:t.y+r/2}}}}function Hs(e,t){if(e.values.length===0)return f;let n=As(e,t),i=ze(e.colorHex,"fill"),a=ze(e.highColorHex,"fill",e.colorHex),r=ze(e.lowColorHex,"fill",e.colorHex),o=(s,d)=>k`<circle cx=${s.x} cy=${s.y} r="1.7" fill=${d.fill} fill-opacity=${d["fill-opacity"]} />`,l=[];if(e.style==="bars")for(let s=0;s<n.count;s++){let d=n.barRect(s),u=s===e.highIndex?a:s===e.lowIndex?r:i,c=Math.min(1.2,d.w/2,d.h/2);l.push(k`<rect x=${d.x} y=${d.y} width=${d.w} height=${d.h} rx=${c}
        fill=${u.fill} fill-opacity=${u["fill-opacity"]} />`)}else{let s=Array.from({length:n.count},(u,c)=>n.point(c)),d=s.map((u,c)=>`${c===0?"M":"L"}${u.x} ${u.y}`).join(" ");if(e.style==="area"){let u=`${d} L${s[s.length-1].x} ${n.baselineY} L${s[0].x} ${n.baselineY} Z`;l.push(k`<path d=${u} fill=${i.fill}
        fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}l.push(k`<path d=${d} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
      stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`),e.highIndex!==void 0&&l.push(o(s[e.highIndex],a)),e.lowIndex!==void 0&&l.push(o(s[e.lowIndex],r))}if(e.marker!=="none"){let s=e.style==="bars";if(e.highIndex!==void 0){let d=n.markerCenter(e.highIndex,s);l.push(e.marker==="pointer"?k`<path d=${`M${d.x} ${d.y-1.8} L${d.x+2.2} ${d.y+1.8} L${d.x-2.2} ${d.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(d,a))}e.lowIndex!==void 0&&l.push(o(n.markerCenter(e.lowIndex,s),r))}return k`${l}`}function Ls(e,t){let n=ze(e.fillColorHex,"fill"),i=e.borderColorHex?Ce(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?{stroke:i.color,"stroke-opacity":i.opacity,"stroke-width":a}:{stroke:"none","stroke-opacity":0,"stroke-width":0},l=k`fill=${n.fill} fill-opacity=${n["fill-opacity"]}
    stroke=${o.stroke} stroke-opacity=${o["stroke-opacity"]} stroke-width=${o["stroke-width"]}`;switch(e.shapeKind){case"circle":{let s=Math.min(t.w,t.h)/2-r;return k`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,s)} ${l} />`}case"capsule":{let s=Math.min(t.w,t.h)/2;return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${s} ${l} />`}case"roundedRectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${e.cornerRadius} ${l} />`;case"rectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} ${l} />`}}function _s(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return k`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let a=ze(e.colorHex,"stroke"),r=e.size;return k`
    <rect x=${t.cx-r/2} y=${t.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var mi=.25,zs=8;function Ps(e,t,n,i,a,r,o,l){let s={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,mi),zs),u=Math.max(e/n,t/i),c=Math.min(e/n,t/i),h=(a==="fit"?c:u)*d,y=n*h,g=i*h,w=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),x=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(y-e)/2*(1+w)+0,y:-(g-t)/2*(1+x)+0,width:y,height:g}}function sn(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var rn=4;function ln(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),a=n.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?t.x+rn:t.x+t.w-rn-a,d=e.timestampCorner.startsWith("top")?t.y+rn:t.y+t.h-rn-r;return{x:s,y:d,w:a,h:r,size:i,label:n}}let l=(s,d,u,c)=>c>=u?d+(u-c)/2:Math.min(d+u-c,Math.max(d,s-c/2));return{x:l(t.x+e.timestampX*t.w,t.x,t.w,a),y:l(t.y+e.timestampY*t.h,t.y,t.h,r),w:a,h:r,size:i,label:n}}function Ns(e,t,n){let i=n.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?ln(e,t,sn(new Date)):void 0,l=o?k`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,s=3,d=o&&n.timestampActiveId===e.id?k`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,y,g])=>k`<rect data-ts-corner=${h} x=${y-s/2} y=${g-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:f,u=e.url?n.imageSizes?.size(e.url):void 0,c;if(e.url&&u){let h=Ps(t.w,t.h,u.width,u.height,e.contentMode,e.zoom,e.panX,e.panY);c=k`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?c=k`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:c=k`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??f}</g>`;return k`
    <defs><clipPath id=${a}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${l}</g>${d}`}function Os(e,t,n,i,a){if(!i)return f;let r=Math.min(10,t.w*.5,t.h*.5),o=a!==void 0?Vs(a,t):void 0;return k`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${ci} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?k`<g transform="translate(${t.cx-r/2} ${t.cy-r/2})" opacity="0.8">${n.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var ci=5;function Vs(e,t){let n=ci*.55,i=t.w-2;if(t.h<ci*1.6||i<n*4)return;if(e.length*n<=i)return e;let a=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function ui(e,t,n){if(e.isHidden&&!n.showHidden)return f;let i=n.tapReview===!0,a=n.tapAreas===!0||i,r=i?n.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return f;let s=ir(e,t),d=i&&(!l||o),u;switch(e.kind){case"text":u=Rs(e,s);break;case"icon":u=_s(e,s,n.icons);break;case"gauge":u=Is(e,s);break;case"chart":u=Hs(e,s);break;case"shape":u=Ls(e,s);break;case"image":u=Ns(e,s,n);break;case"tap":u=Os(e,s,n.icons,a,d?Re(e.action):void 0);break}let c=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*c,y=n.highlightId===e.id,g=y||n.highlightIds?.includes(e.id)===!0,w=n.handles===!0&&(!l||o),x=g?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,E=n.hoverId===e.id?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,$=k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,m=3,b=y&&w?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([v,T,M])=>k`<rect data-handle=${v} x=${T-m/2} y=${M-m/2} width=${m} height=${m}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${v}-resize" />`):f;return k`<g data-element-id=${e.id} opacity=${h} style=${w?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${$}${u}${E}${x}${b}</g>`}function dn(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function fi(e,t){return(t?23.5:34)*e}var qa=10.5;function ar(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function Ya(e,t){let n=0;for(let i of e)n+=ar(i,t);return n}function Ja(e,t,n){let i=e.toUpperCase(),a=d=>ar(d,n),r=.9*n,o=0;for(let d of i)o+=a(d);if(o<=t)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>t)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function pi(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function hi(e,t,n,i){let a=pi(e,t,n),r=pi(e,t,i);return`M ${a.x} ${a.y} A ${t} ${t} 0 0 1 ${r.x} ${r.y}`}function rr(e,t,n,i){let{dial:a}=dn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:t,d:hi(a,n,i.start,i.end),length:n*r}}function Ds(e,t){let n=dn(e,!0);return rr(e,t,n.dial.r,n.labelArc)}var Xa=18.5,Bs=113,Gs={start:-71,end:-36},Za=104,Us=6.2,Qa={start:-77,end:-30.5};function er(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function tr(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),a=n-i,r=er(e[i]),o=er(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var di=11;function Ks(e,t,n){let{dial:i}=dn(t,!0),a=Za*t,r=180/(Math.PI*Za),o=e.minLabel!==void 0?Ya(e.minLabel,di)*r:0,l=e.maxLabel!==void 0?Ya(e.maxLabel,di)*r:0,s=Qa.start+(o>0?Math.max(0,o-1.8):0),d=Qa.end-(l>0?Math.max(0,l-1.8):0),u=d-s,c=24,h=[];for(let E=0;E<c;E++){let $=s+u*E/c,m=Math.min(d,s+u*(E+1)/c+.4);h.push(k`<path d=${hi(i,a,$,m)} fill="none"
      stroke=${tr(e.colorHexes,(E+.5)/c)} stroke-width=${Us*t}
      stroke-linecap=${E===0||E===c-1?"round":"butt"} />`)}let y=(e.value-e.minValue)/(e.maxValue-e.minValue),g=pi(i,a,s+u*y),w=1.5,x=(E,$,m,b)=>k`
    <defs><path id=${E} d=${hi(i,a,$,m)} /></defs>
    <text font-size=${di*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${E}" startOffset="50%" text-anchor="middle">${b}</textPath></text>`;return k`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*t} fill=${tr(e.colorHexes,y)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?x(`${n}-gmin`,s-w-Math.max(o,3),s-w,e.minLabel):f}
    ${e.maxLabel!==void 0?x(`${n}-gmax`,d+w,d+w+Math.max(l,3),e.maxLabel):f}`}function gi(e,t){let n=e.family in re?e.family:"rectangular",i=t.slot??re[n],a=re[n],r=on(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,l=Ce(e.backgroundColorHex),s=Ce(e.borderColorHex),d=e.borderWidth*r.scale;if(n==="corner"){let g=r.scale,w=!!e.bezelText||!!e.bezelGauge,x=e.curvedText??"",E=x!=="",$=dn(g,w),m=fi(g,w),b=m/(a.width*g),v=$.tile.cx-m/2,T=$.tile.cy-m/2,M=`M 0 0 H ${$.quad.width-$.cornerRadius} A ${$.cornerRadius} ${$.cornerRadius} 0 0 1 ${$.quad.width} ${$.cornerRadius} V ${$.quad.height} H 0 Z`,N=f;if(e.bezelGauge)N=Ks(e.bezelGauge,g,o);else if(e.bezelText){let R=Ds(g,`${o}-bezel`),z=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?lt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;N=k`<defs><path id=${R.id} d=${R.d} /></defs>
        <text font-size=${qa*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${R.id}" startOffset="50%" text-anchor="middle">${Ja(z,R.length,qa*g)}</textPath></text>`}let S=f;if(E){let R=Ce(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},z=rr(g,`${o}-curved`,Bs*g,Gs);S=k`<defs><path id=${z.id} d=${z.d} /></defs>
        <text font-size=${Xa*g} font-weight="600" fill=${R.color} fill-opacity=${R.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${z.id}" startOffset="50%" text-anchor="middle">${Ja(x,z.length,Xa*g*.88)}</textPath></text>`}else{let R=e.borderWidth*r.scale*b,z=s?k`<circle cx=${m/2} cy=${m/2} r=${m/2-R/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${R} />`:f;S=k`<g transform="translate(${v} ${T})">
        <g clip-path=${`url(#${o})`}>
          ${l?k`<rect width=${m} height=${m} fill=${l.color} fill-opacity=${l.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*b})">
            ${e.elements.map(D=>ui(D,a,t))}
          </g>
        </g>
        <circle cx=${m/2} cy=${m/2} r=${m/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${z}
      </g>`}return k`<svg viewBox=${`0 0 ${$.quad.width} ${$.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${$.quad.width} height=${$.quad.height}>
      <defs><clipPath id=${o}><circle cx=${m/2} cy=${m/2} r=${m/2} /></clipPath></defs>
      <path d=${M} fill="#000000" />
      ${N}
      ${S}
    </svg>`}let u=k`<rect width=${i.width} height=${i.height} />`,c=s?k`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:f,h=k`<rect width=${i.width} height=${i.height} fill="#000000" />`,y=`0 0 ${i.width} ${i.height}`;return k`<svg viewBox=${y} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${u}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?k`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(g=>ui(g,a,t))}
      </g>
    </g>
    ${c}
  </svg>`}var Ws=.14;function js(e,t){let n=ir(e,t);if(e.kind!=="text"||e.text==="")return n;let i=Math.min(n.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(n.h,e.fontSize*1.3);return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}function qs(e,t,n){let i=e.family in re?e.family:"rectangular",a=re[i],r=e.elements.filter(h=>t.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let y=js(h,a),g=h.frame.rotationDegrees%180===0?0:Math.hypot(y.w,y.h)/2;o=Math.min(o,g?y.cx-g:y.x),l=Math.min(l,g?y.cy-g:y.y),s=Math.max(s,g?y.cx+g:y.x+y.w),d=Math.max(d,g?y.cy+g:y.y+y.h)}let u=s-o,c=d-l;if(r.length===0||!(u>0)||!(c>0))o=0,l=0,u=a.width,c=a.height;else{let h=Math.max(2,Math.max(u,c)*Ws);o-=h,l-=h,u+=2*h,c+=2*h}if(u/c<n){let h=c*n;o-=(h-u)/2,u=h}else{let h=u/n;l-=(h-c)/2,c=h}return{x:o,y:l,w:u,h:c}}function or(e,t,n){let i=e.family in re?e.family:"rectangular",a=re[i],r=qs(e,t,n.width/n.height),o=Ce(e.backgroundColorHex),l=Ce(e.borderColorHex),s=e.borderWidth,d={icons:n.icons,showHidden:!0,tapAreas:!0,...n.imageSizes?{imageSizes:n.imageSizes}:{}},u=e.elements.filter(y=>t.includes(y.id)),c=l&&s>0?i==="rectangular"?k`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:f,h=i==="rectangular"?k`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return k`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${n.width} height=${n.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${u.map(y=>ui(y,a,d))}
    ${c}
  </svg>`}function B(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var dt=["rectangular","circular","corner","inline"];function Lt(e){return Z.includes(e)}function sr(e){return dt.filter(t=>e.supportedFamilies.includes(t))}function lr(e){return Z.find(t=>e.supportedFamilies.includes(t))}function ct(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function Ys(e){let t=e.elements.find(i=>i.kind==="text");return{value:t&&t.kind==="text"?structuredClone(t.payload.value):I("Text")}}function dr(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=dt.filter(n=>n===t||e.supportedFamilies.includes(n))),Lt(t)?e.perFamily[t]||(e.perFamily[t]=qn()):e.inline||(e.inline=Ys(e)),e.schemaVersion=St(e)}function cr(e,t){ct(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),Lt(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=St(e))}function ur(e,t){let n=[];if(!Lt(t)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let a=Object.keys(i.placements).length;return a>0&&n.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var Q={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},ut={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},pr=["text","icon","gauge","chart","shape","image","tap"],q={states:"#f9a825",tap:Q.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var hr="2.8.0";function yi(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function Js(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function mr(e,t=hr){let n=yi(e),i=yi(t);return!n||!i?!1:Js(n,i)>=0}function fr(e,t=hr){return`${yi(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var gr="52a9d81d0fd7";function Xs(e){return e.trim().replace(/\./g,"-")}function Zs(e){return e.trim().replace(/-/g,".")}var cn=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>Zs(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let a=Xs(t),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Ce(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},bi=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let a=this.icons.get(t.trim());if(!a)return;let r=Ce(i)??{color:"#FFFFFF",opacity:1};return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${gr}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,a]of Object.entries(n))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function yr(e){return cn.available()?new cn(e):new bi(e)}function br(e){let t=new Map,n=new Set;return{size(i){let a=t.get(i);if(a)return a;if(n.has(i))return;n.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(t.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var pn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],hn=[...new Set(pn.flatMap(e=>e.symbols))],Qs={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function el(e){return`${e.replace(/\./g," ")} ${(Qs[e]??[]).join(" ")}`}function vr(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let a of e){let r=el(a);if(!n.every(l=>r.includes(l)))continue;let o=n.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var un=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var tl=100;function xr(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Ze=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,Ye(t),this.baseline=JSON.stringify(Jt(t))}static fromDocument(t,n){return new e(Fa(t),n)}get dirty(){return JSON.stringify(Jt(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>tl&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let r=structuredClone(this.config);t(r),Ye(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=si(t),Jt(t)}commit(){let t=structuredClone(this.config);return t.dataSources=si(t),new e(t,null)}};var pt={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Me={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},$r=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],kr={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},vi=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],nl=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function xi(e){return nl.includes(e)}function il(e){return vi.includes(e)}function al(e,t){return JSON.stringify(J(e))===JSON.stringify(J(t))}function wi(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[r,o]of t.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!il(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${pt[s.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=s.value;else if(!al(n,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=wr(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Me[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(t.otherwise){let r=wr(t.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Me[r]} twice. A table has one cell per column.`}}let a={ruleId:t.id,rows:i,columns:rl(i,t.otherwise),numberMode:i.length>0&&i.every(r=>xi(r.comparison.kind))};return n!==void 0&&(a.value=n),t.otherwise&&(a.otherwise=t.otherwise),{ok:!0,table:a}}function wr(e){let t=new Set;for(let n of e){let i=ce[n.kind];if(t.has(i))return i;t.add(i)}}function rl(e,t){let n=new Set;for(let i of e)for(let a of i.changes)n.add(ce[a.kind]);for(let i of t??[])n.add(ce[i.kind]);return $r.filter(i=>n.has(i))}function Cr(e,t,n){let i=new Set(e);for(let a of t)i.add(a);return $r.filter(a=>i.has(a)&&n.includes(a))}function mn(e,t){return e.find(n=>ce[n.kind]===t)}function Sr(e,t,n,i){let a=t.map(o=>({id:o.caseId??Y(),when:{join:o.join??"all",tests:[{id:o.testId??Y(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??Y(),cases:a};return n&&(r.otherwise=n),r}function _t(e){if(e.length===0)return"No states yet.";let t=wi(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function Er(e){let t=e[0];return t||(t={id:Y(),cases:[]},e.push(t)),t}function Tr(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function Fr(e,t,n){let i=Er(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:Y(),when:{join:"all",tests:[{id:Y(),value:structuredClone(t),comparison:sl(a,n)}]},then:[]})}function Rr(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),Tr(e))}function $i(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[a]=i.splice(t,1);a&&i.splice(n,0,a)}function ki(e,t){if(t){Er(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,Tr(e))}function Ir(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function Mr(e,t){let n=e[0];if(!n)return;let i=a=>a.filter(r=>ce[r.kind]!==t);for(let a of n.cases)a.then=i(a.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function ol(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Ar(e,t=ol){let n=()=>t(e.value??I(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??I(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Je(e.kind)==="value"?`${pt[e.kind]} ${n()}`:pt[e.kind]}}function sl(e,t){if(!e)return t?{kind:"lessThan",value:I("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??I("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};default:return{kind:e.kind,...Je(e.kind)==="value"?{value:I("")}:{}}}}var Hr={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function Lr(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function ll(e){switch(e){case"text":return k`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return k`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return k`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return k`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return k`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return k`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return k`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return k`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return k`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return k`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return k`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return k`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return k`<path d="M6 9L12 15L18 9" />`;case"plus":return k`<path d="M12 5V19M5 12H19" />`;case"watch":return k`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"lock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return k`<path d="M6 14L12 8L18 14" />`;case"down":return k`<path d="M6 10L12 16L18 10" />`;case"show":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return k`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return k`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return k`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return k`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`}}function P(e){return p`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ll(e)}</svg>`}function ht(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=n.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function _r(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var fn=e=>Math.round(e*1e3)/1e3,zr=10;function Ci(e,t,n,i){let a=i.width>0?e.x+t/i.width:e.x,r=i.height>0?e.y+n/i.height:e.y;return _r({...e,x:fn(a),y:fn(r)})}function Pr(e,t,n,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?fn(a(e.x+t/i.w)):e.x,y:i.h>0?fn(a(e.y+n/i.h)):e.y}}function gn(e,t,n,i,a){let r=ht(e,n),o={...i.frame},l=o;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let y=ht(e,h),g=(y.x-r.x)/t.width,w=(y.y-r.y)/t.height,x;if(!i.handle)x=_r({...o,x:s(o.x+g),y:s(o.y+w)});else{let{x:E,y:$,width:m,height:b}=o,v=o.x+o.width,T=o.y+o.height;i.handle.includes("e")&&(m=Math.max(.04,o.width+g)),i.handle.includes("s")&&(b=Math.max(.04,o.height+w)),i.handle.includes("w")&&(m=Math.max(.04,o.width-g),E=v-m),i.handle.includes("n")&&(b=Math.max(.04,o.height-w),$=T-b),x={...o,x:s(E),y:s($),width:s(m),height:s(b)}}l=x,a.onFrame(i.elementId,x,!1)},u=h=>{h.pointerId===n.pointerId&&(c(),a.onFrame(i.elementId,l,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",u);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",u),c}function Nr(e,t,n,i,a){let r=ht(e,n),o=i;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let y=ht(e,h),g=t.w>0?s(i.x+(y.x-r.x)/t.w):i.x,w=t.h>0?s(i.y+(y.y-r.y)/t.h):i.y;o={x:l(g),y:l(w)},a(o.x,o.y,!1)},u=h=>{h.pointerId===n.pointerId&&(c(),a(o.x,o.y,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",u);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",u),c}function Or(e,t,n,i,a){let r=ht(e,t),o=1;e.setPointerCapture(t.pointerId);let l=u=>{if(u.pointerId!==t.pointerId)return;let c=ht(e,u),h=(c.x-r.x)*(n.includes("e")?1:-1),y=(c.y-r.y)*(n.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,w=i.h>0?(i.h+y)/i.h:1,x=Math.abs(g-1)>=Math.abs(w-1)?g:w;o=Math.max(.05,x),a(o,!1)},s=u=>{u.pointerId===t.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}var Ri=["content","look","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ie(e){return t=>e(t.target.value)}function ee(e,t,n,i={}){return p`<label class="field"><span>${e}</span>
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${ie(n)} /></label>`}function dl(e,t,n,i=3){return p`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${ie(n)}></textarea></label>`}function W(e,t,n,i={}){let a=t===void 0||Number.isNaN(t)?"":String(t);return p`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??f} max=${i.max??f}
      @input=${ie(r=>{if(r.trim()===""){i.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} /></label>`}function K(e,t,n,i){return p`<label class="field"><span>${e}</span>
    <select @change=${ie(a=>i(a))}>
      ${n.map(([a,r])=>p`<option value=${a} ?selected=${a===t}>${r}</option>`)}
    </select></label>`}function Si(e,t,n,i){let a=i.format??(r=>String(Math.round(r*100)/100));return p`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${ie(r=>{let o=Number(r);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${a(t)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${t===i.def}
        @click=${()=>n(i.def)}>${P("reset")}</button>
    </div></div>`}function he(e,t,n){return p`<label class="field check"><input type="checkbox" .checked=${t} @change=${i=>n(i.target.checked)} /><span>${e}</span></label>`}function se(e,t,n,i=!1){let a=(t??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,u)=>{let c=d.replace(/^#/,"").toUpperCase();return u>=100?`#${c}`:`#${c}${Math.round(u/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return p`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?p`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${d=>n(d.target.checked?s(o,l):void 0)} />`:f}
      <input type="color" .value=${o} ?disabled=${i&&t===void 0} @input=${ie(d=>n(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${ie(d=>n(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${ie(d=>{let u=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(u)&&n(u.startsWith("#")?u.toUpperCase():`#${u.toUpperCase()}`)})} />
    </div></div>`}function Zr(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function cl(e,t){let n=t===void 0?void 0:typeof t=="string"?[t]:t,i=[];for(let[a,r]of Object.entries(e)){let o=a.split(".")[0]??"";if(n!==void 0&&!n.includes(o))continue;let l=typeof r?.attributes?.friendly_name=="string"?r.attributes.friendly_name.trim():"";i.push({entityId:a,name:l||a,state:r?.state??"",domain:o})}return i.sort((a,r)=>a.name.localeCompare(r.name)||a.entityId.localeCompare(r.entityId)),i}var Qr=50;function ul(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function pl(e,t,n=Qr,i){let a=t.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,n);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),u=s.name.toLowerCase(),c=-1;d===a?c=0:d.startsWith(a)?c=1:u.startsWith(a)?c=2:d.includes(a)?c=3:u.includes(a)?c=4:o.length>1&&o.every(h=>d.includes(h)||u.includes(h))&&(c=5),c>=0&&l.push({c:s,rank:c})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,n).map(s=>s.c)}var hl=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function eo(e){return hl.test(e.trim())}function ml(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return Zr(n,i);if(eo(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var mt=new Map;function Se(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}t=a}}function to(e){return mt.has(e)}function Pe(e,t,n,i,a,r={}){let o=e.hass.states,l=mt.get(a),s=l?pl(cl(o,r.domain),l.query,Qr,r.preferNumeric?ul:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,u=n.entityId?o[n.entityId]:void 0,c=($,m,b=0)=>{mt.set(a,{query:m,index:b}),Se($)},h=$=>{mt.delete(a),Se($)},y=$=>{let m=ml($,n,o);m&&i(m)},g=($,m)=>{i(Zr(o,$.entityId)),h(m)},w=()=>Math.max(0,Math.min(mt.get(a)?.index??0,s.length-1)),x=$=>{let m=$.target;if($.key==="ArrowDown"||$.key==="ArrowUp"){$.preventDefault();let b=mt.get(a);if(!b){c(m,m.value);return}let v=$.key==="ArrowDown"?w()+1:w()-1;c(m,b.query,Math.max(0,Math.min(s.length-1,v))),fl(m);return}if($.key==="Enter"){$.preventDefault();let b=s[w()];l&&b?g(b,m):(y(m.value),h(m));return}if($.key==="Escape"){if(!l)return;$.preventDefault(),$.stopPropagation(),h(m)}},E=n.entityId===""?p`<div class="hint">Type part of a name, such as "kitchen".</div>`:u?p`<div class="entity-current"><span class="ent-name">${typeof u.attributes.friendly_name=="string"?u.attributes.friendly_name:n.entityId}</span><span class="ent-state">${u.state}</span></div>`:p`<div class="hint warn">Not in Home Assistant right now.</div>`;return p`<div class="field entity-field">
    <span>${t}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
      .value=${l?l.query:n.entityId}
      placeholder="Search entities, or type an id"
      @focus=${$=>{let m=$.target;c(m,n.entityId),m.select()}}
      @input=${$=>{let m=$.target;c(m,m.value)}}
      @keydown=${x}
      @blur=${$=>{let m=$.target;l&&y(m.value),h(m)}} />
    ${l?p`<div class="entity-results" role="listbox">
          ${s.length===0?p`<div class="hint" style="padding:6px 8px">${eo(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map(($,m)=>p`<button type="button" role="option" aria-selected=${m===d?"true":"false"} class="ent ${m===d?"hl":""}"
                @mousedown=${b=>b.preventDefault()} @click=${b=>g($,b.target)}>
                <span class="ent-main">
                  <span class="ent-name">${$.name}</span>
                  <span class="ent-id mono">${$.entityId}</span>
                </span>
                <span class="ent-state">${$.state}</span>
              </button>`)}
        </div>`:E}
    ${r.compact?f:p`<details class="sub">
      <summary>Display name: ${n.displayName||"(none)"}</summary>
      ${ee("Display name",n.displayName,$=>i({...n,displayName:$}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function fl(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var gl=120;function yl(e,t,n,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(pn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:a(hn),fromPack:!1}}function Vr(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function bl(e){return[{value:"",label:`Starter set (${Vr(hn,e)})`},...pn.map(t=>({value:t.name,label:`${t.name} (${Vr(t.symbols,e)})`}))]}function vl(e){return e.length>0?e.length:hn.length}function xl(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Dr(e,t,n,i){let a=e.icons.render(t,22,"#FFFFFF");return p`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${a??p`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function no(e,t,n,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),u=t.trim(),c=u!==""&&d.size>0&&!d.has(u),h=g=>{n(g),a.noteUsed(g)},y=f;if(r){let g=a.category(i),w=yl(g,o,s,d),x=vr(w.names,o),E=w.fromPack?x.slice(0,gl):x,$=d.size===0?a.recent:a.recent.filter(m=>d.has(m));y=p`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${ie(m=>a.setQuery(i,m))} />
        <select @change=${ie(m=>a.setCategory(i,m))}>
          ${bl(d).map(m=>p`<option value=${m.value} ?selected=${m.value===g}>${m.label}</option>`)}
        </select>
      </div>
      ${$.length===0?f:p`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${$.map(m=>Dr(e,m,m===u,h))}</div>`}
      <div class="sym-grid">${E.map(m=>Dr(e,m,m===u,h))}</div>
      ${x.length===0?p`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:p`<div class="hint">
            ${xl(E.length,x.length,o.trim()!=="",vl(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?p`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:p`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return p`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${ie(n)} @change=${ie(g=>{(d.size===0||d.has(g.trim()))&&a.noteUsed(g)})} /></label>
    ${c?p`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${y}`}var wl=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"]],$l=[["bars","Bars"],["line","Line"],["area","Area"]],kl=[["auto","Auto (fit the readings)"],["fixed","Fixed range"]],Cl=[["lowest","Lowest value"],["zero","Zero"]],io=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Sl=[["none","None"],["pointer","Triangle and dot"],["dot","Dots"]],El=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function Tl(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""}}}function X(e,t,n,i){if(i.inline||!Fl())return p`<div class="value-editor">${oo(e,t,n,i)}</div>`;let a=Ii(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,l=ae(t,ue(e));return p`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?f:p`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text">${l}</span>
      ${o===void 0?f:p`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${ao(e,a,r,t,n,i)}
  </div>`}function ao(e,t,n,i,a,r){return p`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${ro}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${Pt.has(t)?oo(e,i,a,r):f}
  </div>`}function ue(e){return{values:e.config.values,hass:e.hass}}function Ii(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function Fl(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Pt=new Set,zt=new WeakMap;function Rl(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function Il(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(t)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function ro(e){let t=e.currentTarget,n=e.newState==="open",i=zt.get(t);if(i&&(i(),zt.delete(t)),!n){Pt.delete(t.id)&&Se(t);return}let a=Rl(t);if(!a)return;let r=()=>{if(!t.isConnected||!t.matches(":popover-open")){zt.get(t)?.(),zt.delete(t);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}Ei(t,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),zt.set(t,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Ei(t,a.getBoundingClientRect()),Pt.has(t.id)||(Pt.add(t.id),Se(t),requestAnimationFrame(()=>{t.isConnected&&Ei(t,a.getBoundingClientRect())}))}function Ei(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=Ml({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Qe=8,yn=6,Br=140;function Ml(e,t,n){let i=n.height-e.bottom-yn-Qe,a=e.top-yn-Qe,r=t.height>i&&a>i&&i<Br,o=Math.max(Br,r?a:i),l=Math.min(t.height,o),s=Math.max(Qe,Math.min(e.left,n.width-t.width-Qe)),d=r?Math.max(Qe,e.top-yn-l):Math.max(Qe,Math.min(e.bottom+yn,n.height-l-Qe));return{left:s,top:d,maxHeight:o,above:r}}function oo(e,t,n,i){let a=t.kind,r=u=>n({...t,kind:u}),o=i.key,l=wl.filter(([u])=>i.allowNamed!==!1||u!=="named"),s=f;switch(a.kind){case"literal":s=i.symbol?no(e,a.value,u=>r({...a,value:u}),o):ee("Text",a.value,u=>r({...a,value:u}));break;case"entityState":case"entityAge":s=Pe(e,"Entity",a,u=>r({...a,...u}),`${o}-entity`);break;case"entityAttribute":{let u=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),c=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=p`${Pe(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ee("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:c,mono:!0})}
        <datalist id=${c}>${u.map(h=>p`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=Hl(e,a.aggregate,u=>r({...a,aggregate:u}),o);break;case"time":s=K("Field",a.timeField,El,u=>r({...a,timeField:u}));break;case"dataAge":s=p`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=p`${dl("Template",a.value,u=>r({...a,value:u}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?p`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:K("Value",a.id,[["","(choose)"],...e.config.values.map(u=>[u.id,u.name||u.id.slice(0,8)])],u=>r({...a,id:u}));break}let d=i.showResolved?e.resolve(t):void 0;return p`
    ${K("Source",a.kind,l,u=>r(Tl(a,u)))}
    ${s}
    ${i.noFormat?f:Al(t.format,u=>n(ke(u)?{kind:t.kind}:{...t,format:u}))}
    ${i.showResolved?p`<div class="hint">Now: ${d===void 0?p`<span class="warn">unresolved</span>`:p`<code>${d}</code>`}</div>`:f}`}function Al(e,t){let n=e??{},i=a=>{let r={...n,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];t(r)};return p`<details class="sub" ?open=${!ke(e)}>
    <summary>Format${ke(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${W("Decimals",n.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${W("Multiply",n.multiply,a=>i({multiply:a}),{optional:!0})}
      ${W("Offset",n.offset,a=>i({offset:a}),{optional:!0})}
      ${K("Case",n.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ee("Prefix",n.prefix??"",a=>i({prefix:a}))}
      ${ee("Suffix",n.suffix??"",a=>i({suffix:a}))}
    </div>
    ${he("Append the entity's unit",!!n.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${he("Show as relative time (45s, 2m, 3h)",!!n.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function Hl(e,t,n,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=t.scope;return p`
    ${K("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>n({...t,function:l}))}
    ${K("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>n({...t,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?p`<div class="grid2">
          ${ee("Domains",a(o.domains),l=>n({...t,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${ee("Area ids",a(o.areaIds),l=>n({...t,scope:{...o,areaIds:r(l)}}))}
          ${ee("Label ids",a(o.labelIds),l=>n({...t,scope:{...o,labelIds:r(l)}}))}
          ${ee("Floor ids",a(o.floorIds),l=>n({...t,scope:{...o,floorIds:r(l)}}))}
        </div>`:p`${o.entities.map((l,s)=>p`<div class="row-inline">
            ${Pe(e,`Entity ${s+1}`,l,d=>{let u=[...o.entities];u[s]=d,n({...t,scope:{...o,entities:u}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,u)=>u!==s)}})}>${P("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${K("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...t};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:s.stateFilter={kind:l},n(s)})}
    ${t.stateFilter&&"value"in t.stateFilter?ee("State",t.stateFilter.value,l=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:l}})):f}
    ${t.function==="count"?f:ee("Attribute (blank = state)",t.attribute??"",l=>{let s={...t};l?s.attribute=l:delete s.attribute,n(s)})}`}var so=jn,Ll=so.filter(([e])=>e!=="none");function _l(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function lo(e){let t=e.config,n=t.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=_l(e.savedName,t.name),r=t.refreshMinutes??0,o=Gr.map(s=>[String(s),Ur(s)]);Gr.includes(r)||o.push([String(r),Ur(r)]);let l=t.showSuccessFlash??!0;return p`
    <div class="gen-row">
      ${ee("Name",t.name,s=>e.update(d=>{d.name=s},"name"))}
      ${K("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${K("Tap action",n.type,so,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?p`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??zl).slice(0,7)}
                @input=${ie(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:p`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?p`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in n?Pe(e,"Target",n,s=>e.update(d=>{d.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):f}
    ${n.type==="openPage"?Pl(e):f}`}var zl="#808080",Gr=[0,15,30,60,120];function Ur(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function Pl(e){let t=e.config;return co(e,t.openPageId,t.openPageName,(n,i)=>e.update(a=>{if(n===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=n,i?a.openPageName=i:delete a.openPageName}))}function co(e,t,n,i){let a=t??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${n||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?p`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:p`${K("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?f:p`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function uo(e,t){let n=e.config.values.findIndex(a=>a.id===t.id),i=`nv-${t.id}`;return p`
    ${ee("Name",t.name,a=>e.update(r=>{r.values[n].name=a},`${i}-name`))}
    ${X(e,t.value,a=>e.update(r=>{r.values[n].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${Kr(e.config,t.id)} layer${Kr(e.config,t.id)===1?"":"s"}.</div>`}function Kr(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function po(){return{id:Y(),name:"Value",value:I("")}}function me(e,t,n){let i=e.perFamily[t],a=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function pe(e,t,n,i,a=!1){let r=e.elements.find(u=>u.payload.id===n);if(!r)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let l=me(e,t,r),d={...o.placements[n]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let u of e.elements)u.payload.id!==n&&(o.placements[u.payload.id]={frame:{...u.payload.frame},isHidden:u.payload.isHidden});o.placements[n]=d}function Nl(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function Wr(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function Ol(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function ho(e,t,n){let i=Wr(n.map(d=>me(e,t,d).isHidden)),a=Wr(n.map(d=>d.payload.isHidden)),r=n.map(Ol),o=n.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var Mi=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function Vl(e,t,n){let i=t.payload.id,a=en(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"?{domain:"camera"}:{};return p`
    ${Pe(e,t.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>Va(s,i,l),`${n}-entity`),`${n}-layer-entity`,o)}
    <div class="hint">${Gl(t,a)}</div>`}function Dl(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Bl(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Gl(e,t){let n=Dl(e),i=n?.kind.kind,r=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let s=t.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${Bl(o)}.${r}`}function Ul(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Kl(e,t){let n=e.timestamp===!0,i=Fe(e),a=r=>t(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Fe(o)&&(o.timestampCorner=Kn(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return p`
    ${he("Show timestamp",n,r=>t(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${n?p`
      ${K("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?f:K("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>t(o=>{o.timestampCorner=r}))}
      ${W("Text size (pt)",e.timestampSize,r=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,r??Tt))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function oe(e,t,n,i,a={}){let r=e.openSections.has(t),o=()=>e.toggleSection(t);return p`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${P(a.icon??"content")}</span>
      <span class="tt"><h4>${n}</h4>${a.summary?p`<span class="sum">${a.summary}</span>`:f}</span>
      <span class="chev">${P("chevron")}</span>
    </div>
    ${r?p`<div class="sec-b">${i}</div>`:f}
  </section>`}function Wl(e){if(e.length===0)return"nothing";let t=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100);return e.length<=12?e.map(t).join(" "):`${e.slice(0,6).map(t).join(" ")} \u2026 ${e.slice(-3).map(t).join(" ")}`}function jl(e){return Dn.find(t=>t.minutes===e)?.label??`Last ${e} min`}function ql(e,t){let n=ue(e);switch(t.kind){case"text":return et(ae(t.payload.value,n),48);case"icon":return et(ae(t.payload.symbol,n),48);case"gauge":return et(ae(t.payload.value,n),48);case"chart":return et(`${ae(t.payload.value,n)}${t.payload.historyMinutes>0?` \xB7 ${jl(t.payload.historyMinutes)}`:""}`,48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||"No camera yet";case"tap":return Re(t.payload.action)}}function jr(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${io.find(([t])=>t===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${ve(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function mo(e,t,n){let i=t.payload.id,a=e.config.elements.findIndex(m=>m.payload.id===i),r=`el-${i}`,o=(m,b)=>e.update(v=>m(v.elements[a]),b?`${r}-${b}`:void 0),l=me(e.config,n,t),s=l.frame,d=(m,b)=>e.update(v=>pe(v,n,i,{frame:{...s,...m}}),`${r}-${b}-${n}`),u=t.kind==="text"?"Font size":t.kind==="icon"?"Icon size":"Line width",c,h;switch(t.kind){case"text":c=p`
        ${X(e,t.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${he("Live countdown",t.payload.countdown===!0,m=>o(b=>{let v=b.payload;m?v.countdown=!0:delete v.countdown}))}
        ${t.payload.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,h=p`<div class="grid2">
          ${W("Font size (pt)",t.payload.fontSize,m=>o(b=>{b.payload.fontSize=m??14},"size"),{step:1,min:4})}
          ${K("Weight",t.payload.fontWeight,Mi,m=>o(b=>{b.payload.fontWeight=m}))}
        </div>`;break;case"icon":c=p`
        ${X(e,t.payload.symbol,m=>o(b=>{b.payload.symbol=m},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=W("Icon size (pt)",t.payload.size,m=>o(b=>{b.payload.size=m??14},"size"),{step:1,min:4});break;case"gauge":c=p`
        ${X(e,t.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${W("Min",t.payload.minValue,m=>o(b=>{b.payload.minValue=m??0},"min"))}
          ${W("Max",t.payload.maxValue,m=>o(b=>{b.payload.maxValue=m??100},"max"))}
        </div>`,h=p`
        <div class="grid2">
          ${K("Style",t.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],m=>o(b=>{b.payload.style=m}))}
          ${W("Line width (pt)",t.payload.lineWidth,m=>o(b=>{b.payload.lineWidth=m??4},"lw"),{step:.5,min:.5})}
        </div>
        ${se("Track colour",t.payload.trackColorHex,m=>o(b=>{b.payload.trackColorHex=m??"#FFFFFF40"},"track"))}`;break;case"chart":{let m=t.payload,b=(H,C)=>o(O=>H(O.payload),C),v=je(m),T=m.historyMinutes>0,M=m.value.kind.kind==="entityState",N=v===void 0?void 0:e.historySeries(v),S=T?N??"":e.resolve(m.value)??"",R=Mt(S),z=m.limit>0&&R.length>m.limit?m.takeFromEnd?R.slice(R.length-m.limit):R.slice(0,m.limit):R,D=!T&&M&&R.length===1;c=p`
        ${X(e,m.value,H=>b(C=>{C.value=H},"value"),{label:"Readings",key:`${r}-value`})}
        ${K("Draw",T?"history":"value",[["value","The value itself"],["history","Its recorded history"]],H=>b(C=>{C.historyMinutes=H==="history"?C.historyMinutes||360:0}))}
        ${T?p`
            ${M?f:p`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              stays empty until Readings names an entity.</div>`}
            <div class="grid2">
              ${K("Span",String(m.historyMinutes),Dn.map(({minutes:H,label:C})=>[String(H),C]),H=>b(C=>{C.historyMinutes=Number(H)||360}))}
              ${W("Readings",m.historyPoints,H=>b(C=>{C.historyPoints=Math.round(H??24)},"hpoints"),{step:1,min:Bn,max:Gn})}
            </div>
            <div class="hint">Home Assistant averages the recorded states into this many equal
              time slots, oldest first. About 20 readings suits a rectangular complication; more
              than that draws bars thinner than the screen can show.</div>
            ${M&&N===void 0?p`<div class="hint">Reading the history…</div>`:f}
            ${M&&N===""?p`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:p`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${R.length===0&&!(T&&(!M||N===void 0||N===""))?p`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${R.length>0?p`<div class="hint">Reads ${Wl(z)}${R.length===z.length?p` · ${z.length} ${z.length===1?"value":"values"}`:p` · ${z.length} of ${R.length}`}</div>`:f}
        ${D?p`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Its recorded history</b> to plot how it has moved.</div>`:f}
        <div class="grid2">
          ${W("Use",m.limit,H=>b(C=>{C.limit=Math.max(0,Math.round(H??0))},"limit"),{step:1,min:0})}
          ${K("From",m.takeFromEnd?"end":"start",[["start","The first readings"],["end","The last readings"]],H=>b(C=>{C.takeFromEnd=H==="end"}))}
        </div>
        <div class="hint">${T?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,h=p`
        ${K("Style",m.style,$l,H=>b(C=>{C.style=H}))}
        <div class="grid2">
          ${K("Scale",m.scale,kl,H=>b(C=>{C.scale=H}))}
          ${K("Baseline",m.baseline,Cl,H=>b(C=>{C.baseline=H}))}
        </div>
        ${m.scale==="fixed"?p`<div class="grid2">
              ${W("Min",m.minValue,H=>b(C=>{C.minValue=H??0},"cmin"))}
              ${W("Max",m.maxValue,H=>b(C=>{C.maxValue=H??100},"cmax"))}
            </div>`:f}
        <div class="hint">${m.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${m.style==="bars"?W("Bar gap (pt)",m.barGap,H=>b(C=>{C.barGap=Math.max(0,H??0)},"gap"),{step:.5,min:0}):W("Line width (pt)",m.lineWidth,H=>b(C=>{C.lineWidth=Math.max(.5,H??2)},"lw"),{step:.5,min:.5})}
        ${K("Highlight",m.highlight,io,H=>b(C=>{C.highlight=H}))}
        ${m.highlight==="none"?f:p`
          <div class="grid2">
            ${m.highlight==="lowest"?f:se("Highest colour",m.highColorHex,H=>b(C=>{C.highColorHex=H??jt},"hicol"))}
            ${m.highlight==="highest"?f:se("Lowest colour",m.lowColorHex,H=>b(C=>{C.lowColorHex=H??qt},"locol"))}
          </div>
          ${K("Marker",m.marker,Sl,H=>b(C=>{C.marker=H}))}
          <div class="hint">Worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":c=p`<div class="grid2">
          ${K("Shape",t.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],m=>o(b=>{b.payload.kind=m}))}
          ${t.payload.kind==="roundedRectangle"?W("Corner radius (pt)",t.payload.cornerRadius,m=>o(b=>{b.payload.cornerRadius=m??6},"radius"),{step:.5,min:0}):f}
        </div>`,h=p`
        ${se("Border colour",t.payload.borderColorHex,m=>o(b=>{m===void 0?delete b.payload.borderColorHex:b.payload.borderColorHex=m},"border"),!0)}
        ${t.payload.borderColorHex!==void 0?W("Border width (pt)",t.payload.borderWidth,m=>o(b=>{b.payload.borderWidth=m??1},"bw"),{step:.5,min:0}):f}`;break;case"image":{let m=t.payload,b=(v,T)=>o(M=>v(M.payload),T);c=p`
        ${m.entity.entityId&&!m.entity.entityId.startsWith("camera.")?p`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:f}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=p`
        ${K("Picture",m.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],v=>b(T=>{T.contentMode=v}))}
        ${Si("Zoom",m.zoom,v=>b(T=>{T.zoom=v},"zoom"),{min:mi,max:4,step:.05,def:1,format:v=>`${v.toFixed(2)}x`})}
        ${Si("Pan left/right",m.panX,v=>b(T=>{T.panX=v},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Si("Pan up/down",m.panY,v=>b(T=>{T.panY=v},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${Ul(m)}</div>
        ${W("Corner radius (pt)",m.cornerRadius,v=>b(T=>{T.cornerRadius=Math.max(0,v??Et)},"imgradius"),{step:1,min:0})}`;break}case"tap":{c=p`
        ${fo(e,t.payload,(m,b)=>o(v=>m(v.payload),b),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let y=t.kind==="image"||t.kind==="tap"?void 0:se(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,m=>o(b=>{b.kind!=="image"&&b.kind!=="tap"&&(b.payload.colorSlot.baseColorHex=m??"#FFFFFF")},"color")),g=Xn(e.config,t),w=g?{kind:{kind:"entityState",...g}}:void 0,x=Q[t.kind],E=t.kind==="tap"?void 0:ye(e.config,i)[0],$=t.kind==="image"?t.payload.timestamp===!0:!1;return p`
    ${oe(e,"content","Content",p`${t.kind==="tap"?f:Vl(e,t,r)}${c}`,{color:x,icon:"content",summary:ql(e,t)})}
    ${h===void 0&&y===void 0?f:oe(e,"look",t.kind==="image"?"Picture":"Look",p`${h??f}${y??f}`,{color:x,icon:t.kind==="image"?"image":"look",...jr(t)?{summary:jr(t)}:{}})}
    ${t.kind==="image"?oe(e,"timestamp","Timestamp",Kl(t.payload,(m,b)=>o(v=>m(v.payload),b)),{color:x,icon:"clock",summary:$?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden"}):f}
    ${t.kind==="tap"?f:oe(e,"tappable","Tap",Xl(e,t,r),{color:q.tap,icon:"tap",summary:E?Re(E.payload.action):"Not tappable"})}
    ${oe(e,"states","States",wo(e,t.payload.rules,t.kind,m=>m.elements.find(b=>b.payload.id===i)?.payload.rules,`rules-${i}`,w),{color:q.states,icon:"states",summary:_t(t.payload.rules).replace(/\.$/,"")})}
    ${oe(e,"placement","Place",p`
      <div class="grid4">
        ${W("X",s.x,m=>d({x:m??0},"x"),{step:.01})}
        ${W("Y",s.y,m=>d({y:m??0},"y"),{step:.01})}
        ${W("W",s.width,m=>d({width:m??.5},"w"),{step:.01,min:0})}
        ${W("H",s.height,m=>d({height:m??.5},"h"),{step:.01,min:0})}
      </div>
      ${W("Rotation (degrees)",s.rotationDegrees,m=>d({rotationDegrees:m??0},"rot"),{step:1})}
      ${t.kind==="shape"||t.kind==="image"||t.kind==="tap"?f:W(`${u} in ${B(n)} (blank = shared ${Nl(t)})`,l.size,m=>e.update(b=>m===void 0?pe(b,n,i,{},!0):pe(b,n,i,{size:m}),`${r}-psize-${n}`),{step:1,min:1,optional:!0})}
      ${he(`Hidden in ${B(n)}`,l.isHidden,m=>e.update(b=>pe(b,n,i,{isHidden:m})))}
      ${he("Hidden in every shape",t.payload.isHidden,m=>o(b=>{b.payload.isHidden=m}))}
      <div class="hint">Drag the layer on the ${B(n)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:q.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${B(n)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function fo(e,t,n,i){let a=t.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return p`
    ${K("Tap action",a.type,Ll,o=>n(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?Pe(e,"Target",a,o=>n(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="openPage"?co(e,t.openPageId,t.openPageName,(o,l)=>n(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):f}`}var Yl=24;function Jl(e,t){let n=[],i=1/0;for(let r of Z){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Pa(e.config,t,r);o&&(n.push(`${B(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return f;let a=i<Yl;return p`<div class=${a?"hint warn":"hint"}>${n.join(" \xB7 ")}${a?p`<br />That is small for a wrist. Show the tap area and drag its corners out.`:f}</div>`}function Xl(e,t,n){if(t.kind==="tap")return f;let i=t.payload.id,a=ye(e.config,i)[0],r=(l,s)=>e.update(d=>{let u=d.elements.find(c=>c.kind==="tap"&&c.payload.attachedTo===i);u&&l(u.payload)},s?`${n}-${s}`:void 0),o=Zn(e.config,t);return p`
    ${he("Tappable",a!==void 0,l=>e.update(s=>{l?Qt(s,i):ei(s,i)}))}
    ${a?p`<div class="value-editor">
          ${fo(e,a.payload,r,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${Yt(a.payload.outset)?f:p`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...Wn}})}>${P("reset")}</button>`}
          </div>
        </div>
        ${Jl(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:p`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Re(o)}</b>.</div>`}`}function qr(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Ne(e,t){switch(e.kind){case"text":return qr(ae(e.payload.value,t));case"icon":return qr(ae(e.payload.symbol,t));case"gauge":return ae(e.payload.value,t);case"chart":return ae(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||"camera"}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function go(e,t){let n=Le(e.config,t.id),i=ue(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===t.id);s&&r(s)},o?`group-${t.id}-${o}`:void 0);return oe(e,"content","Group",p`
    ${ee("Name",t.name,r=>a(o=>{o.name=r},"name"))}
    ${he("Move as one on the watch",t.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(r=>Ne(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Xt(r,t.id))}>Ungroup</button>
    </div>`,{color:q.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function yo(e,t){if(t==="inline")return p`${Zl(e)}${Ti(e,t)}`;let n=e.config.perFamily[t];if(!n)return p`<div class="hint">No settings stored for ${B(t)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${B(t)} settings</button>
      ${Ti(e,t)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[t]),s?`fam-${t}-${s}`:void 0),a=Object.keys(n.placements).length,r=n.backgroundColorHex?ve(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${ve(n.borderColorHex)} border`:"no border";return p`
    ${oe(e,"look",`${B(t)} shape`,p`
      ${se("Background (blank = transparent)",n.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${se("Border colour",n.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${W("Border width (pt)",n.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:q.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${t==="corner"?oe(e,"corner","Corner content",Ql(e,n,i),{color:q.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas"}):f}
    ${oe(e,"states","Shape states",wo(e,n.rules,"layout",l=>l.perFamily[t]?.rules,`rules-${t}`),{color:q.states,icon:"states",summary:_t(n.rules).replace(/\.$/,"")})}
    ${oe(e,"placements","Placements",p`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${B(t)} placement.`}</div>
      ${a>0?p`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:f}`,{color:q.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${Ti(e,t)}`}function Ti(e,t){let n=!ct(e.config,t),i=n?"A complication keeps at least one shape.":`Drop the ${B(t)} shape. The watch stops listing this complication for ${B(t)} slots.`;return oe(e,"shape","Remove this shape",p`
    <div class="adders">
      <button class="danger small" ?disabled=${n} title=${i} @click=${()=>e.removeFamily(t)}>Remove the ${B(t)} shape</button>
    </div>
    ${n?p`<div class="hint">This is the only shape. Add another before removing it.</div>`:p`<div class="hint">The watch stops listing this complication for ${B(t)} slots.</div>`}`,{color:q.place,icon:"delete",summary:n?"The only shape":"Drops its layout"})}function Zl(e){let t=e.config.inline;if(!t)return p`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=ue(e);return p`
    ${oe(e,"content","Inline text",p`
      ${ee("Label (blank = value only)",t.label??"",a=>n(r=>{a?r.label=a:delete r.label},"label"))}
      ${X(e,t.value,a=>n(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${he("Live countdown",t.countdown===!0,a=>n(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${t.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:Q.text,icon:"text",summary:et(`${t.label?`${t.label}: `:""}${ae(t.value,i)}`,48)})}
    ${oe(e,"symbol","Symbol",p`
      ${no(e,t.symbol??"",a=>n(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:Q.icon,icon:"icon",summary:t.symbol||"None"})}`}function Ql(e,t,n){let i=t.curvedText?"curved":"canvas",a=t.bezelGauge?"gauge":t.bezelText?"text":"none";return p`
    ${K("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>n(o=>{r==="curved"?o.curvedText||(o.curvedText=I("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?p`
      ${X(e,t.curvedText,r=>n(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${se("Curved text colour",t.curvedColorHex??"#FFFFFF",r=>n(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${K("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>n(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=I("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:I("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&t.bezelText?p`
      ${X(e,t.bezelText,r=>n(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${he("Live countdown",t.bezelCountdown===!0,r=>n(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&t.bezelGauge?ed(e,t.bezelGauge,n):f}`}function ed(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],a=r=>o=>n(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return p`
    ${X(e,t.value,r=>n(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${W("Gauge min",t.minValue,r=>n(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${W("Gauge max",t.maxValue,r=>n(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${se("Arc colour (min end)",i[0],a(0))}
    ${se("Arc colour (middle)",i[1],a(1))}
    ${se("Arc colour (max end)",i[2],a(2))}
    ${he("End number labels",!!(t.minLabel||t.maxLabel),r=>n(o=>{let l=o.bezelGauge;r?(l.minLabel=I(String(l.minValue)),l.maxLabel=I(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${t.minLabel?X(e,t.minLabel,r=>n(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${t.maxLabel?X(e,t.maxLabel,r=>n(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var Mu=Z.map(e=>[e,B(e)]),Ai={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},td=Object.keys(Ai);function nd(e){let t=tn[e];return td.filter(n=>t.includes(ce[n]))}var id={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function bn(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function et(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function ad(e){if(!e||ke(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function ae(e,t){return`${rd(e,t)}${ad(e.format)}`}function rd(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${et(n.value,40)}"`:"(empty)";case"entityState":return bn(n,t);case"entityAttribute":return n.attribute?`${bn(n,t)} \xB7 ${n.attribute}`:bn(n,t);case"entityAge":return`age of ${bn(n,t)}`;case"aggregate":return od(n.aggregate);case"time":return id[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${et(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(a=>a.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`}}function od(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function wn(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function sd(e,t,n,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return p`
    ${t.length===0?p`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:f}
    ${t.map((o,l)=>ld(e,o,l,t.length,n,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(It())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function ld(e,t,n,i,a,r,o){let l=e.liveBranch(t),s=e.forced.get(t.id)??"live",d=c=>s==="live"?c==="live":s==="otherwise"?c==="otherwise":s.caseId===c,u=(c,h)=>r(y=>{let g=y.find(w=>w.id===t.id);g&&c(g)},h);return p`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(c=>wn(c,n,n-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>r(c=>wn(c,n,n+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(c=>{let h=c.findIndex(y=>y.id===t.id);h>=0&&c.splice(h,1)})}>${P("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((c,h)=>p`<button class="${d(c.id)?"active":""} ${l===c.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:c.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?p`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:f}
    </div>
    ${t.cases.map((c,h)=>dd(e,c,h,t,a,u,`${o}-${c.id}`))}
    <div class="adders"><button class="small" @click=${()=>u(c=>{c.cases.push(ni())})}>+ case</button></div>
    ${he("Otherwise (when no case matches)",t.otherwise!==void 0,c=>u(h=>{c?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?p`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?p`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${bo(e,t.otherwise,a,c=>u(h=>{h.otherwise&&c(h.otherwise)}),`${o}-otherwise`)}
        </div>`:f}
  </div>`}function dd(e,t,n,i,a,r,o){let l=(d,u)=>r(c=>{let h=c.cases.find(y=>y.id===t.id);h&&d(h)},u),s=e.liveBranch(i)===t.id;return p`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${s?p` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(d=>wn(d.cases,n,n-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>r(d=>wn(d.cases,n,n+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let u=d.cases.findIndex(c=>c.id===t.id);u>=0&&d.cases.splice(u,1)})}>${P("delete")}</button>
    </div>
    <div class="row-inline">
      ${K("When",t.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(u=>{u.when.join=d}))}
    </div>
    ${t.when.tests.length===0?p`<div class="hint">No tests: this case always matches.</div>`:f}
    ${t.when.tests.map((d,u)=>cd(e,d,u,c=>l(h=>{let y=h.when.tests.find(g=>g.id===d.id);y&&c(y)}),()=>l(c=>{c.when.tests=c.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(ti())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${bo(e,t.then,a,d=>l(u=>d(u.then)),`${o}-then`)}
  </div>`}function cd(e,t,n,i,a,r){let o=(c,h)=>i(c,h?`${r}-${h}`:void 0),l=t.comparison,s=Je(l.kind),d=e.evaluateTest(t),u=f;switch(s){case"value":u=X(e,l.value??I(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":u=p`${X(e,l.value??I(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${X(e,l.upper??I(""),c=>o(h=>{h.comparison.upper=c},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":u=p`${ee("Pattern",l.pattern??"",c=>o(h=>{h.comparison.pattern=c},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!ud(l.pattern)?p`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"options":u=ee("Options (comma separated)",(l.options??[]).join(", "),c=>o(h=>{h.comparison.options=c.split(",").map(y=>y.trim()).filter(Boolean)},"options"));break;case"none":break}return p`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${P("delete")}</button>
    </div>
    ${l.kind==="isStale"?p`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:X(e,t.value,c=>o(h=>{h.value=c},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${K("Comparison",l.kind,Da.map(c=>[c,pt[c]]),c=>o(h=>{h.comparison=ii(h.comparison,c)}))}
    ${u}
  </div>`}function ud(e){try{return new RegExp(e),!0}catch{return!1}}function bo(e,t,n,i,a){let r=nd(n);return p`
    ${t.length===0?p`<div class="hint">No changes.</div>`:f}
    ${t.map((o,l)=>pd(e,o,l,n,(s,d)=>i(u=>{u[l]&&s(u[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(Xe(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>p`<option value=${o}>${Ai[o]}</option>`)}
    </select>`}var vo=["setColor","setBorderColor","setBackgroundColor"];function pd(e,t,n,i,a,r,o){let l=!tn[i].includes(ce[t.kind]);return p`<div class="change-box">
    <div class="rule-head">
      <span>${Ai[t.kind]}${l?p` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${P("delete")}</button>
    </div>
    ${xo(e,t,a,o)}
  </div>`}function xo(e,t,n,i){let a=nn(t.kind),r=f;if(a==="value"){let o=t.value??I("");if(vo.includes(t.kind)){let l=o.kind.kind==="literal";r=p`${l?se("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>n(d=>{d.value=I(s??"#FFFFFF")},"color")):X(e,o,s=>n(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:I("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?f:p`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=X(e,o,l=>n(s=>{s.value=l},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};r=W(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,l=>n(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=K("Weight",t.weight??"regular",Mi,o=>n(l=>{l.weight=o})));return r}var Fi=new Set,vn=new Map,xn=new Map,Yr=new Map;function wo(e,t,n,i,a,r){let o=wi(t);return!o.ok||Fi.has(a)?p`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{Fi.delete(a),Se(s.target)}}>Show as table</button>
        ${o.ok?f:p`<span class="hint">${o.reason}</span>`}
      </div>
      ${sd(e,t,n,i,a)}`:hd(e,o.table,t[0],n,i,a,r)}function hd(e,t,n,i,a,r,o){let l=(S,R)=>e.update(z=>{let D=a(z);D&&S(D)},R?`${r}-${R}`:void 0),s=t.value??Yr.get(r)??o,d=t.rows.length===0,u=t.numberMode||d&&s!==void 0&&!Lr(s)&&md(e.resolve(s)),c=tn[i],h=vn.get(r)??new Set,y=t.columns.length===0&&h.size===0?[Hr[i]]:[],g=Cr(t.columns,[...h,...y.filter(S=>S!==void 0)],c),w=n?e.liveBranch(n):"none",x=n?e.forced.get(n.id)??"live":"live",E=S=>x!=="live"&&(x==="otherwise"?S==="otherwise":x.caseId===S),$=S=>{n&&e.setForced(n.id,E(S)?"live":S==="otherwise"?"otherwise":{caseId:S})},m=S=>{Yr.set(r,S),t.rows.length!==0&&l(R=>Ir(R,S),"lhs")},b=()=>l(S=>Fr(S,s??I(""),u)),v=t.rows.map((S,R)=>Xr(e,{key:`${r}-${S.caseId}`,label:Ar(S.comparison,z=>ae(z,ue(e))),columns:g,changes:S.changes,live:w===S.caseId,forced:E(S.caseId),onForce:()=>$(S.caseId),when:vd(e,S.comparison,`${r}-${S.caseId}`,(z,D)=>l(H=>{let C=H[0]?.cases.find(O=>O.id===S.caseId)?.when.tests[0];C&&z(C.comparison)},D&&`${S.caseId}-${D}`)),updChanges:(z,D)=>l(H=>{let C=H[0]?.cases.find(O=>O.id===S.caseId);C&&z(C.then)},D&&`${S.caseId}-${D}`),acts:p`
      <button class="icon" title="Move up" ?disabled=${R===0} @click=${()=>l(z=>$i(z,R,R-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${R===t.rows.length-1} @click=${()=>l(z=>$i(z,R,R+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(z=>Rr(z,S.caseId))}>${P("delete")}</button>`})),T=t.otherwise===void 0?f:Xr(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:t.otherwise,live:w==="otherwise",forced:E("otherwise"),onForce:()=>$("otherwise"),when:p`<span class="when-otherwise">Otherwise</span>`,updChanges:(S,R)=>l(z=>{let D=z[0]?.otherwise;D&&S(D)},R),acts:p`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(S=>ki(S,!1))}>${P("close")}</button>`}),M=xn.get(r),N=fd.filter(S=>c.includes(S)&&!g.includes(S));return p`
    <div class="states">
      ${X(e,s??I(""),m,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?p`<div class="hint">Choose what these states look at.</div>`:f}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(S=>p`<th>
              <span>${Me[S]}</span>
              <button class="icon" title=${`Remove the ${Me[S]} column`}
                @click=${R=>{xn.set(r,S),Se(R.target)}}>${P("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${v}
          ${T}
          ${t.rows.length===0&&t.otherwise===void 0?p`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${M===void 0?f:p`<div class="hint warn confirm-row">
        Remove the ${Me[M]} column? Its ${Jr(t,M)} value${Jr(t,M)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${S=>{xn.delete(r),vn.get(r)?.delete(M),Se(S.target),l(R=>Mr(R,M))}}>Remove</button>
        <button class="small" @click=${S=>{xn.delete(r),Se(S.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${b}>+ state</button>
        ${t.otherwise===void 0?p`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(S=>ki(S,!0))}>+ otherwise</button>`:f}
        <span class="spacer"></span>
        ${x==="live"?f:p`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${N.length===0?f:p`<select class="chip-add" title="Add a column" @change=${S=>{let R=S.target,z=R.value;if(R.value="",!z)return;let D=vn.get(r)??new Set;D.add(z),vn.set(r,D),Se(R)}}>
          <option value="" selected>+ column…</option>
          ${N.map(S=>p`<option value=${S}>${Me[S]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${S=>{Fi.add(r),Se(S.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function md(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var fd=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Jr(e,t){let n=0;for(let i of e.rows)mn(i.changes,t)&&(n+=1);return e.otherwise&&mn(e.otherwise,t)&&(n+=1),n}function gd(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Xr(e,t){return p`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{gd(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>p`<td>${yd(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function yd(e,t,n,i,a){let r=mn(n,t),o=Ii(a);if(!r)return p`<button type="button" class="cell empty" title=${`Set ${Me[t]} for this state`}
      @click=${d=>{i(u=>{u.push(Xe(kr[t]))}),Il(d.target,o)}}>unchanged</button>`;let l=(d,u)=>i(c=>{let h=c.find(y=>ce[y.kind]===t);h&&d(h)},u&&`${t}-${u}`),s=Me[t];return p`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${bd(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${ro}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Pt.has(o)?p`${t==="visibility"?K("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(u=>{u.kind=d})):xo(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(u=>{let c=u.findIndex(h=>ce[h.kind]===t);c>=0&&u.splice(c,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:f}
    </div>`}function bd(e,t){if(t.kind==="hide")return p`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return p`<span class="cell-word">Shown</span>`;let n=nn(t.kind);if(n==="number")return p`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return p`<span class="cell-word">${Mi.find(([r])=>r===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??I(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(vo.includes(t.kind))return p`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?ve(a):ae(i,ue(e))}</span>`;if(t.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return p`${r??f}<span class="cell-word">${a}</span>`}return p`<span class="cell-word">${ae(i,ue(e))}</span>`}function ve(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function vd(e,t,n,i){let a=Je(t.kind),r=xi(t.kind),o=(l,s,d,u)=>wd(e,l,s,`${n}-${d}`,r,u,d==="rhs"?"Compare with":"Upper bound");return p`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ie(l=>i(s=>{let d=ii(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${vi.map(l=>p`<option value=${l} ?selected=${l===t.kind}>${xd(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(t.value??I(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?p`<span class="when-and">to</span>${o(t.upper??I(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:f}
  </span>`}function xd(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return pt[e]}}function wd(e,t,n,i,a,r,o){let l=Ii(i),s={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return p`<span class="rhs">
      ${X(e,t,n,{...s,compact:!0})}
    </span>`;let d=t.kind.value;return p`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${ie(u=>n({...t,kind:{kind:"literal",value:u}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${ao(e,l,o,t,n,s)}
  </span>`}var kn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Jn,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function So(e){return kn.find(t=>t.kind===e)??kn[0]}var $o="#FF9F0A",Hi="#8E8E93",$d=["#FF453A","#FFD60A","#34C759"],Eo=["#0A84FF","#34C759","#FF9F0A"];function kd(e){return e?.attributes?.device_class==="battery"?$d:Eo}var Cd={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function Sd(e){let t=e.iconName?.trim();return t?{off:t,on:t}:Cd[Li(e)]??{off:"circle",on:"circle.fill"}}function Ed(e){switch(Li(e)){case"lock":return{kind:"equals",value:I("locked")};case"cover":case"valve":return{kind:"equals",value:I("open")};case"media_player":return{kind:"equals",value:I("playing")};default:return{kind:"isOn"}}}function Li(e){return e.domain||e.entityId.split(".")[0]||""}function nt(e){return{...e,domain:Li(e)}}function Td(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let a=typeof t.device_class=="string"?t.device_class:"",r=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function $n(e){return Math.round(e*1e4)/1e4}function Cn(e,t,n){return Math.min(n,Math.max(t,e))}function _i(e,t,n){let i=re[e],a=Cn($n(t/i.width),0,1),r=Cn($n(n/i.height),0,1);return{x:$n((1-a)/2),y:$n((1-r)/2),width:a,height:r,rotationDegrees:0}}function Fd(e){let t=re[e],n=Cn(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:_i(e,n*1.3,n*1.3),size:n}}function Rd(e){let t=re[e],n=Cn(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:_i(e,t.width*.88,n*1.7),size:n}}function Id(e){let t=re[e],n=Math.min(t.width,t.height)*.9;return{frame:_i(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function To(e){let t=e==="rectangular";return{frame:{x:.05,y:t?.34:.3,width:.9,height:t?.42:.4,rotationDegrees:0},size:2}}function Md(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Ad(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=t))}function ft(e,t,n,i){let a=i(n);t.payload.frame=a.frame,Ad(t,a.size);for(let r of Z){if(r===n||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[t.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function gt(e){return Rt(e)}function zi(e,t){let n={kind:{kind:"entityState",...nt(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function ko(e){let t=Xe("setIcon");return t.value=I(e),t}function tt(e){let t=Xe("setColor");return t.value=I(e),t}function Hd(e,t){let n=It(),i=n.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...nt(e)}},a.comparison=Ed(e);let r=t.on!==t.off;return i.then=r?[ko(t.on),tt($o)]:[tt($o)],n.otherwise=r?[ko(t.off),tt(Hi)]:[tt(Hi)],n}function Ld(e){let t=It(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...nt(e)}},i.comparison={kind:"isUnavailable"};let a=Xe("setOpacity");return a.number=.35,n.then=[a],t}function Co(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function _d(e,t,n=Eo){let i=t.max-t.min,a=Co(t.min+i/3),r=Co(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:I(a)},changes:[tt(n[0])]},{comparison:{kind:"between",value:I(a),upper:I(r)},changes:[tt(n[1])]},{comparison:{kind:"greaterThan",value:I(r)},changes:[tt(n[2])]}];return Sr(zi(e),o)}function zd(e,t,n){let i=gt("icon"),a=Sd(t);return i.payload.symbol=I(a.off),i.payload.colorSlot.baseColorHex=Hi,i.payload.rules=[Hd(t,a)],ft(e,i,n.family,Fd),e.elements.push(i),Qt(e,i.payload.id,{type:"toggleEntity",...nt(t)}),i.payload.id}function Pd(e,t,n){let i=gt("text");return i.payload.value=zi(t,n.state),i.payload.rules=[Ld(t)],ft(e,i,n.family,Rd),e.elements.push(i),i.payload.id}function Nd(e,t,n){let i=gt("gauge");i.payload.value=zi(t);let a=Td(n.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[_d(t,a,kd(n.state))],ft(e,i,n.family,Id),e.elements.push(i),i.payload.id}function Od(e,t,n){let i=gt("chart");return i.payload.value={kind:{kind:"entityState",...nt(t)}},i.payload.highlight="both",i.payload.marker="pointer",ft(e,i,n.family,To),e.elements.push(i),i.payload.id}function Vd(e,t,n){let i=gt("chart");return i.payload.value={kind:{kind:"entityState",...nt(t)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",ft(e,i,n.family,To),e.elements.push(i),i.payload.id}function Dd(e,t,n){let i=gt("image");return i.payload.entity=nt(t),ft(e,i,n.family,Md),e.elements.push(i),i.payload.id}function Fo(e,t,n,i){switch(t){case"toggle":return zd(e,n,i);case"status":return Pd(e,n,i);case"gauge":return Nd(e,n,i);case"chart":return Od(e,n,i);case"history":return Vd(e,n,i);case"camera":return Dd(e,n,i)}}var Gd=3e4,Ud=500,Ro="preset-entity",Kd={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Pi(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function Wd(e){return e.kind==="family"?"look":"content"}function jd(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var Io=300,Mo=400,Ni=52,Ao=36,it=200,qd=720,Sn=320,Yd=80,Jd=56,Ho="wrist-assistant-panel.columns.v2",Oi=e=>Math.max(it,Math.min(qd,Math.round(e))),Lo=e=>e.metaKey||e.ctrlKey||e.shiftKey,_o=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl";function zo(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-Yd;if(i>=it*2+Sn){let r=i-Sn,o=t,l=n;if(o+l>r){let s=r/(o+l);o=Math.max(it,Math.floor(o*s)),l=Math.max(it,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(it,o-d):l=Math.max(it,l-d))}return{columns:3,left:o,right:l}}let a=e-Jd;return a>=it+Sn?{columns:2,left:Math.min(t,a-Sn),right:n}:{columns:1,left:t,right:n}}var A=class extends He{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Io;this.colRight=Mo;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Ht.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=yr(()=>this.requestUpdate());this.imageSizes=br(()=>this.requestUpdate());this.symbols=new un(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||to(Ro)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=Tn`
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
      --wa-text: ${le(Q.text)};
      --wa-icon: ${le(Q.icon)};
      --wa-gauge: ${le(Q.gauge)};
      --wa-shape: ${le(Q.shape)};
      --wa-image: ${le(Q.image)};
      --wa-tap: ${le(Q.tap)};
      --wa-states: ${le(q.states)};
      --wa-place: ${le(q.place)};
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

    /* Add a layer: six tinted buttons, one per kind, then the presets. It sits
       above the list so adding a layer never moves the button just pressed. */
    .add-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    button.add {
      display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 4px; border-radius: 10px;
      font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 14%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 38%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out;
    }
    button.add:hover:not(:disabled) { background: color-mix(in srgb, var(--k) 26%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 65%, transparent); }
    button.add:active:not(:disabled) { transform: translateY(1px); }
    button.add:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 30%, transparent); }
    button.add svg { color: var(--k); width: 15px; height: 15px; flex: none; }
    .presets-l { margin: 14px 0 8px; font-size: 12px; color: var(--wa-muted); }
    .presets { display: flex; flex-wrap: wrap; gap: 6px; }
    button.preset {
      font: inherit; font-size: 12px; padding: 5px 11px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: color .12s ease-out, border-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last. */
    .layers { display: flex; flex-direction: column; gap: 6px; }
    /* Every row is its own outlined container at rest. The border is what
       tells one row from the next, so nothing here may set it to transparent. */
    .layer {
      display: grid; grid-template-columns: 16px 4px ${Ni}px minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 7px 8px 7px 5px; border-radius: var(--wa-r-md);
      border: 1px solid var(--wa-line); background: var(--wa-raised);
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
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
    .layer .grip { color: var(--wa-muted); opacity: .5; display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { opacity: .9; }
    .layer .grip svg { width: 14px; height: 14px; }
    .layer .bar { width: 4px; height: 28px; border-radius: 2px; background: var(--k); box-shadow: 0 0 6px color-mix(in srgb, var(--k) 50%, transparent); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: ${Ni}px; height: ${Ao}px; border-radius: 8px; overflow: hidden; flex: none;
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
    .layer.dragging { opacity: .4; }
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
    .layer .lockbtn.on { opacity: 1; color: ${le(q.locked)}; filter: drop-shadow(0 0 4px ${le(q.locked)}); }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 14px; padding-left: 10px; display: flex; flex-direction: column; gap: 6px;
      border-left: 2px solid color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* Drop targets last, so the bar and the tinted edge beat whatever the row
       already had on its own border. */
    .layer.drop-before { border-top-color: var(--wa-accent); box-shadow: 0 -3px 0 0 var(--wa-accent); }
    .layer.drop-after { border-bottom-color: var(--wa-accent); box-shadow: 0 3px 0 0 var(--wa-accent); }

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
    .vchip b { font-weight: 500; }
    .vchip .val { color: var(--wa-muted); border-bottom: 1px dashed var(--wa-line); }
    .vchip.testing { border-color: var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); border-bottom-color: var(--wa-states); }
    .vchip input { width: 110px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    .testing-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; text-transform: none; letter-spacing: 0; color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .testing-pill button { font: inherit; font-size: 12px; font-weight: 500; background: var(--wa-states); color: #1a1600; border: 0; border-radius: 999px; padding: 2px 9px; cursor: pointer; }
    .empty { opacity: .6; padding: 24px; text-align: center; }

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
    .sec-h h4 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; }
    .sec-h .sum { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sec-h .chev { color: var(--wa-muted); opacity: .7; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 16px; height: 16px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 10px 12px 14px; }
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
      background: var(--wa-card); color: var(--wa-ink);
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
    .hint { font-size: 12px; opacity: .75; margin: 4px 0; }
    .hint.warn { opacity: 1; }
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
    .value-chip .chip-now { max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: .65; }
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
    button.sym { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px 2px; background: none; cursor: pointer; color: var(--wa-ink); border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
    button.sym:hover { border-color: var(--wa-line); background: var(--wa-panel); }
    button.sym.on { border-color: var(--wa-accent); }
    .sym-glyph { display: flex; align-items: center; justify-content: center; height: 24px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-none { font-size: 14px; opacity: .4; }
    .sym-name { font-size: 9px; line-height: 1.1; text-align: center; opacity: .8; overflow-wrap: anywhere; max-height: 22px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(Ho);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=Oi(i.left)),typeof i.right=="number"&&(this.colRight=Oi(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(Ho,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}renderGutter(n){return p`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=Io:this.colRight=Mo,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=zo(this.panelWidth,this.colLeft,this.colRight),l=n==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=c=>{if(c.pointerId!==i.pointerId)return;let h=c.clientX-r,y=Oi(n==="left"?l+h:l-h);n==="left"?this.colLeft=y:this.colRight=y},d=c=>{c.pointerId===i.pointerId&&(u(),this.saveColumnWidths())},u=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(r=>r!==void 0),a=n.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(n.has("inspect")){let i=n.get("inspect");(i===void 0||Pi(i)!==Pi(this.inspect))&&(this.openSections=new Set(Ri))}}updated(n){let i=Pi(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=Kd[n.key];if(r&&!a&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(r.dx,r.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}(n.metaKey||n.ctrlKey)&&(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!a?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!a&&(n.preventDefault(),this.redo()))}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await ia(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${Oe(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=nr(this.owners.find(a=>a.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await da(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await aa(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${Oe(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Ze.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),a=Aa(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Oe(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Ze(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return xa(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await ra(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=Oe(n)}}renderSendButton(){let n=Ba({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return f;let i=Ga(n),a=i.resend&&this.hass.user?.is_admin?p`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return p`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<Vn}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=oi(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let n=Ca(this.draft.config);(this.compiled?.document!==this.compiledDocument||n!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=n,this.scheduleTemplates(Ud))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new Ie(this.buildContext());return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i)}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||mr(n.app_version):!0}get canvasFamily(){if(Lt(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&lr(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=sr(n)[0]??"rectangular")}addShape(n){this.mutate(i=>dr(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!ct(i,n))return;let a=ur(i,n);a.length>0&&!window.confirm(`Remove the ${B(n)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>cr(r,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(Ha("New complication",this.freeSlot(),[n]))}setForced(n,i){let a=new Map(this.forced);i==="live"?a.delete(n):a.set(n,i),this.forced=a}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=Y(),l.slotIndex=o,i=new Ze(l,null)}let a=i.encoded(),r=await oa(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=Ze.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Oe(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await sa(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=Oe(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=Y(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await la(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Oe(a)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},Gd)}async refreshHistorySeries(){let n=this.draft?.config,i=n?Un(n):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points};try{let r=await ua(this.hass,a),o=new Map;for(let[l,s]of Object.entries(r))s.ok&&o.set(l,s.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await ca(this.hass,{doc:n})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=ja(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Oe(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=Xd(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),n.set(i,l)}return{entityStates:n,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return p`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return p`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let r=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Qn(i,r):void 0}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let x=this.focusTapId();if(x!==void 0&&o===x&&l&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,l,x,r??void 0);return}let E=this.hitLayerId(i);E?this.inspect={kind:"layer",id:E}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let u=Lo(i);if(!u&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let c=Qn(this.draft.config,o),h=this.draft.config.elements.find(x=>x.payload.id===c);if(!c||!h)return;if(u){i.preventDefault(),this.togglePick(c);return}let y=qe(this.draft.config,c);if(y?.locked&&!r&&!d){this.beginGroupGesture(n,i,l,y);return}if((this.inspect.kind!=="layer"||this.inspect.id!==c)&&(this.inspect={kind:"layer",id:c},r))return;i.preventDefault();let g=me(this.draft.config,n,h).frame,w=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=c;let x=h.payload,E=ge[n],$=g.width*E.width,m=g.height*E.height,b={x:0,y:0,w:$,h:m,cx:$/2,cy:m/2},v=ln(x,b,sn(new Date));if(this.cancelGesture?.(),s){let S=w.width/E.width,R=x.timestampSize;this.cancelGesture=Or(l,i,s,{w:v.w*S,h:v.h*S},(z,D)=>{let H=Math.min(40,Math.max(4,Math.round(R*z)));this.mutate(C=>{let O=C.elements.find(ne=>ne.payload.id===c);O?.kind==="image"&&(O.payload.timestampSize=H)},`ts-size-${c}`),D&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let T={x:0,y:0,w:g.width*w.width,h:g.height*w.height},M=Fe(x)?{x:x.timestampX,y:x.timestampY}:{x:(v.x+v.w/2)/b.w,y:(v.y+v.h/2)/b.h},N=!1;this.cancelGesture=Nr(l,T,i,M,(S,R,z)=>{z||(N=!0),N&&this.mutate(D=>{let H=D.elements.find(C=>C.payload.id===c);H?.kind==="image"&&(H.payload.timestampX=S,H.payload.timestampY=R)},`ts-${c}`),z&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=gn(l,w,i,{elementId:c,frame:g,handle:r??void 0},{onFrame:(x,E,$)=>{this.mutate(m=>pe(m,n,x,{frame:E}),`drag-${x}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,a,r){let o=this.draft?.config;if(!o)return;let l=Le(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(x=>[x.payload.id,me(o,n,x).frame])),d=[...s.values()],u=Math.min(...d.map(x=>x.x)),c=Math.min(...d.map(x=>x.y)),h=Math.max(...d.map(x=>x.x+x.width)),y=Math.max(...d.map(x=>x.y+x.height)),g={x:u,y:c,width:h-u,height:y-c,rotationDegrees:0},w=x=>Math.round(x*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=gn(a,this.gestureCanvas(n),i,{elementId:r.id,frame:g},{onFrame:(x,E,$)=>{let m=E.x-g.x,b=E.y-g.y;this.mutate(v=>{for(let[T,M]of s)pe(v,n,T,{frame:{...M,x:w(M.x+m),y:w(M.y+b)}})},`drag-group-${r.id}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?zr:1,l=n*o,s=i*o,d=this.canvasFamily,u=ge[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,u,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let x=this.inspect.id;return this.nudgeMany(Le(r,x).map(E=>E.payload.id),d,u,`nudge-group-${x}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let c=this.inspect.id,h=r.elements.find(x=>x.payload.id===c);if(!h)return!1;let y=qe(r,c);if(y?.locked)return this.nudgeMany(Le(r,y.id).map(x=>x.payload.id),d,u,`nudge-group-${y.id}-${d}`,l,s);let g=me(r,d,h).frame,w=Ci(g,l,s,u);return(w.x!==g.x||w.y!==g.y)&&this.mutate(x=>pe(x,d,c,{frame:w}),`nudge-${c}-${d}`),!0}nudgeMany(n,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=b=>Math.round(b*1e3)/1e3,u=new Map;for(let b of n){let v=s.elements.find(T=>T.payload.id===b);v&&u.set(b,me(s,i,v).frame)}if(u.size===0)return!1;let c=[...u.values()],h=Math.min(...c.map(b=>b.x)),y=Math.min(...c.map(b=>b.y)),g=Math.max(...c.map(b=>b.x+b.width)),w=Math.max(...c.map(b=>b.y+b.height)),x={x:h,y,width:g-h,height:w-y,rotationDegrees:0},E=Ci(x,o,l,a),$=E.x-x.x,m=E.y-x.y;return($!==0||m!==0)&&this.mutate(b=>{for(let[v,T]of u)pe(b,i,v,{frame:{...T,x:d(T.x+$),y:d(T.y+m)}})},r),!0}nudgeTimestamp(n,i,a,r){let o=this.draft?.config,l=o?.elements.find(x=>x.payload.id===n);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=ge[i],u=me(o,i,l).frame,c=u.width*d.width,h=u.height*d.height,y=ln(s,{x:0,y:0,w:c,h,cx:c/2,cy:h/2},sn(new Date)),g=Fe(s)?{x:s.timestampX,y:s.timestampY}:{x:c>0?(y.x+y.w/2)/c:.5,y:h>0?(y.y+y.h/2)/h:.5},w=Pr(g,a,r,{w:c,h});return(w.x!==g.x||w.y!==g.y)&&this.mutate(x=>{let E=x.elements.find($=>$.payload.id===n);E?.kind==="image"&&(E.payload.timestampX=w.x,E.payload.timestampY=w.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=on(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=fi(i.scale,r);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=n.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:ye(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(c=>c.payload.id===r);if(!l||!s)return;let d=de(l,s),u=me(l,n,s).frame;this.cancelGesture?.(),this.cancelGesture=gn(a,this.gestureCanvas(n),i,{elementId:r,frame:u,handle:o},{onFrame:(c,h,y)=>{this.mutate(g=>{d?za(g,c,n,h):pe(g,n,c,{frame:h})},`tap-box-${c}-${n}`),y&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:zo(this.panelWidth,this.colLeft,this.colRight);return p`
      <header>
        <h1><span class="mark">${P("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?p`<span class="dirty-dot" title="Unsaved changes"></span>`:f}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!n?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!n?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>p`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${Vi(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":n?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?p`<div class="card error">${this.loadError}</div>`:f}
      ${this.watchSupported?p`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:p`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${fr(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(B).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(n){return p`<span class="shape-dots">${dt.map(i=>p`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${B(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=n?n.config.name.trim()||"Untitled":"No complication",r=n?n.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return p`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?p`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?p`<span class="pk-rev">unsaved</span>`:f}
        ${P("chevron")}
      </button>
      ${this.pickerOpen?p`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?p`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.map(s=>s.kind==="record"?p`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(jd(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:p`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${n&&n.baseRevision===null?p`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:f}
        ${this.hass.user?.is_admin?p`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${P("plus")}<span class="pk-name">New complication</span>${l<0?p`<span class="pk-badge">watch is full</span>`:f}
          </button>
          ${this.newShapeChooser&&l>=0?p`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${dt.map(s=>p`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${B(s)}</button>`)}
            </div>
          </div>`:f}`:f}
      </div>`:f}
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
                ${i.map(a=>p`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Vi(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:p`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?p`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return f;let i=n.elements.length>=64;return p`<div class="card">
      <h2 class="panel-title"><span class="swatch">${P("plus")}</span>Add a layer</h2>
      <div class="add-grid">
        ${pr.map(a=>p`<button class="add" style=${`--k:${Q[a]}`} ?disabled=${i} title=${`Add a blank ${ut[a].toLowerCase()} layer`}
          @click=${()=>{let r=Rt(a);this.mutate(o=>{o.elements.push(r)}),this.inspect={kind:"layer",id:r.payload.id}}}>${P(a)}<span>${ut[a]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${kn.map(a=>p`<button class="preset" title=${a.blurb}
          ?disabled=${n.elements.length+a.layerCount>64}
          @click=${()=>this.openPreset(a.kind)}>${a.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,a,r=!1){n!==i&&this.mutate(o=>{let l=o.elements.filter(g=>!de(o,g)),s=o.elements.filter(g=>de(o,g)),d=[...l].reverse(),u=d.find(g=>g.payload.id===i);if(!u)return;let c=o.groups?.find(g=>g.id===n),h=c?d.filter(g=>g.payload.groupId===c.id):d.filter(g=>g.payload.id===n);if(h.length===0||h.includes(u))return;d=d.filter(g=>!h.includes(g));let y;if((c||r)&&u.payload.groupId!==void 0){let g=d.filter(w=>w.payload.groupId===u.payload.groupId);y=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else y=d.indexOf(u)+(a?0:1);if(d.splice(y,0,...h),!c){let g=h[0],w=r?void 0:u.payload.groupId;w===void 0?delete g.payload.groupId:g.payload.groupId=w}o.elements=[...d.reverse(),...s],_e(o),Ft(o)})}rowDrag(n,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=n,a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"),a.currentTarget.classList.add("dragging")},onEnd:a=>{this.dragId=void 0,a.currentTarget.classList.remove("dragging")},onOver:a=>{if(!this.dragId||this.dragId===n)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=a.clientY<o.top+o.height/2;r.classList.toggle("drop-before",l),r.classList.toggle("drop-after",!l)},onLeave:a=>{a.currentTarget.classList.remove("drop-before","drop-after")},onDrop:a=>{a.preventDefault();let r=a.currentTarget,o=r.classList.contains("drop-before");r.classList.remove("drop-before","drop-after"),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(Lo(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===n){this.togglePick(n);return}let r=[...i.elements].filter(s=>!de(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(n);if(o<0||l<0){this.togglePick(n);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi],i;this.mutate(a=>{i=Ia(a,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return f;let i=this.canEdit,a=this.canvasFamily,r=(v,T)=>this.mutate(M=>{let N=M.elements.filter(C=>!de(M,C)),S=M.elements.filter(C=>de(M,C)),R=N.findIndex(C=>C.payload.id===v),z=R+T;if(R<0||z<0||z>=N.length)return;[N[R],N[z]]=[N[z],N[R]];let D=N[z],H=N[R];D.payload.groupId!==H.payload.groupId&&(H.payload.groupId===void 0?delete D.payload.groupId:D.payload.groupId=H.payload.groupId),M.elements=[...N,...S],_e(M),Ft(M)}),o=v=>{let T;this.mutate(M=>{T=Oa(M,v)}),T&&(this.inspect={kind:"layer",id:T})},l=v=>{this.mutate(T=>Na(T,v)),this.inspect.kind==="layer"&&this.inspect.id===v&&(this.inspect={kind:"general"})},s=[...n.elements].filter(v=>!de(n,v)).reverse(),d=ue(this.host()),u=new Ie(this.buildContext()),c=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",y=this.activeFamily==="inline"?"one line of text":`${c?.backgroundColorHex?ve(c.backgroundColorHex):"transparent"} \xB7 ${c?.borderColorHex?`${c.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(v=>n.elements.some(T=>T.payload.id===v)).length,w=li(n,this.buildContext(),this.forced)[a],x=v=>w?p`<span class="thumb">${or(w,v,{icons:this.icons,imageSizes:this.imageSizes,width:Ni,height:Ao})}</span>`:p`<span class="thumb"></span>`,E=(v,T)=>{let M=v.payload.id,N=this.inspect.kind==="layer"&&this.inspect.id===M,S=me(n,a,v),R=v.payload.isHidden||S.isHidden,z=ye(n,M)[0],D=_t(v.payload.rules),H=this.picking&&this.pickHoverId===M,C=this.rowDrag(M,i);return p`<div class="layer ${N?"hl":""} ${H?"pick":""} ${R?"dim":""} ${this.multi.has(M)?"multi":""} ${T?"kid":""}"
        style=${`--k:${Q[v.kind]}`} tabindex="0" draggable=${C.draggable}
        @click=${O=>this.clickRow(M,O)}
        @keydown=${O=>{O.key==="Enter"&&(this.inspect={kind:"layer",id:M})}}
        @dragstart=${C.onStart} @dragend=${C.onEnd} @dragover=${C.onOver} @dragleave=${C.onLeave} @drop=${C.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${P("grip")}</span>
        <span class="bar"></span>
        ${x([M])}
        <span class="name">
          <b>${Ne(v,d)}</b>
          <small><span class="kind">${ut[v.kind]}</span> · ${Zd(v,u,this.historySeries)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${z?p`<span class="badge tap" title=${`Tappable \xB7 ${Ne(z,d)}`}>tap</span>`:f}
            ${v.payload.rules.length===0?f:p`<span class="badge states" title=${D}>${D.replace(/\.$/,"").toLowerCase()}</span>`}
            ${R?p`<span class="badge">hidden</span>`:f}
          </span>
          ${i?p`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${O=>{O.stopPropagation(),r(M,1)}}>${P("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${O=>{O.stopPropagation(),r(M,-1)}}>${P("down")}</button>
            <button class="icon" title=${S.isHidden?`Show in ${B(a)}`:`Hide in ${B(a)}`} aria-label=${S.isHidden?"Show this layer":"Hide this layer"} @click=${O=>{O.stopPropagation(),this.mutate(ne=>pe(ne,a,M,{isHidden:!S.isHidden}))}}>${P(S.isHidden?"hide":"show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${O=>{O.stopPropagation(),o(M)}}>${P("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${O=>{O.stopPropagation(),l(M)}}>${P("delete")}</button>
          </span>`:f}
        </span>
      </div>`},$=(v,T)=>{let M=this.inspect.kind==="group"&&this.inspect.id===v.id,N=!this.collapsed.has(v.id),S=this.rowDrag(v.id,i),R=T[0],z=T[T.length-1],D=["drop-before","drop-into","drop-after"],H=C=>{let O=C.currentTarget.getBoundingClientRect(),ne=(C.clientY-O.top)/O.height;return ne<.25?"drop-before":!N&&ne>.75?"drop-after":"drop-into"};return p`<div class="layer group ${M?"hl":""}" style=${`--k:${q.group}`} tabindex="0" draggable=${S.draggable}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:v.id}}}
        @keydown=${C=>{C.key==="Enter"&&(this.inspect={kind:"group",id:v.id})}}
        @dragstart=${S.onStart} @dragend=${S.onEnd}
        @dragover=${C=>{if(!this.dragId||this.dragId===v.id)return;C.preventDefault();let O=C.currentTarget,ne=H(C);for(let fe of D)O.classList.toggle(fe,fe===ne)}}
        @dragleave=${C=>{C.currentTarget.classList.remove(...D)}}
        @drop=${C=>{C.preventDefault();let O=C.currentTarget,ne=H(C);O.classList.remove(...D);let fe=this.dragId;if(this.dragId=void 0,!(!fe||!R||!z)){if(ne==="drop-before"){this.reorderLayer(fe,R.payload.id,!0,!0);return}if(ne==="drop-after"){this.reorderLayer(fe,z.payload.id,!1,!0);return}this.isGroupId(fe)||(this.reorderLayer(fe,R.payload.id,!0),this.mutate(Po=>Ma(Po,fe,v.id)))}}}>
        <button class="chev" aria-expanded=${N?"true":"false"} title=${N?"Fold the group":"Unfold the group"}
          @click=${C=>{C.stopPropagation();let O=new Set(this.collapsed);N?O.add(v.id):O.delete(v.id),this.collapsed=O}}>${P("chevron")}</button>
        <span class="bar"></span>
        ${x(T.map(C=>C.payload.id))}
        <span class="name">
          <b>${v.name}</b>
          <small><span class="kind">Group</span> · ${T.length} layer${T.length===1?"":"s"} · ${v.locked?"moves as one":"unlocked"}</small>
        </span>
        <span class="right">
          ${i?p`<span class="acts">
            <button class="icon" title="Ungroup: keep the layers, drop the folder" aria-label="Ungroup" @click=${C=>{C.stopPropagation(),this.mutate(O=>Xt(O,v.id)),M&&(this.inspect={kind:"general"})}}>${P("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${v.locked?"on":""}" ?disabled=${!i}
            title=${v.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${v.locked?"Unlock the group":"Lock the group"}
            @click=${C=>{C.stopPropagation(),this.mutate(O=>{let ne=O.groups?.find(fe=>fe.id===v.id);ne&&(ne.locked=!ne.locked)})}}>${P(v.locked?"lock":"unlock")}</button>
        </span>
      </div>`},m=[],b=new Set;for(let v=0;v<s.length;v++){let T=s[v],M=T.payload.groupId,N=M===void 0?void 0:n.groups?.find(R=>R.id===M);if(!N){m.push(E(T,!1));continue}if(b.has(N.id))continue;b.add(N.id);let S=s.filter(R=>R.payload.groupId===N.id);m.push($(N,S)),this.collapsed.has(N.id)||m.push(p`<div class="group-kids">${S.map(R=>E(R,!0))}</div>`)}return p`<div class="card">
      <h2 class="panel-title"><span class="swatch">${P("layers")}</span>Layers<span class="spacer"></span><span class="mini">top draws last</span>${this.renderPickButton()}</h2>
      ${this.activeFamily==="inline"?p`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${B(a)} shape.</div>`:f}
      ${g>=2&&i?p`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?p`<div class="hint">${_o}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one.</div>`:f}
      ${n.elements.length===0?p`<div class="empty">No layers yet. Add one above.</div>`:f}
      <div class="layers">
      ${m}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${q.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${v=>{v.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${v=>{this.dragId&&(v.preventDefault(),v.currentTarget.classList.add("drop-before"))}}
        @dragleave=${v=>{v.currentTarget.classList.remove("drop-before")}}
        @drop=${v=>{v.preventDefault(),v.currentTarget.classList.remove("drop-before");let T=this.dragId,M=[...s].reverse().find(N=>N.payload.id!==T&&N.payload.groupId!==T);T&&M&&this.reorderLayer(T,M.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${P("shape")}</span>
        <span class="bar"></span>
        ${x([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${B(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${y}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let n=this.presetKind?So(this.presetKind):void 0,i=this.presetEntity;return p`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?f:p`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${Pe(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Ro,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=Fo(l,n,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return p`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return p`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=li(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return p`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${At.map(o=>p`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Ht.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        ${this.renderShowTapsButton()}
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(n,r)}
      </div>
      <div class="strip">
        ${this.renderSettingsRow(n)}
        ${this.renderShapesRow(n,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(n,i,a){let r=i[n];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?qe(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||qe(l,o)?.locked)?Le(l,s).map(g=>g.payload.id):[],u=[...new Set([...d,...this.multi])],c=a.slots[n],h=this.focusTapId(),y={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:c,highlightId:h??o,...u.length>0&&!this.showTaps?{highlightIds:u}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking&&this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return p`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(n,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${gi(r,y)}
    </div>`}renderUnder(n,i){let a=ue(this.host()),r=this.inspect,o=r.kind==="layer"?n.elements.find(c=>c.payload.id===r.id):void 0,l;if(this.showTaps)l=p`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Re(n.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let c=n.groups?.find(y=>y.id===r.id),h=c?Le(n,c.id).length:0;l=c?p`editing group <b>${c.name}</b>. ${c.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let c=qe(n,o.payload.id);l=c?.locked?p`editing <b>${Ne(o,a)}</b> in <b>${c.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:p`editing <b>${Ne(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return p`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=on(s,i),u=Math.round(d.scale*100);return p`<div class="under"><b>${B(i)}</b> · ${s.width} × ${s.height} pt${u!==100?` \xB7 ${u}%`:""} · ${l}</div>`}renderInlinePreview(n,i){let a;if(!n)a=p`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>r?lt((n.countdownEnd-r)/1e3):n.text,l=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;a=p`<div class="inline-line">${l??f}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?a:p`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(n){let i=this.host(),a=this.records.find(u=>u.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?Vi(r):void 0].filter(Boolean).join(" \xB7 "),l=n.values,s=new Ie(this.buildContext()),d=ue(i);return p`<div class="strip-row" style=${`--c:${q.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${P("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?p`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?p`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:p`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${lo(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?p`<button class="small" @click=${()=>{let u=po();this.mutate(c=>{c.values.push(u)}),this.inspect={kind:"data",id:u.id}}}>Add</button>`:f}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?p`<p class="empty">No shared values yet.</p>`:p`<div class="data">
        ${l.map(u=>{let c=s.resolve({kind:{kind:"named",id:u.id}}),h=this.inspect.kind==="data"&&this.inspect.id===u.id;return p`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:u.id}}}>
            <span class="name">${u.name||"(unnamed)"}</span>
            <span class="meta ${c===void 0?"none":""}" title=${ae(u.value,d)}>${c??"unresolved"}</span>
            ${this.canEdit?p`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${y=>{y.stopPropagation(),this.mutate(g=>{g.values=g.values.filter(w=>w.id!==u.id)}),h&&(this.inspect={kind:"general"})}}>${P("delete")}</button>`:f}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let a=n.supportedFamilies;return p`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${q.place}`}><span class="swatch">${P("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${dt.map(r=>{if(!a.includes(r))return p`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${B(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${B(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?gi(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Ht.slots[r]}):f}let d=r!=="inline"&&n.elements.every(c=>me(n,r,c).isHidden||c.payload.isHidden)&&n.elements.length>0,u=this.canEdit&&ct(n,r);return p`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${B(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${B(r)}${d?p`<small>· nothing shown</small>`:f}${l?p`<small>· editing</small>`:f}</span>
            </button>
            ${this.canEdit?p`<button class="icon danger tile-x" ?disabled=${!u}
              title=${u?`Remove the ${B(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${B(r)} shape`}
              @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${P("delete")}</button>`:f}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return f;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return p`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${q.states}`}><span class="swatch">${P("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?p`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?p`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:p`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",u=this.testValues.get(r),h=n.elements.find(g=>en(n,g.payload.id).some(w=>w.ref.entityId===r))?.kind??"text",y=this.editingValue===r;return p`<button class="vchip ${u!==void 0?"testing":""}" style=${`--k:${Q[h]}`}
            title=${u!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${P(h)}</span><b>${l}</b>
            ${y?p`<input type="text" .value=${u??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(r,g.target.value)} />`:p`<span class="val">${u!==void 0?`${u}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[n]?.state;a===""||a===o?r.delete(n):r.set(n,a),this.testValues=r}currentCase(){return At.find(n=>n.label===this.previewCase)??Ht}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let a=this.inspect,r=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":B(this.activeFamily),l=a.kind==="family"&&i===void 0?p`<span class="here" style=${`--k:${q.place}`}>${o} shape</span>`:p`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=f,d=f;if(i!==void 0)s=p`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let u=n.elements.find(c=>c.payload.id===a.id);if(u){s=p`<span class="here" style=${`--k:${Q[u.kind]}`}><span class="kchip">${ut[u.kind]}</span>${Ne(u,ue(this.host()))}</span>`;let c=qe(n,u.payload.id);c&&(d=p`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:c.id}}} title="Edit the group">${c.name}</button>`)}}else if(a.kind==="group"){let u=n.groups?.find(c=>c.id===a.id);u&&(s=p`<span class="here" style=${`--k:${q.group}`}><span class="kchip">Group</span>${u.name}</span>`)}else if(a.kind==="data"){let u=n.values.find(c=>c.id===a.id);u&&(s=p`<span class="here" style=${`--k:${q.complication}`}><span class="kchip">Value</span>${u.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=p`<span class="mini">nothing selected</span>`);return p`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===f?f:p`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return f;let i=this.pickedElements(n);if(i.length>=2)return p`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let a=this.host(),r=this.inspect,o=f,l=!0;if(r.kind==="layer"){let d=n.elements.find(u=>u.payload.id===r.id);if(!d)return this.inspect={kind:"general"},f;o=mo(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=n.groups?.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=go(a,d)}else if(r.kind==="data"){let d=n.values.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=p`<div class="sec" data-open="true" style=${`--c:${q.complication}`}>
        <div class="sec-h"><span class="swatch">${P("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${uo(a,d)}</div>
      </div>`}else r.kind==="family"?o=yo(a,this.activeFamily):(l=!1,o=p`<div class="empty-insp">${P("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return p`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${l?p`<button class="expand" @click=${()=>{this.openSections=s?new Set([Wd(r)]):new Set(Ri)}}>${s?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,a){return p`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${n}${i==="mixed"?p` <span class="mixed">(mixed)</span>`:f}</span></label>`}multiEditor(n,i){let a=this.canvasFamily,r=ue(this.host()),o=new Ie(this.buildContext()),l=ho(n,a,i),s=i.length,d=[...i].reverse(),u=y=>this.mutate(g=>{for(let w of i)pe(g,a,w.payload.id,{isHidden:y})}),c=y=>this.mutate(g=>{for(let w of i){let x=g.elements.find(E=>E.payload.id===w.payload.id);x&&(x.payload.isHidden=y)}}),h=y=>this.mutate(g=>{for(let w of i){let x=g.elements.find(E=>E.payload.id===w.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&(x.payload.colorSlot.baseColorHex=y)}},"multi-colour");return p`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${P("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(y=>p`<div class="row" style=${`--k:${Q[y.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${y.kind==="icon"?p`<span class="glyph">${this.icons.render(o.resolve(y.payload.symbol)??"questionmark",16,y.payload.colorSlot.baseColorHex)??f}</span>`:f}
                <b>${Ne(y,r)}</b><span class="kind">${ut[y.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${_o}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${q.place}`}>
        <div class="sec-h"><span class="swatch">${P("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${B(a)}`,l.hiddenHere,u)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,c)}
          ${l.colourable?p`${se("Colour",l.colour,y=>{y!==void 0&&h(y)})}
              ${l.colour===void 0?p`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:f}`:p`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return f;let i=this.records.find(r=>r.id===this.selectedId),a=xr({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return p`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${n.dirty?p` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?p`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:f}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?p`<pre>${JSON.stringify(n.encoded(),null,2)}</pre>`:f}
      </div>
    </details>`}};L([ot({attribute:!1})],A.prototype,"hass",2),L([ot({type:Boolean})],A.prototype,"narrow",2),L([ot({attribute:!1})],A.prototype,"panel",2),L([_()],A.prototype,"colLeft",2),L([_()],A.prototype,"colRight",2),L([_()],A.prototype,"panelWidth",2),L([_()],A.prototype,"owners",2),L([_()],A.prototype,"ownerId",2),L([_()],A.prototype,"records",2),L([_()],A.prototype,"selectedId",2),L([_()],A.prototype,"draft",2),L([_()],A.prototype,"readOnlyReason",2),L([_()],A.prototype,"parseError",2),L([_()],A.prototype,"maxSchemaVersion",2),L([_()],A.prototype,"presets",2),L([_()],A.prototype,"occupied",2),L([_()],A.prototype,"serverToken",2),L([_()],A.prototype,"appliedToken",2),L([_()],A.prototype,"polling",2),L([_()],A.prototype,"sendPending",2),L([_()],A.prototype,"pages",2),L([_()],A.prototype,"templateResults",2),L([_()],A.prototype,"historySeries",2),L([_()],A.prototype,"templateError",2),L([_()],A.prototype,"templateFetchedAt",2),L([_()],A.prototype,"forced",2),L([_()],A.prototype,"showRaw",2),L([_()],A.prototype,"inspect",2),L([_()],A.prototype,"openSections",2),L([_()],A.prototype,"pickerOpen",2),L([_()],A.prototype,"testValues",2),L([_()],A.prototype,"editingValue",2),L([_()],A.prototype,"multi",2),L([_()],A.prototype,"collapsed",2),L([_()],A.prototype,"activeFamily",2),L([_()],A.prototype,"picking",2),L([_()],A.prototype,"pickHoverId",2),L([_()],A.prototype,"showTaps",2),L([_()],A.prototype,"timestampActiveId",2),L([_()],A.prototype,"savedName",2),L([_()],A.prototype,"presetKind",2),L([_()],A.prototype,"presetEntity",2),L([_()],A.prototype,"newShapeChooser",2),L([_()],A.prototype,"previewCase",2),L([_()],A.prototype,"loadError",2),L([_()],A.prototype,"saveError",2),L([_()],A.prototype,"saving",2),L([_()],A.prototype,"conflict",2),L([_()],A.prototype,"remoteRevision",2),L([_()],A.prototype,"confirmDelete",2),L([_()],A.prototype,"moveTarget",2),L([_()],A.prototype,"moving",2),L([_()],A.prototype,"moveError",2),L([_()],A.prototype,"version",2);function Oe(e){return String(e?.message??e)}function Xd(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function Vi(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function Zd(e,t,n){switch(e.kind){case"text":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.style}`;case"chart":{let i=je(e.payload),a=i!==void 0?n.get(i)??"":t.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Mt(a).length} values`}case"shape":return`${ve(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Re(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",A);export{A as WristAssistantPanel,zo as columnFit};
