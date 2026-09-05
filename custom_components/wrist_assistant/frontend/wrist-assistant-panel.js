var Fo=Object.defineProperty;var Ro=Object.getOwnPropertyDescriptor;var H=(e,t,n,i)=>{for(var a=i>1?void 0:i?Ro(t,n):t,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(t,n,a):o(a))||a);return i&&a&&Fo(t,n,a),a};var Pt=globalThis,Nt=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Sn=Symbol(),zi=new WeakMap,mt=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==Sn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Nt&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=zi.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&zi.set(n,t))}return t}toString(){return this.cssText}},le=e=>new mt(typeof e=="string"?e:e+"",void 0,Sn),En=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new mt(n,e,Sn)},Pi=(e,t)=>{if(Nt)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),a=Pt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=n.cssText,e.appendChild(i)}},Tn=Nt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return le(n)})(e):e;var{is:Io,defineProperty:Ao,getOwnPropertyDescriptor:Mo,getOwnPropertyNames:Ho,getOwnPropertySymbols:Lo,getPrototypeOf:_o}=Object,Ot=globalThis,Ni=Ot.trustedTypes,zo=Ni?Ni.emptyScript:"",Po=Ot.reactiveElementPolyfillSupport,ft=(e,t)=>e,gt={toAttribute(e,t){switch(t){case Boolean:e=e?zo:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Vt=(e,t)=>!Io(e,t),Oi={attribute:!0,type:String,converter:gt,reflect:!1,useDefault:!1,hasChanged:Vt};Symbol.metadata??=Symbol("metadata"),Ot.litPropertyMetadata??=new WeakMap;var Ee=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Oi){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,n);a!==void 0&&Ao(this.prototype,t,a)}}static getPropertyDescriptor(t,n,i){let{get:a,set:r}=Mo(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Oi}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;let t=_o(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){let n=this.properties,i=[...Ho(n),...Lo(n)];for(let a of i)this.createProperty(a,n[a])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,a]of n)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let a=this._$Eu(n,i);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)n.unshift(Tn(a))}else t!==void 0&&n.push(Tn(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:gt).toAttribute(n,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,n){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:gt;this._$Em=a;let l=o.fromAttribute(n,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Vt)(r,n)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Ee.elementStyles=[],Ee.shadowRootOptions={mode:"open"},Ee[ft("elementProperties")]=new Map,Ee[ft("finalized")]=new Map,Po?.({ReactiveElement:Ee}),(Ot.reactiveElementVersions??=[]).push("2.1.2");var Ln=globalThis,Vi=e=>e,Dt=Ln.trustedTypes,Di=Dt?Dt.createPolicy("lit-html",{createHTML:e=>e}):void 0,ji="$lit$",Ae=`lit$${Math.random().toFixed(9).slice(2)}$`,qi="?"+Ae,No=`<${qi}>`,Be=document,bt=()=>Be.createComment(""),vt=e=>e===null||typeof e!="object"&&typeof e!="function",_n=Array.isArray,Oo=e=>_n(e)||typeof e?.[Symbol.iterator]=="function",Fn=`[ 	
\f\r]`,yt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bi=/-->/g,Gi=/>/g,Ve=RegExp(`>|${Fn}(?:([^\\s"'>=/]+)(${Fn}*=${Fn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ui=/'/g,Ki=/"/g,Yi=/^(?:script|style|textarea|title)$/i,zn=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),u=zn(1),k=zn(2),jd=zn(3),Ge=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Wi=new WeakMap,De=Be.createTreeWalker(Be,129);function Ji(e,t){if(!_n(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Di!==void 0?Di.createHTML(t):t}var Vo=(e,t)=>{let n=e.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=yt;for(let l=0;l<n;l++){let s=e[l],d,p,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,p=o.exec(s),p!==null);)h=o.lastIndex,o===yt?p[1]==="!--"?o=Bi:p[1]!==void 0?o=Gi:p[2]!==void 0?(Yi.test(p[2])&&(a=RegExp("</"+p[2],"g")),o=Ve):p[3]!==void 0&&(o=Ve):o===Ve?p[0]===">"?(o=a??yt,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?Ve:p[3]==='"'?Ki:Ui):o===Ki||o===Ui?o=Ve:o===Bi||o===Gi?o=yt:(o=Ve,a=void 0);let y=o===Ve&&e[l+1].startsWith("/>")?" ":"";r+=o===yt?s+No:c>=0?(i.push(d),s.slice(0,c)+ji+s.slice(c)+Ae+y):s+Ae+(c===-2?l:y)}return[Ji(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},xt=class e{constructor({strings:t,_$litType$:n},i){let a;this.parts=[];let r=0,o=0,l=t.length-1,s=this.parts,[d,p]=Vo(t,n);if(this.el=e.createElement(d,i),De.currentNode=this.el.content,n===2||n===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(a=De.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let c of a.getAttributeNames())if(c.endsWith(ji)){let h=p[o++],y=a.getAttribute(c).split(Ae),g=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:g[2],strings:y,ctor:g[1]==="."?In:g[1]==="?"?An:g[1]==="@"?Mn:it}),a.removeAttribute(c)}else c.startsWith(Ae)&&(s.push({type:6,index:r}),a.removeAttribute(c));if(Yi.test(a.tagName)){let c=a.textContent.split(Ae),h=c.length-1;if(h>0){a.textContent=Dt?Dt.emptyScript:"";for(let y=0;y<h;y++)a.append(c[y],bt()),De.nextNode(),s.push({type:2,index:++r});a.append(c[h],bt())}}}else if(a.nodeType===8)if(a.data===qi)s.push({type:2,index:r});else{let c=-1;for(;(c=a.data.indexOf(Ae,c+1))!==-1;)s.push({type:7,index:r}),c+=Ae.length-1}r++}}static createElement(t,n){let i=Be.createElement("template");return i.innerHTML=t,i}};function nt(e,t,n=e,i){if(t===Ge)return t;let a=i!==void 0?n._$Co?.[i]:n._$Cl,r=vt(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=a:n._$Cl=a),a!==void 0&&(t=nt(e,a._$AS(e,t.values),a,i)),t}var Rn=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,a=(t?.creationScope??Be).importNode(n,!0);De.currentNode=a;let r=De.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new wt(r,r.nextSibling,this,t):s.type===1?d=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(d=new Hn(r,this,t)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=De.nextNode(),o++)}return De.currentNode=Be,a}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},wt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=nt(this,t,n),vt(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==Ge&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Be.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=xt.createElement(Ji(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new Rn(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=Wi.get(t.strings);return n===void 0&&Wi.set(t.strings,n=new xt(t)),n}k(t){_n(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,a=0;for(let r of t)a===n.length?n.push(i=new e(this.O(bt()),this.O(bt()),this,this.options)):i=n[a],i._$AI(r),a++;a<n.length&&(this._$AR(i&&i._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=Vi(t).nextSibling;Vi(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},it=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(t,n=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=nt(this,t,n,0),o=!vt(t)||t!==this._$AH&&t!==Ge,o&&(this._$AH=t);else{let l=t,s,d;for(t=r[0],s=0;s<r.length-1;s++)d=nt(this,l[i+s],n,s),d===Ge&&(d=this._$AH[s]),o||=!vt(d)||d!==this._$AH[s],d===f?t=f:t!==f&&(t+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},In=class extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},An=class extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},Mn=class extends it{constructor(t,n,i,a,r){super(t,n,i,a,r),this.type=5}_$AI(t,n=this){if((t=nt(this,t,n,0)??f)===Ge)return;let i=this._$AH,a=t===f&&i!==f||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Hn=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}};var Do=Ln.litHtmlPolyfillSupport;Do?.(xt,wt),(Ln.litHtmlVersions??=[]).push("3.3.3");var Xi=(e,t,n)=>{let i=n?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=n?.renderBefore??null;i._$litPart$=a=new wt(t.insertBefore(bt(),r),r,void 0,n??{})}return a._$AI(e),a};var Pn=globalThis,Me=class extends Ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xi(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ge}};Me._$litElement$=!0,Me.finalized=!0,Pn.litElementHydrateSupport?.({LitElement:Me});var Bo=Pn.litElementPolyfillSupport;Bo?.({LitElement:Me});(Pn.litElementVersions??=[]).push("4.2.2");var Go={attribute:!0,type:String,converter:gt,reflect:!1,hasChanged:Vt},Uo=(e=Go,t,n)=>{let{kind:i,metadata:a}=n,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=n;return function(l){let s=this[o];t.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function at(e){return(t,n)=>typeof n=="object"?Uo(e,t,n):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,t,n)}function L(e){return at({...e,state:!0,attribute:!1})}var He="wrist_assistant/complications";async function Zi(e){return e.connection.sendMessagePromise({type:`${He}/owners`})}async function Qi(e,t){return e.connection.sendMessagePromise({type:`${He}/list`,owner_watch_id:t})}async function ea(e,t){return e.connection.sendMessagePromise({type:`${He}/nudge`,owner_watch_id:t})}async function ta(e,t,n,i){return e.connection.sendMessagePromise({type:`${He}/save`,owner_watch_id:t,document:n,base_revision:i})}async function na(e,t,n,i){return e.connection.sendMessagePromise({type:`${He}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function ia(e,t,n){return e.connection.sendMessagePromise({type:`${He}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function aa(e,t,n){let i={type:`${He}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function ra(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${He}/render_values`,templates:t})).results}var Z=["rectangular","circular","corner"],ge={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},Ko=["rectangular","circular","corner","inline"];var On=64;function ma(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<On;i++)if(!n.has(i))return i;return-1}function $t(e){return Z.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var fa={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},ce={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Wt="#FF6B35",jt="#32D74B",kt=6,Ct=9,Wo=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Te(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Vn(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Dn={top:0,left:0,bottom:0,right:0};function qt(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Bn=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Fe(e){let t=Bn.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function T(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function W(e,t=""){return typeof e=="string"?e:t}function D(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function we(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Kt(e){return e==null?void 0:D(e,0)}function xe(e){return typeof e=="string"?e:void 0}var $e=class extends Error{};function Ke(e){if(typeof e.entityId!="string")throw new $e("entityId is required");let t={entityId:e.entityId,displayName:W(e.displayName),domain:W(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function oa(e){if(!T(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=D(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=D(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=D(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),ke(t)?void 0:t}function ke(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function jo(e){let t=W(e.function,"count"),n=T(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(T).map(Ke)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let a={function:t,scope:i};if(T(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:W(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function sa(e){switch(e.kind){case"literal":return{kind:"literal",value:W(e.value)};case"entityState":return{kind:"entityState",...Ke(e)};case"entityAttribute":return{kind:"entityAttribute",...Ke(e),attribute:W(e.attribute)};case"entityAge":return{kind:"entityAge",...Ke(e)};case"aggregate":return{kind:"aggregate",aggregate:jo(T(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:xe(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:W(e.value)};case"named":return{kind:"named",id:W(e.id).toUpperCase()};default:throw new $e(`unknown value kind ${String(e.kind)}`)}}function te(e){if(!T(e))throw new $e("value must be an object");if(T(e.kind)){let i={kind:sa(e.kind)},a=oa(e.format);return a&&(i.format=a),i}let t={kind:sa(e)},n=oa(e.format);return n&&(t.format=n),t}function ga(e){return T(e)?{x:D(e.x,.25),y:D(e.y,.25),width:D(e.width,.5),height:D(e.height,.5),rotationDegrees:D(e.rotationDegrees,0)}:{...fa}}function qo(e){if(!T(e))return{kind:"isOn"};let t=W(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=T(e.value)?te(e.value):I("");break;case"between":n.value=T(e.value)?te(e.value):I(""),n.upper=T(e.upper)?te(e.upper):I("");break;case"matchesRegex":n.pattern=W(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function la(e){if(!T(e))return{kind:"show"};let t=W(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=T(e.value)?te(e.value):I("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=D(e.number,0);break;case"setFontWeight":n.weight=xe(e.weight)??"regular";break;default:break}return n}function ya(e){return Array.isArray(e)?e.filter(T).map(t=>{let n={id:W(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(T).map(i=>{let a=T(i.when)?i.when:{};return{id:W(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(T).map(r=>({id:W(r.id).toUpperCase(),value:T(r.value)?te(r.value):I(""),comparison:qo(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(la)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(la)),n}):[]}function Yo(e,t){return{baseColorHex:T(e)?W(e.baseColorHex,t):t}}function Ue(e,t){if(typeof e.id!="string")throw new $e("element id is required");return{id:e.id.toUpperCase(),colorSlot:Yo(e.colorSlot,t),rules:ya(e.rules),frame:ga(e.frame),isHidden:e.isHidden===!0}}function Jo(e){let t=Xo(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function Xo(e){if(!T(e)||!T(e.payload))throw new $e("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...Ue(t,"#FFFFFF"),value:T(t.value)?te(t.value):I(""),fontSize:D(t.fontSize,14),fontWeight:xe(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...Ue(t,"#FFFFFF"),symbol:T(t.symbol)?te(t.symbol):I("lightbulb"),size:D(t.size,14)}};case"gauge":return{kind:"gauge",payload:{...Ue(t,"#FFFFFF"),value:T(t.value)?te(t.value):I("50"),minValue:D(t.minValue,0),maxValue:D(t.maxValue,100),style:xe(t.style)??"arc",lineWidth:D(t.lineWidth,4),trackColorHex:W(t.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...Ue(t,"#FFFFFF"),value:T(t.value)?te(t.value):I("13,14,16,17,19,22,24,28,30"),style:xe(t.style)??"bars",limit:Math.max(0,Math.round(D(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:xe(t.scale)??"auto",minValue:D(t.minValue,0),maxValue:D(t.maxValue,100),baseline:xe(t.baseline)??"lowest",barGap:D(t.barGap,1.5),lineWidth:D(t.lineWidth,2),highlight:xe(t.highlight)??"none",highColorHex:W(t.highColorHex,Wt),lowColorHex:W(t.lowColorHex,jt),marker:xe(t.marker)??"pointer"}};case"shape":{let n={...Ue(t,"#FFFFFF33"),kind:xe(t.kind)??"roundedRectangle",cornerRadius:D(t.cornerRadius,6),borderWidth:D(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=Ue(t,"#FFFFFF"),a={...i,entity:Ke(T(t.entity)?t.entity:{}),contentMode:t.contentMode==="fit"?"fit":"fill",zoom:D(t.zoom,1),panX:D(t.panX,0),panY:D(t.panY,0),cornerRadius:D(t.cornerRadius,kt),timestampCorner:Wo.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:D(t.timestampSize,Ct)};t.timestamp===!0&&(a.timestamp=!0);let r=Kt(t.timestampX),o=Kt(t.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=we(r),a.timestampY=we(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:n,...i}=Ue(t,"#FFFFFF"),a={...i,action:T(t.action)?ba(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(a.openPageId=t.openPageId),typeof t.openPageName=="string"&&(a.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(a.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new $e(`unknown element kind ${String(e.kind)}`)}}function da(e){let t=T(e)?e:{},n={};if(T(t.placements))for(let[a,r]of Object.entries(t.placements)){if(!T(r))continue;let o={frame:ga(r.frame),isHidden:r.isHidden===!0},l=Kt(r.size);l!==void 0&&(o.size=l),n[a.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:D(t.borderWidth,2),rules:ya(t.rules)};if(T(t.bezelText)&&(i.bezelText=te(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),T(t.curvedText)&&(i.curvedText=te(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),T(t.bezelGauge)){let a=t.bezelGauge,r={value:T(a.value)?te(a.value):I("50"),minValue:D(a.minValue,0),maxValue:D(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};T(a.minLabel)&&(r.minLabel=te(a.minLabel)),T(a.maxLabel)&&(r.maxLabel=te(a.maxLabel)),i.bezelGauge=r}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function Zo(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=da(e[n+1]))}else if(T(e))for(let[n,i]of Object.entries(e))t[n]=da(i);return t}function Qo(e){let t={value:T(e.value)?te(e.value):I("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function ba(e){if(!T(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Ke(e)};default:return{type:"none"}}}function va(e){if(!T(e))throw new $e("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new $e(`${r} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(T).map(r=>({id:W(r.id).toUpperCase(),name:W(r.name),value:T(r.value)?te(r.value):I("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(T).map(r=>r.kind==="template"?{kind:"template",value:W(r.value)}:r.kind==="entity"?{kind:"entity",...Ke(r)}:null).filter(r=>r!==null),i={schemaVersion:D(e.schemaVersion,1),id:W(e.id).toUpperCase(),name:W(e.name,"Custom"),values:t,slotIndex:D(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Jo),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Zo(e.perFamily),dataSources:n,tapAction:ba(e.tapAction)};T(e.inline)&&(i.inline=Qo(e.inline));let a=Kt(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(T).filter(o=>typeof o.id=="string").map(o=>({id:W(o.id).toUpperCase(),name:W(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return _e(i),i}function G(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function We(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function es(e){let t={};return e.decimals!==void 0&&(t.decimals=G(e.decimals)),e.multiply!==void 0&&(t.multiply=G(e.multiply)),e.offset!==void 0&&(t.offset=G(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function ts(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(We)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function ns(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...We(e)};case"entityAttribute":return{kind:"entityAttribute",...We(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...We(e)};case"aggregate":return{kind:"aggregate",aggregate:ts(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id}}}function Y(e){let t={kind:ns(e.kind)};return ke(e.format)||(t.format=es(e.format)),t}function Gt(e){return{x:G(e.x),y:G(e.y),width:G(e.width),height:G(e.height),rotationDegrees:G(e.rotationDegrees)}}function is(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=Y(e.value??I(""));break;case"between":t.value=Y(e.value??I("")),t.upper=Y(e.upper??I(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function ca(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=Y(e.value??I(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=G(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function Ut(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:Y(a.value),comparison:is(a.comparison)}))},then:i.then.map(ca)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(ca)),n})}function as(e){let t=rs(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function rs(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:Ut(n.rules),frame:Gt(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:Y(e.payload.value),fontSize:G(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:Y(e.payload.symbol),size:G(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...t(e.payload),value:Y(e.payload.value),minValue:G(e.payload.minValue),maxValue:G(e.payload.maxValue),style:e.payload.style,lineWidth:G(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...t(e.payload),value:Y(e.payload.value),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:G(e.payload.minValue),maxValue:G(e.payload.maxValue),baseline:e.payload.baseline,barGap:G(e.payload.barGap),lineWidth:G(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker}};case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:G(e.payload.cornerRadius),borderWidth:G(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:We(n.entity),rules:Ut(n.rules),frame:Gt(n.frame),isHidden:n.isHidden};n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=G(n.zoom)),n.panX!==0&&(i.panX=G(n.panX)),n.panY!==0&&(i.panY=G(n.panY)),n.cornerRadius!==kt&&(i.cornerRadius=G(n.cornerRadius));let a=Te(n),r=a?Vn(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),n.timestampSize!==Ct&&(i.timestampSize=G(n.timestampSize)),a&&(i.timestampX=G(n.timestampX),i.timestampY=G(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:xa(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=Ut(n.rules),i.frame=Gt(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function os(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let a of n){let r=e.placements[a],o={frame:Gt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=G(r.size)),i[a]=o}t.placements=i}if(e.bezelText&&(t.bezelText=Y(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=Y(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:Y(i.value),minValue:G(i.minValue),maxValue:G(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=Y(i.minLabel)),i.maxLabel&&(a.maxLabel=Y(i.maxLabel)),t.bezelGauge=a}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=G(e.borderWidth),e.rules.length>0&&(t.rules=Ut(e.rules)),t}function xa(e){return"entityId"in e?{type:e.type,...We(e)}:{type:e.type}}function ss(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=Y(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function Yt(e){let t=[];for(let i of Z){let a=e.perFamily[i];a&&t.push(i,os(a))}let n={schemaVersion:$t(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:Y(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(as),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...We(i)}),tapAction:xa(e.tapAction)};return e.inline!==void 0&&(n.inline=ss(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function je(e,t){let i=e.elements.find(a=>a.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Le(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!de(e,n))}function _e(e){let t=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!t.has(a.payload.groupId)&&delete a.payload.groupId;let n=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>n.has(a.id));i.length===0?delete e.groups:e.groups=i}function St(e){if(!e.groups?.length)return;let t=e.elements.filter(r=>!de(e,r)),n=e.elements.filter(r=>de(e,r)),i=[],a=new Set;for(let r=t.length-1;r>=0;r--){let o=t[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=t.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...n],qe(e)}function wa(e,t,n="Group"){let i=e.elements.filter(r=>t.includes(r.payload.id)&&!de(e,r));if(i.length<2)return;let a={id:q(),name:n,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return _e(e),St(e),a.id}function Jt(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;_e(e)}function $a(e,t,n){let i=e.elements.find(a=>a.payload.id===t);!i||de(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,_e(e),St(e))}var V={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},pa={literal:["kind","value"],entityState:["kind",...V.entityRef],entityAttribute:["kind",...V.entityRef,"attribute"],entityAge:["kind",...V.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"]};function ka(e){let t=[],n=(s,d,p)=>{if(T(s))for(let c of Object.keys(s))d.includes(c)||t.push(`${p}.${c}`)},i=(s,d)=>{if(!T(s))return;let p=typeof s.kind=="string"?s.kind:"";n(s,pa[p]??["kind"],d),p==="aggregate"&&T(s.aggregate)&&(n(s.aggregate,V.aggregate,`${d}.aggregate`),n(s.aggregate.scope,V.scope,`${d}.aggregate.scope`),T(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((c,h)=>n(c,V.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(s.aggregate.stateFilter,V.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(T(s)){if(T(s.kind))n(s,V.value,d),i(s.kind,`${d}.kind`);else{let p=typeof s.kind=="string"?s.kind:"";n(s,[...pa[p]??["kind"],"format"],d),p==="aggregate"&&i(s,d)}n(s.format,V.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((p,c)=>{n(p,V.styleChange,`${d}[${c}]`),T(p)&&a(p.value,`${d}[${c}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((p,c)=>{let h=`${d}[${c}]`;n(p,V.rule,h),T(p)&&(Array.isArray(p.cases)&&p.cases.forEach((y,g)=>{let $=`${h}.cases[${g}]`;n(y,V.case,$),T(y)&&(n(y.when,V.condition,`${$}.when`),T(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((x,S)=>{let w=`${$}.when.tests[${S}]`;n(x,V.test,w),T(x)&&(a(x.value,`${w}.value`),n(x.comparison,V.comparison,`${w}.comparison`),T(x.comparison)&&(a(x.comparison.value,`${w}.comparison.value`),a(x.comparison.upper,`${w}.comparison.upper`)))}),r(y.then,`${$}.then`))}),r(p.otherwise,`${h}.otherwise`))})};if(!T(e))return t;n(e,V.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>n(s,V.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{n(s,V.named,`$.values[${d}]`),T(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let p=`$.elements[${d}]`;if(n(s,V.elementEnvelope,p),!T(s)||!T(s.payload))return;let c=typeof s.kind=="string"?s.kind:"",h=V[c]??[];n(s.payload,[...V.elementBase,...h],`${p}.payload`),n(s.payload.colorSlot,V.colorSlot,`${p}.payload.colorSlot`),n(s.payload.frame,V.frame,`${p}.payload.frame`),o(s.payload.rules,`${p}.payload.rules`);for(let y of["value","symbol"])y in s.payload&&a(s.payload[y],`${p}.payload.${y}`);c==="image"&&n(s.payload.entity,V.entityRef,`${p}.payload.entity`),c==="tap"&&n(s.payload.action,V.tapAction,`${p}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else T(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let p=`$.perFamily.${s}`;if(n(d,V.layout,p),!!T(d)){if(T(d.placements))for(let[c,h]of Object.entries(d.placements))n(h,V.placement,`${p}.placements.${c}`),T(h)&&n(h.frame,V.frame,`${p}.placements.${c}.frame`);if(a(d.bezelText,`${p}.bezelText`),a(d.curvedText,`${p}.curvedText`),T(d.bezelGauge)){let c=`${p}.bezelGauge`;n(d.bezelGauge,V.bezelGauge,c),a(d.bezelGauge.value,`${c}.value`),a(d.bezelGauge.minLabel,`${c}.minLabel`),a(d.bezelGauge.maxLabel,`${c}.maxLabel`)}o(d.rules,`${p}.rules`)}}return T(e.inline)&&(n(e.inline,V.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>n(s,V.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,V.tapAction,"$.tapAction"),t}function q(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function Gn(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Ca(e,t,n=[...Z]){let i={};for(let r of Z)n.includes(r)&&(i[r]=Gn());let a={schemaVersion:4,id:q(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:Ko.filter(r=>n.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(a.inline={value:I("Text")}),a.schemaVersion=$t(a),a}function Et(e){let t=n=>({id:q(),colorSlot:{baseColorHex:n},rules:[],frame:{...fa},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:I("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:I("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:I("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:I("13,14,16,17,19,22,24,28,30"),style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:Wt,lowColorHex:jt,marker:"pointer"}};case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:kt,timestampCorner:"topLeading",timestampSize:Ct}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function I(e){return{kind:{kind:"literal",value:e}}}function Sa(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let a=n.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Xt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Un(e){let t=[],n=i=>{for(let a of i)a.value&&t.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(a.then)}i.otherwise&&n(i.otherwise)}return t}var Kn=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Nn(e,t){let n,i=t;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function Wn(e,t){return Nn(e,Xt(t))?.ref}function jn(e,t){let n=Wn(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&Kn.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function ua(e,t,n){if(qt(t)||n.width<=0||n.height<=0)return{...e};let i=t,a=e.x-i.left/n.width,r=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,l=e.y+e.height+i.bottom/n.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=we(a),r=we(r),o=we(o),l=we(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function Ea(e,t,n){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function Ta(e,t,n,i){let a=e.elements.find(h=>h.payload.id===t);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=we(i.x),s=we(i.y),d=we(i.x+i.width),p=we(i.y+i.height),c={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,p-s)};a.payload.outset=Ea(o,c,ge[n])}function Fa(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i)return;let a=e.perFamily[n];if(!a)return;let r=a.placements[t]?.frame??i.payload.frame,o=ge[n];return{width:r.width*o.width,height:r.height*o.height}}function ye(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function de(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function qn(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function qe(e){let t=new Map(e.elements.map(a=>[a.payload.id,a])),n=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=t.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=n.get(r);l?l.push(a):n.set(r,[a])}if(n.size===0)return;for(let[a,r]of n){let o=t.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=Ea(o.payload.frame,s.frame,ge.rectangular));let d=s.outset,p=!qt(d);l.payload.frame=ua(o.payload.frame,d,ge.rectangular),l.payload.isHidden=o.payload.isHidden;for(let c of Z){let h=e.perFamily[c];if(!h)continue;let y=ge[c],g=h.placements[a];if(p){let $=g?.frame??o.payload.frame,x=g?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:ua($,d,y),isHidden:x}}else g?h.placements[l.payload.id]={frame:{...g.frame},isHidden:g.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=n.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Zt(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind==="tap")return;let a=ye(e,t)[0];if(a)return a.payload;let r=Et("tap"),o=r.payload;return o.attachedTo=t,o.outset={...Dn},o.action=n??jn(e,i),e.elements.push(r),qe(e),o}function Yn(e,t){let n=ye(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of Z)for(let a of n)delete e.perFamily[i]?.placements[a]}}function Ra(e,t){Yn(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of Z)delete e.perFamily[n]?.placements[t];qe(e),_e(e)}function Ia(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),i=e.elements[n];if(!i)return;let a=q(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[t,a]];for(let s of ye(e,t)){let d=structuredClone(s);d.payload.id=q(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let s of Z){let d=e.perFamily[s];if(d)for(let[p,c]of l){let h=d.placements[p];h&&(d.placements[c]=structuredClone(h))}}return qe(e),a}function Qt(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let i=[],a=Nn(e,Xt(n));if(a){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of ye(e,t)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=Nn(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function ha(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function Aa(e,t,n){let i=e.elements.find(r=>r.payload.id===t);if(!i||n.entityId==="")return;let a={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=ha(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=ha(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of ye(e,t)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var en={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Ma=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Ye(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function tn(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Jn(){return{id:q(),value:I(""),comparison:{kind:"isOn"}}}function Xn(){return{id:q(),when:{join:"all",tests:[Jn()]},then:[]}}function Tt(){return{id:q(),cases:[Xn()]}}function Zn(e,t){let n={kind:t};switch(Ye(t)){case"value":n.value=e.value??I("");break;case"between":n.value=e.value??I(""),n.upper=e.upper??I("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function Je(e){let t={kind:e};switch(tn(e)){case"value":t.value=I(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function Ha(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function La(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function za(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*i&a;return n.toString(16)}function Pa(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function _a(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function ei(e,t,n=0){let i=t instanceof Map?t:Pa(t),a=e.kind;if(a.kind==="named"){if(n>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?ei(o,i,n+1):_a(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!_a(a))return;let r=Qn(a);if(r!==void 0)return"e_"+za(r)}function be(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function ls(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>be(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))t=o.length===0?"[]":"("+o.map(c=>`(states.${c} | list)`).join(" + ")+")";else{let c=[];for(let h of l)c.push(`area_entities(${be(h)})`);for(let h of s)c.push(`label_entities(${be(h)})`);d.length>0&&c.push(`((${d.map(h=>`floor_areas(${be(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${c.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(be).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${be(i.value)})`:n+=` | rejectattr('state', 'eq', ${be(i.value)})`),e.function==="count")return`(${n} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${n} | map(attribute=${be(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function Qn(e){switch(e.kind){case"entityAttribute":return`state_attr(${be(e.entityId)}, ${be(e.attribute)})`;case"entityAge":{let t=be(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return ls(e.aggregate);default:return}}function ti(e){let t=new Map,n=new Map,i=Pa(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let p=Qn(d.kind);if(p===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),p);return}default:{let d=Qn(s);if(d===void 0)return;n.set("e_"+za(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Xt(o);l&&a(l);for(let s of Un(o.payload.rules))a(s)}for(let o of Z){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of Un(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:t,expressions:n};return n.size>0&&(r.document=ds(n)),r}function ds(e){let t=[...e.keys()].sort(),n=[];for(let a of t){let r=e.get(a);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${a} %}${r}{% endset %}`):n.push(`{% set v_${a} = ${r} %}`)}let i=t.map(a=>`"${a}": v_${a}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function Na(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[a,r]of Object.entries(t))r===null?i.add(a):n.set(a,cs(r));return{values:n,nullKeys:i}}function cs(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function ni(e){let t=ti(e),n=[...t.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function nn(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function rt(e){let t=e.trim(),n=nn(t);if(n!==void 0)return n;let i="";for(let r of t)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:nn(i)}function ps(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function us(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function hs(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function ms(e,t,n){if(ke(t))return e;let i=t,a=e,r=nn(e.trim());if(i.relativeTime&&r!==void 0)a=us(r);else{let o=rt(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):ps(l))}}switch(i.useEntityUnit&&n&&(a+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=hs(a);break}return a}function ot(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),a=t%60,r=o=>String(o).padStart(2,"0");return n>0?`${n}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Ft(e,t=240){let n=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&n.push(o)}i=""};for(let o of e){if(n.length>=t)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let l=!a;r(),l&&(i+=o),a=!1}else r(),a=!1}return n.length<t&&r(),n}function fs(e,t){let n,i;return t.scale==="fixed"?(n=Math.min(t.minValue,t.maxValue),i=Math.max(t.minValue,t.maxValue)):(n=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),t.baseline==="zero"&&(n=Math.min(n,0),i=Math.max(i,0)),i>n||(i=n+1),{min:n,max:i}}function gs(e,t,n){if(e===void 0)return 0;let i=rt(e);if(i===void 0||Number.isNaN(i))return 0;let a=n-t;return a===0?0:Math.min(1,Math.max(0,(i-t)/a))}var Re=class{constructor(t){this.ctx=t;this.named=new Map(t.namedValues.map(n=>[n.id.toUpperCase(),n.value]))}dereference(t){let n=t,i=new Set,a=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!ke(a)?a:l.format,n=l}let r={kind:n.kind};return a&&(r.format=a),r}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;default:{let a=ei(t,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return ms(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(t)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=nn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?ot(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let a=rt(i),r=()=>this.resolve(n.value),o=()=>{let s=r();return s===void 0?void 0:rt(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(n.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(n.upper),p=d===void 0?void 0:rt(d);if(a===void 0||s===void 0||p===void 0)return!1;let[c,h]=s<=p?[s,p]:[p,s];return a>=c&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let a of t){let r=n?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(ce[l.kind],l)}return i}liveBranches(t){let n=new Map;for(let i of t){let a=i.cases.find(r=>this.evaluateCondition(r.when));n.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,a=this.applyRules(i.rules,n),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,p={id:i.id,isHidden:o,frame:s,opacity:d};switch(t.kind){case"text":{let c=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,y={kind:"text",...p,text:this.styleText(a,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??t.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex};return c!==void 0&&(y.countdownEnd=c),y}case"icon":{let c=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...p,symbol:this.styleText(a,"icon")??c,size:this.styleNumber(a,"fontSize")??t.payload.size,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let c=this.styleText(a,"gaugeValue")??this.resolve(t.payload.value),h=this.styleNumber(a,"gaugeMin")??t.payload.minValue,y=this.styleNumber(a,"gaugeMax")??t.payload.maxValue;return{kind:"gauge",...p,fraction:gs(c,h,y),style:t.payload.style,lineWidth:t.payload.lineWidth,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,trackColorHex:t.payload.trackColorHex}}case"chart":{let c=t.payload,h=Ft(this.resolve(c.value)??"");c.limit>0&&h.length>c.limit&&(h=c.takeFromEnd?h.slice(h.length-c.limit):h.slice(0,c.limit));let y=fs(h,c),g={kind:"chart",...p,values:h,style:c.style,domainMin:y.min,domainMax:y.max,baseline:c.baseline,barGap:c.barGap,lineWidth:c.lineWidth,colorHex:this.styleColor(a,"color")??c.colorSlot.baseColorHex,highColorHex:c.highColorHex,lowColorHex:c.lowColorHex,marker:c.marker};if(h.length>0){let $=c.highlight==="highest"||c.highlight==="both",x=c.highlight==="lowest"||c.highlight==="both",S=$?h.indexOf(Math.max(...h)):-1,w=x?h.indexOf(Math.min(...h)):-1;S>=0&&(g.highIndex=S),w>=0&&w!==S&&(g.lowIndex=w)}return g}case"shape":{let c={kind:"shape",...p,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??t.payload.borderWidth},h=this.styleColor(a,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(c.borderColorHex=h),c}case"image":{let c={kind:"image",...p,entityId:t.payload.entity.entityId,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};Te(t.payload)&&(c.timestampX=t.payload.timestampX,c.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(c.url=h),c}case"tap":{let c={kind:"tap",...p,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(c.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(c.attachedTo=t.payload.attachedTo),c}}}resolveLayout(t,n,i){let a=t.perFamily[n],r=Sa(t,n).map($=>this.resolveElement($,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:n,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,p=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,c=s??p??this.resolve(a?.bezelText);c!==void 0&&(l.bezelText=c),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let $=a.bezelGauge,x=this.resolve($.value),S=x===void 0?void 0:rt(x);if(S!==void 0){let w=Math.min($.minValue,$.maxValue),m=Math.max($.minValue,$.maxValue),b={value:Math.min(m,Math.max(w,S)),minValue:w,maxValue:m===w?w+1:m,colorHexes:$.colorHexes},v=this.resolve($.minLabel);v!==void 0&&(b.minLabel=v);let F=this.resolve($.maxLabel);F!==void 0&&(b.maxLabel=F),l.bezelGauge=b}}let y=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;y!==void 0&&(l.backgroundColorHex=y);let g=this.styleColor(o,"borderColor")??a?.borderColorHex;return g!==void 0&&(l.borderColorHex=g),l}};function ys(e,t){let n=new Re(t),i=e.countdown?n.countdownEnd(e.value):void 0,r={text:(e.countdown?n.countdownFallbackText(e.value):void 0)??n.resolve(e.value)??"--"};return e.label&&(r.label=e.label),e.symbol&&(r.symbol=e.symbol),i!==void 0&&(r.countdownEnd=i),r}function ii(e,t,n){let i=new Re(t),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,n));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=ys(e.inline,t)),a}var re=ge,Rt=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:re,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],It=Rt.find(e=>e.measured);function ja(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return Rt.find(a=>a.screen.width===n&&a.screen.height===i)}function rn(e,t){let n=re[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),a=n.width*i,r=n.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var bs={regular:400,medium:500,semibold:600,bold:700};function Ce(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function ze(e,t,n="#FFFFFF"){let i=Ce(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function qa(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),a=(e.frame.x+e.frame.width/2)*t.width,r=(e.frame.y+e.frame.height/2)*t.height;return{x:a-n/2,y:r-i/2,w:n,h:i,cx:a,cy:r}}function vs(e,t){let n=ze(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:ot((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>t.w&&t.w>0?Math.max(.5,t.w/a):1,o=e.fontSize*r,l=e.text;if(t.w>0&&l.length*i(o)>t.w){let s=t.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${bs[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${l}</text>`}function xs(e,t){let n=ze(e.colorHex,"stroke"),i=ze(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=t.w,y=Math.max(a,h*e.fraction);return k`
      <rect x=${t.x} y=${t.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-a/2} width=${y} height=${a} rx=${a/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />`}let r=Math.min(t.w,t.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,p=l*s,c=l*s*e.fraction;return k`
    <g transform="rotate(${d} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${p} ${l}" />
      ${e.fraction>0?k`<circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${c} ${l}" />`:f}
    </g>`}var ws=5;function $s(e,t){let n=e.values,i=Math.max(n.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:ws,o=e.style==="bars"?0:e.lineWidth/2,l=t.y+r+o,s=Math.max(t.h-r-o*2,1),d=l+s,p=Math.max(e.domainMax-e.domainMin,Number.EPSILON),c=e.baseline==="lowest",h=c?s*.12:0,y=Math.min(Math.max(e.barGap,0),t.w/(i*2)),g=Math.max((t.w-y*(i-1))/i,.5),$=S=>Math.min(1,Math.max(0,(S-e.domainMin)/p)),x=S=>d-$(S)*s;return{count:n.length,barWidth:g,baselineY:c?d:x(0),barRect(S){let w=t.x+S*(g+y),m=n[S],b,v;if(c){let F=h+$(m)*(s-h);b=d-F,v=d}else b=x(m),v=c?d:x(0),b>v&&([b,v]=[v,b]);return{x:w,y:b,w:g,h:Math.max(v-b,.5)}},point(S){let w=Math.max(t.w-o*2,0);return{x:n.length>1?t.x+o+w*S/(n.length-1):t.cx,y:x(n[S])}},markerCenter(S,w){let m=w?this.barRect(S):void 0;return{x:m?m.x+m.w/2:this.point(S).x,y:t.y+r/2}}}}function ks(e,t){if(e.values.length===0)return f;let n=$s(e,t),i=ze(e.colorHex,"fill"),a=ze(e.highColorHex,"fill",e.colorHex),r=ze(e.lowColorHex,"fill",e.colorHex),o=(s,d)=>k`<circle cx=${s.x} cy=${s.y} r="1.7" fill=${d.fill} fill-opacity=${d["fill-opacity"]} />`,l=[];if(e.style==="bars")for(let s=0;s<n.count;s++){let d=n.barRect(s),p=s===e.highIndex?a:s===e.lowIndex?r:i,c=Math.min(1.2,d.w/2,d.h/2);l.push(k`<rect x=${d.x} y=${d.y} width=${d.w} height=${d.h} rx=${c}
        fill=${p.fill} fill-opacity=${p["fill-opacity"]} />`)}else{let s=Array.from({length:n.count},(p,c)=>n.point(c)),d=s.map((p,c)=>`${c===0?"M":"L"}${p.x} ${p.y}`).join(" ");if(e.style==="area"){let p=`${d} L${s[s.length-1].x} ${n.baselineY} L${s[0].x} ${n.baselineY} Z`;l.push(k`<path d=${p} fill=${i.fill}
        fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}l.push(k`<path d=${d} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
      stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`),e.highIndex!==void 0&&l.push(o(s[e.highIndex],a)),e.lowIndex!==void 0&&l.push(o(s[e.lowIndex],r))}if(e.marker!=="none"){let s=e.style==="bars";if(e.highIndex!==void 0){let d=n.markerCenter(e.highIndex,s);l.push(e.marker==="pointer"?k`<path d=${`M${d.x} ${d.y-1.8} L${d.x+2.2} ${d.y+1.8} L${d.x-2.2} ${d.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(d,a))}e.lowIndex!==void 0&&l.push(o(n.markerCenter(e.lowIndex,s),r))}return k`${l}`}function Cs(e,t){let n=ze(e.fillColorHex,"fill"),i=e.borderColorHex?Ce(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?{stroke:i.color,"stroke-opacity":i.opacity,"stroke-width":a}:{stroke:"none","stroke-opacity":0,"stroke-width":0},l=k`fill=${n.fill} fill-opacity=${n["fill-opacity"]}
    stroke=${o.stroke} stroke-opacity=${o["stroke-opacity"]} stroke-width=${o["stroke-width"]}`;switch(e.shapeKind){case"circle":{let s=Math.min(t.w,t.h)/2-r;return k`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,s)} ${l} />`}case"capsule":{let s=Math.min(t.w,t.h)/2;return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${s} ${l} />`}case"roundedRectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${e.cornerRadius} ${l} />`;case"rectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} ${l} />`}}function Ss(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return k`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let a=ze(e.colorHex,"stroke"),r=e.size;return k`
    <rect x=${t.cx-r/2} y=${t.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var di=.25,Es=8;function Ts(e,t,n,i,a,r,o,l){let s={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,di),Es),p=Math.max(e/n,t/i),c=Math.min(e/n,t/i),h=(a==="fit"?c:p)*d,y=n*h,g=i*h,$=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),x=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(y-e)/2*(1+$)+0,y:-(g-t)/2*(1+x)+0,width:y,height:g}}function on(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var an=4;function sn(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),a=n.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?t.x+an:t.x+t.w-an-a,d=e.timestampCorner.startsWith("top")?t.y+an:t.y+t.h-an-r;return{x:s,y:d,w:a,h:r,size:i,label:n}}let l=(s,d,p,c)=>c>=p?d+(p-c)/2:Math.min(d+p-c,Math.max(d,s-c/2));return{x:l(t.x+e.timestampX*t.w,t.x,t.w,a),y:l(t.y+e.timestampY*t.h,t.y,t.h,r),w:a,h:r,size:i,label:n}}function Fs(e,t,n){let i=n.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?sn(e,t,on(new Date)):void 0,l=o?k`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,s=3,d=o&&n.timestampActiveId===e.id?k`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,y,g])=>k`<rect data-ts-corner=${h} x=${y-s/2} y=${g-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:f,p=e.url?n.imageSizes?.size(e.url):void 0,c;if(e.url&&p){let h=Ts(t.w,t.h,p.width,p.height,e.contentMode,e.zoom,e.panX,e.panY);c=k`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?c=k`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:c=k`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??f}</g>`;return k`
    <defs><clipPath id=${a}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${l}</g>${d}`}function Rs(e,t,n,i,a){if(!i)return f;let r=Math.min(10,t.w*.5,t.h*.5),o=a!==void 0?Is(a,t):void 0;return k`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${ri} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?k`<g transform="translate(${t.cx-r/2} ${t.cy-r/2})" opacity="0.8">${n.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var ri=5;function Is(e,t){let n=ri*.55,i=t.w-2;if(t.h<ri*1.6||i<n*4)return;if(e.length*n<=i)return e;let a=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function oi(e,t,n){if(e.isHidden&&!n.showHidden)return f;let i=n.tapReview===!0,a=n.tapAreas===!0||i,r=i?n.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return f;let s=qa(e,t),d=i&&(!l||o),p;switch(e.kind){case"text":p=vs(e,s);break;case"icon":p=Ss(e,s,n.icons);break;case"gauge":p=xs(e,s);break;case"chart":p=ks(e,s);break;case"shape":p=Cs(e,s);break;case"image":p=Fs(e,s,n);break;case"tap":p=Rs(e,s,n.icons,a,d?Fe(e.action):void 0);break}let c=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*c,y=n.highlightId===e.id,g=y||n.highlightIds?.includes(e.id)===!0,$=n.handles===!0&&(!l||o),x=g?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,S=n.hoverId===e.id?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,w=k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,m=3,b=y&&$?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([v,F,C])=>k`<rect data-handle=${v} x=${F-m/2} y=${C-m/2} width=${m} height=${m}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${v}-resize" />`):f;return k`<g data-element-id=${e.id} opacity=${h} style=${$?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${w}${p}${S}${x}${b}</g>`}function ln(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function ci(e,t){return(t?23.5:34)*e}var Oa=10.5;function Ya(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function Va(e,t){let n=0;for(let i of e)n+=Ya(i,t);return n}function Da(e,t,n){let i=e.toUpperCase(),a=d=>Ya(d,n),r=.9*n,o=0;for(let d of i)o+=a(d);if(o<=t)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>t)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function si(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function li(e,t,n,i){let a=si(e,t,n),r=si(e,t,i);return`M ${a.x} ${a.y} A ${t} ${t} 0 0 1 ${r.x} ${r.y}`}function Ja(e,t,n,i){let{dial:a}=ln(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:t,d:li(a,n,i.start,i.end),length:n*r}}function As(e,t){let n=ln(e,!0);return Ja(e,t,n.dial.r,n.labelArc)}var Ba=18.5,Ms=113,Hs={start:-71,end:-36},Ga=104,Ls=6.2,Ua={start:-77,end:-30.5};function Ka(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function Wa(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),a=n-i,r=Ka(e[i]),o=Ka(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var ai=11;function _s(e,t,n){let{dial:i}=ln(t,!0),a=Ga*t,r=180/(Math.PI*Ga),o=e.minLabel!==void 0?Va(e.minLabel,ai)*r:0,l=e.maxLabel!==void 0?Va(e.maxLabel,ai)*r:0,s=Ua.start+(o>0?Math.max(0,o-1.8):0),d=Ua.end-(l>0?Math.max(0,l-1.8):0),p=d-s,c=24,h=[];for(let S=0;S<c;S++){let w=s+p*S/c,m=Math.min(d,s+p*(S+1)/c+.4);h.push(k`<path d=${li(i,a,w,m)} fill="none"
      stroke=${Wa(e.colorHexes,(S+.5)/c)} stroke-width=${Ls*t}
      stroke-linecap=${S===0||S===c-1?"round":"butt"} />`)}let y=(e.value-e.minValue)/(e.maxValue-e.minValue),g=si(i,a,s+p*y),$=1.5,x=(S,w,m,b)=>k`
    <defs><path id=${S} d=${li(i,a,w,m)} /></defs>
    <text font-size=${ai*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${S}" startOffset="50%" text-anchor="middle">${b}</textPath></text>`;return k`${h}
    <circle cx=${g.x} cy=${g.y} r=${3.2*t} fill=${Wa(e.colorHexes,y)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?x(`${n}-gmin`,s-$-Math.max(o,3),s-$,e.minLabel):f}
    ${e.maxLabel!==void 0?x(`${n}-gmax`,d+$,d+$+Math.max(l,3),e.maxLabel):f}`}function pi(e,t){let n=e.family in re?e.family:"rectangular",i=t.slot??re[n],a=re[n],r=rn(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,l=Ce(e.backgroundColorHex),s=Ce(e.borderColorHex),d=e.borderWidth*r.scale;if(n==="corner"){let g=r.scale,$=!!e.bezelText||!!e.bezelGauge,x=e.curvedText??"",S=x!=="",w=ln(g,$),m=ci(g,$),b=m/(a.width*g),v=w.tile.cx-m/2,F=w.tile.cy-m/2,C=`M 0 0 H ${w.quad.width-w.cornerRadius} A ${w.cornerRadius} ${w.cornerRadius} 0 0 1 ${w.quad.width} ${w.cornerRadius} V ${w.quad.height} H 0 Z`,R=f;if(e.bezelGauge)R=_s(e.bezelGauge,g,o);else if(e.bezelText){let M=As(g,`${o}-bezel`),P=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?ot((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;R=k`<defs><path id=${M.id} d=${M.d} /></defs>
        <text font-size=${Oa*g} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${M.id}" startOffset="50%" text-anchor="middle">${Da(P,M.length,Oa*g)}</textPath></text>`}let E=f;if(S){let M=Ce(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},P=Ja(g,`${o}-curved`,Ms*g,Hs);E=k`<defs><path id=${P.id} d=${P.d} /></defs>
        <text font-size=${Ba*g} font-weight="600" fill=${M.color} fill-opacity=${M.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${P.id}" startOffset="50%" text-anchor="middle">${Da(x,P.length,Ba*g*.88)}</textPath></text>`}else{let M=e.borderWidth*r.scale*b,P=s?k`<circle cx=${m/2} cy=${m/2} r=${m/2-M/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${M} />`:f;E=k`<g transform="translate(${v} ${F})">
        <g clip-path=${`url(#${o})`}>
          ${l?k`<rect width=${m} height=${m} fill=${l.color} fill-opacity=${l.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*b})">
            ${e.elements.map(B=>oi(B,a,t))}
          </g>
        </g>
        <circle cx=${m/2} cy=${m/2} r=${m/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*g} stroke-dasharray=${`${2*g} ${2*g}`} />
        ${P}
      </g>`}return k`<svg viewBox=${`0 0 ${w.quad.width} ${w.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${w.quad.width} height=${w.quad.height}>
      <defs><clipPath id=${o}><circle cx=${m/2} cy=${m/2} r=${m/2} /></clipPath></defs>
      <path d=${C} fill="#000000" />
      ${R}
      ${E}
    </svg>`}let p=k`<rect width=${i.width} height=${i.height} />`,c=s?k`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:f,h=k`<rect width=${i.width} height=${i.height} fill="#000000" />`,y=`0 0 ${i.width} ${i.height}`;return k`<svg viewBox=${y} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${p}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?k`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(g=>oi(g,a,t))}
      </g>
    </g>
    ${c}
  </svg>`}var zs=.14;function Ps(e,t){let n=qa(e,t);if(e.kind!=="text"||e.text==="")return n;let i=Math.min(n.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(n.h,e.fontSize*1.3);return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}function Ns(e,t,n){let i=e.family in re?e.family:"rectangular",a=re[i],r=e.elements.filter(h=>t.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let y=Ps(h,a),g=h.frame.rotationDegrees%180===0?0:Math.hypot(y.w,y.h)/2;o=Math.min(o,g?y.cx-g:y.x),l=Math.min(l,g?y.cy-g:y.y),s=Math.max(s,g?y.cx+g:y.x+y.w),d=Math.max(d,g?y.cy+g:y.y+y.h)}let p=s-o,c=d-l;if(r.length===0||!(p>0)||!(c>0))o=0,l=0,p=a.width,c=a.height;else{let h=Math.max(2,Math.max(p,c)*zs);o-=h,l-=h,p+=2*h,c+=2*h}if(p/c<n){let h=c*n;o-=(h-p)/2,p=h}else{let h=p/n;l-=(h-c)/2,c=h}return{x:o,y:l,w:p,h:c}}function Xa(e,t,n){let i=e.family in re?e.family:"rectangular",a=re[i],r=Ns(e,t,n.width/n.height),o=Ce(e.backgroundColorHex),l=Ce(e.borderColorHex),s=e.borderWidth,d={icons:n.icons,showHidden:!0,tapAreas:!0,...n.imageSizes?{imageSizes:n.imageSizes}:{}},p=e.elements.filter(y=>t.includes(y.id)),c=l&&s>0?i==="rectangular"?k`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:f,h=i==="rectangular"?k`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return k`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${n.width} height=${n.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${p.map(y=>oi(y,a,d))}
    ${c}
  </svg>`}function O(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var st=["rectangular","circular","corner","inline"];function At(e){return Z.includes(e)}function Za(e){return st.filter(t=>e.supportedFamilies.includes(t))}function Qa(e){return Z.find(t=>e.supportedFamilies.includes(t))}function lt(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function Os(e){let t=e.elements.find(i=>i.kind==="text");return{value:t&&t.kind==="text"?structuredClone(t.payload.value):I("Text")}}function er(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=st.filter(n=>n===t||e.supportedFamilies.includes(n))),At(t)?e.perFamily[t]||(e.perFamily[t]=Gn()):e.inline||(e.inline=Os(e)),e.schemaVersion=$t(e)}function tr(e,t){lt(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),At(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=$t(e))}function nr(e,t){let n=[];if(!At(t)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let a=Object.keys(i.placements).length;return a>0&&n.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var Q={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},dt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},ir=["text","icon","gauge","chart","shape","image","tap"],j={states:"#f9a825",tap:Q.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var ar="2.8.0";function ui(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function Vs(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function rr(e,t=ar){let n=ui(e),i=ui(t);return!n||!i?!1:Vs(n,i)>=0}function or(e,t=ar){return`${ui(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var sr="52a9d81d0fd7";function Ds(e){return e.trim().replace(/\./g,"-")}function Bs(e){return e.trim().replace(/-/g,".")}var dn=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>Bs(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let a=Ds(t),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Ce(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},hi=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let a=this.icons.get(t.trim());if(!a)return;let r=Ce(i)??{color:"#FFFFFF",opacity:1};return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${sr}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,a]of Object.entries(n))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function lr(e){return dn.available()?new dn(e):new hi(e)}function dr(e){let t=new Map,n=new Set;return{size(i){let a=t.get(i);if(a)return a;if(n.has(i))return;n.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(t.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var pn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],un=[...new Set(pn.flatMap(e=>e.symbols))],Gs={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Us(e){return`${e.replace(/\./g," ")} ${(Gs[e]??[]).join(" ")}`}function cr(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let a of e){let r=Us(a);if(!n.every(l=>r.includes(l)))continue;let o=n.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var cn=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var Ks=100;function pr(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Xe=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,qe(t),this.baseline=JSON.stringify(Yt(t))}static fromDocument(t,n){return new e(va(t),n)}get dirty(){return JSON.stringify(Yt(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Ks&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let r=structuredClone(this.config);t(r),qe(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=ni(t),Yt(t)}commit(){let t=structuredClone(this.config);return t.dataSources=ni(t),new e(t,null)}};var ct={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Ie={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},hr=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],mr={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},mi=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Ws=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function fi(e){return Ws.includes(e)}function js(e){return mi.includes(e)}function qs(e,t){return JSON.stringify(Y(e))===JSON.stringify(Y(t))}function gi(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[r,o]of t.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!js(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${ct[s.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=s.value;else if(!qs(n,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=ur(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Ie[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(t.otherwise){let r=ur(t.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Ie[r]} twice. A table has one cell per column.`}}let a={ruleId:t.id,rows:i,columns:Ys(i,t.otherwise),numberMode:i.length>0&&i.every(r=>fi(r.comparison.kind))};return n!==void 0&&(a.value=n),t.otherwise&&(a.otherwise=t.otherwise),{ok:!0,table:a}}function ur(e){let t=new Set;for(let n of e){let i=ce[n.kind];if(t.has(i))return i;t.add(i)}}function Ys(e,t){let n=new Set;for(let i of e)for(let a of i.changes)n.add(ce[a.kind]);for(let i of t??[])n.add(ce[i.kind]);return hr.filter(i=>n.has(i))}function fr(e,t,n){let i=new Set(e);for(let a of t)i.add(a);return hr.filter(a=>i.has(a)&&n.includes(a))}function hn(e,t){return e.find(n=>ce[n.kind]===t)}function gr(e,t,n,i){let a=t.map(o=>({id:o.caseId??q(),when:{join:o.join??"all",tests:[{id:o.testId??q(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??q(),cases:a};return n&&(r.otherwise=n),r}function Mt(e){if(e.length===0)return"No states yet.";let t=gi(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function yr(e){let t=e[0];return t||(t={id:q(),cases:[]},e.push(t)),t}function br(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function vr(e,t,n){let i=yr(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:q(),when:{join:"all",tests:[{id:q(),value:structuredClone(t),comparison:Xs(a,n)}]},then:[]})}function xr(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),br(e))}function yi(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[a]=i.splice(t,1);a&&i.splice(n,0,a)}function bi(e,t){if(t){yr(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,br(e))}function wr(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function $r(e,t){let n=e[0];if(!n)return;let i=a=>a.filter(r=>ce[r.kind]!==t);for(let a of n.cases)a.then=i(a.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function Js(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function kr(e,t=Js){let n=()=>t(e.value??I(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??I(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Ye(e.kind)==="value"?`${ct[e.kind]} ${n()}`:ct[e.kind]}}function Xs(e,t){if(!e)return t?{kind:"lessThan",value:I("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??I("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};default:return{kind:e.kind,...Ye(e.kind)==="value"?{value:I("")}:{}}}}var Cr={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function Sr(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function Zs(e){switch(e){case"text":return k`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return k`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return k`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return k`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return k`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return k`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return k`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return k`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return k`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return k`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return k`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return k`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return k`<path d="M6 9L12 15L18 9" />`;case"plus":return k`<path d="M12 5V19M5 12H19" />`;case"watch":return k`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"lock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return k`<path d="M6 14L12 8L18 14" />`;case"down":return k`<path d="M6 10L12 16L18 10" />`;case"show":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return k`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return k`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return k`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return k`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`}}function _(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Zs(e)}</svg>`}function pt(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=n.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function Er(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var mn=e=>Math.round(e*1e3)/1e3,Tr=10;function vi(e,t,n,i){let a=i.width>0?e.x+t/i.width:e.x,r=i.height>0?e.y+n/i.height:e.y;return Er({...e,x:mn(a),y:mn(r)})}function Fr(e,t,n,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?mn(a(e.x+t/i.w)):e.x,y:i.h>0?mn(a(e.y+n/i.h)):e.y}}function fn(e,t,n,i,a){let r=pt(e,n),o={...i.frame},l=o;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let y=pt(e,h),g=(y.x-r.x)/t.width,$=(y.y-r.y)/t.height,x;if(!i.handle)x=Er({...o,x:s(o.x+g),y:s(o.y+$)});else{let{x:S,y:w,width:m,height:b}=o,v=o.x+o.width,F=o.y+o.height;i.handle.includes("e")&&(m=Math.max(.04,o.width+g)),i.handle.includes("s")&&(b=Math.max(.04,o.height+$)),i.handle.includes("w")&&(m=Math.max(.04,o.width-g),S=v-m),i.handle.includes("n")&&(b=Math.max(.04,o.height-$),w=F-b),x={...o,x:s(S),y:s(w),width:s(m),height:s(b)}}l=x,a.onFrame(i.elementId,x,!1)},p=h=>{h.pointerId===n.pointerId&&(c(),a.onFrame(i.elementId,l,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),c}function Rr(e,t,n,i,a){let r=pt(e,n),o=i;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let y=pt(e,h),g=t.w>0?s(i.x+(y.x-r.x)/t.w):i.x,$=t.h>0?s(i.y+(y.y-r.y)/t.h):i.y;o={x:l(g),y:l($)},a(o.x,o.y,!1)},p=h=>{h.pointerId===n.pointerId&&(c(),a(o.x,o.y,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),c}function Ir(e,t,n,i,a){let r=pt(e,t),o=1;e.setPointerCapture(t.pointerId);let l=p=>{if(p.pointerId!==t.pointerId)return;let c=pt(e,p),h=(c.x-r.x)*(n.includes("e")?1:-1),y=(c.y-r.y)*(n.includes("s")?1:-1),g=i.w>0?(i.w+h)/i.w:1,$=i.h>0?(i.h+y)/i.h:1,x=Math.abs(g-1)>=Math.abs($-1)?g:$;o=Math.max(.05,x),a(o,!1)},s=p=>{p.pointerId===t.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}var Ci=["content","look","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ie(e){return t=>e(t.target.value)}function ee(e,t,n,i={}){return u`<label class="field"><span>${e}</span>
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${ie(n)} /></label>`}function Qs(e,t,n,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${ie(n)}></textarea></label>`}function K(e,t,n,i={}){let a=t===void 0||Number.isNaN(t)?"":String(t);return u`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??f} max=${i.max??f}
      @input=${ie(r=>{if(r.trim()===""){i.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} /></label>`}function U(e,t,n,i){return u`<label class="field"><span>${e}</span>
    <select @change=${ie(a=>i(a))}>
      ${n.map(([a,r])=>u`<option value=${a} ?selected=${a===t}>${r}</option>`)}
    </select></label>`}function xi(e,t,n,i){let a=i.format??(r=>String(Math.round(r*100)/100));return u`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${ie(r=>{let o=Number(r);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${a(t)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${t===i.def}
        @click=${()=>n(i.def)}>${_("reset")}</button>
    </div></div>`}function he(e,t,n){return u`<label class="field check"><input type="checkbox" .checked=${t} @change=${i=>n(i.target.checked)} /><span>${e}</span></label>`}function se(e,t,n,i=!1){let a=(t??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,p)=>{let c=d.replace(/^#/,"").toUpperCase();return p>=100?`#${c}`:`#${c}${Math.round(p/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return u`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${d=>n(d.target.checked?s(o,l):void 0)} />`:f}
      <input type="color" .value=${o} ?disabled=${i&&t===void 0} @input=${ie(d=>n(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${ie(d=>n(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${ie(d=>{let p=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(p)&&n(p.startsWith("#")?p.toUpperCase():`#${p.toUpperCase()}`)})} />
    </div></div>`}function Gr(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function el(e,t){let n=t===void 0?void 0:typeof t=="string"?[t]:t,i=[];for(let[a,r]of Object.entries(e)){let o=a.split(".")[0]??"";if(n!==void 0&&!n.includes(o))continue;let l=typeof r?.attributes?.friendly_name=="string"?r.attributes.friendly_name.trim():"";i.push({entityId:a,name:l||a,state:r?.state??"",domain:o})}return i.sort((a,r)=>a.name.localeCompare(r.name)||a.entityId.localeCompare(r.entityId)),i}var Ur=50;function tl(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function nl(e,t,n=Ur,i){let a=t.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,n);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),p=s.name.toLowerCase(),c=-1;d===a?c=0:d.startsWith(a)?c=1:p.startsWith(a)?c=2:d.includes(a)?c=3:p.includes(a)?c=4:o.length>1&&o.every(h=>d.includes(h)||p.includes(h))&&(c=5),c>=0&&l.push({c:s,rank:c})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,n).map(s=>s.c)}var il=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Kr(e){return il.test(e.trim())}function al(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return Gr(n,i);if(Kr(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var ut=new Map;function Se(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}t=a}}function Wr(e){return ut.has(e)}function Pe(e,t,n,i,a,r={}){let o=e.hass.states,l=ut.get(a),s=l?nl(el(o,r.domain),l.query,Ur,r.preferNumeric?tl:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,p=n.entityId?o[n.entityId]:void 0,c=(w,m,b=0)=>{ut.set(a,{query:m,index:b}),Se(w)},h=w=>{ut.delete(a),Se(w)},y=w=>{let m=al(w,n,o);m&&i(m)},g=(w,m)=>{i(Gr(o,w.entityId)),h(m)},$=()=>Math.max(0,Math.min(ut.get(a)?.index??0,s.length-1)),x=w=>{let m=w.target;if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault();let b=ut.get(a);if(!b){c(m,m.value);return}let v=w.key==="ArrowDown"?$()+1:$()-1;c(m,b.query,Math.max(0,Math.min(s.length-1,v))),rl(m);return}if(w.key==="Enter"){w.preventDefault();let b=s[$()];l&&b?g(b,m):(y(m.value),h(m));return}if(w.key==="Escape"){if(!l)return;w.preventDefault(),w.stopPropagation(),h(m)}},S=n.entityId===""?u`<div class="hint">Type part of a name, such as "kitchen".</div>`:p?u`<div class="entity-current"><span class="ent-name">${typeof p.attributes.friendly_name=="string"?p.attributes.friendly_name:n.entityId}</span><span class="ent-state">${p.state}</span></div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${t}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
      .value=${l?l.query:n.entityId}
      placeholder="Search entities, or type an id"
      @focus=${w=>{let m=w.target;c(m,n.entityId),m.select()}}
      @input=${w=>{let m=w.target;c(m,m.value)}}
      @keydown=${x}
      @blur=${w=>{let m=w.target;l&&y(m.value),h(m)}} />
    ${l?u`<div class="entity-results" role="listbox">
          ${s.length===0?u`<div class="hint" style="padding:6px 8px">${Kr(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map((w,m)=>u`<button type="button" role="option" aria-selected=${m===d?"true":"false"} class="ent ${m===d?"hl":""}"
                @mousedown=${b=>b.preventDefault()} @click=${b=>g(w,b.target)}>
                <span class="ent-main">
                  <span class="ent-name">${w.name}</span>
                  <span class="ent-id mono">${w.entityId}</span>
                </span>
                <span class="ent-state">${w.state}</span>
              </button>`)}
        </div>`:S}
    ${r.compact?f:u`<details class="sub">
      <summary>Display name: ${n.displayName||"(none)"}</summary>
      ${ee("Display name",n.displayName,w=>i({...n,displayName:w}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function rl(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var ol=120;function sl(e,t,n,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(pn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:a(un),fromPack:!1}}function Ar(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function ll(e){return[{value:"",label:`Starter set (${Ar(un,e)})`},...pn.map(t=>({value:t.name,label:`${t.name} (${Ar(t.symbols,e)})`}))]}function dl(e){return e.length>0?e.length:un.length}function cl(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Mr(e,t,n,i){let a=e.icons.render(t,22,"#FFFFFF");return u`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${a??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function jr(e,t,n,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),p=t.trim(),c=p!==""&&d.size>0&&!d.has(p),h=g=>{n(g),a.noteUsed(g)},y=f;if(r){let g=a.category(i),$=sl(g,o,s,d),x=cr($.names,o),S=$.fromPack?x.slice(0,ol):x,w=d.size===0?a.recent:a.recent.filter(m=>d.has(m));y=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${ie(m=>a.setQuery(i,m))} />
        <select @change=${ie(m=>a.setCategory(i,m))}>
          ${ll(d).map(m=>u`<option value=${m.value} ?selected=${m.value===g}>${m.label}</option>`)}
        </select>
      </div>
      ${w.length===0?f:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${w.map(m=>Mr(e,m,m===p,h))}</div>`}
      <div class="sym-grid">${S.map(m=>Mr(e,m,m===p,h))}</div>
      ${x.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${cl(S.length,x.length,o.trim()!=="",dl(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${ie(n)} @change=${ie(g=>{(d.size===0||d.has(g.trim()))&&a.noteUsed(g)})} /></label>
    ${c?u`<div class="hint warn">The installed icon pack has no <code>${p}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${y}`}var pl=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"]],ul=[["bars","Bars"],["line","Line"],["area","Area"]],hl=[["auto","Auto (fit the readings)"],["fixed","Fixed range"]],ml=[["lowest","Lowest value"],["zero","Zero"]],qr=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],fl=[["none","None"],["pointer","Triangle and dot"],["dot","Dots"]],gl=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function yl(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""}}}function J(e,t,n,i){if(i.inline||!bl())return u`<div class="value-editor">${Xr(e,t,n,i)}</div>`;let a=Si(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,l=ae(t,pe(e));return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?f:u`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text">${l}</span>
      ${o===void 0?f:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${Yr(e,a,r,t,n,i)}
  </div>`}function Yr(e,t,n,i,a,r){return u`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${Jr}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${Lt.has(t)?Xr(e,i,a,r):f}
  </div>`}function pe(e){return{values:e.config.values,hass:e.hass}}function Si(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function bl(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Lt=new Set,Ht=new WeakMap;function vl(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function xl(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(t)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function Jr(e){let t=e.currentTarget,n=e.newState==="open",i=Ht.get(t);if(i&&(i(),Ht.delete(t)),!n){Lt.delete(t.id)&&Se(t);return}let a=vl(t);if(!a)return;let r=()=>{if(!t.isConnected||!t.matches(":popover-open")){Ht.get(t)?.(),Ht.delete(t);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}wi(t,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),Ht.set(t,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),wi(t,a.getBoundingClientRect()),Lt.has(t.id)||(Lt.add(t.id),Se(t),requestAnimationFrame(()=>{t.isConnected&&wi(t,a.getBoundingClientRect())}))}function wi(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=wl({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Ze=8,gn=6,Hr=140;function wl(e,t,n){let i=n.height-e.bottom-gn-Ze,a=e.top-gn-Ze,r=t.height>i&&a>i&&i<Hr,o=Math.max(Hr,r?a:i),l=Math.min(t.height,o),s=Math.max(Ze,Math.min(e.left,n.width-t.width-Ze)),d=r?Math.max(Ze,e.top-gn-l):Math.max(Ze,Math.min(e.bottom+gn,n.height-l-Ze));return{left:s,top:d,maxHeight:o,above:r}}function Xr(e,t,n,i){let a=t.kind,r=p=>n({...t,kind:p}),o=i.key,l=pl.filter(([p])=>i.allowNamed!==!1||p!=="named"),s=f;switch(a.kind){case"literal":s=i.symbol?jr(e,a.value,p=>r({...a,value:p}),o):ee("Text",a.value,p=>r({...a,value:p}));break;case"entityState":case"entityAge":s=Pe(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`);break;case"entityAttribute":{let p=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),c=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=u`${Pe(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ee("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:c,mono:!0})}
        <datalist id=${c}>${p.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=kl(e,a.aggregate,p=>r({...a,aggregate:p}),o);break;case"time":s=U("Field",a.timeField,gl,p=>r({...a,timeField:p}));break;case"dataAge":s=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=u`${Qs("Template",a.value,p=>r({...a,value:p}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:U("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}));break}let d=i.showResolved?e.resolve(t):void 0;return u`
    ${U("Source",a.kind,l,p=>r(yl(a,p)))}
    ${s}
    ${i.noFormat?f:$l(t.format,p=>n(ke(p)?{kind:t.kind}:{...t,format:p}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:f}`}function $l(e,t){let n=e??{},i=a=>{let r={...n,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];t(r)};return u`<details class="sub" ?open=${!ke(e)}>
    <summary>Format${ke(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${K("Decimals",n.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${K("Multiply",n.multiply,a=>i({multiply:a}),{optional:!0})}
      ${K("Offset",n.offset,a=>i({offset:a}),{optional:!0})}
      ${U("Case",n.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ee("Prefix",n.prefix??"",a=>i({prefix:a}))}
      ${ee("Suffix",n.suffix??"",a=>i({suffix:a}))}
    </div>
    ${he("Append the entity's unit",!!n.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${he("Show as relative time (45s, 2m, 3h)",!!n.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function kl(e,t,n,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=t.scope;return u`
    ${U("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>n({...t,function:l}))}
    ${U("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>n({...t,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${ee("Domains",a(o.domains),l=>n({...t,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${ee("Area ids",a(o.areaIds),l=>n({...t,scope:{...o,areaIds:r(l)}}))}
          ${ee("Label ids",a(o.labelIds),l=>n({...t,scope:{...o,labelIds:r(l)}}))}
          ${ee("Floor ids",a(o.floorIds),l=>n({...t,scope:{...o,floorIds:r(l)}}))}
        </div>`:u`${o.entities.map((l,s)=>u`<div class="row-inline">
            ${Pe(e,`Entity ${s+1}`,l,d=>{let p=[...o.entities];p[s]=d,n({...t,scope:{...o,entities:p}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,p)=>p!==s)}})}>${_("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${U("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...t};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:s.stateFilter={kind:l},n(s)})}
    ${t.stateFilter&&"value"in t.stateFilter?ee("State",t.stateFilter.value,l=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:l}})):f}
    ${t.function==="count"?f:ee("Attribute (blank = state)",t.attribute??"",l=>{let s={...t};l?s.attribute=l:delete s.attribute,n(s)})}`}var Zr=Bn,Cl=Zr.filter(([e])=>e!=="none");function Sl(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function Qr(e){let t=e.config,n=t.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=Sl(e.savedName,t.name),r=t.refreshMinutes??0,o=Lr.map(s=>[String(s),_r(s)]);Lr.includes(r)||o.push([String(r),_r(r)]);let l=t.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${ee("Name",t.name,s=>e.update(d=>{d.name=s},"name"))}
      ${U("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${U("Tap action",n.type,Zr,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??El).slice(0,7)}
                @input=${ie(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in n?Pe(e,"Target",n,s=>e.update(d=>{d.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):f}
    ${n.type==="openPage"?Tl(e):f}`}var El="#808080",Lr=[0,15,30,60,120];function _r(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function Tl(e){let t=e.config;return eo(e,t.openPageId,t.openPageName,(n,i)=>e.update(a=>{if(n===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=n,i?a.openPageName=i:delete a.openPageName}))}function eo(e,t,n,i){let a=t??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${n||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${U("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?f:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function to(e,t){let n=e.config.values.findIndex(a=>a.id===t.id),i=`nv-${t.id}`;return u`
    ${ee("Name",t.name,a=>e.update(r=>{r.values[n].name=a},`${i}-name`))}
    ${J(e,t.value,a=>e.update(r=>{r.values[n].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${zr(e.config,t.id)} layer${zr(e.config,t.id)===1?"":"s"}.</div>`}function zr(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function no(){return{id:q(),name:"Value",value:I("")}}function me(e,t,n){let i=e.perFamily[t],a=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function ue(e,t,n,i,a=!1){let r=e.elements.find(p=>p.payload.id===n);if(!r)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let l=me(e,t,r),d={...o.placements[n]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let p of e.elements)p.payload.id!==n&&(o.placements[p.payload.id]={frame:{...p.payload.frame},isHidden:p.payload.isHidden});o.placements[n]=d}function Fl(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function Pr(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function Rl(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function io(e,t,n){let i=Pr(n.map(d=>me(e,t,d).isHidden)),a=Pr(n.map(d=>d.payload.isHidden)),r=n.map(Rl),o=n.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var Ei=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function Il(e,t,n){let i=t.payload.id,a=Qt(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"?{domain:"camera"}:{};return u`
    ${Pe(e,t.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>Aa(s,i,l),`${n}-entity`),`${n}-layer-entity`,o)}
    <div class="hint">${Hl(t,a)}</div>`}function Al(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Ml(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Hl(e,t){let n=Al(e),i=n?.kind.kind,r=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let s=t.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${Ml(o)}.${r}`}function Ll(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function _l(e,t){let n=e.timestamp===!0,i=Te(e),a=r=>t(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Te(o)&&(o.timestampCorner=Vn(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${he("Show timestamp",n,r=>t(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${n?u`
      ${U("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?f:U("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>t(o=>{o.timestampCorner=r}))}
      ${K("Text size (pt)",e.timestampSize,r=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,r??Ct))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function oe(e,t,n,i,a={}){let r=e.openSections.has(t),o=()=>e.toggleSection(t);return u`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${_(a.icon??"content")}</span>
      <span class="tt"><h4>${n}</h4>${a.summary?u`<span class="sum">${a.summary}</span>`:f}</span>
      <span class="chev">${_("chevron")}</span>
    </div>
    ${r?u`<div class="sec-b">${i}</div>`:f}
  </section>`}function zl(e){if(e.length===0)return"nothing";let t=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100);return e.length<=12?e.map(t).join(" "):`${e.slice(0,6).map(t).join(" ")} \u2026 ${e.slice(-3).map(t).join(" ")}`}function Pl(e,t){let n=pe(e);switch(t.kind){case"text":return Qe(ae(t.payload.value,n),48);case"icon":return Qe(ae(t.payload.symbol,n),48);case"gauge":return Qe(ae(t.payload.value,n),48);case"chart":return Qe(ae(t.payload.value,n),48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||"No camera yet";case"tap":return Fe(t.payload.action)}}function Nr(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${qr.find(([t])=>t===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${ve(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function ao(e,t,n){let i=t.payload.id,a=e.config.elements.findIndex(m=>m.payload.id===i),r=`el-${i}`,o=(m,b)=>e.update(v=>m(v.elements[a]),b?`${r}-${b}`:void 0),l=me(e.config,n,t),s=l.frame,d=(m,b)=>e.update(v=>ue(v,n,i,{frame:{...s,...m}}),`${r}-${b}-${n}`),p=t.kind==="text"?"Font size":t.kind==="icon"?"Icon size":"Line width",c,h;switch(t.kind){case"text":c=u`
        ${J(e,t.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${he("Live countdown",t.payload.countdown===!0,m=>o(b=>{let v=b.payload;m?v.countdown=!0:delete v.countdown}))}
        ${t.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,h=u`<div class="grid2">
          ${K("Font size (pt)",t.payload.fontSize,m=>o(b=>{b.payload.fontSize=m??14},"size"),{step:1,min:4})}
          ${U("Weight",t.payload.fontWeight,Ei,m=>o(b=>{b.payload.fontWeight=m}))}
        </div>`;break;case"icon":c=u`
        ${J(e,t.payload.symbol,m=>o(b=>{b.payload.symbol=m},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=K("Icon size (pt)",t.payload.size,m=>o(b=>{b.payload.size=m??14},"size"),{step:1,min:4});break;case"gauge":c=u`
        ${J(e,t.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${K("Min",t.payload.minValue,m=>o(b=>{b.payload.minValue=m??0},"min"))}
          ${K("Max",t.payload.maxValue,m=>o(b=>{b.payload.maxValue=m??100},"max"))}
        </div>`,h=u`
        <div class="grid2">
          ${U("Style",t.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],m=>o(b=>{b.payload.style=m}))}
          ${K("Line width (pt)",t.payload.lineWidth,m=>o(b=>{b.payload.lineWidth=m??4},"lw"),{step:.5,min:.5})}
        </div>
        ${se("Track colour",t.payload.trackColorHex,m=>o(b=>{b.payload.trackColorHex=m??"#FFFFFF40"},"track"))}`;break;case"chart":{let m=t.payload,b=(C,R)=>o(E=>C(E.payload),R),v=Ft(e.resolve(m.value)??""),F=m.limit>0&&v.length>m.limit?m.takeFromEnd?v.slice(v.length-m.limit):v.slice(0,m.limit):v;c=u`
        ${J(e,m.value,C=>b(R=>{R.value=C},"value"),{label:"Readings",key:`${r}-value`})}
        <div class="hint">Every number in what this resolves to becomes one point, in order.
          Commas, spaces and square brackets are all just separators, so a text sensor, a list
          attribute and a template that joins a forecast all work. A dot is a decimal point;
          a comma never is.</div>
        ${v.length===0?u`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:u`<div class="hint">Reads ${zl(F)}${v.length===F.length?u` · ${F.length} ${F.length===1?"value":"values"}`:u` · ${F.length} of ${v.length}`}</div>`}
        <div class="grid2">
          ${K("Use",m.limit,C=>b(R=>{R.limit=Math.max(0,Math.round(C??0))},"limit"),{step:1,min:0})}
          ${U("From",m.takeFromEnd?"end":"start",[["start","The first readings"],["end","The last readings"]],C=>b(R=>{R.takeFromEnd=C==="end"}))}
        </div>
        <div class="hint">A forecast sensor often carries 24 or 48 entries. 0 draws all of them.</div>`,h=u`
        ${U("Style",m.style,ul,C=>b(R=>{R.style=C}))}
        <div class="grid2">
          ${U("Scale",m.scale,hl,C=>b(R=>{R.scale=C}))}
          ${U("Baseline",m.baseline,ml,C=>b(R=>{R.baseline=C}))}
        </div>
        ${m.scale==="fixed"?u`<div class="grid2">
              ${K("Min",m.minValue,C=>b(R=>{R.minValue=C??0},"cmin"))}
              ${K("Max",m.maxValue,C=>b(R=>{R.maxValue=C??100},"cmax"))}
            </div>`:f}
        <div class="hint">${m.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${m.style==="bars"?K("Bar gap (pt)",m.barGap,C=>b(R=>{R.barGap=Math.max(0,C??0)},"gap"),{step:.5,min:0}):K("Line width (pt)",m.lineWidth,C=>b(R=>{R.lineWidth=Math.max(.5,C??2)},"lw"),{step:.5,min:.5})}
        ${U("Highlight",m.highlight,qr,C=>b(R=>{R.highlight=C}))}
        ${m.highlight==="none"?f:u`
          <div class="grid2">
            ${m.highlight==="lowest"?f:se("Highest colour",m.highColorHex,C=>b(R=>{R.highColorHex=C??Wt},"hicol"))}
            ${m.highlight==="highest"?f:se("Lowest colour",m.lowColorHex,C=>b(R=>{R.lowColorHex=C??jt},"locol"))}
          </div>
          ${U("Marker",m.marker,fl,C=>b(R=>{R.marker=C}))}
          <div class="hint">Worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":c=u`<div class="grid2">
          ${U("Shape",t.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],m=>o(b=>{b.payload.kind=m}))}
          ${t.payload.kind==="roundedRectangle"?K("Corner radius (pt)",t.payload.cornerRadius,m=>o(b=>{b.payload.cornerRadius=m??6},"radius"),{step:.5,min:0}):f}
        </div>`,h=u`
        ${se("Border colour",t.payload.borderColorHex,m=>o(b=>{m===void 0?delete b.payload.borderColorHex:b.payload.borderColorHex=m},"border"),!0)}
        ${t.payload.borderColorHex!==void 0?K("Border width (pt)",t.payload.borderWidth,m=>o(b=>{b.payload.borderWidth=m??1},"bw"),{step:.5,min:0}):f}`;break;case"image":{let m=t.payload,b=(v,F)=>o(C=>v(C.payload),F);c=u`
        ${m.entity.entityId&&!m.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:f}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=u`
        ${U("Picture",m.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],v=>b(F=>{F.contentMode=v}))}
        ${xi("Zoom",m.zoom,v=>b(F=>{F.zoom=v},"zoom"),{min:di,max:4,step:.05,def:1,format:v=>`${v.toFixed(2)}x`})}
        ${xi("Pan left/right",m.panX,v=>b(F=>{F.panX=v},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${xi("Pan up/down",m.panY,v=>b(F=>{F.panY=v},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${Ll(m)}</div>
        ${K("Corner radius (pt)",m.cornerRadius,v=>b(F=>{F.cornerRadius=Math.max(0,v??kt)},"imgradius"),{step:1,min:0})}`;break}case"tap":{c=u`
        ${ro(e,t.payload,(m,b)=>o(v=>m(v.payload),b),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let y=t.kind==="image"||t.kind==="tap"?void 0:se(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,m=>o(b=>{b.kind!=="image"&&b.kind!=="tap"&&(b.payload.colorSlot.baseColorHex=m??"#FFFFFF")},"color")),g=Wn(e.config,t),$=g?{kind:{kind:"entityState",...g}}:void 0,x=Q[t.kind],S=t.kind==="tap"?void 0:ye(e.config,i)[0],w=t.kind==="image"?t.payload.timestamp===!0:!1;return u`
    ${oe(e,"content","Content",u`${t.kind==="tap"?f:Il(e,t,r)}${c}`,{color:x,icon:"content",summary:Pl(e,t)})}
    ${h===void 0&&y===void 0?f:oe(e,"look",t.kind==="image"?"Picture":"Look",u`${h??f}${y??f}`,{color:x,icon:t.kind==="image"?"image":"look",...Nr(t)?{summary:Nr(t)}:{}})}
    ${t.kind==="image"?oe(e,"timestamp","Timestamp",_l(t.payload,(m,b)=>o(v=>m(v.payload),b)),{color:x,icon:"clock",summary:w?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden"}):f}
    ${t.kind==="tap"?f:oe(e,"tappable","Tap",Vl(e,t,r),{color:j.tap,icon:"tap",summary:S?Fe(S.payload.action):"Not tappable"})}
    ${oe(e,"states","States",uo(e,t.payload.rules,t.kind,m=>m.elements.find(b=>b.payload.id===i)?.payload.rules,`rules-${i}`,$),{color:j.states,icon:"states",summary:Mt(t.payload.rules).replace(/\.$/,"")})}
    ${oe(e,"placement","Place",u`
      <div class="grid4">
        ${K("X",s.x,m=>d({x:m??0},"x"),{step:.01})}
        ${K("Y",s.y,m=>d({y:m??0},"y"),{step:.01})}
        ${K("W",s.width,m=>d({width:m??.5},"w"),{step:.01,min:0})}
        ${K("H",s.height,m=>d({height:m??.5},"h"),{step:.01,min:0})}
      </div>
      ${K("Rotation (degrees)",s.rotationDegrees,m=>d({rotationDegrees:m??0},"rot"),{step:1})}
      ${t.kind==="shape"||t.kind==="image"||t.kind==="tap"?f:K(`${p} in ${O(n)} (blank = shared ${Fl(t)})`,l.size,m=>e.update(b=>m===void 0?ue(b,n,i,{},!0):ue(b,n,i,{size:m}),`${r}-psize-${n}`),{step:1,min:1,optional:!0})}
      ${he(`Hidden in ${O(n)}`,l.isHidden,m=>e.update(b=>ue(b,n,i,{isHidden:m})))}
      ${he("Hidden in every shape",t.payload.isHidden,m=>o(b=>{b.payload.isHidden=m}))}
      <div class="hint">Drag the layer on the ${O(n)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:j.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${O(n)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function ro(e,t,n,i){let a=t.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${U("Tap action",a.type,Cl,o=>n(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?Pe(e,"Target",a,o=>n(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="openPage"?eo(e,t.openPageId,t.openPageName,(o,l)=>n(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):f}`}var Nl=24;function Ol(e,t){let n=[],i=1/0;for(let r of Z){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Fa(e.config,t,r);o&&(n.push(`${O(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return f;let a=i<Nl;return u`<div class=${a?"hint warn":"hint"}>${n.join(" \xB7 ")}${a?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:f}</div>`}function Vl(e,t,n){if(t.kind==="tap")return f;let i=t.payload.id,a=ye(e.config,i)[0],r=(l,s)=>e.update(d=>{let p=d.elements.find(c=>c.kind==="tap"&&c.payload.attachedTo===i);p&&l(p.payload)},s?`${n}-${s}`:void 0),o=jn(e.config,t);return u`
    ${he("Tappable",a!==void 0,l=>e.update(s=>{l?Zt(s,i):Yn(s,i)}))}
    ${a?u`<div class="value-editor">
          ${ro(e,a.payload,r,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${qt(a.payload.outset)?f:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...Dn}})}>${_("reset")}</button>`}
          </div>
        </div>
        ${Ol(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Fe(o)}</b>.</div>`}`}function Or(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Ne(e,t){switch(e.kind){case"text":return Or(ae(e.payload.value,t));case"icon":return Or(ae(e.payload.symbol,t));case"gauge":return ae(e.payload.value,t);case"chart":return ae(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||"camera"}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function oo(e,t){let n=Le(e.config,t.id),i=pe(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===t.id);s&&r(s)},o?`group-${t.id}-${o}`:void 0);return oe(e,"content","Group",u`
    ${ee("Name",t.name,r=>a(o=>{o.name=r},"name"))}
    ${he("Move as one on the watch",t.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(r=>Ne(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Jt(r,t.id))}>Ungroup</button>
    </div>`,{color:j.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function so(e,t){if(t==="inline")return u`${Dl(e)}${$i(e,t)}`;let n=e.config.perFamily[t];if(!n)return u`<div class="hint">No settings stored for ${O(t)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${O(t)} settings</button>
      ${$i(e,t)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[t]),s?`fam-${t}-${s}`:void 0),a=Object.keys(n.placements).length,r=n.backgroundColorHex?ve(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${ve(n.borderColorHex)} border`:"no border";return u`
    ${oe(e,"look",`${O(t)} shape`,u`
      ${se("Background (blank = transparent)",n.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${se("Border colour",n.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${K("Border width (pt)",n.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:j.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${t==="corner"?oe(e,"corner","Corner content",Bl(e,n,i),{color:j.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas"}):f}
    ${oe(e,"states","Shape states",uo(e,n.rules,"layout",l=>l.perFamily[t]?.rules,`rules-${t}`),{color:j.states,icon:"states",summary:Mt(n.rules).replace(/\.$/,"")})}
    ${oe(e,"placements","Placements",u`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${O(t)} placement.`}</div>
      ${a>0?u`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:f}`,{color:j.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${$i(e,t)}`}function $i(e,t){let n=!lt(e.config,t),i=n?"A complication keeps at least one shape.":`Drop the ${O(t)} shape. The watch stops listing this complication for ${O(t)} slots.`;return oe(e,"shape","Remove this shape",u`
    <div class="adders">
      <button class="danger small" ?disabled=${n} title=${i} @click=${()=>e.removeFamily(t)}>Remove the ${O(t)} shape</button>
    </div>
    ${n?u`<div class="hint">This is the only shape. Add another before removing it.</div>`:u`<div class="hint">The watch stops listing this complication for ${O(t)} slots.</div>`}`,{color:j.place,icon:"delete",summary:n?"The only shape":"Drops its layout"})}function Dl(e){let t=e.config.inline;if(!t)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=pe(e);return u`
    ${oe(e,"content","Inline text",u`
      ${ee("Label (blank = value only)",t.label??"",a=>n(r=>{a?r.label=a:delete r.label},"label"))}
      ${J(e,t.value,a=>n(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${he("Live countdown",t.countdown===!0,a=>n(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${t.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:Q.text,icon:"text",summary:Qe(`${t.label?`${t.label}: `:""}${ae(t.value,i)}`,48)})}
    ${oe(e,"symbol","Symbol",u`
      ${jr(e,t.symbol??"",a=>n(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:Q.icon,icon:"icon",summary:t.symbol||"None"})}`}function Bl(e,t,n){let i=t.curvedText?"curved":"canvas",a=t.bezelGauge?"gauge":t.bezelText?"text":"none";return u`
    ${U("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>n(o=>{r==="curved"?o.curvedText||(o.curvedText=I("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?u`
      ${J(e,t.curvedText,r=>n(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${se("Curved text colour",t.curvedColorHex??"#FFFFFF",r=>n(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${U("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>n(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=I("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:I("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&t.bezelText?u`
      ${J(e,t.bezelText,r=>n(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${he("Live countdown",t.bezelCountdown===!0,r=>n(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&t.bezelGauge?Gl(e,t.bezelGauge,n):f}`}function Gl(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],a=r=>o=>n(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return u`
    ${J(e,t.value,r=>n(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${K("Gauge min",t.minValue,r=>n(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${K("Gauge max",t.maxValue,r=>n(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${se("Arc colour (min end)",i[0],a(0))}
    ${se("Arc colour (middle)",i[1],a(1))}
    ${se("Arc colour (max end)",i[2],a(2))}
    ${he("End number labels",!!(t.minLabel||t.maxLabel),r=>n(o=>{let l=o.bezelGauge;r?(l.minLabel=I(String(l.minValue)),l.maxLabel=I(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${t.minLabel?J(e,t.minLabel,r=>n(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${t.maxLabel?J(e,t.maxLabel,r=>n(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var xp=Z.map(e=>[e,O(e)]),Ti={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Ul=Object.keys(Ti);function Kl(e){let t=en[e];return Ul.filter(n=>t.includes(ce[n]))}var Wl={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function yn(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Qe(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function jl(e){if(!e||ke(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function ae(e,t){return`${ql(e,t)}${jl(e.format)}`}function ql(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${Qe(n.value,40)}"`:"(empty)";case"entityState":return yn(n,t);case"entityAttribute":return n.attribute?`${yn(n,t)} \xB7 ${n.attribute}`:yn(n,t);case"entityAge":return`age of ${yn(n,t)}`;case"aggregate":return Yl(n.aggregate);case"time":return Wl[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${Qe(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(a=>a.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`}}function Yl(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function xn(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function Jl(e,t,n,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return u`
    ${t.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:f}
    ${t.map((o,l)=>Xl(e,o,l,t.length,n,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Tt())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function Xl(e,t,n,i,a,r,o){let l=e.liveBranch(t),s=e.forced.get(t.id)??"live",d=c=>s==="live"?c==="live":s==="otherwise"?c==="otherwise":s.caseId===c,p=(c,h)=>r(y=>{let g=y.find($=>$.id===t.id);g&&c(g)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(c=>xn(c,n,n-1))}>${_("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>r(c=>xn(c,n,n+1))}>${_("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(c=>{let h=c.findIndex(y=>y.id===t.id);h>=0&&c.splice(h,1)})}>${_("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((c,h)=>u`<button class="${d(c.id)?"active":""} ${l===c.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:c.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?u`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:f}
    </div>
    ${t.cases.map((c,h)=>Zl(e,c,h,t,a,p,`${o}-${c.id}`))}
    <div class="adders"><button class="small" @click=${()=>p(c=>{c.cases.push(Xn())})}>+ case</button></div>
    ${he("Otherwise (when no case matches)",t.otherwise!==void 0,c=>p(h=>{c?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?u`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${lo(e,t.otherwise,a,c=>p(h=>{h.otherwise&&c(h.otherwise)}),`${o}-otherwise`)}
        </div>`:f}
  </div>`}function Zl(e,t,n,i,a,r,o){let l=(d,p)=>r(c=>{let h=c.cases.find(y=>y.id===t.id);h&&d(h)},p),s=e.liveBranch(i)===t.id;return u`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${s?u` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(d=>xn(d.cases,n,n-1))}>${_("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>r(d=>xn(d.cases,n,n+1))}>${_("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let p=d.cases.findIndex(c=>c.id===t.id);p>=0&&d.cases.splice(p,1)})}>${_("delete")}</button>
    </div>
    <div class="row-inline">
      ${U("When",t.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(p=>{p.when.join=d}))}
    </div>
    ${t.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:f}
    ${t.when.tests.map((d,p)=>Ql(e,d,p,c=>l(h=>{let y=h.when.tests.find(g=>g.id===d.id);y&&c(y)}),()=>l(c=>{c.when.tests=c.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(Jn())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${lo(e,t.then,a,d=>l(p=>d(p.then)),`${o}-then`)}
  </div>`}function Ql(e,t,n,i,a,r){let o=(c,h)=>i(c,h?`${r}-${h}`:void 0),l=t.comparison,s=Ye(l.kind),d=e.evaluateTest(t),p=f;switch(s){case"value":p=J(e,l.value??I(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":p=u`${J(e,l.value??I(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${J(e,l.upper??I(""),c=>o(h=>{h.comparison.upper=c},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":p=u`${ee("Pattern",l.pattern??"",c=>o(h=>{h.comparison.pattern=c},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!ed(l.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"options":p=ee("Options (comma separated)",(l.options??[]).join(", "),c=>o(h=>{h.comparison.options=c.split(",").map(y=>y.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${_("delete")}</button>
    </div>
    ${l.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:J(e,t.value,c=>o(h=>{h.value=c},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${U("Comparison",l.kind,Ma.map(c=>[c,ct[c]]),c=>o(h=>{h.comparison=Zn(h.comparison,c)}))}
    ${p}
  </div>`}function ed(e){try{return new RegExp(e),!0}catch{return!1}}function lo(e,t,n,i,a){let r=Kl(n);return u`
    ${t.length===0?u`<div class="hint">No changes.</div>`:f}
    ${t.map((o,l)=>td(e,o,l,n,(s,d)=>i(p=>{p[l]&&s(p[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(Je(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>u`<option value=${o}>${Ti[o]}</option>`)}
    </select>`}var co=["setColor","setBorderColor","setBackgroundColor"];function td(e,t,n,i,a,r,o){let l=!en[i].includes(ce[t.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${Ti[t.kind]}${l?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${_("delete")}</button>
    </div>
    ${po(e,t,a,o)}
  </div>`}function po(e,t,n,i){let a=tn(t.kind),r=f;if(a==="value"){let o=t.value??I("");if(co.includes(t.kind)){let l=o.kind.kind==="literal";r=u`${l?se("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>n(d=>{d.value=I(s??"#FFFFFF")},"color")):J(e,o,s=>n(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:I("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?f:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=J(e,o,l=>n(s=>{s.value=l},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};r=K(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,l=>n(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=U("Weight",t.weight??"regular",Ei,o=>n(l=>{l.weight=o})));return r}var ki=new Set,bn=new Map,vn=new Map,Vr=new Map;function uo(e,t,n,i,a,r){let o=gi(t);return!o.ok||ki.has(a)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{ki.delete(a),Se(s.target)}}>Show as table</button>
        ${o.ok?f:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${Jl(e,t,n,i,a)}`:nd(e,o.table,t[0],n,i,a,r)}function nd(e,t,n,i,a,r,o){let l=(E,M)=>e.update(P=>{let B=a(P);B&&E(B)},M?`${r}-${M}`:void 0),s=t.value??Vr.get(r)??o,d=t.rows.length===0,p=t.numberMode||d&&s!==void 0&&!Sr(s)&&id(e.resolve(s)),c=en[i],h=bn.get(r)??new Set,y=t.columns.length===0&&h.size===0?[Cr[i]]:[],g=fr(t.columns,[...h,...y.filter(E=>E!==void 0)],c),$=n?e.liveBranch(n):"none",x=n?e.forced.get(n.id)??"live":"live",S=E=>x!=="live"&&(x==="otherwise"?E==="otherwise":x.caseId===E),w=E=>{n&&e.setForced(n.id,S(E)?"live":E==="otherwise"?"otherwise":{caseId:E})},m=E=>{Vr.set(r,E),t.rows.length!==0&&l(M=>wr(M,E),"lhs")},b=()=>l(E=>vr(E,s??I(""),p)),v=t.rows.map((E,M)=>Br(e,{key:`${r}-${E.caseId}`,label:kr(E.comparison,P=>ae(P,pe(e))),columns:g,changes:E.changes,live:$===E.caseId,forced:S(E.caseId),onForce:()=>w(E.caseId),when:ld(e,E.comparison,`${r}-${E.caseId}`,(P,B)=>l(X=>{let z=X[0]?.cases.find(N=>N.id===E.caseId)?.when.tests[0];z&&P(z.comparison)},B&&`${E.caseId}-${B}`)),updChanges:(P,B)=>l(X=>{let z=X[0]?.cases.find(N=>N.id===E.caseId);z&&P(z.then)},B&&`${E.caseId}-${B}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${M===0} @click=${()=>l(P=>yi(P,M,M-1))}>${_("up")}</button>
      <button class="icon" title="Move down" ?disabled=${M===t.rows.length-1} @click=${()=>l(P=>yi(P,M,M+1))}>${_("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(P=>xr(P,E.caseId))}>${_("delete")}</button>`})),F=t.otherwise===void 0?f:Br(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:t.otherwise,live:$==="otherwise",forced:S("otherwise"),onForce:()=>w("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(E,M)=>l(P=>{let B=P[0]?.otherwise;B&&E(B)},M),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(E=>bi(E,!1))}>${_("close")}</button>`}),C=vn.get(r),R=ad.filter(E=>c.includes(E)&&!g.includes(E));return u`
    <div class="states">
      ${J(e,s??I(""),m,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?u`<div class="hint">Choose what these states look at.</div>`:f}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(E=>u`<th>
              <span>${Ie[E]}</span>
              <button class="icon" title=${`Remove the ${Ie[E]} column`}
                @click=${M=>{vn.set(r,E),Se(M.target)}}>${_("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${v}
          ${F}
          ${t.rows.length===0&&t.otherwise===void 0?u`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${C===void 0?f:u`<div class="hint warn confirm-row">
        Remove the ${Ie[C]} column? Its ${Dr(t,C)} value${Dr(t,C)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${E=>{vn.delete(r),bn.get(r)?.delete(C),Se(E.target),l(M=>$r(M,C))}}>Remove</button>
        <button class="small" @click=${E=>{vn.delete(r),Se(E.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${b}>+ state</button>
        ${t.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(E=>bi(E,!0))}>+ otherwise</button>`:f}
        <span class="spacer"></span>
        ${x==="live"?f:u`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${R.length===0?f:u`<select class="chip-add" title="Add a column" @change=${E=>{let M=E.target,P=M.value;if(M.value="",!P)return;let B=bn.get(r)??new Set;B.add(P),bn.set(r,B),Se(M)}}>
          <option value="" selected>+ column…</option>
          ${R.map(E=>u`<option value=${E}>${Ie[E]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${p?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${E=>{ki.add(r),Se(E.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function id(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var ad=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Dr(e,t){let n=0;for(let i of e.rows)hn(i.changes,t)&&(n+=1);return e.otherwise&&hn(e.otherwise,t)&&(n+=1),n}function rd(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Br(e,t){return u`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{rd(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>u`<td>${od(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function od(e,t,n,i,a){let r=hn(n,t),o=Si(a);if(!r)return u`<button type="button" class="cell empty" title=${`Set ${Ie[t]} for this state`}
      @click=${d=>{i(p=>{p.push(Je(mr[t]))}),xl(d.target,o)}}>unchanged</button>`;let l=(d,p)=>i(c=>{let h=c.find(y=>ce[y.kind]===t);h&&d(h)},p&&`${t}-${p}`),s=Ie[t];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${sd(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${Jr}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Lt.has(o)?u`${t==="visibility"?U("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(p=>{p.kind=d})):po(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(p=>{let c=p.findIndex(h=>ce[h.kind]===t);c>=0&&p.splice(c,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:f}
    </div>`}function sd(e,t){if(t.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return u`<span class="cell-word">Shown</span>`;let n=tn(t.kind);if(n==="number")return u`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return u`<span class="cell-word">${Ei.find(([r])=>r===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??I(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(co.includes(t.kind))return u`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?ve(a):ae(i,pe(e))}</span>`;if(t.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return u`${r??f}<span class="cell-word">${a}</span>`}return u`<span class="cell-word">${ae(i,pe(e))}</span>`}function ve(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function ld(e,t,n,i){let a=Ye(t.kind),r=fi(t.kind),o=(l,s,d,p)=>cd(e,l,s,`${n}-${d}`,r,p,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ie(l=>i(s=>{let d=Zn(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${mi.map(l=>u`<option value=${l} ?selected=${l===t.kind}>${dd(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(t.value??I(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?u`<span class="when-and">to</span>${o(t.upper??I(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:f}
  </span>`}function dd(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return ct[e]}}function cd(e,t,n,i,a,r,o){let l=Si(i),s={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return u`<span class="rhs">
      ${J(e,t,n,{...s,compact:!0})}
    </span>`;let d=t.kind.value;return u`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${ie(p=>n({...t,kind:{kind:"literal",value:p}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${Yr(e,l,o,t,n,s)}
  </span>`}var $n=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Kn,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings in the entity, with the highest and lowest marked.",layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function go(e){return $n.find(t=>t.kind===e)??$n[0]}var ho="#FF9F0A",Fi="#8E8E93",pd=["#FF453A","#FFD60A","#34C759"],yo=["#0A84FF","#34C759","#FF9F0A"];function ud(e){return e?.attributes?.device_class==="battery"?pd:yo}var hd={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function md(e){let t=e.iconName?.trim();return t?{off:t,on:t}:hd[Ri(e)]??{off:"circle",on:"circle.fill"}}function fd(e){switch(Ri(e)){case"lock":return{kind:"equals",value:I("locked")};case"cover":case"valve":return{kind:"equals",value:I("open")};case"media_player":return{kind:"equals",value:I("playing")};default:return{kind:"isOn"}}}function Ri(e){return e.domain||e.entityId.split(".")[0]||""}function ht(e){return{...e,domain:Ri(e)}}function gd(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let a=typeof t.device_class=="string"?t.device_class:"",r=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function wn(e){return Math.round(e*1e4)/1e4}function kn(e,t,n){return Math.min(n,Math.max(t,e))}function Ii(e,t,n){let i=re[e],a=kn(wn(t/i.width),0,1),r=kn(wn(n/i.height),0,1);return{x:wn((1-a)/2),y:wn((1-r)/2),width:a,height:r,rotationDegrees:0}}function yd(e){let t=re[e],n=kn(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:Ii(e,n*1.3,n*1.3),size:n}}function bd(e){let t=re[e],n=kn(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:Ii(e,t.width*.88,n*1.7),size:n}}function vd(e){let t=re[e],n=Math.min(t.width,t.height)*.9;return{frame:Ii(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function xd(e){let t=e==="rectangular";return{frame:{x:.05,y:t?.34:.3,width:.9,height:t?.42:.4,rotationDegrees:0},size:2}}function wd(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function $d(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=t))}function _t(e,t,n,i){let a=i(n);t.payload.frame=a.frame,$d(t,a.size);for(let r of Z){if(r===n||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[t.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function zt(e){return Et(e)}function Ai(e,t){let n={kind:{kind:"entityState",...ht(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function mo(e){let t=Je("setIcon");return t.value=I(e),t}function et(e){let t=Je("setColor");return t.value=I(e),t}function kd(e,t){let n=Tt(),i=n.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...ht(e)}},a.comparison=fd(e);let r=t.on!==t.off;return i.then=r?[mo(t.on),et(ho)]:[et(ho)],n.otherwise=r?[mo(t.off),et(Fi)]:[et(Fi)],n}function Cd(e){let t=Tt(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...ht(e)}},i.comparison={kind:"isUnavailable"};let a=Je("setOpacity");return a.number=.35,n.then=[a],t}function fo(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function Sd(e,t,n=yo){let i=t.max-t.min,a=fo(t.min+i/3),r=fo(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:I(a)},changes:[et(n[0])]},{comparison:{kind:"between",value:I(a),upper:I(r)},changes:[et(n[1])]},{comparison:{kind:"greaterThan",value:I(r)},changes:[et(n[2])]}];return gr(Ai(e),o)}function Ed(e,t,n){let i=zt("icon"),a=md(t);return i.payload.symbol=I(a.off),i.payload.colorSlot.baseColorHex=Fi,i.payload.rules=[kd(t,a)],_t(e,i,n.family,yd),e.elements.push(i),Zt(e,i.payload.id,{type:"toggleEntity",...ht(t)}),i.payload.id}function Td(e,t,n){let i=zt("text");return i.payload.value=Ai(t,n.state),i.payload.rules=[Cd(t)],_t(e,i,n.family,bd),e.elements.push(i),i.payload.id}function Fd(e,t,n){let i=zt("gauge");i.payload.value=Ai(t);let a=gd(n.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Sd(t,a,ud(n.state))],_t(e,i,n.family,vd),e.elements.push(i),i.payload.id}function Rd(e,t,n){let i=zt("chart");return i.payload.value={kind:{kind:"entityState",...ht(t)}},i.payload.highlight="both",i.payload.marker="pointer",_t(e,i,n.family,xd),e.elements.push(i),i.payload.id}function Id(e,t,n){let i=zt("image");return i.payload.entity=ht(t),_t(e,i,n.family,wd),e.elements.push(i),i.payload.id}function bo(e,t,n,i){switch(t){case"toggle":return Ed(e,n,i);case"status":return Td(e,n,i);case"gauge":return Fd(e,n,i);case"chart":return Rd(e,n,i);case"camera":return Id(e,n,i)}}var Md=3e4,Hd=500,vo="preset-entity",Ld={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Mi(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function _d(e){return e.kind==="family"?"look":"content"}function zd(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var xo=300,wo=400,Hi=52,$o=36,tt=200,Pd=720,Cn=320,Nd=80,Od=56,ko="wrist-assistant-panel.columns.v2",Li=e=>Math.max(tt,Math.min(Pd,Math.round(e))),Co=e=>e.metaKey||e.ctrlKey||e.shiftKey,So=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl";function Eo(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-Nd;if(i>=tt*2+Cn){let r=i-Cn,o=t,l=n;if(o+l>r){let s=r/(o+l);o=Math.max(tt,Math.floor(o*s)),l=Math.max(tt,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(tt,o-d):l=Math.max(tt,l-d))}return{columns:3,left:o,right:l}}let a=e-Od;return a>=tt+Cn?{columns:2,left:Math.min(t,a-Cn),right:n}:{columns:1,left:t,right:n}}var A=class extends Me{constructor(){super(...arguments);this.narrow=!1;this.colLeft=xo;this.colRight=wo;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=It.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.icons=lr(()=>this.requestUpdate());this.imageSizes=dr(()=>this.requestUpdate());this.symbols=new cn(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||Wr(vo)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=En`
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
      --wa-states: ${le(j.states)};
      --wa-place: ${le(j.place)};
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
      display: grid; grid-template-columns: 16px 4px ${Hi}px minmax(0, 1fr) auto; align-items: center; gap: 8px;
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
      width: ${Hi}px; height: ${$o}px; border-radius: 8px; overflow: hidden; flex: none;
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
    .layer .lockbtn.on { opacity: 1; color: ${le(j.locked)}; filter: drop-shadow(0 0 4px ${le(j.locked)}); }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(ko);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=Li(i.left)),typeof i.right=="number"&&(this.colRight=Li(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(ko,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}renderGutter(n){return u`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=xo:this.colRight=wo,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Eo(this.panelWidth,this.colLeft,this.colRight),l=n==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=c=>{if(c.pointerId!==i.pointerId)return;let h=c.clientX-r,y=Li(n==="left"?l+h:l-h);n==="left"?this.colLeft=y:this.colRight=y},d=c=>{c.pointerId===i.pointerId&&(p(),this.saveColumnWidths())},p=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(r=>r!==void 0),a=n.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(n.has("inspect")){let i=n.get("inspect");(i===void 0||Mi(i)!==Mi(this.inspect))&&(this.openSections=new Set(Ci))}}updated(n){let i=Mi(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=Ld[n.key];if(r&&!a&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(r.dx,r.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}(n.metaKey||n.ctrlKey)&&(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!a?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!a&&(n.preventDefault(),this.redo()))}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await Zi(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${Oe(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=ja(this.owners.find(a=>a.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await aa(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await Qi(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${Oe(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Xe.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),a=ka(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Oe(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Xe(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return ma(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await ea(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=Oe(n)}}renderSendButton(){let n=Ha({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return f;let i=La(n),a=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return u`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<On}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(this.draft){try{this.compiled=ti(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0,this.compiled?.document!==this.compiledDocument&&(this.compiledDocument=this.compiled?.document,this.scheduleTemplates(Hd))}}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new Re(this.buildContext());return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i)}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||rr(n.app_version):!0}get canvasFamily(){if(At(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&Qa(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Za(n)[0]??"rectangular")}addShape(n){this.mutate(i=>er(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!lt(i,n))return;let a=nr(i,n);a.length>0&&!window.confirm(`Remove the ${O(n)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>tr(r,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(Ca("New complication",this.freeSlot(),[n]))}setForced(n,i){let a=new Map(this.forced);i==="live"?a.delete(n):a.set(n,i),this.forced=a}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=q(),l.slotIndex=o,i=new Xe(l,null)}let a=i.encoded(),r=await ta(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=Xe.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Oe(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await na(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=Oe(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=q(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await ia(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Oe(a)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},Md)}async refreshTemplates(){let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await ra(this.hass,{doc:n})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Na(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Oe(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=Vd(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),n.set(i,l)}return{entityStates:n,templateResults:this.templateResults,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return u`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let r=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?qn(i,r):void 0}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let x=this.focusTapId();if(x!==void 0&&o===x&&l&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,l,x,r??void 0);return}let S=this.hitLayerId(i);S?this.inspect={kind:"layer",id:S}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let p=Co(i);if(!p&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let c=qn(this.draft.config,o),h=this.draft.config.elements.find(x=>x.payload.id===c);if(!c||!h)return;if(p){i.preventDefault(),this.togglePick(c);return}let y=je(this.draft.config,c);if(y?.locked&&!r&&!d){this.beginGroupGesture(n,i,l,y);return}if((this.inspect.kind!=="layer"||this.inspect.id!==c)&&(this.inspect={kind:"layer",id:c},r))return;i.preventDefault();let g=me(this.draft.config,n,h).frame,$=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=c;let x=h.payload,S=ge[n],w=g.width*S.width,m=g.height*S.height,b={x:0,y:0,w,h:m,cx:w/2,cy:m/2},v=sn(x,b,on(new Date));if(this.cancelGesture?.(),s){let E=$.width/S.width,M=x.timestampSize;this.cancelGesture=Ir(l,i,s,{w:v.w*E,h:v.h*E},(P,B)=>{let X=Math.min(40,Math.max(4,Math.round(M*P)));this.mutate(z=>{let N=z.elements.find(ne=>ne.payload.id===c);N?.kind==="image"&&(N.payload.timestampSize=X)},`ts-size-${c}`),B&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let F={x:0,y:0,w:g.width*$.width,h:g.height*$.height},C=Te(x)?{x:x.timestampX,y:x.timestampY}:{x:(v.x+v.w/2)/b.w,y:(v.y+v.h/2)/b.h},R=!1;this.cancelGesture=Rr(l,F,i,C,(E,M,P)=>{P||(R=!0),R&&this.mutate(B=>{let X=B.elements.find(z=>z.payload.id===c);X?.kind==="image"&&(X.payload.timestampX=E,X.payload.timestampY=M)},`ts-${c}`),P&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=fn(l,$,i,{elementId:c,frame:g,handle:r??void 0},{onFrame:(x,S,w)=>{this.mutate(m=>ue(m,n,x,{frame:S}),`drag-${x}-${n}`),w&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,a,r){let o=this.draft?.config;if(!o)return;let l=Le(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(x=>[x.payload.id,me(o,n,x).frame])),d=[...s.values()],p=Math.min(...d.map(x=>x.x)),c=Math.min(...d.map(x=>x.y)),h=Math.max(...d.map(x=>x.x+x.width)),y=Math.max(...d.map(x=>x.y+x.height)),g={x:p,y:c,width:h-p,height:y-c,rotationDegrees:0},$=x=>Math.round(x*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=fn(a,this.gestureCanvas(n),i,{elementId:r.id,frame:g},{onFrame:(x,S,w)=>{let m=S.x-g.x,b=S.y-g.y;this.mutate(v=>{for(let[F,C]of s)ue(v,n,F,{frame:{...C,x:$(C.x+m),y:$(C.y+b)}})},`drag-group-${r.id}-${n}`),w&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Tr:1,l=n*o,s=i*o,d=this.canvasFamily,p=ge[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,p,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let x=this.inspect.id;return this.nudgeMany(Le(r,x).map(S=>S.payload.id),d,p,`nudge-group-${x}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let c=this.inspect.id,h=r.elements.find(x=>x.payload.id===c);if(!h)return!1;let y=je(r,c);if(y?.locked)return this.nudgeMany(Le(r,y.id).map(x=>x.payload.id),d,p,`nudge-group-${y.id}-${d}`,l,s);let g=me(r,d,h).frame,$=vi(g,l,s,p);return($.x!==g.x||$.y!==g.y)&&this.mutate(x=>ue(x,d,c,{frame:$}),`nudge-${c}-${d}`),!0}nudgeMany(n,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=b=>Math.round(b*1e3)/1e3,p=new Map;for(let b of n){let v=s.elements.find(F=>F.payload.id===b);v&&p.set(b,me(s,i,v).frame)}if(p.size===0)return!1;let c=[...p.values()],h=Math.min(...c.map(b=>b.x)),y=Math.min(...c.map(b=>b.y)),g=Math.max(...c.map(b=>b.x+b.width)),$=Math.max(...c.map(b=>b.y+b.height)),x={x:h,y,width:g-h,height:$-y,rotationDegrees:0},S=vi(x,o,l,a),w=S.x-x.x,m=S.y-x.y;return(w!==0||m!==0)&&this.mutate(b=>{for(let[v,F]of p)ue(b,i,v,{frame:{...F,x:d(F.x+w),y:d(F.y+m)}})},r),!0}nudgeTimestamp(n,i,a,r){let o=this.draft?.config,l=o?.elements.find(x=>x.payload.id===n);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=ge[i],p=me(o,i,l).frame,c=p.width*d.width,h=p.height*d.height,y=sn(s,{x:0,y:0,w:c,h,cx:c/2,cy:h/2},on(new Date)),g=Te(s)?{x:s.timestampX,y:s.timestampY}:{x:c>0?(y.x+y.w/2)/c:.5,y:h>0?(y.y+y.h/2)/h:.5},$=Fr(g,a,r,{w:c,h});return($.x!==g.x||$.y!==g.y)&&this.mutate(x=>{let S=x.elements.find(w=>w.payload.id===n);S?.kind==="image"&&(S.payload.timestampX=$.x,S.payload.timestampY=$.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=rn(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=ci(i.scale,r);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=n.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:ye(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(c=>c.payload.id===r);if(!l||!s)return;let d=de(l,s),p=me(l,n,s).frame;this.cancelGesture?.(),this.cancelGesture=fn(a,this.gestureCanvas(n),i,{elementId:r,frame:p,handle:o},{onFrame:(c,h,y)=>{this.mutate(g=>{d?Ta(g,c,n,h):ue(g,n,c,{frame:h})},`tap-box-${c}-${n}`),y&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Eo(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1><span class="mark">${_("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:f}
        <div class="toolbar">
          <button @click=${()=>this.undo()} ?disabled=${!n?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${()=>this.redo()} ?disabled=${!n?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${r=>{this.selectOwner(r.target.value)}}>
            ${this.owners.map(r=>u`<option value=${r.owner_watch_id} ?selected=${r.owner_watch_id===this.ownerId}>
              ${_i(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":n?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:f}
      ${this.watchSupported?u`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${or(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(O).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(n){return u`<span class="shape-dots">${st.map(i=>u`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${O(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=n?n.config.name.trim()||"Untitled":"No complication",r=n?n.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:f}
        ${_("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.map(s=>s.kind==="record"?u`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(zd(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:u`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${n&&n.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:f}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${_("plus")}<span class="pk-name">New complication</span>${l<0?u`<span class="pk-badge">watch is full</span>`:f}
          </button>
          ${this.newShapeChooser&&l>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${st.map(s=>u`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${O(s)}</button>`)}
            </div>
          </div>`:f}`:f}
      </div>`:f}
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
                ${i.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${_i(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return f;let i=n.elements.length>=64;return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${_("plus")}</span>Add a layer</h2>
      <div class="add-grid">
        ${ir.map(a=>u`<button class="add" style=${`--k:${Q[a]}`} ?disabled=${i} title=${`Add a blank ${dt[a].toLowerCase()} layer`}
          @click=${()=>{let r=Et(a);this.mutate(o=>{o.elements.push(r)}),this.inspect={kind:"layer",id:r.payload.id}}}>${_(a)}<span>${dt[a]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${$n.map(a=>u`<button class="preset" title=${a.blurb}
          ?disabled=${n.elements.length+a.layerCount>64}
          @click=${()=>this.openPreset(a.kind)}>${a.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,a,r=!1){n!==i&&this.mutate(o=>{let l=o.elements.filter(g=>!de(o,g)),s=o.elements.filter(g=>de(o,g)),d=[...l].reverse(),p=d.find(g=>g.payload.id===i);if(!p)return;let c=o.groups?.find(g=>g.id===n),h=c?d.filter(g=>g.payload.groupId===c.id):d.filter(g=>g.payload.id===n);if(h.length===0||h.includes(p))return;d=d.filter(g=>!h.includes(g));let y;if((c||r)&&p.payload.groupId!==void 0){let g=d.filter($=>$.payload.groupId===p.payload.groupId);y=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else y=d.indexOf(p)+(a?0:1);if(d.splice(y,0,...h),!c){let g=h[0],$=r?void 0:p.payload.groupId;$===void 0?delete g.payload.groupId:g.payload.groupId=$}o.elements=[...d.reverse(),...s],_e(o),St(o)})}rowDrag(n,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=n,a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"),a.currentTarget.classList.add("dragging")},onEnd:a=>{this.dragId=void 0,a.currentTarget.classList.remove("dragging")},onOver:a=>{if(!this.dragId||this.dragId===n)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=a.clientY<o.top+o.height/2;r.classList.toggle("drop-before",l),r.classList.toggle("drop-after",!l)},onLeave:a=>{a.currentTarget.classList.remove("drop-before","drop-after")},onDrop:a=>{a.preventDefault();let r=a.currentTarget,o=r.classList.contains("drop-before");r.classList.remove("drop-before","drop-after"),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(Co(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===n){this.togglePick(n);return}let r=[...i.elements].filter(s=>!de(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(n);if(o<0||l<0){this.togglePick(n);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi],i;this.mutate(a=>{i=wa(a,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return f;let i=this.canEdit,a=this.canvasFamily,r=(v,F)=>this.mutate(C=>{let R=C.elements.filter(z=>!de(C,z)),E=C.elements.filter(z=>de(C,z)),M=R.findIndex(z=>z.payload.id===v),P=M+F;if(M<0||P<0||P>=R.length)return;[R[M],R[P]]=[R[P],R[M]];let B=R[P],X=R[M];B.payload.groupId!==X.payload.groupId&&(X.payload.groupId===void 0?delete B.payload.groupId:B.payload.groupId=X.payload.groupId),C.elements=[...R,...E],_e(C),St(C)}),o=v=>{let F;this.mutate(C=>{F=Ia(C,v)}),F&&(this.inspect={kind:"layer",id:F})},l=v=>{this.mutate(F=>Ra(F,v)),this.inspect.kind==="layer"&&this.inspect.id===v&&(this.inspect={kind:"general"})},s=[...n.elements].filter(v=>!de(n,v)).reverse(),d=pe(this.host()),p=new Re(this.buildContext()),c=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",y=this.activeFamily==="inline"?"one line of text":`${c?.backgroundColorHex?ve(c.backgroundColorHex):"transparent"} \xB7 ${c?.borderColorHex?`${c.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(v=>n.elements.some(F=>F.payload.id===v)).length,$=ii(n,this.buildContext(),this.forced)[a],x=v=>$?u`<span class="thumb">${Xa($,v,{icons:this.icons,imageSizes:this.imageSizes,width:Hi,height:$o})}</span>`:u`<span class="thumb"></span>`,S=(v,F)=>{let C=v.payload.id,R=this.inspect.kind==="layer"&&this.inspect.id===C,E=me(n,a,v),M=v.payload.isHidden||E.isHidden,P=ye(n,C)[0],B=Mt(v.payload.rules),X=this.picking&&this.pickHoverId===C,z=this.rowDrag(C,i);return u`<div class="layer ${R?"hl":""} ${X?"pick":""} ${M?"dim":""} ${this.multi.has(C)?"multi":""} ${F?"kid":""}"
        style=${`--k:${Q[v.kind]}`} tabindex="0" draggable=${z.draggable}
        @click=${N=>this.clickRow(C,N)}
        @keydown=${N=>{N.key==="Enter"&&(this.inspect={kind:"layer",id:C})}}
        @dragstart=${z.onStart} @dragend=${z.onEnd} @dragover=${z.onOver} @dragleave=${z.onLeave} @drop=${z.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${_("grip")}</span>
        <span class="bar"></span>
        ${x([C])}
        <span class="name">
          <b>${Ne(v,d)}</b>
          <small><span class="kind">${dt[v.kind]}</span> · ${Dd(v,p)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${P?u`<span class="badge tap" title=${`Tappable \xB7 ${Ne(P,d)}`}>tap</span>`:f}
            ${v.payload.rules.length===0?f:u`<span class="badge states" title=${B}>${B.replace(/\.$/,"").toLowerCase()}</span>`}
            ${M?u`<span class="badge">hidden</span>`:f}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${N=>{N.stopPropagation(),r(C,1)}}>${_("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${N=>{N.stopPropagation(),r(C,-1)}}>${_("down")}</button>
            <button class="icon" title=${E.isHidden?`Show in ${O(a)}`:`Hide in ${O(a)}`} aria-label=${E.isHidden?"Show this layer":"Hide this layer"} @click=${N=>{N.stopPropagation(),this.mutate(ne=>ue(ne,a,C,{isHidden:!E.isHidden}))}}>${_(E.isHidden?"hide":"show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${N=>{N.stopPropagation(),o(C)}}>${_("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${N=>{N.stopPropagation(),l(C)}}>${_("delete")}</button>
          </span>`:f}
        </span>
      </div>`},w=(v,F)=>{let C=this.inspect.kind==="group"&&this.inspect.id===v.id,R=!this.collapsed.has(v.id),E=this.rowDrag(v.id,i),M=F[0],P=F[F.length-1],B=["drop-before","drop-into","drop-after"],X=z=>{let N=z.currentTarget.getBoundingClientRect(),ne=(z.clientY-N.top)/N.height;return ne<.25?"drop-before":!R&&ne>.75?"drop-after":"drop-into"};return u`<div class="layer group ${C?"hl":""}" style=${`--k:${j.group}`} tabindex="0" draggable=${E.draggable}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:v.id}}}
        @keydown=${z=>{z.key==="Enter"&&(this.inspect={kind:"group",id:v.id})}}
        @dragstart=${E.onStart} @dragend=${E.onEnd}
        @dragover=${z=>{if(!this.dragId||this.dragId===v.id)return;z.preventDefault();let N=z.currentTarget,ne=X(z);for(let fe of B)N.classList.toggle(fe,fe===ne)}}
        @dragleave=${z=>{z.currentTarget.classList.remove(...B)}}
        @drop=${z=>{z.preventDefault();let N=z.currentTarget,ne=X(z);N.classList.remove(...B);let fe=this.dragId;if(this.dragId=void 0,!(!fe||!M||!P)){if(ne==="drop-before"){this.reorderLayer(fe,M.payload.id,!0,!0);return}if(ne==="drop-after"){this.reorderLayer(fe,P.payload.id,!1,!0);return}this.isGroupId(fe)||(this.reorderLayer(fe,M.payload.id,!0),this.mutate(To=>$a(To,fe,v.id)))}}}>
        <button class="chev" aria-expanded=${R?"true":"false"} title=${R?"Fold the group":"Unfold the group"}
          @click=${z=>{z.stopPropagation();let N=new Set(this.collapsed);R?N.add(v.id):N.delete(v.id),this.collapsed=N}}>${_("chevron")}</button>
        <span class="bar"></span>
        ${x(F.map(z=>z.payload.id))}
        <span class="name">
          <b>${v.name}</b>
          <small><span class="kind">Group</span> · ${F.length} layer${F.length===1?"":"s"} · ${v.locked?"moves as one":"unlocked"}</small>
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title="Ungroup: keep the layers, drop the folder" aria-label="Ungroup" @click=${z=>{z.stopPropagation(),this.mutate(N=>Jt(N,v.id)),C&&(this.inspect={kind:"general"})}}>${_("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${v.locked?"on":""}" ?disabled=${!i}
            title=${v.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${v.locked?"Unlock the group":"Lock the group"}
            @click=${z=>{z.stopPropagation(),this.mutate(N=>{let ne=N.groups?.find(fe=>fe.id===v.id);ne&&(ne.locked=!ne.locked)})}}>${_(v.locked?"lock":"unlock")}</button>
        </span>
      </div>`},m=[],b=new Set;for(let v=0;v<s.length;v++){let F=s[v],C=F.payload.groupId,R=C===void 0?void 0:n.groups?.find(M=>M.id===C);if(!R){m.push(S(F,!1));continue}if(b.has(R.id))continue;b.add(R.id);let E=s.filter(M=>M.payload.groupId===R.id);m.push(w(R,E)),this.collapsed.has(R.id)||m.push(u`<div class="group-kids">${E.map(M=>S(M,!0))}</div>`)}return u`<div class="card">
      <h2 class="panel-title"><span class="swatch">${_("layers")}</span>Layers<span class="spacer"></span><span class="mini">top draws last</span>${this.renderPickButton()}</h2>
      ${this.activeFamily==="inline"?u`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${O(a)} shape.</div>`:f}
      ${g>=2&&i?u`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?u`<div class="hint">${So}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one.</div>`:f}
      ${n.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:f}
      <div class="layers">
      ${m}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${j.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${v=>{v.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${v=>{this.dragId&&(v.preventDefault(),v.currentTarget.classList.add("drop-before"))}}
        @dragleave=${v=>{v.currentTarget.classList.remove("drop-before")}}
        @drop=${v=>{v.preventDefault(),v.currentTarget.classList.remove("drop-before");let F=this.dragId,C=[...s].reverse().find(R=>R.payload.id!==F&&R.payload.groupId!==F);F&&C&&this.reorderLayer(F,C.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${_("shape")}</span>
        <span class="bar"></span>
        ${x([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${O(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${y}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let n=this.presetKind?go(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?f:u`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${Pe(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},vo,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=bo(l,n,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=ii(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${Rt.map(o=>u`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${It.label} box. Smaller cases scale it down.</span>
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
    </div>`}renderBigPreview(n,i,a){let r=i[n];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?je(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||je(l,o)?.locked)?Le(l,s).map(g=>g.payload.id):[],p=[...new Set([...d,...this.multi])],c=a.slots[n],h=this.focusTapId(),y={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:c,highlightId:h??o,...p.length>0&&!this.showTaps?{highlightIds:p}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking&&this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${g=>this.onPreviewPointerDown(n,g)}
      @pointermove=${g=>this.onPickMove(g)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${pi(r,y)}
    </div>`}renderUnder(n,i){let a=pe(this.host()),r=this.inspect,o=r.kind==="layer"?n.elements.find(c=>c.payload.id===r.id):void 0,l;if(this.showTaps)l=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Fe(n.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let c=n.groups?.find(y=>y.id===r.id),h=c?Le(n,c.id).length:0;l=c?u`editing group <b>${c.name}</b>. ${c.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let c=je(n,o.payload.id);l=c?.locked?u`editing <b>${Ne(o,a)}</b> in <b>${c.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${Ne(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=rn(s,i),p=Math.round(d.scale*100);return u`<div class="under"><b>${O(i)}</b> · ${s.width} × ${s.height} pt${p!==100?` \xB7 ${p}%`:""} · ${l}</div>`}renderInlinePreview(n,i){let a;if(!n)a=u`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>r?ot((n.countdownEnd-r)/1e3):n.text,l=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;a=u`<div class="inline-line">${l??f}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?a:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(n){let i=this.host(),a=this.records.find(p=>p.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?_i(r):void 0].filter(Boolean).join(" \xB7 "),l=n.values,s=new Re(this.buildContext()),d=pe(i);return u`<div class="strip-row" style=${`--c:${j.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${_("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${Qr(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let p=no();this.mutate(c=>{c.values.push(p)}),this.inspect={kind:"data",id:p.id}}}>Add</button>`:f}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${l.map(p=>{let c=s.resolve({kind:{kind:"named",id:p.id}}),h=this.inspect.kind==="data"&&this.inspect.id===p.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:p.id}}}>
            <span class="name">${p.name||"(unnamed)"}</span>
            <span class="meta ${c===void 0?"none":""}" title=${ae(p.value,d)}>${c??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${y=>{y.stopPropagation(),this.mutate(g=>{g.values=g.values.filter($=>$.id!==p.id)}),h&&(this.inspect={kind:"general"})}}>${_("delete")}</button>`:f}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let a=n.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${j.place}`}><span class="swatch">${_("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${st.map(r=>{if(!a.includes(r))return u`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${O(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${O(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?pi(c,{icons:this.icons,imageSizes:this.imageSizes,slot:It.slots[r]}):f}let d=r!=="inline"&&n.elements.every(c=>me(n,r,c).isHidden||c.payload.isHidden)&&n.elements.length>0,p=this.canEdit&&lt(n,r);return u`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${O(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${O(r)}${d?u`<small>· nothing shown</small>`:f}${l?u`<small>· editing</small>`:f}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!p}
              title=${p?`Remove the ${O(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${O(r)} shape`}
              @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${_("delete")}</button>`:f}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return f;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${j.states}`}><span class="swatch">${_("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",p=this.testValues.get(r),h=n.elements.find(g=>Qt(n,g.payload.id).some($=>$.ref.entityId===r))?.kind??"text",y=this.editingValue===r;return u`<button class="vchip ${p!==void 0?"testing":""}" style=${`--k:${Q[h]}`}
            title=${p!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${g=>{g.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${_(h)}</span><b>${l}</b>
            ${y?u`<input type="text" .value=${p??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${g=>this.commitTestValue(r,g.target.value)} />`:u`<span class="val">${p!==void 0?`${p}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[n]?.state;a===""||a===o?r.delete(n):r.set(n,a),this.testValues=r}currentCase(){return Rt.find(n=>n.label===this.previewCase)??It}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let a=this.inspect,r=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":O(this.activeFamily),l=a.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${j.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=f,d=f;if(i!==void 0)s=u`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let p=n.elements.find(c=>c.payload.id===a.id);if(p){s=u`<span class="here" style=${`--k:${Q[p.kind]}`}><span class="kchip">${dt[p.kind]}</span>${Ne(p,pe(this.host()))}</span>`;let c=je(n,p.payload.id);c&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:c.id}}} title="Edit the group">${c.name}</button>`)}}else if(a.kind==="group"){let p=n.groups?.find(c=>c.id===a.id);p&&(s=u`<span class="here" style=${`--k:${j.group}`}><span class="kchip">Group</span>${p.name}</span>`)}else if(a.kind==="data"){let p=n.values.find(c=>c.id===a.id);p&&(s=u`<span class="here" style=${`--k:${j.complication}`}><span class="kchip">Value</span>${p.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===f?f:u`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return f;let i=this.pickedElements(n);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let a=this.host(),r=this.inspect,o=f,l=!0;if(r.kind==="layer"){let d=n.elements.find(p=>p.payload.id===r.id);if(!d)return this.inspect={kind:"general"},f;o=ao(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=n.groups?.find(p=>p.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=oo(a,d)}else if(r.kind==="data"){let d=n.values.find(p=>p.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=u`<div class="sec" data-open="true" style=${`--c:${j.complication}`}>
        <div class="sec-h"><span class="swatch">${_("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${to(a,d)}</div>
      </div>`}else r.kind==="family"?o=so(a,this.activeFamily):(l=!1,o=u`<div class="empty-insp">${_("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${l?u`<button class="expand" @click=${()=>{this.openSections=s?new Set([_d(r)]):new Set(Ci)}}>${s?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,a){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${n}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:f}</span></label>`}multiEditor(n,i){let a=this.canvasFamily,r=pe(this.host()),o=new Re(this.buildContext()),l=io(n,a,i),s=i.length,d=[...i].reverse(),p=y=>this.mutate(g=>{for(let $ of i)ue(g,a,$.payload.id,{isHidden:y})}),c=y=>this.mutate(g=>{for(let $ of i){let x=g.elements.find(S=>S.payload.id===$.payload.id);x&&(x.payload.isHidden=y)}}),h=y=>this.mutate(g=>{for(let $ of i){let x=g.elements.find(S=>S.payload.id===$.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&(x.payload.colorSlot.baseColorHex=y)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${_("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(y=>u`<div class="row" style=${`--k:${Q[y.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${y.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(y.payload.symbol)??"questionmark",16,y.payload.colorSlot.baseColorHex)??f}</span>`:f}
                <b>${Ne(y,r)}</b><span class="kind">${dt[y.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${So}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${j.place}`}>
        <div class="sec-h"><span class="swatch">${_("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${O(a)}`,l.hiddenHere,p)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,c)}
          ${l.colourable?u`${se("Colour",l.colour,y=>{y!==void 0&&h(y)})}
              ${l.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:f}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return f;let i=this.records.find(r=>r.id===this.selectedId),a=pr({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
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
    </details>`}};H([at({attribute:!1})],A.prototype,"hass",2),H([at({type:Boolean})],A.prototype,"narrow",2),H([at({attribute:!1})],A.prototype,"panel",2),H([L()],A.prototype,"colLeft",2),H([L()],A.prototype,"colRight",2),H([L()],A.prototype,"panelWidth",2),H([L()],A.prototype,"owners",2),H([L()],A.prototype,"ownerId",2),H([L()],A.prototype,"records",2),H([L()],A.prototype,"selectedId",2),H([L()],A.prototype,"draft",2),H([L()],A.prototype,"readOnlyReason",2),H([L()],A.prototype,"parseError",2),H([L()],A.prototype,"maxSchemaVersion",2),H([L()],A.prototype,"presets",2),H([L()],A.prototype,"occupied",2),H([L()],A.prototype,"serverToken",2),H([L()],A.prototype,"appliedToken",2),H([L()],A.prototype,"polling",2),H([L()],A.prototype,"sendPending",2),H([L()],A.prototype,"pages",2),H([L()],A.prototype,"templateResults",2),H([L()],A.prototype,"templateError",2),H([L()],A.prototype,"templateFetchedAt",2),H([L()],A.prototype,"forced",2),H([L()],A.prototype,"showRaw",2),H([L()],A.prototype,"inspect",2),H([L()],A.prototype,"openSections",2),H([L()],A.prototype,"pickerOpen",2),H([L()],A.prototype,"testValues",2),H([L()],A.prototype,"editingValue",2),H([L()],A.prototype,"multi",2),H([L()],A.prototype,"collapsed",2),H([L()],A.prototype,"activeFamily",2),H([L()],A.prototype,"picking",2),H([L()],A.prototype,"pickHoverId",2),H([L()],A.prototype,"showTaps",2),H([L()],A.prototype,"timestampActiveId",2),H([L()],A.prototype,"savedName",2),H([L()],A.prototype,"presetKind",2),H([L()],A.prototype,"presetEntity",2),H([L()],A.prototype,"newShapeChooser",2),H([L()],A.prototype,"previewCase",2),H([L()],A.prototype,"loadError",2),H([L()],A.prototype,"saveError",2),H([L()],A.prototype,"saving",2),H([L()],A.prototype,"conflict",2),H([L()],A.prototype,"remoteRevision",2),H([L()],A.prototype,"confirmDelete",2),H([L()],A.prototype,"moveTarget",2),H([L()],A.prototype,"moving",2),H([L()],A.prototype,"moveError",2),H([L()],A.prototype,"version",2);function Oe(e){return String(e?.message??e)}function Vd(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function _i(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function Dd(e,t){switch(e.kind){case"text":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${ve(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.style}`;case"chart":return`${e.payload.style} \xB7 ${Ft(t.resolve(e.payload.value)??"").length} values`;case"shape":return`${ve(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Fe(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",A);export{A as WristAssistantPanel,Eo as columnFit};
