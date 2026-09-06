var ws=Object.defineProperty;var ks=Object.getOwnPropertyDescriptor;var A=(e,n,t,i)=>{for(var a=i>1?void 0:i?ks(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&ws(n,t,a),a};var Zt=globalThis,Qt=Zt.ShadowRoot&&(Zt.ShadyCSS===void 0||Zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Gn=Symbol(),ma=new WeakMap,Et=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Gn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(Qt&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=ma.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&ma.set(t,n))}return n}toString(){return this.cssText}},me=e=>new Et(typeof e=="string"?e:e+"",void 0,Gn),Un=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Et(t,e,Gn)},fa=(e,n)=>{if(Qt)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Zt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Kn=Qt?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return me(t)})(e):e;var{is:$s,defineProperty:Cs,getOwnPropertyDescriptor:Ss,getOwnPropertyNames:Es,getOwnPropertySymbols:Ts,getPrototypeOf:Fs}=Object,en=globalThis,ga=en.trustedTypes,Rs=ga?ga.emptyScript:"",Ms=en.reactiveElementPolyfillSupport,Tt=(e,n)=>e,Ft={toAttribute(e,n){switch(n){case Boolean:e=e?Rs:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},tn=(e,n)=>!$s(e,n),ya={attribute:!0,type:String,converter:Ft,reflect:!1,useDefault:!1,hasChanged:tn};Symbol.metadata??=Symbol("metadata"),en.litPropertyMetadata??=new WeakMap;var Re=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=ya){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&Cs(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=Ss(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(n,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??ya}static _$Ei(){if(this.hasOwnProperty(Tt("elementProperties")))return;let n=Fs(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Tt("properties"))){let t=this.properties,i=[...Es(t),...Ts(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Kn(a))}else n!==void 0&&t.push(Kn(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fa(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Ft).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Ft;this._$Em=a;let l=o.fromAttribute(t,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??tn)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};Re.elementStyles=[],Re.shadowRootOptions={mode:"open"},Re[Tt("elementProperties")]=new Map,Re[Tt("finalized")]=new Map,Ms?.({ReactiveElement:Re}),(en.reactiveElementVersions??=[]).push("2.1.2");var Zn=globalThis,ba=e=>e,nn=Zn.trustedTypes,va=nn?nn.createPolicy("lit-html",{createHTML:e=>e}):void 0,Sa="$lit$",De=`lit$${Math.random().toFixed(9).slice(2)}$`,Ea="?"+De,Is=`<${Ea}>`,Ye=document,Mt=()=>Ye.createComment(""),It=e=>e===null||typeof e!="object"&&typeof e!="function",Qn=Array.isArray,As=e=>Qn(e)||typeof e?.[Symbol.iterator]=="function",Wn=`[ 	
\f\r]`,Rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xa=/-->/g,wa=/>/g,je=RegExp(`>|${Wn}(?:([^\\s"'>=/]+)(${Wn}*=${Wn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ka=/'/g,$a=/"/g,Ta=/^(?:script|style|textarea|title)$/i,ei=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),u=ei(1),x=ei(2),tp=ei(3),Je=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Ca=new WeakMap,qe=Ye.createTreeWalker(Ye,129);function Fa(e,n){if(!Qn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return va!==void 0?va.createHTML(n):n}var Hs=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=Rt;for(let l=0;l<t;l++){let s=e[l],d,c,p=-1,h=0;for(;h<s.length&&(o.lastIndex=h,c=o.exec(s),c!==null);)h=o.lastIndex,o===Rt?c[1]==="!--"?o=xa:c[1]!==void 0?o=wa:c[2]!==void 0?(Ta.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=je):c[3]!==void 0&&(o=je):o===je?c[0]===">"?(o=a??Rt,p=-1):c[1]===void 0?p=-2:(p=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?je:c[3]==='"'?$a:ka):o===$a||o===ka?o=je:o===xa||o===wa?o=Rt:(o=je,a=void 0);let g=o===je&&e[l+1].startsWith("/>")?" ":"";r+=o===Rt?s+Is:p>=0?(i.push(d),s.slice(0,p)+Sa+s.slice(p)+De+g):s+De+(p===-2?l:g)}return[Fa(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},At=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,l=n.length-1,s=this.parts,[d,c]=Hs(n,t);if(this.el=e.createElement(d,i),qe.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(a=qe.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let p of a.getAttributeNames())if(p.endsWith(Sa)){let h=c[o++],g=a.getAttribute(p).split(De),y=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:y[2],strings:g,ctor:y[1]==="."?qn:y[1]==="?"?Yn:y[1]==="@"?Jn:ut}),a.removeAttribute(p)}else p.startsWith(De)&&(s.push({type:6,index:r}),a.removeAttribute(p));if(Ta.test(a.tagName)){let p=a.textContent.split(De),h=p.length-1;if(h>0){a.textContent=nn?nn.emptyScript:"";for(let g=0;g<h;g++)a.append(p[g],Mt()),qe.nextNode(),s.push({type:2,index:++r});a.append(p[h],Mt())}}}else if(a.nodeType===8)if(a.data===Ea)s.push({type:2,index:r});else{let p=-1;for(;(p=a.data.indexOf(De,p+1))!==-1;)s.push({type:7,index:r}),p+=De.length-1}r++}}static createElement(n,t){let i=Ye.createElement("template");return i.innerHTML=n,i}};function pt(e,n,t=e,i){if(n===Je)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=It(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=pt(e,a._$AS(e,n.values),a,i)),n}var jn=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??Ye).importNode(t,!0);qe.currentNode=a;let r=qe.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new Ht(r,r.nextSibling,this,n):s.type===1?d=new s.ctor(r,s.name,s.strings,this,n):s.type===6&&(d=new Xn(r,this,n)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=qe.nextNode(),o++)}return qe.currentNode=Ye,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Ht=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=pt(this,n,t),It(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==Je&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):As(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&It(this._$AH)?this._$AA.nextSibling.data=n:this.T(Ye.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=At.createElement(Fa(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new jn(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=Ca.get(n.strings);return t===void 0&&Ca.set(n.strings,t=new At(n)),t}k(n){Qn(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(Mt()),this.O(Mt()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=ba(n).nextSibling;ba(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},ut=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=pt(this,n,t,0),o=!It(n)||n!==this._$AH&&n!==Je,o&&(this._$AH=n);else{let l=n,s,d;for(n=r[0],s=0;s<r.length-1;s++)d=pt(this,l[i+s],t,s),d===Je&&(d=this._$AH[s]),o||=!It(d)||d!==this._$AH[s],d===m?n=m:n!==m&&(n+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},qn=class extends ut{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},Yn=class extends ut{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},Jn=class extends ut{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=pt(this,n,t,0)??m)===Je)return;let i=this._$AH,a=n===m&&i!==m||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Xn=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){pt(this,n)}};var Ls=Zn.litHtmlPolyfillSupport;Ls?.(At,Ht),(Zn.litHtmlVersions??=[]).push("3.3.3");var Ra=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Ht(n.insertBefore(Mt(),r),r,void 0,t??{})}return a._$AI(e),a};var ti=globalThis,Ve=class extends Re{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Ra(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Je}};Ve._$litElement$=!0,Ve.finalized=!0,ti.litElementHydrateSupport?.({LitElement:Ve});var _s=ti.litElementPolyfillSupport;_s?.({LitElement:Ve});(ti.litElementVersions??=[]).push("4.2.2");var zs={attribute:!0,type:String,converter:Ft,reflect:!1,hasChanged:tn},Ps=(e=zs,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(l){let s=n.get.call(this);n.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=t;return function(l){let s=this[o];n.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function ht(e){return(n,t)=>typeof t=="object"?Ps(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function L(e){return ht({...e,state:!0,attribute:!1})}var Me="wrist_assistant/complications";async function Ma(e){return e.connection.sendMessagePromise({type:`${Me}/owners`})}async function Ia(e,n){return e.connection.sendMessagePromise({type:`${Me}/list`,owner_watch_id:n})}async function Aa(e,n){return e.connection.sendMessagePromise({type:`${Me}/nudge`,owner_watch_id:n})}async function Ha(e,n,t,i){return e.connection.sendMessagePromise({type:`${Me}/save`,owner_watch_id:n,document:t,base_revision:i})}async function La(e,n,t,i){return e.connection.sendMessagePromise({type:`${Me}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function _a(e,n,t){return e.connection.sendMessagePromise({type:`${Me}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function za(e,n,t){let i={type:`${Me}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function Pa(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Me}/render_values`,templates:n})).results}async function Oa(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Me}/history_series`,requests:n})).results}var Y=["rectangular","circular","corner"],ge={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},Os=["rectangular","circular","corner","inline"];var ni=64;function ja(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<ni;i++)if(!t.has(i))return i;return-1}function Lt(e){return Y.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var mt=[["latest","Newest reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["top","Top of the scale"],["bottom","Bottom of the scale"]],qa={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},ye={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},dn="#FF6B35",cn="#32D74B",ii="#32D74B",pn="#FF453A";function ft(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function Ya(e){return e.coloring==="bands"&&e.bands.length>0}function Ja(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function Xa(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}var ai=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],ri=2,oi=120;function Za(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?Math.max(ri,Math.min(oi,n)):24}function Qa(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function et(e){let n=Qa(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${Za(e)}`}function er(e){return si(e).map(n=>n.key).sort().join(";")}function si(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=et(t.payload),a=Qa(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),points:Za(t.payload)})}return[...n.values()]}var _t=6,zt=9,Ns=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ie(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function li(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var di={top:0,left:0,bottom:0,right:0};function un(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var ci=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Ae(e){let n=ci.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function T(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function O(e,n=""){return typeof e=="string"?e:n}function P(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function Se(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function sn(e){return e==null?void 0:P(e,0)}function fe(e){return typeof e=="string"?e:void 0}var Ee=class extends Error{};function Ze(e){if(typeof e.entityId!="string")throw new Ee("entityId is required");let n={entityId:e.entityId,displayName:O(e.displayName),domain:O(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Na(e){if(!T(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=P(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=P(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=P(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Te(n)?void 0:n}function Te(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function Ds(e){let n=O(e.function,"count"),t=T(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(T).map(Ze)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(T(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:O(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Da(e){switch(e.kind){case"literal":return{kind:"literal",value:O(e.value)};case"entityState":return{kind:"entityState",...Ze(e)};case"entityAttribute":return{kind:"entityAttribute",...Ze(e),attribute:O(e.attribute)};case"entityAge":return{kind:"entityAge",...Ze(e)};case"aggregate":return{kind:"aggregate",aggregate:Ds(T(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:fe(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:O(e.value)};case"named":return{kind:"named",id:O(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:O(e.layer).toUpperCase(),stat:mt.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new Ee(`unknown value kind ${String(e.kind)}`)}}function ie(e){if(!T(e))throw new Ee("value must be an object");if(T(e.kind)){let i={kind:Da(e.kind)},a=Na(e.format);return a&&(i.format=a),i}let n={kind:Da(e)},t=Na(e.format);return t&&(n.format=t),n}function tr(e){return T(e)?{x:P(e.x,.25),y:P(e.y,.25),width:P(e.width,.5),height:P(e.height,.5),rotationDegrees:P(e.rotationDegrees,0)}:{...qa}}function Vs(e){if(!T(e))return{kind:"isOn"};let n=O(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=T(e.value)?ie(e.value):M("");break;case"between":t.value=T(e.value)?ie(e.value):M(""),t.upper=T(e.upper)?ie(e.upper):M("");break;case"matchesRegex":t.pattern=O(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Va(e){if(!T(e))return{kind:"show"};let n=O(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=T(e.value)?ie(e.value):M("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=P(e.number,0);break;case"setFontWeight":t.weight=fe(e.weight)??"regular";break;default:break}return t}function nr(e){return Array.isArray(e)?e.filter(T).map(n=>{let t={id:O(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(T).map(i=>{let a=T(i.when)?i.when:{};return{id:O(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(T).map(r=>({id:O(r.id).toUpperCase(),value:T(r.value)?ie(r.value):M(""),comparison:Vs(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Va)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Va)),t}):[]}function Bs(e,n){return{baseColorHex:T(e)?O(e.baseColorHex,n):n}}function Gs(e){if(Array.isArray(e.bands))return e.bands.filter(T).map(t=>({id:O(t.id,j()),upTo:P(t.upTo,0),colorHex:O(t.colorHex,"#FFFFFF")}));if(typeof e.bandLowerBound!="number")return[];let n=T(e.colorSlot)?O(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:j(),upTo:e.bandLowerBound,colorHex:O(e.bandLowColorHex,ii)},{id:j(),upTo:P(e.bandUpperBound,100),colorHex:n}]}function Xe(e,n){if(typeof e.id!="string")throw new Ee("element id is required");return{id:e.id.toUpperCase(),colorSlot:Bs(e.colorSlot,n),rules:nr(e.rules),frame:tr(e.frame),isHidden:e.isHidden===!0}}function Us(e){let n=Ks(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),n}function Ks(e){if(!T(e)||!T(e.payload))throw new Ee("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...Xe(n,"#FFFFFF"),value:T(n.value)?ie(n.value):M(""),fontSize:P(n.fontSize,14),fontWeight:fe(n.fontWeight)??"regular"};return n.countdown===!0&&(t.countdown=!0),{kind:"text",payload:t}}case"icon":return{kind:"icon",payload:{...Xe(n,"#FFFFFF"),symbol:T(n.symbol)?ie(n.symbol):M("lightbulb"),size:P(n.size,14)}};case"gauge":return{kind:"gauge",payload:{...Xe(n,"#FFFFFF"),value:T(n.value)?ie(n.value):M("50"),minValue:P(n.minValue,0),maxValue:P(n.maxValue,100),style:fe(n.style)??"arc",lineWidth:P(n.lineWidth,4),trackColorHex:O(n.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...Xe(n,"#FFFFFF"),value:T(n.value)?ie(n.value):M("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(P(n.historyMinutes,0))),historyPoints:Math.round(P(n.historyPoints,24)),style:fe(n.style)??"bars",limit:Math.max(0,Math.round(P(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:fe(n.scale)??"auto",minValue:P(n.minValue,0),maxValue:P(n.maxValue,100),baseline:fe(n.baseline)??"lowest",barGap:P(n.barGap,1.5),lineWidth:P(n.lineWidth,2),highlight:fe(n.highlight)??"none",highColorHex:O(n.highColorHex,dn),lowColorHex:O(n.lowColorHex,cn),marker:fe(n.marker)??"pointer",coloring:fe(n.coloring)??"uniform",bands:Gs(n),bandAboveColorHex:O(n.bandHighColorHex,O(n.bandAboveColorHex,pn)),fillBands:n.fillBands===!0}};case"shape":{let t={...Xe(n,"#FFFFFF33"),kind:fe(n.kind)??"roundedRectangle",cornerRadius:P(n.cornerRadius,6),borderWidth:P(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=Xe(n,"#FFFFFF"),a={...i,entity:Ze(T(n.entity)?n.entity:{}),contentMode:n.contentMode==="fit"?"fit":"fill",zoom:P(n.zoom,1),panX:P(n.panX,0),panY:P(n.panY,0),cornerRadius:P(n.cornerRadius,_t),timestampCorner:Ns.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:P(n.timestampSize,zt)};n.timestamp===!0&&(a.timestamp=!0);let r=sn(n.timestampX),o=sn(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=Se(r),a.timestampY=Se(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=Xe(n,"#FFFFFF"),a={...i,action:T(n.action)?ir(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new Ee(`unknown element kind ${String(e.kind)}`)}}function Ba(e){let n=T(e)?e:{},t={};if(T(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!T(r))continue;let o={frame:tr(r.frame),isHidden:r.isHidden===!0},l=sn(r.size);l!==void 0&&(o.size=l),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:P(n.borderWidth,2),rules:nr(n.rules)};if(T(n.bezelText)&&(i.bezelText=ie(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),T(n.curvedText)&&(i.curvedText=ie(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),T(n.bezelGauge)){let a=n.bezelGauge,r={value:T(a.value)?ie(a.value):M("50"),minValue:P(a.minValue,0),maxValue:P(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};T(a.minLabel)&&(r.minLabel=ie(a.minLabel)),T(a.maxLabel)&&(r.maxLabel=ie(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function Ws(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Ba(e[t+1]))}else if(T(e))for(let[t,i]of Object.entries(e))n[t]=Ba(i);return n}function js(e){let n={value:T(e.value)?ie(e.value):M("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function ir(e){if(!T(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Ze(e)};default:return{type:"none"}}}function ar(e){if(!T(e))throw new Ee("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Ee(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(T).map(r=>({id:O(r.id).toUpperCase(),name:O(r.name),value:T(r.value)?ie(r.value):M("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(T).map(r=>r.kind==="template"?{kind:"template",value:O(r.value)}:r.kind==="entity"?{kind:"entity",...Ze(r)}:null).filter(r=>r!==null),i={schemaVersion:P(e.schemaVersion,1),id:O(e.id).toUpperCase(),name:O(e.name,"Custom"),values:n,slotIndex:P(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Us),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Ws(e.perFamily),dataSources:t,tapAction:ir(e.tapAction)};T(e.inline)&&(i.inline=js(e.inline));let a=sn(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(T).filter(o=>typeof o.id=="string").map(o=>({id:O(o.id).toUpperCase(),name:O(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Ys(i,Array.isArray(e.elements)?e.elements:[]),_e(i),i}function pi(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Pt(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function qs(e,n){let t=ln(e,Nt(n))?.ref;return t?.displayName||t?.entityId||"Chart"}function rr(e,n,t){let i=He(e,n.payload.id);if(i){hi(e,t,i.id);return}ui(e,[n.payload.id,t],qs(e,n))}var or={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1}};function sr(e,n,t,i){let a=ge.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),l=e.x+n.x*e.width-n.x*r,s=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,l)),y:Math.max(0,Math.min(1-o,s)),width:r,height:o,rotationDegrees:0}}function lr(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=Be("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};t==="latest"&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"},a.payload.frame=sr(i.payload.frame,or[t],r,t==="latest"?7:4);let l=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(l+1,0,a),rr(e,i,a.payload.id),a.payload.id}function Ys(e,n){for(let t of n){if(!T(t)||t.kind!=="chart"||!T(t.payload))continue;let i=t.payload,a=O(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=O(i.scaleLabelColorHex,"#FFFFFF99"),l=h=>{let g=T(h)?h:{};return{fontSize:P(g.fontSize,8),colorHex:O(g.colorHex,o),pillColorHex:typeof g.pillColorHex=="string"?g.pillColorHex:void 0}},s=[],d=fe(i.scaleLabels);(d==="top"||d==="range")&&s.push(["top",l(i.topLabelStyle)]),d==="range"&&s.push(["bottom",l(i.bottomLabelStyle)]);let c=fe(i.latestLabel);if((c==="corner"||c==="end")&&s.push(["latest",l(i.latestLabelStyle)]),s.length===0)continue;let p=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,g]of s){let y=sr(r.payload.frame,or[h],g.fontSize,h==="latest"?5:4),$=[];if(g.pillColorHex!==void 0){let R=Be("shape");R.payload.kind="capsule",R.payload.colorSlot={baseColorHex:g.pillColorHex},R.payload.frame={...y},$.push(R)}let k=Be("text");k.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},k.payload.fontSize=g.fontSize,k.payload.fontWeight="medium",k.payload.colorSlot={baseColorHex:g.colorHex},k.payload.frame=y,$.push(k),e.elements.splice(p,0,...$),p+=$.length;for(let R of $)rr(e,r,R.payload.id)}}}function G(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function Qe(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Js(e){let n={};return e.decimals!==void 0&&(n.decimals=G(e.decimals)),e.multiply!==void 0&&(n.multiply=G(e.multiply)),e.offset!==void 0&&(n.offset=G(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function Xs(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(Qe)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Zs(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...Qe(e)};case"entityAttribute":return{kind:"entityAttribute",...Qe(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...Qe(e)};case"aggregate":return{kind:"aggregate",aggregate:Xs(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function X(e){let n={kind:Zs(e.kind)};return Te(e.format)||(n.format=Js(e.format)),n}function rn(e){return{x:G(e.x),y:G(e.y),width:G(e.width),height:G(e.height),rotationDegrees:G(e.rotationDegrees)}}function Qs(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=X(e.value??M(""));break;case"between":n.value=X(e.value??M("")),n.upper=X(e.upper??M(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function Ga(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=X(e.value??M(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=G(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function on(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:X(a.value),comparison:Qs(a.comparison)}))},then:i.then.map(Ga)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(Ga)),t})}function el(e){let n=tl(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),n}function tl(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:on(t.rules),frame:rn(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:X(e.payload.value),fontSize:G(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(t.countdown=!0),{kind:"text",payload:t}}case"icon":return{kind:"icon",payload:{...n(e.payload),symbol:X(e.payload.symbol),size:G(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...n(e.payload),value:X(e.payload.value),minValue:G(e.payload.minValue),maxValue:G(e.payload.maxValue),style:e.payload.style,lineWidth:G(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...n(e.payload),value:X(e.payload.value),historyMinutes:Math.max(0,Math.round(e.payload.historyMinutes)),historyPoints:Math.round(e.payload.historyPoints),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:G(e.payload.minValue),maxValue:G(e.payload.maxValue),baseline:e.payload.baseline,barGap:G(e.payload.barGap),lineWidth:G(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker,coloring:e.payload.coloring,bands:e.payload.bands.map(t=>({id:t.id,upTo:G(t.upTo),colorHex:t.colorHex})),bandAboveColorHex:e.payload.bandAboveColorHex,fillBands:e.payload.fillBands}};case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:G(e.payload.cornerRadius),borderWidth:G(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:Qe(t.entity),rules:on(t.rules),frame:rn(t.frame),isHidden:t.isHidden};t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=G(t.zoom)),t.panX!==0&&(i.panX=G(t.panX)),t.panY!==0&&(i.panY=G(t.panY)),t.cornerRadius!==_t&&(i.cornerRadius=G(t.cornerRadius));let a=Ie(t),r=a?li(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==zt&&(i.timestampSize=G(t.timestampSize)),a&&(i.timestampX=G(t.timestampX),i.timestampY=G(t.timestampY)),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:dr(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=on(t.rules),i.frame=rn(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}}}function nl(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:rn(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=G(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=X(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=X(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:X(i.value),minValue:G(i.minValue),maxValue:G(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=X(i.minLabel)),i.maxLabel&&(a.maxLabel=X(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=G(e.borderWidth),e.rules.length>0&&(n.rules=on(e.rules)),n}function dr(e){return"entityId"in e?{type:e.type,...Qe(e)}:{type:e.type}}function il(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=X(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function hn(e){let n=[];for(let i of Y){let a=e.perFamily[i];a&&n.push(i,nl(a))}let t={schemaVersion:Lt(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:X(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(el),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...Qe(i)}),tapAction:dr(e.tapAction)};return e.inline!==void 0&&(t.inline=il(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),t}function He(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Le(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!le(e,t))}function _e(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function gt(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!le(e,r)),t=e.elements.filter(r=>le(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=n.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...t],Ge(e)}function ui(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!le(e,r));if(i.length<2)return;let a={id:j(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return _e(e),gt(e),a.id}function Ot(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;_e(e)}function hi(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||le(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,_e(e),gt(e))}var B={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},Ua={literal:["kind","value"],entityState:["kind",...B.entityRef],entityAttribute:["kind",...B.entityRef,"attribute"],entityAge:["kind",...B.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function cr(e){let n=[],t=(s,d,c)=>{if(T(s))for(let p of Object.keys(s))d.includes(p)||n.push(`${c}.${p}`)},i=(s,d)=>{if(!T(s))return;let c=typeof s.kind=="string"?s.kind:"";t(s,Ua[c]??["kind"],d),c==="aggregate"&&T(s.aggregate)&&(t(s.aggregate,B.aggregate,`${d}.aggregate`),t(s.aggregate.scope,B.scope,`${d}.aggregate.scope`),T(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((p,h)=>t(p,B.entityRef,`${d}.aggregate.scope.entities[${h}]`)),t(s.aggregate.stateFilter,B.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(T(s)){if(T(s.kind))t(s,B.value,d),i(s.kind,`${d}.kind`);else{let c=typeof s.kind=="string"?s.kind:"";t(s,[...Ua[c]??["kind"],"format"],d),c==="aggregate"&&i(s,d)}t(s.format,B.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((c,p)=>{t(c,B.styleChange,`${d}[${p}]`),T(c)&&a(c.value,`${d}[${p}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((c,p)=>{let h=`${d}[${p}]`;t(c,B.rule,h),T(c)&&(Array.isArray(c.cases)&&c.cases.forEach((g,y)=>{let $=`${h}.cases[${y}]`;t(g,B.case,$),T(g)&&(t(g.when,B.condition,`${$}.when`),T(g.when)&&Array.isArray(g.when.tests)&&g.when.tests.forEach((k,R)=>{let b=`${$}.when.tests[${R}]`;t(k,B.test,b),T(k)&&(a(k.value,`${b}.value`),t(k.comparison,B.comparison,`${b}.comparison`),T(k.comparison)&&(a(k.comparison.value,`${b}.comparison.value`),a(k.comparison.upper,`${b}.comparison.upper`)))}),r(g.then,`${$}.then`))}),r(c.otherwise,`${h}.otherwise`))})};if(!T(e))return n;t(e,B.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>t(s,B.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{t(s,B.named,`$.values[${d}]`),T(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let c=`$.elements[${d}]`;if(t(s,B.elementEnvelope,c),!T(s)||!T(s.payload))return;let p=typeof s.kind=="string"?s.kind:"",h=B[p]??[];t(s.payload,[...B.elementBase,...h],`${c}.payload`),t(s.payload.colorSlot,B.colorSlot,`${c}.payload.colorSlot`),t(s.payload.frame,B.frame,`${c}.payload.frame`),o(s.payload.rules,`${c}.payload.rules`);for(let g of["value","symbol"])g in s.payload&&a(s.payload[g],`${c}.payload.${g}`);p==="image"&&t(s.payload.entity,B.entityRef,`${c}.payload.entity`),p==="tap"&&t(s.payload.action,B.tapAction,`${c}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else T(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let c=`$.perFamily.${s}`;if(t(d,B.layout,c),!!T(d)){if(T(d.placements))for(let[p,h]of Object.entries(d.placements))t(h,B.placement,`${c}.placements.${p}`),T(h)&&t(h.frame,B.frame,`${c}.placements.${p}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),T(d.bezelGauge)){let p=`${c}.bezelGauge`;t(d.bezelGauge,B.bezelGauge,p),a(d.bezelGauge.value,`${p}.value`),a(d.bezelGauge.minLabel,`${p}.minLabel`),a(d.bezelGauge.maxLabel,`${p}.maxLabel`)}o(d.rules,`${c}.rules`)}}return T(e.inline)&&(t(e.inline,B.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>t(s,B.dataSource,`$.dataSources[${d}]`)),t(e.tapAction,B.tapAction,"$.tapAction"),n}function j(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function mi(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function pr(e,n,t=[...Y]){let i={};for(let r of Y)t.includes(r)&&(i[r]=mi());let a={schemaVersion:4,id:j(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:Os.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:M("Text")}),a.schemaVersion=Lt(a),a}function Be(e){let n=t=>({id:j(),colorSlot:{baseColorHex:t},rules:[],frame:{...qa},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:M("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:M("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:M("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:M("13,14,16,17,19,22,24,28,30"),historyMinutes:0,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:dn,lowColorHex:cn,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:pn,fillBands:!1}};case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:_t,timestampCorner:"topLeading",timestampSize:zt}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function M(e){return{kind:{kind:"literal",value:e}}}function ur(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Nt(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function fi(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var gi=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function ln(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=pi(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function yi(e,n){return ln(e,Nt(n))?.ref}function bi(e,n){let t=yi(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&gi.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function Ka(e,n,t){if(un(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,l=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=Se(a),r=Se(r),o=Se(o),l=Se(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function hr(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function mr(e,n,t,i){let a=e.elements.find(h=>h.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,l=Se(i.x),s=Se(i.y),d=Se(i.x+i.width),c=Se(i.y+i.height),p={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,c-s)};a.payload.outset=hr(o,p,ge[t])}function fr(e,n,t){let i=e.elements.find(l=>l.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=ge[t];return{width:r.width*o.width,height:r.height*o.height}}function be(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function le(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function vi(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function Ge(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=t.get(r);l?l.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=hr(o.payload.frame,s.frame,ge.rectangular));let d=s.outset,c=!un(d);l.payload.frame=Ka(o.payload.frame,d,ge.rectangular),l.payload.isHidden=o.payload.isHidden;for(let p of Y){let h=e.perFamily[p];if(!h)continue;let g=ge[p],y=h.placements[a];if(c){let $=y?.frame??o.payload.frame,k=y?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:Ka($,d,g),isHidden:k}}else y?h.placements[l.payload.id]={frame:{...y.frame},isHidden:y.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function mn(e,n,t){let i=e.elements.find(l=>l.payload.id===n);if(!i||i.kind==="tap")return;let a=be(e,n)[0];if(a)return a.payload;let r=Be("tap"),o=r.payload;return o.attachedTo=n,o.outset={...di},o.action=t??bi(e,i),e.elements.push(r),Ge(e),o}function xi(e,n){let t=be(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of Y)for(let a of t)delete e.perFamily[i]?.placements[a]}}function fn(e,n){for(let t of Pt(e,n))fn(e,t.payload.id);xi(e,n),e.elements=e.elements.filter(t=>t.payload.id!==n);for(let t of Y)delete e.perFamily[t]?.placements[n];Ge(e),_e(e)}function gr(e,n){let t=e.elements.findIndex(s=>s.payload.id===n),i=e.elements[t];if(!i)return;let a=j(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[n,a]];for(let s of be(e,n)){let d=structuredClone(s);d.payload.id=j(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let s of Y){let d=e.perFamily[s];if(d)for(let[c,p]of l){let h=d.placements[c];h&&(d.placements[p]=structuredClone(h))}}return Ge(e),a}function wi(e,n){let t=new Set,i=s=>{t.add(s);for(let d of be(e,s))t.add(d.payload.id)};for(let s of n){i(s);for(let d of Pt(e,s))i(d.payload.id)}let a=e.elements.filter(s=>t.has(s.payload.id)).map(s=>structuredClone(s)),r={};for(let s of Y){let d=e.perFamily[s];if(!d)continue;let c={};for(let p of a){let h=d.placements[p.payload.id];h&&(c[p.payload.id]=structuredClone(h))}Object.keys(c).length>0&&(r[s]=c)}let o=new Set(a.map(s=>s.payload.groupId).filter(s=>s!==void 0)),l=(e.groups??[]).filter(s=>o.has(s.id)).map(s=>structuredClone(s));return{elements:a,placements:r,groups:l}}function ki(e,n){let t=new Map;for(let s of n.elements)t.set(s.payload.id,j());let i=new Set(e.elements.map(s=>s.payload.id)),a=n.elements.some(s=>i.has(s.payload.id)),r=s=>a?{...s,x:Math.min(.9,s.x+.05),y:Math.min(.9,s.y+.05)}:s,o=[];for(let s of n.elements){let d=structuredClone(s);if(d.payload.id=t.get(s.payload.id),d.kind==="tap"&&d.payload.attachedTo!==void 0){let c=t.get(d.payload.attachedTo);c?d.payload.attachedTo=c:delete d.payload.attachedTo}if(d.kind==="text"&&d.payload.value.kind.kind==="chartStat"){let c=t.get(d.payload.value.kind.layer);if(c)d.payload.value.kind.layer=c;else if(!i.has(d.payload.value.kind.layer))continue}d.payload.frame=r(d.payload.frame),o.push(d)}let l=new Map;for(let s of n.groups){if(o.filter(p=>p.payload.groupId===s.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let c=j();l.set(s.id,c),(e.groups??=[]).push({...structuredClone(s),id:c})}for(let s of o){if(s.payload.groupId===void 0)continue;let d=l.get(s.payload.groupId);d?s.payload.groupId=d:delete s.payload.groupId}e.elements.push(...o);for(let s of Y){let d=n.placements[s],c=e.perFamily[s];if(!(!d||!c))for(let[p,h]of Object.entries(d)){let g=t.get(p);g&&o.some(y=>y.payload.id===g)&&(c.placements[g]={...structuredClone(h),frame:r(h.frame)})}}return Ge(e),_e(e),gt(e),o.filter(s=>!le(e,s)).map(s=>s.payload.id)}function gn(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=ln(e,Nt(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of be(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=ln(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function Wa(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function yr(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||t.entityId==="")return;let a={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=Wa(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=Wa(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of be(e,n)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var yn={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},br=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function tt(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function bn(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function $i(){return{id:j(),value:M(""),comparison:{kind:"isOn"}}}function Ci(){return{id:j(),when:{join:"all",tests:[$i()]},then:[]}}function Dt(){return{id:j(),cases:[Ci()]}}function Si(e,n){let t={kind:n};switch(tt(n)){case"value":t.value=e.value??M("");break;case"between":t.value=e.value??M(""),t.upper=e.upper??M("");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function nt(e){let n={kind:e};switch(bn(e)){case"value":n.value=M(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}function vr(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function xr(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function kr(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function $r(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function wr(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Ti(e,n,t=0){let i=n instanceof Map?n:$r(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Ti(o,i,t+1):wr(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!wr(a))return;let r=Ei(a);if(r!==void 0)return"e_"+kr(r)}function xe(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function al(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>xe(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))n=o.length===0?"[]":"("+o.map(p=>`(states.${p} | list)`).join(" + ")+")";else{let p=[];for(let h of l)p.push(`area_entities(${xe(h)})`);for(let h of s)p.push(`label_entities(${xe(h)})`);d.length>0&&p.push(`((${d.map(h=>`floor_areas(${xe(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${p.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(xe).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${xe(i.value)})`:t+=` | rejectattr('state', 'eq', ${xe(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${xe(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function Ei(e){switch(e.kind){case"entityAttribute":return`state_attr(${xe(e.entityId)}, ${xe(e.attribute)})`;case"entityAge":{let n=xe(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return al(e.aggregate);default:return}}function Fi(e){let n=new Map,t=new Map,i=$r(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=Ei(d.kind);if(c===void 0)return;t.set("n_"+s.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=Ei(s);if(d===void 0)return;t.set("e_"+kr(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Nt(o);l&&a(l);for(let s of fi(o.payload.rules))a(s)}for(let o of Y){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of fi(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=rl(t)),r}function rl(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function Cr(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,ol(r));return{values:t,nullKeys:i}}function ol(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Ri(e){let n=Fi(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function sl(e,n){if(e.values.length!==0)switch(n){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((t,i)=>t+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin}}function vn(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function yt(e){let n=e.trim(),t=vn(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:vn(i)}function ll(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function dl(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function cl(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function pl(e,n,t){if(Te(n))return e;let i=n,a=e,r=vn(e.trim());if(i.relativeTime&&r!==void 0)a=dl(r);else{let o=yt(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):ll(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=cl(a);break}return a}function bt(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Vt(e,n=240){let t=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&t.push(o)}i=""};for(let o of e){if(t.length>=n)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let l=!a;r(),l&&(i+=o),a=!1}else r(),a=!1}return t.length<n&&r(),t}function ul(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function hl(e,n,t){if(e===void 0)return 0;let i=yt(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var ze=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let t=et(n),i=t!==void 0?this.ctx.historySeries?.get(t)??"":this.resolve(n.value)??"",a=Vt(i);n.limit>0&&a.length>n.limit&&(a=n.takeFromEnd?a.slice(a.length-n.limit):a.slice(0,n.limit));let r=ul(a,n),o={values:a,domainMin:r.min,domainMax:r.max},l=this.dereference(n.value);return l&&"entityId"in l.kind&&(o.entity={entityId:l.kind.entityId,displayName:l.kind.displayName,domain:l.kind.domain}),o}settleCharts(n){for(let t of n.elements)t.kind==="chart"&&this.charts.set(t.payload.id,this.chartReadings(t.payload))}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!Te(a)?a:l.format,t=l}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?sl(a,t.kind.stat):void 0;i=a&&r!==void 0?Xa(r,a.domainMax-a.domainMin):void 0;break}default:{let a=Ti(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return pl(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=vn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?bt(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=yt(i),r=()=>this.resolve(t.value),o=()=>{let s=r();return s===void 0?void 0:yt(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(t.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(t.upper),c=d===void 0?void 0:yt(d);if(a===void 0||s===void 0||c===void 0)return!1;let[p,h]=s<=c?[s,c]:[c,s];return a>=p&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(ye[l.kind],l)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveElement(n,t){let i=n.payload,a=this.applyRules(i.rules,t),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,c={id:i.id,isHidden:o,frame:s,opacity:d};switch(n.kind){case"text":{let p=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,h=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,g={kind:"text",...c,text:this.styleText(a,"text")??h??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??n.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex};return p!==void 0&&(g.countdownEnd=p),g}case"icon":{let p=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle";return{kind:"icon",...c,symbol:this.styleText(a,"icon")??p,size:this.styleNumber(a,"fontSize")??n.payload.size,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex}}case"gauge":{let p=this.styleText(a,"gaugeValue")??this.resolve(n.payload.value),h=this.styleNumber(a,"gaugeMin")??n.payload.minValue,g=this.styleNumber(a,"gaugeMax")??n.payload.maxValue;return{kind:"gauge",...c,fraction:hl(p,h,g),style:n.payload.style,lineWidth:n.payload.lineWidth,colorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,trackColorHex:n.payload.trackColorHex}}case"chart":{let p=n.payload,h=this.charts.get(p.id)??this.chartReadings(p),g=h.values,y={min:h.domainMin,max:h.domainMax},$=this.styleColor(a,"color")??p.colorSlot.baseColorHex,k=ft(p),R=Ya(p)?g.map(f=>Ja(f,k,p.bandAboveColorHex)):[],b={kind:"chart",...c,values:g,style:p.style,domainMin:y.min,domainMax:y.max,baseline:p.baseline,barGap:p.barGap,lineWidth:p.lineWidth,colorHex:$,highColorHex:p.highColorHex,lowColorHex:p.lowColorHex,marker:p.marker,pointColorHexes:R,fillBands:p.fillBands};if(g.length>0){let f=p.highlight==="highest"||p.highlight==="both",w=p.highlight==="lowest"||p.highlight==="both",E=f?g.indexOf(Math.max(...g)):-1,z=w?g.indexOf(Math.min(...g)):-1;E>=0&&(b.highIndex=E),z>=0&&z!==E&&(b.lowIndex=z)}return b}case"shape":{let p={kind:"shape",...c,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??n.payload.borderWidth},h=this.styleColor(a,"borderColor")??n.payload.borderColorHex;return h!==void 0&&(p.borderColorHex=h),p}case"image":{let p={kind:"image",...c,entityId:n.payload.entity.entityId,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};Ie(n.payload)&&(p.timestampX=n.payload.timestampX,p.timestampY=n.payload.timestampY);let h=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return h!==void 0&&(p.url=h),p}case"tap":{let p={kind:"tap",...c,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(p.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(p.attachedTo=n.payload.attachedTo),p}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=ur(n,t).map($=>this.resolveElement($,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:t,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,c=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=s??c??this.resolve(a?.bezelText);p!==void 0&&(l.bezelText=p),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let $=a.bezelGauge,k=this.resolve($.value),R=k===void 0?void 0:yt(k);if(R!==void 0){let b=Math.min($.minValue,$.maxValue),f=Math.max($.minValue,$.maxValue),w={value:Math.min(f,Math.max(b,R)),minValue:b,maxValue:f===b?b+1:f,colorHexes:$.colorHexes},E=this.resolve($.minLabel);E!==void 0&&(w.minLabel=E);let z=this.resolve($.maxLabel);z!==void 0&&(w.maxLabel=z),l.bezelGauge=w}}let g=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;g!==void 0&&(l.backgroundColorHex=g);let y=this.styleColor(o,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function ml(e,n,t){let i=new ze(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Mi(e,n,t){let i=new ze(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=ml(e.inline,n,e)),a}var ue=ge,Bt=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:ue,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Gt=Bt.find(e=>e.measured);function Hr(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Bt.find(a=>a.screen.width===t&&a.screen.height===i)}function wn(e,n){let t=ue[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var fl={regular:400,medium:500,semibold:600,bold:700};function Fe(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function Pe(e,n,t="#FFFFFF"){let i=Fe(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function Lr(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}function gl(e,n){let t=Pe(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:bt((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,l=e.text;if(n.w>0&&l.length*i(o)>n.w){let s=n.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return x`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${fl[e.fontWeight]??400}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${l}</text>`}function yl(e,n){let t=Pe(e.colorHex,"stroke"),i=Pe(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=n.w,g=Math.max(a,h*e.fraction);return x`
      <rect x=${n.x} y=${n.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-a/2} width=${g} height=${a} rx=${a/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />`}let r=Math.min(n.w,n.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,c=l*s,p=l*s*e.fraction;return x`
    <g transform="rotate(${d} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${c} ${l}" />
      ${e.fraction>0?x`<circle cx=${n.cx} cy=${n.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:m}
    </g>`}var bl=5;function vl(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:bl,o=e.style==="bars"?0:e.lineWidth/2,l=n.x,s=Math.max(n.w,0),d=n.y+r+o,c=Math.max(n.h-r-o*2,1),p=d+c,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),g=e.baseline==="lowest",y=g?c*.12:0,$=Math.min(Math.max(e.barGap,0),s/(i*2)),k=Math.max((s-$*(i-1))/i,.5),R=f=>Math.min(1,Math.max(0,(f-e.domainMin)/h)),b=f=>p-R(f)*c;return{count:t.length,barWidth:k,plotTop:d,plotBottom:p,baselineY:g?p:b(0),barRect(f){let w=l+f*(k+$),E=t[f],z,N;if(g){let ne=y+R(E)*(c-y);z=p-ne,N=p}else z=b(E),N=g?p:b(0),z>N&&([z,N]=[N,z]);return{x:w,y:z,w:k,h:Math.max(N-z,.5)}},point(f){let w=Math.max(s-o*2,0);return{x:t.length>1?l+o+w*f/(t.length-1):l+s/2,y:b(t[f])}},markerCenter(f,w){let E=w?this.barRect(f):void 0;return{x:E?E.x+E.w/2:this.point(f).x,y:n.y+r/2}}}}function xl(e,n){if(e.values.length===0)return m;let t=vl(e,n),i=Pe(e.colorHex,"fill"),a=Pe(e.highColorHex,"fill",e.colorHex),r=Pe(e.lowColorHex,"fill",e.colorHex),o=(c,p)=>x`<circle cx=${c.x} cy=${c.y} r="1.7" fill=${p.fill} fill-opacity=${p["fill-opacity"]} />`,l=[],s=e.pointColorHexes.length===t.count,d=c=>s?Pe(e.pointColorHexes[c],"fill",e.colorHex):i;if(e.style==="bars")for(let c=0;c<t.count;c++){let p=t.barRect(c),h=c===e.highIndex?a:c===e.lowIndex?r:d(c),g=Math.min(1.2,p.w/2,p.h/2);l.push(x`<rect x=${p.x} y=${p.y} width=${p.w} height=${p.h} rx=${g}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let c=Array.from({length:t.count},(h,g)=>t.point(g)),p=c.map((h,g)=>`${g===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&s&&t.count>1)for(let h=0;h<t.count-1;h++){let g=c[h],y=c[h+1],$=d(h+1),k=`M${g.x} ${g.y} L${y.x} ${y.y} L${y.x} ${t.baselineY} L${g.x} ${t.baselineY} Z`;l.push(x`<path d=${k} fill=${$.fill}
            fill-opacity=${$["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${p} L${c[c.length-1].x} ${t.baselineY} L${c[0].x} ${t.baselineY} Z`;l.push(x`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(s&&t.count>1)for(let h=0;h<t.count-1;h++){let g=c[h],y=c[h+1],$=d(h+1);l.push(x`<path d=${`M${g.x} ${g.y} L${y.x} ${y.y}`} fill="none"
          stroke=${$.fill} stroke-opacity=${$["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(x`<path d=${p} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(o(c[e.highIndex],a)),e.lowIndex!==void 0&&l.push(o(c[e.lowIndex],r))}if(e.marker!=="none"){let c=e.style==="bars";if(e.highIndex!==void 0){let p=t.markerCenter(e.highIndex,c);l.push(e.marker==="pointer"?x`<path d=${`M${p.x} ${p.y-1.8} L${p.x+2.2} ${p.y+1.8} L${p.x-2.2} ${p.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(p,a))}e.lowIndex!==void 0&&l.push(o(t.markerCenter(e.lowIndex,c),r))}return x`${l}`}function wl(e,n){let t=Pe(e.fillColorHex,"fill"),i=e.borderColorHex?Fe(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",l=i?i.opacity:0;switch(e.shapeKind){case"circle":{let s=Math.min(n.w,n.h)/2-r;return x`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,s)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"capsule":{let s=Math.min(n.w,n.h)/2;return x`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${s}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"roundedRectangle":return x`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`;case"rectangle":return x`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}}function kl(e,n,t){let i=t.render(e.symbol,e.size,e.colorHex);if(i)return x`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=Pe(e.colorHex,"stroke"),r=e.size;return x`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var zi=.25,$l=8;function Cl(e,n,t,i,a,r,o,l){let s={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,zi),$l),c=Math.max(e/t,n/i),p=Math.min(e/t,n/i),h=(a==="fit"?p:c)*d,g=t*h,y=i*h,$=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),k=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(g-e)/2*(1+$)+0,y:-(y-n)/2*(1+k)+0,width:g,height:y}}function kn(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var xn=4;function $n(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?n.x+xn:n.x+n.w-xn-a,d=e.timestampCorner.startsWith("top")?n.y+xn:n.y+n.h-xn-r;return{x:s,y:d,w:a,h:r,size:i,label:t}}let l=(s,d,c,p)=>p>=c?d+(c-p)/2:Math.min(d+c-p,Math.max(d,s-p/2));return{x:l(n.x+e.timestampX*n.w,n.x,n.w,a),y:l(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Sl(e,n,t){let i=t.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?$n(e,n,kn(new Date)):void 0,l=o?x`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:m,s=3,d=o&&t.timestampActiveId===e.id?x`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,g,y])=>x`<rect data-ts-corner=${h} x=${g-s/2} y=${y-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:m,c=e.url?t.imageSizes?.size(e.url):void 0,p;if(e.url&&c){let h=Cl(n.w,n.h,c.width,c.height,e.contentMode,e.zoom,e.panX,e.panY);p=x`<image href=${e.url} x=${n.x+h.x} y=${n.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?p=x`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:p=x`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??m}</g>`;return x`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${p}${l}</g>${d}`}function El(e,n,t,i,a){if(!i)return m;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?Tl(a,n):void 0;return x`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?x`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${Ai} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?x`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var Ai=5;function Tl(e,n){let t=Ai*.55,i=n.w-2;if(n.h<Ai*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Hi(e,n,t){if(e.isHidden&&!t.showHidden)return m;let i=t.tapReview===!0,a=t.tapAreas===!0||i,r=i?t.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return m;let s=Lr(e,n),d=i&&(!l||o),c;switch(e.kind){case"text":c=gl(e,s);break;case"icon":c=kl(e,s,t.icons);break;case"gauge":c=yl(e,s);break;case"chart":c=xl(e,s);break;case"shape":c=wl(e,s);break;case"image":c=Sl(e,s,t);break;case"tap":c=El(e,s,t.icons,a,d?Ae(e.action):void 0);break}let p=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*p,g=t.highlightId===e.id,y=g||t.highlightIds?.includes(e.id)===!0,$=t.handles===!0&&(!l||o),k=y?x`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,R=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?x`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,b=x`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,f=3,w=g&&$?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([E,z,N])=>x`<rect data-handle=${E} x=${z-f/2} y=${N-f/2} width=${f} height=${f}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${E}-resize" />`):m;return x`<g data-element-id=${e.id} opacity=${h} style=${$?"cursor:move":m}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${b}${c}${R}${k}${w}</g>`}function Cn(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function Pi(e,n){return(n?23.5:34)*e}var Sr=10.5;function _r(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Er(e,n){let t=0;for(let i of e)t+=_r(i,n);return t}function Tr(e,n,t){let i=e.toUpperCase(),a=d=>_r(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>n)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function Li(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function _i(e,n,t,i){let a=Li(e,n,t),r=Li(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function zr(e,n,t,i){let{dial:a}=Cn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:_i(a,t,i.start,i.end),length:t*r}}function Fl(e,n){let t=Cn(e,!0);return zr(e,n,t.dial.r,t.labelArc)}var Fr=18.5,Rl=113,Ml={start:-71,end:-36},Rr=104,Il=6.2,Mr={start:-77,end:-30.5};function Ir(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Ar(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Ir(e[i]),o=Ir(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var Ii=11;function Al(e,n,t){let{dial:i}=Cn(n,!0),a=Rr*n,r=180/(Math.PI*Rr),o=e.minLabel!==void 0?Er(e.minLabel,Ii)*r:0,l=e.maxLabel!==void 0?Er(e.maxLabel,Ii)*r:0,s=Mr.start+(o>0?Math.max(0,o-1.8):0),d=Mr.end-(l>0?Math.max(0,l-1.8):0),c=d-s,p=24,h=[];for(let R=0;R<p;R++){let b=s+c*R/p,f=Math.min(d,s+c*(R+1)/p+.4);h.push(x`<path d=${_i(i,a,b,f)} fill="none"
      stroke=${Ar(e.colorHexes,(R+.5)/p)} stroke-width=${Il*n}
      stroke-linecap=${R===0||R===p-1?"round":"butt"} />`)}let g=(e.value-e.minValue)/(e.maxValue-e.minValue),y=Li(i,a,s+c*g),$=1.5,k=(R,b,f,w)=>x`
    <defs><path id=${R} d=${_i(i,a,b,f)} /></defs>
    <text font-size=${Ii*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${R}" startOffset="50%" text-anchor="middle">${w}</textPath></text>`;return x`${h}
    <circle cx=${y.x} cy=${y.y} r=${3.2*n} fill=${Ar(e.colorHexes,g)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?k(`${t}-gmin`,s-$-Math.max(o,3),s-$,e.minLabel):m}
    ${e.maxLabel!==void 0?k(`${t}-gmax`,d+$,d+$+Math.max(l,3),e.maxLabel):m}`}function Oi(e,n){let t=e.family in ue?e.family:"rectangular",i=n.slot??ue[t],a=ue[t],r=wn(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,l=Fe(e.backgroundColorHex),s=Fe(e.borderColorHex),d=e.borderWidth*r.scale;if(t==="corner"){let y=r.scale,$=!!e.bezelText||!!e.bezelGauge,k=e.curvedText??"",R=k!=="",b=Cn(y,$),f=Pi(y,$),w=f/(a.width*y),E=b.tile.cx-f/2,z=b.tile.cy-f/2,N=`M 0 0 H ${b.quad.width-b.cornerRadius} A ${b.cornerRadius} ${b.cornerRadius} 0 0 1 ${b.quad.width} ${b.cornerRadius} V ${b.quad.height} H 0 Z`,ne=m;if(e.bezelGauge)ne=Al(e.bezelGauge,y,o);else if(e.bezelText){let S=Fl(y,`${o}-bezel`),H=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?bt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;ne=x`<defs><path id=${S.id} d=${S.d} /></defs>
        <text font-size=${Sr*y} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${S.id}" startOffset="50%" text-anchor="middle">${Tr(H,S.length,Sr*y)}</textPath></text>`}let v=m;if(R){let S=Fe(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},H=zr(y,`${o}-curved`,Rl*y,Ml);v=x`<defs><path id=${H.id} d=${H.d} /></defs>
        <text font-size=${Fr*y} font-weight="600" fill=${S.color} fill-opacity=${S.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${H.id}" startOffset="50%" text-anchor="middle">${Tr(k,H.length,Fr*y*.88)}</textPath></text>`}else{let S=e.borderWidth*r.scale*w,H=s?x`<circle cx=${f/2} cy=${f/2} r=${f/2-S/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${S} />`:m;v=x`<g transform="translate(${E} ${z})">
        <g clip-path=${`url(#${o})`}>
          ${l?x`<rect width=${f} height=${f} fill=${l.color} fill-opacity=${l.opacity} />`:m}
          <g data-design-box transform="scale(${r.scale*w})">
            ${e.elements.map(C=>Hi(C,a,n))}
          </g>
        </g>
        <circle cx=${f/2} cy=${f/2} r=${f/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*y} stroke-dasharray=${`${2*y} ${2*y}`} />
        ${H}
      </g>`}return x`<svg viewBox=${`0 0 ${b.quad.width} ${b.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${b.quad.width} height=${b.quad.height}>
      <defs><clipPath id=${o}><circle cx=${f/2} cy=${f/2} r=${f/2} /></clipPath></defs>
      <path d=${N} fill="#000000" />
      ${ne}
      ${v}
    </svg>`}let c=x`<rect width=${i.width} height=${i.height} />`,p=s?x`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:m,h=x`<rect width=${i.width} height=${i.height} fill="#000000" />`,g=`0 0 ${i.width} ${i.height}`;return x`<svg viewBox=${g} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${c}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?x`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(y=>Hi(y,a,n))}
      </g>
    </g>
    ${p}
  </svg>`}var Hl=.14;function Ll(e,n){let t=Lr(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function _l(e,n,t){let i=e.family in ue?e.family:"rectangular",a=ue[i],r=e.elements.filter(h=>n.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let g=Ll(h,a),y=h.frame.rotationDegrees%180===0?0:Math.hypot(g.w,g.h)/2;o=Math.min(o,y?g.cx-y:g.x),l=Math.min(l,y?g.cy-y:g.y),s=Math.max(s,y?g.cx+y:g.x+g.w),d=Math.max(d,y?g.cy+y:g.y+g.h)}let c=s-o,p=d-l;if(r.length===0||!(c>0)||!(p>0))o=0,l=0,c=a.width,p=a.height;else{let h=Math.max(2,Math.max(c,p)*Hl);o-=h,l-=h,c+=2*h,p+=2*h}if(c/p<t){let h=p*t;o-=(h-c)/2,c=h}else{let h=c/t;l-=(h-p)/2,p=h}return{x:o,y:l,w:c,h:p}}function Pr(e,n,t){let i=e.family in ue?e.family:"rectangular",a=ue[i],r=_l(e,n,t.width/t.height),o=Fe(e.backgroundColorHex),l=Fe(e.borderColorHex),s=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,...t.imageSizes?{imageSizes:t.imageSizes}:{}},c=e.elements.filter(g=>n.includes(g.id)),p=l&&s>0?i==="rectangular"?x`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:x`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:m,h=i==="rectangular"?x`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:x`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return x`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${c.map(g=>Hi(g,a,d))}
    ${p}
  </svg>`}function V(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var vt=["rectangular","circular","corner","inline"];function Ut(e){return Y.includes(e)}function Or(e){return vt.filter(n=>e.supportedFamilies.includes(n))}function Nr(e){return Y.find(n=>e.supportedFamilies.includes(n))}function xt(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function zl(e){let n=e.elements.find(i=>i.kind==="text");return{value:n&&n.kind==="text"?structuredClone(n.payload.value):M("Text")}}function Dr(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=vt.filter(t=>t===n||e.supportedFamilies.includes(t))),Ut(n)?e.perFamily[n]||(e.perFamily[n]=mi()):e.inline||(e.inline=zl(e)),e.schemaVersion=Lt(e)}function Vr(e,n){xt(e,n)&&(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),Ut(n)?delete e.perFamily[n]:delete e.inline,e.schemaVersion=Lt(e))}function Br(e,n){let t=[];if(!Ut(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Object.keys(i.placements).length;return a>0&&t.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var Q={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},wt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},Ni=["text","icon","gauge","chart","shape","image","tap"],q={states:"#f9a825",tap:Q.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Gr="2.8.0";function Di(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function Pl(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function Ur(e,n=Gr){let t=Di(e),i=Di(n);return!t||!i?!1:Pl(t,i)>=0}function Kr(e,n=Gr){return`${Di(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${n} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var Wr="52a9d81d0fd7";function Ol(e){return e.trim().replace(/\./g,"-")}function Nl(e){return e.trim().replace(/-/g,".")}var Sn=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>Nl(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=Ol(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Fe(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return x`<svg x="0" y="0" width=${t} height=${t} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},Vi=class{constructor(n){this.onReady=n;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Fe(i)??{color:"#FFFFFF",opacity:1};return x`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`symbol-icons.json.gz?v=${Wr}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`symbol file: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function jr(e){return Sn.available()?new Sn(e):new Vi(e)}function qr(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var Tn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],Fn=[...new Set(Tn.flatMap(e=>e.symbols))],Dl={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function Vl(e){return`${e.replace(/\./g," ")} ${(Dl[e]??[]).join(" ")}`}function Yr(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=Vl(a);if(!t.every(l=>r.includes(l)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var En=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var Bl=100;function Jr(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var it=class e{constructor(n,t){this.config=n;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=t,Ge(n),this.baseline=JSON.stringify(hn(n))}static fromDocument(n,t){return new e(ar(n),t)}get dirty(){return JSON.stringify(hn(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t){let i=Date.now();t!==void 0&&t===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>Bl&&this.past.shift(),this.future=[]),this.coalesceKey=t,this.coalesceUntil=t===void 0?0:i+800;let r=structuredClone(this.config);n(r),Ge(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let n=this.past.pop();n&&(this.future.push(this.config),this.config=n,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push(this.config),this.config=n,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=Ri(n),hn(n)}commit(){let n=structuredClone(this.config);return n.dataSources=Ri(n),new e(n,null)}};var kt={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Oe={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Zr=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Qr={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Bi=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Gl=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function Gi(e){return Gl.includes(e)}function Ul(e){return Bi.includes(e)}function Kl(e,n){return JSON.stringify(X(e))===JSON.stringify(X(n))}function Ui(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!Ul(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${kt[s.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=s.value;else if(!Kl(t,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Xr(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Oe[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(n.otherwise){let r=Xr(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Oe[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:Wl(i,n.otherwise),numberMode:i.length>0&&i.every(r=>Gi(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Xr(e){let n=new Set;for(let t of e){let i=ye[t.kind];if(n.has(i))return i;n.add(i)}}function Wl(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(ye[a.kind]);for(let i of n??[])t.add(ye[i.kind]);return Zr.filter(i=>t.has(i))}function eo(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Zr.filter(a=>i.has(a)&&t.includes(a))}function Rn(e,n){return e.find(t=>ye[t.kind]===n)}function to(e,n,t,i){let a=n.map(o=>({id:o.caseId??j(),when:{join:o.join??"all",tests:[{id:o.testId??j(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??j(),cases:a};return t&&(r.otherwise=t),r}function Kt(e){if(e.length===0)return"No states yet.";let n=Ui(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function no(e){let n=e[0];return n||(n={id:j(),cases:[]},e.push(n)),n}function io(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function ao(e,n,t){let i=no(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:j(),when:{join:"all",tests:[{id:j(),value:structuredClone(n),comparison:ql(a,t)}]},then:[]})}function ro(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),io(e))}function Ki(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function Wi(e,n){if(n){no(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,io(e))}function oo(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function so(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>ye[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function jl(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function lo(e,n=jl){let t=()=>n(e.value??M(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??M(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return tt(e.kind)==="value"?`${kt[e.kind]} ${t()}`:kt[e.kind]}}function ql(e,n){if(!e)return n?{kind:"lessThan",value:M("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??M("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};default:return{kind:e.kind,...tt(e.kind)==="value"?{value:M("")}:{}}}}var co={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function po(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function Yl(e){switch(e){case"text":return x`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return x`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return x`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return x`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return x`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return x`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return x`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return x`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return x`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return x`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return x`<path d="M6 9L12 15L18 9" />`;case"plus":return x`<path d="M12 5V19M5 12H19" />`;case"watch":return x`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return x`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return x`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return x`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return x`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return x`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return x`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return x`<path d="M6 14L12 8L18 14" />`;case"down":return x`<path d="M6 10L12 16L18 10" />`;case"show":return x`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return x`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return x`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return x`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return x`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return x`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return x`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`}}function _(e){return u`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Yl(e)}</svg>`}var Wt="color-mix(in srgb, var(--k) 45%, #6b7280)",uo='system-ui, -apple-system, "Segoe UI", sans-serif';function ho(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let p=c*Math.PI/180;return{x:(e-t*Math.cos(p)).toFixed(2),y:(n-t*Math.sin(p)).toFixed(2)}},l=o(135),s=o(r),d=r-135>180?1:0;return`M${l.x} ${l.y}A${t} ${t} 0 ${d} 1 ${s.x} ${s.y}`}function ji(e,n,t,i){return x`<g fill="none" stroke-linecap="round">
    <path d=${ho(e,n,t,1)} stroke=${Wt} stroke-width="2.6" opacity=".5" />
    <path d=${ho(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function Jl(e){switch(e){case"text":return x`<g font-family=${uo} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${Wt}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${Wt}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${Wt}>1.2 kW</text>
      </g>`;case"icon":return x`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
      </g>`;case"gauge":return x`<g>
        ${ji(22,24,12,.28)}
        ${ji(60,24,12,.62)}
        ${ji(98,24,12,.92)}
        <text x="60" y="27" font-family=${uo} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return x`<g>
        <g opacity=".4" fill=${Wt}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"shape":return x`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="8" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <circle cx="60" cy="23" r="11" />
        <rect x="80" y="16" width="32" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return x`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return x`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`}}function mo(e){return u`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${Jl(e)}</svg>`}function $t(e,n){let t=new DOMPoint(n.clientX,n.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=t.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function fo(e){let n=Math.min(.96,Math.max(-e.width+.04,e.x)),t=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:n,y:t}}var Mn=e=>Math.round(e*1e3)/1e3,go=10;function qi(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return fo({...e,x:Mn(a),y:Mn(r)})}function yo(e,n,t,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?Mn(a(e.x+n/i.w)):e.x,y:i.h>0?Mn(a(e.y+t/i.h)):e.y}}function In(e,n,t,i,a){let r=$t(e,t),o={...i.frame},l=o;e.setPointerCapture(t.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==t.pointerId)return;let g=$t(e,h),y=(g.x-r.x)/n.width,$=(g.y-r.y)/n.height,k;if(!i.handle)k=fo({...o,x:s(o.x+y),y:s(o.y+$)});else{let{x:R,y:b,width:f,height:w}=o,E=o.x+o.width,z=o.y+o.height;i.handle.includes("e")&&(f=Math.max(.04,o.width+y)),i.handle.includes("s")&&(w=Math.max(.04,o.height+$)),i.handle.includes("w")&&(f=Math.max(.04,o.width-y),R=E-f),i.handle.includes("n")&&(w=Math.max(.04,o.height-$),b=z-w),k={...o,x:s(R),y:s(b),width:s(f),height:s(w)}}l=k,a.onFrame(i.elementId,k,!1)},c=h=>{h.pointerId===t.pointerId&&(p(),a.onFrame(i.elementId,l,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function bo(e,n,t,i,a){let r=$t(e,t),o=i;e.setPointerCapture(t.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==t.pointerId)return;let g=$t(e,h),y=n.w>0?s(i.x+(g.x-r.x)/n.w):i.x,$=n.h>0?s(i.y+(g.y-r.y)/n.h):i.y;o={x:l(y),y:l($)},a(o.x,o.y,!1)},c=h=>{h.pointerId===t.pointerId&&(p(),a(o.x,o.y,!0))},p=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),p}function vo(e,n,t,i,a){let r=$t(e,n),o=1;e.setPointerCapture(n.pointerId);let l=c=>{if(c.pointerId!==n.pointerId)return;let p=$t(e,c),h=(p.x-r.x)*(t.includes("e")?1:-1),g=(p.y-r.y)*(t.includes("s")?1:-1),y=i.w>0?(i.w+h)/i.w:1,$=i.h>0?(i.h+g)/i.h:1,k=Math.abs(y-1)>=Math.abs($-1)?y:$;o=Math.max(.05,k),a(o,!1)},s=c=>{c.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}function Xl(e){switch(e){case"light":return x`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return x`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return x`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return x`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return x`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return x`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return x`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return x`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return x`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return x`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return x`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return x`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return x`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return x`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return x`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return x`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return x`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return x`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return x`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return x`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return x`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return x`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return x`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return x`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return x`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return x`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return x`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return x`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return x`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return x`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function Yi(e){return u`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Xl(e)}</svg>`}var Zl={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function xo(e){let n=Zl[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var Ql=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function Ji(e){return Ql.has(e.trim().toLowerCase())}var ea=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ce(e){return n=>e(n.target.value)}function te(e,n,t,i={}){return u`<label class="field"><span>${e}</span>
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${ce(t)} /></label>`}function ed(e,n,t,i=3){return u`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${ce(t)}></textarea></label>`}function J(e,n,t,i={}){let a=n===void 0||Number.isNaN(n)?"":String(n);return u`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??m} max=${i.max??m}
      @input=${ce(r=>{if(r.trim()===""){i.optional&&t(void 0);return}let o=Number(r);Number.isNaN(o)||t(o)})} /></label>`}function D(e,n,t,i){return u`<label class="field"><span>${e}</span>
    <select @change=${ce(a=>i(a))}>
      ${t.map(([a,r])=>u`<option value=${a} ?selected=${a===n}>${r}</option>`)}
    </select></label>`}function An(e,n,t,i){let a=i.format??(r=>String(Math.round(r*100)/100));return u`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)}
        @input=${ce(r=>{let o=Number(r);Number.isNaN(o)||t(o)})} />
      <span class="slider-value mono">${a(n)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${n===i.def}
        @click=${()=>t(i.def)}>${_("reset")}</button>
    </div></div>`}function $e(e,n,t){return u`<label class="field check"><input type="checkbox" .checked=${n} @change=${i=>t(i.target.checked)} /><span>${e}</span></label>`}function ae(e,n,t,i=!1){let a=(n??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,c)=>{let p=d.replace(/^#/,"").toUpperCase();return c>=100?`#${p}`:`#${p}${Math.round(c/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return u`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?u`<input type="checkbox" title="Enabled" .checked=${n!==void 0} @change=${d=>t(d.target.checked?s(o,l):void 0)} />`:m}
      <input type="color" .value=${o} ?disabled=${i&&n===void 0} @input=${ce(d=>t(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&n===void 0} @input=${ce(d=>t(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${n??""} placeholder="#RRGGBB" ?disabled=${i&&n===void 0}
        @input=${ce(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&t(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
    </div></div>`}function Ho(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function td(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let l=r.split(".")[0]??"";if(i!==void 0&&!i.includes(l))continue;let s=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:s||r,state:o?.state??"",domain:l,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function wo(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Lo=50;function nd(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function id(e,n,t=Lo,i){let a=n.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,t);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),c=s.name.toLowerCase(),p=(s.area??"").toLowerCase(),h=-1;d===a?h=0:d.startsWith(a)?h=1:c.startsWith(a)?h=2:d.includes(a)?h=3:c.includes(a)?h=4:o.length>1&&o.every(g=>d.includes(g)||c.includes(g))?h=5:p!==""&&(p.includes(a)||o.length>1&&o.every(g=>d.includes(g)||c.includes(g)||p.includes(g)))&&(h=6),h>=0&&l.push({c:s,rank:h})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,t).map(s=>s.c)}var ad=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function _o(e){return ad.test(e.trim())}function rd(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return Ho(t,i);if(_o(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var rt=new Map;function we(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function zo(e){return rt.has(e)}function Ue(e,n,t,i,a,r={}){let o=e.hass.states,l=rt.get(a),s=l?id(td(o,r.domain,wo(e.hass)),l.query,Lo,r.preferNumeric?nd:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,c=t.entityId?o[t.entityId]:void 0,p=(f,w,E=0)=>{rt.set(a,{query:w,index:E}),we(f)},h=f=>{rt.delete(a),we(f)},g=f=>{let w=rd(f,t,o);w&&i(w)},y=(f,w)=>{i(Ho(o,f.entityId)),h(w)},$=()=>Math.max(0,Math.min(rt.get(a)?.index??0,s.length-1)),k=f=>{let w=f.target;if(f.key==="ArrowDown"||f.key==="ArrowUp"){f.preventDefault();let E=rt.get(a);if(!E){p(w,w.value);return}let z=f.key==="ArrowDown"?$()+1:$()-1;p(w,E.query,Math.max(0,Math.min(s.length-1,z))),od(w);return}if(f.key==="Enter"){f.preventDefault();let E=s[$()];l&&E?y(E,w):(g(w.value),h(w));return}if(f.key==="Escape"){if(!l)return;f.preventDefault(),f.stopPropagation(),h(w)}},R=t.entityId?wo(e.hass)?.(t.entityId):void 0,b=t.entityId===""?u`<div class="hint">Type part of a name, a room, or an id.</div>`:c?u`<div class="entity-current">
          <span class="ent-ico ${Ji(c.state)?"on":""}">${Yi(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${R?u`<span class="ent-area">${R}</span>`:m}
          <span class="ent-state">${c.state}</span>
        </div>`:u`<div class="hint warn">Not in Home Assistant right now.</div>`;return u`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${l?"open":""}">
      <span class="ent-glass">${_("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${l?l.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${f=>{let w=f.target;p(w,t.entityId),w.select()}}
        @input=${f=>{let w=f.target;p(w,w.value)}}
        @keydown=${k}
        @blur=${f=>{let w=f.target;l&&g(w.value),h(w)}} />
      ${(l?l.query:t.entityId)===""?m:u`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${f=>f.preventDefault()}
        @click=${f=>{let w=f.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),rt.set(a,{query:"",index:0}),we(w),w?.focus()}}>${_("close")}</button>`}
    </div>
    ${l?u`<div class="entity-results" role="listbox">
          ${s.length===0?u`<div class="hint" style="padding:6px 8px">${_o(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map((f,w)=>u`<button type="button" role="option" aria-selected=${w===d?"true":"false"} class="ent ${w===d?"hl":""}"
                @mousedown=${E=>E.preventDefault()} @click=${E=>y(f,E.target)}>
                <span class="ent-ico ${Ji(f.state)?"on":""}">${Yi(f.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${f.name}</span>
                  <span class="ent-sub">
                    ${f.area?u`<span class="ent-area">${f.area}</span>`:m}
                    <span class="ent-id mono">${f.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${xo(f.domain)}</span>
                  <span class="ent-state">${f.state}</span>
                </span>
              </button>`)}
        </div>`:b}
    ${r.compact?m:u`<details class="sub">
      <summary>Display name: ${t.displayName||"(none)"}</summary>
      ${te("Display name",t.displayName,f=>i({...t,displayName:f}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function od(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var sd=120;function ld(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(Tn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(Fn),fromPack:!1}}function ko(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function dd(e){return[{value:"",label:`Starter set (${ko(Fn,e)})`},...Tn.map(n=>({value:n.name,label:`${n.name} (${ko(n.symbols,e)})`}))]}function cd(e){return e.length>0?e.length:Fn.length}function pd(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function $o(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return u`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??u`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function Po(e,n,t,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),c=n.trim(),p=c!==""&&d.size>0&&!d.has(c),h=y=>{t(y),a.noteUsed(y)},g=m;if(r){let y=a.category(i),$=ld(y,o,s,d),k=Yr($.names,o),R=$.fromPack?k.slice(0,sd):k,b=d.size===0?a.recent:a.recent.filter(f=>d.has(f));g=u`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${ce(f=>a.setQuery(i,f))} />
        <select @change=${ce(f=>a.setCategory(i,f))}>
          ${dd(d).map(f=>u`<option value=${f.value} ?selected=${f.value===y}>${f.label}</option>`)}
        </select>
      </div>
      ${b.length===0?m:u`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${b.map(f=>$o(e,f,f===c,h))}</div>`}
      <div class="sym-grid">${R.map(f=>$o(e,f,f===c,h))}</div>
      ${k.length===0?u`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:u`<div class="hint">
            ${pd(R.length,k.length,o.trim()!=="",cd(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?u`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:u`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return u`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${ce(t)} @change=${ce(y=>{(d.size===0||d.has(y.trim()))&&a.noteUsed(y)})} /></label>
    ${p?u`<div class="hint warn">The installed icon pack has no <code>${c}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${g}`}var ud=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],hd=[["bars","Bars"],["line","Line"],["area","Area"]],md=[["auto","Auto (fit the readings)"],["fixed","Fixed range"]],fd=[["lowest","Lowest value"],["zero","Zero"]],Oo=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],gd=[["none","None"],["pointer","Triangle and dot"],["dot","Dots"]],yd=[["uniform","One colour"],["bands","By value"]];function bd(e){let n=[ii,"#FFD60A"];if(e.length<2)return n.map((o,l)=>({id:j(),upTo:(l+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,l)=>({id:j(),upTo:r(t+a*(l+1)/3),colorHex:o}))}function vd(e){let n=ft(e).at(-1),t=e.bands.length>1?Math.abs(ft(e)[1].upTo-ft(e)[0].upTo):10;return{id:j(),upTo:(n?.upTo??0)+(t||10),colorHex:e.colorSlot.baseColorHex}}var xd=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function wd(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function Z(e,n,t,i){if(i.inline||!kd())return u`<div class="value-editor">${Vo(e,n,t,i)}</div>`;let a=ta(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,l=pe(n,re(e)),s="entityId"in n.kind;return u`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?m:u`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text ${s?"ent-tok":""}">${l}</span>
      ${o===void 0?m:u`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${No(e,a,r,n,t,i)}
  </div>`}function No(e,n,t,i,a,r){return u`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${Do}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${qt.has(n)?Vo(e,i,a,r):m}
  </div>`}function re(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function ta(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function kd(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var qt=new Set,jt=new WeakMap;function $d(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function Cd(e,n){let t=e instanceof Node?e:null;if(!t)return;let i=t.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(n)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function Do(e){let n=e.currentTarget,t=e.newState==="open",i=jt.get(n);if(i&&(i(),jt.delete(n)),!t){qt.delete(n.id)&&we(n);return}let a=$d(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){jt.get(n)?.(),jt.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Xi(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),jt.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Xi(n,a.getBoundingClientRect()),qt.has(n.id)||(qt.add(n.id),we(n),requestAnimationFrame(()=>{n.isConnected&&Xi(n,a.getBoundingClientRect())}))}function Xi(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=Sd({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var at=8,Hn=6,Co=140;function Sd(e,n,t){let i=t.height-e.bottom-Hn-at,a=e.top-Hn-at,r=n.height>i&&a>i&&i<Co,o=Math.max(Co,r?a:i),l=Math.min(n.height,o),s=Math.max(at,Math.min(e.left,t.width-n.width-at)),d=r?Math.max(at,e.top-Hn-l):Math.max(at,Math.min(e.bottom+Hn,t.height-l-at));return{left:s,top:d,maxHeight:o,above:r}}function Vo(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,l=ud.filter(([c])=>i.allowNamed!==!1||c!=="named"),s=m;switch(a.kind){case"literal":s=i.symbol?Po(e,a.value,c=>r({...a,value:c}),o):te("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":s=Ue(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),p=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=u`${Ue(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${te("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:p,mono:!0})}
        <datalist id=${p}>${c.map(h=>u`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=Td(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":s=D("Field",a.timeField,xd,c=>r({...a,timeField:c}));break;case"dataAge":s=u`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=u`${ed("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?u`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:D("Value",a.id,[["","(choose)"],...e.config.values.map(c=>[c.id,c.name||c.id.slice(0,8)])],c=>r({...a,id:c}));break;case"chartStat":{let c=re(e),p=e.config.elements.filter(h=>h.kind==="chart");s=p.length===0?u`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:u`
          ${D("Chart",a.layer,[["","(choose)"],...p.map(h=>[h.payload.id,ve(h,c)])],h=>r({...a,layer:h}))}
          ${D("Number",a.stat,[...mt],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(n):void 0;return u`
    ${D("Source",a.kind,l,c=>r(wd(a,c)))}
    ${s}
    ${i.noFormat?m:Ed(n.format,c=>t(Te(c)?{kind:n.kind}:{...n,format:c}))}
    ${i.showResolved?u`<div class="hint">Now: ${d===void 0?u`<span class="warn">unresolved</span>`:u`<code>${d}</code>`}</div>`:m}`}function Ed(e,n){let t=e??{},i=a=>{let r={...t,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];n(r)};return u`<details class="sub" ?open=${!Te(e)}>
    <summary>Format${Te(e)?"":" (on)"}</summary>
    <div class="grid2">
      ${J("Decimals",t.decimals,a=>i({decimals:a}),{step:1,min:0,max:6,optional:!0})}
      ${J("Multiply",t.multiply,a=>i({multiply:a}),{optional:!0})}
      ${J("Offset",t.offset,a=>i({offset:a}),{optional:!0})}
      ${D("Case",t.textCase??"",[["","As is"],["upper","UPPER"],["lower","lower"],["capitalized","Capitalized"]],a=>i({textCase:a||void 0}))}
      ${te("Prefix",t.prefix??"",a=>i({prefix:a}))}
      ${te("Suffix",t.suffix??"",a=>i({suffix:a}))}
    </div>
    ${$e("Append the entity's unit",!!t.useEntityUnit,a=>i({useEntityUnit:a}))}
    ${$e("Show as relative time (45s, 2m, 3h)",!!t.relativeTime,a=>i({relativeTime:a}))}
  </details>`}function Td(e,n,t,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=n.scope;return u`
    ${D("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>t({...n,function:l}))}
    ${D("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>t({...n,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?u`<div class="grid2">
          ${te("Domains",a(o.domains),l=>t({...n,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${te("Area ids",a(o.areaIds),l=>t({...n,scope:{...o,areaIds:r(l)}}))}
          ${te("Label ids",a(o.labelIds),l=>t({...n,scope:{...o,labelIds:r(l)}}))}
          ${te("Floor ids",a(o.floorIds),l=>t({...n,scope:{...o,floorIds:r(l)}}))}
        </div>`:u`${o.entities.map((l,s)=>u`<div class="row-inline">
            ${Ue(e,`Entity ${s+1}`,l,d=>{let c=[...o.entities];c[s]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==s)}})}>${_("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${D("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...n};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:s.stateFilter={kind:l},t(s)})}
    ${n.stateFilter&&"value"in n.stateFilter?te("State",n.stateFilter.value,l=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:l}})):m}
    ${n.function==="count"?m:te("Attribute (blank = state)",n.attribute??"",l=>{let s={...n};l?s.attribute=l:delete s.attribute,t(s)})}`}var Bo=ci,Fd=Bo.filter(([e])=>e!=="none");function Rd(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function Go(e){let n=e.config,t=n.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=Rd(e.savedName,n.name),r=n.refreshMinutes??0,o=So.map(s=>[String(s),Eo(s)]);So.includes(r)||o.push([String(r),Eo(r)]);let l=n.showSuccessFlash??!0;return u`
    <div class="gen-row">
      ${te("Name",n.name,s=>e.update(d=>{d.name=s},"name"))}
      ${D("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${D("Tap action",t.type,Bo,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?u`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??Md).slice(0,7)}
                @input=${ce(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:u`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?u`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m}
    ${"entityId"in t?Ue(e,"Target",t,s=>e.update(d=>{d.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):m}
    ${t.type==="openPage"?Id(e):m}`}var Md="#808080",So=[0,15,30,60,120];function Eo(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function Id(e){let n=e.config;return Uo(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function Uo(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?u`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:u`${D("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?m:u`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function Ko(e,n){let t=e.config.values.findIndex(a=>a.id===n.id),i=`nv-${n.id}`;return u`
    ${te("Name",n.name,a=>e.update(r=>{r.values[t].name=a},`${i}-name`))}
    ${Z(e,n.value,a=>e.update(r=>{r.values[t].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${To(e.config,n.id)} layer${To(e.config,n.id)===1?"":"s"}.</div>`}function To(e,n){return JSON.stringify(e.elements).split(`"${n}"`).length-1+JSON.stringify(e.perFamily).split(`"${n}"`).length-1}function Wo(){return{id:j(),name:"Value",value:M("")}}function he(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function Ce(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let l=he(e,n,r),d={...o.placements[t]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let c of e.elements)c.payload.id!==t&&(o.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});o.placements[t]=d}function Ln(e,n,t,i,a){let r=n.payload.id,o=Ad(n)??a.min,l=he(e.config,t,n).size??o;return J(`${i} (pt)`,l,s=>e.update(d=>Ce(d,t,r,{size:Math.max(a.min,s??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min})}function Ad(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function Fo(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Hd(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function jo(e,n,t){let i=Fo(t.map(d=>he(e,n,d).isHidden)),a=Fo(t.map(d=>d.payload.isHidden)),r=t.map(Hd),o=t.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var na=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function Ld(e,n,t){let i=n.payload.id,a=gn(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"?{domain:"camera"}:{};return u`
    ${Ue(e,n.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>yr(s,i,l),`${t}-entity`),`${t}-layer-entity`,o)}
    <div class="hint">${Pd(n,a)}</div>`}function _d(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function zd(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Pd(e,n){let t=_d(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let s=n.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${zd(o)}.${r}`}function Od(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Nd(e,n){let t=e.timestamp===!0,i=Ie(e),a=r=>n(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ie(o)&&(o.timestampCorner=li(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return u`
    ${$e("Show timestamp",t,r=>n(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${t?u`
      ${D("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?m:D("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>n(o=>{o.timestampCorner=r}))}
      ${J("Text size (pt)",e.timestampSize,r=>n(o=>{o.timestampSize=Math.min(40,Math.max(4,r??zt))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:m}`}function de(e,n,t,i,a={}){let r=e.openSections.has(n),o=()=>e.toggleSection(n);return u`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${_(a.icon??"content")}</span>
      <span class="tt"><h4>${t}</h4>${a.summary?u`<span class="sum">${a.summary}</span>`:m}</span>
      <span class="chev">${_("chevron")}</span>
    </div>
    ${r?u`<div class="sec-b">${i}</div>`:m}
  </section>`}function Dd(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Vd(e){return ai.find(n=>n.minutes===e)?.label??`Last ${e} min`}function ia(e,n){let t=re(e);switch(n.kind){case"text":return ot(pe(n.payload.value,t),48);case"icon":return ot(pe(n.payload.symbol,t),48);case"gauge":return ot(pe(n.payload.value,t),48);case"chart":return ot(`${pe(n.payload.value,t)}${n.payload.historyMinutes>0?` \xB7 ${Vd(n.payload.historyMinutes)}`:""}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||"No camera yet";case"tap":return Ae(n.payload.action)}}function On(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${ke(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${ke(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${ke(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${Oo.find(([n])=>n===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${ke(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function qo(e,n,t){let i=n.payload.id,a=e.config.elements.findIndex(b=>b.payload.id===i),r=`el-${i}`,o=(b,f)=>e.update(w=>b(w.elements[a]),f?`${r}-${f}`:void 0),l=he(e.config,t,n),s=l.frame,d=(b,f)=>e.update(w=>Ce(w,t,i,{frame:{...s,...b}}),`${r}-${f}-${t}`),c,p;switch(n.kind){case"text":{let b=pi(e.config,n.payload.value);c=u`
        ${Z(e,n.payload.value,f=>o(w=>{w.payload.value=f},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${b?u`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(b.payload.id)}>${ve(b,re(e))}</button>. It stays in the chart's group and moves with it.</div>`:m}
        ${$e("Live countdown",n.payload.countdown===!0,f=>o(w=>{let E=w.payload;f?E.countdown=!0:delete E.countdown}))}
        ${n.payload.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,p=u`<div class="grid2">
          ${Ln(e,n,t,"Font size",{step:1,min:4})}
          ${D("Weight",n.payload.fontWeight,na,f=>o(w=>{w.payload.fontWeight=f}))}
        </div>`;break}case"icon":c=u`
        ${Z(e,n.payload.symbol,b=>o(f=>{f.payload.symbol=b},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,p=Ln(e,n,t,"Icon size",{step:1,min:4});break;case"gauge":c=u`
        ${Z(e,n.payload.value,b=>o(f=>{f.payload.value=b},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${J("Min",n.payload.minValue,b=>o(f=>{f.payload.minValue=b??0},"min"))}
          ${J("Max",n.payload.maxValue,b=>o(f=>{f.payload.maxValue=b??100},"max"))}
        </div>`,p=u`
        <div class="grid2">
          ${D("Style",n.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],b=>o(f=>{f.payload.style=b}))}
          ${Ln(e,n,t,"Line width",{step:.5,min:.5})}
        </div>
        ${ae("Track colour",n.payload.trackColorHex,b=>o(f=>{f.payload.trackColorHex=b??"#FFFFFF40"},"track"))}`;break;case"chart":{let b=n.payload,f=(C,F)=>o(U=>C(U.payload),F),w=et(b),E=b.historyMinutes>0,z=b.value.kind.kind==="entityState",N=w===void 0?void 0:e.historySeries(w),ne=E?N??"":e.resolve(b.value)??"",v=Vt(ne),S=b.limit>0&&v.length>b.limit?b.takeFromEnd?v.slice(v.length-b.limit):v.slice(0,b.limit):v,H=!E&&z&&v.length===1;c=u`
        ${Z(e,b.value,C=>f(F=>{F.value=C},"value"),{label:"Readings",key:`${r}-value`})}
        ${D("Draw",E?"history":"value",[["value","The value itself"],["history","Its recorded history"]],C=>f(F=>{F.historyMinutes=C==="history"?F.historyMinutes||360:0}))}
        ${E?u`
            ${z?m:u`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              stays empty until Readings names an entity.</div>`}
            <div class="grid2">
              ${D("Span",String(b.historyMinutes),ai.map(({minutes:C,label:F})=>[String(C),F]),C=>f(F=>{F.historyMinutes=Number(C)||360}))}
              ${J("Readings",b.historyPoints,C=>f(F=>{F.historyPoints=Math.round(C??24)},"hpoints"),{step:1,min:ri,max:oi})}
            </div>
            <div class="hint">Home Assistant averages the recorded states into this many equal
              time slots, oldest first. About 20 readings suits a rectangular complication; more
              than that draws bars thinner than the screen can show.</div>
            ${z&&N===void 0?u`<div class="hint">Reading the history…</div>`:m}
            ${z&&N===""?u`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:m}`:u`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${v.length===0&&!(E&&(!z||N===void 0||N===""))?u`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:m}
        ${v.length>0?u`<div class="hint">Reads <span class="nums">${Dd(S)}</span>${v.length===S.length?u` · ${S.length} ${S.length===1?"value":"values"}`:u` · ${S.length} of ${v.length}`}</div>`:m}
        ${H?u`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Its recorded history</b> to plot how it has moved.</div>`:m}
        <div class="grid2">
          ${J("Use",b.limit,C=>f(F=>{F.limit=Math.max(0,Math.round(C??0))},"limit"),{step:1,min:0})}
          ${D("From",b.takeFromEnd?"end":"start",[["start","The first readings"],["end","The last readings"]],C=>f(F=>{F.takeFromEnd=C==="end"}))}
        </div>
        <div class="hint">${E?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,p=u`
        ${D("Style",b.style,hd,C=>f(F=>{F.style=C}))}
        <div class="grid2">
          ${D("Scale",b.scale,md,C=>f(F=>{F.scale=C}))}
          ${D("Baseline",b.baseline,fd,C=>f(F=>{F.baseline=C}))}
        </div>
        ${b.scale==="fixed"?u`<div class="grid2">
              ${J("Min",b.minValue,C=>f(F=>{F.minValue=C??0},"cmin"))}
              ${J("Max",b.maxValue,C=>f(F=>{F.maxValue=C??100},"cmax"))}
            </div>`:m}
        <div class="hint">${b.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${b.style==="bars"?J("Bar gap (pt)",b.barGap,C=>f(F=>{F.barGap=Math.max(0,C??0)},"gap"),{step:.5,min:0}):Ln(e,n,t,"Line width",{step:.5,min:.5})}
        ${D("Colour",b.coloring,yd,C=>f(F=>{F.coloring=C,C==="bands"&&F.bands.length===0&&(F.bands=bd(S))}))}
        ${b.coloring==="bands"?u`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${b.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${b.bands.map((C,F)=>u`
            <div class="row-inline">
              ${J("Up to",C.upTo,U=>f(ee=>{let oe=ee.bands[F];oe&&(oe.upTo=U??0)},`bup${C.id}`))}
              ${ae("Colour",C.colorHex,U=>f(ee=>{let oe=ee.bands[F];oe&&(oe.colorHex=U??"#FFFFFF")},`bcol${C.id}`))}
              <button class="icon" title="Remove this band" aria-label="Remove this band"
                @click=${()=>f(U=>{U.bands=U.bands.filter((ee,oe)=>oe!==F)})}>${_("close")}</button>
            </div>`)}
          <button class="small" @click=${()=>f(C=>{C.bands=[...C.bands,vd(C)]})}>Add band</button>
          ${ae("And the rest",b.bandAboveColorHex,C=>f(F=>{F.bandAboveColorHex=C??pn},"babove"))}
          ${b.style==="area"?u`${$e("Fill follows the bands",b.fillBands,C=>f(F=>{F.fillBands=C}))}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:m}`:m}
        ${D("Highlight",b.highlight,Oo,C=>f(F=>{F.highlight=C}))}
        ${b.highlight==="none"?m:u`
          <div class="grid2">
            ${b.highlight==="lowest"?m:ae("Highest colour",b.highColorHex,C=>f(F=>{F.highColorHex=C??dn},"hicol"))}
            ${b.highlight==="highest"?m:ae("Lowest colour",b.lowColorHex,C=>f(F=>{F.lowColorHex=C??cn},"locol"))}
          </div>
          ${D("Marker",b.marker,gd,C=>f(F=>{F.marker=C}))}
          <div class="hint">Worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":c=u`<div class="grid2">
          ${D("Shape",n.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],b=>o(f=>{f.payload.kind=b}))}
          ${n.payload.kind==="roundedRectangle"?J("Corner radius (pt)",n.payload.cornerRadius,b=>o(f=>{f.payload.cornerRadius=b??6},"radius"),{step:.5,min:0}):m}
        </div>`,p=u`
        ${ae("Border colour",n.payload.borderColorHex,b=>o(f=>{b===void 0?delete f.payload.borderColorHex:f.payload.borderColorHex=b},"border"),!0)}
        ${n.payload.borderColorHex!==void 0?J("Border width (pt)",n.payload.borderWidth,b=>o(f=>{f.payload.borderWidth=b??1},"bw"),{step:.5,min:0}):m}`;break;case"image":{let b=n.payload,f=(w,E)=>o(z=>w(z.payload),E);c=u`
        ${b.entity.entityId&&!b.entity.entityId.startsWith("camera.")?u`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:m}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,p=u`
        ${D("Picture",b.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],w=>f(E=>{E.contentMode=w}))}
        ${An("Zoom",b.zoom,w=>f(E=>{E.zoom=w},"zoom"),{min:zi,max:4,step:.05,def:1,format:w=>`${w.toFixed(2)}x`})}
        ${An("Pan left/right",b.panX,w=>f(E=>{E.panX=w},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${An("Pan up/down",b.panY,w=>f(E=>{E.panY=w},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${Od(b)}</div>
        ${J("Corner radius (pt)",b.cornerRadius,w=>f(E=>{E.cornerRadius=Math.max(0,w??_t)},"imgradius"),{step:1,min:0})}`;break}case"tap":{c=u`
        ${Yo(e,n.payload,(b,f)=>o(w=>b(w.payload),f),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let h=n.kind==="image"||n.kind==="tap"?void 0:ae(n.kind==="shape"?"Fill colour":"Colour",n.payload.colorSlot.baseColorHex,b=>o(f=>{f.kind!=="image"&&f.kind!=="tap"&&(f.payload.colorSlot.baseColorHex=b??"#FFFFFF")},"color")),g=yi(e.config,n),y=g?{kind:{kind:"entityState",...g}}:void 0,$=Q[n.kind],k=n.kind==="tap"?void 0:be(e.config,i)[0],R=n.kind==="image"?n.payload.timestamp===!0:!1;return u`
    ${de(e,"content","Content",u`${n.kind==="tap"?m:Ld(e,n,r)}${c}`,{color:$,icon:"content",summary:ia(e,n)})}
    ${p===void 0&&h===void 0?m:de(e,"look",n.kind==="image"?"Picture":"Look",u`${p??m}${h??m}`,{color:$,icon:n.kind==="image"?"image":"look",...On(n)?{summary:On(n)}:{}})}
    ${n.kind==="chart"?de(e,"numbers","Numbers",Kd(e,n),{color:Q.text,icon:"text",summary:Ud(e,n)}):m}
    ${n.kind==="image"?de(e,"timestamp","Timestamp",Nd(n.payload,(b,f)=>o(w=>b(w.payload),f)),{color:$,icon:"clock",summary:R?`Shown \xB7 ${n.payload.timestampSize} pt`:"Hidden"}):m}
    ${n.kind==="tap"?m:de(e,"tappable","Tap",Wd(e,n,r),{color:q.tap,icon:"tap",summary:k?Ae(k.payload.action):"Not tappable"})}
    ${de(e,"states","States",ns(e,n.payload.rules,n.kind,b=>b.elements.find(f=>f.payload.id===i)?.payload.rules,`rules-${i}`,y),{color:q.states,icon:"states",summary:Kt(n.payload.rules).replace(/\.$/,"")})}
    ${de(e,"placement","Place",u`
      ${An("Rotation",s.rotationDegrees,b=>d({rotationDegrees:b},"rot"),{min:-180,max:180,step:1,def:0,format:b=>`${Math.round(b)}\xB0`})}
      <div class="hint">Drag the layer on the ${V(t)} preview to move it, or pull a
        corner to resize it. Arrow keys nudge the selection 1 pt, shift-arrows 10 pt. The eye on the
        layer's row hides it.</div>
      <div class="hint">Everything about where this layer sits, how big it is drawn and whether it
        shows belongs to the ${V(t)} shape alone. Pick another shape above to place
        the same layer differently there.</div>`,{color:q.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${V(t)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function Yo(e,n,t,i){let a=n.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return u`
    ${D("Tap action",a.type,Fd,o=>t(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?Ue(e,"Target",a,o=>t(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):m}
    ${a.type==="openPage"?Uo(e,n.openPageId,n.openPageName,(o,l)=>t(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):m}`}var Bd=24;function Gd(e,n){let t=[],i=1/0;for(let r of Y){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=fr(e.config,n,r);o&&(t.push(`${V(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return m;let a=i<Bd;return u`<div class=${a?"hint warn":"hint"}>${t.join(" \xB7 ")}${a?u`<br />That is small for a wrist. Show the tap area and drag its corners out.`:m}</div>`}function Ud(e,n){let t=Pt(e.config,n.payload.id);return t.length===0?"None yet":t.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(mt.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function Kd(e,n){let t=re(e),i=Pt(e.config,n.payload.id),a=o=>{let l;e.update(s=>{l=lr(s,n.payload.id,o)}),l&&e.selectLayer(l)},r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return u`
    ${i.length===0?u`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:u`
        <div class="chart-numbers">
          ${i.map(o=>u`
            <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
              <b>${e.resolve(o.payload.value)??"--"}</b> · <span class="ent-tok">${ve(o,t)}</span>
            </button>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${mt.map(([o,l])=>u`
        <button class="small" title=${r.has(o)?`Add another ${l.toLowerCase()}`:`Add the ${l.toLowerCase()}`}
          @click=${()=>a(o)}>${_("plus")}<span>${l}</span></button>`)}
    </div>
    <div class="hint">The newest reading starts with the entity's unit after it. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function Wd(e,n,t){if(n.kind==="tap")return m;let i=n.payload.id,a=be(e.config,i)[0],r=(l,s)=>e.update(d=>{let c=d.elements.find(p=>p.kind==="tap"&&p.payload.attachedTo===i);c&&l(c.payload)},s?`${t}-${s}`:void 0),o=bi(e.config,n);return u`
    ${$e("Tappable",a!==void 0,l=>e.update(s=>{l?mn(s,i):xi(s,i)}))}
    ${a?u`<div class="value-editor">
          ${Yo(e,a.payload,r,`${t}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${un(a.payload.outset)?m:u`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...di}})}>${_("reset")}</button>`}
          </div>
        </div>
        ${Gd(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:u`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Ae(o)}</b>.</div>`}`}function Ro(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function ve(e,n){switch(e.kind){case"text":return Ro(pe(e.payload.value,n));case"icon":return Ro(pe(e.payload.symbol,n));case"gauge":return pe(e.payload.value,n);case"chart":return pe(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let t=e.payload.entity;return t.displayName||t.entityId||"camera"}case"tap":{let t=e.payload.action,i="entityId"in t?t.displayName||t.entityId:t.type==="openPage"&&e.payload.openPageName||"";return i?`${t.type} \xB7 ${i}`:t.type}}}function Jo(e,n){let t=Le(e.config,n.id),i=re(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===n.id);s&&r(s)},o?`group-${n.id}-${o}`:void 0);return de(e,"content","Group",u`
    ${te("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${$e("Move as one on the watch",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${t.length} layer${t.length===1?"":"s"}: ${t.map(r=>ve(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Ot(r,n.id))}>Ungroup</button>
    </div>`,{color:q.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function Xo(e,n){if(n==="inline")return u`${jd(e)}${Zi(e,n)}`;let t=e.config.perFamily[n];if(!t)return u`<div class="hint">No settings stored for ${V(n)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${V(n)} settings</button>
      ${Zi(e,n)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[n]),s?`fam-${n}-${s}`:void 0),a=Object.keys(t.placements).length,r=t.backgroundColorHex?ke(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${ke(t.borderColorHex)} border`:"no border";return u`
    ${de(e,"look",`${V(n)} shape`,u`
      ${ae("Background (blank = transparent)",t.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${ae("Border colour",t.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${J("Border width (pt)",t.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:q.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${n==="corner"?de(e,"corner","Corner content",qd(e,t,i),{color:q.place,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas"}):m}
    ${de(e,"states","Shape states",ns(e,t.rules,"layout",l=>l.perFamily[n]?.rules,`rules-${n}`),{color:q.states,icon:"states",summary:Kt(t.rules).replace(/\.$/,"")})}
    ${de(e,"placements","Placements",u`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${V(n)} placement.`}</div>
      ${a>0?u`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:m}`,{color:q.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${Zi(e,n)}`}function Zi(e,n){let t=!xt(e.config,n),i=t?"A complication keeps at least one shape.":`Drop the ${V(n)} shape. The watch stops listing this complication for ${V(n)} slots.`;return de(e,"shape","Remove this shape",u`
    <div class="adders">
      <button class="danger small" ?disabled=${t} title=${i} @click=${()=>e.removeFamily(n)}>Remove the ${V(n)} shape</button>
    </div>
    ${t?u`<div class="hint">This is the only shape. Add another before removing it.</div>`:u`<div class="hint">The watch stops listing this complication for ${V(n)} slots.</div>`}`,{color:q.place,icon:"delete",summary:t?"The only shape":"Drops its layout"})}function jd(e){let n=e.config.inline;if(!n)return u`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=re(e);return u`
    ${de(e,"content","Inline text",u`
      ${te("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${Z(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${$e("Live countdown",n.countdown===!0,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${n.countdown?u`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:m}`,{color:Q.text,icon:"text",summary:ot(`${n.label?`${n.label}: `:""}${pe(n.value,i)}`,48)})}
    ${de(e,"symbol","Symbol",u`
      ${Po(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</div>`,{color:Q.icon,icon:"icon",summary:n.symbol||"None"})}`}function qd(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return u`
    ${D("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=M("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?u`
      ${Z(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${ae("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    ${D("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=M("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:M("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?u`
      ${Z(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${$e("Live countdown",n.bezelCountdown===!0,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&n.bezelGauge?Yd(e,n.bezelGauge,t):m}`}function Yd(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return u`
    ${Z(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${J("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${J("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${ae("Arc colour (min end)",i[0],a(0))}
    ${ae("Arc colour (middle)",i[1],a(1))}
    ${ae("Arc colour (max end)",i[2],a(2))}
    ${$e("End number labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let l=o.bezelGauge;r?(l.minLabel=M(String(l.minValue)),l.maxLabel=M(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${n.minLabel?Z(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${n.maxLabel?Z(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var Hu=Y.map(e=>[e,V(e)]),aa={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Jd=Object.keys(aa);function Xd(e){let n=yn[e];return Jd.filter(t=>n.includes(ye[t]))}var Zd={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function _n(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function ot(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Qd(e){if(!e||Te(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function pe(e,n){return`${Zo(e,n)}${Qd(e.format)}`}function Zo(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${ot(t.value,40)}"`:"(empty)";case"entityState":return _n(t,n);case"entityAttribute":return t.attribute?`${_n(t,n)} \xB7 ${t.attribute}`:_n(t,n);case"entityAge":return`age of ${_n(t,n)}`;case"aggregate":return ec(t.aggregate);case"time":return Zd[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${ot(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(mt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Zo(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function ec(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Nn(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function tc(e,n,t,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return u`
    ${n.length===0?u`<div class="hint">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:m}
    ${n.map((o,l)=>nc(e,o,l,n.length,t,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Dt())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function nc(e,n,t,i,a,r,o){let l=e.liveBranch(n),s=e.forced.get(n.id)??"live",d=p=>s==="live"?p==="live":s==="otherwise"?p==="otherwise":s.caseId===p,c=(p,h)=>r(g=>{let y=g.find($=>$.id===n.id);y&&p(y)},h);return u`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(p=>Nn(p,t,t-1))}>${_("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(p=>Nn(p,t,t+1))}>${_("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(p=>{let h=p.findIndex(g=>g.id===n.id);h>=0&&p.splice(h,1)})}>${_("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
      ${n.cases.map((p,h)=>u`<button class="${d(p.id)?"active":""} ${l===p.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:p.id})}>Case ${h+1}</button>`)}
      ${n.otherwise?u`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:m}
    </div>
    ${n.cases.map((p,h)=>ic(e,p,h,n,a,c,`${o}-${p.id}`))}
    <div class="adders"><button class="small" @click=${()=>c(p=>{p.cases.push(Ci())})}>+ case</button></div>
    ${$e("Otherwise (when no case matches)",n.otherwise!==void 0,p=>c(h=>{p?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${n.otherwise?u`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?u`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${Qo(e,n.otherwise,a,p=>c(h=>{h.otherwise&&p(h.otherwise)}),`${o}-otherwise`)}
        </div>`:m}
  </div>`}function ic(e,n,t,i,a,r,o){let l=(d,c)=>r(p=>{let h=p.cases.find(g=>g.id===n.id);h&&d(h)},c),s=e.liveBranch(i)===n.id;return u`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${s?u` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(d=>Nn(d.cases,t,t-1))}>${_("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(d=>Nn(d.cases,t,t+1))}>${_("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let c=d.cases.findIndex(p=>p.id===n.id);c>=0&&d.cases.splice(c,1)})}>${_("delete")}</button>
    </div>
    <div class="row-inline">
      ${D("When",n.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(c=>{c.when.join=d}))}
    </div>
    ${n.when.tests.length===0?u`<div class="hint">No tests: this case always matches.</div>`:m}
    ${n.when.tests.map((d,c)=>ac(e,d,c,p=>l(h=>{let g=h.when.tests.find(y=>y.id===d.id);g&&p(g)}),()=>l(p=>{p.when.tests=p.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push($i())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${Qo(e,n.then,a,d=>l(c=>d(c.then)),`${o}-then`)}
  </div>`}function ac(e,n,t,i,a,r){let o=(p,h)=>i(p,h?`${r}-${h}`:void 0),l=n.comparison,s=tt(l.kind),d=e.evaluateTest(n),c=m;switch(s){case"value":c=Z(e,l.value??M(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=u`${Z(e,l.value??M(""),p=>o(h=>{h.comparison.value=p},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${Z(e,l.upper??M(""),p=>o(h=>{h.comparison.upper=p},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=u`${te("Pattern",l.pattern??"",p=>o(h=>{h.comparison.pattern=p},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!rc(l.pattern)?u`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"options":c=te("Options (comma separated)",(l.options??[]).join(", "),p=>o(h=>{h.comparison.options=p.split(",").map(g=>g.trim()).filter(Boolean)},"options"));break;case"none":break}return u`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${_("delete")}</button>
    </div>
    ${l.kind==="isStale"?u`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:Z(e,n.value,p=>o(h=>{h.value=p},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${D("Comparison",l.kind,br.map(p=>[p,kt[p]]),p=>o(h=>{h.comparison=Si(h.comparison,p)}))}
    ${c}
  </div>`}function rc(e){try{return new RegExp(e),!0}catch{return!1}}function Qo(e,n,t,i,a){let r=Xd(t);return u`
    ${n.length===0?u`<div class="hint">No changes.</div>`:m}
    ${n.map((o,l)=>oc(e,o,l,t,(s,d)=>i(c=>{c[l]&&s(c[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(nt(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>u`<option value=${o}>${aa[o]}</option>`)}
    </select>`}var es=["setColor","setBorderColor","setBackgroundColor"];function oc(e,n,t,i,a,r,o){let l=!yn[i].includes(ye[n.kind]);return u`<div class="change-box">
    <div class="rule-head">
      <span>${aa[n.kind]}${l?u` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${_("delete")}</button>
    </div>
    ${ts(e,n,a,o)}
  </div>`}function ts(e,n,t,i){let a=bn(n.kind),r=m;if(a==="value"){let o=n.value??M("");if(es.includes(n.kind)){let l=o.kind.kind==="literal";r=u`${l?ae("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>t(d=>{d.value=M(s??"#FFFFFF")},"color")):Z(e,o,s=>t(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:M("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?m:u`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=Z(e,o,l=>t(s=>{s.value=l},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1}:{step:.5,min:0};r=J(n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Degrees":n.kind==="setFontSize"?"Points":"Value",n.number??0,l=>t(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=D("Weight",n.weight??"regular",na,o=>t(l=>{l.weight=o})));return r}var Qi=new Set,zn=new Map,Pn=new Map,Mo=new Map;function ns(e,n,t,i,a,r){let o=Ui(n);return!o.ok||Qi.has(a)?u`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{Qi.delete(a),we(s.target)}}>Show as table</button>
        ${o.ok?m:u`<span class="hint">${o.reason}</span>`}
      </div>
      ${tc(e,n,t,i,a)}`:sc(e,o.table,n[0],t,i,a,r)}function sc(e,n,t,i,a,r,o){let l=(v,S)=>e.update(H=>{let C=a(H);C&&v(C)},S?`${r}-${S}`:void 0),s=n.value??Mo.get(r)??o,d=n.rows.length===0,c=n.numberMode||d&&s!==void 0&&!po(s)&&lc(e.resolve(s)),p=yn[i],h=zn.get(r)??new Set,g=n.columns.length===0&&h.size===0?[co[i]]:[],y=eo(n.columns,[...h,...g.filter(v=>v!==void 0)],p),$=t?e.liveBranch(t):"none",k=t?e.forced.get(t.id)??"live":"live",R=v=>k!=="live"&&(k==="otherwise"?v==="otherwise":k.caseId===v),b=v=>{t&&e.setForced(t.id,R(v)?"live":v==="otherwise"?"otherwise":{caseId:v})},f=v=>{Mo.set(r,v),n.rows.length!==0&&l(S=>oo(S,v),"lhs")},w=()=>l(v=>ao(v,s??M(""),c)),E=n.rows.map((v,S)=>Ao(e,{key:`${r}-${v.caseId}`,label:lo(v.comparison,H=>pe(H,re(e))),columns:y,changes:v.changes,live:$===v.caseId,forced:R(v.caseId),onForce:()=>b(v.caseId),when:hc(e,v.comparison,`${r}-${v.caseId}`,(H,C)=>l(F=>{let U=F[0]?.cases.find(ee=>ee.id===v.caseId)?.when.tests[0];U&&H(U.comparison)},C&&`${v.caseId}-${C}`)),updChanges:(H,C)=>l(F=>{let U=F[0]?.cases.find(ee=>ee.id===v.caseId);U&&H(U.then)},C&&`${v.caseId}-${C}`),acts:u`
      <button class="icon" title="Move up" ?disabled=${S===0} @click=${()=>l(H=>Ki(H,S,S-1))}>${_("up")}</button>
      <button class="icon" title="Move down" ?disabled=${S===n.rows.length-1} @click=${()=>l(H=>Ki(H,S,S+1))}>${_("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(H=>ro(H,v.caseId))}>${_("delete")}</button>`})),z=n.otherwise===void 0?m:Ao(e,{key:`${r}-otherwise`,label:"Otherwise",columns:y,changes:n.otherwise,live:$==="otherwise",forced:R("otherwise"),onForce:()=>b("otherwise"),when:u`<span class="when-otherwise">Otherwise</span>`,updChanges:(v,S)=>l(H=>{let C=H[0]?.otherwise;C&&v(C)},S),acts:u`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(v=>Wi(v,!1))}>${_("close")}</button>`}),N=Pn.get(r),ne=dc.filter(v=>p.includes(v)&&!y.includes(v));return u`
    <div class="states">
      ${Z(e,s??M(""),f,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?u`<div class="hint">Choose what these states look at.</div>`:m}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${y.map(v=>u`<th>
              <span>${Oe[v]}</span>
              <button class="icon" title=${`Remove the ${Oe[v]} column`}
                @click=${S=>{Pn.set(r,v),we(S.target)}}>${_("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${E}
          ${z}
          ${n.rows.length===0&&n.otherwise===void 0?u`<tr><td class="empty-row" colspan=${y.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:m}
        </tbody>
      </table>
      ${N===void 0?m:u`<div class="hint warn confirm-row">
        Remove the ${Oe[N]} column? Its ${Io(n,N)} value${Io(n,N)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${v=>{Pn.delete(r),zn.get(r)?.delete(N),we(v.target),l(S=>so(S,N))}}>Remove</button>
        <button class="small" @click=${v=>{Pn.delete(r),we(v.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${w}>+ state</button>
        ${n.otherwise===void 0?u`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(v=>Wi(v,!0))}>+ otherwise</button>`:m}
        <span class="spacer"></span>
        ${k==="live"?m:u`<button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button>`}
        ${ne.length===0?m:u`<select class="chip-add" title="Add a column" @change=${v=>{let S=v.target,H=S.value;if(S.value="",!H)return;let C=zn.get(r)??new Set;C.add(H),zn.set(r,C),we(S)}}>
          <option value="" selected>+ column…</option>
          ${ne.map(v=>u`<option value=${v}>${Oe[v]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${c?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${v=>{Qi.add(r),we(v.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function lc(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var dc=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Io(e,n){let t=0;for(let i of e.rows)Rn(i.changes,n)&&(t+=1);return e.otherwise&&Rn(e.otherwise,n)&&(t+=1),t}function cc(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Ao(e,n){return u`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{cc(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>u`<td>${pc(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function pc(e,n,t,i,a){let r=Rn(t,n),o=ta(a);if(!r)return u`<button type="button" class="cell empty" title=${`Set ${Oe[n]} for this state`}
      @click=${d=>{i(c=>{c.push(nt(Qr[n]))}),Cd(d.target,o)}}>unchanged</button>`;let l=(d,c)=>i(p=>{let h=p.find(g=>ye[g.kind]===n);h&&d(h)},c&&`${n}-${c}`),s=Oe[n];return u`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${uc(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${Do}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${qt.has(o)?u`${n==="visibility"?D("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(c=>{c.kind=d})):ts(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let p=c.findIndex(h=>ye[h.kind]===n);p>=0&&c.splice(p,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:m}
    </div>`}function uc(e,n){if(n.kind==="hide")return u`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return u`<span class="cell-word">Shown</span>`;let t=bn(n.kind);if(t==="number")return u`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return u`<span class="cell-word">${na.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??M(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(es.includes(n.kind))return u`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?ke(a):pe(i,re(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return u`${r??m}<span class="cell-word">${a}</span>`}return u`<span class="cell-word">${pe(i,re(e))}</span>`}function ke(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function hc(e,n,t,i){let a=tt(n.kind),r=Gi(n.kind),o=(l,s,d,c)=>fc(e,l,s,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return u`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ce(l=>i(s=>{let d=Si(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${Bi.map(l=>u`<option value=${l} ?selected=${l===n.kind}>${mc(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??M(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?u`<span class="when-and">to</span>${o(n.upper??M(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:m}
  </span>`}function mc(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return kt[e]}}function fc(e,n,t,i,a,r,o){let l=ta(i),s={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return u`<span class="rhs">
      ${Z(e,n,t,{...s,compact:!0})}
    </span>`;let d=n.kind.value;return u`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${ce(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${No(e,l,o,n,t,s)}
  </span>`}var Yt=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:gi,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function os(e){return Yt.find(n=>n.kind===e)??Yt[0]}var is="#FF9F0A",ra="#8E8E93",gc=["#FF453A","#FFD60A","#34C759"],ss=["#0A84FF","#34C759","#FF9F0A"];function yc(e){return e?.attributes?.device_class==="battery"?gc:ss}var bc={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function vc(e){let n=e.iconName?.trim();return n?{off:n,on:n}:bc[oa(e)]??{off:"circle",on:"circle.fill"}}function xc(e){switch(oa(e)){case"lock":return{kind:"equals",value:M("locked")};case"cover":case"valve":return{kind:"equals",value:M("open")};case"media_player":return{kind:"equals",value:M("playing")};default:return{kind:"isOn"}}}function oa(e){return e.domain||e.entityId.split(".")[0]||""}function lt(e){return{...e,domain:oa(e)}}function wc(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Dn(e){return Math.round(e*1e4)/1e4}function Vn(e,n,t){return Math.min(t,Math.max(n,e))}function sa(e,n,t){let i=ue[e],a=Vn(Dn(n/i.width),0,1),r=Vn(Dn(t/i.height),0,1);return{x:Dn((1-a)/2),y:Dn((1-r)/2),width:a,height:r,rotationDegrees:0}}function kc(e){let n=ue[e],t=Vn(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:sa(e,t*1.3,t*1.3),size:t}}function $c(e){let n=ue[e],t=Vn(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:sa(e,n.width*.88,t*1.7),size:t}}function Cc(e){let n=ue[e],t=Math.min(n.width,n.height)*.9;return{frame:sa(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function ls(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function Sc(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Ec(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function Ct(e,n,t,i){let a=i(t);n.payload.frame=a.frame,Ec(n,a.size);for(let r of Y){if(r===t||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[n.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function St(e){return Be(e)}function la(e,n){let t={kind:{kind:"entityState",...lt(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function as(e){let n=nt("setIcon");return n.value=M(e),n}function st(e){let n=nt("setColor");return n.value=M(e),n}function Tc(e,n){let t=Dt(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...lt(e)}},a.comparison=xc(e);let r=n.on!==n.off;return i.then=r?[as(n.on),st(is)]:[st(is)],t.otherwise=r?[as(n.off),st(ra)]:[st(ra)],t}function Fc(e){let n=Dt(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...lt(e)}},i.comparison={kind:"isUnavailable"};let a=nt("setOpacity");return a.number=.35,t.then=[a],n}function rs(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Rc(e,n,t=ss){let i=n.max-n.min,a=rs(n.min+i/3),r=rs(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:M(a)},changes:[st(t[0])]},{comparison:{kind:"between",value:M(a),upper:M(r)},changes:[st(t[1])]},{comparison:{kind:"greaterThan",value:M(r)},changes:[st(t[2])]}];return to(la(e),o)}function Mc(e,n,t){let i=St("icon"),a=vc(n);return i.payload.symbol=M(a.off),i.payload.colorSlot.baseColorHex=ra,i.payload.rules=[Tc(n,a)],Ct(e,i,t.family,kc),e.elements.push(i),mn(e,i.payload.id,{type:"toggleEntity",...lt(n)}),i.payload.id}function Ic(e,n,t){let i=St("text");return i.payload.value=la(n,t.state),i.payload.rules=[Fc(n)],Ct(e,i,t.family,$c),e.elements.push(i),i.payload.id}function Ac(e,n,t){let i=St("gauge");i.payload.value=la(n);let a=wc(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Rc(n,a,yc(t.state))],Ct(e,i,t.family,Cc),e.elements.push(i),i.payload.id}function Hc(e,n,t){let i=St("chart");return i.payload.value={kind:{kind:"entityState",...lt(n)}},i.payload.highlight="both",i.payload.marker="pointer",Ct(e,i,t.family,ls),e.elements.push(i),i.payload.id}function Lc(e,n,t){let i=St("chart");return i.payload.value={kind:{kind:"entityState",...lt(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",Ct(e,i,t.family,ls),e.elements.push(i),i.payload.id}function _c(e,n,t){let i=St("image");return i.payload.entity=lt(n),Ct(e,i,t.family,Sc),e.elements.push(i),i.payload.id}function ds(e,n,t,i){switch(n){case"toggle":return Mc(e,t,i);case"status":return Ic(e,t,i);case"gauge":return Ac(e,t,i);case"chart":return Hc(e,t,i);case"history":return Lc(e,t,i);case"camera":return _c(e,t,i)}}var Pc=3e4,Oc=500,cs="preset-entity",Nc={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function da(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function Dc(e){return e.kind==="family"?"look":"content"}function Vc(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}var ps=300,us=400,hs=52,ms=36,Bc=[1,1.7,2.6],Gc=["S","M","L"],fs=["Small","Medium","Large"],gs="wrist-assistant-panel.layers.v1",Ne=34,dt=200,Uc=720,Bn=320,Kc=80,Wc=56,ys="wrist-assistant-panel.columns.v2",ca=e=>Math.max(dt,Math.min(Uc,Math.round(e))),bs=e=>e.metaKey||e.ctrlKey||e.shiftKey,Jt=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",Ke=Jt==="Cmd"?"\u2318":"Ctrl+",pa=Jt==="Cmd"?"\u21E7":"Shift+";function vs(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-Kc;if(i>=dt*2+Bn){let r=i-Bn,o=n,l=t;if(o+l>r){let s=r/(o+l);o=Math.max(dt,Math.floor(o*s)),l=Math.max(dt,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(dt,o-d):l=Math.max(dt,l-d))}return{columns:3,left:o,right:l}}let a=e-Wc;return a>=dt+Bn?{columns:2,left:Math.min(n,a-Bn),right:t}:{columns:1,left:n,right:t}}var I=class extends Ve{constructor(){super(...arguments);this.narrow=!1;this.colLeft=ps;this.colRight=us;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Gt.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=jr(()=>this.requestUpdate());this.imageSizes=qr(()=>this.requestUpdate());this.symbols=new En(()=>this.requestUpdate());this.keyHandler=t=>this.onKey(t);this.heldArrows=new Set;this.keyUpHandler=t=>{this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||zo(cs)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=Un`
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
      --wa-text: ${me(Q.text)};
      --wa-icon: ${me(Q.icon)};
      --wa-gauge: ${me(Q.gauge)};
      --wa-shape: ${me(Q.shape)};
      --wa-image: ${me(Q.image)};
      --wa-tap: ${me(Q.tap)};
      --wa-states: ${me(q.states)};
      --wa-place: ${me(q.place)};
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
    .layers { display: flex; flex-direction: column; gap: 6px; --thumb-w: ${hs}px; --thumb-h: ${ms}px; }
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
    .layer .lockbtn.on { opacity: 1; color: ${me(q.locked)}; filter: drop-shadow(0 0 4px ${me(q.locked)}); }
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
    .layer.drop-before { border-top: ${Ne}px solid transparent; }
    .layer.drop-after { border-bottom: ${Ne}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${Ne}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${Ne}px; }
    .layer.drop-after::after { bottom: -${Ne}px; }

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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let t=window.localStorage.getItem(ys);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=ca(i.left)),typeof i.right=="number"&&(this.colRight=ca(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(ys,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let t=window.localStorage.getItem(gs);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(gs,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return u`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=ps:this.colRight=us,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=vs(this.panelWidth,this.colLeft,this.colRight),l=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=p=>{if(p.pointerId!==i.pointerId)return;let h=p.clientX-r,g=ca(t==="left"?l+h:l-h);t==="left"?this.colLeft=g:this.colRight=g},d=p=>{p.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||da(i)!==da(this.inspect))&&(this.openSections=new Set(ea))}}updated(t){let i=da(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}t.key==="Escape"&&(this.timestampActiveId=void 0);let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!r){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!r){this.deleteSelection()&&t.preventDefault();return}let o=Nc[t.key];if(o&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(o.dx,o.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!a?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!a&&(t.preventDefault(),this.redo()),a||r))return;let s=t.key.toLowerCase(),d=!0;s==="a"?this.selectAll():s==="c"?this.copySelection():s==="x"?this.copySelection()&&this.deleteSelection():s==="v"?this.pasteClip():s==="d"?this.duplicateSelection():s==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():s==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):d=!1,d&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?Le(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)fn(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=wi(t,i),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=[];this.mutate(a=>{i=ki(a,t)}),this.selectRows(i)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=wi(t,i),r=[];this.mutate(o=>{r=ki(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=t.elements.filter(a=>!le(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?He(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>Ot(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(l=>t.elements.find(s=>s.payload.id===l)).filter(l=>l!==void 0).some(l=>!he(t,a,l).isHidden);this.mutate(l=>{for(let s of i)Ce(l,a,s,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(p=>!le(a,p)),o=a.elements.filter(p=>le(a,p)),l=r.findIndex(p=>p.payload.id===t),s=l+i;if(l<0||s<0||s>=r.length)return;[r[l],r[s]]=[r[s],r[l]];let d=r[s],c=r[l];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],_e(a),gt(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await Ma(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${We(t)}`}}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=Hr(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await za(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Ia(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token,this.polling=t.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${We(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=it.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=cr(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=We(i)}this.scheduleTemplates(0)}startNew(t){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new it(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return ja(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Aa(this.hass,this.ownerId);this.polling=t.polling,this.serverToken=t.token,this.appliedToken=t.applied_token,t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=We(t)}}renderSendButton(){let t=vr({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(t.kind==="unsupported")return m;let i=xr(t),a=i.resend&&this.hass.user?.is_admin?u`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m;return u`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<ni}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Fi(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=er(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(Oc))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new ze(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||Ur(t.app_version):!0}get canvasFamily(){if(Ut(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&Nr(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Or(t)[0]??"rectangular")}addShape(t){this.mutate(i=>Dr(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!xt(i,t))return;let a=Br(i,t);a.length>0&&!window.confirm(`Remove the ${V(t)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>Vr(r,t)),this.ensureActiveFamily())}createNew(t){this.newShapeChooser=!1,this.startNew(pr("New complication",this.freeSlot(),[t]))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=j(),l.slotIndex=o,i=new it(l,null)}let a=i.encoded(),r=await Ha(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=it.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=We(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let t=await La(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!t.ok){t.error==="conflict"?this.conflict={current:t.current??null,message:t.message??"This complication changed on the server."}:this.saveError=t.message??t.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(t){this.saveError=We(t)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=j(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await _a(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=We(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},Pc)}async refreshHistorySeries(){let t=this.draft?.config,i=t?si(t):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points};try{let r=await Oa(this.hass,a),o=new Map;for(let[l,s]of Object.entries(r))s.ok&&o.set(l,s.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await Pa(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Cr(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=We(i)}}buildContext(){let t=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=jc(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),t.set(i,l)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return u`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return u`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return u`<button class="pick" ?disabled=${t}
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}><span class="glyph">⤢</span>Expand</button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return m;let o=a.slots[t],l=t==="corner"?104/124:o.width/o.height;return u`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
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
    </dialog>`}renderHelpDialog(){let t=Ke,i=pa,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Jt}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=l=>l.map(([s,d])=>u`<tr><th scope="row"><kbd>${s}</kbd></th><td>${d}</td></tr>`);return u`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?vi(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){if(this.picking){i.preventDefault(),this.pickAt(t,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let k=this.focusTapId();if(k!==void 0&&o===k&&l&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,l,k,r??void 0);return}let R=this.hitLayerId(i);R?this.inspect={kind:"layer",id:R}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let c=bs(i);if(!c&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let p=vi(this.draft.config,o),h=this.draft.config.elements.find(k=>k.payload.id===p);if(!p||!h)return;if(c){i.preventDefault(),this.togglePick(p);return}let g=He(this.draft.config,p);if(g?.locked&&!r&&!d){this.beginGroupGesture(t,i,l,g);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},r))return;i.preventDefault();let y=he(this.draft.config,t,h).frame,$=this.gestureCanvas(t);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=p;let k=h.payload,R=ge[t],b=y.width*R.width,f=y.height*R.height,w={x:0,y:0,w:b,h:f,cx:b/2,cy:f/2},E=$n(k,w,kn(new Date));if(this.cancelGesture?.(),s){let v=$.width/R.width,S=k.timestampSize;this.cancelGesture=vo(l,i,s,{w:E.w*v,h:E.h*v},(H,C)=>{let F=Math.min(40,Math.max(4,Math.round(S*H)));this.mutate(U=>{let ee=U.elements.find(oe=>oe.payload.id===p);ee?.kind==="image"&&(ee.payload.timestampSize=F)},`ts-size-${p}`),C&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let z={x:0,y:0,w:y.width*$.width,h:y.height*$.height},N=Ie(k)?{x:k.timestampX,y:k.timestampY}:{x:(E.x+E.w/2)/w.w,y:(E.y+E.h/2)/w.h},ne=!1;this.cancelGesture=bo(l,z,i,N,(v,S,H)=>{H||(ne=!0),ne&&this.mutate(C=>{let F=C.elements.find(U=>U.payload.id===p);F?.kind==="image"&&(F.payload.timestampX=v,F.payload.timestampY=S)},`ts-${p}`),H&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=In(l,$,i,{elementId:p,frame:y,handle:r??void 0},{onFrame:(k,R,b)=>{this.mutate(f=>Ce(f,t,k,{frame:R}),`drag-${k}-${t}`),b&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r){let o=this.draft?.config;if(!o)return;let l=Le(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(k=>[k.payload.id,he(o,t,k).frame])),d=[...s.values()],c=Math.min(...d.map(k=>k.x)),p=Math.min(...d.map(k=>k.y)),h=Math.max(...d.map(k=>k.x+k.width)),g=Math.max(...d.map(k=>k.y+k.height)),y={x:c,y:p,width:h-c,height:g-p,rotationDegrees:0},$=k=>Math.round(k*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=In(a,this.gestureCanvas(t),i,{elementId:r.id,frame:y},{onFrame:(k,R,b)=>{let f=R.x-y.x,w=R.y-y.y;this.mutate(E=>{for(let[z,N]of s)Ce(E,t,z,{frame:{...N,x:$(N.x+f),y:$(N.y+w)}})},`drag-group-${r.id}-${t}`),b&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?go:1,l=t*o,s=i*o,d=this.canvasFamily,c=ge[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let k=this.inspect.id;return this.nudgeMany(Le(r,k).map(R=>R.payload.id),d,c,`nudge-group-${k}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let p=this.inspect.id,h=r.elements.find(k=>k.payload.id===p);if(!h)return!1;let g=He(r,p);if(g?.locked)return this.nudgeMany(Le(r,g.id).map(k=>k.payload.id),d,c,`nudge-group-${g.id}-${d}`,l,s);let y=he(r,d,h).frame,$=qi(y,l,s,c);return($.x!==y.x||$.y!==y.y)&&this.mutate(k=>Ce(k,d,p,{frame:$}),`nudge-${p}-${d}`),!0}nudgeMany(t,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=w=>Math.round(w*1e3)/1e3,c=new Map;for(let w of t){let E=s.elements.find(z=>z.payload.id===w);E&&c.set(w,he(s,i,E).frame)}if(c.size===0)return!1;let p=[...c.values()],h=Math.min(...p.map(w=>w.x)),g=Math.min(...p.map(w=>w.y)),y=Math.max(...p.map(w=>w.x+w.width)),$=Math.max(...p.map(w=>w.y+w.height)),k={x:h,y:g,width:y-h,height:$-g,rotationDegrees:0},R=qi(k,o,l,a),b=R.x-k.x,f=R.y-k.y;return(b!==0||f!==0)&&this.mutate(w=>{for(let[E,z]of c)Ce(w,i,E,{frame:{...z,x:d(z.x+b),y:d(z.y+f)}})},r),!0}nudgeTimestamp(t,i,a,r){let o=this.draft?.config,l=o?.elements.find(k=>k.payload.id===t);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=ge[i],c=he(o,i,l).frame,p=c.width*d.width,h=c.height*d.height,g=$n(s,{x:0,y:0,w:p,h,cx:p/2,cy:h/2},kn(new Date)),y=Ie(s)?{x:s.timestampX,y:s.timestampY}:{x:p>0?(g.x+g.w/2)/p:.5,y:h>0?(g.y+g.h/2)/h:.5},$=yo(y,a,r,{w:p,h});return($.x!==y.x||$.y!==y.y)&&this.mutate(k=>{let R=k.elements.find(b=>b.payload.id===t);R?.kind==="image"&&(R.payload.timestampX=$.x,R.payload.timestampY=$.y)},`nudge-ts-${t}`),!0}gestureCanvas(t){let i=wn(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=Pi(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:be(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(p=>p.payload.id===r);if(!l||!s)return;let d=le(l,s),c=he(l,t,s).frame;this.cancelGesture?.(),this.cancelGesture=In(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o},{onFrame:(p,h,g)=>{this.mutate(y=>{d?mr(y,p,t,h):Ce(y,t,p,{frame:h})},`tap-box-${p}-${t}`),g&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:vs(this.panelWidth,this.colLeft,this.colRight);return u`
      <header>
        <h1><span class="mark">${_("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${i?u`<span class="dirty-dot" title="Unsaved changes"></span>`:m}
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
              ${ua(r)} (${r.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
      </header>
      ${this.loadError?u`<div class="card error">${this.loadError}</div>`:m}
      ${this.helpOpen?this.renderHelpDialog():m}
      ${this.watchSupported?u`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:u`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${Kr(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(V).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(t){return u`<span class="shape-dots">${vt.map(i=>u`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${V(i)}></span>`)}</span>`}renderPicker(){let t=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=t?t.config.name.trim()||"Untitled":"No complication",r=t?t.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return u`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?u`<span class="pk-rev">r${i.revision}</span>`:t&&t.baseRevision===null?u`<span class="pk-rev">unsaved</span>`:m}
        ${_("chevron")}
      </button>
      ${this.pickerOpen?u`<div class="menu" role="listbox">
        ${o.length===0&&!(t&&t.baseRevision===null)?u`<div class="empty">No complications for this watch yet.</div>`:m}
        ${o.map(s=>s.kind==="record"?u`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(Vc(s.record))}
              <span class="pk-name">${String(s.record.document?.name??"Untitled")}</span>
              <span class="pk-badge">r${s.record.revision}</span>
            </button>`:u`<div class="row locked" title=${s.title}>
              ${this.shapeDots(s.families)}
              <span class="pk-name">${s.name}</span>
              <span class="pk-badge">${s.badge}</span>
            </div>`)}
        ${t&&t.baseRevision===null?u`<div class="row" aria-current="true">${this.shapeDots(r)}<span class="pk-name">${a}</span><span class="pk-badge">unsaved</span></div>`:m}
        ${this.hass.user?.is_admin?u`
          <button class="row new" ?disabled=${l<0} @click=${()=>{this.newShapeChooser=!this.newShapeChooser}}>
            ${_("plus")}<span class="pk-name">New complication</span>${l<0?u`<span class="pk-badge">watch is full</span>`:m}
          </button>
          ${this.newShapeChooser&&l>=0?u`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${vt.map(s=>u`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${V(s)}</button>`)}
            </div>
          </div>`:m}`:m}
      </div>`:m}
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
                ${i.map(a=>u`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${ua(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:u`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?u`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return m;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return u`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
        <span class="swatch">${_("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?m:u`<span class="mini">${Ni.length} kinds · ${Yt.length} presets</span>`}
        ${a?u`<span class="tool-set" @click=${l=>l.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Compact buttons: the name of each kind, no sample"],["expanded","Expanded buttons: a sample of what each kind draws"]].map(([l,s])=>u`
                  <button class=${this.addDetail===l?"on":""} title=${s} aria-label=${s} aria-pressed=${this.addDetail===l?"true":"false"}
                    @click=${()=>{this.addDetail=l,this.saveListView()}}>${_(l)}</button>`)}
              </span>
            </span>`:m}
        <span class="chev">${_("chevron")}</span>
      </h2>
      ${a?u`
          <div class="add-grid ${r?"":"lean"}">
            ${Ni.map(l=>u`<button class="add" style=${`--k:${Q[l]}`} ?disabled=${i} title=${`Add a blank ${wt[l].toLowerCase()} layer`}
              @click=${()=>{let s=Be(l);this.mutate(d=>{d.elements.push(s)}),this.inspect={kind:"layer",id:s.payload.id}}}
              >${r?u`<span class="well">${mo(l)}</span>`:m}<span class="add-name">${_(l)}<span>${wt[l]}</span></span></button>`)}
          </div>
          <div class="presets-l">Or start from a preset</div>
          <div class="presets">
            ${Yt.map(l=>u`<button class="preset" title=${l.blurb}
              ?disabled=${t.elements.length+l.layerCount>64}
              @click=${()=>this.openPreset(l.kind)}>${l.title}</button>`)}
          </div>`:m}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let l=o.elements.filter(y=>!le(o,y)),s=o.elements.filter(y=>le(o,y)),d=[...l].reverse(),c=d.find(y=>y.payload.id===i);if(!c)return;let p=o.groups?.find(y=>y.id===t),h=p?d.filter(y=>y.payload.groupId===p.id):d.filter(y=>y.payload.id===t);if(h.length===0||h.includes(c))return;d=d.filter(y=>!h.includes(y));let g;if((p||r)&&c.payload.groupId!==void 0){let y=d.filter($=>$.payload.groupId===c.payload.groupId);g=a?d.indexOf(y[0]):d.indexOf(y[y.length-1])+1}else g=d.indexOf(c)+(a?0:1);if(d.splice(g,0,...h),!p){let y=h[0],$=r?void 0:c.payload.groupId;$===void 0?delete y.payload.groupId:y.payload.groupId=$}o.elements=[...d.reverse(),...s],_e(o),gt(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=o.top+(r.classList.contains("drop-before")?Ne:0),s=o.bottom-(r.classList.contains("drop-after")?Ne:0);this.markDrop(r,a.clientY<(l+s)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(bs(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(s=>!le(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(t);if(o<0||l<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=ui(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return m;let i=this.canEdit,a=this.canvasFamily,r=(v,S)=>this.moveLayer(v,S),o=v=>{let S;this.mutate(H=>{S=gr(H,v)}),S&&(this.inspect={kind:"layer",id:S})},l=v=>{this.mutate(S=>fn(S,v)),this.inspect.kind==="layer"&&this.inspect.id===v&&(this.inspect={kind:"general"})},s=[...t.elements].filter(v=>!le(t,v)).reverse(),d=re(this.host()),c=new ze(this.buildContext(),this.draft?.config),p=t.perFamily[this.activeFamily],h=this.inspect.kind==="family",g=this.activeFamily==="inline"?"one line of text":`${p?.backgroundColorHex?ke(p.backgroundColorHex):"transparent"} \xB7 ${p?.borderColorHex?`${p.borderWidth} pt border`:"no border"}`,y=[...this.multi].filter(v=>t.elements.some(S=>S.payload.id===v)).length,$=Mi(t,this.buildContext(),this.forced)[a],k=Bc[this.thumbStep],R=Math.round(hs*k),b=Math.round(ms*k),f=v=>$?u`<span class="thumb">${Pr($,v,{icons:this.icons,imageSizes:this.imageSizes,width:R,height:b})}</span>`:u`<span class="thumb"></span>`,w=this.layerDetail==="expanded",E=(v,S)=>{let H=v.payload.id,C=this.inspect.kind==="layer"&&this.inspect.id===H,F=he(t,a,v),U=v.payload.isHidden||F.isHidden,ee=be(t,H)[0],oe=Kt(v.payload.rules),Xt=this.picking&&this.pickHoverId===H,W=this.rowDrag(H,i);return u`<div class="layer ${C?"hl":""} ${Xt?"pick":""} ${U?"dim":""} ${this.multi.has(H)?"multi":""} ${S?"kid":""} ${w?"rich":""}"
        style=${`--k:${Q[v.kind]}`} tabindex="0" draggable=${W.draggable}
        @pointerenter=${()=>{this.listHoverIds=[H]}}
        @pointerleave=${()=>this.leaveRow([H])}
        @click=${K=>this.clickRow(H,K)}
        @keydown=${K=>{K.key==="Enter"&&(this.inspect={kind:"layer",id:H})}}
        @dragstart=${W.onStart} @dragend=${W.onEnd} @dragover=${W.onOver} @drop=${W.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${_("grip")}</span>
        <span class="bar"></span>
        ${f([H])}
        <span class="name">
          <b>${ve(v,d)}</b>
          <small><span class="kind">${wt[v.kind]}</span> · ${Yc(v,c,this.historySeries)}</small>
          ${w?u`<span class="facts">${qc(this.host(),a,v,F).map(K=>u`<span class="fact"><b>${K.label}</b> ${K.value}</span>`)}</span>`:m}
        </span>
        <span class="right">
          <span class="badges">
            ${ee?u`<span class="badge tap" title=${`Tappable \xB7 ${ve(ee,d)}`}>tap</span>`:m}
            ${v.payload.rules.length===0?m:u`<span class="badge states" title=${oe}>${oe.replace(/\.$/,"").toLowerCase()}</span>`}
            ${U?u`<span class="badge">hidden</span>`:m}
          </span>
          ${i?u`<span class="acts">
            <button class="icon" title=${`Bring forward (${Ke}])`} aria-label="Bring forward" @click=${K=>{K.stopPropagation(),r(H,1)}}>${_("up")}</button>
            <button class="icon" title=${`Send back (${Ke}[)`} aria-label="Send back" @click=${K=>{K.stopPropagation(),r(H,-1)}}>${_("down")}</button>
            <button class="icon" title=${`${F.isHidden?"Show in":"Hide in"} ${V(a)} (${pa}${Ke}H)`} aria-label=${F.isHidden?"Show this layer":"Hide this layer"} @click=${K=>{K.stopPropagation(),this.mutate(se=>Ce(se,a,H,{isHidden:!F.isHidden}))}}>${_(F.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${Ke}D)`} aria-label="Duplicate" @click=${K=>{K.stopPropagation(),o(H)}}>${_("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${K=>{K.stopPropagation(),l(H)}}>${_("delete")}</button>
          </span>`:m}
        </span>
      </div>`},z=(v,S)=>{let H=this.inspect.kind==="group"&&this.inspect.id===v.id,C=!this.collapsed.has(v.id),F=this.rowDrag(v.id,i),U=S[0],ee=S[S.length-1],oe=W=>{let K=W.currentTarget,se=K.getBoundingClientRect(),ct=se.top+(K.classList.contains("drop-before")?Ne:0),xs=se.bottom-(K.classList.contains("drop-after")?Ne:0),ha=(W.clientY-ct)/Math.max(1,xs-ct);return ha<.25?"drop-before":!C&&ha>.75?"drop-after":"drop-into"},Xt=S.map(W=>W.payload.id);return u`<div class="layer group ${H?"hl":""} ${w?"rich":""}" style=${`--k:${q.group}`} tabindex="0" draggable=${F.draggable}
        @pointerenter=${()=>{this.listHoverIds=Xt}}
        @pointerleave=${()=>this.leaveRow(Xt)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:v.id}}}
        @keydown=${W=>{W.key==="Enter"&&(this.inspect={kind:"group",id:v.id})}}
        @dragstart=${F.onStart} @dragend=${F.onEnd}
        @dragover=${W=>{!this.dragId||this.dragId===v.id||(W.preventDefault(),this.markDrop(W.currentTarget,oe(W)))}}
        @drop=${W=>{W.preventDefault();let K=oe(W);this.clearDragMarks();let se=this.dragId;if(this.dragId=void 0,!(!se||!U||!ee)){if(K==="drop-before"){this.reorderLayer(se,U.payload.id,!0,!0);return}if(K==="drop-after"){this.reorderLayer(se,ee.payload.id,!1,!0);return}this.isGroupId(se)||(this.reorderLayer(se,U.payload.id,!0),this.mutate(ct=>hi(ct,se,v.id)))}}}>
        <button class="chev" aria-expanded=${C?"true":"false"} title=${C?"Fold the group":"Unfold the group"}
          @click=${W=>{W.stopPropagation();let K=new Set(this.collapsed);C?K.add(v.id):K.delete(v.id),this.collapsed=K}}>${_("chevron")}</button>
        <span class="bar"></span>
        ${f(S.map(W=>W.payload.id))}
        <span class="name">
          <b>${v.name}</b>
          <small><span class="kind">Group</span> · ${S.length} layer${S.length===1?"":"s"} · ${v.locked?"moves as one":"unlocked"}</small>
          ${w?u`<span class="facts"><span class="fact"><b>Holds</b> ${S.map(W=>ve(W,d)).join(", ")}</span></span>`:m}
        </span>
        <span class="right">
          ${i?u`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${pa}${Ke}G)`} aria-label="Ungroup" @click=${W=>{W.stopPropagation(),this.mutate(K=>Ot(K,v.id)),H&&(this.inspect={kind:"general"})}}>${_("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${v.locked?"on":""}" ?disabled=${!i}
            title=${v.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${v.locked?"Unlock the group":"Lock the group"}
            @click=${W=>{W.stopPropagation(),this.mutate(K=>{let se=K.groups?.find(ct=>ct.id===v.id);se&&(se.locked=!se.locked)})}}>${_(v.locked?"lock":"unlock")}</button>
        </span>
      </div>`},N=[],ne=new Set;for(let v=0;v<s.length;v++){let S=s[v],H=S.payload.groupId,C=H===void 0?void 0:t.groups?.find(U=>U.id===H);if(!C){N.push(E(S,!1));continue}if(ne.has(C.id))continue;ne.add(C.id);let F=s.filter(U=>U.payload.groupId===C.id);N.push(z(C,F)),this.collapsed.has(C.id)||N.push(u`<div class="group-kids">${F.map(U=>E(U,!0))}</div>`)}return u`<div class="card">
      <h2 class="panel-title tools"><span class="swatch">${_("layers")}</span>Layers<span class="spacer"></span>
        <span class="mini">top draws last</span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([v,S])=>u`
              <button class=${this.layerDetail===v?"on":""} title=${S} aria-label=${S} aria-pressed=${this.layerDetail===v?"true":"false"}
                @click=${()=>{this.layerDetail=v,this.saveListView()}}>${_(v)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${Gc.map((v,S)=>u`
              <button class=${this.thumbStep===S?"on":""} title=${`${fs[S]} row pictures`}
                aria-label=${`${fs[S]} row pictures`} aria-pressed=${this.thumbStep===S?"true":"false"}
                @click=${()=>{this.thumbStep=S,this.saveListView()}}>${v}</button>`)}
          </span>
        </span>
      </h2>
      ${this.activeFamily==="inline"?u`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${V(a)} shape.</div>`:m}
      ${y>=2&&i?u`<div class="group-cta"><span>${y} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${Ke}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?u`<div class="hint">${Jt}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:m}
      ${t.elements.length===0?u`<div class="empty">No layers yet. Add one above.</div>`:m}
      <div class="layers" style=${`--thumb-w:${R}px;--thumb-h:${b}px`}>
      ${N}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${q.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${v=>{v.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${v=>{this.dragId&&(v.preventDefault(),this.markDrop(v.currentTarget,"drop-before"))}}
        @drop=${v=>{v.preventDefault(),this.clearDragMarks();let S=this.dragId,H=[...s].reverse().find(C=>C.payload.id!==S&&C.payload.groupId!==S);S&&H&&this.reorderLayer(S,H.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${_("shape")}</span>
        <span class="bar"></span>
        ${f([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${V(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${g}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let t=this.presetKind?os(this.presetKind):void 0,i=this.presetEntity;return u`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?m:u`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${Ue(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},cs,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=ds(l,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return u`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return u`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Mi(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return u`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${Bt.map(o=>u`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Gt.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(t,r)}
      </div>
      ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):m}
      <div class="strip">
        ${this.renderSettingsRow(t)}
        ${this.renderShapesRow(t,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?He(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||He(l,o)?.locked)?Le(l,s).map(y=>y.payload.id):[],c=[...new Set([...d,...this.multi])],p=a.slots[t],h=this.focusTapId(),g={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:p,highlightId:h??o,...c.length>0&&!this.showTaps?{highlightIds:c}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return u`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(t,y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Oi(r,g)}
    </div>`}renderUnder(t,i){let a=re(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(p=>p.payload.id===r.id):void 0,l;if(this.showTaps)l=u`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Ae(t.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let p=t.groups?.find(g=>g.id===r.id),h=p?Le(t,p.id).length:0;l=p?u`editing group <b>${p.name}</b>. ${p.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let p=He(t,o.payload.id);l=p?.locked?u`editing <b>${ve(o,a)}</b> in <b>${p.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:u`editing <b>${ve(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return u`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=wn(s,i),c=Math.round(d.scale*100);return u`<div class="under"><b>${V(i)}</b> · ${s.width} × ${s.height} pt${c!==100?` \xB7 ${c}%`:""} · ${l}</div>`}renderInlinePreview(t,i){let a;if(!t)a=u`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?bt((t.countdownEnd-r)/1e3):t.text,l=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=u`<div class="inline-line">${l??m}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:u`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(t){let i=this.host(),a=this.records.find(c=>c.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?ua(r):void 0].filter(Boolean).join(" \xB7 "),l=t.values,s=new ze(this.buildContext(),this.draft?.config),d=re(i);return u`<div class="strip-row" style=${`--c:${q.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${_("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?u`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?u`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:u`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:m}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${Go(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?u`<button class="small" @click=${()=>{let c=Wo();this.mutate(p=>{p.values.push(c)}),this.inspect={kind:"data",id:c.id}}}>Add</button>`:m}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?u`<p class="empty">No shared values yet.</p>`:u`<div class="data">
        ${l.map(c=>{let p=s.resolve({kind:{kind:"named",id:c.id}}),h=this.inspect.kind==="data"&&this.inspect.id===c.id;return u`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:c.id}}}>
            <span class="name">${c.name||"(unnamed)"}</span>
            <span class="meta ${p===void 0?"none":""}" title=${pe(c.value,d)}>${p??"unresolved"}</span>
            ${this.canEdit?u`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(y=>{y.values=y.values.filter($=>$.id!==c.id)}),h&&(this.inspect={kind:"general"})}}>${_("delete")}</button>`:m}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(t,i){let a=t.supportedFamilies;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${q.place}`}><span class="swatch">${_("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${vt.map(r=>{if(!a.includes(r))return u`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${V(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${V(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let p=i[r];s=p?Oi(p,{icons:this.icons,imageSizes:this.imageSizes,slot:Gt.slots[r]}):m}let d=r!=="inline"&&t.elements.every(p=>he(t,r,p).isHidden||p.payload.isHidden)&&t.elements.length>0,c=this.canEdit&&xt(t,r);return u`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${V(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${V(r)}${d?u`<small>· nothing shown</small>`:m}${l?u`<small>· editing</small>`:m}</span>
            </button>
            ${this.canEdit?u`<button class="icon danger tile-x" ?disabled=${!c}
              title=${c?`Remove the ${V(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${V(r)} shape`}
              @click=${p=>{p.stopPropagation(),this.removeShape(r)}}>${_("delete")}</button>`:m}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let t=this.draft?.config;if(!t)return m;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return u`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${q.states}`}><span class="swatch">${_("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?u`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:m}
      </h2>
      ${i.length===0?u`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:u`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",c=this.testValues.get(r),h=t.elements.find(y=>gn(t,y.payload.id).some($=>$.ref.entityId===r))?.kind??"text",g=this.editingValue===r;return u`<button class="vchip ${c!==void 0?"testing":""}" style=${`--k:${Q[h]}`}
            title=${c!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${y=>{y.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${_(h)}</span><b>${l}</b>
            ${g?u`<input type="text" .value=${c??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${y=>{y.key==="Enter"&&y.target.blur(),y.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${y=>this.commitTestValue(r,y.target.value)} />`:u`<span class="val">${c!==void 0?`${c}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(t,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[t]?.state;a===""||a===o?r.delete(t):r.set(t,a),this.testValues=r}currentCase(){return Bt.find(t=>t.label===this.previewCase)??Gt}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":V(this.activeFamily),l=a.kind==="family"&&i===void 0?u`<span class="here" style=${`--k:${q.place}`}>${o} shape</span>`:u`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=m,d=m;if(i!==void 0)s=u`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let c=t.elements.find(p=>p.payload.id===a.id);if(c){s=u`<span class="here" style=${`--k:${Q[c.kind]}`}><span class="kchip">${wt[c.kind]}</span>${ve(c,re(this.host()))}</span>`;let p=He(t,c.payload.id);p&&(d=u`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:p.id}}} title="Edit the group">${p.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(p=>p.id===a.id);c&&(s=u`<span class="here" style=${`--k:${q.group}`}><span class="kchip">Group</span>${c.name}</span>`)}else if(a.kind==="data"){let c=t.values.find(p=>p.id===a.id);c&&(s=u`<span class="here" style=${`--k:${q.complication}`}><span class="kchip">Value</span>${c.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=u`<span class="mini">nothing selected</span>`);return u`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===m?m:u`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let t=this.draft?.config;if(!t)return m;let i=this.pickedElements(t);if(i.length>=2)return u`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=m,l=!0;if(r.kind==="layer"){let d=t.elements.find(c=>c.payload.id===r.id);if(!d)return this.inspect={kind:"general"},m;o=qo(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=t.groups?.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;l=!1,o=Jo(a,d)}else if(r.kind==="data"){let d=t.values.find(c=>c.id===r.id);if(!d)return this.inspect={kind:"general"},m;l=!1,o=u`<div class="sec" data-open="true" style=${`--c:${q.complication}`}>
        <div class="sec-h"><span class="swatch">${_("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${Ko(a,d)}</div>
      </div>`}else r.kind==="family"?o=Xo(a,this.activeFamily):(l=!1,o=u`<div class="empty-insp">${_("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return u`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?u`<button class="expand" @click=${()=>{this.openSections=s?new Set([Dc(r)]):new Set(ea)}}>${s?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(t,i,a){return u`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${t}${i==="mixed"?u` <span class="mixed">(mixed)</span>`:m}</span></label>`}multiEditor(t,i){let a=this.canvasFamily,r=re(this.host()),o=new ze(this.buildContext(),this.draft?.config),l=jo(t,a,i),s=i.length,d=[...i].reverse(),c=h=>this.mutate(g=>{for(let y of i)Ce(g,a,y.payload.id,{isHidden:h})}),p=h=>this.mutate(g=>{for(let y of i){let $=g.elements.find(k=>k.payload.id===y.payload.id);$&&$.kind!=="image"&&$.kind!=="tap"&&($.payload.colorSlot.baseColorHex=h)}},"multi-colour");return u`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${_("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(h=>u`<div class="row" style=${`--k:${Q[h.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${h.kind==="icon"?u`<span class="glyph">${this.icons.render(o.resolve(h.payload.symbol)??"questionmark",16,h.payload.colorSlot.baseColorHex)??m}</span>`:m}
                <b>${ve(h,r)}</b><span class="kind">${wt[h.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${Jt}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" title=${`Group (${Ke}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${q.place}`}>
        <div class="sec-h"><span class="swatch">${_("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${V(a)}`,l.hiddenHere,c)}
          ${l.colourable?u`${ae("Colour",l.colour,h=>{h!==void 0&&p(h)})}
              ${l.colour===void 0?u`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:m}`:u`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Hiding, like size and place, belongs to the ${V(a)} shape alone.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let t=this.draft;if(!t)return m;let i=this.records.find(r=>r.id===this.selectedId),a=Jr({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return u`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?u` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?u`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:m}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?u`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:m}
      </div>
    </details>`}};A([ht({attribute:!1})],I.prototype,"hass",2),A([ht({type:Boolean})],I.prototype,"narrow",2),A([ht({attribute:!1})],I.prototype,"panel",2),A([L()],I.prototype,"colLeft",2),A([L()],I.prototype,"colRight",2),A([L()],I.prototype,"panelWidth",2),A([L()],I.prototype,"owners",2),A([L()],I.prototype,"ownerId",2),A([L()],I.prototype,"records",2),A([L()],I.prototype,"selectedId",2),A([L()],I.prototype,"draft",2),A([L()],I.prototype,"readOnlyReason",2),A([L()],I.prototype,"parseError",2),A([L()],I.prototype,"maxSchemaVersion",2),A([L()],I.prototype,"presets",2),A([L()],I.prototype,"occupied",2),A([L()],I.prototype,"serverToken",2),A([L()],I.prototype,"appliedToken",2),A([L()],I.prototype,"polling",2),A([L()],I.prototype,"sendPending",2),A([L()],I.prototype,"pages",2),A([L()],I.prototype,"templateResults",2),A([L()],I.prototype,"historySeries",2),A([L()],I.prototype,"templateError",2),A([L()],I.prototype,"templateFetchedAt",2),A([L()],I.prototype,"forced",2),A([L()],I.prototype,"showRaw",2),A([L()],I.prototype,"inspect",2),A([L()],I.prototype,"openSections",2),A([L()],I.prototype,"pickerOpen",2),A([L()],I.prototype,"testValues",2),A([L()],I.prototype,"editingValue",2),A([L()],I.prototype,"thumbStep",2),A([L()],I.prototype,"layerDetail",2),A([L()],I.prototype,"addOpen",2),A([L()],I.prototype,"addDetail",2),A([L()],I.prototype,"multi",2),A([L()],I.prototype,"collapsed",2),A([L()],I.prototype,"activeFamily",2),A([L()],I.prototype,"picking",2),A([L()],I.prototype,"pickHoverId",2),A([L()],I.prototype,"listHoverIds",2),A([L()],I.prototype,"zoomed",2),A([L()],I.prototype,"helpOpen",2),A([L()],I.prototype,"showTaps",2),A([L()],I.prototype,"timestampActiveId",2),A([L()],I.prototype,"savedName",2),A([L()],I.prototype,"presetKind",2),A([L()],I.prototype,"presetEntity",2),A([L()],I.prototype,"newShapeChooser",2),A([L()],I.prototype,"previewCase",2),A([L()],I.prototype,"loadError",2),A([L()],I.prototype,"saveError",2),A([L()],I.prototype,"saving",2),A([L()],I.prototype,"conflict",2),A([L()],I.prototype,"remoteRevision",2),A([L()],I.prototype,"confirmDelete",2),A([L()],I.prototype,"moveTarget",2),A([L()],I.prototype,"moving",2),A([L()],I.prototype,"moveError",2),A([L()],I.prototype,"version",2);function We(e){return String(e?.message??e)}function jc(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function ua(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function qc(e,n,t,i){let a=ge[n],r=i.frame,o=d=>Math.round(d),l=[{label:"Shows",value:ia(e,t)}],s=On(t);return s&&l.push({label:"Looks",value:s}),l.push({label:"At",value:`${o(r.x*a.width)}, ${o(r.y*a.height)} pt`}),l.push({label:"Size",value:`${o(r.width*a.width)} x ${o(r.height*a.height)} pt`}),r.rotationDegrees!==0&&l.push({label:"Turned",value:`${Math.round(r.rotationDegrees)}\xB0`}),i.fromPlacement&&l.push({label:"Frame",value:`${V(n)} only`}),l}function Yc(e,n,t){let i=a=>u`<span class="val-tok">${a??"--"}</span>`;switch(e.kind){case"text":return u`${i(n.resolve(e.payload.value))} · ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${ke(e.payload.colorSlot.baseColorHex)}`;case"gauge":return u`${i(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let a=et(e.payload),r=a!==void 0?t.get(a)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Vt(r).length} values`}case"shape":return`${ke(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Ae(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",I);export{I as WristAssistantPanel,vs as columnFit,qc as layerFacts};
