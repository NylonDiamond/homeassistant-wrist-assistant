var xs=Object.defineProperty;var ws=Object.getOwnPropertyDescriptor;var H=(e,n,t,i)=>{for(var a=i>1?void 0:i?ws(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&xs(n,t,a),a};var Zt=globalThis,Qt=Zt.ShadowRoot&&(Zt.ShadyCSS===void 0||Zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Vn=Symbol(),ha=new WeakMap,Tt=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Vn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(Qt&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=ha.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&ha.set(t,n))}return n}toString(){return this.cssText}},ue=e=>new Tt(typeof e=="string"?e:e+"",void 0,Vn),Bn=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Tt(t,e,Vn)},ma=(e,n)=>{if(Qt)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Zt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Gn=Qt?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return ue(t)})(e):e;var{is:ks,defineProperty:$s,getOwnPropertyDescriptor:Cs,getOwnPropertyNames:Ss,getOwnPropertySymbols:Es,getPrototypeOf:Ts}=Object,en=globalThis,fa=en.trustedTypes,Fs=fa?fa.emptyScript:"",Rs=en.reactiveElementPolyfillSupport,Ft=(e,n)=>e,Rt={toAttribute(e,n){switch(n){case Boolean:e=e?Fs:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},tn=(e,n)=>!ks(e,n),ga={attribute:!0,type:String,converter:Rt,reflect:!1,useDefault:!1,hasChanged:tn};Symbol.metadata??=Symbol("metadata"),en.litPropertyMetadata??=new WeakMap;var Ie=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=ga){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&$s(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=Cs(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(n,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??ga}static _$Ei(){if(this.hasOwnProperty(Ft("elementProperties")))return;let n=Ts(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ft("properties"))){let t=this.properties,i=[...Ss(t),...Es(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Gn(a))}else n!==void 0&&t.push(Gn(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ma(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Rt).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Rt;this._$Em=a;let l=o.fromAttribute(t,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??tn)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[Ft("elementProperties")]=new Map,Ie[Ft("finalized")]=new Map,Rs?.({ReactiveElement:Ie}),(en.reactiveElementVersions??=[]).push("2.1.2");var Jn=globalThis,ya=e=>e,nn=Jn.trustedTypes,ba=nn?nn.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ca="$lit$",Ve=`lit$${Math.random().toFixed(9).slice(2)}$`,Sa="?"+Ve,Is=`<${Sa}>`,Je=document,Mt=()=>Je.createComment(""),At=e=>e===null||typeof e!="object"&&typeof e!="function",Xn=Array.isArray,Ms=e=>Xn(e)||typeof e?.[Symbol.iterator]=="function",Un=`[ 	
\f\r]`,It=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,va=/-->/g,xa=/>/g,qe=RegExp(`>|${Un}(?:([^\\s"'>=/]+)(${Un}*=${Un}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),wa=/'/g,ka=/"/g,Ea=/^(?:script|style|textarea|title)$/i,Zn=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),u=Zn(1),v=Zn(2),ep=Zn(3),Xe=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),$a=new WeakMap,Ye=Je.createTreeWalker(Je,129);function Ta(e,n){if(!Xn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ba!==void 0?ba.createHTML(n):n}var As=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=It;for(let l=0;l<t;l++){let s=e[l],d,p,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,p=o.exec(s),p!==null);)h=o.lastIndex,o===It?p[1]==="!--"?o=va:p[1]!==void 0?o=xa:p[2]!==void 0?(Ea.test(p[2])&&(a=RegExp("</"+p[2],"g")),o=qe):p[3]!==void 0&&(o=qe):o===qe?p[0]===">"?(o=a??It,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?qe:p[3]==='"'?ka:wa):o===ka||o===wa?o=qe:o===va||o===xa?o=It:(o=qe,a=void 0);let g=o===qe&&e[l+1].startsWith("/>")?" ":"";r+=o===It?s+Is:c>=0?(i.push(d),s.slice(0,c)+Ca+s.slice(c)+Ve+g):s+Ve+(c===-2?l:g)}return[Ta(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},Ht=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,l=n.length-1,s=this.parts,[d,p]=As(n,t);if(this.el=e.createElement(d,i),Ye.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(a=Ye.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let c of a.getAttributeNames())if(c.endsWith(Ca)){let h=p[o++],g=a.getAttribute(c).split(Ve),y=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:y[2],strings:g,ctor:y[1]==="."?Wn:y[1]==="?"?jn:y[1]==="@"?qn:ht}),a.removeAttribute(c)}else c.startsWith(Ve)&&(s.push({type:6,index:r}),a.removeAttribute(c));if(Ea.test(a.tagName)){let c=a.textContent.split(Ve),h=c.length-1;if(h>0){a.textContent=nn?nn.emptyScript:"";for(let g=0;g<h;g++)a.append(c[g],Mt()),Ye.nextNode(),s.push({type:2,index:++r});a.append(c[h],Mt())}}}else if(a.nodeType===8)if(a.data===Sa)s.push({type:2,index:r});else{let c=-1;for(;(c=a.data.indexOf(Ve,c+1))!==-1;)s.push({type:7,index:r}),c+=Ve.length-1}r++}}static createElement(n,t){let i=Je.createElement("template");return i.innerHTML=n,i}};function ut(e,n,t=e,i){if(n===Xe)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=At(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=ut(e,a._$AS(e,n.values),a,i)),n}var Kn=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??Je).importNode(t,!0);Ye.currentNode=a;let r=Ye.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new Lt(r,r.nextSibling,this,n):s.type===1?d=new s.ctor(r,s.name,s.strings,this,n):s.type===6&&(d=new Yn(r,this,n)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=Ye.nextNode(),o++)}return Ye.currentNode=Je,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Lt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=ut(this,n,t),At(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==Xe&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Ms(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&At(this._$AH)?this._$AA.nextSibling.data=n:this.T(Je.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=Ht.createElement(Ta(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new Kn(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=$a.get(n.strings);return t===void 0&&$a.set(n.strings,t=new Ht(n)),t}k(n){Xn(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(Mt()),this.O(Mt()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=ya(n).nextSibling;ya(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=ut(this,n,t,0),o=!At(n)||n!==this._$AH&&n!==Xe,o&&(this._$AH=n);else{let l=n,s,d;for(n=r[0],s=0;s<r.length-1;s++)d=ut(this,l[i+s],t,s),d===Xe&&(d=this._$AH[s]),o||=!At(d)||d!==this._$AH[s],d===f?n=f:n!==f&&(n+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Wn=class extends ht{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},jn=class extends ht{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},qn=class extends ht{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=ut(this,n,t,0)??f)===Xe)return;let i=this._$AH,a=n===f&&i!==f||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Yn=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){ut(this,n)}};var Hs=Jn.litHtmlPolyfillSupport;Hs?.(Ht,Lt),(Jn.litHtmlVersions??=[]).push("3.3.3");var Fa=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Lt(n.insertBefore(Mt(),r),r,void 0,t??{})}return a._$AI(e),a};var Qn=globalThis,Be=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Fa(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Xe}};Be._$litElement$=!0,Be.finalized=!0,Qn.litElementHydrateSupport?.({LitElement:Be});var Ls=Qn.litElementPolyfillSupport;Ls?.({LitElement:Be});(Qn.litElementVersions??=[]).push("4.2.2");var _s={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:tn},zs=(e=_s,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(l){let s=n.get.call(this);n.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=t;return function(l){let s=this[o];n.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function mt(e){return(n,t)=>typeof t=="object"?zs(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function L(e){return mt({...e,state:!0,attribute:!1})}var Me="wrist_assistant/complications";async function Ra(e){return e.connection.sendMessagePromise({type:`${Me}/owners`})}async function Ia(e,n){return e.connection.sendMessagePromise({type:`${Me}/list`,owner_watch_id:n})}async function Ma(e,n){return e.connection.sendMessagePromise({type:`${Me}/nudge`,owner_watch_id:n})}async function Aa(e,n,t,i){return e.connection.sendMessagePromise({type:`${Me}/save`,owner_watch_id:n,document:t,base_revision:i})}async function Ha(e,n,t,i){return e.connection.sendMessagePromise({type:`${Me}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function La(e,n,t){return e.connection.sendMessagePromise({type:`${Me}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function _a(e,n,t){let i={type:`${Me}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function za(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Me}/render_values`,templates:n})).results}async function Pa(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Me}/history_series`,requests:n})).results}var Z=["rectangular","circular","corner"],me={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},Ps=["rectangular","circular","corner","inline"];var ei=64;function Wa(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<ei;i++)if(!t.has(i))return i;return-1}function _t(e){return Z.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var ft=[["latest","Newest reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["top","Top of the scale"],["bottom","Bottom of the scale"]],ja={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},fe={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},dn="#FF6B35",cn="#32D74B",ti="#32D74B",pn="#FF453A";function gt(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function qa(e){return e.coloring==="bands"&&e.bands.length>0}function Ya(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function Ja(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}var ni=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],ii=2,ai=120;function Xa(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?Math.max(ii,Math.min(ai,n)):24}function Za(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function tt(e){let n=Za(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${Xa(e)}`}function Qa(e){return ri(e).map(n=>n.key).sort().join(";")}function ri(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=tt(t.payload),a=Za(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),points:Xa(t.payload)})}return[...n.values()]}var zt=6,Pt=9,Os=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ae(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function oi(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var si={top:0,left:0,bottom:0,right:0};function un(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var li=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function He(e){let n=li.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function D(e,n=""){return typeof e=="string"?e:n}function O(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function Ee(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function sn(e){return e==null?void 0:O(e,0)}function he(e){return typeof e=="string"?e:void 0}var Te=class extends Error{};function Qe(e){if(typeof e.entityId!="string")throw new Te("entityId is required");let n={entityId:e.entityId,displayName:D(e.displayName),domain:D(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Oa(e){if(!F(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=O(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=O(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=O(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Fe(n)?void 0:n}function Fe(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function Ns(e){let n=D(e.function,"count"),t=F(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(F).map(Qe)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(F(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:D(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Na(e){switch(e.kind){case"literal":return{kind:"literal",value:D(e.value)};case"entityState":return{kind:"entityState",...Qe(e)};case"entityAttribute":return{kind:"entityAttribute",...Qe(e),attribute:D(e.attribute)};case"entityAge":return{kind:"entityAge",...Qe(e)};case"aggregate":return{kind:"aggregate",aggregate:Ns(F(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:he(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:D(e.value)};case"named":return{kind:"named",id:D(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:D(e.layer).toUpperCase(),stat:ft.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new Te(`unknown value kind ${String(e.kind)}`)}}function ie(e){if(!F(e))throw new Te("value must be an object");if(F(e.kind)){let i={kind:Na(e.kind)},a=Oa(e.format);return a&&(i.format=a),i}let n={kind:Na(e)},t=Oa(e.format);return t&&(n.format=t),n}function er(e){return F(e)?{x:O(e.x,.25),y:O(e.y,.25),width:O(e.width,.5),height:O(e.height,.5),rotationDegrees:O(e.rotationDegrees,0)}:{...ja}}function Ds(e){if(!F(e))return{kind:"isOn"};let n=D(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=F(e.value)?ie(e.value):M("");break;case"between":t.value=F(e.value)?ie(e.value):M(""),t.upper=F(e.upper)?ie(e.upper):M("");break;case"matchesRegex":t.pattern=D(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Da(e){if(!F(e))return{kind:"show"};let n=D(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=F(e.value)?ie(e.value):M("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=O(e.number,0);break;case"setFontWeight":t.weight=he(e.weight)??"regular";break;default:break}return t}function tr(e){return Array.isArray(e)?e.filter(F).map(n=>{let t={id:D(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(F).map(i=>{let a=F(i.when)?i.when:{};return{id:D(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(F).map(r=>({id:D(r.id).toUpperCase(),value:F(r.value)?ie(r.value):M(""),comparison:Ds(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Da)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Da)),t}):[]}function Vs(e,n){return{baseColorHex:F(e)?D(e.baseColorHex,n):n}}function Bs(e){if(Array.isArray(e.bands))return e.bands.filter(F).map(t=>({id:D(t.id,q()),upTo:O(t.upTo,0),colorHex:D(t.colorHex,"#FFFFFF")}));if(typeof e.bandLowerBound!="number")return[];let n=F(e.colorSlot)?D(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:q(),upTo:e.bandLowerBound,colorHex:D(e.bandLowColorHex,ti)},{id:q(),upTo:O(e.bandUpperBound,100),colorHex:n}]}function Ze(e,n){if(typeof e.id!="string")throw new Te("element id is required");return{id:e.id.toUpperCase(),colorSlot:Vs(e.colorSlot,n),rules:tr(e.rules),frame:er(e.frame),isHidden:e.isHidden===!0}}function Gs(e){let n=Us(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),n}function Us(e){if(!F(e)||!F(e.payload))throw new Te("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...Ze(n,"#FFFFFF"),value:F(n.value)?ie(n.value):M(""),fontSize:O(n.fontSize,14),fontWeight:he(n.fontWeight)??"regular"};return n.countdown===!0&&(t.countdown=!0),{kind:"text",payload:t}}case"icon":return{kind:"icon",payload:{...Ze(n,"#FFFFFF"),symbol:F(n.symbol)?ie(n.symbol):M("lightbulb"),size:O(n.size,14)}};case"gauge":return{kind:"gauge",payload:{...Ze(n,"#FFFFFF"),value:F(n.value)?ie(n.value):M("50"),minValue:O(n.minValue,0),maxValue:O(n.maxValue,100),style:he(n.style)??"arc",lineWidth:O(n.lineWidth,4),trackColorHex:D(n.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...Ze(n,"#FFFFFF"),value:F(n.value)?ie(n.value):M("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(O(n.historyMinutes,0))),historyPoints:Math.round(O(n.historyPoints,24)),style:he(n.style)??"bars",limit:Math.max(0,Math.round(O(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:he(n.scale)??"auto",minValue:O(n.minValue,0),maxValue:O(n.maxValue,100),baseline:he(n.baseline)??"lowest",barGap:O(n.barGap,1.5),lineWidth:O(n.lineWidth,2),highlight:he(n.highlight)??"none",highColorHex:D(n.highColorHex,dn),lowColorHex:D(n.lowColorHex,cn),marker:he(n.marker)??"pointer",coloring:he(n.coloring)??"uniform",bands:Bs(n),bandAboveColorHex:D(n.bandHighColorHex,D(n.bandAboveColorHex,pn)),fillBands:n.fillBands===!0}};case"shape":{let t={...Ze(n,"#FFFFFF33"),kind:he(n.kind)??"roundedRectangle",cornerRadius:O(n.cornerRadius,6),borderWidth:O(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF"),a={...i,entity:Qe(F(n.entity)?n.entity:{}),contentMode:n.contentMode==="fit"?"fit":"fill",zoom:O(n.zoom,1),panX:O(n.panX,0),panY:O(n.panY,0),cornerRadius:O(n.cornerRadius,zt),timestampCorner:Os.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:O(n.timestampSize,Pt)};n.timestamp===!0&&(a.timestamp=!0);let r=sn(n.timestampX),o=sn(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=Ee(r),a.timestampY=Ee(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=Ze(n,"#FFFFFF"),a={...i,action:F(n.action)?nr(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new Te(`unknown element kind ${String(e.kind)}`)}}function Va(e){let n=F(e)?e:{},t={};if(F(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!F(r))continue;let o={frame:er(r.frame),isHidden:r.isHidden===!0},l=sn(r.size);l!==void 0&&(o.size=l),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:O(n.borderWidth,2),rules:tr(n.rules)};if(F(n.bezelText)&&(i.bezelText=ie(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),F(n.curvedText)&&(i.curvedText=ie(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),F(n.bezelGauge)){let a=n.bezelGauge,r={value:F(a.value)?ie(a.value):M("50"),minValue:O(a.minValue,0),maxValue:O(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};F(a.minLabel)&&(r.minLabel=ie(a.minLabel)),F(a.maxLabel)&&(r.maxLabel=ie(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function Ks(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Va(e[t+1]))}else if(F(e))for(let[t,i]of Object.entries(e))n[t]=Va(i);return n}function Ws(e){let n={value:F(e.value)?ie(e.value):M("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function nr(e){if(!F(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Qe(e)};default:return{type:"none"}}}function ir(e){if(!F(e))throw new Te("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Te(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(F).map(r=>({id:D(r.id).toUpperCase(),name:D(r.name),value:F(r.value)?ie(r.value):M("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(F).map(r=>r.kind==="template"?{kind:"template",value:D(r.value)}:r.kind==="entity"?{kind:"entity",...Qe(r)}:null).filter(r=>r!==null),i={schemaVersion:O(e.schemaVersion,1),id:D(e.id).toUpperCase(),name:D(e.name,"Custom"),values:n,slotIndex:O(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Gs),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Ks(e.perFamily),dataSources:t,tapAction:nr(e.tapAction)};F(e.inline)&&(i.inline=Ws(e.inline));let a=sn(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(F).filter(o=>typeof o.id=="string").map(o=>({id:D(o.id).toUpperCase(),name:D(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return qs(i,Array.isArray(e.elements)?e.elements:[]),ze(i),i}function di(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Ot(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function js(e,n){let t=ln(e,Dt(n))?.ref;return t?.displayName||t?.entityId||"Chart"}function ar(e,n,t){let i=Le(e,n.payload.id);if(i){pi(e,t,i.id);return}ci(e,[n.payload.id,t],js(e,n))}var rr={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1}};function or(e,n,t,i){let a=me.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),l=e.x+n.x*e.width-n.x*r,s=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,l)),y:Math.max(0,Math.min(1-o,s)),width:r,height:o,rotationDegrees:0}}function sr(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=Ge("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};t==="latest"&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"},a.payload.frame=or(i.payload.frame,rr[t],r,t==="latest"?7:4);let l=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(l+1,0,a),ar(e,i,a.payload.id),a.payload.id}function qs(e,n){for(let t of n){if(!F(t)||t.kind!=="chart"||!F(t.payload))continue;let i=t.payload,a=D(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=D(i.scaleLabelColorHex,"#FFFFFF99"),l=h=>{let g=F(h)?h:{};return{fontSize:O(g.fontSize,8),colorHex:D(g.colorHex,o),pillColorHex:typeof g.pillColorHex=="string"?g.pillColorHex:void 0}},s=[],d=he(i.scaleLabels);(d==="top"||d==="range")&&s.push(["top",l(i.topLabelStyle)]),d==="range"&&s.push(["bottom",l(i.bottomLabelStyle)]);let p=he(i.latestLabel);if((p==="corner"||p==="end")&&s.push(["latest",l(i.latestLabelStyle)]),s.length===0)continue;let c=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,g]of s){let y=or(r.payload.frame,rr[h],g.fontSize,h==="latest"?5:4),k=[];if(g.pillColorHex!==void 0){let E=Ge("shape");E.payload.kind="capsule",E.payload.colorSlot={baseColorHex:g.pillColorHex},E.payload.frame={...y},k.push(E)}let w=Ge("text");w.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},w.payload.fontSize=g.fontSize,w.payload.fontWeight="medium",w.payload.colorSlot={baseColorHex:g.colorHex},w.payload.frame=y,k.push(w),e.elements.splice(c,0,...k),c+=k.length;for(let E of k)ar(e,r,E.payload.id)}}}function U(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function et(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Ys(e){let n={};return e.decimals!==void 0&&(n.decimals=U(e.decimals)),e.multiply!==void 0&&(n.multiply=U(e.multiply)),e.offset!==void 0&&(n.offset=U(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function Js(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(et)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Xs(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...et(e)};case"entityAttribute":return{kind:"entityAttribute",...et(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...et(e)};case"aggregate":return{kind:"aggregate",aggregate:Js(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function Q(e){let n={kind:Xs(e.kind)};return Fe(e.format)||(n.format=Ys(e.format)),n}function rn(e){return{x:U(e.x),y:U(e.y),width:U(e.width),height:U(e.height),rotationDegrees:U(e.rotationDegrees)}}function Zs(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=Q(e.value??M(""));break;case"between":n.value=Q(e.value??M("")),n.upper=Q(e.upper??M(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function Ba(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=Q(e.value??M(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=U(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function on(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:Q(a.value),comparison:Zs(a.comparison)}))},then:i.then.map(Ba)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(Ba)),t})}function Qs(e){let n=el(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),n}function el(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:on(t.rules),frame:rn(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:Q(e.payload.value),fontSize:U(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(t.countdown=!0),{kind:"text",payload:t}}case"icon":return{kind:"icon",payload:{...n(e.payload),symbol:Q(e.payload.symbol),size:U(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...n(e.payload),value:Q(e.payload.value),minValue:U(e.payload.minValue),maxValue:U(e.payload.maxValue),style:e.payload.style,lineWidth:U(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...n(e.payload),value:Q(e.payload.value),historyMinutes:Math.max(0,Math.round(e.payload.historyMinutes)),historyPoints:Math.round(e.payload.historyPoints),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:U(e.payload.minValue),maxValue:U(e.payload.maxValue),baseline:e.payload.baseline,barGap:U(e.payload.barGap),lineWidth:U(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker,coloring:e.payload.coloring,bands:e.payload.bands.map(t=>({id:t.id,upTo:U(t.upTo),colorHex:t.colorHex})),bandAboveColorHex:e.payload.bandAboveColorHex,fillBands:e.payload.fillBands}};case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:U(e.payload.cornerRadius),borderWidth:U(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:et(t.entity),rules:on(t.rules),frame:rn(t.frame),isHidden:t.isHidden};t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=U(t.zoom)),t.panX!==0&&(i.panX=U(t.panX)),t.panY!==0&&(i.panY=U(t.panY)),t.cornerRadius!==zt&&(i.cornerRadius=U(t.cornerRadius));let a=Ae(t),r=a?oi(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==Pt&&(i.timestampSize=U(t.timestampSize)),a&&(i.timestampX=U(t.timestampX),i.timestampY=U(t.timestampY)),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:lr(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=on(t.rules),i.frame=rn(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}}}function tl(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:rn(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=U(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=Q(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=Q(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:Q(i.value),minValue:U(i.minValue),maxValue:U(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=Q(i.minLabel)),i.maxLabel&&(a.maxLabel=Q(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=U(e.borderWidth),e.rules.length>0&&(n.rules=on(e.rules)),n}function lr(e){return"entityId"in e?{type:e.type,...et(e)}:{type:e.type}}function nl(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=Q(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function hn(e){let n=[];for(let i of Z){let a=e.perFamily[i];a&&n.push(i,tl(a))}let t={schemaVersion:_t(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:Q(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Qs),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...et(i)}),tapAction:lr(e.tapAction)};return e.inline!==void 0&&(t.inline=nl(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),t}function Le(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function _e(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!se(e,t))}function ze(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function yt(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!se(e,r)),t=e.elements.filter(r=>se(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=n.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...t],Ue(e)}function ci(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!se(e,r));if(i.length<2)return;let a={id:q(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return ze(e),yt(e),a.id}function Nt(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;ze(e)}function pi(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||se(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,ze(e),yt(e))}var G={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},Ga={literal:["kind","value"],entityState:["kind",...G.entityRef],entityAttribute:["kind",...G.entityRef,"attribute"],entityAge:["kind",...G.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function dr(e){let n=[],t=(s,d,p)=>{if(F(s))for(let c of Object.keys(s))d.includes(c)||n.push(`${p}.${c}`)},i=(s,d)=>{if(!F(s))return;let p=typeof s.kind=="string"?s.kind:"";t(s,Ga[p]??["kind"],d),p==="aggregate"&&F(s.aggregate)&&(t(s.aggregate,G.aggregate,`${d}.aggregate`),t(s.aggregate.scope,G.scope,`${d}.aggregate.scope`),F(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((c,h)=>t(c,G.entityRef,`${d}.aggregate.scope.entities[${h}]`)),t(s.aggregate.stateFilter,G.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(F(s)){if(F(s.kind))t(s,G.value,d),i(s.kind,`${d}.kind`);else{let p=typeof s.kind=="string"?s.kind:"";t(s,[...Ga[p]??["kind"],"format"],d),p==="aggregate"&&i(s,d)}t(s.format,G.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((p,c)=>{t(p,G.styleChange,`${d}[${c}]`),F(p)&&a(p.value,`${d}[${c}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((p,c)=>{let h=`${d}[${c}]`;t(p,G.rule,h),F(p)&&(Array.isArray(p.cases)&&p.cases.forEach((g,y)=>{let k=`${h}.cases[${y}]`;t(g,G.case,k),F(g)&&(t(g.when,G.condition,`${k}.when`),F(g.when)&&Array.isArray(g.when.tests)&&g.when.tests.forEach((w,E)=>{let R=`${k}.when.tests[${E}]`;t(w,G.test,R),F(w)&&(a(w.value,`${R}.value`),t(w.comparison,G.comparison,`${R}.comparison`),F(w.comparison)&&(a(w.comparison.value,`${R}.comparison.value`),a(w.comparison.upper,`${R}.comparison.upper`)))}),r(g.then,`${k}.then`))}),r(p.otherwise,`${h}.otherwise`))})};if(!F(e))return n;t(e,G.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>t(s,G.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{t(s,G.named,`$.values[${d}]`),F(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let p=`$.elements[${d}]`;if(t(s,G.elementEnvelope,p),!F(s)||!F(s.payload))return;let c=typeof s.kind=="string"?s.kind:"",h=G[c]??[];t(s.payload,[...G.elementBase,...h],`${p}.payload`),t(s.payload.colorSlot,G.colorSlot,`${p}.payload.colorSlot`),t(s.payload.frame,G.frame,`${p}.payload.frame`),o(s.payload.rules,`${p}.payload.rules`);for(let g of["value","symbol"])g in s.payload&&a(s.payload[g],`${p}.payload.${g}`);c==="image"&&t(s.payload.entity,G.entityRef,`${p}.payload.entity`),c==="tap"&&t(s.payload.action,G.tapAction,`${p}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else F(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let p=`$.perFamily.${s}`;if(t(d,G.layout,p),!!F(d)){if(F(d.placements))for(let[c,h]of Object.entries(d.placements))t(h,G.placement,`${p}.placements.${c}`),F(h)&&t(h.frame,G.frame,`${p}.placements.${c}.frame`);if(a(d.bezelText,`${p}.bezelText`),a(d.curvedText,`${p}.curvedText`),F(d.bezelGauge)){let c=`${p}.bezelGauge`;t(d.bezelGauge,G.bezelGauge,c),a(d.bezelGauge.value,`${c}.value`),a(d.bezelGauge.minLabel,`${c}.minLabel`),a(d.bezelGauge.maxLabel,`${c}.maxLabel`)}o(d.rules,`${p}.rules`)}}return F(e.inline)&&(t(e.inline,G.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>t(s,G.dataSource,`$.dataSources[${d}]`)),t(e.tapAction,G.tapAction,"$.tapAction"),n}function q(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function ui(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function cr(e,n,t=[...Z]){let i={};for(let r of Z)t.includes(r)&&(i[r]=ui());let a={schemaVersion:4,id:q(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:Ps.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:M("Text")}),a.schemaVersion=_t(a),a}function Ge(e){let n=t=>({id:q(),colorSlot:{baseColorHex:t},rules:[],frame:{...ja},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:M("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:M("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:M("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:M("13,14,16,17,19,22,24,28,30"),historyMinutes:0,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:dn,lowColorHex:cn,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:pn,fillBands:!1}};case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:zt,timestampCorner:"topLeading",timestampSize:Pt}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function M(e){return{kind:{kind:"literal",value:e}}}function pr(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Dt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function hi(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var mi=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function ln(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=di(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function fi(e,n){return ln(e,Dt(n))?.ref}function gi(e,n){let t=fi(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&mi.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function Ua(e,n,t){if(un(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,l=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=Ee(a),r=Ee(r),o=Ee(o),l=Ee(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function ur(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function hr(e,n,t,i){let a=e.elements.find(h=>h.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,l=Ee(i.x),s=Ee(i.y),d=Ee(i.x+i.width),p=Ee(i.y+i.height),c={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,p-s)};a.payload.outset=ur(o,c,me[t])}function mr(e,n,t){let i=e.elements.find(l=>l.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=me[t];return{width:r.width*o.width,height:r.height*o.height}}function we(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function se(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function yi(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function Ue(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=t.get(r);l?l.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=ur(o.payload.frame,s.frame,me.rectangular));let d=s.outset,p=!un(d);l.payload.frame=Ua(o.payload.frame,d,me.rectangular),l.payload.isHidden=o.payload.isHidden;for(let c of Z){let h=e.perFamily[c];if(!h)continue;let g=me[c],y=h.placements[a];if(p){let k=y?.frame??o.payload.frame,w=y?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:Ua(k,d,g),isHidden:w}}else y?h.placements[l.payload.id]={frame:{...y.frame},isHidden:y.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function mn(e,n,t){let i=e.elements.find(l=>l.payload.id===n);if(!i||i.kind==="tap")return;let a=we(e,n)[0];if(a)return a.payload;let r=Ge("tap"),o=r.payload;return o.attachedTo=n,o.outset={...si},o.action=t??gi(e,i),e.elements.push(r),Ue(e),o}function bi(e,n){let t=we(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of Z)for(let a of t)delete e.perFamily[i]?.placements[a]}}function fn(e,n){for(let t of Ot(e,n))fn(e,t.payload.id);bi(e,n),e.elements=e.elements.filter(t=>t.payload.id!==n);for(let t of Z)delete e.perFamily[t]?.placements[n];Ue(e),ze(e)}function fr(e,n){let t=e.elements.findIndex(s=>s.payload.id===n),i=e.elements[t];if(!i)return;let a=q(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[n,a]];for(let s of we(e,n)){let d=structuredClone(s);d.payload.id=q(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let s of Z){let d=e.perFamily[s];if(d)for(let[p,c]of l){let h=d.placements[p];h&&(d.placements[c]=structuredClone(h))}}return Ue(e),a}function vi(e,n){let t=new Set,i=s=>{t.add(s);for(let d of we(e,s))t.add(d.payload.id)};for(let s of n){i(s);for(let d of Ot(e,s))i(d.payload.id)}let a=e.elements.filter(s=>t.has(s.payload.id)).map(s=>structuredClone(s)),r={};for(let s of Z){let d=e.perFamily[s];if(!d)continue;let p={};for(let c of a){let h=d.placements[c.payload.id];h&&(p[c.payload.id]=structuredClone(h))}Object.keys(p).length>0&&(r[s]=p)}let o=new Set(a.map(s=>s.payload.groupId).filter(s=>s!==void 0)),l=(e.groups??[]).filter(s=>o.has(s.id)).map(s=>structuredClone(s));return{elements:a,placements:r,groups:l}}function xi(e,n){let t=new Map;for(let s of n.elements)t.set(s.payload.id,q());let i=new Set(e.elements.map(s=>s.payload.id)),a=n.elements.some(s=>i.has(s.payload.id)),r=s=>a?{...s,x:Math.min(.9,s.x+.05),y:Math.min(.9,s.y+.05)}:s,o=[];for(let s of n.elements){let d=structuredClone(s);if(d.payload.id=t.get(s.payload.id),d.kind==="tap"&&d.payload.attachedTo!==void 0){let p=t.get(d.payload.attachedTo);p?d.payload.attachedTo=p:delete d.payload.attachedTo}if(d.kind==="text"&&d.payload.value.kind.kind==="chartStat"){let p=t.get(d.payload.value.kind.layer);if(p)d.payload.value.kind.layer=p;else if(!i.has(d.payload.value.kind.layer))continue}d.payload.frame=r(d.payload.frame),o.push(d)}let l=new Map;for(let s of n.groups){if(o.filter(c=>c.payload.groupId===s.id&&!(c.kind==="tap"&&c.payload.attachedTo!==void 0)).length<2)continue;let p=q();l.set(s.id,p),(e.groups??=[]).push({...structuredClone(s),id:p})}for(let s of o){if(s.payload.groupId===void 0)continue;let d=l.get(s.payload.groupId);d?s.payload.groupId=d:delete s.payload.groupId}e.elements.push(...o);for(let s of Z){let d=n.placements[s],p=e.perFamily[s];if(!(!d||!p))for(let[c,h]of Object.entries(d)){let g=t.get(c);g&&o.some(y=>y.payload.id===g)&&(p.placements[g]={...structuredClone(h),frame:r(h.frame)})}}return Ue(e),ze(e),yt(e),o.filter(s=>!se(e,s)).map(s=>s.payload.id)}function gn(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=ln(e,Dt(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of we(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=ln(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function Ka(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function gr(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||t.entityId==="")return;let a={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=Ka(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=Ka(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of we(e,n)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var yn={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},yr=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function nt(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function bn(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function wi(){return{id:q(),value:M(""),comparison:{kind:"isOn"}}}function ki(){return{id:q(),when:{join:"all",tests:[wi()]},then:[]}}function Vt(){return{id:q(),cases:[ki()]}}function $i(e,n){let t={kind:n};switch(nt(n)){case"value":t.value=e.value??M("");break;case"between":t.value=e.value??M(""),t.upper=e.upper??M("");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function it(e){let n={kind:e};switch(bn(e)){case"value":n.value=M(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}function br(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function vr(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function wr(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function kr(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function xr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Si(e,n,t=0){let i=n instanceof Map?n:kr(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Si(o,i,t+1):xr(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!xr(a))return;let r=Ci(a);if(r!==void 0)return"e_"+wr(r)}function $e(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function il(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>$e(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))n=o.length===0?"[]":"("+o.map(c=>`(states.${c} | list)`).join(" + ")+")";else{let c=[];for(let h of l)c.push(`area_entities(${$e(h)})`);for(let h of s)c.push(`label_entities(${$e(h)})`);d.length>0&&c.push(`((${d.map(h=>`floor_areas(${$e(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${c.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map($e).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${$e(i.value)})`:t+=` | rejectattr('state', 'eq', ${$e(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${$e(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function Ci(e){switch(e.kind){case"entityAttribute":return`state_attr(${$e(e.entityId)}, ${$e(e.attribute)})`;case"entityAge":{let n=$e(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return il(e.aggregate);default:return}}function Ei(e){let n=new Map,t=new Map,i=kr(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let p=Ci(d.kind);if(p===void 0)return;t.set("n_"+s.id.toLowerCase().replace(/-/g,""),p);return}default:{let d=Ci(s);if(d===void 0)return;t.set("e_"+wr(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Dt(o);l&&a(l);for(let s of hi(o.payload.rules))a(s)}for(let o of Z){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of hi(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=al(t)),r}function al(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function $r(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,rl(r));return{values:t,nullKeys:i}}function rl(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Ti(e){let n=Ei(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function ol(e,n){if(e.values.length!==0)switch(n){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((t,i)=>t+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin}}function vn(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function bt(e){let n=e.trim(),t=vn(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:vn(i)}function sl(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function ll(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function dl(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function cl(e,n,t){if(Fe(n))return e;let i=n,a=e,r=vn(e.trim());if(i.relativeTime&&r!==void 0)a=ll(r);else{let o=bt(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):sl(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=dl(a);break}return a}function vt(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Bt(e,n=240){let t=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&t.push(o)}i=""};for(let o of e){if(t.length>=n)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let l=!a;r(),l&&(i+=o),a=!1}else r(),a=!1}return t.length<n&&r(),t}function pl(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function ul(e,n,t){if(e===void 0)return 0;let i=bt(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var Pe=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let t=tt(n),i=t!==void 0?this.ctx.historySeries?.get(t)??"":this.resolve(n.value)??"",a=Bt(i);n.limit>0&&a.length>n.limit&&(a=n.takeFromEnd?a.slice(a.length-n.limit):a.slice(0,n.limit));let r=pl(a,n),o={values:a,domainMin:r.min,domainMax:r.max},l=this.dereference(n.value);return l&&"entityId"in l.kind&&(o.entity={entityId:l.kind.entityId,displayName:l.kind.displayName,domain:l.kind.domain}),o}settleCharts(n){for(let t of n.elements)t.kind==="chart"&&this.charts.set(t.payload.id,this.chartReadings(t.payload))}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!Fe(a)?a:l.format,t=l}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?ol(a,t.kind.stat):void 0;i=a&&r!==void 0?Ja(r,a.domainMax-a.domainMin):void 0;break}default:{let a=Si(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return cl(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=vn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?vt(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=bt(i),r=()=>this.resolve(t.value),o=()=>{let s=r();return s===void 0?void 0:bt(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(t.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(t.upper),p=d===void 0?void 0:bt(d);if(a===void 0||s===void 0||p===void 0)return!1;let[c,h]=s<=p?[s,p]:[p,s];return a>=c&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(fe[l.kind],l)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveElement(n,t){let i=n.payload,a=this.applyRules(i.rules,t),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,p={id:i.id,isHidden:o,frame:s,opacity:d};switch(n.kind){case"text":{let c=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,h=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,g={kind:"text",...p,text:this.styleText(a,"text")??h??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??n.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex};return c!==void 0&&(g.countdownEnd=c),g}case"icon":{let c=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle";return{kind:"icon",...p,symbol:this.styleText(a,"icon")??c,size:this.styleNumber(a,"fontSize")??n.payload.size,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex}}case"gauge":{let c=this.styleText(a,"gaugeValue")??this.resolve(n.payload.value),h=this.styleNumber(a,"gaugeMin")??n.payload.minValue,g=this.styleNumber(a,"gaugeMax")??n.payload.maxValue;return{kind:"gauge",...p,fraction:ul(c,h,g),style:n.payload.style,lineWidth:n.payload.lineWidth,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,trackColorHex:n.payload.trackColorHex}}case"chart":{let c=n.payload,h=this.charts.get(c.id)??this.chartReadings(c),g=h.values,y={min:h.domainMin,max:h.domainMax},k=this.styleColor(a,"color")??c.colorSlot.baseColorHex,w=gt(c),E=qa(c)?g.map(m=>Ya(m,w,c.bandAboveColorHex)):[],R={kind:"chart",...p,values:g,style:c.style,domainMin:y.min,domainMax:y.max,baseline:c.baseline,barGap:c.barGap,lineWidth:c.lineWidth,colorHex:k,highColorHex:c.highColorHex,lowColorHex:c.lowColorHex,marker:c.marker,pointColorHexes:E,fillBands:c.fillBands};if(g.length>0){let m=c.highlight==="highest"||c.highlight==="both",b=c.highlight==="lowest"||c.highlight==="both",$=m?g.indexOf(Math.max(...g)):-1,_=b?g.indexOf(Math.min(...g)):-1;$>=0&&(R.highIndex=$),_>=0&&_!==$&&(R.lowIndex=_)}return R}case"shape":{let c={kind:"shape",...p,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??n.payload.borderWidth},h=this.styleColor(a,"borderColor")??n.payload.borderColorHex;return h!==void 0&&(c.borderColorHex=h),c}case"image":{let c={kind:"image",...p,entityId:n.payload.entity.entityId,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};Ae(n.payload)&&(c.timestampX=n.payload.timestampX,c.timestampY=n.payload.timestampY);let h=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return h!==void 0&&(c.url=h),c}case"tap":{let c={kind:"tap",...p,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(c.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(c.attachedTo=n.payload.attachedTo),c}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=pr(n,t).map(k=>this.resolveElement(k,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:t,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,p=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,c=s??p??this.resolve(a?.bezelText);c!==void 0&&(l.bezelText=c),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let k=a.bezelGauge,w=this.resolve(k.value),E=w===void 0?void 0:bt(w);if(E!==void 0){let R=Math.min(k.minValue,k.maxValue),m=Math.max(k.minValue,k.maxValue),b={value:Math.min(m,Math.max(R,E)),minValue:R,maxValue:m===R?R+1:m,colorHexes:k.colorHexes},$=this.resolve(k.minLabel);$!==void 0&&(b.minLabel=$);let _=this.resolve(k.maxLabel);_!==void 0&&(b.maxLabel=_),l.bezelGauge=b}}let g=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;g!==void 0&&(l.backgroundColorHex=g);let y=this.styleColor(o,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function hl(e,n,t){let i=new Pe(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Fi(e,n,t){let i=new Pe(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=hl(e.inline,n,e)),a}var pe=me,Gt=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:pe,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Ut=Gt.find(e=>e.measured);function Ar(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Gt.find(a=>a.screen.width===t&&a.screen.height===i)}function wn(e,n){let t=pe[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var ml={regular:400,medium:500,semibold:600,bold:700};function Re(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function Oe(e,n,t="#FFFFFF"){let i=Re(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function Hr(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}function fl(e,n){let t=Oe(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:vt((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,l=e.text;if(n.w>0&&l.length*i(o)>n.w){let s=n.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return v`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${ml[e.fontWeight]??400}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${l}</text>`}function gl(e,n){let t=Oe(e.colorHex,"stroke"),i=Oe(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=n.w,g=Math.max(a,h*e.fraction);return v`
      <rect x=${n.x} y=${n.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-a/2} width=${g} height=${a} rx=${a/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />`}let r=Math.min(n.w,n.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,p=l*s,c=l*s*e.fraction;return v`
    <g transform="rotate(${d} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${p} ${l}" />
      ${e.fraction>0?v`<circle cx=${n.cx} cy=${n.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${c} ${l}" />`:f}
    </g>`}var yl=5;function bl(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:yl,o=e.style==="bars"?0:e.lineWidth/2,l=n.x,s=Math.max(n.w,0),d=n.y+r+o,p=Math.max(n.h-r-o*2,1),c=d+p,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),g=e.baseline==="lowest",y=g?p*.12:0,k=Math.min(Math.max(e.barGap,0),s/(i*2)),w=Math.max((s-k*(i-1))/i,.5),E=m=>Math.min(1,Math.max(0,(m-e.domainMin)/h)),R=m=>c-E(m)*p;return{count:t.length,barWidth:w,plotTop:d,plotBottom:c,baselineY:g?c:R(0),barRect(m){let b=l+m*(w+k),$=t[m],_,N;if(g){let X=y+E($)*(p-y);_=c-X,N=c}else _=R($),N=g?c:R(0),_>N&&([_,N]=[N,_]);return{x:b,y:_,w,h:Math.max(N-_,.5)}},point(m){let b=Math.max(s-o*2,0);return{x:t.length>1?l+o+b*m/(t.length-1):l+s/2,y:R(t[m])}},markerCenter(m,b){let $=b?this.barRect(m):void 0;return{x:$?$.x+$.w/2:this.point(m).x,y:n.y+r/2}}}}function vl(e,n){if(e.values.length===0)return f;let t=bl(e,n),i=Oe(e.colorHex,"fill"),a=Oe(e.highColorHex,"fill",e.colorHex),r=Oe(e.lowColorHex,"fill",e.colorHex),o=(p,c)=>v`<circle cx=${p.x} cy=${p.y} r="1.7" fill=${c.fill} fill-opacity=${c["fill-opacity"]} />`,l=[],s=e.pointColorHexes.length===t.count,d=p=>s?Oe(e.pointColorHexes[p],"fill",e.colorHex):i;if(e.style==="bars")for(let p=0;p<t.count;p++){let c=t.barRect(p),h=p===e.highIndex?a:p===e.lowIndex?r:d(p),g=Math.min(1.2,c.w/2,c.h/2);l.push(v`<rect x=${c.x} y=${c.y} width=${c.w} height=${c.h} rx=${g}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let p=Array.from({length:t.count},(h,g)=>t.point(g)),c=p.map((h,g)=>`${g===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&s&&t.count>1)for(let h=0;h<t.count-1;h++){let g=p[h],y=p[h+1],k=d(h+1),w=`M${g.x} ${g.y} L${y.x} ${y.y} L${y.x} ${t.baselineY} L${g.x} ${t.baselineY} Z`;l.push(v`<path d=${w} fill=${k.fill}
            fill-opacity=${k["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${c} L${p[p.length-1].x} ${t.baselineY} L${p[0].x} ${t.baselineY} Z`;l.push(v`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(s&&t.count>1)for(let h=0;h<t.count-1;h++){let g=p[h],y=p[h+1],k=d(h+1);l.push(v`<path d=${`M${g.x} ${g.y} L${y.x} ${y.y}`} fill="none"
          stroke=${k.fill} stroke-opacity=${k["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(v`<path d=${c} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(o(p[e.highIndex],a)),e.lowIndex!==void 0&&l.push(o(p[e.lowIndex],r))}if(e.marker!=="none"){let p=e.style==="bars";if(e.highIndex!==void 0){let c=t.markerCenter(e.highIndex,p);l.push(e.marker==="pointer"?v`<path d=${`M${c.x} ${c.y-1.8} L${c.x+2.2} ${c.y+1.8} L${c.x-2.2} ${c.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(c,a))}e.lowIndex!==void 0&&l.push(o(t.markerCenter(e.lowIndex,p),r))}return v`${l}`}function xl(e,n){let t=Oe(e.fillColorHex,"fill"),i=e.borderColorHex?Re(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",l=i?i.opacity:0;switch(e.shapeKind){case"circle":{let s=Math.min(n.w,n.h)/2-r;return v`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,s)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"capsule":{let s=Math.min(n.w,n.h)/2;return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${s}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"roundedRectangle":return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`;case"rectangle":return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}}function wl(e,n,t){let i=t.render(e.symbol,e.size,e.colorHex);if(i)return v`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=Oe(e.colorHex,"stroke"),r=e.size;return v`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var Li=.25,kl=8;function $l(e,n,t,i,a,r,o,l){let s={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,Li),kl),p=Math.max(e/t,n/i),c=Math.min(e/t,n/i),h=(a==="fit"?c:p)*d,g=t*h,y=i*h,k=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),w=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(g-e)/2*(1+k)+0,y:-(y-n)/2*(1+w)+0,width:g,height:y}}function kn(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var xn=4;function $n(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?n.x+xn:n.x+n.w-xn-a,d=e.timestampCorner.startsWith("top")?n.y+xn:n.y+n.h-xn-r;return{x:s,y:d,w:a,h:r,size:i,label:t}}let l=(s,d,p,c)=>c>=p?d+(p-c)/2:Math.min(d+p-c,Math.max(d,s-c/2));return{x:l(n.x+e.timestampX*n.w,n.x,n.w,a),y:l(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Cl(e,n,t){let i=t.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?$n(e,n,kn(new Date)):void 0,l=o?v`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,s=3,d=o&&t.timestampActiveId===e.id?v`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,g,y])=>v`<rect data-ts-corner=${h} x=${g-s/2} y=${y-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:f,p=e.url?t.imageSizes?.size(e.url):void 0,c;if(e.url&&p){let h=$l(n.w,n.h,p.width,p.height,e.contentMode,e.zoom,e.panX,e.panY);c=v`<image href=${e.url} x=${n.x+h.x} y=${n.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?c=v`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:c=v`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??f}</g>`;return v`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${l}</g>${d}`}function Sl(e,n,t,i,a){if(!i)return f;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?El(a,n):void 0;return v`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?v`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${Ii} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?v`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var Ii=5;function El(e,n){let t=Ii*.55,i=n.w-2;if(n.h<Ii*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Mi(e,n,t){if(e.isHidden&&!t.showHidden)return f;let i=t.tapReview===!0,a=t.tapAreas===!0||i,r=i?t.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return f;let s=Hr(e,n),d=i&&(!l||o),p;switch(e.kind){case"text":p=fl(e,s);break;case"icon":p=wl(e,s,t.icons);break;case"gauge":p=gl(e,s);break;case"chart":p=vl(e,s);break;case"shape":p=xl(e,s);break;case"image":p=Cl(e,s,t);break;case"tap":p=Sl(e,s,t.icons,a,d?He(e.action):void 0);break}let c=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*c,g=t.highlightId===e.id,y=g||t.highlightIds?.includes(e.id)===!0,k=t.handles===!0&&(!l||o),w=y?v`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,E=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?v`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,R=v`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,m=3,b=g&&k?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([$,_,N])=>v`<rect data-handle=${$} x=${_-m/2} y=${N-m/2} width=${m} height=${m}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${$}-resize" />`):f;return v`<g data-element-id=${e.id} opacity=${h} style=${k?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${R}${p}${E}${w}${b}</g>`}function Cn(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function _i(e,n){return(n?23.5:34)*e}var Cr=10.5;function Lr(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Sr(e,n){let t=0;for(let i of e)t+=Lr(i,n);return t}function Er(e,n,t){let i=e.toUpperCase(),a=d=>Lr(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>n)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function Ai(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function Hi(e,n,t,i){let a=Ai(e,n,t),r=Ai(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function _r(e,n,t,i){let{dial:a}=Cn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:Hi(a,t,i.start,i.end),length:t*r}}function Tl(e,n){let t=Cn(e,!0);return _r(e,n,t.dial.r,t.labelArc)}var Tr=18.5,Fl=113,Rl={start:-71,end:-36},Fr=104,Il=6.2,Rr={start:-77,end:-30.5};function Ir(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Mr(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Ir(e[i]),o=Ir(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var Ri=11;function Ml(e,n,t){let{dial:i}=Cn(n,!0),a=Fr*n,r=180/(Math.PI*Fr),o=e.minLabel!==void 0?Sr(e.minLabel,Ri)*r:0,l=e.maxLabel!==void 0?Sr(e.maxLabel,Ri)*r:0,s=Rr.start+(o>0?Math.max(0,o-1.8):0),d=Rr.end-(l>0?Math.max(0,l-1.8):0),p=d-s,c=24,h=[];for(let E=0;E<c;E++){let R=s+p*E/c,m=Math.min(d,s+p*(E+1)/c+.4);h.push(v`<path d=${Hi(i,a,R,m)} fill="none"
      stroke=${Mr(e.colorHexes,(E+.5)/c)} stroke-width=${Il*n}
      stroke-linecap=${E===0||E===c-1?"round":"butt"} />`)}let g=(e.value-e.minValue)/(e.maxValue-e.minValue),y=Ai(i,a,s+p*g),k=1.5,w=(E,R,m,b)=>v`
    <defs><path id=${E} d=${Hi(i,a,R,m)} /></defs>
    <text font-size=${Ri*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${E}" startOffset="50%" text-anchor="middle">${b}</textPath></text>`;return v`${h}
    <circle cx=${y.x} cy=${y.y} r=${3.2*n} fill=${Mr(e.colorHexes,g)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?w(`${t}-gmin`,s-k-Math.max(o,3),s-k,e.minLabel):f}
    ${e.maxLabel!==void 0?w(`${t}-gmax`,d+k,d+k+Math.max(l,3),e.maxLabel):f}`}function zi(e,n){let t=e.family in pe?e.family:"rectangular",i=n.slot??pe[t],a=pe[t],r=wn(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,l=Re(e.backgroundColorHex),s=Re(e.borderColorHex),d=e.borderWidth*r.scale;if(t==="corner"){let y=r.scale,k=!!e.bezelText||!!e.bezelGauge,w=e.curvedText??"",E=w!=="",R=Cn(y,k),m=_i(y,k),b=m/(a.width*y),$=R.tile.cx-m/2,_=R.tile.cy-m/2,N=`M 0 0 H ${R.quad.width-R.cornerRadius} A ${R.cornerRadius} ${R.cornerRadius} 0 0 1 ${R.quad.width} ${R.cornerRadius} V ${R.quad.height} H 0 Z`,X=f;if(e.bezelGauge)X=Ml(e.bezelGauge,y,o);else if(e.bezelText){let C=Tl(y,`${o}-bezel`),I=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?vt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;X=v`<defs><path id=${C.id} d=${C.d} /></defs>
        <text font-size=${Cr*y} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${C.id}" startOffset="50%" text-anchor="middle">${Er(I,C.length,Cr*y)}</textPath></text>`}let x=f;if(E){let C=Re(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},I=_r(y,`${o}-curved`,Fl*y,Rl);x=v`<defs><path id=${I.id} d=${I.d} /></defs>
        <text font-size=${Tr*y} font-weight="600" fill=${C.color} fill-opacity=${C.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${I.id}" startOffset="50%" text-anchor="middle">${Er(w,I.length,Tr*y*.88)}</textPath></text>`}else{let C=e.borderWidth*r.scale*b,I=s?v`<circle cx=${m/2} cy=${m/2} r=${m/2-C/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${C} />`:f;x=v`<g transform="translate(${$} ${_})">
        <g clip-path=${`url(#${o})`}>
          ${l?v`<rect width=${m} height=${m} fill=${l.color} fill-opacity=${l.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*b})">
            ${e.elements.map(P=>Mi(P,a,n))}
          </g>
        </g>
        <circle cx=${m/2} cy=${m/2} r=${m/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*y} stroke-dasharray=${`${2*y} ${2*y}`} />
        ${I}
      </g>`}return v`<svg viewBox=${`0 0 ${R.quad.width} ${R.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${R.quad.width} height=${R.quad.height}>
      <defs><clipPath id=${o}><circle cx=${m/2} cy=${m/2} r=${m/2} /></clipPath></defs>
      <path d=${N} fill="#000000" />
      ${X}
      ${x}
    </svg>`}let p=v`<rect width=${i.width} height=${i.height} />`,c=s?v`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:f,h=v`<rect width=${i.width} height=${i.height} fill="#000000" />`,g=`0 0 ${i.width} ${i.height}`;return v`<svg viewBox=${g} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${p}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?v`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(y=>Mi(y,a,n))}
      </g>
    </g>
    ${c}
  </svg>`}var Al=.14;function Hl(e,n){let t=Hr(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function Ll(e,n,t){let i=e.family in pe?e.family:"rectangular",a=pe[i],r=e.elements.filter(h=>n.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let g=Hl(h,a),y=h.frame.rotationDegrees%180===0?0:Math.hypot(g.w,g.h)/2;o=Math.min(o,y?g.cx-y:g.x),l=Math.min(l,y?g.cy-y:g.y),s=Math.max(s,y?g.cx+y:g.x+g.w),d=Math.max(d,y?g.cy+y:g.y+g.h)}let p=s-o,c=d-l;if(r.length===0||!(p>0)||!(c>0))o=0,l=0,p=a.width,c=a.height;else{let h=Math.max(2,Math.max(p,c)*Al);o-=h,l-=h,p+=2*h,c+=2*h}if(p/c<t){let h=c*t;o-=(h-p)/2,p=h}else{let h=p/t;l-=(h-c)/2,c=h}return{x:o,y:l,w:p,h:c}}function zr(e,n,t){let i=e.family in pe?e.family:"rectangular",a=pe[i],r=Ll(e,n,t.width/t.height),o=Re(e.backgroundColorHex),l=Re(e.borderColorHex),s=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,...t.imageSizes?{imageSizes:t.imageSizes}:{}},p=e.elements.filter(g=>n.includes(g.id)),c=l&&s>0?i==="rectangular"?v`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:f,h=i==="rectangular"?v`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return v`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${p.map(g=>Mi(g,a,d))}
    ${c}
  </svg>`}function B(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var xt=["rectangular","circular","corner","inline"];function Kt(e){return Z.includes(e)}function Pr(e){return xt.filter(n=>e.supportedFamilies.includes(n))}function Or(e){return Z.find(n=>e.supportedFamilies.includes(n))}function wt(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function _l(e){let n=e.elements.find(i=>i.kind==="text");return{value:n&&n.kind==="text"?structuredClone(n.payload.value):M("Text")}}function Nr(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=xt.filter(t=>t===n||e.supportedFamilies.includes(t))),Kt(n)?e.perFamily[n]||(e.perFamily[n]=ui()):e.inline||(e.inline=_l(e)),e.schemaVersion=_t(e)}function Dr(e,n){wt(e,n)&&(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),Kt(n)?delete e.perFamily[n]:delete e.inline,e.schemaVersion=_t(e))}function Vr(e,n){let t=[];if(!Kt(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Object.keys(i.placements).length;return a>0&&t.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var te={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},kt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},Pi=["text","icon","gauge","chart","shape","image","tap"],Y={states:"#f9a825",tap:te.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Br="2.8.0";function Oi(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function zl(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function Gr(e,n=Br){let t=Oi(e),i=Oi(n);return!t||!i?!1:zl(t,i)>=0}function Ur(e,n=Br){return`${Oi(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${n} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var Kr="52a9d81d0fd7";function Pl(e){return e.trim().replace(/\./g,"-")}function Ol(e){return e.trim().replace(/-/g,".")}var Sn=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>Ol(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=Pl(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Re(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},Ni=class{constructor(n){this.onReady=n;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Re(i)??{color:"#FFFFFF",opacity:1};return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`symbol-icons.json.gz?v=${Kr}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`symbol file: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function Wr(e){return Sn.available()?new Sn(e):new Ni(e)}function jr(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var Tn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],Fn=[...new Set(Tn.flatMap(e=>e.symbols))],Nl={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Dl(e){return`${e.replace(/\./g," ")} ${(Nl[e]??[]).join(" ")}`}function qr(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=Dl(a);if(!t.every(l=>r.includes(l)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var En=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var Vl=100;function Yr(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var at=class e{constructor(n,t){this.config=n;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=t,Ue(n),this.baseline=JSON.stringify(hn(n))}static fromDocument(n,t){return new e(ir(n),t)}get dirty(){return JSON.stringify(hn(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t){let i=Date.now();t!==void 0&&t===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Vl&&this.past.shift(),this.future=[]),this.coalesceKey=t,this.coalesceUntil=t===void 0?0:i+800;let r=structuredClone(this.config);n(r),Ue(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let n=this.past.pop();n&&(this.future.push(this.config),this.config=n,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push(this.config),this.config=n,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=Ti(n),hn(n)}commit(){let n=structuredClone(this.config);return n.dataSources=Ti(n),new e(n,null)}};var $t={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Ne={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Xr=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Zr={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Di=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Bl=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function Vi(e){return Bl.includes(e)}function Gl(e){return Di.includes(e)}function Ul(e,n){return JSON.stringify(Q(e))===JSON.stringify(Q(n))}function Bi(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!Gl(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${$t[s.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=s.value;else if(!Ul(t,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Jr(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Ne[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(n.otherwise){let r=Jr(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Ne[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:Kl(i,n.otherwise),numberMode:i.length>0&&i.every(r=>Vi(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Jr(e){let n=new Set;for(let t of e){let i=fe[t.kind];if(n.has(i))return i;n.add(i)}}function Kl(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(fe[a.kind]);for(let i of n??[])t.add(fe[i.kind]);return Xr.filter(i=>t.has(i))}function Qr(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Xr.filter(a=>i.has(a)&&t.includes(a))}function Rn(e,n){return e.find(t=>fe[t.kind]===n)}function eo(e,n,t,i){let a=n.map(o=>({id:o.caseId??q(),when:{join:o.join??"all",tests:[{id:o.testId??q(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??q(),cases:a};return t&&(r.otherwise=t),r}function Wt(e){if(e.length===0)return"No states yet.";let n=Bi(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function to(e){let n=e[0];return n||(n={id:q(),cases:[]},e.push(n)),n}function no(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function io(e,n,t){let i=to(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:q(),when:{join:"all",tests:[{id:q(),value:structuredClone(n),comparison:jl(a,t)}]},then:[]})}function ao(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),no(e))}function Gi(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function Ui(e,n){if(n){to(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,no(e))}function ro(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function oo(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>fe[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function Wl(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function so(e,n=Wl){let t=()=>n(e.value??M(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??M(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return nt(e.kind)==="value"?`${$t[e.kind]} ${t()}`:$t[e.kind]}}function jl(e,n){if(!e)return n?{kind:"lessThan",value:M("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??M("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};default:return{kind:e.kind,...nt(e.kind)==="value"?{value:M("")}:{}}}}var lo={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function co(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function ql(e){switch(e){case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return v`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return v`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return v`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return v`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return v`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return v`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return v`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return v`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return v`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return v`<path d="M6 9L12 15L18 9" />`;case"plus":return v`<path d="M12 5V19M5 12H19" />`;case"watch":return v`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return v`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return v`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return v`<path d="M6 14L12 8L18 14" />`;case"down":return v`<path d="M6 10L12 16L18 10" />`;case"show":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return v`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return v`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return v`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return v`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return v`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`}}function z(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ql(e)}</svg>`}var jt="color-mix(in srgb, var(--k) 45%, #6b7280)",po='system-ui, -apple-system, "Segoe UI", sans-serif';function uo(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=p=>{let c=p*Math.PI/180;return{x:(e-t*Math.cos(c)).toFixed(2),y:(n-t*Math.sin(c)).toFixed(2)}},l=o(135),s=o(r),d=r-135>180?1:0;return`M${l.x} ${l.y}A${t} ${t} 0 ${d} 1 ${s.x} ${s.y}`}function Ki(e,n,t,i){return v`<g fill="none" stroke-linecap="round">
    <path d=${uo(e,n,t,1)} stroke=${jt} stroke-width="2.6" opacity=".5" />
    <path d=${uo(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function Yl(e){switch(e){case"text":return v`<g font-family=${po} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${jt}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${jt}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${jt}>1.2 kW</text>
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
        ${Ki(22,24,12,.28)}
        ${Ki(60,24,12,.62)}
        ${Ki(98,24,12,.92)}
        <text x="60" y="27" font-family=${po} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return v`<g>
        <g opacity=".4" fill=${jt}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"shape":return v`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="8" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <circle cx="60" cy="23" r="11" />
        <rect x="80" y="16" width="32" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
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
      </g>`}}function ho(e){return u`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${Yl(e)}</svg>`}function Ct(e,n){let t=new DOMPoint(n.clientX,n.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=t.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function mo(e){let n=Math.min(.96,Math.max(-e.width+.04,e.x)),t=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:n,y:t}}var In=e=>Math.round(e*1e3)/1e3,fo=10;function Wi(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return mo({...e,x:In(a),y:In(r)})}function go(e,n,t,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?In(a(e.x+n/i.w)):e.x,y:i.h>0?In(a(e.y+t/i.h)):e.y}}function Mn(e,n,t,i,a){let r=Ct(e,t),o={...i.frame},l=o;e.setPointerCapture(t.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==t.pointerId)return;let g=Ct(e,h),y=(g.x-r.x)/n.width,k=(g.y-r.y)/n.height,w;if(!i.handle)w=mo({...o,x:s(o.x+y),y:s(o.y+k)});else{let{x:E,y:R,width:m,height:b}=o,$=o.x+o.width,_=o.y+o.height;i.handle.includes("e")&&(m=Math.max(.04,o.width+y)),i.handle.includes("s")&&(b=Math.max(.04,o.height+k)),i.handle.includes("w")&&(m=Math.max(.04,o.width-y),E=$-m),i.handle.includes("n")&&(b=Math.max(.04,o.height-k),R=_-b),w={...o,x:s(E),y:s(R),width:s(m),height:s(b)}}l=w,a.onFrame(i.elementId,w,!1)},p=h=>{h.pointerId===t.pointerId&&(c(),a.onFrame(i.elementId,l,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),c}function yo(e,n,t,i,a){let r=Ct(e,t),o=i;e.setPointerCapture(t.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==t.pointerId)return;let g=Ct(e,h),y=n.w>0?s(i.x+(g.x-r.x)/n.w):i.x,k=n.h>0?s(i.y+(g.y-r.y)/n.h):i.y;o={x:l(y),y:l(k)},a(o.x,o.y,!1)},p=h=>{h.pointerId===t.pointerId&&(c(),a(o.x,o.y,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),c}function bo(e,n,t,i,a){let r=Ct(e,n),o=1;e.setPointerCapture(n.pointerId);let l=p=>{if(p.pointerId!==n.pointerId)return;let c=Ct(e,p),h=(c.x-r.x)*(t.includes("e")?1:-1),g=(c.y-r.y)*(t.includes("s")?1:-1),y=i.w>0?(i.w+h)/i.w:1,k=i.h>0?(i.h+g)/i.h:1,w=Math.abs(y-1)>=Math.abs(k-1)?y:k;o=Math.max(.05,w),a(o,!1)},s=p=>{p.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}function Jl(e){switch(e){case"light":return v`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return v`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return v`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return v`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return v`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return v`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return v`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return v`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return v`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return v`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return v`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return v`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return v`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return v`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return v`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return v`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return v`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return v`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return v`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return v`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return v`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return v`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return v`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return v`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return v`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return v`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return v`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return v`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return v`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function ji(e){return u`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Jl(e)}</svg>`}var Xl={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function vo(e){let n=Xl[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var Zl=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function qi(e){return Zl.has(e.trim().toLowerCase())}var Qi=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function de(e){return n=>e(n.target.value)}function ne(e,n,t,i={}){return u`<label class="field"><span>${e}</span>
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${de(t)} /></label>`}function Ql(e,n,t,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${de(t)}></textarea></label>`}function j(e,n,t,i={}){let a=n===void 0||Number.isNaN(n)?"":String(n);return u`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??f} max=${i.max??f}
      @input=${de(r=>{if(r.trim()===""){i.optional&&t(void 0);return}let o=Number(r);Number.isNaN(o)||t(o)})} /></label>`}function V(e,n,t,i){return u`<label class="field"><span>${e}</span>
    <select @change=${de(a=>i(a))}>
      ${t.map(([a,r])=>u`<option value=${a} ?selected=${a===n}>${r}</option>`)}
    </select></label>`}function Yi(e,n,t,i){let a=i.format??(r=>String(Math.round(r*100)/100));return u`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)}
        @input=${de(r=>{let o=Number(r);Number.isNaN(o)||t(o)})} />
      <span class="slider-value mono">${a(n)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${n===i.def}
        @click=${()=>t(i.def)}>${z("reset")}</button>
    </div></div>`}function ge(e,n,t){return u`<label class="field check"><input type="checkbox" .checked=${n} @change=${i=>t(i.target.checked)} /><span>${e}</span></label>`}function ae(e,n,t,i=!1){let a=(n??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,p)=>{let c=d.replace(/^#/,"").toUpperCase();return p>=100?`#${c}`:`#${c}${Math.round(p/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return u`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${n!==void 0} @change=${d=>t(d.target.checked?s(o,l):void 0)} />`:f}
      <input type="color" .value=${o} ?disabled=${i&&n===void 0} @input=${de(d=>t(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&n===void 0} @input=${de(d=>t(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${n??""} placeholder="#RRGGBB" ?disabled=${i&&n===void 0}
        @input=${de(d=>{let p=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(p)&&t(p.startsWith("#")?p.toUpperCase():`#${p.toUpperCase()}`)})} />
    </div></div>`}function Ao(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function ed(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let l=r.split(".")[0]??"";if(i!==void 0&&!i.includes(l))continue;let s=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:s||r,state:o?.state??"",domain:l,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function xo(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Ho=50;function td(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function nd(e,n,t=Ho,i){let a=n.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,t);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),p=s.name.toLowerCase(),c=(s.area??"").toLowerCase(),h=-1;d===a?h=0:d.startsWith(a)?h=1:p.startsWith(a)?h=2:d.includes(a)?h=3:p.includes(a)?h=4:o.length>1&&o.every(g=>d.includes(g)||p.includes(g))?h=5:c!==""&&(c.includes(a)||o.length>1&&o.every(g=>d.includes(g)||p.includes(g)||c.includes(g)))&&(h=6),h>=0&&l.push({c:s,rank:h})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,t).map(s=>s.c)}var id=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Lo(e){return id.test(e.trim())}function ad(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return Ao(t,i);if(Lo(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var ot=new Map;function Ce(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function _o(e){return ot.has(e)}function Ke(e,n,t,i,a,r={}){let o=e.hass.states,l=ot.get(a),s=l?nd(ed(o,r.domain,xo(e.hass)),l.query,Ho,r.preferNumeric?td:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,p=t.entityId?o[t.entityId]:void 0,c=(m,b,$=0)=>{ot.set(a,{query:b,index:$}),Ce(m)},h=m=>{ot.delete(a),Ce(m)},g=m=>{let b=ad(m,t,o);b&&i(b)},y=(m,b)=>{i(Ao(o,m.entityId)),h(b)},k=()=>Math.max(0,Math.min(ot.get(a)?.index??0,s.length-1)),w=m=>{let b=m.target;if(m.key==="ArrowDown"||m.key==="ArrowUp"){m.preventDefault();let $=ot.get(a);if(!$){c(b,b.value);return}let _=m.key==="ArrowDown"?k()+1:k()-1;c(b,$.query,Math.max(0,Math.min(s.length-1,_))),rd(b);return}if(m.key==="Enter"){m.preventDefault();let $=s[k()];l&&$?y($,b):(g(b.value),h(b));return}if(m.key==="Escape"){if(!l)return;m.preventDefault(),m.stopPropagation(),h(b)}},E=t.entityId?xo(e.hass)?.(t.entityId):void 0,R=t.entityId===""?u`<div class="hint">Type part of a name, a room, or an id.</div>`:p?u`<div class="entity-current">
          <span class="ent-ico ${qi(p.state)?"on":""}">${ji(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof p.attributes.friendly_name=="string"?p.attributes.friendly_name:t.entityId}</span>
          ${E?u`<span class="ent-area">${E}</span>`:f}
          <span class="ent-state">${p.state}</span>
        </div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${l?"open":""}">
      <span class="ent-glass">${z("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${l?l.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${m=>{let b=m.target;c(b,t.entityId),b.select()}}
        @input=${m=>{let b=m.target;c(b,b.value)}}
        @keydown=${w}
        @blur=${m=>{let b=m.target;l&&g(b.value),h(b)}} />
      ${(l?l.query:t.entityId)===""?f:u`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${m=>m.preventDefault()}
        @click=${m=>{let b=m.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),ot.set(a,{query:"",index:0}),Ce(b),b?.focus()}}>${z("close")}</button>`}
    </div>
    ${l?u`<div class="entity-results" role="listbox">
          ${s.length===0?u`<div class="hint" style="padding:6px 8px">${Lo(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map((m,b)=>u`<button type="button" role="option" aria-selected=${b===d?"true":"false"} class="ent ${b===d?"hl":""}"
                @mousedown=${$=>$.preventDefault()} @click=${$=>y(m,$.target)}>
                <span class="ent-ico ${qi(m.state)?"on":""}">${ji(m.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${m.name}</span>
                  <span class="ent-sub">
                    ${m.area?u`<span class="ent-area">${m.area}</span>`:f}
                    <span class="ent-id mono">${m.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${vo(m.domain)}</span>
                  <span class="ent-state">${m.state}</span>
                </span>
              </button>`)}
        </div>`:R}
    ${r.compact?f:u`<details class="sub">
      <summary>Display name: ${t.displayName||"(none)"}</summary>
      ${ne("Display name",t.displayName,m=>i({...t,displayName:m}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function rd(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var od=120;function sd(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(Tn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(Fn),fromPack:!1}}function wo(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function ld(e){return[{value:"",label:`Starter set (${wo(Fn,e)})`},...Tn.map(n=>({value:n.name,label:`${n.name} (${wo(n.symbols,e)})`}))]}function dd(e){return e.length>0?e.length:Fn.length}function cd(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function ko(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return u`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function zo(e,n,t,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),p=n.trim(),c=p!==""&&d.size>0&&!d.has(p),h=y=>{t(y),a.noteUsed(y)},g=f;if(r){let y=a.category(i),k=sd(y,o,s,d),w=qr(k.names,o),E=k.fromPack?w.slice(0,od):w,R=d.size===0?a.recent:a.recent.filter(m=>d.has(m));g=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${de(m=>a.setQuery(i,m))} />
        <select @change=${de(m=>a.setCategory(i,m))}>
          ${ld(d).map(m=>u`<option value=${m.value} ?selected=${m.value===y}>${m.label}</option>`)}
        </select>
      </div>
      ${R.length===0?f:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${R.map(m=>ko(e,m,m===p,h))}</div>`}
      <div class="sym-grid">${E.map(m=>ko(e,m,m===p,h))}</div>
      ${w.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${cd(E.length,w.length,o.trim()!=="",dd(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${de(t)} @change=${de(y=>{(d.size===0||d.has(y.trim()))&&a.noteUsed(y)})} /></label>
    ${c?u`<div class="hint warn">The installed icon pack has no <code>${p}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${g}`}var pd=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],ud=[["bars","Bars"],["line","Line"],["area","Area"]],hd=[["auto","Auto (fit the readings)"],["fixed","Fixed range"]],md=[["lowest","Lowest value"],["zero","Zero"]],Po=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],fd=[["none","None"],["pointer","Triangle and dot"],["dot","Dots"]],gd=[["uniform","One colour"],["bands","By value"]];function yd(e){let n=[ti,"#FFD60A"];if(e.length<2)return n.map((o,l)=>({id:q(),upTo:(l+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,l)=>({id:q(),upTo:r(t+a*(l+1)/3),colorHex:o}))}function bd(e){let n=gt(e).at(-1),t=e.bands.length>1?Math.abs(gt(e)[1].upTo-gt(e)[0].upTo):10;return{id:q(),upTo:(n?.upTo??0)+(t||10),colorHex:e.colorSlot.baseColorHex}}var vd=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function xd(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function ee(e,n,t,i){if(i.inline||!wd())return u`<div class="value-editor">${Do(e,n,t,i)}</div>`;let a=ea(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,l=ce(n,re(e)),s="entityId"in n.kind;return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?f:u`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text ${s?"ent-tok":""}">${l}</span>
      ${o===void 0?f:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Oo(e,a,r,n,t,i)}
  </div>`}function Oo(e,n,t,i,a,r){return u`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${No}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${Yt.has(n)?Do(e,i,a,r):f}
  </div>`}function re(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function ea(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function wd(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Yt=new Set,qt=new WeakMap;function kd(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function $d(e,n){let t=e instanceof Node?e:null;if(!t)return;let i=t.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(n)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function No(e){let n=e.currentTarget,t=e.newState==="open",i=qt.get(n);if(i&&(i(),qt.delete(n)),!t){Yt.delete(n.id)&&Ce(n);return}let a=kd(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){qt.get(n)?.(),qt.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Ji(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),qt.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Ji(n,a.getBoundingClientRect()),Yt.has(n.id)||(Yt.add(n.id),Ce(n),requestAnimationFrame(()=>{n.isConnected&&Ji(n,a.getBoundingClientRect())}))}function Ji(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=Cd({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var rt=8,An=6,$o=140;function Cd(e,n,t){let i=t.height-e.bottom-An-rt,a=e.top-An-rt,r=n.height>i&&a>i&&i<$o,o=Math.max($o,r?a:i),l=Math.min(n.height,o),s=Math.max(rt,Math.min(e.left,t.width-n.width-rt)),d=r?Math.max(rt,e.top-An-l):Math.max(rt,Math.min(e.bottom+An,t.height-l-rt));return{left:s,top:d,maxHeight:o,above:r}}function Do(e,n,t,i){let a=n.kind,r=p=>t({...n,kind:p}),o=i.key,l=pd.filter(([p])=>i.allowNamed!==!1||p!=="named"),s=f;switch(a.kind){case"literal":s=i.symbol?zo(e,a.value,p=>r({...a,value:p}),o):ne("Text",a.value,p=>r({...a,value:p}));break;case"entityState":case"entityAge":s=Ke(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`);break;case"entityAttribute":{let p=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),c=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=u`${Ke(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ne("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:c,mono:!0})}
        <datalist id=${c}>${p.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=Ed(e,a.aggregate,p=>r({...a,aggregate:p}),o);break;case"time":s=V("Field",a.timeField,vd,p=>r({...a,timeField:p}));break;case"dataAge":s=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=u`${Ql("Template",a.value,p=>r({...a,value:p}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:V("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}));break;case"chartStat":{let p=re(e),c=e.config.elements.filter(h=>h.kind==="chart");s=c.length===0?u`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:u`
          ${V("Chart",a.layer,[["","(choose)"],...c.map(h=>[h.payload.id,ke(h,p)])],h=>r({...a,layer:h}))}
          ${V("Number",a.stat,[...ft],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(n):void 0;return u`
    ${V("Source",a.kind,l,p=>r(xd(a,p)))}
    ${s}
    ${i.noFormat?f:Sd(n.format,p=>t(Fe(p)?{kind:n.kind}:{...n,format:p}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:f}`}function Sd(e,n){let t=e??{},i=a=>{let r={...t,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];n(r)};return u`<details class="sub" ?open=${!Fe(e)}>
    <summary>Format${Fe(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${j("Decimals",t.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${j("Multiply",t.multiply,a=>i({multiply:a}),{optional:!0})}
      ${j("Offset",t.offset,a=>i({offset:a}),{optional:!0})}
      ${V("Case",t.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ne("Prefix",t.prefix??"",a=>i({prefix:a}))}
      ${ne("Suffix",t.suffix??"",a=>i({suffix:a}))}
    </div>
    ${ge("Append the entity's unit",!!t.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${ge("Show as relative time (45s, 2m, 3h)",!!t.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function Ed(e,n,t,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=n.scope;return u`
    ${V("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>t({...n,function:l}))}
    ${V("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>t({...n,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${ne("Domains",a(o.domains),l=>t({...n,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${ne("Area ids",a(o.areaIds),l=>t({...n,scope:{...o,areaIds:r(l)}}))}
          ${ne("Label ids",a(o.labelIds),l=>t({...n,scope:{...o,labelIds:r(l)}}))}
          ${ne("Floor ids",a(o.floorIds),l=>t({...n,scope:{...o,floorIds:r(l)}}))}
        </div>`:u`${o.entities.map((l,s)=>u`<div class="row-inline">
            ${Ke(e,`Entity ${s+1}`,l,d=>{let p=[...o.entities];p[s]=d,t({...n,scope:{...o,entities:p}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,p)=>p!==s)}})}>${z("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${V("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...n};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:s.stateFilter={kind:l},t(s)})}
    ${n.stateFilter&&"value"in n.stateFilter?ne("State",n.stateFilter.value,l=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:l}})):f}
    ${n.function==="count"?f:ne("Attribute (blank = state)",n.attribute??"",l=>{let s={...n};l?s.attribute=l:delete s.attribute,t(s)})}`}var Vo=li,Td=Vo.filter(([e])=>e!=="none");function Fd(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function Bo(e){let n=e.config,t=n.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=Fd(e.savedName,n.name),r=n.refreshMinutes??0,o=Co.map(s=>[String(s),So(s)]);Co.includes(r)||o.push([String(r),So(r)]);let l=n.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${ne("Name",n.name,s=>e.update(d=>{d.name=s},"name"))}
      ${V("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${V("Tap action",t.type,Vo,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??Rd).slice(0,7)}
                @input=${de(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in t?Ke(e,"Target",t,s=>e.update(d=>{d.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):f}
    ${t.type==="openPage"?Id(e):f}`}var Rd="#808080",Co=[0,15,30,60,120];function So(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function Id(e){let n=e.config;return Go(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function Go(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${V("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?f:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function Uo(e,n){let t=e.config.values.findIndex(a=>a.id===n.id),i=`nv-${n.id}`;return u`
    ${ne("Name",n.name,a=>e.update(r=>{r.values[t].name=a},`${i}-name`))}
    ${ee(e,n.value,a=>e.update(r=>{r.values[t].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${Eo(e.config,n.id)} layer${Eo(e.config,n.id)===1?"":"s"}.</div>`}function Eo(e,n){return JSON.stringify(e.elements).split(`"${n}"`).length-1+JSON.stringify(e.perFamily).split(`"${n}"`).length-1}function Ko(){return{id:q(),name:"Value",value:M("")}}function be(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function ye(e,n,t,i,a=!1){let r=e.elements.find(p=>p.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let l=be(e,n,r),d={...o.placements[t]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let p of e.elements)p.payload.id!==t&&(o.placements[p.payload.id]={frame:{...p.payload.frame},isHidden:p.payload.isHidden});o.placements[t]=d}function Md(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function To(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Ad(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function Wo(e,n,t){let i=To(t.map(d=>be(e,n,d).isHidden)),a=To(t.map(d=>d.payload.isHidden)),r=t.map(Ad),o=t.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var ta=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function Hd(e,n,t){let i=n.payload.id,a=gn(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"?{domain:"camera"}:{};return u`
    ${Ke(e,n.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>gr(s,i,l),`${t}-entity`),`${t}-layer-entity`,o)}
    <div class="hint">${zd(n,a)}</div>`}function Ld(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function _d(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function zd(e,n){let t=Ld(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let s=n.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${_d(o)}.${r}`}function Pd(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Od(e,n){let t=e.timestamp===!0,i=Ae(e),a=r=>n(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ae(o)&&(o.timestampCorner=oi(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${ge("Show timestamp",t,r=>n(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${t?u`
      ${V("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?f:V("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>n(o=>{o.timestampCorner=r}))}
      ${j("Text size (pt)",e.timestampSize,r=>n(o=>{o.timestampSize=Math.min(40,Math.max(4,r??Pt))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function le(e,n,t,i,a={}){let r=e.openSections.has(n),o=()=>e.toggleSection(n);return u`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${z(a.icon??"content")}</span>
      <span class="tt"><h4>${t}</h4>${a.summary?u`<span class="sum">${a.summary}</span>`:f}</span>
      <span class="chev">${z("chevron")}</span>
    </div>
    ${r?u`<div class="sec-b">${i}</div>`:f}
  </section>`}function Nd(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Dd(e){return ni.find(n=>n.minutes===e)?.label??`Last ${e} min`}function na(e,n){let t=re(e);switch(n.kind){case"text":return st(ce(n.payload.value,t),48);case"icon":return st(ce(n.payload.symbol,t),48);case"gauge":return st(ce(n.payload.value,t),48);case"chart":return st(`${ce(n.payload.value,t)}${n.payload.historyMinutes>0?` \xB7 ${Dd(n.payload.historyMinutes)}`:""}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||"No camera yet";case"tap":return He(n.payload.action)}}function zn(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${Po.find(([n])=>n===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${Se(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function jo(e,n,t){let i=n.payload.id,a=e.config.elements.findIndex(m=>m.payload.id===i),r=`el-${i}`,o=(m,b)=>e.update($=>m($.elements[a]),b?`${r}-${b}`:void 0),l=be(e.config,t,n),s=l.frame,d=(m,b)=>e.update($=>ye($,t,i,{frame:{...s,...m}}),`${r}-${b}-${t}`),p=n.kind==="text"?"Font size":n.kind==="icon"?"Icon size":"Line width",c,h;switch(n.kind){case"text":{let m=di(e.config,n.payload.value);c=u`
        ${ee(e,n.payload.value,b=>o($=>{$.payload.value=b},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${m?u`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(m.payload.id)}>${ke(m,re(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}
        ${ge("Live countdown",n.payload.countdown===!0,b=>o($=>{let _=$.payload;b?_.countdown=!0:delete _.countdown}))}
        ${n.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,h=u`<div class="grid2">
          ${j("Font size (pt)",n.payload.fontSize,b=>o($=>{$.payload.fontSize=b??14},"size"),{step:1,min:4})}
          ${V("Weight",n.payload.fontWeight,ta,b=>o($=>{$.payload.fontWeight=b}))}
        </div>`;break}case"icon":c=u`
        ${ee(e,n.payload.symbol,m=>o(b=>{b.payload.symbol=m},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=j("Icon size (pt)",n.payload.size,m=>o(b=>{b.payload.size=m??14},"size"),{step:1,min:4});break;case"gauge":c=u`
        ${ee(e,n.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${j("Min",n.payload.minValue,m=>o(b=>{b.payload.minValue=m??0},"min"))}
          ${j("Max",n.payload.maxValue,m=>o(b=>{b.payload.maxValue=m??100},"max"))}
        </div>`,h=u`
        <div class="grid2">
          ${V("Style",n.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],m=>o(b=>{b.payload.style=m}))}
          ${j("Line width (pt)",n.payload.lineWidth,m=>o(b=>{b.payload.lineWidth=m??4},"lw"),{step:.5,min:.5})}
        </div>
        ${ae("Track colour",n.payload.trackColorHex,m=>o(b=>{b.payload.trackColorHex=m??"#FFFFFF40"},"track"))}`;break;case"chart":{let m=n.payload,b=(S,T)=>o(J=>S(J.payload),T),$=tt(m),_=m.historyMinutes>0,N=m.value.kind.kind==="entityState",X=$===void 0?void 0:e.historySeries($),x=_?X??"":e.resolve(m.value)??"",C=Bt(x),I=m.limit>0&&C.length>m.limit?m.takeFromEnd?C.slice(C.length-m.limit):C.slice(0,m.limit):C,P=!_&&N&&C.length===1;c=u`
        ${ee(e,m.value,S=>b(T=>{T.value=S},"value"),{label:"Readings",key:`${r}-value`})}
        ${V("Draw",_?"history":"value",[["value","The value itself"],["history","Its recorded history"]],S=>b(T=>{T.historyMinutes=S==="history"?T.historyMinutes||360:0}))}
        ${_?u`
            ${N?f:u`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              stays empty until Readings names an entity.</div>`}
            <div class="grid2">
              ${V("Span",String(m.historyMinutes),ni.map(({minutes:S,label:T})=>[String(S),T]),S=>b(T=>{T.historyMinutes=Number(S)||360}))}
              ${j("Readings",m.historyPoints,S=>b(T=>{T.historyPoints=Math.round(S??24)},"hpoints"),{step:1,min:ii,max:ai})}
            </div>
            <div class="hint">Home Assistant averages the recorded states into this many equal
              time slots, oldest first. About 20 readings suits a rectangular complication; more
              than that draws bars thinner than the screen can show.</div>
            ${N&&X===void 0?u`<div class="hint">Reading the history…</div>`:f}
            ${N&&X===""?u`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:u`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${C.length===0&&!(_&&(!N||X===void 0||X===""))?u`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${C.length>0?u`<div class="hint">Reads <span class="nums">${Nd(I)}</span>${C.length===I.length?u` · ${I.length} ${I.length===1?"value":"values"}`:u` · ${I.length} of ${C.length}`}</div>`:f}
        ${P?u`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Its recorded history</b> to plot how it has moved.</div>`:f}
        <div class="grid2">
          ${j("Use",m.limit,S=>b(T=>{T.limit=Math.max(0,Math.round(S??0))},"limit"),{step:1,min:0})}
          ${V("From",m.takeFromEnd?"end":"start",[["start","The first readings"],["end","The last readings"]],S=>b(T=>{T.takeFromEnd=S==="end"}))}
        </div>
        <div class="hint">${_?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,h=u`
        ${V("Style",m.style,ud,S=>b(T=>{T.style=S}))}
        <div class="grid2">
          ${V("Scale",m.scale,hd,S=>b(T=>{T.scale=S}))}
          ${V("Baseline",m.baseline,md,S=>b(T=>{T.baseline=S}))}
        </div>
        ${m.scale==="fixed"?u`<div class="grid2">
              ${j("Min",m.minValue,S=>b(T=>{T.minValue=S??0},"cmin"))}
              ${j("Max",m.maxValue,S=>b(T=>{T.maxValue=S??100},"cmax"))}
            </div>`:f}
        <div class="hint">${m.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${m.style==="bars"?j("Bar gap (pt)",m.barGap,S=>b(T=>{T.barGap=Math.max(0,S??0)},"gap"),{step:.5,min:0}):j("Line width (pt)",m.lineWidth,S=>b(T=>{T.lineWidth=Math.max(.5,S??2)},"lw"),{step:.5,min:.5})}
        ${V("Colour",m.coloring,gd,S=>b(T=>{T.coloring=S,S==="bands"&&T.bands.length===0&&(T.bands=yd(I))}))}
        ${m.coloring==="bands"?u`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${m.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${m.bands.map((S,T)=>u`
            <div class="row-inline">
              ${j("Up to",S.upTo,J=>b(ve=>{let xe=ve.bands[T];xe&&(xe.upTo=J??0)},`bup${S.id}`))}
              ${ae("Colour",S.colorHex,J=>b(ve=>{let xe=ve.bands[T];xe&&(xe.colorHex=J??"#FFFFFF")},`bcol${S.id}`))}
              <button class="icon" title="Remove this band" aria-label="Remove this band"
                @click=${()=>b(J=>{J.bands=J.bands.filter((ve,xe)=>xe!==T)})}>${z("close")}</button>
            </div>`)}
          <button class="small" @click=${()=>b(S=>{S.bands=[...S.bands,bd(S)]})}>Add band</button>
          ${ae("And the rest",m.bandAboveColorHex,S=>b(T=>{T.bandAboveColorHex=S??pn},"babove"))}
          ${m.style==="area"?u`${ge("Fill follows the bands",m.fillBands,S=>b(T=>{T.fillBands=S}))}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}
        ${V("Highlight",m.highlight,Po,S=>b(T=>{T.highlight=S}))}
        ${m.highlight==="none"?f:u`
          <div class="grid2">
            ${m.highlight==="lowest"?f:ae("Highest colour",m.highColorHex,S=>b(T=>{T.highColorHex=S??dn},"hicol"))}
            ${m.highlight==="highest"?f:ae("Lowest colour",m.lowColorHex,S=>b(T=>{T.lowColorHex=S??cn},"locol"))}
          </div>
          ${V("Marker",m.marker,fd,S=>b(T=>{T.marker=S}))}
          <div class="hint">Worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":c=u`<div class="grid2">
          ${V("Shape",n.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],m=>o(b=>{b.payload.kind=m}))}
          ${n.payload.kind==="roundedRectangle"?j("Corner radius (pt)",n.payload.cornerRadius,m=>o(b=>{b.payload.cornerRadius=m??6},"radius"),{step:.5,min:0}):f}
        </div>`,h=u`
        ${ae("Border colour",n.payload.borderColorHex,m=>o(b=>{m===void 0?delete b.payload.borderColorHex:b.payload.borderColorHex=m},"border"),!0)}
        ${n.payload.borderColorHex!==void 0?j("Border width (pt)",n.payload.borderWidth,m=>o(b=>{b.payload.borderWidth=m??1},"bw"),{step:.5,min:0}):f}`;break;case"image":{let m=n.payload,b=($,_)=>o(N=>$(N.payload),_);c=u`
        ${m.entity.entityId&&!m.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:f}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=u`
        ${V("Picture",m.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],$=>b(_=>{_.contentMode=$}))}
        ${Yi("Zoom",m.zoom,$=>b(_=>{_.zoom=$},"zoom"),{min:Li,max:4,step:.05,def:1,format:$=>`${$.toFixed(2)}x`})}
        ${Yi("Pan left/right",m.panX,$=>b(_=>{_.panX=$},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Yi("Pan up/down",m.panY,$=>b(_=>{_.panY=$},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${Pd(m)}</div>
        ${j("Corner radius (pt)",m.cornerRadius,$=>b(_=>{_.cornerRadius=Math.max(0,$??zt)},"imgradius"),{step:1,min:0})}`;break}case"tap":{c=u`
        ${qo(e,n.payload,(m,b)=>o($=>m($.payload),b),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let g=n.kind==="image"||n.kind==="tap"?void 0:ae(n.kind==="shape"?"Fill colour":"Colour",n.payload.colorSlot.baseColorHex,m=>o(b=>{b.kind!=="image"&&b.kind!=="tap"&&(b.payload.colorSlot.baseColorHex=m??"#FFFFFF")},"color")),y=fi(e.config,n),k=y?{kind:{kind:"entityState",...y}}:void 0,w=te[n.kind],E=n.kind==="tap"?void 0:we(e.config,i)[0],R=n.kind==="image"?n.payload.timestamp===!0:!1;return u`
    ${le(e,"content","Content",u`${n.kind==="tap"?f:Hd(e,n,r)}${c}`,{color:w,icon:"content",summary:na(e,n)})}
    ${h===void 0&&g===void 0?f:le(e,"look",n.kind==="image"?"Picture":"Look",u`${h??f}${g??f}`,{color:w,icon:n.kind==="image"?"image":"look",...zn(n)?{summary:zn(n)}:{}})}
    ${n.kind==="chart"?le(e,"numbers","Numbers",Ud(e,n),{color:te.text,icon:"text",summary:Gd(e,n)}):f}
    ${n.kind==="image"?le(e,"timestamp","Timestamp",Od(n.payload,(m,b)=>o($=>m($.payload),b)),{color:w,icon:"clock",summary:R?`Shown \xB7 ${n.payload.timestampSize} pt`:"Hidden"}):f}
    ${n.kind==="tap"?f:le(e,"tappable","Tap",Kd(e,n,r),{color:Y.tap,icon:"tap",summary:E?He(E.payload.action):"Not tappable"})}
    ${le(e,"states","States",ts(e,n.payload.rules,n.kind,m=>m.elements.find(b=>b.payload.id===i)?.payload.rules,`rules-${i}`,k),{color:Y.states,icon:"states",summary:Wt(n.payload.rules).replace(/\.$/,"")})}
    ${le(e,"placement","Place",u`
      <div class="grid4">
        ${j("X",s.x,m=>d({x:m??0},"x"),{step:.01})}
        ${j("Y",s.y,m=>d({y:m??0},"y"),{step:.01})}
        ${j("W",s.width,m=>d({width:m??.5},"w"),{step:.01,min:0})}
        ${j("H",s.height,m=>d({height:m??.5},"h"),{step:.01,min:0})}
      </div>
      ${j("Rotation (degrees)",s.rotationDegrees,m=>d({rotationDegrees:m??0},"rot"),{step:1})}
      ${n.kind==="shape"||n.kind==="image"||n.kind==="tap"?f:j(`${p} in ${B(t)} (blank = shared ${Md(n)})`,l.size,m=>e.update(b=>m===void 0?ye(b,t,i,{},!0):ye(b,t,i,{size:m}),`${r}-psize-${t}`),{step:1,min:1,optional:!0})}
      ${ge(`Hidden in ${B(t)}`,l.isHidden,m=>e.update(b=>ye(b,t,i,{isHidden:m})))}
      ${ge("Hidden in every shape",n.payload.isHidden,m=>o(b=>{b.payload.isHidden=m}))}
      <div class="hint">Drag the layer on the ${B(t)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:Y.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${B(t)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function qo(e,n,t,i){let a=n.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${V("Tap action",a.type,Td,o=>t(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?Ke(e,"Target",a,o=>t(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="openPage"?Go(e,n.openPageId,n.openPageName,(o,l)=>t(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):f}`}var Vd=24;function Bd(e,n){let t=[],i=1/0;for(let r of Z){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=mr(e.config,n,r);o&&(t.push(`${B(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return f;let a=i<Vd;return u`<div class=${a?"hint warn":"hint"}>${t.join(" \xB7 ")}${a?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:f}</div>`}function Gd(e,n){let t=Ot(e.config,n.payload.id);return t.length===0?"None yet":t.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(ft.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function Ud(e,n){let t=re(e),i=Ot(e.config,n.payload.id),a=o=>{let l;e.update(s=>{l=sr(s,n.payload.id,o)}),l&&e.selectLayer(l)},r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return u`
    ${i.length===0?u`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:u`
        <div class="chart-numbers">
          ${i.map(o=>u`
            <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
              <b>${e.resolve(o.payload.value)??"--"}</b> · <span class="ent-tok">${ke(o,t)}</span>
            </button>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${ft.map(([o,l])=>u`
        <button class="small" title=${r.has(o)?`Add another ${l.toLowerCase()}`:`Add the ${l.toLowerCase()}`}
          @click=${()=>a(o)}>${z("plus")}<span>${l}</span></button>`)}
    </div>
    <div class="hint">The newest reading starts with the entity's unit after it. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function Kd(e,n,t){if(n.kind==="tap")return f;let i=n.payload.id,a=we(e.config,i)[0],r=(l,s)=>e.update(d=>{let p=d.elements.find(c=>c.kind==="tap"&&c.payload.attachedTo===i);p&&l(p.payload)},s?`${t}-${s}`:void 0),o=gi(e.config,n);return u`
    ${ge("Tappable",a!==void 0,l=>e.update(s=>{l?mn(s,i):bi(s,i)}))}
    ${a?u`<div class="value-editor">
          ${qo(e,a.payload,r,`${t}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${un(a.payload.outset)?f:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...si}})}>${z("reset")}</button>`}
          </div>
        </div>
        ${Bd(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${He(o)}</b>.</div>`}`}function Fo(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function ke(e,n){switch(e.kind){case"text":return Fo(ce(e.payload.value,n));case"icon":return Fo(ce(e.payload.symbol,n));case"gauge":return ce(e.payload.value,n);case"chart":return ce(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let t=e.payload.entity;return t.displayName||t.entityId||"camera"}case"tap":{let t=e.payload.action,i="entityId"in t?t.displayName||t.entityId:t.type==="openPage"&&e.payload.openPageName||"";return i?`${t.type} \xB7 ${i}`:t.type}}}function Yo(e,n){let t=_e(e.config,n.id),i=re(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===n.id);s&&r(s)},o?`group-${n.id}-${o}`:void 0);return le(e,"content","Group",u`
    ${ne("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${ge("Move as one on the watch",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${t.length} layer${t.length===1?"":"s"}: ${t.map(r=>ke(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Nt(r,n.id))}>Ungroup</button>
    </div>`,{color:Y.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function Jo(e,n){if(n==="inline")return u`${Wd(e)}${Xi(e,n)}`;let t=e.config.perFamily[n];if(!t)return u`<div class="hint">No settings stored for ${B(n)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${B(n)} settings</button>
      ${Xi(e,n)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[n]),s?`fam-${n}-${s}`:void 0),a=Object.keys(t.placements).length,r=t.backgroundColorHex?Se(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${Se(t.borderColorHex)} border`:"no border";return u`
    ${le(e,"look",`${B(n)} shape`,u`
      ${ae("Background (blank = transparent)",t.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${ae("Border colour",t.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${j("Border width (pt)",t.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:Y.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${n==="corner"?le(e,"corner","Corner content",jd(e,t,i),{color:Y.place,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas"}):f}
    ${le(e,"states","Shape states",ts(e,t.rules,"layout",l=>l.perFamily[n]?.rules,`rules-${n}`),{color:Y.states,icon:"states",summary:Wt(t.rules).replace(/\.$/,"")})}
    ${le(e,"placements","Placements",u`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${B(n)} placement.`}</div>
      ${a>0?u`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:f}`,{color:Y.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${Xi(e,n)}`}function Xi(e,n){let t=!wt(e.config,n),i=t?"A complication keeps at least one shape.":`Drop the ${B(n)} shape. The watch stops listing this complication for ${B(n)} slots.`;return le(e,"shape","Remove this shape",u`
    <div class="adders">
      <button class="danger small" ?disabled=${t} title=${i} @click=${()=>e.removeFamily(n)}>Remove the ${B(n)} shape</button>
    </div>
    ${t?u`<div class="hint">This is the only shape. Add another before removing it.</div>`:u`<div class="hint">The watch stops listing this complication for ${B(n)} slots.</div>`}`,{color:Y.place,icon:"delete",summary:t?"The only shape":"Drops its layout"})}function Wd(e){let n=e.config.inline;if(!n)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=re(e);return u`
    ${le(e,"content","Inline text",u`
      ${ne("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${ee(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${ge("Live countdown",n.countdown===!0,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${n.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:te.text,icon:"text",summary:st(`${n.label?`${n.label}: `:""}${ce(n.value,i)}`,48)})}
    ${le(e,"symbol","Symbol",u`
      ${zo(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</div>`,{color:te.icon,icon:"icon",summary:n.symbol||"None"})}`}function jd(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return u`
    ${V("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=M("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?u`
      ${ee(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${ae("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${V("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=M("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:M("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?u`
      ${ee(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${ge("Live countdown",n.bezelCountdown===!0,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&n.bezelGauge?qd(e,n.bezelGauge,t):f}`}function qd(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return u`
    ${ee(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${j("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${j("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${ae("Arc colour (min end)",i[0],a(0))}
    ${ae("Arc colour (middle)",i[1],a(1))}
    ${ae("Arc colour (max end)",i[2],a(2))}
    ${ge("End number labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let l=o.bezelGauge;r?(l.minLabel=M(String(l.minValue)),l.maxLabel=M(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${n.minLabel?ee(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${n.maxLabel?ee(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var Au=Z.map(e=>[e,B(e)]),ia={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Yd=Object.keys(ia);function Jd(e){let n=yn[e];return Yd.filter(t=>n.includes(fe[t]))}var Xd={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function Hn(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function st(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Zd(e){if(!e||Fe(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function ce(e,n){return`${Xo(e,n)}${Zd(e.format)}`}function Xo(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${st(t.value,40)}"`:"(empty)";case"entityState":return Hn(t,n);case"entityAttribute":return t.attribute?`${Hn(t,n)} \xB7 ${t.attribute}`:Hn(t,n);case"entityAge":return`age of ${Hn(t,n)}`;case"aggregate":return Qd(t.aggregate);case"time":return Xd[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${st(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(ft.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Xo(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function Qd(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Pn(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function ec(e,n,t,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return u`
    ${n.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:f}
    ${n.map((o,l)=>tc(e,o,l,n.length,t,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Vt())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function tc(e,n,t,i,a,r,o){let l=e.liveBranch(n),s=e.forced.get(n.id)??"live",d=c=>s==="live"?c==="live":s==="otherwise"?c==="otherwise":s.caseId===c,p=(c,h)=>r(g=>{let y=g.find(k=>k.id===n.id);y&&c(y)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>Pn(c,t,t-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(c=>Pn(c,t,t+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(c=>{let h=c.findIndex(g=>g.id===n.id);h>=0&&c.splice(h,1)})}>${z("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
      ${n.cases.map((c,h)=>u`<button class="${d(c.id)?"active":""} ${l===c.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:c.id})}>Case ${h+1}</button>`)}
      ${n.otherwise?u`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:f}
    </div>
    ${n.cases.map((c,h)=>nc(e,c,h,n,a,p,`${o}-${c.id}`))}
    <div class="adders"><button class="small" @click=${()=>p(c=>{c.cases.push(ki())})}>+ case</button></div>
    ${ge("Otherwise (when no case matches)",n.otherwise!==void 0,c=>p(h=>{c?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${n.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?u`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${Zo(e,n.otherwise,a,c=>p(h=>{h.otherwise&&c(h.otherwise)}),`${o}-otherwise`)}
        </div>`:f}
  </div>`}function nc(e,n,t,i,a,r,o){let l=(d,p)=>r(c=>{let h=c.cases.find(g=>g.id===n.id);h&&d(h)},p),s=e.liveBranch(i)===n.id;return u`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${s?u` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(d=>Pn(d.cases,t,t-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(d=>Pn(d.cases,t,t+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let p=d.cases.findIndex(c=>c.id===n.id);p>=0&&d.cases.splice(p,1)})}>${z("delete")}</button>
    </div>
    <div class="row-inline">
      ${V("When",n.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(p=>{p.when.join=d}))}
    </div>
    ${n.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:f}
    ${n.when.tests.map((d,p)=>ic(e,d,p,c=>l(h=>{let g=h.when.tests.find(y=>y.id===d.id);g&&c(g)}),()=>l(c=>{c.when.tests=c.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(wi())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${Zo(e,n.then,a,d=>l(p=>d(p.then)),`${o}-then`)}
  </div>`}function ic(e,n,t,i,a,r){let o=(c,h)=>i(c,h?`${r}-${h}`:void 0),l=n.comparison,s=nt(l.kind),d=e.evaluateTest(n),p=f;switch(s){case"value":p=ee(e,l.value??M(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":p=u`${ee(e,l.value??M(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${ee(e,l.upper??M(""),c=>o(h=>{h.comparison.upper=c},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":p=u`${ne("Pattern",l.pattern??"",c=>o(h=>{h.comparison.pattern=c},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!ac(l.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"options":p=ne("Options (comma separated)",(l.options??[]).join(", "),c=>o(h=>{h.comparison.options=c.split(",").map(g=>g.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${z("delete")}</button>
    </div>
    ${l.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:ee(e,n.value,c=>o(h=>{h.value=c},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${V("Comparison",l.kind,yr.map(c=>[c,$t[c]]),c=>o(h=>{h.comparison=$i(h.comparison,c)}))}
    ${p}
  </div>`}function ac(e){try{return new RegExp(e),!0}catch{return!1}}function Zo(e,n,t,i,a){let r=Jd(t);return u`
    ${n.length===0?u`<div class="hint">No changes.</div>`:f}
    ${n.map((o,l)=>rc(e,o,l,t,(s,d)=>i(p=>{p[l]&&s(p[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(it(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>u`<option value=${o}>${ia[o]}</option>`)}
    </select>`}var Qo=["setColor","setBorderColor","setBackgroundColor"];function rc(e,n,t,i,a,r,o){let l=!yn[i].includes(fe[n.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${ia[n.kind]}${l?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${z("delete")}</button>
    </div>
    ${es(e,n,a,o)}
  </div>`}function es(e,n,t,i){let a=bn(n.kind),r=f;if(a==="value"){let o=n.value??M("");if(Qo.includes(n.kind)){let l=o.kind.kind==="literal";r=u`${l?ae("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>t(d=>{d.value=M(s??"#FFFFFF")},"color")):ee(e,o,s=>t(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:M("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?f:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=ee(e,o,l=>t(s=>{s.value=l},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1}:{step:.5,min:0};r=j(n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Degrees":n.kind==="setFontSize"?"Points":"Value",n.number??0,l=>t(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=V("Weight",n.weight??"regular",ta,o=>t(l=>{l.weight=o})));return r}var Zi=new Set,Ln=new Map,_n=new Map,Ro=new Map;function ts(e,n,t,i,a,r){let o=Bi(n);return!o.ok||Zi.has(a)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{Zi.delete(a),Ce(s.target)}}>Show as table</button>
        ${o.ok?f:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${ec(e,n,t,i,a)}`:oc(e,o.table,n[0],t,i,a,r)}function oc(e,n,t,i,a,r,o){let l=(x,C)=>e.update(I=>{let P=a(I);P&&x(P)},C?`${r}-${C}`:void 0),s=n.value??Ro.get(r)??o,d=n.rows.length===0,p=n.numberMode||d&&s!==void 0&&!co(s)&&sc(e.resolve(s)),c=yn[i],h=Ln.get(r)??new Set,g=n.columns.length===0&&h.size===0?[lo[i]]:[],y=Qr(n.columns,[...h,...g.filter(x=>x!==void 0)],c),k=t?e.liveBranch(t):"none",w=t?e.forced.get(t.id)??"live":"live",E=x=>w!=="live"&&(w==="otherwise"?x==="otherwise":w.caseId===x),R=x=>{t&&e.setForced(t.id,E(x)?"live":x==="otherwise"?"otherwise":{caseId:x})},m=x=>{Ro.set(r,x),n.rows.length!==0&&l(C=>ro(C,x),"lhs")},b=()=>l(x=>io(x,s??M(""),p)),$=n.rows.map((x,C)=>Mo(e,{key:`${r}-${x.caseId}`,label:so(x.comparison,I=>ce(I,re(e))),columns:y,changes:x.changes,live:k===x.caseId,forced:E(x.caseId),onForce:()=>R(x.caseId),when:uc(e,x.comparison,`${r}-${x.caseId}`,(I,P)=>l(S=>{let T=S[0]?.cases.find(J=>J.id===x.caseId)?.when.tests[0];T&&I(T.comparison)},P&&`${x.caseId}-${P}`)),updChanges:(I,P)=>l(S=>{let T=S[0]?.cases.find(J=>J.id===x.caseId);T&&I(T.then)},P&&`${x.caseId}-${P}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${C===0} @click=${()=>l(I=>Gi(I,C,C-1))}>${z("up")}</button>
      <button class="icon" title="Move down" ?disabled=${C===n.rows.length-1} @click=${()=>l(I=>Gi(I,C,C+1))}>${z("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(I=>ao(I,x.caseId))}>${z("delete")}</button>`})),_=n.otherwise===void 0?f:Mo(e,{key:`${r}-otherwise`,label:"Otherwise",columns:y,changes:n.otherwise,live:k==="otherwise",forced:E("otherwise"),onForce:()=>R("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(x,C)=>l(I=>{let P=I[0]?.otherwise;P&&x(P)},C),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(x=>Ui(x,!1))}>${z("close")}</button>`}),N=_n.get(r),X=lc.filter(x=>c.includes(x)&&!y.includes(x));return u`
    <div class="states">
      ${ee(e,s??M(""),m,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?u`<div class="hint">Choose what these states look at.</div>`:f}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${y.map(x=>u`<th>
              <span>${Ne[x]}</span>
              <button class="icon" title=${`Remove the ${Ne[x]} column`}
                @click=${C=>{_n.set(r,x),Ce(C.target)}}>${z("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${$}
          ${_}
          ${n.rows.length===0&&n.otherwise===void 0?u`<tr><td class="empty-row" colspan=${y.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${N===void 0?f:u`<div class="hint warn confirm-row">
        Remove the ${Ne[N]} column? Its ${Io(n,N)} value${Io(n,N)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${x=>{_n.delete(r),Ln.get(r)?.delete(N),Ce(x.target),l(C=>oo(C,N))}}>Remove</button>
        <button class="small" @click=${x=>{_n.delete(r),Ce(x.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${b}>+ state</button>
        ${n.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(x=>Ui(x,!0))}>+ otherwise</button>`:f}
        <span class="spacer"></span>
        ${w==="live"?f:u`<button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button>`}
        ${X.length===0?f:u`<select class="chip-add" title="Add a column" @change=${x=>{let C=x.target,I=C.value;if(C.value="",!I)return;let P=Ln.get(r)??new Set;P.add(I),Ln.set(r,P),Ce(C)}}>
          <option value="" selected>+ column…</option>
          ${X.map(x=>u`<option value=${x}>${Ne[x]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${p?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${x=>{Zi.add(r),Ce(x.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function sc(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var lc=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Io(e,n){let t=0;for(let i of e.rows)Rn(i.changes,n)&&(t+=1);return e.otherwise&&Rn(e.otherwise,n)&&(t+=1),t}function dc(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Mo(e,n){return u`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{dc(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>u`<td>${cc(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function cc(e,n,t,i,a){let r=Rn(t,n),o=ea(a);if(!r)return u`<button type="button" class="cell empty" title=${`Set ${Ne[n]} for this state`}
      @click=${d=>{i(p=>{p.push(it(Zr[n]))}),$d(d.target,o)}}>unchanged</button>`;let l=(d,p)=>i(c=>{let h=c.find(g=>fe[g.kind]===n);h&&d(h)},p&&`${n}-${p}`),s=Ne[n];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${pc(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${No}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Yt.has(o)?u`${n==="visibility"?V("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(p=>{p.kind=d})):es(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(p=>{let c=p.findIndex(h=>fe[h.kind]===n);c>=0&&p.splice(c,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:f}
    </div>`}function pc(e,n){if(n.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return u`<span class="cell-word">Shown</span>`;let t=bn(n.kind);if(t==="number")return u`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return u`<span class="cell-word">${ta.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??M(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Qo.includes(n.kind))return u`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Se(a):ce(i,re(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return u`${r??f}<span class="cell-word">${a}</span>`}return u`<span class="cell-word">${ce(i,re(e))}</span>`}function Se(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function uc(e,n,t,i){let a=nt(n.kind),r=Vi(n.kind),o=(l,s,d,p)=>mc(e,l,s,`${t}-${d}`,r,p,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${de(l=>i(s=>{let d=$i(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${Di.map(l=>u`<option value=${l} ?selected=${l===n.kind}>${hc(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??M(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?u`<span class="when-and">to</span>${o(n.upper??M(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:f}
  </span>`}function hc(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return $t[e]}}function mc(e,n,t,i,a,r,o){let l=ea(i),s={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return u`<span class="rhs">
      ${ee(e,n,t,{...s,compact:!0})}
    </span>`;let d=n.kind.value;return u`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${de(p=>t({...n,kind:{kind:"literal",value:p}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${Oo(e,l,o,n,t,s)}
  </span>`}var Jt=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:mi,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function rs(e){return Jt.find(n=>n.kind===e)??Jt[0]}var ns="#FF9F0A",aa="#8E8E93",fc=["#FF453A","#FFD60A","#34C759"],os=["#0A84FF","#34C759","#FF9F0A"];function gc(e){return e?.attributes?.device_class==="battery"?fc:os}var yc={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function bc(e){let n=e.iconName?.trim();return n?{off:n,on:n}:yc[ra(e)]??{off:"circle",on:"circle.fill"}}function vc(e){switch(ra(e)){case"lock":return{kind:"equals",value:M("locked")};case"cover":case"valve":return{kind:"equals",value:M("open")};case"media_player":return{kind:"equals",value:M("playing")};default:return{kind:"isOn"}}}function ra(e){return e.domain||e.entityId.split(".")[0]||""}function dt(e){return{...e,domain:ra(e)}}function xc(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function On(e){return Math.round(e*1e4)/1e4}function Nn(e,n,t){return Math.min(t,Math.max(n,e))}function oa(e,n,t){let i=pe[e],a=Nn(On(n/i.width),0,1),r=Nn(On(t/i.height),0,1);return{x:On((1-a)/2),y:On((1-r)/2),width:a,height:r,rotationDegrees:0}}function wc(e){let n=pe[e],t=Nn(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:oa(e,t*1.3,t*1.3),size:t}}function kc(e){let n=pe[e],t=Nn(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:oa(e,n.width*.88,t*1.7),size:t}}function $c(e){let n=pe[e],t=Math.min(n.width,n.height)*.9;return{frame:oa(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function ss(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function Cc(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Sc(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function St(e,n,t,i){let a=i(t);n.payload.frame=a.frame,Sc(n,a.size);for(let r of Z){if(r===t||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[n.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function Et(e){return Ge(e)}function sa(e,n){let t={kind:{kind:"entityState",...dt(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function is(e){let n=it("setIcon");return n.value=M(e),n}function lt(e){let n=it("setColor");return n.value=M(e),n}function Ec(e,n){let t=Vt(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...dt(e)}},a.comparison=vc(e);let r=n.on!==n.off;return i.then=r?[is(n.on),lt(ns)]:[lt(ns)],t.otherwise=r?[is(n.off),lt(aa)]:[lt(aa)],t}function Tc(e){let n=Vt(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...dt(e)}},i.comparison={kind:"isUnavailable"};let a=it("setOpacity");return a.number=.35,t.then=[a],n}function as(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Fc(e,n,t=os){let i=n.max-n.min,a=as(n.min+i/3),r=as(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:M(a)},changes:[lt(t[0])]},{comparison:{kind:"between",value:M(a),upper:M(r)},changes:[lt(t[1])]},{comparison:{kind:"greaterThan",value:M(r)},changes:[lt(t[2])]}];return eo(sa(e),o)}function Rc(e,n,t){let i=Et("icon"),a=bc(n);return i.payload.symbol=M(a.off),i.payload.colorSlot.baseColorHex=aa,i.payload.rules=[Ec(n,a)],St(e,i,t.family,wc),e.elements.push(i),mn(e,i.payload.id,{type:"toggleEntity",...dt(n)}),i.payload.id}function Ic(e,n,t){let i=Et("text");return i.payload.value=sa(n,t.state),i.payload.rules=[Tc(n)],St(e,i,t.family,kc),e.elements.push(i),i.payload.id}function Mc(e,n,t){let i=Et("gauge");i.payload.value=sa(n);let a=xc(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Fc(n,a,gc(t.state))],St(e,i,t.family,$c),e.elements.push(i),i.payload.id}function Ac(e,n,t){let i=Et("chart");return i.payload.value={kind:{kind:"entityState",...dt(n)}},i.payload.highlight="both",i.payload.marker="pointer",St(e,i,t.family,ss),e.elements.push(i),i.payload.id}function Hc(e,n,t){let i=Et("chart");return i.payload.value={kind:{kind:"entityState",...dt(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",St(e,i,t.family,ss),e.elements.push(i),i.payload.id}function Lc(e,n,t){let i=Et("image");return i.payload.entity=dt(n),St(e,i,t.family,Cc),e.elements.push(i),i.payload.id}function ls(e,n,t,i){switch(n){case"toggle":return Rc(e,t,i);case"status":return Ic(e,t,i);case"gauge":return Mc(e,t,i);case"chart":return Ac(e,t,i);case"history":return Hc(e,t,i);case"camera":return Lc(e,t,i)}}var zc=3e4,Pc=500,ds="preset-entity",Oc={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function la(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function Nc(e){return e.kind==="family"?"look":"content"}function Dc(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}var cs=300,ps=400,us=52,hs=36,Vc=[1,1.7,2.6],Bc=["S","M","L"],ms=["Small","Medium","Large"],fs="wrist-assistant-panel.layers.v1",De=34,ct=200,Gc=720,Dn=320,Uc=80,Kc=56,gs="wrist-assistant-panel.columns.v2",da=e=>Math.max(ct,Math.min(Gc,Math.round(e))),ys=e=>e.metaKey||e.ctrlKey||e.shiftKey,Xt=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",We=Xt==="Cmd"?"\u2318":"Ctrl+",ca=Xt==="Cmd"?"\u21E7":"Shift+";function bs(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-Uc;if(i>=ct*2+Dn){let r=i-Dn,o=n,l=t;if(o+l>r){let s=r/(o+l);o=Math.max(ct,Math.floor(o*s)),l=Math.max(ct,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(ct,o-d):l=Math.max(ct,l-d))}return{columns:3,left:o,right:l}}let a=e-Kc;return a>=ct+Dn?{columns:2,left:Math.min(n,a-Dn),right:t}:{columns:1,left:n,right:t}}var A=class extends Be{constructor(){super(...arguments);this.narrow=!1;this.colLeft=cs;this.colRight=ps;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Ut.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=Wr(()=>this.requestUpdate());this.imageSizes=jr(()=>this.requestUpdate());this.symbols=new En(()=>this.requestUpdate());this.keyHandler=t=>this.onKey(t);this.heldArrows=new Set;this.keyUpHandler=t=>{this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||_o(ds)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=Bn`
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
      --wa-text: ${ue(te.text)};
      --wa-icon: ${ue(te.icon)};
      --wa-gauge: ${ue(te.gauge)};
      --wa-shape: ${ue(te.shape)};
      --wa-image: ${ue(te.image)};
      --wa-tap: ${ue(te.tap)};
      --wa-states: ${ue(Y.states)};
      --wa-place: ${ue(Y.place)};
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

    .add-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
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
    .layers { display: flex; flex-direction: column; gap: 6px; --thumb-w: ${us}px; --thumb-h: ${hs}px; }
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
    .layer .lockbtn.on { opacity: 1; color: ${ue(Y.locked)}; filter: drop-shadow(0 0 4px ${ue(Y.locked)}); }
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
    .layer.drop-before { border-top: ${De}px solid transparent; }
    .layer.drop-after { border-bottom: ${De}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${De}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${De}px; }
    .layer.drop-after::after { bottom: -${De}px; }

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
    /* A section is a stack of blocks, not one run of prose. Every control
       block after the first draws a hairline above itself, and the hint that
       explains a block stays under it on the same side of the line, so the
       eye gets "control, then why" in pairs instead of a wall.

       Only direct children are ruled: the fields inside a .grid2 are one
       block and must not be cut apart from each other. */
    .sec-b > :is(.field, .grid2, .grid4, .chart-numbers, .adders, .states-switch, .value-editor, details.sub) {
      margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--wa-line);
    }
    .sec-b > :is(.field, .grid2, .grid4, .chart-numbers, .adders, .states-switch, .value-editor, details.sub):first-child {
      margin-top: 0; padding-top: 0; border-top: 0;
    }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let t=window.localStorage.getItem(gs);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=da(i.left)),typeof i.right=="number"&&(this.colRight=da(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(gs,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let t=window.localStorage.getItem(fs);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(fs,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return u`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=cs:this.colRight=ps,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=bs(this.panelWidth,this.colLeft,this.colRight),l=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=c=>{if(c.pointerId!==i.pointerId)return;let h=c.clientX-r,g=da(t==="left"?l+h:l-h);t==="left"?this.colLeft=g:this.colRight=g},d=c=>{c.pointerId===i.pointerId&&(p(),this.saveColumnWidths())},p=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||la(i)!==la(this.inspect))&&(this.openSections=new Set(Qi))}}updated(t){let i=la(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}t.key==="Escape"&&(this.timestampActiveId=void 0);let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!r){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!r){this.deleteSelection()&&t.preventDefault();return}let o=Oc[t.key];if(o&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(o.dx,o.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!a?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!a&&(t.preventDefault(),this.redo()),a||r))return;let s=t.key.toLowerCase(),d=!0;s==="a"?this.selectAll():s==="c"?this.copySelection():s==="x"?this.copySelection()&&this.deleteSelection():s==="v"?this.pasteClip():s==="d"?this.duplicateSelection():s==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():s==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):d=!1,d&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?_e(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)fn(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=vi(t,i),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=[];this.mutate(a=>{i=xi(a,t)}),this.selectRows(i)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=vi(t,i),r=[];this.mutate(o=>{r=xi(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=t.elements.filter(a=>!se(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?Le(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>Nt(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(l=>t.elements.find(s=>s.payload.id===l)).filter(l=>l!==void 0).some(l=>!be(t,a,l).isHidden);this.mutate(l=>{for(let s of i)ye(l,a,s,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(c=>!se(a,c)),o=a.elements.filter(c=>se(a,c)),l=r.findIndex(c=>c.payload.id===t),s=l+i;if(l<0||s<0||s>=r.length)return;[r[l],r[s]]=[r[s],r[l]];let d=r[s],p=r[l];d.payload.groupId!==p.payload.groupId&&(p.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=p.payload.groupId),a.elements=[...r,...o],ze(a),yt(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await Ra(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${je(t)}`}}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=Ar(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await _a(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Ia(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token,this.polling=t.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${je(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=at.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=dr(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=je(i)}this.scheduleTemplates(0)}startNew(t){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new at(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return Wa(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Ma(this.hass,this.ownerId);this.polling=t.polling,this.serverToken=t.token,this.appliedToken=t.applied_token,t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=je(t)}}renderSendButton(){let t=br({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(t.kind==="unsupported")return f;let i=vr(t),a=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return u`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<ei}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Ei(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Qa(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(Pc))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new Pe(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||Gr(t.app_version):!0}get canvasFamily(){if(Kt(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&Or(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Pr(t)[0]??"rectangular")}addShape(t){this.mutate(i=>Nr(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!wt(i,t))return;let a=Vr(i,t);a.length>0&&!window.confirm(`Remove the ${B(t)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>Dr(r,t)),this.ensureActiveFamily())}createNew(t){this.newShapeChooser=!1,this.startNew(cr("New complication",this.freeSlot(),[t]))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=q(),l.slotIndex=o,i=new at(l,null)}let a=i.encoded(),r=await Aa(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=at.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=je(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let t=await Ha(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!t.ok){t.error==="conflict"?this.conflict={current:t.current??null,message:t.message??"This complication changed on the server."}:this.saveError=t.message??t.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(t){this.saveError=je(t)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=q(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await La(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=je(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},zc)}async refreshHistorySeries(){let t=this.draft?.config,i=t?ri(t):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points};try{let r=await Pa(this.hass,a),o=new Map;for(let[l,s]of Object.entries(r))s.ok&&o.set(l,s.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await za(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=$r(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=je(i)}}buildContext(){let t=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=Wc(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),t.set(i,l)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return u`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return u`<button class="pick" ?disabled=${t}
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}><span class="glyph">⤢</span>Expand</button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[t],l=t==="corner"?104/124:o.width/o.height;return u`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,t)}
        <span class="spacer"></span>
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${l}`}>
        ${this.renderBigPreview(t,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let t=We,i=ca,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Xt}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=l=>l.map(([s,d])=>u`<tr><th scope="row"><kbd>${s}</kbd></th><td>${d}</td></tr>`);return u`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?yi(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){if(this.picking){i.preventDefault(),this.pickAt(t,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let w=this.focusTapId();if(w!==void 0&&o===w&&l&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,l,w,r??void 0);return}let E=this.hitLayerId(i);E?this.inspect={kind:"layer",id:E}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let p=ys(i);if(!p&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let c=yi(this.draft.config,o),h=this.draft.config.elements.find(w=>w.payload.id===c);if(!c||!h)return;if(p){i.preventDefault(),this.togglePick(c);return}let g=Le(this.draft.config,c);if(g?.locked&&!r&&!d){this.beginGroupGesture(t,i,l,g);return}if((this.inspect.kind!=="layer"||this.inspect.id!==c)&&(this.inspect={kind:"layer",id:c},r))return;i.preventDefault();let y=be(this.draft.config,t,h).frame,k=this.gestureCanvas(t);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=c;let w=h.payload,E=me[t],R=y.width*E.width,m=y.height*E.height,b={x:0,y:0,w:R,h:m,cx:R/2,cy:m/2},$=$n(w,b,kn(new Date));if(this.cancelGesture?.(),s){let x=k.width/E.width,C=w.timestampSize;this.cancelGesture=bo(l,i,s,{w:$.w*x,h:$.h*x},(I,P)=>{let S=Math.min(40,Math.max(4,Math.round(C*I)));this.mutate(T=>{let J=T.elements.find(ve=>ve.payload.id===c);J?.kind==="image"&&(J.payload.timestampSize=S)},`ts-size-${c}`),P&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let _={x:0,y:0,w:y.width*k.width,h:y.height*k.height},N=Ae(w)?{x:w.timestampX,y:w.timestampY}:{x:($.x+$.w/2)/b.w,y:($.y+$.h/2)/b.h},X=!1;this.cancelGesture=yo(l,_,i,N,(x,C,I)=>{I||(X=!0),X&&this.mutate(P=>{let S=P.elements.find(T=>T.payload.id===c);S?.kind==="image"&&(S.payload.timestampX=x,S.payload.timestampY=C)},`ts-${c}`),I&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=Mn(l,k,i,{elementId:c,frame:y,handle:r??void 0},{onFrame:(w,E,R)=>{this.mutate(m=>ye(m,t,w,{frame:E}),`drag-${w}-${t}`),R&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r){let o=this.draft?.config;if(!o)return;let l=_e(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(w=>[w.payload.id,be(o,t,w).frame])),d=[...s.values()],p=Math.min(...d.map(w=>w.x)),c=Math.min(...d.map(w=>w.y)),h=Math.max(...d.map(w=>w.x+w.width)),g=Math.max(...d.map(w=>w.y+w.height)),y={x:p,y:c,width:h-p,height:g-c,rotationDegrees:0},k=w=>Math.round(w*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=Mn(a,this.gestureCanvas(t),i,{elementId:r.id,frame:y},{onFrame:(w,E,R)=>{let m=E.x-y.x,b=E.y-y.y;this.mutate($=>{for(let[_,N]of s)ye($,t,_,{frame:{...N,x:k(N.x+m),y:k(N.y+b)}})},`drag-group-${r.id}-${t}`),R&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?fo:1,l=t*o,s=i*o,d=this.canvasFamily,p=me[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,p,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let w=this.inspect.id;return this.nudgeMany(_e(r,w).map(E=>E.payload.id),d,p,`nudge-group-${w}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let c=this.inspect.id,h=r.elements.find(w=>w.payload.id===c);if(!h)return!1;let g=Le(r,c);if(g?.locked)return this.nudgeMany(_e(r,g.id).map(w=>w.payload.id),d,p,`nudge-group-${g.id}-${d}`,l,s);let y=be(r,d,h).frame,k=Wi(y,l,s,p);return(k.x!==y.x||k.y!==y.y)&&this.mutate(w=>ye(w,d,c,{frame:k}),`nudge-${c}-${d}`),!0}nudgeMany(t,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=b=>Math.round(b*1e3)/1e3,p=new Map;for(let b of t){let $=s.elements.find(_=>_.payload.id===b);$&&p.set(b,be(s,i,$).frame)}if(p.size===0)return!1;let c=[...p.values()],h=Math.min(...c.map(b=>b.x)),g=Math.min(...c.map(b=>b.y)),y=Math.max(...c.map(b=>b.x+b.width)),k=Math.max(...c.map(b=>b.y+b.height)),w={x:h,y:g,width:y-h,height:k-g,rotationDegrees:0},E=Wi(w,o,l,a),R=E.x-w.x,m=E.y-w.y;return(R!==0||m!==0)&&this.mutate(b=>{for(let[$,_]of p)ye(b,i,$,{frame:{..._,x:d(_.x+R),y:d(_.y+m)}})},r),!0}nudgeTimestamp(t,i,a,r){let o=this.draft?.config,l=o?.elements.find(w=>w.payload.id===t);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=me[i],p=be(o,i,l).frame,c=p.width*d.width,h=p.height*d.height,g=$n(s,{x:0,y:0,w:c,h,cx:c/2,cy:h/2},kn(new Date)),y=Ae(s)?{x:s.timestampX,y:s.timestampY}:{x:c>0?(g.x+g.w/2)/c:.5,y:h>0?(g.y+g.h/2)/h:.5},k=go(y,a,r,{w:c,h});return(k.x!==y.x||k.y!==y.y)&&this.mutate(w=>{let E=w.elements.find(R=>R.payload.id===t);E?.kind==="image"&&(E.payload.timestampX=k.x,E.payload.timestampY=k.y)},`nudge-ts-${t}`),!0}gestureCanvas(t){let i=wn(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=_i(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:we(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(c=>c.payload.id===r);if(!l||!s)return;let d=se(l,s),p=be(l,t,s).frame;this.cancelGesture?.(),this.cancelGesture=Mn(a,this.gestureCanvas(t),i,{elementId:r,frame:p,handle:o},{onFrame:(c,h,g)=>{this.mutate(y=>{d?hr(y,c,t,h):ye(y,t,c,{frame:h})},`tap-box-${c}-${t}`),g&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:bs(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1><span class="mark">${z("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:f}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>u`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${pa(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:f}
      ${this.helpOpen?this.renderHelpDialog():f}
      ${this.watchSupported?u`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${Ur(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(B).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(t){return u`<span class="shape-dots">${xt.map(i=>u`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${B(i)}></span>`)}</span>`}renderPicker(){let t=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=t?t.config.name.trim()||"Untitled":"No complication",r=t?t.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:t&&t.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:f}
        ${z("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(t&&t.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.map(s=>s.kind==="record"?u`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(Dc(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:u`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${t&&t.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:f}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${z("plus")}<span class="pk-name">New complication</span>${l<0?u`<span class="pk-badge">watch is full</span>`:f}
          </button>
          ${this.newShapeChooser&&l>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${xt.map(s=>u`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${B(s)}</button>`)}
            </div>
          </div>`:f}`:f}
      </div>`:f}
    </div>`}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.newShapeChooser=!1),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(u`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(u`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(u`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?u` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&t.push(u`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&t.push(u`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),t}renderOrphanBanner(){let t=this.selectedOwner;if(!t?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return u`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${t.complication_count} complication${t.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?u`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:u`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${pa(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return f;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return u`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
        <span class="swatch">${z("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?f:u`<span class="mini">${Pi.length} kinds · ${Jt.length} presets</span>`}
        ${a?u`<span class="tool-set" @click=${l=>l.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Compact buttons: the name of each kind, no sample"],["expanded","Expanded buttons: a sample of what each kind draws"]].map(([l,s])=>u`
                  <button class=${this.addDetail===l?"on":""} title=${s} aria-label=${s} aria-pressed=${this.addDetail===l?"true":"false"}
                    @click=${()=>{this.addDetail=l,this.saveListView()}}>${z(l)}</button>`)}
              </span>
            </span>`:f}
        <span class="chev">${z("chevron")}</span>
      </h2>
      ${a?u`
          <div class="add-grid ${r?"":"lean"}">
            ${Pi.map(l=>u`<button class="add" style=${`--k:${te[l]}`} ?disabled=${i} title=${`Add a blank ${kt[l].toLowerCase()} layer`}
              @click=${()=>{let s=Ge(l);this.mutate(d=>{d.elements.push(s)}),this.inspect={kind:"layer",id:s.payload.id}}}
              >${r?u`<span class="well">${ho(l)}</span>`:f}<span class="add-name">${z(l)}<span>${kt[l]}</span></span></button>`)}
          </div>
          <div class="presets-l">Or start from a preset</div>
          <div class="presets">
            ${Jt.map(l=>u`<button class="preset" title=${l.blurb}
              ?disabled=${t.elements.length+l.layerCount>64}
              @click=${()=>this.openPreset(l.kind)}>${l.title}</button>`)}
          </div>`:f}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let l=o.elements.filter(y=>!se(o,y)),s=o.elements.filter(y=>se(o,y)),d=[...l].reverse(),p=d.find(y=>y.payload.id===i);if(!p)return;let c=o.groups?.find(y=>y.id===t),h=c?d.filter(y=>y.payload.groupId===c.id):d.filter(y=>y.payload.id===t);if(h.length===0||h.includes(p))return;d=d.filter(y=>!h.includes(y));let g;if((c||r)&&p.payload.groupId!==void 0){let y=d.filter(k=>k.payload.groupId===p.payload.groupId);g=a?d.indexOf(y[0]):d.indexOf(y[y.length-1])+1}else g=d.indexOf(p)+(a?0:1);if(d.splice(g,0,...h),!c){let y=h[0],k=r?void 0:p.payload.groupId;k===void 0?delete y.payload.groupId:y.payload.groupId=k}o.elements=[...d.reverse(),...s],ze(o),yt(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=o.top+(r.classList.contains("drop-before")?De:0),s=o.bottom-(r.classList.contains("drop-after")?De:0);this.markDrop(r,a.clientY<(l+s)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(ys(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(s=>!se(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(t);if(o<0||l<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=ci(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return f;let i=this.canEdit,a=this.canvasFamily,r=(x,C)=>this.moveLayer(x,C),o=x=>{let C;this.mutate(I=>{C=fr(I,x)}),C&&(this.inspect={kind:"layer",id:C})},l=x=>{this.mutate(C=>fn(C,x)),this.inspect.kind==="layer"&&this.inspect.id===x&&(this.inspect={kind:"general"})},s=[...t.elements].filter(x=>!se(t,x)).reverse(),d=re(this.host()),p=new Pe(this.buildContext(),this.draft?.config),c=t.perFamily[this.activeFamily],h=this.inspect.kind==="family",g=this.activeFamily==="inline"?"one line of text":`${c?.backgroundColorHex?Se(c.backgroundColorHex):"transparent"} \xB7 ${c?.borderColorHex?`${c.borderWidth} pt border`:"no border"}`,y=[...this.multi].filter(x=>t.elements.some(C=>C.payload.id===x)).length,k=Fi(t,this.buildContext(),this.forced)[a],w=Vc[this.thumbStep],E=Math.round(us*w),R=Math.round(hs*w),m=x=>k?u`<span class="thumb">${zr(k,x,{icons:this.icons,imageSizes:this.imageSizes,width:E,height:R})}</span>`:u`<span class="thumb"></span>`,b=this.layerDetail==="expanded",$=(x,C)=>{let I=x.payload.id,P=this.inspect.kind==="layer"&&this.inspect.id===I,S=be(t,a,x),T=x.payload.isHidden||S.isHidden,J=we(t,I)[0],ve=Wt(x.payload.rules),xe=this.picking&&this.pickHoverId===I,W=this.rowDrag(I,i);return u`<div class="layer ${P?"hl":""} ${xe?"pick":""} ${T?"dim":""} ${this.multi.has(I)?"multi":""} ${C?"kid":""} ${b?"rich":""}"
        style=${`--k:${te[x.kind]}`} tabindex="0" draggable=${W.draggable}
        @pointerenter=${()=>{this.listHoverIds=[I]}}
        @pointerleave=${()=>this.leaveRow([I])}
        @click=${K=>this.clickRow(I,K)}
        @keydown=${K=>{K.key==="Enter"&&(this.inspect={kind:"layer",id:I})}}
        @dragstart=${W.onStart} @dragend=${W.onEnd} @dragover=${W.onOver} @drop=${W.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${z("grip")}</span>
        <span class="bar"></span>
        ${m([I])}
        <span class="name">
          <b>${ke(x,d)}</b>
          <small><span class="kind">${kt[x.kind]}</span> · ${qc(x,p,this.historySeries)}</small>
          ${b?u`<span class="facts">${jc(this.host(),a,x,S).map(K=>u`<span class="fact"><b>${K.label}</b> ${K.value}</span>`)}</span>`:f}
        </span>
        <span class="right">
          <span class="badges">
            ${J?u`<span class="badge tap" title=${`Tappable \xB7 ${ke(J,d)}`}>tap</span>`:f}
            ${x.payload.rules.length===0?f:u`<span class="badge states" title=${ve}>${ve.replace(/\.$/,"").toLowerCase()}</span>`}
            ${T?u`<span class="badge">hidden</span>`:f}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title=${`Bring forward (${We}])`} aria-label="Bring forward" @click=${K=>{K.stopPropagation(),r(I,1)}}>${z("up")}</button>
            <button class="icon" title=${`Send back (${We}[)`} aria-label="Send back" @click=${K=>{K.stopPropagation(),r(I,-1)}}>${z("down")}</button>
            <button class="icon" title=${`${S.isHidden?"Show in":"Hide in"} ${B(a)} (${ca}${We}H)`} aria-label=${S.isHidden?"Show this layer":"Hide this layer"} @click=${K=>{K.stopPropagation(),this.mutate(oe=>ye(oe,a,I,{isHidden:!S.isHidden}))}}>${z(S.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${We}D)`} aria-label="Duplicate" @click=${K=>{K.stopPropagation(),o(I)}}>${z("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${K=>{K.stopPropagation(),l(I)}}>${z("delete")}</button>
          </span>`:f}
        </span>
      </div>`},_=(x,C)=>{let I=this.inspect.kind==="group"&&this.inspect.id===x.id,P=!this.collapsed.has(x.id),S=this.rowDrag(x.id,i),T=C[0],J=C[C.length-1],ve=W=>{let K=W.currentTarget,oe=K.getBoundingClientRect(),pt=oe.top+(K.classList.contains("drop-before")?De:0),vs=oe.bottom-(K.classList.contains("drop-after")?De:0),ua=(W.clientY-pt)/Math.max(1,vs-pt);return ua<.25?"drop-before":!P&&ua>.75?"drop-after":"drop-into"},xe=C.map(W=>W.payload.id);return u`<div class="layer group ${I?"hl":""} ${b?"rich":""}" style=${`--k:${Y.group}`} tabindex="0" draggable=${S.draggable}
        @pointerenter=${()=>{this.listHoverIds=xe}}
        @pointerleave=${()=>this.leaveRow(xe)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:x.id}}}
        @keydown=${W=>{W.key==="Enter"&&(this.inspect={kind:"group",id:x.id})}}
        @dragstart=${S.onStart} @dragend=${S.onEnd}
        @dragover=${W=>{!this.dragId||this.dragId===x.id||(W.preventDefault(),this.markDrop(W.currentTarget,ve(W)))}}
        @drop=${W=>{W.preventDefault();let K=ve(W);this.clearDragMarks();let oe=this.dragId;if(this.dragId=void 0,!(!oe||!T||!J)){if(K==="drop-before"){this.reorderLayer(oe,T.payload.id,!0,!0);return}if(K==="drop-after"){this.reorderLayer(oe,J.payload.id,!1,!0);return}this.isGroupId(oe)||(this.reorderLayer(oe,T.payload.id,!0),this.mutate(pt=>pi(pt,oe,x.id)))}}}>
        <button class="chev" aria-expanded=${P?"true":"false"} title=${P?"Fold the group":"Unfold the group"}
          @click=${W=>{W.stopPropagation();let K=new Set(this.collapsed);P?K.add(x.id):K.delete(x.id),this.collapsed=K}}>${z("chevron")}</button>
        <span class="bar"></span>
        ${m(C.map(W=>W.payload.id))}
        <span class="name">
          <b>${x.name}</b>
          <small><span class="kind">Group</span> · ${C.length} layer${C.length===1?"":"s"} · ${x.locked?"moves as one":"unlocked"}</small>
          ${b?u`<span class="facts"><span class="fact"><b>Holds</b> ${C.map(W=>ke(W,d)).join(", ")}</span></span>`:f}
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${ca}${We}G)`} aria-label="Ungroup" @click=${W=>{W.stopPropagation(),this.mutate(K=>Nt(K,x.id)),I&&(this.inspect={kind:"general"})}}>${z("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${x.locked?"on":""}" ?disabled=${!i}
            title=${x.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${x.locked?"Unlock the group":"Lock the group"}
            @click=${W=>{W.stopPropagation(),this.mutate(K=>{let oe=K.groups?.find(pt=>pt.id===x.id);oe&&(oe.locked=!oe.locked)})}}>${z(x.locked?"lock":"unlock")}</button>
        </span>
      </div>`},N=[],X=new Set;for(let x=0;x<s.length;x++){let C=s[x],I=C.payload.groupId,P=I===void 0?void 0:t.groups?.find(T=>T.id===I);if(!P){N.push($(C,!1));continue}if(X.has(P.id))continue;X.add(P.id);let S=s.filter(T=>T.payload.groupId===P.id);N.push(_(P,S)),this.collapsed.has(P.id)||N.push(u`<div class="group-kids">${S.map(T=>$(T,!0))}</div>`)}return u`<div class="card">
      <h2 class="panel-title tools"><span class="swatch">${z("layers")}</span>Layers<span class="spacer"></span>
        <span class="mini">top draws last</span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([x,C])=>u`
              <button class=${this.layerDetail===x?"on":""} title=${C} aria-label=${C} aria-pressed=${this.layerDetail===x?"true":"false"}
                @click=${()=>{this.layerDetail=x,this.saveListView()}}>${z(x)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${Bc.map((x,C)=>u`
              <button class=${this.thumbStep===C?"on":""} title=${`${ms[C]} row pictures`}
                aria-label=${`${ms[C]} row pictures`} aria-pressed=${this.thumbStep===C?"true":"false"}
                @click=${()=>{this.thumbStep=C,this.saveListView()}}>${x}</button>`)}
          </span>
        </span>
      </h2>
      ${this.activeFamily==="inline"?u`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${B(a)} shape.</div>`:f}
      ${y>=2&&i?u`<div class="group-cta"><span>${y} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${We}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?u`<div class="hint">${Xt}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:f}
      ${t.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:f}
      <div class="layers" style=${`--thumb-w:${E}px;--thumb-h:${R}px`}>
      ${N}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${Y.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${x=>{x.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${x=>{this.dragId&&(x.preventDefault(),this.markDrop(x.currentTarget,"drop-before"))}}
        @drop=${x=>{x.preventDefault(),this.clearDragMarks();let C=this.dragId,I=[...s].reverse().find(P=>P.payload.id!==C&&P.payload.groupId!==C);C&&I&&this.reorderLayer(C,I.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${z("shape")}</span>
        <span class="bar"></span>
        ${m([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${B(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${g}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let t=this.presetKind?rs(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?f:u`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${Ke(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},ds,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=ls(l,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Fi(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${Gt.map(o=>u`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Ut.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(t,r)}
      </div>
      ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):f}
      <div class="strip">
        ${this.renderSettingsRow(t)}
        ${this.renderShapesRow(t,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?Le(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||Le(l,o)?.locked)?_e(l,s).map(y=>y.payload.id):[],p=[...new Set([...d,...this.multi])],c=a.slots[t],h=this.focusTapId(),g={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:c,highlightId:h??o,...p.length>0&&!this.showTaps?{highlightIds:p}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(t,y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${zi(r,g)}
    </div>`}renderUnder(t,i){let a=re(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(c=>c.payload.id===r.id):void 0,l;if(this.showTaps)l=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${He(t.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let c=t.groups?.find(g=>g.id===r.id),h=c?_e(t,c.id).length:0;l=c?u`editing group <b>${c.name}</b>. ${c.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let c=Le(t,o.payload.id);l=c?.locked?u`editing <b>${ke(o,a)}</b> in <b>${c.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${ke(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=wn(s,i),p=Math.round(d.scale*100);return u`<div class="under"><b>${B(i)}</b> · ${s.width} × ${s.height} pt${p!==100?` \xB7 ${p}%`:""} · ${l}</div>`}renderInlinePreview(t,i){let a;if(!t)a=u`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?vt((t.countdownEnd-r)/1e3):t.text,l=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=u`<div class="inline-line">${l??f}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(t){let i=this.host(),a=this.records.find(p=>p.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?pa(r):void 0].filter(Boolean).join(" \xB7 "),l=t.values,s=new Pe(this.buildContext(),this.draft?.config),d=re(i);return u`<div class="strip-row" style=${`--c:${Y.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${z("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${Bo(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let p=Ko();this.mutate(c=>{c.values.push(p)}),this.inspect={kind:"data",id:p.id}}}>Add</button>`:f}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${l.map(p=>{let c=s.resolve({kind:{kind:"named",id:p.id}}),h=this.inspect.kind==="data"&&this.inspect.id===p.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:p.id}}}>
            <span class="name">${p.name||"(unnamed)"}</span>
            <span class="meta ${c===void 0?"none":""}" title=${ce(p.value,d)}>${c??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(y=>{y.values=y.values.filter(k=>k.id!==p.id)}),h&&(this.inspect={kind:"general"})}}>${z("delete")}</button>`:f}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(t,i){let a=t.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${Y.place}`}><span class="swatch">${z("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${xt.map(r=>{if(!a.includes(r))return u`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${B(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${B(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?zi(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Ut.slots[r]}):f}let d=r!=="inline"&&t.elements.every(c=>be(t,r,c).isHidden||c.payload.isHidden)&&t.elements.length>0,p=this.canEdit&&wt(t,r);return u`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${B(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${B(r)}${d?u`<small>· nothing shown</small>`:f}${l?u`<small>· editing</small>`:f}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!p}
              title=${p?`Remove the ${B(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${B(r)} shape`}
              @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${z("delete")}</button>`:f}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let t=this.draft?.config;if(!t)return f;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${Y.states}`}><span class="swatch">${z("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",p=this.testValues.get(r),h=t.elements.find(y=>gn(t,y.payload.id).some(k=>k.ref.entityId===r))?.kind??"text",g=this.editingValue===r;return u`<button class="vchip ${p!==void 0?"testing":""}" style=${`--k:${te[h]}`}
            title=${p!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${y=>{y.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${z(h)}</span><b>${l}</b>
            ${g?u`<input type="text" .value=${p??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${y=>{y.key==="Enter"&&y.target.blur(),y.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${y=>this.commitTestValue(r,y.target.value)} />`:u`<span class="val">${p!==void 0?`${p}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(t,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[t]?.state;a===""||a===o?r.delete(t):r.set(t,a),this.testValues=r}currentCase(){return Gt.find(t=>t.label===this.previewCase)??Ut}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":B(this.activeFamily),l=a.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${Y.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=f,d=f;if(i!==void 0)s=u`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let p=t.elements.find(c=>c.payload.id===a.id);if(p){s=u`<span class="here" style=${`--k:${te[p.kind]}`}><span class="kchip">${kt[p.kind]}</span>${ke(p,re(this.host()))}</span>`;let c=Le(t,p.payload.id);c&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:c.id}}} title="Edit the group">${c.name}</button>`)}}else if(a.kind==="group"){let p=t.groups?.find(c=>c.id===a.id);p&&(s=u`<span class="here" style=${`--k:${Y.group}`}><span class="kchip">Group</span>${p.name}</span>`)}else if(a.kind==="data"){let p=t.values.find(c=>c.id===a.id);p&&(s=u`<span class="here" style=${`--k:${Y.complication}`}><span class="kchip">Value</span>${p.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===f?f:u`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let t=this.draft?.config;if(!t)return f;let i=this.pickedElements(t);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=f,l=!0;if(r.kind==="layer"){let d=t.elements.find(p=>p.payload.id===r.id);if(!d)return this.inspect={kind:"general"},f;o=jo(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=t.groups?.find(p=>p.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=Yo(a,d)}else if(r.kind==="data"){let d=t.values.find(p=>p.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=u`<div class="sec" data-open="true" style=${`--c:${Y.complication}`}>
        <div class="sec-h"><span class="swatch">${z("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${Uo(a,d)}</div>
      </div>`}else r.kind==="family"?o=Jo(a,this.activeFamily):(l=!1,o=u`<div class="empty-insp">${z("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?u`<button class="expand" @click=${()=>{this.openSections=s?new Set([Nc(r)]):new Set(Qi)}}>${s?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(t,i,a){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${t}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:f}</span></label>`}multiEditor(t,i){let a=this.canvasFamily,r=re(this.host()),o=new Pe(this.buildContext(),this.draft?.config),l=Wo(t,a,i),s=i.length,d=[...i].reverse(),p=g=>this.mutate(y=>{for(let k of i)ye(y,a,k.payload.id,{isHidden:g})}),c=g=>this.mutate(y=>{for(let k of i){let w=y.elements.find(E=>E.payload.id===k.payload.id);w&&(w.payload.isHidden=g)}}),h=g=>this.mutate(y=>{for(let k of i){let w=y.elements.find(E=>E.payload.id===k.payload.id);w&&w.kind!=="image"&&w.kind!=="tap"&&(w.payload.colorSlot.baseColorHex=g)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${z("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(g=>u`<div class="row" style=${`--k:${te[g.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${g.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(g.payload.symbol)??"questionmark",16,g.payload.colorSlot.baseColorHex)??f}</span>`:f}
                <b>${ke(g,r)}</b><span class="kind">${kt[g.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${Xt}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" title=${`Group (${We}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${Y.place}`}>
        <div class="sec-h"><span class="swatch">${z("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${B(a)}`,l.hiddenHere,p)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,c)}
          ${l.colourable?u`${ae("Colour",l.colour,g=>{g!==void 0&&h(g)})}
              ${l.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:f}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let t=this.draft;if(!t)return f;let i=this.records.find(r=>r.id===this.selectedId),a=Yr({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?u` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?u`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:f}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?u`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:f}
      </div>
    </details>`}};H([mt({attribute:!1})],A.prototype,"hass",2),H([mt({type:Boolean})],A.prototype,"narrow",2),H([mt({attribute:!1})],A.prototype,"panel",2),H([L()],A.prototype,"colLeft",2),H([L()],A.prototype,"colRight",2),H([L()],A.prototype,"panelWidth",2),H([L()],A.prototype,"owners",2),H([L()],A.prototype,"ownerId",2),H([L()],A.prototype,"records",2),H([L()],A.prototype,"selectedId",2),H([L()],A.prototype,"draft",2),H([L()],A.prototype,"readOnlyReason",2),H([L()],A.prototype,"parseError",2),H([L()],A.prototype,"maxSchemaVersion",2),H([L()],A.prototype,"presets",2),H([L()],A.prototype,"occupied",2),H([L()],A.prototype,"serverToken",2),H([L()],A.prototype,"appliedToken",2),H([L()],A.prototype,"polling",2),H([L()],A.prototype,"sendPending",2),H([L()],A.prototype,"pages",2),H([L()],A.prototype,"templateResults",2),H([L()],A.prototype,"historySeries",2),H([L()],A.prototype,"templateError",2),H([L()],A.prototype,"templateFetchedAt",2),H([L()],A.prototype,"forced",2),H([L()],A.prototype,"showRaw",2),H([L()],A.prototype,"inspect",2),H([L()],A.prototype,"openSections",2),H([L()],A.prototype,"pickerOpen",2),H([L()],A.prototype,"testValues",2),H([L()],A.prototype,"editingValue",2),H([L()],A.prototype,"thumbStep",2),H([L()],A.prototype,"layerDetail",2),H([L()],A.prototype,"addOpen",2),H([L()],A.prototype,"addDetail",2),H([L()],A.prototype,"multi",2),H([L()],A.prototype,"collapsed",2),H([L()],A.prototype,"activeFamily",2),H([L()],A.prototype,"picking",2),H([L()],A.prototype,"pickHoverId",2),H([L()],A.prototype,"listHoverIds",2),H([L()],A.prototype,"zoomed",2),H([L()],A.prototype,"helpOpen",2),H([L()],A.prototype,"showTaps",2),H([L()],A.prototype,"timestampActiveId",2),H([L()],A.prototype,"savedName",2),H([L()],A.prototype,"presetKind",2),H([L()],A.prototype,"presetEntity",2),H([L()],A.prototype,"newShapeChooser",2),H([L()],A.prototype,"previewCase",2),H([L()],A.prototype,"loadError",2),H([L()],A.prototype,"saveError",2),H([L()],A.prototype,"saving",2),H([L()],A.prototype,"conflict",2),H([L()],A.prototype,"remoteRevision",2),H([L()],A.prototype,"confirmDelete",2),H([L()],A.prototype,"moveTarget",2),H([L()],A.prototype,"moving",2),H([L()],A.prototype,"moveError",2),H([L()],A.prototype,"version",2);function je(e){return String(e?.message??e)}function Wc(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function pa(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function jc(e,n,t,i){let a=me[n],r=i.frame,o=d=>Math.round(d),l=[{label:"Shows",value:na(e,t)}],s=zn(t);return s&&l.push({label:"Looks",value:s}),l.push({label:"At",value:`${o(r.x*a.width)}, ${o(r.y*a.height)} pt`}),l.push({label:"Size",value:`${o(r.width*a.width)} x ${o(r.height*a.height)} pt`}),r.rotationDegrees!==0&&l.push({label:"Turned",value:`${Math.round(r.rotationDegrees)}\xB0`}),i.fromPlacement&&l.push({label:"Frame",value:`${B(n)} only`}),l}function qc(e,n,t){let i=a=>u`<span class="val-tok">${a??"--"}</span>`;switch(e.kind){case"text":return u`${i(n.resolve(e.payload.value))} · ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${Se(e.payload.colorSlot.baseColorHex)}`;case"gauge":return u`${i(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let a=tt(e.payload),r=a!==void 0?t.get(a)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Bt(r).length} values`}case"shape":return`${Se(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return He(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",A);export{A as WristAssistantPanel,bs as columnFit,jc as layerFacts};
