var is=Object.defineProperty;var as=Object.getOwnPropertyDescriptor;var L=(e,t,n,i)=>{for(var a=i>1?void 0:i?as(t,n):t,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(t,n,a):o(a))||a);return i&&a&&is(t,n,a),a};var Wt=globalThis,jt=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_n=Symbol(),na=new WeakMap,kt=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==_n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(jt&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=na.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&na.set(n,t))}return t}toString(){return this.cssText}},pe=e=>new kt(typeof e=="string"?e:e+"",void 0,_n),zn=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new kt(n,e,_n)},ia=(e,t)=>{if(jt)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),a=Wt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=n.cssText,e.appendChild(i)}},Pn=jt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return pe(n)})(e):e;var{is:rs,defineProperty:os,getOwnPropertyDescriptor:ss,getOwnPropertyNames:ls,getOwnPropertySymbols:ds,getPrototypeOf:cs}=Object,qt=globalThis,aa=qt.trustedTypes,ps=aa?aa.emptyScript:"",us=qt.reactiveElementPolyfillSupport,Ct=(e,t)=>e,St={toAttribute(e,t){switch(t){case Boolean:e=e?ps:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Yt=(e,t)=>!rs(e,t),ra={attribute:!0,type:String,converter:St,reflect:!1,useDefault:!1,hasChanged:Yt};Symbol.metadata??=Symbol("metadata"),qt.litPropertyMetadata??=new WeakMap;var Fe=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=ra){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,n);a!==void 0&&os(this.prototype,t,a)}}static getPropertyDescriptor(t,n,i){let{get:a,set:r}=ss(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ra}static _$Ei(){if(this.hasOwnProperty(Ct("elementProperties")))return;let t=cs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ct("properties"))){let n=this.properties,i=[...ls(n),...ds(n)];for(let a of i)this.createProperty(a,n[a])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,a]of n)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let a=this._$Eu(n,i);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)n.unshift(Pn(a))}else t!==void 0&&n.push(Pn(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ia(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:St).toAttribute(n,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,n){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:St;this._$Em=a;let l=o.fromAttribute(n,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Yt)(r,n)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Fe.elementStyles=[],Fe.shadowRootOptions={mode:"open"},Fe[Ct("elementProperties")]=new Map,Fe[Ct("finalized")]=new Map,us?.({ReactiveElement:Fe}),(qt.reactiveElementVersions??=[]).push("2.1.2");var Un=globalThis,oa=e=>e,Jt=Un.trustedTypes,sa=Jt?Jt.createPolicy("lit-html",{createHTML:e=>e}):void 0,ha="$lit$",Ne=`lit$${Math.random().toFixed(9).slice(2)}$`,ma="?"+Ne,hs=`<${ma}>`,je=document,Tt=()=>je.createComment(""),Ft=e=>e===null||typeof e!="object"&&typeof e!="function",Kn=Array.isArray,ms=e=>Kn(e)||typeof e?.[Symbol.iterator]=="function",Nn=`[ 	
\f\r]`,Et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,la=/-->/g,da=/>/g,Ke=RegExp(`>|${Nn}(?:([^\\s"'>=/]+)(${Nn}*=${Nn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ca=/'/g,pa=/"/g,fa=/^(?:script|style|textarea|title)$/i,Wn=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),u=Wn(1),k=Wn(2),Ac=Wn(3),qe=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),ua=new WeakMap,We=je.createTreeWalker(je,129);function ga(e,t){if(!Kn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return sa!==void 0?sa.createHTML(t):t}var fs=(e,t)=>{let n=e.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=Et;for(let l=0;l<n;l++){let s=e[l],d,p,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,p=o.exec(s),p!==null);)h=o.lastIndex,o===Et?p[1]==="!--"?o=la:p[1]!==void 0?o=da:p[2]!==void 0?(fa.test(p[2])&&(a=RegExp("</"+p[2],"g")),o=Ke):p[3]!==void 0&&(o=Ke):o===Ke?p[0]===">"?(o=a??Et,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?Ke:p[3]==='"'?pa:ca):o===pa||o===ca?o=Ke:o===la||o===da?o=Et:(o=Ke,a=void 0);let f=o===Ke&&e[l+1].startsWith("/>")?" ":"";r+=o===Et?s+hs:c>=0?(i.push(d),s.slice(0,c)+ha+s.slice(c)+Ne+f):s+Ne+(c===-2?l:f)}return[ga(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Rt=class e{constructor({strings:t,_$litType$:n},i){let a;this.parts=[];let r=0,o=0,l=t.length-1,s=this.parts,[d,p]=fs(t,n);if(this.el=e.createElement(d,i),We.currentNode=this.el.content,n===2||n===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(a=We.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let c of a.getAttributeNames())if(c.endsWith(ha)){let h=p[o++],f=a.getAttribute(c).split(Ne),y=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:y[2],strings:f,ctor:y[1]==="."?Dn:y[1]==="?"?Vn:y[1]==="@"?Bn:lt}),a.removeAttribute(c)}else c.startsWith(Ne)&&(s.push({type:6,index:r}),a.removeAttribute(c));if(fa.test(a.tagName)){let c=a.textContent.split(Ne),h=c.length-1;if(h>0){a.textContent=Jt?Jt.emptyScript:"";for(let f=0;f<h;f++)a.append(c[f],Tt()),We.nextNode(),s.push({type:2,index:++r});a.append(c[h],Tt())}}}else if(a.nodeType===8)if(a.data===ma)s.push({type:2,index:r});else{let c=-1;for(;(c=a.data.indexOf(Ne,c+1))!==-1;)s.push({type:7,index:r}),c+=Ne.length-1}r++}}static createElement(t,n){let i=je.createElement("template");return i.innerHTML=t,i}};function st(e,t,n=e,i){if(t===qe)return t;let a=i!==void 0?n._$Co?.[i]:n._$Cl,r=Ft(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=a:n._$Cl=a),a!==void 0&&(t=st(e,a._$AS(e,t.values),a,i)),t}var On=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,a=(t?.creationScope??je).importNode(n,!0);We.currentNode=a;let r=We.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new It(r,r.nextSibling,this,t):s.type===1?d=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(d=new Gn(r,this,t)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=We.nextNode(),o++)}return We.currentNode=je,a}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},It=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,a){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=st(this,t,n),Ft(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==qe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ms(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==g&&Ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(je.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Rt.createElement(ga(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new On(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=ua.get(t.strings);return n===void 0&&ua.set(t.strings,n=new Rt(t)),n}k(t){Kn(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,a=0;for(let r of t)a===n.length?n.push(i=new e(this.O(Tt()),this.O(Tt()),this,this.options)):i=n[a],i._$AI(r),a++;a<n.length&&(this._$AR(i&&i._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=oa(t).nextSibling;oa(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},lt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,a,r){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=g}_$AI(t,n=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=st(this,t,n,0),o=!Ft(t)||t!==this._$AH&&t!==qe,o&&(this._$AH=t);else{let l=t,s,d;for(t=r[0],s=0;s<r.length-1;s++)d=st(this,l[i+s],n,s),d===qe&&(d=this._$AH[s]),o||=!Ft(d)||d!==this._$AH[s],d===g?t=g:t!==g&&(t+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Dn=class extends lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}},Vn=class extends lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==g)}},Bn=class extends lt{constructor(t,n,i,a,r){super(t,n,i,a,r),this.type=5}_$AI(t,n=this){if((t=st(this,t,n,0)??g)===qe)return;let i=this._$AH,a=t===g&&i!==g||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==g&&(i===g||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Gn=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}};var gs=Un.litHtmlPolyfillSupport;gs?.(Rt,It),(Un.litHtmlVersions??=[]).push("3.3.3");var ya=(e,t,n)=>{let i=n?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=n?.renderBefore??null;i._$litPart$=a=new It(t.insertBefore(Tt(),r),r,void 0,n??{})}return a._$AI(e),a};var jn=globalThis,Oe=class extends Fe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ya(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return qe}};Oe._$litElement$=!0,Oe.finalized=!0,jn.litElementHydrateSupport?.({LitElement:Oe});var ys=jn.litElementPolyfillSupport;ys?.({LitElement:Oe});(jn.litElementVersions??=[]).push("4.2.2");var bs={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:Yt},vs=(e=bs,t,n)=>{let{kind:i,metadata:a}=n,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=n;return function(l){let s=this[o];t.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function dt(e){return(t,n)=>typeof n=="object"?vs(e,t,n):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,t,n)}function _(e){return dt({...e,state:!0,attribute:!1})}var Re="wrist_assistant/complications";async function ba(e){return e.connection.sendMessagePromise({type:`${Re}/owners`})}async function va(e,t){return e.connection.sendMessagePromise({type:`${Re}/list`,owner_watch_id:t})}async function xa(e,t){return e.connection.sendMessagePromise({type:`${Re}/nudge`,owner_watch_id:t})}async function wa(e,t,n,i){return e.connection.sendMessagePromise({type:`${Re}/save`,owner_watch_id:t,document:n,base_revision:i})}async function $a(e,t,n,i){return e.connection.sendMessagePromise({type:`${Re}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function ka(e,t,n){return e.connection.sendMessagePromise({type:`${Re}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function Ca(e,t,n){let i={type:`${Re}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function Sa(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Re}/render_values`,templates:t})).results}async function Ea(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Re}/history_series`,requests:t})).results}var X=["rectangular","circular","corner"],ye={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},xs=["rectangular","circular","corner","inline"];var qn=64;function _a(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<qn;i++)if(!n.has(i))return i;return-1}function At(e){return X.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var ct=[["latest","Newest reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["top","Top of the scale"],["bottom","Bottom of the scale"]],za={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},he={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},nn="#FF6B35",an="#32D74B",Yn="#32D74B",rn="#FF453A";function pt(e){return[...e.bands].sort((t,n)=>t.upTo-n.upTo)}function Pa(e){return e.coloring==="bands"&&e.bands.length>0}function Na(e,t,n){for(let i of t)if(e<=i.upTo)return i.colorHex;return n}function Oa(e,t){let n=Math.abs(t),i=n>=10?0:n>=1?1:2;return e.toFixed(i)}var Jn=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Xn=2,Zn=120;function Da(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?Math.max(Xn,Math.min(Zn,t)):24}function Va(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Ze(e){let t=Va(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${Da(e)}`}function Ba(e){return Qn(e).map(t=>t.key).sort().join(";")}function Qn(e){let t=new Map;for(let n of e.elements){if(n.kind!=="chart")continue;let i=Ze(n.payload),a=Va(n.payload);i===void 0||a===void 0||t.has(i)||t.set(i,{key:i,entityId:a,minutes:Math.round(n.payload.historyMinutes),points:Da(n.payload)})}return[...t.values()]}var Mt=6,Ht=9,ws=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ie(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function ei(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var ti={top:0,left:0,bottom:0,right:0};function on(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var ni=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Ae(e){let t=ni.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function T(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function D(e,t=""){return typeof e=="string"?e:t}function O(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function ke(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function en(e){return e==null?void 0:O(e,0)}function ue(e){return typeof e=="string"?e:void 0}var Ce=class extends Error{};function Je(e){if(typeof e.entityId!="string")throw new Ce("entityId is required");let t={entityId:e.entityId,displayName:D(e.displayName),domain:D(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function Ta(e){if(!T(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=O(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=O(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=O(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),Se(t)?void 0:t}function Se(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function $s(e){let t=D(e.function,"count"),n=T(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(T).map(Je)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let a={function:t,scope:i};if(T(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:D(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Fa(e){switch(e.kind){case"literal":return{kind:"literal",value:D(e.value)};case"entityState":return{kind:"entityState",...Je(e)};case"entityAttribute":return{kind:"entityAttribute",...Je(e),attribute:D(e.attribute)};case"entityAge":return{kind:"entityAge",...Je(e)};case"aggregate":return{kind:"aggregate",aggregate:$s(T(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ue(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:D(e.value)};case"named":return{kind:"named",id:D(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:D(e.layer).toUpperCase(),stat:ct.some(([t])=>t===e.stat)?e.stat:"latest"};default:throw new Ce(`unknown value kind ${String(e.kind)}`)}}function ie(e){if(!T(e))throw new Ce("value must be an object");if(T(e.kind)){let i={kind:Fa(e.kind)},a=Ta(e.format);return a&&(i.format=a),i}let t={kind:Fa(e)},n=Ta(e.format);return n&&(t.format=n),t}function Ga(e){return T(e)?{x:O(e.x,.25),y:O(e.y,.25),width:O(e.width,.5),height:O(e.height,.5),rotationDegrees:O(e.rotationDegrees,0)}:{...za}}function ks(e){if(!T(e))return{kind:"isOn"};let t=D(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=T(e.value)?ie(e.value):I("");break;case"between":n.value=T(e.value)?ie(e.value):I(""),n.upper=T(e.upper)?ie(e.upper):I("");break;case"matchesRegex":n.pattern=D(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function Ra(e){if(!T(e))return{kind:"show"};let t=D(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=T(e.value)?ie(e.value):I("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=O(e.number,0);break;case"setFontWeight":n.weight=ue(e.weight)??"regular";break;default:break}return n}function Ua(e){return Array.isArray(e)?e.filter(T).map(t=>{let n={id:D(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(T).map(i=>{let a=T(i.when)?i.when:{};return{id:D(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(T).map(r=>({id:D(r.id).toUpperCase(),value:T(r.value)?ie(r.value):I(""),comparison:ks(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Ra)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(Ra)),n}):[]}function Cs(e,t){return{baseColorHex:T(e)?D(e.baseColorHex,t):t}}function Ss(e){if(Array.isArray(e.bands))return e.bands.filter(T).map(n=>({id:D(n.id,q()),upTo:O(n.upTo,0),colorHex:D(n.colorHex,"#FFFFFF")}));if(typeof e.bandLowerBound!="number")return[];let t=T(e.colorSlot)?D(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:q(),upTo:e.bandLowerBound,colorHex:D(e.bandLowColorHex,Yn)},{id:q(),upTo:O(e.bandUpperBound,100),colorHex:t}]}function Ye(e,t){if(typeof e.id!="string")throw new Ce("element id is required");return{id:e.id.toUpperCase(),colorSlot:Cs(e.colorSlot,t),rules:Ua(e.rules),frame:Ga(e.frame),isHidden:e.isHidden===!0}}function Es(e){let t=Ts(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function Ts(e){if(!T(e)||!T(e.payload))throw new Ce("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...Ye(t,"#FFFFFF"),value:T(t.value)?ie(t.value):I(""),fontSize:O(t.fontSize,14),fontWeight:ue(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...Ye(t,"#FFFFFF"),symbol:T(t.symbol)?ie(t.symbol):I("lightbulb"),size:O(t.size,14)}};case"gauge":return{kind:"gauge",payload:{...Ye(t,"#FFFFFF"),value:T(t.value)?ie(t.value):I("50"),minValue:O(t.minValue,0),maxValue:O(t.maxValue,100),style:ue(t.style)??"arc",lineWidth:O(t.lineWidth,4),trackColorHex:D(t.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...Ye(t,"#FFFFFF"),value:T(t.value)?ie(t.value):I("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(O(t.historyMinutes,0))),historyPoints:Math.round(O(t.historyPoints,24)),style:ue(t.style)??"bars",limit:Math.max(0,Math.round(O(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:ue(t.scale)??"auto",minValue:O(t.minValue,0),maxValue:O(t.maxValue,100),baseline:ue(t.baseline)??"lowest",barGap:O(t.barGap,1.5),lineWidth:O(t.lineWidth,2),highlight:ue(t.highlight)??"none",highColorHex:D(t.highColorHex,nn),lowColorHex:D(t.lowColorHex,an),marker:ue(t.marker)??"pointer",coloring:ue(t.coloring)??"uniform",bands:Ss(t),bandAboveColorHex:D(t.bandHighColorHex,D(t.bandAboveColorHex,rn)),fillBands:t.fillBands===!0}};case"shape":{let n={...Ye(t,"#FFFFFF33"),kind:ue(t.kind)??"roundedRectangle",cornerRadius:O(t.cornerRadius,6),borderWidth:O(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=Ye(t,"#FFFFFF"),a={...i,entity:Je(T(t.entity)?t.entity:{}),contentMode:t.contentMode==="fit"?"fit":"fill",zoom:O(t.zoom,1),panX:O(t.panX,0),panY:O(t.panY,0),cornerRadius:O(t.cornerRadius,Mt),timestampCorner:ws.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:O(t.timestampSize,Ht)};t.timestamp===!0&&(a.timestamp=!0);let r=en(t.timestampX),o=en(t.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=ke(r),a.timestampY=ke(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:n,...i}=Ye(t,"#FFFFFF"),a={...i,action:T(t.action)?Ka(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(a.openPageId=t.openPageId),typeof t.openPageName=="string"&&(a.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(a.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new Ce(`unknown element kind ${String(e.kind)}`)}}function Ia(e){let t=T(e)?e:{},n={};if(T(t.placements))for(let[a,r]of Object.entries(t.placements)){if(!T(r))continue;let o={frame:Ga(r.frame),isHidden:r.isHidden===!0},l=en(r.size);l!==void 0&&(o.size=l),n[a.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:O(t.borderWidth,2),rules:Ua(t.rules)};if(T(t.bezelText)&&(i.bezelText=ie(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),T(t.curvedText)&&(i.curvedText=ie(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),T(t.bezelGauge)){let a=t.bezelGauge,r={value:T(a.value)?ie(a.value):I("50"),minValue:O(a.minValue,0),maxValue:O(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};T(a.minLabel)&&(r.minLabel=ie(a.minLabel)),T(a.maxLabel)&&(r.maxLabel=ie(a.maxLabel)),i.bezelGauge=r}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function Fs(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=Ia(e[n+1]))}else if(T(e))for(let[n,i]of Object.entries(e))t[n]=Ia(i);return t}function Rs(e){let t={value:T(e.value)?ie(e.value):I("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function Ka(e){if(!T(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Je(e)};default:return{type:"none"}}}function Wa(e){if(!T(e))throw new Ce("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Ce(`${r} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(T).map(r=>({id:D(r.id).toUpperCase(),name:D(r.name),value:T(r.value)?ie(r.value):I("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(T).map(r=>r.kind==="template"?{kind:"template",value:D(r.value)}:r.kind==="entity"?{kind:"entity",...Je(r)}:null).filter(r=>r!==null),i={schemaVersion:O(e.schemaVersion,1),id:D(e.id).toUpperCase(),name:D(e.name,"Custom"),values:t,slotIndex:O(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Es),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Fs(e.perFamily),dataSources:n,tapAction:Ka(e.tapAction)};T(e.inline)&&(i.inline=Rs(e.inline));let a=en(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(T).filter(o=>typeof o.id=="string").map(o=>({id:D(o.id).toUpperCase(),name:D(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return As(i,Array.isArray(e.elements)?e.elements:[]),Le(i),i}function ii(e,t){let n=t?.kind;if(!n||n.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===n.layer);return i?.kind==="chart"?i:void 0}function Lt(e,t){return e.elements.filter(n=>n.kind==="text"&&n.payload.value.kind.kind==="chartStat"&&n.payload.value.kind.layer===t)}function Is(e,t){let n=tn(e,zt(t))?.ref;return n?.displayName||n?.entityId||"Chart"}function ja(e,t,n){let i=Me(e,t.payload.id);if(i){ri(e,n,i.id);return}ai(e,[t.payload.id,n],Is(e,t))}var qa={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1}};function Ya(e,t,n,i){let a=ye.rectangular,r=Math.min(1,(i*n*.62+4)/a.width),o=Math.min(1,n*1.3/a.height),l=e.x+t.x*e.width-t.x*r,s=e.y+t.y*e.height-t.y*o;return{x:Math.max(0,Math.min(1-r,l)),y:Math.max(0,Math.min(1-o,s)),width:r,height:o,rotationDegrees:0}}function Ja(e,t,n){let i=e.elements.find(s=>s.payload.id===t);if(!i||i.kind!=="chart")return;let a=De("text"),r=n==="latest"?10:8,o={kind:{kind:"chartStat",layer:t,stat:n}};n==="latest"&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:n==="latest"?"#FFFFFF":"#FFFFFF99"},a.payload.frame=Ya(i.payload.frame,qa[n],r,n==="latest"?7:4);let l=e.elements.findIndex(s=>s.payload.id===t);return e.elements.splice(l+1,0,a),ja(e,i,a.payload.id),a.payload.id}function As(e,t){for(let n of t){if(!T(n)||n.kind!=="chart"||!T(n.payload))continue;let i=n.payload,a=D(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=D(i.scaleLabelColorHex,"#FFFFFF99"),l=h=>{let f=T(h)?h:{};return{fontSize:O(f.fontSize,8),colorHex:D(f.colorHex,o),pillColorHex:typeof f.pillColorHex=="string"?f.pillColorHex:void 0}},s=[],d=ue(i.scaleLabels);(d==="top"||d==="range")&&s.push(["top",l(i.topLabelStyle)]),d==="range"&&s.push(["bottom",l(i.bottomLabelStyle)]);let p=ue(i.latestLabel);if((p==="corner"||p==="end")&&s.push(["latest",l(i.latestLabelStyle)]),s.length===0)continue;let c=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,f]of s){let y=Ya(r.payload.frame,qa[h],f.fontSize,h==="latest"?5:4),w=[];if(f.pillColorHex!==void 0){let E=De("shape");E.payload.kind="capsule",E.payload.colorSlot={baseColorHex:f.pillColorHex},E.payload.frame={...y},w.push(E)}let x=De("text");x.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},x.payload.fontSize=f.fontSize,x.payload.fontWeight="medium",x.payload.colorSlot={baseColorHex:f.colorHex},x.payload.frame=y,w.push(x),e.elements.splice(c,0,...w),c+=w.length;for(let E of w)ja(e,r,E.payload.id)}}}function U(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function Xe(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Ms(e){let t={};return e.decimals!==void 0&&(t.decimals=U(e.decimals)),e.multiply!==void 0&&(t.multiply=U(e.multiply)),e.offset!==void 0&&(t.offset=U(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function Hs(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(Xe)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function Ls(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...Xe(e)};case"entityAttribute":return{kind:"entityAttribute",...Xe(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...Xe(e)};case"aggregate":return{kind:"aggregate",aggregate:Hs(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function Q(e){let t={kind:Ls(e.kind)};return Se(e.format)||(t.format=Ms(e.format)),t}function Zt(e){return{x:U(e.x),y:U(e.y),width:U(e.width),height:U(e.height),rotationDegrees:U(e.rotationDegrees)}}function _s(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=Q(e.value??I(""));break;case"between":t.value=Q(e.value??I("")),t.upper=Q(e.upper??I(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function Aa(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=Q(e.value??I(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=U(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function Qt(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:Q(a.value),comparison:_s(a.comparison)}))},then:i.then.map(Aa)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(Aa)),n})}function zs(e){let t=Ps(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function Ps(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:Qt(n.rules),frame:Zt(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:Q(e.payload.value),fontSize:U(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:Q(e.payload.symbol),size:U(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...t(e.payload),value:Q(e.payload.value),minValue:U(e.payload.minValue),maxValue:U(e.payload.maxValue),style:e.payload.style,lineWidth:U(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...t(e.payload),value:Q(e.payload.value),historyMinutes:Math.max(0,Math.round(e.payload.historyMinutes)),historyPoints:Math.round(e.payload.historyPoints),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:U(e.payload.minValue),maxValue:U(e.payload.maxValue),baseline:e.payload.baseline,barGap:U(e.payload.barGap),lineWidth:U(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker,coloring:e.payload.coloring,bands:e.payload.bands.map(n=>({id:n.id,upTo:U(n.upTo),colorHex:n.colorHex})),bandAboveColorHex:e.payload.bandAboveColorHex,fillBands:e.payload.fillBands}};case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:U(e.payload.cornerRadius),borderWidth:U(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:Xe(n.entity),rules:Qt(n.rules),frame:Zt(n.frame),isHidden:n.isHidden};n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=U(n.zoom)),n.panX!==0&&(i.panX=U(n.panX)),n.panY!==0&&(i.panY=U(n.panY)),n.cornerRadius!==Mt&&(i.cornerRadius=U(n.cornerRadius));let a=Ie(n),r=a?ei(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),n.timestampSize!==Ht&&(i.timestampSize=U(n.timestampSize)),a&&(i.timestampX=U(n.timestampX),i.timestampY=U(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:Xa(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=Qt(n.rules),i.frame=Zt(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function Ns(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let a of n){let r=e.placements[a],o={frame:Zt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=U(r.size)),i[a]=o}t.placements=i}if(e.bezelText&&(t.bezelText=Q(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=Q(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:Q(i.value),minValue:U(i.minValue),maxValue:U(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=Q(i.minLabel)),i.maxLabel&&(a.maxLabel=Q(i.maxLabel)),t.bezelGauge=a}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=U(e.borderWidth),e.rules.length>0&&(t.rules=Qt(e.rules)),t}function Xa(e){return"entityId"in e?{type:e.type,...Xe(e)}:{type:e.type}}function Os(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=Q(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function sn(e){let t=[];for(let i of X){let a=e.perFamily[i];a&&t.push(i,Ns(a))}let n={schemaVersion:At(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:Q(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(zs),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...Xe(i)}),tapAction:Xa(e.tapAction)};return e.inline!==void 0&&(n.inline=Os(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function Me(e,t){let i=e.elements.find(a=>a.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function He(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!oe(e,n))}function Le(e){let t=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!t.has(a.payload.groupId)&&delete a.payload.groupId;let n=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>n.has(a.id));i.length===0?delete e.groups:e.groups=i}function ut(e){if(!e.groups?.length)return;let t=e.elements.filter(r=>!oe(e,r)),n=e.elements.filter(r=>oe(e,r)),i=[],a=new Set;for(let r=t.length-1;r>=0;r--){let o=t[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=t.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...n],Ve(e)}function ai(e,t,n="Group"){let i=e.elements.filter(r=>t.includes(r.payload.id)&&!oe(e,r));if(i.length<2)return;let a={id:q(),name:n,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return Le(e),ut(e),a.id}function _t(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;Le(e)}function ri(e,t,n){let i=e.elements.find(a=>a.payload.id===t);!i||oe(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,Le(e),ut(e))}var G={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},Ma={literal:["kind","value"],entityState:["kind",...G.entityRef],entityAttribute:["kind",...G.entityRef,"attribute"],entityAge:["kind",...G.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function Za(e){let t=[],n=(s,d,p)=>{if(T(s))for(let c of Object.keys(s))d.includes(c)||t.push(`${p}.${c}`)},i=(s,d)=>{if(!T(s))return;let p=typeof s.kind=="string"?s.kind:"";n(s,Ma[p]??["kind"],d),p==="aggregate"&&T(s.aggregate)&&(n(s.aggregate,G.aggregate,`${d}.aggregate`),n(s.aggregate.scope,G.scope,`${d}.aggregate.scope`),T(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((c,h)=>n(c,G.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(s.aggregate.stateFilter,G.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(T(s)){if(T(s.kind))n(s,G.value,d),i(s.kind,`${d}.kind`);else{let p=typeof s.kind=="string"?s.kind:"";n(s,[...Ma[p]??["kind"],"format"],d),p==="aggregate"&&i(s,d)}n(s.format,G.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((p,c)=>{n(p,G.styleChange,`${d}[${c}]`),T(p)&&a(p.value,`${d}[${c}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((p,c)=>{let h=`${d}[${c}]`;n(p,G.rule,h),T(p)&&(Array.isArray(p.cases)&&p.cases.forEach((f,y)=>{let w=`${h}.cases[${y}]`;n(f,G.case,w),T(f)&&(n(f.when,G.condition,`${w}.when`),T(f.when)&&Array.isArray(f.when.tests)&&f.when.tests.forEach((x,E)=>{let $=`${w}.when.tests[${E}]`;n(x,G.test,$),T(x)&&(a(x.value,`${$}.value`),n(x.comparison,G.comparison,`${$}.comparison`),T(x.comparison)&&(a(x.comparison.value,`${$}.comparison.value`),a(x.comparison.upper,`${$}.comparison.upper`)))}),r(f.then,`${w}.then`))}),r(p.otherwise,`${h}.otherwise`))})};if(!T(e))return t;n(e,G.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>n(s,G.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{n(s,G.named,`$.values[${d}]`),T(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let p=`$.elements[${d}]`;if(n(s,G.elementEnvelope,p),!T(s)||!T(s.payload))return;let c=typeof s.kind=="string"?s.kind:"",h=G[c]??[];n(s.payload,[...G.elementBase,...h],`${p}.payload`),n(s.payload.colorSlot,G.colorSlot,`${p}.payload.colorSlot`),n(s.payload.frame,G.frame,`${p}.payload.frame`),o(s.payload.rules,`${p}.payload.rules`);for(let f of["value","symbol"])f in s.payload&&a(s.payload[f],`${p}.payload.${f}`);c==="image"&&n(s.payload.entity,G.entityRef,`${p}.payload.entity`),c==="tap"&&n(s.payload.action,G.tapAction,`${p}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else T(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let p=`$.perFamily.${s}`;if(n(d,G.layout,p),!!T(d)){if(T(d.placements))for(let[c,h]of Object.entries(d.placements))n(h,G.placement,`${p}.placements.${c}`),T(h)&&n(h.frame,G.frame,`${p}.placements.${c}.frame`);if(a(d.bezelText,`${p}.bezelText`),a(d.curvedText,`${p}.curvedText`),T(d.bezelGauge)){let c=`${p}.bezelGauge`;n(d.bezelGauge,G.bezelGauge,c),a(d.bezelGauge.value,`${c}.value`),a(d.bezelGauge.minLabel,`${c}.minLabel`),a(d.bezelGauge.maxLabel,`${c}.maxLabel`)}o(d.rules,`${p}.rules`)}}return T(e.inline)&&(n(e.inline,G.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>n(s,G.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,G.tapAction,"$.tapAction"),t}function q(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function oi(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Qa(e,t,n=[...X]){let i={};for(let r of X)n.includes(r)&&(i[r]=oi());let a={schemaVersion:4,id:q(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:xs.filter(r=>n.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(a.inline={value:I("Text")}),a.schemaVersion=At(a),a}function De(e){let t=n=>({id:q(),colorSlot:{baseColorHex:n},rules:[],frame:{...za},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:I("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:I("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:I("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:I("13,14,16,17,19,22,24,28,30"),historyMinutes:0,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:nn,lowColorHex:an,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:rn,fillBands:!1}};case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Mt,timestampCorner:"topLeading",timestampSize:Ht}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function I(e){return{kind:{kind:"literal",value:e}}}function er(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let a=n.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function zt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function si(e){let t=[],n=i=>{for(let a of i)a.value&&t.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(a.then)}i.otherwise&&n(i.otherwise)}return t}var li=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function tn(e,t){let n,i=t;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=ii(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function di(e,t){return tn(e,zt(t))?.ref}function ci(e,t){let n=di(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&li.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function Ha(e,t,n){if(on(t)||n.width<=0||n.height<=0)return{...e};let i=t,a=e.x-i.left/n.width,r=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,l=e.y+e.height+i.bottom/n.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=ke(a),r=ke(r),o=ke(o),l=ke(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function tr(e,t,n){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function nr(e,t,n,i){let a=e.elements.find(h=>h.payload.id===t);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=ke(i.x),s=ke(i.y),d=ke(i.x+i.width),p=ke(i.y+i.height),c={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,p-s)};a.payload.outset=tr(o,c,ye[n])}function ir(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i)return;let a=e.perFamily[n];if(!a)return;let r=a.placements[t]?.frame??i.payload.frame,o=ye[n];return{width:r.width*o.width,height:r.height*o.height}}function be(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function oe(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function pi(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function Ve(e){let t=new Map(e.elements.map(a=>[a.payload.id,a])),n=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=t.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=n.get(r);l?l.push(a):n.set(r,[a])}if(n.size===0)return;for(let[a,r]of n){let o=t.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=tr(o.payload.frame,s.frame,ye.rectangular));let d=s.outset,p=!on(d);l.payload.frame=Ha(o.payload.frame,d,ye.rectangular),l.payload.isHidden=o.payload.isHidden;for(let c of X){let h=e.perFamily[c];if(!h)continue;let f=ye[c],y=h.placements[a];if(p){let w=y?.frame??o.payload.frame,x=y?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:Ha(w,d,f),isHidden:x}}else y?h.placements[l.payload.id]={frame:{...y.frame},isHidden:y.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=n.get(a.payload.id);r&&i.push(...r)}e.elements=i}function ln(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind==="tap")return;let a=be(e,t)[0];if(a)return a.payload;let r=De("tap"),o=r.payload;return o.attachedTo=t,o.outset={...ti},o.action=n??ci(e,i),e.elements.push(r),Ve(e),o}function ui(e,t){let n=be(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of X)for(let a of n)delete e.perFamily[i]?.placements[a]}}function dn(e,t){for(let n of Lt(e,t))dn(e,n.payload.id);ui(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of X)delete e.perFamily[n]?.placements[t];Ve(e),Le(e)}function ar(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),i=e.elements[n];if(!i)return;let a=q(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[t,a]];for(let s of be(e,t)){let d=structuredClone(s);d.payload.id=q(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let s of X){let d=e.perFamily[s];if(d)for(let[p,c]of l){let h=d.placements[p];h&&(d.placements[c]=structuredClone(h))}}return Ve(e),a}function hi(e,t){let n=new Set,i=s=>{n.add(s);for(let d of be(e,s))n.add(d.payload.id)};for(let s of t){i(s);for(let d of Lt(e,s))i(d.payload.id)}let a=e.elements.filter(s=>n.has(s.payload.id)).map(s=>structuredClone(s)),r={};for(let s of X){let d=e.perFamily[s];if(!d)continue;let p={};for(let c of a){let h=d.placements[c.payload.id];h&&(p[c.payload.id]=structuredClone(h))}Object.keys(p).length>0&&(r[s]=p)}let o=new Set(a.map(s=>s.payload.groupId).filter(s=>s!==void 0)),l=(e.groups??[]).filter(s=>o.has(s.id)).map(s=>structuredClone(s));return{elements:a,placements:r,groups:l}}function mi(e,t){let n=new Map;for(let s of t.elements)n.set(s.payload.id,q());let i=new Set(e.elements.map(s=>s.payload.id)),a=t.elements.some(s=>i.has(s.payload.id)),r=s=>a?{...s,x:Math.min(.9,s.x+.05),y:Math.min(.9,s.y+.05)}:s,o=[];for(let s of t.elements){let d=structuredClone(s);if(d.payload.id=n.get(s.payload.id),d.kind==="tap"&&d.payload.attachedTo!==void 0){let p=n.get(d.payload.attachedTo);p?d.payload.attachedTo=p:delete d.payload.attachedTo}if(d.kind==="text"&&d.payload.value.kind.kind==="chartStat"){let p=n.get(d.payload.value.kind.layer);if(p)d.payload.value.kind.layer=p;else if(!i.has(d.payload.value.kind.layer))continue}d.payload.frame=r(d.payload.frame),o.push(d)}let l=new Map;for(let s of t.groups){if(o.filter(c=>c.payload.groupId===s.id&&!(c.kind==="tap"&&c.payload.attachedTo!==void 0)).length<2)continue;let p=q();l.set(s.id,p),(e.groups??=[]).push({...structuredClone(s),id:p})}for(let s of o){if(s.payload.groupId===void 0)continue;let d=l.get(s.payload.groupId);d?s.payload.groupId=d:delete s.payload.groupId}e.elements.push(...o);for(let s of X){let d=t.placements[s],p=e.perFamily[s];if(!(!d||!p))for(let[c,h]of Object.entries(d)){let f=n.get(c);f&&o.some(y=>y.payload.id===f)&&(p.placements[f]={...structuredClone(h),frame:r(h.frame)})}}return Ve(e),Le(e),ut(e),o.filter(s=>!oe(e,s)).map(s=>s.payload.id)}function cn(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let i=[],a=tn(e,zt(n));if(a){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of be(e,t)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=tn(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function La(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function rr(e,t,n){let i=e.elements.find(r=>r.payload.id===t);if(!i||n.entityId==="")return;let a={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=La(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=La(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of be(e,t)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var pn={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},or=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Qe(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function un(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function fi(){return{id:q(),value:I(""),comparison:{kind:"isOn"}}}function gi(){return{id:q(),when:{join:"all",tests:[fi()]},then:[]}}function Pt(){return{id:q(),cases:[gi()]}}function yi(e,t){let n={kind:t};switch(Qe(t)){case"value":n.value=e.value??I("");break;case"between":n.value=e.value??I(""),n.upper=e.upper??I("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function et(e){let t={kind:e};switch(un(e)){case"value":t.value=I(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function sr(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function lr(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function cr(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*i&a;return n.toString(16)}function pr(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function dr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function vi(e,t,n=0){let i=t instanceof Map?t:pr(t),a=e.kind;if(a.kind==="named"){if(n>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?vi(o,i,n+1):dr(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!dr(a))return;let r=bi(a);if(r!==void 0)return"e_"+cr(r)}function xe(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Ds(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>xe(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))t=o.length===0?"[]":"("+o.map(c=>`(states.${c} | list)`).join(" + ")+")";else{let c=[];for(let h of l)c.push(`area_entities(${xe(h)})`);for(let h of s)c.push(`label_entities(${xe(h)})`);d.length>0&&c.push(`((${d.map(h=>`floor_areas(${xe(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${c.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(xe).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${xe(i.value)})`:n+=` | rejectattr('state', 'eq', ${xe(i.value)})`),e.function==="count")return`(${n} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${n} | map(attribute=${xe(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function bi(e){switch(e.kind){case"entityAttribute":return`state_attr(${xe(e.entityId)}, ${xe(e.attribute)})`;case"entityAge":{let t=xe(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Ds(e.aggregate);default:return}}function xi(e){let t=new Map,n=new Map,i=pr(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let p=bi(d.kind);if(p===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),p);return}default:{let d=bi(s);if(d===void 0)return;n.set("e_"+cr(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=zt(o);l&&a(l);for(let s of si(o.payload.rules))a(s)}for(let o of X){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of si(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:t,expressions:n};return n.size>0&&(r.document=Vs(n)),r}function Vs(e){let t=[...e.keys()].sort(),n=[];for(let a of t){let r=e.get(a);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${a} %}${r}{% endset %}`):n.push(`{% set v_${a} = ${r} %}`)}let i=t.map(a=>`"${a}": v_${a}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function ur(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[a,r]of Object.entries(t))r===null?i.add(a):n.set(a,Bs(r));return{values:n,nullKeys:i}}function Bs(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function wi(e){let t=xi(e),n=[...t.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function Gs(e,t){if(e.values.length!==0)switch(t){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((n,i)=>n+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin}}function hn(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function ht(e){let t=e.trim(),n=hn(t);if(n!==void 0)return n;let i="";for(let r of t)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:hn(i)}function Us(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function Ks(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function Ws(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function js(e,t,n){if(Se(t))return e;let i=t,a=e,r=hn(e.trim());if(i.relativeTime&&r!==void 0)a=Ks(r);else{let o=ht(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):Us(l))}}switch(i.useEntityUnit&&n&&(a+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Ws(a);break}return a}function mt(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),a=t%60,r=o=>String(o).padStart(2,"0");return n>0?`${n}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Nt(e,t=240){let n=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&n.push(o)}i=""};for(let o of e){if(n.length>=t)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let l=!a;r(),l&&(i+=o),a=!1}else r(),a=!1}return n.length<t&&r(),n}function qs(e,t){let n,i;return t.scale==="fixed"?(n=Math.min(t.minValue,t.maxValue),i=Math.max(t.minValue,t.maxValue)):(n=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),t.baseline==="zero"&&(n=Math.min(n,0),i=Math.max(i,0)),i>n||(i=n+1),{min:n,max:i}}function Ys(e,t,n){if(e===void 0)return 0;let i=ht(e);if(i===void 0||Number.isNaN(i))return 0;let a=n-t;return a===0?0:Math.min(1,Math.max(0,(i-t)/a))}var _e=class{constructor(t,n){this.ctx=t;this.charts=new Map;this.named=new Map(t.namedValues.map(i=>[i.id.toUpperCase(),i.value])),n&&this.settleCharts(n)}chartReadings(t){let n=Ze(t),i=n!==void 0?this.ctx.historySeries?.get(n)??"":this.resolve(t.value)??"",a=Nt(i);t.limit>0&&a.length>t.limit&&(a=t.takeFromEnd?a.slice(a.length-t.limit):a.slice(0,t.limit));let r=qs(a,t),o={values:a,domainMin:r.min,domainMax:r.max},l=this.dereference(t.value);return l&&"entityId"in l.kind&&(o.entity={entityId:l.kind.entityId,displayName:l.kind.displayName,domain:l.kind.domain}),o}settleCharts(t){for(let n of t.elements)n.kind==="chart"&&this.charts.set(n.payload.id,this.chartReadings(n.payload))}dereference(t){let n=t,i=new Set,a=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!Se(a)?a:l.format,n=l}let r={kind:n.kind};return a&&(r.format=a),r}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement;if(n.kind==="chartStat"){let i=this.charts.get(n.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(n.kind.layer.toUpperCase()),r=a?Gs(a,n.kind.stat):void 0;i=a&&r!==void 0?Oa(r,a.domainMax-a.domainMin):void 0;break}default:{let a=vi(t,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return js(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(t)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=hn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?mt(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let a=ht(i),r=()=>this.resolve(n.value),o=()=>{let s=r();return s===void 0?void 0:ht(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(n.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(n.upper),p=d===void 0?void 0:ht(d);if(a===void 0||s===void 0||p===void 0)return!1;let[c,h]=s<=p?[s,p]:[p,s];return a>=c&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let a of t){let r=n?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(he[l.kind],l)}return i}liveBranches(t){let n=new Map;for(let i of t){let a=i.cases.find(r=>this.evaluateCondition(r.when));n.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,a=this.applyRules(i.rules,n),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,p={id:i.id,isHidden:o,frame:s,opacity:d};switch(t.kind){case"text":{let c=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,f={kind:"text",...p,text:this.styleText(a,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??t.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex};return c!==void 0&&(f.countdownEnd=c),f}case"icon":{let c=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...p,symbol:this.styleText(a,"icon")??c,size:this.styleNumber(a,"fontSize")??t.payload.size,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let c=this.styleText(a,"gaugeValue")??this.resolve(t.payload.value),h=this.styleNumber(a,"gaugeMin")??t.payload.minValue,f=this.styleNumber(a,"gaugeMax")??t.payload.maxValue;return{kind:"gauge",...p,fraction:Ys(c,h,f),style:t.payload.style,lineWidth:t.payload.lineWidth,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,trackColorHex:t.payload.trackColorHex}}case"chart":{let c=t.payload,h=this.charts.get(c.id)??this.chartReadings(c),f=h.values,y={min:h.domainMin,max:h.domainMax},w=this.styleColor(a,"color")??c.colorSlot.baseColorHex,x=pt(c),E=Pa(c)?f.map(m=>Na(m,x,c.bandAboveColorHex)):[],$={kind:"chart",...p,values:f,style:c.style,domainMin:y.min,domainMax:y.max,baseline:c.baseline,barGap:c.barGap,lineWidth:c.lineWidth,colorHex:w,highColorHex:c.highColorHex,lowColorHex:c.lowColorHex,marker:c.marker,pointColorHexes:E,fillBands:c.fillBands};if(f.length>0){let m=c.highlight==="highest"||c.highlight==="both",b=c.highlight==="lowest"||c.highlight==="both",v=m?f.indexOf(Math.max(...f)):-1,C=b?f.indexOf(Math.min(...f)):-1;v>=0&&($.highIndex=v),C>=0&&C!==v&&($.lowIndex=C)}return $}case"shape":{let c={kind:"shape",...p,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??t.payload.borderWidth},h=this.styleColor(a,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(c.borderColorHex=h),c}case"image":{let c={kind:"image",...p,entityId:t.payload.entity.entityId,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};Ie(t.payload)&&(c.timestampX=t.payload.timestampX,c.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(c.url=h),c}case"tap":{let c={kind:"tap",...p,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(c.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(c.attachedTo=t.payload.attachedTo),c}}}resolveLayout(t,n,i){let a=t.perFamily[n];this.settleCharts(t);let r=er(t,n).map(w=>this.resolveElement(w,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:n,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,p=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,c=s??p??this.resolve(a?.bezelText);c!==void 0&&(l.bezelText=c),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let w=a.bezelGauge,x=this.resolve(w.value),E=x===void 0?void 0:ht(x);if(E!==void 0){let $=Math.min(w.minValue,w.maxValue),m=Math.max(w.minValue,w.maxValue),b={value:Math.min(m,Math.max($,E)),minValue:$,maxValue:m===$?$+1:m,colorHexes:w.colorHexes},v=this.resolve(w.minLabel);v!==void 0&&(b.minLabel=v);let C=this.resolve(w.maxLabel);C!==void 0&&(b.maxLabel=C),l.bezelGauge=b}}let f=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;f!==void 0&&(l.backgroundColorHex=f);let y=this.styleColor(o,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function Js(e,t,n){let i=new _e(t,n),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function $i(e,t,n){let i=new _e(t),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,n));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Js(e.inline,t,e)),a}var ce=ye,Ot=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:ce,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Dt=Ot.find(e=>e.measured);function wr(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return Ot.find(a=>a.screen.width===n&&a.screen.height===i)}function fn(e,t){let n=ce[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),a=n.width*i,r=n.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Xs={regular:400,medium:500,semibold:600,bold:700};function Ee(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function ze(e,t,n="#FFFFFF"){let i=Ee(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function $r(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),a=(e.frame.x+e.frame.width/2)*t.width,r=(e.frame.y+e.frame.height/2)*t.height;return{x:a-n/2,y:r-i/2,w:n,h:i,cx:a,cy:r}}function Zs(e,t){let n=ze(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:mt((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>t.w&&t.w>0?Math.max(.5,t.w/a):1,o=e.fontSize*r,l=e.text;if(t.w>0&&l.length*i(o)>t.w){let s=t.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${Xs[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${l}</text>`}function Qs(e,t){let n=ze(e.colorHex,"stroke"),i=ze(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=t.w,f=Math.max(a,h*e.fraction);return k`
      <rect x=${t.x} y=${t.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-a/2} width=${f} height=${a} rx=${a/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />`}let r=Math.min(t.w,t.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,p=l*s,c=l*s*e.fraction;return k`
    <g transform="rotate(${d} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${p} ${l}" />
      ${e.fraction>0?k`<circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${c} ${l}" />`:g}
    </g>`}var el=5;function tl(e,t){let n=e.values,i=Math.max(n.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:el,o=e.style==="bars"?0:e.lineWidth/2,l=t.x,s=Math.max(t.w,0),d=t.y+r+o,p=Math.max(t.h-r-o*2,1),c=d+p,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),f=e.baseline==="lowest",y=f?p*.12:0,w=Math.min(Math.max(e.barGap,0),s/(i*2)),x=Math.max((s-w*(i-1))/i,.5),E=m=>Math.min(1,Math.max(0,(m-e.domainMin)/h)),$=m=>c-E(m)*p;return{count:n.length,barWidth:x,plotTop:d,plotBottom:c,baselineY:f?c:$(0),barRect(m){let b=l+m*(x+w),v=n[m],C,H;if(f){let V=y+E(v)*(p-y);C=c-V,H=c}else C=$(v),H=f?c:$(0),C>H&&([C,H]=[H,C]);return{x:b,y:C,w:x,h:Math.max(H-C,.5)}},point(m){let b=Math.max(s-o*2,0);return{x:n.length>1?l+o+b*m/(n.length-1):l+s/2,y:$(n[m])}},markerCenter(m,b){let v=b?this.barRect(m):void 0;return{x:v?v.x+v.w/2:this.point(m).x,y:t.y+r/2}}}}function nl(e,t){if(e.values.length===0)return g;let n=tl(e,t),i=ze(e.colorHex,"fill"),a=ze(e.highColorHex,"fill",e.colorHex),r=ze(e.lowColorHex,"fill",e.colorHex),o=(p,c)=>k`<circle cx=${p.x} cy=${p.y} r="1.7" fill=${c.fill} fill-opacity=${c["fill-opacity"]} />`,l=[],s=e.pointColorHexes.length===n.count,d=p=>s?ze(e.pointColorHexes[p],"fill",e.colorHex):i;if(e.style==="bars")for(let p=0;p<n.count;p++){let c=n.barRect(p),h=p===e.highIndex?a:p===e.lowIndex?r:d(p),f=Math.min(1.2,c.w/2,c.h/2);l.push(k`<rect x=${c.x} y=${c.y} width=${c.w} height=${c.h} rx=${f}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let p=Array.from({length:n.count},(h,f)=>n.point(f)),c=p.map((h,f)=>`${f===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&s&&n.count>1)for(let h=0;h<n.count-1;h++){let f=p[h],y=p[h+1],w=d(h+1),x=`M${f.x} ${f.y} L${y.x} ${y.y} L${y.x} ${n.baselineY} L${f.x} ${n.baselineY} Z`;l.push(k`<path d=${x} fill=${w.fill}
            fill-opacity=${w["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${c} L${p[p.length-1].x} ${n.baselineY} L${p[0].x} ${n.baselineY} Z`;l.push(k`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(s&&n.count>1)for(let h=0;h<n.count-1;h++){let f=p[h],y=p[h+1],w=d(h+1);l.push(k`<path d=${`M${f.x} ${f.y} L${y.x} ${y.y}`} fill="none"
          stroke=${w.fill} stroke-opacity=${w["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(k`<path d=${c} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(o(p[e.highIndex],a)),e.lowIndex!==void 0&&l.push(o(p[e.lowIndex],r))}if(e.marker!=="none"){let p=e.style==="bars";if(e.highIndex!==void 0){let c=n.markerCenter(e.highIndex,p);l.push(e.marker==="pointer"?k`<path d=${`M${c.x} ${c.y-1.8} L${c.x+2.2} ${c.y+1.8} L${c.x-2.2} ${c.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(c,a))}e.lowIndex!==void 0&&l.push(o(n.markerCenter(e.lowIndex,p),r))}return k`${l}`}function il(e,t){let n=ze(e.fillColorHex,"fill"),i=e.borderColorHex?Ee(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",l=i?i.opacity:0;switch(e.shapeKind){case"circle":{let s=Math.min(t.w,t.h)/2-r;return k`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,s)}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"capsule":{let s=Math.min(t.w,t.h)/2;return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${s}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"roundedRectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${e.cornerRadius}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`;case"rectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}}function al(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return k`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let a=ze(e.colorHex,"stroke"),r=e.size;return k`
    <rect x=${t.cx-r/2} y=${t.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var Fi=.25,rl=8;function ol(e,t,n,i,a,r,o,l){let s={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,Fi),rl),p=Math.max(e/n,t/i),c=Math.min(e/n,t/i),h=(a==="fit"?c:p)*d,f=n*h,y=i*h,w=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),x=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(f-e)/2*(1+w)+0,y:-(y-t)/2*(1+x)+0,width:f,height:y}}function gn(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var mn=4;function yn(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),a=n.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?t.x+mn:t.x+t.w-mn-a,d=e.timestampCorner.startsWith("top")?t.y+mn:t.y+t.h-mn-r;return{x:s,y:d,w:a,h:r,size:i,label:n}}let l=(s,d,p,c)=>c>=p?d+(p-c)/2:Math.min(d+p-c,Math.max(d,s-c/2));return{x:l(t.x+e.timestampX*t.w,t.x,t.w,a),y:l(t.y+e.timestampY*t.h,t.y,t.h,r),w:a,h:r,size:i,label:n}}function sl(e,t,n){let i=n.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?yn(e,t,gn(new Date)):void 0,l=o?k`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:g,s=3,d=o&&n.timestampActiveId===e.id?k`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,f,y])=>k`<rect data-ts-corner=${h} x=${f-s/2} y=${y-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:g,p=e.url?n.imageSizes?.size(e.url):void 0,c;if(e.url&&p){let h=ol(t.w,t.h,p.width,p.height,e.contentMode,e.zoom,e.panX,e.panY);c=k`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?c=k`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:c=k`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??g}</g>`;return k`
    <defs><clipPath id=${a}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${l}</g>${d}`}function ll(e,t,n,i,a){if(!i)return g;let r=Math.min(10,t.w*.5,t.h*.5),o=a!==void 0?dl(a,t):void 0;return k`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${Ci} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?k`<g transform="translate(${t.cx-r/2} ${t.cy-r/2})" opacity="0.8">${n.render("hand.tap.fill",r,"#FFD60A")??g}</g>`:g}`}var Ci=5;function dl(e,t){let n=Ci*.55,i=t.w-2;if(t.h<Ci*1.6||i<n*4)return;if(e.length*n<=i)return e;let a=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Si(e,t,n){if(e.isHidden&&!n.showHidden)return g;let i=n.tapReview===!0,a=n.tapAreas===!0||i,r=i?n.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return g;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return g;let s=$r(e,t),d=i&&(!l||o),p;switch(e.kind){case"text":p=Zs(e,s);break;case"icon":p=al(e,s,n.icons);break;case"gauge":p=Qs(e,s);break;case"chart":p=nl(e,s);break;case"shape":p=il(e,s);break;case"image":p=sl(e,s,n);break;case"tap":p=ll(e,s,n.icons,a,d?Ae(e.action):void 0);break}let c=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*c,f=n.highlightId===e.id,y=f||n.highlightIds?.includes(e.id)===!0,w=n.handles===!0&&(!l||o),x=y?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:g,E=n.hoverId===e.id||n.hoverIds?.includes(e.id)===!0?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:g,$=k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,m=3,b=f&&w?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([v,C,H])=>k`<rect data-handle=${v} x=${C-m/2} y=${H-m/2} width=${m} height=${m}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${v}-resize" />`):g;return k`<g data-element-id=${e.id} opacity=${h} style=${w?"cursor:move":g}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${$}${p}${E}${x}${b}</g>`}function bn(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function Ri(e,t){return(t?23.5:34)*e}var hr=10.5;function kr(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function mr(e,t){let n=0;for(let i of e)n+=kr(i,t);return n}function fr(e,t,n){let i=e.toUpperCase(),a=d=>kr(d,n),r=.9*n,o=0;for(let d of i)o+=a(d);if(o<=t)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>t)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function Ei(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function Ti(e,t,n,i){let a=Ei(e,t,n),r=Ei(e,t,i);return`M ${a.x} ${a.y} A ${t} ${t} 0 0 1 ${r.x} ${r.y}`}function Cr(e,t,n,i){let{dial:a}=bn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:t,d:Ti(a,n,i.start,i.end),length:n*r}}function cl(e,t){let n=bn(e,!0);return Cr(e,t,n.dial.r,n.labelArc)}var gr=18.5,pl=113,ul={start:-71,end:-36},yr=104,hl=6.2,br={start:-77,end:-30.5};function vr(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function xr(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),a=n-i,r=vr(e[i]),o=vr(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var ki=11;function ml(e,t,n){let{dial:i}=bn(t,!0),a=yr*t,r=180/(Math.PI*yr),o=e.minLabel!==void 0?mr(e.minLabel,ki)*r:0,l=e.maxLabel!==void 0?mr(e.maxLabel,ki)*r:0,s=br.start+(o>0?Math.max(0,o-1.8):0),d=br.end-(l>0?Math.max(0,l-1.8):0),p=d-s,c=24,h=[];for(let E=0;E<c;E++){let $=s+p*E/c,m=Math.min(d,s+p*(E+1)/c+.4);h.push(k`<path d=${Ti(i,a,$,m)} fill="none"
      stroke=${xr(e.colorHexes,(E+.5)/c)} stroke-width=${hl*t}
      stroke-linecap=${E===0||E===c-1?"round":"butt"} />`)}let f=(e.value-e.minValue)/(e.maxValue-e.minValue),y=Ei(i,a,s+p*f),w=1.5,x=(E,$,m,b)=>k`
    <defs><path id=${E} d=${Ti(i,a,$,m)} /></defs>
    <text font-size=${ki*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${E}" startOffset="50%" text-anchor="middle">${b}</textPath></text>`;return k`${h}
    <circle cx=${y.x} cy=${y.y} r=${3.2*t} fill=${xr(e.colorHexes,f)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?x(`${n}-gmin`,s-w-Math.max(o,3),s-w,e.minLabel):g}
    ${e.maxLabel!==void 0?x(`${n}-gmax`,d+w,d+w+Math.max(l,3),e.maxLabel):g}`}function Ii(e,t){let n=e.family in ce?e.family:"rectangular",i=t.slot??ce[n],a=ce[n],r=fn(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,l=Ee(e.backgroundColorHex),s=Ee(e.borderColorHex),d=e.borderWidth*r.scale;if(n==="corner"){let y=r.scale,w=!!e.bezelText||!!e.bezelGauge,x=e.curvedText??"",E=x!=="",$=bn(y,w),m=Ri(y,w),b=m/(a.width*y),v=$.tile.cx-m/2,C=$.tile.cy-m/2,H=`M 0 0 H ${$.quad.width-$.cornerRadius} A ${$.cornerRadius} ${$.cornerRadius} 0 0 1 ${$.quad.width} ${$.cornerRadius} V ${$.quad.height} H 0 Z`,V=g;if(e.bezelGauge)V=ml(e.bezelGauge,y,o);else if(e.bezelText){let A=cl(y,`${o}-bezel`),N=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?mt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;V=k`<defs><path id=${A.id} d=${A.d} /></defs>
        <text font-size=${hr*y} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${A.id}" startOffset="50%" text-anchor="middle">${fr(N,A.length,hr*y)}</textPath></text>`}let S=g;if(E){let A=Ee(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},N=Cr(y,`${o}-curved`,pl*y,ul);S=k`<defs><path id=${N.id} d=${N.d} /></defs>
        <text font-size=${gr*y} font-weight="600" fill=${A.color} fill-opacity=${A.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${N.id}" startOffset="50%" text-anchor="middle">${fr(x,N.length,gr*y*.88)}</textPath></text>`}else{let A=e.borderWidth*r.scale*b,N=s?k`<circle cx=${m/2} cy=${m/2} r=${m/2-A/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${A} />`:g;S=k`<g transform="translate(${v} ${C})">
        <g clip-path=${`url(#${o})`}>
          ${l?k`<rect width=${m} height=${m} fill=${l.color} fill-opacity=${l.opacity} />`:g}
          <g data-design-box transform="scale(${r.scale*b})">
            ${e.elements.map(W=>Si(W,a,t))}
          </g>
        </g>
        <circle cx=${m/2} cy=${m/2} r=${m/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*y} stroke-dasharray=${`${2*y} ${2*y}`} />
        ${N}
      </g>`}return k`<svg viewBox=${`0 0 ${$.quad.width} ${$.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${$.quad.width} height=${$.quad.height}>
      <defs><clipPath id=${o}><circle cx=${m/2} cy=${m/2} r=${m/2} /></clipPath></defs>
      <path d=${H} fill="#000000" />
      ${V}
      ${S}
    </svg>`}let p=k`<rect width=${i.width} height=${i.height} />`,c=s?k`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:g,h=k`<rect width=${i.width} height=${i.height} fill="#000000" />`,f=`0 0 ${i.width} ${i.height}`;return k`<svg viewBox=${f} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${p}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?k`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:g}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(y=>Si(y,a,t))}
      </g>
    </g>
    ${c}
  </svg>`}var fl=.14;function gl(e,t){let n=$r(e,t);if(e.kind!=="text"||e.text==="")return n;let i=Math.min(n.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(n.h,e.fontSize*1.3);return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}function yl(e,t,n){let i=e.family in ce?e.family:"rectangular",a=ce[i],r=e.elements.filter(h=>t.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let f=gl(h,a),y=h.frame.rotationDegrees%180===0?0:Math.hypot(f.w,f.h)/2;o=Math.min(o,y?f.cx-y:f.x),l=Math.min(l,y?f.cy-y:f.y),s=Math.max(s,y?f.cx+y:f.x+f.w),d=Math.max(d,y?f.cy+y:f.y+f.h)}let p=s-o,c=d-l;if(r.length===0||!(p>0)||!(c>0))o=0,l=0,p=a.width,c=a.height;else{let h=Math.max(2,Math.max(p,c)*fl);o-=h,l-=h,p+=2*h,c+=2*h}if(p/c<n){let h=c*n;o-=(h-p)/2,p=h}else{let h=p/n;l-=(h-c)/2,c=h}return{x:o,y:l,w:p,h:c}}function Sr(e,t,n){let i=e.family in ce?e.family:"rectangular",a=ce[i],r=yl(e,t,n.width/n.height),o=Ee(e.backgroundColorHex),l=Ee(e.borderColorHex),s=e.borderWidth,d={icons:n.icons,showHidden:!0,tapAreas:!0,...n.imageSizes?{imageSizes:n.imageSizes}:{}},p=e.elements.filter(f=>t.includes(f.id)),c=l&&s>0?i==="rectangular"?k`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:g,h=i==="rectangular"?k`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return k`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${n.width} height=${n.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${p.map(f=>Si(f,a,d))}
    ${c}
  </svg>`}function K(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var ft=["rectangular","circular","corner","inline"];function Vt(e){return X.includes(e)}function Er(e){return ft.filter(t=>e.supportedFamilies.includes(t))}function Tr(e){return X.find(t=>e.supportedFamilies.includes(t))}function gt(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function bl(e){let t=e.elements.find(i=>i.kind==="text");return{value:t&&t.kind==="text"?structuredClone(t.payload.value):I("Text")}}function Fr(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=ft.filter(n=>n===t||e.supportedFamilies.includes(n))),Vt(t)?e.perFamily[t]||(e.perFamily[t]=oi()):e.inline||(e.inline=bl(e)),e.schemaVersion=At(e)}function Rr(e,t){gt(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),Vt(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=At(e))}function Ir(e,t){let n=[];if(!Vt(t)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let a=Object.keys(i.placements).length;return a>0&&n.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var te={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},yt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},Ar=["text","icon","gauge","chart","shape","image","tap"],Y={states:"#f9a825",tap:te.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Mr="2.8.0";function Ai(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function vl(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function Hr(e,t=Mr){let n=Ai(e),i=Ai(t);return!n||!i?!1:vl(n,i)>=0}function Lr(e,t=Mr){return`${Ai(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var _r="52a9d81d0fd7";function xl(e){return e.trim().replace(/\./g,"-")}function wl(e){return e.trim().replace(/-/g,".")}var vn=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>wl(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let a=xl(t),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Ee(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},Mi=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let a=this.icons.get(t.trim());if(!a)return;let r=Ee(i)??{color:"#FFFFFF",opacity:1};return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${_r}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,a]of Object.entries(n))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function zr(e){return vn.available()?new vn(e):new Mi(e)}function Pr(e){let t=new Map,n=new Set;return{size(i){let a=t.get(i);if(a)return a;if(n.has(i))return;n.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(t.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var wn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],$n=[...new Set(wn.flatMap(e=>e.symbols))],$l={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function kl(e){return`${e.replace(/\./g," ")} ${($l[e]??[]).join(" ")}`}function Nr(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let a of e){let r=kl(a);if(!n.every(l=>r.includes(l)))continue;let o=n.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var xn=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var Cl=100;function Or(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var tt=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,Ve(t),this.baseline=JSON.stringify(sn(t))}static fromDocument(t,n){return new e(Wa(t),n)}get dirty(){return JSON.stringify(sn(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Cl&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let r=structuredClone(this.config);t(r),Ve(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=wi(t),sn(t)}commit(){let t=structuredClone(this.config);return t.dataSources=wi(t),new e(t,null)}};var bt={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Pe={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Vr=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Br={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Hi=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Sl=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function Li(e){return Sl.includes(e)}function El(e){return Hi.includes(e)}function Tl(e,t){return JSON.stringify(Q(e))===JSON.stringify(Q(t))}function _i(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[r,o]of t.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!El(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${bt[s.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=s.value;else if(!Tl(n,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Dr(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Pe[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(t.otherwise){let r=Dr(t.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Pe[r]} twice. A table has one cell per column.`}}let a={ruleId:t.id,rows:i,columns:Fl(i,t.otherwise),numberMode:i.length>0&&i.every(r=>Li(r.comparison.kind))};return n!==void 0&&(a.value=n),t.otherwise&&(a.otherwise=t.otherwise),{ok:!0,table:a}}function Dr(e){let t=new Set;for(let n of e){let i=he[n.kind];if(t.has(i))return i;t.add(i)}}function Fl(e,t){let n=new Set;for(let i of e)for(let a of i.changes)n.add(he[a.kind]);for(let i of t??[])n.add(he[i.kind]);return Vr.filter(i=>n.has(i))}function Gr(e,t,n){let i=new Set(e);for(let a of t)i.add(a);return Vr.filter(a=>i.has(a)&&n.includes(a))}function kn(e,t){return e.find(n=>he[n.kind]===t)}function Ur(e,t,n,i){let a=t.map(o=>({id:o.caseId??q(),when:{join:o.join??"all",tests:[{id:o.testId??q(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??q(),cases:a};return n&&(r.otherwise=n),r}function Bt(e){if(e.length===0)return"No states yet.";let t=_i(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function Kr(e){let t=e[0];return t||(t={id:q(),cases:[]},e.push(t)),t}function Wr(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function jr(e,t,n){let i=Kr(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:q(),when:{join:"all",tests:[{id:q(),value:structuredClone(t),comparison:Il(a,n)}]},then:[]})}function qr(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),Wr(e))}function zi(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[a]=i.splice(t,1);a&&i.splice(n,0,a)}function Pi(e,t){if(t){Kr(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,Wr(e))}function Yr(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function Jr(e,t){let n=e[0];if(!n)return;let i=a=>a.filter(r=>he[r.kind]!==t);for(let a of n.cases)a.then=i(a.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function Rl(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Xr(e,t=Rl){let n=()=>t(e.value??I(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??I(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Qe(e.kind)==="value"?`${bt[e.kind]} ${n()}`:bt[e.kind]}}function Il(e,t){if(!e)return t?{kind:"lessThan",value:I("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??I("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};default:return{kind:e.kind,...Qe(e.kind)==="value"?{value:I("")}:{}}}}var Zr={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function Qr(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function Al(e){switch(e){case"text":return k`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return k`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return k`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return k`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return k`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return k`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return k`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return k`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return k`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return k`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return k`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return k`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return k`<path d="M6 9L12 15L18 9" />`;case"plus":return k`<path d="M12 5V19M5 12H19" />`;case"watch":return k`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"lock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return k`<path d="M6 14L12 8L18 14" />`;case"down":return k`<path d="M6 10L12 16L18 10" />`;case"show":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return k`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return k`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return k`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return k`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`}}function P(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Al(e)}</svg>`}function vt(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=n.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function eo(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var Cn=e=>Math.round(e*1e3)/1e3,to=10;function Ni(e,t,n,i){let a=i.width>0?e.x+t/i.width:e.x,r=i.height>0?e.y+n/i.height:e.y;return eo({...e,x:Cn(a),y:Cn(r)})}function no(e,t,n,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?Cn(a(e.x+t/i.w)):e.x,y:i.h>0?Cn(a(e.y+n/i.h)):e.y}}function Sn(e,t,n,i,a){let r=vt(e,n),o={...i.frame},l=o;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let f=vt(e,h),y=(f.x-r.x)/t.width,w=(f.y-r.y)/t.height,x;if(!i.handle)x=eo({...o,x:s(o.x+y),y:s(o.y+w)});else{let{x:E,y:$,width:m,height:b}=o,v=o.x+o.width,C=o.y+o.height;i.handle.includes("e")&&(m=Math.max(.04,o.width+y)),i.handle.includes("s")&&(b=Math.max(.04,o.height+w)),i.handle.includes("w")&&(m=Math.max(.04,o.width-y),E=v-m),i.handle.includes("n")&&(b=Math.max(.04,o.height-w),$=C-b),x={...o,x:s(E),y:s($),width:s(m),height:s(b)}}l=x,a.onFrame(i.elementId,x,!1)},p=h=>{h.pointerId===n.pointerId&&(c(),a.onFrame(i.elementId,l,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),c}function io(e,t,n,i,a){let r=vt(e,n),o=i;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let f=vt(e,h),y=t.w>0?s(i.x+(f.x-r.x)/t.w):i.x,w=t.h>0?s(i.y+(f.y-r.y)/t.h):i.y;o={x:l(y),y:l(w)},a(o.x,o.y,!1)},p=h=>{h.pointerId===n.pointerId&&(c(),a(o.x,o.y,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),c}function ao(e,t,n,i,a){let r=vt(e,t),o=1;e.setPointerCapture(t.pointerId);let l=p=>{if(p.pointerId!==t.pointerId)return;let c=vt(e,p),h=(c.x-r.x)*(n.includes("e")?1:-1),f=(c.y-r.y)*(n.includes("s")?1:-1),y=i.w>0?(i.w+h)/i.w:1,w=i.h>0?(i.h+f)/i.h:1,x=Math.abs(y-1)>=Math.abs(w-1)?y:w;o=Math.max(.05,x),a(o,!1)},s=p=>{p.pointerId===t.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}var Gi=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function le(e){return t=>e(t.target.value)}function ne(e,t,n,i={}){return u`<label class="field"><span>${e}</span>
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??g}
      class=${i.mono?"mono":""} @input=${le(n)} /></label>`}function Ml(e,t,n,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${le(n)}></textarea></label>`}function j(e,t,n,i={}){let a=t===void 0||Number.isNaN(t)?"":String(t);return u`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??g} max=${i.max??g}
      @input=${le(r=>{if(r.trim()===""){i.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} /></label>`}function B(e,t,n,i){return u`<label class="field"><span>${e}</span>
    <select @change=${le(a=>i(a))}>
      ${n.map(([a,r])=>u`<option value=${a} ?selected=${a===t}>${r}</option>`)}
    </select></label>`}function Oi(e,t,n,i){let a=i.format??(r=>String(Math.round(r*100)/100));return u`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${le(r=>{let o=Number(r);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${a(t)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${t===i.def}
        @click=${()=>n(i.def)}>${P("reset")}</button>
    </div></div>`}function me(e,t,n){return u`<label class="field check"><input type="checkbox" .checked=${t} @change=${i=>n(i.target.checked)} /><span>${e}</span></label>`}function ae(e,t,n,i=!1){let a=(t??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,p)=>{let c=d.replace(/^#/,"").toUpperCase();return p>=100?`#${c}`:`#${c}${Math.round(p/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return u`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${d=>n(d.target.checked?s(o,l):void 0)} />`:g}
      <input type="color" .value=${o} ?disabled=${i&&t===void 0} @input=${le(d=>n(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${le(d=>n(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${le(d=>{let p=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(p)&&n(p.startsWith("#")?p.toUpperCase():`#${p.toUpperCase()}`)})} />
    </div></div>`}function bo(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function Hl(e,t){let n=t===void 0?void 0:typeof t=="string"?[t]:t,i=[];for(let[a,r]of Object.entries(e)){let o=a.split(".")[0]??"";if(n!==void 0&&!n.includes(o))continue;let l=typeof r?.attributes?.friendly_name=="string"?r.attributes.friendly_name.trim():"";i.push({entityId:a,name:l||a,state:r?.state??"",domain:o})}return i.sort((a,r)=>a.name.localeCompare(r.name)||a.entityId.localeCompare(r.entityId)),i}var vo=50;function Ll(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function _l(e,t,n=vo,i){let a=t.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,n);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),p=s.name.toLowerCase(),c=-1;d===a?c=0:d.startsWith(a)?c=1:p.startsWith(a)?c=2:d.includes(a)?c=3:p.includes(a)?c=4:o.length>1&&o.every(h=>d.includes(h)||p.includes(h))&&(c=5),c>=0&&l.push({c:s,rank:c})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,n).map(s=>s.c)}var zl=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function xo(e){return zl.test(e.trim())}function Pl(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return bo(n,i);if(xo(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var xt=new Map;function Te(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}t=a}}function wo(e){return xt.has(e)}function Be(e,t,n,i,a,r={}){let o=e.hass.states,l=xt.get(a),s=l?_l(Hl(o,r.domain),l.query,vo,r.preferNumeric?Ll:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,p=n.entityId?o[n.entityId]:void 0,c=($,m,b=0)=>{xt.set(a,{query:m,index:b}),Te($)},h=$=>{xt.delete(a),Te($)},f=$=>{let m=Pl($,n,o);m&&i(m)},y=($,m)=>{i(bo(o,$.entityId)),h(m)},w=()=>Math.max(0,Math.min(xt.get(a)?.index??0,s.length-1)),x=$=>{let m=$.target;if($.key==="ArrowDown"||$.key==="ArrowUp"){$.preventDefault();let b=xt.get(a);if(!b){c(m,m.value);return}let v=$.key==="ArrowDown"?w()+1:w()-1;c(m,b.query,Math.max(0,Math.min(s.length-1,v))),Nl(m);return}if($.key==="Enter"){$.preventDefault();let b=s[w()];l&&b?y(b,m):(f(m.value),h(m));return}if($.key==="Escape"){if(!l)return;$.preventDefault(),$.stopPropagation(),h(m)}},E=n.entityId===""?u`<div class="hint">Type part of a name, such as "kitchen".</div>`:p?u`<div class="entity-current"><span class="ent-name">${typeof p.attributes.friendly_name=="string"?p.attributes.friendly_name:n.entityId}</span><span class="ent-state">${p.state}</span></div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${t}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
      .value=${l?l.query:n.entityId}
      placeholder="Search entities, or type an id"
      @focus=${$=>{let m=$.target;c(m,n.entityId),m.select()}}
      @input=${$=>{let m=$.target;c(m,m.value)}}
      @keydown=${x}
      @blur=${$=>{let m=$.target;l&&f(m.value),h(m)}} />
    ${l?u`<div class="entity-results" role="listbox">
          ${s.length===0?u`<div class="hint" style="padding:6px 8px">${xo(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map(($,m)=>u`<button type="button" role="option" aria-selected=${m===d?"true":"false"} class="ent ${m===d?"hl":""}"
                @mousedown=${b=>b.preventDefault()} @click=${b=>y($,b.target)}>
                <span class="ent-main">
                  <span class="ent-name">${$.name}</span>
                  <span class="ent-id mono">${$.entityId}</span>
                </span>
                <span class="ent-state">${$.state}</span>
              </button>`)}
        </div>`:E}
    ${r.compact?g:u`<details class="sub">
      <summary>Display name: ${n.displayName||"(none)"}</summary>
      ${ne("Display name",n.displayName,$=>i({...n,displayName:$}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function Nl(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Ol=120;function Dl(e,t,n,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(wn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:a($n),fromPack:!1}}function ro(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function Vl(e){return[{value:"",label:`Starter set (${ro($n,e)})`},...wn.map(t=>({value:t.name,label:`${t.name} (${ro(t.symbols,e)})`}))]}function Bl(e){return e.length>0?e.length:$n.length}function Gl(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function oo(e,t,n,i){let a=e.icons.render(t,22,"#FFFFFF");return u`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${a??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function $o(e,t,n,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),p=t.trim(),c=p!==""&&d.size>0&&!d.has(p),h=y=>{n(y),a.noteUsed(y)},f=g;if(r){let y=a.category(i),w=Dl(y,o,s,d),x=Nr(w.names,o),E=w.fromPack?x.slice(0,Ol):x,$=d.size===0?a.recent:a.recent.filter(m=>d.has(m));f=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${le(m=>a.setQuery(i,m))} />
        <select @change=${le(m=>a.setCategory(i,m))}>
          ${Vl(d).map(m=>u`<option value=${m.value} ?selected=${m.value===y}>${m.label}</option>`)}
        </select>
      </div>
      ${$.length===0?g:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${$.map(m=>oo(e,m,m===p,h))}</div>`}
      <div class="sym-grid">${E.map(m=>oo(e,m,m===p,h))}</div>
      ${x.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${Gl(E.length,x.length,o.trim()!=="",Bl(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:g:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${le(n)} @change=${le(y=>{(d.size===0||d.has(y.trim()))&&a.noteUsed(y)})} /></label>
    ${c?u`<div class="hint warn">The installed icon pack has no <code>${p}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:g}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${f}`}var Ul=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],Kl=[["bars","Bars"],["line","Line"],["area","Area"]],Wl=[["auto","Auto (fit the readings)"],["fixed","Fixed range"]],jl=[["lowest","Lowest value"],["zero","Zero"]],ko=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],ql=[["none","None"],["pointer","Triangle and dot"],["dot","Dots"]],Yl=[["uniform","One colour"],["bands","By value"]];function Jl(e){let t=[Yn,"#FFD60A"];if(e.length<2)return t.map((o,l)=>({id:q(),upTo:(l+1)*33,colorHex:o}));let n=Math.min(...e),a=Math.max(...e)-n,r=o=>Number(o.toFixed(a>=10?0:2));return t.map((o,l)=>({id:q(),upTo:r(n+a*(l+1)/3),colorHex:o}))}function Xl(e){let t=pt(e).at(-1),n=e.bands.length>1?Math.abs(pt(e)[1].upTo-pt(e)[0].upTo):10;return{id:q(),upTo:(t?.upTo??0)+(n||10),colorHex:e.colorSlot.baseColorHex}}var Zl=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function Ql(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""};case"chartStat":return{kind:t,layer:"",stat:"latest"}}}function ee(e,t,n,i){if(i.inline||!ed())return u`<div class="value-editor">${Eo(e,t,n,i)}</div>`;let a=Ui(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,l=de(t,re(e));return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?g:u`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text">${l}</span>
      ${o===void 0?g:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Co(e,a,r,t,n,i)}
  </div>`}function Co(e,t,n,i,a,r){return u`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${So}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${Ut.has(t)?Eo(e,i,a,r):g}
  </div>`}function re(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Ui(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function ed(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Ut=new Set,Gt=new WeakMap;function td(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function nd(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(t)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function So(e){let t=e.currentTarget,n=e.newState==="open",i=Gt.get(t);if(i&&(i(),Gt.delete(t)),!n){Ut.delete(t.id)&&Te(t);return}let a=td(t);if(!a)return;let r=()=>{if(!t.isConnected||!t.matches(":popover-open")){Gt.get(t)?.(),Gt.delete(t);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}Di(t,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),Gt.set(t,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Di(t,a.getBoundingClientRect()),Ut.has(t.id)||(Ut.add(t.id),Te(t),requestAnimationFrame(()=>{t.isConnected&&Di(t,a.getBoundingClientRect())}))}function Di(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=id({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var nt=8,En=6,so=140;function id(e,t,n){let i=n.height-e.bottom-En-nt,a=e.top-En-nt,r=t.height>i&&a>i&&i<so,o=Math.max(so,r?a:i),l=Math.min(t.height,o),s=Math.max(nt,Math.min(e.left,n.width-t.width-nt)),d=r?Math.max(nt,e.top-En-l):Math.max(nt,Math.min(e.bottom+En,n.height-l-nt));return{left:s,top:d,maxHeight:o,above:r}}function Eo(e,t,n,i){let a=t.kind,r=p=>n({...t,kind:p}),o=i.key,l=Ul.filter(([p])=>i.allowNamed!==!1||p!=="named"),s=g;switch(a.kind){case"literal":s=i.symbol?$o(e,a.value,p=>r({...a,value:p}),o):ne("Text",a.value,p=>r({...a,value:p}));break;case"entityState":case"entityAge":s=Be(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`);break;case"entityAttribute":{let p=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),c=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=u`${Be(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ne("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:c,mono:!0})}
        <datalist id=${c}>${p.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=rd(e,a.aggregate,p=>r({...a,aggregate:p}),o);break;case"time":s=B("Field",a.timeField,Zl,p=>r({...a,timeField:p}));break;case"dataAge":s=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=u`${Ml("Template",a.value,p=>r({...a,value:p}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:B("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}));break;case"chartStat":{let p=re(e),c=e.config.elements.filter(h=>h.kind==="chart");s=c.length===0?u`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:u`
          ${B("Chart",a.layer,[["","(choose)"],...c.map(h=>[h.payload.id,$e(h,p)])],h=>r({...a,layer:h}))}
          ${B("Number",a.stat,[...ct],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(t):void 0;return u`
    ${B("Source",a.kind,l,p=>r(Ql(a,p)))}
    ${s}
    ${i.noFormat?g:ad(t.format,p=>n(Se(p)?{kind:t.kind}:{...t,format:p}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:g}`}function ad(e,t){let n=e??{},i=a=>{let r={...n,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];t(r)};return u`<details class="sub" ?open=${!Se(e)}>
    <summary>Format${Se(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${j("Decimals",n.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${j("Multiply",n.multiply,a=>i({multiply:a}),{optional:!0})}
      ${j("Offset",n.offset,a=>i({offset:a}),{optional:!0})}
      ${B("Case",n.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ne("Prefix",n.prefix??"",a=>i({prefix:a}))}
      ${ne("Suffix",n.suffix??"",a=>i({suffix:a}))}
    </div>
    ${me("Append the entity's unit",!!n.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${me("Show as relative time (45s, 2m, 3h)",!!n.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function rd(e,t,n,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=t.scope;return u`
    ${B("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>n({...t,function:l}))}
    ${B("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>n({...t,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${ne("Domains",a(o.domains),l=>n({...t,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${ne("Area ids",a(o.areaIds),l=>n({...t,scope:{...o,areaIds:r(l)}}))}
          ${ne("Label ids",a(o.labelIds),l=>n({...t,scope:{...o,labelIds:r(l)}}))}
          ${ne("Floor ids",a(o.floorIds),l=>n({...t,scope:{...o,floorIds:r(l)}}))}
        </div>`:u`${o.entities.map((l,s)=>u`<div class="row-inline">
            ${Be(e,`Entity ${s+1}`,l,d=>{let p=[...o.entities];p[s]=d,n({...t,scope:{...o,entities:p}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,p)=>p!==s)}})}>${P("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${B("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...t};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:s.stateFilter={kind:l},n(s)})}
    ${t.stateFilter&&"value"in t.stateFilter?ne("State",t.stateFilter.value,l=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:l}})):g}
    ${t.function==="count"?g:ne("Attribute (blank = state)",t.attribute??"",l=>{let s={...t};l?s.attribute=l:delete s.attribute,n(s)})}`}var To=ni,od=To.filter(([e])=>e!=="none");function sd(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function Fo(e){let t=e.config,n=t.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=sd(e.savedName,t.name),r=t.refreshMinutes??0,o=lo.map(s=>[String(s),co(s)]);lo.includes(r)||o.push([String(r),co(r)]);let l=t.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${ne("Name",t.name,s=>e.update(d=>{d.name=s},"name"))}
      ${B("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${B("Tap action",n.type,To,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??ld).slice(0,7)}
                @input=${le(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:g}
    ${"entityId"in n?Be(e,"Target",n,s=>e.update(d=>{d.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):g}
    ${n.type==="openPage"?dd(e):g}`}var ld="#808080",lo=[0,15,30,60,120];function co(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function dd(e){let t=e.config;return Ro(e,t.openPageId,t.openPageName,(n,i)=>e.update(a=>{if(n===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=n,i?a.openPageName=i:delete a.openPageName}))}function Ro(e,t,n,i){let a=t??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${n||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${B("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?g:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function Io(e,t){let n=e.config.values.findIndex(a=>a.id===t.id),i=`nv-${t.id}`;return u`
    ${ne("Name",t.name,a=>e.update(r=>{r.values[n].name=a},`${i}-name`))}
    ${ee(e,t.value,a=>e.update(r=>{r.values[n].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${po(e.config,t.id)} layer${po(e.config,t.id)===1?"":"s"}.</div>`}function po(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function Ao(){return{id:q(),name:"Value",value:I("")}}function ge(e,t,n){let i=e.perFamily[t],a=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function fe(e,t,n,i,a=!1){let r=e.elements.find(p=>p.payload.id===n);if(!r)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let l=ge(e,t,r),d={...o.placements[n]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let p of e.elements)p.payload.id!==n&&(o.placements[p.payload.id]={frame:{...p.payload.frame},isHidden:p.payload.isHidden});o.placements[n]=d}function cd(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function uo(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function pd(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function Mo(e,t,n){let i=uo(n.map(d=>ge(e,t,d).isHidden)),a=uo(n.map(d=>d.payload.isHidden)),r=n.map(pd),o=n.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var Ki=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function ud(e,t,n){let i=t.payload.id,a=cn(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"?{domain:"camera"}:{};return u`
    ${Be(e,t.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>rr(s,i,l),`${n}-entity`),`${n}-layer-entity`,o)}
    <div class="hint">${fd(t,a)}</div>`}function hd(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function md(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function fd(e,t){let n=hd(e),i=n?.kind.kind,r=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let s=t.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${md(o)}.${r}`}function gd(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function yd(e,t){let n=e.timestamp===!0,i=Ie(e),a=r=>t(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ie(o)&&(o.timestampCorner=ei(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${me("Show timestamp",n,r=>t(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${n?u`
      ${B("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?g:B("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>t(o=>{o.timestampCorner=r}))}
      ${j("Text size (pt)",e.timestampSize,r=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,r??Ht))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:g}`}function se(e,t,n,i,a={}){let r=e.openSections.has(t),o=()=>e.toggleSection(t);return u`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${P(a.icon??"content")}</span>
      <span class="tt"><h4>${n}</h4>${a.summary?u`<span class="sum">${a.summary}</span>`:g}</span>
      <span class="chev">${P("chevron")}</span>
    </div>
    ${r?u`<div class="sec-b">${i}</div>`:g}
  </section>`}function bd(e){if(e.length===0)return"nothing";let t=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100);return e.length<=12?e.map(t).join(" "):`${e.slice(0,6).map(t).join(" ")} \u2026 ${e.slice(-3).map(t).join(" ")}`}function vd(e){return Jn.find(t=>t.minutes===e)?.label??`Last ${e} min`}function xd(e,t){let n=re(e);switch(t.kind){case"text":return it(de(t.payload.value,n),48);case"icon":return it(de(t.payload.symbol,n),48);case"gauge":return it(de(t.payload.value,n),48);case"chart":return it(`${de(t.payload.value,n)}${t.payload.historyMinutes>0?` \xB7 ${vd(t.payload.historyMinutes)}`:""}`,48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||"No camera yet";case"tap":return Ae(t.payload.action)}}function ho(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${ko.find(([t])=>t===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${we(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function Ho(e,t,n){let i=t.payload.id,a=e.config.elements.findIndex(m=>m.payload.id===i),r=`el-${i}`,o=(m,b)=>e.update(v=>m(v.elements[a]),b?`${r}-${b}`:void 0),l=ge(e.config,n,t),s=l.frame,d=(m,b)=>e.update(v=>fe(v,n,i,{frame:{...s,...m}}),`${r}-${b}-${n}`),p=t.kind==="text"?"Font size":t.kind==="icon"?"Icon size":"Line width",c,h;switch(t.kind){case"text":{let m=ii(e.config,t.payload.value);c=u`
        ${ee(e,t.payload.value,b=>o(v=>{v.payload.value=b},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${m?u`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(m.payload.id)}>${$e(m,re(e))}</button>. It stays in the chart's group and moves with it.</div>`:g}
        ${me("Live countdown",t.payload.countdown===!0,b=>o(v=>{let C=v.payload;b?C.countdown=!0:delete C.countdown}))}
        ${t.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:g}`,h=u`<div class="grid2">
          ${j("Font size (pt)",t.payload.fontSize,b=>o(v=>{v.payload.fontSize=b??14},"size"),{step:1,min:4})}
          ${B("Weight",t.payload.fontWeight,Ki,b=>o(v=>{v.payload.fontWeight=b}))}
        </div>`;break}case"icon":c=u`
        ${ee(e,t.payload.symbol,m=>o(b=>{b.payload.symbol=m},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=j("Icon size (pt)",t.payload.size,m=>o(b=>{b.payload.size=m??14},"size"),{step:1,min:4});break;case"gauge":c=u`
        ${ee(e,t.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${j("Min",t.payload.minValue,m=>o(b=>{b.payload.minValue=m??0},"min"))}
          ${j("Max",t.payload.maxValue,m=>o(b=>{b.payload.maxValue=m??100},"max"))}
        </div>`,h=u`
        <div class="grid2">
          ${B("Style",t.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],m=>o(b=>{b.payload.style=m}))}
          ${j("Line width (pt)",t.payload.lineWidth,m=>o(b=>{b.payload.lineWidth=m??4},"lw"),{step:.5,min:.5})}
        </div>
        ${ae("Track colour",t.payload.trackColorHex,m=>o(b=>{b.payload.trackColorHex=m??"#FFFFFF40"},"track"))}`;break;case"chart":{let m=t.payload,b=(R,F)=>o(z=>R(z.payload),F),v=Ze(m),C=m.historyMinutes>0,H=m.value.kind.kind==="entityState",V=v===void 0?void 0:e.historySeries(v),S=C?V??"":e.resolve(m.value)??"",A=Nt(S),N=m.limit>0&&A.length>m.limit?m.takeFromEnd?A.slice(A.length-m.limit):A.slice(0,m.limit):A,W=!C&&H&&A.length===1;c=u`
        ${ee(e,m.value,R=>b(F=>{F.value=R},"value"),{label:"Readings",key:`${r}-value`})}
        ${B("Draw",C?"history":"value",[["value","The value itself"],["history","Its recorded history"]],R=>b(F=>{F.historyMinutes=R==="history"?F.historyMinutes||360:0}))}
        ${C?u`
            ${H?g:u`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              stays empty until Readings names an entity.</div>`}
            <div class="grid2">
              ${B("Span",String(m.historyMinutes),Jn.map(({minutes:R,label:F})=>[String(R),F]),R=>b(F=>{F.historyMinutes=Number(R)||360}))}
              ${j("Readings",m.historyPoints,R=>b(F=>{F.historyPoints=Math.round(R??24)},"hpoints"),{step:1,min:Xn,max:Zn})}
            </div>
            <div class="hint">Home Assistant averages the recorded states into this many equal
              time slots, oldest first. About 20 readings suits a rectangular complication; more
              than that draws bars thinner than the screen can show.</div>
            ${H&&V===void 0?u`<div class="hint">Reading the history…</div>`:g}
            ${H&&V===""?u`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:g}`:u`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${A.length===0&&!(C&&(!H||V===void 0||V===""))?u`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:g}
        ${A.length>0?u`<div class="hint">Reads ${bd(N)}${A.length===N.length?u` · ${N.length} ${N.length===1?"value":"values"}`:u` · ${N.length} of ${A.length}`}</div>`:g}
        ${W?u`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Its recorded history</b> to plot how it has moved.</div>`:g}
        <div class="grid2">
          ${j("Use",m.limit,R=>b(F=>{F.limit=Math.max(0,Math.round(R??0))},"limit"),{step:1,min:0})}
          ${B("From",m.takeFromEnd?"end":"start",[["start","The first readings"],["end","The last readings"]],R=>b(F=>{F.takeFromEnd=R==="end"}))}
        </div>
        <div class="hint">${C?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,h=u`
        ${B("Style",m.style,Kl,R=>b(F=>{F.style=R}))}
        <div class="grid2">
          ${B("Scale",m.scale,Wl,R=>b(F=>{F.scale=R}))}
          ${B("Baseline",m.baseline,jl,R=>b(F=>{F.baseline=R}))}
        </div>
        ${m.scale==="fixed"?u`<div class="grid2">
              ${j("Min",m.minValue,R=>b(F=>{F.minValue=R??0},"cmin"))}
              ${j("Max",m.maxValue,R=>b(F=>{F.maxValue=R??100},"cmax"))}
            </div>`:g}
        <div class="hint">${m.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${m.style==="bars"?j("Bar gap (pt)",m.barGap,R=>b(F=>{F.barGap=Math.max(0,R??0)},"gap"),{step:.5,min:0}):j("Line width (pt)",m.lineWidth,R=>b(F=>{F.lineWidth=Math.max(.5,R??2)},"lw"),{step:.5,min:.5})}
        ${B("Colour",m.coloring,Yl,R=>b(F=>{F.coloring=R,R==="bands"&&F.bands.length===0&&(F.bands=Jl(N))}))}
        ${m.coloring==="bands"?u`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${m.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${m.bands.map((R,F)=>u`
            <div class="row-inline">
              ${j("Up to",R.upTo,z=>b(J=>{let Z=J.bands[F];Z&&(Z.upTo=z??0)},`bup${R.id}`))}
              ${ae("Colour",R.colorHex,z=>b(J=>{let Z=J.bands[F];Z&&(Z.colorHex=z??"#FFFFFF")},`bcol${R.id}`))}
              <button class="icon" title="Remove this band" aria-label="Remove this band"
                @click=${()=>b(z=>{z.bands=z.bands.filter((J,Z)=>Z!==F)})}>${P("close")}</button>
            </div>`)}
          <button class="small" @click=${()=>b(R=>{R.bands=[...R.bands,Xl(R)]})}>Add band</button>
          ${ae("And the rest",m.bandAboveColorHex,R=>b(F=>{F.bandAboveColorHex=R??rn},"babove"))}
          ${m.style==="area"?u`${me("Fill follows the bands",m.fillBands,R=>b(F=>{F.fillBands=R}))}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:g}`:g}
        ${B("Highlight",m.highlight,ko,R=>b(F=>{F.highlight=R}))}
        ${m.highlight==="none"?g:u`
          <div class="grid2">
            ${m.highlight==="lowest"?g:ae("Highest colour",m.highColorHex,R=>b(F=>{F.highColorHex=R??nn},"hicol"))}
            ${m.highlight==="highest"?g:ae("Lowest colour",m.lowColorHex,R=>b(F=>{F.lowColorHex=R??an},"locol"))}
          </div>
          ${B("Marker",m.marker,ql,R=>b(F=>{F.marker=R}))}
          <div class="hint">Worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":c=u`<div class="grid2">
          ${B("Shape",t.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],m=>o(b=>{b.payload.kind=m}))}
          ${t.payload.kind==="roundedRectangle"?j("Corner radius (pt)",t.payload.cornerRadius,m=>o(b=>{b.payload.cornerRadius=m??6},"radius"),{step:.5,min:0}):g}
        </div>`,h=u`
        ${ae("Border colour",t.payload.borderColorHex,m=>o(b=>{m===void 0?delete b.payload.borderColorHex:b.payload.borderColorHex=m},"border"),!0)}
        ${t.payload.borderColorHex!==void 0?j("Border width (pt)",t.payload.borderWidth,m=>o(b=>{b.payload.borderWidth=m??1},"bw"),{step:.5,min:0}):g}`;break;case"image":{let m=t.payload,b=(v,C)=>o(H=>v(H.payload),C);c=u`
        ${m.entity.entityId&&!m.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:g}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=u`
        ${B("Picture",m.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],v=>b(C=>{C.contentMode=v}))}
        ${Oi("Zoom",m.zoom,v=>b(C=>{C.zoom=v},"zoom"),{min:Fi,max:4,step:.05,def:1,format:v=>`${v.toFixed(2)}x`})}
        ${Oi("Pan left/right",m.panX,v=>b(C=>{C.panX=v},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Oi("Pan up/down",m.panY,v=>b(C=>{C.panY=v},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${gd(m)}</div>
        ${j("Corner radius (pt)",m.cornerRadius,v=>b(C=>{C.cornerRadius=Math.max(0,v??Mt)},"imgradius"),{step:1,min:0})}`;break}case"tap":{c=u`
        ${Lo(e,t.payload,(m,b)=>o(v=>m(v.payload),b),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let f=t.kind==="image"||t.kind==="tap"?void 0:ae(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,m=>o(b=>{b.kind!=="image"&&b.kind!=="tap"&&(b.payload.colorSlot.baseColorHex=m??"#FFFFFF")},"color")),y=di(e.config,t),w=y?{kind:{kind:"entityState",...y}}:void 0,x=te[t.kind],E=t.kind==="tap"?void 0:be(e.config,i)[0],$=t.kind==="image"?t.payload.timestamp===!0:!1;return u`
    ${se(e,"content","Content",u`${t.kind==="tap"?g:ud(e,t,r)}${c}`,{color:x,icon:"content",summary:xd(e,t)})}
    ${h===void 0&&f===void 0?g:se(e,"look",t.kind==="image"?"Picture":"Look",u`${h??g}${f??g}`,{color:x,icon:t.kind==="image"?"image":"look",...ho(t)?{summary:ho(t)}:{}})}
    ${t.kind==="chart"?se(e,"numbers","Numbers",Cd(e,t),{color:te.text,icon:"text",summary:kd(e,t)}):g}
    ${t.kind==="image"?se(e,"timestamp","Timestamp",yd(t.payload,(m,b)=>o(v=>m(v.payload),b)),{color:x,icon:"clock",summary:$?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden"}):g}
    ${t.kind==="tap"?g:se(e,"tappable","Tap",Sd(e,t,r),{color:Y.tap,icon:"tap",summary:E?Ae(E.payload.action):"Not tappable"})}
    ${se(e,"states","States",Vo(e,t.payload.rules,t.kind,m=>m.elements.find(b=>b.payload.id===i)?.payload.rules,`rules-${i}`,w),{color:Y.states,icon:"states",summary:Bt(t.payload.rules).replace(/\.$/,"")})}
    ${se(e,"placement","Place",u`
      <div class="grid4">
        ${j("X",s.x,m=>d({x:m??0},"x"),{step:.01})}
        ${j("Y",s.y,m=>d({y:m??0},"y"),{step:.01})}
        ${j("W",s.width,m=>d({width:m??.5},"w"),{step:.01,min:0})}
        ${j("H",s.height,m=>d({height:m??.5},"h"),{step:.01,min:0})}
      </div>
      ${j("Rotation (degrees)",s.rotationDegrees,m=>d({rotationDegrees:m??0},"rot"),{step:1})}
      ${t.kind==="shape"||t.kind==="image"||t.kind==="tap"?g:j(`${p} in ${K(n)} (blank = shared ${cd(t)})`,l.size,m=>e.update(b=>m===void 0?fe(b,n,i,{},!0):fe(b,n,i,{size:m}),`${r}-psize-${n}`),{step:1,min:1,optional:!0})}
      ${me(`Hidden in ${K(n)}`,l.isHidden,m=>e.update(b=>fe(b,n,i,{isHidden:m})))}
      ${me("Hidden in every shape",t.payload.isHidden,m=>o(b=>{b.payload.isHidden=m}))}
      <div class="hint">Drag the layer on the ${K(n)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:Y.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${K(n)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function Lo(e,t,n,i){let a=t.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${B("Tap action",a.type,od,o=>n(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?Be(e,"Target",a,o=>n(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):g}
    ${a.type==="openPage"?Ro(e,t.openPageId,t.openPageName,(o,l)=>n(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):g}`}var wd=24;function $d(e,t){let n=[],i=1/0;for(let r of X){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=ir(e.config,t,r);o&&(n.push(`${K(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return g;let a=i<wd;return u`<div class=${a?"hint warn":"hint"}>${n.join(" \xB7 ")}${a?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:g}</div>`}function kd(e,t){let n=Lt(e.config,t.payload.id);return n.length===0?"None yet":n.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(ct.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function Cd(e,t){let n=re(e),i=Lt(e.config,t.payload.id),a=o=>{let l;e.update(s=>{l=Ja(s,t.payload.id,o)}),l&&e.selectLayer(l)},r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return u`
    ${i.length===0?u`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:u`
        <div class="chart-numbers">
          ${i.map(o=>u`
            <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
              <b>${e.resolve(o.payload.value)??"--"}</b> · ${$e(o,n)}
            </button>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${ct.map(([o,l])=>u`
        <button class="small" title=${r.has(o)?`Add another ${l.toLowerCase()}`:`Add the ${l.toLowerCase()}`}
          @click=${()=>a(o)}>${P("plus")}<span>${l}</span></button>`)}
    </div>
    <div class="hint">The newest reading starts with the entity's unit after it. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function Sd(e,t,n){if(t.kind==="tap")return g;let i=t.payload.id,a=be(e.config,i)[0],r=(l,s)=>e.update(d=>{let p=d.elements.find(c=>c.kind==="tap"&&c.payload.attachedTo===i);p&&l(p.payload)},s?`${n}-${s}`:void 0),o=ci(e.config,t);return u`
    ${me("Tappable",a!==void 0,l=>e.update(s=>{l?ln(s,i):ui(s,i)}))}
    ${a?u`<div class="value-editor">
          ${Lo(e,a.payload,r,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${on(a.payload.outset)?g:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...ti}})}>${P("reset")}</button>`}
          </div>
        </div>
        ${$d(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Ae(o)}</b>.</div>`}`}function mo(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function $e(e,t){switch(e.kind){case"text":return mo(de(e.payload.value,t));case"icon":return mo(de(e.payload.symbol,t));case"gauge":return de(e.payload.value,t);case"chart":return de(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||"camera"}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function _o(e,t){let n=He(e.config,t.id),i=re(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===t.id);s&&r(s)},o?`group-${t.id}-${o}`:void 0);return se(e,"content","Group",u`
    ${ne("Name",t.name,r=>a(o=>{o.name=r},"name"))}
    ${me("Move as one on the watch",t.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(r=>$e(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>_t(r,t.id))}>Ungroup</button>
    </div>`,{color:Y.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function zo(e,t){if(t==="inline")return u`${Ed(e)}${Vi(e,t)}`;let n=e.config.perFamily[t];if(!n)return u`<div class="hint">No settings stored for ${K(t)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${K(t)} settings</button>
      ${Vi(e,t)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[t]),s?`fam-${t}-${s}`:void 0),a=Object.keys(n.placements).length,r=n.backgroundColorHex?we(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${we(n.borderColorHex)} border`:"no border";return u`
    ${se(e,"look",`${K(t)} shape`,u`
      ${ae("Background (blank = transparent)",n.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${ae("Border colour",n.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${j("Border width (pt)",n.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:Y.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${t==="corner"?se(e,"corner","Corner content",Td(e,n,i),{color:Y.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas"}):g}
    ${se(e,"states","Shape states",Vo(e,n.rules,"layout",l=>l.perFamily[t]?.rules,`rules-${t}`),{color:Y.states,icon:"states",summary:Bt(n.rules).replace(/\.$/,"")})}
    ${se(e,"placements","Placements",u`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${K(t)} placement.`}</div>
      ${a>0?u`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:g}`,{color:Y.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${Vi(e,t)}`}function Vi(e,t){let n=!gt(e.config,t),i=n?"A complication keeps at least one shape.":`Drop the ${K(t)} shape. The watch stops listing this complication for ${K(t)} slots.`;return se(e,"shape","Remove this shape",u`
    <div class="adders">
      <button class="danger small" ?disabled=${n} title=${i} @click=${()=>e.removeFamily(t)}>Remove the ${K(t)} shape</button>
    </div>
    ${n?u`<div class="hint">This is the only shape. Add another before removing it.</div>`:u`<div class="hint">The watch stops listing this complication for ${K(t)} slots.</div>`}`,{color:Y.place,icon:"delete",summary:n?"The only shape":"Drops its layout"})}function Ed(e){let t=e.config.inline;if(!t)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=re(e);return u`
    ${se(e,"content","Inline text",u`
      ${ne("Label (blank = value only)",t.label??"",a=>n(r=>{a?r.label=a:delete r.label},"label"))}
      ${ee(e,t.value,a=>n(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${me("Live countdown",t.countdown===!0,a=>n(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${t.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:g}`,{color:te.text,icon:"text",summary:it(`${t.label?`${t.label}: `:""}${de(t.value,i)}`,48)})}
    ${se(e,"symbol","Symbol",u`
      ${$o(e,t.symbol??"",a=>n(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:te.icon,icon:"icon",summary:t.symbol||"None"})}`}function Td(e,t,n){let i=t.curvedText?"curved":"canvas",a=t.bezelGauge?"gauge":t.bezelText?"text":"none";return u`
    ${B("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>n(o=>{r==="curved"?o.curvedText||(o.curvedText=I("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?u`
      ${ee(e,t.curvedText,r=>n(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${ae("Curved text colour",t.curvedColorHex??"#FFFFFF",r=>n(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:g}
    ${B("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>n(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=I("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:I("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&t.bezelText?u`
      ${ee(e,t.bezelText,r=>n(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${me("Live countdown",t.bezelCountdown===!0,r=>n(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:g}
    ${a==="gauge"&&t.bezelGauge?Fd(e,t.bezelGauge,n):g}`}function Fd(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],a=r=>o=>n(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return u`
    ${ee(e,t.value,r=>n(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${j("Gauge min",t.minValue,r=>n(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${j("Gauge max",t.maxValue,r=>n(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${ae("Arc colour (min end)",i[0],a(0))}
    ${ae("Arc colour (middle)",i[1],a(1))}
    ${ae("Arc colour (max end)",i[2],a(2))}
    ${me("End number labels",!!(t.minLabel||t.maxLabel),r=>n(o=>{let l=o.bezelGauge;r?(l.minLabel=I(String(l.minValue)),l.maxLabel=I(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${t.minLabel?ee(e,t.minLabel,r=>n(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):g}
    ${t.maxLabel?ee(e,t.maxLabel,r=>n(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):g}`}var au=X.map(e=>[e,K(e)]),Wi={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Rd=Object.keys(Wi);function Id(e){let t=pn[e];return Rd.filter(n=>t.includes(he[n]))}var Ad={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function Tn(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function it(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function Md(e){if(!e||Se(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function de(e,t){return`${Po(e,t)}${Md(e.format)}`}function Po(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${it(n.value,40)}"`:"(empty)";case"entityState":return Tn(n,t);case"entityAttribute":return n.attribute?`${Tn(n,t)} \xB7 ${n.attribute}`:Tn(n,t);case"entityAge":return`age of ${Tn(n,t)}`;case"aggregate":return Hd(n.aggregate);case"time":return Ad[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${it(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(a=>a.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`;case"chartStat":{let i=(ct.find(([o])=>o===n.stat)?.[1]??n.stat).toLowerCase();if(n.layer==="")return`${i} (no chart chosen)`;let a=t?.elements?.find(o=>o.kind==="chart"&&o.payload.id===n.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Po(a.payload.value,t):"a missing chart";return`${i} of ${r}`}}}function Hd(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function In(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function Ld(e,t,n,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return u`
    ${t.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:g}
    ${t.map((o,l)=>_d(e,o,l,t.length,n,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Pt())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function _d(e,t,n,i,a,r,o){let l=e.liveBranch(t),s=e.forced.get(t.id)??"live",d=c=>s==="live"?c==="live":s==="otherwise"?c==="otherwise":s.caseId===c,p=(c,h)=>r(f=>{let y=f.find(w=>w.id===t.id);y&&c(y)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(c=>In(c,n,n-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>r(c=>In(c,n,n+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(c=>{let h=c.findIndex(f=>f.id===t.id);h>=0&&c.splice(h,1)})}>${P("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((c,h)=>u`<button class="${d(c.id)?"active":""} ${l===c.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:c.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?u`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:g}
    </div>
    ${t.cases.map((c,h)=>zd(e,c,h,t,a,p,`${o}-${c.id}`))}
    <div class="adders"><button class="small" @click=${()=>p(c=>{c.cases.push(gi())})}>+ case</button></div>
    ${me("Otherwise (when no case matches)",t.otherwise!==void 0,c=>p(h=>{c?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?u`<b>Active now.</b> `:g}Changes when no case matches:</div>
          ${No(e,t.otherwise,a,c=>p(h=>{h.otherwise&&c(h.otherwise)}),`${o}-otherwise`)}
        </div>`:g}
  </div>`}function zd(e,t,n,i,a,r,o){let l=(d,p)=>r(c=>{let h=c.cases.find(f=>f.id===t.id);h&&d(h)},p),s=e.liveBranch(i)===t.id;return u`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${s?u` <span class="ok">· active now</span>`:g}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(d=>In(d.cases,n,n-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>r(d=>In(d.cases,n,n+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let p=d.cases.findIndex(c=>c.id===t.id);p>=0&&d.cases.splice(p,1)})}>${P("delete")}</button>
    </div>
    <div class="row-inline">
      ${B("When",t.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(p=>{p.when.join=d}))}
    </div>
    ${t.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:g}
    ${t.when.tests.map((d,p)=>Pd(e,d,p,c=>l(h=>{let f=h.when.tests.find(y=>y.id===d.id);f&&c(f)}),()=>l(c=>{c.when.tests=c.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(fi())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${No(e,t.then,a,d=>l(p=>d(p.then)),`${o}-then`)}
  </div>`}function Pd(e,t,n,i,a,r){let o=(c,h)=>i(c,h?`${r}-${h}`:void 0),l=t.comparison,s=Qe(l.kind),d=e.evaluateTest(t),p=g;switch(s){case"value":p=ee(e,l.value??I(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":p=u`${ee(e,l.value??I(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${ee(e,l.upper??I(""),c=>o(h=>{h.comparison.upper=c},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":p=u`${ne("Pattern",l.pattern??"",c=>o(h=>{h.comparison.pattern=c},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!Nd(l.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:g}`;break;case"options":p=ne("Options (comma separated)",(l.options??[]).join(", "),c=>o(h=>{h.comparison.options=c.split(",").map(f=>f.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${P("delete")}</button>
    </div>
    ${l.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:ee(e,t.value,c=>o(h=>{h.value=c},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${B("Comparison",l.kind,or.map(c=>[c,bt[c]]),c=>o(h=>{h.comparison=yi(h.comparison,c)}))}
    ${p}
  </div>`}function Nd(e){try{return new RegExp(e),!0}catch{return!1}}function No(e,t,n,i,a){let r=Id(n);return u`
    ${t.length===0?u`<div class="hint">No changes.</div>`:g}
    ${t.map((o,l)=>Od(e,o,l,n,(s,d)=>i(p=>{p[l]&&s(p[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(et(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>u`<option value=${o}>${Wi[o]}</option>`)}
    </select>`}var Oo=["setColor","setBorderColor","setBackgroundColor"];function Od(e,t,n,i,a,r,o){let l=!pn[i].includes(he[t.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${Wi[t.kind]}${l?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:g}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${P("delete")}</button>
    </div>
    ${Do(e,t,a,o)}
  </div>`}function Do(e,t,n,i){let a=un(t.kind),r=g;if(a==="value"){let o=t.value??I("");if(Oo.includes(t.kind)){let l=o.kind.kind==="literal";r=u`${l?ae("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>n(d=>{d.value=I(s??"#FFFFFF")},"color")):ee(e,o,s=>n(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:I("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?g:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=ee(e,o,l=>n(s=>{s.value=l},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};r=j(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,l=>n(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=B("Weight",t.weight??"regular",Ki,o=>n(l=>{l.weight=o})));return r}var Bi=new Set,Fn=new Map,Rn=new Map,fo=new Map;function Vo(e,t,n,i,a,r){let o=_i(t);return!o.ok||Bi.has(a)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{Bi.delete(a),Te(s.target)}}>Show as table</button>
        ${o.ok?g:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${Ld(e,t,n,i,a)}`:Dd(e,o.table,t[0],n,i,a,r)}function Dd(e,t,n,i,a,r,o){let l=(S,A)=>e.update(N=>{let W=a(N);W&&S(W)},A?`${r}-${A}`:void 0),s=t.value??fo.get(r)??o,d=t.rows.length===0,p=t.numberMode||d&&s!==void 0&&!Qr(s)&&Vd(e.resolve(s)),c=pn[i],h=Fn.get(r)??new Set,f=t.columns.length===0&&h.size===0?[Zr[i]]:[],y=Gr(t.columns,[...h,...f.filter(S=>S!==void 0)],c),w=n?e.liveBranch(n):"none",x=n?e.forced.get(n.id)??"live":"live",E=S=>x!=="live"&&(x==="otherwise"?S==="otherwise":x.caseId===S),$=S=>{n&&e.setForced(n.id,E(S)?"live":S==="otherwise"?"otherwise":{caseId:S})},m=S=>{fo.set(r,S),t.rows.length!==0&&l(A=>Yr(A,S),"lhs")},b=()=>l(S=>jr(S,s??I(""),p)),v=t.rows.map((S,A)=>yo(e,{key:`${r}-${S.caseId}`,label:Xr(S.comparison,N=>de(N,re(e))),columns:y,changes:S.changes,live:w===S.caseId,forced:E(S.caseId),onForce:()=>$(S.caseId),when:Wd(e,S.comparison,`${r}-${S.caseId}`,(N,W)=>l(R=>{let F=R[0]?.cases.find(z=>z.id===S.caseId)?.when.tests[0];F&&N(F.comparison)},W&&`${S.caseId}-${W}`)),updChanges:(N,W)=>l(R=>{let F=R[0]?.cases.find(z=>z.id===S.caseId);F&&N(F.then)},W&&`${S.caseId}-${W}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${A===0} @click=${()=>l(N=>zi(N,A,A-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${A===t.rows.length-1} @click=${()=>l(N=>zi(N,A,A+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(N=>qr(N,S.caseId))}>${P("delete")}</button>`})),C=t.otherwise===void 0?g:yo(e,{key:`${r}-otherwise`,label:"Otherwise",columns:y,changes:t.otherwise,live:w==="otherwise",forced:E("otherwise"),onForce:()=>$("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(S,A)=>l(N=>{let W=N[0]?.otherwise;W&&S(W)},A),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(S=>Pi(S,!1))}>${P("close")}</button>`}),H=Rn.get(r),V=Bd.filter(S=>c.includes(S)&&!y.includes(S));return u`
    <div class="states">
      ${ee(e,s??I(""),m,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?u`<div class="hint">Choose what these states look at.</div>`:g}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${y.map(S=>u`<th>
              <span>${Pe[S]}</span>
              <button class="icon" title=${`Remove the ${Pe[S]} column`}
                @click=${A=>{Rn.set(r,S),Te(A.target)}}>${P("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${v}
          ${C}
          ${t.rows.length===0&&t.otherwise===void 0?u`<tr><td class="empty-row" colspan=${y.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:g}
        </tbody>
      </table>
      ${H===void 0?g:u`<div class="hint warn confirm-row">
        Remove the ${Pe[H]} column? Its ${go(t,H)} value${go(t,H)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${S=>{Rn.delete(r),Fn.get(r)?.delete(H),Te(S.target),l(A=>Jr(A,H))}}>Remove</button>
        <button class="small" @click=${S=>{Rn.delete(r),Te(S.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${b}>+ state</button>
        ${t.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(S=>Pi(S,!0))}>+ otherwise</button>`:g}
        <span class="spacer"></span>
        ${x==="live"?g:u`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${V.length===0?g:u`<select class="chip-add" title="Add a column" @change=${S=>{let A=S.target,N=A.value;if(A.value="",!N)return;let W=Fn.get(r)??new Set;W.add(N),Fn.set(r,W),Te(A)}}>
          <option value="" selected>+ column…</option>
          ${V.map(S=>u`<option value=${S}>${Pe[S]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${p?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${S=>{Bi.add(r),Te(S.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Vd(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var Bd=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function go(e,t){let n=0;for(let i of e.rows)kn(i.changes,t)&&(n+=1);return e.otherwise&&kn(e.otherwise,t)&&(n+=1),n}function Gd(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function yo(e,t){return u`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{Gd(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>u`<td>${Ud(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function Ud(e,t,n,i,a){let r=kn(n,t),o=Ui(a);if(!r)return u`<button type="button" class="cell empty" title=${`Set ${Pe[t]} for this state`}
      @click=${d=>{i(p=>{p.push(et(Br[t]))}),nd(d.target,o)}}>unchanged</button>`;let l=(d,p)=>i(c=>{let h=c.find(f=>he[f.kind]===t);h&&d(h)},p&&`${t}-${p}`),s=Pe[t];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${Kd(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${So}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Ut.has(o)?u`${t==="visibility"?B("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(p=>{p.kind=d})):Do(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(p=>{let c=p.findIndex(h=>he[h.kind]===t);c>=0&&p.splice(c,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:g}
    </div>`}function Kd(e,t){if(t.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return u`<span class="cell-word">Shown</span>`;let n=un(t.kind);if(n==="number")return u`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return u`<span class="cell-word">${Ki.find(([r])=>r===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??I(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Oo.includes(t.kind))return u`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?we(a):de(i,re(e))}</span>`;if(t.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return u`${r??g}<span class="cell-word">${a}</span>`}return u`<span class="cell-word">${de(i,re(e))}</span>`}function we(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Wd(e,t,n,i){let a=Qe(t.kind),r=Li(t.kind),o=(l,s,d,p)=>qd(e,l,s,`${n}-${d}`,r,p,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${le(l=>i(s=>{let d=yi(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${Hi.map(l=>u`<option value=${l} ?selected=${l===t.kind}>${jd(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(t.value??I(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):g}
    ${a==="between"?u`<span class="when-and">to</span>${o(t.upper??I(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:g}
  </span>`}function jd(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return bt[e]}}function qd(e,t,n,i,a,r,o){let l=Ui(i),s={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return u`<span class="rhs">
      ${ee(e,t,n,{...s,compact:!0})}
    </span>`;let d=t.kind.value;return u`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${le(p=>n({...t,kind:{kind:"literal",value:p}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${Co(e,l,o,t,n,s)}
  </span>`}var Mn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:li,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function Ko(e){return Mn.find(t=>t.kind===e)??Mn[0]}var Bo="#FF9F0A",ji="#8E8E93",Yd=["#FF453A","#FFD60A","#34C759"],Wo=["#0A84FF","#34C759","#FF9F0A"];function Jd(e){return e?.attributes?.device_class==="battery"?Yd:Wo}var Xd={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function Zd(e){let t=e.iconName?.trim();return t?{off:t,on:t}:Xd[qi(e)]??{off:"circle",on:"circle.fill"}}function Qd(e){switch(qi(e)){case"lock":return{kind:"equals",value:I("locked")};case"cover":case"valve":return{kind:"equals",value:I("open")};case"media_player":return{kind:"equals",value:I("playing")};default:return{kind:"isOn"}}}function qi(e){return e.domain||e.entityId.split(".")[0]||""}function rt(e){return{...e,domain:qi(e)}}function ec(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let a=typeof t.device_class=="string"?t.device_class:"",r=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function An(e){return Math.round(e*1e4)/1e4}function Hn(e,t,n){return Math.min(n,Math.max(t,e))}function Yi(e,t,n){let i=ce[e],a=Hn(An(t/i.width),0,1),r=Hn(An(n/i.height),0,1);return{x:An((1-a)/2),y:An((1-r)/2),width:a,height:r,rotationDegrees:0}}function tc(e){let t=ce[e],n=Hn(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:Yi(e,n*1.3,n*1.3),size:n}}function nc(e){let t=ce[e],n=Hn(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:Yi(e,t.width*.88,n*1.7),size:n}}function ic(e){let t=ce[e],n=Math.min(t.width,t.height)*.9;return{frame:Yi(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function jo(e){let t=e==="rectangular";return{frame:{x:.05,y:t?.34:.3,width:.9,height:t?.42:.4,rotationDegrees:0},size:2}}function ac(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function rc(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=t))}function wt(e,t,n,i){let a=i(n);t.payload.frame=a.frame,rc(t,a.size);for(let r of X){if(r===n||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[t.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function $t(e){return De(e)}function Ji(e,t){let n={kind:{kind:"entityState",...rt(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function Go(e){let t=et("setIcon");return t.value=I(e),t}function at(e){let t=et("setColor");return t.value=I(e),t}function oc(e,t){let n=Pt(),i=n.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...rt(e)}},a.comparison=Qd(e);let r=t.on!==t.off;return i.then=r?[Go(t.on),at(Bo)]:[at(Bo)],n.otherwise=r?[Go(t.off),at(ji)]:[at(ji)],n}function sc(e){let t=Pt(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...rt(e)}},i.comparison={kind:"isUnavailable"};let a=et("setOpacity");return a.number=.35,n.then=[a],t}function Uo(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function lc(e,t,n=Wo){let i=t.max-t.min,a=Uo(t.min+i/3),r=Uo(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:I(a)},changes:[at(n[0])]},{comparison:{kind:"between",value:I(a),upper:I(r)},changes:[at(n[1])]},{comparison:{kind:"greaterThan",value:I(r)},changes:[at(n[2])]}];return Ur(Ji(e),o)}function dc(e,t,n){let i=$t("icon"),a=Zd(t);return i.payload.symbol=I(a.off),i.payload.colorSlot.baseColorHex=ji,i.payload.rules=[oc(t,a)],wt(e,i,n.family,tc),e.elements.push(i),ln(e,i.payload.id,{type:"toggleEntity",...rt(t)}),i.payload.id}function cc(e,t,n){let i=$t("text");return i.payload.value=Ji(t,n.state),i.payload.rules=[sc(t)],wt(e,i,n.family,nc),e.elements.push(i),i.payload.id}function pc(e,t,n){let i=$t("gauge");i.payload.value=Ji(t);let a=ec(n.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[lc(t,a,Jd(n.state))],wt(e,i,n.family,ic),e.elements.push(i),i.payload.id}function uc(e,t,n){let i=$t("chart");return i.payload.value={kind:{kind:"entityState",...rt(t)}},i.payload.highlight="both",i.payload.marker="pointer",wt(e,i,n.family,jo),e.elements.push(i),i.payload.id}function hc(e,t,n){let i=$t("chart");return i.payload.value={kind:{kind:"entityState",...rt(t)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",wt(e,i,n.family,jo),e.elements.push(i),i.payload.id}function mc(e,t,n){let i=$t("image");return i.payload.entity=rt(t),wt(e,i,n.family,ac),e.elements.push(i),i.payload.id}function qo(e,t,n,i){switch(t){case"toggle":return dc(e,n,i);case"status":return cc(e,n,i);case"gauge":return pc(e,n,i);case"chart":return uc(e,n,i);case"history":return hc(e,n,i);case"camera":return mc(e,n,i)}}var gc=3e4,yc=500,Yo="preset-entity",bc={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Xi(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function vc(e){return e.kind==="family"?"look":"content"}function xc(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var Jo=300,Xo=400,Zi=52,Zo=36,ot=200,wc=720,Ln=320,$c=80,kc=56,Qo="wrist-assistant-panel.columns.v2",Qi=e=>Math.max(ot,Math.min(wc,Math.round(e))),es=e=>e.metaKey||e.ctrlKey||e.shiftKey,Kt=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",Ge=Kt==="Cmd"?"\u2318":"Ctrl+",ea=Kt==="Cmd"?"\u21E7":"Shift+";function ts(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-$c;if(i>=ot*2+Ln){let r=i-Ln,o=t,l=n;if(o+l>r){let s=r/(o+l);o=Math.max(ot,Math.floor(o*s)),l=Math.max(ot,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(ot,o-d):l=Math.max(ot,l-d))}return{columns:3,left:o,right:l}}let a=e-kc;return a>=ot+Ln?{columns:2,left:Math.min(t,a-Ln),right:n}:{columns:1,left:t,right:n}}var M=class extends Oe{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Jo;this.colRight=Xo;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Dt.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=zr(()=>this.requestUpdate());this.imageSizes=Pr(()=>this.requestUpdate());this.symbols=new xn(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||wo(Yo)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=zn`
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
      --wa-text: ${pe(te.text)};
      --wa-icon: ${pe(te.icon)};
      --wa-gauge: ${pe(te.gauge)};
      --wa-shape: ${pe(te.shape)};
      --wa-image: ${pe(te.image)};
      --wa-tap: ${pe(te.tap)};
      --wa-states: ${pe(Y.states)};
      --wa-place: ${pe(Y.place)};
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
      display: grid; grid-template-columns: 16px 4px ${Zi}px minmax(0, 1fr) auto; align-items: center; gap: 8px;
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
      width: ${Zi}px; height: ${Zo}px; border-radius: 8px; overflow: hidden; flex: none;
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
    .layer .lockbtn.on { opacity: 1; color: ${pe(Y.locked)}; filter: drop-shadow(0 0 4px ${pe(Y.locked)}); }
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
    .chart-numbers { display: flex; flex-direction: column; gap: 4px; }
    .chart-numbers button { justify-content: flex-start; text-align: left; }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(Qo);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=Qi(i.left)),typeof i.right=="number"&&(this.colRight=Qi(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(Qo,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}renderGutter(n){return u`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=Jo:this.colRight=Xo,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=ts(this.panelWidth,this.colLeft,this.colRight),l=n==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=c=>{if(c.pointerId!==i.pointerId)return;let h=c.clientX-r,f=Qi(n==="left"?l+h:l-h);n==="left"?this.colLeft=f:this.colRight=f},d=c=>{c.pointerId===i.pointerId&&(p(),this.saveColumnWidths())},p=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(r=>r!==void 0),a=n.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(n.has("inspect")){let i=n.get("inspect");(i===void 0||Xi(i)!==Xi(this.inspect))&&(this.openSections=new Set(Gi))}}updated(n){let i=Xi(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(n.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(n.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=this.renderRoot.querySelector("dialog[open]")!==null;if(n.key==="Escape"&&!a&&!r){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if(n.key==="?"&&!a&&!r){n.preventDefault(),this.helpOpen=!0;return}if((n.key==="Delete"||n.key==="Backspace")&&!a&&!r){this.deleteSelection()&&n.preventDefault();return}let o=bc[n.key];if(o&&!a&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(o.dx,o.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}if(!(n.metaKey||n.ctrlKey)||(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!a?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!a&&(n.preventDefault(),this.redo()),a||r))return;let s=n.key.toLowerCase(),d=!0;s==="a"?this.selectAll():s==="c"?this.copySelection():s==="x"?this.copySelection()&&this.deleteSelection():s==="v"?this.pasteClip():s==="d"?this.duplicateSelection():s==="g"?n.shiftKey?this.ungroupSelection():this.groupPicked():s==="h"&&n.shiftKey?this.toggleHiddenSelection():n.key==="]"||n.key==="["?this.moveSelection(n.key==="]"?1:-1):d=!1,d&&n.preventDefault()}selectedIds(){let n=this.draft?.config;if(!n)return[];if(this.multi.size>0)return[...this.multi].filter(a=>n.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?n.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?He(n,i.id).map(a=>a.payload.id):[]}selectRows(n){n.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:n[0]}):n.length>1&&(this.multi=new Set(n))}deleteSelection(){let n=this.selectedIds();return!this.canEdit||n.length===0?!1:(this.mutate(i=>{for(let a of n)dn(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let n=this.draft?.config,i=this.selectedIds();return!n||i.length===0?!1:(this.clipboard=hi(n,i),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let n=this.clipboard,i=[];this.mutate(a=>{i=mi(a,n)}),this.selectRows(i)}duplicateSelection(){let n=this.draft?.config,i=this.selectedIds();if(!n||!this.canEdit||i.length===0)return;let a=hi(n,i),r=[];this.mutate(o=>{r=mi(o,a)}),this.selectRows(r)}selectAll(){let n=this.draft?.config;if(!n)return;let i=n.elements.filter(a=>!oe(n,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let n=this.draft?.config;if(!n||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?Me(n,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>_t(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let n=this.draft?.config,i=this.selectedIds();if(!n||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(l=>n.elements.find(s=>s.payload.id===l)).filter(l=>l!==void 0).some(l=>!ge(n,a,l).isHidden);this.mutate(l=>{for(let s of i)fe(l,a,s,{isHidden:o})})}moveSelection(n){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,n)}moveLayer(n,i){this.mutate(a=>{let r=a.elements.filter(c=>!oe(a,c)),o=a.elements.filter(c=>oe(a,c)),l=r.findIndex(c=>c.payload.id===n),s=l+i;if(l<0||s<0||s>=r.length)return;[r[l],r[s]]=[r[s],r[l]];let d=r[s],p=r[l];d.payload.groupId!==p.payload.groupId&&(p.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=p.payload.groupId),a.elements=[...r,...o],Le(a),ut(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await ba(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${Ue(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=wr(this.owners.find(a=>a.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await Ca(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await va(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${Ue(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=tt.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),a=Za(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Ue(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new tt(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return _a(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await xa(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=Ue(n)}}renderSendButton(){let n=sr({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return g;let i=lr(n),a=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:g;return u`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<qn}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=xi(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let n=Ba(this.draft.config);(this.compiled?.document!==this.compiledDocument||n!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=n,this.scheduleTemplates(yc))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new _e(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||Hr(n.app_version):!0}get canvasFamily(){if(Vt(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&Tr(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Er(n)[0]??"rectangular")}addShape(n){this.mutate(i=>Fr(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!gt(i,n))return;let a=Ir(i,n);a.length>0&&!window.confirm(`Remove the ${K(n)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>Rr(r,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(Qa("New complication",this.freeSlot(),[n]))}setForced(n,i){let a=new Map(this.forced);i==="live"?a.delete(n):a.set(n,i),this.forced=a}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=q(),l.slotIndex=o,i=new tt(l,null)}let a=i.encoded(),r=await wa(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=tt.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Ue(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await $a(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=Ue(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=q(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await ka(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Ue(a)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},gc)}async refreshHistorySeries(){let n=this.draft?.config,i=n?Qn(n):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points};try{let r=await Ea(this.hass,a),o=new Map;for(let[l,s]of Object.entries(r))s.ok&&o.set(l,s.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await Sa(this.hass,{doc:n})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=ur(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Ue(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=Cc(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),n.set(i,l)}return{entityStates:n,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return u`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let n=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return u`<button class="pick" ?disabled=${n}
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}><span class="glyph">⤢</span>Expand</button>`}renderZoomDialog(n,i,a){let r=this.draft?.config;if(!r)return g;let o=a.slots[n],l=n==="corner"?104/124:o.width/o.height;return u`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,n)}
        <span class="spacer"></span>
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${l}`}>
        ${this.renderBigPreview(n,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let n=Ge,i=ea,a=[[`${n}S`,"Save"],[`${n}Z \xB7 ${i}${n}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${n}C \xB7 ${n}X \xB7 ${n}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${n}D`,"Duplicate the selection in place"],[`${n}A`,"Pick every layer"],[`${n}G \xB7 ${i}${n}G`,"Group the pick \xB7 Ungroup"],[`${n}] \xB7 ${n}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${n}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"],["?","This help"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Kt}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=l=>l.map(([s,d])=>u`<tr><th scope="row"><kbd>${s}</kbd></th><td>${d}</td></tr>`);return u`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let r=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?pi(i,r):void 0}leaveRow(n){this.listHoverIds.length===n.length&&this.listHoverIds.every((a,r)=>n[r]===a)&&(this.listHoverIds=[])}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let x=this.focusTapId();if(x!==void 0&&o===x&&l&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,l,x,r??void 0);return}let E=this.hitLayerId(i);E?this.inspect={kind:"layer",id:E}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let p=es(i);if(!p&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let c=pi(this.draft.config,o),h=this.draft.config.elements.find(x=>x.payload.id===c);if(!c||!h)return;if(p){i.preventDefault(),this.togglePick(c);return}let f=Me(this.draft.config,c);if(f?.locked&&!r&&!d){this.beginGroupGesture(n,i,l,f);return}if((this.inspect.kind!=="layer"||this.inspect.id!==c)&&(this.inspect={kind:"layer",id:c},r))return;i.preventDefault();let y=ge(this.draft.config,n,h).frame,w=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=c;let x=h.payload,E=ye[n],$=y.width*E.width,m=y.height*E.height,b={x:0,y:0,w:$,h:m,cx:$/2,cy:m/2},v=yn(x,b,gn(new Date));if(this.cancelGesture?.(),s){let S=w.width/E.width,A=x.timestampSize;this.cancelGesture=ao(l,i,s,{w:v.w*S,h:v.h*S},(N,W)=>{let R=Math.min(40,Math.max(4,Math.round(A*N)));this.mutate(F=>{let z=F.elements.find(J=>J.payload.id===c);z?.kind==="image"&&(z.payload.timestampSize=R)},`ts-size-${c}`),W&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let C={x:0,y:0,w:y.width*w.width,h:y.height*w.height},H=Ie(x)?{x:x.timestampX,y:x.timestampY}:{x:(v.x+v.w/2)/b.w,y:(v.y+v.h/2)/b.h},V=!1;this.cancelGesture=io(l,C,i,H,(S,A,N)=>{N||(V=!0),V&&this.mutate(W=>{let R=W.elements.find(F=>F.payload.id===c);R?.kind==="image"&&(R.payload.timestampX=S,R.payload.timestampY=A)},`ts-${c}`),N&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=Sn(l,w,i,{elementId:c,frame:y,handle:r??void 0},{onFrame:(x,E,$)=>{this.mutate(m=>fe(m,n,x,{frame:E}),`drag-${x}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,a,r){let o=this.draft?.config;if(!o)return;let l=He(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(x=>[x.payload.id,ge(o,n,x).frame])),d=[...s.values()],p=Math.min(...d.map(x=>x.x)),c=Math.min(...d.map(x=>x.y)),h=Math.max(...d.map(x=>x.x+x.width)),f=Math.max(...d.map(x=>x.y+x.height)),y={x:p,y:c,width:h-p,height:f-c,rotationDegrees:0},w=x=>Math.round(x*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=Sn(a,this.gestureCanvas(n),i,{elementId:r.id,frame:y},{onFrame:(x,E,$)=>{let m=E.x-y.x,b=E.y-y.y;this.mutate(v=>{for(let[C,H]of s)fe(v,n,C,{frame:{...H,x:w(H.x+m),y:w(H.y+b)}})},`drag-group-${r.id}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?to:1,l=n*o,s=i*o,d=this.canvasFamily,p=ye[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,p,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let x=this.inspect.id;return this.nudgeMany(He(r,x).map(E=>E.payload.id),d,p,`nudge-group-${x}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let c=this.inspect.id,h=r.elements.find(x=>x.payload.id===c);if(!h)return!1;let f=Me(r,c);if(f?.locked)return this.nudgeMany(He(r,f.id).map(x=>x.payload.id),d,p,`nudge-group-${f.id}-${d}`,l,s);let y=ge(r,d,h).frame,w=Ni(y,l,s,p);return(w.x!==y.x||w.y!==y.y)&&this.mutate(x=>fe(x,d,c,{frame:w}),`nudge-${c}-${d}`),!0}nudgeMany(n,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=b=>Math.round(b*1e3)/1e3,p=new Map;for(let b of n){let v=s.elements.find(C=>C.payload.id===b);v&&p.set(b,ge(s,i,v).frame)}if(p.size===0)return!1;let c=[...p.values()],h=Math.min(...c.map(b=>b.x)),f=Math.min(...c.map(b=>b.y)),y=Math.max(...c.map(b=>b.x+b.width)),w=Math.max(...c.map(b=>b.y+b.height)),x={x:h,y:f,width:y-h,height:w-f,rotationDegrees:0},E=Ni(x,o,l,a),$=E.x-x.x,m=E.y-x.y;return($!==0||m!==0)&&this.mutate(b=>{for(let[v,C]of p)fe(b,i,v,{frame:{...C,x:d(C.x+$),y:d(C.y+m)}})},r),!0}nudgeTimestamp(n,i,a,r){let o=this.draft?.config,l=o?.elements.find(x=>x.payload.id===n);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=ye[i],p=ge(o,i,l).frame,c=p.width*d.width,h=p.height*d.height,f=yn(s,{x:0,y:0,w:c,h,cx:c/2,cy:h/2},gn(new Date)),y=Ie(s)?{x:s.timestampX,y:s.timestampY}:{x:c>0?(f.x+f.w/2)/c:.5,y:h>0?(f.y+f.h/2)/h:.5},w=no(y,a,r,{w:c,h});return(w.x!==y.x||w.y!==y.y)&&this.mutate(x=>{let E=x.elements.find($=>$.payload.id===n);E?.kind==="image"&&(E.payload.timestampX=w.x,E.payload.timestampY=w.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=fn(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=Ri(i.scale,r);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=n.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:be(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(c=>c.payload.id===r);if(!l||!s)return;let d=oe(l,s),p=ge(l,n,s).frame;this.cancelGesture?.(),this.cancelGesture=Sn(a,this.gestureCanvas(n),i,{elementId:r,frame:p,handle:o},{onFrame:(c,h,f)=>{this.mutate(y=>{d?nr(y,c,n,h):fe(y,n,c,{frame:h})},`tap-box-${c}-${n}`),f&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:ts(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1><span class="mark">${P("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:g}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!n?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!n?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips (?)" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>u`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${ta(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":n?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:g}
      ${this.helpOpen?this.renderHelpDialog():g}
      ${this.watchSupported?u`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${Lr(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(K).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(n){return u`<span class="shape-dots">${ft.map(i=>u`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${K(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=n?n.config.name.trim()||"Untitled":"No complication",r=n?n.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:g}
        ${P("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:g}
        ${o.map(s=>s.kind==="record"?u`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(xc(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:u`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${n&&n.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:g}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${P("plus")}<span class="pk-name">New complication</span>${l<0?u`<span class="pk-badge">watch is full</span>`:g}
          </button>
          ${this.newShapeChooser&&l>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${ft.map(s=>u`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${K(s)}</button>`)}
            </div>
          </div>`:g}`:g}
      </div>`:g}
    </div>`}togglePicker(n=!this.pickerOpen){this.pickerOpen=n,n||(this.newShapeChooser=!1),n?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderBanners(){let n=[],i=this.renderOrphanBanner();if(i&&n.push(i),this.readOnlyReason?n.push(u`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&n.push(u`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;n.push(u`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?u` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&n.push(u`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&n.push(u`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),n}renderOrphanBanner(){let n=this.selectedOwner;if(!n?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return u`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${n.complication_count} complication${n.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?u`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:u`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${ta(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:g}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return g;let i=n.elements.length>=64;return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${P("plus")}</span>Add a layer</h2>
      <div class="add-grid">
        ${Ar.map(a=>u`<button class="add" style=${`--k:${te[a]}`} ?disabled=${i} title=${`Add a blank ${yt[a].toLowerCase()} layer`}
          @click=${()=>{let r=De(a);this.mutate(o=>{o.elements.push(r)}),this.inspect={kind:"layer",id:r.payload.id}}}>${P(a)}<span>${yt[a]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${Mn.map(a=>u`<button class="preset" title=${a.blurb}
          ?disabled=${n.elements.length+a.layerCount>64}
          @click=${()=>this.openPreset(a.kind)}>${a.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,a,r=!1){n!==i&&this.mutate(o=>{let l=o.elements.filter(y=>!oe(o,y)),s=o.elements.filter(y=>oe(o,y)),d=[...l].reverse(),p=d.find(y=>y.payload.id===i);if(!p)return;let c=o.groups?.find(y=>y.id===n),h=c?d.filter(y=>y.payload.groupId===c.id):d.filter(y=>y.payload.id===n);if(h.length===0||h.includes(p))return;d=d.filter(y=>!h.includes(y));let f;if((c||r)&&p.payload.groupId!==void 0){let y=d.filter(w=>w.payload.groupId===p.payload.groupId);f=a?d.indexOf(y[0]):d.indexOf(y[y.length-1])+1}else f=d.indexOf(p)+(a?0:1);if(d.splice(f,0,...h),!c){let y=h[0],w=r?void 0:p.payload.groupId;w===void 0?delete y.payload.groupId:y.payload.groupId=w}o.elements=[...d.reverse(),...s],Le(o),ut(o)})}rowDrag(n,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=n,a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"),a.currentTarget.classList.add("dragging")},onEnd:a=>{this.dragId=void 0,a.currentTarget.classList.remove("dragging")},onOver:a=>{if(!this.dragId||this.dragId===n)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=a.clientY<o.top+o.height/2;r.classList.toggle("drop-before",l),r.classList.toggle("drop-after",!l)},onLeave:a=>{a.currentTarget.classList.remove("drop-before","drop-after")},onDrop:a=>{a.preventDefault();let r=a.currentTarget,o=r.classList.contains("drop-before");r.classList.remove("drop-before","drop-after"),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(es(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===n){this.togglePick(n);return}let r=[...i.elements].filter(s=>!oe(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(n);if(o<0||l<0){this.togglePick(n);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi];if(!this.canEdit||n.length<2)return;let i;this.mutate(a=>{i=ai(a,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return g;let i=this.canEdit,a=this.canvasFamily,r=(v,C)=>this.moveLayer(v,C),o=v=>{let C;this.mutate(H=>{C=ar(H,v)}),C&&(this.inspect={kind:"layer",id:C})},l=v=>{this.mutate(C=>dn(C,v)),this.inspect.kind==="layer"&&this.inspect.id===v&&(this.inspect={kind:"general"})},s=[...n.elements].filter(v=>!oe(n,v)).reverse(),d=re(this.host()),p=new _e(this.buildContext(),this.draft?.config),c=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",f=this.activeFamily==="inline"?"one line of text":`${c?.backgroundColorHex?we(c.backgroundColorHex):"transparent"} \xB7 ${c?.borderColorHex?`${c.borderWidth} pt border`:"no border"}`,y=[...this.multi].filter(v=>n.elements.some(C=>C.payload.id===v)).length,w=$i(n,this.buildContext(),this.forced)[a],x=v=>w?u`<span class="thumb">${Sr(w,v,{icons:this.icons,imageSizes:this.imageSizes,width:Zi,height:Zo})}</span>`:u`<span class="thumb"></span>`,E=(v,C)=>{let H=v.payload.id,V=this.inspect.kind==="layer"&&this.inspect.id===H,S=ge(n,a,v),A=v.payload.isHidden||S.isHidden,N=be(n,H)[0],W=Bt(v.payload.rules),R=this.picking&&this.pickHoverId===H,F=this.rowDrag(H,i);return u`<div class="layer ${V?"hl":""} ${R?"pick":""} ${A?"dim":""} ${this.multi.has(H)?"multi":""} ${C?"kid":""}"
        style=${`--k:${te[v.kind]}`} tabindex="0" draggable=${F.draggable}
        @pointerenter=${()=>{this.listHoverIds=[H]}}
        @pointerleave=${()=>this.leaveRow([H])}
        @click=${z=>this.clickRow(H,z)}
        @keydown=${z=>{z.key==="Enter"&&(this.inspect={kind:"layer",id:H})}}
        @dragstart=${F.onStart} @dragend=${F.onEnd} @dragover=${F.onOver} @dragleave=${F.onLeave} @drop=${F.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${P("grip")}</span>
        <span class="bar"></span>
        ${x([H])}
        <span class="name">
          <b>${$e(v,d)}</b>
          <small><span class="kind">${yt[v.kind]}</span> · ${Sc(v,p,this.historySeries)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${N?u`<span class="badge tap" title=${`Tappable \xB7 ${$e(N,d)}`}>tap</span>`:g}
            ${v.payload.rules.length===0?g:u`<span class="badge states" title=${W}>${W.replace(/\.$/,"").toLowerCase()}</span>`}
            ${A?u`<span class="badge">hidden</span>`:g}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title=${`Bring forward (${Ge}])`} aria-label="Bring forward" @click=${z=>{z.stopPropagation(),r(H,1)}}>${P("up")}</button>
            <button class="icon" title=${`Send back (${Ge}[)`} aria-label="Send back" @click=${z=>{z.stopPropagation(),r(H,-1)}}>${P("down")}</button>
            <button class="icon" title=${`${S.isHidden?"Show in":"Hide in"} ${K(a)} (${ea}${Ge}H)`} aria-label=${S.isHidden?"Show this layer":"Hide this layer"} @click=${z=>{z.stopPropagation(),this.mutate(J=>fe(J,a,H,{isHidden:!S.isHidden}))}}>${P(S.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${Ge}D)`} aria-label="Duplicate" @click=${z=>{z.stopPropagation(),o(H)}}>${P("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${z=>{z.stopPropagation(),l(H)}}>${P("delete")}</button>
          </span>`:g}
        </span>
      </div>`},$=(v,C)=>{let H=this.inspect.kind==="group"&&this.inspect.id===v.id,V=!this.collapsed.has(v.id),S=this.rowDrag(v.id,i),A=C[0],N=C[C.length-1],W=["drop-before","drop-into","drop-after"],R=z=>{let J=z.currentTarget.getBoundingClientRect(),Z=(z.clientY-J.top)/J.height;return Z<.25?"drop-before":!V&&Z>.75?"drop-after":"drop-into"},F=C.map(z=>z.payload.id);return u`<div class="layer group ${H?"hl":""}" style=${`--k:${Y.group}`} tabindex="0" draggable=${S.draggable}
        @pointerenter=${()=>{this.listHoverIds=F}}
        @pointerleave=${()=>this.leaveRow(F)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:v.id}}}
        @keydown=${z=>{z.key==="Enter"&&(this.inspect={kind:"group",id:v.id})}}
        @dragstart=${S.onStart} @dragend=${S.onEnd}
        @dragover=${z=>{if(!this.dragId||this.dragId===v.id)return;z.preventDefault();let J=z.currentTarget,Z=R(z);for(let ve of W)J.classList.toggle(ve,ve===Z)}}
        @dragleave=${z=>{z.currentTarget.classList.remove(...W)}}
        @drop=${z=>{z.preventDefault();let J=z.currentTarget,Z=R(z);J.classList.remove(...W);let ve=this.dragId;if(this.dragId=void 0,!(!ve||!A||!N)){if(Z==="drop-before"){this.reorderLayer(ve,A.payload.id,!0,!0);return}if(Z==="drop-after"){this.reorderLayer(ve,N.payload.id,!1,!0);return}this.isGroupId(ve)||(this.reorderLayer(ve,A.payload.id,!0),this.mutate(ns=>ri(ns,ve,v.id)))}}}>
        <button class="chev" aria-expanded=${V?"true":"false"} title=${V?"Fold the group":"Unfold the group"}
          @click=${z=>{z.stopPropagation();let J=new Set(this.collapsed);V?J.add(v.id):J.delete(v.id),this.collapsed=J}}>${P("chevron")}</button>
        <span class="bar"></span>
        ${x(C.map(z=>z.payload.id))}
        <span class="name">
          <b>${v.name}</b>
          <small><span class="kind">Group</span> · ${C.length} layer${C.length===1?"":"s"} · ${v.locked?"moves as one":"unlocked"}</small>
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${ea}${Ge}G)`} aria-label="Ungroup" @click=${z=>{z.stopPropagation(),this.mutate(J=>_t(J,v.id)),H&&(this.inspect={kind:"general"})}}>${P("ungroup")}</button>
          </span>`:g}
          <button class="icon lockbtn ${v.locked?"on":""}" ?disabled=${!i}
            title=${v.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${v.locked?"Unlock the group":"Lock the group"}
            @click=${z=>{z.stopPropagation(),this.mutate(J=>{let Z=J.groups?.find(ve=>ve.id===v.id);Z&&(Z.locked=!Z.locked)})}}>${P(v.locked?"lock":"unlock")}</button>
        </span>
      </div>`},m=[],b=new Set;for(let v=0;v<s.length;v++){let C=s[v],H=C.payload.groupId,V=H===void 0?void 0:n.groups?.find(A=>A.id===H);if(!V){m.push(E(C,!1));continue}if(b.has(V.id))continue;b.add(V.id);let S=s.filter(A=>A.payload.groupId===V.id);m.push($(V,S)),this.collapsed.has(V.id)||m.push(u`<div class="group-kids">${S.map(A=>E(A,!0))}</div>`)}return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${P("layers")}</span>Layers<span class="spacer"></span><span class="mini">top draws last</span></h2>
      ${this.activeFamily==="inline"?u`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${K(a)} shape.</div>`:g}
      ${y>=2&&i?u`<div class="group-cta"><span>${y} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${Ge}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?u`<div class="hint">${Kt}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. Press <b>?</b> for every key and mouse trick.</div>`:g}
      ${n.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:g}
      <div class="layers">
      ${m}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${Y.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${v=>{v.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${v=>{this.dragId&&(v.preventDefault(),v.currentTarget.classList.add("drop-before"))}}
        @dragleave=${v=>{v.currentTarget.classList.remove("drop-before")}}
        @drop=${v=>{v.preventDefault(),v.currentTarget.classList.remove("drop-before");let C=this.dragId,H=[...s].reverse().find(V=>V.payload.id!==C&&V.payload.groupId!==C);C&&H&&this.reorderLayer(C,H.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${P("shape")}</span>
        <span class="bar"></span>
        ${x([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${K(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${f}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let n=this.presetKind?Ko(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?g:u`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${Be(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Yo,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=qo(l,n,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=$i(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${Ot.map(o=>u`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Dt.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(n,r)}
      </div>
      ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):g}
      <div class="strip">
        ${this.renderSettingsRow(n)}
        ${this.renderShapesRow(n,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(n,i,a){let r=i[n];if(!r)return g;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?Me(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||Me(l,o)?.locked)?He(l,s).map(y=>y.payload.id):[],p=[...new Set([...d,...this.multi])],c=a.slots[n],h=this.focusTapId(),f={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:c,highlightId:h??o,...p.length>0&&!this.showTaps?{highlightIds:p}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(n,y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Ii(r,f)}
    </div>`}renderUnder(n,i){let a=re(this.host()),r=this.inspect,o=r.kind==="layer"?n.elements.find(c=>c.payload.id===r.id):void 0,l;if(this.showTaps)l=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Ae(n.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let c=n.groups?.find(f=>f.id===r.id),h=c?He(n,c.id).length:0;l=c?u`editing group <b>${c.name}</b>. ${c.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let c=Me(n,o.payload.id);l=c?.locked?u`editing <b>${$e(o,a)}</b> in <b>${c.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${$e(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=fn(s,i),p=Math.round(d.scale*100);return u`<div class="under"><b>${K(i)}</b> · ${s.width} × ${s.height} pt${p!==100?` \xB7 ${p}%`:""} · ${l}</div>`}renderInlinePreview(n,i){let a;if(!n)a=u`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>r?mt((n.countdownEnd-r)/1e3):n.text,l=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;a=u`<div class="inline-line">${l??g}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?a:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(n){let i=this.host(),a=this.records.find(p=>p.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?ta(r):void 0].filter(Boolean).join(" \xB7 "),l=n.values,s=new _e(this.buildContext(),this.draft?.config),d=re(i);return u`<div class="strip-row" style=${`--c:${Y.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${P("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:g}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${Fo(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let p=Ao();this.mutate(c=>{c.values.push(p)}),this.inspect={kind:"data",id:p.id}}}>Add</button>`:g}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${l.map(p=>{let c=s.resolve({kind:{kind:"named",id:p.id}}),h=this.inspect.kind==="data"&&this.inspect.id===p.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:p.id}}}>
            <span class="name">${p.name||"(unnamed)"}</span>
            <span class="meta ${c===void 0?"none":""}" title=${de(p.value,d)}>${c??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${f=>{f.stopPropagation(),this.mutate(y=>{y.values=y.values.filter(w=>w.id!==p.id)}),h&&(this.inspect={kind:"general"})}}>${P("delete")}</button>`:g}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let a=n.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${Y.place}`}><span class="swatch">${P("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${ft.map(r=>{if(!a.includes(r))return u`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${K(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${K(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?Ii(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Dt.slots[r]}):g}let d=r!=="inline"&&n.elements.every(c=>ge(n,r,c).isHidden||c.payload.isHidden)&&n.elements.length>0,p=this.canEdit&&gt(n,r);return u`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${K(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${K(r)}${d?u`<small>· nothing shown</small>`:g}${l?u`<small>· editing</small>`:g}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!p}
              title=${p?`Remove the ${K(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${K(r)} shape`}
              @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${P("delete")}</button>`:g}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return g;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${Y.states}`}><span class="swatch">${P("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:g}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",p=this.testValues.get(r),h=n.elements.find(y=>cn(n,y.payload.id).some(w=>w.ref.entityId===r))?.kind??"text",f=this.editingValue===r;return u`<button class="vchip ${p!==void 0?"testing":""}" style=${`--k:${te[h]}`}
            title=${p!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${y=>{y.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${P(h)}</span><b>${l}</b>
            ${f?u`<input type="text" .value=${p??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${y=>{y.key==="Enter"&&y.target.blur(),y.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${y=>this.commitTestValue(r,y.target.value)} />`:u`<span class="val">${p!==void 0?`${p}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[n]?.state;a===""||a===o?r.delete(n):r.set(n,a),this.testValues=r}currentCase(){return Ot.find(n=>n.label===this.previewCase)??Dt}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let a=this.inspect,r=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":K(this.activeFamily),l=a.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${Y.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=g,d=g;if(i!==void 0)s=u`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let p=n.elements.find(c=>c.payload.id===a.id);if(p){s=u`<span class="here" style=${`--k:${te[p.kind]}`}><span class="kchip">${yt[p.kind]}</span>${$e(p,re(this.host()))}</span>`;let c=Me(n,p.payload.id);c&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:c.id}}} title="Edit the group">${c.name}</button>`)}}else if(a.kind==="group"){let p=n.groups?.find(c=>c.id===a.id);p&&(s=u`<span class="here" style=${`--k:${Y.group}`}><span class="kchip">Group</span>${p.name}</span>`)}else if(a.kind==="data"){let p=n.values.find(c=>c.id===a.id);p&&(s=u`<span class="here" style=${`--k:${Y.complication}`}><span class="kchip">Value</span>${p.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===g?g:u`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return g;let i=this.pickedElements(n);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let a=this.host(),r=this.inspect,o=g,l=!0;if(r.kind==="layer"){let d=n.elements.find(p=>p.payload.id===r.id);if(!d)return this.inspect={kind:"general"},g;o=Ho(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=n.groups?.find(p=>p.id===r.id);if(!d)return this.inspect={kind:"general"},g;l=!1,o=_o(a,d)}else if(r.kind==="data"){let d=n.values.find(p=>p.id===r.id);if(!d)return this.inspect={kind:"general"},g;l=!1,o=u`<div class="sec" data-open="true" style=${`--c:${Y.complication}`}>
        <div class="sec-h"><span class="swatch">${P("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${Io(a,d)}</div>
      </div>`}else r.kind==="family"?o=zo(a,this.activeFamily):(l=!1,o=u`<div class="empty-insp">${P("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${l?u`<button class="expand" @click=${()=>{this.openSections=s?new Set([vc(r)]):new Set(Gi)}}>${s?"One at a time":"Open all"}</button>`:g}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,a){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${n}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:g}</span></label>`}multiEditor(n,i){let a=this.canvasFamily,r=re(this.host()),o=new _e(this.buildContext(),this.draft?.config),l=Mo(n,a,i),s=i.length,d=[...i].reverse(),p=f=>this.mutate(y=>{for(let w of i)fe(y,a,w.payload.id,{isHidden:f})}),c=f=>this.mutate(y=>{for(let w of i){let x=y.elements.find(E=>E.payload.id===w.payload.id);x&&(x.payload.isHidden=f)}}),h=f=>this.mutate(y=>{for(let w of i){let x=y.elements.find(E=>E.payload.id===w.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&(x.payload.colorSlot.baseColorHex=f)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${P("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(f=>u`<div class="row" style=${`--k:${te[f.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${f.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(f.payload.symbol)??"questionmark",16,f.payload.colorSlot.baseColorHex)??g}</span>`:g}
                <b>${$e(f,r)}</b><span class="kind">${yt[f.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${Kt}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" title=${`Group (${Ge}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${Y.place}`}>
        <div class="sec-h"><span class="swatch">${P("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${K(a)}`,l.hiddenHere,p)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,c)}
          ${l.colourable?u`${ae("Colour",l.colour,f=>{f!==void 0&&h(f)})}
              ${l.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:g}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return g;let i=this.records.find(r=>r.id===this.selectedId),a=Or({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${n.dirty?u` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?u`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:g}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?u`<pre>${JSON.stringify(n.encoded(),null,2)}</pre>`:g}
      </div>
    </details>`}};L([dt({attribute:!1})],M.prototype,"hass",2),L([dt({type:Boolean})],M.prototype,"narrow",2),L([dt({attribute:!1})],M.prototype,"panel",2),L([_()],M.prototype,"colLeft",2),L([_()],M.prototype,"colRight",2),L([_()],M.prototype,"panelWidth",2),L([_()],M.prototype,"owners",2),L([_()],M.prototype,"ownerId",2),L([_()],M.prototype,"records",2),L([_()],M.prototype,"selectedId",2),L([_()],M.prototype,"draft",2),L([_()],M.prototype,"readOnlyReason",2),L([_()],M.prototype,"parseError",2),L([_()],M.prototype,"maxSchemaVersion",2),L([_()],M.prototype,"presets",2),L([_()],M.prototype,"occupied",2),L([_()],M.prototype,"serverToken",2),L([_()],M.prototype,"appliedToken",2),L([_()],M.prototype,"polling",2),L([_()],M.prototype,"sendPending",2),L([_()],M.prototype,"pages",2),L([_()],M.prototype,"templateResults",2),L([_()],M.prototype,"historySeries",2),L([_()],M.prototype,"templateError",2),L([_()],M.prototype,"templateFetchedAt",2),L([_()],M.prototype,"forced",2),L([_()],M.prototype,"showRaw",2),L([_()],M.prototype,"inspect",2),L([_()],M.prototype,"openSections",2),L([_()],M.prototype,"pickerOpen",2),L([_()],M.prototype,"testValues",2),L([_()],M.prototype,"editingValue",2),L([_()],M.prototype,"multi",2),L([_()],M.prototype,"collapsed",2),L([_()],M.prototype,"activeFamily",2),L([_()],M.prototype,"picking",2),L([_()],M.prototype,"pickHoverId",2),L([_()],M.prototype,"listHoverIds",2),L([_()],M.prototype,"zoomed",2),L([_()],M.prototype,"helpOpen",2),L([_()],M.prototype,"showTaps",2),L([_()],M.prototype,"timestampActiveId",2),L([_()],M.prototype,"savedName",2),L([_()],M.prototype,"presetKind",2),L([_()],M.prototype,"presetEntity",2),L([_()],M.prototype,"newShapeChooser",2),L([_()],M.prototype,"previewCase",2),L([_()],M.prototype,"loadError",2),L([_()],M.prototype,"saveError",2),L([_()],M.prototype,"saving",2),L([_()],M.prototype,"conflict",2),L([_()],M.prototype,"remoteRevision",2),L([_()],M.prototype,"confirmDelete",2),L([_()],M.prototype,"moveTarget",2),L([_()],M.prototype,"moving",2),L([_()],M.prototype,"moveError",2),L([_()],M.prototype,"version",2);function Ue(e){return String(e?.message??e)}function Cc(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function ta(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function Sc(e,t,n){switch(e.kind){case"text":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.style}`;case"chart":{let i=Ze(e.payload),a=i!==void 0?n.get(i)??"":t.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Nt(a).length} values`}case"shape":return`${we(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Ae(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",M);export{M as WristAssistantPanel,ts as columnFit};
