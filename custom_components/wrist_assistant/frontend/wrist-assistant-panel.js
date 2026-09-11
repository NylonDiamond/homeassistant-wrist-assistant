var pu=Object.defineProperty;var hu=Object.getOwnPropertyDescriptor;var L=(e,n,t,i)=>{for(var a=i>1?void 0:i?hu(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&pu(n,t,a),a};var Si=globalThis,Ti=Si.ShadowRoot&&(Si.ShadyCSS===void 0||Si.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ga=Symbol(),Yo=new WeakMap,Hn=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Ga)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(Ti&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=Yo.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Yo.set(t,n))}return n}toString(){return this.cssText}},ke=e=>new Hn(typeof e=="string"?e:e+"",void 0,Ga),Ka=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Hn(t,e,Ga)},Jo=(e,n)=>{if(Ti)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Si.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Wa=Ti?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return ke(t)})(e):e;var{is:mu,defineProperty:fu,getOwnPropertyDescriptor:gu,getOwnPropertyNames:yu,getOwnPropertySymbols:bu,getPrototypeOf:xu}=Object,Ei=globalThis,Xo=Ei.trustedTypes,vu=Xo?Xo.emptyScript:"",wu=Ei.reactiveElementPolyfillSupport,Ln=(e,n)=>e,_n={toAttribute(e,n){switch(n){case Boolean:e=e?vu:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},Mi=(e,n)=>!mu(e,n),Zo={attribute:!0,type:String,converter:_n,reflect:!1,useDefault:!1,hasChanged:Mi};Symbol.metadata??=Symbol("metadata"),Ei.litPropertyMetadata??=new WeakMap;var at=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=Zo){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&fu(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=gu(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Zo}static _$Ei(){if(this.hasOwnProperty(Ln("elementProperties")))return;let n=xu(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ln("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ln("properties"))){let t=this.properties,i=[...yu(t),...bu(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Wa(a))}else n!==void 0&&t.push(Wa(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Jo(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:_n).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:_n;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??Mi)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};at.elementStyles=[],at.shadowRootOptions={mode:"open"},at[Ln("elementProperties")]=new Map,at[Ln("finalized")]=new Map,wu?.({ReactiveElement:at}),(Ei.reactiveElementVersions??=[]).push("2.1.2");var Qa=globalThis,Qo=e=>e,Fi=Qa.trustedTypes,es=Fi?Fi.createPolicy("lit-html",{createHTML:e=>e}):void 0,os="$lit$",yt=`lit$${Math.random().toFixed(9).slice(2)}$`,ss="?"+yt,ku=`<${ss}>`,Ot=document,zn=()=>Ot.createComment(""),Nn=e=>e===null||typeof e!="object"&&typeof e!="function",er=Array.isArray,$u=e=>er(e)||typeof e?.[Symbol.iterator]=="function",ja=`[ 	
\f\r]`,Pn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ts=/-->/g,ns=/>/g,zt=RegExp(`>|${ja}(?:([^\\s"'>=/]+)(${ja}*=${ja}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),is=/'/g,as=/"/g,ls=/^(?:script|style|textarea|title)$/i,tr=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=tr(1),v=tr(2),zg=tr(3),Dt=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),rs=new WeakMap,Nt=Ot.createTreeWalker(Ot,129);function ds(e,n){if(!er(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return es!==void 0?es.createHTML(n):n}var Cu=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=Pn;for(let s=0;s<t;s++){let l=e[s],d,c,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,c=o.exec(l),c!==null);)p=o.lastIndex,o===Pn?c[1]==="!--"?o=ts:c[1]!==void 0?o=ns:c[2]!==void 0?(ls.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=zt):c[3]!==void 0&&(o=zt):o===zt?c[0]===">"?(o=a??Pn,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?zt:c[3]==='"'?as:is):o===as||o===is?o=zt:o===ts||o===ns?o=Pn:(o=zt,a=void 0);let m=o===zt&&e[s+1].startsWith("/>")?" ":"";r+=o===Pn?l+ku:u>=0?(i.push(d),l.slice(0,u)+os+l.slice(u)+yt+m):l+yt+(u===-2?s:m)}return[ds(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},On=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,c]=Cu(n,t);if(this.el=e.createElement(d,i),Nt.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=Nt.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(os)){let p=c[o++],m=a.getAttribute(u).split(yt),y=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:y[2],strings:m,ctor:y[1]==="."?Ya:y[1]==="?"?Ja:y[1]==="@"?Xa:ln}),a.removeAttribute(u)}else u.startsWith(yt)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(ls.test(a.tagName)){let u=a.textContent.split(yt),p=u.length-1;if(p>0){a.textContent=Fi?Fi.emptyScript:"";for(let m=0;m<p;m++)a.append(u[m],zn()),Nt.nextNode(),l.push({type:2,index:++r});a.append(u[p],zn())}}}else if(a.nodeType===8)if(a.data===ss)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(yt,u+1))!==-1;)l.push({type:7,index:r}),u+=yt.length-1}r++}}static createElement(n,t){let i=Ot.createElement("template");return i.innerHTML=n,i}};function sn(e,n,t=e,i){if(n===Dt)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=Nn(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=sn(e,a._$AS(e,n.values),a,i)),n}var qa=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??Ot).importNode(t,!0);Nt.currentNode=a;let r=Nt.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new Dn(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new Za(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=Nt.nextNode(),o++)}return Nt.currentNode=Ot,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Dn=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=sn(this,n,t),Nn(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==Dt&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):$u(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&Nn(this._$AH)?this._$AA.nextSibling.data=n:this.T(Ot.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=On.createElement(ds(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new qa(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=rs.get(n.strings);return t===void 0&&rs.set(n.strings,t=new On(n)),t}k(n){er(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(zn()),this.O(zn()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=Qo(n).nextSibling;Qo(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ln=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=sn(this,n,t,0),o=!Nn(n)||n!==this._$AH&&n!==Dt,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=sn(this,s[i+l],t,l),d===Dt&&(d=this._$AH[l]),o||=!Nn(d)||d!==this._$AH[l],d===f?n=f:n!==f&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Ya=class extends ln{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},Ja=class extends ln{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},Xa=class extends ln{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=sn(this,n,t,0)??f)===Dt)return;let i=this._$AH,a=n===f&&i!==f||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Za=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){sn(this,n)}};var Su=Qa.litHtmlPolyfillSupport;Su?.(On,Dn),(Qa.litHtmlVersions??=[]).push("3.3.3");var cs=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Dn(n.insertBefore(zn(),r),r,void 0,t??{})}return a._$AI(e),a};var nr=globalThis,bt=class extends at{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=cs(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Dt}};bt._$litElement$=!0,bt.finalized=!0,nr.litElementHydrateSupport?.({LitElement:bt});var Tu=nr.litElementPolyfillSupport;Tu?.({LitElement:bt});(nr.litElementVersions??=[]).push("4.2.2");var Eu={attribute:!0,type:String,converter:_n,reflect:!1,hasChanged:Mi},Mu=(e=Eu,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function dn(e){return(n,t)=>typeof t=="object"?Mu(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function P(e){return dn({...e,state:!0,attribute:!1})}var Ve="wrist_assistant/complications";async function us(e){return e.connection.sendMessagePromise({type:`${Ve}/owners`})}async function ps(e,n){return e.connection.sendMessagePromise({type:`${Ve}/list`,owner_watch_id:n})}async function hs(e,n){return e.connection.sendMessagePromise({type:`${Ve}/nudge`,owner_watch_id:n})}async function ms(e,n){return e.connection.sendMessagePromise({type:`${Ve}/watch_status`,owner_watch_id:n})}async function fs(e,n,t,i){return e.connection.sendMessagePromise({type:`${Ve}/save`,owner_watch_id:n,document:t,base_revision:i})}async function gs(e,n,t,i){return e.connection.sendMessagePromise({type:`${Ve}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function ys(e,n,t){return e.connection.sendMessagePromise({type:`${Ve}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function bs(e,n,t){let i={type:`${Ve}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function xs(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ve}/render_values`,templates:n})).results}async function vs(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ve}/history_series`,requests:n})).results}async function ws(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ve}/statistics_series`,requests:n})).results}var ie=["rectangular","circular","corner"],xe={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},Bn=["rectangular","circular","corner","inline"];var rr=64;function zs(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<rr;i++)if(!t.has(i))return i;return-1}function Ns(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function Bt(e){return ie.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var Fu=["none","dot","triangle"],Ru=[["history","Recorded history"],["statistics","Long-term statistics"]],Li=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],or=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],sr="history",Jn="hour",Xn="mean",cn=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Zn={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Fe={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"};function Os(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function rt(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function un(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function Qn(e){let n=c=>c.value.kind.kind!=="literal",t=(c,u)=>e.slice(c,u).map(p=>un(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return H(t(0,e.length));let a=e.findIndex((c,u)=>u>i&&n(c)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let d={kind:structuredClone(r.kind)};return Re(o)||(d.format=o),d}function Ds(e){rt(e)&&(e.value=Qn(e.parts))}var pn="#FFFFFF";function ks(e){return typeof e=="string"&&Fu.includes(e)}function lr(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function kt(e){let n=lr(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function Vs(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function Bs(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function dr(e,n){e.marker=Vs(n),Bs(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var _i=24,Le="#FF6B35",_e="#32D74B",cr="#32D74B",ae="#FF453A",hn="#FF453A",mn="#FFFFFF99";function St(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function Us(e){return e.coloring==="bands"&&e.bands.length>0}function Pi(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function ur(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function Gs(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var Ut=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],zi=360,Ni=10080,ei=[...Ut,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],pr=366*24*60,hr=2,ti=120,mr=0;function fr(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?mr:Math.max(hr,Math.min(ti,n)):24}function Oi(e){return yr(e)!==void 0?!0:gr(e)!==void 0&&fr(e)>0}function gr(e){if(e.source==="history")return Ks(e)}function yr(e){if(e.source==="statistics")return Ks(e)}function Ks(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Gt(e){let n=gr(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${fr(e)}`}function Kt(e){let n=yr(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}`}function Ws(e){return[...br(e).map(t=>t.key),...xr(e).map(t=>t.key)].sort().join(";")}function br(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=Gt(i.payload),r=gr(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:fr(i.payload),mode:"numeric"})}else if(i.kind==="timeline"){let a=Mt(i.payload),r=Xs(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:qe(i.payload),points:Et,mode:"states"})}return[...n.values()]}function xr(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=Kt(t.payload),a=yr(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType})}return[...n.values()]}var js=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],qs=[["auto","Auto"],["always","Always"],["never","Never"]];function $s(e){return e==="h12"||e==="h24"?e:jn}function Cs(e){return e==="always"||e==="never"?e:qn}function Iu(e){return e.timeLabelCount!==void 0?ni(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:Wn}function ni(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(ii,Math.round(n))):Wn}function vr(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var Tt="#8E8E93",Ys=1,Au="#000000",Hu=2,Lu=1440,wr=60,Wn=0,$t=9,Ct="#8E8E93",jn="auto",qn="auto",_u=4,ii=12,ai=1,ri=20,Di=4,Et=120;function Js(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function qe(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(Ni,n)):wr}function Xs(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Mt(e){let n=Xs(e);if(n!==void 0)return`${n}|${qe(e)}|${Et}|states`}var Pu={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},kr={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function Ii(e){return Pu[e.trim().toLowerCase()]??Tt}var zu=["door","garage_door","window","opening"];function $r(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&zu.includes(t),a=o=>Ii(i&&o==="on"?"open":o);return[...kr[e]??[],"unavailable","unknown"].map(o=>({id:Y(),match:o,colorHex:a(o)}))}var fn=6,gn=9,Nu=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function ot(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Cr(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Sr={top:0,left:0,bottom:0,right:0};function Vi(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Ou=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function Zs(e){return Ou.includes(e)}function Qs(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var Tr=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function st(e){let n=Tr.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function I(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function G(e,n=""){return typeof e=="string"?e:n}function q(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function We(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Kn(e){return e==null?void 0:q(e,0)}function oe(e){return typeof e=="string"?e:void 0}function ir(e,n,t){return n.some(([i])=>i===e)?e:t}var De=class extends Error{};function vt(e){if(typeof e.entityId!="string")throw new De("entityId is required");let n={entityId:e.entityId,displayName:G(e.displayName),domain:G(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Ss(e){if(!I(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=q(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=q(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=q(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Re(n)?void 0:n}function Re(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function Du(e){let n=G(e.function,"count"),t=I(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(I).map(vt)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(I(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:G(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Ts(e){switch(e.kind){case"literal":return{kind:"literal",value:G(e.value)};case"entityState":return{kind:"entityState",...vt(e)};case"entityAttribute":return{kind:"entityAttribute",...vt(e),attribute:G(e.attribute)};case"entityAge":return{kind:"entityAge",...vt(e)};case"aggregate":return{kind:"aggregate",aggregate:Du(I(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:oe(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:G(e.value)};case"named":return{kind:"named",id:G(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:G(e.layer).toUpperCase(),stat:cn.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new De(`unknown value kind ${String(e.kind)}`)}}function ce(e){if(!I(e))throw new De("value must be an object");if(I(e.kind)){let i={kind:Ts(e.kind)},a=Ss(e.format);return a&&(i.format=a),i}let n={kind:Ts(e)},t=Ss(e.format);return t&&(n.format=t),n}function el(e){return I(e)?{x:q(e.x,.25),y:q(e.y,.25),width:q(e.width,.5),height:q(e.height,.5),rotationDegrees:q(e.rotationDegrees,0)}:{...Zn}}function Vu(e){if(!I(e))return{kind:"isOn"};let n=G(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=I(e.value)?ce(e.value):H("");break;case"between":case"timeBetween":t.value=I(e.value)?ce(e.value):H(""),t.upper=I(e.upper)?ce(e.upper):H("");break;case"matchesRegex":t.pattern=G(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Es(e){if(!I(e))return{kind:"show"};let n=G(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=I(e.value)?ce(e.value):H("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=q(e.number,0);break;case"setFontWeight":t.weight=oe(e.weight)??"regular";break;default:break}return t}function tl(e){return Array.isArray(e)?e.filter(I).map(n=>{let t={id:G(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(I).map(i=>{let a=I(i.when)?i.when:{};return{id:G(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(I).map(r=>({id:G(r.id).toUpperCase(),value:I(r.value)?ce(r.value):H(""),comparison:Vu(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Es)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Es)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function Bu(e,n){return{baseColorHex:I(e)?G(e.baseColorHex,n):n}}function Ai(e){return Array.isArray(e)?e.filter(I).map(n=>({id:G(n.id,Y()),upTo:q(n.upTo,0),colorHex:G(n.colorHex,"#FFFFFF")})):[]}function Uu(e){return Array.isArray(e)?e.filter(I).map(n=>{let t={id:G(n.id,Y()).toUpperCase(),value:I(n.value)?ce(n.value):H("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=oe(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize),oe(n.coloring)==="bands"&&(t.coloring="bands");let a=Ai(n.bands);a.length>0&&(t.bands=a);let r=G(n.bandAboveColorHex,ae);return r!==ae&&(t.bandAboveColorHex=r),t}):[]}function Gu(e){if(Array.isArray(e.bands))return Ai(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=I(e.colorSlot)?G(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:Y(),upTo:e.bandLowerBound,colorHex:G(e.bandLowColorHex,cr)},{id:Y(),upTo:q(e.bandUpperBound,100),colorHex:n}]}function Ku(e){return Array.isArray(e)?e.filter(I).map(n=>({id:G(n.id,Y()).toUpperCase(),match:G(n.match,""),colorHex:G(n.colorHex,Tt)})):[]}function xt(e,n){if(typeof e.id!="string")throw new De("element id is required");return{id:e.id.toUpperCase(),colorSlot:Bu(e.colorSlot,n),rules:tl(e.rules),frame:el(e.frame),isHidden:e.isHidden===!0}}function Wu(e){let n=ju(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),n}function ju(e){if(!I(e)||!I(e.payload))throw new De("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...xt(n,"#FFFFFF"),value:I(n.value)?ce(n.value):H(""),fontSize:q(n.fontSize,14),fontWeight:oe(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1;Math.min(2,Math.max(1,i))===2&&(t.lineLimit=2);let a=oe(n.alignment);(a==="leading"||a==="trailing")&&(t.alignment=a),oe(n.coloring)==="bands"&&(t.coloring="bands");let r=Ai(n.bands);r.length>0&&(t.bands=r);let o=G(n.bandAboveColorHex,ae);o!==ae&&(t.bandAboveColorHex=o);let s=oe(n.highlight);(s==="highest"||s==="lowest"||s==="both")&&(t.highlight=s);let l=G(n.highColorHex,Le);l!==Le&&(t.highColorHex=l);let d=G(n.lowColorHex,_e);d!==_e&&(t.lowColorHex=d);let c=Uu(n.parts);return c.length>0&&(t.parts=c),{kind:"text",payload:t}}case"icon":{let t={...xt(n,"#FFFFFF"),symbol:I(n.symbol)?ce(n.symbol):H("lightbulb"),size:q(n.size,14)},i=oe(n.path);return i!==void 0&&i!==""&&(t.path=i),{kind:"icon",payload:t}}case"gauge":{let t={...xt(n,"#FFFFFF"),value:I(n.value)?ce(n.value):H("50"),minValue:q(n.minValue,0),maxValue:q(n.maxValue,100),style:oe(n.style)??"arc",lineWidth:q(n.lineWidth,4),trackColorHex:G(n.trackColorHex,"#FFFFFF40"),coloring:oe(n.coloring)??"uniform",bands:Ai(n.bands),bandAboveColorHex:G(n.bandAboveColorHex,ae),thresholdColorHex:G(n.thresholdColorHex,pn)},i=Kn(n.thresholdValue);return i!==void 0&&(t.thresholdValue=i),I(n.total)&&(t.total=ce(n.total)),I(n.minSource)&&(t.minSource=ce(n.minSource)),I(n.maxSource)&&(t.maxSource=ce(n.maxSource)),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...xt(n,"#FFFFFF"),value:I(n.value)?ce(n.value):H("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(q(n.historyMinutes,0))),historyPoints:Math.round(q(n.historyPoints,24)),source:ir(oe(n.source),Ru,sr),statPeriod:ir(oe(n.statPeriod),Li,Jn),statType:ir(oe(n.statType),or,Xn),style:oe(n.style)??"bars",limit:Math.max(0,Math.round(q(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:oe(n.scale)??"auto",minValue:q(n.minValue,0),maxValue:q(n.maxValue,100),baseline:oe(n.baseline)??"lowest",barGap:q(n.barGap,1.5),lineWidth:q(n.lineWidth,2),highlight:oe(n.highlight)??"none",highColorHex:G(n.highColorHex,Le),lowColorHex:G(n.lowColorHex,_e),marker:oe(n.marker)??"pointer",...ks(n.highMarker)?{highMarker:n.highMarker}:{},...ks(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:oe(n.coloring)??"uniform",bands:Gu(n),bandAboveColorHex:G(n.bandHighColorHex,G(n.bandAboveColorHex,ae)),fillBands:n.fillBands===!0,...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:G(n.thresholdColorHex,hn),...I(n.nowIndex)?{nowIndex:ce(n.nowIndex)}:{},nowColorHex:G(n.nowColorHex,mn),...oe(n.scaleFrom)!==void 0?{scaleFrom:oe(n.scaleFrom)}:{},timeLabelCount:ni(n.timeLabelCount),labelSize:q(n.labelSize,$t),labelColorHex:G(n.labelColorHex,Ct),labelsAbove:n.labelsAbove===!0,hourCycle:$s(n.hourCycle),minutes:Cs(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=xt(n,"#FFFFFF");return{kind:"timeline",payload:{...i,value:I(n.value)?ce(n.value):H(""),historyMinutes:Math.max(1,Math.round(q(n.historyMinutes,wr))),bands:Ku(n.bands),otherColorHex:G(n.otherColorHex,Tt),gap:Math.min(Di,Math.max(0,q(n.gap,0))),cornerRadius:Math.max(0,q(n.cornerRadius,Ys)),timeLabelCount:Iu(n),labelSize:q(n.labelSize,$t),labelColorHex:G(n.labelColorHex,Ct),labelsAbove:n.labelsAbove===!0,hourCycle:$s(n.hourCycle),minutes:Cs(n.minutes)}}}case"shape":{let t={...xt(n,"#FFFFFF33"),kind:oe(n.kind)??"roundedRectangle",cornerRadius:q(n.cornerRadius,6),thickness:q(n.thickness,1),borderWidth:q(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=xt(n,"#FFFFFF"),a={...i,entity:vt(I(n.entity)?n.entity:{}),source:n.source==="entityPicture"?"entityPicture":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:q(n.zoom,1),panX:q(n.panX,0),panY:q(n.panY,0),cornerRadius:q(n.cornerRadius,fn),timestampCorner:Nu.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:q(n.timestampSize,gn)};n.timestamp===!0&&(a.timestamp=!0);let r=Kn(n.timestampX),o=Kn(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=We(r),a.timestampY=We(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=xt(n,"#FFFFFF"),a={...i,action:I(n.action)?nl(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new De(`unknown element kind ${String(e.kind)}`)}}function Ms(e){let n=I(e)?e:{},t={};if(I(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!I(r))continue;let o={frame:el(r.frame),isHidden:r.isHidden===!0},s=Kn(r.size);s!==void 0&&(o.size=s),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:q(n.borderWidth,2),rules:tl(n.rules)};if(I(n.bezelText)&&(i.bezelText=ce(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),I(n.curvedText)&&(i.curvedText=ce(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),I(n.bezelGauge)){let a=n.bezelGauge,r={value:I(a.value)?ce(a.value):H("50"),minValue:q(a.minValue,0),maxValue:q(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};I(a.minLabel)&&(r.minLabel=ce(a.minLabel)),I(a.maxLabel)&&(r.maxLabel=ce(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function qu(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Ms(e[t+1]))}else if(I(e))for(let[t,i]of Object.entries(e))n[t]=Ms(i);return n}function Yu(e){let n={value:I(e.value)?ce(e.value):H("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function nl(e){if(!I(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...vt(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=vt(e)),n}default:return{type:"none"}}}function yn(e){if(!I(e))throw new De("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new De(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(I).map(r=>({id:G(r.id).toUpperCase(),name:G(r.name),value:I(r.value)?ce(r.value):H("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(I).map(r=>r.kind==="template"?{kind:"template",value:G(r.value)}:r.kind==="entity"?{kind:"entity",...vt(r)}:null).filter(r=>r!==null),i={schemaVersion:q(e.schemaVersion,1),id:G(e.id).toUpperCase(),name:G(e.name,"Custom"),values:n,slotIndex:q(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Wu),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:qu(e.perFamily),dataSources:t,tapAction:nl(e.tapAction)};I(e.inline)&&(i.inline=Yu(e.inline));let a=Kn(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(I).filter(o=>typeof o.id=="string").map(o=>({id:G(o.id).toUpperCase(),name:G(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Xu(i,Array.isArray(e.elements)?e.elements:[]),Be(i),i}function Er(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Wt(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function Ju(e,n){let t=Hi(e,jt(n))?.ref;return t?.displayName||t?.entityId||"Chart"}function il(e,n,t){let i=lt(e,n.payload.id);if(i){Fr(e,t,i.id);return}let a=Mr(e,[n.payload.id,t],Ju(e,n)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var al={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function rl(e,n,t,i){let a=xe.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function ol(e,n,t){let i=e.elements.find(d=>d.payload.id===n);if(!i||i.kind!=="chart")return;let a=je("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=rl(i.payload.frame,al[t],r,s);let l=e.elements.findIndex(d=>d.payload.id===n);return e.elements.splice(l+1,0,a),il(e,i,a.payload.id),a.payload.id}function Xu(e,n){for(let t of n){if(!I(t)||t.kind!=="chart"||!I(t.payload))continue;let i=t.payload,a=G(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=G(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let m=I(p)?p:{};return{fontSize:q(m.fontSize,8),colorHex:G(m.colorHex,o),pillColorHex:typeof m.pillColorHex=="string"?m.pillColorHex:void 0}},l=[],d=oe(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=oe(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,m]of l){let y=rl(r.payload.frame,al[p],m.fontSize,p==="latest"?5:4),b=[];if(m.pillColorHex!==void 0){let $=je("shape");$.payload.kind="capsule",$.payload.colorSlot={baseColorHex:m.pillColorHex},$.payload.frame={...y},b.push($)}let x=je("text");x.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},x.payload.fontSize=m.fontSize,x.payload.fontWeight="medium",x.payload.colorSlot={baseColorHex:m.colorHex},x.payload.frame=y,b.push(x),e.elements.splice(u,0,...b),u+=b.length;for(let $ of b)il(e,r,$.payload.id)}}}function j(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function wt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Zu(e){let n={};return e.decimals!==void 0&&(n.decimals=j(e.decimals)),e.multiply!==void 0&&(n.multiply=j(e.multiply)),e.offset!==void 0&&(n.offset=j(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function Qu(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(wt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function ep(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...wt(e)};case"entityAttribute":return{kind:"entityAttribute",...wt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...wt(e)};case"aggregate":return{kind:"aggregate",aggregate:Qu(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function re(e){let n={kind:ep(e.kind)};return Re(e.format)||(n.format=Zu(e.format)),n}function Un(e){return{x:j(e.x),y:j(e.y),width:j(e.width),height:j(e.height),rotationDegrees:j(e.rotationDegrees)}}function tp(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=re(e.value??H(""));break;case"between":case"timeBetween":n.value=re(e.value??H("")),n.upper=re(e.upper??H(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function Fs(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=re(e.value??H(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=j(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function Gn(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:re(a.value),comparison:tp(a.comparison)}))},then:i.then.map(Fs)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(Fs)),n.partId!==void 0&&(t.partId=n.partId),t})}function np(e){let n={id:e.id,value:re(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=j(e.fontSize)),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(t=>({id:t.id,upTo:j(t.upTo),colorHex:t.colorHex}))),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==ae&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function ip(e){let n=ap(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),n}function ap(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:Gn(t.rules),frame:Un(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:re(e.payload.value),fontSize:j(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit===2&&(t.lineLimit=2),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(a=>({id:a.id,upTo:j(a.upTo),colorHex:a.colorHex}))),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==ae&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==Le&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==_e&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(np),rt(i)&&(t.value=re(Qn(i.parts)))),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:re(e.payload.symbol)};return e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path),t.size=j(e.payload.size),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:re(t.value),minValue:j(t.minValue),maxValue:j(t.maxValue),style:t.style,lineWidth:j(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,upTo:j(a.upTo),colorHex:a.colorHex}))),t.bandAboveColorHex!==ae&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=j(t.thresholdValue)),t.thresholdColorHex!==pn&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=re(t.total)),t.minSource!==void 0&&(i.minSource=re(t.minSource)),t.maxSource!==void 0&&(i.maxSource=re(t.maxSource)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:re(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:j(t.minValue),maxValue:j(t.maxValue),baseline:t.baseline,barGap:j(t.barGap),lineWidth:j(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:Vs(kt(t)),coloring:t.coloring,bands:t.bands.map(r=>({id:r.id,upTo:j(r.upTo),colorHex:r.colorHex})),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==sr&&(i.source=t.source),t.statPeriod!==Jn&&(i.statPeriod=t.statPeriod),t.statType!==Xn&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=j(t.thresholdValue)),t.thresholdColorHex!==hn&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=re(t.nowIndex)),t.nowColorHex!==mn&&(i.nowColorHex=t.nowColorHex),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==$t&&(i.labelSize=j(t.labelSize)),t.labelColorHex!==Ct&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Wn&&(i.timeLabelCount=ni(t.timeLabelCount)),t.hourCycle!==jn&&(i.hourCycle=t.hourCycle),t.minutes!==qn&&(i.minutes=t.minutes);let a=kt(t);return Bs(a)||(i.highMarker=a.high,i.lowMarker=a.low),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:Gn(t.rules),frame:Un(t.frame),isHidden:t.isHidden,value:re(t.value)};return t.historyMinutes!==wr&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),t.otherColorHex!==Tt&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=j(t.gap)),t.cornerRadius!==Ys&&(i.cornerRadius=j(t.cornerRadius)),t.labelSize!==$t&&(i.labelSize=j(t.labelSize)),t.labelColorHex!==Ct&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Wn&&(i.timeLabelCount=Math.max(0,Math.min(ii,Math.round(t.timeLabelCount)))),t.hourCycle!==jn&&(i.hourCycle=t.hourCycle),t.minutes!==qn&&(i.minutes=t.minutes),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:j(e.payload.cornerRadius),borderWidth:j(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=j(e.payload.thickness)),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:wt(t.entity),rules:Gn(t.rules),frame:Un(t.frame),isHidden:t.isHidden};t.source!=="camera"&&(i.source=t.source),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=j(t.zoom)),t.panX!==0&&(i.panX=j(t.panX)),t.panY!==0&&(i.panY=j(t.panY)),t.cornerRadius!==fn&&(i.cornerRadius=j(t.cornerRadius));let a=ot(t),r=a?Cr(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==gn&&(i.timestampSize=j(t.timestampSize)),a&&(i.timestampX=j(t.timestampX),i.timestampY=j(t.timestampY)),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:sl(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=Gn(t.rules),i.frame=Un(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}}}function rp(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:Un(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=j(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=re(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=re(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:re(i.value),minValue:j(i.minValue),maxValue:j(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=re(i.minLabel)),i.maxLabel&&(a.maxLabel=re(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=j(e.borderWidth),e.rules.length>0&&(n.rules=Gn(e.rules)),n}function sl(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,wt(e.target)),n}return"entityId"in e?{type:e.type,...wt(e)}:{type:e.type}}function op(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=re(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function bn(e){let n=[];for(let i of ie){let a=e.perFamily[i];a&&n.push(i,rp(a))}let t={schemaVersion:Bt(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:re(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(ip),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...wt(i)}),tapAction:sl(e.tapAction)};return e.inline!==void 0&&(t.inline=op(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),t}function lt(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function dt(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!pe(e,t))}function Be(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function xn(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!pe(e,r)),t=e.elements.filter(r=>pe(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],Ft(e)}function Mr(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!pe(e,r));if(i.length<2)return;let a={id:Y(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return Be(e),xn(e),a.id}function oi(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;Be(e)}function Fr(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||pe(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,Be(e),xn(e))}var Z={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts"],textPart:["id","value","colorHex","fontWeight","fontSize","coloring","bands","bandAboveColorHex"],icon:["symbol","path","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},Rs={literal:["kind","value"],entityState:["kind",...Z.entityRef],entityAttribute:["kind",...Z.entityRef,"attribute"],entityAge:["kind",...Z.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function Bi(e){let n=[],t=(l,d,c)=>{if(I(l))for(let u of Object.keys(l))d.includes(u)||n.push(`${c}.${u}`)},i=(l,d)=>{if(!I(l))return;let c=typeof l.kind=="string"?l.kind:"";t(l,Rs[c]??["kind"],d),c==="aggregate"&&I(l.aggregate)&&(t(l.aggregate,Z.aggregate,`${d}.aggregate`),t(l.aggregate.scope,Z.scope,`${d}.aggregate.scope`),I(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((u,p)=>t(u,Z.entityRef,`${d}.aggregate.scope.entities[${p}]`)),t(l.aggregate.stateFilter,Z.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(I(l)){if(I(l.kind))t(l,Z.value,d),i(l.kind,`${d}.kind`);else{let c=typeof l.kind=="string"?l.kind:"";t(l,[...Rs[c]??["kind"],"format"],d),c==="aggregate"&&i(l,d)}t(l.format,Z.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{t(c,Z.styleChange,`${d}[${u}]`),I(c)&&a(c.value,`${d}[${u}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{let p=`${d}[${u}]`;t(c,Z.rule,p),I(c)&&(Array.isArray(c.cases)&&c.cases.forEach((m,y)=>{let b=`${p}.cases[${y}]`;t(m,Z.case,b),I(m)&&(t(m.when,Z.condition,`${b}.when`),I(m.when)&&Array.isArray(m.when.tests)&&m.when.tests.forEach((x,$)=>{let S=`${b}.when.tests[${$}]`;t(x,Z.test,S),I(x)&&(a(x.value,`${S}.value`),t(x.comparison,Z.comparison,`${S}.comparison`),I(x.comparison)&&(a(x.comparison.value,`${S}.comparison.value`),a(x.comparison.upper,`${S}.comparison.upper`)))}),r(m.then,`${b}.then`))}),r(c.otherwise,`${p}.otherwise`))})};if(!I(e))return n;t(e,Z.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>t(l,Z.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{t(l,Z.named,`$.values[${d}]`),I(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let c=`$.elements[${d}]`;if(t(l,Z.elementEnvelope,c),!I(l)||!I(l.payload))return;let u=typeof l.kind=="string"?l.kind:"",p=Z[u]??[];t(l.payload,[...Z.elementBase,...p],`${c}.payload`),t(l.payload.colorSlot,Z.colorSlot,`${c}.payload.colorSlot`),t(l.payload.frame,Z.frame,`${c}.payload.frame`),o(l.payload.rules,`${c}.payload.rules`);for(let m of["value","symbol","nowIndex","total","minSource","maxSource"])m in l.payload&&a(l.payload[m],`${c}.payload.${m}`);u==="text"&&Array.isArray(l.payload.parts)&&l.payload.parts.forEach((m,y)=>{t(m,Z.textPart,`${c}.payload.parts[${y}]`),I(m)&&a(m.value,`${c}.payload.parts[${y}].value`)}),u==="image"&&t(l.payload.entity,Z.entityRef,`${c}.payload.entity`),u==="tap"&&t(l.payload.action,Z.tapAction,`${c}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else I(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let c=`$.perFamily.${l}`;if(t(d,Z.layout,c),!!I(d)){if(I(d.placements))for(let[u,p]of Object.entries(d.placements))t(p,Z.placement,`${c}.placements.${u}`),I(p)&&t(p.frame,Z.frame,`${c}.placements.${u}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),I(d.bezelGauge)){let u=`${c}.bezelGauge`;t(d.bezelGauge,Z.bezelGauge,u),a(d.bezelGauge.value,`${u}.value`),a(d.bezelGauge.minLabel,`${u}.minLabel`),a(d.bezelGauge.maxLabel,`${u}.maxLabel`)}o(d.rules,`${c}.rules`)}}return I(e.inline)&&(t(e.inline,Z.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,Z.tapAction,"$.tapAction"),n}function Y(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function ct(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function ll(e,n,t=[...ie]){let i={};for(let r of ie)t.includes(r)&&(i[r]=ct());let a={schemaVersion:4,id:Y(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:Bn.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:H("Text")}),a.schemaVersion=Bt(a),a}function je(e){let n=t=>({id:Y(),colorSlot:{baseColorHex:t},rules:[],frame:{...Zn},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:H("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:H("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:H("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:ae,thresholdColorHex:pn}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:H("13,14,16,17,19,22,24,28,30"),historyMinutes:zi,historyPoints:24,source:sr,statPeriod:Jn,statType:Xn,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:Le,lowColorHex:_e,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:ae,fillBands:!1,thresholdColorHex:hn,nowColorHex:mn,timeLabelCount:Wn,labelSize:$t,labelColorHex:Ct,labelsAbove:!1,hourCycle:jn,minutes:qn}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:H(""),historyMinutes:Lu,bands:[],otherColorHex:Au,gap:0,cornerRadius:Hu,timeLabelCount:_u,labelSize:$t,labelColorHex:Ct,labelsAbove:!1,hourCycle:jn,minutes:qn}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:fn,timestampCorner:"topLeading",timestampSize:gn}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function H(e){return{kind:{kind:"literal",value:e}}}function Ui(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return}}var Is=["circular","corner"],As=Math.SQRT1_2;function sp(e){return e==="text"||e==="icon"?4:.5}function Rr(e,n,t,i){let a=structuredClone(e),r=xe[n],o=xe[t];if(n===t||!r||!o)return a;let s=Is.includes(n),l=Is.includes(t),d=s===l?1:l?As:1/As,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let u=a.frame,p=u.x+u.width/2,m=u.y+u.height/2;a.frame={...u,width:u.width*d,height:u.height*d,x:.5+(p-.5)*d-u.width*d/2,y:.5+(m-.5)*d-u.height*d/2}}return a.size!==void 0&&(a.size=Math.max(sp(i),Math.round(a.size*c*10)/10)),a}function dl(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function jt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function Yn(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var Ir=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Hi(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=Er(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function Ar(e,n){return Hi(e,jt(n))?.ref}function Hr(e,n){let t=Ar(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&Ir.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function Hs(e,n,t){if(Vi(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=We(a),r=We(r),o=We(o),s=We(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function cl(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function ul(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=We(i.x),l=We(i.y),d=We(i.x+i.width),c=We(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=cl(o,u,xe[t])}function pl(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=xe[t];return{width:r.width*o.width,height:r.height*o.height}}function Pe(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function pe(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function Lr(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function Ft(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=cl(o.payload.frame,l.frame,xe.rectangular));let d=l.outset,c=!Vi(d);s.payload.frame=Hs(o.payload.frame,d,xe.rectangular),s.payload.isHidden=o.payload.isHidden;let u=dp(e,a);for(let p of ie){let m=e.perFamily[p];if(!m)continue;let y=xe[p],b=m.placements[a];p!==u||!b?delete m.placements[s.payload.id]:c?m.placements[s.payload.id]={frame:Hs(b.frame,d,y),isHidden:b.isHidden}:m.placements[s.payload.id]={frame:{...b.frame},isHidden:b.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Gi(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=Pe(e,n)[0];if(a)return a.payload;let r=je("tap"),o=r.payload;return o.attachedTo=n,o.outset={...Sr},o.action=t??Hr(e,i),e.elements.push(r),Ft(e),o}function Ki(e,n){let t=Pe(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of ie)for(let a of t)delete e.perFamily[i]?.placements[a]}}function ut(e,n){for(let t of Wt(e,n))ut(e,t.payload.id);Ki(e,n),e.elements=e.elements.filter(t=>t.payload.id!==n);for(let t of e.elements)t.kind==="chart"&&t.payload.scaleFrom===n&&delete t.payload.scaleFrom;for(let t of ie)delete e.perFamily[t]?.placements[n];Ft(e),Be(e)}function hl(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=Y(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of Pe(e,n)){let d=structuredClone(l);d.payload.id=Y(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of ie){let d=e.perFamily[l];if(d)for(let[c,u]of s){let p=d.placements[c];p&&(d.placements[u]=structuredClone(p))}}return Ft(e),a}function ml(e,n){let t=e.elements.findIndex(o=>o.payload.id===n),i=e.elements[t];if(!i||i.kind!=="chart")return;let a=Y(),r=structuredClone(i);r.payload.id=a,r.payload.scaleFrom=n,e.elements.splice(t+1,0,r);for(let o of ie){let s=e.perFamily[o],l=s?.placements[n];s&&l&&(s.placements[a]=structuredClone(l))}return a}function vn(e,n,t){let i=new Set,a=d=>{i.add(d);for(let c of Pe(e,d))i.add(c.payload.id)};for(let d of n){a(d);for(let c of Wt(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of ie){let c=e.perFamily[d];if(!c)continue;let u={};for(let p of r){let m=c.placements[p.payload.id];m&&(u[p.payload.id]=structuredClone(m))}Object.keys(u).length>0&&(o[d]=u)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function fl(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&ie.includes(i);if(!ie.includes(t))return Vt(e,n);let r=Vt(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=ct());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let d=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??ie.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),c=d?.size??Ui(l),u={frame:{...d?.frame??l.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};for(let p of ie)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?Rr(u,i,t,l.kind):u}return wn(e,t),r}function Vt(e,n,t={}){let i=new Map;for(let d of n.elements)i.set(d.payload.id,Y());let a=new Set(e.elements.map(d=>d.payload.id)),r=t.nudge!==!1&&n.elements.some(d=>a.has(d.payload.id)),o=d=>r?{...d,x:Math.min(.9,d.x+.05),y:Math.min(.9,d.y+.05)}:d,s=[];for(let d of n.elements){let c=structuredClone(d);if(c.payload.id=i.get(d.payload.id),c.kind==="tap"&&c.payload.attachedTo!==void 0){let u=i.get(c.payload.attachedTo);u?c.payload.attachedTo=u:delete c.payload.attachedTo}if(c.kind==="chart"&&c.payload.scaleFrom!==void 0){let u=i.get(c.payload.scaleFrom);u?c.payload.scaleFrom=u:a.has(c.payload.scaleFrom)||delete c.payload.scaleFrom}if(c.kind==="text")for(let u of c.payload.parts??[]){let p=u.value.kind,m=p.kind==="chartStat"?i.get(p.layer):void 0;p.kind==="chartStat"&&m&&(p.layer=m)}if(c.kind==="text"&&c.payload.value.kind.kind==="chartStat"){let u=i.get(c.payload.value.kind.layer);if(u)c.payload.value.kind.layer=u;else if(!a.has(c.payload.value.kind.layer))continue}c.payload.frame=o(c.payload.frame),s.push(c)}let l=new Map;for(let d of n.groups){if(s.filter(p=>p.payload.groupId===d.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let u=Y();l.set(d.id,u),(e.groups??=[]).push({...structuredClone(d),id:u})}for(let d of s){if(d.payload.groupId===void 0)continue;let c=l.get(d.payload.groupId);c?d.payload.groupId=c:delete d.payload.groupId}e.elements.push(...s);for(let d of ie){let c=n.placements[d],u=e.perFamily[d];if(!(!c||!u))for(let[p,m]of Object.entries(c)){let y=i.get(p);y&&s.some(b=>b.payload.id===y)&&(u.placements[y]={...structuredClone(m),frame:o(m.frame)})}}return Ft(e),Be(e),xn(e),s.filter(d=>!pe(e,d)).map(d=>d.payload.id)}function lp(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function dp(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return ie.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function Ye(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function gl(e,n){let t=e.perFamily[n];return t?Ye(e,n).filter(i=>!pe(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function wn(e,n){let t=ie.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=ct());let a=()=>e.elements.filter(s=>!pe(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(m=>lp(e,m,p))]));for(let[p,m]of s)m[0]&&r.set(p,m[0]);let l=new Map([...a().entries()].map(([p,m])=>[m.payload.id,p]));for(let p of t){let m=a().filter(x=>(s.get(x.payload.id)??[]).includes(p)&&r.get(x.payload.id)!==p).map(x=>x.payload.id);if(m.length===0)continue;let y=vn(e,m,p),b=Vt(e,y,{nudge:!1});b.forEach((x,$)=>{r.set(x,p);let S=b.length===m.length?m[$]:void 0;l.set(x,S!==void 0?l.get(S)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let d=p=>t.indexOf(r.get(p)??i),c=a().sort((p,m)=>d(p.payload.id)-d(m.payload.id)||(l.get(p.payload.id)??0)-(l.get(m.payload.id)??0)),u=[];for(let p of c)u.push(p),u.push(...Pe(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,d=t.filter(m=>e.perFamily[m].placements[l]!==void 0),c=r.get(l)??d.find(m=>!e.perFamily[m].placements[l].isHidden)??d[0]??i,u=e.perFamily[c]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let m of ie){let y=e.perFamily[m];y&&(m===c?y.placements[l]=p:delete y.placements[l])}}}function Wi(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=Hi(e,jt(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of Pe(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=Hi(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function ar(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function yl(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=ar(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=$r(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=ar(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=ar(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of Pe(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var cp={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area"};function Ls(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function _s(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":cp[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="textPart"?`Part of ${t}`:`${Ls(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=Ls(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline"}}var bl=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g;function up(e){let n=[];for(let t of e.matchAll(bl))t[2]!==void 0&&n.push(t[2]);return n}function _r(e,n){return n.size===0?e:e.replace(bl,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function Vn(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function pp(e,n){if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=jt(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function ji(e,n){let t=(r,o)=>{n.value?.(r,o);let s=r.kind;if(s.kind==="jinja"){if(n.text){let d=n.text(s.value,{...o,part:"template"});d!==s.value&&(s.value=d)}return}if(s.kind==="aggregate"){let d=s.aggregate.scope;if(n.ref&&d.kind==="entities")for(let c=0;c<d.entities.length;c++){let u=n.ref(Vn(d.entities[c]),o);u&&(d.entities[c]=u)}return}if(!n.ref||!("entityId"in s))return;let l=n.ref(Vn(s),o);l&&(s.kind==="entityAttribute"?r.kind={kind:"entityAttribute",...l,attribute:s.attribute}:s.kind==="entityState"?r.kind={kind:"entityState",...l}:r.kind={kind:"entityAge",...l})},i=(r,o,s)=>{if(r.type==="callService"){if(n.ref&&r.target!==void 0&&r.target.entityId!==""){let d=n.ref(Vn(r.target),o);d&&(r.target=d)}if(n.text&&r.serviceDataJSON!==void 0){let d=n.text(r.serviceDataJSON,{...o,part:"serviceData"});d!==r.serviceDataJSON&&(r.serviceDataJSON=d)}return}if(!n.ref||!("entityId"in r)||r.entityId==="")return;let l=n.ref(Vn(r),o);l&&s({type:r.type,...l})};for(let r of e.values)t(r.value,{kind:"named",valueId:r.id,valueName:r.name});for(let r of e.elements){let o={kind:"layer",layerId:r.payload.id,layerKind:r.kind,layerName:pp(e,r)};if(r.kind==="image"){if(n.ref){let l=n.ref(Vn(r.payload.entity),{...o,kind:"image"});l&&(r.payload.entity=l)}}else if(r.kind==="tap"){let l=r.payload;i(l.action,{...o,kind:"tap"},d=>{l.action=d})}else{let l=jt(r);if(l&&t(l,o),r.kind==="text")for(let d of r.payload.parts??[])t(d.value,{...o,part:"textPart"});r.kind==="gauge"&&r.payload.total&&t(r.payload.total,{...o,part:"total"}),r.kind==="gauge"&&r.payload.minSource&&t(r.payload.minSource,{...o,part:"gaugeMin"}),r.kind==="gauge"&&r.payload.maxSource&&t(r.payload.maxSource,{...o,part:"gaugeMax"}),r.kind==="chart"&&r.payload.nowIndex&&t(r.payload.nowIndex,{...o,part:"nowIndex"})}let s={...o,kind:"rule"};for(let l of Yn(r.payload.rules))t(l,s)}let a=Object.keys(e.perFamily).sort((r,o)=>{let s=Bn.indexOf(r),l=Bn.indexOf(o);return(s<0?Bn.length:s)-(l<0?Bn.length:l)});for(let r of a){let o=e.perFamily[r];if(!o)continue;let s={kind:"layout",family:r};o.bezelText&&t(o.bezelText,{...s,part:"bezelText"}),o.curvedText&&t(o.curvedText,{...s,part:"curvedText"});let l=o.bezelGauge;l&&(t(l.value,{...s,part:"bezelGauge"}),l.minLabel&&t(l.minLabel,{...s,part:"bezelGaugeMin"}),l.maxLabel&&t(l.maxLabel,{...s,part:"bezelGaugeMax"}));let d={kind:"rule",family:r};for(let c of Yn(o.rules))t(c,d)}e.inline&&t(e.inline.value,{kind:"inline"}),i(e.tapAction,{kind:"documentTap"},r=>{e.tapAction=r})}function xl(e,n){ji(e,{value:n})}function Pr(e,n){ji(e,{ref:n})}function zr(e,n){ji(e,{text:n})}function Nr(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:_s(r)})}};return n&&(i.text=(a,r)=>{for(let o of up(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:_s(r)})}return a}),ji(e,i),t}var qi={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},vl=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function qt(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function Yt(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Yi(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Or(){return{id:Y(),value:H(""),comparison:{kind:"isOn"}}}function Dr(){return{id:Y(),when:{join:"all",tests:[Or()]},then:[]}}function si(){return{id:Y(),cases:[Dr()]}}function Ps(e,n){return e&&(e.kind.kind!=="literal"||qt(e.kind.value)!==void 0)?e:H(n)}function Vr(e,n){let t={kind:n};switch(Yt(n)){case"value":t.value=e.value??H("");break;case"between":t.value=e.value??H(""),t.upper=e.upper??H("");break;case"times":t.value=Ps(e.value,"22:00"),t.upper=Ps(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function Jt(e){let n={kind:e};switch(Yi(e)){case"value":n.value=H(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}function wl(e){if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function hp(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function kl(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1};case"sent":return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1}:{label:"On watch",note:`last seen ${hp(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function Cl(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function Sl(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function $l(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Br(e,n,t=0){let i=n instanceof Map?n:Sl(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Br(o,i,t+1):$l(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!$l(a))return;let r=li(a);if(r!==void 0)return"e_"+Cl(r)}function Ue(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function mp(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>Ue(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(u=>`(states.${u} | list)`).join(" + ")+")";else{let u=[];for(let p of s)u.push(`area_entities(${Ue(p)})`);for(let p of l)u.push(`label_entities(${Ue(p)})`);d.length>0&&u.push(`((${d.map(p=>`floor_areas(${Ue(p)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${u.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(Ue).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${Ue(i.value)})`:t+=` | rejectattr('state', 'eq', ${Ue(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${Ue(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function li(e){switch(e.kind){case"entityAttribute":return`state_attr(${Ue(e.entityId)}, ${Ue(e.attribute)})`;case"entityAge":{let n=Ue(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return mp(e.aggregate);default:return}}function Ji(e){let n=new Map,t=new Map,i=Sl(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=li(d.kind);if(c===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=li(l);if(d===void 0)return;t.set("e_"+Cl(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=jt(o);if(s&&a(s),o.kind==="text")for(let l of o.payload.parts??[])a(l.value);o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="gauge"&&o.payload.minSource&&a(o.payload.minSource),o.kind==="gauge"&&o.payload.maxSource&&a(o.payload.maxSource),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of Yn(o.payload.rules))a(l)}for(let o of ie){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Yn(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=fp(t)),r}function fp(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function Tl(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,gp(r));return{values:t,nullKeys:i}}function gp(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Ur(e){let n=Ji(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function yp(e,n){if(e.values.length!==0)switch(n){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((t,i)=>t+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return e.values[0];case"delta":return e.values[e.values.length-1]-e.values[0];case"sum":return e.values.reduce((t,i)=>t+i,0);case"trend":{let t=e.values[e.values.length-1]-e.values[0],i=Number(ur(t,e.domainMax-e.domainMin));return i>0?1:i<0?-1:0}}}var bp=10800;function xp(e,n,t){let i=n==="always"||n==="auto"&&t<=bp;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function Rl(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=xp(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function vp(e,n){return Mt(e)===void 0?[]:Rl(qe(e)*60,vr(e.timeLabelCount),e.hourCycle,e.minutes,n)}function wp(e,n){return Oi(e)?Rl(Math.round(e.historyMinutes)*60,vr(ni(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function Xt(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function Je(e){let n=e.trim(),t=Xt(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Xt(i)}function kp(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function $p(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function Cp(e){let n=e.trim(),t=Xt(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?Xt(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Xt(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function Sp(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function Tp(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function Ep(e,n,t){if(Re(n))return e;let i=n,a=e,r=Xt(e.trim()),o=i.duration?Cp(e):void 0;if(o!==void 0)a=Sp(o);else if(i.relativeTime&&r!==void 0)a=$p(r);else{let s=Je(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):kp(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Tp(a);break}return a}function kn(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Xe(e,n=240){return Il(e,n).map(t=>t.value)}function Il(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let d=!r;s(),d&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function El(e,n,t){let i=Il(e),a=i.map(b=>b.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?St({bands:t.bands??[]}):[],d=t.bandAboveColorHex??ae,c=t.highColorHex??Le,u=t.lowColorHex??_e,p=[],m=(b,x)=>{if(b==="")return;let $=p.at(-1);$&&$.colorHex===x?$.text+=b:p.push({text:b,colorHex:x})},y=0;return i.forEach((b,x)=>{m(e.slice(y,b.start),n);let $=x===o?c:x===s?u:l.length>0?Pi(b.value,l,d):n,S=e[b.end-1]==="."?b.end-1:b.end;m(e.slice(b.start,S),$),y=S}),m(e.slice(y),n),p}function Ml(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function Mp(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function di(e,n=Et){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:Fp(i.slice(a+1))})}return t}function Fp(e){try{return decodeURIComponent(e)}catch{return e}}function Rp(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(d>s))continue;let c=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===c?u.end=d:i.push({start:s,end:d,colorHex:c})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function Fl(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function Ip(e,n,t){if(e===void 0)return 0;let i=Je(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var pt=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let t=this.chartSeries(n),i=Ml(t,n),a={values:t,domainMin:i.min,domainMax:i.max},r=this.chartEntity(n);return r&&(a.entity=r),a}chartSeries(n){let t=Gt(n),i=Kt(n),a;t!==void 0?a=this.ctx.historySeries?.get(t)??"":i!==void 0?a=this.ctx.historySeries?.get(i)??"":a=this.resolve(n.value)??"";let r=Xe(a);return n.limit>0&&r.length>n.limit?n.takeFromEnd?r.slice(r.length-n.limit):r.slice(0,n.limit):r}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=Je(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind!=="chart"||t.has(s.payload.id)||(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let c=t.get(s);if(!c)return{min:0,max:1};let u=c.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):Ml(a.get(s)??[],c);return r.set(s,p),p};for(let s of i){let l=t.get(s),d=o(s,new Set([s])),c={values:a.get(s)??[],domainMin:d.min,domainMax:d.max},u=this.chartEntity(l);u&&(c.entity=u),this.charts.set(s,c)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Re(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?yp(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?Gs(r):ur(r,a.domainMax-a.domainMin));break}default:{let a=Br(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Ep(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Xt(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?kn(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=Je(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:Je(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),c=d===void 0?void 0:Je(d);if(a===void 0||l===void 0||c===void 0)return!1;let[u,p]=l<=c?[l,c]:[c,l];return a>=u&&a<=p}case"timeBetween":{let l=qt(i),d=r(),c=this.resolve(t.upper),u=d===void 0?void 0:qt(d),p=c===void 0?void 0:qt(c);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(Fe[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(d=>d.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=El(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t){let i=n.payload,a=n.kind==="text"?i.rules.filter(p=>p.partId===void 0):i.rules,r=this.applyRules(a,t),o=r.get("visibility"),s=o?o.kind==="hide":i.isHidden,l=this.styleNumber(r,"rotation"),d=l===void 0?i.frame:{...i.frame,rotationDegrees:l},c=this.styleNumber(r,"opacity")??1,u={id:i.id,isHidden:s,frame:d,opacity:c};switch(n.kind){case"text":{let p=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,m=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,y=rt(n.payload)&&!r.has("text"),b={kind:"text",...u,text:y?"":this.styleText(r,"text")??m??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(r,"fontSize")??n.payload.fontSize,fontWeight:r.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:n.payload.lineLimit===2?2:1,alignment:n.payload.alignment??"center"};return p!==void 0&&(b.countdownEnd=p),y?(b.parts=this.resolveTextParts(n.payload.parts,i.rules,b,t),b.text=b.parts.map(x=>x.text).join(""),b):(Os(n.payload)&&(b.spans=El(b.text,b.colorHex,n.payload)),b)}case"icon":{let p=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",m=this.styleText(r,"icon"),y=n.payload.symbol.kind.kind==="literal",b=m===void 0&&y&&n.payload.path!==""?n.payload.path:void 0,x=m??p;b===void 0&&x.startsWith("mdi:")&&(x="questionmark.circle");let $={kind:"icon",...u,symbol:x,size:this.styleNumber(r,"fontSize")??n.payload.size,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex};return b!==void 0&&($.path=b),$}case"gauge":{let p=n.payload,m=this.styleText(r,"gaugeValue")??this.resolve(p.value),y=(z,U,ne)=>z??(U?Je(this.resolve(U)??""):void 0)??ne,b=y(this.styleNumber(r,"gaugeMin"),p.minSource,p.minValue),x=y(this.styleNumber(r,"gaugeMax"),p.maxSource,p.maxValue),$=m===void 0?void 0:Je(m),S=this.styleColor(r,"color")??p.colorSlot.baseColorHex;p.coloring==="bands"&&p.bands.length>0&&$!==void 0&&(S=Pi($,St(p),p.bandAboveColorHex));let w=x-b;if(p.total){let z=Je(this.resolve(p.total)??"");z!==void 0&&(w=z)}let C=Fl(w,1,_i),N={kind:"gauge",...u,fraction:Ip(m,b,x),style:p.style,lineWidth:p.lineWidth,colorHex:S,trackColorHex:p.trackColorHex,thresholdColorHex:p.thresholdColorHex,dotCount:C,filledCount:Fl($??0,0,C)};if(p.thresholdValue!==void 0&&x!==b){let z=(p.thresholdValue-b)/(x-b);z>=0&&z<=1&&(N.thresholdFraction=z)}return N}case"chart":{let p=n.payload,m=this.charts.get(p.id)??this.chartReadings(p),y=m.values,b={min:m.domainMin,max:m.domainMax},x=this.styleColor(r,"color")??p.colorSlot.baseColorHex,$=St(p),S=Us(p)?y.map(T=>Pi(T,$,p.bandAboveColorHex)):[],w=p.highlight==="highest"||p.highlight==="both",C=p.highlight==="lowest"||p.highlight==="both",N=kt(p),z={kind:"chart",...u,values:y,style:p.style,domainMin:b.min,domainMax:b.max,baseline:p.baseline,barGap:p.barGap,lineWidth:p.lineWidth,colorHex:x,highColorHex:p.highColorHex,lowColorHex:p.lowColorHex,marker:p.marker,highMarker:w?N.high:"none",lowMarker:C?N.low:"none",pointColorHexes:S,fillBands:p.fillBands,thresholdColorHex:p.thresholdColorHex,nowColorHex:p.nowColorHex,labels:wp(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove};if(y.length>0){let T=w?y.indexOf(Math.max(...y)):-1,V=C?y.indexOf(Math.min(...y)):-1;T>=0&&(z.highIndex=T),V>=0&&V!==T&&(z.lowIndex=V)}let U=Mp(p,b.min,b.max);U!==void 0&&(z.thresholdY=U);let ne=this.chartNowIndex(p,y.length);return ne!==void 0&&(z.nowIndex=ne),z}case"timeline":{let p=n.payload,m=Mt(p),y=m===void 0?"":this.ctx.historySeries?.get(m)??"",b=di(y,Et),x=Rp(b,qe(p)*60,S=>Js(S,p.bands,p.otherColorHex));return{kind:"timeline",...u,runs:x,gap:p.gap,cornerRadius:p.cornerRadius,labels:vp(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove}}case"shape":{let p={kind:"shape",...u,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(r,"borderWidth")??n.payload.borderWidth},m=this.styleColor(r,"borderColor")??n.payload.borderColorHex;return m!==void 0&&(p.borderColorHex=m),p}case"image":{let p={kind:"image",...u,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};ot(n.payload)&&(p.timestampX=n.payload.timestampX,p.timestampY=n.payload.timestampY);let m=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return m!==void 0&&(p.url=m),p}case"tap":{let p={kind:"tap",...u,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(p.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(p.attachedTo=n.payload.attachedTo),p}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=dl(n,t).map(b=>this.resolveElement(b,i)),o=a?this.applyRules(a.rules,i):new Map,s={family:t,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},l=this.styleText(o,"text"),d=a?.bezelCountdown&&l===void 0?this.countdownEnd(a.bezelText):void 0,c=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,u=l??c??this.resolve(a?.bezelText);u!==void 0&&(s.bezelText=u),d!==void 0&&(s.bezelCountdownEnd=d);let p=this.resolve(a?.curvedText);if(p!==void 0&&(s.curvedText=p),a?.curvedColorHex!==void 0&&(s.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let b=a.bezelGauge,x=this.resolve(b.value),$=x===void 0?void 0:Je(x);if($!==void 0){let S=Math.min(b.minValue,b.maxValue),w=Math.max(b.minValue,b.maxValue),C={value:Math.min(w,Math.max(S,$)),minValue:S,maxValue:w===S?S+1:w,colorHexes:b.colorHexes},N=this.resolve(b.minLabel);N!==void 0&&(C.minLabel=N);let z=this.resolve(b.maxLabel);z!==void 0&&(C.maxLabel=z),s.bezelGauge=C}}let m=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;m!==void 0&&(s.backgroundColorHex=m);let y=this.styleColor(o,"borderColor")??a?.borderColorHex;return y!==void 0&&(s.borderColorHex=y),s}};function Ap(e,n,t){let i=new pt(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Xi(e,n,t){let i=new pt(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Ap(e.inline,n,e)),a}var Se=xe,ui=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:Se,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],$n=ui.find(e=>e.measured);function Dl(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return ui.find(a=>a.screen.width===t&&a.screen.height===i)}function Qi(e,n){let t=Se[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Wr={regular:400,medium:500,semibold:600,bold:700},Hp=1.15;function Ze(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function fe(e,n,t="#FFFFFF"){let i=Ze(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function Vl(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var ht=e=>e*.55;function Bl(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function Lp(e,n){let t=e.split(/\s+/).filter(r=>r!=="");if(t.length<2)return[e];let i="",a=0;for(let r=0;r<t.length-1;r++){let o=i===""?t[r]:`${i} ${t[r]}`;if(i!==""&&o.length>n)break;i=o,a=r+1}return a===0&&(i=t[0],a=1),[i,t.slice(a).join(" ")]}function _p(e,n,t){if(t<=0||e.length*ht(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/ht(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Pp(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function Ul(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function Gl(e,n,t,i,a){let r=[],o=n,s=a,l=d=>d<t.length&&/\s/.test(t[d]);for(let d of e){let c=s;if(/\s/.test(d))for(l(o)&&(c=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(d,o)&&(c=i[o],o+=d.length)}s=c;let u=r.at(-1);u&&u.look===c?u.text+=d:r.push({text:d,look:c})}return r}function zp(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function Kl(e,n){return e.reduce((t,i)=>t+i.text.length*ht(i.look.fontSize*n),0)}function Np(e,n,t){let i=[...e.matchAll(/\S+/g)];if(i.length<2)return[e];let a=l=>n[l]?.fontSize??0,r=0,o=0;for(let l=0;l<i.length-1;l++){let d=i[l].index??0,c=o===0?0:ht(a(d-1));for(let u=d;u<d+i[l][0].length;u++)c+=ht(a(u));if(o>0&&r+c>t)break;r+=c,o=l+1}let s=l=>l.map(d=>d[0]).join(" ");return[s(i.slice(0,o)),s(i.slice(o))]}function Op(e,n,t){if(t<=0||Kl(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,d=t-.8*l,c="";for(let u of s.text){if(r>0&&a+u.length*ht(l)>d){c!==""&&i.push({text:c,look:s.look});break e}c+=u,a+=u.length*ht(l),r+=1}i.push({text:c,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function Dp(e,n,t){let i=zp(n),a=e.lineLimit===2&&t.w>0?Np(e.text,i,t.w):[e.text],r=Ul(e.text,a),o=a.map((S,w)=>Gl(S,r[w]??0,e.text,i,i[0])),s=Math.max(...o.map(S=>Kl(S,1))),l=s>t.w&&t.w>0?Math.max(.5,t.w/s):1,d=o.map(S=>Op(S,l,t.w)),{anchor:c,x:u}=Bl(e.alignment,t),p=Math.max(0,...d.flat().map(S=>S.look.fontSize))*l||e.fontSize*l,m=.35*p,y=p*1.15,b=S=>S.map(w=>{let C=fe(w.look.colorHex,"fill");return v`<tspan font-size=${w.look.fontSize*l} font-weight=${Wr[w.look.fontWeight]??400} fill=${C.fill} fill-opacity=${C["fill-opacity"]}>${w.text}</tspan>`}),x=fe(e.colorHex,"fill"),$=d.length>1?v`${d.map((S,w)=>v`<tspan x=${u} y=${t.cy+m+(w-(d.length-1)/2)*y}>${b(S)}</tspan>`)}`:b(d[0]);return v`<text x=${u} y=${t.cy+m} text-anchor=${c}
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${e.fontSize*l} font-weight=${Wr[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${x.fill} fill-opacity=${x["fill-opacity"]}>${$}</text>`}function Vp(e,n){if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(b=>b.text).join("")===e.text)return e.text===""?f:Dp(e,e.parts,n);let t=fe(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:kn((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit===2&&n.w>0?Lp(e.text,n.w/ht(e.fontSize)):[e.text],a=Math.max(...i.map(b=>b.length))*ht(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,s=i.map(b=>_p(b,o,n.w)),{anchor:l,x:d}=Bl(e.alignment,n),c=Pp(e.text,e.spans),u=c?Ul(e.text,i):[],p=(b,x)=>c?Gl(b,u[x]??0,e.text,c,e.colorHex).map($=>{let S=fe($.look,"fill");return v`<tspan fill=${S.fill} fill-opacity=${S["fill-opacity"]}>${$.text}</tspan>`}):b,m=o*1.15,y=s.length>1?v`${s.map((b,x)=>v`<tspan x=${d} y=${n.cy+(x-(s.length-1)/2)*m}>${p(b,x)}</tspan>`)}`:p(s[0],0);return v`<text x=${d} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${Wr[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${y}</text>`}var Gr=2;function Bp(e,n){let t=fe(e.colorHex,"stroke"),i=fe(e.trackColorHex,"stroke","#FFFFFF"),a=fe(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let m=n.w>=n.h,y=Math.max(1,e.dotCount),b=m?n.w:n.h,x=m?n.h:n.w,$=Math.max(1,Math.min(x,b/y-Gr)),S=y*$+(y-1)*Gr,w=(m?n.cx:n.cy)-S/2+$/2;return v`${Array.from({length:y},(C,N)=>{let z=w+N*($+Gr),U=N<e.filledCount?t:i;return v`<circle cx=${m?z:n.cx} cy=${m?n.cy:z} r=${$/2}
        fill=${U.stroke} fill-opacity=${U["stroke-opacity"]} />`})}`}if(e.style==="bar"){let m=n.w,y=Math.max(r,m*e.fraction),b=1;return v`
      <rect x=${n.x} y=${n.cy-r/2} width=${m} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${y} height=${r} rx=${r/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />
      ${e.thresholdFraction===void 0?f:v`<rect x=${n.x+Math.min(m-b,Math.max(0,m*e.thresholdFraction-b/2))}
            y=${n.cy-r/2} width=${b} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=e.style==="ring"?1:.75,c=e.style==="ring"?-90:135,u=l*d,p=l*d*e.fraction;return v`
    <g transform="rotate(${c} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?v`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:f}
      ${e.thresholdFraction===void 0?f:Up(n,s,r,d*360*e.thresholdFraction,e.thresholdColorHex)}
    </g>`}function Up(e,n,t,i,a){let r=fe(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=t/2+1;return v`<line x1=${e.cx+s*(n-d)} y1=${e.cy+l*(n-d)}
    x2=${e.cx+s*(n+d)} y2=${e.cy+l*(n+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}var Gp=5;function Kp(e,n){let t=e.values,i=Math.max(t.length,1),r=e.highIndex!==void 0&&e.highMarker!=="none"||e.lowIndex!==void 0&&e.lowMarker!=="none"?Gp:0,o=e.style==="bars"?0:e.lineWidth/2,s=n.x,l=Math.max(n.w,0),d=n.y+r+o,c=Math.max(n.h-r-o*2,1),u=d+c,p=Math.max(e.domainMax-e.domainMin,Number.EPSILON),m=e.baseline==="lowest",y=m?c*.12:0,b=Math.min(Math.max(e.barGap,0),l/(i*2)),x=Math.max((l-b*(i-1))/i,.5),$=w=>Math.min(1,Math.max(0,(w-e.domainMin)/p)),S=w=>u-$(w)*c;return{count:t.length,barWidth:x,plotTop:d,plotBottom:u,plotLeft:s,plotRight:s+l,baselineY:m?u:S(0),yAtFraction(w){return u-Math.min(Math.max(w,0),1)*c},barRect(w){let C=s+w*(x+b),N=t[w],z,U;if(m){let ne=y+$(N)*(c-y);z=u-ne,U=u}else z=S(N),U=m?u:S(0),z>U&&([z,U]=[U,z]);return{x:C,y:z,w:x,h:Math.max(U-z,.5)}},point(w){let C=Math.max(l-o*2,0);return{x:t.length>1?s+o+C*w/(t.length-1):s+l/2,y:S(t[w])}},markerCenter(w,C){let N=C?this.barRect(w):void 0;return{x:N?N.x+N.w/2:this.point(w).x,y:n.y+r/2}}}}function Wp(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Wl(e,n),o=r?jl(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?f:v`${o}`;let s=jp(e,a);return o===void 0?s:v`${s}${o}`}function jp(e,n){let t=Kp(e,n),i=fe(e.colorHex,"fill"),a=fe(e.highColorHex,"fill",e.colorHex),r=fe(e.lowColorHex,"fill",e.colorHex),o=(u,p)=>v`<circle cx=${u.x} cy=${u.y} r="1.7" fill=${p.fill} fill-opacity=${p["fill-opacity"]} />`,s=[],l=e.pointColorHexes.length===t.count,d=u=>l?fe(e.pointColorHexes[u],"fill",e.colorHex):i;if(e.style==="bars")for(let u=0;u<t.count;u++){let p=t.barRect(u),m=u===e.highIndex?a:u===e.lowIndex?r:d(u),y=Math.min(1.2,p.w/2,p.h/2);s.push(v`<rect x=${p.x} y=${p.y} width=${p.w} height=${p.h} rx=${y}
        fill=${m.fill} fill-opacity=${m["fill-opacity"]} />`)}else{let u=Array.from({length:t.count},(m,y)=>t.point(y)),p=u.map((m,y)=>`${y===0?"M":"L"}${m.x} ${m.y}`).join(" ");if(e.style==="area")if(e.fillBands&&l&&t.count>1)for(let m=0;m<t.count-1;m++){let y=u[m],b=u[m+1],x=d(m+1),$=`M${y.x} ${y.y} L${b.x} ${b.y} L${b.x} ${t.baselineY} L${y.x} ${t.baselineY} Z`;s.push(v`<path d=${$} fill=${x.fill}
            fill-opacity=${x["fill-opacity"]*.28} stroke="none" />`)}else{let m=`${p} L${u[u.length-1].x} ${t.baselineY} L${u[0].x} ${t.baselineY} Z`;s.push(v`<path d=${m} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(l&&t.count>1)for(let m=0;m<t.count-1;m++){let y=u[m],b=u[m+1],x=d(m+1);s.push(v`<path d=${`M${y.x} ${y.y} L${b.x} ${b.y}`} fill="none"
          stroke=${x.fill} stroke-opacity=${x["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else s.push(v`<path d=${p} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&s.push(o(u[e.highIndex],a)),e.lowIndex!==void 0&&s.push(o(u[e.lowIndex],r))}let c=(u,p,m)=>{if(u===void 0||p==="none")return;let y=t.markerCenter(u,e.style==="bars");s.push(p==="triangle"?v`<path d=${`M${y.x} ${y.y-1.8} L${y.x+2.2} ${y.y+1.8} L${y.x-2.2} ${y.y+1.8} Z`}
          fill=${m.fill} fill-opacity=${m["fill-opacity"]} />`:o(y,m))};if(c(e.highIndex,e.highMarker,a),c(e.lowIndex,e.lowMarker,r),e.thresholdY!==void 0){let u=t.yAtFraction(e.thresholdY),p=fe(e.thresholdColorHex,"fill",e.colorHex);s.push(v`<path d=${`M${t.plotLeft} ${u} L${t.plotRight} ${u}`} fill="none"
      stroke=${p.fill} stroke-opacity=${p["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.nowIndex!==void 0&&e.nowIndex<t.count){let u=t.markerCenter(e.nowIndex,e.style==="bars").x,p=fe(e.nowColorHex,"fill",e.colorHex);s.push(v`<path d=${`M${u} ${t.plotTop} L${u} ${t.plotBottom}`} fill="none"
      stroke=${p.fill} stroke-opacity=${p["fill-opacity"]} stroke-width="1" />`)}return v`${s}`}var ci=1;function Wl(e,n){let t=Math.max(ai,Math.min(ri,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-ci>=2,r=a?{...n,y:e.labelsAbove?n.y+i+ci:n.y,h:n.h-i-ci,cy:(e.labelsAbove?n.y+i+ci:n.y)+(n.h-i-ci)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function jl(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=fe(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let d=s===e.labels.length-1?"end":s===0?"start":"middle",c=n.x+o.position*n.w;return v`<text x=${c} y=${a} text-anchor=${d} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function qp(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Wl(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,d)=>{let c=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=d===e.runs.length-1,m=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),y=Math.max(0,Math.min(e.cornerRadius,m/2,a.h/2)),b=fe(l.colorHex,"fill");return v`<rect x=${c} y=${a.y} width=${m} height=${a.h} rx=${y}
      fill=${b.fill} fill-opacity=${b["fill-opacity"]} />`});return r?v`${s}${jl(e,n,t,i)}`:v`${s}`}function Yp(e,n){let t=fe(e.fillColorHex,"fill"),i=e.borderColorHex?Ze(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(n.w,n.h)/2-r;return v`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,l)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(n.w,n.h)/2;return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${l}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return v`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"line":{let l=n.w>=n.h,d=Math.max(0,Math.min(e.thickness,l?n.h:n.w)),c=l?n.x:n.cx-d/2,u=l?n.cy-d/2:n.y;return v`<rect x=${c} y=${u} width=${l?n.w:d} height=${l?d:n.h}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]} stroke="none" />`}}}function Jp(e,n,t){if(e.path!==void 0&&e.path!==""){let o=fe(e.colorHex,"fill"),s=e.size*Hp;return v`<g transform="translate(${n.cx-s/2} ${n.cy-s/2}) scale(${s/24})">
      <path d=${e.path} fill=${o.fill} fill-opacity=${o["fill-opacity"]} /></g>`}let i=t.render(e.symbol,e.size,e.colorHex);if(i)return v`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=fe(e.colorHex,"stroke"),r=e.size;return v`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var Xr=.25,Xp=8;function Zp(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,Xr),Xp),c=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:c)*d,m=t*p,y=i*p,b=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),x=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(m-e)/2*(1+b)+0,y:-(y-n)/2*(1+x)+0,width:m,height:y}}function ea(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Zi=4;function ta(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Zi:n.x+n.w-Zi-a,d=e.timestampCorner.startsWith("top")?n.y+Zi:n.y+n.h-Zi-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,c,u)=>u>=c?d+(c-u)/2:Math.min(d+c-u,Math.max(d,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Qp(e,n){if(e==="camera")return"camera.fill";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function eh(e,n,t){let i=t.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?ta(e,n,ea(new Date)):void 0,s=o?v`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,l=3,d=o&&t.timestampActiveId===e.id?v`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([p,m,y])=>v`<rect data-ts-corner=${p} x=${m-l/2} y=${y-l/2} width=${l} height=${l}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${p}-resize" />`)}`:f,c=e.url?t.imageSizes?.size(e.url):void 0,u;if(e.url&&c){let p=Zp(n.w,n.h,c.width,c.height,e.contentMode,e.zoom,e.panX,e.panY);u=v`<image href=${e.url} x=${n.x+p.x} y=${n.y+p.y} width=${p.width} height=${p.height}
      preserveAspectRatio="none" />`}else e.url?u=v`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:u=v`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(Qp(e.source,e.entityId),14,"#FFFFFF99")??f}</g>`;return v`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${u}${s}</g>${d}`}function th(e,n,t,i,a){if(!i)return f;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?nh(a,n):void 0;return v`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?v`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${jr} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?v`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var jr=5;function nh(e,n){let t=jr*.55,i=n.w-2;if(n.h<jr*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function qr(e,n,t){if(e.isHidden&&!t.showHidden)return f;let i=t.tapReview===!0,a=t.tapAreas===!0||i,r=i?t.tapFocusId:void 0,o=r!==void 0&&e.id===r,s=r!==void 0;if(e.kind==="tap"&&!a)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||s&&!o))return f;let l=Vl(e,n),d=i&&(!s||o),c;switch(e.kind){case"text":c=Vp(e,l);break;case"icon":c=Jp(e,l,t.icons);break;case"gauge":c=Bp(e,l);break;case"chart":c=Wp(e,l);break;case"timeline":c=qp(e,l);break;case"shape":c=Yp(e,l);break;case"image":c=eh(e,l,t);break;case"tap":c=th(e,l,t.icons,a,d?st(e.action):void 0);break}let u=i&&(e.kind!=="tap"||s&&!o)?.35:1,p=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*u,m=t.highlightId===e.id,y=m||t.highlightIds?.includes(e.id)===!0,b=t.handles===!0&&(!s||o),x=y?v`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,$=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?v`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,S=v`<rect x=${l.x} y=${l.y} width=${l.w} height=${l.h} fill="transparent" stroke="none" />`,w=3,C=m&&b?[["nw",l.x,l.y],["ne",l.x+l.w,l.y],["sw",l.x,l.y+l.h],["se",l.x+l.w,l.y+l.h]].map(([N,z,U])=>v`<rect data-handle=${N} x=${z-w/2} y=${U-w/2} width=${w} height=${w}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${N}-resize" />`):f;return v`<g data-element-id=${e.id} opacity=${p} style=${b?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${l.cx} ${l.cy})">${S}${c}${$}${x}${C}</g>`}function na(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function Zr(e,n){return(n?23.5:34)*e}var Al=10.5;function ql(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Hl(e,n){let t=0;for(let i of e)t+=ql(i,n);return t}function Ll(e,n,t){let i=e.toUpperCase(),a=d=>ql(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function Yr(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function Jr(e,n,t,i){let a=Yr(e,n,t),r=Yr(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function Yl(e,n,t,i){let{dial:a}=na(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:Jr(a,t,i.start,i.end),length:t*r}}function ih(e,n){let t=na(e,!0);return Yl(e,n,t.dial.r,t.labelArc)}var _l=18.5,ah=113,rh={start:-71,end:-36},Pl=104,oh=6.2,zl={start:-77,end:-30.5};function Nl(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Ol(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Nl(e[i]),o=Nl(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var Kr=11;function sh(e,n,t){let{dial:i}=na(n,!0),a=Pl*n,r=180/(Math.PI*Pl),o=e.minLabel!==void 0?Hl(e.minLabel,Kr)*r:0,s=e.maxLabel!==void 0?Hl(e.maxLabel,Kr)*r:0,l=zl.start+(o>0?Math.max(0,o-1.8):0),d=zl.end-(s>0?Math.max(0,s-1.8):0),c=d-l,u=24,p=[];for(let $=0;$<u;$++){let S=l+c*$/u,w=Math.min(d,l+c*($+1)/u+.4);p.push(v`<path d=${Jr(i,a,S,w)} fill="none"
      stroke=${Ol(e.colorHexes,($+.5)/u)} stroke-width=${oh*n}
      stroke-linecap=${$===0||$===u-1?"round":"butt"} />`)}let m=(e.value-e.minValue)/(e.maxValue-e.minValue),y=Yr(i,a,l+c*m),b=1.5,x=($,S,w,C)=>v`
    <defs><path id=${$} d=${Jr(i,a,S,w)} /></defs>
    <text font-size=${Kr*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${$}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return v`${p}
    <circle cx=${y.x} cy=${y.y} r=${3.2*n} fill=${Ol(e.colorHexes,m)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?x(`${t}-gmin`,l-b-Math.max(o,3),l-b,e.minLabel):f}
    ${e.maxLabel!==void 0?x(`${t}-gmax`,d+b,d+b+Math.max(s,3),e.maxLabel):f}`}function ia(e,n){let t=e.family in Se?e.family:"rectangular",i=n.slot??Se[t],a=Se[t],r=Qi(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=Ze(e.backgroundColorHex),l=Ze(e.borderColorHex),d=e.borderWidth*r.scale;if(t==="corner"){let y=r.scale,b=!!e.bezelText||!!e.bezelGauge,x=e.curvedText??"",$=x!=="",S=na(y,b),w=Zr(y,b),C=w/(a.width*y),N=S.tile.cx-w/2,z=S.tile.cy-w/2,U=`M 0 0 H ${S.quad.width-S.cornerRadius} A ${S.cornerRadius} ${S.cornerRadius} 0 0 1 ${S.quad.width} ${S.cornerRadius} V ${S.quad.height} H 0 Z`,ne=f;if(e.bezelGauge)ne=sh(e.bezelGauge,y,o);else if(e.bezelText){let V=ih(y,`${o}-bezel`),X=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?kn((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;ne=v`<defs><path id=${V.id} d=${V.d} /></defs>
        <text font-size=${Al*y} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${V.id}" startOffset="50%" text-anchor="middle">${Ll(X,V.length,Al*y)}</textPath></text>`}let T=f;if($){let V=Ze(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},X=Yl(y,`${o}-curved`,ah*y,rh);T=v`<defs><path id=${X.id} d=${X.d} /></defs>
        <text font-size=${_l*y} font-weight="600" fill=${V.color} fill-opacity=${V.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${X.id}" startOffset="50%" text-anchor="middle">${Ll(x,X.length,_l*y*.88)}</textPath></text>`}else{let V=e.borderWidth*r.scale*C,X=l?v`<circle cx=${w/2} cy=${w/2} r=${w/2-V/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${V} />`:f;T=v`<g transform="translate(${N} ${z})">
        <g clip-path=${`url(#${o})`}>
          ${s?v`<rect width=${w} height=${w} fill=${s.color} fill-opacity=${s.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*C})">
            ${e.elements.map(W=>qr(W,a,n))}
          </g>
        </g>
        <circle cx=${w/2} cy=${w/2} r=${w/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*y} stroke-dasharray=${`${2*y} ${2*y}`} />
        ${X}
      </g>`}return v`<svg viewBox=${`0 0 ${S.quad.width} ${S.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${S.quad.width} height=${S.quad.height}>
      <defs><clipPath id=${o}><circle cx=${w/2} cy=${w/2} r=${w/2} /></clipPath></defs>
      <path d=${U} fill="#000000" />
      ${ne}
      ${T}
    </svg>`}let c=v`<rect width=${i.width} height=${i.height} />`,u=l?v`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:f,p=v`<rect width=${i.width} height=${i.height} fill="#000000" />`,m=`0 0 ${i.width} ${i.height}`;return v`<svg viewBox=${m} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${c}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${p}
      ${s?v`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(y=>qr(y,a,n))}
      </g>
    </g>
    ${u}
  </svg>`}var lh=.14;function dh(e,n){let t=Vl(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function ch(e,n,t){let i=e.family in Se?e.family:"rectangular",a=Se[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let p of r){let m=dh(p,a),y=p.frame.rotationDegrees%180===0?0:Math.hypot(m.w,m.h)/2;o=Math.min(o,y?m.cx-y:m.x),s=Math.min(s,y?m.cy-y:m.y),l=Math.max(l,y?m.cx+y:m.x+m.w),d=Math.max(d,y?m.cy+y:m.y+m.h)}let c=l-o,u=d-s;if(r.length===0||!(c>0)||!(u>0))o=0,s=0,c=a.width,u=a.height;else{let p=Math.max(2,Math.max(c,u)*lh);o-=p,s-=p,c+=2*p,u+=2*p}if(c/u<t){let p=u*t;o-=(p-c)/2,c=p}else{let p=c/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:c,h:u}}function Jl(e,n,t){let i=e.family in Se?e.family:"rectangular",a=Se[i],r=ch(e,n,t.width/t.height),o=Ze(e.backgroundColorHex),s=Ze(e.borderColorHex),l=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,...t.imageSizes?{imageSizes:t.imageSizes}:{}},c=e.elements.filter(m=>n.includes(m.id)),u=s&&l>0?i==="rectangular"?v`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:f,p=i==="rectangular"?v`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return v`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${p}
    ${c.map(m=>qr(m,a,d))}
    ${u}
  </svg>`}function Q(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var Zt=["rectangular","circular","corner","inline"];function Cn(e){return ie.includes(e)}function aa(e){return Zt.filter(n=>e.supportedFamilies.includes(n))}function Qr(e){return ie.find(n=>e.supportedFamilies.includes(n))}function ra(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function uh(){return{value:H("")}}function Xl(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=Zt.filter(t=>t===n||e.supportedFamilies.includes(t))),Cn(n)?e.perFamily[n]||(e.perFamily[n]=ct()):e.inline||(e.inline=uh()),e.schemaVersion=Bt(e)}function Zl(e,n){if(ra(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),Cn(n)){for(let t of Ye(e,n))ut(e,t.payload.id);delete e.perFamily[n],Be(e)}else delete e.inline;e.schemaVersion=Bt(e)}}function Ql(e,n){let t=[];if(!Cn(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Ye(e,n).filter(r=>!pe(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var ve={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},Sn={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area"},eo=["text","icon","gauge","chart","timeline","shape","image","tap"],te={states:"#f9a825",tap:ve.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var ed="2.8.0";function to(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function ph(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function td(e,n=ed){let t=to(e),i=to(n);return!t||!i?!1:ph(t,i)>=0}function nd(e,n=ed){return`${to(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}var id="52a9d81d0fd7";var ad="11fa18406cea";var Ie="mdi:";function hh(e){return e.trim().replace(/\./g,"-")}function mh(e){return e.trim().replace(/-/g,".")}var oa=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>mh(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=hh(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Ze(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},sa=class{constructor(n,t="symbol-icons.json.gz",i=id){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Ze(i)??{color:"#FFFFFF",opacity:1};return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},no=class{constructor(n,t){this.sf=n;this.mdi=new sa(t,"mdi-icons.json.gz",ad)}render(n,t,i){return(n.trim().startsWith(Ie)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function rd(e){let n=oa.available()?new oa(e):new sa(e);return new no(n,e)}function od(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var da=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],ca=[...new Set(da.flatMap(e=>e.symbols))],fh={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function gh(e){return`${e.replace(/\./g," ")} ${(fh[e]??[]).join(" ")}`}function io(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=gh(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var la=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var yh=100;function sd(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Qt=class e{constructor(n,t){this.config=n;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,wn(n),Ft(n),this.baseline=JSON.stringify(bn(n))}static fromDocument(n,t){return new e(yn(n),t)}get dirty(){return JSON.stringify(bn(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){let a=Date.now();(this.held?this.heldStepTaken:t!==void 0&&t===this.coalesceKey&&a<this.coalesceUntil)||(this.past.push(structuredClone(this.config)),this.past.length>yh&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=t,this.coalesceUntil=t===void 0?0:a+800;let o=structuredClone(this.config);n(o),wn(o,i),Ft(o),this.config=o}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push(this.config),this.config=n,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push(this.config),this.config=n,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=Ur(n),bn(n)}commit(){let n=structuredClone(this.config);return n.dataSources=Ur(n),new e(n,null)}};var ua=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var Tn={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Qe={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},dd=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],cd={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},ao=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],bh=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function ro(e){return bh.includes(e)}function xh(e){return ao.includes(e)}function vh(e,n){return JSON.stringify(re(e))===JSON.stringify(re(n))}function oo(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!xh(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Tn[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!vh(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=ld(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Qe[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=ld(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Qe[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:wh(i,n.otherwise),numberMode:i.length>0&&i.every(r=>ro(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function ld(e){let n=new Set;for(let t of e){let i=Fe[t.kind];if(n.has(i))return i;n.add(i)}}function wh(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(Fe[a.kind]);for(let i of n??[])t.add(Fe[i.kind]);return dd.filter(i=>t.has(i))}function ud(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return dd.filter(a=>i.has(a)&&t.includes(a))}function pa(e,n){return e.find(t=>Fe[t.kind]===n)}function pd(e,n,t,i){let a=n.map(o=>({id:o.caseId??Y(),when:{join:o.join??"all",tests:[{id:o.testId??Y(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??Y(),cases:a};return t&&(r.otherwise=t),r}function pi(e){if(e.length===0)return"No states yet.";let n=oo(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function hd(e){let n=e[0];return n||(n={id:Y(),cases:[]},e.push(n)),n}function md(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function fd(e,n,t){let i=hd(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:Y(),when:{join:"all",tests:[{id:Y(),value:structuredClone(n),comparison:$h(a,t)}]},then:[]})}function gd(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),md(e))}function so(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function lo(e,n){if(n){hd(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,md(e))}function yd(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function bd(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>Fe[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function kh(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function xd(e,n=kh){let t=()=>n(e.value??H(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??H(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??H(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Yt(e.kind)==="value"?`${Tn[e.kind]} ${t()}`:Tn[e.kind]}}function $h(e,n){if(!e)return n?{kind:"lessThan",value:H("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??H("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??H("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??H("0")};default:return{kind:e.kind,...Yt(e.kind)==="value"?{value:H("")}:{}}}}var vd={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function wd(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function Ch(e){switch(e){case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return v`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return v`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return v`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return v`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return v`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return v`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return v`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return v`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return v`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return v`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return v`<path d="M6 9L12 15L18 9" />`;case"plus":return v`<path d="M12 5V19M5 12H19" />`;case"braces":return v`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return v`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"watch":return v`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return v`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return v`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return v`<path d="M6 14L12 8L18 14" />`;case"down":return v`<path d="M6 10L12 16L18 10" />`;case"left":return v`<path d="M14 6L8 12L14 18" />`;case"right":return v`<path d="M10 6L16 12L10 18" />`;case"show":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return v`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return v`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return v`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return v`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return v`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return v`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return v`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return v`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function D(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Ch(e)}</svg>`}var et="color-mix(in srgb, var(--k) 45%, #6b7280)",ha='system-ui, -apple-system, "Segoe UI", sans-serif';function kd(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let u=c*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function co(e,n,t,i){return v`<g fill="none" stroke-linecap="round">
    <path d=${kd(e,n,t,1)} stroke=${et} stroke-width="2.6" opacity=".5" />
    <path d=${kd(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function Sh(e){switch(e){case"text":return v`<g font-family=${ha} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${et}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${et}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${et}>1.2 kW</text>
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
        ${co(22,24,12,.28)}
        ${co(60,24,12,.62)}
        ${co(98,24,12,.92)}
        <text x="60" y="27" font-family=${ha} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return v`<g>
        <g opacity=".4" fill=${et}>
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
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${et} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${et} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${et} opacity=".55" />
        <text x="6" y="39" font-family=${ha} font-size="7" fill=${et}>1h ago</text>
        <text x="114" y="39" font-family=${ha} font-size="7" text-anchor="end" fill=${et}>now</text>
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
      </g>`}}function $d(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${Sh(e)}</svg>`}function En(e,n){let t=new DOMPoint(n.clientX,n.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=t.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function uo(e,n){let t={...e,...n};return po({...t,x:Rt(t.x),y:Rt(t.y),width:Math.max(.04,Rt(t.width)),height:Math.max(.04,Rt(t.height))})}function po(e){let n=Math.min(.96,Math.max(-e.width+.04,e.x)),t=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:n,y:t}}var Rt=e=>Math.round(e*1e3)/1e3,Cd=10;function ho(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return po({...e,x:Rt(a),y:Rt(r)})}function Sd(e,n,t,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?Rt(a(e.x+n/i.w)):e.x,y:i.h>0?Rt(a(e.y+t/i.h)):e.y}}function ma(e,n,t,i,a){let r=En(e,t),o={...i.frame},s=o;e.setPointerCapture(t.pointerId);let l=p=>Math.round(p*1e3)/1e3,d=p=>{if(p.pointerId!==t.pointerId)return;let m=En(e,p),y=(m.x-r.x)/n.width,b=(m.y-r.y)/n.height,x;if(!i.handle)x=po({...o,x:l(o.x+y),y:l(o.y+b)});else{let{x:$,y:S,width:w,height:C}=o,N=o.x+o.width,z=o.y+o.height;i.handle.includes("e")&&(w=Math.max(.04,o.width+y)),i.handle.includes("s")&&(C=Math.max(.04,o.height+b)),i.handle.includes("w")&&(w=Math.max(.04,o.width-y),$=N-w),i.handle.includes("n")&&(C=Math.max(.04,o.height-b),S=z-C),x={...o,x:l($),y:l(S),width:l(w),height:l(C)}}s=x,a.onFrame(i.elementId,x,!1)},c=p=>{p.pointerId===t.pointerId&&(u(),a.onFrame(i.elementId,s,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}function Td(e,n,t,i,a){let r=En(e,t),o=i;e.setPointerCapture(t.pointerId);let s=p=>Math.round(p*1e3)/1e3,l=p=>Math.min(1,Math.max(0,p)),d=p=>{if(p.pointerId!==t.pointerId)return;let m=En(e,p),y=n.w>0?l(i.x+(m.x-r.x)/n.w):i.x,b=n.h>0?l(i.y+(m.y-r.y)/n.h):i.y;o={x:s(y),y:s(b)},a(o.x,o.y,!1)},c=p=>{p.pointerId===t.pointerId&&(u(),a(o.x,o.y,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}function Ed(e,n,t,i,a){let r=En(e,n),o=1;e.setPointerCapture(n.pointerId);let s=c=>{if(c.pointerId!==n.pointerId)return;let u=En(e,c),p=(u.x-r.x)*(t.includes("e")?1:-1),m=(u.y-r.y)*(t.includes("s")?1:-1),y=i.w>0?(i.w+p)/i.w:1,b=i.h>0?(i.h+m)/i.h:1,x=Math.abs(y-1)>=Math.abs(b-1)?y:b;o=Math.max(.05,x),a(o,!1)},l=c=>{c.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}var Md="sun.sun";function Fd(e){let n=e?.[Md],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:Md,displayName:t||"Sun",domain:"sun"}}var Rd=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],Th=[0,1,2,3,4];function Id(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function mo(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var Ad=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function Eh(e){return[Hd(e,"below_horizon")]}function Mh(e){return[Hd(e,"above_horizon")]}function Hd(e,n){return{id:Y(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:H(n)}}}function Fh(e,n=0){return[{id:Y(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:H(String(n))}}]}function Rh(e=Th){return[{id:Y(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:mo(e)}}]}function Ih(e="22:00",n="06:00"){return[{id:Y(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:H(e),upper:H(n)}}]}function Ld(e,n){switch(e){case"afterSunset":return Eh(n);case"daytime":return Mh(n);case"sunElevation":return Fh(n);case"weekday":return Rh();case"timeBetween":return Ih()}}function fo(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function fi(e){for(let n of e)delete n.partId}function _d(e,n=Y()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==ae&&(t.bandAboveColorHex=e.bandAboveColorHex)),fo(e),e.parts=[t],e.value=Qn(e.parts),n}function fa(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,fi(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),fo(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,fi(e.rules),{ok:!0,joined:!1,moved:r}}let i=go(t,n);return i.ok?(e.value=i.value,fo(e),delete e.parts,fi(e.rules),{ok:!0,joined:!0}):i}function hi(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function mi(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function Ah(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=Re(i)?s.format:i,t=s}let a={kind:t.kind};return Re(i)||(a.format=i),a}function Hh(e,n){let t=Ah(e,n);if(!t)return{blocked:"kind"};let i=un(t);if(i!==void 0)return mi(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${hi(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let c=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(c&&u)return mi(r.prefix??"")+a.value+mi(r.suffix??"");c?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let c=li(a);if(c===void 0)return{blocked:"kind"};s=c;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let c=`(${s} | float(0))`;r.multiply!==void 0&&(c=`(${c} * ${r.multiply})`),r.offset!==void 0&&(c=`(${c} + ${r.offset})`),s=r.decimals!==void 0?`${hi(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${c})`:c}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${hi(l)}, 'unit_of_measurement') %}`);let d="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let c=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[hi(r.prefix)]:[],`(${s})`,...l!==void 0?[d]:[],...r.suffix?[hi(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${c} }}`}return o+mi(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${d} }}`:"")+mi(r.suffix??"")}function go(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:Qn(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=Hh(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}function Lh(e){switch(e){case"light":return v`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return v`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return v`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return v`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return v`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return v`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return v`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return v`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return v`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return v`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return v`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return v`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return v`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return v`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return v`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return v`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return v`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return v`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return v`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return v`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return v`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return v`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return v`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return v`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return v`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return v`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return v`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return v`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return v`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function yo(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Lh(e)}</svg>`}var _h={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Pd(e){let n=_h[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var Ph=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function bo(e){return Ph.has(e.trim().toLowerCase())}var Io=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function he(e){return n=>e(n.target.value)}function Ao(e){if(e===void 0||e.atDefault)return f;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function He(e,n,t){let i=Ao(n),a=[i===f?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?f:a} title=${t?"Drag left or right to change":f}
    @pointerdown=${t??f}>${e}${i}</span>`}var Ia="wa-scrub-start",Aa="wa-scrub-end";function Ha(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;if(a.closest(".field")?.querySelector("input[type=number]")?.disabled)return;i.preventDefault();let r=e!==void 0&&Number.isFinite(e)?e:Math.max(0,t.min??0),o=t.step??(Number.isInteger(r)?1:.1),s=(String(o).split(".")[1]??"").length,l=i.clientX,d=!1,c=r,u=m=>{let y=m.clientX-l;if(!d&&Math.abs(y)<3)return;d=!0;let b=r+Math.round(y/3)*o;t.min!==void 0&&(b=Math.max(t.min,b)),t.max!==void 0&&(b=Math.min(t.max,b)),b=Number(b.toFixed(s)),b!==c&&(c=b,n(b))},p=()=>{if(a.removeEventListener("pointermove",u),a.removeEventListener("pointerup",p),a.removeEventListener("pointercancel",p),a.dispatchEvent(new CustomEvent(Aa,{bubbles:!0,composed:!0})),!d)return;let m=y=>{y.preventDefault(),y.stopPropagation()};a.addEventListener("click",m,{capture:!0,once:!0}),setTimeout(()=>a.removeEventListener("click",m,{capture:!0}),0)};a.setPointerCapture(i.pointerId),a.addEventListener("pointermove",u),a.addEventListener("pointerup",p),a.addEventListener("pointercancel",p),a.dispatchEvent(new CustomEvent(Ia,{bubbles:!0,composed:!0}))}}function It(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function ge(e,n,t,i={}){return h`<label class="field">${He(e,It(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${he(t)} /></label>`}function ic(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${he(t)}></textarea></label>`}function se(e,n,t,i={}){return h`<label class="field num">${He(e,It(n,i.def,t),Ha(n,t,i))}${La(n,t,i)}</label>`}function La(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??f} max=${t.max??f}
      aria-label=${t.ariaLabel??f} placeholder=${t.placeholder??f}
      @input=${he(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?f:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?f:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function ze(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${He(e,It(n,a.def,i,r))}
    <select @change=${he(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function J(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${He(e,It(n,a.def,o=>i(o,null),r))}
    ${Sa(e,n,t,i,a)}</div>`}function Sa(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??f} ?disabled=${a.disabled?.[r]===!0}
        @click=${d=>{r!==n&&i(r,d.currentTarget)}}>${o}</button>`})}
    </div>`}function zh(e,n){let t=i=>It(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${He(e.label,t(e))}
    <div class="pair-row">
      ${Sa(e.label,e.value,e.options,e.set,e)}
      ${He(n.label,t(n))}
      ${Sa(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function xi(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${He(e,It(n,i.def,t,a),Ha(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?f:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${he(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${La(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function Ne(e,n,t,i,a={}){return h`<label class="field check">${He(e,It(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function de(e,n,t,i=!1,a){let{rgb:r,alpha:o}=ac(n),s=a===void 0?void 0:{atDefault:Ho(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${He(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${d=>t(d.target.checked?So(r,o):void 0)} />`:f}
      ${To(e,n,t,l)}
    </div></div>`}function ac(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function So(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function To(e,n,t,i=!1){let{valid:a,swatch:r,rgb:o,alpha:s}=ac(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!a?"transparent":r}`} title="Pick a colour">
        <input type="color" .value=${o} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${he(l=>t(So(l,s)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder="#RRGGBB" spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${he(l=>{let d=l.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(d)&&t(d.startsWith("#")?d.toUpperCase():`#${d.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(s)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          @input=${he(l=>{let d=Number(l);l.trim()!==""&&d>=0&&d<=100&&t(So(o,Math.round(d)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function Ho(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function _a(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function Nh(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function zd(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var rc=50;function Oh(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function Dh(e,n,t=rc,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;d===a?p=0:d.startsWith(a)?p=1:c.startsWith(a)?p=2:d.includes(a)?p=3:c.includes(a)?p=4:o.length>1&&o.every(m=>d.includes(m)||c.includes(m))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(m=>d.includes(m)||c.includes(m)||u.includes(m)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var Vh=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function oc(e){return Vh.test(e.trim())}function Bh(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return _a(t,i);if(oc(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var tn=new Map;function $e(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function Lo(e){return tn.has(e)}function tt(e,n,t,i,a,r={}){let o=e.hass.states,s=tn.get(a),l=s?Dh(Nh(o,r.domain,zd(e.hass)),s.query,rc,r.preferNumeric?Oh:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=t.entityId?o[t.entityId]:void 0,u=(w,C,N=0)=>{tn.set(a,{query:C,index:N}),$e(w)},p=w=>{tn.delete(a),$e(w)},m=w=>{let C=Bh(w,t,o);C&&i(C)},y=(w,C)=>{i(_a(o,w.entityId)),p(C)},b=()=>Math.max(0,Math.min(tn.get(a)?.index??0,l.length-1)),x=w=>{let C=w.target;if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault();let N=tn.get(a);if(!N){u(C,C.value);return}let z=w.key==="ArrowDown"?b()+1:b()-1;u(C,N.query,Math.max(0,Math.min(l.length-1,z))),Uh(C);return}if(w.key==="Enter"){w.preventDefault();let N=l[b()];s&&N?y(N,C):(m(C.value),p(C));return}if(w.key==="Escape"){if(!s)return;w.preventDefault(),w.stopPropagation(),p(C)}},$=t.entityId?zd(e.hass)?.(t.entityId):void 0,S=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:c?h`<div class="entity-current">
          <span class="ent-ico ${bo(c.state)?"on":""}">${yo(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${$?h`<span class="ent-area">${$}</span>`:f}
          <span class="ent-state">${c.state}</span>
        </div>`:h`<div class="hint warn">Not in Home Assistant right now.</div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${D("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${w=>{let C=w.target;u(C,t.entityId),C.select()}}
        @input=${w=>{let C=w.target;u(C,C.value)}}
        @keydown=${x}
        @blur=${w=>{let C=w.target;s&&m(C.value),p(C)}} />
      ${(s?s.query:t.entityId)===""?f:h`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${w=>w.preventDefault()}
        @click=${w=>{let C=w.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),tn.set(a,{query:"",index:0}),$e(C),C?.focus()}}>${D("close")}</button>`}
    </div>
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${oc(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((w,C)=>h`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${N=>N.preventDefault()} @click=${N=>y(w,N.target)}>
                <span class="ent-ico ${bo(w.state)?"on":""}">${yo(w.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${w.name}</span>
                  <span class="ent-sub">
                    ${w.area?h`<span class="ent-area">${w.area}</span>`:f}
                    <span class="ent-id mono">${w.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Pd(w.domain)}</span>
                  <span class="ent-state">${w.state}</span>
                </span>
              </button>`)}
        </div>`:S}
  </div>`}function Uh(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Nd=120;function Gh(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(da.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(ca),fromPack:!1}}function Od(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function Kh(e){return[{value:"",label:`Starter set (${Od(ca,e)})`},...da.map(n=>({value:n.name,label:`${n.name} (${Od(n.symbols,e)})`}))]}function Wh(e){return e.length>0?e.length:ca.length}function Dd(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function ga(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function sc(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),d=l??[],c=new Set(d),u=n.trim(),p=u.startsWith(Ie),m=a!==void 0,y=m?r.pack(i)??(p?"mdi":"sf"):"sf",b=jh(u,c),x=w=>{t(w),a?.(w.startsWith(Ie)?e.icons.mdiPath?.(w):void 0),r.noteUsed(w)},$=w=>{if(t(w),!m)return;let C=w.trim();a?.(C.startsWith(Ie)?e.icons.mdiPath?.(C):void 0)},S=f;if(o&&y==="mdi"){let w=e.icons.mdiNames?.(),C=qh(w??[],s),N=C.slice(0,Nd),z=r.recent.filter(U=>U.startsWith(Ie));S=h`<div class="sym-browse">
      ${Vd(r,i,y)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${he(U=>r.setQuery(i,U))} />
      </div>
      ${z.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${z.map(U=>ga(e,U,U===u,x))}</div>`}
      <div class="sym-grid">${N.map(U=>ga(e,U,U===u,x))}</div>
      ${w===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:C.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${Dd(N.length,C.length,!0,w.length)}</div>`}
      ${w!==void 0&&p&&!w.includes(u)?h`<div class="hint warn">There is no <code>${u}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:f}
    </div>`}else if(o){let w=r.category(i),C=Gh(w,s,d,c),N=io(C.names,s),z=C.fromPack?N.slice(0,Nd):N,U=r.recent.filter(T=>!T.startsWith(Ie)),ne=c.size===0?U:U.filter(T=>c.has(T));S=h`<div class="sym-browse">
      ${m?Vd(r,i,y):f}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${he(T=>r.setQuery(i,T))} />
        <select @change=${he(T=>r.setCategory(i,T))}>
          ${Kh(c).map(T=>h`<option value=${T.value} ?selected=${T.value===w}>${T.label}</option>`)}
        </select>
      </div>
      ${ne.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${ne.map(T=>ga(e,T,T===u,x))}</div>`}
      <div class="sym-grid">${z.map(T=>ga(e,T,T===u,x))}</div>
      ${N.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${Dd(z.length,N.length,s.trim()!=="",Wh(d))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${he($)} @change=${he(w=>{let C=w.trim();C.startsWith(Ie)?e.icons.mdiPath?.(C)!==void 0&&r.noteUsed(w):(c.size===0||c.has(C))&&r.noteUsed(w)})} /></label>
    ${b?h`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${S}`}function jh(e,n){let t=e.trim();return t!==""&&!t.startsWith(Ie)&&n.size>0&&!n.has(t)}function qh(e,n){let t=n.trim(),i=t.startsWith(Ie)?t.slice(Ie.length):t,a=e.map(r=>r.startsWith(Ie)?r.slice(Ie.length):r);return io(a,i).map(r=>Ie+r)}function Vd(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var Yh=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],Jh=[["bars","Bars"],["line","Line"],["area","Area"]],Xh=[["auto","Auto"],["fixed","Fixed range"]],Zh=[["lowest","Lowest value"],["zero","Zero"]],_o=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Bd=[["none","None"],["dot","Dot"],["triangle","Triangle"]],Eo=[["uniform","One colour"],["bands","By value"]];function Ta(e){let n=[cr,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:Y(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:Y(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function Qh(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function em(e,n){let t=St({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:Y(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function tm(e,n){let t=[...e].sort((l,d)=>l-d),i=t[0],a=t.at(-1),r=n!==void 0&&Number.isFinite(n)?n:void 0,o=(r??0)-1,s=(r??0)+1;if(i!==void 0&&a!==void 0){let l=(t.length>1?(a-i)/(t.length-1):Math.abs(i)/2)||1;o=i-l,s=a+l}return r!==void 0&&(o=Math.min(o,r),s=Math.max(s,r)),{lo:o,hi:s}}function nm(e,n,t){let{lo:i,hi:a}=tm(e.map(l=>l.upTo),t),r=l=>Math.max(0,Math.min(100,(l-i)/(a-i)*100)),o=i,s=e.map(l=>{let d=Math.max(0,r(l.upTo)-r(o));return o=Math.max(o,l.upTo),h`<i style=${`width:${d}%;background:${l.colorHex}`}></i>`});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${s}<i style=${`flex:1 1 auto;background:${n}`}></i></div>
    ${t===void 0?f:h`<span class="now" style=${`left:${r(t)}%`} title=${`Now ${t}`}></span>`}
  </div>`}function Ea(e,n,t,i){let a=St({bands:e.bands}),r=i!==void 0&&Number.isFinite(i)?i:void 0,o=r===void 0?void 0:a.find(c=>r<=c.upTo)?.id??"above",s=(c,u)=>p=>{let m=p.bands.find(y=>y.id===c);m&&u(m)},l=e.bandAboveColorHex,d={atDefault:Ho(l,ae),title:`Back to ${ae}`,reset:()=>t(c=>{c.bandAboveColorHex=ae})};return h`<div class="bands">
    ${nm(a,l,r)}
    ${a.map(c=>h`
      <div class="band-row ${o===c.id?"hit":""}">
        <span class="le" aria-hidden="true">≤</span>
        <input type="number" class="band-up" step="any" .value=${String(c.upTo)} aria-label="Up to"
          title="This colour runs up to and including this number"
          @change=${he(u=>{let p=Number(u);u.trim()!==""&&Number.isFinite(p)&&t(s(c.id,m=>{m.upTo=p}))})} />
        ${To(`Up to ${c.upTo}`,c.colorHex,u=>t(s(c.id,p=>{p.colorHex=u??"#FFFFFF"}),`bcol${c.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(u=>{u.bands=u.bands.filter(p=>p.id!==c.id)})}>${D("close")}</button>
      </div>`)}
    <div class="band-row ${o==="above"?"hit":""}">${Ao(d)}
      <span class="le" aria-hidden="true">&gt;</span>
      <span class="else">Above</span>
      ${To("Above the last band",l,c=>t(u=>{u.bandAboveColorHex=c??ae},"babove"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(c=>{c.bands=[...c.bands,em(c.bands,n)]})}>+ Band</button>
  </div>`}function im(e,n,t,i){let a=new Map,r=new Map,o=(d,c)=>{let u=d.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+c)};e.forEach((d,c)=>{let u=e[c+1],p=u===void 0?n:u.offsetSeconds;o(d.state,Math.max(0,p-d.offsetSeconds))}),t!==void 0&&o(t,0),(kr[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,c)=>c[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function am(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${ge("State",o.match,l=>n(d=>{let c=d.bands[s];c&&(c.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${de("Colour",o.colorHex,l=>n(d=>{let c=d.bands[s];c&&(c.colorHex=l??Tt)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((d,c)=>c!==s)})}>${D("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:Y(),match:r,colorHex:Ii(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${de("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??Tt},"tother"),!1,Tt)}`}var rm=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"]],om={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled"};function Ud(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return H(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var sm=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function lm(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function le(e,n,t,i){if(i.inline||!dm())return h`<div class="value-editor">${uc(e,n,t,i)}</div>`;let a=Pa(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=Ce(n,me(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?f:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?f:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${lc(e,a,r,n,t,i)}
  </div>`}function lc(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${cc}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${vi.has(n)?uc(e,i,a,r):f}
  </div>`}function me(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Pa(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function dm(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var vi=new Set,gi=new WeakMap;function cm(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function dc(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function cc(e){let n=e.currentTarget,t=e.newState==="open",i=gi.get(n);if(i&&(i(),gi.delete(n)),!t){vi.delete(n.id)&&$e(n);return}let a=cm(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){gi.get(n)?.(),gi.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}xo(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),gi.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),xo(n,a.getBoundingClientRect()),vi.has(n.id)||(vi.add(n.id),$e(n),requestAnimationFrame(()=>{n.isConnected&&xo(n,a.getBoundingClientRect())}))}function xo(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=um({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var en=8,ya=6,Gd=140;function um(e,n,t){let i=t.height-e.bottom-ya-en,a=e.top-ya-en,r=n.height>i&&a>i&&i<Gd,o=Math.max(Gd,r?a:i),s=Math.min(n.height,o),l=Math.max(en,Math.min(e.left,t.width-n.width-en)),d=r?Math.max(en,e.top-ya-s):Math.max(en,Math.min(e.bottom+ya,t.height-s-en));return{left:l,top:d,maxHeight:o,above:r}}function uc(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,s=Yh.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=f;switch(a.kind){case"literal":l=i.symbol?sc(e,a.value,c=>r({...a,value:c}),o,i.setSymbolPath):ge("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=tt(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${tt(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${ge("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${c.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=hm(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=ze("Field",a.timeField,sm,c=>r({...a,timeField:c}));break;case"dataAge":l=h`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":l=h`${ic("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":l=e.config.values.length===0?h`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:ze("Value",a.id,[["","(choose)"],...e.config.values.map(c=>[c.id,c.name||c.id.slice(0,8)])],c=>r({...a,id:c}));break;case"chartStat":{let c=me(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${ze("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Oe(p,c)])],p=>r({...a,layer:p}))}
          ${ze("Number",a.stat,[...cn],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(n):void 0;return h`
    ${ze("Source",a.kind,s,c=>r(lm(a,c)))}
    ${l}
    ${i.noFormat?f:pm(n.format,c=>t(Re(c)?{kind:n.kind}:{...n,format:c}))}
    ${i.showResolved?h`<div class="hint keep">Now:${d===void 0?h`<span class="warn">unresolved</span>`:h`<code>${d}</code>`}</div>`:f}`}function pm(e,n){let t=e??{},i=a=>{let r={...t,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];n(r)};return h`<details class="sub" ?open=${!Re(e)}>
    <summary>Format${Re(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${se("Decimals",t.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${se("Multiply",t.multiply,a=>i({multiply:a}),{optional:!0})}
      ${se("Offset",t.offset,a=>i({offset:a}),{optional:!0})}
      ${J("Case",t.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${ge("Prefix",t.prefix??"",a=>i({prefix:a}))}
      ${ge("Suffix",t.suffix??"",a=>i({suffix:a}))}
    </div>
    ${Ne("Add unit",!!t.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${J("Seconds as",t.duration?"duration":t.relativeTime?"relativeTime":"",[["","None"],["relativeTime","Time ago"],["duration","Duration"]],a=>i({relativeTime:a==="relativeTime",duration:a==="duration"}),{titles:{relativeTime:"45s, 2m, 3h",duration:"1h 23m, 45s"}})}
  </details>`}function hm(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return h`
    ${ze("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${J("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?h`<div class="grid2">
          ${ge("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${ge("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${ge("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${ge("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:h`${o.entities.map((s,l)=>h`<div class="row-inline">
            ${tt(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${D("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${ze("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?ge("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):f}
    ${n.function==="count"?f:ge("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var pc=Tr,mm=pc.filter(([e])=>e!=="none");function fm(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function hc(e,n){let t=fm(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return Zs(e)?{type:e,...t}:{type:e}}var gm=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function mc(e,n,t,i){let a=n.serviceDataJSON??"",r=Qs(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${ge("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${ge("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${gm.map(([s,l,d,c])=>h`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:d};c===""?delete u.serviceDataJSON:u.serviceDataJSON=c,t(u)}}>${s}</button>`)}
    </div>
    ${tt(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${ic("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function ym(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function fc(e){let n=e.config,t=n.tapAction,i=ym(e.savedName,n.name),a=n.refreshMinutes??0,r=Kd.map(s=>[String(s),Wd(s)]);Kd.includes(a)||r.push([String(a),Wd(a)]);let o=n.showSuccessFlash??!0;return h`
    <div class="gen-row">
      ${ge("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${ze("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${ze("Tap action",t.type,pc,s=>e.update(l=>{l.tapAction=hc(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??bm).slice(0,7)}
                @input=${he(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in t?tt(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):f}
    ${t.type==="callService"?mc(e,t,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):f}
    ${t.type==="openPage"?xm(e):f}`}var bm="#808080",Kd=[0,15,30,60,120];function Wd(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function xm(e){let n=e.config;return gc(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function gc(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${ze("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?f:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}function yc(e,n){let t=e.config.values.findIndex(a=>a.id===n.id),i=`nv-${n.id}`;return h`
    ${ge("Name",n.name,a=>e.update(r=>{r.values[t].name=a},`${i}-name`))}
    ${le(e,n.value,a=>e.update(r=>{r.values[t].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${jd(e.config,n.id)} layer${jd(e.config,n.id)===1?"":"s"}</span></div>`}function jd(e,n){return JSON.stringify(e.elements).split(`"${n}"`).length-1+JSON.stringify(e.perFamily).split(`"${n}"`).length-1}function bc(){return{id:Y(),name:"Value",value:H("")}}function Ee(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function Te(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=Ee(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete d.size,o.placements[t]=d}function ba(e,n,t,i,a){let r=n.payload.id,o=Ui(n)??a.min,s=Ee(e.config,t,n).size??o;return se(i,s,l=>e.update(d=>Te(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function xc(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=ct()),a=Ye(e,n).filter(l=>!pe(e,l));if(a.length===0)return;let r=vn(e,a.map(l=>l.payload.id),n),o=Vt(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let d=e.elements.find(m=>m.payload.id===l);if(!d)continue;let c=s?.placements[l],u=c?.size??Ui(d),p={frame:{...c?.frame??d.payload.frame},isHidden:c?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let m of ie)m!==t&&delete e.perFamily[m]?.placements[l];i.placements[l]=Rr(p,n,t,d.kind)}wn(e,t)}function za(e,n){return gl(e,n)}function vm(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function wm(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"?void 0:e.payload.colorSlot.baseColorHex}function vc(e,n,t){let i=vm(t.map(l=>Ee(e,n,l).isHidden)),a=t.map(wm),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var Mn=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],km=[["leading","Left"],["center","Center"],["trailing","Right"]],$m=[["1","1"],["2","2"]];function wc(e,n,t){let i=n.payload.id,a=Wi(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:qd(n)},l=d=>{let c=e.hass.states[d]?.attributes?.device_class;return typeof c=="string"?c:void 0};return h`
    ${tt(e,o?"Camera":"Entity",r,d=>e.update(c=>yl(c,i,d,l(d.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${qd(n)?"warn":""}">${Sm(n,a)}</div>`}function qd(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.entity.entityId==="":!1}function Cm(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Na(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Sm(e,n){let t=Cm(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Na(o)}.${r}`}function Tm(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Em(e,n){let t=e.timestamp===!0,i=ot(e),a=r=>n(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(ot(o)&&(o.timestampCorner=Cr(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return h`
    ${Ne("Timestamp",t,r=>n(o=>{r?o.timestamp=!0:delete o.timestamp}),!1)}
    ${t?h`
      ${J("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?f:J("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>n(o=>{o.timestampCorner=r}))}
      ${se("Text size",e.timestampSize,r=>n(o=>{o.timestampSize=Math.min(40,Math.max(4,r??gn))},"tssize"),{step:1,min:4,max:40,def:gn,unit:"pt"})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function Ma(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>Ma(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>Ma(e[a],n[a]))}function Yd(e,n,t){return t.some(i=>!Ma(e[i],n[i]))}function vo(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function ye(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),d=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},c=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${D(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${Ao(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:f}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${c} aria-label=${c}
        @click=${p=>{p.stopPropagation(),d()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${D("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:f}
  </section>`}function Mm(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Fm(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function Rm(e,n){let t=xe[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function Im(e,n,t){let i=Rm(e,n),a=xe[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${J("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function Am(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function Hm(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,d=Math.max(0,l-s.offsetSeconds),c=i[i.length-1];c!==void 0&&c.state.trim().toLowerCase()===s.state.trim().toLowerCase()?c.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${Fm(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function Fn(e,n=Ut){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}var Ca=new Set;function Mo(e,n,t=Ut){return Ca.has(e)||!t.some(i=>i.minutes===n)}function wo(e,n,t,i,a=Ut){let r=Mo(e,n,a);return h`<label class="field">${He("Span",{atDefault:n===t&&!r,title:`Back to ${Fn(t,a)}`,reset:()=>{Ca.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(Ca.add(e),$e(o.target)):(Ca.delete(e),i(Number(s)||zi))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function ko(e,n,t=!1){let i=t?pr:Ni,a=Math.floor(i/1440),r=t?ei:Ut,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,d=(c,u,p)=>n(Math.min(i,Math.max(1,Math.round(c)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${se("Days",o,c=>d(c??0,s,l),{step:1,min:0,max:a})}
      ${se("Hours",s,c=>d(o,c??0,l),{step:1,min:0,max:23})}
      ${se("Minutes",l,c=>d(o,s,c??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${Fn(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${Fn(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function Lm(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${Fn(e.historyMinutes)}`;let n=Li.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${Fn(e.historyMinutes,ei)} \xB7 per ${n.toLowerCase()}`}function Po(e,n){let t=me(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return rt(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:Ge(Ce(n.payload.value,t),48)}case"icon":return Ge(Ce(n.payload.symbol,t),48);case"gauge":return Ge(Ce(n.payload.value,t),48);case"chart":return Ge(`${Ce(n.payload.value,t)}${Lm(n.payload)}`,48);case"timeline":return Ge(`${Ce(n.payload.value,t)} \xB7 ${Fn(qe(n.payload))}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return st(n.payload.action)}}function Fa(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Ae(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Ae(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":Ae(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:Ae(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${_o.find(([n])=>n===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${Ae(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Ae(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Ae(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function xa(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${Ha(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      @input=${he(l=>{let d=Number(l);l.trim()!==""&&Number.isFinite(d)&&s(d)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function _m(e,n,t){let i=n.payload.id,a=`el-${i}`,r=Ee(e.config,t,n),o=r.frame,s=(d,c)=>e.update(u=>Te(u,t,i,{frame:uo(o,d)}),`${a}-${c}-${t}`),l=!Ma(o,Zn)||r.isHidden;return ye(e,"placement","Position",h`
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${xa("X","Left",o.x,d=>s({x:d},"x"),-100,100)}
        ${xa("Y","Top",o.y,d=>s({y:d},"y"),-100,100)}
      </div>
    </div>
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${xa("W","Width",o.width,d=>s({width:d},"w"),4,200)}
        ${xa("H","Height",o.height,d=>s({height:d},"h"),4,200)}
      </div>
    </div>
    ${xi("Rotation",o.rotationDegrees,d=>s({rotationDegrees:d},"rot"),{min:-180,max:180,step:1,def:0,format:d=>`${Math.round(d)}\xB0`,unit:"\xB0",range:!1})}
    ${Ne("Hidden",r.isHidden,d=>e.update(c=>Te(c,t,i,{isHidden:d})),!1)}
    <div class="hint">X, Y, W and H are a percent of the face, on the ${Q(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.</div>`,{color:te.place,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${Q(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${Q(t)} face at half size, unrotated and shown`,reset:()=>e.update(d=>Te(d,t,i,{frame:{...Zn},isHidden:!1}))}:{}})}function Pm(e,n){if(n.kind==="tap")return f;let t=n.payload.id,i=Pe(e.config,t)[0];return ye(e,"tappable","Tap",lf(e,n,`el-${t}`),{color:te.tap,icon:"tap",summary:i?st(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>Ki(a,t))}:{}})}function Jd(e,n,t,i,a){return h`
    ${xi("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(ii,Math.round(r)))},`${i}count`),{min:0,max:ii,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?f:h`
      <div class="grid2">
        ${se("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(ri,Math.max(ai,r??$t))},`${i}size`),{step:.5,min:ai,max:ri,def:t.labelSize,unit:"pt"})}
        ${de("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??Ct},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${J("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      ${J("Clock",e.hourCycle,js,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${J("Minutes",e.minutes,qs,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}`}`}var zm=[["number","Number"],["entity","Entity"]];function Nm(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function Om(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function Dm(e,n,t,i,a){let r=o=>{let s=o==="min",l=s?"Min":"Max",d=Nm(n,o),c=s?n.minValue:n.maxValue,u=b=>a(x=>{s?x.minValue=b??0:x.maxValue=b??100},o),p={number:`${l} is a fixed number`,entity:`${l} reads a number from an entity`},m=h`<div class="gauge-end-head">
      ${He(l,d==="number"?It(c,t[o],u):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${l} comes from`}>
        ${zm.map(([b,x])=>h`<button type="button" role="radio" aria-checked=${b===d?"true":"false"}
          class=${b===d?"on":""} title=${p[b]}
          @click=${()=>{b!==d&&a($=>Om($,o,b))}}>${x}</button>`)}
      </span>
    </div>`,y=s?n.minSource:n.maxSource;return d==="number"||y===void 0?h`<div class="field gauge-end">${m}${La(c,u,{ariaLabel:l})}</div>`:h`<div class="field gauge-end">${m}${le(e,y,b=>a(x=>{s?x.minSource=b:x.maxSource=b},`${o}src`),{showResolved:!0,noLabel:!0,label:l,key:`${i}-${o}source`})}</div>
      <div class="hint">If the entity has no number, the gauge uses ${String(c)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${r("min")}${r("max")}</div>`:h`${r("min")}${r("max")}`}function Vm(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(c,u)=>t(p=>{let m={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??ae};c(m),m.bands.length>0?p.bands=m.bands:delete p.bands,m.bandAboveColorHex!==ae?p.bandAboveColorHex=m.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(c,u,p)=>t(m=>{p===void 0||p===u?delete m[c]:m[c]=p},c),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",d=a==="bands"?Xe(e.resolve(n.value)??""):[];return h`
    ${J("Colour",a,Eo,c=>t(u=>{if(c==="uniform"){delete u.coloring;return}u.coloring=c,(u.bands?.length??0)===0&&(u.bands=Ta(Xe(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${Ea({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??ae},n.colorSlot.baseColorHex,o,d.length===1?d[0]:void 0)}`:f}
    ${J("Highlight",r,_o,c=>t(u=>{c==="none"?delete u.highlight:u.highlight=c}),{def:"none"})}
    ${r==="none"?f:h`
      <div class="grid2">
        ${r==="lowest"?f:de("Highest colour",n.highColorHex??Le,c=>s("highColorHex",Le,c),!1,Le)}
        ${r==="highest"?f:de("Lowest colour",n.lowColorHex??_e,c=>s("lowColorHex",_e,c),!1,_e)}
      </div>
      ${a==="bands"?f:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}`}var bi=new Map,yi=new Map,mt=new Map,va=new Map,$o=4,Co=40,Bm=[["layer","Layer"],["pick","Pick"],["bands","By value"]],Um=[["plain","Plain"],["rich","Rich"],["countdown","Countdown"]],Gm={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size",countdown:"Ticks down to a time"};function Km(e){return e.countdown===!0?"countdown":rt(e)?"rich":"plain"}function Wm(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function jm(e,n){let t=un(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:Ge(e.kind.value,40)||"template"}:{kind:"value",label:Oa(e,n)}}function kc(e,n,t){let i=un(e.value),a=i===void 0?Ge(Oa(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${Ge(i,24)}"`;return`Part ${n+1}: ${a}`}function qm(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,kc(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function Fo(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function Ym(e,n){if(Fo(e)==="bands"&&(e.bands?.length??0)>0){let t=[...St({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??ae],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function Xd(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${Na(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var Jm={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function Xm(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${Na(e.moved.map(n=>Jm[n]))} moved into Look.`}function Zm(e,n,t,i,a){let r=n.payload,o=r.id,s=Km(r),l=(r.parts?.length??0)>0,d=Er(e.config,r.value),c=mt.get(o),u=c&&c.rich===l?c:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?yi.get(o):void 0,m=(x,$)=>{let S=!(r.parts??[]).every(C=>C.value.kind.kind==="literal"),w=fa(structuredClone(r),e.config.values);if(yi.delete(o),!w.ok){mt.set(o,{text:Xd(w.blocked),rich:!0,warn:!0}),$e($);return}mt.set(o,{text:Xm(w.joined?{joined:!0,template:S}:w),rich:!1}),i(C=>{fa(C,e.config.values),x==="countdown"&&(C.countdown=!0)})},y=(x,$)=>{if(yi.delete(o),s==="rich"){let S=x==="countdown"?"countdown":"plain",w=r.parts??[];if(w.length<2){m(S,$);return}let C=go(w,e.config.values);C.ok?(mt.delete(o),yi.set(o,S)):mt.set(o,{text:Xd(C.blocked),rich:!0,warn:!0}),$e($);return}if(x==="rich"){let S=r.parts?.[0]?.id??Y();bi.set(o,S),mt.delete(o),i(w=>{delete w.countdown,_d(w,S)});return}mt.delete(o),i(S=>{if(x==="countdown"){S.countdown=!0;return}(S.parts?.length??0)>0&&fa(S,e.config.values),delete S.countdown})},b=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${J("Type",s,Um,y,{titles:Gm})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size. Countdown ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${p===void 0?f:h`<div class="rich-confirm" role="alertdialog" aria-label=${b}>
        <b>${b}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(x=>x.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${x=>m(p,x.currentTarget)}>Switch</button>
          <button class="small" @click=${x=>{yi.delete(o),$e(x.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:f}
    ${s==="rich"?Qm(e,n,t,i,a):h`
        ${wc(e,n,a)}
        ${le(e,r.value,x=>i($=>{$.value=x},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${d?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(d.payload.id)}>${Oe(d,me(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}`}`}function Qm(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=me(e),d=Math.max(0,o.findIndex(F=>F.id===bi.get(s))),c=o[d],u=o.length,p=r.colorSlot.baseColorHex,m=Ee(e.config,t,n).size??r.fontSize,y=(F,B)=>{mt.delete(s),i(g=>{F(g),Ds(g)},B)},b=(F,B)=>y(g=>{let k=g.parts?.find(E=>E.id===c.id);k&&F(k)},B?`part-${c.id}-${B}`:void 0),x=(F,B)=>{bi.set(s,F),mt.delete(s),$e(B)},$=(F,B)=>{let g=Y();bi.set(s,g),y(k=>{(k.parts??=[]).push({id:g,value:F})}),dc(B,Pa(`${a}-part-${g}`),!0)},S=F=>y(B=>{B.parts&&wi(B.parts,d,F)}),w=()=>{let F=o[d+1]??o[d-1];F&&bi.set(s,F.id),y(B=>{B.parts=(B.parts??[]).filter(g=>g.id!==c.id)})},C=o.map((F,B)=>{let g=jm(F.value,l),k=F.id===c.id,E=Fo(F),R=g.kind==="value"?e.resolve(F.value):void 0,O=F.fontWeight===void 0?void 0:Mn.find(([K])=>K===F.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${k?"true":"false"} class="part-chip ${g.kind} ${k?"on":""}"
      aria-label=${kc(F,B,l)} @click=${K=>x(F.id,K.currentTarget)}>
      <span class="part-dot" style=${`background:${Ym(F,p)}`}
        title=${E==="bands"?"By value, with its own bands":E==="pick"?"Its own colour":"The layer colour"}></span>
      ${g.kind==="text"?h`<span class="part-txt">${g.label===""?h`<span class="part-empty">empty</span>`:Wm(g.label).map(K=>K.space?h`<span class="part-sp">${"\xB7".repeat(K.text.length)}</span>`:K.text)}</span>`:h`<span class="part-txt">${g.label}</span>`}
      ${R===void 0?f:h`<span class="part-now">${R}</span>`}
      ${O===void 0?f:h`<span class="part-flag" title="Its own weight">${O}</span>`}
      ${F.fontSize===void 0?f:h`<span class="part-flag" title="Its own font size">${F.fontSize} pt</span>`}
    </button>`}),N=r.rules.some(F=>F.partId===c.id),z=c.value.kind.kind==="literal",U=Fo(c),ne=c.fontSize!==void 0,T=Mn.find(([F])=>F===r.fontWeight)?.[1]??r.fontWeight,V=F=>{F>=$o&&F<=Co&&b(B=>{B.fontSize=F},"size")},X=U==="bands"?Xe(e.resolve(c.value)??""):[],W={layer:"Use the layer colour",...z&&U!=="bands"?{bands:"By value needs a live value"}:{}},be=(F,B)=>b(g=>{let k={bands:g.bands??[],bandAboveColorHex:g.bandAboveColorHex??ae};F(k),k.bands.length>0?g.bands=k.bands:delete g.bands,k.bandAboveColorHex!==ae?g.bandAboveColorHex=k.bandAboveColorHex:delete g.bandAboveColorHex},B);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${C}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${F=>$(H(""),F.currentTarget)}>${D("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${F=>$({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},F.currentTarget)}>${D("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${d+1}</b> of ${u} · ${z?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${d===0} @click=${()=>S(d-1)}>${D("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${d===u-1} @click=${()=>S(d+1)}>${D("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||N}
          title=${u===1?"A rich text layer keeps at least one part":N?"A state changes this part":"Remove this part"}
          @click=${w}>${D("delete")}</button>
      </div>
      ${N&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:f}
      ${le(e,c.value,F=>b(B=>{B.value=F},"value"),{showResolved:!0,label:z?"Text":"Shows",key:`${a}-part-${c.id}`})}
      ${z?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:f}
      ${J("Colour",U,Bm,F=>b(B=>{if(F==="layer"){delete B.colorHex,delete B.coloring;return}if(F==="pick"){delete B.coloring,B.colorHex=Ho(p,"#FFFFFF")?"#64D2FF":p;return}delete B.colorHex,B.coloring="bands",(B.bands?.length??0)===0&&(B.bands=Ta(Xe(e.resolve(B.value)??"")))}),{def:"layer",titles:W,...z&&U!=="bands"?{disabled:{bands:!0}}:{}})}
      ${U==="pick"?de("Part colour",c.colorHex,F=>b(B=>{B.colorHex=F??p},"color")):f}
      ${U==="bands"?h`
        ${Ea({bands:c.bands??[],bandAboveColorHex:c.bandAboveColorHex??ae},c.colorHex??p,be,X.length===1?X[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:f}
      <div class="field seg-field">${He("Weight",c.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${T})`,reset:()=>b(F=>{delete F.fontWeight})})}
        ${Sa("Weight",c.fontWeight,Mn,F=>b(B=>{B.fontWeight=F}),{inherited:r.fontWeight})}
      </div>
      <label class="field num part-size">${He("Font size",ne?{atDefault:!1,title:`Back to the layer size (${m} pt)`,reset:()=>b(F=>{delete F.fontSize})}:void 0,Ha(c.fontSize??m,V,{step:1,min:$o,max:Co}))}
        ${La(c.fontSize,F=>{F===void 0?b(B=>{delete B.fontSize},"size"):V(F)},{step:1,min:$o,max:Co,optional:!0,unit:"pt",placeholder:String(m),ariaLabel:ne?"Part font size":`Part font size, ${m} pt from the layer`,...ne?{}:{lead:D("link")}})}
      </label>
    </div>
  </div>`}function $c(e,n,t,i={}){let a=n.payload.id,r=e.config.elements.findIndex(g=>g.payload.id===a),o=`el-${a}`,s=(g,k)=>e.update(E=>g(E.elements[r]),k?`${o}-${k}`:void 0),l=Ee(e.config,t,n),d=l.frame,c=(g,k)=>e.update(E=>Te(E,t,a,{frame:uo(d,g)}),`${o}-${k}-${t}`),u=je(n.kind).payload,p=u.colorSlot?.baseColorHex??"#FFFFFF",m=g=>u[g],y=!1,b=g=>n.kind==="image"||n.kind==="tap"||n.kind==="timeline"?f:de(g,n.payload.colorSlot.baseColorHex,k=>s(E=>{E.kind!=="image"&&E.kind!=="tap"&&E.kind!=="timeline"&&(E.payload.colorSlot.baseColorHex=k??"#FFFFFF")},"color"),!1,p),x,$;switch(n.kind){case"text":{let g=(k,E)=>s(R=>k(R.payload),E);x=Zm(e,n,t,g,o),y=!n.payload.countdown&&!rt(n.payload),$=h`
        ${ba(e,n,t,"Font size",{step:1,min:4,def:m("fontSize")})}
        ${J("Weight",n.payload.fontWeight,Mn,k=>s(E=>{E.payload.fontWeight=k}),{def:u.fontWeight})}
        ${zh({label:"Align",value:n.payload.alignment??"center",options:km,def:"center",set:k=>s(E=>{let R=E.payload;k==="center"?delete R.alignment:R.alignment=k})},{label:"Lines",value:n.payload.lineLimit===2?"2":"1",options:$m,def:"1",set:k=>s(E=>{let R=E.payload;k==="2"?R.lineLimit=2:delete R.lineLimit})})}
        ${Ne("Mono digits",n.payload.monospacedDigits===!0,k=>s(E=>{let R=E.payload;k?R.monospacedDigits=!0:delete R.monospacedDigits}),u.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:f}
        ${y?Vm(e,n.payload,g,b("Main colour")):f}`;break}case"icon":x=h`
        ${le(e,n.payload.symbol,g=>s(k=>{k.payload.symbol=g},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${o}-symbol`,setSymbolPath:g=>s(k=>{let E=k.payload;g?E.path=g:delete E.path},"symbol")})}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`,$=ba(e,n,t,"Icon size",{step:1,min:4,def:m("size")});break;case"gauge":{let g=n.payload,k=(R,O)=>s(K=>R(K.payload),O),E=g.style==="dots";x=h`
        ${le(e,g.value,R=>k(O=>{O.value=R},"value"),{showResolved:!0,label:"Reading",key:`${o}-value`})}
        ${E?h`
            ${le(e,g.total??Ud(g),R=>k(O=>{O.total=R},"total"),{showResolved:!0,label:"Total",key:`${o}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${_i} dots are drawn.</div>`:Dm(e,g,{min:u.minValue,max:u.maxValue},o,k)}`,y=!0,$=h`
        <div class="grid2">
          ${J("Style",g.style,rm,R=>k(O=>{R==="dots"&&O.total===void 0&&(O.total=Ud(O)),R!=="dots"&&delete O.total,O.style=R}),{titles:om,def:u.style})}
          ${E?f:ba(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        ${de(E?"Empty dot colour":"Track colour",g.trackColorHex,R=>k(O=>{O.trackColorHex=R??"#FFFFFF40"},"track"),!1,u.trackColorHex)}
        ${J("Colour",g.coloring,Eo,R=>k(O=>{O.coloring=R,R==="bands"&&O.bands.length===0&&(O.bands=Ta([O.minValue,O.maxValue]))}),{def:u.coloring})}
        ${b("Main colour")}
        ${g.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${Ea(g,g.colorSlot.baseColorHex,k,Xe(e.resolve(g.value)??"")[0])}`:f}
        ${E?f:h`
          <div class="grid2">
            ${se("Threshold",g.thresholdValue,R=>k(O=>{R===void 0?delete O.thresholdValue:O.thresholdValue=R},"thr"),{optional:!0})}
            ${g.thresholdValue===void 0?f:de("Threshold colour",g.thresholdColorHex,R=>k(O=>{O.thresholdColorHex=R??pn},"thrcol"),!1,pn)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>`}`;break}case"chart":{let g=n.payload,k=(M,_)=>s(on=>M(on.payload),_),E=kt(g),R=lr(u.marker),O=u.historyMinutes,K=u.historyPoints,ee=g.historyMinutes>0,Me=ee&&g.source==="statistics",Ci=ee&&!Me,In=ee?Me?"statistics":"history":"value",An=Me?ei:Ut,we=Gt(g)??Kt(g),ue=g.value.kind.kind==="entityState",nt=we===void 0?void 0:e.historySeries(we),du=ee&&ue?nt??"":e.resolve(g.value)??"",it=g.historyPoints<1,qo=Mo(a,g.historyMinutes,An),Ke=Xe(du),Pt=g.limit>0&&Ke.length>g.limit?g.takeFromEnd?Ke.slice(Ke.length-g.limit):Ke.slice(0,g.limit):Ke,cu=!ee&&ue&&Ke.length===1,Ba=e.config.elements.filter(M=>M.kind==="chart"&&M.payload.id!==a),uu=me(e),Ua=g.scaleFrom!==void 0&&Ba.some(M=>M.payload.id===g.scaleFrom);x=h`
        ${le(e,g.value,M=>k(_=>{_.value=M},"value"),{label:"Readings",key:`${o}-value`})}
        ${J("Draw",In,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],M=>k(_=>{if(M==="value"){_.historyMinutes=0;return}_.source=M==="statistics"?"statistics":"history";let on=_.historyMinutes||zi;_.historyMinutes=M==="statistics"?Math.min(on,pr):Math.min(on,Ni)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:u.historyMinutes>0?"history":"value"})}
        ${Me?h`
            ${ue?f:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${wo(a,g.historyMinutes,O,M=>k(_=>{_.historyMinutes=M}),ei)}
              ${J("Per",g.statPeriod,Li,M=>k(_=>{_.statPeriod=M}),{def:Jn})}
            </div>
            ${qo?ko(g.historyMinutes,M=>k(_=>{_.historyMinutes=M},"span"),!0):f}
            ${J("Read",g.statType,or,M=>k(_=>{_.statType=M}),{def:Xn})}
            <div class="hint">One bar per period, oldest first, newest ${ti} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${g.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:f}
            ${ue&&nt===void 0?h`<div class="hint keep">Reading the statistics…</div>`:f}
            ${ue&&nt===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:f}`:f}
        ${Ci?h`
            ${ue?f:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${wo(a,g.historyMinutes,O,M=>k(_=>{_.historyMinutes=M}))}
              <div class="field readings-field">${He("Points",{atDefault:g.historyPoints===K,title:`Back to ${K<1?"every one":`${K} averaged`}`,reset:()=>k(M=>{M.historyPoints=K})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${it?"false":"true"} class=${it?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{it&&k(M=>{M.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${it?"true":"false"} class=${it?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{it||k(M=>{M.historyPoints=mr})}}>Every one</button>
                  </div>
                  ${it?f:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(g.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${hr} max=${ti}
                      @input=${he(M=>{let _=Number(M);M.trim()!==""&&Number.isFinite(_)&&_>=1&&k(on=>{on.historyPoints=Math.round(_)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${qo?ko(g.historyMinutes,M=>k(_=>{_.historyMinutes=M},"span")):f}
            <div class="hint">${it?h`Every state the recorder holds in that span, oldest first, one reading per change,
                  and a chatty sensor keeps its newest ${ti}. The time axis follows
                  the changes, so a quiet hour draws narrower than a busy one.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${ue&&nt===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
            ${ue&&nt===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:f}
        ${ee?f:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${Ke.length===0&&!(ee&&(!ue||nt===void 0||nt===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${Ke.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${Mm(Pt)}</span>${Ke.length===Pt.length?h` · ${Pt.length} ${Pt.length===1?"value":"values"}`:h` · ${Pt.length} of ${Ke.length}`}</span></div>`:f}
        ${cu?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:f}
        <div class="grid2">
          ${se("Use",g.limit,M=>k(_=>{_.limit=Math.max(0,Math.round(M??0))},"limit"),{step:1,min:0,def:u.limit})}
          ${J("From",g.takeFromEnd?"end":"start",[["start","The first"],["end","The last"]],M=>k(_=>{_.takeFromEnd=M==="end"}),{def:u.takeFromEnd===!0?"end":"start"})}
        </div>
        <div class="hint">${ee?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,y=!0,$=h`
        <div class="grid2">
          ${J("Style",g.style,Jh,M=>k(_=>{_.style=M}),{def:u.style})}
          ${g.style==="bars"?se("Bar gap",g.barGap,M=>k(_=>{_.barGap=Math.max(0,M??0)},"gap"),{step:.5,min:0,def:u.barGap,unit:"pt"}):ba(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        <div class="grid2">
          ${J("Scale",g.scale,Xh,M=>k(_=>{_.scale=M}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:u.scale})}
          ${J("Baseline",g.baseline,Zh,M=>k(_=>{_.baseline=M}),{def:u.baseline})}
        </div>
        ${Ba.length===0?f:ze("Same scale as",Ua?g.scaleFrom:"",[["","Its own"],...Ba.map(M=>[M.payload.id,Oe(M,uu)])],M=>k(_=>{M?_.scaleFrom=M:delete _.scaleFrom}),{def:""})}
        ${Ua?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:f}
        ${!Ua&&g.scale==="fixed"?h`<div class="grid2">
              ${se("Min",g.minValue,M=>k(_=>{_.minValue=M??0},"cmin"),{def:u.minValue})}
              ${se("Max",g.maxValue,M=>k(_=>{_.maxValue=M??100},"cmax"),{def:u.maxValue})}
            </div>`:f}
        <div class="hint">${g.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let M;e.update(_=>{M=ml(_,a)}),M&&e.selectLayer(M)}}>${D("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        ${J("Colour",g.coloring,Eo,M=>k(_=>{_.coloring=M,M==="bands"&&_.bands.length===0&&(_.bands=Ta(Pt))}),{def:u.coloring})}
        ${b("Main colour")}
        ${g.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${g.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${Ea(g,g.colorSlot.baseColorHex,k)}
          ${g.style==="area"?h`${Ne("Band fill",g.fillBands,M=>k(_=>{_.fillBands=M}),u.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}
        ${J("Highlight",g.highlight,_o,M=>k(_=>{_.highlight=M}),{def:u.highlight})}
        ${g.highlight==="none"?f:h`
          <div class="grid2">
            ${g.highlight==="lowest"?f:J("Highest marker",E.high,Bd,M=>k(_=>{dr(_,{...kt(_),high:M})}),{def:R.high})}
            ${g.highlight==="highest"?f:J("Lowest marker",E.low,Bd,M=>k(_=>{dr(_,{...kt(_),low:M})}),{def:R.low})}
          </div>
          <div class="grid2">
            ${g.highlight==="lowest"?f:de("Highest colour",g.highColorHex,M=>k(_=>{_.highColorHex=M??Le},"hicol"),!1,Le)}
            ${g.highlight==="highest"?f:de("Lowest colour",g.lowColorHex,M=>k(_=>{_.lowColorHex=M??_e},"locol"),!1,_e)}
          </div>
          <div class="hint">A marker is worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}
        ${Ne("Threshold",g.thresholdValue!==void 0,M=>k(_=>{M?_.thresholdValue=Qh(Pt):delete _.thresholdValue}))}
        ${g.thresholdValue===void 0?f:h`
          <div class="grid2">
            ${se("At",g.thresholdValue,M=>k(_=>{_.thresholdValue=M??0},"thval"))}
            ${de("Line colour",g.thresholdColorHex,M=>k(_=>{_.thresholdColorHex=M??hn},"thcol"),!1,hn)}
          </div>
          <div class="hint">${g.scale==="fixed"?"A threshold outside Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the line, so a series that never reaches it still shows how far off it is."}</div>`}
        ${Ne("Now marker",g.nowIndex!==void 0,M=>k(_=>{M?_.nowIndex={kind:{kind:"time",timeField:"hour"}}:delete _.nowIndex}))}
        ${g.nowIndex===void 0?f:h`
          ${le(e,g.nowIndex,M=>k(_=>{_.nowIndex=M},"nowidx"),{showResolved:!0,label:"Reading number",key:`${o}-nowindex`})}
          ${de("Marker colour",g.nowColorHex,M=>k(_=>{_.nowColorHex=M??mn},"nowcol"),!1,mn)}
          <div class="hint">Counted from 0, so Hour puts the line on reading 14 at 2 pm, which is what a
            24-reading price or forecast chart wants. Rounded, and clamped to the readings drawn.</div>`}
        ${Oi(g)?Jd(g,k,u,"cl",h`
            <div class="hint">Clock times from the start of the span to now, evenly spaced, in a row of
              their own. The right edge is now and the left edge is the start of the span, so a slot
              the recorder had nothing for shifts the earlier times a little.</div>`):it&&Ci?h`<div class="hint keep">Clock times need evenly spaced readings, so they are offered when
              Points is Average rather than Every one.</div>`:h`<div class="hint keep">Clock times need a recorded span, so they are offered when Draw is
              Recorded history.</div>`}`;break}case"timeline":{let g=n.payload,k=(we,ue)=>s(nt=>we(nt.payload),ue),E=u.historyMinutes,R=g.value.kind.kind==="entityState",O=Mt(g),K=O===void 0?void 0:e.historySeries(O),ee=qe(g)*60,Me=di(K??"",Et),Ci=Mo(a,g.historyMinutes),In=g.value.kind.kind==="entityState"?g.value.kind.entityId:void 0,An=im(Me,ee,In===void 0?void 0:e.hass.states[In]?.state,In?.split(".")[0]);x=h`
        ${le(e,g.value,we=>k(ue=>{ue.value=we},"value"),{label:"States",key:`${o}-value`})}
        ${R?f:h`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        ${wo(a,g.historyMinutes,E,we=>k(ue=>{ue.historyMinutes=we}))}
        ${Ci?ko(g.historyMinutes,we=>k(ue=>{ue.historyMinutes=we},"span")):f}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${Et} changes are drawn, and a
          busier span keeps its newest.</div>
        ${R&&K===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
        ${R&&K===""?h`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:f}
        ${Me.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${Hm(Me,ee)}</span></span></div>`:f}
        ${Am(Me)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:f}`,$=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${am(g,k,An,`wa-tl-states-${o.replace(/[^a-z0-9]/gi,"")}`)}
        ${An.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${An.filter(we=>we!=="unavailable"&&we!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:f}
        <div class="grid2">
          ${se("Gap",g.gap,we=>k(ue=>{ue.gap=Math.min(Di,Math.max(0,we??0))},"tgap"),{step:.5,min:0,max:Di,def:u.gap,unit:"pt"})}
          ${se("Corner radius",g.cornerRadius,we=>k(ue=>{ue.cornerRadius=Math.max(0,we??0)},"tradius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
        ${Jd(g,k,u,"tl",h`
          <div class="hint">Clock times from the start of the span to now, evenly spaced. Four is what
            the history page on the watch shows. Auto follows the watch's own clock and drops the
            minutes past a three hour span.</div>`)}`;break}case"shape":x=h`<div class="grid2">
          ${J("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],g=>s(k=>{k.payload.kind=g}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:u.kind})}
          ${n.payload.kind==="roundedRectangle"?se("Corner radius",n.payload.cornerRadius,g=>s(k=>{k.payload.cornerRadius=g??6},"radius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"}):f}
        </div>
        ${n.payload.kind==="line"?Im(t,d,c):f}`,$=n.payload.kind==="line"?se("Thickness",n.payload.thickness,g=>s(k=>{k.payload.thickness=g??1},"thick"),{step:.5,min:.5,def:u.thickness,unit:"pt"}):h`
        ${de("Border colour",n.payload.borderColorHex,g=>s(k=>{g===void 0?delete k.payload.borderColorHex:k.payload.borderColorHex=g},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?se("Border width",n.payload.borderWidth,g=>s(k=>{k.payload.borderWidth=g??1},"bw"),{step:.5,min:0,def:u.borderWidth,unit:"pt"}):f}`;break;case"image":{let g=n.payload,k=(K,ee)=>s(Me=>K(Me.payload),ee),E=g.entity.entityId?e.hass.states[g.entity.entityId]?.attributes?.entity_picture:void 0,R=typeof E=="string"?E:void 0,O=R!==void 0&&!R.startsWith("/");x=h`
        ${J("Source",g.source,[["camera","Camera"],["entityPicture","Entity picture"]],K=>k(ee=>{ee.source=K}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:u.source})}
        ${g.source==="camera"?h`
            ${g.entity.entityId&&!g.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:f}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${g.entity.entityId&&R===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:f}
            ${O?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:f}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,$=h`
        ${J("Picture",g.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],K=>k(ee=>{ee.contentMode=K}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:u.contentMode})}
        ${xi("Zoom",g.zoom,K=>k(ee=>{ee.zoom=K},"zoom"),{min:Xr,max:4,step:.05,def:1,format:K=>`${K.toFixed(2)}x`,unit:"x"})}
        ${xi("Pan left/right",g.panX,K=>k(ee=>{ee.panX=K},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${xi("Pan up/down",g.panY,K=>k(ee=>{ee.panY=K},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${g.contentMode==="fit"&&g.zoom===1?"hint keep":"hint"}>${Tm(g)}</div>
        ${se("Corner radius",g.cornerRadius,K=>k(ee=>{ee.cornerRadius=Math.max(0,K??fn)},"imgradius"),{step:1,min:0,def:fn,unit:"pt"})}`;break}case"tap":{x=h`
        ${Cc(e,n.payload,(g,k)=>s(E=>g(E.payload),k),o)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let S=y||n.kind==="image"||n.kind==="tap"||n.kind==="timeline"?void 0:b(n.kind==="shape"?"Fill colour":n.kind==="text"&&rt(n.payload)?"Layer colour":"Colour"),w=Ar(e.config,n),C=w?{kind:{kind:"entityState",...w}}:void 0,N=ve[n.kind],z=n.kind==="image"?n.payload.timestamp===!0:!1,U=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,ne=tf[n.kind],T=nf[n.kind],V=Yd(n.payload,u,ne),X=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,W=e.config.perFamily[t]?.placements[a]?.size!==void 0,be=Yd(n.payload,u,T)||X!==void 0&&l.size!==void 0&&l.size!==u[X],F=Wt(e.config,a),B=(g,k)=>()=>s(E=>vo(E.payload,u,g),k);return h`
    ${ye(e,"content","Content",h`${n.kind==="tap"||n.kind==="text"?f:wc(e,n,o)}${x}`,{color:N,icon:"content",summary:Po(e,n),...V?{reset:()=>s(g=>{vo(g.payload,u,ne),g.kind==="text"&&fi(g.payload.rules)},"reset-content")}:{}})}
    ${$===void 0&&S===void 0?f:ye(e,"look",n.kind==="image"?"Picture":"Look",h`${$??f}${S??f}`,{color:N,icon:n.kind==="image"?"image":"look",...Fa(n)?{summary:Fa(n)}:{},...be?{reset:()=>e.update(g=>{vo(g.elements[r].payload,u,T),W&&Te(g,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?ye(e,"numbers","Numbers",sf(e,n),{color:ve.text,icon:"text",summary:of(e,n),...F.length>0?{reset:()=>e.update(g=>{for(let k of Wt(g,a))ut(g,k.payload.id)})}:{}}):f}
    ${n.kind==="image"?ye(e,"timestamp","Timestamp",Em(n.payload,(g,k)=>s(E=>g(E.payload),k)),{color:N,icon:"clock",summary:z?`Shown \xB7 ${n.payload.timestampSize} pt`:"Hidden",...z?{reset:B(ef,"reset-stamp")}:{}}):f}
    ${ye(e,"states","States",Ic(e,n.payload.rules,n.kind,g=>g.elements.find(k=>k.payload.id===a)?.payload.rules,`rules-${a}`,C,U),{color:te.states,icon:"states",summary:pi(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>s(g=>{g.payload.rules=[]})}:{}})}
    ${i.placement===!1?f:_m(e,n,t)}
    ${i.tap===!1?f:Pm(e,n)}`}var ef=["timestamp","timestampCorner","timestampSize"],tf={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"]},nf={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","colorSlot","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"],timeline:["bands","otherColorHex","gap","cornerRadius","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes"],shape:["colorSlot","borderColorHex","borderWidth","thickness"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[]};function Cc(e,n,t,i){let a=n.action;return h`
    ${ze("Tap action",a.type,mm,r=>t(o=>{o.action=hc(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?tt(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="callService"?mc(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):f}
    ${a.type==="openPage"?gc(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):f}`}var af=24;function rf(e,n){let t=[],i=1/0;for(let r of ie){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=pl(e.config,n,r);o&&(t.push(`${Q(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return f;let a=i<af;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:f}`}function of(e,n){let t=Wt(e.config,n.payload.id);return t.length===0?"None yet":t.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(cn.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function sf(e,n){let t=me(e),i=Wt(e.config,n.payload.id),a=o=>e.update(s=>{ol(s,n.payload.id,o)}),r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return h`
    ${i.length===0?h`<div class="hint keep">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:h`
        <div class="field list-field"><span>Shown</span>
          <div class="chart-numbers">
            ${i.map(o=>h`
              <div class="num-row">
                <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
                  <b>${e.resolve(o.payload.value)??"--"}</b> · <span class="ent-tok">${Oe(o,t)}</span>
                </button>
                <button class="icon danger" title="Delete this number" aria-label="Delete this number"
                  @click=${()=>e.update(s=>ut(s,o.payload.id))}>${D("close")}</button>
              </div>`)}
          </div>
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it. The × deletes it, and Undo brings it back.</div>`}
    <div class="field list-field"><span>Add</span>
      <div class="adders">
        ${cn.map(([o,s])=>h`
          <button class="small" title=${r.has(o)?`Add another ${s.toLowerCase()}`:`Add the ${s.toLowerCase()}`}
            @click=${()=>a(o)}>${D("plus")}<span>${s}</span></button>`)}
      </div>
    </div>
    <div class="hint">The newest reading, the change and the total start with the entity's unit after them. The change is the newest reading minus the first, and the trend arrow is that change as ↑, ↓ or →, flat when it is too small for the chart to print. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function lf(e,n,t){if(n.kind==="tap")return f;let i=n.payload.id,a=Pe(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);c&&s(c.payload)},l?`${t}-${l}`:void 0),o=Hr(e.config,n);return h`
    ${Ne("Tappable",a!==void 0,s=>e.update(l=>{s?Gi(l,i):Ki(l,i)}))}
    ${a?h`<div class="value-editor">
          ${Cc(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${Vi(a.payload.outset)?f:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...Sr}})}>${D("reset")}</button>`}
            </div>
          </div>
        </div>
        ${rf(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${st(o)}</b>.</div>`}`}function Zd(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function Oe(e,n){switch(e.kind){case"text":return Zd(Ce(e.payload.value,n));case"icon":return Zd(Ce(e.payload.symbol,n));case"gauge":return Ce(e.payload.value,n);case"chart":return Ce(e.payload.value,n);case"timeline":return Ce(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let t=e.payload.entity;return t.displayName||t.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let t=e.payload.action,i="entityId"in t?t.displayName||t.entityId:t.type==="callService"?[t.serviceDomain,t.serviceName].filter(a=>a!=="").join("."):t.type==="openPage"&&e.payload.openPageName||"";return i?`${t.type} \xB7 ${i}`:t.type}}}function Sc(e,n){let t=dt(e.config,n.id),i=me(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return ye(e,"content","Group",h`
    ${ge("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Ne("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="field list-field"><span>Layers</span>
      <span class="readout-v">${t.map(r=>Oe(r,i)).join(", ")}</span>
      <div class="row-acts">
        <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>oi(r,n.id))}>Ungroup</button>
      </div>
    </div>
    <div class="hint">Click a layer in the list to edit it.</div>`,{color:te.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function Tc(e,n){if(n==="inline")return df(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${Q(n)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${Q(n)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[n]),l?`fam-${n}-${l}`:void 0),a=za(e.config,n),r=t.backgroundColorHex?Ae(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${Ae(t.borderColorHex)} border`:"no border";return h`
    ${ye(e,"look",`${Q(n)} shape`,h`
      ${de("Background (blank = transparent)",t.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      ${de("Border colour",t.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${se("Border width",t.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}`,{color:te.place,icon:"shape",summary:`${r} \xB7 ${o}`,...t.backgroundColorHex!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${n==="corner"?ye(e,"corner","Corner content",cf(e,t,i),{color:te.place,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):f}
    ${ye(e,"states","Shape states",Ic(e,t.rules,"layout",s=>s.perFamily[n]?.rules,`rules-${n}`),{color:te.states,icon:"states",summary:pi(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${ye(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${Q(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${Q(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:te.place,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function df(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=me(e);return h`
    ${ye(e,"content","Inline text",h`
      ${ge("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${le(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Ne("Countdown",n.countdown===!0,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${n.countdown?h`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:ve.text,icon:"text",summary:Ge(`${n.label?`${n.label}: `:""}${Ce(n.value,i)}`,48)})}
    ${ye(e,"symbol","Symbol",h`
      ${sc(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:ve.icon,icon:"icon",summary:n.symbol||"None"})}`}function cf(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    ${J("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=H("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${le(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${de("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${J("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=H("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:H("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${le(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Ne("Countdown",n.bezelCountdown===!0,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&n.bezelGauge?uf(e,n.bezelGauge,t):f}`}function uf(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${le(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${se("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${se("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${de("Arc colour (min end)",i[0],a(0))}
    ${de("Arc colour (middle)",i[1],a(1))}
    ${de("Arc colour (max end)",i[2],a(2))}
    ${Ne("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=H(String(s.minValue)),s.maxLabel=H(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?le(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${n.maxLabel?le(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var Eb=ie.map(e=>[e,Q(e)]),zo={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},pf=Object.keys(zo),Ra=["color","text","fontSize","fontWeight","visibility"];function hf(e,n=!1){let t=qi[e].filter(i=>!n||Ra.includes(i));return pf.filter(i=>t.includes(Fe[i]))}function Ec(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${qm(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:f}`}var mf={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function wa(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Ge(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function ff(e){if(!e||Re(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function Ce(e,n){return`${Oa(e,n)}${ff(e.format)}`}function Oa(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${Ge(t.value,40)}"`:"(empty)";case"entityState":return wa(t,n);case"entityAttribute":return t.attribute?`${wa(t,n)} \xB7 ${t.attribute}`:wa(t,n);case"entityAge":return`age of ${wa(t,n)}`;case"aggregate":return gf(t.aggregate);case"time":return mf[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${Ge(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(cn.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Oa(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function gf(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function wi(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function yf(e,n,t,i,a,r){let o=(s,l)=>e.update(d=>{let c=i(d);c&&s(c)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:f}
    ${n.map((s,l)=>bf(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(si())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function bf(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),d=e.forced.get(n.id)??"live",c=m=>d==="live"?m==="live":d==="otherwise"?m==="otherwise":d.caseId===m,u=(m,y)=>r(b=>{let x=b.find($=>$.id===n.id);x&&m(x)},y),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(m=>wi(m,t,t-1))}>${D("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(m=>wi(m,t,t+1))}>${D("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(m=>{let y=m.findIndex(b=>b.id===n.id);y>=0&&m.splice(y,1)})}>${D("delete")}</button>
    </div>
    ${s===void 0?f:Ec(s,n.partId,me(e),m=>u(y=>{m?y.partId=m:delete y.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${c("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((m,y)=>h`<button class="${c(m.id)?"active":""} ${l===m.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:m.id})}>Case ${y+1}</button>`)}
        ${n.otherwise?h`<button class="${c("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:f}
      </div>
    </div>
    ${n.cases.map((m,y)=>xf(e,m,y,n,a,u,`${o}-${m.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(m=>{m.cases.push(Dr())})}>+ case</button></div>
    ${Ne("Otherwise",n.otherwise!==void 0,m=>u(y=>{m?y.otherwise=y.otherwise??[]:delete y.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${Mc(e,n.otherwise,a,m=>u(y=>{y.otherwise&&m(y.otherwise)}),`${o}-otherwise`,p)}
        </div>`:f}
  </div>`}function xf(e,n,t,i,a,r,o,s=!1){let l=(c,u)=>r(p=>{let m=p.cases.find(y=>y.id===n.id);m&&c(m)},u),d=e.liveBranch(i)===n.id;return h`<div class="case-box ${d?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${d?h` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>wi(c.cases,t,t-1))}>${D("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(c=>wi(c.cases,t,t+1))}>${D("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(c=>{let u=c.cases.findIndex(p=>p.id===n.id);u>=0&&c.cases.splice(u,1)})}>${D("delete")}</button>
    </div>
    <div class="row-inline">
      ${J("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],c=>l(u=>{u.when.join=c}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:f}
    ${n.when.tests.map((c,u)=>vf(e,c,u,p=>l(m=>{let y=m.when.tests.find(b=>b.id===c.id);y&&p(y)}),()=>l(p=>{p.when.tests=p.when.tests.filter(m=>m.id!==c.id)}),`${o}-${c.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(c=>{c.when.tests.push(Or())})}>+ test</button>
      <select class="adder" @change=${c=>{let u=c.target,p=u.value;if(u.value="",!p)return;let m=Ld(p,Fd(e.hass?.states));l(y=>{y.when.tests.push(...m)})}}>
        <option value="">+ preset…</option>
        ${Ad.map(c=>h`<option value=${c.kind} title=${c.hint}>${c.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${Mc(e,n.then,a,c=>l(u=>c(u.then)),`${o}-then`,s)}
  </div>`}function vf(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=Yt(s.kind),d=e.evaluateTest(n),c=f;switch(l){case"value":c=le(e,s.value??H(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=h`${le(e,s.value??H(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${le(e,s.upper??H(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=h`${ge("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!wf(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"times":c=h`<div class="row-inline">
          ${Qd(e,"From",s.value??H("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${Qd(e,"To",s.upper??H("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":c=kf(n.value)?$f(s.options??[],u=>o(p=>{p.comparison.options=mo(u)},"options")):ge("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(m=>m.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${D("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:le(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${ze("Comparison",s.kind,vl.map(u=>[u,Tn[u]]),u=>o(p=>{p.comparison=Vr(p.comparison,u)}))}
    ${c}
  </div>`}function wf(e){try{return new RegExp(e),!0}catch{return!1}}function Qd(e,n,t,i,a){if(t.kind.kind!=="literal")return le(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=qt(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${he(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:f}</label>`}function kf(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function $f(e,n){let t=Id(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${Rd.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function Mc(e,n,t,i,a,r=!1){let o=hf(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:f}
    ${n.map((s,l)=>Cf(e,s,l,t,(d,c)=>i(u=>{u[l]&&d(u[l])},c?`${a}-${l}-${c}`:void 0),()=>i(d=>{d.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,d=l.value;l.value="",d&&i(c=>{c.push(Jt(d))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${zo[s]}</option>`)}
    </select>`}var Fc=["setColor","setBorderColor","setBackgroundColor"];function Cf(e,n,t,i,a,r,o,s=!1){let l=!qi[i].includes(Fe[n.kind]),d=s&&!l&&!Ra.includes(Fe[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${zo[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:d?h` <span class="no">(ignored by a part)</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${D("delete")}</button>
    </div>
    ${d?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:f}
    ${Rc(e,n,a,o)}
  </div>`}function Rc(e,n,t,i){let a=Yi(n.kind),r=f;if(a==="value"){let o=n.value??H("");if(Fc.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?de("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=H(l??"#FFFFFF")},"color")):le(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:H("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?f:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=le(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=se(s,n.number??0,l=>t(d=>{d.number=l??0},"number"),o)}else a==="weight"&&(r=J("Weight",n.weight??"regular",Mn,o=>t(s=>{s.weight=o})));return r}var Ro=new Set,ka=new Map,$a=new Map,ec=new Map;function Ic(e,n,t,i,a,r,o){let s=oo(n);return!s.ok||Ro.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!s.ok} title=${s.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${d=>{Ro.delete(a),$e(d.target)}}>Show as table</button>
        ${s.ok?f:h`<span class="hint keep">${s.reason}</span>`}
      </div>
      ${yf(e,n,t,i,a,o)}`:Sf(e,s.table,n[0],t,i,a,r,o)}function Sf(e,n,t,i,a,r,o,s){let l=(g,k)=>e.update(E=>{let R=a(E);R&&g(R)},k?`${r}-${k}`:void 0),d=n.value??ec.get(r)??o,c=n.rows.length===0,u=n.numberMode||c&&d!==void 0&&!wd(d)&&Tf(e.resolve(d)),p=qi[i],m=ka.get(r)??new Set,y=n.columns.length===0&&m.size===0?[vd[i]]:[],b=ud(n.columns,[...m,...y.filter(g=>g!==void 0)],p),x=va.get(r),$=t?t.partId:s?.some(g=>g.id===x)?x:void 0,S=s!==void 0&&$!==void 0,w=S?p.filter(g=>Ra.includes(g)):p,C=S?b.filter(g=>!Ra.includes(g)):[],N=(g,k)=>{if(!t){g?va.set(r,g):va.delete(r),$e(k);return}l(E=>{let R=E[0];R&&(g?R.partId=g:delete R.partId)})},z=t?e.liveBranch(t):"none",U=t?e.forced.get(t.id)??"live":"live",ne=g=>U!=="live"&&(U==="otherwise"?g==="otherwise":U.caseId===g),T=g=>{t&&e.setForced(t.id,ne(g)?"live":g==="otherwise"?"otherwise":{caseId:g})},V=g=>{ec.set(r,g),n.rows.length!==0&&l(k=>yd(k,g),"lhs")},X=()=>{va.delete(r),l(g=>{fd(g,d??H(""),u),$!==void 0&&g[0]&&g[0].partId===void 0&&(g[0].partId=$)})},W=n.rows.map((g,k)=>nc(e,{key:`${r}-${g.caseId}`,label:xd(g.comparison,E=>Ce(E,me(e))),columns:b,changes:g.changes,live:z===g.caseId,forced:ne(g.caseId),onForce:()=>T(g.caseId),when:If(e,g.comparison,`${r}-${g.caseId}`,(E,R)=>l(O=>{let K=O[0]?.cases.find(ee=>ee.id===g.caseId)?.when.tests[0];K&&E(K.comparison)},R&&`${g.caseId}-${R}`)),updChanges:(E,R)=>l(O=>{let K=O[0]?.cases.find(ee=>ee.id===g.caseId);K&&E(K.then)},R&&`${g.caseId}-${R}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${k===0} @click=${()=>l(E=>so(E,k,k-1))}>${D("up")}</button>
      <button class="icon" title="Move down" ?disabled=${k===n.rows.length-1} @click=${()=>l(E=>so(E,k,k+1))}>${D("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(E=>gd(E,g.caseId))}>${D("delete")}</button>`})),be=n.otherwise===void 0?f:nc(e,{key:`${r}-otherwise`,label:"Otherwise",columns:b,changes:n.otherwise,live:z==="otherwise",forced:ne("otherwise"),onForce:()=>T("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(g,k)=>l(E=>{let R=E[0]?.otherwise;R&&g(R)},k),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(g=>lo(g,!1))}>${D("close")}</button>`}),F=$a.get(r),B=Ef.filter(g=>w.includes(g)&&!b.includes(g));return h`
    <div class="states">
      ${le(e,d??H(""),V,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${d===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:f}
      ${s===void 0?f:Ec(s,$,me(e),N)}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${b.map(g=>h`<th>
              <span>${Qe[g]}</span>
              <button class="icon" title=${`Remove the ${Qe[g]} column`}
                @click=${k=>{$a.set(r,g),$e(k.target)}}>${D("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${W}
          ${be}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${b.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${C.length===0?f:h`<div class="hint warn">A part ignores ${Na(C.map(g=>Qe[g]))}. Pick Whole text to use ${C.length===1?"it":"them"}.</div>`}
      ${F===void 0?f:h`<div class="hint warn confirm-row">
        Remove the ${Qe[F]} column? Its ${tc(n,F)} value${tc(n,F)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${g=>{$a.delete(r),ka.get(r)?.delete(F),$e(g.target),l(k=>bd(k,F))}}>Remove</button>
        <button class="small" @click=${g=>{$a.delete(r),$e(g.target)}}>Cancel</button>
      </div>`}
      <div class="field list-field"><span>Add</span>
        <div class="states-foot">
          <button class="small" title="Add a row: a value to match and what the layer looks like then" @click=${X}>${D("plus")}<span>State</span></button>
          ${n.otherwise===void 0?h`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(g=>lo(g,!0))}>${D("plus")}<span>Otherwise</span></button>`:f}
          ${B.length===0?f:h`<select class="chip-add" title="Add a column" aria-label="Add a column" @change=${g=>{let k=g.target,E=k.value;if(k.value="",!E)return;let R=ka.get(r)??new Set;R.add(E),ka.set(r,R),$e(k)}}>
            <option value="" selected>+ Column…</option>
            ${B.map(g=>h`<option value=${g}>${Qe[g]}</option>`)}
          </select>`}
        </div>
      </div>
      ${U==="live"?f:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${g=>{Ro.add(r),$e(g.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Tf(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var Ef=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function tc(e,n){let t=0;for(let i of e.rows)pa(i.changes,n)&&(t+=1);return e.otherwise&&pa(e.otherwise,n)&&(t+=1),t}function Mf(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function nc(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{Mf(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${Ff(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function Ff(e,n,t,i,a){let r=pa(t,n),o=Pa(a);if(!r)return h`<button type="button" class="cell empty" title=${`Set ${Qe[n]} for this state`}
      @click=${d=>{i(c=>{c.push(Jt(cd[n]))}),dc(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(u=>{let p=u.find(m=>Fe[m.kind]===n);p&&d(p)},c&&`${n}-${c}`),l=Qe[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${Rf(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${cc}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${vi.has(o)?h`${n==="visibility"?J("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):Rc(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let u=c.findIndex(p=>Fe[p.kind]===n);u>=0&&c.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:f}
    </div>`}function Rf(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=Yi(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${Mn.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??H(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Fc.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Ae(a):Ce(i,me(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??f}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${Ce(i,me(e))}</span>`}function Ae(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function If(e,n,t,i){let a=Yt(n.kind),r=ro(n.kind),o=(s,l,d,c)=>Hf(e,s,l,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${he(s=>i(l=>{let d=Vr(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${ao.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${Af(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??H(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??H(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:f}
  </span>`}function Af(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return Tn[e]}}function Hf(e,n,t,i,a,r,o){let s=Pa(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${le(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${he(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${lc(e,s,o,n,t,l)}
  </span>`}var ki=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Ir,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function _c(e){return ki.find(n=>n.kind===e)??ki[0]}var Ac="#FF9F0A",Da="#8E8E93",Lf=["#FF453A","#FFD60A","#34C759"],Pc=["#0A84FF","#34C759","#FF9F0A"];function _f(e){return e?.attributes?.device_class==="battery"?Lf:Pc}var Pf={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function zf(e){let n=e.iconName?.trim();return n?{off:n,on:n}:Pf[No(e)]??{off:"circle",on:"circle.fill"}}function Nf(e){switch(No(e)){case"lock":return{kind:"equals",value:H("locked")};case"cover":case"valve":return{kind:"equals",value:H("open")};case"media_player":return{kind:"equals",value:H("playing")};default:return{kind:"isOn"}}}function No(e){return e.domain||e.entityId.split(".")[0]||""}function Lt(e){return{...e,domain:No(e)}}function Of(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Rn(e){return Math.round(e*1e4)/1e4}function an(e,n,t){return Math.min(t,Math.max(n,e))}function Oo(e,n,t){let i=Se[e],a=an(Rn(n/i.width),0,1),r=an(Rn(t/i.height),0,1);return{x:Rn((1-a)/2),y:Rn((1-r)/2),width:a,height:r,rotationDegrees:0}}function Df(e){let n=Se[e],t=an(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:Oo(e,t*1.3,t*1.3),size:t}}function Vf(e){let n=Se[e],t=an(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:Oo(e,n.width*.88,t*1.7),size:t}}function Bf(e){let n=Se[e],t=Math.min(n.width,n.height)*.9;return{frame:Oo(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function zc(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function Uf(e){let n=Se[e],t=an(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:Rn(t/n.height),rotationDegrees:0}}}function Gf(e){let n=Se[e],t=an(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:Rn(an(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function Kf(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Wf(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function At(e,n,t,i){let a=i(t);n.payload.frame=a.frame,Wf(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=ct());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function Ht(e){return je(e)}function Do(e,n){let t={kind:{kind:"entityState",...Lt(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function Hc(e){let n=Jt("setIcon");return n.value=H(e),n}function nn(e){let n=Jt("setColor");return n.value=H(e),n}function jf(e,n){let t=si(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...Lt(e)}},a.comparison=Nf(e);let r=n.on!==n.off;return i.then=r?[Hc(n.on),nn(Ac)]:[nn(Ac)],t.otherwise=r?[Hc(n.off),nn(Da)]:[nn(Da)],t}function qf(e){let n=si(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...Lt(e)}},i.comparison={kind:"isUnavailable"};let a=Jt("setOpacity");return a.number=.35,t.then=[a],n}function Lc(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Yf(e,n,t=Pc){let i=n.max-n.min,a=Lc(n.min+i/3),r=Lc(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:H(a)},changes:[nn(t[0])]},{comparison:{kind:"between",value:H(a),upper:H(r)},changes:[nn(t[1])]},{comparison:{kind:"greaterThan",value:H(r)},changes:[nn(t[2])]}];return pd(Do(e),o)}function Jf(e,n,t){let i=Ht("icon"),a=zf(n);return i.payload.symbol=H(a.off),i.payload.colorSlot.baseColorHex=Da,i.payload.rules=[jf(n,a)],At(e,i,t.family,Df),e.elements.push(i),Gi(e,i.payload.id,{type:"toggleEntity",...Lt(n)}),i.payload.id}function Xf(e,n,t){let i=Ht("text");return i.payload.value=Do(n,t.state),i.payload.rules=[qf(n)],At(e,i,t.family,Vf),e.elements.push(i),i.payload.id}function Zf(e,n,t){let i=Ht("gauge");i.payload.value=Do(n);let a=Of(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Yf(n,a,_f(t.state))],At(e,i,t.family,Bf),e.elements.push(i),i.payload.id}function Qf(e,n,t){let i=Ht("chart");return i.payload.value={kind:{kind:"entityState",...Lt(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",At(e,i,t.family,zc),e.elements.push(i),i.payload.id}function eg(e,n,t){let i=Ht("chart");return i.payload.value={kind:{kind:"entityState",...Lt(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",At(e,i,t.family,zc),e.elements.push(i),i.payload.id}function tg(e,n,t){let i=Lt(n),a=Ht("text");a.payload.value=H(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=Da,At(e,a,t.family,Gf),e.elements.push(a);let r=t.state?.attributes?.device_class,o=Ht("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=$r(i.domain,typeof r=="string"?r:void 0),At(e,o,t.family,Uf),e.elements.push(o),o.payload.id}function ng(e,n,t){let i=Ht("image");return i.payload.entity=Lt(n),At(e,i,t.family,Kf),e.elements.push(i),i.payload.id}function Nc(e,n,t,i){switch(n){case"toggle":return Jf(e,t,i);case"status":return Xf(e,t,i);case"gauge":return Zf(e,t,i);case"chart":return Qf(e,t,i);case"history":return eg(e,t,i);case"doorHistory":return tg(e,t,i);case"camera":return ng(e,t,i)}}var ig=/^[a-z0-9_]+\.shared_(\d+)$/;function Oc(e){return ig.test(e)}function ag(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function Vc(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function Bc(e,n){let t=new Map;for(let i of Nr(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=Vc(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${ag(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function rg(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);Pr(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),zr(t,r=>_r(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"});for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}));return t.dataSources=[],t}function Uc(e){let n=!1;return xl(e,t=>{let i=t.kind;if(i.kind!=="aggregate")return;let a=i.aggregate.scope;a.kind==="filter"&&a.areaIds.length+a.labelIds.length+a.floorIds.length>0&&(n=!0)}),n}function og(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(d=>r+t(d,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(d=>o[d]!==void 0).sort();return s.length===0?"{}":`{
${s.map(d=>`${r}${JSON.stringify(d)}: ${t(o[d],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function Gc(e,n,t=[]){let i=n==="share"?rg(e,t):e,a=bn(i);return delete a.id,delete a.slotIndex,a.dataSources=[],`${og(a)}
`}function Kc(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var sg="There is nothing to read here. Paste a complication first.",lg="This is not valid JSON. Check for a missing brace or a stray comma.",dg="This is valid JSON but not a complication. A complication starts with { and ends with }.",cg="This does not look like a complication.",Dc="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",ug="00000000-0000-4000-8000-000000000000";function pg(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function Wc(e,n){let t=e.trim();if(t==="")return{ok:!1,error:sg};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:lg}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:dg};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${Dc}`};let o={...a,id:ug,slotIndex:0},s;try{s=yn(o)}catch(d){let c=d instanceof De||d instanceof Error?d.message:String(d);return{ok:!1,error:`${cg}

${pg(c)}`}}let l=Bi(a);if(l.length>0){let d=l.slice(0,3).join(", "),c=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${d}${c}. ${Dc}`}}return{ok:!0,config:s,raw:i}}function Vo(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=Nr(e,(o,s)=>Oc(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=Oc(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:Vc(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function jc(e,n){let t=structuredClone(e);Pr(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return zr(t,a=>_r(a,i)),t}function qc(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}function hg(e){return e.length<=1?e[0]??"":`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Yc(e){let n=e.elements.length,t=n===1?"1 layer":`${n} layers`,i=aa(e);return i.length===0?t:`${t}, ${hg(i)}`}function Bo(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}var fg=3e4,gg=500,yg=3e4,Jc="preset-entity";function Xc(e){return`import-entity-${e}`}var bg={entityId:"",displayName:"",domain:""},xg={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Uo(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function vg(e){return e.kind==="family"?"look":"content"}function Go(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function Zc(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function wg(e){let n=v`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=e==="rectangular"?v`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`:e==="circular"?v`<circle cx="22" cy="26" r="8" fill="currentColor" />`:e==="corner"?v`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`:v`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`;return h`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${t}</svg>`}var Qc=300,eu=360,tu=44,nu=22,kg=[1,1.7,2.6],$g=["S","M","L"],iu=["Small","Medium","Large"],au="wrist-assistant-panel.layers.v1",ft=34,rn=200,Cg=720,Va=320,Sg=80,Tg=56,ru="wrist-assistant-panel.columns.v3",Ko=e=>Math.max(rn,Math.min(Cg,Math.round(e))),ou=e=>e.metaKey||e.ctrlKey||e.shiftKey,Eg=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,$i=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",_t=$i==="Cmd"?"\u2318":"Ctrl+",Wo=$i==="Cmd"?"\u21E7":"Shift+";function su(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-Sg;if(i>=rn*2+Va){let r=i-Va,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(rn,Math.floor(o*l)),s=Math.max(rn,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(rn,o-d):s=Math.max(rn,s-d))}return{columns:3,left:o,right:s}}let a=e-Tg;return a>=rn+Va?{columns:2,left:Math.min(n,a-Va),right:t}:{columns:1,left:n,right:t}}var A=class A extends bt{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Qc;this.colRight=eu;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set;this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.testValues=new Map;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareNote="";this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.recordPreviews=new Map;this.previewCase=$n.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=rd(()=>this.requestUpdate());this.imageSizes=od(()=>this.requestUpdate());this.symbols=new la(()=>this.requestUpdate());this.keyHandler=t=>this.onKey(t);this.heldArrows=new Set;this.keyUpHandler=t=>{this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new ua;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importParse,a=i?.ok?i.config:void 0;if(!a)return;let r=Vo(a,this.hass.states);r.some(s=>Lo(Xc(s.entityId)))||Bo({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(r)})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||Lo(Jc)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=Ka`
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
      --wa-text: ${ke(ve.text)};
      --wa-icon: ${ke(ve.icon)};
      --wa-gauge: ${ke(ve.gauge)};
      --wa-shape: ${ke(ve.shape)};
      --wa-image: ${ke(ve.image)};
      --wa-tap: ${ke(ve.tap)};
      --wa-states: ${ke(te.states)};
      --wa-place: ${ke(te.place)};
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
    .xfer-file input[type=file] { font: inherit; font-size: 12px; color: var(--wa-muted); min-width: 0; }
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
       and the Layers card takes the rest, scrolling its own rows, so the shape
       row stays pinned to the foot of the column instead of floating mid-air. */
    .column.left { display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    .column.left .card { flex: none; }
    .column.left .card.layers-card {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 10px 8px 8px;
      --thumb-w: ${tu}px; --thumb-h: ${nu}px;
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
    .layers {
      display: flex; flex-direction: column; gap: 2px; flex: 1 1 auto; min-height: 0;
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
    .layer.held { background: color-mix(in srgb, ${ke(te.group)} 12%, var(--wa-panel)); }
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
    /* The shape row is pinned to the foot of the list, under a hairline that
       runs the full width of the card: it is the ground everything else is
       drawn on, not another layer in the stack. */
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
    .layer .lockbtn.on { opacity: 1; color: ${ke(te.locked)}; }
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
    .layer.drop-before { border-top: ${ft}px solid transparent; }
    .layer.drop-after { border-bottom: ${ft}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${ft}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${ft}px; }
    .layer.drop-after::after { bottom: -${ft}px; }

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
    .canvas-bar {
      display: flex; align-items: center; gap: 4px; padding: 8px 10px; flex-wrap: wrap; font-size: 13px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
    }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
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
       and what the house is telling it right now. */
    .under-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px; flex: none; }
    .card.tint-values {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${ke(te.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${ke(te.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${ke(te.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${ke(te.states)} 35%, var(--wa-card));
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
    /* Shared values: a chip per named value, laid out as a titled sub-section
       of the settings rather than a loose row of boxes. The whole chip opens
       the editor, so it carries the hover and selected states a row would, and
       the delete button stays out of the way until the pointer is on it. */
    .values-list .empty { font-size: 12px; color: var(--wa-muted); margin: 0; padding: 4px 0; text-align: left; }
    .values-list .data { display: flex; flex-direction: column; gap: 6px; }
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
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; color: var(--wa-muted); }
    .values-list .datum button.icon { opacity: 0; pointer-events: none; flex: none; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
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
    .vchip input { width: 110px; min-height: 24px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
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
    .column.inspector { padding: 10px 12px 12px; }
    .insp-head { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0; position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    .crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 12.5px; font-weight: 600; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500;
    }
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
    .sec-b > :is(.adders, .chart-numbers, .states-switch, details.sub) { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width. */
    :is(.sec-b, .sec-b :is(.grid2, .grid4, .value-editor, .states, .rich-parts, .part-editor, .rule-box, .case-box, .test-box, .change-box))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .states-switch, .span-parts, button.small, button.link, select.adder, details.sub):not(.value-pop *) {
      margin-left: calc(var(--wa-lab) + 8px);
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
    .bands { display: grid; gap: 3px; margin: 2px 0 6px calc(var(--wa-lab) + 8px); container-type: inline-size; }
    @container (max-width: 240px) {
      .band-row .color-box .alpha { display: none; }
      .band-row .color-box { padding-right: 6px; }
    }
    .band-bar { position: relative; height: 8px; margin: 4px 0 6px; }
    .band-bar .bb { display: flex; height: 100%; border-radius: 4px; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(128,128,128,.25); }
    .band-bar .bb i { display: block; flex: none; height: 100%; }
    .band-bar .now {
      position: absolute; top: -4px; width: 2px; height: 16px; margin-left: -1px; border-radius: 1px;
      background: var(--wa-ink); box-shadow: 0 0 0 1.5px var(--wa-card);
    }
    .band-row { position: relative; display: grid; grid-template-columns: 12px 64px minmax(0, 1fr) 22px; gap: 4px; align-items: center; min-height: 28px; }
    .band-row .le { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: var(--wa-muted); text-align: center; }
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
    .states-table { width: 100%; border-collapse: collapse; margin: 8px 0 4px; font-size: 13px; }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.addEventListener(Ia,this.scrubStart),this.addEventListener(Aa,this.scrubEnd),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},yg)}loadColumnWidths(){try{let t=window.localStorage.getItem(ru);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=Ko(i.left)),typeof i.right=="number"&&(this.colRight=Ko(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(ru,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let t=window.localStorage.getItem(au);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(au,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Qc:this.colRight=eu,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=su(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,m=Ko(t==="left"?s+p:s-p);t==="left"?this.colLeft=m:this.colRight=m},d=u=>{u.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.removeEventListener(Ia,this.scrubStart),this.removeEventListener(Aa,this.scrubEnd),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||Uo(i)!==Uo(this.inspect))&&(this.openSections=new Set(Io))}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=Uo(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}t.key==="Escape"&&(this.timestampActiveId=void 0);let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!Eg.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=xg[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):c=!1,c&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?dt(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)ut(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=vn(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=fl(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=vn(t,i),r=[];this.mutate(o=>{r=Vt(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=Ye(t,this.canvasFamily).filter(a=>!pe(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?lt(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>oi(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!Ee(t,a,s).isHidden);this.mutate(s=>{for(let l of i)Te(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!pe(a,u)),o=a.elements.filter(u=>pe(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],Be(a),xn(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await us(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${gt(t)}`}}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1;let i=Dl(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await bs(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await ps(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${gt(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Qt.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=Bi(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=gt(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Qt(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0),!0)}freeSlot(){return zs(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await ms(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await hs(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=gt(t)}}renderSendButton(){let t=wl({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds});if(t.kind==="unsupported"&&!this.sendStatusKnown)return f;let i=kl(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:f}${a}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<rr}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Ji(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Ws(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(gg))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new pt(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||td(t.app_version):!0}get canvasFamily(){if(Cn(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&Qr(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=aa(t)[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=xe[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!Cn(this.activeFamily))return f;if(Ye(t,i).length>0)return f;let r=ie.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>za(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${Q(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${Q(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>xc(s,o,i))}>Copy the ${Q(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${Q(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${A.sizeWords(i)} against
            ${A.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:f}
    </div>`}addShape(t){this.mutate(i=>Xl(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!ra(i,t))return;let a=Ql(i,t);a.length>0&&!window.confirm(`Remove the ${Q(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>Zl(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew(ll(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let s=structuredClone(i.config);s.id=Y(),s.slotIndex=o,i=new Qt(s,null)}let a=i.encoded(),r=await fs(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=Qt.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=gt(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let t=await gs(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!t.ok){t.error==="conflict"?this.conflict={current:t.current??null,message:t.message??"This complication changed on the server."}:this.saveError=t.message??t.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(t){this.saveError=gt(t)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=Y(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await ys(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=gt(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},fg)}async refreshHistorySeries(){let t=this.draft?.config,i=t?br(t):[],a=t?xr(t):[];if(i.length===0&&a.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let r={};for(let s of i)r[s.key]={entity_id:s.entityId,minutes:s.minutes,points:s.points,...s.mode==="states"?{mode:"states"}:{}};let o={};for(let s of a)o[s.key]={entity_id:s.entityId,minutes:s.minutes,period:s.period,type:s.type};try{let[s,l]=await Promise.all([vs(this.hass,r),ws(this.hass,o).catch(()=>({}))]),d=new Map;for(let[c,u]of Object.entries({...s,...l}))u.ok&&d.set(c,u.series);this.historySeries=d}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await xs(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Tl(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=gt(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let d=Mg(o.remaining);d!==void 0&&(l.remaining=d)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(){let t=new Map;for(let[i,a]of this.compiled?.entities??[]){let r=this.entityStateFor(i,a.iconName??"",!0);r&&t.set(i,r)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${D("expand")}</button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[t],s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,t)}
        <span class="spacer"></span>
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${s}`}>
        ${this.renderBigPreview(t,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let t=_t,i=Wo,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${$i}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"],["Share \xB7 Import","Share turns this complication into text you can post anywhere, with your entity ids replaced by numbered slots. Import pastes that text back and asks which of your entities each slot means"]],o=s=>s.map(([l,d])=>h`<tr><th scope="row"><kbd>${l}</kbd></th><td>${d}</td></tr>`);return h`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Lr(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){if(this.picking){i.preventDefault(),this.pickAt(t,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,s=a.closest("svg"),l=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=l!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let $=this.focusTapId();if($!==void 0&&o===$&&s&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,s,$,r??void 0);return}let S=this.hitLayerId(i);S?this.inspect={kind:"layer",id:S}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let c=ou(i);if(!c&&this.multi.size>0&&(this.multi=new Set),!o||!s)return;let u=Lr(this.draft.config,o),p=this.draft.config.elements.find($=>$.payload.id===u);if(!u||!p)return;if(c){i.preventDefault(),this.togglePick(u);return}let m=lt(this.draft.config,u),y=m!==void 0&&this.inspect.kind==="group"&&this.inspect.id===m.id;if(m&&(m.locked||y)&&!r&&!d){this.beginGroupGesture(t,i,s,m);return}if((this.inspect.kind!=="layer"||this.inspect.id!==u)&&(this.inspect={kind:"layer",id:u},r))return;i.preventDefault();let b=Ee(this.draft.config,t,p).frame,x=this.gestureCanvas(t);if(d&&p.kind==="image"&&p.payload.timestamp===!0){this.timestampActiveId=u;let $=p.payload,S=xe[t],w=b.width*S.width,C=b.height*S.height,N={x:0,y:0,w,h:C,cx:w/2,cy:C/2},z=ta($,N,ea(new Date));if(this.cancelGesture?.(),l){let V=x.width/S.width,X=$.timestampSize;this.cancelGesture=Ed(s,i,l,{w:z.w*V,h:z.h*V},(W,be)=>{let F=Math.min(40,Math.max(4,Math.round(X*W)));this.mutate(B=>{let g=B.elements.find(k=>k.payload.id===u);g?.kind==="image"&&(g.payload.timestampSize=F)},`ts-size-${u}`),be&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let U={x:0,y:0,w:b.width*x.width,h:b.height*x.height},ne=ot($)?{x:$.timestampX,y:$.timestampY}:{x:(z.x+z.w/2)/N.w,y:(z.y+z.h/2)/N.h},T=!1;this.cancelGesture=Td(s,U,i,ne,(V,X,W)=>{W||(T=!0),T&&this.mutate(be=>{let F=be.elements.find(B=>B.payload.id===u);F?.kind==="image"&&(F.payload.timestampX=V,F.payload.timestampY=X)},`ts-${u}`),W&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=ma(s,x,i,{elementId:u,frame:b,handle:r??void 0},{onFrame:($,S,w)=>{this.mutate(C=>Te(C,t,$,{frame:S}),`drag-${$}-${t}`),w&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r){let o=this.draft?.config;if(!o)return;let s=dt(o,r.id);if(s.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let l=new Map(s.map(x=>[x.payload.id,Ee(o,t,x).frame])),d=[...l.values()],c=Math.min(...d.map(x=>x.x)),u=Math.min(...d.map(x=>x.y)),p=Math.max(...d.map(x=>x.x+x.width)),m=Math.max(...d.map(x=>x.y+x.height)),y={x:c,y:u,width:p-c,height:m-u,rotationDegrees:0},b=x=>Math.round(x*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=ma(a,this.gestureCanvas(t),i,{elementId:r.id,frame:y},{onFrame:(x,$,S)=>{let w=$.x-y.x,C=$.y-y.y;this.mutate(N=>{for(let[z,U]of l)Te(N,t,z,{frame:{...U,x:b(U.x+w),y:b(U.y+C)}})},`drag-group-${r.id}-${t}`),S&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Cd:1,s=t*o,l=i*o,d=this.canvasFamily,c=xe[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,s,l))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let x=this.inspect.id;return this.nudgeMany(dt(r,x).map($=>$.payload.id),d,c,`nudge-group-${x}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find(x=>x.payload.id===u);if(!p)return!1;let m=lt(r,u);if(m?.locked)return this.nudgeMany(dt(r,m.id).map(x=>x.payload.id),d,c,`nudge-group-${m.id}-${d}`,s,l);let y=Ee(r,d,p).frame,b=ho(y,s,l,c);return(b.x!==y.x||b.y!==y.y)&&this.mutate(x=>Te(x,d,u,{frame:b}),`nudge-${u}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,c=new Map;for(let C of t){let N=l.elements.find(z=>z.payload.id===C);N&&c.set(C,Ee(l,i,N).frame)}if(c.size===0)return!1;let u=[...c.values()],p=Math.min(...u.map(C=>C.x)),m=Math.min(...u.map(C=>C.y)),y=Math.max(...u.map(C=>C.x+C.width)),b=Math.max(...u.map(C=>C.y+C.height)),x={x:p,y:m,width:y-p,height:b-m,rotationDegrees:0},$=ho(x,o,s,a),S=$.x-x.x,w=$.y-x.y;return(S!==0||w!==0)&&this.mutate(C=>{for(let[N,z]of c)Te(C,i,N,{frame:{...z,x:d(z.x+S),y:d(z.y+w)}})},r),!0}nudgeTimestamp(t,i,a,r){let o=this.draft?.config,s=o?.elements.find(x=>x.payload.id===t);if(!o||s?.kind!=="image"||s.payload.timestamp!==!0)return!1;let l=s.payload,d=xe[i],c=Ee(o,i,s).frame,u=c.width*d.width,p=c.height*d.height,m=ta(l,{x:0,y:0,w:u,h:p,cx:u/2,cy:p/2},ea(new Date)),y=ot(l)?{x:l.timestampX,y:l.timestampY}:{x:u>0?(m.x+m.w/2)/u:.5,y:p>0?(m.y+m.h/2)/p:.5},b=Sd(y,a,r,{w:u,h:p});return(b.x!==y.x||b.y!==y.y)&&this.mutate(x=>{let $=x.elements.find(S=>S.payload.id===t);$?.kind==="image"&&($.payload.timestampX=b.x,$.payload.timestampY=b.y)},`nudge-ts-${t}`),!0}gestureCanvas(t){let i=Qi(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=Zr(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:Pe(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let d=pe(s,l),c=Ee(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=ma(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o},{onFrame:(u,p,m)=>{this.mutate(y=>{d?ul(y,u,t,p):Te(y,t,u,{frame:p})},`tap-box-${u}-${t}`),m&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:su(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>Choose watch
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${this.owners.map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${lu(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${Zc()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${Zc()}`:f}
        ${this.renderNewButton()}
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${D("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${D("redo")}</button>
        </div>
        <div class="hbox status">
          <span class="dirty-dot ${i?"":r?"clean":"none"}" title=${i?"Unsaved changes":r?"Saved":"Not saved yet"}></span>
          ${this.renderSendButton()}
          <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
        </div>
      </header>
      ${this.loadError?h`<div class="card error">${this.loadError}</div>`:f}
      ${this.helpOpen?this.renderHelpDialog():f}
      ${this.newOpen?this.renderNewDialog():f}
      ${this.shareOpen?this.renderShareDialog():f}
      ${this.importOpen?this.renderImportDialog():f}
      ${this.watchSupported?h`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=t?.complication_count??0,a=i===0?"Nothing on this watch changes until then.":`Your ${i} complication${i===1?"":"s"} keep${i===1?"s":""} working until then.`;return h`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${D("watch")}</div>
        <div class="gate-eyebrow">Watch app update coming soon</div>
        <h2 class="gate-title">This watch needs the new app.</h2>
        <p class="gate-lead">${nd(t?.app_version)}</p>
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
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...Ns(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(Q).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t){return h`<span class="shape-dots">${Zt.map(i=>h`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${Q(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=yn(t.document),r={revision:t.revision,config:a,entities:[...Ji(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??Qr(a)??"inline",s=new Map;for(let c of i.entities){let u=this.entityStateFor(c.entityId,c.iconName??"",!1);u&&s.set(c.entityId,u)}let l=Xi(a,{entityStates:s,templateResults:new Map,namedValues:a.values});if(o==="inline")return h`<span class="pk-art inline">${this.renderInlinePreview(l.inline,!0)}</span>`;let d=l[o];return d?h`<span class="pk-art ${o}">${ia(d,{icons:this.icons,imageSizes:this.imageSizes,slot:$n.slots[o]})}</span>`:h`<span class="pk-art"></span>`}renderPickerFilter(t){let i=r=>r.kind==="record"?Go(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${Zt.map(r=>a(r,Q(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=this.records.find(d=>d.id===this.selectedId),a=t?t.config.name.trim()||"Untitled":"No complication",r=t?t.config.supportedFamilies:[],o=this.pickerRows(),s=this.pickerFilter,l=s==="all"?o:o.filter(d=>(d.kind==="record"?Go(d.record):d.families).includes(s));return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?h`<span class="pk-rev">r${i.revision}</span>`:t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:f}
        ${D("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${o.length>=A.FILTER_FROM_ROWS?this.renderPickerFilter(o):f}
        ${o.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.length>0&&l.length===0?h`<div class="empty">Nothing on this watch has a ${s==="all"?"":Q(s)} shape.</div>`:f}
        ${l.map(d=>d.kind==="record"?h`<button class="row" role="option" aria-current=${d.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(d.record)}}>
              ${this.renderRowArt(d.record)}
              <span class="pk-name">${String(d.record.document?.name??"Untitled")}</span>
              ${this.shapeDots(Go(d.record))}
              <span class="pk-badge">r${d.record.revision}</span>
            </button>`:h`<button type="button" class="row locked" role="option" aria-disabled="true" title=${d.title}
              @click=${()=>{this.pickerNote=this.pickerNote===d.slot?void 0:d.slot}}>
              <span class="pk-art"></span>
              <span class="pk-name">${d.name}</span>
              ${this.shapeDots(d.families)}
              <span class="pk-badge">${d.badge}</span>
            </button>
            ${this.pickerNote===d.slot?h`<div class="pk-note">${d.title}</div>`:f}`)}
        ${t&&t.baseRevision===null?h`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${a}</span>${this.shapeDots(r)}<span class="pk-badge">unsaved</span></div>`:f}
      </div>`:f}
    </div>`}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.pickerNote=void 0),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return f;let t=this.freeSlot()<0;return h`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${D("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">watch is full</span>`:f}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return"A complication on this watch already has that name."}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${D("close")}</button>
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
            ${Zt.map(r=>h`<button type="button" role="radio" class="shape-card ${this.newFamily===r?"on":""}"
              aria-checked=${this.newFamily===r?"true":"false"}
              @click=${()=>{this.newFamily=r}}>
              ${wg(r)}
              <span class="shape-card-name">${Q(r)}</span>
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
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.draft?.config;return t?Bc(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config;if(!t)return f;let i=this.currentShareSlots(),a=Gc(t,this.shareMode,i),r=(o,s,l)=>h`<label class="xfer-mode">
      <input type="radio" name="wa-share-mode" .checked=${this.shareMode===o}
        @change=${()=>{this.shareMode=o,this.shareNote=""}} />
      <span><b>${s}</b><span class="hint">${l}</span></span>
    </label>`;return h`<dialog class="share-dialog" @close=${()=>{this.shareOpen=!1}}>
      <div class="new-head">
        <h2>Share this complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Close" aria-label="Close" @click=${()=>this.closeShareDialog()}>${D("close")}</button>
      </div>
      <div class="xfer-body">
        <div class="field">
          <span>What to share</span>
          <div class="xfer-modes">
            ${r("share","Share","Entity ids and friendly names are replaced by numbered slots, so nothing about your home travels with it. Whoever imports it picks their own entities.")}
            ${r("backup","Backup","An exact copy, your entity ids and names included. For your own records, or another watch in this home.")}
          </div>
        </div>
        ${this.shareMode==="share"?this.renderShareSlots(i):f}
        <div class="field">
          <span>Text</span>
          <textarea class="xfer-text" rows="14" readonly aria-label="The text to share" .value=${a}></textarea>
        </div>
      </div>
      <div class="xfer-foot">
        ${this.shareNote===""?f:h`<span class="note">${this.shareNote}</span>`}
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeShareDialog()}>Close</button>
        <button class="small" @click=${()=>this.downloadShareText(a)}>Download</button>
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
    </div>`}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareNote="",this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}async copyShareText(t){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.shareNote="Copied.";return}}catch{}let i=this.renderRoot.querySelector("dialog.share-dialog textarea");i?.focus(),i?.select();let a=!1;try{a=document.execCommand("copy")}catch{a=!1}this.shareNote=a?"Copied.":"Press Cmd+C or Ctrl+C to copy."}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=Kc(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote=`Saved as ${a}.`}renderImportDialog(){let t=this.importParse,i=t?.ok?t.config:void 0,a=i?Vo(i,this.hass.states):[],r=Bo({parsed:i!==void 0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(a)});return h`<dialog class="import-dialog" @keydown=${this.importKeys} @close=${()=>{this.importOpen=!1}}>
      <div class="new-head">
        <h2>Import a complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeImportDialog()}>${D("close")}</button>
      </div>
      <div class="xfer-body">
        <div class="field">
          <span>Shared text</span>
          <textarea class="xfer-text" rows="8" placeholder="Paste the shared complication here"
            aria-label="Shared complication text" .value=${this.importText}
            @input=${o=>this.setImportText(o.target.value)}></textarea>
          <div class="xfer-file">
            <span class="hint">Or read it from a file:</span>
            <input type="file" accept=".json,application/json" aria-label="Read it from a file instead"
              @change=${o=>{this.readImportFile(o)}} />
          </div>
        </div>
        ${t&&!t.ok?h`<div class="hint err">${t.error}</div>`:f}
        ${i?this.renderImportDetails(i,a):f}
      </div>
      <div class="xfer-foot">
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeImportDialog()}>Cancel</button>
        <button class="primary" ?disabled=${r!==void 0}
          title=${r??"Open it in the editor"} @click=${()=>this.doImport()}>Import</button>
      </div>
    </dialog>`}unchosenCount(t){return t.filter(i=>i.required&&!this.importMap.has(i.entityId)).length}renderImportDetails(t,i){let a=this.importName.trim(),r=a!==""&&this.takenNames().has(a.toLowerCase());return h`
      <div class="field">
        <span>Name</span>
        <input type="text" maxlength="60" aria-label="Complication name" aria-invalid=${r?"true":"false"}
          .value=${this.importName}
          @input=${o=>{this.importName=o.target.value}} />
      </div>
      ${r?h`<div class="hint err">A complication on this watch already has that name.</div>`:h`<div class="hint">${Yc(t)}. It opens in the editor and reaches the watch at the first Save.</div>`}
      ${i.length===0?h`<div class="hint">Every entity this design reads is already in your Home Assistant.</div>`:h`<div class="field">
            <span>Entities</span>
            <div>${i.map(o=>this.renderImportRow(o))}</div>
          </div>`}
      ${Uc(t)?h`<div class="hint warn">This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</div>`:f}`}renderImportRow(t){let i=this.importMap.get(t.entityId);return h`<div class="xfer-ent">
      ${tt({hass:this.hass},t.label,i??bg,a=>this.setImportEntity(t.entityId,a),Xc(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&i===void 0})}
      <div class="hint">${t.where.join(", ")}</div>
      <div class="hint">${t.required?"Choose the entity this design should read.":"Not in your Home Assistant right now; leave it to keep the id."}</div>
    </div>`}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,_a(this.hass.states,i.entityId)),this.importMap=a}setImportText(t){this.importText=t;let i=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,a=t.trim()===""?void 0:Wc(t,this.maxSchemaVersion);if(this.importParse=a,!a?.ok){this.importMap=new Map,this.importName="";return}JSON.stringify(a.config)!==i&&(this.importMap=new Map,this.importName=qc(a.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];if(a){try{this.setImportText(await a.text())}catch(r){this.importParse={ok:!1,error:`That file could not be read: ${gt(r)}`}}i.value=""}}doImport(){let t=this.importParse;if(!t?.ok)return;let i=jc(t.config,this.importMap);i.id=Y(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=Bt(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("textarea")?.focus())}))}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importOpen=!1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
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
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${lu(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return f;if(this.activeFamily==="inline")return f;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${D("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?f:h`<span class="mini">${eo.length} kinds · ${ki.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([s,l])=>h`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${D(s)}</button>`)}
              </span>
            </span>`:f}
        <span class="chev">${D("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${eo.map(s=>h`<button class="add" style=${`--k:${ve[s]}`} ?disabled=${i} title=${`Add a blank ${Sn[s].toLowerCase()} layer`}
              @click=${()=>{let l=je(s);this.addHere(d=>{d.elements.push(l)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?h`<span class="well">${$d(s)}</span>`:f}<span class="add-name">${r?D(s):h`<span class="k"></span>`}<span>${Sn[s]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${ki.map(s=>h`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:f}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(y=>!pe(o,y)),l=o.elements.filter(y=>pe(o,y)),d=[...s].reverse(),c=d.find(y=>y.payload.id===i);if(!c)return;let u=o.groups?.find(y=>y.id===t),p=u?d.filter(y=>y.payload.groupId===u.id):d.filter(y=>y.payload.id===t);if(p.length===0||p.includes(c))return;d=d.filter(y=>!p.includes(y));let m;if((u||r)&&c.payload.groupId!==void 0){let y=d.filter(b=>b.payload.groupId===c.payload.groupId);m=a?d.indexOf(y[0]):d.indexOf(y[y.length-1])+1}else m=d.indexOf(c)+(a?0:1);if(d.splice(m,0,...p),!u){let y=p[0],b=r?void 0:c.payload.groupId;b===void 0?delete y.payload.groupId:y.payload.groupId=b}o.elements=[...d.reverse(),...l],Be(o),xn(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?ft:0),l=o.bottom-(r.classList.contains("drop-after")?ft:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(ou(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!pe(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=Mr(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return f;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(T,V)=>this.moveLayer(T,V),o=T=>{let V;this.mutate(X=>{V=hl(X,T)}),V&&(this.inspect={kind:"layer",id:V})},s=T=>{this.mutate(V=>ut(V,T)),this.inspect.kind==="layer"&&this.inspect.id===T&&(this.inspect={kind:"general"})},l=Ye(t,a).filter(T=>!pe(t,T)).reverse(),d=me(this.host()),c=new pt(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",m=`${u?.backgroundColorHex?Ae(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,y=[...this.multi].filter(T=>t.elements.some(V=>V.payload.id===T)).length,b=Xi(t,this.buildContext(),this.forced)[a],x=kg[this.thumbStep],$=Math.round(tu*x),S=Math.round(nu*x),w=T=>b?h`<span class="thumb">${Jl(b,T,{icons:this.icons,imageSizes:this.imageSizes,width:$,height:S})}</span>`:h`<span class="thumb"></span>`,C=this.layerDetail==="expanded",N=(T,V,X=!1)=>{let W=T.payload.id,be=this.inspect.kind==="layer"&&this.inspect.id===W,F=Ee(t,a,T),B=F.isHidden,g=Pe(t,W)[0],k=pi(T.payload.rules),E=this.picking&&this.pickHoverId===W,R=this.rowDrag(W,i);return h`<div class="layer ${be?"hl":""} ${X?"held":""} ${E?"pick":""} ${B?"dim":""} ${this.multi.has(W)?"multi":""} ${V?"kid":""} ${C?"rich":""}"
        style=${`--k:${ve[T.kind]}`} tabindex="0" draggable=${R.draggable}
        @pointerenter=${()=>{this.listHoverIds=[W]}}
        @pointerleave=${()=>this.leaveRow([W])}
        @click=${O=>this.clickRow(W,O)}
        @keydown=${O=>{O.key==="Enter"&&(this.inspect={kind:"layer",id:W})}}
        @dragstart=${R.onStart} @dragend=${R.onEnd} @dragover=${R.onOver} @drop=${R.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${D("grip")}</span>
        <span class="bar"></span>
        ${w([W])}
        <span class="name">
          <b>${Oe(T,d)}</b>
          <small><span class="kind">${Sn[T.kind]}</span> · ${Ig(T,c,this.historySeries,F.size)}</small>
          ${C?h`<span class="facts">${Fg(this.host(),a,T,F).map(O=>h`<span class="fact"><b>${O.label}</b> ${O.value}</span>`)}</span>`:f}
        </span>
        <span class="right">
          <span class="badges">
            ${g?h`<span class="badge tap" title=${`Tappable \xB7 ${Oe(g,d)}`}>tap</span>`:f}
            ${T.payload.rules.length===0?f:h`<span class="badge states" title=${k}>${k.replace(/\.$/,"").toLowerCase()}</span>`}
            ${B?h`<span class="badge">hidden</span>`:f}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${_t}])`} aria-label="Bring forward" @click=${O=>{O.stopPropagation(),r(W,1)}}>${D("up")}</button>
            <button class="icon" title=${`Send back (${_t}[)`} aria-label="Send back" @click=${O=>{O.stopPropagation(),r(W,-1)}}>${D("down")}</button>
            <button class="icon" title=${`${F.isHidden?"Show":"Hide"} (${Wo}${_t}H)`} aria-label=${F.isHidden?"Show this layer":"Hide this layer"} @click=${O=>{O.stopPropagation(),this.mutate(K=>Te(K,a,W,{isHidden:!F.isHidden}))}}>${D(F.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${_t}D)`} aria-label="Duplicate" @click=${O=>{O.stopPropagation(),o(W)}}>${D("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${O=>{O.stopPropagation(),s(W)}}>${D("delete")}</button>
          </span>`:f}
        </span>
      </div>`},z=(T,V)=>{let X=this.inspect.kind==="group"&&this.inspect.id===T.id,W=!this.collapsed.has(T.id),be=this.rowDrag(T.id,i),F=V[0],B=V[V.length-1],g=E=>{let R=E.currentTarget,O=R.getBoundingClientRect(),K=O.top+(R.classList.contains("drop-before")?ft:0),ee=O.bottom-(R.classList.contains("drop-after")?ft:0),Me=(E.clientY-K)/Math.max(1,ee-K);return Me<.25?"drop-before":!W&&Me>.75?"drop-after":"drop-into"},k=V.map(E=>E.payload.id);return h`<div class="layer group ${X?"hl":""} ${C?"rich":""}" style=${`--k:${te.group}`} tabindex="0" draggable=${be.draggable}
        @pointerenter=${()=>{this.listHoverIds=k}}
        @pointerleave=${()=>this.leaveRow(k)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:T.id}}}
        @keydown=${E=>{E.key==="Enter"&&(this.inspect={kind:"group",id:T.id})}}
        @dragstart=${be.onStart} @dragend=${be.onEnd}
        @dragover=${E=>{!this.dragId||this.dragId===T.id||(E.preventDefault(),this.markDrop(E.currentTarget,g(E)))}}
        @drop=${E=>{E.preventDefault();let R=g(E);this.clearDragMarks();let O=this.dragId;if(this.dragId=void 0,!(!O||!F||!B)){if(R==="drop-before"){this.reorderLayer(O,F.payload.id,!0,!0);return}if(R==="drop-after"){this.reorderLayer(O,B.payload.id,!1,!0);return}this.isGroupId(O)||(this.reorderLayer(O,F.payload.id,!0),this.mutate(K=>Fr(K,O,T.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${D("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${D("folder")}</span>
        <span class="name">
          <b>${T.name}</b>
          <small><span class="kind">Group</span> · ${V.length} layer${V.length===1?"":"s"} · ${T.locked?"locked":"unlocked"}</small>
          ${C?h`<span class="facts"><span class="fact"><b>Holds</b> ${V.map(E=>Oe(E,d)).join(", ")}</span></span>`:f}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${Wo}${_t}G)`} aria-label="Ungroup" @click=${E=>{E.stopPropagation(),this.mutate(R=>oi(R,T.id)),X&&(this.inspect={kind:"general"})}}>${D("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${T.locked?"on":""}" ?disabled=${!i}
            title=${T.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${T.locked?"Unlock the group":"Lock the group"}
            @click=${E=>{E.stopPropagation(),this.mutate(R=>{let O=R.groups?.find(K=>K.id===T.id);O&&(O.locked=!O.locked)})}}>${D(T.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${W?"true":"false"} title=${W?"Fold the group":"Unfold the group"}
            @click=${E=>{E.stopPropagation();let R=new Set(this.collapsed);W?R.add(T.id):R.delete(T.id),this.collapsed=R}}>${D("chevron")}</button>
        </span>
      </div>`},U=[],ne=new Set;for(let T=0;T<l.length;T++){let V=l[T],X=V.payload.groupId,W=X===void 0?void 0:t.groups?.find(B=>B.id===X);if(!W){U.push(N(V,!1));continue}if(ne.has(W.id))continue;ne.add(W.id);let be=l.filter(B=>B.payload.groupId===W.id);U.push(z(W,be));let F=this.inspect.kind==="group"&&this.inspect.id===W.id;this.collapsed.has(W.id)||U.push(h`<div class="group-kids">${be.map(B=>N(B,!0,F))}</div>`)}return h`<div class="card layers-card" style=${`--thumb-w:${$}px;--thumb-h:${S}px`}>
      <h2 class="panel-title tools" style=${`--c:${te.place}`}><span class="swatch">${D("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([T,V])=>h`
              <button class=${this.layerDetail===T?"on":""} title=${V} aria-label=${V} aria-pressed=${this.layerDetail===T?"true":"false"}
                @click=${()=>{this.layerDetail=T,this.saveListView()}}>${D(T)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${$g.map((T,V)=>h`
              <button class=${this.thumbStep===V?"on":""} title=${`${iu[V]} row pictures`}
                aria-label=${`${iu[V]} row pictures`} aria-pressed=${this.thumbStep===V?"true":"false"}
                @click=${()=>{this.thumbStep=V,this.saveListView()}}>${T}</button>`)}
          </span>
        </span>
      </h2>
      ${y>=2&&i?h`<div class="group-cta"><span>${y} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${_t}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${$i}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:f}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:f}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${U}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${te.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${T=>{T.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${T=>{this.dragId&&(T.preventDefault(),this.markDrop(T.currentTarget,"drop-before"))}}
        @drop=${T=>{T.preventDefault(),this.clearDragMarks();let V=this.dragId,X=[...l].reverse().find(W=>W.payload.id!==V&&W.payload.groupId!==V);V&&X&&this.reorderLayer(V,X.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${D("shape")}</span>
        <span class="bar"></span>
        ${w([])}
        <span class="name">
          <b>${Q(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${m}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${D("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?_c(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?f:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${tt(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Jc,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=Nc(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Xi(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          ${this.renderShapeTabs(t,i)}
          <span class="spacer"></span>
          <span class="inbox" title=${`Layouts are made in the ${$n.label} box. Smaller cases scale it down.`}>
            <span class="pre">Preview as</span>
            <select aria-label="Preview as" @change=${o=>{this.previewCase=o.target.value}}>
              ${ui.map(o=>h`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
            </select>
          </span>
          <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
        </div>
        <div class="stage">
          ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):f}
      </div>
      <div class="under-grid">
        ${this.renderSharedValues(t)}
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?lt(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||lt(s,o)?.locked)?dt(s,l).map(y=>y.payload.id):[],c=[...new Set([...d,...this.multi])],u=a.slots[t],p=this.focusTapId(),m={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??o,...c.length>0&&!this.showTaps?{highlightIds:c}:{},tapReview:this.showTaps,...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(t,y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${ia(r,m)}
    </div>`}renderUnder(t,i){let a=me(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(u=>u.payload.id===r.id):void 0,s;if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${st(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let u=t.groups?.find(m=>m.id===r.id),p=u?dt(t,u.id).length:0;s=u?h`editing group <b>${u.name}</b>. Drag to move all ${p} layers.${u.locked?"":" Click one layer to move it alone."}`:""}else if(o){let u=lt(t,o.payload.id);s=u?.locked?h`editing <b>${Oe(o,a)}</b> in <b>${u.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${Oe(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else s="click a layer to edit it";if(i==="inline")return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let l=this.currentCase().slots[i],d=Qi(l,i),c=Math.round(d.scale*100);return h`<div class="under">
      <b>${Q(i)}</b>
      <span class="size">${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?kn((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??f}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(t){let i=t.values,a=new pt(this.buildContext(),this.draft?.config),r=me(this.host());return h`<div class="card tint-values values-list" style=${`--c:${te.complication}`}>
      <h2 class="panel-title"><span class="swatch">${D("content")}</span>Shared values
        <span class="mini" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">defined once, read by several layers</span>
        <span class="spacer"></span>
        ${this.canEdit?h`<button class="small" @click=${()=>{let o=bc();this.mutate(s=>{s.values.push(o)}),this.inspect={kind:"data",id:o.id}}}>Add</button>`:f}
      </h2>
      ${i.length===0?h`<p class="empty">No shared values yet.</p>`:h`<div class="data">
      ${i.map(o=>{let s=a.resolve({kind:{kind:"named",id:o.id}}),l=this.inspect.kind==="data"&&this.inspect.id===o.id;return h`<div class="datum vrow ${l?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:o.id}}}>
          <span class="nm">${o.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${s===void 0?"none":""}" title=${Ce(o.value,r)}>${s??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${d=>{d.stopPropagation(),this.mutate(c=>{c.values=c.values.filter(u=>u.id!==o.id)}),l&&(this.inspect={kind:"general"})}}>${D("delete")}</button>`:f}
        </div>`})}
      </div>`}
    </div>`}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies;return Zt.map(r=>{if(!a.includes(r))return h`<button class="tab off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${Q(r)} shape`} @click=${()=>this.addShape(r)}>
          ${D("plus")}${Q(r)}
        </button>`;let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?ia(c,{icons:this.icons,imageSizes:this.imageSizes,slot:$n.slots[r]}):f}let l=r!=="inline"&&za(t,r)===0&&t.elements.length>0,d=this.canEdit&&ra(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${Q(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${Q(r)}</span>${l?h`<small>nothing shown</small>`:f}${o?h`<small>editing</small>`:f}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!d}
          title=${d?`Remove the ${Q(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${Q(r)} shape`}
          @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${D("delete")}</button>`:f}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return f;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${te.states}`}>
      <h2 class="panel-title"><span class="swatch">${D("states")}</span>Values on the watch
        <span class="mini">live · click one to try another</span><span class="spacer"></span>
        ${a?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?h`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:h`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],s=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,l=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${l}`:"not in Home Assistant",c=this.testValues.get(r),p=t.elements.find(y=>Wi(t,y.payload.id).some(b=>b.ref.entityId===r))?.kind??"text",m=this.editingValue===r;return h`<button class="vchip vrow ${c!==void 0?"testing":""}" style=${`--k:${ve[p]}`}
            title=${c!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${y=>{y.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="kbar"></span><b>${s}</b><span class="spacer"></span>
            ${m?h`<input type="text" .value=${c??o?.state??""} aria-label=${`Test value for ${s}`}
                  @keydown=${y=>{y.key==="Enter"&&y.target.blur(),y.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${y=>this.commitTestValue(r,y.target.value)} />`:h`<span class="val">${c!==void 0?`${c}${l}`:d}</span>`}
          </button>`})}
      </div>`}
    </div>`}commitTestValue(t,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[t]?.state;a===""||a===o?r.delete(t):r.set(t,a),this.testValues=r}currentCase(){return ui.find(t=>t.label===this.previewCase)??$n}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":Q(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${te.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=f,d=f;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let c=t.elements.find(u=>u.payload.id===a.id);if(c){l=h`<span class="here" style=${`--k:${ve[c.kind]}`}><span class="kchip">${Sn[c.kind]}</span>${Oe(c,me(this.host()))}</span>`;let u=lt(t,c.payload.id);u&&(d=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(u=>u.id===a.id);c&&(l=h`<span class="here" style=${`--k:${te.group}`}><span class="kchip">Group</span>${c.name}</span>`)}else if(a.kind==="data"){let c=t.values.find(u=>u.id===a.id);c&&(l=h`<span class="here" style=${`--k:${te.complication}`}><span class="kchip">Value</span>${c.name||"(unnamed)"}</span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${d}
      ${l===f?f:h`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}complicationHead(t){let i=t.name.trim()||"Complication";return h`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${te.complication}`}>${i}</span></div>
      <span class="comp-acts">
        <button class="ghost" @click=${()=>this.openRaw()}>Raw JSON</button>
        <button class="ghost" @click=${()=>this.openShareDialog()}>Share</button>
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
          ${ye(a,"complication","Complication",fc(a),{color:te.complication,icon:"watch",alwaysOpen:!0})}
          <p class="insp-note">Click a layer on the watch or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>
        </div>`;let s=f,l=!0;if(r.kind==="layer"){let c=t.elements.find(u=>u.payload.id===r.id);if(!c)return this.inspect={kind:"general"},f;s=$c(a,c,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let c=t.groups?.find(u=>u.id===r.id);if(!c)return this.inspect={kind:"general"},f;l=!1,s=Sc(a,c)}else if(r.kind==="data"){let c=t.values.find(u=>u.id===r.id);if(!c)return this.inspect={kind:"general"},f;l=!1,s=ye(a,"shared-value","Shared value",yc(a,c),{color:te.complication,icon:"content",summary:'Read by layers whose Source is "Named value"',alwaysOpen:!0})}else s=Tc(a,this.activeFamily);let d=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?h`<button class="expand" @click=${()=>{this.openSections=d?new Set([vg(r)]):new Set(Io)}}>${d?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${s}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:f}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=me(r),s=new pt(this.buildContext(),this.draft?.config),l=vc(t,a,i),d=i.length,c=[...i].reverse(),u=m=>this.mutate(y=>{for(let b of i)Te(y,a,b.payload.id,{isHidden:m})}),p=m=>this.mutate(y=>{for(let b of i){let x=y.elements.find($=>$.payload.id===b.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&x.kind!=="timeline"&&(x.payload.colorSlot.baseColorHex=m)}},"multi-colour");return h`
      ${ye(r,"picked",`${d} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${c.map(m=>h`<div class="row" style=${`--k:${ve[m.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${m.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(m.payload.symbol)??"questionmark",16,m.payload.colorSlot.baseColorHex)??f}</span>`:f}
                  <b>${Oe(m,o)}</b><span class="kind">${Sn[m.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${_t}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${$i}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${d}`,alwaysOpen:!0})}
      ${ye(r,"picked-common",`All ${d} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${de("Colour",l.colour,m=>{m!==void 0&&p(m)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:f}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${Q(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:te.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return f;let i=this.records.find(r=>r.id===this.selectedId),a=sd({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
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
    </details>`}};L([dn({attribute:!1})],A.prototype,"hass",2),L([dn({type:Boolean})],A.prototype,"narrow",2),L([dn({attribute:!1})],A.prototype,"panel",2),L([P()],A.prototype,"colLeft",2),L([P()],A.prototype,"colRight",2),L([P()],A.prototype,"panelWidth",2),L([P()],A.prototype,"owners",2),L([P()],A.prototype,"ownerId",2),L([P()],A.prototype,"records",2),L([P()],A.prototype,"selectedId",2),L([P()],A.prototype,"draft",2),L([P()],A.prototype,"readOnlyReason",2),L([P()],A.prototype,"parseError",2),L([P()],A.prototype,"maxSchemaVersion",2),L([P()],A.prototype,"presets",2),L([P()],A.prototype,"occupied",2),L([P()],A.prototype,"serverToken",2),L([P()],A.prototype,"appliedToken",2),L([P()],A.prototype,"sendStatusKnown",2),L([P()],A.prototype,"polling",2),L([P()],A.prototype,"lastPollSeconds",2),L([P()],A.prototype,"sendPending",2),L([P()],A.prototype,"pages",2),L([P()],A.prototype,"templateResults",2),L([P()],A.prototype,"historySeries",2),L([P()],A.prototype,"templateError",2),L([P()],A.prototype,"templateFetchedAt",2),L([P()],A.prototype,"forced",2),L([P()],A.prototype,"showRaw",2),L([P()],A.prototype,"inspect",2),L([P()],A.prototype,"openSections",2),L([P()],A.prototype,"helpSections",2),L([P()],A.prototype,"pickerOpen",2),L([P()],A.prototype,"pickerFilter",2),L([P()],A.prototype,"pickerNote",2),L([P()],A.prototype,"testValues",2),L([P()],A.prototype,"editingValue",2),L([P()],A.prototype,"thumbStep",2),L([P()],A.prototype,"layerDetail",2),L([P()],A.prototype,"addOpen",2),L([P()],A.prototype,"addDetail",2),L([P()],A.prototype,"multi",2),L([P()],A.prototype,"collapsed",2),L([P()],A.prototype,"activeFamily",2),L([P()],A.prototype,"picking",2),L([P()],A.prototype,"pickHoverId",2),L([P()],A.prototype,"listHoverIds",2),L([P()],A.prototype,"zoomed",2),L([P()],A.prototype,"helpOpen",2),L([P()],A.prototype,"showTaps",2),L([P()],A.prototype,"timestampActiveId",2),L([P()],A.prototype,"savedName",2),L([P()],A.prototype,"presetKind",2),L([P()],A.prototype,"presetEntity",2),L([P()],A.prototype,"newOpen",2),L([P()],A.prototype,"newName",2),L([P()],A.prototype,"newFamily",2),L([P()],A.prototype,"shareOpen",2),L([P()],A.prototype,"shareMode",2),L([P()],A.prototype,"shareLabels",2),L([P()],A.prototype,"shareNote",2),L([P()],A.prototype,"importOpen",2),L([P()],A.prototype,"importText",2),L([P()],A.prototype,"importParse",2),L([P()],A.prototype,"importName",2),L([P()],A.prototype,"importMap",2),L([P()],A.prototype,"previewCase",2),L([P()],A.prototype,"loadError",2),L([P()],A.prototype,"saveError",2),L([P()],A.prototype,"saving",2),L([P()],A.prototype,"conflict",2),L([P()],A.prototype,"remoteRevision",2),L([P()],A.prototype,"confirmDelete",2),L([P()],A.prototype,"moveTarget",2),L([P()],A.prototype,"moving",2),L([P()],A.prototype,"moveError",2),L([P()],A.prototype,"version",2);var jo=A;function gt(e){return String(e?.message??e)}function Mg(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function lu(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function Fg(e,n,t,i){let a=[{label:"Shows",value:Po(e,t)}],r=Fa(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function Rg(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function Ig(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Ae(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=Gt(e.payload)??Kt(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Xe(o).length} values`}case"timeline":{let r=Mt(e.payload),o=r===void 0?[]:di(t.get(r)??""),s=Math.max(0,o.length-1);return`${Rg(qe(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Ae(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return st(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",jo);export{jo as WristAssistantPanel,su as columnFit,Fg as layerFacts};
