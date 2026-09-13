var yh=Object.defineProperty;var bh=Object.getOwnPropertyDescriptor;var V=(e,n,t,i)=>{for(var a=i>1?void 0:i?bh(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&yh(n,t,a),a};var ra=globalThis,oa=ra.ShadowRoot&&(ra.ShadyCSS===void 0||ra.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Dr=Symbol(),cl=new WeakMap,hi=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Dr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(oa&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=cl.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&cl.set(t,n))}return n}toString(){return this.cssText}},Te=e=>new hi(typeof e=="string"?e:e+"",void 0,Dr),Or=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new hi(t,e,Dr)},ul=(e,n)=>{if(oa)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=ra.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Vr=oa?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return Te(t)})(e):e;var{is:xh,defineProperty:vh,getOwnPropertyDescriptor:wh,getOwnPropertyNames:kh,getOwnPropertySymbols:$h,getPrototypeOf:Ch}=Object,sa=globalThis,pl=sa.trustedTypes,Sh=pl?pl.emptyScript:"",Th=sa.reactiveElementPolyfillSupport,mi=(e,n)=>e,fi={toAttribute(e,n){switch(n){case Boolean:e=e?Sh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},la=(e,n)=>!xh(e,n),hl={attribute:!0,type:String,converter:fi,reflect:!1,useDefault:!1,hasChanged:la};Symbol.metadata??=Symbol("metadata"),sa.litPropertyMetadata??=new WeakMap;var yt=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=hl){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&vh(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=wh(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??hl}static _$Ei(){if(this.hasOwnProperty(mi("elementProperties")))return;let n=Ch(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(mi("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(mi("properties"))){let t=this.properties,i=[...kh(t),...$h(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Vr(a))}else n!==void 0&&t.push(Vr(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ul(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:fi).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:fi;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??la)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};yt.elementStyles=[],yt.shadowRootOptions={mode:"open"},yt[mi("elementProperties")]=new Map,yt[mi("finalized")]=new Map,Th?.({ReactiveElement:yt}),(sa.reactiveElementVersions??=[]).push("2.1.2");var Gr=globalThis,ml=e=>e,da=Gr.trustedTypes,fl=da?da.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ur="$lit$",bt=`lit$${Math.random().toFixed(9).slice(2)}$`,Kr="?"+bt,Eh=`<${Kr}>`,dn=document,yi=()=>dn.createComment(""),bi=e=>e===null||typeof e!="object"&&typeof e!="function",Wr=Array.isArray,wl=e=>Wr(e)||typeof e?.[Symbol.iterator]=="function",Br=`[ 	
\f\r]`,gi=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gl=/-->/g,yl=/>/g,sn=RegExp(`>|${Br}(?:([^\\s"'>=/]+)(${Br}*=${Br}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),bl=/'/g,xl=/"/g,kl=/^(?:script|style|textarea|title)$/i,jr=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=jr(1),w=jr(2),Vx=jr(3),xt=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),vl=new WeakMap,ln=dn.createTreeWalker(dn,129);function $l(e,n){if(!Wr(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return fl!==void 0?fl.createHTML(n):n}var Cl=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=gi;for(let s=0;s<t;s++){let l=e[s],d,c,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,c=o.exec(l),c!==null);)p=o.lastIndex,o===gi?c[1]==="!--"?o=gl:c[1]!==void 0?o=yl:c[2]!==void 0?(kl.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=sn):c[3]!==void 0&&(o=sn):o===sn?c[0]===">"?(o=a??gi,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?sn:c[3]==='"'?xl:bl):o===xl||o===bl?o=sn:o===gl||o===yl?o=gi:(o=sn,a=void 0);let m=o===sn&&e[s+1].startsWith("/>")?" ":"";r+=o===gi?l+Eh:u>=0?(i.push(d),l.slice(0,u)+Ur+l.slice(u)+bt+m):l+bt+(u===-2?s:m)}return[$l(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},xi=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,c]=Cl(n,t);if(this.el=e.createElement(d,i),ln.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=ln.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Ur)){let p=c[o++],m=a.getAttribute(u).split(bt),y=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:y[2],strings:m,ctor:y[1]==="."?ua:y[1]==="?"?pa:y[1]==="@"?ha:un}),a.removeAttribute(u)}else u.startsWith(bt)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(kl.test(a.tagName)){let u=a.textContent.split(bt),p=u.length-1;if(p>0){a.textContent=da?da.emptyScript:"";for(let m=0;m<p;m++)a.append(u[m],yi()),ln.nextNode(),l.push({type:2,index:++r});a.append(u[p],yi())}}}else if(a.nodeType===8)if(a.data===Kr)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(bt,u+1))!==-1;)l.push({type:7,index:r}),u+=bt.length-1}r++}}static createElement(n,t){let i=dn.createElement("template");return i.innerHTML=n,i}};function cn(e,n,t=e,i){if(n===xt)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=bi(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=cn(e,a._$AS(e,n.values),a,i)),n}var ca=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??dn).importNode(t,!0);ln.currentNode=a;let r=ln.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new jn(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new ma(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=ln.nextNode(),o++)}return ln.currentNode=dn,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},jn=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=cn(this,n,t),bi(n)?n===f||n==null||n===""?(this._$AH!==f&&this._$AR(),this._$AH=f):n!==this._$AH&&n!==xt&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):wl(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==f&&bi(this._$AH)?this._$AA.nextSibling.data=n:this.T(dn.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=xi.createElement($l(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new ca(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=vl.get(n.strings);return t===void 0&&vl.set(n.strings,t=new xi(n)),t}k(n){Wr(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(yi()),this.O(yi()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=ml(n).nextSibling;ml(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},un=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=cn(this,n,t,0),o=!bi(n)||n!==this._$AH&&n!==xt,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=cn(this,s[i+l],t,l),d===xt&&(d=this._$AH[l]),o||=!bi(d)||d!==this._$AH[l],d===f?n=f:n!==f&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},ua=class extends un{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===f?void 0:n}},pa=class extends un{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==f)}},ha=class extends un{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=cn(this,n,t,0)??f)===xt)return;let i=this._$AH,a=n===f&&i!==f||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},ma=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){cn(this,n)}},Sl={M:Ur,P:bt,A:Kr,C:1,L:Cl,R:ca,D:wl,V:cn,I:jn,H:un,N:pa,U:ha,B:ua,F:ma},Mh=Gr.litHtmlPolyfillSupport;Mh?.(xi,jn),(Gr.litHtmlVersions??=[]).push("3.3.3");var Tl=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new jn(n.insertBefore(yi(),r),r,void 0,t??{})}return a._$AI(e),a};var qr=globalThis,It=class extends yt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Tl(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return xt}};It._$litElement$=!0,It.finalized=!0,qr.litElementHydrateSupport?.({LitElement:It});var Rh=qr.litElementPolyfillSupport;Rh?.({LitElement:It});(qr.litElementVersions??=[]).push("4.2.2");var Fh={attribute:!0,type:String,converter:fi,reflect:!1,hasChanged:la},Ah=(e=Fh,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function qn(e){return(n,t)=>typeof t=="object"?Ah(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function B(e){return qn({...e,state:!0,attribute:!1})}var et="wrist_assistant/complications";async function El(e){return e.connection.sendMessagePromise({type:`${et}/owners`})}async function Ml(e,n){return e.connection.sendMessagePromise({type:`${et}/list`,owner_watch_id:n})}async function Rl(e,n){return e.connection.sendMessagePromise({type:`${et}/nudge`,owner_watch_id:n})}async function Fl(e,n){return e.connection.sendMessagePromise({type:`${et}/watch_status`,owner_watch_id:n})}async function Al(e,n,t,i){return e.connection.sendMessagePromise({type:`${et}/save`,owner_watch_id:n,document:t,base_revision:i})}async function Hl(e,n,t,i){return e.connection.sendMessagePromise({type:`${et}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function Il(e,n,t){return e.connection.sendMessagePromise({type:`${et}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function Ll(e,n,t){let i={type:`${et}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function _l(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${et}/render_values`,templates:n})).results}async function zl(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${et}/history_series`,requests:n})).results}function Nl(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{}}}function Pl(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function Dl(e){let n=new Map,t=new Map;for(let[i,a]of Object.entries(e))a.ok&&(n.set(i,a.series),typeof a.readings=="number"&&t.set(i,{readings:a.readings,averaged:a.averaged===!0}));return{series:n,readings:t}}async function Ol(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${et}/statistics_series`,requests:n})).results}var ae=["rectangular","circular","corner"],ue={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},wi=["rectangular","circular","corner","inline"];var to=64;function nd(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<to;i++)if(!t.has(i))return i;return-1}function id(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function gn(e){return ae.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var Hh=["none","dot","triangle"],Ih=["straight","smooth","step"],Lh=["light","medium","strong"],_h={light:.05,medium:.1,strong:.2};function Vl(e){return typeof e=="string"&&Ih.includes(e)?e:"straight"}var zh=["flat","fade"],Nh=["none","all","auto"],ad=4,kt="#FFFFFF33";function Nt(e){return typeof e=="string"&&zh.includes(e)?e:"flat"}function Qr(e){return typeof e=="string"&&Nh.includes(e)?e:"none"}function eo(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(ad,Math.round(e)))}function rd(e,n){return e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Lt(e){return typeof e=="string"&&e!==""?e:kt}var Ph=1,Dh=12;function st(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(Ph,Math.min(Dh,e))}function ka(e){return e==="all"?"all":"auto"}var Ot=1,Vt=3,$a=.25,Ca=4;function yn(e){return typeof e!="number"||!Number.isFinite(e)?Vt:Math.max(1,Math.min(ad,Math.round(e)))}function bn(e){return typeof e!="number"||!Number.isFinite(e)?Ot:Math.max($a,Math.min(Ca,e))}var Oh=["all","top"],Yn=1.2;function Pt(e){return typeof e!="number"||!Number.isFinite(e)?Yn:Math.max(0,e)}function Dt(e){return typeof e=="string"&&Oh.includes(e)?e:"all"}function tt(e){if(typeof e=="string")return Lh.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function od(e,n){if(n===void 0||e<2)return 0;let t=Math.max(3,Math.floor(e*_h[n]+.5));return t%2===0?t+1:t}var Vh=[["history","Recorded history"],["statistics","Long-term statistics"]],Sa=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],no=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],io="history",Si="hour",Ti="mean",xn=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Ei={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Bt=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function dt(e){return e!=="threshold"&&e!=="zero"}var Ta=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function Bh(e){return Bt.some(([n])=>n===e)}function Gh(e){return Ta.some(([n])=>n===e)}function Uh(e){if(!P(e)||typeof e.layer!="string"||e.layer==="")return;let n={layer:e.layer.toUpperCase(),at:Bh(e.at)?e.at:"highest",place:Gh(e.place)?e.place:"above"},t=Y(e.dx,0),i=Y(e.dy,0);return t!==0&&(n.dx=t),i!==0&&(n.dy=i),n}function ga(e,n){let t=Uh(e.chartAnchor);t!==void 0&&(n.chartAnchor=t)}function ya(e,n){e.chartAnchor!==void 0&&(n.chartAnchor=Kh(e.chartAnchor))}function Kh(e){let n={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(n.dx=q(e.dx)),e.dy!==void 0&&e.dy!==0&&(n.dy=q(e.dy)),n}var Le={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"};function sd(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function nt(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function vn(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function Mi(e){let n=c=>c.value.kind.kind!=="literal",t=(c,u)=>e.slice(c,u).map(p=>vn(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return I(t(0,e.length));let a=e.findIndex((c,u)=>u>i&&n(c)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let d={kind:structuredClone(r.kind)};return Ae(o)||(d.format=o),d}function ld(e){nt(e)&&(e.value=Mi(e.parts))}var Xn="#FFFFFF";function Bl(e){return typeof e=="string"&&Hh.includes(e)}function Wh(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function $i(e){let n=Wh(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function dd(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function cd(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function jh(e,n){e.marker=dd(n),cd(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var Ea=24,qe="#FF6B35",Ye="#32D74B",ao="#32D74B",oe="#FF453A",ro="#FF453A",oo="#FFFFFF99";function Gt(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function ud(e){return e.coloring==="bands"&&e.bands.length>0}function Ma(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function so(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function pd(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var wn=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],Ra=360,Fa=10080,Ri=[...wn,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],lo=366*24*60,co=2,Ut=120,uo=0;function po(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?uo:Math.max(co,Math.min(Ut,n)):24}function kn(e){return mo(e)!==void 0?!0:ho(e)!==void 0&&po(e)>0}function ho(e){if(e.source==="history")return hd(e)}function mo(e){if(e.source==="statistics")return hd(e)}function hd(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function $n(e){let n=ho(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${po(e)}${e.gaps===!0?"|gaps":""}`}function Cn(e){let n=mo(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function md(e){return[...fo(e).map(t=>t.key),...go(e).map(t=>t.key)].sort().join(";")}function fo(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=$n(i.payload),r=ho(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:po(i.payload),mode:"numeric",gaps:i.payload.gaps===!0})}else if(i.kind==="timeline"){let a=ct(i.payload),r=vd(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:it(i.payload),points:qt,mode:"states",gaps:!1})}return[...n.values()]}function go(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=Cn(t.payload),a=mo(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType,gaps:t.payload.gaps===!0})}return[...n.values()]}var fd=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],gd=[["auto","Auto"],["always","Always"],["never","Never"]];function Yr(e){return e==="h12"||e==="h24"?e:hn}function Xr(e){return e==="always"||e==="never"?e:mn}function qh(e){return e.timeLabelCount!==void 0?lt(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:pn}function lt(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(Sn,Math.round(n))):pn}function Fi(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var Kt="#8E8E93",yd=1,Yh="#000000",Xh=2,Jh=1440,yo=60,pn=0,Xe=9,Je="#8E8E93",hn="auto",mn="auto",bd=4,Sn=12,Wt=1,jt=20,Aa=4,qt=120;function xd(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function it(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(Fa,n)):yo}function vd(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function ct(e){let n=vd(e);if(n!==void 0)return`${n}|${it(e)}|${qt}|states`}var Zh={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},Ai={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function ba(e){return Zh[e.trim().toLowerCase()]??Kt}var Qh=["door","garage_door","window","opening"];function bo(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&Qh.includes(t),a=o=>ba(i&&o==="on"?"open":o);return[...Ai[e]??[],"unavailable","unknown"].map(o=>({id:X(),match:o,colorHex:a(o)}))}var Jn=6,Ha=9,em=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ia(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function tm(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var xo={top:0,left:0,bottom:0,right:0};function La(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var nm=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function wd(e){return nm.includes(e)}function kd(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var vo=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function $t(e){let n=vo.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function P(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function W(e,n=""){return typeof e=="string"?e:n}function Y(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function ot(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function ki(e){return e==null?void 0:Y(e,0)}function ce(e){return typeof e=="string"?e:void 0}function Jr(e,n,t){return n.some(([i])=>i===e)?e:t}var Ze=class extends Error{};function _t(e){if(typeof e.entityId!="string")throw new Ze("entityId is required");let n={entityId:e.entityId,displayName:W(e.displayName),domain:W(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Gl(e){if(!P(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=Y(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=Y(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=Y(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Ae(n)?void 0:n}function Ae(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function im(e){let n=W(e.function,"count"),t=P(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(P).map(_t)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(P(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:W(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Ul(e){switch(e.kind){case"literal":return{kind:"literal",value:W(e.value)};case"entityState":return{kind:"entityState",..._t(e)};case"entityAttribute":return{kind:"entityAttribute",..._t(e),attribute:W(e.attribute)};case"entityAge":return{kind:"entityAge",..._t(e)};case"aggregate":return{kind:"aggregate",aggregate:im(P(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ce(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:W(e.value)};case"named":return{kind:"named",id:W(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:W(e.layer).toUpperCase(),stat:xn.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new Ze(`unknown value kind ${String(e.kind)}`)}}function me(e){if(!P(e))throw new Ze("value must be an object");if(P(e.kind)){let i={kind:Ul(e.kind)},a=Gl(e.format);return a&&(i.format=a),i}let n={kind:Ul(e)},t=Gl(e.format);return t&&(n.format=t),n}function $d(e){return P(e)?{x:Y(e.x,.25),y:Y(e.y,.25),width:Y(e.width,.5),height:Y(e.height,.5),rotationDegrees:Y(e.rotationDegrees,0)}:{...Ei}}function am(e){if(!P(e))return{kind:"isOn"};let n=W(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=P(e.value)?me(e.value):I("");break;case"between":case"timeBetween":t.value=P(e.value)?me(e.value):I(""),t.upper=P(e.upper)?me(e.upper):I("");break;case"matchesRegex":t.pattern=W(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Kl(e){if(!P(e))return{kind:"show"};let n=W(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=P(e.value)?me(e.value):I("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=Y(e.number,0);break;case"setFontWeight":t.weight=ce(e.weight)??"regular";break;default:break}return t}function Cd(e){return Array.isArray(e)?e.filter(P).map(n=>{let t={id:W(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(P).map(i=>{let a=P(i.when)?i.when:{};return{id:W(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(P).map(r=>({id:W(r.id).toUpperCase(),value:P(r.value)?me(r.value):I(""),comparison:am(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Kl)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Kl)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function rm(e,n){return{baseColorHex:P(e)?W(e.baseColorHex,n):n}}function xa(e){return Array.isArray(e)?e.filter(P).map(n=>({id:W(n.id,X()),upTo:Y(n.upTo,0),colorHex:W(n.colorHex,"#FFFFFF")})):[]}function om(e){return Array.isArray(e)?e.filter(P).map(n=>{let t={id:W(n.id,X()).toUpperCase(),value:P(n.value)?me(n.value):I("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=ce(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize),ce(n.coloring)==="bands"&&(t.coloring="bands");let a=xa(n.bands);a.length>0&&(t.bands=a);let r=W(n.bandAboveColorHex,oe);return r!==oe&&(t.bandAboveColorHex=r),t}):[]}function sm(e){if(Array.isArray(e.bands))return xa(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=P(e.colorSlot)?W(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:X(),upTo:e.bandLowerBound,colorHex:W(e.bandLowColorHex,ao)},{id:X(),upTo:Y(e.bandUpperBound,100),colorHex:n}]}function lm(e){return Array.isArray(e)?e.filter(P).map(n=>({id:W(n.id,X()).toUpperCase(),match:W(n.match,""),colorHex:W(n.colorHex,Kt)})):[]}function je(e,n){if(typeof e.id!="string")throw new Ze("element id is required");return{id:e.id.toUpperCase(),colorSlot:rm(e.colorSlot,n),rules:Cd(e.rules),frame:$d(e.frame),isHidden:e.isHidden===!0}}function dm(e){let n=cm(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),n}function cm(e){if(!P(e)||!P(e.payload))throw new Ze("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...je(n,"#FFFFFF"),value:P(n.value)?me(n.value):I(""),fontSize:Y(n.fontSize,14),fontWeight:ce(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1;Math.min(2,Math.max(1,i))===2&&(t.lineLimit=2);let a=ce(n.alignment);(a==="leading"||a==="trailing")&&(t.alignment=a),ce(n.coloring)==="bands"&&(t.coloring="bands");let r=xa(n.bands);r.length>0&&(t.bands=r);let o=W(n.bandAboveColorHex,oe);o!==oe&&(t.bandAboveColorHex=o);let s=ce(n.highlight);(s==="highest"||s==="lowest"||s==="both")&&(t.highlight=s);let l=W(n.highColorHex,qe);l!==qe&&(t.highColorHex=l);let d=W(n.lowColorHex,Ye);d!==Ye&&(t.lowColorHex=d);let c=om(n.parts);return c.length>0&&(t.parts=c),ga(n,t),{kind:"text",payload:t}}case"icon":{let t={...je(n,"#FFFFFF"),symbol:P(n.symbol)?me(n.symbol):I("lightbulb"),size:Y(n.size,14)},i=ce(n.path);return i!==void 0&&i!==""&&(t.path=i),ga(n,t),{kind:"icon",payload:t}}case"gauge":{let t={...je(n,"#FFFFFF"),value:P(n.value)?me(n.value):I("50"),minValue:Y(n.minValue,0),maxValue:Y(n.maxValue,100),style:ce(n.style)??"arc",lineWidth:Y(n.lineWidth,4),trackColorHex:W(n.trackColorHex,"#FFFFFF40"),coloring:ce(n.coloring)??"uniform",bands:xa(n.bands),bandAboveColorHex:W(n.bandAboveColorHex,oe),thresholdColorHex:W(n.thresholdColorHex,Xn)},i=ki(n.thresholdValue);return i!==void 0&&(t.thresholdValue=i),P(n.total)&&(t.total=me(n.total)),P(n.minSource)&&(t.minSource=me(n.minSource)),P(n.maxSource)&&(t.maxSource=me(n.maxSource)),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...je(n,"#FFFFFF"),value:P(n.value)?me(n.value):I("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(Y(n.historyMinutes,0))),historyPoints:Math.round(Y(n.historyPoints,24)),source:Jr(ce(n.source),Vh,io),statPeriod:Jr(ce(n.statPeriod),Sa,Si),statType:Jr(ce(n.statType),no,Ti),style:ce(n.style)??"bars",limit:Math.max(0,Math.round(Y(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:ce(n.scale)??"auto",minValue:Y(n.minValue,0),maxValue:Y(n.maxValue,100),baseline:ce(n.baseline)??"lowest",barGap:Y(n.barGap,1.5),lineWidth:Y(n.lineWidth,2),highlight:ce(n.highlight)??"none",highColorHex:W(n.highColorHex,qe),lowColorHex:W(n.lowColorHex,Ye),marker:ce(n.marker)??"pointer",...Bl(n.highMarker)?{highMarker:n.highMarker}:{},...Bl(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:ce(n.coloring)??"uniform",bands:sm(n),bandAboveColorHex:W(n.bandHighColorHex,W(n.bandAboveColorHex,oe)),fillBands:n.fillBands===!0,...Vl(n.curve)!=="straight"?{curve:Vl(n.curve)}:{},...Nt(n.fillStyle)!=="flat"?{fillStyle:Nt(n.fillStyle)}:{},...typeof n.fillColorHex=="string"?{fillColorHex:n.fillColorHex}:{},...Pt(n.barRadius)!==Yn?{barRadius:Pt(n.barRadius)}:{},...Dt(n.barCorners)!=="all"?{barCorners:Dt(n.barCorners)}:{},...Qr(n.pointDots)!=="none"?{pointDots:Qr(n.pointDots)}:{},...st(n.pointDotSize)!==void 0?{pointDotSize:st(n.pointDotSize)}:{},...typeof n.pointDotColorHex=="string"?{pointDotColorHex:n.pointDotColorHex}:{},...eo(n.gridLines)!==0?{gridLines:eo(n.gridLines)}:{},...rd(Lt(n.gridColorHex),kt)?{}:{gridColorHex:Lt(n.gridColorHex)},...n.zeroLine===!0?{zeroLine:!0}:{},...tt(n.smoothing)!==void 0?{smoothing:tt(n.smoothing)}:{},...n.gaps===!0?{gaps:!0}:{},...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:W(n.thresholdColorHex,ro),...P(n.nowIndex)?{nowIndex:me(n.nowIndex)}:{},nowColorHex:W(n.nowColorHex,oo),...n.drawsThreshold===!1?{drawsThreshold:!1}:{},...n.drawsNowLine===!1?{drawsNowLine:!1}:{},...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...ce(n.scaleFrom)!==void 0?{scaleFrom:ce(n.scaleFrom)}:{},timeLabelCount:lt(n.timeLabelCount),labelSize:Y(n.labelSize,Xe),labelColorHex:W(n.labelColorHex,Je),labelsAbove:n.labelsAbove===!0,hourCycle:Yr(n.hourCycle),minutes:Xr(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=je(n,"#FFFFFF");return{kind:"timeline",payload:{...i,value:P(n.value)?me(n.value):I(""),historyMinutes:Math.max(1,Math.round(Y(n.historyMinutes,yo))),bands:lm(n.bands),otherColorHex:W(n.otherColorHex,Kt),gap:Math.min(Aa,Math.max(0,Y(n.gap,0))),cornerRadius:Math.max(0,Y(n.cornerRadius,yd)),timeLabelCount:qh(n),labelSize:Y(n.labelSize,Xe),labelColorHex:W(n.labelColorHex,Je),labelsAbove:n.labelsAbove===!0,hourCycle:Yr(n.hourCycle),minutes:Xr(n.minutes),...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let t={...je(n,"#FFFFFF33"),kind:ce(n.kind)??"roundedRectangle",cornerRadius:Y(n.cornerRadius,6),thickness:Y(n.thickness,1),borderWidth:Y(n.borderWidth,1)};return typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),ga(n,t),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=je(n,"#FFFFFF"),a={...i,entity:_t(P(n.entity)?n.entity:{}),source:n.source==="entityPicture"?"entityPicture":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:Y(n.zoom,1),panX:Y(n.panX,0),panY:Y(n.panY,0),cornerRadius:Y(n.cornerRadius,Jn),timestampCorner:em.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:Y(n.timestampSize,Ha)};n.timestamp===!0&&(a.timestamp=!0);let r=ki(n.timestampX),o=ki(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=ot(r),a.timestampY=ot(o)),ga(n,a),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=je(n,"#FFFFFF"),a={...i,action:P(n.action)?Sd(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}case"chartTimes":{let{colorSlot:t,...i}=je(n,"#FFFFFF");return{kind:"chartTimes",payload:{...i,chart:W(n.chart).toUpperCase(),timeLabelCount:lt(n.timeLabelCount),labelSize:Y(n.labelSize,Xe),labelColorHex:W(n.labelColorHex,Je),hourCycle:Yr(n.hourCycle),minutes:Xr(n.minutes)}}}case"imageTime":{let{colorSlot:t,...i}=je(n,"#FFFFFF");return{kind:"imageTime",payload:{...i,image:W(n.image).toUpperCase()}}}case"chartDots":{let{colorSlot:t,...i}=je(n,"#FFFFFF"),a=st(n.size);return{kind:"chartDots",payload:{...i,chart:W(n.chart).toUpperCase(),dots:ka(n.dots),...a!==void 0?{size:a}:{},...typeof n.colorHex=="string"?{colorHex:n.colorHex}:{}}}}case"chartGrid":{let{colorSlot:t,...i}=je(n,"#FFFFFF");return{kind:"chartGrid",payload:{...i,chart:W(n.chart).toUpperCase(),lines:yn(n.lines),colorHex:Lt(n.colorHex),thickness:bn(n.thickness)}}}default:throw new Ze(`unknown element kind ${String(e.kind)}`)}}function Wl(e){let n=P(e)?e:{},t={};if(P(n.placements))for(let[a,r]of Object.entries(n.placements)){if(!P(r))continue;let o={frame:$d(r.frame),isHidden:r.isHidden===!0},s=ki(r.size);s!==void 0&&(o.size=s),t[a.toUpperCase()]=o}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:Y(n.borderWidth,2),rules:Cd(n.rules)};if(P(n.bezelText)&&(i.bezelText=me(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),P(n.curvedText)&&(i.curvedText=me(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),P(n.bezelGauge)){let a=n.bezelGauge,r={value:P(a.value)?me(a.value):I("50"),minValue:Y(a.minValue,0),maxValue:Y(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};P(a.minLabel)&&(r.minLabel=me(a.minLabel)),P(a.maxLabel)&&(r.maxLabel=me(a.maxLabel)),i.bezelGauge=r}return typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function um(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Wl(e[t+1]))}else if(P(e))for(let[t,i]of Object.entries(e))n[t]=Wl(i);return n}function pm(e){let n={value:P(e.value)?me(e.value):I("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function Sd(e){if(!P(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,..._t(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=_t(e)),n}default:return{type:"none"}}}function Zn(e){if(!P(e))throw new Ze("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Ze(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(P).map(r=>({id:W(r.id).toUpperCase(),name:W(r.name),value:P(r.value)?me(r.value):I("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(P).map(r=>r.kind==="template"?{kind:"template",value:W(r.value)}:r.kind==="entity"?{kind:"entity",..._t(r)}:null).filter(r=>r!==null),i={schemaVersion:Y(e.schemaVersion,1),id:W(e.id).toUpperCase(),name:W(e.name,"Custom"),values:n,slotIndex:Y(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(dm),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:um(e.perFamily),dataSources:t,tapAction:Sd(e.tapAction)};P(e.inline)&&(i.inline=pm(e.inline));let a=ki(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(P).filter(o=>typeof o.id=="string").map(o=>({id:W(o.id).toUpperCase(),name:W(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return wm(i,Array.isArray(e.elements)?e.elements:[]),at(i),i}function wo(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Tn(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function hm(e,n){let t=wa(e,Fn(n))?.ref;return t?.displayName||t?.entityId||(n.kind==="image"?"Picture":n.kind==="timeline"?"Timeline":"Chart")}function Ct(e,n,t){let i=ut(e,n.payload.id);if(i){Ii(e,t,i.id);return}let a=Ro(e,[n.payload.id,t],hm(e,n)),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var Td={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function Ed(e,n,t,i){let a=ue.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function Md(e,n,t){let i=e.elements.find(d=>d.payload.id===n);if(!i||i.kind!=="chart")return;let a=we("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=Ed(i.payload.frame,Td[t],r,s);let l=e.elements.findIndex(d=>d.payload.id===n);return e.elements.splice(l+1,0,a),Ct(e,i,a.payload.id),a.payload.id}var Rd={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},jl=6,mm={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function fm(e,n){let t=(i,a)=>i!==void 0&&i!==a?i:void 0;return n==="highest"?t(e.payload.highColorHex,qe)??"#FFD60A":n==="lowest"?t(e.payload.lowColorHex,Ye)??"#FF453A":"#FFFFFF"}function ko(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function Pe(e,n){return e.elements.filter(t=>t.payload.chartAnchor?.layer===n)}function $o(e,n,t,i="above"){let a=e.elements.find(s=>s.payload.id===n);if(!a||a.kind!=="chart")return;t==="now"&&ko(a.payload);let r=we("icon");r.payload.symbol=I(Rd[t]),r.payload.size=jl,r.payload.colorSlot={baseColorHex:fm(a,t)},r.payload.frame=gm(jl),r.payload.chartAnchor={layer:n,at:t,place:i};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),Ct(e,a,r.payload.id),r.payload.id}function Fd(e,n){let t=e.elements.findIndex(u=>u.payload.id===n),i=e.elements[t];if(!i||i.kind!=="text"||i.payload.chartAnchor===void 0)return;let a=i.payload,r=a.chartAnchor,o=u=>{let p=vn(u);return p===void 0?void 0:mm[p.trim()]},s=new Set(_i.icon),l=u=>u.flatMap(p=>{if(p.kind==="setText"){let m=p.value===void 0?void 0:o(p.value);return m===void 0?[]:[{kind:"setIcon",value:I(m)}]}return s.has(Le[p.kind])?[p]:[]}),d=a.rules.filter(u=>u.partId===void 0).map(u=>({...u,cases:u.cases.map(p=>({...p,then:l(p.then)})),...u.otherwise!==void 0?{otherwise:l(u.otherwise)}:{}})),c=we("icon");c.payload={...c.payload,id:a.id,colorSlot:a.colorSlot,rules:d,frame:a.frame,isHidden:a.isHidden,...a.groupId!==void 0?{groupId:a.groupId}:{},chartAnchor:r,symbol:I(o(a.value)??Rd[r.at]),size:a.fontSize},e.elements[t]=c}function gm(e){let n=ue.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/n.width),height:Math.min(1,e*1.3/n.height),rotationDegrees:0}}function va(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;t==="now"&&ko(a);let r=we("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:t==="now"?a.nowColorHex:a.thresholdColorHex},r.payload.frame=Ad(a.frame,t),r.payload.chartAnchor={layer:n,at:t,place:"through"};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),Ct(e,i,r.payload.id),t==="now"?a.drawsNowLine=!1:a.drawsThreshold=!1,r.payload.id}function Ad(e,n){let t=ue.rectangular,i=3;return n==="now"?{...e,width:Math.min(e.width,i/t.width),rotationDegrees:0}:{...e,height:Math.min(e.height,i/t.height),rotationDegrees:0}}function Yt(e,n){return e.elements.filter(t=>t.kind==="chartTimes"&&t.payload.chart===n)}function En(e,n){let t=e.elements.find(o=>o.payload.id===n);if(!t||t.kind!=="chart"&&t.kind!=="timeline")return;let i=t.payload,a=we("chartTimes");a.payload.chart=n,a.payload.timeLabelCount=i.timeLabelCount>0?lt(i.timeLabelCount):bd,a.payload.labelSize=i.labelSize,a.payload.labelColorHex=i.labelColorHex,a.payload.hourCycle=i.hourCycle,a.payload.minutes=i.minutes,a.payload.frame=vm(i.frame,i.labelSize,i.labelsAbove);let r=e.elements.findIndex(o=>o.payload.id===n);return e.elements.splice(r+1,0,a),Ct(e,t,a.payload.id),i.drawsTimeLabels=!1,a.payload.id}function Co(e,n){return e.elements.filter(t=>t.kind==="imageTime"&&t.payload.image===n)}function ym(e){let n=Math.min(40,Math.max(4,e));return{w:8*n*.578+n*.89,h:n*1.25}}function Hd(e,n){return Math.max(0,Math.min(e/(8*.578+.89),n/1.25))}function So(e,n,t=ue.rectangular){let i=e.elements.find(g=>g.payload.id===n);if(!i||i.kind!=="image")return;let a=i.payload,r=we("imageTime");r.payload.image=n;let o=ym(a.timestampSize),s=a.frame.x*t.width,l=a.frame.y*t.height,d=a.frame.width*t.width,c=a.frame.height*t.height,u,p;if(Ia(a)){let g=(x,k,C,$)=>$>=C?k+(C-$)/2:Math.min(k+C-$,Math.max(k,x-$/2));u=g(s+a.timestampX*d,s,d,o.w),p=g(l+a.timestampY*c,l,c,o.h)}else u=a.timestampCorner.endsWith("Leading")?s+4:s+d-4-o.w,p=a.timestampCorner.startsWith("top")?l+4:l+c-4-o.h;let m=g=>Math.round(g*1e3)/1e3;r.payload.frame={x:m(u/t.width),y:m(p/t.height),width:m(o.w/t.width),height:m(o.h/t.height),rotationDegrees:0};let y=e.elements.findIndex(g=>g.payload.id===n);return e.elements.splice(y+1,0,r),Ct(e,i,r.payload.id),delete a.timestamp,delete a.timestampX,delete a.timestampY,a.timestampCorner="topLeading",a.timestampSize=Ha,r.payload.id}function Mn(e,n){return e.elements.filter(t=>t.kind==="chartDots"&&t.payload.chart===n)}function Rn(e,n){return e.elements.filter(t=>t.kind==="chartGrid"&&t.payload.chart===n)}function Id(e,n){return Pe(e,n).filter(t=>t.payload.chartAnchor?.at==="zero")}function To(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=we("chartDots");i.payload.chart=n,i.payload.dots=t.payload.pointDots==="all"?"all":"auto",i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),Ct(e,t,i.payload.id),i.payload.id}function Eo(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=we("chartGrid");i.payload.chart=n,i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a,0,i),Ct(e,t,i.payload.id),i.payload.id}var bm="#FFFFFF66";function Mo(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=we("shape");i.payload.kind="line",i.payload.thickness=1,i.payload.borderWidth=0,i.payload.colorSlot={baseColorHex:bm},i.payload.frame=Ad(t.payload.frame,"threshold"),i.payload.chartAnchor={layer:n,at:"zero",place:"through"};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),Ct(e,t,i.payload.id),i.payload.id}function Ld(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(t===void 0){delete a.thresholdValue,delete a.drawsThreshold;for(let r of Pe(e,n))r.payload.chartAnchor?.at==="threshold"&&fe(e,r.payload.id);return}a.thresholdValue=t,a.drawsThreshold=!1,Pe(e,n).some(r=>r.payload.chartAnchor?.at==="threshold")||va(e,n,"threshold")}function _d(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(!t){delete a.nowIndex,delete a.drawsNowLine;for(let r of Pe(e,n))r.payload.chartAnchor?.at==="now"&&fe(e,r.payload.id);return}ko(a),a.drawsNowLine=!1,Pe(e,n).some(r=>r.payload.chartAnchor?.at==="now")||va(e,n,"now")}function zd(e){let n=e.elements.filter(t=>t.kind==="chart"||t.kind==="timeline"||t.kind==="image");for(let t of n){let i=t.payload,a=new Set(e.elements.map(l=>l.payload.id)),r=ae.find(l=>e.perFamily[l]?.placements[i.id]!==void 0),o=i.frame,s=r===void 0?void 0:e.perFamily[r].placements[i.id];if(s&&(i.frame={...s.frame}),t.kind==="chart"&&xm(e,t.payload),t.kind==="timeline"&&t.payload.drawsTimeLabels!==!1&&t.payload.timeLabelCount>0&&En(e,i.id),t.kind==="image"&&t.payload.timestamp===!0&&So(e,i.id,ue[r===void 0||r==="inline"?"rectangular":r]),i.frame=o,!(r===void 0||s===void 0))for(let l of e.elements)a.has(l.payload.id)||(e.perFamily[r].placements[l.payload.id]={frame:{...l.payload.frame},isHidden:s.isHidden},l.payload.isHidden=!0)}}function xm(e,n){{if(n.highlight!==void 0&&n.highlight!=="none"){let a=$i(n),r=[];(n.highlight==="highest"||n.highlight==="both")&&r.push(["highest",a.high]),(n.highlight==="lowest"||n.highlight==="both")&&r.push(["lowest",a.low]);for(let[o,s]of r){let l=$o(e,n.id,o),d=e.elements.find(c=>c.payload.id===l);d?.kind==="icon"&&s!=="none"&&(d.payload.symbol=I(s==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}jh(n,{high:"none",low:"none"}),n.highlight="none"}n.thresholdValue!==void 0&&n.drawsThreshold!==!1&&va(e,n.id,"threshold"),n.nowIndex!==void 0&&n.drawsNowLine!==!1&&va(e,n.id,"now"),n.drawsTimeLabels!==!1&&kn(n)&&n.timeLabelCount>0&&En(e,n.id);let t=Qr(n.pointDots);if(t!=="none"){let a=To(e,n.id),r=e.elements.find(o=>o.payload.id===a);if(r?.kind==="chartDots"){r.payload.dots=t;let o=st(n.pointDotSize);o!==void 0&&(r.payload.size=o),typeof n.pointDotColorHex=="string"&&(r.payload.colorHex=n.pointDotColorHex)}}let i=eo(n.gridLines);if(i>0){let a=Eo(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="chartGrid"&&(r.payload.lines=i,r.payload.colorHex=Lt(n.gridColorHex))}if(n.zeroLine===!0){let a=Mo(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:Lt(n.gridColorHex)})}delete n.pointDots,delete n.pointDotSize,delete n.pointDotColorHex,delete n.gridLines,delete n.gridColorHex,delete n.zeroLine}}function vm(e,n,t){let i=ue.rectangular,a=Math.max(Wt,Math.min(jt,n)),r=Math.min(1,a*1.2/i.height),o=Math.min(1,Math.max(0,e.width)),s=t?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-o,e.x)),y:Math.max(0,Math.min(1-r,s)),width:o,height:r,rotationDegrees:0}}function wm(e,n){for(let t of n){if(!P(t)||t.kind!=="chart"||!P(t.payload))continue;let i=t.payload,a=W(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=W(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let m=P(p)?p:{};return{fontSize:Y(m.fontSize,8),colorHex:W(m.colorHex,o),pillColorHex:typeof m.pillColorHex=="string"?m.pillColorHex:void 0}},l=[],d=ce(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=ce(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,m]of l){let y=Ed(r.payload.frame,Td[p],m.fontSize,p==="latest"?5:4),g=[];if(m.pillColorHex!==void 0){let k=we("shape");k.payload.kind="capsule",k.payload.colorSlot={baseColorHex:m.pillColorHex},k.payload.frame={...y},g.push(k)}let x=we("text");x.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},x.payload.fontSize=m.fontSize,x.payload.fontWeight="medium",x.payload.colorSlot={baseColorHex:m.colorHex},x.payload.frame=y,g.push(x),e.elements.splice(u,0,...g),u+=g.length;for(let k of g)Ct(e,r,k.payload.id)}}}function q(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function zt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function km(e){let n={};return e.decimals!==void 0&&(n.decimals=q(e.decimals)),e.multiply!==void 0&&(n.multiply=q(e.multiply)),e.offset!==void 0&&(n.offset=q(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function $m(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(zt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Cm(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...zt(e)};case"entityAttribute":return{kind:"entityAttribute",...zt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...zt(e)};case"aggregate":return{kind:"aggregate",aggregate:$m(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function le(e){let n={kind:Cm(e.kind)};return Ae(e.format)||(n.format=km(e.format)),n}function vt(e){return{x:q(e.x),y:q(e.y),width:q(e.width),height:q(e.height),rotationDegrees:q(e.rotationDegrees)}}function Sm(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=le(e.value??I(""));break;case"between":case"timeBetween":n.value=le(e.value??I("")),n.upper=le(e.upper??I(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function ql(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=le(e.value??I(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=q(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;default:break}return n}function wt(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:le(a.value),comparison:Sm(a.comparison)}))},then:i.then.map(ql)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(ql)),n.partId!==void 0&&(t.partId=n.partId),t})}function Tm(e){let n={id:e.id,value:le(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=q(e.fontSize)),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(t=>({id:t.id,upTo:q(t.upTo),colorHex:t.colorHex}))),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==oe&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function Em(e){let n=Mm(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),n}function Mm(e){let n=t=>({id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden});switch(e.kind){case"text":{let t={...n(e.payload),value:le(e.payload.value),fontSize:q(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit===2&&(t.lineLimit=2),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(a=>({id:a.id,upTo:q(a.upTo),colorHex:a.colorHex}))),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==oe&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==qe&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==Ye&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(Tm),nt(i)&&(t.value=le(Mi(i.parts)))),ya(i,t),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:le(e.payload.symbol)};return e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path),t.size=q(e.payload.size),ya(e.payload,t),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:le(t.value),minValue:q(t.minValue),maxValue:q(t.maxValue),style:t.style,lineWidth:q(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,upTo:q(a.upTo),colorHex:a.colorHex}))),t.bandAboveColorHex!==oe&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=q(t.thresholdValue)),t.thresholdColorHex!==Xn&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=le(t.total)),t.minSource!==void 0&&(i.minSource=le(t.minSource)),t.maxSource!==void 0&&(i.maxSource=le(t.maxSource)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:le(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:q(t.minValue),maxValue:q(t.maxValue),baseline:t.baseline,barGap:q(t.barGap),lineWidth:q(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:dd($i(t)),coloring:t.coloring,bands:t.bands.map(c=>({id:c.id,upTo:q(c.upTo),colorHex:c.colorHex})),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==io&&(i.source=t.source),t.statPeriod!==Si&&(i.statPeriod=t.statPeriod),t.statType!==Ti&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=q(t.thresholdValue)),t.thresholdColorHex!==ro&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=le(t.nowIndex)),t.nowColorHex!==oo&&(i.nowColorHex=t.nowColorHex),t.drawsThreshold===!1&&(i.drawsThreshold=!1),t.drawsNowLine===!1&&(i.drawsNowLine=!1),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==Xe&&(i.labelSize=q(t.labelSize)),t.labelColorHex!==Je&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==pn&&(i.timeLabelCount=lt(t.timeLabelCount)),t.hourCycle!==hn&&(i.hourCycle=t.hourCycle),t.minutes!==mn&&(i.minutes=t.minutes);let a=$i(t);cd(a)||(i.highMarker=a.high,i.lowMarker=a.low);let r=t.curve??"straight";r!=="straight"&&(i.curve=r);let o=Nt(t.fillStyle);o!=="flat"&&(i.fillStyle=o),t.fillColorHex!==void 0&&(i.fillColorHex=t.fillColorHex);let s=Pt(t.barRadius);s!==Yn&&(i.barRadius=q(s));let l=Dt(t.barCorners);l!=="all"&&(i.barCorners=l);let d=tt(t.smoothing);return d!==void 0&&(i.smoothing=d),t.gaps===!0&&(i.gaps=!0),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden,value:le(t.value)};return t.historyMinutes!==yo&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),t.otherColorHex!==Kt&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=q(t.gap)),t.cornerRadius!==yd&&(i.cornerRadius=q(t.cornerRadius)),t.labelSize!==Xe&&(i.labelSize=q(t.labelSize)),t.labelColorHex!==Je&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==pn&&(i.timeLabelCount=Math.max(0,Math.min(Sn,Math.round(t.timeLabelCount)))),t.hourCycle!==hn&&(i.hourCycle=t.hourCycle),t.minutes!==mn&&(i.minutes=t.minutes),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:q(e.payload.cornerRadius),borderWidth:q(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=q(e.payload.thickness)),ya(e.payload,t),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:zt(t.entity),rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden};t.source!=="camera"&&(i.source=t.source),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=q(t.zoom)),t.panX!==0&&(i.panX=q(t.panX)),t.panY!==0&&(i.panY=q(t.panY)),t.cornerRadius!==Jn&&(i.cornerRadius=q(t.cornerRadius));let a=Ia(t),r=a?tm(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==Ha&&(i.timestampSize=q(t.timestampSize)),a&&(i.timestampX=q(t.timestampX),i.timestampY=q(t.timestampY)),ya(t,i),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:Nd(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=wt(t.rules),i.frame=vt(t.frame),i.isHidden=t.isHidden,{kind:"tap",payload:i}}case"chartTimes":{let t=e.payload,i={id:t.id,rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden,chart:t.chart};return t.labelSize!==Xe&&(i.labelSize=q(t.labelSize)),t.labelColorHex!==Je&&(i.labelColorHex=t.labelColorHex),t.timeLabelCount!==pn&&(i.timeLabelCount=lt(t.timeLabelCount)),t.hourCycle!==hn&&(i.hourCycle=t.hourCycle),t.minutes!==mn&&(i.minutes=t.minutes),{kind:"chartTimes",payload:i}}case"imageTime":{let t=e.payload,i={id:t.id,rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden};return t.image!==""&&(i.image=t.image),{kind:"imageTime",payload:i}}case"chartDots":{let t=e.payload,i={id:t.id,rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden,chart:t.chart};ka(t.dots)!=="auto"&&(i.dots="all");let a=st(t.size);return a!==void 0&&(i.size=q(a)),t.colorHex!==void 0&&(i.colorHex=t.colorHex),{kind:"chartDots",payload:i}}case"chartGrid":{let t=e.payload,i={id:t.id,rules:wt(t.rules),frame:vt(t.frame),isHidden:t.isHidden,chart:t.chart},a=yn(t.lines);a!==Vt&&(i.lines=a);let r=Lt(t.colorHex);rd(r,kt)||(i.colorHex=r);let o=bn(t.thickness);return o!==Ot&&(i.thickness=q(o)),{kind:"chartGrid",payload:i}}}}function Rm(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:vt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=q(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=le(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=le(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:le(i.value),minValue:q(i.minValue),maxValue:q(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=le(i.minLabel)),i.maxLabel&&(a.maxLabel=le(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=q(e.borderWidth),e.rules.length>0&&(n.rules=wt(e.rules)),n}function Nd(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,zt(e.target)),n}return"entityId"in e?{type:e.type,...zt(e)}:{type:e.type}}function Fm(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=le(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function Qn(e){let n=[];for(let i of ae){let a=e.perFamily[i];a&&n.push(i,Rm(a))}let t={schemaVersion:gn(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:le(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Em),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...zt(i)}),tapAction:Nd(e.tapAction)};return e.inline!==void 0&&(t.inline=Fm(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),t}function ut(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function St(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!ge(e,t))}function at(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function ei(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!ge(e,r)),t=e.elements.filter(r=>ge(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],Xt(e)}function Ro(e,n,t="Group"){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!ge(e,r));if(i.length<2)return;let a={id:X(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return at(e),ei(e),a.id}function Hi(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;at(e)}function Ii(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||ge(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,at(e),ei(e))}var ie={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","chartAnchor"],textPart:["id","value","colorHex","fontWeight","fontSize","coloring","bands","bandAboveColorHex"],icon:["symbol","path","size","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","barRadius","barCorners","smoothing","gaps","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","chartAnchor"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},Yl={literal:["kind","value"],entityState:["kind",...ie.entityRef],entityAttribute:["kind",...ie.entityRef,"attribute"],entityAge:["kind",...ie.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function _a(e){let n=[],t=(l,d,c)=>{if(P(l))for(let u of Object.keys(l))d.includes(u)||n.push(`${c}.${u}`)},i=(l,d)=>{if(!P(l))return;let c=typeof l.kind=="string"?l.kind:"";t(l,Yl[c]??["kind"],d),c==="aggregate"&&P(l.aggregate)&&(t(l.aggregate,ie.aggregate,`${d}.aggregate`),t(l.aggregate.scope,ie.scope,`${d}.aggregate.scope`),P(l.aggregate.scope)&&Array.isArray(l.aggregate.scope.entities)&&l.aggregate.scope.entities.forEach((u,p)=>t(u,ie.entityRef,`${d}.aggregate.scope.entities[${p}]`)),t(l.aggregate.stateFilter,ie.stateFilter,`${d}.aggregate.stateFilter`))},a=(l,d)=>{if(P(l)){if(P(l.kind))t(l,ie.value,d),i(l.kind,`${d}.kind`);else{let c=typeof l.kind=="string"?l.kind:"";t(l,[...Yl[c]??["kind"],"format"],d),c==="aggregate"&&i(l,d)}t(l.format,ie.format,`${d}.format`)}},r=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{t(c,ie.styleChange,`${d}[${u}]`),P(c)&&a(c.value,`${d}[${u}].value`)})},o=(l,d)=>{Array.isArray(l)&&l.forEach((c,u)=>{let p=`${d}[${u}]`;t(c,ie.rule,p),P(c)&&(Array.isArray(c.cases)&&c.cases.forEach((m,y)=>{let g=`${p}.cases[${y}]`;t(m,ie.case,g),P(m)&&(t(m.when,ie.condition,`${g}.when`),P(m.when)&&Array.isArray(m.when.tests)&&m.when.tests.forEach((x,k)=>{let C=`${g}.when.tests[${k}]`;t(x,ie.test,C),P(x)&&(a(x.value,`${C}.value`),t(x.comparison,ie.comparison,`${C}.comparison`),P(x.comparison)&&(a(x.comparison.value,`${C}.comparison.value`),a(x.comparison.upper,`${C}.comparison.upper`)))}),r(m.then,`${g}.then`))}),r(c.otherwise,`${p}.otherwise`))})};if(!P(e))return n;t(e,ie.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((l,d)=>t(l,ie.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((l,d)=>{t(l,ie.named,`$.values[${d}]`),P(l)&&a(l.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((l,d)=>{let c=`$.elements[${d}]`;if(t(l,ie.elementEnvelope,c),!P(l)||!P(l.payload))return;let u=typeof l.kind=="string"?l.kind:"",p=ie[u]??[];t(l.payload,[...ie.elementBase,...p],`${c}.payload`),t(l.payload.colorSlot,ie.colorSlot,`${c}.payload.colorSlot`),t(l.payload.frame,ie.frame,`${c}.payload.frame`),"chartAnchor"in l.payload&&t(l.payload.chartAnchor,ie.chartAnchor,`${c}.payload.chartAnchor`),o(l.payload.rules,`${c}.payload.rules`);for(let m of["value","symbol","nowIndex","total","minSource","maxSource"])m in l.payload&&a(l.payload[m],`${c}.payload.${m}`);u==="text"&&Array.isArray(l.payload.parts)&&l.payload.parts.forEach((m,y)=>{t(m,ie.textPart,`${c}.payload.parts[${y}]`),P(m)&&a(m.value,`${c}.payload.parts[${y}].value`)}),u==="image"&&t(l.payload.entity,ie.entityRef,`${c}.payload.entity`),u==="tap"&&t(l.payload.action,ie.tapAction,`${c}.payload.action`)});let s=[];if(Array.isArray(e.perFamily))for(let l=0;l+1<e.perFamily.length;l+=2)s.push([String(e.perFamily[l]),e.perFamily[l+1]]);else P(e.perFamily)&&s.push(...Object.entries(e.perFamily));for(let[l,d]of s){let c=`$.perFamily.${l}`;if(t(d,ie.layout,c),!!P(d)){if(P(d.placements))for(let[u,p]of Object.entries(d.placements))t(p,ie.placement,`${c}.placements.${u}`),P(p)&&t(p.frame,ie.frame,`${c}.placements.${u}.frame`);if(a(d.bezelText,`${c}.bezelText`),a(d.curvedText,`${c}.curvedText`),P(d.bezelGauge)){let u=`${c}.bezelGauge`;t(d.bezelGauge,ie.bezelGauge,u),a(d.bezelGauge.value,`${u}.value`),a(d.bezelGauge.minLabel,`${u}.minLabel`),a(d.bezelGauge.maxLabel,`${u}.maxLabel`)}o(d.rules,`${c}.rules`)}}return P(e.inline)&&(t(e.inline,ie.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,ie.tapAction,"$.tapAction"),n}function X(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function Tt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function Pd(e,n,t=[...ae]){let i={};for(let r of ae)t.includes(r)&&(i[r]=Tt());let a={schemaVersion:4,id:X(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:wi.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:I("Text")}),a.schemaVersion=gn(a),a}function we(e){let n=t=>({id:X(),colorSlot:{baseColorHex:t},rules:[],frame:{...Ei},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:I("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:I("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:I("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:oe,thresholdColorHex:Xn}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:I("13,14,16,17,19,22,24,28,30"),historyMinutes:Ra,historyPoints:24,source:io,statPeriod:Si,statType:Ti,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:qe,lowColorHex:Ye,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:oe,fillBands:!1,thresholdColorHex:ro,nowColorHex:oo,timeLabelCount:pn,labelSize:Xe,labelColorHex:Je,labelsAbove:!1,hourCycle:hn,minutes:mn}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:I(""),historyMinutes:Jh,bands:[],otherColorHex:Yh,gap:0,cornerRadius:Xh,timeLabelCount:bd,labelSize:Xe,labelColorHex:Je,labelsAbove:!1,hourCycle:hn,minutes:mn}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Jn,timestampCorner:"topLeading",timestampSize:Ha}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",timeLabelCount:pn,labelSize:Xe,labelColorHex:Je,hourCycle:hn,minutes:mn}}}case"imageTime":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,image:""}}}case"chartDots":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",lines:Vt,colorHex:kt,thickness:Ot}}}}}function I(e){return{kind:{kind:"literal",value:e}}}function za(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}var Xl=["circular","corner"],Jl=Math.SQRT1_2;function Am(e){return e==="text"||e==="icon"?4:.5}function Fo(e,n,t,i){let a=structuredClone(e),r=ue[n],o=ue[t];if(n===t||!r||!o)return a;let s=Xl.includes(n),l=Xl.includes(t),d=s===l?1:l?Jl:1/Jl,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let u=a.frame,p=u.x+u.width/2,m=u.y+u.height/2;a.frame={...u,width:u.width*d,height:u.height*d,x:.5+(p-.5)*d-u.width*d/2,y:.5+(m-.5)*d-u.height*d/2}}return a.size!==void 0&&(a.size=Math.max(Am(i),Math.round(a.size*c*10)/10)),a}function Dd(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Fn(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}function Ci(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var Ao=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function wa(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=wo(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function Ho(e,n){return wa(e,Fn(n))?.ref}function Io(e,n){let t=Ho(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&Ao.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function Zl(e,n,t){if(La(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=ot(a),r=ot(r),o=ot(o),s=ot(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function Od(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function Vd(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=ot(i.x),l=ot(i.y),d=ot(i.x+i.width),c=ot(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=Od(o,u,ue[t])}function Bd(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=ue[t];return{width:r.width*o.width,height:r.height*o.height}}function Oe(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function ge(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function Lo(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function Xt(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=Od(o.payload.frame,l.frame,ue.rectangular));let d=l.outset,c=!La(d);s.payload.frame=Zl(o.payload.frame,d,ue.rectangular),s.payload.isHidden=o.payload.isHidden;let u=Im(e,a);for(let p of ae){let m=e.perFamily[p];if(!m)continue;let y=ue[p],g=m.placements[a];p!==u||!g?delete m.placements[s.payload.id]:c?m.placements[s.payload.id]={frame:Zl(g.frame,d,y),isHidden:g.isHidden}:m.placements[s.payload.id]={frame:{...g.frame},isHidden:g.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Na(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=Oe(e,n)[0];if(a)return a.payload;let r=we("tap"),o=r.payload;return o.attachedTo=n,o.outset={...xo},o.action=t??Io(e,i),e.elements.push(r),Xt(e),o}function Pa(e,n){let t=Oe(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of ae)for(let a of t)delete e.perFamily[i]?.placements[a]}}function fe(e,n){for(let a of Tn(e,n))fe(e,a.payload.id);for(let a of Yt(e,n))fe(e,a.payload.id);for(let a of Mn(e,n))fe(e,a.payload.id);for(let a of Rn(e,n))fe(e,a.payload.id);for(let a of Co(e,n))fe(e,a.payload.id);for(let a of Pe(e,n))delete a.payload.chartAnchor;let t=e.elements.find(a=>a.payload.id===n);Pa(e,n),e.elements=e.elements.filter(a=>a.payload.id!==n);let i=t?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!Pe(e,i.layer).some(a=>a.payload.chartAnchor?.at===i.at)){let a=e.elements.find(r=>r.payload.id===i.layer);a?.kind==="chart"&&(i.at==="threshold"?(delete a.payload.thresholdValue,delete a.payload.drawsThreshold):(delete a.payload.nowIndex,delete a.payload.drawsNowLine))}for(let a of e.elements)a.kind==="chart"&&a.payload.scaleFrom===n&&delete a.payload.scaleFrom;for(let a of ae)delete e.perFamily[a]?.placements[n];Xt(e),at(e)}function Gd(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=X(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of Oe(e,n)){let d=structuredClone(l);d.payload.id=X(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of ae){let d=e.perFamily[l];if(d)for(let[c,u]of s){let p=d.placements[c];p&&(d.placements[u]=structuredClone(p))}}return Xt(e),a}function Ud(e,n){let t=e.elements.findIndex(o=>o.payload.id===n),i=e.elements[t];if(!i||i.kind!=="chart")return;let a=X(),r=structuredClone(i);r.payload.id=a,r.payload.scaleFrom=n,e.elements.splice(t+1,0,r);for(let o of ae){let s=e.perFamily[o],l=s?.placements[n];s&&l&&(s.placements[a]=structuredClone(l))}return a}function ti(e,n,t){let i=new Set,a=d=>{i.add(d);for(let c of Oe(e,d))i.add(c.payload.id)};for(let d of n){a(d);for(let c of Tn(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of ae){let c=e.perFamily[d];if(!c)continue;let u={};for(let p of r){let m=c.placements[p.payload.id];m&&(u[p.payload.id]=structuredClone(m))}Object.keys(u).length>0&&(o[d]=u)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function Kd(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&ae.includes(i);if(!ae.includes(t))return fn(e,n);let r=fn(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=Tt());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let d=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??ae.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),c=d?.size??za(l),u={frame:{...d?.frame??l.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};for(let p of ae)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?Fo(u,i,t,l.kind):u}return ni(e,t),r}function fn(e,n,t={}){let i=new Map;for(let d of n.elements)i.set(d.payload.id,X());let a=new Set(e.elements.map(d=>d.payload.id)),r=t.nudge!==!1&&n.elements.some(d=>a.has(d.payload.id)),o=d=>r?{...d,x:Math.min(.9,d.x+.05),y:Math.min(.9,d.y+.05)}:d,s=[];for(let d of n.elements){let c=structuredClone(d);if(c.payload.id=i.get(d.payload.id),c.kind==="tap"&&c.payload.attachedTo!==void 0){let u=i.get(c.payload.attachedTo);u?c.payload.attachedTo=u:delete c.payload.attachedTo}if(c.kind==="chart"&&c.payload.scaleFrom!==void 0){let u=i.get(c.payload.scaleFrom);u?c.payload.scaleFrom=u:a.has(c.payload.scaleFrom)||delete c.payload.scaleFrom}if(c.kind==="text")for(let u of c.payload.parts??[]){let p=u.value.kind,m=p.kind==="chartStat"?i.get(p.layer):void 0;p.kind==="chartStat"&&m&&(p.layer=m)}if(c.kind==="text"&&c.payload.value.kind.kind==="chartStat"){let u=i.get(c.payload.value.kind.layer);if(u)c.payload.value.kind.layer=u;else if(!a.has(c.payload.value.kind.layer))continue}if(c.kind==="chartTimes"||c.kind==="chartDots"||c.kind==="chartGrid"){let u=i.get(c.payload.chart);if(u)c.payload.chart=u;else if(!a.has(c.payload.chart))continue}if(c.kind==="imageTime"){let u=i.get(c.payload.image);if(u)c.payload.image=u;else if(!a.has(c.payload.image))continue}if(c.payload.chartAnchor!==void 0){let u=i.get(c.payload.chartAnchor.layer);u?c.payload.chartAnchor.layer=u:a.has(c.payload.chartAnchor.layer)||delete c.payload.chartAnchor}c.payload.frame=o(c.payload.frame),s.push(c)}let l=new Map;for(let d of n.groups){if(s.filter(p=>p.payload.groupId===d.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let u=X();l.set(d.id,u),(e.groups??=[]).push({...structuredClone(d),id:u})}for(let d of s){if(d.payload.groupId===void 0)continue;let c=l.get(d.payload.groupId);c?d.payload.groupId=c:delete d.payload.groupId}e.elements.push(...s);for(let d of ae){let c=n.placements[d],u=e.perFamily[d];if(!(!c||!u))for(let[p,m]of Object.entries(c)){let y=i.get(p);y&&s.some(g=>g.payload.id===y)&&(u.placements[y]={...structuredClone(m),frame:o(m.frame)})}}return Xt(e),at(e),ei(e),s.filter(d=>!ge(e,d)).map(d=>d.payload.id)}function Hm(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function Im(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return ae.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function pt(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function Wd(e,n){let t=e.perFamily[n];return t?pt(e,n).filter(i=>!ge(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function ni(e,n){let t=ae.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=Tt());let a=()=>e.elements.filter(s=>!ge(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(m=>Hm(e,m,p))]));for(let[p,m]of s)m[0]&&r.set(p,m[0]);let l=new Map([...a().entries()].map(([p,m])=>[m.payload.id,p]));for(let p of t){let m=a().filter(x=>(s.get(x.payload.id)??[]).includes(p)&&r.get(x.payload.id)!==p).map(x=>x.payload.id);if(m.length===0)continue;let y=ti(e,m,p),g=fn(e,y,{nudge:!1});g.forEach((x,k)=>{r.set(x,p);let C=g.length===m.length?m[k]:void 0;l.set(x,C!==void 0?l.get(C)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let d=p=>t.indexOf(r.get(p)??i),c=a().sort((p,m)=>d(p.payload.id)-d(m.payload.id)||(l.get(p.payload.id)??0)-(l.get(m.payload.id)??0)),u=[];for(let p of c)u.push(p),u.push(...Oe(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,d=t.filter(m=>e.perFamily[m].placements[l]!==void 0),c=r.get(l)??d.find(m=>!e.perFamily[m].placements[l].isHidden)??d[0]??i,u=e.perFamily[c]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let m of ae){let y=e.perFamily[m];y&&(m===c?y.placements[l]=p:delete y.placements[l])}}}function Da(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=wa(e,Fn(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of Oe(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=wa(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function Zr(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function jd(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=Zr(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=bo(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=Zr(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=Zr(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of Oe(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var Lm={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp"};function Ql(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function ed(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":Lm[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="textPart"?`Part of ${t}`:`${Ql(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=Ql(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline"}}var qd=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g;function _m(e){let n=[];for(let t of e.matchAll(qd))t[2]!==void 0&&n.push(t[2]);return n}function _o(e,n){return n.size===0?e:e.replace(qd,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function vi(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function zm(e,n){if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=Fn(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function Oa(e,n){let t=(r,o)=>{n.value?.(r,o);let s=r.kind;if(s.kind==="jinja"){if(n.text){let d=n.text(s.value,{...o,part:"template"});d!==s.value&&(s.value=d)}return}if(s.kind==="aggregate"){let d=s.aggregate.scope;if(n.ref&&d.kind==="entities")for(let c=0;c<d.entities.length;c++){let u=n.ref(vi(d.entities[c]),o);u&&(d.entities[c]=u)}return}if(!n.ref||!("entityId"in s))return;let l=n.ref(vi(s),o);l&&(s.kind==="entityAttribute"?r.kind={kind:"entityAttribute",...l,attribute:s.attribute}:s.kind==="entityState"?r.kind={kind:"entityState",...l}:r.kind={kind:"entityAge",...l})},i=(r,o,s)=>{if(r.type==="callService"){if(n.ref&&r.target!==void 0&&r.target.entityId!==""){let d=n.ref(vi(r.target),o);d&&(r.target=d)}if(n.text&&r.serviceDataJSON!==void 0){let d=n.text(r.serviceDataJSON,{...o,part:"serviceData"});d!==r.serviceDataJSON&&(r.serviceDataJSON=d)}return}if(!n.ref||!("entityId"in r)||r.entityId==="")return;let l=n.ref(vi(r),o);l&&s({type:r.type,...l})};for(let r of e.values)t(r.value,{kind:"named",valueId:r.id,valueName:r.name});for(let r of e.elements){let o={kind:"layer",layerId:r.payload.id,layerKind:r.kind,layerName:zm(e,r)};if(r.kind==="image"){if(n.ref){let l=n.ref(vi(r.payload.entity),{...o,kind:"image"});l&&(r.payload.entity=l)}}else if(r.kind==="tap"){let l=r.payload;i(l.action,{...o,kind:"tap"},d=>{l.action=d})}else{let l=Fn(r);if(l&&t(l,o),r.kind==="text")for(let d of r.payload.parts??[])t(d.value,{...o,part:"textPart"});r.kind==="gauge"&&r.payload.total&&t(r.payload.total,{...o,part:"total"}),r.kind==="gauge"&&r.payload.minSource&&t(r.payload.minSource,{...o,part:"gaugeMin"}),r.kind==="gauge"&&r.payload.maxSource&&t(r.payload.maxSource,{...o,part:"gaugeMax"}),r.kind==="chart"&&r.payload.nowIndex&&t(r.payload.nowIndex,{...o,part:"nowIndex"})}let s={...o,kind:"rule"};for(let l of Ci(r.payload.rules))t(l,s)}let a=Object.keys(e.perFamily).sort((r,o)=>{let s=wi.indexOf(r),l=wi.indexOf(o);return(s<0?wi.length:s)-(l<0?wi.length:l)});for(let r of a){let o=e.perFamily[r];if(!o)continue;let s={kind:"layout",family:r};o.bezelText&&t(o.bezelText,{...s,part:"bezelText"}),o.curvedText&&t(o.curvedText,{...s,part:"curvedText"});let l=o.bezelGauge;l&&(t(l.value,{...s,part:"bezelGauge"}),l.minLabel&&t(l.minLabel,{...s,part:"bezelGaugeMin"}),l.maxLabel&&t(l.maxLabel,{...s,part:"bezelGaugeMax"}));let d={kind:"rule",family:r};for(let c of Ci(o.rules))t(c,d)}e.inline&&t(e.inline.value,{kind:"inline"}),i(e.tapAction,{kind:"documentTap"},r=>{e.tapAction=r})}function Va(e,n){Oa(e,{value:n})}function Yd(e,n){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===n.toUpperCase()}function Li(e,n){let t=new Set;return Va(e,(i,a)=>{Yd(i,n)&&t.add(a.layerId??`${a.kind}:${a.valueId??""}:${a.family??""}:${a.part??""}`)}),t.size}function Nm(e,n){let t=new Set(e.values.map(a=>a.name.trim().toLowerCase())),i=n.trim()||"Value";if(!t.has(i.toLowerCase()))return i;for(let a=2;;a++){let r=`${i} ${a}`;if(!t.has(r.toLowerCase()))return r}}function zo(e,n,t){let i={id:X(),name:Nm(e,t),value:{kind:structuredClone(n.kind)}},a={kind:{kind:"named",id:i.id}};return n.format&&!Ae(n.format)&&(a.format=structuredClone(n.format)),{named:i,ref:a}}function No(e,n){if(n.kind.kind!=="named")return;let t=n.kind.id,i=e.values.find(o=>o.id.toUpperCase()===t.toUpperCase());if(!i)return;let a=n.format&&!Ae(n.format)?n.format:i.value.format,r={kind:structuredClone(i.value.kind)};return a&&!Ae(a)&&(r.format=structuredClone(a)),r}function Po(e,n){Va(e,t=>{if(!Yd(t,n))return;let i=No(e,t);i&&(t.kind=i.kind,i.format?t.format=i.format:delete t.format)}),e.values=e.values.filter(t=>t.id.toUpperCase()!==n.toUpperCase())}function Do(e,n){Oa(e,{ref:n})}function Oo(e,n){Oa(e,{text:n})}function Vo(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:ed(r)})}};return n&&(i.text=(a,r)=>{for(let o of _m(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:ed(r)})}return a}),Oa(e,i),t}var _i={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Xd=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function An(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function Hn(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Ba(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function Bo(){return{id:X(),value:I(""),comparison:{kind:"isOn"}}}function Go(){return{id:X(),when:{join:"all",tests:[Bo()]},then:[]}}function zi(){return{id:X(),cases:[Go()]}}function td(e,n){return e&&(e.kind.kind!=="literal"||An(e.kind.value)!==void 0)?e:I(n)}function Uo(e,n){let t={kind:n};switch(Hn(n)){case"value":t.value=e.value??I("");break;case"between":t.value=e.value??I(""),t.upper=e.upper??I("");break;case"times":t.value=td(e.value,"22:00"),t.upper=td(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function In(e){let n={kind:e};switch(Ba(e)){case"value":n.value=I(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"none":break}return n}var Ga="shared:";function Ko(e){return Ga+e.toUpperCase()}function Zd(e){return e.values.filter(n=>n.value.kind.kind!=="entityState"&&Li(e,n.id)>0)}function Qd(e,n){return n.size===0?e:e.map(t=>{let i=n.get(Ko(t.id));if(i===void 0)return t;let a={kind:{kind:"literal",value:i}};return t.value.format&&(a.format=t.value.format),{...t,value:a}})}var Pm=["unavailable","unknown"],Dm={automation:["on","off"],script:["on","off"],remote:["on","off"],update:["on","off"],timer:["idle","active","paused"],sun:["above_horizon","below_horizon"],valve:["open","closed","opening","closing"],lawn_mower:["mowing","docked","paused","returning","error"],weather:["sunny","clear-night","partlycloudy","cloudy","rainy","pouring","snowy","snowy-rainy","fog","windy","windy-variant","lightning","lightning-rainy","hail","exceptional"]},Om=new Set(["\xB0C","\xB0F"]);function Jd(e){return Array.isArray(e)&&e.length>0&&e.every(n=>typeof n=="string")?e:void 0}function Ni(e){let n=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):NaN;return Number.isFinite(n)?n:void 0}function Vm(e){let n=e?.trim().match(/\.(\d+)$/)?.[1]?.length??0;return n===0?1:10**-Math.min(n,4)}function Bm(e){let n=10**Math.floor(Math.log10(e));return([1,2,2.5,5,10].find(i=>i*n>=e)??10)*n}function Gm(e){let n=new Set,t=[];for(let i of e)i===void 0||i===""||n.has(i)||(n.add(i),t.push(i));return t}function ec(e,n,t){let i=e.split(".")[0]??"",a=n?.attributes??{},o=Jd(a.options)??(i==="climate"?Jd(a.hvac_modes):void 0)??Ai[i]??Dm[i];if(o)return{kind:"choice",options:Gm([...o,n?.state,t,...Pm])};let s=Ni(n?.state),l=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0;if(s===void 0&&l===void 0&&i!=="input_number"&&i!=="number")return{kind:"text"};let d=Ni(t),c=Ni(a.min),u=Ni(a.max),p=Ni(a.step),m,y;if(c!==void 0&&u!==void 0&&u>c)m=c,y=u;else if(l==="%")m=0,y=100;else{let x=Bm(Math.max(Math.abs(s??0)*2,10));m=(s??0)<0||l!==void 0&&Om.has(l)?-x:0,y=x}d!==void 0&&(m=Math.min(m,d),y=Math.max(y,d));let g=p!==void 0&&p>0?p:Vm(n?.state);return{kind:"number",min:m,max:y,step:g}}function tc(e){if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Um(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function nc(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1};case"sent":return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1}:{label:"On watch",note:`last seen ${Um(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function ac(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function rc(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function ic(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Wo(e,n,t=0){let i=n instanceof Map?n:rc(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Wo(o,i,t+1):ic(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!ic(a))return;let r=Pi(a);if(r!==void 0)return"e_"+ac(r)}function rt(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Km(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>rt(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(u=>`(states.${u} | list)`).join(" + ")+")";else{let u=[];for(let p of s)u.push(`area_entities(${rt(p)})`);for(let p of l)u.push(`label_entities(${rt(p)})`);d.length>0&&u.push(`((${d.map(p=>`floor_areas(${rt(p)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${u.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(rt).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${rt(i.value)})`:t+=` | rejectattr('state', 'eq', ${rt(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${rt(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function Pi(e){switch(e.kind){case"entityAttribute":return`state_attr(${rt(e.entityId)}, ${rt(e.attribute)})`;case"entityAge":{let n=rt(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Km(e.aggregate);default:return}}function Ua(e){let n=new Map,t=new Map,i=rc(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=Pi(d.kind);if(c===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=Pi(l);if(d===void 0)return;t.set("e_"+ac(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=Fn(o);if(s&&a(s),o.kind==="text")for(let l of o.payload.parts??[])a(l.value);o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="gauge"&&o.payload.minSource&&a(o.payload.minSource),o.kind==="gauge"&&o.payload.maxSource&&a(o.payload.maxSource),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of Ci(o.payload.rules))a(l)}for(let o of ae){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Ci(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=Wm(t)),r}function Wm(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function oc(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,jm(r));return{values:t,nullKeys:i}}function jm(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function jo(e){let n=Ua(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function qm(e,n){let t=e.holes.length===0?e.values:e.values.filter((i,a)=>!e.holes[a]);if(t.length!==0)switch(n){case"latest":return t[t.length-1];case"highest":return Math.max(...t);case"lowest":return Math.min(...t);case"average":return t.reduce((i,a)=>i+a,0)/t.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return t[0];case"delta":return t[t.length-1]-t[0];case"sum":return t.reduce((i,a)=>i+a,0);case"trend":{let i=t[t.length-1]-t[0],a=Number(so(i,e.domainMax-e.domainMin));return a>0?1:a<0?-1:0}}}var Ym=10800;function Xm(e,n,t){let i=n==="always"||n==="auto"&&t<=Ym;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function Ka(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=Xm(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function Jm(e,n){return ct(e)===void 0?[]:Ka(it(e)*60,Fi(e.timeLabelCount),e.hourCycle,e.minutes,n)}function Zm(e,n){return kn(e)?Ka(Math.round(e.historyMinutes)*60,Fi(lt(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function Qm(e,n,t,i){return n===void 0&&i!==void 0?ct(i)===void 0?[]:Ka(it(i)*60,Fi(lt(e.timeLabelCount)),e.hourCycle,e.minutes,t):n===void 0||!kn(n)?[]:Ka(Math.round(n.historyMinutes)*60,Fi(lt(e.timeLabelCount)),e.hourCycle,e.minutes,t)}function Ln(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function Ve(e){let n=e.trim(),t=Ln(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Ln(i)}function ef(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function tf(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function nf(e){let n=e.trim(),t=Ln(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?Ln(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Ln(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function af(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function rf(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function of(e,n,t){if(Ae(n))return e;let i=n,a=e,r=Ln(e.trim()),o=i.duration?nf(e):void 0;if(o!==void 0)a=af(o);else if(i.relativeTime&&r!==void 0)a=tf(r);else{let s=Ve(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):ef(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=rf(a);break}return a}function ii(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function Qe(e,n=240){return uc(e,n).map(t=>t.value)}function Yo(e,n=240){let t=[];for(let s of e.split(",")){if(t.length>=n)break;if(s.trim()===""){t.push(void 0);continue}for(let l of Qe(s,n-t.length))t.push(l)}let i=t.find(s=>s!==void 0);if(i===void 0)return{values:[],holes:[]};let a=[],r=[],o=i;for(let s of t)s===void 0?(a.push(o),r.push(!0)):(o=s,a.push(s),r.push(!1));return{values:a,holes:cc(r)}}function cc(e){return e.some(n=>n)?e:[]}function uc(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let d=!r;s(),d&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function sc(e,n,t){let i=uc(e),a=i.map(g=>g.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?Gt({bands:t.bands??[]}):[],d=t.bandAboveColorHex??oe,c=t.highColorHex??qe,u=t.lowColorHex??Ye,p=[],m=(g,x)=>{if(g==="")return;let k=p.at(-1);k&&k.colorHex===x?k.text+=g:p.push({text:g,colorHex:x})},y=0;return i.forEach((g,x)=>{m(e.slice(y,g.start),n);let k=x===o?c:x===s?u:l.length>0?Ma(g.value,l,d):n,C=e[g.end-1]==="."?g.end-1:g.end;m(e.slice(g.start,C),k),y=C}),m(e.slice(y),n),p}function lc(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function sf(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function Oi(e,n=qt){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:lf(i.slice(a+1))})}return t}function lf(e){try{return decodeURIComponent(e)}catch{return e}}function df(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(d>s))continue;let c=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===c?u.end=d:i.push({start:s,end:d,colorHex:c})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function dc(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function cf(e,n,t){if(e===void 0)return 0;let i=Ve(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var ht=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.chartElements=new Map;this.timelineElements=new Map;this.imageElements=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let{values:t,holes:i}=this.chartSeries(n),a=lc(t,n),r={values:t,holes:i,domainMin:a.min,domainMax:a.max},o=this.chartEntity(n);return o&&(r.entity=o),r}chartSeries(n){let t=$n(n),i=Cn(n),a,r=t??i;r!==void 0?a=this.ctx.historySeries?.get(r)??"":a=this.resolve(n.value)??"";let{values:o,holes:s}=r!==void 0?Yo(a):{values:Qe(a),holes:[]},l=r===void 0?void 0:this.testedReading(n);if(l!==void 0&&(o=[...o.slice(0,-1),l],s.length>0&&(s=[...s.slice(0,-1),!1])),n.limit>0&&o.length>n.limit){let d=c=>n.takeFromEnd?c.slice(c.length-n.limit):c.slice(0,n.limit);o=d(o),s.length>0&&(s=d(s))}return s=cc(s),{values:Xo(o,tt(n.smoothing),s),holes:s}}testedReading(n){let t=this.chartEntity(n);if(!t||!this.ctx.testedEntities?.has(t.entityId))return;let i=this.ctx.entityStates.get(t.entityId)?.state;return i===void 0?void 0:Ve(i)}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=Ve(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind==="timeline"&&this.timelineElements.set(s.payload.id,s.payload),s.kind==="image"&&this.imageElements.set(s.payload.id,s.payload),!(s.kind!=="chart"||t.has(s.payload.id))&&(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let c=t.get(s);if(!c)return{min:0,max:1};let u=c.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):lc(a.get(s)?.values??[],c);return r.set(s,p),p};for(let s of i){let l=t.get(s),d=o(s,new Set([s])),c={values:a.get(s)?.values??[],holes:a.get(s)?.holes??[],domainMin:d.min,domainMax:d.max},u=this.chartEntity(l);u&&(c.entity=u),this.charts.set(s,c),this.chartElements.set(s,l)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Ae(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?qm(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?pd(r):so(r,a.domainMax-a.domainMin));break}default:{let a=Wo(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return of(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Ln(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}canCountDown(n){if(!n)return!1;let t=this.dereference(n);if(t?.kind.kind==="entityState"){let i=t.kind.entityId;if(i.startsWith("timer.")||this.ctx.entityStates.get(i)?.timerState!==void 0)return!0}return this.countdownEnd(n)!==void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?ii(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=Ve(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:Ve(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),c=d===void 0?void 0:Ve(d);if(a===void 0||l===void 0||c===void 0)return!1;let[u,p]=l<=c?[l,c]:[c,l];return a>=u&&a<=p}case"timeBetween":{let l=An(i),d=r(),c=this.resolve(t.upper),u=d===void 0?void 0:An(d),p=c===void 0?void 0:An(c);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(Le[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(d=>d.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=sc(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t){let i=n.payload,a=n.kind==="text"?i.rules.filter(p=>p.partId===void 0):i.rules,r=this.applyRules(a,t),o=r.get("visibility"),s=o?o.kind==="hide":i.isHidden,l=this.styleNumber(r,"rotation"),d=l===void 0?i.frame:{...i.frame,rotationDegrees:l},c=this.styleNumber(r,"opacity")??1,u={id:i.id,isHidden:s,frame:d,opacity:c};switch(i.chartAnchor!==void 0&&(u.chartAnchor=i.chartAnchor),n.kind){case"text":{let p=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,m=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,y=nt(n.payload)&&!r.has("text"),g={kind:"text",...u,text:y?"":this.styleText(r,"text")??m??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(r,"fontSize")??n.payload.fontSize,fontWeight:r.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:n.payload.lineLimit===2?2:1,alignment:n.payload.alignment??"center"};return p!==void 0&&(g.countdownEnd=p),y?(g.parts=this.resolveTextParts(n.payload.parts,i.rules,g,t),g.text=g.parts.map(x=>x.text).join(""),g):(sd(n.payload)&&(g.spans=sc(g.text,g.colorHex,n.payload)),g)}case"icon":{let p=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",m=this.styleText(r,"icon"),y=n.payload.symbol.kind.kind==="literal",g=m===void 0&&y&&n.payload.path!==""?n.payload.path:void 0,x=m??p;g===void 0&&x.startsWith("mdi:")&&(x="questionmark.circle");let k={kind:"icon",...u,symbol:x,size:this.styleNumber(r,"fontSize")??n.payload.size,colorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex};return g!==void 0&&(k.path=g),k}case"gauge":{let p=n.payload,m=this.styleText(r,"gaugeValue")??this.resolve(p.value),y=(_,H,J)=>_??(H?Ve(this.resolve(H)??""):void 0)??J,g=y(this.styleNumber(r,"gaugeMin"),p.minSource,p.minValue),x=y(this.styleNumber(r,"gaugeMax"),p.maxSource,p.maxValue),k=m===void 0?void 0:Ve(m),C=this.styleColor(r,"color")??p.colorSlot.baseColorHex;p.coloring==="bands"&&p.bands.length>0&&k!==void 0&&(C=Ma(k,Gt(p),p.bandAboveColorHex));let $=x-g;if(p.total){let _=Ve(this.resolve(p.total)??"");_!==void 0&&($=_)}let S=dc($,1,Ea),L={kind:"gauge",...u,fraction:cf(m,g,x),style:p.style,lineWidth:p.lineWidth,colorHex:C,trackColorHex:p.trackColorHex,thresholdColorHex:p.thresholdColorHex,dotCount:S,filledCount:dc(k??0,0,S)};if(p.thresholdValue!==void 0&&x!==g){let _=(p.thresholdValue-g)/(x-g);_>=0&&_<=1&&(L.thresholdFraction=_)}return L}case"chart":{let p=n.payload,m=this.charts.get(p.id)??this.chartReadings(p),y=m.values,g=m.holes,x={min:m.domainMin,max:m.domainMax},k=this.styleColor(r,"color")??p.colorSlot.baseColorHex,C=Gt(p),$=ud(p)?y.map(j=>Ma(j,C,p.bandAboveColorHex)):[],S=p.highlight==="highest"||p.highlight==="both",L=p.highlight==="lowest"||p.highlight==="both",_=$i(p),H={kind:"chart",...u,values:y,holes:g,style:p.style,domainMin:x.min,domainMax:x.max,baseline:p.baseline,barGap:p.barGap,lineWidth:p.lineWidth,colorHex:k,highColorHex:p.highColorHex,lowColorHex:p.lowColorHex,marker:p.marker,highMarker:S?_.high:"none",lowMarker:L?_.low:"none",pointColorHexes:$,fillBands:p.fillBands,curve:p.curve??"straight",smoothing:tt(p.smoothing)??"off",fillStyle:Nt(p.fillStyle),...p.fillColorHex!==void 0?{fillColorHex:p.fillColorHex}:{},barRadius:Pt(p.barRadius),barCorners:Dt(p.barCorners),thresholdColorHex:p.thresholdColorHex,drawsThreshold:p.drawsThreshold!==!1,nowColorHex:p.nowColorHex,drawsNowLine:p.drawsNowLine!==!1,labels:p.drawsTimeLabels===!1?[]:Zm(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove},J=g.length===0?y:y.filter((j,U)=>!g[U]);if(J.length>0){let j=z=>y.findIndex((b,v)=>b===z&&g[v]!==!0),U=S?j(Math.max(...J)):-1,ne=L?j(Math.min(...J)):-1;U>=0&&(H.highIndex=U),ne>=0&&ne!==U&&(H.lowIndex=ne)}let R=sf(p,x.min,x.max);R!==void 0&&(H.thresholdY=R);let A=this.chartNowIndex(p,y.length);return A!==void 0&&(H.nowIndex=A),H}case"timeline":{let p=n.payload,m=ct(p),y=m===void 0?"":this.ctx.historySeries?.get(m)??"",g=Oi(y,qt),x=df(g,it(p)*60,C=>xd(C,p.bands,p.otherColorHex));return{kind:"timeline",...u,runs:x,gap:p.gap,cornerRadius:p.cornerRadius,labels:p.drawsTimeLabels===!1?[]:Jm(p,this.nowMs()),labelSize:p.labelSize,labelColorHex:p.labelColorHex,labelsAbove:p.labelsAbove}}case"shape":{let p={kind:"shape",...u,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:this.styleColor(r,"color")??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(r,"borderWidth")??n.payload.borderWidth},m=this.styleColor(r,"borderColor")??n.payload.borderColorHex;return m!==void 0&&(p.borderColorHex=m),p}case"image":{let p={kind:"image",...u,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};Ia(n.payload)&&(p.timestampX=n.payload.timestampX,p.timestampY=n.payload.timestampY);let m=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return m!==void 0&&(p.url=m),p}case"tap":{let p={kind:"tap",...u,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(p.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(p.attachedTo=n.payload.attachedTo),p}case"chartTimes":{let p=n.payload;return{kind:"chartTimes",...u,labels:Qm(p,this.chartElements.get(p.chart),this.nowMs(),this.timelineElements.get(p.chart)),labelSize:p.labelSize,labelColorHex:p.labelColorHex}}case"imageTime":{let p=n.payload,m=this.imageElements.get(p.image),y={kind:"imageTime",...u,image:p.image,linked:m!==void 0},g=m===void 0?void 0:this.ctx.entityStates.get(m.entity.entityId)?.entityPicture;return g!==void 0&&(y.url=g),y}case"chartDots":{let p=n.payload,m=st(p.size),y={kind:"chartDots",...u,chart:p.chart,dots:ka(p.dots),diameter:0,indices:[]};return m!==void 0&&(y.size=m),p.colorHex!==void 0&&(y.colorHex=p.colorHex),y}case"chartGrid":{let p=n.payload;return{kind:"chartGrid",...u,chart:p.chart,lines:yn(p.lines),colorHex:Lt(p.colorHex),thickness:bn(p.thickness),draws:!1}}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=ue[t==="inline"?"rectangular":t],o=[...gf(ff(Dd(n,t).map(x=>this.resolveElement(x,i)),r),r)],s=a?this.applyRules(a.rules,i):new Map,l={family:t,elements:o,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(s,"borderWidth")??a?.borderWidth??2},d=this.styleText(s,"text"),c=a?.bezelCountdown&&d===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=d??u??this.resolve(a?.bezelText);p!==void 0&&(l.bezelText=p),c!==void 0&&(l.bezelCountdownEnd=c);let m=this.resolve(a?.curvedText);if(m!==void 0&&(l.curvedText=m),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let x=a.bezelGauge,k=this.resolve(x.value),C=k===void 0?void 0:Ve(k);if(C!==void 0){let $=Math.min(x.minValue,x.maxValue),S=Math.max(x.minValue,x.maxValue),L={value:Math.min(S,Math.max($,C)),minValue:$,maxValue:S===$?$+1:S,colorHexes:x.colorHexes},_=this.resolve(x.minLabel);_!==void 0&&(L.minLabel=_);let H=this.resolve(x.maxLabel);H!==void 0&&(L.maxLabel=H),l.bezelGauge=L}}let y=this.styleColor(s,"backgroundColor")??a?.backgroundColorHex;y!==void 0&&(l.backgroundColorHex=y);let g=this.styleColor(s,"borderColor")??a?.borderColorHex;return g!==void 0&&(l.borderColorHex=g),l}};function uf(e,n,t){let i=new ht(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Vi(e,n,t){let i=new ht(n),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=uf(e.inline,n,e)),a}function Wa(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var qo=5,pf=1.7,hf=1.8;function mf(e,n,t,i,a,r){return e==="bars"||t===0?!1:n==="all"||t===1?!0:Math.max(i-a*2,0)/(t-1)>=3*r}function ff(e,n){if(!e.some(r=>r.kind==="chartDots"||r.kind==="chartGrid"))return[...e];let t=new Map;for(let r of e)r.kind==="chart"&&t.set(r.id,r);let i=new Map,a=e.map(r=>{if(r.kind==="chartGrid"){let u=t.get(r.chart);return u===void 0?{...r,draws:!1}:{...r,frame:u.frame,draws:u.values.length>0}}if(r.kind!=="chartDots")return r;let o=t.get(r.chart);if(o===void 0)return{...r,diameter:0,indices:[]};let s=r.size??o.lineWidth*hf,l=Math.max(o.frame.width*n.width,0),d=mf(o.style,r.dots,o.values.length,l,o.lineWidth/2,s);d&&!r.isHidden&&i.set(o.id,Math.max(i.get(o.id)??0,s));let c=d?o.values.map((u,p)=>p).filter(u=>o.holes[u]!==!0&&u!==o.highIndex&&u!==o.lowIndex):[];return{...r,frame:o.frame,diameter:s,indices:c}});return i.size===0?a:a.map(r=>{if(r.kind!=="chart")return r;let o=i.get(r.id);return o===void 0?r:{...r,dotDiameter:o}})}function pc(e){if(e.domainMin<0&&e.domainMax>0)return(0-e.domainMin)/(e.domainMax-e.domainMin)}function hc(e,n){let t=Math.max(0,Math.min(4,Math.round(n))),i=e.plotBottom-e.plotTop;return Array.from({length:t},(a,r)=>e.plotTop+i*(r+1)/(t+1))}function ja(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0?e.highMarker:"none",r=e.lowIndex!==void 0?e.lowMarker:"none",o=n.x,s=Math.max(n.w,0),l=e.style==="bars"?0:e.lineWidth/2,d=e.dotDiameter!==void 0&&e.style!=="bars"?Math.max(l,e.dotDiameter/2):l,c=H=>H==="triangle"?qo+d:H==="dot"?Math.max(d,pf):d,u=c(a),p=c(r),m=n.y+u,y=Math.max(n.h-u-p,1),g=m+y,x=Math.max(e.domainMax-e.domainMin,Number.EPSILON),k=e.baseline==="lowest",C=k?y*.12:0,$=Math.min(Math.max(e.barGap,0),s/(i*2)),S=Math.max((s-$*(i-1))/i,.5),L=H=>Math.min(1,Math.max(0,(H-e.domainMin)/x)),_=H=>g-L(H)*y;return{count:t.length,barWidth:S,plotTop:m,plotBottom:g,plotLeft:o,plotRight:o+s,baselineY:k?g:_(0),inset:d,yAtFraction(H){return g-Math.min(Math.max(H,0),1)*y},barRect(H){let J=o+H*(S+$),R=t[H],A,j;if(k){let U=C+L(R)*(y-C);A=g-U,j=g}else A=_(R),j=k?g:_(0),A>j&&([A,j]=[j,A]);return{x:J,y:A,w:S,h:Math.max(j-A,.5)}},point(H){let J=Math.max(s-d*2,0);return{x:t.length>1?o+d+J*H/(t.length-1):o+s/2,y:_(t[H])}},markerCenter(H,J,R="high"){let A=J?this.barRect(H):void 0,j=A?A.x+A.w/2:this.point(H).x,U=R==="high"?a:r,ne=R==="high"?U==="triangle"?n.y+qo/2:m:U==="triangle"?n.y+n.h-qo/2:g;return{x:j,y:ne}}}}function mc(e,n){let t=e.length;if(t<2)return[];let i=[];if(n==="step"){for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1];i.push({kind:"step",start:s,corner:{x:l.x,y:s.y},end:l})}return i}if(n!=="smooth"){for(let o=0;o<t-1;o++)i.push({kind:"straight",start:e[o],end:e[o+1]});return i}let a=[];for(let o=0;o<t-1;o++){let s=e[o+1].x-e[o].x;a.push(s===0?0:(e[o+1].y-e[o].y)/s)}let r=new Array(t).fill(0);r[0]=a[0],r[t-1]=a[t-2];for(let o=1;o<t-1;o++)r[o]=a[o-1]*a[o]<=0?0:(a[o-1]+a[o])/2;for(let o=0;o<t-1;o++){if(a[o]===0){r[o]=0,r[o+1]=0;continue}let s=r[o]/a[o],l=r[o+1]/a[o],d=s*s+l*l;if(d>9){let c=3/Math.sqrt(d);r[o]=c*s*a[o],r[o+1]=c*l*a[o]}}for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1],d=l.x-s.x;i.push({kind:"smooth",start:s,c1:{x:s.x+d/3,y:s.y+r[o]*d/3},c2:{x:l.x-d/3,y:l.y-r[o+1]*d/3},end:l})}return i}function Xo(e,n,t=[]){let i=e.length,a=od(i,n);if(a===0)return e;let r=Math.floor(a/2),o=r/2,s=u=>t[u]===!0,l=e.map((u,p)=>{if(s(p))return u;let m=0,y=0;for(let g=Math.max(0,p-r);g<=Math.min(i-1,p+r);g++){if(s(g))continue;let x=g-p,k=Math.exp(-(x*x)/(2*o*o));m+=e[g]*k,y+=k}return m/y}),d=l.find((u,p)=>!s(p));if(d===void 0)return l;let c=d;return l.map((u,p)=>s(p)?c:(c=u,u))}function fc(e,n){let t=[],i=[];for(let a=0;a<e;a++)n[a]===!0?(i.length>0&&t.push(i),i=[]):i.push(a);return i.length>0&&t.push(i),t}var Di=1;function ai(e,n){let t=Math.max(Wt,Math.min(jt,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-Di>=2,r=a?{...n,y:e.labelsAbove?n.y+i+Di:n.y,h:n.h-i-Di,cy:(e.labelsAbove?n.y+i+Di:n.y)+(n.h-i-Di)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function gf(e,n){if(!e.some(i=>i.chartAnchor!==void 0))return e;let t=new Map;for(let i of e)i.kind==="chart"&&t.set(i.id,i);return t.size===0?e:e.map(i=>{let a=i.chartAnchor;if(a===void 0)return i;let r=t.get(a.layer);if(r===void 0)return i;if(a.at==="zero"&&pc(r)===void 0)return{...i,isHidden:!0};let o=bf(i.frame,a,r,n);return o===void 0?i:{...i,frame:o}})}function yf(e,n){let t=n.values;if(t.length===0)return;let i=t.map((a,r)=>r).filter(a=>n.holes.length===0||!n.holes[a]);if(i.length!==0)switch(e){case"highest":return i.reduce((a,r)=>t[r]>t[a]?r:a);case"lowest":return i.reduce((a,r)=>t[r]<t[a]?r:a);case"first":return i[0];case"latest":return i[i.length-1];case"now":return n.nowIndex===void 0?void 0:Math.min(Math.max(n.nowIndex,0),t.length-1);case"threshold":return;case"zero":return}}function bf(e,n,t,i){if(i.width<=0||i.height<=0)return;let a=Wa(t,i);if(a.w<=0||a.h<=0)return;let r=ai(t,a).body;if(r.w<=0||r.h<=0)return;let o=ja(t,r),s,l;if(dt(n.at)){let k=yf(n.at,t);if(k===void 0)return;if(t.style==="bars"){let C=o.barRect(k);s=C.x+C.w/2,l=C.y}else{let C=o.point(k);s=C.x,l=C.y}}else{let k=n.at==="zero"?pc(t):t.thresholdY;if(k===void 0)return;l=o.yAtFraction(k)}let d=Math.max(e.width,0)*i.width,c=Math.max(e.height,0)*i.height,u=.75,p=(k,C,$)=>C>$?(C+$)/2:Math.min(Math.max(k,C),$),m={...e};if(s!==void 0){let k=p(s+(n.dx??0),r.x+d/2,r.x+r.w-d/2);m.x=(k-d/2)/i.width}if(n.place==="through"){if(s!==void 0)m.y=o.plotTop/i.height,m.height=(o.plotBottom-o.plotTop)/i.height;else{m.x=o.plotLeft/i.width,m.width=(o.plotRight-o.plotLeft)/i.width;let k=p(l+(n.dy??0),r.y+c/2,r.y+r.h-c/2);m.y=(k-c/2)/i.height}return m}let y=n.place==="on"?l:n.place==="below"?l+u+c/2:n.place==="bottom"?o.plotBottom-u-c/2:l-u-c/2,g=p(y,r.y+c/2,r.y+r.h-c/2),x=p(g+(n.dy??0),c/2,i.height-c/2);return m.y=(x-c/2)/i.height,m}var He=ue,Bi=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:He,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],ri=Bi.find(e=>e.measured);function Sc(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Bi.find(a=>a.screen.width===t&&a.screen.height===i)}function Ya(e,n){let t=He[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var es={regular:400,medium:500,semibold:600,bold:700},xf=1.15;function Be(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function ye(e,n,t="#FFFFFF"){let i=Be(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}var Et=e=>e*.55;function Tc(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function vf(e,n){let t=e.split(/\s+/).filter(r=>r!=="");if(t.length<2)return[e];let i="",a=0;for(let r=0;r<t.length-1;r++){let o=i===""?t[r]:`${i} ${t[r]}`;if(i!==""&&o.length>n)break;i=o,a=r+1}return a===0&&(i=t[0],a=1),[i,t.slice(a).join(" ")]}function wf(e,n,t){if(t<=0||e.length*Et(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/Et(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function kf(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function Ec(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function Mc(e,n,t,i,a){let r=[],o=n,s=a,l=d=>d<t.length&&/\s/.test(t[d]);for(let d of e){let c=s;if(/\s/.test(d))for(l(o)&&(c=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(d,o)&&(c=i[o],o+=d.length)}s=c;let u=r.at(-1);u&&u.look===c?u.text+=d:r.push({text:d,look:c})}return r}function $f(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function Rc(e,n){return e.reduce((t,i)=>t+i.text.length*Et(i.look.fontSize*n),0)}function Cf(e,n,t){let i=[...e.matchAll(/\S+/g)];if(i.length<2)return[e];let a=l=>n[l]?.fontSize??0,r=0,o=0;for(let l=0;l<i.length-1;l++){let d=i[l].index??0,c=o===0?0:Et(a(d-1));for(let u=d;u<d+i[l][0].length;u++)c+=Et(a(u));if(o>0&&r+c>t)break;r+=c,o=l+1}let s=l=>l.map(d=>d[0]).join(" ");return[s(i.slice(0,o)),s(i.slice(o))]}function Sf(e,n,t){if(t<=0||Rc(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,d=t-.8*l,c="";for(let u of s.text){if(r>0&&a+u.length*Et(l)>d){c!==""&&i.push({text:c,look:s.look});break e}c+=u,a+=u.length*Et(l),r+=1}i.push({text:c,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function Tf(e,n,t){let i=$f(n),a=e.lineLimit===2&&t.w>0?Cf(e.text,i,t.w):[e.text],r=Ec(e.text,a),o=a.map((C,$)=>Mc(C,r[$]??0,e.text,i,i[0])),s=Math.max(...o.map(C=>Rc(C,1))),l=s>t.w&&t.w>0?Math.max(.5,t.w/s):1,d=o.map(C=>Sf(C,l,t.w)),{anchor:c,x:u}=Tc(e.alignment,t),p=Math.max(0,...d.flat().map(C=>C.look.fontSize))*l||e.fontSize*l,m=.35*p,y=p*1.15,g=C=>C.map($=>{let S=ye($.look.colorHex,"fill");return w`<tspan font-size=${$.look.fontSize*l} font-weight=${es[$.look.fontWeight]??400} fill=${S.fill} fill-opacity=${S["fill-opacity"]}>${$.text}</tspan>`}),x=ye(e.colorHex,"fill"),k=d.length>1?w`${d.map((C,$)=>w`<tspan x=${u} y=${t.cy+m+($-(d.length-1)/2)*y}>${g(C)}</tspan>`)}`:g(d[0]);return w`<text x=${u} y=${t.cy+m} text-anchor=${c}
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${e.fontSize*l} font-weight=${es[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${x.fill} fill-opacity=${x["fill-opacity"]}>${k}</text>`}function Ef(e,n){if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(g=>g.text).join("")===e.text)return e.text===""?f:Tf(e,e.parts,n);let t=ye(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:ii((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit===2&&n.w>0?vf(e.text,n.w/Et(e.fontSize)):[e.text],a=Math.max(...i.map(g=>g.length))*Et(e.fontSize),r=a>n.w&&n.w>0?Math.max(.5,n.w/a):1,o=e.fontSize*r,s=i.map(g=>wf(g,o,n.w)),{anchor:l,x:d}=Tc(e.alignment,n),c=kf(e.text,e.spans),u=c?Ec(e.text,i):[],p=(g,x)=>c?Mc(g,u[x]??0,e.text,c,e.colorHex).map(k=>{let C=ye(k.look,"fill");return w`<tspan fill=${C.fill} fill-opacity=${C["fill-opacity"]}>${k.text}</tspan>`}):g,m=o*1.15,y=s.length>1?w`${s.map((g,x)=>w`<tspan x=${d} y=${n.cy+(x-(s.length-1)/2)*m}>${p(g,x)}</tspan>`)}`:p(s[0],0);return w`<text x=${d} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${es[e.fontWeight]??400}
    style=${e.monospacedDigits?"font-variant-numeric: tabular-nums":f}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${y}</text>`}var Jo=2;function Mf(e,n){let t=ye(e.colorHex,"stroke"),i=ye(e.trackColorHex,"stroke","#FFFFFF"),a=ye(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let m=n.w>=n.h,y=Math.max(1,e.dotCount),g=m?n.w:n.h,x=m?n.h:n.w,k=Math.max(1,Math.min(x,g/y-Jo)),C=y*k+(y-1)*Jo,$=(m?n.cx:n.cy)-C/2+k/2;return w`${Array.from({length:y},(S,L)=>{let _=$+L*(k+Jo),H=L<e.filledCount?t:i;return w`<circle cx=${m?_:n.cx} cy=${m?n.cy:_} r=${k/2}
        fill=${H.stroke} fill-opacity=${H["stroke-opacity"]} />`})}`}if(e.style==="bar"){let m=n.w,y=Math.max(r,m*e.fraction),g=1;return w`
      <rect x=${n.x} y=${n.cy-r/2} width=${m} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${y} height=${r} rx=${r/2}
        fill=${t.stroke} fill-opacity=${t["stroke-opacity"]} />
      ${e.thresholdFraction===void 0?f:w`<rect x=${n.x+Math.min(m-g,Math.max(0,m*e.thresholdFraction-g/2))}
            y=${n.cy-r/2} width=${g} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=e.style==="ring"?1:.75,c=e.style==="ring"?-90:135,u=l*d,p=l*d*e.fraction;return w`
    <g transform="rotate(${c} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?w`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
            stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
            stroke-dasharray="${p} ${l}" />`:f}
      ${e.thresholdFraction===void 0?f:Rf(n,s,r,d*360*e.thresholdFraction,e.thresholdColorHex)}
    </g>`}function Rf(e,n,t,i,a){let r=ye(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=t/2+1;return w`<line x1=${e.cx+s*(n-d)} y1=${e.cy+l*(n-d)}
    x2=${e.cx+s*(n+d)} y2=${e.cy+l*(n+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}function Ff(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=ai(e,n),o=r?rs(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?f:w`${o}`;let s=Hf(e,a);return o===void 0?s:w`${s}${o}`}function Zo(e){switch(e.kind){case"smooth":return`C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.end.x} ${e.end.y}`;case"step":return`L${e.corner.x} ${e.corner.y} L${e.end.x} ${e.end.y}`;case"straight":return`L${e.end.x} ${e.end.y}`}}var gc=0;function Fc(){return gc+=1,gc.toString(36)}function Af(e,n,t){let{x:i,y:a,w:r,h:o}=e,s=Math.max(0,n);return s===0?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o} L${i} ${a+o} Z`:t?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o-s} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${i} ${a+o-s} Z`:`M${i} ${a+o} L${i} ${a+s} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${i+r} ${a+s} L${i+r} ${a+o} Z`}function Hf(e,n){let t=ja(e,n),i=Fc(),a=ye(e.colorHex,"fill"),r=ye(e.highColorHex,"fill",e.colorHex),o=ye(e.lowColorHex,"fill",e.colorHex),s=(y,g)=>w`<circle cx=${y.x} cy=${y.y} r="1.7" fill=${g.fill} fill-opacity=${g["fill-opacity"]} />`,l=[],d=new Map,c=e.pointColorHexes.length===t.count,u=y=>c?ye(e.pointColorHexes[y],"fill",e.colorHex):a,p=y=>{let g=Be(y)??Be(e.colorHex)??{color:"#FFFFFF",opacity:1};if(e.fillStyle!=="fade")return{fill:g.color,opacity:g.opacity*.28};let x=If(i,e.id,y),k=t.baselineY<=t.plotTop?t.plotBottom:t.plotTop;return d.has(x)||d.set(x,w`<linearGradient id=${x} gradientUnits="userSpaceOnUse" x1="0" y1=${k} x2="0" y2=${t.baselineY}>
        <stop offset="0" stop-color=${g.color} stop-opacity=${g.opacity*.28} />
        <stop offset="1" stop-color=${g.color} stop-opacity="0" /></linearGradient>`),{fill:`url(#${x})`,opacity:1}};if(e.style==="bars")for(let y=0;y<t.count;y++){if(e.holes[y]===!0)continue;let g=t.barRect(y),x=y===e.highIndex?r:y===e.lowIndex?o:u(y),k=Math.min(Math.max(e.barRadius,0),g.w/2,g.h/2);if(e.barCorners==="top"){let C=e.baseline==="zero"&&e.values[y]<0;l.push(w`<path d=${Af(g,k,C)}
          fill=${x.fill} fill-opacity=${x["fill-opacity"]} />`)}else l.push(w`<rect x=${g.x} y=${g.y} width=${g.w} height=${g.h} rx=${k}
          fill=${x.fill} fill-opacity=${x["fill-opacity"]} />`)}else{let y=Array.from({length:t.count},(C,$)=>t.point($)),g=e.holes.length>0,k=fc(t.count,e.holes).filter(C=>!g||C.length>1).map(C=>{let $=C.map(_=>y[_]),S=mc($,e.curve),L=`M${$[0].x} ${$[0].y}${S.map(_=>` ${Zo(_)}`).join("")}`;return{run:C,pts:$,legs:S,line:L}});if(e.style==="area")for(let{run:C,pts:$,legs:S,line:L}of k)if(e.fillBands&&c&&C.length>1&&e.fillColorHex===void 0)for(let _=0;_<S.length;_++){let H=$[_],J=$[_+1],R=p(e.pointColorHexes[C[_+1]]),A=`M${H.x} ${H.y} ${Zo(S[_])} L${J.x} ${t.baselineY} L${H.x} ${t.baselineY} Z`;l.push(w`<path d=${A} fill=${R.fill} fill-opacity=${R.opacity} stroke="none" />`)}else{let _=p(e.fillColorHex??e.colorHex),H=`${L} L${$[$.length-1].x} ${t.baselineY} L${$[0].x} ${t.baselineY} Z`;l.push(w`<path d=${H} fill=${_.fill} fill-opacity=${_.opacity} stroke="none" />`)}for(let{run:C,pts:$,legs:S,line:L}of k)if(c&&C.length>1)for(let _=0;_<S.length;_++){let H=$[_],J=u(C[_+1]);l.push(w`<path d=${`M${H.x} ${H.y} ${Zo(S[_])}`} fill="none"
            stroke=${J.fill} stroke-opacity=${J["fill-opacity"]}
            stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(w`<path d=${L} fill="none" stroke=${a.fill} stroke-opacity=${a["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(s(y[e.highIndex],r)),e.lowIndex!==void 0&&l.push(s(y[e.lowIndex],o))}let m=(y,g,x,k)=>{if(y===void 0||g==="none")return;let C=t.markerCenter(y,e.style==="bars",k);l.push(g==="triangle"?w`<path d=${`M${C.x} ${C.y-1.8} L${C.x+2.2} ${C.y+1.8} L${C.x-2.2} ${C.y+1.8} Z`}
          fill=${x.fill} fill-opacity=${x["fill-opacity"]} />`:s(C,x))};if(m(e.highIndex,e.highMarker,r,"high"),m(e.lowIndex,e.lowMarker,o,"low"),e.drawsThreshold&&e.thresholdY!==void 0){let y=t.yAtFraction(e.thresholdY),g=ye(e.thresholdColorHex,"fill",e.colorHex);l.push(w`<path d=${`M${t.plotLeft} ${y} L${t.plotRight} ${y}`} fill="none"
      stroke=${g.fill} stroke-opacity=${g["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.drawsNowLine&&e.nowIndex!==void 0&&e.nowIndex<t.count){let y=t.markerCenter(e.nowIndex,e.style==="bars").x,g=ye(e.nowColorHex,"fill",e.colorHex);l.push(w`<path d=${`M${y} ${t.plotTop} L${y} ${t.plotBottom}`} fill="none"
      stroke=${g.fill} stroke-opacity=${g["fill-opacity"]} stroke-width="1" />`)}return d.size===0?w`${l}`:w`<defs>${[...d.values()]}</defs>${l}`}function If(e,n,t){return`chartfade-${e}-${n}-${t}`.replace(/[^0-9A-Za-z_-]/g,"")}function rs(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=ye(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let d=s===e.labels.length-1?"end":s===0?"start":"middle",c=n.x+o.position*n.w;return w`<text x=${c} y=${a} text-anchor=${d} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function Lf(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=ai(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,d)=>{let c=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=d===e.runs.length-1,m=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),y=Math.max(0,Math.min(e.cornerRadius,m/2,a.h/2)),g=ye(l.colorHex,"fill");return w`<rect x=${c} y=${a.y} width=${m} height=${a.h} rx=${y}
      fill=${g.fill} fill-opacity=${g["fill-opacity"]} />`});return r?w`${s}${rs(e,n,t,i)}`:w`${s}`}function _f(e,n){if(e.labels.length===0||n.w<=0||n.h<=0)return f;let{labelSize:t,rowHeight:i}=ai({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),a={...n,y:n.cy-i/2,h:i};return w`${rs({labels:e.labels,labelColorHex:e.labelColorHex,labelsAbove:!1},a,t,i)}`}function Ac(e,n){if(!(e===void 0||n.w<=0||n.h<=0))return{chart:e,g:ja(e,ai(e,n).body)}}function zf(e,n,t,i=!1,a=0){let r=Ac(t,n);if(e.indices.length===0||r===void 0)return f;let o=r.chart,s=o.pointColorHexes.length===o.values.length,l=Math.max(e.diameter/2,a),d=new Map,c=l+1.2,u="";for(let m of e.indices){if(m>=o.values.length)continue;let y=r.g.point(m),g=e.colorHex??(s?o.pointColorHexes[m]:o.colorHex);d.set(g,`${d.get(g)??""}M${y.x-l} ${y.y} a${l} ${l} 0 1 0 ${2*l} 0 a${l} ${l} 0 1 0 ${-2*l} 0 Z`),i&&(u+=`M${y.x-c} ${y.y} a${c} ${c} 0 1 0 ${2*c} 0 a${c} ${c} 0 1 0 ${-2*c} 0 Z`)}let p=i&&u!==""?w`<path d=${u} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f;return w`${p}${[...d].map(([m,y])=>{let g=ye(m,"fill",o.colorHex);return w`<path d=${y} fill=${g.fill} fill-opacity=${g["fill-opacity"]} stroke="transparent" stroke-width="3" />`})}`}function Nf(e,n,t,i=!1,a=0){let r=Ac(t,n);if(!e.draws||r===void 0)return f;let o=Be(e.colorHex)??{color:"#FFFFFF",opacity:.2},s=hc(r.g,e.lines);return w`${s.map(l=>w`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none"
    stroke=${o.color} stroke-opacity=${Math.max(o.opacity,a>0?.6:0)} stroke-width=${Math.max(e.thickness,a)} />`)}${i?s.map(l=>w`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`):f}`}function Pf(e,n){let t=ye(e.fillColorHex,"fill"),i=e.borderColorHex?Be(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",s=i?i.opacity:0;switch(e.shapeKind){case"circle":{let l=Math.min(n.w,n.h)/2-r;return w`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,l)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"capsule":{let l=Math.min(n.w,n.h)/2;return w`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${l}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`}case"roundedRectangle":return w`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)} rx=${e.cornerRadius}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"rectangle":return w`<rect x=${n.x+r} y=${n.y+r} width=${Math.max(0,n.w-a)} height=${Math.max(0,n.h-a)}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]}
        stroke=${o} stroke-opacity=${s} stroke-width=${a} />`;case"line":{let l=n.w>=n.h,d=Math.max(0,Math.min(e.thickness,l?n.h:n.w)),c=l?n.x:n.cx-d/2,u=l?n.cy-d/2:n.y;return w`<rect x=${c} y=${u} width=${l?n.w:d} height=${l?d:n.h}
        fill=${t.fill} fill-opacity=${t["fill-opacity"]} stroke="none" />`}}}function Df(e,n,t){if(e.path!==void 0&&e.path!==""){let o=ye(e.colorHex,"fill"),s=e.size*xf;return w`<g transform="translate(${n.cx-s/2} ${n.cy-s/2}) scale(${s/24})">
      <path d=${e.path} fill=${o.fill} fill-opacity=${o["fill-opacity"]} /></g>`}let i=t.render(e.symbol,e.size,e.colorHex);if(i)return w`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=ye(e.colorHex,"stroke"),r=e.size;return w`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var os=.25,Of=8;function Vf(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,os),Of),c=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:c)*d,m=t*p,y=i*p,g=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),x=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(m-e)/2*(1+g)+0,y:-(y-n)/2*(1+x)+0,width:m,height:y}}function Hc(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var qa=4;function Bf(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+qa:n.x+n.w-qa-a,d=e.timestampCorner.startsWith("top")?n.y+qa:n.y+n.h-qa-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,c,u)=>u>=c?d+(c-u)/2:Math.min(d+c-u,Math.max(d,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Gf(e,n){if(e==="camera")return"camera.fill";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function Uf(e,n,t){let i=t.icons,a=`imgclip-${Fc()}-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?Bf(e,n,Hc(new Date)):void 0,s=o?Ic(o):f,l=e.url?t.imageSizes?.size(e.url):void 0,d;if(e.url&&l){let c=Vf(n.w,n.h,l.width,l.height,e.contentMode,e.zoom,e.panX,e.panY);d=w`<image href=${e.url} x=${n.x+c.x} y=${n.y+c.y} width=${c.width} height=${c.height}
      preserveAspectRatio="none" />`}else e.url?d=w`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:d=w`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(Gf(e.source,e.entityId),14,"#FFFFFF99")??f}</g>`;return w`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${d}${s}</g>`}function Ic(e,n=1){return w`<g opacity=${n}>
    <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h/2} fill="#000000" fill-opacity="0.55" />
    <text x=${e.x+e.w/2} y=${e.y+e.h/2} text-anchor="middle" dominant-baseline="central"
      font-size=${e.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${e.label}</text></g>`}function Kf(e,n){if(!e.linked)return f;let t=Hc(new Date),i=Hd(n.w,n.h);if(i<=0)return f;let a=t.length*i*.578+i*.89,r=i*1.25;return Ic({x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,size:i,label:t},e.url===void 0?.5:1)}function Wf(e,n,t,i,a){if(!i)return f;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?jf(a,n):void 0;return w`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?w`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${ts} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?w`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var ts=5;function jf(e,n){let t=ts*.55,i=n.w-2;if(n.h<ts*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Lc(e){let n=new Map;for(let t of e)t.kind==="chart"&&n.set(t.id,t);return n}function ns(e,n,t,i=new Map){if(e.isHidden&&!t.showHidden)return f;let a=t.tapReview===!0,r=t.tapAreas===!0||a,o=a?t.tapFocusId:void 0,s=o!==void 0&&e.id===o,l=o!==void 0;if(e.kind==="tap"&&!r)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!a||l&&!s))return f;let d=Wa(e,n),c=a&&(!l||s),u;switch(e.kind){case"text":u=Ef(e,d);break;case"icon":u=Df(e,d,t.icons);break;case"gauge":u=Mf(e,d);break;case"chart":u=Ff(e,d);break;case"timeline":u=Lf(e,d);break;case"chartTimes":u=_f(e,d);break;case"imageTime":u=Kf(e,d);break;case"chartDots":u=zf(e,d,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minDotRadius);break;case"chartGrid":u=Nf(e,d,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minGridStroke);break;case"shape":u=Pf(e,d);break;case"image":u=Uf(e,d,t);break;case"tap":u=Wf(e,d,t.icons,r,c?$t(e.action):void 0);break}let p=a&&(e.kind!=="tap"||l&&!s)?.35:1,m=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*p,y=t.highlightId===e.id,g=y||t.highlightIds?.includes(e.id)===!0,x=e.kind==="chartDots"||e.kind==="chartGrid",k=e.chartAnchor?.place==="through",C=t.handles===!0&&(!l||s)&&!x&&!k,$=g&&!x?w`<rect x=${d.x} y=${d.y} width=${d.w} height=${d.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,S=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?w`<rect x=${d.x} y=${d.y} width=${d.w} height=${d.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,L=x?f:w`<rect x=${d.x} y=${d.y} width=${d.w} height=${d.h} fill="transparent" stroke="none" />`,_=3,H=y&&C?[["nw",d.x,d.y],["ne",d.x+d.w,d.y],["sw",d.x,d.y+d.h],["se",d.x+d.w,d.y+d.h]].map(([J,R,A])=>w`<rect data-handle=${J} x=${R-_/2} y=${A-_/2} width=${_} height=${_}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${J}-resize" />`):f;return w`<g data-element-id=${e.id} opacity=${m} style=${C?"cursor:move":e.kind==="chartDots"?"cursor:pointer":f}
    pointer-events=${e.kind==="chartGrid"?"none":f}
    transform="rotate(${e.frame.rotationDegrees} ${d.cx} ${d.cy})">${L}${u}${S}${$}${H}</g>`}function Xa(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function ss(e,n){return(n?23.5:34)*e}var yc=10.5;function _c(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function bc(e,n){let t=0;for(let i of e)t+=_c(i,n);return t}function xc(e,n,t){let i=e.toUpperCase(),a=d=>_c(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function is(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function as(e,n,t,i){let a=is(e,n,t),r=is(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function zc(e,n,t,i){let{dial:a}=Xa(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:as(a,t,i.start,i.end),length:t*r}}function qf(e,n){let t=Xa(e,!0);return zc(e,n,t.dial.r,t.labelArc)}var vc=18.5,Yf=113,Xf={start:-71,end:-36},wc=104,Jf=6.2,kc={start:-77,end:-30.5};function $c(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Cc(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=$c(e[i]),o=$c(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var Qo=11;function Zf(e,n,t){let{dial:i}=Xa(n,!0),a=wc*n,r=180/(Math.PI*wc),o=e.minLabel!==void 0?bc(e.minLabel,Qo)*r:0,s=e.maxLabel!==void 0?bc(e.maxLabel,Qo)*r:0,l=kc.start+(o>0?Math.max(0,o-1.8):0),d=kc.end-(s>0?Math.max(0,s-1.8):0),c=d-l,u=24,p=[];for(let k=0;k<u;k++){let C=l+c*k/u,$=Math.min(d,l+c*(k+1)/u+.4);p.push(w`<path d=${as(i,a,C,$)} fill="none"
      stroke=${Cc(e.colorHexes,(k+.5)/u)} stroke-width=${Jf*n}
      stroke-linecap=${k===0||k===u-1?"round":"butt"} />`)}let m=(e.value-e.minValue)/(e.maxValue-e.minValue),y=is(i,a,l+c*m),g=1.5,x=(k,C,$,S)=>w`
    <defs><path id=${k} d=${as(i,a,C,$)} /></defs>
    <text font-size=${Qo*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${k}" startOffset="50%" text-anchor="middle">${S}</textPath></text>`;return w`${p}
    <circle cx=${y.x} cy=${y.y} r=${3.2*n} fill=${Cc(e.colorHexes,m)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?x(`${t}-gmin`,l-g-Math.max(o,3),l-g,e.minLabel):f}
    ${e.maxLabel!==void 0?x(`${t}-gmax`,d+g,d+g+Math.max(s,3),e.maxLabel):f}`}function Ja(e,n){let t=e.family in He?e.family:"rectangular",i=n.slot??He[t],a=He[t],r=Ya(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=Be(e.backgroundColorHex),l=Be(e.borderColorHex),d=e.borderWidth*r.scale,c=e.elements,u=Lc(c);if(t==="corner"){let x=r.scale,k=!!e.bezelText||!!e.bezelGauge,C=e.curvedText??"",$=C!=="",S=Xa(x,k),L=ss(x,k),_=L/(a.width*x),H=S.tile.cx-L/2,J=S.tile.cy-L/2,R=`M 0 0 H ${S.quad.width-S.cornerRadius} A ${S.cornerRadius} ${S.cornerRadius} 0 0 1 ${S.quad.width} ${S.cornerRadius} V ${S.quad.height} H 0 Z`,A=f;if(e.bezelGauge)A=Zf(e.bezelGauge,x,o);else if(e.bezelText){let U=qf(x,`${o}-bezel`),ne=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?ii((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;A=w`<defs><path id=${U.id} d=${U.d} /></defs>
        <text font-size=${yc*x} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${U.id}" startOffset="50%" text-anchor="middle">${xc(ne,U.length,yc*x)}</textPath></text>`}let j=f;if($){let U=Be(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},ne=zc(x,`${o}-curved`,Yf*x,Xf);j=w`<defs><path id=${ne.id} d=${ne.d} /></defs>
        <text font-size=${vc*x} font-weight="600" fill=${U.color} fill-opacity=${U.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${ne.id}" startOffset="50%" text-anchor="middle">${xc(C,ne.length,vc*x*.88)}</textPath></text>`}else{let U=e.borderWidth*r.scale*_,ne=l?w`<circle cx=${L/2} cy=${L/2} r=${L/2-U/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${U} />`:f;j=w`<g transform="translate(${H} ${J})">
        <g clip-path=${`url(#${o})`}>
          ${s?w`<rect width=${L} height=${L} fill=${s.color} fill-opacity=${s.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*_})">
            ${c.map(z=>ns(z,a,n,u))}
          </g>
        </g>
        <circle cx=${L/2} cy=${L/2} r=${L/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*x} stroke-dasharray=${`${2*x} ${2*x}`} />
        ${ne}
      </g>`}return w`<svg viewBox=${`0 0 ${S.quad.width} ${S.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${S.quad.width} height=${S.quad.height}>
      <defs><clipPath id=${o}><circle cx=${L/2} cy=${L/2} r=${L/2} /></clipPath></defs>
      <path d=${R} fill="#000000" />
      ${A}
      ${j}
    </svg>`}let p=w`<rect width=${i.width} height=${i.height} />`,m=l?w`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${d} />`:f,y=w`<rect width=${i.width} height=${i.height} fill="#000000" />`,g=`0 0 ${i.width} ${i.height}`;return w`<svg viewBox=${g} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${p}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${y}
      ${s?w`<rect width=${i.width} height=${i.height} fill=${s.color} fill-opacity=${s.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${c.map(x=>ns(x,a,n,u))}
      </g>
    </g>
    ${m}
  </svg>`}var Qf=.14;function eg(e,n){let t=Wa(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function tg(e,n,t){let i=e.family in He?e.family:"rectangular",a=He[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let p of r){let m=eg(p,a),y=p.frame.rotationDegrees%180===0?0:Math.hypot(m.w,m.h)/2;o=Math.min(o,y?m.cx-y:m.x),s=Math.min(s,y?m.cy-y:m.y),l=Math.max(l,y?m.cx+y:m.x+m.w),d=Math.max(d,y?m.cy+y:m.y+m.h)}let c=l-o,u=d-s;if(r.length===0||!(c>0)||!(u>0))o=0,s=0,c=a.width,u=a.height;else{let p=Math.max(2,Math.max(c,u)*Qf);o-=p,s-=p,c+=2*p,u+=2*p}if(c/u<t){let p=u*t;o-=(p-c)/2,c=p}else{let p=c/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:c,h:u}}function Nc(e,n,t){let i=e.family in He?e.family:"rectangular",a=He[i],r=tg(e,n,t.width/t.height),o=Be(e.backgroundColorHex),s=Be(e.borderColorHex),l=e.borderWidth,d={icons:t.icons,showHidden:!0,tapAreas:!0,minDotRadius:r.w/40,minGridStroke:r.w/110,...t.imageSizes?{imageSizes:t.imageSizes}:{}},c=e.elements.filter(m=>n.includes(m.id)),u=s&&l>0?i==="rectangular"?w`<rect x=${l/2} y=${l/2} width=${a.width-l} height=${a.height-l} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:w`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-l/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${l} />`:f,p=i==="rectangular"?w`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:w`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return w`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${p}
    ${c.map(m=>ns(m,a,d,Lc(e.elements)))}
    ${u}
  </svg>`}function te(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var _n=["rectangular","circular","corner","inline"];function oi(e){return ae.includes(e)}function Za(e){return _n.filter(n=>e.supportedFamilies.includes(n))}function ls(e){return ae.find(n=>e.supportedFamilies.includes(n))}function Qa(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function ng(){return{value:I("")}}function Pc(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=_n.filter(t=>t===n||e.supportedFamilies.includes(t))),oi(n)?e.perFamily[n]||(e.perFamily[n]=Tt()):e.inline||(e.inline=ng()),e.schemaVersion=gn(e)}function Dc(e,n){if(Qa(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),oi(n)){for(let t of pt(e,n))fe(e,t.payload.id);delete e.perFamily[n],at(e)}else delete e.inline;e.schemaVersion=gn(e)}}function Oc(e,n){let t=[];if(!oi(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=pt(e,n).filter(r=>!ge(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var Ge={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},Jt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},ds=["text","icon","gauge","chart","timeline","shape","image","tap"],Z={content:"#4a7fe8",look:"#a15fe0",numbers:"#26a69a",position:"#66bb6a",states:"#f9a825",tap:Ge.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Vc="2.8.0";function Gi(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function Bc(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function Gc(e,n=Vc){let t=Gi(e),i=Gi(n);return!t||!i?!1:Bc(t,i)>=0}function cs(e,n=null){if(n===null)return;let t=Gi(e),i=Gi(n);return!t||!i||Bc(t,i)>=0?void 0:`Needs Wrist Assistant ${i[2]===0?`${i[0]}.${i[1]}`:i.join(".")} or later on your watch.`}function Uc(e,n=Vc){return`${Gi(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}var Kc="52a9d81d0fd7";var Wc="11fa18406cea";var De="mdi:";function ig(e){return e.trim().replace(/\./g,"-")}function ag(e){return e.trim().replace(/-/g,".")}var er=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>ag(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=ig(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Be(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return w`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},tr=class{constructor(n,t="symbol-icons.json.gz",i=Kc){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Be(i)??{color:"#FFFFFF",opacity:1};return w`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},us=class{constructor(n,t){this.sf=n;this.mdi=new tr(t,"mdi-icons.json.gz",Wc)}render(n,t,i){return(n.trim().startsWith(De)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function jc(e){let n=er.available()?new er(e):new tr(e);return new us(n,e)}function qc(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var ir=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],ar=[...new Set(ir.flatMap(e=>e.symbols))],rg={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function og(e){return`${e.replace(/\./g," ")} ${(rg[e]??[]).join(" ")}`}function ps(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=og(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var nr=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var sg=100;function Yc(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var zn=class e{constructor(n,t){this.config=n;this.testValues=new Map;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,ni(n),Xt(n),zd(n),this.baseline=JSON.stringify(Qn(n))}static fromDocument(n,t){return new e(Zn(n),t)}get dirty(){return JSON.stringify(Qn(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){this.takeStep(t);let a=structuredClone(this.config);n(a),ni(a,i),Xt(a),this.config=a}setTestValues(n,t){this.takeStep(t),this.testValues=n}takeStep(n){let t=Date.now();(this.held?this.heldStepTaken:n!==void 0&&n===this.coalesceKey&&t<this.coalesceUntil)||(this.past.push({config:structuredClone(this.config),testValues:this.testValues}),this.past.length>sg&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=n,this.coalesceUntil=n===void 0?0:t+800}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=jo(n),Qn(n)}commit(){let n=structuredClone(this.config);return n.dataSources=jo(n),new e(n,null)}};var rr=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var si={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},mt={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Jc=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Zc={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},hs=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],lg=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function ms(e){return lg.includes(e)}function dg(e){return hs.includes(e)}function cg(e,n){return JSON.stringify(le(e))===JSON.stringify(le(n))}function fs(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!dg(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${si[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!cg(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Xc(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${mt[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Xc(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${mt[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:ug(i,n.otherwise),numberMode:i.length>0&&i.every(r=>ms(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Xc(e){let n=new Set;for(let t of e){let i=Le[t.kind];if(n.has(i))return i;n.add(i)}}function ug(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(Le[a.kind]);for(let i of n??[])t.add(Le[i.kind]);return Jc.filter(i=>t.has(i))}function Qc(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Jc.filter(a=>i.has(a)&&t.includes(a))}function or(e,n){return e.find(t=>Le[t.kind]===n)}function eu(e,n,t,i){let a=n.map(o=>({id:o.caseId??X(),when:{join:o.join??"all",tests:[{id:o.testId??X(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??X(),cases:a};return t&&(r.otherwise=t),r}function Ui(e){if(e.length===0)return"No states yet.";let n=fs(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function tu(e){let n=e[0];return n||(n={id:X(),cases:[]},e.push(n)),n}function nu(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function iu(e,n,t){let i=tu(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:X(),when:{join:"all",tests:[{id:X(),value:structuredClone(n),comparison:hg(a,t)}]},then:[]})}function au(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),nu(e))}function gs(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function ys(e,n){if(n){tu(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,nu(e))}function ru(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function ou(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>Le[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function pg(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function su(e,n=pg){let t=()=>n(e.value??I(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??I(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??I(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Hn(e.kind)==="value"?`${si[e.kind]} ${t()}`:si[e.kind]}}function hg(e,n){if(!e)return n?{kind:"lessThan",value:I("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??I("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??I("0")};default:return{kind:e.kind,...Hn(e.kind)==="value"?{value:I("")}:{}}}}var lu={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",chartTimes:"visibility",chartDots:"visibility",chartGrid:"visibility",imageTime:"visibility",layout:"backgroundColor"};function du(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function mg(e){switch(e){case"text":return w`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return w`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return w`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return w`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return w`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return w`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return w`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"chartDots":return w`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":return w`<path d="M4 7H20M4 12H20M4 17H20" />`;case"chartTimes":case"imageTime":case"clock":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return w`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return w`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return w`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return w`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return w`<path d="M6 9L12 15L18 9" />`;case"plus":return w`<path d="M12 5V19M5 12H19" />`;case"braces":return w`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return w`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"watch":return w`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return w`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return w`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return w`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return w`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return w`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return w`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return w`<path d="M6 14L12 8L18 14" />`;case"down":return w`<path d="M6 10L12 16L18 10" />`;case"left":return w`<path d="M14 6L8 12L14 18" />`;case"right":return w`<path d="M10 6L16 12L10 18" />`;case"show":return w`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return w`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return w`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return w`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return w`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return w`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return w`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return w`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return w`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return w`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function G(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${mg(e)}</svg>`}var ft="color-mix(in srgb, var(--k) 45%, #6b7280)",li='system-ui, -apple-system, "Segoe UI", sans-serif';function cu(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let u=c*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function bs(e,n,t,i){return w`<g fill="none" stroke-linecap="round">
    <path d=${cu(e,n,t,1)} stroke=${ft} stroke-width="2.6" opacity=".5" />
    <path d=${cu(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function fg(e){switch(e){case"text":return w`<g font-family=${li} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${ft}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${ft}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${ft}>1.2 kW</text>
      </g>`;case"icon":return w`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
      </g>`;case"gauge":return w`<g>
        ${bs(22,24,12,.28)}
        ${bs(60,24,12,.62)}
        ${bs(98,24,12,.92)}
        <text x="60" y="27" font-family=${li} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return w`<g>
        <g opacity=".4" fill=${ft}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"timeline":return w`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${ft} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${ft} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${ft} opacity=".55" />
        <text x="6" y="39" font-family=${li} font-size="7" fill=${ft}>1h ago</text>
        <text x="114" y="39" font-family=${li} font-size="7" text-anchor="end" fill=${ft}>now</text>
      </g>`;case"shape":return w`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return w`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return w`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`;case"chartTimes":return w`<g font-family=${li} font-size="8" fill="var(--k)">
        <text x="6" y="27">9 AM</text>
        <text x="60" y="27" text-anchor="middle">1 PM</text>
        <text x="114" y="27" text-anchor="end">5 PM</text>
      </g>`;case"chartDots":return w`<g fill="var(--k)">
        <circle cx="20" cy="30" r="3" /><circle cx="45" cy="18" r="3" /><circle cx="70" cy="24" r="3" /><circle cx="95" cy="12" r="3" />
      </g>`;case"chartGrid":return w`<g stroke="var(--k)" stroke-width="1.4" opacity=".7">
        <path d="M10 12H110M10 23H110M10 34H110" />
      </g>`;case"imageTime":return w`<g>
        <rect x="30" y="14" width="60" height="18" rx="9" fill="var(--k)" fill-opacity=".3" />
        <text x="60" y="27" text-anchor="middle" font-family=${li} font-size="10" fill="var(--k)">3:41:07</text>
      </g>`}}function uu(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${fg(e)}</svg>`}function gg(e,n){let t=()=>{let a=e.getScreenCTM();return a&&a.a!==0&&a.d!==0?{x:a.a,y:a.d}:void 0},i=t()??{x:1,y:1};return a=>(i=t()??i,{x:(a.clientX-n.clientX)/i.x,y:(a.clientY-n.clientY)/i.y})}function xs(e,n){let t={...e,...n};return vs({...t,x:di(t.x),y:di(t.y),width:Math.max(.04,di(t.width)),height:Math.max(.04,di(t.height))})}function vs(e){let n=Math.min(.96,Math.max(-e.width+.04,e.x)),t=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:n,y:t}}var di=e=>Math.round(e*1e3)/1e3,pu=10;function sr(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return vs({...e,x:di(a),y:di(r)})}function lr(e,n,t,i,a){let r=gg(e,t),o={...i.frame},s=o;e.setPointerCapture(t.pointerId);let l=p=>Math.round(p*1e3)/1e3,d=p=>{if(p.pointerId!==t.pointerId)return;let m=r(p),y=m.x/n.width,g=m.y/n.height,x;if(!i.handle)x=vs({...o,x:l(o.x+y),y:l(o.y+g)});else{let{x:k,y:C,width:$,height:S}=o,L=o.x+o.width,_=o.y+o.height;i.handle.includes("e")&&($=Math.max(.04,o.width+y)),i.handle.includes("s")&&(S=Math.max(.04,o.height+g)),i.handle.includes("w")&&($=Math.max(.04,o.width-y),k=L-$),i.handle.includes("n")&&(S=Math.max(.04,o.height-g),C=_-S),x={...o,x:l(k),y:l(C),width:l($),height:l(S)}}s=x,a.onFrame(i.elementId,x,!1)},c=p=>{p.pointerId===t.pointerId&&(u(),a.onFrame(i.elementId,s,!0))},u=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),u}var hu={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},mu=e=>(...n)=>({_$litDirective$:e,values:n}),dr=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,i){this._$Ct=n,this._$AM=t,this._$Ci=i}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}};var{I:yg}=Sl,fu=e=>e;var gu=()=>document.createComment(""),ci=(e,n,t)=>{let i=e._$AA.parentNode,a=n===void 0?e._$AB:n._$AA;if(t===void 0){let r=i.insertBefore(gu(),a),o=i.insertBefore(gu(),a);t=new yg(r,o,e,e.options)}else{let r=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let l;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(l=e._$AU)!==o._$AU&&t._$AP(l)}if(r!==a||s){let l=t._$AA;for(;l!==r;){let d=fu(l).nextSibling;fu(i).insertBefore(l,a),l=d}}}return t},Zt=(e,n,t=e)=>(e._$AI(n,t),e),bg={},yu=(e,n=bg)=>e._$AH=n,bu=e=>e._$AH,cr=e=>{e._$AR(),e._$AA.remove()};var xu=(e,n,t)=>{let i=new Map;for(let a=n;a<=t;a++)i.set(e[a],a);return i},vu=mu(class extends dr{constructor(e){if(super(e),e.type!==hu.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);let a=[],r=[],o=0;for(let s of e)a[o]=i?i(s,o):o,r[o]=t(s,o),o++;return{values:r,keys:a}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){let a=bu(e),{values:r,keys:o}=this.dt(n,t,i);if(!Array.isArray(a))return this.ut=o,r;let s=this.ut??=[],l=[],d,c,u=0,p=a.length-1,m=0,y=r.length-1;for(;u<=p&&m<=y;)if(a[u]===null)u++;else if(a[p]===null)p--;else if(s[u]===o[m])l[m]=Zt(a[u],r[m]),u++,m++;else if(s[p]===o[y])l[y]=Zt(a[p],r[y]),p--,y--;else if(s[u]===o[y])l[y]=Zt(a[u],r[y]),ci(e,l[y+1],a[u]),u++,y--;else if(s[p]===o[m])l[m]=Zt(a[p],r[m]),ci(e,a[u],a[p]),p--,m++;else if(d===void 0&&(d=xu(o,m,y),c=xu(s,u,p)),d.has(s[u]))if(d.has(s[p])){let g=c.get(o[m]),x=g!==void 0?a[g]:null;if(x===null){let k=ci(e,a[u]);Zt(k,r[m]),l[m]=k}else l[m]=Zt(x,r[m]),ci(e,a[u],x),a[g]=null;m++}else cr(a[p]),p--;else cr(a[u]),u++;for(;m<=y;){let g=ci(e,l[y+1]);Zt(g,r[m]),l[m++]=g}for(;u<=p;){let g=a[u++];g!==null&&cr(g)}return this.ut=o,yu(e,l),xt}});var wu="sun.sun";function ku(e){let n=e?.[wu],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:wu,displayName:t||"Sun",domain:"sun"}}var $u=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],xg=[0,1,2,3,4];function Cu(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function ws(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var Su=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function vg(e){return[Tu(e,"below_horizon")]}function wg(e){return[Tu(e,"above_horizon")]}function Tu(e,n){return{id:X(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:I(n)}}}function kg(e,n=0){return[{id:X(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:I(String(n))}}]}function $g(e=xg){return[{id:X(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:ws(e)}}]}function Cg(e="22:00",n="06:00"){return[{id:X(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:I(e),upper:I(n)}}]}function Eu(e,n){switch(e){case"afterSunset":return vg(n);case"daytime":return wg(n);case"sunElevation":return kg(n);case"weekday":return $g();case"timeBetween":return Cg()}}function ks(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function ji(e){for(let n of e)delete n.partId}function Mu(e,n=X()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==oe&&(t.bandAboveColorHex=e.bandAboveColorHex)),ks(e),e.parts=[t],e.value=Mi(e.parts),n}function ur(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,ji(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),ks(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,ji(e.rules),{ok:!0,joined:!1,moved:r}}let i=$s(t,n);return i.ok?(e.value=i.value,ks(e),delete e.parts,ji(e.rules),{ok:!0,joined:!0}):i}function Ki(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Wi(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function Sg(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=Ae(i)?s.format:i,t=s}let a={kind:t.kind};return Ae(i)||(a.format=i),a}function Tg(e,n){let t=Sg(e,n);if(!t)return{blocked:"kind"};let i=vn(t);if(i!==void 0)return Wi(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${Ki(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let c=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(c&&u)return Wi(r.prefix??"")+a.value+Wi(r.suffix??"");c?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let c=Pi(a);if(c===void 0)return{blocked:"kind"};s=c;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let c=`(${s} | float(0))`;r.multiply!==void 0&&(c=`(${c} * ${r.multiply})`),r.offset!==void 0&&(c=`(${c} + ${r.offset})`),s=r.decimals!==void 0?`${Ki(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${c})`:c}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${Ki(l)}, 'unit_of_measurement') %}`);let d="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let c=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[Ki(r.prefix)]:[],`(${s})`,...l!==void 0?[d]:[],...r.suffix?[Ki(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${c} }}`}return o+Wi(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${d} }}`:"")+Wi(r.suffix??"")}function $s(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:Mi(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=Tg(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}function Eg(e){switch(e){case"light":return w`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return w`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return w`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return w`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return w`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return w`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return w`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return w`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return w`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return w`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return w`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return w`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return w`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return w`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return w`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return w`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return w`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return w`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return w`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return w`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return w`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return w`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return w`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return w`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return w`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return w`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return w`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return w`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return w`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return w`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function Cs(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Eg(e)}</svg>`}var Mg={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Ru(e){let n=Mg[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var Rg=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function Ss(e){return Rg.has(e.trim().toLowerCase())}var Ps=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function be(e){return n=>e(n.target.value)}function Qt(e,n){let t=n===void 0?cs(e.watchAppVersion):cs(e.watchAppVersion,n);return t===void 0?f:h`<div class="hint keep">${t}</div>`}function Ds(e){if(e===void 0||e.atDefault)return f;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function ze(e,n,t){let i=Ds(n),a=[i===f?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?f:a} title=${t?"Drag left or right to change":f}
    @pointerdown=${t??f}>${e}${i}</span>`}var Er="wa-scrub-start",Mr="wa-scrub-end";function Rr(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;if(a.closest(".field")?.querySelector("input[type=number]")?.disabled)return;i.preventDefault();let r=e!==void 0&&Number.isFinite(e)?e:Math.max(0,t.min??0),o=t.step??(Number.isInteger(r)?1:.1),s=(String(o).split(".")[1]??"").length,l=i.clientX,d=!1,c=r,u=m=>{let y=m.clientX-l;if(!d&&Math.abs(y)<3)return;d=!0;let g=r+Math.round(y/3)*o;t.min!==void 0&&(g=Math.max(t.min,g)),t.max!==void 0&&(g=Math.min(t.max,g)),g=Number(g.toFixed(s)),g!==c&&(c=g,n(g))},p=()=>{if(a.removeEventListener("pointermove",u),a.removeEventListener("pointerup",p),a.removeEventListener("pointercancel",p),a.dispatchEvent(new CustomEvent(Mr,{bubbles:!0,composed:!0})),!d)return;let m=y=>{y.preventDefault(),y.stopPropagation()};a.addEventListener("click",m,{capture:!0,once:!0}),setTimeout(()=>a.removeEventListener("click",m,{capture:!0}),0)};a.setPointerCapture(i.pointerId),a.addEventListener("pointermove",u),a.addEventListener("pointerup",p),a.addEventListener("pointercancel",p),a.dispatchEvent(new CustomEvent(Er,{bubbles:!0,composed:!0}))}}function tn(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function $e(e,n,t,i={}){return h`<label class="field">${ze(e,tn(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${be(t)} /></label>`}function Xu(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${be(t)}></textarea></label>`}function ee(e,n,t,i={}){return h`<label class="field num">${ze(e,tn(n,i.def,t),Rr(n,t,i))}${Fr(n,t,i)}</label>`}function Fr(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??f} max=${t.max??f}
      aria-label=${t.ariaLabel??f} placeholder=${t.placeholder??f}
      @input=${be(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?f:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?f:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function xe(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${ze(e,tn(n,a.def,i,r))}
    <select @change=${be(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function Q(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${ze(e,tn(n,a.def,o=>i(o,null),r))}
    ${vr(e,n,t,i,a)}</div>`}function vr(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??f} ?disabled=${a.disabled?.[r]===!0}
        @click=${d=>{r!==n&&i(r,d.currentTarget)}}>${o}</button>`})}
    </div>`}function Fg(e,n){let t=i=>tn(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${ze(e.label,t(e))}
    <div class="pair-row">
      ${vr(e.label,e.value,e.options,e.set,e)}
      ${ze(n.label,t(n))}
      ${vr(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function On(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${ze(e,tn(n,i.def,t,a),Rr(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?f:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${be(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${Fr(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function Ue(e,n,t,i,a={}){return h`<label class="field check">${ze(e,tn(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function pe(e,n,t,i=!1,a){let{rgb:r,alpha:o}=Ju(n),s=a===void 0?void 0:{atDefault:Os(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${ze(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${d=>t(d.target.checked?Hs(r,o):void 0)} />`:f}
      ${wr(e,n,t,l)}
    </div></div>`}function Ju(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function Hs(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function wr(e,n,t,i=!1,a="#RRGGBB"){let{valid:r,swatch:o,rgb:s,alpha:l}=Ju(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!r?"transparent":o}`} title="Pick a colour">
        <input type="color" .value=${s} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${be(d=>t(Hs(d,l)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder=${a} spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${be(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&t(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(l)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          @input=${be(d=>{let c=Number(d);d.trim()!==""&&c>=0&&c<=100&&t(Hs(s,Math.round(c)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function Is(e,n,t,i){let a={atDefault:n===void 0,title:`Back to ${t.toLowerCase()}`,reset:()=>i(void 0)};return h`<div class="field color">${ze(e,a)}
    <div class="color-row">${wr(e,n,i,!1,t)}</div></div>`}function Os(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Ar(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function Ag(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function Fu(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Zu=50;function Hg(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function Ig(e,n,t=Zu,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;d===a?p=0:d.startsWith(a)?p=1:c.startsWith(a)?p=2:d.includes(a)?p=3:c.includes(a)?p=4:o.length>1&&o.every(m=>d.includes(m)||c.includes(m))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(m=>d.includes(m)||c.includes(m)||u.includes(m)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var Lg=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Qu(e){return Lg.test(e.trim())}function _g(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return Ar(t,i);if(Qu(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var Pn=new Map;function Me(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function Vs(e){return Pn.has(e)}function gt(e,n,t,i,a,r={}){let o=e.hass.states,s=Pn.get(a),l=s?Ig(Ag(o,r.domain,Fu(e.hass)),s.query,Zu,r.preferNumeric?Hg:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=t.entityId?o[t.entityId]:void 0,u=($,S,L=0)=>{Pn.set(a,{query:S,index:L}),Me($)},p=$=>{Pn.delete(a),Me($)},m=$=>{let S=_g($,t,o);S&&i(S)},y=($,S)=>{i(Ar(o,$.entityId)),p(S)},g=()=>Math.max(0,Math.min(Pn.get(a)?.index??0,l.length-1)),x=$=>{let S=$.target;if($.key==="ArrowDown"||$.key==="ArrowUp"){$.preventDefault();let L=Pn.get(a);if(!L){u(S,S.value);return}let _=$.key==="ArrowDown"?g()+1:g()-1;u(S,L.query,Math.max(0,Math.min(l.length-1,_))),zg(S);return}if($.key==="Enter"){$.preventDefault();let L=l[g()];s&&L?y(L,S):(m(S.value),p(S));return}if($.key==="Escape"){if(!s)return;$.preventDefault(),$.stopPropagation(),p(S)}},k=t.entityId?Fu(e.hass)?.(t.entityId):void 0,C=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:c?h`<div class="entity-current">
          <span class="ent-ico ${Ss(c.state)?"on":""}">${Cs(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${k?h`<span class="ent-area">${k}</span>`:f}
          <span class="ent-state">${c.state}</span>
        </div>`:h`<div class="hint warn">Not in Home Assistant right now.</div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${G("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${$=>{let S=$.target;u(S,t.entityId),S.select()}}
        @input=${$=>{let S=$.target;u(S,S.value)}}
        @keydown=${x}
        @blur=${$=>{let S=$.target;s&&m(S.value),p(S)}} />
      ${(s?s.query:t.entityId)===""?f:h`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${$=>$.preventDefault()}
        @click=${$=>{let S=$.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),Pn.set(a,{query:"",index:0}),Me(S),S?.focus()}}>${G("close")}</button>`}
    </div>
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${Qu(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map(($,S)=>h`<button type="button" role="option" aria-selected=${S===d?"true":"false"} class="ent ${S===d?"hl":""}"
                @mousedown=${L=>L.preventDefault()} @click=${L=>y($,L.target)}>
                <span class="ent-ico ${Ss($.state)?"on":""}">${Cs($.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${$.name}</span>
                  <span class="ent-sub">
                    ${$.area?h`<span class="ent-area">${$.area}</span>`:f}
                    <span class="ent-id mono">${$.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Ru($.domain)}</span>
                  <span class="ent-state">${$.state}</span>
                </span>
              </button>`)}
        </div>`:C}
  </div>`}function zg(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Au=120;function Ng(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(ir.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(ar),fromPack:!1}}function Hu(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function Pg(e){return[{value:"",label:`Starter set (${Hu(ar,e)})`},...ir.map(n=>({value:n.name,label:`${n.name} (${Hu(n.symbols,e)})`}))]}function Dg(e){return e.length>0?e.length:ar.length}function Iu(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function pr(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function ep(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),d=l??[],c=new Set(d),u=n.trim(),p=u.startsWith(De),m=a!==void 0,y=m?r.pack(i)??(p?"mdi":"sf"):"sf",g=Og(u,c),x=$=>{t($),a?.($.startsWith(De)?e.icons.mdiPath?.($):void 0),r.noteUsed($)},k=$=>{if(t($),!m)return;let S=$.trim();a?.(S.startsWith(De)?e.icons.mdiPath?.(S):void 0)},C=f;if(o&&y==="mdi"){let $=e.icons.mdiNames?.(),S=Vg($??[],s),L=S.slice(0,Au),_=r.recent.filter(H=>H.startsWith(De));C=h`<div class="sym-browse">
      ${Lu(r,i,y)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${be(H=>r.setQuery(i,H))} />
      </div>
      ${_.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${_.map(H=>pr(e,H,H===u,x))}</div>`}
      <div class="sym-grid">${L.map(H=>pr(e,H,H===u,x))}</div>
      ${$===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:S.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${Iu(L.length,S.length,!0,$.length)}</div>`}
      ${$!==void 0&&p&&!$.includes(u)?h`<div class="hint warn">There is no <code>${u}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:f}
    </div>`}else if(o){let $=r.category(i),S=Ng($,s,d,c),L=ps(S.names,s),_=S.fromPack?L.slice(0,Au):L,H=r.recent.filter(R=>!R.startsWith(De)),J=c.size===0?H:H.filter(R=>c.has(R));C=h`<div class="sym-browse">
      ${m?Lu(r,i,y):f}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${be(R=>r.setQuery(i,R))} />
        <select @change=${be(R=>r.setCategory(i,R))}>
          ${Pg(c).map(R=>h`<option value=${R.value} ?selected=${R.value===$}>${R.label}</option>`)}
        </select>
      </div>
      ${J.length===0?f:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${J.map(R=>pr(e,R,R===u,x))}</div>`}
      <div class="sym-grid">${_.map(R=>pr(e,R,R===u,x))}</div>
      ${L.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${Iu(_.length,L.length,s.trim()!=="",Dg(d))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${be(k)} @change=${be($=>{let S=$.trim();S.startsWith(De)?e.icons.mdiPath?.(S)!==void 0&&r.noteUsed($):(c.size===0||c.has(S))&&r.noteUsed($)})} /></label>
    ${g?h`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${C}`}function Og(e,n){let t=e.trim();return t!==""&&!t.startsWith(De)&&n.size>0&&!n.has(t)}function Vg(e,n){let t=n.trim(),i=t.startsWith(De)?t.slice(De.length):t,a=e.map(r=>r.startsWith(De)?r.slice(De.length):r);return ps(a,i).map(r=>De+r)}function Lu(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var Bg=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Time since entity changed"],["aggregate","Several entities combined"],["chartStat","Number from a chart"],["time","Clock and date"],["dataAge","Time since last refresh"],["jinja","Template (Jinja)"],["named","Shared value"]],Gg={literal:"Words or a number you type. It never changes.",entityState:"What Home Assistant shows for the entity, like 21.5 or on.",entityAttribute:"One detail the entity carries besides its state, like a light's brightness.",entityAge:"Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",aggregate:"Count several entities, or take the sum, average, lowest or highest of their states.",time:"The time or date, read each time the complication refreshes.",dataAge:"Seconds since the watch last fetched values."},Ug=[["straight","Straight"],["smooth","Smooth"],["step","Step"]],Kg=[["flat","Flat"],["fade","Fade"]],tp=[["auto","Auto"],["all","All"]],Wg=[["off","Off"],["light","Light"],["medium","Medium"],["strong","Strong"]],np=[["bars","Bars"],["line","Line"],["area","Area"]],jg=[["auto","Auto"],["fixed","Fixed range"]],qg=[["lowest","Lowest value"],["zero","Zero"]],Yg=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Ls=[["uniform","One colour"],["bands","By value"]];function kr(e){let n=[ao,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:X(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:X(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function ip(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function Xg(e,n){let t=Gt({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:X(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function Jg(e,n){let t=[...e].sort((l,d)=>l-d),i=t[0],a=t.at(-1),r=n!==void 0&&Number.isFinite(n)?n:void 0,o=(r??0)-1,s=(r??0)+1;if(i!==void 0&&a!==void 0){let l=(t.length>1?(a-i)/(t.length-1):Math.abs(i)/2)||1;o=i-l,s=a+l}return r!==void 0&&(o=Math.min(o,r),s=Math.max(s,r)),{lo:o,hi:s}}function Zg(e,n,t){let{lo:i,hi:a}=Jg(e.map(l=>l.upTo),t),r=l=>Math.max(0,Math.min(100,(l-i)/(a-i)*100)),o=i,s=e.map(l=>{let d=Math.max(0,r(l.upTo)-r(o));return o=Math.max(o,l.upTo),h`<i style=${`width:${d}%;background:${l.colorHex}`}></i>`});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${s}<i style=${`flex:1 1 auto;background:${n}`}></i></div>
    ${t===void 0?f:h`<span class="now" style=${`left:${r(t)}%`} title=${`Now ${t}`}></span>`}
  </div>`}function $r(e,n,t,i){let a=Gt({bands:e.bands}),r=i!==void 0&&Number.isFinite(i)?i:void 0,o=r===void 0?void 0:a.find(c=>r<=c.upTo)?.id??"above",s=(c,u)=>p=>{let m=p.bands.find(y=>y.id===c);m&&u(m)},l=e.bandAboveColorHex,d={atDefault:Os(l,oe),title:`Back to ${oe}`,reset:()=>t(c=>{c.bandAboveColorHex=oe})};return h`<div class="bands">
    ${Zg(a,l,r)}
    ${a.map(c=>h`
      <div class="band-row ${o===c.id?"hit":""}">
        <span class="le" aria-hidden="true">≤</span>
        <input type="number" class="band-up" step="any" .value=${String(c.upTo)} aria-label="Up to"
          title="This colour runs up to and including this number"
          @change=${be(u=>{let p=Number(u);u.trim()!==""&&Number.isFinite(p)&&t(s(c.id,m=>{m.upTo=p}))})} />
        ${wr(`Up to ${c.upTo}`,c.colorHex,u=>t(s(c.id,p=>{p.colorHex=u??"#FFFFFF"}),`bcol${c.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(u=>{u.bands=u.bands.filter(p=>p.id!==c.id)})}>${G("close")}</button>
      </div>`)}
    <div class="band-row ${o==="above"?"hit":""}">${Ds(d)}
      <span class="le" aria-hidden="true">&gt;</span>
      <span class="else">Above</span>
      ${wr("Above the last band",l,c=>t(u=>{u.bandAboveColorHex=c??oe},"babove"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(c=>{c.bands=[...c.bands,Xg(c.bands,n)]})}>+ Band</button>
  </div>`}function Qg(e,n,t,i){let a=new Map,r=new Map,o=(d,c)=>{let u=d.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+c)};e.forEach((d,c)=>{let u=e[c+1],p=u===void 0?n:u.offsetSeconds;o(d.state,Math.max(0,p-d.offsetSeconds))}),t!==void 0&&o(t,0),(Ai[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,c)=>c[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function ey(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${$e("State",o.match,l=>n(d=>{let c=d.bands[s];c&&(c.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${pe("Colour",o.colorHex,l=>n(d=>{let c=d.bands[s];c&&(c.colorHex=l??Kt)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((d,c)=>c!==s)})}>${G("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:X(),match:r,colorHex:ba(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${pe("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??Kt},"tother"),!1,Kt)}`}var ty=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"]],ny={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled"};function _u(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return I(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var iy=[["now","Time (14:05)"],["hour","Hour"],["minute","Minute"],["weekday","Day of the week (0 is Monday)"],["day","Day of the month"],["month","Month number"],["timestamp","Unix timestamp (seconds)"]];function ay(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function re(e,n,t,i){if(i.inline||!ry())return h`<div class="value-editor">${sp(e,n,t,i)}</div>`;let a=Hr(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=ke(n,de(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?f:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?f:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${ap(e,a,r,n,t,i)}
  </div>`}function ap(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${op}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${Zi.has(n)?sp(e,i,a,r):f}
  </div>`}function de(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Hr(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function ry(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Zi=new Set,qi=new WeakMap;function oy(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function rp(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function op(e){let n=e.currentTarget,t=e.newState==="open",i=qi.get(n);if(i&&(i(),qi.delete(n)),!t){Zi.delete(n.id)&&Me(n);return}let a=oy(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){qi.get(n)?.(),qi.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Ts(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),qi.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Ts(n,a.getBoundingClientRect()),Zi.has(n.id)||(Zi.add(n.id),Me(n),requestAnimationFrame(()=>{n.isConnected&&Ts(n,a.getBoundingClientRect())}))}function Ts(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=sy({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Nn=8,hr=6,zu=140;function sy(e,n,t){let i=t.height-e.bottom-hr-Nn,a=e.top-hr-Nn,r=n.height>i&&a>i&&i<zu,o=Math.max(zu,r?a:i),s=Math.min(n.height,o),l=Math.max(Nn,Math.min(e.left,t.width-n.width-Nn)),d=r?Math.max(Nn,e.top-hr-s):Math.max(Nn,Math.min(e.bottom+hr,t.height-s-Nn));return{left:l,top:d,maxHeight:o,above:r}}function sp(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,s=Bg.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=f;switch(a.kind){case"literal":l=i.symbol?ep(e,a.value,c=>r({...a,value:c}),o,i.setSymbolPath):$e("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=gt(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${gt(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${$e("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${c.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=fy(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=xe("Field",a.timeField,iy,c=>r({...a,timeField:c}));break;case"dataAge":break;case"jinja":l=h`${Xu("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":{let c=e.config.values.find(p=>p.id===a.id),u=c?Li(e.config,c.id):0;l=e.config.values.length===0?h`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${()=>hy(e,n,t)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`:h`${xe("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}))}
          ${c?h`<div class="hint keep">Read by ${u} ${u===1?"layer":"layers"}.
            <button type="button" class="link" @click=${()=>e.selectValue(c.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${()=>{let p=No(e.config,n);p&&t(p)}}>stop sharing</button>
            to give this one its own copy.</div>`:f}`;break}case"chartStat":{let c=de(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${xe("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Se(p,c)])],p=>r({...a,layer:p}))}
          ${xe("Number",a.stat,[...xn],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;break}}let d=Gg[a.kind];return h`
    ${xe("Source",a.kind,s,c=>r(ay(a,c)))}
    ${d?h`<div class="hint">${d}</div>`:f}
    ${l}
    ${uy(n,i)?h`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${()=>py(e,n,t)}>Make shared</button>
      so other layers can read this too.</div>`:f}
    ${i.noFormat?f:my(n.format,c=>t(Ae(c)?{kind:n.kind}:{...n,format:c}),dy(ly(e,n)))}
    ${i.showResolved?cy(e,n,e.resolve(i.resolveAs??n)):f}`}function ly(e,n){let t=n.kind;for(let i=0;t.kind==="named"&&i<8;i++){let a=t.id.toUpperCase(),r=e.config.values.find(o=>o.id.toUpperCase()===a);if(!r)return;t=r.value.kind}return t.kind==="named"?void 0:t}function dy(e){if(!e)return{numbers:!0,textCase:!0,unit:!0,seconds:!0};switch(e.kind){case"literal":{let n=Ve(e.value)!==void 0;return{numbers:n,textCase:!n,unit:!1,seconds:n}}case"entityState":case"entityAttribute":case"jinja":case"named":return{numbers:!0,textCase:!0,unit:e.kind!=="jinja"&&e.kind!=="named",seconds:!0};case"entityAge":case"dataAge":return{numbers:!0,textCase:!1,unit:!1,seconds:!0};case"aggregate":return{numbers:!0,textCase:!1,unit:!1,seconds:!1};case"chartStat":{let n=e.stat==="trend";return{numbers:!n,textCase:!1,unit:!n,seconds:!1}}case"time":return{numbers:e.timeField!=="now",textCase:!1,unit:!1,seconds:!1}}}function cy(e,n,t){let i=t===void 0?h`<span class="readout-v now-v none">${lp(e,n)}</span>`:t.trim()===""?h`<span class="readout-v now-v none">Empty</span>`:h`<span class="readout-v now-v"><span class="now-tok">${t}</span></span>`;return h`<div class="field readout now-field"><span>Now</span>${i}</div>`}function lp(e,n){let t=n.kind;switch(t.kind){case"entityState":case"entityAttribute":case"entityAge":return t.entityId===""?"Pick an entity":e.hass.states[t.entityId]?t.kind==="entityAttribute"&&t.attribute.trim()===""?"Pick an attribute":t.kind==="entityState"?"No reading":"Waiting for Home Assistant":"No such entity";case"chartStat":return t.layer===""?"Pick a chart":"The chart has no readings yet";case"named":{if(t.id==="")return"Pick a shared value";let i=t.id.toUpperCase(),a=e.config.values.find(r=>r.id.toUpperCase()===i);return a?lp(e,a.value):"That shared value is gone"}case"jinja":return t.value.trim()===""?"Type a template":"Waiting for Home Assistant";default:return"Waiting for Home Assistant"}}function uy(e,n){if(n.allowNamed===!1||n.noShare)return!1;let t=e.kind;return t.kind==="named"?!1:t.kind==="literal"||t.kind==="jinja"?t.value.trim()!=="":"entityId"in t?t.entityId!=="":t.kind==="chartStat"?t.layer!=="":!0}function py(e,n,t){let i=ea(n,de(e)).replace(/^"(.*)"$/,"$1"),{named:a,ref:r}=zo(e.config,n,_e(i,24));e.beginGesture(),e.update(o=>{o.values.push(a)}),t(r),e.endGesture()}function hy(e,n,t){let{named:i,ref:a}=zo(e.config,{...n,kind:{kind:"literal",value:""}},"");i.name="",e.beginGesture(),e.update(r=>{r.values.push(i)}),t(a),e.endGesture(),e.selectValue(i.id)}function my(e,n,t){let i=e??{},a=s=>{let l={...i,...s};for(let d of Object.keys(l))(l[d]===void 0||l[d]===!1||l[d]==="")&&delete l[d];n(l)},r=Ae(e),o={decimals:t.numbers||i.decimals!==void 0,multiply:t.numbers||i.multiply!==void 0,offset:t.numbers||i.offset!==void 0,textCase:t.textCase||i.textCase!==void 0,unit:t.unit||!!i.useEntityUnit,seconds:t.seconds||!!i.relativeTime||!!i.duration};return h`<details class="sub format" ?open=${!r}>
    <summary>Format${r?h`<span class="sum-note">as it comes</span>`:h`<span class="sum-note">${Sp(e).replace(/^ \((.*)\)$/,"$1")}</span>`}</summary>
    <div class="grid2">
      ${o.decimals?ee("Decimals",i.decimals,s=>a({decimals:s}),{step:1,min:0,max:6,optional:!0,placeholder:"as is"}):f}
      ${o.multiply?ee("Multiply",i.multiply,s=>a({multiply:s}),{optional:!0,placeholder:"1"}):f}
      ${o.offset?ee("Plus",i.offset,s=>a({offset:s}),{optional:!0,placeholder:"0"}):f}
      ${o.textCase?Q("Case",i.textCase??"",[["","As is"],["upper","ABC"],["lower","abc"],["capitalized","Abc"]],s=>a({textCase:s||void 0}),{titles:{"":"Leave the letters as they are",upper:"UPPER CASE",lower:"lower case",capitalized:"Capital First Letters"}}):f}
      ${$e("Before",i.prefix??"",s=>a({prefix:s}),{placeholder:"text in front"})}
      ${$e("After",i.suffix??"",s=>a({suffix:s}),{placeholder:"text after"})}
    </div>
    ${o.unit?Ue("Add unit",!!i.useEntityUnit,s=>a({useEntityUnit:s})):f}
    ${o.seconds?Q("Seconds as",i.duration?"duration":i.relativeTime?"relativeTime":"",[["","Number"],["relativeTime","Short"],["duration","Duration"]],s=>a({relativeTime:s==="relativeTime",duration:s==="duration"}),{titles:{"":"300",relativeTime:"One unit: 45s, 5m, 3h",duration:"Two units: 1h 23m, 5m 0s"}}):f}
  </details>`}function fy(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return h`
    ${xe("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${Q("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?h`<div class="grid2">
          ${$e("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${$e("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${$e("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${$e("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:h`${o.entities.map((s,l)=>h`<div class="row-inline">
            ${gt(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${G("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${xe("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?$e("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):f}
    ${n.function==="count"?f:$e("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var dp=vo,gy=dp.filter(([e])=>e!=="none");function yy(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function cp(e,n){let t=yy(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return wd(e)?{type:e,...t}:{type:e}}var by=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function up(e,n,t,i){let a=n.serviceDataJSON??"",r=kd(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${$e("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${$e("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${by.map(([s,l,d,c])=>h`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:d};c===""?delete u.serviceDataJSON:u.serviceDataJSON=c,t(u)}}>${s}</button>`)}
    </div>
    ${gt(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${Xu("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function xy(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function pp(e){let n=e.config,t=n.tapAction,i=xy(e.savedName,n.name),a=n.refreshMinutes??0,r=Nu.map(s=>[String(s),Pu(s)]);Nu.includes(a)||r.push([String(a),Pu(a)]);let o=n.showSuccessFlash??!0;return h`
    <div class="gen-row">
      ${$e("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${xe("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${xe("Tap action",t.type,dp,s=>e.update(l=>{l.tapAction=cp(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??vy).slice(0,7)}
                @input=${be(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in t?gt(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):f}
    ${t.type==="callService"?up(e,t,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):f}
    ${t.type==="openPage"?wy(e):f}`}var vy="#808080",Nu=[0,15,30,60,120];function Pu(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function wy(e){let n=e.config;return hp(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function hp(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${xe("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?f:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}function mp(e,n){let t=e.config.values.findIndex(o=>o.id===n.id),i=`nv-${n.id}`,a=Li(e.config,n.id),r={kind:{kind:"named",id:n.id}};return h`
    ${$e("Name",n.name,o=>e.update(s=>{s.values[t].name=o},`${i}-name`),{placeholder:"Name it, like Outside temp"})}
    ${re(e,n.value,o=>e.update(s=>{s.values[t].value=o},i),{allowNamed:!1,showResolved:!0,resolveAs:r,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${a===0?"No layers yet":`${a} ${a===1?"layer":"layers"}`}</span></div>`}function fp(){return{id:X(),name:"",value:I("")}}function Re(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function Ce(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=Re(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete d.size,o.placements[t]=d}function en(e,n,t,i,a){let r=n.payload.id,o=za(n)??a.min,s=Re(e.config,t,n).size??o;return ee(i,s,l=>e.update(d=>Ce(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function gp(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=Tt()),a=pt(e,n).filter(l=>!ge(e,l));if(a.length===0)return;let r=ti(e,a.map(l=>l.payload.id),n),o=fn(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let d=e.elements.find(m=>m.payload.id===l);if(!d)continue;let c=s?.placements[l],u=c?.size??za(d),p={frame:{...c?.frame??d.payload.frame},isHidden:c?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let m of ae)m!==t&&delete e.perFamily[m]?.placements[l];i.placements[l]=Fo(p,n,t,d.kind)}ni(e,t)}function Ir(e,n){return Wd(e,n)}function ky(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Dn(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"?void 0:e.payload.colorSlot.baseColorHex}function yp(e,n,t){let i=ky(t.map(l=>Re(e,n,l).isHidden)),a=t.map(Dn),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var ui=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],$y=[["leading","Left"],["center","Center"],["trailing","Right"]],Cy=[["1","1"],["2","2"]];function bp(e,n,t){let i=n.payload.id,a=Da(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:Du(n)},l=d=>{let c=e.hass.states[d]?.attributes?.device_class;return typeof c=="string"?c:void 0};return h`
    ${gt(e,o?"Camera":"Entity",r,d=>e.update(c=>jd(c,i,d,l(d.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${Du(n)?"warn":""}">${Ty(n,a)}</div>`}function Du(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.entity.entityId==="":!1}function Sy(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Lr(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Ty(e,n){let t=Sy(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a shared value, so change that shared value to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Lr(o)}.${r}`}function Ey(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function Cr(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>Cr(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>Cr(e[a],n[a]))}function Es(e,n,t){return t.some(i=>!Cr(e[i],n[i]))}function mr(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function ve(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),d=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},c=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${G(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${Ds(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:f}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${c} aria-label=${c}
        @click=${p=>{p.stopPropagation(),d()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${G("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:f}
  </section>`}function My(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function Ry(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function Fy(e,n){let t=ue[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function Ay(e,n,t){let i=Fy(e,n),a=ue[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${Q("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function Hy(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function Iy(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,d=Math.max(0,l-s.offsetSeconds),c=i[i.length-1];c!==void 0&&c.state.trim().toLowerCase()===s.state.trim().toLowerCase()?c.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${Ry(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function Vn(e,n=wn){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}function Ly(e,n,t){if(!e||n===void 0||!n.averaged)return;let i=t.replace(/^Last\s+/,""),a=/^\d/.test(i)?`all ${i}`:`the whole ${i}`;return`This span has ${n.readings} readings, more than ${Ut}, so they are averaged into ${Ut} even slots to cover ${a}.`}var xr=new Set;function _s(e,n,t=wn){return xr.has(e)||!t.some(i=>i.minutes===n)}function Ms(e,n,t,i,a=wn){let r=_s(e,n,a);return h`<label class="field">${ze("Span",{atDefault:n===t&&!r,title:`Back to ${Vn(t,a)}`,reset:()=>{xr.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(xr.add(e),Me(o.target)):(xr.delete(e),i(Number(s)||Ra))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function Rs(e,n,t=!1){let i=t?lo:Fa,a=Math.floor(i/1440),r=t?Ri:wn,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,d=(c,u,p)=>n(Math.min(i,Math.max(1,Math.round(c)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${ee("Days",o,c=>d(c??0,s,l),{step:1,min:0,max:a})}
      ${ee("Hours",s,c=>d(o,c??0,l),{step:1,min:0,max:23})}
      ${ee("Minutes",l,c=>d(o,s,c??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${Vn(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${Vn(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function _y(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${Vn(e.historyMinutes)}`;let n=Sa.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${Vn(e.historyMinutes,Ri)} \xB7 per ${n.toLowerCase()}`}function Bs(e,n){let t=de(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return nt(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:_e(ke(n.payload.value,t),48)}case"icon":return _e(ke(n.payload.symbol,t),48);case"gauge":return _e(ke(n.payload.value,t),48);case"chart":return _e(`${ke(n.payload.value,t)}${_y(n.payload)}`,48);case"timeline":return _e(`${ke(n.payload.value,t)} \xB7 ${Vn(it(n.payload))}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return $t(n.payload.action);case"chartTimes":{let i=e.config.elements.find(a=>a.payload.id===n.payload.chart);return i?.kind==="chart"||i?.kind==="timeline"?_e(`Times of ${ke(i.payload.value,t)}`,48):"No chart or timeline"}case"imageTime":{let i=e.config.elements.find(a=>a.payload.id===n.payload.image);return i?.kind==="image"?_e(`Time of ${Se(i,t)}`,48):"No picture"}case"chartDots":case"chartGrid":{let i=e.config.elements.find(r=>r.payload.id===n.payload.chart),a=n.kind==="chartDots"?"Dots on":"Grid behind";return i?.kind==="chart"?_e(`${a} ${ke(i.payload.value,t)}`,48):"No chart"}}}function Sr(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Ee(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Ee(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":Ee(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:Ee(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${Ee(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Ee(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Ee(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return;case"chartTimes":return`${e.payload.timeLabelCount<=0?"no":e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt \xB7 ${Ee(e.payload.labelColorHex)}`;case"imageTime":return;case"chartDots":{let n=e.payload;return`${n.dots==="all"?"all":"auto"} \xB7 ${n.size===void 0?"automatic size":`${n.size} pt`} \xB7 ${n.colorHex===void 0?"series colour":Ee(n.colorHex)}`}case"chartGrid":{let n=e.payload;return`${n.lines} ${n.lines===1?"line":"lines"} \xB7 ${n.thickness} pt \xB7 ${Ee(n.colorHex)}`}}}function Yi(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${Rr(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      @input=${be(l=>{let d=Number(l);l.trim()!==""&&Number.isFinite(d)&&s(d)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function zy(e,n,t){let i=n.payload.id,a=`el-${i}`,r=Re(e.config,t,n),o=r.frame,s=(c,u)=>e.update(p=>Ce(p,t,i,{frame:xs(o,c)}),`${a}-${u}-${t}`),l=!Cr(o,Ei)||r.isHidden,d=n.payload.chartAnchor;if(n.kind==="chartDots"||n.kind==="chartGrid"){let c=e.config.elements.find(u=>u.payload.id===n.payload.chart);return ve(e,"placement","Position",h`
      <div class="hint keep">${n.kind==="chartDots"?"Dots sit":"Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${c?h`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${()=>e.selectLayer(c.payload.id)}>Select the chart</button></div>
      </div>`:f}
      ${Ue("Hidden",r.isHidden,u=>e.update(p=>Ce(p,t,i,{isHidden:u})),!1)}`,{color:Z.position,icon:"place",summary:`On the chart \xB7 ${te(t)}`})}return d?.place==="through"?ve(e,"placement","Position",h`
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
      ${Ou(e,n,t)}
      ${o.rotationDegrees!==0?On("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1}):f}
      ${Ue("Hidden",r.isHidden,c=>e.update(u=>Ce(u,t,i,{isHidden:c})),!1)}`,{color:Z.position,icon:"place",summary:`On the chart \xB7 ${te(t)}`}):ve(e,"placement","Position",h`
    ${Ou(e,n,t)}
    ${d===void 0?h`
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${Yi("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
        ${Yi("Y","Top",o.y,c=>s({y:c},"y"),-100,100)}
      </div>
    </div>`:dt(d.at)?f:h`
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${Yi("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
      </div>
    </div>`}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${Yi("W","Width",o.width,c=>s({width:c},"w"),4,200)}
        ${Yi("H","Height",o.height,c=>s({height:c},"h"),4,200)}
      </div>
    </div>
    ${On("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1})}
    ${Ue("Hidden",r.isHidden,c=>e.update(u=>Ce(u,t,i,{isHidden:c})),!1)}
    <div class="hint">${d===void 0?"X, Y, W and H are":"W and H are"} a percent of the face, on the ${te(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.</div>`,{color:Z.position,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${te(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${te(t)} face at half size, unrotated and shown`,reset:()=>e.update(c=>Ce(c,t,i,{frame:{...Ei},isHidden:!1}))}:{}})}function Ou(e,n,t){let i=n.payload.chartAnchor;if(i===void 0)return f;let a=n.payload.id,r=`el-${a}-anchor`,o=e.config.elements.filter(c=>c.kind==="chart"),s=(c,u)=>e.update(p=>{let m=p.elements.find(y=>y.payload.id===a);m?.payload.chartAnchor&&c(m.payload.chartAnchor)},u?`${r}-${u}`:void 0),l=de(e),d=!o.some(c=>c.payload.id===i.layer);return h`
    ${o.length<2?f:xe("Follows",i.layer,o.map(c=>[c.payload.id,Se(c,l)]),c=>s(u=>{u.layer=c}))}
    ${xe("Reading",i.at,Bt,c=>e.update(u=>{let p=u.elements.find(y=>y.payload.id===a);if(!p?.payload.chartAnchor)return;p.payload.chartAnchor.at=c;let m=u.elements.find(y=>y.payload.id===i.layer);m?.kind==="chart"&&(c==="threshold"&&m.payload.thresholdValue===void 0&&(m.payload.thresholdValue=ip(Qe(e.resolve(m.payload.value)??"")),m.payload.drawsThreshold=!1),c==="now"&&m.payload.nowIndex===void 0&&(m.payload.nowIndex={kind:{kind:"time",timeField:"hour"}},m.payload.drawsNowLine=!1))}),{def:"highest"})}
    ${xp(e,i,r)}
    ${i.place==="through"?f:xe("Sits",i.place,Ta.filter(([c])=>c!=="through"),c=>s(u=>{u.place=c}),{def:"above"})}
    <div class="grid2">
      ${i.dx?ee("Nudge X",i.dx,c=>s(u=>{c?u.dx=c:delete u.dx},"dx"),{step:.5,def:0,unit:"pt"}):f}
      ${i.place==="through"&&!i.dy?f:ee("Nudge Y",i.dy??0,c=>s(u=>{c?u.dy=c:delete u.dy},"dy"),{step:.5,def:0,unit:"pt"})}
    </div>
    ${i.place==="through"?f:h`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${()=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===a);u&&delete u.payload.chartAnchor})}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${n.kind==="text"?h`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${()=>e.update(c=>{Fd(c,a)})}><span>Use an icon</span></button>`:f}
      </div>
    </div>`}
    ${d?h`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${i.place==="through"?", or delete the line":", or unpin it"}.</div>`:i.place==="through"?f:h`<div class="hint">This layer follows that reading on the ${te(t)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`}function xp(e,n,t){let i=e.config.elements.find(l=>l.payload.id===n.layer);if(i?.kind!=="chart")return f;let a=i.payload,r=(l,d)=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===n.layer);u?.kind==="chart"&&l(u.payload)},`${t}-${d}`),o=Pe(e.config,n.layer).filter(l=>l.payload.chartAnchor?.at===n.at).length,s=o>1?` ${o} layers follow this ${n.at==="now"?"reading":"threshold"}, and they all move with this number.`:"";return n.at==="threshold"?h`
      <div class="grid2">
        ${ee("Threshold at",a.thresholdValue??0,l=>r(d=>{d.thresholdValue=l??0,d.drawsThreshold=!1},"thval"))}
      </div>
      <div class="hint">${a.scale==="fixed"?"A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${s}</div>`:n.at==="now"?h`
      ${re(e,a.nowIndex??{kind:{kind:"time",timeField:"hour"}},l=>r(d=>{d.nowIndex=l,d.drawsNowLine=!1},"nowidx"),{showResolved:!0,label:"Now is reading",key:`${t}-nowindex`})}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${s}</div>`:n.at==="zero"?h`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`:f}function Ny(e,n){if(n.kind==="tap")return f;let t=n.payload.id,i=Oe(e.config,t)[0];return ve(e,"tappable","Tap",cb(e,n,`el-${t}`),{color:Z.tap,icon:"tap",summary:i?$t(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>Pa(a,t))}:{}})}function Py(e,n,t,i,a){return h`
    ${On("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(Sn,Math.round(r)))},`${i}count`),{min:0,max:Sn,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?f:h`
      <div class="grid2">
        ${ee("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(jt,Math.max(Wt,r??Xe))},`${i}size`),{step:.5,min:Wt,max:jt,def:t.labelSize,unit:"pt"})}
        ${pe("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??Je},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${e.labelsAbove===void 0?f:Q("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      ${Q("Clock",e.hourCycle,fd,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${Q("Minutes",e.minutes,gd,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}`}`}var Dy=[["number","Number"],["entity","Entity"]];function Oy(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function Vy(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function By(e,n,t,i,a){let r=o=>{let s=o==="min",l=s?"Min":"Max",d=Oy(n,o),c=s?n.minValue:n.maxValue,u=g=>a(x=>{s?x.minValue=g??0:x.maxValue=g??100},o),p={number:`${l} is a fixed number`,entity:`${l} reads a number from an entity`},m=h`<div class="gauge-end-head">
      ${ze(l,d==="number"?tn(c,t[o],u):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${l} comes from`}>
        ${Dy.map(([g,x])=>h`<button type="button" role="radio" aria-checked=${g===d?"true":"false"}
          class=${g===d?"on":""} title=${p[g]}
          @click=${()=>{g!==d&&a(k=>Vy(k,o,g))}}>${x}</button>`)}
      </span>
    </div>`,y=s?n.minSource:n.maxSource;return d==="number"||y===void 0?h`<div class="field gauge-end">${m}${Fr(c,u,{ariaLabel:l})}</div>`:h`<div class="field gauge-end">${m}${re(e,y,g=>a(x=>{s?x.minSource=g:x.maxSource=g},`${o}src`),{showResolved:!0,noLabel:!0,label:l,key:`${i}-${o}source`})}</div>
      <div class="hint">If the entity has no number, the gauge uses ${String(c)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${r("min")}${r("max")}</div>`:h`${r("min")}${r("max")}`}function Gy(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(c,u)=>t(p=>{let m={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??oe};c(m),m.bands.length>0?p.bands=m.bands:delete p.bands,m.bandAboveColorHex!==oe?p.bandAboveColorHex=m.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(c,u,p)=>t(m=>{p===void 0||p===u?delete m[c]:m[c]=p},c),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",d=a==="bands"?Qe(e.resolve(n.value)??""):[];return h`
    ${Q("Colour",a,Ls,c=>t(u=>{if(c==="uniform"){delete u.coloring;return}u.coloring=c,(u.bands?.length??0)===0&&(u.bands=kr(Qe(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${$r({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??oe},n.colorSlot.baseColorHex,o,d.length===1?d[0]:void 0)}`:f}
    ${Q("Highlight",r,Yg,c=>t(u=>{c==="none"?delete u.highlight:u.highlight=c}),{def:"none"})}
    ${r==="none"?f:h`
      <div class="grid2">
        ${r==="lowest"?f:pe("Highest colour",n.highColorHex??qe,c=>s("highColorHex",qe,c),!1,qe)}
        ${r==="highest"?f:pe("Lowest colour",n.lowColorHex??Ye,c=>s("lowColorHex",Ye,c),!1,Ye)}
      </div>
      ${a==="bands"?f:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}`}var Ji=new Map,Xi=new Map,Mt=new Map,fr=new Map,Fs=4,As=40,Uy=[["layer","Layer"],["pick","Pick"],["bands","By value"]],Ky=[["plain","Plain"],["rich","Rich"]],Wy={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size"};function Gs(e,n,t,i){let a=t!==void 0&&e.canCountDown(t);return!n&&!a?f:h`${Ue("Count down",n,i)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${n&&!a?h`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>`:f}`}function jy(e){return e.countdown===!0?"countdown":nt(e)?"rich":"plain"}function qy(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function Yy(e,n){let t=vn(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:_e(e.kind.value,40)||"template"}:{kind:"value",label:ea(e,n)}}function vp(e,n,t){let i=vn(e.value),a=i===void 0?_e(ea(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${_e(i,24)}"`;return`Part ${n+1}: ${a}`}function Xy(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,vp(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function zs(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function Jy(e,n){if(zs(e)==="bands"&&(e.bands?.length??0)>0){let t=[...Gt({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??oe],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function Vu(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${Lr(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var Zy={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function Qy(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${Lr(e.moved.map(n=>Zy[n]))} moved into Look.`}function eb(e,n,t,i,a){let r=n.payload,o=r.id,s=jy(r),l=(r.parts?.length??0)>0,d=wo(e.config,r.value),c=Mt.get(o),u=c&&c.rich===l?c:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?Xi.get(o):void 0,m=(x,k)=>{let C=!(r.parts??[]).every(S=>S.value.kind.kind==="literal"),$=ur(structuredClone(r),e.config.values);if(Xi.delete(o),!$.ok){Mt.set(o,{text:Vu($.blocked),rich:!0,warn:!0}),Me(k);return}Mt.set(o,{text:Qy($.joined?{joined:!0,template:C}:$),rich:!1}),i(S=>{ur(S,e.config.values),x==="countdown"&&(S.countdown=!0)})},y=(x,k)=>{if(Xi.delete(o),s==="rich"){let C=x==="countdown"?"countdown":"plain",$=r.parts??[];if($.length<2){m(C,k);return}let S=$s($,e.config.values);S.ok?(Mt.delete(o),Xi.set(o,C)):Mt.set(o,{text:Vu(S.blocked),rich:!0,warn:!0}),Me(k);return}if(x==="rich"){let C=r.parts?.[0]?.id??X();Ji.set(o,C),Mt.delete(o),i($=>{delete $.countdown,Mu($,C)});return}Mt.delete(o),i(C=>{if(x==="countdown"){C.countdown=!0;return}(C.parts?.length??0)>0&&ur(C,e.config.values),delete C.countdown})},g=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${Q("Type",s==="rich"?"rich":"plain",Ky,y,{titles:Wy})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
    ${p===void 0?f:h`<div class="rich-confirm" role="alertdialog" aria-label=${g}>
        <b>${g}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(x=>x.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${x=>m(p,x.currentTarget)}>Switch</button>
          <button class="small" @click=${x=>{Xi.delete(o),Me(x.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:f}
    ${s==="rich"?tb(e,n,t,i,a):h`
        ${bp(e,n,a)}
        ${re(e,r.value,x=>i(k=>{k.value=x},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${Gs(e,s==="countdown",r.value,x=>y(x?"countdown":"plain",null))}
        ${d?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(d.payload.id)}>${Se(d,de(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}`}`}function tb(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=de(e),d=Math.max(0,o.findIndex(z=>z.id===Ji.get(s))),c=o[d],u=o.length,p=r.colorSlot.baseColorHex,m=Re(e.config,t,n).size??r.fontSize,y=(z,b)=>{Mt.delete(s),i(v=>{z(v),ld(v)},b)},g=(z,b)=>y(v=>{let E=v.parts?.find(T=>T.id===c.id);E&&z(E)},b?`part-${c.id}-${b}`:void 0),x=(z,b)=>{Ji.set(s,z),Mt.delete(s),Me(b)},k=(z,b)=>{let v=X();Ji.set(s,v),y(E=>{(E.parts??=[]).push({id:v,value:z})}),rp(b,Hr(`${a}-part-${v}`),!0)},C=z=>y(b=>{b.parts&&Qi(b.parts,d,z)}),$=()=>{let z=o[d+1]??o[d-1];z&&Ji.set(s,z.id),y(b=>{b.parts=(b.parts??[]).filter(v=>v.id!==c.id)})},S=o.map((z,b)=>{let v=Yy(z.value,l),E=z.id===c.id,T=zs(z),F=v.kind==="value"?e.resolve(z.value):void 0,O=z.fontWeight===void 0?void 0:ui.find(([K])=>K===z.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${E?"true":"false"} class="part-chip ${v.kind} ${E?"on":""}"
      aria-label=${vp(z,b,l)} @click=${K=>x(z.id,K.currentTarget)}>
      <span class="part-dot" style=${`background:${Jy(z,p)}`}
        title=${T==="bands"?"By value, with its own bands":T==="pick"?"Its own colour":"The layer colour"}></span>
      ${v.kind==="text"?h`<span class="part-txt">${v.label===""?h`<span class="part-empty">empty</span>`:qy(v.label).map(K=>K.space?h`<span class="part-sp">${"\xB7".repeat(K.text.length)}</span>`:K.text)}</span>`:h`<span class="part-txt">${v.label}</span>`}
      ${F===void 0?f:h`<span class="part-now">${F}</span>`}
      ${O===void 0?f:h`<span class="part-flag" title="Its own weight">${O}</span>`}
      ${z.fontSize===void 0?f:h`<span class="part-flag" title="Its own font size">${z.fontSize} pt</span>`}
    </button>`}),L=r.rules.some(z=>z.partId===c.id),_=c.value.kind.kind==="literal",H=zs(c),J=c.fontSize!==void 0,R=ui.find(([z])=>z===r.fontWeight)?.[1]??r.fontWeight,A=z=>{z>=Fs&&z<=As&&g(b=>{b.fontSize=z},"size")},j=H==="bands"?Qe(e.resolve(c.value)??""):[],U={layer:"Use the layer colour",..._&&H!=="bands"?{bands:"By value needs a live value"}:{}},ne=(z,b)=>g(v=>{let E={bands:v.bands??[],bandAboveColorHex:v.bandAboveColorHex??oe};z(E),E.bands.length>0?v.bands=E.bands:delete v.bands,E.bandAboveColorHex!==oe?v.bandAboveColorHex=E.bandAboveColorHex:delete v.bandAboveColorHex},b);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${S}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${z=>k(I(""),z.currentTarget)}>${G("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${z=>k({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},z.currentTarget)}>${G("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${d+1}</b> of ${u} · ${_?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${d===0} @click=${()=>C(d-1)}>${G("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${d===u-1} @click=${()=>C(d+1)}>${G("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||L}
          title=${u===1?"A rich text layer keeps at least one part":L?"A state changes this part":"Remove this part"}
          @click=${$}>${G("delete")}</button>
      </div>
      ${L&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:f}
      ${re(e,c.value,z=>g(b=>{b.value=z},"value"),{showResolved:!0,label:_?"Text":"Shows",key:`${a}-part-${c.id}`})}
      ${_?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:f}
      ${Q("Colour",H,Uy,z=>g(b=>{if(z==="layer"){delete b.colorHex,delete b.coloring;return}if(z==="pick"){delete b.coloring,b.colorHex=Os(p,"#FFFFFF")?"#64D2FF":p;return}delete b.colorHex,b.coloring="bands",(b.bands?.length??0)===0&&(b.bands=kr(Qe(e.resolve(b.value)??"")))}),{def:"layer",titles:U,..._&&H!=="bands"?{disabled:{bands:!0}}:{}})}
      ${H==="pick"?pe("Part colour",c.colorHex,z=>g(b=>{b.colorHex=z??p},"color")):f}
      ${H==="bands"?h`
        ${$r({bands:c.bands??[],bandAboveColorHex:c.bandAboveColorHex??oe},c.colorHex??p,ne,j.length===1?j[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:f}
      <div class="field seg-field">${ze("Weight",c.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${R})`,reset:()=>g(z=>{delete z.fontWeight})})}
        ${vr("Weight",c.fontWeight,ui,z=>g(b=>{b.fontWeight=z}),{inherited:r.fontWeight})}
      </div>
      <label class="field num part-size">${ze("Font size",J?{atDefault:!1,title:`Back to the layer size (${m} pt)`,reset:()=>g(z=>{delete z.fontSize})}:void 0,Rr(c.fontSize??m,A,{step:1,min:Fs,max:As}))}
        ${Fr(c.fontSize,z=>{z===void 0?g(b=>{delete b.fontSize},"size"):A(z)},{step:1,min:Fs,max:As,optional:!0,unit:"pt",placeholder:String(m),ariaLabel:J?"Part font size":`Part font size, ${m} pt from the layer`,...J?{}:{lead:G("link")}})}
      </label>
    </div>
  </div>`}function wp(e,n,t,i={}){let a=n.payload.id,r=e.config.elements.findIndex(b=>b.payload.id===a),o=`el-${a}`,s=(b,v)=>e.update(E=>b(E.elements[r]),v?`${o}-${v}`:void 0),l=Re(e.config,t,n),d=l.frame,c=(b,v)=>e.update(E=>Ce(E,t,a,{frame:xs(d,b)}),`${o}-${v}-${t}`),u=we(n.kind).payload,p=u.colorSlot?.baseColorHex??"#FFFFFF",m=b=>u[b],y=!1,g=b=>Dn(n)===void 0?f:pe(b,Dn(n),v=>s(E=>{Dn(E)!==void 0&&(E.payload.colorSlot.baseColorHex=v??"#FFFFFF")},"color"),!1,p),x,k,C;switch(n.kind){case"text":{let b=(v,E)=>s(T=>v(T.payload),E);k=eb(e,n,t,b,o),y=!n.payload.countdown&&!nt(n.payload),C=h`
        ${en(e,n,t,"Font size",{step:1,min:4,def:m("fontSize")})}
        ${Q("Weight",n.payload.fontWeight,ui,v=>s(E=>{E.payload.fontWeight=v}),{def:u.fontWeight})}
        ${Fg({label:"Align",value:n.payload.alignment??"center",options:$y,def:"center",set:v=>s(E=>{let T=E.payload;v==="center"?delete T.alignment:T.alignment=v})},{label:"Lines",value:n.payload.lineLimit===2?"2":"1",options:Cy,def:"1",set:v=>s(E=>{let T=E.payload;v==="2"?T.lineLimit=2:delete T.lineLimit})})}
        ${Ue("Mono digits",n.payload.monospacedDigits===!0,v=>s(E=>{let T=E.payload;v?T.monospacedDigits=!0:delete T.monospacedDigits}),u.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:f}
        ${y?Gy(e,n.payload,b,g("Main colour")):f}`;break}case"icon":k=h`
        ${re(e,n.payload.symbol,b=>s(v=>{v.payload.symbol=b},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${o}-symbol`,setSymbolPath:b=>s(v=>{let E=v.payload;b?E.path=b:delete E.path},"symbol")})}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`,C=en(e,n,t,"Icon size",{step:1,min:4,def:m("size")});break;case"gauge":{let b=n.payload,v=(T,F)=>s(O=>T(O.payload),F),E=b.style==="dots";k=h`
        ${re(e,b.value,T=>v(F=>{F.value=T},"value"),{showResolved:!0,label:"Reading",key:`${o}-value`})}
        ${E?h`
            ${re(e,b.total??_u(b),T=>v(F=>{F.total=T},"total"),{showResolved:!0,label:"Total",key:`${o}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${Ea} dots are drawn.</div>`:By(e,b,{min:u.minValue,max:u.maxValue},o,v)}`,y=!0,C=h`
        <div class="grid2">
          ${Q("Style",b.style,ty,T=>v(F=>{T==="dots"&&F.total===void 0&&(F.total=_u(F)),T!=="dots"&&delete F.total,F.style=T}),{titles:ny,def:u.style})}
          ${E?f:en(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        ${pe(E?"Empty dot colour":"Track colour",b.trackColorHex,T=>v(F=>{F.trackColorHex=T??"#FFFFFF40"},"track"),!1,u.trackColorHex)}
        ${Q("Colour",b.coloring,Ls,T=>v(F=>{F.coloring=T,T==="bands"&&F.bands.length===0&&(F.bands=kr([F.minValue,F.maxValue]))}),{def:u.coloring})}
        ${g("Main colour")}
        ${b.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${$r(b,b.colorSlot.baseColorHex,v,Qe(e.resolve(b.value)??"")[0])}`:f}
        ${E?f:h`
          <div class="grid2">
            ${ee("Threshold",b.thresholdValue,T=>v(F=>{T===void 0?delete F.thresholdValue:F.thresholdValue=T},"thr"),{optional:!0})}
            ${b.thresholdValue===void 0?f:pe("Threshold colour",b.thresholdColorHex,T=>v(F=>{F.thresholdColorHex=T??Xn},"thrcol"),!1,Xn)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>`}`;break}case"chart":{let b=n.payload,v=(M,D)=>s(Fe=>M(Fe.payload),D),E=u.historyMinutes,T=u.historyPoints,F=b.historyMinutes>0,O=F&&b.source==="statistics",K=F&&!O,se=F?O?"statistics":"history":"value",Ke=O?Ri:wn,At=$n(b)??Cn(b),Ie=b.value.kind.kind==="entityState",he=At===void 0?void 0:e.historySeries(At),Ne=F&&Ie?he??"":e.resolve(b.value)??"",We=b.historyPoints<1,oh=K&&Ie&&At!==void 0?e.historyReadings?.(At):void 0,rl=Ly(We,oh,Vn(b.historyMinutes)),ol=_s(a,b.historyMinutes,Ke),Nr=F&&Ie?Yo(Ne):{values:Qe(Ne),holes:[]},Kn=Nr.values,sl=M=>b.limit>0&&M.length>b.limit?b.takeFromEnd?M.slice(M.length-b.limit):M.slice(0,b.limit):M,sh=sl(Kn),Ht=Xo(sh,tt(b.smoothing),Nr.holes.length>0?sl(Nr.holes):[]),lh=!F&&Ie&&Kn.length===1,Pr=e.config.elements.filter(M=>M.kind==="chart"&&M.payload.id!==a),dh=de(e),ia=b.scaleFrom!==void 0&&Pr.some(M=>M.payload.id===b.scaleFrom);k=h`
        ${re(e,b.value,M=>v(D=>{D.value=M},"value"),{label:"Readings",noShare:!0,key:`${o}-value`})}
        ${Q("Draw",se,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],M=>v(D=>{if(M==="value"){D.historyMinutes=0;return}D.source=M==="statistics"?"statistics":"history";let Fe=D.historyMinutes||Ra;D.historyMinutes=M==="statistics"?Math.min(Fe,lo):Math.min(Fe,Fa)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:u.historyMinutes>0?"history":"value"})}
        ${O?h`
            ${Ie?f:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Ms(a,b.historyMinutes,E,M=>v(D=>{D.historyMinutes=M}),Ri)}
              ${Q("Per",b.statPeriod,Sa,M=>v(D=>{D.statPeriod=M}),{def:Si})}
            </div>
            ${ol?Rs(b.historyMinutes,M=>v(D=>{D.historyMinutes=M},"span"),!0):f}
            ${Q("Read",b.statType,no,M=>v(D=>{D.statType=M}),{def:Ti})}
            <div class="hint">One bar per period, oldest first, newest ${Ut} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${b.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:f}
            ${Ie&&he===void 0?h`<div class="hint keep">Reading the statistics…</div>`:f}
            ${Ie&&he===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:f}`:f}
        ${K?h`
            ${Ie?f:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Ms(a,b.historyMinutes,E,M=>v(D=>{D.historyMinutes=M}))}
              <div class="field readings-field">${ze("Points",{atDefault:b.historyPoints===T,title:`Back to ${T<1?"every one":`${T} averaged`}`,reset:()=>v(M=>{M.historyPoints=T})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${We?"false":"true"} class=${We?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{We&&v(M=>{M.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${We?"true":"false"} class=${We?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{We||v(M=>{M.historyPoints=uo})}}>Every one</button>
                  </div>
                  ${We?f:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(b.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${co} max=${Ut}
                      @input=${be(M=>{let D=Number(M);M.trim()!==""&&Number.isFinite(D)&&D>=1&&v(Fe=>{Fe.historyPoints=Math.round(D)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${ol?Rs(b.historyMinutes,M=>v(D=>{D.historyMinutes=M},"span")):f}
            <div class="hint">${We?h`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${Ut} readings is averaged into
                  ${Ut} even slots instead, so the chart still covers all of it.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${rl===void 0?f:h`<div class="hint keep">${rl}</div>`}
            ${Ie&&he===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
            ${Ie&&he===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:f}
        ${F?h`
            ${Ue("Show gaps when unavailable",b.gaps===!0,M=>v(D=>{M?D.gaps=!0:delete D.gaps}),u.gaps===!0)}
            ${Qt(e)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`:f}
        ${F?f:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${Kn.length===0&&!(F&&(!Ie||he===void 0||he===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${Kn.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${My(Ht)}</span>${Kn.length===Ht.length?h` · ${Ht.length} ${Ht.length===1?"value":"values"}`:h` · ${Ht.length} of ${Kn.length}`}</span></div>`:f}
        ${lh?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:f}
        ${F&&b.limit<=0?f:h`
        <div class="grid2">
          ${ee("Only draw",b.limit,M=>v(D=>{D.limit=Math.max(0,Math.round(M??0))},"limit"),{step:1,min:0,def:u.limit,unit:"readings"})}
          ${b.limit<=0?f:Q("Keep",b.takeFromEnd?"end":"start",F?[["start","Oldest"],["end","Newest"]]:[["start","First"],["end","Last"]],M=>v(D=>{D.takeFromEnd=M==="end"}),{def:u.takeFromEnd===!0?"end":"start"})}
        </div>
        ${F?h`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${b.limit} of the readings fetched above, while clock times still label the whole span.</div>`:h`<div class="hint">${b.limit<=0?"0 draws every reading. Type a number to draw only that many.":`Draws only ${b.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${xe("Smooth data",tt(b.smoothing)??"off",Wg,M=>v(D=>{let Fe=tt(M);Fe===void 0?delete D.smoothing:D.smoothing=Fe}),{def:tt(u.smoothing)??"off"})}
        ${Qt(e)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`,y=!0;let ch=(()=>{if(ia)return!0;if(b.scale==="fixed")return b.minValue<0&&b.maxValue>0;let M=Ht.filter(aa=>Number.isFinite(aa));if(M.length===0)return!0;let D=Math.min(...M,b.thresholdValue??1/0),Fe=Math.max(...M,b.thresholdValue??-1/0);return D<0&&Fe>0})();C=h`
        <div class="grid2">
          ${Q("Style",b.style,np,M=>v(D=>{D.style=M}),{def:u.style})}
          ${b.style==="bars"?ee("Bar gap",b.barGap,M=>v(D=>{D.barGap=Math.max(0,M??0)},"gap"),{step:.5,min:0,def:u.barGap,unit:"pt"}):en(e,n,t,"Line width",{step:.5,min:.5,def:m("lineWidth")})}
        </div>
        ${b.style==="bars"?h`
          <div class="grid2">
            ${ee("Corner radius",Pt(b.barRadius),M=>v(D=>{let Fe=Math.max(0,M??Yn);Fe===Yn?delete D.barRadius:D.barRadius=Fe},"barradius"),{step:.5,min:0,def:Pt(u.barRadius),unit:"pt"})}
          </div>
          ${Ue("Round top only",Dt(b.barCorners)==="top",M=>v(D=>{M?D.barCorners="top":delete D.barCorners}),Dt(u.barCorners)==="top")}
          ${Qt(e)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>`:h`
          ${Q("Curve",b.curve??"straight",Ug,M=>v(D=>{M==="straight"?delete D.curve:D.curve=M}),{titles:{straight:"A straight line from each reading to the next",smooth:"A smooth line that never rises past the highest reading or dips under the lowest",step:"Each reading holds flat until the next one, the way a state does"},def:u.curve??"straight"})}
          ${Qt(e)}
          ${b.style==="area"?h`
            ${Q("Fill",Nt(b.fillStyle),Kg,M=>v(D=>{M==="flat"?delete D.fillStyle:D.fillStyle=M}),{titles:{flat:"One even wash under the line",fade:"Strongest at the top of the plot, fading to clear at the baseline"},def:Nt(u.fillStyle)})}
            ${Is("Fill colour",b.fillColorHex,"Line colour",M=>v(D=>{M===void 0?delete D.fillColorHex:D.fillColorHex=M},"fillcol"))}
            ${Qt(e)}`:f}`}
        <div class="grid2">
          ${Q("Scale",b.scale,jg,M=>v(D=>{D.scale=M}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:u.scale})}
          ${Q("Baseline",b.baseline,qg,M=>v(D=>{D.baseline=M}),{def:u.baseline})}
        </div>
        ${Pr.length===0?f:xe("Same scale as",ia?b.scaleFrom:"",[["","Its own"],...Pr.map(M=>[M.payload.id,Se(M,dh)])],M=>v(D=>{M?D.scaleFrom=M:delete D.scaleFrom}),{def:""})}
        ${ia?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:f}
        ${!ia&&b.scale==="fixed"?h`<div class="grid2">
              ${ee("Min",b.minValue,M=>v(D=>{D.minValue=M??0},"cmin"),{def:u.minValue})}
              ${ee("Max",b.maxValue,M=>v(D=>{D.maxValue=M??100},"cmax"),{def:u.maxValue})}
            </div>`:f}
        <div class="hint">${b.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let M;e.update(D=>{M=Ud(D,a)}),M&&e.selectLayer(M)}}>${G("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        ${Q("Colour",b.coloring,Ls,M=>v(D=>{D.coloring=M,M==="bands"&&D.bands.length===0&&(D.bands=kr(Ht))}),{def:u.coloring})}
        ${g("Main colour")}
        ${b.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${b.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${$r(b,b.colorSlot.baseColorHex,v)}
          ${b.style==="area"?h`${Ue("Band fill",b.fillBands,M=>v(D=>{D.fillBands=M}),u.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}`;let ll=M=>Pe(e.config,a).some(D=>D.payload.chartAnchor?.at===M),uh=Yt(e.config,a).length>0,ph=Mn(e.config,a).length>0,hh=Rn(e.config,a).length>0,dl=Id(e.config,a).length>0,mh=kn(b)?void 0:We&&K?"Clock times need evenly spaced readings: set Points to Average":"Clock times need a recorded span: set Draw to Recorded history",fh=b.style==="bars"?"Dots sit on a line or area chart: set Style to Line or Area":void 0,Wn=(M,D,Fe,aa)=>h`
        <button class="small ${D?"on":""}" ?disabled=${D||aa!==void 0} aria-pressed=${D?"true":"false"}
          title=${D?`${M} is on this chart. Remove it in the list at the bottom.`:aa??`Add ${M.toLowerCase()} to this chart`}
          @click=${()=>e.update(gh=>{Fe(gh)})}>${D?h`<span aria-hidden="true">✓</span>`:G("plus")}<span>${M}</span></button>`;x=h`
        <div class="field list-field"><span>Draw</span>
          <div class="adders">
            ${Wn("Threshold line",ll("threshold"),M=>Ld(M,a,b.thresholdValue??ip(Ht)))}
            ${Wn("Now line",ll("now"),M=>_d(M,a,!0))}
            ${Wn("Zero line",dl,M=>{Mo(M,a)})}
            ${Wn("Clock times",uh,M=>{En(M,a)},mh)}
            ${Wn("Dots",ph,M=>{To(M,a)},fh)}
            ${Wn("Grid lines",hh,M=>{Eo(M,a)})}
          </div>
        </div>
        ${dl&&!ch?h`<div class="hint warn">These readings never go below zero, or never above it, so the zero
              line is not drawn.</div>`:f}
        <div class="hint">Each button adds a layer to this chart, listed at the bottom. Click it there to set its
          value, colour, size and the rest: where the threshold sits and which reading is now are set on
          those lines.</div>
        ${Qt(e)}`;break}case"timeline":{let b=n.payload,v=(he,Ne)=>s(We=>he(We.payload),Ne),E=u.historyMinutes,T=b.value.kind.kind==="entityState",F=ct(b),O=F===void 0?void 0:e.historySeries(F),K=it(b)*60,se=Oi(O??"",qt),Ke=_s(a,b.historyMinutes),At=b.value.kind.kind==="entityState"?b.value.kind.entityId:void 0,Ie=Qg(se,K,At===void 0?void 0:e.hass.states[At]?.state,At?.split(".")[0]);k=h`
        ${re(e,b.value,he=>v(Ne=>{Ne.value=he},"value"),{label:"States",noShare:!0,key:`${o}-value`})}
        ${T?f:h`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        ${Ms(a,b.historyMinutes,E,he=>v(Ne=>{Ne.historyMinutes=he}))}
        ${Ke?Rs(b.historyMinutes,he=>v(Ne=>{Ne.historyMinutes=he},"span")):f}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${qt} changes are drawn, and a
          busier span keeps its newest.</div>
        ${T&&O===void 0?h`<div class="hint keep">Reading the history…</div>`:f}
        ${T&&O===""?h`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:f}
        ${se.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${Iy(se,K)}</span></span></div>`:f}
        ${Hy(se)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:f}`,C=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${ey(b,v,Ie,`wa-tl-states-${o.replace(/[^a-z0-9]/gi,"")}`)}
        ${Ie.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${Ie.filter(he=>he!=="unavailable"&&he!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:f}
        <div class="grid2">
          ${ee("Gap",b.gap,he=>v(Ne=>{Ne.gap=Math.min(Aa,Math.max(0,he??0))},"tgap"),{step:.5,min:0,max:Aa,def:u.gap,unit:"pt"})}
          ${ee("Corner radius",b.cornerRadius,he=>v(Ne=>{Ne.cornerRadius=Math.max(0,he??0)},"tradius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
`;break}case"shape":k=h`<div class="grid2">
          ${Q("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],b=>s(v=>{v.payload.kind=b}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:u.kind})}
          ${n.payload.kind==="roundedRectangle"?ee("Corner radius",n.payload.cornerRadius,b=>s(v=>{v.payload.cornerRadius=b??6},"radius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"}):f}
        </div>
        ${n.payload.kind==="line"?Ay(t,d,c):f}`,C=n.payload.kind==="line"?ee("Thickness",n.payload.thickness,b=>s(v=>{v.payload.thickness=b??1},"thick"),{step:.5,min:.5,def:u.thickness,unit:"pt"}):h`
        ${pe("Border colour",n.payload.borderColorHex,b=>s(v=>{b===void 0?delete v.payload.borderColorHex:v.payload.borderColorHex=b},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ee("Border width",n.payload.borderWidth,b=>s(v=>{v.payload.borderWidth=b??1},"bw"),{step:.5,min:0,def:u.borderWidth,unit:"pt"}):f}`;break;case"image":{let b=n.payload,v=(O,K)=>s(se=>O(se.payload),K),E=b.entity.entityId?e.hass.states[b.entity.entityId]?.attributes?.entity_picture:void 0,T=typeof E=="string"?E:void 0,F=T!==void 0&&!T.startsWith("/");k=h`
        ${Q("Source",b.source,[["camera","Camera"],["entityPicture","Entity picture"]],O=>v(K=>{K.source=O}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:u.source})}
        ${b.source==="camera"?h`
            ${b.entity.entityId&&!b.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:f}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${b.entity.entityId&&T===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:f}
            ${F?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:f}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,C=h`
        ${Q("Picture",b.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],O=>v(K=>{K.contentMode=O}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:u.contentMode})}
        ${On("Zoom",b.zoom,O=>v(K=>{K.zoom=O},"zoom"),{min:os,max:4,step:.05,def:1,format:O=>`${O.toFixed(2)}x`,unit:"x"})}
        ${On("Pan left/right",b.panX,O=>v(K=>{K.panX=O},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${On("Pan up/down",b.panY,O=>v(K=>{K.panY=O},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${b.contentMode==="fit"&&b.zoom===1?"hint keep":"hint"}>${Ey(b)}</div>
        ${ee("Corner radius",b.cornerRadius,O=>v(K=>{K.cornerRadius=Math.max(0,O??Jn)},"imgradius"),{step:1,min:0,def:Jn,unit:"pt"})}`;break}case"tap":{k=h`
        ${Us(e,n.payload,(b,v)=>s(E=>b(E.payload),v),o)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}case"chartTimes":{let b=n.payload,v=(O,K)=>s(se=>O(se.payload),K),E=e.config.elements.find(O=>O.payload.id===b.chart),T=E?.kind==="chart"||E?.kind==="timeline"?E:void 0,F=T?.kind==="timeline"?"timeline":"chart";k=h`
        <div class="field readout"><span>${T?.kind==="timeline"?"Timeline":"Chart"}</span><span class="readout-v">${T?h`<button class="small" title=${`Select that ${F}`} @click=${()=>e.selectLayer(T.payload.id)}>${Se(T,de(e))}</button>`:"None"}</span></div>
        ${T===void 0?h`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`:T.kind==="timeline"?ct(T.payload)===void 0?h`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`:f:kn(T.payload)?f:h`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${F}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`,C=Py(b,v,u,"ct",h`
        <div class="hint">Evenly spaced from the start of the ${F}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);break}case"imageTime":{let b=n.payload,v=e.config.elements.find(T=>T.payload.id===b.image),E=v?.kind==="image"?v:void 0;k=h`
        <div class="field readout"><span>Picture</span><span class="readout-v">${E?h`<button class="small" title="Select that picture" @click=${()=>e.selectLayer(E.payload.id)}>${Se(E,de(e))}</button>`:"None"}</span></div>
        ${E===void 0?h`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`:f}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;break}case"chartDots":{let b=n.payload,v=(K,se)=>s(Ke=>K(Ke.payload),se),E=e.config.elements.find(K=>K.payload.id===b.chart),T=E?.kind==="chart"?E:void 0,F=T===void 0?void 0:Re(e.config,t,T).size??T.payload.lineWidth,O=F===void 0?void 0:Math.round(F*18)/10;k=h`
        ${Bu(e,T)}
        ${T===void 0?h`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`:T.payload.style==="bars"?h`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`:f}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${Qt(e)}`,C=h`
        ${Q("Dots",b.dots,tp,K=>v(se=>{se.dots=K}),{titles:{auto:"A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",all:"A dot on every reading"},def:"auto"})}
        <div class="grid2">
          ${ee("Dot size",b.size??O,K=>v(se=>{let Ke=st(K);Ke===void 0||Ke===O?delete se.size:se.size=Ke},"dotsize"),{step:.5,min:1,max:12,...O===void 0?{}:{def:O},unit:"pt"})}
          ${Is("Dot colour",b.colorHex,"Series colour",K=>v(se=>{K===void 0?delete se.colorHex:se.colorHex=K},"dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;break}case"chartGrid":{let b=n.payload,v=(F,O)=>s(K=>F(K.payload),O),E=e.config.elements.find(F=>F.payload.id===b.chart),T=E?.kind==="chart"?E:void 0;k=h`
        ${Bu(e,T)}
        ${T===void 0?h`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`:f}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${Qt(e)}`,C=h`
        <div class="grid2">
          ${ee("Lines",b.lines,F=>v(O=>{O.lines=yn(F??Vt)},"lines"),{step:1,min:1,max:4,def:Vt})}
          ${ee("Thickness",b.thickness,F=>v(O=>{O.thickness=bn(F??Ot)},"thick"),{step:.25,min:$a,max:Ca,def:Ot,unit:"pt"})}
        </div>
        ${pe("Colour",b.colorHex,F=>v(O=>{O.colorHex=F??kt},"gridcol"),!1,kt)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;break}}let $=y||Dn(n)===void 0?void 0:g(n.kind==="shape"?"Fill colour":n.kind==="text"&&nt(n.payload)?"Layer colour":"Colour"),S=Ho(e.config,n),L=S?{kind:{kind:"entityState",...S}}:void 0,_=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,H=ib[n.kind],J=ab[n.kind],R=Es(n.payload,u,H),A=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,j=e.config.perFamily[t]?.placements[a]?.size!==void 0,U=Es(n.payload,u,J)||A!==void 0&&l.size!==void 0&&l.size!==u[A],ne=Tn(e.config,a),z=(b,v)=>()=>s(E=>mr(E.payload,u,b),v);return h`
    ${ve(e,"content","Content",h`${n.kind==="tap"||n.kind==="text"||n.kind==="chartTimes"||n.kind==="chartDots"||n.kind==="chartGrid"||n.kind==="imageTime"?f:bp(e,n,o)}${k}`,{color:Z.content,icon:"content",summary:Bs(e,n),...R?{reset:()=>s(b=>{mr(b.payload,u,H),b.kind==="text"&&ji(b.payload.rules)},"reset-content")}:{}})}
    ${C===void 0&&$===void 0?f:ve(e,"look",n.kind==="image"?"Picture":"Look",h`${C??f}${$??f}`,{color:Z.look,icon:n.kind==="image"?"image":"look",...Sr(n)?{summary:Sr(n)}:{},...U?{reset:()=>e.update(b=>{mr(b.elements[r].payload,u,J),j&&Ce(b,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?ve(e,"numbers","Extras",lb(e,n,x),{color:Z.numbers,icon:"text",summary:sb(e,n),...ne.length>0||Pe(e.config,a).length>0||Yt(e.config,a).length>0||Mn(e.config,a).length>0||Rn(e.config,a).length>0||Es(n.payload,u,Gu)?{reset:()=>e.update(b=>{for(let E of Tn(b,a))fe(b,E.payload.id);for(let E of Pe(b,a))fe(b,E.payload.id);for(let E of Yt(b,a))fe(b,E.payload.id);for(let E of Mn(b,a))fe(b,E.payload.id);for(let E of Rn(b,a))fe(b,E.payload.id);let v=b.elements.find(E=>E.payload.id===a);v&&mr(v.payload,u,Gu)})}:{}}):f}
    ${n.kind==="timeline"||n.kind==="image"?nb(e,n):f}
    ${ve(e,"states","States",Rp(e,n.payload.rules,n.kind,b=>b.elements.find(v=>v.payload.id===a)?.payload.rules,`rules-${a}`,L,_),{color:Z.states,icon:"states",summary:Ui(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>s(b=>{b.payload.rules=[]})}:{}})}
    ${i.placement===!1?f:zy(e,n,t)}
    ${i.tap===!1?f:Ny(e,n)}`}function nb(e,n){let t=n.payload.id,i=n.kind==="timeline",a=i?Yt(e.config,t):Co(e.config,t),r=i?"Clock times":"Timestamp",o=e.activeFamily,s=()=>e.update(u=>{let p=u.elements.find(y=>y.payload.id===t);if(!p)return;let m=p.payload.frame;p.payload.frame={...Re(u,o,p).frame},i?En(u,t):So(u,t,ue[o==="inline"?"rectangular":o]),p.payload.frame=m}),l=a.length>0,d=a.map(u=>({el:u,lead:G("clock"),title:r,kind:i?"Times":"Timestamp"})),c=h`
    <div class="field list-field"><span>Draw</span>
      <div class="adders">
        <button class="small ${l?"on":""}" ?disabled=${l} aria-pressed=${l?"true":"false"}
          title=${l?`${r} is on this ${i?"timeline":"picture"}. Remove it in the list below.`:`Add ${r.toLowerCase()}`}
          @click=${s}>${l?h`<span aria-hidden="true">✓</span>`:G("plus")}<span>${r}</span></button>
      </div>
    </div>
    <div class="hint">${i?"Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or colour.":"Adds the time the picture was fetched as its own layer in its group, so you can drag it anywhere, inside the picture or beside it."}</div>
    ${l?h`
      ${Ks(e,d,{icon:"close",danger:!0,label:u=>`Delete this ${u}`,run:u=>e.update(p=>fe(p,u))})}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>`:f}`;return ve(e,"numbers","Extras",c,{color:Z.numbers,icon:"clock",summary:l?`${r} layer`:"None yet",...l?{reset:()=>e.update(u=>{for(let p of a)fe(u,p.payload.id)})}:{}})}var ib={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"],chartTimes:[],chartDots:[],chartGrid:[],imageTime:[]},ab={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","coloring","bands","bandAboveColorHex","fillBands","curve","fillStyle","fillColorHex","barRadius","barCorners","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius"],shape:["colorSlot","borderColorHex","borderWidth","thickness"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[],chartTimes:["timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["dots","size","colorHex"],chartGrid:["lines","colorHex","thickness"],imageTime:[]};function Bu(e,n){return h`<div class="field readout"><span>Chart</span><span class="readout-v">${n?h`<button class="small" title="Select that chart" @click=${()=>e.selectLayer(n.payload.id)}>${Se(n,de(e))}</button>`:"None"}</span></div>`}var Gu=["highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"];function Us(e,n,t,i){let a=n.action;return h`
    ${xe("Tap action",a.type,gy,r=>t(o=>{o.action=cp(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?gt(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="callService"?up(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):f}
    ${a.type==="openPage"?hp(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):f}`}var rb=24;function ob(e,n){let t=[],i=1/0;for(let r of ae){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Bd(e.config,n,r);o&&(t.push(`${te(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return f;let a=i<rb;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:f}`}function sb(e,n){let t=n.payload,i=Tn(e.config,t.id),a=Pe(e.config,t.id),r=Yt(e.config,t.id),o=Mn(e.config,t.id),s=Rn(e.config,t.id);if(i.length===0&&a.length===0&&r.length===0&&o.length===0&&s.length===0)return"None yet";let l=[...i.map(d=>{let c=d.payload.value.kind;return c.kind==="chartStat"?(xn.find(([u])=>u===c.stat)?.[1]??"number").toLowerCase():"number"})];for(let d of a){let{at:c,place:u}=d.payload.chartAnchor,p=(Bt.find(([m])=>m===c)?.[1]??"reading").toLowerCase();l.push(u==="through"?`${p} line`:`${p} marker`)}for(let d of r)l.push("times layer");for(let d of o)l.push("dots layer");for(let d of s)l.push("grid layer");return l.join(" \xB7 ")}function lb(e,n,t){let i=de(e),a=Tn(e.config,n.payload.id),r=Yt(e.config,n.payload.id),o=Mn(e.config,n.payload.id),s=Rn(e.config,n.payload.id),l=Pe(e.config,n.payload.id),d=g=>e.update(x=>{Md(x,n.payload.id,g)}),c=g=>e.update(x=>{$o(x,n.payload.id,g)}),u=new Set(a.map(g=>g.payload.value.kind.kind==="chartStat"?g.payload.value.kind.stat:"")),p=new Set(l.map(g=>g.payload.chartAnchor.at)),m=[...a.map(g=>({el:g,lead:e.resolve(g.payload.value)??"--",title:Se(g,i),kind:"Number"})),...l.map(g=>{let{at:x,place:k}=g.payload.chartAnchor,C=Bt.find(([S])=>S===x)?.[1]??"Reading";if(k==="through")return{el:g,lead:x==="now"?"\u2502":"\u2500",title:x==="zero"?"Zero":C,kind:"Line"};let $=g.kind==="text"?e.resolve(g.payload.value)??"\u25CF":g.kind==="icon"?ub(e.resolve(g.payload.symbol)):"\u25C6";return{el:g,lead:$,title:C,kind:"Marker"}}),...r.map(g=>({el:g,lead:G("clock"),title:"Clock times",kind:"Times"})),...o.map(g=>({el:g,lead:G("chartDots"),title:"Reading dots",kind:"Dots"})),...s.map(g=>({el:g,lead:G("chartGrid"),title:"Grid lines",kind:"Grid"}))],y=m.length;return h`
    <div class="hint">Everything the chart shows besides its readings: a threshold, now, clock times, numbers
      and markers. Each one is a layer in this chart's group, so you can drag it and give it any size or colour.</div>
    ${t??f}
    ${y===0?h`<div class="hint keep">A chart on its own shows that a reading moved, not what it moved to and not
          which reading was the day's best. Add a number or a marker below and it appears as a layer in this chart's
          group: drag it anywhere, give it any size or colour, and it follows the live value.</div>`:f}
    <div class="field list-field"><span>Numbers</span>
      <div class="adders">
        ${xn.map(([g,x])=>h`
          <button class="small ${u.has(g)?"on":""}" title=${u.has(g)?`Add another ${x.toLowerCase()}`:`Add the ${x.toLowerCase()}`}
            @click=${()=>d(g)}>${u.has(g)?h`<span aria-hidden="true">✓</span>`:G("plus")}<span>${x}</span></button>`)}
      </div>
    </div>
    <div class="hint">The newest reading, the change and the total start with the entity's unit after them. The change is the newest reading minus the first, and the trend arrow is that change as ↑, ↓ or →, flat when it is too small for the chart to print. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>
    <div class="field list-field"><span>Markers</span>
      <div class="adders">
        ${Bt.filter(([g])=>dt(g)).map(([g,x])=>h`
          <button class="small ${p.has(g)?"on":""}" title=${p.has(g)?`Add another mark over the ${x.toLowerCase()}`:`Mark the ${x.toLowerCase()}`}
            @click=${()=>c(g)}>${p.has(g)?h`<span aria-hidden="true">✓</span>`:G("plus")}<span>${x}</span></button>`)}
      </div>
    </div>
    <div class="hint">A marker starts as an icon over the reading it names: a triangle over the highest, a dot over
      the lowest. Pick any other icon for it in its Content card. It hangs in the empty space above its own bar rather than in a
      band along the top, so the bars keep their full height, and it is pushed back down rather than off the chart
      when the bar is already tall. Its Position card sets which reading it follows and which side of the bar it
      sits on.</div>
    ${y===0?f:h`
      <div class="shown-head">On this chart <span class="shown-count">${y}</span></div>
      ${Ks(e,m,{icon:"close",danger:!0,label:g=>`Delete this ${g}`,run:g=>e.update(x=>fe(x,g))})}
      <div class="hint">Click a row to open its main settings here. More settings selects that layer for the
        rest. The × deletes it, and Undo brings it back. Dots and grid
        lines always sit on the chart, so on the preview a click on the chart selects the chart; click right on a
        dot to pick the dots.</div>`}`}function Ks(e,n,t){return h`<div class="chart-numbers">${vu(n,a=>a.el.payload.id,({el:a,lead:r,title:o,kind:s})=>{let l=a.payload.id,d=s.toLowerCase();return h`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${()=>e.peekLayer(l,!0)}
        @pointerleave=${()=>e.peekLayer(l,!1)}>
        <summary class="num-pick" title=${`Show the settings for this ${d}`}>
          <span class="num-lead">${r}</span>
          <span class="num-text"><span class="num-title">${o}</span><span class="num-kind">${s}</span></span>
          <span class="chev">${G("chevron")}</span>
        </summary>
        <div class="num-body">
          ${db(e,a)}
          <div class="chips"><button class="small" title=${`Select this ${d} to see all of its settings`}
            @click=${()=>e.selectLayer(l)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${t.danger?"danger":""}" title=${t.label(d)} aria-label=${t.label(d)}
        @click=${()=>{e.peekLayer(l,!1),t.run(l)}}>${G(t.icon)}</button>
    </div>`})}</div>`}function db(e,n){let t=n.payload.id,i=`quick-${t}`,a=e.activeFamily,r=(c,u)=>e.update(p=>{let m=p.elements.find(y=>y.payload.id===t);m&&c(m)},`${i}-${u}`),o=we(n.kind).payload,s=Dn(n),l=s===void 0?f:pe("Colour",s,c=>r(u=>{Dn(u)!==void 0&&(u.payload.colorSlot.baseColorHex=c??"#FFFFFF")},"colour"),!1,o.colorSlot?.baseColorHex??"#FFFFFF"),d=n.payload.chartAnchor;switch(n.kind){case"text":{let c=n.payload.value.kind;return h`
        ${c.kind==="chartStat"?xe("Number",c.stat,[...xn],u=>r(p=>{p.kind==="text"&&p.payload.value.kind.kind==="chartStat"&&(p.payload.value={...p.payload.value,kind:{...p.payload.value.kind,stat:u}})},"stat")):d||nt(n.payload)?f:re(e,n.payload.value,u=>r(p=>{p.kind==="text"&&(p.payload.value=u)},"value"),{showResolved:!0,label:n.payload.countdown?"Until":"Text",key:`${i}-value`})}
        ${d&&d.place!=="through"?Uu(e,t,d,r):f}
        <div class="grid2">
          ${en(e,n,a,"Font size",{step:1,min:4,def:o.fontSize})}
          ${n.payload.countdown||nt(n.payload)?f:l}
        </div>`}case"icon":return h`
        ${d?Uu(e,t,d,r):re(e,n.payload.symbol,c=>r(u=>{u.kind==="icon"&&(u.payload.symbol=c)},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${i}-symbol`,setSymbolPath:c=>r(u=>{u.kind==="icon"&&(c?u.payload.path=c:delete u.payload.path)},"symbol")})}
        <div class="grid2">
          ${en(e,n,a,"Icon size",{step:1,min:4,def:o.size})}
          ${l}
        </div>`;case"shape":return n.payload.kind!=="line"?h`
          <div class="grid2">
            ${n.payload.kind==="roundedRectangle"?ee("Corner radius",n.payload.cornerRadius,c=>r(u=>{u.kind==="shape"&&(u.payload.cornerRadius=c??6)},"radius"),{step:.5,min:0,def:o.cornerRadius,unit:"pt"}):f}
            ${l}
          </div>`:h`
        ${d?xp(e,d,i):f}
        <div class="grid2">
          ${ee("Thickness",n.payload.thickness,c=>r(u=>{u.kind==="shape"&&(u.payload.thickness=c??1)},"thick"),{step:.5,min:.5,def:o.thickness,unit:"pt"})}
          ${l}
        </div>`;case"gauge":{let c=n.payload;return h`
        ${re(e,c.value,u=>r(p=>{p.kind==="gauge"&&(p.payload.value=u)},"value"),{showResolved:!0,label:"Reading",key:`${i}-value`})}
        <div class="grid2">
          ${c.style==="dots"?f:en(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"chart":{let c=n.payload;return h`
        ${re(e,c.value,u=>r(p=>{p.kind==="chart"&&(p.payload.value=u)},"value"),{label:"Readings",noShare:!0,key:`${i}-value`})}
        ${Q("Style",c.style,np,u=>r(p=>{p.kind==="chart"&&(p.payload.style=u)},"style"),{def:o.style})}
        <div class="grid2">
          ${c.style==="bars"?f:en(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"timeline":return h`
        ${re(e,n.payload.value,c=>r(u=>{u.kind==="timeline"&&(u.payload.value=c)},"value"),{label:"States",noShare:!0,key:`${i}-value`})}`;case"image":{let c=n.payload;return h`
        ${Q("Source",c.source,[["camera","Camera"],["entityPicture","Entity picture"]],u=>r(p=>{p.kind==="image"&&(p.payload.source=u)},"source"),{def:o.source})}
        ${Q("Picture",c.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],u=>r(p=>{p.kind==="image"&&(p.payload.contentMode=u)},"mode"),{def:o.contentMode})}`}case"tap":return Us(e,n.payload,(c,u)=>r(p=>{p.kind==="tap"&&c(p.payload)},u??"action"),i);case"chartTimes":{let c=n.payload;return h`
        ${On("Times",c.timeLabelCount,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.timeLabelCount=Math.max(0,Math.min(Sn,Math.round(u))))},"count"),{min:0,max:Sn,step:1,def:o.timeLabelCount,format:u=>u<=0?"None":String(Math.round(u)),range:!1})}
        <div class="grid2">
          ${ee("Time size",c.labelSize,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelSize=Math.min(jt,Math.max(Wt,u??Xe)))},"size"),{step:.5,min:Wt,max:jt,def:o.labelSize,unit:"pt"})}
          ${pe("Time colour",c.labelColorHex,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelColorHex=u??Je)},"colour"),!1,o.labelColorHex)}
        </div>`}case"imageTime":return h``;case"chartDots":{let c=n.payload,u=e.config.elements.find(y=>y.payload.id===c.chart),p=u?.kind==="chart"?Re(e.config,a,u).size??u.payload.lineWidth:void 0,m=p===void 0?void 0:Math.round(p*18)/10;return h`
        ${Q("Dots",c.dots,tp,y=>r(g=>{g.kind==="chartDots"&&(g.payload.dots=y)},"mode"),{def:"auto"})}
        <div class="grid2">
          ${ee("Dot size",c.size??m,y=>r(g=>{if(g.kind!=="chartDots")return;let x=st(y);x===void 0||x===m?delete g.payload.size:g.payload.size=x},"size"),{step:.5,min:1,max:12,...m===void 0?{}:{def:m},unit:"pt"})}
          ${Is("Dot colour",c.colorHex,"Series colour",y=>r(g=>{g.kind==="chartDots"&&(y===void 0?delete g.payload.colorHex:g.payload.colorHex=y)},"colour"))}
        </div>`}case"chartGrid":{let c=n.payload;return h`
        <div class="grid2">
          ${ee("Lines",c.lines,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.lines=yn(u??Vt))},"lines"),{step:1,min:1,max:4,def:Vt})}
          ${ee("Thickness",c.thickness,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.thickness=bn(u??Ot))},"thick"),{step:.25,min:$a,max:Ca,def:Ot,unit:"pt"})}
        </div>
        ${pe("Colour",c.colorHex,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.colorHex=u??kt)},"colour"),!1,kt)}`}default:return h`${l}`}}function Uu(e,n,t,i){let a=Bt.filter(([r])=>dt(r)||r===t.at);return h`
    <div class="grid2">
      ${xe("Reading",t.at,a,r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.at=r)},"at"))}
      ${xe("Sits",t.place,Ta.filter(([r])=>r!=="through"),r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.place=r)},"place"))}
    </div>`}function cb(e,n,t){if(n.kind==="tap")return f;let i=n.payload.id,a=Oe(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);c&&s(c.payload)},l?`${t}-${l}`:void 0),o=Io(e.config,n);return h`
    ${Ue("Tappable",a!==void 0,s=>e.update(l=>{s?Na(l,i):Pa(l,i)}))}
    ${a?h`<div class="value-editor">
          ${Us(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${La(a.payload.outset)?f:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...xo}})}>${G("reset")}</button>`}
            </div>
          </div>
        </div>
        ${ob(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${$t(o)}</b>.</div>`}`}function Ku(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function ub(e){return e===void 0?"\u25C6":e.includes("up")?"\u25B2":e.includes("down")?"\u25BC":e.startsWith("circle")?"\u25CF":"\u25C6"}function Se(e,n){let t=e.payload.chartAnchor;if(t!==void 0){let i=Bt.find(([a])=>a===t.at)?.[1]??"Reading";return t.place==="through"?`${i} line`:`${i} marker`}switch(e.kind){case"text":return Ku(ke(e.payload.value,n));case"icon":return Ku(ke(e.payload.symbol,n));case"gauge":return ke(e.payload.value,n);case"chart":return ke(e.payload.value,n);case"timeline":return ke(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let i=e.payload.entity;return i.displayName||i.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let i=e.payload.action,a="entityId"in i?i.displayName||i.entityId:i.type==="callService"?[i.serviceDomain,i.serviceName].filter(r=>r!=="").join("."):i.type==="openPage"&&e.payload.openPageName||"";return a?`${i.type} \xB7 ${a}`:i.type}case"chartTimes":return"Clock times";case"chartDots":return"Reading dots";case"chartGrid":return"Grid lines";case"imageTime":return"Timestamp"}}function kp(e,n){let t=St(e.config,n.id),i=de(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return ve(e,"content","Group",h`
    ${$e("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Ue("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="shown-head">Layers <span class="shown-count">${t.length}</span></div>
    ${Ks(e,t.map(r=>({el:r,lead:G(r.kind),title:Se(r,i),kind:Jt[r.kind]})),{icon:"ungroup",label:r=>`Take this ${r} out of the group`,run:r=>e.update(o=>Ii(o,r,void 0))})}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Hi(r,n.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group and keeps it on the face.</div>`,{color:Z.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function $p(e,n){if(n==="inline")return pb(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${te(n)} yet.</div>
      <button class="small" @click=${()=>e.update(s=>{s.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${te(n)} settings</button>`;let i=(s,l)=>e.update(d=>s(d.perFamily[n]),l?`fam-${n}-${l}`:void 0),a=Ir(e.config,n),r=t.backgroundColorHex?Ee(t.backgroundColorHex):"transparent",o=t.borderColorHex?`${t.borderWidth} pt ${Ee(t.borderColorHex)} border`:"no border";return h`
    ${ve(e,"look",`${te(n)} shape`,h`
      ${pe("Background (blank = transparent)",t.backgroundColorHex,s=>i(l=>{s===void 0?delete l.backgroundColorHex:l.backgroundColorHex=s},"bg"),!0,null)}
      ${pe("Border colour",t.borderColorHex,s=>i(l=>{s===void 0?delete l.borderColorHex:l.borderColorHex=s},"border"),!0,null)}
      ${ee("Border width",t.borderWidth,s=>i(l=>{l.borderWidth=s??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}`,{color:Z.look,icon:"shape",summary:`${r} \xB7 ${o}`,...t.backgroundColorHex!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(s=>{delete s.backgroundColorHex,delete s.borderColorHex,s.borderWidth=2},"reset-look")}:{}})}
    ${n==="corner"?ve(e,"corner","Corner content",hb(e,t,i),{color:Z.content,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(s=>{delete s.curvedText,delete s.bezelText,delete s.bezelGauge},"reset-corner")}:{}}):f}
    ${ve(e,"states","Shape states",Rp(e,t.rules,"layout",s=>s.perFamily[n]?.rules,`rules-${n}`),{color:Z.states,icon:"states",summary:Ui(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(s=>{s.rules=[]},"reset-states")}:{}})}
    ${ve(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${te(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${te(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:Z.position,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function pb(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=de(e);return h`
    ${ve(e,"content","Inline text",h`
      ${$e("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${re(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Gs(e,n.countdown===!0,n.value,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}`,{color:Z.content,icon:"text",summary:_e(`${n.label?`${n.label}: `:""}${ke(n.value,i)}`,48)})}
    ${ve(e,"symbol","Symbol",h`
      ${ep(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:Z.look,icon:"icon",summary:n.symbol||"None"})}`}function hb(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    ${Q("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=I("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${re(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${pe("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${Q("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=I("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:I("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${re(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Gs(e,n.bezelCountdown===!0,n.bezelText,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&n.bezelGauge?mb(e,n.bezelGauge,t):f}`}function mb(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${re(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ee("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ee("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${pe("Arc colour (min end)",i[0],a(0))}
    ${pe("Arc colour (middle)",i[1],a(1))}
    ${pe("Arc colour (max end)",i[2],a(2))}
    ${Ue("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=I(String(s.minValue)),s.maxLabel=I(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?re(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${n.maxLabel?re(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var Qw=ae.map(e=>[e,te(e)]),Ws={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},fb=Object.keys(Ws),Tr=["color","text","fontSize","fontWeight","visibility"];function gb(e,n=!1){let t=_i[e].filter(i=>!n||Tr.includes(i));return fb.filter(i=>t.includes(Le[i]))}function Cp(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${Xy(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:f}`}var yb={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function gr(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function _e(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Sp(e){if(!e||Ae(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function ke(e,n){return`${ea(e,n)}${Sp(e.format)}`}function ea(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${_e(t.value,40)}"`:"(empty)";case"entityState":return gr(t,n);case"entityAttribute":return t.attribute?`${gr(t,n)} \xB7 ${t.attribute}`:gr(t,n);case"entityAge":return`age of ${gr(t,n)}`;case"aggregate":return bb(t.aggregate);case"time":return yb[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${_e(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(xn.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?ea(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function bb(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Qi(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function xb(e,n,t,i,a,r){let o=(s,l)=>e.update(d=>{let c=i(d);c&&s(c)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:f}
    ${n.map((s,l)=>vb(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(zi())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function vb(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),d=e.forced.get(n.id)??"live",c=m=>d==="live"?m==="live":d==="otherwise"?m==="otherwise":d.caseId===m,u=(m,y)=>r(g=>{let x=g.find(k=>k.id===n.id);x&&m(x)},y),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(m=>Qi(m,t,t-1))}>${G("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(m=>Qi(m,t,t+1))}>${G("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(m=>{let y=m.findIndex(g=>g.id===n.id);y>=0&&m.splice(y,1)})}>${G("delete")}</button>
    </div>
    ${s===void 0?f:Cp(s,n.partId,de(e),m=>u(y=>{m?y.partId=m:delete y.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${c("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((m,y)=>h`<button class="${c(m.id)?"active":""} ${l===m.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:m.id})}>Case ${y+1}</button>`)}
        ${n.otherwise?h`<button class="${c("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:f}
      </div>
    </div>
    ${n.cases.map((m,y)=>wb(e,m,y,n,a,u,`${o}-${m.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(m=>{m.cases.push(Go())})}>+ case</button></div>
    ${Ue("Otherwise",n.otherwise!==void 0,m=>u(y=>{m?y.otherwise=y.otherwise??[]:delete y.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${Tp(e,n.otherwise,a,m=>u(y=>{y.otherwise&&m(y.otherwise)}),`${o}-otherwise`,p)}
        </div>`:f}
  </div>`}function wb(e,n,t,i,a,r,o,s=!1){let l=(c,u)=>r(p=>{let m=p.cases.find(y=>y.id===n.id);m&&c(m)},u),d=e.liveBranch(i)===n.id;return h`<div class="case-box ${d?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${d?h` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>Qi(c.cases,t,t-1))}>${G("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(c=>Qi(c.cases,t,t+1))}>${G("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(c=>{let u=c.cases.findIndex(p=>p.id===n.id);u>=0&&c.cases.splice(u,1)})}>${G("delete")}</button>
    </div>
    <div class="row-inline">
      ${Q("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],c=>l(u=>{u.when.join=c}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:f}
    ${n.when.tests.map((c,u)=>kb(e,c,u,p=>l(m=>{let y=m.when.tests.find(g=>g.id===c.id);y&&p(y)}),()=>l(p=>{p.when.tests=p.when.tests.filter(m=>m.id!==c.id)}),`${o}-${c.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(c=>{c.when.tests.push(Bo())})}>+ test</button>
      <select class="adder" @change=${c=>{let u=c.target,p=u.value;if(u.value="",!p)return;let m=Eu(p,ku(e.hass?.states));l(y=>{y.when.tests.push(...m)})}}>
        <option value="">+ preset…</option>
        ${Su.map(c=>h`<option value=${c.kind} title=${c.hint}>${c.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${Tp(e,n.then,a,c=>l(u=>c(u.then)),`${o}-then`,s)}
  </div>`}function kb(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=Hn(s.kind),d=e.evaluateTest(n),c=f;switch(l){case"value":c=re(e,s.value??I(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=h`${re(e,s.value??I(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${re(e,s.upper??I(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=h`${$e("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!$b(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"times":c=h`<div class="row-inline">
          ${Wu(e,"From",s.value??I("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${Wu(e,"To",s.upper??I("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":c=Cb(n.value)?Sb(s.options??[],u=>o(p=>{p.comparison.options=ws(u)},"options")):$e("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(m=>m.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${G("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:re(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${xe("Comparison",s.kind,Xd.map(u=>[u,si[u]]),u=>o(p=>{p.comparison=Uo(p.comparison,u)}))}
    ${c}
  </div>`}function $b(e){try{return new RegExp(e),!0}catch{return!1}}function Wu(e,n,t,i,a){if(t.kind.kind!=="literal")return re(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=An(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${be(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:f}</label>`}function Cb(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function Sb(e,n){let t=Cu(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${$u.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function Tp(e,n,t,i,a,r=!1){let o=gb(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:f}
    ${n.map((s,l)=>Tb(e,s,l,t,(d,c)=>i(u=>{u[l]&&d(u[l])},c?`${a}-${l}-${c}`:void 0),()=>i(d=>{d.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,d=l.value;l.value="",d&&i(c=>{c.push(In(d))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${Ws[s]}</option>`)}
    </select>`}var Ep=["setColor","setBorderColor","setBackgroundColor"];function Tb(e,n,t,i,a,r,o,s=!1){let l=!_i[i].includes(Le[n.kind]),d=s&&!l&&!Tr.includes(Le[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${Ws[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:d?h` <span class="no">(ignored by a part)</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${G("delete")}</button>
    </div>
    ${d?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:f}
    ${Mp(e,n,a,o)}
  </div>`}function Mp(e,n,t,i){let a=Ba(n.kind),r=f;if(a==="value"){let o=n.value??I("");if(Ep.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?pe("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=I(l??"#FFFFFF")},"color")):re(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:I("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?f:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=re(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=ee(s,n.number??0,l=>t(d=>{d.number=l??0},"number"),o)}else a==="weight"&&(r=Q("Weight",n.weight??"regular",ui,o=>t(s=>{s.weight=o})));return r}var Ns=new Set,yr=new Map,br=new Map,ju=new Map;function Rp(e,n,t,i,a,r,o){let s=fs(n);return!s.ok||Ns.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!s.ok} title=${s.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${d=>{Ns.delete(a),Me(d.target)}}>Show as table</button>
        ${s.ok?f:h`<span class="hint keep">${s.reason}</span>`}
      </div>
      ${xb(e,n,t,i,a,o)}`:Eb(e,s.table,n[0],t,i,a,r,o)}function Eb(e,n,t,i,a,r,o,s){let l=(v,E)=>e.update(T=>{let F=a(T);F&&v(F)},E?`${r}-${E}`:void 0),d=n.value??ju.get(r)??o,c=n.rows.length===0,u=n.numberMode||c&&d!==void 0&&!du(d)&&Mb(e.resolve(d)),p=_i[i],m=yr.get(r)??new Set,y=n.columns.length===0&&m.size===0?[lu[i]]:[],g=Qc(n.columns,[...m,...y.filter(v=>v!==void 0)],p),x=fr.get(r),k=t?t.partId:s?.some(v=>v.id===x)?x:void 0,C=s!==void 0&&k!==void 0,$=C?p.filter(v=>Tr.includes(v)):p,S=C?g.filter(v=>!Tr.includes(v)):[],L=(v,E)=>{if(!t){v?fr.set(r,v):fr.delete(r),Me(E);return}l(T=>{let F=T[0];F&&(v?F.partId=v:delete F.partId)})},_=t?e.liveBranch(t):"none",H=t?e.forced.get(t.id)??"live":"live",J=v=>H!=="live"&&(H==="otherwise"?v==="otherwise":H.caseId===v),R=v=>{t&&e.setForced(t.id,J(v)?"live":v==="otherwise"?"otherwise":{caseId:v})},A=v=>{ju.set(r,v),n.rows.length!==0&&l(E=>ru(E,v),"lhs")},j=()=>{fr.delete(r),l(v=>{iu(v,d??I(""),u),k!==void 0&&v[0]&&v[0].partId===void 0&&(v[0].partId=k)})},U=n.rows.map((v,E)=>Yu(e,{key:`${r}-${v.caseId}`,label:su(v.comparison,T=>ke(T,de(e))),columns:g,changes:v.changes,live:_===v.caseId,forced:J(v.caseId),onForce:()=>R(v.caseId),when:Ib(e,v.comparison,`${r}-${v.caseId}`,(T,F)=>l(O=>{let K=O[0]?.cases.find(se=>se.id===v.caseId)?.when.tests[0];K&&T(K.comparison)},F&&`${v.caseId}-${F}`)),updChanges:(T,F)=>l(O=>{let K=O[0]?.cases.find(se=>se.id===v.caseId);K&&T(K.then)},F&&`${v.caseId}-${F}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${E===0} @click=${()=>l(T=>gs(T,E,E-1))}>${G("up")}</button>
      <button class="icon" title="Move down" ?disabled=${E===n.rows.length-1} @click=${()=>l(T=>gs(T,E,E+1))}>${G("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(T=>au(T,v.caseId))}>${G("delete")}</button>`})),ne=n.otherwise===void 0?f:Yu(e,{key:`${r}-otherwise`,label:"Otherwise",columns:g,changes:n.otherwise,live:_==="otherwise",forced:J("otherwise"),onForce:()=>R("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(v,E)=>l(T=>{let F=T[0]?.otherwise;F&&v(F)},E),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(v=>ys(v,!1))}>${G("close")}</button>`}),z=br.get(r),b=Rb.filter(v=>$.includes(v)&&!g.includes(v));return h`
    <div class="states">
      ${re(e,d??I(""),A,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${d===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:f}
      ${s===void 0?f:Cp(s,k,de(e),L)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${g.map(v=>h`<th>
              <span>${mt[v]}</span>
              <button class="icon" title=${`Remove the ${mt[v]} column`}
                @click=${E=>{br.set(r,v),Me(E.target)}}>${G("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${U}
          ${ne}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${g.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table></div>
      ${S.length===0?f:h`<div class="hint warn">A part ignores ${Lr(S.map(v=>mt[v]))}. Pick Whole text to use ${S.length===1?"it":"them"}.</div>`}
      ${z===void 0?f:h`<div class="hint warn confirm-row">
        Remove the ${mt[z]} column? Its ${qu(n,z)} value${qu(n,z)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${v=>{br.delete(r),yr.get(r)?.delete(z),Me(v.target),l(E=>ou(E,z))}}>Remove</button>
        <button class="small" @click=${v=>{br.delete(r),Me(v.target)}}>Cancel</button>
      </div>`}
      <div class="field list-field"><span>Add</span>
        <div class="states-foot">
          <button class="small" title="Add a row: a value to match and what the layer looks like then" @click=${j}>${G("plus")}<span>State</span></button>
          ${n.otherwise===void 0?h`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(v=>ys(v,!0))}>${G("plus")}<span>Otherwise</span></button>`:f}
          ${b.length===0?f:h`<select class="chip-add" title="Add a column" aria-label="Add a column" @change=${v=>{let E=v.target,T=E.value;if(E.value="",!T)return;let F=yr.get(r)??new Set;F.add(T),yr.set(r,F),Me(E)}}>
            <option value="" selected>+ Column…</option>
            ${b.map(v=>h`<option value=${v}>${mt[v]}</option>`)}
          </select>`}
        </div>
      </div>
      ${H==="live"?f:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${v=>{Ns.add(r),Me(v.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Mb(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var Rb=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function qu(e,n){let t=0;for(let i of e.rows)or(i.changes,n)&&(t+=1);return e.otherwise&&or(e.otherwise,n)&&(t+=1),t}function Fb(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function Yu(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{Fb(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${Ab(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function Ab(e,n,t,i,a){let r=or(t,n),o=Hr(a);if(!r)return h`<button type="button" class="cell empty" title=${`Set ${mt[n]} for this state`}
      @click=${d=>{i(c=>{c.push(In(Zc[n]))}),rp(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(u=>{let p=u.find(m=>Le[m.kind]===n);p&&d(p)},c&&`${n}-${c}`),l=mt[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${Hb(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${op}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Zi.has(o)?h`${n==="visibility"?Q("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):Mp(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let u=c.findIndex(p=>Le[p.kind]===n);u>=0&&c.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:f}
    </div>`}function Hb(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=Ba(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${ui.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;let i=n.value??I(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Ep.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Ee(a):ke(i,de(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??f}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${ke(i,de(e))}</span>`}function Ee(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Ib(e,n,t,i){let a=Hn(n.kind),r=ms(n.kind),o=(s,l,d,c)=>_b(e,s,l,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${be(s=>i(l=>{let d=Uo(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${hs.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${Lb(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??I(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??I(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:f}
  </span>`}function Lb(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return si[e]}}function _b(e,n,t,i,a,r,o){let s=Hr(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${re(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${be(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${ap(e,s,o,n,t,l)}
  </span>`}var ta=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Ao,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function Ip(e){return ta.find(n=>n.kind===e)??ta[0]}var Fp="#FF9F0A",_r="#8E8E93",zb=["#FF453A","#FFD60A","#34C759"],Lp=["#0A84FF","#34C759","#FF9F0A"];function Nb(e){return e?.attributes?.device_class==="battery"?zb:Lp}var Pb={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function Db(e){let n=e.iconName?.trim();return n?{off:n,on:n}:Pb[js(e)]??{off:"circle",on:"circle.fill"}}function Ob(e){switch(js(e)){case"lock":return{kind:"equals",value:I("locked")};case"cover":case"valve":return{kind:"equals",value:I("open")};case"media_player":return{kind:"equals",value:I("playing")};default:return{kind:"isOn"}}}function js(e){return e.domain||e.entityId.split(".")[0]||""}function rn(e){return{...e,domain:js(e)}}function Vb(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function pi(e){return Math.round(e*1e4)/1e4}function Gn(e,n,t){return Math.min(t,Math.max(n,e))}function qs(e,n,t){let i=He[e],a=Gn(pi(n/i.width),0,1),r=Gn(pi(t/i.height),0,1);return{x:pi((1-a)/2),y:pi((1-r)/2),width:a,height:r,rotationDegrees:0}}function Bb(e){let n=He[e],t=Gn(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:qs(e,t*1.3,t*1.3),size:t}}function Gb(e){let n=He[e],t=Gn(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:qs(e,n.width*.88,t*1.7),size:t}}function Ub(e){let n=He[e],t=Math.min(n.width,n.height)*.9;return{frame:qs(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function _p(e){let n=e==="rectangular";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function Kb(e){let n=He[e],t=Gn(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:pi(t/n.height),rotationDegrees:0}}}function Wb(e){let n=He[e],t=Gn(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:pi(Gn(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function jb(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function qb(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function nn(e,n,t,i){let a=i(t);n.payload.frame=a.frame,qb(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=Tt());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function an(e){return we(e)}function Ys(e,n){let t={kind:{kind:"entityState",...rn(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function Ap(e){let n=In("setIcon");return n.value=I(e),n}function Bn(e){let n=In("setColor");return n.value=I(e),n}function Yb(e,n){let t=zi(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...rn(e)}},a.comparison=Ob(e);let r=n.on!==n.off;return i.then=r?[Ap(n.on),Bn(Fp)]:[Bn(Fp)],t.otherwise=r?[Ap(n.off),Bn(_r)]:[Bn(_r)],t}function Xb(e){let n=zi(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...rn(e)}},i.comparison={kind:"isUnavailable"};let a=In("setOpacity");return a.number=.35,t.then=[a],n}function Hp(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Jb(e,n,t=Lp){let i=n.max-n.min,a=Hp(n.min+i/3),r=Hp(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:I(a)},changes:[Bn(t[0])]},{comparison:{kind:"between",value:I(a),upper:I(r)},changes:[Bn(t[1])]},{comparison:{kind:"greaterThan",value:I(r)},changes:[Bn(t[2])]}];return eu(Ys(e),o)}function Zb(e,n,t){let i=an("icon"),a=Db(n);return i.payload.symbol=I(a.off),i.payload.colorSlot.baseColorHex=_r,i.payload.rules=[Yb(n,a)],nn(e,i,t.family,Bb),e.elements.push(i),Na(e,i.payload.id,{type:"toggleEntity",...rn(n)}),i.payload.id}function Qb(e,n,t){let i=an("text");return i.payload.value=Ys(n,t.state),i.payload.rules=[Xb(n)],nn(e,i,t.family,Gb),e.elements.push(i),i.payload.id}function ex(e,n,t){let i=an("gauge");i.payload.value=Ys(n);let a=Vb(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Jb(n,a,Nb(t.state))],nn(e,i,t.family,Ub),e.elements.push(i),i.payload.id}function tx(e,n,t){let i=an("chart");return i.payload.value={kind:{kind:"entityState",...rn(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",nn(e,i,t.family,_p),e.elements.push(i),i.payload.id}function nx(e,n,t){let i=an("chart");return i.payload.value={kind:{kind:"entityState",...rn(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",nn(e,i,t.family,_p),e.elements.push(i),i.payload.id}function ix(e,n,t){let i=rn(n),a=an("text");a.payload.value=I(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=_r,nn(e,a,t.family,Wb),e.elements.push(a);let r=t.state?.attributes?.device_class,o=an("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=bo(i.domain,typeof r=="string"?r:void 0),nn(e,o,t.family,Kb),e.elements.push(o),o.payload.id}function ax(e,n,t){let i=an("image");return i.payload.entity=rn(n),nn(e,i,t.family,jb),e.elements.push(i),i.payload.id}function zp(e,n,t,i){switch(n){case"toggle":return Zb(e,t,i);case"status":return Qb(e,t,i);case"gauge":return ex(e,t,i);case"chart":return tx(e,t,i);case"history":return nx(e,t,i);case"doorHistory":return ix(e,t,i);case"camera":return ax(e,t,i)}}var rx=/^[a-z0-9_]+\.shared_(\d+)$/;function Np(e){return rx.test(e)}function ox(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function Dp(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function Op(e,n){let t=new Map;for(let i of Vo(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=Dp(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${ox(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function sx(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);Do(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),Oo(t,r=>_o(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"});for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}));return t.dataSources=[],t}function Vp(e){let n=!1;return Va(e,t=>{let i=t.kind;if(i.kind!=="aggregate")return;let a=i.aggregate.scope;a.kind==="filter"&&a.areaIds.length+a.labelIds.length+a.floorIds.length>0&&(n=!0)}),n}function lx(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(d=>r+t(d,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(d=>o[d]!==void 0).sort();return s.length===0?"{}":`{
${s.map(d=>`${r}${JSON.stringify(d)}: ${t(o[d],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function Bp(e,n,t=[]){let i=n==="share"?sx(e,t):e,a=Qn(i);return delete a.id,delete a.slotIndex,a.dataSources=[],`${lx(a)}
`}function Gp(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var dx="There is nothing to read here. Paste a complication first.",cx="This is not valid JSON. Check for a missing brace or a stray comma.",ux="This is valid JSON but not a complication. A complication starts with { and ends with }.",px="This does not look like a complication.",Pp="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",hx="00000000-0000-4000-8000-000000000000";function mx(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function Up(e,n){let t=e.trim();if(t==="")return{ok:!1,error:dx};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:cx}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:ux};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${Pp}`};let o={...a,id:hx,slotIndex:0},s;try{s=Zn(o)}catch(d){let c=d instanceof Ze||d instanceof Error?d.message:String(d);return{ok:!1,error:`${px}

${mx(c)}`}}let l=_a(a);if(l.length>0){let d=l.slice(0,3).join(", "),c=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${d}${c}. ${Pp}`}}return{ok:!0,config:s,raw:i}}function Xs(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=Vo(e,(o,s)=>Np(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=Np(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:Dp(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function Kp(e,n){let t=structuredClone(e);Do(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return Oo(t,a=>_o(a,i)),t}function Wp(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}function fx(e){return e.length<=1?e[0]??"":`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function jp(e){let n=e.elements.length,t=n===1?"1 layer":`${n} layers`,i=Za(e);return i.length===0?t:`${t}, ${fx(i)}`}function Js(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}var yx=3e4,bx=500,xx=3e4,qp="preset-entity";function Yp(e){return`import-entity-${e}`}var vx={entityId:"",displayName:"",domain:""},wx=new Map,kx={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Zs(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function $x(e){return e.kind==="family"?"look":"content"}function Qs(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function Xp(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function Cx(e){let n=w`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=e==="rectangular"?w`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`:e==="circular"?w`<circle cx="22" cy="26" r="8" fill="currentColor" />`:e==="corner"?w`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`:w`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`;return h`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${t}</svg>`}var Jp=300,Zp=360,nl=44,il=22,rh=[1,1.7,2.6],Sx=["S","M","L"],Qp=["Small","Medium","Large"];function Tx(){return rh.map((e,n)=>{let t=Math.round(nl*e),i=Math.round(il*e),a=`.layers-card.s${n}`;return`
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
`)}var eh="wrist-assistant-panel.layers.v1",Rt=34,Un=200,Ex=720,zr=320,Mx=80,Rx=56,th="wrist-assistant-panel.columns.v3",el=e=>Math.max(Un,Math.min(Ex,Math.round(e))),nh=e=>e.metaKey||e.ctrlKey||e.shiftKey;function Fx(e,n,t){let a=e.querySelector(`g[data-element-id="${CSS.escape(n)}"]`)?.firstElementChild;if(!a||a.tagName.toLowerCase()!=="rect")return!1;let r=a.getBoundingClientRect();return t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}var Ax=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,na=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",on=na==="Cmd"?"\u2318":"Ctrl+",tl=na==="Cmd"?"\u21E7":"Shift+";function ih(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-Mx;if(i>=Un*2+zr){let r=i-zr,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(Un,Math.floor(o*l)),s=Math.max(Un,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(Un,o-d):s=Math.max(Un,s-d))}return{columns:3,left:o,right:s}}let a=e-Rx;return a>=Un+zr?{columns:2,left:Math.min(n,a-zr),right:t}:{columns:1,left:n,right:t}}var N=class N extends It{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Jp;this.colRight=Zp;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.historyReadings=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set;this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.sharedHelp=!1;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareNote="";this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.recordPreviews=new Map;this.previewCase=ri.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=jc(()=>this.requestUpdate());this.imageSizes=qc(()=>this.requestUpdate());this.symbols=new nr(()=>this.requestUpdate());this.keyHandler=t=>this.onKey(t);this.heldArrows=new Set;this.keyUpHandler=t=>{this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new rr;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importParse,a=i?.ok?i.config:void 0;if(!a)return;let r=Xs(a,this.hass.states);r.some(s=>Vs(Yp(s.entityId)))||Js({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(r)})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||Vs(qp)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0};this.pressing=!1;this.pressStart=()=>{this.pressing=!0};this.pressEnd=()=>{window.setTimeout(()=>{this.pressing=!1})};this.sharedValueFocus=t=>{this.pressing||this.sharedValueOutside(t)};this.sharedValueOutside=t=>{if(this.openValue===void 0)return;let i=t.composedPath(),a=i[0];if(a instanceof HTMLElement&&a.classList.contains("values-list"))return;i.some(o=>o instanceof HTMLElement&&o.classList.contains("vitem")&&o.classList.contains("open"))||this.setOpenValue(void 0)}}get testValues(){return this.draft?.testValues??wx}static{this.styles=Or`
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
      --wa-text: ${Te(Ge.text)};
      --wa-icon: ${Te(Ge.icon)};
      --wa-gauge: ${Te(Ge.gauge)};
      --wa-shape: ${Te(Ge.shape)};
      --wa-image: ${Te(Ge.image)};
      --wa-tap: ${Te(Ge.tap)};
      --wa-states: ${Te(Z.states)};
      --wa-place: ${Te(Z.place)};
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
    /* An Extras button whose layer is already on the chart: pressed, not greyed.
       Draw buttons stay disabled; Numbers and Markers still add another. */
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
       and the Layers card takes the rest, scrolling its own rows. The shape
       row follows the last layer, and stays in sight once the rows scroll. */
    .column.left { display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    .column.left .card { flex: none; }
    .column.left .card.layers-card {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 10px 8px 8px;
      --thumb-w: ${nl}px; --thumb-h: ${il}px;
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
    .layer.held { background: color-mix(in srgb, ${Te(Z.group)} 12%, var(--wa-panel)); }
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
    .layer .lockbtn.on { opacity: 1; color: ${Te(Z.locked)}; }
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
    .layer.drop-before { border-top: ${Rt}px solid transparent; }
    .layer.drop-after { border-bottom: ${Rt}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${Rt}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${Rt}px; }
    .layer.drop-after::after { bottom: -${Rt}px; }

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
    ${Te(Tx())}

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
       and what the house is telling it right now. Stacked, so each title and
       each value line gets the whole width instead of wrapping into a column
       half as wide. */
    .under-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; flex: none; }
    .card.tint-values {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Te(Z.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Te(Z.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Te(Z.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Te(Z.states)} 35%, var(--wa-card));
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
    .sec-b > :is(.adders, .chart-numbers, .states-switch, details.sub) { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width. */
    :is(.sec-b, .sec-b :is(.grid2, .grid4, .value-editor, .states, .rich-parts, .part-editor, .rule-box, .case-box, .test-box, .change-box))
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
    .bands { display: grid; gap: 3px; margin: 2px 0 6px var(--wa-col); container-type: inline-size; }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.loadListView(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("pointerdown",this.pressStart,{capture:!0}),window.addEventListener("pointerup",this.pressEnd,{capture:!0}),window.addEventListener("pointercancel",this.pressEnd,{capture:!0}),window.addEventListener("click",this.sharedValueOutside,{capture:!0}),window.addEventListener("focusin",this.sharedValueFocus),this.addEventListener(Er,this.scrubStart),this.addEventListener(Mr,this.scrubEnd),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},xx)}loadColumnWidths(){try{let t=window.localStorage.getItem(th);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=el(i.left)),typeof i.right=="number"&&(this.colRight=el(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(th,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadListView(){try{let t=window.localStorage.getItem(eh);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(eh,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Jp:this.colRight=Zp,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=ih(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,m=el(t==="left"?s+p:s-p);t==="left"?this.colLeft=m:this.colRight=m},d=u=>{u.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("pointerdown",this.pressStart,{capture:!0}),window.removeEventListener("pointerup",this.pressEnd,{capture:!0}),window.removeEventListener("pointercancel",this.pressEnd,{capture:!0}),window.removeEventListener("click",this.sharedValueOutside,{capture:!0}),window.removeEventListener("focusin",this.sharedValueFocus),this.removeEventListener(Er,this.scrubStart),this.removeEventListener(Mr,this.scrubEnd),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=[t.rectangular,t.circular,t.corner].filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||Zs(i)!==Zs(this.inspect))&&(this.openSections=new Set(Ps),this.rowHoverId=void 0)}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=Zs(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!Ax.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=kx[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):c=!1,c&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?St(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)fe(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=ti(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=Kd(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=ti(t,i),r=[];this.mutate(o=>{r=fn(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=pt(t,this.canvasFamily).filter(a=>!ge(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?ut(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>Hi(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!Re(t,a,s).isHidden);this.mutate(s=>{for(let l of i)Ce(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!ge(a,u)),o=a.elements.filter(u=>ge(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],at(a),ei(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await El(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${Ft(t)}`}}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1;let i=Sc(this.owners.find(a=>a.owner_watch_id===t)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await Ll(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Ml(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${Ft(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=zn.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=_a(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Ft(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new zn(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0),!0)}freeSlot(){return nd(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await Fl(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Rl(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=Ft(t)}}renderSendButton(){let t=tc({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds});if(t.kind==="unsupported"&&!this.sendStatusKnown)return f;let i=nc(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:f}${a}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<to}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Ua(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=md(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(bx))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new ht(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,watchAppVersion:this.selectedOwner?.app_version,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),canCountDown:i=>t.canCountDown(i),historySeries:i=>this.historySeries.get(i),historyReadings:i=>this.historyReadings.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}},peekLayer:(i,a)=>{a?this.rowHoverId=i:this.rowHoverId===i&&(this.rowHoverId=void 0)},selectValue:i=>this.openSharedValue(i),beginGesture:()=>this.draft?.beginGesture()}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||Gc(t.app_version):!0}get canvasFamily(){if(oi(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&ls(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;!t||t.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=Za(t)[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=ue[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!oi(this.activeFamily))return f;if(pt(t,i).length>0)return f;let r=ae.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>Ir(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${te(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${te(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>gp(s,o,i))}>Copy the ${te(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${te(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${N.sizeWords(i)} against
            ${N.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:f}
    </div>`}addShape(t){this.mutate(i=>Pc(i,t)),this.activeFamily=t,this.inspect={kind:"family"}}removeShape(t){let i=this.draft?.config;if(!i||!Qa(i,t))return;let a=Oc(i,t);a.length>0&&!window.confirm(`Remove the ${te(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>Dc(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew(Pd(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let s=this.freeSlot();if(s<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=X(),l.slotIndex=s,i=new zn(l,null)}let a=i.encoded(),r=await Al(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id;let o=this.draft.testValues;this.draft=zn.fromDocument(r.record.document,r.record.revision),this.draft.testValues=o,this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Ft(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let t=await Hl(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!t.ok){t.error==="conflict"?this.conflict={current:t.current??null,message:t.message??"This complication changed on the server."}:this.saveError=t.message??t.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(t){this.saveError=Ft(t)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=X(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await Il(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Ft(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},yx)}async refreshHistorySeries(){let t=this.draft?.config,i=t?fo(t):[],a=t?go(t):[];if(i.length===0&&a.length===0){this.historySeries.size>0&&(this.historySeries=new Map),this.historyReadings.size>0&&(this.historyReadings=new Map);return}let r={};for(let s of i)r[s.key]=Nl(s);let o={};for(let s of a)o[s.key]=Pl(s);try{let[s,l]=await Promise.all([zl(this.hass,r),Ol(this.hass,o).catch(()=>({}))]),d=Dl({...s,...l});this.historySeries=d.series,this.historyReadings=d.readings}catch{}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await _l(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=oc(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Ft(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let d=Hx(o.remaining);d!==void 0&&(l.remaining=d)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(t=!0){let i=new Map;for(let[r,o]of this.compiled?.entities??[]){let s=this.entityStateFor(r,o.iconName??"",t);s&&i.set(r,s)}let a=this.draft?.config.values??[];return{entityStates:i,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:t?Qd(a,this.testValues):a,dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3,testedEntities:t?new Set(this.testValues.keys()):new Set}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${t?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${G("expand")}</button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[t],s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
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
    </dialog>`}renderHelpDialog(){let t=on,i=tl,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${na}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a folder to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Expand","The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"],["Share \xB7 Import","Share turns this complication into text you can post anywhere, with your entity ids replaced by numbered slots. Import pastes that text back and asks which of your entities each slot means"]],o=s=>s.map(([l,d])=>h`<tr><th scope="row"><kbd>${l}</kbd></th><td>${d}</td></tr>`);return h`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?Lo(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){if(this.picking){i.preventDefault(),this.pickAt(t,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,s=a.closest("svg.complication");if(this.showTaps){let A=this.focusTapId();if(A!==void 0&&o===A&&s&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,s,A,r??void 0);return}let j=this.hitLayerId(i);j?this.inspect={kind:"layer",id:j}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let l=nh(i);if(!l&&this.multi.size>0&&(this.multi=new Set),!o||!s)return;let d=Lo(this.draft.config,o),c=this.draft.config.elements.find(A=>A.payload.id===d);if(!d||!c)return;if(l){i.preventDefault(),this.togglePick(d);return}let u,p=this.inspect.kind==="layer"?this.inspect.id:void 0;if(p!==void 0&&p!==d&&!r){let A=this.draft.config.elements.find(U=>U.payload.id===p);A!==void 0&&A.kind!=="chartDots"&&A.kind!=="chartGrid"&&A.payload.chartAnchor?.place!=="through"&&ut(this.draft.config,p)?.locked!==!0&&Fx(s,p,i)&&(u=d,d=p,c=A)}let m=ut(this.draft.config,d),y=m!==void 0&&this.inspect.kind==="group"&&this.inspect.id===m.id;if(m&&(m.locked||y)&&!r){this.beginGroupGesture(t,i,s,m);return}if((this.inspect.kind!=="layer"||this.inspect.id!==d)&&(this.inspect={kind:"layer",id:d},r)||c.payload.chartAnchor?.place==="through")return;i.preventDefault();let g=Re(this.draft.config,t,c).frame,x=this.gestureCanvas(t),k=c.payload.chartAnchor,C=k!==void 0&&!dt(k.at)&&k.place!=="through",$=k!==void 0&&dt(k.at)&&k.place==="through",S=ue[t],L={dx:k?.dx??0,dy:k?.dy??0},_=k!==void 0&&!r?Vi(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(A=>A.id===d)?.frame:void 0,H=_??g,J=A=>Math.round(A*10)/10;this.cancelGesture?.();let R=!1;this.cancelGesture=lr(s,x,i,{elementId:d,frame:H,handle:r??void 0},{onFrame:(A,j,U)=>{if(U||(R=!0),U&&!R&&u!==void 0){this.inspect={kind:"layer",id:u},this.cancelGesture=void 0;return}this.mutate(ne=>{if(k===void 0){Ce(ne,t,A,{frame:j});return}let z=_?{width:g.width,height:g.height}:{width:j.width,height:j.height};Ce(ne,t,A,{frame:{...j,...z,x:C?j.x:g.x,y:g.y}});let b=ne.elements.find(T=>T.payload.id===A)?.payload.chartAnchor;if(b===void 0)return;let v=L.dx,E=$?L.dy:J(L.dy+(j.y-H.y)*S.height);v?b.dx=v:delete b.dx,E?b.dy=E:delete b.dy},`drag-${A}-${t}`),U&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r){let o=this.draft?.config;if(!o)return;let s=St(o,r.id);if(s.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let l=new Map(s.map(x=>[x.payload.id,Re(o,t,x).frame])),d=[...l.values()],c=Math.min(...d.map(x=>x.x)),u=Math.min(...d.map(x=>x.y)),p=Math.max(...d.map(x=>x.x+x.width)),m=Math.max(...d.map(x=>x.y+x.height)),y={x:c,y:u,width:p-c,height:m-u,rotationDegrees:0},g=x=>Math.round(x*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=lr(a,this.gestureCanvas(t),i,{elementId:r.id,frame:y},{onFrame:(x,k,C)=>{let $=k.x-y.x,S=k.y-y.y;this.mutate(L=>{for(let[_,H]of l)Ce(L,t,_,{frame:{...H,x:g(H.x+$),y:g(H.y+S)}})},`drag-group-${r.id}-${t}`),C&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?pu:1,s=t*o,l=i*o,d=this.canvasFamily,c=ue[d];if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let k=this.inspect.id;return this.nudgeMany(St(r,k).map(C=>C.payload.id),d,c,`nudge-group-${k}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find(k=>k.payload.id===u);if(!p||p.payload.chartAnchor?.place==="through")return!1;let m=ut(r,u);if(m?.locked)return this.nudgeMany(St(r,m.id).map(k=>k.payload.id),d,c,`nudge-group-${m.id}-${d}`,s,l);let y=Re(r,d,p).frame,g=p.payload.chartAnchor;if(g!==void 0){let k=!dt(g.at);return l===0&&!(k&&s!==0)||this.mutate(C=>{k&&s!==0&&Ce(C,d,u,{frame:sr(y,s,0,c)});let $=C.elements.find(L=>L.payload.id===u)?.payload.chartAnchor;if($===void 0||l===0)return;let S=Math.round((($.dy??0)+l)*10)/10;S?$.dy=S:delete $.dy},`nudge-${u}-${d}`),!0}let x=sr(y,s,l,c);return(x.x!==y.x||x.y!==y.y)&&this.mutate(k=>Ce(k,d,u,{frame:x}),`nudge-${u}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=S=>Math.round(S*1e3)/1e3,c=new Map;for(let S of t){let L=l.elements.find(_=>_.payload.id===S);L&&c.set(S,Re(l,i,L).frame)}if(c.size===0)return!1;let u=[...c.values()],p=Math.min(...u.map(S=>S.x)),m=Math.min(...u.map(S=>S.y)),y=Math.max(...u.map(S=>S.x+S.width)),g=Math.max(...u.map(S=>S.y+S.height)),x={x:p,y:m,width:y-p,height:g-m,rotationDegrees:0},k=sr(x,o,s,a),C=k.x-x.x,$=k.y-x.y;return(C!==0||$!==0)&&this.mutate(S=>{for(let[L,_]of c)Ce(S,i,L,{frame:{..._,x:d(_.x+C),y:d(_.y+$)}})},r),!0}gestureCanvas(t){let i=Ya(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=ss(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:Oe(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let d=ge(s,l),c=Re(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=lr(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o},{onFrame:(u,p,m)=>{this.mutate(y=>{d?Vd(y,u,t,p):Ce(y,t,u,{frame:p})},`tap-box-${u}-${t}`),m&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:ih(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>Choose watch
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${this.owners.map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${ah(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${Xp()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${Xp()}`:f}
        ${this.renderNewButton()}
        <span class="spacer"></span>
        <button class="help" title="Keys and mouse tips" aria-label="Keys and mouse tips" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${G("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${G("redo")}</button>
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
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}${this.renderSharedValues()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=t?.complication_count??0,a=i===0?"Nothing on this watch changes until then.":`Your ${i} complication${i===1?"":"s"} keep${i===1?"s":""} working until then.`;return h`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${G("watch")}</div>
        <div class="gate-eyebrow">Watch app update coming soon</div>
        <h2 class="gate-title">This watch needs the new app.</h2>
        <p class="gate-lead">${Uc(t?.app_version)}</p>
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
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...id(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(te).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t){return h`<span class="shape-dots">${_n.map(i=>h`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${te(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=Zn(t.document),r={revision:t.revision,config:a,entities:[...Ua(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??ls(a)??"inline",s=new Map;for(let c of i.entities){let u=this.entityStateFor(c.entityId,c.iconName??"",!1);u&&s.set(c.entityId,u)}let l=Vi(a,{entityStates:s,templateResults:new Map,namedValues:a.values});if(o==="inline")return h`<span class="pk-art inline">${this.renderInlinePreview(l.inline,!0)}</span>`;let d=l[o];return d?h`<span class="pk-art ${o}">${Ja(d,{icons:this.icons,imageSizes:this.imageSizes,slot:ri.slots[o]})}</span>`:h`<span class="pk-art"></span>`}renderPickerFilter(t){let i=r=>r.kind==="record"?Qs(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${_n.map(r=>a(r,te(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=this.records.find(d=>d.id===this.selectedId),a=t?t.config.name.trim()||"Untitled":"No complication",r=t?t.config.supportedFamilies:[],o=this.pickerRows(),s=this.pickerFilter,l=s==="all"?o:o.filter(d=>(d.kind==="record"?Qs(d.record):d.families).includes(s));return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?h`<span class="pk-rev">r${i.revision}</span>`:t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:f}
        ${G("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${o.length>=N.FILTER_FROM_ROWS?this.renderPickerFilter(o):f}
        ${o.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.length>0&&l.length===0?h`<div class="empty">Nothing on this watch has a ${s==="all"?"":te(s)} shape.</div>`:f}
        ${l.map(d=>d.kind==="record"?h`<button class="row" role="option" aria-current=${d.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(d.record)}}>
              ${this.renderRowArt(d.record)}
              <span class="pk-name">${String(d.record.document?.name??"Untitled")}</span>
              ${this.shapeDots(Qs(d.record))}
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
        @click=${()=>this.openNewDialog()}>${G("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?"This watch has no free slot. Delete a complication first.":"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">watch is full</span>`:f}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return"A complication on this watch already has that name."}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${G("close")}</button>
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
            ${_n.map(r=>h`<button type="button" role="radio" class="shape-card ${this.newFamily===r?"on":""}"
              aria-checked=${this.newFamily===r?"true":"false"}
              @click=${()=>{this.newFamily=r}}>
              ${Cx(r)}
              <span class="shape-card-name">${te(r)}</span>
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
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.draft?.config;return t?Op(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config;if(!t)return f;let i=this.currentShareSlots(),a=Bp(t,this.shareMode,i),r=(o,s,l)=>h`<label class="xfer-mode">
      <input type="radio" name="wa-share-mode" .checked=${this.shareMode===o}
        @change=${()=>{this.shareMode=o,this.shareNote=""}} />
      <span><b>${s}</b><span class="hint">${l}</span></span>
    </label>`;return h`<dialog class="share-dialog" @close=${()=>{this.shareOpen=!1}}>
      <div class="new-head">
        <h2>Share this complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Close" aria-label="Close" @click=${()=>this.closeShareDialog()}>${G("close")}</button>
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
    </div>`}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareNote="",this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}async copyShareText(t){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.shareNote="Copied.";return}}catch{}let i=this.renderRoot.querySelector("dialog.share-dialog textarea");i?.focus(),i?.select();let a=!1;try{a=document.execCommand("copy")}catch{a=!1}this.shareNote=a?"Copied.":"Press Cmd+C or Ctrl+C to copy."}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=Gp(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote=`Saved as ${a}.`}renderImportDialog(){let t=this.importParse,i=t?.ok?t.config:void 0,a=i?Xs(i,this.hass.states):[],r=Js({parsed:i!==void 0,name:this.importName,taken:this.takenNames(),unchosen:this.unchosenCount(a)});return h`<dialog class="import-dialog" @keydown=${this.importKeys} @close=${()=>{this.importOpen=!1}}>
      <div class="new-head">
        <h2>Import a complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeImportDialog()}>${G("close")}</button>
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
      ${r?h`<div class="hint err">A complication on this watch already has that name.</div>`:h`<div class="hint">${jp(t)}. It opens in the editor and reaches the watch at the first Save.</div>`}
      ${i.length===0?h`<div class="hint">Every entity this design reads is already in your Home Assistant.</div>`:h`<div class="field">
            <span>Entities</span>
            <div>${i.map(o=>this.renderImportRow(o))}</div>
          </div>`}
      ${Vp(t)?h`<div class="hint warn">This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</div>`:f}`}renderImportRow(t){let i=this.importMap.get(t.entityId);return h`<div class="xfer-ent">
      ${gt({hass:this.hass},t.label,i??vx,a=>this.setImportEntity(t.entityId,a),Yp(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&i===void 0})}
      <div class="hint">${t.where.join(", ")}</div>
      <div class="hint">${t.required?"Choose the entity this design should read.":"Not in your Home Assistant right now; leave it to keep the id."}</div>
    </div>`}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,Ar(this.hass.states,i.entityId)),this.importMap=a}setImportText(t){this.importText=t;let i=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,a=t.trim()===""?void 0:Up(t,this.maxSchemaVersion);if(this.importParse=a,!a?.ok){this.importMap=new Map,this.importName="";return}JSON.stringify(a.config)!==i&&(this.importMap=new Map,this.importName=Wp(a.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];if(a){try{this.setImportText(await a.text())}catch(r){this.importParse={ok:!1,error:`That file could not be read: ${Ft(r)}`}}i.value=""}}doImport(){let t=this.importParse;if(!t?.ok)return;let i=Kp(t.config,this.importMap);i.id=X(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=gn(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("textarea")?.focus())}))}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importOpen=!1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
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
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${ah(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return f;if(this.activeFamily==="inline")return f;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${G("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?f:h`<span class="mini">${ds.length} kinds · ${ta.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([s,l])=>h`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${G(s)}</button>`)}
              </span>
            </span>`:f}
        <span class="chev">${G("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${ds.map(s=>h`<button class="add" style=${`--k:${Ge[s]}`} ?disabled=${i} title=${`Add a blank ${Jt[s].toLowerCase()} layer`}
              @click=${()=>{let l=we(s);this.addHere(d=>{d.elements.push(l),l.kind==="timeline"&&En(d,l.payload.id)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?h`<span class="well">${uu(s)}</span>`:f}<span class="add-name">${r?G(s):h`<span class="k"></span>`}<span>${Jt[s]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${ta.map(s=>h`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:f}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(y=>!ge(o,y)),l=o.elements.filter(y=>ge(o,y)),d=[...s].reverse(),c=d.find(y=>y.payload.id===i);if(!c)return;let u=o.groups?.find(y=>y.id===t),p=u?d.filter(y=>y.payload.groupId===u.id):d.filter(y=>y.payload.id===t);if(p.length===0||p.includes(c))return;d=d.filter(y=>!p.includes(y));let m;if((u||r)&&c.payload.groupId!==void 0){let y=d.filter(g=>g.payload.groupId===c.payload.groupId);m=a?d.indexOf(y[0]):d.indexOf(y[y.length-1])+1}else m=d.indexOf(c)+(a?0:1);if(d.splice(m,0,...p),!u){let y=p[0],g=r?void 0:c.payload.groupId;g===void 0?delete y.payload.groupId:y.payload.groupId=g}o.elements=[...d.reverse(),...l],at(o),ei(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?Rt:0),l=o.bottom-(r.classList.contains("drop-after")?Rt:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(nh(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!ge(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=Ro(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return f;if(this.activeFamily==="inline")return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(R,A)=>this.moveLayer(R,A),o=R=>{let A;this.mutate(j=>{A=Gd(j,R)}),A&&(this.inspect={kind:"layer",id:A})},s=R=>{this.mutate(A=>fe(A,R)),this.inspect.kind==="layer"&&this.inspect.id===R&&(this.inspect={kind:"general"})},l=pt(t,a).filter(R=>!ge(t,R)).reverse(),d=de(this.host()),c=new ht(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",m=`${u?.backgroundColorHex?Ee(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,y=[...this.multi].filter(R=>t.elements.some(A=>A.payload.id===R)).length,g=Vi(t,this.buildContext(),this.forced)[a],x=rh[this.thumbStep],k=Math.round(nl*x),C=Math.round(il*x),$=R=>g?h`<span class="thumb">${Nc(g,R,{icons:this.icons,imageSizes:this.imageSizes,width:k,height:C})}</span>`:h`<span class="thumb"></span>`,S=this.layerDetail==="expanded",L=(R,A,j=!1)=>{let U=R.payload.id,ne=this.inspect.kind==="layer"&&this.inspect.id===U,z=Re(t,a,R),b=z.isHidden,v=Oe(t,U)[0],E=Ui(R.payload.rules),T=this.picking&&this.pickHoverId===U,F=this.rowDrag(U,i);return h`<div class="layer ${ne?"hl":""} ${j?"held":""} ${T?"pick":""} ${b?"dim":""} ${this.multi.has(U)?"multi":""} ${A?"kid":""} ${S?"rich":""}"
        style=${`--k:${Ge[R.kind]}`} tabindex="0" draggable=${F.draggable}
        @pointerenter=${()=>{this.listHoverIds=[U]}}
        @pointerleave=${()=>this.leaveRow([U])}
        @click=${O=>this.clickRow(U,O)}
        @keydown=${O=>{O.key==="Enter"&&(this.inspect={kind:"layer",id:U})}}
        @dragstart=${F.onStart} @dragend=${F.onEnd} @dragover=${F.onOver} @drop=${F.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${G("grip")}</span>
        <span class="bar"></span>
        ${$([U])}
        <span class="name">
          <b>${Se(R,d)}</b>
          <small><span class="kind">${Jt[R.kind]}</span> · ${_x(R,c,this.historySeries,z.size)}</small>
          ${S?h`<span class="facts">${Ix(this.host(),a,R,z).map(O=>h`<span class="fact"><b>${O.label}</b> ${O.value}</span>`)}</span>`:f}
        </span>
        <span class="right">
          <span class="badges">
            ${v?h`<span class="badge tap" title=${`Tappable \xB7 ${Se(v,d)}`}>tap</span>`:f}
            ${R.payload.rules.length===0?f:h`<span class="badge states" title=${E}>${E.replace(/\.$/,"").toLowerCase()}</span>`}
            ${b?h`<span class="badge">hidden</span>`:f}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${on}])`} aria-label="Bring forward" @click=${O=>{O.stopPropagation(),r(U,1)}}>${G("up")}</button>
            <button class="icon" title=${`Send back (${on}[)`} aria-label="Send back" @click=${O=>{O.stopPropagation(),r(U,-1)}}>${G("down")}</button>
            <button class="icon" title=${`${z.isHidden?"Show":"Hide"} (${tl}${on}H)`} aria-label=${z.isHidden?"Show this layer":"Hide this layer"} @click=${O=>{O.stopPropagation(),this.mutate(K=>Ce(K,a,U,{isHidden:!z.isHidden}))}}>${G(z.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${on}D)`} aria-label="Duplicate" @click=${O=>{O.stopPropagation(),o(U)}}>${G("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${O=>{O.stopPropagation(),s(U)}}>${G("delete")}</button>
          </span>`:f}
        </span>
      </div>`},_=(R,A)=>{let j=this.inspect.kind==="group"&&this.inspect.id===R.id,U=!this.collapsed.has(R.id),ne=this.rowDrag(R.id,i),z=A[0],b=A[A.length-1],v=T=>{let F=T.currentTarget,O=F.getBoundingClientRect(),K=O.top+(F.classList.contains("drop-before")?Rt:0),se=O.bottom-(F.classList.contains("drop-after")?Rt:0),Ke=(T.clientY-K)/Math.max(1,se-K);return Ke<.25?"drop-before":!U&&Ke>.75?"drop-after":"drop-into"},E=A.map(T=>T.payload.id);return h`<div class="layer group ${j?"hl":""} ${S?"rich":""}" style=${`--k:${Z.group}`} tabindex="0" draggable=${ne.draggable}
        @pointerenter=${()=>{this.listHoverIds=E}}
        @pointerleave=${()=>this.leaveRow(E)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:R.id}}}
        @keydown=${T=>{T.key==="Enter"&&(this.inspect={kind:"group",id:R.id})}}
        @dragstart=${ne.onStart} @dragend=${ne.onEnd}
        @dragover=${T=>{!this.dragId||this.dragId===R.id||(T.preventDefault(),this.markDrop(T.currentTarget,v(T)))}}
        @drop=${T=>{T.preventDefault();let F=v(T);this.clearDragMarks();let O=this.dragId;if(this.dragId=void 0,!(!O||!z||!b)){if(F==="drop-before"){this.reorderLayer(O,z.payload.id,!0,!0);return}if(F==="drop-after"){this.reorderLayer(O,b.payload.id,!1,!0);return}this.isGroupId(O)||(this.reorderLayer(O,z.payload.id,!0),this.mutate(K=>Ii(K,O,R.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${G("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${G("folder")}</span>
        <span class="name">
          <b>${R.name}</b>
          <small><span class="kind">Group</span> · ${A.length} layer${A.length===1?"":"s"} · ${R.locked?"locked":"unlocked"}</small>
          ${S?h`<span class="facts"><span class="fact"><b>Holds</b> ${A.map(T=>Se(T,d)).join(", ")}</span></span>`:f}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${tl}${on}G)`} aria-label="Ungroup" @click=${T=>{T.stopPropagation(),this.mutate(F=>Hi(F,R.id)),j&&(this.inspect={kind:"general"})}}>${G("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${R.locked?"on":""}" ?disabled=${!i}
            title=${R.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${R.locked?"Unlock the group":"Lock the group"}
            @click=${T=>{T.stopPropagation(),this.mutate(F=>{let O=F.groups?.find(K=>K.id===R.id);O&&(O.locked=!O.locked)})}}>${G(R.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${U?"true":"false"} title=${U?"Fold the group":"Unfold the group"}
            @click=${T=>{T.stopPropagation();let F=new Set(this.collapsed);U?F.add(R.id):F.delete(R.id),this.collapsed=F}}>${G("chevron")}</button>
        </span>
      </div>`},H=[],J=new Set;for(let R=0;R<l.length;R++){let A=l[R],j=A.payload.groupId,U=j===void 0?void 0:t.groups?.find(b=>b.id===j);if(!U){H.push(L(A,!1));continue}if(J.has(U.id))continue;J.add(U.id);let ne=l.filter(b=>b.payload.groupId===U.id);H.push(_(U,ne));let z=this.inspect.kind==="group"&&this.inspect.id===U.id;this.collapsed.has(U.id)||H.push(h`<div class="group-kids">${ne.map(b=>L(b,!0,z))}</div>`)}return h`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${k}px;--thumb-h:${C}px`}>
      <h2 class="panel-title tools" style=${`--c:${Z.place}`}><span class="swatch">${G("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([R,A])=>h`
              <button class=${this.layerDetail===R?"on":""} title=${A} aria-label=${A} aria-pressed=${this.layerDetail===R?"true":"false"}
                @click=${()=>{this.layerDetail=R,this.saveListView()}}>${G(R)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${Sx.map((R,A)=>h`
              <button class=${this.thumbStep===A?"on":""} title=${`${Qp[A]} row pictures`}
                aria-label=${`${Qp[A]} row pictures`} aria-pressed=${this.thumbStep===A?"true":"false"}
                @click=${()=>{this.thumbStep=A,this.saveListView()}}>${R}</button>`)}
          </span>
        </span>
      </h2>
      ${y>=2&&i?h`<div class="group-cta"><span>${y} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${on}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${na}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:f}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:f}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${H}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${Z.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${R=>{R.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${R=>{this.dragId&&(R.preventDefault(),this.markDrop(R.currentTarget,"drop-before"))}}
        @drop=${R=>{R.preventDefault(),this.clearDragMarks();let A=this.dragId,j=[...l].reverse().find(U=>U.payload.id!==A&&U.payload.groupId!==A);A&&j&&this.reorderLayer(A,j.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${G("shape")}</span>
        <span class="bar"></span>
        ${$([])}
        <span class="name">
          <b>${te(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${m}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${G("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?Ip(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?f:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${gt(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},qp,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=zp(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Vi(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          ${this.renderShapeTabs(t,i)}
          <span class="spacer"></span>
          <span class="inbox" title=${`Layouts are made in the ${ri.label} box. Smaller cases scale it down.`}>
            <span class="pre">Preview as</span>
            <select aria-label="Preview as" @change=${o=>{this.previewCase=o.target.value}}>
              ${Bi.map(o=>h`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
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
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?ut(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||ut(s,o)?.locked)?St(s,l).map(x=>x.payload.id):[],c=[...new Set([...d,...this.multi])],u=a.slots[t],p=this.focusTapId(),m=!this.picking&&!this.showTaps&&this.rowHoverId!==void 0&&s?.elements.some(x=>x.payload.id===this.rowHoverId)?this.rowHoverId:void 0,y=m!==void 0?[]:this.listHoverIds,g={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??m??o,...c.length>0&&!this.showTaps&&m===void 0?{highlightIds:c}:{},tapReview:this.showTaps,...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:y.length>0?{hoverIds:y}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${x=>this.onPreviewPointerDown(t,x)}
      @pointermove=${x=>this.onPickMove(x)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Ja(r,g)}
    </div>`}renderUnder(t,i){let a=de(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(u=>u.payload.id===r.id):void 0,s;if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${$t(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let u=t.groups?.find(m=>m.id===r.id),p=u?St(t,u.id).length:0;s=u?h`editing group <b>${u.name}</b>. Drag to move all ${p} layers.${u.locked?"":" Click one layer to move it alone."}`:""}else if(o){let u=ut(t,o.payload.id);s=u?.locked?h`editing <b>${Se(o,a)}</b> in <b>${u.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${Se(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else s="click a layer to edit it";if(i==="inline")return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let l=this.currentCase().slots[i],d=Ya(l,i),c=Math.round(d.scale*100);return h`<div class="under">
      <b>${te(i)}</b>
      <span class="size">${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?ii((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??f}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(){let t=this.draft?.config;if(!t)return f;let i=t.values,a=this.canEdit?h`<button class="small" @click=${()=>{let c=fp();this.mutate(u=>{u.values.push(c)}),this.openSharedValue(c.id)}}>Add</button>`:f,r="Like a variable: set it once, and every layer that reads it follows.",o=h`<h2 class="panel-title"><span class="swatch">${G("content")}</span>Shared values
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
      </div>`:f}`;if(i.length===0)return h`<div class="card tint-values values-list ${this.sharedHelp?"":"empty-list"}" style=${`--c:${Z.complication}`}>
        ${o}
      </div>`;let s=this.host(),l=new ht(this.buildContext(),this.draft?.config),d=de(s);return h`<div class="card tint-values values-list" style=${`--c:${Z.complication}`}>
      ${o}
      <div class="data">
      ${i.map(c=>{let u=l.resolve({kind:{kind:"named",id:c.id}}),p=this.openValue===c.id,m=()=>{this.setOpenValue(p?void 0:c.id)};return h`<div class="vitem ${p?"open":""}"><div class="datum vrow ${p?"hl":""}" role="button" tabindex="0" aria-expanded=${p?"true":"false"}
            title=${p?"Close":"Edit this shared value"}
            @click=${m}
            @keydown=${y=>{(y.key==="Enter"||y.key===" ")&&y.target===y.currentTarget&&(y.preventDefault(),m())}}>
          <span class="nm">${c.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${u===void 0?"none":""}" title=${ke(c.value,d)}>${u??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${y=>{y.stopPropagation(),this.mutate(g=>{Po(g,c.id)}),p&&(this.openValue=void 0)}}>${G("delete")}</button>`:f}
        </div>
        ${p?h`<div class="value-open">${mp(s,c)}</div>`:f}</div>`})}
      </div>
    </div>`}setOpenValue(t){let i=this.openValue;if(this.openValue=t,i===void 0||i===t)return;let a=this.draft?.config.values.find(r=>r.id===i);a&&a.name.trim()===""&&this.mutate(r=>{Po(r,i)})}openSharedValue(t){this.renderRoot.querySelectorAll(":popover-open").forEach(a=>a.hidePopover()),this.setOpenValue(t);let i=this.draft?.config.values.find(a=>a.id===t)?.name.trim()==="";this.updateComplete.then(()=>{this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({block:"start",behavior:"smooth"}),i&&this.renderRoot.querySelector(".values-list .value-open input[type=text]")?.focus({preventScroll:!0})})}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies;return _n.map(r=>{if(!a.includes(r))return h`<button class="tab off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${te(r)} shape`} @click=${()=>this.addShape(r)}>
          ${G("plus")}${te(r)}
        </button>`;let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?Ja(c,{icons:this.icons,imageSizes:this.imageSizes,slot:ri.slots[r]}):f}let l=r!=="inline"&&Ir(t,r)===0&&t.elements.length>0,d=this.canEdit&&Qa(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${te(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${te(r)}</span>${l?h`<small>nothing shown</small>`:f}${o?h`<small>editing</small>`:f}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!d}
          title=${d?`Remove the ${te(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${te(r)} shape`}
          @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${G("delete")}</button>`:f}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return f;let i=[...this.compiled?.entities.keys()??[]],a=Zd(t),r=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${Z.states}`}>
      <h2 class="panel-title"><span class="swatch">${G("states")}</span>Values on the watch
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${r?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.editingValue=void 0,this.applyTestValues(new Map)}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0&&a.length===0?h`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:h`<div class="chips values">
        ${i.map(o=>{let s=this.hass.states[o],l=typeof s?.attributes.friendly_name=="string"?s.attributes.friendly_name:o,d=typeof s?.attributes.unit_of_measurement=="string"?` ${s.attributes.unit_of_measurement}`:"",c=s?`${s.state}${d}`:"not in Home Assistant",u=this.testValues.get(o),m=t.elements.find(y=>Da(t,y.payload.id).some(g=>g.ref.entityId===o))?.kind??"text";return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${Ge[m]}`}
            title=${u!==void 0?`Live value: ${c}`:""}>
            <span class="kbar"></span><b>${l}</b><span class="spacer"></span>
            ${this.renderTestControl(o,l,s,u,d,c)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the live value: ${c}`} @click=${()=>this.setTestValue(o,void 0)}>Live</button>`:f}
          </div>`})}
        ${a.map(o=>{let s=Ko(o.id),l=this.sharedRaw(o.id)??"",d=l===""?"empty":l,c=o.name||"(unnamed)",u=this.testValues.get(s),p={entity_id:s,state:l,attributes:{},last_changed:"",last_updated:""};return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${Z.complication}`}
            title=${u!==void 0?`Saved value: ${d}`:""}>
            <span class="kbar"></span><b>${c}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(s,c,p,u,"",d)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the saved value: ${d}`} @click=${()=>this.setTestValue(s,void 0)}>Live</button>`:f}
          </div>`})}
      </div>`}
    </div>`}renderTestControl(t,i,a,r,o,s){let l=r??a?.state??"",d=ec(t,a,r);if(d.kind==="choice")return h`<span class="test-ctl"><select aria-label=${`Test value for ${i}`} @change=${m=>this.setTestValue(t,m.target.value)}>
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
    </span>`}commitTestValue(t,i){this.editingValue=void 0,this.setTestValue(t,i)}setTestValue(t,i,a){let r=i?.trim()??"",o=new Map(this.testValues),s=t.startsWith(Ga)?this.sharedRaw(t.slice(Ga.length)):this.hass.states[t]?.state;r===""||r===s?o.delete(t):o.set(t,r),this.applyTestValues(o,a)}sharedRaw(t){let i=this.draft?.config;if(!i)return;let a=this.buildContext(!1),r=a.namedValues.map(o=>({...o,value:{kind:o.value.kind}}));return new ht({...a,namedValues:r},i).resolve({kind:{kind:"named",id:t}})}applyTestValues(t,i){let a=this.draft;!a||t.size===a.testValues.size&&[...t].every(([o,s])=>a.testValues.get(o)===s)||(a.setTestValues(t,i),this.version++)}currentCase(){return Bi.find(t=>t.label===this.previewCase)??ri}previewSlot(t){return this.currentCase().slots[t]}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":te(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${Z.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=f,d=f;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${i} layers</span></span>`;else if(a.kind==="layer"){let c=t.elements.find(u=>u.payload.id===a.id);if(c){l=h`<span class="here" style=${`--k:${Ge[c.kind]}`}><span class="kchip">${Jt[c.kind]}</span><span class="nm" title=${Se(c,de(this.host()))}>${Se(c,de(this.host()))}</span></span>`;let u=ut(t,c.payload.id);u&&(d=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(u=>u.id===a.id);c&&(l=h`<span class="here" style=${`--k:${Z.group}`}><span class="kchip">Group</span><span class="nm" title=${c.name}>${c.name}</span></span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${d}
      ${l===f?f:h`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}complicationHead(t){let i=t.name.trim()||"Complication";return h`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${Z.complication}`}>${i}</span></div>
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
          ${ve(a,"complication","Complication",pp(a),{color:Z.complication,icon:"watch",alwaysOpen:!0})}
          <p class="insp-note">Click a layer on the watch or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>
        </div>`;let s=f,l=!0;if(r.kind==="layer"){let c=t.elements.find(u=>u.payload.id===r.id);if(!c)return this.inspect={kind:"general"},f;s=wp(a,c,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let c=t.groups?.find(u=>u.id===r.id);if(!c)return this.inspect={kind:"general"},f;l=!1,s=kp(a,c)}else s=$p(a,this.activeFamily);let d=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?h`<button class="expand" @click=${()=>{this.openSections=d?new Set([$x(r)]):new Set(Ps)}}>${d?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${s}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:f}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=de(r),s=new ht(this.buildContext(),this.draft?.config),l=yp(t,a,i),d=i.length,c=[...i].reverse(),u=m=>this.mutate(y=>{for(let g of i)Ce(y,a,g.payload.id,{isHidden:m})}),p=m=>this.mutate(y=>{for(let g of i){let x=y.elements.find(k=>k.payload.id===g.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&x.kind!=="timeline"&&x.kind!=="chartTimes"&&x.kind!=="chartDots"&&x.kind!=="chartGrid"&&x.kind!=="imageTime"&&(x.payload.colorSlot.baseColorHex=m)}},"multi-colour");return h`
      ${ve(r,"picked",`${d} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${c.map(m=>h`<div class="row" style=${`--k:${Ge[m.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${m.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(m.payload.symbol)??"questionmark",16,m.payload.colorSlot.baseColorHex)??f}</span>`:f}
                  <b>${Se(m,o)}</b><span class="kind">${Jt[m.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${on}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${na}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${d}`,alwaysOpen:!0})}
      ${ve(r,"picked-common",`All ${d} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${pe("Colour",l.colour,m=>{m!==void 0&&p(m)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:f}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${te(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:Z.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return f;let i=this.records.find(r=>r.id===this.selectedId),a=Yc({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
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
    </details>`}};V([qn({attribute:!1})],N.prototype,"hass",2),V([qn({type:Boolean})],N.prototype,"narrow",2),V([qn({attribute:!1})],N.prototype,"panel",2),V([B()],N.prototype,"colLeft",2),V([B()],N.prototype,"colRight",2),V([B()],N.prototype,"panelWidth",2),V([B()],N.prototype,"owners",2),V([B()],N.prototype,"ownerId",2),V([B()],N.prototype,"records",2),V([B()],N.prototype,"selectedId",2),V([B()],N.prototype,"draft",2),V([B()],N.prototype,"readOnlyReason",2),V([B()],N.prototype,"parseError",2),V([B()],N.prototype,"maxSchemaVersion",2),V([B()],N.prototype,"presets",2),V([B()],N.prototype,"occupied",2),V([B()],N.prototype,"serverToken",2),V([B()],N.prototype,"appliedToken",2),V([B()],N.prototype,"sendStatusKnown",2),V([B()],N.prototype,"polling",2),V([B()],N.prototype,"lastPollSeconds",2),V([B()],N.prototype,"sendPending",2),V([B()],N.prototype,"pages",2),V([B()],N.prototype,"templateResults",2),V([B()],N.prototype,"historySeries",2),V([B()],N.prototype,"historyReadings",2),V([B()],N.prototype,"templateError",2),V([B()],N.prototype,"templateFetchedAt",2),V([B()],N.prototype,"forced",2),V([B()],N.prototype,"showRaw",2),V([B()],N.prototype,"inspect",2),V([B()],N.prototype,"openSections",2),V([B()],N.prototype,"helpSections",2),V([B()],N.prototype,"pickerOpen",2),V([B()],N.prototype,"pickerFilter",2),V([B()],N.prototype,"pickerNote",2),V([B()],N.prototype,"openValue",2),V([B()],N.prototype,"sharedHelp",2),V([B()],N.prototype,"editingValue",2),V([B()],N.prototype,"thumbStep",2),V([B()],N.prototype,"layerDetail",2),V([B()],N.prototype,"addOpen",2),V([B()],N.prototype,"addDetail",2),V([B()],N.prototype,"multi",2),V([B()],N.prototype,"collapsed",2),V([B()],N.prototype,"activeFamily",2),V([B()],N.prototype,"picking",2),V([B()],N.prototype,"pickHoverId",2),V([B()],N.prototype,"listHoverIds",2),V([B()],N.prototype,"rowHoverId",2),V([B()],N.prototype,"zoomed",2),V([B()],N.prototype,"helpOpen",2),V([B()],N.prototype,"showTaps",2),V([B()],N.prototype,"savedName",2),V([B()],N.prototype,"presetKind",2),V([B()],N.prototype,"presetEntity",2),V([B()],N.prototype,"newOpen",2),V([B()],N.prototype,"newName",2),V([B()],N.prototype,"newFamily",2),V([B()],N.prototype,"shareOpen",2),V([B()],N.prototype,"shareMode",2),V([B()],N.prototype,"shareLabels",2),V([B()],N.prototype,"shareNote",2),V([B()],N.prototype,"importOpen",2),V([B()],N.prototype,"importText",2),V([B()],N.prototype,"importParse",2),V([B()],N.prototype,"importName",2),V([B()],N.prototype,"importMap",2),V([B()],N.prototype,"previewCase",2),V([B()],N.prototype,"loadError",2),V([B()],N.prototype,"saveError",2),V([B()],N.prototype,"saving",2),V([B()],N.prototype,"conflict",2),V([B()],N.prototype,"remoteRevision",2),V([B()],N.prototype,"confirmDelete",2),V([B()],N.prototype,"moveTarget",2),V([B()],N.prototype,"moving",2),V([B()],N.prototype,"moveError",2),V([B()],N.prototype,"version",2);var al=N;function Ft(e){return String(e?.message??e)}function Hx(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function ah(e){let n=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function Ix(e,n,t,i){let a=[{label:"Shows",value:Bs(e,t)}],r=Sr(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function Lx(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function _x(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Ee(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=$n(e.payload)??Cn(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${Qe(o).length} values`}case"timeline":{let r=ct(e.payload),o=r===void 0?[]:Oi(t.get(r)??""),s=Math.max(0,o.length-1);return`${Lx(it(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Ee(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return e.payload.contentMode==="fill"?"fill":"fit";case"tap":return $t(e.payload.action);case"chartTimes":return`${e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt`;case"chartDots":return`${e.payload.dots==="all"?"every reading":"auto"}${e.payload.size===void 0?"":` \xB7 ${e.payload.size} pt`}`;case"chartGrid":return`${e.payload.lines} ${e.payload.lines===1?"line":"lines"} \xB7 ${e.payload.thickness} pt`;case"imageTime":return}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",al);export{al as WristAssistantPanel,ih as columnFit,Ix as layerFacts};
