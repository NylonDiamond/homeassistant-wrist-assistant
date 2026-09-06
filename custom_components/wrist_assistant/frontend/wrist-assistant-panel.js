var Qo=Object.defineProperty;var es=Object.getOwnPropertyDescriptor;var L=(e,t,n,i)=>{for(var a=i>1?void 0:i?es(t,n):t,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(t,n,a):o(a))||a);return i&&a&&Qo(t,n,a),a};var Bt=globalThis,Gt=Bt.ShadowRoot&&(Bt.ShadyCSS===void 0||Bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Mn=Symbol(),Xi=new WeakMap,wt=class{constructor(t,n,i){if(this._$cssResult$=!0,i!==Mn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Gt&&t===void 0){let i=n!==void 0&&n.length===1;i&&(t=Xi.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Xi.set(n,t))}return t}toString(){return this.cssText}},ce=e=>new wt(typeof e=="string"?e:e+"",void 0,Mn),Hn=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new wt(n,e,Mn)},Zi=(e,t)=>{if(Gt)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let i=document.createElement("style"),a=Bt.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=n.cssText,e.appendChild(i)}},Ln=Gt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let i of t.cssRules)n+=i.cssText;return ce(n)})(e):e;var{is:ts,defineProperty:ns,getOwnPropertyDescriptor:is,getOwnPropertyNames:as,getOwnPropertySymbols:rs,getPrototypeOf:os}=Object,Ut=globalThis,Qi=Ut.trustedTypes,ss=Qi?Qi.emptyScript:"",ls=Ut.reactiveElementPolyfillSupport,$t=(e,t)=>e,kt={toAttribute(e,t){switch(t){case Boolean:e=e?ss:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Kt=(e,t)=>!ts(e,t),ea={attribute:!0,type:String,converter:kt,reflect:!1,useDefault:!1,hasChanged:Kt};Symbol.metadata??=Symbol("metadata"),Ut.litPropertyMetadata??=new WeakMap;var Fe=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=ea){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,n);a!==void 0&&ns(this.prototype,t,a)}}static getPropertyDescriptor(t,n,i){let{get:a,set:r}=is(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:a,set(o){let l=a?.call(this);r?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ea}static _$Ei(){if(this.hasOwnProperty($t("elementProperties")))return;let t=os(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($t("properties"))){let n=this.properties,i=[...as(n),...rs(n)];for(let a of i)this.createProperty(a,n[a])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[i,a]of n)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[n,i]of this.elementProperties){let a=this._$Eu(n,i);a!==void 0&&this._$Eh.set(a,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)n.unshift(Ln(a))}else t!==void 0&&n.push(Ln(t));return n}static _$Eu(t,n){let i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let i of n.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,i){this._$AK(t,i)}_$ET(t,n){let i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:kt).toAttribute(n,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,n){let i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:kt;this._$Em=a;let l=o.fromAttribute(n,r.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(t,n,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??Kt)(r,n)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(n=void 0),this._$AL.set(t,n)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(n)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};Fe.elementStyles=[],Fe.shadowRootOptions={mode:"open"},Fe[$t("elementProperties")]=new Map,Fe[$t("finalized")]=new Map,ls?.({ReactiveElement:Fe}),(Ut.reactiveElementVersions??=[]).push("2.1.2");var Dn=globalThis,ta=e=>e,Wt=Dn.trustedTypes,na=Wt?Wt.createPolicy("lit-html",{createHTML:e=>e}):void 0,la="$lit$",_e=`lit$${Math.random().toFixed(9).slice(2)}$`,da="?"+_e,ds=`<${da}>`,Ke=document,St=()=>Ke.createComment(""),Et=e=>e===null||typeof e!="object"&&typeof e!="function",Bn=Array.isArray,cs=e=>Bn(e)||typeof e?.[Symbol.iterator]=="function",_n=`[ 	
\f\r]`,Ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ia=/-->/g,aa=/>/g,Ge=RegExp(`>|${_n}(?:([^\\s"'>=/]+)(${_n}*=${_n}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ra=/'/g,oa=/"/g,ca=/^(?:script|style|textarea|title)$/i,Gn=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),p=Gn(1),k=Gn(2),Tc=Gn(3),We=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),sa=new WeakMap,Ue=Ke.createTreeWalker(Ke,129);function ua(e,t){if(!Bn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return na!==void 0?na.createHTML(t):t}var us=(e,t)=>{let n=e.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=Ct;for(let l=0;l<n;l++){let s=e[l],d,u,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,u=o.exec(s),u!==null);)h=o.lastIndex,o===Ct?u[1]==="!--"?o=ia:u[1]!==void 0?o=aa:u[2]!==void 0?(ca.test(u[2])&&(a=RegExp("</"+u[2],"g")),o=Ge):u[3]!==void 0&&(o=Ge):o===Ge?u[0]===">"?(o=a??Ct,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?Ge:u[3]==='"'?oa:ra):o===oa||o===ra?o=Ge:o===ia||o===aa?o=Ct:(o=Ge,a=void 0);let g=o===Ge&&e[l+1].startsWith("/>")?" ":"";r+=o===Ct?s+ds:c>=0?(i.push(d),s.slice(0,c)+la+s.slice(c)+_e+g):s+_e+(c===-2?l:g)}return[ua(e,r+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Tt=class e{constructor({strings:t,_$litType$:n},i){let a;this.parts=[];let r=0,o=0,l=t.length-1,s=this.parts,[d,u]=us(t,n);if(this.el=e.createElement(d,i),Ue.currentNode=this.el.content,n===2||n===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(a=Ue.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let c of a.getAttributeNames())if(c.endsWith(la)){let h=u[o++],g=a.getAttribute(c).split(_e),y=/([.?@])?(.*)/.exec(h);s.push({type:1,index:r,name:y[2],strings:g,ctor:y[1]==="."?Pn:y[1]==="?"?Nn:y[1]==="@"?On:st}),a.removeAttribute(c)}else c.startsWith(_e)&&(s.push({type:6,index:r}),a.removeAttribute(c));if(ca.test(a.tagName)){let c=a.textContent.split(_e),h=c.length-1;if(h>0){a.textContent=Wt?Wt.emptyScript:"";for(let g=0;g<h;g++)a.append(c[g],St()),Ue.nextNode(),s.push({type:2,index:++r});a.append(c[h],St())}}}else if(a.nodeType===8)if(a.data===da)s.push({type:2,index:r});else{let c=-1;for(;(c=a.data.indexOf(_e,c+1))!==-1;)s.push({type:7,index:r}),c+=_e.length-1}r++}}static createElement(t,n){let i=Ke.createElement("template");return i.innerHTML=t,i}};function ot(e,t,n=e,i){if(t===We)return t;let a=i!==void 0?n._$Co?.[i]:n._$Cl,r=Et(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,n,i)),i!==void 0?(n._$Co??=[])[i]=a:n._$Cl=a),a!==void 0&&(t=ot(e,a._$AS(e,t.values),a,i)),t}var zn=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:i}=this._$AD,a=(t?.creationScope??Ke).importNode(n,!0);Ue.currentNode=a;let r=Ue.nextNode(),o=0,l=0,s=i[0];for(;s!==void 0;){if(o===s.index){let d;s.type===2?d=new Ft(r,r.nextSibling,this,t):s.type===1?d=new s.ctor(r,s.name,s.strings,this,t):s.type===6&&(d=new Vn(r,this,t)),this._$AV.push(d),s=i[++l]}o!==s?.index&&(r=Ue.nextNode(),o++)}return Ue.currentNode=Ke,a}p(t){let n=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,n),n+=i.strings.length-2):i._$AI(t[n])),n++}},Ft=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,i,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=ot(this,t,n),Et(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==We&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):cs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&Et(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ke.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Tt.createElement(ua(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(n);else{let r=new zn(a,this),o=r.u(this.options);r.p(n),this.T(o),this._$AH=r}}_$AC(t){let n=sa.get(t.strings);return n===void 0&&sa.set(t.strings,n=new Tt(t)),n}k(t){Bn(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,i,a=0;for(let r of t)a===n.length?n.push(i=new e(this.O(St()),this.O(St()),this,this.options)):i=n[a],i._$AI(r),a++;a<n.length&&(this._$AR(i&&i._$AB.nextSibling,a),n.length=a)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let i=ta(t).nextSibling;ta(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},st=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,i,a,r){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=n,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=f}_$AI(t,n=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=ot(this,t,n,0),o=!Et(t)||t!==this._$AH&&t!==We,o&&(this._$AH=t);else{let l=t,s,d;for(t=r[0],s=0;s<r.length-1;s++)d=ot(this,l[i+s],n,s),d===We&&(d=this._$AH[s]),o||=!Et(d)||d!==this._$AH[s],d===f?t=f:t!==f&&(t+=(d??"")+r[s+1]),this._$AH[s]=d}o&&!a&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Pn=class extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},Nn=class extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},On=class extends st{constructor(t,n,i,a,r){super(t,n,i,a,r),this.type=5}_$AI(t,n=this){if((t=ot(this,t,n,0)??f)===We)return;let i=this._$AH,a=t===f&&i!==f||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==f&&(i===f||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Vn=class{constructor(t,n,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}};var ps=Dn.litHtmlPolyfillSupport;ps?.(Tt,Ft),(Dn.litHtmlVersions??=[]).push("3.3.3");var pa=(e,t,n)=>{let i=n?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=n?.renderBefore??null;i._$litPart$=a=new Ft(t.insertBefore(St(),r),r,void 0,n??{})}return a._$AI(e),a};var Un=globalThis,ze=class extends Fe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=pa(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return We}};ze._$litElement$=!0,ze.finalized=!0,Un.litElementHydrateSupport?.({LitElement:ze});var hs=Un.litElementPolyfillSupport;hs?.({LitElement:ze});(Un.litElementVersions??=[]).push("4.2.2");var ms={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:Kt},fs=(e=ms,t,n)=>{let{kind:i,metadata:a}=n,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),i==="accessor"){let{name:o}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,s,e,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,e,l),l}}}if(i==="setter"){let{name:o}=n;return function(l){let s=this[o];t.call(this,l),this.requestUpdate(o,s,e,!0,l)}}throw Error("Unsupported decorator location: "+i)};function lt(e){return(t,n)=>typeof n=="object"?fs(e,t,n):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,t,n)}function z(e){return lt({...e,state:!0,attribute:!1})}var Re="wrist_assistant/complications";async function ha(e){return e.connection.sendMessagePromise({type:`${Re}/owners`})}async function ma(e,t){return e.connection.sendMessagePromise({type:`${Re}/list`,owner_watch_id:t})}async function fa(e,t){return e.connection.sendMessagePromise({type:`${Re}/nudge`,owner_watch_id:t})}async function ga(e,t,n,i){return e.connection.sendMessagePromise({type:`${Re}/save`,owner_watch_id:t,document:n,base_revision:i})}async function ya(e,t,n,i){return e.connection.sendMessagePromise({type:`${Re}/delete`,owner_watch_id:t,complication_id:n,base_revision:i})}async function ba(e,t,n){return e.connection.sendMessagePromise({type:`${Re}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function va(e,t,n){let i={type:`${Re}/subscribe`};return t&&(i.owner_watch_id=t),e.connection.subscribeMessage(n,i)}async function xa(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Re}/render_values`,templates:t})).results}async function wa(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${Re}/history_series`,requests:t})).results}var ee=["rectangular","circular","corner"],fe={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34}},gs=["rectangular","circular","corner","inline"];var Kn=64;function Ia(e,t){let n=new Set(e);for(let i of t)n.add(i.slot);for(let i=0;i<Kn;i++)if(!n.has(i))return i;return-1}function Rt(e){return ee.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}var dt=[["latest","Newest reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Aa={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},he={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Zt="#FF6B35",Qt="#32D74B",Wn="#32D74B",en="#FF453A";function ct(e){return[...e.bands].sort((t,n)=>t.upTo-n.upTo)}function Ma(e){return e.coloring==="bands"&&e.bands.length>0}function Ha(e,t,n){for(let i of t)if(e<=i.upTo)return i.colorHex;return n}function La(e,t){let n=Math.abs(t),i=n>=10?0:n>=1?1:2;return e.toFixed(i)}var jn=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],qn=2,Yn=120;function _a(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?Math.max(qn,Math.min(Yn,t)):24}function za(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Je(e){let t=za(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${_a(e)}`}function Pa(e){return Jn(e).map(t=>t.key).sort().join(";")}function Jn(e){let t=new Map;for(let n of e.elements){if(n.kind!=="chart")continue;let i=Je(n.payload),a=za(n.payload);i===void 0||a===void 0||t.has(i)||t.set(i,{key:i,entityId:a,minutes:Math.round(n.payload.historyMinutes),points:_a(n.payload)})}return[...t.values()]}var It=6,At=9,ys=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Ie(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Xn(e,t){let n=t<=.5,i=e<=.5;return n?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Zn={top:0,left:0,bottom:0,right:0};function tn(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Qn=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"]];function Ae(e){let t=Qn.find(([i])=>i===e.type)?.[1]??e.type;if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function D(e,t=""){return typeof e=="string"?e:t}function V(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function ke(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Jt(e){return e==null?void 0:V(e,0)}function ue(e){return typeof e=="string"?e:void 0}var Ce=class extends Error{};function qe(e){if(typeof e.entityId!="string")throw new Ce("entityId is required");let t={entityId:e.entityId,displayName:D(e.displayName),domain:D(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function $a(e){if(!F(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=V(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=V(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=V(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),Se(t)?void 0:t}function Se(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&e.textCase===void 0:!0}function bs(e){let t=D(e.function,"count"),n=F(e.scope)?e.scope:{},i;if(n.kind==="entities")i={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(F).map(qe)};else{let r=o=>Array.isArray(o)?o.filter(l=>typeof l=="string"):[];i={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let a={function:t,scope:i};if(F(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:D(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function ka(e){switch(e.kind){case"literal":return{kind:"literal",value:D(e.value)};case"entityState":return{kind:"entityState",...qe(e)};case"entityAttribute":return{kind:"entityAttribute",...qe(e),attribute:D(e.attribute)};case"entityAge":return{kind:"entityAge",...qe(e)};case"aggregate":return{kind:"aggregate",aggregate:bs(F(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ue(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:D(e.value)};case"named":return{kind:"named",id:D(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:D(e.layer).toUpperCase(),stat:dt.some(([t])=>t===e.stat)?e.stat:"latest"};default:throw new Ce(`unknown value kind ${String(e.kind)}`)}}function ie(e){if(!F(e))throw new Ce("value must be an object");if(F(e.kind)){let i={kind:ka(e.kind)},a=$a(e.format);return a&&(i.format=a),i}let t={kind:ka(e)},n=$a(e.format);return n&&(t.format=n),t}function Na(e){return F(e)?{x:V(e.x,.25),y:V(e.y,.25),width:V(e.width,.5),height:V(e.height,.5),rotationDegrees:V(e.rotationDegrees,0)}:{...Aa}}function vs(e){if(!F(e))return{kind:"isOn"};let t=D(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=F(e.value)?ie(e.value):M("");break;case"between":n.value=F(e.value)?ie(e.value):M(""),n.upper=F(e.upper)?ie(e.upper):M("");break;case"matchesRegex":n.pattern=D(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return n}function Ca(e){if(!F(e))return{kind:"show"};let t=D(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=F(e.value)?ie(e.value):M("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=V(e.number,0);break;case"setFontWeight":n.weight=ue(e.weight)??"regular";break;default:break}return n}function Oa(e){return Array.isArray(e)?e.filter(F).map(t=>{let n={id:D(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(F).map(i=>{let a=F(i.when)?i.when:{};return{id:D(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(F).map(r=>({id:D(r.id).toUpperCase(),value:F(r.value)?ie(r.value):M(""),comparison:vs(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Ca)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(Ca)),n}):[]}function xs(e,t){return{baseColorHex:F(e)?D(e.baseColorHex,t):t}}function ws(e){if(Array.isArray(e.bands))return e.bands.filter(F).map(n=>({id:D(n.id,q()),upTo:V(n.upTo,0),colorHex:D(n.colorHex,"#FFFFFF")}));if(typeof e.bandLowerBound!="number")return[];let t=F(e.colorSlot)?D(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:q(),upTo:e.bandLowerBound,colorHex:D(e.bandLowColorHex,Wn)},{id:q(),upTo:V(e.bandUpperBound,100),colorHex:t}]}function je(e,t){if(typeof e.id!="string")throw new Ce("element id is required");return{id:e.id.toUpperCase(),colorSlot:xs(e.colorSlot,t),rules:Oa(e.rules),frame:Na(e.frame),isHidden:e.isHidden===!0}}function $s(e){let t=ks(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),t}function ks(e){if(!F(e)||!F(e.payload))throw new Ce("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...je(t,"#FFFFFF"),value:F(t.value)?ie(t.value):M(""),fontSize:V(t.fontSize,14),fontWeight:ue(t.fontWeight)??"regular"};return t.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...je(t,"#FFFFFF"),symbol:F(t.symbol)?ie(t.symbol):M("lightbulb"),size:V(t.size,14)}};case"gauge":return{kind:"gauge",payload:{...je(t,"#FFFFFF"),value:F(t.value)?ie(t.value):M("50"),minValue:V(t.minValue,0),maxValue:V(t.maxValue,100),style:ue(t.style)??"arc",lineWidth:V(t.lineWidth,4),trackColorHex:D(t.trackColorHex,"#FFFFFF40")}};case"chart":return{kind:"chart",payload:{...je(t,"#FFFFFF"),value:F(t.value)?ie(t.value):M("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(V(t.historyMinutes,0))),historyPoints:Math.round(V(t.historyPoints,24)),style:ue(t.style)??"bars",limit:Math.max(0,Math.round(V(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:ue(t.scale)??"auto",minValue:V(t.minValue,0),maxValue:V(t.maxValue,100),baseline:ue(t.baseline)??"lowest",barGap:V(t.barGap,1.5),lineWidth:V(t.lineWidth,2),highlight:ue(t.highlight)??"none",highColorHex:D(t.highColorHex,Zt),lowColorHex:D(t.lowColorHex,Qt),marker:ue(t.marker)??"pointer",coloring:ue(t.coloring)??"uniform",bands:ws(t),bandAboveColorHex:D(t.bandHighColorHex,D(t.bandAboveColorHex,en)),fillBands:t.fillBands===!0}};case"shape":{let n={...je(t,"#FFFFFF33"),kind:ue(t.kind)??"roundedRectangle",cornerRadius:V(t.cornerRadius,6),borderWidth:V(t.borderWidth,1)};return typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...i}=je(t,"#FFFFFF"),a={...i,entity:qe(F(t.entity)?t.entity:{}),contentMode:t.contentMode==="fit"?"fit":"fill",zoom:V(t.zoom,1),panX:V(t.panX,0),panY:V(t.panY,0),cornerRadius:V(t.cornerRadius,It),timestampCorner:ys.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:V(t.timestampSize,At)};t.timestamp===!0&&(a.timestamp=!0);let r=Jt(t.timestampX),o=Jt(t.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=ke(r),a.timestampY=ke(o)),{kind:"image",payload:a}}case"tap":{let{colorSlot:n,...i}=je(t,"#FFFFFF"),a={...i,action:F(t.action)?Va(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(a.openPageId=t.openPageId),typeof t.openPageName=="string"&&(a.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(a.attachedTo=t.attachedTo.toUpperCase()),{kind:"tap",payload:a}}default:throw new Ce(`unknown element kind ${String(e.kind)}`)}}function Sa(e){let t=F(e)?e:{},n={};if(F(t.placements))for(let[a,r]of Object.entries(t.placements)){if(!F(r))continue;let o={frame:Na(r.frame),isHidden:r.isHidden===!0},l=Jt(r.size);l!==void 0&&(o.size=l),n[a.toUpperCase()]=o}let i={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:V(t.borderWidth,2),rules:Oa(t.rules)};if(F(t.bezelText)&&(i.bezelText=ie(t.bezelText)),t.bezelCountdown===!0&&(i.bezelCountdown=!0),F(t.curvedText)&&(i.curvedText=ie(t.curvedText)),typeof t.curvedColorHex=="string"&&(i.curvedColorHex=t.curvedColorHex),F(t.bezelGauge)){let a=t.bezelGauge,r={value:F(a.value)?ie(a.value):M("50"),minValue:V(a.minValue,0),maxValue:V(a.maxValue,100),colorHexes:Array.isArray(a.colorHexes)&&a.colorHexes.length>0?a.colorHexes.filter(o=>typeof o=="string"):["#34C759","#FFCC00","#FF3B30"]};F(a.minLabel)&&(r.minLabel=ie(a.minLabel)),F(a.maxLabel)&&(r.maxLabel=ie(a.maxLabel)),i.bezelGauge=r}return typeof t.backgroundColorHex=="string"&&(i.backgroundColorHex=t.backgroundColorHex),typeof t.borderColorHex=="string"&&(i.borderColorHex=t.borderColorHex),i}function Cs(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let i=e[n];typeof i=="string"&&(t[i]=Sa(e[n+1]))}else if(F(e))for(let[n,i]of Object.entries(e))t[n]=Sa(i);return t}function Ss(e){let t={value:F(e.value)?ie(e.value):M("")};return typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),t}function Va(e){if(!F(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...qe(e)};default:return{type:"none"}}}function Da(e){if(!F(e))throw new Ce("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Ce(`${r} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(F).map(r=>({id:D(r.id).toUpperCase(),name:D(r.name),value:F(r.value)?ie(r.value):M("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(F).map(r=>r.kind==="template"?{kind:"template",value:D(r.value)}:r.kind==="entity"?{kind:"entity",...qe(r)}:null).filter(r=>r!==null),i={schemaVersion:V(e.schemaVersion,1),id:D(e.id).toUpperCase(),name:D(e.name,"Custom"),values:t,slotIndex:V(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map($s),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Cs(e.perFamily),dataSources:n,tapAction:Va(e.tapAction)};F(e.inline)&&(i.inline=Ss(e.inline));let a=Jt(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),Array.isArray(e.groups)){let r=e.groups.filter(F).filter(o=>typeof o.id=="string").map(o=>({id:D(o.id).toUpperCase(),name:D(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Ts(i,Array.isArray(e.elements)?e.elements:[]),Ve(i),i}function ei(e,t){let n=t?.kind;if(!n||n.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===n.layer);return i?.kind==="chart"?i:void 0}function nn(e,t){return e.elements.filter(n=>n.kind==="text"&&n.payload.value.kind.kind==="chartStat"&&n.payload.value.kind.layer===t)}function Es(e,t){let n=Xt(e,Ht(t))?.ref;return n?.displayName||n?.entityId||"Chart"}function Ba(e,t,n){let i=Ne(e,t.payload.id);if(i){ni(e,n,i.id);return}ti(e,[t.payload.id,n],Es(e,t))}var Ga={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1}};function Ua(e,t,n,i){let a=fe.rectangular,r=Math.min(1,(i*n*.62+4)/a.width),o=Math.min(1,n*1.3/a.height),l=e.x+t.x*e.width-t.x*r,s=e.y+t.y*e.height-t.y*o;return{x:Math.max(0,Math.min(1-r,l)),y:Math.max(0,Math.min(1-o,s)),width:r,height:o,rotationDegrees:0}}function Ka(e,t,n){let i=e.elements.find(s=>s.payload.id===t);if(!i||i.kind!=="chart")return;let a=Pe("text"),r=n==="latest"?10:8,o={kind:{kind:"chartStat",layer:t,stat:n}};n==="latest"&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:n==="latest"?"#FFFFFF":"#FFFFFF99"},a.payload.frame=Ua(i.payload.frame,Ga[n],r,n==="latest"?7:4);let l=e.elements.findIndex(s=>s.payload.id===t);return e.elements.splice(l+1,0,a),Ba(e,i,a.payload.id),a.payload.id}function Ts(e,t){for(let n of t){if(!F(n)||n.kind!=="chart"||!F(n.payload))continue;let i=n.payload,a=D(i.id).toUpperCase(),r=e.elements.find(h=>h.payload.id===a);if(!r||r.kind!=="chart")continue;let o=D(i.scaleLabelColorHex,"#FFFFFF99"),l=h=>{let g=F(h)?h:{};return{fontSize:V(g.fontSize,8),colorHex:D(g.colorHex,o),pillColorHex:typeof g.pillColorHex=="string"?g.pillColorHex:void 0}},s=[],d=ue(i.scaleLabels);(d==="top"||d==="range")&&s.push(["top",l(i.topLabelStyle)]),d==="range"&&s.push(["bottom",l(i.bottomLabelStyle)]);let u=ue(i.latestLabel);if((u==="corner"||u==="end")&&s.push(["latest",l(i.latestLabelStyle)]),s.length===0)continue;let c=e.elements.findIndex(h=>h.payload.id===a)+1;for(let[h,g]of s){let y=Ua(r.payload.frame,Ga[h],g.fontSize,h==="latest"?5:4),w=[];if(g.pillColorHex!==void 0){let T=Pe("shape");T.payload.kind="capsule",T.payload.colorSlot={baseColorHex:g.pillColorHex},T.payload.frame={...y},w.push(T)}let x=Pe("text");x.payload.value={kind:{kind:"chartStat",layer:a,stat:h}},x.payload.fontSize=g.fontSize,x.payload.fontWeight="medium",x.payload.colorSlot={baseColorHex:g.colorHex},x.payload.frame=y,w.push(x),e.elements.splice(c,0,...w),c+=w.length;for(let T of w)Ba(e,r,T.payload.id)}}}function W(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function Ye(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function Fs(e){let t={};return e.decimals!==void 0&&(t.decimals=W(e.decimals)),e.multiply!==void 0&&(t.multiply=W(e.multiply)),e.offset!==void 0&&(t.offset=W(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function Rs(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(Ye)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function Is(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...Ye(e)};case"entityAttribute":return{kind:"entityAttribute",...Ye(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...Ye(e)};case"aggregate":return{kind:"aggregate",aggregate:Rs(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function Z(e){let t={kind:Is(e.kind)};return Se(e.format)||(t.format=Fs(e.format)),t}function qt(e){return{x:W(e.x),y:W(e.y),width:W(e.width),height:W(e.height),rotationDegrees:W(e.rotationDegrees)}}function As(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=Z(e.value??M(""));break;case"between":t.value=Z(e.value??M("")),t.upper=Z(e.upper??M(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function Ea(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=Z(e.value??M(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=W(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;default:break}return t}function Yt(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:Z(a.value),comparison:As(a.comparison)}))},then:i.then.map(Ea)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(Ea)),n})}function Ms(e){let t=Hs(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),t}function Hs(e){let t=n=>({id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:Yt(n.rules),frame:qt(n.frame),isHidden:n.isHidden});switch(e.kind){case"text":{let n={...t(e.payload),value:Z(e.payload.value),fontSize:W(e.payload.fontSize),fontWeight:e.payload.fontWeight};return e.payload.countdown===!0&&(n.countdown=!0),{kind:"text",payload:n}}case"icon":return{kind:"icon",payload:{...t(e.payload),symbol:Z(e.payload.symbol),size:W(e.payload.size)}};case"gauge":return{kind:"gauge",payload:{...t(e.payload),value:Z(e.payload.value),minValue:W(e.payload.minValue),maxValue:W(e.payload.maxValue),style:e.payload.style,lineWidth:W(e.payload.lineWidth),trackColorHex:e.payload.trackColorHex}};case"chart":return{kind:"chart",payload:{...t(e.payload),value:Z(e.payload.value),historyMinutes:Math.max(0,Math.round(e.payload.historyMinutes)),historyPoints:Math.round(e.payload.historyPoints),style:e.payload.style,limit:Math.max(0,Math.round(e.payload.limit)),takeFromEnd:e.payload.takeFromEnd,scale:e.payload.scale,minValue:W(e.payload.minValue),maxValue:W(e.payload.maxValue),baseline:e.payload.baseline,barGap:W(e.payload.barGap),lineWidth:W(e.payload.lineWidth),highlight:e.payload.highlight,highColorHex:e.payload.highColorHex,lowColorHex:e.payload.lowColorHex,marker:e.payload.marker,coloring:e.payload.coloring,bands:e.payload.bands.map(n=>({id:n.id,upTo:W(n.upTo),colorHex:n.colorHex})),bandAboveColorHex:e.payload.bandAboveColorHex,fillBands:e.payload.fillBands}};case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:W(e.payload.cornerRadius),borderWidth:W(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),{kind:"shape",payload:n}}case"image":{let n=e.payload,i={id:n.id,entity:Ye(n.entity),rules:Yt(n.rules),frame:qt(n.frame),isHidden:n.isHidden};n.timestamp===!0&&(i.timestamp=!0),n.contentMode!=="fill"&&(i.contentMode=n.contentMode),n.zoom!==1&&(i.zoom=W(n.zoom)),n.panX!==0&&(i.panX=W(n.panX)),n.panY!==0&&(i.panY=W(n.panY)),n.cornerRadius!==It&&(i.cornerRadius=W(n.cornerRadius));let a=Ie(n),r=a?Xn(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),n.timestampSize!==At&&(i.timestampSize=W(n.timestampSize)),a&&(i.timestampX=W(n.timestampX),i.timestampY=W(n.timestampY)),{kind:"image",payload:i}}case"tap":{let n=e.payload,i={id:n.id,action:Wa(n.action)};return n.openPageId!==void 0&&(i.openPageId=n.openPageId),n.openPageName!==void 0&&(i.openPageName=n.openPageName),n.attachedTo!==void 0&&(i.attachedTo=n.attachedTo),i.rules=Yt(n.rules),i.frame=qt(n.frame),i.isHidden=n.isHidden,{kind:"tap",payload:i}}}}function Ls(e){let t={},n=Object.keys(e.placements);if(n.length>0){let i={};for(let a of n){let r=e.placements[a],o={frame:qt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=W(r.size)),i[a]=o}t.placements=i}if(e.bezelText&&(t.bezelText=Z(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=Z(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:Z(i.value),minValue:W(i.minValue),maxValue:W(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=Z(i.minLabel)),i.maxLabel&&(a.maxLabel=Z(i.maxLabel)),t.bezelGauge=a}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=W(e.borderWidth),e.rules.length>0&&(t.rules=Yt(e.rules)),t}function Wa(e){return"entityId"in e?{type:e.type,...Ye(e)}:{type:e.type}}function _s(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=Z(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),t}function an(e){let t=[];for(let i of ee){let a=e.perFamily[i];a&&t.push(i,Ls(a))}let n={schemaVersion:Rt(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:Z(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Ms),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...Ye(i)}),tapAction:Wa(e.tapAction)};return e.inline!==void 0&&(n.inline=_s(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),n}function Ne(e,t){let i=e.elements.find(a=>a.payload.id===t)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Oe(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!pe(e,n))}function Ve(e){let t=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!t.has(a.payload.groupId)&&delete a.payload.groupId;let n=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>n.has(a.id));i.length===0?delete e.groups:e.groups=i}function Mt(e){if(!e.groups?.length)return;let t=e.elements.filter(r=>!pe(e,r)),n=e.elements.filter(r=>pe(e,r)),i=[],a=new Set;for(let r=t.length-1;r>=0;r--){let o=t[r];if(a.has(o.payload.id))continue;let l=o.payload.groupId;if(l===void 0){i.unshift(o),a.add(o.payload.id);continue}let s=t.filter(d=>d.payload.groupId===l);for(let d=s.length-1;d>=0;d--)i.unshift(s[d]),a.add(s[d].payload.id)}e.elements=[...i,...n],Xe(e)}function ti(e,t,n="Group"){let i=e.elements.filter(r=>t.includes(r.payload.id)&&!pe(e,r));if(i.length<2)return;let a={id:q(),name:n,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return Ve(e),Mt(e),a.id}function rn(e,t){for(let n of e.elements)n.payload.groupId===t&&delete n.payload.groupId;Ve(e)}function ni(e,t,n){let i=e.elements.find(a=>a.payload.id===t);!i||pe(e,i)||(n===void 0?delete i.payload.groupId:i.payload.groupId=n,Ve(e),Mt(e))}var K={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","groupId"],text:["value","fontSize","fontWeight","countdown"],icon:["symbol","size"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex"],chart:["value","historyMinutes","historyPoints","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],shape:["kind","cornerRadius","borderColorHex","borderWidth"],image:["entity","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY"],tap:["action","openPageId","openPageName","attachedTo","grow"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName"],dataSource:["kind","entityId","displayName","domain","iconName","value"]},Ta={literal:["kind","value"],entityState:["kind",...K.entityRef],entityAttribute:["kind",...K.entityRef,"attribute"],entityAge:["kind",...K.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function ja(e){let t=[],n=(s,d,u)=>{if(F(s))for(let c of Object.keys(s))d.includes(c)||t.push(`${u}.${c}`)},i=(s,d)=>{if(!F(s))return;let u=typeof s.kind=="string"?s.kind:"";n(s,Ta[u]??["kind"],d),u==="aggregate"&&F(s.aggregate)&&(n(s.aggregate,K.aggregate,`${d}.aggregate`),n(s.aggregate.scope,K.scope,`${d}.aggregate.scope`),F(s.aggregate.scope)&&Array.isArray(s.aggregate.scope.entities)&&s.aggregate.scope.entities.forEach((c,h)=>n(c,K.entityRef,`${d}.aggregate.scope.entities[${h}]`)),n(s.aggregate.stateFilter,K.stateFilter,`${d}.aggregate.stateFilter`))},a=(s,d)=>{if(F(s)){if(F(s.kind))n(s,K.value,d),i(s.kind,`${d}.kind`);else{let u=typeof s.kind=="string"?s.kind:"";n(s,[...Ta[u]??["kind"],"format"],d),u==="aggregate"&&i(s,d)}n(s.format,K.format,`${d}.format`)}},r=(s,d)=>{Array.isArray(s)&&s.forEach((u,c)=>{n(u,K.styleChange,`${d}[${c}]`),F(u)&&a(u.value,`${d}[${c}].value`)})},o=(s,d)=>{Array.isArray(s)&&s.forEach((u,c)=>{let h=`${d}[${c}]`;n(u,K.rule,h),F(u)&&(Array.isArray(u.cases)&&u.cases.forEach((g,y)=>{let w=`${h}.cases[${y}]`;n(g,K.case,w),F(g)&&(n(g.when,K.condition,`${w}.when`),F(g.when)&&Array.isArray(g.when.tests)&&g.when.tests.forEach((x,T)=>{let $=`${w}.when.tests[${T}]`;n(x,K.test,$),F(x)&&(a(x.value,`${$}.value`),n(x.comparison,K.comparison,`${$}.comparison`),F(x.comparison)&&(a(x.comparison.value,`${$}.comparison.value`),a(x.comparison.upper,`${$}.comparison.upper`)))}),r(g.then,`${w}.then`))}),r(u.otherwise,`${h}.otherwise`))})};if(!F(e))return t;n(e,K.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((s,d)=>n(s,K.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((s,d)=>{n(s,K.named,`$.values[${d}]`),F(s)&&a(s.value,`$.values[${d}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((s,d)=>{let u=`$.elements[${d}]`;if(n(s,K.elementEnvelope,u),!F(s)||!F(s.payload))return;let c=typeof s.kind=="string"?s.kind:"",h=K[c]??[];n(s.payload,[...K.elementBase,...h],`${u}.payload`),n(s.payload.colorSlot,K.colorSlot,`${u}.payload.colorSlot`),n(s.payload.frame,K.frame,`${u}.payload.frame`),o(s.payload.rules,`${u}.payload.rules`);for(let g of["value","symbol"])g in s.payload&&a(s.payload[g],`${u}.payload.${g}`);c==="image"&&n(s.payload.entity,K.entityRef,`${u}.payload.entity`),c==="tap"&&n(s.payload.action,K.tapAction,`${u}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let s=0;s+1<e.perFamily.length;s+=2)l.push([String(e.perFamily[s]),e.perFamily[s+1]]);else F(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[s,d]of l){let u=`$.perFamily.${s}`;if(n(d,K.layout,u),!!F(d)){if(F(d.placements))for(let[c,h]of Object.entries(d.placements))n(h,K.placement,`${u}.placements.${c}`),F(h)&&n(h.frame,K.frame,`${u}.placements.${c}.frame`);if(a(d.bezelText,`${u}.bezelText`),a(d.curvedText,`${u}.curvedText`),F(d.bezelGauge)){let c=`${u}.bezelGauge`;n(d.bezelGauge,K.bezelGauge,c),a(d.bezelGauge.value,`${c}.value`),a(d.bezelGauge.minLabel,`${c}.minLabel`),a(d.bezelGauge.maxLabel,`${c}.maxLabel`)}o(d.rules,`${u}.rules`)}}return F(e.inline)&&(n(e.inline,K.inline,"$.inline"),a(e.inline.value,"$.inline.value")),Array.isArray(e.dataSources)&&e.dataSources.forEach((s,d)=>n(s,K.dataSource,`$.dataSources[${d}]`)),n(e.tapAction,K.tapAction,"$.tapAction"),t}function q(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function ii(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function qa(e,t,n=[...ee]){let i={};for(let r of ee)n.includes(r)&&(i[r]=ii());let a={schemaVersion:4,id:q(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:gs.filter(r=>n.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(a.inline={value:M("Text")}),a.schemaVersion=Rt(a),a}function Pe(e){let t=n=>({id:q(),colorSlot:{baseColorHex:n},rules:[],frame:{...Aa},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:M("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:M("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:M("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40"}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:M("13,14,16,17,19,22,24,28,30"),historyMinutes:0,historyPoints:24,style:"bars",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:Zt,lowColorHex:Qt,marker:"pointer",coloring:"uniform",bands:[],bandAboveColorHex:en,fillBands:!1}};case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,borderWidth:1}};case"image":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:It,timestampCorner:"topLeading",timestampSize:At}}}case"tap":{let{colorSlot:n,...i}=t("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}}}function M(e){return{kind:{kind:"literal",value:e}}}function Ya(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(i=>{let a=n.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Ht(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return}}function ai(e){let t=[],n=i=>{for(let a of i)a.value&&t.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(a.then)}i.otherwise&&n(i.otherwise)}return t}var ri=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Xt(e,t){let n,i=t;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=ei(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:o}:{ref:o,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===n)?.value}}function oi(e,t){return Xt(e,Ht(t))?.ref}function si(e,t){let n=oi(e,t),i=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&ri.includes(i)?{type:"toggleEntity",...n,domain:i}:{type:"refresh"}}function Fa(e,t,n){if(tn(t)||n.width<=0||n.height<=0)return{...e};let i=t,a=e.x-i.left/n.width,r=e.x+e.width+i.right/n.width,o=e.y-i.top/n.height,l=e.y+e.height+i.bottom/n.height;return r<a&&(a=r=(a+r)/2),l<o&&(o=l=(o+l)/2),a=ke(a),r=ke(r),o=ke(o),l=ke(l),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,l-o)}}function Ja(e,t,n){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-t.x)*n.width),right:i((t.x+t.width-e.x-e.width)*n.width),top:i((e.y-t.y)*n.height),bottom:i((t.y+t.height-e.y-e.height)*n.height)}}function Xa(e,t,n,i){let a=e.elements.find(h=>h.payload.id===t);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(h=>h.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=ke(i.x),s=ke(i.y),d=ke(i.x+i.width),u=ke(i.y+i.height),c={...i,x:l,y:s,width:Math.max(0,d-l),height:Math.max(0,u-s)};a.payload.outset=Ja(o,c,fe[n])}function Za(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i)return;let a=e.perFamily[n];if(!a)return;let r=a.placements[t]?.frame??i.payload.frame,o=fe[n];return{width:r.width*o.width,height:r.height*o.height}}function ve(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function pe(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function li(e,t){let n=e.elements.find(i=>i.payload.id===t);if(n){if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===n.payload.attachedTo);if(i)return i.payload.id}return n.payload.id}}function Xe(e){let t=new Map(e.elements.map(a=>[a.payload.id,a])),n=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=t.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let l=n.get(r);l?l.push(a):n.set(r,[a])}if(n.size===0)return;for(let[a,r]of n){let o=t.get(a);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=Ja(o.payload.frame,s.frame,fe.rectangular));let d=s.outset,u=!tn(d);l.payload.frame=Fa(o.payload.frame,d,fe.rectangular),l.payload.isHidden=o.payload.isHidden;for(let c of ee){let h=e.perFamily[c];if(!h)continue;let g=fe[c],y=h.placements[a];if(u){let w=y?.frame??o.payload.frame,x=y?.isHidden??o.payload.isHidden;h.placements[l.payload.id]={frame:Fa(w,d,g),isHidden:x}}else y?h.placements[l.payload.id]={frame:{...y.frame},isHidden:y.isHidden}:delete h.placements[l.payload.id]}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=n.get(a.payload.id);r&&i.push(...r)}e.elements=i}function on(e,t,n){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind==="tap")return;let a=ve(e,t)[0];if(a)return a.payload;let r=Pe("tap"),o=r.payload;return o.attachedTo=t,o.outset={...Zn},o.action=n??si(e,i),e.elements.push(r),Xe(e),o}function di(e,t){let n=ve(e,t).map(i=>i.payload.id);if(n.length!==0){e.elements=e.elements.filter(i=>!n.includes(i.payload.id));for(let i of ee)for(let a of n)delete e.perFamily[i]?.placements[a]}}function ci(e,t){for(let n of nn(e,t))ci(e,n.payload.id);di(e,t),e.elements=e.elements.filter(n=>n.payload.id!==t);for(let n of ee)delete e.perFamily[n]?.placements[t];Xe(e),Ve(e)}function Qa(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),i=e.elements[n];if(!i)return;let a=q(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],l=[[t,a]];for(let s of ve(e,t)){let d=structuredClone(s);d.payload.id=q(),d.payload.attachedTo=a,o.push(d),l.push([s.payload.id,d.payload.id])}e.elements.splice(n+1,0,...o);for(let s of ee){let d=e.perFamily[s];if(d)for(let[u,c]of l){let h=d.placements[u];h&&(d.placements[c]=structuredClone(h))}}return Xe(e),a}function sn(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let i=[],a=Xt(e,Ht(n));if(a){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of ve(e,t)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let o of r.cases)for(let l of o.when.tests){let s=Xt(e,l.value);if(!s)continue;let d={where:"test",ref:s.ref,ruleId:r.id,caseId:o.id,testId:l.id};s.namedId!==void 0&&(d.namedId=s.namedId),i.push(d)}return i}function Ra(e,t,n){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:i.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function er(e,t,n){let i=e.elements.find(r=>r.payload.id===t);if(!i||n.entityId==="")return;let a={...n,domain:n.domain||n.entityId.split(".")[0]||""};if(i.kind==="image")i.payload.entity=a;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let r=Ra(i.payload.value,a,i.kind);r&&(i.payload.value=r)}else if(i.kind==="icon"){let r=Ra(i.payload.symbol,a,i.kind);r&&(i.payload.symbol=r)}for(let r of ve(e,t)){let o=r.payload;"entityId"in o.action&&(o.action={type:o.action.type,...a})}}var ln={text:["color","opacity","text","fontSize","fontWeight","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},tr=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Ze(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function dn(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function ui(){return{id:q(),value:M(""),comparison:{kind:"isOn"}}}function pi(){return{id:q(),when:{join:"all",tests:[ui()]},then:[]}}function Lt(){return{id:q(),cases:[pi()]}}function hi(e,t){let n={kind:t};switch(Ze(t)){case"value":n.value=e.value??M("");break;case"between":n.value=e.value??M(""),n.upper=e.upper??M("");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function Qe(e){let t={kind:e};switch(dn(e)){case"value":t.value=M(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"none":break}return t}function nr(e){return e.appliedToken===void 0?{kind:"unsupported"}:e.token===e.appliedToken?{kind:"sent"}:e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function ir(e){switch(e.kind){case"unsupported":return{label:"",title:"",resend:!1};case"sent":return{label:"On watch",title:"The watch has applied every change here.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function rr(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*i&a;return n.toString(16)}function or(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function ar(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function fi(e,t,n=0){let i=t instanceof Map?t:or(t),a=e.kind;if(a.kind==="named"){if(n>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?fi(o,i,n+1):ar(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!ar(a))return;let r=mi(a);if(r!==void 0)return"e_"+rr(r)}function xe(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function zs(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(o=>xe(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:l,labelIds:s,floorIds:d}=e.scope;if(!(l.length+s.length+d.length>0))t=o.length===0?"[]":"("+o.map(c=>`(states.${c} | list)`).join(" + ")+")";else{let c=[];for(let h of l)c.push(`area_entities(${xe(h)})`);for(let h of s)c.push(`label_entities(${xe(h)})`);d.length>0&&c.push(`((${d.map(h=>`floor_areas(${xe(h)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${c.join(" + ")})`,o.length>0&&(t+=` | selectattr('domain', 'in', [${o.map(xe).join(", ")}])`),t+=")"}}let n=t,i=e.stateFilter;if(i&&(i.kind==="isOn"?n+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?n+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?n+=` | selectattr('state', 'eq', ${xe(i.value)})`:n+=` | rejectattr('state', 'eq', ${xe(i.value)})`),e.function==="count")return`(${n} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${n} | map(attribute=${xe(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function mi(e){switch(e.kind){case"entityAttribute":return`state_attr(${xe(e.entityId)}, ${xe(e.attribute)})`;case"entityAge":{let t=xe(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return zs(e.aggregate);default:return}}function gi(e){let t=new Map,n=new Map,i=or(e.values),a=(o,l=0)=>{let s=o.kind;switch(s.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let d=i.get(s.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){t.set(d.kind.entityId,d.kind);return}let u=mi(d.kind);if(u===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),u);return}default:{let d=mi(s);if(d===void 0)return;n.set("e_"+rr(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let l=Ht(o);l&&a(l);for(let s of ai(o.payload.rules))a(s)}for(let o of ee){if(!e.supportedFamilies.includes(o))continue;let l=e.perFamily[o];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let s of ai(l.rules))a(s)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:t,expressions:n};return n.size>0&&(r.document=Ps(n)),r}function Ps(e){let t=[...e.keys()].sort(),n=[];for(let a of t){let r=e.get(a);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${a} %}${r}{% endset %}`):n.push(`{% set v_${a} = ${r} %}`)}let i=t.map(a=>`"${a}": v_${a}`).join(", ");return n.push(`{{ { ${i} } | to_json }}`),n.join(`
`)}function sr(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,i=new Set;for(let[a,r]of Object.entries(t))r===null?i.add(a):n.set(a,Ns(r));return{values:n,nullKeys:i}}function Ns(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function yi(e){let t=gi(e),n=[...t.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return t.document&&n.push({kind:"template",value:t.document}),n}function Os(e,t){if(e.values.length!==0)switch(t){case"latest":return e.values[e.values.length-1];case"highest":return Math.max(...e.values);case"lowest":return Math.min(...e.values);case"average":return e.values.reduce((n,i)=>n+i,0)/e.values.length;case"top":return e.domainMax;case"bottom":return e.domainMin}}function cn(e){let t=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t))return Number(t);let n=t.toLowerCase();if(n==="inf"||n==="+inf"||n==="infinity"||n==="+infinity")return 1/0;if(n==="-inf"||n==="-infinity")return-1/0;if(n==="nan"||n==="+nan"||n==="-nan")return NaN}function ut(e){let t=e.trim(),n=cn(t);if(n!==void 0)return n;let i="";for(let r of t)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:cn(i)}function Vs(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function Ds(e){let t=Math.max(0,e);return t<60?`${Math.trunc(t)}s`:t<3600?`${Math.trunc(t/60)}m`:t<86400?`${Math.trunc(t/3600)}h`:`${Math.trunc(t/86400)}d`}function Bs(e){return e.replace(/\S+/g,t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())}function Gs(e,t,n){if(Se(t))return e;let i=t,a=e,r=cn(e.trim());if(i.relativeTime&&r!==void 0)a=Ds(r);else{let o=ut(e);if(o!==void 0){let l=o*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==o&&(a=Number.isInteger(l)?String(l):Vs(l))}}switch(i.useEntityUnit&&n&&(a+=n.startsWith("\xB0")||n.startsWith("%")?n:` ${n}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Bs(a);break}return a}function pt(e){let t=Math.trunc(Math.max(0,e)),n=Math.trunc(t/3600),i=Math.trunc(t%3600/60),a=t%60,r=o=>String(o).padStart(2,"0");return n>0?`${n}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function _t(e,t=240){let n=[],i="",a=!1,r=()=>{if(i!==""){let o=Number(i);Number.isFinite(o)&&n.push(o)}i=""};for(let o of e){if(n.length>=t)break;if(o>="0"&&o<="9")i+=o,a=!0;else if(o===".")i.includes(".")&&r(),i+=".",a=!0;else if(o==="-"||o==="+"){let l=!a;r(),l&&(i+=o),a=!1}else r(),a=!1}return n.length<t&&r(),n}function Us(e,t){let n,i;return t.scale==="fixed"?(n=Math.min(t.minValue,t.maxValue),i=Math.max(t.minValue,t.maxValue)):(n=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1),t.baseline==="zero"&&(n=Math.min(n,0),i=Math.max(i,0)),i>n||(i=n+1),{min:n,max:i}}function Ks(e,t,n){if(e===void 0)return 0;let i=ut(e);if(i===void 0||Number.isNaN(i))return 0;let a=n-t;return a===0?0:Math.min(1,Math.max(0,(i-t)/a))}var Me=class{constructor(t,n){this.ctx=t;this.charts=new Map;this.named=new Map(t.namedValues.map(i=>[i.id.toUpperCase(),i.value])),n&&this.settleCharts(n)}chartReadings(t){let n=Je(t),i=n!==void 0?this.ctx.historySeries?.get(n)??"":this.resolve(t.value)??"",a=_t(i);t.limit>0&&a.length>t.limit&&(a=t.takeFromEnd?a.slice(a.length-t.limit):a.slice(0,t.limit));let r=Us(a,t),o={values:a,domainMin:r.min,domainMax:r.max},l=this.dereference(t.value);return l&&"entityId"in l.kind&&(o.entity={entityId:l.kind.entityId,displayName:l.kind.displayName,domain:l.kind.domain}),o}settleCharts(t){for(let n of t.elements)n.kind==="chart"&&this.charts.set(n.payload.id,this.chartReadings(n.payload))}dereference(t){let n=t,i=new Set,a=t.format;for(;n.kind.kind==="named";){let o=n.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let l=this.named.get(o);if(!l)return;a=a&&!Se(a)?a:l.format,n=l}let r={kind:n.kind};return a&&(r.format=a),r}directEntityUnit(t){let n=t.kind;if(n.kind==="entityState"||n.kind==="entityAttribute"||n.kind==="entityAge")return this.ctx.entityStates.get(n.entityId)?.unitOfMeasurement;if(n.kind==="chartStat"){let i=this.charts.get(n.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i;switch(n.kind.kind){case"literal":i=n.kind.value;break;case"entityState":i=this.ctx.entityStates.get(n.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(n.kind.layer.toUpperCase()),r=a?Os(a,n.kind.stat):void 0;i=a&&r!==void 0?La(r,a.domainMax-a.domainMin):void 0;break}default:{let a=fi(t,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Gs(i,n.format,this.directEntityUnit(n))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(t){if(!t)return;let n=this.dereference(t);if(!n)return;let i=n.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let l=Date.parse(o.finishesAt);return Number.isFinite(l)&&l>this.nowMs()?l:void 0}}let a=this.resolve(t)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=cn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}countdownFallbackText(t){if(!t)return;let n=this.dereference(t);if(!n||n.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(n.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?pt(i.remaining):"Paused":"Idle"}entityIcon(t){let n=this.dereference(t);return!n||n.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(n.kind.entityId)?.iconName??n.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(t){let n=t.comparison;if(n.kind==="isStale")return this.isStale();let i=this.resolve(t.value);if(i===void 0)return n.kind==="isUnavailable";let a=ut(i),r=()=>this.resolve(n.value),o=()=>{let s=r();return s===void 0?void 0:ut(s)},l=s=>{let d=o();return a===void 0||d===void 0?!1:s(a,d)};switch(n.kind){case"equals":{let s=r();return s!==void 0&&i===s}case"notEquals":{let s=r();return s!==void 0&&i!==s}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let s=i.toLowerCase();return s==="unavailable"||s==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return l((s,d)=>s>d);case"greaterOrEqual":return l((s,d)=>s>=d);case"lessThan":return l((s,d)=>s<d);case"lessOrEqual":return l((s,d)=>s<=d);case"between":{let s=o(),d=this.resolve(n.upper),u=d===void 0?void 0:ut(d);if(a===void 0||s===void 0||u===void 0)return!1;let[c,h]=s<=u?[s,u]:[u,s];return a>=c&&a<=h}case"contains":{let s=r();return!!s&&i.toLowerCase().includes(s.toLowerCase())}case"startsWith":{let s=r();return!!s&&i.toLowerCase().startsWith(s.toLowerCase())}case"endsWith":{let s=r();return!!s&&i.toLowerCase().endsWith(s.toLowerCase())}case"matchesRegex":{if(!n.pattern)return!1;try{return new RegExp(n.pattern).test(i)}catch{return!1}}case"isOneOf":return(n.options??[]).some(s=>s.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(t){return t.tests.length===0?!0:t.join==="any"?t.tests.some(n=>this.evaluateTest(n)):t.tests.every(n=>this.evaluateTest(n))}applyRules(t,n){let i=new Map;for(let a of t){let r=n?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(l=>l.id===r.caseId)?.then??[];else{let l=a.cases.find(s=>this.evaluateCondition(s.when));o=l?l.then:a.otherwise??[]}for(let l of o)i.set(he[l.kind],l)}return i}liveBranches(t){let n=new Map;for(let i of t){let a=i.cases.find(r=>this.evaluateCondition(r.when));n.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return n}styleColor(t,n){let i=t.get(n);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(t,n){let i=t.get(n);return i?this.resolve(i.value):void 0}styleNumber(t,n){return t.get(n)?.number}resolveElement(t,n){let i=t.payload,a=this.applyRules(i.rules,n),r=a.get("visibility"),o=r?r.kind==="hide":i.isHidden,l=this.styleNumber(a,"rotation"),s=l===void 0?i.frame:{...i.frame,rotationDegrees:l},d=this.styleNumber(a,"opacity")??1,u={id:i.id,isHidden:o,frame:s,opacity:d};switch(t.kind){case"text":{let c=t.payload.countdown?this.countdownEnd(t.payload.value):void 0,h=t.payload.countdown?this.countdownFallbackText(t.payload.value):void 0,g={kind:"text",...u,text:this.styleText(a,"text")??h??this.resolve(t.payload.value)??"--",fontSize:this.styleNumber(a,"fontSize")??t.payload.fontSize,fontWeight:a.get("fontWeight")?.weight??t.payload.fontWeight,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex};return c!==void 0&&(g.countdownEnd=c),g}case"icon":{let c=this.entityIcon(t.payload.symbol)??this.resolve(t.payload.symbol)??"questionmark.circle";return{kind:"icon",...u,symbol:this.styleText(a,"icon")??c,size:this.styleNumber(a,"fontSize")??t.payload.size,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex}}case"gauge":{let c=this.styleText(a,"gaugeValue")??this.resolve(t.payload.value),h=this.styleNumber(a,"gaugeMin")??t.payload.minValue,g=this.styleNumber(a,"gaugeMax")??t.payload.maxValue;return{kind:"gauge",...u,fraction:Ks(c,h,g),style:t.payload.style,lineWidth:t.payload.lineWidth,colorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,trackColorHex:t.payload.trackColorHex}}case"chart":{let c=t.payload,h=this.charts.get(c.id)??this.chartReadings(c),g=h.values,y={min:h.domainMin,max:h.domainMax},w=this.styleColor(a,"color")??c.colorSlot.baseColorHex,x=ct(c),T=Ma(c)?g.map(m=>Ha(m,x,c.bandAboveColorHex)):[],$={kind:"chart",...u,values:g,style:c.style,domainMin:y.min,domainMax:y.max,baseline:c.baseline,barGap:c.barGap,lineWidth:c.lineWidth,colorHex:w,highColorHex:c.highColorHex,lowColorHex:c.lowColorHex,marker:c.marker,pointColorHexes:T,fillBands:c.fillBands};if(g.length>0){let m=c.highlight==="highest"||c.highlight==="both",b=c.highlight==="lowest"||c.highlight==="both",v=m?g.indexOf(Math.max(...g)):-1,C=b?g.indexOf(Math.min(...g)):-1;v>=0&&($.highIndex=v),C>=0&&C!==v&&($.lowIndex=C)}return $}case"shape":{let c={kind:"shape",...u,shapeKind:t.payload.kind,cornerRadius:t.payload.cornerRadius,fillColorHex:this.styleColor(a,"color")??t.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(a,"borderWidth")??t.payload.borderWidth},h=this.styleColor(a,"borderColor")??t.payload.borderColorHex;return h!==void 0&&(c.borderColorHex=h),c}case"image":{let c={kind:"image",...u,entityId:t.payload.entity.entityId,showTimestamp:t.payload.timestamp===!0,contentMode:t.payload.contentMode,zoom:t.payload.zoom,panX:t.payload.panX,panY:t.payload.panY,cornerRadius:t.payload.cornerRadius,timestampCorner:t.payload.timestampCorner,timestampSize:t.payload.timestampSize};Ie(t.payload)&&(c.timestampX=t.payload.timestampX,c.timestampY=t.payload.timestampY);let h=this.ctx.entityStates.get(t.payload.entity.entityId)?.entityPicture;return h!==void 0&&(c.url=h),c}case"tap":{let c={kind:"tap",...u,frame:t.payload.frame,opacity:1,action:t.payload.action};return t.payload.openPageId!==void 0&&(c.openPageId=t.payload.openPageId),t.payload.attachedTo!==void 0&&(c.attachedTo=t.payload.attachedTo),c}}}resolveLayout(t,n,i){let a=t.perFamily[n];this.settleCharts(t);let r=Ya(t,n).map(w=>this.resolveElement(w,i)),o=a?this.applyRules(a.rules,i):new Map,l={family:n,elements:r,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(o,"borderWidth")??a?.borderWidth??2},s=this.styleText(o,"text"),d=a?.bezelCountdown&&s===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,c=s??u??this.resolve(a?.bezelText);c!==void 0&&(l.bezelText=c),d!==void 0&&(l.bezelCountdownEnd=d);let h=this.resolve(a?.curvedText);if(h!==void 0&&(l.curvedText=h),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let w=a.bezelGauge,x=this.resolve(w.value),T=x===void 0?void 0:ut(x);if(T!==void 0){let $=Math.min(w.minValue,w.maxValue),m=Math.max(w.minValue,w.maxValue),b={value:Math.min(m,Math.max($,T)),minValue:$,maxValue:m===$?$+1:m,colorHexes:w.colorHexes},v=this.resolve(w.minLabel);v!==void 0&&(b.minLabel=v);let C=this.resolve(w.maxLabel);C!==void 0&&(b.maxLabel=C),l.bezelGauge=b}}let g=this.styleColor(o,"backgroundColor")??a?.backgroundColorHex;g!==void 0&&(l.backgroundColorHex=g);let y=this.styleColor(o,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function Ws(e,t,n){let i=new Me(t,n),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function bi(e,t,n){let i=new Me(t),a={};for(let r of["rectangular","circular","corner"])e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,n));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Ws(e.inline,t,e)),a}var de=fe,zt=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:de,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Pt=zt.find(e=>e.measured);function gr(e){if(!e)return;let t=/^(\d+)x(\d+)$/.exec(e.trim());if(!t)return;let n=Number(t[1]),i=Number(t[2]);return zt.find(a=>a.screen.width===n&&a.screen.height===i)}function pn(e,t){let n=de[t];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/n.width,e.height/n.height),a=n.width*i,r=n.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var js={regular:400,medium:500,semibold:600,bold:700};function Ee(e){if(!e)return;let t=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t))return;let n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{color:`#${t.slice(0,6)}`,opacity:n}}function He(e,t,n="#FFFFFF"){let i=Ee(e)??{color:n,opacity:1};return{[t]:i.color,[`${t}-opacity`]:i.opacity}}function yr(e,t){let n=Math.max(0,e.frame.width*t.width),i=Math.max(0,e.frame.height*t.height),a=(e.frame.x+e.frame.width/2)*t.width,r=(e.frame.y+e.frame.height/2)*t.height;return{x:a-n/2,y:r-i/2,w:n,h:i,cx:a,cy:r}}function qs(e,t){let n=He(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:pt((e.countdownEnd-Date.now())/1e3)});let i=s=>s*.55,a=e.text.length*i(e.fontSize),r=a>t.w&&t.w>0?Math.max(.5,t.w/a):1,o=e.fontSize*r,l=e.text;if(t.w>0&&l.length*i(o)>t.w){let s=t.w-.8*o,d=Math.max(1,Math.floor(s/i(o)));l=`${l.slice(0,d).replace(/\s+$/,"")}\u2026`}return k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${o} font-weight=${js[e.fontWeight]??400}
    fill=${n.fill} fill-opacity=${n["fill-opacity"]}>${l}</text>`}function Ys(e,t){let n=He(e.colorHex,"stroke"),i=He(e.trackColorHex,"stroke","#FFFFFF"),a=e.lineWidth;if(e.style==="bar"){let h=t.w,g=Math.max(a,h*e.fraction);return k`
      <rect x=${t.x} y=${t.cy-a/2} width=${h} height=${a} rx=${a/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${t.x} y=${t.cy-a/2} width=${g} height=${a} rx=${a/2}
        fill=${n.stroke} fill-opacity=${n["stroke-opacity"]} />`}let r=Math.min(t.w,t.h),o=Math.max(0,r/2-a/2),l=2*Math.PI*o,s=e.style==="ring"?1:.75,d=e.style==="ring"?-90:135,u=l*s,c=l*s*e.fraction;return k`
    <g transform="rotate(${d} ${t.cx} ${t.cy})">
      <circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${u} ${l}" />
      ${e.fraction>0?k`<circle cx=${t.cx} cy=${t.cy} r=${o} fill="none" stroke-width=${a} stroke-linecap="round"
            stroke=${n.stroke} stroke-opacity=${n["stroke-opacity"]}
            stroke-dasharray="${c} ${l}" />`:f}
    </g>`}var Js=5;function Xs(e,t){let n=e.values,i=Math.max(n.length,1),a=e.highIndex!==void 0||e.lowIndex!==void 0,r=e.marker==="none"||!a?0:Js,o=e.style==="bars"?0:e.lineWidth/2,l=t.x,s=Math.max(t.w,0),d=t.y+r+o,u=Math.max(t.h-r-o*2,1),c=d+u,h=Math.max(e.domainMax-e.domainMin,Number.EPSILON),g=e.baseline==="lowest",y=g?u*.12:0,w=Math.min(Math.max(e.barGap,0),s/(i*2)),x=Math.max((s-w*(i-1))/i,.5),T=m=>Math.min(1,Math.max(0,(m-e.domainMin)/h)),$=m=>c-T(m)*u;return{count:n.length,barWidth:x,plotTop:d,plotBottom:c,baselineY:g?c:$(0),barRect(m){let b=l+m*(x+w),v=n[m],C,I;if(g){let O=y+T(v)*(u-y);C=c-O,I=c}else C=$(v),I=g?c:$(0),C>I&&([C,I]=[I,C]);return{x:b,y:C,w:x,h:Math.max(I-C,.5)}},point(m){let b=Math.max(s-o*2,0);return{x:n.length>1?l+o+b*m/(n.length-1):l+s/2,y:$(n[m])}},markerCenter(m,b){let v=b?this.barRect(m):void 0;return{x:v?v.x+v.w/2:this.point(m).x,y:t.y+r/2}}}}function Zs(e,t){if(e.values.length===0)return f;let n=Xs(e,t),i=He(e.colorHex,"fill"),a=He(e.highColorHex,"fill",e.colorHex),r=He(e.lowColorHex,"fill",e.colorHex),o=(u,c)=>k`<circle cx=${u.x} cy=${u.y} r="1.7" fill=${c.fill} fill-opacity=${c["fill-opacity"]} />`,l=[],s=e.pointColorHexes.length===n.count,d=u=>s?He(e.pointColorHexes[u],"fill",e.colorHex):i;if(e.style==="bars")for(let u=0;u<n.count;u++){let c=n.barRect(u),h=u===e.highIndex?a:u===e.lowIndex?r:d(u),g=Math.min(1.2,c.w/2,c.h/2);l.push(k`<rect x=${c.x} y=${c.y} width=${c.w} height=${c.h} rx=${g}
        fill=${h.fill} fill-opacity=${h["fill-opacity"]} />`)}else{let u=Array.from({length:n.count},(h,g)=>n.point(g)),c=u.map((h,g)=>`${g===0?"M":"L"}${h.x} ${h.y}`).join(" ");if(e.style==="area")if(e.fillBands&&s&&n.count>1)for(let h=0;h<n.count-1;h++){let g=u[h],y=u[h+1],w=d(h+1),x=`M${g.x} ${g.y} L${y.x} ${y.y} L${y.x} ${n.baselineY} L${g.x} ${n.baselineY} Z`;l.push(k`<path d=${x} fill=${w.fill}
            fill-opacity=${w["fill-opacity"]*.28} stroke="none" />`)}else{let h=`${c} L${u[u.length-1].x} ${n.baselineY} L${u[0].x} ${n.baselineY} Z`;l.push(k`<path d=${h} fill=${i.fill}
          fill-opacity=${i["fill-opacity"]*.28} stroke="none" />`)}if(s&&n.count>1)for(let h=0;h<n.count-1;h++){let g=u[h],y=u[h+1],w=d(h+1);l.push(k`<path d=${`M${g.x} ${g.y} L${y.x} ${y.y}`} fill="none"
          stroke=${w.fill} stroke-opacity=${w["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(k`<path d=${c} fill="none" stroke=${i.fill} stroke-opacity=${i["fill-opacity"]}
        stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(o(u[e.highIndex],a)),e.lowIndex!==void 0&&l.push(o(u[e.lowIndex],r))}if(e.marker!=="none"){let u=e.style==="bars";if(e.highIndex!==void 0){let c=n.markerCenter(e.highIndex,u);l.push(e.marker==="pointer"?k`<path d=${`M${c.x} ${c.y-1.8} L${c.x+2.2} ${c.y+1.8} L${c.x-2.2} ${c.y+1.8} Z`}
            fill=${a.fill} fill-opacity=${a["fill-opacity"]} />`:o(c,a))}e.lowIndex!==void 0&&l.push(o(n.markerCenter(e.lowIndex,u),r))}return k`${l}`}function Qs(e,t){let n=He(e.fillColorHex,"fill"),i=e.borderColorHex?Ee(e.borderColorHex):void 0,a=i?e.borderWidth:0,r=a/2,o=i?i.color:"none",l=i?i.opacity:0;switch(e.shapeKind){case"circle":{let s=Math.min(t.w,t.h)/2-r;return k`<circle cx=${t.cx} cy=${t.cy} r=${Math.max(0,s)}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"capsule":{let s=Math.min(t.w,t.h)/2;return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${s}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}case"roundedRectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)} rx=${e.cornerRadius}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`;case"rectangle":return k`<rect x=${t.x+r} y=${t.y+r} width=${Math.max(0,t.w-a)} height=${Math.max(0,t.h-a)}
        fill=${n.fill} fill-opacity=${n["fill-opacity"]}
        stroke=${o} stroke-opacity=${l} stroke-width=${a} />`}}function el(e,t,n){let i=n.render(e.symbol,e.size,e.colorHex);if(i)return k`<g transform="translate(${t.cx-e.size/2} ${t.cy-e.size/2})">${i}</g>`;let a=He(e.colorHex,"stroke"),r=e.size;return k`
    <rect x=${t.cx-r/2} y=${t.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var Ci=.25,tl=8;function nl(e,t,n,i,a,r,o,l){let s={x:0,y:0,width:e,height:t};if(!(e>0)||!(t>0)||!(n>0)||!(i>0))return s;let d=Math.min(Math.max(Number.isFinite(r)?r:1,Ci),tl),u=Math.max(e/n,t/i),c=Math.min(e/n,t/i),h=(a==="fit"?c:u)*d,g=n*h,y=i*h,w=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),x=Math.min(Math.max(Number.isFinite(l)?l:0,-1),1);return{x:-(g-e)/2*(1+w)+0,y:-(y-t)/2*(1+x)+0,width:g,height:y}}function hn(e){let t=e.getHours()%12||12,n=i=>String(i).padStart(2,"0");return`${t}:${n(e.getMinutes())}:${n(e.getSeconds())}`}var un=4;function mn(e,t,n){let i=Math.min(Math.max(e.timestampSize,4),40),a=n.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let s=e.timestampCorner.endsWith("Leading")?t.x+un:t.x+t.w-un-a,d=e.timestampCorner.startsWith("top")?t.y+un:t.y+t.h-un-r;return{x:s,y:d,w:a,h:r,size:i,label:n}}let l=(s,d,u,c)=>c>=u?d+(u-c)/2:Math.min(d+u-c,Math.max(d,s-c/2));return{x:l(t.x+e.timestampX*t.w,t.x,t.w,a),y:l(t.y+e.timestampY*t.h,t.y,t.h,r),w:a,h:r,size:i,label:n}}function il(e,t,n){let i=n.icons,a=`imgclip-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?mn(e,t,hn(new Date)):void 0,l=o?k`
        <rect data-ts-handle="1" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx=${o.h/2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${o.x+o.w/2} y=${o.y+o.h/2} text-anchor="middle" dominant-baseline="central"
          font-size=${o.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${o.label}</text>`:f,s=3,d=o&&n.timestampActiveId===e.id?k`
        <rect x=${o.x} y=${o.y} width=${o.w} height=${o.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw",o.x,o.y],["ne",o.x+o.w,o.y],["sw",o.x,o.y+o.h],["se",o.x+o.w,o.y+o.h]].map(([h,g,y])=>k`<rect data-ts-corner=${h} x=${g-s/2} y=${y-s/2} width=${s} height=${s}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${h}-resize" />`)}`:f,u=e.url?n.imageSizes?.size(e.url):void 0,c;if(e.url&&u){let h=nl(t.w,t.h,u.width,u.height,e.contentMode,e.zoom,e.panX,e.panY);c=k`<image href=${e.url} x=${t.x+h.x} y=${t.y+h.y} width=${h.width} height=${h.height}
      preserveAspectRatio="none" />`}else e.url?c=k`<image href=${e.url} x=${t.x} y=${t.y} width=${t.w} height=${t.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:c=k`
      <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${t.cx-7} ${t.cy-7})">${i.render("camera.fill",14,"#FFFFFF99")??f}</g>`;return k`
    <defs><clipPath id=${a}><rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${l}</g>${d}`}function al(e,t,n,i,a){if(!i)return f;let r=Math.min(10,t.w*.5,t.h*.5),o=a!==void 0?rl(a,t):void 0;return k`
    <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?k`<text x=${t.cx} y=${t.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${xi} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?k`<g transform="translate(${t.cx-r/2} ${t.cy-r/2})" opacity="0.8">${n.render("hand.tap.fill",r,"#FFD60A")??f}</g>`:f}`}var xi=5;function rl(e,t){let n=xi*.55,i=t.w-2;if(t.h<xi*1.6||i<n*4)return;if(e.length*n<=i)return e;let a=Math.max(1,Math.floor(i/n)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function wi(e,t,n){if(e.isHidden&&!n.showHidden)return f;let i=n.tapReview===!0,a=n.tapAreas===!0||i,r=i?n.tapFocusId:void 0,o=r!==void 0&&e.id===r,l=r!==void 0;if(e.kind==="tap"&&!a)return f;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!i||l&&!o))return f;let s=yr(e,t),d=i&&(!l||o),u;switch(e.kind){case"text":u=qs(e,s);break;case"icon":u=el(e,s,n.icons);break;case"gauge":u=Ys(e,s);break;case"chart":u=Zs(e,s);break;case"shape":u=Qs(e,s);break;case"image":u=il(e,s,n);break;case"tap":u=al(e,s,n.icons,a,d?Ae(e.action):void 0);break}let c=i&&(e.kind!=="tap"||l&&!o)?.35:1,h=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*c,g=n.highlightId===e.id,y=g||n.highlightIds?.includes(e.id)===!0,w=n.handles===!0&&(!l||o),x=y?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:f,T=n.hoverId===e.id||n.hoverIds?.includes(e.id)===!0?k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:f,$=k`<rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="transparent" stroke="none" />`,m=3,b=g&&w?[["nw",s.x,s.y],["ne",s.x+s.w,s.y],["sw",s.x,s.y+s.h],["se",s.x+s.w,s.y+s.h]].map(([v,C,I])=>k`<rect data-handle=${v} x=${C-m/2} y=${I-m/2} width=${m} height=${m}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${v}-resize" />`):f;return k`<g data-element-id=${e.id} opacity=${h} style=${w?"cursor:move":f}
    transform="rotate(${e.frame.rotationDegrees} ${s.cx} ${s.cy})">${$}${u}${T}${x}${b}</g>`}function fn(e,t){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:t?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function Si(e,t){return(t?23.5:34)*e}var lr=10.5;function br(e,t){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*t}function dr(e,t){let n=0;for(let i of e)n+=br(i,t);return n}function cr(e,t,n){let i=e.toUpperCase(),a=d=>br(d,n),r=.9*n,o=0;for(let d of i)o+=a(d);if(o<=t)return i;let l=0,s="";for(let d of i){if(l+a(d)+r>t)break;s+=d,l+=a(d)}return`${s.replace(/\s+$/,"")}\u2026`}function $i(e,t,n){let i=n*Math.PI/180;return{x:e.cx+t*Math.cos(i),y:e.cy+t*Math.sin(i)}}function ki(e,t,n,i){let a=$i(e,t,n),r=$i(e,t,i);return`M ${a.x} ${a.y} A ${t} ${t} 0 0 1 ${r.x} ${r.y}`}function vr(e,t,n,i){let{dial:a}=fn(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:t,d:ki(a,n,i.start,i.end),length:n*r}}function ol(e,t){let n=fn(e,!0);return vr(e,t,n.dial.r,n.labelArc)}var ur=18.5,sl=113,ll={start:-71,end:-36},pr=104,dl=6.2,hr={start:-77,end:-30.5};function mr(e){let t=e.replace("#",""),n=i=>parseInt(t.slice(i,i+2),16)||0;return[n(0),n(2),n(4)]}function fr(e,t){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let n=Math.min(1,Math.max(0,t))*(e.length-1),i=Math.min(e.length-2,Math.floor(n)),a=n-i,r=mr(e[i]),o=mr(e[i+1]),l=(s,d)=>Math.round(s+(d-s)*a);return`rgb(${l(r[0],o[0])}, ${l(r[1],o[1])}, ${l(r[2],o[2])})`}var vi=11;function cl(e,t,n){let{dial:i}=fn(t,!0),a=pr*t,r=180/(Math.PI*pr),o=e.minLabel!==void 0?dr(e.minLabel,vi)*r:0,l=e.maxLabel!==void 0?dr(e.maxLabel,vi)*r:0,s=hr.start+(o>0?Math.max(0,o-1.8):0),d=hr.end-(l>0?Math.max(0,l-1.8):0),u=d-s,c=24,h=[];for(let T=0;T<c;T++){let $=s+u*T/c,m=Math.min(d,s+u*(T+1)/c+.4);h.push(k`<path d=${ki(i,a,$,m)} fill="none"
      stroke=${fr(e.colorHexes,(T+.5)/c)} stroke-width=${dl*t}
      stroke-linecap=${T===0||T===c-1?"round":"butt"} />`)}let g=(e.value-e.minValue)/(e.maxValue-e.minValue),y=$i(i,a,s+u*g),w=1.5,x=(T,$,m,b)=>k`
    <defs><path id=${T} d=${ki(i,a,$,m)} /></defs>
    <text font-size=${vi*t} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${T}" startOffset="50%" text-anchor="middle">${b}</textPath></text>`;return k`${h}
    <circle cx=${y.x} cy=${y.y} r=${3.2*t} fill=${fr(e.colorHexes,g)}
      stroke="#000000" stroke-width=${1.2*t} />
    ${e.minLabel!==void 0?x(`${n}-gmin`,s-w-Math.max(o,3),s-w,e.minLabel):f}
    ${e.maxLabel!==void 0?x(`${n}-gmax`,d+w,d+w+Math.max(l,3),e.maxLabel):f}`}function Ei(e,t){let n=e.family in de?e.family:"rectangular",i=t.slot??de[n],a=de[n],r=pn(i,n),o=`clip-${n}-${Math.random().toString(36).slice(2,8)}`,l=Ee(e.backgroundColorHex),s=Ee(e.borderColorHex),d=e.borderWidth*r.scale;if(n==="corner"){let y=r.scale,w=!!e.bezelText||!!e.bezelGauge,x=e.curvedText??"",T=x!=="",$=fn(y,w),m=Si(y,w),b=m/(a.width*y),v=$.tile.cx-m/2,C=$.tile.cy-m/2,I=`M 0 0 H ${$.quad.width-$.cornerRadius} A ${$.cornerRadius} ${$.cornerRadius} 0 0 1 ${$.quad.width} ${$.cornerRadius} V ${$.quad.height} H 0 Z`,O=f;if(e.bezelGauge)O=cl(e.bezelGauge,y,o);else if(e.bezelText){let A=ol(y,`${o}-bezel`),P=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?pt((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;O=k`<defs><path id=${A.id} d=${A.d} /></defs>
        <text font-size=${lr*y} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${A.id}" startOffset="50%" text-anchor="middle">${cr(P,A.length,lr*y)}</textPath></text>`}let S=f;if(T){let A=Ee(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},P=vr(y,`${o}-curved`,sl*y,ll);S=k`<defs><path id=${P.id} d=${P.d} /></defs>
        <text font-size=${ur*y} font-weight="600" fill=${A.color} fill-opacity=${A.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${P.id}" startOffset="50%" text-anchor="middle">${cr(x,P.length,ur*y*.88)}</textPath></text>`}else{let A=e.borderWidth*r.scale*b,P=s?k`<circle cx=${m/2} cy=${m/2} r=${m/2-A/2} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${A} />`:f;S=k`<g transform="translate(${v} ${C})">
        <g clip-path=${`url(#${o})`}>
          ${l?k`<rect width=${m} height=${m} fill=${l.color} fill-opacity=${l.opacity} />`:f}
          <g data-design-box transform="scale(${r.scale*b})">
            ${e.elements.map(G=>wi(G,a,t))}
          </g>
        </g>
        <circle cx=${m/2} cy=${m/2} r=${m/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*y} stroke-dasharray=${`${2*y} ${2*y}`} />
        ${P}
      </g>`}return k`<svg viewBox=${`0 0 ${$.quad.width} ${$.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${$.quad.width} height=${$.quad.height}>
      <defs><clipPath id=${o}><circle cx=${m/2} cy=${m/2} r=${m/2} /></clipPath></defs>
      <path d=${I} fill="#000000" />
      ${O}
      ${S}
    </svg>`}let u=k`<rect width=${i.width} height=${i.height} />`,c=s?k`<rect x=${d/2} y=${d/2} width=${i.width-d} height=${i.height-d} fill="none" stroke=${s.color} stroke-opacity=${s.opacity} stroke-width=${d} />`:f,h=k`<rect width=${i.width} height=${i.height} fill="#000000" />`,g=`0 0 ${i.width} ${i.height}`;return k`<svg viewBox=${g} xmlns="http://www.w3.org/2000/svg" class="complication ${n}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${u}</clipPath></defs>
    <g clip-path=${`url(#${o})`}>
      ${h}
      ${l?k`<rect width=${i.width} height=${i.height} fill=${l.color} fill-opacity=${l.opacity} />`:f}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${e.elements.map(y=>wi(y,a,t))}
      </g>
    </g>
    ${c}
  </svg>`}var ul=.14;function pl(e,t){let n=yr(e,t);if(e.kind!=="text"||e.text==="")return n;let i=Math.min(n.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(n.h,e.fontSize*1.3);return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}function hl(e,t,n){let i=e.family in de?e.family:"rectangular",a=de[i],r=e.elements.filter(h=>t.includes(h.id)),o=1/0,l=1/0,s=-1/0,d=-1/0;for(let h of r){let g=pl(h,a),y=h.frame.rotationDegrees%180===0?0:Math.hypot(g.w,g.h)/2;o=Math.min(o,y?g.cx-y:g.x),l=Math.min(l,y?g.cy-y:g.y),s=Math.max(s,y?g.cx+y:g.x+g.w),d=Math.max(d,y?g.cy+y:g.y+g.h)}let u=s-o,c=d-l;if(r.length===0||!(u>0)||!(c>0))o=0,l=0,u=a.width,c=a.height;else{let h=Math.max(2,Math.max(u,c)*ul);o-=h,l-=h,u+=2*h,c+=2*h}if(u/c<n){let h=c*n;o-=(h-u)/2,u=h}else{let h=u/n;l-=(h-c)/2,c=h}return{x:o,y:l,w:u,h:c}}function xr(e,t,n){let i=e.family in de?e.family:"rectangular",a=de[i],r=hl(e,t,n.width/n.height),o=Ee(e.backgroundColorHex),l=Ee(e.borderColorHex),s=e.borderWidth,d={icons:n.icons,showHidden:!0,tapAreas:!0,...n.imageSizes?{imageSizes:n.imageSizes}:{}},u=e.elements.filter(g=>t.includes(g.id)),c=l&&s>0?i==="rectangular"?k`<rect x=${s/2} y=${s/2} width=${a.width-s} height=${a.height-s} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-s/2} fill="none" stroke=${l.color} stroke-opacity=${l.opacity} stroke-width=${s} />`:f,h=i==="rectangular"?k`<rect width=${a.width} height=${a.height} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`:k`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${o?o.color:"#000000"} fill-opacity=${o?o.opacity:1} />`;return k`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${n.width} height=${n.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${h}
    ${u.map(g=>wi(g,a,d))}
    ${c}
  </svg>`}function U(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline"}}var ht=["rectangular","circular","corner","inline"];function Nt(e){return ee.includes(e)}function wr(e){return ht.filter(t=>e.supportedFamilies.includes(t))}function $r(e){return ee.find(t=>e.supportedFamilies.includes(t))}function mt(e,t){return e.supportedFamilies.includes(t)&&e.supportedFamilies.length>1}function ml(e){let t=e.elements.find(i=>i.kind==="text");return{value:t&&t.kind==="text"?structuredClone(t.payload.value):M("Text")}}function kr(e,t){e.supportedFamilies.includes(t)||(e.supportedFamilies=ht.filter(n=>n===t||e.supportedFamilies.includes(n))),Nt(t)?e.perFamily[t]||(e.perFamily[t]=ii()):e.inline||(e.inline=ml(e)),e.schemaVersion=Rt(e)}function Cr(e,t){mt(e,t)&&(e.supportedFamilies=e.supportedFamilies.filter(n=>n!==t),Nt(t)?delete e.perFamily[t]:delete e.inline,e.schemaVersion=Rt(e))}function Sr(e,t){let n=[];if(!Nt(t)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||n.push("the Inline text")),n}let i=e.perFamily[t];if(!i)return n;let a=Object.keys(i.placements).length;return a>0&&n.push(`${a} placement${a===1?"":"s"}`),i.rules.length>0&&n.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&n.push("the bezel"),i.curvedText&&n.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&n.push("the background or border"),n}var te={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",shape:"#43a047",image:"#00acc1",tap:"#ec407a"},ft={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",shape:"Shape",image:"Picture",tap:"Tap area"},Er=["text","icon","gauge","chart","shape","image","tap"],Y={states:"#f9a825",tap:te.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Tr="2.8.0";function Ti(e){if(typeof e!="string")return;let t=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(t)return[Number(t[1]),Number(t[2]),Number(t[3]??0)]}function fl(e,t){for(let n=0;n<3;n++)if(e[n]!==t[n])return e[n]<t[n]?-1:1;return 0}function Fr(e,t=Tr){let n=Ti(e),i=Ti(t);return!n||!i?!1:fl(n,i)>=0}function Rr(e,t=Tr){return`${Ti(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The complication editor needs ${t} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`}var Ir="52a9d81d0fd7";function gl(e){return e.trim().replace(/\./g,"-")}function yl(e){return e.trim().replace(/-/g,".")}var gn=class e{constructor(t){this.onReady=t;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let t=window.customIcons?.ios;if(!t||typeof t.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>t.getIconList()).then(n=>{this.nameList=(n??[]).map(i=>yl(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(t,n,i){let a=gl(t),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Ee(i)??{color:"#FFFFFF",opacity:1},l=r.viewBox??"0 0 24 24";return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${l}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(t){if(this.pending.has(t))return;let n=window.customIcons?.ios;if(!n){this.cache.set(t,null);return}this.pending.add(t),Promise.resolve().then(()=>n.getIcon(t)).then(i=>this.cache.set(t,i&&i.path?i:null)).catch(()=>this.cache.set(t,null)).finally(()=>{this.pending.delete(t),this.onReady()})}},Fi=class{constructor(t){this.onReady=t;this.icons=new Map;this.state="idle"}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(t,n,i){this.load();let a=this.icons.get(t.trim());if(!a)return;let r=Ee(i)??{color:"#FFFFFF",opacity:1};return k`<svg x="0" y="0" width=${n} height=${n} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let t=new URL(`symbol-icons.json.gz?v=${Ir}`,import.meta.url);fetch(t).then(n=>{if(!n.ok||!n.body)throw new Error(`symbol file: ${n.status}`);return new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(n=>{if(n&&typeof n=="object")for(let[i,a]of Object.entries(n))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}};function Ar(e){return gn.available()?new gn(e):new Fi(e)}function Mr(e){let t=new Map,n=new Set;return{size(i){let a=t.get(i);if(a)return a;if(n.has(i))return;n.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(t.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var bn=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],vn=[...new Set(bn.flatMap(e=>e.symbols))],bl={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function vl(e){return`${e.replace(/\./g," ")} ${(bl[e]??[]).join(" ")}`}function Hr(e,t){let n=t.toLowerCase().split(/[\s.]+/).filter(Boolean);if(n.length===0)return[...e];let i=[];for(let a of e){let r=vl(a);if(!n.every(l=>r.includes(l)))continue;let o=n.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var yn=class e{constructor(t){this.onChange=t;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(t){return!this.collapsed.has(t)}toggle(t){this.collapsed.has(t)?this.collapsed.delete(t):this.collapsed.add(t),this.onChange()}query(t){return this.browsing.get(t)?.query??""}category(t){return this.browsing.get(t)?.category??""}setQuery(t,n){this.browsing.set(t,{category:this.category(t),query:n}),this.onChange()}setCategory(t,n){this.browsing.set(t,{query:this.query(t),category:n}),this.onChange()}noteUsed(t){let n=t.trim();n&&(this.recent=[n,...this.recent.filter(i=>i!==n)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let t=localStorage.getItem(e.STORAGE_KEY),n=t?JSON.parse(t):[];return Array.isArray(n)?n.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(t){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(t))}catch{}}};var xl=100;function Lr(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var et=class e{constructor(t,n){this.config=t;this.past=[];this.future=[];this.coalesceUntil=0;this.baseRevision=n,Xe(t),this.baseline=JSON.stringify(an(t))}static fromDocument(t,n){return new e(Da(t),n)}get dirty(){return JSON.stringify(an(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(t,n){let i=Date.now();n!==void 0&&n===this.coalesceKey&&i<this.coalesceUntil||(this.past.push(structuredClone(this.config)),this.past.length>xl&&this.past.shift(),this.future=[]),this.coalesceKey=n,this.coalesceUntil=n===void 0?0:i+800;let r=structuredClone(this.config);t(r),Xe(r),this.config=r}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0}undo(){let t=this.past.pop();t&&(this.future.push(this.config),this.config=t,this.endGesture())}redo(){let t=this.future.pop();t&&(this.past.push(this.config),this.config=t,this.endGesture())}encoded(){let t=structuredClone(this.config);return t.dataSources=yi(t),an(t)}commit(){let t=structuredClone(this.config);return t.dataSources=yi(t),new e(t,null)}};var gt={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Le={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},zr=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Pr={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Ri=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],wl=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function Ii(e){return wl.includes(e)}function $l(e){return Ri.includes(e)}function kl(e,t){return JSON.stringify(Z(e))===JSON.stringify(Z(t))}function Ai(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let t=e[0];if(!t)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let n,i=[];for(let[r,o]of t.cases.entries()){let l=o.when.tests;if(l.length!==1)return{ok:!1,reason:l.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${l.length} things at once. A table row checks one.`};let s=l[0];if(!$l(s.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${gt[s.comparison.kind]}", which a table row cannot show.`};if(n===void 0)n=s.value;else if(!kl(n,s.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=_r(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Le[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:s.id,join:o.when.join,comparison:s.comparison,changes:o.then})}if(t.otherwise){let r=_r(t.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Le[r]} twice. A table has one cell per column.`}}let a={ruleId:t.id,rows:i,columns:Cl(i,t.otherwise),numberMode:i.length>0&&i.every(r=>Ii(r.comparison.kind))};return n!==void 0&&(a.value=n),t.otherwise&&(a.otherwise=t.otherwise),{ok:!0,table:a}}function _r(e){let t=new Set;for(let n of e){let i=he[n.kind];if(t.has(i))return i;t.add(i)}}function Cl(e,t){let n=new Set;for(let i of e)for(let a of i.changes)n.add(he[a.kind]);for(let i of t??[])n.add(he[i.kind]);return zr.filter(i=>n.has(i))}function Nr(e,t,n){let i=new Set(e);for(let a of t)i.add(a);return zr.filter(a=>i.has(a)&&n.includes(a))}function xn(e,t){return e.find(n=>he[n.kind]===t)}function Or(e,t,n,i){let a=t.map(o=>({id:o.caseId??q(),when:{join:o.join??"all",tests:[{id:o.testId??q(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??q(),cases:a};return n&&(r.otherwise=n),r}function Ot(e){if(e.length===0)return"No states yet.";let t=Ai(e);if(!t.ok)return"Advanced rules.";let n=t.table.rows.length+(t.table.otherwise?1:0);return n===1?"1 state.":`${n} states.`}function Vr(e){let t=e[0];return t||(t={id:q(),cases:[]},e.push(t)),t}function Dr(e){let t=e[0];t&&t.cases.length===0&&t.otherwise===void 0&&(e.length=0)}function Br(e,t,n){let i=Vr(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:q(),when:{join:"all",tests:[{id:q(),value:structuredClone(t),comparison:El(a,n)}]},then:[]})}function Gr(e,t){let n=e[0];n&&(n.cases=n.cases.filter(i=>i.id!==t),Dr(e))}function Mi(e,t,n){let i=e[0]?.cases;if(!i||n<0||n>=i.length)return;let[a]=i.splice(t,1);a&&i.splice(n,0,a)}function Hi(e,t){if(t){Vr(e).otherwise=[];return}let n=e[0];n&&(delete n.otherwise,Dr(e))}function Ur(e,t){for(let n of e[0]?.cases??[]){let i=n.when.tests[0];i&&(i.value=structuredClone(t))}}function Kr(e,t){let n=e[0];if(!n)return;let i=a=>a.filter(r=>he[r.kind]!==t);for(let a of n.cases)a.then=i(a.then);n.otherwise&&(n.otherwise=i(n.otherwise))}function Sl(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Wr(e,t=Sl){let n=()=>t(e.value??M(""));switch(e.kind){case"lessThan":return`below ${n()}`;case"lessOrEqual":return`${n()} or below`;case"greaterThan":return`above ${n()}`;case"greaterOrEqual":return`${n()} or above`;case"between":return`${n()} to ${t(e.upper??M(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Ze(e.kind)==="value"?`${gt[e.kind]} ${n()}`:gt[e.kind]}}function El(e,t){if(!e)return t?{kind:"lessThan",value:M("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??M("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??M("0")};default:return{kind:e.kind,...Ze(e.kind)==="value"?{value:M("")}:{}}}}var jr={text:"text",icon:"icon",gauge:"color",chart:"color",shape:"color",image:"visibility",tap:"visibility",layout:"backgroundColor"};function qr(e){if(!e)return!1;let t=e.kind;if(t.kind!=="entityState")return!1;let n=t.domain||t.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(n)}function Tl(e){switch(e){case"text":return k`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return k`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return k`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return k`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"shape":return k`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return k`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return k`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return k`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"clock":return k`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return k`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return k`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return k`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return k`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return k`<path d="M6 9L12 15L18 9" />`;case"plus":return k`<path d="M12 5V19M5 12H19" />`;case"watch":return k`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"lock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return k`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return k`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return k`<path d="M6 14L12 8L18 14" />`;case"down":return k`<path d="M6 10L12 16L18 10" />`;case"show":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return k`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return k`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return k`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return k`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return k`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`}}function N(e){return p`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Tl(e)}</svg>`}function yt(e,t){let n=new DOMPoint(t.clientX,t.clientY),i=e.getScreenCTM();if(!i)return{x:0,y:0};let a=n.matrixTransform(i.inverse());return{x:a.x,y:a.y}}function Yr(e){let t=Math.min(.96,Math.max(-e.width+.04,e.x)),n=Math.min(1-.04,Math.max(-e.height+.04,e.y));return{...e,x:t,y:n}}var wn=e=>Math.round(e*1e3)/1e3,Jr=10;function Li(e,t,n,i){let a=i.width>0?e.x+t/i.width:e.x,r=i.height>0?e.y+n/i.height:e.y;return Yr({...e,x:wn(a),y:wn(r)})}function Xr(e,t,n,i){let a=r=>Math.min(1,Math.max(0,r));return{x:i.w>0?wn(a(e.x+t/i.w)):e.x,y:i.h>0?wn(a(e.y+n/i.h)):e.y}}function $n(e,t,n,i,a){let r=yt(e,n),o={...i.frame},l=o;e.setPointerCapture(n.pointerId);let s=h=>Math.round(h*1e3)/1e3,d=h=>{if(h.pointerId!==n.pointerId)return;let g=yt(e,h),y=(g.x-r.x)/t.width,w=(g.y-r.y)/t.height,x;if(!i.handle)x=Yr({...o,x:s(o.x+y),y:s(o.y+w)});else{let{x:T,y:$,width:m,height:b}=o,v=o.x+o.width,C=o.y+o.height;i.handle.includes("e")&&(m=Math.max(.04,o.width+y)),i.handle.includes("s")&&(b=Math.max(.04,o.height+w)),i.handle.includes("w")&&(m=Math.max(.04,o.width-y),T=v-m),i.handle.includes("n")&&(b=Math.max(.04,o.height-w),$=C-b),x={...o,x:s(T),y:s($),width:s(m),height:s(b)}}l=x,a.onFrame(i.elementId,x,!1)},u=h=>{h.pointerId===n.pointerId&&(c(),a.onFrame(i.elementId,l,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",u);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",u),c}function Zr(e,t,n,i,a){let r=yt(e,n),o=i;e.setPointerCapture(n.pointerId);let l=h=>Math.round(h*1e3)/1e3,s=h=>Math.min(1,Math.max(0,h)),d=h=>{if(h.pointerId!==n.pointerId)return;let g=yt(e,h),y=t.w>0?s(i.x+(g.x-r.x)/t.w):i.x,w=t.h>0?s(i.y+(g.y-r.y)/t.h):i.y;o={x:l(y),y:l(w)},a(o.x,o.y,!1)},u=h=>{h.pointerId===n.pointerId&&(c(),a(o.x,o.y,!0))},c=()=>{e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",u);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",d),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",u),c}function Qr(e,t,n,i,a){let r=yt(e,t),o=1;e.setPointerCapture(t.pointerId);let l=u=>{if(u.pointerId!==t.pointerId)return;let c=yt(e,u),h=(c.x-r.x)*(n.includes("e")?1:-1),g=(c.y-r.y)*(n.includes("s")?1:-1),y=i.w>0?(i.w+h)/i.w:1,w=i.h>0?(i.h+g)/i.h:1,x=Math.abs(y-1)>=Math.abs(w-1)?y:w;o=Math.max(.05,x),a(o,!1)},s=u=>{u.pointerId===t.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",s),e.removeEventListener("pointercancel",s);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",l),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),d}var Oi=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function se(e){return t=>e(t.target.value)}function ne(e,t,n,i={}){return p`<label class="field"><span>${e}</span>
    <input type="text" .value=${t} placeholder=${i.placeholder??""} list=${i.list??f}
      class=${i.mono?"mono":""} @input=${se(n)} /></label>`}function Fl(e,t,n,i=3){return p`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${t} class="mono" @input=${se(n)}></textarea></label>`}function j(e,t,n,i={}){let a=t===void 0||Number.isNaN(t)?"":String(t);return p`<label class="field"><span>${e}</span>
    <input type="number" .value=${a} step=${i.step??"any"} min=${i.min??f} max=${i.max??f}
      @input=${se(r=>{if(r.trim()===""){i.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} /></label>`}function B(e,t,n,i){return p`<label class="field"><span>${e}</span>
    <select @change=${se(a=>i(a))}>
      ${n.map(([a,r])=>p`<option value=${a} ?selected=${a===t}>${r}</option>`)}
    </select></label>`}function _i(e,t,n,i){let a=i.format??(r=>String(Math.round(r*100)/100));return p`<div class="field slider"><span>${e}</span>
    <div class="slider-row">
      <input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(t)}
        @input=${se(r=>{let o=Number(r);Number.isNaN(o)||n(o)})} />
      <span class="slider-value mono">${a(t)}</span>
      <button class="icon" title=${`Back to ${a(i.def)}`} aria-label="Reset" ?disabled=${t===i.def}
        @click=${()=>n(i.def)}>${N("reset")}</button>
    </div></div>`}function me(e,t,n){return p`<label class="field check"><input type="checkbox" .checked=${t} @change=${i=>n(i.target.checked)} /><span>${e}</span></label>`}function ae(e,t,n,i=!1){let a=(t??"").replace(/^#/,""),r=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(a),o=r?`#${a.slice(0,6)}`:"#ffffff",l=r&&a.length===8?Math.round(parseInt(a.slice(6,8),16)/255*100):100,s=(d,u)=>{let c=d.replace(/^#/,"").toUpperCase();return u>=100?`#${c}`:`#${c}${Math.round(u/100*255).toString(16).padStart(2,"0").toUpperCase()}`};return p`<div class="field color"><span>${e}</span>
    <div class="color-row">
      ${i?p`<input type="checkbox" title="Enabled" .checked=${t!==void 0} @change=${d=>n(d.target.checked?s(o,l):void 0)} />`:f}
      <input type="color" .value=${o} ?disabled=${i&&t===void 0} @input=${se(d=>n(s(d,l)))} />
      <input type="range" min="0" max="100" .value=${String(l)} title="Opacity" ?disabled=${i&&t===void 0} @input=${se(d=>n(s(o,Number(d))))} />
      <input type="text" class="mono hex" .value=${t??""} placeholder="#RRGGBB" ?disabled=${i&&t===void 0}
        @input=${se(d=>{let u=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(u)&&n(u.startsWith("#")?u.toUpperCase():`#${u.toUpperCase()}`)})} />
    </div></div>`}function ho(e,t){let n=e[t],i=n&&typeof n.attributes.friendly_name=="string"?n.attributes.friendly_name:t;return{entityId:t,displayName:i,domain:t.split(".")[0]??""}}function Rl(e,t){let n=t===void 0?void 0:typeof t=="string"?[t]:t,i=[];for(let[a,r]of Object.entries(e)){let o=a.split(".")[0]??"";if(n!==void 0&&!n.includes(o))continue;let l=typeof r?.attributes?.friendly_name=="string"?r.attributes.friendly_name.trim():"";i.push({entityId:a,name:l||a,state:r?.state??"",domain:o})}return i.sort((a,r)=>a.name.localeCompare(r.name)||a.entityId.localeCompare(r.entityId)),i}var mo=50;function Il(e){let t=e.state.trim().split(/\s+/)[0]??"";return t!==""&&Number.isFinite(Number(t))}function Al(e,t,n=mo,i){let a=t.trim().toLowerCase(),r=s=>i===void 0||i(s)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((s,d)=>r(s)-r(d))).slice(0,n);let o=a.split(/\s+/),l=[];for(let s of e){let d=s.entityId.toLowerCase(),u=s.name.toLowerCase(),c=-1;d===a?c=0:d.startsWith(a)?c=1:u.startsWith(a)?c=2:d.includes(a)?c=3:u.includes(a)?c=4:o.length>1&&o.every(h=>d.includes(h)||u.includes(h))&&(c=5),c>=0&&l.push({c:s,rank:c})}return l.sort((s,d)=>s.rank-d.rank||r(s.c)-r(d.c)||s.c.name.localeCompare(d.c.name)||s.c.entityId.localeCompare(d.c.entityId)),l.slice(0,n).map(s=>s.c)}var Ml=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function fo(e){return Ml.test(e.trim())}function Hl(e,t,n){let i=e.trim();if(i!==t.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in n)return ho(n,i);if(fo(i))return{...t,entityId:i,domain:i.split(".")[0]??""}}}var bt=new Map;function Te(e){let t=e instanceof Node?e:null;for(let n=0;t&&n<8;n+=1){let i=t.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}t=a}}function go(e){return bt.has(e)}function De(e,t,n,i,a,r={}){let o=e.hass.states,l=bt.get(a),s=l?Al(Rl(o,r.domain),l.query,mo,r.preferNumeric?Il:void 0):[],d=l?Math.max(0,Math.min(l.index,s.length-1)):0,u=n.entityId?o[n.entityId]:void 0,c=($,m,b=0)=>{bt.set(a,{query:m,index:b}),Te($)},h=$=>{bt.delete(a),Te($)},g=$=>{let m=Hl($,n,o);m&&i(m)},y=($,m)=>{i(ho(o,$.entityId)),h(m)},w=()=>Math.max(0,Math.min(bt.get(a)?.index??0,s.length-1)),x=$=>{let m=$.target;if($.key==="ArrowDown"||$.key==="ArrowUp"){$.preventDefault();let b=bt.get(a);if(!b){c(m,m.value);return}let v=$.key==="ArrowDown"?w()+1:w()-1;c(m,b.query,Math.max(0,Math.min(s.length-1,v))),Ll(m);return}if($.key==="Enter"){$.preventDefault();let b=s[w()];l&&b?y(b,m):(g(m.value),h(m));return}if($.key==="Escape"){if(!l)return;$.preventDefault(),$.stopPropagation(),h(m)}},T=n.entityId===""?p`<div class="hint">Type part of a name, such as "kitchen".</div>`:u?p`<div class="entity-current"><span class="ent-name">${typeof u.attributes.friendly_name=="string"?u.attributes.friendly_name:n.entityId}</span><span class="ent-state">${u.state}</span></div>`:p`<div class="hint warn">Not in Home Assistant right now.</div>`;return p`<div class="field entity-field">
    <span>${t}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${l?"true":"false"} autocomplete="off" spellcheck="false"
      .value=${l?l.query:n.entityId}
      placeholder="Search entities, or type an id"
      @focus=${$=>{let m=$.target;c(m,n.entityId),m.select()}}
      @input=${$=>{let m=$.target;c(m,m.value)}}
      @keydown=${x}
      @blur=${$=>{let m=$.target;l&&g(m.value),h(m)}} />
    ${l?p`<div class="entity-results" role="listbox">
          ${s.length===0?p`<div class="hint" style="padding:6px 8px">${fo(l.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:s.map(($,m)=>p`<button type="button" role="option" aria-selected=${m===d?"true":"false"} class="ent ${m===d?"hl":""}"
                @mousedown=${b=>b.preventDefault()} @click=${b=>y($,b.target)}>
                <span class="ent-main">
                  <span class="ent-name">${$.name}</span>
                  <span class="ent-id mono">${$.entityId}</span>
                </span>
                <span class="ent-state">${$.state}</span>
              </button>`)}
        </div>`:T}
    ${r.compact?f:p`<details class="sub">
      <summary>Display name: ${n.displayName||"(none)"}</summary>
      ${ne("Display name",n.displayName,$=>i({...n,displayName:$}))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`}function Ll(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var _l=120;function zl(e,t,n,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(bn.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:t.trim()!==""&&n.length>0?{names:[...n],fromPack:!0}:{names:a(vn),fromPack:!1}}function eo(e,t){return t.size===0?e.length:e.filter(n=>t.has(n)).length}function Pl(e){return[{value:"",label:`Starter set (${eo(vn,e)})`},...bn.map(t=>({value:t.name,label:`${t.name} (${eo(t.symbols,e)})`}))]}function Nl(e){return e.length>0?e.length:vn.length}function Ol(e,t,n,i){return n?t>e?`Showing ${e} of ${t}. Type more to narrow it down.`:t===1?"1 symbol matches.":`${t} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function to(e,t,n,i){let a=e.icons.render(t,22,"#FFFFFF");return p`<button type="button" class="sym ${n?"on":""}" title=${t} @click=${()=>i(t)}>
    <span class="sym-glyph">${a??p`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${t}</span>
  </button>`}function yo(e,t,n,i){let a=e.symbols,r=a.isOpen(i),o=a.query(i),l=e.icons.names(),s=l??[],d=new Set(s),u=t.trim(),c=u!==""&&d.size>0&&!d.has(u),h=y=>{n(y),a.noteUsed(y)},g=f;if(r){let y=a.category(i),w=zl(y,o,s,d),x=Hr(w.names,o),T=w.fromPack?x.slice(0,_l):x,$=d.size===0?a.recent:a.recent.filter(m=>d.has(m));g=p`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${o} @input=${se(m=>a.setQuery(i,m))} />
        <select @change=${se(m=>a.setCategory(i,m))}>
          ${Pl(d).map(m=>p`<option value=${m.value} ?selected=${m.value===y}>${m.label}</option>`)}
        </select>
      </div>
      ${$.length===0?f:p`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${$.map(m=>to(e,m,m===u,h))}</div>`}
      <div class="sym-grid">${T.map(m=>to(e,m,m===u,h))}</div>
      ${x.length===0?p`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`:p`<div class="hint">
            ${Ol(T.length,x.length,o.trim()!=="",Nl(s))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?p`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:f:p`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return p`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${t} placeholder="lightbulb.fill"
        @input=${se(n)} @change=${se(y=>{(d.size===0||d.has(y.trim()))&&a.noteUsed(y)})} /></label>
    ${c?p`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:f}
    <button type="button" class="link" @click=${()=>a.toggle(i)}>${r?"Hide symbols":"Browse symbols"}</button>
    ${g}`}var Vl=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Entity age (seconds)"],["aggregate","Aggregate"],["time","Time"],["dataAge","Data age (seconds)"],["jinja","Jinja template"],["named","Named value"],["chartStat","A chart's number"]],Dl=[["bars","Bars"],["line","Line"],["area","Area"]],Bl=[["auto","Auto (fit the readings)"],["fixed","Fixed range"]],Gl=[["lowest","Lowest value"],["zero","Zero"]],bo=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Ul=[["none","None"],["pointer","Triangle and dot"],["dot","Dots"]],Kl=[["uniform","One colour"],["bands","By value"]];function Wl(e){let t=[Wn,"#FFD60A"];if(e.length<2)return t.map((o,l)=>({id:q(),upTo:(l+1)*33,colorHex:o}));let n=Math.min(...e),a=Math.max(...e)-n,r=o=>Number(o.toFixed(a>=10?0:2));return t.map((o,l)=>({id:q(),upTo:r(n+a*(l+1)/3),colorHex:o}))}function jl(e){let t=ct(e).at(-1),n=e.bands.length>1?Math.abs(ct(e)[1].upTo-ct(e)[0].upTo):10;return{id:q(),upTo:(t?.upTo??0)+(n||10),colorHex:e.colorSlot.baseColorHex}}var ql=[["now","Now (HH:mm)"],["hour","Hour"],["minute","Minute"],["weekday","Weekday"],["day","Day"],["month","Month"],["timestamp","Unix timestamp"]];function Yl(e,t){let n="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(t){case"literal":return{kind:t,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:t,...n};case"entityAttribute":return{kind:t,...n,attribute:""};case"entityAge":return{kind:t,...n};case"aggregate":return{kind:t,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:t,timeField:"now"};case"dataAge":return{kind:t};case"jinja":return{kind:t,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:t,id:""};case"chartStat":return{kind:t,layer:"",stat:"latest"}}}function Q(e,t,n,i){if(i.inline||!Jl())return p`<div class="value-editor">${wo(e,t,n,i)}</div>`;let a=Vi(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(t):void 0,l=le(t,re(e));return p`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact?f:p`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${l}. Click to change it.`}>
      <span class="chip-text">${l}</span>
      ${o===void 0?f:p`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${vo(e,a,r,t,n,i)}
  </div>`}function vo(e,t,n,i,a,r){return p`<div class="value-pop" id=${t} popover role="dialog" aria-label=${n} @toggle=${xo}>
    <div class="pop-head">
      <b>${n}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${t} popovertargetaction="hide">Done</button>
    </div>
    ${Dt.has(t)?wo(e,i,a,r):f}
  </div>`}function re(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Vi(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function Jl(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var Dt=new Set,Vt=new WeakMap;function Xl(e){let t=e.getRootNode();return(t instanceof ShadowRoot||t instanceof Document?t:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function Zl(e,t){let n=e instanceof Node?e:null;if(!n)return;let i=n.getRootNode();!(i instanceof ShadowRoot)&&!(i instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let a=i.querySelector(`#${CSS.escape(t)}`);a&&typeof a.showPopover=="function"&&!a.matches(":popover-open")&&a.showPopover()}))}function xo(e){let t=e.currentTarget,n=e.newState==="open",i=Vt.get(t);if(i&&(i(),Vt.delete(t)),!n){Dt.delete(t.id)&&Te(t);return}let a=Xl(t);if(!a)return;let r=()=>{if(!t.isConnected||!t.matches(":popover-open")){Vt.get(t)?.(),Vt.delete(t);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){t.hidePopover();return}zi(t,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),Vt.set(t,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),zi(t,a.getBoundingClientRect()),Dt.has(t.id)||(Dt.add(t.id),Te(t),requestAnimationFrame(()=>{t.isConnected&&zi(t,a.getBoundingClientRect())}))}function zi(e,t){e.style.maxHeight="";let n=e.getBoundingClientRect(),i=Ql({left:t.left,top:t.top,bottom:t.bottom,width:t.width},{width:n.width,height:n.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var tt=8,kn=6,no=140;function Ql(e,t,n){let i=n.height-e.bottom-kn-tt,a=e.top-kn-tt,r=t.height>i&&a>i&&i<no,o=Math.max(no,r?a:i),l=Math.min(t.height,o),s=Math.max(tt,Math.min(e.left,n.width-t.width-tt)),d=r?Math.max(tt,e.top-kn-l):Math.max(tt,Math.min(e.bottom+kn,n.height-l-tt));return{left:s,top:d,maxHeight:o,above:r}}function wo(e,t,n,i){let a=t.kind,r=u=>n({...t,kind:u}),o=i.key,l=Vl.filter(([u])=>i.allowNamed!==!1||u!=="named"),s=f;switch(a.kind){case"literal":s=i.symbol?yo(e,a.value,u=>r({...a,value:u}),o):ne("Text",a.value,u=>r({...a,value:u}));break;case"entityState":case"entityAge":s=De(e,"Entity",a,u=>r({...a,...u}),`${o}-entity`);break;case"entityAttribute":{let u=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),c=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;s=p`${De(e,"Entity",a,h=>r({...a,...h}),`${o}-entity`)}
        ${ne("Attribute",a.attribute,h=>r({...a,attribute:h}),{list:c,mono:!0})}
        <datalist id=${c}>${u.map(h=>p`<option value=${h}></option>`)}</datalist>`;break}case"aggregate":s=td(e,a.aggregate,u=>r({...a,aggregate:u}),o);break;case"time":s=B("Field",a.timeField,ql,u=>r({...a,timeField:u}));break;case"dataAge":s=p`<div class="hint">Seconds since the watch last fetched values.</div>`;break;case"jinja":s=p`${Fl("Template",a.value,u=>r({...a,value:u}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":s=e.config.values.length===0?p`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`:B("Value",a.id,[["","(choose)"],...e.config.values.map(u=>[u.id,u.name||u.id.slice(0,8)])],u=>r({...a,id:u}));break;case"chartStat":{let u=re(e),c=e.config.elements.filter(h=>h.kind==="chart");s=c.length===0?p`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:p`
          ${B("Chart",a.layer,[["","(choose)"],...c.map(h=>[h.payload.id,$e(h,u)])],h=>r({...a,layer:h}))}
          ${B("Number",a.stat,[...dt],h=>r({...a,stat:h}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Unit to print the entity's unit after it."}</div>`;break}}let d=i.showResolved?e.resolve(t):void 0;return p`
    ${B("Source",a.kind,l,u=>r(Yl(a,u)))}
    ${s}
    ${i.noFormat?f:ed(t.format,u=>n(Se(u)?{kind:t.kind}:{...t,format:u}))}
    ${i.showResolved?p`<div class="hint">Now: ${d===void 0?p`<span class="warn">unresolved</span>`:p`<code>${d}</code>`}</div>`:f}`}function ed(e,t){let n=e??{},i=a=>{let r={...n,...a};for(let o of Object.keys(r))(r[o]===void 0||r[o]===!1||r[o]==="")&&delete r[o];t(r)};return p`<details class="sub" ?open=${!Se(e)}>
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
  </details>`}function td(e,t,n,i){let a=l=>l.join(", "),r=l=>l.split(",").map(s=>s.trim()).filter(Boolean),o=t.scope;return p`
    ${B("Function",t.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],l=>n({...t,function:l}))}
    ${B("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed entity list"]],l=>n({...t,scope:l==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?p`<div class="grid2">
          ${ne("Domains",a(o.domains),l=>n({...t,scope:{...o,domains:r(l)}}),{placeholder:"light, switch"})}
          ${ne("Area ids",a(o.areaIds),l=>n({...t,scope:{...o,areaIds:r(l)}}))}
          ${ne("Label ids",a(o.labelIds),l=>n({...t,scope:{...o,labelIds:r(l)}}))}
          ${ne("Floor ids",a(o.floorIds),l=>n({...t,scope:{...o,floorIds:r(l)}}))}
        </div>`:p`${o.entities.map((l,s)=>p`<div class="row-inline">
            ${De(e,`Entity ${s+1}`,l,d=>{let u=[...o.entities];u[s]=d,n({...t,scope:{...o,entities:u}})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>n({...t,scope:{...o,entities:o.entities.filter((d,u)=>u!==s)}})}>${N("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>n({...t,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${B("Only count when",t.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],l=>{let s={...t};l===""?delete s.stateFilter:l==="equals"||l==="notEquals"?s.stateFilter={kind:l,value:t.stateFilter&&"value"in t.stateFilter?t.stateFilter.value:""}:s.stateFilter={kind:l},n(s)})}
    ${t.stateFilter&&"value"in t.stateFilter?ne("State",t.stateFilter.value,l=>n({...t,stateFilter:{kind:t.stateFilter.kind,value:l}})):f}
    ${t.function==="count"?f:ne("Attribute (blank = state)",t.attribute??"",l=>{let s={...t};l?s.attribute=l:delete s.attribute,n(s)})}`}var $o=Qn,nd=$o.filter(([e])=>e!=="none");function id(e,t){return e!==void 0&&t.trim()!==""&&t.trim()!==e.trim()}function ko(e){let t=e.config,n=t.tapAction,i=s=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(s),a=id(e.savedName,t.name),r=t.refreshMinutes??0,o=io.map(s=>[String(s),ao(s)]);io.includes(r)||o.push([String(r),ao(r)]);let l=t.showSuccessFlash??!0;return p`
    <div class="gen-row">
      ${ne("Name",t.name,s=>e.update(d=>{d.name=s},"name"))}
      ${B("Refresh",String(r),o,s=>e.update(d=>{d.refreshMinutes=Number(s)||0},"refresh"))}
      ${B("Tap action",n.type,$o,s=>e.update(d=>{d.tapAction=i(s)?{type:s,..."entityId"in d.tapAction?{entityId:d.tapAction.entityId,displayName:d.tapAction.displayName,domain:d.tapAction.domain}:{entityId:"",displayName:"",domain:""}}:{type:s},s!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span>Flash when a tap works</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${l} title="Flash when a tap works"
            @change=${s=>e.update(d=>{d.showSuccessFlash=s.target.checked})} />
          ${l?p`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??ad).slice(0,7)}
                @input=${se(s=>e.update(d=>{d.successFlashColorHex=s.toUpperCase()},"flash"))} />`:p`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${a?p`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:f}
    ${"entityId"in n?De(e,"Target",n,s=>e.update(d=>{d.tapAction={type:n.type,...s}},"tap-entity"),"general-tap"):f}
    ${n.type==="openPage"?rd(e):f}`}var ad="#808080",io=[0,15,30,60,120];function ao(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function rd(e){let t=e.config;return Co(e,t.openPageId,t.openPageName,(n,i)=>e.update(a=>{if(n===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=n,i?a.openPageName=i:delete a.openPageName}))}function Co(e,t,n,i){let a=t??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${n||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?p`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`:p`${B("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(l=>l.id===o)?.name)})}
  ${a?f:p`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`}function So(e,t){let n=e.config.values.findIndex(a=>a.id===t.id),i=`nv-${t.id}`;return p`
    ${ne("Name",t.name,a=>e.update(r=>{r.values[n].name=a},`${i}-name`))}
    ${Q(e,t.value,a=>e.update(r=>{r.values[n].value=a},i),{allowNamed:!1,showResolved:!0,inline:!0,key:i})}
    <div class="hint">Used by ${ro(e.config,t.id)} layer${ro(e.config,t.id)===1?"":"s"}.</div>`}function ro(e,t){return JSON.stringify(e.elements).split(`"${t}"`).length-1+JSON.stringify(e.perFamily).split(`"${t}"`).length-1}function Eo(){return{id:q(),name:"Value",value:M("")}}function ye(e,t,n){let i=e.perFamily[t],a=i?.placements[n.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:n.payload.frame,isHidden:n.payload.isHidden,fromPlacement:!1}}function ge(e,t,n,i,a=!1){let r=e.elements.find(u=>u.payload.id===n);if(!r)return;let o=e.perFamily[t];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[t]=o);let l=ye(e,t,r),d={...o.placements[n]??{frame:{...l.frame},isHidden:l.isHidden,...l.size!==void 0?{size:l.size}:{}},...i};if(a&&delete d.size,Object.keys(o.placements).length===0)for(let u of e.elements)u.payload.id!==n&&(o.placements[u.payload.id]={frame:{...u.payload.frame},isHidden:u.payload.isHidden});o.placements[n]=d}function od(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"shape":return;case"image":return;case"tap":return}}function oo(e){return e.length===0?"none":e.every(t=>t)?"all":e.every(t=>!t)?"none":"mixed"}function sd(e){return e.kind==="image"||e.kind==="tap"?void 0:e.payload.colorSlot.baseColorHex}function To(e,t,n){let i=oo(n.map(d=>ye(e,t,d).isHidden)),a=oo(n.map(d=>d.payload.isHidden)),r=n.map(sd),o=n.length>0&&r.every(d=>d!==void 0),l=r[0],s=o&&l!==void 0&&r.every(d=>d!==void 0&&d.toUpperCase()===l.toUpperCase());return{hiddenHere:i,hiddenEverywhere:a,colourable:o,colour:s?l:void 0}}var Di=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]];function ld(e,t,n){let i=t.payload.id,a=sn(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=t.kind==="image"?{domain:"camera"}:{};return p`
    ${De(e,t.kind==="image"?"Camera":"Entity",r,l=>e.update(s=>er(s,i,l),`${n}-entity`),`${n}-layer-entity`,o)}
    <div class="hint">${ud(t,a)}</div>`}function dd(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function cd(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function ud(e,t){let n=dd(e),i=n?.kind.kind,r=n!==void 0&&!("entityId"in n.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"))?i==="named"?" Its content comes through a named value, so change that value in the Data card to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(t.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],l=t.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");l&&o.push(l.where==="symbol"?"the symbol":l.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":"the text"),t.some(d=>d.where==="tap")&&o.push("the tap");let s=t.filter(d=>d.where==="test").length;return s>0&&o.push(s===1?"1 state test":`${s} state tests`),`Used by ${cd(o)}.${r}`}function pd(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function hd(e,t){let n=e.timestamp===!0,i=Ie(e),a=r=>t(o=>{r?(o.timestampX=o.timestampCorner.endsWith("Leading")?.16:.84,o.timestampY=o.timestampCorner.startsWith("top")?.16:.84):(Ie(o)&&(o.timestampCorner=Xn(o.timestampX,o.timestampY)),delete o.timestampX,delete o.timestampY)});return p`
    ${me("Show timestamp",n,r=>t(o=>{r?o.timestamp=!0:delete o.timestamp}))}
    ${n?p`
      ${B("Placement",i?"free":"corner",[["corner","A corner"],["free","Anywhere"]],r=>a(r==="free"))}
      ${i?f:B("Corner",e.timestampCorner,[["topLeading","Top left"],["topTrailing","Top right"],["bottomLeading","Bottom left"],["bottomTrailing","Bottom right"]],r=>t(o=>{o.timestampCorner=r}))}
      ${j("Text size (pt)",e.timestampSize,r=>t(o=>{o.timestampSize=Math.min(40,Math.max(4,r??At))},"tssize"),{step:1,min:4,max:40})}
      <div class="hint">Click the chip in the preview to select it. Drag it to move it (it stays inside the picture), or drag a corner to change the text size.</div>
      <div class="hint">The time the snapshot was fetched, not the time now. A frame that stops updating keeps its old time.</div>`:f}`}function oe(e,t,n,i,a={}){let r=e.openSections.has(t),o=()=>e.toggleSection(t);return p`<section class="sec" data-open=${r?"true":"false"} style=${a.color?`--c:${a.color}`:""}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${r?"true":"false"} @click=${o}
      @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o())}}>
      <span class="swatch">${N(a.icon??"content")}</span>
      <span class="tt"><h4>${n}</h4>${a.summary?p`<span class="sum">${a.summary}</span>`:f}</span>
      <span class="chev">${N("chevron")}</span>
    </div>
    ${r?p`<div class="sec-b">${i}</div>`:f}
  </section>`}function md(e){if(e.length===0)return"nothing";let t=n=>Number.isInteger(n)?String(n):String(Math.round(n*100)/100);return e.length<=12?e.map(t).join(" "):`${e.slice(0,6).map(t).join(" ")} \u2026 ${e.slice(-3).map(t).join(" ")}`}function fd(e){return jn.find(t=>t.minutes===e)?.label??`Last ${e} min`}function gd(e,t){let n=re(e);switch(t.kind){case"text":return nt(le(t.payload.value,n),48);case"icon":return nt(le(t.payload.symbol,n),48);case"gauge":return nt(le(t.payload.value,n),48);case"chart":return nt(`${le(t.payload.value,n)}${t.payload.historyMinutes>0?` \xB7 ${fd(t.payload.historyMinutes)}`:""}`,48);case"shape":return t.payload.kind==="roundedRectangle"?"Rounded rectangle":t.payload.kind;case"image":return t.payload.entity.displayName||t.payload.entity.entityId||"No camera yet";case"tap":return Ae(t.payload.action)}}function so(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${e.payload.style} \xB7 ${e.payload.lineWidth} pt line \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}${e.payload.highlight==="none"?"":` \xB7 ${bo.find(([t])=>t===e.payload.highlight)?.[1].toLowerCase()??""} marked`}`;case"shape":return`${we(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return}}function Fo(e,t,n){let i=t.payload.id,a=e.config.elements.findIndex(m=>m.payload.id===i),r=`el-${i}`,o=(m,b)=>e.update(v=>m(v.elements[a]),b?`${r}-${b}`:void 0),l=ye(e.config,n,t),s=l.frame,d=(m,b)=>e.update(v=>ge(v,n,i,{frame:{...s,...m}}),`${r}-${b}-${n}`),u=t.kind==="text"?"Font size":t.kind==="icon"?"Icon size":"Line width",c,h;switch(t.kind){case"text":{let m=ei(e.config,t.payload.value);c=p`
        ${Q(e,t.payload.value,b=>o(v=>{v.payload.value=b},"value"),{showResolved:!0,label:"Text",key:`${r}-value`})}
        ${m?p`<div class="hint">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(m.payload.id)}>${$e(m,re(e))}</button>. It stays in the chart's group and moves with it.</div>`:f}
        ${me("Live countdown",t.payload.countdown===!0,b=>o(v=>{let C=v.payload;b?C.countdown=!0:delete C.countdown}))}
        ${t.payload.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,h=p`<div class="grid2">
          ${j("Font size (pt)",t.payload.fontSize,b=>o(v=>{v.payload.fontSize=b??14},"size"),{step:1,min:4})}
          ${B("Weight",t.payload.fontWeight,Di,b=>o(v=>{v.payload.fontWeight=b}))}
        </div>`;break}case"icon":c=p`
        ${Q(e,t.payload.symbol,m=>o(b=>{b.payload.symbol=m},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`})}
        <div class="hint">An entity source draws that entity's own icon instead.</div>`,h=j("Icon size (pt)",t.payload.size,m=>o(b=>{b.payload.size=m??14},"size"),{step:1,min:4});break;case"gauge":c=p`
        ${Q(e,t.payload.value,m=>o(b=>{b.payload.value=m},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        <div class="grid2">
          ${j("Min",t.payload.minValue,m=>o(b=>{b.payload.minValue=m??0},"min"))}
          ${j("Max",t.payload.maxValue,m=>o(b=>{b.payload.maxValue=m??100},"max"))}
        </div>`,h=p`
        <div class="grid2">
          ${B("Style",t.payload.style,[["arc","Arc (270\xB0)"],["ring","Ring"],["bar","Bar"]],m=>o(b=>{b.payload.style=m}))}
          ${j("Line width (pt)",t.payload.lineWidth,m=>o(b=>{b.payload.lineWidth=m??4},"lw"),{step:.5,min:.5})}
        </div>
        ${ae("Track colour",t.payload.trackColorHex,m=>o(b=>{b.payload.trackColorHex=m??"#FFFFFF40"},"track"))}`;break;case"chart":{let m=t.payload,b=(R,E)=>o(_=>R(_.payload),E),v=Je(m),C=m.historyMinutes>0,I=m.value.kind.kind==="entityState",O=v===void 0?void 0:e.historySeries(v),S=C?O??"":e.resolve(m.value)??"",A=_t(S),P=m.limit>0&&A.length>m.limit?m.takeFromEnd?A.slice(A.length-m.limit):A.slice(0,m.limit):A,G=!C&&I&&A.length===1;c=p`
        ${Q(e,m.value,R=>b(E=>{E.value=R},"value"),{label:"Readings",key:`${r}-value`})}
        ${B("Draw",C?"history":"value",[["value","The value itself"],["history","Its recorded history"]],R=>b(E=>{E.historyMinutes=R==="history"?E.historyMinutes||360:0}))}
        ${C?p`
            ${I?f:p`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              stays empty until Readings names an entity.</div>`}
            <div class="grid2">
              ${B("Span",String(m.historyMinutes),jn.map(({minutes:R,label:E})=>[String(R),E]),R=>b(E=>{E.historyMinutes=Number(R)||360}))}
              ${j("Readings",m.historyPoints,R=>b(E=>{E.historyPoints=Math.round(R??24)},"hpoints"),{step:1,min:qn,max:Yn})}
            </div>
            <div class="hint">Home Assistant averages the recorded states into this many equal
              time slots, oldest first. About 20 readings suits a rectangular complication; more
              than that draws bars thinner than the screen can show.</div>
            ${I&&O===void 0?p`<div class="hint">Reading the history…</div>`:f}
            ${I&&O===""?p`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:f}`:p`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        ${A.length===0&&!(C&&(!I||O===void 0||O===""))?p`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:f}
        ${A.length>0?p`<div class="hint">Reads ${md(P)}${A.length===P.length?p` · ${P.length} ${P.length===1?"value":"values"}`:p` · ${P.length} of ${A.length}`}</div>`:f}
        ${G?p`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Its recorded history</b> to plot how it has moved.</div>`:f}
        <div class="grid2">
          ${j("Use",m.limit,R=>b(E=>{E.limit=Math.max(0,Math.round(R??0))},"limit"),{step:1,min:0})}
          ${B("From",m.takeFromEnd?"end":"start",[["start","The first readings"],["end","The last readings"]],R=>b(E=>{E.takeFromEnd=R==="end"}))}
        </div>
        <div class="hint">${C?"Trims the series after it arrives, so 0 draws every reading fetched above.":"A forecast sensor often carries 24 or 48 entries. 0 draws all of them."}</div>`,h=p`
        ${B("Style",m.style,Dl,R=>b(E=>{E.style=R}))}
        <div class="grid2">
          ${B("Scale",m.scale,Bl,R=>b(E=>{E.scale=R}))}
          ${B("Baseline",m.baseline,Gl,R=>b(E=>{E.baseline=R}))}
        </div>
        ${m.scale==="fixed"?p`<div class="grid2">
              ${j("Min",m.minValue,R=>b(E=>{E.minValue=R??0},"cmin"))}
              ${j("Max",m.maxValue,R=>b(E=>{E.maxValue=R??100},"cmax"))}
            </div>`:f}
        <div class="hint">${m.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        ${m.style==="bars"?j("Bar gap (pt)",m.barGap,R=>b(E=>{E.barGap=Math.max(0,R??0)},"gap"),{step:.5,min:0}):j("Line width (pt)",m.lineWidth,R=>b(E=>{E.lineWidth=Math.max(.5,R??2)},"lw"),{step:.5,min:.5})}
        ${B("Colour",m.coloring,Kl,R=>b(E=>{E.coloring=R,R==="bands"&&E.bands.length===0&&(E.bands=Wl(P))}))}
        ${m.coloring==="bands"?p`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${m.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${m.bands.map((R,E)=>p`
            <div class="row-inline">
              ${j("Up to",R.upTo,_=>b(J=>{let X=J.bands[E];X&&(X.upTo=_??0)},`bup${R.id}`))}
              ${ae("Colour",R.colorHex,_=>b(J=>{let X=J.bands[E];X&&(X.colorHex=_??"#FFFFFF")},`bcol${R.id}`))}
              <button class="icon" title="Remove this band" aria-label="Remove this band"
                @click=${()=>b(_=>{_.bands=_.bands.filter((J,X)=>X!==E)})}>${N("close")}</button>
            </div>`)}
          <button class="small" @click=${()=>b(R=>{R.bands=[...R.bands,jl(R)]})}>Add band</button>
          ${ae("And the rest",m.bandAboveColorHex,R=>b(E=>{E.bandAboveColorHex=R??en},"babove"))}
          ${m.style==="area"?p`${me("Fill follows the bands",m.fillBands,R=>b(E=>{E.fillBands=R}))}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:f}`:f}
        ${B("Highlight",m.highlight,bo,R=>b(E=>{E.highlight=R}))}
        ${m.highlight==="none"?f:p`
          <div class="grid2">
            ${m.highlight==="lowest"?f:ae("Highest colour",m.highColorHex,R=>b(E=>{E.highColorHex=R??Zt},"hicol"))}
            ${m.highlight==="highest"?f:ae("Lowest colour",m.lowColorHex,R=>b(E=>{E.lowColorHex=R??Qt},"locol"))}
          </div>
          ${B("Marker",m.marker,Ul,R=>b(E=>{E.marker=R}))}
          <div class="hint">Worth keeping on: most watch faces tint a complication into one colour,
            which flattens the two colours into each other, and the marker shape is what survives that.</div>`}`;break}case"shape":c=p`<div class="grid2">
          ${B("Shape",t.payload.kind,[["roundedRectangle","Rounded rectangle"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"]],m=>o(b=>{b.payload.kind=m}))}
          ${t.payload.kind==="roundedRectangle"?j("Corner radius (pt)",t.payload.cornerRadius,m=>o(b=>{b.payload.cornerRadius=m??6},"radius"),{step:.5,min:0}):f}
        </div>`,h=p`
        ${ae("Border colour",t.payload.borderColorHex,m=>o(b=>{m===void 0?delete b.payload.borderColorHex:b.payload.borderColorHex=m},"border"),!0)}
        ${t.payload.borderColorHex!==void 0?j("Border width (pt)",t.payload.borderWidth,m=>o(b=>{b.payload.borderWidth=m??1},"bw"),{step:.5,min:0}):f}`;break;case"image":{let m=t.payload,b=(v,C)=>o(I=>v(I.payload),C);c=p`
        ${m.entity.entityId&&!m.entity.entityId.startsWith("camera.")?p`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>`:f}
        <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`,h=p`
        ${B("Picture",m.contentMode,[["fill","Fill the frame (crop)"],["fit","Fit the whole picture"]],v=>b(C=>{C.contentMode=v}))}
        ${_i("Zoom",m.zoom,v=>b(C=>{C.zoom=v},"zoom"),{min:Ci,max:4,step:.05,def:1,format:v=>`${v.toFixed(2)}x`})}
        ${_i("Pan left/right",m.panX,v=>b(C=>{C.panX=v},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${_i("Pan up/down",m.panY,v=>b(C=>{C.panY=v},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class="hint">${pd(m)}</div>
        ${j("Corner radius (pt)",m.cornerRadius,v=>b(C=>{C.cornerRadius=Math.max(0,v??It)},"imgradius"),{step:1,min:0})}`;break}case"tap":{c=p`
        ${Ro(e,t.payload,(m,b)=>o(v=>m(v.payload),b),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}}let g=t.kind==="image"||t.kind==="tap"?void 0:ae(t.kind==="shape"?"Fill colour":"Colour",t.payload.colorSlot.baseColorHex,m=>o(b=>{b.kind!=="image"&&b.kind!=="tap"&&(b.payload.colorSlot.baseColorHex=m??"#FFFFFF")},"color")),y=oi(e.config,t),w=y?{kind:{kind:"entityState",...y}}:void 0,x=te[t.kind],T=t.kind==="tap"?void 0:ve(e.config,i)[0],$=t.kind==="image"?t.payload.timestamp===!0:!1;return p`
    ${oe(e,"content","Content",p`${t.kind==="tap"?f:ld(e,t,r)}${c}`,{color:x,icon:"content",summary:gd(e,t)})}
    ${h===void 0&&g===void 0?f:oe(e,"look",t.kind==="image"?"Picture":"Look",p`${h??f}${g??f}`,{color:x,icon:t.kind==="image"?"image":"look",...so(t)?{summary:so(t)}:{}})}
    ${t.kind==="chart"?oe(e,"numbers","Numbers",xd(e,t),{color:te.text,icon:"text",summary:vd(e,t)}):f}
    ${t.kind==="image"?oe(e,"timestamp","Timestamp",hd(t.payload,(m,b)=>o(v=>m(v.payload),b)),{color:x,icon:"clock",summary:$?`Shown \xB7 ${t.payload.timestampSize} pt`:"Hidden"}):f}
    ${t.kind==="tap"?f:oe(e,"tappable","Tap",wd(e,t,r),{color:Y.tap,icon:"tap",summary:T?Ae(T.payload.action):"Not tappable"})}
    ${oe(e,"states","States",zo(e,t.payload.rules,t.kind,m=>m.elements.find(b=>b.payload.id===i)?.payload.rules,`rules-${i}`,w),{color:Y.states,icon:"states",summary:Ot(t.payload.rules).replace(/\.$/,"")})}
    ${oe(e,"placement","Place",p`
      <div class="grid4">
        ${j("X",s.x,m=>d({x:m??0},"x"),{step:.01})}
        ${j("Y",s.y,m=>d({y:m??0},"y"),{step:.01})}
        ${j("W",s.width,m=>d({width:m??.5},"w"),{step:.01,min:0})}
        ${j("H",s.height,m=>d({height:m??.5},"h"),{step:.01,min:0})}
      </div>
      ${j("Rotation (degrees)",s.rotationDegrees,m=>d({rotationDegrees:m??0},"rot"),{step:1})}
      ${t.kind==="shape"||t.kind==="image"||t.kind==="tap"?f:j(`${u} in ${U(n)} (blank = shared ${od(t)})`,l.size,m=>e.update(b=>m===void 0?ge(b,n,i,{},!0):ge(b,n,i,{size:m}),`${r}-psize-${n}`),{step:1,min:1,optional:!0})}
      ${me(`Hidden in ${U(n)}`,l.isHidden,m=>e.update(b=>ge(b,n,i,{isHidden:m})))}
      ${me("Hidden in every shape",t.payload.isHidden,m=>o(b=>{b.payload.isHidden=m}))}
      <div class="hint">Drag the layer on the ${U(n)} preview to move it, or pull a corner to resize it. Frames are fractions of the canvas.</div>`,{color:Y.place,icon:"place",summary:`${Math.round(s.width*100)}% wide \xB7 ${U(n)}${l.fromPlacement?"":" \xB7 shared frame"}`})}`}function Ro(e,t,n,i){let a=t.action,r=o=>["toggleEntity","runScene","runScript","addTodo","runHTTPAction"].includes(o);return p`
    ${B("Tap action",a.type,nd,o=>n(l=>{l.action=r(o)?{type:o,..."entityId"in l.action?{entityId:l.action.entityId,displayName:l.action.displayName,domain:l.action.domain}:{entityId:"",displayName:"",domain:""}}:{type:o},o!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${"entityId"in a?De(e,"Target",a,o=>n(l=>{l.action={type:a.type,...o}},"tap-entity"),`${i}-tap`):f}
    ${a.type==="openPage"?Co(e,t.openPageId,t.openPageName,(o,l)=>n(s=>{if(o===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=o,l?s.openPageName=l:delete s.openPageName},"tap-page")):f}`}var yd=24;function bd(e,t){let n=[],i=1/0;for(let r of ee){if(r==="inline"||!e.config.supportedFamilies.includes(r))continue;let o=Za(e.config,t,r);o&&(n.push(`${U(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(n.length===0)return f;let a=i<yd;return p`<div class=${a?"hint warn":"hint"}>${n.join(" \xB7 ")}${a?p`<br />That is small for a wrist. Show the tap area and drag its corners out.`:f}</div>`}function vd(e,t){let n=nn(e.config,t.payload.id);return n.length===0?"None yet":n.map(i=>{let a=i.payload.value.kind;return a.kind==="chartStat"?(dt.find(([r])=>r===a.stat)?.[1]??"number").toLowerCase():"number"}).join(" \xB7 ")}function xd(e,t){let n=re(e),i=nn(e.config,t.payload.id),a=o=>{let l;e.update(s=>{l=Ka(s,t.payload.id,o)}),l&&e.selectLayer(l)},r=new Set(i.map(o=>o.payload.value.kind.kind==="chartStat"?o.payload.value.kind.stat:""));return p`
    ${i.length===0?p`<div class="hint">A chart with no numbers on it shows that a reading moved, not what it moved to. Add one and it appears as a text layer in this chart's group: drag it anywhere, give it any size or colour, and it prints the live value.</div>`:p`
        <div class="chart-numbers">
          ${i.map(o=>p`
            <button class="small" title="Edit this number" @click=${()=>e.selectLayer(o.payload.id)}>
              <b>${e.resolve(o.payload.value)??"--"}</b> · ${$e(o,n)}
            </button>`)}
        </div>
        <div class="hint">Each number is a text layer in this chart's group. Click one to edit it; drag it on the preview to move it.</div>`}
    <div class="hint"><b>Add</b></div>
    <div class="adders">
      ${dt.map(([o,l])=>p`
        <button class="small" title=${r.has(o)?`Add another ${l.toLowerCase()}`:`Add the ${l.toLowerCase()}`}
          @click=${()=>a(o)}>${N("plus")}<span>${l}</span></button>`)}
    </div>
    <div class="hint">The newest reading starts with the entity's unit after it. The ends of the scale come from the plot's range, so on a Fixed scale they print the Min and Max above.</div>`}function wd(e,t,n){if(t.kind==="tap")return f;let i=t.payload.id,a=ve(e.config,i)[0],r=(l,s)=>e.update(d=>{let u=d.elements.find(c=>c.kind==="tap"&&c.payload.attachedTo===i);u&&l(u.payload)},s?`${n}-${s}`:void 0),o=si(e.config,t);return p`
    ${me("Tappable",a!==void 0,l=>e.update(s=>{l?on(s,i):di(s,i)}))}
    ${a?p`<div class="value-editor">
          ${Ro(e,a.payload,r,`${n}-attached`)}
          <div class="chips">
            <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
              title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
              @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide tap area":"Show tap area"}</button>
            ${tn(a.payload.outset)?f:p`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                  @click=${()=>r(l=>{l.outset={...Zn}})}>${N("reset")}</button>`}
          </div>
        </div>
        ${bd(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:p`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Ae(o)}</b>.</div>`}`}function lo(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function $e(e,t){switch(e.kind){case"text":return lo(le(e.payload.value,t));case"icon":return lo(le(e.payload.symbol,t));case"gauge":return le(e.payload.value,t);case"chart":return le(e.payload.value,t);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let n=e.payload.entity;return n.displayName||n.entityId||"camera"}case"tap":{let n=e.payload.action,i="entityId"in n?n.displayName||n.entityId:n.type==="openPage"&&e.payload.openPageName||"";return i?`${n.type} \xB7 ${i}`:n.type}}}function Io(e,t){let n=Oe(e.config,t.id),i=re(e),a=(r,o)=>e.update(l=>{let s=l.groups?.find(d=>d.id===t.id);s&&r(s)},o?`group-${t.id}-${o}`:void 0);return oe(e,"content","Group",p`
    ${ne("Name",t.name,r=>a(o=>{o.name=r},"name"))}
    ${me("Move as one on the watch",t.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${t.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. Lock it again when the part is the way you want it."}</div>
    <div class="hint">${n.length} layer${n.length===1?"":"s"}: ${n.map(r=>$e(r,i)).join(", ")}. Click one in the list to edit it.</div>
    <div class="adders">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>rn(r,t.id))}>Ungroup</button>
    </div>`,{color:Y.group,icon:"folder",summary:`${n.length} layers \xB7 ${t.locked?"moves as one":"unlocked"}`})}function Ao(e,t){if(t==="inline")return p`${$d(e)}${Pi(e,t)}`;let n=e.config.perFamily[t];if(!n)return p`<div class="hint">No settings stored for ${U(t)} yet.</div>
      <button class="small" @click=${()=>e.update(l=>{l.perFamily[t]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${U(t)} settings</button>
      ${Pi(e,t)}`;let i=(l,s)=>e.update(d=>l(d.perFamily[t]),s?`fam-${t}-${s}`:void 0),a=Object.keys(n.placements).length,r=n.backgroundColorHex?we(n.backgroundColorHex):"transparent",o=n.borderColorHex?`${n.borderWidth} pt ${we(n.borderColorHex)} border`:"no border";return p`
    ${oe(e,"look",`${U(t)} shape`,p`
      ${ae("Background (blank = transparent)",n.backgroundColorHex,l=>i(s=>{l===void 0?delete s.backgroundColorHex:s.backgroundColorHex=l},"bg"),!0)}
      ${ae("Border colour",n.borderColorHex,l=>i(s=>{l===void 0?delete s.borderColorHex:s.borderColorHex=l},"border"),!0)}
      ${j("Border width (pt)",n.borderWidth,l=>i(s=>{s.borderWidth=l??2},"bw"),{step:.5,min:0})}`,{color:Y.place,icon:"shape",summary:`${r} \xB7 ${o}`})}
    ${t==="corner"?oe(e,"corner","Corner content",kd(e,n,i),{color:Y.place,icon:"content",summary:n.curvedText?"Big curved text":"Layer canvas"}):f}
    ${oe(e,"states","Shape states",zo(e,n.rules,"layout",l=>l.perFamily[t]?.rules,`rules-${t}`),{color:Y.states,icon:"states",summary:Ot(n.rules).replace(/\.$/,"")})}
    ${oe(e,"placements","Placements",p`
      <div class="hint">${a===0?"Layers use their shared frames here.":`${a} layer${a===1?" has":"s have"} a ${U(t)} placement.`}</div>
      ${a>0?p`<button class="small" @click=${()=>i(l=>{l.placements={}})}>Reset placements to the shared frames</button>`:f}`,{color:Y.place,icon:"place",summary:a===0?"Shared frames":`${a} own placement${a===1?"":"s"}`})}
    ${Pi(e,t)}`}function Pi(e,t){let n=!mt(e.config,t),i=n?"A complication keeps at least one shape.":`Drop the ${U(t)} shape. The watch stops listing this complication for ${U(t)} slots.`;return oe(e,"shape","Remove this shape",p`
    <div class="adders">
      <button class="danger small" ?disabled=${n} title=${i} @click=${()=>e.removeFamily(t)}>Remove the ${U(t)} shape</button>
    </div>
    ${n?p`<div class="hint">This is the only shape. Add another before removing it.</div>`:p`<div class="hint">The watch stops listing this complication for ${U(t)} slots.</div>`}`,{color:Y.place,icon:"delete",summary:n?"The only shape":"Drops its layout"})}function $d(e){let t=e.config.inline;if(!t)return p`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let n=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=re(e);return p`
    ${oe(e,"content","Inline text",p`
      ${ne("Label (blank = value only)",t.label??"",a=>n(r=>{a?r.label=a:delete r.label},"label"))}
      ${Q(e,t.value,a=>n(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${me("Live countdown",t.countdown===!0,a=>n(r=>{a?r.countdown=!0:delete r.countdown}))}
      ${t.countdown?p`<div class="hint">Ticks down to the value's target: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>`:f}`,{color:te.text,icon:"text",summary:nt(`${t.label?`${t.label}: `:""}${le(t.value,i)}`,48)})}
    ${oe(e,"symbol","Symbol",p`
      ${yo(e,t.symbol??"",a=>n(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="hint">On the face: ${t.symbol?`${t.symbol} `:""}${t.label?`${t.label}: `:""}${e.resolve(t.value)??"--"}</div>`,{color:te.icon,icon:"icon",summary:t.symbol||"None"})}`}function kd(e,t,n){let i=t.curvedText?"curved":"canvas",a=t.bezelGauge?"gauge":t.bezelText?"text":"none";return p`
    ${B("Main content",i,[["canvas","Layer canvas (circle)"],["curved","Big curved text"]],r=>n(o=>{r==="curved"?o.curvedText||(o.curvedText=M("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&t.curvedText?p`
      ${Q(e,t.curvedText,r=>n(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${ae("Curved text colour",t.curvedColorHex??"#FFFFFF",r=>n(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:f}
    ${B("Bezel",a,[["none","None (biggest circle)"],["text","Text label"],["gauge","Gauge arc"]],r=>n(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=M("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:M("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&t.bezelText?p`
      ${Q(e,t.bezelText,r=>n(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${me("Live countdown",t.bezelCountdown===!0,r=>n(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:f}
    ${a==="gauge"&&t.bezelGauge?Cd(e,t.bezelGauge,n):f}`}function Cd(e,t,n){let i=[t.colorHexes[0]??"#34C759",t.colorHexes[1]??t.colorHexes[t.colorHexes.length-1]??"#FFCC00",t.colorHexes[t.colorHexes.length-1]??"#FF3B30"],a=r=>o=>n(l=>{let s=[...i];s[r]=o??s[r],l.bezelGauge.colorHexes=s},`gstop${r}`);return p`
    ${Q(e,t.value,r=>n(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${j("Gauge min",t.minValue,r=>n(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${j("Gauge max",t.maxValue,r=>n(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${ae("Arc colour (min end)",i[0],a(0))}
    ${ae("Arc colour (middle)",i[1],a(1))}
    ${ae("Arc colour (max end)",i[2],a(2))}
    ${me("End number labels",!!(t.minLabel||t.maxLabel),r=>n(o=>{let l=o.bezelGauge;r?(l.minLabel=M(String(l.minValue)),l.maxLabel=M(String(l.maxValue))):(delete l.minLabel,delete l.maxLabel)}))}
    ${t.minLabel?Q(e,t.minLabel,r=>n(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):f}
    ${t.maxLabel?Q(e,t.maxLabel,r=>n(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):f}`}var ep=ee.map(e=>[e,U(e)]),Bi={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},Sd=Object.keys(Bi);function Ed(e){let t=ln[e];return Sd.filter(n=>t.includes(he[n]))}var Td={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function Cn(e,t){if(e.entityId==="")return"(no entity)";let n=e.displayName.trim();if(n!==""&&n!==e.entityId)return n;let i=t?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function nt(e,t){let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function Fd(e){if(!e||Se(e))return"";let t=[];return e.decimals!==void 0&&t.push(`${e.decimals} dp`),e.multiply!==void 0&&t.push(`\xD7${e.multiply}`),e.offset!==void 0&&t.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&t.push(`"${e.prefix}" first`),e.suffix&&t.push(`"${e.suffix}" after`),e.useEntityUnit&&t.push("with unit"),e.relativeTime&&t.push("as relative time"),e.textCase&&t.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),t.length===0?"":` (${t.join(", ")})`}function le(e,t){return`${Mo(e,t)}${Fd(e.format)}`}function Mo(e,t){let n=e.kind;switch(n.kind){case"literal":return n.value?`"${nt(n.value,40)}"`:"(empty)";case"entityState":return Cn(n,t);case"entityAttribute":return n.attribute?`${Cn(n,t)} \xB7 ${n.attribute}`:Cn(n,t);case"entityAge":return`age of ${Cn(n,t)}`;case"aggregate":return Rd(n.aggregate);case"time":return Td[n.timeField];case"dataAge":return"data age";case"jinja":return n.value?`template ${nt(n.value,32)}`:"template (empty)";case"named":return n.id===""?"(no value chosen)":t?.values?.find(a=>a.id===n.id)?.name?.trim()||`named ${n.id.slice(0,8)}`;case"chartStat":{let i=(dt.find(([o])=>o===n.stat)?.[1]??n.stat).toLowerCase();if(n.layer==="")return`${i} (no chart chosen)`;let a=t?.elements?.find(o=>o.kind==="chart"&&o.payload.id===n.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Mo(a.payload.value,t):"a missing chart";return`${i} of ${r}`}}}function Rd(e){let t=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${t}`}function Tn(e,t,n){if(n<0||n>=e.length)return;let[i]=e.splice(t,1);e.splice(n,0,i)}function Id(e,t,n,i,a){let r=(o,l)=>e.update(s=>{let d=i(s);d&&o(d)},l?`${a}-${l}`:void 0);return p`
    ${t.length===0?p`<div class="hint">No rules yet. A rule checks values and changes how this ${n==="layout"?"family":"layer"} looks.</div>`:f}
    ${t.map((o,l)=>Ad(e,o,l,t.length,n,r,`${a}-${o.id}`))}
    <div class="adders"><button class="small" @click=${()=>r(o=>{o.push(Lt())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function Ad(e,t,n,i,a,r,o){let l=e.liveBranch(t),s=e.forced.get(t.id)??"live",d=c=>s==="live"?c==="live":s==="otherwise"?c==="otherwise":s.caseId===c,u=(c,h)=>r(g=>{let y=g.find(w=>w.id===t.id);y&&c(y)},h);return p`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${n+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(c=>Tn(c,n,n-1))}>${N("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i-1} @click=${()=>r(c=>Tn(c,n,n+1))}>${N("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(c=>{let h=c.findIndex(g=>g.id===t.id);h>=0&&c.splice(h,1)})}>${N("delete")}</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${d("live")?"active":""} @click=${()=>e.setForced(t.id,"live")}>Live</button>
      ${t.cases.map((c,h)=>p`<button class="${d(c.id)?"active":""} ${l===c.id?"live-match":""}" @click=${()=>e.setForced(t.id,{caseId:c.id})}>Case ${h+1}</button>`)}
      ${t.otherwise?p`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(t.id,"otherwise")}>Otherwise</button>`:f}
    </div>
    ${t.cases.map((c,h)=>Md(e,c,h,t,a,u,`${o}-${c.id}`))}
    <div class="adders"><button class="small" @click=${()=>u(c=>{c.cases.push(pi())})}>+ case</button></div>
    ${me("Otherwise (when no case matches)",t.otherwise!==void 0,c=>u(h=>{c?h.otherwise=h.otherwise??[]:delete h.otherwise}))}
    ${t.otherwise?p`<div class="case-box otherwise">
          <div class="hint">${l==="otherwise"?p`<b>Active now.</b> `:f}Changes when no case matches:</div>
          ${Ho(e,t.otherwise,a,c=>u(h=>{h.otherwise&&c(h.otherwise)}),`${o}-otherwise`)}
        </div>`:f}
  </div>`}function Md(e,t,n,i,a,r,o){let l=(d,u)=>r(c=>{let h=c.cases.find(g=>g.id===t.id);h&&d(h)},u),s=e.liveBranch(i)===t.id;return p`<div class="case-box ${s?"match":""}">
    <div class="rule-head">
      <span>Case ${n+1}${s?p` <span class="ok">· active now</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${n===0} @click=${()=>r(d=>Tn(d.cases,n,n-1))}>${N("up")}</button>
      <button class="icon" title="Move down" ?disabled=${n===i.cases.length-1} @click=${()=>r(d=>Tn(d.cases,n,n+1))}>${N("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let u=d.cases.findIndex(c=>c.id===t.id);u>=0&&d.cases.splice(u,1)})}>${N("delete")}</button>
    </div>
    <div class="row-inline">
      ${B("When",t.when.join,[["all","all of these are true"],["any","any of these is true"]],d=>l(u=>{u.when.join=d}))}
    </div>
    ${t.when.tests.length===0?p`<div class="hint">No tests: this case always matches.</div>`:f}
    ${t.when.tests.map((d,u)=>Hd(e,d,u,c=>l(h=>{let g=h.when.tests.find(y=>y.id===d.id);g&&c(g)}),()=>l(c=>{c.when.tests=c.when.tests.filter(h=>h.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders"><button class="small" @click=${()=>l(d=>{d.when.tests.push(ui())})}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${Ho(e,t.then,a,d=>l(u=>d(u.then)),`${o}-then`)}
  </div>`}function Hd(e,t,n,i,a,r){let o=(c,h)=>i(c,h?`${r}-${h}`:void 0),l=t.comparison,s=Ze(l.kind),d=e.evaluateTest(t),u=f;switch(s){case"value":u=Q(e,l.value??M(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":u=p`${Q(e,l.value??M(""),c=>o(h=>{h.comparison.value=c},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${Q(e,l.upper??M(""),c=>o(h=>{h.comparison.upper=c},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":u=p`${ne("Pattern",l.pattern??"",c=>o(h=>{h.comparison.pattern=c},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${l.pattern&&!Ld(l.pattern)?p`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:f}`;break;case"options":u=ne("Options (comma separated)",(l.options??[]).join(", "),c=>o(h=>{h.comparison.options=c.split(",").map(g=>g.trim()).filter(Boolean)},"options"));break;case"none":break}return p`<div class="test-box">
    <div class="rule-head">
      <span>Test ${n+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${N("delete")}</button>
    </div>
    ${l.kind==="isStale"?p`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:Q(e,t.value,c=>o(h=>{h.value=c},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${B("Comparison",l.kind,tr.map(c=>[c,gt[c]]),c=>o(h=>{h.comparison=hi(h.comparison,c)}))}
    ${u}
  </div>`}function Ld(e){try{return new RegExp(e),!0}catch{return!1}}function Ho(e,t,n,i,a){let r=Ed(n);return p`
    ${t.length===0?p`<div class="hint">No changes.</div>`:f}
    ${t.map((o,l)=>_d(e,o,l,n,(s,d)=>i(u=>{u[l]&&s(u[l])},d?`${a}-${l}-${d}`:void 0),()=>i(s=>{s.splice(l,1)}),`${a}-${l}`))}
    <select class="adder" @change=${o=>{let l=o.target,s=l.value;l.value="",s&&i(d=>{d.push(Qe(s))})}}>
      <option value="">+ change…</option>
      ${r.map(o=>p`<option value=${o}>${Bi[o]}</option>`)}
    </select>`}var Lo=["setColor","setBorderColor","setBackgroundColor"];function _d(e,t,n,i,a,r,o){let l=!ln[i].includes(he[t.kind]);return p`<div class="change-box">
    <div class="rule-head">
      <span>${Bi[t.kind]}${l?p` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:f}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${N("delete")}</button>
    </div>
    ${_o(e,t,a,o)}
  </div>`}function _o(e,t,n,i){let a=dn(t.kind),r=f;if(a==="value"){let o=t.value??M("");if(Lo.includes(t.kind)){let l=o.kind.kind==="literal";r=p`${l?ae("Colour",o.kind.kind==="literal"?o.kind.value:"",s=>n(d=>{d.value=M(s??"#FFFFFF")},"color")):Q(e,o,s=>n(d=>{d.value=s},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>n(s=>{s.value=l?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:M("#FFFFFF")})}>${l?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${l?f:p`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=Q(e,o,l=>n(s=>{s.value=l},"value"),{noFormat:t.kind==="setIcon",symbol:t.kind==="setIcon",showResolved:!0,label:t.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=t.kind==="setOpacity"?{step:.05,min:0,max:1}:t.kind==="setRotation"?{step:1}:{step:.5,min:0};r=j(t.kind==="setOpacity"?"Opacity (0 to 1)":t.kind==="setRotation"?"Degrees":t.kind==="setFontSize"?"Points":"Value",t.number??0,l=>n(s=>{s.number=l??0},"number"),o)}else a==="weight"&&(r=B("Weight",t.weight??"regular",Di,o=>n(l=>{l.weight=o})));return r}var Ni=new Set,Sn=new Map,En=new Map,co=new Map;function zo(e,t,n,i,a,r){let o=Ai(t);return!o.ok||Ni.has(a)?p`
      <div class="states-switch">
        <button class="link" ?disabled=${!o.ok} title=${o.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${s=>{Ni.delete(a),Te(s.target)}}>Show as table</button>
        ${o.ok?f:p`<span class="hint">${o.reason}</span>`}
      </div>
      ${Id(e,t,n,i,a)}`:zd(e,o.table,t[0],n,i,a,r)}function zd(e,t,n,i,a,r,o){let l=(S,A)=>e.update(P=>{let G=a(P);G&&S(G)},A?`${r}-${A}`:void 0),s=t.value??co.get(r)??o,d=t.rows.length===0,u=t.numberMode||d&&s!==void 0&&!qr(s)&&Pd(e.resolve(s)),c=ln[i],h=Sn.get(r)??new Set,g=t.columns.length===0&&h.size===0?[jr[i]]:[],y=Nr(t.columns,[...h,...g.filter(S=>S!==void 0)],c),w=n?e.liveBranch(n):"none",x=n?e.forced.get(n.id)??"live":"live",T=S=>x!=="live"&&(x==="otherwise"?S==="otherwise":x.caseId===S),$=S=>{n&&e.setForced(n.id,T(S)?"live":S==="otherwise"?"otherwise":{caseId:S})},m=S=>{co.set(r,S),t.rows.length!==0&&l(A=>Ur(A,S),"lhs")},b=()=>l(S=>Br(S,s??M(""),u)),v=t.rows.map((S,A)=>po(e,{key:`${r}-${S.caseId}`,label:Wr(S.comparison,P=>le(P,re(e))),columns:y,changes:S.changes,live:w===S.caseId,forced:T(S.caseId),onForce:()=>$(S.caseId),when:Bd(e,S.comparison,`${r}-${S.caseId}`,(P,G)=>l(R=>{let E=R[0]?.cases.find(_=>_.id===S.caseId)?.when.tests[0];E&&P(E.comparison)},G&&`${S.caseId}-${G}`)),updChanges:(P,G)=>l(R=>{let E=R[0]?.cases.find(_=>_.id===S.caseId);E&&P(E.then)},G&&`${S.caseId}-${G}`),acts:p`
      <button class="icon" title="Move up" ?disabled=${A===0} @click=${()=>l(P=>Mi(P,A,A-1))}>${N("up")}</button>
      <button class="icon" title="Move down" ?disabled=${A===t.rows.length-1} @click=${()=>l(P=>Mi(P,A,A+1))}>${N("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(P=>Gr(P,S.caseId))}>${N("delete")}</button>`})),C=t.otherwise===void 0?f:po(e,{key:`${r}-otherwise`,label:"Otherwise",columns:y,changes:t.otherwise,live:w==="otherwise",forced:T("otherwise"),onForce:()=>$("otherwise"),when:p`<span class="when-otherwise">Otherwise</span>`,updChanges:(S,A)=>l(P=>{let G=P[0]?.otherwise;G&&S(G)},A),acts:p`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(S=>Hi(S,!1))}>${N("close")}</button>`}),I=En.get(r),O=Nd.filter(S=>c.includes(S)&&!y.includes(S));return p`
    <div class="states">
      ${Q(e,s??M(""),m,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${s===void 0?p`<div class="hint">Choose what these states look at.</div>`:f}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${y.map(S=>p`<th>
              <span>${Le[S]}</span>
              <button class="icon" title=${`Remove the ${Le[S]} column`}
                @click=${A=>{En.set(r,S),Te(A.target)}}>${N("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${v}
          ${C}
          ${t.rows.length===0&&t.otherwise===void 0?p`<tr><td class="empty-row" colspan=${y.length+2}>No states yet. Add one to change how this ${i==="layout"?"shape":"layer"} looks when a value changes.</td></tr>`:f}
        </tbody>
      </table>
      ${I===void 0?f:p`<div class="hint warn confirm-row">
        Remove the ${Le[I]} column? Its ${uo(t,I)} value${uo(t,I)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${S=>{En.delete(r),Sn.get(r)?.delete(I),Te(S.target),l(A=>Kr(A,I))}}>Remove</button>
        <button class="small" @click=${S=>{En.delete(r),Te(S.target)}}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${b}>+ state</button>
        ${t.otherwise===void 0?p`<button class="small" title="What this layer looks like when no state above matches" @click=${()=>l(S=>Hi(S,!0))}>+ otherwise</button>`:f}
        <span class="spacer"></span>
        ${x==="live"?f:p`<button class="small" @click=${()=>n&&e.setForced(n.id,"live")}>Back to live</button>`}
        ${O.length===0?f:p`<select class="chip-add" title="Add a column" @change=${S=>{let A=S.target,P=A.value;if(A.value="",!P)return;let G=Sn.get(r)??new Set;G.add(P),Sn.set(r,G),Te(A)}}>
          <option value="" selected>+ column…</option>
          ${O.map(S=>p`<option value=${S}>${Le[S]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${S=>{Ni.add(r),Te(S.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function Pd(e){let t=(e??"").trim();return t!==""&&Number.isFinite(Number(t))}var Nd=["icon","text","color","visibility","opacity","fontSize","fontWeight","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function uo(e,t){let n=0;for(let i of e.rows)xn(i.changes,t)&&(n+=1);return e.otherwise&&xn(e.otherwise,t)&&(n+=1),n}function Od(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function po(e,t){return p`<tr class="state-row ${t.live?"live":""} ${t.forced?"forced":""}"
    title=${`${t.label}. Click to hold the previews on this state.`}
    @click=${n=>{Od(n)||t.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${t.forced?"The previews are held on this state":t.live?"This state matches right now":""}>${t.forced?"\u25C9":t.live?"\u25CF":""}</span>
      ${t.when}
    </td>
    ${t.columns.map(n=>p`<td>${Vd(e,n,t.changes,t.updChanges,`${t.key}-${n}`)}</td>`)}
    <td class="acts">${t.acts}</td>
  </tr>`}function Vd(e,t,n,i,a){let r=xn(n,t),o=Vi(a);if(!r)return p`<button type="button" class="cell empty" title=${`Set ${Le[t]} for this state`}
      @click=${d=>{i(u=>{u.push(Qe(Pr[t]))}),Zl(d.target,o)}}>unchanged</button>`;let l=(d,u)=>i(c=>{let h=c.find(g=>he[g.kind]===t);h&&d(h)},u&&`${t}-${u}`),s=Le[t];return p`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${s}. Click to change it.`}>${Dd(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${s} @toggle=${xo}>
      <div class="pop-head">
        <b>${s}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${Dt.has(o)?p`${t==="visibility"?B("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>l(u=>{u.kind=d})):_o(e,r,l,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(u=>{let c=u.findIndex(h=>he[h.kind]===t);c>=0&&u.splice(c,1)})}}>Leave ${s.toLowerCase()} unchanged</button>`:f}
    </div>`}function Dd(e,t){if(t.kind==="hide")return p`<span class="cell-word">Hidden</span>`;if(t.kind==="show")return p`<span class="cell-word">Shown</span>`;let n=dn(t.kind);if(n==="number")return p`<span class="cell-word mono">${t.number??0}</span>`;if(n==="weight")return p`<span class="cell-word">${Di.find(([r])=>r===(t.weight??"regular"))?.[1]}</span>`;let i=t.value??M(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Lo.includes(t.kind))return p`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?we(a):le(i,re(e))}</span>`;if(t.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return p`${r??f}<span class="cell-word">${a}</span>`}return p`<span class="cell-word">${le(i,re(e))}</span>`}function we(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function Bd(e,t,n,i){let a=Ze(t.kind),r=Ii(t.kind),o=(l,s,d,u)=>Ud(e,l,s,`${n}-${d}`,r,u,d==="rhs"?"Compare with":"Upper bound");return p`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${se(l=>i(s=>{let d=hi(s,l);s.kind=d.kind,d.value!==void 0?s.value=d.value:delete s.value,d.upper!==void 0?s.upper=d.upper:delete s.upper}))}>
      ${Ri.map(l=>p`<option value=${l} ?selected=${l===t.kind}>${Gd(l)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(t.value??M(""),l=>i(s=>{s.value=l},"rhs"),"rhs",r?"0":"value"):f}
    ${a==="between"?p`<span class="when-and">to</span>${o(t.upper??M(""),l=>i(s=>{s.upper=l},"upper"),"upper","100")}`:f}
  </span>`}function Gd(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return gt[e]}}function Ud(e,t,n,i,a,r,o){let l=Vi(i),s={showResolved:!0,label:o,key:i};if(t.kind.kind!=="literal")return p`<span class="rhs">
      ${Q(e,t,n,{...s,compact:!0})}
    </span>`;let d=t.kind.value;return p`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${se(u=>n({...t,kind:{kind:"literal",value:u}}))} />
    <button type="button" class="icon more" popovertarget=${l} title="Compare with an entity or a template instead">…</button>
    ${vo(e,l,o,t,n,s)}
  </span>`}var Rn=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:ri,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function Vo(e){return Rn.find(t=>t.kind===e)??Rn[0]}var Po="#FF9F0A",Gi="#8E8E93",Kd=["#FF453A","#FFD60A","#34C759"],Do=["#0A84FF","#34C759","#FF9F0A"];function Wd(e){return e?.attributes?.device_class==="battery"?Kd:Do}var jd={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function qd(e){let t=e.iconName?.trim();return t?{off:t,on:t}:jd[Ui(e)]??{off:"circle",on:"circle.fill"}}function Yd(e){switch(Ui(e)){case"lock":return{kind:"equals",value:M("locked")};case"cover":case"valve":return{kind:"equals",value:M("open")};case"media_player":return{kind:"equals",value:M("playing")};default:return{kind:"isOn"}}}function Ui(e){return e.domain||e.entityId.split(".")[0]||""}function at(e){return{...e,domain:Ui(e)}}function Jd(e){let t=e?.attributes??{},n=t.min,i=t.max;if(typeof n=="number"&&typeof i=="number"&&i>n)return{min:n,max:i};let a=typeof t.device_class=="string"?t.device_class:"",r=typeof t.unit_of_measurement=="string"?t.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Fn(e){return Math.round(e*1e4)/1e4}function In(e,t,n){return Math.min(n,Math.max(t,e))}function Ki(e,t,n){let i=de[e],a=In(Fn(t/i.width),0,1),r=In(Fn(n/i.height),0,1);return{x:Fn((1-a)/2),y:Fn((1-r)/2),width:a,height:r,rotationDegrees:0}}function Xd(e){let t=de[e],n=In(Math.round(Math.min(t.width,t.height)*.55),12,30);return{frame:Ki(e,n*1.3,n*1.3),size:n}}function Zd(e){let t=de[e],n=In(Math.round(Math.min(t.width,t.height)*.3),9,20);return{frame:Ki(e,t.width*.88,n*1.7),size:n}}function Qd(e){let t=de[e],n=Math.min(t.width,t.height)*.9;return{frame:Ki(e,n,n),size:Math.max(2.5,Math.round(n*.2)/2)}}function Bo(e){let t=e==="rectangular";return{frame:{x:.05,y:t?.34:.3,width:.9,height:t?.42:.4,rotationDegrees:0},size:2}}function ec(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function tc(e,t){t!==void 0&&(e.kind==="text"?e.payload.fontSize=t:e.kind==="icon"?e.payload.size=t:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=t))}function vt(e,t,n,i){let a=i(n);t.payload.frame=a.frame,tc(t,a.size);for(let r of ee){if(r===n||r==="inline")continue;let o=e.perFamily[r];if(!o)continue;let l=i(r);JSON.stringify(l)!==JSON.stringify(a)&&(o.placements[t.payload.id]={frame:l.frame,isHidden:!1,...l.size!==void 0?{size:l.size}:{}})}}function xt(e){return Pe(e)}function Wi(e,t){let n={kind:{kind:"entityState",...at(e)}},i=t?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(n.format={useEntityUnit:!0}),n}function No(e){let t=Qe("setIcon");return t.value=M(e),t}function it(e){let t=Qe("setColor");return t.value=M(e),t}function nc(e,t){let n=Lt(),i=n.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...at(e)}},a.comparison=Yd(e);let r=t.on!==t.off;return i.then=r?[No(t.on),it(Po)]:[it(Po)],n.otherwise=r?[No(t.off),it(Gi)]:[it(Gi)],n}function ic(e){let t=Lt(),n=t.cases[0],i=n.when.tests[0];i.value={kind:{kind:"entityState",...at(e)}},i.comparison={kind:"isUnavailable"};let a=Qe("setOpacity");return a.number=.35,n.then=[a],t}function Oo(e){let t=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(t)}function ac(e,t,n=Do){let i=t.max-t.min,a=Oo(t.min+i/3),r=Oo(t.min+i*2/3),o=[{comparison:{kind:"lessThan",value:M(a)},changes:[it(n[0])]},{comparison:{kind:"between",value:M(a),upper:M(r)},changes:[it(n[1])]},{comparison:{kind:"greaterThan",value:M(r)},changes:[it(n[2])]}];return Or(Wi(e),o)}function rc(e,t,n){let i=xt("icon"),a=qd(t);return i.payload.symbol=M(a.off),i.payload.colorSlot.baseColorHex=Gi,i.payload.rules=[nc(t,a)],vt(e,i,n.family,Xd),e.elements.push(i),on(e,i.payload.id,{type:"toggleEntity",...at(t)}),i.payload.id}function oc(e,t,n){let i=xt("text");return i.payload.value=Wi(t,n.state),i.payload.rules=[ic(t)],vt(e,i,n.family,Zd),e.elements.push(i),i.payload.id}function sc(e,t,n){let i=xt("gauge");i.payload.value=Wi(t);let a=Jd(n.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[ac(t,a,Wd(n.state))],vt(e,i,n.family,Qd),e.elements.push(i),i.payload.id}function lc(e,t,n){let i=xt("chart");return i.payload.value={kind:{kind:"entityState",...at(t)}},i.payload.highlight="both",i.payload.marker="pointer",vt(e,i,n.family,Bo),e.elements.push(i),i.payload.id}function dc(e,t,n){let i=xt("chart");return i.payload.value={kind:{kind:"entityState",...at(t)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",vt(e,i,n.family,Bo),e.elements.push(i),i.payload.id}function cc(e,t,n){let i=xt("image");return i.payload.entity=at(t),vt(e,i,n.family,ec),e.elements.push(i),i.payload.id}function Go(e,t,n,i){switch(t){case"toggle":return rc(e,n,i);case"status":return oc(e,n,i);case"gauge":return sc(e,n,i);case"chart":return lc(e,n,i);case"history":return dc(e,n,i);case"camera":return cc(e,n,i)}}var pc=3e4,hc=500,Uo="preset-entity",mc={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function ji(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function fc(e){return e.kind==="family"?"look":"content"}function gc(e){let t=e.document?.supportedFamilies;return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}var Ko=300,Wo=400,qi=52,jo=36,rt=200,yc=720,An=320,bc=80,vc=56,qo="wrist-assistant-panel.columns.v2",Yi=e=>Math.max(rt,Math.min(yc,Math.round(e))),Yo=e=>e.metaKey||e.ctrlKey||e.shiftKey,Jo=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl";function Xo(e,t,n){if(e<=0)return{columns:3,left:t,right:n};let i=e-bc;if(i>=rt*2+An){let r=i-An,o=t,l=n;if(o+l>r){let s=r/(o+l);o=Math.max(rt,Math.floor(o*s)),l=Math.max(rt,Math.floor(l*s));let d=o+l-r;d>0&&(o>=l?o=Math.max(rt,o-d):l=Math.max(rt,l-d))}return{columns:3,left:o,right:l}}let a=e-vc;return a>=rt+An?{columns:2,left:Math.min(t,a-An),right:n}:{columns:1,left:t,right:n}}var H=class extends ze{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Ko;this.colRight=Wo;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=6;this.presets=[];this.occupied=[];this.serverToken=0;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.pickerOpen=!1;this.testValues=new Map;this.multi=new Set;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.showTaps=!1;this.newShapeChooser=!1;this.previewCase=Pt.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=Ar(()=>this.requestUpdate());this.imageSizes=Mr(()=>this.requestUpdate());this.symbols=new yn(()=>this.requestUpdate());this.keyHandler=n=>this.onKey(n);this.heldArrows=new Set;this.keyUpHandler=n=>{this.heldArrows.delete(n.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.sizeObserver=new ResizeObserver(n=>{let i=n[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=n=>{this.draft?.dirty&&n.preventDefault()};this.pickerOutside=n=>{n.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.presetKeys={handleEvent:n=>{n.key==="Enter"&&(this.presetEntity===void 0||go(Uo)||(n.preventDefault(),n.stopPropagation(),this.createFromPreset()))},capture:!0}}static{this.styles=Hn`
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
      --wa-text: ${ce(te.text)};
      --wa-icon: ${ce(te.icon)};
      --wa-gauge: ${ce(te.gauge)};
      --wa-shape: ${ce(te.shape)};
      --wa-image: ${ce(te.image)};
      --wa-tap: ${ce(te.tap)};
      --wa-states: ${ce(Y.states)};
      --wa-place: ${ce(Y.place)};
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
      display: grid; grid-template-columns: 16px 4px ${qi}px minmax(0, 1fr) auto; align-items: center; gap: 8px;
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
      width: ${qi}px; height: ${jo}px; border-radius: 8px; overflow: hidden; flex: none;
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
    .layer .lockbtn.on { opacity: 1; color: ${ce(Y.locked)}; filter: drop-shadow(0 0 4px ${ce(Y.locked)}); }
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
  `}connectedCallback(){super.connectedCallback(),this.loadColumnWidths(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("beforeunload",this.beforeUnload),this.loadOwners()}loadColumnWidths(){try{let n=window.localStorage.getItem(qo);if(!n)return;let i=JSON.parse(n);typeof i.left=="number"&&(this.colLeft=Yi(i.left)),typeof i.right=="number"&&(this.colRight=Yi(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(qo,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}renderGutter(n){return p`<div class="gutter ${n}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(n,i)}
      @dblclick=${()=>{n==="left"?this.colLeft=Ko:this.colRight=Wo,this.saveColumnWidths()}}></div>`}beginColumnDrag(n,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Xo(this.panelWidth,this.colLeft,this.colRight),l=n==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let s=c=>{if(c.pointerId!==i.pointerId)return;let h=c.clientX-r,g=Yi(n==="left"?l+h:l-h);n==="left"?this.colLeft=g:this.colRight=g},d=c=>{c.pointerId===i.pointerId&&(u(),this.saveColumnWidths())},u=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",s),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("beforeunload",this.beforeUnload),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.cancelGesture?.()}syncCountdownTicker(n){let i=[n.rectangular,n.circular,n.corner].filter(r=>r!==void 0),a=n.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(n){if(n.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(n.has("inspect")){let i=n.get("inspect");(i===void 0||ji(i)!==ji(this.inspect))&&(this.openSections=new Set(Oi))}}updated(n){let i=ji(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(n.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),n.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(n.has("hass")&&this.draft){let a={};for(let l of this.compiled?.entities.keys()??[])a[l]=this.hass.states[l]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(n){if(n.key==="Escape"&&this.picking){n.preventDefault(),this.togglePicking(!1);return}n.key==="Escape"&&(this.timestampActiveId=void 0);let i=n.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=mc[n.key];if(r&&!a&&!n.metaKey&&!n.ctrlKey&&!n.altKey){this.nudge(r.dx,r.dy,n.shiftKey)&&(n.preventDefault(),this.heldArrows.add(n.key));return}(n.metaKey||n.ctrlKey)&&(n.key==="s"?(n.preventDefault(),this.save()):n.key==="z"&&!a?(n.preventDefault(),n.shiftKey?this.redo():this.undo()):n.key==="y"&&!a&&(n.preventDefault(),this.redo()))}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let n=await ha(this.hass);if(this.owners=n.owners,this.maxSchemaVersion=n.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(n){this.loadError=`Could not load devices: ${Be(n)}`}}async selectOwner(n){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=n,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0;let i=gr(this.owners.find(a=>a.owner_watch_id===n)?.screen_size);i&&(this.previewCase=i.label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await va(this.hass,n,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let n=await ma(this.hass,this.ownerId);this.records=n.records,this.maxSchemaVersion=n.max_schema_version,this.presets=n.presets??[],this.occupied=n.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=n.pages??[],this.serverToken=n.token,this.appliedToken=n.applied_token,this.polling=n.polling??!1,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(n){this.loadError=`Could not load complications: ${Be(n)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(n){n.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(n))}openRecord(n){this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=et.fromDocument(n.document,n.revision),this.savedName=String(n.document?.name??"");let i=Number(n.document?.schemaVersion??0),a=ja(n.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Be(i)}this.scheduleTemplates(0)}startNew(n){this.draft?.dirty&&!this.confirmDiscard()||(this.selectedId=n.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new et(n,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0))}freeSlot(){return Ia(this.records.map(n=>Number(n.document?.slotIndex??-1)),this.occupied)}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let n=await fa(this.hass,this.ownerId);this.polling=n.polling,this.serverToken=n.token,this.appliedToken=n.applied_token,n.applied_token!==n.token&&this.beginSendWait()}catch(n){this.saveError=Be(n)}}renderSendButton(){let n=nr({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending});if(n.kind==="unsupported")return f;let i=ir(n),a=i.resend&&this.hass.user?.is_admin?p`<button class="link" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:f;return p`<span class="send ${n.kind}" title=${i.title}>${n.kind==="sent"?"\u2713 ":""}${i.label}${a}</span>`}get slotChosen(){let n=this.draft?.config.slotIndex??-1;return n>=0&&n<Kn}mutate(n,i){!this.draft||!this.canEdit||(this.draft.update(n,i),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=gi(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let n=Pa(this.draft.config);(this.compiled?.document!==this.compiledDocument||n!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=n,this.scheduleTemplates(hc))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let n=new Me(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>n.resolve(i),historySeries:i=>this.historySeries.get(i),evaluateTest:i=>n.evaluateTest(i),liveBranch:i=>n.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),removeFamily:i=>this.removeShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}}}}toggleSection(n){let i=new Set(this.openSections);i.has(n)?i.delete(n):(i.size<=1&&i.clear(),i.add(n)),this.openSections=i}get watchSupported(){let n=this.selectedOwner;return n?n.is_orphan||Fr(n.app_version):!0}get canvasFamily(){if(Nt(this.activeFamily))return this.activeFamily;let n=this.draft?.config;return(n&&$r(n))??"rectangular"}ensureActiveFamily(){let n=this.draft?.config;!n||n.supportedFamilies.includes(this.activeFamily)||(this.activeFamily=wr(n)[0]??"rectangular")}addShape(n){this.mutate(i=>kr(i,n)),this.activeFamily=n,this.inspect={kind:"family"}}removeShape(n){let i=this.draft?.config;if(!i||!mt(i,n))return;let a=Sr(i,n);a.length>0&&!window.confirm(`Remove the ${U(n)} layout? This drops ${a.join(", ")}.`)||(this.mutate(r=>Cr(r,n)),this.ensureActiveFamily())}createNew(n){this.newShapeChooser=!1,this.startNew(qa("New complication",this.freeSlot(),[n]))}setForced(n,i){let a=new Map(this.forced);i==="live"?a.delete(n):a.set(n,i),this.forced=a}async save(n=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!n&&!this.draft.dirty)){if(!n&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(n){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=q(),l.slotIndex=o,i=new et(l,null)}let a=i.encoded(),r=await ga(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=et.fromDocument(r.record.document,r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Be(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}this.saving=!0;try{let n=await ya(this.hass,this.ownerId,this.selectedId,this.draft.baseRevision);if(!n.ok){n.error==="conflict"?this.conflict={current:n.current??null,message:n.message??"This complication changed on the server."}:this.saveError=n.message??n.error??"Delete failed";return}this.clearDraft(),this.selectedId=void 0,await this.loadRecords()}catch(n){this.saveError=Be(n)}finally{this.saving=!1,this.confirmDelete=!1}}}duplicate(){if(!this.draft)return;let n=structuredClone(this.draft.config);n.id=q(),n.name=`${n.name} copy`,n.slotIndex=this.freeSlot(),this.startNew(n)}reloadFromServer(){let n=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,n&&!n.deleted?this.openRecord(n):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(n=>n.owner_watch_id===this.ownerId)}async moveAll(){let n=this.ownerId,i=this.moveTarget;if(!(!n||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await ba(this.hass,n,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Be(a)}finally{this.moving=!1}}}scheduleTemplates(n){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},n),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},pc)}async refreshHistorySeries(){let n=this.draft?.config,i=n?Jn(n):[];if(i.length===0){this.historySeries.size>0&&(this.historySeries=new Map);return}let a={};for(let r of i)a[r.key]={entity_id:r.entityId,minutes:r.minutes,points:r.points};try{let r=await wa(this.hass,a),o=new Map;for(let[l,s]of Object.entries(r))s.ok&&o.set(l,s.series);this.historySeries=o}catch{}}async refreshTemplates(){this.refreshHistorySeries();let n=this.compiled?.document;if(!n){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await xa(this.hass,{doc:n})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=sr(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Be(i)}}buildContext(){let n=new Map;for(let i of this.compiled?.entities.keys()??[]){let a=this.hass.states[i];if(!a)continue;let r=a.attributes,o=i.split(".")[0]??"",l={entityId:i,state:this.testValues.get(i)??a.state,unitOfMeasurement:typeof r.unit_of_measurement=="string"?r.unit_of_measurement:void 0,iconName:this.compiled?.entities.get(i)?.iconName??"",domain:o};if(o==="timer"){l.timerState=a.state,typeof r.finishes_at=="string"&&(l.finishesAt=r.finishes_at);let s=xc(r.remaining);s!==void 0&&(l.remaining=s)}o==="camera"&&typeof r.entity_picture=="string"&&(l.entityPicture=r.entity_picture),n.set(i,l)}return{entityStates:n,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:this.draft?.config.values??[],dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3}}renderPickButton(){let n=this.picking,i=!this.draft||this.parseError!==void 0;return p`<button class="pick ${n?"on":""}" ?disabled=${i}
      aria-pressed=${n?"true":"false"}
      title=${n?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span>${n?"Picking\u2026":"Pick layer"}</button>`}renderShowTapsButton(){let n=this.showTaps;return p`<button class="pick ${n?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${n?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`}renderZoomButton(){let n=!this.draft||this.parseError!==void 0||this.activeFamily==="inline";return p`<button class="pick" ?disabled=${n}
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}><span class="glyph">⤢</span>Expand</button>`}renderZoomDialog(n,i,a){let r=this.draft?.config;if(!r)return f;let o=a.slots[n],l=n==="corner"?104/124:o.width/o.height;return p`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
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
    </dialog>`}setShowTaps(n){this.showTaps=n,n&&this.togglePicking(!1)}togglePicking(n=!this.picking){this.picking=n,this.pickHoverId=void 0,n&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(n){let i=this.draft?.config;if(!i)return;let r=n.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?li(i,r):void 0}leaveRow(n){this.listHoverIds.length===n.length&&this.listHoverIds.every((a,r)=>n[r]===a)&&(this.listHoverIds=[])}onPickMove(n){this.picking&&(this.pickHoverId=this.hitLayerId(n))}pickAt(n,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(n!==this.activeFamily&&(this.activeFamily=n),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(n,i){if(this.picking){i.preventDefault(),this.pickAt(n,i);return}let a=i.target,r=a.closest("[data-handle]")?.getAttribute("data-handle"),o=a.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,l=a.closest("svg"),s=a.closest("[data-ts-corner]")?.getAttribute("data-ts-corner")??null,d=s!==null||a.closest("[data-ts-handle]")!==null;if(d||(this.timestampActiveId=void 0),this.showTaps){let x=this.focusTapId();if(x!==void 0&&o===x&&l&&this.draft&&this.canEdit){if(n!==this.activeFamily){this.activeFamily=n;return}i.preventDefault(),this.beginTapBoxGesture(n,i,l,x,r??void 0);return}let T=this.hitLayerId(i);T?this.inspect={kind:"layer",id:T}:o===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(n!==this.activeFamily){this.activeFamily=n;return}let u=Yo(i);if(!u&&this.multi.size>0&&(this.multi=new Set),!o||!l)return;let c=li(this.draft.config,o),h=this.draft.config.elements.find(x=>x.payload.id===c);if(!c||!h)return;if(u){i.preventDefault(),this.togglePick(c);return}let g=Ne(this.draft.config,c);if(g?.locked&&!r&&!d){this.beginGroupGesture(n,i,l,g);return}if((this.inspect.kind!=="layer"||this.inspect.id!==c)&&(this.inspect={kind:"layer",id:c},r))return;i.preventDefault();let y=ye(this.draft.config,n,h).frame,w=this.gestureCanvas(n);if(d&&h.kind==="image"&&h.payload.timestamp===!0){this.timestampActiveId=c;let x=h.payload,T=fe[n],$=y.width*T.width,m=y.height*T.height,b={x:0,y:0,w:$,h:m,cx:$/2,cy:m/2},v=mn(x,b,hn(new Date));if(this.cancelGesture?.(),s){let S=w.width/T.width,A=x.timestampSize;this.cancelGesture=Qr(l,i,s,{w:v.w*S,h:v.h*S},(P,G)=>{let R=Math.min(40,Math.max(4,Math.round(A*P)));this.mutate(E=>{let _=E.elements.find(J=>J.payload.id===c);_?.kind==="image"&&(_.payload.timestampSize=R)},`ts-size-${c}`),G&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let C={x:0,y:0,w:y.width*w.width,h:y.height*w.height},I=Ie(x)?{x:x.timestampX,y:x.timestampY}:{x:(v.x+v.w/2)/b.w,y:(v.y+v.h/2)/b.h},O=!1;this.cancelGesture=Zr(l,C,i,I,(S,A,P)=>{P||(O=!0),O&&this.mutate(G=>{let R=G.elements.find(E=>E.payload.id===c);R?.kind==="image"&&(R.payload.timestampX=S,R.payload.timestampY=A)},`ts-${c}`),P&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}this.cancelGesture?.(),this.cancelGesture=$n(l,w,i,{elementId:c,frame:y,handle:r??void 0},{onFrame:(x,T,$)=>{this.mutate(m=>ge(m,n,x,{frame:T}),`drag-${x}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(n,i,a,r){let o=this.draft?.config;if(!o)return;let l=Oe(o,r.id);if(l.length===0)return;(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let s=new Map(l.map(x=>[x.payload.id,ye(o,n,x).frame])),d=[...s.values()],u=Math.min(...d.map(x=>x.x)),c=Math.min(...d.map(x=>x.y)),h=Math.max(...d.map(x=>x.x+x.width)),g=Math.max(...d.map(x=>x.y+x.height)),y={x:u,y:c,width:h-u,height:g-c,rotationDegrees:0},w=x=>Math.round(x*1e3)/1e3;this.cancelGesture?.(),this.cancelGesture=$n(a,this.gestureCanvas(n),i,{elementId:r.id,frame:y},{onFrame:(x,T,$)=>{let m=T.x-y.x,b=T.y-y.y;this.mutate(v=>{for(let[C,I]of s)ge(v,n,C,{frame:{...I,x:w(I.x+m),y:w(I.y+b)}})},`drag-group-${r.id}-${n}`),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}nudge(n,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Jr:1,l=n*o,s=i*o,d=this.canvasFamily,u=fe[d];if(this.timestampActiveId!==void 0&&this.nudgeTimestamp(this.timestampActiveId,d,l,s))return!0;if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,u,`nudge-multi-${d}`,l,s);if(this.inspect.kind==="group"){let x=this.inspect.id;return this.nudgeMany(Oe(r,x).map(T=>T.payload.id),d,u,`nudge-group-${x}-${d}`,l,s)}if(this.inspect.kind!=="layer")return!1;let c=this.inspect.id,h=r.elements.find(x=>x.payload.id===c);if(!h)return!1;let g=Ne(r,c);if(g?.locked)return this.nudgeMany(Oe(r,g.id).map(x=>x.payload.id),d,u,`nudge-group-${g.id}-${d}`,l,s);let y=ye(r,d,h).frame,w=Li(y,l,s,u);return(w.x!==y.x||w.y!==y.y)&&this.mutate(x=>ge(x,d,c,{frame:w}),`nudge-${c}-${d}`),!0}nudgeMany(n,i,a,r,o,l){let s=this.draft?.config;if(!s)return!1;let d=b=>Math.round(b*1e3)/1e3,u=new Map;for(let b of n){let v=s.elements.find(C=>C.payload.id===b);v&&u.set(b,ye(s,i,v).frame)}if(u.size===0)return!1;let c=[...u.values()],h=Math.min(...c.map(b=>b.x)),g=Math.min(...c.map(b=>b.y)),y=Math.max(...c.map(b=>b.x+b.width)),w=Math.max(...c.map(b=>b.y+b.height)),x={x:h,y:g,width:y-h,height:w-g,rotationDegrees:0},T=Li(x,o,l,a),$=T.x-x.x,m=T.y-x.y;return($!==0||m!==0)&&this.mutate(b=>{for(let[v,C]of u)ge(b,i,v,{frame:{...C,x:d(C.x+$),y:d(C.y+m)}})},r),!0}nudgeTimestamp(n,i,a,r){let o=this.draft?.config,l=o?.elements.find(x=>x.payload.id===n);if(!o||l?.kind!=="image"||l.payload.timestamp!==!0)return!1;let s=l.payload,d=fe[i],u=ye(o,i,l).frame,c=u.width*d.width,h=u.height*d.height,g=mn(s,{x:0,y:0,w:c,h,cx:c/2,cy:h/2},hn(new Date)),y=Ie(s)?{x:s.timestampX,y:s.timestampY}:{x:c>0?(g.x+g.w/2)/c:.5,y:h>0?(g.y+g.h/2)/h:.5},w=Xr(y,a,r,{w:c,h});return(w.x!==y.x||w.y!==y.y)&&this.mutate(x=>{let T=x.elements.find($=>$.payload.id===n);T?.kind==="image"&&(T.payload.timestampX=w.x,T.payload.timestampY=w.y)},`nudge-ts-${n}`),!0}gestureCanvas(n){let i=pn(this.previewSlot(n),n);if(n!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=Si(i.scale,r);return{width:o,height:o}}focusTapId(){let n=this.draft?.config;if(!n||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=n.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:ve(n,i)[0]?.payload.id}beginTapBoxGesture(n,i,a,r,o){let l=this.draft?.config,s=l?.elements.find(c=>c.payload.id===r);if(!l||!s)return;let d=pe(l,s),u=ye(l,n,s).frame;this.cancelGesture?.(),this.cancelGesture=$n(a,this.gestureCanvas(n),i,{elementId:r,frame:u,handle:o},{onFrame:(c,h,g)=>{this.mutate(y=>{d?Xa(y,c,n,h):ge(y,n,c,{frame:h})},`tap-box-${c}-${n}`),g&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let n=this.draft,i=!!n?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Xo(this.panelWidth,this.colLeft,this.colRight);return p`
      <header>
        <h1><span class="mark">${N("watch")}</span>Wrist Assistant</h1>
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
              ${Ji(r)} (${r.complication_count})</option>`)}
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
            <div class="banner warn"><b>Update the watch app first.</b> ${Rr(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count??0} complication${this.selectedOwner?.complication_count===1?"":"s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`}pickerRows(){return[...this.records.map(i=>({slot:Number(i.document?.slotIndex??0),kind:"record",record:i})),...this.occupied.map(i=>i.kind==="custom"?{slot:i.slot,kind:"locked",name:i.name||"Unnamed complication",badge:i.home||"Other home",title:`A complication on ${i.home?`the ${i.home} home`:"another home"}${i.families?.length?` (${i.families.map(U).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:i.families??[]}:{slot:i.slot,kind:"locked",name:i.name||"Unnamed preset",badge:"iPhone",title:"An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",families:[]})].sort((i,a)=>i.slot-a.slot)}shapeDots(n){return p`<span class="shape-dots">${ht.map(i=>p`<span class="shape-dot ${i} ${n.includes(i)?"on":""}" title=${U(i)}></span>`)}</span>`}renderPicker(){let n=this.draft,i=this.records.find(s=>s.id===this.selectedId),a=n?n.config.name.trim()||"Untitled":"No complication",r=n?n.config.supportedFamilies:[],o=this.pickerRows(),l=this.freeSlot();return p`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(r)}
        <span class="pk-name">${a}</span>
        ${i?p`<span class="pk-rev">r${i.revision}</span>`:n&&n.baseRevision===null?p`<span class="pk-rev">unsaved</span>`:f}
        ${N("chevron")}
      </button>
      ${this.pickerOpen?p`<div class="menu" role="listbox">
        ${o.length===0&&!(n&&n.baseRevision===null)?p`<div class="empty">No complications for this watch yet.</div>`:f}
        ${o.map(s=>s.kind==="record"?p`<button class="row" role="option" aria-current=${s.record.id===this.selectedId?"true":"false"}
              @click=${()=>{this.togglePicker(!1),this.selectRecord(s.record)}}>
              ${this.shapeDots(gc(s.record))}
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
            ${N("plus")}<span class="pk-name">New complication</span>${l<0?p`<span class="pk-badge">watch is full</span>`:f}
          </button>
          ${this.newShapeChooser&&l>=0?p`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${ht.map(s=>p`<button class="small ${s==="rectangular"?"primary":""}" @click=${()=>{this.togglePicker(!1),this.createNew(s)}}>${U(s)}</button>`)}
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
                ${i.map(a=>p`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Ji(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:p`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?p`<div class="err">${this.moveError}</div>`:f}
    </div>`}renderAddLayer(){let n=this.draft?.config;if(!n||!this.canEdit)return f;let i=n.elements.length>=64;return p`<div class="card">
      <h2 class="panel-title"><span class="swatch">${N("plus")}</span>Add a layer</h2>
      <div class="add-grid">
        ${Er.map(a=>p`<button class="add" style=${`--k:${te[a]}`} ?disabled=${i} title=${`Add a blank ${ft[a].toLowerCase()} layer`}
          @click=${()=>{let r=Pe(a);this.mutate(o=>{o.elements.push(r)}),this.inspect={kind:"layer",id:r.payload.id}}}>${N(a)}<span>${ft[a]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${Rn.map(a=>p`<button class="preset" title=${a.blurb}
          ?disabled=${n.elements.length+a.layerCount>64}
          @click=${()=>this.openPreset(a.kind)}>${a.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`}isGroupId(n){return this.draft?.config.groups?.some(i=>i.id===n)===!0}reorderLayer(n,i,a,r=!1){n!==i&&this.mutate(o=>{let l=o.elements.filter(y=>!pe(o,y)),s=o.elements.filter(y=>pe(o,y)),d=[...l].reverse(),u=d.find(y=>y.payload.id===i);if(!u)return;let c=o.groups?.find(y=>y.id===n),h=c?d.filter(y=>y.payload.groupId===c.id):d.filter(y=>y.payload.id===n);if(h.length===0||h.includes(u))return;d=d.filter(y=>!h.includes(y));let g;if((c||r)&&u.payload.groupId!==void 0){let y=d.filter(w=>w.payload.groupId===u.payload.groupId);g=a?d.indexOf(y[0]):d.indexOf(y[y.length-1])+1}else g=d.indexOf(u)+(a?0:1);if(d.splice(g,0,...h),!c){let y=h[0],w=r?void 0:u.payload.groupId;w===void 0?delete y.payload.groupId:y.payload.groupId=w}o.elements=[...d.reverse(),...s],Ve(o),Mt(o)})}rowDrag(n,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=n,a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"),a.currentTarget.classList.add("dragging")},onEnd:a=>{this.dragId=void 0,a.currentTarget.classList.remove("dragging")},onOver:a=>{if(!this.dragId||this.dragId===n)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),l=a.clientY<o.top+o.height/2;r.classList.toggle("drop-before",l),r.classList.toggle("drop-after",!l)},onLeave:a=>{a.currentTarget.classList.remove("drop-before","drop-after")},onDrop:a=>{a.preventDefault();let r=a.currentTarget,o=r.classList.contains("drop-before");r.classList.remove("drop-before","drop-after"),this.dragId&&this.reorderLayer(this.dragId,n,o),this.dragId=void 0}}}clickRow(n,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(n);return}if(Yo(i)){this.togglePick(n),this.pickAnchor=n;return}this.multi=new Set,this.inspect={kind:"layer",id:n},this.pickAnchor=n}pickRange(n){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===n){this.togglePick(n);return}let r=[...i.elements].filter(s=>!pe(i,s)).reverse().map(s=>s.payload.id),o=r.indexOf(a),l=r.indexOf(n);if(o<0||l<0){this.togglePick(n);return}this.multi=new Set(r.slice(Math.min(o,l),Math.max(o,l)+1))}togglePick(n){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==n&&i.add(this.inspect.id),i.has(n)?i.delete(n):i.add(n),this.multi=i}groupPicked(){let n=[...this.multi],i;this.mutate(a=>{i=ti(a,n)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let n=this.draft?.config;if(!n)return f;let i=this.canEdit,a=this.canvasFamily,r=(v,C)=>this.mutate(I=>{let O=I.elements.filter(E=>!pe(I,E)),S=I.elements.filter(E=>pe(I,E)),A=O.findIndex(E=>E.payload.id===v),P=A+C;if(A<0||P<0||P>=O.length)return;[O[A],O[P]]=[O[P],O[A]];let G=O[P],R=O[A];G.payload.groupId!==R.payload.groupId&&(R.payload.groupId===void 0?delete G.payload.groupId:G.payload.groupId=R.payload.groupId),I.elements=[...O,...S],Ve(I),Mt(I)}),o=v=>{let C;this.mutate(I=>{C=Qa(I,v)}),C&&(this.inspect={kind:"layer",id:C})},l=v=>{this.mutate(C=>ci(C,v)),this.inspect.kind==="layer"&&this.inspect.id===v&&(this.inspect={kind:"general"})},s=[...n.elements].filter(v=>!pe(n,v)).reverse(),d=re(this.host()),u=new Me(this.buildContext(),this.draft?.config),c=n.perFamily[this.activeFamily],h=this.inspect.kind==="family",g=this.activeFamily==="inline"?"one line of text":`${c?.backgroundColorHex?we(c.backgroundColorHex):"transparent"} \xB7 ${c?.borderColorHex?`${c.borderWidth} pt border`:"no border"}`,y=[...this.multi].filter(v=>n.elements.some(C=>C.payload.id===v)).length,w=bi(n,this.buildContext(),this.forced)[a],x=v=>w?p`<span class="thumb">${xr(w,v,{icons:this.icons,imageSizes:this.imageSizes,width:qi,height:jo})}</span>`:p`<span class="thumb"></span>`,T=(v,C)=>{let I=v.payload.id,O=this.inspect.kind==="layer"&&this.inspect.id===I,S=ye(n,a,v),A=v.payload.isHidden||S.isHidden,P=ve(n,I)[0],G=Ot(v.payload.rules),R=this.picking&&this.pickHoverId===I,E=this.rowDrag(I,i);return p`<div class="layer ${O?"hl":""} ${R?"pick":""} ${A?"dim":""} ${this.multi.has(I)?"multi":""} ${C?"kid":""}"
        style=${`--k:${te[v.kind]}`} tabindex="0" draggable=${E.draggable}
        @pointerenter=${()=>{this.listHoverIds=[I]}}
        @pointerleave=${()=>this.leaveRow([I])}
        @click=${_=>this.clickRow(I,_)}
        @keydown=${_=>{_.key==="Enter"&&(this.inspect={kind:"layer",id:I})}}
        @dragstart=${E.onStart} @dragend=${E.onEnd} @dragover=${E.onOver} @dragleave=${E.onLeave} @drop=${E.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${N("grip")}</span>
        <span class="bar"></span>
        ${x([I])}
        <span class="name">
          <b>${$e(v,d)}</b>
          <small><span class="kind">${ft[v.kind]}</span> · ${wc(v,u,this.historySeries)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${P?p`<span class="badge tap" title=${`Tappable \xB7 ${$e(P,d)}`}>tap</span>`:f}
            ${v.payload.rules.length===0?f:p`<span class="badge states" title=${G}>${G.replace(/\.$/,"").toLowerCase()}</span>`}
            ${A?p`<span class="badge">hidden</span>`:f}
          </span>
          ${i?p`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${_=>{_.stopPropagation(),r(I,1)}}>${N("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${_=>{_.stopPropagation(),r(I,-1)}}>${N("down")}</button>
            <button class="icon" title=${S.isHidden?`Show in ${U(a)}`:`Hide in ${U(a)}`} aria-label=${S.isHidden?"Show this layer":"Hide this layer"} @click=${_=>{_.stopPropagation(),this.mutate(J=>ge(J,a,I,{isHidden:!S.isHidden}))}}>${N(S.isHidden?"hide":"show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${_=>{_.stopPropagation(),o(I)}}>${N("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${_=>{_.stopPropagation(),l(I)}}>${N("delete")}</button>
          </span>`:f}
        </span>
      </div>`},$=(v,C)=>{let I=this.inspect.kind==="group"&&this.inspect.id===v.id,O=!this.collapsed.has(v.id),S=this.rowDrag(v.id,i),A=C[0],P=C[C.length-1],G=["drop-before","drop-into","drop-after"],R=_=>{let J=_.currentTarget.getBoundingClientRect(),X=(_.clientY-J.top)/J.height;return X<.25?"drop-before":!O&&X>.75?"drop-after":"drop-into"},E=C.map(_=>_.payload.id);return p`<div class="layer group ${I?"hl":""}" style=${`--k:${Y.group}`} tabindex="0" draggable=${S.draggable}
        @pointerenter=${()=>{this.listHoverIds=E}}
        @pointerleave=${()=>this.leaveRow(E)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:v.id}}}
        @keydown=${_=>{_.key==="Enter"&&(this.inspect={kind:"group",id:v.id})}}
        @dragstart=${S.onStart} @dragend=${S.onEnd}
        @dragover=${_=>{if(!this.dragId||this.dragId===v.id)return;_.preventDefault();let J=_.currentTarget,X=R(_);for(let be of G)J.classList.toggle(be,be===X)}}
        @dragleave=${_=>{_.currentTarget.classList.remove(...G)}}
        @drop=${_=>{_.preventDefault();let J=_.currentTarget,X=R(_);J.classList.remove(...G);let be=this.dragId;if(this.dragId=void 0,!(!be||!A||!P)){if(X==="drop-before"){this.reorderLayer(be,A.payload.id,!0,!0);return}if(X==="drop-after"){this.reorderLayer(be,P.payload.id,!1,!0);return}this.isGroupId(be)||(this.reorderLayer(be,A.payload.id,!0),this.mutate(Zo=>ni(Zo,be,v.id)))}}}>
        <button class="chev" aria-expanded=${O?"true":"false"} title=${O?"Fold the group":"Unfold the group"}
          @click=${_=>{_.stopPropagation();let J=new Set(this.collapsed);O?J.add(v.id):J.delete(v.id),this.collapsed=J}}>${N("chevron")}</button>
        <span class="bar"></span>
        ${x(C.map(_=>_.payload.id))}
        <span class="name">
          <b>${v.name}</b>
          <small><span class="kind">Group</span> · ${C.length} layer${C.length===1?"":"s"} · ${v.locked?"moves as one":"unlocked"}</small>
        </span>
        <span class="right">
          ${i?p`<span class="acts">
            <button class="icon" title="Ungroup: keep the layers, drop the folder" aria-label="Ungroup" @click=${_=>{_.stopPropagation(),this.mutate(J=>rn(J,v.id)),I&&(this.inspect={kind:"general"})}}>${N("ungroup")}</button>
          </span>`:f}
          <button class="icon lockbtn ${v.locked?"on":""}" ?disabled=${!i}
            title=${v.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone. Click to lock."}
            aria-label=${v.locked?"Unlock the group":"Lock the group"}
            @click=${_=>{_.stopPropagation(),this.mutate(J=>{let X=J.groups?.find(be=>be.id===v.id);X&&(X.locked=!X.locked)})}}>${N(v.locked?"lock":"unlock")}</button>
        </span>
      </div>`},m=[],b=new Set;for(let v=0;v<s.length;v++){let C=s[v],I=C.payload.groupId,O=I===void 0?void 0:n.groups?.find(A=>A.id===I);if(!O){m.push(T(C,!1));continue}if(b.has(O.id))continue;b.add(O.id);let S=s.filter(A=>A.payload.groupId===O.id);m.push($(O,S)),this.collapsed.has(O.id)||m.push(p`<div class="group-kids">${S.map(A=>T(A,!0))}</div>`)}return p`<div class="card">
      <h2 class="panel-title"><span class="swatch">${N("layers")}</span>Layers<span class="spacer"></span><span class="mini">top draws last</span></h2>
      ${this.activeFamily==="inline"?p`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${U(a)} shape.</div>`:f}
      ${y>=2&&i?p`<div class="group-cta"><span>${y} layers picked</span><span class="spacer"></span>
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:n.elements.length>=2&&i&&!n.groups?.length?p`<div class="hint">${Jo}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one.</div>`:f}
      ${n.elements.length===0?p`<div class="empty">No layers yet. Add one above.</div>`:f}
      <div class="layers">
      ${m}
      <div class="layer pinned ${h?"hl":""}" style=${`--k:${Y.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${v=>{v.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${v=>{this.dragId&&(v.preventDefault(),v.currentTarget.classList.add("drop-before"))}}
        @dragleave=${v=>{v.currentTarget.classList.remove("drop-before")}}
        @drop=${v=>{v.preventDefault(),v.currentTarget.classList.remove("drop-before");let C=this.dragId,I=[...s].reverse().find(O=>O.payload.id!==C&&O.payload.groupId!==C);C&&I&&this.reorderLayer(C,I.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${N("shape")}</span>
        <span class="bar"></span>
        ${x([])}
        <span class="name">
          <b>${this.activeFamily==="inline"?"Inline text":`${U(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily==="inline"?"Inline":"Background"}</span> · ${g}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`}renderPresetDialog(){let n=this.presetKind?Vo(this.presetKind):void 0,i=this.presetEntity;return p`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${n===void 0?f:p`
        <h2>${n.title}</h2>
        <div class="hint">${n.blurb}</div>
        ${De(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Uo,{compact:!0,...n.domains?{domain:n.domains}:{},...n.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(n){this.canEdit&&(this.presetKind=n,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let n=this.renderRoot.querySelector("dialog.preset-dialog");n?.open?n.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let n=this.presetKind,i=this.presetEntity;if(!n||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.mutate(l=>{o=Go(l,n,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return p`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let n=this.draft?.config;if(!n)return p`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=bi(n,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return p`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${o=>{this.previewCase=o.target.value}}>
            ${zt.map(o=>p`<option value=${o.label} ?selected=${o.label===a.label}>${o.label}${o.measured?"":" (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${Pt.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}${this.renderZoomButton()}</span>
      </div>
      <div class="stage">
        ${r==="inline"?this.renderInlinePreview(i.inline,!1):this.renderBigPreview(r,i,a)}
        ${this.renderUnder(n,r)}
      </div>
      ${this.zoomed&&r!=="inline"?this.renderZoomDialog(r,i,a):f}
      <div class="strip">
        ${this.renderSettingsRow(n)}
        ${this.renderShapesRow(n,i)}
        ${this.renderValuesRow()}
      </div>
    </div>`}renderBigPreview(n,i,a){let r=i[n];if(!r)return f;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,l=this.draft?.config,s=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&l?Ne(l,o)?.id:void 0,d=l&&s!==void 0&&(this.inspect.kind==="group"||Ne(l,o)?.locked)?Oe(l,s).map(y=>y.payload.id):[],u=[...new Set([...d,...this.multi])],c=a.slots[n],h=this.focusTapId(),g={icons:this.icons,imageSizes:this.imageSizes,showHidden:!0,tapAreas:!0,slot:c,highlightId:h??o,...u.length>0&&!this.showTaps?{highlightIds:u}:{},tapReview:this.showTaps,...h!==void 0?{tapFocusId:h}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||h!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:this.listHoverIds.length>0?{hoverIds:this.listHoverIds}:{},...this.timestampActiveId!==void 0&&this.timestampActiveId===o&&!this.showTaps&&!this.picking?{timestampActiveId:this.timestampActiveId}:{}};return p`<div class="preview ${n} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(n,y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${Ei(r,g)}
    </div>`}renderUnder(n,i){let a=re(this.host()),r=this.inspect,o=r.kind==="layer"?n.elements.find(c=>c.payload.id===r.id):void 0,l;if(this.showTaps)l=p`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Ae(n.tapAction)}</b>.`;else if(this.picking)l="Point at a layer and click it. Escape stops.";else if(i==="inline")l="One line of text. Edit it on the right.";else if(r.kind==="group"){let c=n.groups?.find(g=>g.id===r.id),h=c?Oe(n,c.id).length:0;l=c?p`editing group <b>${c.name}</b>. ${c.locked?`Drag to move all ${h} layers.`:"Unlocked: each layer drags alone."}`:""}else if(o){let c=Ne(n,o.payload.id);l=c?.locked?p`editing <b>${$e(o,a)}</b> in <b>${c.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:p`editing <b>${$e(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`}else l="click a layer to edit it";if(i==="inline")return p`<div class="under"><b>Inline</b> · ${l}</div>`;let s=this.currentCase().slots[i],d=pn(s,i),u=Math.round(d.scale*100);return p`<div class="under"><b>${U(i)}</b> · ${s.width} × ${s.height} pt${u!==100?` \xB7 ${u}%`:""} · ${l}</div>`}renderInlinePreview(n,i){let a;if(!n)a=p`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=n.countdownEnd!==void 0&&n.countdownEnd>r?pt((n.countdownEnd-r)/1e3):n.text,l=n.symbol?this.icons.render(n.symbol,i?11:15,"#FFFFFF"):void 0;a=p`<div class="inline-line">${l??f}<span>${n.label?`${n.label}: `:""}${o}</span></div>`}return i?a:p`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSettingsRow(n){let i=this.host(),a=this.records.find(u=>u.id===this.selectedId),r=this.selectedOwner,o=[a?`Revision ${a.revision}`:"Not saved yet",r?Ji(r):void 0].filter(Boolean).join(" \xB7 "),l=n.values,s=new Me(this.buildContext(),this.draft?.config),d=re(i);return p`<div class="strip-row" style=${`--c:${Y.complication}`} @change=${()=>this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${N("watch")}</span>Complication<span class="spacer"></span><span class="mini">${o}</span>
        <button class="small" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?p`
          <button class="small" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?p`<button class="danger small" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="small" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:p`<button class="danger small" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:f}
      </h2>
      <div class="settings" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}>${ko(i)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit?p`<button class="small" @click=${()=>{let u=Eo();this.mutate(c=>{c.values.push(u)}),this.inspect={kind:"data",id:u.id}}}>Add</button>`:f}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${l.length===0?p`<p class="empty">No shared values yet.</p>`:p`<div class="data">
        ${l.map(u=>{let c=s.resolve({kind:{kind:"named",id:u.id}}),h=this.inspect.kind==="data"&&this.inspect.id===u.id;return p`<div class="datum ${h?"hl":""}" @click=${()=>{this.inspect={kind:"data",id:u.id}}}>
            <span class="name">${u.name||"(unnamed)"}</span>
            <span class="meta ${c===void 0?"none":""}" title=${le(u.value,d)}>${c??"unresolved"}</span>
            ${this.canEdit?p`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(y=>{y.values=y.values.filter(w=>w.id!==u.id)}),h&&(this.inspect={kind:"general"})}}>${N("delete")}</button>`:f}
          </div>`})}
        </div>`}
      </div>
    </div>`}openRaw(){this.showRaw=!0;let n=this.renderRoot.querySelector("details.foot");n&&(n.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapesRow(n,i){let a=n.supportedFamilies;return p`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${Y.place}`}><span class="swatch">${N("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${ht.map(r=>{if(!a.includes(r))return p`<button class="tile off ${r}" ?disabled=${!this.canEdit} title=${`Add the ${U(r)} shape`} @click=${()=>this.addShape(r)}>
              <span class="art"><span class="ghost ${r}"></span></span>
              <span class="lbl">+ Add ${U(r)}</span>
            </button>`;let l=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?Ei(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Pt.slots[r]}):f}let d=r!=="inline"&&n.elements.every(c=>ye(n,r,c).isHidden||c.payload.isHidden)&&n.elements.length>0,u=this.canEdit&&mt(n,r);return p`<div class="tile-wrap">
            <button class="tile ${r}" aria-pressed=${l?"true":"false"} title=${`Edit the ${U(r)} shape`}
              @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
              <span class="art">${s}</span>
              <span class="lbl">${U(r)}${d?p`<small>· nothing shown</small>`:f}${l?p`<small>· editing</small>`:f}</span>
            </button>
            ${this.canEdit?p`<button class="icon danger tile-x" ?disabled=${!u}
              title=${u?`Remove the ${U(r)} shape`:"The only shape. Add another before removing it."}
              aria-label=${`Remove the ${U(r)} shape`}
              @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${N("delete")}</button>`:f}
          </div>`})}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`}renderValuesRow(){let n=this.draft?.config;if(!n)return f;let i=[...this.compiled?.entities.keys()??[]],a=this.testValues.size>0;return p`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${Y.states}`}><span class="swatch">${N("states")}</span>Values on the watch<span class="spacer"></span>
        ${a?p`<span class="testing-pill">Testing with your values <button @click=${()=>{this.testValues=new Map,this.editingValue=void 0}}>Back to live</button></span>`:f}
      </h2>
      ${i.length===0?p`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:p`<div class="chips values">
        ${i.map(r=>{let o=this.hass.states[r],l=typeof o?.attributes.friendly_name=="string"?o.attributes.friendly_name:r,s=typeof o?.attributes.unit_of_measurement=="string"?` ${o.attributes.unit_of_measurement}`:"",d=o?`${o.state}${s}`:"not in Home Assistant",u=this.testValues.get(r),h=n.elements.find(y=>sn(n,y.payload.id).some(w=>w.ref.entityId===r))?.kind??"text",g=this.editingValue===r;return p`<button class="vchip ${u!==void 0?"testing":""}" style=${`--k:${te[h]}`}
            title=${u!==void 0?`Live value: ${d}. Click to change the test value.`:"Click to try a different value"}
            @click=${y=>{y.target.tagName!=="INPUT"&&(this.editingValue=r,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input")?.focus()))}}>
            <span class="dom">${N(h)}</span><b>${l}</b>
            ${g?p`<input type="text" .value=${u??o?.state??""} aria-label=${`Test value for ${l}`}
                  @keydown=${y=>{y.key==="Enter"&&y.target.blur(),y.key==="Escape"&&(this.editingValue=void 0)}}
                  @blur=${y=>this.commitTestValue(r,y.target.value)} />`:p`<span class="val">${u!==void 0?`${u}${s}`:d}</span>`}
          </button>`})}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`}commitTestValue(n,i){this.editingValue=void 0;let a=i.trim(),r=new Map(this.testValues),o=this.hass.states[n]?.state;a===""||a===o?r.delete(n):r.set(n,a),this.testValues=r}currentCase(){return zt.find(n=>n.label===this.previewCase)??Pt}previewSlot(n){return this.currentCase().slots[n]}crumbs(n,i){let a=this.inspect,r=n.name.trim()||"Complication",o=this.activeFamily==="inline"?"Inline":U(this.activeFamily),l=a.kind==="family"&&i===void 0?p`<span class="here" style=${`--k:${Y.place}`}>${o} shape</span>`:p`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,s=f,d=f;if(i!==void 0)s=p`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${i} layers</span>`;else if(a.kind==="layer"){let u=n.elements.find(c=>c.payload.id===a.id);if(u){s=p`<span class="here" style=${`--k:${te[u.kind]}`}><span class="kchip">${ft[u.kind]}</span>${$e(u,re(this.host()))}</span>`;let c=Ne(n,u.payload.id);c&&(d=p`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:c.id}}} title="Edit the group">${c.name}</button>`)}}else if(a.kind==="group"){let u=n.groups?.find(c=>c.id===a.id);u&&(s=p`<span class="here" style=${`--k:${Y.group}`}><span class="kchip">Group</span>${u.name}</span>`)}else if(a.kind==="data"){let u=n.values.find(c=>c.id===a.id);u&&(s=p`<span class="here" style=${`--k:${Y.complication}`}><span class="kchip">Value</span>${u.name||"(unnamed)"}</span>`)}else a.kind==="general"&&(s=p`<span class="mini">nothing selected</span>`);return p`<div class="crumbs">
      <span>${r}</span><span class="sep">›</span>${l}${d}
      ${s===f?f:p`<span class="sep">›</span>${s}`}
    </div>`}pickedElements(n){return this.multi.size<2?[]:n.elements.filter(i=>this.multi.has(i.payload.id))}renderInspector(){let n=this.draft?.config;if(!n)return f;let i=this.pickedElements(n);if(i.length>=2)return p`
        <div class="insp-head">${this.crumbs(n,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(n,i)}</div>`;let a=this.host(),r=this.inspect,o=f,l=!0;if(r.kind==="layer"){let d=n.elements.find(u=>u.payload.id===r.id);if(!d)return this.inspect={kind:"general"},f;o=Fo(a,d,this.canvasFamily)}else if(r.kind==="group"){let d=n.groups?.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=Io(a,d)}else if(r.kind==="data"){let d=n.values.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},f;l=!1,o=p`<div class="sec" data-open="true" style=${`--c:${Y.complication}`}>
        <div class="sec-h"><span class="swatch">${N("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${So(a,d)}</div>
      </div>`}else r.kind==="family"?o=Ao(a,this.activeFamily):(l=!1,o=p`<div class="empty-insp">${N("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`);let s=this.openSections.size>1;return p`
      <div class="insp-head">
        ${this.crumbs(n)}
        ${l?p`<button class="expand" @click=${()=>{this.openSections=s?new Set([fc(r)]):new Set(Oi)}}>${s?"One at a time":"Open all"}</button>`:f}
      </div>
      <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"} @change=${()=>this.draft?.endGesture()}>${o}</div>`}triCheck(n,i,a){return p`<label class="field check">
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} />
      <span>${n}${i==="mixed"?p` <span class="mixed">(mixed)</span>`:f}</span></label>`}multiEditor(n,i){let a=this.canvasFamily,r=re(this.host()),o=new Me(this.buildContext(),this.draft?.config),l=To(n,a,i),s=i.length,d=[...i].reverse(),u=g=>this.mutate(y=>{for(let w of i)ge(y,a,w.payload.id,{isHidden:g})}),c=g=>this.mutate(y=>{for(let w of i){let x=y.elements.find(T=>T.payload.id===w.payload.id);x&&(x.payload.isHidden=g)}}),h=g=>this.mutate(y=>{for(let w of i){let x=y.elements.find(T=>T.payload.id===w.payload.id);x&&x.kind!=="image"&&x.kind!=="tap"&&(x.payload.colorSlot.baseColorHex=g)}},"multi-colour");return p`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${N("layers")}</span>
          <span class="tt"><h4>${s} layers picked</h4><span class="sum">Edits here land on all ${s}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${d.map(g=>p`<div class="row" style=${`--k:${te[g.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${g.kind==="icon"?p`<span class="glyph">${this.icons.render(o.resolve(g.payload.symbol)??"questionmark",16,g.payload.colorSlot.baseColorHex)??f}</span>`:f}
                <b>${$e(g,r)}</b><span class="kind">${ft[g.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${Jo}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${Y.place}`}>
        <div class="sec-h"><span class="swatch">${N("place")}</span>
          <span class="tt"><h4>All ${s} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${U(a)}`,l.hiddenHere,u)}
          ${this.triCheck("Hidden in every shape",l.hiddenEverywhere,c)}
          ${l.colourable?p`${ae("Colour",l.colour,g=>{g!==void 0&&h(g)})}
              ${l.colour===void 0?p`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>`:f}`:p`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`}renderFooter(){let n=this.draft;if(!n)return f;let i=this.records.find(r=>r.id===this.selectedId),a=Lr({revision:i?.revision??null,dirty:n.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return p`<details class="foot">
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
    </details>`}};L([lt({attribute:!1})],H.prototype,"hass",2),L([lt({type:Boolean})],H.prototype,"narrow",2),L([lt({attribute:!1})],H.prototype,"panel",2),L([z()],H.prototype,"colLeft",2),L([z()],H.prototype,"colRight",2),L([z()],H.prototype,"panelWidth",2),L([z()],H.prototype,"owners",2),L([z()],H.prototype,"ownerId",2),L([z()],H.prototype,"records",2),L([z()],H.prototype,"selectedId",2),L([z()],H.prototype,"draft",2),L([z()],H.prototype,"readOnlyReason",2),L([z()],H.prototype,"parseError",2),L([z()],H.prototype,"maxSchemaVersion",2),L([z()],H.prototype,"presets",2),L([z()],H.prototype,"occupied",2),L([z()],H.prototype,"serverToken",2),L([z()],H.prototype,"appliedToken",2),L([z()],H.prototype,"polling",2),L([z()],H.prototype,"sendPending",2),L([z()],H.prototype,"pages",2),L([z()],H.prototype,"templateResults",2),L([z()],H.prototype,"historySeries",2),L([z()],H.prototype,"templateError",2),L([z()],H.prototype,"templateFetchedAt",2),L([z()],H.prototype,"forced",2),L([z()],H.prototype,"showRaw",2),L([z()],H.prototype,"inspect",2),L([z()],H.prototype,"openSections",2),L([z()],H.prototype,"pickerOpen",2),L([z()],H.prototype,"testValues",2),L([z()],H.prototype,"editingValue",2),L([z()],H.prototype,"multi",2),L([z()],H.prototype,"collapsed",2),L([z()],H.prototype,"activeFamily",2),L([z()],H.prototype,"picking",2),L([z()],H.prototype,"pickHoverId",2),L([z()],H.prototype,"listHoverIds",2),L([z()],H.prototype,"zoomed",2),L([z()],H.prototype,"showTaps",2),L([z()],H.prototype,"timestampActiveId",2),L([z()],H.prototype,"savedName",2),L([z()],H.prototype,"presetKind",2),L([z()],H.prototype,"presetEntity",2),L([z()],H.prototype,"newShapeChooser",2),L([z()],H.prototype,"previewCase",2),L([z()],H.prototype,"loadError",2),L([z()],H.prototype,"saveError",2),L([z()],H.prototype,"saving",2),L([z()],H.prototype,"conflict",2),L([z()],H.prototype,"remoteRevision",2),L([z()],H.prototype,"confirmDelete",2),L([z()],H.prototype,"moveTarget",2),L([z()],H.prototype,"moving",2),L([z()],H.prototype,"moveError",2),L([z()],H.prototype,"version",2);function Be(e){return String(e?.message??e)}function xc(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let t=e.split(":").map(n=>Number(n));if(!(t.length===0||t.length>3||t.some(n=>Number.isNaN(n))))return t.reduce((n,i)=>n*60+i,0)}function Ji(e){let t=e.device_name??e.owner_watch_id;return e.paired_iphone_name?`${t} (${e.paired_iphone_name})`:t}function wc(e,t,n){switch(e.kind){case"text":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.fontSize} pt`;case"icon":return`${e.payload.size} pt \xB7 ${we(e.payload.colorSlot.baseColorHex)}`;case"gauge":return`${t.resolve(e.payload.value)??"--"} \xB7 ${e.payload.style}`;case"chart":{let i=Je(e.payload),a=i!==void 0?n.get(i)??"":t.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${_t(a).length} values`}case"shape":return`${we(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return`${e.payload.contentMode==="fill"?"fill":"fit"} \xB7 ${e.payload.timestamp?"time shown":"no time"}`;case"tap":return Ae(e.payload.action)}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",H);export{H as WristAssistantPanel,Xo as columnFit};
